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
          <Card tom="marca">
            <p className="text-caption text-text-secondary mb-1">
              Você economiza por mês
            </p>
            <p className="text-display text-text-primary">{brl(economia)}</p>
            <p className="text-caption text-text-secondary mt-1">
              {brl(economia * 12)} por ano
            </p>
            {/* UX-26: carimbo OBRIGATÓRIO. Tem dinheiro em cima da promessa. */}
            <p className="text-micro text-text-tertiary mt-3">
              Valor estimado. O contador confirma antes de trocar o código.
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
          {/* R5+V6: o N5 (teaser) já fez o argumento "não é malandragem" antes
              do pagamento. O R5 arrumou só o TÍTULO; o V6 terminou o serviço —
              o corpo tirou a dupla de frases que o N5 já entrega ("mesma nota /
              trabalho de contador") e ficou só o mecanismo NOVO (o que muda é a
              tabela). A validade obrigatória (spec) continua, sem eco do N5. */}
          <Aviso variante="info" titulo="Por que a troca é legítima">
            O que você faz e a nota que emite são exatamente iguais nos dois
            códigos. A diferença é só a tabela de imposto.
          </Aviso>

          {/* ───── AS 2 ALAVANCAS (spec T13) ─────
              M2: menção de 1 linha. O outro caminho (pró-labore) é o assunto
              INTEIRO do N18, a PRÓXIMA tela. Pré-explicá-lo aqui pesava e
              competia com o CTA. Diz que existe, e segue. */}
          <p className="text-caption text-text-secondary">
            Esse é o mais fácil dos dois jeitos de pagar menos: funciona sozinho.
            O outro, aumentar quanto você se paga, a gente vê na próxima tela.
          </p>

          {/* ───── UX-26: tradeoff honesto ───── */}
          <Aviso variante="warning" titulo="Antes de trocar, confira uma coisa">
            Se algum cliente seu, edital ou contrato exige um código específico
            na nota, a troca pode atrapalhar. O mais barato nem sempre é o
            melhor comercialmente. Na dúvida, mantenha o atual e fale com a
            gente.
          </Aviso>

          {/* ───── UX-26: prova exportável ─────
              Materializa a confiança FORA do app. V7: peso de LINK, não de CTA
              (era full-width + borda + semibold e competia com os botões de
              decisão do rodapé). Utilitário não disputa com a decisão. */}
          <div className="flex justify-center">
            <button className="inline-flex items-center gap-2 text-caption font-semibold text-action-primary-sm underline underline-offset-4">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
                <path d="M5 21h14" />
              </svg>
              Baixar o porquê em PDF
            </button>
          </div>

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
