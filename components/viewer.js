/* SVIATOSAURUS — Dinosaur Viewer (encyclopedia card with interactions) + Encyclopedia grid + Size comparison */
window.DW = window.DW || {};

DW.app.register('viewer', function (el, params) {
  const d = DW.dino(params.id);
  const s = DW.state.get();
  DW.state.mark('found', d.id);
  const maxLen = 26;

  el.innerHTML = `
    <div class="viewer">
      <div class="stage card" style="background:linear-gradient(180deg,#eaf6ff,#cfe9d8)">
        <div class="floor"></div>
        <div class="turntable">${DW.art.svg(d, { cls: 'alive' })}</div>
      </div>
      <div class="info card">
        <h1>${d.emoji} ${d.name}</h1>
        <div class="row"><span class="ico">🕰️</span><div>${d.period}<small>${d.years}</small></div></div>
        <div class="row"><span class="ico">📏</span><div>About ${d.lengthM} meters long<small>${d.weight}</small></div></div>
        <div class="row"><span class="ico">${d.dietIcon}</span><div>${d.diet}<small>It ate ${d.food}</small></div></div>
        <div class="row"><span class="ico">🌍</span><div>${d.habitatShort}<small>${d.habitat}</small></div></div>
        <div class="sizebar"><b>Size</b> 👦 = a child, ${d.short} = <b>${d.lengthM} m</b><div class="track"><div class="fill" style="width:0%"></div><div class="kid" style="left:${(1.1 / maxLen) * 100}%">👦</div><div class="kid" style="left:${(4.5 / maxLen) * 100}%">🚗</div><div class="kid" style="left:${(10 / maxLen) * 100}%">🚌</div></div></div>
        <div class="fact">✨ ${d.facts[0]}</div>
        <div class="note">🔊 ${d.soundNote}</div>
      </div>
      <div class="actions"></div>
    </div>`;
  setTimeout(() => { el.querySelector('.fill').style.width = (d.lengthM / maxLen * 100) + '%'; }, 400);

  const svg = el.querySelector('.turntable svg');
  const tt = el.querySelector('.turntable');
  const factEl = el.querySelector('.fact');
  let factI = 0;

  DW.voice.say(`This is a ${d.say}. ${d.short} was a ${d.diet.toLowerCase()}.`, { icon: d.emoji });

  /* ---- 360° turntable: drag to rotate ---- */
  let angle = 0, dragging = false, lastX = 0, autoSpin = null;
  const setAngle = () => { tt.style.transform = `rotateY(${angle}deg)`; };
  tt.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; tt.setPointerCapture(e.pointerId); clearInterval(autoSpin); });
  tt.addEventListener('pointermove', (e) => { if (!dragging) return; angle += (e.clientX - lastX) * 0.6; lastX = e.clientX; setAngle(); });
  tt.addEventListener('pointerup', (e) => { dragging = false; });
  tt.addEventListener('pointercancel', () => { dragging = false; });
  tt.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('.dw-head')) call(); else if (t.closest('.dw-tail')) { DW.animate(svg, 'wag', 1800); DW.sfx.whoosh(); }
    else if (t.closest('.dw-leg')) { DW.animate(svg, 'stomp', 1100); DW.sfx.stomp(); DW.fx.shake(); }
    else if (t.closest('.dw-plates, .dw-sail')) { DW.animate(svg, 'plates', 1600); DW.sfx.sparkle(); }
    else pet();
  });

  function headPoint() { const h = svg.querySelector('.dw-head'); const r = (h || svg).getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
  function call() { DW.animate(svg, d.diet === 'Carnivore' ? 'roar' : 'teeth', 1400); DW.sfx.dino(d.sound); setTimeout(() => DW.voice.say(d.soundNote, { icon: '🔊' }), 900); }
  function pet() { DW.animate(svg, 'happy', 1300); DW.sfx.purr(); DW.sfx.happy(); DW.fx.hearts(...headPoint()); DW.state.inc('petted'); DW.voice.say(DW.pick([`${d.short} likes that!`, 'So soft!', `${d.short} is happy!`]), { icon: '💚' }); }
  let food = null;
  function feed() {
    if (food) food.cancel();
    const kind = d.food, word = kind === 'meat' ? 'meat' : kind === 'fish' ? 'fish' : 'leaf';
    DW.sfx.pop(); DW.voice.say(`Drag the ${word} to the ${d.say}!`, { icon: '👆' });
    food = DW.dragProp({
      html: DW.props.food(kind), fromEl: bFeed, targets: [{ el: tt, data: d }],
      onMiss: () => DW.voice.say(`Drag it to the ${d.say}!`, { icon: '👆' }),
      onDrop: (_, x, y) => {
        food = null; DW.animate(svg, 'eat', 1700); d.diet === 'Carnivore' ? DW.sfx.chomp() : DW.sfx.munch();
        DW.fx.burst(x, y, { n: 12, color: d.diet === 'Carnivore' ? '#d94a5a' : '#5ec25a', size: 8 });
        setTimeout(() => { DW.voice.say(DW.PHRASES.yummy, { icon: '😋' }); DW.state.inc('fed'); DW.fx.hearts(...headPoint()); }, 1200);
      }
    });
  }
  function fact() {
    factI = (factI + 1) % d.facts.length;
    factEl.innerHTML = '✨ ' + d.facts[factI];
    factEl.animate([{ transform: 'scale(.96)', opacity: .5 }, { transform: 'scale(1)', opacity: 1 }], { duration: 300 });
    DW.sfx.sparkle(); DW.voice.say(d.facts[factI], { icon: '✨' });
  }
  function turn() {
    clearInterval(autoSpin);
    let n = 0; DW.sfx.whoosh();
    autoSpin = setInterval(() => { angle += 6; n += 6; setAngle(); if (n >= 360) clearInterval(autoSpin); }, 16);
  }

  const acts = el.querySelector('.actions');
  const bFeed = DW.button('Feed', DW.props.food(d.food), '', feed);
  acts.append(
    DW.button('Pet', '🖐️', 'green', pet),
    bFeed,
    DW.button('Sound', '🔊', 'purple', call),
    DW.button('Fact', '✨', 'blue', fact),
    DW.button('Turn', '🔄', 'white', turn),
    DW.button('Back', '↩️', 'red', () => params.back ? DW.app.go(params.back.screen, params.back.params) : DW.app.go('encyclopedia'))
  );
  return { destroy() { clearInterval(autoSpin); if (food) food.cancel(); } };
});

