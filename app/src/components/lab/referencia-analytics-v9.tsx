import { passosDoCliente } from "@/lib/passos";
import { CUSTOS, brl } from "@/lib/fiscal";
import { CLIENTE } from "@/app/(app)/dossie/mock";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * REFERÊNCIA V9 — "B2B analytics/ticket-sales dashboard" (28/08, pedido do Pedro)
 * ═══════════════════════════════════════════════════════════════════════════
 * 9ª referência visual. SUBSTITUI a v8 (event ticketing app,
 * `referencia-ticketing-v8.tsx` — removida, mantida no repo desconectada) em
 * "Aplicação da referência". v1-v7 idem. Regra travada: cada referência nova
 * troca a anterior inteira, nunca acumula.
 *
 * Referência: laranja/marinho, MUITO carregada de gráfico (linha de
 * tendência+tooltip, gauge "Today's Increase", coortes de retenção em barra
 * espelhada, breakdown por país/plataforma, tabs Daily/Weekly/Monthly). O que
 * tinha conteúdo REAL nosso pra preencher:
 *   · "Hero-número" (número grande + seta de expandir + pill 'Detalhes') →
 *     preço/DAS.
 *   · Grade de "quick-action tiles" (ícone-em-círculo-escuro + rótulo 2
 *     linhas) → inclusos do plano / atalhos rápidos / fork.
 *   · Gauge (meio-donut) → só onde já existe UM percentual real (progresso
 *     do dossiê, concluídos/total).
 *   · Linhas de tabela (hairline, rótulo+valor) → resumo de custos, "onde
 *     você está", dados pessoais, notas recentes.
 *
 * ─── O QUE NÃO ENTROU, e por quê (sem inventar dado) ──────────────────────
 *   · SEM gráfico de linha/tendência com tooltip: exigiria série histórica
 *     (faturamento, vendas ao longo do tempo) que não temos.
 *   · SEM "User Retention Cohorts" (barra espelhada laranja/marinho, "40%
 *     After 8 month"): não temos coorte nem dado de retenção.
 *   · SEM breakdown por país (Top Performing Countries): não faz sentido,
 *     nosso negócio é BH/MG, não geográfico.
 *   · SEM pills de plataforma (Duckticket/Seevent/Ticketing): só existe UMA
 *     plataforma (o nosso app).
 *   · SEM tabs Daily/Weekly/Monthly/Annually: não temos views por janela de
 *     tempo pra alternar.
 *   · SEM pill de troca de organização (ícone+nome+contagem de membros):
 *     não é conta multi-empresa.
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
  fundo: "#EFEDE8",
  cartao: "#FFFFFF",
  cartaoAlt: "#F5F3EE",
  textoPrimario: "#181A22",
  textoSecundario: "#6E7080",
  textoTerciario: "#9A9CAA",
  hairline: "#E7E5DE",
  sombra: "0 10px 26px rgba(24,26,34,0.06)",
};

const ESCURO: Paleta = {
  fundo: "#12141F",
  cartao: "#1C1E2C",
  cartaoAlt: "#242637",
  textoPrimario: "#F3F2ED",
  textoSecundario: "#ABAEBE",
  textoTerciario: "#72758A",
  hairline: "#2E3044",
  sombra: "0 10px 26px rgba(0,0,0,0.4)",
};

function paletaDe(escuro: boolean): Paleta {
  return escuro ? ESCURO : CLARO;
}

const LARANJA = "#FF7A3D";
const PRETO_PILL = "#14151E";

/** Hero-número — legenda + valor grande + seta de expandir, pill "Detalhes" embaixo. */
function HeroNumero({ p, legenda, valor }: { p: Paleta; legenda: string; valor: string }) {
  return (
    <div className="rounded-[24px] p-5" style={{ background: p.cartao, boxShadow: p.sombra }}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-caption" style={{ color: p.textoTerciario }}>{legenda}</p>
        <span style={{ color: p.textoTerciario }}><IconeSeta /></span>
      </div>
      <p className="mt-1 text-h1 font-bold leading-tight" style={{ color: p.textoPrimario }}>{valor}</p>
      <span
        className="mt-3 inline-block rounded-full px-4 py-2 text-caption font-bold"
        style={{ border: `1.5px solid ${p.hairline}`, color: p.textoPrimario }}
      >
        Detalhes
      </span>
    </div>
  );
}

