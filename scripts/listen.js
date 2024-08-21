const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON request body
app.use(express.json());

/*
app.get("/", function (req, res) {
  res.send("Hello World!");
});
*/

// Route for the "checkIntegrity" service
app.post('/checkIntegrity', (req, res) => {
  // Get the input data from the request body
  const inputData = req.body;

  // Perform your integrity check logic here
  const checkResult = {
    isValid: true,
    message: 'Data integrity check passed.'
  };

  // Send the response as a JSON
  res.json(checkResult);
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});