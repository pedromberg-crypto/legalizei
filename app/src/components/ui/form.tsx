"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 04/09 (auditoria com Playwright, aprovada pelo Pedro) — O RÓTULO PASSA A
 * SER O NOME ACESSÍVEL DO CAMPO.
 * ═══════════════════════════════════════════════════════════════════════════
 * Antes, o `Campo` desenhava o rótulo num `<p>` e o filho era um `<input>`
 * solto: pro olho a proximidade resolvia, pro software eram dois elementos
 * sem relação nenhuma. A auditoria mediu o efeito — os 8 campos da C1 com
 * `labels: 0` e sem `aria-label` — e um leitor de tela anunciava "campo de
 * edição" oito vezes, sem dizer qual era qual.
 *
 * O conserto mora AQUI, no DS, e não nas telas: o `Campo` gera um id, vira
 * `<label htmlFor>` e entrega o id por CONTEXTO. `Texto` e `Select` pegam
 * sozinhos. Nenhuma chamada muda (`<Campo rotulo="…">` segue igual) e nenhum
 * pixel muda — `<label>` e `<p>` renderizam idêntico com as mesmas classes.
 *
 * Contexto, e não prop, porque o filho do `Campo` é JSX arbitrário: tem tela
 * que põe o input direto, tem tela que embrulha em `<div>`. Prop exigiria
 * `cloneElement` (frágil) ou mudar a assinatura de todas as chamadas.
 * ═══════════════════════════════════════════════════════════════════════════
 */
type CampoCtx = { id: string; rotuloId: string } | null;
const CampoContexto = createContext<CampoCtx>(null);

