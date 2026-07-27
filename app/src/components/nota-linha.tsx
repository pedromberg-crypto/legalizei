import Link from "next/link";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LinhaNota — a linha/card de uma nota fiscal. Componente ÚNICO (24/07).
 * ═══════════════════════════════════════════════════════════════════════════
 * Fonte única do card de nota, usado em DOIS lugares:
 *   · home (NotasRecentesMov) — glance, tudo emitida → `statusNoTexto={false}`
 *     (o dot verde já diz "emitida"; o texto fica só com a data).
 *   · P5 /notas — o ledger completo, status misto → `statusNoTexto` (default)
 *     mostra o rótulo do estado; `href` torna a linha clicável pro detalhe P7.
 *
 * Avatar = VARIANTE C (escolha do Pedro, 24/07): iniciais do cliente (mata o
 * "NF" redundante) + um DOT de status no canto (verde/azul/cinza/vermelho).
 * Quem + status na âncora, sem poluir.
 *
 * ⚠️ Dot usa só tokens de ESTADO (coral nunca é status). Valor: verde "+" quando
 * de fato virou receita (emitida); neutro enquanto emite; riscado se a nota não
 * entrou (cancelada/recusada).
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type StatusNota = "emitindo" | "emitida" | "cancelada" | "recusada";

export type Nota = {
  id: string;
  tomador: string;
  valor: number; // centavos
  data: string;
  numero?: string;
  status: StatusNota;
};

const ST: Record<StatusNota, { text: string; dot: string; label: string }> = {
  emitida: { text: "text-state-success-text", dot: "bg-state-success", label: "Emitida" },
  emitindo: { text: "text-state-info-text", dot: "bg-state-info", label: "Em emissão" },
  cancelada: { text: "text-text-tertiary", dot: "bg-border-strong", label: "Cancelada" },
  recusada: { text: "text-state-danger-text", dot: "bg-state-danger", label: "Recusada" },
};

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function iniciais(nome: string): string {
  const p = nome.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase();
}

export function LinhaNota({
  nota,
  href,
  statusNoTexto = true,
}: {
  nota: Nota;
  /** Presente = linha clicável (Link) pro detalhe. Ausente = div estática. */
  href?: string;
  /** false (home) = subtítulo só com a data; o dot já diz o estado. */
  statusNoTexto?: boolean;
}) {
  const s = ST[nota.status];

  const conteudo = (
    <>
      {/* Avatar C: iniciais + dot de status no canto (border punch-out). */}
      <span className="relative shrink-0">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-dark text-micro font-bold text-text-on-dark">
          {iniciais(nota.tomador)}
        </span>
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-surface-card ${s.dot}`}
          aria-hidden
        />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-caption font-semibold text-text-primary">
          {nota.numero ? `#${nota.numero} · ` : ""}
          {nota.tomador}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-micro">
          {statusNoTexto ? (
            <>
              {nota.status === "emitindo" && <SpinnerMini />}
              <span className={s.text}>{s.label}</span>
              <span className="text-text-tertiary"> · {nota.data}</span>
            </>
          ) : (
            <span className="text-text-tertiary">{nota.data}</span>
          )}
        </p>
      </div>

      <ValorNota status={nota.status} valor={nota.valor} />
    </>
  );

  const base =
    "flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3";

  return href ? (
    <Link
      href={href}
      className={`${base} transition-colors hover:border-border-strong active:bg-surface-alt`}
    >
      {conteudo}
    </Link>
  ) : (
    <div className={base}>{conteudo}</div>
  );
}

function ValorNota({ status, valor }: { status: StatusNota; valor: number }) {
  const txt = formatBRL(valor / 100);
  if (status === "emitida") {
    return <span className="shrink-0 text-caption font-bold text-state-success-text">+ {txt}</span>;
  }
  if (status === "emitindo") {
    return <span className="shrink-0 text-caption font-semibold text-text-secondary">{txt}</span>;
  }
  return <span className="shrink-0 text-caption font-semibold text-text-tertiary line-through">{txt}</span>;
}

/** Spinner 12px pro "em emissão" (a prefeitura processa) — prova o assíncrono. */
function SpinnerMini() {
  return (
    <span
      className="block h-3 w-3 shrink-0 animate-spin rounded-full border-2 border-border-hairline border-t-[color:var(--color-state-info)]"
      aria-label="em emissão"
    />
  );
}
