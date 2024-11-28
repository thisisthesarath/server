import fetch from 'node-fetch'; // Importing fetch in ESM style

import express from 'express';
import cors from 'cors';

const app = express();
const port = 5000;

app.use(cors()); // Enable CORS
app.use(express.json()); // For parsing application/json

// Define a basic route to check server is running
app.get('/', (req, res) => {
  res.send('Hello, this is the Express server running on port 5000!');
});

// Your PBX API route
app.get('/webapi/core/extension', async (req, res) => {
  try {
    const response = await fetch('https://pbx.johnsamuel.in/webapi/core/extension', {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + Buffer.from('sarath:Sarath0(*pbx').toString('base64'), // Basic Auth
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from PBX API');
    }

    const data = await response.json(); // Parse the JSON response from PBX
    res.json(data); // Send the real data to the client (React app)

  } catch (error) {
    console.error('Error fetching PBX data:', error);
    res.status(500).json({ message: 'Error fetching PBX data' });
  }
});

app.get('/webapi/core/cdr', async (req, res) => {
  try {
    const response = await fetch('https://pbx.johnsamuel.in/webapi/core/cdr', {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + Buffer.from('sarath:Sarath0(*pbx').toString('base64'), // Basic Auth
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from PBX API');
    }

    const data = await response.json(); // Parse the JSON response from PBX
    res.json(data); // Send the real data to the client (React app)

  } catch (error) {
    console.error('Error fetching PBX data:', error);
    res.status(500).json({ message: 'Error fetching PBX data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
