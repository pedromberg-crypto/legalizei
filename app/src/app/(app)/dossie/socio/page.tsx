"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SocioView } from "@/components/wizard-dossie";
import { ehMei, comRegime } from "@/lib/regime";
import { passoDoAjuste } from "@/lib/ajuste";
import { ehEnderecoFiscal, comEndereco } from "@/lib/endereco";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N10 — SEUS DADOS (confirmação) · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-dossie.tsx` (`SocioView`) desde 29/07 —
 * fidelidade por construção: a `/apresentacao` renderiza o MESMO componente, e
 * a demo não pode ser cópia (a v1 da demo era, e divergiu em um dia). Esta
 * page é o wrapper: liga a navegação. Nenhum pixel mudou na extração.
 *
 * Spec: execucao/spec-telas-entrada-b1-b2.md → Tela 6 (2.1) · mapa T6→N10
 *
 * ⚠️ REESCRITA 28/07 (reunião Rua Satélite 9) — VIRA CONFIRMAÇÃO, não coleta
 * do zero. Nome/CPF/telefone/endereço migraram pro N6 (front-load, criar
 * conta). Aqui a pessoa só CONFERE (com "editar" pra cada bloco) e preenche
 * o que faltou: RG, órgão emissor, estado civil (+ regime de bens), e
 * confirma se mora fora do Brasil.
 *
 * "Editar" é mock — mesmo padrão do N19 (Ajustar): no app real abre só
 * aquele campo, salva e volta pra cá, sem re-andar o N6 inteiro.
 *
 * Regras que seguem valendo:
 *   · Comunhão universal dispara aviso do cônjuge CEDO (UX-30).
 *
 * ⚠️ 29/07 — "VOCÊ MORA FORA DO BRASIL?" FOI REMOVIDA (decisão do Pedro).
 * Era confirmação do que a triagem do N4 já pergunta e já barra, com saída
 * dedicada (LC 123 art. 17). Mesma lógica que tirou o CPF duplicado do N9:
 * repetir pergunta já respondida não vira segurança, vira desconfiança.
 * Saíram junto o aviso de bloqueio e o botão "Falar com o time".
 * O efeito colateral está anotado na View: o N10 passa a CONFIAR no N4, e a
 * segunda barreira deixou de existir.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function SocioPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mei = ehMei(searchParams);
  const enderecoFiscal = ehEnderecoFiscal(searchParams);

  // 🆕 03/08 — MEI pula C2 (Vínculo INSS/Fator R, não existe MEI) e C3
  // (Sócios, MEI não pode ter) — vai direto pra C4. ME segue a sequência
  // normal. Ver mapa em `/mockup` — grupo "Constituição".
  /**
   * 🆕 01/09 — MODO AJUSTE: quando a pessoa entra por "Ajustar" na tela
   * de status, a navegação fica presa ao bloco e a última tela dele troca
   * o CTA por "Atualizar dados", voltando pro status. Ausente = wizard
   * normal, com o destino de sempre.
   */
  const ajuste = passoDoAjuste(searchParams, "/dossie/socio");

  return (
    <SocioView
      mei={mei}
      onSeguir={() =>
        router.push(
          comEndereco(comRegime(mei ? "/dossie/empresa" : "/dossie/vinculo", mei), enderecoFiscal),
        )
      }
    />
  );
}
