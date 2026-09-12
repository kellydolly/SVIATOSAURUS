/* SVIATOSAURUS — Missions & rewards (no currencies: just stars, fossils and badges) */
window.DW = window.DW || {};

DW.MISSIONS = [
  { id: 'find3', ico: '🦖', text: 'Find 3 dinosaurs', say: 'Find three dinosaurs!', reward: { star: 1, badge: 'explorer' }, badgeIco: '🧭', progress: s => [Math.min(3, Object.keys(s.found).length), 3], go: ['habitat', { id: 'jungle' }] },
  { id: 'dig', ico: '⛏️', text: 'Dig up a fossil', say: 'Dig up a fossil!', reward: { star: 1, fossil: true, badge: 'digger' }, badgeIco: '⛏️', progress: s => [Math.min(1, s.counters.digs), 1], go: ['dig'] },
  { id: 'skeleton', ico: '🦴', text: 'Build a skeleton', say: 'Build a skeleton!', reward: { star: 1, badge: 'builder' }, badgeIco: '🦴', progress: s => [Math.min(1, s.counters.skeletons), 1], go: ['skeleton'] },
  { id: 'feed', ico: '🍖', text: 'Feed a dinosaur', say: 'Feed a dinosaur!', reward: { star: 1, badge: 'feeder' }, badgeIco: '🍖', progress: s => [Math.min(1, s.counters.fed), 1], go: ['habitat', { id: 'volcano' }] },
  { id: 'puzzle', ico: '🧩', text: 'Complete a puzzle', say: 'Complete a puzzle!', reward: { star: 1, badge: 'puzzler' }, badgeIco: '🧩', progress: s => [Math.min(1, s.counters.puzzles), 1], go: ['puzzle'] },
  { id: 'hatch', ico: '🥚', text: 'Hatch an egg', say: 'Hatch an egg!', reward: { star: 1, badge: 'hatcher' }, badgeIco: '🐣', progress: s => [Math.min(1, Object.keys(s.eggs).length), 1], go: ['eggs'] },
  { id: 'draw', ico: '🎨', text: 'Draw a dinosaur', say: 'Draw a dinosaur!', reward: { star: 1, badge: 'artist' }, badgeIco: '🎨', progress: s => [Math.min(1, s.counters.drawings), 1], go: ['draw'] },
  { id: 'care', ico: '🍼', text: 'Take care of a baby', say: 'Take care of a baby dinosaur!', reward: { star: 1, badge: 'nanny' }, badgeIco: '🍼', progress: s => [Math.min(3, s.counters.care), 3], go: ['care'] },
  { id: 'find6', ico: '🌍', text: 'Find 6 dinosaurs', say: 'Find six dinosaurs!', reward: { star: 2, badge: 'ranger' }, badgeIco: '🌍', progress: s => [Math.min(6, Object.keys(s.found).length), 6], go: ['habitat', { id: 'lagoon' }] },
  { id: 'find12', ico: '🏆', text: 'Find ALL 12 dinosaurs', say: 'Find all the dinosaurs!', reward: { star: 3, badge: 'master' }, badgeIco: '🏆', progress: s => [Math.min(12, Object.keys(s.found).length), 12], go: ['encyclopedia'] }
];
DW.BADGES = DW.MISSIONS.map(m => ({ id: m.reward.badge, ico: m.badgeIco, text: m.text }));

DW.missions = (function () {
  let queue = [], showing = false;
  function check() {
    const s = DW.state.get();
    DW.MISSIONS.forEach(m => {
      if (s.missions[m.id]) return;
      const [a, b] = m.progress(s);
      if (a >= b) {
        s.missions[m.id] = true;
        s.stars += m.reward.star; if (m.reward.badge) s.badges[m.reward.badge] = true;
        DW.state.save(); DW.hud.refresh();
        queue.push(m); showNext();
      }
    });
  }
  function showNext() {
    if (showing || !queue.length) return;
    showing = true;
    const m = queue.shift();
    const rewards = ['⭐'.repeat(m.reward.star)]; if (m.reward.badge) rewards.push(m.badgeIco); if (m.reward.fossil) rewards.push('🦴');
    setTimeout(() => {
      DW.ui.reward({ big: '🏆', text: 'Mission complete!', sub: m.text, rewards, say: `Mission complete! ${DW.praise()} You got a star!`, onClose: () => { showing = false; showNext(); } });
    }, 600);
  }
  return { check };
})();

DW.app.register('missions', function (el) {
  const s = DW.state.get();
  el.style.background = 'linear-gradient(180deg,#e0a12a,#ffe98a)';
  el.innerHTML = `<div class="title">⭐ Dino Missions</div><div class="missions"><div class="mission-list"></div></div>`;
  const list = el.querySelector('.mission-list');
  DW.MISSIONS.forEach(m => {
    const [a, b] = m.progress(s);
    const done = !!s.missions[m.id];
    const row = DW.h('div', { class: 'mission' + (done ? ' done' : '') }, `<span class="ico">${done ? '✅' : m.ico}</span><div class="txt">${m.text}<div class="prog">${done ? 'Done!' : a + ' / ' + b}</div></div><span class="rew">${'⭐'.repeat(m.reward.star)}${m.badgeIco}</span>`);
    if (!done) row.appendChild(DW.button('Go!', '▶️', 'green go', () => DW.app.go(m.go[0], m.go[1] || {})));
    row.querySelector('.txt').addEventListener('click', () => DW.voice.say(m.say, { icon: m.ico }));
    list.appendChild(row);
  });
  const bar = DW.h('div', { class: 'bottom-bar' }); bar.appendChild(DW.button('Back', '↩️', 'red', () => DW.app.go('hub', { id: 'camp' }))); el.appendChild(bar);
  const open = DW.MISSIONS.find(m => !s.missions[m.id]);
  DW.voice.say(open ? `Your mission: ${open.say}` : 'You did all the missions! Amazing!', { icon: '⭐' });
});
