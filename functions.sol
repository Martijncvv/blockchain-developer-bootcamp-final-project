pragma solidity ^0.5.0;

contract OpenCleanUp {

// The foundation should be able to mint $OCU tokens based on the amount of stablecoins in the donation wallet.
function tokenMint() returns(bool) {
    // mints OCU tokens
}

// Token-distributer SMBs have to register and should get permission from the foundation to distribute minted $OCU tokens to wallets of individuals.
function registerDistributer(address distributer) returns(bool) {
    // register distributer
}
function distributeTokens(address receiver uint amount) returns(bool) {
    // register distributer
}

// Token-receiver SMBs have to register and should be able to swap $OCU tokens for stable coins at the foundation wallet; The $OCU token gets burned.
function registerReceiver(address receiver) returns(bool) {
    // register Receiver
}
function swapToStable(address receiver, uint amount) returns(bool) {
    // swap tokens to stablecoins and burns OCU tokens
}

}