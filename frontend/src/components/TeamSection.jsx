import React from "react";

const TeamSection = ({ color, pickedHeroes, side, removeHero, win, positions, heroes }) => {
  const api = import.meta.env.VITE_BASE_URL;
  return (
    <div
      className={`${side === win || win === "" ? color : "bg-gray-700"}`}
      side={side}
    >
      <div
        className={`grid grid-cols-5 justify-start font-bebas-neue text-2xl text-[#fdfdfd] text-center ${
          side === "blue" ? "pr-16" : "pl-16"
        }`}
      >
        {positions.map((value, index) => {
          const hero = pickedHeroes[index];
          const heroData = hero ? heroes.find((h) => h.name === hero) : null;

          return (
            <div
              key={`${value.name + side}`}
              side-data={`${value.name + "-" + side}`}
              onClick={() => removeHero(side, index)}
            >
              <div className="w-full h-[187px] bg-gray-900 flex justify-center items-center">
                {heroData ? (
                  <img src={`${api+heroData.portrait}`} className="w-full h-auto" />
                ) : (
                  <img src={`${api+value.icon}`} className="w-8 h-8" />
                )}
              </div>
              <div className={`py-2 ${side === win || win === "" ? "text-slate-950" : "text-slate-300"}`}>
                {heroData ? heroData.name : value.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamSection;
