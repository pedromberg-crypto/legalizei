"use client";

import { useState } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PAINEL "PASSAR E2E" — 11/09, pedido do Pedro.
 * ═══════════════════════════════════════════════════════════════════════════
 * "quero que a gente tenha essa possibilidade de ir passando um E2E robusto de
 * tempos em tempos para ir revalidando o que estamos construindo."
 *
 * 🔴 A TRAVA, E ELA É O MAIS IMPORTANTE DESTE ARQUIVO.
 * O `CLAUDE.md` do projeto proíbe rodar E2E por iniciativa do assistente, e a
 * regra já foi reforçada três vezes (30/08, 01/09 e 07/09) porque eu a quebrei
 * três vezes. A frase travada é: *um "pode rodar" vale só pra AQUELA rodada,
 * não pra sessão nem pro assunto.*
 *
 * Este painel não afrouxa nada disso — ele faz o contrário: transfere o gatilho
 * pro dedo do Pedro. A suíte só roda quando ELE aperta, na tela dele. Nenhum
 * caminho aqui pode ser acionado do chat.
 *
 * Três guardas, e as três de propósito:
 *   1. o endpoint só existe em desenvolvimento (ver `api/e2e/run/route.ts`);
 *   2. a rota recusa nome de spec que não esteja na lista fechada abaixo —
 *      sem isso, um campo de texto aqui viraria execução de comando arbitrário;
 *   3. nada roda no carregamento do painel: precisa de clique.
 *
 * E tem a saída manual: o botão "copiar comando" entrega a linha pronta pro
 * terminal, pra quando ele preferir rodar fora do app.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * A suíte DO PROCESSO que está aberto no board. É ela que nasce selecionada.
 *
 * 🐛 11/09 (achado do Pedro): o painel abria com "Smoke" em primeiro e as 7
 * suítes do flow de ABERTURA na lista — nenhuma testava o processo que estava
 * na tela. Ele perguntou onde estava, e a resposta honesta era: não existia.
 *
 * Agora cada processo tem a sua, e ela vem primeiro. Processo sem suíte
 * escrita aparece DESABILITADO com o aviso — sumir da lista esconderia
 * justamente o buraco.
 */
const POR_PROCESSO: Record<string, { arquivo: string; nome: string; desc: string }> = {
  P4: {
    arquivo: "processo-p4-avulso-na-fatura.spec.ts",
    nome: "P4 · Avulso na fatura",
    desc: "O processo desta tela. Os passos 🔴 e 🟡 aparecem como pendentes, não somem.",
  },
};

/** Lista FECHADA. Spec nova entra aqui e na rota — nos dois, de propósito. */
const SUITES = [
  { arquivo: "smoke.spec.ts", nome: "Smoke", desc: "As rotas sobem e não quebram. O mais rápido." },
  { arquivo: "abrir-me-ate-conta.spec.ts", nome: "Abrir ME até a conta", desc: "O caminho feliz da abertura, do splash ao cadastro." },
  { arquivo: "constituicao-me-dossie.spec.ts", nome: "Constituição · dossiê", desc: "Os campos que vão pra Junta." },
  { arquivo: "dossie-c0-a2-auditoria.spec.ts", nome: "Dossiê C0→A2", desc: "Auditoria do miolo do dossiê." },
  { arquivo: "mei-flow-auditoria.spec.ts", nome: "Ramo MEI", desc: "O caminho próprio do MEI." },
  { arquivo: "rota-assistida-auditoria.spec.ts", nome: "Rota assistida", desc: "O caminho com ajuda humana." },
  { arquivo: "mapa-trilhas.spec.ts", nome: "Mapa · trilhas", desc: "O board do flow e o cálculo das trilhas." },
];

type Estado = "parado" | "rodando" | "ok" | "falhou" | "indisponivel";

/** Linha em branco entre os blocos da mensagem de erro. */
const QUEBRA = String.fromCharCode(10, 10);

/* O que a rota devolve depois que ela passou a ler o relatório JSON. */
type ErroLido = {
  titulo: string;
  campos: { rotulo: string; valor: string }[];
  detalhe: string;
};
type TesteLido = {
  titulo: string;
  local: string;
  status: "passou" | "falhou" | "instavel" | "pulado";
  ms: number;
  erro: ErroLido | null;
};
type Resumo = { total: number; passou: number; falhou: number; pulado: number; ms: number };

