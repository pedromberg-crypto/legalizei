"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PagamentoView, type Metodo } from "@/components/wizard-dinheiro";
import { ehMei, comRegime } from "@/lib/regime";
import { ehEnderecoFiscal, comEndereco } from "@/lib/endereco";
import { categoriaDe, comCategoria } from "@/lib/categoria";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N9 — PAGAMENTO · rota de produção · 💰 A FRONTEIRA
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-dinheiro.tsx` (`PagamentoView`) desde
 * 29/07. Esta page é o wrapper: estado do formulário + navegação.
 *
 * Spec: spec-telas-b3-b4-aterrissagem.md → Tela 19 · blocos-fluxo-abertura §B3
 *
 * A última tela do wizard. **A casa (shell do app) nasce depois daqui** — a
 * reordenação de 16/07 dissolveu o velho debate "T18 × T19: onde nasce a
 * casa?". Wizard = N1–N9, fullscreen e sem nav. Portal = N10 em diante.
 *
 * ─── 1. O CPF FAZ DOIS TRABALHOS (decisão travada nº 5) ───────────────────
 * O gateway exige CPF de qualquer jeito. Então: **mesmo campo, dois usos** —
 * cobrança E elegibilidade. Situação irregular na Receita → **não cobra**,
 * roteia. Resolve "não vender pra quem não pode abrir" sem gastar uma tela.
 * ⚠️ **A copy tem que dizer a diferença.** "CPF suspenso" não é "cartão
 * recusado": trocar de cartão não resolve CPF suspenso, e deixar tentar de novo
 * é crueldade com o tempo da pessoa. A persona `cpf-irregular` (Sandra: dígito
 * válido, situação suspensa) é o guarda-corpo — **ela não é cobrada**.
 *
 * ─── 2. BOLETO FICA, MAS FORA DO HAPPY PATH (decisão do Pedro) ────────────
 * Cortar boleto simplificaria e mataria a pausa P2, mas perde cliente:
 *   > boleto gerado aqui → **entra no app assim mesmo** (P2, `/aguardando`) →
 *   > faz o dossiê inteiro (N10–N16) enquanto espera → **N19 e N20 travam**
 *   > até compensar.
 * A casa existe, o dossiê não sai sem pagamento, e o dunning (UX-45) puxa de
 * volta com o gancho da economia, não com lembrete seco.
 *
 * 🐛 29/07 — O `onPagar` MANDAVA TODO MUNDO DIRETO PRO DOSSIÊ, inclusive quem
 * pagou boleto. A P2 existia como rota isolada, sem ninguém apontando pra ela
 * — a aresta `N9 --boleto--> P2` do mapa nunca tinha sido implementada de
 * verdade. Corrigido: `metodo === "boleto"` vai pra `/aguardando` primeiro.
 *
 * ─── 3. POR QUE O CARTÃO GANHA DESTAQUE ───────────────────────────────────
 * O cartão não é empurrado por ser melhor pra nós: é empurrado porque destrava
 * a abertura na hora. A vantagem declarada é do cliente, e é verdadeira.
 * ⚠️ 29/07 — a DECISÃO segue esta; só a redação mudou. O título do aviso era
 * **"Acelere seu processo"**, imperativo de varejo numa tela onde não há mais
 * nada a vender, e o texto repetia a pill do botão. Agora o título afirma o
 * fato ("Sua abertura começa hoje") e a pill e o aviso falam de coisas
 * diferentes: quando o DINHEIRO cai × o que acontece com a EMPRESA (UX-77).
 *
 * Gateway = **Asaas** (D2, travado 14/07). Webhook idempotente: nunca cobra
 * nem abre duas vezes.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function PagamentoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  /**
   * 30/07 — `?fluxo=migrar` reusa esta tela no FLOW #2. A tela é a mesma (CPF,
   * método, idempotência); o que muda é que não há taxa de governo a somar e o
   * aviso fala de migração. Depois de pagar, o destino é o M4 (TTRT), não o
   * dossiê.
   */
  const fluxo = searchParams.get("fluxo") === "migrar" ? "migrar" : "abertura";
  const mei = ehMei(searchParams);
  const enderecoFiscal = ehEnderecoFiscal(searchParams);
  const categoria = categoriaDe(searchParams);
  const [cpf, setCpf] = useState("");
  const [metodo, setMetodo] = useState<Metodo>("cartao");

  /**
   * 🔴 06/08 — M4a (auditoria de passivo) foi RETIRADA: a gente não sai
   * buscando pendência do contador anterior antes de assumir (vira serviço à
   * parte, sob demanda, só depois de ativo). MEI nunca tem TTRT (ver
   * `MigrarDiagnosticoView`) — com ou sem certificado, vai direto pra M5. Só
   * ME segue pro M3c (dados do contador atual, novo 06/08) e depois pro M4
   * (transferência/TTRT).
   *
   * 🐛 06/08 — pra ME, agora repassa o `qs` inteiro (não só `comRegime`), pra
   * não perder o `?certificado=` que o M2 grava na URL. Antes ele se perdia
   * aqui e o M4b nunca sabia se precisava emitir certificado no meio do
   * pipeline — bug latente, achado ao encaixar o M3c nesta mesma cadeia.
   */
  function destino() {
    if (fluxo === "migrar") {
      if (mei) return comRegime("/migrar/ativa", mei);
      const qs = searchParams.toString();
      return qs ? `/migrar/contador?${qs}` : "/migrar/contador";
    }
    // 🔄 27/08 — a 1ª tela do dossiê deixou de ser o C1 (`/dossie/socio`) e
    // passou a ser a **C0** (`/dossie/atividade`): descrever a atividade e
    // achar o CNAE atravessou o pagamento na reordenação do flow de entrada.
    // Pôde atravessar porque o gate de elegibilidade virou a CATEGORIA (E3.3),
    // que só oferece o que a gente atende — então o veredito lá na frente não
    // pode mais devolver "não atendemos". A categoria viaja junto (`?cat=`)
    // porque é ela que pré-seleciona a pill e prova que o gate rodou.
    return comCategoria(
      comEndereco(
        comRegime(metodo === "boleto" ? "/aguardando" : "/dossie/atividade", mei),
        enderecoFiscal,
      ),
      categoria,
    );
  }

  return (
    <PagamentoView
      cpf={cpf}
      setCpf={setCpf}
      metodo={metodo}
      setMetodo={setMetodo}
      fluxo={fluxo}
      semTaxaJunta={mei}
      onPagar={() => router.push(destino())}
    />
  );
}
