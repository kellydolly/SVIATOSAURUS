# SVIATOSAURUS 🦖

A dinosaur world made for Sviatko. It runs in a browser, installs on a phone as an app,
and works with no signal.

**Play:** https://kellydolly.github.io/SVIATOSAURUS/

## What is inside

Six locations on a world map, twelve real dinosaur species with facts that are kept honest
(where science is unsure, the game says so), a fossil dig, a skeleton builder, jigsaw puzzles,
drawing, eggs that hatch, a baby to look after, matching games, a size comparison, a fantasy
dinosaur builder, a collection and missions. Everything the game says is spoken in English by a
child voice, and it calls Sviatko by name.

## Run it locally

    python -m http.server 8765 -d .

Then open http://localhost:8765/ — that is the development version, which uses one small mp3 per
phrase from `audio/voice/`. Those files are not in the repository; regenerate them with
`python tools/gen_voice.py` (needs the Fish Audio key).

## Build the installable version

    python tools/build_sprite.py      # glue the voice clips into three mp3 sprites
    python tools/build_artifact.py    # write docs/ : page, manifest, icons, service worker

GitHub Pages serves `docs/` on the main branch, so a push publishes the game. The service worker
version is a hash of the files, so phones pick up a new build by themselves on the next launch.

## Layout

    data/         dinosaur facts
    assets/       sprites, their 2D rigs, drawn art, props, scenes, icons
    audio/        sound effects, the voice module and its manifest
    components/   app shell, screens, state, missions
    games/        the mini games
    styles/       css, including the rig animations
    tools/        content pipeline (voice, images, rigs, build)
    docs/         the built site that GitHub Pages serves
