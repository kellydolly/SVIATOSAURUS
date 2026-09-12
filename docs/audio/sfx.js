/* SVIATOSAURUS — sound effects & ambience, synthesized with Web Audio (no external files). */
window.DW = window.DW || {};

DW.sfx = (function () {
  let ctx = null, master = null, ambGain = null, enabled = true, amb = { nodes: [], timers: [], kind: null };

  function init() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = enabled ? 0.55 : 0; master.connect(ctx.destination);
    ambGain = ctx.createGain(); ambGain.gain.value = 0.35; ambGain.connect(master);
    return true;
  }
  function resume() { if (init() && ctx.state === 'suspended') ctx.resume(); }
  function setEnabled(v) {
    enabled = v;
    if (master) master.gain.setTargetAtTime(v ? 0.55 : 0, ctx.currentTime, 0.05);
  }
  function now() { return ctx ? ctx.currentTime : 0; }

  function tone(freq, dur, type, vol, when, slideTo) {
    if (!ctx || !enabled) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine'; o.frequency.value = freq;
    const t = now() + (when || 0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.3, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
  }

  let noiseBuf = null;
  function getNoise() {
    if (noiseBuf) return noiseBuf;
    const len = ctx.sampleRate * 2, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    noiseBuf = b; return b;
  }
  function noise(dur, vol, freq, when, type, q, dest) {
    if (!ctx || !enabled) return null;
    const src = ctx.createBufferSource(); src.buffer = getNoise(); src.loop = true;
    const f = ctx.createBiquadFilter(); f.type = type || 'lowpass'; f.frequency.value = freq || 1000; f.Q.value = q || 0.8;
    const g = ctx.createGain();
    const t = now() + (when || 0);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(dest || master); src.start(t); src.stop(t + dur + 0.05);
    return { src, f, g };
  }

  const fx = {
    click() { tone(660, 0.07, 'triangle', 0.18); tone(990, 0.09, 'triangle', 0.12, 0.05); },
    pop() { tone(320, 0.14, 'sine', 0.3, 0, 720); },
    pick() { tone(1400, 0.05, 'square', 0.06); noise(0.09, 0.25, 2200, 0, 'bandpass', 2); },
    dig() { noise(0.18, 0.28, 700, 0, 'lowpass'); tone(120, 0.12, 'sine', 0.15, 0, 60); },
    brush() { noise(0.22, 0.10, 3500, 0, 'highpass'); },
    discovery() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.35, 'triangle', 0.22, i * 0.11)); tone(1319, 0.6, 'sine', 0.18, 0.45); },
    celebrate() {
      [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, 0.28, 'triangle', 0.2, i * 0.12));
      [0.2, 0.5, 0.8].forEach(t => noise(0.25, 0.08, 4000, t, 'highpass'));
    },
    step(vol) { tone(72, 0.2, 'sine', vol || 0.45, 0, 38); noise(0.12, 0.12, 320); },
    stomp() { tone(60, 0.35, 'sine', 0.7, 0, 30); noise(0.25, 0.25, 260); },
    roar() {
      if (!ctx || !enabled) return;
      const t = now();
      const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
      o.type = 'sawtooth'; o2.type = 'square'; o.frequency.setValueAtTime(95, t); o.frequency.exponentialRampToValueAtTime(48, t + 1.1);
      o2.frequency.setValueAtTime(48, t); o2.frequency.exponentialRampToValueAtTime(30, t + 1.1);
      f.type = 'lowpass'; f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(220, t + 1.1);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.35, t + 0.08); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
      o.connect(f); o2.connect(f); f.connect(g); g.connect(master); o.start(t); o2.start(t); o.stop(t + 1.3); o2.stop(t + 1.3);
      noise(1.0, 0.18, 400, 0, 'lowpass');
    },
    grunt() { tone(140, 0.25, 'sawtooth', 0.15, 0, 90); tone(120, 0.3, 'triangle', 0.2, 0.15, 70); noise(0.35, 0.1, 300); },
    low() { tone(70, 0.9, 'sine', 0.4, 0, 45); tone(105, 0.8, 'triangle', 0.12, 0.05, 60); },
    screech() { tone(900, 0.18, 'sawtooth', 0.09, 0, 1500); tone(1400, 0.22, 'square', 0.05, 0.15, 900); },
    trumpet() { tone(180, 0.7, 'sawtooth', 0.14, 0, 240); tone(360, 0.6, 'triangle', 0.1, 0.05, 480); },
    chomp() { noise(0.09, 0.28, 1200, 0, 'bandpass', 1.5); tone(220, 0.12, 'sine', 0.25, 0.02, 90); tone(180, 0.1, 'sine', 0.2, 0.18, 80); },
    munch() { noise(0.08, 0.2, 2500, 0, 'bandpass', 2); noise(0.08, 0.2, 2500, 0.14, 'bandpass', 2); noise(0.08, 0.2, 2500, 0.28, 'bandpass', 2); },
    happy() { [784, 988, 1175].forEach((f, i) => tone(f, 0.18, 'sine', 0.2, i * 0.08)); },
    wrong() { tone(230, 0.22, 'triangle', 0.16); tone(180, 0.3, 'triangle', 0.14, 0.18); },
    splash() { noise(0.35, 0.22, 2500, 0, 'highpass'); tone(420, 0.2, 'sine', 0.1, 0, 180); },
    drink() { [0, 0.18, 0.36].forEach(t => tone(500, 0.12, 'sine', 0.12, t, 760)); },
    crack() { noise(0.06, 0.4, 3000, 0, 'highpass'); tone(1800, 0.05, 'square', 0.05); tone(600, 0.08, 'triangle', 0.15, 0.02, 300); },
    whoosh() { noise(0.35, 0.16, 1800, 0, 'bandpass', 1); },
    drop() { tone(400, 0.12, 'sine', 0.2, 0, 200); },
    snap() { tone(900, 0.06, 'square', 0.08); tone(1200, 0.1, 'sine', 0.2, 0.03, 1600); },
    sparkle() { [1568, 2093, 2637].forEach((f, i) => tone(f, 0.16, 'sine', 0.12, i * 0.06)); },
    star() { [1047, 1319, 1568, 2093].forEach((f, i) => tone(f, 0.2, 'triangle', 0.16, i * 0.07)); },
    yawn() { tone(300, 0.9, 'sine', 0.18, 0, 140); },
    bounce() { tone(260, 0.12, 'sine', 0.25, 0, 520); },
    purr() { for (let i = 0; i < 6; i++) tone(90, 0.08, 'triangle', 0.12, i * 0.09); }
  };
  fx.dino = function (kind) { (fx[kind] || fx.roar)(); };

  /* ---- ambience loops ---- */
  function stopAmbience() {
    amb.timers.forEach(clearTimeout); amb.timers = [];
    amb.nodes.forEach(n => { try { n.stop ? n.stop() : n.disconnect(); } catch (e) { } });
    amb.nodes = []; amb.kind = null;
  }
  function loopNoise(vol, freq, type, q, lfoRate, lfoDepth) {
    const src = ctx.createBufferSource(); src.buffer = getNoise(); src.loop = true;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q || 0.7;
    const g = ctx.createGain(); g.gain.value = vol;
    if (lfoRate) {
      const lfo = ctx.createOscillator(), lg = ctx.createGain();
      lfo.frequency.value = lfoRate; lg.gain.value = lfoDepth || vol * 0.5; lfo.connect(lg); lg.connect(g.gain); lfo.start();
      amb.nodes.push(lfo);
    }
    src.connect(f); f.connect(g); g.connect(ambGain); src.start();
    amb.nodes.push(src);
  }
  function schedule(fn, min, max) {
    const t = setTimeout(() => { if (enabled) fn(); schedule(fn, min, max); }, min + Math.random() * (max - min));
    amb.timers.push(t);
  }
  function ambience(kind) {
    if (!init()) return;
    if (amb.kind === kind) return;
    stopAmbience();
    amb.kind = kind;
    if (!kind) return;
    if (kind === 'jungle') {
      loopNoise(0.05, 900, 'lowpass', 0.5, 0.15, 0.03);
      schedule(() => { const b = 1800 + Math.random() * 1200; tone(b, 0.12, 'sine', 0.08, 0, b * 1.3); tone(b * 1.2, 0.12, 'sine', 0.07, 0.16, b * 1.5); }, 1500, 4500);
      schedule(() => { for (let i = 0; i < 4; i++) tone(2400 + i * 60, 0.06, 'sine', 0.05, i * 0.08); }, 3000, 8000);
    } else if (kind === 'volcano') {
      loopNoise(0.12, 140, 'lowpass', 0.8, 0.08, 0.06);
      const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = 42; g.gain.value = 0.08; o.connect(g); g.connect(ambGain); o.start(); amb.nodes.push(o);
      schedule(() => { tone(180, 0.25, 'sine', 0.12, 0, 60); noise(0.4, 0.1, 500); }, 2500, 7000);
    } else if (kind === 'lagoon') {
      loopNoise(0.09, 700, 'bandpass', 0.6, 0.22, 0.05);
      schedule(() => { noise(0.4, 0.07, 3000, 0, 'highpass'); }, 2000, 5000);
      schedule(() => { const b = 1500 + Math.random() * 800; tone(b, 0.1, 'sine', 0.05, 0, b * 1.2); }, 4000, 9000);
    } else if (kind === 'desert') {
      loopNoise(0.05, 500, 'lowpass', 0.4, 0.05, 0.03);
    } else if (kind === 'camp') {
      schedule(() => { for (let i = 0; i < 5; i++) tone(4200, 0.03, 'sine', 0.04, i * 0.07); }, 700, 1800);
      loopNoise(0.03, 800, 'lowpass', 0.4);
    } else if (kind === 'museum') {
      loopNoise(0.015, 400, 'lowpass', 0.4);
    }
  }

  /* Silence everything the moment the game is off screen, and pick the ambience back up on return.
     Without this the jungle keeps humming in a hidden tab, which is maddening for whoever is nearby. */
  let parked = null;
  function park() {
    parked = amb.kind;
    stopAmbience();
    if (ctx && ctx.state === 'running') { try { ctx.suspend(); } catch (e) { } }
  }
  function unpark() {
    if (!enabled) return;
    if (ctx && ctx.state === 'suspended') { try { ctx.resume(); } catch (e) { } }
    if (parked) { const k = parked; parked = null; ambience(k); }
  }

  return Object.assign({ init, resume, setEnabled, ambience, stopAmbience, park, unpark, isEnabled: () => enabled }, fx);
})();
