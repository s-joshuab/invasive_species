export const modelComparison = [
  {
    model: 'MobileNetV2',
    shortModel: 'MobileNetV2',
    task: 'CNN classification',
    accuracy: 0.93,
    precision: 0.92,
    recall: 0.91,
    f1: 0.91,
    size: '14.2 MB',
    inference: '48 ms',
    parameters: '3.5 M',
    color: '#a1a1a1',
  },
  {
    model: 'YOLOv8-Cls',
    shortModel: 'YOLOv8-Cls',
    task: 'Detection + classification',
    accuracy: 0.95,
    precision: 0.94,
    recall: 0.94,
    f1: 0.94,
    size: '21.5 MB',
    inference: '73 ms',
    parameters: '11.2 M',
    color: '#23855a',
  },
]

export const modelMetricData = [
  { metric: 'Accuracy', MobileNetV2: 93, 'YOLOv8-Cls': 95 },
  { metric: 'Precision', MobileNetV2: 92, 'YOLOv8-Cls': 94 },
  { metric: 'Recall', MobileNetV2: 91, 'YOLOv8-Cls': 94 },
  { metric: 'F1 Score', MobileNetV2: 91, 'YOLOv8-Cls': 94 },
]

export const modelDescriptions = [
  {
    name: 'MobileNetV2 (CNN)',
    role: 'Lightweight spatial feature extraction',
    description:
      'A depthwise-separable CNN tuned for mobile inference. MobileNetV2 extracts spatial features from field photographs and performs real-time classification with a compact memory footprint, ideal for intermittent connectivity in Ilocos field operations.',
    highlights: ['Depthwise separable convolutions', 'Low-latency browser inference', 'Optimized for 224 × 224 px inputs'],
    accent: '#a1a1a1',
  },
  {
    name: 'YOLOv8 Classification',
    role: 'Deep multi-scale detection & classification',
    description:
      'YOLOv8-Cls uses a modern CSP backbone with multi-scale feature aggregation. The model performs stronger classification across dense vegetation and overlapping plant structures, improving confidence on hard field scenes.',
    highlights: ['Multi-scale feature fusion', 'Higher recall on dense canopies', 'CSPDarknet classification head'],
    accent: '#23855a',
  },
]

export const evaluationSummary = {
  dataset: 'IAPS-REG1-v3',
  images: 1842,
  classes: 5,
  split: '80 / 20',
  lastEvaluated: 'Nov 12, 2026',
  bestModel: 'YOLOv8-Cls',
  bestF1: 0.94,
}

export const confusionByClass = [
  { class: 'Hagonoy', precision: 0.96, recall: 0.95, support: 240 },
  { class: 'Lantana', precision: 0.94, recall: 0.95, support: 228 },
  { class: 'Ipil-ipil', precision: 0.93, recall: 0.92, support: 186 },
  { class: 'Narra', precision: 0.94, recall: 0.95, support: 132 },
  { class: 'Gumamela', precision: 0.95, recall: 0.92, support: 96 },
]
