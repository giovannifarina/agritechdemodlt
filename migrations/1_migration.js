var MyContract = artifacts.require("AgritechDemo");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(MyContract);
};
