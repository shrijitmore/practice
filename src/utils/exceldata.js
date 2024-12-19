export function readExcelData(filePath) {
  return fetch(filePath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Check if we're getting CSV content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('Received HTML instead of CSV - check file path');
      }
      return response.text();
    })
    .then(csvText => {
      if (csvText.includes('<!DOCTYPE html>')) {
        throw new Error('Received HTML instead of CSV - check file path');
      }
      
      const lines = csvText.split('\n');
      if (lines.length === 0) {
        throw new Error('CSV file is empty');
      }
      
      const headers = lines[0].split(',').map(header => header.trim());
      return lines.slice(1)
        .filter(line => line.trim() !== '') // Skip empty lines
        .map(line => {
          const values = line.split(',').map(value => value.trim());
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index];
          });
          return row;
        });
    })
    .catch(error => {
      console.error("Error reading CSV file:", error);
      return [];
    });
}