import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

function MoveButton(props) {
  return (
    <li>
      <button onClick={() => props.onClick(props.move)}>{props.desc}</button>
    </li>
  );
}

class MoveList extends React.Component{
  renderMoveButton(move, desc) {
    return (
      <MoveButton
        move={move}
        desc={desc}
        onClick={(moveData) => this.props.onClick(moveData)}
        key={move} />
    );
  }

  render() {
    return (
      this.props.history.map((step, move) => {
        const desc = move ?
              'Go to move #' + move + " (" + step.character + " at " + step.move + ")":
              'Go to game start';
        console.log(this.props.currentStep)
        console.log(move)
        if (this.props.currentStep === move) {
          return (
              <b>{this.renderMoveButton(move, desc)}</b>
          );
        } else {
          return (
            this.renderMoveButton(move, desc)
          );
        }
      })
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          move: Array(2).fill(null),
        }
      ],
      stepNumber: 0,
      currentCharacter: nextCharacter(null),
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.currentCharacter;
    this.setState({
      history: history.concat([
        {
          squares: squares,
          move: coordFromIndex(i),
          character: this.state.currentCharacter,
        }
      ]),
      stepNumber: history.length,
      currentCharacter: nextCharacter(this.state.currentCharacter),
    });
  }

  handleMove(move) {
    const stepCharacter = this.state.history[move].character
    this.setState({
      stepNumber: move,
      currentCharacter: nextCharacter(stepCharacter),
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.currentCharacter);
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>
        <MoveList
          history={history}
          currentStep={this.state.stepNumber}
          onClick={(move) => this.handleMove(move)}
        />
        </ol>
        </div>
      </div>
    );
  }
}


function coordFromIndex(i) {
  const col = i % 3;
  const row = Math.floor(i/3)
  return [row, col]
}

function nextCharacter(char) {
  return (char === "X") ? "O" : "X"
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
      return squares[a];
    }
  }
  return null;
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
