import React, { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
import Chart from "chart.js";
const SERVER_URL = require('../../config/redirect').SERVER_URL;
var dataSource = {
  datasets: [
    {
      data: [],
      backgroundColor: [],
    },
  ],
  labels: [],
};

export default function DonutChart() {
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
        params: {
          month: month,
        },
        headers: {
          "x-auth-token": `${token}`,
        },
      })
      .then((res) => {
        for (var i = 0; i < res.data.length; i++) {
          dataSource.labels[i] = res.data[i].category;
          dataSource.datasets[0].data[i] = res.data[i].budget;
          dataSource.datasets[0].backgroundColor[i] = getRandomColor();
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
                var exp = expenseMap.get(dataSource.labels[i]);
                var percentage = getPercentage(
                  exp,
                  dataSource.datasets[0].data[i]
                );
                dataSource.labels[i] =
                  dataSource.labels[i] + ", Expense Usage:" + percentage + "%";
              } else {
                dataSource.labels[i] =
                  dataSource.labels[i] + ", Expense Usage: 0% ";
              }
            }
            if (response) {
              setDataExists(true);
              renderPieChart();
            }
          });
      });
    function getPercentage(exp, bud) {
      return (exp * 100) / bud;
    }
    function renderPieChart() {
      var ctx = document.getElementById("myPieChart").getContext("2d");
      const options = {
        title: {
          display: true,
          text: "Donut Chart",
        },
      };
      var myPieChart = new Chart(ctx, {
        type: "doughnut",
        data: dataSource,
        options: options,
      });
    }
  }, [month]);
  return (
    <div className="donut">
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
          <canvas id="myPieChart"></canvas>
        </>
      ) : (
        <>Data Not available for Donut Chart</>
      )}
    </div>
  );
}
