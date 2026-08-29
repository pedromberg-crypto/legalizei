import { passosDoCliente } from "@/lib/passos";
import { CUSTOS, brl } from "@/lib/fiscal";
import { CLIENTE } from "@/app/(app)/dossie/mock";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * REFERÊNCIA V12 — "financial overview dashboard" (28/08, pedido do Pedro)
 * ═══════════════════════════════════════════════════════════════════════════
 * 12ª referência visual. SUBSTITUI a v11 (crypto wallet app,
 * `referencia-wallet-v11.tsx` — removida, mantida no repo desconectada) em
 * "Aplicação da referência". v1-v11 idem. Regra travada: cada referência
 * nova troca a anterior inteira, nunca acumula.
 *
 * Referência veio em mockup de DESKTOP (não celular) — mesma situação da
 * v8/v10: extraí a linguagem visual (cartão escuro com brilho laranja no
 * canto + rodapé de ações, cartão-vault trancado, anel percentual cheio,
 * linha estilo watchlist), aplicada dentro do aparelho de celular de sempre.
 *
 * O que tinha conteúdo REAL nosso pra preencher:
 *   · Cartão-herói escuro (brilho laranja + pill de status + rodapé com 2
 *     ações) → mensalidade/DAS.
 *   · Cartão-vault (cadeado + legenda) → o ÚNICO passo que realmente TRAVA
 *     até o pagamento cair (`travaSemPagamento`, "Revisar e confirmar") —
 *     dado real do modelo, não decoração.
 *   · Anel percentual cheio → só com o % real de progresso do dossiê.
 *   · Linha estilo watchlist (ícone+título+sub, valor à direita) → passos,
 *     inclusos, dados confirmados, notas recentes — SEM o delta % que a
 *     referência usa do lado do valor.
 *   · Badge circular de data (dia/mês) → data real de hoje, na saudação.
 *
 * ─── O QUE NÃO ENTROU, e por quê (sem inventar dado) ──────────────────────
 *   · SEM "Your wealth grew by +12%"/deltas de % em geral: exigiria
 *     histórico período-a-período que não temos pra quase nada aqui.
 *   · SEM "Cash Flow Analytics" (gráfico de área com tooltip, Year/Month/
 *     Week): não temos série temporal de receita/despesa do cliente.
 *   · SEM Watchlist de ações (Apple/Tesla): não é produto de investimento.
 *   · SEM busca "Search transactions...": não temos histórico de transação
 *     pesquisável nesse nível.
 *   · SEM "Premium Member"/avatar de usuário: não temos tier de conta.
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
  fundo: "#F1EEE7",
  cartao: "#FFFFFF",
  cartaoAlt: "#F5F2EA",
  textoPrimario: "#181613",
  textoSecundario: "#6D6A61",
  textoTerciario: "#A19C90",
  hairline: "#E7E2D6",
  sombra: "0 10px 26px rgba(24,22,19,0.06)",
};

const ESCURO: Paleta = {
  fundo: "#100F0C",
  cartao: "#1D1B17",
  cartaoAlt: "#262420",
  textoPrimario: "#F5F3EC",
  textoSecundario: "#ABA79E",
  textoTerciario: "#737065",
  hairline: "#312E28",
  sombra: "0 10px 26px rgba(0,0,0,0.5)",
};

function paletaDe(escuro: boolean): Paleta {
  return escuro ? ESCURO : CLARO;
}

const LARANJA = "#FF7A2E";
const VERDE = "#1E9E5C";
const PRETO_CARTAO = "#14120E";

/** Badge circular de data — dia/mês, sem inventar nada (data real de hoje). */
function BadgeData({ dia, mes }: { dia: string; mes: string }) {
  return (
    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full" style={{ background: PRETO_CARTAO }}>
      <span className="text-body-strong font-bold leading-none text-white">{dia}</span>
      <span className="text-[9px] font-semibold uppercase text-white/60">{mes}</span>
    </div>
  );
}

