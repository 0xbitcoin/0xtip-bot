


var _0xBitcoinABI = require('../app/assets/contracts/_0xBitcoinToken.json')
var lavaWalletABI = require('../app/assets/contracts/LavaWallet.json')
var deployedContractInfo = require('../app/assets/contracts/DeployedContractInfo.json')

module.exports =  {

    async  getLavaTokenBalance(web3,tokenAddress,tokenOwner)
  {
    var contract_abi = lavaWalletABI.abi;
    var contract_address = deployedContractInfo.networks.mainnet.contracts.lavawallet.blockchain_address;

    var contract = new web3.eth.Contract(contract_abi,contract_address)



    console.log('get lava token balance')

    var lavaBalance =  contract.methods.balanceOf(tokenAddress,tokenOwner).call();

    return lavaBalance;
  },

     async  getTokenBalance(web3,tokenAddress,tokenOwner)
  {
    var contract_abi = _0xBitcoinABI.abi;
    var contract_address = deployedContractInfo.networks.mainnet.contracts._0xbitcointoken.blockchain_address;

    var contract = new web3.eth.Contract(contract_abi,contract_address)

    var balance =  contract.methods.balanceOf(tokenOwner).call();



    return balance;
  }

}
