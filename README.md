### 0xtip-bot
A tipping bot for 0xBTC


### TODO
The tip bot will have an Eth account , a private key, and will use lavawallet


1. Integrate mongo, allow users to type a command to register an eth address with their discord address  (for accepting tips via name), store this in the DB



2. Allow users to deposit tokens inside the tipbot's lava wallet (using lava) - the mongo db running on the bot remembers how many tokens each person owns which are inside the bots lavawallet  

(The bot checks lava smart contract events via web3 to tell how many tokens a users address gave to the tipbots lava balance and tracks this in mongo )


3. Integrate lava wallet tools so that, on command from a user, the tipbot can send the tokens in its lavawallet to other users using offchain tx + lava relays 
