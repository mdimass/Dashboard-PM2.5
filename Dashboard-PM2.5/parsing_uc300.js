// parsing_UC300.js

// Data LoRaWAN
function reverseBytes(value) {
    return value.match(/../g).reverse().join('');
  }
  
  function parseData(data) {
    const results = [];
    let i = 0;
  
    while (i < data.length) {
      const prefix = data.slice(i, i + 4);
      i += 4;
  
      if (prefix === "ff19") {
        const channel = parseInt(data.slice(i, i + 2), 16);
        i += 2;
  
        const size = parseInt(data.slice(i, i + 2), 16);
        i += 2;
  
        const registerType = parseInt(data.slice(i, i + 2), 16);
        i += 2;
  
        const valueHex = reverseBytes(data.slice(i, i + size * 2));
        i += size * 2;
  
        let value = parseInt(valueHex, 16);
        
        let sensorType;
        switch (channel) {
          case 0: // Noise Sensor
            sensorType = "Noise Sensor";
            value /= 10; // Membagi nilai dengan 10
            break;
          case 2:
            sensorType = "PM2.5 Sensor";
            break;
          case 3:
            sensorType = "PM10 Sensor";
            break;
          case 4: // Temperature Sensor
            sensorType = "Temperature Sensor";
            value /= 10; // Membagi nilai dengan 10
            break;
          case 5: // Humidity Sensor
            sensorType = "Humidity Sensor";
            value /= 10; // Membagi nilai dengan 10
            break;
          default:
            sensorType = "Unknown Sensor";
        }
  
        results.push({
          channel,
          value,
          sensorType,
        });
      } else if (prefix === "ff15") {
        const errorCode = parseInt(data.slice(i, i + 2), 16);
        i += 2;
        results.push({ prefix, errorCode, description: "MODBUS ERROR" });
      } else {
        console.error(`Unknown prefix: ${prefix}`);
        break;
      }
    }
  
    return results;
  }
  
  // Export the parseData function
  module.exports = { parseData };
  