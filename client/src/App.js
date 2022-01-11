import React, { useState, useEffect } from "react";
import "./App.css";
import Web3 from "web3-eth";

// EXAMPLE: const OCUContractAddress = "0x7C9c83383041D8d126C9F2047a15f29bCC96a713";
const OCUContractAddress = "0xa6D1940a688819a38d42C4B140b914fE8cE8950e";

function App() {
	const [loaded, setLoaded] = useState(false);
	const [txConfirmed, setTxConfirmed] = useState(false);
	const [openCleanUp, setOpenCleanUp] = useState(0);
	const [accounts, setAccounts] = useState(0);
	const [accountBalance, setAccountBalance] = useState(0);
	const [accountRole, setAccountRole] = useState(0);
	const [totalSupply, setTotalSupply] = useState(0);

	const [mintAmount, setMintAmount] = useState(0);
	const [burnAmount, setBurnAmount] = useState(0);

	const [distributeAmount, setDistributeAmount] = useState(0);

	const [address, setAddress] = useState("");
	const [addressRole, setAddressRole] = useState("");
	const [grantRoleType, setGrantRoleType] = useState(0);
	const [revokeRoleType, setRevokeRoleType] = useState(0);

	useEffect(() => {
		if (typeof web3 !== "undefined") {
			window.web3 = new Web3(window.ethereum);

			if (window.web3.currentProvider.isMetaMask === true) {
				connectMetaMask();
				connectToSelectedNetwork();
			} else {
				alert("Please download MetaMask");
			}
		} else {
			alert("No web3 support found");
		}
	}, []);

	useEffect(() => {
		if (loaded && accounts !== 0) {
			window.ethereum.on("chainChanged", () => {
				window.location.reload();
			});
			window.ethereum.on("accountsChanged", () => {
				window.location.reload();
			});

			getTokenInfo();
			getAccountInfo();
		}
	}, [loaded, accounts, accountRole, openCleanUp, txConfirmed]);

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
		const web3 = new Web3(Web3.givenProvider);

		const abi = await getABI();

		const openCleanUpContract = await new web3.Contract(
			abi,
			OCUContractAddress
		);

		setOpenCleanUp(openCleanUpContract);
		setLoaded(true);
	}

	async function getABI() {
		let ABI = "";
		await fetch("./OpenCleanUp.json", {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		})
			.then((response) => {
				if (response.status === 200) {
					return response.json();
				} else {
					throw new Error("Error fetching ABI");
				}
			})
			.then((data) => {
				ABI = data.abi;
			})
			.catch((error) => {
				alert("Error, see console log");
				throw new Error(error);
			});
		return ABI;
	}

	function getTokenInfo() {
		call(openCleanUp.methods.totalSupply, setTotalSupply);
	}

	async function getAccountInfo() {
		call(openCleanUp.methods.balanceOf, setAccountBalance, accounts[0]);

		let role = await getAddressRole(accounts[0]);
		setAccountRole(role);
	}

	async function getAddressRole(_address) {
		let role = await openCleanUp.methods.roleOf(_address).call();

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

	async function displayAddressRole() {
		setAddressRole(await getAddressRole(address));
	}

	function call(func, callback, ...args) {
		func(...args)
			.call()
			.then((result) => {
				callback(result);
			})
			.catch((error) => {
				alert("Call error, see console log");
				throw new Error(error);
			});
	}

	async function mint() {
		try {
			setTxConfirmed(false);
			let gas = await openCleanUp.methods
				.mint(`${mintAmount * 10 ** 18}`)
				.estimateGas({ from: accounts[0] });

			let tx = await openCleanUp.methods.mint(`${mintAmount * 10 ** 18}`).send({
				from: accounts[0],
				gas: gas,
			});

			console.log("tx: ", tx);
			setTxConfirmed(true);
		} catch (error) {
			alert(`Mint error:\n${error.message}`);
			console.log(error);
		}
	}

	async function burn() {
		try {
			setTxConfirmed(false);
			let gas = await openCleanUp.methods
				.burn(`${burnAmount * 10 ** 18}`)
				.estimateGas({ from: accounts[0] });
			let tx = await openCleanUp.methods.burn(`${burnAmount * 10 ** 18}`).send({
				from: accounts[0],
				gas: gas,
			});
			console.log("tx: ", tx);
			setTxConfirmed(true);
		} catch (error) {
			alert(`Burn error:\n${error.message}`);
			console.log(error);
		}
	}

	async function grantRole() {
		console.log(grantRoleType, address);
		try {
			let gas = await openCleanUp.methods
				.grantRole(grantRoleType, address)
				.estimateGas({ from: accounts[0] });

			let tx = await openCleanUp.methods
				.grantRole(grantRoleType, address)
				.send({
					from: accounts[0],
					gas: gas,
				});

			console.log("tx: ", tx);
		} catch (error) {
			alert(`Grant role error:\n${error.message}`);
			console.log(error);
		}
	}

	async function grantFoundationRole() {
		try {
			setTxConfirmed(false);
			let gas = await openCleanUp.methods
				.previewGrantRole()
				.estimateGas({ from: accounts[0] });

			let tx = await openCleanUp.methods.previewGrantRole().send({
				from: accounts[0],
				gas: gas,
			});
			console.log("tx: ", tx);
			setTxConfirmed(true);
		} catch (error) {
			alert(`Grant foundation role error:\n${error.message}`);
			console.log(error);
		}
	}

	async function revokeRole() {
		console.log(revokeRoleType, address);
		try {
			setTxConfirmed(false);
			let gas = await openCleanUp.methods
				.revokeRole(revokeRoleType, address)
				.estimateGas({ from: accounts[0] });

			let tx = await openCleanUp.methods
				.revokeRole(revokeRoleType, address)
				.send({
					from: accounts[0],
					gas: gas,
				});
			console.log("tx: ", tx);
			setTxConfirmed(true);
		} catch (error) {
			alert(`Revoke role error:\n${error.message}`);
			console.log(error);
		}
	}

	async function distribute() {
		try {
			console.log(address, distributeAmount);
			let gas = await openCleanUp.methods
				.distribute(address, `${distributeAmount * 10 ** 18}`)
				.estimateGas({ from: accounts[0] });

			let tx = await openCleanUp.methods
				.distribute(address, `${distributeAmount * 10 ** 18}`)
				.send({
					from: accounts[0],
					gas: gas,
				});

			console.log("tx: ", tx);
		} catch (error) {
			alert(`Distribution error:\n${error.message}`);
			console.log(error);
		}
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
						<h1>OpenCleanUp</h1>
						<p>Address: {accounts}</p>
						<p>Account balance: {accountBalance / 10 ** 18}</p>
						<p>Account role: {accountRole}</p>

						<p>Total supply: {totalSupply / 10 ** 18}</p>
					</div>
				)}
				{loaded && accountRole == "foundation" && (
					<div>
						<h3>Foundation Wallet Controls</h3>
						<div>
							<input
								type="number"
								id="mint"
								onChange={(event) => setMintAmount(event.target.value)}
							></input>
							<button onClick={mint}>
								<p>Mint</p>
							</button>
						</div>
						<div>
							<input
								type="number"
								id="burn"
								onChange={(event) => setBurnAmount(event.target.value)}
							></input>
							<button onClick={burn}>
								<p>Burn</p>
							</button>
						</div>
						<br></br>
						<div>
							<h3>Address Role Controls</h3>
							<div>
								<label>
									Address
									<input
										type="text"
										id="roleAddress"
										onChange={(event) => setAddress(event.target.value)}
									></input>
								</label>
							</div>
							<br></br>

							<div>
								<button onClick={displayAddressRole}>
									<p>Check address role</p>
								</button>
								<p>Address role: {addressRole}</p>
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
								<p>Grant role to address</p>
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
								<p>Revoke role from address</p>
							</button>
						</div>
					</div>
				)}
				{loaded && accountRole == "token distributer" && (
					<div>
						<h3>Distributer Controls</h3>
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
				{loaded && accountRole == "none" && (
					<div>
						<h3> Preview Functionality </h3>
						<button onClick={grantFoundationRole}>
							<p>Grant Foundation role to address</p>
						</button>
					</div>
				)}
			</header>
		</div>
	);
}

export default App;
// main account
// 0x56d8Bf89371Ba9eD001a27aC7A1fAB640Afe4f91

// account 2
// 0xFB76057e610aC2746B68E23501319BbA8EF7cCDc

// account 3
// 0xFd4689E3D71EcF99d65AA22E73447f6C3940b603

// account 4
// 0xDD5c09e521Cb45cCB66Ef9D239D8b2724ac62530
