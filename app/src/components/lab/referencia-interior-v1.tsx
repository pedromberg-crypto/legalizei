import { passosDoCliente } from "@/lib/passos";
import { CUSTOS, brl } from "@/lib/fiscal";
import { Logo } from "@/components/logo";
import { CLIENTE } from "@/app/(app)/dossie/mock";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * REFERÊNCIA V1 — "Interior design app" (28/08, pedido do Pedro)
 * ═══════════════════════════════════════════════════════════════════════════
 * 1ª referência visual pra achar um redesign moderno e diferente do app
 * inteiro. Vive SÓ na seção "Aplicação da referência" do `/mockup-v2` — 4
 * telas soltas (sem router, sem estado compartilhado entre si), reconstruídas
 * do zero neste arquivo com a LINGUAGEM da referência, não com os componentes
 * de produção (`wizard-dinheiro.tsx`/`wizard-cauda.tsx`/`entrada.tsx`/
 * `wizard-dossie.tsx`). 🆕 28/08 — a 4ª (`ReferenciaDadosPessoais`, baseada no
 * `SocioView`/C1 real) entrou pra testar CAMPO DE FORMULÁRIO, que nenhuma das
 * 3 primeiras (cartão/lista/botão) cobria.
 *
 * ─── O QUE A REFERÊNCIA ENSINA (extraído da imagem, não só a cor) ─────────
 *   · Fundo quente, nunca cinza-frio — inclusive onde a produção hoje usa
 *     hero escuro (N7), aqui vira cartão claro flutuando (no modo claro).
 *   · Pills `rounded-full` em tudo que é ação (botões, categorias, o próprio
 *     CTA final).
 *   · Listas viram UM cartão agrupado (rounded-3xl) com linhas separadas por
 *     hairline — não N cartões soltos.
 *   · Progresso vira ANEL percentual (não barra) — idioma do "90%" da
 *     referência.
 *   · Nav inferior flutuante: contorno coral, item ATIVO é uma pílula com
 *     label, os outros são círculos coral só com ícone.
 *   · Cartão-herói com ilustração ao lado do texto + CTA dentro do próprio
 *     cartão (não abaixo dele).
 *
 * 🆕 28/08 (pedido do Pedro) — cada tela agora tem um par claro/escuro. Cada
 * export aceita `escuro?: boolean`; a página SEMPRE renderiza os 2 juntos
 * (não é toggle — ver `mockup-v2/page.tsx`), pra comparar as duas leituras
 * lado a lado. `PALETA` é a única coisa que muda entre eles: mesma estrutura,
 * mesmo componente, cores diferentes.
 *
 * ─── O QUE NÃO MUDA (mesma função, execução livre) ────────────────────────
 * Preço, lista de inclusos, passos do dossiê e as 2 opções do fork continuam
 * os mesmos dados de produção (`CUSTOS`/`passosDoCliente`) — só a CASCA virou
 * outra. Números não duplicam fonte, pra não divergir da produção por acaso.
 *
 * ⚠️ Cores de `PALETA` são EXPERIMENTAIS, locais deste arquivo — não são
 * tokens globais ainda (por isso vão via `style` inline, não classe Tailwind:
 * um toggle manual não pode depender do tema do SISTEMA, que é o que os
 * tokens `--color-*` seguem). Se esta direção for aprovada, viram candidatos
 * a tokens de verdade — decisão de outra hora.
 * ═══════════════════════════════════════════════════════════════════════════
 */

type Paleta = {
  bg: string;
  bgAlt: string;
  card: string;
  textoPrimario: string;
  textoSecundario: string;
  textoTerciario: string;
  hairline: string;
  sombra: string;
  sombraForte: string;
  navAtivoBg: string;
  navAtivoTexto: string;
  sucessoTint: string;
  sucessoTexto: string;
  sucessoPonto: string;
};

