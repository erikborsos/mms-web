export const mergeSort = async ({
  values,
  swap,
  highlight,
  markSorted,
  wait,
  increaseComparisons,
}) => {
  const merge = async (left, mid, right) => {
    let i = left;
    let j = mid + 1;

    while (i <= mid && j <= right) {
      await highlight(i, j);
      increaseComparisons(1);
      if (values[i] <= values[j]) {
        i++;
      } else {
        for (let k = j; k > i; k--) {
          await swap(k, k - 1);
        }
        i++;
        mid++;
        j++;
      }
      await wait();
    }
  };

  const mergeSort = async (left, right) => {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    await mergeSort(left, mid);
    await mergeSort(mid + 1, right);
    await merge(left, mid, right);
  };

  await mergeSort(0, values.length - 1);

  for (let i = 0; i < values.length; i++) {
    markSorted(i);
    await wait();
  }
};
