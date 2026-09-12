/* SVIATOSAURUS — Fossil Dig: brush / pick / magnifying glass to uncover a skeleton */
window.DW = window.DW || {};

DW.app.register('dig', function (el, params) {
  DW.sfx.ambience('desert');
  el.style.background = 'linear-gradient(180deg,#ffd58a 0%,#ffb95c 55%,#e7a24f 55%,#c47c2e 100%)';
  const s = DW.state.get();

  /* ---- choose fossil ---- */
  if (!params.id) {
    el.innerHTML = `<div class="title">⛏️ Fossil Dig</div>`;
    const ch = DW.h('div', { class: 'chooser' }, `<div class="title-inline">Which fossil? 🔍</div>`);
    const row = DW.h('div', { class: 'select-row' });
    DW.FOSSILS.forEach(id => {
      const d = DW.dino(id);
      const b = DW.button(d.short + (s.fossils[id] ? ' ✅' : ''), '', 'white', () => DW.app.go('dig', { id }));
      b.insertAdjacentHTML('afterbegin', DW.skeletonArt.svg(id));
      row.appendChild(b);
    });
    ch.appendChild(row);
    ch.appendChild(DW.button('Back', '↩️', 'red', () => DW.app.go('hub', { id: 'desert' })));
    el.appendChild(ch);
    DW.voice.say('Choose a fossil to dig!', { icon: '⛏️' });
    return;
  }

  const d = DW.dino(params.id);
  const COLS = 14, ROWS = 9;
  el.innerHTML = `<div class="game">
      <div class="progress"><div class="bar"></div></div>
      <div class="board-area"><div class="stage-box dig-board"><div class="fossil">${DW.skeletonArt.svg(d.id)}</div><div class="dig-grid" style="grid-template-columns:repeat(${COLS},1fr);grid-template-rows:repeat(${ROWS},1fr)"></div><div class="found-tag"></div></div></div>
      <div class="tools"></div>
    </div><div class="tool-cursor"></div>`;
  const board = el.querySelector('.dig-board'), grid = el.querySelector('.dig-grid'), bar = el.querySelector('.bar'), tag = el.querySelector('.found-tag'), cursor = el.querySelector('.tool-cursor');
  const fossilSvg = el.querySelector('.fossil svg');

  /* ---- which tiles cover bones? (computed from the rendered skeleton) ---- */
  const tiles = [];
  const boneTiles = {};   // part -> Set(tileIndex)
  const partTiles = {};
  const layout = () => {
    const br = board.getBoundingClientRect();
    const tw = br.width / COLS, th = br.height / ROWS;
    DW.skeletonArt.KEYS.forEach(k => {
      const g = fossilSvg.querySelector(`[data-part="${k}"]`);
      const r = g.getBoundingClientRect();
      const set = new Set();
      const c0 = Math.max(0, Math.floor((r.left - br.left + 4) / tw)), c1 = Math.min(COLS - 1, Math.floor((r.right - br.left - 4) / tw));
      const r0 = Math.max(0, Math.floor((r.top - br.top + 4) / th)), r1 = Math.min(ROWS - 1, Math.floor((r.bottom - br.top - 4) / th));
      for (let rr = r0; rr <= r1; rr++) for (let cc = c0; cc <= c1; cc++) set.add(rr * COLS + cc);
      partTiles[k] = set;
      set.forEach(i => { boneTiles[i] = true; });
    });
  };

  for (let i = 0; i < COLS * ROWS; i++) {
    const rock = Math.random() < 0.28;
    const t = DW.h('div', { class: 'tile ' + (rock ? 'rock' : 'dirt') });
    t.dataset.i = i; t.dataset.level = rock ? 3 : 2; // 3 rock -> 2 dirt -> 1 dust -> 0 clear
    grid.appendChild(t); tiles.push(t);
  }
  requestAnimationFrame(layout);
  addEventListener('resize', layout);

  /* ---- tools ---- */
  let tool = 'brush';
  const tools = el.querySelector('.tools');
  const tb = {}, icons = { brush: DW.props.brush(), pick: DW.props.pick(), glass: DW.props.glass() };
  const setTool = (t) => { tool = t; Object.keys(tb).forEach(k => tb[k].classList.toggle('active-tool', k === t)); board.className = 'stage-box dig-board tool-' + t; cursor.innerHTML = icons[t]; DW.voice.say({ brush: 'Brush the sand!', pick: 'Break the rocks!', glass: 'Look for bones!' }[t], { icon: icons[t] }); };
  tb.brush = DW.button('Brush', DW.props.brush(), 'green', () => setTool('brush'));
  tb.pick = DW.button('Pick', DW.props.pick(), '', () => setTool('pick'));
  tb.glass = DW.button('Glass', DW.props.glass(), 'blue', () => setTool('glass'));
  tools.append(tb.brush, tb.pick, tb.glass, DW.button('Back', '↩️', 'red', () => DW.app.go('dig')));
  tb.brush.classList.add('active-tool'); board.classList.add('tool-brush'); cursor.innerHTML = icons.brush;
  setTimeout(() => DW.voice.say(`Let's find the ${d.say} fossil! Brush the sand.`, { icon: '⛏️' }), 700);

  /* ---- digging ---- */
  let down = false, lastSfx = 0, done = false;
  const found = {};
    function clearedBones() { let n = 0; for (const i in boneTiles) if (tiles[i].dataset.level === '0') n++; return n; }
  function hit(x, y) {
    const br = board.getBoundingClientRect();
    if (x < br.left || y < br.top || x > br.right || y > br.bottom) return;
    const c = Math.floor((x - br.left) / (br.width / COLS)), r = Math.floor((y - br.top) / (br.height / ROWS));
    const idx = r * COLS + c, t = tiles[idx]; if (!t) return;
    let lvl = +t.dataset.level;
    if (lvl === 0) return;
    const now = performance.now();
    if (tool === 'brush') {
      if (lvl === 3) { if (now - lastSfx > 300) { DW.sfx.wrong(); lastSfx = now; DW.ui.bubble('Use the pick for rocks!', '⛏️'); } t.animate([{ transform: 'scale(1)' }, { transform: 'scale(.94)' }, { transform: 'scale(1)' }], { duration: 200 }); return; }
      lvl -= 1; if (now - lastSfx > 140) { DW.sfx.brush(); lastSfx = now; }
      DW.fx.dust(x, y, 'rgba(230,200,140,.7)');
      // brush also softens neighbours a bit (feels like sweeping)
      [idx - 1, idx + 1].forEach(j => { const n = tiles[j]; if (n && Math.floor(j / COLS) === r && +n.dataset.level === 1 && Math.random() < 0.5) setLevel(n, 0); });
    } else if (tool === 'pick') {
      if (lvl === 3) { lvl = 1; DW.sfx.pick(); DW.fx.burst(x, y, { n: 8, color: '#8a7a6a', size: 7 }); DW.fx.shake(); }
      else { lvl = Math.max(0, lvl - 1); if (now - lastSfx > 160) { DW.sfx.dig(); lastSfx = now; } DW.fx.dust(x, y); }
    } else { // magnifying glass: reveal where bones are nearby
      let any = false;
      for (let rr = r - 1; rr <= r + 1; rr++) for (let cc = c - 1; cc <= c + 1; cc++) { const j = rr * COLS + cc; if (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && boneTiles[j] && +tiles[j].dataset.level > 0) { tiles[j].classList.remove('hint'); void tiles[j].offsetWidth; tiles[j].classList.add('hint'); any = true; } }
      if (now - lastSfx > 400) { any ? DW.sfx.sparkle() : DW.sfx.pop(); lastSfx = now; }
      if (any) DW.ui.bubble('A bone is here! Dig here!', '🦴'); else DW.ui.bubble('Nothing here. Look somewhere else!', '🔍');
      return;
    }
    setLevel(t, lvl);
    if (lvl === 0 && boneTiles[idx]) checkParts();
  }
  function setLevel(t, lvl) { t.dataset.level = lvl; t.className = 'tile ' + ['clear', 'dust', 'dirt', 'rock'][lvl]; }
  function checkParts() {
    const n = clearedBones(), total = Object.keys(boneTiles).length || 1; bar.style.width = (n / total * 100) + '%';
    DW.skeletonArt.KEYS.forEach(k => {
      if (found[k]) return;
      let ok = true; partTiles[k].forEach(i => { if (tiles[i].dataset.level !== '0') ok = false; });
      if (ok) {
        found[k] = true; DW.sfx.discovery();
        const g = fossilSvg.querySelector(`[data-part="${k}"]`); g.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(2)' }, { filter: 'brightness(1)' }], { duration: 700 });
        const gr = g.getBoundingClientRect(); DW.fx.sparkles(gr.left + gr.width / 2, gr.top + gr.height / 2);
        tag.textContent = `You found the ${DW.skeletonArt.LABELS[k].toLowerCase()}! 🦴`; tag.classList.add('show'); setTimeout(() => tag.classList.remove('show'), 1500);
        DW.voice.say(`You found the ${DW.skeletonArt.LABELS[k].toLowerCase()}!`, { icon: '🦴' });
      }
    });
    if (!done && DW.skeletonArt.KEYS.every(k => found[k])) finish();
  }
  function finish() {
    done = true;
    // clear leftover dirt with a sweep
    tiles.forEach((t, i) => setTimeout(() => setLevel(t, 0), (i % COLS) * 40));
    DW.state.mark('fossils', d.id); DW.state.inc('digs');
    setTimeout(() => {
      DW.ui.reward({ big: '🦴', text: `You found a ${d.short} fossil!`, rewards: ['🦴', '⭐'], say: `You found a ${d.say} fossil! ${DW.PHRASES.amazing}`, button: 'Build it!', onClose: () => DW.app.go('skeleton', { id: d.id }) });
      DW.state.addStars(1);
    }, 900);
  }
  board.addEventListener('pointerdown', (e) => { down = true; board.setPointerCapture(e.pointerId); hit(e.clientX, e.clientY); cursor.classList.add('show'); cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; });
  board.addEventListener('pointermove', (e) => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; if (down && tool !== 'glass') hit(e.clientX, e.clientY); });
  const up = () => { down = false; cursor.classList.remove('show'); };
  board.addEventListener('pointerup', up); board.addEventListener('pointercancel', up); board.addEventListener('pointerleave', () => { if (!down) cursor.classList.remove('show'); });
  return { destroy() { removeEventListener('resize', layout); } };
});
