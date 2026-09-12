/* SVIATOSAURUS — persistent game state (localStorage, no backend) */
window.DW = window.DW || {};

DW.state = (function () {
  const KEY = 'dinoworld.v1';
  const def = () => ({
    found: {},          // dino id -> true (seen / tapped)
    fossils: {},        // dino id -> true (dug up)
    skeletons: {},      // dino id -> true (built)
    eggs: {},           // dino id -> true (hatched)
    badges: {},         // badge id -> true
    missions: {},       // mission id -> true (completed)
    stars: 0,
    counters: { fed: 0, petted: 0, puzzles: 0, drawings: 0, digs: 0, skeletons: 0, matches: 0, care: 0 },
    drawings: [],       // data URLs (small)
    fantasy: [],        // { name, parts }
    sound: true,
    voice: true,
    childName: 'Svyatko',      // how the game addresses the child out loud
    childShort: 'Svyat',
    visited: {}
  });
  let s = def();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      s = Object.assign(def(), parsed);
      s.counters = Object.assign(def().counters, parsed.counters || {});
    }
  } catch (e) { /* private mode etc. */ }

  function save() { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { } }

  function mark(bucket, id) {
    if (!s[bucket][id]) { s[bucket][id] = true; save(); DW.missions && DW.missions.check(); return true; }
    return false;
  }
  function inc(counter, n) { s.counters[counter] = (s.counters[counter] || 0) + (n || 1); save(); DW.missions && DW.missions.check(); }
  function addStars(n) { s.stars += n; save(); DW.hud && DW.hud.refresh(); }

  return { get: () => s, save, mark, inc, addStars, reset() { s = def(); save(); } };
})();
