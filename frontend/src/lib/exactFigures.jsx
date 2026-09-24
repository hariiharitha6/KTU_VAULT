import { FIGURES } from './exactFigures.js';

// ============================================================
// ATLAS — EXACT FIGURE RENDERER  (deterministic stored figures)
// ------------------------------------------------------------
// These are hand-authored, canonical KTU figures stored in the
// project. They are rendered EXACTLY as authored — never produced
// by a generative model — so repeated answers show the identical
// stable figure (same shapes, arrows, labels, layout).
// ============================================================

const C = {
  line:   '#5F8ECC',
  text:   '#B7C6DC',
  dim:    '#697B96',
  bright: '#E7ECF5',
  green:  '#86dfba',
  amber:  '#f0c987',
  red:    '#e8a598',
};

function FigFrame({ label, source, width, height, svgContent, ariaLabel }) {
  return (
    <div className="my-3 flex justify-center w-full">
      <div className="rounded-2xl p-4" style={{ background: '#0D1424', border: '1px solid rgba(100,142,204,0.16)', maxWidth: '100%' }}>
        <p className="text-[10px] font-black uppercase tracking-widest text-center mb-1" style={{ color: C.line }}>
          {label}
        </p>
        <p className="text-[9px] font-bold uppercase tracking-wider text-center mb-3" style={{ color: C.dim }}>
          Exact figure · KTU figure library · not AI-generated
        </p>
        <div className="overflow-x-auto flex justify-center">
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}
            xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '100%', height: 'auto' }}
            role="img" aria-label={ariaLabel}>
            {svgContent}
          </svg>
        </div>
        {source && (
          <p className="text-[11px] font-medium text-center mt-3 leading-snug" style={{ color: C.dim }}>
            {source}
          </p>
        )}
      </div>
    </div>
  );
}

const TXT = { fontFamily: 'system-ui' };

function T({ x, y, size = 11, anchor = 'middle', weight = 700, color = C.text, children }) {
  return (
    <text x={x} y={y} textAnchor={anchor} dominantBaseline="middle" fontSize={size} fontWeight={weight} fill={color} style={TXT}>
      {children}
    </text>
  );
}

function VArrow({ x, y1, y2, color = C.line }) {
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2 - 4} stroke={color} strokeWidth="1.5" />
      <polygon points={`${x - 4},${y2 - 8} ${x},${y2} ${x + 4},${y2 - 8}`} fill={color} />
    </g>
  );
}

function HArrow({ x1, x2, y, color = C.line }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2 - 4} y2={y} stroke={color} strokeWidth="1.5" />
      <polygon points={`${x2 - 8},${y - 4} ${x2},${y} ${x2 - 8},${y + 4}`} fill={color} />
    </g>
  );
}

// ============================================================
// 1. FIBONACCI FLOWCHART  (UCEST105)
// ============================================================

