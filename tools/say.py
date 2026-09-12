"""Render one line with the game's voice, to any file.
python tools/say.py out.mp3 "Hello, Sviatko!"
Handy for trying spellings of a name before baking it into the game."""
import sys, os, re, json, urllib.request

KEY = re.search(r'sk-fish-[A-Za-z0-9_-]+', open(r'D:\Claude\AUTHOR-API-Iryna.md', encoding='utf-8').read()).group(0)
VOICE = 'ed27a7f83d7a48d69266d26ef81e2807'      # Antischool — Emma (EN, child girl)
MODEL = os.environ.get('FISH_MODEL', 's2.1-pro-free')

out, text = sys.argv[1], sys.argv[2]
os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
body = json.dumps({'text': text, 'reference_id': VOICE, 'format': 'mp3', 'mp3_bitrate': 128}).encode()
req = urllib.request.Request('https://api.fish.audio/v1/tts', data=body,
                             headers={'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json', 'model': MODEL})
with urllib.request.urlopen(req, timeout=120) as r:
    data = r.read()
open(out, 'wb').write(data)
print('%-46s %s  %d KB' % (text, out, len(data) // 1024))
