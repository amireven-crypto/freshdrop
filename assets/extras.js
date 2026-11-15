/* FreshDrop – extras: category icons, benefits strip, fly-to-cart, back-to-top, image skeletons, mobile bottom nav.
   Visual/UX only – no prices, products or texts are changed. */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var S = function (d) { return '<svg class="ci" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; };
  var ICONS = {
    All: S('<rect x="4" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6"/>'),
    Home: S('<path d="M4 11.5 12 4.5l8 7"/><path d="M6.5 10v9.5h11V10"/><path d="M10 19.5v-5h4v5"/>'),
    Kitchen: S('<path d="M4.5 10.5h15v4a5.5 5.5 0 0 1-5.5 5.5h-4a5.5 5.5 0 0 1-5.5-5.5z"/><path d="M19.5 12.5h2"/><path d="M9 3.5v3.5M12 3v4M15 3.5v3.5"/>'),
    Office: S('<rect x="3.5" y="7.5" width="17" height="12" rx="2.2"/><path d="M9 7.5V5.6c0-.9.7-1.6 1.6-1.6h2.8c.9 0 1.6.7 1.6 1.6v1.9"/><path d="M3.5 12.5h17"/>'),
    Pets: S('<circle cx="6.5" cy="10" r="1.7"/><circle cx="10" cy="6.3" r="1.7"/><circle cx="14.5" cy="6.3" r="1.7"/><circle cx="18" cy="10" r="1.7"/><path d="M8 17.2c0-2.8 2-5.2 4.2-5.2s4.3 2.4 4.3 5.2c0 1.8-1.6 2.8-4.3 2.8S8 19 8 17.2z"/>'),
    Cleaning: S('<path d="M11 3.5l1.6 4.4 4.4 1.6-4.4 1.6L11 15.5l-1.6-4.4L5 9.5l4.4-1.6z"/><path d="M18 14.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>'),
    Bathroom: S('<path d="M12 3.5s6 6.4 6 10.8a6 6 0 0 1-12 0C6 9.9 12 3.5 12 3.5z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>'),
    Tools: S('<path d="M14.7 4.2a4.2 4.2 0 0 0-4.4 5.6L4 16.1V20h3.9l6.3-6.3a4.2 4.2 0 0 0 5.6-4.4l-2.7 2.7-2.8-.6-.6-2.8z"/>'),
    Travel: S('<rect x="5" y="7.5" width="14" height="12" rx="2.2"/><path d="M9.5 7.5V4.5h5v3"/><path d="M9 19.5v1.5M15 19.5v1.5M9 11v5M15 11v5"/>'),
    SG: S('<path d="M6.5 8v8M9.5 6v12M14.5 6v12M17.5 8v8M9.5 12h5M3.5 10.5v3M20.5 10.5v3"/>'),
    Car: S('<path d="M4 15.5v-3.3L6.3 7h11.4l2.3 5.2v3.3"/><path d="M4 12.2h16"/><circle cx="8" cy="16" r="2"/><circle cx="16" cy="16" r="2"/><path d="M10 16h4M4 15.5c0 .3.2.5.5.5H6M20 15.5c0 .3-.2.5-.5.5H18"/>')
  };
  var NAVI = {
    home: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11.5 12 4.5l8 7"/><path d="M6.5 10v9.5h11V10"/></svg>',
    cats: ICONS.All.replace('class="ci"', ''),
    cart: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.2 10.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.1L20.5 8H6.2"/><circle cx="9.5" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/></svg>',
    up: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg>'
  };

  function catIcons(root) {
    (root || document).querySelectorAll('.catrow .chip').forEach(function (c) {
      if (c.querySelector('.ci')) return;
      var k = c.dataset.c || decodeURIComponent((c.getAttribute('href') || '').split('#')[1] || '');
      if (ICONS[k]) c.insertAdjacentHTML('afterbegin', ICONS[k]);
    });
  }

  function benefits() {
    var bar = document.querySelector('.demo-bar'); if (!bar || document.querySelector('.benefits')) return;
    var items = ['📦 Shipping across the EU', '↩️ Easy returns – 14-day right of withdrawal', '🔍 Quality-checked products', '🚚 Free shipping over €39'];
    bar.insertAdjacentHTML('afterend', '<div class="benefits' + (reduce ? ' static' : '') + '" role="region" aria-label="Store benefits"><ul>' + items.map(function (t, i) { return '<li' + (i === 0 ? ' class="on"' : '') + '>' + t + '</li>'; }).join('') + '</ul></div>');
    if (reduce) return;
    var el = document.querySelector('.benefits'), li = el.querySelectorAll('li'), i = 0, paused = false;
    el.addEventListener('mouseenter', function () { paused = true; }); el.addEventListener('mouseleave', function () { paused = false; });
    el.addEventListener('focusin', function () { paused = true; }); el.addEventListener('focusout', function () { paused = false; });
    setInterval(function () { if (paused || document.hidden) return; li[i].classList.remove('on'); li[i].classList.add('out'); var prev = li[i]; setTimeout(function () { prev.classList.remove('out'); }, 700); i = (i + 1) % li.length; li[i].classList.add('on'); }, 3600);
  }

  function bottomNav() {
    var pg = document.body.dataset.page;
    var a = function (href, ic, label, on, extra) { return '<a href="' + href + '"' + (on ? ' class="on" aria-current="page"' : '') + '>' + ic + '<span>' + label + '</span>' + (extra || '') + '</a>'; };
    document.body.insertAdjacentHTML('beforeend', '<nav class="bnav" aria-label="Quick navigation">' +
      a('index.html', NAVI.home, 'Home', pg === 'home') +
      a('products.html', NAVI.cats, 'Categories', pg === 'shop' || pg === 'product') +
      a('cart.html', NAVI.cart, 'Cart', pg === 'cart', '<b class="bn-count"><span class="sr">items in cart: </span><span class="count">0</span></b>').replace('<a ', '<a class="bn-cart' + (pg === 'cart' ? ' on' : '') + '" ').replace(' class="on" aria-current', ' aria-current') +
      '</nav>');
    if (typeof updateCount === 'function') updateCount();
  }

  function backToTop() {
    document.body.insertAdjacentHTML('beforeend', '<button type="button" class="to-top" aria-label="Back to top" tabindex="-1">' + NAVI.up + '</button>');
    var b = document.querySelector('.to-top'), t = false;
    var upd = function () { t = false; var long = document.documentElement.scrollHeight > innerHeight * 2.5, show = long && scrollY > innerHeight * 1.2; b.classList.toggle('show', show); b.tabIndex = show ? 0 : -1; };
    addEventListener('scroll', function () { if (!t) { t = true; requestAnimationFrame(upd); } }, {passive: true});
    b.addEventListener('click', function () { scrollTo({top: 0, behavior: reduce ? 'auto' : 'smooth'}); var m = document.getElementById('main'); if (m) setTimeout(function () { m.focus({preventScroll: true}); }, reduce ? 0 : 600); });
    upd();
  }

  /* image skeletons: soft shimmer on product pictures until the photo has loaded */
  function skeletons(root) {
    (root || document).querySelectorAll('.pic img').forEach(function (img) {
      if (img.dataset.sk) return; img.dataset.sk = 1;
      var pic = img.parentNode; if (!pic) return;
      if (img.complete && img.naturalWidth) { pic.classList.add('sk-done'); return; }
      pic.classList.add('sk');
      var done = function () { pic.classList.remove('sk'); pic.classList.add('sk-done'); };
      img.addEventListener('load', done, {once: true}); img.addEventListener('error', done, {once: true});
      setTimeout(done, 6000);
    });
  }

  /* fly-to-cart */
  function cartTarget() {
    var bn = document.querySelector('.bnav .bn-cart');
    if (bn && bn.offsetParent !== null && getComputedStyle(document.querySelector('.bnav')).display !== 'none') return bn;
    return document.querySelector('.cart-btn');
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-act="add"],[data-act="pdadd"]'); if (!t) return;
    var tgt = cartTarget(); if (!tgt) return;
    var bump = function () { tgt.classList.remove('fly-bump'); void tgt.offsetWidth; tgt.classList.add('fly-bump'); };
    if (reduce || !document.body.animate) { bump(); return; }
    var host = t.closest('.card, .bundle, .pd, .line') || t, img = host.querySelector('.pic img');
    var from = (img || t).getBoundingClientRect(), to = tgt.getBoundingClientRect();
    var size = 44, dot = document.createElement('div'); dot.className = 'fly-dot'; dot.setAttribute('aria-hidden', 'true');
    if (img && img.currentSrc) {
      try {
        var u = new URL(img.currentSrc, location.href);
        if (u.origin === location.origin && u.protocol === location.protocol) {
          dot.style.backgroundImage = 'url("' + u.href.replace(/["'\\\s()]/g, function (ch) {
            return '%' + ch.charCodeAt(0).toString(16).padStart(2, '0');
          }) + '")';
        }
      } catch (err) {}
    }
    var x0 = from.left + from.width / 2 - size / 2, y0 = from.top + from.height / 2 - size / 2, x1 = to.left + to.width / 2 - size / 2, y1 = to.top + to.height / 2 - size / 2;
    dot.style.left = x0 + 'px'; dot.style.top = y0 + 'px'; document.body.appendChild(dot);
    var dx = x1 - x0, dy = y1 - y0, lift = Math.min(160, Math.abs(dx) * .25 + 60);
    var an = dot.animate([
      {transform: 'translate(0,0) scale(1.5)', opacity: 0},
      {transform: 'translate(0,0) scale(1.3)', opacity: 1, offset: .12},
      {transform: 'translate(' + dx * .5 + 'px,' + (Math.min(0, dy) * .5 - lift) + 'px) scale(.9)', opacity: 1, offset: .55},
      {transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.3)', opacity: .4}
    ], {duration: 820, easing: 'cubic-bezier(.28,.11,.32,1)'});
    an.onfinish = function () { dot.remove(); bump(); };
    setTimeout(function () { if (dot.isConnected) dot.remove(); }, 1500);
  }, true);

  document.addEventListener('DOMContentLoaded', function () {
    benefits(); bottomNav(); backToTop(); catIcons(); skeletons();
    var main = document.getElementById('main');
    if (main) new MutationObserver(function () { catIcons(main); skeletons(main); }).observe(main, {childList: true, subtree: true});
    setTimeout(function () { dispatchEvent(new Event('resize')); }, 60);
  });
})();
