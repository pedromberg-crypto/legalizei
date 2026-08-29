import { passosDoCliente } from "@/lib/passos";
import { CUSTOS, brl } from "@/lib/fiscal";
import { CLIENTE } from "@/app/(app)/dossie/mock";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * REFERÊNCIA V8 — "event ticketing app" (28/08, pedido do Pedro)
 * ═══════════════════════════════════════════════════════════════════════════
 * 8ª referência visual. SUBSTITUI a v7 (AI chat app, `referencia-ia-v7.tsx`
 * — removida, mantida no repo desconectada) em "Aplicação da referência".
 * v1-v6 idem. Regra travada: cada referência nova troca a anterior inteira,
 * nunca acumula.
 *
 * ⚠️ Essa referência veio como uma GRADE DE WIDGETS soltos (biblioteca de
 * componentes), não 3 telas de celular montadas — bem diferente das
 * anteriores. Escolhi os widgets que TÊM conteúdo real nosso pra preencher
 * (não forcei os 11 numa tela só):
 *   · Cartão-herói sólido (badge-data + título grande + legenda) → hero de
 *     preço/DAS.
 *   · "Ticket-row" (ícone-em-círculo + título+desc + valor à direita) →
 *     lista de inclusos/passos.
 *   · Calendário de mês, com a data real destacada → só onde temos data real
 *     (DAS vence 20/07 → aqui, ago/2026, hoje=28).
 *   · Cartão de confirmação (topo colorido com código/data + corpo branco
 *     com preço + 2 botões) → resumo final.
 *   · "Organizador" (avatar+nome+desc+Follow) → "Quem cuida de você".
 *
 * ─── O QUE NÃO ENTROU, e por quê (sem inventar dado) ──────────────────────
 *   · SEM "Ratings & Review" (5.0, 982 reviews): não temos avaliação real.
 *   · SEM "Get Direction"/mapa: abertura de empresa não tem endereço de
 *     evento pra navegar até.
 *   · SEM avatar-stack "9+ pessoas": não temos prova social de clientes.
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
  fundo: "#E4E7F0",
  cartao: "#FFFFFF",
  cartaoAlt: "#F1F2F8",
  textoPrimario: "#171826",
  textoSecundario: "#6B6E82",
  textoTerciario: "#9A9DB0",
  hairline: "#E4E5EF",
  sombra: "0 10px 26px rgba(23,24,38,0.06)",
};

const ESCURO: Paleta = {
  fundo: "#14151E",
  cartao: "#1F2030",
  cartaoAlt: "#282A3C",
  textoPrimario: "#F2F2F8",
  textoSecundario: "#ACAFC2",
  textoTerciario: "#72758A",
  hairline: "#31334A",
  sombra: "0 10px 26px rgba(0,0,0,0.4)",
};

function paletaDe(escuro: boolean): Paleta {
  return escuro ? ESCURO : CLARO;
}

const ROXO = "#6C5CE7";
const PRETO_PILL = "#14151E";

/** Cartão-herói sólido — badge-data + título grande + legenda. Sempre roxo
 *  sólido/texto branco, independente de `escuro` (mesmo tratamento do resto
 *  da referência: o cartão-herói NUNCA é claro). */
function CartaoHeroi({ dia, mes, legenda, titulo }: { dia: string; mes: string; legenda: string; titulo: string }) {
  return (
    <div className="rounded-[24px] p-5" style={{ background: ROXO }}>
      <div className="flex items-start gap-3">
        <div className="flex shrink-0 flex-col items-center justify-center rounded-full" style={{ background: PRETO_PILL, width: 52, height: 52 }}>
          <span className="text-body-strong font-bold leading-none text-white">{dia}</span>
          <span className="text-[10px] text-white/70">{mes}</span>
        </div>
        <div className="min-w-0 pt-0.5">
          <p className="text-caption text-white/70">{legenda}</p>
          <p className="mt-1 text-h1 font-bold leading-tight text-white">{titulo}</p>
        </div>
      </div>
    </div>
  );
}

