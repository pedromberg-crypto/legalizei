"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  MigrarCnpjView,
  MigrarAchouView,
  EMPRESA_MIGRAR_CENARIOS,
  type CenarioM1,
} from "@/components/wizard-migrar";
import { comRegime } from "@/lib/regime";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M1 — SEU CNPJ (consulta + veredito) · rota de produção (shell WIZARD)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-migrar.tsx` (`MigrarCnpjView`).
 * Fonte da lógica: `motor-testes/flow-migrar.js` → m1.cnpj + m1.filtro + m1.veredito.
 *
 * A porta do FLOW #2. Diferença estrutural do flow #1: aqui NÃO existe
 * entrevista de atividade — o CNAE já está registrado, a gente lê o cartão CNPJ
 * em vez de perguntar. Todo o N4 (pills, typewriter, desambiguação) desaparece.
 *
 * Consulta e veredito na MESMA tela de propósito: no flow #1 o veredito é tela
 * própria porque depende de interpretação da IA (que pode errar); aqui é fato
 * registrado. Separar em duas telas custaria um toque pra mostrar um dado que
 * já estava na anterior.
 *
 * 🆕 04/08 — `?cenario=mei|presumido|inapto` demo os cenários achados no
 * cruzamento com `Fluxo Migração GEMINI.md` (ver `EMPRESA_MIGRAR_CENARIOS`).
 * 🆕 04/08 (2ª rodada) — MEI agora SEGUE pro M2 (`/migrar/diagnostico`), não
 * bloqueia mais.
 *
 * 🆕 04/08 (3ª rodada, corrigido) — `?fase=achou` renderiza SÓ o
 * `MigrarAchouView` (a tela "Achamos sua empresa" — card + checagens +
 * veredito), parado. Existe pra virar tela catalogável própria no `/mockup`,
 * ao lado do M1 — antes só dava pra ver digitando um CNPJ no fluxo real.
 * ⚠️ Pedido original do Pedro era ESTA tela, não a de loading — corrigido
 * depois de eu ter extraído a errada na 1ª tentativa.
 *
 * 🔴 05/08 (pedido do Pedro) — `/migrar/tributario` (M1b, Simples×Presumido
 * autodeclarado) foi DESCARTADA: era pergunta duplicada, o regime (MEI · ME/
 * Simples · Lucro Presumido) já é autodeclarado antes disso, na E3.2 — quem
 * escolhe Lucro Presumido lá nem chega até aqui.
 * 🔴 06/08 (achado do Pedro) — ME TAMBÉM segue pro M2 (`/migrar/diagnostico`)
 * agora, não mais direto pro M3: certificado digital não tinha pergunta
 * nenhuma no caminho ME (gap real, ver `MigrarDiagnosticoView`).
 *
 * 🆕 24/08 (reunião Leonan 19/08) — CPF/RG/estado civil + sociedade (M1b/
 * E4.2b/E4.2c, `MigrarDadosBaseView`/`SociosView`) e o acesso ao GOV.BR +
 * procuração (`MigrarGovView`) NÃO entram aqui — a reunião foi explícita
 * sobre a ORDEM: isso acontece DEPOIS do pagamento, entre `/migrar/contador`
 * (M3c) e `/migrar/transferencia` (M4b), não entre o CNPJ e o diagnóstico.
 * "Durante a migração... [ele] preencha todos os dados base... [depois]
 * a gente vem para a parte de estamos encerrando lá, transferindo a
 * responsabilidade" — dados base primeiro, pipeline de transferência depois.
 * Ver `/migrar/contador/page.tsx` (shell APP) pra sequência completa.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function MigrarCnpjPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cenarioParam = searchParams.get("cenario");
  const cenario: CenarioM1 =
    cenarioParam === "mei" || cenarioParam === "presumido" || cenarioParam === "inapto"
      ? cenarioParam
      : "padrao";

  if (searchParams.get("fase") === "achou") {
    const empresa = EMPRESA_MIGRAR_CENARIOS[cenario];
    return (
      <MigrarAchouView
        empresa={empresa}
        situacaoOk={empresa.situacao === "ATIVA"}
        onVoltar={() => router.push("/migrar/cnpj")}
        onSeguir={() => router.push(comRegime("/migrar/diagnostico", cenario === "mei"))}
        onSaidaInapto={() => router.push("/saida/cnpj-inapto")}
      />
    );
  }

  return (
    <MigrarCnpjView
      cenario={cenario}
      onSeguir={() => router.push(comRegime("/migrar/diagnostico", cenario === "mei"))}
      onSaidaInapto={() => router.push("/saida/cnpj-inapto")}
      onVoltar={() => router.push("/entrada")}
    />
  );
}
