import React from "react";
import { Line } from "react-chartjs-2";
import { getProperties } from "../../utils/api/properties";
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
import { useQuery } from "@tanstack/react-query";

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

  function getLast12Months() {
    const months = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ];

    const currentDate = new Date();
    const last12Months = [];
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    for (let i = 0; i < 12; i++) {
      if (currentMonth - i < 0) {
        const year = currentYear - 1;
        last12Months.unshift(
          months[currentMonth - i + 12] + "/" + year.toString().slice(-2)
        );
      } else {
        last12Months.unshift(
          `${months[currentMonth - i]}/${currentYear.toString().slice(-2)}`
        );
      }
    }

    return last12Months;
  }

  const {
    data: properties,
    isLoading,
    error,
  } = useQuery(["properties"], () => getProperties());

  let labels = [];
  if (properties?.data?.length > 0) {
    const item = properties?.data[0].last_year_collections;
    labels = item.map((month) => month["month"]);
    labels = labels.reverse();
  } else {
    labels = getLast12Months();
  }

  const colors = [
    "rgb(255, 99, 132)",
    "rgb(255, 159, 64)",
    "rgb(255, 205, 86)",
    "rgb(75, 192, 192)",
    "rgb(54, 162, 235)",
    "rgb(153, 102, 255)",
    "rgb(201, 203, 207)",
  ];

  const background = [
    "rgba(255, 99, 132, 0.2)",
    "rgba(255, 159, 64, 0.2)",
    "rgba(255, 205, 86, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(201, 203, 207, 0.2)",
  ];

  const datasets = properties?.data?.map((property, index) => {
    let borderColor = `${colors[index % colors.length]}`;
    let backgroundColor = `${background[index % background.length]}`;
    const collections = property.last_year_collections;
    // console.log(collections);
    const data = collections.map((item) => item.collections).reverse();

    return {
      label: property.name,
      data: data,
      borderColor: borderColor,
      backgroundColor: backgroundColor,
      tension: 0.5,
    };
  });

  const data = {
    labels,
    datasets: datasets,
  };
  return (
    <div className="bg-white shadow rounded-lg p-3">
      {!datasets ? <></> : <Line options={options} data={data} />}
    </div>
  );
}

export default RentCollectionsChart;
