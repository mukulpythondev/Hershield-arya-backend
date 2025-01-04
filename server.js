require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { LangChain } = require('./langchain'); // Correct the import path

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Initialize LangChain
const langChain = new LangChain();

// Function to read from a file (assuming the file is JSON for simplicity)
const fs = require('fs');
const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

// Endpoint to handle chatbot interactions
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    // Read data from a file (e.g., safety tips, emergency contacts)
    const fileData = await readFile('finetunedata.json');

    // Process the message using LangChain and Gemini model
    const response = await langChain.processMessage(message, fileData);

    res.json({ response });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
