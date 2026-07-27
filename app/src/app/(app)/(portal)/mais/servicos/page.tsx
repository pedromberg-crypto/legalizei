"use client";

import { useEffect, useState, type ReactNode } from "react";
import { TelaHeader } from "@/components/ui/tela";
import { ServicoSheet, type ServicoBase, type GuiaRecalc } from "./servico-sheet";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAIS · SERVIÇOS AVULSOS — a loja de upsells (24/07). Drill-down de /mais.
 * ═══════════════════════════════════════════════════════════════════════════
 * O catálogo à-la-carte, feito pra CONVERTER:
 *   · Remove a fricção do PREÇO no topo: "sem cobrança na hora, cai na próxima
 *     fatura" — SEM prometer remover (a solicitação é efetiva, ver sheet).
 *   · Mais pedidos em destaque (prova social) + catálogo por categoria.
 *   · 1 toque → sheet de detalhe → "Solicitar serviço" → double-check.
 *
 * ⚠️ Preços = FAROL/FAKE (deferidos ao Mauro).
 * ═══════════════════════════════════════════════════════════════════════════
 */

const PROXIMA_FATURA = "05/08";

// Recalcular guia age sobre uma guia VENCIDA (≥1 dia). Mock: vencidas são
// elegíveis; a que ainda não venceu aparece bloqueada.
const GUIAS_RECALC: GuiaRecalc[] = [
  { id: "gr1", comp: "Maio de 2026", valor: "R$ 152,90", situacao: "Venceu em 20/06 · há 42 dias", elegivel: true },
  { id: "gr2", comp: "Abril de 2026", valor: "R$ 141,20", situacao: "Venceu em 20/05 · há 73 dias", elegivel: true },
  { id: "gr3", comp: "Junho de 2026", valor: "R$ 178,31", situacao: "Vence em 20/07", elegivel: false },
];

type Servico = ServicoBase & {
  id: string;
  categoria: string;
  popular?: boolean;
};

const SERVICOS: Servico[] = [
  {
    id: "cnd",
    nome: "Certidão negativa (CND)",
    desc: "Prova que sua empresa está em dia com os impostos.",
    preco: "R$ 35,90",
    categoria: "Certidões e documentos",
    popular: true,
    Icone: IconeEscudo,
    inclui: [
      "Certidão federal, estadual e municipal",
      "PDF oficial pronto pra apresentar",
      "Bancos, licitações e clientes grandes pedem",
    ],
  },
  {
    id: "faturamento",
    nome: "Declaração de faturamento",
    desc: "Comprova quanto você faturou, assinada por contador.",
    preco: "R$ 40,00",
    categoria: "Certidões e documentos",
    popular: true,
    Icone: IconeGrafico,
    inclui: [
      "Faturamento dos últimos meses",
      "Assinada e carimbada pelo contador",
      "Pra financiamento, aluguel ou visto",
    ],
  },
  {
    id: "recalculo",
    nome: "Recálculo de guia",
    desc: "Emitiu nota depois do fechamento? A gente refaz o DAS.",
    preco: "R$ 15,90",
    categoria: "Fiscal",
    popular: true,
    Icone: IconeRefresh,
  },
  {
    id: "decore",
    nome: "DECORE",
    desc: "Comprovante de renda oficial, assinado por contador.",
    preco: "R$ 89,00",
    categoria: "Certidões e documentos",
    Icone: IconeDoc,
  },
  {
    id: "conta-pj",
    nome: "Declaração pra abrir conta PJ",
    desc: "O documento que o banco pede pra abrir a conta da empresa.",
    preco: "R$ 25,00",
    categoria: "Certidões e documentos",
    Icone: IconeDoc,
  },
  {
    id: "2via",
    nome: "2ª via de guia",
    desc: "Perdeu a guia? Emite outra na hora, sem custo.",
    preco: "Grátis",
    categoria: "Fiscal",
    Icone: IconeGuia,
  },
  {
    id: "alteracao",
    nome: "Alteração cadastral",
    desc: "Mudou de endereço ou de atividade? A gente cuida na Junta e na Receita.",
    preco: "a partir de R$ 299",
    categoria: "Alterações societárias",
    Icone: IconeEditar,
  },
  {
    id: "socio",
    nome: "Adicionar sócio",
    desc: "Entrar com um sócio novo é alteração contratual. A gente cota antes.",
    preco: "a partir de R$ 399",
    categoria: "Alterações societárias",
    Icone: IconeSocios,
  },
  {
    id: "baixa",
    nome: "Baixa da empresa",
    desc: "Encerrar o CNPJ do jeito certo, sem deixar pendência.",
    preco: "sob consulta",
    categoria: "Alterações societárias",
    Icone: IconeXCirculo,
  },
  {
    id: "renovacao-cert",
    nome: "Renovação de certificado digital",
    desc: "Renova seu e-CNPJ antes de vencer, sem travar a emissão de nota.",
    preco: "a partir de R$ 120",
    categoria: "Fiscal",
    Icone: IconeEscudo,
    inclui: [
      "Emissão do novo e-CNPJ A1 (na nuvem)",
      "A gente instala e valida por você",
      "Zero interrupção pra emitir nota e gerar guia",
    ],
  },
  {
    id: "relatorio-contabil",
    nome: "Relatório contábil formal",
    desc: "DRE, balanço patrimonial ou livro-caixa, oficial e assinado.",
    preco: "a partir de R$ 89",
    categoria: "Certidões e documentos",
    Icone: IconeDoc,
    inclui: [
      "Documento oficial assinado pelo contador",
      "DRE, balanço ou livro-caixa (você escolhe)",
      "Aceito por banco, licitação e investidor",
    ],
  },
];

