import { passosDoCliente } from "@/lib/passos";
import { CUSTOS, brl } from "@/lib/fiscal";
import { CLIENTE } from "@/app/(app)/dossie/mock";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * REFERÊNCIA V10 — "call-center AI dashboard" (28/08, pedido do Pedro)
 * ═══════════════════════════════════════════════════════════════════════════
 * 10ª referência visual. SUBSTITUI a v9 (analytics/ticket-sales,
 * `referencia-analytics-v9.tsx` — removida, mantida no repo desconectada) em
 * "Aplicação da referência". v1-v9 idem. Regra travada: cada referência nova
 * troca a anterior inteira, nunca acumula.
 *
 * Referência veio em mockup de DESKTOP (monitor), não celular — mesma
 * situação da v8 ("grade de widgets", não telas prontas): extraí a
 * LINGUAGEM (cartão-estatística com dot-matrix, cartão-promo verde
 * degradê, linha com pill de status) e apliquei dentro do aparelho de
 * celular de sempre. Verde vira a cor-assinatura desta referência.
 *
 * O que tinha conteúdo REAL nosso pra preencher:
 *   · Cartão-estatística (rótulo + número grande + mini dot-matrix) → trio
 *     mensalidade/taxa/honorário, progresso do dossiê (2 de 10).
 *   · Cartão-promo (ícone + título + desc + botão, verde degradê) → resumo
 *     do plano, "quero abrir empresa", alerta de vencimento do DAS (data
 *     real).
 *   · Linha com pill de status → passos (Feito/Sua vez/Pendente), dados
 *     confirmados (Preenchido), fork (Migrar).
 *   · Breadcrumb do cabeçalho → navegação simples, sem dado nenhum.
 *
 * ─── O QUE NÃO ENTROU, e por quê (sem inventar dado) ──────────────────────
 *   · SEM "Ask AI anything": não temos chat com IA no produto.
 *   · SEM "Sentiment Analysis" + waveform de ligação: não é call center,
 *     não temos ligação nem análise de sentimento de nada.
 *   · SEM "24 agents on shift"/"Live Calls": não expomos equipe interna
 *     assim pro cliente, e não temos ligações ao vivo.
 *   · SEM deltas "+12 vs last week"/"+2.31%": exigiria série histórica
 *     semana-a-semana que não temos pra quase nenhuma métrica — os
 *     cartões-estatística aqui mostram só o número, sem comparação forjada.
 *   · SEM o cartão flutuante sobreposto (efeito de mockup de desktop): não
 *     cabe no aparelho de celular e não é motivo pra inventar 2º alerta.
 * ═══════════════════════════════════════════════════════════════════════════
 */

type Paleta = {
  fundo: string;
  cartao: string;
  cartaoAlt: string;
  textoPrimario: string;
  textoSecundario: string;
  textoTerciario: string;
  hairline: string;
  sombra: string;
};

const CLARO: Paleta = {
  fundo: "#F1F2ED",
  cartao: "#FFFFFF",
  cartaoAlt: "#EDEFE8",
  textoPrimario: "#15171A",
  textoSecundario: "#63665F",
  textoTerciario: "#97998F",
  hairline: "#E4E6DE",
  sombra: "0 10px 26px rgba(21,23,26,0.06)",
};

const ESCURO: Paleta = {
  fundo: "#12140F",
  cartao: "#1C1E17",
  cartaoAlt: "#242720",
  textoPrimario: "#F2F3ED",
  textoSecundario: "#ABAEA0",
  textoTerciario: "#72756A",
  hairline: "#2E3126",
  sombra: "0 10px 26px rgba(0,0,0,0.4)",
};

function paletaDe(escuro: boolean): Paleta {
  return escuro ? ESCURO : CLARO;
}

const VERDE = "#1F8A4C";
const VERDE_ESCURO = "#123A22";
const PRETO_PILL = "#14151E";

/** Migalha de navegação — só rótulo, sem dado. */
function Migalha({ p, trilha }: { p: Paleta; trilha: string }) {
  return <p className="text-micro" style={{ color: p.textoTerciario }}>{trilha}</p>;
}

