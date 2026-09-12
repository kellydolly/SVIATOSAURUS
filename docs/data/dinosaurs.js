/* SVIATOSAURUS — real dinosaur data.
   All facts are based on published paleontological sources.
   Where science is uncertain, the text says so. */
window.DW = window.DW || {};

DW.DINOS = [
  {
    id: 'trex', name: 'Tyrannosaurus rex', short: 'T. rex', say: 'Tyrannosaurus rex',
    emoji: '🦖', template: 'theropod', variant: 'trex',
    period: 'Late Cretaceous', years: '68–66 million years ago',
    diet: 'Carnivore', dietIcon: '🥩', food: 'meat',
    lengthM: 12, heightM: 4, weight: 'about 8 tons',
    habitat: 'Forests and river plains of western North America',
    habitatShort: 'North America',
    location: 'volcano',
    facts: [
      'T. rex had about 60 teeth. Some were as long as a banana!',
      'Its arms were tiny, but very strong.',
      'T. rex had a great sense of smell.',
      'The biggest T. rex skeleton is called Sue. It lives in a museum in Chicago.',
      'T. rex could bite harder than any land animal alive today.'
    ],
    soundNote: "Scientists don't know exactly what T. rex sounded like! Some think it made deep rumbling sounds.",
    sound: 'roar',
    palette: { main: '#6a9a3f', light: '#8cbb58', dark: '#3f6427', belly: '#d7e3a6', accent: '#2f4a1c' }
  },
  {
    id: 'triceratops', name: 'Triceratops', short: 'Triceratops', say: 'Triceratops',
    emoji: '🦕', template: 'ceratopsian', variant: 'triceratops',
    period: 'Late Cretaceous', years: '68–66 million years ago',
    diet: 'Herbivore', dietIcon: '🌿', food: 'plants',
    lengthM: 9, heightM: 3, weight: 'about 6–12 tons',
    habitat: 'Plains and forests of western North America',
    habitatShort: 'North America',
    location: 'lagoon',
    facts: [
      'Triceratops means "three-horned face".',
      'Its two long horns could grow about 1 meter long.',
      'It had a big bony frill on its neck.',
      'Triceratops had a beak like a parrot to cut plants.',
      'It lived at the same time and place as T. rex.'
    ],
    soundNote: "Scientists don't know exactly what Triceratops sounded like!",
    sound: 'grunt',
    palette: { main: '#b5762f', light: '#d59a4a', dark: '#7a4d1b', belly: '#eed7a6', accent: '#5a3812' }
  },
  {
    id: 'velociraptor', name: 'Velociraptor', short: 'Velociraptor', say: 'Velociraptor',
    emoji: '🦖', template: 'theropod', variant: 'raptor',
    period: 'Late Cretaceous', years: '75–71 million years ago',
    diet: 'Carnivore', dietIcon: '🥩', food: 'meat',
    lengthM: 2, heightM: 0.5, weight: 'about 15 kilograms',
    habitat: 'Deserts of Mongolia and China',
    habitatShort: 'Asia (Gobi Desert)',
    location: 'jungle',
    facts: [
      'Velociraptor was small, about the size of a big turkey.',
      'It had feathers!',
      'It had a big curved claw on each foot.',
      'A famous fossil shows a Velociraptor fighting a Protoceratops.',
      'Velociraptor means "fast thief".'
    ],
    soundNote: "Scientists don't know exactly what Velociraptor sounded like!",
    sound: 'screech',
    palette: { main: '#b8643a', light: '#d9865a', dark: '#7a3d1f', belly: '#f1d9b8', accent: '#4f2610' }
  },
  {
    id: 'stegosaurus', name: 'Stegosaurus', short: 'Stegosaurus', say: 'Stegosaurus',
    emoji: '🦕', template: 'stegosaur', variant: 'stegosaurus',
    period: 'Late Jurassic', years: '155–145 million years ago',
    diet: 'Herbivore', dietIcon: '🌿', food: 'plants',
    lengthM: 9, heightM: 4, weight: 'about 5 tons',
    habitat: 'Forests and plains of western North America and Portugal',
    habitatShort: 'North America, Europe',
    location: 'jungle',
    facts: [
      'Stegosaurus had big bony plates on its back.',
      'Its tail had four long spikes.',
      'It had a very small brain for such a big body.',
      'Scientists are not sure what the plates were for. Maybe to show off or to keep warm!',
      'Stegosaurus ate low plants like ferns.'
    ],
    soundNote: "Scientists don't know exactly what Stegosaurus sounded like!",
    sound: 'grunt',
    palette: { main: '#7a9a3c', light: '#9bbb58', dark: '#4c6323', belly: '#dbe4a8', accent: '#d9632a' }
  },
  {
    id: 'brachiosaurus', name: 'Brachiosaurus', short: 'Brachiosaurus', say: 'Brachiosaurus',
    emoji: '🦕', template: 'sauropod', variant: 'brachiosaurus',
    period: 'Late Jurassic', years: '154–150 million years ago',
    diet: 'Herbivore', dietIcon: '🌿', food: 'leaves',
    lengthM: 22, heightM: 12, weight: 'about 30–60 tons',
    habitat: 'Forests and plains of western North America',
    habitatShort: 'North America',
    location: 'jungle',
    facts: [
      'Brachiosaurus was as tall as a four-story building!',
      'Its front legs were longer than its back legs.',
      'It ate leaves from the tops of tall trees, like a giraffe.',
      'Its nostrils were on top of its head.',
      'It had to eat hundreds of kilograms of plants every day.'
    ],
    soundNote: "Scientists don't know exactly what Brachiosaurus sounded like!",
    sound: 'low',
    palette: { main: '#6e8f8a', light: '#8fb0aa', dark: '#3f5f5b', belly: '#cfe0d6', accent: '#2f4744' }
  },
  {
    id: 'spinosaurus', name: 'Spinosaurus', short: 'Spinosaurus', say: 'Spinosaurus',
    emoji: '🦖', template: 'theropod', variant: 'spino',
    period: 'Cretaceous', years: '99–93 million years ago',
    diet: 'Carnivore', dietIcon: '🐟', food: 'fish',
    lengthM: 14, heightM: 5, weight: 'about 7 tons (scientists are not sure)',
    habitat: 'Rivers and swamps of North Africa',
    habitatShort: 'North Africa',
    location: 'lagoon',
    facts: [
      'Spinosaurus had a huge sail on its back, almost 2 meters tall.',
      'It had a long snout like a crocodile and loved to eat fish.',
      'It probably spent a lot of time in the water.',
      'Its tail was shaped like a paddle.',
      'The first Spinosaurus fossils were lost in 1944. New ones were found later.'
    ],
    soundNote: "Scientists don't know exactly what Spinosaurus sounded like!",
    sound: 'roar',
    palette: { main: '#5f7f8f', light: '#7fa0ae', dark: '#34505e', belly: '#d2dfe2', accent: '#d8703a' }
  },
  {
    id: 'ankylosaurus', name: 'Ankylosaurus', short: 'Ankylosaurus', say: 'Ankylosaurus',
    emoji: '🦕', template: 'ankylosaur', variant: 'ankylosaurus',
    period: 'Late Cretaceous', years: '68–66 million years ago',
    diet: 'Herbivore', dietIcon: '🌿', food: 'plants',
    lengthM: 7, heightM: 1.7, weight: 'about 5–8 tons',
    habitat: 'Forests of western North America',
    habitatShort: 'North America',
    location: 'volcano',
    facts: [
      'Ankylosaurus was covered in bony armor, like a tank.',
      'It had a big heavy club at the end of its tail.',
      'Even its eyelids had armor!',
      'It was very wide and walked low to the ground.',
      'It used a beak to nip plants.'
    ],
    soundNote: "Scientists don't know exactly what Ankylosaurus sounded like!",
    sound: 'grunt',
    palette: { main: '#8a7a55', light: '#a8976b', dark: '#574a2e', belly: '#d9cfae', accent: '#3e341f' }
  },
  {
    id: 'parasaurolophus', name: 'Parasaurolophus', short: 'Parasaurolophus', say: 'Parasaurolophus',
    emoji: '🦕', template: 'ornithopod', variant: 'parasaurolophus',
    period: 'Late Cretaceous', years: '76–73 million years ago',
    diet: 'Herbivore', dietIcon: '🌿', food: 'plants',
    lengthM: 9.5, heightM: 3, weight: 'about 2.5–5 tons',
    habitat: 'River plains of western North America',
    habitatShort: 'North America',
    location: 'lagoon',
    facts: [
      'Parasaurolophus had a long hollow crest on its head.',
      'The crest was hollow inside, like a trumpet.',
      'It had a mouth shaped like a duck bill.',
      'It could walk on two legs or four legs.',
      'It had hundreds of small teeth to chew tough plants.'
    ],
    soundNote: 'Scientists think its hollow crest could make deep, trumpet-like sounds. But nobody knows the exact sound!',
    sound: 'trumpet',
    palette: { main: '#8fa54a', light: '#b0c463', dark: '#5b6c2a', belly: '#e6e9b3', accent: '#c0552f' }
  },
  {
    id: 'diplodocus', name: 'Diplodocus', short: 'Diplodocus', say: 'Diplodocus',
    emoji: '🦕', template: 'sauropod', variant: 'diplodocus',
    period: 'Late Jurassic', years: '154–152 million years ago',
    diet: 'Herbivore', dietIcon: '🌿', food: 'leaves',
    lengthM: 25, heightM: 5, weight: 'about 12–15 tons',
    habitat: 'Plains of western North America',
    habitatShort: 'North America',
    location: 'jungle',
    facts: [
      'Diplodocus was one of the longest dinosaurs, about 25 meters!',
      'Its tail was very long and thin, like a whip.',
      'It had small peg-shaped teeth to strip leaves.',
      'It held its long neck mostly flat, not straight up.',
      'Even though it was long, it was lighter than Brachiosaurus.'
    ],
    soundNote: "Scientists don't know exactly what Diplodocus sounded like!",
    sound: 'low',
    palette: { main: '#7d8a9e', light: '#9eaabd', dark: '#4c5669', belly: '#d9dee6', accent: '#3a4252' }
  },
  {
    id: 'allosaurus', name: 'Allosaurus', short: 'Allosaurus', say: 'Allosaurus',
    emoji: '🦖', template: 'theropod', variant: 'allo',
    period: 'Late Jurassic', years: '155–145 million years ago',
    diet: 'Carnivore', dietIcon: '🥩', food: 'meat',
    lengthM: 9, heightM: 3.5, weight: 'about 2 tons',
    habitat: 'Plains and forests of western North America and Portugal',
    habitatShort: 'North America, Europe',
    location: 'volcano',
    facts: [
      'Allosaurus had two small horns above its eyes.',
      'It had three fingers with big claws on each hand.',
      'Many Allosaurus bones were found together in one place in Utah.',
      'It lived long before T. rex, in the Jurassic period.',
      'Allosaurus means "different lizard".'
    ],
    soundNote: "Scientists don't know exactly what Allosaurus sounded like!",
    sound: 'roar',
    palette: { main: '#c29b5a', light: '#dcb97a', dark: '#87672f', belly: '#f0e2bf', accent: '#7d2f22' }
  },
  {
    id: 'carnotaurus', name: 'Carnotaurus', short: 'Carnotaurus', say: 'Carnotaurus',
    emoji: '🦖', template: 'theropod', variant: 'carno',
    period: 'Late Cretaceous', years: '72–70 million years ago',
    diet: 'Carnivore', dietIcon: '🥩', food: 'meat',
    lengthM: 8, heightM: 3, weight: 'about 1.5 tons',
    habitat: 'Plains of Patagonia, Argentina',
    habitatShort: 'South America',
    location: 'volcano',
    facts: [
      'Carnotaurus means "meat-eating bull".',
      'It had two horns above its eyes, like a bull.',
      'Its arms were even smaller than T. rex arms!',
      'Scientists found its skin. It was bumpy and scaly.',
      'It had strong legs and could probably run fast.'
    ],
    soundNote: "Scientists don't know exactly what Carnotaurus sounded like!",
    sound: 'roar',
    palette: { main: '#a5543c', light: '#c47358', dark: '#6b3222', belly: '#e9c8b0', accent: '#4a2015' }
  },
  {
    id: 'iguanodon', name: 'Iguanodon', short: 'Iguanodon', say: 'Iguanodon',
    emoji: '🦕', template: 'ornithopod', variant: 'iguanodon',
    period: 'Early Cretaceous', years: '126–122 million years ago',
    diet: 'Herbivore', dietIcon: '🌿', food: 'plants',
    lengthM: 10, heightM: 3, weight: 'about 3–4 tons',
    habitat: 'Forests and rivers of Europe',
    habitatShort: 'Europe',
    location: 'lagoon',
    facts: [
      'Iguanodon had a sharp spike instead of a thumb.',
      'It was one of the very first dinosaurs to get a name, in 1825.',
      'Many Iguanodon skeletons were found in a coal mine in Belgium.',
      'It could walk on two legs or on four legs.',
      'It had a beak and lots of teeth for chewing plants.'
    ],
    soundNote: "Scientists don't know exactly what Iguanodon sounded like!",
    sound: 'grunt',
    palette: { main: '#7f9a5e', light: '#9fb97a', dark: '#4f6538', belly: '#dfe6c0', accent: '#8a5a2b' }
  }
];

