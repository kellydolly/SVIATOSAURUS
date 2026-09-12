"""Pre-generate every English voice line of DINO WORLD with Fish Audio (child voice «Emma», model s2.1-pro-free = $0).
Writes audio/voice/<hash>.mp3 and audio/voice-manifest.js (text -> file). Re-run is incremental (skips existing files).
The API key is read from D:\\Claude\\AUTHOR-API-Iryna.md and never stored in this repo."""
import re, os, json, hashlib, time, urllib.request, concurrent.futures as cf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'audio', 'voice'); os.makedirs(OUT, exist_ok=True)
KEY = re.search(r'sk-fish-[A-Za-z0-9_-]+', open(r'D:\Claude\AUTHOR-API-Iryna.md', encoding='utf-8').read()).group(0)
VOICE = 'ed27a7f83d7a48d69266d26ef81e2807'   # Antischool — Emma (EN, child girl), school's own designed voice
MODEL = os.environ.get('FISH_MODEL', 's2.1-pro-free')

DINOS = [
 ('trex','Tyrannosaurus rex','T. rex','carnivore','meat','volcano',12,'theropod'),
 ('triceratops','Triceratops','Triceratops','herbivore','plants','lagoon',9,'ceratopsian'),
 ('velociraptor','Velociraptor','Velociraptor','carnivore','meat','jungle',2,'theropod'),
 ('stegosaurus','Stegosaurus','Stegosaurus','herbivore','plants','jungle',9,'stegosaur'),
 ('brachiosaurus','Brachiosaurus','Brachiosaurus','herbivore','leaves','jungle',22,'sauropod'),
 ('spinosaurus','Spinosaurus','Spinosaurus','carnivore','fish','lagoon',14,'theropod'),
 ('ankylosaurus','Ankylosaurus','Ankylosaurus','herbivore','plants','volcano',7,'ankylosaur'),
 ('parasaurolophus','Parasaurolophus','Parasaurolophus','herbivore','plants','lagoon',9.5,'ornithopod'),
 ('diplodocus','Diplodocus','Diplodocus','herbivore','leaves','jungle',25,'sauropod'),
 ('allosaurus','Allosaurus','Allosaurus','carnivore','meat','volcano',9,'theropod'),
 ('carnotaurus','Carnotaurus','Carnotaurus','carnivore','meat','volcano',8,'theropod'),
 ('iguanodon','Iguanodon','Iguanodon','herbivore','plants','lagoon',10,'ornithopod'),
]
FACTS = {
 'trex':["T. rex had about 60 teeth. Some were as long as a banana!","Its arms were tiny, but very strong.","T. rex had a great sense of smell.","The biggest T. rex skeleton is called Sue. It lives in a museum in Chicago.","T. rex could bite harder than any land animal alive today.","Scientists don't know exactly what T. rex sounded like! Some think it made deep rumbling sounds."],
 'triceratops':["Triceratops means \"three-horned face\".","Its two long horns could grow about 1 meter long.","It had a big bony frill on its neck.","Triceratops had a beak like a parrot to cut plants.","It lived at the same time and place as T. rex.","Scientists don't know exactly what Triceratops sounded like!"],
 'velociraptor':["Velociraptor was small, about the size of a big turkey.","It had feathers!","It had a big curved claw on each foot.","A famous fossil shows a Velociraptor fighting a Protoceratops.","Velociraptor means \"fast thief\".","Scientists don't know exactly what Velociraptor sounded like!"],
 'stegosaurus':["Stegosaurus had big bony plates on its back.","Its tail had four long spikes.","It had a very small brain for such a big body.","Scientists are not sure what the plates were for. Maybe to show off or to keep warm!","Stegosaurus ate low plants like ferns.","Scientists don't know exactly what Stegosaurus sounded like!"],
 'brachiosaurus':["Brachiosaurus was as tall as a four-story building!","Its front legs were longer than its back legs.","It ate leaves from the tops of tall trees, like a giraffe.","Its nostrils were on top of its head.","It had to eat hundreds of kilograms of plants every day.","Scientists don't know exactly what Brachiosaurus sounded like!"],
 'spinosaurus':["Spinosaurus had a huge sail on its back, almost 2 meters tall.","It had a long snout like a crocodile and loved to eat fish.","It probably spent a lot of time in the water.","Its tail was shaped like a paddle.","The first Spinosaurus fossils were lost in 1944. New ones were found later.","Scientists don't know exactly what Spinosaurus sounded like!"],
 'ankylosaurus':["Ankylosaurus was covered in bony armor, like a tank.","It had a big heavy club at the end of its tail.","Even its eyelids had armor!","It was very wide and walked low to the ground.","It used a beak to nip plants.","Scientists don't know exactly what Ankylosaurus sounded like!"],
 'parasaurolophus':["Parasaurolophus had a long hollow crest on its head.","The crest was hollow inside, like a trumpet.","It had a mouth shaped like a duck bill.","It could walk on two legs or four legs.","It had hundreds of small teeth to chew tough plants.","Scientists think its hollow crest could make deep, trumpet-like sounds. But nobody knows the exact sound!"],
 'diplodocus':["Diplodocus was one of the longest dinosaurs, about 25 meters!","Its tail was very long and thin, like a whip.","It had small peg-shaped teeth to strip leaves.","It held its long neck mostly flat, not straight up.","Even though it was long, it was lighter than Brachiosaurus.","Scientists don't know exactly what Diplodocus sounded like!"],
 'allosaurus':["Allosaurus had two small horns above its eyes.","It had three fingers with big claws on each hand.","Many Allosaurus bones were found together in one place in Utah.","It lived long before T. rex, in the Jurassic period.","Allosaurus means \"different lizard\".","Scientists don't know exactly what Allosaurus sounded like!"],
 'carnotaurus':["Carnotaurus means \"meat-eating bull\".","It had two horns above its eyes, like a bull.","Its arms were even smaller than T. rex arms!","Scientists found its skin. It was bumpy and scaly.","It had strong legs and could probably run fast.","Scientists don't know exactly what Carnotaurus sounded like!"],
 'iguanodon':["Iguanodon had a sharp spike instead of a thumb.","It was one of the very first dinosaurs to get a name, in 1825.","Many Iguanodon skeletons were found in a coal mine in Belgium.","It could walk on two legs or on four legs.","It had a beak and lots of teeth for chewing plants.","Scientists don't know exactly what Iguanodon sounded like!"],
}
LOCS = {'volcano':'Volcano Valley','jungle':'Jurassic Jungle','lagoon':'Dino Lagoon','desert':'Fossil Desert','museum':'Fossil Museum','camp':'Dino Camp'}
MISSIONS = ['Find three dinosaurs!','Dig up a fossil!','Build a skeleton!','Feed a dinosaur!','Complete a puzzle!','Hatch an egg!','Draw a dinosaur!','Take care of a baby dinosaur!','Find six dinosaurs!','Find all the dinosaurs!']
LABELS = ['skull','spine','ribs','arms','legs','tail']
CREATOR = {'body':['Round','Long','Tall'],'head':['Round','Long','Horns'],'eyes':['Big','Sleepy','Star'],'mouth':['Smile','Teeth','Beak'],'tail':['Long','Spiky','Club'],'color':['Green','Blue','Red','Orange','Purple','Yellow','Pink','Grey'],'pattern':['Plain','Spots','Stripes']}
KID = ['Svyatko', 'Svyat']          # how the game calls the child out loud (chosen by ear with Iryna)
KID_FULL = 'Sviatoslav'
NAMES = ['Rexy','Spike','Bubbles','Zigzag','Roary','Dotty','Stompy','Sunny']

