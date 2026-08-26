"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MigrarTransferenciaView } from "@/components/wizard-migrar";
import { ehMei, comRegime } from "@/lib/regime";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M4b — A TRANSFERÊNCIA · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-migrar.tsx` (`MigrarTransferenciaView`),
 * que reusa o `PainelView` (parametrizado em 30/07) — mesma máquina de 4 estados
 * do N21, outro pipeline. Motor: `flow-migrar.js` → m4.distrato · m4.ttrt ·
 * m4.evento232 · m4.procuracao.
 *
 * 🔴 **A PAUSA MAIS PERIGOSA DO PRODUTO INTEIRO MORA AQUI.**
 * O TTRT (Termo de Transferência de Responsabilidade Técnica) é aberto pelo
 * contador NOVO no portal do CRC-MG e **validado pelo ANTIGO**. Todas as pausas
 * do flow #1 esperam um órgão (neutro) ou o próprio cliente. Esta espera um
 * **concorrente que está perdendo o cliente pra nós** — ou seja, um terceiro com
 * interesse contrário ao desfecho.
 *
 * `?estado=travado` é a persona `migra-refem`: o contador antigo não validou.
 * A tela ASSUME o problema ("a gente assumiu esse problema") em vez de repassar
 * a culpa ou deixar o cliente no limbo — é a contrapartida de UX da decisão de
 * cobrar antes do TTRT (30/07).
 *
 * 🟡 Os códigos oficiais (resolução CFC, Evento 232 do Redesim) ficam FORA da
 * tela: são pendência D, não ratificados em fonte primária. A copy fala em
 * linguagem de gente, e o cliente não precisa deles de qualquer jeito.
 *
 * 🔴 06/08 — como esta rota é só do caminho ME (MEI nunca chega aqui, ver
 * `/pagamento`), o `?certificado=nao` vindo do M2 vira um passo a mais no
 * pipeline: "Emitindo seu certificado digital".
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function MigrarTransferenciaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const travado = searchParams.get("estado") === "travado";
  const mei = ehMei(searchParams);
  const certificadoPendente = searchParams.get("certificado") === "nao";

  return (
    <MigrarTransferenciaView
      travado={travado}
      certificadoPendente={certificadoPendente}
      onSeguir={() => router.push(comRegime("/migrar/ativa", mei))}
      // 🐛 24/08 — `onAcaoTravado` faltava: "Falar com quem está cuidando"
      // (persona `migra-refem`) não ia pra lugar nenhum.
      onAcaoTravado={() => router.push("/veredito/nao-atende")}
    />
  );
}
