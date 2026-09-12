/* SVIATOSAURUS — Create Your (Fantasy) Dinosaur */
window.DW = window.DW || {};

DW.app.register('creator', function (el) {
  DW.sfx.ambience('camp');
  el.style.background = 'linear-gradient(180deg,#7a4fd0,#c9a4ff)';
  const s = DW.state.get();
  const parts = Object.assign({}, DW.creatorArt.DEFAULT);
  el.innerHTML = `<div class="game"><div class="board-area"><div class="cr-area">
      <div class="cr-stage"><div class="tag">🛠️ My Fantasy Dinosaur (not a real species)</div><div class="art"></div></div>
      <div class="cr-panel"></div>
    </div></div><div class="tools"></div></div>`;
  const art = el.querySelector('.art'), panel = el.querySelector('.cr-panel');
  const LABELS = { body: 'Body', head: 'Head', eyes: 'Eyes', mouth: 'Mouth', tail: 'Tail', color: 'Color', pattern: 'Pattern' };
  const SAY = { body: 'Choose a body!', head: 'Choose a head!', eyes: 'Choose the eyes!', mouth: 'Choose a mouth!', tail: 'Choose a tail!', color: DW.PHRASES.chooseColor, pattern: 'Choose a pattern!' };
  function render(anim) {
    art.innerHTML = DW.creatorArt.svg(parts, 'alive');
    if (anim) DW.animate(art.querySelector('svg'), anim, 1200);
  }
  Object.keys(DW.creatorArt.OPTIONS).forEach(key => {
    const row = DW.h('div', { class: 'cr-row' }, `<div class="lbl">${LABELS[key]}</div>`);
    DW.creatorArt.OPTIONS[key].forEach(o => {
      const b = DW.h('button', { class: 'cr-opt' + (key === 'color' ? ' color' : '') + (parts[key] === o.id ? ' active' : ''), style: key === 'color' ? `background:${o.id}` : '' }, key === 'color' ? '' : o.ico);
      b.addEventListener('click', () => { parts[key] = o.id; row.querySelectorAll('.cr-opt').forEach(x => x.classList.toggle('active', x === b)); DW.sfx.click(); render(key === 'tail' ? 'wag' : key === 'mouth' ? 'roar' : 'surprise'); DW.voice.say(`${o.label} ${key === 'color' ? 'color' : LABELS[key].toLowerCase()}!`, { icon: o.ico }); });
      row.appendChild(b);
    });
    row.querySelector('.lbl').addEventListener('click', () => DW.voice.say(SAY[key], { icon: '🛠️' }));
    panel.appendChild(row);
  });
  const nameRow = DW.h('div', { class: 'cr-row cr-name' }, `<div class="lbl">Name</div><input type="text" maxlength="16" placeholder="Dino name…" aria-label="Dinosaur name">`);
  panel.appendChild(nameRow);
  const input = nameRow.querySelector('input');
  const suggestions = ['Rexy', 'Spike', 'Bubbles', 'Zigzag', 'Roary', 'Dotty', 'Stompy', 'Sunny'];
  nameRow.appendChild(DW.button('', '🎲', 'purple', () => { input.value = DW.pick(suggestions); DW.voice.say(`How about ${input.value}?`, { icon: '🎲' }); }));
  render();
  el.querySelector('.tools').append(
    DW.button('Roar!', '🔊', 'purple', () => { DW.animate(art.querySelector('svg'), 'roar', 1400); DW.sfx.roar(); }),
    DW.button('Random', '🎲', 'blue', () => { Object.keys(DW.creatorArt.OPTIONS).forEach(k => parts[k] = DW.pick(DW.creatorArt.OPTIONS[k]).id); panel.querySelectorAll('.cr-row').forEach(r => r.querySelectorAll('.cr-opt').forEach(b => b.classList.remove('active'))); render('surprise'); DW.sfx.sparkle(); DW.voice.say('Surprise!', { icon: '🎲' }); }),
    DW.button('Done!', '✨', 'green', () => {
      const name = (input.value || '').trim() || DW.pick(suggestions);
      s.fantasy.unshift({ name, parts: Object.assign({}, parts) }); s.fantasy = s.fantasy.slice(0, 8); DW.state.save(); DW.state.addStars(1);
      DW.animate(art.querySelector('svg'), 'happy', 1500); DW.sfx.celebrate(); DW.fx.confetti();
      DW.voice.say(`My dinosaur is ready! Its name is ${name}!`, { icon: '🎉' });
      setTimeout(() => DW.ui.reward({ big: '🛠️', text: `${name} is ready!`, sub: 'My Fantasy Dinosaur', rewards: ['⭐'], say: `${name} says hello!`, onClose: () => DW.app.go('collection') }), 1200);
    }),
    DW.button('Back', '↩️', 'red', () => DW.app.go('hub', { id: 'camp' }))
  );
  setTimeout(() => DW.voice.say('Make your own fantasy dinosaur! Pick the parts.', { icon: '🛠️' }), 700);
});
