/* =========================================================
   Baby Shower — Soft Watercolor Garden
   -----------------------------------------------------------
   ▶▶ EDIT EVERYTHING IN ONE PLACE: the CONFIG object below ◀◀
   ========================================================= */

const CONFIG = {
  parents:    "Sarah & James",
  headline:   { line1: "Baby", line2: "Shower" }, // line2 is in script font
  honourText: "in honour of",
  tagline:    "A little one is on the way 🌿",

  // ISO format: "YYYY-MM-DDTHH:MM"  (24-hour time, local)
  eventISO:   "2026-07-18T14:00",

  dateText:   "Saturday, July 18th",
  timeText:   "2:00 PM in the afternoon",

  venueName:  "The Garden Pavilion",
  address:    "124 Rose Lane, Springfield",
  mapsQuery:  "The Garden Pavilion, 124 Rose Lane, Springfield", // used for Google Maps link

  quote:      "“A baby fills a place in your heart that you never knew was empty.”",
  invitation: "With love and joyful anticipation, we invite you to celebrate the newest little blossom about to bloom into our family.",

  giftLead:   "Your presence is the present",
  giftSub:    "…but if you wish, a little something for the registry.",
  registryURL: "",  // leave "" to hide the registry link

  rsvpByText: "Kindly reply by July 4th so we can save you a seat in the garden.",
  rsvpEmail:  "everlumepages@gmail.com", // RSVP form opens a pre-filled email to this address

  footerMsg:  "We can't wait to celebrate with you.",
};

/* ---------- inject config into the DOM ---------- */
function applyConfig() {
  const set = (id, val) => { const el = document.getElementById(id); if (el && val != null) el.textContent = val; };

  set("heroNames", CONFIG.parents);
  set("footerNames", CONFIG.parents);
  document.querySelector(".hero__sub").textContent = CONFIG.honourText;
  document.querySelector(".hero__tag").textContent = CONFIG.tagline;
  document.querySelectorAll(".hero__title .word")[0].textContent = CONFIG.headline.line1;
  document.querySelector(".hero__title .word.script").textContent = CONFIG.headline.line2;

  set("announceQuote", CONFIG.quote);
  document.querySelector(".announce__by").textContent = CONFIG.invitation;

  set("detailDate", CONFIG.dateText);
  set("detailTime", CONFIG.timeText);
  set("detailVenue", CONFIG.venueName);
  set("detailAddress", CONFIG.address);
  set("detailGiftLead", CONFIG.giftLead);
  set("detailGiftSub", CONFIG.giftSub);
  set("rsvpNote", CONFIG.rsvpByText);
  set("footerMsg", CONFIG.footerMsg);

  const map = document.getElementById("detailMap");
  if (map) map.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.mapsQuery);

  const reg = document.getElementById("detailRegistry");
  if (reg) {
    if (CONFIG.registryURL) reg.href = CONFIG.registryURL;
    else reg.style.display = "none";
  }

  document.title = `${CONFIG.headline.line1} ${CONFIG.headline.line2} · ${CONFIG.parents}`;
}

/* ============================================================
   PETAL + BUTTERFLY CANVAS
   Gentle, depth-aware drift — no two petals identical.
   ============================================================ */
