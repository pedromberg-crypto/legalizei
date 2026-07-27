"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape } from "@/components/ui/tela";
import { StatusIcon } from "@/components/ui/status";
import { EnviarSheet } from "@/components/enviar-sheet";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IMPOSTOS · GUIA — detalhe/visualizador · status-aware (24/07).
 * ═══════════════════════════════════════════════════════════════════════════
 * A gente NÃO intermedeia o pagamento: mostra a GUIA, a pessoa vê/baixa/copia o
 * código e paga do jeito dela (banco/lotérica/Pix). Toda guia é clicável — a
 * vencer (ver/pagar) E paga (visualizar/baixar comprovante).
 *
 * Params (da lista/carrossel): tipo · comp · valor · status · data · origem · de.
 * `status=paga` → faixa verde + baixar comprovante, sem "como pagar". Números
 * = farol/mock.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const USER = {
  contribuinte: "Ana Beatriz Ramos Desenv. de Software",
  cnpj: "CNPJ 54.321.000/0001-09",
};
const CODIGO = "85800000001778310000000542026060000012345678900";

export default function PagarPage() {
  return (
    <Suspense fallback={null}>
      <GuiaDetalhe />
    </Suspense>
  );
}

function GuiaDetalhe() {
  const sp = useSearchParams();
  const tipo = sp.get("tipo") ?? "Imposto do mês";
  const comp = sp.get("comp") ?? "Junho de 2026";
  const valor = sp.get("valor") ?? "R$ 178,31";
  const status = sp.get("status") ?? "a-vencer";
  const data = sp.get("data") ?? "Vence 20/07";
  const origem = sp.get("origem") ?? "Faturou R$ 4.200 · 6% do Simples.";
  const voltar = sp.get("de") ?? "/impostos";
  const paga = status === "paga";

  const [docAberto, setDocAberto] = useState(false);
  const [enviarAberto, setEnviarAberto] = useState(false);

  const guia = { tipo, comp, valor, paga, data };

  return (
    <>
      <TelaHeader meta={tipo} voltar={voltar} />

      <main className="app-main">
        <Titulo sub={`${tipo} · ${comp}`}>{valor}</Titulo>

        <Corpo>
          {paga ? (
            <div className="flex items-center gap-3 rounded-2xl bg-state-success-tint p-4">
              <StatusIcon estado="feito" />
              <div className="min-w-0">
                <p className="text-caption font-semibold text-state-success-text">
                  Guia paga
                </p>
                <p className="mt-0.5 text-micro text-text-secondary">{data}</p>
              </div>
            </div>
          ) : (
            <>
              <Card>
                <p className="mb-1 text-caption font-semibold text-text-primary">
                  De onde vem esse valor
                </p>
                <p className="text-caption text-text-secondary">{origem}</p>
              </Card>

              <Card tom="marca">
                <p className="text-caption font-semibold text-text-primary">
                  Como pagar
                </p>
                <p className="mt-1 text-caption text-text-secondary">
                  Baixe ou veja a guia e pague do jeito que preferir: banco, Pix
                  pelo código de barras, ou até numa lotérica. Assim que o
                  pagamento cair, a gente atualiza aqui.
                </p>
              </Card>
            </>
          )}
        </Corpo>

        <Rodape>
          <Button full>{paga ? "Baixar comprovante" : "Baixar guia (PDF)"}</Button>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => setDocAberto(true)}>
              Ver a guia
            </Button>
            <Button variant="secondary" onClick={() => setEnviarAberto(true)}>
              Enviar guia
            </Button>
          </div>
        </Rodape>
      </main>

      {docAberto && (
        <GuiaTelaCheia
          guia={guia}
          onFechar={() => setDocAberto(false)}
          onEnviar={() => setEnviarAberto(true)}
        />
      )}

      {enviarAberto && (
        <EnviarSheet
          titulo="Enviar a guia"
          sub="Manda o PDF pra você ou pra quem precisar do comprovante."
          onFechar={() => setEnviarAberto(false)}
        />
      )}
    </>
  );
}

