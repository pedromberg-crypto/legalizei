import { passosDoCliente } from "@/lib/passos";
import { CUSTOS, brl } from "@/lib/fiscal";
import { Logo } from "@/components/logo";
import { CLIENTE } from "@/app/(app)/dossie/mock";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * REFERÊNCIA V2 — "Quora-like social/Q&A app" (28/08, pedido do Pedro)
 * ═══════════════════════════════════════════════════════════════════════════
 * 2ª referência visual. SUBSTITUI a v1 ("interior design app",
 * `referencia-interior-v1.tsx` — mantido no repo, só não é mais renderizado
 * em "Aplicação da referência") — regra travada pelo Pedro: toda referência
 * nova primeiro volta as telas pras ORIGINAIS de produção, só depois aplica
 * a próxima, pra v1 e v2 nunca se misturarem na mesma tela.
 *
 * ─── O QUE A REFERÊNCIA ENSINA ─────────────────────────────────────────────
 *   · Fundo GRADIENTE pastel (lilás→azul), nunca cor chapada.
 *   · Vidro fosco (glassmorphism): cartão translúcido + blur, não branco
 *     opaco — o gradiente de fundo continua visível por trás.
 *   · Selo de verificação: badge circular no CANTO do avatar/ícone — reusado
 *     aqui como selo de STATUS (feito/agora), não só "verificado".
 *   · Linha com ícone-em-círculo + texto (idioma do "About" do perfil:
 *     maleta/formação/olho/calendário) — mesma mecânica de antes, casca nova.
 *   · Pills de estatística em par ("1M followers · 100 following").
 *   · Nav inferior: ícones neutros, só o ATIVO ganha um círculo com
 *     GRADIENTE preenchido (aqui, gradiente coral — a marca, não o roxo da
 *     referência) por cima da barra.
 *   · Banner-herói com gradiente + avatar centralizado sobreposto, pra
 *     página de "comunidade/tópico" (mapeado no Fork).
 *
 * ─── O QUE NÃO MUDA ─────────────────────────────────────────────────────────
 * Preço, passos do dossiê e as 2 opções do fork continuam vindo de
 * `CUSTOS`/`passosDoCliente` — mesma doutrina da v1, só a casca troca.
 *
 * ⚠️ Cores/gradientes de `PALETA` são EXPERIMENTAIS, locais deste arquivo.
 * ═══════════════════════════════════════════════════════════════════════════
 */

type Paleta = {
  fundo: string;
  vidro: string;
  vidroBorda: string;
  vidroBlur: string;
  textoPrimario: string;
  textoSecundario: string;
  textoTerciario: string;
  pillBg: string;
  navBg: string;
  sucessoTint: string;
  sucessoTexto: string;
  sucessoPonto: string;
};

const CLARO: Paleta = {
  fundo: "linear-gradient(160deg, #ECE6FB 0%, #DCEAFB 55%, #E9EEFC 100%)",
  vidro: "rgba(255,255,255,0.68)",
  vidroBorda: "rgba(255,255,255,0.6)",
  vidroBlur: "blur(18px)",
  textoPrimario: "#1E1B2E",
  textoSecundario: "#5C5876",
  textoTerciario: "#8B87A3",
  pillBg: "rgba(255,255,255,0.55)",
  navBg: "rgba(255,255,255,0.6)",
  sucessoTint: "#E1F5EA",
  sucessoTexto: "#1F8A5A",
  sucessoPonto: "#2FAE75",
};

const ESCURO: Paleta = {
  fundo: "linear-gradient(160deg, #171528 0%, #131E30 55%, #1A1730 100%)",
  vidro: "rgba(255,255,255,0.06)",
  vidroBorda: "rgba(255,255,255,0.1)",
  vidroBlur: "blur(18px)",
  textoPrimario: "#F1EFFA",
  textoSecundario: "#B4AFC9",
  textoTerciario: "#847F9C",
  pillBg: "rgba(255,255,255,0.08)",
  navBg: "rgba(20,18,36,0.6)",
  sucessoTint: "#173428",
  sucessoTexto: "#5FCB9E",
  sucessoPonto: "#3E9E77",
};

