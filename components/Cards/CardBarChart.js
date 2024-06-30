import Chart from "chart.js/auto";
import React from "react";

export default function CardBarChart({role}) {
  const data={
    "labels": [
      "assignment1",
      "assignment2",
      "assignment3",
      "assignment4",
      "assignment5",
      "assignment6",
     
    ],
    "Grammer Mistakes": [50, 62, 70, 58, 65,50],
    "Vocabulary Mistakes": [30, 40, 35, 45, 50,50],
    "Tone Mistakes": [20, 25, 30, 35, 40,50],
  
  }
  React.useEffect(() => {
    let config = {
      type: "bar",
      data: {
        labels: data["labels"],
        datasets: [
          {
            label: "Grammar Mistakes",
            backgroundColor: "rgba(54, 162, 235, 0.7)", // Bright blue
            borderColor: "rgba(54, 162, 235, 1)",
            data: data["Grammer Mistakes"],
            borderWidth: 1,
            barThickness: 20, // Thicker bars
            maxBarThickness: 30, // Maximum thickness for better spacing
          },
          {
            label: "Vocabulary Mistakes",
            backgroundColor: "rgba(255, 99, 132, 0.7)", // Bright red
            borderColor: "rgba(255, 99, 132, 1)",
            data: data["Vocabulary Mistakes"],
            borderWidth: 1,
            barThickness: 20,
            maxBarThickness: 30,
          },
          {
            label: "Tone Mistakes",
            backgroundColor: "rgba(255, 206, 86, 0.7)", // Bright yellow
            borderColor: "rgba(255, 206, 86, 1)",
            data: data["Tone Mistakes"],
            borderWidth: 1,
            barThickness: 20,
            maxBarThickness: 30,
          },
          // {
          //   label: "Grammar Correct",
          //   backgroundColor: "rgba(75, 192, 192, 0.7)", // Bright teal
          //   borderColor: "rgba(75, 192, 192, 1)",
          //   data: data["Grammer Correct"],
          //   borderWidth: 1,
          //   barThickness: 20,
          //   maxBarThickness: 30,
          // },
          // {
          //   label: "Vocabulary Correct",
          //   backgroundColor: "rgba(153, 102, 255, 0.7)", // Bright purple
          //   borderColor: "rgba(153, 102, 255, 1)",
          //   data: data["Vocabulary Correct"],
          //   borderWidth: 1,
          //   barThickness: 20,
          //   maxBarThickness: 30,
          // },
          // {
          //   label: "Tone Correct",
          //   backgroundColor: "rgba(255, 159, 64, 0.7)", // Bright orange
          //   borderColor: "rgba(255, 159, 64, 1)",
          //   data: data["Tone Correct"],
          //   borderWidth: 1,
          //   barThickness: 20,
          //   maxBarThickness: 30,
          // }
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: true,
          text: "Performance Chart",
          fontSize: 16,
          fontColor: "#333",
          padding: 20,
        },
        tooltips: {
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(0,0,0,0.8)",
          titleFontColor: "#fff",
          bodyFontColor: "#fff",
          xPadding: 10,
          yPadding: 10,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        legend: {
          labels: {
            fontColor: "#333",
            usePointStyle: true,
          },
          align: "start",
          position: "top",
        },
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Assignments",
                fontColor: "#333",
                fontSize: 14,
              },
              gridLines: {
                color: "rgba(200, 200, 200, 0.2)",
                zeroLineColor: "rgba(200, 200, 200, 0.4)",
              },
              barPercentage: 0.8, // Add spacing between bars
              categoryPercentage: 0.5, // Space out bar categories
            },
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Mistakes / Corrections",
                fontColor: "#333",
                fontSize: 14,
              },
              gridLines: {
                color: "rgba(200, 200, 200, 0.2)",
                zeroLineColor: "rgba(200, 200, 200, 0.4)",
              },
            },
          ],
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
          },
        },
      },
    };
    
    // Assuming ctx is the 2D drawing context of the canvas
    
    
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
          Performance
              </h6>
              <h2 className="text-blueGray-700 text-xl font-semibold">
              Overall Performance In Assignments
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
