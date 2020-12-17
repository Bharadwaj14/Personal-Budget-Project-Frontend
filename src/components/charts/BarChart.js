import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import Chart from "chart.js";

var dataSource = {
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: "",
      label: "Budget",
      borderWidth: 1,
    },
    {
      label: "Expense",
      backgroundColor: "",
      data: [],
      borderWidth: 1,
    },
  ],
};

export default function BarChart() {
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
      .get("http://localhost:5000/budget/get", {
        headers: {
          "x-auth-token": `${token}`,
        },
      })
      .then((res) => {
        for (var i = 0; i < res.data.length; i++) {
          dataSource.labels[i] = res.data[i].category;
          dataSource.datasets[0].data[i] = res.data[i].budget;
          // dataSource.datasets[0].backgroundColor[i]=getRandomColor();
        }
        dataSource.datasets[0].backgroundColor = getRandomColor();

        axios
          .get("http://localhost:5000/expense/get", {
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
            dataSource.datasets[1].backgroundColor = getRandomColor();
          });
        if (res) {
          setDataExists(true);
          renderPieChart();
        }
      });

    function renderPieChart() {
      var ctx = document.getElementById("myBarChart").getContext("2d");
      const options = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Bar Chart",
        },
      };
      var myBarChart = new Chart(ctx, {
        type: "bar",
        data: dataSource,
        options: options,
      });
    }
  }, [month]);
  return (
    <div className="bar">
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
          <canvas id="myBarChart"></canvas>
        </>
      ) : (
        <>Data Not available for Bar Chart</>
      )}
    </div>
  );
}
