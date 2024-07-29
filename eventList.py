from web3 import Web3

# Connect to Ganache
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:7545'))  # Default Ganache HTTP server

# Verify connection
if w3.is_connected():
    print("Connected to Ganache")
else:
    print("Failed to connect to Ganache")

# The rest of your code remains the same
# Contract address and ABI
contract_address = '0xc32336B7242481AdaB91aAFf3c3B0D4be993aFaB'  # Replace with your contract address
contract_abi = [
	{
		"inputs": [],
		"name": "greet",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": False,
		"inputs": [
			{
				"indexed": False,
				"internalType": "string",
				"name": "message",
				"type": "string"
			}
		],
		"name": "SayHello",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getGreeting",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "greeting",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]  # Replace with your contract ABI

# Create contract instance
contract = w3.eth.contract(address=contract_address, abi=contract_abi)

# Get the latest block number
latest_block = w3.eth.get_block('latest')['number']

# Fetch all events
all_events = []
for i in range(latest_block + 1):
    events = contract.events.SayHello().get_logs(fromBlock=i, toBlock=i)
    all_events.extend(events)

# Print events
for event in all_events:
    print(f"Event: {event['event']}")
    print(f"Block: {event['blockNumber']}")
    print(f"Transaction Hash: {event['transactionHash'].hex()}")
    print(f"Args: {event['args']}")
    print("---")
