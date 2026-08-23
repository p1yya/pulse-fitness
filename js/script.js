/* ==============================================================
   PULSE FITNESS CLUB — SCRIPT.JS
   Kept intentionally minimal for Evaluation 1 — HTML + CSS do
   almost all of the work (structure, responsiveness, the FAQ
   accordion via native <details>). Three small, independent
   features live here:

   1. Day / Night theme toggle   (remembered with localStorage)
   2. Mobile hamburger menu open/close
   3. Contact form: fake "submit" confirmation message

   Advanced features (BMI/calorie calculators, workout generator,
   schedule filtering, booking system, more DOM work) are planned
   for Evaluation 2 and intentionally left out of this file.

   Each function is independent — deleting one doesn't break the
   others.
   ============================================================== */

document.addEventListener('DOMContentLoaded', function () {
  setupThemeToggle();
  setupMobileNav();
  setupContactForm();
});


/* ----------------------------------------------------------------
   1. DAY / NIGHT THEME TOGGLE
   The chosen theme is saved in localStorage so it stays the same
   across every page of the site, not just the one it was set on.
   ---------------------------------------------------------------- */
function setupThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;

  const iconSpan = toggleBtn.querySelector('.theme-icon');
  const body = document.body;

  const savedTheme = localStorage.getItem('pulse-theme');
  if (savedTheme === 'dark') {
    body.setAttribute('data-theme', 'dark');
    iconSpan.textContent = '🌙';
    toggleBtn.setAttribute('aria-label', 'Switch to day mode');
  }

  toggleBtn.addEventListener('click', function () {
    const isDark = body.getAttribute('data-theme') === 'dark';

    if (isDark) {
      body.removeAttribute('data-theme');
      iconSpan.textContent = '☀️';
      toggleBtn.setAttribute('aria-label', 'Switch to night mode');
      localStorage.setItem('pulse-theme', 'light');
    } else {
      body.setAttribute('data-theme', 'dark');
      iconSpan.textContent = '🌙';
      toggleBtn.setAttribute('aria-label', 'Switch to day mode');
      localStorage.setItem('pulse-theme', 'dark');
    }
  });
}


/* ----------------------------------------------------------------
   2. MOBILE HAMBURGER MENU
   ---------------------------------------------------------------- */
function setupMobileNav() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', function () {
    const isOpen = document.body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  // Close the menu automatically once a link is tapped.
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      document.body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}


/* ----------------------------------------------------------------
   3. CONTACT FORM — simple confirmation message
   No backend here, so we just confirm the required fields are
   filled and show a friendly status message in their place.
   ---------------------------------------------------------------- */
function setupContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();

    if (!name || !email) {
      status.textContent = 'Please fill in your name and email.';
      status.style.color = '#E4572E';
      return;
    }

    status.textContent = 'Thanks, ' + name + '! We\'ll get back to you at ' + email + ' soon.';
    status.style.color = '';
    form.reset();
  });
}