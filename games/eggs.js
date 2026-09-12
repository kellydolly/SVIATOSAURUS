/* SVIATOSAURUS — Dinosaur Eggs: tap to crack, a baby hatches and joins the collection */
window.DW = window.DW || {};

DW.app.register('eggs', function (el, params) {
  DW.sfx.ambience('camp');
  el.style.background = 'linear-gradient(180deg,#ffe98a 0%,#ffd36a 55%,#8bd46e 55%,#3d8a3a 100%)';
  const s = DW.state.get();
  el.innerHTML = `<div class="title">🥚 Dino Eggs</div><div class="game" style="justify-content:center"><div class="nest-row"></div><div class="tools"></div></div>`;
  const row = el.querySelector('.nest-row');
  const straw = `<svg viewBox="0 0 200 70" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="40" rx="98" ry="28" fill="#b98a4a"/><ellipse cx="100" cy="34" rx="84" ry="20" fill="#d9a85c"/><g stroke="#8a6230" stroke-width="3" stroke-linecap="round" opacity=".7"><path d="M 20 40 L 60 26 M 50 52 L 90 30 M 110 56 L 150 34 M 140 48 L 180 40 M 30 30 L 70 44 M 120 26 L 160 50"/></g></svg>`;
  const NEED = 5;
  DW.EGGS.forEach(e => {
    const d = DW.dino(e.id);
    const hatched = !!s.eggs[e.id];
    const n = DW.h('div', { class: 'nest' + (hatched ? ' hatched' : '') }, `<div class="egg">${DW.scenes.egg(e, 0)}</div><div class="baby${hatched ? ' show' : ''}">${DW.art.svg(d, { baby: true, cls: 'alive' })}</div><div class="straw">${straw}</div><div class="lbl">${hatched ? 'Baby ' + d.short : d.short + ' egg'}</div>${hatched ? '' : `<div class="taps">${'🥚'}</div>`}`);
    row.appendChild(n);
    let taps = 0, busy = false;
    n.addEventListener('pointerdown', () => {
      if (busy) return;
      if (n.classList.contains('hatched')) { DW.animate(n.querySelector('.baby svg'), 'happy', 1200); DW.sfx.happy(); DW.voice.say(`Hello, baby ${d.say}!`, { icon: '🐣' }); return; }
      taps++;
      const egg = n.querySelector('.egg');
      egg.classList.remove('wobble'); void egg.offsetWidth; egg.classList.add('wobble');
      DW.sfx.crack();
      const stage = Math.min(2, Math.floor(taps / 2));
      egg.innerHTML = DW.scenes.egg(e, stage);
      n.querySelector('.taps').textContent = '🥚'.repeat(Math.max(0, NEED - taps)) || '🐣';
      const r = egg.getBoundingClientRect(); DW.fx.burst(r.left + r.width / 2, r.top + r.height / 2, { n: 6, color: e.color2, size: 8, shape: 'rect' });
      if (taps === 1) DW.voice.say('Tap the egg!', { icon: '👆' });
      else if (taps === 3) DW.voice.say('It is cracking!', { icon: '🥚' });
      if (taps >= NEED) {
        busy = true;
        setTimeout(() => {
          n.classList.add('hatched'); n.querySelector('.baby').classList.add('show'); n.querySelector('.taps').remove(); n.querySelector('.lbl').textContent = 'Baby ' + d.short;
          for (let i = 0; i < 8; i++) DW.fx.burst(r.left + r.width / 2, r.top + r.height / 2, { n: 4, color: i % 2 ? e.color1 : e.color2, size: 14, shape: 'rect', speed: 9 });
          DW.sfx.discovery(); DW.sfx.dino(d.sound === 'roar' ? 'screech' : d.sound);
          DW.animate(n.querySelector('.baby svg'), 'happy', 1500);
          DW.state.mark('eggs', e.id); DW.state.mark('found', e.id);
          DW.voice.say(`A baby ${d.say}! Hello, little one!`, { icon: '🐣' });
          setTimeout(() => DW.ui.reward({ big: '🐣', text: `A baby ${d.short} hatched!`, rewards: ['🥚', '⭐'], say: `${DW.PHRASES.amazing} Let's take care of the baby!`, button: 'Take care!', onClose: () => DW.app.go('care', { id: e.id }) }), 1800);
          DW.state.addStars(1);
        }, 500);
      }
    });
  });
  el.querySelector('.tools').append(DW.button('Baby Care', '🍼', 'green', () => DW.app.go('care')), DW.button('Back', '↩️', 'red', () => DW.app.go('hub', { id: 'camp' })));
  const target = params.id && !s.eggs[params.id] ? DW.dino(params.id) : null;
  setTimeout(() => DW.voice.say(target ? `Tap the ${target.say} egg to hatch it!` : 'Tap an egg to hatch it!', { icon: '🥚' }), 700);
});
