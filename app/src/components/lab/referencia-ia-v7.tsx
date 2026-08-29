import { passosDoCliente } from "@/lib/passos";
import { CUSTOS, brl } from "@/lib/fiscal";
import { CLIENTE } from "@/app/(app)/dossie/mock";
import { Logo } from "@/components/logo";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * REFERÊNCIA V7 — "AI chat app" (28/08, pedido do Pedro)
 * ═══════════════════════════════════════════════════════════════════════════
 * 7ª referência visual. SUBSTITUI a v6 (analytics dashboard,
 * `referencia-analytics-v6.tsx` — removida, mantida no repo desconectada) em
 * "Aplicação da referência". v1-v5 idem. Regra travada: cada referência nova
 * troca a anterior inteira, nunca acumula.
 *
 * ─── O QUE A REFERÊNCIA ENSINA ─────────────────────────────────────────────
 *   · Fundo GRADIENTE pastel (rosa→lilás→azul), bem suave/aéreo — cartões
 *     quase brancos flutuando por cima, sombra bem discreta.
 *   · Saudação em fonte GRANDE, casual/pesada, um pouco "torta" (itálico
 *     leve) — tom de app amigável, não corporativo.
 *   · Fileira de 3 "opções rápidas" — ícone-em-círculo + rótulo, cartões
 *     claros lado a lado.
 *   · Cartão "status" grande: título + legenda + CTA em pílula GRADIENTE, com
 *     uma textura decorativa de pontinhos (halftone) vazando de um canto.
 *   · Grade assimétrica "destaques": 1 cartão grande (ilustração + texto) +
 *     2 cartões pequenos empilhados ao lado.
 *
 * ─── O QUE NÃO ENTROU, e por quê ──────────────────────────────────────────
 *   · SEM barra de composer ("Write your message" + mic): nenhuma das nossas
 *     telas é um chat, escrever esse elemento seria decoração sem função.
 *   · SEM fileira de "3 modelos de IA": não escolhemos motor de IA em tela
 *     nenhuma — na Home Campeã e no N7 a fileira de 3 vira FATOS reais
 *     (atalhos/inclusos), nunca um seletor decorativo vazio.
 *   · SEM badge "PRO": não temos plano Pro pra vender aqui.
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
  fundo: "linear-gradient(160deg, #FBEAF0 0%, #F2E9F7 45%, #E8EEFC 100%)",
  cartao: "#FFFFFF",
  cartaoAlt: "#F6F1F6",
  textoPrimario: "#1B1A1F",
  textoSecundario: "#726E78",
  textoTerciario: "#A19DA8",
  hairline: "#F0EAF0",
  sombra: "0 12px 28px rgba(60,40,70,0.07)",
};

const ESCURO: Paleta = {
  fundo: "linear-gradient(160deg, #241B22 0%, #1E1B26 45%, #161C24 100%)",
  cartao: "#231F26",
  cartaoAlt: "#2C2730",
  textoPrimario: "#F3F0F5",
  textoSecundario: "#B4AEBB",
  textoTerciario: "#7A7482",
  hairline: "#342D38",
  sombra: "0 12px 28px rgba(0,0,0,0.4)",
};

function paletaDe(escuro: boolean): Paleta {
  return escuro ? ESCURO : CLARO;
}

const GRADIENTE_CTA = "linear-gradient(120deg, var(--color-action-primary), var(--color-action-primary-hover))";

/** Textura decorativa de pontinhos, vazando de um canto — puramente
 *  ornamental (não carrega dado nenhum). */
function TexturaPontos({ p }: { p: Paleta }) {
  return (
    <div
      className="pointer-events-none absolute bottom-0 right-0 h-24 w-32 opacity-70"
      style={{
        background: `radial-gradient(circle, var(--color-action-primary) 1.2px, transparent 1.6px)`,
        backgroundSize: "9px 9px",
        maskImage: "radial-gradient(circle at bottom right, black, transparent 75%)",
        WebkitMaskImage: "radial-gradient(circle at bottom right, black, transparent 75%)",
        opacity: p === ESCURO ? 0.35 : 0.55,
      }}
      aria-hidden
    />
  );
}

