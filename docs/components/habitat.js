/* SVIATOSAURUS — Habitat scene: living dinosaurs you can tap, stroke, feed (drag & drop) and watch */
window.DW = window.DW || {};

DW.app.register('habitat', function (el, params) {
  const loc = DW.LOCATIONS.find(l => l.id === params.id);
  const ids = DW.HABITATS[loc.id];
  const s = DW.state.get();
  DW.sfx.ambience(loc.id);

  el.innerHTML = `<div class="habitat">${DW.scenes.habitat(loc.id)}</div>`;
  const scene = el.querySelector('.habitat');
  const actors = [];
  let selected = null, alive = true, quest = null, food = null;

  /* ----- build actors ----- */
  const lanes = [8, 13, 10, 15];
  ids.forEach((id, i) => {
    const d = DW.dino(id);
    const asp = DW.art.aspect(d);
    let w = Math.max(14, Math.min(46, d.lengthM * 2.1));
    if (asp > 0.9) w = Math.max(16, Math.min(30, d.lengthM * 1.6));   // front-facing 3D render: narrower box
    if (innerHeight > innerWidth) w = Math.min(58, w * 1.4);          // phones: everybody bigger
    const a = DW.h('div', { class: 'actor', style: `width:${w}%; bottom:${lanes[i % lanes.length]}%; z-index:${30 - lanes[i % lanes.length]}` });
    a.innerHTML = DW.art.svg(d, { cls: 'alive' }) + `<div class="name-tag">${d.short}</div>`;
    a.style.left = (8 + i * (80 / ids.length) + DW.rand(-3, 3)) + '%';
    scene.appendChild(a);
    const actor = { id, d, el: a, svg: a.querySelector('svg'), x: parseFloat(a.style.left), w, facingRight: false, timer: null, img: asp > 0.9 };
    actors.push(actor);
    a.addEventListener('pointerdown', (e) => onTapActor(actor, e));
    a.addEventListener('pointermove', (e) => onStroke(actor, e));
    scheduleBehavior(actor, DW.rand(1500, 4000));
  });

  /* ----- hidden egg ----- */
  const eggFor = { volcano: 'trex', lagoon: 'triceratops', jungle: 'velociraptor' }[loc.id];
  if (eggFor && !s.eggs[eggFor]) {
    const e = DW.EGGS.find(x => x.id === eggFor);
    const eggEl = DW.h('div', { class: 'egg-pickup', style: `left:${DW.rand(60, 85)}%; bottom:${DW.rand(6, 10)}%;` }, DW.scenes.egg(e, 0));
    scene.appendChild(eggEl);
    eggEl.addEventListener('click', () => {
      DW.sfx.discovery(); DW.fx.sparkles(...center(eggEl));
      DW.voice.say("You found an egg! Let's hatch it!", { icon: '🥚' });
      setTimeout(() => DW.app.go('eggs', { id: eggFor }), 900);
    });
  }

  /* ----- action bar ----- */
  const bar = DW.h('div', { class: 'action-bar' });
  const bPet = DW.button('Pet', '🖐️', 'green', () => selected && pet(selected));
  const bFeed = DW.button('Feed', DW.props.meat(), '', () => selected && feed(selected));
  const bSound = DW.button('Sound', '🔊', 'purple', () => selected && call(selected, true));
  const bInfo = DW.button('Info', '📖', 'blue', () => selected && DW.app.go('viewer', { id: selected.id, back: { screen: 'habitat', params } }));
  const bBye = DW.button('', '✖', 'white', () => select(null));
  bar.append(bPet, bFeed, bSound, bInfo, bBye);
  el.appendChild(bar);

  /* ----- quest: "Can you find the X?" ----- */
  const questEl = DW.h('div', { class: 'quest' });
  questEl.addEventListener('click', () => quest && DW.voice.say(`Can you find the ${quest.d.say}?`, { icon: '🔍' }));
  el.appendChild(questEl);
  questEl.style.display = 'none';
  function newQuest() {
    const notFound = ids.filter(id => !s.found[id]);
    const pool = notFound.length ? notFound : ids;
    const id = DW.pick(pool);
    quest = { id, d: DW.dino(id) };
    questEl.style.display = 'flex';
    questEl.innerHTML = `<span class="ico">🔍</span><span>Find the ${quest.d.short}!</span>`;
    DW.voice.say(`Can you find the ${quest.d.say}?`, { icon: '🔍' });
  }
  const questTimer = setTimeout(newQuest, 2600);

  /* ----- helpers ----- */
  function center(node) { const r = node.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
  function headPoint(actor) { const h = actor.svg.querySelector('.dw-head'); const r = (h || actor.svg).getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
  function footPoint(actor) { const r = actor.el.getBoundingClientRect(); return [r.left + r.width * 0.55, r.bottom - 6]; }

  function select(actor) {
    if (selected) selected.el.classList.remove('selected');
    selected = actor;
    if (actor) {
      actor.el.classList.add('selected');
      bFeed.querySelector('.ico').innerHTML = DW.props.food(actor.d.food);
      bar.classList.add('show');
    } else bar.classList.remove('show');
  }

  function onTapActor(actor, e) {
    e.stopPropagation();
    actor.strokeN = 0; actor.strokeLast = 0; actor.pressed = true;
    const up = () => { actor.pressed = false; document.removeEventListener('pointerup', up); };
    document.addEventListener('pointerup', up);
    if (!s.found[actor.id]) {
      DW.state.mark('found', actor.id);
      DW.ui.toast(`<span class="ico">${actor.d.emoji}</span> New dinosaur: ${actor.d.short}!`);
      DW.fx.stars(...center(actor.el));
    }
    select(actor);
    stopWalk(actor);
    if (quest) {
      if (quest.id === actor.id) {
        DW.voice.say(`Excellent! You found the ${actor.d.say}!`, { icon: '🎉' });
        DW.sfx.star(); DW.fx.stars(...center(actor.el)); DW.state.addStars(1);
        quest = null; questEl.style.display = 'none';
        setTimeout(() => { if (alive && ids.some(id => !s.found[id])) newQuest(); }, 6000);
        DW.animate(actor.svg, 'happy', 1200);
        return;
      } else DW.voice.say(`That is a ${actor.d.say}. Try again!`, { icon: '🤔' });
    }
    const t = e.target;
    const part = t.closest && (t.closest('.dw-head') ? 'head' : t.closest('.dw-tail') ? 'tail' : t.closest('.dw-leg') ? 'leg' : t.closest('.dw-plates, .dw-sail') ? 'plates' : t.closest('.dw-neck') ? 'neck' : 'body');
    react(actor, part);
  }

  /* stroking the dinosaur with a finger = petting */
  function onStroke(actor, e) {
    if (!actor.pressed || e.buttons === 0) return;
    const now = performance.now();
    if (now - (actor.strokeLast || 0) < 160) return;
    actor.strokeLast = now; actor.strokeN = (actor.strokeN || 0) + 1;
    DW.fx.hearts(e.clientX, e.clientY);
    if (actor.strokeN === 4) { pet(actor); actor.strokeN = -20; }
  }

  function react(actor, part) {
    const d = actor.d, svg = actor.svg;
    if (part === 'head') call(actor, true);
    else if (part === 'tail') { DW.animate(svg, 'wag', 1800); DW.sfx.whoosh(); DW.voice.say(`${d.short} wags its tail!`, { icon: '🦖' }); }
    else if (part === 'leg') { DW.animate(svg, 'stomp', 1100); DW.sfx.stomp(); DW.fx.shake(); DW.fx.dust(...footPoint(actor)); DW.voice.say('Stomp! Stomp!', { icon: '🦶' }); }
    else if (part === 'plates') { DW.animate(svg, 'plates', 1600); DW.sfx.sparkle(); DW.voice.say(d.id === 'spinosaurus' ? 'Look at the big sail!' : 'Look at the plates!', { icon: '✨' }); }
    else if (part === 'neck' && d.template === 'sauropod') { DW.animate(svg, 'reach', 2300); DW.sfx.munch(); DW.voice.say(`${d.short} reaches for the leaves!`, { icon: '🌳' }); }
    else { DW.voice.say(`This is a ${d.say}.`, { icon: d.emoji }); DW.animate(svg, 'look', 1500); }
  }

  function call(actor, speak) {
    const d = actor.d;
    DW.animate(actor.svg, d.diet === 'Carnivore' ? 'roar' : 'teeth', 1400);
    DW.sfx.dino(d.sound);
    if (speak) setTimeout(() => DW.voice.say(d.soundNote, { icon: '🔊' }), 900);
  }

  function pet(actor) {
    DW.animate(actor.svg, 'happy', 1300);
    DW.sfx.purr(); DW.sfx.happy();
    DW.fx.hearts(...headPoint(actor));
    DW.state.inc('petted');
    DW.voice.say(DW.pick([`${actor.d.short} likes that!`, 'So soft!', `${actor.d.short} is happy!`]), { icon: '💚' });
  }

  /* feeding: a piece of food appears and the child drags it onto a dinosaur */
  function feed(actor) {
    if (food) food.cancel();
    const kind = actor.d.food, word = kind === 'meat' ? 'meat' : kind === 'fish' ? 'fish' : 'leaf';
    DW.sfx.pop();
    DW.voice.say(`Drag the ${word} to the ${actor.d.say}!`, { icon: '👆' });
    food = DW.dragProp({
      html: DW.props.food(kind), fromEl: bFeed,
      targets: actors.map(a => ({ el: a.el, data: a })),
      onMiss: () => DW.voice.say(`Drag it to the ${actor.d.say}!`, { icon: '👆' }),
      onDrop: (target, x, y) => {
        food = null;
        const eats = target.d.food === kind || (kind === 'leaves' && target.d.food === 'plants') || (kind === 'plants' && target.d.food === 'leaves');
        if (eats) {
          stopWalk(target); DW.animate(target.svg, 'eat', 1700);
          target.d.diet === 'Carnivore' ? DW.sfx.chomp() : DW.sfx.munch();
          DW.fx.burst(x, y, { n: 12, color: target.d.diet === 'Carnivore' ? '#d94a5a' : '#5ec25a', size: 8 });
          setTimeout(() => { DW.voice.say(DW.PHRASES.yummy, { icon: '😋' }); DW.state.inc('fed'); DW.fx.hearts(...headPoint(target)); }, 1200);
        } else {
          DW.animate(target.svg, 'look', 1500); DW.sfx.wrong();
          DW.voice.say(`No! ${target.d.short} does not eat ${kind}. ${target.d.short} eats ${target.d.food}.`, { icon: '🙅' });
        }
      }
    });
  }

  /* ----- autonomous behavior ----- */
  function scheduleBehavior(actor, ms) { clearTimeout(actor.timer); actor.timer = setTimeout(() => { if (alive) behave(actor); }, ms); }
  function behave(actor) {
    if (selected === actor) { scheduleBehavior(actor, 2500); return; }
    const r = Math.random();
    if (r < 0.55) walk(actor);
    else if (r < 0.75) { call(actor, false); scheduleBehavior(actor, DW.rand(3000, 7000)); }
    else if (r < 0.9) { DW.animate(actor.svg, actor.d.template === 'sauropod' ? 'reach' : 'look', 2200); scheduleBehavior(actor, DW.rand(3000, 7000)); }
    else { DW.animate(actor.svg, 'wag', 1800); scheduleBehavior(actor, DW.rand(3000, 6000)); }
  }
  function walk(actor) {
    const maxX = 100 - actor.w;
    const target = Math.max(0, Math.min(maxX, actor.x + DW.rand(-28, 28)));
    const dist = Math.abs(target - actor.x);
    if (dist < 4) { scheduleBehavior(actor, 1500); return; }
    const dur = dist * (actor.d.lengthM > 15 ? 260 : actor.d.lengthM < 4 ? 90 : 160);
    actor.facingRight = target > actor.x;
    if (!actor.img) actor.el.classList.toggle('flip', actor.facingRight);
    actor.el.classList.add('moving'); actor.svg.classList.add('walking');
    actor.el.style.transitionDuration = dur + 'ms';
    actor.el.style.left = target + '%';
    actor.x = target;
    actor.stepTimer = setInterval(() => { if (actor.d.lengthM > 6) DW.sfx.step(0.12 + Math.min(0.3, actor.d.lengthM / 60)); }, 550);
    actor.walkEnd = setTimeout(() => { stopWalk(actor); scheduleBehavior(actor, DW.rand(2000, 6000)); }, dur);
  }
  function stopWalk(actor) {
    clearTimeout(actor.walkEnd); clearInterval(actor.stepTimer);
    if (actor.el.classList.contains('moving')) {
      const cur = parseFloat(getComputedStyle(actor.el).left) / scene.clientWidth * 100;
      actor.el.style.transitionDuration = '0ms';
      actor.el.style.left = cur + '%'; actor.x = cur;
    }
    actor.el.classList.remove('moving'); actor.svg.classList.remove('walking');
  }

  scene.addEventListener('pointerdown', (e) => { if (e.target === scene || e.target.closest('.layer')) select(null); });

  return {
    destroy() { alive = false; clearTimeout(questTimer); if (food) food.cancel(); actors.forEach(a => { clearTimeout(a.timer); clearTimeout(a.walkEnd); clearInterval(a.stepTimer); }); }
  };
});
