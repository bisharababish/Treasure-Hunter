const mazeElement = document.getElementById('maze');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const gameOverElement = document.getElementById('game-over');
const finalTreasuresElement = document.getElementById('final-treasures');
const finalLevelElement = document.getElementById('final-level');
const restartButton = document.getElementById('restart');

let mazeSize = 10; // Fixed maze size for all levels
let playerPosition = { x: 0, y: 0 };
let treasuresCollected = 0;
let timeLeft = 60;
let currentLevel = 1;
let traps = [];
let treasures = [];
let interval;

// Generate the maze
function generateMaze() {
  mazeElement.innerHTML = '';
  mazeElement.style.gridTemplateColumns = `repeat(${mazeSize}, 40px)`; // Fixed cell size
  mazeElement.style.gridTemplateRows = `repeat(${mazeSize}, 40px)`; // Fixed cell size

  for (let y = 0; y < mazeSize; y++) {
    for (let x = 0; x < mazeSize; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if (x === playerPosition.x && y === playerPosition.y) {
        cell.classList.add('player');
      }
      mazeElement.appendChild(cell);
    }
  }

  // Add traps and treasures
  traps = [];
  treasures = [];
  const trapCount = Math.floor(mazeSize * 1.5); // More traps as levels increase
  const treasureCount = Math.max(1, Math.floor(mazeSize / 2)); // Fewer treasures as levels increase

  for (let i = 0; i < trapCount; i++) {
    const trapX = Math.floor(Math.random() * mazeSize);
    const trapY = Math.floor(Math.random() * mazeSize);
    if (trapX !== playerPosition.x || trapY !== playerPosition.y) {
      traps.push({ x: trapX, y: trapY });
      mazeElement.children[trapY * mazeSize + trapX].classList.add('trap');
    }
  }

  for (let i = 0; i < treasureCount; i++) {
    const treasureX = Math.floor(Math.random() * mazeSize);
    const treasureY = Math.floor(Math.random() * mazeSize);
    if (treasureX !== playerPosition.x || treasureY !== playerPosition.y) {
      treasures.push({ x: treasureX, y: treasureY });
      mazeElement.children[treasureY * mazeSize + treasureX].classList.add('treasure');
    }
  }
}

// Move the player
function movePlayer(event) {
  const key = event.key;
  let newX = playerPosition.x;
  let newY = playerPosition.y;

  if (key === 'ArrowUp' && playerPosition.y > 0) newY--;
  if (key === 'ArrowDown' && playerPosition.y < mazeSize - 1) newY++;
  if (key === 'ArrowLeft' && playerPosition.x > 0) newX--;
  if (key === 'ArrowRight' && playerPosition.x < mazeSize - 1) newX++;

  const newCell = mazeElement.children[newY * mazeSize + newX];
  if (newCell.classList.contains('trap')) {
    endGame();
    return;
  }

  if (newCell.classList.contains('treasure')) {
    treasuresCollected++;
    scoreElement.textContent = `Treasures: ${treasuresCollected}`;
    newCell.classList.remove('treasure');
    if (treasuresCollected === treasures.length) {
      nextLevel();
    }
  }

  mazeElement.children[playerPosition.y * mazeSize + playerPosition.x].classList.remove('player');
  playerPosition.x = newX;
  playerPosition.y = newY;
  newCell.classList.add('player');
}

// End the game
function endGame() {
  clearInterval(interval);
  gameOverElement.style.display = 'block';
  finalTreasuresElement.textContent = treasuresCollected;
  finalLevelElement.textContent = currentLevel;
}

// Advance to the next level
function nextLevel() {
  currentLevel++;
  playerPosition = { x: 0, y: 0 };
  treasuresCollected = 0;
  timeLeft = 60;
  levelElement.textContent = `Level: ${currentLevel}`;
  generateMaze();
}

// Start the game
function startGame() {
  mazeSize = 10; // Fixed maze size
  currentLevel = 1;
  playerPosition = { x: 0, y: 0 };
  treasuresCollected = 0;
  timeLeft = 60;
  levelElement.textContent = `Level: ${currentLevel}`;
  generateMaze();
  gameOverElement.style.display = 'none';
  interval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Time: ${timeLeft}`;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

// Restart the game
restartButton.addEventListener('click', startGame);

// Initialize the game
document.addEventListener('keydown', movePlayer);
startGame();