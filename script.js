/* ===== ADITYA RAJ PORTFOLIO — script.js (Enhanced) ===== */

/* ---------- Page Load Fade-In ---------- */
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.6s ease';
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
  initParticles();
});


/* ========================
   PARTICLES CANVAS
======================== */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); });

  const COLORS = ['rgba(99,102,241,', 'rgba(168,85,247,', 'rgba(6,182,212,', 'rgba(236,72,153,'];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.8 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += 0.02;
      const a = this.alpha + Math.sin(this.pulse) * 0.08;
      if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) this.reset();
      return a;
    }
    draw(ctx, a) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${Math.max(0.05, a)})`;
      ctx.fill();
    }
  }

  // Create particles
  const COUNT = Math.min(120, Math.floor((W * H) / 8000));
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  // Connect nearby particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => {
      const a = p.update();
      p.draw(ctx, a);
    });
    requestAnimationFrame(animate);
  }
  animate();
}


/* ========================
   NAVBAR
======================== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  highlightActiveNav();
}, { passive: true });

/* Mobile hamburger */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* Active nav on scroll */
function highlightActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.pageYOffset;
  sections.forEach(section => {
    const top = section.offsetTop - 110;
    const bot = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < bot);
  });
}


/* ========================
   TYPEWRITER
======================== */
const phrases = [
  'Full-Stack HRMS Specialist',
  'Payroll & Attendance Expert',
  'Laravel & React Developer',
  'Leave Management Architect',
  'React Native Mobile Developer',
  'Enterprise System Builder',
];
let phraseIndex = 0, charIndex = 0, deleting = false;
const typeEl = document.getElementById('typewriter');

function typeWriter() {
  const current = phrases[phraseIndex];
  if (!deleting) {
    typeEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeWriter, 2200);
      return;
    }
  } else {
    typeEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeWriter, deleting ? 50 : 85);
}
typeWriter();


/* ========================
   SCROLL ANIMATIONS (Intersection Observer)
======================== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = Array.from(entry.target.parentElement.children);
      const delay = siblings.indexOf(entry.target) * 90;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('[data-animate], .timeline-item, .edu-card, .cert-card, .project-card').forEach(el => {
  observer.observe(el);
});


/* ========================
   ANIMATED COUNTER
======================== */
function animateCounter(el, target, suffix = '') {
  const step = target / 55;
  let current = 0;
  const t = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = (Number.isInteger(target) ? Math.round(current) : current.toFixed(1)) + suffix;
    if (current >= target) clearInterval(t);
  }, 28);
}

new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(el => {
        const raw = el.textContent.trim();
        const suffix = raw.replace(/[0-9.]/g, '');
        const value = parseFloat(raw);
        if (!isNaN(value)) animateCounter(el, value, suffix);
      });
    }
  });
}, { threshold: 0.5 }).observe(document.querySelector('.about-stats') || document.body);


/* ========================
   ORB PARALLAX
======================== */
const orbs = document.querySelectorAll('.orb');
let mouseX = 0, mouseY = 0, currX = 0, currY = 0;

document.addEventListener('mousemove', e => {
  mouseX = (e.clientX - window.innerWidth / 2) / window.innerWidth;
  mouseY = (e.clientY - window.innerHeight / 2) / window.innerHeight;
}, { passive: true });

(function orbParallax() {
  currX += (mouseX - currX) * 0.04;
  currY += (mouseY - currY) * 0.04;
  orbs.forEach((orb, i) => {
    const f = (i + 1) * 18;
    orb.style.transform = `translate(${currX * f}px, ${currY * f}px)`;
  });
  requestAnimationFrame(orbParallax);
})();


/* ========================
   PROJECT CARD SPOTLIGHT HOVER
======================== */
document.querySelectorAll('.project-card, .skill-category, .timeline-card').forEach(card => {
  card.addEventListener('mousemove', function (e) {
    const rect = this.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    this.style.setProperty('--mx', `${x}%`);
    this.style.setProperty('--my', `${y}%`);
    this.style.backgroundImage = `radial-gradient(circle at ${x}% ${y}%, rgba(99,102,241,0.07) 0%, transparent 60%), var(--bg-card)`;
  });
  card.addEventListener('mouseleave', function () {
    this.style.backgroundImage = '';
  });
});


/* ========================
   PROJECT CARD NEIGHBOR DIM
======================== */
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    projectCards.forEach(c => { if (c !== card) c.style.opacity = '0.55'; });
  });
  card.addEventListener('mouseleave', () => {
    projectCards.forEach(c => { c.style.opacity = ''; });
  });
});


/* ========================
   SKILL PILL STAGGER REVEAL
======================== */
new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const pills = entry.target.querySelectorAll('.pill');
      pills.forEach((p, i) => {
        p.style.opacity = '0';
        p.style.transform = 'translateY(10px)';
        p.style.transition = `opacity 0.4s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms`;
        requestAnimationFrame(() => {
          p.style.opacity = '1';
          p.style.transform = '';
        });
      });
    }
  });
}, { threshold: 0.3 }).observe(document.querySelector('.skills-grid') || document.body);


/* ========================
   SMOOTH SECTION ENTRY (hero elements)
======================== */
const heroEls = document.querySelectorAll('.hero-badge, .hero-name, .hero-typewriter, .hero-desc, .hero-actions, .hero-socials');
heroEls.forEach((el, i) => {
  el.style.animationDelay = `${i * 0.1}s`;
});
