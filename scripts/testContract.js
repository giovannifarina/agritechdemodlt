const { Web3 } = require('web3');
const fs = require('fs');
const crypto = require('crypto');

// Connect to an Ethereum network (replace with your network URL)
const web3 = new Web3('http://172.19.112.1:7545'); // SET HERE THE RIGHT ADDRESS!!!

// Load the contract ABI and address
const contractABI = JSON.parse(fs.readFileSync('../build/contracts/AgritechDemo.json')).abi;
//const contractAddress = '0xFf1206dA3504C064da6ee6D131F57fD89db5e228'; // Replace with your deployed contract address

contractAddress = null;

try {
    // Read and parse the JSON file synchronously
    const jsonData = JSON.parse(fs.readFileSync('../contract_address.json', 'utf8'));
  
    // Retrieve the contract address
    contractAddress = jsonData.address;
  
    console.log('Contract address:', contractAddress);
} catch (error) {
    console.error('Error reading or parsing file:', error);
}

// Create a contract instance
const agritechDemo = new web3.eth.Contract(contractABI, contractAddress);

async function interactWithContract() {
    try {
        // Get accounts from Ganache
        const accounts = await web3.eth.getAccounts();
        console.log('Accounts:', accounts);

        const admin1 = accounts[0];
        const admin2 = accounts[1];
        const actor1 = accounts[2];
        const actor2 = accounts[3];
        const device1 = accounts[4];
        const device2 = accounts[5]
        
        console.log('Registering second admin2');
        await agritechDemo.methods.registerNewAdmin(admin2).send({ from: admin1 });

        console.log('Registering actor1');
        await agritechDemo.methods.registerNewActor(actor1).send({ from: admin1 });

        console.log('Registering actor2');
        await agritechDemo.methods.registerNewActor(actor2).send({ from: admin1 });

        console.log('Registering device1');
        registerTime = Math.floor(Date.now() / 1000);
        await agritechDemo.methods.registerNewDevice(device1, actor1, registerTime).send({ from: admin1 });

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
        await agritechDemo.methods.transferOwnership(cowId1, actor2, transferTime).send({ from: actor1, gas: '2000000' });

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

interactWithContract();