/** Fileira de 3 opções rápidas — ícone-em-círculo + rótulo. */
function FileiraTres({ p, itens }: { p: Paleta; itens: { icone: React.ReactNode; label: string }[] }) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {itens.map((it) => (
        <div key={it.label} className="flex flex-col items-center gap-2 rounded-2xl p-3 text-center" style={{ background: p.cartao, boxShadow: p.sombra }}>
          <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: p.cartaoAlt, color: p.textoPrimario }}>
            {it.icone}
          </span>
          <span className="text-micro font-semibold" style={{ color: p.textoPrimario }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

/** Cartão "status" — título + legenda + CTA gradiente, textura de pontinhos
 *  no canto. */
function CartaoStatus({
  p,
  titulo,
  legenda,
  cta,
}: {
  p: Paleta;
  titulo: string;
  legenda: string;
  cta: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[24px] p-5" style={{ background: p.cartao, boxShadow: p.sombra }}>
      <TexturaPontos p={p} />
      <div className="relative">
        <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>{titulo}</p>
        <p className="mt-1 text-caption" style={{ color: p.textoTerciario }}>{legenda}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-caption font-bold text-white" style={{ background: GRADIENTE_CTA }}>
          {cta} <IconeSetaDireita />
        </span>
      </div>
    </div>
  );
}

/** Grade assimétrica "destaques" — 1 cartão grande + 2 pequenos empilhados. */
function GradeDestaques({
  p,
  grande,
  pequenos,
}: {
  p: Paleta;
  grande: { titulo: string; sub: string; icone: React.ReactNode };
  pequenos: { titulo: string; icone: React.ReactNode }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <div className="rounded-2xl p-4" style={{ background: p.cartaoAlt }}>
        <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: p.cartao, color: p.textoPrimario }}>
          {grande.icone}
        </span>
        <p className="mt-3 text-body-strong font-bold" style={{ color: p.textoPrimario }}>{grande.titulo}</p>
        <p className="mt-1 text-micro" style={{ color: p.textoTerciario }}>{grande.sub}</p>
      </div>
      <div className="flex flex-col gap-2.5">
        {pequenos.map((it) => (
          <div key={it.titulo} className="flex flex-1 items-center gap-2.5 rounded-2xl p-3.5" style={{ background: p.cartaoAlt }}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: p.cartao, color: p.textoPrimario }}>
              {it.icone}
            </span>
            <p className="text-caption font-semibold" style={{ color: p.textoPrimario }}>{it.titulo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── 1. E3 · FORK · 3 ROTAS (modelo "Hi, Noah!") ─────────────────────────── */

export function ReferenciaFork({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="flex shrink-0 items-center justify-between px-6" style={{ paddingTop: "calc(var(--safe-top) + 8px)" }}>
        <Logo className="h-8 w-auto" variante={escuro ? "escura" : "padrao"} />
        <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: p.cartao, boxShadow: p.sombra, color: p.textoPrimario }}>
          <IconeEngrenagem />
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <h1 className="text-h1 font-bold italic leading-[1.05]" style={{ color: p.textoPrimario }}>Como podemos ajudar?</h1>
        <p className="mt-1 text-caption italic" style={{ color: p.textoTerciario }}>A parte chata fica com a gente</p>

        <div className="mt-5">
          <GradeDestaques
            p={p}
            grande={{ titulo: "Quero abrir minha empresa", sub: "Ainda não tenho CNPJ. Quero começar do zero.", icone: <IconeAviaozinho /> }}
            pequenos={[
              { titulo: "Já tenho empresa", icone: <IconePredio /> },
              { titulo: "Entrar na minha conta", icone: <IconePessoa /> },
            ]}
          />
        </div>

        <div className="mt-4">
          <CartaoStatus p={p} titulo="Um escritório de verdade, em BH" legenda="22 anos de experiência, agora no app." cta="Conhecer" />
        </div>
      </div>
    </div>
  );
}

/* ─── 2. N7 · A CONTA DA ABERTURA ──────────────────────────────────────────── */

const INCLUSO_REF = [
  { titulo: "Abertura completa", icone: <IconePredio /> },
  { titulo: "Certificado digital", icone: <IconeCadeado /> },
  { titulo: "Impostos em dia", icone: <IconeDoc /> },
];

export function ReferenciaPlano({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  const mensalidade = CUSTOS.MENSALIDADE;
  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="flex shrink-0 items-center justify-between px-6" style={{ paddingTop: "calc(var(--safe-top) + 8px)" }}>
        <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: p.cartao, boxShadow: p.sombra, color: p.textoPrimario }}>
          <IconeChevronEsquerda />
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: p.cartao, boxShadow: p.sombra, color: p.textoPrimario }}>
          <IconeEngrenagem />
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <h1 className="text-h1 font-bold italic leading-[1.05]" style={{ color: p.textoPrimario }}>Quanto custa</h1>
        <p className="mt-1 text-caption italic" style={{ color: p.textoTerciario }}>Sem letra miúda, sem surpresa depois</p>

        <div className="mt-4">
          <FileiraTres
            p={p}
            itens={INCLUSO_REF.map((i) => ({ icone: i.icone, label: i.titulo }))}
          />
        </div>

        <div className="mt-4">
          <CartaoStatus
            p={p}
            titulo={`${brl(mensalidade)} por mês`}
            legenda="A 1ª mensalidade já é o seu 1º mês. Acompanha o seu faturamento."
            cta="Continuar"
          />
        </div>

        <div className="mt-4">
          <GradeDestaques
            p={p}
            grande={{ titulo: "Honorário de abertura", sub: "R$ 0 — documentação, contrato social, protocolo e CNPJ.", icone: <IconePredio /> }}
            pequenos={[
              { titulo: `Taxa Junta ${brl(CUSTOS.DAE_JUCEMG, true)}`, icone: <IconeDoc /> },
              { titulo: "Notas sem limite", icone: <IconeRaio /> },
            ]}
          />
        </div>
      </div>

      <div className="shrink-0 px-6 pb-4">
        <div className="mb-2.5 flex items-baseline justify-between">
          <span className="text-caption" style={{ color: p.textoTerciario }}>Você paga hoje</span>
          <span className="text-h2 font-bold" style={{ color: p.textoPrimario }}>{brl(mensalidade, true)}</span>
        </div>
        <span className="block w-full rounded-full py-4 text-center text-body font-bold text-white" style={{ background: GRADIENTE_CTA }}>
          Ótimo, continuar
        </span>
      </div>
    </div>
  );
}

