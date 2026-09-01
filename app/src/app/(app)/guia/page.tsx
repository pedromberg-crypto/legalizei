"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PagamentoView } from "@/components/wizard-dinheiro";
import { CLIENTE } from "@/app/(app)/dossie/mock";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * A3.P — PAGAMENTO DA GUIA DA JUNTA (DAE) · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 01/09 (pedido do Pedro) — tela NOVA, mas não componente novo: é o MESMO
 * `PagamentoView` do E9, no modo `guia`. Muda o valor (a taxa da Junta, não a
 * mensalidade), a copy e o aceite; CPF, métodos, efeito da escolha e a linha
 * de idempotência são idênticos de propósito — pagar duas coisas em momentos
 * diferentes já é confuso o bastante sem duas gramáticas visuais.
 *
 * ─── DE ONDE SE CHEGA AQUI ────────────────────────────────────────────────
 * Do CTA que abre embaixo do passo "Pague a guia da Junta (DAE)" na tela de
 * status (A3, `/aguardando?fase=junta`). Não é passo de wizard: é ação
 * pontual de uma etapa que está esperando o cliente.
 *
 * ─── POR QUE O ACEITE MORA AQUI ───────────────────────────────────────────
 * Ele estava na A1 (que tinha absorvido a A2 mais cedo hoje). É neste clique
 * que a taxa vira gasto irreversível — na A1 a frase "a taxa já paga não é
 * reembolsável" ficava descolada do gesto, porque o pagamento acontecia
 * depois, em outra tela.
 *
 * 🚧 Mock: pagar volta pro status com a etapa da guia concluída. No app real
 * é webhook do provedor que muda o estado (RF-01).
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function GuiaPage() {
  const router = useRouter();
  const [cpf, setCpf] = useState("");
  const [metodo, setMetodo] = useState<"cartao" | "pix" | "boleto">("cartao");
  const [aceito, setAceito] = useState(false);

  return (
    <PagamentoView
      guia
      cpf={cpf}
      setCpf={setCpf}
      cpfCadastrado={CLIENTE.cpf}
      metodo={metodo}
      setMetodo={setMetodo}
      aceito={aceito}
      setAceito={setAceito}
      onVoltar={() => router.push("/aguardando?fase=junta")}
      /**
       * 🆕 01/09 (pedido do Pedro) — as 2 variantes de splash, iguais às do
       * E9: boleto vê "Boleto gerado" e volta pro status com a etapa da guia
       * AGUARDANDO COMPENSAÇÃO; cartão/Pix veem "Pagamento confirmado" e
       * voltam com a etapa fechada. O splash é o mesmo componente das duas
       * rotas já existentes — só o `next` muda.
       */
      onPagar={() =>
        router.push(
          metodo === "boleto"
            ? "/splash-boleto?next=" + encodeURIComponent("/aguardando?fase=junta&guia=boleto")
            : "/splash-pagamento?next=" + encodeURIComponent("/aguardando?fase=junta&guia=paga"),
        )
      }
    />
  );
}