/** Quick-action tile — ícone em círculo escuro + rótulo (2 linhas), pra grade. */
function TileAcao({ p, icone, titulo, sub }: { p: Paleta; icone: React.ReactNode; titulo: string; sub?: string }) {
  return (
    <div className="flex flex-col gap-2.5 rounded-2xl p-4" style={{ background: p.cartao, boxShadow: p.sombra }}>
      <span className="flex h-10 w-10 items-center justify-center rounded-full text-white" style={{ background: PRETO_PILL }}>
        {icone}
      </span>
      <div>
        <p className="text-caption font-bold leading-tight" style={{ color: p.textoPrimario }}>{titulo}</p>
        {sub && <p className="mt-0.5 text-micro" style={{ color: p.textoTerciario }}>{sub}</p>}
      </div>
    </div>
  );
}

/** Gauge meio-donut — só usado em cima de UM percentual real (progresso do dossiê). */
function GaugeMeio({ p, percentual, valor, legenda }: { p: Paleta; percentual: number; valor: string; legenda: string }) {
  const r = 70;
  const circ = Math.PI * r;
  const off = circ * (1 - percentual / 100);
  return (
    <div className="rounded-[24px] p-5" style={{ background: p.cartao, boxShadow: p.sombra }}>
      <div className="relative mx-auto" style={{ width: 180, height: 100 }}>
        <svg width="180" height="100" viewBox="0 0 180 100" className="absolute inset-0">
          <path d={`M 20 90 A ${r} ${r} 0 0 1 160 90`} fill="none" stroke={p.hairline} strokeWidth={14} strokeLinecap="round" />
          <path
            d={`M 20 90 A ${r} ${r} 0 0 1 160 90`}
            fill="none"
            stroke={LARANJA}
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={off}
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center">
          <p className="text-h1 font-bold leading-none" style={{ color: p.textoPrimario }}>{valor}</p>
          <p className="mt-1 text-micro" style={{ color: p.textoTerciario }}>{legenda}</p>
        </div>
      </div>
    </div>
  );
}

/** Linha de tabela — hairline, rótulo à esquerda, valor(es) à direita. */
function LinhaTabela({ p, label, valor, valor2 }: { p: Paleta; label: string; valor: string; valor2?: string }) {
  return (
    <div className="flex items-center justify-between border-b py-3 last:border-b-0" style={{ borderColor: p.hairline }}>
      <span className="min-w-0 flex-1 truncate pr-3 text-caption" style={{ color: p.textoSecundario }}>{label}</span>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>{valor}</span>
        {valor2 && <span className="text-micro" style={{ color: p.textoTerciario }}>{valor2}</span>}
      </div>
    </div>
  );
}

/** "Organizador" — avatar/inicial + nome + desc + botão. Mesma família da v8. */
function LinhaOrganizador({ p, inicial, nome, desc, cta }: { p: Paleta; inicial: string; nome: string; desc: string; cta: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl p-4" style={{ background: p.cartao, boxShadow: p.sombra }}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-body-strong font-bold text-white" style={{ background: PRETO_PILL }}>
        {inicial}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>{nome}</p>
        <p className="text-micro" style={{ color: p.textoTerciario }}>{desc}</p>
      </div>
      <span className="shrink-0 rounded-full px-4 py-2 text-caption font-bold text-white" style={{ background: LARANJA }}>{cta}</span>
    </div>
  );
}

/** Campo de formulário — cartãozinho, mesma família visual da referência. */
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

const INCLUSO_REF = [
  { titulo: "Abertura completa", sub: "Documentação e CNPJ", icone: <IconePredio /> },
  { titulo: "Certificado digital", sub: "Sem custo extra", icone: <IconeCadeado /> },
  { titulo: "Impostos e guias", sub: "Prontos todo mês", icone: <IconeDoc /> },
  { titulo: "Notas fiscais", sub: "Sem limite", icone: <IconeRaio /> },
];