function paletaDe(escuro: boolean): Paleta {
  return escuro ? ESCURO : CLARO;
}

const GRADIENTE_CORAL = "linear-gradient(135deg, var(--color-action-primary), var(--color-action-primary-hover))";

/** Botão-círculo fosco (voltar, "..."). */
function BotaoVidro({ p, children }: { p: Paleta; children: React.ReactNode }) {
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
      style={{ background: p.vidro, border: `1px solid ${p.vidroBorda}`, backdropFilter: p.vidroBlur, color: p.textoPrimario }}
    >
      {children}
    </span>
  );
}

/** Selo de verificação — reusado como selo de STATUS (não só "verificado"). */
function SeloBadge({ cor = "var(--color-action-primary)" }: { cor?: string }) {
  return (
    <span
      className="flex h-[18px] w-[18px] items-center justify-center rounded-full text-white ring-2 ring-white"
      style={{ background: cor }}
    >
      <IconeRefCheckPequeno />
    </span>
  );
}

/** Pill de estatística, sempre em par (idioma "1M followers · 100 following"). */
function PillStat({ valor, rotulo, p }: { valor: string; rotulo: string; p: Paleta }) {
  return (
    <span className="rounded-full px-4 py-2 text-caption" style={{ background: p.pillBg, color: p.textoSecundario }}>
      <b style={{ color: p.textoPrimario }}>{valor}</b> {rotulo}
    </span>
  );
}

/** Linha ícone-em-círculo + texto — idioma do "About" (maleta/formação/olho/calendário). */
function LinhaInfo({ icone, texto, p, badge }: { icone: React.ReactNode; texto: string; p: Paleta; badge?: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl p-3.5"
      style={{ background: p.vidro, border: `1px solid ${p.vidroBorda}`, backdropFilter: p.vidroBlur }}
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: p.pillBg, color: p.textoPrimario }}>
        {icone}
        {badge && <span className="absolute -bottom-1 -right-1">{badge}</span>}
      </span>
      <p className="text-body flex-1" style={{ color: p.textoPrimario }}>{texto}</p>
    </div>
  );
}

/* ─── NAV INFERIOR (compartilhada, cada tela chama independente) ─────────── */
type RefNavId = "home" | "criar" | "grade" | "perfil";

function RefNav({ ativo, p }: { ativo: RefNavId; p: Paleta }) {
  const itens: { id: RefNavId; icone: React.ReactNode }[] = [
    { id: "home", icone: <IconeRefHome /> },
    { id: "criar", icone: <IconeRefCriar /> },
    { id: "grade", icone: <IconeRefGrade /> },
    { id: "perfil", icone: <IconeRefPerfil /> },
  ];
  return (
    <div
      className="flex items-center justify-around rounded-full px-2 py-2"
      style={{ background: p.navBg, border: `1px solid ${p.vidroBorda}`, backdropFilter: p.vidroBlur }}
    >
      {itens.map((it) =>
        it.id === ativo ? (
          <span
            key={it.id}
            className="-my-2 flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white shadow-lg"
            style={{ background: GRADIENTE_CORAL }}
          >
            {it.icone}
          </span>
        ) : (
          <span key={it.id} className="flex h-10 w-10 shrink-0 items-center justify-center" style={{ color: p.textoTerciario }}>
            {it.icone}
          </span>
        ),
      )}
    </div>
  );
}

/* ─── 1. N7 · A CONTA DA ABERTURA ─────────────────────────────────────────── */

const INCLUSO_REF = [
  { titulo: "Abertura completa da empresa", icone: <IconeRefPredio /> },
  { titulo: "Certificado digital, sem custo extra", icone: <IconeRefCadeado /> },
  { titulo: "Imposto e declarações em dia", icone: <IconeRefDoc /> },
  { titulo: "Notas fiscais sem limite", icone: <IconeRefRaio /> },
];

