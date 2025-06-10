import { shouldStop, values, increaseSwaps } from "..";
import { barsContainer } from "../dom-elements";
import { wait } from "../helpers";

export function changeColor(i, color) {
  if (shouldStop) return;
  barsContainer.children[i].className = `${color} flex-1 rounded-t-lg pt-2`;
}

export function resetBarColors() {
  const bars = barsContainer.children;
  for (let i = 0; i < bars.length; i++) {
    bars[i].className = "bg-white flex-1 rounded-t-lg";
  }
}

export async function swap(i, j) {
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

export async function highlight(i, j) {
  if (shouldStop) return;
  changeColor(i, "bg-orange-500");
  changeColor(j, "bg-orange-500");
  await wait();
  changeColor(i, "bg-white");
  changeColor(j, "bg-white");
}

export function markSorted(i) {
  if (shouldStop) return;
  changeColor(i, "bg-green-500");
}
