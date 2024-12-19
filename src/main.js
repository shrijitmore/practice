import { createStation } from './components/Station.js';
import { createConveyorBelt } from './components/ConveyorBelt.js';
import { STATION_COUNT } from './utils/constants.js';
import { readExcelData } from './utils/exceldata.js';
import { ColorChangeComponent } from './components/animateComp.js';
import './styles/main.css';
import './styles/conveyor.css';
import './styles/station.css';
import './styles/cart.css';

function initializeConveyorSystem() {
  const container = document.querySelector('.container');
  const conveyorBeltSystem = document.createElement('div');

  conveyorBeltSystem.className = 'conveyor-belt';

  // Display data from CSV
  readExcelData("../data/data_assembly.csv")
    .then(data => {
      console.log("CSV data:", data[1]);
    });
  
  // Add conveyor belt
  conveyorBeltSystem.appendChild(createConveyorBelt());
  
  // Add stations container
  const stations = document.createElement('div');
  stations.className = 'stations';
  
  // Create stations
  for (let i = 0; i < STATION_COUNT; i++) {
    stations.appendChild(createStation(i));
  }

  const button = document.createElement('div');
  button.className = 'Button';


  conveyorBeltSystem.appendChild(stations);
  container.appendChild(conveyorBeltSystem);

  
  // change the color of Component
  const colorChangeButton = ColorChangeComponent();
  document.body.appendChild(colorChangeButton);


}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeConveyorSystem);