import './App.css';
import { useState, useEffect } from 'react';
import socketIO from 'socket.io-client';

const ENDPOINT = 'http://localhost:3001';
const socket = socketIO.connect(ENDPOINT);

function App() {
  const [player, setPlayer] = useState(1);
  const [squares, setSquares] = useState(Array.from({length: 9}, (elm, index) => {
    return {
      id: index,
      value: 0,
      element: <div className="square" onClick={() => clickHandler(index)}></div>
    }
  }));

  useEffect(() => {
  }, []);

  const clickHandler = (id) => {
    let newSquares = squares;
    newSquares[id].value = player;
    setSquares([...newSquares]);
  }

  return (
    <div id="playing">
      <span className="player-notation">You are <span id={`player-${player}`}>player {player}</span></span>
      <div className="resize-helper">
        <div className="outer-container">
          {squares.map((square) => 
            <div key={square.id} className={`player-${square.value} square`} onClick={() => clickHandler(square.id)}></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
