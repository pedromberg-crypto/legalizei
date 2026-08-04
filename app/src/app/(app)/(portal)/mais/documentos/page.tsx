"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { TelaHeader } from "@/components/ui/tela";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAIS · DOCUMENTOS — o arquivo da empresa (27/07). Drill-down de /mais.
 * ═══════════════════════════════════════════════════════════════════════════
 * Onde ficam os PDFs que a empresa precisa ter à mão: constituição, cartão
 * CNPJ, contrato social, certidões já emitidas. A gente gera/guarda → a ação é
 * BAIXAR (não upload; o certificado tem casa própria). Documento que não está
 * aqui e precisa ser emitido (CND nova, declaração) vai pra Serviços.
 *
 * ⚠️ Documentos = FAROL/mock.
 *
 * 🆕 04/08 — cruzamento com 2 pesquisas Gemini (blueprint abertura + migração):
 * a "Pasta Digital" completa tem 7 entregáveis, faltavam 2 aqui (Alvará e
 * Termo de Opção pelo Simples). Também ganhou variante `?fluxo=migrar`: quem
 * migrou vê o Relatório de Oportunidade Fiscal — a prova da economia
 * prometida lá no E4.3, não só um documento genérico de constituição.
 * ═══════════════════════════════════════════════════════════════════════════
 */

type Doc = { nome: string; meta: string };
type Grupo = { titulo: string; docs: Doc[] };

const GRUPOS: Grupo[] = [
  {
    titulo: "Constituição",
    docs: [
      { nome: "Contrato social", meta: "PDF · registrado em 12/03/2026" },
      { nome: "Certificado da condição de MEI/ME", meta: "PDF · 12/03/2026" },
      { nome: "Cartão CNPJ", meta: "PDF · atualizado em 05/07/2026" },
      { nome: "Certificado de dispensa de licenciamento (Alvará)", meta: "PDF · 12/03/2026" },
      { nome: "Termo de deferimento da opção pelo Simples Nacional", meta: "PDF · 15/03/2026" },
    ],
  },
  {
    titulo: "Certidões",
    docs: [
      { nome: "Certidão negativa (CND) federal", meta: "PDF · emitida em 20/07/2026" },
      { nome: "Comprovante de inscrição municipal", meta: "PDF · 12/03/2026" },
    ],
  },
  {
    titulo: "Fiscais",
    docs: [
      { nome: "Guia DAS · Junho de 2026", meta: "PDF · 178,31" },
      { nome: "Relatório de faturamento · 2026", meta: "PDF · atualizado mensal" },
    ],
  },
];

const DOC_MIGRACAO: Doc = {
  nome: "Relatório de oportunidade fiscal (pró-labore otimizado)",
  meta: "PDF · a economia calculada na migração, mês a mês",
};

export default function DocumentosPage() {
  const searchParams = useSearchParams();
  const veioDeMigracao = searchParams.get("fluxo") === "migrar";

  return (
    <>
      <TelaHeader meta="Sua empresa · Documentos" voltar="/mais" />

      <main className="app-main">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            className="flex flex-col gap-6 pt-2"
            style={{ paddingBottom: "calc(24px + var(--safe-bottom))" }}
          >
            {/* Cabeçalho */}
            <div>
              <h1 className="text-h1 text-text-primary">Documentos</h1>
              <p className="mt-1 text-body text-text-secondary">
                Os papéis da sua empresa, prontos pra baixar quando precisar.
              </p>
            </div>

            {/* Migrou de contador: a prova da economia entra ANTES dos grupos
                genéricos — é o documento que fecha a promessa do E4.3. */}
            {veioDeMigracao && (
              <div>
                <p className="mb-2 text-body-strong font-semibold text-text-primary">
                  Da sua migração
                </p>
                <div className="overflow-hidden rounded-2xl border border-border-hairline bg-surface-card">
                  <DocLinha d={DOC_MIGRACAO} primeiro />
                </div>
              </div>
            )}

            {/* Grupos de documentos */}
            {GRUPOS.map((g) => (
              <div key={g.titulo}>
                <p className="mb-2 text-body-strong font-semibold text-text-primary">
                  {g.titulo}
                </p>
                <div className="overflow-hidden rounded-2xl border border-border-hairline bg-surface-card">
                  {g.docs.map((d, i) => (
                    <DocLinha key={d.nome} d={d} primeiro={i === 0} />
                  ))}
                </div>
              </div>
            ))}

            {/* Documento que precisa ser emitido → Serviços */}
            <div className="rounded-2xl border border-border-hairline bg-surface-alt p-4">
              <p className="text-caption font-semibold text-text-primary">
                Precisa de um documento que não está aqui?
              </p>
              <p className="mt-1 text-micro text-text-secondary">
                Declaração de faturamento, DECORE, CND específica: a gente emite
                na hora. Alguns são serviço à parte.
              </p>
              <Link
                href="/mais/servicos"
                className="mt-3 inline-flex min-h-10 items-center justify-center rounded-md bg-action-primary-sm px-4 text-body font-semibold text-text-on-brand transition-colors hover:bg-action-primary-hover"
              >
                Ver serviços
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

/* ─── Linha de documento ───────────────────────────────────────────────────── */
function DocLinha({ d, primeiro }: { d: Doc; primeiro: boolean }) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-surface-alt ${
        primeiro ? "" : "border-t border-border-hairline"
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-alt text-text-secondary">
        <IconeDoc />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-caption font-semibold text-text-primary">
          {d.nome}
        </span>
        <span className="block truncate text-micro text-text-tertiary">{d.meta}</span>
      </span>
      <span className="shrink-0 text-text-tertiary">
        <IconeBaixar />
      </span>
    </button>
  );
}

function IconeDoc(): ReactNode {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <path d="M10 13h5M10 17h5" />
    </svg>
  );
}
function IconeBaixar(): ReactNode {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v12M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}
