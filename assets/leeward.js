/* FreshDrop × LEEWARD-style motion layer (own code, 15 Nov 2026).
   GSAP (free) + ScrollTrigger + Lenis, all self-hosted (CSP script-src 'self').
   Visual only: no prices, products, cart logic or texts are changed here.
   Everything stays readable without JS and with prefers-reduced-motion. */
(function () {
  'use strict';
  var d = document, html = d.documentElement, W = window;
  html.classList.add('lw');
  var reduce = W.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = W.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  var G = W.gsap, ST = W.ScrollTrigger, hasG = !!(G && ST);
  if (hasG) G.registerPlugin(ST);
  if (!reduce) html.classList.add('lw-motion');
  var ss = (function () { try { return W.sessionStorage; } catch (e) { return null; } })();
  var ssGet = function (k) { try { return ss && ss.getItem(k); } catch (e) { return null; } };
  var ssSet = function (k, v) { try { if (ss) { if (v == null) ss.removeItem(k); else ss.setItem(k, v); } } catch (e) {} };
  var rand = function (a, b) { return a + Math.random() * (b - a); };
  var shuffle = function (a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  var isHome = d.body && d.body.dataset.page === 'home';

  /* ---------------- pixel-square mask (crisp SVG mask frames) ---------------- */
  function maskURL(cols, rows, on) {
    var r = '';
    for (var i = 0; i < on.length; i++) { if (!on[i]) continue; var x = i % cols, y = (i / cols) | 0; r += '<rect x="' + x + '" y="' + y + '" width="1.04" height="1.04"/>'; }
    return 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + cols + ' ' + rows + '" preserveAspectRatio="none" fill="#fff">' + r + '</svg>') + '")';
  }
  function setMask(el, v) { el.style.webkitMaskImage = v; el.style.maskImage = v; el.style.webkitMaskSize = '100% 100%'; el.style.maskSize = '100% 100%'; el.style.webkitMaskRepeat = 'no-repeat'; el.style.maskRepeat = 'no-repeat'; }
  function clearMask(el) { el.style.webkitMaskImage = el.style.maskImage = el.style.webkitMaskSize = el.style.maskSize = el.style.webkitMaskRepeat = el.style.maskRepeat = ''; }
  function gridFor(el, base) { var r = el.getBoundingClientRect(), w = Math.max(1, r.width), h = Math.max(1, r.height); var cols = Math.max(3, Math.round(w / base)), rows = Math.max(2, Math.round(h / base)); return [Math.min(cols, 24), Math.min(rows, 16)]; }
  /* reveal: squares turn on in random order (show=true) or off (show=false) */
  function pxAnim(el, opt) {
    opt = opt || {};
    var g = opt.grid || gridFor(el, opt.size || 70), cols = g[0], rows = g[1], n = cols * rows;
    var order = shuffle(Array.from({length: n}, function (_, i) { return i; }));
    var on = new Array(n).fill(!opt.show), dur = opt.dur || 700, t0 = null, last = -1;
    setMask(el, maskURL(cols, rows, on));
    return new Promise(function (res) {
      function step(t) {
        if (t0 == null) t0 = t + (opt.delay || 0);
        var p = Math.max(0, Math.min(1, (t - t0) / dur)), k = Math.floor(p * p * (3 - 2 * p) * n);
        if (k !== last) { for (var i = last + 1; i <= k && i < n; i++) if (i >= 0) on[order[i]] = !!opt.show; last = k; setMask(el, maskURL(cols, rows, on)); }
        if (p < 1) requestAnimationFrame(step); else { if (opt.show) clearMask(el); res(); }
      }
      requestAnimationFrame(step);
    });
  }
  function pxArm(el, size) { var g = gridFor(el, size || 70); setMask(el, maskURL(g[0], g[1], new Array(g[0] * g[1]).fill(false))); el._lwGrid = g; el.dataset.lwPx = 'armed'; }

  /* ---------------- loader + page transitions ---------------- */
  var readyFired = false, readyCbs = [];
  function onReady(fn) { if (readyFired) fn(); else readyCbs.push(fn); }
  function fireReady() { if (readyFired) return; readyFired = true; html.classList.remove('lw-loading'); readyCbs.splice(0).forEach(function (f) { try { f(); } catch (e) {} }); }
  var cover = null;
  /* LEEWARD loader: a visible grid of flat cream squares; squares drop out in random order
     in step with the counter, the dark "Loading" panel slides down at 100. */
  function bandCols() { return innerWidth > 1100 ? 12 : innerWidth > 760 ? 8 : 4; }
  function makeCover(withPanel, startOn) {
    var el = d.createElement('div'); el.id = 'lw-loader'; el.setAttribute('aria-hidden', 'true');
    var cols = bandCols(), size = innerWidth / cols, rows = Math.ceil(innerHeight / size), n = cols * rows, h = '';
    for (var i = 0; i < n; i++) h += '<i class="lw-cell"' + (startOn ? '' : ' style="opacity:0"') + '></i>';
    el.innerHTML = '<div class="lw-cells" style="grid-template-columns:repeat(' + cols + ',1fr);grid-auto-rows:' + size.toFixed(2) + 'px">' + h + '</div>' + (withPanel ? '<div class="lw-load-panel"><span>Loading</span><b>0</b></div>' : '');
    d.body.appendChild(el);
    var cells = Array.from(el.querySelectorAll('.lw-cell'));
    /* cells under the panel go last so the panel always sits on cream */
    var pw = withPanel ? Math.min(250, innerWidth * .38) : 0, ph = pw * .8;
    var order = shuffle(cells.slice()).sort(function (a, b) { return under(a) - under(b); });
    function under(c) { var k = cells.indexOf(c), x = (k % cols + 1) * size, y = ((k / cols | 0) + 1) * size; return (pw && x > innerWidth - pw - size && y > innerHeight - ph - size) ? 1 : 0; }
    el._order = order; return el;
  }
  function cellsTo(el, frac, show) { var o = el._order, k = Math.round(frac * o.length); for (var i = 0; i < o.length; i++) o[i].style.opacity = (i < k) === !!show ? '1' : '0'; }
  function cellAnim(el, show, dur) {
    return new Promise(function (res) { var t0 = null; (function step(t) { if (t0 == null) t0 = t; var p = Math.min(1, (t - t0) / dur); cellsTo(el, p, show); if (p < 1) requestAnimationFrame(step); else res(); })(performance.now()); });
  }
  function loader() {
    if (reduce) { fireReady(); return; }
    var arrived = ssGet('lw_tr') === '1'; ssSet('lw_tr', null);
    var first = isHome && !ssGet('lw_seen');
    if (!first && !arrived) { fireReady(); return; }
    ssSet('lw_seen', '1');
    html.classList.add('lw-loading');
    cover = makeCover(first, true);
    var panel = cover.querySelector('.lw-load-panel'), num = panel && panel.querySelector('b');
    if (!first) { /* page-to-page arrival: squares dissolve, 0.65 s (LEEWARD ≈ 20 frames @30fps) */ setTimeout(fireReady, 120); cellAnim(cover, false, 650).then(function () { cover.remove(); cover = null; }); return; }
    var finish = function () {
      cellsTo(cover, 1, false);
      if (panel && hasG) G.to(panel, {yPercent: 101, duration: .7, ease: 'power3.inOut', onComplete: function () { cover.remove(); cover = null; }}); else { cover.remove(); cover = null; }
      setTimeout(fireReady, 260);
    };
    /* counter follows real progress (fonts + hero poster), squares follow the counter */
    var poster = new Image(), total = 2, done = 0, shown = 0, t0 = performance.now(), fin = false;
    var bump = function () { done++; };
    poster.onload = poster.onerror = bump; poster.src = W.matchMedia('(max-width:760px)').matches ? 'assets/media/hero-poster-sm.webp' : 'assets/media/hero-poster.webp';
    (d.fonts && d.fonts.ready ? d.fonts.ready : Promise.resolve()).then(bump);
    (function tick() {
      var el = performance.now() - t0, target = Math.min(100, (done / total * 100) * Math.min(1, el / 1400));
      if (el > 3400) target = 100;
      shown += (target - shown) * .1; if (target - shown < .6) shown = target;
      if (num) num.textContent = Math.round(shown);
      cellsTo(cover, Math.pow(shown / 100, 1.15) * .96, false);
      if (shown >= 100 && !fin) { fin = true; setTimeout(finish, 160); return; }
      requestAnimationFrame(tick);
    })();
  }
  function internalLink(a, e) {
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
    if (a.target && a.target !== '_self') return false; if (a.hasAttribute('download')) return false;
    var u; try { u = new URL(a.href, location.href); } catch (er) { return false; }
    if (u.origin !== location.origin) return false;
    if (u.pathname === location.pathname && u.search === location.search) return false; /* same page / hash only */
    return /\.html$|\/$/.test(u.pathname);
  }
  function transitions() {
    if (reduce) return;
    d.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!internalLink(a, e)) return;
      e.preventDefault();
      var el = makeCover(false, false);
      ssSet('lw_tr', '1');
      cellAnim(el, true, 360).then(function () { location.href = a.href; });
      setTimeout(function () { location.href = a.href; }, 1200);
    });
    W.addEventListener('pageshow', function (e) { if (e.persisted) { var c = d.getElementById('lw-loader'); if (c) c.remove(); ssSet('lw_tr', null); } });
  }

  /* ---------------- split text (slice reveal) ---------------- */
  function splitEl(el) {
    if (el.dataset.lwSplit) return; el.dataset.lwSplit = '1';
    var host = el;
    if (!el.hasAttribute('aria-label')) {
      var sr = d.createElement('span'); sr.className = 'sr'; sr.textContent = el.textContent.replace(/\s+/g, ' ').trim();
      host = d.createElement('span'); host.setAttribute('aria-hidden', 'true');
      while (el.firstChild) host.appendChild(el.firstChild);
      el.appendChild(sr); el.appendChild(host);
    }
    var idx = 0, walker = d.createTreeWalker(host, NodeFilter.SHOW_TEXT, {acceptNode: function (n) { return n.parentNode.closest('.lw-pill,.sr') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }});
    var nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (tn) {
      var frag = d.createDocumentFragment();
      tn.nodeValue.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(d.createTextNode(' ')); return; }
        var w = d.createElement('span'); w.className = 'lw-w';
        Array.from(part).forEach(function (ch) { var c = d.createElement('span'); c.className = 'lw-c'; c.textContent = ch; c.dataset.c = ch; c.style.setProperty('--d', (Math.min(idx, 40) * .012 + rand(0, .28)).toFixed(3) + 's'); idx++; w.appendChild(c); });
        frag.appendChild(w);
      });
      tn.parentNode.replaceChild(frag, tn);
    });
    el.classList.add('lw-split');
  }
  function replay(el) { el.classList.remove('lw-in'); void el.offsetWidth; el.classList.add('lw-in'); }
  var splitIO = null;
  function splitScan(root) {
    if (reduce) return 0; var k = 0;
    (root || d).querySelectorAll('[data-split], .legal h1, .about-hero h1, .nf h1, .story-card h2, .ad-video__copy h2').forEach(function (el) {
      if (el.dataset.lwSplit || el.id === 'ptitle') return;
      splitEl(el); k++;
      if (el.closest('.lw-hero')) { onReady(function () { setTimeout(function () { el.classList.add('lw-in'); }, 120); }); return; }
      if (splitIO) splitIO.observe(el); else el.classList.add('lw-in');
    });
    return k;
  }

  /* ---------------- pixel reveals on media ---------------- */
  var pxIO = null;
  var PX_SEL = '[data-px], .card .thumb, .cat-tile, .bundle .icons, .lw-map';
  function pxScan(root) {
    if (reduce) return 0; var k = 0;
    (root || d).querySelectorAll(PX_SEL).forEach(function (el) {
      if (el.dataset.lwPx) return; k++;
      var r = el.getBoundingClientRect();
      var inView = r.top < innerHeight && r.bottom > 0;
      pxArm(el, el.classList.contains('lw-pill') ? 14 : (r.width > 500 ? 90 : 56));
      if (inView && !el.closest('.lw-hero')) { onReady(function () { pxAnim(el, {show: true, grid: el._lwGrid, dur: 650, delay: rand(0, 160)}); el.dataset.lwPx = 'done'; }); }
      else if (pxIO) pxIO.observe(el);
    });
    return k;
  }

  /* ---------------- rolling digits ---------------- */
  function rollify(el) {
    var txt = el.textContent.trim(); el.setAttribute('aria-label', txt); el.textContent = '';
    var wrap = d.createElement('span'); wrap.className = 'lw-roll'; wrap.setAttribute('aria-hidden', 'true');
    var cols = [];
    Array.from(txt).forEach(function (ch) {
      var box = d.createElement('span');
      if (/\d/.test(ch)) { var col = d.createElement('span'); for (var k = 0; k <= 9; k++) { var s = d.createElement('span'); s.textContent = k; col.appendChild(s); } box.appendChild(col); cols.push([col, +ch]); }
      else { box.textContent = ch; }
      wrap.appendChild(box);
    });
    el.appendChild(wrap);
    return function go() { cols.forEach(function (c, i) { c[0].style.transitionDelay = (i * .08) + 's'; c[0].style.transform = 'translateY(' + (-c[1]) + 'em)'; }); };
  }

  /* ---------------- custom cursor ---------------- */
  function cursor() {
    if (!fine || reduce) return;
    var c = d.createElement('div'); c.id = 'lw-cursor'; c.setAttribute('aria-hidden', 'true'); c.innerHTML = '<span>View</span>'; d.body.appendChild(c);
    var lbl = c.firstChild, x = -100, y = -100, cx = -100, cy = -100, raf = 0;
    var SEL = '[data-cursor], .card .thumb, .cat-tile, .gallery, .lw-map';
    function loop() { cx += (x - cx) * .22; cy += (y - cy) * .22; c.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)'; raf = (Math.abs(x - cx) + Math.abs(y - cy) > .1) ? requestAnimationFrame(loop) : 0; }
    d.addEventListener('pointermove', function (e) { if (e.pointerType !== 'mouse') return; x = e.clientX; y = e.clientY; c.classList.add('on'); if (!raf) raf = requestAnimationFrame(loop); }, {passive: true});
    d.addEventListener('pointerover', function (e) { var t = e.target.closest && e.target.closest(SEL); if (t) { lbl.textContent = t.getAttribute('data-cursor') || (t.classList.contains('lw-map') ? 'Plan' : 'View'); c.classList.add('big'); } else c.classList.remove('big'); });
    d.documentElement.addEventListener('pointerleave', function () { c.classList.remove('on'); });
  }

  /* ---------------- Lenis ---------------- */
  var lenis = null;
  function smooth() {
    if (reduce || !fine || !W.Lenis) return;
    lenis = new W.Lenis({lerp: .1, smoothWheel: true, anchors: true});
    W.lwLenis = lenis;
    if (hasG) { lenis.on('scroll', ST.update); G.ticker.add(function (t) { lenis.raf(t * 1000); }); G.ticker.lagSmoothing(0); }
    else { (function r(t) { lenis.raf(t); requestAnimationFrame(r); })(); }
  }

  /* ---------------- header ---------------- */
  function headerFx() {
    var h = d.querySelector('header.site'); if (!h) return;
    var t = false, upd = function () { t = false; h.classList.toggle('is-scrolled', (W.scrollY || 0) > 12); };
    addEventListener('scroll', function () { if (!t) { t = true; requestAnimationFrame(upd); } }, {passive: true}); upd();
    var nav = d.getElementById('navl');
    if (nav && W.MutationObserver) new MutationObserver(function () { var o = nav.classList.contains('open'); d.body.style.overflow = o ? 'hidden' : ''; if (lenis) { if (o) lenis.stop(); else lenis.start(); } }).observe(nav, {attributes: true, attributeFilter: ['class']});
    nav && nav.addEventListener('click', function (e) { if (e.target.closest('a') && nav.classList.contains('open')) { nav.classList.remove('open'); var b = d.querySelector('.burger'); if (b) b.setAttribute('aria-expanded', 'false'); } });
  }

  /* ---------------- hero (video + stepped band) ---------------- */
  function hero() {
    var hero = d.querySelector('.lw-hero'); if (!hero) return;
    var rolls = Array.from(hero.querySelectorAll('[data-roll]')).map(rollify);
    var v = hero.querySelector('.lw-video'), side = hero.querySelector('.lw-hero-side'), top = hero.querySelector('.lw-hero-top'), head = d.querySelector('header.site');
    var band = Array.from(hero.querySelectorAll('.lw-tiles > *'));
    var saveData = !!(navigator.connection && navigator.connection.saveData);
    /* video: plays only with motion allowed, only while on screen */
    if (v) {
      v.muted = true;
      /* bytes only when motion is allowed and the hero is on screen; phones get the 480px portrait cut (~280 KB) */
      var vsrc = function () { if (!v.src) v.src = W.matchMedia('(max-width:760px)').matches ? v.dataset.srcSm : v.dataset.src; };
      if (reduce || saveData) { v.removeAttribute('autoplay'); v.pause(); v.preload = 'none'; }
      else if ('IntersectionObserver' in W) {
        new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && !d.hidden) { vsrc(); var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); }); }, {threshold: .05}).observe(hero);
        d.addEventListener('visibilitychange', function () { if (d.hidden) v.pause(); });
      }
    }
    if (reduce || !hasG) { rolls.forEach(function (f) { f(); }); return; }
    /* entrance (after the loader): header drops in, H1 slices in (splitScan), side + band squares pop */
    G.set(band, {opacity: 0}); G.set(side, {y: 24, opacity: 0});
    if (head) G.set(head, {yPercent: -100});
    onReady(function () {
      var tl = G.timeline({defaults: {ease: 'expo.out'}});
      if (head) tl.to(head, {yPercent: 0, duration: .9, clearProps: 'transform'}, 0);
      tl.to(side, {y: 0, opacity: 1, duration: 1.1}, .35)
        .to(band, {opacity: 1, duration: .01, ease: 'none', stagger: {each: .045, from: 'random'}}, .3)
        .add(function () { rolls.forEach(function (f) { f(); }); }, .8);
    });
    /* scroll: video slow push-in, copy drifts up, then cream squares eat the hero (bottom first) */
    var st = {trigger: hero, start: 'top top', end: 'bottom top', scrub: true};
    if (v) G.fromTo(v, {scale: 1.02}, {scale: 1.14, yPercent: 6, ease: 'none', scrollTrigger: st});
    G.to(top, {y: -80, ease: 'none', scrollTrigger: st});
    var ex = d.createElement('div'); ex.className = 'lw-exit'; ex.setAttribute('aria-hidden', 'true'); hero.appendChild(ex);
    var exCells = [];
    function buildExit() {
      var cols = bandCols(), r = hero.getBoundingClientRect(), size = r.width / cols, rows = Math.ceil(r.height / size), n = cols * rows, h = '';
      ex.style.gridTemplateColumns = 'repeat(' + cols + ',1fr)'; ex.style.gridAutoRows = size.toFixed(2) + 'px'; ex.style.alignContent = 'end';
      for (var i = 0; i < n; i++) h += '<i></i>'; ex.innerHTML = h;
      exCells = Array.from(ex.children).map(function (c, k) { var fromBottom = (rows - 1 - (k / cols | 0)) / Math.max(1, rows - 1); return [c, fromBottom + Math.random() * .2]; });
    }
    buildExit(); addEventListener('resize', function () { buildExit(); }, {passive: true});
    ST.create({trigger: hero, start: 'top top', end: 'bottom top', scrub: true, onUpdate: function (self) { var p = self.progress * 1.25 - .12; for (var i = 0; i < exCells.length; i++) exCells[i][0].classList.toggle('on', exCells[i][1] < p); }});
    /* live cart tile: flip when the real count changes */
    var live = hero.querySelector('.lw-roll-live');
    if (live && W.MutationObserver) new MutationObserver(function () { G.fromTo(live, {yPercent: 80, opacity: 0}, {yPercent: 0, opacity: 1, duration: .6, ease: 'expo.out'}); }).observe(live, {childList: true, characterData: true, subtree: true});
  }

  /* ---------------- statement: words fill grey -> ink with scroll ---------------- */
  function fill() {
    if (reduce || !hasG) return;
    d.querySelectorAll('[data-fill]').forEach(function (el) {
      var ws = Array.from(el.querySelectorAll('.lw-w')); if (!ws.length) return;
      ST.create({trigger: el, start: 'top 78%', end: 'bottom 42%', scrub: true, onUpdate: function (self) { var k = Math.round(self.progress * ws.length); ws.forEach(function (w, i) { w.classList.toggle('lw-on', i < k); }); }});
    });
  }

  /* ---------------- mobile: toast and sticky cart share one surface ---------------- */
  function cartSurface() {
    var mq = W.matchMedia('(max-width:820px)');
    if (!W.MutationObserver) return;
    var timer = 0, watched = null;
    function onToast() {
      var t = watched, m = d.querySelector('.m-cart.has'); if (t && m && t.classList.contains('show')) m.classList.remove('lw-dismissed'); if (!t || !m || !mq.matches || !t.classList.contains('show')) return;
      var lab = m.querySelector('.mc-t > span'); if (!lab) return;
      if (!lab.dataset.base) lab.dataset.base = lab.textContent;
      lab.textContent = (t.firstChild && t.firstChild.nodeType === 3 ? t.firstChild.nodeValue : t.textContent).trim();
      m.classList.remove('lw-bump'); void m.offsetWidth; m.classList.add('lw-bump');
      clearTimeout(timer); timer = setTimeout(function () { lab.textContent = lab.dataset.base; }, 1800);
    }
    function hook() { var t = d.querySelector('body > .toast'); if (!t || t === watched) return; watched = t; new MutationObserver(onToast).observe(t, {childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['class']}); }
    hook(); new MutationObserver(hook).observe(d.body, {childList: true});
    /* Escape tucks the mobile cart bar away until the next add */
    d.addEventListener('keydown', function (e) { if (e.key !== 'Escape' || !mq.matches) return; var m = d.querySelector('.m-cart.has'); if (m && !d.querySelector('.nav-links.open')) { m.classList.add('lw-dismissed'); if (m.contains(d.activeElement)) m.blur(); } });
  }

  /* ---------------- stage switcher ---------------- */
  function stages() {
    var sec = d.querySelector('.lw-stages'); if (!sec) return;
    var imgs = Array.from(sec.querySelectorAll('.lw-stage-img')), txts = Array.from(sec.querySelectorAll('.lw-stage-t')), btns = Array.from(sec.querySelectorAll('.lw-stage-btn'));
    var roll = sec.querySelector('.lw-stage-roll'), bar = sec.querySelector('.lw-stage-bar'), frame = sec.querySelector('.lw-stage-frame'), n = imgs.length, cur = 0;
    var m = d.createElement('p'); m.className = 'lw-stage-mcopy'; m.setAttribute('aria-live', 'polite'); m.textContent = txts[0].textContent.replace(/^\S+:\s*/, ''); bar.parentNode.insertBefore(m, bar);
    txts.forEach(function (t) { if (!reduce) splitEl(t); });
    if (!reduce) txts[0].classList.add('lw-in');
    function setStage(i, fromScroll) {
      i = Math.max(0, Math.min(n - 1, i)); if (i === cur) return;
      var prev = imgs[cur]; cur = i;
      imgs.forEach(function (im, k) { im.classList.toggle('on', k === i); im.classList.remove('leave'); });
      if (!reduce) { prev.classList.add('leave'); imgs[i].style.zIndex = 3; pxAnim(imgs[i], {grid: gridFor(imgs[i], Math.max(60, imgs[i].getBoundingClientRect().width / 15)), show: true, dur: 570}).then(function () { prev.classList.remove('leave'); imgs[i].style.zIndex = ''; }); }
      roll.style.transform = 'translateY(' + (-i) + 'em)';
      txts.forEach(function (t, k) { t.classList.toggle('on', k === i); if (k === i && !reduce) replay(t); });
      m.textContent = (txts[i].querySelector('.sr') || txts[i]).textContent.replace(/^\S+:\s*/, '');
      btns.forEach(function (b, k) { var on = k === i; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
      if (!fromScroll) bar.style.setProperty('--p', (i / (n - 1)).toFixed(3));
    }
    btns.forEach(function (b, k) { b.tabIndex = k ? -1 : 0; });
    var trig = null;
    btns.forEach(function (b, k) {
      b.addEventListener('click', function () {
        if (trig) { var y = trig.start + (trig.end - trig.start) * ((k + .5) / n); if (lenis) lenis.scrollTo(y, {duration: 1.2}); else scrollTo({top: y, behavior: reduce ? 'auto' : 'smooth'}); }
        else setStage(k);
      });
      b.addEventListener('keydown', function (e) { var dlt = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!dlt) return; e.preventDefault(); var j = (k + dlt + n) % n; btns[j].focus(); btns[j].click(); });
    });
    if (reduce || !hasG) return;
    trig = ST.create({
      trigger: sec.querySelector('.lw-stages-pin'), start: 'top top', end: '+=' + (n * 70) + '%', pin: true, scrub: .6, anticipatePin: 1,
      onUpdate: function (self) { var p = self.progress; bar.style.setProperty('--p', p.toFixed(4)); setStage(Math.min(n - 1, Math.floor(p * n * .999)), true); }
    });
    /* mask wipe of the frame as the section arrives */
    G.fromTo(frame, {clipPath: 'inset(12% 6% 12% 6%)'}, {clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: {trigger: frame, start: 'top 95%', end: 'top 35%', scrub: true}});
    G.fromTo(frame.querySelectorAll('.lw-stage-pic'), {scale: 1.12}, {scale: 1, ease: 'none', scrollTrigger: {trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true}});
  }

  /* ---------------- planner ---------------- */
  function planner() {
    var inp = d.getElementById('lw-pl'); if (!inp) return;
    var out = d.getElementById('lw-pl-out'), left = d.getElementById('lw-pl-left'), save = d.getElementById('lw-pl-save'), tot = d.getElementById('lw-pl-tot');
    var map = d.querySelector('.lw-map'), cells = Array.from(map.querySelectorAll('.lw-map-cell')), sel = map.querySelector('.lw-sel'), lab = map.querySelector('.lw-sel-l');
    var FREE = 39, eur = function (n) { return '€' + n.toFixed(2); };
    var vals = {l: 0, s: 0, t: 0}, tw = null;
    function paint(o) { left.textContent = o.l <= 0.004 ? 'Free ✓' : eur(o.l); save.textContent = eur(o.s); tot.textContent = eur(o.t); }
    function upd() {
      var v = +inp.value; out.textContent = '€' + v; inp.style.setProperty('--v', v + '%');
      var target = {l: Math.max(0, FREE - v), s: Math.round(v * 10) / 100, t: v - Math.round(v * 10) / 100};
      if (hasG && !reduce) { if (tw) tw.kill(); tw = G.to(vals, {l: target.l, s: target.s, t: target.t, duration: .6, ease: 'power3.out', onUpdate: function () { paint(vals); }}); } else { vals = target; paint(vals); }
      var sum = 0, picked = [];
      cells.forEach(function (c) { var p = +c.dataset.price; var ok = sum + p <= v; if (ok) { sum += p; picked.push(c); } c.classList.toggle('in', ok); });
      var mr = map.getBoundingClientRect();
      if (!picked.length) { sel.style.opacity = '.0'; lab.textContent = ''; return; }
      var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      picked.forEach(function (c) { var r = c.getBoundingClientRect(); x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom); });
      sel.style.opacity = '1'; sel.style.left = (x0 - mr.left) + 'px'; sel.style.top = (y0 - mr.top) + 'px'; sel.style.width = (x1 - x0) + 'px'; sel.style.height = (y1 - y0) + 'px';
      lab.textContent = eur(sum) + ' · ' + picked.length + (picked.length === 1 ? ' item' : ' items');
    }
    inp.addEventListener('input', upd); addEventListener('resize', upd, {passive: true});
    upd(); setTimeout(upd, 400);
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(upd);
  }

  /* ---------------- marquee ---------------- */
  function marquee() {
    var mq = d.querySelector('.lw-marquee'); if (!mq || reduce) return;
    var track = mq.firstElementChild, x = 0, half = 0, hover = false, vel = 0, lastY = scrollY;
    var measure = function () { half = track.scrollWidth / 2; }; measure(); addEventListener('resize', measure, {passive: true});
    mq.addEventListener('mouseenter', function () { hover = true; }); mq.addEventListener('mouseleave', function () { hover = false; });
    (function loop() {
      var y = scrollY; vel += (Math.min(40, Math.abs(y - lastY)) - vel) * .1; lastY = y;
      if (!hover && !d.hidden) { x -= .6 + vel * .35; if (half && -x >= half) x += half; track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)'; }
      requestAnimationFrame(loop);
    })();
  }

  /* ---------------- cards carousel progress ---------------- */
  function carousel() {
    d.querySelectorAll('.lw-cards').forEach(function (row) {
      var bar = row.parentNode.querySelector('.lw-progress span'); if (!bar) return;
      var upd = function () { var max = row.scrollWidth - row.clientWidth; var vis = row.clientWidth / Math.max(1, row.scrollWidth); bar.style.width = (vis * 100) + '%'; bar.style.transform = 'translateX(' + (max > 0 ? (row.scrollLeft / max) * ((1 - vis) / vis) * 100 : 0) + '%)'; };
      row.addEventListener('scroll', upd, {passive: true}); addEventListener('resize', upd, {passive: true}); upd();
    });
  }

  /* ---------------- generic rises ---------------- */
  function rises() {
    if (reduce || !hasG) return;
    var sel = '.sec-head, .bundle, .lw-card, .deal-strip, .reviews-empty, .lw-planner-copy > *, .ad-video__copy > *, .ad-video__frame, .news-card, .lw-glass, .usp-bar span, .pd > div > *, .summary, .line, .trust:not(.lw-cards) > div, .story-card, .legal > p, .legal > h2';
    var list = Array.from(d.querySelectorAll(sel)).filter(function (el) { var r = el.getBoundingClientRect(); return r.top > innerHeight * .92 && !el.closest('.lw-hero'); });
    if (list.length) G.set(list, {y: 40, opacity: 0});
    /* IO instead of ST.batch: survives late layout shifts (pins, ad video, lazy images) */
    var q = [], qt = 0;
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); q.push(e.target); } }); if (q.length && !qt) qt = requestAnimationFrame(function () { qt = 0; G.to(q.splice(0), {y: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: .07, overwrite: true}); }); }, {rootMargin: '0px 0px -8% 0px'});
    list.forEach(function (el) { io.observe(el); });
    /* footer scene parallax */
    var fs = d.querySelector('.lw-foot-scene img');
    if (fs) G.fromTo(fs, {yPercent: -16}, {yPercent: 0, ease: 'none', scrollTrigger: {trigger: fs.closest('footer'), start: 'top bottom', end: 'bottom bottom', scrub: true}});
    /* category tiles / cards image drift */
    d.querySelectorAll('.lw-card-hills, .lw-flock').forEach(function (el) { G.fromTo(el, {y: 30}, {y: -10, ease: 'none', scrollTrigger: {trigger: el.closest('.lw-card'), start: 'top bottom', end: 'bottom top', scrub: true}}); });
  }

  /* ---------------- boot ---------------- */
  function boot() {
    if ('IntersectionObserver' in W && !reduce) {
      splitIO = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { var el = e.target; onReady(function () { el.classList.add('lw-in'); }); splitIO.unobserve(el); } }); }, {threshold: .2});
      pxIO = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { var el = e.target; pxIO.unobserve(el); onReady(function () { pxAnim(el, {show: true, grid: el._lwGrid, dur: 650, delay: rand(0, 220)}); el.dataset.lwPx = 'done'; }); } }); }, {threshold: .15});
    }
    smooth(); headerFx(); cursor(); transitions();
    splitScan(); pxScan(); hero(); fill(); stages(); cartSurface(); planner(); marquee(); carousel(); rises();
    var main = d.getElementById('main'), t = null;
    if (main && W.MutationObserver) new MutationObserver(function (ms) {
      var real = ms.some(function (m) { var n = m.target; if (n.classList && (n.classList.contains('pin-spacer') || n.closest && n.closest('.pin-spacer'))) return false; return Array.prototype.some.call(m.addedNodes, function (a) { return a.nodeType === 1 && !a.classList.contains('pin-spacer') && !a.classList.contains('lw-w') && !a.classList.contains('lw-c'); }); });
      if (!real || t) return;
      t = setTimeout(function () { t = null; var k = splitScan(main) + pxScan(main); if (hasG && k) ST.refresh(); }, 30);
    }).observe(main, {childList: true, subtree: true});
    if (hasG) { addEventListener('load', function () { ST.refresh(); }); if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { ST.refresh(); }); }
    loader();
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot); else boot();
})();
