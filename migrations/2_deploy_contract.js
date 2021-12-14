const OpenCleanUp = artifacts.require("OpenCleanUp");
const OpenCleanUpRoles = artifacts.require("OpenCleanUpRoles");

module.exports = function(deployer) {
	// Arguments are: contract, initialSupply
	deployer.deploy(OpenCleanUp);
	deployer.deploy(OpenCleanUpRoles);
};
