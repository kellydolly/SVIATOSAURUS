/* SVIATOSAURUS — app core: screen router, UI helpers, particle FX, HUD, splash */
window.DW = window.DW || {};

/* ---------- tiny DOM helpers ---------- */
DW.h = function (tag, attrs, html) {
  const el = document.createElement(tag);
  if (attrs) for (const k in attrs) {
    if (k === 'class') el.className = attrs[k];
    else if (k === 'style') el.style.cssText = attrs[k];
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), attrs[k]);
    else el.setAttribute(k, attrs[k]);
  }
  if (html != null) el.innerHTML = html;
  return el;
};
DW.rand = (a, b) => a + Math.random() * (b - a);
DW.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
DW.shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
DW.wait = (ms) => new Promise(r => setTimeout(r, ms));

/* Run a one-shot animation class on a .dino svg */
DW.animate = function (svg, cls, ms) {
  if (!svg) return;
  svg.classList.remove(cls); void svg.getBoundingClientRect();
  svg.classList.add(cls);
  clearTimeout(svg._t && svg._t[cls]); svg._t = svg._t || {};
  svg._t[cls] = setTimeout(() => svg.classList.remove(cls), ms || 1300);
};

/* Big button factory */
DW.button = function (label, icon, cls, onclick) {
  const b = DW.h('button', { class: 'btn ' + (cls || '') }, (icon ? `<span class="ico">${icon}</span>` : '') + (label ? `<span>${label}</span>` : ''));
  b.addEventListener('pointerdown', () => { DW.sfx.click(); });
  if (onclick) b.addEventListener('click', (e) => { e.stopPropagation(); onclick(e); });
  return b;
};

/* ---------- Router ---------- */
DW.app = (function () {
  const screens = {};
  let current = null, currentName = null, root;
  function register(name, factory) { screens[name] = factory; }
  function go(name, params) {
    root = root || document.getElementById('screen-root');
    const old = current;
    if (old) { old.el.classList.remove('in'); old.el.classList.add('out'); setTimeout(() => { try { old.api && old.api.destroy && old.api.destroy(); } catch (e) { } old.el.remove(); }, 400); }
    const el = DW.h('div', { class: 'screen screen-' + name });
    root.appendChild(el);
    const api = screens[name](el, params || {}) || {};
    current = { el, api, name }; currentName = name;
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
    setTimeout(() => el.classList.add('in'), 60);   // in case animation frames are throttled
    DW.hud.setMap(name === 'map');
    DW.ui.hideActionBars();
    window.scrollTo(0, 0);
  }
  function home() { DW.voice.stop(); go('map'); }
  return { register, go, home, current: () => currentName };
})();

/* ---------- UI helpers: bubble, toast, reward, hearts ---------- */
DW.ui = (function () {
  let bubbleT, toastT;
  function bubble(text, icon) {
    const b = document.getElementById('bubble');
    b.innerHTML = `<span class="ico">${icon || '🗣️'}</span><span>${text}</span>`;
    b.classList.add('show');
    clearTimeout(bubbleT);
    bubbleT = setTimeout(() => b.classList.remove('show'), Math.max(2600, text.length * 90));
  }
  function toast(html, ms) {
    const t = document.getElementById('toast');
    t.innerHTML = html; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), ms || 2200);
  }
  function reward(opts) {
    // opts: {big:'🏆', text:'', sub:'', rewards:['⭐'], say:'', onClose}
    const r = DW.h('div', { class: 'reward' }, `<div class="box"><div class="big-ico">${opts.big || '🎉'}</div><div class="txt">${opts.text || ''}${opts.sub ? `<small>${opts.sub}</small>` : ''}</div>${opts.rewards ? `<div class="rewards">${opts.rewards.join(' ')}</div>` : ''}</div>`);
    const btn = DW.button(opts.button || 'OK!', '👍', 'green big', () => { r.classList.remove('show'); setTimeout(() => r.remove(), 300); opts.onClose && opts.onClose(); });
    r.querySelector('.box').appendChild(btn);
    document.getElementById('app').appendChild(r);
    requestAnimationFrame(() => r.classList.add('show'));
    DW.sfx.celebrate(); DW.fx.confetti();
    if (opts.say) DW.voice.say(opts.say === true ? DW.praise() : opts.say);
    return r;
  }
  function hideActionBars() { document.querySelectorAll('.action-bar').forEach(a => a.classList.remove('show')); }
  return { bubble, toast, reward, hideActionBars };
})();

