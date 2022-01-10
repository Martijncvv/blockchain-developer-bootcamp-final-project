## Open CleanUp

### An open ecosystem to incentivize individuals to clean the environment

## Deployed version on Ropsten Ethereum testnet

https://opencleanup.netlify.app/

## Run project

### Prerequisites

- Node.js v8.9.4 or later
- NPM v5.0.3 or later
- Windows, Linux or Mac OS X
- MetaMask extension in your browser
- Ganache or another local testnet on port 7545
- git clone https://github.com/Martijncvv/blockchain-developer-bootcamp-final-project.git

### Run smartcontract unit test

In root:

1. npm install
2. truffle develop
3. migrate
4. Copy OpenCleanUp Contract Address
5. test

### Run dApp

Run Ganache or another local testnet on port 7545
In root:

2. truffle migrate --network development
   Copy 'OpenCleanUp Contract Address' and paste after 'OCUContractAddress', line 8 in client/src/App.js.
3. cd client
4. npm install
5. Connect Metamask with testnet on port 7545
6. npm start; should open http://localhost:3000/

///////

### Server

In root:

- npm install
- Run local testnet in port 7545 with an Ethereum client, e.g. Ganache
- truffle develop
- migrate
- truffle test

### Frontend

- cd client
- npm install
- Connect Metamask with testnet on port 7545
- npm start
- Started at http://localhost:3000/
  ///////////

## Problem

These days companies and individuals help to fight environmental damage by sending a certain amount of money to an NGO which works in an opague way and uses a large percentage of the donated money for their expenses. It’s also hard for the donor to get a feel of the actual result. Meanwhile there is an excess of people living on the streets, begging for money.
The goal is to bring individuals without income, environment enthusiasts and NGO funding companies together in a transparant way with the goal to protect the environment and raise societies floor.

## Idea

The idea is to create an open ecosystem whereby large enterprises, SMBs and individuals are incentivized to clean the environment together. This is done by creating a token which will be used to exchange value between different parties within the ecosystem.

Instead of individuals spending hours of walking with a collection box, gathering small amounts of money:

- **Enterprises** can donate fiat money/stable coins to an Open CleanUp foundation wallet. For every dollar donated, 1 \$OCU gets minted.
- **SMBs** can sign up to be part of the ecosystem as **token-receiver** that accepts \$OCU tokens for services or goods, which they can exchange for fiat money.
- **Individuals** can do different kind of tasks to receive \$OCU tokens.
- **SMBs or public enterprises**, like a municipal yard nearby a beach, can sign up as **token-distributer** to verify if tasks have been executed and reward individuals, e.g. people without an incoming or environment enthusiasts.

## Workflow

- The foundation should be able to mint \$OCU tokens based on the amount of stable coins in the donation wallet.
- Token-distributer SMBs have to register and should get permission from the foundation to distribute minted \$OCU tokens to wallets of individuals.
- \$OCU holders should be able to transfer tokens between wallets.
- Token-receiver SMBs have to register and should be able to swap $OCU tokens for stable coins at the foundation wallet; The $OCU token gets burned.

## Additional features

- NFTs can be used to give wallets certain permissions and can be used for gamification;
  instead of spending the \$OCU tokens, individuals can buy NFTs to show their hard work for the environment. SMBs can give discounts to these NFT holders.
- Data about the tokens; nr of tokens donated, distributed, spent and burned. And by which enterprises, SMBs or individuals.
- The individual can see which company donated the specific \$OCU tokens; marketing.
- The money donor can see what its donated money was used for.
