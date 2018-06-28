
const LavaPacketUtils = require('./lava-packet-utils')
const LavaNetworkUtils = require('./lava-network-utils')

const LavaContractUtils = require('./lava-utils')

const config = require("../config.json");

var deployedContractInfo = require('../app/assets/contracts/DeployedContractInfo.json')

const TransactionHandler = require('./transaction-handler')

var tokenAddress = deployedContractInfo.networks.mainnet.contracts._0xbitcointoken.blockchain_address;
var walletAddress = deployedContractInfo.networks.mainnet.contracts.lavawallet.blockchain_address;




module.exports =  {

    init(web3,mongoInterface)
    {
      this.web3 = web3;
      this.mongoInterface = mongoInterface;

    },

    async sendTip(tipAccount,receiveAddress,tipAmount)
    {
     console.log('sending tip from '+ JSON.stringify(tipAccount));

     tipAmount = parseInt(tipAmount);

     //determine a good lava relaying fee from a relayer (improve this later)
     var relayReward = 0.17 * 1e8;

     var totalAmount = tipAmount + relayReward;

     //make sure the tipper has enough funds in their lava balance
     var lavaBalance = await LavaContractUtils.getLavaTokenBalance(this.web3,tokenAddress,tipAccount.publicAddress)

     console.log( lavaBalance )

     if(lavaBalance < totalAmount)
     {
    //   return {success:false,message:"Insufficient funds for tip. Your balance is " + lavaBalance.toString() + "."};
     }



     //construct a lava packet and send it to the relayer
    var packet = await this.buildLavaPacket( tipAccount, receiveAddress, tipAmount, relayReward   )
    var response = await this.broadcastLavaPacket( packet )


     return {success:true,message:"success"};
    },


    async buildLavaPacket(tipAccount, receiveAddress, tipAmount, relayerReward)
    {
      var privateKey = tipAccount.privateKey;

      var addressFrom = tipAccount.publicAddress;

      console.log( addressFrom )

       var currentEthBlock = await this.web3.eth.getBlockNumber();

       console.log('eth block ',currentEthBlock)

       var method = 'withdraw';
       var from= addressFrom;
       var to= receiveAddress;
       //var walletAddress=walletAddress
       //var tokenAddress=tokenAddress
       var tokenAmount=tipAmount;
       //var relayerReward=relayReward;
       var expires= currentEthBlock + 1000;
       var nonce=this.web3.utils.randomHex(32);

       var params = LavaPacketUtils.getLavaParamsFromData(method,from,to,walletAddress,
                                  tokenAddress,tokenAmount,relayerReward,expires,nonce)

      var msgParams = {data: params}


      var signature = LavaPacketUtils.signTypedData(privateKey,msgParams);

      var packet = LavaPacketUtils.getLavaPacket(method,from,to,walletAddress,tokenAddress,
                      tokenAmount, relayerReward,expires,nonce,signature)

      return packet;

    },

    async broadcastLavaPacket(packet)
    {
      var relayURL = config.relayURL;



      await LavaNetworkUtils.broadcastPacket(packet,relayURL)

      return {success:true}
    }



}
