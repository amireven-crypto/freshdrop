/* FreshDrop Apple.com motion (keep-colors preview). Visual only.
   Snappy fade-content / xyz-fade-up / kinetic-headline / page-fade.
   Reveals stay visible if JS fails. prefers-reduced-motion. */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var easeOk = !reduce;
  if (easeOk) document.documentElement.classList.add('ap-intro');

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function capDelay(el) {
    var raw = el.style.transitionDelay || '';
    var ms = /ms$/i.test(raw) ? parseFloat(raw) : /s$/i.test(raw) ? parseFloat(raw) * 1000 : 0;
    if (ms > 60) el.style.transitionDelay = '60ms';
  }

  function nearViewport(el) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || 800;
    return r.top < vh + 160;
  }

  ready(function () {
    if (reduce) return;
    setTimeout(function () { document.documentElement.classList.remove('ap-intro'); }, 600);

    var selectors = '.sec-head, .card, .cat-tile, .bundle, .trust > div, .reviews-empty, .deal-strip, .ad-video, .ad-video__copy, .news-card, .story-card, .about-hero, .about-pillars, .legal h1, .legal h2, .nf, .ship-box, .pd .gallery, .summary';

    function arm(el, i) {
      if (el.dataset.apRv === '1' && el.classList.contains('in')) { capDelay(el); return; }
      capDelay(el);
      if (nearViewport(el)) {
        el.classList.add('reveal', 'in');
        el.dataset.apRv = '1';
        return;
      }
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
      var ms = parseFloat(el.style.transitionDelay) || 0;
      if (!el.style.transitionDelay) el.style.transitionDelay = ((i % 4) * 40) + 'ms';
      else if (ms > 60) el.style.transitionDelay = '60ms';
      el.dataset.apRv = '1';
      if (io) io.observe(el);
    }

    var io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('in');
          io.unobserve(e.target);
        });
      }, { threshold: 0.01, rootMargin: '80px 0px 30% 0px' });
    }

    function scan() {
      var list = document.querySelectorAll(selectors);
      Array.prototype.forEach.call(list, arm);
      document.querySelectorAll('.reveal').forEach(capDelay);
    }

    scan();
    /* Arm hiding only after in-view nodes already have .in, so a JS failure never leaves content at opacity 0. */
    document.documentElement.classList.add('ap-motion');
    if (io) scan();

    var main = document.getElementById('main');
    if (main && window.MutationObserver) {
      var t = null;
      new MutationObserver(function () {
        if (t) return;
        t = setTimeout(function () { t = null; scan(); }, 16);
      }).observe(main, { childList: true, subtree: true });
    }
  });
})();
