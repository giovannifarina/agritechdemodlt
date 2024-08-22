const express = require('express');
const { Web3 } = require('web3');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

// Replace with your Ethereum node URL
const providerUrl = 'http://172.19.112.1:7545';
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

// Replace with your smart contract address and ABI
const contractAddress = '0x5516092ed45a6fE0Af52Fb136c9055a1ae97f3Ad';
const contractABI = JSON.parse(fs.readFileSync('../build/contracts/AgritechDemo.json')).abi;

const contract = new web3.eth.Contract(contractABI, contractAddress);

function safeStringify(obj) {
    return JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
  }

  app.post('/get-events', async (req, res) => {
    try {
      // Ensure the request body is in JSON format
      if (!req.is('application/json')) {
        return res.status(400).json({ error: 'Request must be in JSON format' });
      }
  
      // Get the block range from the request body, or use default values
      const fromBlock = req.body.fromBlock || 0;
      const toBlock = req.body.toBlock || 'latest';
  
      // Get IntegritySegment events
      const events = await contract.getPastEvents('IntegritySegment', {
        fromBlock: fromBlock,
        toBlock: toBlock
      });

      // Process and format the events
      const formattedEvents = events.map(event => ({
        cowId: event.returnValues.cowId,
        hash : event.returnValues.hash,
        lastTimestamp : event.returnValues.lastTimestamp
      }));
  
      // Log all events to the console
      console.log('All events:');
      formattedEvents.forEach((event, index) => {
        console.log(`Event ${index + 1}:`);
        console.log(safeStringify(event, null, 2));
        console.log('---');
      });
  
      // Send the response in JSON format
      res.setHeader('Content-Type', 'application/json');
      res.send(safeStringify({
        status: 'success',
        data: formattedEvents
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).send(safeStringify({
        status: 'error',
        message: 'An error occurred while fetching events',
        error: error.message
      }));
    }
  });

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});