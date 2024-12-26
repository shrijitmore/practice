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
function fetchModelNumbers() {
    return fetch('../data/Twin_data.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').slice(1); // Skip the header row
            const modelNumbers = rows.map(row => {
                const columns = row.split(',');
                return columns[4]; // Model No. is in the 5th column (index 4)
            }).filter(model => model); // Filter out any empty values
            return modelNumbers;
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

    const conveyorBeltSystem = document.createElement('div');
    conveyorBeltSystem.className = 'conveyor-belt-container'; // New container for cards and conveyor belt

    // Create and display the data table at the top
    createDataTable(container);

    // Create start and end cards
    const startCard = createCard(''); // Start card
    startCard.classList.add('start-card'); // Add class for green background
    const endCard = createCard(''); // End card
    endCard.classList.add('end-card'); // Add class for red background

    conveyorBeltSystem.appendChild(startCard); // Append start card to the conveyor belt
    conveyorBeltSystem.appendChild(createConveyorBelt()); // Add conveyor belt
    conveyorBeltSystem.appendChild(endCard); // Append end card to the conveyor belt

    container.appendChild(conveyorBeltSystem); // Append the conveyor belt system to the container

    // Fetch model numbers and update the cards every 10 seconds
    fetchModelNumbers().then(modelNumbers => {
        let currentIndex = 0; // Current index for the start card
        let previousModelNumber = ''; // Variable to hold the previous model number for the end card

        // Function to update the cards with the current model number
        const updateCards = () => {
            if (modelNumbers.length > 0) {
                // Update the end card with the previous model number
                endCard.innerText = `Model Offline: ${previousModelNumber}`; // Update end card with the previous model number

                // Update the start card with the current model number
                const modelNumber = modelNumbers[currentIndex]; // Get the current model number
                startCard.innerText = `Model Online: ${modelNumber}`; // Update start card

                // Store the current model number as the previous model number for the next update
                previousModelNumber = modelNumber;

                // Move to the next model number
                currentIndex = (currentIndex + 1) % modelNumbers.length; // Cycle through the model numbers
            }
        };

        // Initial update
        updateCards();
        // Update the cards every 10 seconds (10000 milliseconds)
        setInterval(updateCards, 10000);
    });

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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeConveyorSystem);