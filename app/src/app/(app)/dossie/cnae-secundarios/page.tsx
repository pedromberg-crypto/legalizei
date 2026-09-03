"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CnaeSecundariosView } from "@/components/wizard-dossie";
import { ehMei, comRegime } from "@/lib/regime";
import { passoDoAjuste } from "@/lib/ajuste";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N14 — CNAE SECUNDÁRIOS · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-dossie.tsx` (`CnaeSecundariosView`)
 * desde 29/07. Esta page é o wrapper: liga a navegação.
 *
 * Spec: spec-telas-entrada-b1-b2.md → Tela 10 (2.5) · mapa T10→N14
 * Motor: b2.coleta (cnae secundários)
 *
 * ─── REGRA ESTRUTURAL (decisão do Pedro, 2026-07-21; revisada 24/08) ─────
 * As SUGESTÕES curadas continuam **mesmo-imposto** que a principal: mesmo
 * Anexo do Simples + mesma dependência de Fator R. Incluir uma sugestão
 * curada NUNCA muda o que o cliente paga.
 *
 * 🆕 24/08 (reunião Leonan 19/08) — a BUSCA abre além da lista curada: a
 * pessoa pode procurar qualquer atividade que a gente ATENDE (restrito à
 * mesma lista da entrevista principal), mesmo que mude o enquadramento. Nesse
 * caso a tela avisa e troca "Continuar" por "Falar com atendente" — a gente
 * não deixa a pessoa mudar o próprio imposto sozinha, sem saber, mas também
 * não esconde a opção dela existir (era essa a queixa original da Jéssica,
 * 19/07: só a busca livre é o suficiente, o enquadramento é resolvido com
 * aviso + humano, não com uma 2ª lista escondida).
 *
 * ─── DE ONDE SAEM AS SUGESTÕES ───────────────────────────────────────────
 * No app real: dataset de CNAE filtrado por `anexo == principal.anexo` E
 * `fator_r == principal.fator_r` (contabilizei-cnae-completo.json + ratificação
 * Larissa). Aqui o mock usa exatamente as **vizinhas já vetadas como
 * `mesmo-imposto` no N4** (gate `vizinhas`), pra não inventar equivalência
 * fiscal: 6202 / 6203 / 6204 / 7410. Publicidade (7311) e hospedagem (6311)
 * ficaram DE FORA de propósito — plausíveis, mas não vetadas como mesmo-anexo.
 *
 * 🚧 IA dublada: a lista e o "comum como secundário" são mock. A regra do
 * filtro (mesmo-imposto) é que é definitiva. O CNAE principal vem de
 * `../mock` (fonte única do dossiê).
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function CnaeSecundariosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mei = ehMei(searchParams);

  // 🔄 28/08 (pedido do Pedro) — moveu de lugar: antes vinha depois de "Dados
  // da empresa" (C4), agora vem logo depois da atividade principal (C0), na
  // sequência natural de quem acabou de escolher o CNAE. Segue pro C1 (Seus
  // dados), não mais pro C6. 🆕 03/08 — MEI nunca chega aqui (a M-O já
  // resolve secundárias junto da principal), mas o ramo fica pra
  // deep-link/segurança.
  /**
   * 🆕 01/09 — MODO AJUSTE: quando a pessoa entra por "Ajustar" na tela
   * de status, a navegação fica presa ao bloco e a última tela dele troca
   * o CTA por "Atualizar dados", voltando pro status. Ausente = wizard
   * normal, com o destino de sempre.
   */
  const ajuste = passoDoAjuste(searchParams, "/dossie/cnae-secundarios");

  return (
    <CnaeSecundariosView
      onVoltar={() => router.push(comRegime("/dossie/atividade", mei))}
      /* 🐛 02/09 — a tela não tinha seta de voltar: o `TelaHeader` renderiza
         só o texto quando ninguém passa `onVoltar`, e quem entrava aqui só
         saía seguindo. Terceira vez da mesma família (gate 29/08, C0 hoje).
         Daqui volta pra C0, levando as flags. No modo ajuste a navegação fica
         presa ao bloco, então o voltar respeita o mesmo destino do CTA. */
      /* 🆕 02/09 (pedido do Pedro) — FECHO DE BLOCO. Sair daqui passa por
         um splash curto que fecha o assunto ATIVIDADE (principal +
         secundárias) antes dos dados pessoais. No modo ajuste não: quem veio
         corrigir um bloco volta pro status, e comemorar ali seria fora de
         hora. */
      onSeguir={() => {
        if (ajuste) {
          router.push(ajuste.destino);
          return;
        }
        const destino = comRegime(mei ? "/dossie/nome" : "/dossie/socio", mei);
        router.push(`/splash-atividades?next=${encodeURIComponent(destino)}`);
      }}
      ctaLabel={ajuste?.label}
      // 🆕 24/08 (reunião Leonan 19/08) — secundária de busca pode mudar o
      // enquadramento; mesma rota de "atendido pelo Mauro" que o resto do
      // produto usa quando precisa de um humano no meio.
      onFalarAtendente={() => router.push("/veredito/nao-atende")}
    />
  );
}
