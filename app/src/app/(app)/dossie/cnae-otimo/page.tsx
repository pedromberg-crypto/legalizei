"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "../campos";
import { FISCAL, FAIXA_MEDIA, brl } from "@/lib/fiscal";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N17 — CNAE FISCALMENTE ÓTIMO · A3 (Número/prova) · shell APP (pago)
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: spec-telas-entrada-b1-b2.md → Tela 13 (2.8) · mapa T13→N17
 * Base: cnae-fiscalmente-otimo.md
 *
 * É a FEATURE-ÂNCORA sendo entregue, e é o que **cumpre a promessa do N5**.
 * Condicional: só existe quando há família de swap pra atividade. Sem família,
 * o flow pula direto pro simulador (N18).
 *
 * Regras da spec, todas obrigatórias:
 *   · NUNCA troca em silêncio — opt-in explícito, com trilha de auditoria
 *   · "Por que é válido" é OBRIGATÓRIO exibir: sem isso o leigo acha fraude
 *   · Economia sempre em R$, nunca "Anexo III/V" cru
 *   · As 2 alavancas explícitas: trocar de código (aqui) OU se pagar mais
 *     (próxima tela). Quem é solo e tem folha baixa ganha AQUI, sem precisar
 *     de pró-labore alto
 *   · UX-26 — carimbo de estimativa, tradeoff honesto e prova exportável
 *
 * 🚧 Caso mock: a persona `instrutora` (dá treinamento E consultoria). Os dois
 * códigos cobrem o que ela faz; um paga 15,5% e o outro 6%. Ela não sabia que
 * o código muda o imposto — é a razão de a pill do N4 não validar sozinha.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const fat = FAIXA_MEDIA["10-20k"];
const ATUAL = {
  humano: "Consultoria em gestão empresarial",
  cnae: "7020-4/00",
  aliquota: FISCAL.ANEXO_V,
};
const OTIMO = {
  humano: "Treinamento e capacitação profissional",
  cnae: "8599-6/04",
  aliquota: FISCAL.ANEXO_III,
};
const economia = Math.round((ATUAL.aliquota - OTIMO.aliquota) * fat);

export default function CnaeOtimoPage() {
  const [escolha, setEscolha] = useState<"otimo" | "atual" | null>(null);

  return (
    <>
      <TelaHeader meta="Seu enquadramento" />

      <main className="app-main">
        <Titulo sub="Você descreveu treinamento, e existe mais de um código oficial que cobre isso.">
          Achamos um jeito de pagar menos
        </Titulo>

        <Corpo>
          {/* ───── O NÚMERO GRANDE (A3) — sempre em R$ ───── */}
          <Card tint>
            <p className="text-caption text-text-secondary mb-1">
              Você economiza por mês
            </p>
            <p className="text-display text-text-primary">{brl(economia)}</p>
            <p className="text-caption text-text-secondary mt-1">
              {brl(economia * 12)} por ano
            </p>
            {/* UX-26: carimbo OBRIGATÓRIO. Tem dinheiro em cima da promessa. */}
            <p className="text-micro text-text-tertiary mt-3">
              Estimativa. A gente confirma com o contador antes de registrar.
            </p>
          </Card>

          {/* ───── ATUAL × ÓTIMO, em linguagem humana ───── */}
          <div>
            <p className="text-body font-semibold text-text-primary mb-2">
              A troca
            </p>
            <div className="flex flex-col gap-2">
              <Comparacao
                rotulo="O código que você tinha"
                humano={ATUAL.humano}
                cnae={ATUAL.cnae}
                imposto={Math.round(ATUAL.aliquota * fat)}
              />
              <Comparacao
                rotulo="O que a gente recomenda"
                humano={OTIMO.humano}
                cnae={OTIMO.cnae}
                imposto={Math.round(OTIMO.aliquota * fat)}
                destaque
              />
            </div>
          </div>

          {/* ───── OBRIGATÓRIO: por que é válido ─────
              Sem isto o leigo acha que é fraude e recusa a economia. */}
          <Aviso variante="info" titulo="Não é malandragem, é o código certo">
            Os dois códigos emitem a mesma nota fiscal pro treinamento que você
            dá. A diferença é só de tabela de imposto. Escolher o mais barato
            entre os que servem pra sua atividade é o trabalho de um contador.
          </Aviso>

          {/* ───── AS 2 ALAVANCAS (spec T13) ───── */}
          <div>
            <p className="text-body font-semibold text-text-primary mb-2">
              Existem dois caminhos, e esse é o mais fácil
            </p>
            <p className="text-caption text-text-secondary">
              <strong className="text-text-primary">Trocar o código</strong> (o
              desta tela) funciona sozinho, sem você precisar mudar mais nada.
              O outro caminho é{" "}
              <strong className="text-text-primary">
                aumentar quanto você se paga
              </strong>
              , e a gente calcula ele na próxima tela. Quem trabalha sozinho
              costuma ganhar mais aqui.
            </p>
          </div>

          {/* ───── UX-26: tradeoff honesto ───── */}
          <Aviso variante="warning" titulo="Antes de trocar, confira uma coisa">
            Se algum cliente seu, edital ou contrato exige um código específico
            na nota, a troca pode atrapalhar. O mais barato nem sempre é o
            melhor comercialmente. Na dúvida, mantenha o atual e fale com a
            gente.
          </Aviso>

          {/* ───── UX-26: prova exportável ─────
              Materializa a confiança FORA do app: vira defesa com o contador
              antigo ou com o cliente, em vez de "confia em mim". */}
          <button
            className="flex min-h-12 w-full items-center justify-center rounded-md border
                       border-border-strong bg-surface-card px-4 text-body font-semibold
                       text-text-primary transition-colors hover:bg-surface-alt"
          >
            Baixar o porquê em PDF
          </button>

          {escolha && (
            <Aviso
              variante={escolha === "otimo" ? "success" : "info"}
              titulo={
                escolha === "otimo"
                  ? "Feito, vamos abrir no código mais barato"
                  : "Tudo bem, mantivemos o seu"
              }
            >
              {escolha === "otimo"
                ? "Registramos a sua escolha e o motivo dela junto do seu dossiê."
                : "Você pode mudar de ideia depois. A economia continua aqui esperando."}
            </Aviso>
          )}
        </Corpo>

        {/* Opt-in EXPLÍCITO. Nunca troca em silêncio, e "manter" não é punido. */}
        <Rodape>
          <div className="flex justify-center mb-1">
            <Button variant="ghost" onClick={() => setEscolha("atual")}>
              Prefiro manter o atual
            </Button>
          </div>
          <Button full onClick={() => setEscolha("otimo")}>
            Quero economizar {brl(economia)}
          </Button>
        </Rodape>
      </main>
    </>
  );
}

function Comparacao({
  rotulo,
  humano,
  cnae,
  imposto,
  destaque = false,
}: {
  rotulo: string;
  humano: string;
  cnae: string;
  imposto: number;
  destaque?: boolean;
}) {
  return (
    <div
      className={`rounded-md border p-3 ${
        destaque
          ? "border-border-focus bg-surface-tint-brand"
          : "border-border-hairline bg-surface-card"
      }`}
    >
      <p className="text-micro text-text-tertiary mb-0.5">{rotulo}</p>
      <p className="text-body font-semibold text-text-primary">{humano}</p>
      <div className="mt-1 flex items-baseline justify-between gap-3">
        <span className="text-caption text-text-secondary">CNAE {cnae}</span>
        <span className="text-caption font-semibold text-text-primary">
          {brl(imposto)} de imposto
        </span>
      </div>
    </div>
  );
}
