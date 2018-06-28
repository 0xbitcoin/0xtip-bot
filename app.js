
var INFURA_ROPSTEN_URL = 'https://ropsten.infura.io/gmXEVo5luMPUGPqg6mhy';
var INFURA_MAINNET_URL = 'https://mainnet.infura.io/gmXEVo5luMPUGPqg6mhy';


var Web3 = require('web3')

var web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider(INFURA_MAINNET_URL))

const mongoInterface = require('./lib/mongo-interface')
const commandHandler = require('./lib/command-handler')
const discordInterface = require('./lib/discord-interface');

const config = require("./config.json");



async function init()
{
  mongoInterface.init();
  commandHandler.init(web3,mongoInterface);
  discordInterface.init(config,async function(command,args,message){
      await commandHandler.handle(command,args,message);
  });

}


init();
