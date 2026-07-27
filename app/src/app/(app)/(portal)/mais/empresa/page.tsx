"use client";

import Link from "next/link";
import { useState } from "react";
import { TelaHeader } from "@/components/ui/tela";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAIS · DADOS DA EMPRESA — o cadastro (27/07). Drill-down de /mais.
 * ═══════════════════════════════════════════════════════════════════════════
 * Ficha da empresa em blocos de leitura: Identificação · Enquadramento ·
 * Endereço. É LEITURA — mudar qualquer campo aqui é ALTERAÇÃO CADASTRAL, que é
 * serviço à parte (Junta + Receita). Honestidade antes do toque: a página diz
 * isso e manda pro fluxo pago, em vez de fingir um lápis que edita de graça.
 *
 * ─── COPIAR (Pedro, 27/07) ──────────────────────────────────────────────────
 * Dado de empresa é o que mais se pede colado no WhatsApp (banco, cliente,
 * cartório). Então: copiar por DOBRA (botão no header do bloco) + copiar TUDO
 * (um toque → texto formatado com *negrito* do WhatsApp) + o CNPJ solto. Fonte
 * única BLOCOS: o que renderiza é o que copia.
 *
 * ⚠️ Dados = FAROL/mock (a mesma Ana Beatriz do resto do portal).
 * ═══════════════════════════════════════════════════════════════════════════
 */

const IDENTIDADE = "Ana Beatriz Ramos Desenvolvimento de Software";

type Campo = { rotulo: string; valor: string; solto?: boolean };
type BlocoDados = { titulo: string; campos: Campo[] };

const BLOCOS: BlocoDados[] = [
  {
    titulo: "Identificação",
    campos: [
      { rotulo: "Razão social", valor: IDENTIDADE },
      { rotulo: "Nome fantasia", valor: "Beatriz Studio" },
      { rotulo: "CNPJ", valor: "54.321.000/0001-09", solto: true },
      { rotulo: "Abertura", valor: "12/03/2026" },
      { rotulo: "Natureza jurídica", valor: "Sociedade Limitada Unipessoal (SLU)" },
      { rotulo: "Porte", valor: "Microempresa (ME)" },
    ],
  },
  {
    titulo: "Enquadramento",
    campos: [
      { rotulo: "Regime", valor: "Simples Nacional · Anexo III" },
      { rotulo: "Alíquota efetiva", valor: "6% hoje" },
      { rotulo: "Atividade principal", valor: "7319-0/04 · Marketing e publicidade" },
      { rotulo: "Atividade secundária", valor: "6201-5/01 · Desenvolvimento de software sob encomenda" },
      { rotulo: "Capital social", valor: "R$ 10.000,00" },
      { rotulo: "Inscrição municipal", valor: "1.234.567-8" },
    ],
  },
  {
    titulo: "Endereço fiscal",
    campos: [
      { rotulo: "Logradouro", valor: "Rua dos Inconfidentes, 1190, sala 405" },
      { rotulo: "Bairro", valor: "Funcionários" },
      { rotulo: "Cidade", valor: "Belo Horizonte · MG" },
      { rotulo: "CEP", valor: "30140-120" },
    ],
  },
];

function textoBloco(b: BlocoDados): string {
  return `*${b.titulo}*\n` + b.campos.map((c) => `${c.rotulo}: ${c.valor}`).join("\n");
}
function textoTudo(): string {
  return `*${IDENTIDADE}*\n\n` + BLOCOS.map(textoBloco).join("\n\n");
}

