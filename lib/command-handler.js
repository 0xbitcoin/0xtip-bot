

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

        var existingTipAccount = await this.mongoInterface.findOne('funding_account',{discordId:discordId})

         
        if(existingTipAccount == null || existingTipAccount.length < 1)
        {

          var newAccount = this.web3.eth.accounts.create();

          var accountData = {
            discordId: discordId,
            publicAddress: newAccount.address,
            privateKey:newAccount.privateKey
          }


          existingTipAccount = await this.mongoInterface.upsertOne('funding_account',{discordId:discordId},accountData)
        }

        var tipAccount = await this.mongoInterface.findOne('funding_account',{discordId:discordId})



        message.channel.send(
          'Funding account:'+ tipAccount.publicAddress + '\n' +
          'Balance:' + '?'
        );
      }


      if(command === "receive") {  //sets personal receiving address


        message.channel.send('handling command:'+command.toString());
      }

      if(command === "tipuser") {


        message.channel.send('handling command:'+command.toString());
      }


    }


}
