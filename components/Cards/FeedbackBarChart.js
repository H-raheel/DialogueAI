import Chart from "chart.js/auto";
import React, { useEffect, useState } from "react";

export default function CardBarChart({ chatid }) {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
console.log(chatid)
  useEffect(() => {
    // Function to fetch data based on chatid
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulating a data fetch with chatid
        // Replace this with your actual data fetching logic
        const data = {
         //grammer,vocab,tone
          mistakes: [50, 62, 70]
        };
        setChartData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (chatid!="") {
        console.log("hereeii")
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (!loading && chartData) {
      let config = {
        type: "bar",
        data: {
          labels: [
            "Grammer",
            "Vocabulary",
            "Tone"
          ],
          datasets: [
            {
              label: "Mistakes",
              backgroundColor: "rgba(54, 162, 235, 0.7)", // Bright blue
              borderColor: "rgba(54, 162, 235, 1)",
              data: chartData.mistakes,
              borderWidth: 1,
              barThickness: 20, // Thicker bars
              maxBarThickness: 30, // Maximum thickness for better spacing
            }
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

      let ctx = document.getElementById("bar-chart").getContext("2d");
      window.myBar = new Chart(ctx, config);
    }
  }, [loading, chartData]);

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
            {loading ? (
              <p>Loading chart data...</p>
            ) : (
              <canvas id="bar-chart"></canvas>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
