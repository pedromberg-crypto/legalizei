/**
 * ═══════════════════════════════════════════════════════════════════════════
 * VALIDADOS — 1 aparelho só, pra acumular os pedaços aprovados (28/08, pedido
 * do Pedro: "começaram a aparecer alguns assets interessantes... crie uma
 * tela só de um aparelho pra gente ir colocando os assets que eu gostar").
 * ═══════════════════════════════════════════════════════════════════════════
 * Diferente de "Teste"/"Aplicação da referência" (que comparam telas
 * inteiras, sempre em par claro+escuro): aqui é 1 tela SÓ, que cresce peça
 * por peça conforme o Pedro aprova um elemento específico de alguma
 * referência (um chip, um botão, um cartão) — não uma referência inteira.
 *
 * 🆕 28/08 (pedido do Pedro) — cada asset SALVA a cor que foi aprovada
 * (`escuro: true/false` no descritor abaixo), mas o componente em si sempre
 * aceita `escuro?: boolean` — a versão que NÃO foi escolhida continua
 * existindo no código, só não aparece nesta tela (essa mostra só a cor
 * aprovada de cada peça, uma por uma, não as duas juntas).
 *
 * ⚠️ Assets aqui são cópias DELIBERADAS dos blocos da referência de origem —
 * não importam de `referencia-eventos-v4.tsx` porque essa referência pode
 * ser substituída/descartada a qualquer momento (regra travada da seção
 * "Aplicação da referência"); o que já foi validado tem que sobreviver a
 * isso.
 * ═══════════════════════════════════════════════════════════════════════════
 */

type Paleta = {
  cartao: string;
  cartaoAlt: string;
  textoPrimario: string;
  textoSecundario: string;
  textoTerciario: string;
  hairline: string;
};

const CLARO: Paleta = {
  cartao: "#FFFFFF",
  cartaoAlt: "#F4F4F6",
  textoPrimario: "#141414",
  textoSecundario: "#6B6B70",
  textoTerciario: "#9A9AA0",
  hairline: "#ECECEF",
};

const ESCURO: Paleta = {
  cartao: "#1A1A1D",
  cartaoAlt: "#232326",
  textoPrimario: "#F5F5F6",
  textoSecundario: "#AFAFB6",
  textoTerciario: "#77777E",
  hairline: "#2A2A2E",
};

function paletaDe(escuro: boolean): Paleta {
  return escuro ? ESCURO : CLARO;
}

const SOMBRA = "0 10px 28px rgba(20,23,18,0.06)";

/** "Cartão de saldo" — rótulo + valor grande + 2 metadados no rodapé. Origem:
 *  `ReferenciaHomeCampea`/`ReferenciaRetomar` (referência 5, `CartaoSaldo`). */
function CartaoSaldo({
  p,
  badge,
  marca,
  rotulo,
  valor,
  metaEsq,
  metaDir,
}: {
  p: Paleta;
  badge: React.ReactNode;
  marca: React.ReactNode;
  rotulo: string;
  valor: string;
  metaEsq: { rotulo: string; valor: string };
  metaDir: { rotulo: string; valor: string };
}) {
  return (
    <div className="rounded-[24px] p-5" style={{ background: p.cartao, boxShadow: SOMBRA }}>
      <div className="flex items-center justify-between">
        {badge}
        {marca}
      </div>
      <p className="mt-4 text-caption" style={{ color: p.textoTerciario }}>{rotulo}</p>
      <p className="text-h1 font-bold leading-tight" style={{ color: p.textoPrimario }}>{valor}</p>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-micro" style={{ color: p.textoTerciario }}>{metaEsq.rotulo}</p>
          <p className="text-caption font-semibold" style={{ color: p.textoPrimario }}>{metaEsq.valor}</p>
        </div>
        <div className="text-right">
          <p className="text-micro" style={{ color: p.textoTerciario }}>{metaDir.rotulo}</p>
          <p className="text-caption font-semibold" style={{ color: p.textoPrimario }}>{metaDir.valor}</p>
        </div>
      </div>
    </div>
  );
}

