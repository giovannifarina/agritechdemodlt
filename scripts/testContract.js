const { Web3 } = require('web3');
const fs = require('fs');

// Connect to an Ethereum network (replace with your network URL)
const web3 = new Web3('http://localhost:7545');

// Load the contract ABI and address
const contractABI = JSON.parse(fs.readFileSync('../build/contracts/AgritechDemo.json')).abi;
const contractAddress = '0xe7477b0D108f634f7363b9614F5eb9741BDa0D8d'; // Replace with your deployed contract address

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

        
        /*
        // Add cow
        console.log('Adding new cow...');
        const cowId = "12345678901234";
        const registrationTime = Math.floor(Date.now() / 1000);
        await agritechDemo.methods.addCow(cowId, registrationTime).send({ from: actor2 });

        // Associate device to cow
        console.log('Associating device to cow...');
        const startTime = Math.floor(Date.now() / 1000);
        await agritechDemo.methods.associateDeviceToCow(cowId, device1, startTime).send({ from: actor2 });

        // Store integrity segment
        console.log('Storing integrity segment...');
        const updateTime = Math.floor(Date.now() / 1000);
        const gpshash = web3.utils.sha3('Some GPS data');
        await agritechDemo.methods.storeIntegritySegment(cowId, updateTime, gpshash).send({ from: device1 });

        // Dissociate device from cow
        console.log('Dissociating device from cow...');
        const endTime = Math.floor(Date.now() / 1000);
        await agritechDemo.methods.dissociateDeviceToCow(cowId, device1, endTime).send({ from: actor2 });

        // Transfer ownership
        console.log('Initiating ownership transfer...');
        const transferTime = Math.floor(Date.now() / 1000);
        await agritechDemo.methods.transferOwnership(cowId, actor1, transferTime).send({ from: actor2 });

        // Accept ownership
        console.log('Accepting ownership...');
        await agritechDemo.methods.acceptOwnership(cowId).send({ from: actor1 });

        // Cancel transfer (this will fail as the transfer was already accepted, but included for completeness)
        console.log('Attempting to cancel transfer...');
        try {
            await agritechDemo.methods.cancelTransfer(cowId).send({ from: actor1 });
        } catch (error) {
            console.log('Cancel transfer failed as expected:', error.message);
        }

        console.log('All interactions completed successfully!');

        */

    } catch (error) {
        console.error('An error occurred:', error);
    }
}

interactWithContract();