/* SVIATOSAURUS — scene backgrounds (SVG) for the map and the habitats. */
window.DW = window.DW || {};

DW.scenes = (function () {
  const cloud = (x, y, s, dur) => `<g class="cloud" style="animation-duration:${dur}s" transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="60" ry="26" fill="#fff"/><ellipse cx="-34" cy="8" rx="34" ry="20" fill="#fff"/><ellipse cx="36" cy="8" rx="40" ry="22" fill="#fff"/><ellipse cx="0" cy="-14" rx="36" ry="24" fill="#fff"/><ellipse cx="0" cy="12" rx="70" ry="14" fill="#e6f1ff"/></g>`;
  const sun = (x, y, r) => `<g class="sunny"><circle cx="${x}" cy="${y}" r="${r * 1.8}" fill="#fff4b0" opacity=".35"/><circle cx="${x}" cy="${y}" r="${r * 1.3}" fill="#ffe66d" opacity=".45"/><circle cx="${x}" cy="${y}" r="${r}" fill="#ffd93d"/></g>`;
  const palm = (x, y, s, flip) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
      <path d="M 0 0 C -6 -40 -4 -80 4 -120" stroke="#8a5a2b" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M 4 -120 C 30 -150 70 -150 96 -126 C 60 -132 30 -126 4 -116 Z" fill="#3fae4e"/>
      <path d="M 4 -120 C -24 -150 -66 -150 -90 -124 C -56 -132 -26 -126 2 -116 Z" fill="#48c05a"/>
      <path d="M 4 -120 C 24 -160 56 -172 84 -170 C 56 -156 30 -140 6 -114 Z" fill="#5ad169"/>
      <path d="M 4 -120 C -16 -164 -50 -178 -80 -176 C -50 -158 -26 -140 2 -114 Z" fill="#3fae4e"/>
      <path d="M 4 -120 C 18 -100 40 -90 66 -92 C 42 -104 24 -112 6 -118 Z" fill="#2f9640"/>
      <path d="M 4 -120 C -10 -100 -34 -90 -60 -94 C -36 -104 -20 -112 2 -118 Z" fill="#2f9640"/>
      <circle cx="0" cy="-120" r="6" fill="#8a5a2b"/><circle cx="8" cy="-114" r="5" fill="#a56d35"/></g>`;
  const fern = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${c || '#3f9e4a'}"><path d="M 0 0 C -10 -30 -40 -50 -70 -46 C -40 -40 -20 -20 0 0 Z"/><path d="M 0 0 C 10 -30 40 -50 70 -46 C 40 -40 20 -20 0 0 Z"/><path d="M 0 0 C -4 -34 -10 -60 -30 -80 C -12 -60 -4 -30 0 0 Z"/><path d="M 0 0 C 4 -34 10 -60 30 -80 C 12 -60 4 -30 0 0 Z"/><path d="M 0 0 C 0 -40 0 -70 0 -96 C 4 -70 4 -40 0 0 Z"/></g>`;
  const rock = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M -40 0 C -44 -24 -20 -40 4 -36 C 30 -40 50 -20 44 0 Z" fill="${c || '#6b6772'}"/><path d="M -30 -6 C -26 -24 -6 -34 8 -30 C 4 -20 -10 -12 -30 -6 Z" fill="#fff" opacity=".18"/></g>`;
  const bush = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="54" ry="30" fill="${c || '#3a9a47'}"/><ellipse cx="-24" cy="-14" rx="30" ry="24" fill="${c || '#3a9a47'}"/><ellipse cx="24" cy="-16" rx="32" ry="26" fill="${c || '#3a9a47'}"/><ellipse cx="0" cy="-22" rx="28" ry="22" fill="#5cc168"/><ellipse cx="-10" cy="-26" rx="12" ry="8" fill="#fff" opacity=".2"/></g>`;

  function map() {
    return `<svg class="map-bg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#63c4ff"/><stop offset="1" stop-color="#d9f3ff"/></linearGradient>
        <linearGradient id="mSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#37b6e6"/><stop offset="1" stop-color="#1f79c9"/></linearGradient>
        <radialGradient id="mLand" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#9fe27a"/><stop offset="1" stop-color="#4faa4c"/></radialGradient>
        <radialGradient id="mSand" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#ffe9a8"/><stop offset="1" stop-color="#e8b95c"/></radialGradient>
      </defs>
      <rect width="1000" height="600" fill="url(#mSky)"/>
      ${sun(880, 80, 46)}
      ${cloud(140, 70, 0.8, 70)}${cloud(520, 110, 0.6, 90)}${cloud(760, 60, 0.5, 60)}
      <rect y="330" width="1000" height="270" fill="url(#mSea)"/>
      <g opacity=".35" fill="#fff"><path class="wave" d="M 0 380 Q 40 370 80 380 T 160 380 T 240 380 T 320 380 T 400 380 T 480 380 T 560 380 T 640 380 T 720 380 T 800 380 T 880 380 T 960 380 T 1040 380" stroke="#fff" stroke-width="4" fill="none"/><path class="wave" style="animation-delay:-3s" d="M -40 470 Q 0 460 40 470 T 120 470 T 200 470 T 280 470 T 360 470 T 440 470 T 520 470 T 600 470 T 680 470 T 760 470 T 840 470 T 920 470 T 1000 470 T 1080 470" stroke="#fff" stroke-width="4" fill="none"/></g>
      <!-- big island -->
      <path d="M 60 300 C 40 180 200 120 330 130 C 460 100 600 110 700 150 C 860 170 960 260 940 360 C 930 450 820 520 660 540 C 520 560 380 560 260 520 C 120 480 70 400 60 300 Z" fill="#3d8f3a" opacity=".5" transform="translate(0 14)"/>
      <path d="M 60 300 C 40 180 200 120 330 130 C 460 100 600 110 700 150 C 860 170 960 260 940 360 C 930 450 820 520 660 540 C 520 560 380 560 260 520 C 120 480 70 400 60 300 Z" fill="url(#mLand)"/>
      <!-- sand beach -->
      <path d="M 160 420 C 200 380 320 400 400 440 C 500 480 620 470 700 430 C 760 400 820 420 860 460 C 800 520 680 540 560 540 C 420 550 300 530 200 500 C 160 480 140 450 160 420 Z" fill="url(#mSand)"/>
      <!-- lake / lagoon -->
      <ellipse cx="800" cy="220" rx="130" ry="80" fill="#5ad0ff"/><ellipse cx="800" cy="220" rx="110" ry="62" fill="#8ce3ff"/>
      <!-- volcano -->
      <path d="M 60 260 L 180 60 L 300 260 Z" fill="#7a4a3a"/><path d="M 60 260 L 180 60 L 220 130 L 140 240 Z" fill="#5a352b"/>
      <path d="M 150 84 L 180 60 L 214 84 L 200 100 L 160 100 Z" fill="#ff5a1f"/><path d="M 172 86 C 160 120 190 140 176 170" stroke="#ff7a1f" stroke-width="10" fill="none" stroke-linecap="round"/>
      <g class="smoke"><circle cx="186" cy="40" r="20" fill="#ddd" opacity=".8"/><circle cx="206" cy="18" r="26" fill="#eee" opacity=".7"/><circle cx="236" cy="0" r="30" fill="#f6f6f6" opacity=".6"/></g>
      <!-- trees -->
      ${palm(420, 200, 0.5)}${palm(470, 220, 0.4, true)}${palm(560, 170, 0.45)}${palm(640, 500, 0.4)}${palm(340, 460, 0.35, true)}
      ${bush(520, 260, 0.6)}${bush(380, 300, 0.5)}${bush(700, 300, 0.55)}
      <!-- desert rocks -->
      ${rock(220, 470, 0.9, '#c98a4b')}${rock(280, 500, 0.6, '#d69a58')}
      <!-- dotted trail -->
      <path d="M 180 180 C 300 120 420 140 500 130 C 640 120 740 180 820 190 M 220 430 C 380 400 470 450 520 440 C 640 430 720 470 820 450 M 500 130 C 520 260 520 330 520 440" stroke="#fff" stroke-width="7" stroke-dasharray="2 20" stroke-linecap="round" fill="none" opacity=".85"/>
    </svg>`;
  }

  function habitat(kind) {
    if (kind === 'volcano') return `<svg class="layer" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="vSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a5b"/><stop offset=".6" stop-color="#ffd08a"/><stop offset="1" stop-color="#ffe9c2"/></linearGradient>
      <linearGradient id="vGround" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a6a4a"/><stop offset="1" stop-color="#5a3f2c"/></linearGradient></defs>
      <rect width="1000" height="600" fill="url(#vSky)"/>
      ${sun(160, 120, 50)}
      ${cloud(600, 90, 0.7, 80)}${cloud(860, 150, 0.5, 60)}
      <path d="M 520 470 L 720 130 L 920 470 Z" fill="#6b4034"/><path d="M 520 470 L 720 130 L 780 230 L 640 470 Z" fill="#4e2c25"/>
      <path d="M 690 152 L 720 130 L 752 152 L 740 170 L 700 170 Z" fill="#ff5a1f"/>
      <path class="lava" d="M 712 160 C 700 220 740 260 720 320 C 710 360 740 400 728 470" stroke="#ff7a1f" stroke-width="14" fill="none" stroke-linecap="round"/>
      <g class="smoke"><circle cx="726" cy="106" r="24" fill="#c9b8b2" opacity=".8"/><circle cx="752" cy="76" r="32" fill="#d9ccc7" opacity=".7"/><circle cx="792" cy="46" r="40" fill="#e8dfdb" opacity=".6"/></g>
      <path d="M 0 470 C 120 400 220 420 330 460 C 420 490 480 440 520 470 L 0 470 Z" fill="#7a5a44"/>
      <path d="M 0 470 C 100 440 160 450 240 470 Z" fill="#8f6c52"/>
      ${rock(140, 470, 1.1, '#5f5058')}${rock(420, 480, 0.8, '#6d5c60')}${rock(940, 480, 1.3, '#5f5058')}
      <rect y="460" width="1000" height="140" fill="url(#vGround)"/>
      <path d="M 0 468 C 200 456 400 480 600 464 C 800 452 900 476 1000 466 L 1000 480 L 0 480 Z" fill="#a17a58"/>
      ${fern(60, 470, 0.7, '#7a8a3a')}${fern(980, 470, 0.6, '#7a8a3a')}
    </svg>`;
    if (kind === 'jungle') return `<svg class="layer" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="jSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fc7ff"/><stop offset="1" stop-color="#d6f5ff"/></linearGradient>
      <linearGradient id="jGround" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6ec25a"/><stop offset="1" stop-color="#3d8a3a"/></linearGradient></defs>
      <rect width="1000" height="600" fill="url(#jSky)"/>
      ${sun(840, 100, 48)}
      ${cloud(200, 80, 0.7, 75)}${cloud(560, 60, 0.5, 95)}
      <path d="M 0 400 C 120 300 260 280 400 330 C 520 370 640 300 760 320 C 880 340 940 380 1000 360 L 1000 480 L 0 480 Z" fill="#2f7a4a" opacity=".55"/>
      <path d="M 0 430 C 100 380 220 370 330 410 C 460 450 560 400 700 420 C 820 440 900 410 1000 430 L 1000 480 L 0 480 Z" fill="#35934f" opacity=".7"/>
      ${palm(90, 470, 1.3)}${palm(930, 470, 1.2, true)}${palm(300, 465, 0.8, true)}${palm(700, 465, 0.9)}
      <rect y="460" width="1000" height="140" fill="url(#jGround)"/>
      <path d="M 0 468 C 200 452 400 482 600 462 C 800 448 900 476 1000 464 L 1000 480 L 0 480 Z" fill="#8bd46e"/>
      ${bush(520, 480, 0.9)}${bush(180, 490, 0.7, '#2f8a44')}${bush(820, 486, 0.8)}
      ${fern(60, 500, 0.9)}${fern(400, 500, 0.7, '#2f8a44')}${fern(960, 500, 0.8)}${fern(640, 496, 0.6)}
    </svg>`;
    return `<svg class="layer" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="lSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4fb8ff"/><stop offset="1" stop-color="#e2f7ff"/></linearGradient>
      <linearGradient id="lWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fd8ff"/><stop offset="1" stop-color="#1e8fd6"/></linearGradient>
      <linearGradient id="lSand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe7a8"/><stop offset="1" stop-color="#e2b15e"/></linearGradient></defs>
      <rect width="1000" height="600" fill="url(#lSky)"/>
      ${sun(160, 100, 50)}
      ${cloud(420, 70, 0.7, 85)}${cloud(780, 120, 0.55, 65)}
      <path d="M 0 360 C 200 320 400 340 600 320 C 800 300 900 330 1000 320 L 1000 470 L 0 470 Z" fill="url(#lWater)"/>
      <g opacity=".5" stroke="#fff" stroke-width="4" fill="none"><path class="wave" d="M 0 390 Q 40 380 80 390 T 160 390 T 240 390 T 320 390 T 400 390 T 480 390 T 560 390 T 640 390 T 720 390 T 800 390 T 880 390 T 960 390 T 1040 390"/><path class="wave" style="animation-delay:-2s" d="M -40 430 Q 0 420 40 430 T 120 430 T 200 430 T 280 430 T 360 430 T 440 430 T 520 430 T 600 430 T 680 430 T 760 430 T 840 430 T 920 430 T 1000 430 T 1080 430"/></g>
      <rect y="460" width="1000" height="140" fill="url(#lSand)"/>
      <path d="M 0 470 C 200 448 400 486 600 458 C 800 440 900 476 1000 460 L 1000 480 L 0 480 Z" fill="#fff0c2"/>
      ${palm(80, 470, 1.2)}${palm(950, 470, 1.1, true)}
      ${rock(300, 476, 0.7, '#9a8c84')}${rock(700, 480, 0.9, '#8a7f7a')}
      ${fern(180, 496, 0.7)}${fern(860, 500, 0.7)}
      <g fill="#ff9ec4"><circle cx="520" cy="486" r="6"/><circle cx="534" cy="480" r="5"/><circle cx="527" cy="494" r="5"/></g>
    </svg>`;
  }

  function egg(e, stage) {
    // stage 0..3 (3 = cracked open)
    const cracks = stage >= 1 ? `<path d="M 60 40 L 70 60 L 58 76 L 72 96" stroke="#7a6a4a" stroke-width="3" fill="none" stroke-linecap="round"/>` : '';
    const cracks2 = stage >= 2 ? `<path d="M 40 80 L 52 96 L 44 112 M 90 60 L 84 80 L 96 98" stroke="#7a6a4a" stroke-width="3" fill="none" stroke-linecap="round"/>` : '';
    return `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="eg${e.id}" cx="38%" cy="30%" r="80%"><stop offset="0" stop-color="${e.color1}"/><stop offset="1" stop-color="${e.color2}"/></radialGradient></defs>
      <ellipse cx="60" cy="140" rx="46" ry="8" fill="#000" opacity=".18"/>
      <path d="M 60 6 C 96 6 112 60 112 92 C 112 122 90 144 60 144 C 30 144 8 122 8 92 C 8 60 24 6 60 6 Z" fill="url(#eg${e.id})" stroke="#6a5a3a" stroke-opacity=".4" stroke-width="2"/>
      <g fill="${e.spots}" opacity=".6"><ellipse cx="42" cy="56" rx="8" ry="6"/><ellipse cx="78" cy="84" rx="9" ry="7"/><ellipse cx="50" cy="110" rx="7" ry="5"/><ellipse cx="82" cy="40" rx="5" ry="4"/></g>
      <ellipse cx="42" cy="34" rx="12" ry="20" fill="#fff" opacity=".35" transform="rotate(-20 42 34)"/>
      ${cracks}${cracks2}</svg>`;
  }

  function foodIcon(food) { return { meat: '🍖', plants: '🌿', leaves: '🌿', fish: '🐟' }[food] || '🍖'; }

  return { map, habitat, egg, foodIcon, palm, fern, bush, rock, cloud, sun };
})();
