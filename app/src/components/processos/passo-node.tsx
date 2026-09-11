"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { PASSO_W, PASSO_H } from "@/lib/processos-medidas";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * NÓ DE PASSO — o cartão do board /processos (11/09, pedido do Pedro).
 * ═══════════════════════════════════════════════════════════════════════════
 * Irmão do `mapa/tela-node`, com uma diferença que é a razão do board existir:
 * AQUI NÃO HÁ TELA. O nó não mostra prévia de aparelho nem leva pra rota; ele
 * mostra o PASSO do processo, com as cinco perguntas que a doutrina fixou
 * (`_doutrina-processos.md` §2).
 *
 * Três decisões de desenho, e cada uma resolve um problema real:
 *
 * 1. A COR É O SEMÁFORO, não o tipo de nó. No /mapa a cor diz "tela feliz /
 *    branch / saída"; aqui ela diz 🟢 sabemos e dá · 🟡 falta decidir ·
 *    🔴 não sabemos. O Pedro bate o olho no board e vê onde estão os buracos
 *    sem ler um nó sequer — que é exatamente o que ele pediu.
 *
 * 2. "COM QUEM FALA" APARECE NO CARTÃO, não escondido no painel lateral. É o
 *    dado que ele quer auditar ("enxergar se tudo está coberto" por API). Nó
 *    sem interlocutor declarado tem que doer de olhar.
 *
 * 3. DECISÃO TEM FORMA PRÓPRIA (losango no topo + borda dupla). Bifurcação se
 *    VÊ, não se lê: num board de processo, é onde mora a regra de negócio.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type Passo = {
  id: string;
  processo: string;
  titulo: string;
  quem: string;
  faz: string;
  fala: string;
  ve: string;
  luz: "verde" | "amarelo" | "vermelho";
  forma: "passo" | "decisao" | "fim";
  /** Orientação do board, injetada pelo `/processos`. Não vem do gerador:
   *  é estado de VISUALIZAÇÃO, não conteúdo. Serve só pra decidir de que lado
   *  saem os fios — sem isso, no modo horizontal a linha sairia do topo do
   *  cartão e entraria por baixo do seguinte, cruzando o board inteiro. */
  ori?: "TB" | "LR";
  fonte?: string;
  duvida?: string;
  cor: string;
  /** detalhe técnico longo: fica no painel, nunca no cartão (§5.1) */
  falaNota?: string;
  /** derivado pelo gerador a partir do vocabulário fechado — ver `Linha` */
  tons?: { faz: string; fala: string; ve: string };

  /* ── camada de sugestão (11/09) ──────────────────────────────────────── */
  /** este cartão é opinião minha, não decisão travada */
  proposta?: boolean;
  /** 🔑 a DECISÃO é da proposta inteira, não do cartão: uma proposta pode
   *  trazer três passos, e aceitar um terço de um ramo de pagamento seria
   *  ficar com um beco. Por isso o ✓/✕ aponta pra cá, não pro `id`. */
  propostaId?: string;
  /** o raciocínio, pro Pedro decidir. Mora no painel */
  porque?: string;
  /** outras propostas de que esta depende — serve pra eu avisar o que ficou
   *  solto num descarte, factualmente, não pra argumentar contra */
  depende?: string[];
  /** sugestões de CAMPO que miram este passo (não viram cartão, §5.1) */
  sugestoes?: {
    id: string;
    titulo: string;
    mudancas: { campo: string; valor: string }[];
    porque: string;
    depende?: string[];
  }[];
  /** id da proposta que sugere TIRAR este passo do processo */
  removidoPor?: string;
  porqueRemover?: string;
  /** "pendente" | "aceita" | "descartada" — vem da decisão do Pedro */
  estado?: string | null;
  onDecidir?: (id: string, status: "aceita" | "descartada" | "pendente") => void;
  gravando?: boolean;
};

