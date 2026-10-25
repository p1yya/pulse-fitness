// /* ==============================================================
//    PULSE FITNESS CLUB — SCRIPT.JS
//    Kept intentionally minimal for Evaluation 1 — HTML + CSS do
//    almost all of the work (structure, responsiveness, the FAQ
//    accordion via native <details>). Three small, independent
//    features live here:

//    1. Day / Night theme toggle   (remembered with localStorage)
//    2. Mobile hamburger menu open/close
//    3. Contact form: fake "submit" confirmation message

//    Advanced features (BMI/calorie calculators, workout generator,
//    schedule filtering, booking system, more DOM work) are planned
//    for Evaluation 2 and intentionally left out of this file.

//    Each function is independent — deleting one doesn't break the
//    others.
//    ============================================================== */

// document.addEventListener('DOMContentLoaded', function () {
//   setupThemeToggle();
//   setupMobileNav();
//   setupContactForm();
// });


// /* ----------------------------------------------------------------
//    1. DAY / NIGHT THEME TOGGLE
//    The chosen theme is saved in localStorage so it stays the same
//    across every page of the site, not just the one it was set on.
//    ---------------------------------------------------------------- */
// function setupThemeToggle() {
//   const toggleBtn = document.getElementById('themeToggle');
//   if (!toggleBtn) return;

//   const iconSpan = toggleBtn.querySelector('.theme-icon');
//   const body = document.body;

//   const savedTheme = localStorage.getItem('pulse-theme');
//   if (savedTheme === 'dark') {
//     body.setAttribute('data-theme', 'dark');
//     iconSpan.textContent = '🌙';
//     toggleBtn.setAttribute('aria-label', 'Switch to day mode');
//   }

//   toggleBtn.addEventListener('click', function () {
//     const isDark = body.getAttribute('data-theme') === 'dark';

//     if (isDark) {
//       body.removeAttribute('data-theme');
//       iconSpan.textContent = '☀️';
//       toggleBtn.setAttribute('aria-label', 'Switch to night mode');
//       localStorage.setItem('pulse-theme', 'light');
//     } else {
//       body.setAttribute('data-theme', 'dark');
//       iconSpan.textContent = '🌙';
//       toggleBtn.setAttribute('aria-label', 'Switch to day mode');
//       localStorage.setItem('pulse-theme', 'dark');
//     }
//   });
// }


// /* ----------------------------------------------------------------
//    2. MOBILE HAMBURGER MENU
//    ---------------------------------------------------------------- */
// function setupMobileNav() {
//   const navToggle = document.getElementById('navToggle');
//   const navLinks = document.getElementById('navLinks');
//   if (!navToggle || !navLinks) return;

//   navToggle.addEventListener('click', function () {
//     const isOpen = document.body.classList.toggle('nav-open');
//     navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
//     navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
//   });

//   // Close the menu automatically once a link is tapped.
//   navLinks.querySelectorAll('a').forEach(function (link) {
//     link.addEventListener('click', function () {
//       document.body.classList.remove('nav-open');
//       navToggle.setAttribute('aria-expanded', 'false');
//     });
//   });
// }


// /* ----------------------------------------------------------------
//    3. CONTACT FORM — simple confirmation message
//    No backend here, so we just confirm the required fields are
//    filled and show a friendly status message in their place.
//    ---------------------------------------------------------------- */
// function setupContactForm() {
//   const form = document.getElementById('contactForm');
//   const status = document.getElementById('formStatus');
//   if (!form || !status) return;

//   form.addEventListener('submit', function (event) {
//     event.preventDefault();

//     const name = form.name.value.trim();
//     const email = form.email.value.trim();

//     if (!name || !email) {
//       status.textContent = 'Please fill in your name and email.';
//       status.style.color = '#E4572E';
//       return;
//     }

//     status.textContent = 'Thanks, ' + name + '! We\'ll get back to you at ' + email + ' soon.';
//     status.style.color = '';
//     form.reset();
//   });
// }