SPLIT = re.compile(r"(?<!\bT)(?<=[.!?])\s+")
def sentences(t): return [x.strip() for x in SPLIT.split(t.strip()) if x.strip()]

lines = set()
def add(*ts):
    for t in ts:
        for s in sentences(t): lines.add(s)

add("Welcome to Sviatosaurus!","Hello, explorer!","Great job!","Excellent!","Wow!","Try again!","Amazing!","Choose a color!","Drag the bone here.","Let's build the skeleton!","You found a fossil!","Dig here!","Feed the dinosaur!","Yummy!","Wow! Look how big it is!","Mission complete!","You got a star!",
    "Let's play ball!","You found an egg! Let's hatch it!","All clean! Draw again!","Choose a fossil to dig!","Draw anything you like!","Draw something first!","Glug glug! Thank you!","Good morning!","Hatch an egg first!","Here is some water!","It is cracking!","Make your own fantasy dinosaur! Pick the parts.","Pick a dinosaur for your puzzle!","Pick a dinosaur to color!","Shh. The baby is sleeping. Good night!","Stomp! Stomp!","Surprise!","Tap a dinosaur!","Tap the egg!","That was fun!","Wow! You made your dinosaur!",
    "So soft!","The baby loves you!","Happy baby!","Yes!","Good!","Drag the bones.","Here is some meat!","Here is a fish!","Here is a leaf!","Look at the big sail!","Look at the plates!","Eraser!","Brush!","Your collection is empty. Go find dinosaurs!","Feed the dinosaurs! Drag the food to the right dinosaur.","Find the baby for each dinosaur!","No.","You did all the missions! Amazing!","Draw a dinosaur!","Tap an egg to hatch it!","Brush the sand!","Break the rocks!","Look for bones!","Let's dig for fossils!","Welcome to the museum!","Welcome to Dino Camp!","Use the pick for rocks!","A bone is here! Dig here!","Nothing here. Look somewhere else!","Mission complete! Great job! You got a star!","Let's take care of the baby!","Puzzle complete!","All matched!","Draw more!","My dinosaur is ready!","Its name is ready!","Hello!","Glug glug!","Thank you!",
    "Pick a body!","Choose a body!","Choose a head!","Choose the eyes!","Choose a mouth!","Choose a tail!","Choose a pattern!","How about this one?","Let's go!","Tap the dinosaur!","Can you find the bone?","Give him a leaf!","Find the bone!","Find the T. rex!","Drag the meat to the baby!","Drag the leaf to the baby!","Drag the fish to the baby!","Drag the water to the baby!","Stroke the baby!","Pet the dinosaur!","Give the baby some water!","Drop it on the dinosaur!","Drag it to the dinosaur!","Oops!","Not that one!","Stroke it gently!","Tap the bone!","Drag the food!","Pick a tool!")
