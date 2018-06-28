
const LavaUtils = require('./lava-utils')
var deployedContractInfo = require('../app/assets/contracts/DeployedContractInfo.json')


var tokenAddress = deployedContractInfo.networks.mainnet.contracts._0xbitcointoken.blockchain_address;

module.exports =  {

    init(web3,mongoInterface)
    {
      this.web3 = web3;
      this.mongoInterface = mongoInterface;

    },

    async handle(command,args,message)
    {
      console.log('handle command: ', command )

      if(command === "help") {


        message.channel.send(
          'Tipbot Commands:\n\n'+
          '"/tipbot funds" - Generates and displays your funding wallet\n'+
          '"/tipbot receive X" - Set a personal public address X for receiving tips\n'+
          '"/tipbot tipuser Y" - Send a tip to a user by their discord name Y' 

      );
      }


      if(command === "funds") {  //reports  balance and funding account

        //check to see if this discord user has a key pair. if not, generate one. return it.
        var discordId = message.author.id;

        var username = message.author.username;

        var existingTipAccount = await this.mongoInterface.findOne('funding_account',{discordId:discordId})


        if(existingTipAccount == null || existingTipAccount.length < 1)
        {

          var newAccount = this.web3.eth.accounts.create();

          var accountData = {
            discordId: discordId,
            username:username,
            publicAddress: newAccount.address,
            privateKey:newAccount.privateKey
          }


           await this.mongoInterface.upsertOne('funding_account',{discordId:discordId},accountData)
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

        var publicAddress = args[0];

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

      if(command === "tipuser") {


        message.channel.send('handling command:'+command.toString());
      }


    }


}
