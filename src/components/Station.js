import { createCart } from './Cart.js';

async function loadPlanningData() {
    // Hardcoded unique models since we're using sample data
    return ['M001', 'M002', 'M003'];
}

export function createStation(index) {
    const station = document.createElement('div');
    station.className = 'station';
    station.setAttribute('data-station-index', index);

    const sensor = document.createElement('div');
    sensor.className = 'sensor';

    const beans = document.createElement('div');
    beans.className = 'beans';

    // Add beans
    const beanCount = index === 0 ? 5 : 7;
    for (let i = 0; i < beanCount; i++) {
        const bean = document.createElement('div');
        bean.className = `bean A${index}M${i}`;
        beans.appendChild(bean);
    }

    // Add cart paths
    ['path1', 'path2', 'path3', 'path4'].forEach(pathName => {
        const path = document.createElement('div');
        path.className = `cart-path ${pathName}`;
        beans.appendChild(path);
    });

    // Add cart space with cart
    const cartSpace = document.createElement('div');
    cartSpace.className = 'cart-space';
    cartSpace.appendChild(createCart(index));
    beans.appendChild(cartSpace);

    // Define station names
    const stationNames = [
        'Rotor Assembly',
        'End Plate Assembly',
        'Impeller Assembly'
    ];

    // Create title
    const title = document.createElement('h3');
    title.textContent = stationNames[index] || `Station ${index + 1}`;
    title.className = 'station-title';
    title.style.textAlign = 'center';

    // Create table
    const table = document.createElement('table');
    table.className = 'station-table';
    table.style.border = '1px solid black';
    table.style.borderCollapse = 'collapse';
    table.style.width = '167px';
    table.style.margin = '0 auto';

    // Add header
    const tableHeader = document.createElement('tr');
    tableHeader.innerHTML = `
        <th style="border: 1px solid black; text-align: center;">Model No</th>
        <th style="border: 1px solid black; text-align: center;">Qty</th>
    `;
    table.appendChild(tableHeader);

    // Create rows for each model
    const models = ['M001', 'M002', 'M003'];
    models.forEach(model => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="border: 1px solid black; text-align: center;">${model}</td>
            <td style="border: 1px solid black; text-align: center;">0</td>
        `;
        table.appendChild(row);
    });

    station.appendChild(title);
    station.appendChild(sensor);
    station.appendChild(beans);
    station.appendChild(table);

    return station;
}

function showTooltip(bean, data) {
    let tooltip = document.getElementById('tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = 'white';
        tooltip.style.border = '1px solid black';
        tooltip.style.padding = '10px';
        tooltip.style.zIndex = '1000';
        tooltip.style.borderRadius = '5px';
        tooltip.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
        document.body.appendChild(tooltip);
    }

    // Format the data for display
    const dataString = Object.entries(data)
        .map(([key, value]) => `${key}: ${value}`)
        .join('<br>'); // Join key-value pairs with line breaks

    tooltip.innerHTML = dataString || 'No data'; // Set tooltip text to the formatted data
    const rect = bean.getBoundingClientRect();
    tooltip.style.left = `${rect.left + window.scrollX}px`;
    tooltip.style.top = `${rect.bottom + window.scrollY}px`;
}