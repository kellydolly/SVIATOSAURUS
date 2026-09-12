/* SVIATOSAURUS — English voice.
   1) Pre-recorded child voice (Fish Audio «Emma»): either one mp3 per sentence (local build) or a few
      big mp3 sprites the game seeks into (published build — a web page can only carry a few files).
   2) Anything that was never recorded (a dinosaur name the child typed) falls back to the browser voice.
   Every phrase is also shown in a big speech bubble and can be replayed with the 🗣️ button. */
window.DW = window.DW || {};

DW.voice = (function () {
  let voice = null, enabled = true, last = '', queue = [], current = null, seq = 0, stopT = null;
  const synth = window.speechSynthesis;
  const cache = {};
  const SPLIT = /(?<!\bT)(?<=[.!?])\s+/;
  const sprite = window.DW.VOICE_SPRITE || null;
  const spriteEls = sprite ? sprite.files.map((src, i) => { const a = new Audio(src); a.preload = i === 0 ? 'auto' : 'metadata'; return a; }) : null;

  function pickVoice() {
    if (!synth) return;
    const vs = synth.getVoices(); if (!vs.length) return;
    const prefs = ['Google US English', 'Microsoft Aria', 'Microsoft Jenny', 'Samantha', 'Microsoft Zira', 'Karen', 'Google UK English Female'];
    for (const p of prefs) { const v = vs.find(x => x.name.indexOf(p) === 0); if (v) { voice = v; break; } }
    if (!voice) voice = vs.find(v => /^en[-_]/i.test(v.lang)) || vs[0];
  }
  if (synth) { pickVoice(); synth.onvoiceschanged = pickVoice; }

  const norm = (s) => s.trim().replace(/\s+/g, ' ');
  function lookup(sentence) {
    const key = norm(sentence);
    if (sprite) {
      const c = sprite.clips;
      const e = c[key] || c[key.replace(/[.!]$/, '!')] || c[key.replace(/[.!]$/, '.')];
      return e ? { sprite: e } : null;
    }
    const m = window.DW.VOICE_MANIFEST; if (!m) return null;
    const f = m[key] || m[key.replace(/[.!]$/, '!')] || m[key.replace(/[.!]$/, '.')];
    return f ? { src: 'audio/voice/' + f + '.mp3' } : null;
  }
  function getAudio(src) {
    if (!cache[src]) { const a = new Audio(src); a.preload = 'auto'; cache[src] = a; }
    return cache[src];
  }

  function stopAll() {
    seq++; queue = []; clearTimeout(stopT);
    if (current) { try { current.pause(); } catch (e) { } current = null; }
    if (synth) synth.cancel();
  }

  function playNext(mySeq) {
    if (mySeq !== seq || !queue.length) return;
    const s = queue.shift();
    const hit = lookup(s);
    if (!hit) return speakFallback(s, mySeq);
    if (hit.src) {
      const a = getAudio(hit.src); current = a;
      a.onended = () => { current = null; playNext(mySeq); };
      a.onerror = () => { current = null; speakFallback(s, mySeq); };
      a.currentTime = 0;
      const p = a.play(); if (p && p.catch) p.catch(() => speakFallback(s, mySeq));
      return;
    }
    playSprite(hit.sprite, s, mySeq);
  }

  /* Each sprite is pulled into memory once (as a blob) so that jumping to a clip is instant.
     Until that has finished the element streams from the network, and we only play once the
     playhead really is at the right spot — otherwise the child would hear a random phrase. */
  const blobState = [];
  function ensureBlob(i, then) {
    if (!sprite || blobState[i]) { then && then(); return; }
    blobState[i] = 'loading';
    fetch(sprite.files[i]).then(r => r.blob()).then(b => {
      blobState[i] = 'ready';
      const a = spriteEls[i], playing = !a.paused;
      if (!playing) { a.src = URL.createObjectURL(b); a.load(); }
      else a.addEventListener('pause', () => { a.src = URL.createObjectURL(b); a.load(); }, { once: true });
      then && then();
    }).catch(() => { blobState[i] = null; then && then(); });
  }

  function playSprite(e, text, mySeq) {
    const a = spriteEls[e[0]]; current = a;
    ensureBlob(e[0]);
    const go = () => {
      if (mySeq !== seq) return;
      const p = a.play();
      if (p && p.catch) p.catch(() => { current = null; speakFallback(text, mySeq); });
      clearTimeout(stopT);
      stopT = setTimeout(() => { try { a.pause(); } catch (err) { } current = null; playNext(mySeq); }, e[2] * 1000 + 80);
    };
    let tries = 0;
    const seek = () => {
      if (mySeq !== seq) return;
      if (Math.abs(a.currentTime - e[1]) < 0.06) return go();      // really at the clip: play it
      if (tries++ > 8) { current = null; return speakFallback(text, mySeq); }
      try { a.currentTime = e[1]; } catch (err) { }
      setTimeout(seek, 120);
    };
    if (a.readyState >= 1) seek();
    else { a.addEventListener('loadedmetadata', seek, { once: true }); try { a.load(); } catch (err) { seek(); } setTimeout(seek, 500); }
  }

  function speakFallback(text, mySeq) {
    if (!synth) { playNext(mySeq); return; }
    try {
      const u = new SpeechSynthesisUtterance(text);
      if (voice) u.voice = voice; u.lang = (voice && voice.lang) || 'en-US'; u.rate = 0.82; u.pitch = 1.1;
      u.onend = () => playNext(mySeq); u.onerror = () => playNext(mySeq);
      synth.speak(u);
    } catch (e) { playNext(mySeq); }
  }

  /* say(text, {bubble:true, important:true, icon}) — important phrases cut off what is playing */
  function say(text, opts) {
    opts = opts || {};
    last = text;
    if (opts.bubble !== false && DW.ui) DW.ui.bubble(text, opts.icon);
    if (!enabled) return;
    if (opts.important !== false) stopAll(); else seq++;
    queue = text.trim().split(SPLIT).filter(Boolean);
    playNext(seq);
  }
  function repeat() { if (last) say(last, { important: true }); }
  function stop() { stopAll(); }
  function setEnabled(v) { enabled = v; if (!v) stopAll(); }
  /* after the first tap, get the audio moving so the first phrase is not late */
  function warm() {
    if (spriteEls) { ensureBlob(0, () => ensureBlob(1, () => ensureBlob(2))); return; }
    ['Great job!', 'Excellent!', 'Try again!', 'Yummy!', 'Wow!'].forEach(s => { const h = lookup(s); if (h && h.src) getAudio(h.src); });
  }

  return { say, repeat, stop, setEnabled, warm, isEnabled: () => enabled, available: () => true, getLast: () => last, lookup };
})();

