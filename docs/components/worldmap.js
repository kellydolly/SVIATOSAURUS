/* SVIATOSAURUS — World Map screen */
window.DW = window.DW || {};

DW.app.register('map', function (el) {
  el.innerHTML = DW.scenes.map() + `<div class="map-title">🦖 SVIATOSAURUS</div>`;
  DW.sfx.ambience('jungle');

  const pos = {
    volcano: { l: [18, 32], p: [28, 20] },
    jungle: { l: [50, 26], p: [72, 20] },
    lagoon: { l: [82, 34], p: [28, 46] },
    desert: { l: [22, 76], p: [72, 46] },
    museum: { l: [52, 78], p: [28, 72] },
    camp: { l: [82, 78], p: [72, 72] }
  };
  const s = DW.state.get();
  const peekDino = { volcano: 'trex', jungle: 'brachiosaurus', lagoon: 'spinosaurus', desert: null, museum: null, camp: null };

  DW.LOCATIONS.forEach((loc, i) => {
    const p = pos[loc.id];
    const b = DW.h('button', { class: 'loc', style: `--lx:${p.l[0]}%;--ly:${p.l[1]}%;--px:${p.p[0]}%;--py:${p.p[1]}%;--c1:${loc.color1};--c2:${loc.color2};animation-delay:${-i * 0.5}s` });
    b.innerHTML = `<div class="disc"><span class="ico">${loc.emoji}</span>${peekDino[loc.id] ? `<div class="peek">${DW.art.svg(peekDino[loc.id])}</div>` : ''}${!s.visited[loc.id] ? '<span class="newdot">NEW</span>' : ''}</div><div class="lbl">${loc.name}</div>`;
    b.addEventListener('click', () => {
      DW.sfx.pop();
      s.visited[loc.id] = true; DW.state.save();
      DW.voice.say(loc.say, { icon: loc.emoji });
      if (loc.type === 'habitat') DW.app.go('habitat', { id: loc.id });
      else DW.app.go('hub', { id: loc.id });
    });
    el.appendChild(b);
  });
});