DW.dino = function (id) { return DW.DINOS.find(d => d.id === id); };

DW.LOCATIONS = [
  { id: 'volcano', name: 'Volcano Valley', emoji: '🌋', type: 'habitat', color1: '#ff7a3d', color2: '#b8321f', say: 'Volcano Valley!' },
  { id: 'jungle',  name: 'Jurassic Jungle', emoji: '🌴', type: 'habitat', color1: '#5ed36a', color2: '#1f7a3a', say: 'Jurassic Jungle!' },
  { id: 'lagoon',  name: 'Dino Lagoon', emoji: '🌊', type: 'habitat', color1: '#5fc9f2', color2: '#1f6fb0', say: 'Dino Lagoon!' },
  { id: 'desert',  name: 'Fossil Desert', emoji: '🏜️', type: 'hub', color1: '#f6c46a', color2: '#c7802a', say: 'Fossil Desert!' },
  { id: 'museum',  name: 'Fossil Museum', emoji: '🦴', type: 'hub', color1: '#d9c6ff', color2: '#7a5bc4', say: 'Fossil Museum!' },
  { id: 'camp',    name: 'Dino Camp', emoji: '🏕️', type: 'hub', color1: '#ffd36a', color2: '#e0782a', say: 'Dino Camp!' }
];

/* Which dinosaurs live in which habitat scene */
DW.HABITATS = {
  volcano: ['trex', 'carnotaurus', 'allosaurus', 'ankylosaurus'],
  jungle:  ['brachiosaurus', 'stegosaurus', 'velociraptor', 'diplodocus'],
  lagoon:  ['spinosaurus', 'parasaurolophus', 'triceratops', 'iguanodon']
};

/* Eggs that can be hatched */
DW.EGGS = [
  { id: 'trex', color1: '#fff3c4', color2: '#d9b25a', spots: '#b58a2c' },
  { id: 'triceratops', color1: '#e8f4ff', color2: '#8fb9d9', spots: '#4f7fa8' },
  { id: 'velociraptor', color1: '#ffe9e0', color2: '#e0937a', spots: '#a8563e' }
];

/* Fossils that can be dug up / built */
DW.FOSSILS = ['trex', 'triceratops', 'stegosaurus'];
