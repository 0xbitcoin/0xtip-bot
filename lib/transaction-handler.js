
const LavaUtils = require('./lava-utils')
var deployedContractInfo = require('../app/assets/contracts/DeployedContractInfo.json')

const TransactionHandler = require('./transaction-handler')

var tokenAddress = deployedContractInfo.networks.mainnet.contracts._0xbitcointoken.blockchain_address;

module.exports =  {

    init(web3,mongoInterface)
    {
      this.web3 = web3;
      this.mongoInterface = mongoInterface;

    },

    async sendTip(tipAccount,receiveAddress,tipAmount)
    {
     console.log('sending tip ');

     //make sure the tipper has enough funds in their lava balance


     //determine a good lava relaying fee from a relayer (improve this later)


     



     return {success:true,message:"success"};
    },

}
