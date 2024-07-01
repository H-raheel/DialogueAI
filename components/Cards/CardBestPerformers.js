import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
export default function CardStudentsPerformance() {
  const [loading, setLoading] = useState(true);
  const [highAchievers, setHighAchievers] = useState([]);
  const [needsImprovement, setNeedsImprovement] = useState([]);
  const user = useSelector((state) => state.user);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
       
        const response = await fetch("/api/get_student_highest_lowest_achievements", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ user_id: user }),
        });
        const data = await response.json();
       console.log(data)
        setHighAchievers(data.highAchievers);
        setNeedsImprovement(data.needsImprovement);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-base text-blueGray-700">
                Students Performance
              </h3>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead className="thead-light">
              <tr>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  High Achievers
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Needs Improvement
                </th>
              </tr>
            </thead>
            <tbody className="text-black">
              {loading ? (
                <tr>
                  <td colSpan="2" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : (
                highAchievers.map((student, index) => (
                  <tr key={index}>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {student}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {needsImprovement[index] || "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