/** "Ticket-row" — ícone-em-círculo + título+desc à esquerda, valor à direita. */
function TicketRow({ p, icone, titulo, sub, valor }: { p: Paleta; icone: React.ReactNode; titulo: string; sub: string; valor?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl p-4" style={{ background: p.cartao, boxShadow: p.sombra }}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ background: `${ROXO}1a`, color: ROXO }}>
        {icone}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>{titulo}</p>
        <p className="text-micro" style={{ color: p.textoTerciario }}>{sub}</p>
      </div>
      {valor && <span className="shrink-0 text-h2 font-bold" style={{ color: p.textoPrimario }}>{valor}</span>}
    </div>
  );
}

/** Calendário de mês — só usado em cima de data REAL (dia destacado). */
function CalendarioMes({ p, mesAno, hoje, marcado }: { p: Paleta; mesAno: string; hoje: number; marcado: number }) {
  const dias = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <div className="rounded-[24px] p-4" style={{ background: p.cartao, boxShadow: p.sombra }}>
      <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>{mesAno}</p>
      <div className="mt-3 grid grid-cols-7 gap-y-2 text-center">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
          <span key={i} className="text-micro font-semibold" style={{ color: p.textoTerciario }}>{d}</span>
        ))}
        {dias.map((d) => {
          const ehHoje = d === hoje;
          const ehMarcado = d === marcado;
          return (
            <span
              key={d}
              className="mx-auto flex h-7 w-7 items-center justify-center rounded-full text-micro font-semibold"
              style={
                ehMarcado
                  ? { background: "var(--color-action-primary)", color: "#fff" }
                  : ehHoje
                    ? { border: `1.5px solid ${ROXO}`, color: p.textoPrimario }
                    : { color: p.textoSecundario }
              }
            >
              {d}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** Cartão de confirmação — topo colorido (código/data) + corpo branco (preço
 *  + 2 botões). */
function CartaoConfirmacao({
  p,
  codigo,
  data,
  organizador,
  status,
  titulo,
  valor,
  cta1,
  cta2,
}: {
  p: Paleta;
  codigo: string;
  data: string;
  organizador: string;
  status: string;
  titulo: string;
  valor: string;
  cta1: string;
  cta2: string;
}) {
  return (
    <div className="overflow-hidden rounded-[24px]" style={{ boxShadow: p.sombra }}>
      <div className="flex items-center justify-between px-5 py-3" style={{ background: ROXO }}>
        <span className="text-caption font-bold text-white">{codigo}</span>
        <span className="text-caption font-semibold text-white/80">{data}</span>
      </div>
      <div className="p-5" style={{ background: p.cartao }}>
        <div className="flex items-center justify-between">
          <p className="text-caption" style={{ color: p.textoTerciario }}>{organizador}</p>
          <span className="rounded-full px-3 py-1 text-[10px] font-bold" style={{ background: `${ROXO}1a`, color: ROXO }}>{status}</span>
        </div>
        <p className="mt-1 text-h1 font-bold leading-tight" style={{ color: p.textoPrimario }}>{titulo}</p>
        <div className="mt-3 border-t border-dashed" style={{ borderColor: p.hairline }} />
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-h2 font-bold" style={{ color: p.textoPrimario }}>{valor}</span>
          <div className="flex gap-2">
            <span className="rounded-full px-4 py-2.5 text-caption font-bold" style={{ border: `1.5px solid ${p.hairline}`, color: p.textoPrimario }}>{cta1}</span>
            <span className="rounded-full px-4 py-2.5 text-caption font-bold text-white" style={{ background: PRETO_PILL }}>{cta2}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** "Organizador" — avatar/inicial + nome + desc + botão "Follow"-style. */
function LinhaOrganizador({ p, inicial, nome, desc, cta }: { p: Paleta; inicial: string; nome: string; desc: string; cta: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl p-4" style={{ background: p.cartao, boxShadow: p.sombra }}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-body-strong font-bold text-white" style={{ background: ROXO }}>
        {inicial}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>{nome}</p>
        <p className="text-micro" style={{ color: p.textoTerciario }}>{desc}</p>
      </div>
      <span className="shrink-0 rounded-full px-4 py-2 text-caption font-bold text-white" style={{ background: PRETO_PILL }}>{cta}</span>
    </div>
  );
}

/* ─── 1. N7 · A CONTA DA ABERTURA ──────────────────────────────────────────── */

const INCLUSO_REF = [
  { titulo: "Abertura completa", sub: "Documentação, contrato social, protocolo e CNPJ.", icone: <IconePredio /> },
  { titulo: "Certificado digital", sub: "Incluso, sem custo extra.", icone: <IconeCadeado /> },
  { titulo: "Impostos e declarações", sub: "Guia pronta todo mês, no prazo.", icone: <IconeDoc /> },
  { titulo: "Notas fiscais", sub: "Sem limite de emissão.", icone: <IconeRaio /> },
];

export function ReferenciaPlano({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  const mensalidade = CUSTOS.MENSALIDADE;
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingTop: "calc(var(--safe-top) + 12px)" }}>
        <p className="text-caption" style={{ color: p.textoTerciario }}>A conta da abertura</p>
        <h1 className="mt-0.5 text-h2 font-bold" style={{ color: p.textoPrimario }}>Quanto custa manter em dia</h1>

        <div className="mt-4">
          <CartaoHeroi dia="139" mes="R$/mês" legenda="Plano único · Legalizai" titulo="A mensalidade que cabe no seu bolso" />
        </div>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>O que está incluso</p>
        <div className="flex flex-col gap-2.5">
          {INCLUSO_REF.map((i) => (
            <TicketRow key={i.titulo} p={p} icone={i.icone} titulo={i.titulo} sub={i.sub} />
          ))}
        </div>

        <div className="mt-4">
          <CartaoConfirmacao
            p={p}
            codigo="PLANO · ÚNICO"
            data="Hoje"
            organizador="Legalizai"
            status="Sem taxa oculta"
            titulo="Você paga hoje"
            valor={brl(mensalidade, true)}
            cta1="Detalhes"
            cta2="Continuar"
          />
        </div>
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
        <h1 className="text-h2 font-bold" style={{ color: p.textoPrimario }}>Bem-vindo de volta</h1>
        <p className="mt-1 text-caption" style={{ color: p.textoSecundario }}>Você saiu há 6 dias. Está tudo salvo.</p>

        <div className="mt-4">
          <CartaoHeroi dia={String(concluidos)} mes={`de ${passos.length}`} legenda="Seu progresso" titulo={passos[concluidos]?.nome ?? "—"} />
        </div>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Onde você está</p>
        <div className="flex flex-col gap-2.5">
          {passos.map((passo, i) => {
            const feito = i < concluidos;
            const agora = i === concluidos;
            return (
              <TicketRow
                key={passo.tela}
                p={p}
                icone={feito ? <IconeCheck /> : <span className="text-caption font-bold">{i + 1}</span>}
                titulo={passo.nome}
                sub={agora ? "Sua vez agora" : feito ? "Já preenchido" : `Passo ${i + 1}`}
              />
            );
          })}
        </div>
      </div>
      <div className="shrink-0 px-5 pb-4">
        <span className="block w-full rounded-full py-4 text-center text-body font-bold text-white" style={{ background: ROXO }}>
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
        <h1 className="text-h2 font-bold" style={{ color: p.textoPrimario }}>Como a gente pode te ajudar?</h1>
        <p className="mt-1 text-caption" style={{ color: p.textoSecundario }}>A parte chata fica com a gente.</p>

        <div className="mt-4">
          <CartaoHeroi dia="0" mes="CNPJ" legenda="Começar do zero" titulo="Quero abrir minha empresa" />
        </div>

        <div className="mt-2.5">
          <TicketRow p={p} icone={<IconePredio2 />} titulo="Já tenho empresa" sub="Tenho CNPJ e quero que vocês cuidem da contabilidade." />
        </div>

        <div className="mt-4">
          <LinhaOrganizador p={p} inicial="LD" nome="Legalize Digital" desc="Escritório em BH, 22 anos de experiência." cta="Conhecer" />
        </div>

        <p className="mt-4 text-center text-caption" style={{ color: p.textoSecundario }}>
          Já é cliente? <span className="font-bold" style={{ color: p.textoPrimario }}>Entrar na minha conta</span>
        </p>
      </div>
    </div>
  );
}

/* ─── 4. C1 · SEUS DADOS ───────────────────────────────────────────────────── */

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

export function ReferenciaDadosPessoais({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingTop: "calc(var(--safe-top) + 12px)" }}>
        <h1 className="text-h2 font-bold" style={{ color: p.textoPrimario }}>Seus dados</h1>
        <p className="mt-1 text-caption" style={{ color: p.textoSecundario }}>Confira o que já preencheu e complete o resto.</p>

        <div className="mt-4 flex flex-col gap-2.5">
          <TicketRow p={p} icone={<IconePessoa />} titulo={CLIENTE.nome} sub="Nome completo" />
          <TicketRow p={p} icone={<IconeDoc />} titulo={CLIENTE.cpf} sub="CPF" />
          <TicketRow p={p} icone={<IconeTelefone />} titulo={CLIENTE.telefone} sub="Telefone" />
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
        <span className="block w-full rounded-full py-4 text-center text-body font-bold text-white opacity-50" style={{ background: ROXO }}>
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
        <h1 className="text-h2 font-bold" style={{ color: p.textoPrimario }}>Bem-vinda de volta, {CLIENTE.nome.split(" ")[0]}</h1>

        <div className="mt-4">
          <CalendarioMes p={p} mesAno="Agosto 2026" hoje={28} marcado={20} />
        </div>

        <div className="mt-4">
          <CartaoConfirmacao
            p={p}
            codigo="DAS · JUNHO"
            data="Vence 20/07"
            organizador="Simples Nacional"
            status="Gerado"
            titulo="Seu próximo compromisso"
            valor="R$ 178,31"
            cta1="Ver guia"
            cta2="Pagar"
          />
        </div>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Notas recentes</p>
        <div className="flex flex-col gap-2.5">
          <TicketRow p={p} icone={<IconeDoc />} titulo="Nota #0012 · Maria Costa" sub="há 2h" valor="R$ 1.200" />
          <TicketRow p={p} icone={<IconeDoc />} titulo="Nota #0011 · João Lima" sub="28/05" valor="R$ 3.000" />
        </div>

        <div className="mt-4">
          <LinhaOrganizador p={p} inicial="CN" nome="Contadores cuidando do seu CNPJ" desc="Impostos, declarações e prazos por nossa conta." cta="Falar" />
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
function IconeCheck() { return <svg {...iconeBase(18)} strokeWidth={2.6}><path d="m5 12 4.5 4.5L19 7" /></svg>; }
function IconeDoc() {
  return (
    <svg {...iconeBase(18)}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  );
}
function IconeCadeado() {
  return (
    <svg {...iconeBase(18)}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function IconeRaio() { return <svg {...iconeBase(18)}><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" /></svg>; }
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
function IconePredio2() {
  return (
    <svg {...iconeBase(18)}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h6" />
    </svg>
  );
}
function IconePessoa() { return <svg {...iconeBase(18)}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6" /></svg>; }
function IconeTelefone() {
  return (
    <svg {...iconeBase(18)}>
      <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1.1-.24 11.3 11.3 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.3 11.3 0 0 0 .56 3.5 1 1 0 0 1-.25 1.02Z" />
    </svg>
  );
}
