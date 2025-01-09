let count = 0;
// Update the object to map model numbers to pump colors
const modelToPumpMap = {
  'M001': 'blue_pump',
  'M002': 'green_pump',
  'M003': 'orange_pump'
};

export function createConveyorBelt(currentModelOnline) {
  const belt = document.createElement('div');
  belt.className = 'belt';
  
  // Add 3 arrows
  for (let i = 0; i < 2; i++) {
    const arrow = document.createElement('div');
    arrow.className = `arrow arrow-${i}`;
    belt.appendChild(arrow);
  }
  
  // Create and add the engine icon based on the current model online
  const engineIcon = document.createElement('img');
  engineIcon.src = `./src/pictures/${modelToPumpMap[currentModelOnline] || 'default_pump'}.png`;
  engineIcon.className = 'engine-icon';
  belt.appendChild(engineIcon);

  // Add 3 cards
  for (let i = 0; i < 3; i++) {
    const card = document.createElement('div');
    card.className = `card card-${i}`;
    card.textContent = `Actual: ${0} Planned:  ${0}`; // Optional: Add text to the card
    belt.appendChild(card);
  }
  
  return belt;
}