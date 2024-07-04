import PropTypes from "prop-types";
import { default as React, default as React } from "react";

export default function CardStats({
  statSubtitle,
  statTitle,
  statIconName, // Pass the icon name as a prop
  statIconColor // Pass the icon color as a prop
}) {
  return (
    <>
    <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
      <div className="flex-auto p-4">
        <div className="flex flex-wrap items-start justify-between">
          <div className="relative flex-grow flex-1 w-auto max-w-full mb-2">
            <h5 className="text-blueGray-400 uppercase font-bold text-xs break-all">
              {statSubtitle}
            </h5>
            <span className="font-semibold text-xl text-blueGray-700">
              {statTitle}
            </span>
          </div>
          <div className="relative flex-shrink-0 w-12 h-12 ml-4">
            <div
              className={`flex items-center justify-center w-full h-full text-white rounded-full ${statIconColor}`}
            >
              <i className={statIconName}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}






CardStats.propTypes = {
  statSubtitle: PropTypes.string,
  statTitle: PropTypes.string,
  statArrow: PropTypes.oneOf(["up", "down"]),
  statPercent: PropTypes.string,
  // can be any of the text color utilities
  // from tailwindcss
  statPercentColor: PropTypes.string,
  statDescripiron: PropTypes.string,
  statIconName: PropTypes.string,
  // can be any of the background color utilities
  // from tailwindcss
  statIconColor: PropTypes.string,
};
