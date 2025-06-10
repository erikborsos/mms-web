import {
  isPaused,
  isSorting,
  pauseResolve,
  setPaused,
  setPauseResolve,
  setShouldStop,
  setSorting,
} from ".";
import { generateBars } from "./helpers";
import { resetBarColors } from "./sorting/visual-helpers";

export const barsContainer = document.getElementById("bars");
export const sizeSlider = document.getElementById("arraySize");
export const sizeLabel = document.getElementById("arraySizeValue");
export const speedSlider = document.getElementById("speedControl");
export const speedLabel = document.getElementById("speedValue");
export const buttonsContainer = document.getElementById("algorithmButtons");
export const pauseToggleIcon = document.getElementById("pauseToggleIcon");
export const pauseToggleButton = document.getElementById("pauseToggleButton");
export const resetButton = document.getElementById("resetButton");
export const stopButton = document.getElementById("stopButton");
export const swapsLabel = document.getElementById("swaps");
export const comparisonsLabel = document.getElementById("comparisons");

// Array Size
let debounceTimeout;
function changeSize() {
  sizeLabel.textContent = sizeSlider.value;
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    if (!isSorting) generateBars();
  }, 200);
}

// Speed
function changeSpeed() {
  speedLabel.textContent = `${speedSlider.value}`;
}

// Pause / Resume
export function togglePause() {
  setPaused(!isPaused);
  pauseToggleIcon.classList.toggle("ph-pause", !isPaused);
  pauseToggleIcon.classList.toggle("ph-play", isPaused);
  pauseToggleIcon.title = isPaused ? "Resume" : "Pause";
  if (!isPaused && pauseResolve) pauseResolve();
}

// Rest
export function reset() {
  if (!isSorting) generateBars();
}

// Stop
export function stop() {
  if (isSorting) {
    setShouldStop(true);
    setSorting(false);
    setPaused(false);
    if (pauseResolve) {
      pauseResolve();
      setPauseResolve(null);
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

export function registerEvents() {
  sizeSlider.oninput = changeSize;
  speedSlider.oninput = changeSpeed;

  stopButton.onclick = stop;
  pauseToggleButton.onclick = togglePause;
  resetButton.onclick = reset;
}
