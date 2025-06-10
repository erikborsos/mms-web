import { buttonsContainer } from "../dom-elements";
import {
  isSorting,
  resetSwaps,
  resetComparisons,
  setSorting,
  setShouldStop,
  values,
  shouldStop,
  increaseSwaps,
  increaseComparisons,
} from "..";

import { changeColor, swap, highlight, markSorted } from "./visual-helpers";
import { delay, wait } from "../helpers";
import { bubbleSort } from "./algorithms/bubblesort";
import { quickSort } from "./algorithms/quicksort";
import { selectionSort } from "./algorithms/selectionsort";
import { mergeSort } from "./algorithms/mergesort";
import { heapSort } from "./algorithms/heapsort";
import { insertionSort } from "./algorithms/insertionSort";

const algorithms = {};

export function renderButtons() {
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
  setSorting(true);
  setShouldStop(false);

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
    shouldStop,
    delay,
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
  setSorting(false);
  setShouldStop(false);
}

registerSort("Bubble Sort", bubbleSort);
registerSort("Quick Sort", quickSort);
registerSort("Selection Sort", selectionSort);
registerSort("Merge Sort", mergeSort);
registerSort("Heap Sort", heapSort);
registerSort("Insertion Sort", insertionSort);
