// DOM ELEMENTS
const barsContainer = document.getElementById("bars");
const sizeSlider = document.getElementById("arraySize");
const sizeLabel = document.getElementById("arraySizeValue");
const speedSlider = document.getElementById("speedControl");
const speedLabel = document.getElementById("speedValue");
const buttonsContainer = document.getElementById("algorithmButtons");
const pauseToggleIcon = document.getElementById("pauseToggleIcon");
const resetButton = document.getElementById("resetButton");
const stopButton = document.getElementById("stopButton");
const swapsLabel = document.getElementById("swaps");
const comparisonsLabel = document.getElementById("comparisons");

let values = [];
let isPaused = false;
let isSorting = false;
let shouldStop = false;
let pauseResolve;

let swaps = 0;
let comparisons = 0;

// EVENT LISTENERS

// Array Size
let debounceTimeout;
sizeSlider.oninput = () => {
  sizeLabel.textContent = sizeSlider.value;
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    if (!isSorting) generateBars();
  }, 200); // 200ms debounce
};

// Speed
speedSlider.oninput = () => {
  speedLabel.textContent = `${speedSlider.value}`;
};

// PAUSE / RESUME
function togglePause() {
  isPaused = !isPaused;
  pauseToggleIcon.classList.toggle("ph-pause", !isPaused);
  pauseToggleIcon.classList.toggle("ph-play", isPaused);
  pauseToggleIcon.title = isPaused ? "Resume" : "Pause";
  if (!isPaused && pauseResolve) pauseResolve();
}

// RESET
function reset() {
  if (!isSorting) generateBars();
}

// STOP
function stop() {
  if (isSorting) {
    shouldStop = true;
    isSorting = false;
    isPaused = false;
    if (pauseResolve) {
      pauseResolve();
      pauseResolve = null;
    }
    resetBarColors();

    // Add a small delay to ensure running tasks finished
    setTimeout(() => {
      resetSwaps();
      resetComparisons();
      generateBars();
    }, 50);

    resetButton.toggleAttribute("disabled", false);
    toggleAlgorithmButtons(false);
  }
}

// GENERATE BARS
function generateBars() {
  if (sizeSlider.valueAsNumber < 1) {
    sizeSlider.valueAsNumber = 1;
    sizeLabel.textContent = "1";
  }
  barsContainer.innerHTML = "";
  values = Array.from(
    { length: sizeSlider.valueAsNumber },
    () => Math.floor(Math.random() * (100 - 10)) + 10,
  );
  const barWidth = 100 / sizeSlider.valueAsNumber;
  for (let i = 0; i < sizeSlider.valueAsNumber; i++) {
    const bar = document.createElement("div");
    bar.style.height = `${values[i]}%`;
    bar.style.width = `${barWidth}%`;
    bar.className = "bg-white flex-1 rounded-t-lg";
    barsContainer.appendChild(bar);
  }
}

// RESET BAR COLORS
function resetBarColors() {
  const bars = barsContainer.children;
  for (let i = 0; i < bars.length; i++) {
    bars[i].className = "bg-white flex-1 rounded-t-lg";
  }
}

// HELPER FUNCTIONS
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitWhilePaused() {
  return new Promise((resolve) => {
    if (!isPaused || shouldStop) return resolve();
    pauseResolve = resolve;
  });
}

async function wait() {
  await waitWhilePaused();
  if (shouldStop) return;
  await delay(1000 / speedSlider.valueAsNumber); // inverse
}

function resetComparisons() {
  comparisons = 0;
  comparisonsLabel.innerText = comparisons;
}

function resetSwaps() {
  swaps = 0;
  swapsLabel.innerText = swaps;
}

function increaseComparisons(n) {
  if (shouldStop) return;
  comparisons += n;
  comparisonsLabel.innerText = comparisons;
}

function increaseSwaps(n) {
  if (shouldStop) return;
  swaps += n;
  swapsLabel.innerText = swaps;
}

// VISUAL HELPERS
function changeColor(i, color) {
  if (shouldStop) return;
  barsContainer.children[i].className = `${color} flex-1 rounded-t-lg pt-2`;
}

async function swap(i, j) {
  if (shouldStop) return;
  [values[i], values[j]] = [values[j], values[i]];
  const bars = barsContainer.children;
  bars[i].style.height = `${values[i]}%`;
  bars[j].style.height = `${values[j]}%`;
  changeColor(i, "bg-blue-500");
  changeColor(j, "bg-blue-500");
  increaseSwaps(1);
  await wait();
  changeColor(i, "bg-white");
  changeColor(j, "bg-white");
}

async function highlight(i, j) {
  if (shouldStop) return;
  changeColor(i, "bg-orange-500");
  changeColor(j, "bg-orange-500");
  await wait();
  changeColor(i, "bg-white");
  changeColor(j, "bg-white");
}

