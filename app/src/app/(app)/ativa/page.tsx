"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape } from "@/components/ui/tela";
import { StatusIcon } from "@/components/ui/status";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N24 — EMPRESA ATIVA + DIA-2  ·  arquétipo A10 (aterrissagem) · shell APP
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: spec-telas-b3-b4-aterrissagem.md → Tela 23 (5.1)
 *
 * ─── A REGRA QUE MANDA: BANDEIRA, NÃO TROFÉU ────────────────────────────────
 * "Empresa ativa" é uma PONTE, não a linha de chegada (mesma doutrina do
 * `Destino` em lista-passos). Sobretudo pro leigo (Cida/reta), que não sabe
 * operar. Um troféu prometeria fim; aqui o trabalho está COMEÇANDO. Por isso a
 * celebração é curta e a tela vira, na hora, "e agora, faça isto".
 *
 * O que carrega, e por quê:
 *   · UX-19 — primeiros passos como 3 cards ACIONÁVEIS (1ª nota, 1º DAS,
 *     certificado). Handoff ativo pro portal, não um "boa sorte".
 *   · UX-41 — o loop estimativa → realidade. O N18 prometeu "estimativa";
 *     fechar o loop é dizer que daqui a uns meses a gente confere o número REAL.
 *     Otimização é manutenção, não evento único. 🟡 vive no portal.
 *   · Canal humano fixo — o WhatsApp sempre visível. O produto COMEÇA aqui.
 *
 * ⚠️ Verde = token de estado (o estado do CNPJ é, literalmente, ativo). É o uso
 * mais legítimo que o verde tem no produto inteiro.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Viria do B4 (CNPJ emitido). Mock pra farol.
const EMPRESA = {
  razao: "Ana Beatriz Ramos Desenvolvimento de Software",
  cnpj: "54.321.000/0001-09",
};

export default function AtivaPage() {
  // K3 (revisado 21/07): entrada comemorativa, NÃO overlay. O Confetti da marca
  // resolve num check coral PARADO (é feito pra substituir o CTA do veredito),
  // então sobre este card ele virava um blob no meio da tela cobrindo o texto
  // (o Pedro pegou no mockup). Trocado por MATERIALIZAÇÃO: o card sobe/aparece e
  // o selo verde dá um pop com overshoot. Vitória sem tapar conteúdo; degrada
  // sozinho em reduced-motion (globals zera as transições → aparece pronto).
  const [entrou, setEntrou] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntrou(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      <TelaHeader meta="Pronto" />

      <main className="app-main">
        <Titulo sub="O CNPJ saiu e já pode emitir nota. A parte difícil acabou, e a gente continua com você daqui pra frente.">
          Sua empresa existe
        </Titulo>

        <Corpo>
          {/* A vitória materializa: o card sobe e aparece (spring suave), sem
              overlay. "Bandeira não troféu" segue de pé (a tela vira dever-de-
              casa logo abaixo), mas negar a conquista era frio. */}
          <div
            style={{
              transform: entrou
                ? "translateY(0) scale(1)"
                : "translateY(10px) scale(.96)",
              opacity: entrou ? 1 : 0,
              transition:
                "transform .5s cubic-bezier(.22,1,.36,1), opacity .4s ease",
            }}
          >
            <Card tom="sucesso">
              <div className="flex items-center gap-2 mb-2">
                {/* O selo verde dá o "pop" com overshoot (back-out), depois do
                    card assentar (delay). É o beat vitorioso, no token de ESTADO
                    certo (verde = CNPJ ativo), sem tapar nada. */}
                <span
                  style={{
                    display: "inline-flex",
                    transform: entrou ? "scale(1)" : "scale(.4)",
                    opacity: entrou ? 1 : 0,
                    transition:
                      "transform .45s cubic-bezier(.34,1.56,.64,1) .14s, opacity .25s ease .14s",
                  }}
                >
                  <StatusIcon estado="feito" />
                </span>
                <span className="text-caption font-semibold text-state-success-text">
                  CNPJ ativo
                </span>
              </div>
              <p className="text-body font-semibold text-text-primary">
                {EMPRESA.razao}
              </p>
              <p className="text-caption text-text-secondary mt-0.5">
                {EMPRESA.cnpj}
              </p>
            </Card>
          </div>

          {/* UX-19: os 3 primeiros passos, acionáveis. */}
          <div>
            <p className="text-body-strong font-semibold text-text-primary mb-2">
              Seus primeiros passos
            </p>
            <div className="flex flex-col gap-2">
              <PassoCard
                titulo="Sua 1ª nota"
                texto="Vou te guiar passo a passo pra emitir sua primeira nota fiscal, sem pressa."
                acao="Emitir agora"
              />
              <PassoCard
                titulo="Seu 1º imposto (DAS)"
                texto="Todo mês a gente calcula e você paga pelo app. O do mês vence dia 20."
                acao="Ver o cálculo"
              />
              <PassoCard
                titulo="Seu certificado digital"
                texto="Já está guardado com a gente. É o que assina suas notas e declarações."
                acao="Ver onde está"
              />
            </div>
          </div>

          {/* UX-41: o loop da estimativa. Fecha a promessa do N18. */}
          <Card tom="marca">
            <p className="text-caption font-semibold text-text-primary mb-1">
              A gente fica de olho pra você pagar menos
            </p>
            <p className="text-caption text-text-secondary">
              Daqui a uns meses, com o quanto você faturou de verdade, a gente
              confere se seu enquadramento continua o mais barato e avisa se dá
              pra melhorar.
            </p>
          </Card>

          {/* Canal humano fixo: o produto começa aqui, não termina. */}
          <p className="text-caption text-text-secondary">
            Qualquer dúvida, a gente está no WhatsApp, sempre.
          </p>
        </Corpo>

        <Rodape>
          <Button full>Ir pro meu painel</Button>
          <div className="mt-2 flex justify-center">
            <Button variant="ghost">Falar no WhatsApp</Button>
          </div>
        </Rodape>
      </main>
    </>
  );
}

/* ─── Um card de primeiro passo: título + o que é + a ação ─────────────────── */
function PassoCard({
  titulo,
  texto,
  acao,
}: {
  titulo: string;
  texto: string;
  acao: string;
}) {
  return (
    <Card>
      <p className="text-caption font-semibold text-text-primary mb-0.5">
        {titulo}
      </p>
      <p className="text-micro text-text-secondary">{texto}</p>
      <button className="mt-2 text-caption font-semibold text-action-primary-sm underline underline-offset-4">
        {acao}
      </button>
    </Card>
  );
}

