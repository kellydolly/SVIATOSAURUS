/* SVIATOSAURUS — "My Fantasy Dinosaur" builder art (clearly NOT a real species). */
window.DW = window.DW || {};

DW.creatorArt = (function () {
  const OPTIONS = {
    body: [{ id: 'round', ico: '⚪', label: 'Round' }, { id: 'long', ico: '🥖', label: 'Long' }, { id: 'tall', ico: '🏛️', label: 'Tall' }],
    head: [{ id: 'round', ico: '🙂', label: 'Round' }, { id: 'long', ico: '🐊', label: 'Long' }, { id: 'horned', ico: '🐂', label: 'Horns' }],
    eyes: [{ id: 'big', ico: '👀', label: 'Big' }, { id: 'sleepy', ico: '😌', label: 'Sleepy' }, { id: 'star', ico: '🤩', label: 'Star' }],
    mouth: [{ id: 'smile', ico: '😊', label: 'Smile' }, { id: 'teeth', ico: '😬', label: 'Teeth' }, { id: 'beak', ico: '🦜', label: 'Beak' }],
    tail: [{ id: 'long', ico: '〰️', label: 'Long' }, { id: 'spiky', ico: '🌵', label: 'Spiky' }, { id: 'club', ico: '🔨', label: 'Club' }],
    color: [{ id: '#5cc75a', ico: '🟢', label: 'Green' }, { id: '#4aa3ff', ico: '🔵', label: 'Blue' }, { id: '#ff6b6b', ico: '🔴', label: 'Red' }, { id: '#ffb347', ico: '🟠', label: 'Orange' }, { id: '#c48bff', ico: '🟣', label: 'Purple' }, { id: '#ffd93d', ico: '🟡', label: 'Yellow' }, { id: '#ff8ac8', ico: '🩷', label: 'Pink' }, { id: '#9aa5b1', ico: '⚪', label: 'Grey' }],
    pattern: [{ id: 'none', ico: '⬜', label: 'Plain' }, { id: 'spots', ico: '🔘', label: 'Spots' }, { id: 'stripes', ico: '🦓', label: 'Stripes' }]
  };
  const DEFAULT = { body: 'round', head: 'round', eyes: 'big', mouth: 'smile', tail: 'long', color: '#5cc75a', pattern: 'spots' };

  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16); let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
    r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  }
  let uid = 0;
  function svg(p, cls) {
    p = Object.assign({}, DEFAULT, p || {});
    uid++;
    const c = p.color, dark = shade(c, -60), light = shade(c, 50), belly = shade(c, 90);
    const S = `stroke="${dark}" stroke-opacity=".55" stroke-width="1.6" stroke-linejoin="round"`;
    const g = `url(#cg${uid})`;
    // body geometry
    let bodyEl, bx = 210, by = 190, brx = 90, bry = 66;
    if (p.body === 'long') { brx = 120; bry = 52; by = 196; }
    if (p.body === 'tall') { brx = 66; bry = 90; by = 170; }
    bodyEl = `<ellipse cx="${bx}" cy="${by}" rx="${brx}" ry="${bry}" fill="${g}" ${S}/><ellipse cx="${bx}" cy="${by + bry * 0.35}" rx="${brx * 0.7}" ry="${bry * 0.45}" fill="${belly}" opacity=".9"/>`;
    // pattern
    let pat = '';
    if (p.pattern === 'spots') pat = `<g fill="${dark}" opacity=".35"><circle cx="${bx - brx * 0.4}" cy="${by - bry * 0.3}" r="${brx * 0.12}"/><circle cx="${bx + brx * 0.1}" cy="${by - bry * 0.55}" r="${brx * 0.1}"/><circle cx="${bx + brx * 0.5}" cy="${by - bry * 0.2}" r="${brx * 0.13}"/><circle cx="${bx - brx * 0.05}" cy="${by - bry * 0.05}" r="${brx * 0.08}"/></g>`;
    if (p.pattern === 'stripes') pat = `<g fill="none" stroke="${dark}" stroke-opacity=".45" stroke-width="${brx * 0.09}" stroke-linecap="round"><path d="M ${bx - brx * 0.4} ${by - bry * 0.9} Q ${bx - brx * 0.5} ${by - bry * 0.3} ${bx - brx * 0.35} ${by}"/><path d="M ${bx} ${by - bry} Q ${bx - brx * 0.1} ${by - bry * 0.4} ${bx + brx * 0.05} ${by + bry * 0.05}"/><path d="M ${bx + brx * 0.4} ${by - bry * 0.9} Q ${bx + brx * 0.3} ${by - bry * 0.3} ${bx + brx * 0.45} ${by}"/></g>`;
    // legs
    const legY = by + bry - 10;
    const legs = `<g class="dw-leg dw-leg-b"><rect x="${bx - brx * 0.5 + 16}" y="${legY - 6}" width="30" height="${262 - legY}" rx="14" fill="${dark}" ${S}/><rect x="${bx + brx * 0.2 + 16}" y="${legY - 6}" width="30" height="${262 - legY}" rx="14" fill="${dark}" ${S}/></g>
      <g class="dw-leg dw-leg-a"><rect x="${bx - brx * 0.5}" y="${legY}" width="34" height="${262 - legY}" rx="15" fill="${g}" ${S}/><rect x="${bx + brx * 0.2}" y="${legY}" width="34" height="${262 - legY}" rx="15" fill="${g}" ${S}/></g>`;
    // tail
    const tx = bx + brx - 10, ty = by - bry * 0.2;
    let tail = '';
    if (p.tail === 'long') tail = `<path d="M ${tx} ${ty - 20} C ${tx + 60} ${ty - 40} ${tx + 110} ${ty - 70} ${tx + 130} ${ty - 100} C ${tx + 100} ${ty - 50} ${tx + 70} ${ty} ${tx} ${ty + 20} Z" fill="${g}" ${S}/>`;
    if (p.tail === 'spiky') tail = `<path d="M ${tx} ${ty - 20} C ${tx + 60} ${ty - 30} ${tx + 100} ${ty - 40} ${tx + 130} ${ty - 50} C ${tx + 100} ${ty - 10} ${tx + 60} ${ty + 10} ${tx} ${ty + 20} Z" fill="${g}" ${S}/><path d="M ${tx + 30} ${ty - 26} L ${tx + 40} ${ty - 50} L ${tx + 52} ${ty - 30} Z M ${tx + 64} ${ty - 34} L ${tx + 76} ${ty - 60} L ${tx + 88} ${ty - 40} Z M ${tx + 98} ${ty - 42} L ${tx + 112} ${ty - 68} L ${tx + 122} ${ty - 48} Z" fill="#fff" ${S}/>`;
    if (p.tail === 'club') tail = `<path d="M ${tx} ${ty - 16} C ${tx + 50} ${ty - 20} ${tx + 80} ${ty - 20} ${tx + 110} ${ty - 22} L ${tx + 110} ${ty + 4} C ${tx + 80} ${ty + 8} ${tx + 50} ${ty + 10} ${tx} ${ty + 16} Z" fill="${g}" ${S}/><circle cx="${tx + 122}" cy="${ty - 10}" r="26" fill="${dark}" ${S}/><circle cx="${tx + 114}" cy="${ty - 18}" r="8" fill="#fff" opacity=".3"/>`;
    // neck + head
    const hx = bx - brx + 10, hy = by - bry - 20;
    const neck = `<path d="M ${hx + 10} ${hy + 10} C ${hx + 20} ${hy + 40} ${bx - brx * 0.4} ${by - bry * 0.6} ${bx - brx * 0.2} ${by - bry * 0.2} L ${bx - brx * 0.6} ${by + 10} C ${hx + 10} ${by - 20} ${hx - 10} ${hy + 40} ${hx - 20} ${hy + 20} Z" fill="${g}" ${S}/>`;
    let head = '', ex = hx - 10, ey = hy - 4, mx = hx - 40, my = hy + 20;
    if (p.head === 'round') head = `<circle cx="${hx - 10}" cy="${hy}" r="48" fill="${g}" ${S}/>`;
    if (p.head === 'long') { head = `<ellipse cx="${hx - 24}" cy="${hy + 4}" rx="68" ry="36" fill="${g}" ${S}/>`; ex = hx + 2; mx = hx - 60; my = hy + 16; }
    if (p.head === 'horned') head = `<path d="M ${hx - 30} ${hy - 36} L ${hx - 44} ${hy - 80} L ${hx - 10} ${hy - 44} Z M ${hx + 14} ${hy - 36} L ${hx + 30} ${hy - 80} L ${hx + 32} ${hy - 30} Z" fill="#f3ebd6" ${S}/><circle cx="${hx - 10}" cy="${hy}" r="48" fill="${g}" ${S}/>`;
    let eyes = '';
    if (p.eyes === 'big') eyes = `<g class="dw-eye"><circle cx="${ex}" cy="${ey}" r="14" fill="#fff" stroke="#222" stroke-width="1.5"/><circle cx="${ex - 3}" cy="${ey + 1}" r="8" fill="#1b1b1b"/><circle cx="${ex - 7}" cy="${ey - 5}" r="4" fill="#fff"/></g>`;
    if (p.eyes === 'sleepy') eyes = `<g class="dw-eye"><circle cx="${ex}" cy="${ey}" r="13" fill="#fff" stroke="#222" stroke-width="1.5"/><circle cx="${ex - 2}" cy="${ey + 3}" r="7" fill="#1b1b1b"/><path d="M ${ex - 14} ${ey - 3} A 14 14 0 0 1 ${ex + 14} ${ey - 3} L ${ex + 14} ${ey - 14} L ${ex - 14} ${ey - 14} Z" fill="${c}" stroke="#222" stroke-width="1.5"/></g>`;
    if (p.eyes === 'star') eyes = `<g class="dw-eye"><circle cx="${ex}" cy="${ey}" r="14" fill="#fff" stroke="#222" stroke-width="1.5"/><path d="M ${ex} ${ey - 10} L ${ex + 3} ${ey - 3} L ${ex + 10} ${ey - 2} L ${ex + 4} ${ey + 3} L ${ex + 6} ${ey + 10} L ${ex} ${ey + 6} L ${ex - 6} ${ey + 10} L ${ex - 4} ${ey + 3} L ${ex - 10} ${ey - 2} L ${ex - 3} ${ey - 3} Z" fill="#ffb300"/></g>`;
    let mouth = '';
    if (p.mouth === 'smile') mouth = `<path d="M ${mx - 10} ${my} Q ${mx + 14} ${my + 24} ${mx + 40} ${my + 4}" fill="none" stroke="#3a2a2a" stroke-width="4" stroke-linecap="round"/><circle cx="${mx - 4}" cy="${my - 8}" r="3" fill="${dark}" opacity=".6"/>`;
    if (p.mouth === 'teeth') mouth = `<path d="M ${mx - 12} ${my} L ${mx + 44} ${my + 2} L ${mx + 40} ${my + 16} L ${mx - 8} ${my + 12} Z" fill="#a63a44"/><path d="M ${mx - 8} ${my + 1} L ${mx - 2} ${my + 10} L ${mx + 4} ${my + 1} L ${mx + 10} ${my + 10} L ${mx + 16} ${my + 1} L ${mx + 22} ${my + 10} L ${mx + 28} ${my + 1} L ${mx + 34} ${my + 10} L ${mx + 40} ${my + 2} Z" fill="#fff"/>`;
    if (p.mouth === 'beak') mouth = `<path d="M ${mx - 22} ${my - 6} L ${mx + 30} ${my - 10} L ${mx + 30} ${my + 8} L ${mx - 10} ${my + 12} Z" fill="#ffb347" ${S}/><path d="M ${mx - 22} ${my - 6} L ${mx + 30} ${my - 2}" stroke="#7a4a10" stroke-width="2"/>`;
    return `<svg class="dino fantasy ${cls || ''}" viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
      <defs><radialGradient id="cg${uid}" cx="38%" cy="28%" r="78%"><stop offset="0" stop-color="${light}"/><stop offset=".5" stop-color="${c}"/><stop offset="1" stop-color="${dark}"/></radialGradient>
      <filter id="cf${uid}" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#000" flood-opacity=".28"/></filter></defs>
      <ellipse cx="215" cy="248" rx="150" ry="9" fill="#000" opacity=".18"/>
      <g class="dw-root" filter="url(#cf${uid})">
        <g class="dw-tail" style="transform-box:fill-box;transform-origin:0% 60%">${tail}</g>
        ${legs}
        <g class="dw-body">${bodyEl}${pat}</g>
        <g class="dw-neck">${neck}</g>
        <g class="dw-head" style="transform-box:fill-box;transform-origin:100% 100%">${head}${eyes}${mouth}</g>
      </g></svg>`;
  }
  return { svg, OPTIONS, DEFAULT };
})();
