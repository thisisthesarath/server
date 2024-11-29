import fetch from 'node-fetch'; // Importing fetch in ESM style
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; // Import dotenv

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000; // Use PORT from .env or default to 5000

app.use(cors()); // Enable CORS
app.use(express.json()); // For parsing application/json

// Define a basic route to check server is running
app.get('/', (req, res) => {
  res.send('Hello, this is the Express server running!');
});

// PBX API route for extensions
app.get('/webapi/core/extension', async (req, res) => {
  try {
    const response = await fetch(`${process.env.PBX_API_URL}/extension`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${process.env.PBX_API_USERNAME}:${process.env.PBX_API_PASSWORD}`).toString('base64'), // Basic Auth
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from PBX API: ${response.statusText}`);
    }

    const data = await response.json(); // Parse the JSON response from PBX
    res.json(data); // Send the real data to the client (React app)
  } catch (error) {
    console.error('Error fetching PBX data:', error.message);
    res.status(500).json({ message: 'Error fetching PBX data' });
  }
});

// PBX API route for call detail records (CDR)
app.get('/webapi/core/cdr', async (req, res) => {
  try {
    const response = await fetch(`${process.env.PBX_API_URL}/cdr`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${process.env.PBX_API_USERNAME}:${process.env.PBX_API_PASSWORD}`).toString('base64'), // Basic Auth
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from PBX API: ${response.statusText}`);
    }

    const data = await response.json(); // Parse the JSON response from PBX
    res.json(data); // Send the real data to the client (React app)
  } catch (error) {
    console.error('Error fetching PBX data:', error.message);
    res.status(500).json({ message: 'Error fetching PBX data' });
  }
});

// PBX API route for extension authentication
app.get('/webapi/core/extension-auth', async (req, res) => {
  try {
    const response = await fetch(`${process.env.PBX_API_URL}/extension`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${process.env.PBX_API_USERNAME}:${process.env.PBX_API_PASSWORD}`).toString('base64'),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from PBX API: ${response.statusText}`);
    }

    const data = await response.json();

    // Extract only extension and password
    const authData = data.map(({ extension, password }) => ({ extension, password }));
    res.json(authData); // Send only the required data
  } catch (error) {
    console.error('Error fetching extension-auth data:', error.message);
    res.status(500).json({ message: 'Error fetching extension-auth data' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
