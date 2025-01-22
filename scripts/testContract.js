const { Web3 } = require('web3');
const fs = require('fs');
const crypto = require('crypto');
require('dotenv').config();

agritechDemo = null;
accounts = null;
const web3 = new Web3('http://127.0.0.1:8545'); // SET HERE THE RIGHT ADDRESS!!!

function verifyContract(address) {
  return web3.eth.getCode(address)
      .then(code => {
          if (code === '0x' || code === '0x0') {
              throw new Error('No contract detected at address: ' + address);
          }
          return true;
      });
}

function initializeContractConnection() {
  try {
      // Load the contract ABI and address
      const contractABI = JSON.parse(fs.readFileSync('../build/contracts/AgritechDemo.json')).abi;
      const jsonData = JSON.parse(fs.readFileSync('../contract_address.json', 'utf8'));
      contractAddress = jsonData.address;
      console.log('Contract address:', contractAddress);

      // First verify contract
      return verifyContract(contractAddress)
          .then(() => {
              console.log('Contract verified at address');
              agritechDemo = new web3.eth.Contract(contractABI, contractAddress);
              return true; // Indicate successful verification and initialization
          })
          .catch(error => {
              console.error('Contract verification failed:', error);
              process.exit(1); // Exit immediately on verification failure
          });
  } catch (error) {
      console.error('Error reading or parsing file:', error);
      process.exit(1);
  }
}

async function interactWithContract() {
  console.log('Begin contract interaction test')
  try {

    const wallet = web3.eth.accounts.wallet.add(
      '0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63'
    );

    web3.eth.accounts.wallet.add(
      '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3' // account already defined
    );

    web3.eth.accounts.wallet.add(
      '0x88960e7219ebf9bcfd9dc78f72dd3e95b873ddcd7ab9a17611ce5ca5a04402ee' // Metamask Generated
    );

    web3.eth.accounts.wallet.add(
      '0xecad1d9de7981fe43cdcb1f58dcd7b27610d1fe6fd78a3e4e9e820cf8709fbee' // Metamask Generated
    );

    web3.eth.accounts.wallet.add(
      '0xb009baaea06434ab68eb8dcb2830baa0a54f28e53bd45772b50faafe7153ae0c' // Metamask Generated
    );

    web3.eth.accounts.wallet.add(
      '0x3cea600a3fd3c50cd0c4ff37f918478fc0b9a172f3b1e4caa8a0d28443271366' // Metamask Generated
    );

    /*
    console.log('Account 1 address: ', wallet[0].address);

    console.log('Account 1 key: ', wallet[0].privateKey);

    console.log('Account 2 address: ', wallet[1].address);

    console.log('Account 2 key: ', wallet[1].privateKey);

    console.log('Account 3 address: ', wallet[2].address);

    console.log('Account 3 key: ', wallet[2].privateKey);
    */

    const admin1 = wallet[0].address;
    const admin2 = wallet[1].address;
    const actor1 = wallet[2].address;
    const actor2 = wallet[3].address;
    const device1 = wallet[4].address;
    const device2 = wallet[5].address;

    console.log('Registering second admin2');
    await agritechDemo.methods.registerNewAdmin(admin2).send({ from: admin1 });
    
    console.log('Registering actor1');
    await agritechDemo.methods.registerNewActor(actor1).send({ from: admin1 });

    console.log('Registering actor2');
    await agritechDemo.methods.registerNewActor(actor2).send({ from: admin1 });

    console.log('Registering device1');
    registerTime = Math.floor(Date.now() / 1000);
    await agritechDemo.methods.registerNewDevice(device1, actor1, registerTime).send({ from: admin2 });

    console.log('Registering device2');
    registerTime = Math.floor(Date.now() / 1000);
    await agritechDemo.methods.registerNewDevice(device2, actor2, registerTime).send({ from: admin1 });

    console.log('Adding new cow without device associated');
    const cowId1 = "IT345678901234";
    const registrationTime = Math.floor(Date.now() / 1000);
    await agritechDemo.methods.addCow(cowId1, registrationTime).send({ from: actor1, gas: '2000000'});

    console.log('Associating device1 to cowId1');
    startTime = Math.floor(Date.now() / 1000);
    await agritechDemo.methods.associateDeviceToCow(cowId1, device1, startTime).send({ from: actor1 });

    console.log('Associating device2 to a new cowId2');
    const cowId2 = "IT345678901235";
    startTime = Math.floor(Date.now() / 1000);
    await agritechDemo.methods.associateDeviceToCow(cowId2, device2, startTime).send({ from: actor2, gas: '2000000' });

    const filePath = '../gpsLogExample.json';
    hashResult = computeJsonSha3FromFile(filePath);
    console.log('Computed integrity Segment: %s',hashResult);

    console.log('Storing integrity segment...');
    const updateTime = Math.floor(Date.now() / 1000);
    await agritechDemo.methods.storeIntegritySegment(cowId1, updateTime, hashResult).send({ from: device1 });

    console.log('Dissociating device from cow...');
    const endTime = Math.floor(Date.now() / 1000);
    await agritechDemo.methods.dissociateDeviceToCow(cowId1, device1, endTime).send({ from: actor1 });

    console.log('Initiating ownership transfer...');
    transferTime = Math.floor(Date.now() / 1000);
    await agritechDemo.methods.transferOwnership(cowId1, actor2, transferTime).send({ from: actor1, gas: '2000000' });

    console.log('Attempting to cancel transfer...');
    await agritechDemo.methods.cancelTransfer(cowId1).send({ from: actor2 });

    console.log('Initiating ownership transfer...');
    transferTime = Math.floor(Date.now() / 1000);
    agritechDemo.methods.transferOwnership(cowId1, actor2, transferTime).send({ from: actor1, gas: '2000000' });

    console.log('Accepting ownership...');
    await agritechDemo.methods.acceptOwnership(cowId1).send({ from: actor2, gas: '2000000'  });

    console.log('All interactions completed successfully!');

  } catch (error) {
    console.error('An error occurred:', error);
  }
}

function computeJsonSha3FromFile(filePath) {
  try {
    // Read the JSON file
    const jsonString = fs.readFileSync(filePath, 'utf8');

    // Parse the JSON string to ensure it's valid JSON
    JSON.parse(jsonString);

    // Create a SHA3-256 hash object
    const hash = crypto.createHash('sha3-256');

    // Update the hash object with the JSON string
    hash.update(jsonString);

    // Generate and return the hexadecimal representation of the hash
    return '0x' + hash.digest('hex');
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

// Chain the execution flow
initializeContractConnection()
    .then(success => {
        if (success) {
            interactWithContract(); // Only execute if verification succeeded
        }
    });