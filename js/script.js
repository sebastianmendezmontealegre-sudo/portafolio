/* ============================================
   CANVAS — Particle Network Background
   ============================================ */
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const CYAN  = [0, 212, 255];
  const COUNT = 55;
  const DIST  = 110;

  class Particle {
    constructor() { this.reset(true); }
    reset(randomY = false) {
      this.x  = Math.random() * canvas.width;
      this.y  = randomY ? Math.random() * canvas.height : -10;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.r  = Math.random() * 1.5 + 0.8;
      this.a  = Math.random() * 0.45 + 0.15;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CYAN},${this.a})`;
      ctx.fill();
    }
  }

  const particles = Array.from({ length: COUNT }, () => new Particle());

  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${CYAN},${0.12 * (1 - d / DIST)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ============================================
   TYPING ANIMATION
   ============================================ */
(function initTyping() {
  const el = document.getElementById('typeText');
  if (!el) return;

  const titles = [
    'Científico de Datos',
    'Data Analyst',
    'Desarrollador de Software',
    'Power BI Developer',
    'ETL Engineer',
  ];

  let ti = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 72, SPEED_DEL = 38, PAUSE = 2000;

  function tick() {
    const current = titles[ti];
    if (!deleting) {
      el.textContent = current.slice(0, ++ci);
      if (ci === current.length) { deleting = true; setTimeout(tick, PAUSE); return; }
    } else {
      el.textContent = current.slice(0, --ci);
      if (ci === 0) { deleting = false; ti = (ti + 1) % titles.length; }
    }
    setTimeout(tick, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  setTimeout(tick, 600);
})();

/* ============================================
   SCROLL PROGRESS BAR
   ============================================ */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / total * 100) + '%';
  }, { passive: true });
})();

/* ============================================
   NAV — sticky glass + active link highlight
   ============================================ */
(function initNav() {
  const nav  = document.getElementById('nav');
  const links = document.querySelectorAll('.nav-link');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    highlightNav();
  }, { passive: true });

  function highlightNav() {
    const sections = ['inicio','proyectos','skills','contacto'];
    let current = 'inicio';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 140) current = id;
    });
    links.forEach(l => l.classList.toggle('active', l.dataset.section === current));
  }

  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
  });

  document.querySelectorAll('.mobile-link').forEach(l => {
    l.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });
})();

/* ============================================
   INTERSECTION OBSERVER — general fade in
   ============================================ */
(function initFadeIn() {
  document.querySelectorAll(
    '.project-card, .metric-card, .contact-card, .skill-category, .tech-grid-col, .dash-widget'
  ).forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = (i % 6) * 0.07 + 's';
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-in').forEach(el => io.observe(el));
})();

/* ============================================
   COUNTER ANIMATION — metrics section
   ============================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = +el.dataset.target;
      const dur    = 1400;
      const start  = performance.now();
      function step(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
})();

/* ============================================
   WIDGET KPI COUNTERS (hero widget)
   ============================================ */
(function initWidgetKPIs() {
  const nums = document.querySelectorAll('.dw-num');
  let done = false;
  window.addEventListener('load', () => {
    if (done) return; done = true;
    setTimeout(() => {
      nums.forEach((el, i) => {
        const target = +el.dataset.target;
        const dur = 1200;
        const start = performance.now();
        setTimeout(() => {
          function step(now) {
            const p = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(ease * target);
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target;
          }
          requestAnimationFrame(step);
        }, i * 200);
      });
    }, 400);
  });
})();

/* ============================================
   WIDGET MINI BARS — animate on load
   ============================================ */
(function initWidgetBars() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.querySelectorAll('.dw-fill').forEach((el, i) => {
        setTimeout(() => el.classList.add('loaded'), 300 + i * 120);
      });
    }, 200);
  });
})();

/* ============================================
   SKILL BARS — animate on scroll
   ============================================ */
(function initSkillBars() {
  const fills = document.querySelectorAll('.sb-fill');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const w  = el.dataset.width;
      setTimeout(() => {
        el.style.width = w + '%';
        el.classList.add('animated');
      }, 100);
      io.unobserve(el);
    });
  }, { threshold: 0.3 });
  fills.forEach(f => io.observe(f));
})();