function FibonacciFlowchart() {
  const S = 170;
  const ioPts = (y) => `102,${y} 262,${y} 238,${y + 34} 78,${y + 34}`;
  const box = { fill: 'rgba(100,142,204,0.14)', stroke: C.line };
  const io  = { fill: 'rgba(100,142,204,0.16)', stroke: '#3D5F94' };
  const dec = { fill: 'rgba(240,201,135,0.18)', stroke: C.amber };
  const end = { fill: 'rgba(232,165,152,0.18)', stroke: C.red };
  return (
    <FigFrame
      label="Flowchart — Fibonacci sequence"
      source={FIGURES[0].source}
      width={360}
      height={590}
      ariaLabel="Exact flowchart to generate the first n Fibonacci numbers"
      svgContent={
        <g>
          <rect x={110} y={6} width={120} height={28} rx={14} ry={14} fill={end.fill} stroke={end.stroke} strokeWidth="1.8" />
          <T x={S} y={20} color={C.red}>Start</T>
          <VArrow x={S} y1={34} y2={58} />

          <polygon points={ioPts(62)} fill={io.fill} stroke={io.stroke} strokeWidth="1.8" strokeLinejoin="round" />
          <T x={S} y={79}>Read n</T>
          <VArrow x={S} y1={96} y2={124} />

          <rect x={90} y={128} width={160} height={34} rx="6" ry="6" fill={box.fill} stroke={box.stroke} strokeWidth="1.8" />
          <T x={S} y={145}>a ← 0, b ← 1</T>
          <VArrow x={S} y1={162} y2={190} />

          <polygon points={ioPts(194)} fill={io.fill} stroke={io.stroke} strokeWidth="1.8" strokeLinejoin="round" />
          <T x={S} y={211}>Print a, b</T>
          <VArrow x={S} y1={228} y2={256} />

          <rect x={90} y={260} width={160} height={34} rx="6" ry="6" fill={box.fill} stroke={box.stroke} strokeWidth="1.8" />
          <T x={S} y={277}>count ← 2</T>
          <VArrow x={S} y1={294} y2={318} />

          <polygon points={`${S},322 ${S + 36},344 ${S},366 ${S - 36},344`} fill={dec.fill} stroke={dec.stroke} strokeWidth="1.8" strokeLinejoin="round" />
          <T x={S} y={344} color={C.amber} size={11}>count ≤ n ?</T>
          <VArrow x={S} y1={366} y2={392} />
          <T x={S - 14} y={381} size={9} color={C.green}>Yes</T>

          <rect x={90} y={396} width={160} height={34} rx="6" ry="6" fill={box.fill} stroke={box.stroke} strokeWidth="1.8" />
          <T x={S} y={413}>c ← a + b</T>
          <VArrow x={S} y1={430} y2={458} />

          <polygon points={ioPts(462)} fill={io.fill} stroke={io.stroke} strokeWidth="1.8" strokeLinejoin="round" />
          <T x={S} y={479}>Print c</T>
          <VArrow x={S} y1={496} y2={524} />

          <rect x={90} y={528} width={160} height={34} rx="6" ry="6" fill={box.fill} stroke={box.stroke} strokeWidth="1.8" />
          <T x={S} y={545} size={9.5}>a ← b, b ← c, count ← count + 1</T>

          <polyline points={`90,545 56,545 56,344 128,344`} fill="none" stroke={C.line} strokeWidth="1.5" />
          <polygon points={`122,340 134,344 122,348`} fill={C.line} />

          <HArrow x1={206} x2={232} y={344} color={C.red} />
          <T x={219} y={330} size={9} color={C.red}>No</T>
          <rect x={235} y={329} width={100} height={30} rx={15} ry={15} fill={end.fill} stroke={end.stroke} strokeWidth="1.8" />
          <T x={285} y={344} color={C.red}>Stop</T>
        </g>
      }
    />
  );
}

// ============================================================
// 2. DC POWER SUPPLY BLOCK DIAGRAM  (GXEST104)
// ============================================================

function BlockRow({ items, y = 30, h = 46, sub = true }) {
  return (
    <g>
      {items.map((it) => {
        const lines = String(it.label || '').split('\n');
        const two = lines.length > 1;
        const labelY = it.sub ? (two ? y + 13 : y + 17) : (two ? y + h / 2 - 6 : y + h / 2);
        return (
          <g key={it.x}>
            <rect x={it.x} y={y} width={it.w} height={h} rx="8" ry="8"
              fill="rgba(100,142,204,0.12)" stroke={C.line} strokeWidth="1.6" />
            <text x={it.x + it.w / 2} y={labelY} textAnchor="middle" dominantBaseline="middle"
              fontSize={two ? 10 : 11} fontWeight={800} fill={C.bright} style={TXT}>
              {lines.map((ln, li) => (
                <tspan key={li} x={it.x + it.w / 2} dy={li === 0 ? 0 : 13}>{ln}</tspan>
              ))}
            </text>
            {sub && it.sub && <T x={it.x + it.w / 2} y={two ? y + 39 : y + 34} size={8} color={C.dim}>{it.sub}</T>}
          </g>
        );
      })}
    </g>
  );
}

