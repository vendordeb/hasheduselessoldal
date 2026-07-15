// --- Ambient Canvas Background ---
const canvas = document.getElementById('ambient-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let orbs = [];

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

window.addEventListener('resize', resize);
resize();

class Orb {
  constructor() {
    this.radius = Math.random() * 350 + 150; 
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    
    const hues = [
      '168, 85, 247', 
      '99, 102, 241', 
      '217, 70, 239', 
      '124, 58, 237'  
    ];
    this.color = hues[Math.floor(Math.random() * hues.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x - this.radius > width || this.x + this.radius < 0) this.vx *= -1;
    if (this.y - this.radius > height || this.y + this.radius < 0) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    
    gradient.addColorStop(0, `rgba(${this.color}, 0.08)`); 
    gradient.addColorStop(1, `rgba(${this.color}, 0)`);    

    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initOrbs() {
  orbs = [];
  for (let i = 0; i < 8; i++) {
    orbs.push(new Orb());
  }
}
initOrbs();

// --- Interactive Cursor Glow ---
const cursorGlow = document.getElementById('cursor-glow');
window.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

// --- Momentum / Smooth Scroll Engine ---
let currentScroll = window.scrollY;
let targetScroll = window.scrollY;
const ease = 0.06; 

window.addEventListener('wheel', (e) => {
  e.preventDefault(); 
  targetScroll += e.deltaY; 
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
}, { passive: false }); 

document.getElementById('explore-btn').addEventListener('click', (e) => {
  e.preventDefault();
  const targetElement = document.getElementById('collection');
  const offset = targetElement.getBoundingClientRect().top + window.scrollY - 100;
  targetScroll = offset;
});

// --- Unified Render Loop ---
function renderLoop() {
  // 1. Draw Canvas Orbs
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'lighter';
  orbs.forEach(orb => {
    orb.update();
    orb.draw();
  });

  // 2. Calculate Smooth Scroll Momentum
  currentScroll += (targetScroll - currentScroll) * ease;
  
  if (Math.abs(targetScroll - currentScroll) > 0.5) {
    window.scrollTo(0, currentScroll);
  }

  requestAnimationFrame(renderLoop);
}

// Start the loop
renderLoop();