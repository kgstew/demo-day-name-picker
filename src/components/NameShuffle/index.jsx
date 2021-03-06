import "./nameShuffle.css";
import { shuffle } from "lodash";
import { useState } from "react";
import { format } from "date-fns";
import useGoogleSheets from "../../hooks/useGoogleSheets";

const getRandomColor = () => Math.floor(Math.random() * 16777215).toString(16);

const getContrastYIQ = (hexcolor) => {
  var r = parseInt(hexcolor.substr(0, 2), 16);
  var g = parseInt(hexcolor.substr(2, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "000" : "fff";
};

const DisplayName = (props) => {
  const { name } = props;
  return <div className="name-cell">{name}</div>;
};

const DisplayPair = (props) => {
  const { pair } = props;
  const color = getRandomColor();
  const textContrastColor = getContrastYIQ(color);
  return (
    <div
      className="pair-cell"
      style={{ backgroundColor: `#${color}`, color: `#${textContrastColor}` }}
    >
      {pair}
    </div>
  );
};

const getNamesForTeamFromRows = (rows, teamName) => {
  return rows.map((row) => {
    return row[teamName];
  });
};

const NameShuffleDisplay = (props) => {
const { names } = props;
  const [shuffledNames, setShuffledNames] = useState(names);
  const [lastPressed, setLastPressed] = useState(new Date());

  const numberOfPairs = [
    ...Array(Math.ceil(shuffledNames.length / 2, 2)).keys(),
  ];
  const pairs = numberOfPairs.map((item) => `Pair ${item + 1}`);

  return (
    <div className="App">
      <header className="App-header">
        <div className="date-wrapper">
          Last pressed on {format(lastPressed, "MMM d y 'at' HH:mm")}
        </div>
        <div className="shuffle-container">
          <div className="pairs-wrapper">
            {pairs.map((pair, index) => (
              <DisplayPair pair={pair} key={`${pair}-${index}`} />
            ))}
          </div>
          <div className="names-wrapper">
            {shuffledNames.map((name, index) => {
              return <DisplayName name={name} key={`${name}-${index}`} />;
            })}
          </div>
        </div>
        <div className="shuffle-button-wrapper">
          <button
            className="shuffle-button"
            onClick={() => {
              const newNames = shuffle(shuffledNames);
              setShuffledNames(newNames);
              setLastPressed(new Date());
            }}
          >
            Shuffle
          </button>
        </div>
      </header>
    </div>
  );
}


const NameShuffle = () => {
    const query = useGoogleSheets({ sheetIndex: 0 });
  if (query.loading) {
    return "...Loading";
  }

  const { data } = query;

  const names = getNamesForTeamFromRows(data, "Food Prep");

  return <NameShuffleDisplay names={names} />
}

export default NameShuffle