/* 🔄 28/08 (correção do Pedro) — era laranja fixo (#EF7B33) da referência 6;
   trocado pela nossa cor de marca de verdade (mesma var usada em qualquer
   outro lugar do produto). Nome da constante ficou, só o valor mudou. */
const LARANJA = "var(--color-action-primary)";

/** Botão laranja — CTA cheio, texto branco. Origem: referência 6 (analytics). */
function BotaoLaranja({ children }: { children: React.ReactNode }) {
  return (
    <span className="block w-full rounded-2xl py-4 text-center text-body font-bold text-white" style={{ background: LARANJA }}>
      {children}
    </span>
  );
}

/** Pill de dropdown decorativa. Origem: referência 6. */
function PillDropdown({ p, rotulo }: { p: Paleta; rotulo: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full px-3.5 py-2" style={{ background: p.cartaoAlt }}>
      <span className="text-caption font-semibold" style={{ color: p.textoPrimario }}>{rotulo}</span>
      <IconeChevronBaixo />
    </span>
  );
}

/** Mini-gauge (anel) — só usado em cima de % que já temos de verdade.
 *  Origem: referência 6. */
function MiniGauge({ pct, p }: { pct: number; p: Paleta }) {
  const tamanho = 56;
  const r = 22;
  const perimetro = 2 * Math.PI * r;
  const offset = perimetro * (1 - pct / 100);
  const meio = tamanho / 2;
  return (
    <svg width={tamanho} height={tamanho} viewBox={`0 0 ${tamanho} ${tamanho}`} className="shrink-0">
      <circle cx={meio} cy={meio} r={r} fill="none" stroke={p.hairline} strokeWidth={9} />
      <circle
        cx={meio}
        cy={meio}
        r={r}
        fill="none"
        stroke={LARANJA}
        strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray={perimetro}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${meio} ${meio})`}
      />
    </svg>
  );
}

/** Barras mini — a partir de valores REAIS (não série inventada). A maior
 *  barra vira laranja, o resto cinza. Origem: referência 6. */
function BarrasMini({ valores, p }: { valores: number[]; p: Paleta }) {
  const max = Math.max(...valores);
  return (
    <div className="flex h-12 items-end gap-1.5">
      {valores.map((v, i) => (
        <div key={i} className="w-3 rounded-full" style={{ height: `${Math.max(18, (v / max) * 100)}%`, background: v === max ? LARANJA : p.hairline }} />
      ))}
    </div>
  );
}

/** Cartão "ver mais" — título + seta de expandir, valor grande, legenda.
 *  Origem: referência 6. */
function CartaoExpansivel({
  p,
  titulo,
  valor,
  legenda,
  grafico,
}: {
  p: Paleta;
  titulo: string;
  valor: string;
  legenda: string;
  grafico?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl p-4" style={{ background: p.cartao, boxShadow: SOMBRA }}>
      <div className="flex items-center justify-between">
        <p className="text-caption font-semibold" style={{ color: p.textoPrimario }}>{titulo}</p>
        <span style={{ color: p.textoTerciario }}><IconeSetaDiagonal /></span>
      </div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-h1 font-bold leading-tight" style={{ color: p.textoPrimario }}>{valor}</p>
          <p className="mt-1 text-micro" style={{ color: p.textoTerciario }}>{legenda}</p>
        </div>
        {grafico}
      </div>
    </div>
  );
}

const GRADIENTE_CTA = "linear-gradient(120deg, var(--color-action-primary), var(--color-action-primary-hover))";

/** Textura decorativa de pontinhos, vazando de um canto — puramente
 *  ornamental. Origem: referência 7 (AI chat app). */
function TexturaPontos() {
  return (
    <div
      className="pointer-events-none absolute bottom-0 right-0 h-24 w-32 opacity-50"
      style={{
        background: "radial-gradient(circle, var(--color-action-primary) 1.2px, transparent 1.6px)",
        backgroundSize: "9px 9px",
        maskImage: "radial-gradient(circle at bottom right, black, transparent 75%)",
        WebkitMaskImage: "radial-gradient(circle at bottom right, black, transparent 75%)",
      }}
      aria-hidden
    />
  );
}

/** Cartão "status" — título + legenda + CTA gradiente, textura de pontinhos
 *  no canto. Origem: referência 7. */
function CartaoStatus({ p, titulo, legenda, cta }: { p: Paleta; titulo: string; legenda: string; cta: string }) {
  return (
    <div className="relative overflow-hidden rounded-[24px] p-5" style={{ background: p.cartao, boxShadow: SOMBRA }}>
      <TexturaPontos />
      <div className="relative">
        <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>{titulo}</p>
        <p className="mt-1 text-caption" style={{ color: p.textoTerciario }}>{legenda}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-caption font-bold text-white" style={{ background: GRADIENTE_CTA }}>
          {cta} <IconeSetaDireita />
        </span>
      </div>
    </div>
  );
}

/** Grade assimétrica "destaques" — 1 cartão grande + 2 pequenos empilhados.
 *  Origem: referência 7. */
function GradeDestaques({
  p,
  grande,
  pequenos,
}: {
  p: Paleta;
  grande: { titulo: string; sub: string; icone: React.ReactNode };
  pequenos: { titulo: string; icone: React.ReactNode }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <div className="rounded-2xl p-4" style={{ background: p.cartaoAlt }}>
        <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: p.cartao, color: p.textoPrimario }}>
          {grande.icone}
        </span>
        <p className="mt-3 text-body-strong font-bold" style={{ color: p.textoPrimario }}>{grande.titulo}</p>
        <p className="mt-1 text-micro" style={{ color: p.textoTerciario }}>{grande.sub}</p>
      </div>
      <div className="flex flex-col gap-2.5">
        {pequenos.map((it) => (
          <div key={it.titulo} className="flex flex-1 items-center gap-2.5 rounded-2xl p-3.5" style={{ background: p.cartaoAlt }}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: p.cartao, color: p.textoPrimario }}>
              {it.icone}
            </span>
            <p className="text-caption font-semibold" style={{ color: p.textoPrimario }}>{it.titulo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── ASSET 1 · Cabeçalho (saudação + sino/avatar + pill de CNPJ) ─────────── */
/** Origem: `ReferenciaHomeCampea` (referência 4), bloco 1 (`CabecalhoCampea` real). */
function AssetCabecalho({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-caption" style={{ color: p.textoTerciario }}>Bem-vinda de volta,</p>
          <p className="text-h2 font-bold" style={{ color: p.textoPrimario }}>Ana Beatriz</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ border: `1.5px solid ${p.hairline}`, color: p.textoPrimario }}>
            <IconeSino />
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full text-caption font-bold text-white" style={{ background: "var(--color-action-primary)" }}>AB</span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-full px-4 py-2.5" style={{ border: `1.5px solid ${p.hairline}` }}>
        <span className="text-caption font-semibold" style={{ color: p.textoSecundario }}>54.321.000/0001-09</span>
        <span style={{ color: p.textoTerciario }}><IconeCopiar /></span>
      </div>
    </div>
  );
}

/* ─── ASSET 2 · Atalhos rápidos (grade 2×2) ───────────────────────────────── */
/** Origem: `ReferenciaHomeCampea` (referência 4), bloco 3 (`AtalhosRapidos` real). */
const ATALHOS = [
  { titulo: "Emitir nota", sub: "Sua NF-e em segundos", icone: <IconeDoc />, ativo: true },
  { titulo: "Pagar imposto", sub: "O DAS do mês, no app", icone: <IconeCalendario /> },
  { titulo: "Meu pró-labore", sub: "Mexa e veja o imposto", icone: <IconeCarteira /> },
  { titulo: "Documentos", sub: "Contrato, certidões", icone: <IconePasta /> },
];

function AssetAtalhosRapidos({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div>
      <p className="mb-2.5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Atalhos rápidos</p>
      <div className="grid grid-cols-2 gap-2.5">
        {ATALHOS.map((a) => (
          <div
            key={a.titulo}
            className="rounded-2xl p-3.5"
            style={a.ativo ? { background: "var(--color-action-primary)" } : { background: p.cartaoAlt }}
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={a.ativo ? { background: "rgba(255,255,255,0.2)", color: "#fff" } : { background: p.cartao, color: p.textoPrimario }}
            >
              {a.icone}
            </span>
            <p className="mt-2.5 text-caption font-bold" style={{ color: a.ativo ? "#fff" : p.textoPrimario }}>{a.titulo}</p>
            <p className="text-micro" style={{ color: a.ativo ? "rgba(255,255,255,0.75)" : p.textoTerciario }}>{a.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── ASSET 3 · Cartão de saldo — DAS (próximo compromisso) + CTA "Pagar" ─── */
/** Origem: `ReferenciaHomeCampea` (referência 5), bloco 2 (`ProximoCompromisso` real). */
function AssetCartaoDAS({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div>
      <p className="mb-2.5 text-caption font-semibold" style={{ color: p.textoTerciario }}>Seu próximo compromisso</p>
      <CartaoSaldo
        p={p}
        badge={
          <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: p.cartaoAlt }}>
            <IconeCalendario />
            <span className="text-micro font-semibold" style={{ color: p.textoPrimario }}>Hoje</span>
          </span>
        }
        marca={<span className="text-caption font-bold" style={{ color: p.textoTerciario }}>DAS</span>}
        rotulo="DAS de junho"
        valor="R$ 178,31"
        metaEsq={{ rotulo: "Vence", valor: "20/07" }}
        metaDir={{ rotulo: "Status", valor: "Gerado" }}
      />
      <div className="mt-2.5">
        <BotaoLaranja>Pagar</BotaoLaranja>
      </div>
    </div>
  );
}

/* ─── ASSET 4 · Atalhos rápidos (fileira de círculos) ──────────────────────
   Mesmo CONTEÚDO do Asset 2, EXECUÇÃO diferente (referência 5: círculo +
   rótulo embaixo, sem cartão-tile colorido) — os 2 ficam salvos, execuções
   distintas do mesmo bloco real. */
const ATALHOS_CIRCULO = [
  { titulo: "Emitir nota", icone: <IconeDoc /> },
  { titulo: "Pagar imposto", icone: <IconeCalendario /> },
  { titulo: "Pró-labore", icone: <IconeCarteira /> },
  { titulo: "Documentos", icone: <IconePasta /> },
];

function AssetAtalhosCirculo({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div>
      <p className="mb-2.5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Atalhos rápidos (círculos)</p>
      <div className="flex items-start justify-between">
        {ATALHOS_CIRCULO.map((a) => (
          <div key={a.titulo} className="flex flex-col items-center gap-1.5">
            <span className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: p.cartaoAlt, color: p.textoPrimario }}>
              {a.icone}
            </span>
            <span className="text-micro font-semibold text-center" style={{ color: p.textoSecundario }}>{a.titulo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── ASSET 5 · Cartão de saldo — progresso da constituição ────────────────── */
/** Origem: `ReferenciaRetomar` (referência 5), o mesmo `CartaoSaldo` do
 *  asset 3, com dados de progresso no lugar de dados de cobrança. */
function AssetProgresso({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div>
      <p className="mb-2.5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Seu progresso</p>
      <CartaoSaldo
        p={p}
        badge={
          <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: p.cartaoAlt }}>
            <IconeBandeira />
            <span className="text-micro font-semibold" style={{ color: p.textoPrimario }}>Constituição</span>
          </span>
        }
        marca={<span className="text-caption font-bold" style={{ color: p.textoTerciario }}>20%</span>}
        rotulo="Você está em"
        valor="2 de 10 passos"
        metaEsq={{ rotulo: "Agora", valor: "CNAE principal da empresa" }}
        metaDir={{ rotulo: "Saiu há", valor: "6 dias" }}
      />
    </div>
  );
}

/* ─── ASSET 6 · Painel diário (gauges + notas + próximo compromisso) ──────── */
/** Origem: `ReferenciaHomeCampea` (referência 6) — pedaço composto, salvo
 *  inteiro porque é assim que o Pedro aprovou (print do bloco todo, não peça
 *  a peça): pill de data, alíquota/Fator R em mini-gauge, notas emitidas em
 *  barras (3 valores reais), próximo compromisso (DAS) + CTA "Pagar". */
const NOTAS_VALORES = [1200, 3000, 850];

function AssetPainelDiario({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div>
      <p className="mb-2.5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Painel diário</p>
      <div className="mb-2.5">
        <PillDropdown p={p} rotulo="Hoje · 28 ago" />
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl p-4" style={{ background: p.cartao, boxShadow: SOMBRA }}>
          <p className="text-caption font-semibold" style={{ color: p.textoPrimario }}>Sua alíquota</p>
          <p className="mt-2 text-h1 font-bold" style={{ color: p.textoPrimario }}>6%</p>
          <div className="mt-1"><MiniGauge pct={6} p={p} /></div>
        </div>
        <div className="rounded-2xl p-4" style={{ background: p.cartao, boxShadow: SOMBRA }}>
          <p className="text-caption font-semibold" style={{ color: p.textoPrimario }}>Fator R</p>
          <p className="mt-2 text-h1 font-bold" style={{ color: p.textoPrimario }}>37%</p>
          <div className="mt-1"><MiniGauge pct={37} p={p} /></div>
        </div>
      </div>
      <div className="mt-2.5">
        <CartaoExpansivel
          p={p}
          titulo="Notas emitidas"
          valor="3"
          legenda="Maria Costa, João Lima e Rita Souza este mês."
          grafico={<BarrasMini valores={NOTAS_VALORES} p={p} />}
        />
      </div>
      <div className="mt-2.5">
        <CartaoExpansivel p={p} titulo="Seu próximo compromisso" valor="R$ 178,31" legenda="DAS de junho, vence 20/07 — a gente já gerou." />
      </div>
      <div className="mt-2.5">
        <BotaoLaranja>Pagar</BotaoLaranja>
      </div>
    </div>
  );
}

/* ─── ASSET 7 · Título + grade assimétrica (Fork, referência 7) ───────────── */
/** Origem: `ReferenciaFork` (referência 7) — cabeçalho itálico + as 2 opções
 *  reais na grade "1 grande + 2 pequenos" (a 3ª caixinha, "Entrar na minha
 *  conta", já existe como link — aqui vira 3º item da grade, execução nova). */
function AssetGradeFork({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div>
      <h1 className="text-h1 font-bold italic leading-[1.05]" style={{ color: p.textoPrimario }}>Como podemos ajudar?</h1>
      <p className="mt-1 text-caption italic" style={{ color: p.textoTerciario }}>A parte chata fica com a gente</p>
      <div className="mt-4">
        <GradeDestaques
          p={p}
          grande={{ titulo: "Quero abrir minha empresa", sub: "Ainda não tenho CNPJ. Quero começar do zero.", icone: <IconeAviaozinho /> }}
          pequenos={[
            { titulo: "Já tenho empresa", icone: <IconePredio /> },
            { titulo: "Entrar na minha conta", icone: <IconePessoa /> },
          ]}
        />
      </div>
    </div>
  );
}

/* ─── ASSET 8 · Cartão-status (CTA gradiente + textura de pontinhos) ──────── */
/** Origem: `ReferenciaFork` (referência 7) — o "Um escritório de verdade,
 *  em BH", com CTA gradiente e a textura decorativa no canto. */
function AssetCartaoStatus({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div>
      <p className="mb-2.5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Cartão-status (CTA gradiente)</p>
      <CartaoStatus p={p} titulo="Um escritório de verdade, em BH" legenda="22 anos de experiência, agora no app." cta="Conhecer" />
    </div>
  );
}

/* ─── ASSET 9 · Atalhos rápidos (formato pasta) ────────────────────────────
   Mesmo CONTEÚDO real do Asset 2 (`ATALHOS`, reaproveitado direto — mesmos 4
   itens, mesmos ícones). Execução reescrita 3x (28/08, correções do Pedro):
   1ª tentativa (aba de pasta recortada) "replicava algo que já tínhamos
   feito"; 2ª tentativa (arco côncavo no canto) "parecia mordida, não ponta
   de pasta"; 3ª tentativa (chanfro reto, ponta viva) ainda "continua ruim".
   Pedro desenhou a forma exata no Illustrator e exportou (`pasta.png`) — o
   contorno real é: retângulo com bordas arredondadas nos 3 cantos normais
   (raio uniforme) + o 4º canto (superior direito) substituído por um
   CHANFRO RETO (uma diagonal só, sem curva no meio) que corta uma fatia
   BEM MAIOR que as tentativas anteriores (quase metade da borda superior,
   até quase metade da borda direita) — e as DUAS pontas onde essa diagonal
   encontra as bordas retas são arredondadas com o MESMO raio dos outros
   cantos, então a silhueta inteira lê como uma curva contínua e suave, sem
   nenhum ponto vivo em lugar nenhum. `contornoChanfroArredondado` calcula os
   2 filetes (fillet) nas pontas da diagonal via vetor unitário (mesma
   direção de giro — sweep=1 — dos outros 3 cantos, pra ficar tudo com a
   mesma "família" de curva). Sombra via `feDropShadow` do SVG (acompanha a
   silhueta real; box-shadow do CSS desenharia a sombra do retângulo cheio,
   ignorando o recorte). */
/** Tangente de um filete (fillet) num vértice qualquer, ÂNGULO NÃO
 *  necessariamente reto — a distância do vértice até cada ponto de tangência
 *  NÃO é `r` (isso só vale pra canto de 90°, os outros 3 cantos normais do
 *  cartão); é `r / tan(ângulo/2)`, onde ângulo é o quanto as 2 bordas se
 *  abrem no vértice. Usar `r` direto (o bug da versão anterior) desenha um
 *  arco maior que o correto, empurrando a curva pra fora — lê como
 *  "arredondando errado"/bolha, exatamente o que o Pedro apontou. */
function filete(
  vx: number,
  vy: number,
  dirVoltaX: number,
  dirVoltaY: number,
  dirFrenteX: number,
  dirFrenteY: number,
  r: number,
) {
  const cos = dirVoltaX * dirFrenteX + dirVoltaY * dirFrenteY;
  const angulo = Math.acos(Math.max(-1, Math.min(1, cos)));
  const t = r / Math.tan(angulo / 2);
  return {
    inicio: { x: vx + dirVoltaX * t, y: vy + dirVoltaY * t },
    fim: { x: vx + dirFrenteX * t, y: vy + dirFrenteY * t },
  };
}

function contornoChanfroArredondado({
  w,
  h,
  r,
  chanfroTopo,
  chanfroLateral,
  rChanfro,
}: {
  w: number;
  h: number;
  r: number;
  chanfroTopo: number;
  chanfroLateral: number;
  rChanfro: number;
}) {
  const v1x = w - chanfroTopo;
  const v1y = 0;
  const v2x = w;
  const v2y = chanfroLateral;
  const dx = v2x - v1x;
  const dy = v2y - v1y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;

  // Vértice 1 (borda de cima → diagonal): volta = pra esquerda (-1,0);
  // frente = ao longo da diagonal (ux,uy).
  const filete1 = filete(v1x, v1y, -1, 0, ux, uy, rChanfro);
  // Vértice 2 (diagonal → borda direita): volta = de volta pela diagonal
  // (-ux,-uy); frente = descendo a borda direita (0,1).
  const filete2 = filete(v2x, v2y, -ux, -uy, 0, 1, rChanfro);

  const n = (v: number) => Math.round(v * 100) / 100;

  return [
    `M0,${n(r)}`,
    `A${n(r)},${n(r)} 0 0 1 ${n(r)},0`,
    `L${n(filete1.inicio.x)},${n(filete1.inicio.y)}`,
    `A${n(rChanfro)},${n(rChanfro)} 0 0 1 ${n(filete1.fim.x)},${n(filete1.fim.y)}`,
    `L${n(filete2.inicio.x)},${n(filete2.inicio.y)}`,
    `A${n(rChanfro)},${n(rChanfro)} 0 0 1 ${n(filete2.fim.x)},${n(filete2.fim.y)}`,
    `L${n(w)},${n(h - r)}`,
    `A${n(r)},${n(r)} 0 0 1 ${n(w - r)},${n(h)}`,
    `L${n(r)},${n(h)}`,
    `A${n(r)},${n(r)} 0 0 1 0,${n(h - r)}`,
    "Z",
  ].join(" ");
}

/* 🔄 28/08 (correção do Pedro, `pasta2.png`) — nova proporção + bordas mais
   PRECISAS: raio bem mais fechado (era 14, quase 1/6 da altura — a
   referência nova é bem mais reta/crua nos 3 cantos normais), chanfro mais
   curto na borda de cima (corta ~30% dela, não ~53%) e um pouco mais raso na
   lateral (~34% da altura, não ~39%). */
const PASTA_W = 168;
const PASTA_H = 132;
const PASTA_R = 24;
const CAMINHO_PASTA = contornoChanfroArredondado({
  w: PASTA_W,
  h: PASTA_H,
  r: PASTA_R,
  chanfroTopo: PASTA_W * 0.3,
  chanfroLateral: PASTA_H * 0.34,
  rChanfro: PASTA_R,
});

function CardPasta({
  p,
  id,
  titulo,
  sub,
  icone,
  ativo,
}: {
  p: Paleta;
  id: string;
  titulo: string;
  sub: string;
  icone: React.ReactNode;
  ativo?: boolean;
}) {
  const filtroId = `sombra-pasta-${id}`;
  const gradienteId = `gradiente-pasta-${id}`;
  return (
    <div className="relative shrink-0" style={{ width: PASTA_W, height: PASTA_H }}>
      <svg width={PASTA_W} height={PASTA_H} viewBox={`0 0 ${PASTA_W} ${PASTA_H}`} className="absolute inset-0 overflow-visible">
        <defs>
          <filter id={filtroId} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="rgba(20,23,18,0.10)" />
          </filter>
          {/* Mesmo degradê do CTA de `CartaoStatus` (`GRADIENTE_CTA`) — CSS
             linear-gradient não é fill válido de SVG, precisa do gradiente
             nativo com os mesmos 2 stops. Só o card "ativo" usa. */}
          <linearGradient id={gradienteId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-action-primary)" />
            <stop offset="100%" stopColor="var(--color-action-primary-hover)" />
          </linearGradient>
        </defs>
        <path d={CAMINHO_PASTA} style={{ fill: ativo ? `url(#${gradienteId})` : "#FFFFFF" }} filter={`url(#${filtroId})`} />
      </svg>
      <div className="relative flex h-full flex-col px-4 py-3.5">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={
            ativo
              ? { background: "rgba(255,255,255,0.2)", color: "#fff" }
              : { background: "#FFFFFF", boxShadow: "0 2px 6px rgba(20,23,18,0.10)", color: p.textoPrimario }
          }
        >
          {icone}
        </span>
        <p className="mt-2.5 text-caption font-bold" style={{ color: ativo ? "#fff" : p.textoPrimario }}>{titulo}</p>
        <p className="mt-1 text-micro leading-snug" style={{ color: ativo ? "rgba(255,255,255,0.75)" : p.textoTerciario }}>{sub}</p>
      </div>
    </div>
  );
}

