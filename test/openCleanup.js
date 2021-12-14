const OpenCleanUp = artifacts.require("OpenCleanUp");

contract("OpenCleanUp", async (accounts) => {
	// initial supply
	it("should check initial supply", async () => {
		openCleanUp = await OpenCleanUp.deployed();
		// call our totalSUpply function
		let supply = await openCleanUp.totalSupply();

		assert.equal(
			supply.toNumber(),
			10000,
			"Initial supply was not the same as in migration"
		);
	});
	it("should mint 1000 tokens with Foundation wallet", async () => {
		openCleanUp = await OpenCleanUp.deployed();

		await openCleanUp.mint(1000);

		let foundation_balance = await openCleanUp.balanceOf(accounts[0]);
		assert.equal(
			foundation_balance.toNumber(),
			11000,
			"Foundation balance is not 11000; no mint"
		);
	});

	it("should not be able to mint tokens with other wallets", async () => {
		openCleanUp = await OpenCleanUp.deployed();

		try {
			await openCleanUp.mint(1000, { from: accounts[1] });
			await openCleanUp.mint(1000, { from: accounts[2] });
		} catch (error) {
			assert.equal(error.reason, "Not authorized with your role");
		}
	});
	it("should burn 1000 tokens with Foundation wallet", async () => {
		openCleanUp = await OpenCleanUp.deployed();

		await openCleanUp.burn(1000);

		let foundation_balance = await openCleanUp.balanceOf(accounts[0]);
		assert.equal(
			foundation_balance.toNumber(),
			10000,
			"Foundation balance is not 10000; no burn"
		);
	});

	it("should grant TOKEN_RECEIVER role to wallet 1 with the foundation wallet", async () => {
		openCleanUp = await OpenCleanUp.deployed();
		let wallet1 = accounts[1];

		await openCleanUp.grantRole(
			"0x5256df45158a1b783d5d1b7eae366e43e8adc1ddfe02d99d60edbfba2f122ee1",
			wallet1
		);

		let wallet1Role = await openCleanUp.roleOf(wallet1);
		assert.equal(
			wallet1Role,
			"0x5256df45158a1b783d5d1b7eae366e43e8adc1ddfe02d99d60edbfba2f122ee1",
			"Wallet 1 role is not TOKEN_RECEIVER"
		);
	});
	it("should revoke TOKEN_RECEIVER role from wallet 1 with the foundation wallet", async () => {
		openCleanUp = await OpenCleanUp.deployed();
		let wallet1 = accounts[1];

		await openCleanUp.revokeRole(
			"0x5256df45158a1b783d5d1b7eae366e43e8adc1ddfe02d99d60edbfba2f122ee1",
			wallet1
		);

		let wallet1Role = await openCleanUp.roleOf(wallet1);
		assert.equal(
			wallet1Role,
			"0x1b489cce9d784ec074d286492a1ccc9efab255c8a4e6b74d2406b5b7674c6e74",
			"Wallet 1 role is not NONE"
		);
	});
});
