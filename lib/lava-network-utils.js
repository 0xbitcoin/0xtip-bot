/*
LAVA PACKET UTIL for NODEJS
javascript library for NODEJS

Version 0.10

*/


const request = require('request')

module.exports =  {



        async broadcastPacket(packetData,relayURL)
        {
           //post
           var options = {
             method: 'post',
             body: packetData, // Javascript object
             json: true, // Use,If you are sending JSON data
             url: relayURL,
             headers: {
               // Specify headers, If any
             }
            }

            var response =  new Promise(async resolve => {

                request(options, function (err, res, body) {
                 if (err) {
                   console.log('Error :', err)
                   resolve(err)
                 }
                 console.log(' Body :', body)
                 resolve(body)
                });

              });


              return response ;
        }





}
