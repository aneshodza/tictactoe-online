import './App.css';
import { useState, useEffect } from 'react';
import socketIO from 'socket.io-client';

const ENDPOINT = 'http://localhost:3001';

function App() {
  const [player, setPlayer] = useState(3);
  const [turn, setTurn] = useState(1);
  const [squares, setSquares] = useState(Array.from({length: 9}, (_, index) => {
    return {
      id: index,
      value: 0,
      element: <div className="square" onClick={() => clickHandler(index)}></div>
    }
  }));

  useEffect(() => {
    if (sessionStorage.getItem('uid') === null) {
      sessionStorage.setItem('uid', Math.floor(Math.random() * 1000000000000000));
    }
    const socket = socketIO.connect(ENDPOINT, {query: 'uid=' + sessionStorage.getItem('uid')});
    socket.on('joined', (data) => {
      setPlayer(data.player);
    })
  }, []);

  const clickHandler = (id) => {
    if (turn !== player) {
      return;
    }
    let newSquares = squares;
    newSquares[id].value = player;
    setSquares([...newSquares]);
    fetch(ENDPOINT + '/move', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uid: sessionStorage.getItem('uid'),
        move: id
      })
    })
  }

  return (
    <div id="playing">
      <span className="player-notation">You are
        <span id={`player-${player}`}>{player === 3 ? ' spectating' : ` player ${player}`}</span>
      </span>
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
