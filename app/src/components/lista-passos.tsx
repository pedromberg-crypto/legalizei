import { passosDoCliente } from "@/lib/passos";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LISTA DE PASSOS — o mesmo dossiê, visto de dois lugares.
 * ═══════════════════════════════════════════════════════════════════════════
 * Compartilhado entre P1 (retomar) e P2 (aguardando boleto). Extraído no
 * primeiro momento em que as duas precisaram dela: manter duas cópias da
 * mesma lista foi exatamente o que fez "5 de 9" e "3 de 6" coexistirem.
 *
 * ─── TRÊS ESTADOS, E O TERCEIRO É O QUE IMPORTA AQUI ─────────────────────
 *   ✅ **feito**    — check verde, texto apagado. Já era.
 *   ⬜ **a fazer**  — círculo vazio, texto normal. Disponível agora.
 *   🔒 **travado**  — cadeado, texto em `text-muted`. Existe, está no caminho
 *                     dele, e **não some**: sumir esconderia o tamanho real do
 *                     processo; cinza mostra que existe e que ainda não é a vez.
 *
 * O travado só aparece com boleto pendente, e só no passo que realmente trava.
 * A mecânica do boleto libera N10–N18 inteiros e retém apenas o desfecho
 * (N19 revisão + N20 termo) — então travar mais que isso seria mentir na
 * direção oposta, fazendo o cliente achar que não pode fazer nada enquanto
 * espera. O que ele mais precisa saber é justamente o contrário.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function ListaPassos({
  concluidos,
  temCnaeOtimo,
  pagamentoPendente = false,
  mostrarDestino = false,
}: {
  concluidos: number;
  temCnaeOtimo: boolean;
  /** Boleto emitido e ainda não compensado. Só isso liga o estado travado. */
  pagamentoPendente?: boolean;
  /** Fecha a lista com "Empresa constituída". Ver `Destino` abaixo. */
  mostrarDestino?: boolean;
}) {
  const passos = passosDoCliente(temCnaeOtimo);

  return (
    <div className="flex flex-col gap-1.5">
      {passos.map((p, i) => {
        const feito = i < concluidos;
        const travado = pagamentoPendente && !!p.travaSemPagamento && !feito;
        return (
          <Linha key={p.tela} nome={p.nome} feito={feito} travado={travado} />
        );
      })}
      {/* Travado sempre que o pagamento estiver pendente: o destino depende do
          "Revisar e confirmar", que é o que o boleto retém. Mostrar o desfecho
          disponível enquanto o passo anterior está trancado seria incoerente. */}
      {mostrarDestino && <Destino travado={pagamentoPendente} />}
    </div>
  );
}

function Linha({
  nome,
  feito,
  travado,
}: {
  nome: string;
  feito: boolean;
  travado: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0">
        {feito ? (
          <Check />
        ) : travado ? (
          <Cadeado />
        ) : (
          <span className="block h-[18px] w-[18px] rounded-full border-2 border-border-strong" />
        )}
      </span>
      <div className="min-w-0">
        <span
          className={`text-body ${
            travado
              ? "text-text-muted"
              : feito
                ? "text-text-tertiary"
                : "text-text-primary"
          }`}
        >
          {nome}
        </span>
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
function Destino({ travado = false }: { travado?: boolean }) {
  return (
    // Sem fundo: o item é uma linha da lista como as outras, e o verde do
    // círculo + o peso do texto já bastam pra marcar que é o desfecho. O tint
    // fazia dele um bloco, e bloco lê como "outra coisa" — exatamente o que a
    // gente tinha acabado de corrigir no alinhamento.
    <div className="mt-1 flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0">
        {travado ? (
          <Cadeado />
        ) : (
          /* Círculo VAZIO, mesmo desenho dos "a fazer", só que verde. Vazio
             porque ainda não aconteceu — preenchê-lo diria que já está pronto.
             Quando a empresa sai, ele vira o check preenchido igual aos de
             cima, e a lista fecha no mesmo vocabulário em que começou. */
          <span className="block h-[18px] w-[18px] rounded-full border-2 border-state-success" />
        )}
      </span>
      {/* Travado perde o verde e vira `text-muted`, igual aos outros travados.
          Verde com cadeado se contradiria: a cor diria "disponível" e o ícone
          diria "retido". Quando o pagamento cair, o item inteiro volta a verde
          junto com os outros — a lista destrava de uma vez, e isso é visível. */}
      <span
        className={`text-body font-semibold ${
          travado ? "text-text-muted" : "text-state-success-text"
        }`}
      >
        Empresa constituída
      </span>
    </div>
  );
}

function Check() {
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

function Cadeado() {
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
