"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TelaHeader, Aviso } from "@/components/ui/tela";
// 🔄 27/08 — `CUSTOS` saiu junto com a escolha de endereço, que migrou da
// `FaixaView` pro E3.3 (`components/entrada-lead.tsx`).
// 🔁 28/08 — `Aviso` e `brl` voltaram, agora a serviço do gate de teto do MEI.
import { FISCAL, brl } from "@/lib/fiscal";
import { TETO_MEI_ANUAL, TETO_MEI_MENSAL } from "@/lib/mei";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N4 · GATE — as telas, FONTE ÚNICA
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ EXTRAÍDO de `(wizard)/gate/page.tsx` em 29/07, pelo mesmo motivo do
 * `EntradaView`: a `/apresentacao` tem que renderizar a tela APROVADA, não
 * uma cópia. Cópia diverge em silêncio.
 *
 * Cada tela recebe seu estado por props (controlada). Isso não é ceremônia:
 * é o que permite a demo pré-preencher um cenário com 1 clique sem duplicar
 * a tela, e o que mantém o `/gate` de produção mandando na navegação.
 *
 * Racional das decisões (typewriter, pill que não valida, painel único,
 * thumb zone, fail-fast da triagem, faixa guiada) segue documentado inline.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Colhido do protótipo: atividades reais, não lorem.
 *
 * Frase inteira e em 1ª pessoa, não rótulo de categoria. Este placeholder é a
 * única coisa na tela que responde "o que é uma resposta boa aqui?", e
 * "Fotografia" respondia "uma palavra basta" — o oposto do que a IA precisa
 * pra mapear o CNAE, e do que a caixa grande promete.
 *
 * ⚠️ Só atividade que o MVP ATENDE. "Fisioterapia" estava na lista e saiu: é
 * regulamentada, cai na waitlist. Sugerir no placeholder o que a gente vai
 * recusar 2 telas depois é convidar pra porta fechada.
 */
export const EXEMPLOS = [
  "Faço sites e lojas virtuais para pequenas empresas",
  "Desenvolvo sistemas e aplicativos sob encomenda",
  "Crio logo e identidade visual de marca",
  "Fotografo casamento e ensaio de família",
  "Cuido das redes sociais de uns cinco clientes",
  "Dou consultoria de gestão para dono de pequena empresa",
  "Dou aula particular de inglês online",
  "Edito vídeo para canal do YouTube e para redes",
];

/**
 * Pills de reconhecimento do N4 (14) — derivadas dos 87 CNAEs "atendemos com
 * certeza" (pesquisa/cnae-matriz/cnae-liso-servico.md, fonte primária, 27/08).
 * 🔄 27/08: substitui a v1 (17 categorias/103 CNAEs herdados da Contabilizei,
 * não ratificados). Detalhe completo, CNAE por categoria, e o que mudou vs a
 * v1 (Conserto de veículos e Manutenção de máquinas SAÍRAM — não têm CNAE
 * `liso` na base atual, caem em `verificar-licenciamento`) em
 * `pesquisa/cnae-matriz/taxonomia-pills-n4.md`.
 *
 * 🔴 28/08 — categoria "Recuperação de materiais" (2 CNAEs) SAIU: o eixo de
 * registro setorial nunca tinha rodado nesses 2 códigos especificamente
 * (achado do `cnae-verifica-atende.js`). Seguem pendentes de pesquisa, não
 * descartados — volta se confirmar "não exige registro federal". Ver
 * `pesquisa/cnae-matriz/taxonomia-pills-n4.md` item 7.
 *
 * ⚠️ A pill ESTREITA, não valida (decisão 17/07 → legalize-pill-estreita-nao-valida).
 * Clicar não dá veredito: só afunila o universo pra IA e troca o exemplo do
 * campo. A pessoa AINDA descreve no textarea — é lá que a IA cruza e decide.
 * `ex` é a frase em 1ª pessoa que vira placeholder quando a pill é escolhida.
 */
export const PILLS = [
  { id: "tech", label: "Tecnologia e software", ex: "Desenvolvo sites, apps ou sistemas sob encomenda" },
  { id: "design", label: "Design", ex: "Crio design gráfico, de interiores ou de produto" },
  { id: "foto", label: "Foto, vídeo e áudio", ex: "Fotografo, filmo e edito vídeo ou áudio" },
  { id: "mkt", label: "Marketing e publicidade", ex: "Cuido das redes sociais e faço publicidade pra clientes" },
  { id: "edicao", label: "Edição e mídia", ex: "Edito livros, jornais ou revistas" },
  { id: "consult", label: "Consultoria, pesquisa e tradução", ex: "Faço consultoria, pesquisa ou tradução pra empresas" },
  { id: "cursos", label: "Ensino e cursos", ex: "Dou aula de idioma, música, dança ou curso profissionalizante" },
  { id: "arte", label: "Arte, cultura e patrimônio", ex: "Produzo teatro, música, ou represento artista e atleta" },
  { id: "eventos", label: "Eventos e entretenimento", ex: "Organizo eventos, festas ou casas de jogos" },
  { id: "admin", label: "Apoio administrativo", ex: "Faço serviços de escritório, cobrança e teleatendimento" },
  { id: "aluguel", label: "Aluguel de equipamentos", ex: "Alugo equipamentos, móveis ou objetos" },
  { id: "reparos", label: "Reparos e manutenção", ex: "Conserto computador, celular, bicicleta ou relógio" },
  { id: "salao", label: "Salão e beleza", ex: "Trabalho com cabelo, manicure e pedicure" },
  { id: "hospedagem", label: "Hospedagem", ex: "Tenho albergue ou pensão" },
];

/**
 * Ritmo do typewriter. Constante nomeada porque é botão de ajuste, e o valor
 * certo é o que dá pra LER — isso não se calcula, se olha.
 * `segura` é o que mais pesa: é o tempo com a frase parada e inteira na tela.
 */
const RITMO = {
  digita: 62, // ms por caractere digitado
  segura: 2800, // ms com a frase completa, antes de começar a apagar
  apaga: 20, // ms por caractere apagado (ninguém lê apagando; some rápido)
};

export const FAIXAS = [
  { id: "ate 10k", label: "Até R$ 10 mil" },
  { id: "10-20k", label: "R$ 10 a 20 mil" },
  { id: "20-30k", label: "R$ 20 a 30 mil" },
  { id: "30k+", label: "+ R$ 30 mil" },
];

/* ─── 🆕 29/08 (pedido do Pedro) — grade de cartões ilustrados pra Faixa de
   faturamento, layout ficava vazio como lista de pills finas. Ícone é PNG
   exportado pelo Pedro (Photoshop), 1 par (coral/creme) por faixa — cédulas
   empilhadas, 1 maço na faixa 1 até 4 maços na faixa 4, canvas/proporção
   travados no Photoshop pra bater entre si. Coral no card claro (fundo
   card-alt), creme no card selecionado (fundo coral sólido). ────────────── */
