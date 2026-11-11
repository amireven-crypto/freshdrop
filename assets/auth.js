/* FreshDrop demo sign-in. No real accounts, no passwords, no external auth calls.
   Session is stored only in this browser's localStorage. */
(function () {
  'use strict';

  var KEY = 'fd-demo-auth';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var opener = null;
  var pending = null;

  var APPLE = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16.365 12.89c-.018-1.977 1.61-2.925 1.684-2.97-.917-.92-2.346-1.05-2.84-1.06-1.195-.13-2.36.72-2.97.72-.62 0-1.56-.7-2.57-.68-1.3.02-2.51.77-3.18 1.95-1.37 2.38-.35 5.88.97 7.81.66.95 1.43 2.01 2.44 1.97.99-.04 1.36-.63 2.56-.63 1.19 0 1.52.63 2.57.61 1.07-.02 1.74-.96 2.38-1.91.76-1.09 1.07-2.15 1.08-2.21-.02 0-2.06-.79-2.08-3.14zm-1.94-5.62c.54-.66.9-1.58.8-2.5-.77.03-1.72.52-2.27 1.17-.5.58-.93 1.52-.81 2.41.86.07 1.74-.44 2.28-1.08z"/></svg>';
  var GOOGLE = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>';
  var USER = '<svg class="auth-user-ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8V22h19.2v-2.8c0-3.2-6.4-4.8-9.6-4.8z"/></svg>';

  function read() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY));
      if (raw && raw.demo === true && raw.provider) return raw;
    } catch (e) {}
    return null;
  }
  function write(v) {
    try {
      if (v) localStorage.setItem(KEY, JSON.stringify(v));
      else localStorage.removeItem(KEY);
    } catch (e) {}
  }

  function initialsFrom(email) {
    if (!email) return 'DA';
    var local = String(email).split('@')[0] || '';
    var parts = local.replace(/[._-]+/g, ' ').trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    var letters = local.replace(/[^a-zA-Z]/g, '');
    if (letters.length >= 2) return letters.slice(0, 2).toUpperCase();
    if (letters.length === 1) return (letters + 'A').toUpperCase();
    return 'DA';
  }

  function paintSlot() {
    var acc = read();
    closeMenu();
    document.querySelectorAll('.auth-slot').forEach(function (root, i) {
      var compact = root.classList.contains('auth-slot-bar');
      var menuId = 'auth-account-menu-' + i;
      if (!acc) {
        if (compact) {
          root.innerHTML = '<button type="button" class="auth-nav-btn auth-bar-btn" data-auth="open" aria-haspopup="dialog" aria-controls="auth-overlay" aria-label="Sign in">' + USER + '<span class="sr">Sign in</span></button>';
        } else {
          root.innerHTML = '<button type="button" class="auth-nav-btn" data-auth="open" aria-haspopup="dialog" aria-controls="auth-overlay">Sign in</button>';
        }
        return;
      }
      var label = compact
        ? '<span class="sr">Demo account</span>'
        : '<span class="auth-label">Demo account</span>';
      root.innerHTML =
        '<button type="button" class="auth-account-btn' + (compact ? ' auth-bar-btn' : '') + '" data-auth="menu" aria-haspopup="menu" aria-expanded="false" aria-controls="' + menuId + '" aria-label="Demo account">' +
          '<span class="auth-avatar" aria-hidden="true">' + esc(acc.initials || 'DA') + '</span>' +
          label +
        '</button>' +
        '<div id="' + menuId + '" class="auth-menu" role="menu" hidden>' +
          '<button type="button" role="menuitem" data-auth="signout">Sign out</button>' +
        '</div>';
    });
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function ensureModal() {
    if (document.getElementById('auth-overlay')) return;
    var wrap = document.createElement('div');
    wrap.id = 'auth-overlay';
    wrap.className = 'auth-overlay';
    wrap.setAttribute('hidden', '');
    wrap.inert = true;
    wrap.innerHTML =
      '<div class="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title" aria-describedby="auth-note">' +
        '<button type="button" class="auth-close" data-auth="close" aria-label="Close">×</button>' +
        '<h2 id="auth-title">Log in</h2>' +
        '<p class="auth-note" id="auth-note">Demo – no real account is created, no data is sent</p>' +
        '<div class="auth-tabs" role="tablist" aria-label="Account">' +
          '<button type="button" role="tab" id="auth-tab-login" aria-selected="true" aria-controls="auth-panel" data-auth="tab" data-tab="login">Log in</button>' +
          '<button type="button" role="tab" id="auth-tab-signup" aria-selected="false" aria-controls="auth-panel" data-auth="tab" data-tab="signup">Create account</button>' +
        '</div>' +
        '<div id="auth-panel" role="tabpanel" aria-labelledby="auth-tab-login">' +
          '<div class="auth-providers">' +
            '<button type="button" class="auth-provider auth-apple" data-auth="provider" data-provider="apple">' + APPLE + '<span>Continue with Apple</span></button>' +
            '<button type="button" class="auth-provider auth-google" data-auth="provider" data-provider="google">' + GOOGLE + '<span>Continue with Google</span></button>' +
          '</div>' +
          '<div class="auth-div">or</div>' +
          '<label class="auth-email-label"><span class="auth-email-caption">Email <span class="auth-optional">(optional)</span></span>' +
            '<input id="auth-email" type="email" name="demo-email" inputmode="email" autocomplete="username" spellcheck="false" placeholder="you@example.com">' +
          '</label>' +
          '<button type="button" class="auth-email-go" data-auth="email" disabled>Continue with email</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);
  }

  function isOpen() {
    var el = document.getElementById('auth-overlay');
    return !!(el && el.classList.contains('is-open'));
  }

  function focusables(root) {
    return Array.prototype.slice.call(root.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(function (el) {
      if (el.disabled) return false;
      var st = window.getComputedStyle(el);
      if (st.display === 'none' || st.visibility === 'hidden') return false;
      return el.getClientRects().length > 0;
    });
  }

  function setBackgroundInert(on) {
    Array.prototype.forEach.call(document.body.children, function (el) {
      if (el.id === 'auth-overlay') return;
      el.inert = !!on;
    });
  }

  function openModal(from) {
    ensureModal();
    var el = document.getElementById('auth-overlay');
    opener = from || document.activeElement;
    var nav = document.getElementById('navl');
    var burger = document.querySelector('.burger');
    if (nav && nav.classList.contains('open')) {
      nav.classList.remove('open');
      if (burger) burger.setAttribute('aria-expanded', 'false');
    }
    closeMenu();
    el.removeAttribute('hidden');
    el.inert = false;
    setBackgroundInert(true);
    document.body.classList.add('auth-lock');
    setTab('login');
    var go = el.querySelector('[data-auth="email"]');
    if (go) go.disabled = !emailValue();
    var show = function () {
      el.classList.add('is-open');
      var first = el.querySelector('[data-auth="provider"]') || el.querySelector('.auth-close');
      if (first) first.focus();
    };
    if (reduce) show();
    else requestAnimationFrame(function () { requestAnimationFrame(show); });
  }

  function closeModal() {
    var el = document.getElementById('auth-overlay');
    if (!el) return;
    el.classList.remove('is-open');
    el.inert = true;
    setBackgroundInert(false);
    document.body.classList.remove('auth-lock');
    var hide = function () {
      if (!el.classList.contains('is-open')) el.setAttribute('hidden', '');
    };
    if (reduce) hide();
    else setTimeout(hide, 460);
    if (opener && typeof opener.focus === 'function') {
      try { opener.focus(); } catch (e) {}
    }
    opener = null;
  }

  function setTab(name) {
    var login = name !== 'signup';
    var tLogin = document.getElementById('auth-tab-login');
    var tSign = document.getElementById('auth-tab-signup');
    var title = document.getElementById('auth-title');
    var panel = document.getElementById('auth-panel');
    if (tLogin) tLogin.setAttribute('aria-selected', login ? 'true' : 'false');
    if (tSign) tSign.setAttribute('aria-selected', login ? 'false' : 'true');
    if (title) title.textContent = login ? 'Log in' : 'Create account';
    if (panel) panel.setAttribute('aria-labelledby', login ? 'auth-tab-login' : 'auth-tab-signup');
    var go = document.querySelector('[data-auth="email"]');
    if (go) go.textContent = login ? 'Continue with email' : 'Create demo account';
  }

  function emailValue() {
    var input = document.getElementById('auth-email');
    return input ? String(input.value || '').trim() : '';
  }

  function emailOk(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function startDemo(provider, btn) {
    if (pending) return;
    pending = provider;
    if (btn) {
      btn.classList.add('is-loading');
      btn.setAttribute('aria-busy', 'true');
      if (!btn.querySelector('.auth-spin')) {
        var spin = document.createElement('span');
        spin.className = 'auth-spin';
        spin.setAttribute('aria-hidden', 'true');
        btn.appendChild(spin);
      }
    }
    var email = emailValue();
    var wait = reduce ? 0 : 700;
    setTimeout(function () {
      var acc = {
        demo: true,
        provider: provider,
        name: 'Demo account',
        email: emailOk(email) ? email : '',
        initials: initialsFrom(emailOk(email) ? email : ''),
        t: Date.now()
      };
      write(acc);
      pending = null;
      if (btn) {
        btn.classList.remove('is-loading');
        btn.removeAttribute('aria-busy');
        var s = btn.querySelector('.auth-spin');
        if (s) s.remove();
      }
      paintSlot();
      closeModal();
      if (typeof toast === 'function') toast('Signed in to a demo account');
    }, wait);
  }

  function signOut() {
    write(null);
    closeMenu();
    paintSlot();
    if (typeof toast === 'function') toast('Signed out');
  }

  function closeMenu() {
    document.querySelectorAll('.auth-menu').forEach(function (menu) { menu.hidden = true; });
    document.querySelectorAll('[data-auth="menu"]').forEach(function (btn) { btn.setAttribute('aria-expanded', 'false'); });
  }

  function toggleMenu(btn) {
    var id = btn.getAttribute('aria-controls');
    var menu = id && document.getElementById(id);
    if (!menu) return;
    var open = menu.hidden;
    closeMenu();
    if (!open) return;
    menu.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    var item = menu.querySelector('[data-auth="signout"]');
    if (item) item.focus();
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-auth]');
    var act = t && t.getAttribute('data-auth');
    if (act === 'open') { e.preventDefault(); openModal(t); return; }
    if (act === 'close') { e.preventDefault(); closeModal(); return; }
    if (act === 'tab') { e.preventDefault(); setTab(t.getAttribute('data-tab')); t.focus(); return; }
    if (act === 'provider') { e.preventDefault(); startDemo(t.getAttribute('data-provider'), t); return; }
    if (act === 'email') {
      e.preventDefault();
      var em = emailValue();
      if (!emailOk(em)) {
        var input = document.getElementById('auth-email');
        if (input) { input.setAttribute('aria-invalid', 'true'); input.focus(); }
        return;
      }
      startDemo('email', t);
      return;
    }
    if (act === 'menu') { e.preventDefault(); toggleMenu(t); return; }
    if (act === 'signout') { e.preventDefault(); signOut(); return; }
    if (e.target.id === 'auth-overlay') { closeModal(); return; }
    if (!e.target.closest || !e.target.closest('.auth-slot')) closeMenu();
  });

  document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'auth-email') {
      e.target.removeAttribute('aria-invalid');
      var go = document.querySelector('[data-auth="email"]');
      if (go) go.disabled = !emailOk(emailValue());
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' || !e.target || e.target.id !== 'auth-email') return;
    e.preventDefault();
    var go = document.querySelector('[data-auth="email"]');
    if (go && !go.disabled) go.click();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
      return;
    }
    if (e.key === 'Escape') closeMenu();
    if (e.key === 'Tab' && isOpen()) {
      var dialog = document.querySelector('#auth-overlay .auth-dialog');
      var list = focusables(dialog);
      if (!list.length) { e.preventDefault(); return; }
      var first = list[0], last = list[list.length - 1];
      if (!dialog.contains(document.activeElement)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  }, true);

  function init() {
    ensureModal();
    paintSlot();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