const LUZ_EMOJI = { verde: "🟢", amarelo: "🟡", vermelho: "🔴" } as const;

/**
 * QUEM DISPARA vira PILL, com cor e ícone fixos (pedido do Pedro, 11/09).
 *
 * São quatro gatilhos possíveis e só quatro — a doutrina fecha a lista
 * (`_doutrina-processos.md` §2). Ler "a casa" e "o relógio" em texto corrido
 * obriga a parar em cada cartão; em pill, a pergunta que mais importa num
 * board de processo ("isso é a pessoa fazendo ou é automático?") se responde
 * pela cor, de longe.
 *
 * 🔑 A distinção CLIENTE × resto é a que carrega peso: só onde há pill azul
 * existe tela pra desenhar. O resto é máquina, e não precisa de UX nenhuma.
 */
const QUEM = {
  cliente: { rotulo: "Cliente", icone: "👤", fundo: "#E8F1FD", texto: "#1D4ED8", borda: "#BFD8F9" },
  "a casa": { rotulo: "A casa", icone: "⚙️", fundo: "#F1F0FE", texto: "#5B4BC4", borda: "#DAD6F8" },
  "o relógio": { rotulo: "O relógio", icone: "⏱", fundo: "#FDF0E6", texto: "#B4590E", borda: "#F7DCC3" },
  "o gateway": { rotulo: "O gateway", icone: "🔌", fundo: "#E9F6F2", texto: "#0F7A63", borda: "#C6E8DE" },
} as const;

/** Gatilho fora da lista aparece em cinza e com "?" — silêncio aqui seria pior. */
const QUEM_DESCONHECIDO = { rotulo: "?", icone: "❔", fundo: "#F4F4F5", texto: "#71717A", borda: "#E4E4E7" };

function PillQuem({ quem }: { quem: string }) {
  const q = QUEM[quem as keyof typeof QUEM] ?? { ...QUEM_DESCONHECIDO, rotulo: quem || "?" };
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2 py-[3px] text-[10px] font-bold"
      style={{ background: q.fundo, color: q.texto, borderColor: q.borda }}
    >
      <span aria-hidden>{q.icone}</span>
      {q.rotulo}
    </span>
  );
}

/**
 * Fundo lavado da cor do semáforo: tinge sem competir com o texto.
 *
 * 🐛 11/09 — eram `rgba(...,.07)`, ou seja, TRANSLÚCIDOS. Como o React Flow
 * pinta as arestas numa camada abaixo dos nós, a linha aparecia ATRAVESSANDO o
 * cartão e cortando o texto no meio (achado do Pedro). Aqui estão os mesmos
 * tons, já compostos sobre o branco: mesma cor no olho, opacidade total.
 */
const LUZ_FUNDO = {
  verde: "#EFF8F5",
  amarelo: "#FBF7E8",
  vermelho: "#FCF2F0",
} as const;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ✕ E ✓ — a decisão do Pedro sobre uma sugestão minha (11/09).
 * ═══════════════════════════════════════════════════════════════════════════
 * "discreto" é requisito, não estética: os botões dividem o cartão com o
 * conteúdo do passo, e sugestão que grita compete com o processo de verdade.
 *
 * 🔑 `stopPropagation` nos dois: sem isso o clique sobe pro nó e abre o painel
 * lateral junto, escondendo o board na hora exata em que ele quer ver o efeito
 * da decisão. `nodrag` impede o React Flow de tratar o clique como arrasto.
 */
