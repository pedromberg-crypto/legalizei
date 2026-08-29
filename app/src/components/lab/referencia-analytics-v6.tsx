import { passosDoCliente } from "@/lib/passos";
import { CUSTOS, brl } from "@/lib/fiscal";
import { CLIENTE } from "@/app/(app)/dossie/mock";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * REFERÊNCIA V6 — "social media analytics dashboard" (28/08, pedido do Pedro)
 * ═══════════════════════════════════════════════════════════════════════════
 * 6ª referência visual. SUBSTITUI a v5 (Payoutly/fintech,
 * `referencia-fintech-v5.tsx` — removida, mantida no repo desconectada) em
 * "Aplicação da referência". v1-v4 idem. Regra travada: cada referência nova
 * troca a anterior inteira, nunca acumula.
 *
 * ─── O QUE A REFERÊNCIA ENSINA ─────────────────────────────────────────────
 *   · Fundo BEGE quente chapado (não branco, não gradiente).
 *   · Botões circulares BRANCOS flutuando direto no fundo (sem barra de
 *     header) — busca/sino/avatar/voltar, todos a mesma casca.
 *   · Título GRANDE, preto, bem pesado, 2 linhas.
 *   · Pill de dropdown (rótulo + seta) — decorativo aqui, sem estado real.
 *   · Cartão com GRÁFICO: valor grande + legenda + mini-gráfico (barra,
 *     gauge/anel ou linha) — sempre com ícone de "expandir" (seta) no canto
 *     quando é um cartão "ver mais".
 *   · Fileira de 2-3 cartões de estatística lado a lado (valor + rótulo).
 *   · Nav inferior: botões flutuando na barra, ativo ganha CÍRCULO LARANJA
 *     sólido atrás do ícone (mais discreto que o FAB grande das v4/v5).
 *
 * ─── O QUE NÃO ENTROU, e por quê (sem inventar dado) ──────────────────────
 *   · SEM gráfico de LINHA/tendência histórica: não temos série temporal real
 *     (evolução de faturamento/atividade mês a mês) — um gráfico de linha
 *     aqui seria número inventado. Onde a referência usa linha, usei um fato
 *     REAL sem forma de tendência (lista, barra a partir de 3 notas reais).
 *   · SEM legenda dupla ("Impressions × Net sales"): não temos 2 séries reais
 *     pra comparar.
 *   · Gauge/anel só aparece em cima de % que JÁ temos (alíquota, Fator R,
 *     teto do Simples) — nunca decorativo puro.
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
  fundo: "#F1EEE8",
  cartao: "#FFFFFF",
  cartaoAlt: "#F5F2EB",
  textoPrimario: "#18160F",
  textoSecundario: "#6E6A60",
  textoTerciario: "#9C978D",
  hairline: "#E8E3D7",
  sombra: "0 10px 26px rgba(24,22,15,0.06)",
};

const ESCURO: Paleta = {
  fundo: "#16140F",
  cartao: "#211E18",
  cartaoAlt: "#2A271F",
  textoPrimario: "#F4F1E9",
  textoSecundario: "#ADA89D",
  textoTerciario: "#726D64",
  hairline: "#332F26",
  sombra: "0 10px 26px rgba(0,0,0,0.4)",
};

function paletaDe(escuro: boolean): Paleta {
  return escuro ? ESCURO : CLARO;
}

const LARANJA = "#EF7B33";
const LARANJA_TINT_CLARO = "#FBE2CE";
const LARANJA_TINT_ESCURO = "#3A2A1A";

/** Botão circular branco/superfície — busca, sino, avatar, voltar. Flutua
 *  direto no fundo, sem barra de header. */
function BotaoCirculo({ p, children }: { p: Paleta; children: React.ReactNode }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ background: p.cartao, boxShadow: p.sombra, color: p.textoPrimario }}>
      {children}
    </span>
  );
}

/** Pill de dropdown — decorativo, sem estado real (a referência também não
 *  implementa comportamento, só mostra o rótulo + seta). */
function PillDropdown({ p, rotulo }: { p: Paleta; rotulo: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full px-3.5 py-2" style={{ background: p.cartaoAlt }}>
      <span className="text-caption font-semibold" style={{ color: p.textoPrimario }}>{rotulo}</span>
      <IconeChevronBaixo />
    </span>
  );
}

