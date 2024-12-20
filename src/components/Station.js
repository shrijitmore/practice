import { createCart } from './Cart.js';

export function createStation(index) {
    const station = document.createElement('div');
    station.className = 'station';
    station.setAttribute('data-station-index', index);

    const sensor = document.createElement('div');
    sensor.className = 'sensor';

    const beans = document.createElement('div');
    beans.className = 'beans';

    // Add beans
    for (let i = 0; i < 8; i++) {
        const bean = document.createElement('div');
        bean.className = `bean S${index}B${i}`;
        beans.appendChild(bean);
    }


    // Add cart paths
    ['path1', 'path2', 'path3'].forEach(pathName => {
        const path = document.createElement('div');
        path.className = `cart-path ${pathName}`;
        beans.appendChild(path);
    });

    // Add cart space with cart for all stations
    const cartSpace = document.createElement('div');
    cartSpace.className = 'cart-space';
    cartSpace.appendChild(createCart(index));
    beans.appendChild(cartSpace);

    station.appendChild(sensor);
    station.appendChild(beans);



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