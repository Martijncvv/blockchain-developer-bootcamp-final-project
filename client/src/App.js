import React, { useState, useEffect } from "react";
import "./App.css";
import Web3 from "web3-eth";
// import { ethers } from "ethers";
// import OpenCleanup from "./contracts/OpenCleanUp.json";
// import "bootstrap/dist/css/bootstrap.min.css";

// Needs to change to reflect current OpenCleanup address
const OCUContractAddress = "0x807C508C7D3620549A54eC19c45Cac2b75193a2f";

function App() {
	const [loaded, setLoaded] = useState(false);
	const [openCleanUp, setOpenCleanUp] = useState(0);
	const [accounts, setAccounts] = useState(0);
	const [accountBalance, setAccountBalance] = useState(0);
	const [totalSupply, setTotalSupply] = useState(0);

	useEffect(() => {
		if (typeof web3 !== "undefined") {
			window.web3 = new Web3(window.web3.currentProvider);

			if (window.web3.currentProvider.isMetaMask === true) {
				connectMetaMask();
				connectToSelectedNetwork();
			} else {
				console.log("Please download MetaMask");
			}
		} else {
			console.log("No web3 support found");
		}
	}, []);

	useEffect(() => {
		// Only get profile if we are completly loaded
		if (loaded && accounts !== 0) {
			// get user info
			getTokenInfo();
		} else {
			// dirty trick to trigger reload if something went wrong
			// setTimeout(setLoaded(true), 500);
		}
		// This here subscribes to changes on the loaded and accounts state
	}, [loaded, accounts]);

	function connectMetaMask() {
		window.web3
			.requestAccounts()
			.then((result) => {
				setAccounts(result);
			})
			.catch((error) => {
				throw new Error(error);
			});
	}

	async function connectToSelectedNetwork() {
		// This will connect to the selected network inside MetaMask
		const web3 = new Web3(Web3.givenProvider);
		// Set the ABI of the Built contract so we can interact with it
		const abi = await getABI();
		// console.log(abi);

		// Make a new instance of the contract by giving the address and abi
		const openCleanUpContract = await new web3.Contract(
			abi,
			OCUContractAddress
		);

		// Set the state of the app by passing the contract so we can reach it from other places
		setOpenCleanUp(openCleanUpContract);
		console.log(openCleanUpContract);
		setLoaded(true);
	}

	// getABI loads the ABI of the contract
	async function getABI() {
		// DevToken.json should be placed inside the public folder so we can reach it
		let ABI = "";
		await fetch("./OpenCleanUp.json", {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		})
			.then((response) => {
				// We have a Response, make sure its 200 or throw an error
				if (response.status === 200) {
					// This is actually also a promise so we need to chain it to grab data
					return response.json();
				} else {
					throw new Error("Error fetching ABI");
				}
			})
			.then((data) => {
				// We have the data now, set it using the state
				ABI = data.abi;
			})
			.catch((error) => {
				throw new Error(error);
			});
		return ABI;
	}

	// getUserProfile will fetch account information from the block chain network
	function getTokenInfo() {
		// Let's grab the token total supply, the method is named the same as in the Solidity code, and add call() to execute it.
		// We can also get the response using a callback. I do recommend this method most times as we dont know how long the executions can take.
		call(openCleanUp.methods.totalSupply, setTotalSupply);
		// balanceOf Requires input argument of the account to grab, so let's grab the first available account for now
		call(openCleanUp.methods.balanceOf, setAccountBalance, accounts[0]);
	}

	// call takes in a function to execute and runs a given callback on the response
	function call(func, callback, ...args) {
		// Trigger the function with the arguments
		func(...args)
			.call()
			.then((result) => {
				// Apply given callback, this is our stateSetters
				callback(result);
			})
			.catch((error) => {
				throw new Error(error);
			});
	}

	function mint() {
		openCleanUp.methods
			.mint(1000)
			.estimateGas({ from: accounts[0] })
			.then((gas) => {
				// We now have the gas amount, we can now send the transaction
				openCleanUp.methods.mint(1000).send({
					from: accounts[0],
					gas: gas,
				});

				// Fake update of account by changing stake, Trigger a reload when transaction is done later
				setAccountBalance(parseInt(accountBalance) + 1000);
			})
			.catch((error) => {
				throw new Error(error);
			});
	}

	function mint() {
		openCleanUp.methods
			.mint(1000)
			.estimateGas({ from: accounts[0] })
			.then((gas) => {
				// We now have the gas amount, we can now send the transaction
				openCleanUp.methods.mint(1000).send({
					from: accounts[0],
					gas: gas,
				});

				// Fake update of account by changing stake, Trigger a reload when transaction is done later
				setAccountBalance(parseInt(accountBalance) + 1000);
			})
			.catch((error) => {
				throw new Error(error);
			});
	}

	return (
		<div className="App">
			{loaded && (
				<header className="App-header">
					<p>OpenCleanUp</p>
					<p>Address: {accounts}</p>
					<p>Account balance: {accountBalance}</p>

					<p>Total supply: {totalSupply}</p>

					<button onClick={mint}>
						<p>Mint</p>
					</button>
				</header>
			)}
		</div>
	);
}

export default App;
