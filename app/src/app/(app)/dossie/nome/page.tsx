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
  Aviso,
} from "../campos";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N16 — RAZÃO SOCIAL + NOME FANTASIA · A1 · shell APP
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: spec-telas-entrada-b1-b2.md → Tela 12 (2.7) · mapa T12→N16
 * Motor: b2.coleta (nome) · última tela da coleta antes do CNAE ótimo (N17)
 *
 * Regras da spec:
 *   · IA SUGERE a razão social a partir do nome + atividade.
 *   · Nome fantasia opcional.
 *   · Checagem de viabilidade: nome em uso → sugere variações (evita reprova na
 *     JUCEMG antes de registrar).
 *
 * 🚧 Mock: a "consulta prévia" é dublada — nomes contendo "digital" fingem estar
 * em uso pra provar o caminho de variação. Provider real (JUCEMG) 🟡.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Herdado do N10 (mock).
const NOME_SOCIO = "Ana Souza";
// Sugestão da IA a partir de nome + atividade.
const SUGESTAO_RAZAO = "Ana Souza Web Studio";

function checarViabilidade(nome: string): "livre" | "em-uso" | null {
  const n = nome.trim();
  if (n.length < 3) return null;
  // Mock: nomes com "digital" fingem colisão pra exercer o fluxo de variação.
  return /digital/i.test(n) ? "em-uso" : "livre";
}

export default function NomePage() {
  const [razao, setRazao] = useState(SUGESTAO_RAZAO);
  const [fantasia, setFantasia] = useState("");

  const status = checarViabilidade(razao);
  const emUso = status === "em-uso";
  const completo = razao.trim().length >= 3 && !emUso;

  const variacoes = [
    `${razao.trim()} ME`,
    `${NOME_SOCIO.split(" ")[0]} ${razao.trim().split(" ").slice(-1)[0]}`,
    `${razao.trim()} Serviços`,
  ];

  return (
    <>
      <TelaHeader meta="Nome da empresa" />

      <main className="app-main">
        <Titulo sub="A razão social é o nome oficial no CNPJ. O fantasia é como o público chama.">
          O nome da empresa
        </Titulo>

        <Corpo>
          <Campo
            rotulo="Razão social"
            dica="A gente já sugeriu um a partir do seu nome. Ajuste se quiser."
          >
            <Texto
              valor={razao}
              onChange={setRazao}
              placeholder="Nome oficial da empresa"
              ok={
                status === "livre" ? "Nome disponível na Junta." : undefined
              }
              erro={emUso ? "Esse nome já está em uso." : undefined}
            />
          </Campo>

          {/* Nome em uso → oferece variações (evita reprova JUCEMG). */}
          {emUso && (
            <div>
              <p className="text-caption font-semibold text-text-primary mb-2">
                Que tal uma dessas?
              </p>
              <div className="flex flex-col gap-2">
                {variacoes.map((v) => (
                  <button
                    key={v}
                    onClick={() => setRazao(v)}
                    className="min-h-12 rounded-md border border-border-hairline bg-surface-card
                               px-4 text-left text-body font-semibold text-text-primary
                               transition-colors hover:border-border-strong"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Campo
            rotulo="Nome fantasia"
            dica="Opcional. É a marca que aparece pro cliente."
          >
            <Texto
              valor={fantasia}
              onChange={setFantasia}
              placeholder="Como o público vai te conhecer"
            />
          </Campo>

          <Aviso variante="info" titulo="A gente confere antes de registrar">
            Fazemos a consulta prévia na Junta pra evitar que o nome seja
            reprovado no meio do caminho. Se der conflito, a gente te avisa.
          </Aviso>
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
