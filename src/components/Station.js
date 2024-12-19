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
        bean.className = 'bean';
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

    // change the color of Beans


    return station;
}