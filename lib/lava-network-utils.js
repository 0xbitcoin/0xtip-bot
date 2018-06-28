/*
LAVA PACKET UTIL for NODEJS
javascript library for NODEJS

Version 0.10

*/


const request = require('request')

module.exports =  {



        async broadcastPacket(packetData,lavaNodeURL)
        {

          if(!lavaNodeURL.startsWith("http://"))
          {
            lavaNodeURL = "http://"+lavaNodeURL;
          }

          if(!lavaNodeURL.endsWith("/lavapacket"))
          {
            lavaNodeURL = lavaNodeURL+"/lavapacket";
          }

          console.log('broadcast packet ',lavaNodeURL,packetData)


          //body ends up being empty ???

           //post
           var options = {
             method: 'POST',
             body: packetData ,
             url: lavaNodeURL,
              json: true ,
             headers: {
              //  'Content-Type': 'application/x-www-form-urlencoded'
              // "Content-Type": "application/json",
             }
            }

            //'cannot post ??'  the post packet is all undefined

            var response = await new Promise(async resolve => {

                request(options, function (err, res, body) {
                 if (err) {
                   console.log('Error :', err)
                   resolve(err)
                 }
                 console.log(' Body :', body)
                 resolve(body)
                });

              });

              console.log('lala',response)

              return response ;
        }





}