export function ReferenciaPlano({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  const mensalidade = CUSTOS.MENSALIDADE;
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <header className="flex shrink-0 items-center justify-between px-6 pb-2" style={{ paddingTop: "var(--safe-top)" }}>
        <BotaoVidro p={p}><IconeRefChevronEsquerda /></BotaoVidro>
        <p className="text-body font-bold" style={{ color: p.textoPrimario }}>A conta da abertura</p>
        <BotaoVidro p={p}><IconeRefMais /></BotaoVidro>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mt-2 inline-flex items-center gap-2 rounded-full px-4 py-2" style={{ background: p.sucessoTint }}>
          <span className="h-2 w-2 rounded-full" style={{ background: p.sucessoPonto }} aria-hidden />
          <span className="text-caption font-semibold" style={{ color: p.sucessoTexto }}>Abrir sua empresa é 100% grátis</span>
        </div>

        <h1 className="mt-4 text-h1 font-bold leading-tight" style={{ color: p.textoPrimario }}>Quanto custa manter em dia</h1>
        <p className="mt-1 text-body" style={{ color: p.textoSecundario }}>Sem letra miúda, sem surpresa depois.</p>

        {/* CARTÃO DE VIDRO — o preço, translúcido sobre o gradiente. */}
        <div className="mt-5 rounded-[28px] p-6" style={{ background: p.vidro, border: `1px solid ${p.vidroBorda}`, backdropFilter: p.vidroBlur }}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-caption" style={{ color: p.textoTerciario }}>Depois, todo mês</p>
            <span className="rounded-full px-4 py-1.5 text-caption font-semibold" style={{ background: p.pillBg, color: p.textoSecundario }}>
              Plano único
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-[3.5rem] font-bold leading-none" style={{ color: p.textoPrimario }}>{brl(mensalidade)}</p>
            <span className="text-h2" style={{ color: p.textoTerciario }}>/mês</span>
          </div>
          <div className="mt-3 flex gap-2">
            <PillStat valor="R$0" rotulo="de honorário" p={p} />
            <PillStat valor="1ª" rotulo="mensalidade = 1º mês" p={p} />
          </div>
        </div>

        {/* LISTA — mesmo idioma do "About": linhas ícone-em-círculo soltas
            (não 1 cartão agrupado), cada uma seu próprio vidro. */}
        <p className="mb-2.5 mt-6 text-caption font-semibold" style={{ color: p.textoPrimario }}>O que está incluso</p>
        <div className="flex flex-col gap-2.5">
          {INCLUSO_REF.map((i) => (
            <LinhaInfo key={i.titulo} icone={i.icone} texto={i.titulo} p={p} badge={<SeloBadge />} />
          ))}
        </div>

        <div className="mt-4 rounded-2xl px-4 py-3" style={{ background: p.pillBg }}>
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-caption" style={{ color: p.textoSecundario }}>Taxa da Junta Comercial</p>
            <p className="text-caption font-semibold" style={{ color: p.textoPrimario }}>{brl(CUSTOS.DAE_JUCEMG, true)}</p>
          </div>
          <p className="mt-1 text-micro" style={{ color: p.textoTerciario }}>Vai direto pro Estado. Só um aviso, não é cobrada agora.</p>
        </div>
      </div>

      <div className="shrink-0 px-6 pb-3">
        <div className="flex items-center justify-between gap-4 rounded-full p-2 pl-5" style={{ background: p.vidro, border: `1px solid ${p.vidroBorda}`, backdropFilter: p.vidroBlur }}>
          <div className="min-w-0">
            <p className="text-micro" style={{ color: p.textoTerciario }}>Você paga hoje</p>
            <p className="text-h2 font-bold" style={{ color: p.textoPrimario }}>{brl(mensalidade, true)}</p>
          </div>
          <span className="shrink-0 rounded-full px-6 py-3.5 text-body font-bold text-white" style={{ background: GRADIENTE_CORAL }}>
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

  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <header className="flex shrink-0 items-center justify-between px-6 pb-2" style={{ paddingTop: "var(--safe-top)" }}>
        <BotaoVidro p={p}><IconeRefChevronEsquerda /></BotaoVidro>
        <p className="text-body font-bold" style={{ color: p.textoPrimario }}>Retomar</p>
        <BotaoVidro p={p}><IconeRefMais /></BotaoVidro>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* CABEÇALHO ESTILO PERFIL — avatar + nome + selo, par de stat pills. */}
        <div className="mt-2 flex flex-col items-center text-center">
          <span
            className="relative flex h-16 w-16 items-center justify-center rounded-full text-white"
            style={{ background: GRADIENTE_CORAL }}
          >
            <IconeRefPredio />
            <span className="absolute -bottom-0.5 -right-0.5"><SeloBadge cor={p.sucessoPonto} /></span>
          </span>
          <p className="mt-2 text-h2 font-bold" style={{ color: p.textoPrimario }}>Bem-vindo de volta</p>
          <p className="mt-1 text-caption" style={{ color: p.textoSecundario }}>Você saiu há 6 dias. Está tudo salvo.</p>
          <div className="mt-3 flex gap-2">
            <PillStat valor={String(concluidos)} rotulo="concluídos" p={p} />
            <PillStat valor={String(passos.length - concluidos)} rotulo="restantes" p={p} />
          </div>
        </div>

        {/* LISTA — linhas soltas, badge de status no canto do ícone (mesmo
            lugar do selo de verificação da referência). */}
        <p className="mb-2.5 mt-6 text-caption font-semibold" style={{ color: p.textoPrimario }}>Onde você está</p>
        <div className="flex flex-col gap-2.5">
          {passos.map((passo, i) => {
            const feito = i < concluidos;
            const agora = i === concluidos;
            return (
              <div key={passo.tela} className="flex items-center gap-3 rounded-2xl p-3.5" style={{ background: p.vidro, border: `1px solid ${p.vidroBorda}`, backdropFilter: p.vidroBlur }}>
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-caption font-bold" style={{ background: p.pillBg, color: agora ? "var(--color-action-primary)" : p.textoTerciario }}>
                  {i + 1}
                  {feito && <span className="absolute -bottom-1 -right-1"><SeloBadge /></span>}
                </span>
                <p className="flex-1 text-body" style={{ color: feito || agora ? p.textoPrimario : p.textoTerciario, fontWeight: feito || agora ? 600 : 400 }}>
                  {passo.nome}
                </p>
                {agora && (
                  <span className="shrink-0 rounded-full px-2.5 py-1 text-micro font-semibold" style={{ background: p.pillBg, color: "var(--color-action-primary)" }}>
                    Agora
                  </span>
                )}
              </div>
            );
          })}
          <div className="flex items-center gap-3 rounded-2xl p-3.5" style={{ background: p.vidro, border: `1px solid ${p.vidroBorda}`, backdropFilter: p.vidroBlur }}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: GRADIENTE_CORAL, color: "#fff" }}>
              <IconeRefBandeira />
            </span>
            <p className="flex-1 text-body font-semibold" style={{ color: p.textoPrimario }}>Empresa constituída</p>
          </div>
        </div>
      </div>

      <div className="shrink-0 px-6 pb-3">
        <span className="block w-full rounded-full py-4 text-center text-body font-bold text-white" style={{ background: GRADIENTE_CORAL }}>
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
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      {/* BANNER-HERÓI — idioma da página de comunidade/tópico: faixa com
          gradiente + avatar centralizado sobreposto. */}
      <div className="relative shrink-0 pt-[var(--safe-top)]">
        <div className="h-28 w-full rounded-b-[28px]" style={{ background: GRADIENTE_CORAL }} />
        <div className="absolute inset-x-0 top-full flex -translate-y-1/2 justify-center">
          <span
            className="flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg"
            style={{ background: p.fundo, border: `3px solid ${p.vidroBorda}` }}
          >
            <Logo className="h-9 w-auto" variante={escuro ? "escura" : "padrao"} />
          </span>
        </div>
        <div className="absolute left-4 top-[var(--safe-top)]">
          <BotaoVidro p={p}><IconeRefMais /></BotaoVidro>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-12 text-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <p className="text-h2 font-bold" style={{ color: p.textoPrimario }}>Legalizai</p>
        <p className="mt-1 text-caption" style={{ color: p.textoSecundario }}>
          A parte chata fica com a gente. Um escritório de contabilidade de verdade, em BH.
        </p>

        <div className="mt-4 flex flex-col gap-2.5 text-left">
          <div className="flex items-center gap-3 rounded-2xl p-3.5" style={{ background: p.vidro, border: `1px solid ${p.vidroBorda}`, backdropFilter: p.vidroBlur }}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white" style={{ background: GRADIENTE_CORAL }}>
              <IconeRefAviaozinho />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-body font-bold" style={{ color: p.textoPrimario }}>Quero abrir minha empresa</p>
              <p className="text-micro" style={{ color: p.textoTerciario }}>Ainda não tenho CNPJ. Quero começar do zero.</p>
            </div>
            <span style={{ color: p.textoTerciario }}><IconeRefSetaDiagonal /></span>
          </div>

          <div className="flex items-center gap-3 rounded-2xl p-3.5" style={{ background: p.vidro, border: `1px solid ${p.vidroBorda}`, backdropFilter: p.vidroBlur }}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ background: p.pillBg, color: p.textoPrimario }}>
              <IconeRefPredio />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-body font-semibold" style={{ color: p.textoPrimario }}>Já tenho empresa</p>
              <p className="text-micro" style={{ color: p.textoTerciario }}>Tenho CNPJ e quero que vocês cuidem da contabilidade.</p>
            </div>
            <span style={{ color: p.textoTerciario }}><IconeRefSetaDiagonal /></span>
          </div>
        </div>

        <p className="mt-5 text-caption" style={{ color: p.textoSecundario }}>
          Já é cliente? <span className="font-semibold" style={{ color: p.textoPrimario }}>Entrar na minha conta</span>
        </p>
      </div>

      <div className="flex shrink-0 justify-center px-6" style={{ paddingBottom: "calc(16px + var(--safe-bottom))" }}>
        <RefNav ativo="home" p={p} />
      </div>
    </div>
  );
}

