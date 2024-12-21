import React from "react";

const MidSection = ({ predict, result, setResult, setDatapick }) => {
  const handleReset = () => {
    setResult("");
    setDatapick({ blue: [], red: [] });
  };

  return (
    <>
      <div className="absolute left-1/2 transform -translate-x-1/2 top-14 z-10 flex flex-col justify-center items-center">
        {result === "" ? (
          <div className="font-bebas-neue text-white text-6xl mb-5">VS</div>
        ) : (
          <button
            className="relative z-10 w-14 h-14 p-3 flex justify-center bg-slate-800 text-gray-300 rounded-full hover:text-gray-200 active:text-gray-50 focus:outline-none"
            onClick={handleReset}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                fill="currentColor"
                d="M386.3 160L336 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="absolute z-10 bottom-12 left-1/2 transform -translate-x-1/2">
        <button
          className="relative z-10 w-14 h-14 p-3 flex justify-center bg-slate-800 text-gray-300 hover:text-gray-200 active:text-gray-50 focus:outline-none"
          id="Brain"
          onClick={predict}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="w-7 h-7"
          >
            <path
              fill="currentColor"
              d="M184 0c30.9 0 56 25.1 56 56l0 400c0 30.9-25.1 56-56 56c-28.9 0-52.7-21.9-55.7-50.1c-5.2 1.4-10.7 2.1-16.3 2.1c-35.3 0-64-28.7-64-64c0-7.4 1.3-14.6 3.6-21.2C21.4 367.4 0 338.2 0 304c0-31.9 18.7-59.5 45.8-72.3C37.1 220.8 32 207 32 192c0-30.7 21.6-56.3 50.4-62.6C80.8 123.9 80 118 80 112c0-29.9 20.6-55.1 48.3-62.1C131.3 21.9 155.1 0 184 0zM328 0c28.9 0 52.6 21.9 55.7 49.9c27.8 7 48.3 32.1 48.3 62.1c0 6-.8 11.9-2.4 17.4c28.8 6.2 50.4 31.9 50.4 62.6c0 15-5.1 28.8-13.8 39.7C493.3 244.5 512 272.1 512 304c0 34.2-21.4 63.4-51.6 74.8c2.3 6.6 3.6 13.8 3.6 21.2c0 35.3-28.7 64-64 64c-5.6 0-11.1-.7-16.3-2.1c-3 28.2-26.8 50.1-55.7 50.1c-30.9 0-56-25.1-56-56l0-400c0-30.9 25.1-56 56-56z"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default MidSection;
