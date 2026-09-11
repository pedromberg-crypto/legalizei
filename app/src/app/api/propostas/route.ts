import { NextResponse } from "next/server";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * /api/propostas — o ✓ e o ✕ do Pedro viram arquivo. Só em desenvolvimento.
 * ═══════════════════════════════════════════════════════════════════════════
 * Combinado de 11/09: sugestão minha nasce cinza no board, com ✕ e ✓ discretos.
 * O clique tem que PERSISTIR — senão ele decide, fecha a aba, e a decisão some
 * junto. Daí esta rota: ela grava em
 * `execucao/processos/decisoes-propostas.json`.
 *
 * Mesmas guardas do runner de E2E, pelas mesmas razões:
 *   1. SÓ EM DEV. Em produção responde 404. Rota que escreve no repo não tem o
 *      que fazer num servidor público.
 *   2. ID VALIDADO POR FORMA (`S<n>`). O id entra como CHAVE de um objeto que
 *      vai pro disco; sem a régua, qualquer string viraria chave.
 *   3. ESCREVE UM ARQUIVO SÓ, de caminho FIXO. Nada do corpo da requisição
 *      chega perto de um nome de arquivo.
 *
 * 🔴 O que esta rota NÃO faz: mexer no `processos-data.mjs`. Aceitar deixa a
 * proposta sólida no board; promover pra fonte-verdade é passo humano, no
 * fecho do flow, junto com a linha no ADR. Foi escolha do Pedro quando a
 * dinâmica foi montada, e é o que impede código de gravar decisão sem registro.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const ARQUIVO = resolve(process.cwd(), "..", "execucao", "processos", "decisoes-propostas.json");
const ID = /^S\d+$/;
const STATUS = new Set(["aceita", "descartada", "pendente"]);

type Decisao = { status: string; em: string };
type Arquivo = { _leia?: string; decisoes: Record<string, Decisao> };

const VAZIO: Arquivo = {
  _leia:
    "Escrito pelo board /processos (dev-only, api/propostas). Não editar à mão: o clique do Pedro é a fonte.",
  decisoes: {},
};

function ler(): Arquivo {
  if (!existsSync(ARQUIVO)) return { ...VAZIO };
  try {
    const j = JSON.parse(readFileSync(ARQUIVO, "utf8")) as Arquivo;
    return { ...VAZIO, ...j, decisoes: j.decisoes ?? {} };
  } catch {
    // arquivo corrompido: começar do zero apagaria decisão do Pedro em
    // silêncio. Melhor tratar como vazio e deixar o erro aparecer no POST.
    return { ...VAZIO };
  }
}

function soDev() {
  return process.env.NODE_ENV === "development";
}

export async function GET() {
  if (!soDev()) {
    // não é erro: em produção o board simplesmente mostra tudo como pendente
    return NextResponse.json({ decisoes: {}, indisponivel: true }, { status: 404 });
  }
  return NextResponse.json({ decisoes: ler().decisoes });
}

export async function POST(req: Request) {
  if (!soDev()) {
    return NextResponse.json({ erro: "só em desenvolvimento" }, { status: 404 });
  }

  let corpo: { id?: unknown; status?: unknown };
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ ok: false, erro: "corpo inválido" }, { status: 400 });
  }

  const { id, status } = corpo;
  if (typeof id !== "string" || !ID.test(id)) {
    return NextResponse.json({ ok: false, erro: `id inválido: ${String(id)}` }, { status: 400 });
  }
  if (typeof status !== "string" || !STATUS.has(status)) {
    return NextResponse.json({ ok: false, erro: `status inválido: ${String(status)}` }, { status: 400 });
  }

  const atual = ler();
  if (status === "pendente") {
    // desfazer: some do arquivo em vez de virar linha "pendente" à toa
    delete atual.decisoes[id];
  } else {
    atual.decisoes[id] = { status, em: new Date().toISOString() };
  }

  try {
    writeFileSync(ARQUIVO, JSON.stringify(atual, null, 2) + "\n", "utf8");
  } catch (e) {
    return NextResponse.json({ ok: false, erro: `não consegui gravar: ${String(e)}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true, decisoes: atual.decisoes });
}