export function ReferenciaPlano({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  const mensalidade = CUSTOS.MENSALIDADE;
  const taxa = CUSTOS.DAE_JUCEMG;
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingTop: "calc(var(--safe-top) + 12px)" }}>
        <p className="text-caption" style={{ color: p.textoTerciario }}>A conta da abertura</p>
        <h1 className="mt-0.5 text-h2 font-bold" style={{ color: p.textoPrimario }}>Quanto custa manter em dia</h1>

        <div className="mt-4">
          <HeroNumero p={p} legenda="Mensalidade" valor={brl(mensalidade, true)} />
        </div>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>O que está incluso</p>
        <div className="grid grid-cols-2 gap-2.5">
          {INCLUSO_REF.map((i) => (
            <TileAcao key={i.titulo} p={p} icone={i.icone} titulo={i.titulo} sub={i.sub} />
          ))}
        </div>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Resumo</p>
        <div className="rounded-2xl px-3" style={{ background: p.cartao, boxShadow: p.sombra }}>
          <LinhaTabela p={p} label="Taxa da Junta (governo)" valor={brl(taxa, true)} />
          <LinhaTabela p={p} label="Honorário de abertura" valor="Grátis" />
          <LinhaTabela p={p} label="Mensalidade, a partir do 1º mês" valor={brl(mensalidade, true)} />
        </div>
      </div>
      <div className="shrink-0 px-5 pb-4">
        <span className="block w-full rounded-full py-4 text-center text-body font-bold text-white" style={{ background: LARANJA }}>
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
  const percentual = Math.round((concluidos / passos.length) * 100);

  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingTop: "calc(var(--safe-top) + 12px)" }}>
        <h1 className="text-h2 font-bold" style={{ color: p.textoPrimario }}>Bem-vindo de volta</h1>
        <p className="mt-1 text-caption" style={{ color: p.textoSecundario }}>Você saiu há 6 dias. Está tudo salvo.</p>

        <div className="mt-4">
          <GaugeMeio p={p} percentual={percentual} valor={`${concluidos} de ${passos.length}`} legenda="passos concluídos" />
        </div>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Onde você está</p>
        <div className="rounded-2xl px-3" style={{ background: p.cartao, boxShadow: p.sombra }}>
          {passos.map((passo, i) => {
            const feito = i < concluidos;
            const agora = i === concluidos;
            return (
              <LinhaTabela key={passo.tela} p={p} label={passo.nome} valor={feito ? "Feito" : agora ? "Sua vez" : "—"} />
            );
          })}
        </div>
      </div>
      <div className="shrink-0 px-5 pb-4">
        <span className="block w-full rounded-full py-4 text-center text-body font-bold text-white" style={{ background: LARANJA }}>
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

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <TileAcao p={p} icone={<IconePredio />} titulo="Quero abrir minha empresa" sub="Começar do zero" />
          <TileAcao p={p} icone={<IconePredio2 />} titulo="Já tenho empresa" sub="Migrar a contabilidade" />
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

export function ReferenciaDadosPessoais({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingTop: "calc(var(--safe-top) + 12px)" }}>
        <h1 className="text-h2 font-bold" style={{ color: p.textoPrimario }}>Seus dados</h1>
        <p className="mt-1 text-caption" style={{ color: p.textoSecundario }}>Confira o que já preencheu e complete o resto.</p>

        <div className="mt-4 rounded-2xl px-3" style={{ background: p.cartao, boxShadow: p.sombra }}>
          <LinhaTabela p={p} label="Nome completo" valor={CLIENTE.nome} />
          <LinhaTabela p={p} label="CPF" valor={CLIENTE.cpf} />
          <LinhaTabela p={p} label="Telefone" valor={CLIENTE.telefone} />
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
        <span className="block w-full rounded-full py-4 text-center text-body font-bold text-white opacity-50" style={{ background: LARANJA }}>
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
          <HeroNumero p={p} legenda="Seu próximo compromisso · DAS, vence 20/07" valor="R$ 178,31" />
        </div>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Atalhos rápidos</p>
        <div className="grid grid-cols-2 gap-2.5">
          <TileAcao p={p} icone={<IconeDoc />} titulo="Emitir nota" />
          <TileAcao p={p} icone={<IconeRaio />} titulo="Pagar imposto" />
          <TileAcao p={p} icone={<IconePessoa />} titulo="Meu pró-labore" />
          <TileAcao p={p} icone={<IconeCadeado />} titulo="Documentos" />
        </div>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Notas recentes</p>
        <div className="rounded-2xl px-3" style={{ background: p.cartao, boxShadow: p.sombra }}>
          <LinhaTabela p={p} label="Nota #0012 · Maria Costa" valor="R$ 1.200" valor2="há 2h" />
          <LinhaTabela p={p} label="Nota #0011 · João Lima" valor="R$ 3.000" valor2="28/05" />
          <LinhaTabela p={p} label="Nota #0010 · Rita Souza" valor="R$ 850" valor2="24/05" />
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
function IconeSeta() { return <svg {...iconeBase(16)}><path d="M7 17 17 7M9 7h8v8" /></svg>; }
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
