const { Web3 } = require('web3');
const fs = require('fs');

// Connect to an Ethereum network (replace with your network URL)
const web3 = new Web3('http://localhost:7545');

// Load the contract ABI and address
const contractABI = JSON.parse(fs.readFileSync('../build/contracts/AgritechDemo.json')).abi;
const contractAddress = '0x76F485763e28b2D68aC5d8853eE636CE094EaD43'; // Replace with your deployed contract address

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