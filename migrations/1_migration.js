const fs = require('fs');
const path = require('path');

var MyContract = artifacts.require("AgritechDemo");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(MyContract).then(function(instance) {
    // Write the contract address to a file
    const contractAddress = instance.address;
    const filePath = path.join(__dirname, '..', 'contract_address.json');
    fs.writeFileSync(filePath, JSON.stringify({ address: contractAddress }, null, 2));
  });
};