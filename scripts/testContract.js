const { Web3 } = require('web3');
const fs = require('fs');

// Connect to an Ethereum network (replace with your network URL)
const web3 = new Web3('http://localhost:7545');

// Load the contract ABI and address
const contractABI = JSON.parse(fs.readFileSync('../build/contracts/AgritechDemo.json')).abi;
const contractAddress = '0x28E3b1fB6BCC2A1EC3ed92B3B38c02FF8ba7F6fA'; // Replace with your deployed contract address

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

        
        // Register new admin
        console.log('Test registering second admin');
        await agritechDemo.methods.registerNewAdmin(admin2).send({ from: admin1 });

        // Register actor 1
        console.log('Registering actor 1');
        await agritechDemo.methods.registerNewActor(actor1).send({ from: admin1 });

        // Register actor 2
        console.log('Registering actor 2');
        await agritechDemo.methods.registerNewActor(actor2).send({ from: admin1 });

        // Register new device 1
        console.log('Registering new device...');
        const registerTime = Math.floor(Date.now() / 1000);
        await agritechDemo.methods.registerNewDevice(device1, actor1, registerTime).send({ from: admin1 });

        
        /*
        console.log('Registering new device...');
        const registerTime = Math.floor(Date.now() / 1000);
        await agritechDemo.methods.registerNewDevice(device2, actor2, registerTime).send({ from: admin1 });

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