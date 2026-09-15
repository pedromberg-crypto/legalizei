/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧪 A PERSONA ZERO COMO ESTADO — a série real, no formato do modelo.
 * ═══════════════════════════════════════════════════════════════════════════
 * BERG CONSULTORIA EM MARKETING · CNPJ 64.037.271/0001-02.
 *
 * 🔑 **Nenhum número aqui é inventado.** Receita vem dos recibos do PGDAS-D
 * competência a competência; pró-labore foi reconstruído das DCTFWeb (INSS do
 * segurado ÷ 11%), porque a Central de Sócios do líder só devolve 6 meses e
 * escondia dez/25, jan e fev.
 *
 * ⚠️ **`proLaborePago` = `proLaboreDeclarado` aqui por PRESUNÇÃO**, não por
 * prova: a empresa é do Pedro e ele confirma que pagou. Num cliente real esse
 * campo é declaração dele, com a Carta de Responsabilidade carregando. Deixo
 * os dois campos preenchidos e a presunção escrita, em vez de colapsar num só.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { identidade, competencia } from "./_modelo.mjs";

export const EMPRESA = identidade({
  cnpj: "64.037.271/0001-02",
  razaoSocial: "PEDRO MAIA BERG DE OLIVEIRA CONSULTORIA EM MARKETING LTDA",
  // 🔴 A data que o motor lê: abertura no CNPJ (Res. CGSN 140/2018 art. 2º V).
  // A assinatura foi 11/12 e o registro na Junta 12/12 — ver itens 44/45/46.
  dataAberturaCnpj: "2025-12-12",
  cnaePrincipal: "7319-0/04", // Consultoria em publicidade
  // 🔑 É `fator-r-dinamico`: um dos 15 CNAEs de 87 em que o Fator R decide.
  grupoAnexo: "fator-r-dinamico(III<->V, limiar 28%)",
  municipio: "BH",
});

/**
 * Dez/2025 a ago/2026 — as 9 competências que existem.
 *
 * 📌 Junho aparece com receita ZERO, e isso é correção de 14/09: a NF nº4 foi
 * emitida em 03/06 por R$12.000 e **cancelada**. O PGDAS-D de 06/2026 declara
 * R$0,00, e a série oficial vale mais que a nota do vault.
 */
export const COMPETENCIAS = [
  competencia({ mes: "2025-12", receita: 0, proLaboreDeclarado: 100, proLaborePago: 100 }),
  competencia({ mes: "2026-01", receita: 0, proLaboreDeclarado: 0, proLaborePago: 0 }),
  competencia({ mes: "2026-02", receita: 12000, proLaboreDeclarado: 3260, proLaborePago: 3260 }),
  competencia({ mes: "2026-03", receita: 12000, proLaboreDeclarado: 3360, proLaborePago: 3360 }),
  competencia({ mes: "2026-04", receita: 12000, proLaboreDeclarado: 3360, proLaborePago: 3360 }),
  competencia({ mes: "2026-05", receita: 0, proLaboreDeclarado: 1621, proLaborePago: 1621 }),
  competencia({ mes: "2026-06", receita: 0, proLaboreDeclarado: 1621, proLaborePago: 1621 }),
  competencia({ mes: "2026-07", receita: 0, proLaboreDeclarado: 1621, proLaborePago: 1621 }),
  competencia({ mes: "2026-08", receita: 7910, proLaboreDeclarado: 1621, proLaborePago: 1621 }),
];

/**
 * 🔴 O QUE ESTE CASO NÃO PROVA — a coluna que o Pedro exigiu em 13/09.
 *
 * Ausência de evidência não é ausência de requisito. Foi assim que nasceu o
 * "plano de saúde do sócio".
 */
export const NAO_PROVA = [
  "2 a 4 sócios (esta é unipessoal)",
  "Anexo V na prática (o Fator R dela nunca cai abaixo de 28%)",
  "faixas 2 a 6 (RBT12 nunca passou de R$54 mil)",
  "folha de colaborador (não tem funcionário)",
  "ISS retido na fonte (nenhuma das 9 competências teve)",
  "13º de pró-labore",
  "guia paga em atraso (todas em dia)",
  "empresa chegando perto do teto do ME",
  "CNAE secundário (ela tem um só)",
];