/* Common phrases (short and simple) */
/* Praise that uses the child's name, so the game feels like it is talking to him.
   Falls back to the plain phrase when a profile has no name yet. */
DW.kid = function () { const s = DW.state && DW.state.get(); return (s && s.childName) || ''; };
DW.praise = function () {
  const n = DW.kid();
  const plain = ['Great job!', 'Excellent!', 'Amazing!', 'Wow!'];
  if (!n) return DW.pick(plain);
  return DW.pick([`Great job, ${n}!`, `Wow, ${n}!`, `You did it, ${n}!`, `Excellent, ${n}!`, `Amazing, ${n}!`, `Well done, ${n}!`].concat(plain));
};

DW.PHRASES = {
  hello: 'Welcome to Sviatosaurus!',
  greatJob: 'Great job!',
  excellent: 'Excellent!',
  wow: 'Wow!',
  tryAgain: 'Try again!',
  amazing: 'Amazing!',
  chooseColor: 'Choose a color!',
  dragBone: 'Drag the bone here.',
  buildSkeleton: "Let's build the skeleton!",
  foundFossil: 'You found a fossil!',
  digHere: 'Dig here!',
  feed: 'Feed the dinosaur!',
  yummy: 'Yummy!',
  lookBig: 'Wow! Look how big it is!',
  missionDone: 'Mission complete!',
  star: 'You got a star!'
};
