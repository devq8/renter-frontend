import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  Colors,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Legend,
} from "chart.js";

Chart.register(
  Colors,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend
);

function RentCollectionsChart() {
  const options = {
    responsive: true,
    type: "bar",
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Last 3 Months Rent Collections",
      },
    },
  };

  let currentMonth = new Date().getMonth();

  function monthNumberToName(monthNumber) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthNumber];
  }

  const labels = [
    monthNumberToName(currentMonth - 2),
    monthNumberToName(currentMonth - 1),
    monthNumberToName(currentMonth),
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Khaitan 25",
        data: [3900, 3750, 3800],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Shuwaikh 82",
        data: [7500, 7850, 8000],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  return (
    <div className="flex-1 mx-2 bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 w-[100%]">
      <Bar options={options} data={data} />
    </div>
  );
}

export default RentCollectionsChart;
