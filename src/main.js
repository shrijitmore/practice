import { createStation } from './components/Station.js';
import { createConveyorBelt } from './components/ConveyorBelt.js';
import { STATION_COUNT } from './utils/constants.js';
import { ColorChangeComponent } from './components/animateComp.js';
import './styles/main.css';
import './styles/conveyor.css';
import './styles/station.css';
import './styles/cart.css';

export const startCheckingAndRemovingRows = (productionData) => {
    let currentRowIndex = 0;

    const interval = setInterval(() => {
        if (currentRowIndex < productionData.length) {                                                                                                    
            const item = productionData[currentRowIndex];
            // Process the item as needed
            // For example, you can log or update UI based on item data

            // Simulate processing
            console.log(`Processing item: ${item.batchNo}, ${item.modelNo}`);

            currentRowIndex++; // Move to the next item after processing
        } else {
            clearInterval(interval);
        }
    }, 30000); // Check every 30 seconds
};

function fetchProductionData() {
    return fetch('../data/Production_Table.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').map(row => row.trim()).filter(row => row.length > 0); // Remove empty rows
            const productionData = rows.slice(1).map(row => { // Skip the header row
                const columns = row.split(',');
                return {
                    srNo: columns[0] ? columns[0].trim() : null,
                    shift: columns[1] ? columns[1].trim() : null,
                    batchNo: columns[2] ? columns[2].trim() : null,
                    timestampModelOnline: columns[3] ? columns[3].trim() : null,
                    modelOnline: columns[4] ? columns[4].trim() : null,
                    timestampStation1: columns[5] ? columns[5].trim() : null,
                    station1Offline: columns[6] ? columns[6].trim() : null,
                    timestampStation2: columns[7] ? columns[7].trim() : null,
                    station2Offline: columns[8] ? columns[8].trim() : null,
                    timestampStation3: columns[9] ? columns[9].trim() : null,
                    station3Offline: columns[10] ? columns[10].trim() : null
                };
            });

            return productionData;
        })
        .catch(error => {
            console.error('Error fetching the CSV file:', error);
            return [];
        });
}

function initializeConveyorSystem() {
    const container = document.querySelector('.container');

    const existingBelt = container.querySelector('.conveyor-belt');
    if (existingBelt) {
        existingBelt.remove();
    }

    // Fetch production data to get the current model online
    fetchProductionData().then(productionData => {
        const currentModelOnline = productionData.length > 0 ? productionData[0].modelOnline : null;
        console.log('Current Model Online:', currentModelOnline);
        const conveyorBelt = createConveyorBelt(currentModelOnline);
        container.appendChild(conveyorBelt);

        const stations = document.createElement('div');
        stations.className = 'stations';
        createCards(container);
        
        for (let i = 0; i < STATION_COUNT; i++) {
            const station = createStation(i);
            stations.appendChild(station);
        }

        container.appendChild(stations);

        const colorChangeButton = ColorChangeComponent();
        document.body.appendChild(colorChangeButton);

        // Start checking and removing rows
        startCheckingAndRemovingRows(productionData);
    }).catch(error => {
        console.error('Error fetching production data:', error);
    });
}

function updateTableQuantity(modelOffline, tableIndex) {
    console.log('Updating quantity for model:', modelOffline);
    const table = document.querySelectorAll('.station-table')[tableIndex];
    
    if (table) {
        const rows = table.querySelectorAll('tr');
        
        rows.forEach(row => {
            const modelCell = row.cells[0];
            const qtyCell = row.cells[1];
            
            if (modelCell && qtyCell) {
                console.log('Checking row:', modelCell.textContent, 'against:', modelOffline);
                if (modelCell.textContent === modelOffline) {
                    const currentQty = parseInt(qtyCell.textContent) || 0;
                    console.log('Updating quantity from', currentQty, 'to', currentQty + 1);
                    qtyCell.textContent = currentQty + 1;
                }
            }
        });
    }
}

function createCards(container) {
    const startCard = document.createElement('div');
    startCard.className = 'card start-card';
    const endCard = document.createElement('div');
    endCard.className = 'card end-card';

    container.appendChild(startCard);
    container.appendChild(endCard);

    let productionData = [];
    let currentIndex = 0;

    const resetTableQuantities = () => {
        console.log('Resetting table quantities...');
        const tables = document.querySelectorAll('.station-table');
        tables.forEach(table => {
            const rows = table.querySelectorAll('tr');
            rows.forEach((row, rowIndex) => {
                if (rowIndex === 0) return; // Skip the header row
                const qtyCell = row.cells[1];
                if (qtyCell) {
                    qtyCell.textContent = '0';
                }
            });
        });
    };

    const processRow = (index) => {
        if (index >= productionData.length) {
            console.log('All rows processed. Resetting and starting over.');
            resetTableQuantities(); // Reset quantities after processing all rows
            currentIndex = 0; // Reset index to start from the beginning
            setTimeout(() => processRow(currentIndex), 1000); // Start processing from the beginning after a short delay
            return;
        }

        const currentItem = productionData[index];
        const { modelOnline, station1Offline, station2Offline, station3Offline } = currentItem;

        console.log(`Processing row ${index + 1}: Model Online - ${modelOnline}`);

        // Update Model Online card
        startCard.innerText = `Model Online: ${modelOnline}`;

        // Update Station 1
        setTimeout(() => {
            console.log(`Updating Station 1 for model: ${station1Offline}`);
            updateTableQuantity(station1Offline, 0);
        }, 10000); // 10 seconds delay for station 1

        // Update Station 2
        setTimeout(() => {
            console.log(`Updating Station 2 for model: ${station2Offline}`);
            updateTableQuantity(station2Offline, 1);
        }, 20000); // 20 seconds delay for station 2

        // Update Station 3 and Model Offline card
        setTimeout(() => {
            console.log(`Updating Station 3 for model: ${station3Offline}`);
            updateTableQuantity(station3Offline, 2);
            endCard.innerText = `Model Offline: ${station3Offline}`;

            // Move to the next row after processing Station 3
            processRow(index + 1);
        }, 30000); // 30 seconds delay for station 3
    };

    fetchProductionData().then(data => {
        productionData = data;
        if (productionData.length > 0) {
            console.log('Starting processing of production data...');
            processRow(currentIndex);
        } else {
            console.error('No production data available.');
        }
    }).catch(error => {
        console.error('Error fetching production data:', error);
    });
}

document.addEventListener('DOMContentLoaded', initializeConveyorSystem);