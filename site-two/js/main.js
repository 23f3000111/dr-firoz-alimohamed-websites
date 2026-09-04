/* ==========================================================================
   Dr. Firoz Alimohamed — Gastroenterology · Site Two motion layer
   ========================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var lerp = function (a, b, n) { return a + (b - a) * n; };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* -------------------------------------------------------- preloader */
  var pre = document.querySelector('.pre');
  function bootIn() {
    var h = document.querySelector('.hero') || document.querySelector('.phead');
    if (h) h.classList.add('is-in');
    document.body.classList.add('is-ready');
  }
  if (pre) {
    var seen = false;
    try { seen = sessionStorage.getItem('fa-seen') === '1'; } catch (e) {}
    if (seen || reduce) {
      pre.setAttribute('data-done', 'true'); pre.style.transition = 'none'; bootIn();
    } else {
      var num = pre.querySelector('.pre__n b'), t0 = performance.now(), dur = 1500;
      (function tick(t) {
        var p = clamp((t - t0) / dur, 0, 1);
        if (num) num.textContent = Math.round((1 - Math.pow(1 - p, 3)) * 100);
        if (p < 1) requestAnimationFrame(tick);
        else {
          pre.setAttribute('data-done', 'true');
          try { sessionStorage.setItem('fa-seen', '1'); } catch (e) {}
          setTimeout(bootIn, 300);
        }
      })(t0);
    }
  } else { bootIn(); }

  /* ----------------------------------------------------------- cursor */
  if (fine && !reduce) {
    var cur = document.createElement('div'); cur.className = 'cur';
    document.body.appendChild(cur);
    var mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function loop() {
      cx = lerp(cx, mx, 0.2); cy = lerp(cy, my, 0.2);
      cur.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest('a,button,input,select,textarea,.tile,.cgrid li');
      document.body.setAttribute('data-cur', t ? 'link' : '');
    });
  }

  /* ----------------------------------------------------------- header */
  var head = document.querySelector('.head');
  var nav = document.querySelector('.nav');
  var burger = document.querySelector('.burger');
  var lastY = 0;
  function onScrollHead() {
    var y = window.scrollY;
    head.setAttribute('data-stuck', y > 24 ? 'true' : 'false');
    if (nav.getAttribute('data-open') !== 'true') {
      head.setAttribute('data-hide', (y > lastY && y > 460) ? 'true' : 'false');
    }
    lastY = y;
  }
  if (head) { onScrollHead(); addEventListener('scroll', onScrollHead, { passive: true }); }
  if (burger) {
    burger.addEventListener('click', function () {
      var open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', open ? 'false' : 'true');
      burger.setAttribute('aria-expanded', open ? 'false' : 'true');
      document.body.classList.toggle('is-locked', !open);
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.setAttribute('data-open', 'false');
        burger.setAttribute('aria-expanded', 'false');
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
  document.querySelectorAll('.frame img,.bleed img,.journey__fig img').forEach(function (im) {
    if (!im.hasAttribute('data-px')) im.setAttribute('data-px', '9');
  });

  /* ----------------------------------------------------------- reveals */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
  document.querySelectorAll('.rise,.clip,.lab,.stat').forEach(function (el) { io.observe(el); });

  /* --------------------------------------------------- headline scramble */
  var GLYPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/*+';
  function scramble(el, done) {
    var real = el.getAttribute('data-text') || el.textContent;
    if (reduce) { el.textContent = real; if (done) done(); return; }
    var frame = 0, total = 34;
    var timer = setInterval(function () {
      frame++;
      var reveal = Math.floor((frame / total) * real.length);
      var out = '';
      for (var i = 0; i < real.length; i++) {
        if (i < reveal || real[i] === ' ') out += real[i];
        else out += GLYPH[Math.floor(Math.random() * GLYPH.length)];
      }
      el.textContent = out;
      if (frame >= total) { clearInterval(timer); el.textContent = real; if (done) done(); }
    }, 34);
  }
  var sio = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (en.isIntersecting) { scramble(en.target); sio.unobserve(en.target); }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-scramble]').forEach(function (el) {
    el.setAttribute('data-text', el.textContent); sio.observe(el);
  });

  /* --------------------------------------------------------- counters */
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return;
      cio.unobserve(en.target);
      var el = en.target, to = parseFloat(el.getAttribute('data-count'));
      if (reduce) { el.textContent = to; return; }
      var t0 = performance.now(), dur = 1500;
      (function tick(t) {
        var p = clamp((t - t0) / dur, 0, 1);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });

  /* ------------------------------------------------- hero light tunnel */
  var cv = document.getElementById('tunnel');
  if (cv && !reduce) {
    var ctx = cv.getContext('2d'), w = 0, h = 0, dpr = Math.min(devicePixelRatio || 1, 2), t = 0;
    var pmx = 0.5, pmy = 0.45, tmx = 0.5, tmy = 0.45;
    function size() {
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size(); addEventListener('resize', size);
    var hero = cv.closest('.hero');
    if (hero) {
      hero.addEventListener('mousemove', function (e) {
        var r = hero.getBoundingClientRect();
        tmx = (e.clientX - r.left) / r.width; tmy = (e.clientY - r.top) / r.height;
        var sp = hero.querySelector('.hero__spot');
        if (sp) { sp.style.setProperty('--mx', (tmx * 100) + '%'); sp.style.setProperty('--my', (tmy * 100) + '%'); }
      }, { passive: true });
    }
    (function draw() {
      t += 0.0038;
      pmx = lerp(pmx, tmx, 0.045); pmy = lerp(pmy, tmy, 0.045);
      ctx.clearRect(0, 0, w, h);
      var cxp = w * (0.62 + (pmx - 0.5) * 0.1);
      var cyp = h * (0.42 + (pmy - 0.5) * 0.12);
      var maxR = Math.hypot(Math.max(cxp, w - cxp), Math.max(cyp, h - cyp));

      // deep glow at the far end of the lumen
      var g = ctx.createRadialGradient(cxp, cyp, 0, cxp, cyp, maxR * 0.55);
      g.addColorStop(0, 'rgba(111,224,192,.20)');
      g.addColorStop(0.42, 'rgba(63,169,140,.06)');
      g.addColorStop(1, 'rgba(4,22,27,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

      // receding rings — an endoscope's view up a passage
      var rings = 26;
      for (var i = 0; i < rings; i++) {
        var f = ((i / rings) + (t % (1 / rings)) * rings / rings) % 1;
        var prog = (f + t) % 1;
        var r = Math.pow(prog, 2.1) * maxR * 1.15;
        if (r < 2) continue;
        var a = Math.sin(prog * Math.PI) * 0.3;
        var wob = Math.sin(t * 5 + i * 0.6) * (r * 0.045);
        ctx.beginPath();
        ctx.ellipse(cxp + wob * 0.6, cyp + wob, r, r * 0.94, Math.sin(t * 2 + i) * 0.12, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(111,224,192,' + a.toFixed(3) + ')';
        ctx.lineWidth = 1 + prog * 1.2;
        ctx.stroke();
      }
      requestAnimationFrame(draw);
    })();
  }

  /* -------------------------------------------------- pinned sequence */
  var seq = document.querySelector('.seq');
  if (seq) {
    var steps = [].slice.call(seq.querySelectorAll('.seq__steps > li'));
    var figs = [].slice.call(seq.querySelectorAll('.seq__stage figure'));
    var qio = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var i = steps.indexOf(en.target);
        steps.forEach(function (s, j) { s.setAttribute('data-on', j === i ? 'true' : 'false'); });
        figs.forEach(function (f, j) { f.setAttribute('data-on', j === i ? 'true' : 'false'); });
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    steps.forEach(function (s) { qio.observe(s); });
    if (steps[0]) { steps[0].setAttribute('data-on', 'true'); }
    if (figs[0]) { figs[0].setAttribute('data-on', 'true'); }
  }

  /* -------------------------------------------------------------- tabs */
  document.querySelectorAll('[data-tabs]').forEach(function (host) {
    var btns = [].slice.call(host.querySelectorAll('.tabs button'));
    var panels = [].slice.call(host.querySelectorAll('.panel'));
    var ink = host.querySelector('.tabs__ink');
    function pick(i) {
      btns.forEach(function (b, j) { b.setAttribute('aria-selected', j === i ? 'true' : 'false'); });
      panels.forEach(function (p, j) { p.setAttribute('data-on', j === i ? 'true' : 'false'); });
      if (ink) { ink.style.left = btns[i].offsetLeft + 'px'; ink.style.width = btns[i].offsetWidth + 'px'; }
    }
    btns.forEach(function (b, i) { b.addEventListener('click', function () { pick(i); }); });
    pick(0);
    addEventListener('resize', function () {
      var cur = btns.findIndex(function (b) { return b.getAttribute('aria-selected') === 'true'; });
      pick(cur < 0 ? 0 : cur);
    });
    window.addEventListener('load', function () { pick(0); });
  });

  /* --------------------------------------------------------- drag rail */
  document.querySelectorAll('.rail').forEach(function (rail) {
    var down = false, sx = 0, sl = 0;
    rail.style.overflowX = 'auto';
    rail.addEventListener('pointerdown', function (e) {
      down = true; sx = e.clientX; sl = rail.scrollLeft;
      rail.setAttribute('data-drag', 'true');
    });
    addEventListener('pointerup', function () { down = false; rail.removeAttribute('data-drag'); });
    rail.addEventListener('pointermove', function (e) {
      if (!down) return;
      e.preventDefault();
      rail.scrollLeft = sl - (e.clientX - sx);
    });
  });

  /* --------------------------------------------------------- accordion */
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

  /* ------------------------------------------------------------- forms */
  document.querySelectorAll('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = f.querySelector('.form__ok');
      if (ok) { ok.setAttribute('data-show', 'true'); ok.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' }); }
      f.querySelectorAll('input,textarea,select').forEach(function (i) { if (i.type !== 'submit') i.value = ''; });
    });
  });

  /* ---------------------------------------------------------- parallax */
  var pxs = [].slice.call(document.querySelectorAll('[data-px]'));
  function paintPx() {
    if (reduce) return;
    pxs.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) return;
      var amt = parseFloat(el.getAttribute('data-px')) || 10;
      var p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      el.style.transform = 'translate3d(0,' + (-p * amt) + '%,0) scale(1.12)';
    });
  }

  /* ------------------------------------------------------------ magnetic */
  if (fine && !reduce) {
    document.querySelectorAll('[data-mag]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.transform = 'translate3d(' + ((e.clientX - r.left - r.width / 2) * 0.26) + 'px,' +
          ((e.clientY - r.top - r.height / 2) * 0.38) + 'px,0)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  var ticking = false;
  addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { paintPx(); paintProg(); ticking = false; }); }
  }, { passive: true });
  addEventListener('resize', function () { paintPx(); paintProg(); });
  paintPx(); paintProg();
})();