function markSorted(i) {
  if (shouldStop) return;
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

function toggleAlgorithmButtons(disable) {
  const buttons = buttonsContainer.querySelectorAll("button");
  buttons.forEach((button) => button.toggleAttribute("disabled", disable));
}

function registerSort(name, func) {
  algorithms[name] = func;
}

async function runSort(name) {
  if (isSorting) return;
  resetButton.toggleAttribute("disabled", true);
  toggleAlgorithmButtons(true);
  resetSwaps();
  resetComparisons();
  isSorting = true;
  shouldStop = false;

  for (let i = 0; i < values.length; i++) {
    changeColor(i, "bg-white");
    await delay(2);
    if (shouldStop) break;
  }

  const ctx = {
    values,
    swap,
    highlight,
    markSorted,
    wait,
    increaseSwaps,
    increaseComparisons,
    changeColor,
  };

  if (!shouldStop) await algorithms[name](ctx);

  // Mark all sorted if not stopped
  if (!shouldStop) {
    for (let i = 0; i < values.length; i++) {
      markSorted(i);
      await delay(2);
    }
  }

  toggleAlgorithmButtons(false);
  resetButton.toggleAttribute("disabled", false);
  isSorting = false;
  shouldStop = false;
}

// Bubble Sort
registerSort(
  "Bubble Sort",
  async ({ values, swap, highlight, markSorted, wait }) => {
    const n = values.length;
    for (let i = 0; i < n && !shouldStop; i++) {
      let swapped = false;
      for (let j = 0; j < n - i - 1 && !shouldStop; j++) {
        await highlight(j, j + 1);
        increaseComparisons(1);
        if (values[j] > values[j + 1]) {
          await swap(j, j + 1);
          swapped = true;
        }
      }
      markSorted(n - i - 1);
      if (!swapped) {
        for (let k = 0; k < n - i - 1 && !shouldStop; k++) {
          markSorted(k);
          await delay(2);
        }
        break;
      }
    }
  },
);

// Quick Sort
registerSort(
  "Quick Sort",
  async ({ values, swap, highlight, markSorted, wait }) => {
    const quickSort = async (left, right) => {
      if (left >= right || shouldStop) {
        if (left === right && !shouldStop) markSorted(left);
        return;
      }
      let pivotIndex = Math.floor((left + right) / 2);
      let pivot = values[pivotIndex];
      changeColor(pivotIndex, "bg-yellow-400");
      await wait();
      if (shouldStop) return;
      let i = left,
        j = right;
      while (i <= j && !shouldStop) {
        while (values[i] < pivot) {
          increaseComparisons(1);
          i++;
        }
        while (values[j] > pivot) {
          increaseComparisons(1);
          j--;
        }
        if (i <= j) {
          await highlight(i, j);
          await swap(i, j);
          i++;
          j--;
        }
      }
      changeColor(pivotIndex, "bg-white");
      await quickSort(left, j);
      await quickSort(i, right);
    };
    await quickSort(0, values.length - 1);
  },
);

// Selection Sort
registerSort(
  "Selection Sort",
  async ({ values, swap, highlight, markSorted, wait }) => {
    const n = values.length;
    for (let i = 0; i < n && !shouldStop; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n && !shouldStop; j++) {
        await highlight(minIdx, j);
        increaseComparisons(1);
        if (values[j] < values[minIdx]) {
          minIdx = j;
        }
      }
      if (i !== minIdx) await swap(i, minIdx);
      markSorted(i);
    }
    if (!shouldStop) markSorted(n - 1);
  },
);

// Merge Sort
registerSort(
  "Merge Sort",
  async ({ values, swap, highlight, markSorted, wait }) => {
    const merge = async (left, mid, right) => {
      let i = left;
      let j = mid + 1;

      while (i <= mid && j <= right) {
        await highlight(i, j);
        increaseComparisons(1);
        if (values[i] <= values[j]) {
          i++;
        } else {
          for (let k = j; k > i; k--) {
            await swap(k, k - 1);
          }
          i++;
          mid++;
          j++;
        }
        await wait();
      }
    };

    const mergeSort = async (left, right) => {
      if (left >= right) return;
      const mid = Math.floor((left + right) / 2);
      await mergeSort(left, mid);
      await mergeSort(mid + 1, right);
      await merge(left, mid, right);
    };

    await mergeSort(0, values.length - 1);

    for (let i = 0; i < values.length; i++) {
      markSorted(i);
      await wait();
    }
  },
);

// Heap Sort
registerSort(
  "Heap Sort",
  async ({ values, swap, highlight, markSorted, wait }) => {
    const heapify = async (n, i) => {
      if (shouldStop) return;
      let largest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n) {
        increaseComparisons(1);
        if (values[l] > values[largest]) largest = l;
      }
      if (r < n) {
        increaseComparisons(1);
        if (values[r] > values[largest]) largest = r;
      }
      if (largest !== i) {
        await highlight(i, largest);
        await swap(i, largest);
        await heapify(n, largest);
      }
    };
    const n = values.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0 && !shouldStop; i--) {
      await heapify(n, i);
    }
    for (let i = n - 1; i > 0 && !shouldStop; i--) {
      await swap(0, i);
      markSorted(i);
      await heapify(i, 0);
    }
    if (!shouldStop) markSorted(0);
  },
);

// Insertion Sort
registerSort(
  "Insertion Sort",
  async ({ values, swap, highlight, markSorted, wait }) => {
    const n = values.length;
    for (let i = 1; i < n && !shouldStop; i++) {
      let j = i;
      while (j > 0 && !shouldStop) {
        await highlight(j - 1, j);
        increaseComparisons(1);
        if (values[j - 1] > values[j]) {
          await swap(j - 1, j);
          j--;
        } else {
          break;
        }
      }
      markSorted(i);
    }
  },
);

generateBars();
renderButtons();
