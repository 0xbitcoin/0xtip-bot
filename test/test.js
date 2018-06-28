var INFURA_MAINNET_URL = 'https://mainnet.infura.io/gmXEVo5luMPUGPqg6mhy';


var Web3 = require('web3')

var web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider(INFURA_MAINNET_URL))

const mongoInterface = require('../lib/mongo-interface')
const commandHandler = require('../lib/command-handler')
const discordInterface = require('../lib/discord-interface');

const config = require("../config.json");




var assert = require('assert');


  describe('Tip Bot', function() {



    it('init', async function() {

      mongoInterface.init();
      commandHandler.init(web3,mongoInterface);

      var response;

       var message = {
         channel: {
           send: function(s){
             response = s;
             console.log('test sends: '+s)
           }
         }
       }


      commandHandler.handle('help',[],message)


      assert.ok( response  );
      return ;

    });






  });
