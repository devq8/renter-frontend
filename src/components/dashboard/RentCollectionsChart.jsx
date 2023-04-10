import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function RentCollectionsChart() {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Rent Collections",
      },
    },
  };

  const labels = [
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

  const data = {
    labels,
    datasets: [
      {
        label: "Khaitan 25",
        data: [
          500, 300, 2000, 3400, 2100, 750, 2250, 3200, 2100, 1990, 1600, 3200,
        ],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Shuwaikh 82",
        data: [
          2000, 3200, 1200, 5000, 1300, 1200, 200, 2900, 2400, 2100, 3900, 3000,
        ],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  return (
    <div className="flex-1 mx-2 bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 w-[100%]">
      <Line options={options} data={data} />
    </div>
  );
}

export default RentCollectionsChart;
