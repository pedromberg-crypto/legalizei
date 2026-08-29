import { passosDoCliente } from "@/lib/passos";
import { CUSTOS, brl } from "@/lib/fiscal";
import { CLIENTE } from "@/app/(app)/dossie/mock";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * REFERÊNCIA V4 — "discover events app" (28/08, pedido do Pedro: "use essa,
 * remova a outra")
 * ═══════════════════════════════════════════════════════════════════════════
 * 4ª referência visual. SUBSTITUI a v3 (pet-care, `referencia-petcare-v3.tsx`
 * — removida da seção, mantida no repo desconectada) em "Aplicação da
 * referência". v1/v2 idem. Regra travada: cada referência nova troca a
 * anterior inteira, nunca acumula.
 *
 * ─── O QUE A REFERÊNCIA ENSINA ─────────────────────────────────────────────
 *   · Fundo BRANCO CHAPADO (sem gradiente, sem creme) — volta ao neutro,
 *     depois de 2 referências com fundo colorido.
 *   · Cartão de imagem/conteúdo com BARRA SOBREPOSTA no rodapé — a faixa de
 *     info (data/nome/preço) fica um cartão PRÓPRIO que sobe por cima da
 *     borda inferior da imagem, não dentro do mesmo cartão.
 *   · Pill de avatares empilhados + contador ("●●● 8 Going") — prova social.
 *   · Badge de data em quadrado preto arredondado ("16 Dec").
 *   · Stepper circular (− contagem +) pra quantidade.
 *   · Rodapé combo: rótulo+valor à esquerda, CTA em pílula à direita (mesma
 *     doutrina que v1/v2 já usavam — aqui a referência CONFIRMA o padrão).
 *   · Nav inferior com um FAB circular de gradiente radial (coral) fixo no
 *     centro, sempre por cima da barra — não é o "ativo" de uma aba, é uma
 *     5ª ação permanente ("criar/abrir").
 *
 * ─── O QUE NÃO ENTROU, e por quê ──────────────────────────────────────────
 *   · SEM foto real nas telas (referência usa fotos de banco de imagem) —
 *     substituída por painel de ícone/ilustração nas cores da marca.
 *   · SEM "8 Going"/avatares empilhados nos NOSSOS cartões: não temos prova
 *     social real (nº de clientes) pra mostrar — número sem fonte não entra.
 *   · SEM pontinhos de paginação (onboarding): não é um carrossel de slides.
 *
 * ⚠️ Cores/gradientes de `PALETA` são EXPERIMENTAIS, locais deste arquivo.
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
  pretoBg: string;
  pretoTexto: string;
  sombra: string;
};

const CLARO: Paleta = {
  fundo: "#FFFFFF",
  cartao: "#FFFFFF",
  cartaoAlt: "#F4F4F6",
  textoPrimario: "#141414",
  textoSecundario: "#6B6B70",
  textoTerciario: "#9A9AA0",
  hairline: "#ECECEF",
  pretoBg: "#141414",
  pretoTexto: "#FFFFFF",
  sombra: "0 12px 30px rgba(20,20,20,0.08)",
};

const ESCURO: Paleta = {
  fundo: "#101012",
  cartao: "#1A1A1D",
  cartaoAlt: "#232326",
  textoPrimario: "#F5F5F6",
  textoSecundario: "#AFAFB6",
  textoTerciario: "#77777E",
  hairline: "#2A2A2E",
  pretoBg: "#F5F5F6",
  pretoTexto: "#141414",
  sombra: "0 12px 30px rgba(0,0,0,0.4)",
};

function paletaDe(escuro: boolean): Paleta {
  return escuro ? ESCURO : CLARO;
}

const GRADIENTE_CORAL = "radial-gradient(circle at 35% 30%, var(--color-action-primary), var(--color-action-primary-hover) 70%)";

/** Botão-círculo com contorno — voltar/compartilhar/salvar (idioma da ref). */
function BotaoContorno({ p, children }: { p: Paleta; children: React.ReactNode }) {
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
      style={{ border: `1.5px solid ${p.hairline}`, color: p.textoPrimario, background: p.cartao }}
    >
      {children}
    </span>
  );
}

