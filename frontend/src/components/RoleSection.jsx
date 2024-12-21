import React from "react";

const RoleSection = ({ active, setActive }) => {
  const roles = ["Tank", "Fighter", "Assassin", "Mage", "Marksman", "Support"];

  return (
    <div className="flex justify-center items-center gap-3 font-league-gothic text-3xl text-center pb-2 select-none">
      {roles.map((role, index) => (
        <div
          key={index}
          className={`${
            active === role ? "bg-gray-900" : "bg-gray-600"
          } text-gray-50 w-36 py-1 cursor-pointer uppercase`}
          onClick={() => setActive(active === role ? "" : role)}
        >
          {role}
        </div>
      ))}
    </div>
  );
};

export default RoleSection;
