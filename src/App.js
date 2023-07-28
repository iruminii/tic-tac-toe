import { useState } from 'react';

const rows = 3;
const cols = 3;

function Square({ value, onSquareClick, isWin}) {
  return (
    <button className={"square" + (isWin ? " square-win" : "") + (value === 'X' ? " square-x" : " square-o")} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    nextSquares[rows*cols] = (i2rc(i, rows, cols));
    onPlay(nextSquares);
  }
  const winner = calculateWinner(squares);
  let status;
  
  if (winner) {
    status = 'Winner: ' + squares[winner[0]];
  } else {
    if(squares.some((x) => x === null)) {
      status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }
    else {
      status = 'Draw';
    }
  }

  function i2rc(i, rows, cols) {
    let tmp = (i * rows) / cols;
    return (`(${parseInt((tmp/cols))+1},${(tmp%cols)+1})`);
  }

  function isWinner(winner, position) {
    //console.log(`hi isWinner, winner = ${winner} position = ${position} `);
    if(winner && winner.includes(position)) {
      //console.log(`hi im a winning square`);
      return true;
    } else {
      //console.log(`hi im a losing square`);
      return false;
    }
  }

  function drawBoard(rows, cols) {
    return (
      [...Array(rows).fill(null)].map((x, rowi) => {
        return(
        <div className="board-row">
          {
            [...Array(cols).fill(null)].map((y, coli) => {
              let location = rowi * cols + coli;
              return (
                <Square value={squares[location]} isWin={isWinner(winner, location)} onSquareClick={() => handleClick(location)}/>
              )
            })
          }
        </div>
        )
      })
    )
  }

  return (
    <>
      <div className="status">{status}</div>
      {drawBoard(rows,cols)}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null), null]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isAsc, setIsAsc] = useState(true);
  
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let thismove;
    let description;
    if(move === history.length - 1) {
      description = `You are at move #${move}`;
      thismove = true;
    }
    else if (move > 0) {
      description = `Go to move #${move} ${squares[rows*cols]}`;
      thismove = false;
    } else {
      description = 'Go to game start (rows, cols)';
      thismove = false;
    }
    return (
      <ul key={move}>
        <button className={thismove ? "this-move" : ""} onClick={() => jumpTo(move)}>{description}</button>
      </ul>
    );
  });
  function toggleAsc() {
    setIsAsc(!isAsc);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button className="move-sort" onClick={() => toggleAsc()}>{isAsc ? 'ascending' : 'descending'}</button>
        <ol>{isAsc ? moves : moves.toReversed()}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}