function BotoesDecisao({ data }: { data: Passo }) {
  /* num passo que eu sugiro TIRAR, o que se decide é a remoção, não o passo */
  const alvo = data.proposta ? data.propostaId : data.removidoPor;
  if (!alvo || !data.onDecidir) return null;
  const aceita = data.estado === "aceita";

  const parar = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <span className="nodrag ml-auto flex items-center gap-1">
      {/* aceita já conta como passo: mostra o semáforo, como qualquer cartão */}
      {aceita && <span className="mr-0.5 text-[11px]">{LUZ_EMOJI[data.luz]}</span>}
      {data.gravando && <span className="text-[9px] opacity-70">…</span>}
      <button
        type="button"
        title={aceita ? "desfazer o aceite" : "descartar a sugestão"}
        onMouseDown={parar}
        onClick={(e) => {
          parar(e);
          data.onDecidir?.(alvo, aceita ? "pendente" : "descartada");
        }}
        className="rounded px-1 text-[11px] leading-none opacity-60 transition hover:bg-black/10 hover:opacity-100"
      >
        ✕
      </button>
      <button
        type="button"
        title={aceita ? "aceita — clique pra voltar a sugestão" : "manter a sugestão"}
        onMouseDown={parar}
        onClick={(e) => {
          parar(e);
          data.onDecidir?.(alvo, aceita ? "pendente" : "aceita");
        }}
        className={`rounded px-1 text-[11px] leading-none transition hover:bg-black/10 ${
          aceita ? "opacity-100" : "opacity-60 hover:opacity-100"
        }`}
      >
        ✓
      </button>
    </span>
  );
}

export function PassoNode({ data, selected }: NodeProps & { data: Passo }) {
  const decisao = data.forma === "decisao";
  const fim = data.forma === "fim";
  const lr = data.ori === "LR";
  /** proposta ainda não aceita: cinza claro, como o Pedro pediu */
  const sugerido = Boolean(data.proposta) && data.estado !== "aceita";

  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition-shadow"
      style={{
        // 🔴 o MESMO número que o dagre recebe (processos-medidas.ts). Altura
        // que nasce do conteúdo é o que fazia os cartões se sobreporem.
        width: PASSO_W,
        height: PASSO_H,
        borderColor: sugerido ? "#d4d4d8" : selected ? data.cor : "#e4e4e7",
        borderWidth: decisao ? 2 : 1,
        // tracejado = "ainda não é decisão": mesma gramática do fim de fluxo
        borderStyle: sugerido || fim ? "dashed" : "solid",
        boxShadow: selected ? `0 0 0 3px ${(sugerido ? "#a1a1aa" : data.cor)}22` : undefined,
        background: sugerido ? "#fbfbfc" : LUZ_FUNDO[data.luz],
        opacity: sugerido ? 0.92 : 1,
      }}
    >
      <Handle
        type="target"
        position={lr ? Position.Left : Position.Top}
        style={{ opacity: 0 }}
      />

      {/* faixa do topo: id + semáforo. A cor vive aqui e na borda, não no corpo. */}
      <div
        className="flex items-center gap-2 rounded-t-2xl px-3 py-1.5"
        style={{
          background: sugerido ? "#d4d4d8" : data.cor,
          color: sugerido ? "#3f3f46" : "#fff",
        }}
      >
        <span className="text-[11px] font-bold tracking-wide">{data.id}</span>
        {sugerido && <span className="text-[10px] font-semibold">sugestão</span>}
        {!sugerido && decisao && <span className="text-[10px] opacity-80">◆ decisão</span>}
        {!sugerido && fim && <span className="text-[10px] opacity-80">■ fim</span>}

        {/* sugiro tirar: o cartão continua legível, mas diz o que vai ser dele */}
        {data.removidoPor && !data.proposta && (
          <span className="rounded bg-white/25 px-1 text-[9px] font-bold uppercase tracking-wide">
            sugiro tirar
          </span>
        )}

        {data.proposta || data.removidoPor ? (
          <BotoesDecisao data={data} />
        ) : (
          <span className="ml-auto flex items-center gap-1.5">
            {/* sugestão de CAMPO não vira cartão: avisa aqui e abre no painel */}
            {data.sugestoes?.length ? (
              <span
                className="rounded bg-white/25 px-1 text-[9px] font-bold"
                title="tem sugestão minha nos campos — abra o painel"
              >
                +{data.sugestoes.length}
              </span>
            ) : null}
            <span className="text-[11px]">{LUZ_EMOJI[data.luz]}</span>
          </span>
        )}
      </div>

      <div className="min-h-0 flex-1 px-3 py-2.5">
        <p className="line-clamp-2 text-[13px] font-bold leading-tight text-zinc-900">
          {data.titulo}
        </p>

        <div className="mt-2">
          <PillQuem quem={data.quem} />
        </div>
        <Linha rotulo="a casa faz" valor={data.faz} linhas={3} tom={data.tons?.faz} />
        {/* 🔌 é a única linha escrita pro DEV. Fica visível de propósito. */}
        <Linha
          rotulo="🔌 fala com"
          valor={data.fala}
          linhas={2}
          destaque
          tom={data.tons?.fala}
          /* 🔴 o detalhe técnico NÃO entra no cartão: altura é fixa (§5.1) e
             uma linha a mais empurraria "a pessoa vê" pra fora. Marca no
             rótulo, que já ocupa espaço, e o texto inteiro no painel. */
          marca={data.falaNota ? "+ detalhe" : undefined}
        />
        <Linha rotulo="a pessoa vê" valor={data.ve} linhas={2} tom={data.tons?.ve} />
      </div>

      <Handle
        type="source"
        position={lr ? Position.Right : Position.Bottom}
        style={{ opacity: 0 }}
      />
    </div>
  );
}

