"""Generate 3D-cartoon dinosaur renders (transparent PNG) with gpt-image-2.
Usage: python tools/gen_images.py trex triceratops ...   (or 'all', 'babies')
The API key is read from D:\\Claude\\AUTHOR-API-Iryna.md (never stored in this repo)."""
import sys, re, json, base64, os, time, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'img')
os.makedirs(OUT, exist_ok=True)
KEY = re.search(r'sk-proj-[A-Za-z0-9_-]+', open(r'D:\Claude\AUTHOR-API-Iryna.md', encoding='utf-8').read()).group(0)

STYLE = ("STYLE CONTRACT — the whole image obeys it (style «kids 3D cartoon»): a single cute cartoon dinosaur character rendered "
         "like a modern 3D animated movie for young children (Pixar / DreamWorks look): smooth glossy skin with soft subsurface shading, "
         "big round expressive eyes with highlights, friendly wide smile, chubby rounded proportions, soft studio lighting, "
         "high-quality render, clean edges. Full body visible, standing on an invisible floor, three-quarter front view facing slightly to the viewer's left. "
         "Isolated on a fully TRANSPARENT background — no floor, no shadow, no scenery, nothing behind the character.")
RULES = ("RULES: exactly one character, centered, whole body inside the frame with margin; no captions, watermarks, logos, borders, "
         "collages or UI frames; no text, letters or numbers; no scary or aggressive expression; keep the species' real anatomy recognizable.")

DINOS = {
    'trex': "Tyrannosaurus rex: green skin with lighter cream belly, huge head, short chubby body, tiny two-fingered arms, thick strong legs with three toes, long thick tail, small teeth showing in a happy open smile.",
    'triceratops': "Triceratops: warm orange-brown skin with cream belly, big bony neck frill, three horns (two long over the eyes, one short on the nose), parrot-like beak, four sturdy legs, short tail.",
    'velociraptor': "Velociraptor: small slim dinosaur, reddish-brown skin with cream belly, feathers on the arms and a feather fan on the tail, long snout, one big curved claw on each foot, bird-like posture.",
    'stegosaurus': "Stegosaurus: olive-green skin with cream belly, two rows of big orange kite-shaped plates along the arched back, four spikes on the tail, tiny head held low, four legs.",
    'brachiosaurus': "Brachiosaurus: grey-green skin with cream belly, very long neck held high, small head with a bump on top, front legs longer than back legs, long tapering tail.",
    'spinosaurus': "Spinosaurus: blue-grey skin with cream belly, tall orange sail on its back, long narrow crocodile-like snout, paddle-shaped tail, standing on two legs with medium arms.",
    'ankylosaurus': "Ankylosaurus: brown armored dinosaur, wide low body covered with bony plates and small spikes, big round club at the end of the tail, small head with a beak, four short legs.",
    'parasaurolophus': "Parasaurolophus: yellow-green skin with dark stripes and cream belly, long curved hollow crest sweeping back from the head, duck-bill mouth, standing on two legs with small arms.",
    'diplodocus': "Diplodocus: blue-grey skin with cream belly, extremely long neck held fairly level, tiny head, very long whip-like tail, four column legs, low long body.",
    'allosaurus': "Allosaurus: sandy-brown skin with dark stripes and cream belly, two small red crests above the eyes, three-fingered hands with claws, strong legs, long tail, standing on two legs.",
    'carnotaurus': "Carnotaurus: rust-red bumpy skin with cream belly, two short horns above the eyes like a bull, very short deep head, extremely tiny arms, strong legs, standing on two legs.",
    'iguanodon': "Iguanodon: sage-green skin with cream belly, boxy head with a beak, sharp thumb spikes on the hands, standing on two legs with strong arms, thick tail."
}
BABY = " This is a BABY version: hatchling proportions — extra big head and eyes, tiny body, stubby legs, curious happy expression."

def gen(name, prompt, size='1024x1024', quality='medium'):
    body = json.dumps({'model': 'gpt-image-2', 'prompt': prompt, 'size': size, 'quality': quality, 'background': 'transparent', 'output_format': 'png', 'n': 1}).encode()
    req = urllib.request.Request('https://api.openai.com/v1/images/generations', data=body, headers={'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json'})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                data = json.load(r)
            break
        except urllib.error.HTTPError as e:
            print('HTTP', e.code, e.read()[:400]); time.sleep(3)
            if attempt == 2: raise
    img = base64.b64decode(data['data'][0]['b64_json'])
    path = os.path.join(OUT, name + '.png')
    open(path, 'wb').write(img)
    print('saved', path, len(img) // 1024, 'KB', data.get('usage'))

if __name__ == '__main__':
    args = sys.argv[1:] or ['trex']
    if args == ['all']: args = list(DINOS)
    if args == ['babies']: args = ['baby_trex', 'baby_triceratops', 'baby_velociraptor']
    for a in args:
        baby = a.startswith('baby_')
        d = a[5:] if baby else a
        prompt = f"{STYLE}\nCHARACTER — keep the species accurate: {DINOS[d]}{BABY if baby else ''}\n{RULES}"
        gen(a, prompt)
