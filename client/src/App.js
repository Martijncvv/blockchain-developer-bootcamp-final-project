import React, { useState, useEffect } from "react";
import "./App.css";
import Web3 from "web3-eth";
// import { ethers } from "ethers";
// import OpenCleanup from "./contracts/OpenCleanUp.json";
// import "bootstrap/dist/css/bootstrap.min.css";

// Needs to change to reflect current OpenCleanup address
const OCUContractAddress = "0x34b8DCf220b40cD5A6bd1EBDcC1D73FA5cB3a305";

function App() {
	const [loaded, setLoaded] = useState(false);
	const [txConfirmed, setTxConfirmed] = useState(false);
	const [openCleanUp, setOpenCleanUp] = useState(0);
	const [accounts, setAccounts] = useState(0);
	const [accountBalance, setAccountBalance] = useState(0);
	const [accountRole, setAccountRole] = useState("");
	const [totalSupply, setTotalSupply] = useState(0);

	const [mintInput, setMintInput] = useState(0);
	const [burnInput, setBurnInput] = useState(0);

	const [address, setAddress] = useState("");
	const [addressRole, setAddressRole] = useState("");
	const [role, setRole] = useState("");
	const [grantRoleType, setGrantRoleType] = useState(0);
	const [revokeRoleType, setRevokeRoleType] = useState(0);
	const [distributeAmount, setDistributeAmount] = useState(0);

	useEffect(() => {
		if (typeof web3 !== "undefined") {
			// window.web3 = new Web3(window.web3.currentProvider);
			window.web3 = new Web3(window.ethereum);

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
			let options = {
				filter: {
					address: [accounts[0]],
				},
			};

			// Our contract has a field called events which has all Available events.
			openCleanUp.events
				.Mint(options)
				// data is when
				.on("data", (event) => console.log("Data: ", event))
				.on("changed", (changed) => console.log("Changed: ", changed))
				.on("error", (err) => console.log("Err: ", err))
				.on("connected", (str) => console.log("Connected: ", str));

			openCleanUp.events
				.Burn(options)
				// data is when
				.on("data", (event) => console.log("Data: ", event))
				.on("changed", (changed) => console.log("Changed: ", changed))
				.on("error", (err) => console.log("Err: ", err))
				.on("connected", (str) => console.log("Connected: ", str));

			getTokenInfo();
			getAccountInfo();

			console.log(openCleanUp);
		}
	}, [loaded, accounts, openCleanUp, txConfirmed]);

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
		// Connect to the selected network inside MetaMask
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
				ABI = data.abi;
			})
			.catch((error) => {
				throw new Error(error);
			});
		return ABI;
	}

	function getTokenInfo() {
		call(openCleanUp.methods.totalSupply, setTotalSupply);
	}

	async function getAccountInfo() {
		call(openCleanUp.methods.balanceOf, setAccountBalance, accounts[0]);
		let _accountRole = await getAddressRole(accounts[0]);
		setAccountRole(_accountRole);
	}

	function call(func, callback, ...args) {
		func(...args)
			.call()
			.then((result) => {
				callback(result);
			})
			.catch((error) => {
				throw new Error(error);
			});
	}

	function mint() {
		setTxConfirmed(false);
		openCleanUp.methods
			.mint(mintInput)
			.estimateGas({ from: accounts[0] })
			.then((gas) => {
				let tx = openCleanUp.methods.mint(mintInput).send({
					from: accounts[0],
					gas: gas,
				});
				return tx;
			})
			.then(() => {
				// window.location.reload(false);
				setTxConfirmed(true);
			})

			.catch((error) => {
				throw new Error(error);
			});
	}

	function burn() {
		setTxConfirmed(false);
		openCleanUp.methods
			.burn(burnInput)
			.estimateGas({ from: accounts[0] })
			.then((gas) => {
				let tx = openCleanUp.methods.burn(burnInput).send({
					from: accounts[0],
					gas: gas,
				});
				return tx;
			})
			.then(() => {
				setTxConfirmed(true);
			})
			.catch((error) => {
				throw new Error(error);
			});
	}

	function getAddressRole(_address) {
		call(openCleanUp.methods.roleOf, setRole, _address);
		switch (role) {
			case "0x42c574c7286eda4a697031a50021e14becf19cc00ff83d93a7547d3809b37f72":
				return "foundation";
			case "0xa8be2c61382bed6254f75e306150d63d18d487cc8453e448fff554cbc742e962":
				return "token distributer";
			case "0x5256df45158a1b783d5d1b7eae366e43e8adc1ddfe02d99d60edbfba2f122ee1":
				return "token receiver";
			default:
				return "none";
		}
	}

	function displayAddressRole() {
		console.log("000", role);
		console.log("111", address);
		let address_role = getAddressRole(address);
		console.log("012", role);
		console.log("222", address_role);
		setAddressRole(address_role);
		console.log("333", addressRole);
	}

	function grantRole() {
		console.log(grantRoleType, address);
		openCleanUp.methods
			.grantRole(grantRoleType, address)
			.estimateGas({ from: accounts[0] })
			.then((gas) => {
				// We now have the gas amount, we can now send the transaction
				openCleanUp.methods.grantRole(grantRoleType, address).send({
					from: accounts[0],
					gas: gas,
				});
			})
			.catch((error) => {
				throw new Error(error);
			});
	}
	function revokeRole() {
		console.log(revokeRoleType, address);
		openCleanUp.methods
			.revokeRole(revokeRoleType, address)
			.estimateGas({ from: accounts[0] })
			.then((gas) => {
				openCleanUp.methods.revokeRole(revokeRoleType, address).send({
					from: accounts[0],
					gas: gas,
				});
			})
			.catch((error) => {
				throw new Error(error);
			});
	}

	function distribute() {
		openCleanUp.methods
			.distribute(address, distributeAmount)
			.estimateGas({ from: accounts[0] })
			.then((gas) => {
				openCleanUp.methods.distribute(address, distributeAmount).send({
					from: accounts[0],
					gas: gas,
				});
			})
			.catch((error) => {
				throw new Error(error);
			});
	}

	return (
		<div className="App">
			<header className="App-header">
				{!loaded && (
					<div>
						<p>LOADING...</p>
					</div>
				)}
				{loaded && (
					<div>
						<p>OpenCleanUp</p>
						<p>Address: {accounts}</p>
						<p>Account balance: {accountBalance}</p>
						<p>Account role: {accountRole}</p>

						<p>Total supply: {totalSupply}</p>
					</div>
				)}
				{loaded && getAddressRole(accounts[0]) == "token distributer" && (
					<div>
						<label>
							Address
							<input
								type="text"
								id="Address"
								onChange={(event) => setAddress(event.target.value)}
							></input>
						</label>
						<label>
							Amount
							<input
								type="number"
								id="number"
								onChange={(event) => setDistributeAmount(event.target.value)}
							></input>
						</label>
						<button onClick={distribute}>
							<p>Distribute</p>
						</button>
					</div>
				)}

				{loaded && getAddressRole(accounts[0]) == "foundation" && (
					<div>
						<div>
							<input
								type="number"
								id="mint"
								onChange={(event) => setMintInput(event.target.value)}
							></input>
							<button onClick={mint}>
								<p>Mint</p>
							</button>
						</div>
						<div>
							<input
								type="number"
								id="burn"
								onChange={(event) => setBurnInput(event.target.value)}
							></input>
							<button onClick={burn}>
								<p>Burn</p>
							</button>
						</div>
						<br></br>
						<div>
							<label>
								Address
								<input
									type="text"
									id="roleAddress"
									onChange={(event) => setAddress(event.target.value)}
								></input>
							</label>

							<br></br>
							<p>Address role: {addressRole}</p>
							<div>
								<button onClick={displayAddressRole}>
									<p>Get role</p>
								</button>
							</div>

							<br></br>
							<div>
								<label>
									<input
										type="radio"
										value="Foundation"
										name="grantRole"
										onClick={() =>
											setGrantRoleType(
												"0x42c574c7286eda4a697031a50021e14becf19cc00ff83d93a7547d3809b37f72"
											)
										}
									></input>
									foundation
								</label>
								<label>
									<input
										type="radio"
										value="token distributer"
										name="grantRole"
										onClick={() =>
											setGrantRoleType(
												"0xa8be2c61382bed6254f75e306150d63d18d487cc8453e448fff554cbc742e962"
											)
										}
									></input>{" "}
									token distributer
								</label>
								<label>
									<input
										type="radio"
										value="token receiver"
										name="grantRole"
										onClick={() =>
											setGrantRoleType(
												"0x5256df45158a1b783d5d1b7eae366e43e8adc1ddfe02d99d60edbfba2f122ee1"
											)
										}
									></input>
									token receiver
								</label>
							</div>

							<button onClick={grantRole}>
								<p>Grant role</p>
							</button>
						</div>
						<div>
							<br></br>
							<div>
								<label>
									<input
										type="radio"
										value="Foundation"
										name="revokeRole"
										onClick={() =>
											setRevokeRoleType(
												"0x42c574c7286eda4a697031a50021e14becf19cc00ff83d93a7547d3809b37f72"
											)
										}
									></input>{" "}
									foundation
								</label>
								<label>
									<input
										type="radio"
										value="token distributer"
										name="revokeRole"
										onClick={() =>
											setRevokeRoleType(
												"0xa8be2c61382bed6254f75e306150d63d18d487cc8453e448fff554cbc742e962"
											)
										}
									></input>{" "}
									token distributer
								</label>
								<label>
									<input
										type="radio"
										value="token receiver"
										name="revokeRole"
										onClick={() =>
											setRevokeRoleType(
												"0x5256df45158a1b783d5d1b7eae366e43e8adc1ddfe02d99d60edbfba2f122ee1"
											)
										}
									></input>{" "}
									token receiver
								</label>
							</div>

							<button onClick={revokeRole}>
								<p>Revoke role</p>
							</button>
						</div>
					</div>
				)}
			</header>
		</div>
	);
}

export default App;
