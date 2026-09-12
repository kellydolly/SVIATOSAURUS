/* SVIATOSAURUS — SVG dinosaur art.
   Every dinosaur is drawn facing LEFT inside a 400x260 box, ground at y=244.
   Body parts are wrapped in groups with classes so CSS can animate them:
   .dw-head .dw-jaw .dw-neck .dw-tail .dw-leg (.dw-leg-a near, .dw-leg-b far) .dw-arm .dw-eye .dw-plates .dw-sail
*/
window.DW = window.DW || {};

DW.art = (function () {
  let uid = 0;
  const TB = 'transform-box:fill-box;';
  const org = (o) => `style="${TB}transform-origin:${o}"`;

  function eye(cx, cy, r, big) {
    const R = big ? r * 1.6 : r;
    return `<g class="dw-eye">
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff" stroke="#222" stroke-width="1.5"/>
      <circle class="dw-pupil" cx="${cx - R * 0.15}" cy="${cy}" r="${R * 0.62}" fill="#1b1b1b"/>
      <circle cx="${cx - R * 0.42}" cy="${cy - R * 0.42}" r="${R * 0.28}" fill="#fff"/>
      <circle cx="${cx + R * 0.25}" cy="${cy + R * 0.3}" r="${R * 0.12}" fill="#fff" opacity="0.8"/>
      <path class="dw-lid" d="M ${cx - R - 1} ${cy - R * 0.2} Q ${cx} ${cy - R - 3} ${cx + R + 1} ${cy - R * 0.2}" fill="none" stroke="#222" stroke-width="1.5" style="opacity:0"/>
    </g>`;
  }

  function teeth(x0, x1, y, dir, n, size) {
    let s = '';
    const step = (x1 - x0) / (n - 1);
    for (let i = 0; i < n; i++) {
      const x = x0 + i * step;
      s += `M ${x - size / 2} ${y} L ${x} ${y + dir * size * 1.6} L ${x + size / 2} ${y} Z `;
    }
    return `<path d="${s}" fill="#fff" stroke="#333" stroke-width="0.6"/>`;
  }

  function spots(list, color) {
    return `<g opacity="0.28" fill="${color}">` + list.map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.7}"/>`).join('') + `</g>`;
  }

  const STROKE = (pal, w = 1.6) => `stroke="${pal.dark}" stroke-opacity="0.55" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

  /* ---------- THEROPOD (T. rex, Allosaurus, Carnotaurus, Velociraptor, Spinosaurus) ---------- */
  function theropod(pal, v, o) {
    const g = `url(#g${uid})`;
    const S = STROKE(pal);
    const raptor = v === 'raptor', spino = v === 'spino', carno = v === 'carno', allo = v === 'allo';

    // legs
    const legNear = `M 206 144 C 240 140 262 172 246 198 C 244 212 250 224 258 236 L 262 244 L 204 244 L 214 236 C 220 228 216 214 210 202 C 194 186 190 158 206 144 Z`;
    const legRaptor = `M 208 138 C 236 134 250 166 236 190 C 236 206 240 222 248 236 L 250 244 L 208 244 L 216 236 C 220 226 216 210 210 194 C 196 178 194 150 208 138 Z`;
    const legP = raptor ? legRaptor : legNear;
    const claws = `M 206 244 L 197 239 L 208 235 Z M 219 244 L 212 238 L 223 235 Z M 232 244 L 226 238 L 236 236 Z`;
    const sickle = raptor ? `<path d="M 214 236 C 206 232 202 226 206 218 C 208 226 212 230 218 232 Z" fill="#e9e4d4" ${S}/>` : '';

    // arms
    let armNear, armFar;
    if (carno) {
      armNear = `M 164 140 C 160 146 160 150 164 154 L 170 152 C 168 148 168 144 172 141 Z`;
      armFar = `M 178 140 C 174 146 174 150 178 154 L 184 152 C 182 148 182 144 186 141 Z`;
    } else if (raptor || spino || allo) {
      armNear = `M 168 138 C 156 150 154 166 168 172 L 176 168 C 168 160 170 148 180 142 Z`;
      armFar = `M 184 138 C 172 150 170 166 184 172 L 192 168 C 184 160 186 148 196 142 Z`;
    } else {
      armNear = `M 162 138 C 154 146 152 156 158 162 L 166 160 C 162 154 164 146 170 141 Z`;
      armFar = `M 176 138 C 168 146 166 156 172 162 L 180 160 C 176 154 178 146 184 141 Z`;
    }
    const armClaws = (raptor || allo || spino) ? `<path d="M 166 172 L 160 178 L 168 176 Z M 172 171 L 168 179 L 176 176 Z" fill="#e9e4d4" ${S}/>` : '';
    const armFeathers = raptor ? `<path d="M 170 146 C 150 150 140 166 146 182 C 152 170 160 162 174 158 Z" fill="${pal.belly}" ${S}/>` : '';

    // body
    const body = raptor
      ? `M 156 128 C 176 102 246 98 272 124 C 284 148 260 176 210 176 C 170 174 142 152 156 128 Z`
      : `M 150 120 C 170 86 260 82 290 118 C 306 154 268 194 210 192 C 160 190 132 156 150 120 Z`;
    const belly = raptor
      ? `M 170 148 C 190 176 246 176 272 148 C 258 168 214 170 170 148 Z`
      : `M 168 150 C 190 186 250 190 284 150 C 268 178 214 184 168 150 Z`;

    // tail
    const tail = raptor
      ? `M 252 118 C 300 104 350 100 398 110 C 356 122 304 140 252 158 Z`
      : `M 262 112 C 306 100 352 94 398 98 C 366 118 320 150 262 170 Z`;
    const tailFan = raptor ? `<path d="M 340 106 C 360 92 384 88 398 96 C 392 106 386 112 382 116 C 366 112 352 112 340 118 Z" fill="${pal.belly}" ${S}/>` : '';
    const tailFin = spino ? `<path d="M 300 106 C 320 74 360 66 398 82 C 380 90 372 100 372 108 C 350 104 320 108 300 118 Z" fill="${pal.accent}" opacity="0.9" ${S}/>` : '';

    // sail
    const sail = spino ? `<g class="dw-sail"><path d="M 156 120 C 168 62 198 30 220 32 C 250 30 282 66 294 120 Z" fill="${pal.accent}" ${S}/>
      <path d="M 176 118 C 184 80 196 58 208 46 M 200 118 C 204 84 210 62 216 48 M 224 118 C 226 84 230 66 236 52 M 250 118 C 250 90 254 74 258 66 M 272 118 C 270 98 270 88 274 82" fill="none" stroke="${pal.dark}" stroke-width="2" opacity="0.6"/></g>` : '';

    // neck
    const neck = raptor
      ? `M 152 132 C 136 116 130 98 136 84 L 162 90 C 156 106 162 120 178 128 Z`
      : `M 148 130 C 132 112 130 94 138 80 L 168 86 C 162 100 166 114 178 124 Z`;

    // head variants
    let skull, jaw, mouth, extras = '', eyeXY = [122, 78], eyeR = 7, teethU;
    if (raptor) {
      skull = `M 156 76 C 132 62 80 66 44 84 C 40 90 42 96 50 98 L 130 100 C 148 98 160 86 156 76 Z`;
      jaw = `M 50 100 L 132 100 C 134 108 122 114 104 112 L 54 108 Z`;
      mouth = `M 132 100 L 50 98 L 54 108 Z`;
      eyeXY = [118, 82]; eyeR = 6;
      teethU = teeth(58, 118, 98, 1, 8, 4);
      extras = `<path d="M 128 70 C 136 60 150 58 160 64 C 150 66 140 70 132 78 Z" fill="${pal.belly}" ${S}/>`; // little feather crest
    } else if (spino) {
      skull = `M 158 78 C 140 66 90 66 40 82 C 34 86 36 92 44 94 L 130 100 C 150 98 162 90 158 78 Z`;
      jaw = `M 44 96 L 132 100 C 134 106 124 112 108 110 L 48 104 Z`;
      mouth = `M 132 100 L 46 95 L 48 104 Z`;
      eyeXY = [124, 84]; eyeR = 6;
      teethU = teeth(50, 120, 96, 1, 12, 3.5);
      extras = `<path d="M 118 70 C 124 62 134 62 138 70 Z" fill="${pal.accent}" ${S}/>`;
    } else if (carno) {
      skull = `M 150 66 C 128 52 84 56 50 80 C 42 88 44 98 54 100 L 124 104 C 144 100 156 84 150 66 Z`;
      jaw = `M 54 102 L 126 104 C 130 114 118 124 98 122 L 58 114 Z`;
      mouth = `M 126 104 L 54 100 L 58 114 Z`;
      eyeXY = [118, 80]; eyeR = 7;
      teethU = teeth(62, 114, 101, 1, 7, 4.5);
      extras = `<path d="M 104 66 L 96 44 L 116 62 Z M 130 66 L 132 42 L 142 64 Z" fill="${pal.dark}" ${S}/>
        <g fill="${pal.dark}" opacity="0.35"><circle cx="90" cy="76" r="2"/><circle cx="76" cy="84" r="2"/><circle cx="100" cy="88" r="2"/><circle cx="66" cy="92" r="1.5"/></g>`;
    } else if (allo) {
      skull = `M 156 66 C 128 50 80 56 46 80 C 38 88 40 96 50 98 L 128 104 C 148 100 162 84 156 66 Z`;
      jaw = `M 50 101 L 130 104 C 134 114 122 124 100 122 L 56 114 Z`;
      mouth = `M 130 104 L 50 100 L 56 114 Z`;
      eyeXY = [120, 78]; eyeR = 7;
      teethU = teeth(58, 120, 100, 1, 9, 4.5);
      extras = `<path d="M 106 66 L 100 52 L 118 62 Z M 126 66 L 128 52 L 136 64 Z" fill="${pal.accent}" ${S}/>`;
    } else { // trex
      skull = `M 160 66 C 130 50 76 54 44 78 C 36 86 38 96 48 98 L 130 104 C 156 104 170 86 160 66 Z`;
      jaw = `M 48 101 L 132 104 C 136 114 122 124 100 122 L 54 114 Z`;
      mouth = `M 132 104 L 48 100 L 54 114 Z`;
      eyeXY = [122, 78]; eyeR = 7;
      teethU = teeth(56, 122, 100, 1, 9, 5);
      extras = `<path d="M 100 66 C 108 58 128 60 136 70" fill="none" ${S}/>`;
    }

    const sp = raptor ? [[220, 130, 8], [250, 122, 6], [196, 128, 6], [300, 118, 6]] : [[230, 120, 12], [262, 132, 9], [200, 118, 9], [300, 120, 8], [330, 116, 6]];
    const stripes = (allo || raptor) ? `<g fill="${pal.accent}" opacity="0.45"><path d="M 236 104 C 240 120 236 136 226 150 L 236 152 C 246 136 248 118 246 104 Z"/><path d="M 268 108 C 272 124 268 138 260 150 L 268 152 C 278 138 280 122 278 108 Z"/><path d="M 300 104 C 306 116 302 130 296 140 L 304 140 C 310 128 312 114 310 102 Z"/></g>` : spots(sp, pal.dark);

    return `
      <g class="dw-leg dw-leg-b" ${org('50% 8%')}><path d="${legP}" transform="translate(20 0)" fill="${pal.dark}" ${S}/></g>
      <g class="dw-arm dw-arm-b"><path d="${armFar}" fill="${pal.dark}" ${S}/></g>
      <g class="dw-tail" ${org('0% 40%')}>${tailFin}<path d="${tail}" fill="${g}" ${S}/>${tailFan}
        <path d="M 300 118 C 312 118 322 116 334 110 M 330 112 C 338 112 348 108 356 104" fill="none" stroke="${pal.dark}" stroke-width="2" opacity="0.4"/></g>
      ${sail}
      <g class="dw-body"><path d="${body}" fill="${g}" ${S}/><path d="${belly}" fill="${pal.belly}" opacity="0.95"/><path d="${body}" fill="url(#s${uid})" opacity="0.6" style="mix-blend-mode:screen"/>${stripes}</g>
      <g class="dw-leg dw-leg-a" ${org('50% 8%')}><path d="${legP}" fill="${g}" ${S}/><path d="${claws}" fill="#e9e4d4" ${S}/>${sickle}</g>
      <g class="dw-arm dw-arm-a">${armFeathers}<path d="${armNear}" fill="${g}" ${S}/>${armClaws}</g>
      <g class="dw-neck" ${org('80% 100%')}><path d="${neck}" fill="${g}" ${S}/></g>
      <g class="dw-head" ${org('100% 100%')}>
        <path d="${mouth}" fill="#b23a48"/>
        <g class="dw-jaw" ${org('100% 0%')}><path d="${jaw}" fill="${g}" ${S}/></g>
        <path d="${skull}" fill="${g}" ${S}/><path d="${skull}" fill="url(#s${uid})" opacity="0.5"/>
        ${teethU}
        <ellipse cx="${raptor ? 54 : spino ? 50 : 58}" cy="${raptor ? 88 : spino ? 86 : 86}" rx="3" ry="2" fill="${pal.dark}"/>
        ${extras}
        ${eye(eyeXY[0], eyeXY[1], eyeR, o.baby)}
      </g>`;
  }

  /* ---------- SAUROPOD (Brachiosaurus, Diplodocus) ---------- */
  function sauropod(pal, v, o) {
    const g = `url(#g${uid})`;
    const S = STROKE(pal);
    const brachio = v === 'brachiosaurus';
    const body = `M 130 152 C 150 112 250 106 292 142 C 312 172 284 210 220 210 C 160 210 112 192 130 152 Z`;
    const belly = `M 150 180 C 180 210 260 210 292 176 C 270 200 190 204 150 180 Z`;
    const legF = brachio ? `M 138 176 C 148 168 172 170 180 178 L 176 244 L 140 244 Z` : `M 142 186 C 150 178 172 178 178 186 L 176 244 L 144 244 Z`;
    const legB = `M 244 186 C 252 178 280 178 288 186 L 284 244 L 246 244 Z`;
    const feet = `M 138 244 L 180 244 L 180 238 L 138 238 Z M 244 244 L 288 244 L 288 238 L 244 238 Z`;
    let neck, head, jaw, mouth, tail, eyeXY, crest = '';
    if (brachio) {
      neck = `M 132 152 C 108 120 90 82 92 46 L 126 36 C 128 76 148 112 176 134 Z`;
      head = `M 130 42 C 122 22 98 14 76 24 C 66 30 66 44 76 48 L 112 52 C 124 50 132 48 130 42 Z`;
      jaw = `M 76 50 L 112 52 C 112 58 106 62 96 60 L 78 56 Z`;
      mouth = `M 112 52 L 76 49 L 78 56 Z`;
      crest = `<path d="M 96 22 C 102 12 116 14 120 26" fill="${pal.dark}" opacity="0.5"/>`;
      tail = `M 286 150 C 330 140 370 150 398 178 C 366 170 326 176 286 194 Z`;
      eyeXY = [108, 36];
    } else {
      neck = `M 132 150 C 96 140 62 130 30 126 L 32 106 C 70 108 112 118 166 130 Z`;
      head = `M 62 108 C 52 96 30 92 14 100 C 6 106 8 116 16 120 L 48 124 C 58 122 64 116 62 108 Z`;
      jaw = `M 16 122 L 48 124 C 48 130 42 134 32 132 L 18 128 Z`;
      mouth = `M 48 124 L 16 121 L 18 128 Z`;
      tail = `M 286 148 C 330 128 366 104 398 76 C 386 118 342 160 286 192 Z`;
      eyeXY = [44, 108];
    }
    const sp = [[220, 150, 14], [260, 170, 10], [180, 160, 10], [300, 150, 7]];
    return `
      <g class="dw-leg dw-leg-b"><path d="${legF}" transform="translate(22 0)" fill="${pal.dark}" ${S}/><path d="${legB}" transform="translate(22 0)" fill="${pal.dark}" ${S}/></g>
      <g class="dw-tail" ${org('0% 40%')}><path d="${tail}" fill="${g}" ${S}/></g>
      <g class="dw-body"><path d="${body}" fill="${g}" ${S}/><path d="${belly}" fill="${pal.belly}" opacity="0.95"/><path d="${body}" fill="url(#s${uid})" opacity="0.6"/>${spots(sp, pal.dark)}</g>
      <g class="dw-leg dw-leg-a"><path d="${legF}" fill="${g}" ${S}/><path d="${legB}" fill="${g}" ${S}/><path d="${feet}" fill="${pal.dark}" opacity="0.5"/></g>
      <g class="dw-neck" ${org('100% 100%')}><path d="${neck}" fill="${g}" ${S}/>
        <g class="dw-head" ${org('100% 100%')}>
          <path d="${mouth}" fill="#b23a48"/>
          <g class="dw-jaw" ${org('100% 0%')}><path d="${jaw}" fill="${g}" ${S}/></g>
          <path d="${head}" fill="${g}" ${S}/>${crest}
          ${eye(eyeXY[0], eyeXY[1], 4.5, o.baby)}
        </g>
      </g>`;
  }

  /* ---------- CERATOPSIAN (Triceratops) ---------- */
  function ceratopsian(pal, v, o) {
    const g = `url(#g${uid})`;
    const S = STROKE(pal);
    const body = `M 126 140 C 146 100 252 96 290 136 C 306 168 272 204 202 204 C 142 204 104 180 126 140 Z`;
    const belly = `M 146 176 C 180 204 252 204 288 170 C 262 196 190 200 146 176 Z`;
    const legF = `M 140 178 C 150 170 174 170 182 178 L 178 244 L 142 244 Z`;
    const legB = `M 240 184 C 250 176 280 176 288 184 L 284 244 L 244 244 Z`;
    const tail = `M 284 150 C 322 150 352 168 374 192 C 342 186 306 186 282 190 Z`;
    const frill = `M 178 150 C 150 140 110 112 108 72 C 108 42 140 30 166 46 C 184 70 192 110 188 150 Z`;
    const frillSpots = `<g fill="${pal.dark}" opacity="0.35"><circle cx="146" cy="72" r="6"/><circle cx="136" cy="100" r="6"/><circle cx="150" cy="126" r="6"/><circle cx="164" cy="90" r="4"/></g>`;
    const scallops = `<g fill="${pal.light}" ${S}><circle cx="108" cy="72" r="5"/><circle cx="110" cy="92" r="5"/><circle cx="118" cy="112" r="5"/><circle cx="130" cy="130" r="5"/><circle cx="146" cy="142" r="5"/><circle cx="114" cy="52" r="5"/><circle cx="128" cy="38" r="5"/><circle cx="148" cy="32" r="5"/></g>`;
    const face = `M 134 68 C 104 62 62 78 40 104 C 32 112 36 122 46 124 L 110 132 C 132 128 146 100 134 68 Z`;
    const beak = `M 46 104 C 34 108 30 118 40 126 L 48 130 L 52 118 Z`;
    const jaw = `M 46 124 L 110 132 C 110 140 100 144 84 142 L 52 134 Z`;
    const mouth = `M 110 132 L 46 122 L 52 134 Z`;
    const horns = `<path d="M 50 100 L 44 70 L 66 98 Z" fill="#e9e4d4" ${S}/>
      <path d="M 116 78 L 62 22 L 136 62 Z" fill="#e9e4d4" ${S}/>`;
    const hornFar = `<path d="M 136 74 L 90 30 L 150 64 Z" fill="#cfc8b4" ${S}/>`;
    return `
      <g class="dw-leg dw-leg-b"><path d="${legF}" transform="translate(22 0)" fill="${pal.dark}" ${S}/><path d="${legB}" transform="translate(22 0)" fill="${pal.dark}" ${S}/></g>
      <g class="dw-tail" ${org('0% 40%')}><path d="${tail}" fill="${g}" ${S}/></g>
      <g class="dw-body"><path d="${body}" fill="${g}" ${S}/><path d="${belly}" fill="${pal.belly}" opacity="0.95"/><path d="${body}" fill="url(#s${uid})" opacity="0.6"/>${spots([[230, 130, 12], [200, 150, 9], [262, 150, 8]], pal.dark)}</g>
      <g class="dw-leg dw-leg-a"><path d="${legF}" fill="${g}" ${S}/><path d="${legB}" fill="${g}" ${S}/></g>
      <g class="dw-head" ${org('100% 60%')}>
        <path d="${frill}" fill="${g}" ${S}/>${frillSpots}${scallops}
        ${hornFar}
        <path d="${mouth}" fill="#b23a48"/>
        <g class="dw-jaw" ${org('100% 0%')}><path d="${jaw}" fill="${g}" ${S}/></g>
        <path d="${face}" fill="${g}" ${S}/>
        <path d="${beak}" fill="${pal.belly}" ${S}/>
        ${horns}
        ${eye(108, 98, 6, o.baby)}
      </g>`;
  }

  /* ---------- STEGOSAUR ---------- */
  function stegosaur(pal, v, o) {
    const g = `url(#g${uid})`;
    const S = STROKE(pal);
    const body = `M 126 152 C 136 100 226 84 292 130 C 318 160 282 206 200 208 C 140 208 104 192 126 152 Z`;
    const belly = `M 150 186 C 190 210 260 208 292 172 C 268 200 190 204 150 186 Z`;
    const legF = `M 128 182 C 136 174 158 174 166 182 L 164 244 L 130 244 Z`;
    const legB = `M 236 180 C 246 172 278 172 288 180 L 284 244 L 240 244 Z`;
    const tail = `M 286 138 C 322 138 356 156 394 182 C 356 178 320 182 286 196 Z`;
    const spikes = `<path d="M 356 168 L 372 132 L 368 176 Z M 372 176 L 396 150 L 384 184 Z" fill="#e9e4d4" ${S}/>`;
    const pts = [[146, 128, 26], [176, 108, 40], [210, 96, 50], [246, 98, 50], [280, 114, 40], [310, 138, 30], [336, 160, 22]];
    const plate = ([x, y, h], dx, fill) => `<path class="dw-plate" d="M ${x - 14 + dx} ${y + 6} L ${x - 4 + dx} ${y - h} L ${x + 10 + dx} ${y - h + 8} L ${x + 18 + dx} ${y + 6} Z" fill="${fill}" ${S}/>`;
    const platesFar = pts.map(p => plate(p, 14, pal.dark)).join('');
    const platesNear = pts.map(p => plate(p, 0, pal.accent)).join('');
    const neck = `M 128 150 C 104 154 78 168 60 184 L 78 200 C 94 186 112 178 134 176 Z`;
    const head = `M 76 180 C 62 174 40 178 30 190 C 26 196 30 202 38 204 L 66 208 C 78 206 84 192 76 180 Z`;
    const jaw = `M 38 205 L 66 208 C 66 214 60 218 50 216 L 40 211 Z`;
    const mouth = `M 66 208 L 38 203 L 40 211 Z`;
    return `
      <g class="dw-leg dw-leg-b"><path d="${legF}" transform="translate(22 0)" fill="${pal.dark}" ${S}/><path d="${legB}" transform="translate(22 0)" fill="${pal.dark}" ${S}/></g>
      <g class="dw-plates dw-plates-far">${platesFar}</g>
      <g class="dw-tail" ${org('0% 40%')}><path d="${tail}" fill="${g}" ${S}/>${spikes}</g>
      <g class="dw-body"><path d="${body}" fill="${g}" ${S}/><path d="${belly}" fill="${pal.belly}" opacity="0.95"/><path d="${body}" fill="url(#s${uid})" opacity="0.6"/>${spots([[200, 150, 12], [250, 150, 10], [170, 168, 8]], pal.dark)}</g>
      <g class="dw-plates">${platesNear}</g>
      <g class="dw-leg dw-leg-a"><path d="${legF}" fill="${g}" ${S}/><path d="${legB}" fill="${g}" ${S}/></g>
      <g class="dw-neck" ${org('100% 50%')}><path d="${neck}" fill="${g}" ${S}/>
        <g class="dw-head" ${org('100% 50%')}>
          <path d="${mouth}" fill="#b23a48"/>
          <g class="dw-jaw" ${org('100% 0%')}><path d="${jaw}" fill="${g}" ${S}/></g>
          <path d="${head}" fill="${g}" ${S}/>
          ${eye(60, 190, 4.5, o.baby)}
        </g>
      </g>`;
  }

  /* ---------- ANKYLOSAUR ---------- */
  function ankylosaur(pal, v, o) {
    const g = `url(#g${uid})`;
    const S = STROKE(pal);
    const body = `M 104 172 C 116 118 292 114 322 172 C 332 202 300 216 206 216 C 116 216 92 202 104 172 Z`;
    const belly = `M 130 200 C 170 216 260 216 306 198 C 270 212 170 214 130 200 Z`;
    const legF = `M 132 198 C 140 190 162 190 170 198 L 168 244 L 134 244 Z`;
    const legB = `M 252 198 C 262 190 290 190 298 198 L 296 244 L 254 244 Z`;
    const tail = `M 314 176 C 340 168 366 174 382 184 L 380 196 C 356 192 332 194 312 200 Z`;
    const club = `<ellipse cx="386" cy="190" rx="14" ry="11" fill="${pal.dark}" ${S}/><ellipse cx="386" cy="190" rx="7" ry="5" fill="${pal.light}" opacity="0.5"/>`;
    let armor = `<g fill="${pal.dark}" opacity="0.5">`;
    for (let r = 0; r < 3; r++) for (let i = 0; i < 7; i++) armor += `<ellipse cx="${132 + i * 26 + r * 8}" cy="${142 + r * 18}" rx="9" ry="6"/>`;
    armor += `</g>`;
    const sideSpikes = `<path d="M 118 190 L 100 200 L 122 202 Z M 150 204 L 138 218 L 160 212 Z M 200 208 L 194 224 L 212 214 Z M 250 208 L 250 224 L 266 212 Z M 300 200 L 306 216 L 314 204 Z" fill="#e9e4d4" ${S}/>`;
    const head = `M 112 162 C 92 152 56 156 34 174 C 28 180 32 188 40 190 L 96 196 C 108 192 116 178 112 162 Z`;
    const horns = `<path d="M 104 162 L 100 142 L 116 160 Z M 110 178 L 118 196 L 122 176 Z" fill="#e9e4d4" ${S}/>`;
    const jaw = `M 40 191 L 96 196 C 96 204 88 208 76 206 L 44 199 Z`;
    const mouth = `M 96 196 L 40 189 L 44 199 Z`;
    return `
      <g class="dw-leg dw-leg-b"><path d="${legF}" transform="translate(22 0)" fill="${pal.dark}" ${S}/><path d="${legB}" transform="translate(22 0)" fill="${pal.dark}" ${S}/></g>
      <g class="dw-tail" ${org('0% 50%')}><path d="${tail}" fill="${g}" ${S}/>${club}</g>
      <g class="dw-body"><path d="${body}" fill="${g}" ${S}/><path d="${belly}" fill="${pal.belly}" opacity="0.95"/><path d="${body}" fill="url(#s${uid})" opacity="0.6"/>${armor}${sideSpikes}</g>
      <g class="dw-leg dw-leg-a"><path d="${legF}" fill="${g}" ${S}/><path d="${legB}" fill="${g}" ${S}/></g>
      <g class="dw-head" ${org('100% 50%')}>
        <path d="${mouth}" fill="#b23a48"/>
        <g class="dw-jaw" ${org('100% 0%')}><path d="${jaw}" fill="${g}" ${S}/></g>
        <path d="${head}" fill="${g}" ${S}/>${horns}
        ${eye(86, 174, 5, o.baby)}
      </g>`;
  }

  /* ---------- ORNITHOPOD (Parasaurolophus, Iguanodon) ---------- */
  function ornithopod(pal, v, o) {
    const g = `url(#g${uid})`;
    const S = STROKE(pal);
    const para = v === 'parasaurolophus';
    const body = `M 150 130 C 172 96 254 94 286 128 C 300 160 266 194 208 192 C 164 190 132 160 150 130 Z`;
    const belly = `M 168 158 C 190 190 250 192 282 156 C 266 182 214 186 168 158 Z`;
    const leg = `M 208 144 C 242 140 262 172 246 198 C 244 212 250 224 258 236 L 262 244 L 204 244 L 214 236 C 220 228 216 214 210 202 C 194 186 192 158 208 144 Z`;
    const hooves = `M 206 244 L 200 240 L 210 236 Z M 222 244 L 216 239 L 226 236 Z M 238 244 L 232 239 L 242 237 Z`;
    const arm = `M 166 136 C 154 152 152 172 168 178 L 178 174 C 170 164 172 152 182 142 Z`;
    const armFar = `M 184 136 C 172 152 170 172 186 178 L 196 174 C 188 164 190 152 200 142 Z`;
    const thumb = v === 'iguanodon' ? `<path d="M 168 176 L 156 184 L 172 182 Z" fill="#e9e4d4" ${S}/>` : '';
    const tail = `M 262 118 C 306 108 352 104 398 112 C 366 126 320 150 262 168 Z`;
    const neck = `M 148 132 C 136 116 132 100 138 84 L 166 90 C 162 104 166 118 178 126 Z`;
    let skull, jaw, mouth, crest = '', eyeXY;
    if (para) {
      skull = `M 156 74 C 136 60 90 66 50 86 C 44 92 46 100 54 102 L 128 104 C 148 100 160 88 156 74 Z`;
      jaw = `M 52 104 L 130 104 C 130 112 118 118 100 116 L 56 110 Z`;
      mouth = `M 130 104 L 52 102 L 56 110 Z`;
      crest = `<path d="M 128 68 C 156 42 196 30 230 38 C 200 46 172 60 146 80 Z" fill="${pal.accent}" ${S}/>`;
      eyeXY = [116, 82];
    } else {
      skull = `M 156 74 C 132 58 84 64 46 86 C 40 92 42 100 50 102 L 126 104 C 146 100 160 88 156 74 Z`;
      jaw = `M 48 104 L 128 104 C 128 112 116 118 98 116 L 52 110 Z`;
      mouth = `M 128 104 L 48 102 L 52 110 Z`;
      crest = `<path d="M 46 88 C 40 92 40 100 48 102 L 56 100 L 54 90 Z" fill="${pal.belly}" ${S}/>`;
      eyeXY = [118, 82];
    }
    const stripes = `<g fill="${pal.dark}" opacity="0.3"><path d="M 232 100 C 236 118 232 136 224 150 L 234 152 C 244 136 246 116 242 100 Z"/><path d="M 262 106 C 266 122 262 138 254 150 L 262 152 C 272 138 274 120 272 104 Z"/><path d="M 296 108 C 300 118 296 128 292 136 L 300 136 C 306 126 306 114 304 106 Z"/></g>`;
    return `
      <g class="dw-leg dw-leg-b" ${org('50% 8%')}><path d="${leg}" transform="translate(20 0)" fill="${pal.dark}" ${S}/></g>
      <g class="dw-arm dw-arm-b"><path d="${armFar}" fill="${pal.dark}" ${S}/></g>
      <g class="dw-tail" ${org('0% 40%')}><path d="${tail}" fill="${g}" ${S}/></g>
      <g class="dw-body"><path d="${body}" fill="${g}" ${S}/><path d="${belly}" fill="${pal.belly}" opacity="0.95"/><path d="${body}" fill="url(#s${uid})" opacity="0.6" style="mix-blend-mode:screen"/>${stripes}</g>
      <g class="dw-leg dw-leg-a" ${org('50% 8%')}><path d="${leg}" fill="${g}" ${S}/><path d="${hooves}" fill="#e9e4d4" ${S}/></g>
      <g class="dw-arm dw-arm-a"><path d="${arm}" fill="${g}" ${S}/>${thumb}</g>
      <g class="dw-neck" ${org('80% 100%')}><path d="${neck}" fill="${g}" ${S}/></g>
      <g class="dw-head" ${org('100% 100%')}>
        ${crest}
        <path d="${mouth}" fill="#b23a48"/>
        <g class="dw-jaw" ${org('100% 0%')}><path d="${jaw}" fill="${g}" ${S}/></g>
        <path d="${skull}" fill="${g}" ${S}/>
        <ellipse cx="60" cy="90" rx="3" ry="2" fill="${pal.dark}"/>
        ${eye(eyeXY[0], eyeXY[1], 6, o.baby)}
      </g>`;
  }

  const TEMPLATES = { theropod, sauropod, ceratopsian, stegosaur, ankylosaur, ornithopod };


  /* ---------- 3D sprite with a simple 2D rig ----------
     The sprite is drawn once per body part, each copy masked to that part and given its own pivot,
     so head / body / legs / tail move separately. At every joint the two neighbouring parts cross-fade
     over the same band (one fades out exactly as the other fades in), so the body always stays solid
     and no seam or gap appears while a part moves. */
  function rigSvg(d, im, o) {
    uid++;
    const id = 'rg' + uid;
    const H = Math.round(400 * im.h / im.w), W = 400;
    const r = Object.assign({ type: 'front', neck: 0.36, hip: 0.76, split: 0.5, legL: 0.36, legR: 0.64, headPx: 0.5 }, im.rig || {});
    const bandY = H * 0.075, bandX = W * 0.07;   // width of each cross-fade band
    const defs = [], parts = [];
    const img = `<image href="${im.src}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="none"/>`;

    /* A mask covering the whole sprite, with soft edges where `fades` say.
       fade = [side, centre, band]: solid on the inner side of `centre`, fading to nothing across
       `band`. Only the part drawn on top fades at a joint; the part beneath it stays solid right
       across the band, so the two always add up to a solid body. */
    function mask(name, fades) {
      /* first work out the fully solid rectangle … */
      let x0 = 0, y0 = 0, x1 = W, y1 = H;
      fades.forEach(([side, at, band]) => {
        const a = at - band / 2, b = at + band / 2;
        if (side === 'top') y0 = Math.max(y0, b);
        if (side === 'bottom') y1 = Math.min(y1, a);
        if (side === 'left') x0 = Math.max(x0, b);
        if (side === 'right') x1 = Math.min(x1, a);
      });
      /* … then lay each soft edge just outside it, only as wide as the part itself */
      const ramps = [];
      fades.forEach(([side, at, band], i) => {
        const a = at - band / 2, b = at + band / 2;
        const gid = name + 'g' + i;
        const vert = side === 'top' || side === 'bottom';
        const from = side === 'top' || side === 'left' ? a : b;   // transparent end
        const to = side === 'top' || side === 'left' ? b : a;     // solid end
        defs.push(`<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${vert ? 0 : from}" y1="${vert ? from : 0}" x2="${vert ? 0 : to}" y2="${vert ? to : 0}"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>`);
        if (vert) ramps.push(`<rect x="${x0}" y="${a}" width="${Math.max(0, x1 - x0)}" height="${band}" fill="url(#${gid})"/>`);
        else ramps.push(`<rect x="${a}" y="${y0}" width="${band}" height="${Math.max(0, y1 - y0)}" fill="url(#${gid})"/>`);
      });
      const solid = `<rect x="${x0}" y="${y0}" width="${Math.max(0, x1 - x0)}" height="${Math.max(0, y1 - y0)}" fill="#fff"/>`;
      defs.push(`<mask id="${name}" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}">${solid}${ramps.join('')}</mask>`);
    }
    /* clip is only there to keep taps on the right body part; it is always wider than the mask */
    const part = (cls, name, cx0, cy0, cx1, cy1, px, py) => {
      defs.push(`<clipPath id="${name}c"><rect x="${cx0}" y="${cy0}" width="${cx1 - cx0}" height="${cy1 - cy0}"/></clipPath>`);
      parts.push(`<g class="${cls}" mask="url(#${name})" clip-path="url(#${name}c)" style="transform-origin:${px * 100}% ${py * 100}%">${img}</g>`);
    };

    const hipY = H * r.hip, splitX = W * r.split;
    const bY = bandY, bX = bandX;
    if (r.type === 'side') {
      const hx = W * r.head.cut, tx = W * r.tail.cut;
      const hy0 = H * r.head.y0, hy1 = H * r.head.y1, ty0 = H * r.tail.y0, ty1 = H * r.tail.y1;
      mask(id + 'la', [['top', hipY - 2 * bY, bY], ['right', splitX + bX / 2, bX]]);
      mask(id + 'lb', [['top', hipY - 2 * bY, bY], ['left', splitX - bX / 2, bX]]);
      mask(id + 't', [['right', tx + 2 * bX, bX], ['top', ty0, bY], ['bottom', ty1, bY]]);
      mask(id + 'b', [['left', tx, bX], ['right', hx + 2 * bX, bX], ['bottom', hipY, bY]]);
      mask(id + 'h', [['left', hx, bX], ['top', hy0, bY], ['bottom', hy1, bY]]);
      part('dw-leg dw-leg-b', id + 'lb', splitX - bX, hipY - 2 * bY, W, H, r.legR, r.hip);
      part('dw-leg dw-leg-a', id + 'la', 0, hipY - 2 * bY, splitX + bX, H, r.legL, r.hip);
      part('dw-tail', id + 't', 0, ty0 - bY, tx + 3 * bX, ty1 + bY, r.tail.px, r.tail.py);
      part('dw-body', id + 'b', tx - bX, 0, hx + 3 * bX, hipY + bY, 0.5, r.hip);
      part('dw-head', id + 'h', hx - bX, hy0 - bY, W, hy1 + bY, r.head.px, r.head.py);
    } else {
      const neckY = H * r.neck;
      mask(id + 'la', [['top', hipY - 2 * bY, bY], ['right', splitX + bX / 2, bX]]);
      mask(id + 'lb', [['top', hipY - 2 * bY, bY], ['left', splitX - bX / 2, bX]]);
      mask(id + 'b', [['top', neckY - 2 * bY, bY], ['bottom', hipY, bY]]);
      mask(id + 'h', [['bottom', neckY, bY]]);
      part('dw-leg dw-leg-b', id + 'lb', splitX - bX, hipY - 2 * bY, W, H, r.legR, r.hip);
      part('dw-leg dw-leg-a', id + 'la', 0, hipY - 2 * bY, splitX + bX, H, r.legL, r.hip);
      part('dw-body', id + 'b', 0, neckY - 3 * bY, W, hipY + bY, 0.5, r.hip);
      part('dw-head', id + 'h', 0, 0, W, neckY + bY, r.headPx == null ? 0.5 : r.headPx, r.neck);
    }
    return `<svg class="dino dino-rig ${o.cls || ''}" data-dino="${d.id}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
      <defs>${defs.join('')}</defs>
      <ellipse class="dw-shadow" cx="${W / 2}" cy="${H - 5}" rx="${W * 0.34}" ry="${H * 0.022}" fill="#000" opacity="0.22"/>
      <g class="dw-root">${parts.join('')}</g></svg>`;
  }

  /* URL of the flat picture of a dinosaur: the 3D sprite if there is one, otherwise the drawn SVG */
  function imageURL(dinoOrId, opts) {
    const d = typeof dinoOrId === 'string' ? DW.dino(dinoOrId) : dinoOrId; const o = opts || {};
    const im = window.DW.IMAGES && DW.IMAGES[o.baby ? 'baby_' + d.id : d.id];
    if (im) return im.src;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg(d, { noImage: true, baby: o.baby }));
  }

  /* A square picture of the dinosaur on a scene background — used by the jigsaw puzzle,
     so that every piece carries something to look at instead of a flat colour. */
  function picture(dinoOrId, size, opts) {
    const d = typeof dinoOrId === 'string' ? DW.dino(dinoOrId) : dinoOrId;
    const o = opts || {};
    const sky = o.sky || ['#bfe9ff', '#7fc9f0'], ground = o.ground || ['#9fdc76', '#4aa350'];
    return new Promise((res) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas'); c.width = c.height = size;
        const x = c.getContext('2d');
        const g = x.createLinearGradient(0, 0, 0, size); g.addColorStop(0, sky[0]); g.addColorStop(1, sky[1]);
        x.fillStyle = g; x.fillRect(0, 0, size, size);
        // sun
        x.fillStyle = 'rgba(255,241,150,.95)'; x.beginPath(); x.arc(size * 0.17, size * 0.15, size * 0.085, 0, 6.283); x.fill();
        x.fillStyle = 'rgba(255,241,150,.35)'; x.beginPath(); x.arc(size * 0.17, size * 0.15, size * 0.14, 0, 6.283); x.fill();
        // clouds
        x.fillStyle = 'rgba(255,255,255,.9)';
        [[0.62, 0.13, 0.075], [0.72, 0.15, 0.055], [0.54, 0.16, 0.05], [0.36, 0.27, 0.045], [0.44, 0.28, 0.035]].forEach(([cx, cy, rr]) => { x.beginPath(); x.arc(size * cx, size * cy, size * rr, 0, 6.283); x.fill(); });
        // hills + ground
        const gg = x.createLinearGradient(0, size * 0.6, 0, size); gg.addColorStop(0, ground[0]); gg.addColorStop(1, ground[1]);
        x.fillStyle = 'rgba(90,180,110,.65)';
        x.beginPath(); x.moveTo(0, size * 0.72); x.quadraticCurveTo(size * 0.25, size * 0.55, size * 0.5, size * 0.71); x.quadraticCurveTo(size * 0.78, size * 0.86, size, size * 0.66); x.lineTo(size, size); x.lineTo(0, size); x.fill();
        x.fillStyle = gg;
        x.beginPath(); x.moveTo(0, size * 0.8); x.quadraticCurveTo(size * 0.3, size * 0.73, size * 0.62, size * 0.79); x.quadraticCurveTo(size * 0.85, size * 0.83, size, size * 0.78); x.lineTo(size, size); x.lineTo(0, size); x.fill();
        // ferns
        x.strokeStyle = 'rgba(40,120,60,.55)'; x.lineWidth = Math.max(2, size * 0.006); x.lineCap = 'round';
        [[0.08, 0.92], [0.93, 0.88], [0.2, 0.97]].forEach(([fx, fy]) => {
          for (let i = -2; i <= 2; i++) { x.beginPath(); x.moveTo(size * fx, size * fy); x.quadraticCurveTo(size * (fx + i * 0.02), size * (fy - 0.06), size * (fx + i * 0.05), size * (fy - 0.1)); x.stroke(); }
        });
        // the dinosaur, standing on the ground, filling most of the square
        const s = Math.min(size * 0.86 / img.width, size * 0.8 / img.height);
        const w = img.width * s, h = img.height * s;
        x.save(); x.globalAlpha = 0.18; x.fillStyle = '#000';
        x.beginPath(); x.ellipse(size / 2, size * 0.93, w * 0.42, h * 0.045, 0, 0, 6.283); x.fill(); x.restore();
        x.drawImage(img, (size - w) / 2, size * 0.93 - h, w, h);
        res(c.toDataURL('image/jpeg', 0.92));
      };
      img.onerror = () => res(null);
      img.src = imageURL(d, o);
    });
  }

  /* Public: returns an SVG string for a dinosaur */
  function svg(dinoOrId, opts) {
    const d = typeof dinoOrId === 'string' ? DW.dino(dinoOrId) : dinoOrId;
    const o = Object.assign({ baby: false, cls: '', palette: null }, opts || {});
    const pal = o.palette || d.palette;
    const imKey = o.baby ? 'baby_' + d.id : d.id;
    const im = !o.noImage && window.DW.IMAGES && DW.IMAGES[imKey];
    if (im) return rigSvg(d, im, o);
    uid++;
    const inner = TEMPLATES[d.template](pal, d.variant, o);
    return `<svg class="dino ${o.cls}" data-dino="${d.id}" viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
      <defs>
        <radialGradient id="g${uid}" cx="38%" cy="28%" r="78%" fx="34%" fy="22%">
          <stop offset="0" stop-color="${pal.light}"/><stop offset="0.45" stop-color="${pal.main}"/><stop offset="1" stop-color="${pal.dark}"/>
        </radialGradient>
        <linearGradient id="s${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <filter id="f${uid}" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#000" flood-opacity="0.28"/></filter>
      </defs>
      <ellipse class="dw-shadow" cx="215" cy="246" rx="150" ry="10" fill="#000" opacity="0.18"/>
      <g class="dw-root" filter="url(#f${uid})">${inner}</g>
    </svg>`;
  }

  /* Outline-only version for the coloring page */
  function outline(dinoOrId) {
    const d = typeof dinoOrId === 'string' ? DW.dino(dinoOrId) : dinoOrId;
    const pal = { main: 'none', light: 'none', dark: '#333', belly: 'none', accent: 'none' };
    uid++;
    let inner = TEMPLATES[d.template](pal, d.variant, {});
    inner = inner.replace(/fill="url\(#g\d+\)"/g, 'fill="none"').replace(/fill="#b23a48"/g, 'fill="none"')
      .replace(/fill="#e9e4d4"/g, 'fill="none"').replace(/fill="#cfc8b4"/g, 'fill="none"').replace(/fill="#fff"/g, 'fill="none"')
      .replace(/fill="#1b1b1b"/g, 'fill="#333"').replace(/fill="url\(#s\d+\)"/g, 'fill="none"').replace(/stroke-opacity="0\.55"/g, 'stroke-opacity="1"').replace(/ opacity="0\.\d+"/g, ' opacity="0"');
    return `<svg class="dino outline" viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet"><g style="stroke-width:3.5">${inner}</g></svg>`;
  }

  /* height / width of the art box for a dinosaur (0.65 for the SVG templates, image ratio for 3D renders) */
  function aspect(dinoOrId, opts) {
    const d = typeof dinoOrId === 'string' ? DW.dino(dinoOrId) : dinoOrId; const o = opts || {};
    const im = window.DW.IMAGES && DW.IMAGES[o.baby ? 'baby_' + d.id : d.id];
    return im ? im.h / im.w : 0.65;
  }
  return { svg, outline, aspect, imageURL, picture };
})();
