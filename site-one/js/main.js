/* ==========================================================================
   Dr Firoz Alimohamed — motion layer
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
      var hide = y > lastY && y > 420;
      head.setAttribute('data-hide', hide ? 'true' : 'false');
      if (hide) head.querySelectorAll('.nav__item[data-open="true"] .nav__caret').forEach(function (b) { b.click(); });
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

  /* ---------------------------------------------------------- dropdowns */
  var drops = [].slice.call(document.querySelectorAll('.nav__item'));
  function closeDrops(except) {
    drops.forEach(function (d) {
      if (d === except) return;
      d.setAttribute('data-open', 'false');
      d.querySelector('.nav__caret').setAttribute('aria-expanded', 'false');
    });
  }
  drops.forEach(function (d) {
    var btn = d.querySelector('.nav__caret');
    btn.addEventListener('click', function () {
      var open = d.getAttribute('data-open') === 'true';
      closeDrops(d);
      d.setAttribute('data-open', open ? 'false' : 'true');
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
    d.addEventListener('focusout', function (e) {
      // in the phone menu, closing here would shift the layout under the next tap
      if (innerWidth > 1240 && e.relatedTarget && !d.contains(e.relatedTarget)) closeDrops();
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav__item')) closeDrops();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = document.querySelector('.nav__item[data-open="true"]');
    if (open) { open.querySelector('.nav__caret').focus(); closeDrops(); }
  });

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
   '.path', '.prep', '.cond-list'].forEach(function (sel) {
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

  /* ------------------------------------------------ the continuous line */
  var tracts = document.querySelectorAll('.tract');
  tracts.forEach(function (svg) {
    var ink = svg.querySelector('.tract__ink');
    if (!ink) return;
    var len = ink.getTotalLength();
    ink.style.strokeDasharray = len;
    ink.style.strokeDashoffset = reduce ? 0 : len;
    svg.__len = len; svg.__ink = ink;
    svg.__bead = svg.querySelector('.tract__bead:not(.tract__bead--off)');
    svg.__nodes = [].slice.call(svg.querySelectorAll('[data-at]'));
    if (reduce) svg.__nodes.forEach(function (n) { n.classList.add('on'); });
    // the liver leaves the main line as an off shoot, drawn once the ink reaches the junction
    var off = svg.querySelector('.tract__off-ink');
    if (off) {
      svg.__off = off; svg.__offLen = off.getTotalLength();
      off.style.strokeDasharray = svg.__offLen;
      off.style.strokeDashoffset = reduce ? 0 : svg.__offLen;
      svg.__offBead = svg.querySelector('.tract__bead--off');
    }
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
      if (svg.__off) {
        var from = parseFloat(svg.__off.getAttribute('data-from'));
        var to = parseFloat(svg.__off.getAttribute('data-to'));
        var q = clamp((p - from) / (to - from), 0, 1);
        svg.__off.style.strokeDashoffset = svg.__offLen * (1 - q);
        var qt = svg.__off.getPointAtLength(svg.__offLen * q);
        svg.__offBead.setAttribute('cx', qt.x); svg.__offBead.setAttribute('cy', qt.y);
        svg.__offBead.style.opacity = (q > 0.01 && q < 0.995) ? 1 : 0;
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
  function frame() { paintSays(); paintTract(); paintPx(); paintProg(); ticking = false; }
  addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }, { passive: true });
  addEventListener('resize', frame);
  window.addEventListener('load', frame);
  frame();
})();
