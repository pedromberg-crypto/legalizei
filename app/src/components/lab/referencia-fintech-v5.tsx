import { passosDoCliente } from "@/lib/passos";
import { CUSTOS, brl } from "@/lib/fiscal";
import { CLIENTE } from "@/app/(app)/dossie/mock";
import { Logo } from "@/components/logo";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * REFERÊNCIA V5 — "Payoutly, fintech app" (28/08, pedido do Pedro)
 * ═══════════════════════════════════════════════════════════════════════════
 * 5ª referência visual. SUBSTITUI a v4 (discover events,
 * `referencia-eventos-v4.tsx` — removida, mantida no repo desconectada) em
 * "Aplicação da referência". v1/v2/v3 idem. Regra travada: cada referência
 * nova troca a anterior inteira, nunca acumula.
 *
 * ─── O QUE A REFERÊNCIA ENSINA ─────────────────────────────────────────────
 *   · LIMA (#D6FF4F-ish) como cor de ação — chapada, texto ESCURO em cima
 *     (nunca branco), contraste alto de propósito.
 *   · Herói ESCURO com padrão de anéis concêntricos sutis nos cantos — usado
 *     só na tela de entrada (onboarding), não em telas funcionais.
 *   · "Cartão de saldo": rótulo pequeno em cima, valor GRANDE embaixo, linha
 *     de metadado (2 colunas) no rodapé — com o próximo cartão espiando
 *     cortado na borda direita (carrossel).
 *   · Linha de transação: ícone-em-círculo + nome/hora à esquerda, valor à
 *     direita — dentro de um painel tipo "bottom sheet" (alça arrastável no
 *     topo, título + "Ver tudo").
 *   · Fileira de 4 AÇÕES em círculo (não cartão-tile): ícone-em-círculo +
 *     rótulo embaixo, lado a lado, sem fundo colorido de destaque.
 *   · Campo de formulário com rótulo pequeno + asterisco vermelho (se
 *     obrigatório) grudado no rótulo, valor abaixo, borda fina.
 *   · Nav inferior: abas neutras + FAB lima central, sempre por cima da
 *     barra (mesma ideia da v4, cor/forma diferentes).
 *
 * ─── O QUE NÃO ENTROU, e por quê ──────────────────────────────────────────
 *   · SEM login social (Facebook/Google/Apple) no Fork: não temos esses
 *     métodos de entrada, inventar botão que não funciona é pior que omitir.
 *   · SEM prova social/saldo fictício: todo R$ que aparece vem de `CUSTOS`.
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
  sombra: string;
};

const CLARO: Paleta = {
  fundo: "#F6F8F1",
  cartao: "#FFFFFF",
  cartaoAlt: "#EFF2E8",
  textoPrimario: "#141712",
  textoSecundario: "#666B60",
  textoTerciario: "#95998E",
  hairline: "#E6EADD",
  sombra: "0 10px 28px rgba(20,23,18,0.06)",
};

const ESCURO: Paleta = {
  fundo: "#101210",
  cartao: "#1B1E19",
  cartaoAlt: "#242821",
  textoPrimario: "#F2F5EC",
  textoSecundario: "#A9AEA0",
  textoTerciario: "#767B70",
  hairline: "#2C302A",
  sombra: "0 10px 28px rgba(0,0,0,0.4)",
};

function paletaDe(escuro: boolean): Paleta {
  return escuro ? ESCURO : CLARO;
}

const LIMA = "#D6FF4F";
const LIMA_TEXTO = "#14170F";
const PRETO_HERO = "#0C0D0B";

/* ─── HERÓI ESCURO — anéis concêntricos + marca. Fixo escuro (a referência
   só mostra 1 versão dessa tela, e é sempre escura, faça ou não parte do
   `escuro` geral). ─────────────────────────────────────────────────────── */
