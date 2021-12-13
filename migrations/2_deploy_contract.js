const OpenCleanUp = artifacts.require("OpenCleanUp");

module.exports = function (deployer) {
	// Arguments are: contract, initialSupply
	deployer.deploy(OpenCleanUp);
};