/* ---------- Encyclopedia grid ---------- */
DW.app.register('encyclopedia', function (el) {
  DW.sfx.ambience('museum');
  el.innerHTML = `<div class="title">📖 Dino Encyclopedia</div><div class="grid-wrap"><div class="dino-grid"></div></div>`;
  el.style.background = 'linear-gradient(180deg,#7a5bc4,#d9c6ff)';
  const g = el.querySelector('.dino-grid');
  DW.DINOS.forEach(d => {
    const c = DW.h('button', { class: 'dino-card' }, DW.art.svg(d) + `<div class="nm">${d.name}</div>`);
    c.addEventListener('click', () => { DW.sfx.pop(); DW.app.go('viewer', { id: d.id }); });
    g.appendChild(c);
  });
  DW.voice.say('Tap a dinosaur!', { icon: '👆' });
  const back = DW.button('Back', '↩️', 'red', () => DW.app.go('hub', { id: 'museum' }));
  const bar = DW.h('div', { class: 'bottom-bar' }); bar.appendChild(back); el.appendChild(bar);
});

/* ---------- Size comparison ---------- */
DW.app.register('size', function (el) {
  DW.sfx.ambience('museum');
  el.style.background = 'linear-gradient(180deg,#8fdcff 0%,#dff6ff 60%,#8bd46e 60%,#3d8a3a 100%)';
  el.innerHTML = `<div class="title">📏 How BIG?</div>
    <div class="size-stage"><div class="size-scene"></div><div class="size-ground"></div></div>
    <div class="size-picker"></div>`;
  const scene = el.querySelector('.size-scene');
  const picker = el.querySelector('.size-picker');
  const refs = [
    { key: 'child', label: 'Child', h: 1.1, w: 0.5, html: '<div class="ref-emoji">👦</div>' },
    { key: 'adult', label: 'Adult', h: 1.8, w: 0.6, html: '<div class="ref-emoji">🧍</div>' },
    { key: 'car', label: 'Car', h: 1.5, w: 4.5, html: '<div class="ref-emoji">🚗</div>' },
    { key: 'house', label: 'House', h: 8, w: 9, html: '<div class="ref-emoji">🏠</div>' }
  ];
  let cur = 'trex';
  function render() {
    const d = DW.dino(cur);
    const artH = d.lengthM * 0.65 * (d.template === 'sauropod' && d.variant === 'brachiosaurus' ? 1.0 : d.template === 'sauropod' ? 0.75 : 0.85); // rough visual height of the art box in meters
    const tallest = Math.max(artH, 8);
    const stageH = scene.clientHeight * 0.9;
    const ppm = stageH / tallest; // pixels per meter
    scene.innerHTML = '';
    let x = 2;
    refs.forEach(r => {
      const item = DW.h('div', { class: 'size-item ref', style: `left:${x}%; height:${r.h * ppm}px; width:${Math.max(r.w * ppm, 40)}px;` }, r.html + `<div class="size-lbl">${r.label}<br>${r.h} m</div>`);
      scene.appendChild(item);
      x += Math.max(r.w * ppm, 40) / scene.clientWidth * 100 + 3;
    });
    const boxH = artH * ppm, boxW = boxH / DW.art.aspect(d);
    const dinoEl = DW.h('div', { class: 'size-item dino-size', style: `left:${x}%; height:${boxH}px; width:${boxW}px;` }, DW.art.svg(d, { cls: 'alive' }) + `<div class="size-lbl">${d.short}<br>${d.lengthM} m long</div>`);
    scene.appendChild(dinoEl);
    dinoEl.animate([{ transform: 'scale(.3)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 600, easing: 'cubic-bezier(.2,.9,.3,1.3)' });
    DW.sfx.pop();
    DW.voice.say(d.lengthM >= 12 ? `Wow! Look how BIG the ${d.say} was!` : d.lengthM <= 3 ? `The ${d.say} was small, like a big bird!` : `The ${d.say} was as long as a bus!`, { icon: '📏' });
  }
  DW.DINOS.forEach(d => {
    const b = DW.button(d.short, d.emoji, 'white', () => { cur = d.id; render(); picker.querySelectorAll('.btn').forEach(x => x.classList.toggle('active-tool', x === b)); });
    if (d.id === cur) b.classList.add('active-tool');
    picker.appendChild(b);
  });
  picker.appendChild(DW.button('Back', '↩️', 'red', () => DW.app.go('hub', { id: 'museum' })));
  setTimeout(render, 450);
  const onR = () => render();
  addEventListener('resize', onR);
  return { destroy() { removeEventListener('resize', onR); } };
});
