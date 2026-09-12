/* SVIATOSAURUS — Baby Dinosaur Care: drag food & water to the baby, stroke it, play ball, put it to sleep (no timers, no economy) */
window.DW = window.DW || {};

DW.app.register('care', function (el, params) {
  DW.sfx.ambience('camp');
  el.style.background = 'linear-gradient(180deg,#4ab06a,#b8f0c8)';
  const s = DW.state.get();
  const hatched = DW.EGGS.filter(e => s.eggs[e.id]).map(e => e.id);

  if (!hatched.length) {
    el.innerHTML = `<div class="title">🍼 Baby Care</div>`;
    const ch = DW.h('div', { class: 'chooser' }, `<div class="title-inline">Hatch an egg first! 🥚</div>`);
    ch.append(DW.button('Go to the eggs', '🥚', 'green big', () => DW.app.go('eggs')), DW.button('Back', '↩️', 'red', () => DW.app.go('hub', { id: 'camp' })));
    el.appendChild(ch); DW.voice.say('Hatch an egg first!', { icon: '🥚' }); return;
  }
  const id = params.id && hatched.includes(params.id) ? params.id : hatched[0];
  const d = DW.dino(id);
  el.innerHTML = `<div class="game"><div class="board-area"><div class="care-stage">
      <div class="care-name">🐣 Baby ${d.short}</div><div class="care-meter"></div>
      <div class="baby">${DW.art.svg(d, { baby: true, cls: 'alive' })}</div>
    </div></div><div class="tools"></div></div>`;
  const stage = el.querySelector('.care-stage'), baby = el.querySelector('.baby'), svg = baby.querySelector('svg'), meter = el.querySelector('.care-meter');
  let happy = 2, busy = false, asleep = false, prop = null;
  const renderMeter = () => { meter.innerHTML = [0, 1, 2, 3, 4].map(i => `<span class="${i < happy ? '' : 'dim'}">❤️</span>`).join(''); };
  renderMeter();
  const bump = () => { happy = Math.min(5, happy + 1); renderMeter(); DW.state.inc('care'); if (happy === 5) DW.fx.hearts(...headPt()); };
  function headPt() { const h = svg.querySelector('.dw-head'); const r = (h || svg).getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
  function wake() { if (asleep) { asleep = false; stage.classList.remove('night'); svg.classList.remove('sleep'); stage.querySelectorAll('.zzz').forEach(z => z.remove()); } }
  const foodWord = d.food === 'meat' ? 'meat' : d.food === 'fish' ? 'fish' : 'leaf';

  function offer(kind, fromBtn, onEat) {
    if (prop) prop.cancel();
    wake(); DW.sfx.pop();
    DW.voice.say(`Drag the ${kind === 'water' ? 'water' : foodWord} to the baby!`, { icon: '👆' });
    prop = DW.dragProp({
      html: kind === 'water' ? DW.props.water() : DW.props.food(d.food), fromEl: fromBtn,
      targets: [{ el: baby, data: 'baby' }],
      onMiss: () => DW.voice.say('Drag it to the baby!', { icon: '👆' }),
      onDrop: (_, x, y) => { prop = null; onEat(x, y); }
    });
  }

  const tools = el.querySelector('.tools');
  const bFeed = DW.button('Feed', DW.props.food(d.food), '', () => offer('food', bFeed, (x, y) => {
    DW.animate(svg, 'eat', 1600); d.diet === 'Carnivore' ? DW.sfx.chomp() : DW.sfx.munch();
    DW.fx.burst(x, y, { n: 10, color: d.diet === 'Carnivore' ? '#d94a5a' : '#5ec25a', size: 8 });
    setTimeout(() => { DW.voice.say(DW.PHRASES.yummy, { icon: '😋' }); bump(); DW.state.inc('fed'); }, 1200);
  }));
  const bWater = DW.button('Water', DW.props.water(), 'blue', () => offer('water', bWater, (x, y) => {
    DW.animate(svg, 'eat', 1400); DW.sfx.drink(); DW.fx.burst(x, y, { n: 12, color: '#4cc9f0', size: 8 });
    setTimeout(() => { DW.voice.say('Glug glug! Thank you!', { icon: '💧' }); bump(); }, 1100);
  }));
  const bPet = DW.button('Pet', '🖐️', 'green', () => { wake(); DW.voice.say('Stroke the baby!', { icon: '🖐️' }); baby.animate([{ transform: 'translateX(-50%) scale(1)' }, { transform: 'translateX(-50%) scale(1.05)' }, { transform: 'translateX(-50%) scale(1)' }], { duration: 500 }); });
  const bPlay = DW.button('Play', DW.props.ball(), 'purple', () => { if (busy) return; busy = true; wake(); DW.voice.say("Let's play ball!", { icon: '⚽' }); play(); });
  const bSleep = DW.button('Sleep', '😴', 'white', () => {
    if (busy) return;
    if (asleep) { wake(); DW.voice.say('Good morning!', { icon: '🌞' }); DW.sfx.happy(); return; }
    asleep = true; stage.classList.add('night'); svg.classList.add('sleep'); DW.sfx.yawn();
    DW.voice.say('Shh. The baby is sleeping. Good night!', { icon: '🌙' });
    const r = baby.getBoundingClientRect(), sr = stage.getBoundingClientRect();
    for (let i = 0; i < 3; i++) stage.appendChild(DW.h('div', { class: 'zzz', style: `left:${r.left - sr.left + r.width * 0.3}px; top:${r.top - sr.top}px; animation-delay:${i * 0.6}s` }, '💤'));
    bump();
  });
  tools.append(bFeed, bWater, bPet, bPlay, bSleep);
  if (hatched.length > 1) tools.append(DW.button('Other baby', '🔁', 'blue', () => DW.app.go('care', { id: hatched[(hatched.indexOf(id) + 1) % hatched.length] })));
  tools.append(DW.button('Back', '↩️', 'red', () => DW.app.go('hub', { id: 'camp' })));

  /* stroking with a finger = petting; tapping the head = a little squeak */
  let strokeN = 0, strokeLast = 0, pressed = false;
  baby.addEventListener('pointerdown', (e) => {
    wake(); pressed = true; strokeN = 0;
    if (e.target.closest('.dw-head')) { DW.animate(svg, 'roar', 1000); DW.sfx.screech(); }
    else { DW.animate(svg, 'happy', 1000); DW.sfx.happy(); }
  });
  baby.addEventListener('pointermove', (e) => {
    if (!pressed || e.buttons === 0) return;
    const now = performance.now(); if (now - strokeLast < 150) return; strokeLast = now; strokeN++;
    DW.fx.hearts(e.clientX, e.clientY);
    if (strokeN === 5) { DW.animate(svg, 'happy', 1300); DW.sfx.purr(); DW.voice.say(DW.pick(['So soft!', 'The baby loves you!', 'Happy baby!']), { icon: '💚' }); bump(); DW.state.inc('petted'); strokeN = -30; }
  });
  document.addEventListener('pointerup', () => { pressed = false; });

  function play() {
    const ball = DW.h('div', { class: 'ball' }, DW.props.ball()); stage.appendChild(ball);
    const sr = stage.getBoundingClientRect(); let x = sr.width * 0.15, y = sr.height * 0.3, vx = 4, vy = 0, t = 0;
    const br = baby.getBoundingClientRect(); const bx = br.left - sr.left + br.width * 0.3, by = br.top - sr.top + br.height * 0.5;
    const tick = () => {
      t++; vy += 0.5; x += vx; y += vy;
      const floor = sr.height * 0.85;
      if (y > floor) { y = floor; vy = -Math.abs(vy) * 0.75; DW.sfx.bounce(); }
      if (Math.abs(x - bx) < 40 && Math.abs(y - by) < 80 && t > 20) { vx = -vx * 1.1; DW.animate(svg, 'happy', 700); DW.sfx.pop(); DW.fx.sparkles(sr.left + x, sr.top + y); }
      if (x < 0 || x > sr.width - 40) vx = -vx;
      ball.style.left = x + 'px'; ball.style.top = y + 'px';
      if (t < 260) requestAnimationFrame(tick); else { ball.remove(); DW.voice.say('That was fun!', { icon: '⚽' }); bump(); busy = false; }
    };
    tick();
  }
  setTimeout(() => DW.voice.say(`This is your baby ${d.say}. Take care of it!`, { icon: '🐣' }), 700);
  return { destroy() { if (prop) prop.cancel(); } };
});