/**
 * 🎨 11/09 — A LEITURA DO RESULTADO, e por que ela virou coluna própria.
 *
 * Pedido do Pedro: *"eu só quero esse resultado mais visualmente agradável…
 * melhor formato de leitura para a minha tomada de decisões"*.
 *
 * O diagnóstico não é estética: era um `<pre>` de 264px de altura com a saída
 * do reporter `line` inteira dentro. Ali, o teste que passou, o que falhou e a
 * pilha de erro têm o MESMO peso visual, e a única forma de achar a falha é
 * ler tudo e rolar. Pra "tomada de decisão" isso é o pior formato possível:
 * a informação que decide (o que quebrou, e onde) está afogada na que não
 * decide (o que passou).
 *
 * Três escolhas, cada uma resolvendo uma parte:
 *   1. FALHA PRIMEIRO. A lista não sai na ordem de execução, sai na ordem de
 *      quem precisa de atenção: falhou › instável › pulado › passou.
 *   2. O ERRO VEM DESTRINCHADO. `Locator/Esperado/Recebido` viram linhas
 *      rotuladas, não parágrafo. O call log e a pilha ficam num acordeão —
 *      existem, mas não competem com a primeira leitura.
 *   3. QUEM PASSOU ENCOLHE. Uma linha, sem erro, cinza. A prova de que rodou
 *      continua na tela; ela só para de gritar.
 */
const ESTILO_STATUS: Record<TesteLido["status"], { rotulo: string; cor: string; ponto: string }> = {
  falhou: { rotulo: "falhou", cor: "text-red-700", ponto: "bg-red-500" },
  instavel: { rotulo: "instável", cor: "text-amber-700", ponto: "bg-amber-500" },
  pulado: { rotulo: "pulado", cor: "text-zinc-500", ponto: "bg-zinc-300" },
  passou: { rotulo: "passou", cor: "text-emerald-700", ponto: "bg-emerald-500" },
};

/** Ordem de ATENÇÃO, não de execução. Ver o comentário acima. */
const PESO: Record<TesteLido["status"], number> = { falhou: 0, instavel: 1, pulado: 2, passou: 3 };

