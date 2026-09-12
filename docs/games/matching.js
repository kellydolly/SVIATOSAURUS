/* SVIATOSAURUS — Matching: dinosaur → food, and baby → adult */
window.DW = window.DW || {};

DW.app.register('matching', function (el, params) {
  DW.sfx.ambience('museum');
  el.style.background = 'linear-gradient(180deg,#e04a5a,#ff9c9c)';
  const mode = params.mode || 'food';
  const pool = mode === 'food' ? DW.shuffle(['trex', 'triceratops', 'brachiosaurus', 'spinosaurus', 'stegosaurus', 'velociraptor']).slice(0, 3) : DW.shuffle(DW.DINOS.map(d => d.id)).slice(0, 3);
  // make sure food mode has different answers where possible
  el.innerHTML = `<div class="title">${mode === 'food' ? '🍖 Who eats what?' : '🐣 Baby and grown-up'}</div><div class="game"><div class="board-area"><div class="mt-area"><div class="mt-col left"></div><div class="mt-col right"></div></div></div><div class="tools"></div></div>`;
  const left = el.querySelector('.left'), right = el.querySelector('.right');
  const targets = [], drags = [];
  pool.forEach(id => {
    const d = DW.dino(id);
    const t = DW.h('div', { class: 'mt-card' }, (mode === 'food' ? DW.art.svg(d) : DW.art.svg(d)) + `<span>${d.short}</span>`);
    t.dataset.id = id; left.appendChild(t); targets.push(t);
    t.addEventListener('click', () => DW.voice.say(mode === 'food' ? `${d.say}. What does it eat?` : `This is a grown-up ${d.say}.`, { icon: d.emoji }));
  });
  DW.shuffle(pool).forEach(id => {
    const d = DW.dino(id);
    const c = DW.h('div', { class: 'mt-card drag' }, mode === 'food' ? `<span class="big prop-wrap">${DW.props.food(d.food)}</span><span>${d.food}</span>` : DW.art.svg(d, { baby: true }) + `<span>baby</span>`);
    c.dataset.id = id; c.dataset.food = d.food; right.appendChild(c); drags.push(c);
    c.addEventListener('pointerdown', (e) => start(e, c));
  });
  el.querySelector('.tools').append(
    DW.button(mode === 'food' ? 'Babies' : 'Food', mode === 'food' ? '🐣' : '🍖', 'purple', () => DW.app.go('matching', { mode: mode === 'food' ? 'baby' : 'food' })),
    DW.button('New', '🔀', 'green', () => DW.app.go('matching', { mode })),
    DW.button('Back', '↩️', 'red', () => DW.app.go('hub', { id: 'museum' })));
  setTimeout(() => DW.voice.say(mode === 'food' ? 'Feed the dinosaurs! Drag the food to the right dinosaur.' : 'Find the baby for each dinosaur!', { icon: '👆' }), 700);

  let dragging = null, matched = 0;
  function start(e, c) {
    if (dragging || c.classList.contains('gone')) return; e.preventDefault();
    const r = c.getBoundingClientRect();
    const g = c.cloneNode(true); g.classList.add('drag-ghost'); g.style.width = r.width + 'px'; g.style.height = r.height + 'px'; g.style.position = 'fixed'; g.style.left = '0'; g.style.top = '0'; g.style.margin = '0';
    document.body.appendChild(g);
    dragging = { c, g, ox: e.clientX - r.left, oy: e.clientY - r.top }; c.style.opacity = .35; move(e); DW.sfx.pop();
  }
  function move(e) {
    if (!dragging) return;
    dragging.g.style.transform = `translate(${e.clientX - dragging.ox}px, ${e.clientY - dragging.oy}px)`;
    const t = under(e.clientX, e.clientY); targets.forEach(x => x.classList.toggle('hot', x === t));
  }
  function under(x, y) { return targets.find(t => { const r = t.getBoundingClientRect(); return !t.classList.contains('matched') && x > r.left && x < r.right && y > r.top && y < r.bottom; }); }
  function end(e) {
    if (!dragging) return;
    const t = under(e.clientX, e.clientY); targets.forEach(x => x.classList.remove('hot'));
    const { c, g } = dragging; g.remove(); c.style.opacity = '';
    if (t) {
      const td = DW.dino(t.dataset.id), ok = mode === 'food' ? td.food === c.dataset.food : t.dataset.id === c.dataset.id;
      if (ok) {
        t.classList.add('matched'); t.insertAdjacentHTML('beforeend', '<span class="chk">✅</span>'); c.classList.add('gone'); matched++;
        const svg = t.querySelector('svg'); svg.classList.add('alive'); DW.animate(svg, mode === 'food' ? 'eat' : 'happy', 1500);
        mode === 'food' ? (td.diet === 'Carnivore' ? DW.sfx.chomp() : DW.sfx.munch()) : DW.sfx.happy();
        const r = t.getBoundingClientRect(); DW.fx.sparkles(r.left + r.width / 2, r.top + r.height / 2);
        DW.voice.say(mode === 'food' ? `Yes! ${td.short} eats ${td.food}. ${DW.PHRASES.yummy}` : `Yes! Baby ${td.say}!`, { icon: '👍' });
        if (mode === 'food') DW.state.inc('fed');
        if (matched === targets.length) { DW.state.inc('matches'); DW.state.addStars(1); setTimeout(() => DW.ui.reward({ big: '🌟', text: 'All matched!', rewards: ['⭐'], say: DW.PHRASES.excellent, onClose: () => DW.app.go('matching', { mode }) }), 900); }
      } else { DW.sfx.wrong(); t.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }], { duration: 300 }); DW.voice.say(mode === 'food' ? `No. ${td.short} does not eat ${c.dataset.food}. Try again!` : DW.PHRASES.tryAgain, { icon: '🤔' }); }
    }
    dragging = null;
  }
  document.addEventListener('pointermove', move); document.addEventListener('pointerup', end); document.addEventListener('pointercancel', end);
  return { destroy() { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', end); document.removeEventListener('pointercancel', end); if (dragging) dragging.g.remove(); } };
});
