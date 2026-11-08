/* FreshDrop × Apple-style motion: shrinking nav, hero parallax, reveal cleanup. Visual only. */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) document.documentElement.classList.add('apl-intro');
  document.addEventListener('DOMContentLoaded', function () {
    var hdr = document.querySelector('header.site');
    var art = document.querySelector('.hero-art');
    var copy = document.querySelector('.hero-grid > div:first-child');
    var hero = document.querySelector('.hero');
    var ticking = false;
    function frame() {
      ticking = false;
      var y = window.scrollY || 0;
      if (hdr) hdr.classList.toggle('is-scrolled', y > 12);
      if (reduce || !hero || !art) return;
      var h = hero.offsetHeight || 1;
      if (y > h * 1.2) return;
      var p = Math.min(1, Math.max(0, y / h));
      art.style.setProperty('--py', (y * 0.12).toFixed(1) + 'px');
      art.style.setProperty('--ps', (1 - p * 0.07).toFixed(4));
      if (copy && innerWidth > 820) { copy.style.opacity = (1 - p * 0.7).toFixed(3); copy.style.transform = 'translate3d(0,' + (y * -0.06).toFixed(1) + 'px,0)'; }
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
    addEventListener('scroll', onScroll, {passive: true});
    addEventListener('resize', onScroll, {passive: true});
    frame();
    /* once an element has revealed, hand it back to its normal hover transitions */
    document.addEventListener('transitionend', function (e) {
      var t = e.target;
      if (e.propertyName === 'opacity' && t.classList && t.classList.contains('reveal') && t.classList.contains('in')) {
        t.classList.remove('reveal', 'in'); t.style.transitionDelay = '';
      }
    });
    /* stop the intro classes from re-firing after it has played */
    setTimeout(function () { document.documentElement.classList.remove('apl-intro'); }, 2200);
  });
})();