const CLAMP: Record<number, string> = { 1: "line-clamp-1", 2: "line-clamp-2", 3: "line-clamp-3" };

/**
 * 🔴 O TOM VEM DO GERADOR, não daqui (`gerar-processos.mjs`).
 *
 * 11/09 — o Pedro perguntou o que "fala com" queria dizer, olhando um cartão
 * que mostrava só "—". Glifo não é resposta curta: é resposta ausente com
 * cara de preenchida. Agora cada campo responde em português, e o tom separa
 * as duas leituras que o traço misturava:
 *
 *   neutro → resposta legítima, nada a fazer. Recua, em cinza
 *   buraco → resposta que é pendência. Âmbar, e pesa igual ao 🟡 do semáforo
 *
 * ⚠️ "invisível de propósito" × "falta tela" é a distinção que decide se há
 * trabalho de UX pela frente — e era exatamente ela que o "—" apagava.
 */
const TOM_CLASSE = {
  neutro: "italic text-zinc-400",
  buraco: "font-semibold text-amber-700",
} as const;

function Linha({
  rotulo,
  valor,
  linhas,
  destaque,
  tom,
  marca,
}: {
  rotulo: string;
  valor: string;
  /** corte por LINHA, não por caractere: quem decide onde quebrar é o CSS,
   *  que sabe a largura real da fonte. Contar caractere errava nos dois lados. */
  linhas?: number;
  destaque?: boolean;
  tom?: string;
  /** selo curto no rótulo, pra sinalizar sem gastar altura (§5.1) */
  marca?: string;
}) {
  const especial = TOM_CLASSE[tom as keyof typeof TOM_CLASSE];
  return (
    <div className="mt-1.5 border-t border-zinc-200/70 pt-1.5">
      <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-zinc-400">
        {rotulo}
        {marca && (
          <span className="rounded bg-zinc-200/80 px-1 py-[1px] text-[8px] tracking-normal text-zinc-600">
            {marca}
          </span>
        )}
      </p>
      <p
        className={`text-[11px] leading-snug ${linhas ? CLAMP[linhas] : ""} ${
          especial ?? (destaque ? "font-semibold text-zinc-800" : "text-zinc-600")
        }`}
      >
        {valor}
      </p>
    </div>
  );
}

export const TIPOS_DE_PASSO = {
  passo: PassoNode,
  decisao: PassoNode,
  fim: PassoNode,
};
