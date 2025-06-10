export const selectionSort = async ({
  values,
  swap,
  highlight,
  markSorted,
  shouldStop,
  increaseComparisons,
}) => {
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
};