/* ==============================================================
   PULSE FITNESS CLUB — SCRIPT.JS (extended)
   Original features:  1. Theme toggle  2. Mobile nav  3. Contact form
   New features:       4. Header shadow + back-to-top
                       5. Scroll-reveal animation
                       6. Stats count-up (home)
                       7. Schedule filter + "today" highlight
                       8. FAQ search (about)
                       9. BMI + calorie calculator (gym)
   Every feature is independent and exits quietly if its page
   elements aren't present. No HTML changes needed.
   ============================================================== */

document.addEventListener('DOMContentLoaded', function () {
  injectStyles();
  setupThemeToggle();
  setupMobileNav();
  setupContactForm();
  setupHeaderAndTopButton();
  setupReveal();
  setupStatCounters();
  setupScheduleTools();
  setupFaqSearch();
  setupHealthCalculator();
});

/* ---------- helpers ---------- */
function store(key, value) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, value);
  } catch (e) { return null; }
}

function injectStyles() {
  const css = `
    .site-header.is-scrolled{box-shadow:0 4px 18px rgba(0,0,0,.18)}
    .to-top{position:fixed;right:1rem;bottom:1rem;width:44px;height:44px;border-radius:50%;
      border:0;background:var(--ember,#E4572E);color:#fff;font-size:1.25rem;cursor:pointer;
      opacity:0;pointer-events:none;transform:translateY(10px);transition:.25s;z-index:50}
    .to-top.is-visible{opacity:1;pointer-events:auto;transform:none}
    .reveal{opacity:0;transform:translateY(24px);transition:opacity .6s ease,transform .6s ease}
    .reveal.is-in{opacity:1;transform:none}
    @media (prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}}
    .tool-bar{display:flex;flex-wrap:wrap;gap:.5rem;margin:0 0 1rem}
    .tool-btn{padding:.45rem .9rem;border-radius:999px;border:1px solid currentColor;
      background:transparent;color:inherit;font:inherit;cursor:pointer}
    .tool-btn[aria-pressed="true"]{background:var(--ember,#E4572E);border-color:var(--ember,#E4572E);color:#fff}
    .schedule-table .is-dim{opacity:.2}
    .schedule-table .is-today{outline:2px solid var(--ember,#E4572E);outline-offset:-2px}
    .faq-search{width:100%;max-width:420px;padding:.7rem 1rem;margin-bottom:1rem;
      border:1px solid currentColor;border-radius:8px;font:inherit;background:transparent;color:inherit}
    .faq-empty{opacity:.7;font-style:italic}
    .calc-card{max-width:640px;margin:0 auto;padding:1.5rem;border:1px solid currentColor;border-radius:12px}
    .calc-card form{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
    .calc-card label{display:flex;flex-direction:column;font-size:.85rem;gap:.25rem}
    .calc-card input,.calc-card select{padding:.55rem;font:inherit;border-radius:6px;border:1px solid currentColor;background:transparent;color:inherit}
    .calc-card button{grid-column:1/-1}
    .calc-result{margin-top:1rem;min-height:1.5em}
    @media (max-width:520px){.calc-card form{grid-template-columns:1fr}}
  `;
  const tag = document.createElement('style');
  tag.textContent = css;
  document.head.appendChild(tag);
}

/* ---------------- 1. THEME TOGGLE ---------------- */
function setupThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;
  const iconSpan = toggleBtn.querySelector('.theme-icon');
  const body = document.body;

  function apply(dark) {
    if (dark) body.setAttribute('data-theme', 'dark');
    else body.removeAttribute('data-theme');
    iconSpan.textContent = dark ? '🌙' : '☀️';
    toggleBtn.setAttribute('aria-label', dark ? 'Switch to day mode' : 'Switch to night mode');
  }

  const saved = store('pulse-theme');
  // No saved choice yet? Follow the visitor's system setting.
  const prefersDark = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
  apply(saved ? saved === 'dark' : prefersDark);

  toggleBtn.addEventListener('click', function () {
    const goDark = body.getAttribute('data-theme') !== 'dark';
    apply(goDark);
    store('pulse-theme', goDark ? 'dark' : 'light');
  });
}

