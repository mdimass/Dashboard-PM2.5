document.querySelector(".theme-btn").addEventListener("click", () => {
    document.body.classList.toggle("lightMode");
  });
  

  async function fetchDataAndUpdate() {
    try {
      const response = await fetch('/api/data');
      const response2 = await fetch('/api/lux');
      
      const result = await response.json();
      const result2 = await response2.json();
      console.log(result2);
  
      if (result.success) {
        const data = result.data;
        // const data2 = result2.data;

  
        // Update data di dashboard
        data.forEach((sensor) => {
          if (sensor.sensorType === 'PM2.5 Sensor') {
            document.querySelector('.traffic-data .source p').textContent = `${sensor.value} µm/m3`;
          } else if (sensor.sensorType === 'PM10 Sensor') {
            document.querySelector('.box:nth-child(2) .traffic-data .source p').textContent = `${sensor.value} µm/m3`;
          } else if (sensor.sensorType === 'Noise Sensor') {
            document.querySelector('.box:nth-child(3) .traffic-data .source p').textContent = `${sensor.value} dB`;
          } else if (sensor.sensorType === 'Temperature Sensor') {
            document.querySelector('.box:nth-child(4) .traffic-data .source p').textContent = `${sensor.value} °C`;
          } else if (sensor.sensorType === 'Humidity Sensor') {
            document.querySelector('.box:nth-child(5) .traffic-data .source p').textContent = `${sensor.value} %`;
          } 
        });
        document.querySelector('.box:nth-child(6) .traffic-data .source p').textContent = `${result2.data.data} lx`;
      } else {
        console.error('Failed to retrieve data:', result.error);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  // Update setiap 10 detik
  setInterval(fetchDataAndUpdate, 10000);
  fetchDataAndUpdate(); // Jalankan sekali saat halaman dimuat
  