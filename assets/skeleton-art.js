/* SVIATOSAURUS — skeleton art (fossils). Parts: skull, spine, ribs, arms, legs, tail.
   Each part is a <g class="sk-part" data-part="..."> so the games can render/drag them separately. */
window.DW = window.DW || {};

DW.skeletonArt = (function () {
  const BONE = '#f3ebd6', BONE2 = '#d8cdb0', EDGE = '#a89570', HOLE = '#6b5a3a';
  const S = `stroke="${EDGE}" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"`;

  function bone(x1, y1, x2, y2, w, fill) {
    const f = fill || BONE;
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${EDGE}" stroke-width="${w + 2.8}" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${f}" stroke-width="${w}" stroke-linecap="round"/><circle cx="${x1}" cy="${y1}" r="${w * 0.7}" fill="${f}" ${S}/><circle cx="${x2}" cy="${y2}" r="${w * 0.7}" fill="${f}" ${S}/>`;
  }
  function chain(pts, r0, r1, spines) {
    let s = '';
    for (let i = 0; i < pts.length - 1; i++) s += `<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${pts[i + 1][0]}" y2="${pts[i + 1][1]}" stroke="${EDGE}" stroke-width="3"/>`;
    pts.forEach((p, i) => {
      const r = r0 + (r1 - r0) * i / (pts.length - 1);
      if (spines) s += `<rect x="${p[0] - r * 0.35}" y="${p[1] - r * 2.6}" width="${r * 0.7}" height="${r * 2}" rx="2" fill="${BONE}" ${S}/>`;
      s += `<rect x="${p[0] - r}" y="${p[1] - r * 0.8}" width="${r * 2}" height="${r * 1.6}" rx="${r * 0.5}" fill="${BONE}" ${S}/>`;
    });
    return s;
  }
  function ribs(xs, y0, len, dir) {
    return xs.map(x => `<path d="M ${x} ${y0} C ${x - 12 * dir} ${y0 + len * 0.4} ${x - 8 * dir} ${y0 + len * 0.8} ${x + 6 * dir} ${y0 + len}" fill="none" stroke="${EDGE}" stroke-width="7.5" stroke-linecap="round"/><path d="M ${x} ${y0} C ${x - 12 * dir} ${y0 + len * 0.4} ${x - 8 * dir} ${y0 + len * 0.8} ${x + 6 * dir} ${y0 + len}" fill="none" stroke="${BONE}" stroke-width="5" stroke-linecap="round"/>`).join('');
  }
  function teeth(x0, x1, y, n, size) {
    let s = ''; const step = (x1 - x0) / (n - 1);
    for (let i = 0; i < n; i++) { const x = x0 + i * step; s += `M ${x - size / 2} ${y} L ${x} ${y + size * 1.6} L ${x + size / 2} ${y} Z `; }
    return `<path d="${s}" fill="#fff" stroke="${EDGE}" stroke-width="0.8"/>`;
  }
  const part = (key, inner) => `<g class="sk-part" data-part="${key}">${inner}</g>`;

  function theropod() {
    const skull = part('skull', `
      <path d="M 160 66 C 130 50 76 54 44 78 C 36 86 38 96 48 98 L 130 104 C 156 104 170 86 160 66 Z" fill="${BONE}" ${S}/>
      <ellipse cx="90" cy="80" rx="13" ry="8" fill="${HOLE}"/><circle cx="123" cy="78" r="9" fill="${HOLE}"/><ellipse cx="146" cy="86" rx="6" ry="9" fill="${HOLE}"/>
      <path d="M 58 84 C 62 78 70 78 74 84" fill="none" ${S}/>
      <path d="M 48 101 L 132 104 C 136 114 122 124 100 122 L 54 114 Z" fill="${BONE}" ${S}/><ellipse cx="112" cy="113" rx="9" ry="3.5" fill="${HOLE}"/>
      ${teeth(56, 122, 100, 9, 5)}`);
    const spine = part('spine', chain([[158, 92], [152, 104], [158, 114], [174, 118], [194, 116], [214, 114], [234, 114], [254, 116], [268, 122]], 6, 7, true) +
      `<path d="M 250 116 C 262 106 284 110 288 128 C 284 142 262 146 252 138 Z" fill="${BONE}" ${S}/>`);
    const rb = part('ribs', ribs([182, 196, 210, 224, 238, 250], 120, 66, 1));
    const arms = part('arms', bone(166, 132, 160, 150, 5) + bone(160, 150, 168, 164, 4) + `<path d="M 166 164 L 160 172 M 170 164 L 172 174" ${S} stroke-width="2.5"/>` + bone(180, 132, 176, 150, 5, BONE2) + bone(176, 150, 184, 164, 4, BONE2));
    const leg = (dx, f) => bone(222 + dx, 130, 244 + dx, 196, 12, f) + bone(244 + dx, 196, 236 + dx, 232, 9, f) + bone(236 + dx, 232, 226 + dx, 240, 7, f) + bone(226 + dx, 240, 206 + dx, 244, 5, f) + bone(226 + dx, 240, 222 + dx, 246, 5, f) + bone(226 + dx, 240, 240 + dx, 246, 5, f);
    const legs = part('legs', leg(20, BONE2) + leg(0, BONE));
    const tailPts = []; for (let i = 0; i <= 9; i++) { const t = i / 9; tailPts.push([270 + t * 126, 118 - 22 * t + 6 * t * t]); }
    const tail = part('tail', chain(tailPts, 6, 2));
    return { parts: [skull, spine, rb, arms, legs, tail], order: ['legs', 'tail', 'ribs', 'spine', 'arms', 'skull'] };
  }

  function ceratopsian() {
    const skull = part('skull', `
      <path d="M 178 150 C 150 140 110 112 108 72 C 108 42 140 30 166 46 C 184 70 192 110 188 150 Z" fill="${BONE}" ${S}/>
      <ellipse cx="146" cy="96" rx="14" ry="22" fill="${HOLE}" opacity=".6"/>
      <path d="M 136 74 L 90 30 L 150 64 Z" fill="${BONE2}" ${S}/>
      <path d="M 134 68 C 104 62 62 78 40 104 C 32 112 36 122 46 124 L 110 132 C 132 128 146 100 134 68 Z" fill="${BONE}" ${S}/>
      <circle cx="108" cy="98" r="9" fill="${HOLE}"/><ellipse cx="72" cy="104" rx="8" ry="6" fill="${HOLE}"/>
      <path d="M 46 104 C 34 108 30 118 40 126 L 48 130 L 52 118 Z" fill="${BONE}" ${S}/>
      <path d="M 46 124 L 110 132 C 110 140 100 144 84 142 L 52 134 Z" fill="${BONE}" ${S}/>
      <path d="M 50 100 L 44 70 L 66 98 Z" fill="${BONE}" ${S}/><path d="M 116 78 L 62 22 L 136 62 Z" fill="${BONE}" ${S}/>`);
    const spine = part('spine', chain([[180, 118], [200, 108], [222, 104], [244, 106], [264, 112], [282, 124], [292, 140]], 7, 6, true));
    const rb = part('ribs', ribs([190, 206, 222, 238, 254, 270], 112, 78, 1));
    const arms = part('arms', bone(182, 150, 172, 200, 9, BONE2) + bone(172, 200, 180, 240, 7, BONE2) + bone(162, 150, 152, 200, 9) + bone(152, 200, 158, 240, 7) + bone(158, 240, 146, 244, 5) + bone(158, 240, 166, 246, 5));
    const legs = part('legs', bone(288, 140, 294, 200, 11, BONE2) + bone(294, 200, 288, 240, 8, BONE2) + bone(268, 140, 274, 200, 11) + bone(274, 200, 268, 240, 8) + bone(268, 240, 256, 244, 5) + bone(268, 240, 280, 246, 5));
    const tailPts = []; for (let i = 0; i <= 7; i++) { const t = i / 7; tailPts.push([290 + t * 84, 148 + 40 * t]); }
    const tail = part('tail', chain(tailPts, 6, 2));
    return { parts: [skull, spine, rb, arms, legs, tail], order: ['legs', 'arms', 'tail', 'ribs', 'spine', 'skull'] };
  }

  function stegosaur() {
    const skull = part('skull', `
      <path d="M 76 180 C 62 174 40 178 30 190 C 26 196 30 202 38 204 L 66 208 C 78 206 84 192 76 180 Z" fill="${BONE}" ${S}/>
      <circle cx="60" cy="190" r="5" fill="${HOLE}"/><ellipse cx="42" cy="194" rx="4" ry="3" fill="${HOLE}"/>
      <path d="M 38 205 L 66 208 C 66 214 60 218 50 216 L 40 211 Z" fill="${BONE}" ${S}/>`);
    const spinePts = [[80, 196], [104, 182], [128, 166], [150, 140], [176, 120], [210, 106], [246, 106], [280, 120], [304, 138]];
    const plates = [[146, 128, 26], [176, 108, 40], [210, 96, 50], [246, 98, 50], [280, 114, 40], [310, 138, 30]].map(([x, y, h]) => `<path d="M ${x - 14} ${y + 6} L ${x - 4} ${y - h} L ${x + 10} ${y - h + 8} L ${x + 18} ${y + 6} Z" fill="${BONE2}" ${S}/>`).join('');
    const spine = part('spine', plates + chain(spinePts, 5, 7));
    const rb = part('ribs', ribs([176, 194, 212, 230, 248, 266], 116, 82, 1));
    const arms = part('arms', bone(166, 176, 160, 210, 8, BONE2) + bone(160, 210, 166, 240, 6, BONE2) + bone(146, 176, 140, 210, 8) + bone(140, 210, 146, 240, 6) + bone(146, 240, 136, 244, 4) + bone(146, 240, 156, 246, 4));
    const legs = part('legs', bone(284, 140, 290, 200, 11, BONE2) + bone(290, 200, 284, 240, 8, BONE2) + bone(262, 140, 268, 200, 11) + bone(268, 200, 262, 240, 8) + bone(262, 240, 250, 244, 5) + bone(262, 240, 274, 246, 5));
    const tailPts = []; for (let i = 0; i <= 7; i++) { const t = i / 7; tailPts.push([300 + t * 92, 140 + 38 * t]); }
    const tail = part('tail', chain(tailPts, 6, 2) + `<path d="M 356 168 L 372 132 L 368 176 Z M 372 176 L 396 150 L 384 184 Z" fill="${BONE}" ${S}/>`);
    return { parts: [skull, spine, rb, arms, legs, tail], order: ['legs', 'arms', 'tail', 'ribs', 'spine', 'skull'] };
  }

  const KINDS = { trex: theropod, triceratops: ceratopsian, stegosaurus: stegosaur };
  const LABELS = { skull: 'Skull', spine: 'Spine', ribs: 'Ribs', arms: 'Arms', legs: 'Legs', tail: 'Tail' };
  const ICONS = { skull: '💀', spine: '🦴', ribs: '🦴', arms: '🦴', legs: '🦴', tail: '🦴' };

  function build(id) {
    const b = (KINDS[id] || theropod)();
    const byKey = {}; b.parts.forEach(p => { const k = p.match(/data-part="(\w+)"/)[1]; byKey[k] = p; });
    return { byKey, order: b.order };
  }
  function wrap(inner, cls) { return `<svg class="skeleton ${cls || ''}" viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">${inner}</svg>`; }
  function svg(id, cls) { const b = build(id); return wrap(b.order.map(k => b.byKey[k]).join(''), cls); }
  function partSvg(id, key, cls) { const b = build(id); return wrap(b.byKey[key], cls); }
  return { svg, partSvg, build, wrap, LABELS, ICONS, KEYS: ['skull', 'spine', 'ribs', 'arms', 'legs', 'tail'] };
})();
