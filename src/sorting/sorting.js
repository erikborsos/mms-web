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
let pauseResolve;

// EVENT LISTENERS
sizeSlider.oninput = () => {
  sizeLabel.textContent = sizeSlider.value;
  if (!isSorting) generateBars();
};

speedSlider.oninput = () => {
  speedLabel.textContent = `${speedSlider.value}`;
};

// PAUSE / RESUME
function togglePause() {
  isPaused = !isPaused;
  if (isPaused) {
    pauseToggleIcon.classList.remove("ph-pause");
    pauseToggleIcon.classList.add("ph-play");
  } else {
    pauseToggleIcon.classList.remove("ph-play");
    pauseToggleIcon.classList.add("ph-pause");
    if (pauseResolve) pauseResolve();
  }
}

// GENERATE BARS
function generateBars() {
  barsContainer.innerHTML = "";
  values = Array.from(
    { length: sizeSlider.valueAsNumber },
    () => Math.floor(Math.random() * (100 - 10)) + 10,
  );

  for (let i = 0; i < sizeSlider.valueAsNumber; i++) {
    const bar = document.createElement("div");
    bar.style.height = `${values[i]}%`;
    bar.className = "bg-white flex-1 rounded-t-lg";
    barsContainer.appendChild(bar);
  }
}

// HELPER FUNCTIONS
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitWhilePaused() {
  return new Promise((resolve) => {
    if (!isPaused) return resolve();
    pauseResolve = resolve;
  });
}

async function wait() {
  await waitWhilePaused();
  await delay(speedSlider.valueAsNumber);
}

// VISUAAL HELPERS

function changeColor(i, color) {
  barsContainer.children[i].className = `${color} flex-1 rounded-t-lg pt-2`;
}

async function swap(i, j) {
  [values[i], values[j]] = [values[j], values[i]];
  const bars = barsContainer.children;
  bars[i].style.height = `${values[i]}%`;
  bars[j].style.height = `${values[j]}%`;
  changeColor(i, "bg-blue-500");
  changeColor(j, "bg-blue-500");
  await wait();
  changeColor(i, "bg-white");
  changeColor(j, "bg-white");
}

async function highlight(i, j) {
  const bars = barsContainer.children;
  changeColor(i, "bg-red-500");
  changeColor(j, "bg-red-500");
  await wait();
  changeColor(i, "bg-white");
  changeColor(j, "bg-white");
}

function markSorted(i) {
  changeColor(i, "bg-green-500");
}

// SORTING ALGORITHMS

const algorithms = {};

function renderButtons() {
  buttonsContainer.innerHTML = "";
  for (let name in algorithms) {
    const button = document.createElement("button");
    button.textContent = name;
    button.className = "btn bg-accent";
    button.onclick = () => runSort(name);
    buttonsContainer.appendChild(button);
  }
}

function registerSort(name, func) {
  algorithms[name] = func;
}

async function runSort(name) {
  if (isSorting) return;
  isSorting = true;

  const ctx = {
    values,
    swap,
    highlight,
    markSorted,
    wait,
  };

  await algorithms[name](ctx);

  // mark all sorted
  for (let i = 0; i < values.length; i++) {
    markSorted(i);
    await delay(2);
  }

  isSorting = false;
}

registerSort(
  "Bubble Sort",
  async ({ values, swap, highlight, markSorted, wait }) => {
    const n = values.length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (values[j] > values[j + 1]) {
          await highlight(j, j + 1);
          await swap(j, j + 1);
        }
      }
      markSorted(n - i - 1);
    }
  },
);

generateBars();
renderButtons();
