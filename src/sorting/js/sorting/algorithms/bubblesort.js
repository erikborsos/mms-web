export const bubbleSort = async ({
  values,
  swap,
  highlight,
  markSorted,
  increaseComparisons,
  shouldStop,
  delay,
}) => {
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
};
