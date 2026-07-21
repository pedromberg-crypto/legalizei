/**
 * ═══════════════════════════════════════════════════════════════════════════
 * StatusIcon — o ÁTOMO de status, unificado (Opção B, 21/07).
 * ═══════════════════════════════════════════════════════════════════════════
 * Provocação do Pedro: P1/P2 (`ListaPassos`) e N21/REC (`PainelView`) mostram
 * status; por que não unificar? Resposta: os DOIS SENTIDOS são opostos e não
 * podem borrar —
 *   · ListaPassos = checklist do que é SUA VEZ (o dossiê que VOCÊ preenche).
 *   · PainelView  = pipeline do que é VEZ DO ÓRGÃO (a máquina que você assiste).
 * O `lib/passos` já avisava: "a barra tem que distinguir sua vez de nossa vez".
 * Se o painel usasse o look de checklist, "Tirar o CNPJ" leria como tarefa dele.
 *
 * O que É duplicação boba: o ÁTOMO. O check verde estava copiado em 5 arquivos
 * (lista-passos, painel, ativa, plano, termo) e o círculo vazio em 2. Aqui vira
 * UM vocabulário de estados. Os dois modelos COMPÕEM isto, cada um puxando só o
 * subconjunto que faz sentido — nenhum carrega estado morto:
 *   · ListaPassos usa {feito, a-fazer, travado}.
 *   · PainelView  usa {feito, girando, a-fazer, recusa}.
 *
 * Unifica o COMO se desenha um status, NÃO o de quem é a vez. Por isso os
 * wrappers seguem separados (headers, contagem e CTA são de cada fase).
 *
 * ⚠️ Tokens (regra dura da paleta): feito = verde (state-success, é estado de
 * verdade); recusa = danger (um órgão externo parou a fila mesmo); girando =
 * info; travado = muted. Coral NUNCA é estado.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type StatusEstado = "feito" | "a-fazer" | "girando" | "travado" | "recusa";

/** Marcador de 18px. O caller provê o slot (`shrink-0`, alinhamento). */
export function StatusIcon({ estado }: { estado: StatusEstado }) {
  if (estado === "feito") return <Feito />;
  if (estado === "girando") return <Girando />;
  if (estado === "travado") return <Travado />;
  if (estado === "recusa") return <Recusa />;
  return <AFazer />;
}

/** Check verde preenchido. Verde = estado (CNPJ/passo concluído). */
function Feito() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 text-state-success"
      aria-hidden
    >
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path
        d="m7.5 12.4 3.1 3.1 6-6.2"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Círculo vazio: existe, está no caminho, ainda não é a vez. */
function AFazer() {
  return (
    <span className="block h-[18px] w-[18px] rounded-full border-2 border-border-strong" />
  );
}

/** Anel girando: a vez é do órgão, não sua. Sob reduced-motion para parado. */
function Girando() {
  return (
    <span
      className="block h-[18px] w-[18px] animate-spin rounded-full border-2 border-border-hairline border-t-[color:var(--color-state-info)]"
      aria-label="em andamento"
    />
  );
}

/** Cadeado: retido (só o boleto pendente liga isto na ListaPassos). */
function Travado() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-text-muted"
      aria-hidden
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

/** Vermelho "precisa de você": um órgão recusou e a bola está com o cliente. */
function Recusa() {
  return (
    <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-state-danger text-[11px] font-bold text-text-on-dark">
      !
    </span>
  );
}