function AssetAtalhosPasta({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div>
      <p className="mb-2.5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Atalhos rápidos (formato pasta)</p>
      <div className="flex flex-wrap gap-2.5">
        {ATALHOS.map((a, i) => (
          <CardPasta key={a.titulo} p={p} id={`atalho-${i}`} titulo={a.titulo} sub={a.sub} icone={a.icone} ativo={a.ativo} />
        ))}
      </div>
    </div>
  );
}

/* ─── A COLEÇÃO — o `escuro` de cada chamada É a cor aprovada, guardada
   diretamente no código (não um campo separado que podia divergir do que
   de fato renderiza). ─────────────────────────────────────────────────── */
const ASSETS: { titulo: string; render: () => React.ReactNode }[] = [
  { titulo: "Cabeçalho (saudação + CNPJ)", render: () => <AssetCabecalho escuro={false} /> },
  { titulo: "Atalhos rápidos", render: () => <AssetAtalhosRapidos escuro={false} /> },
  { titulo: "Cartão de saldo — DAS + Pagar", render: () => <AssetCartaoDAS escuro={false} /> },
  { titulo: "Atalhos rápidos (círculos)", render: () => <AssetAtalhosCirculo escuro={false} /> },
  { titulo: "Cartão de saldo — progresso", render: () => <AssetProgresso escuro={false} /> },
  { titulo: "Painel diário (gauges + notas + compromisso)", render: () => <AssetPainelDiario escuro={false} /> },
  { titulo: "Título + grade do Fork", render: () => <AssetGradeFork escuro={false} /> },
  { titulo: "Cartão-status (CTA gradiente)", render: () => <AssetCartaoStatus escuro={false} /> },
  { titulo: "Atalhos rápidos (formato pasta)", render: () => <AssetAtalhosPasta escuro={false} /> },
];