/** Dot-matrix mini — grade de quadradinhos, `preenchidos` primeiros N coloridos. */
function DotMatrix({ total, preenchidos, cor }: { total: number; preenchidos: number; cor: string }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-[2px]"
          style={{ background: i < preenchidos ? cor : "currentColor", opacity: i < preenchidos ? 1 : 0.15 }}
        />
      ))}
    </div>
  );
}

/** Cartão-estatística — rótulo + número grande + dot-matrix. Sem delta forjado. */
function CartaoStat({ p, rotulo, valor, total, preenchidos }: { p: Paleta; rotulo: string; valor: string; total?: number; preenchidos?: number }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: p.cartao, boxShadow: p.sombra, color: p.textoTerciario }}>
      <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: p.textoTerciario }}>{rotulo}</p>
      <p className="mt-1 text-h2 font-bold leading-none" style={{ color: p.textoPrimario }}>{valor}</p>
      {total !== undefined && preenchidos !== undefined && <DotMatrix total={total} preenchidos={preenchidos} cor={VERDE} />}
    </div>
  );
}

/** Cartão-promo — verde degradê, ícone + título + desc + botão claro. */
function CartaoPromo({ icone, titulo, desc, cta }: { icone: React.ReactNode; titulo: string; desc: string; cta: string }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: `linear-gradient(135deg, ${VERDE} 0%, ${VERDE_ESCURO} 100%)` }}>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-white">{icone}</span>
      <p className="mt-3 text-body-strong font-bold leading-tight text-white">{titulo}</p>
      <p className="mt-1 text-caption text-white/75">{desc}</p>
      <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-caption font-bold" style={{ color: VERDE_ESCURO }}>
        {cta} <IconeSeta />
      </span>
    </div>
  );
}

/** Linha com pill de status — avatar-inicial + título+meta + pill colorida. */
function LinhaStatus({
  p,
  inicial,
  titulo,
  meta,
  pill,
  tom,
}: {
  p: Paleta;
  inicial: string;
  titulo: string;
  meta: string;
  pill: string;
  tom: "feito" | "agora" | "pendente";
}) {
  const cores = {
    feito: { bg: `${VERDE}1a`, cor: VERDE },
    agora: { bg: PRETO_PILL, cor: "#fff" },
    pendente: { bg: p.cartaoAlt, cor: p.textoTerciario },
  }[tom];
  return (
    <div className="flex items-center gap-3 rounded-2xl p-4" style={{ background: p.cartao, boxShadow: p.sombra }}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-caption font-bold text-white" style={{ background: PRETO_PILL }}>
        {inicial}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>{titulo}</p>
        <p className="text-micro" style={{ color: p.textoTerciario }}>{meta}</p>
      </div>
      <span className="shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold" style={{ background: cores.bg, color: cores.cor }}>{pill}</span>
    </div>
  );
}

/** Campo de formulário — cartãozinho, mesma família da referência. */
function CampoRef({ p, rotulo, placeholder }: { p: Paleta; rotulo: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="text-caption font-semibold" style={{ color: p.textoPrimario }}>{rotulo}</span>
      <div className="mt-1.5 flex min-h-12 items-center rounded-2xl px-4 text-body" style={{ background: p.cartao, boxShadow: p.sombra, color: p.textoTerciario }}>
        {placeholder}
      </div>
    </label>
  );
}

/* ─── 1. N7 · A CONTA DA ABERTURA ──────────────────────────────────────────── */

