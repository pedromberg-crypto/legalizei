import { passosDoCliente } from "@/lib/passos";
import { CUSTOS, brl } from "@/lib/fiscal";
import { CLIENTE } from "@/app/(app)/dossie/mock";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * REFERÊNCIA V11 — "crypto wallet app" (28/08, pedido do Pedro)
 * ═══════════════════════════════════════════════════════════════════════════
 * 11ª referência visual. SUBSTITUI a v10 (call-center AI dashboard,
 * `referencia-callcenter-v10.tsx` — removida, mantida no repo desconectada)
 * em "Aplicação da referência". v1-v10 idem. Regra travada: cada referência
 * nova troca a anterior inteira, nunca acumula.
 *
 * O que tinha conteúdo REAL nosso pra preencher:
 *   · Onboarding/splash (fundo escuro degradê laranja, headline grande, 2
 *     botões + link) → o Fork (E3) É literalmente uma tela de "como
 *     começar", encaixe quase 1:1.
 *   · Barra segmentada (alocação por ativo) + legenda → as 3 notas reais
 *     (proporção entre elas), sem inventar 4º ativo.
 *   · Cartão-saldo (nome + valor grande) → mensalidade/DAS, SEM o delta
 *     verde ("+331%") que a referência usa (não temos histórico real).
 *   · Linha "fee breakdown" (rótulo + valor, hairline) → resumo de custos,
 *     dados confirmados, notas recentes.
 *   · Cartão "de/para" com ícone de troca flutuando entre os 2 → transição
 *     de passo atual pro próximo, no Retomar.
 *
 * ─── O QUE NÃO ENTROU, e por quê (sem inventar dado) ──────────────────────
 *   · SEM endereço de carteira (hash tipo "7d458ka...z081z"): não é produto
 *     cripto, não existe esse dado.
 *   · SEM deltas percentuais ("+5,93%", "+331%"): exigiria histórico de
 *     preço/mercado que não faz sentido pro nosso produto.
 *   · SEM barra de navegação inferior de 5 ícones: não temos 5 destinos
 *     globais validados, não vou inventar seção só pra preencher rodapé.
 *   · SEM "Spread"/"Gas fee" (termos de troca cripto): a versão de resumo
 *     usa só os custos reais (taxa da Junta, honorário, mensalidade).
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
  fundo: "#EFECE6",
  cartao: "#FFFFFF",
  cartaoAlt: "#F3F0E9",
  textoPrimario: "#171512",
  textoSecundario: "#6E6A62",
  textoTerciario: "#A19C92",
  hairline: "#E6E1D7",
  sombra: "0 10px 26px rgba(23,21,18,0.06)",
};

const ESCURO: Paleta = {
  fundo: "#0E0D0C",
  cartao: "#1B1917",
  cartaoAlt: "#242220",
  textoPrimario: "#F5F3EF",
  textoSecundario: "#ABA7A0",
  textoTerciario: "#726E67",
  hairline: "#302D29",
  sombra: "0 10px 26px rgba(0,0,0,0.5)",
};

function paletaDe(escuro: boolean): Paleta {
  return escuro ? ESCURO : CLARO;
}

const LARANJA = "#FF6A1A";
const PRETO_PILL = "#14120F";

/** Cartão-saldo — rótulo + valor grande. Sem delta (não temos histórico real). */
function CartaoSaldo({ p, legenda, valor }: { p: Paleta; legenda: string; valor: string }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: p.cartao, boxShadow: p.sombra }}>
      <p className="text-caption" style={{ color: p.textoTerciario }}>{legenda}</p>
      <p className="mt-1 text-h1 font-bold leading-tight" style={{ color: p.textoPrimario }}>{valor}</p>
    </div>
  );
}