/* ---------- Particle FX on a full-screen canvas ---------- */
DW.fx = (function () {
  let cv, cx, parts = [], running = false, W = 0, H = 0;
  function init() {
    cv = document.getElementById('fx-canvas'); cx = cv.getContext('2d');
    const rs = () => { W = cv.width = innerWidth * devicePixelRatio; H = cv.height = innerHeight * devicePixelRatio; };
    addEventListener('resize', rs); rs();
  }
  function loop() {
    if (!parts.length) { running = false; cx.clearRect(0, 0, W, H); return; }
    running = true;
    cx.clearRect(0, 0, W, H);
    const dpr = devicePixelRatio;
    parts = parts.filter(p => p.life > 0);
    for (const p of parts) {
      p.life -= 1 / 60; p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= 0.99; p.rot += p.vr;
      cx.save(); cx.translate(p.x * dpr, p.y * dpr); cx.rotate(p.rot); cx.globalAlpha = Math.min(1, p.life * 2);
      if (p.type === 'text') { cx.font = `${p.size * dpr}px sans-serif`; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText(p.text, 0, 0); }
      else if (p.type === 'circle') { cx.fillStyle = p.color; cx.beginPath(); cx.arc(0, 0, p.size * dpr / 2, 0, 6.28); cx.fill(); }
      else { cx.fillStyle = p.color; cx.fillRect(-p.size * dpr / 2, -p.size * dpr / 4, p.size * dpr, p.size * dpr / 2); }
      cx.restore();
    }
    requestAnimationFrame(loop);
  }
  function add(p) { parts.push(p); if (!running) loop(); }
  const COLORS = ['#ff4d6d', '#ffd23f', '#3ddc84', '#4cc9f0', '#b388ff', '#ff9f1c', '#fff'];
  function confetti(n) {
    n = n || 140;
    for (let i = 0; i < n; i++) add({ type: 'rect', x: DW.rand(0, innerWidth), y: DW.rand(-40, -10), vx: DW.rand(-1.5, 1.5), vy: DW.rand(1, 4), g: 0.08, rot: DW.rand(0, 6), vr: DW.rand(-0.2, 0.2), size: DW.rand(8, 16), color: DW.pick(COLORS), life: DW.rand(2, 3.5) });
  }
  function burst(x, y, opts) {
    opts = opts || {};
    const n = opts.n || 18;
    for (let i = 0; i < n; i++) {
      const a = DW.rand(0, Math.PI * 2), s = DW.rand(2, opts.speed || 7);
      add({ type: opts.text ? 'text' : (opts.shape || 'circle'), text: opts.text, x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 2, g: opts.g == null ? 0.15 : opts.g, rot: 0, vr: DW.rand(-0.1, 0.1), size: opts.size || DW.rand(6, 14), color: opts.color || DW.pick(COLORS), life: DW.rand(0.8, 1.6) });
    }
  }
  function hearts(x, y) { for (let i = 0; i < 8; i++) add({ type: 'text', text: DW.pick(['❤️', '💛', '💚', '💙']), x: x + DW.rand(-30, 30), y, vx: DW.rand(-1, 1), vy: DW.rand(-3.5, -1.5), g: -0.01, rot: 0, vr: 0, size: DW.rand(18, 34), life: DW.rand(1, 1.8) }); }
  function sparkles(x, y) { burst(x, y, { text: '✨', n: 10, size: 22, g: 0.02, speed: 4 }); }
  function dust(x, y, color) { for (let i = 0; i < 10; i++) add({ type: 'circle', x: x + DW.rand(-20, 20), y: y + DW.rand(-6, 6), vx: DW.rand(-2, 2), vy: DW.rand(-2.5, -0.5), g: 0.03, rot: 0, vr: 0, size: DW.rand(8, 20), color: color || 'rgba(160,120,70,.6)', life: DW.rand(0.5, 1) }); }
  function stars(x, y) { burst(x, y, { text: '⭐', n: 12, size: 26, g: 0.08, speed: 6 }); }
  function shake() { const a = document.getElementById('screen-root'); a.classList.remove('shake'); void a.offsetWidth; a.classList.add('shake'); }
  return { init, confetti, burst, hearts, sparkles, dust, stars, shake };
})();

/* ---------- HUD ---------- */
DW.hud = (function () {
  let el, starsEl, soundBtn, voiceBtn;
  function init() {
    el = document.getElementById('hud');
    const left = DW.h('div', { class: 'hud-left' });
    const home = DW.button('', '🏠', 'round blue hud-home', () => DW.app.home());
    home.title = 'Home';
    left.appendChild(home);
    const right = DW.h('div', { class: 'hud-right' });
    starsEl = DW.h('div', { class: 'stars' }, '<span class="ico">⭐</span><span class="n">0</span>');
    starsEl.addEventListener('click', () => DW.app.go('missions'));
    voiceBtn = DW.button('', '🗣️', 'round purple', () => DW.voice.repeat());
    voiceBtn.title = 'Say it again';
    soundBtn = DW.button('', '🔊', 'round white', () => {
      const s = DW.state.get(); s.sound = !s.sound; DW.state.save();
      DW.sfx.setEnabled(s.sound); DW.voice.setEnabled(s.sound);
      soundBtn.querySelector('.ico').textContent = s.sound ? '🔊' : '🔇';
      if (s.sound) { DW.sfx.click(); }
    });
    right.append(starsEl, voiceBtn, soundBtn);
    el.append(left, right);
    document.getElementById('bubble').addEventListener('click', () => DW.voice.repeat());
    refresh();
    const s = DW.state.get();
    soundBtn.querySelector('.ico').textContent = s.sound ? '🔊' : '🔇';
  }
  function refresh() { if (starsEl) starsEl.querySelector('.n').textContent = DW.state.get().stars; }
  function setMap(isMap) { el.classList.toggle('on-map', !!isMap); }
  function show(v) { el.classList.toggle('hidden', !v); }
  return { init, refresh, setMap, show };
})();

