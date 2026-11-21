export const mockSpecies = [
  {
    id: 'hagonoy',
    commonName: 'Hagonoy',
    alias: null,
    scientificName: 'Chromolaena odorata',
    family: 'Asteraceae',
    status: 'Invasive',
    detections: 284,
    provinces: ['Ilocos Norte', 'Ilocos Sur', 'La Union', 'Pangasinan'],
    origin: 'Tropical Central & South America',
    habitat: 'Grasslands, roadsides, disturbed open areas',
    description:
      'A fast-spreading perennial shrub that forms dense thickets, suppresses native regeneration, and increases wildfire fuel loads.',
    color: '#c92a1d',
  },
  {
    id: 'lantana',
    commonName: 'Lantana',
    alias: null,
    scientificName: 'Lantana camara',
    family: 'Verbenaceae',
    status: 'Invasive',
    detections: 231,
    provinces: ['Ilocos Norte', 'Ilocos Sur', 'La Union', 'Pangasinan'],
    origin: 'Tropical Americas',
    habitat: 'Pastures, forest edges, coastal scrublands',
    description:
      'A multi-stemmed shrub with allelopathic properties that displaces native vegetation and is toxic to grazing livestock.',
    color: '#b85c08',
  },
  {
    id: 'leucaena',
    commonName: 'Ipil-ipil',
    alias: 'Leucaena',
    scientificName: 'Leucaena leucocephala',
    family: 'Fabaceae',
    status: 'Invasive',
    detections: 170,
    provinces: ['Ilocos Norte', 'Ilocos Sur', 'La Union', 'Pangasinan'],
    origin: 'Southern Mexico & Central America',
    habitat: 'Open woodlands, riverbanks, cultivated margins',
    description:
      'A nitrogen-fixing tree planted for reforestation that spreads aggressively and forms monospecific thickets in disturbed habitats.',
    color: '#b85c08',
  },
  {
    id: 'narra',
    commonName: 'Narra',
    alias: null,
    scientificName: 'Pterocarpus indicus',
    family: 'Fabaceae',
    status: 'Native',
    detections: 92,
    provinces: ['Ilocos Norte', 'Ilocos Sur', 'La Union', 'Pangasinan'],
    origin: 'Southeast Asia',
    habitat: 'Lowland forests, riparian corridors, urban greenbelts',
    description:
      'The national tree of the Philippines. Retained as a native reference class to reduce false-positive detections.',
    color: '#23855a',
  },
  {
    id: 'gumamela',
    commonName: 'Gumamela',
    alias: null,
    scientificName: 'Hibiscus rosa-sinensis',
    family: 'Malvaceae',
    status: 'Native',
    detections: 38,
    provinces: ['Ilocos Sur', 'La Union'],
    origin: 'Tropical Asia',
    habitat: 'Coastal settlements, gardens, secondary growth',
    description:
      'A widely cultivated ornamental shrub included as a native look-alike control in the field image dataset.',
    color: '#23855a',
  },
]

export const speciesById = Object.fromEntries(
  mockSpecies.map((species) => [species.id, species]),
)

export const topInvasiveSpecies = [
  {
    name: 'Hagonoy',
    scientificName: 'Chromolaena odorata',
    value: 284,
    speciesId: 'hagonoy',
  },
  {
    name: 'Lantana',
    scientificName: 'Lantana camara',
    value: 231,
    speciesId: 'lantana',
  },
  {
    name: 'Leucaena',
    scientificName: 'Leucaena leucocephala',
    value: 170,
    speciesId: 'leucaena',
  },
  {
    name: 'Narra',
    scientificName: 'Pterocarpus indicus',
    value: 92,
    speciesId: 'narra',
  },
]

export const speciesSelectOptions = [
  { value: 'all', label: 'All Invasive Species' },
  { value: 'hagonoy', label: 'Hagonoy' },
  { value: 'lantana', label: 'Lantana' },
  { value: 'leucaena', label: 'Ipil-ipil / Leucaena' },
  { value: 'narra', label: 'Narra (native)' },
  { value: 'gumamela', label: 'Gumamela (native)' },
]

export const dataSources = [
  {
    title: 'Plant Image Dataset',
    detail: 'iNaturalist & GBIF',
    description: '1,842 curated field and herbarium images across five target classes.',
    icon: 'image',
  },
  {
    title: 'Smartphone Web Camera',
    detail: 'PWA Capture',
    description: 'Environment-facing camera capture from the browser, no native app required.',
    icon: 'camera',
  },
  {
    title: 'Auto-Geotagging',
    detail: 'HTML5 GPS',
    description: 'Coordinates captured at scan time with a mapped fallback for denied permission.',
    icon: 'pin',
  },
  {
    title: 'Offline Local Storage',
    detail: 'IndexedDB · Field Sync',
    description: 'Field observations persist on-device and sync when connectivity returns.',
    icon: 'database',
  },
  {
    title: 'Target Species Labels',
    detail: 'Invasive vs. Native',
    description: 'Binary ecological status labels for invasive detection and native validation.',
    icon: 'tags',
  },
]

export const preprocessingSteps = [
  'Image resizing & normalization (224 × 224 px)',
  'Background noise reduction',
  'Data augmentation (rotation, flip, zoom)',
  'Train/test split (80/20)',
]
