"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Button } from "@/components/ui/button";

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
 * Pills de reconhecimento do N4 (17) — derivadas dos 103 CNAEs serviço-liso
 * (pesquisa/cnae-matriz/cnae-liso-servico.md). Cobrem 103/103.
 *
 * ⚠️ A pill ESTREITA, não valida (decisão 17/07 → legalize-pill-estreita-nao-valida).
 * Clicar não dá veredito: só afunila o universo pra IA e troca o exemplo do
 * campo. A pessoa AINDA descreve no textarea — é lá que a IA cruza e decide.
 * `ex` é a frase em 1ª pessoa que vira placeholder quando a pill é escolhida.
 */
export const PILLS = [
  { id: "tech", label: "Tecnologia e software", ex: "Desenvolvo sites, apps ou sistemas sob encomenda" },
  { id: "mkt", label: "Marketing e publicidade", ex: "Cuido das redes sociais e faço publicidade pra clientes" },
  { id: "design", label: "Design", ex: "Crio design gráfico, de interiores ou de produto" },
  { id: "foto", label: "Foto e vídeo", ex: "Fotografo, filmo e edito vídeo e áudio" },
  { id: "consult", label: "Consultoria e gestão", ex: "Dou consultoria de gestão pra pequenas empresas" },
  { id: "admin", label: "Apoio administrativo", ex: "Faço serviços de escritório, cobrança e teleatendimento" },
  { id: "cursos", label: "Cursos e treinamentos", ex: "Dou curso de idioma, informática ou preparatório" },
  { id: "ensino", label: "Ensino de arte e esporte", ex: "Ensino dança, música ou esporte" },
  { id: "eventos", label: "Eventos e festas", ex: "Organizo festas, feiras e eventos" },
  { id: "arte", label: "Arte e cultura", ex: "Sou artista ou produzo espetáculos e shows" },
  { id: "veiculos", label: "Conserto de veículos", ex: "Faço mecânica, funilaria ou borracharia" },
  { id: "eletronicos", label: "Conserto de eletrônicos", ex: "Conserto celular, computador e eletrônicos" },
  { id: "reparos", label: "Reparos em geral", ex: "Sou chaveiro ou conserto relógio, calçado e móvel" },
  { id: "maquinas", label: "Manutenção de máquinas", ex: "Faço manutenção de máquinas e equipamentos" },
  { id: "aluguel", label: "Aluguel de equipamentos", ex: "Alugo equipamentos e objetos" },
  { id: "hospedagem", label: "Hospedagem", ex: "Tenho pousada, albergue ou pensão" },
  { id: "salao", label: "Salão e beleza", ex: "Trabalho com salão, cabelo e beleza" },
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
  { id: "30k+", label: "Mais de R$ 30 mil" },
];

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
            ? "A gente confere se ele está na nossa lista de atendidos."
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
          Validar minha atividade
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
   que ser perguntado ANTES do dinheiro. Barrar depois = cobrar de quem não
   pode abrir. Espelha b1.triagem do motor.
   ⚠️ 28/07: a saída AGORA navega de verdade — "Falar com o time" era beco sem
   saída (as telas /saida/exterior e /saida/socios existiam mas nada linkava
   pra elas). Exterior tem precedência (bloqueio legal, LC 123 art.17) sobre
   3+ sócios (limite do produto) — mesma ordem que já dava o texto do aviso.
   ───────────────────────────────────────────────────────────────────────── */
