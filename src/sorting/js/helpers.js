import { sizeSlider, barsContainer, speedSlider } from "./dom-elements.js";
import { setPauseResolve, setValues, values, isPaused, shouldStop } from ".";

export function generateBars(vals) {
  if (sizeSlider.valueAsNumber < 1) {
    sizeSlider.valueAsNumber = 1;
    sizeLabel.textContent = "1";
  }
  barsContainer.innerHTML = "";
  if (vals) {
    setValues(vals.slice());
  } else {
    setValues(
      Array.from(
        { length: sizeSlider.valueAsNumber },
        () => Math.floor(Math.random() * (100 - 10)) + 10,
      ),
    );
  }

  const barWidth = 100 / sizeSlider.valueAsNumber;
  for (let i = 0; i < sizeSlider.valueAsNumber; i++) {
    const bar = document.createElement("div");
    bar.style.height = `${values[i]}%`;
    bar.style.width = `${barWidth}%`;
    bar.className = "bg-white flex-1 rounded-t-lg";
    barsContainer.appendChild(bar);
  }
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function waitWhilePaused() {
  return new Promise((resolve) => {
    if (!isPaused || shouldStop) return resolve();
    setPauseResolve(resolve);
  });
}

export async function wait() {
  await waitWhilePaused();
  if (shouldStop) return;
  await delay(1000 / speedSlider.valueAsNumber);
}
