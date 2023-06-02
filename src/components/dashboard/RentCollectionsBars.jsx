import React from "react";
import apiProperties from "../../utils/api/properties";
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
import { useQuery } from "@tanstack/react-query";

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

  const {
    data: properties,
    isLoading,
    error,
  } = useQuery(["properties"], () => apiProperties.getProperties());

  const labels = [
    monthNumberToName(currentMonth - 2),
    monthNumberToName(currentMonth - 1),
    monthNumberToName(currentMonth),
  ];

  const backgroundColors = [
    "rgba(255, 99, 132, 0.5)",
    "rgba(255, 159, 64, 0.5)",
    "rgba(255, 205, 86, 0.5)",
    "rgba(75, 192, 192, 0.5)",
    "rgba(54, 162, 235, 0.5)",
    "rgba(153, 102, 255, 0.5)",
    "rgba(201, 203, 207, 0.5)",
  ];
  const borderColors = [
    "rgb(255, 99, 132)",
    "rgb(255, 159, 64)",
    "rgb(255, 205, 86)",
    "rgb(75, 192, 192)",
    "rgb(54, 162, 235)",
    "rgb(153, 102, 255)",
    "rgb(201, 203, 207)",
  ];

  const datasets = properties?.data?.map((property, index) => {
    let borderColor = `${borderColors[index % borderColors.length]}`;
    let backgroundColor = `${
      backgroundColors[index % backgroundColors.length]
    }`;

    const collections = property.last_year_collections;

    const data = collections
      .map((item) => item.collections)
      .reverse()
      .slice(-3);

    return {
      label: property.name,
      data: data,
      borderColor: borderColor,
      backgroundColor: backgroundColor,
      borderWidth: 1,
    };
  });

  console.log(datasets);

  const data = {
    labels,
    datasets: datasets,
  };
  return (
    <div className="bg-white shadow rounded-lg p-3">
      {!datasets ? <></> : <Bar options={options} data={data} />}
    </div>
  );
}

export default RentCollectionsChart;
