// ============================================================
// ATLAS — EXACT FIGURE LIBRARY  (lookup index — pure JS, no JSX)
// ------------------------------------------------------------
// Priority-order figure resolution for diagram questions:
//   1. resolveExactFigure() matches the question against this
//      registry of canonical source figures stored in ATLAS.
//   2. If matched, the EXACT stored figure is rendered — never
//      an AI-generated replacement.
//   3. If no stored figure matches, the caller falls through to
//      normal AI answer generation (Priority 4 — last resort).
// ============================================================

export const FIGURES = [
  {
    id: 'fibonacci-flowchart',
    title: 'Flowchart to generate the first n Fibonacci numbers',
    source: 'UCEST105 - Algorithmic Thinking with Python — "Draw the flowchart to generate the first \'n\' numbers in the Fibonacci sequence."',
    patterns: [
      /fibonacci[\s\S]{0,60}flow\s?chart/i,
      /flow\s?chart[\s\S]{0,60}fibonacci/i,
      /flow\s?chart[\s\S]{0,40}generate the first/i,
      /generate the first[^.]{0,40}fibonacci/i,
    ],
  },
  {
    id: 'dc-power-supply-block',
    title: 'Block diagram of a DC power supply',
    source: 'GXEST104 - Introduction to Electrical and Electronics Engineering — "Draw the block diagram of a DC power supply and explain."',
    patterns: [
      /block\s?diagram[\s\S]{0,60}dc\s?power\s?supply/i,
      /dc\s?power\s?supply[\s\S]{0,60}block\s?diagram/i,
    ],
  },
  {
    id: 'communication-system-block',
    title: 'Block diagram of a basic communication system',
    source: 'GXEST104 - Introduction to Electrical and Electronics Engineering — "With the help of a neat block diagram, explain the components of a basic communication system."',
    patterns: [
      /block\s?diagram[\s\S]{0,60}communication\s?system/i,
      /communication\s?system[\s\S]{0,40}block\s?diagram/i,
    ],
  },
  {
    id: 'instrumentation-system-block',
    title: 'Block diagram of an electronic instrumentation system',
    source: 'GXEST104 - Introduction to Electrical and Electronics Engineering — "With a neat block diagram, explain components of an electronic instrumentation system."',
    patterns: [
      /block\s?diagram[\s\S]{0,60}(electronic\s+)?instrumentation/i,
      /(electronic\s+)?instrumentation[\s\S]{0,40}block\s?diagram/i,
    ],
  },
  {
    id: 'energy-band-diagram',
    title: 'Energy band diagram of conductors, semiconductors and insulators',
    source: 'GAPHT121 - Physics for Information Science — "Draw labelled energy band diagram of conductors, semiconductors and insulators."',
    patterns: [
      /energy\s?band\s?diagram/i,
      /band\s?diagram[\s\S]{0,40}(conductor|semiconductor|insulator)/i,
    ],
  },
  {
    id: 'pn-junction-vi',
    title: 'V-I characteristics of a p-n junction diode',
    source: 'GAPHT121 - Physics for Information Science — "Draw the V-I characteristics of a p-n junction diode and explain the features."',
    patterns: [
      /v-?\s?i\s?characteristics[\s\S]{0,40}p-?n\s?junction/i,
      /p-?n\s?junction[\s\S]{0,40}v-?\s?i\s?characteristics/i,
    ],
  },
  {
    id: 'diesel-pv-ts',
    title: 'P-V and T-S diagram of the Diesel cycle',
    source: 'GCEST104 - Introduction to Civil and Mechanical Engineering — "Draw the P-V and T-S diagram of Diesel cycle and list the processes involved."',
    patterns: [
      /(p-?v|pressure-volume)[\s\S]{0,40}(t-?s|temperature-entropy)[\s\S]{0,40}diesel/i,
      /diesel[\s\S]{0,60}(p-?v|t-?s)/i,
    ],
  },
  {
    id: 'mild-steel-stress-strain',
    title: 'Stress–strain diagram of mild steel with salient points',
    source: 'PCCET205 - Mechanics of Solids — "Draw the stress strain diagram of mild steel and mark its salient points."',
    patterns: [
      /stress[\s-]?strain\s?diagram[\s\S]{0,40}mild\s?steel/i,
      /mild\s?steel[\s\S]{0,40}stress[\s-]?strain/i,
    ],
  },
];

let _cache = null;

function normalize() {
  if (_cache) return _cache;
  const cached = Object.create(null);
  for (const f of FIGURES) {
    const test = (t) => f.patterns.some((re) => re.test(t));
    cached[f.id] = { f, test };
  }
  _cache = cached;
  return _cache;
}

export function resolveExactFigure(questionText) {
  const q = String(questionText || '');
  if (!q.trim()) return null;
  const idx = normalize();
  for (const f of FIGURES) {
    if (idx[f.id] && idx[f.id].test(q)) return f;
  }
  return null;
}