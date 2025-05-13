const barsContainer = document.getElementById("bars");
const sizeSlider = document.getElementById("arraySize");
const sizeLabel = document.getElementById("arraySizeValue");
const speedSlider = document.getElementById("speedControl");
const speedLabel = document.getElementById("speedValue");
const buttonsContainer = document.getElementById("algorithmButtons");
const pauseToggleIcon = document.getElementById("pauseToggleIcon");

let values = [];
let isPaused = false;
let isSorting = false;

sizeSlider.oninput = () => {
  sizeLabel.textContent = sizeSlider.value;
  if (!isSorting) generateBars();
};

speedSlider.oninput = () => {
  speedLabel.textContent = `${speedSlider.value}`;
};

function togglePause() {
  isPaused = !isPaused;
  if (isPaused) {
    pauseToggleIcon.classList.remove("ph-pause");
    pauseToggleIcon.classList.add("ph-play");
  } else {
    pauseToggleIcon.classList.remove("ph-play");
    pauseToggleIcon.classList.add("ph-pause");
  }
}

function generateBars() {
  barsContainer.innerHTML = "";
  values = Array.from(
    { length: sizeSlider.valueAsNumber },
    () => Math.floor(Math.random() * 250) + 10,
  );

  for (let i = 0; i < sizeSlider.valueAsNumber; i++) {
    const bar = document.createElement("div");
    bar.style.height = `${values[i]}px`;
    bar.className = "bg-white flex-1 rounded-t";
    if (i == 0) bar.classList.add("rounded-bl");
    else if (i == sizeSlider.valueAsNumber - 1) bar.classList.add("rounded-br");
    barsContainer.appendChild(bar);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

generateBars();
