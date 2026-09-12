/* SVIATOSAURUS — Hub screens: Fossil Desert, Fossil Museum, Dino Camp */
window.DW = window.DW || {};

DW.app.register('hub', function (el, params) {
  const loc = DW.LOCATIONS.find(l => l.id === params.id);
  const s = DW.state.get();
  DW.sfx.ambience(loc.id);
  const bg = {
    desert: 'linear-gradient(180deg,#ffd58a 0%,#ffb95c 55%,#e7a24f 55%,#c47c2e 100%)',
    museum: 'linear-gradient(180deg,#5b3fa0 0%,#8f6fd6 55%,#e6e0f5 55%,#c9bfe0 100%)',
    camp: 'linear-gradient(180deg,#1e2a5a 0%,#4b5fb0 45%,#67b25a 45%,#2f7a3a 100%)'
  }[loc.id];
  el.style.background = bg;

  const tiles = {
    desert: [
      { ico: '⛏️', lbl: 'Fossil Dig', tile: 'linear-gradient(180deg,#ffb35c,#d9782a)', go: ['dig'] },
      { ico: '🦴', lbl: 'Build a Skeleton', tile: 'linear-gradient(180deg,#e9dfc8,#b59c72)', go: ['skeleton'] },
      { ico: '🧩', lbl: 'Dino Puzzles', tile: 'linear-gradient(180deg,#8fd3ff,#3a8fe0)', go: ['puzzle'] }
    ],
    museum: [
      { ico: '📖', lbl: 'Encyclopedia', tile: 'linear-gradient(180deg,#c9a4ff,#7a4fd0)', go: ['encyclopedia'] },
      { ico: '📏', lbl: 'How BIG?', tile: 'linear-gradient(180deg,#8fd3ff,#3a8fe0)', go: ['size'] },
      { ico: '🎒', lbl: 'My Collection', tile: 'linear-gradient(180deg,#ffd36a,#e0782a)', go: ['collection'] },
      { ico: '🍖', lbl: 'Matching', tile: 'linear-gradient(180deg,#ff9c9c,#e04a5a)', go: ['matching'] },
      { ico: '⭐', lbl: 'Missions', tile: 'linear-gradient(180deg,#ffe98a,#e0a12a)', go: ['missions'] }
    ],
    camp: [
      { ico: '🎨', lbl: 'Draw a Dino', tile: 'linear-gradient(180deg,#ff9cc8,#d64a8a)', go: ['draw'] },
      { ico: '🥚', lbl: 'Dino Eggs', tile: 'linear-gradient(180deg,#fff0b8,#e0b25a)', go: ['eggs'] },
      { ico: '🍼', lbl: 'Baby Care', tile: 'linear-gradient(180deg,#b8f0c8,#4ab06a)', go: ['care'] },
      { ico: '🛠️', lbl: 'Create a Dino', tile: 'linear-gradient(180deg,#c9a4ff,#7a4fd0)', go: ['creator'] },
      { ico: '🧩', lbl: 'Dino Puzzles', tile: 'linear-gradient(180deg,#8fd3ff,#3a8fe0)', go: ['puzzle'] },
      { ico: '⭐', lbl: 'Missions', tile: 'linear-gradient(180deg,#ffe98a,#e0a12a)', go: ['missions'] }
    ]
  }[loc.id];

  const deco = {
    desert: `<svg class="layer" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none">${DW.scenes.sun(860, 90, 50)}${DW.scenes.cloud(200, 90, 0.6, 80)}<path d="M 0 340 C 200 280 400 330 600 300 C 800 270 900 320 1000 300 L 1000 340 L 0 340 Z" fill="#f0b76a" opacity=".8"/>${DW.scenes.rock(120, 560, 1.6, '#c98a4b')}${DW.scenes.rock(900, 570, 1.3, '#d69a58')}<g fill="#3f9e4a"><rect x="60" y="440" width="22" height="90" rx="11"/><rect x="40" y="470" width="18" height="40" rx="9"/><rect x="84" y="460" width="18" height="46" rx="9"/></g><g fill="#e9e4d4" opacity=".8"><path d="M 480 560 C 500 540 540 540 560 560 Z"/><circle cx="470" cy="560" r="8"/><circle cx="570" cy="560" r="8"/></g></svg>`,
    museum: `<svg class="layer" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none"><g fill="#fff" opacity=".9"><rect x="80" y="120" width="40" height="230" rx="8"/><rect x="200" y="120" width="40" height="230" rx="8"/><rect x="760" y="120" width="40" height="230" rx="8"/><rect x="880" y="120" width="40" height="230" rx="8"/><rect x="40" y="90" width="920" height="30" rx="10"/><path d="M 30 90 L 500 10 L 970 90 Z" opacity=".9"/></g><g fill="#ffd93d">${[...Array(8)].map((_, i) => `<circle cx="${140 + i * 100}" cy="${40 + (i % 2) * 10}" r="4"/>`).join('')}</g></svg>`,
    camp: `<svg class="layer" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none"><g fill="#fff">${[...Array(30)].map((_, i) => `<circle cx="${(i * 137) % 1000}" cy="${(i * 71) % 230}" r="${1.5 + (i % 3)}" opacity=".8"/>`).join('')}</g><circle cx="860" cy="80" r="40" fill="#fff6c8"/><circle cx="846" cy="70" r="34" fill="#4b5fb0"/><path d="M 100 270 L 220 120 L 340 270 Z" fill="#e8562a"/><path d="M 100 270 L 220 120 L 220 270 Z" fill="#c23f1e"/><path d="M 190 270 L 220 200 L 250 270 Z" fill="#5a2a1a"/><g><ellipse cx="700" cy="275" rx="60" ry="14" fill="#5a3a22"/><path d="M 670 270 C 660 240 690 220 700 200 C 710 230 740 240 730 270 Z" fill="#ff7a1f"/><path d="M 684 270 C 680 250 698 240 700 222 C 706 244 720 250 716 270 Z" fill="#ffd23f"/></g>${DW.scenes.palm(940, 280, 0.9, true)}${DW.scenes.bush(500, 285, 0.8, '#2f8a44')}</svg>`
  }[loc.id];

  const grid = DW.h('div', { class: 'hub-grid' });
  tiles.forEach(t => {
    const b = DW.h('button', { class: 'hub-tile', style: `--tile:${t.tile}` }, `<div class="ico">${t.ico}</div><div class="lbl">${t.lbl}</div>`);
    b.addEventListener('click', () => { DW.sfx.pop(); DW.app.go(t.go[0], t.go[1] || {}); });
    grid.appendChild(b);
  });
  el.innerHTML = deco + `<div class="title">${loc.emoji} ${loc.name}</div>`;
  const hub = DW.h('div', { class: 'hub' }); hub.appendChild(grid); el.appendChild(hub);
  setTimeout(() => DW.voice.say({ desert: "Let's dig for fossils!", museum: 'Welcome to the museum!', camp: 'Welcome to Dino Camp!' }[loc.id], { icon: loc.emoji }), 900);
});