/** Cartão-herói escuro — brilho laranja no canto, pill de status, valor grande, rodapé de ações. */
function CartaoHeroiEscuro({
  status,
  legenda,
  valor,
  acoes,
}: {
  status: string;
  legenda: string;
  valor: string;
  acoes: string[];
}) {
  return (
    <div
      className="overflow-hidden rounded-[24px]"
      style={{ background: `radial-gradient(120% 100% at 100% 0%, ${LARANJA}55 0%, transparent 55%), ${PRETO_CARTAO}` }}
    >
      <div className="p-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-white">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: VERDE }} />
          {status}
        </span>
        <p className="mt-4 text-caption text-white/60">{legenda}</p>
        <p className="mt-1 text-h1 font-bold leading-tight text-white">{valor}</p>
      </div>
      <div className="flex border-t border-white/10">
        {acoes.map((a, i) => (
          <span
            key={a}
            className="flex-1 py-3 text-center text-caption font-bold text-white/80"
            style={i > 0 ? { borderLeft: "1px solid rgba(255,255,255,0.1)" } : undefined}
          >
            {a}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Cartão-estatística simples — ícone-badge + rótulo + valor. Sem delta forjado. */
function CartaoStatSimples({ p, icone, rotulo, valor }: { p: Paleta; icone: React.ReactNode; rotulo: string; valor: string }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: p.cartao, boxShadow: p.sombra }}>
      <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: p.cartaoAlt, color: p.textoSecundario }}>{icone}</span>
      <p className="mt-3 text-caption" style={{ color: p.textoTerciario }}>{rotulo}</p>
      <p className="mt-0.5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>{valor}</p>
    </div>
  );
}

/** Cartão-vault — cadeado + legenda. Só usado no passo que REALMENTE trava até o pagamento. */
function CartaoVault({ titulo, sub }: { titulo: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl p-4" style={{ background: PRETO_CARTAO }}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
        <IconeCadeado />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body-strong font-bold text-white">{titulo}</p>
        <p className="text-micro text-white/50">{sub}</p>
      </div>
    </div>
  );
}

/** Anel percentual cheio — só com % real. */
function AnelPercentual({ p, percentual, valor, legenda }: { p: Paleta; percentual: number; valor: string; legenda: string }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - percentual / 100);
  return (
    <div className="flex items-center gap-4 rounded-2xl p-4" style={{ background: p.cartao, boxShadow: p.sombra }}>
      <div className="relative shrink-0" style={{ width: 120, height: 120 }}>
        <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
          <circle cx="60" cy="60" r={r} fill="none" stroke={p.hairline} strokeWidth={10} />
          <circle cx="60" cy="60" r={r} fill="none" stroke={LARANJA} strokeWidth={10} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-h2 font-bold leading-none" style={{ color: p.textoPrimario }}>{Math.round(percentual)}%</span>
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>{valor}</p>
        <p className="text-micro" style={{ color: p.textoTerciario }}>{legenda}</p>
      </div>
    </div>
  );
}