/* ---------------- 2. MOBILE NAV ---------------- */
function setupMobileNav() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!navToggle || !navLinks) return;

  function setOpen(open) {
    document.body.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  navToggle.addEventListener('click', function () {
    setOpen(!document.body.classList.contains('nav-open'));
  });
  navLinks.querySelectorAll('a').forEach(function (l) {
    l.addEventListener('click', function () { setOpen(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
}

/* ---------------- 3. CONTACT FORM ---------------- */
function setupContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  const emailOk = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); };
  const phoneOk = function (v) { return v === '' || /^[+\d][\d\s-]{7,14}$/.test(v); };

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();

    let error = '';
    if (!name) error = 'Please enter your name.';
    else if (!emailOk(email)) error = 'Please enter a valid email address.';
    else if (!phoneOk(phone)) error = 'That phone number doesn\'t look right.';

    if (error) {
      status.textContent = error;
      status.style.color = '#E4572E';
      return;
    }
    status.textContent = 'Thanks, ' + name + '! We\'ll get back to you at ' + email + ' soon.';
    status.style.color = '';
    form.reset();
  });
}

/* ---------------- 4. HEADER SHADOW + BACK TO TOP ---------------- */
function setupHeaderAndTopButton() {
  const header = document.querySelector('.site-header');
  const btn = document.createElement('button');
  btn.className = 'to-top';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Back to top');
  btn.textContent = '↑';
  document.body.appendChild(btn);

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 10);
    btn.classList.toggle('is-visible', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------------- 5. SCROLL REVEAL ---------------- */
function setupReveal() {
  if (!('IntersectionObserver' in window)) return;
  const targets = document.querySelectorAll(
    '.why-card, .facility-card, .feature-card, .trainer-card, .testimonial-card, .plan-card, .faq-item'
  );
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 80 + 'ms';
    io.observe(el);
  });
}

/* ---------------- 6. STATS COUNT-UP (home) ---------------- */
function setupStatCounters() {
  const nums = document.querySelectorAll('#stats .stat-num');
  if (!nums.length || !('IntersectionObserver' in window)) return;
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function run(el) {
    const m = el.textContent.trim().match(/^([\d,]+)(.*)$/);
    if (!m) return;
    const target = parseInt(m[1].replace(/,/g, ''), 10);
    const suffix = m[2];
    if (reduce) return;
    const start = performance.now(), dur = 1400;
    (function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-IN') + suffix;
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }

  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
    });
  }, { threshold: 0.6 });
  nums.forEach(function (n) { io.observe(n); });
}

/* ---------------- 7. SCHEDULE FILTER + TODAY ---------------- */
function setupScheduleTools() {
  const table = document.querySelector('.schedule-table');
  if (!table) return;

  // Highlight today's column (Mon=1 ... Sat=6; Sunday has no classes)
  const day = new Date().getDay();
  if (day >= 1 && day <= 6) {
    table.querySelectorAll('tr').forEach(function (row) {
      const cell = row.children[day];
      if (cell) cell.classList.add('is-today');
    });
  }

  // Filter buttons
  const filters = [
    { label: 'All', sel: null },
    { label: 'Gym & Courts', sel: '.slot-energy' },
    { label: 'Studio & Meditation', sel: '.slot-calm' }
  ];
  const bar = document.createElement('div');
  bar.className = 'tool-bar';
  bar.setAttribute('role', 'group');
  bar.setAttribute('aria-label', 'Filter schedule');

  filters.forEach(function (f, i) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tool-btn';
    b.textContent = f.label;
    b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    b.addEventListener('click', function () {
      bar.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      table.querySelectorAll('.slot-energy, .slot-calm').forEach(function (s) {
        s.classList.toggle('is-dim', !!f.sel && !s.matches(f.sel));
      });
    });
    bar.appendChild(b);
  });

  const wrap = table.closest('.table-wrap') || table;
  wrap.parentNode.insertBefore(bar, wrap);
}

