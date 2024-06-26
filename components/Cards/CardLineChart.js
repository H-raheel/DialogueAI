import { Chart } from "chart.js";
import { useEffect, useRef } from "react";
export default function CardLineChart() {
  const chartContainer = useRef(null);

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      const ctx = chartContainer.current.getContext("2d");

      // Check if a chart instance already exists and destroy it
      if (window.myLine) {
        window.myLine.destroy();
      }

      var config = {
        type: "line",
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
            },
            {
              label: "Japanese",
              backgroundColor: "rgba(255, 193, 7, 0.5)",
              borderColor: "rgba(255, 193, 7, 1)",
              data: [42, 54, 65, 49, 45, 55, 62],
              fill: false,
            },
            {
              label: "Spanish",
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              data: [38, 48, 55, 42, 40, 50, 58],
              fill: false,
            },
            {
              label: "Portuguese",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              borderColor: "rgba(255, 99, 132, 1)",
              data: [30, 40, 45, 35, 32, 42, 50],
              fill: false,
            },
            {
              label: "German",
              backgroundColor: "rgba(153, 102, 255, 0.5)",
              borderColor: "rgba(153, 102, 255, 1)",
              data: [25, 30, 38, 28, 25, 32, 40],
              fill: false,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          title: {
            display: false,
            text: "Sales Charts",
            fontColor: "white",
          },
          legend: {
            labels: {
              fontColor: "white",
            },
            align: "end",
            position: "bottom",
          },
          tooltips: {
            mode: "index",
            intersect: false,
          },
          hover: {
            mode: "nearest",
            intersect: true,
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  fontColor: "rgba(255,255,255,.7)",
                },
                display: true,
                scaleLabel: {
                  display: false,
                  labelString: "Month",
                  fontColor: "white",
                },
                gridLines: {
                  display: false,
                  borderDash: [2],
                  borderDashOffset: [2],
                  color: "rgba(33, 37, 41, 0.3)",
                  zeroLineColor: "rgba(0, 0, 0, 0)",
                  zeroLineBorderDash: [2],
                  zeroLineBorderDashOffset: [2],
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  fontColor: "rgba(255,255,255,.7)",
                },
                display: true,
                scaleLabel: {
                  display: false,
                  labelString: "Value",
                  fontColor: "white",
                },
                gridLines: {
                  borderDash: [3],
                  borderDashOffset: [3],
                  drawBorder: false,
                  color: "rgba(255, 255, 255, 0.15)",
                  zeroLineColor: "rgba(33, 37, 41, 0)",
                  zeroLineBorderDash: [2],
                  zeroLineBorderDashOffset: [2],
                },
              },
            ],
          },
        },
      };

      window.myLine = new Chart(ctx, config);
    }
  }, []);

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700">
      <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <h6 className="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
              Class Performance
            </h6>
            <h2 className="text-white text-xl font-semibold">Average Score</h2>
          </div>
        </div>
      </div>
      <div className="p-4 flex-auto">
        <div className="relative h-96">
          <canvas ref={chartContainer}></canvas>
        </div>
      </div>
    </div>
  );
}