const CATEGORIAS = [
  "Certidões e documentos",
  "Fiscal",
  "Alterações societárias",
];

export default function ServicosPage() {
  const [aberto, setAberto] = useState<Servico | null>(null);

  // Deep-link: /mais/servicos?abrir=<id> abre o sheet do serviço direto (as
  // páginas de empresa/sócios/certificado/relatórios mandam pra cá com intenção
  // já resolvida). Lê de window (client-only) → sem precisar de Suspense.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("abrir");
    if (!id) return;
    const s = SERVICOS.find((x) => x.id === id);
    // Sync de query-param no mount: server e client 1º render = null (sem
    // mismatch), o effect abre depois. É o padrão hydration-safe pra deep-link.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (s) setAberto(s);
  }, []);

  const populares = SERVICOS.filter((s) => s.popular);

  return (
    <>
      <TelaHeader meta="Serviços" voltar="/mais" />

      <main className="app-main">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            className="flex flex-col gap-6 pt-2"
            style={{ paddingBottom: "calc(24px + var(--safe-bottom))" }}
          >
            {/* Hero + removedor de fricção */}
            <div>
              <h1 className="text-h1 text-text-primary">Precisa de algo mais?</h1>
              <p className="mt-1 text-body text-text-secondary">
                Documentos, certidões e alterações. A gente resolve.
              </p>
              <div className="mt-3 flex gap-2.5 rounded-2xl bg-surface-tint-brand p-3">
                <span className="mt-0.5 shrink-0 text-action-primary-sm">
                  <IconeRaio />
                </span>
                <p className="text-caption text-text-secondary">
                  <span className="font-semibold text-text-primary">
                    Sem cobrança na hora.
                  </span>{" "}
                  O que você pedir entra na sua próxima fatura. A gente confirma
                  com você antes de começar.
                </p>
              </div>
            </div>

            {/* Mais pedidos */}
            <div>
              <p className="mb-2 text-body-strong font-semibold text-text-primary">
                Mais pedidos
              </p>
              <div className="flex flex-col gap-2">
                {populares.map((s) => (
                  <CardDestaque key={s.id} s={s} onClick={() => setAberto(s)} />
                ))}
              </div>
            </div>

            {/* Catálogo por categoria */}
            {CATEGORIAS.map((cat) => (
              <div key={cat}>
                <p className="mb-2 text-body-strong font-semibold text-text-primary">
                  {cat}
                </p>
                <div className="overflow-hidden rounded-2xl border border-border-hairline bg-surface-card">
                  {SERVICOS.filter((s) => s.categoria === cat).map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setAberto(s)}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-surface-alt ${
                        i > 0 ? "border-t border-border-hairline" : ""
                      }`}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-alt text-text-secondary">
                        <s.Icone />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-caption font-semibold text-text-primary">
                          {s.nome}
                        </span>
                        <span className="block truncate text-micro text-text-tertiary">
                          {s.desc}
                        </span>
                      </span>
                      <span className="shrink-0 text-caption font-semibold text-text-primary">
                        {s.preco}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {aberto && (
        <ServicoSheet
          servico={aberto}
          guias={aberto.id === "recalculo" ? GUIAS_RECALC : undefined}
          proximaFatura={PROXIMA_FATURA}
          onFechar={() => setAberto(null)}
        />
      )}
    </>
  );
}

/* ─── Card de destaque (mais pedidos) ──────────────────────────────────────── */
function CardDestaque({ s, onClick }: { s: Servico; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-4 text-left transition-colors hover:border-border-strong active:bg-surface-alt"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-tint-brand text-action-primary-sm">
        <s.Icone />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-caption font-semibold text-text-primary">
            {s.nome}
          </p>
          <span className="shrink-0 rounded-full bg-surface-tint-brand px-1.5 py-0.5 text-[10px] font-bold text-action-primary-sm">
            ★ Mais pedido
          </span>
        </div>
        <p className="mt-0.5 truncate text-micro text-text-tertiary">{s.desc}</p>
        <p className="mt-1 text-caption font-bold text-text-primary">{s.preco}</p>
      </div>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-action-primary text-text-on-brand">
        <IconeMais />
      </span>
    </button>
  );
}

/* ─── ícones ───────────────────────────────────────────────────────────────── */
function ic() {
  return { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
}
function IconeEscudo(): ReactNode {
  return <svg {...ic()}><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z" /><path d="m9 12 2 2 4-4" /></svg>;
}
function IconeGrafico(): ReactNode {
  return <svg {...ic()}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>;
}
function IconeRefresh(): ReactNode {
  return <svg {...ic()}><path d="M21 12a9 9 0 1 1-2.64-6.36" /><path d="M21 4v5h-5" /></svg>;
}
function IconeDoc(): ReactNode {
  return <svg {...ic()}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /><path d="M10 13h5M10 17h5" /></svg>;
}
function IconeGuia(): ReactNode {
  return <svg {...ic()}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 9h6M7 13h10M7 16h4" /></svg>;
}
function IconeEditar(): ReactNode {
  return <svg {...ic()}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>;
}
function IconeSocios(): ReactNode {
  return <svg {...ic()}><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 3.6a3 3 0 0 1 0 5.8M21 20a6 6 0 0 0-4-5.7" /></svg>;
}
function IconeXCirculo(): ReactNode {
  return <svg {...ic()}><circle cx="12" cy="12" r="9" /><path d="m15 9-6 6M9 9l6 6" /></svg>;
}
function IconeRaio(): ReactNode {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5z" /></svg>;
}
function IconeMais(): ReactNode {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 5v14M5 12h14" /></svg>;
}
