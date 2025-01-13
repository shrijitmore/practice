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
    let currentModel = null;
    let station1Model = null;
    let station2Model = null;
    let station3Model = null;

    const updateSystem = () => {
        // Immediately update Model Online card
        if (currentIndex < productionData.length) {
            currentModel = productionData[currentIndex].modelOnline;
            console.log('New model read:', currentModel);
            startCard.innerText = `Model Online: ${currentModel}`;
        }

        // Wait 10 seconds before updating stations
        setTimeout(() => {
            if (currentIndex < productionData.length) {
                // Move models through stations
                if (station2Model) {
                    station3Model = station2Model;
                    updateTableQuantity(station3Model, 2);
                    endCard.innerText = `Model Offline: ${station3Model}`;
                }
                
                if (station1Model) {
                    station2Model = station1Model;
                    updateTableQuantity(station2Model, 1);
                }
                
                if (currentModel) {
                    station1Model = currentModel;
                    updateTableQuantity(station1Model, 0);
                }

                currentIndex++;
                
                // Schedule next model reading
                setTimeout(updateSystem, 0); // Immediately read next model
            } else {
                // Reset when all rows are processed
                console.log('Resetting to start...');
                currentIndex = 0;
                station1Model = null;
                station2Model = null;
                station3Model = null;
                resetTableQuantities();
                setTimeout(updateSystem, 0); // Restart the cycle
            }
        }, 10000); // 10-second delay for station updates
    };

    // Start the system after fetching data
    fetchProductionData().then(data => {
        productionData = data;
        if (productionData.length > 0) {
            console.log('Starting processing of production data...');
            updateSystem();
        } else {
            console.error('No production data available.');
        }
    }).catch(error => {
        console.error('Error fetching production data:', error);
    });
}

document.addEventListener('DOMContentLoaded', initializeConveyorSystem);