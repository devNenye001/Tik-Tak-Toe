const squares = document.querySelectorAll(".square");
const option = document.querySelector(".option");
const result = document.querySelector(".result");
const scores = document.querySelector(".scores");
const yourScoreText = document.querySelector(".YourScore");
const cpuScoreText = document.querySelector(".myScore");

let player = "";
let cpu = "";
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let yourScore = 0;
let cpuScore = 0;

const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function theX() {
  player = "X";
  cpu = "O";
  startGame();
}

function theO() {
  player = "O";
  cpu = "X";
  startGame();
}

function startGame() {
  option.style.display = "none";
  document.querySelector(".tik-tak-toe").style.display = "grid";
  scores.style.display = "flex";
  result.style.display = "block";
  result.textContent = "";
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;

  squares.forEach((square, index) => {
    square.textContent = "";
    square.classList.remove("xMark", "oMark");
    square.onclick = () => handleMove(index);
  });
}

function handleMove(index) {
  if (!gameActive || board[index] !== "") return;

  board[index] = player;
  squares[index].textContent = player;
  squares[index].classList.add(player === "X" ? "xMark" : "oMark");
  squares[index].onclick = null;

  if (checkWinner(player)) {
    yourScore++;
    updateScores();
    endGame("YOU WIN!");
    return;
  }

  if (isDraw()) {
    endGame("DRAW");
    return;
  }

  setTimeout(cpuPlay, 1000);
}

// cpu moves
function cpuPlay() {
  if (!gameActive) return;

  const emptyIndices = board
    .map((val, i) => (val === "" ? i : null))
    .filter((i) => i !== null);

  //Try to win
  for (let i of emptyIndices) {
    board[i] = cpu;
    if (checkWinner(cpu)) {
      finalizeMove(i);
      updateScores();
      endGame("CPU WINS!");
      return;
    }
    board[i] = ""; // undo
  }

  //Block player win
  for (let i of emptyIndices) {
    board[i] = player;
    if (checkWinner(player)) {
      board[i] = cpu;
      finalizeMove(i);
      return;
    }
    board[i] = ""; // undo
  }

  //Play random
  const randomIndex =
    emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  board[randomIndex] = cpu;
  finalizeMove(randomIndex);
}

function finalizeMove(index) {
  squares[index].textContent = cpu;
  squares[index].classList.add(cpu === "X" ? "xMark" : "oMark");
  squares[index].onclick = null;

  if (checkWinner(cpu)) {
    cpuScore++;
    updateScores();
    endGame("CPU WINS!");
  } else if (isDraw()) {
    endGame("DRAW");
  }
}

function checkWinner(mark) {
  return winCombos.some((combo) =>
    combo.every((index) => board[index] === mark)
  );
}

function isDraw() {
  return board.every((cell) => cell !== "");
}

function endGame(message) {
  gameActive = false;
  result.textContent = message;

  //To Prevent further clicking
  squares.forEach((square) => (square.onclick = null));

  setTimeout(() => {
    startGame();
  }, 1500);
}

function updateScores() {
  yourScoreText.textContent = `YOU: ${yourScore}`;
  cpuScoreText.textContent = `CPU: ${cpuScore}`;
}

// To take back to initial state
option.style.display = "flex";
document.querySelector(".tik-tak-toe").style.display = "none";
scores.style.display = "none";
result.style.display = "none";
