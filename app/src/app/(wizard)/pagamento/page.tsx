"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { Campo, Texto } from "@/components/ui/form";
import { CUSTOS, brl } from "@/lib/fiscal";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N9 — PAGAMENTO · arquétipo A1 (Pergunta) · shell WIZARD · 💰 A FRONTEIRA
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: spec-telas-b3-b4-aterrissagem.md → Tela 19 · blocos-fluxo-abertura §B3
 *
 * A última tela do wizard. **A casa (shell do app) nasce depois daqui** — foi
 * a reordenação de 16/07 que dissolveu o velho debate "T18 × T19: onde nasce a
 * casa?". Wizard = N1–N9, fullscreen e sem nav. Portal = N10 em diante.
 *
 * ─── 1. O CPF FAZ DOIS TRABALHOS (decisão travada nº 5) ───────────────────
 * O gateway exige CPF de qualquer jeito. Então: **mesmo campo, dois usos** —
 * cobrança E elegibilidade. Situação cadastral irregular na Receita →
 * **não cobra**, roteia. Resolve "não vender pra quem não pode abrir" sem
 * gastar uma tela a mais.
 *
 * ⚠️ **A copy tem que dizer a diferença.** "CPF suspenso" não é "cartão
 * recusado": um é elegibilidade, o outro é meio de pagamento. Trocar cartão
 * não resolve CPF suspenso, e deixar a pessoa tentar de novo com outro cartão
 * é crueldade com o tempo dela. A persona `cpf-irregular` (Sandra: dígito
 * válido, situação suspensa) é a guarda-corpo — **ela não é cobrada**.
 *
 * ─── 2. BOLETO FICA, MAS FORA DO HAPPY PATH (decisão do Pedro) ────────────
 * Cortar boleto simplificaria o sistema e mataria a pausa P2, mas perde
 * cliente. Mecânica travada:
 *   > boleto gerado aqui → **entra no app assim mesmo** → faz o dossiê inteiro
 *   > (N10–N18) enquanto espera → **N19 e N20 travam** até compensar →
 *   > compensou, destrava.
 * A casa existe, o dossiê não sai sem pagamento, e o dunning (UX-45) puxa de
 * volta com o gancho da economia, não com lembrete seco. Cartão atravessa em
 * 30s e nem percebe que existia uma bifurcação. A persona `knife` cobre isso.
 *
 * ─── 3. "ACELERE SEU PROCESSO" NO CARTÃO ──────────────────────────────────
 * O cartão não é empurrado por ser melhor pra nós: é empurrado porque destrava
 * a abertura na hora. A vantagem declarada é do cliente, e é verdadeira.
 *
 * Gateway = **Asaas** (D2, travado 14/07). Webhook idempotente: nunca cobra
 * nem abre duas vezes.
 * ═══════════════════════════════════════════════════════════════════════════
 */

type Metodo = "cartao" | "pix" | "boleto";

const METODOS: {
  id: Metodo;
  nome: string;
  quando: string;
  /** O que acontece com a ABERTURA, que é o que o cliente quer saber. */
  efeito: string;
}[] = [
  {
    id: "cartao",
    nome: "Cartão de crédito",
    quando: "na hora",
    efeito: "Sua abertura começa hoje mesmo, assim que o pagamento passar.",
  },
  {
    id: "pix",
    nome: "Pix",
    quando: "em minutos",
    efeito: "Sua abertura começa assim que o Pix cair, geralmente em minutos.",
  },
  {
    id: "boleto",
    nome: "Boleto",
    quando: "1 a 3 dias úteis",
    efeito:
      "Você já entra no app e adianta tudo. A abertura em si só começa quando o boleto compensar.",
  },
];

export default function PagamentoPage() {
  const [cpf, setCpf] = useState("");
  const [metodo, setMetodo] = useState<Metodo>("cartao");
  const total = CUSTOS.DAE_JUCEMG + CUSTOS.MENSALIDADE;
  const escolhido = METODOS.find((m) => m.id === metodo)!;

  return (
    <>
      <TelaHeader meta="Pagamento" />

      <main className="app-main">
        <Titulo sub={`${brl(total, true)} hoje, e depois ${brl(CUSTOS.MENSALIDADE)} por mês.`}>
          Falta só isso
        </Titulo>

        <Corpo>
          {/* ───── CPF: cobrança + elegibilidade no mesmo campo ───── */}
          <Campo
            rotulo="Seu CPF"
            dica="A gente confere na Receita se ele está regular pra abrir empresa."
          >
            <Texto
              valor={cpf}
              onChange={setCpf}
              inputMode="numeric"
              maxLength={14}
              placeholder="000.000.000-00"
            />
          </Campo>

          {/* ───── MÉTODO ───── */}
          <div>
            <p className="text-caption font-semibold text-text-primary mb-2">
              Como você prefere pagar
            </p>
            <div className="flex flex-col gap-2">
              {METODOS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMetodo(m.id)}
                  aria-pressed={metodo === m.id}
                  className={`flex min-h-12 items-center justify-between gap-3 rounded-md border p-4 text-left transition-colors ${
                    metodo === m.id
                      ? "border-border-focus bg-surface-tint-brand"
                      : "border-border-hairline bg-surface-card hover:bg-surface-alt"
                  }`}
                >
                  <span className="text-body font-semibold text-text-primary">
                    {m.nome}
                  </span>
                  <span className="text-caption text-text-secondary">
                    cai {m.quando}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ───── O EFEITO DA ESCOLHA, EM TEMPO REAL ─────
              O cliente não escolhe "meio de pagamento", escolhe QUANDO a
              empresa dele começa a existir. A tela fala nesses termos. */}
          <Aviso
            variante={metodo === "boleto" ? "warning" : "success"}
            titulo={
              metodo === "boleto"
                ? "Com boleto, a abertura espera o pagamento"
                : "Acelere seu processo"
            }
          >
            {escolhido.efeito}
          </Aviso>

          {/* ───── IDEMPOTÊNCIA VISÍVEL (UX-38) ─────
              O motor já é idempotente na retomada; aqui a UI finalmente
              comunica isso. Mata o medo de quem paga e some. */}
          <p className="text-micro text-text-tertiary">
            Seu progresso fica salvo. A gente nunca cobra duas vezes nem abre a
            mesma empresa duas vezes, mesmo que você feche o app agora.
          </p>
        </Corpo>

        <Rodape>
          <Button full>Pagar {brl(total, true)}</Button>
        </Rodape>
      </main>
    </>
  );
}
