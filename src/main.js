import { createStation } from './components/Station.js';
import { createConveyorBelt } from './components/ConveyorBelt.js';
import { STATION_COUNT } from './utils/constants.js';
import { ColorChangeComponent } from './components/animateComp.js';
import './styles/main.css';
import './styles/conveyor.css';
import './styles/station.css';
import './styles/cart.css';
import './styles/table.css';

export const startCheckingAndRemovingRows = (table) => {
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

function createDataTable(container) {
    // Create a section for the table
    const tableSection = document.createElement('div');
    tableSection.style.height = '217px'; // Set the height for the scrollable area
    tableSection.style.width = '62%';
    tableSection.style.overflowY = 'hidden';
    tableSection.style.border = '1px solid #ddd'; // Optional: Add a border for better visibility
    tableSection.style.marginTop = '20px'; // Optional: Add some margin

    // Fetch and display the CSV data in a table
    fetch('../data/Twin_data.csv')
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

function createCard(title) {
    const card = document.createElement('div');
    card.className = 'card'; // Add a class for styling
    card.innerText = title; // Set the card title
    return card;
}

// Function to fetch and parse the CSV data
function fetchProductionData() {
    return fetch('../data/Profuction_Table.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').slice(1); // Skip the header row
            const productionData = rows.map(row => {
                const columns = row.split(',');
                return {
                    timestamp: columns[1],
                    modelOnline: columns[4],
                    modelOffline: columns[5]
                };
            }).filter(item => item.modelOnline && item.modelOffline); // Filter out any empty values
            return productionData;
        })
        .catch(error => {
            console.error('Error fetching the CSV file:', error);
            return [];
        });
}

// Function to initialize the conveyor system
function initializeConveyorSystem() {
    const container = document.querySelector('.container');

    // Clear any existing conveyor belt to prevent duplicates
    const existingBelt = container.querySelector('.conveyor-belt');
    if (existingBelt) {
        existingBelt.remove(); // Remove existing conveyor belt if it exists
    }

    // Create and display the conveyor belt
    const conveyorBelt = createConveyorBelt(); // Ensure this function is called
    container.appendChild(conveyorBelt); // Append the conveyor to the container

    // Create and display the data table at the top
    createDataTable(container);

    // Create and display the cards
    createCards(container);

    // Add stations container
    const stations = document.createElement('div');
    stations.className = 'stations';
    
    // Create stations
    for (let i = 0; i < STATION_COUNT; i++) {
        stations.appendChild(createStation(i));
    }

    container.appendChild(stations);

    // Change the color of Component
    const colorChangeButton = ColorChangeComponent();
    document.body.appendChild(colorChangeButton);
}

// Function to create and display the cards
function createCards(container) {
    const startCard = document.createElement('div');
    startCard.className = 'card start-card'; // Add class for styling
    const endCard = document.createElement('div');
    endCard.className = 'card end-card'; // Add class for styling

    // Append cards to the container
    container.appendChild(startCard);
    container.appendChild(endCard);

    let productionData = []; // Array to hold the fetched production data
    let currentIndex = 0; // Index to track the current entry
    let previousModelOnline = ''; // Variable to hold the previous value of Model Online
    let currentRowIndex = 0;

    // Function to fetch and update the production data
    const fetchAndUpdateData = () => {
        fetchProductionData().then(data => {
            productionData = data; // Store the fetched data
            if (productionData.length > 0) {
                // Update the end card with the previous value of startCard
                endCard.innerText = `Model Offline: ${previousModelOnline}`; // Update end card with previous value
                
                // Get the current model online
                const currentModelOnline = productionData[currentIndex].modelOnline; // Store current value for next update
                startCard.innerText = `Model Online: ${currentModelOnline}`; // Update start card
                
                // Only update if the model online has changed
                if (currentModelOnline !== previousModelOnline) {
                    previousModelOnline = currentModelOnline; // Update previous model online

                    // Update the actual quantity in the table based on the new model online
                    const tbody = document.querySelector('#data-table tbody');
                    const rows = tbody.querySelectorAll('tr');

                    // Check if the current row index is within bounds
                    if (currentRowIndex < rows.length) {
                        const row = rows[currentRowIndex];
                        const modelCell = row.cells[4]; // Assuming model is in the fifth column (index 4)
                        const actualQtyCell = row.cells[6]; // Assuming Actual qty is in the seventh column (index 6)
                        const plannedQtyCell = row.cells[5]; // Assuming Qty/planned is in the sixth column (index 5)

                        // Debugging logs to check values
                        console.log('Current Model Online:', currentModelOnline);
                        console.log('Model Cell Value:', modelCell ? modelCell.textContent : 'Model Cell Not Found');

                        if (modelCell && modelCell.textContent.trim() === currentModelOnline.trim()) {
                            let actualQty = parseInt(actualQtyCell.textContent, 10);
                            actualQty += 1; // Increment Actual qty by 1
                            actualQtyCell.textContent = actualQty; // Update the cell value

                            // Debugging logs
                            console.log('Updated Actual Quantity:', actualQty);
                            console.log('Row:', row);
                            console.log('Actual Qty Cell:', actualQtyCell);

                            // Check if Actual qty equals Planned qty
                            const plannedQty = parseInt(plannedQtyCell.textContent, 10);
                            if (actualQty >= plannedQty) {
                                row.classList.add('slide-out'); // Add slide-out class

                                // Wait for the transition to complete before removing the row
                                row.addEventListener('transitionend', () => {
                                    tbody.removeChild(row); // Remove the current row after slide-out
                                }, { once: true }); // Use { once: true } to ensure the event listener is removed after execution
                            }
                        } else {
                            console.log('Condition not met: Model Cell does not match Current Model Online');
                        }

                        // Move to the next row for the next update
                        currentRowIndex++;
                    } else {
                        // Reset the index if all rows have been processed
                        currentRowIndex = 0;
                    }
                }

                currentIndex = (currentIndex + 1) % productionData.length;
            }
        }).catch(error => {
            console.error('Error fetching production data:', error);
        });
    };

    // Initial fetch and update
    fetchAndUpdateData();
    // Set interval to fetch new data every 10 seconds
    setInterval(fetchAndUpdateData, 10000); // 10000 milliseconds = 10 seconds
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeConveyorSystem);