import { runBenchmark } from "./benchmarking";
import { registerEvents, swapsLabel, comparisonsLabel } from "./dom-elements";
import { generateBars } from "./helpers";
import { renderButtons } from "./sorting";

export let values = [];
export function setValues(val) {
  values = val;
}

export let isPaused = false;
export function setPaused(paused) {
  isPaused = paused;
}
export let isSorting = false;
export function setSorting(sorting) {
  isSorting = sorting;
}

export let shouldStop = false;
export function setShouldStop(stop) {
  shouldStop = stop;
}

export let pauseResolve;
export function setPauseResolve(resolve) {
  pauseResolve = resolve;
}

export let swaps = 0;
export let comparisons = 0;
export function resetComparisons() {
  comparisons = 0;
  comparisonsLabel.innerText = comparisons;
}
export function resetSwaps() {
  swaps = 0;
  swapsLabel.innerText = swaps;
}
export function increaseComparisons(n) {
  if (shouldStop) return;
  comparisons += n;
  comparisonsLabel.innerText = comparisons;
}
export function increaseSwaps(n) {
  if (shouldStop) return;
  swaps += n;
  swapsLabel.innerText = swaps;
}

document.getElementById("runBenchmark").onclick = () => runBenchmark();

registerEvents();
generateBars();
renderButtons();
