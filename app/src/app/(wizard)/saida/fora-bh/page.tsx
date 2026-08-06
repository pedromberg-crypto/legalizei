"use client";

import { useRouter } from "next/navigation";
import { SaidaView } from "@/components/saida";
import { TelaHeader } from "@/components/ui/tela";
import { DADOS_SAIDA_FORA_BH as D } from "@/lib/dados-saida";

/**
 * A9 · SAÍDA — FORA DE BELO HORIZONTE · 🆕 28/07 (reunião Rua Satélite 9)
 *
 * Nasce do GATE DE CIDADE (N3G), não da triagem do N4. O MLP testa só em
 * Belo Horizonte/MG — nenhum outro município ou estado ainda. Barra ANTES
 * de qualquer outra pergunta (N3, logo depois do fork), junto com o gate.
 *
 * Mesmo template A9 (barra + explica + captura + roteia) das outras saídas —
 * não é falha do cliente, é limite do MLP.
 *
 * 🆕 03/08 — UX-62 mesclado (fonte: /apresentacao): a saída virou lista de
 * espera CLASSIFICADA — pergunta a cidade (`extra`, obrigatório) em vez de só
 * capturar contato, e a confirmação promete só o que a gente cumpre (avisar
 * quando abrir), sem prazo de ligação inventado. "Voltar ao início" é real
 * aqui (não existe conceito de "reiniciar demo" em produção).
 *
 * 🆕 06/08 — o conteúdo (`D`) virou `@/lib/dados-saida` (fonte única com a
 * `/apresentacao`, que reusa este mesmo objeto pra não copiar as 2 telas).
 */

export default function SaidaForaBhPage() {
  const router = useRouter();

  return (
    <>
      <TelaHeader meta="Sobre a sua cidade" />
      <main className="app-main">
        <SaidaView
          d={{
            ...D,
            confirmacao: {
              ...D.confirmacao!,
              acoes: [{ label: "Voltar ao início", variante: "ghost", onClick: () => router.push("/entrada") }],
            },
          }}
        />
      </main>
    </>
  );
}
