var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var RandomNumberOracle = artifacts.require("./RandomNumberOracle.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(RandomNumberOracle);
};
