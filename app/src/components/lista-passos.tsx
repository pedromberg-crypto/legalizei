import { passosDoCliente } from "@/lib/passos";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LISTA DE PASSOS — o mesmo dossiê, visto de dois lugares.
 * ═══════════════════════════════════════════════════════════════════════════
 * Compartilhado entre P1 (retomar) e P2 (aguardando boleto). Extraído no
 * primeiro momento em que as duas precisaram dela: manter duas cópias da
 * mesma lista foi exatamente o que fez "5 de 9" e "3 de 6" coexistirem.
 *
 * 🔄 28/08 (pedido do Pedro: "atualizar usando de referência o layout da A5,
 * só layout") — trocou de checklist plana (ícone 18px + texto) pra TRILHA
 * conectada (nó 32px + linha + pill de status), mesmo idioma visual da
 * `PassoAtivacaoItem`/`NodeAtivacao` do A5 (`wizard-cauda.tsx`). Semântica
 * ZERO mudou: os mesmos 3 estados, as mesmas props (`concluidos`,
 * `pagamentoPendente`, `mostrarDestino`), a mesma régua de quando cada um
 * aparece. Só a casca virou trilha.
 *
 * ─── TRÊS ESTADOS, E O TERCEIRO É O QUE IMPORTA AQUI ─────────────────────
 *   ✅ **feito**    — nó verde preenchido, texto apagado. Já era.
 *   ⬜ **a fazer**  — nó numerado (ou destacado, se for a VEZ dele agora).
 *   🔒 **travado**  — nó com cadeado, texto em `text-muted`. Existe, está no
 *                     caminho, e **não some**: sumir esconderia o tamanho
 *                     real do processo; cinza mostra que existe e que ainda
 *                     não é a vez.
 *
 * O travado só aparece com boleto pendente, e só no passo que realmente trava.
 * A mecânica do boleto libera a coleta inteira (N10–N16) e retém apenas o
 * desfecho (N19 revisão + N20 termo) — então travar mais que isso seria mentir na
 * direção oposta, fazendo o cliente achar que não pode fazer nada enquanto
 * espera. O que ele mais precisa saber é justamente o contrário.
 *
 * 🆕 28/08 — o 1º passo NÃO concluído e NÃO travado ganha destaque de "é a
 * vez dele agora" (anel coral + pill "Agora" pulsando), mesmo idioma da A5
 * ("Em andamento"). Antes todo "a fazer" era visualmente idêntico; agora o
 * PRÓXIMO passo se distingue dos que ainda estão mais à frente.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function ListaPassos({
  concluidos,
  pagamentoPendente = false,
  mostrarDestino = false,
}: {
  concluidos: number;
  /** Boleto emitido e ainda não compensado. Só isso liga o estado travado. */
  pagamentoPendente?: boolean;
  /** Fecha a lista com "Empresa constituída". Ver `Destino` abaixo. */
  mostrarDestino?: boolean;
}) {
  const passos = passosDoCliente();
  const ultimoIndex = mostrarDestino ? passos.length : passos.length - 1;

  return (
    <div className="flex flex-col">
      {passos.map((p, i) => {
        const feito = i < concluidos;
        const travado = pagamentoPendente && !!p.travaSemPagamento && !feito;
        const agora = !feito && !travado && i === concluidos;
        return (
          <Linha
            key={p.tela}
            n={i + 1}
            nome={p.nome}
            feito={feito}
            travado={travado}
            agora={agora}
            ultimo={i === ultimoIndex}
          />
        );
      })}
      {/* Travado sempre que o pagamento estiver pendente: o destino depende do
          "Revisar e confirmar", que é o que o boleto retém. Mostrar o desfecho
          disponível enquanto o passo anterior está trancado seria incoerente. */}
      {mostrarDestino && (
        <Destino travado={pagamentoPendente} ultimo n={passos.length + 1} />
      )}
    </div>
  );
}

function Linha({
  n,
  nome,
  feito,
  travado,
  agora,
  ultimo,
}: {
  n: number;
  nome: string;
  feito: boolean;
  travado: boolean;
  agora: boolean;
  ultimo: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <No n={n} feito={feito} travado={travado} agora={agora} />
        {!ultimo && <div className="my-1 w-0.5 flex-1 rounded-full bg-border-hairline" />}
      </div>
      <div className={`flex-1 ${ultimo ? "" : "pb-5"}`}>
        <div className="flex items-start justify-between gap-2 pt-1">
          <span
            className={`text-body ${
              travado
                ? "text-text-muted"
                : feito || agora
                  ? "text-text-primary"
                  : "text-text-secondary"
            }`}
          >
            {nome}
          </span>
          {feito && (
            <span className="shrink-0 text-micro font-semibold text-state-success-text">
              Feito
            </span>
          )}
          {agora && (
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-state-info-tint px-2.5 py-1 text-micro font-semibold text-state-info-text">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-state-info-text" />
              Agora
            </span>
          )}
        </div>
        {/* Nenhuma linha de apoio aqui. A lista é um mapa: nome do passo e
            estado, nada mais. Explicação item a item ("quando o pagamento
            cair", "checamos na junta") transformava cada linha em parágrafo e
            matava a leitura de relance, que é o único trabalho dela.
            A checagem do nome é comportamento do N16 e se explica lá dentro,
            na hora em que o cliente digita. */}
      </div>
    </div>
  );
}

/** O nó de 32px da trilha — mesmo idioma visual da `NodeAtivacao` (A5). */
function No({
  n,
  feito,
  travado,
  agora,
}: {
  n: number;
  feito: boolean;
  travado: boolean;
  agora: boolean;
}) {
  if (feito) {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-state-success text-text-on-dark">
        <IconeCheckTrilha />
      </span>
    );
  }
  if (travado) {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-alt text-text-muted">
        <IconeCadeadoTrilha />
      </span>
    );
  }
  if (agora) {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-action-primary text-text-on-brand ring-4 ring-action-primary/20">
        {n}
      </span>
    );
  }
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-strong text-micro font-bold text-text-tertiary">
      {n}
    </span>
  );
}

