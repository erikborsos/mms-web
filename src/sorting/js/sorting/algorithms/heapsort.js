export const heapSort = async ({
  values,
  swap,
  highlight,
  markSorted,
  increaseComparisons,
  shouldStop,
}) => {
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
};
