import { startCheckingAndRemovingRows } from '../main.js';
import { BEANS_PER_STATION } from "../utils/constants";

export function ColorChangeComponent() {
  const beans_container = document.querySelectorAll('.beans');
  const station = document.querySelectorAll('.station');
  let currentBeanIndex = 0;
  let isColorChanging = false;
  let intervalId;
  let intervalId1;
  let count = 0;
  let count2 = 0;

  const changeBeanColor = () => {
    const numberOfStations = station.length;
    for (let stationIndex = 0; stationIndex < numberOfStations; stationIndex++) {
      const beans = document.getElementsByClassName(`A${stationIndex}M${currentBeanIndex}`);
      if (beans.length > 0) {
        beans[0].style.backgroundColor = 'green';
      }
    }
    currentBeanIndex += 1;

    if (currentBeanIndex >= BEANS_PER_STATION) {
      resetBeanColors();
      toggleColorChange();
    }
  };

  const moveCart = () => {
    const gridArea = [
      `"bean1 cart bean10"
        "bean2 path1 bean9"
        "bean3 path2 bean8"
        "bean4 path3 bean7"
        "bean5 path4 bean6"`,

      `"bean1 path1 bean10"
        "bean2 cart bean9"
        "bean3 path2 bean8"
        "bean4 path3 bean7"
        "bean5 path4 bean6"`,

      `"bean1 path1 bean10"
        "bean2 path2 bean9"
        "bean3 cart bean8"
        "bean4 path3 bean7"
        "bean5 path4 bean6"`,

      `"bean1 path1 bean10"
        "bean2 path2 bean9"
        "bean3 path3 bean8"
        "bean4 cart bean7"
        "bean5 path4 bean6"`,

      `"bean1 path1 bean10"
        "bean2 path2 bean9"
        "bean3 path3 bean8"
        "bean4 path4 bean7"
        "bean5 cart bean6"`,

      `"bean1 path1 bean10"
        "bean2 path2 bean9"
        "bean3 path3 bean8"
        "bean4 path4 bean7"
        "bean5 cart bean6"`,

      `"bean1 path1 bean10"
        "bean2 path2 bean9"
        "bean3 path3 bean8"
        "bean4 cart bean7"
        "bean5 path4 bean6"`,

      `"bean1 path1 bean10"
        "bean2 path2 bean9"
        "bean3 cart bean8"
        "bean4 path3 bean7"
        "bean5 path4 bean6"`,

      `"bean1 path1 bean10"
        "bean2 cart bean9"
        "bean3 path2 bean8"
        "bean4 path3 bean7"
        "bean5 path4 bean6"`,

      `"bean1 cart bean10"
        "bean2 path1 bean9"
        "bean3 path2 bean8"
        "bean4 path3 bean7"
        "bean5 path4 bean6"`,
    ];

    beans_container.forEach((container) => {
      container.style.gridTemplateAreas = gridArea[count];
    });
    count = (count + 1) % gridArea.length;
    if (count === 0) {
      count2 += 1;
    }

    // Stop cart movement when all cycles are completed
    if (count2 >= 1) {
      clearInterval(intervalId1);
      isColorChanging = false;
    }
  };

  const toggleColorChange = () => {
    isColorChanging = !isColorChanging;
    if (isColorChanging) {
      intervalId1 = setInterval(() => {
        moveCart();
        setTimeout(changeBeanColor, 1000); // Change color 1 second after moving the cart
      }, 1000); // Adjust the interval time as needed
    } else {
      clearInterval(intervalId1);
    }
  };

  const resetBeanColors = () => {
    const beans = document.querySelectorAll('.bean');
    beans.forEach((bean) => {
      bean.style.backgroundColor = ''; // Reset to default color
    });

    currentBeanIndex = 0; // Reset index
    isColorChanging = false; // Stop color changing
    count = 0;
    count2 = 0;
    clearInterval(intervalId); // Clear interval if running
    clearInterval(intervalId1);

    // Reset the grid-template-areas to the initial state
    beans_container.forEach((container) => {
      container.style.gridTemplateAreas = `"bean1 cart bean10"
        "bean2 path1 bean9"
        "bean3 path2 bean8"
        "bean4 path3 bean7"
        "bean5 path4 bean6"`
    });
  };

  const startButton = document.createElement('button');
  startButton.textContent = 'Start';
  startButton.className = 'start-button';
  startButton.addEventListener('click', () => {
    toggleColorChange();
    const table = document.getElementById('data-table');
    if (table) {
      startCheckingAndRemovingRows(table);
    }
  });
  document.body.appendChild(startButton);

  const resetButton = document.createElement('button');
  resetButton.textContent = 'Reset';
  resetButton.className = 'reset-button';
  resetButton.addEventListener('click', resetBeanColors);
  document.body.appendChild(resetButton);
}
