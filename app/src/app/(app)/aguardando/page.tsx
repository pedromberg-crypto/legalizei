"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AguardandoView } from "@/components/wizard-cauda";
import { ehMei, comRegime } from "@/lib/regime";
import { ehEnderecoFiscal, comEndereco } from "@/lib/endereco";
import { categoriaDe, comCategoria } from "@/lib/categoria";
import { TEM_SOCIO } from "@/app/(app)/dossie/mock";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * P2 — AGUARDANDO O BOLETO · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-cauda.tsx` (`AguardandoView`) desde
 * 29/07. Esta page é o wrapper: liga a navegação (antes o CTA não ia pra
 * lugar nenhum).
 *
 * Spec: spec-telas-b3-b4-aterrissagem.md → T19 (dunning) · UX-45 · UX-38.
 * Persona-guarda: `knife` (paga por boleto e some por 3 dias).
 *
 * ─── ESTA TELA EXISTE PORQUE O BOLETO FICOU (decisão do Pedro) ────────────
 * `N9 --boleto--> P2 --> N10`. ⚠️ 29/07: o `/pagamento` de produção não
 * respeitava essa aresta (ia sempre direto pro dossiê, até por boleto);
 * corrigido junto com esta extração.
 *
 * 🔴 30/08 (pedido do Pedro) — REVOGADO "cartão/Pix pulam direto pro N10". No
 * caminho ME, todo método passa por aqui agora: boleto chega direto
 * (pendente), cartão/Pix chegam via `/splash-pagamento` com `?pago=1` (prop
 * `pago`, ver `AguardandoView`). MEI segue com o comportamento antigo por
 * ora (fora do escopo desta rodada).
 *
 * 🆕 04/08 — `?regime=mei` corrige o valor do boleto (sem DAE, mensalidade
 * própria) e repassa o regime adiante pro dossiê.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function AguardandoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mei = ehMei(searchParams);
  const enderecoFiscal = ehEnderecoFiscal(searchParams);
  const categoria = categoriaDe(searchParams);
  // 🆕 30/08 — E9.1P do mapa: quem pagou por método instantâneo (cartão/Pix)
  // chega aqui vindo do splash "pagamento confirmado" (`/splash-pagamento`),
  // com `?pago=1`. Boleto continua sem o flag (pendente, comportamento de
  // sempre).
  const pago = searchParams.get("pago") === "1";

  return (
    <AguardandoView
      mei={mei}
      temSocios={TEM_SOCIO}
      pago={pago}
      // 🔄 27/08 — a 1ª tela do dossiê virou a C0 (`/dossie/atividade`), não
      // mais o C1. Mesma mudança do `/pagamento` (racional lá).
      // 🐛 28/08 — faltava o ramo MEI: ia sempre pra C0 (ME), mesmo quando
      // `mei=true`. MEI não usa a C0 (não aceita CNAE livre) — vai pra M-O
      // (`/dossie/ocupacao`), mesmo destino que `/pagamento` já usa.
      onSeguir={() =>
        router.push(
          comCategoria(
            comEndereco(
              comRegime(mei ? "/dossie/ocupacao" : "/dossie/atividade", mei),
              enderecoFiscal,
            ),
            categoria,
          ),
        )
      }
    />
  );
}