for m in MISSIONS: add(m, "Your mission: " + m)
for k, v in LOCS.items(): add(v + "!", "Find it in " + v + "!")
for l in LABELS: add(f"This is the {l}.", f"You found the {l}!", f"Yes! That is the {l}!", f"Can you find the {l}?")
for k, vs in CREATOR.items():
    for v in vs: add(f"{v} {('color' if k=='color' else k)}!")
for n in NAMES: add(f"How about {n}?", f"Its name is {n}!", f"{n} says hello!", f"{n} is ready!")
for n in KID:
    add(f"Hello, {n}!", f"{n}!", f"Great job, {n}!", f"Wow, {n}!", f"You did it, {n}!", f"Excellent, {n}!",
        f"Amazing, {n}!", f"Look, {n}!", f"Your turn, {n}!", f"Try again, {n}!", f"Well done, {n}!",
        f"Good morning, {n}!", f"Welcome back, {n}!", f"{n}, you are a real explorer!")
add(f"{KID_FULL}!", f"Scientists named this dinosaur after you, {KID_FULL}!", f"You found a new dinosaur, {KID_FULL}!")
for n in range(1, 13): add(f"You found {n} dinosaurs!" if n != 1 else "You found 1 dinosaurs!")
for did, name, short, diet, food, loc, L, tpl in DINOS:
    add(name, name + ".", f"This is a {name}.", f"{short} was a {diet}.", f"Can you find the {name}?", f"You found the {name}!", f"That is a {name}.",
        f"{short} wags its tail!", f"{short} likes that!", f"{short} is happy!", f"A baby {name}!", "Hello, little one!", f"You built a {name} skeleton!",
        f"Color the {name}!", f"Hello, baby {name}!", f"Let's find the {name} fossil!", "Brush the sand.", f"Let's make a {name} puzzle!", "Drag the pieces.",
        "Look!", f"The {name} is alive!", f"This is your baby {name}.", "Take care of it!", "Who is this?", f"Look how BIG the {name} was!",
        f"The {name} was small, like a big bird!", f"The {name} was as long as a bus!", "What does it eat?", f"This is a grown-up {name}.",
        f"Yes! {short} eats {food}.", f"Baby {name}!", f"Tap the {name} egg to hatch it!", f"A baby {short} hatched!", f"You found a {name} fossil!", f"You found a {short} fossil!", f"New dinosaur: {short}!", f"You built a {short} skeleton!", f"Puzzle complete! {short}!", f"Amazing! You built a {name} skeleton!", f"Excellent! You made the {name}!", f"Excellent! You found the {name}!", f"That is a {name}. Try again!")
    if tpl == 'sauropod': add(f"{short} reaches for the leaves!")
    fw = 'meat' if food == 'meat' else 'fish' if food == 'fish' else 'leaf'
    add(f"Drag the {fw} to the {name}!", f"Drag it to the {name}!", f"Give the {fw} to the {name}!", f"No! {short} eats {food}.", f"{short} eats {food}.")
    for f2 in ['meat', 'plants', 'leaves', 'fish']:
        if f2 != food: add(f"{short} does not eat {f2}.")
    for f in FACTS[did]: add(f)