/* ---------------- 8. FAQ SEARCH (about) ---------------- */
function setupFaqSearch() {
  const list = document.querySelector('.faq-list');
  if (!list) return;
  const items = Array.from(list.querySelectorAll('.faq-item'));

  const input = document.createElement('input');
  input.type = 'search';
  input.className = 'faq-search';
  input.placeholder = 'Search questions…';
  input.setAttribute('aria-label', 'Search frequently asked questions');

  const empty = document.createElement('p');
  empty.className = 'faq-empty';
  empty.hidden = true;
  empty.textContent = 'No matching questions. Try the Contact page and ask us directly.';

  list.parentNode.insertBefore(input, list);
  list.appendChild(empty);

  input.addEventListener('input', function () {
    const q = input.value.trim().toLowerCase();
    let shown = 0;
    items.forEach(function (it) {
      const match = !q || it.textContent.toLowerCase().includes(q);
      it.hidden = !match;
      if (match) shown++;
      if (q && match) it.open = true; else if (!q) it.open = false;
    });
    empty.hidden = shown !== 0;
  });
}

/* ---------------- 9. BMI + CALORIE CALCULATOR (gym) ---------------- */
function setupHealthCalculator() {
  if (!document.getElementById('gym-heading')) return;
  const anchor = document.querySelector('.pulse-divider') || document.querySelector('.cta-banner');
  if (!anchor) return;

  const section = document.createElement('section');
  section.className = 'section section-neutral';
  section.setAttribute('aria-labelledby', 'calc-heading');
  section.innerHTML =
    '<div class="container">' +
      '<p class="eyebrow mono">Know your numbers</p>' +
      '<h2 id="calc-heading" class="section-title">BMI &amp; CALORIE CALCULATOR</h2>' +
      '<div class="calc-card">' +
        '<form id="calcForm" novalidate>' +
          '<label>Height (cm)<input type="number" name="h" min="100" max="250" required></label>' +
          '<label>Weight (kg)<input type="number" name="w" min="30" max="300" required></label>' +
          '<label>Age<input type="number" name="a" min="14" max="90" required></label>' +
          '<label>Sex<select name="s"><option value="m">Male</option><option value="f">Female</option></select></label>' +
          '<label style="grid-column:1/-1">Activity level<select name="act">' +
            '<option value="1.2">Mostly sitting</option>' +
            '<option value="1.375">Light (1–3 sessions/week)</option>' +
            '<option value="1.55" selected>Moderate (3–5 sessions/week)</option>' +
            '<option value="1.725">Heavy (6–7 sessions/week)</option>' +
          '</select></label>' +
          '<button type="submit" class="btn btn-primary">Calculate</button>' +
        '</form>' +
        '<p class="calc-result" id="calcResult" role="status" aria-live="polite"></p>' +
        '<p style="font-size:.8rem;opacity:.7">General estimate only, not medical advice.</p>' +
      '</div>' +
    '</div>';
  anchor.parentNode.insertBefore(section, anchor);

  const form = section.querySelector('#calcForm');
  const out = section.querySelector('#calcResult');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const h = parseFloat(form.h.value), w = parseFloat(form.w.value), a = parseFloat(form.a.value);
    if (!(h >= 100 && h <= 250 && w >= 30 && w <= 300 && a >= 14 && a <= 90)) {
      out.textContent = 'Please enter realistic height, weight and age.';
      return;
    }
    const bmi = w / Math.pow(h / 100, 2);
    const cat = bmi < 18.5 ? 'underweight' : bmi < 25 ? 'healthy range' : bmi < 30 ? 'overweight range' : 'obese range';
    // Mifflin-St Jeor
    const bmr = 10 * w + 6.25 * h - 5 * a + (form.s.value === 'm' ? 5 : -161);
    const tdee = Math.round(bmr * parseFloat(form.act.value));
    out.innerHTML = 'BMI <strong>' + bmi.toFixed(1) + '</strong> (' + cat + '). ' +
      'Maintenance ≈ <strong>' + tdee.toLocaleString('en-IN') + ' kcal/day</strong>. ' +
      'Roughly ' + (tdee - 400).toLocaleString('en-IN') + ' to lose, ' +
      (tdee + 300).toLocaleString('en-IN') + ' to gain.';
  });
}