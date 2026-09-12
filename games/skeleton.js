/* SVIATOSAURUS — Skeleton Builder: drag bones to the right spot, then the skeleton comes alive */
window.DW = window.DW || {};

DW.app.register('skeleton', function (el, params) {
  DW.sfx.ambience('desert');
  el.style.background = 'linear-gradient(180deg,#f3d9a4 0%,#e4b872 55%,#c9954a 55%,#9a6a2c 100%)';
  const s = DW.state.get();

  if (!params.id) {
    el.innerHTML = `<div class="title">🦴 Build a Skeleton</div>`;
    const ch = DW.h('div', { class: 'chooser' }, `<div class="title-inline">Which skeleton? 🦴</div>`);
    const row = DW.h('div', { class: 'select-row' });
    DW.FOSSILS.forEach(id => {
      const d = DW.dino(id);
      const b = DW.button(d.short + (s.skeletons[id] ? ' ✅' : ''), '', 'white', () => DW.app.go('skeleton', { id }));
      b.insertAdjacentHTML('afterbegin', DW.skeletonArt.svg(id));
      row.appendChild(b);
    });
    ch.appendChild(row);
    ch.appendChild(DW.button('Back', '↩️', 'red', () => DW.app.go('hub', { id: 'desert' })));
    el.appendChild(ch);
    DW.voice.say(DW.PHRASES.buildSkeleton, { icon: '🦴' });
    return;
  }

  const d = DW.dino(params.id);
  const built = DW.skeletonArt.build(d.id);
  el.innerHTML = `<div class="game">
      <div class="progress"><div class="bar"></div></div>
      <div class="board-area"><div class="stage-box sk-board">
        <div class="placed ghost">${DW.skeletonArt.svg(d.id)}</div>
        <div class="placed real">${DW.skeletonArt.wrap('')}</div>
        <div class="live" style="display:none">${DW.art.svg(d, { cls: 'alive' })}</div>
      </div></div>
      <div class="sk-tray"></div>
      <div class="tools"></div>
    </div>`;
  const board = el.querySelector('.sk-board'), ghost = el.querySelector('.ghost svg'), real = el.querySelector('.real svg'), tray = el.querySelector('.sk-tray'), bar = el.querySelector('.bar');
  const targets = {};
  DW.skeletonArt.KEYS.forEach(k => { const t = DW.h('div', { class: 'target' }); board.appendChild(t); targets[k] = t; });
  function layout() {
    const br = board.getBoundingClientRect();
    DW.skeletonArt.KEYS.forEach(k => {
      const r = ghost.querySelector(`[data-part="${k}"]`).getBoundingClientRect();
      const t = targets[k]; t.style.left = (r.left - br.left - 8) + 'px'; t.style.top = (r.top - br.top - 8) + 'px'; t.style.width = (r.width + 16) + 'px'; t.style.height = (r.height + 16) + 'px';
      t._rect = { x: r.left - br.left, y: r.top - br.top, w: r.width, h: r.height };
    });
  }
  requestAnimationFrame(layout); addEventListener('resize', layout);

  const order = DW.shuffle(DW.skeletonArt.KEYS);
  const pieces = {};
  let placed = 0, dragging = null;
  order.forEach(k => {
    const p = DW.h('div', { class: 'sk-piece' }, DW.skeletonArt.partSvg(d.id, k) + `<div class="lbl">${DW.skeletonArt.ICONS[k]} ${DW.skeletonArt.LABELS[k]}</div>`);
    // the piece svg shows only its own bbox: set viewBox after render
    tray.appendChild(p); pieces[k] = p;
    requestAnimationFrame(() => { const g = p.querySelector('.sk-part'); try { const b = g.getBBox(); p.querySelector('svg').setAttribute('viewBox', `${b.x - 6} ${b.y - 6} ${b.width + 12} ${b.height + 12}`); } catch (e) { } });
    p.addEventListener('pointerdown', (e) => startDrag(e, k));
    p.addEventListener('click', () => DW.voice.say(`This is the ${DW.skeletonArt.LABELS[k].toLowerCase()}. ${DW.PHRASES.dragBone}`, { icon: '🦴' }));
  });
  el.querySelector('.tools').append(DW.button('Back', '↩️', 'red', () => DW.app.go('skeleton')));
  setTimeout(() => DW.voice.say(`${DW.PHRASES.buildSkeleton} Drag the bones.`, { icon: '🦴' }), 700);

  function startDrag(e, k) {
    if (dragging) return;
    e.preventDefault();
    const t = targets[k]._rect; if (!t) return;
    const gEl = DW.h('div', { class: 'drag-ghost' }, DW.skeletonArt.partSvg(d.id, k));
    gEl.style.width = t.w + 'px'; gEl.style.height = t.h + 'px';
    const b = ghost.querySelector(`[data-part="${k}"]`).getBBox();
    gEl.querySelector('svg').setAttribute('viewBox', `${b.x} ${b.y} ${b.width} ${b.height}`);
    gEl.querySelector('svg').setAttribute('preserveAspectRatio', 'none');
    document.body.appendChild(gEl);
    dragging = { k, el: gEl, w: t.w, h: t.h };
    move(e);
    targets[k].classList.add('hot');
    DW.sfx.pop();
    pieces[k].style.opacity = .4;
    board.setPointerCapture && document.body.setPointerCapture && 0;
  }
  function move(e) {
    if (!dragging) return;
    dragging.el.style.transform = `translate(${e.clientX - dragging.w / 2}px, ${e.clientY - dragging.h / 2}px)`;
    dragging.x = e.clientX; dragging.y = e.clientY;
    const br = board.getBoundingClientRect(), t = targets[dragging.k]._rect;
    const cx = e.clientX - br.left, cy = e.clientY - br.top;
    const near = Math.abs(cx - (t.x + t.w / 2)) < Math.max(40, t.w * 0.45) && Math.abs(cy - (t.y + t.h / 2)) < Math.max(40, t.h * 0.45);
    dragging.near = near;
    targets[dragging.k].style.borderColor = near ? '#34b13a' : '#ffd23f';
  }
  function end() {
    if (!dragging) return;
    const { k, el: gEl } = dragging;
    targets[k].classList.remove('hot'); targets[k].style.borderColor = '';
    if (dragging.near) {
      gEl.remove();
      real.insertAdjacentHTML('beforeend', built.byKey[k]);
      const g = real.querySelector(`[data-part="${k}"]`); g.animate([{ transform: 'scale(1.15)', opacity: .5 }, { transform: 'scale(1)', opacity: 1 }], { duration: 300 });
      pieces[k].classList.add('done'); pieces[k].style.opacity = '';
      DW.sfx.snap(); const r = g.getBoundingClientRect(); DW.fx.sparkles(r.left + r.width / 2, r.top + r.height / 2);
      placed++; bar.style.width = (placed / 6 * 100) + '%';
      DW.voice.say(DW.pick([DW.PHRASES.greatJob, DW.PHRASES.excellent, 'Yes! That is the ' + DW.skeletonArt.LABELS[k].toLowerCase() + '!']), { icon: '👍' });
      if (placed === 6) setTimeout(finish, 600);
    } else {
      gEl.animate([{ transform: gEl.style.transform, opacity: 1 }, { transform: gEl.style.transform + ' scale(.3)', opacity: 0 }], { duration: 250 }).onfinish = () => gEl.remove();
      pieces[k].style.opacity = '';
      DW.sfx.wrong(); DW.voice.say(DW.PHRASES.tryAgain, { icon: '🤔' });
    }
    dragging = null;
  }
  document.addEventListener('pointermove', move); document.addEventListener('pointerup', end); document.addEventListener('pointercancel', end);

  function finish() {
    DW.state.mark('skeletons', d.id); DW.state.inc('skeletons'); DW.state.mark('found', d.id);
    DW.sfx.celebrate(); DW.fx.confetti();
    DW.voice.say(`Amazing! You built a ${d.say} skeleton!`, { icon: '🎉' });
    // skeleton comes alive
    setTimeout(() => {
      const live = el.querySelector('.live'); live.style.display = 'block'; live.classList.add('morph-in');
      el.querySelector('.real').classList.add('morph-out'); el.querySelector('.ghost').style.display = 'none';
      Object.values(targets).forEach(t => t.style.display = 'none');
      DW.sfx.roar(); DW.animate(live.querySelector('svg'), 'roar', 1600);
      setTimeout(() => DW.voice.say(`Look! The ${d.say} is alive!`, { icon: d.emoji }), 1500);
      setTimeout(() => DW.ui.reward({ big: d.emoji, text: `You built a ${d.short} skeleton!`, rewards: ['🦴', '⭐'], say: DW.praise(), onClose: () => DW.app.go('hub', { id: 'desert' }) }), 4200);
      DW.state.addStars(1);
    }, 1800);
  }
  return { destroy() { removeEventListener('resize', layout); document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', end); document.removeEventListener('pointercancel', end); if (dragging) dragging.el.remove(); } };
});