const ICONES_FAIXA = [
  { coral: "/icones/faixa-1-coral.png", creme: "/icones/faixa-1-creme.png" },
  { coral: "/icones/faixa-2-coral.png", creme: "/icones/faixa-2-creme.png" },
  { coral: "/icones/faixa-3-coral.png", creme: "/icones/faixa-3-creme.png" },
  { coral: "/icones/faixa-4-coral.png", creme: "/icones/faixa-4-creme.png" },
];

function CheckBadgeFaixa() {
  return (
    <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-action-primary-sm">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="m5 12 4 4 8-9" />
      </svg>
    </span>
  );
}

function CardFaixa({
  label,
  nivel,
  selecionado,
  onClick,
}: {
  label: string;
  nivel: number;
  selecionado: boolean;
  onClick: () => void;
}) {
  const icone = ICONES_FAIXA[nivel - 1];
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-colors
        ${
          selecionado
            ? "border-action-primary bg-action-primary"
            : "border-border-hairline bg-surface-card hover:border-border-strong"
        }`}
    >
      {selecionado && <CheckBadgeFaixa />}
      <Image
        src={selecionado ? icone.creme : icone.coral}
        alt=""
        width={67}
        height={67}
        aria-hidden
      />
      <span className={`text-body font-semibold ${selecionado ? "text-text-on-brand" : "text-text-primary"}`}>{label}</span>
    </button>
  );
}

/** 🆕 29/08 — mesma estrutura visual da `CardFaixa` (ícone direto no fundo,
 *  badge de check no canto quando selecionado, troca coral/creme), genérico
 *  pra qualquer par de opções fixas (coorte, regime MEI×ME, etc.) em vez de
 *  uma lista indexada por nível. */
function CardIconeSelecao({
  label,
  iconeCoral,
  iconeCreme,
  selecionado,
  onClick,
  // 🆕 29/08 (pedido do Pedro) — os prédios de MEI×ME pareciam pequenos perto
  // da prancheta (que usa o padrão de 67px). Fica ajustável por chamada em
  // vez de mudar o default global (a prancheta continua 67).
  tamanho = 67,
}: {
  label: string;
  iconeCoral: string;
  iconeCreme: string;
  selecionado: boolean;
  onClick: () => void;
  tamanho?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-colors
        ${
          selecionado
            ? "border-action-primary bg-action-primary"
            : "border-border-hairline bg-surface-card hover:border-border-strong"
        }`}
    >
      {selecionado && <CheckBadgeFaixa />}
      <Image
        src={selecionado ? iconeCreme : iconeCoral}
        alt=""
        width={tamanho}
        height={tamanho}
        aria-hidden
      />
      <span className={`text-body font-semibold ${selecionado ? "text-text-on-brand" : "text-text-primary"}`}>{label}</span>
    </button>
  );
}