/** Mini-gauge (anel) — só usado em cima de % que já temos de verdade. */
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

/** Barras mini (sparkline de barras) — a partir de valores REAIS (não
 *  série inventada). A maior barra vira laranja, o resto cinza. */
function BarrasMini({ valores, p }: { valores: number[]; p: Paleta }) {
  const max = Math.max(...valores);
  return (
    <div className="flex h-12 items-end gap-1.5">
      {valores.map((v, i) => (
        <div
          key={i}
          className="w-3 rounded-full"
          style={{ height: `${Math.max(18, (v / max) * 100)}%`, background: v === max ? LARANJA : p.hairline }}
        />
      ))}
    </div>
  );
}

/** Cartão "ver mais" — título + seta de expandir, valor grande, legenda. */
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
    <div className="rounded-2xl p-4" style={{ background: p.cartao, boxShadow: p.sombra }}>
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

/** Fileira de estatísticas — 2 ou 3 cartões lado a lado (valor + rótulo). */
function FileiraStats({ p, itens }: { p: Paleta; itens: { valor: string; rotulo: string }[] }) {
  return (
    <div className="flex gap-2.5">
      {itens.map((it) => (
        <div key={it.rotulo} className="flex-1 rounded-2xl p-3.5" style={{ background: p.cartao, boxShadow: p.sombra }}>
          <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>{it.valor}</p>
          <p className="text-micro" style={{ color: p.textoTerciario }}>{it.rotulo}</p>
        </div>
      ))}
    </div>
  );
}

/** Botão CTA — pílula laranja sólida, texto branco (contraste alto, a única
 *  cor de ação da referência). */
function BotaoLaranja({ children, opaco = false }: { children: React.ReactNode; opaco?: boolean }) {
  return (
    <span className="block w-full rounded-2xl py-4 text-center text-body font-bold text-white" style={{ background: LARANJA, opacity: opaco ? 0.5 : 1 }}>
      {children}
    </span>
  );
}

/* ─── NAV INFERIOR — ativo ganha círculo laranja sólido, mais discreto que
   o FAB das referências anteriores. ─────────────────────────────────────── */
type RefNavId = "home" | "grade" | "perfil" | "mais";

function RefNav({ ativo, p }: { ativo: RefNavId; p: Paleta }) {
  const itens: { id: RefNavId; icone: React.ReactNode }[] = [
    { id: "home", icone: <IconeGrade /> },
    { id: "grade", icone: <IconeGrafico /> },
    { id: "perfil", icone: <IconeTendencia /> },
    { id: "mais", icone: <IconePessoa /> },
  ];
  return (
    <div className="flex items-center justify-between rounded-full p-2" style={{ background: p.cartao, boxShadow: p.sombra }}>
      {itens.map((it) => (
        <span
          key={it.id}
          className="flex h-11 w-11 items-center justify-center rounded-full"
          style={it.id === ativo ? { background: LARANJA, color: "#fff" } : { color: p.textoTerciario }}
        >
          {it.icone}
        </span>
      ))}
    </div>
  );
}

/* ─── 1. N7 · A CONTA DA ABERTURA ──────────────────────────────────────────── */

const INCLUSO_REF = [
  "Abertura completa da empresa",
  "Certificado digital, sem custo extra",
  "Impostos e declarações em dia",
  "Notas fiscais sem limite",
];

