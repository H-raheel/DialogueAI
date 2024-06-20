import Chart from "chart.js/auto";
import React from "react";

export default function CardBarChart({role}) {
  React.useEffect(() => {
    let config = {
      type: "bar",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
       
          datasets: [
           
            // Additional datasets for languages
            {
              label: "English",
              backgroundColor: "rgba(75, 81, 191, 0.5)",
              borderColor: "rgba(75, 81, 191, 1)",
              data: [50, 62, 70, 58, 55, 63, 70],
              fill: false,
              barThickness: 5,
            },
            {
              label: "Japanese",
              backgroundColor: "rgba(255, 193, 7, 0.5)",
              borderColor: "rgba(255, 193, 7, 1)",
              data: [42, 54, 65, 49, 45, 55, 62],
              fill: false,
              barThickness: 5,
            },
            {
              label: "Spanish",
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              data: [38, 48, 55, 42, 40, 50, 58],
              fill: false,
              barThickness: 5,
            },
            {
              label: "Portuguese",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              borderColor: "rgba(255, 99, 132, 1)",
              data: [30, 40, 45, 35, 32, 42, 50],
              fill: false,
              barThickness: 5,
            },
            {
              label: "German",
              backgroundColor: "rgba(153, 102, 255, 0.5)",
              borderColor: "rgba(153, 102, 255, 1)",
              data: [25, 30, 38, 28, 25, 32, 40],
              fill: false,
              barThickness: 5,
            },
          ],
        
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          text: "Orders Chart",
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        legend: {
          labels: {
            fontColor: "rgba(0,0,0,.4)",
          },
          align: "end",
          position: "bottom",
        },
        scales: {
          xAxes: [
            {
              display: false,
              scaleLabel: {
                display: true,
                labelString: "Month",
              },
              gridLines: {
                borderDash: [2],
                borderDashOffset: [2],
                color: "rgba(33, 37, 41, 0.3)",
                zeroLineColor: "rgba(33, 37, 41, 0.3)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Value",
              },
              gridLines: {
                borderDash: [2],
                drawBorder: false,
                borderDashOffset: [2],
                color: "rgba(33, 37, 41, 0.2)",
                zeroLineColor: "rgba(33, 37, 41, 0.15)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
        },
      },
    };
    let ctx = document.getElementById("bar-chart").getContext("2d");
    window.myBar = new Chart(ctx, config);
  }, []);
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded pb-8">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
              Assignments
              </h6>
              <h2 className="text-blueGray-700 text-xl font-semibold">
               {role=="Student"? "Assignments Submitted":" Assignments Given"}
              </h2>
            </div>
          </div>
        </div>
        <div className="p-4 flex-auto">
          {/* Chart */}
          <div className="relative h-350-px">
            <canvas id="bar-chart"></canvas>
          </div>
        </div>
      </div>
    </>
  );
}
