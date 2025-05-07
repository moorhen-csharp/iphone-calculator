const canvas = document.getElementById('dino-canvas');
const ctx = canvas.getContext('2d');
const bestScoreDiv = document.getElementById('best-score');

let dino = { x: 50, y: 150, w: 40, h: 40, vy: 0, jump: false };
let gravity = 0.25;
let obstacles = [];
let frame = 0;
let score = 0;
let bestScore = +localStorage.getItem('dino-best') || 0;
let gameOver = false;
let speed = 2;
let trees = [];
let dinoLegFrame = 0;

function initTrees() {
    trees = [];
    for (let i = 0; i < 6; i++) {
        let x = 100 + i * 120 + Math.random() * 60;
        let h = 40 + Math.random() * 60;
        let w = 10 + Math.random() * 10;
        trees.push({ x, h, w });
    }
}
initTrees();

function drawTrees() {
    trees.forEach(tree => {
        ctx.fillStyle = '#8d674a';
        ctx.fillRect(tree.x, 190 - tree.h, tree.w, tree.h);
        ctx.beginPath();
        ctx.arc(tree.x + tree.w / 2, 190 - tree.h, tree.w * 1.2, Math.PI, 2 * Math.PI);
        ctx.fillStyle = '#4caf50';
        ctx.fill();
    });
}

function drawDino() {
    ctx.fillStyle = "#00e676";
    ctx.fillRect(dino.x, dino.y, dino.w, dino.h);
    ctx.beginPath();
    ctx.moveTo(dino.x, dino.y + dino.h - 8);
    ctx.lineTo(dino.x - 12, dino.y + dino.h - 16);
    ctx.lineTo(dino.x, dino.y + dino.h - 20);
    ctx.closePath();
    ctx.fillStyle = "#00e676";
    ctx.fill();
    if (dinoLegFrame % 2 === 0) {
        ctx.fillRect(dino.x + 8, dino.y + dino.h, 10, 8);
        ctx.fillRect(dino.x + 22, dino.y + dino.h + 4, 10, 8);
    } else {
        ctx.fillRect(dino.x + 22, dino.y + dino.h, 10, 8);
        ctx.fillRect(dino.x + 8, dino.y + dino.h + 4, 10, 8);
    }
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(dino.x + 30, dino.y + 14, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.arc(dino.x + 32, dino.y + 14, 1.5, 0, 2 * Math.PI);
    ctx.fill();
}

function drawObstacles() {
    ctx.fillStyle = "#388e3c";
    obstacles.forEach(o => {
        ctx.fillRect(o.x, o.y, o.w, o.h);
        ctx.fillStyle = "#2e7d32";
        for (let i = 0; i < o.w; i += 6) {
            ctx.beginPath();
            ctx.moveTo(o.x + i, o.y);
            ctx.lineTo(o.x + i + 3, o.y - 7);
            ctx.lineTo(o.x + i + 6, o.y);
            ctx.closePath();
            ctx.fill();
        }
        ctx.fillStyle = "#388e3c";
    });
}

function drawGround() {
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 190);
    ctx.lineTo(canvas.width, 190);
    ctx.stroke();
}

function drawScore() {
    ctx.fillStyle = "#fff";
    ctx.font = "20px monospace";
    ctx.fillText("Счёт: " + score, 450, 30);
}

function updateBestScore() {
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('dino-best', bestScore);
    }
    bestScoreDiv.textContent = "Лучший счёт: " + bestScore;
}

function update() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTrees();
    trees.forEach(tree => { tree.x -= speed * 0.3; });
    if (trees.length && trees[0].x + trees[0].w < 0) {
        let last = trees[trees.length - 1];
        let x = last.x + 100 + Math.random() * 60;
        let h = 40 + Math.random() * 60;
        let w = 10 + Math.random() * 10;
        trees.push({ x, h, w });
        trees.shift();
    }
    drawGround();
    dino.y += dino.vy;
    dino.vy += gravity;
    if (dino.y > 150) {
        dino.y = 150;
        dino.vy = 0;
        dino.jump = false;
    }
    if (frame % 120 === 0) {
        let h = 30 + Math.random() * 30;
        obstacles.push({ x: 600, y: 190 - h, w: 18, h: h });
    }
    obstacles.forEach(o => o.x -= speed);
    obstacles = obstacles.filter(o => o.x + o.w > 0);
    obstacles.forEach(o => {
        if (
            dino.x < o.x + o.w &&
            dino.x + dino.w > o.x &&
            dino.y + dino.h > o.y
        ) {
            gameOver = true;
        }
    });
    score++;
    drawDino();
    drawObstacles();
    drawScore();
    updateBestScore();
    dinoLegFrame = Math.floor(frame / 6) % 2;
    if (gameOver) {
        ctx.fillStyle = "#b71c1c";
        ctx.font = "32px monospace";
        ctx.fillText("Игра окончена!", 200, 100);
        ctx.font = "20px monospace";
        ctx.fillText("Нажмите пробел для рестарта", 160, 130);
    } else {
        frame++;
        requestAnimationFrame(update);
    }
}

document.addEventListener('keydown', e => {
    if ((e.code === 'Space' || e.key === ' ') && !dino.jump && !gameOver) {
        dino.vy = -9;
        dino.jump = true;
    }
    if ((e.code === 'Space' || e.key === ' ') && gameOver) {
        dino.y = 150;
        dino.vy = 0;
        dino.jump = false;
        obstacles = [];
        frame = 0;
        score = 0;
        gameOver = false;
        update();
    }
});
canvas.addEventListener('mousedown', () => {
    if (!dino.jump && !gameOver) {
        dino.vy = -9;
        dino.jump = true;
    }
    if (gameOver) {
        dino.y = 150;
        dino.vy = 0;
        dino.jump = false;
        obstacles = [];
        frame = 0;
        score = 0;
        gameOver = false;
        update();
    }
});

update();
updateBestScore(); 