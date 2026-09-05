"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AssinaturaView } from "@/components/wizard-cauda";
import { ehMei } from "@/lib/regime";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N22 — ASSINATURA DOS SÓCIOS (GOV.BR + e-CAC, N23 dobrado) · rota de produção
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-cauda.tsx` (`AssinaturaView`) desde
 * 29/07. Esta page é o wrapper: liga a navegação (antes nenhum CTA ia pra
 * lugar nenhum).
 *
 * Spec: spec-telas-b3-b4-aterrissagem.md → Tela 21 (convite/consenso) + 22
 * (assinatura GOV.BR). 🗑️ 04/09 — o motor b7 (govbr-bronze) não se aplica
 * mais: sem acesso à conta GOV.BR do cliente, não há nível pra detectar.
 *
 * ⚠️ Sem estado real de consenso multi-sócio (mock pra farol) — ver nota na
 * View. Qualquer CTA habilitado avança.
 *
 * ⚠️ 29/07 — SWAP VALIDADO PELO PEDRO: depois da assinatura vem o **P0 — a
 * home de ativação de dia-1 (`/home-dia1`)**, não mais o N24 direto.
 *
 * Autocrítica registrada: a 1ª versão deste swap apontou pro `/certificado`
 * (um gate isolado que TAMBÉM existe e também é chamado de "P0" num doc mais
 * antigo — `matriz-portal-interno.md`). O Pedro corrigiu com o print da tela
 * real: é a home de ativação (trilha "1 de 3", certificado como item "agora"
 * dela, não gate à parte) que ele já tinha validado como o próximo passo. O
 * N24 (`/ativa`) continua existindo, só deixou de ser o passo seguinte a este.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function AssinaturaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mei = ehMei(searchParams);

  // 🆕 03/08 — regime PARA aqui de propósito: A5 (home dia-1) e o Portal são
  // iguais pros dois caminhos, escopo desta rodada não foi até lá.
  // 🆕 24/08 (reunião Leonan) — código GOV expirado/sem tentativas escala
  // pra atendimento humano em vez de travar sozinho.
  return (
    <AssinaturaView
      mei={mei}
      /* 🐛 04/09 (auditoria da leva A4) — a tela nascia SEM SETA: a página não
         passava `onVoltar` e o aviso do `TelaHeader` disparava no console. 6ª
         ocorrência do mesmo furo (gate 29/08, C0, C5, C2, C1 e agora A4).
         Destino: o status da abertura, que é de onde ela veio pelo "Ir para a
         assinatura". */
      onVoltar={() => router.push("/aguardando?fase=junta&guia=paga")}
      /* 🗑️ 04/09 (Pedro) — a rota `?nivel=bronze` SAIU junto com a detecção
         de nível: a gente não tem acesso à conta GOV.BR da pessoa, então não
         existe estado "bronze" pra deep-linkar. O requisito virou aviso fixo
         na tela, sem afirmar em que nível ela está. */
      /* 🆕 04/09 (pedido do Pedro) — deep-link do código (nó A4.1 do mapa): a
         tela existia só como sub-estado desta, invisível na fita e na prévia. */
      faseInicial={searchParams.get("etapa") === "codigo" ? "codigo" : "assinar"}
      /* 🆕 04/09 (Pedro) — A4″: a SEGUNDA assinatura (`?rodada=2`), a que o
         contador assina junto e que gera o CNPJ. Mesma tela, mesmo gesto, só
         muda o que está sendo assinado — por isso variante de rota, e não tela
         nova (mesmo padrão do `?etapa=codigo`). */
      rodada={searchParams.get("rodada") === "2" ? 2 : 1}
      /* 🔄 04/09 — a 1ª assinatura NÃO termina o registro: ela devolve pro
         status, que é de onde a 2ª vai ser chamada. Só a 2ª (a que gera o
         CNPJ) aterrissa na home de dia-1. */
      onSeguir={() =>
        router.push(
          searchParams.get("rodada") === "2"
            ? "/home-dia1"
            : "/aguardando?fase=junta&guia=paga&assinatura=1"
        )
      }
      onEscalar={() => router.push("/veredito/nao-atende")}
    />
  );
}
