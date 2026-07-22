"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { StatusIcon } from "@/components/ui/status";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * P0 — CERTIFICADO DIGITAL  ·  arquétipo GATE (reusa StatusIcon) · shell APP
 * ═══════════════════════════════════════════════════════════════════════════
 * Matriz: execucao/matriz-portal-interno.md → Módulo 0 (P0)
 *
 * ─── A REGRA QUE MANDA: O GATE DESTRAVA TUDO ────────────────────────────────
 * Provocação do Pedro (22/07): o 1º passo real do dia-2 NÃO é gerar a guia, é
 * o CERTIFICADO. O dossiê confirma: é pré-requisito pra emitir nota E pra
 * acessar a Receita. Sem ele, a gente não faz NADA pela pessoa. Então o portal
 * abre AQUI: enquanto pendente, P3 (pagar) e P6 (emitir) ficam travados, e o
 * foco do P1 é este. O ciclo mensal só começa depois.
 *
 * ─── NÃO É BASTIDOR SILENCIOSO ──────────────────────────────────────────────
 * Emitir e-CNPJ exige VALIDAÇÃO DE IDENTIDADE do responsável (videoconf com a
 * certificadora). É uma pausa COM ação do cliente, igual às pausas do flow de
 * abertura — herdamos do teto-de-automação (órgão/terceiro com humano no meio).
 * A copy trata isso como "rápido e a gente faz junto", não como obstáculo.
 *
 * Estados: pendente (mock) / em-validação / emitido. O dado do provider é 🟡
 * (decisão de certificadora — Sete Minas/terceiro, na fila). Aqui é farol.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// O que o certificado libera. Enquanto pendente, tudo travado (o gate visível).
const LIBERA = [
  "Emitir nota fiscal",
  "Pagar seus impostos pela gente",
  "A gente cuidar das suas obrigações com a Receita",
];

export default function CertificadoPage() {
  return (
    <>
      <TelaHeader meta="Certificado digital" />

      <main className="app-main">
        <Titulo sub="É o que destrava emitir nota e cuidar dos seus impostos. Leva uns minutos, e a gente faz junto com você.">
          Falta só o seu certificado
        </Titulo>

        <Corpo>
          {/* ── O que é, sem jargão ─────────────────────────────────────────
              "e-CNPJ / A1 / ICP-Brasil" não aparece: quem abre a 1ª empresa não
              sabe o que é, e não precisa saber. É "sua assinatura digital". */}
          <Card>
            <p className="text-caption font-semibold text-text-primary mb-1">
              O que é
            </p>
            <p className="text-caption text-text-secondary">
              O certificado é a sua assinatura digital. É com ele que a gente
              emite suas notas e fala com a Receita por você. Todo CNPJ precisa
              de um.
            </p>
          </Card>

          {/* ── O GATE, visível: o que ele libera (tudo travado até fazer) ──
              Os cadeados dizem, sem texto de medo, por que esta tela vem antes
              de tudo. Não é ameaça (coral/vermelho); é o token neutro de
              "retido", o mesmo do boleto pendente na ListaPassos. */}
          <div>
            <p className="text-body-strong font-semibold text-text-primary mb-2">
              O que ele libera
            </p>
            <div className="flex flex-col gap-2.5">
              {LIBERA.map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <span className="mt-0.5">
                    <StatusIcon estado="travado" />
                  </span>
                  <p className="text-caption text-text-muted">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Como funciona: a pausa (validação por vídeo), desdramatizada ── */}
          <Aviso variante="info" titulo="Como funciona">
            Você faz uma validação rápida por vídeo, só pra confirmar que é você.
            Depois disso o certificado fica guardado com a gente e você não vê
            mais essa tela.
          </Aviso>
        </Corpo>

        <Rodape>
          <Button full>Fazer meu certificado agora</Button>
          <div className="mt-2 flex justify-center">
            <Button variant="ghost">Tirar uma dúvida no WhatsApp</Button>
          </div>
        </Rodape>
      </main>
    </>
  );
}
