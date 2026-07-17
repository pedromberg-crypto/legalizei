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
import { FISCAL, brl } from "@/lib/fiscal";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N11 — DUPLO VÍNCULO / CONTRIBUI PRO INSS POR FORA · A1 · shell APP
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: spec-telas-entrada-b1-b2.md → Tela 7 (2.2) · mapa T7→N11
 * Motor: b2.coleta (vínculo) → alimenta b2.simulador (N18)
 *
 * Por que existe: o que o sócio já recolhe de INSS por fora muda o CUSTO do
 * pró-labore no simulador (UX-24 — as telas não são ilhas). Esta tela COLETA
 * esse dado; o N18 consome.
 *
 * Regras da spec:
 *   · A pergunta cobre CLT, aposentado, autônomo E sócio de outro CNPJ — não só
 *     "emprego registrado" (aposentada não é CLT e precisa cair aqui).
 *   · Teto INSS é cálculo de FOLGA, não binário: só zera se o CLT já bate o teto.
 *     "Deixar claro que é só sobre a folga" pra não pedir aumento de pró-labore
 *     por engano.
 *   · Pró-labore ≠ CLT da própria empresa (duplo vínculo impossível). Aqui a
 *     gente já REENQUADRA como ganho (UX-27): o INSS conta pra aposentadoria.
 * ═══════════════════════════════════════════════════════════════════════════
 */

function mascaraReais(v: string) {
  const d = v.replace(/\D/g, "");
  if (!d) return "";
  return Number(d).toLocaleString("pt-BR");
}

export default function VinculoPage() {
  const [contribui, setContribui] = useState<boolean | null>(null);
  const [valor, setValor] = useState("");

  const clt = Number(valor.replace(/\D/g, "")) || 0;
  const folga = Math.max(0, FISCAL.TETO_INSS - clt);
  const zerado = folga <= 0;

  const completo =
    contribui === false || (contribui === true && clt > 0);

  return (
    <>
      <TelaHeader meta="Como você já contribui" />

      <main className="app-main">
        <Titulo sub="Isso muda quanto de imposto a empresa paga. Vale a pena acertar.">
          Você já contribui pro INSS por fora?
        </Titulo>

        <Corpo>
          <Campo
            rotulo="Já recolhe INSS hoje?"
            dica="Vale emprego de carteira, aposentadoria, autônomo ou sócio de outra empresa."
          >
            <OpcoesLinha
              opcoes={[
                { v: false, label: "Não" },
                { v: true, label: "Sim" },
              ]}
              valor={contribui}
              onChange={setContribui}
            />
          </Campo>

          {contribui === true && (
            <>
              <Campo
                rotulo="Quanto você recebe por mês nesse vínculo?"
                dica="É sobre esse valor que o INSS já é descontado."
              >
                <Texto
                  valor={valor}
                  onChange={(v) => setValor(mascaraReais(v))}
                  placeholder="R$ 0"
                  inputMode="numeric"
                />
              </Campo>

              {/* Teto = FOLGA, não binário (spec Tela 7). */}
              {clt > 0 && (
                <Aviso
                  variante={zerado ? "success" : "info"}
                  titulo={
                    zerado
                      ? "Você não paga INSS de novo na empresa"
                      : "Na empresa, o INSS vem só sobre a folga"
                  }
                >
                  {zerado ? (
                    <>
                      Seu vínculo já bate o teto de {brl(FISCAL.TETO_INSS)}. O
                      pró-labore não recolhe INSS de novo.
                    </>
                  ) : (
                    <>
                      Você já contribui sobre {brl(clt)}. Na empresa, o INSS incide
                      só sobre o que falta pro teto: {brl(folga)}. Não é o valor
                      cheio nem zero, então não precisa forçar o pró-labore por
                      causa disso.
                    </>
                  )}
                </Aviso>
              )}
            </>
          )}

          {/* UX-27: reenquadra o pró-labore como ganho, não só "não pode ser CLT". */}
          <Aviso variante="info" titulo="Como você se paga na sua empresa">
            Na sua própria empresa você não entra como CLT: você se paga por
            pró-labore. E ele conta a favor: recolhe INSS que soma pra sua
            aposentadoria e dá direito aos benefícios do INSS.
          </Aviso>

          <p className="text-micro text-text-tertiary">
            A gente não consulta o vínculo de ninguém sozinho. Você declara, e
            isso fica protegido.
          </p>
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
