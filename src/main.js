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
    const rows = tbody.querySelectorAll('tr');
    let currentRowIndex = 0;

    const interval = setInterval(() => {
        if (currentRowIndex < rows.length) {
            const row = rows[currentRowIndex];
            const actualQtyCell = row.cells[6];
            const plannedQtyCell = row.cells[5];

            let actualQty = parseInt(actualQtyCell.textContent, 10);
            const plannedQty = parseInt(plannedQtyCell.textContent, 10);

            actualQty += 1;
            actualQtyCell.textContent = actualQty;

            if (actualQty >= plannedQty) {
                row.classList.add('slide-out');
                row.addEventListener('transitionend', () => {
                    tbody.removeChild(row);
                    currentRowIndex++;
                }, { once: true });
            }
        } else {
            clearInterval(interval);
            currentRowIndex = 0;
        }
    }, 3333.3);
};

function createDataTable(container) {
    const tableSection = document.createElement('div');
    tableSection.style.height = '217px';
    tableSection.style.width = '62%';
    tableSection.style.overflowY = 'hidden';
    tableSection.style.border = '1px solid #ddd';
    tableSection.style.marginTop = '20px';

    fetch('../data/Twin_data.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n');
            const tableHeader = rows[0].split(',');
            const tableBody = rows.slice(1);

            const table = document.createElement('table');
            table.id = 'data-table';
            table.border = '1';

            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            tableHeader.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            tableBody.forEach((row, index) => {
                if (row.trim()) {
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

            tableSection.appendChild(table);
            container.appendChild(tableSection);

            const updateFirstRowColor = () => {
                const tbody = table.querySelector('tbody');
                const firstRow = tbody.querySelector('tr');
                if (firstRow) {
                    firstRow.style.backgroundColor = 'yellow';
                }
            };

            updateFirstRowColor();

            const observer = new MutationObserver(updateFirstRowColor);
            observer.observe(tbody, { childList: true });

            // Start checking and removing rows
            startCheckingAndRemovingRows(table);
        })
        .catch(error => console.error('Error fetching the CSV file:', error));
}

function createCard(title) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerText = title;
    return card;
}

function fetchProductionData() {
    return fetch('../data/Profuction_Table.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').slice(1);
            const productionData = rows.map(row => {
                const columns = row.split(',');
                return {
                    timestamp: columns[1],
                    modelOnline: columns[4],
                    modelOffline: columns[5]
                };
            }).filter(item => item.modelOnline && item.modelOffline);
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

    const conveyorBelt = createConveyorBelt();
    container.appendChild(conveyorBelt);

    createDataTable(container);

    createCards(container);

    const stations = document.createElement('div');
    stations.className = 'stations';
    
    for (let i = 0; i < STATION_COUNT; i++) {
        stations.appendChild(createStation(i));
    }

    container.appendChild(stations);

    const colorChangeButton = ColorChangeComponent();
    document.body.appendChild(colorChangeButton);
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
    let previousModelOnline = '';

    const fetchAndUpdateData = () => {
        fetchProductionData().then(data => {
            productionData = data;
            if (productionData.length > 0) {
                endCard.innerText = `Model Offline: ${previousModelOnline}`;
                
                const currentModelOnline = productionData[currentIndex].modelOnline;
                startCard.innerText = `Model Online: ${currentModelOnline}`;
                
                if (currentModelOnline !== previousModelOnline) {
                    previousModelOnline = currentModelOnline;
                }

                currentIndex = (currentIndex + 1) % productionData.length;
            }
        }).catch(error => {
            console.error('Error fetching production data:', error);
        });
    };

    fetchAndUpdateData();
    setInterval(fetchAndUpdateData, 3333.3);
}

document.addEventListener('DOMContentLoaded', initializeConveyorSystem);