"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "../campos";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N15 — NATUREZA JURÍDICA · A1 · shell APP
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: spec-telas-entrada-b1-b2.md → Tela 11 (2.6) · mapa T11→N15
 * Motor: b2.coleta (natureza) · coerência com N12 (sócios)
 *
 * Regras da spec:
 *   · Recomendação da IA como card DEFAULT, não dropdown seco: solo → SLU,
 *     2+ sócios → LTDA.
 *   · Explica a diferença em 1 linha; confirmar OU mudar.
 *   · Coerência com o N12: SLU + tem sócios → bloqueia e corrige (guard-rail
 *     contra escolha impossível).
 *
 * ⚠️ Fato datado > spec (índice-autoridade): o CNPJ real do Pedro saiu LTDA num
 * caso solo. A spec diz "solo→SLU"; o produto RECOMENDA SLU mas deixa a pessoa
 * escolher LTDA. A recomendação nunca é uma trava — só a incoerência é.
 *
 * 🚧 Mock: solo vem herdado do N12. Aqui fixo em solo pra provar a recomendação
 * + o guard-rail de incoerência quando a pessoa força a opção errada.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Herdado do N12 (mock). true = tem 2º sócio.
const TEM_SOCIO = false;

type Tipo = "slu" | "ltda";

const RECOMENDADO: Tipo = TEM_SOCIO ? "ltda" : "slu";

const INFO: Record<Tipo, { nome: string; linha: string; sigla: string }> = {
  slu: {
    nome: "Empresa de dono único",
    sigla: "SLU",
    linha: "Feita pra quem abre sozinho. Seu patrimônio pessoal fica separado da empresa.",
  },
  ltda: {
    nome: "Sociedade entre sócios",
    sigla: "LTDA",
    linha: "Feita pra 2 ou mais donos, com a divisão da empresa em contrato.",
  },
};

export default function NaturezaPage() {
  const [escolha, setEscolha] = useState<Tipo>(RECOMENDADO);

  // Guard-rail: SLU (dono único) + tem sócio = impossível.
  const incoerente = escolha === "slu" && TEM_SOCIO;
  // LTDA solo é permitido (fato do CNPJ do Pedro); só avisa, não trava.
  const ltdaSolo = escolha === "ltda" && !TEM_SOCIO;

  return (
    <>
      <TelaHeader meta="Tipo da empresa" />

      <main className="app-main">
        <Titulo sub="É o formato jurídico da empresa. A gente já sugere o certo pro seu caso.">
          O tipo da sua empresa
        </Titulo>

        <Corpo>
          <div>
            <p className="text-micro text-text-tertiary mb-1.5">
              Nossa recomendação pra você
            </p>
            <div className="flex flex-col gap-2">
              {(["slu", "ltda"] as Tipo[]).map((t) => {
                const on = escolha === t;
                const rec = t === RECOMENDADO;
                return (
                  <button
                    key={t}
                    onClick={() => setEscolha(t)}
                    className={`rounded-md border p-4 text-left transition-colors
                      ${
                        on
                          ? "border-border-focus bg-surface-tint-brand"
                          : "border-border-hairline bg-surface-card hover:border-border-strong"
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-body font-semibold text-text-primary">
                        {INFO[t].nome}
                      </span>
                      {rec && (
                        <span className="rounded-full bg-state-success-tint px-2 py-0.5 text-micro font-semibold text-state-success-text">
                          Sugerido
                        </span>
                      )}
                    </div>
                    <p className="text-caption text-text-secondary">
                      {INFO[t].linha}
                    </p>
                    <p className="text-micro text-text-tertiary mt-1">
                      Sigla oficial: {INFO[t].sigla}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Guard-rail contra escolha impossível (spec Tela 11). */}
          {incoerente && (
            <Aviso variante="danger" titulo="Esse tipo não combina com sócios">
              Empresa de dono único é só pra quem abre sozinho. Como você tem
              sócio, o certo é a sociedade. A gente já ajustou pra você.
            </Aviso>
          )}

          {/* LTDA solo é permitido (fato do CNPJ do Pedro), só contextualiza. */}
          {ltdaSolo && (
            <Aviso variante="info" titulo="Dá pra abrir sozinho como sociedade">
              É possível e às vezes faz sentido, mas exige um pouco mais de
              formalidade. Se você não tem um motivo específico, a de dono único
              costuma ser mais simples.
            </Aviso>
          )}

          <Card>
            <p className="text-caption font-semibold text-text-primary mb-1">
              Não precisa decorar sigla
            </p>
            <p className="text-caption text-text-secondary">
              Os dois separam seu dinheiro pessoal do da empresa. A gente cuida
              do resto do papel.
            </p>
          </Card>
        </Corpo>

        <Rodape>
          <Button full disabled={incoerente}>
            Continuar
          </Button>
        </Rodape>
      </main>
    </>
  );
}