/* ---------- Boot ---------- */
window.addEventListener('DOMContentLoaded', () => {
  DW.fx.init();
  DW.hud.init();
  DW.hud.show(false);
  const s = DW.state.get();
  DW.sfx.setEnabled(s.sound); DW.voice.setEnabled(s.sound);
  const splash = document.getElementById('splash');
  splash.querySelector('.dino-hero').innerHTML = DW.art.svg('trex', { cls: 'alive' });
  const start = () => {
    DW.sfx.resume(); DW.sfx.click(); DW.voice.warm();
    splash.classList.add('hide');
    setTimeout(() => splash.remove(), 600);
    DW.hud.show(true);
    DW.app.go('map');
    const kid = DW.kid();
    setTimeout(() => DW.voice.say((kid ? `Hello, ${kid}! ` : 'Hello, explorer! ') + DW.PHRASES.hello, { icon: '👋' }), 300);
  };
  splash.addEventListener('click', start, { once: true });
  // keep audio context alive on any gesture
  document.addEventListener('pointerdown', () => DW.sfx.resume(), { passive: true });
  // and go completely silent whenever the game is not on screen
  const hush = () => { DW.sfx.park(); DW.voice.stop(); };
  document.addEventListener('visibilitychange', () => { document.hidden ? hush() : DW.sfx.unpark(); });
  window.addEventListener('pagehide', hush);
  window.addEventListener('blur', () => { if (document.hidden) hush(); });
});


/* ---------- Drag-a-prop helper: the child drags food / water onto a dinosaur ----------
   DW.dragProp({ html, fromEl, targets:[{el, data}], onDrop(data, x, y), onMiss(), ttl })  */
DW.dragProp = function (o) {
  const f = DW.h('div', { class: 'food-item drag' }, o.html);
  const app = document.getElementById('app');
  const from = o.fromEl.getBoundingClientRect();
  f.style.left = (from.left + from.width / 2 - 40) + 'px'; f.style.top = (from.top - 100) + 'px';
  app.appendChild(f);
  f.animate([{ transform: 'scale(.2)', opacity: 0 }, { transform: 'scale(1.15)', opacity: 1 }, { transform: 'scale(1)' }], { duration: 350 });
  let dragging = false, ox = 0, oy = 0, alive = true, ttl;
  const hit = (x, y) => o.targets.find(t => { const r = t.el.getBoundingClientRect(); return x > r.left && x < r.right && y > r.top && y < r.bottom; });
  const remove = () => { if (!alive) return; alive = false; clearTimeout(ttl); f.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(.2)', opacity: 0 }], { duration: 250 }).onfinish = () => f.remove(); o.targets.forEach(t => t.el.classList.remove('hot')); };
  f.addEventListener('pointerdown', (e) => { e.stopPropagation(); dragging = true; f.setPointerCapture(e.pointerId); const r = f.getBoundingClientRect(); ox = e.clientX - r.left; oy = e.clientY - r.top; f.classList.add('lift'); clearTimeout(ttl); });
  f.addEventListener('pointermove', (e) => { if (!dragging) return; f.style.left = (e.clientX - ox) + 'px'; f.style.top = (e.clientY - oy) + 'px'; const over = hit(e.clientX, e.clientY); o.targets.forEach(t => t.el.classList.toggle('hot', t === over)); });
  const up = (e) => {
    if (!dragging) return; dragging = false; f.classList.remove('lift');
    const over = hit(e.clientX, e.clientY);
    if (over) { remove(); o.onDrop(over.data, e.clientX, e.clientY); }
    else { o.onMiss && o.onMiss(); ttl = setTimeout(remove, o.ttl || 15000); }
  };
  f.addEventListener('pointerup', up); f.addEventListener('pointercancel', up);
  ttl = setTimeout(remove, o.ttl || 15000);
  f.animate([{ transform: 'rotate(-6deg)' }, { transform: 'rotate(6deg)' }, { transform: 'rotate(0)' }], { duration: 900, delay: 600, iterations: 3 });
  return { cancel: remove, el: f };
};
