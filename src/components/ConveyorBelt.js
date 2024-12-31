export function createConveyorBelt() {
  const belt = document.createElement('div');
  belt.className = 'belt';
  
  // Add 3 arrows
  for (let i = 0; i < 3; i++) {
    const arrow = document.createElement('div');
    arrow.className = 'arrow';
    belt.appendChild(arrow);
  }
  
  // Create and add the engine icon
  const engineIcon = document.createElement('img');
  engineIcon.src = './src/pictures/engine.png'; // Use a relative path for the engine icon
  engineIcon.className = 'engine-icon'; // Add a class for styling
  belt.appendChild(engineIcon);
  
  return belt;
}