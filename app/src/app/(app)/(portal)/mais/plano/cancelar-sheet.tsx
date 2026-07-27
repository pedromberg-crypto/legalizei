"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CANCELAR ASSINATURA — bottom-sheet (modelo do revisar/emitir NF). 24/07.
 * ═══════════════════════════════════════════════════════════════════════════
 * Simples por ora (retenção fica pra depois): "tem certeza?" + o alerta de que
 * a conta segue ATIVA até o fim do período já pago (a mensalidade cobre até lá).
 * "Manter meu plano" é o caminho de saída fácil; cancelar é a ação destrutiva.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function CancelarSheet({
  ativaAte,
  onFechar,
  onConfirmar,
}: {
  ativaAte: string;
  onFechar: () => void;
  onConfirmar: () => void;
}) {
  const [entrou, setEntrou] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntrou(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const sairCom = (cb: () => void) => {
    setEntrou(false);
    window.setTimeout(cb, 240);
  };

  return (
    <div className="absolute inset-0 z-50">
      <button
        type="button"
        aria-label="Fechar"
        onClick={() => sairCom(onFechar)}
        className={`absolute inset-0 bg-[#10151b] transition-opacity duration-300 ${
          entrou ? "opacity-45" : "opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="absolute inset-x-0 bottom-0 flex flex-col rounded-t-3xl bg-surface-page"
        style={{
          transform: entrou ? "translateY(0)" : "translateY(100%)",
          transition: "transform .34s cubic-bezier(.22,1,.36,1)",
          boxShadow: "0 -14px 44px -14px rgba(20,23,28,.32)",
        }}
      >
        <div className="shrink-0 pt-2.5">
          <div className="mx-auto h-1 w-9 rounded-full bg-border-strong" />
        </div>

        <div className="px-6 pt-4">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-state-danger-tint text-state-danger-text">
              <IconeAlerta />
            </span>
            <h2 className="mt-4 text-h2 text-text-primary">
              Tem certeza que quer cancelar?
            </h2>
            <p className="mx-auto mt-1 max-w-[20rem] text-body text-text-secondary">
              Sem a assinatura, a gente para de emitir suas notas, calcular seus
              impostos e cuidar das obrigações.
            </p>
          </div>

          {/* Alerta: ativa até o fim do período já pago */}
          <div className="mt-4 flex gap-2.5 rounded-2xl bg-state-info-tint p-3">
            <span className="mt-0.5 shrink-0 text-state-info-text">
              <IconeInfo />
            </span>
            <p className="text-caption text-text-secondary">
              Sua conta segue <span className="font-semibold text-text-primary">ativa até {ativaAte}</span>.
              A mensalidade deste mês já cobre até lá, então você não perde nada
              agora.
            </p>
          </div>
        </div>

        <div
          className="px-6 pt-4"
          style={{ paddingBottom: "calc(16px + var(--safe-bottom))" }}
        >
          <button
            type="button"
            onClick={() => sairCom(onConfirmar)}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-state-danger px-6 text-lg font-bold text-text-on-dark transition-opacity hover:opacity-90 active:opacity-90"
          >
            Sim, cancelar assinatura
          </button>
          <div className="mt-1 flex justify-center">
            <Button variant="ghost" onClick={() => sairCom(onFechar)}>
              Manter meu plano
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconeAlerta() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4M12 17v.01" />
    </svg>
  );
}
function IconeInfo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8v.01" />
    </svg>
  );
}