/** Linha estilo watchlist — ícone-inicial + título+sub, valor à direita. Sem delta. */
function LinhaWatchlist({ p, inicial, titulo, sub, valor }: { p: Paleta; inicial: string; titulo: string; sub: string; valor?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl p-4" style={{ background: p.cartao, boxShadow: p.sombra }}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-caption font-bold text-white" style={{ background: PRETO_CARTAO }}>
        {inicial}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>{titulo}</p>
        <p className="text-micro" style={{ color: p.textoTerciario }}>{sub}</p>
      </div>
      {valor && <span className="shrink-0 text-body-strong font-bold" style={{ color: p.textoPrimario }}>{valor}</span>}
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
          <CartaoHeroiEscuro status="Sem taxa oculta" legenda="Mensalidade" valor={brl(mensalidade, true)} acoes={["Detalhes", "Continuar"]} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <CartaoStatSimples p={p} icone={<IconePredio />} rotulo="Taxa da Junta" valor={brl(taxa, true)} />
          <CartaoStatSimples p={p} icone={<IconeDoc />} rotulo="Honorário" valor="Grátis" />
        </div>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>O que está incluso</p>
        <div className="flex flex-col gap-2.5">
          <LinhaWatchlist p={p} inicial="AB" titulo="Abertura completa" sub="Documentação e CNPJ" />
          <LinhaWatchlist p={p} inicial="CD" titulo="Certificado digital" sub="Sem custo extra" />
          <LinhaWatchlist p={p} inicial="NF" titulo="Notas fiscais" sub="Sem limite de emissão" />
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
  const percentual = (concluidos / passos.length) * 100;

  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingTop: "calc(var(--safe-top) + 12px)" }}>
        <h1 className="text-h2 font-bold" style={{ color: p.textoPrimario }}>Bem-vindo de volta</h1>
        <p className="mt-1 text-caption" style={{ color: p.textoSecundario }}>Você saiu há 6 dias. Está tudo salvo.</p>

        <div className="mt-4">
          <AnelPercentual p={p} percentual={percentual} valor={`${concluidos} de ${passos.length}`} legenda="passos concluídos" />
        </div>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Onde você está</p>
        <div className="flex flex-col gap-2.5">
          {passos.map((passo, i) => {
            const feito = i < concluidos;
            const agora = i === concluidos;
            if (passo.travaSemPagamento && !feito) {
              return <CartaoVault key={passo.tela} titulo={passo.nome} sub="Trava até o pagamento da mensalidade cair" />;
            }
            return (
              <LinhaWatchlist
                key={passo.tela}
                p={p}
                inicial={String(i + 1)}
                titulo={passo.nome}
                sub={agora ? "Sua vez agora" : feito ? "Já preenchido" : `Passo ${i + 1}`}
              />
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

        <div className="mt-4">
          <CartaoHeroiEscuro status="Começar do zero" legenda="Abertura de CNPJ" valor="Quero abrir minha empresa" acoes={["Começar"]} />
        </div>

        <div className="mt-2.5">
          <LinhaWatchlist p={p} inicial="JT" titulo="Já tenho empresa" sub="Quero migrar a contabilidade" />
        </div>

        <div className="mt-4">
          <LinhaWatchlist p={p} inicial="LD" titulo="Legalize Digital" sub="Escritório em BH, 22 anos de experiência" valor="Conhecer" />
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

        <div className="mt-4 flex flex-col gap-2.5">
          <LinhaWatchlist p={p} inicial="NM" titulo={CLIENTE.nome} sub="Nome completo" />
          <LinhaWatchlist p={p} inicial="CPF" titulo={CLIENTE.cpf} sub="CPF" />
          <LinhaWatchlist p={p} inicial="TEL" titulo={CLIENTE.telefone} sub="Telefone" />
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
  const passos = passosDoCliente();
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingTop: "calc(var(--safe-top) + 12px)" }}>
        <div className="flex items-center gap-3">
          <BadgeData dia="28" mes="Ago" />
          <div className="min-w-0">
            <h1 className="text-h2 font-bold" style={{ color: p.textoPrimario }}>Bom dia, {CLIENTE.nome.split(" ")[0]}</h1>
            <p className="text-caption" style={{ color: p.textoSecundario }}>Está tudo em dia por aqui.</p>
          </div>
        </div>

        <div className="mt-4">
          <CartaoHeroiEscuro status="Vence em breve" legenda="Seu próximo compromisso · DAS" valor="R$ 178,31" acoes={["Ver guia", "Pagar"]} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <CartaoStatSimples p={p} icone={<IconeDoc />} rotulo="Mensalidade" valor={brl(CUSTOS.MENSALIDADE, true)} />
          <CartaoStatSimples p={p} icone={<IconeRaio />} rotulo="Notas emitidas" valor="3" />
        </div>

        <div className="mt-4">
          <AnelPercentual p={p} percentual={(2 / passos.length) * 100} valor={`2 de ${passos.length}`} legenda="passos concluídos" />
        </div>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Notas recentes</p>
        <div className="flex flex-col gap-2.5">
          <LinhaWatchlist p={p} inicial="MC" titulo="Maria Costa" sub="há 2h" valor="R$ 1.200" />
          <LinhaWatchlist p={p} inicial="JL" titulo="João Lima" sub="28/05" valor="R$ 3.000" />
          <LinhaWatchlist p={p} inicial="RS" titulo="Rita Souza" sub="24/05" valor="R$ 850" />
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
function IconeCadeado() {
  return (
    <svg {...iconeBase(18)}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function IconeDoc() {
  return (
    <svg {...iconeBase(16)}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  );
}
function IconeRaio() { return <svg {...iconeBase(16)}><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" /></svg>; }
function IconePredio() {
  return (
    <svg {...iconeBase(16)}>
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9v.01M9 12v.01M9 15v.01" />
    </svg>
  );
}
