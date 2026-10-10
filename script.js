// ============================================================
//  Jonathan Rodrigues — Personal Website JavaScript
// ============================================================

/* ─── 1. Navbar scroll effect ───────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateScrollspy();
    toggleBackToTop();
});

/* ─── 2. Mobile menu ────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function toggleMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
}

hamburger.addEventListener('click', toggleMenu);
navOverlay.addEventListener('click', toggleMenu);

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) toggleMenu();
    });
});

/* ─── 3. Scroll-reveal animations (re-trigger every visit) ─── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Add .visible when entering viewport, remove when leaving — replays each time
        entry.target.classList.toggle('visible', entry.isIntersecting);
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── 4. Theme toggle ───────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');

const SUN_SVG  = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
const MOON_SVG = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';

const getPreferredTheme = () =>
    localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeIcon.innerHTML = theme === 'dark' ? SUN_SVG : MOON_SVG;
};

setTheme(getPreferredTheme());

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
});

/* ─── 5. Typewriter — restarts every time the hero enters view ── */
const INTRO = 'Computer Science undergraduate passionate about building innovative software, exploring AI & ML, and crafting elegant digital experiences.';

const typeTarget = document.getElementById('typewriter');
const heroSection = document.querySelector('.hero');

if (typeTarget && heroSection) {
    let typeTimer  = null;

    function startTyping() {
        // Cancel any in-progress typing
        if (typeTimer) clearTimeout(typeTimer);
        typeTarget.textContent = '';
        let charIdx = 0;

        function typeTick() {
            if (charIdx <= INTRO.length) {
                typeTarget.textContent = INTRO.slice(0, charIdx++);
                typeTimer = setTimeout(typeTick, 28);
            }
            // Done — blinking cursor stays
        }
        typeTick();
    }

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) startTyping();
        });
    }, { threshold: 0.3 });

    heroObserver.observe(heroSection);
}

/* ─── 6. Animated stat counters ─────────────────────────── */
function animateCounter(el) {
    const rawTarget = el.dataset.target;
    const suffix    = el.dataset.suffix || '';
    const target    = parseInt(rawTarget, 10);
    const duration  = 1800;
    const start     = performance.now();
    const from      = target > 100 ? target - 50 : 0;

    function update(ts) {
        const elapsed  = ts - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 3);
        const value    = Math.round(from + (target - from) * ease);
        el.textContent = value.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Re-run on every entry — no guard, no unobserve
            animateCounter(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

/* ─── 7. Skill progress bars ────────────────────────────── */
const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-bar-fill').forEach(fill => {
                fill.style.width = fill.dataset.width;
            });
            barObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(card => barObserver.observe(card));

/* ─── 8. Scrollspy active nav link ──────────────────────── */
const sections   = document.querySelectorAll('section[id], footer[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

function updateScrollspy() {
    let currentId = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) currentId = sec.id;
    });
    navAnchors.forEach(a => {
        a.classList.toggle('active-link', a.getAttribute('href') === '#' + currentId);
    });
}
updateScrollspy();

/* ─── 9. Back-to-top button ─────────────────────────────── */
const backToTop = document.getElementById('backToTop');

function toggleBackToTop() {
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
}

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ─── 10. Particle canvas (hero section) ────────────────── */
const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let W, H;

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function randomBetween(a, b) { return a + Math.random() * (b - a); }

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x     = randomBetween(0, W);
            this.y     = randomBetween(0, H);
            this.r     = randomBetween(1, 2.5);
            this.vx    = randomBetween(-0.3, 0.3);
            this.vy    = randomBetween(-0.4, -0.1);
            this.alpha = randomBetween(0.2, 0.6);
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.y < -5 || this.x < -5 || this.x > W + 5) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(139, 92, 246, ' + this.alpha + ')';
            ctx.fill();
        }
    }

    for (let i = 0; i < 70; i++) particles.push(new Particle());

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx   = particles[i].x - particles[j].x;
                const dy   = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(99, 102, 241, ' + (0.12 * (1 - dist / 100)) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        drawLines();
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(loop);
    }
    loop();
}

/* ─── 11. Copy email to clipboard ───────────────────────── */
const copyEmailBtn = document.getElementById('copyEmailBtn');
if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
        const email = copyEmailBtn.dataset.email;
        navigator.clipboard.writeText(email).then(() => {
            const original = copyEmailBtn.innerHTML;
            copyEmailBtn.innerHTML =
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';
            copyEmailBtn.style.borderColor = '#22c55e';
            copyEmailBtn.style.color       = '#22c55e';
            setTimeout(() => {
                copyEmailBtn.innerHTML     = original;
                copyEmailBtn.style.borderColor = '';
                copyEmailBtn.style.color       = '';
            }, 2500);
        });
    });
}
