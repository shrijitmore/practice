export function createCart(stationIndex) {
    const cart = document.createElement('div');
    cart.className = 'cart';
    cart.setAttribute('data-station', stationIndex);
    
    return cart;
}