const CLARO: Paleta = {
  bg: "#FAF5EE",
  bgAlt: "#F0E8DC",
  card: "#FFFFFF",
  textoPrimario: "#211C17",
  textoSecundario: "#6B6259",
  textoTerciario: "#948B80",
  hairline: "rgba(0,0,0,0.08)",
  sombra: "0 10px 28px rgba(0,0,0,0.05)",
  sombraForte: "0 16px 40px rgba(0,0,0,0.08)",
  navAtivoBg: "#211C17",
  navAtivoTexto: "#FAF5EE",
  sucessoTint: "#E3F5EC",
  sucessoTexto: "#1F8A5A",
  sucessoPonto: "#2FAE75",
};

const ESCURO: Paleta = {
  bg: "#1E1A16",
  bgAlt: "#2A241C",
  card: "#282219",
  textoPrimario: "#F5EFE6",
  textoSecundario: "#B8AEA1",
  textoTerciario: "#8A8074",
  hairline: "rgba(255,255,255,0.08)",
  sombra: "0 10px 28px rgba(0,0,0,0.35)",
  sombraForte: "0 16px 40px rgba(0,0,0,0.5)",
  navAtivoBg: "#F5EFE6",
  navAtivoTexto: "#1E1A16",
  sucessoTint: "#173428",
  sucessoTexto: "#5FCB9E",
  sucessoPonto: "#3E9E77",
};

function paletaDe(escuro: boolean): Paleta {
  return escuro ? ESCURO : CLARO;
}

/* ─── NAV INFERIOR FLUTUANTE (compartilhada pelas 3 telas) ────────────────
   Reuso de CASCA visual, não de estado: cada tela chama com seu próprio
   `ativo`/`escuro`, sem nenhuma referência cruzada entre elas. */
type RefNavId = "home" | "criar" | "grade" | "perfil";

function RefNav({ ativo, p }: { ativo: RefNavId; p: Paleta }) {
  const itens: { id: RefNavId; label: string; icone: React.ReactNode }[] = [
    { id: "home", label: "Início", icone: <IconeRefHome /> },
    { id: "criar", label: "Abrir", icone: <IconeRefCriar /> },
    { id: "grade", label: "Tudo", icone: <IconeRefGrade /> },
    { id: "perfil", label: "Perfil", icone: <IconeRefPerfil /> },
  ];
  return (
    <div
      className="flex items-center gap-2 rounded-full p-2"
      style={{
        background: p.bg,
        border: "2px solid var(--color-action-primary)",
        boxShadow: p.sombraForte,
      }}
    >
      {itens.map((it) =>
        it.id === ativo ? (
          <span
            key={it.id}
            className="flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-caption font-semibold"
            style={{ background: p.navAtivoBg, color: p.navAtivoTexto }}
          >
            {it.icone}
            {it.label}
          </span>
        ) : (
          <span
            key={it.id}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
            style={{ background: "var(--color-action-primary)" }}
          >
            {it.icone}
          </span>
        ),
      )}
    </div>
  );
}

