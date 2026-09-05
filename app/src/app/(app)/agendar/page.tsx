"use client";

import { useRouter, useSearchParams } from "next/navigation";
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
  /* 🆕 04/09 — `?agendado=` presente = a pessoa veio REMARCAR, não marcar a
     primeira vez. Muda só o voltar: ela precisa poder desistir e reencontrar o
     horário que já tinha, em vez de cair num status sem agendamento (que leria
     como cancelamento acidental). */
  const atual = useSearchParams().get("agendado");
  const status = `/aguardando?fase=junta&guia=paga&rota=assistida${
    atual ? `&agendado=${encodeURIComponent(atual)}` : ""
  }`;

  return (
    <AgendarAssinaturaView
      onVoltar={() => router.push(status)}
      /* 🚧 Mock (RF-01): sem estado real entre telas, o compromisso volta pelo
         querystring — em PARTES (dia, semana, mês, hora), porque o cartão do
         status desenha um bloco de data e não uma frase. `agendado` continua
         indo junto: hero, CTA e mensagem de WhatsApp precisam dele numa linha
         só. No produto real isso tudo vem do servidor. */
      onConfirmar={(c) =>
        router.push(
          "/aguardando?fase=junta&guia=paga&rota=assistida" +
            `&agendado=${encodeURIComponent(c.frase)}` +
            `&dia=${c.numero}&semana=${encodeURIComponent(c.semana)}` +
            `&mes=${encodeURIComponent(c.mes)}&hora=${encodeURIComponent(c.hora)}` +
            (c.hoje ? "&hoje=1" : ""),
        )
      }
    />
  );
}
