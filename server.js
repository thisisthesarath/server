import fetch from 'node-fetch'; // Import fetch in ESM style
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000; // Use PORT from .env or default to 5000

app.use(cors());
app.use(express.json());

// Basic route to verify the server
app.get('/', (req, res) => {
  res.send('Express server is running!');
});

// Helper function to create headers for API requests
const getHeaders = () => ({
  'Authorization': 'Basic ' + Buffer.from(`${process.env.PBX_API_USERNAME}:${process.env.PBX_API_PASSWORD}`).toString('base64'),
  'Content-Type': 'application/json',
});

// Fetch extensions
app.get('/webapi/core/extension', async (req, res) => {
  try {
    const response = await fetch(`${process.env.PBX_API_URL}/webapi/core/extension`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch extensions: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching extensions:', error.message);
    res.status(500).json({ message: 'Failed to fetch extensions' });
  }
});

app.post('/webapi/core/user/create', async (req, res) => {
  try {
    const userData = req.body;
    const response = await fetch(`${process.env.PBX_API_URL}/webapi/core/user/create.php`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${process.env.PBX_API_USERNAME}:${process.env.PBX_API_PASSWORD}`).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const rawResponse = await response.text(); // Read as plain text
    console.log('Raw User Creation Response:', rawResponse);

    if (!response.ok) {
      return res.status(response.status).json({ message: 'Error from PBX API', details: rawResponse });
    }

    try {
      const apiResponse = JSON.parse(rawResponse); // Attempt to parse JSON
      res.status(200).json(apiResponse);
    } catch (parseError) {
      console.error('Error parsing response as JSON:', parseError.message);
      res.status(500).json({ message: 'PBX API returned non-JSON response.', details: rawResponse });
    }
  } catch (error) {
    console.error('Error creating user:', error.stack || error.message);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});


// Create extension
app.post('/webapi/core/extension/create', async (req, res) => {
  try {
    const extensionData = req.body;

    // Validate required fields
    const requiredFields = ['extension', 'user', 'domain'];
    const missingFields = requiredFields.filter((field) => !extensionData[field]);

    if (missingFields.length) {
      return res.status(400).json({ message: `Missing fields: ${missingFields.join(', ')}` });
    }

    const response = await fetch(`${process.env.PBX_API_URL}/webapi/core/extension/create.php`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(extensionData),
    });

    const rawResponse = await response.text();
    console.log('Extension Creation Response:', rawResponse);

    try {
      const apiResponse = JSON.parse(rawResponse);
      if (!response.ok) {
        return res.status(response.status).json({ message: apiResponse.message || 'Error creating extension.' });
      }
      res.status(200).json(apiResponse);
    } catch (parseError) {
      console.error('Error parsing extension creation response:', parseError);
      res.status(500).json({ message: 'Error parsing response from PBX API.' });
    }
  } catch (error) {
    console.error('Error creating extension:', error.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
