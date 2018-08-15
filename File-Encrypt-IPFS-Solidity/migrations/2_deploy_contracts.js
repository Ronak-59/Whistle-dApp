var ValidatorContract = artifacts.require("../contracts/ValidatorContract.sol");

module.exports = function(deployer) {
	deployer.deploy(ValidatorContract);
};