class PetalField {
  constructor(canvas) {
    this.c = canvas;
    this.ctx = canvas.getContext("2d");
    this.petals = [];
    this.butterflies = [];
    this.colors = ["#f4d2cb", "#e9b7af", "#f6e0d3", "#d98c86", "#cfe0bd"];
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.spawn();
    this.t = 0;
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.c.width = this.w * this.dpr;
    this.c.height = this.h * this.dpr;
    this.c.style.width = this.w + "px";
    this.c.style.height = this.h + "px";
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  spawn() {
    const count = this.reduced ? 14 : Math.round(Math.min(46, this.w / 24));
    for (let i = 0; i < count; i++) this.petals.push(this.makePetal(true));
    const bcount = this.reduced ? 0 : 3;
    for (let i = 0; i < bcount; i++) this.butterflies.push(this.makeButterfly());
  }

  makePetal(initial = false) {
    const depth = Math.random();           // 0 = far, 1 = near
    const size = 6 + depth * 16;
    return {
      x: Math.random() * this.w,
      y: initial ? Math.random() * this.h : -size - Math.random() * 80,
      size,
      depth,
      color: this.colors[(Math.random() * this.colors.length) | 0],
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.005 + Math.random() * 0.01,
      swayAmp: 18 + Math.random() * 40,
      fall: 0.25 + depth * 0.8,
      flutter: Math.random() * Math.PI * 2,
      opacity: 0.35 + depth * 0.5,
    };
  }

  makeButterfly() {
    return {
      x: Math.random() * this.w,
      y: this.h * (0.2 + Math.random() * 0.6),
      vx: (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random()),
      baseY: 0,
      phase: Math.random() * Math.PI * 2,
      flap: Math.random() * Math.PI * 2,
      size: 9 + Math.random() * 7,
      hue: ["#d98c86", "#c9a86a", "#a7b894"][(Math.random() * 3) | 0],
    };
  }

  drawPetal(p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    // flutter = horizontal squash to fake 3D spin
    const sx = Math.cos(p.flutter) * 0.7 + 0.3;
    ctx.scale(sx, 1);
    ctx.globalAlpha = p.opacity;
    const g = ctx.createLinearGradient(0, -p.size, 0, p.size);
    g.addColorStop(0, p.color);
    g.addColorStop(1, "#fff6f0");
    ctx.fillStyle = g;
    ctx.beginPath();
    // teardrop / petal shape
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.4, p.size * 0.5, p.size * 0.9, 0, p.size);
    ctx.bezierCurveTo(-p.size * 0.5, p.size * 0.9, -p.size * 0.9, -p.size * 0.4, 0, -p.size);
    ctx.fill();
    ctx.restore();
  }

  drawButterfly(b) {
    const ctx = this.ctx;
    const wing = Math.abs(Math.sin(b.flap)) * 0.9 + 0.1;
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.scale(b.vx < 0 ? -1 : 1, 1);
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = b.hue;
    const s = b.size;
    // upper wings
    ctx.save(); ctx.scale(wing, 1);
    ctx.beginPath(); ctx.ellipse(-s * 0.5, -s * 0.3, s * 0.6, s * 0.45, 0, 0, Math.PI * 2);
    ctx.ellipse(s * 0.5, -s * 0.3, s * 0.6, s * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.ellipse(-s * 0.45, s * 0.35, s * 0.45, s * 0.35, 0, 0, Math.PI * 2);
    ctx.ellipse(s * 0.45, s * 0.35, s * 0.45, s * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // body
    ctx.globalAlpha = 0.9; ctx.fillStyle = "#5a4a42";
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.12, s * 0.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  loop() {
    const ctx = this.ctx;
    this.t += 1;
    ctx.clearRect(0, 0, this.w, this.h);

    for (const p of this.petals) {
      p.sway += p.swaySpeed;
      p.flutter += 0.04 + p.depth * 0.03;
      p.rot += p.rotSpeed;
      p.y += p.fall;
      p.x += Math.sin(p.sway) * p.swayAmp * 0.02;
      if (p.y > this.h + 30) Object.assign(p, this.makePetal(false));
      this.drawPetal(p);
    }

    for (const b of this.butterflies) {
      b.flap += 0.3;
      b.phase += 0.02;
      b.x += b.vx;
      b.y += Math.sin(b.phase) * 0.8;
      if (b.x < -40) { b.x = this.w + 40; }
      if (b.x > this.w + 40) { b.x = -40; }
      this.drawButterfly(b);
    }

    requestAnimationFrame(this.loop);
  }
}

/* ============================================================
   SCROLL-DRIVEN: vine draw + progress bud + reveals
   ============================================================ */
function initScroll() {
  const vine = document.getElementById("vinePath");
  const vineLen = vine ? vine.getTotalLength() : 0;
  if (vine) { vine.style.strokeDasharray = vineLen; vine.style.strokeDashoffset = vineLen; }
  const bud = document.getElementById("progressBud");

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    if (vine) vine.style.strokeDashoffset = vineLen * (1 - p);
    if (bud) bud.style.top = (p * 100) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // reveal on enter
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    }
  }, { threshold: 0.18 });
  document.querySelectorAll(".reveal, .reveal-up").forEach((el) => io.observe(el));

