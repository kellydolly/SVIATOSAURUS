/* SVIATOSAURUS — glossy 3D-style props (SVG) used instead of emoji: food, water, ball, tools, bone, star */
window.DW = window.DW || {};

DW.props = (function () {
  let uid = 0;
  const wrap = (inner, vb, cls) => `<svg class="prop ${cls || ''}" viewBox="${vb || '0 0 100 100'}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  const grad = (id, c1, c2, cx, cy) => `<radialGradient id="${id}" cx="${cx || '35%'}" cy="${cy || '30%'}" r="75%"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient>`;
  const shadow = (id) => `<filter id="${id}" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000" flood-opacity=".3"/></filter>`;

  const P = {
    meat() { const i = ++uid; return wrap(`<defs>${grad('m' + i, '#ff8a80', '#b3261e')}${grad('b' + i, '#fff7e0', '#d9c39a', '40%', '40%')}${shadow('s' + i)}</defs>
      <g filter="url(#s${i})"><path d="M 20 78 C 8 66 8 46 24 34 C 40 20 66 20 78 36 C 88 50 84 68 70 76 C 56 84 34 88 20 78 Z" fill="url(#m${i})"/>
      <path d="M 70 76 C 78 80 88 78 92 84 C 96 90 88 96 82 92 C 78 98 68 96 68 90 C 62 88 60 80 70 76 Z" fill="url(#b${i})" stroke="#b09a72" stroke-width="1.5"/>
      <path d="M 26 40 C 36 30 56 28 68 38" stroke="#fff" stroke-opacity=".45" stroke-width="6" fill="none" stroke-linecap="round"/></g>`); },
    leaf() { const i = ++uid; return wrap(`<defs>${grad('l' + i, '#9be15d', '#2e8b3a')}${shadow('s' + i)}</defs>
      <g filter="url(#s${i})"><path d="M 14 86 C 10 50 40 12 88 12 C 90 58 62 88 14 86 Z" fill="url(#l${i})"/>
      <path d="M 16 84 C 36 60 56 40 84 16" stroke="#1f6b2a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M 32 66 C 44 64 52 58 58 48 M 46 54 C 58 52 64 46 70 36" stroke="#1f6b2a" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M 26 60 C 34 42 50 28 70 22" stroke="#fff" stroke-opacity=".4" stroke-width="5" fill="none" stroke-linecap="round"/></g>`); },
    fish() { const i = ++uid; return wrap(`<defs>${grad('f' + i, '#8fd3ff', '#1e6fbf')}${shadow('s' + i)}</defs>
      <g filter="url(#s${i})"><path d="M 8 50 C 24 22 60 16 82 40 L 96 26 L 94 74 L 82 60 C 60 84 24 78 8 50 Z" fill="url(#f${i})"/>
      <path d="M 30 44 C 42 34 60 34 72 44" stroke="#fff" stroke-opacity=".5" stroke-width="5" fill="none" stroke-linecap="round"/>
      <circle cx="26" cy="46" r="6" fill="#fff"/><circle cx="27" cy="46" r="3.5" fill="#1b1b1b"/><circle cx="25.5" cy="44.5" r="1.3" fill="#fff"/>
      <path d="M 44 34 L 52 22 L 60 34 Z" fill="#1e6fbf" opacity=".8"/><path d="M 14 54 C 20 58 26 60 32 58" stroke="#0e4a8a" stroke-width="2" fill="none" stroke-linecap="round"/></g>`); },
    water() { const i = ++uid; return wrap(`<defs>${grad('w' + i, '#bfefff', '#1e8fd6', '38%', '35%')}${shadow('s' + i)}</defs>
      <g filter="url(#s${i})"><path d="M 50 6 C 60 30 84 48 84 66 C 84 86 68 96 50 96 C 32 96 16 86 16 66 C 16 48 40 30 50 6 Z" fill="url(#w${i})"/>
      <path d="M 30 70 C 30 58 38 48 46 42" stroke="#fff" stroke-opacity=".7" stroke-width="6" fill="none" stroke-linecap="round"/></g>`); },
    ball() { const i = ++uid; return wrap(`<defs>${grad('r' + i, '#ff9d9d', '#b91c1c')}${shadow('s' + i)}</defs>
      <g filter="url(#s${i})"><circle cx="50" cy="50" r="42" fill="url(#r${i})"/><path d="M 8 50 C 30 42 70 42 92 50" stroke="#fff" stroke-width="10" fill="none"/><path d="M 12 40 C 30 34 70 34 88 40" stroke="#fff" stroke-opacity=".6" stroke-width="3" fill="none"/><circle cx="34" cy="30" r="9" fill="#fff" opacity=".5"/></g>`); },
    bone() { const i = ++uid; return wrap(`<defs>${grad('bn' + i, '#fffaf0', '#cdb992', '40%', '35%')}${shadow('s' + i)}</defs>
      <g filter="url(#s${i})" transform="rotate(-30 50 50)"><rect x="24" y="40" width="52" height="20" rx="10" fill="url(#bn${i})" stroke="#a89570" stroke-width="1.5"/>
      <circle cx="22" cy="38" r="11" fill="url(#bn${i})" stroke="#a89570" stroke-width="1.5"/><circle cx="22" cy="62" r="11" fill="url(#bn${i})" stroke="#a89570" stroke-width="1.5"/>
      <circle cx="78" cy="38" r="11" fill="url(#bn${i})" stroke="#a89570" stroke-width="1.5"/><circle cx="78" cy="62" r="11" fill="url(#bn${i})" stroke="#a89570" stroke-width="1.5"/>
      <path d="M 30 46 L 70 46" stroke="#fff" stroke-opacity=".6" stroke-width="4" stroke-linecap="round"/></g>`); },
    brush() { const i = ++uid; return wrap(`<defs>${grad('h' + i, '#ffd27a', '#b8741a', '40%', '30%')}${shadow('s' + i)}</defs>
      <g filter="url(#s${i})" transform="rotate(35 50 50)"><rect x="42" y="4" width="16" height="52" rx="8" fill="url(#h${i})"/><rect x="34" y="52" width="32" height="14" rx="4" fill="#7a4a12"/>
      <path d="M 34 66 L 66 66 L 70 94 L 30 94 Z" fill="#f2e6c8"/><g stroke="#c9b48a" stroke-width="2"><path d="M 40 68 L 38 92 M 48 68 L 47 92 M 56 68 L 57 92 M 64 68 L 66 92"/></g>
      <path d="M 46 8 L 46 50" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/></g>`); },
    pick() { const i = ++uid; return wrap(`<defs>${grad('p' + i, '#e8e8e8', '#6b6b73', '35%', '30%')}${shadow('s' + i)}</defs>
      <g filter="url(#s${i})" transform="rotate(40 50 50)"><rect x="44" y="20" width="12" height="76" rx="6" fill="#9a5a24"/><rect x="47" y="24" width="3" height="60" rx="1.5" fill="#fff" opacity=".35"/>
      <path d="M 10 30 C 30 8 70 8 90 30 C 70 22 60 22 56 24 L 50 26 L 44 24 C 40 22 30 22 10 30 Z" fill="url(#p${i})" stroke="#4a4a52" stroke-width="1.5"/></g>`); },
    glass() { const i = ++uid; return wrap(`<defs>${grad('g' + i, '#e6f8ff', '#8fd0f0', '35%', '30%')}${shadow('s' + i)}</defs>
      <g filter="url(#s${i})"><path d="M 58 64 L 88 94" stroke="#7a4a12" stroke-width="14" stroke-linecap="round"/><path d="M 60 66 L 86 92" stroke="#c98a3a" stroke-width="5" stroke-linecap="round"/>
      <circle cx="40" cy="40" r="30" fill="url(#g${i})" stroke="#4a4a52" stroke-width="7"/><circle cx="40" cy="40" r="30" fill="none" stroke="#fff" stroke-width="2" opacity=".5"/>
      <path d="M 22 36 C 24 26 32 20 42 20" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/></g>`); },
    star() { const i = ++uid; return wrap(`<defs>${grad('st' + i, '#fff3a0', '#f5a300', '40%', '35%')}${shadow('s' + i)}</defs>
      <g filter="url(#s${i})"><path d="M 50 6 L 62 36 L 94 38 L 69 58 L 78 90 L 50 72 L 22 90 L 31 58 L 6 38 L 38 36 Z" fill="url(#st${i})" stroke="#c77800" stroke-width="2" stroke-linejoin="round"/><path d="M 40 40 L 50 20" stroke="#fff" stroke-opacity=".7" stroke-width="4" stroke-linecap="round"/></g>`); },
    heart() { const i = ++uid; return wrap(`<defs>${grad('ht' + i, '#ff9db4', '#d61c4e', '35%', '30%')}${shadow('s' + i)}</defs>
      <g filter="url(#s${i})"><path d="M 50 88 C 20 66 6 50 10 32 C 14 14 38 12 50 30 C 62 12 86 14 90 32 C 94 50 80 66 50 88 Z" fill="url(#ht${i})"/><ellipse cx="32" cy="32" rx="8" ry="5" fill="#fff" opacity=".5" transform="rotate(-25 32 32)"/></g>`); },
    egg(e, stage) { return DW.scenes.egg(e || DW.EGGS[0], stage || 0); },
    food(kind) { return kind === 'meat' ? P.meat() : kind === 'fish' ? P.fish() : P.leaf(); }
  };
  return P;
})();