export function ReferenciaPlano({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  const mensalidade = CUSTOS.MENSALIDADE;
  const taxa = CUSTOS.DAE_JUCEMG;
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingTop: "calc(var(--safe-top) + 12px)" }}>
        <Migalha p={p} trilha="Legalizai / A conta da abertura" />
        <h1 className="mt-0.5 text-h2 font-bold" style={{ color: p.textoPrimario }}>Quanto custa manter em dia</h1>

        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <CartaoStat p={p} rotulo="Mensalidade" valor={brl(mensalidade, true)} />
          <CartaoStat p={p} rotulo="Taxa da Junta" valor={brl(taxa, true)} />
          <CartaoStat p={p} rotulo="Honorário" valor="Grátis" />
        </div>

        <div className="mt-4">
          <CartaoPromo icone={<IconePredio />} titulo="O que está incluso" desc="Abertura, certificado digital, guias e notas fiscais sem limite." cta="Ver detalhes" />
        </div>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Inclusos</p>
        <div className="flex flex-col gap-2.5">
          <LinhaStatus p={p} inicial="AB" titulo="Abertura completa" meta="Documentação e CNPJ" pill="Incluso" tom="feito" />
          <LinhaStatus p={p} inicial="CD" titulo="Certificado digital" meta="Sem custo extra" pill="Incluso" tom="feito" />
          <LinhaStatus p={p} inicial="IM" titulo="Impostos e guias" meta="Prontos todo mês" pill="Incluso" tom="feito" />
        </div>
      </div>
      <div className="shrink-0 px-5 pb-4">
        <span className="block w-full rounded-full py-4 text-center text-body font-bold text-white" style={{ background: VERDE }}>
          Continuar
        </span>
      </div>
    </div>
  );
}

/* ─── 2. C0.1 · RETOMAR DE ONDE PAROU ──────────────────────────────────────── */

export function ReferenciaRetomar({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  const passos = passosDoCliente();
  const concluidos = 2;

  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingTop: "calc(var(--safe-top) + 12px)" }}>
        <Migalha p={p} trilha="Legalizai / Retomar" />
        <h1 className="mt-0.5 text-h2 font-bold" style={{ color: p.textoPrimario }}>Bem-vindo de volta</h1>
        <p className="mt-1 text-caption" style={{ color: p.textoSecundario }}>Você saiu há 6 dias. Está tudo salvo.</p>

        <div className="mt-4">
          <CartaoStat p={p} rotulo="Progresso" valor={`${concluidos} de ${passos.length}`} total={passos.length} preenchidos={concluidos} />
        </div>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Onde você está</p>
        <div className="flex flex-col gap-2.5">
          {passos.map((passo, i) => {
            const feito = i < concluidos;
            const agora = i === concluidos;
            return (
              <LinhaStatus
                key={passo.tela}
                p={p}
                inicial={String(i + 1)}
                titulo={passo.nome}
                meta={feito ? "Já preenchido" : agora ? "Sua vez agora" : `Passo ${i + 1}`}
                pill={feito ? "Feito" : agora ? "Sua vez" : "Pendente"}
                tom={feito ? "feito" : agora ? "agora" : "pendente"}
              />
            );
          })}
        </div>
      </div>
      <div className="shrink-0 px-5 pb-4">
        <span className="block w-full rounded-full py-4 text-center text-body font-bold text-white" style={{ background: VERDE }}>
          Continuar de onde parei
        </span>
      </div>
    </div>
  );
}

/* ─── 3. E3 · FORK · 3 ROTAS ───────────────────────────────────────────────── */

export function ReferenciaFork({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingTop: "calc(var(--safe-top) + 12px)" }}>
        <Migalha p={p} trilha="Legalizai / Início" />
        <h1 className="mt-0.5 text-h2 font-bold" style={{ color: p.textoPrimario }}>Como a gente pode te ajudar?</h1>
        <p className="mt-1 text-caption" style={{ color: p.textoSecundario }}>A parte chata fica com a gente.</p>

        <div className="mt-4">
          <CartaoPromo icone={<IconePredio />} titulo="Quero abrir minha empresa" desc="Começar do zero, sem burocracia." cta="Começar" />
        </div>

        <div className="mt-2.5">
          <LinhaStatus p={p} inicial="JT" titulo="Já tenho empresa" meta="Tenho CNPJ, quero migrar a contabilidade" pill="Migrar" tom="pendente" />
        </div>

        <div className="mt-4">
          <LinhaStatus p={p} inicial="LD" titulo="Legalize Digital" meta="Escritório em BH, 22 anos de experiência" pill="Conhecer" tom="agora" />
        </div>

        <p className="mt-4 text-center text-caption" style={{ color: p.textoSecundario }}>
          Já é cliente? <span className="font-bold" style={{ color: p.textoPrimario }}>Entrar na minha conta</span>
        </p>
      </div>
    </div>
  );
}

