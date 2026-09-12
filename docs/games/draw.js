/* SVIATOSAURUS — Draw a Dinosaur: finger painting + coloring pages that come alive */
window.DW = window.DW || {};

DW.app.register('draw', function (el, params) {
  DW.sfx.ambience('camp');
  el.style.background = 'linear-gradient(180deg,#d64a8a,#ff9cc8)';
  const OUTLINES = ['trex', 'triceratops', 'stegosaurus', 'brachiosaurus', 'velociraptor'];
  el.innerHTML = `<div class="game"><div class="board-area"><div class="dr-area">
      <div class="dr-canvas-wrap"><canvas></canvas><div class="outline-layer"></div></div>
      <div class="dr-side"><div class="swatches"></div><div class="sizes"></div></div>
    </div></div><div class="tools"></div></div>`;
  const wrap = el.querySelector('.dr-canvas-wrap'), canvas = el.querySelector('canvas'), ctx = canvas.getContext('2d'), outlineLayer = el.querySelector('.outline-layer');
  const COLORS = ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa', '#6d4c41', '#000000', '#ff80ab', '#ffffff'];
  let color = COLORS[3], size = 14, eraser = false, drawing = false, last = null, outline = params.outline || null, strokes = 0;

  /* canvas sizing keeps drawing on resize */
  function resize() {
    const snap = canvas.width ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null;
    const r = wrap.getBoundingClientRect(); const dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = r.width * dpr; canvas.height = r.height * dpr; ctx.scale(dpr, dpr); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, r.width, r.height);
    if (snap) { try { ctx.putImageData(snap, 0, 0); } catch (e) { } }
  }
  requestAnimationFrame(resize); addEventListener('resize', resize);

  const sw = el.querySelector('.swatches');
  COLORS.forEach(c => { const b = DW.h('div', { class: 'swatch' + (c === color ? ' active' : ''), style: `background:${c}` }); b.addEventListener('pointerdown', () => { color = c; eraser = false; sw.querySelectorAll('.swatch').forEach(x => x.classList.toggle('active', x === b)); bEr.classList.remove('active-tool'); DW.sfx.click(); }); sw.appendChild(b); });
  const sz = el.querySelector('.sizes');
  [7, 14, 26].forEach(v => { const b = DW.h('div', { class: 'size-dot' + (v === size ? ' active' : '') }, `<i style="width:${v * 1.2}px;height:${v * 1.2}px"></i>`); b.addEventListener('pointerdown', () => { size = v; sz.querySelectorAll('.size-dot').forEach(x => x.classList.toggle('active', x === b)); DW.sfx.click(); }); sz.appendChild(b); });

  const tools = el.querySelector('.tools');
  const bEr = DW.button('Eraser', '🧽', 'white', () => { eraser = !eraser; bEr.classList.toggle('active-tool', eraser); DW.voice.say(eraser ? 'Eraser!' : 'Brush!', { icon: eraser ? '🧽' : '🖌️' }); });
  const bClear = DW.button('Clear', '🗑️', 'red', () => { const r = wrap.getBoundingClientRect(); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, r.width, r.height); strokes = 0; DW.sfx.whoosh(); DW.voice.say('All clean! Draw again!', { icon: '🗑️' }); });
  const bOutline = DW.button('Dino', '🦖', 'blue', pickOutline);
  const bDone = DW.button('Done!', '✨', 'green', done);
  tools.append(bEr, bClear, bOutline, bDone, DW.button('Back', '↩️', 'white', () => DW.app.go('hub', { id: 'camp' })));
  setTimeout(() => DW.voice.say(outline ? `Color the ${DW.dino(outline).say}! ${DW.PHRASES.chooseColor}` : `Draw a dinosaur! ${DW.PHRASES.chooseColor}`, { icon: '🎨' }), 600);
  if (outline) outlineLayer.innerHTML = DW.art.outline(outline);

  function pos(e) { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
  wrap.addEventListener('pointerdown', (e) => { drawing = true; wrap.setPointerCapture(e.pointerId); last = pos(e); dot(last); });
  wrap.addEventListener('pointermove', (e) => { if (!drawing) return; const p = pos(e); ctx.strokeStyle = eraser ? '#fff' : color; ctx.lineWidth = eraser ? size * 2.2 : size; ctx.beginPath(); ctx.moveTo(last[0], last[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); last = p; });
  const stop = () => { if (drawing) { drawing = false; strokes++; } };
  wrap.addEventListener('pointerup', stop); wrap.addEventListener('pointercancel', stop);
  function dot(p) { ctx.fillStyle = eraser ? '#fff' : color; ctx.beginPath(); ctx.arc(p[0], p[1], (eraser ? size * 2.2 : size) / 2, 0, 6.28); ctx.fill(); }

  function pickOutline() {
    const ov = DW.h('div', { class: 'alive-card' });
    const inner = DW.h('div', { class: 'inner' }, `<div class="title-inline" style="color:#333;font-weight:800;font-size:clamp(20px,4vmin,40px);margin-bottom:1vmin">Color a dinosaur 🎨</div>`);
    const row = DW.h('div', { class: 'select-row' });
    OUTLINES.forEach(id => { const d = DW.dino(id); const b = DW.button(d.short, '', 'white', () => { ov.remove(); outline = id; outlineLayer.innerHTML = DW.art.outline(id); DW.voice.say(`Color the ${d.say}!`, { icon: '🎨' }); }); b.insertAdjacentHTML('afterbegin', DW.art.outline(id)); row.appendChild(b); });
    const none = DW.button('Free draw', '✏️', 'purple', () => { ov.remove(); outline = null; outlineLayer.innerHTML = ''; DW.voice.say('Draw anything you like!', { icon: '✏️' }); });
    inner.append(row, DW.h('div', { style: 'margin-top:1.4vmin' })); inner.lastChild.append(none); ov.appendChild(inner); el.appendChild(ov);
    DW.voice.say('Pick a dinosaur to color!', { icon: '🦖' });
  }

  function done() {
    if (strokes === 0) { DW.voice.say('Draw something first!', { icon: '🖌️' }); DW.sfx.wrong(); return; }
    // compose drawing + outline into one image
    const out = document.createElement('canvas'); out.width = 400; out.height = 260; const oc = out.getContext('2d');
    oc.drawImage(canvas, 0, 0, 400, 260);
    const finish = () => {
      const url = out.toDataURL('image/jpeg', 0.7);
      const s = DW.state.get(); s.drawings.unshift(url); s.drawings = s.drawings.slice(0, 8); DW.state.save();
      DW.state.inc('drawings');
      const ov = DW.h('div', { class: 'alive-card' }, `<div class="inner"><img src="${url}" alt="my dinosaur"><div class="title-inline" style="color:#5a3a00;font-weight:800;font-size:clamp(20px,4vmin,40px);margin:1vmin 0">You made your dinosaur! 🎉</div></div>`);
      ov.querySelector('.inner').append(DW.button('Yay!', '🎉', 'green big', () => { ov.remove(); }), DW.button('Draw more', '🎨', 'blue', () => { ov.remove(); }));
      el.appendChild(ov);
      DW.sfx.celebrate(); DW.fx.confetti(); DW.voice.say('Wow! You made your dinosaur!', { icon: '🎉' });
      DW.state.addStars(1);
    };
    if (outline) {
      const svgText = new XMLSerializer().serializeToString(outlineLayer.querySelector('svg'));
      const img = new Image(); img.onload = () => { oc.drawImage(img, 0, 0, 400, 260); finish(); }; img.onerror = finish;
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText);
    } else finish();
  }
  return { destroy() { removeEventListener('resize', resize); } };
});