/**
 * O DESTINO — "Empresa constituída".
 *
 * ⚠️ NÃO é um passo, e por isso não entra em `PASSOS_DOSSIE` nem na contagem:
 * continua "3 de 10". Passo é coisa que o cliente FAZ; isto é o que ele
 * recebe. Somá-lo inflaria o denominador com trabalho que não é dele.
 *
 * Bandeira, não troféu. A spec do N24 é explícita: "empresa ativa é uma PONTE,
 * não a linha de chegada" — o produto continua no dia-2 (1ª nota, 1º DAS,
 * certificado). Troféu prometeria fim; bandeira marca o ponto onde a lista
 * acaba e a empresa começa a existir.
 *
 * O verde e o destaque são o argumento inteiro da lista: o cliente vê, de
 * relance, que aqueles passos cinzentos levam a algum lugar concreto.
 */
function Destino({ travado = false, ultimo, n }: { travado?: boolean; ultimo: boolean; n: number }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        {travado ? (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-alt text-text-muted">
            <IconeCadeadoTrilha />
          </span>
        ) : (
          /* Círculo VAZIO verde: o "a-fazer" pintado de META. Vazio porque
             ainda não aconteceu; quando a empresa sai, vira o check
             preenchido igual aos de cima e a lista fecha no mesmo
             vocabulário. Fica LOCAL: é marca de DESTINO, não um estado
             normal da trilha (nenhum passo é "meta"). */
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-state-success text-state-success-text">
            {n}
          </span>
        )}
        {!ultimo && <div className="my-1 w-0.5 flex-1 rounded-full bg-border-hairline" />}
      </div>
      <div className={`flex-1 pt-1 ${ultimo ? "" : "pb-5"}`}>
        {/* Travado perde o verde e vira `text-muted`, igual aos outros
            travados. Verde com cadeado se contradiria: a cor diria
            "disponível" e o ícone diria "retido". Quando o pagamento cair, o
            item inteiro volta a verde junto com os outros — a lista destrava
            de uma vez, e isso é visível. */}
        <span
          className={`text-body font-semibold ${
            travado ? "text-text-muted" : "text-state-success-text"
          }`}
        >
          Empresa constituída
        </span>
      </div>
    </div>
  );
}

function IconeCheckTrilha() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}
function IconeCadeadoTrilha() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
