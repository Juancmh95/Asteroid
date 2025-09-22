// -----------------------------
// VARIABLES GLOBALES DEL JUEGO
// -----------------------------
let Scene = 1;           // Escena actual (1 = menú, 2 = juego)
let bullets = [];        // Array de balas
let asteroids = [];      // Array de asteroides

// Aparición de asteroides
const baseSpawnRate = 120;   // Cada cuántos frames aparece un asteroide al inicio
const minSpawnRate  = 30;    // Límite inferior para no ser imposible
let lastSpawn = 0;           // Frame en el que apareció el último asteroide

// Marcadores
let score = 0;               // Puntos actuales
let highScore = 0;           // Mejor puntaje histórico

// -----------------------------
// SETUP (se ejecuta una vez)
// -----------------------------
function setup() {
  const c = createCanvas(400, 400); // Crear canvas 400x400
  c.parent('game');                 // Montar el canvas dentro del <div id="game">
  c.addClass('game-canvas');        // Clase CSS para estilos
  textFont('monospace');            // Fuente monospace
}

// -----------------------------
// ESCENA 1: MENÚ PRINCIPAL
// -----------------------------
function drawScene1() {
  background(13, 12, 12);
  fill(200, 0, 255);
  textSize(50);
  text('ASTEROID', 80, 100);

  // Botón ficticio
  fill(13, 0, 255);
  rect(105, 220, 150, 50, 10);

  fill(247, 211, 8);
  textSize(30);
  text('Play', 140, 255);

  // Texto de ayuda
  textSize(18);
  fill(255);
  text('Press any key to start', 100, 300);

  // Mostrar mejor puntaje
  textSize(16);
  fill(200);
  text(`Best: ${highScore}`, 160, 330);
}

// -----------------------------
// ESCENA 2: JUEGO
// -----------------------------
function drawScene2() {
  background(5, 5, 5);

  // HUD (marcador en pantalla)
  fill(255);
  textSize(14);
  text(`Score: ${score}   Best: ${highScore}`, 10, 20);

  // Sumar +1 punto cada segundo sobrevivido (~60 fps)
  if (frameCount % 60 === 0) score += 1;

  // Dibujar asteroides
  for (let i = asteroids.length - 1; i >= 0; i--) {
    const a = asteroids[i];
    fill(a.col);
    ellipse(a.x, a.y, 30, 30); // asteroide
    a.y += a.speed;

    // Eliminar si sale de pantalla
    if (a.y > height + 20) asteroids.splice(i, 1);
  }

  // Dibujar nave
  fill(22, 14, 242);
  rect(mouseX, 360, 50, 20);       // cuerpo
  rect(mouseX + 20, 340, 10, 20);  // cabina

  // Dibujar balas
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    fill(255, 255, 0);
    rect(b.x, b.y, 5, 10);
    b.y -= 7; // mover bala hacia arriba

    // Eliminar bala si sale de pantalla
    if (b.y < -10) {
      bullets.splice(i, 1);
      continue;
    }

    // Colisión bala-asteroide
    for (let j = asteroids.length - 1; j >= 0; j--) {
      const a = asteroids[j];
      const d = dist(b.x, b.y, a.x, a.y);
      if (d < 20) {
        score += 10; // +10 puntos por destruir
        bullets.splice(i, 1);
        asteroids.splice(j, 1);
        break;
      }
    }
  }

  // Colisión nave-asteroide
  for (let i = 0; i < asteroids.length; i++) {
    const a = asteroids[i];
    const d = dist(mouseX + 25, 350, a.x, a.y);
    if (d < 30) {
      // GAME OVER
      highScore = max(highScore, score); // guardar mejor puntaje
      Scene = 1;                          // volver al menú
      bullets = [];
      asteroids = [];
      score = 0;
      return;
    }
  }

  // -----------------------------
  // DIFICULTAD DINÁMICA
  // -----------------------------
  const speedUp = 2 + frameCount / 1000; // Asteroides cada vez más rápidos
  const dynamicSpawnRate = max(
    minSpawnRate,
    baseSpawnRate - floor(frameCount / 360) // Cada ~6s spawnea más rápido
  );

  // Crear nuevos asteroides
  if (frameCount - lastSpawn > dynamicSpawnRate) {
    lastSpawn = frameCount;
    asteroids.push({
      x: random(20, width - 20),
      y: -20,
      speed: speedUp,
      col: color(random(100, 255), random(100, 255), random(100, 255))
    });
  }
}

// -----------------------------
// DRAW PRINCIPAL (se ejecuta cada frame)
// -----------------------------
function draw() {
  if (Scene === 1) drawScene1();
  else if (Scene === 2) drawScene2();
}

// -----------------------------
// EVENTOS DE TECLAS Y MOUSE
// -----------------------------
function keyPressed() {
  if (Scene === 1) {
    // Iniciar juego desde el menú
    Scene = 2;
    bullets = [];
    asteroids = [];
    lastSpawn = frameCount;
    score = 0;
  }
}

function mousePressed() {
  if (Scene === 2) {
    // Disparar desde la nave
    bullets.push({ x: mouseX + 23, y: 340 });
  }
}
