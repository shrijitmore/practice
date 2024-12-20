import { createStation } from './components/Station.js';
import { createConveyorBelt } from './components/ConveyorBelt.js';
import { STATION_COUNT } from './utils/constants.js';
import { readExcelData } from './utils/exceldata.js';
import { ColorChangeComponent } from './components/animateComp.js';
import './styles/main.css';
import './styles/conveyor.css';
import './styles/station.css';
import './styles/cart.css';
import './styles/table.css';

function createDataTable(container) {
  // Create a section for the table
  const tableSection = document.createElement('div');
  tableSection.style.height = '231px'; // Set the height for the scrollable area
  tableSection.style.width = '30%';
  tableSection.style.overflowY = 'hidden';
  tableSection.style.border = '1px solid #ddd'; // Optional: Add a border for better visibility
  tableSection.style.marginTop = '20px'; // Optional: Add some margin

  // Fetch and display the CSV data in a table
  fetch('../data/Table_data.csv')
    .then(response => response.text())
    .then(data => {
      const rows = data.split('\n');
      const tableHeader = rows[0].split(',');
      const tableBody = rows.slice(1);

      // Create table element
      const table = document.createElement('table');
      table.id = 'data-table';
      table.border = '1';

      // Populate table headers
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      tableHeader.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Populate table body
      const tbody = document.createElement('tbody');
      tableBody.forEach(row => {
        if (row.trim()) { // Check if the row is not empty
          const tr = document.createElement('tr');
          const cells = row.split(',');
          cells.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        }
      });
      table.appendChild(tbody);

      // Append the table to the section
      tableSection.appendChild(table);
      // Append the section to the container
      container.appendChild(tableSection);

      // Start removing rows one by one every 2 minutes
      let currentRowIndex = 0;
      const interval = setInterval(() => {
        const tbody = table.querySelector('tbody');
        const rows = tbody.querySelectorAll('tr');
        if (currentRowIndex < rows.length) {
          tbody.removeChild(rows[currentRowIndex]); // Remove the current row
        } else {
          clearInterval(interval); // Stop the interval when all rows are removed
        }
      }, 1200); // 120000 milliseconds = 2 minutes
    })
    .catch(error => console.error('Error fetching the CSV file:', error));
}

function initializeConveyorSystem() {
  const container = document.querySelector('.container');
  const conveyorBeltSystem = document.createElement('div');

  conveyorBeltSystem.className = 'conveyor-belt';

  // Create and display the data table at the top
  createDataTable(container);

  // Add conveyor belt
  conveyorBeltSystem.appendChild(createConveyorBelt());
  
  // Add stations container
  const stations = document.createElement('div');
  stations.className = 'stations';
  
  // Create stations
  for (let i = 0; i < STATION_COUNT; i++) {
    stations.appendChild(createStation(i));
  }

  const button = document.createElement('div');
  button.className = 'Button';

  conveyorBeltSystem.appendChild(stations);
  container.appendChild(conveyorBeltSystem);

  
  // change the color of Component
  const colorChangeButton = ColorChangeComponent();
  document.body.appendChild(colorChangeButton);


}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeConveyorSystem);