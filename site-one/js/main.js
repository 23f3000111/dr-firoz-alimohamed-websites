/* ==========================================================================
   Gastro Center Mombasa — motion layer
   Everything here degrades to a static, fully readable page without JS.
   ========================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ---------------------------------------------------------- preloader */
  var pre = document.querySelector('.pre');
  function bootIn() {
    document.body.classList.add('is-ready');
    var hero = document.querySelector('.hero, .phead');
    if (hero) hero.classList.add('is-in');
  }
  if (pre) {
    var seen = false;
    try { seen = sessionStorage.getItem('gcm-seen') === '1'; } catch (e) {}
    if (seen || reduce) {
      pre.setAttribute('data-done', 'true');
      pre.style.transition = 'none';
      bootIn();
    } else {
      window.addEventListener('load', function () {
        setTimeout(function () {
          pre.setAttribute('data-done', 'true');
          try { sessionStorage.setItem('gcm-seen', '1'); } catch (e) {}
          setTimeout(bootIn, 260);
        }, 1450);
      });
      setTimeout(function () {
        if (pre.getAttribute('data-done') !== 'true') {
          pre.setAttribute('data-done', 'true'); bootIn();
        }
      }, 3600);
    }
  } else { bootIn(); }

  /* ------------------------------------------------------------- header */
  var head = document.querySelector('.head');
  var nav = document.querySelector('.nav');
  var burger = document.querySelector('.burger');
  var lastY = 0;
  function onScrollHead() {
    var y = window.scrollY;
    head.setAttribute('data-stuck', y > 24 ? 'true' : 'false');
    if (nav.getAttribute('data-open') !== 'true') {
      head.setAttribute('data-hide', (y > lastY && y > 420) ? 'true' : 'false');
    }
    lastY = y;
  }
  if (head) { onScrollHead(); addEventListener('scroll', onScrollHead, { passive: true }); }
  if (burger) {
    burger.addEventListener('click', function () {
      var open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', open ? 'false' : 'true');
      burger.setAttribute('aria-expanded', open ? 'false' : 'true');
      head.setAttribute('data-menu', open ? 'false' : 'true');
      document.body.classList.toggle('is-locked', !open);
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.setAttribute('data-open', 'false');
        burger.setAttribute('aria-expanded', 'false');
        head.setAttribute('data-menu', 'false');
        document.body.classList.remove('is-locked');
      });
    });
  }


  /* --------------------------------------------- progress bar + stagger */
  var prog = document.createElement('div');
  prog.className = 'prog';
  prog.innerHTML = '<i></i>';
  document.body.appendChild(prog);
  var progBar = prog.firstChild;
  function paintProg() {
    var h = document.documentElement.scrollHeight - innerHeight;
    progBar.style.width = (h > 0 ? clamp(window.scrollY / h, 0, 1) * 100 : 0) + '%';
  }

  // children of a grid reveal one after another instead of all at once
  ['.gal', '.strip', '.trip', '.cgrid', '.procs', '.steps', '.stats', '.stat',
   '.path', '.prep', '.cond-list', '.pin__track'].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (host) {
      [].slice.call(host.children).forEach(function (c, i) {
        c.style.setProperty('--d', (i * 0.075).toFixed(3) + 's');
        if (!c.classList.contains('clip')) c.classList.add('rise');
      });
    });
  });

  // every framed photograph drifts against the scroll
  document.querySelectorAll('.frame img,.journey__fig img').forEach(function (im) {
    if (!im.hasAttribute('data-px')) im.setAttribute('data-px', '3');
  });

  /* -------------------------------------------------------- reveal on view */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
  document.querySelectorAll('.rise,.sym-list,.path,.marker,.stats').forEach(function (el) { io.observe(el); });
  // safety net: nothing may ever stay invisible, whatever the observer does
  setTimeout(function () {
    document.querySelectorAll('.rise:not(.is-in)').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < innerHeight * 1.2) el.classList.add('is-in');
    });
  }, 2500);
  addEventListener('load', function () {
    setTimeout(function () {
      document.querySelectorAll('.rise:not(.is-in)').forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < innerHeight) el.classList.add('is-in');
      });
    }, 400);
  });

  /* --------------------------------------------------- word-by-word reveal */
  var says = document.querySelectorAll('.say');
  says.forEach(function (el) {
    var hi = (el.getAttribute('data-hi') || '').split(',').map(function (s) { return s.trim().toLowerCase(); });
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach(function (w, i) {
      var s = document.createElement('span');
      s.className = 'w' + (hi.indexOf(w.replace(/[^\w-]/g, '').toLowerCase()) > -1 ? ' hi' : '');
      s.textContent = w;
      el.appendChild(s);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });
  function paintSays() {
    says.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var start = innerHeight * 0.86, end = innerHeight * 0.28;
      var p = clamp((start - r.top) / (start - end), 0, 1);
      var ws = el.querySelectorAll('.w');
      var n = Math.round(p * ws.length);
      for (var i = 0; i < ws.length; i++) ws[i].classList.toggle('on', i < n);
    });
  }

  /* ------------------------------------------------------------ counters */
  var counted = new WeakSet();
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting || counted.has(en.target)) return;
      counted.add(en.target);
      var el = en.target;
      var to = parseFloat(el.getAttribute('data-count'));
      var suf = el.getAttribute('data-suffix') || '';
      if (reduce) { el.textContent = to + suf; return; }
      var t0 = performance.now(), dur = 1400;
      (function tick(t) {
        var p = clamp((t - t0) / dur, 0, 1);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * e) + suf;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });

  /* --------------------------------------------- pinned horizontal track */
  var pin = document.querySelector('.pin');
  var track = document.querySelector('.pin__track');
  var prog = document.querySelector('.pin__prog i');
  function sizePin() {
    if (!pin || !track) return;
    if (innerWidth < 981 || reduce) { pin.style.height = ''; track.style.transform = ''; return; }
    var dist = track.scrollWidth - innerWidth + parseFloat(getComputedStyle(document.documentElement).fontSize) * 2;
    pin.style.height = (innerHeight + Math.max(dist, 0) * 0.95) + 'px';
  }
  function movePin() {
    if (!pin || !track || innerWidth < 981 || reduce) return;
    var r = pin.getBoundingClientRect();
    var total = pin.offsetHeight - innerHeight;
    var p = clamp(-r.top / total, 0, 1);
    var dist = track.scrollWidth - innerWidth + 40;
    track.style.transform = 'translate3d(' + (-p * Math.max(dist, 0)) + 'px,0,0)';
    if (prog) prog.style.width = (p * 100) + '%';
  }

  /* ------------------------------------------------ the continuous line */
  var tracts = document.querySelectorAll('.tract');
  tracts.forEach(function (svg) {
    var ink = svg.querySelector('.tract__ink');
    if (!ink) return;
    var len = ink.getTotalLength();
    ink.style.strokeDasharray = len;
    ink.style.strokeDashoffset = reduce ? 0 : len;
    svg.__len = len; svg.__ink = ink;
    svg.__bead = svg.querySelector('.tract__bead');
    svg.__nodes = [].slice.call(svg.querySelectorAll('[data-at]'));
    if (reduce) svg.__nodes.forEach(function (n) { n.classList.add('on'); });
  });
  function paintTract() {
    if (reduce) return;
    tracts.forEach(function (svg) {
      if (!svg.__ink) return;
      var r = svg.getBoundingClientRect();
      var span = r.height + innerHeight * 0.55;
      var p = clamp((innerHeight * 0.82 - r.top) / span, 0, 1);
      svg.__ink.style.strokeDashoffset = svg.__len * (1 - p);
      svg.__nodes.forEach(function (n) {
        n.classList.toggle('on', p >= parseFloat(n.getAttribute('data-at')));
      });
      if (svg.__bead) {
        var pt = svg.__ink.getPointAtLength(svg.__len * p);
        svg.__bead.setAttribute('cx', pt.x); svg.__bead.setAttribute('cy', pt.y);
        svg.__bead.style.opacity = (p > 0.01 && p < 0.995) ? 1 : 0;
      }
    });
  }

  /* ------------------------------------------------------------ parallax */
  var pxs = [].slice.call(document.querySelectorAll('[data-px]'));
  function paintPx() {
    if (reduce) return;
    pxs.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) return;
      var amt = (parseFloat(el.getAttribute('data-px')) || 6) * 0.4;
      var p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      el.style.transform = 'translate3d(0,' + (-p * amt).toFixed(2) + '%,0) scale(1.06)';
    });
  }

  /* ----------------------------------------------------------- magnetic */
  if (fine && !reduce) {
    document.querySelectorAll('[data-mag]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.28;
        var y = (e.clientY - r.top - r.height / 2) * 0.4;
        el.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ------------------------------------------------------ hero pointer drift */
  var heroFig = document.querySelector('.hero__fig');
  var heroSec = document.querySelector('.hero');
  if (heroFig && heroSec && fine && !reduce) {
    heroSec.addEventListener('mousemove', function (e) {
      var r = heroSec.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      heroFig.style.transform = 'translate3d(' + (x * -16) + 'px,' + (y * -12) + 'px,0)';
    }, { passive: true });
    heroSec.addEventListener('mouseleave', function () { heroFig.style.transform = ''; });
  }

  /* ----------------------------------------------------------- carousel */
  document.querySelectorAll('.caro').forEach(function (caro) {
    var track = caro.querySelector('.caro__track');
    if (!track) return;
    // the arrows live in the section head, alongside the carousel, not inside it
    var scope = caro.closest('.wrap') || document;
    var owns = track.id ? '[aria-controls="' + track.id + '"]' : '';
    var prev = scope.querySelector('[data-caro="prev"]' + owns);
    var next = scope.querySelector('[data-caro="next"]' + owns);
    var bar = caro.querySelector('.caro__rail i');
    var behavior = reduce ? 'auto' : 'smooth';

    function step() {
      var first = track.firstElementChild;
      if (!first) return track.clientWidth;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return first.getBoundingClientRect().width + gap;
    }
    function paint() {
      var max = track.scrollWidth - track.clientWidth;
      var frac = track.scrollWidth ? track.clientWidth / track.scrollWidth : 1;
      var p = max > 1 ? clamp(track.scrollLeft / max, 0, 1) : 0;
      if (bar) {
        bar.style.width = (Math.min(frac, 1) * 100) + '%';
        bar.style.transform = 'translateX(' + (p * (100 / Math.min(frac, 1) - 100)) + '%)';
      }
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max - 2;
    }
    // aim at an absolute position so a burst of clicks still lands a card at a time
    var target = null, settle;
    function go(dir) {
      var s = step(), max = track.scrollWidth - track.clientWidth;
      var from = target === null ? track.scrollLeft : target;
      target = clamp(Math.round((from + dir * s) / s) * s, 0, max);
      track.scrollTo({ left: target, behavior: behavior });
      clearTimeout(settle);
      settle = setTimeout(function () { target = null; }, 700);
    }
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });

    var t = false;
    track.addEventListener('scroll', function () {
      if (!t) { t = true; requestAnimationFrame(function () { t = false; paint(); }); }
    }, { passive: true });
    addEventListener('resize', paint);
    addEventListener('load', paint);
    paint();
  });

  /* ---------------------------------------------------------- accordion */
  document.querySelectorAll('.acc').forEach(function (acc) {
    acc.querySelectorAll('.acc__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.acc__item');
        var panel = item.querySelector('.acc__panel');
        var open = item.getAttribute('data-open') === 'true';
        acc.querySelectorAll('.acc__item[data-open="true"]').forEach(function (o) {
          o.setAttribute('data-open', 'false');
          o.querySelector('.acc__panel').style.height = '0px';
          o.querySelector('.acc__btn').setAttribute('aria-expanded', 'false');
        });
        if (!open) {
          item.setAttribute('data-open', 'true');
          panel.style.height = panel.firstElementChild.offsetHeight + 'px';
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  });

  /* --------------------------------------------------------------- form */
  document.querySelectorAll('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = f.querySelector('.form__ok');
      if (ok) { ok.setAttribute('data-show', 'true'); ok.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' }); }
      f.querySelectorAll('input,textarea,select').forEach(function (i) {
        if (i.type !== 'submit') i.value = '';
      });
    });
  });

  /* ------------------------------------------------------- year + scroll */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  var ticking = false;
  function frame() { paintSays(); movePin(); paintTract(); paintPx(); paintProg(); ticking = false; }
  addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }, { passive: true });
  addEventListener('resize', function () { sizePin(); frame(); });
  window.addEventListener('load', function () { sizePin(); frame(); });
  sizePin(); frame();
})();