function DcPowerSupplyBlock() {
  const gap = 24;
  const w = 100;
  const y = 30;
  const items = [
    { x: 8,   w, label: 'AC Input', sub: 'mains 230V' },
    { x: 8 + w + gap,   w, label: 'Transformer', sub: 'steps down A.C.' },
    { x: 8 + (w + gap) * 2, w, label: 'Rectifier', sub: 'A.C. → pulsating D.C.' },
    { x: 8 + (w + gap) * 3, w, label: 'Filter', sub: 'removes ripple' },
    { x: 8 + (w + gap) * 4, w, label: 'Voltage\nRegulator', sub: 'constant D.C.' },
    { x: 8 + (w + gap) * 5, w, label: 'DC Output', sub: 'load supply' },
  ];
  return (
    <FigFrame
      label="Block diagram — DC power supply"
      source={FIGURES[1].source}
      width={760}
      height={132}
      ariaLabel="Block diagram of a DC power supply"
      svgContent={
        <g>
          <BlockRow items={items} sub />
          <HArrow x1={8 + w} x2={8 + w + gap - 2} y={y + 23} />
          <HArrow x1={8 + (w + gap) * 1 + w} x2={8 + (w + gap) * 2 - 2} y={y + 23} />
          <HArrow x1={8 + (w + gap) * 2 + w} x2={8 + (w + gap) * 3 - 2} y={y + 23} />
          <HArrow x1={8 + (w + gap) * 3 + w} x2={8 + (w + gap) * 4 - 2} y={y + 23} />
          <HArrow x1={8 + (w + gap) * 4 + w} x2={8 + (w + gap) * 5 - 2} y={y + 23} />
          <T x={390} y={112} size={10} color={C.dim}>Series of transformations to convert raw A.C. mains into steady D.C.</T>
        </g>
      }
    />
  );
}

// ============================================================
// 3. COMMUNICATION SYSTEM BLOCK DIAGRAM  (GXEST104)
// ============================================================

function CommunicationSystemBlock() {
  const gap = 24;
  const w = 100;
  const y = 30;
  const items = [
    { x: 8,   w, label: 'Information\nSource' },
    { x: 8 + w + gap,   w, label: 'Transmitter' },
    { x: 8 + (w + gap) * 2, w, label: 'Communication\nChannel' },
    { x: 8 + (w + gap) * 3, w, label: 'Receiver' },
    { x: 8 + (w + gap) * 4, w, label: 'Destination' },
  ];
  const chX = 8 + (w + gap) * 2 + w / 2;
  return (
    <FigFrame
      label="Block diagram — basic communication system"
      source={FIGURES[2].source}
      width={624}
      height={116}
      ariaLabel="Block diagram of the components of a basic communication system"
      svgContent={
        <g>
          <BlockRow items={items} sub={false} />
          <HArrow x1={8 + w} x2={8 + w + gap - 2} y={y + 23} />
          <HArrow x1={8 + (w + gap) * 2 + w} x2={8 + (w + gap) * 3 - 2} y={y + 23} />
          <HArrow x1={8 + (w + gap) * 3 + w} x2={8 + (w + gap) * 4 - 2} y={y + 23} />
          <T x={chX - 30} y={14} size={10} color={C.red}>Noise</T>
          <VArrow x={chX} y1={14} y2={28} color={C.red} />
          <T x={78} y={92} size={10} color={C.dim}>Signal flows source → destination; the channel may add noise.</T>
        </g>
      }
    />
  );
}

// ============================================================
// 4. ELECTRONIC INSTRUMENTATION SYSTEM  (GXEST104)
// ============================================================

function InstrumentationSystemBlock() {
  const gap = 24;
  const w = 128;
  const y = 30;
  const items = [
    { x: 8,   w, label: 'Primary Sensing\nElement' },
    { x: 8 + w + gap,   w, label: 'Variable Conversion\nElement' },
    { x: 8 + (w + gap) * 2, w, label: 'Signal Conditioning\nElement' },
    { x: 8 + (w + gap) * 3, w, label: 'Data Presentation\nElement' },
  ];
  return (
    <FigFrame
      label="Block diagram — electronic instrumentation system"
      source={FIGURES[3].source}
      width={616}
      height={112}
      ariaLabel="Block diagram of the functional elements of an electronic instrumentation system"
      svgContent={
        <g>
          <BlockRow items={items} y={y} h={48} sub={false} />
          <HArrow x1={8 + w} x2={8 + w + gap - 2} y={y + 24} />
          <HArrow x1={8 + (w + gap) * 2 + w} x2={8 + (w + gap) * 3 - 2} y={y + 24} />
          <HArrow x1={8 + (w + gap) * 1 + w} x2={8 + (w + gap) * 2 - 2} y={y + 24} />
          <T x={308} y={94} size={10} color={C.dim}>Functional chain of a measurement instrument.</T>
        </g>
      }
    />
  );
}

// ============================================================
// 5. ENERGY BAND DIAGRAM  (GAPHT121)
// ============================================================

