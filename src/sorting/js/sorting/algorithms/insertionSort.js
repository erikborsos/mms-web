export const insertionSort = async ({
  values,
  swap,
  highlight,
  markSorted,
  increaseComparisons,
  shouldStop,
}) => {
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
};
