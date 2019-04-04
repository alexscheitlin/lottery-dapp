var LotteryMock = artifacts.require("./LotteryMock.sol");

module.exports = function(deployer) {
  deployer.deploy(LotteryMock);
};