function EnergyBandDiagram() {
  const barX = (center) => ({ x: center - 42, w: 84, h: 10 });
  const band = { fill: 'rgba(100,142,204,0.4)', stroke: C.line };
  const cond = barX(92);
  const semi = barX(292);
  const insu = barX(490);
  return (
    <FigFrame
      label="Energy band diagram — conductors, semiconductors, insulators"
      source={FIGURES[4].source}
      width={560}
      height={200}
      ariaLabel="Labelled energy band diagram of conductors, semiconductors and insulators"
      svgContent={
        <g>
          <line x1={24} y1={30} x2={24} y2={160} stroke={C.bright} strokeWidth="1.4" />
          <line x1={18} y1={152} x2={24} y2={162} stroke={C.bright} strokeWidth="1.4" />
          <line x1={30} y1={152} x2={24} y2={162} stroke={C.bright} strokeWidth="1.4" />
          <T x={48} y={20} size={10} color={C.bright}>Energy ↑</T>

          {/* Conductor — overlapping bands */}
          <rect x={cond.x} y={40} width={cond.w} height={9} fill={band.fill} stroke={band.stroke} strokeWidth="1.4" />
          <rect x={cond.x} y={49} width={cond.w} height={9} fill={band.fill} stroke={band.stroke} strokeWidth="1.4" />
          <T x={52} y={84} size={9} color={C.green}>Conduction band</T>
          <T x={52} y={100} size={9} color={C.red}>Valence band</T>
          <T x={92} y={132} size={10} weight={800} color={C.bright}>Conductor</T>

          {/* Semiconductor — small gap */}
          <rect x={semi.x} y={40} width={semi.w} height={9} fill={band.fill} stroke={band.stroke} strokeWidth="1.4" />
          <rect x={semi.x} y={120} width={semi.w} height={9} fill={band.fill} stroke={band.stroke} strokeWidth="1.4" />
          <line x1={semi.x} y1={114} x2={semi.x + semi.w} y2={114} stroke={C.amber} strokeWidth="1" strokeDasharray="4 3" />
          <T x={292} y={52} size={9} color={C.green}>Ec</T>
          <T x={292} y={132} size={9} color={C.red}>Ev</T>
          <T x={340} y={84} size={9} color={C.amber}>Eg — forbidden gap</T>
          <T x={292} y={168} size={10} weight={800} color={C.bright}>Semiconductor</T>

          {/* Insulator — large gap */}
          <rect x={insu.x} y={40} width={insu.w} height={9} fill={band.fill} stroke={band.stroke} strokeWidth="1.4" />
          <rect x={insu.x} y={146} width={insu.w} height={9} fill={band.fill} stroke={band.stroke} strokeWidth="1.4" />
          <T x={490} y={52} size={9} color={C.green}>Ec</T>
          <T x={490} y={158} size={9} color={C.red}>Ev</T>
          <T x={540} y={98} size={9} color={C.amber}>large Eg</T>
          <T x={490} y={182} size={10} weight={800} color={C.bright}>Insulator</T>
        </g>
      }
    />
  );
}

// ============================================================
// 6. P-N JUNCTION V-I CHARACTERISTICS  (GAPHT121)
// ============================================================