/** O que `Texto`/`Select` usam pra se amarrar no rótulo do `Campo` que os envolve. */
function useCampo() {
  return useContext(CampoContexto);
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CAMPOS BÁSICOS DE FORM — promovidos ao DS em 19/07 (regra dos 3).
 * ═══════════════════════════════════════════════════════════════════════════
 * Vieram de `dossie/campos.tsx` junto com o esqueleto (`ui/tela.tsx`): o N6
 * (criar conta) e o N9 (CPF + pagamento) precisam de rótulo + input, e vivem
 * no wizard, fora do dossiê.
 *
 * ─── 29/07 — AS SELEÇÕES SUBIRAM TAMBÉM, E O GATILHO FOI O PREVISTO ──────
 * O doc dizia: "as seleções continuam locais no dossiê: ainda não apareceram
 * fora dele, e promover por antecipação é a abstração especulativa que o
 * design-system.md §6 proíbe". A condição de promoção era **aparecer fora**,
 * não passar tempo — e aconteceu: as telas do dossiê passaram a ser
 * renderizadas pela `/apresentacao` (fidelidade por construção), então
 * `OpcoesLinha`, `OpcoesColuna` e `Select` são usados por `wizard-dossie.tsx`,
 * que vive aqui em `components/` e não pode importar de dentro de uma rota.
 *
 * `dossie/campos.tsx` virou re-export puro: as 7 telas seguem importando
 * "../campos" e nenhuma precisou ser tocada por causa desta mudança.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Rótulo literal em cima (universal UX-48), dica opcional, filho embaixo. */
export function Campo({
  rotulo,
  dica,
  acao,
  children,
}: {
  rotulo: string;
  dica?: string;
  /**
   * 🆕 03/09 (pedido do Pedro, no IPTU da C4) — ação opcional alinhada à
   * DIREITA do rótulo. Nasceu pro "i" de campo: tem dado (o índice cadastral
   * é o caso-mãe) em que a explicação é sobre AQUELE campo, não sobre a tela
   * inteira, e enfiar isso no "i" do cabeçalho misturava dois assuntos.
   */
  acao?: ReactNode;
  children: ReactNode;
}) {
  const base = useId();
  const id = `${base}-campo`;
  const rotuloId = `${base}-rotulo`;
  return (
    <CampoContexto.Provider value={{ id, rotuloId }}>
      <div>
        {/* 🐛 02/09 — rótulo vazio deixava um `<p>` fantasma ocupando a
            altura de uma linha (achado na C2, onde a pergunta virou só o
            título). Mesmo tratamento que o `OutrasOpcoes` já dá ao título. */}
        {rotulo && (
          <div className="flex items-center gap-2">
            {/* 🆕 04/09 — era `<p>`. Virou `<label>` com as MESMAS classes:
                mesmo desenho, e agora tocar no rótulo foca o campo (ganho real
                em tela pequena, onde o alvo do input é estreito). */}
            <label
              id={rotuloId}
              htmlFor={id}
              className="text-caption font-semibold text-text-primary"
            >
              {rotulo}
            </label>
            {acao && <div className="ml-auto shrink-0">{acao}</div>}
          </div>
        )}
        {dica && <p className="text-micro text-text-tertiary mt-0.5">{dica}</p>}
        <div className="mt-1.5">{children}</div>
      </div>
    </CampoContexto.Provider>
  );
}

/* ─── Entrada de texto ──────────────────────────────────────────────────────
   Erro INLINE (nunca modal), microcopy que ensina, não pune. */

export function Texto({
  valor,
  onChange,
  placeholder,
  erro,
  ok,
  inputMode,
  maxLength,
  type,
  travado = false,
  acao,
}: {
  valor: string;
  onChange: (v: string) => void;
  placeholder?: string;
  erro?: string;
  ok?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  maxLength?: number;
  type?: "text" | "email" | "password";
  /**
   * 🆕 02/09 — campo PREENCHIDO E TRAVADO. Nasceu pro CPF na C1: ele
   * identifica a pessoa em tudo que já rodou (cobrança, consulta de situação,
   * futuro DBE), então mostrar em cinza é mais honesto que esconder — ela
   * confere que é o dela sem achar que pode trocar. Correção de CPF é outro
   * assunto, e passa por gente.
   */
  travado?: boolean;
  /**
   * 🆕 03/09 (pedido do Pedro, C7) — ação DENTRO do campo, na ponta direita.
   * Nasceu pro "i" de dicas do nome: a dúvida "o que eu escrevo aqui?" nasce
   * na hora de digitar, então a porta fica no próprio campo, não no rótulo.
   * Sem ela, o `<input>` continua exatamente como sempre foi.
   */
  acao?: ReactNode;
}) {
  /* 🆕 04/09 — o id vem do `Campo` que envolve este input. Fora de um `Campo`
     (uso solto) o contexto é `null` e nada muda: o input segue como sempre. */
  const campo = useCampo();
  const moldura = `min-h-12 rounded-md border ${
    travado
      ? "border-border-hairline bg-surface-alt"
      : erro
        ? "border-state-danger bg-surface-card"
        : "border-border-hairline bg-surface-card"
  }`;
  const texto = travado ? "text-text-tertiary" : "text-text-primary";

  if (acao) {
    return (
      <>
        {/* Com ação, quem carrega a moldura é o container e o input entra
            "pelado" — senão seriam duas bordas, uma dentro da outra. O
            `focus-within` mantém o mesmo feedback de foco do campo normal. */}
        <div
          className={`flex w-full items-center gap-2 px-3 transition-colors ${moldura} ${
            travado || erro ? "" : "focus-within:border-border-focus"
          }`}
        >
          <input
            id={campo?.id}
            value={valor}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            inputMode={inputMode}
            maxLength={maxLength}
            type={type}
            disabled={travado}
            className={`min-w-0 flex-1 bg-transparent py-3 text-body placeholder:text-text-muted focus:outline-none ${texto}`}
          />
          <div className="shrink-0">{acao}</div>
        </div>
        {erro && <p className="text-micro text-state-danger-text mt-1">{erro}</p>}
        {!erro && ok && (
          <p className="text-micro text-state-success-text mt-1">{ok}</p>
        )}
      </>
    );
  }

  return (
    <>
      <input
        id={campo?.id}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        type={type}
        disabled={travado}
        className={`w-full min-h-12 rounded-md border px-3 text-body
          placeholder:text-text-muted focus:outline-none
          ${
            travado
              ? "border-border-hairline bg-surface-alt text-text-tertiary"
              : erro
                ? "border-state-danger bg-surface-card text-text-primary"
                : "border-border-hairline bg-surface-card text-text-primary focus:border-border-focus"
          }`}
      />
      {erro && <p className="text-micro text-state-danger-text mt-1">{erro}</p>}
      {!erro && ok && (
        <p className="text-micro text-state-success-text mt-1">{ok}</p>
      )}
    </>
  );
}

/* ─── Checkbox de aceite — promovido ao DS (K4, 21/07) ─────────────────────
   Antes cada tela de aceite tinha o seu: o N8 usava `<input>` nativo (accent
   coral), o N20 um botão custom com check verde. São telas-IRMÃS (as duas de
   aceite do flow) e o usuário vê as duas — dois padrões pro mesmo gesto é
   incoerência de DS. Um só, usado nos dois.

   Visual custom + input nativo escondido (`sr-only`) = semântica de verdade
   (teclado, leitor de tela) com controle de estilo. A caixa inteira é o alvo
   (o <label> embrulha tudo). Marcado = fill de AÇÃO (coral-600), não estado-
   sucesso: aceitar é um ATO, não um "deu certo" — verde é token de estado, e
   gastá-lo aqui enfraqueceria o verde onde ele importa (CNPJ ativo). */
export function Checkbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
}) {
  return (
    // 🆕 01/09 (pedido do Pedro) — marcado, a BORDA do bloco também fica
    // coral. Só a cor muda: mesma espessura, mesmo fundo, mesmo espaçamento.
    // O quadradinho sozinho é pequeno demais pra registrar o "pronto" quando a
    // pessoa está olhando o CTA embaixo; a borda dá o feedback no tamanho do
    // alvo que ela acabou de tocar.
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-md border bg-surface-card p-3 transition-colors ${
        checked ? "border-action-primary" : "border-border-hairline"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
          checked
            ? "border-action-primary bg-action-primary"
            : "border-border-strong bg-surface-card"
        }`}
        aria-hidden
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 12.5 9.5 18 20 6"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="text-caption text-text-secondary">{children}</span>
      {/* Input real, invisível: dá a semântica e o toggle por teclado. */}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
    </label>
  );
}

/* ─── Seleção em botões ─────────────────────────────────────────────────────
   Botão grande com rótulo literal > dropdown pro leigo (UX-48). Linha p/ 2–3
   opções curtas; coluna p/ listas ou rótulos longos.

   ⚠️ 29/07 — ESTADO SELECIONADO É CORAL SÓLIDO COM TEXTO BRANCO, o mesmo do
   N4 (triagem e faixa): `border-action-primary bg-action-primary
   text-text-on-brand`. Antes o dossiê usava tint coral com texto escuro
   (`bg-surface-tint-brand text-text-primary`), que é MAIS FRACO que o padrão do
   gate — duas gramáticas pro mesmo gesto de "escolhi esta". Como o gate vem
   antes no flow, quem chega no dossiê aprendeu o coral sólido e reencontra um
   tint pálido: parece menos selecionado do que está. */

interface Opcao<T> {
  v: T;
  label: string;
}

export function OpcoesLinha<T extends string | number | boolean>({
  opcoes,
  valor,
  onChange,
}: {
  opcoes: Opcao<T>[];
  valor: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-2">
      {opcoes.map((o) => (
        <BotaoOpcao
          key={String(o.v)}
          on={valor === o.v}
          onClick={() => onChange(o.v)}
          className="flex-1 text-center"
        >
          {o.label}
        </BotaoOpcao>
      ))}
    </div>
  );
}

export function OpcoesColuna<T extends string | number | boolean>({
  opcoes,
  valor,
  onChange,
}: {
  opcoes: Opcao<T>[];
  valor: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {opcoes.map((o) => (
        <BotaoOpcao
          key={String(o.v)}
          on={valor === o.v}
          onClick={() => onChange(o.v)}
          className="px-4 text-left"
        >
          {o.label}
        </BotaoOpcao>
      ))}
    </div>
  );
}

function BotaoOpcao({
  on,
  onClick,
  className = "",
  children,
}: {
  on: boolean;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`min-h-12 rounded-md border text-body font-semibold transition-colors ${className}
        ${
          on
            ? "border-action-primary bg-action-primary text-text-on-brand"
            : "border-border-hairline bg-surface-card text-text-secondary hover:border-border-strong"
        }`}
    >
      {children}
    </button>
  );
}

/**
 * Dropdown PRÓPRIO, não `<select>` nativo. A lista de options do select nativo
 * não é estilizável (fonte de sistema, highlight azul do OS, zero controle) —
 * pra respeitar o DS a lista tem que ser DOM nossa.
 *
 * ⚠️ Descartável no produto: a stack é React Native (travada 09/07), onde isto
 * vira `Picker` NATIVO. Este componente existe pra a review web parecer o que
 * o app vai ser, não pra ir pro RN. Por isso a a11y aqui é "suficiente pra
 * mock" (listbox + teclado + click-fora + escape), não a rigor de produção.
 *
 * Editar aqui muda os 3 dropdowns (N10 estado civil + regime · N13 tipo).
 */
export function Select({
  valor,
  onChange,
  opcoes,
  placeholder = "Selecione",
  valorEmDestaque = false,
}: {
  valor: string;
  onChange: (v: string) => void;
  /** 🆕 29/08 (pedido do Pedro) — `destaque: "coral"` pinta a opção (e o
   *  rótulo quando selecionada) na cor de marca, pra opções tipo "não
   *  encontrei o que procuro" se destacarem das demais na lista. */
  opcoes: { v: string; label: string; destaque?: "coral" }[];
  placeholder?: string;
  /**
   * 🆕 02/09 (pedido do Pedro) — o VALOR escolhido em coral e negrito.
   * Nasceu na C0, onde a categoria não é um campo qualquer do formulário: ela
   * é a resposta que a pessoa deu antes de pagar, chega pronta, e a tela
   * inteira depende dela. Ler "qual é a minha mesmo?" de relance importa mais
   * ali do que num estado civil.
   * Por prop: nos dropdowns de formulário o valor segue em ink, senão todo
   * campo preenchido virava destaque e nenhum seria.
   */
  valorEmDestaque?: boolean;
}) {
  /* 🆕 04/09 — o `Select` do DS NÃO é `<select>` nativo: é um listbox custom
     (botão + `ul[role=listbox]`). `button` é elemento rotulável, então o
     `htmlFor` do `Campo` já aponta pra cá; o `aria-labelledby` entra junto
     porque é o que os leitores usam com `aria-haspopup`. */
  const campo = useCampo();
  const [aberto, setAberto] = useState(false);
  const [foco, setFoco] = useState(0); // índice destacado por teclado
  const ref = useRef<HTMLDivElement>(null);

  const selecionado = opcoes.find((o) => o.v === valor);
  const idxSel = opcoes.findIndex((o) => o.v === valor);

  // Fecha ao clicar fora. pointerdown (não click) fecha antes de qualquer
  // ação da tela por baixo.
  useEffect(() => {
    if (!aberto) return;
    const fora = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setAberto(false);
    };
    window.addEventListener("pointerdown", fora);
    return () => window.removeEventListener("pointerdown", fora);
  }, [aberto]);

  function abrir() {
    setFoco(idxSel >= 0 ? idxSel : 0);
    setAberto(true);
  }
  function escolher(v: string) {
    onChange(v);
    setAberto(false);
  }
  function onKey(e: React.KeyboardEvent) {
    if (!aberto) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        abrir();
      }
      return;
    }
    if (e.key === "Escape" || e.key === "Tab") {
      setAberto(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setFoco((i) => Math.min(i + 1, opcoes.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFoco((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      escolher(opcoes[foco].v);
    }
  }

  return (
    <div ref={ref} className="relative">
      {/* Gatilho: mesma silhueta do input (min-h-12, borda, raio). Borda foca
          quando aberto; seta gira. */}
      <button
        type="button"
        id={campo?.id}
        aria-labelledby={campo ? `${campo.rotuloId} ${campo.id}` : undefined}
        aria-haspopup="listbox"
        aria-expanded={aberto}
        onClick={() => (aberto ? setAberto(false) : abrir())}
        onKeyDown={onKey}
        className={`flex min-h-12 w-full items-center justify-between gap-2 rounded-md border
          bg-surface-card pl-3 pr-3.5 text-left text-body transition-colors focus:outline-none
          ${aberto ? "border-border-focus" : "border-border-hairline hover:border-border-strong"}
          ${
            selecionado
              ? /* 🔄 04/09 (pedido do Pedro) — coral CLARO (`text-brand`) no
                   VALOR selecionado, no lugar do coral-700. Vale nos dois
                   lugares onde este destaque existe hoje (a categoria da C0 e
                   a do E3.4), que é justamente o par que ele pediu pra
                   igualar. 🔴 Custa contraste: coral-500 sobre branco dá ~3:1
                   e a régua de 12/07 pede 4,5:1 pra texto de 16px. Decisão do
                   Pedro, com o custo na mesa. */
                selecionado.destaque === "coral" || valorEmDestaque
                ? "font-semibold text-brand"
                : "text-text-primary"
              : "text-text-muted"
          }`}
      >
        <span className="truncate">
          {selecionado ? selecionado.label : placeholder}
        </span>
        <svg
          className={`shrink-0 text-text-tertiary transition-transform ${aberto ? "rotate-180" : ""}`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          aria-hidden
        >
          <path
            d="M1 1.5 6 6.5l5-5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Lista NOSSA: floating de verdade → sombra permitida (design-system §1).
          Selecionado = tint coral + check; destaque de teclado = surface-alt. */}
      {aberto && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+4px)] z-20 max-h-64 overflow-y-auto rounded-md
                     border border-border-hairline bg-surface-card p-1 shadow-lg
                     [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {opcoes.map((o, i) => {
            const on = o.v === valor;
            return (
              <li
                key={o.v}
                role="option"
                aria-selected={on}
                onPointerEnter={() => setFoco(i)}
                onClick={() => escolher(o.v)}
                className={`flex min-h-11 cursor-pointer items-center justify-between gap-2 rounded-sm px-3 text-body
                  ${o.destaque === "coral" ? "font-semibold text-action-primary-sm" : on ? "bg-surface-tint-brand text-text-primary" : "text-text-secondary"}
                  ${!on && foco === i ? "bg-surface-alt" : ""}`}
              >
                <span className="truncate">{o.label}</span>
                {on && (
                  <svg
                    className="shrink-0 text-action-primary"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M2.5 7.5 6 11l5.5-8"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
