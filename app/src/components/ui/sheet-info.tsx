"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SheetInfo — a explicação sob demanda das telas do dossiê
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 03/09 (pedido do Pedro) — nasceu do "i" da C4 e virou padrão de TODAS as
 * telas do dossiê (C0, C1, C2, C3, C5, C7). O racional é dele: o "i" é
 * discreto o bastante pra não competir com nada, e só toca quem de fato ficou
 * com dúvida — que assim não precisa sair do app pra tirar.
 *
 * Existe como componente porque o markup do sheet já estava duplicado 3 vezes
 * (`SheetCnae`, `SheetSecundarias`, `SheetAdministracao`) e ia pra 9. Aqui
 * mora a mecânica (entrada, fundo, scroll interno, botão de fechar); cada tela
 * manda só o CONTEÚDO.
 *
 * ⚠️ Renderizar SEMPRE como irmão do corpo da tela, nunca dentro do `Corpo`:
 * o container rolável tem clip e o sheet aparece cortado (bug real da C3 em
 * 03/09).
 */

/** Exemplo concreto — o que mais ajuda em C0 (descrição) e C7 (nome). */
export interface ExemploSheet {
  titulo: string;
  /** O jeito que funciona. */
  bom?: string;
  /** O jeito que costuma dar problema. */
  ruim?: string;
  /** Quando não é par bom×ruim, e sim uma dica só (ex.: onde achar o dado). */
  nota?: string;
}

export function SheetInfo({
  titulo,
  pontos,
  exemplo,
  ilustracao,
  link,
  onFechar,
}: {
  titulo: string;
  /** Uma frase por linha, cada uma com o check verde. */
  pontos: string[];
  exemplo?: ExemploSheet;
  /**
   * 🆕 03/09 — espaço reservado pra imagem que MOSTRA o que o texto descreve
   * (o caso-mãe é a folha do IPTU com o índice cadastral circulado). Entra
   * acima do exemplo, porque ver onde fica resolve antes de ler.
   */
  ilustracao?: ReactNode;
  /**
   * 🆕 03/09 (pedido do Pedro) — link pra fora, quando existe página oficial
   * que resolve a dúvida (ex.: consulta do índice cadastral no portal da
   * PBH). Abre em aba nova: ninguém perde o cadastro pela metade.
   */
  link?: { href: string; label: string };
  onFechar: () => void;
}) {
  const [entrou, setEntrou] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntrou(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const sair = () => {
    setEntrou(false);
    window.setTimeout(onFechar, 240);
  };

  return (
    <div className="absolute inset-0 z-[60]">
      <button
        type="button"
        aria-label="Fechar"
        onClick={sair}
        className={`absolute inset-0 bg-[#10151b] transition-opacity duration-300 ${
          entrou ? "opacity-45" : "opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className="absolute inset-x-0 bottom-0 flex max-h-[86%] flex-col rounded-t-3xl bg-surface-page px-5"
        style={{
          transform: entrou ? "translateY(0)" : "translateY(100%)",
          transition: "transform .34s cubic-bezier(.22,1,.36,1)",
          boxShadow: "0 -14px 44px -14px rgba(20,23,28,.32)",
          paddingBottom: "calc(16px + var(--safe-bottom))",
        }}
      >
        <div className="shrink-0 pt-2.5">
          <div className="mx-auto h-1 w-9 rounded-full bg-border-strong" />
        </div>

        <p className="mt-4 shrink-0 text-body-strong font-semibold text-text-primary">
          {titulo}
        </p>

        <div className="mt-3 min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-2.5">
            {pontos.map((texto) => (
              <div key={texto} className="flex items-start gap-2.5">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-state-success-tint text-state-success-text"
                >
                  <CheckMini />
                </span>
                <p className="text-caption text-text-secondary">{texto}</p>
              </div>
            ))}
          </div>

          {ilustracao && <div className="mt-4">{ilustracao}</div>}

          {/* O exemplo vem DEPOIS das explicações e num bloco próprio: quem
              rolou até aqui quer ver como se faz, não mais teoria. */}
          {exemplo && (
            <div className="mt-4 rounded-md border border-border-hairline bg-surface-alt p-3">
              <p className="text-caption font-semibold text-text-primary">
                {exemplo.titulo}
              </p>

              {exemplo.nota && (
                <p className="text-caption text-text-secondary mt-1.5">{exemplo.nota}</p>
              )}

              {exemplo.bom && (
                <div className="mt-2.5">
                  <p className="text-micro font-semibold text-state-success-text">
                    Funciona
                  </p>
                  <p className="text-caption text-text-primary mt-0.5">{exemplo.bom}</p>
                </div>
              )}

              {exemplo.ruim && (
                <div className="mt-2.5">
                  <p className="text-micro font-semibold text-state-warning-text">
                    Costuma dar problema
                  </p>
                  <p className="text-caption text-text-primary mt-0.5">{exemplo.ruim}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-5 shrink-0">
          {link && (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-3 block w-full text-center text-caption font-medium text-text-secondary underline underline-offset-4"
            >
              {link.label}
            </a>
          )}
          <Button full variant="secondary" onClick={sair}>
            Entendi
          </Button>
        </div>
      </div>
    </div>
  );
}

/** O mesmo check do selo verde usado no E9 e nos cards do dossiê. */
function CheckMini() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m5 12 4 4 8-9" />
    </svg>
  );
}

/**
 * O botão "i" do cabeçalho — sempre o mesmo desenho, em todas as telas.
 * Vai no slot `acao` do `TelaHeader`, na ponta direita, na altura do voltar.
 */
export function BotaoInfo({ onClick, rotulo }: { onClick: () => void; rotulo: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={rotulo}
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-hairline text-micro font-bold text-text-tertiary"
    >
      i
    </button>
  );
}