  // hero branches draw once in view
  const bio = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-drawn"); bio.unobserve(e.target); }
  }, { threshold: 0.1 });
  document.querySelectorAll(".branch").forEach((b) => bio.observe(b));
}

/* ============================================================
   COUNTDOWN
   ============================================================ */
function initCountdown() {
  const target = new Date(CONFIG.eventISO).getTime();
  if (isNaN(target)) return;
  const nums = document.querySelectorAll(".cd-num");
  const last = {};

  const pad = (n) => String(Math.max(0, n)).padStart(2, "0");
  const tick = () => {
    const diff = target - Date.now();
    const past = diff <= 0;
    const d = past ? 0 : Math.floor(diff / 86400000);
    const h = past ? 0 : Math.floor((diff % 86400000) / 3600000);
    const m = past ? 0 : Math.floor((diff % 3600000) / 60000);
    const s = past ? 0 : Math.floor((diff % 60000) / 1000);
    const map = { days: d, hours: h, minutes: m, seconds: s };
    nums.forEach((el) => {
      const u = el.dataset.unit;
      const val = pad(map[u]);
      if (last[u] !== val) {
        el.textContent = val;
        el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick");
        last[u] = val;
      }
    });
    if (past) {
      const grid = document.getElementById("countdownGrid");
      if (grid) grid.innerHTML = '<p style="font-family:var(--font-script);font-size:2rem;color:var(--rose-deep)">The day has arrived! 🌸</p>';
      clearInterval(timer);
    }
  };
  tick();
  const timer = setInterval(tick, 1000);
}

/* ============================================================
   RSVP — validates, bursts petals, opens a pre-filled email
   ============================================================ */