function duracao(ms: number) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function CartaoTeste({ teste }: { teste: TesteLido }) {
  const [aberto, setAberto] = useState(false);
  const estilo = ESTILO_STATUS[teste.status];
  const falhou = teste.status === "falhou" || teste.status === "instavel";

  return (
    <div
      className={`rounded-xl border ${
        falhou ? "border-red-200 bg-red-50/50" : "border-zinc-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-2 px-3 py-2">
        <span className={`mt-[6px] size-2 shrink-0 rounded-full ${estilo.ponto}`} aria-hidden />
        <div className="min-w-0 flex-1">
          <p className={`text-[12px] font-semibold leading-snug ${falhou ? "text-zinc-900" : "text-zinc-600"}`}>
            {teste.titulo}
          </p>
          <p className="mt-0.5 font-mono text-[10px] text-zinc-400">{teste.local}</p>
        </div>
        <span className="shrink-0 text-[10px] tabular-nums text-zinc-400">{duracao(teste.ms)}</span>
      </div>

      {teste.erro && (
        <div className="border-t border-red-200/70 px-3 py-2">
          <p className="text-[12px] font-bold text-red-800">{teste.erro.titulo}</p>

          {teste.erro.campos.length > 0 && (
            <dl className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-2.5 gap-y-1">
              {teste.erro.campos.map((c) => (
                <div key={c.rotulo} className="contents">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                    {c.rotulo}
                  </dt>
                  <dd className="break-all font-mono text-[11px] leading-snug text-zinc-700">
                    {c.valor}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {teste.erro.detalhe && (
            <>
              <button
                type="button"
                onClick={() => setAberto((v) => !v)}
                className="mt-2 text-[11px] font-semibold text-red-700 underline underline-offset-2 hover:text-red-900"
              >
                {aberto ? "esconder o rastro" : "ver o rastro (call log e pilha)"}
              </button>
              {aberto && (
                <pre className="mt-1.5 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-white/80 p-2 font-mono text-[10px] leading-relaxed text-zinc-600">
                  {teste.erro.detalhe}
                </pre>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function PainelE2E({
  onFechar,
  processo,
}: {
  onFechar: () => void;
  /** id do processo aberto no board ("P4"), ou "todos" */
  processo?: string;
}) {
  /**
   * 🐛 11/09, 2ª correção no mesmo painel (achado do Pedro: "ainda não vejo a
   * opção desta tela"). Eu só montava a suíte do processo quando o board
   * estava FILTRADO num processo — e o filtro nasce em "Todos", que é o que
   * ele estava vendo. O resultado é que a suíte certa existia e não aparecia
   * nunca no estado padrão.
   *
   * A regra agora não depende do filtro: se o board mostra o processo, a
   * suíte dele está na lista. Em "Todos", entram todas as que existem.
   */
  const daTela =
    processo && processo !== "todos"
      ? [POR_PROCESSO[processo]].filter(Boolean)
      : Object.values(POR_PROCESSO);

  /** Processo aberto e sem suíte escrita: avisa, não esconde. */
  const semSuite = Boolean(processo && processo !== "todos" && !POR_PROCESSO[processo]);

  const lista = [...daTela, ...SUITES];
  const nDaTela = daTela.length;
  const [escolhida, setEscolhida] = useState(lista[0].arquivo);
  const [estado, setEstado] = useState<Estado>("parado");
  const [saida, setSaida] = useState("");
  const [testes, setTestes] = useState<TesteLido[]>([]);
  const [resumo, setResumo] = useState<Resumo | null>(null);
  const [verBruto, setVerBruto] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const comando = `cd app && npx playwright test e2e/${escolhida}`;

  async function rodar() {
    setEstado("rodando");
    setSaida("");
    setTestes([]);
    setResumo(null);
    try {
      const r = await fetch("/api/e2e/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spec: escolhida }),
      });
      /**
       * 🐛 11/09 — ler TEXTO primeiro, e só depois tentar o JSON.
       * Com `r.json()` direto, qualquer resposta que não fosse JSON (rota que
       * estourou, 500 do Next, proxy no meio) virava "Unexpected end of JSON
       * input" — uma mensagem que fala do parser e esconde o erro de verdade.
       * Foi exatamente o que aconteceu na primeira execução: o problema estava
       * no `npx.cmd`, e a tela culpava o JSON.
       */
      const bruto = await r.text();
      let j: {
        ok?: boolean;
        saida?: string;
        erro?: string;
        indisponivel?: boolean;
        testes?: TesteLido[];
        resumo?: Resumo | null;
      };
      try {
        j = JSON.parse(bruto);
      } catch {
        setEstado("falhou");
        setSaida(
          [
            `O servidor respondeu algo que não é JSON (HTTP ${r.status}).`,
            bruto.trim() ? bruto.slice(0, 2000) : "(corpo vazio)",
            "Se o corpo veio vazio, a rota /api/e2e/run estourou antes de responder — o terminal do `npm run dev` tem o erro.",
          ].join(QUEBRA),
        );
        return;
      }

      if (r.status === 404 || j.indisponivel) {
        setEstado("indisponivel");
        setSaida(j.erro ?? "O runner só existe em desenvolvimento.");
        return;
      }
      setSaida(j.saida ?? j.erro ?? "(sem saída)");
      // ordem de ATENÇÃO, não de execução: falha primeiro
      setTestes([...(j.testes ?? [])].sort((a, b) => PESO[a.status] - PESO[b.status]));
      setResumo(j.resumo ?? null);
      setEstado(j.ok ? "ok" : "falhou");
    } catch (e) {
      setEstado("falhou");
      setSaida(String(e));
    }
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(comando);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      /* clipboard bloqueado: o comando está visível na tela do mesmo jeito */
    }
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-6">
      <div className="flex max-h-full w-[min(1040px,96vw)] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-zinc-200 px-5 py-3">
          <p className="text-[15px] font-bold text-zinc-900">Passar E2E</p>
          {resumo && (
            <span className="flex items-center gap-2 text-[11px] font-semibold tabular-nums">
              <span className="text-emerald-600">✓ {resumo.passou}</span>
              {resumo.falhou > 0 && <span className="text-red-600">✕ {resumo.falhou}</span>}
              {resumo.pulado > 0 && <span className="text-zinc-400">⤼ {resumo.pulado}</span>}
              <span className="text-zinc-400">· {duracao(resumo.ms)}</span>
            </span>
          )}
          <button
            type="button"
            onClick={onFechar}
            className="ml-auto text-zinc-400 hover:text-zinc-900"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          {/* ESQUERDA — o que rodar. Largura fixa: é a coluna de comando. */}
          <div className="min-h-0 shrink-0 overflow-y-auto px-5 py-4 lg:w-[360px] lg:border-r lg:border-zinc-200">
          <p className="mb-3 text-[12px] leading-relaxed text-zinc-600">
            A suíte roda contra o app em desenvolvimento. Só você dispara daqui:
            o assistente não aciona este caminho, por regra travada no projeto.
          </p>

          {semSuite && (
            <div className="mb-3 rounded-xl border border-amber-300 bg-amber-50 p-2.5">
              <p className="text-[12px] font-semibold text-amber-900">
                O processo {processo} ainda não tem suíte escrita.
              </p>
              <p className="mt-0.5 text-[11px] text-amber-800">
                Abaixo estão as suítes do flow de abertura, que não testam este
                processo. Peça a suíte dele no chat.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            {lista.map((s, i) => (
              <label
                key={s.arquivo}
                className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-2.5 ${
                  escolhida === s.arquivo ? "border-zinc-900 bg-zinc-50" : "border-zinc-200"
                }`}
              >
                <input
                  type="radio"
                  name="spec"
                  checked={escolhida === s.arquivo}
                  onChange={() => setEscolhida(s.arquivo)}
                  className="mt-0.5"
                />
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold text-zinc-900">
                    {s.nome}
                    {i < nDaTela && (
                      <span className="ml-1.5 rounded bg-zinc-900 px-1.5 py-[1px] text-[9px] font-bold uppercase tracking-wider text-white">
                        {processo && processo !== "todos" ? "desta tela" : "processo"}
                      </span>
                    )}
                  </span>
                  <span className="block text-[11px] text-zinc-500">{s.desc}</span>
                </span>
              </label>
            ))}
          </div>

          <div className="mt-4 rounded-xl bg-zinc-900 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              ou rode no terminal
            </p>
            <code className="block break-all text-[11px] text-zinc-100">{comando}</code>
          </div>

          </div>

          {/* DIREITA — o que ACONTECEU. Rola sozinha, sem levar a lista junto. */}
          <div className="min-h-0 flex-1 overflow-y-auto bg-zinc-50/60 px-5 py-4">
            {estado === "parado" && !saida && (
              <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center">
                <p className="text-[13px] font-semibold text-zinc-400">Nenhuma rodada ainda</p>
                <p className="mt-1 max-w-[280px] text-[11px] leading-relaxed text-zinc-400">
                  Escolha a suíte ao lado e aperte Rodar. O resultado aparece aqui,
                  com a falha em primeiro lugar.
                </p>
              </div>
            )}

            {estado === "rodando" && (
              <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center">
                <p className="text-[13px] font-semibold text-zinc-500">Rodando a suíte…</p>
                <p className="mt-1 max-w-[300px] text-[11px] leading-relaxed text-zinc-400">
                  O navegador está subindo de verdade. A saída chega inteira no fim,
                  não passo a passo.
                </p>
              </div>
            )}

            {estado !== "rodando" && testes.length > 0 && (
              <>
                {resumo && resumo.falhou > 0 && (
                  <p className="mb-2.5 text-[12px] font-bold text-red-700">
                    {resumo.falhou} de {resumo.total} {resumo.falhou === 1 ? "teste pede" : "testes pedem"} atenção
                  </p>
                )}
                <div className="flex flex-col gap-1.5">
                  {testes.map((t) => (
                    <CartaoTeste key={`${t.local}-${t.titulo}`} teste={t} />
                  ))}
                </div>
              </>
            )}

            {/**
             * A saída crua não some: ela é a ÚNICA pista quando o Playwright
             * morre antes de escrever o relatório (spec que não compila,
             * timeout, binário faltando). Só deixa de ser a primeira coisa.
             */}
            {estado !== "rodando" && saida && (
              <div className={testes.length > 0 ? "mt-3" : ""}>
                {testes.length === 0 && estado !== "parado" && (
                  <p className="mb-2 text-[12px] font-semibold text-amber-700">
                    Sem relatório por teste. A saída do Playwright está abaixo.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setVerBruto((v) => !v)}
                  className="text-[11px] font-semibold text-zinc-500 underline underline-offset-2 hover:text-zinc-900"
                >
                  {verBruto ? "esconder a saída bruta" : "ver a saída bruta do Playwright"}
                </button>
                {(verBruto || testes.length === 0) && (
                  <pre className="mt-1.5 max-h-72 overflow-auto whitespace-pre-wrap rounded-xl border border-zinc-200 bg-white p-3 font-mono text-[10px] leading-relaxed text-zinc-600">
                    {saida}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-zinc-200 px-5 py-3">
          <span
            className={`text-[12px] font-semibold ${
              estado === "ok"
                ? "text-emerald-600"
                : estado === "falhou"
                  ? "text-red-600"
                  : estado === "indisponivel"
                    ? "text-amber-600"
                    : "text-zinc-400"
            }`}
          >
            {estado === "parado" && "pronto"}
            {estado === "rodando" && "rodando…"}
            {estado === "ok" && "✓ passou"}
            {estado === "falhou" && "✕ falhou"}
            {estado === "indisponivel" && "runner indisponível"}
          </span>

          <button
            type="button"
            onClick={copiar}
            className="ml-auto rounded-lg border border-zinc-300 px-3 py-1.5 text-[13px] font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            {copiado ? "copiado" : "copiar comando"}
          </button>
          <button
            type="button"
            onClick={rodar}
            disabled={estado === "rodando"}
            className="rounded-lg bg-zinc-900 px-4 py-1.5 text-[13px] font-bold text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            {estado === "rodando" ? "rodando…" : "▶ Rodar"}
          </button>
        </div>
      </div>
    </div>
  );
}
