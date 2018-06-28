var INFURA_MAINNET_URL = 'https://mainnet.infura.io/gmXEVo5luMPUGPqg6mhy';


var Web3 = require('web3')

var web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider(INFURA_MAINNET_URL))

const mongoInterface = require('../lib/mongo-interface')
const commandHandler = require('../lib/command-handler')
const discordInterface = require('../lib/discord-interface');

const config = require("../config.json");

var response;
var messageChannel;

var assert = require('assert');


  describe('Tip Bot', function() {



    it('responds with help', async function() {

      await mongoInterface.init();
      await commandHandler.init(web3,mongoInterface);


        messageChannel = {
         channel: {
           send: function(s){
             response = s;
             console.log('test sends: '+s)
           }
         }
       }


      await commandHandler.handle('help',[],messageChannel)


      assert.ok( response  );
      return ;

    });


    it('find acct', async function() {

     var response= await commandHandler.findOneAccountByCombinedName('@Infernal_toast#5156')

     console.log('find acct', response )
      assert.ok( response  );
      return ;

    });



    it('can tip user', async function() {


      commandHandler.handle('tipuser',[],messageChannel)


      assert.ok( response  );
      return ;

    });






  });