type Guia = {
  tipo: string;
  comp: string;
  valor: string;
  paga: boolean;
  data: string;
};

/* ─── A guia em tela cheia (o visualizador) ────────────────────────────────── */
function GuiaTelaCheia({
  guia,
  onFechar,
  onEnviar,
}: {
  guia: Guia;
  onFechar: () => void;
  onEnviar: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-surface-page">
      <header
        className="flex shrink-0 items-center justify-between px-5 pb-3"
        style={{ paddingTop: "calc(12px + var(--safe-top))" }}
      >
        <p className="text-caption font-semibold text-text-primary">
          {guia.tipo} · {guia.comp}
        </p>
        <button
          type="button"
          aria-label="Fechar"
          onClick={onFechar}
          className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-alt"
        >
          <IconeX />
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="overflow-hidden rounded-2xl border border-border-hairline bg-white shadow-lg">
          <DocumentoGuia guia={guia} />
        </div>
        {/* Copiar código só faz sentido pra guia a vencer (paga já foi). */}
        {!guia.paga && (
          <div className="mt-3 flex justify-center">
            <CopiarCodigo codigo={CODIGO} />
          </div>
        )}
      </div>
      <div
        className="shrink-0 px-5 pt-3"
        style={{ paddingBottom: "calc(16px + var(--safe-bottom))" }}
      >
        <Button full>{guia.paga ? "Baixar comprovante" : "Baixar guia (PDF)"}</Button>
        <div className="mt-2">
          <Button full variant="secondary" onClick={onEnviar}>
            Enviar guia
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Documento da guia (mock) — limpo, não o boleto cru ───────────────────── */
function DocumentoGuia({ guia }: { guia: Guia }) {
  return (
    <div className="p-6 text-text-primary">
      <div className="flex items-start justify-between border-b border-[#e6e6e6] pb-3">
        <div>
          <p className="text-caption font-semibold uppercase tracking-wide text-[#888]">
            {guia.paga ? "Comprovante" : "Documento de arrecadação"}
          </p>
          <p className="text-body font-bold text-[#222]">{guia.tipo}</p>
        </div>
        {guia.paga && (
          <span className="rounded-md bg-[#e7f6ec] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#1f8a4c]">
            Pago
          </span>
        )}
      </div>

      <div className="border-b border-[#e6e6e6] py-4 text-caption">
        <p className="text-micro uppercase text-[#999]">Contribuinte</p>
        <p className="font-semibold text-[#333]">{USER.contribuinte}</p>
        <p className="text-[#777]">{USER.cnpj}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 border-b border-[#e6e6e6] py-4 text-caption">
        <div>
          <p className="text-micro uppercase text-[#999]">Competência</p>
          <p className="font-semibold text-[#333]">{guia.comp}</p>
        </div>
        <div>
          <p className="text-micro uppercase text-[#999]">Situação</p>
          <p className="font-semibold text-[#333]">{guia.data}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <p className="text-caption font-semibold uppercase text-[#999]">
          Valor total
        </p>
        <p className="text-h1 font-bold text-[#222]">{guia.valor}</p>
      </div>
    </div>
  );
}

/* ─── Copiar código de barras (feedback otimista) ──────────────────────────── */
function CopiarCodigo({ codigo }: { codigo: string }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = () => {
    try {
      navigator.clipboard?.writeText(codigo);
    } catch {
      // clipboard indisponível (iframe sandbox) — segue com o feedback visual.
    }
    setCopiado(true);
    window.setTimeout(() => setCopiado(false), 1800);
  };
  return (
    <button
      type="button"
      onClick={copiar}
      className="flex items-center gap-1.5 text-caption font-semibold text-action-primary-sm"
    >
      {copiado ? (
        <>
          <IconeCheck /> Código copiado
        </>
      ) : (
        <>
          <IconeCopiar /> Copiar código de barras
        </>
      )}
    </button>
  );
}

function IconeCopiar() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}
function IconeCheck() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}
function IconeX() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