lines = sorted(lines)
print('lines:', len(lines), 'bytes:', sum(len(l.encode()) for l in lines))

def fname(t): return hashlib.md5(t.encode('utf-8')).hexdigest()[:10]

def tts(text):
    path = os.path.join(OUT, fname(text) + '.mp3')
    if os.path.exists(path) and os.path.getsize(path) > 1000: return 'skip'
    body = json.dumps({'text': text, 'reference_id': VOICE, 'format': 'mp3', 'mp3_bitrate': 128}).encode()
    for attempt in range(4):
        try:
            req = urllib.request.Request('https://api.fish.audio/v1/tts', data=body, headers={'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json', 'model': MODEL})
            with urllib.request.urlopen(req, timeout=120) as r:
                data = r.read()
            if len(data) < 1000: raise RuntimeError('tiny response ' + data[:100].decode(errors='ignore'))
            open(path, 'wb').write(data); return 'ok'
        except Exception as e:
            print('retry', attempt, text[:40], e); time.sleep(2 + attempt * 2)
    return 'fail'

if __name__ == '__main__':
    import sys
    if '--dry' in sys.argv:
        for l in lines: print(l)
        sys.exit()
    results = {}
    with cf.ThreadPoolExecutor(max_workers=4) as ex:
        for text, res in zip(lines, ex.map(tts, lines)):
            results[res] = results.get(res, 0) + 1
    print(results)
    manifest = {t: fname(t) for t in lines if os.path.exists(os.path.join(OUT, fname(t) + '.mp3'))}
    with open(os.path.join(ROOT, 'audio', 'voice-manifest.js'), 'w', encoding='utf-8') as f:
        f.write('/* generated by tools/gen_voice.py — text -> mp3 file in audio/voice/ */\nwindow.DW = window.DW || {};\nDW.VOICE_MANIFEST = ' + json.dumps(manifest, ensure_ascii=False, indent=0) + ';\n')
    print('manifest entries:', len(manifest))
