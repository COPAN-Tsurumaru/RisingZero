const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 32;
const tileCount = 10;

let pacman = { x: 1, y: 1 };
let ghost = { x: 8, y: 8 };
let dots = [];
let score = 0;

const scoreDisplay = document.getElementById("score");

function initDots() {
  dots = [];
  for (let y = 0; y < tileCount; y++) {
    for (let x = 0; x < tileCount; x++) {
      if (!(x === pacman.x && y === pacman.y) && !(x === ghost.x && y === ghost.y)) {
        dots.push({ x, y });
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw dots
  ctx.fillStyle = "#fff";
  dots.forEach(dot => {
    ctx.beginPath();
    ctx.arc(dot.x * gridSize + gridSize / 2, dot.y * gridSize + gridSize / 2, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw Pacman
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(pacman.x * gridSize + gridSize / 2, pacman.y * gridSize + gridSize / 2, 12, 0.25 * Math.PI, 1.75 * Math.PI);
  ctx.lineTo(pacman.x * gridSize + gridSize / 2, pacman.y * gridSize + gridSize / 2);
  ctx.fill();

  // Draw ghost
  ctx.fillStyle = "pink";
  ctx.beginPath();
  ctx.arc(ghost.x * gridSize + gridSize / 2, ghost.y * gridSize + gridSize / 2, 12, 0, Math.PI * 2);
  ctx.fill();

  scoreDisplay.textContent = "スコア: " + score;
}

function moveGhost() {
  const dx = pacman.x - ghost.x;
  const dy = pacman.y - ghost.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    ghost.x += dx > 0 ? 1 : -1;
  } else {
    ghost.y += dy > 0 ? 1 : -1;
  }
}

function gameLoop() {
  moveGhost();
  draw();

  // Check collision with ghost
  if (pacman.x === ghost.x && pacman.y === ghost.y) {
    alert("ゲームオーバー！スコア: " + score);
    pacman = { x: 1, y: 1 };
    ghost = { x: 8, y: 8 };
    score = 0;
    initDots();
  }

  // Eat dot
  dots = dots.filter(dot => {
    if (dot.x === pacman.x && dot.y === pacman.y) {
      score += 10;
      return false;
    }
    return true;
  });

  setTimeout(gameLoop, 700);
}

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && pacman.y > 0) pacman.y--;
  else if (e.key === "ArrowDown" && pacman.y < tileCount - 1) pacman.y++;
  else if (e.key === "ArrowLeft" && pacman.x > 0) pacman.x--;
  else if (e.key === "ArrowRight" && pacman.x < tileCount - 1) pacman.x++;
});

initDots();
draw();
gameLoop();
