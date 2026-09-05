"use client";

import { useRouter } from "next/navigation";
import { AgendarAssinaturaView } from "@/components/wizard-cauda";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * A3.H1 — MARCAR A ASSINATURA COM A CONSULTORA · rota de produção
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-cauda.tsx` (`AgendarAssinaturaView`).
 * Esta page é o wrapper: liga a navegação real.
 *
 * 🆕 04/09 (decisão do Pedro) — A ROTA ASSISTIDA.
 *
 * No lançamento, o app conduz sozinho até a guia da Junta ser paga (A3′). Da
 * assinatura em diante quem assume é uma consultora nossa, por WhatsApp: é a
 * faixa do processo com CAPTCHA, 2FA, nível de conta GOV.BR que a gente não
 * consegue ler, código que expira em 10 minutos e o contador assinando junto
 * na segunda. O racional completo do corte está em `components/consultor.tsx`.
 *
 * ─── POR QUE AGENDAR EM VEZ DE "FALE CONOSCO" ─────────────────────────────
 * A assinatura precisa de SINCRONIA (o código vale 10 minutos, os dois têm que
 * estar juntos). "Manda mensagem e espera" quebra dos dois lados: a pessoa não
 * sabe quando vem, e a consultora liga no vazio. Marcar hora resolve os dois.
 *
 * O volta daqui é o STATUS — a mesma tela de onde ela veio, que segue sendo a
 * fonte de verdade da jornada mesmo com o WhatsApp no meio.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function AgendarPage() {
  const router = useRouter();

  return (
    <AgendarAssinaturaView
      onVoltar={() => router.push("/aguardando?fase=junta&guia=paga&rota=assistida")}
      /* 🚧 Mock (RF-01): sem estado real entre telas, o horário volta pelo
         querystring. No produto real ele vem da agenda da consultora, e o
         status lê do servidor. */
      onConfirmar={(quando) =>
        router.push(
          `/aguardando?fase=junta&guia=paga&rota=assistida&agendado=${encodeURIComponent(quando)}`,
        )
      }
    />
  );
}
