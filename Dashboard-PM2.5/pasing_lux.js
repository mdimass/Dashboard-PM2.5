// Fungsi untuk mengonversi hexadecimal ke INT32 (Little Endian)
function hexToInt32LittleEndian(hex) {
    // Membalik urutan byte untuk Little Endian
    let reversedHex = hex.match(/../g).reverse().join('');
    let intValue = parseInt(reversedHex, 16);

    // Mengelola angka negatif (INT32)
    if (intValue > 0x7FFFFFFF) {
        intValue -= 0x100000000;
    }

    return intValue;
}

// Fungsi untuk mem-parsing payload LoRaWAN
function parseLoRaPayload(payload) {
    // Menghilangkan spasi atau karakter yang tidak diperlukan
    payload = payload.replace(/\s+/g, '');

    // Memecah payload menjadi komponen-komponen
    let modbus = payload.slice(0, 4); // FF19
    let channelID = payload.slice(4, 6); // 00
    let dataSize = payload.slice(6, 8); // 04
    let dataType = payload.slice(8, 10); // 04
    let data = payload.slice(10); // 0a000000

    // Mengonversi data INT32 dari Little Endian
    let convertedData = hexToInt32LittleEndian(data);

    return {
        modbus,
        channelID,
        dataSize: parseInt(dataSize, 16),
        dataType: parseInt(dataType, 16),
        data: convertedData
    };
}

// Contoh penggunaan


/* Output yang diharapkan:
{
  modbus: 'ff19',
  channelID: '00',
  dataSize: 4,
  dataType: 4,
  data: 10
}
*/
module.exports = { parseLoRaPayload };