export function TriagemView({
  socios,
  setSocios,
  exterior,
  setExterior,
  onSeguir,
  onSaida,
  exteriorSoComSocio = false,
}: {
  socios: number | null;
  setSocios: (n: number) => void;
  exterior: boolean | null;
  setExterior: (b: boolean) => void;
  onSeguir: () => void;
  /** Recebe a rota da saída graciosa; a demo pode só sinalizar. */
  onSaida: (rota: string) => void;
  /**
   * 🔓 UX-67 (29/07) — esconde a pergunta do exterior quando é solo.
   *
   * ⚠️ RESSALVA IMPORTANTE, e ela é fiscal: o gate do N3 confirma onde fica a
   * EMPRESA (BH), não onde a pessoa MORA. Um sócio único domiciliado fora do
   * Brasil derruba o Simples do mesmo jeito (LC 123 art.17), e é justamente o
   * que esta pergunta existe pra pegar ANTES do dinheiro (fail-fast, UX-21).
   * Escondendo, o caso "moro em Portugal e abro empresa em BH" passa direto e
   * só quebra depois de pagar. Por isso é opcional e está deslinkada: alternativa
   * sem furo seria REESCREVER a pergunta ("Você mora fora do Brasil?") em vez
   * de removê-la.
   */
  exteriorSoComSocio?: boolean;
}) {
  const solo = socios === 1;
  // Com a condicional ligada, a pergunta do exterior só existe DEPOIS de saber
  // quantos sócios são — antes disso ela não teria como se dirigir a ninguém.
  const perguntaExterior = exteriorSoComSocio
    ? socios !== null && !solo
    : true;
  /**
   * O título se dirige a QUEM existe na sociedade. "Alguém mora fora?" com
   * exatamente um sócio soa como se a gente não tivesse lido a resposta
   * anterior — e a tela acabou de perguntar isso.
   */
  const tituloExterior =
    exteriorSoComSocio && socios === 2
      ? "Seu sócio mora fora do Brasil?"
      : exteriorSoComSocio && socios !== null && socios > 2
        ? "Algum sócio mora fora do Brasil?"
        : "Alguém mora fora do Brasil?";
  const bloqueado = (socios !== null && socios > 2) || exterior === true;
  const completo =
    socios !== null && (perguntaExterior ? exterior !== null : true);
  const rotaSaida = exterior === true ? "/saida/exterior" : "/saida/socios";

  return (
    <>
      {/* Título FIXO (padrão de 3 partes: título fixo / corpo rola / CTA fixo) */}
      <div className="shrink-0">
        <h1 className="text-h1 mb-6">Duas perguntas rápidas</h1>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <p className="text-body-strong font-semibold mb-3">
          Quantas pessoas vão ser donas da empresa?
        </p>
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((n) => (
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
              {n === 3 ? "3 ou mais" : n === 1 ? "Só eu" : "2"}
            </button>
          ))}
        </div>

        {perguntaExterior && (
          <>
            <p className="text-body-strong font-semibold mb-3">{tituloExterior}</p>
            <div className="flex gap-2">
              {[
                { v: false, label: "Não" },
                { v: true, label: "Sim" },
              ].map((o) => (
                <button
                  key={String(o.v)}
                  onClick={() => setExterior(o.v)}
                  className={`flex-1 min-h-12 rounded-md border text-body font-semibold transition-colors
                    ${
                      exterior === o.v
                        ? "border-action-primary bg-action-primary text-text-on-brand"
                        : "border-border-hairline bg-surface-card text-text-secondary hover:border-border-strong"
                    }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Bloqueio que EDUCA (UX-07/09) e oferece saída, sem crash.
            ⚠️ danger, nunca coral: coral não é erro. */}
        {bloqueado && (
          <div className="mt-6 rounded-md bg-state-danger-tint p-4">
            <p className="text-body-strong font-semibold text-state-danger-text mb-1">
              Esse caso a gente resolve com uma pessoa
            </p>
            <p className="text-caption text-text-secondary">
              {exterior
                ? "Com sócio morando fora, a empresa até existe, mas fica fora do Simples. Nosso time te explica as opções."
                : "Acima de 2 sócios é limite do nosso produto, não da lei. Nosso time abre pra você."}
            </p>
          </div>
        )}
      </div>

      <div className="app-footer-cta">
        {bloqueado ? (
          <Button full variant="dark" onClick={() => onSaida(rotaSaida)}>
            Falar com o time
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
   * 🔓 UX-68 (29/07) — "sei o valor exato" REVELA o campo abaixo das faixas,
   * em vez de trocar a tela inteira. Trocar fazia parecer que a pessoa saiu
   * do passo (e some a referência das faixas justamente na hora de digitar um
   * número que vai cair numa delas).
   */
  exatoInline?: boolean;
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
          <div className="flex flex-col gap-2">
            {FAIXAS.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setFaixa(f.id);
                  // Tocar numa faixa desfaz o valor digitado: senão o número
                  // continuaria mandando e a seleção visual mentiria.
                  setExato("");
                  setModoExato(false);
                }}
                className={`w-full min-h-12 rounded-md border px-4 text-left text-body font-semibold transition-colors
                  ${
                    valor === 0 && faixa === f.id
                      ? "border-action-primary bg-action-primary text-text-on-brand"
                      : "border-border-hairline bg-surface-card text-text-secondary hover:border-border-strong"
                  }`}
              >
                {f.label}
              </button>
            ))}

            {modoExato ? (
              <div className="mt-2 flex flex-col gap-2">
                <p className="text-caption font-semibold text-text-primary">
                  Valor exato por mês
                </p>
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
          <div className="flex flex-col gap-2">
            {FAIXAS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFaixa(f.id)}
                className={`w-full min-h-12 rounded-md border px-4 text-left text-body font-semibold transition-colors
                  ${
                    faixa === f.id
                      ? "border-action-primary bg-action-primary text-text-on-brand"
                      : "border-border-hairline bg-surface-card text-text-secondary hover:border-border-strong"
                  }`}
              >
                {f.label}
              </button>
            ))}
            <button
              onClick={() => setModoExato(true)}
              className="mt-2 self-start text-caption font-medium text-text-secondary underline underline-offset-4"
            >
              Sei o valor exato
            </button>
          </div>
        )}
      </div>
      <div className="app-footer-cta">
        {/* 28/07: N5' (Resumo de valor) foi REMOVIDO — segue direto pro N6.
            Copy trocada: "ver o que eu ganho" prometia uma revelação que só
            existia no N5'; sem ele, a promessa vira mentira. */}
        <Button full disabled={!escolhida} onClick={onSeguir}>
          Continuar
        </Button>
      </div>
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
