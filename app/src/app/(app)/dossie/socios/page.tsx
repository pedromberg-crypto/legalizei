"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  TelaHeader,
  Titulo,
  Corpo,
  Rodape,
  Campo,
  Texto,
  OpcoesLinha,
  Aviso,
} from "../campos";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N12 — +SÓCIOS · A1 · shell APP
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: spec-telas-entrada-b1-b2.md → Tela 8 (2.3) · mapa T8→N12
 * Motor: b2.coleta (sócios) · afeta natureza jurídica (N15)
 *
 * Regras da spec:
 *   · Limite MÁXIMO 2 sócios no total (decisão 15/07, era 3). Passou → barra.
 *   · O bloqueio é do PRODUTO, não da lei — dizer isso, não é um "não" seco.
 *   · UX-21: o "quantos sócios?" já foi na triagem do N4. Aqui o limite é só a
 *     trava de segurança, não a 1ª notícia ruim.
 *   · % de participação soma 100% (default divisão igual, editável).
 *
 * 🚧 Mock: o bloco de dados do 2º sócio reusa o esqueleto do N10 (dados do
 * sócio). Aqui só coleta o essencial pra provar o fluxo; o form repetível
 * completo é o mesmo componente do N10 quando for pra valer.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export default function SociosPage() {
  const [tem, setTem] = useState<boolean | null>(null);
  const [nome2, setNome2] = useState("");
  const [parte1, setParte1] = useState(50);

  const parte2 = 100 - parte1;
  const solo = tem === false;
  const completo =
    solo || (tem === true && nome2.trim().split(/\s+/).length >= 2);

  return (
    <>
      {/* Mesmo alinhamento do N10: o cliente lê "Sócios" na lista de passos
          (P1/P2), então é isso que a tela precisa dizer. Vocabulário diferente
          pro mesmo passo faz ele reprocessar onde está. */}
      <TelaHeader meta="Sócios" />

      <main className="app-main">
        <Titulo sub="Quem entra como dono junto com você. Dá pra ser só você.">
          Vai ter mais sócios?
        </Titulo>

        <Corpo>
          <Campo rotulo="Tem outro sócio na empresa?">
            <OpcoesLinha
              opcoes={[
                { v: false, label: "Só eu" },
                { v: true, label: "Tem sócio" },
              ]}
              valor={tem}
              onChange={setTem}
            />
          </Campo>

          {tem === true && (
            <>
              {/* Trava de segurança do limite 2 (a triagem do N4 já filtrou 3+). */}
              <Aviso variante="info" titulo="Aqui a gente abre com até 2 sócios">
                É limite do nosso produto, não da lei. Com 3 ou mais, nosso time
                abre pra você com uma pessoa acompanhando.
              </Aviso>

              <Campo rotulo="Nome completo do 2º sócio">
                <Texto
                  valor={nome2}
                  onChange={setNome2}
                  placeholder="Como está no documento dele"
                  erro={
                    nome2.length > 0 && nome2.trim().split(/\s+/).length < 2
                      ? "Escreva o nome completo."
                      : undefined
                  }
                />
              </Campo>

              <p className="text-micro text-text-tertiary -mt-3">
                Os outros dados dele a gente coleta igual aos seus, na sequência.
              </p>

              {/* % de participação: soma 100, default 50/50 editável.
                  Atalhos pros splits comuns + slider de 5 em 5 (fração de 1%
                  não faz sentido em divisão de sociedade). */}
              <Campo
                rotulo="Como fica a divisão da empresa?"
                dica="Precisa somar 100%. Toque num atalho ou arraste."
              >
                <div className="mb-3 flex gap-2">
                  {[25, 50, 75].map((p) => {
                    const on = parte1 === p;
                    return (
                      <button
                        key={p}
                        onClick={() => setParte1(p)}
                        className={`min-h-10 flex-1 rounded-full border text-caption font-semibold transition-colors
                          ${
                            on
                              ? "border-border-focus bg-surface-tint-brand text-text-primary"
                              : "border-border-hairline bg-surface-card text-text-secondary hover:border-border-strong"
                          }`}
                      >
                        {p}%
                      </button>
                    );
                  })}
                </div>
                <input
                  type="range"
                  min={5}
                  max={95}
                  step={5}
                  value={parte1}
                  onChange={(e) => setParte1(Number(e.target.value))}
                  aria-label="Sua participação na empresa"
                  className="w-full accent-[var(--color-action-primary)]"
                />
                <div className="mt-2 flex justify-between text-caption">
                  <span className="font-semibold text-text-primary">
                    Você: {parte1}%
                  </span>
                  <span className="font-semibold text-text-primary">
                    {nome2.trim().split(/\s+/)[0] || "2º sócio"}: {parte2}%
                  </span>
                </div>
              </Campo>
            </>
          )}

          {solo && (
            <Aviso variante="info" titulo="Empresa só sua">
              Sem sócios, a gente abre no formato certo pra dono único. Você
              confirma o tipo na próxima etapa.
            </Aviso>
          )}
        </Corpo>

        <Rodape>
          <Button full disabled={!completo}>
            Continuar
          </Button>
        </Rodape>
      </main>
    </>
  );
}
