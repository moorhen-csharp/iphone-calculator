// Обновление времени в статус-баре
function updateTime() {
    const timeElement = document.getElementById('time');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}`;
}

// Имитация процента заряда батареи
function updateBattery() {
    const percentElement = document.getElementById('battery-percent');
    // Можно сделать рандом или статично, например, 87%
    percentElement.textContent = '87%';
}

updateTime();
setInterval(updateTime, 60000);
updateBattery();

class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('Деление на ноль невозможно!');
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    getPercent() {
        this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
    }

    toggleSign() {
        this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '0';
        } else {
            integerDisplay = integerDigits.toLocaleString('ru-RU', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

const numberButtons = document.querySelectorAll('.number');
const operationButtons = document.querySelectorAll('.operator');
const equalsButton = document.querySelector('.operator:last-child');
const deleteButton = document.querySelector('.special:nth-child(2)');
const clearButton = document.querySelector('.special:first-child');
const percentButton = document.querySelector('.special:nth-child(3)');
const previousOperandElement = document.querySelector('.previous-operand');
const currentOperandElement = document.querySelector('.current-operand');

const calculator = new Calculator(previousOperandElement, currentOperandElement);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.innerText !== '=') {
            calculator.chooseOperation(button.innerText);
            calculator.updateDisplay();
        }
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.toggleSign();
    calculator.updateDisplay();
});

percentButton.addEventListener('click', () => {
    calculator.getPercent();
    calculator.updateDisplay();
});

// --- Конфетти ---
const confettiColors = [
    '#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93', '#fff', '#f72585', '#b5179e', '#7209b7', '#3a86ff'
];
const confettiCount = 80;
const confetti = [];
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function randomBetween(a, b) {
    return a + Math.random() * (b - a);
}

for (let i = 0; i < confettiCount; i++) {
    confetti.push({
        x: randomBetween(0, window.innerWidth),
        y: randomBetween(-window.innerHeight, 0),
        r: randomBetween(5, 10),
        d: randomBetween(2, 6),
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        tilt: randomBetween(-10, 10),
        tiltAngle: randomBetween(0, Math.PI * 2),
        tiltAngleIncrement: randomBetween(0.01, 0.05)
    });
}

// --- Фейерверки ---
class FireworkParticle {
    constructor(x, y, color, angle, speed) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.angle = angle;
        this.speed = speed;
        this.alpha = 1;
        this.radius = randomBetween(2, 4);
        this.life = 0;
    }
    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.speed *= 0.98;
        this.alpha -= 0.015;
        this.life++;
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(this.alpha, 0);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

class Firework {
    constructor() {
        this.x = randomBetween(100, window.innerWidth - 100);
        this.y = randomBetween(100, window.innerHeight / 2);
        this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        this.particles = [];
        const count = randomBetween(18, 32);
        for (let i = 0; i < count; i++) {
            const angle = (2 * Math.PI * i) / count;
            const speed = randomBetween(2, 6);
            this.particles.push(new FireworkParticle(this.x, this.y, this.color, angle, speed));
        }
        this.alive = true;
    }
    update() {
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => p.alpha > 0 && p.life < 80);
        if (this.particles.length === 0) this.alive = false;
    }
    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }
}

let fireworks = [];
let fireworkTimer = 0;

function drawFireworks() {
    if (fireworkTimer <= 0) {
        fireworks.push(new Firework());
        fireworkTimer = randomBetween(60, 120); // интервал между фейерверками
    } else {
        fireworkTimer--;
    }
    fireworks.forEach(fw => fw.update());
    fireworks.forEach(fw => fw.draw(ctx));
    fireworks = fireworks.filter(fw => fw.alive);
}

function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Конфетти
    for (let i = 0; i < confetti.length; i++) {
        let c = confetti[i];
        ctx.beginPath();
        ctx.ellipse(
            c.x + c.tilt,
            c.y,
            c.r,
            c.r / 2,
            c.tiltAngle,
            0,
            2 * Math.PI
        );
        ctx.fillStyle = c.color;
        ctx.fill();
    }
    updateConfetti();
    // Фейерверки
    drawFireworks();
    requestAnimationFrame(drawConfetti);
}

function updateConfetti() {
    for (let i = 0; i < confetti.length; i++) {
        let c = confetti[i];
        c.y += c.d;
        c.tiltAngle += c.tiltAngleIncrement;
        c.tilt = Math.sin(c.tiltAngle) * 10;
        if (c.y > window.innerHeight) {
            c.x = randomBetween(0, window.innerWidth);
            c.y = randomBetween(-20, 0);
            c.r = randomBetween(5, 10);
            c.d = randomBetween(2, 6);
            c.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            c.tilt = randomBetween(-10, 10);
            c.tiltAngle = randomBetween(0, Math.PI * 2);
            c.tiltAngleIncrement = randomBetween(0.01, 0.05);
        }
    }
}

drawConfetti();

// --- Конец конфетти --- 