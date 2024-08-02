const crypto = require('crypto');
const fs = require('fs');

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

// Example usage:
const filePath = '../gpsLogExample.json';
const hashResult = computeJsonSha3FromFile(filePath);

if (hashResult) {
  console.log('SHA3-256 hash:', hashResult);
} else {
  console.log('Failed to compute hash.');
}