function PnJunctionVI() {
  const O = { x: 150, y: 240 };
  return (
    <FigFrame
      label="V-I characteristics — p-n junction diode"
      source={FIGURES[5].source}
      width={470}
      height={330}
      ariaLabel="V-I characteristics curve of a p-n junction diode"
      svgContent={
        <g>
          {/* axes */}
          <line x1={O.x} y1={O.y} x2={440} y2={O.y} stroke={C.bright} strokeWidth="1.4" />
          <line x1={O.x} y1={O.y} x2={18} y2={O.y} stroke={C.bright} strokeWidth="1.4" />
          <line x1={O.x} y1={O.y} x2={O.x} y2={22} stroke={C.bright} strokeWidth="1.4" />
          <line x1={O.x} y1={O.y} x2={O.x} y2={318} stroke={C.bright} strokeWidth="1.4" />
          <T x={455} y={O.y + 4} size={11} color={C.bright}>V</T>
          <T x={O.x - 4} y={16} size={11} color={C.bright}>I</T>
          <T x={O.x - 6} y={O.y + 8} size={10} color={C.dim}>0</T>
          <T x={276} y={258} size={9} color={C.dim}>forward voltage (V)</T>
          <T x={74} y={258} size={9} color={C.dim}>reverse voltage</T>
          <T x={O.x - 70} y={38} size={9} color={C.dim}>forward current</T>
          <T x={O.x + 8} y={306} size={9} color={C.dim}>reverse current (µA)</T>

          {/* forward curve */}
          <polyline points={`${O.x},${O.y} ${O.x + 40},${O.y - 2} ${O.x + 62},${O.y - 26} ${O.x + 84},${O.y - 66} ${O.x + 130},${O.y - 150} ${O.x + 188},${O.y - 196} ${O.x + 260},${O.y - 214}`}
            fill="none" stroke={C.green} strokeWidth="2" />
          {/* reverse branch */}
          <polyline points={`${O.x},${O.y} ${O.x},${O.y + 16} ${O.x - 10},${O.y + 22}`} fill="none" stroke={C.red} strokeWidth="2" />
          <polyline points={`${O.x - 10},${O.y + 22} ${O.x - 96},${O.y + 22}`} fill="none" stroke={C.red} strokeWidth="2" />
          <polyline points={`${O.x - 96},${O.y + 22} ${O.x - 106},${O.y + 30} ${O.x - 118},${O.y + 78}`} fill="none" stroke={C.red} strokeWidth="2" />

          <T x={96} y={O.y - 60} size={9} color={C.green} anchor="start">forward bias</T>
          <T x={O.x - 130} y={O.y + 52} size={9} color={C.red} anchor="end">reverse saturation current (Is)</T>
          <T x={O.x - 108} y={O.y + 16} size={9} color={C.red}>breakdown region</T>
          <T x={O.x + 66} y={O.y - 92} size={9} color={C.green} anchor="start">knee voltage (≈ 0.7 V Si)</T>
          <circle cx={O.x} cy={O.y} r="2.5" fill={C.bright} />
        </g>
      }
    />
  );
}

// ============================================================
// 7. DIESEL CYCLE — P-V AND T-S DIAGRAMS  (GCEST104)
// ============================================================

function DieselPvTs() {
  const pv = [
    { label: '1', x: 130, y: 165 },
    { label: '2', x: 92, y: 56 },
    { label: '3', x: 152, y: 56 },
    { label: '4', x: 230, y: 165 },
  ];
  const ts = [
    { label: '1', x: 330, y: 148 },
    { label: '2', x: 330, y: 66 },
    { label: '3', x: 432, y: 90 },
    { label: '4', x: 432, y: 158 },
  ];
  return (
    <FigFrame
      label="Diesel cycle — P-V and T-S diagrams"
      source={FIGURES[6].source}
      width={560}
      height={230}
      ariaLabel="P-V and T-S diagrams of the four-stroke Diesel cycle"
      svgContent={
        <g>
          {/* P-V axes */}
          <line x1={20} y1={20} x2={20} y2={200} stroke={C.bright} strokeWidth="1.4" />
          <line x1={20} y1={200} x2={252} y2={200} stroke={C.bright} strokeWidth="1.4" />
          <T x={12} y={18} size={11} color={C.bright}>P</T>
          <T x={256} y={205} size={11} color={C.bright}>V</T>

          {/* P-V cycle 1→2→3→4→1 */}
          <path d="M130,165 C122,120 112,90 92,56" fill="none" stroke={C.line} strokeWidth="1.8" />
          <path d="M92,56 L152,56" fill="none" stroke={C.green} strokeWidth="1.8" />
          <path d="M152,56 C175,92 205,135 230,165" fill="none" stroke={C.line} strokeWidth="1.8" />
          <line x1={230} y1={165} x2={130} y2={165} stroke={C.red} strokeWidth="1.8" />
          <polygon points="130,193 130,160 136,160 136,193" fill={C.line} opacity="0.55" />

          {pv.map((p) => (
            <g key={p.label}>
              <circle cx={p.x} cy={p.y} r="3" fill={C.bright} />
              <T x={p.x + 8} y={p.y - 6} size={10} weight={800} color={C.bright}>{p.label}</T>
            </g>
          ))}
          <T x={120} y={42} size={9} color={C.green}>2→3 heat added (const P)</T>
          <T x={196} y={96} size={9} color={C.line}>3→4 expansion</T>
          <T x={188} y={186} size={9} color={C.red}>4→1 heat rejected (const V)</T>

          {/* T-S axes */}
          <line x1={300} y1={20} x2={300} y2={200} stroke={C.bright} strokeWidth="1.4" />
          <line x1={300} y1={200} x2={520} y2={200} stroke={C.bright} strokeWidth="1.4" />
          <T x={292} y={18} size={11} color={C.bright}>T</T>
          <T x={524} y={205} size={11} color={C.bright}>S</T>

          {/* T-S cycle */}
          <line x1={330} y1={148} x2={330} y2={66} stroke={C.line} strokeWidth="1.8" />
          <path d="M330,66 C360,66 400,74 432,90" fill="none" stroke={C.green} strokeWidth="1.8" />
          <line x1={432} y1={90} x2={432} y2={158} stroke={C.line} strokeWidth="1.8" />
          <path d="M432,158 C392,152 360,150 330,148" fill="none" stroke={C.red} strokeWidth="1.8" />

          {ts.map((p) => (
            <g key={'t' + p.label}>
              <circle cx={p.x} cy={p.y} r="3" fill={C.bright} />
              <T x={p.x + 8} y={p.y + 4} size={10} weight={800} color={C.bright}>{p.label}</T>
            </g>
          ))}
          <T x={376} y={54} size={9} color={C.green}>2→3 heat added (const P)</T>
          <T x={344} y={80} size={9} color={C.line}>1→2 isentropic</T>
          <T x={444} y={124} size={9} color={C.line}>3→4 isentropic</T>
          <T x={374} y={166} size={9} color={C.red}>4→1 heat rejected (const V)</T>
        </g>
      }
    />
  );
}

