
const LavaUtils = require('./lava-utils')
var deployedContractInfo = require('../app/assets/contracts/DeployedContractInfo.json')

const TransactionHandler = require('./transaction-handler')

var tokenAddress = deployedContractInfo.networks.mainnet.contracts._0xbitcointoken.blockchain_address;

const accountsConfig = require("../account.config.js");

var activityUpdater;

module.exports =  {

    init(web3,mongoInterface)
    {
      this.web3 = web3;
      this.mongoInterface = mongoInterface;

      TransactionHandler.init(web3,mongoInterface)

    },

    async handle(command,args,message)
    {
      console.log('handle command: ', command )

    //  console.log(message.author)

      if(command === "help") {


        message.channel.send(
          'Tipbot Commands:\n\n'+
          '"/tipbot funds" - Generates and displays your funding wallet\n'+
          '"/tipbot receive X" - Set a personal public address X for receiving tips\n'+
          '"/tipbot tip Y Z" - Send a tip of amount Z to a user by their discord name Y'

      );
      }


      if(command === "funds") {  //reports  balance and funding account

        //check to see if this discord user has a key pair. if not, generate one. return it.
        var discordId = message.author.id;

        var username = message.author.username;
        var discriminator = message.author.discriminator;

        var combinedName = "@"+username+"#"+discriminator;


        await this.updateUserDetails(discordId,username,discriminator,combinedName);


        var existingTipAccount = await this.mongoInterface.findOne('funding_account',{discordId:discordId})


        if(existingTipAccount == null)
        {

          var botPKey = accountsConfig.accounts.mainnet.privateKey;

          var calculatedPKey = this.web3.utils.sha3(botPKey + discordId)

          var newAccount = this.web3.eth.accounts.privateKeyToAccount(calculatedPKey);

          //var newAccount = this.web3.eth.accounts.create();

          var accountData = {
            discordId: discordId,
            publicAddress: newAccount.address,
            privateKey:newAccount.privateKey
          }

           await this.mongoInterface.upsertOne('funding_account',{discordId:discordId},accountData)

        }


        var existingAccounts = await this.mongoInterface.findAll('funding_account' )


        if(activityUpdater != null && existingAccounts)
        {
          activityUpdater('Serving ' + existingAccounts.length + ' users.');
        }


        var tipAccount = await this.mongoInterface.findOne('funding_account',{discordId:discordId})


        //get lava balance
        var lavaBalance = await LavaUtils.getLavaTokenBalance(this.web3,tokenAddress,tipAccount.publicAddress)

        message.channel.send(
          username + '\'s funding account:\n'+ tipAccount.publicAddress + '\n' +
          'Lava Balance (0xBTC): ' + lavaBalance
        );
      }


      if(command === "receive") {  //sets personal receiving address

        var discordId = message.author.id;
        var username = message.author.username;
        var discriminator = message.author.discriminator;
        var combinedName = "@"+username+"#"+discriminator;

        var publicAddress = args[0];

        await this.updateUserDetails(discordId,username,discriminator,combinedName);


        if(!this.web3.utils.isAddress(publicAddress))
        {
          message.channel.send('Not a valid eth address: '+publicAddress.toString());
          return;
        }

        var accountData = {
          discordId: discordId,
          receiveAddress: publicAddress
        }

        await this.mongoInterface.upsertOne('receive_account',{discordId:discordId},accountData)

        message.channel.send('Set '+ username +'\'s receive address: '+publicAddress.toString());
      }

      if(command === "tip") {

        var mentionedUsers = message.mentions.users;

        var discordId = message.author.id;


        var tipAccount = await this.mongoInterface.findOne('funding_account',{discordId:discordId})

        if( tipAccount == null )
        {
          message.channel.send('You have not created a Funds Account with the tipbot yet.' );
          return;
        }

        var recipientIdRaw = args[0];
        var recipientId = recipientIdRaw.replace(/[^0-9]/g, ''); //remove non numbers

        var recipientAccountData;

        for(var userdata of mentionedUsers)
        {
          if( userdata[1].id == recipientId )
          {
            recipientAccountData = userdata[1];
            console.log('found match ', userdata[1] )
          }else{
            console.log('no match ', userdata[1].username,  recipientId )
          }
        }

        //var recipientAccountData = await this.findOneAccountByCombinedName(recipientCombinedName);

        if( recipientAccountData == null   )
        {
          message.channel.send('User has no account data: '+args[0] );
          return;
        }

      //  var recipientId = recipientAccountData.discordId;

        console.log('recipientId',recipientId)
        var receiveAccount = await this.mongoInterface.findOne('receive_account',{discordId: (recipientId)})


        if( receiveAccount == null || receiveAccount.receiveAddress == null)
        {
          message.channel.send('User has no receive address: '+args[0] );
          return;
        }

        var receiveAddress = receiveAccount.receiveAddress;

        var tipAmountFloat = parseFloat(args[1]);
        var tipAmount = Math.floor(tipAmountFloat * 1e8); //satoastis




        if( tipAmount < 1 )
        {
          message.channel.send('Invalid tip amount: '+args[1].toString());
          return;
        }


        console.log('tip recipient ', args[0])
        console.log('tip recipient id ', recipientId)
        console.log('tip amount ', tipAmount)

        var response = await TransactionHandler.sendTip(tipAccount,receiveAddress,tipAmount)

        if(response.success == false)
        {
          message.channel.send('Tipping failed: '+response.message );
          return;
        }

        message.channel.send('Tipping '+args[0]+' '+tipAmount+' tokens.' );
      }


    },


    //fixes relations if someone changes their discord username
    async updateUserDetails(discordId,username,discriminator,combinedName)
    {

      var accountData = {
        discordId: discordId,
        username:username,
        discriminator:discriminator,
        combinedName:combinedName
      }

      return await this.mongoInterface.upsertOne('user_details',{discordId:discordId},accountData)
    },


    async findOneAccountByCombinedName(combinedName)
    {
      return await this.mongoInterface.findOne('user_details',{combinedName:combinedName})
    },

    registerActivityUpdater(callback)
    {
      activityUpdater = callback;
    }



}
