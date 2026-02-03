/*
   MOBILE MENU TOGGLE */
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-center");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

/* 
   CLOSE MENU ON CLICK */
document.querySelectorAll(".nav-center a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});

/*
   ACTIVE NAV ON SCROLL */
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-center a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

/*
   SCROLL REVEAL ANIMATION */
const revealElements = document.querySelectorAll(
  ".about-container, .skill-card, .project-card, .contact-form"
);

const revealOnScroll = () => {
  revealElements.forEach(el => {
    const top = el.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (top < windowHeight - 80) {
      el.classList.add("show");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

function handleSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const successMsg = document.getElementById("success-message");

  fetch(form.action, {
    method: "POST",
    body: new FormData(form)
  })
  .then(() => {
    successMsg.style.display = "block";
    form.reset();

    setTimeout(() => {
      successMsg.style.display = "none";
    }, 4000);
  })
  .catch(() => {
    alert("Something went wrong. Please try again.");
  });
}


/* Parallax starfield background for Home section */
(function initParallaxStarfield(){
  const canvas = document.getElementById('stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Respect reduced motion
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let stars = [];
  let width = 0, height = 0, dpr = 1;

  // Pointer/device input for parallax
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };

  // small automatic drift when no input
  function autoDrift(t){
    return {
      x: Math.sin(t * 0.00012) * 0.35,
      y: Math.cos(t * 0.00009) * 0.28
    };
  }

  function resize(){
    dpr = window.devicePixelRatio || 1;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createStars();
  }

  function createStars(){
    stars = [];
    const area = width * height;
    const density = Math.max(80, Math.round(area / 5500)); // keep it modest for perf

    for (let i=0;i<density;i++){
      const z = Math.random(); // depth (0 near -> 1 far)
      const radius = (1 - z) * (Math.random() * 1.6 + 0.3); // nearer stars larger
      const alpha = 0.6 + (1 - z) * 0.9; // nearer brighter
      stars.push({
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        x: 0, y: 0,
        r: radius,
        alpha: alpha,
        z: z,
        twinkleSpeed: Math.random() * 0.018 + 0.006,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  // Input handling
  function onPointerMove(e){
    const rect = canvas.getBoundingClientRect();
    const px = (e.clientX - (rect.left + rect.width / 2)) / rect.width; // -0.5 .. 0.5
    const py = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
    target.x = Math.max(-1, Math.min(1, px*2));
    target.y = Math.max(-1, Math.min(1, py*2));
  }

  function onDeviceOrientation(e){
    if (prefersReducedMotion) return;
    // gamma (left-right), beta (front-back)
    const gx = e.gamma || 0; // -90 .. 90
    const by = e.beta || 0;  // -180 .. 180
    // map to -1 .. 1
    target.x = Math.max(-1, Math.min(1, gx / 30));
    target.y = Math.max(-1, Math.min(1, (by - 60) / 60));
  }

  // Smoothly interpolate current toward target
  function stepInput(){
    current.x += (target.x - current.x) * 0.08;
    current.y += (target.y - current.y) * 0.08;
  }

  let last = performance.now();
  function render(now){
    const dt = now - last;
    last = now;

    // update input smoothing
    stepInput();

    // clear background
    ctx.clearRect(0,0,width,height);

    // faint gradient backdrop
    const g = ctx.createLinearGradient(0, 0, 0, height);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,0.05)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,width,height);

    // auto drift when pointer is near center
    const drift = autoDrift(now);

    // parallax strength (pixels) relative to viewport
    const pxStrength = Math.max(28, Math.min(120, Math.round(Math.min(width,height) * 0.06)));

    for (let i=0;i<stars.length;i++){
      const s = stars[i];
      // movement factor: nearer stars move more => factor = (1 - z)
      const factor = (1 - s.z);
      const offsetX = (current.x + drift.x * 0.12) * pxStrength * factor;
      const offsetY = (current.y + drift.y * 0.12) * pxStrength * factor;
      const drawX = (s.baseX + offsetX + width) % width; // wrap-around effect
      const drawY = (s.baseY + offsetY + height) % height;

      // twinkle
      const a = Math.max(0, Math.min(1, s.alpha + Math.sin((now * s.twinkleSpeed) + s.phase) * 0.6 * (s.alpha * 0.6)));

      // draw
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      // small radial glow for the brightest near stars
      if (s.r > 1.6) {
        const rad = s.r * 3;
        const grad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, rad);
        grad.addColorStop(0, `rgba(255,255,255,${a})`);
        grad.addColorStop(0.6, `rgba(255,255,255,${a*0.2})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(drawX, drawY, rad, 0, Math.PI*2);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(drawX, drawY, s.r, 0, Math.PI*2);
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  // Events
  if (!prefersReducedMotion) {
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });
  }
  window.addEventListener('resize', resize);

  resize();
  requestAnimationFrame(render);
})();

/* Terminal typing animation for About section */
(function initTerminalTyping(){
  const termCard = document.getElementById('terminal-card');
  const termContent = document.getElementById('term-content');
  if (!termCard || !termContent) return;

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const lines = [
    {type: 'cmd', prompt: '$', text: ' Gaurav--info'},
    {type: 'out', prompt: '', text: 'Initializing Gaurav_Bio_v2...'},
   
    {type: 'out', prompt: '> ', text: 'Skills: Python, C++, ML, DSA , Web devlopment'},
    {type: 'out', prompt: '> ', text: 'Hobbies: Competitive_Coding, Reading'},
    {type: 'out', prompt: '> ', text: 'Location: Pune_Maharashtra_IN'},
    {type: 'out', prompt: '', text: 'Ready for collaboration...'}
  ];

  let started = false;

  function wait(ms){ return new Promise(r => setTimeout(r, ms)); }

  function createLineElements(type, prompt){
    const line = document.createElement('div'); line.className = 'term-line';
    const p = document.createElement('span'); p.className = 'prompt'; p.textContent = prompt || '';
    const t = document.createElement('span'); t.className = 'text ' + (type === 'cmd' ? 'cmd' : 'out');
    line.appendChild(p); line.appendChild(t);
    return { line, textEl: t };
  }

  function placeCursorIn(el){
    let cursor = termCard.querySelector('.cursor');
    if (!cursor) { cursor = document.createElement('span'); cursor.className = 'cursor'; cursor.textContent = '▌'; }
    el.appendChild(cursor);
  }

  async function typeText(el, text){
    const min = 14, max = 40;
    for (let i = 0; i < text.length; i++){
      el.textContent += text[i];
      const delay = Math.random() * (max - min) + min;
      await wait(delay);
    }
  }

  async function showAllInstant(){
    termContent.setAttribute('aria-live','off');
    termContent.innerHTML = '';
    lines.forEach(l => {
      const { line, textEl } = createLineElements(l.type, l.prompt);
      textEl.textContent = l.text;
      termContent.appendChild(line);
    });
    termContent.setAttribute('aria-live','polite');
    // put cursor at end
    const last = termContent.lastElementChild.querySelector('.text');
    placeCursorIn(last);
  }

  async function startTyping(){
    termContent.setAttribute('aria-live','off');
    termContent.innerHTML = '';

    for (let i=0;i<lines.length;i++){
      const l = lines[i];
      const { line, textEl } = createLineElements(l.type, l.prompt);
      termContent.appendChild(line);
      placeCursorIn(textEl);

      await typeText(textEl, l.text);

      // small pause after line
      await wait(l.type === 'cmd' ? 350 : 480);
    }

    termContent.setAttribute('aria-live','polite');
    // leave cursor blinking at end
    const last = termContent.lastElementChild.querySelector('.text');
    placeCursorIn(last);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting && !started){
        started = true;
        obs.unobserve(termCard);
        if (prefersReducedMotion) { showAllInstant(); }
        else { startTyping(); }
      }
    });
  }, { threshold: 0.35 });

  obs.observe(termCard);
})();

/* Scroll-based parallax (Emma Trayanova style) */
(function initParallaxScroll(){
  const layers = Array.from(document.querySelectorAll('.parallax-layer'));
  if (!layers.length) return;

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  let pointer = { x: 0.5, y: 0.5 };
  let rafId = null;

  function update(){
    const viewportHeight = window.innerHeight;
    layers.forEach(layer => {
      const depth = parseFloat(layer.dataset.depth) || 0.12;
      const rect = layer.getBoundingClientRect();
      const layerCenter = rect.top + rect.height / 2;
      const offsetFromCenter = layerCenter - viewportHeight / 2;
      const y = -offsetFromCenter * depth;
      const px = (pointer.x - 0.5) * (isTouch ? 0 : 30) * depth;
      const py = (pointer.y - 0.5) * (isTouch ? 0 : 30) * depth * 0.6;
      layer.style.transform = `translate3d(${px.toFixed(2)}px, ${Math.round(y + py)}px, 0)`;
    });
    rafId = null;
  }

  function requestUpdate(){ if (rafId === null) rafId = requestAnimationFrame(update); }

  function onPointer(e){
    pointer.x = e.clientX / window.innerWidth;
    pointer.y = e.clientY / window.innerHeight;
    requestUpdate();
  }

  if (!prefersReducedMotion && !isTouch) {
    window.addEventListener('pointermove', onPointer);
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  // initial
  requestUpdate();
})();
