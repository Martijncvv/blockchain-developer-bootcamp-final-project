# OpenCleanUp

### An open ecosystem to incentivize individuals to clean the environment

## Project Description

### Problem

These days companies and individuals help to fight environmental damage by sending a certain amount of money to an NGO which works in an opague way and uses a large percentage of the donated money for their expenses. It’s also hard for the donor to get a feel of the actual result. Meanwhile there is an excess of people living on the streets, begging for money.
The goal is to bring individuals without income, environment enthusiasts and NGO funding companies together in a transparant way with the goal to protect the environment and raise societies floor.

### Idea

The idea is to create an open ecosystem whereby large enterprises, SMBs and individuals are incentivized to clean the environment together. This is done by creating a token that will be used to exchange value between different parties within the ecosystem.

Instead of individuals spending hours of walking with a collection box, gathering small amounts of money:

- **Enterprises** can donate fiat money/stable coins to an Open CleanUp foundation wallet. For every dollar donated, 1 \$OCU gets minted.
- **SMBs** can sign up to be part of the ecosystem as **token-receiver** that accepts \$OCU tokens for services or goods, which they can exchange for fiat money at the foundation.
- **Individuals** can do different kinds of tasks to receive \$OCU tokens.
- **SMBs or public enterprises**, like a municipal yard nearby a beach, can sign up as **token-distributer** to verify if tasks have been executed and reward individuals, e.g. people without an income or environment enthusiasts.

### Workflow

- The foundation should be able to mint \$OCU tokens based on the amount of stable coins in the donation wallet.
- Token-distributer SMBs have to register and should get permission from the foundation to distribute minted \$OCU tokens to wallets of individuals.
- \$OCU holders should be able to transfer tokens between wallets.
- Token-receiver SMBs have to register and should be able to swap $OCU tokens for stable coins at the foundation wallet; The $OCU token gets burned.

### Additional features

- NFTs can be used to give wallets certain permissions and can be used for gamification;
  instead of spending the \$OCU tokens, individuals can buy NFTs to show their hard work for the environment. SMBs can give discounts to these NFT holders.
- Data about the tokens; nr of tokens donated, distributed, spent and burned. And by which enterprises, SMBs or individuals.
- The money donor can see what its donated money was used for.

### To do

- Stablecoin/OCE-token swap
- Additional features

### Deployed version on Ropsten Ethereum testnet

https://opencleanup.netlify.app/

## Directory Structure

| Folder     | Content                           |
| ---------- | --------------------------------- |
| Client     | React front-end                   |
| Contracts  | Solidity smartcontracts           |
| Migrations | Scripts to deploy smartcontracts  |
| Test       | Smartcontract tests in Javascript |

## How to run project

### Prerequisites

- Node.js v8.9.4 or later
- NPM v5.0.3 or later
- Windows, Linux or Mac OS X
- MetaMask extension in browser
- Ganache or another local testnet on port 7545

### Run dApp on browser with Ropsten testnet

- Connect MetaMask with Ropsten testnet
- Open https://opencleanup.netlify.app/

### Run smartcontract unit test

- In terminal, `git clone https://github.com/Martijncvv/blockchain-developer-bootcamp-final-project.git`
- In terminal at project root folder, `npm install`
- `truffle develop`
- `migrate`
- `test`

### Run dApp on local server

- In terminal, `git clone https://github.com/Martijncvv/blockchain-developer-bootcamp-final-project.git`
- In terminal at project root folder, `npm install`
- Open Ganache and run testnet on port 7545
- In Ganache, click on the key icon to the right of the first wallet and copy the private key
- In browser, connect Metamask with testnet on port 7545
- In Metamask, click ‘Import Account’ and paste the private key
- In terminal at project root folder, `truffle migrate --network development`
- Copy 'OpenCleanUp Contract Address' from terminal and paste after 'OCUContractAddress' in blockchain-developer-bootcamp-final-project/client/src/App.js at line 6
- To setup frontend:
- In terminal at project root folder, `cd client`
- `npm install`
- `npm start`
- In browser, go to http://localhost:3000/
- Add more accounts from Ganache to Metamask to test multiple features

## Screencast link

[ConsenSys Final Project Screencast](https://www.youtube.com/watch?v=5UVijxnyRRo)

## Public Ethereum wallet for certification

0x6c9a9E71F384D1aFf6914eB2723E538593195f56

ENS: Martijncvv.eth
