/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHARTS — SVG leve pra exploração (refs 3/4: linha + donut)
 * ═══════════════════════════════════════════════════════════════════════════
 * Sem lib. `currentColor` na linha → a cor vem do caller (ex: branco no hero
 * escuro). O donut recebe cores via CSS var dos tokens.
 *
 * ⚠️ Paleta: um gráfico categórico precisa de N cores distintas, e nossos
 * tokens de cor são de ESTADO/ação. Aqui eu reuso action/info/success/warning
 * como paleta de exploração — se o donut entrar no produto, a gente define uma
 * escala categórica de verdade (decisão de paleta à parte).
 * ═══════════════════════════════════════════════════════════════════════════
 */

export function LineChart({ valores }: { valores: number[] }) {
  const w = 300;
  const h = 120;
  const pad = 12;
  const max = Math.max(...valores);
  const min = Math.min(...valores);
  const range = max - min || 1;
  const pts = valores.map((v, i) => ({
    x: pad + (i / (valores.length - 1)) * (w - 2 * pad),
    y: h - pad - ((v - min) / range) * (h - 2 * pad),
  }));
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const ultimo = pts[pts.length - 1];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" aria-hidden>
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="currentColor" opacity="0.7" />
      ))}
      <circle cx={ultimo.x} cy={ultimo.y} r="4.5" fill="currentColor" />
    </svg>
  );
}

/**
 * Barras: `currentColor` + linha de média opcional. `destaque` (índice) pinta só
 * uma barra em currentColor e as outras em cinza (ref. "most active day").
 */
export function BarChart({
  valores,
  media,
  destaque,
}: {
  valores: number[];
  media?: number;
  destaque?: number;
}) {
  const w = 300;
  const h = 130;
  const pad = 6;
  const base = h - 10;
  const max = Math.max(...valores, media ?? 0) || 1;
  const step = (w - pad * 2) / valores.length;
  const bw = step * 0.5;
  const alt = (v: number) => (v / max) * (base - 8);
  const mediaY = media != null ? base - alt(media) : null;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" aria-hidden>
      {valores.map((v, i) => {
        const bh = alt(v);
        const x = pad + i * step + (step - bw) / 2;
        const aceso = destaque === undefined || i === destaque;
        return (
          <rect
            key={i}
            x={x.toFixed(1)}
            y={(base - bh).toFixed(1)}
            width={bw.toFixed(1)}
            height={bh.toFixed(1)}
            rx="2.5"
            fill={aceso ? "currentColor" : "var(--color-border-hairline)"}
            opacity={destaque === undefined ? 0.85 : 1}
          />
        );
      })}
      {mediaY != null && (
        <line
          x1={pad}
          y1={mediaY.toFixed(1)}
          x2={w - pad}
          y2={mediaY.toFixed(1)}
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 3"
          opacity="0.4"
        />
      )}
    </svg>
  );
}

export type Segmento = { valor: number; cor: string; rotulo: string };

export function DonutChart({
  segmentos,
  centro,
  legenda,
}: {
  segmentos: Segmento[];
  centro: string;
  legenda: string;
}) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const soma = segmentos.reduce((a, s) => a + s.valor, 0) || 1;
  // Comprimentos + offsets acumulados, PUROS (sem reassign durante o render).
  const lens = segmentos.map((s) => (s.valor / soma) * c);
  const offsets = lens.map((_, i) => lens.slice(0, i).reduce((a, b) => a + b, 0));

  return (
    <svg viewBox="0 0 100 100" className="h-[120px] w-[120px]" aria-hidden>
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-border-hairline)" strokeWidth="12" />
      {segmentos.map((s, i) => (
        <circle
          key={i}
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={s.cor}
          strokeWidth="12"
          strokeDasharray={`${lens[i].toFixed(2)} ${(c - lens[i]).toFixed(2)}`}
          strokeDashoffset={(-offsets[i]).toFixed(2)}
          transform="rotate(-90 50 50)"
          strokeLinecap="butt"
        />
      ))}
      <text
        x="50"
        y="47"
        textAnchor="middle"
        className="fill-[color:var(--color-text-primary)] text-[16px] font-bold"
      >
        {centro}
      </text>
      <text
        x="50"
        y="60"
        textAnchor="middle"
        className="fill-[color:var(--color-text-tertiary)] text-[7px]"
      >
        {legenda}
      </text>
    </svg>
  );
}

/** Medidor radial de ticks (ref. Shopeers "Repeat Customer Rate"). */
export function GaugeChart({
  pct,
  centro,
  sub,
}: {
  pct: number;
  centro: string;
  sub: string;
}) {
  const ticks = 44;
  const cx = 100;
  const cy = 96;
  const rIn = 62;
  const rOut = 84;
  const filled = Math.round((Math.max(0, Math.min(100, pct)) / 100) * ticks);
  return (
    <svg viewBox="0 0 200 118" className="w-full" aria-hidden>
      {Array.from({ length: ticks }).map((_, i) => {
        const ang = Math.PI - (i / (ticks - 1)) * Math.PI;
        const x1 = cx + rIn * Math.cos(ang);
        const y1 = cy - rIn * Math.sin(ang);
        const x2 = cx + rOut * Math.cos(ang);
        const y2 = cy - rOut * Math.sin(ang);
        return (
          <line
            key={i}
            x1={x1.toFixed(1)}
            y1={y1.toFixed(1)}
            x2={x2.toFixed(1)}
            y2={y2.toFixed(1)}
            stroke={i < filled ? "var(--color-action-primary)" : "var(--color-border-hairline)"}
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}
      <text
        x="100"
        y="86"
        textAnchor="middle"
        className="fill-[color:var(--color-text-primary)] text-[24px] font-bold"
      >
        {centro}
      </text>
      <text
        x="100"
        y="104"
        textAnchor="middle"
        className="fill-[color:var(--color-text-tertiary)] text-[8px]"
      >
        {sub}
      </text>
    </svg>
  );
}
