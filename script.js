// Matrix Rain Effect
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.getElementById('matrix-rain').appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
const matrixChars = matrix.split('');

const fontSize = 10;
const columns = canvas.width / fontSize;

const drops = [];
for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

function drawMatrixRain() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        drops[i]++;
    }
}

setInterval(drawMatrixRain, 33);

// Loading animation
const loadingScreen = document.getElementById('loading-screen');
const progressBar = document.querySelector('.progress');
let progress = 0;

const loadingInterval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress > 100) progress = 100;
    progressBar.style.width = `${progress}%`;

    if (progress === 100) {
        clearInterval(loadingInterval);
        gsap.to(loadingScreen, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                loadingScreen.style.display = 'none';
                animateHomeSection();
            }
        });
    }
}, 200);

// Animate home section
function animateHomeSection() {
    gsap.from('#home h1', { opacity: 0, y: 50, duration: 1, delay: 0.5 });
    gsap.from('#home p', { opacity: 0, y: 50, duration: 1, delay: 0.7 });
    gsap.from('#home .cta-button', { opacity: 0, y: 50, duration: 1, delay: 0.9 });
    gsap.from('#home .scroll-indicator', { opacity: 0, y: 50, duration: 1, delay: 1.1 });
}

// Custom cursor
const cursor = document.getElementById('cursor');
const cursorBlur = document.getElementById('cursor-blur');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { duration: 0.1, x: e.clientX, y: e.clientY });
    gsap.to(cursorBlur, { duration: 0.3, x: e.clientX - 200, y: e.clientY - 200 });
});

// Scroll animations
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray('section').forEach((section, index) => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });

    tl.from(section.querySelector('.section-title'), { opacity: 0, y: 50, duration: 0.5 })
      .from(section.querySelectorAll('p, .tech-item, .project-card, .timeline-item, .form-group'), { opacity: 0, y: 50, stagger: 0.1, duration: 0.5 }, '-=0.3');
});

// Skills grid animation
const skillsData = [
    'HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'Python',
    'Git', 'RESTful APIs', 'GraphQL', 'MongoDB', 'SQL', 'Docker'
];

const skillsGrid = document.getElementById('skills-grid');

skillsData.forEach(skill => {
    const skillItem = document.createElement('div');
    skillItem.classList.add('skill-item');
    skillItem.textContent = skill;
    skillsGrid.appendChild(skillItem);
});

// Glitch effect for profile image
const glitchImage = document.querySelector('.glitch-image');

function glitchEffect() {
    const glitchDuration = Math.random() * 500 + 100;
    const glitchInterval = Math.random() * 4000 + 2000;

    glitchImage.style.animation = `glitch-anim-1 ${glitchDuration}ms infinite`;

    setTimeout(() => {
        glitchImage.style.animation = '';
    }, glitchDuration);

    setTimeout(glitchEffect, glitchInterval);
}

glitchEffect();

// Form submission
const form = document.querySelector('.contact-form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.submit-btn');

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Transmitting...</span>';

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            submitBtn.innerHTML = '<span>Transmitted Successfully</span>';
            form.reset();
        } else {
            throw new Error('Transmission failed');
        }
    } catch (error) {
        console.error('Error:', error);
        submitBtn.innerHTML = '<span>Transmission Error</span>';
    } finally {
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Transmit</span>';
        }, 3000);
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Matrix Runner Game
const gameCanvas = document.getElementById('gameCanvas');
const gameCtx = gameCanvas.getContext('2d');
const startGameBtn = document.getElementById('startGame');
const scoreElement = document.getElementById('score');

gameCanvas.width = 800;
gameCanvas.height = 400;

const player = {
    x: 50,
    y: gameCanvas.height - 50,
    width: 40,
    height: 50,
    jumping: false,
    jumpHeight: 100,
    jumpCount: 0
};

const obstacles = [];
let gameLoop;
let score = 0;
let speed = 5;

function drawPlayer() {
    gameCtx.fillStyle = '#00ff00';
    gameCtx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacle(obstacle) {
    gameCtx.fillStyle = '#ff0000';
    gameCtx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

function createObstacle() {
    const height = Math.random() * 50 + 20;
    obstacles.push({
        x: gameCanvas.width,
        y: gameCanvas.height - height,
        width: 20,
        height: height
    });
}

function updateGame() {
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    if (player.jumping) {
        player.jumpCount++;
        if (player.jumpCount < 15) {
            player.y -= 5;
        } else if (player.jumpCount > 15 && player.jumpCount < 30) {
            player.y += 5;
        } else {
            player.jumping = false;
            player.jumpCount = 0;
        }
    }

    drawPlayer();

    obstacles.forEach((obstacle, index) => {
        obstacle.x -= speed;
        drawObstacle(obstacle);

        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++;
            scoreElement.textContent = score;
        }

        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            gameOver();
        }
    });

    if (Math.random() < 0.02) {
        createObstacle();
    }

    speed += 0.001;
}

function gameOver() {
    clearInterval(gameLoop);
    alert(`Game Over! Your score: ${score}`);
    obstacles.length = 0;
    score = 0;
    speed = 5;
    scoreElement.textContent = score;
    startGameBtn.textContent = 'Restart Game';
}

startGameBtn.addEventListener('click', () => {
    if (!gameLoop) {
        gameLoop = setInterval(updateGame, 1000 / 60);
        startGameBtn.textContent = 'Restart Game';
    } else {
        clearInterval(gameLoop);
        gameLoop = null;
        obstacles.length = 0;
        score = 0;
        speed = 5;
        scoreElement.textContent = score;
        player.y = gameCanvas.height - 50;
        gameLoop = setInterval(updateGame, 1000 / 60);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !player.jumping) {
        player.jumping = true;
    }
});

// Theme toggle
const themeSwitch = document.getElementById('theme-switch');
const body = document.body;

themeSwitch.addEventListener('change', () => {
    if (themeSwitch.checked) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
    }
});

// Background music
const backgroundMusic = document.getElementById('backgroundMusic');
const toggleMusicBtn = document.getElementById('toggleMusic');

toggleMusicBtn.addEventListener('click', () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        toggleMusicBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        backgroundMusic.pause();
        toggleMusicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
});

// Three.js background animation
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();

// Resize event listener
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});