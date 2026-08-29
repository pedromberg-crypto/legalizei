import { passosDoCliente } from "@/lib/passos";
import { CUSTOS, brl } from "@/lib/fiscal";
import { CLIENTE } from "@/app/(app)/dossie/mock";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * REFERÊNCIA V3 — "pet-care app" (28/08, pedido do Pedro: "essa pode descartar
 * a outra, não ficou legal")
 * ═══════════════════════════════════════════════════════════════════════════
 * 3ª referência visual. SUBSTITUI a v2 (Quora-like, `referencia-social-v2.tsx`
 * — descartada pelo Pedro, mantida no repo mas desconectada) na seção
 * "Aplicação da referência". v1 (interior design) também segue no repo,
 * desconectada — mesma regra travada: cada referência nova troca a anterior
 * inteira, nunca acumula.
 *
 * ─── O QUE A REFERÊNCIA ENSINA ─────────────────────────────────────────────
 *   · Fundo GRADIENTE saturado (roxo→dourado, diagonal) por trás de tudo —
 *     mais vívido que o pastel da v2.
 *   · A tela de verdade é um CARTÃO branco/creme flutuando INSETADO desse
 *     fundo — não edge-to-edge. O gradiente aparece como MOLDURA ao redor,
 *     não só como pano de fundo.
 *   · Tipografia bem preta, bem pesada, bem grande nos títulos.
 *   · Chips de fato em 3 cores pastéis chapadas (amarelo/menta/lilás),
 *     rótulo pequeno em cima + valor em negrito embaixo — não ícone-circular
 *     como nas 2 referências anteriores.
 *   · CTA = pílula PRETA sólida, sempre (nunca cor de marca) — reforça o
 *     contraste com os chips coloridos.
 *   · Botão de voltar = círculo PRETO com seta branca (não vidro, não
 *     contorno — sólido).
 *   · Anel de progresso com stroke em GRADIENTE pastel multicolor (não 1 cor
 *     só), % grande no centro.
 *   · Cartão-herói com efeito de "baralho" — 2º cartão espiando atrás,
 *     levemente girado — e um botão circular branco flutuando no canto,
 *     com seta ↗, meio para fora do cartão.
 *
 * ─── O QUE NÃO ENTROU, e por quê (sem inventar dado) ──────────────────────
 *   · SEM pills de categoria (All/Dogs/Cats/Birds): o Fork não tem categoria
 *     nenhuma pra filtrar nesse ponto do flow — forçar um filtro fake seria
 *     inventar produto.
 *   · SEM selo de avaliação (★4.9): não temos nota real. Número sem fonte
 *     não entra (regra dura).
 *   · SEM nav inferior: a própria referência não tem — as 3 telas dela são
 *     autônomas (Home/Detalhe/Atividade), sem barra de abas visível.
 *
 * ⚠️ Cores/gradientes de `PALETA` são EXPERIMENTAIS, locais deste arquivo.
 * ═══════════════════════════════════════════════════════════════════════════
 */

type Chip = { bg: string; texto: string };
type Paleta = {
  gradientePagina: string;
  cartao: string;
  textoPrimario: string;
  textoSecundario: string;
  textoTerciario: string;
  hairline: string;
  pillAtivoBg: string;
  pillAtivoTexto: string;
  ctaBg: string;
  ctaTexto: string;
  campoBg: string;
  amarelo: Chip;
  menta: Chip;
  lilas: Chip;
};

const CLARO: Paleta = {
  gradientePagina: "linear-gradient(135deg, #6B4FA0 0%, #B0699E 45%, #E0A85C 75%, #EBC24A 100%)",
  cartao: "#FAF8F4",
  textoPrimario: "#141414",
  textoSecundario: "#5B5B5B",
  textoTerciario: "#8C8C8C",
  hairline: "rgba(0,0,0,0.08)",
  pillAtivoBg: "#141414",
  pillAtivoTexto: "#FFFFFF",
  ctaBg: "#141414",
  ctaTexto: "#FFFFFF",
  campoBg: "#F0EDE7",
  amarelo: { bg: "#FCE9A6", texto: "#5B4A12" },
  menta: { bg: "#CDEFE1", texto: "#155B44" },
  lilas: { bg: "#E0D6F7", texto: "#4A3580" },
};

const ESCURO: Paleta = {
  gradientePagina: "linear-gradient(135deg, #3D2A5C 0%, #6B3E5C 45%, #8C5E2E 75%, #9C7A1E 100%)",
  cartao: "#1C1A22",
  textoPrimario: "#F5F3F0",
  textoSecundario: "#B7B2C4",
  textoTerciario: "#847F94",
  hairline: "rgba(255,255,255,0.1)",
  pillAtivoBg: "#F5F3F0",
  pillAtivoTexto: "#141414",
  ctaBg: "#F5F3F0",
  ctaTexto: "#141414",
  campoBg: "#26232E",
  amarelo: { bg: "#4A3D14", texto: "#F5D883" },
  menta: { bg: "#123A2C", texto: "#8DE8C8" },
  lilas: { bg: "#332A52", texto: "#CBB8F5" },
};

function paletaDe(escuro: boolean): Paleta {
  return escuro ? ESCURO : CLARO;
}

/** A "moldura" — gradiente saturado por trás, cartão inseto por cima. Toda
 *  tela desta referência usa este mesmo wrapper. */
function TelaCartao({ p, children }: { p: Paleta; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col" style={{ background: p.gradientePagina }}>
      <div
        className="flex h-full flex-col"
        style={{ paddingTop: "var(--safe-top)", paddingBottom: "calc(10px + var(--safe-bottom))", paddingInline: 12 }}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[30px]" style={{ background: p.cartao }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Círculo preto sólido (voltar) — não é vidro, é chapado. */
function BotaoVoltar({ p }: { p: Paleta }) {
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
      style={{ background: p.pillAtivoBg, color: p.pillAtivoTexto }}
    >
      <IconeChevronEsquerda />
    </span>
  );
}

/** Chip de fato — rótulo pequeno em cima, valor em negrito embaixo, cor chapada. */
function ChipFato({ rotulo, valor, cor }: { rotulo: string; valor: string; cor: Chip }) {
  return (
    <div className="flex-1 rounded-2xl p-3" style={{ background: cor.bg }}>
      <p className="text-micro" style={{ color: cor.texto, opacity: 0.75 }}>{rotulo}</p>
      <p className="text-body font-bold" style={{ color: cor.texto }}>{valor}</p>
    </div>
  );
}

/** Anel de progresso — stroke em gradiente pastel multicor (não 1 cor só). */
function AnelProgresso({ pct, p, escuro }: { pct: number; p: Paleta; escuro: boolean }) {
  const tamanho = 176;
  const raio = 72;
  const perimetro = 2 * Math.PI * raio;
  const offset = perimetro * (1 - pct / 100);
  const meio = tamanho / 2;
  const gradId = `anelGrad-${escuro ? "escuro" : "claro"}`;
  return (
    <svg width={tamanho} height={tamanho} viewBox={`0 0 ${tamanho} ${tamanho}`}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5B8D6" />
          <stop offset="35%" stopColor="#D6C0F5" />
          <stop offset="70%" stopColor="#B8D8F5" />
          <stop offset="100%" stopColor="#BEEFD4" />
        </linearGradient>
      </defs>
      <circle cx={meio} cy={meio} r={raio} fill="none" stroke={p.hairline} strokeWidth={14} />
      <circle
        cx={meio}
        cy={meio}
        r={raio}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={14}
        strokeLinecap="round"
        strokeDasharray={perimetro}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${meio} ${meio})`}
      />
      <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" fontSize={30} fontWeight={800} fill={p.textoPrimario}>
        {pct}%
      </text>
      <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" fontSize={13} fill={p.textoTerciario}>
        Completo
      </text>
    </svg>
  );
}

/* ─── 1. E3 · FORK · 3 ROTAS (modelo "Home") ───────────────────────────────── */

export function ReferenciaFork({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <TelaCartao p={p}>
      <div className="flex shrink-0 items-center justify-between px-5 pt-4">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: p.campoBg, color: p.textoPrimario }}
        >
          <IconePessoa />
        </span>
        <div className="flex items-center gap-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: p.pillAtivoBg, color: p.pillAtivoTexto }}
          >
            <IconeCheck />
          </span>
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ border: `1.5px solid ${p.hairline}`, color: p.textoPrimario }}
          >
            <IconeSino />
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <h1 className="text-h1 font-extrabold leading-[1.05]" style={{ color: p.textoPrimario }}>
          Como a gente pode te ajudar?
        </h1>
        <p className="mt-2 text-body" style={{ color: p.textoSecundario }}>
          A parte chata fica com a gente. Um escritório de contabilidade de verdade, em BH.
        </p>

        {/* CARTÃO-HERÓI COM BARALHO — 2º cartão espiando atrás, girado. */}
        <div className="relative mt-6" style={{ paddingBottom: 8 }}>
          <div
            className="absolute inset-x-3 top-3 h-full rounded-[26px]"
            style={{ background: p.amarelo.bg, transform: "rotate(-3deg)" }}
            aria-hidden
          />
          <div className="relative rounded-[26px] p-5" style={{ background: p.lilas.bg }}>
            <p className="text-h2 font-extrabold" style={{ color: p.lilas.texto }}>Quero abrir minha empresa</p>
            <p className="mt-1.5 text-caption" style={{ color: p.lilas.texto, opacity: 0.8 }}>
              Ainda não tenho CNPJ. Quero começar do zero.
            </p>
            <div className="mt-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: "rgba(255,255,255,0.4)" }}>
              <span style={{ color: p.lilas.texto }}><IconeAviaozinho /></span>
            </div>
            <span
              className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full shadow-md"
              style={{ background: p.cartao, color: p.textoPrimario }}
            >
              <IconeSetaDiagonal />
            </span>
          </div>
        </div>

        {/* 2ª opção — mesma família de cor do "peek" acima, aberta de verdade. */}
        <div className="mt-3 rounded-[22px] p-4" style={{ background: p.amarelo.bg }}>
          <p className="text-body font-bold" style={{ color: p.amarelo.texto }}>Já tenho empresa</p>
          <p className="mt-1 text-micro" style={{ color: p.amarelo.texto, opacity: 0.8 }}>
            Tenho CNPJ e quero que vocês cuidem da contabilidade.
          </p>
        </div>

        <p className="mt-5 text-center text-caption" style={{ color: p.textoSecundario }}>
          Já é cliente? <span className="font-bold" style={{ color: p.textoPrimario }}>Entrar na minha conta</span>
        </p>
      </div>
    </TelaCartao>
  );
}

/* ─── 2. N7 · A CONTA DA ABERTURA (modelo "Service Details") ──────────────── */

const INCLUSO_REF = ["Abertura completa", "Certificado digital", "Impostos em dia", "Notas sem limite"];

export function ReferenciaPlano({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  const mensalidade = CUSTOS.MENSALIDADE;
  return (
    <TelaCartao p={p}>
      <div className="flex shrink-0 items-center gap-3 px-5 pt-4">
        <BotaoVoltar p={p} />
        <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>A conta da abertura</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* CARTÃO DA "FOTO" — aqui, o resumo do plano no lugar da imagem. */}
        <div className="flex flex-col items-center rounded-2xl p-6" style={{ background: p.campoBg }}>
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: p.cartao, color: p.textoPrimario }}>
            <IconePredio />
          </span>
          <p className="mt-3 text-micro font-bold tracking-wide" style={{ color: p.textoTerciario }}>
            LEGALIZAI · ABERTURA DE EMPRESA
          </p>
        </div>

        <h2 className="mt-5 text-h1 font-extrabold leading-tight" style={{ color: p.textoPrimario }}>
          Quanto custa manter em dia
        </h2>

        <div className="mt-4 flex gap-2.5">
          <ChipFato rotulo="Mensalidade" valor={brl(mensalidade)} cor={p.amarelo} />
          <ChipFato rotulo="Taxa Junta" valor={brl(CUSTOS.DAE_JUCEMG, true)} cor={p.menta} />
          <ChipFato rotulo="Cobrança" valor="Mensal" cor={p.lilas} />
        </div>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>O que está incluso</p>
        <p className="text-caption" style={{ color: p.textoSecundario }}>
          A 1ª mensalidade já é o seu 1º mês. Sem letra miúda: honorário de abertura é R$0, a taxa da Junta vai direto
          pro Estado.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {INCLUSO_REF.map((item) => (
            <div key={item} className="rounded-2xl px-3.5 py-3" style={{ background: p.campoBg }}>
              <p className="text-caption font-semibold" style={{ color: p.textoPrimario }}>{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0 px-5 pb-4">
        <div className="mb-2.5 flex items-baseline justify-between">
          <span className="text-caption" style={{ color: p.textoTerciario }}>Você paga hoje</span>
          <span className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>{brl(mensalidade, true)}</span>
        </div>
        <span
          className="block w-full rounded-full py-4 text-center text-body font-bold"
          style={{ background: p.ctaBg, color: p.ctaTexto }}
        >
          Ótimo, continuar
        </span>
      </div>
    </TelaCartao>
  );
}

/* ─── 3. C0.1 · RETOMAR DE ONDE PAROU (modelo "Daily Activity") ───────────── */

export function ReferenciaRetomar({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  const passos = passosDoCliente();
  const concluidos = 2;
  const pct = Math.round((concluidos / passos.length) * 100);

  return (
    <TelaCartao p={p}>
      <div className="flex shrink-0 items-center gap-3 px-5 pt-4">
        <BotaoVoltar p={p} />
        <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>Retomar</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <p className="text-h2 font-extrabold" style={{ color: p.textoPrimario }}>Bem-vindo de volta</p>
        <p className="mt-1 text-caption" style={{ color: p.textoSecundario }}>Você saiu há 6 dias. Está tudo salvo.</p>

        <div className="mt-4 flex gap-2.5">
          <ChipFato rotulo="Concluídos" valor={`${concluidos} passos`} cor={p.amarelo} />
          <ChipFato rotulo="Restantes" valor={`${passos.length - concluidos} passos`} cor={p.lilas} />
        </div>

        <p className="mb-3 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Seu progresso</p>
        <div className="flex flex-col items-center rounded-2xl py-6" style={{ background: p.campoBg }}>
          <AnelProgresso pct={pct} p={p} escuro={escuro} />
          <p className="mt-1 text-caption" style={{ color: p.textoTerciario }}>
            {concluidos} de {passos.length} passos
          </p>
        </div>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Próximo passo</p>
        <div className="rounded-2xl p-4" style={{ background: p.menta.bg }}>
          <p className="text-body font-bold" style={{ color: p.menta.texto }}>
            {passos[concluidos]?.nome}
          </p>
        </div>
      </div>

      <div className="shrink-0 px-5 pb-4">
        <span
          className="block w-full rounded-full py-4 text-center text-body font-bold"
          style={{ background: p.ctaBg, color: p.ctaTexto }}
        >
          Continuar de onde parei
        </span>
        <p className="mt-3 text-center text-caption" style={{ color: p.textoTerciario }}>
          Ver detalhes completos
        </p>
      </div>
    </TelaCartao>
  );
}

/* ─── 4. C1 · SEUS DADOS (extensão do sistema pra campo de formulário) ─────── */

function CampoRef({ rotulo, placeholder, p }: { rotulo: string; placeholder: string; p: Paleta }) {
  return (
    <label className="block">
      <span className="text-caption font-semibold" style={{ color: p.textoPrimario }}>{rotulo}</span>
      <div className="mt-1.5 flex min-h-12 items-center rounded-2xl px-4 text-body" style={{ background: p.campoBg, color: p.textoTerciario }}>
        {placeholder}
      </div>
    </label>
  );
}

export function ReferenciaDadosPessoais({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <TelaCartao p={p}>
      <div className="flex shrink-0 items-center gap-3 px-5 pt-4">
        <BotaoVoltar p={p} />
        <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>Seus dados</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <h1 className="text-h1 font-extrabold leading-tight" style={{ color: p.textoPrimario }}>Seus dados</h1>
        <p className="mt-1 text-body" style={{ color: p.textoSecundario }}>Confira o que você já preencheu e complete o resto.</p>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Já preenchido</p>
        <div className="rounded-2xl" style={{ background: p.campoBg }}>
          {[
            { rotulo: "Nome", valor: CLIENTE.nome },
            { rotulo: "CPF", valor: CLIENTE.cpf },
            { rotulo: "Telefone", valor: CLIENTE.telefone },
            { rotulo: "Endereço", valor: CLIENTE.endereco },
          ].map((linha, idx) => (
            <div key={linha.rotulo} className="flex flex-col p-3.5" style={idx > 0 ? { borderTop: `1px solid ${p.hairline}` } : undefined}>
              <span className="text-micro" style={{ color: p.textoTerciario }}>{linha.rotulo}</span>
              <span className="text-body" style={{ color: p.textoPrimario }}>{linha.valor}</span>
            </div>
          ))}
        </div>

        <p className="mb-2.5 mt-6 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Falta completar</p>
        <div className="grid grid-cols-2 gap-3">
          <CampoRef rotulo="RG" placeholder="00.000.000" p={p} />
          <CampoRef rotulo="Órgão emissor" placeholder="SSP/MG" p={p} />
        </div>
        <div className="mt-3">
          <CampoRef rotulo="Data de nascimento" placeholder="DD/MM/AAAA" p={p} />
        </div>
        <div className="mt-3">
          <CampoRef rotulo="Nome da mãe" placeholder="Nome completo" p={p} />
        </div>
        <div className="mt-3">
          <label className="block">
            <span className="text-caption font-semibold" style={{ color: p.textoPrimario }}>Estado civil</span>
            <div className="mt-1.5 flex min-h-12 items-center justify-between rounded-2xl px-4 text-body" style={{ background: p.campoBg, color: p.textoTerciario }}>
              Selecione
              <IconeChevronBaixo />
            </div>
          </label>
        </div>
      </div>

      <div className="shrink-0 px-5 pb-4">
        <span
          className="block w-full rounded-full py-4 text-center text-body font-bold opacity-50"
          style={{ background: p.ctaBg, color: p.ctaTexto }}
        >
          Continuar
        </span>
      </div>
    </TelaCartao>
  );
}

/* ─── ÍCONES — traços simples, 24×24, stroke 2. ────────────────────────────── */

function iconeBase() {
  return {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}
function IconeChevronEsquerda() {
  return <svg {...iconeBase()} width={16} height={16}><path d="m15 18-6-6 6-6" /></svg>;
}
function IconeChevronBaixo() {
  return <svg {...iconeBase()} width={16} height={16}><path d="m6 9 6 6 6-6" /></svg>;
}
function IconeCheck() {
  return <svg {...iconeBase()} width={16} height={16} strokeWidth={2.6}><path d="m5 12 4.5 4.5L19 7" /></svg>;
}
function IconeSino() {
  return (
    <svg {...iconeBase()} width={16} height={16}>
      <path d="M6 8a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}
function IconePessoa() {
  return <svg {...iconeBase()}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6" /></svg>;
}
function IconePredio() {
  return (
    <svg {...iconeBase()} width={26} height={26}>
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9v.01M9 12v.01M9 15v.01" />
    </svg>
  );
}
function IconeAviaozinho() {
  return <svg {...iconeBase()} width={28} height={28} strokeWidth={1.6}><path d="m3 11 18-8-8 18-2-8-8-2Z" /></svg>;
}
function IconeSetaDiagonal() {
  return <svg {...iconeBase()} width={18} height={18}><path d="M7 17 17 7M7 7h10v10" /></svg>;
}