function initRSVP(field) {
  const form = document.getElementById("rsvpForm");
  if (!form) return;
  const hint = document.getElementById("rsvpHint");
  const btn = form.querySelector(".rsvp__btn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.guestName.value.trim();
    const attending = form.attending.value;
    const guests = form.guests.value || "1";
    const message = form.message.value.trim();

    hint.classList.remove("is-error");
    if (!name) { hint.textContent = "Please tell us your name 🌷"; hint.classList.add("is-error"); form.guestName.focus(); return; }
    if (!attending) { hint.textContent = "Please let us know if you can come 🌷"; hint.classList.add("is-error"); return; }

    btn.classList.add("is-sent");
    if (field && !field.reduced) burstPetals(field, btn);

    const subject = `Baby Shower RSVP — ${name}`;
    const body =
      `Name: ${name}\n` +
      `Response: ${attending}\n` +
      `Number of guests: ${guests}\n` +
      `Message: ${message || "(none)"}\n`;
    const mail = `mailto:${CONFIG.rsvpEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    hint.textContent = "Thank you! Opening your email to send the RSVP… 💌";
    setTimeout(() => { window.location.href = mail; }, 650);
  });
}

/* celebratory petal burst from the button position */
function burstPetals(field, btn) {
  const r = btn.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  for (let i = 0; i < 26; i++) {
    const p = field.makePetal(false);
    p.x = cx; p.y = cy;
    p.fall = -2 - Math.random() * 3;       // launch upward first
    const ang = Math.random() * Math.PI * 2;
    p.swayAmp = 60 + Math.random() * 60;
    p.sway = ang;
    p.x += Math.cos(ang) * 10;
    field.petals.push(p);
    // gravity-ish: let normal loop pull them down as fall increases
  }
  // gradually restore downward fall for burst petals
  let g = 0;
  const grav = setInterval(() => {
    g++; field.petals.forEach((p) => { if (p.fall < 1.2) p.fall += 0.15; });
    if (g > 30) clearInterval(grav);
  }, 60);
}

/* ============================================================
   LOADER
   ============================================================ */
function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  // Always begin at the very top — never the middle.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  const finish = () => {
    if (loader.classList.contains("is-done")) return;
    window.scrollTo(0, 0);          // snap to top BEFORE revealing the page
    loader.classList.add("is-done");
    // keep it pinned to the top while the curtain fades
    setTimeout(() => window.scrollTo(0, 0), 60);
    setTimeout(() => window.scrollTo(0, 0), 400);
  };

  // Give the intro room to breathe & be read (~4.2s)
  window.addEventListener("load", () => setTimeout(finish, 4200));
  // safety fallback if 'load' is slow
  setTimeout(finish, 6000);
}

/* ============================================================
   FLOATING BABY ICONS — a generous, varied flock
   Line-art set in the garden palette. Bob + rotate + parallax.
   ============================================================ */
const BABY_ICONS = {
  feet:    '<path d="M8 8c2 0 3 2 3 4.2 0 2-1.2 3.3-2.8 3.3C6.4 15.5 6 13.6 6 11.6 6 9.2 6 8 8 8z"/><circle cx="9.2" cy="6.2" r=".9" fill="currentColor"/><circle cx="11.2" cy="6.8" r=".8" fill="currentColor"/><path d="M16 9c1.7 0 2.6 1.7 2.6 3.6 0 1.7-1 2.9-2.4 2.9-1.5 0-1.9-1.6-1.9-3.4C14.3 10 14.3 9 16 9z" /><circle cx="17" cy="7.4" r=".8" fill="currentColor"/>',
  bottle:  '<rect x="8" y="8" width="8" height="13" rx="3"/><path d="M9.3 5h5.4l-1 3H10.3z"/><path d="M10.5 3.4h3"/><path d="M9 12h6M9 14.5h4M9 17h5"/>',
  rattle:  '<circle cx="9.5" cy="9.5" r="5"/><path d="M13 13l4.5 4.5"/><path d="M15.5 17.5l3 .8-.8-3z"/><circle cx="9.5" cy="7.6" r=".6" fill="currentColor"/><circle cx="7.7" cy="10.4" r=".6" fill="currentColor"/><circle cx="11.4" cy="10.4" r=".6" fill="currentColor"/>',
  onesie:  '<path d="M8.6 4l1 2.4h4.8l1-2.4"/><path d="M8.6 4 5.2 6.4 7 9l1.6-1V20h6.8V8L17 9l1.8-2.6L15.4 4"/><path d="M11 13h2"/>',
  teddy:   '<circle cx="12" cy="9.4" r="3.8"/><circle cx="8.2" cy="6.4" r="1.7"/><circle cx="15.8" cy="6.4" r="1.7"/><path d="M8.4 13c0 4 1.2 7 3.6 7s3.6-3 3.6-7"/><circle cx="10.6" cy="9" r=".6" fill="currentColor"/><circle cx="13.4" cy="9" r=".6" fill="currentColor"/><path d="M11.1 10.8h1.8"/>',
  pacifier:'<circle cx="12" cy="14" r="4"/><circle cx="12" cy="14" r="1.6"/><path d="M9 11.2c0-2 1.4-3 3-3s3 1 3 3"/><circle cx="12" cy="7" r="1.4"/>',
  pram:    '<path d="M5 13h10a5 5 0 0 0-5-5H5z"/><path d="M5 8v5"/><path d="M6.5 13l1.5 3M13.5 13l1.5 3"/><circle cx="7.5" cy="18" r="1.6"/><circle cx="14.5" cy="18" r="1.6"/><path d="M15 8.5 18.5 6"/>',
  balloon: '<ellipse cx="12" cy="9" rx="5" ry="6"/><path d="M11 15l1 1 1-1"/><path d="M12 16c-1 1 1 2 0 3.4"/>',
  heart:   '<path d="M12 20s-6.8-4.2-6.8-9A3.9 3.9 0 0 1 12 8.4 3.9 3.9 0 0 1 18.8 11c0 4.8-6.8 9-6.8 9z"/>',
  star:    '<path d="M12 4l2.1 4.7 5 .5-3.7 3.4 1 4.9L12 15.4 7.6 17.9l1-4.9L5 9.6l5-.5z"/>',
  moon:    '<path d="M15.5 4a8 8 0 1 0 0 16 6.2 6.2 0 0 1 0-16z"/><circle cx="9" cy="9" r=".7" fill="currentColor"/><circle cx="8" cy="13" r=".6" fill="currentColor"/>',
  duck:    '<path d="M13.5 8.4a3 3 0 1 0-3 3H10c-3 0-5 1.8-5 3.8 0 1.1 1 2 2.6 2h6.2c3 0 5.2-2 5.2-5 0-2-1-3.7-2.8-4.6"/><path d="M13.5 8.4 17 7.4l-2 2"/><circle cx="11.6" cy="7.6" r=".6" fill="currentColor"/>',
  cloud:   '<path d="M7 16.5a3.2 3.2 0 0 1 0-6.4 4.2 4.2 0 0 1 7.9-1.6A3.6 3.6 0 1 1 17.4 16.5z"/>',
  blocks:  '<rect x="4" y="12.5" width="6.6" height="6.6" rx="1"/><rect x="13" y="12.5" width="6.6" height="6.6" rx="1"/><rect x="8.5" y="4.5" width="6.6" height="6.6" rx="1"/><path d="M6.8 15h1M15.8 15h1M11.2 7h1"/>',
  bib:     '<path d="M9 5a3 3 0 0 0 6 0"/><path d="M9 5c-3 1-5 4-5 7.6A8 8 0 0 0 20 12.6C20 9 18 6 15 5"/><circle cx="12" cy="13.5" r="2"/>',
};
const BABY_COLORS = ["#d98c86", "#8a9a7b", "#c9a86a", "#cf9a93", "#6e7d5e", "#b9655f", "#a7b894"];

class BabyFlock {
  constructor(layer) {
    this.layer = layer;
    this.items = [];
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.names = Object.keys(BABY_ICONS);
    this.build();
    window.addEventListener("scroll", () => this.parallax(), { passive: true });
    window.addEventListener("resize", () => this.parallax());
    this.parallax();
  }

  rand(a, b) { return a + Math.random() * (b - a); }

  build() {
    const w = window.innerWidth;
    const count = this.reduced ? 10 : Math.max(18, Math.min(34, Math.round(w / 46)));
    const cols = 6;
    for (let i = 0; i < count; i++) {
      const name = this.names[i % this.names.length];
      const color = BABY_COLORS[(Math.random() * BABY_COLORS.length) | 0];
      const depth = Math.random();                       // 0 far … 1 near
      const size = this.rand(26, 30 + depth * 50);       // 26–80px
      // scatter across a grid-ish spread so they don't clump
      const col = i % cols;
      const left = (col * (100 / cols)) + this.rand(-6, 6);
      const top = this.rand(2, 96);

      const wrap = document.createElement("div");
      wrap.className = "float-icon" + (Math.random() < 0.3 ? " twinkle" : "");
      wrap.style.left = Math.max(0, Math.min(94, left)) + "%";
      wrap.style.top = top + "%";
      wrap.style.width = size + "px";
      wrap.style.height = size + "px";
      wrap.style.opacity = (0.28 + depth * 0.5).toFixed(2);
      wrap.style.filter = depth < 0.4 ? `blur(${(0.4 - depth) * 4}px)` : "none";

      const inner = document.createElement("div");
      inner.className = "float-icon__inner";
      inner.style.color = color;
      inner.style.setProperty("--dur", this.rand(5, 11).toFixed(2) + "s");
      inner.style.setProperty("--delay", (-this.rand(0, 6)).toFixed(2) + "s");
      inner.style.setProperty("--rot1", this.rand(-12, -2).toFixed(1) + "deg");
      inner.style.setProperty("--rot2", this.rand(2, 12).toFixed(1) + "deg");
      inner.innerHTML =
        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${BABY_ICONS[name]}</svg>`;

      wrap.appendChild(inner);
      this.layer.appendChild(wrap);
      this.items.push({ el: wrap, depth, baseTop: top });
    }
  }

  parallax() {
    const y = window.scrollY;
    for (const it of this.items) {
      // nearer icons drift more — gentle, opposite to scroll
      const shift = -y * (0.04 + it.depth * 0.18);
      it.el.style.transform = `translateY(${shift}px)`;
    }
  }
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  initLoader();
  const field = new PetalField(document.getElementById("petals"));
  new BabyFlock(document.getElementById("babyLayer"));
  initScroll();
  initCountdown();
  initRSVP(field);
});
