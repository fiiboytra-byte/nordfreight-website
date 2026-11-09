/* NORDFREIGHT — shared behaviour */
(function () {
  'use strict';

  /* ---------- Shared header & footer (single source of truth) ---------- */
  const logo = `<svg viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#5fc4ec"/><path d="M10 28V12l10 10V12M24 12h6M24 20h6M24 28h6" stroke="#06101c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const header = `
  <div class="topbar"><div class="container">
    <div><span>📞 +1 (800) 555-0142</span><span>✉ ops@nordfreight.com</span></div>
    <div>24/7 Control Tower · ISO 9001 · ISO 28000 certified</div>
  </div></div>
  <header class="site-header"><div class="container nav">
    <a class="brand" href="index.html">${logo}<span>NORDFREIGHT<small>GLOBAL LOGISTICS</small></span></a>
    <nav class="nav-links" id="navLinks">
      <a href="index.html">Home</a>
      <a href="services.html">Services</a>
      <a href="tracking.html">Tracking</a>
      <a href="about.html">About</a>
      <a href="contact.html">Contact</a>
    </nav>
    <a class="btn btn-primary btn-sm" href="contact.html">Get a Quote</a>
    <button class="burger" id="burger" aria-label="Toggle menu"><span></span></button>
  </div></header>`;

  const footer = `
  <footer class="site-footer"><div class="container">
    <div class="foot-grid">
      <div>
        <a class="brand" href="index.html">${logo}<span>NORDFREIGHT</span></a>
        <p>Cold-chain, air, ocean and road freight engineered for reliability across 120+ countries.</p>
      </div>
      <div><h4>Services</h4><ul>
        <li><a href="services.html#air">Air Freight</a></li>
        <li><a href="services.html#ocean">Ocean Freight</a></li>
        <li><a href="services.html#road">Road Transport</a></li>
        <li><a href="services.html#cold">Cold Chain</a></li>
        <li><a href="services.html#warehouse">Warehousing</a></li>
      </ul></div>
      <div><h4>Company</h4><ul>
        <li><a href="about.html">About us</a></li>
        <li><a href="tracking.html">Track shipment</a></li>
        <li><a href="contact.html">Contact</a></li>
        <li><a href="contact.html">Careers</a></li>
      </ul></div>
      <div><h4>Headquarters</h4><ul>
        <li>120 Harbor Avenue, Suite 900</li>
        <li>Rotterdam, Netherlands</li>
        <li>+1 (800) 555-0142</li>
        <li>ops@nordfreight.com</li>
      </ul></div>
    </div>
    <div class="foot-bottom">
      <span>© <span id="year"></span> Nordfreight Logistics. All rights reserved.</span>
      <span><a href="#">Privacy</a> · <a href="#">Terms</a> · <a href="#">Cookies</a></span>
    </div>
  </div></footer>`;

  document.getElementById('site-header').innerHTML = header;
  document.getElementById('site-footer').innerHTML = footer;
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Active nav link ---------- */
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('#navLinks a').forEach(a => {
    if (a.getAttribute('href').toLowerCase() === page) a.classList.add('active');
  });

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('burger');
  const links = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.addEventListener('click', e => {
    if (e.target.tagName === 'A') { burger.classList.remove('open'); links.classList.remove('open'); }
  });

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- Counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, end = +el.dataset.count, suffix = el.dataset.suffix || '';
      const dur = 1600, t0 = performance.now();
      (function tick(t) {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(end * eased).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
      cio.unobserve(el);
    });
  }, { threshold: .5 });
  counters.forEach(c => cio.observe(c));

  /* ---------- Form validation (demo — wire to your backend) ---------- */
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      form.querySelectorAll('[required]').forEach(input => {
        const field = input.closest('.field');
        let valid = input.value.trim() !== '';
        if (valid && input.type === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
        field.classList.toggle('error', !valid);
        if (!valid) ok = false;
      });
      const alert = form.querySelector('.alert');
      if (!ok) { alert.className = 'alert bad'; alert.textContent = 'Please complete the highlighted fields.'; return; }

      /* TODO: replace with real submission, e.g.
         fetch('/api/quote', { method:'POST', body: new FormData(form) }) */
      alert.className = 'alert ok';
      alert.textContent = 'Thank you! Our team will reply within 2 business hours.';
      form.reset();
    });
  });

  /* ---------- Tracking demo ---------- */
  const trackForm = document.getElementById('trackForm');
  if (trackForm) {
    const result = document.getElementById('trackResult');
    const msg = document.getElementById('trackMsg');

    const steps = [
      ['Order received', 'Rotterdam, NL', -6],
      ['Picked up from shipper', 'Rotterdam, NL', -5],
      ['Departed origin terminal', 'Rotterdam, NL', -4],
      ['Customs cleared (export)', 'Rotterdam, NL', -3],
      ['In transit — Atlantic crossing', 'North Atlantic', -1],
      ['Arrived at destination hub', 'New York, US', 1],
      ['Out for delivery', 'New York, US', 2],
      ['Delivered', 'New York, US', 3]
    ];

    function fmt(offset) {
      const d = new Date(); d.setDate(d.getDate() + offset);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    trackForm.addEventListener('submit', e => {
      e.preventDefault();
      const id = document.getElementById('trackId').value.trim().toUpperCase();
      if (!/^NF\d{9}$/.test(id)) {
        result.classList.remove('show');
        msg.className = 'alert bad';
        msg.textContent = 'Invalid tracking number. Use the format NF123456789 (demo).';
        return;
      }
      msg.className = 'alert';
      /* Demo progress derived from the number — replace with a real API call. */
      const current = (parseInt(id.slice(-1), 10) % 5) + 3; // 3..7
      document.getElementById('rId').textContent = id;
      document.getElementById('rStatus').textContent = steps[current][0];
      document.getElementById('rEta').textContent = fmt(3);
      document.getElementById('rBar').style.width = Math.round(((current + 1) / steps.length) * 100) + '%';
      document.getElementById('rTimeline').innerHTML = steps.map((s, i) => {
        const cls = i < current ? 'done' : i === current ? 'now' : '';
        const when = i <= current ? fmt(s[2]) : 'Expected ' + fmt(s[2]);
        return `<div class="tl-item ${cls}"><h4>${s[0]}</h4><small>${s[1]} · ${when}</small></div>`;
      }).join('');
      result.classList.add('show');
      result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
})();
