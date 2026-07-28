const express = require('express');
const redis = require('redis');

const app = express();
const client = redis.createClient({
  host: 'redis-server',
  port: 6379
});

app.get('/', (req, res) => {
  client.get('visitas', (err, visitas) => {
    if (visitas === null) {
      visitas = 0;
    }

    const numVisitas = parseInt(visitas);

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Docker Dino Runner - DevOps Edition</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, 
user-scalable=no">
        <style>
          body {
            background-color: #0f172a;
            color: #f8fafc;
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            user-select: none;
          }
          .container {
            text-align: center;
            background: #1e293b;
            padding: 24px;
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
            max-width: 600px;
            width: 90%;
          }
          canvas {
            background: #020617;
            border-radius: 12px;
            border: 2px solid #334155;
            max-width: 100%;
          }
          .stats {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-weight: bold;
            font-size: 16px;
          }
          .instructions {
            margin-top: 12px;
            font-size: 14px;
            color: #94a3b8;
          }
          .badge {
            background: #2563eb;
            padding: 4px 12px;
            border-radius: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>🐳 Docker Runner Game</h2>
          <div class="stats">
            <span>Visitas Redis: <span class="badge">${numVisitas}</span></span>
            <span>Puntos: <span id="score">0</span></span>
          </div>
          
          <canvas id="gameCanvas" width="500" height="200"></canvas>
          
          <p class="instructions">Presiona <b>Espacio</b> o <b>Toca la pantalla</b> para saltar 
los errores ❌</p>
        </div>

        <script>
          const canvas = document.getElementById('gameCanvas');
          const ctx = canvas.getContext('2d');
          const scoreEl = document.getElementById('score');

          let score = 0;
          let gameOver = false;

          const player = {
            x: 50,
            y: 140,
            width: 30,
            height: 30,
            dy: 0,
            gravity: 0.6,
            jumpPower: -10,
            isGrounded: false
          };

          const obstacle = {
            x: 500,
            y: 150,
            width: 20,
            height: 20,
            speed: 5
          };

          function jump() {
            if (player.isGrounded) {
              player.dy = player.jumpPower;
              player.isGrounded = false;
            }
            if (gameOver) {
              resetGame();
            }
          }

          document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
              e.preventDefault();
              jump();
            }
          });

          canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            jump();
          });

          function resetGame() {
            score = 0;
            obstacle.x = 500;
            obstacle.speed = 5;
            gameOver = false;
            player.y = 140;
            player.dy = 0;
            animate();
          }

          function animate() {
            if (gameOver) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = '#334155';
            ctx.beginPath();
            ctx.moveTo(0, 170);
            ctx.lineTo(500, 170);
            ctx.stroke();

            player.dy += player.gravity;
            player.y += player.dy;

            if (player.y >= 140) {
              player.y = 140;
              player.dy = 0;
              player.isGrounded = true;
            }

            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(player.x, player.y, player.width, player.height);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(player.x + 20, player.y + 6, 4, 4);

            obstacle.x -= obstacle.speed;
            if (obstacle.x + obstacle.width < 0) {
              obstacle.x = 500 + Math.random() * 100;
              score += 10;
              scoreEl.innerText = score;
              obstacle.speed += 0.2;
            }

            ctx.fillStyle = '#ef4444';
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

            if (
              player.x < obstacle.x + obstacle.width &&
              player.x + player.width > obstacle.x &&
              player.y < obstacle.y + obstacle.height &&
              player.y + player.height > obstacle.y
            ) {
              gameOver = true;
              ctx.fillStyle = '#f8fafc';
              ctx.font = '20px sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText('💥 GAME OVER - ¡Tocá Espacio para Reintentar!', canvas.width / 2, 
100);
            }

            requestAnimationFrame(animate);
          }

          animate();
        </script>
      </body>
      </html>
    `);

    client.set('visitas', numVisitas + 1);
  });
});

app.listen(8080, () => {
  console.log('Servidor corriendo en el puerto 8080');
}); 
