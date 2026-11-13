/* FreshDrop cinema layer (13 Nov 2026). Visual + one configurator; the cart, prices and checkout stay in app.js.
   - home: cinematic 3D hero (exploded mount snaps together, floating Y-spin, particle hills, glowing shapes,
     giant outline word), plus a "spin" section: drag-to-rotate product with its real colour variants.
   - every page: section curtains, staggered card rise, page transitions (CSS).
   3D is lazy: loaded after the page has loaded, only with WebGL, not on Save-Data; a photo is the fallback. */
(function () {
  var mqReduce = matchMedia('(prefers-reduced-motion: reduce)'), mqDark = matchMedia('(prefers-color-scheme: dark)');
  var reduce = mqReduce.matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var base = (document.currentScript && document.currentScript.src) || location.href;
  var MOD = new URL('cinema3d.js?v=20261113', base).href;
  var PID = 'magnetic-dashboard-mount';
  var SW = {black: '#23252b', silver: 'linear-gradient(135deg,#f1f2f5,#aeb2ba)', grey: '#7a7f89'};
  if (!reduce) document.documentElement.classList.add('cine-motion');

  function hasGL() {
    try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); }
    catch (e) { return false; }
  }
  var loader = null;
  function load3d() { if (!loader) loader = import(MOD); return loader; }
  function whenIdle(fn) {
    // desktop: shortly after load. Phones/tablets: on the first touch, scroll or key, or 3.5 s after load,
    // so the 3D bundle never competes with the first paint on a slow phone.
    var desk = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)').matches, done = false;
    var run = function () { if (done) return; done = true; (window.requestIdleCallback || function (f) { setTimeout(f, 200); })(fn, {timeout: 1800}); };
    var go = function () {
      if (desk) { run(); return; }
      ['pointerdown', 'touchstart', 'scroll', 'keydown'].forEach(function (ev) { addEventListener(ev, run, {once: true, passive: true}); });
      setTimeout(run, 3500);
    };
    if (document.readyState === 'complete') go(); else addEventListener('load', go, {once: true});
  }
  function visible(el, cb, margin) {
    if (!('IntersectionObserver' in window)) { cb(true); return; }
    new IntersectionObserver(function (es) { es.forEach(function (e) { cb(e.isIntersecting); }); }, {rootMargin: margin || '0px'}).observe(el);
  }
  function product() { try { return typeof byId === 'function' ? byId(PID) : null; } catch (e) { return null; } }
  function money(n) { try { return typeof eur === 'function' ? eur(n) : '€' + n.toFixed(2); } catch (e) { return ''; } }
  function escH(s) { return String(s).replace(/[&<>"']/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]; }); }

  /* ---------- hero ---------- */
  function buildHero() {
    var hero = document.querySelector('body[data-page="home"] .hero'); if (!hero || hero.classList.contains('cine')) return null;
    var art = hero.querySelector('.hero-art'); if (!art) return null;
    hero.classList.add('cine'); if (!reduce) hero.classList.add('cine-enter');
    art.setAttribute('aria-hidden', 'true');
    art.innerHTML = '<img class="cine-still" src="assets/img/' + PID + '.webp" alt="" width="800" height="800" decoding="async" fetchpriority="high">';
    hero.insertAdjacentHTML('afterbegin', '<span class="cine-word" aria-hidden="true">FRESH</span><canvas class="cine-canvas" aria-hidden="true"></canvas>');
    var pause = document.createElement('button'); pause.type = 'button'; pause.className = 'cine-pause'; pause.hidden = true;
    pause.setAttribute('aria-pressed', 'false'); pause.textContent = 'Pause motion'; hero.appendChild(pause);
    if (!reduce && matchMedia('(hover: hover) and (pointer: fine)').matches) {
      hero.addEventListener('pointermove', function (e) { var r = hero.getBoundingClientRect(); hero.style.setProperty('--wx', ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3)); }, {passive: true});
    }
    return {hero: hero, art: art, canvas: hero.querySelector('.cine-canvas'), pause: pause};
  }

  /* ---------- spin configurator ---------- */
  function buildSpin(after) {
    var p = product(); if (!p || !p.variants || document.getElementById('spin')) return null;
    var opts = p.variants.opts.filter(function (o) { return SW[o.id]; }); if (!opts.length) return null;
    var first = opts[0];
    var s = document.createElement('section'); s.className = 'block cine-spin'; s.id = 'spin'; s.setAttribute('aria-labelledby', 'spin-h');
    s.innerHTML = '<div class="wrap spin-grid">' +
      '<div class="spin-stage" tabindex="0" role="group" aria-roledescription="3D viewer" aria-label="' + escH(p.name) + ' in 3D. Drag, or use the left and right arrow keys, to turn it.">' +
        '<img class="cine-still" src="assets/img/' + PID + '.webp" alt="' + escH(p.name) + '" width="800" height="800" loading="lazy" decoding="async">' +
        '<canvas class="cine-canvas" aria-hidden="true"></canvas><p class="spin-hint" aria-hidden="true">Drag to turn ↔</p></div>' +
      '<div class="spin-copy">' +
        '<h2 id="spin-h">Spin it. Pick a finish.</h2>' +
        '<p class="lead">' + escH(p.short) + '</p>' +
        '<p class="spin-name">' + escH(p.name) + '</p><p class="spin-price">' + money(p.price) + '</p>' +
        '<fieldset class="swatches"><legend>Colour: <b class="spin-sel">' + escH(first.n) + '</b></legend><div class="row">' +
          opts.map(function (o, i) { return '<label class="swatch"><input type="radio" name="spin-colour" value="' + escH(o.id) + '"' + (i ? '' : ' checked') + '><i style="background:' + SW[o.id] + '"></i><span>' + escH(o.n) + '</span></label>'; }).join('') +
        '</div></fieldset>' +
        '<div class="spin-actions"><button type="button" class="btn btn-primary btn-xl" data-act="add" data-id="' + escH(PID + '::' + first.id) + '">Add to cart · ' + money(p.price) + '</button>' +
          '<a class="btn btn-ghost" href="product.html?id=' + escH(PID) + '">View details</a></div>' +
        '<div class="spin-tools"><button type="button" data-explode aria-pressed="false">Show the parts</button><button type="button" data-reset>Reset view</button></div>' +
      '</div></div>';
    after.insertAdjacentElement('afterend', s);
    return s;
  }

  function wireSpin(s, ref) {
    var stage = s.querySelector('.spin-stage'), sel = s.querySelector('.spin-sel'), add = s.querySelector('[data-act="add"]');
    var ex = s.querySelector('[data-explode]');
    s.addEventListener('change', function (e) {
      if (e.target.name !== 'spin-colour') return;
      var v = e.target.value; add.dataset.id = PID + '::' + v;
      sel.textContent = e.target.parentNode.textContent.trim();
      if (ref.s) ref.s.setFinish(v);
    });
    ex.addEventListener('click', function () { var on = ex.getAttribute('aria-pressed') !== 'true'; ex.setAttribute('aria-pressed', on ? 'true' : 'false'); if (ref.s) ref.s.setExplode(on); });
    s.querySelector('[data-reset]').addEventListener('click', function () { ex.setAttribute('aria-pressed', 'false'); if (ref.s) ref.s.reset(); });
    stage.addEventListener('keydown', function (e) {
      if (!ref.s) return;
      if (e.key === 'ArrowLeft') { ref.s.rotateBy(-0.26); e.preventDefault(); }
      else if (e.key === 'ArrowRight') { ref.s.rotateBy(0.26); e.preventDefault(); }
    });
  }

  /* ---------- curtains + card rise (all pages) ---------- */
  function curtains() {
    if (reduce || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('cine-on'); io.unobserve(e.target); } }); }, {rootMargin: '0px 0px -12% 0px'});
    document.querySelectorAll('#main > section.block, #main > .ad-video, #main > section.news').forEach(function (el) { el.classList.add('cine-curtain'); io.observe(el); });
  }
  function cards() {
    if (reduce || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      var k = 0;
      es.forEach(function (e) { if (e.isIntersecting) { var c = e.target; c.style.setProperty('--i', k++ % 6); c.classList.add('cine-rise'); io.unobserve(c); c.addEventListener('animationend', function () { c.classList.remove('cine-rise'); }, {once: true}); } });
    }, {rootMargin: '0px 0px -6% 0px'});
    var seen = new WeakSet();
    function scan() { document.querySelectorAll('.card').forEach(function (c) { if (!seen.has(c)) { seen.add(c); var r = c.getBoundingClientRect(); if (r.top > innerHeight) io.observe(c); } }); }
    scan(); new MutationObserver(scan).observe(document.getElementById('main') || document.body, {childList: true, subtree: true});
  }

  function hideStill(box) { var im = box.querySelector('.cine-still'); if (im) setTimeout(function () { im.hidden = true; }, 750); }
  function still(s) { // no WebGL / Save-Data: the photo stays, the 3D-only controls go
    s.querySelector('.spin-tools').hidden = true; s.querySelector('.spin-hint').hidden = true;
    var st = s.querySelector('.spin-stage'); st.removeAttribute('tabindex'); st.removeAttribute('role'); st.removeAttribute('aria-roledescription'); st.removeAttribute('aria-label');
    var h2 = s.querySelector('#spin-h'); if (h2) h2.textContent = 'Pick a finish.';
  }
  function start() {
    var h = buildHero();
    var spin = h ? buildSpin(h.hero) : null;
    var ad = document.getElementById('ad-video');
    if (h && spin && ad) spin.insertAdjacentElement('afterend', ad);   // the video ad now follows the 3D story
    curtains(); cards();
    var ref = {s: null};
    if (spin) wireSpin(spin, ref);
    if (!h || saveData || !hasGL()) { if (spin) still(spin); return; }

    whenIdle(function () {
      load3d().then(function (m) {
        var hs = m.createStage(h.canvas, {mode: 'hero', reduce: reduce, dark: mqDark.matches, anchor: h.art, finish: 'silver'});
        h.hero.classList.add('cine-live'); hideStill(h.art);
        var heroVis = true, paused = false;
        if (!reduce) { h.pause.hidden = false; }
        h.pause.addEventListener('click', function () { paused = !paused; h.pause.setAttribute('aria-pressed', paused ? 'true' : 'false'); h.pause.textContent = paused ? 'Play motion' : 'Pause motion'; hs.setRunning(heroVis && !paused); });
        visible(h.hero, function (v) { heroVis = v; hs.setRunning(v && !paused && !document.hidden); });
        document.addEventListener('visibilitychange', function () { hs.setRunning(heroVis && !paused && !document.hidden); });
        var ss = null;
        if (spin) {
          var cv = spin.querySelector('.cine-canvas'), stage = spin.querySelector('.spin-stage'), made = false, sVis = false;
          visible(spin, function (v) {
            sVis = v;
            if (v && !made) {
              made = true;
              var chk = spin.querySelector('input[name="spin-colour"]:checked');
              ss = m.createStage(cv, {mode: 'spin', reduce: reduce, dark: mqDark.matches, input: stage, finish: chk ? chk.value : 'black'});
              stage.classList.add('cine-live'); hideStill(stage); ref.s = ss;
            }
            if (ss) ss.setRunning(v && !document.hidden);
          }, '200px 0px');
          document.addEventListener('visibilitychange', function () { if (ss) ss.setRunning(sVis && !document.hidden); });
        }
        var onScheme = function () { hs.setDark(mqDark.matches); if (ss) ss.setDark(mqDark.matches); };
        mqDark.addEventListener ? mqDark.addEventListener('change', onScheme) : mqDark.addListener(onScheme);
      }).catch(function () { if (spin) still(spin); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
