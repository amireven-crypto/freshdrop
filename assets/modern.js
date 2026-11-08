/* FreshDrop – modern layer: cursor sheen, hero storytelling var, sliding segmented control. Visual only. */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.addEventListener('DOMContentLoaded', function () {
    var main = document.getElementById('main');
    /* cursor-follow sheen (desktop only) */
    function tagSheen() { if (!fine || reduce) return; document.querySelectorAll('.card, .trust > div').forEach(function (el) { el.classList.add('fx-sheen'); }); }
    if (fine && !reduce) {
      document.addEventListener('pointermove', function (e) {
        var el = e.target.closest && e.target.closest('.fx-sheen'); if (!el) return;
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      }, {passive: true});
    }
    /* hero scroll storytelling: progress 0..1 as --hp */
    var hero = document.querySelector('.hero');
    if (hero && !reduce) {
      var t = false;
      var upd = function () { t = false; var p = Math.min(1, Math.max(0, (scrollY || 0) / (hero.offsetHeight || 1))); hero.style.setProperty('--hp', p.toFixed(3)); };
      addEventListener('scroll', function () { if (!t) { t = true; requestAnimationFrame(upd); } }, {passive: true});
      upd();
    }
    /* sliding indicator for the category segmented control */
    function seg() {
      var row = document.getElementById('catmain'); if (!row) return;
      var ind = row.querySelector('.seg-ind');
      if (!ind) { ind = document.createElement('span'); ind.className = 'seg-ind'; ind.setAttribute('aria-hidden', 'true'); row.insertBefore(ind, row.firstChild); }
      var on = row.querySelector('.chip.on'); if (!on) { ind.style.width = '0'; return; }
      ind.style.width = on.offsetWidth + 'px'; ind.style.transform = 'translateX(' + on.offsetLeft + 'px)';
      if (!row.classList.contains('has-ind')) row.classList.add('has-ind');
      var l = on.offsetLeft - row.scrollLeft, w = row.clientWidth;
      if (l < 0 || l + on.offsetWidth > w) row.scrollTo({left: on.offsetLeft - (w - on.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth'});
    }
    var grid = null;
    function watchShop() {
      var row = document.getElementById('catmain'); grid = document.getElementById('pgrid');
      if (!row || row.dataset.segw) return; row.dataset.segw = 1;
      new MutationObserver(seg).observe(row, {attributes: true, subtree: true, attributeFilter: ['class']});
      addEventListener('resize', seg, {passive: true});
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(seg);
      seg();
      if (grid && !reduce) new MutationObserver(function () { grid.classList.remove('fd-swap'); void grid.offsetWidth; grid.classList.add('fd-swap'); }).observe(grid, {childList: true});
    }
    tagSheen(); watchShop();
    if (main) new MutationObserver(function () { tagSheen(); watchShop(); }).observe(main, {childList: true, subtree: true});
  });
})();
