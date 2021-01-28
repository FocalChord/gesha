var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var SmartHome = artifacts.require("./SmartHome.sol");
var NewSmartHome = artifacts.require("./NewSmartHome.sol");

module.exports = function (deployer) {
  // deployer.deploy(SimpleStorage, { gas: 6721974 });
  // deployer.deploy(SmartHome, { gas: 6721974 });
  deployer.deploy(NewSmartHome, { gas: 6729999 });
};
