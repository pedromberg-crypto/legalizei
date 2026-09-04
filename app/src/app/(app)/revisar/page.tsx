"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { RevisarView } from "@/components/wizard-cauda";
import { ehMei, comRegime } from "@/lib/regime";
import { ehEnderecoFiscal, comEndereco } from "@/lib/endereco";
import { comAjuste } from "@/lib/ajuste";
import { BLOCOS } from "@/lib/passos";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N19 — REVISAR O DOSSIÊ · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-cauda.tsx` (`RevisarView`) desde 29/07 —
 * fidelidade por construção, mesma regra do B3/B4. Esta page é o wrapper: liga
 * a navegação (antes não ia pra lugar nenhum).
 *
 * Spec: execucao/spec-telas-b3-b4-aterrissagem.md → Tela 20 · vem depois do
 * N16, antes do N20 irreversível.
 *
 * ─── POR QUE ESTA TELA EXISTE ───────────────────────────────────────────────
 * O N20 é IRREVERSÍVEL. Ninguém deve cruzar essa porta sem ver, num lugar só,
 * tudo que a gente vai registrar na Junta com o nome dele. É LEITURA, não
 * formulário: cada bloco tem um "ajustar" (mock) que voltaria pro passo de
 * origem sem re-andar o flow inteiro.
 *
 * ⚠️ 29/07 — a identidade (nome, CNAE, secundárias) passou a vir de
 * `dossie/mock.ts`: o mock antigo local tinha um CNAE com um dígito diferente
 * do travado no Encaixe e secundárias que o N14 nunca ofereceu.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function RevisarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mei = ehMei(searchParams);
  /**
   * 🆕 03/09 — quem escolheu o endereço fiscal da Legalizai no E3.4 não passa
   * pelo C4, então não tem IPTU nem resposta de imóvel pra conferir. O flag
   * atravessa o flow pela querystring (`lib/endereco.ts`), igual ao regime.
   */
  const enderecoFiscal = ehEnderecoFiscal(searchParams);

  /**
   * 🔄 01/09 (decisão do Pedro) — ia pro `/termo` (A2). A tela A2 foi
   * ELIMINADA: existia só pra reforçar que a taxa da Junta não volta, o que
   * já está no contrato aceito no pagamento (E9). O aceite virou o último
   * bloco DESTA tela, com o detalhe em popup — então daqui vai direto pro
   * status da Junta, que é o que a A2 fazia depois do aceite.
   */
  /**
   * 🔄 01/09 (pedido do Pedro) — entre o A1 e o status entra a tela do PONTO
   * SEM VOLTA (`/iniciar-viabilidade`): antes dela dá pra corrigir qualquer
   * bloco, depois dela mudar dado significa cancelar e refazer na Junta. O
   * aceite já existe no contrato, mas contrato ninguém lê — uma tela inteira
   * com CTA próprio é o que transforma a cláusula em momento.
   */
  return (
    <RevisarView
      /* 🐛 02/09 (levantamento C3→A1) — a tela não tinha seta: o
         `TelaHeader` renderiza só o texto quando ninguém passa `onVoltar`, e a
         página não passava. Regra 6 do CLAUDE.md. */
      onVoltar={() => router.push(comEndereco(comRegime("/dossie/nome", mei), enderecoFiscal))}
      mei={mei}
      enderecoFiscal={enderecoFiscal}
      /**
       * 🆕 03/09 (pedido do Pedro) — a pill "Ajustar" de cada seção entra no
       * MODO AJUSTE (01/09): abre a 1ª tela do bloco com `?ajuste=<id>`, e o
       * CTA da última tela do bloco vira "Atualizar dados".
       *
       * 🟡 Detalhe que fica registrado: o modo ajuste sempre termina no
       * STATUS (`ROTA_STATUS`, `/aguardando`), não aqui — ele nasceu pra ser
       * usado a partir de lá. Quem sai do A1 pra corrigir volta pro status,
       * não pro A1. Se isso incomodar no teste, o ajuste precisa saber de
       * onde veio (um `?volta=`), que é mudança na `lib/ajuste.ts`.
       */
      onAjustar={(blocoId) => {
        const bloco = BLOCOS.find((b) => b.id === blocoId);
        if (!bloco) return;
        router.push(
          comEndereco(comRegime(comAjuste(bloco.telas[0], bloco.id), mei), enderecoFiscal),
        );
      }}
      onSeguir={() =>
        router.push(comEndereco(comRegime("/iniciar-viabilidade", mei), enderecoFiscal))
      }
    />
  );
}