export function ReferenciaPlano({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  const mensalidade = CUSTOS.MENSALIDADE;
  const laranjaTint = escuro ? LARANJA_TINT_ESCURO : LARANJA_TINT_CLARO;
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="flex shrink-0 items-center justify-between px-5 pb-2" style={{ paddingTop: "calc(var(--safe-top) + 8px)" }}>
        <BotaoCirculo p={p}><IconeChevronEsquerda /></BotaoCirculo>
        <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>A conta da abertura</p>
        <BotaoCirculo p={p}><IconeBusca /></BotaoCirculo>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mb-3 flex items-center gap-2">
          <PillDropdown p={p} rotulo="Plano único" />
        </div>

        <CartaoExpansivel
          p={p}
          titulo="Sua mensalidade"
          valor={brl(mensalidade)}
          legenda="A 1ª mensalidade já é o seu 1º mês. Acompanha o seu faturamento."
          grafico={<MiniGauge pct={100} p={p} />}
        />

        <div className="mt-2.5">
          <CartaoExpansivel
            p={p}
            titulo="Honorário de abertura"
            valor="R$ 0"
            legenda="100% grátis — documentação, contrato social, protocolo e CNPJ."
            grafico={<MiniGauge pct={100} p={p} />}
          />
        </div>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>O que está incluso</p>
        <div className="rounded-2xl p-4" style={{ background: p.cartao, boxShadow: p.sombra }}>
          {INCLUSO_REF.map((item, idx) => (
            <div key={item} className="flex items-center gap-2.5 py-2" style={idx > 0 ? { borderTop: `1px solid ${p.hairline}` } : undefined}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: LARANJA }} />
              <p className="text-caption" style={{ color: p.textoPrimario }}>{item}</p>
            </div>
          ))}
        </div>

        <div className="mt-2.5 flex gap-2.5">
          <div className="flex-1 rounded-2xl p-3.5" style={{ background: laranjaTint }}>
            <p className="text-micro" style={{ color: p.textoSecundario }}>Taxa Junta</p>
            <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>{brl(CUSTOS.DAE_JUCEMG, true)}</p>
          </div>
          <div className="flex-1 rounded-2xl p-3.5" style={{ background: p.cartaoAlt }}>
            <p className="text-micro" style={{ color: p.textoTerciario }}>Cobrança</p>
            <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>Mensal</p>
          </div>
        </div>
      </div>

      <div className="shrink-0 px-5 pb-4">
        <div className="mb-2.5 flex items-baseline justify-between">
          <span className="text-caption" style={{ color: p.textoTerciario }}>Você paga hoje</span>
          <span className="text-h2 font-bold" style={{ color: p.textoPrimario }}>{brl(mensalidade, true)}</span>
        </div>
        <BotaoLaranja>Ótimo, continuar</BotaoLaranja>
      </div>
    </div>
  );
}

/* ─── 2. C0.1 · RETOMAR DE ONDE PAROU ──────────────────────────────────────── */

