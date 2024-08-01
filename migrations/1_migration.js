var MyContract = artifacts.require("Agritech");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(MyContract);
};
