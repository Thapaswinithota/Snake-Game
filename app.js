const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const box = 20;
const canvasSize = 400;
const canvasBoxes = canvasSize / box;

// Snake setup
let snake = [{ x: 9 * box, y: 9 * box }];
let direction = 'RIGHT';

// Food setup
let food = {
  x: Math.floor(Math.random() * canvasBoxes) * box,
  y: Math.floor(Math.random() * canvasBoxes) * box,
};

// Score
let score = 0;

// Snake speed
let speed = 200;
let game;

// Player data
let playerName = "";
let sessionLeaderboard = [];

// Draw the game
function drawGame() {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, box, box);

  // Draw snake
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? 'lime' : 'green';
    ctx.fillRect(segment.x, segment.y, box, box);
  });

  // Move the snake
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === 'RIGHT') headX += box;
  if (direction === 'LEFT') headX -= box;
  if (direction === 'UP') headY -= box;
  if (direction === 'DOWN') headY += box;

  // Check for collision with food
  if (headX === food.x && headY === food.y) {
    score++;
    document.getElementById('score').innerText = score;
    food = {
      x: Math.floor(Math.random() * canvasBoxes) * box,
      y: Math.floor(Math.random() * canvasBoxes) * box,
    };
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };
  snake.unshift(newHead);

  // Check for collision with walls or self
  if (
    headX < 0 ||
    headY < 0 ||
    headX >= canvasSize ||
    headY >= canvasSize ||
    (snake.length > 1 && snake.slice(1).some(segment => segment.x === headX && segment.y === headY))
  ) {
    clearInterval(game);
    showGameOver();
  }
}

// Display Game Over screen
function showGameOver() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  ctx.fillStyle = 'white';
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over!', canvasSize / 2, canvasSize / 2 - 20);
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, canvasSize / 2, canvasSize / 2 + 20);

  updateSessionLeaderboard();
}

// Update leaderboard for the session
function updateSessionLeaderboard() {
  sessionLeaderboard.push({ name: playerName, score });
  sessionLeaderboard.sort((a, b) => b.score - a.score);

  const leaderboardBody = document.getElementById('leaderboard-body');
  leaderboardBody.innerHTML = sessionLeaderboard
    .map(entry => `<tr><td>${entry.name}</td><td>${entry.score}</td></tr>`)
    .join('');
}

// Restart the game
function resetGame() {
  clearInterval(game);
  snake = [{ x: 9 * box, y: 9 * box }];
  direction = 'RIGHT';
  food = {
    x: Math.floor(Math.random() * canvasBoxes) * box,
    y: Math.floor(Math.random() * canvasBoxes) * box,
  };
  score = 0;
  document.getElementById('score').innerText = score;

  // Ask for the next player's name
  document.getElementById('startModal').style.display = 'flex';
  document.getElementById('game-container').style.display = 'none';
}

// Start the game after getting player name
document.getElementById('startGameButton').addEventListener('click', () => {
  playerName = document.getElementById('playerNameInput').value.trim() || "Player";
  document.getElementById('startModal').style.display = 'none';
  document.getElementById('game-container').style.display = 'flex';
  game = setInterval(drawGame, speed);
});

// Control snake direction
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

// Restart the game on button click
document.getElementById('restartButton').addEventListener('click', resetGame);
