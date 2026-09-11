import { NextResponse } from "next/server";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

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
 * ⚠️ Limite conhecido e aceito: a saída só chega no fim, não em streaming. Pra
 * suíte longa o painel fica "rodando…" um tempo. Streaming exigiria SSE e não
 * vale a complexidade agora — o botão "copiar comando" cobre quem quer ver
 * passo a passo no terminal.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const PERMITIDAS = new Set([
  // suítes por PROCESSO — cada uma é o par de um §P<n> do processos-data.mjs
  "processo-p4-avulso-na-fatura.spec.ts",
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

  if (!existsSync(cli)) {
    return NextResponse.json({
      ok: false,
      saida: `Playwright não encontrado em ${cli}. Rode "npm install" na pasta app.`,
    });
  }
  if (!existsSync(alvo)) {
    return NextResponse.json({ ok: false, saida: `Spec não encontrada: ${alvo}` });
  }

  try {
    const { code, saida } = await new Promise<{ code: number; saida: string }>((res) => {
      execFile(
        // 🔑 o PRÓPRIO node, não `npx.cmd` — ver o comentário do topo.
        process.execPath,
        [cli, "test", alvo, "--reporter=line"],
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
            CI: "1",
          },
        },
        (err, stdout, stderr) => {
          const txt = [stdout, stderr].filter(Boolean).join(NL).slice(-TETO_SAIDA);
          res({
            code: err ? 1 : 0,
            saida: txt || (err ? `Falhou sem saída: ${String(err)}` : "(sem saída)"),
          });
        },
      );
    });

    return NextResponse.json({ ok: code === 0, saida });
  } catch (e) {
    // 🔴 a rota NUNCA pode estourar: corpo vazio vira "Unexpected end of JSON
    // input" no painel, e a mensagem passa a culpar o lugar errado.
    return NextResponse.json({
      ok: false,
      saida: `Erro ao iniciar o Playwright: ${String(e)}`,
    });
  }
}
