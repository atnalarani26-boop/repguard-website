// Smooth anchor scroll (works on file:// too)
function smoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  });
}

// Reveal on scroll
function revealOnScroll() {
  const els = Array.from(document.querySelectorAll(".reveal"));
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
}

// Particles canvas background
function initParticles() {
  const canvas = document.getElementById("fxParticles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  const count = Math.min(90, Math.floor((w * h) / 18000));
  const pts = Array.from({ length: count }).map(() => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    r: 1 + Math.random() * 1.6,
    a: 0.35 + Math.random() * 0.35
  }));

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);

  function step() {
    ctx.clearRect(0, 0, w, h);

    // draw points
    for (const p of pts) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(210,220,255,${p.a})`;
      ctx.fill();
    }

    // link lines
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        const max = 150 * 150;
        if (d2 < max) {
          const t = 1 - (d2 / max);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(140,120,255,${0.08 * t})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  }

  step();
}

document.addEventListener("DOMContentLoaded", () => {
  smoothAnchors();
  revealOnScroll();
  initParticles();
});
