import Chart from "chart.js/auto";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function CardBarChart() {
  const [data, setData] = useState(null);
  const role = useSelector((state) => state.role);
  const user = useSelector((state) => state.user);

  const transformData = (data) => {
    // Initialize arrays to store transformed data
    let labels = [];
    let grammarErrors = [];
    let toneErrors = [];
    let vocabularyErrors = [];
  
    // Iterate through each object in the input data
    data.forEach((assignment) => {
      // Extract values from each assignment object
      labels.push(assignment.assignment_id);
      grammarErrors.push(assignment.total_grammar_errors);
      toneErrors.push(assignment.total_tone_errors);
      vocabularyErrors.push(assignment.total_vocabulary_errors);
    });
  
    // Construct the transformed object
    const transformedData = {
      labels: labels,
      grammar_errors: grammarErrors,
      tone_errors: toneErrors,
      vocabulary_errors: vocabularyErrors,
    };
  
    return transformedData;
  };
  
  // Example usage:
  const inputData = [
    {
      assignment_id: "assignment_en_1",
      total_grammar_errors: 22,
      total_tone_errors: 48,
      total_vocabulary_errors: 25,
    },
    {
      assignment_id: "assignment_en_2",
      total_grammar_errors: 0,
      total_tone_errors: 0,
      total_vocabulary_errors: 0,
    },
    {
      assignment_id: "assignment_en_3",
      total_grammar_errors: 10,
      total_tone_errors: 22,
      total_vocabulary_errors: 11,
    },
  ];
  
  const transformed = transformData(inputData);
  console.log(transformed);
  

  useEffect(() => {
   
    // Simulate API call
    const fetchStudentData = async () => {
    //  setLoading(true);
      try {
       
        const response = await fetch("/api/get_last_six_error_summation_for_student", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ user_id: user }),
        });
        const fetchedData = await response.json();
        console.log(fetchedData)
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
     //   setLoading(false);
      }
    };
    const fetchTeacherData = async () => {
      //  setLoading(true);
        try {
         
          const response = await fetch("/api/get_bar_statistics_for_teacher", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ user_id: user }),
          });
          const fetchedData = await response.json();
          console.log(fetchedData)
          setData(transformData(fetchedData));
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
       //   setLoading(false);
        }
      };
role=="student"?
    fetchStudentData():
    
    fetchTeacherData();
  }, []);

  useEffect(() => {

    if (data) {
      const config = {
        type: "bar",
        data: {
          labels: data.labels,
          datasets: [
            {
              label: "Grammar Mistakes",
              backgroundColor: "rgba(54, 162, 235, 0.7)", // Bright blue
              borderColor: "rgba(54, 162, 235, 1)",
              data: data["grammer_errors"],
              borderWidth: 1,
              barThickness: 20, // Thicker bars
              maxBarThickness: 30, // Maximum thickness for better spacing
            },
            {
              label: "Vocabulary Mistakes",
              backgroundColor: "rgba(255, 99, 132, 0.7)", // Bright red
              borderColor: "rgba(255, 99, 132, 1)",
              data: data["vocabulary_errors"],
              borderWidth: 1,
              barThickness: 20,
              maxBarThickness: 30,
            },
            {
              label: "Tone Mistakes",
              backgroundColor: "rgba(255, 206, 86, 0.7)", // Bright yellow
              borderColor: "rgba(255, 206, 86, 1)",
              data: data["tone_errors"],
              borderWidth: 1,
              barThickness: 20,
              maxBarThickness: 30,
            },
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

      const ctx = document.getElementById("bar-chart").getContext("2d");
      if (window.myBar) {
        window.myBar.destroy(); // Destroy previous chart instance
      }
      window.myBar = new Chart(ctx, config);
    }
  }, [data]);

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
        <div className="p-4 flex-auto justify-center items-center">
          {/* Chart */}
        
          <div className="relative h-350-px">
          {data==null?
          (
          <div className="flex flex-col justify-center items-center">
          <Loader/>
          </div>):
            <canvas id="bar-chart"></canvas>
          
}
</div>
        </div>
      </div>
    </>
  );
}


const Loader = () => (
  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-500"></div>
);
