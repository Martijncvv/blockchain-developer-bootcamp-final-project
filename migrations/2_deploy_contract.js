const OpenCleanUp = artifacts.require("OpenCleanUp");
const OpenCleanUpRoles = artifacts.require("OpenCleanUpRoles");

module.exports = function(deployer) {
	deployer.deploy(OpenCleanUp);
	deployer.deploy(OpenCleanUpRoles);
};
