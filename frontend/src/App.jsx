import { useState, useEffect } from "react";
import GridHeroes from "./components/GridHeroes";
import RoleSection from "./components/RoleSection";
import TeamSection from "./components/TeamSection";
import MidSection from "./components/MidSection";
import useFetch from "./utility/useFetch";
import Loading from "./components/Loading";

export default function App() {
  const [datapick, setDatapick] = useState({ blue: [], red: [] });
  const [activeRole, setActiveRole] = useState("");
  const [filteredHeroes, setFilteredHeroes] = useState([]);
  const [result, setResult] = useState("");

  const api = import.meta.env.VITE_API_URL;

  const { data: heroes, loading: loadingHero } = useFetch(api + "/heroes");
  const { data: positions, loading: loadingPosition } = useFetch(
    api + "/positions"
  );

  const isLoading = loadingHero || loadingPosition;

  useEffect(() => {
    if (!heroes) return;

    const filtered = activeRole
      ? heroes.filter((hero) => hero.role.includes(activeRole))
      : heroes;
    setFilteredHeroes(filtered);
  }, [activeRole, heroes]);

  const onclickHeroIcon = (name) => {
    setDatapick((prevDatapick) => {
      // Check if the hero is already in either team
      if (prevDatapick.blue.includes(name) || prevDatapick.red.includes(name)) {
        return prevDatapick;
      }

      // Find the first null position in the blue team
      const blueTeam = [...prevDatapick.blue];
      const blueIndex = blueTeam.indexOf(null);
      if (blueIndex !== -1) {
        blueTeam[blueIndex] = name;
      } else if (blueTeam.length < 5) {
        blueTeam.push(name);
      } else {
        // If blue team is full, add to red team
        const redTeam = [...prevDatapick.red];
        const redIndex = redTeam.indexOf(null);
        if (redIndex !== -1) {
          redTeam[redIndex] = name;
        } else if (redTeam.length < 5) {
          redTeam.push(name);
        }
        return { blue: blueTeam, red: redTeam };
      }

      return { blue: blueTeam, red: prevDatapick.red };
    });
  };

  const removeHero = (side, index) => {
    setDatapick((prevDatapick) => {
      const newTeam = [...prevDatapick[side]];
      newTeam[index] = null; // Ganti elemen yang dihapus dengan null

      const newDatapick = { ...prevDatapick, [side]: newTeam };

      // Reset data jika semua hero dihapus
      if (newDatapick[side].every((hero) => hero === null)) {
        newDatapick[side] = [];
      }

      // Reset data jika semua hero di kedua tim dihapus
      if (
        newDatapick.blue.every((hero) => hero === null) &&
        newDatapick.red.every((hero) => hero === null)
      ) {
        return { blue: [], red: [] };
      }

      return newDatapick;
    });
  };

  const predict = async () => {
    try {
      if (
        datapick.blue.length === 5 &&
        datapick.red.length === 5 &&
        !datapick.blue.includes(null) &&
        !datapick.red.includes(null)
      ) {
        const jsonData = JSON.stringify([...datapick.blue, ...datapick.red]);
        const response = await fetch(`${api}/data-pick`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: jsonData,
        });
        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          return;
        }
        const res = await response.json();
        const rs = res.prediction.toLocaleLowerCase();

        setResult(rs);
      }
    } catch (error) {
      console.error("Prediction failed:", error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center min-h-screen bg-slate-950">
      <div className="max-w-7xl max-h-screen w-full h-full bg-[#fdfdfd] overflow-y-hidden">
        <div className="relative">
          <div
            id="team-section"
            className="grid grid-cols-2 relative z-10 pointer-events-auto"
          >
            <TeamSection
              side={"blue"}
              color={"bg-[#39B5FF]"}
              pickedHeroes={datapick.blue}
              removeHero={removeHero}
              win={result}
              positions={positions}
              heroes={heroes}
            />
            <TeamSection
              side={"red"}
              color={"bg-[#FF5958]"}
              pickedHeroes={datapick.red}
              removeHero={removeHero}
              win={result}
              positions={positions}
              heroes={heroes}
            />
          </div>
          <MidSection predict={predict} result={result} setResult={setResult} setDatapick={setDatapick} />
        </div>
        <div className="relative w-full max-w-4xl mx-auto py-3">
          <RoleSection active={activeRole} setActive={setActiveRole} />
          <div className="h-[23rem] pb-3">
            <GridHeroes heroes={filteredHeroes} pick={onclickHeroIcon} />
          </div>
        </div>
      </div>
    </div>
  );
}
