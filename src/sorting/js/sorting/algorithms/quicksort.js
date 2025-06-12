export const quickSort = async ({
  values,
  swap,
  highlight,
  markSorted,
  wait,
  shouldStop,
  changeColor,
  increaseComparisons,
}) => {
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
};
