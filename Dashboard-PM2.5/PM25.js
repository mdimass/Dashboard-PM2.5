const axios = require('axios');
const { parseData } = require('./parsing_uc300'); // Import parseData function

// API Keys and Application Details
const apiKey = 'fa9d5d745cf6c1c3:e6147f5fc06ad8d4';

// URL endpoint untuk mendapatkan data
const url = 'https://platform.antares.id:8443/~/antares-cse/antares-id/airqlty/uc300_airqlty/la';

// Headers untuk autentikasi dan otorisasi
const headers = {
  'X-M2M-Origin': apiKey,
  'Content-Type': 'application/json'
};

// Fungsi untuk memformat timestamp CT
function formatTimestamp(ct) {
  const year = ct.slice(0, 4);
  const month = ct.slice(4, 6);
  const day = ct.slice(6, 8);
  const hour = ct.slice(9, 11);
  const minute = ct.slice(11, 13);
  const second = ct.slice(13, 15);
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

// Fungsi untuk mendapatkan data
async function getData() {
  try {
    const response = await axios.get(url, { headers });
    console.log('Data Retrieved:', response.data);

    // Mengambil ct dan data dari respons
    const ct = response.data['m2m:cin'].ct; // Timestamp
    const data = JSON.parse(response.data['m2m:cin'].con).data; // Data uplink (010000)

    // Format ct
    const formattedCT = formatTimestamp(ct);

    // Tampilkan ct dan data
    console.log('Timestamp (CT):', formattedCT);
    console.log('Data:', data);

    // Forward data to the parsing function for processing
    const parsedData = parseData(data);

    // Tampilkan hasil parsing
    parsedData.forEach((entry, index) => {
      console.log(`Parsed Entry ${index + 1}:`, entry);
    });

  } catch (error) {
    console.error('Error fetching data from Antares:', error);
  }
}

setInterval(getData, 10000);
