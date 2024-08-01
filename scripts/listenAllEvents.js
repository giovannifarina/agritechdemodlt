const { Web3 } = require('web3');
const fs = require('fs');

// Connect to an Ethereum network (replace with your network URL)
const web3 = new Web3('http://localhost:7545');

// Load the contract ABI and address
const contractABI = JSON.parse(fs.readFileSync('/Users/giovannifarina/TestTruffle/build/contracts/Agritech.json')).abi;
const contractAddress = '0xbAFb5d7c6DA491951CAed0F8C41Cfaeecbad0264'; // Replace with your deployed contract address

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
                            const event = web3.eth.abi.decodeLog(
                                contract.options.jsonInterface.find(o => o.type === 'event' && o.signature === log.topics[0]).inputs,
                                log.data,
                                log.topics.slice(1)
                            );

                            console.log('Event detected:');
                            console.log('Event Name:', log.topics[0]);
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