function HeroEscuro({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative overflow-hidden rounded-b-[32px] px-6 pb-8"
      style={{ background: PRETO_HERO, paddingTop: "calc(var(--safe-top) + 12px)" }}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full"
        style={{ background: `repeating-radial-gradient(circle, transparent 0, transparent 10px, rgba(214,255,79,0.06) 11px, transparent 12px)` }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full"
        style={{ background: `repeating-radial-gradient(circle, transparent 0, transparent 10px, rgba(255,255,255,0.05) 11px, transparent 12px)` }}
        aria-hidden
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/** "Cartão de saldo" — rótulo + valor grande + linha de metadado 2 colunas,
 *  com o próximo cartão espiando cortado na borda direita. */
function CartaoSaldo({
  p,
  badge,
  marca,
  rotulo,
  valor,
  metaEsq,
  metaDir,
}: {
  p: Paleta;
  badge: React.ReactNode;
  marca: React.ReactNode;
  rotulo: string;
  valor: string;
  metaEsq: { rotulo: string; valor: string };
  metaDir: { rotulo: string; valor: string };
}) {
  return (
    <div className="relative">
      {/* Espia do próximo cartão, cortado na borda direita — idioma do carrossel. */}
      <div className="absolute right-[-14px] top-2 h-[92%] w-8 rounded-l-2xl" style={{ background: p.cartaoAlt }} aria-hidden />
      <div className="relative overflow-hidden rounded-[24px] p-5" style={{ background: p.cartao, boxShadow: p.sombra }}>
        <div className="flex items-center justify-between">
          {badge}
          {marca}
        </div>
        <p className="mt-4 text-caption" style={{ color: p.textoTerciario }}>{rotulo}</p>
        <p className="text-h1 font-bold leading-tight" style={{ color: p.textoPrimario }}>{valor}</p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-micro" style={{ color: p.textoTerciario }}>{metaEsq.rotulo}</p>
            <p className="text-caption font-semibold" style={{ color: p.textoPrimario }}>{metaEsq.valor}</p>
          </div>
          <div className="text-right">
            <p className="text-micro" style={{ color: p.textoTerciario }}>{metaDir.rotulo}</p>
            <p className="text-caption font-semibold" style={{ color: p.textoPrimario }}>{metaDir.valor}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Painel tipo "bottom sheet" — alça no topo + título/"Ver tudo". */
function PainelSheet({ p, titulo, verTudo = true, children }: { p: Paleta; titulo: string; verTudo?: boolean; children: React.ReactNode }) {
  return (
    <div className="rounded-t-[28px] px-5 pb-4 pt-3" style={{ background: p.cartao, boxShadow: p.sombra }}>
      <div className="mb-3 flex justify-center">
        <span className="h-1 w-9 rounded-full" style={{ background: p.hairline }} />
      </div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>{titulo}</p>
        {verTudo && <span className="text-caption font-semibold underline" style={{ color: p.textoSecundario }}>Ver tudo</span>}
      </div>
      {children}
    </div>
  );
}

/** Linha de transação — ícone-em-círculo + nome/meta à esquerda, valor à direita. */
function LinhaTransacao({ p, icone, titulo, meta, valor }: { p: Paleta; icone: React.ReactNode; titulo: string; meta: string; valor: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: p.cartaoAlt, color: p.textoPrimario }}>
        {icone}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body font-semibold" style={{ color: p.textoPrimario }}>{titulo}</p>
        <p className="text-micro" style={{ color: p.textoTerciario }}>{meta}</p>
      </div>
      <span className="shrink-0 text-body font-bold" style={{ color: p.textoPrimario }}>{valor}</span>
    </div>
  );
}

/** Fileira de ações em círculo — ícone-em-círculo + rótulo embaixo, sem tile. */
function AcoesCirculo({ p, itens }: { p: Paleta; itens: { icone: React.ReactNode; label: string }[] }) {
  return (
    <div className="flex items-start justify-between">
      {itens.map((it) => (
        <div key={it.label} className="flex flex-col items-center gap-1.5">
          <span className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: p.cartaoAlt, color: p.textoPrimario }}>
            {it.icone}
          </span>
          <span className="text-micro font-semibold" style={{ color: p.textoSecundario }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

/** Campo de formulário — rótulo pequeno + asterisco, valor abaixo, borda fina. */
function CampoAuth({ p, rotulo, valor, obrigatorio = true }: { p: Paleta; rotulo: string; valor: string; obrigatorio?: boolean }) {
  return (
    <div className="rounded-2xl px-4 py-2.5" style={{ border: `1.5px solid ${p.hairline}` }}>
      <p className="text-micro" style={{ color: p.textoTerciario }}>
        {rotulo} {obrigatorio && <span style={{ color: "#E0475C" }}>*</span>}
      </p>
      <p className="text-body" style={{ color: p.textoPrimario }}>{valor}</p>
    </div>
  );
}

/** Botão lima — CTA cheio, texto sempre escuro (contraste alto de propósito). */
function BotaoLima({ children, opaco = false }: { children: React.ReactNode; opaco?: boolean }) {
  return (
    <span
      className="block w-full rounded-2xl py-4 text-center text-body font-bold"
      style={{ background: LIMA, color: LIMA_TEXTO, opacity: opaco ? 0.5 : 1 }}
    >
      {children}
    </span>
  );
}

/* ─── NAV INFERIOR — FAB lima fixo no centro. ──────────────────────────────── */
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
      <span
        className="absolute left-1/2 top-0 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
        style={{ background: LIMA, color: LIMA_TEXTO, boxShadow: p.sombra }}
      >
        <IconeMaisGrosso />
      </span>
    </div>
  );
}

/* ─── 1. N7 · A CONTA DA ABERTURA (modelo "cartão de saldo") ──────────────── */

const INCLUSO_REF = [
  { titulo: "Abertura", icone: <IconePredio /> },
  { titulo: "Certificado", icone: <IconeCadeado /> },
  { titulo: "Impostos", icone: <IconeDoc /> },
  { titulo: "Notas", icone: <IconeRaio /> },
];

export function ReferenciaPlano({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  const mensalidade = CUSTOS.MENSALIDADE;
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingTop: "calc(var(--safe-top) + 8px)" }}>
        <p className="text-caption" style={{ color: p.textoTerciario }}>A conta da abertura</p>
        <h1 className="mt-0.5 text-h1 font-bold leading-tight" style={{ color: p.textoPrimario }}>Quanto custa manter em dia</h1>

        <div className="mt-5">
          <CartaoSaldo
            p={p}
            badge={
              <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: p.cartaoAlt }}>
                <span className="h-2 w-2 rounded-full" style={{ background: LIMA }} />
                <span className="text-micro font-semibold" style={{ color: p.textoPrimario }}>Plano único</span>
              </span>
            }
            marca={<span className="text-caption font-bold italic" style={{ color: p.textoTerciario }}>LEGALIZAI</span>}
            rotulo="Depois, todo mês"
            valor={brl(mensalidade)}
            metaEsq={{ rotulo: "Cobrança", valor: "Mensal" }}
            metaDir={{ rotulo: "Taxa Junta", valor: brl(CUSTOS.DAE_JUCEMG, true) }}
          />
        </div>

        <p className="mb-2.5 mt-6 text-body-strong font-bold" style={{ color: p.textoPrimario }}>O que está incluso</p>
        <AcoesCirculo p={p} itens={INCLUSO_REF.map((i) => ({ icone: i.icone, label: i.titulo }))} />

        <p className="mt-5 text-caption" style={{ color: p.textoSecundario }}>
          A 1ª mensalidade já é o seu 1º mês. O valor acompanha o seu faturamento.
        </p>
      </div>

      <div className="shrink-0 px-6 pb-4">
        <div className="mb-2.5 flex items-baseline justify-between">
          <span className="text-caption" style={{ color: p.textoTerciario }}>Você paga hoje</span>
          <span className="text-h2 font-bold" style={{ color: p.textoPrimario }}>{brl(mensalidade, true)}</span>
        </div>
        <BotaoLima>Ótimo, continuar</BotaoLima>
      </div>
    </div>
  );
}

/* ─── 2. C0.1 · RETOMAR DE ONDE PAROU (modelo "Home" + bottom sheet) ──────── */

export function ReferenciaRetomar({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  const passos = passosDoCliente();
  const concluidos = 2;

  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="flex shrink-0 items-center justify-between px-6 pb-3" style={{ paddingTop: "calc(var(--safe-top) + 8px)" }}>
        <div>
          <p className="text-caption" style={{ color: p.textoTerciario }}>Bem-vindo de volta 🔥</p>
          <p className="text-h2 font-bold" style={{ color: p.textoPrimario }}>{CLIENTE.nome.split(" ")[0]}</p>
        </div>
        <span className="relative flex h-11 w-11 items-center justify-center rounded-full" style={{ background: p.cartao, boxShadow: p.sombra, color: p.textoPrimario }}>
          <IconeSino />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full" style={{ background: "#E0475C" }} />
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <p className="mb-2.5 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Seu progresso</p>
        <CartaoSaldo
          p={p}
          badge={
            <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: p.cartaoAlt }}>
              <IconeBandeira />
              <span className="text-micro font-semibold" style={{ color: p.textoPrimario }}>Constituição</span>
            </span>
          }
          marca={<span className="text-caption font-bold" style={{ color: p.textoTerciario }}>{Math.round((concluidos / passos.length) * 100)}%</span>}
          rotulo="Você está em"
          valor={`${concluidos} de ${passos.length} passos`}
          metaEsq={{ rotulo: "Agora", valor: passos[concluidos]?.nome ?? "—" }}
          metaDir={{ rotulo: "Saiu há", valor: "6 dias" }}
        />
      </div>

      <div className="shrink-0">
        <PainelSheet p={p} titulo="Onde você está">
          <div className="max-h-[220px] overflow-y-auto pr-1" style={{ borderTop: `1px solid ${p.hairline}` }}>
            {passos.map((passo, i) => {
              const feito = i < concluidos;
              const agora = i === concluidos;
              return (
                <div key={passo.tela} style={{ borderBottom: `1px solid ${p.hairline}` }}>
                  <LinhaTransacao
                    p={p}
                    icone={feito ? <IconeCheck /> : <span className="text-caption font-bold">{i + 1}</span>}
                    titulo={passo.nome}
                    meta={agora ? "Agora" : feito ? "Feito" : `Passo ${i + 1}`}
                    valor=""
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-3">
            <BotaoLima>Continuar de onde parei</BotaoLima>
          </div>
        </PainelSheet>
      </div>
    </div>
  );
}

/* ─── 3. E3 · FORK · 3 ROTAS (modelo herói escuro + sheet) ────────────────── */

export function ReferenciaFork({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <HeroEscuro>
        <div className="flex flex-col items-center pb-2 pt-6 text-center">
          <Logo className="h-9 w-auto" variante="escura" />
          <h1 className="mt-6 text-h1 font-bold leading-tight text-white">
            Como a gente pode te ajudar?
          </h1>
        </div>
      </HeroEscuro>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-2 rounded-2xl px-4 py-3" style={{ background: p.cartaoAlt }}>
          <span style={{ color: p.textoSecundario }}><IconeEscudo /></span>
          <p className="text-caption" style={{ color: p.textoSecundario }}>Um escritório de contabilidade de verdade, em BH.</p>
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          <div className="rounded-2xl p-4" style={{ background: p.cartao, boxShadow: p.sombra }}>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ background: LIMA, color: LIMA_TEXTO }}>
                <IconeAviaozinho />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>Quero abrir minha empresa</p>
                <p className="text-micro" style={{ color: p.textoTerciario }}>Ainda não tenho CNPJ. Quero começar do zero.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4" style={{ border: `1.5px solid ${p.hairline}` }}>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ background: p.cartaoAlt, color: p.textoPrimario }}>
                <IconePredio />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>Já tenho empresa</p>
                <p className="text-micro" style={{ color: p.textoTerciario }}>Tenho CNPJ e quero que vocês cuidem da contabilidade.</p>
              </div>
              <span style={{ color: p.textoTerciario }}><IconeChevronDireita /></span>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-caption" style={{ color: p.textoSecundario }}>
          Já é cliente? <span className="font-bold" style={{ color: p.textoPrimario }}>Entrar na minha conta</span>
        </p>
      </div>

      <div className="shrink-0 px-6" style={{ paddingBottom: "calc(10px + var(--safe-bottom))" }}>
        <RefNav ativo="home" p={p} />
      </div>
    </div>
  );
}

/* ─── 4. C1 · SEUS DADOS (modelo "campo de auth") ─────────────────────────── */

export function ReferenciaDadosPessoais({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingTop: "calc(var(--safe-top) + 12px)" }}>
        <h1 className="text-h1 font-bold leading-tight" style={{ color: p.textoPrimario }}>Seus dados</h1>
        <p className="mt-1 text-body" style={{ color: p.textoSecundario }}>Confira o que você já preencheu e complete o resto.</p>

        <div className="mt-4 rounded-2xl p-4" style={{ background: p.cartaoAlt }}>
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
          <CampoAuth p={p} rotulo="RG" valor="00.000.000" />
          <CampoAuth p={p} rotulo="Órgão emissor" valor="SSP/MG" />
        </div>
        <div className="mt-2.5"><CampoAuth p={p} rotulo="Data de nascimento" valor="DD/MM/AAAA" /></div>
        <div className="mt-2.5"><CampoAuth p={p} rotulo="Nome da mãe" valor="Nome completo" /></div>
        <div className="mt-2.5"><CampoAuth p={p} rotulo="Estado civil" valor="Selecione" /></div>

        <p className="mt-3 text-micro" style={{ color: p.textoTerciario }}>
          Pelo menos RG, data de nascimento e nome da mãe são obrigatórios.
        </p>
      </div>

      <div className="shrink-0 px-6 pb-4">
        <BotaoLima opaco>Continuar</BotaoLima>
      </div>
    </div>
  );
}

