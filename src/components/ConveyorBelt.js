export function createConveyorBelt() {
  const belt = document.createElement('div');
  belt.className = 'belt';
  
  // Add arrows
  for (let i = 0; i < 4; i++) {
    const arrow = document.createElement('div');
    arrow.className = 'arrow';
    belt.appendChild(arrow);
  }
  
  return belt;
}