/** Badge de data — quadrado preto arredondado ("16 Dec"). */
function BadgeData({ dia, mes, p }: { dia: string; mes: string; p: Paleta }) {
  return (
    <div className="flex shrink-0 flex-col items-center justify-center rounded-xl px-3 py-1.5" style={{ background: p.pretoBg }}>
      <span className="text-body-strong font-bold leading-none" style={{ color: p.pretoTexto }}>{dia}</span>
      <span className="text-micro" style={{ color: p.pretoTexto, opacity: 0.7 }}>{mes}</span>
    </div>
  );
}

/** Stepper circular (− contagem +) — pra quantidade/estado. */
function Stepper({ valor, p }: { valor: number; p: Paleta }) {
  return (
    <div className="flex shrink-0 items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full text-body font-bold" style={{ background: p.cartaoAlt, color: p.textoPrimario }}>–</span>
      <span className="w-4 text-center text-body font-bold" style={{ color: p.textoPrimario }}>{valor}</span>
      <span className="flex h-8 w-8 items-center justify-center rounded-full text-body font-bold" style={{ background: p.cartaoAlt, color: p.textoPrimario }}>+</span>
    </div>
  );
}

/** Painel de ilustração — no lugar da foto de banco de imagem da referência. */
function PainelIlustracao({ children, alto = false }: { children: React.ReactNode; alto?: boolean }) {
  return (
    <div
      className={`flex w-full items-center justify-center rounded-[24px] text-white ${alto ? "h-44" : "h-32"}`}
      style={{ background: GRADIENTE_CORAL }}
    >
      {children}
    </div>
  );
}

/* ─── NAV INFERIOR — FAB coral fixo no centro, não é "ativo" de aba. ──────── */
type RefNavId = "home" | "grade" | "perfil" | "mais";

function RefNav({ ativo, p }: { ativo: RefNavId; p: Paleta }) {
  const esquerda: { id: RefNavId; icone: React.ReactNode; label: string }[] = [
    { id: "home", icone: <IconeHome />, label: "Início" },
    { id: "grade", icone: <IconeGrade />, label: "Tudo" },
  ];
  const direita: { id: RefNavId; icone: React.ReactNode; label: string }[] = [
    { id: "perfil", icone: <IconePerfil />, label: "Perfil" },
    { id: "mais", icone: <IconeMais />, label: "Mais" },
  ];
  const Item = (it: { id: RefNavId; icone: React.ReactNode; label: string }) => (
    <span key={it.id} className="flex flex-col items-center gap-0.5" style={{ color: it.id === ativo ? p.textoPrimario : p.textoTerciario }}>
      {it.icone}
      <span className="text-[10px] font-semibold">{it.label}</span>
    </span>
  );
  return (
    <div className="relative flex items-center justify-between rounded-full px-6 pb-2 pt-3" style={{ background: p.cartao, boxShadow: p.sombra }}>
      <div className="flex gap-6">{esquerda.map(Item)}</div>
      <div className="flex gap-6">{direita.map(Item)}</div>
      {/* FAB — sempre no centro, sempre por cima da barra, ação fixa. */}
      <span
        className="absolute left-1/2 top-0 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white"
        style={{ background: GRADIENTE_CORAL, boxShadow: p.sombra }}
      >
        <IconeMais />
      </span>
    </div>
  );
}

/* ─── 1. N7 · A CONTA DA ABERTURA (modelo "Event Details") ────────────────── */

const INCLUSO_REF = [
  { titulo: "Abertura completa da empresa", sub: "Documentação, contrato social, protocolo e CNPJ." },
  { titulo: "Certificado digital", sub: "Incluso, sem custo extra." },
  { titulo: "Imposto e declarações", sub: "Guia pronta todo mês, no prazo." },
  { titulo: "Notas fiscais", sub: "Sem limite de emissão." },
];

