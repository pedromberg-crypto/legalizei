"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ContaView, type DadosConta } from "@/components/wizard-dinheiro";
import { ehMei, comRegime } from "@/lib/regime";
import { ehEnderecoFiscal, comEndereco } from "@/lib/endereco";
import { categoriaDe, comCategoria } from "@/lib/categoria";
import { CLIENTE } from "@/app/(app)/dossie/mock";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N6 — CRIAR CONTA · rota de produção (shell WIZARD, ainda não pagou)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-dinheiro.tsx` (`ContaView`) desde
 * 29/07 — mesma extração de `EntradaView`/`gate-telas`. Esta page é o wrapper:
 * guarda o estado do formulário e liga a navegação real. A `/apresentacao`
 * consome o MESMO componente, então a demo não pode divergir da tela aprovada.
 *
 * Spec: spec-telas-entrada-b1-b2.md → Tela 5 · mapa T5→N6
 *
 * ─── ⚠️ FRONT-LOAD DE DADOS PESSOAIS (28/07, reunião Rua Satélite 9) ────────
 * Nome completo, CPF, telefone e endereço migraram PRA CÁ — antes só viviam no
 * N10 (pós-pagamento). Captar tudo num lugar só, com validação obrigatória por
 * e-mail/SMS logo na entrada. O N10 deixa de coletar do zero e vira tela de
 * CONFIRMAÇÃO do que já veio daqui.
 *
 * ─── 🔴 O AVISO DO GOV.BR SAIU DAQUI (19/07) — e por quê ──────────────────
 * A tela nasceu com um bloco avisando que a assinatura no N23 exige conta
 * GOV.BR prata/ouro. Foi REMOVIDO:
 *   · Jargão puro ("prata", "ouro", "bronze") numa tela cujo único trabalho é
 *     pegar um e-mail. UX-48 manda zero jargão.
 *   · **Informava um problema sem deixar resolver.** Sem botão, sem link, sem
 *     verificação. Aviso que não age é só ansiedade.
 *   · **Contradizia o posicionamento.** O N2 promete "a parte chata é com a
 *     gente"; três telas depois, antes de pagar, a primeira entrega concreta
 *     era uma tarefa de governo pro cliente fazer sozinho.
 *
 * ❌ **Descartado: GOV.BR como provedor de login** — o Login Único não se abre
 * pra empresa privada (decisão do Pedro 19/07).
 * ✅ **Plano B:** o GOV.BR vira **tarefa acionável no painel (N21)**, com
 * estado, link direto e notificação. 🚧 O N21 ainda não existe — este parágrafo
 * é o que impede a UX-29 de sumir no caminho.
 *
 * **UX-48 — a coorte é DADO PURO, não bifurcação.** "É a primeira empresa que
 * você abre?" não muda nada no que vem depois: as duas respostas veem as mesmas
 * telas, na mesma ordem. A tag só alimenta a análise, pra decidir COM DADO,
 * depois, se vale bifurcar ritmo. Por isso é **pulável sem custo**.
 * ⚠️ Nunca rotular a pessoa: "modo leigo" é proibido em copy.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function ContaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mei = ehMei(searchParams);
  const enderecoFiscal = ehEnderecoFiscal(searchParams);
  // 🆕 27/08 — a categoria escolhida no E3.3 precisa sobreviver até a C0
  // (`/dossie/atividade`, pós-pagamento), que é quem a consome de verdade.
  const categoria = categoriaDe(searchParams);
  const [etapa, setEtapa] = useState<"form" | "codigo">("form");
  /**
   * 🚧 27/08 — nome/e-mail/telefone vêm PRÉ-PREENCHIDOS do E3.1 (`/dados`).
   * Como não existe estado real entre telas (RF-01, dívida do projeto inteiro)
   * e dado pessoal não pode viajar por querystring, a page usa o mock `CLIENTE`
   * — exatamente a mesma doutrina que o C1 (`/dossie/socio`) já usa pra
   * "confirmar o que veio do E6". Quando o estado real existir, os 3 campos
   * passam a vir de lá e este mock morre junto com `dossie/mock.ts`.
   */
  const [dados, setDados] = useState<DadosConta>({
    nome: CLIENTE.nome,
    cpf: "",
    telefone: CLIENTE.telefone,
    email: "ana.beatriz@gmail.com",
    senha: "",
    cep: "",
    numero: "",
    coorte: null,
    codigo: "",
  });

  return (
    <ContaView
      d={dados}
      set={(k, v) => setDados((p) => ({ ...p, [k]: v }))}
      etapa={etapa}
      onCriarConta={() => setEtapa("codigo")}
      onConfirmar={() =>
        router.push(
          comCategoria(comEndereco(comRegime("/plano", mei), enderecoFiscal), categoria),
        )
      }
      // 🆕 03/08 — UX-71 mesclado (painel escuro + folha sobreposta + login
      // social). UX-73 (coorte obrigatória) NÃO veio junto — decisão em
      // aberto, ver comentário em `ContaPainel`. Fonte: /apresentacao.
      layout="painel"
      // 🆕 27/08 — a tela deixou de coletar identidade (já veio do E3.1/E3.3):
      // agora só pede senha e CPF, com recap read-only do que já temos.
      mei={mei}
      leadJaCaptado
    />
  );
}
