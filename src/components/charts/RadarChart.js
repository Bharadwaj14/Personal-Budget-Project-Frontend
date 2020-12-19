import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import Chart from "chart.js";
const SERVER_URL = require('../../config/redirect').SERVER_URL;
var dataSource = {
  labels: [],
  datasets: [
    {
      data: [],
      label: "Budget",
      fill: true,
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgb(255, 99, 132)",
      pointBackgroundColor: "rgb(255, 99, 132)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgb(255, 99, 132)",
    },
    {
      label: "Expense",
      backgroundColor: "",
      data: [],
      fill: true,
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgb(54, 162, 235)",
      pointBackgroundColor: "rgb(54, 162, 235)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgb(54, 162, 235)",
    },
  ],
};

export default function RadarChart() {
  const [dataExists, setDataExists] = useState();
  const [month, setMonth] = useState();
  function getRandomColor() {
    var sixteenLetters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += sixteenLetters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    axios
      .get(SERVER_URL+"/budget/get", {
        headers: {
          "x-auth-token": `${token}`,
        },
      })
      .then((res) => {
        for (var i = 0; i < res.data.length; i++) {
          dataSource.labels[i] = res.data[i].category;
          dataSource.datasets[0].data[i] = res.data[i].budget;
        }

        axios
          .get(SERVER_URL+"/expense/get", {
            params: {
              month: month,
            },
            headers: {
              "x-auth-token": `${token}`,
            },
          })
          .then((response) => {
            let expenseMap = new Map();
            for (var i = 0; i < response.data.length; i++) {
              expenseMap.set(
                response.data[i].category,
                response.data[i].expense
              );
            }
            for (var i = 0; i < res.data.length; i++) {
              if (expenseMap.get(dataSource.labels[i])) {
                dataSource.datasets[1].data[i] = expenseMap.get(
                  dataSource.labels[i]
                );
              } else {
                dataSource.datasets[1].data[i] = 0;
              }
            }
            if (response) {
              setDataExists(true);
              renderPieChart();
            }
          });
      });

    function renderPieChart() {
      var ctx = document.getElementById("myRadarChart").getContext("2d");
      const options = {
        elements: {
          line: {
            tension: 0,
            borderWidth: 3,
          },
        },
        title: {
          display: true,
          text: "Radar Chart",
        },
      };
      var myBarChart = new Chart(ctx, {
        type: "radar",
        data: dataSource,
        options: options,
      });
    }
  }, [month]);
  return (
    <div className="radar">
      <form className="form">
        <label htmlFor="Month">Month</label>
        <select id="month" onChange={(e) => setMonth(e.target.value)}>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
      </form>
      {dataExists ? (
        <>
          <canvas id="myRadarChart"></canvas>
        </>
      ) : (
        <>Data Not available for Radar Chart</>
      )}
    </div>
  );
}
