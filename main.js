const GameBoard = (() => {
  let board = Array.from({ length: 3 }, () => Array(3).fill(""));

  const isValidCoord = (x, y) =>
    Number.isInteger(x) && Number.isInteger(y) && x >= 0 && x < 3 && y >= 0 && y < 3;

  const get = (x, y) => (isValidCoord(x, y) ? board[x][y] : null);

  const set = (x, y, value) => {
    if (!isValidCoord(x, y) || board[x][y] !== "") return false;
    board[x][y] = value;
    return true;
  };

  const isFull = () => board.flat().every(cell => cell !== "");

  const hasWinner = (x, y, symbol) => {
    const rowWin = board[x].every(cell => cell === symbol);
    const colWin = board.every(row => row[y] === symbol);
    const diagWin1 = [0, 1, 2].every(i => board[i][i] === symbol);
    const diagWin2 = [0, 1, 2].every(i => board[i][2 - i] === symbol);
    return rowWin || colWin || diagWin1 || diagWin2;
  };

  const print = () => {
    console.clear();
    console.log("Current Board:");
    board.forEach(row => console.log(row.map(cell => cell || "_").join(" ")));
  };

  const reset = () => {
    board = Array.from({ length: 3 }, () => Array(3).fill(""));
  };

  return { get, set, isFull, hasWinner, print, reset };
})();

const createPlayer = (name, symbol) => ({ name, symbol });

const GameController = (board => {
  let players = [];
  let currentPlayerIndex = 0;

  const start = (player1, player2) => {
    board.reset();
    players = [player1, player2];
    currentPlayerIndex = 0;
  };

  const getCurrentPlayer = () => players[currentPlayerIndex];

  const playTurn = (x, y) => {
    const player = getCurrentPlayer();
    const moveSuccess = board.set(x, y, player.symbol);
    if (!moveSuccess) return { success: false, message: "Invalid move." };

    const win = board.hasWinner(x, y, player.symbol);
    const draw = !win && board.isFull();

    const result = { success: true, win, draw, player };
    if (!win && !draw) currentPlayerIndex = (currentPlayerIndex + 1) % 2;
    return result;
  };

  return { start, playTurn, getCurrentPlayer };
})(GameBoard);



const header = document.querySelector("header")

header.addEventListener(("animationend"), (e) => {
  header.style.position = "relative"
})
