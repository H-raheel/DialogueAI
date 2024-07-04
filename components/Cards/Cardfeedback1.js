import React from "react";

// Components
export default function CardGeneralFeedback({ data }) {
  console.log(data);
  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded overflow-y-scroll h-80 max-h-80">
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3 className="font-semibold text-lg text-blueGray-700">
              General Feedback
            </h3>
          </div>
        </div>
      </div>
      <div className="block w-full">
        {data === undefined ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : (
          <table className="items-center justify-center w-full bg-transparent border-collapse">
            <tbody className="text-black">
              <tr>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm p-4">
                  <span className="block text-lg font-bold text-blue-600">
                    Grammatical
                  </span>
                  <span className="block text-md text-gray-700 mt-1">
                    {data.grammatical}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm p-4">
                  <span className="block text-lg font-bold text-blue-600">
                    Tone
                  </span>
                  <span className="block text-md text-gray-700 mt-1">
                    {data.tone}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm p-4">
                  <span className="block text-lg font-bold text-blue-600">
                    Vocabulary
                  </span>
                  <span className="block text-md text-gray-700 mt-1">
                    {data.vocabulary}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