export function ReferenciaPlano({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  const mensalidade = CUSTOS.MENSALIDADE;
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <header className="flex shrink-0 items-center justify-between px-5 pb-2" style={{ paddingTop: "var(--safe-top)" }}>
        <BotaoContorno p={p}><IconeChevronEsquerda /></BotaoContorno>
        <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>A conta da abertura</p>
        <BotaoContorno p={p}><IconeMais /></BotaoContorno>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <PainelIlustracao alto><IconePredio tamanho={48} /></PainelIlustracao>

        <h1 className="mt-4 text-h1 font-bold leading-tight" style={{ color: p.textoPrimario }}>Quanto custa manter em dia</h1>
        <p className="mt-2 text-body" style={{ color: p.textoSecundario }}>
          Sem letra miúda, sem surpresa depois. A 1ª mensalidade já é o seu 1º mês; o valor acompanha o seu
          faturamento.
        </p>

        <div className="mt-4 flex items-center gap-2 rounded-2xl px-4 py-3" style={{ background: p.cartaoAlt }}>
          <span style={{ color: p.textoSecundario }}><IconeCalendario /></span>
          <p className="text-caption" style={{ color: p.textoPrimario }}>Cobrança mensal, a partir da abertura</p>
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-2xl px-4 py-3" style={{ background: p.cartaoAlt }}>
          <span style={{ color: p.textoSecundario }}><IconeLocal /></span>
          <p className="text-caption" style={{ color: p.textoPrimario }}>Taxa da Junta Comercial: {brl(CUSTOS.DAE_JUCEMG, true)} (repasse, não é nossa margem)</p>
        </div>

        {/* LINHAS AO ESTILO "TICKET" — rótulo+preço à esquerda, sem stepper
            (é inclusão fixa, não quantidade). */}
        <p className="mb-2 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>O que está incluso</p>
        <div className="flex flex-col" style={{ borderTop: `1px solid ${p.hairline}` }}>
          {INCLUSO_REF.map((i) => (
            <div key={i.titulo} className="flex items-center justify-between py-3" style={{ borderBottom: `1px solid ${p.hairline}` }}>
              <div className="min-w-0 flex-1">
                <p className="text-body font-semibold" style={{ color: p.textoPrimario }}>{i.titulo}</p>
                <p className="text-micro" style={{ color: p.textoTerciario }}>{i.sub}</p>
              </div>
              <span className="shrink-0 text-caption font-bold" style={{ color: p.textoPrimario }}>Incluso</span>
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0 px-5 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-micro" style={{ color: p.textoTerciario }}>Você paga hoje</p>
            <p className="text-h2 font-bold" style={{ color: p.textoPrimario }}>{brl(mensalidade, true)}</p>
          </div>
          <span className="shrink-0 rounded-full px-8 py-4 text-body font-bold text-white" style={{ background: "var(--color-action-primary)" }}>
            Ótimo, continuar
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── 2. C0.1 · RETOMAR DE ONDE PAROU (modelo "Discover/Home") ────────────── */

export function ReferenciaRetomar({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  const passos = passosDoCliente();
  const concluidos = 2;

  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <header className="flex shrink-0 items-center justify-between px-5 pb-1" style={{ paddingTop: "var(--safe-top)" }}>
        <div>
          <p className="text-caption" style={{ color: p.textoTerciario }}>Continuando de onde parou</p>
          <p className="text-h2 font-bold" style={{ color: p.textoPrimario }}>Bem-vindo de volta</p>
        </div>
        <BotaoContorno p={p}><IconeSino /></BotaoContorno>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* CARTÃO COM BARRA SOBREPOSTA — mesmo idioma do "Popular Event". */}
        <div className="relative" style={{ paddingBottom: 34 }}>
          <PainelIlustracao alto><IconeBandeira tamanho={40} /></PainelIlustracao>
          <div
            className="absolute inset-x-3 bottom-0 flex items-center justify-between rounded-2xl px-4 py-3"
            style={{ background: p.cartao, boxShadow: p.sombra }}
          >
            <div className="flex items-center gap-3">
              <BadgeData dia={String(concluidos)} mes="de 10" p={p} />
              <div>
                <p className="text-body font-bold" style={{ color: p.textoPrimario }}>Empresa constituída</p>
                <p className="text-micro" style={{ color: p.textoTerciario }}>{passos[concluidos]?.nome}</p>
              </div>
            </div>
          </div>
        </div>

        {/* LISTA — mesmo idioma do "Ongoing Splits": linha simples, sem
            cartão nem ícone-circular. */}
        <div className="mt-3 flex items-center justify-between">
          <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>Onde você está</p>
        </div>
        <div className="mt-1 flex flex-col">
          {passos.map((passo, i) => {
            const feito = i < concluidos;
            const agora = i === concluidos;
            return (
              <div key={passo.tela} className="flex items-center justify-between py-3" style={{ borderBottom: `1px solid ${p.hairline}` }}>
                <div>
                  <p className="text-body" style={{ color: feito || agora ? p.textoPrimario : p.textoTerciario, fontWeight: feito || agora ? 700 : 400 }}>
                    {passo.nome}
                  </p>
                  <p className="text-micro" style={{ color: p.textoTerciario }}>Passo {i + 1} de {passos.length}</p>
                </div>
                <span
                  className="shrink-0 text-caption font-bold"
                  style={{ color: feito ? "var(--color-action-primary)" : agora ? p.textoPrimario : p.textoTerciario }}
                >
                  {feito ? "Feito" : agora ? "Agora" : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="shrink-0 px-5 pb-3">
        <span className="block w-full rounded-full py-4 text-center text-body font-bold text-white" style={{ background: "var(--color-action-primary)" }}>
          Continuar de onde parei
        </span>
      </div>
      <div className="shrink-0 px-5" style={{ paddingBottom: "calc(10px + var(--safe-bottom))" }}>
        <RefNav ativo="perfil" p={p} />
      </div>
    </div>
  );
}

/* ─── 3. E3 · FORK · 3 ROTAS (modelo "Discover" search+cards) ─────────────── */

export function ReferenciaFork({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <header className="flex shrink-0 items-center justify-between px-5 pb-1" style={{ paddingTop: "var(--safe-top)" }}>
        <div>
          <p className="text-caption" style={{ color: p.textoTerciario }}>Como a gente pode ajudar em</p>
          <p className="text-h2 font-bold" style={{ color: p.textoPrimario }}>Sua empresa</p>
        </div>
        <BotaoContorno p={p}><IconeSino /></BotaoContorno>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-2 rounded-full px-4 py-3" style={{ border: `1.5px solid ${p.hairline}` }}>
          <span style={{ color: p.textoTerciario }}><IconeEscudo /></span>
          <p className="text-caption" style={{ color: p.textoSecundario }}>Um escritório de contabilidade de verdade, em BH.</p>
        </div>

        <p className="mb-2 mt-5 text-caption font-semibold" style={{ color: p.textoTerciario }}>Escolha uma opção</p>

        {/* CARTÃO PRINCIPAL COM BARRA SOBREPOSTA — mesmo idioma do "Popular Event". */}
        <div className="relative" style={{ paddingBottom: 40 }}>
          <PainelIlustracao alto><IconeAviaozinho tamanho={40} /></PainelIlustracao>
          <div className="absolute inset-x-3 bottom-0 rounded-2xl px-4 py-3.5" style={{ background: p.cartao, boxShadow: p.sombra }}>
            <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>Quero abrir minha empresa</p>
            <p className="mt-0.5 text-micro" style={{ color: p.textoTerciario }}>Ainda não tenho CNPJ. Quero começar do zero.</p>
          </div>
        </div>

        {/* 2ª opção — mesmo idioma do "Ongoing Splits", linha simples. */}
        <div className="mt-2 flex items-center justify-between py-3" style={{ borderBottom: `1px solid ${p.hairline}` }}>
          <div>
            <p className="text-body font-bold" style={{ color: p.textoPrimario }}>Já tenho empresa</p>
            <p className="text-micro" style={{ color: p.textoTerciario }}>Tenho CNPJ e quero que vocês cuidem da contabilidade.</p>
          </div>
          <span style={{ color: p.textoTerciario }}><IconeChevronDireita /></span>
        </div>

        <p className="mt-4 text-center text-caption" style={{ color: p.textoSecundario }}>
          Já é cliente? <span className="font-bold" style={{ color: p.textoPrimario }}>Entrar na minha conta</span>
        </p>
      </div>

      <div className="shrink-0 px-5" style={{ paddingBottom: "calc(10px + var(--safe-bottom))" }}>
        <RefNav ativo="home" p={p} />
      </div>
    </div>
  );
}

/* ─── 4. C1 · SEUS DADOS (extensão pro campo de formulário) ────────────────── */

function CampoRef({ rotulo, placeholder, p }: { rotulo: string; placeholder: string; p: Paleta }) {
  return (
    <label className="block">
      <span className="text-caption font-semibold" style={{ color: p.textoPrimario }}>{rotulo}</span>
      <div className="mt-1.5 flex min-h-12 items-center rounded-2xl px-4 text-body" style={{ background: p.cartaoAlt, color: p.textoTerciario }}>
        {placeholder}
      </div>
    </label>
  );
}

export function ReferenciaDadosPessoais({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <header className="flex shrink-0 items-center justify-between px-5 pb-2" style={{ paddingTop: "var(--safe-top)" }}>
        <BotaoContorno p={p}><IconeChevronEsquerda /></BotaoContorno>
        <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>Seus dados</p>
        <BotaoContorno p={p}><IconeMais /></BotaoContorno>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <h1 className="text-h1 font-bold leading-tight" style={{ color: p.textoPrimario }}>Seus dados</h1>
        <p className="mt-1 text-body" style={{ color: p.textoSecundario }}>Confira o que você já preencheu e complete o resto.</p>

        <p className="mb-1 mt-4 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Já preenchido</p>
        <div className="flex flex-col" style={{ borderTop: `1px solid ${p.hairline}` }}>
          {[
            { rotulo: "Nome", valor: CLIENTE.nome },
            { rotulo: "CPF", valor: CLIENTE.cpf },
            { rotulo: "Telefone", valor: CLIENTE.telefone },
            { rotulo: "Endereço", valor: CLIENTE.endereco },
          ].map((linha) => (
            <div key={linha.rotulo} className="flex items-center justify-between py-3" style={{ borderBottom: `1px solid ${p.hairline}` }}>
              <span className="text-caption" style={{ color: p.textoTerciario }}>{linha.rotulo}</span>
              <span className="text-body font-semibold" style={{ color: p.textoPrimario }}>{linha.valor}</span>
            </div>
          ))}
        </div>

        <p className="mb-2.5 mt-5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Falta completar</p>
        <div className="grid grid-cols-2 gap-3">
          <CampoRef rotulo="RG" placeholder="00.000.000" p={p} />
          <CampoRef rotulo="Órgão emissor" placeholder="SSP/MG" p={p} />
        </div>
        <div className="mt-3"><CampoRef rotulo="Data de nascimento" placeholder="DD/MM/AAAA" p={p} /></div>
        <div className="mt-3"><CampoRef rotulo="Nome da mãe" placeholder="Nome completo" p={p} /></div>
        <div className="mt-3">
          <label className="block">
            <span className="text-caption font-semibold" style={{ color: p.textoPrimario }}>Estado civil</span>
            <div className="mt-1.5 flex min-h-12 items-center justify-between rounded-2xl px-4 text-body" style={{ background: p.cartaoAlt, color: p.textoTerciario }}>
              Selecione
              <IconeChevronBaixo />
            </div>
          </label>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: p.cartaoAlt }}>
          <p className="text-caption" style={{ color: p.textoSecundario }}>Quantos sócios além de você?</p>
          <Stepper valor={0} p={p} />
        </div>
      </div>

      <div className="shrink-0 px-5 pb-4">
        <span className="block w-full rounded-full py-4 text-center text-body font-bold text-white opacity-50" style={{ background: "var(--color-action-primary)" }}>
          Continuar
        </span>
      </div>
    </div>
  );
}

/* ─── 5. HOME CAMPEÃ (dia-1) — os 7 blocos reais, casca da referência ─────── */

/** Cabeçalho de seção — título + "Ver tudo", mesmo padrão de toda a Home real. */
function CabecalhoSecao({ titulo, p }: { titulo: string; p: Paleta }) {
  return (
    <div className="mb-2.5 flex items-center justify-between">
      <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>{titulo}</p>
      <span className="text-caption font-semibold" style={{ color: p.textoTerciario }}>Ver tudo</span>
    </div>
  );
}

const ATALHOS_REF = [
  { titulo: "Emitir nota", sub: "Sua NF-e em segundos", icone: <IconeDoc />, ativo: true },
  { titulo: "Pagar imposto", sub: "O DAS do mês, no app", icone: <IconeCalendario /> },
  { titulo: "Meu pró-labore", sub: "Mexa e veja o imposto", icone: <IconeCarteira /> },
  { titulo: "Documentos", sub: "Contrato, certidões", icone: <IconePasta /> },
];

const NOTAS_REF = [
  { nome: "Maria Costa", numero: "0012", valor: "R$ 1.200,00", quando: "há 2h" },
  { nome: "João Lima", numero: "0011", valor: "R$ 3.000,00", quando: "28/05" },
  { nome: "Rita Souza", numero: "0010", valor: "R$ 850,00", quando: "22/05" },
];

const POSTS_REF = [
  { tag: "FISCAL", titulo: "Entenda o Fator R sem dor de cabeça", meta: "3 min de leitura" },
  { tag: "GUIA", titulo: "Sua 1ª nota fiscal, passo a passo", meta: "2 min de leitura" },
  { tag: "NOVIDADE", titulo: "Reforma tributária 2026: o que muda", meta: "5 min de leitura" },
];

/**
 * 🆕 28/08 (pedido do Pedro: "vamos colocar mais uma página muito importante
 * ... a nossa home campeão") — os 7 blocos REAIS de `/home-campea`
 * (`CabecalhoCampea`, `ProximoCompromisso`, `AtalhosRapidos`,
 * `NotasRecentesMov`, `Vigilancia`, `AprendaGradiente`, `QuemCuida`),
 * reconstruídos com a casca da referência 4. Copy/dados idênticos aos
 * componentes reais (`campea-blocks.tsx`/`ref9-blocks.tsx`/
 * `vigilancia-blocks.tsx`/`ref11-blocks.tsx`) — nada inventado, só a
 * execução visual muda.
 */
export function ReferenciaHomeCampea({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingTop: "var(--safe-top)" }}>
        {/* 1. CABEÇALHO — saudação + sino/avatar + pill de CNPJ copiável. */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-caption" style={{ color: p.textoTerciario }}>Bem-vinda de volta,</p>
            <p className="text-h2 font-bold" style={{ color: p.textoPrimario }}>Ana Beatriz</p>
          </div>
          <div className="flex items-center gap-2">
            <BotaoContorno p={p}><IconeSino /></BotaoContorno>
            <span className="flex h-10 w-10 items-center justify-center rounded-full text-caption font-bold text-white" style={{ background: "var(--color-action-primary)" }}>AB</span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-full px-4 py-2.5" style={{ border: `1.5px solid ${p.hairline}` }}>
          <span className="text-caption font-semibold" style={{ color: p.textoSecundario }}>54.321.000/0001-09</span>
          <span style={{ color: p.textoTerciario }}><IconeCopiar /></span>
        </div>

        {/* 2. PRÓXIMO COMPROMISSO — cartão com barra sobreposta + CTA. */}
        <div className="mt-6">
          <CabecalhoSecao titulo="Seu próximo compromisso" p={p} />
          <div className="relative" style={{ paddingBottom: 44 }}>
            <PainelIlustracao alto><IconeCalendario /></PainelIlustracao>
            <div className="absolute inset-x-3 bottom-0 rounded-2xl px-4 py-3" style={{ background: p.cartao, boxShadow: p.sombra }}>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-micro" style={{ color: p.textoTerciario }}>Hoje · vence 20/07</p>
                  <p className="text-body font-bold" style={{ color: p.textoPrimario }}>DAS de junho</p>
                </div>
                <span className="shrink-0 text-body-strong font-bold" style={{ color: p.textoPrimario }}>R$ 178,31</span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-micro" style={{ color: p.textoTerciario }}>A gente já gerou pra você</p>
                <span className="shrink-0 rounded-full px-4 py-1.5 text-micro font-bold text-white" style={{ background: p.pretoBg, color: p.pretoTexto }}>Pagar</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. ATALHOS RÁPIDOS — grade 2×2, 1º ativo em coral (mesmo dado real). */}
        <div className="mt-6">
          <CabecalhoSecao titulo="Atalhos rápidos" p={p} />
          <div className="grid grid-cols-2 gap-2.5">
            {ATALHOS_REF.map((a) => (
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

        {/* 4. NOTAS RECENTES — linhas simples, mesmo idioma do "Ongoing Splits". */}
        <div className="mt-6">
          <CabecalhoSecao titulo="Notas recentes" p={p} />
          <div className="flex flex-col">
            {NOTAS_REF.map((n, idx) => (
              <div key={n.numero} className="flex items-center justify-between py-3" style={idx > 0 ? { borderTop: `1px solid ${p.hairline}` } : undefined}>
                <div>
                  <p className="text-body font-semibold" style={{ color: p.textoPrimario }}>Nota #{n.numero} · {n.nome}</p>
                  <p className="text-micro" style={{ color: p.textoTerciario }}>{n.quando}</p>
                </div>
                <span className="shrink-0 text-body font-bold" style={{ color: p.textoPrimario }}>{n.valor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. VIGILÂNCIA FISCAL — barra + 2 linhas + alerta. */}
        <div className="mt-6">
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>Sua vigília fiscal</p>
            <span className="text-caption font-semibold" style={{ color: p.textoTerciario }}>Entender</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-caption" style={{ color: p.textoSecundario }}>Uso do teto do Simples</p>
            <p className="text-caption font-bold" style={{ color: p.textoPrimario }}>11%</p>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full" style={{ background: p.cartaoAlt }}>
            <div className="h-full rounded-full" style={{ width: "11%", background: "var(--color-action-primary)" }} />
          </div>
          <p className="mt-1.5 text-micro" style={{ color: p.textoTerciario }}>Faltam R$ 321.600 pro limite. Tranquilo.</p>

          <div className="mt-3 flex gap-2.5">
            <div className="flex-1 rounded-2xl px-4 py-3" style={{ background: p.cartaoAlt }}>
              <p className="text-micro" style={{ color: p.textoTerciario }}>Sua alíquota</p>
              <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>6%</p>
              <p className="text-micro" style={{ color: p.textoTerciario }}>a menor possível</p>
            </div>
            <div className="flex-1 rounded-2xl px-4 py-3" style={{ background: p.cartaoAlt }}>
              <p className="text-micro" style={{ color: p.textoTerciario }}>Fator R</p>
              <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>37%</p>
              <p className="text-micro" style={{ color: p.textoTerciario }}>folha ÷ faturamento</p>
            </div>
          </div>

          <div className="mt-2.5 flex items-start gap-2.5 rounded-2xl px-4 py-3" style={{ background: p.cartaoAlt }}>
            <span className="mt-0.5 shrink-0" style={{ color: p.textoSecundario }}><IconeOlho /></span>
            <p className="text-caption" style={{ color: p.textoSecundario }}>
              <b style={{ color: p.textoPrimario }}>De olho:</b> se você voltar a faturar cheio, o Fator R muda e a
              alíquota pode subir pra 15,5%. A gente te avisa antes de acontecer.
            </p>
          </div>
        </div>

        {/* 6. APRENDA COM A GENTE — cartões escuros com tag + título + meta. */}
        <div className="mt-6">
          <CabecalhoSecao titulo="Aprenda com a gente" p={p} />
          <div className="flex gap-2.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {POSTS_REF.map((post) => (
              <div key={post.titulo} className="w-40 shrink-0 rounded-2xl p-3.5" style={{ background: p.pretoBg }}>
                <span className="inline-block rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ background: "rgba(255,255,255,0.15)", color: p.pretoTexto }}>
                  {post.tag}
                </span>
                <p className="mt-2 text-caption font-bold leading-snug" style={{ color: p.pretoTexto }}>{post.titulo}</p>
                <p className="mt-1 text-[10px]" style={{ color: p.pretoTexto, opacity: 0.6 }}>{post.meta}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 7. QUEM CUIDA DE VOCÊ — cartão com avatares empilhados + CTA. */}
        <div className="mt-6">
          <CabecalhoSecao titulo="Quem cuida de você" p={p} />
          <div className="rounded-2xl p-4" style={{ background: p.cartaoAlt }}>
            <p className="text-micro" style={{ color: p.textoTerciario }}>Seu time</p>
            <p className="mt-0.5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Contadores cuidando do seu CNPJ</p>
            <p className="mt-1 text-caption" style={{ color: p.textoSecundario }}>
              Impostos, declarações e prazos, por nossa conta. Você só aprova.
            </p>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex -space-x-2">
                {["JS", "MF", "CL"].map((iniciais) => (
                  <span key={iniciais} className="flex h-8 w-8 items-center justify-center rounded-full text-micro font-bold text-white ring-2" style={{ background: p.pretoBg, color: p.pretoTexto, borderColor: p.fundo }}>
                    {iniciais}
                  </span>
                ))}
                <span className="flex h-8 w-8 items-center justify-center rounded-full text-micro font-bold ring-2" style={{ background: p.cartao, color: p.textoSecundario, borderColor: p.fundo }}>
                  +5
                </span>
              </div>
              <span className="text-caption font-bold" style={{ color: "var(--color-action-primary)" }}>Falar no WhatsApp</span>
            </div>
          </div>
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
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}
function IconeChevronEsquerda() { return <svg {...iconeBase(16)}><path d="m15 18-6-6 6-6" /></svg>; }
function IconeChevronDireita() { return <svg {...iconeBase(16)}><path d="m9 18 6-6-6-6" /></svg>; }
function IconeChevronBaixo() { return <svg {...iconeBase(16)}><path d="m6 9 6 6 6-6" /></svg>; }
function IconeMais() { return <svg {...iconeBase(18)}><path d="M12 5v14M5 12h14" /></svg>; }
function IconeSino() {
  return (
    <svg {...iconeBase(16)}>
      <path d="M6 8a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}
function IconeCalendario() {
  return (
    <svg {...iconeBase(16)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}
function IconeLocal() {
  return (
    <svg {...iconeBase(16)}>
      <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  );
}
function IconeEscudo() { return <svg {...iconeBase(16)}><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5Z" /></svg>; }
function IconePredio({ tamanho = 18 }: { tamanho?: number }) {
  return (
    <svg {...iconeBase(tamanho)} strokeWidth={1.6}>
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9v.01M9 12v.01M9 15v.01" />
    </svg>
  );
}
function IconeBandeira({ tamanho = 18 }: { tamanho?: number }) {
  return <svg {...iconeBase(tamanho)} strokeWidth={1.6}><path d="M4 21V4" /><path d="M4 5h13l-2 4 2 4H4" /></svg>;
}
function IconeAviaozinho({ tamanho = 18 }: { tamanho?: number }) {
  return <svg {...iconeBase(tamanho)} strokeWidth={1.6}><path d="m3 11 18-8-8 18-2-8-8-2Z" /></svg>;
}
function IconeHome() { return <svg {...iconeBase(20)}><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /></svg>; }
function IconeGrade() {
  return (
    <svg {...iconeBase(20)}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function IconePerfil() { return <svg {...iconeBase(20)}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6" /></svg>; }
function IconeDoc() {
  return (
    <svg {...iconeBase(18)}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6M9 17h6" />
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
function IconeOlho() {
  return (
    <svg {...iconeBase(16)}>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
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
