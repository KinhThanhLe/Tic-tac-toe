import { useState } from 'react';

function Square({ value, onSquareClick, className }) {
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winnerLine }) {
  const boardSize = 3;

  function renderSquare(i) {
    const isWinnerSquare = winnerLine && winnerLine.includes(i);
    const classSquare = isWinnerSquare ? "square winner" : "square";
    return (
      <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        className={classSquare}
      />
    );
  }

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);

  const status = winner
    ? `Winner: ${squares[winner[0]]}`
    : !squares.includes(null)
      ? 'It\'s a draw!'
      : 'Next player: ' + (xIsNext ? 'X' : 'O');

  const rows = [];
  for (let row = 0; row < boardSize; row++) {
    const squaresInRow = [];
    for (let col = 0; col < boardSize; col++) {
      squaresInRow.push(renderSquare(row * boardSize + col));
    }
    rows.push(
      <div key={row} className="board-row">
        {squaresInRow}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}


export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), moveLocation: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentStep = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = history.slice(0, currentMove + 1);
    const moveLocation = calculateMoveLocation(nextSquares, currentStep.squares);
    nextHistory.push({ squares: nextSquares, moveLocation });
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function toggleSort() {
    setIsAscending(!isAscending);
  }

  const sortedHistory = isAscending ? history : history.slice().reverse();

  const moves = sortedHistory.map((step, move) => {
    const reversedMove = isAscending ? move : sortedHistory.length - 1 - move;
    const description = reversedMove ?
      `Go to move #${reversedMove} ${step.moveLocation ? `(${step.moveLocation})` : ''}` :
      'Go to game start';

    if (reversedMove === currentMove) {
      return (
        <li key={reversedMove}>
          <span>{`You are at move #${currentMove}`}</span>
        </li>
      );
    }

    return (
      <li key={reversedMove}>
        <button onClick={() => jumpTo(reversedMove)}>{description}</button>
      </li>
    );
  });

  const winnerLine = calculateWinner(currentStep.squares);

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentStep.squares} onPlay={handlePlay} winnerLine={winnerLine} />
      </div>
      <div className="game-info">
        <div>
          <button onClick={toggleSort}>
            {isAscending ? 'Sort Descending' : 'Sort Ascending'}
          </button>
        </div>
        <ol>{moves}</ol>
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
      return lines[i];
    }
  }
  return null;
}

function calculateMoveLocation(nextSquares, prevSquares) {
  for (let i = 0; i < nextSquares.length; i++) {
    if (nextSquares[i] && !prevSquares[i]) {
      const row = Math.floor(i / 3) + 1;
      const col = (i % 3) + 1;
      return `(${row}, ${col})`;
    }
  }
  return null;
}
