export function ColorChangeComponent() {
  const beans = document.querySelectorAll('.bean');
  const beans_container = document.querySelectorAll('.beans')
  let currentBeanIndex = 0;
  let isColorChanging = false;
  let intervalId;
  let intervalId1;
  let count = 0;
  let count2 = 0

  const changeBeanColor = () => {
    if (!isColorChanging) {
      return;
    }
    beans[currentBeanIndex].style.backgroundColor = 'green';
    currentBeanIndex = (currentBeanIndex + 1) % beans.length;
    if (currentBeanIndex === 0) {
      clearInterval(intervalId);
      isColorChanging = false;
    }
  };

  const moveCart = () => {
    const gridArea = [
      `"bean1 cart bean8"
        "bean2 path1 bean7"
        "bean3 path2 bean6"
        "bean4 path3 bean5"`,

      `"bean1 path1 bean8"
        "bean2 cart bean7"
        "bean3 path2 bean6"
        "bean4 path3 bean5"`,

      `"bean1 path1 bean8"
        "bean2 path2 bean7"
        "bean3 cart bean6"
        "bean4 path3 bean5"`,

      `"bean1 path1 bean8"
        "bean2 path2 bean7"
        "bean3 path3 bean6"
        "bean4 cart bean5"`,

        `"bean1 path1 bean8"
        "bean2 path2 bean7"
        "bean3 path3 bean6"
        "bean4 cart bean5"`,

      `"bean1 path1 bean8"
        "bean2 path2 bean7"
        "bean3 cart bean6"
        "bean4 path3 bean5"`,

      `"bean1 path1 bean8"
      "bean2 cart bean7"
      "bean3 path2 bean6"
      "bean4 path3 bean5"` ,

      `"bean1 cart bean8"
        "bean2 path1 bean7"
        "bean3 path2 bean6"
        "bean4 path3 bean5"`
    ];
    beans_container[count2].style.gridTemplateAreas = gridArea[count];
    count = (count + 1) % gridArea.length;
    if(count == 0) { count2+=1 }
  }
 

  const toggleColorChange = () => {
    isColorChanging = !isColorChanging;
    if (isColorChanging) {
      intervalId1 = setInterval( moveCart, 600)
      intervalId = setInterval(changeBeanColor, 600);
    } else {
      clearInterval(intervalId);
      clearInterval(intervalId1)
    }
  };

  const resetBeanColors = () => {
    beans.forEach(bean => {
      bean.style.backgroundColor = ''; // Reset to default color
    });

    currentBeanIndex = 0; // Reset index
    isColorChanging = false; // Stop color changing
    count = 0;
    count2 = 0
    clearInterval(intervalId); // Clear interval if running
    clearInterval(intervalId1)

    // Reset the grid-template-areas to the initial state
    beans_container.forEach(container => {
      container.style.gridTemplateAreas = `"bean1 cart bean8"
                                           "bean2 path1 bean7"
                                           "bean3 path2 bean6"
                                           "bean4 path3 bean5"`;
    });
  };

  const startButton = document.createElement('button');
  startButton.textContent = 'Start';
  startButton.className = 'start-button'
  startButton.addEventListener('click', toggleColorChange);
  document.body.appendChild(startButton);

  const resetButton = document.createElement('button');
  resetButton.textContent = 'Reset';
  resetButton.className = 'reset-button'
  resetButton.addEventListener('click', resetBeanColors);
  document.body.appendChild(resetButton);
}