/** Barra segmentada + legenda — só com valores reais e discretos (as 3 notas). */
function BarraSegmentada({ p, itens }: { p: Paleta; itens: { rotulo: string; valor: number; cor: string }[] }) {
  const total = itens.reduce((s, i) => s + i.valor, 0);
  return (
    <div className="rounded-2xl p-4" style={{ background: p.cartao, boxShadow: p.sombra }}>
      <div className="flex h-2 overflow-hidden rounded-full" style={{ background: p.cartaoAlt }}>
        {itens.map((i) => (
          <span key={i.rotulo} style={{ width: `${(i.valor / total) * 100}%`, background: i.cor }} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {itens.map((i) => (
          <span key={i.rotulo} className="flex items-center gap-1.5 text-micro" style={{ color: p.textoSecundario }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: i.cor }} />
            {i.rotulo}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Linha "fee breakdown" — rótulo + valor, hairline embaixo. */
function LinhaFee({ p, label, valor }: { p: Paleta; label: string; valor: string }) {
  return (
    <div className="flex items-center justify-between border-b py-3 last:border-b-0" style={{ borderColor: p.hairline }}>
      <span className="text-caption" style={{ color: p.textoSecundario }}>{label}</span>
      <span className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>{valor}</span>
    </div>
  );
}

/** Tile de ação — ícone em círculo + rótulo, pra grade 2-up (equivalente a Buy/Sell). */
function TileAcao({ p, icone, titulo }: { p: Paleta; icone: React.ReactNode; titulo: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl p-4" style={{ background: p.cartao, boxShadow: p.sombra }}>
      <span className="flex h-9 w-9 items-center justify-center rounded-full text-white" style={{ background: PRETO_PILL }}>{icone}</span>
      <p className="text-caption font-bold" style={{ color: p.textoPrimario }}>{titulo}</p>
    </div>
  );
}

/** Cartão "de/para" — 2 cartões empilhados com ícone de troca flutuando entre eles. */
function CartaoDePara({ p, de, para }: { p: Paleta; de: string; para: string }) {
  return (
    <div className="relative flex flex-col gap-2">
      <div className="rounded-2xl p-4" style={{ background: p.cartao, boxShadow: p.sombra }}>
        <p className="text-caption" style={{ color: p.textoTerciario }}>De onde você parou</p>
        <p className="mt-1 text-body-strong font-bold" style={{ color: p.textoPrimario }}>{de}</p>
      </div>
      <div className="rounded-2xl p-4" style={{ background: p.cartao, boxShadow: p.sombra }}>
        <p className="text-caption" style={{ color: p.textoTerciario }}>Pra onde você vai</p>
        <p className="mt-1 text-body-strong font-bold" style={{ color: p.textoPrimario }}>{para}</p>
      </div>
      <span
        className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white"
        style={{ background: LARANJA, boxShadow: "0 4px 12px rgba(255,106,26,0.4)" }}
      >
        <IconeTroca />
      </span>
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
        <p className="text-caption" style={{ color: p.textoTerciario }}>A conta da abertura</p>
        <h1 className="mt-0.5 text-h2 font-bold" style={{ color: p.textoPrimario }}>Quanto custa manter em dia</h1>

        <div className="mt-4">
          <CartaoSaldo p={p} legenda="Mensalidade" valor={brl(mensalidade, true)} />
        </div>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>O que está incluso</p>
        <div className="grid grid-cols-2 gap-2.5">
          <TileAcao p={p} icone={<IconePredio />} titulo="Abertura completa" />
          <TileAcao p={p} icone={<IconeCadeado />} titulo="Certificado digital" />
        </div>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Resumo</p>
        <div className="rounded-2xl px-3" style={{ background: p.cartao, boxShadow: p.sombra }}>
          <LinhaFee p={p} label="Taxa da Junta (governo)" valor={brl(taxa, true)} />
          <LinhaFee p={p} label="Honorário de abertura" valor="Grátis" />
          <LinhaFee p={p} label="Mensalidade, a partir do 1º mês" valor={brl(mensalidade, true)} />
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

  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingTop: "calc(var(--safe-top) + 12px)" }}>
        <h1 className="text-h2 font-bold" style={{ color: p.textoPrimario }}>Bem-vindo de volta</h1>
        <p className="mt-1 text-caption" style={{ color: p.textoSecundario }}>Você saiu há 6 dias. Está tudo salvo.</p>

        <div className="mt-6 mb-2">
          <CartaoDePara p={p} de={passos[concluidos - 1]?.nome ?? "—"} para={passos[concluidos]?.nome ?? "—"} />
        </div>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Onde você está</p>
        <div className="rounded-2xl px-3" style={{ background: p.cartao, boxShadow: p.sombra }}>
          {passos.map((passo, i) => {
            const feito = i < concluidos;
            const agora = i === concluidos;
            return (
              <LinhaFee key={passo.tela} p={p} label={passo.nome} valor={feito ? "Feito" : agora ? "Sua vez" : "—"} />
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

/* ─── 3. E3 · FORK · 3 ROTAS (splash/onboarding da referência) ─────────────── */

export function ReferenciaFork({ escuro = false }: { escuro?: boolean }) {
  // Hero sempre no degradê escuro-laranja da referência, igual nos 2 pares —
  // mesmo tratamento do `CartaoHeroi` da v8 (elemento que NUNCA muda com o tema).
  void escuro;
  return (
    <div
      className="flex h-full flex-col justify-between px-6 pb-6"
      style={{
        paddingTop: "calc(var(--safe-top) + 16px)",
        background: "radial-gradient(120% 70% at 50% 0%, #7A3308 0%, #1A0E05 45%, #0E0D0C 100%)",
      }}
    >
      <div>
        <p className="text-body-strong font-bold text-white">Legalizai</p>
        <span className="mt-8 inline-block rounded-full bg-white/10 px-3 py-1.5 text-micro font-semibold text-white/80">
          Abertura sem burocracia
        </span>
        <h1 className="mt-4 text-h1 font-bold leading-tight text-white">Como a gente pode te ajudar?</h1>
        <p className="mt-2 text-body text-white/60">Documentação, CNPJ e contabilidade, sem complicação.</p>
      </div>

      <div>
        <span className="block w-full rounded-full bg-white py-4 text-center text-body font-bold" style={{ color: PRETO_PILL }}>
          Quero abrir minha empresa
        </span>
        <span className="mt-2.5 block w-full rounded-full border border-white/20 py-4 text-center text-body font-bold text-white">
          Já tenho empresa
        </span>
        <p className="mt-4 text-center text-caption text-white/60">
          Já é cliente? <span className="font-bold text-white">Entrar na minha conta</span>
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
          <LinhaFee p={p} label="Nome completo" valor={CLIENTE.nome} />
          <LinhaFee p={p} label="CPF" valor={CLIENTE.cpf} />
          <LinhaFee p={p} label="Telefone" valor={CLIENTE.telefone} />
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
  const nome = CLIENTE.nome.split(" ")[0];
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingTop: "calc(var(--safe-top) + 12px)" }}>
        <h1 className="text-h2 font-bold" style={{ color: p.textoPrimario }}>Olá, {nome}!</h1>

        <p className="mb-2 mt-4 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Notas emitidas</p>
        <BarraSegmentada
          p={p}
          itens={[
            { rotulo: "Maria Costa · R$ 1.200", valor: 1200, cor: LARANJA },
            { rotulo: "João Lima · R$ 3.000", valor: 3000, cor: "#B0430F" },
            { rotulo: "Rita Souza · R$ 850", valor: 850, cor: p.textoTerciario },
          ]}
        />

        <div className="mt-4">
          <CartaoSaldo p={p} legenda="Seu próximo compromisso · DAS, vence 20/07" valor="R$ 178,31" />
        </div>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Atalhos rápidos</p>
        <div className="grid grid-cols-2 gap-2.5">
          <TileAcao p={p} icone={<IconeDoc />} titulo="Emitir nota" />
          <TileAcao p={p} icone={<IconeRaio />} titulo="Pagar imposto" />
        </div>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Notas recentes</p>
        <div className="rounded-2xl px-3" style={{ background: p.cartao, boxShadow: p.sombra }}>
          <LinhaFee p={p} label="Nota #0012 · Maria Costa" valor="R$ 1.200" />
          <LinhaFee p={p} label="Nota #0011 · João Lima" valor="R$ 3.000" />
          <LinhaFee p={p} label="Nota #0010 · Rita Souza" valor="R$ 850" />
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
function IconeTroca() { return <svg {...iconeBase(18)}><path d="M17 3v10M17 3l-4 4M17 3l4 4M7 21V11M7 21l-4-4M7 21l4-4" /></svg>; }
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
