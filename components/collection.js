/* SVIATOSAURUS — My Dino Collection: dinosaurs, fossils, eggs, badges, drawings, fantasy dinos */
window.DW = window.DW || {};

DW.app.register('collection', function (el) {
  const s = DW.state.get();
  DW.sfx.ambience('museum');
  el.style.background = 'linear-gradient(180deg,#2a8ff0,#9fe0ff)';
  const foundN = Object.keys(s.found).length;
  el.innerHTML = `<div class="title">🎒 My Dino Collection</div><div class="grid-wrap">
      <div class="section-h">🦖 Dinosaurs ${foundN} / ${DW.DINOS.length}</div><div class="dino-grid dinos"></div>
      <div class="section-h">🦴 Fossils</div><div class="item-row fossils"></div>
      <div class="section-h">🥚 Eggs</div><div class="item-row eggs"></div>
      <div class="section-h">🏆 Badges</div><div class="item-row badges"></div>
      <div class="section-h">🎨 My Drawings</div><div class="item-row drawings"></div>
      <div class="section-h">🛠️ My Fantasy Dinosaurs</div><div class="item-row fantasy"></div>
    </div>`;
  const dg = el.querySelector('.dinos');
  DW.DINOS.forEach(d => {
    const found = !!s.found[d.id];
    const c = DW.h('button', { class: 'dino-card' + (found ? '' : ' locked') }, DW.art.svg(d) + `<div class="nm">${found ? d.name : '???'}</div>${found ? '<span class="chk">✅</span>' : ''}`);
    c.addEventListener('click', () => {
      if (found) { DW.sfx.pop(); DW.app.go('viewer', { id: d.id, back: { screen: 'collection' } }); }
      else { DW.sfx.wrong(); DW.voice.say(`Who is this? Find it in ${DW.LOCATIONS.find(l => l.id === d.location).name}!`, { icon: '❓' }); }
    });
    dg.appendChild(c);
  });
  const fr = el.querySelector('.fossils');
  DW.FOSSILS.forEach(id => {
    const d = DW.dino(id), has = !!s.fossils[id];
    fr.appendChild(DW.h('div', { class: 'item' + (has ? '' : ' locked') }, (has ? DW.skeletonArt.svg(id) : '<div class="ico">🦴</div>') + `<div>${has ? d.short + ' fossil' : '???'}</div>`));
  });
  const er = el.querySelector('.eggs');
  DW.EGGS.forEach(e => {
    const d = DW.dino(e.id), has = !!s.eggs[e.id];
    er.appendChild(DW.h('div', { class: 'item' + (has ? '' : ' locked') }, (has ? DW.art.svg(d, { baby: true }) : DW.scenes.egg(e, 0)) + `<div>${has ? 'Baby ' + d.short : '???'}</div>`));
  });
  const br = el.querySelector('.badges');
  DW.BADGES.forEach(b => {
    const has = !!s.badges[b.id];
    br.appendChild(DW.h('div', { class: 'item' + (has ? '' : ' locked') }, `<div class="ico">${has ? b.ico : '🔒'}</div><div>${has ? b.text : '???'}</div>`));
  });
  const dr = el.querySelector('.drawings');
  if (!s.drawings.length) dr.innerHTML = '<div class="item locked"><div class="ico">🎨</div><div>Draw one!</div></div>';
  s.drawings.forEach(url => dr.appendChild(DW.h('div', { class: 'item' }, `<img src="${url}" alt="drawing">`)));
  const fa = el.querySelector('.fantasy');
  if (!s.fantasy.length) fa.innerHTML = '<div class="item locked"><div class="ico">🛠️</div><div>Create one!</div></div>';
  s.fantasy.forEach(f => fa.appendChild(DW.h('div', { class: 'item' }, DW.creatorArt.svg(f.parts) + `<div>${f.name}</div><small>(fantasy)</small>`)));

  const bar = DW.h('div', { class: 'bottom-bar' }); bar.appendChild(DW.button('Back', '↩️', 'red', () => DW.app.go('hub', { id: 'museum' }))); el.appendChild(bar);
  DW.voice.say(foundN === 0 ? 'Your collection is empty. Go find dinosaurs!' : `You found ${foundN} dinosaurs!`, { icon: '🎒' });
});
