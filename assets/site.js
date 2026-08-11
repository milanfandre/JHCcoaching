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
