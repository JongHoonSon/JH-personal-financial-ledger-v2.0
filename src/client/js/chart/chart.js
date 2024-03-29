import { Chart } from "chart.js";

const chartWrap = document.getElementById("chart__wrap");
const chartDataArr = JSON.parse(chartWrap.dataset.chart_data_arr);

const chartData_Labels = [];
const chartData_datasets_data = [];

for (const chartData of chartDataArr) {
  chartData_Labels.push(`${chartData.category}(${chartData.percentage}%)`);
  chartData_datasets_data.push(chartData.amount);
}

const data = {
  labels: chartData_Labels,
  datasets: [
    {
      label: "Expense History Chart",
      data: chartData_datasets_data,
      backgroundColor: [
        "#fc5c65",
        "#fd9644",
        "#fed330",
        "#26de81",
        "#2bcbba",
        "#45aaf2",
        "#4b7bec",
        "#a55eea",
        "#d1d8e0",
        "#a5b1c2",
        "#778ca3",
        "#B33771",
        "#F97F51",
        "#6D214F",
        "#BDC581",
        "#55E6C1",
      ],
      hoverOffset: 4,
    },
  ],
};

const config = {
  type: "pie",
  data: data,
  options: {
    responsive: true,
  },
};

const myChart = new Chart(document.getElementById("chart-canvas"), config);
