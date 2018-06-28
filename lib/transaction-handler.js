
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
     console.log('sending tip ')

     return true;
    },

}
