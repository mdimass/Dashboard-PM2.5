const express = require('express');
const path = require('path');
const axios = require('axios');
const { parseData } = require('./parsing_uc300');
const { parseLoRaPayload } = require('./pasing_lux')

const app = express();
const PORT = 3000;

// API Keys dan Detail Antares
const apiKey = 'fa9d5d745cf6c1c3:e6147f5fc06ad8d4';
const antaresUrl = 'https://platform.antares.id:8443/~/antares-cse/antares-id/airqlty/uc300_airqlty/la';
const antaresUrl2 = 'https://platform.antares.id:8443/~/antares-cse/antares-id/airqlty/4231_Lux/la';
const headers = {
  'X-M2M-Origin': apiKey,
  'Content-Type': 'application/json',
};

// Folder static untuk file frontend
app.use(express.static(path.join(__dirname, 'public')));

// Route utama untuk dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// API untuk mengambil data terbaru dari Antares
app.get('/api/data', async (req, res) => {
  try {
    const response = await axios.get(antaresUrl, { headers });
    const rawData = JSON.parse(response.data['m2m:cin'].con).data;
    const parsedData = parseData(rawData);
    console.log(" data : ", rawData);

    res.json({
      success: true,
      data: parsedData,
    });
  } catch (error) {
    console.error('Error fetching data from Antares:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch data' });
  }
});


// API untuk mengambil data terbaru dari Antares
app.get('/api/lux', async (req, res) => {
  try {
    const response = await axios.get(antaresUrl2, { headers });
    const rawData = JSON.parse(response.data['m2m:cin'].con).data;
    const parsedData = parseLoRaPayload(rawData);
    console.log("lux data : ", parsedData);

    res.json({
      success: true,
      data: parsedData,
    });
  } catch (error) {
    console.error('Error fetching data from Antares:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch data' });
  }
});


// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