/* ─── 3. C0.1 · RETOMAR DE ONDE PAROU ──────────────────────────────────────── */

export function ReferenciaRetomar({ escuro = false }: { escuro?: boolean }) {
  const p = paletaDe(escuro);
  const passos = passosDoCliente();
  const concluidos = 2;

  return (
    <div className="flex h-full flex-col" style={{ background: p.fundo }}>
      <div className="flex shrink-0 items-center justify-between px-6" style={{ paddingTop: "calc(var(--safe-top) + 8px)" }}>
        <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: p.cartao, boxShadow: p.sombra, color: p.textoPrimario }}>
          <IconeChevronEsquerda />
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: p.cartao, boxShadow: p.sombra, color: p.textoPrimario }}>
          <IconeSino />
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-3 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <h1 className="text-h1 font-bold italic leading-[1.05]" style={{ color: p.textoPrimario }}>Bem-vindo de volta!</h1>
        <p className="mt-1 text-caption italic" style={{ color: p.textoTerciario }}>Você saiu há 6 dias. Está tudo salvo</p>

        <div className="mt-4">
          <FileiraTres
            p={p}
            itens={[
              { icone: <IconeCheck />, label: `${concluidos} feitos` },
              { icone: <IconeRelogio />, label: `${passos.length - concluidos} restam` },
              { icone: <IconeBandeira />, label: `${passos.length} total` },
            ]}
          />
        </div>

        <div className="mt-4">
          <CartaoStatus p={p} titulo={`Você está em ${concluidos} de ${passos.length} passos`} legenda={`Agora: ${passos[concluidos]?.nome ?? "—"}`} cta="Continuar" />
        </div>

        <p className="mb-2 mt-4 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Onde você está</p>
        <div className="rounded-2xl p-2" style={{ background: p.cartao, boxShadow: p.sombra }}>
          {passos.map((passo, i) => {
            const feito = i < concluidos;
            const agora = i === concluidos;
            return (
              <div key={passo.tela} className="flex items-center gap-2.5 px-2.5 py-2" style={i > 0 ? { borderTop: `1px solid ${p.hairline}` } : undefined}>
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: feito ? "var(--color-action-primary)" : agora ? p.textoPrimario : p.hairline }} />
                <p className="flex-1 text-caption" style={{ color: feito || agora ? p.textoPrimario : p.textoTerciario, fontWeight: feito || agora ? 600 : 400 }}>
                  {passo.nome}
                </p>
              </div>
            );
          })}
        </div>
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
      <div className="flex shrink-0 items-center justify-between px-6" style={{ paddingTop: "calc(var(--safe-top) + 8px)" }}>
        <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: p.cartao, boxShadow: p.sombra, color: p.textoPrimario }}>
          <IconeChevronEsquerda />
        </span>
        <p className="text-body-strong font-bold" style={{ color: p.textoPrimario }}>Seus dados</p>
        <span className="h-10 w-10" />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <h1 className="text-h2 font-bold italic" style={{ color: p.textoPrimario }}>Confira seus dados</h1>

        <div className="mt-3 rounded-2xl p-4" style={{ background: p.cartao, boxShadow: p.sombra }}>
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

      <div className="shrink-0 px-6 pb-4">
        <span className="block w-full rounded-full py-4 text-center text-body font-bold text-white opacity-50" style={{ background: GRADIENTE_CTA }}>
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
      <div className="flex shrink-0 items-center justify-between px-6" style={{ paddingTop: "calc(var(--safe-top) + 8px)" }}>
        <span className="flex h-10 w-10 items-center justify-center rounded-full text-caption font-bold text-white" style={{ background: "var(--color-action-primary)" }}>AB</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: p.cartao, boxShadow: p.sombra, color: p.textoPrimario }}>
          <IconeEngrenagem />
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <h1 className="text-h1 font-bold italic leading-[1.05]" style={{ color: p.textoPrimario }}>
          Oi, {CLIENTE.nome.split(" ")[0]}!
        </h1>
        <p className="mt-1 text-caption italic" style={{ color: p.textoTerciario }}>Bem-vinda de volta</p>

        <div className="mt-4">
          <FileiraTres
            p={p}
            itens={[
              { icone: <IconeDoc />, label: "Emitir nota" },
              { icone: <IconeCalendario />, label: "Pagar imposto" },
              { icone: <IconePasta />, label: "Documentos" },
            ]}
          />
        </div>

        <div className="mt-4">
          <CartaoStatus p={p} titulo="DAS de junho — R$ 178,31" legenda="Vence 20/07 — a gente já gerou." cta="Pagar" />
        </div>

        <p className="mb-2 mt-4 text-body-strong font-bold" style={{ color: p.textoPrimario }}>Destaques</p>
        <GradeDestaques
          p={p}
          grande={{ titulo: "Notas recentes", sub: "3 emitidas este mês — Maria, João e Rita.", icone: <IconeDoc /> }}
          pequenos={[
            { titulo: "Alíquota 6%", icone: <IconeRaio /> },
            { titulo: "Fator R 37%", icone: <IconeMedidor /> },
          ]}
        />

        <div className="mt-4 rounded-2xl p-4" style={{ background: p.cartaoAlt }}>
          <p className="text-caption font-semibold" style={{ color: p.textoPrimario }}>Quem cuida de você</p>
          <p className="mt-1 text-micro" style={{ color: p.textoTerciario }}>Contadores cuidando do seu CNPJ. Você só aprova.</p>
          <p className="mt-2 text-caption font-bold" style={{ color: "var(--color-action-primary)" }}>Falar no WhatsApp</p>
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
function IconeChevronEsquerda() { return <svg {...iconeBase(16)}><path d="m15 18-6-6 6-6" /></svg>; }
function IconeSetaDireita() { return <svg {...iconeBase(13)} strokeWidth={2.6}><path d="M5 12h14M13 6l6 6-6 6" /></svg>; }
function IconeEngrenagem() {
  return (
    <svg {...iconeBase(18)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
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
function IconeCheck() { return <svg {...iconeBase(18)} strokeWidth={2.6}><path d="m5 12 4.5 4.5L19 7" /></svg>; }
function IconeRelogio() { return <svg {...iconeBase(18)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>; }
function IconeBandeira() { return <svg {...iconeBase(18)}><path d="M4 21V4" /><path d="M4 5h13l-2 4 2 4H4" /></svg>; }
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
function IconeMedidor() {
  return (
    <svg {...iconeBase(18)}>
      <path d="M4 18a8 8 0 0 1 16 0" />
      <path d="M12 18V9" />
      <path d="M12 18l4-5" />
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
function IconePasta() {
  return <svg {...iconeBase(18)}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /></svg>;
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
function IconeAviaozinho() { return <svg {...iconeBase(18)} strokeWidth={1.7}><path d="m3 11 18-8-8 18-2-8-8-2Z" /></svg>; }
function IconePessoa() { return <svg {...iconeBase(18)}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6" /></svg>; }