export function Validados() {
  return (
    <div className="flex h-full flex-col bg-white">
      <header className="flex shrink-0 items-center justify-between px-6 pb-2" style={{ paddingTop: "var(--safe-top)" }}>
        <p className="text-body font-bold text-text-primary">Validados</p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {ASSETS.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <p className="text-caption text-text-tertiary">
              Ainda vazio. Manda o próximo asset que você gostou — ele entra aqui.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 pt-2">
            {ASSETS.map((a) => (
              <div key={a.titulo}>{a.render()}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── ÍCONES — traços simples, 24×24, stroke 2. ────────────────────────────── */
function iconeBase(tamanho = 18) {
  return {
    width: tamanho,
    height: tamanho,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}
function IconeSino() {
  return (
    <svg {...iconeBase(16)}>
      <path d="M6 8a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}
function IconeCopiar() {
  return (
    <svg {...iconeBase(16)}>
      <rect x="8" y="8" width="13" height="13" rx="2" />
      <path d="M4 16V4a2 2 0 0 1 2-2h10" />
    </svg>
  );
}
function IconeDoc() {
  return (
    <svg {...iconeBase(18)}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  );
}
function IconeCalendario() {
  return (
    <svg {...iconeBase(18)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}
function IconeCarteira() {
  return (
    <svg {...iconeBase(18)}>
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M16 14h2" />
    </svg>
  );
}
function IconePasta() {
  return <svg {...iconeBase(18)}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /></svg>;
}
function IconeBandeira() {
  return <svg {...iconeBase(16)}><path d="M4 21V4" /><path d="M4 5h13l-2 4 2 4H4" /></svg>;
}
function IconeChevronBaixo() {
  return <svg {...iconeBase(14)}><path d="m6 9 6 6 6-6" /></svg>;
}
function IconeSetaDiagonal() {
  return <svg {...iconeBase(16)}><path d="M7 17 17 7M7 7h10v10" /></svg>;
}
function IconeSetaDireita() {
  return <svg {...iconeBase(13)} strokeWidth={2.6}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}
function IconeAviaozinho() {
  return <svg {...iconeBase(18)} strokeWidth={1.7}><path d="m3 11 18-8-8 18-2-8-8-2Z" /></svg>;
}
function IconePredio() {
  return (
    <svg {...iconeBase(18)}>
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9v.01M9 12v.01M9 15v.01" />
    </svg>
  );
}
function IconePessoa() {
  return <svg {...iconeBase(18)}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6" /></svg>;
}
