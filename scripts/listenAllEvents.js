const { Web3 } = require('web3');
const fs = require('fs');

// Connect to an Ethereum network (replace with your network URL)
const web3 = new Web3('http://172.19.112.1:7545'); //SET HERE THE RIGHT ADDRESS!!!

// Load the contract ABI and address
const contractABI = JSON.parse(fs.readFileSync('../build/contracts/AgritechDemo.json')).abi;
//const contractAddress = '0xFEBb7251085b6fF35E6D78458Fe93808CEA4fa79'; // Replace with your deployed contract address

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
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Function to scan blocks and print events
async function scanBlocksForEvents(startBlock, endBlock) {
    console.log(`Scanning blocks from ${startBlock} to ${endBlock}...`);

    for (let i = startBlock; i <= endBlock; i++) {
        const block = await web3.eth.getBlock(i, true);
        
        console.log(`Scanning block ${i}...`);

        if (block && block.transactions) {
            for (let tx of block.transactions) {
                if (tx.to && tx.to.toLowerCase() === contractAddress.toLowerCase()) {
                    const receipt = await web3.eth.getTransactionReceipt(tx.hash);
                    
                    for (let log of receipt.logs) {
                        try {
                            const eventAbi = contract.options.jsonInterface.find(o => o.type === 'event' && o.signature === log.topics[0]);
                            
                            if (!eventAbi) {
                                console.log('Unknown event signature:', log.topics[0]);
                                continue;
                            }
        
                            const event = web3.eth.abi.decodeLog(
                                eventAbi.inputs,
                                log.data,
                                log.topics.slice(1)
                            );
        
                            console.log('Event detected:');
                            console.log('Event Name:', eventAbi.name);  // This line is updated
                            console.log('Event Data:', event);
                            console.log('Transaction Hash:', tx.hash);
                            console.log('Block Number:', i);
                            console.log('------------------------');
                        } catch (error) {
                            console.error('Error decoding event:', error);
                        }
                    }
                }
            }
        }
    }

    console.log('Finished scanning blocks.');
}

// Get the latest block number and start scanning
async function main() {
    const latestBlock = await web3.eth.getBlockNumber();
    const startBlock = 0; // Replace with the block number you want to start from

    await scanBlocksForEvents(startBlock, latestBlock);
}

main().catch(console.error);