import React from "react";

const GridHeroes = ({ heroes, pick }) => {
  const api = import.meta.env.VITE_BASE_URL;

  const sortedHeroes = heroes.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="grid grid-cols-6 gap-6 place-items-center h-[23rem] font-league-gothic text-2xl overflow-y-scroll no-scrollbar">
      {sortedHeroes.map((value) => (
        <div key={value.name} className="flex flex-col items-center">
          <img
            src={`${api+value.icon}`}
            className="w-16 h-16 cursor-pointer"
            onClick={() => pick(value.name)}
          />
          <div className="">{value.name}</div>
        </div>
      ))}
    </div>
  );
};

export default GridHeroes;
