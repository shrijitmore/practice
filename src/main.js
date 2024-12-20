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
  tableSection.style.width = '43%';
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
      tableBody.forEach((row, index) => {
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

      // Function to start checking and removing rows
      const startCheckingAndRemovingRows = () => {
        const tbody = table.querySelector('tbody');
        const rows = tbody.querySelectorAll('tr'); // Store rows in a variable
        let currentRowIndex = 0;

        const interval = setInterval(() => {
          if (currentRowIndex < rows.length) {
            const row = rows[currentRowIndex];
            const actualQtyCell = row.cells[6]; // Assuming Actual qty is in the seventh column (index 6)
            const plannedQtyCell = row.cells[5]; // Assuming Qty/planned is in the sixth column (index 5)

            // Get the current Actual qty and planned qty
            let actualQty = parseInt(actualQtyCell.textContent, 10);
            const plannedQty = parseInt(plannedQtyCell.textContent, 10);

            // Increment Actual qty until it equals Planned qty
            if (actualQty < plannedQty) {
              actualQty += 1; // Increment Actual qty by 1
              actualQtyCell.textContent = actualQty; // Update the cell value
            }

            // Check if Actual qty equals or exceeds Qty/planned
            if (actualQty >= plannedQty) {
              row.classList.add('slide-out'); // Add slide-out class

              // Wait for the transition to complete before removing the row
              row.addEventListener('transitionend', () => {
                tbody.removeChild(row); // Remove the current row after slide-out
              }, { once: true }); // Use { once: true } to ensure the event listener is removed after execution

              // Move to the next row without incrementing currentRowIndex
              currentRowIndex++; // Move to the next row
            }
          } else {
            clearInterval(interval); // Stop the interval when all rows are checked
            currentRowIndex = 0; // Reset index to start over if needed
          }
        }, 2000); // 2000 milliseconds = 2 seconds
      };

      // Start checking and removing rows
      startCheckingAndRemovingRows();

      // Update the first row color to yellow and shift it as new rows are added
      const updateFirstRowColor = () => {
        const tbody = table.querySelector('tbody');
        const firstRow = tbody.querySelector('tr');
        if (firstRow) {
          firstRow.style.backgroundColor = 'yellow';
        }
      };

      // Call the function initially
      updateFirstRowColor();

      // Observe changes in the table body to update the first row color
      const observer = new MutationObserver(updateFirstRowColor);
      observer.observe(tbody, { childList: true });

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