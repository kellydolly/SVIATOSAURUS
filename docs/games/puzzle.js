/* SVIATOSAURUS — Jigsaw puzzles: 4 / 9 / 16 pieces.
   Every piece is a slice of one composed picture (dinosaur + sky + hills), so no piece is ever
   a blank square of colour. Dropping a piece near its place snaps it in — forgiving for a 5-year-old. */
window.DW = window.DW || {};

DW.app.register('puzzle', function (el, params) {
  DW.sfx.ambience('camp');
  el.style.background = 'linear-gradient(180deg,#3a8fe0,#8fd3ff)';
  const PUZZLE_DINOS = ['trex', 'triceratops', 'stegosaurus', 'brachiosaurus', 'spinosaurus'];

  /* ---------- chooser ---------- */
  if (!params.id || !params.n) {
    el.innerHTML = `<div class="title">🧩 Dino Puzzles</div>`;
    const ch = DW.h('div', { class: 'chooser' });
    const dinoRow = DW.h('div', { class: 'select-row' });
    let chosen = params.id || 'trex';
    PUZZLE_DINOS.forEach(id => {
      const d = DW.dino(id);
      const b = DW.button(d.short, '', 'white', () => { chosen = id; dinoRow.querySelectorAll('.btn').forEach(x => x.classList.toggle('active-tool', x === b)); DW.voice.say(d.say, { icon: d.emoji }); });
      b.insertAdjacentHTML('afterbegin', DW.art.svg(d));
      if (id === chosen) b.classList.add('active-tool');
      dinoRow.appendChild(b);
    });
    const lvlRow = DW.h('div', { class: 'select-row wide-row' });
    lvlRow.append(
      DW.button('Easy · 4', '🟢', 'green wide', () => DW.app.go('puzzle', { id: chosen, n: 2 })),
      DW.button('Medium · 9', '🟡', 'wide', () => DW.app.go('puzzle', { id: chosen, n: 3 })),
      DW.button('Hard · 16', '🔴', 'red wide', () => DW.app.go('puzzle', { id: chosen, n: 4 }))
    );
    ch.append(DW.h('div', { class: 'title-inline' }, 'Pick a dinosaur 👇'), dinoRow, DW.h('div', { class: 'title-inline' }, 'How many pieces?'), lvlRow, DW.button('Back', '↩️', 'white', () => DW.app.go('hub', { id: 'camp' })));
    el.appendChild(ch);
    DW.voice.say('Pick a dinosaur for your puzzle!', { icon: '🧩' });
    return;
  }

  /* ---------- the puzzle ---------- */
  const d = DW.dino(params.id), N = params.n;
  el.innerHTML = `<div class="game">
      <div class="progress"><div class="bar"></div></div>
      <div class="board-area"><div class="pz-area">
        <div class="pz-board" style="grid-template-columns:repeat(${N},1fr);grid-template-rows:repeat(${N},1fr)"><div class="pz-ghost"></div></div>
        <div class="pz-tray"></div>
      </div></div>
      <div class="tools"></div>
    </div>`;
  const area = el.querySelector('.pz-area'), board = el.querySelector('.pz-board'), tray = el.querySelector('.pz-tray'),
    ghost = el.querySelector('.pz-ghost'), bar = el.querySelector('.bar');
  el.querySelector('.tools').append(
    DW.button('Help', '👀', 'blue', peek),
    DW.button('New', '🔀', 'green', () => DW.app.go('puzzle', { id: d.id })),
    DW.button('Back', '↩️', 'red', () => DW.app.go('hub', { id: 'camp' })));

  const slots = [];
  for (let i = 0; i < N * N; i++) { const sl = DW.h('div', { class: 'pz-slot' }); sl.dataset.i = i; board.appendChild(sl); slots.push(sl); }

  const pieces = [];
  let dragging = null, locked = 0, size = 0, picture = null;

  DW.art.picture(d, 900, { sky: skyFor(d), ground: groundFor(d) }).then(url => {
    picture = url;
    ghost.style.backgroundImage = `url(${url})`;
    for (let i = 0; i < N * N; i++) {
      const p = { i, r: Math.floor(i / N), c: i % N, locked: false };
      p.el = DW.h('div', { class: 'pz-piece' });
      p.el.style.backgroundImage = `url(${url})`;
      area.appendChild(p.el); pieces.push(p);
      p.el.addEventListener('pointerdown', (e) => start(e, p));
    }
    layout(true);
    setTimeout(() => DW.voice.say(`Let's make a ${d.say} puzzle! Drag the pieces.`, { icon: '🧩' }), 500);
  });
  function skyFor(x) { return x.location === 'volcano' ? ['#ffd9a8', '#ff9d5c'] : x.location === 'lagoon' ? ['#bfefff', '#63c6f0'] : ['#c8ecff', '#86d2f5']; }
  function groundFor(x) { return x.location === 'volcano' ? ['#d9a35c', '#a36a34'] : ['#a6e07c', '#4aa350']; }

  function layout(first) {
    const ar = area.getBoundingClientRect(), br = board.getBoundingClientRect(), tr = tray.getBoundingClientRect();
    size = br.width / N;
    /* shrink the loose pieces until the whole set fits inside the tray as a grid */
    const n = pieces.length, gap = 8, pad = 10;
    let sc = 0.95, cols = 1, rows = n, w = size;
    for (let t = 0; t < 24; t++) {
      w = size * sc;
      cols = Math.max(1, Math.floor((tr.width - pad * 2 + gap) / (w + gap)));
      rows = Math.ceil(n / cols);
      if (rows * (w + gap) - gap <= tr.height - pad * 2) break;
      sc -= 0.05;
    }
    const gridW = cols * (w + gap) - gap, gridH = rows * (w + gap) - gap;
    const x0 = tr.left - ar.left + (tr.width - gridW) / 2, y0 = tr.top - ar.top + (tr.height - gridH) / 2;
    const order = first ? DW.shuffle(pieces.map((_, i) => i)) : null;
    pieces.forEach((p, k) => {
      p.el.style.width = size + 'px'; p.el.style.height = size + 'px';
      p.el.style.backgroundSize = `${br.width}px ${br.width}px`;
      p.el.style.backgroundPosition = `${-p.c * size}px ${-p.r * size}px`;
      if (p.locked) { p.el.style.transform = 'scale(1)'; p.el.style.left = (br.left - ar.left + p.c * size) + 'px'; p.el.style.top = (br.top - ar.top + p.r * size) + 'px'; return; }
      if (first || !p.home) p.slot = first ? order[k] : (p.slot || k);
      const col = p.slot % cols, row = Math.floor(p.slot / cols);
      p.el.style.transform = `scale(${sc})`;
      p.home = {
        left: (x0 + col * (w + gap) + w / 2 - size / 2) + 'px',
        top: (y0 + row * (w + gap) + w / 2 - size / 2) + 'px'
      };
      p.el.style.left = p.home.left; p.el.style.top = p.home.top;
    });
  }
  const onResize = () => { if (pieces.length) layout(true); };
  addEventListener('resize', onResize);

  function start(e, p) {
    if (p.locked || dragging) return;
    e.preventDefault();
    const ar = area.getBoundingClientRect(), r = p.el.getBoundingClientRect();
    p.el.classList.add('dragging'); p.el.style.transform = 'scale(1.04)';
    p.el.style.left = (r.left + r.width / 2 - size / 2 - ar.left) + 'px';
    p.el.style.top = (r.top + r.height / 2 - size / 2 - ar.top) + 'px';
    dragging = { p, ox: Math.max(6, Math.min(size - 6, e.clientX - (r.left + r.width / 2 - size / 2))), oy: Math.max(6, Math.min(size - 6, e.clientY - (r.top + r.height / 2 - size / 2))) };
    DW.sfx.pop(); move(e);
  }
  function move(e) {
    if (!dragging) return;
    const ar = area.getBoundingClientRect(), p = dragging.p;
    p.el.style.left = (e.clientX - dragging.ox - ar.left) + 'px';
    p.el.style.top = (e.clientY - dragging.oy - ar.top) + 'px';
    const near = nearSlot();
    slots.forEach(s => s.classList.toggle('hot', near && +s.dataset.i === p.i && !s.classList.contains('filled')));
  }
  /* forgiving: the piece only has to land near its own place */
  function nearSlot() {
    const p = dragging.p, ar = area.getBoundingClientRect(), br = board.getBoundingClientRect();
    const cx = parseFloat(p.el.style.left) + ar.left + size / 2, cy = parseFloat(p.el.style.top) + ar.top + size / 2;
    const tx = br.left + (p.c + 0.5) * size, ty = br.top + (p.r + 0.5) * size;
    return Math.hypot(cx - tx, cy - ty) < size * 0.62;
  }
  function end() {
    if (!dragging) return;
    const p = dragging.p, ok = nearSlot();
    slots.forEach(s => s.classList.remove('hot'));
    p.el.classList.remove('dragging');
    if (ok) {
      const ar = area.getBoundingClientRect(), br = board.getBoundingClientRect();
      p.locked = true; p.el.classList.add('locked'); slots[p.i].classList.add('filled'); locked++;
      p.el.style.transition = 'left .18s, top .18s, transform .18s';
      p.el.style.transform = 'scale(1)';
      p.el.style.left = (br.left - ar.left + p.c * size) + 'px';
      p.el.style.top = (br.top - ar.top + p.r * size) + 'px';
      setTimeout(() => { p.el.style.transition = ''; }, 220);
      DW.sfx.snap(); DW.fx.sparkles(br.left + (p.c + 0.5) * size, br.top + (p.r + 0.5) * size);
      bar.style.width = (locked / (N * N) * 100) + '%';
      if (locked === N * N) finish(); else if (Math.random() < 0.55) DW.voice.say(DW.pick(['Yes!', DW.PHRASES.greatJob, 'Good!']), { icon: '👍' });
    } else {
      p.el.style.transition = 'left .3s, top .3s, transform .3s';
      p.el.style.left = p.home.left; p.el.style.top = p.home.top; p.el.style.transform = 'scale(.7)';
      setTimeout(() => { p.el.style.transition = ''; layout(false); }, 320);
    }
    dragging = null;
  }
  document.addEventListener('pointermove', move); document.addEventListener('pointerup', end); document.addEventListener('pointercancel', end);

  function peek() {
    ghost.classList.add('peek');
    DW.voice.say('Look! This is the picture.', { icon: '👀' });
    setTimeout(() => ghost.classList.remove('peek'), 1800);
  }

  function finish() {
    DW.state.inc('puzzles'); DW.state.mark('found', d.id); DW.state.addStars(1);
    board.classList.add('done');
    board.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.05)' }, { transform: 'scale(1)' }], { duration: 600 });
    setTimeout(() => DW.ui.reward({ big: d.emoji, text: `Puzzle complete! ${d.short}!`, rewards: ['🧩', '⭐'], say: `${DW.praise()} You made the ${d.say}!`, onClose: () => DW.app.go('puzzle', { id: d.id }) }), 700);
  }
  return { destroy() { removeEventListener('resize', onResize); document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', end); document.removeEventListener('pointercancel', end); } };
});