// ============================================================
// 8. MILD STEEL STRESS–STRAIN DIAGRAM  (PCCET205)
// ============================================================

function MildSteelStressStrain() {
  return (
    <FigFrame
      label="Stress–strain diagram — mild steel"
      source={FIGURES[7].source}
      width={470}
      height={310}
      ariaLabel="Stress strain diagram of mild steel with proportional limit, yield point, ultimate and fracture points marked"
      svgContent={
        <g>
          <line x1={60} y1={250} x2={60} y2={30} stroke={C.bright} strokeWidth="1.4" />
          <line x1={60} y1={250} x2={440} y2={250} stroke={C.bright} strokeWidth="1.4" />
          <T x={52} y={28} size={11} color={C.bright}>σ</T>
          <T x={444} y={256} size={11} color={C.bright}>ε</T>

          <path d="M60,250 L158,118 C164,128 168,138 174,146 L238,150 C268,134 285,106 300,94 C328,128 362,172 402,206"
            fill="none" stroke={C.line} strokeWidth="2" />

          <circle cx={158} cy={118} r="3.2" fill={C.green} />
          <T x={158} y={106} size={10} weight={800} color={C.green}>P (proportional limit)</T>
          <circle cx={174} cy={146} r="3.2" fill={C.amber} />
          <T x={200} y={160} size={10} weight={800} color={C.amber}>Y (yield point)</T>
          <circle cx={300} cy={94} r="3.2" fill={C.green} />
          <T x={308} y={82} size={10} weight={800} color={C.green}>U (ultimate)</T>
          <circle cx={402} cy={206} r="3.2" fill={C.red} />
          <T x={410} y={222} size={10} weight={800} color={C.red}>F (fracture)</T>

          <line x1={300} y1={94} x2={300} y2={250} stroke={C.dim} strokeWidth="1" strokeDasharray="4 3" />
          <T x={300} y={268} size={9} color={C.dim}>ultimate strength</T>

          <T x={120} y={238} size={9} color={C.green}>elastic region</T>
          <T x={270} y={238} size={9} color={C.amber}>plastic region</T>
          <T x={392} y={132} size={9} color={C.red}>necking</T>
        </g>
      }
    />
  );
}

// ============================================================
// REGISTRY → COMPONENT MAP
// ============================================================

const FIGURE_COMPONENTS = {
  'fibonacci-flowchart': FibonacciFlowchart,
  'dc-power-supply-block': DcPowerSupplyBlock,
  'communication-system-block': CommunicationSystemBlock,
  'instrumentation-system-block': InstrumentationSystemBlock,
  'energy-band-diagram': EnergyBandDiagram,
  'pn-junction-vi': PnJunctionVI,
  'diesel-pv-ts': DieselPvTs,
  'mild-steel-stress-strain': MildSteelStressStrain,
};

export function ExactFigureRenderer({ id }) {
  const Comp = FIGURE_COMPONENTS[id];
  if (!Comp) return null;
  return <Comp />;
}