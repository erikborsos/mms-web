import { comparisons, swaps, values } from ".";
import { reset } from "./dom-elements";
import { generateBars } from "./helpers";
import { algorithms, runSort } from "./sorting";

export async function runBenchmark() {
  reset();
  const benchValues = values.slice();
  const comparisonsArr = [];
  const swapsArr = [];
  for (const algorithm of Object.keys(algorithms)) {
    generateBars(benchValues);
    await runSort(algorithm);
    comparisonsArr.push(comparisons);
    swapsArr.push(swaps);
  }
  drawChart(Object.keys(algorithms), comparisonsArr, swapsArr);
}

function drawChart(algorithmNames, comparisonsArr, swapsArr) {
  const ctx = document.getElementById("benchmarkChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: algorithmNames,
      datasets: [
        {
          label: "Comparisons",
          data: comparisonsArr,
          backgroundColor: "#ff6900",
        },
        {
          label: "Swaps",
          data: swapsArr,
          backgroundColor: "#00c950",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Count",
          },
        },
        x: {
          title: {
            display: true,
            text: "Sorting Algorithms",
          },
        },
      },
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Sorting Algorithm Benchmark (Comparisons vs Swaps)",
        },
      },
    },
  });
}