export function ReferenciaRetomar({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  const passos = passosDoCliente();
  const concluidos = 2;
  const pct = Math.round((concluidos / passos.length) * 100);

  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="flex shrink-0 items-center justify-between px-5 pb-2" style={{ paddingTop: "calc(var(--safe-top) + 8px)" }}>
        <BotaoCirculo p={p}><IconeChevronEsquerda /></BotaoCirculo>
        <BotaoCirculo p={p}><IconeSino /></BotaoCirculo>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-3 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <h1 className="text-h1 font-bold leading-[1.05]" style={{ color: p.textoPrimario }}>Bem-vindo de volta</h1>
        <p className="mt-2 text-body" style={{ color: p.textoSecundario }}>Você saiu há 6 dias. Está tudo salvo.</p>

        <div className="mt-4">
          <CartaoExpansivel
            p={p}
            titulo="Seu progresso"
            valor={`${concluidos} de ${passos.length}`}
            legenda="Passos concluídos até agora."
            grafico={<MiniGauge pct={pct} p={p} />}
          />
        </div>

        <div className="mt-2.5">
          <FileiraStats
            p={p}
            itens={[
              { valor: String(concluidos), rotulo: "Feitos" },
              { valor: String(passos.length - concluidos), rotulo: "Restantes" },
              { valor: String(passos.length), rotulo: "Total" },
            ]}
          />
        </div>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Onde você está</p>
        <div className="rounded-2xl p-2" style={{ background: p.cartao, boxShadow: p.sombra }}>
          {passos.map((passo, i) => {
            const feito = i < concluidos;
            const agora = i === concluidos;
            return (
              <div key={passo.tela} className="flex items-center gap-2.5 px-2.5 py-2" style={i > 0 ? { borderTop: `1px solid ${p.hairline}` } : undefined}>
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: feito ? LARANJA : agora ? p.textoPrimario : p.hairline }} />
                <p className="flex-1 text-caption" style={{ color: feito || agora ? p.textoPrimario : p.textoTerciario, fontWeight: feito || agora ? 600 : 400 }}>
                  {passo.nome}
                </p>
                {agora && <span className="shrink-0 text-[10px] font-bold" style={{ color: LARANJA }}>AGORA</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="shrink-0 px-5 pb-3">
        <BotaoLaranja>Continuar de onde parei</BotaoLaranja>
      </div>
      <div className="shrink-0 px-5" style={{ paddingBottom: "calc(10px + var(--safe-bottom))" }}>
        <RefNav ativo="perfil" p={p} />
      </div>
    </div>
  );
}

/* ─── 3. E3 · FORK · 3 ROTAS ───────────────────────────────────────────────── */

export function ReferenciaFork({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="flex shrink-0 items-center justify-between px-5 pb-2" style={{ paddingTop: "calc(var(--safe-top) + 8px)" }}>
        <BotaoCirculo p={p}><IconeBusca /></BotaoCirculo>
        <BotaoCirculo p={p}><IconeEscudo /></BotaoCirculo>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <h1 className="text-h1 font-bold leading-[1.05]" style={{ color: p.textoPrimario }}>
          Como a gente pode te ajudar?
        </h1>
        <p className="mt-2 text-body" style={{ color: p.textoSecundario }}>A parte chata fica com a gente.</p>

        <div className="mt-4">
          <PillDropdown p={p} rotulo="Escritório em BH" />
        </div>

        <div className="mt-4 rounded-2xl p-4" style={{ background: p.cartao, boxShadow: p.sombra }}>
          <div className="flex items-center justify-between">
            <p className="text-caption font-semibold" style={{ color: p.textoPrimario }}>Quero abrir minha empresa</p>
            <span style={{ color: p.textoTerciario }}><IconeSetaDiagonal /></span>
          </div>
          <p className="mt-3 text-h2 font-bold" style={{ color: p.textoPrimario }}>Começar do zero</p>
          <p className="mt-1 text-micro" style={{ color: p.textoTerciario }}>Ainda não tenho CNPJ.</p>
        </div>

        <div className="mt-2.5 rounded-2xl p-4" style={{ background: p.cartaoAlt }}>
          <div className="flex items-center justify-between">
            <p className="text-caption font-semibold" style={{ color: p.textoPrimario }}>Já tenho empresa</p>
            <span style={{ color: p.textoTerciario }}><IconeSetaDiagonal /></span>
          </div>
          <p className="mt-1 text-micro" style={{ color: p.textoTerciario }}>Tenho CNPJ e quero que vocês cuidem da contabilidade.</p>
        </div>

        <p className="mt-5 text-center text-caption" style={{ color: p.textoSecundario }}>
          Já é cliente? <span className="font-bold" style={{ color: p.textoPrimario }}>Entrar na minha conta</span>
        </p>
      </div>

      <div className="shrink-0 px-5" style={{ paddingBottom: "calc(10px + var(--safe-bottom))" }}>
        <RefNav ativo="home" p={p} />
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
      <div className="flex shrink-0 items-center justify-between px-5 pb-2" style={{ paddingTop: "calc(var(--safe-top) + 8px)" }}>
        <BotaoCirculo p={p}><IconeChevronEsquerda /></BotaoCirculo>
        <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>Seus dados</p>
        <BotaoCirculo p={p}><IconeBusca /></BotaoCirculo>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <h1 className="text-h1 font-bold leading-tight" style={{ color: p.textoPrimario }}>Confira seus dados</h1>
        <p className="mt-1 text-body" style={{ color: p.textoSecundario }}>Já preenchido no cadastro, só falta completar o resto.</p>

        <div className="mt-4 rounded-2xl p-4" style={{ background: p.cartao, boxShadow: p.sombra }}>
          {[
            { rotulo: "Nome", valor: CLIENTE.nome },
            { rotulo: "CPF", valor: CLIENTE.cpf },
            { rotulo: "Telefone", valor: CLIENTE.telefone },
          ].map((linha, idx) => (
            <div key={linha.rotulo} className="flex items-center justify-between py-2" style={idx > 0 ? { borderTop: `1px solid ${p.hairline}` } : undefined}>
              <span className="text-caption" style={{ color: p.textoTerciario }}>{linha.rotulo}</span>
              <span className="text-caption font-semibold" style={{ color: p.textoPrimario }}>{linha.valor}</span>
            </div>
          ))}
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
        <BotaoLaranja opaco>Continuar</BotaoLaranja>
      </div>
    </div>
  );
}

/* ─── 5. HOME CAMPEÃ (dia-1) ───────────────────────────────────────────────── */

const NOTAS_VALORES = [1200, 3000, 850];

export function ReferenciaHomeCampea({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="flex shrink-0 items-center justify-between px-5 pb-2" style={{ paddingTop: "calc(var(--safe-top) + 8px)" }}>
        <BotaoCirculo p={p}><IconeBusca /></BotaoCirculo>
        <div className="flex items-center gap-2">
          <BotaoCirculo p={p}><IconeSino /></BotaoCirculo>
          <span className="flex h-11 w-11 items-center justify-center rounded-full text-caption font-bold text-white" style={{ background: LARANJA }}>AB</span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <h1 className="text-h1 font-bold leading-[1.05]" style={{ color: p.textoPrimario }}>
          Bem-vinda de volta, {CLIENTE.nome.split(" ")[0]}
        </h1>

        <div className="mt-4">
          <PillDropdown p={p} rotulo="Hoje · 28 ago" />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl p-4" style={{ background: p.cartao, boxShadow: p.sombra }}>
            <p className="text-caption font-semibold" style={{ color: p.textoPrimario }}>Sua alíquota</p>
            <p className="mt-2 text-h1 font-bold" style={{ color: p.textoPrimario }}>6%</p>
            <div className="mt-1"><MiniGauge pct={6} p={p} /></div>
          </div>
          <div className="rounded-2xl p-4" style={{ background: p.cartao, boxShadow: p.sombra }}>
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
          <CartaoExpansivel
            p={p}
            titulo="Seu próximo compromisso"
            valor="R$ 178,31"
            legenda="DAS de junho, vence 20/07 — a gente já gerou."
          />
          <div className="mt-2.5">
            <BotaoLaranja>Pagar</BotaoLaranja>
          </div>
        </div>

        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Atalhos rápidos</p>
        <div className="flex gap-2.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {["Emitir nota", "Pagar imposto", "Pró-labore", "Documentos"].map((titulo) => (
            <div key={titulo} className="w-28 shrink-0 rounded-2xl p-3" style={{ background: p.cartaoAlt }}>
              <p className="text-micro font-semibold" style={{ color: p.textoPrimario }}>{titulo}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl p-4" style={{ background: p.textoPrimario }}>
          <p className="text-caption font-semibold" style={{ color: p.fundo }}>Quem cuida de você</p>
          <p className="mt-1 text-body-strong font-bold" style={{ color: p.cartao }}>Contadores cuidando do seu CNPJ</p>
          <p className="mt-3 text-caption font-bold" style={{ color: LARANJA }}>Falar no WhatsApp</p>
        </div>
      </div>

      <div className="shrink-0 px-5" style={{ paddingBottom: "calc(10px + var(--safe-bottom))" }}>
        <RefNav ativo="home" p={p} />
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
function IconeChevronEsquerda() { return <svg {...iconeBase(16)}><path d="m15 18-6-6 6-6" /></svg>; }
function IconeChevronBaixo() { return <svg {...iconeBase(14)}><path d="m6 9 6 6 6-6" /></svg>; }
function IconeBusca() {
  return (
    <svg {...iconeBase(18)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function IconeSino() {
  return (
    <svg {...iconeBase(18)}>
      <path d="M6 8a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}
function IconeSetaDiagonal() { return <svg {...iconeBase(16)}><path d="M7 17 17 7M7 7h10v10" /></svg>; }
function IconeEscudo() { return <svg {...iconeBase(18)}><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5Z" /></svg>; }
function IconeGrade() {
  return (
    <svg {...iconeBase(18)}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function IconeGrafico() {
  return (
    <svg {...iconeBase(18)}>
      <path d="M4 20V10M12 20V4M20 20v-6" />
    </svg>
  );
}
function IconeTendencia() { return <svg {...iconeBase(18)}><path d="m3 17 6-6 4 4 8-8" /><path d="M15 6h6v6" /></svg>; }
function IconePessoa() { return <svg {...iconeBase(18)}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6" /></svg>; }
