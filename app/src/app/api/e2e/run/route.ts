import { NextResponse } from "next/server";
import { execFile } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * POST /api/e2e/run — dispara UMA suíte do Playwright. Só em desenvolvimento.
 * ═══════════════════════════════════════════════════════════════════════════
 * Existe para o botão "Passar E2E" do board `/processos`. Quem aperta é o
 * Pedro, na tela dele. O `CLAUDE.md` proíbe o assistente de rodar E2E por
 * iniciativa própria, e a regra já foi reforçada três vezes — este endpoint
 * não afrouxa isso, ele move o gatilho pro dedo dele.
 *
 * 🔒 AS TRÊS GUARDAS
 *
 * 1. SÓ EM DEV. Em produção responde 404 e some. Rodar navegador headless num
 *    servidor de produção não é feature, é superfície de ataque.
 *
 * 2. LISTA FECHADA DE SPECS. A rota recusa qualquer nome que não esteja em
 *    `PERMITIDAS`. Sem isso, o campo do painel viraria execução de comando
 *    arbitrário — e não adianta "validar se termina em .spec.ts", porque
 *    `../../../algo.spec.ts` também termina.
 *
 * 3. `execFile`, NUNCA `exec`. `execFile` passa os argumentos como array, sem
 *    shell no meio. Com `exec`, o nome da spec seria concatenado numa string
 *    de shell e um `;` no meio dela executaria outra coisa.
 *
 * 🐛 11/09 — A PRIMEIRA EXECUÇÃO FALHOU COM "Unexpected end of JSON input",
 * e não era o teste: era esta rota morrendo antes de responder.
 *
 * Causa: eu chamava `npx.cmd`. A partir do Node 18.20/20.12/22 (correção da
 * CVE-2024-27980), `execFile` RECUSA executar `.cmd` e `.bat` no Windows sem
 * shell — e recusa lançando de forma SÍNCRONA, com `EINVAL`. O throw
 * acontecia dentro do executor da Promise, escapava do `await`, a rota
 * estourava e o Next devolvia corpo vazio. O `r.json()` do painel então
 * quebrava, e a mensagem que sobrava culpava o JSON. Conferido nesta máquina:
 * Node v24.14.0, `execFileSync("npx.cmd")` → EINVAL.
 *
 * Conserto: chamar o CLI do Playwright com o PRÓPRIO node (`process.execPath`)
 * apontando pro `cli.js` do pacote. Sem `.cmd`, sem shell, sem PATH no meio —
 * e de quebra fica mais rápido, porque pula a resolução do npx.
 *
 * 🐛 11/09, 2ª RODADA — depois do conserto acima o Playwright subiu, rodou e
 * respondeu "No tests found. Make sure that arguments are regular expressions
 * matching test files."
 *
 * Causa: o argumento posicional do `playwright test` NÃO é um caminho, é uma
 * REGEX casada contra o caminho do arquivo relativo ao `testDir`. Eu passava o
 * caminho ABSOLUTO do Windows (`C:\...\e2e\x.spec.ts`); como regex, os `\` do
 * Windows viram escapes e o `C:` não existe no caminho relativo, então nada
 * casa e a suíte inteira é filtrada pra fora. No Linux teria passado por
 * acidente (`/` é literal em regex), que é por que o bug parece "só Windows".
 *
 * Conserto: passar só o NOME da spec, com os metacaracteres escapados (os
 * pontos de `.spec.ts` casariam qualquer caractere). O caminho absoluto
 * continua servindo pro `existsSync` — checar que o arquivo existe é outra
 * pergunta, e é boa: sem ela o filtro que não casa e o arquivo que não existe
 * dariam a MESMA mensagem inútil.
 *
 * ⚠️ Limite conhecido e aceito: a saída só chega no fim, não em streaming. Pra
 * suíte longa o painel fica "rodando…" um tempo. Streaming exigiria SSE e não
 * vale a complexidade agora — o botão "copiar comando" cobre quem quer ver
 * passo a passo no terminal.
 *
 * 📋 11/09, 3ª RODADA — A SAÍDA VIRA DADO, NÃO TEXTO.
 * Pedido do Pedro: *"quero esse resultado mais visualmente agradável… melhor
 * formato de leitura para a minha tomada de decisões"*. O reporter `line`
 * devolve um bloco de texto onde o teste que passou, o que falhou e o rastro
 * de pilha têm todos o mesmo peso visual — decidir a partir dali é ler tudo.
 *
 * Então a rota passou a pedir o reporter `json` e a DEVOLVER ESTRUTURA:
 * `resumo` (placar + duração) e `testes[]` (título, arquivo:linha, status,
 * duração, erro já destrinchado em Locator/Esperado/Recebido). A saída crua
 * continua indo junto, em `saida`, pro acordeão do painel — quando a rota
 * morre antes de gerar o relatório, ela é a única coisa que sobra.
 *
 * Duas decisões de implementação que não são óbvias:
 *   · o JSON sai em ARQUIVO (`PLAYWRIGHT_JSON_OUTPUT_NAME`), não em stdout.
 *     Misturado ao stdout, qualquer `console.log` de dentro de um teste cairia
 *     no meio do relatório e derrubaria o `JSON.parse`.
 *   · o texto do Playwright vem com códigos ANSI de cor. No terminal viram
 *     cor; num `<pre>` do navegador viram lixo tipo `[2m`. Limpo aqui, uma vez,
 *     em vez de em cada lugar que exibe.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const PERMITIDAS = new Set([
  // suítes por PROCESSO — cada uma é o par de um §P<n> do processos-data.mjs
  "processo-p4-avulso-na-fatura.spec.ts",
  "processo-p4-acima-de-50.spec.ts",
  // suítes do flow de abertura
  "smoke.spec.ts",
  "abrir-me-ate-conta.spec.ts",
  "constituicao-me-dossie.spec.ts",
  "dossie-c0-a2-auditoria.spec.ts",
  "mei-flow-auditoria.spec.ts",
  "rota-assistida-auditoria.spec.ts",
  "mapa-trilhas.spec.ts",
]);

const NL = String.fromCharCode(10);
const TETO_MS = 10 * 60 * 1000;
const TETO_SAIDA = 400_000;

/** Códigos de cor do terminal. Viram lixo (`[2m`) dentro de um `<pre>`. */
const ANSI = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g");
const semCor = (s: string) => s.replace(ANSI, "");

/** Os rótulos que o `expect` do Playwright imprime, na ordem em que saem. */
const ROTULOS = ["Locator", "Expected", "Received", "Timeout", "Error message"];

export type ErroLido = {
  /** a 1ª linha: `expect(locator).toBeVisible() failed` */
  titulo: string;
  /** Locator / Expected / Received / Timeout, quando o erro é de `expect` */
  campos: { rotulo: string; valor: string }[];
  /** o resto: call log e pilha. Vai pro acordeão, não pra primeira leitura. */
  detalhe: string;
};

export type TesteLido = {
  titulo: string;
  /** `e2e/x.spec.ts:34` — clicável no editor, colável no terminal */
  local: string;
  status: "passou" | "falhou" | "instavel" | "pulado";
  ms: number;
  erro: ErroLido | null;
};

/**
 * Quebra a mensagem do Playwright nos pedaços que interessam pra decidir.
 * Se o formato mudar, o `detalhe` continua carregando tudo — a leitura piora,
 * não some.
 */
function lerErro(bruto: string): ErroLido {
  const linhas = semCor(bruto).split(NL);
  const titulo = linhas.find((l) => l.trim())?.trim() ?? "erro sem mensagem";
  const campos: { rotulo: string; valor: string }[] = [];
  const sobra: string[] = [];

  for (const linha of linhas) {
    if (linha.trim() === titulo) continue;
    const m = /^\s*([A-Za-z ]+):\s*(.*)$/.exec(linha);
    if (m && ROTULOS.includes(m[1].trim()) && m[2].trim()) {
      campos.push({ rotulo: m[1].trim(), valor: m[2].trim() });
    } else {
      sobra.push(linha);
    }
  }

  return { titulo, campos, detalhe: sobra.join(NL).trim() };
}

const STATUS: Record<string, TesteLido["status"]> = {
  expected: "passou",
  unexpected: "falhou",
  flaky: "instavel",
  skipped: "pulado",
};

/* O relatório JSON do Playwright: suítes aninhadas (arquivo › describe › …). */
type SuiteJson = {
  title?: string;
  specs?: {
    title?: string;
    file?: string;
    line?: number;
    tests?: {
      status?: string;
      results?: { duration?: number; error?: { message?: string }; errors?: { message?: string }[] }[];
    }[];
  }[];
  suites?: SuiteJson[];
};

/**
 * Achata a árvore de suítes numa lista plana de testes.
 * O título do nível mais alto é o CAMINHO do arquivo, e ele já aparece em
 * `local` — por isso `raiz` começa vazio e só os `describe` entram no nome.
 */
function achatar(suites: SuiteJson[], trilha: string[] = []): TesteLido[] {
  const fora: TesteLido[] = [];

  for (const suite of suites) {
    const nome = suite.title?.trim();
    // o 1º nível é o arquivo (`e2e/x.spec.ts`): não entra no título do teste
    const daqui = nome && !nome.endsWith(".spec.ts") ? [...trilha, nome] : trilha;

    for (const spec of suite.specs ?? []) {
      const teste = spec.tests?.[0];
      const resultado = teste?.results?.[teste.results.length - 1];
      const msgErro = resultado?.error?.message ?? resultado?.errors?.[0]?.message;

      fora.push({
        titulo: [...daqui, spec.title ?? "(sem título)"].join(" › "),
        local: `${spec.file ?? "?"}${spec.line ? `:${spec.line}` : ""}`,
        status: STATUS[teste?.status ?? ""] ?? "falhou",
        ms: Math.round(resultado?.duration ?? 0),
        erro: msgErro ? lerErro(msgErro) : null,
      });
    }

    fora.push(...achatar(suite.suites ?? [], daqui));
  }

  return fora;
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { indisponivel: true, erro: "O runner de E2E só existe em desenvolvimento." },
      { status: 404 },
    );
  }

  let spec: unknown;
  try {
    ({ spec } = await req.json());
  } catch {
    return NextResponse.json({ ok: false, erro: "corpo inválido" }, { status: 400 });
  }

  if (typeof spec !== "string" || !PERMITIDAS.has(spec)) {
    return NextResponse.json(
      { ok: false, erro: `spec não permitida: ${String(spec)}` },
      { status: 400 },
    );
  }

  const raiz = process.cwd();
  const alvo = resolve(raiz, "e2e", spec);
  const cli = resolve(raiz, "node_modules", "@playwright", "test", "cli.js");

  // 🔑 o argumento posicional do Playwright é REGEX de caminho, não caminho.
  // Ver o comentário do topo (bug de 11/09, 2ª rodada).
  const filtro = spec.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  if (!existsSync(cli)) {
    return NextResponse.json({
      ok: false,
      saida: `Playwright não encontrado em ${cli}. Rode "npm install" na pasta app.`,
    });
  }
  if (!existsSync(alvo)) {
    return NextResponse.json({ ok: false, saida: `Spec não encontrada: ${alvo}` });
  }

  // relatório em arquivo, fora do repo: stdout fica livre pro `console.log`
  // de dentro dos testes sem corromper o JSON.
  const relatorio = join(tmpdir(), `e2e-${Date.now()}.json`);

  try {
    const { code, saida } = await new Promise<{ code: number; saida: string }>((res) => {
      execFile(
        // 🔑 o PRÓPRIO node, não `npx.cmd` — ver o comentário do topo.
        process.execPath,
        // `line` continua em stdout (é o acordeão "saída bruta"), `json` vai
        // pro arquivo. Os dois, porque estrutura e texto falham em momentos
        // diferentes: o JSON não existe quando o Playwright morre no boot.
        [cli, "test", filtro, "--reporter=line,json"],
        {
          cwd: raiz,
          timeout: TETO_MS,
          maxBuffer: TETO_SAIDA,
          windowsHide: true,
          env: {
            ...process.env,
            // sem isto o reporter html abre um servidor no fim e NUNCA
            // termina, deixando a requisição pendurada até o timeout
            PW_TEST_HTML_REPORT_OPEN: "never",
            PLAYWRIGHT_JSON_OUTPUT_NAME: relatorio,
            CI: "1",
          },
        },
        (err, stdout, stderr) => {
          const txt = semCor([stdout, stderr].filter(Boolean).join(NL)).slice(-TETO_SAIDA);
          res({
            code: err ? 1 : 0,
            saida: txt || (err ? `Falhou sem saída: ${String(err)}` : "(sem saída)"),
          });
        },
      );
    });

    /**
     * 🔴 O relatório pode não existir: spec que nem compila, Playwright que
     * morre no boot, timeout. Nesse caso `testes` volta vazio e o painel cai
     * na saída crua — que é justamente quando ela é a única pista.
     */
    let testes: TesteLido[] = [];
    let resumo: { total: number; passou: number; falhou: number; pulado: number; ms: number } | null = null;

    if (existsSync(relatorio)) {
      try {
        const rel = JSON.parse(readFileSync(relatorio, "utf8")) as {
          suites?: SuiteJson[];
          stats?: { duration?: number };
        };
        testes = achatar(rel.suites ?? []);
        resumo = {
          total: testes.length,
          passou: testes.filter((t) => t.status === "passou").length,
          falhou: testes.filter((t) => t.status === "falhou" || t.status === "instavel").length,
          pulado: testes.filter((t) => t.status === "pulado").length,
          ms: Math.round(rel.stats?.duration ?? 0),
        };
      } catch {
        /* relatório corrompido: segue com a saída crua */
      }
      rmSync(relatorio, { force: true });
    }

    return NextResponse.json({ ok: code === 0, saida, testes, resumo });
  } catch (e) {
    rmSync(relatorio, { force: true });
    // 🔴 a rota NUNCA pode estourar: corpo vazio vira "Unexpected end of JSON
    // input" no painel, e a mensagem passa a culpar o lugar errado.
    return NextResponse.json({
      ok: false,
      saida: `Erro ao iniciar o Playwright: ${String(e)}`,
    });
  }
}
