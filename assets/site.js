/* JHC Coaching — shared site behaviors. Each block is guarded so it no-ops
   on pages that don't have the relevant elements. */
(function () {
  // mobile nav
  var burger = document.getElementById('burger'), links = document.getElementById('navlinks');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
    links.addEventListener('click', function (e) { if (e.target.tagName === 'A') links.classList.remove('open'); });
  }

  // scroll-reveal
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // testimonial carousel controls
  (function () {
    var car = document.getElementById('tcar'); if (!car) return;
    function step() { var k = car.children; return k.length > 1 ? (k[1].offsetLeft - k[0].offsetLeft) : car.clientWidth; }
    var pv = document.getElementById('tprev'), nx = document.getElementById('tnext');
    if (pv) pv.addEventListener('click', function () { car.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (nx) nx.addEventListener('click', function () { car.scrollBy({ left: step(), behavior: 'smooth' }); });
  })();

  // hero typewriter (full text stays in HTML for SEO / reduced-motion)
  (function () {
    var h1 = document.querySelector('.hero-h1'); if (!h1) return;
    var segs = [].slice.call(h1.querySelectorAll('[data-tw]')); if (!segs.length) return;
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var data = segs.map(function (el) { var t = el.textContent; el.textContent = ''; return { el: el, t: t }; });
    var si = 0, ci = 0;
    (function tick() {
      if (si >= data.length) return;
      var seg = data[si];
      if (ci < seg.t.length) { seg.el.textContent += seg.t.charAt(ci++); setTimeout(tick, 52); }
      else { si++; ci = 0; setTimeout(tick, 140); }
    })();
  })();
})();

// ======================= VIDEO PASSWORD GATE =======================
// Video thumbnails are public; playing one asks for the JHC password
// (same as athlete onboarding). Correct password opens the unlisted
// YouTube video and stays unlocked for the rest of the browser session.
(function () {
  var PW = 'jhctriathlon';
  var KEY = 'jhc-videos-unlocked';
  var links = [].slice.call(document.querySelectorAll('a.vthumb[href*="youtube.com/watch"]'));
  if (!links.length) return;

  function unlocked() { try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; } }

  var modal = null, pendingUrl = '';
  function buildModal() {
    modal = document.createElement('div');
    modal.className = 'vgate';
    modal.innerHTML =
      '<div class="vgate-back"></div>' +
      '<div class="vgate-card" role="dialog" aria-modal="true" aria-label="Enter password to watch">' +
        '<div class="vgate-lock">🔒</div>' +
        '<h3>JHC videos are for the team</h3>' +
        '<p class="vgate-sub">Enter the password Jen shares with her athletes and community to watch.</p>' +
        '<input type="password" class="field" id="vgatepw" placeholder="Enter password" autocomplete="off">' +
        '<div class="vgate-msg" id="vgatemsg" hidden>That password is not right. Check with Jen.</div>' +
        '<div class="vgate-row">' +
          '<button type="button" class="btn ghost" id="vgatecancel">Cancel</button>' +
          '<button type="button" class="btn primary" id="vgatego">Watch video →</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);
    modal.querySelector('.vgate-back').addEventListener('click', close);
    modal.querySelector('#vgatecancel').addEventListener('click', close);
    modal.querySelector('#vgatego').addEventListener('click', tryGo);
    modal.querySelector('#vgatepw').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') tryGo();
      if (e.key === 'Escape') close();
    });
  }
  function open(url) {
    pendingUrl = url;
    if (!modal) buildModal();
    modal.classList.add('on');
    var pw = modal.querySelector('#vgatepw');
    pw.value = ''; pw.style.borderColor = '';
    modal.querySelector('#vgatemsg').hidden = true;
    setTimeout(function () { pw.focus(); }, 60);
  }
  function close() { if (modal) modal.classList.remove('on'); }
  function tryGo() {
    var pw = modal.querySelector('#vgatepw');
    if ((pw.value || '').trim().toLowerCase() === PW) {
      try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
      close();
      window.open(pendingUrl, '_blank', 'noopener');
    } else {
      pw.style.borderColor = 'var(--rose-deep)';
      modal.querySelector('#vgatemsg').hidden = false;
    }
  }

  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (unlocked()) return;              // already unlocked this session: normal click-through
      e.preventDefault();
      open(a.href);
    });
  });
})();
