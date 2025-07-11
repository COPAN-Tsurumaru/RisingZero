
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playerColor = "#ffffff"; // 自機の色
const bulletColor = "#00ffcc"; // 弾の色
const enemyColor = "#ff4444"; // 敵の色
const backgroundColor = "#111111"; // 背景

let score = 0;
let isGameOver = false;

const player = {
  x: canvas.width / 2 - 15,
  y: canvas.height - 60,
  width: 30,
  height: 30,
  speed: 5,
  bullets: []
};

const enemies = [];
const keys = {};

function spawnEnemy() {
  const x = Math.random() * (canvas.width - 30);
  enemies.push({ x, y: -30, width: 30, height: 30, speed: 2 });
}

function update() {
  if (isGameOver) return;

  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;

  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

  player.bullets.forEach((b, i) => {
    b.y -= b.speed;
    if (b.y < 0) player.bullets.splice(i, 1);
  });

  enemies.forEach((e, i) => {
    e.y += e.speed;
    if (e.y > canvas.height) isGameOver = true;

    player.bullets.forEach((b, bi) => {
      if (b.x < e.x + e.width && b.x + b.width > e.x &&
          b.y < e.y + e.height && b.y + b.height > e.y) {
        enemies.splice(i, 1);
        player.bullets.splice(bi, 1);
        score += 10;
      }
    });
  });
}

function draw() {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = playerColor;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw bullets
  ctx.fillStyle = bulletColor;
  player.bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

  // Draw enemies
  ctx.fillStyle = enemyColor;
  enemies.forEach(e => ctx.fillRect(e.x, e.y, e.width, e.height));

  // Draw score
  ctx.fillStyle = "#ffffff";
  ctx.font = "16px sans-serif";
  ctx.fillText("Score: " + score, 10, 20);

  if (isGameOver) {
    ctx.fillStyle = "#ff0000";
    ctx.font = "32px sans-serif";
    ctx.fillText("GAME OVER", canvas.width / 2 - 90, canvas.height / 2);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

setInterval(spawnEnemy, 1000);
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key === " " && !isGameOver) {
    player.bullets.push({
      x: player.x + player.width / 2 - 2,
      y: player.y,
      width: 4,
      height: 10,
      speed: 7
    });
  }
});
document.addEventListener("keyup", (e) => keys[e.key] = false);

loop();
