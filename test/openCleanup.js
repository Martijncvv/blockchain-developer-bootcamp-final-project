const OpenCleanUp = artifacts.require("OpenCleanUp");

contract("OpenCleanUp", async (accounts) => {
	it("should assert true", async () => {
		await OpenCleanUp.deployed();
		return assert.isTrue(true);
	});

	it("should check initial supply", async () => {
		openCleanUp = await OpenCleanUp.deployed();
		let supply = await openCleanUp.totalSupply();

		assert.equal(
			supply,
			10000 * 10 ** 18,
			"Initial supply was not the same as in migration"
		);
	});
	describe("Functionality", () => {
		it("should mint 1000 tokens with Foundation wallet", async () => {
			const [foundation, marty, lara] = accounts;
			openCleanUp = await OpenCleanUp.deployed();

			await openCleanUp.mint(1000);

			let foundationBalance = await openCleanUp.balanceOf(foundation);
			assert.equal(
				foundationBalance,
				10000 * 10 ** 18 + 1000,
				"Foundation balance is not 11000; no mint"
			);
		});

		it("should not be able to mint tokens with non-foundation wallets", async () => {
			const [foundation, marty, lara] = accounts;
			openCleanUp = await OpenCleanUp.deployed();

			try {
				await openCleanUp.mint(1000, { from: marty });
			} catch (error) {
				assert.equal(error.reason, "Not authorized with role");
			}
		});
		it("should burn 1000 tokens with Foundation wallet", async () => {
			const [foundation, marty, lara] = accounts;
			openCleanUp = await OpenCleanUp.deployed();

			await openCleanUp.burn(1000);

			let foundationBalance = await openCleanUp.balanceOf(foundation);
			assert.equal(
				foundationBalance,
				10000 * 10 ** 18,
				"Foundation balance is not 10000; no burn"
			);
		});

		it("should grant TOKEN_RECEIVER role to wallet 1 with the foundation wallet", async () => {
			const [foundation, marty, lara] = accounts;
			openCleanUp = await OpenCleanUp.deployed();

			await openCleanUp.grantRole(
				"0x5256df45158a1b783d5d1b7eae366e43e8adc1ddfe02d99d60edbfba2f122ee1",
				marty
			);

			let martyRole = await openCleanUp.roleOf(marty);
			assert.equal(
				martyRole,
				"0x5256df45158a1b783d5d1b7eae366e43e8adc1ddfe02d99d60edbfba2f122ee1",
				"Wallet 1 role is not TOKEN_RECEIVER"
			);
		});
		it("should revoke TOKEN_RECEIVER role from wallet 1 with the foundation wallet", async () => {
			const [foundation, marty, lara] = accounts;
			openCleanUp = await OpenCleanUp.deployed();

			await openCleanUp.revokeRole(
				"0x5256df45158a1b783d5d1b7eae366e43e8adc1ddfe02d99d60edbfba2f122ee1",
				marty
			);

			let martyRole = await openCleanUp.roleOf(marty);
			assert.equal(
				martyRole,
				"0x1b489cce9d784ec074d286492a1ccc9efab255c8a4e6b74d2406b5b7674c6e74",
				"Wallet 1 role is not NONE"
			);
		});
		it("should give token-distributer role to a wallet and the wallet should distribute tokens", async () => {
			const [foundation, marty, lara] = accounts;
			openCleanUp = await OpenCleanUp.deployed();

			try {
				await openCleanUp.grantRole(
					"0xa8be2c61382bed6254f75e306150d63d18d487cc8453e448fff554cbc742e962",
					marty
				);
				await openCleanUp.distribute(lara, 1000, { from: marty });

				let larasBalance = await openCleanUp.balanceOf(lara);
				assert.equal(
					larasBalance,
					1000,
					"Laras balance is not 1000; distribution wasn't executed."
				);
			} catch (error) {
				assert.equal(error.reason, "Not authorized with your role");
			}
		});
	});
});