/* ─── 4. C1 · SEUS DADOS (tela de inputs) ──────────────────────────────────── */

function CampoRef({ rotulo, placeholder, p }: { rotulo: string; placeholder: string; p: Paleta }) {
  return (
    <label className="block">
      <span className="text-caption font-semibold" style={{ color: p.textoPrimario }}>{rotulo}</span>
      <div
        className="mt-1.5 flex min-h-12 items-center rounded-full px-4 text-body"
        style={{ background: p.vidro, border: `1px solid ${p.vidroBorda}`, backdropFilter: p.vidroBlur, color: p.textoTerciario }}
      >
        {placeholder}
      </div>
    </label>
  );
}

export function ReferenciaDadosPessoais({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <header className="flex shrink-0 items-center justify-between px-6 pb-2" style={{ paddingTop: "var(--safe-top)" }}>
        <BotaoVidro p={p}><IconeRefChevronEsquerda /></BotaoVidro>
        <p className="text-body font-bold" style={{ color: p.textoPrimario }}>Seus dados</p>
        <BotaoVidro p={p}><IconeRefMais /></BotaoVidro>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <h1 className="mt-2 text-h1 font-bold leading-tight" style={{ color: p.textoPrimario }}>Seus dados</h1>
        <p className="mt-1 text-body" style={{ color: p.textoSecundario }}>Confira o que você já preencheu e complete o resto.</p>

        {/* CONFIRMAÇÃO — mesmo idioma "About": linhas soltas ícone-em-círculo,
            selo de verificado no canto (já confirmado no cadastro). */}
        <p className="mb-2.5 mt-5 text-caption font-semibold" style={{ color: p.textoPrimario }}>Já preenchido no cadastro</p>
        <div className="flex flex-col gap-2.5">
          <LinhaInfo icone={<IconeRefPessoa />} texto={CLIENTE.nome} p={p} badge={<SeloBadge />} />
          <LinhaInfo icone={<IconeRefDoc />} texto={CLIENTE.cpf} p={p} badge={<SeloBadge />} />
          <LinhaInfo icone={<IconeRefTelefone />} texto={CLIENTE.telefone} p={p} badge={<SeloBadge />} />
          <LinhaInfo icone={<IconeRefPredio />} texto={CLIENTE.endereco} p={p} badge={<SeloBadge />} />
        </div>

        {/* CAMPOS — pílulas de vidro, mesma família do input do "What do you
            want to ask or share?" da referência. */}
        <p className="mb-2.5 mt-6 text-caption font-semibold" style={{ color: p.textoPrimario }}>Falta completar</p>
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
            <div
              className="mt-1.5 flex min-h-12 items-center justify-between rounded-full px-4 text-body"
              style={{ background: p.vidro, border: `1px solid ${p.vidroBorda}`, backdropFilter: p.vidroBlur, color: p.textoTerciario }}
            >
              Selecione
              <IconeRefChevronBaixo />
            </div>
          </label>
        </div>
      </div>

      <div className="shrink-0 px-6 pb-3">
        <span
          className="block w-full rounded-full py-4 text-center text-body font-bold text-white opacity-50"
          style={{ background: GRADIENTE_CORAL }}
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
function IconeRefChevronEsquerda() {
  return <svg {...iconeBase()} width={16} height={16}><path d="m15 18-6-6 6-6" /></svg>;
}
function IconeRefChevronBaixo() {
  return <svg {...iconeBase()} width={16} height={16}><path d="m6 9 6 6 6-6" /></svg>;
}
function IconeRefMais() {
  return <svg {...iconeBase()} width={16} height={16}><circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" /></svg>;
}
function IconeRefCheckPequeno() {
  return <svg {...iconeBase()} width={11} height={11} strokeWidth={3}><path d="m5 12 4.5 4.5L19 7" /></svg>;
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
  return <svg {...iconeBase()}><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" /></svg>;
}
function IconeRefBandeira() {
  return <svg {...iconeBase()} width={14} height={14}><path d="M4 21V4" /><path d="M4 5h13l-2 4 2 4H4" /></svg>;
}
function IconeRefAviaozinho() {
  return <svg {...iconeBase()} width={20} height={20} strokeWidth={1.8}><path d="m3 11 18-8-8 18-2-8-8-2Z" /></svg>;
}
function IconeRefSetaDiagonal() {
  return <svg {...iconeBase()} width={16} height={16}><path d="M7 17 17 7M7 7h10v10" /></svg>;
}
function IconeRefPessoa() {
  return <svg {...iconeBase()}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6" /></svg>;
}
function IconeRefTelefone() {
  return (
    <svg {...iconeBase()}>
      <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1.1-.24 11.3 11.3 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.3 11.3 0 0 0 .56 3.5 1 1 0 0 1-.25 1.02Z" />
    </svg>
  );
}
function IconeRefHome() {
  return <svg {...iconeBase()} width={18} height={18}><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /></svg>;
}
function IconeRefCriar() {
  return <svg {...iconeBase()} width={18} height={18}><path d="M12 5v14M5 12h14" /></svg>;
}
function IconeRefGrade() {
  return (
    <svg {...iconeBase()} width={18} height={18}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function IconeRefPerfil() {
  return <svg {...iconeBase()} width={18} height={18}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6" /></svg>;
}
