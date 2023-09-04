const path = require('path');
const fs = require('fs').promises;
const http = require('http'); // or 'https' for HTTPS requests
const { generateRandomNumber } = require('../utils'); // Assuming you have a utility function for random numbers

const storagePath2 = path.join(__dirname, '../../data/users');

// Define the endpoint URL and attributes to extract
const apiUrl = 'http://jsonplaceholder.typicode.com/users';
const attributesToExtract = ['name', 'email', 'city'];

const getUsers = async (countHeaderValue) => { 
  try {
    const data = await fetchData(apiUrl); // Fetch data from the API
    const transformedData = transformData(data, attributesToExtract); // Transform the data
    const fileName = await writeTransformedDataToFile(transformedData); // Write transformed data to a file
    const userData = await readUserFromFile(fileName); // Read user data from the file
    return { userData, status: 200 };
  } catch (err) {
    console.error(err);
    // Handle the error as needed, or throw it for higher-level handling
    throw err;
  }
}

// Function to make an HTTP GET request and fetch JSON data

async function fetchData(apiUrl) {
    return new Promise((resolve, reject) => {
      http.get(apiUrl, (response) => {
        let data = '';
  
        response.on('data', (chunk) => {
          data += chunk;
        });
  
        response.on('end', () => {
          try {
            const responseData = JSON.parse(data);
            resolve(responseData);
          } catch (error) {
            reject(new Error(`Error parsing JSON: ${error.message}`));
          }
        });
      }).on('error', (error) => {
        reject(new Error(`Error making HTTP request: ${error.message}`));
      });
    });
   }

// Function to transform JSON data and extract specific attributes
function transformData(data, attributesToExtract) {
  return data.map(item => {
    const transformedItem = {};
    for (const attribute of attributesToExtract) {
      if (attribute === 'city' && item.address && item.address.city) {
        transformedItem[attribute] = item.address.city;
      } else if (item.hasOwnProperty(attribute)) {
        transformedItem[attribute] = item[attribute];
      }
    }
    return transformedItem;
  });
}

// Function to write transformed user data to a file
async function writeTransformedDataToFile(transformedUser) {
  const fileName = `${storagePath2}/${generateRandomNumber()}.json`;
  try {
    await fs.writeFile(fileName, JSON.stringify(transformedUser, null, 2), 'utf8');
    console.log('File writing success!');
    return fileName;
  } catch (err) {
    console.error('Error at file writing: ', err);
    throw new Error('Error at file writing!');
  }
}

// Function to read user data from a file
async function readUserFromFile(fileName) {
  try {
    const contents = await fs.readFile(fileName, { encoding: 'utf8' });
    return JSON.parse(contents);
  } catch (err) {
    console.error('Error at file reading: ', err);
    throw new Error('Error at file reading!');
  }
}

module.exports = getUsers;
