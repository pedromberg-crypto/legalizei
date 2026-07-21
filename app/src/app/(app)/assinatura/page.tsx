"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N22 — ASSINATURA DOS SÓCIOS (GOV.BR + e-CAC)  ·  arquétipo A6 · shell APP
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: spec-telas-b3-b4-aterrissagem.md → Tela 21 (convite/consenso) + Tela 22
 * (assinatura GOV.BR + procuração e-CAC). Motor: b7 (govbr-bronze).
 *
 * A Junta registra a empresa com a assinatura dos sócios. Três coisas moram
 * aqui, e cada uma resolve um jeito de a abertura travar no fim:
 *
 *   1. NÍVEL GOV.BR (dobra o N23). Assinar exige prata/ouro. O nível já foi
 *      detectado e guiado lá no N6 (UX-29); aqui só confirma. Bronze → guia
 *      rápido de upgrade ANTES de assinar. É gate, não tela própria: é uma
 *      decisão inline, igual DESAMB/SWAP no mapa.
 *
 *   2. CONSENSO ANTES DO COMMIT (UX-44). Sociedade quebra quando um decide e o
 *      outro descobre a conta depois. O 2º sócio confirma os PRÓPRIOS dados e
 *      aprova dossiê + custo + split — o dono nunca clica por ele. Sem os dois
 *      de acordo, nada é registrado.
 *
 *   3. PROCURAÇÃO e-CAC EXPLICADA (UX-31). Uma linha tira a opacidade do "estou
 *      dando poderes pra quem?": é o que deixa a gente pagar o DAS e cuidar das
 *      obrigações, com limite e revogável.
 *
 * Mock pra farol: SOCIEDADE de 2 (o caso rico, que é o motivo desta tela). No
 * solo, some a lista de sócios e o convite; sobra "Você" + e-CAC.
 * ═══════════════════════════════════════════════════════════════════════════
 */

type StatusSocio = "voce" | "convidar" | "aguardando" | "assinou";

const SOCIOS: { nome: string; status: StatusSocio }[] = [
  { nome: "Você", status: "voce" },
  { nome: "Bruno Costa", status: "convidar" },
];

// 🚧 Mock: no produto vem do N6 (nível detectado). "prata" = happy path.
const NIVEL_GOVBR: "bronze" | "prata" | "ouro" = "prata";

export default function AssinaturaPage() {
  const sociedade = SOCIOS.length > 1;
  const bronze = NIVEL_GOVBR === "bronze";

  return (
    <>
      <TelaHeader meta="Assinatura" />

      <main className="app-main">
        <Titulo sub="A Junta registra a empresa com a assinatura dos sócios. É pelo GOV.BR e leva uns minutos.">
          Hora de assinar
        </Titulo>

        <Corpo>
          {/* ── 1. NÍVEL GOV.BR (N23 dobrado) ──────────────────────────────
              Prata/ouro assina direto; bronze precisa subir antes. */}
          {bronze ? (
            <Aviso variante="warning" titulo="Sua conta GOV.BR precisa subir de nível">
              Pra assinar, o GOV.BR exige nível prata ou ouro, e o seu está
              bronze. A gente te mostra como subir em 2 minutos, aqui mesmo.
            </Aviso>
          ) : (
            <Card tom="sucesso">
              <div className="flex items-center gap-2">
                <Check />
                <span className="text-caption font-semibold text-state-success-text">
                  Sua conta GOV.BR está no nível prata
                </span>
              </div>
              <p className="text-micro text-text-secondary mt-1">
                É o nível que a Junta aceita pra assinar. Pode seguir.
              </p>
            </Card>
          )}

          {/* ── 2. QUEM ASSINA (consenso multi-sócio, UX-44) ───────────────── */}
          {sociedade && (
            <div>
              <p className="text-body-strong font-semibold text-text-primary mb-2">
                Quem precisa assinar
              </p>
              <div className="flex flex-col gap-2">
                {SOCIOS.map((s) => (
                  <SocioLinha key={s.nome} nome={s.nome} status={s.status} />
                ))}
              </div>
              <p className="text-micro text-text-tertiary mt-2">
                A empresa só é registrada quando os dois assinam. Seu sócio
                confirma os próprios dados e aprova o custo antes, ninguém assina
                pelo outro.
              </p>
            </div>
          )}

          {/* ── 3. PROCURAÇÃO e-CAC EXPLICADA (UX-31) ──────────────────────── */}
          <Aviso variante="info" titulo="Junto vai uma procuração eletrônica">
            É o que deixa a gente pagar seu DAS e cuidar das obrigações por você.
            Tem limite, serve só pra isso, e você revoga quando quiser.
          </Aviso>
        </Corpo>

        <Rodape>
          {sociedade && SOCIOS[1].status === "convidar" ? (
            // Antes de assinar, o dono convida o sócio (o consenso vem primeiro).
            <>
              <Button full>Enviar convite pro Bruno</Button>
              <div className="mt-2 flex justify-center">
                <Button variant="ghost">Assinar a minha parte agora</Button>
              </div>
            </>
          ) : (
            <Button full disabled={bronze}>
              {bronze ? "Subir de nível no GOV.BR" : "Assinar no GOV.BR"}
            </Button>
          )}
        </Rodape>
      </main>
    </>
  );
}

/* ─── Uma linha de sócio, com o estado da assinatura dele ──────────────────── */
function SocioLinha({ nome, status }: { nome: string; status: StatusSocio }) {
  // K7: a legenda tem que casar com o botão. Antes "Você: sua vez de assinar"
  // brigava com o CTA primário "Enviar convite pro Bruno" (o consenso vem
  // primeiro, UX-44). Agora a linha do dono espelha o ghost ("pode assinar
  // quando quiser") e a do sócio espelha o primário ("falta convidar").
  const legenda: Record<StatusSocio, string> = {
    voce: "Pode assinar quando quiser",
    convidar: "Falta convidar pra confirmar e assinar",
    aguardando: "Aguardando ele confirmar e assinar",
    assinou: "Assinou",
  };
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-caption font-semibold text-text-primary truncate">
            {nome}
          </p>
          <p className="text-micro text-text-tertiary mt-0.5">{legenda[status]}</p>
        </div>
        {status === "assinou" ? (
          <Check />
        ) : (
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-micro font-semibold ${
              status === "voce"
                ? "bg-surface-tint-brand text-text-primary"
                : "bg-surface-alt text-text-secondary"
            }`}
          >
            {status === "voce" ? "Você" : "Sócio"}
          </span>
        )}
      </div>
    </Card>
  );
}

function Check() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 text-state-success"
      aria-hidden
    >
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path
        d="m7.5 12.4 3.1 3.1 6-6.2"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