export default function EmpresaPage() {
  // id do último copiado (pra feedback "Copiado"); some sozinho.
  const [copiado, setCopiado] = useState<string | null>(null);

  const copiar = async (texto: string, id: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(id);
      window.setTimeout(() => setCopiado((c) => (c === id ? null : c)), 1600);
    } catch {
      /* clipboard indisponível no farol — silencioso */
    }
  };

  return (
    <>
      <TelaHeader meta="Sua empresa · Dados" voltar="/mais" />

      <main className="app-main">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            className="flex flex-col gap-6 pt-2"
            style={{ paddingBottom: "calc(24px + var(--safe-bottom))" }}
          >
            {/* Cabeçalho */}
            <div>
              <h1 className="text-h1 text-text-primary">Dados da empresa</h1>
              <p className="mt-1 text-body text-text-secondary">
                A ficha do seu CNPJ, do jeito que está na Receita e na Junta.
              </p>
            </div>

            {/* Copiar TUDO — pra colar no WhatsApp de banco/cliente */}
            <button
              type="button"
              onClick={() => copiar(textoTudo(), "tudo")}
              className="flex items-center gap-3 rounded-2xl border border-border-strong bg-surface-card p-3.5 text-left transition-colors hover:bg-surface-alt"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-tint-brand text-action-primary-sm">
                {copiado === "tudo" ? <IconeCheck /> : <IconeCopiar />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-caption font-semibold text-text-primary">
                  {copiado === "tudo" ? "Copiado!" : "Copiar todos os dados"}
                </p>
                <p className="text-micro text-text-tertiary">
                  Pronto pra colar no WhatsApp, e-mail ou formulário.
                </p>
              </div>
            </button>

            {/* Blocos */}
            {BLOCOS.map((b) => (
              <Bloco
                key={b.titulo}
                bloco={b}
                copiado={copiado}
                onCopiarBloco={() => copiar(textoBloco(b), b.titulo)}
                onCopiarCampo={(c) => copiar(c.valor, `${b.titulo}:${c.rotulo}`)}
              />
            ))}

            {/* Honestidade antes do toque → fluxo pago */}
            <div className="rounded-2xl border border-border-hairline bg-surface-alt p-4">
              <p className="text-caption font-semibold text-text-primary">
                Precisa mudar algum desses dados?
              </p>
              <p className="mt-1 text-micro text-text-secondary">
                Trocar endereço, atividade (CNAE) ou nome é alteração cadastral,
                feita na Junta e na Receita. A gente cuida de tudo, é um serviço
                à parte.
              </p>
              <Link
                href="/mais/servicos?abrir=alteracao"
                className="mt-3 inline-flex min-h-10 items-center justify-center rounded-md bg-action-primary-sm px-4 text-body font-semibold text-text-on-brand transition-colors hover:bg-action-primary-hover"
              >
                Solicitar alteração
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

/* ─── Bloco de campos ──────────────────────────────────────────────────────── */
function Bloco({
  bloco,
  copiado,
  onCopiarBloco,
  onCopiarCampo,
}: {
  bloco: BlocoDados;
  copiado: string | null;
  onCopiarBloco: () => void;
  onCopiarCampo: (c: Campo) => void;
}) {
  const blocoCopiado = copiado === bloco.titulo;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-body-strong font-semibold text-text-primary">
          {bloco.titulo}
        </p>
        <button
          type="button"
          onClick={onCopiarBloco}
          className="flex items-center gap-1 text-caption font-semibold text-action-primary-sm transition-opacity hover:opacity-80"
        >
          {blocoCopiado ? <IconeCheck /> : <IconeCopiar />}
          {blocoCopiado ? "Copiado" : "Copiar"}
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border-hairline bg-surface-card">
        {bloco.campos.map((c) => {
          const campoCopiado = copiado === `${bloco.titulo}:${c.rotulo}`;
          return (
            <div
              key={c.rotulo}
              className="flex items-start gap-3 border-b border-border-hairline px-4 py-3 last:border-b-0"
            >
              <div className="min-w-0 flex-1">
                <p className="text-micro text-text-tertiary">{c.rotulo}</p>
                <p className="mt-0.5 break-words text-caption font-medium text-text-primary">
                  {c.valor}
                </p>
              </div>
              {c.solto && (
                <button
                  type="button"
                  onClick={() => onCopiarCampo(c)}
                  aria-label={`Copiar ${c.rotulo}`}
                  className="mt-0.5 shrink-0 text-text-tertiary transition-colors hover:text-action-primary-sm"
                >
                  {campoCopiado ? (
                    <span className="text-action-primary-sm">
                      <IconeCheck />
                    </span>
                  ) : (
                    <IconeCopiar />
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── ícones ───────────────────────────────────────────────────────────────── */
function IconeCopiar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}
function IconeCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}
