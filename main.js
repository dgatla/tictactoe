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

const createPlayer = (name, symbol) => ({ name, symbol, "score": 0 });

const GameController = (board => {
  let players = [];
  let currentPlayerIndex = 0;

  const start = (player1, player2, isReset = false) => {
    board.reset();
    if (!isReset) {
      player1.score = 0;
      player2.score = 0;
    }
    players = [player1, player2];
    currentPlayerIndex = 0;
  };

  const getCurrentPlayer = () => players[currentPlayerIndex];

  const playTurn = (x, y) => {
    const player = getCurrentPlayer();
    const moveSuccess = board.set(x, y, player.symbol);
    if (!moveSuccess) return { success: false, message: "Invalid move." };

    const win = board.hasWinner(x, y, player.symbol);
    if (win) player.score += 1
    const draw = !win && board.isFull();

    const result = { success: true, win, draw, player };
    if (!win && !draw) currentPlayerIndex = (currentPlayerIndex + 1) % 2;
    return result;
  };

  return { start, playTurn, getCurrentPlayer };
})(GameBoard);


const GameControllerUI = () => {

  const modes = document.querySelectorAll(".mode");
  const gameMode = document.querySelector(".game-mode")
  const game = document.querySelector(".game")
  const buttons = document.querySelector(".buttons")
  const player1 = createPlayer("playerx", "X")
  const player2 = createPlayer("playery", "O")
  const cells = document.querySelectorAll(".cell")
  const scores = document.querySelectorAll(".score")

  buttons.addEventListener('click', (e) => {
    let button = e.target.closest(".button-control")
    if (!button) {
      return
    }
    let attribute = button.dataset["attribute"];
    handleButtonClick(attribute);
  })

  modes.forEach((mode) => {
    mode.addEventListener("click", (e) => {
      let selection = e.target.dataset["mode"];
      gameMode.classList.toggle("d-none");
      game.classList.toggle("d-none");
    })
  })
  
  const start = () => {
    GameController.start(player1, player2)
  }

  const handlePlayerInput = (e) => {
    if (e.target.textContent != "") {
      return;
    }
    let x = parseInt(e.target.dataset["row"]), y = parseInt(e.target.dataset["col"])
    const symbol = GameController.getCurrentPlayer().symbol;
    let res = GameController.playTurn(x, y)
    e.target.textContent = symbol;
    
    if (res.win) {
      GameBoard.print()
      const playerScoreClass = "." + res.player.name + "-score";
      const score = document.querySelector(playerScoreClass)
      score.textContent = res.player.score
      updateScoreAndAnnounceResult(res);
    } else if (res.draw) {
      resetGame()
    }
  }

  cells.forEach((cell) => {
    cell.addEventListener("click", handlePlayerInput)
  })

  const handleButtonClick = (attribute) => {
    switch (attribute) {
      case "quit":
        gameMode.classList.toggle("d-none")
        game.classList.toggle("d-none")
        resetGame()
        clearScore()
        break
      case "reset":
        resetGame()
        break
      case "restart":
        GameController.start(player1, player2)
        clearScore()
        clearCells()
        break
      default:
        console.log("Default case")
    }
  }

  const resetGame = () => {
    GameController.start(player1, player2, true)
    clearCells();
  }

  const clearCells = () => {
    cells.forEach((cell) => {
      cell.textContent = "";
    })
  }

  const clearScore = () => {
    scores.forEach((score) => {
      score.textContent = "0";
    })
  }

  const updateScoreAndAnnounceResult = (res) => {
    const playerScoreResult = "." + res.player.name + "-result"
    const result = document.querySelector(playerScoreResult)
    result.textContent = "(Win)"
    setTimeout(() => {
      result.textContent = ""
      resetGame()
    }, 1000);
  }


  return { start }

}

GameControllerUI().start();

