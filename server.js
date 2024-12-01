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

// PBX API route for users
app.get('/webapi/core/user', async (req, res) => {
  try {
    const response = await fetch(`${process.env.PBX_API_URL}/user`, {
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

// PBX API route for users
app.get('/webapi/core/user-auth', async (req, res) => {
  try {
    const response = await fetch(`${process.env.PBX_API_URL}/user`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${process.env.PBX_API_USERNAME}:${process.env.PBX_API_PASSWORD}`).toString('base64'), // Basic Auth
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from PBX API: ${response.statusText}`);
    }

    const data = await response.json(); // Parse the JSON response from PBX

    // Extract and send only relevant fields (username and password)
    const userData = data.map((user) => ({
      username: user.username, // Adjust field name if different
      password: user.password, // Adjust field name if different
    }));

    res.json(userData); // Send only username and password to the client
  } catch (error) {
    console.error('Error fetching PBX user data:', error.message);
    res.status(500).json({ message: 'Error fetching PBX user data' });
  }
});

// PBX API route for user creation
app.post('/webapi/core/user/create', async (req, res) => {
  try {
    const userData = req.body; // Get user data from the request body

    // Validate required fields
    const requiredFields = ['username', 'password', 'email', 'language', 'timezone', 'first_name', 'last_name', 'organization', 'user_groups', 'domain'];
    const missingFields = requiredFields.filter((field) => !userData[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    const response = await fetch(`${process.env.PBX_API_URL}/user/create.php`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${process.env.PBX_API_USERNAME}:${process.env.PBX_API_PASSWORD}`).toString('base64'), // Basic Auth
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData), // Send user data
    });

    const rawResponse = await response.text(); // Get raw response as text
    console.log('Raw User Creation Response:', rawResponse);

    try {
      // Try parsing the response as JSON
      const apiResponse = JSON.parse(rawResponse);
      if (!response.ok) {
        console.error('API response error:', apiResponse);
        return res.status(response.status).json({
          message: apiResponse.message || 'Failed to create user on PBX.',
        });
      }

      res.status(200).json(apiResponse); // Return successful response to the client
    } catch (parseError) {
      // If parsing fails, log and return the raw response
      console.error('Error parsing response as JSON:', parseError);
      return res.status(500).json({
        message: 'Failed to parse response from PBX API. Raw response: ' + rawResponse,
      });
    }
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// PBX API route for extensions
app.post('/webapi/core/extension/create', async (req, res) => {
  try {
    const extensionData = req.body;

    const requiredFields = [
      'extension',
      'user',
      'voicemail_password',
      'account_code',
      'outbound_caller_id_name',
      'outbound_caller_id_number',
      'effective_caller_id_name',
      'effective_caller_id_number',
      'emergency_caller_id_name',
      'emergency_caller_id_number',
      'max_registrations',
      'limit_max',
      'user_record',
      'domain',
      'context',
      'description',
      'extension_enabled',
    ];

    const missingFields = requiredFields.filter((field) => !extensionData[field]);
    if (missingFields.length > 0) {
      console.error('Missing fields:', missingFields);
      return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    const response = await fetch(`${process.env.PBX_API_URL}/webapi/core/extension/create.php`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${process.env.PBX_API_USERNAME}:${process.env.PBX_API_PASSWORD}`).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(extensionData),
    });

    const rawResponse = await response.text();
    console.log('Raw Extension Creation Response:', rawResponse);

  } catch (error) {
    console.error('Error creating extension:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});