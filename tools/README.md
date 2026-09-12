# SVIATOSAURUS — інструменти

* `gen_voice.py` — озвучує всі репліки гри (Fish Audio, голос Emma, безкоштовна модель). Інкрементний: нові рядки додаються в списки в самому файлі, повторний запуск догенеровує лише те, чого ще нема. Пише `audio/voice/*.mp3` і `audio/voice-manifest.js`.
* `cutout.py` — вирізає білий фон із AI-рендера (Canva/OpenAI) → `assets/img/<id>.png` і перебудовує `assets/img-manifest.js`. Гра сама показує PNG замість SVG, якщо для `id` (або `baby_<id>`) є картинка.
* `gen_images.py` — промпти всіх 12 видів + 3 малюків для gpt-image-2 (потрібен дійсний ключ OpenAI у `D:\Claude\AUTHOR-API-Iryna.md`).
* Canva: `generate-design` типу `logo` з тим самим промптом, що в `gen_images.py`, → `create-design-from-candidate` → `export-design png 1600×1600` → `cutout.py`. Сирі експорти лежать у `tools/_canva/`.

## Як додати ще одного динозавра в 3D

1. `generate-design` у Canva (`design_type: logo`) з промптом виду — тексти всіх 12 видів лежать у `gen_images.py`.
2. `python tools/pick.py <4 url прев'ю>` → відкрити `http://localhost:8765/_pick.html` і подивитись, який кандидат справді персонаж, а не логотип із написом.
3. `create-design-from-candidate` → `export-design png 1600×1600` → `python tools/fetch.py <id> "<url>"`.
4. Подивитись на картинку, вписати ріг у `assets/rigs.json` (`neck`/`hip`/`legL`/`legR` для фронтального, `head`/`tail` для бокового), перевірити `python tools/rigdebug.py` і позами в грі.
5. `python tools/build_artifact.py` і опублікувати `dist/index.html` знову, інакше на телефоні лишиться стара версія.
