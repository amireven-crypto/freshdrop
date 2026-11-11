/* FreshDrop Apple-style preview motion. Visual only — no cart or content changes.
   Adapts motion-anything recipes fade-content, xyz-fade-up, kinetic-headline, blur-text.
   Respects prefers-reduced-motion. */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) document.documentElement.classList.add('ap-intro');

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    if (reduce) return;
    setTimeout(function () { document.documentElement.classList.remove('ap-intro'); }, 2400);

    var extra = document.querySelectorAll(
      '.ad-video, .ad-video__copy, .news-card, .story-card, .about-hero, .about-pillars, .legal h1, .legal h2, .nf, .ship-bar, .pd .gallery, .cart-layout .line, .summary'
    );
    if (!extra.length) return;
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(extra, function (el) { el.classList.add('reveal', 'in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    Array.prototype.forEach.call(extra, function (el, i) {
      if (el.dataset.apRv) return;
      el.dataset.apRv = '1';
      var r = el.getBoundingClientRect();
      if (r.top < (window.innerHeight || 800) * 0.92) {
        el.classList.add('reveal', 'in');
        return;
      }
      el.classList.add('reveal');
      el.style.transitionDelay = ((i % 5) * 60) + 'ms';
      io.observe(el);
    });
  });
})();
