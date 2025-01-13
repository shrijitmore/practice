let currentRow = 1;
let cardValues = [0, 0, 0];  // Values for the three cards
let updateInterval; // Store interval ID to clear it later

function updateCards() {
    fetch('../data/Planning_Data.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n');
            
            // Reset if we reach the end of CSV
            if (currentRow >= rows.length - 1) {
                currentRow = 1;
            }

            // Get new value from current CSV row
            const row = rows[currentRow];
            if (row) {
                const cols = row.split(',');
                const newValue = parseInt(cols[5]) || 0;

                // Cascade the values
                cardValues[2] = cardValues[1];  // Third card gets second card's value
                cardValues[1] = cardValues[0];  // Second card gets first card's value
                cardValues[0] = newValue;       // First card gets new value

                // Update all cards
                for (let i = 0; i < 3; i++) {
                    const card = document.querySelector(`.card-${i}`);
                    if (card) {
                        card.textContent = `Actual: ${cardValues[i]} Planned: 36`;
                    }
                }

                // Check if all cards have reached 36
                if (cardValues[0] >= 36 && cardValues[1] >= 36 && cardValues[2] >= 36) {
                    clearInterval(updateInterval);
                    console.log('Updates stopped: All cards reached 36');
                }
            }

            currentRow++;
        });
}

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

  // Add 3 cards with initial values of 0
  for (let i = 0; i < 3; i++) {
    const card = document.createElement('div');
    card.className = `card card-${i}`;
    card.textContent = `Actual: 0 Planned: 36`;
    belt.appendChild(card);
  }
  
  // Start updating after 10 seconds
  setTimeout(() => {
    updateCards(); // First update
    updateInterval = setInterval(updateCards, 10000); // Store interval ID
  }, 10000);
  
  return belt;
}