/** Anel percentual — troca a barra de progresso pela affordance da referência. */
function AnelPercentual({ pct, p, tamanho = 56 }: { pct: number; p: Paleta; tamanho?: number }) {
  const raio = (tamanho - 8) / 2;
  const perimetro = 2 * Math.PI * raio;
  const offset = perimetro * (1 - pct / 100);
  const meio = tamanho / 2;
  return (
    <svg width={tamanho} height={tamanho} viewBox={`0 0 ${tamanho} ${tamanho}`} className="shrink-0">
      <circle cx={meio} cy={meio} r={raio} fill="none" stroke={p.hairline} strokeWidth={5} />
      <circle
        cx={meio}
        cy={meio}
        r={raio}
        fill="none"
        stroke="var(--color-action-primary)"
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={perimetro}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${meio} ${meio})`}
      />
      <text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={tamanho * 0.26}
        fontWeight={700}
        fill={p.textoPrimario}
      >
        {pct}%
      </text>
    </svg>
  );
}

/* ─── 1. N7 · A CONTA DA ABERTURA ─────────────────────────────────────────── */

const INCLUSO_REF = [
  { titulo: "Abertura completa da empresa", sub: "Documentação, contrato social, protocolo e CNPJ.", icone: <IconeRefPredio /> },
  { titulo: "Certificado digital", sub: "Incluso, sem custo extra.", icone: <IconeRefCadeado /> },
  { titulo: "Imposto e declarações", sub: "Guia pronta todo mês, no prazo.", icone: <IconeRefDoc /> },
  { titulo: "Notas fiscais sem limite", sub: "Emita quantas precisar.", icone: <IconeRefRaio /> },
];

export function ReferenciaPlano({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  const mensalidade = CUSTOS.MENSALIDADE;
  return (
    <div className="flex h-full flex-col" style={{ background: p.bg }}>
      <header className="flex shrink-0 items-center justify-between px-6 pb-2" style={{ paddingTop: "var(--safe-top)" }}>
        <span className="flex h-9 w-9 items-center justify-center rounded-full shadow-sm" style={{ background: p.card, color: p.textoPrimario }}>
          <IconeRefChevronEsquerda />
        </span>
        <p className="text-body font-bold" style={{ color: p.textoPrimario }}>A conta da abertura</p>
        <span className="h-9 w-9" />
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mt-2 inline-flex items-center gap-2 rounded-full px-4 py-2" style={{ background: p.sucessoTint }}>
          <span className="h-2 w-2 rounded-full" style={{ background: p.sucessoPonto }} aria-hidden />
          <span className="text-caption font-semibold" style={{ color: p.sucessoTexto }}>Abrir sua empresa é 100% grátis</span>
        </div>

        <h1 className="mt-4 text-h1 font-bold leading-tight" style={{ color: p.textoPrimario }}>Quanto custa manter em dia</h1>
        <p className="mt-1 text-body" style={{ color: p.textoSecundario }}>Sem letra miúda, sem surpresa depois.</p>

        {/* HERO CLARO — na referência nada é escuro (no modo claro); o card do
            preço vira o mesmo cartão flutuante rounded-3xl usado em tudo mais.
            No modo escuro o mesmo cartão fica na superfície escura da paleta. */}
        <div className="mt-5 rounded-[32px] p-6" style={{ background: p.card, boxShadow: p.sombraForte }}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-caption" style={{ color: p.textoTerciario }}>Depois, todo mês</p>
            <span className="rounded-full px-4 py-1.5 text-caption font-semibold" style={{ background: p.bgAlt, color: p.textoSecundario }}>
              Plano único
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-[3.5rem] font-bold leading-none" style={{ color: p.textoPrimario }}>{brl(mensalidade)}</p>
            <span className="text-h2" style={{ color: p.textoTerciario }}>/mês</span>
          </div>
          <p className="mt-3 text-caption" style={{ color: p.textoSecundario }}>
            A 1ª mensalidade já é o seu 1º mês. O valor acompanha o seu faturamento.
          </p>
        </div>

        {/* LISTA AGRUPADA — 1 cartão só, linhas com hairline (idioma
            Account/General da referência), não 4 cartões soltos. */}
        <p className="mb-2.5 mt-6 text-caption font-semibold" style={{ color: p.textoPrimario }}>O que está incluso</p>
        <div className="overflow-hidden rounded-[28px]" style={{ background: p.card, boxShadow: p.sombra }}>
          {INCLUSO_REF.map((i, idx) => (
            <div
              key={i.titulo}
              className="flex items-center gap-3 p-4"
              style={idx > 0 ? { borderTop: `1px solid ${p.hairline}` } : undefined}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ background: p.bgAlt, color: p.textoPrimario }}>
                {i.icone}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-body font-semibold" style={{ color: p.textoPrimario }}>{i.titulo}</p>
                <p className="text-micro" style={{ color: p.textoTerciario }}>{i.sub}</p>
              </div>
              <span className="shrink-0" style={{ color: "var(--color-action-primary)" }}>
                <IconeRefCheckPequeno />
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[20px] px-4 py-3" style={{ background: p.bgAlt }}>
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-caption" style={{ color: p.textoSecundario }}>Taxa da Junta Comercial</p>
            <p className="text-caption font-semibold" style={{ color: p.textoPrimario }}>{brl(CUSTOS.DAE_JUCEMG, true)}</p>
          </div>
          <p className="mt-1 text-micro" style={{ color: p.textoTerciario }}>Vai direto pro Estado. Só um aviso, não é cobrada agora.</p>
        </div>
      </div>

      <div className="shrink-0 px-6 pb-3">
        <div className="flex items-center justify-between gap-4 rounded-full p-2 pl-5" style={{ background: p.card, boxShadow: p.sombraForte }}>
          <div className="min-w-0">
            <p className="text-micro" style={{ color: p.textoTerciario }}>Você paga hoje</p>
            <p className="text-h2 font-bold" style={{ color: p.textoPrimario }}>{brl(mensalidade, true)}</p>
          </div>
          <span className="shrink-0 rounded-full px-6 py-3.5 text-body font-bold text-white" style={{ background: "var(--color-action-primary)" }}>
            Ótimo, continuar
          </span>
        </div>
      </div>

      <div className="flex shrink-0 justify-center px-6" style={{ paddingBottom: "calc(16px + var(--safe-bottom))" }}>
        <RefNav ativo="criar" p={p} />
      </div>
    </div>
  );
}

/* ─── 2. C0.1 · RETOMAR DE ONDE PAROU ──────────────────────────────────────── */

export function ReferenciaRetomar({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  const passos = passosDoCliente();
  const concluidos = 2; // mesmo estado do mock de produção (ESTADO_P1)
  const pct = Math.round((concluidos / passos.length) * 100);

  return (
    <div className="flex h-full flex-col" style={{ background: p.bg }}>
      <header className="flex shrink-0 items-center justify-between px-6 pb-2" style={{ paddingTop: "var(--safe-top)" }}>
        <span className="flex h-9 w-9 items-center justify-center rounded-full shadow-sm" style={{ background: p.card, color: p.textoPrimario }}>
          <IconeRefChevronEsquerda />
        </span>
        <p className="text-body font-bold" style={{ color: p.textoPrimario }}>Retomar</p>
        <span className="h-9 w-9" />
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* CARTÃO-RESUMO — anel percentual no lugar da barra, idioma do "90%"
            da referência (perfil). */}
        <div className="mt-2 flex items-center gap-4 rounded-[28px] p-5" style={{ background: p.card, boxShadow: p.sombraForte }}>
          <div className="min-w-0 flex-1">
            <p className="text-h2 font-bold" style={{ color: p.textoPrimario }}>Bem-vindo de volta</p>
            <p className="mt-1 text-caption" style={{ color: p.textoSecundario }}>Você saiu há 6 dias. Está tudo salvo.</p>
          </div>
          <AnelPercentual pct={pct} p={p} />
        </div>

        {/* LISTA AGRUPADA — trilha conectada da produção vira 1 cartão com
            linhas, cada uma com seu círculo de estado. */}
        <p className="mb-2.5 mt-6 text-caption font-semibold" style={{ color: p.textoPrimario }}>Onde você está</p>
        <div className="overflow-hidden rounded-[28px]" style={{ background: p.card, boxShadow: p.sombra }}>
          {passos.map((passo, i) => {
            const feito = i < concluidos;
            const agora = i === concluidos;
            const corNo = feito
              ? { background: "var(--color-action-primary)", color: "#fff" }
              : agora
                ? { background: p.navAtivoBg, color: p.navAtivoTexto }
                : { background: p.bgAlt, color: p.textoTerciario };
            return (
              <div
                key={passo.tela}
                className="flex items-center gap-3 p-4"
                style={i > 0 ? { borderTop: `1px solid ${p.hairline}` } : undefined}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-caption font-bold"
                  style={corNo}
                >
                  {feito ? <IconeRefCheckPequeno /> : i + 1}
                </span>
                <p
                  className="flex-1 text-body"
                  style={{ color: feito || agora ? p.textoPrimario : p.textoTerciario, fontWeight: feito || agora ? 600 : 400 }}
                >
                  {passo.nome}
                </p>
                {agora && (
                  <span className="shrink-0 rounded-full px-2.5 py-1 text-micro font-semibold" style={{ background: p.bgAlt, color: p.textoSecundario }}>
                    Agora
                  </span>
                )}
              </div>
            );
          })}
          <div className="flex items-center gap-3 p-4" style={{ borderTop: `1px solid ${p.hairline}` }}>
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              style={{ border: "2px solid var(--color-action-primary)", color: "var(--color-action-primary)" }}
            >
              <IconeRefBandeira />
            </span>
            <p className="flex-1 text-body font-semibold" style={{ color: p.textoPrimario }}>Empresa constituída</p>
          </div>
        </div>
      </div>

      <div className="shrink-0 px-6 pb-3">
        <span
          className="block w-full rounded-full py-4 text-center text-body font-bold text-white"
          style={{ background: "var(--color-action-primary)", boxShadow: p.sombraForte }}
        >
          Continuar de onde parei
        </span>
      </div>
      <div className="flex shrink-0 justify-center px-6" style={{ paddingBottom: "calc(16px + var(--safe-bottom))" }}>
        <RefNav ativo="perfil" p={p} />
      </div>
    </div>
  );
}

/* ─── 3. E3 · FORK · 3 ROTAS ───────────────────────────────────────────────── */

export function ReferenciaFork({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div className="flex h-full flex-col" style={{ background: p.bg }}>
      <header className="flex shrink-0 items-center justify-between px-6 pb-2" style={{ paddingTop: "var(--safe-top)" }}>
        <Logo className="h-8 w-auto" variante={escuro ? "escura" : "padrao"} />
        <span className="flex h-9 w-9 items-center justify-center rounded-full shadow-sm" style={{ background: p.card, color: p.textoPrimario }}>
          <IconeRefAjuda />
        </span>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2" style={{ border: `1px solid ${p.hairline}`, background: p.card }}>
          <span style={{ color: "var(--color-action-primary)" }}>
            <IconeRefEscudo />
          </span>
          <span className="text-caption font-semibold" style={{ color: p.textoSecundario }}>Um escritório de contabilidade de verdade, em BH.</span>
        </div>

        <h1 className="mt-4 text-h1 font-bold leading-tight" style={{ color: p.textoPrimario }}>
          Como a gente pode te ajudar?{" "}
          <span className="font-normal" style={{ color: p.textoTerciario }}>A parte chata fica com a gente.</span>
        </h1>

        {/* HERO — cartão com ilustração ao lado do texto + CTA dentro do
            próprio cartão, idioma da capa da referência (não abaixo, dentro). */}
        <div className="mt-5 overflow-hidden rounded-[32px]" style={{ background: p.card, boxShadow: p.sombraForte }}>
          <div className="flex items-center gap-4 p-5">
            <div className="min-w-0 flex-1">
              <p className="text-body font-bold" style={{ color: p.textoPrimario }}>Quero abrir minha empresa</p>
              <p className="mt-1 text-caption" style={{ color: p.textoSecundario }}>Ainda não tenho CNPJ. Quero começar do zero.</p>
              <span
                className="mt-4 inline-block rounded-full px-5 py-2.5 text-caption font-bold text-white"
                style={{ background: "var(--color-action-primary)" }}
              >
                Começar agora
              </span>
            </div>
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[24px]" style={{ background: p.bgAlt }}>
              <span style={{ color: "var(--color-action-primary)" }}>
                <IconeRefAviaozinho />
              </span>
            </div>
          </div>
        </div>

        {/* Segunda opção — mesmo idioma do cartão "explorar" da referência:
            ícone-em-círculo + texto + seta, mais enxuto que o herói. */}
        <div className="mt-4 flex items-center gap-3 rounded-[24px] p-4" style={{ background: p.card, boxShadow: p.sombra }}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ background: p.bgAlt, color: p.textoPrimario }}>
            <IconeRefPredio />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-body font-semibold" style={{ color: p.textoPrimario }}>Já tenho empresa</p>
            <p className="text-micro" style={{ color: p.textoTerciario }}>Tenho CNPJ e quero que vocês cuidem da contabilidade.</p>
          </div>
          <span className="shrink-0" style={{ color: p.textoTerciario }}>
            <IconeRefSetaDiagonal />
          </span>
        </div>

        <p className="mt-5 text-center text-caption" style={{ color: p.textoSecundario }}>
          Já é cliente? <span className="font-semibold" style={{ color: p.textoPrimario }}>Entrar na minha conta</span>
        </p>
      </div>

      <div className="flex shrink-0 justify-center px-6" style={{ paddingBottom: "calc(16px + var(--safe-bottom))" }}>
        <RefNav ativo="home" p={p} />
      </div>
    </div>
  );
}

/* ─── 4. C1 · SEUS DADOS (tela de inputs) ──────────────────────────────────
   🆕 28/08 (pedido do Pedro: "senti falta de uma tela de inputs") — as 3
   telas de cima são cartão/lista/botão; nenhuma testa como a linguagem da
   referência se comporta em CAMPO DE FORMULÁRIO. Baseada no `SocioView` real
   (`wizard-dossie.tsx`), mesmos campos (RG, órgão emissor, nascimento, nome
   da mãe, estado civil) — só estática (sem `useState`): é referência visual,
   não formulário funcional, mesmo espírito das outras 3. Input SEM borda
   dura: preenchido com `p.bgAlt`, mesma família "sem contorno, só
   preenchimento" dos ícones-em-círculo das outras telas. */

function CampoRef({ rotulo, placeholder, p, metade = false }: { rotulo: string; placeholder: string; p: Paleta; metade?: boolean }) {
  return (
    <label className={`block ${metade ? "" : "col-span-2"}`}>
      <span className="text-caption font-semibold" style={{ color: p.textoPrimario }}>{rotulo}</span>
      <div
        className="mt-1.5 flex min-h-12 items-center rounded-2xl px-3.5 text-body"
        style={{ background: p.bgAlt, color: p.textoTerciario }}
      >
        {placeholder}
      </div>
    </label>
  );
}

export function ReferenciaDadosPessoais({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div className="flex h-full flex-col" style={{ background: p.bg }}>
      <header className="flex shrink-0 items-center justify-between px-6 pb-2" style={{ paddingTop: "var(--safe-top)" }}>
        <span className="flex h-9 w-9 items-center justify-center rounded-full shadow-sm" style={{ background: p.card, color: p.textoPrimario }}>
          <IconeRefChevronEsquerda />
        </span>
        <p className="text-body font-bold" style={{ color: p.textoPrimario }}>Seus dados</p>
        <span className="h-9 w-9" />
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <h1 className="mt-2 text-h1 font-bold leading-tight" style={{ color: p.textoPrimario }}>Seus dados</h1>
        <p className="mt-1 text-body" style={{ color: p.textoSecundario }}>Confira o que você já preencheu e complete o resto.</p>

        {/* CONFIRMAÇÃO — mesmo idioma de lista agrupada das outras telas,
            "Editar" no canto (idêntico à produção). */}
        <div className="mt-5 rounded-[28px] p-5" style={{ background: p.card, boxShadow: p.sombraForte }}>
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-body font-semibold" style={{ color: p.textoPrimario }}>Já preenchido no cadastro</p>
            <span className="shrink-0 text-caption font-semibold underline underline-offset-4" style={{ color: "var(--color-action-primary)" }}>
              Editar
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            {[
              { rotulo: "Nome", valor: CLIENTE.nome },
              { rotulo: "CPF", valor: CLIENTE.cpf },
              { rotulo: "Telefone", valor: CLIENTE.telefone },
              { rotulo: "Endereço", valor: CLIENTE.endereco },
            ].map((linha) => (
              <div key={linha.rotulo} className="flex flex-col">
                <span className="text-micro" style={{ color: p.textoTerciario }}>{linha.rotulo}</span>
                <span className="text-caption" style={{ color: p.textoPrimario }}>{linha.valor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CAMPOS — preenchidos, sem borda, mesma família visual dos círculos
            de ícone (fundo `bgAlt` no lugar de contorno). */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <CampoRef rotulo="RG" placeholder="00.000.000" p={p} metade />
          <CampoRef rotulo="Órgão emissor" placeholder="SSP/MG" p={p} metade />
        </div>
        <div className="mt-3">
          <CampoRef rotulo="Data de nascimento" placeholder="DD/MM/AAAA" p={p} />
        </div>
        <div className="mt-3">
          <CampoRef rotulo="Nome da mãe" placeholder="Nome completo" p={p} />
        </div>
        <label className="mt-3 block">
          <span className="text-caption font-semibold" style={{ color: p.textoPrimario }}>Estado civil</span>
          <div
            className="mt-1.5 flex min-h-12 items-center justify-between rounded-2xl px-3.5 text-body"
            style={{ background: p.bgAlt, color: p.textoTerciario }}
          >
            Selecione
            <span style={{ color: p.textoTerciario }}>
              <IconeRefChevronBaixo />
            </span>
          </div>
        </label>
      </div>

      <div className="shrink-0 px-6 pb-3">
        {/* Botão em estado DESABILITADO (formulário incompleto) — mesmo
            idioma de pílula, só com opacidade reduzida no lugar de cinza. */}
        <span
          className="block w-full rounded-full py-4 text-center text-body font-bold text-white opacity-50"
          style={{ background: "var(--color-action-primary)" }}
        >
          Continuar
        </span>
      </div>
      <div className="flex shrink-0 justify-center px-6" style={{ paddingBottom: "calc(16px + var(--safe-bottom))" }}>
        <RefNav ativo="perfil" p={p} />
      </div>
    </div>
  );
}

/* ─── ÍCONES — traços simples, mesma convenção da produção (24×24, stroke 2). ─ */

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
function IconeRefChevronEsquerda() {
  return (
    <svg {...iconeBase()} width={16} height={16}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
function IconeRefChevronBaixo() {
  return (
    <svg {...iconeBase()} width={16} height={16}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function IconeRefCheckPequeno() {
  return (
    <svg {...iconeBase()} width={14} height={14} strokeWidth={2.6}>
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}
function IconeRefPredio() {
  return (
    <svg {...iconeBase()}>
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9v.01M9 12v.01M9 15v.01" />
    </svg>
  );
}
function IconeRefCadeado() {
  return (
    <svg {...iconeBase()}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function IconeRefDoc() {
  return (
    <svg {...iconeBase()}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  );
}
function IconeRefRaio() {
  return (
    <svg {...iconeBase()}>
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
    </svg>
  );
}
function IconeRefBandeira() {
  return (
    <svg {...iconeBase()} width={14} height={14}>
      <path d="M4 21V4" />
      <path d="M4 5h13l-2 4 2 4H4" />
    </svg>
  );
}
function IconeRefEscudo() {
  return (
    <svg {...iconeBase()} width={16} height={16}>
      <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5Z" />
    </svg>
  );
}
function IconeRefAviaozinho() {
  return (
    <svg {...iconeBase()} width={40} height={40} strokeWidth={1.6}>
      <path d="m3 11 18-8-8 18-2-8-8-2Z" />
    </svg>
  );
}
function IconeRefSetaDiagonal() {
  return (
    <svg {...iconeBase()} width={16} height={16}>
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}
function IconeRefAjuda() {
  return (
    <svg {...iconeBase()} width={16} height={16}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 1.5-2.5 1.5-2.5 3.5" />
      <path d="M12 17v.01" />
    </svg>
  );
}
function IconeRefHome() {
  return (
    <svg {...iconeBase()} width={16} height={16}>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}
function IconeRefCriar() {
  return (
    <svg {...iconeBase()} width={16} height={16}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function IconeRefGrade() {
  return (
    <svg {...iconeBase()} width={16} height={16}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function IconeRefPerfil() {
  return (
    <svg {...iconeBase()} width={16} height={16}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6" />
    </svg>
  );
}
