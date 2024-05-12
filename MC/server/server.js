import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
const port = 8080;
const dataFilePath = './login.json';
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Function to read data from JSON file
function readDataFromJSONFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(dataFilePath, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
        return; // Exit early if there's an error
      }
      
      // Check if the file is empty
      if (!data.trim()) {
        resolve([]); // Return an empty array if the file is empty
        return;
      }

      // Parse the data as JSON
      try {
        resolve(JSON.parse(data));
      } catch (parseError) {
        reject(parseError); // Reject if parsing fails
      }
    });
  });
}


// Function to write data to JSON file


async function writeDataToJSONFile(newData) {
  try {
    // Read existing data from the JSON file
    let oldData = await readDataFromJSONFile();

    // Check if the file is empty or oldData is not an array
    if (!Array.isArray(oldData) || oldData.length === 0) {
      // If the file is empty or oldData is not an array, initialize oldData as an empty array
      oldData = [];
    }
    console.log(oldData)
    // Check if the username already exists in the old data using a for loop
    for (let i = 0; i < oldData.length; i++) {
      if (oldData[i].name === newData.name) {
        throw new Error('Username already exists');
      }
    }

    // Add the new data to the existing data
    oldData.push(newData);

    // Write the combined data back to the JSON file
    await fs.promises.writeFile(dataFilePath, JSON.stringify(oldData, null, 2));
    console.log('Data written to JSON file successfully.');
  } catch (error) {
    console.error('Error writing to JSON file:', error);
    throw error; // Rethrow the error for the caller to handle
  }
}










// Route to handle GET request for reading data
app.get('/api/data', async (req, res) => {
  try {
    const data = await readDataFromJSONFile();
    console.log('Data read from JSON file:', data);
    res.json(data);
  } catch (error) {
    console.error('Error reading JSON file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to handle POST request for writing data
app.post('/api/data', async (req, res) => {
  try {
    console.log('Data received:', req.body);
    const newData = req.body;
    await writeDataToJSONFile(newData);
    res.status(201).json({ message: 'Data written to JSON file successfully' });
  } catch (error) {
    console.error('Error writing to JSON file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