/* ─── 5. HOME CAMPEÃ (dia-1) — os 7 blocos reais, casca da referência ─────── */

const ATALHOS_REF = [
  { titulo: "Emitir nota", icone: <IconeDoc /> },
  { titulo: "Pagar imposto", icone: <IconeCalendario /> },
  { titulo: "Pró-labore", icone: <IconeCarteira /> },
  { titulo: "Documentos", icone: <IconePasta /> },
];

const NOTAS_REF = [
  { nome: "Maria Costa", numero: "0012", valor: "R$ 1.200,00", quando: "há 2h" },
  { nome: "João Lima", numero: "0011", valor: "R$ 3.000,00", quando: "28/05" },
  { nome: "Rita Souza", numero: "0010", valor: "R$ 850,00", quando: "22/05" },
];

export function ReferenciaHomeCampea({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="flex shrink-0 items-center justify-between px-6 pb-3" style={{ paddingTop: "calc(var(--safe-top) + 8px)" }}>
        <div>
          <p className="text-caption" style={{ color: p.textoTerciario }}>Bem-vinda de volta 🔥</p>
          <p className="text-h2 font-bold" style={{ color: p.textoPrimario }}>Ana Beatriz</p>
        </div>
        <span className="relative flex h-11 w-11 items-center justify-center rounded-full" style={{ background: p.cartao, boxShadow: p.sombra, color: p.textoPrimario }}>
          <IconeSino />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full" style={{ background: "#E0475C" }} />
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <p className="mb-2.5 text-caption font-semibold" style={{ color: p.textoTerciario }}>Seu próximo compromisso</p>
        <CartaoSaldo
          p={p}
          badge={
            <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: p.cartaoAlt }}>
              <IconeCalendario />
              <span className="text-micro font-semibold" style={{ color: p.textoPrimario }}>Hoje</span>
            </span>
          }
          marca={<span className="text-caption font-bold" style={{ color: p.textoTerciario }}>DAS</span>}
          rotulo="DAS de junho"
          valor={brl(178.31, true)}
          metaEsq={{ rotulo: "Vence", valor: "20/07" }}
          metaDir={{ rotulo: "Status", valor: "Gerado" }}
        />
        <div className="mt-2.5">
          <BotaoLima>Pagar</BotaoLima>
        </div>

        <p className="mb-2.5 mt-6 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Atalhos rápidos</p>
        <AcoesCirculo p={p} itens={ATALHOS_REF.map((a) => ({ icone: a.icone, label: a.titulo }))} />

        <div className="mt-6">
          <PainelSheet p={p} titulo="Notas recentes">
            <div style={{ borderTop: `1px solid ${p.hairline}` }}>
              {NOTAS_REF.map((n, idx) => (
                <div key={n.numero} style={idx > 0 ? { borderTop: `1px solid ${p.hairline}` } : undefined}>
                  <LinhaTransacao p={p} icone={<IconeDoc />} titulo={`Nota #${n.numero} · ${n.nome}`} meta={n.quando} valor={n.valor} />
                </div>
              ))}
            </div>
          </PainelSheet>
        </div>

        <div className="mt-6 rounded-2xl p-4" style={{ background: p.cartaoAlt }}>
          <div className="flex items-center justify-between">
            <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>Sua vigília fiscal</p>
            <span className="text-caption font-semibold underline" style={{ color: p.textoSecundario }}>Entender</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-caption" style={{ color: p.textoSecundario }}>Uso do teto do Simples</p>
            <p className="text-caption font-bold" style={{ color: p.textoPrimario }}>11%</p>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full" style={{ background: p.cartao }}>
            <div className="h-full rounded-full" style={{ width: "11%", background: LIMA }} />
          </div>
          <div className="mt-3 flex gap-2.5">
            <div className="flex-1 rounded-xl p-3" style={{ background: p.cartao }}>
              <p className="text-micro" style={{ color: p.textoTerciario }}>Sua alíquota</p>
              <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>6%</p>
            </div>
            <div className="flex-1 rounded-xl p-3" style={{ background: p.cartao }}>
              <p className="text-micro" style={{ color: p.textoTerciario }}>Fator R</p>
              <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>37%</p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl p-4" style={{ background: PRETO_HERO }}>
          <p className="text-micro" style={{ color: "rgba(255,255,255,0.6)" }}>Seu time</p>
          <p className="mt-0.5 text-body-strong font-bold text-white">Contadores cuidando do seu CNPJ</p>
          <p className="mt-1 text-caption" style={{ color: "rgba(255,255,255,0.7)" }}>
            Impostos, declarações e prazos, por nossa conta. Você só aprova.
          </p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex -space-x-2">
              {["JS", "MF", "CL"].map((iniciais) => (
                <span key={iniciais} className="flex h-8 w-8 items-center justify-center rounded-full text-micro font-bold ring-2" style={{ background: LIMA, color: LIMA_TEXTO, borderColor: PRETO_HERO }}>
                  {iniciais}
                </span>
              ))}
            </div>
            <span className="text-caption font-bold" style={{ color: LIMA }}>Falar no WhatsApp</span>
          </div>
        </div>
      </div>

      <div className="shrink-0 px-6" style={{ paddingBottom: "calc(10px + var(--safe-bottom))" }}>
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
function IconeChevronDireita() { return <svg {...iconeBase(16)}><path d="m9 18 6-6-6-6" /></svg>; }
function IconeMais() { return <svg {...iconeBase(18)}><path d="M12 5v14M5 12h14" /></svg>; }
function IconeMaisGrosso() { return <svg {...iconeBase(20)} strokeWidth={2.6}><path d="M12 5v14M5 12h14" /></svg>; }
function IconeCheck() { return <svg {...iconeBase(16)} strokeWidth={2.6}><path d="m5 12 4.5 4.5L19 7" /></svg>; }
function IconeSino() {
  return (
    <svg {...iconeBase(18)}>
      <path d="M6 8a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}
function IconeDoc() {
  return (
    <svg {...iconeBase(18)}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  );
}
function IconeCalendario() {
  return (
    <svg {...iconeBase(18)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
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
function IconeCadeado() {
  return (
    <svg {...iconeBase(18)}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function IconeBandeira() { return <svg {...iconeBase(16)}><path d="M4 21V4" /><path d="M4 5h13l-2 4 2 4H4" /></svg>; }
function IconeEscudo() { return <svg {...iconeBase(16)}><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5Z" /></svg>; }
function IconeAviaozinho() { return <svg {...iconeBase(20)} strokeWidth={1.7}><path d="m3 11 18-8-8 18-2-8-8-2Z" /></svg>; }
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
