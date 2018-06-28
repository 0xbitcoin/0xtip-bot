/*
LAVA PACKET UTIL for NODEJS
javascript library for NODEJS

Version 0.10

*/


const ethSigUtil = require('eth-sig-util')
const ethUtil = require('ethereumjs-util')

module.exports =  {


      getLavaPacket(
      method,from,to,walletAddress,tokenAddress,tokenAmount,
      relayerReward,expires,nonce,signature)
    {

      return {
        method:method,
        from: from,
        to: to,
        walletAddress:walletAddress,
        tokenAddress:tokenAddress,
        tokenAmount:tokenAmount,
        relayerReward:relayerReward,
        expires:expires,
        nonce:nonce,
        signature:signature
      }


    },

      lavaPacketHasValidSignature(packetData){

      var sigHash = LavaPacketUtils.getLavaTypedDataHash(packetData.method, packetData.from,packetData.to,packetData.walletAddress,packetData.tokenAddress,packetData.tokenAmount,packetData.relayerReward,packetData.expires,packetData.nonce);


      var msgBuf = ethjsutil.toBuffer(packetData.signature)
      const res = ethjsutil.fromRpcSig(msgBuf);


      var hashBuf = ethjsutil.toBuffer(sigHash)

      const pubKey  = ethjsutil.ecrecover(hashBuf, res.v, res.r, res.s);
      const addrBuf = ethjsutil.pubToAddress(pubKey);
      const recoveredSignatureSigner    = ethjsutil.bufferToHex(addrBuf);


      //make sure the signer is the depositor of the tokens
      return packetData.from.toLowerCase() == recoveredSignatureSigner.toLowerCase();

    },

        getLavaTypedDataHash(method,from,to,walletAddress,tokenAddress,tokenAmount,relayerReward,expires,nonce)
      {
        var  hardcodedSchemaHash =  LavaPacketUtils.getLavaPacketSchemaHash();

         nonce = web3utils.toBN(nonce)

          var typedDataHash = web3utils.soliditySha3(
                        hardcodedSchemaHash,
                        web3utils.soliditySha3(method,from,to,walletAddress,tokenAddress,tokenAmount,relayerReward,expires,nonce)
                        );


        return typedDataHash;
      },


       getLavaPacketSchemaHash()
     {
        var hardcodedSchemaHash = '0x8fd4f9177556bbc74d0710c8bdda543afd18cc84d92d64b5620d5f1881dceb37' ;
        return hardcodedSchemaHash;
     },

       signTypedData(privateKey, msgParams)
    {

      if(privateKey.startsWith('0x'))
      {
        privateKey = privateKey.substring(2)
      }

      var privKey = Buffer.from(privateKey, 'hex')

      const msgHash = ethSigUtil.typedSignatureHash(msgParams.data)

      var msgBuffer= ethUtil.toBuffer(msgHash)

      const sig = ethUtil.ecsign(msgBuffer, privKey)
      return ethUtil.bufferToHex(ethSigUtil.concatSig(sig.v, sig.r, sig.s))

    },

       getLavaParamsFromData(method,from,to,walletAddress,tokenAddress,tokenAmount,relayerReward,expires,nonce)
     {
         var params = [

          {
            type: 'bytes',
            name: 'method',
            value: method
          },
           {
             type: 'address',
             name: 'from',
             value: from
           },
           {
             type: 'address',
             name: 'to',
             value: to
           },
           {
             type: 'address',
             name: 'walletAddress',
             value: walletAddress
           },
           {
             type: 'address',
             name: 'tokenAddress',
             value: tokenAddress
           },
           {
             type: 'uint256',
             name: 'tokenAmount',
             value: tokenAmount
           },
           {
             type: 'uint256',
             name: 'relayerReward',
             value: relayerReward
           },
           {
             type: 'uint256',
             name: 'expires',
             value: expires
           },
           {
             type: 'uint256',
             name: 'nonce',
             value: nonce
           },
         ]

         return params;
     },





        formatAmountWithDecimals(amountRaw,decimals)
      {
      var amountFormatted = amountRaw / (Math.pow(10,decimals) * 1.0)

    //  amountFormatted = Math.round(amountFormatted,decimals)

      return amountFormatted;
    },




          getContractLavaMethod(walletContract,packetData)
        {

          var lavaTransferMethod;


          if(packetData.method == 'transfer')
          {
            lavaTransferMethod = walletContract.methods.transferTokensFromWithSignature(
             packetData.from,
             packetData.to,
             packetData.tokenAddress,
             packetData.tokenAmount,
             packetData.relayerReward,
             packetData.expires,
             packetData.nonce,
             packetData.signature
           );
         }else if(packetData.method == 'withdraw')
          {
            lavaTransferMethod = walletContract.methods.withdrawTokensFromWithSignature(
             packetData.from,
             packetData.to,
             packetData.tokenAddress,
             packetData.tokenAmount,
             packetData.relayerReward,
             packetData.expires,
             packetData.nonce,
             packetData.signature
           );
         }else if(packetData.method == 'approve')
         {
           lavaTransferMethod = walletContract.methods.approveTokensWithSignature(
            packetData.from,
            packetData.to,
            packetData.tokenAddress,
            packetData.tokenAmount,
            packetData.relayerReward,
            packetData.expires,
            packetData.nonce,
            packetData.signature
          );
        }else
        {
          lavaTransferMethod = walletContract.methods.approveAndCall(
           packetData.method,
           packetData.from,
           packetData.to,
           packetData.tokenAddress,
           packetData.tokenAmount,
           packetData.relayerReward,
           packetData.expires,
           packetData.nonce,
           packetData.signature
         );
        }

          return lavaTransferMethod;

        },


          getFunctionCall(web3,packetData)
        {



          var txData;


          if(packetData.method == 'transfer')
          {
            txData  = web3.eth.abi.encodeFunctionCall({
                      name: 'transferTokensFromWithSignature',
                      type: 'function',
                      "inputs": [
                        {
                          "name": "from",
                          "type": "address"
                        },
                        {
                          "name": "to",
                          "type": "address"
                        },
                        {
                          "name": "token",
                          "type": "address"
                        },
                        {
                          "name": "tokens",
                          "type": "uint256"
                        },
                        {
                          "name": "relayerReward",
                          "type": "uint256"
                        },
                        {
                          "name": "expires",
                          "type": "uint256"
                        },
                        {
                          "name": "nonce",
                          "type": "uint256"
                        },
                        {
                          "name": "signature",
                          "type": "bytes"
                        }
                      ]
                  }, [
                      packetData.from,
                      packetData.to,
                      packetData.tokenAddress,
                      packetData.tokenAmount,
                      packetData.relayerReward,
                      packetData.expires,
                      packetData.nonce,
                      packetData.signature
                ]);

         }else if(packetData.method == 'withdraw')
          {
            txData  = web3.eth.abi.encodeFunctionCall({
                      name: 'withdrawTokensFromWithSignature',
                      type: 'function',
                      "inputs": [
                        {
                          "name": "from",
                          "type": "address"
                        },
                        {
                          "name": "to",
                          "type": "address"
                        },
                        {
                          "name": "token",
                          "type": "address"
                        },
                        {
                          "name": "tokens",
                          "type": "uint256"
                        },
                        {
                          "name": "relayerReward",
                          "type": "uint256"
                        },
                        {
                          "name": "expires",
                          "type": "uint256"
                        },
                        {
                          "name": "nonce",
                          "type": "uint256"
                        },
                        {
                          "name": "signature",
                          "type": "bytes"
                        }
                      ]
                  }, [
                      packetData.from,
                      packetData.to,
                      packetData.tokenAddress,
                      packetData.tokenAmount,
                      packetData.relayerReward,
                      packetData.expires,
                      packetData.nonce,
                      packetData.signature
                ]);

         }else if(packetData.method == 'approve')
         {
           txData  = web3.eth.abi.encodeFunctionCall({
                     name: 'approveTokensFromWithSignature',
                     type: 'function',
                     "inputs": [
                       {
                         "name": "from",
                         "type": "address"
                       },
                       {
                         "name": "to",
                         "type": "address"
                       },
                       {
                         "name": "token",
                         "type": "address"
                       },
                       {
                         "name": "tokens",
                         "type": "uint256"
                       },
                       {
                         "name": "relayerReward",
                         "type": "uint256"
                       },
                       {
                         "name": "expires",
                         "type": "uint256"
                       },
                       {
                         "name": "nonce",
                         "type": "uint256"
                       },
                       {
                         "name": "signature",
                         "type": "bytes"
                       }
                     ]
                 }, [
                     packetData.from,
                     packetData.to,
                     packetData.tokenAddress,
                     packetData.tokenAmount,
                     packetData.relayerReward,
                     packetData.expires,
                     packetData.nonce,
                     packetData.signature
               ]);

        }else
        {
          txData  = web3.eth.abi.encodeFunctionCall({
                    name: 'approveAndCall',
                    type: 'function',
                    "inputs": [
                      {
                        "name": "method",
                        "type": "bytes"
                      },
                      {
                        "name": "from",
                        "type": "address"
                      },
                      {
                        "name": "to",
                        "type": "address"
                      },
                      {
                        "name": "token",
                        "type": "address"
                      },
                      {
                        "name": "tokens",
                        "type": "uint256"
                      },
                      {
                        "name": "relayerReward",
                        "type": "uint256"
                      },
                      {
                        "name": "expires",
                        "type": "uint256"
                      },
                      {
                        "name": "nonce",
                        "type": "uint256"
                      },
                      {
                        "name": "signature",
                        "type": "bytes"
                      }
                    ]
                }, [
                    packetData.method,
                    packetData.from,
                    packetData.to,
                    packetData.tokenAddress,
                    packetData.tokenAmount,
                    packetData.relayerReward,
                    packetData.expires,
                    packetData.nonce,
                    packetData.signature
              ]);

        }



              return txData;
        } 




}