function GradeFaixas({
  selecionada,
  onSelecionar,
}: {
  selecionada: string | null;
  onSelecionar: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {FAIXAS.map((f, i) => (
        <CardFaixa
          key={f.id}
          label={f.label}
          nivel={i + 1}
          selecionado={selecionada === f.id}
          onClick={() => onSelecionar(f.id)}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ARQUÉTIPO A1 — PERGUNTA (o mais comum do flow; N4, N10–N16)
   ───────────────────────────────────────────────────────────────────────── */
export function PerguntaView({
  texto,
  setTexto,
  categoria,
  setCategoria,
  sabeCodigo,
  setSabeCodigo,
  onValidar,
  jaCliente = false,
}: {
  texto: string;
  setTexto: (v: string) => void;
  categoria: string | null;
  setCategoria: (v: string | null) => void;
  /** 🆕 28/07 (reunião Rua Satélite 9): atalho "já sei o número do meu CNAE" —
      pra quem já vem informado, pula descrever/pills e vai direto pra consulta
      na lista validada. Mesma engine (mapear/veredito), só muda o que o campo
      pede e como valida. */
  sabeCodigo: boolean;
  setSabeCodigo: (v: boolean) => void;
  onValidar: () => void;
  /**
   * 🆕 27/08 — a tela atravessou o pagamento (agora é C0, `/dossie/atividade`).
   * O CONTEÚDO é o mesmo, mas o enquadramento não pode ser: antes a gente
   * estava decidindo SE atende, e a copy dizia "validar minha atividade". Quem
   * chega aqui já é cliente e já passou pelo gate (a categoria do E3.3), então
   * prometer validação seria mentir sobre o que a tela faz. Aqui a gente está
   * ACHANDO O CÓDIGO da pessoa, não julgando se ela entra.
   */
  jaCliente?: boolean;
}) {
  const sel = PILLS.find((p) => p.id === categoria);
  const tw = useTypewriter(EXEMPLOS, texto.length > 0 || categoria !== null);
  // Pill escolhida troca o exemplo por uma frase fixa da categoria; sem pill,
  // o typewriter cicla exemplos genéricos. O EXEMPLO é o que ensina o campo.
  const placeholder = sabeCodigo ? "Ex: 6201-5/02" : sel ? `Ex: ${sel.ex}` : tw;
  // b1.descricao valida >= 10 caracteres. Espelha o motor exatamente.
  // No modo código, a régua é outra: só precisa parecer um CNAE (dígitos).
  const podeValidar = sabeCodigo
    ? texto.replace(/\D/g, "").length >= 6
    : texto.trim().length >= 10;

  // ── Scroll-fade das pills ────────────────────────────────────────────────
  // Inversão de quem estica: o textarea virou FIXO e as PILLS são a única
  // região elástica/rolável. Garante UM scroll só (o das pills) e o input nunca
  // espreme. Depende do shell travado em 100dvh (.app-page, globals.css): sem o
  // teto, a página inteira cresce em vez de as pills rolarem — foi o bug no SE.
  const scRef = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState({ up: false, down: false });
  const recompute = useCallback(() => {
    const el = scRef.current;
    if (!el) return;
    const up = el.scrollTop > 2;
    const down = el.scrollTop + el.clientHeight < el.scrollHeight - 2;
    setFade((f) => (f.up === up && f.down === down ? f : { up, down }));
  }, []);
  // ResizeObserver, não só onScroll: o /mockup muda a altura útil ao trocar de
  // aparelho (injeta --safe-*), e isso muda se há overflow.
  useEffect(() => {
    recompute();
    const el = scRef.current;
    if (!el) return;
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [recompute]);
  // Transparência REAL (mask): só desbota a ponta que ainda tem pill pra rolar.
  const topStop = fade.up ? "transparent 0, #000 22px" : "#000 0";
  const botStop = fade.down ? "#000 calc(100% - 22px), transparent 100%" : "#000 100%";
  const mask = `linear-gradient(to bottom, ${topStop}, ${botStop})`;

  return (
    <>
      {/* Título/subtítulo fixos. As PILLS são a única coisa que rola; input e
          CTA têm altura reservada. Só funciona com o shell travado em 100dvh. */}
      <div className="flex-1 min-h-0 flex flex-col">
        <h1 className="text-h1 mb-2">
          {sabeCodigo ? "Qual o número do seu CNAE?" : "O que você faz?"}
        </h1>
        <p className="text-body text-text-secondary mb-4">
          {sabeCodigo
            ? jaCliente
              ? "A gente confirma se é esse mesmo e segue com ele."
              : "A gente confere se ele está na nossa lista de atendidos."
            : jaCliente
              ? "Conta do seu jeito. A gente acha o código que combina com isso."
              : "Acha o que mais parece. Depois conta do seu jeito."}
        </p>

        {/* Painel único (rounded-3xl bg-surface-alt, mesmo container do timeline
            de /obrigacoes) agrupa pills + textarea — redesign v2 ROBUSTO,
            validado 28/07 via /mockup-v2. Pills = estilo CategoriaChips (ativo
            = coral, action-primary — só aqui; o CategoriaChips do resto do app
            segue dark quando ativo). Somem no modo código. */}
        <div className="flex min-h-0 flex-1 flex-col rounded-3xl bg-surface-alt p-4">
          {!sabeCodigo && (
            <div
              ref={scRef}
              onScroll={recompute}
              style={{ maskImage: mask, WebkitMaskImage: mask }}
              className="flex min-h-0 flex-1 flex-wrap content-start gap-2 overflow-y-auto pb-1
                         [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {PILLS.map((p) => {
                const on = categoria === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setCategoria(on ? null : p.id)}
                    aria-pressed={on}
                    className={`h-fit rounded-full px-4 py-2 text-caption font-semibold transition-colors
                      ${
                        on
                          ? "bg-action-primary text-text-on-brand"
                          : "border border-border-hairline bg-surface-card text-text-secondary hover:border-border-strong"
                      }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Textarea vira CARD claro dentro do painel escuro — profundidade,
              mesma lógica de contraste do AprendaGradiente/CabecalhoCampea.
              Botão limpar = affordance do SearchMic atualizado. */}
          <div className="relative mt-3 shrink-0">
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder={placeholder}
              className="h-[6.5rem] w-full resize-none rounded-2xl border border-border-hairline
                         bg-surface-card p-4 pr-9 text-body text-text-primary shadow-sm
                         placeholder:text-text-muted focus:border-border-focus focus:outline-none"
            />
            {texto !== "" && (
              <button
                type="button"
                onClick={() => setTexto("")}
                aria-label="Limpar"
                className="absolute right-3 top-3 text-text-tertiary transition-colors hover:text-text-primary"
              >
                <IconeX />
              </button>
            )}
          </div>
        </div>

        {/* Microcopy que ENSINA, não pune (UX-16). Reforça o "descreve mais"
            quando a pill foi escolhida — a pill não fecha, o texto fecha. */}
        <p className="text-caption text-text-tertiary mt-2 min-h-[1.25rem]">
          {sabeCodigo
            ? "Formato: 0000-0/00"
            : sel
              ? "Boa. Agora conta um pouco mais pra gente confirmar."
              : texto.length > 0 && !podeValidar
                ? "Conta um pouco mais do que você faz."
                : ""}
        </p>

        {/* 🆕 28/07: CTA discreto do atalho — não compete com o CTA principal
            (texto pequeno, sublinhado, sem fill). */}
        <button
          onClick={() => {
            setSabeCodigo(!sabeCodigo);
            setTexto("");
            setCategoria(null);
          }}
          className="mt-2 self-start text-caption font-medium text-text-secondary underline underline-offset-4"
        >
          {sabeCodigo ? "Prefiro descrever o que faço" : "Já sei o número do meu CNAE"}
        </button>
      </div>

      {/* 🌾 CTA no rodapé = thumb zone (design-system.md §6) */}
      <div className="app-footer-cta">
        <Button full onClick={onValidar} disabled={!podeValidar}>
          {jaCliente ? "Achar meu CNAE" : "Validar minha atividade"}
        </Button>
      </div>
    </>
  );
}

function IconeX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ARQUÉTIPO A7 (variação curta) — ESPERA
   🌾 colhido: o loading EXPLICA. "Analisando o que você faz…" em vez de spinner mudo.
   ───────────────────────────────────────────────────────────────────────── */
export function AnalisandoView() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="flex gap-1.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-action-primary animate-bounce"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
      <p className="text-body text-text-secondary" role="status">
        Analisando o que você faz…
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   🆕 TRIAGEM (UX-21 fail-fast) — não existia no protótipo.
   Nasce da reordenação: com cobrança no N9, o que mata a elegibilidade tem
   que ser perguntado ANTES do dinheiro. Espelha b1.triagem do motor.

   🔓 24/08 (reunião Leonan 19/08) — LIMITE SUBIU DE 2 PRA 4. O Leonan validou
   que empresa pequena com 3-4 sócios acontece (raro acima disso); o que trava
   de verdade lá na frente não é o número em si, é que TODOS precisam assinar
   (GOV.BR/e-CAC) na Constituição. Aviso PROATIVO (não bloqueio) avisa da
   assinatura de todos quando são 3-4 sócios.

   🔒 29/08 (pedido do Pedro, decisão de negócio travada) — os 3 gates que
   existiam aqui (5+ sócios · sócio via CNPJ · sócio no exterior) DEIXARAM DE
   SER PERGUNTA. Viraram fato/lembrete, sem bloqueio nenhum:
     · Sócio via CPF/CNPJ e sócio no exterior nunca foram ESCOLHA de verdade
       — quem chegou até aqui já escolheu Simples Nacional lá atrás (E3.2), e
       o Simples só aceita sócio pessoa física domiciliado no Brasil. Não é
       uma pergunta que pode dar 2 respostas úteis: é consequência de uma
       decisão anterior. Por isso virou 1 aviso sutil só, não 2 perguntas.
     · O seletor de quantidade passou a ir só até 4 ("Eu + 3") — a opção "5+"
       foi REMOVIDA do produto, não só escondida. Sem ela, o gate de 5+ sócios
       fica estruturalmente inalcançável (não existe input que dispare).
   ⚠️ Efeito colateral ACEITO pelo Pedro: a checagem ativa de "sócio no
   exterior" (fail-fast, UX-21) deixa de existir. Antes, dizer "sim" aqui
   bloqueava ANTES do pagamento; agora é só um lembrete, e ninguém confere a
   resposta. Se um sócio no exterior passar batido, só aparece como problema
   real mais na frente (contrato social/CRC). Risco assumido conscientemente,
   não descoberto depois.
   ───────────────────────────────────────────────────────────────────────── */
export function TriagemView({
  socios,
  setSocios,
  onSeguir,
  coorte,
  setCoorte,
}: {
  socios: number | null;
  setSocios: (n: number) => void;
  onSeguir: () => void;
  /**
   * 🆕 26/08 (pedido do Pedro) — 3ª realocação da pergunta "é a primeira
   * empresa que você abre?": E6 → E5F (24/08) → Veredito (26/08, 1ª tentativa)
   * → aqui, dentro da própria Triagem, junto das outras "perguntas rápidas"
   * (era isso que o Pedro queria desde o início — "na verdade eu queria nela
   * e não no veredito"). Opcional (dado puro de log/marketing, UX-48).
   */
  coorte?: "primeira" | "ja-abri" | null;
  setCoorte?: (v: "primeira" | "ja-abri") => void;
}) {
  const solo = socios === 1;
  const temSocio = socios !== null && !solo;
  // 🆕 29/08 (pedido do Pedro) — escape hatch pra quem NÃO se encaixa nos
  // checks de "Vale saber" (sócio no exterior, via CNPJ, etc.): não é mais
  // pergunta obrigatória, mas quem sabe que o próprio caso foge da regra
  // ainda consegue avisar e falar com um humano, em vez de só continuar
  // como se nada fosse.
  const [socioNaoAtende, setSocioNaoAtende] = useState(false);
  const [resolvidoInline, setResolvidoInline] = useState(false);
  // 🔄 29/08 (pedido do Pedro) — "é a primeira empresa que você abre?" vira
  // obrigatória. Só entra na conta quando a pergunta de fato aparece (função
  // recebeu `setCoorte`) — sem isso, quem não usa essa prop nunca travaria.
  const completo = socios !== null && (!setCoorte || coorte !== null);

  return (
    <>
      {/* Título FIXO (padrão de 3 partes: título fixo / corpo rola / CTA fixo).
          🔒 29/08 — voltou a ser só 1 pergunta de verdade (quantidade); o
          resto virou lembrete, não pergunta. */}
      <div className="shrink-0">
        <h1 className="text-h1 mb-2">Perguntas rápidas</h1>
        <p className="text-body text-text-secondary mb-6">
          Rápido, só o essencial antes da gente continuar.
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <p className="text-body-strong font-semibold mb-3">
          Quantas pessoas vão ser donas da empresa?
        </p>
        <div className="flex gap-2 mb-8">
          {/* 🔒 29/08 (pedido do Pedro, decisão travada) — teto vira 4
              (era 1-5 com "5+"). A opção de 5+ sócios SAI do produto, não só
              da tela — sem ela, o gate de 5+ sócios não tem como disparar. */}
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setSocios(n)}
              className={`flex-1 min-h-12 rounded-md border text-body font-semibold transition-colors
                ${
                  socios === n
                    ? "border-action-primary bg-action-primary text-text-on-brand"
                    : "border-border-hairline bg-surface-card text-text-secondary hover:border-border-strong"
                }`}
            >
              {/* 🔄 29/08 (pedido do Pedro) — "2" sozinho confundia (parecia
                  "eu + 2 pessoas", quando na verdade a pessoa JÁ conta como
                  1 sócio). "Eu + N" deixa claro que o número é o TOTAL,
                  incluindo quem está respondendo. */}
              {n === 1 ? "Só eu" : `Eu + ${n - 1}`}
            </button>
          ))}
        </div>

        {/* 🔒 29/08 (pedido do Pedro, decisão travada) — substitui as 2
            perguntas antigas (CPF×CNPJ + mora fora do Brasil). Não é mais
            pergunta: quem chegou aqui já escolheu Simples Nacional lá atrás
            (E3.2), e o Simples só aceita sócio pessoa física domiciliado no
            Brasil — não tem 2ª resposta possível, é consequência da escolha
            anterior, não uma decisão nova. Vira lembrete sutil, sem bloqueio. */}
        {/* 🆕 29/08 (pedido do Pedro) — mesmo cartão do lado "tem sócio",
            reassegurando quem escolheu "Só eu": sozinho é a norma, não a
            exceção. */}
        {solo && (
          <div className="mb-8 rounded-md border border-border-hairline bg-surface-card p-4">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-state-success-tint text-state-success-text">
                <CheckMiniRegime />
              </span>
              <p className="text-caption text-text-secondary">
                É o mais comum entre os prestadores de serviço. Se um dia você
                quiser ter sócio, dá pra incluir depois, já com a empresa em
                pé.
              </p>
            </div>
          </div>
        )}

        {/* 🔄 29/08 (pedido do Pedro) — mesmo padrão visual do card de
            check-list usado em `MeiOuMeView` (ícone verde + texto), não mais
            um bloco de aviso solto. */}
        {temSocio && (
          <div className="mb-8 rounded-md border border-border-hairline bg-surface-card p-4">
            <p className="text-body-strong font-bold text-text-primary mb-2">
              Vale saber
            </p>
            <div className="flex flex-col gap-1.5">
              {[
                socios === 2 ? "Seu sócio precisa morar no Brasil" : "Seus sócios precisam morar no Brasil",
                socios === 2
                  ? "Seu sócio entra só com CPF, não CNPJ"
                  : "Seus sócios entram só com CPF, não CNPJ",
                // 🔄 29/08 (pedido do Pedro) — era um aviso separado, só a
                // partir de 3 sócios. Vale desde o 1º sócio (a assinatura de
                // todos é sempre necessária, não só com grupo maior), então
                // virou 3º check da mesma lista.
                socios === 2
                  ? "Seu sócio vai assinar (GOV.BR) na hora de constituir a empresa"
                  : "Seus sócios vão assinar (GOV.BR) na hora de constituir a empresa",
              ].map((texto) => (
                <div key={texto} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-state-success-tint text-state-success-text">
                    <CheckMiniRegime />
                  </span>
                  <p className="text-caption text-text-secondary">{texto}</p>
                </div>
              ))}
            </div>

            {/* 🆕 29/08 (pedido do Pedro) — mesmo padrão de link do gate de
                atividade (E3.4, "Minha atividade não está na lista"): quem
                não se encaixa em algum dos checks avisa aqui, sem precisar
                de pergunta obrigatória pra todo mundo. */}
            {!socioNaoAtende && (
              <button
                onClick={() => setSocioNaoAtende(true)}
                className="mt-3 self-start text-caption font-medium text-text-secondary underline underline-offset-4"
              >
                Meu sócio não atende um dos critérios
              </button>
            )}

            {socioNaoAtende && !resolvidoInline && (
              <div className="mt-3 rounded-md bg-state-info-tint p-4">
                <p className="text-caption text-text-secondary">
                  Sem problema. Esse caso a Legalize Digital atende pela
                  contabilidade tradicional, fora do produto automatizado.
                </p>
              </div>
            )}

            {resolvidoInline && (
              <div className="mt-3 rounded-md bg-state-success-tint p-4">
                <p className="text-body-strong font-semibold text-state-success-text mb-1">
                  Combinado, já anotamos
                </p>
                <p className="text-caption text-text-secondary">
                  Nosso time da Legalize Digital vai entrar em contato pra
                  seguir pela contabilidade tradicional.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 🆕 26/08 — 3ª realocação da coorte (Veredito → aqui, junto das
            outras perguntas rápidas). Dado puro de marketing/log, opcional,
            não interfere no processo.
            🔄 29/08 (pedido do Pedro) — ganhou ilustração (mesmo padrão da
            `GradeFaixas`: ícone direto no fundo do card, sem círculo, troca
            coral/creme conforme seleção, badge de check no canto). Prancheta
            rala (1 check) = primeira vez; prancheta cheia (3 checks) = já
            abriu antes. */}
        {setCoorte && (
          <div className="mt-8">
            <p className="text-body-strong font-semibold mb-1">
              É a primeira empresa que você abre?
            </p>
            <p className="text-caption text-text-secondary mb-3">
              Ajuda a gente a te acompanhar do jeito certo.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <CardIconeSelecao
                label="É a primeira"
                iconeCoral="/icones/coorte-primeira-coral.png"
                iconeCreme="/icones/coorte-primeira-creme.png"
                selecionado={coorte === "primeira"}
                onClick={() => setCoorte("primeira")}
              />
              <CardIconeSelecao
                label="Já abri antes"
                iconeCoral="/icones/coorte-ja-abri-coral.png"
                iconeCreme="/icones/coorte-ja-abri-creme.png"
                selecionado={coorte === "ja-abri"}
                onClick={() => setCoorte("ja-abri")}
              />
            </div>
          </div>
        )}

      </div>

      <div className="app-footer-cta">
        {socioNaoAtende ? (
          <Button
            full
            variant="dark"
            disabled={resolvidoInline}
            onClick={() => setResolvidoInline(true)}
          >
            {resolvidoInline ? "Combinado" : "Falar com o time"}
          </Button>
        ) : (
          <Button full onClick={onSeguir} disabled={!completo}>
            Continuar
          </Button>
        )}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   🆕 FAIXA de faturamento — alimenta o teaser do N5.
   ⚠️ Faixa guiada segue sendo o DEFAULT (spec): campo aberto sozinho trava
   quem está estimando. Sem perguntar margem (UX-51).

   🆕 17/07 — "eles já sabem o número" (provocação do Pedro, e ele é o caso):
   boa parte do nicho é PJ-ização — a pessoa abre CNPJ PORQUE já tem contrato
   ou salário fechado. Pra ela, "quanto você ESPERA faturar" pede um chute
   sobre algo que ela sabe com precisão. Duas correções:
     · copy acolhe os dois ("já sabe" e "estima"), sem rotular ninguém;
     · "sei o valor exato" abre entrada precisa — profundidade sob demanda
       (UX-48), sem bifurcar trilha. A faixa é derivada do valor, então o
       resto do flow continua recebendo o mesmo dado de sempre.
   ───────────────────────────────────────────────────────────────────────── */

/** Deriva a faixa a partir do valor exato: quem sabe o número não repete a escolha. */
export function faixaDoValor(v: number): string | null {
  if (v <= 0) return null;
  if (v < 10000) return "ate 10k";
  if (v < 20000) return "10-20k";
  if (v <= 30000) return "20-30k";
  return "30k+";
}

export function FaixaView({
  faixa,
  setFaixa,
  modoExato,
  setModoExato,
  exato,
  setExato,
  onSeguir,
  autoFocus = true,
  exatoInline = false,
  regimeMei = false,
  onTrocarParaMe,
}: {
  faixa: string | null;
  setFaixa: (v: string | null) => void;
  modoExato: boolean;
  setModoExato: (v: boolean) => void;
  exato: string;
  setExato: (v: string) => void;
  onSeguir: () => void;
  /** A demo desliga: roubar o foco dentro da moldura rola a página do board. */
  autoFocus?: boolean;
  /**
   * 🆕 28/08 — no caminho MEI esta tela deixa de ser só enquadramento e vira
   * **gate de teto**. O MEI tem limite de R$81.000/ano (LC 123 art. 18-A), ou
   * R$6.750/mês — quem passa disso não pode ser MEI, e descobrir depois do
   * pagamento seria o pior caso possível (desenquadramento retroativo, com
   * juros e multa, se o excesso passar de 20%).
   *
   * `false` (default) = caminho ME, tela idêntica ao que sempre foi.
   */
  regimeMei?: boolean;
  /** Só no MEI: leva pro caminho ME quando o faturamento estoura o teto. */
  onTrocarParaMe?: () => void;
  /**
   * 🔓 UX-68 (29/07) — "sei o valor exato" REVELA o campo abaixo das faixas,
   * em vez de trocar a tela inteira. Trocar fazia parecer que a pessoa saiu
   * do passo (e some a referência das faixas justamente na hora de digitar um
   * número que vai cair numa delas).
   */
  exatoInline?: boolean;
  /**
   * 🔴 27/08 — a escolha "endereço próprio × fiscal Legalizai" SAIU daqui.
   * Ela morou nesta tela entre 26/08 e 27/08 (tinha vindo do C4), e agora vive
   * no **E3.3** (`/endereco`, `EnderecoCategoriaView`), junto do gate de
   * cidade que ela sempre foi parte: as duas respondem "onde a empresa fica",
   * e faturamento não tem nada a ver com isso. O valor continua somando na
   * mensalidade do E7 pelo mesmo mecanismo (`?endereco=fiscal`).
   */
}) {
  const valor = Number(exato.replace(/\D/g, "")) || 0;
  const faixaExata = faixaDoValor(valor);
  const escolhida = exatoInline
    ? // Inline: o valor digitado manda; sem valor, vale a faixa tocada.
      (valor > 0 ? faixaExata : faixa)
    : modoExato
      ? faixaExata
      : faixa;
  const rotuloEscolhida = FAIXAS.find((f) => f.id === escolhida)?.label;

  // ─── GATE DE TETO (só MEI) ────────────────────────────────────────────────
  // Duas certezas diferentes, e a tela trata cada uma como ela é:
  //   · valor exato acima de R$6.750 → estoura, ponto final.
  //   · faixa acima de "até R$10 mil" → estoura em qualquer ponto dela.
  //   · faixa "até R$10 mil" → PODE estourar (R$6.750 cai dentro dela). Não dá
  //     pra bloquear sem saber, então vira aviso, não porta fechada.
  const estouraTeto =
    regimeMei &&
    (valor > TETO_MEI_MENSAL ||
      (valor === 0 && escolhida !== null && escolhida !== "ate 10k"));
  const tetoIncerto =
    regimeMei && !estouraTeto && valor === 0 && escolhida === "ate 10k";

  return (
    <>
      {/* Título FIXO (padrão de 3 partes: título fixo / corpo rola / CTA fixo) */}
      <div className="shrink-0">
        {/* "Pode ser estimativa!" entra no TÍTULO (mesmo padrão do N3, com a
            2ª parte em tom secundário): tira a pressão de acertar o número
            antes da pessoa olhar as opções. Com isso o subtítulo parou de
            repetir "estimativa" e ficou só com o acolhimento de quem já sabe
            o valor (a persona PJ-ização, que abre CNPJ com contrato fechado). */}
        <h1 className="text-h1 mb-2">
          Quanto você vai receber por mês?{" "}
          <span className="text-text-tertiary">Pode ser estimativa!</span>
        </h1>
        <p className="text-body text-text-secondary mb-6">
          Se você já sabe o valor, melhor ainda.
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {exatoInline ? (
          /* 🔓 UX-68 — as faixas FICAM; o campo exato aparece abaixo. */
          <div className="flex flex-col gap-4">
            <GradeFaixas
              selecionada={valor === 0 ? faixa : faixaExata}
              onSelecionar={(id) => {
                setFaixa(id);
                // Tocar numa faixa desfaz o valor digitado: senão o número
                // continuaria mandando e a seleção visual mentiria.
                setExato("");
                setModoExato(false);
              }}
            />

            {modoExato ? (
              <div className="mt-2 flex flex-col gap-2">
                <p className="text-caption font-semibold text-text-primary">
                  Valor exato por mês
                </p>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-body text-text-secondary">
                    R$
                  </span>
                  <input
                    value={exato}
                    onChange={(e) =>
                      setExato(
                        (Number(e.target.value.replace(/\D/g, "")) || "").toLocaleString("pt-BR")
                      )
                    }
                    placeholder="0"
                    inputMode="numeric"
                    autoFocus={autoFocus}
                    aria-label="Quanto você vai receber por mês"
                    className="w-full min-h-12 rounded-md border border-border-hairline bg-surface-card
                               py-3 pl-10 pr-3 text-body text-text-primary placeholder:text-text-muted
                               focus:border-border-focus focus:outline-none"
                  />
                </div>
                {/* Devolve o enquadramento na hora: mostra que o número foi
                    entendido, e liga o valor à faixa que ficou logo acima. */}
                {valor > 0 && rotuloEscolhida && (
                  <p className="text-caption text-text-secondary">
                    Isso te coloca na faixa{" "}
                    <strong className="text-text-primary">{rotuloEscolhida}</strong>.
                  </p>
                )}
              </div>
            ) : (
              <button
                onClick={() => setModoExato(true)}
                className="mt-2 self-start text-caption font-medium text-text-secondary underline underline-offset-4"
              >
                Sei o valor exato
              </button>
            )}
          </div>
        ) : modoExato ? (
          <div className="flex flex-col gap-2">
            <input
              value={exato}
              onChange={(e) =>
                setExato(
                  (Number(e.target.value.replace(/\D/g, "")) || "").toLocaleString("pt-BR")
                )
              }
              placeholder="R$ 0"
              inputMode="numeric"
              autoFocus={autoFocus}
              aria-label="Quanto você vai receber por mês"
              className="w-full min-h-12 rounded-md border border-border-hairline bg-surface-card
                         px-3 text-body text-text-primary placeholder:text-text-muted
                         focus:border-border-focus focus:outline-none"
            />
            {/* Devolve o enquadramento na hora: mostra que o número foi entendido. */}
            {rotuloEscolhida && (
              <p className="text-caption text-text-secondary">
                Isso te coloca na faixa{" "}
                <strong className="text-text-primary">{rotuloEscolhida}</strong>.
              </p>
            )}
            <button
              onClick={() => setModoExato(false)}
              className="mt-2 self-start text-caption font-medium text-text-secondary underline underline-offset-4"
            >
              Prefiro escolher uma faixa
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <GradeFaixas selecionada={faixa} onSelecionar={setFaixa} />
            <button
              onClick={() => setModoExato(true)}
              className="self-start text-caption font-medium text-text-secondary underline underline-offset-4"
            >
              Sei o valor exato
            </button>
          </div>
        )}

        {/* ─── O GATE DE TETO DO MEI (não existe no caminho ME) ───────────
            Estourar o teto não é "erro do cliente": é a empresa dele crescendo
            além do que esse regime comporta. A copy trata assim, e a saída é
            o ME — nunca um beco. */}
        {estouraTeto && (
          <div className="mt-4 flex flex-col gap-3">
            <Aviso variante="info" titulo="Com esse faturamento, o MEI não serve">
              O MEI tem teto de {brl(TETO_MEI_ANUAL, true)} por ano, que dá{" "}
              {brl(TETO_MEI_MENSAL, true)} por mês. Passar disso não é
              impedimento pra abrir empresa: é só sinal de que o seu caso é ME
              no Simples Nacional.
            </Aviso>
            <p className="text-caption text-text-secondary">
              Melhor descobrir agora. Quem estoura o teto depois de aberto paga
              a diferença como ME, e acima de 20% ainda entra juros e multa.
            </p>
            <Button full onClick={onTrocarParaMe}>
              Continuar como ME
            </Button>
          </div>
        )}

        {/* A faixa "até R$10 mil" contém o teto (R$6.750), então não dá pra
            afirmar nada — avisa sem bloquear, e oferece o campo exato. */}
        {tetoIncerto && (
          <div className="mt-4">
            <Aviso variante="warning" titulo="Fica de olho no teto do MEI">
              O limite do MEI é {brl(TETO_MEI_MENSAL, true)} por mês (
              {brl(TETO_MEI_ANUAL, true)} no ano), e ele cai dentro dessa faixa.
              Se quiser ter certeza agora, informa o valor exato aqui em cima.
            </Aviso>
          </div>
        )}
      </div>
      <div className="app-footer-cta">
        {/* 28/07: N5' (Resumo de valor) foi REMOVIDO — segue direto pro N6.
            Copy trocada: "ver o que eu ganho" prometia uma revelação que só
            existia no N5'; sem ele, a promessa vira mentira. */}
        <Button full disabled={!escolhida || estouraTeto} onClick={onSeguir}>
          Continuar e cadastrar
        </Button>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MEI × ME — `MeiOuMeView` é usada hoje em `/entrada` (E3.2), logo depois do
   fork, ANTES do gate de cidade. 🔁 REALOCADA 03/08 — morava no fim do E5
   (depois da faixa), decisão revertida pelo Pedro: quem abre MEI já sabe que
   é MEI, e MEI não tem o limite geográfico do MLP (pula o gate de cidade).

   ⚠️ Recomendação, não trava (mesma doutrina do C6/Natureza jurídica): quem
   se qualifica pode preferir ME mesmo assim (planeja sócio, quer teto maior).
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Elegibilidade ao MEI. Checa sócio (fato legal: MEI não tem sócio) + faixa
 * de faturamento (teto LC 123 art.18-A). 🔴 NÃO checa atividade/CNAE — essa
 * lista ainda não está no vault (fila Larissa). Ver comentário em `FISCAL`.
 *
 * 🟡 ÓRFÃ desde a realocação de 03/08 — a pergunta agora acontece ANTES de
 * sócio/faturamento existirem, então não dá mais pra usar isto pra GATEAR a
 * tela. Fica pronta pra virar guard-rail (ex: se a pessoa disse "MEI" aqui e
 * depois a triagem revelar 2+ sócios, corrigir) — isso ainda NÃO foi
 * construído, é gap conhecido.
 */
export function elegivelParaMei(
  socios: number | null,
  faixa: string | null,
  modoExato: boolean,
  exato: string,
): boolean {
  if (socios !== 1) return false;
  const valor = Number(exato.replace(/\D/g, "")) || 0;
  if (modoExato && valor > 0) return valor <= FISCAL.MEI_TETO_MENSAL;
  // Sem valor exato: só a faixa "até 10 mil" é compatível com o teto de
  // R$6.750/mês — as demais já excedem. Ambíguo dentro da própria faixa
  // (pode estar acima ou abaixo do teto); a tela deixa a pessoa decidir.
  return faixa === "ate 10k";
}

/**
 * 🆕 04/08 — E3.2 agora é reusada pelo Migrar também (decisão do Pedro:
 * inverter a ordem — pergunta o regime ANTES da cidade, não só depois no M1).
 * A copy muda de "qual devo ESCOLHER" (critério de elegibilidade, faz sentido
 * pra quem ainda vai abrir) pra "qual eu JÁ SOU" (autoidentificação — o CNPJ
 * já existe, não há escolha). Mesma estrutura de dados, conteúdo por contexto.
 *
 * ⚠️ Autodeclarado, não trava nada: pro Migrar, quem confirma de verdade o
 * regime é o M1 (`/migrar/cnpj`), puxando da Receita. Esta tela só decide se
 * pula ou não o gate de cidade — igual já fazia pro Abrir.
 */
function opcoesRegime(contexto: "abrir" | "migrar") {
  if (contexto === "migrar") {
    return [
      {
        id: "mei" as const,
        nome: "MEI · Microempreendedor Individual",
        checks: [
          "Já é MEI (Microempreendedor Individual)",
          "A gente atende MEI de qualquer cidade do Brasil",
          "Imposto fixo todo mês, não depende do que você retira",
          "Sem sócio · até 1 funcionário com carteira",
        ],
      },
      {
        id: "me" as const,
        nome: "ME · Simples Nacional",
        checks: [
          "Microempresa no Simples Nacional",
          "Por enquanto, só atendemos empresas de Belo Horizonte/MG",
          "Imposto pode variar conforme o que você retira pra você",
          "Pode ter sócio · sem o teto de faturamento do MEI",
        ],
      },
    ];
  }
  return [
    // 🔄 29/08 (pedido do Pedro) — ME vem primeiro agora (era MEI). Sem
    // motivo de negócio pra MEI abrir a lista; o pedido foi só inverter.
    {
      id: "me" as const,
      nome: "ME · Simples Nacional",
      checks: [
        "Fatura acima de ~R$6.750/mês, ou espera crescer rápido",
        "Por enquanto, só empresas de Belo Horizonte/MG",
        "Sem teto de R$81 mil, cresce sem trocar de regime depois",
        "Pode ter sócio · mais de 1 funcionário sem limite do regime",
      ],
    },
    {
      id: "mei" as const,
      nome: "MEI · Microempreendedor Individual",
      // 🆕 03/08 — lista ÚNICA (era pontos + "Recomendado para" separados —
      // duas listas com estilo diferente pra informação do mesmo tipo lia como
      // inconsistência, não hierarquia). Concreto (número) primeiro.
      // 🆕 28/08 (decisão do Pedro) — o certificado digital entra AQUI, na
      // primeira tela em que a pessoa escolhe ser MEI, e não lá no fim. Ele
      // deixou de vir incluso no plano MEI, e descobrir isso só no contrato
      // seria a surpresa que a marca inteira existe pra não dar.
      checks: [
        "Fatura (ou espera faturar) até ~R$6.750/mês (teto de R$81 mil/ano)",
        "Abre em qualquer cidade do Brasil",
        "Sem taxa da Junta, registro é praticamente na hora",
        "Sem sócio · até 1 funcionário com carteira",
        "Pro dia a dia, você vai precisar de um certificado digital (não vem no plano)",
      ],
    },
  ];
}

export function CheckMiniRegime() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12 4 4 8-9" />
    </svg>
  );
}

export function MeiOuMeView({
  contexto = "abrir",
  regime,
  setRegime,
  onSeguir,
  onVoltar,
}: {
  /** 🆕 04/08 — "abrir" pergunta o que ESCOLHER (elegibilidade); "migrar" pergunta o que a pessoa JÁ É (autodeclaração, o CNPJ já existe). */
  contexto?: "abrir" | "migrar";
  /** 🔴 27/08 — "presumido" saiu do tipo junto com o card (ver comentário no
   *  JSX). A tela agora tem exatamente 2 saídas, MEI e ME. */
  regime: "mei" | "me" | null;
  setRegime: (v: "mei" | "me") => void;
  onSeguir: () => void;
  /** Volta pro fork (E3) — quem chegou aqui pode ter errado abrir×migrar. */
  onVoltar?: () => void;
}) {
  const opcoes = opcoesRegime(contexto);
  // 🆕 29/08 (pedido do Pedro) — link de escape pra quem trava na escolha:
  // "Falar com o time" no MESMO padrão mock já usado no gate de sócios
  // (TriagemView) — ainda não existe canal real (WhatsApp/chat) ligado em
  // lugar nenhum do app, então fica resolução inline até existir um de
  // verdade.
  const [duvida, setDuvida] = useState(false);
  return (
    <>
      {/* 🆕 03/08 — faltava até o chrome de página (esta tela é renderizada
          sozinha, sem `/gate` ao redor pra fornecer header+main). Seta de
          voltar em CIMA, mesmo padrão de todas as outras telas (ex: E4.2).
          🐛 29/08 — `meta` é o rótulo do DESTINO do voltar, não desta tela.
          Estava "Sobre a sua empresa" (nome da tela SEGUINTE). */}
      <TelaHeader meta="Primeiros dados" onVoltar={onVoltar} />
      <main className="app-main">
      <div className="shrink-0">
        <h1 className="text-h1 mb-2">
          {contexto === "migrar" ? "Sua empresa hoje é MEI ou ME?" : "Você será MEI ou ME?"}
        </h1>
        {/* 🔄 29/08 (pedido do Pedro) — tirou o "se não souber"/"dá pra trocar
            de ideia depois": a escolha aqui não é reversível de graça lá na
            frente, então o tom não pode soar leve/opcional. */}
        <p className="text-body text-text-secondary mb-6">
          {contexto === "migrar"
            ? "Isso muda se a cidade importa e como a gente confirma seus dados."
            : "A diferença real é essa. Escolha com atenção: ela define o que vem a seguir."}
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-3">
          {/* 🔄 29/08 (pedido do Pedro) — vira o mesmo padrão de card
              ilustrado (prédio MEI menor × prédio ME maior, mesma família dos
              ícones de faixa/coorte). Antes cada opção já vinha com a lista de
              checks dentro do próprio botão; agora os checks só aparecem
              embaixo, depois de escolher — os 2 cards ficam lado a lado, só
              ícone + rótulo. */}
          <div className="grid grid-cols-2 gap-3">
            {opcoes.map((o) => (
              <CardIconeSelecao
                key={o.id}
                label={o.id === "mei" ? "MEI" : "ME"}
                iconeCoral={
                  o.id === "mei" ? "/icones/regime-mei-coral.png" : "/icones/regime-me-coral.png"
                }
                iconeCreme={
                  o.id === "mei" ? "/icones/regime-mei-creme.png" : "/icones/regime-me-creme.png"
                }
                selecionado={regime === o.id}
                onClick={() => setRegime(o.id)}
                tamanho={90}
              />
            ))}
          </div>

          {/* 🆕 03/08 — lista única de checks (mesmo padrão visual do "O que
              esse CNAE cobre", ConteudoCnae/tela Atende). Era 2 listas com
              estilo diferente (bullet + check) pra informação do mesmo tipo —
              lia como inconsistência, não hierarquia.
              🔄 29/08 — passou pra FORA do card, só aparece depois de
              escolher o regime. */}
          {regime && (
            <div className="rounded-md border border-border-hairline bg-surface-card p-4">
              <p className="text-body-strong font-bold text-text-primary mb-2">
                {opcoes.find((o) => o.id === regime)?.nome}
              </p>
              <div className="flex flex-col gap-1.5">
                {opcoes
                  .find((o) => o.id === regime)
                  ?.checks.map((c) => (
                    <div key={c} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-state-success-tint text-state-success-text">
                        <CheckMiniRegime />
                      </span>
                      <p className="text-caption text-text-secondary">{c}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 🔴 27/08 — o card "ME · Lucro Presumido" foi REMOVIDO daqui.
              Decisão do Pedro na reordenação do flow de entrada: "não vale o
              desgaste da dúvida agora" — a 3ª opção fazia mais gente parar pra
              pensar num regime que ela provavelmente não tem do que
              genuinamente reconhecia alguém (volume conhecidamente mínimo no
              ICP: ME de serviço no Simples).

              ⚠️ Como captar quem É Lucro Presumido ficou PARQUEADO de
              propósito, não resolvido. `/saida/regime-nao-suportado` continua
              existindo e alcançada pelo M1 (`/migrar/cnpj`), que confirma o
              regime pela Receita — ou seja, no caminho MIGRAR a pessoa ainda é
              reconhecida. Só o caminho ABRIR ficou sem porta pra ela.
              Ver `marca/decisoes-marca.md` 27/08. */}
        </div>

        {/* 🔄 29/08 (pedido do Pedro) — a versão "abrir" desse aviso saiu:
            "sua atividade ainda precisa estar na lista..." é redundante, a
            pessoa vê isso naturalmente na tela seguinte (E3.4). */}
        {contexto === "migrar" && (
          <p className="text-micro text-text-tertiary mt-4">
            A gente confirma o regime de verdade puxando o CNPJ da Receita, no
            próximo passo.
          </p>
        )}
      </div>

      <div className="app-footer-cta">
        {/* 🆕 29/08 (pedido do Pedro) — escape hatch pra quem trava na
            escolha, acima do CTA principal. */}
        {!duvida ? (
          <button
            type="button"
            onClick={() => setDuvida(true)}
            className="mb-3 block text-center w-full text-caption font-medium text-text-secondary underline underline-offset-4"
          >
            Estou com dúvida, preciso de ajuda
          </button>
        ) : (
          <p className="mb-3 text-center text-caption text-state-success-text">
            Combinado, nosso time vai entrar em contato.
          </p>
        )}
        <Button full disabled={!regime} onClick={onSeguir}>
          Continuar
        </Button>
      </div>
      </main>
    </>
  );
}

/**
 * 🐛 ACHADO ao verificar no browser (16/07): o `prefers-reduced-motion` do
 * globals.css só desliga animação CSS. O typewriter é JS, então passava batido
 * e ficava em movimento perpétuo — violando o UX-12 justamente pra quem mais
 * precisa dele. O protótipo tem o mesmo bug e ninguém tinha visto.
 *
 * `useSyncExternalStore` = a forma canônica de assinar um store externo
 * (matchMedia). Sem setState-em-effect (não cascateia render) e SSR-safe: o
 * snapshot do servidor é `false`, e no cliente lê o valor real na 1ª pintura.
 */
function useReducedMotion() {
  return useSyncExternalStore(
    (notificar) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", notificar);
      return () => mq.removeEventListener("change", notificar);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   🌾 Typewriter — colhido do protótipo. Não é enfeite: dá EXEMPLO REAL de
   resposta pro campo aberto, que é o que trava o leigo ("campo aberto sem
   exemplo" está na lista de estresse da persona `reta`).
   ───────────────────────────────────────────────────────────────────────── */
function useTypewriter(palavras: string[], pausado: boolean) {
  const [txt, setTxt] = useState("");
  const i = useRef(0);
  const c = useRef(0);
  const apagando = useRef(false);
  const reduzido = useReducedMotion();

  useEffect(() => {
    if (pausado || reduzido) return;
    const t = setTimeout(
      () => {
        const alvo = palavras[i.current % palavras.length];
        if (!apagando.current) {
          c.current++;
          setTxt(alvo.slice(0, c.current));
          if (c.current === alvo.length) {
            apagando.current = true;
          }
        } else {
          c.current--;
          setTxt(alvo.slice(0, c.current));
          if (c.current === 0) {
            apagando.current = false;
            i.current++;
          }
        }
      },
      apagando.current
        ? RITMO.apaga
        : c.current === palavras[i.current % palavras.length].length
          ? RITMO.segura
          : RITMO.digita
    );
    return () => clearTimeout(t);
  }, [txt, pausado, palavras, reduzido]);

  // Sem animação: mostra um exemplo estático. O EXEMPLO é o que importa
  // ("campo aberto sem exemplo" trava a persona `reta`); a animação é enfeite.
  if (reduzido) return palavras[0];
  return pausado ? "" : txt;
}
