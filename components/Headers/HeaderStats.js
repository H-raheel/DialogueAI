import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CardStats from "../Cards/CardStats.js";

export default function HeaderStats() {
  const [data, setData] = useState({
    best_performing_student: "",
    worst_performing_student: "",
    language: "",
    number_of_assignments: 0,
  });
  const [loading, setLoading] = useState(true);
  const id = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/get_header_statistics_for_teacher", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ user_id: id }),
        });
       
        const fetchedData = await response.json();
        setData(fetchedData);
        console.log(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
      {/* Header */}
      <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            {/* Card stats */}
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Language"
                  statTitle={loading ? <Loader /> : data.language}
                  statArrow=""
                  statPercent=""
                  statPercentColor="text-emerald-500"
                  statDescripiron=""
                  statIconName="far fa-user"
                  statIconColor="bg-blue-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Assignments Given"
                  statTitle={loading ? <Loader /> : data.number_of_assignments}
                  statArrow=""
                  statPercent=""
                  statPercentColor=""
                  statDescripiron=""
                  statIconName="fas fa-folder"
                  statIconColor="bg-orange-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Needs Improvement"
                  statTitle={loading ? <Loader /> : data.worst_performing_student}
                  statArrow=""
                  statPercent=""
                  statPercentColor=""
                  statDescripiron=""
                  statIconName="fas fa-frown"
                  statIconColor="bg-red-500"
                />
              </div>
              <div className="font-light w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Star Performer"
                  statTitle={loading ? <Loader /> : data.best_performing_student}
                  statArrow=""
                  statPercent=""
                  statPercentColor="text-emerald-500"
                  statDescripiron=""
                  statIconName="fas fa-smile-beam"
                  statIconColor="bg-green-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


const Loader = () => (
  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-500"></div>
);