/* ─── 4. C1 · SEUS DADOS ───────────────────────────────────────────────────── */

export function ReferenciaDadosPessoais({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingTop: "calc(var(--safe-top) + 12px)" }}>
        <Migalha p={p} trilha="Legalizai / Seus dados" />
        <h1 className="mt-0.5 text-h2 font-bold" style={{ color: p.textoPrimario }}>Seus dados</h1>
        <p className="mt-1 text-caption" style={{ color: p.textoSecundario }}>Confira o que já preencheu e complete o resto.</p>

        <div className="mt-4 flex flex-col gap-2.5">
          <LinhaStatus p={p} inicial="NM" titulo={CLIENTE.nome} meta="Nome completo" pill="Preenchido" tom="feito" />
          <LinhaStatus p={p} inicial="CPF" titulo={CLIENTE.cpf} meta="CPF" pill="Preenchido" tom="feito" />
          <LinhaStatus p={p} inicial="TEL" titulo={CLIENTE.telefone} meta="Telefone" pill="Preenchido" tom="feito" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <CampoRef p={p} rotulo="RG" placeholder="00.000.000" />
          <CampoRef p={p} rotulo="Órgão emissor" placeholder="SSP/MG" />
        </div>
        <div className="mt-2.5"><CampoRef p={p} rotulo="Data de nascimento" placeholder="DD/MM/AAAA" /></div>
        <div className="mt-2.5"><CampoRef p={p} rotulo="Nome da mãe" placeholder="Nome completo" /></div>
        <div className="mt-2.5"><CampoRef p={p} rotulo="Estado civil" placeholder="Selecione" /></div>
      </div>
      <div className="shrink-0 px-5 pb-4">
        <span className="block w-full rounded-full py-4 text-center text-body font-bold text-white opacity-50" style={{ background: VERDE }}>
          Continuar
        </span>
      </div>
    </div>
  );
}

/* ─── 5. HOME CAMPEÃ (dia-1) ───────────────────────────────────────────────── */

export function ReferenciaHomeCampea({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingTop: "calc(var(--safe-top) + 12px)" }}>
        <Migalha p={p} trilha="Legalizai / Início" />
        <h1 className="mt-0.5 text-h2 font-bold" style={{ color: p.textoPrimario }}>Bem-vinda de volta, {CLIENTE.nome.split(" ")[0]}</h1>

        <div className="mt-4">
          <CartaoPromo icone={<IconeDoc />} titulo="Seu DAS vence dia 20" desc="R$ 178,31 · Simples Nacional, referente a junho." cta="Pagar" />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <CartaoStat p={p} rotulo="Mensalidade" valor={brl(CUSTOS.MENSALIDADE, true)} />
          <CartaoStat p={p} rotulo="Notas emitidas" valor="3" />
          <CartaoStat p={p} rotulo="Progresso" valor={`2/${passosDoCliente().length}`} />
        </div>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Notas recentes</p>
        <div className="flex flex-col gap-2.5">
          <LinhaStatus p={p} inicial="MC" titulo="Maria Costa" meta="há 2h" pill="R$ 1.200" tom="feito" />
          <LinhaStatus p={p} inicial="JL" titulo="João Lima" meta="28/05" pill="R$ 3.000" tom="feito" />
          <LinhaStatus p={p} inicial="RS" titulo="Rita Souza" meta="24/05" pill="R$ 850" tom="feito" />
        </div>

        <div className="mt-4">
          <LinhaStatus p={p} inicial="CN" titulo="Contadores cuidando do seu CNPJ" meta="Impostos, declarações e prazos por nossa conta" pill="Falar" tom="agora" />
        </div>
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
function IconeSeta() { return <svg {...iconeBase(14)}><path d="M7 17 17 7M9 7h8v8" /></svg>; }
function IconeDoc() {
  return (
    <svg {...iconeBase(18)}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  );
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
