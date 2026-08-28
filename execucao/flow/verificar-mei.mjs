/**
 * ═══════════════════════════════════════════════════════════════════════════
 * VERIFICADOR DO RAMO MEI — trava contra vocabulário de ME vazando pro MEI.
 * ═══════════════════════════════════════════════════════════════════════════
 * Rodar: `node execucao/flow/verificar-mei.mjs`
 *
 * ─── POR QUE ESTE SCRIPT EXISTE ─────────────────────────────────────────────
 * 28/08 — construí o ramo MEI adaptando telas do ME por DEDUÇÃO ("essa aqui
 * provavelmente serve"), em vez de rastrear tela por tela o que cada uma diz.
 * O Pedro pegou 2 erros na hora: uma tela perguntando sobre sociedade num
 * regime que não tem sócio, e o endereço fiscal sendo vendido pra quem não
 * precisa dele. A auditoria que veio depois achou mais 6.
 *
 * O padrão dos 8 erros é sempre o mesmo: **uma tela compartilhada afirma algo
 * que só vale pro ME**, e ninguém percebe porque a tela "funciona".
 *
 * Este script não julga UX. Ele faz uma coisa só, e faz sempre:
 *   → acha todo termo que SÓ existe no mundo do ME dentro dos arquivos que o
 *     caminho MEI atravessa, e exige que cada ocorrência esteja registrada
 *     como revisada (`REVISADOS` abaixo).
 *
 * Ocorrência nova e não registrada = ERRO. Não é opinião: é "alguém escreveu
 * 'Junta Comercial' num arquivo que o MEI enxerga e não disse se está guardado
 * por `mei`". Aí a pessoa olha, decide, e registra. O custo de registrar é
 * baixo; o custo de prometer Junta pra um MEI é reembolso.
 *
 * ⚠️ Isto NÃO substitui ler a tela. Substitui só o esquecimento.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const APP = join(RAIZ, "app", "src");

/**
 * A CADEIA REAL do ramo MEI — rota por rota, com o componente que cada uma
 * renderiza. Rastreada no código em 28/08 (não deduzida).
 *
 * `compartilhada: true` = a mesma tela serve ME e MEI, e portanto está sujeita
 * à checagem de vocabulário. `false` = tela exclusiva do MEI (pode falar o que
 * quiser de MEI, e não pode falar de Junta).
 */
export const CADEIA_MEI = [
  { etapa: "E1", rota: "/splash", componente: "splash.tsx", compartilhada: true },
  { etapa: "E2", rota: "/welcome", componente: "welcome.tsx", compartilhada: true },
  { etapa: "E3", rota: "/entrada", componente: "entrada.tsx", compartilhada: true },
  { etapa: "E3.1", rota: "/dados", componente: "entrada-lead.tsx", compartilhada: true },
  { etapa: "E3.2", rota: "/entrada?intencao=abrir", componente: "gate-telas.tsx", compartilhada: true },
  { etapa: "E3.4", rota: "/endereco?regime=mei", componente: "entrada-lead.tsx", compartilhada: true },
  { etapa: "M-T", rota: "/gate?etapa=triagem&regime=mei", componente: "mei-telas.tsx", compartilhada: false },
  { etapa: "E5F", rota: "/gate?etapa=faixa&regime=mei", componente: "gate-telas.tsx", compartilhada: true },
  { etapa: "E6", rota: "/conta?regime=mei", componente: "wizard-dinheiro.tsx", compartilhada: true },
  { etapa: "E7", rota: "/plano?regime=mei", componente: "wizard-dinheiro.tsx", compartilhada: true },
  { etapa: "E8", rota: "/contrato?regime=mei", componente: "wizard-dinheiro.tsx", compartilhada: true },
  { etapa: "E9", rota: "/pagamento?regime=mei", componente: "wizard-dinheiro.tsx", compartilhada: true },
  { etapa: "M-O", rota: "/dossie/ocupacao", componente: "mei-telas.tsx", compartilhada: false },
  { etapa: "C1", rota: "/dossie/socio?regime=mei", componente: "wizard-dossie.tsx", compartilhada: true },
  { etapa: "C4", rota: "/dossie/empresa?regime=mei", componente: "wizard-dossie.tsx", compartilhada: true },
  { etapa: "C7", rota: "/dossie/nome?regime=mei", componente: "wizard-dossie.tsx", compartilhada: true },
  { etapa: "A1", rota: "/revisar?regime=mei", componente: "wizard-cauda.tsx", compartilhada: true },
  { etapa: "A2", rota: "/termo?regime=mei", componente: "wizard-cauda.tsx", compartilhada: true },
  { etapa: "A3", rota: "/painel?regime=mei", componente: "painel.tsx", compartilhada: true },
  { etapa: "M-S", rota: "/mei/proximos-passos", componente: "mei-telas.tsx", compartilhada: false },
  { etapa: "A5", rota: "/home-dia1", componente: "wizard-cauda.tsx", compartilhada: true },
];

/**
 * As telas que o MEI **NÃO** atravessa, e por quê. Documentado aqui porque
 * "não usa" é tão importante quanto "usa" — foi justamente aqui que os erros
 * de dedução nasceram.
 */
export const PULADAS = [
  { etapa: "E5T", rota: "/gate?etapa=triagem", porque: "Triagem de sócios. MEI é unipessoal (art. 966 CC) — substituída pela M-T." },
  { etapa: "C0", rota: "/dossie/atividade", porque: "Descrever atividade + CNAE livre. O Portal só aceita ocupação do Anexo XI — substituída pela M-O." },
  { etapa: "C2", rota: "/dossie/vinculo", porque: "Vínculo INSS / pró-labore. MEI não tem pró-labore (tem retirada de lucro 8%/32%)." },
  { etapa: "C3", rota: "/dossie/socios", porque: "MEI não pode ter sócio." },
  { etapa: "C5", rota: "/dossie/cnae-secundarios", porque: "As ocupações secundárias (até 15) já foram escolhidas na M-O." },
  { etapa: "C6", rota: "/dossie/natureza", porque: "Natureza jurídica é sempre 213-5, automática." },
  { etapa: "A3.2", rota: "/certificado", porque: "Certificado digital é DISPENSADO na abertura do MEI (gov.br Prata/Ouro supre)." },
  { etapa: "A4", rota: "/assinatura", porque: "Não existe assinatura de sócios — o aceite acontece dentro do gov.br." },
];

/**
 * Termos que SÓ fazem sentido no mundo do ME. Cada um com o motivo, pra quem
 * ler o erro entender sem abrir a pesquisa.
 */
const TERMOS_SO_ME = [
  { id: "junta", re: /Junta Comercial|na Junta|da Junta|à Junta|JUCEMG/i, motivo: "MEI não passa pela Junta Comercial (registra no Portal do Empreendedor, via Redesim)" },
  { id: "contrato-social", re: /contrato social/i, motivo: "MEI não tem contrato social (o CCMEI é o documento constitutivo, Res. CGSIM 48/2018)" },
  { id: "viabilidade", re: /viabilidade/i, motivo: "Consulta prévia de viabilidade foi EXTINTA pro MEI (Res. CGSIM 61/2020)" },
  { id: "capital-social", re: /capital social/i, motivo: "MEI informa capital social, mas sem mínimo legal e sem ir pra contrato — conferir a copy" },
  { id: "iptu", re: /IPTU|índice cadastral/i, motivo: "O formulário do Portal do Empreendedor não pede índice cadastral do IPTU" },
  { id: "fator-r", re: /Fator R/i, motivo: "MEI paga DAS de valor fixo — não existe Fator R nem Anexo" },
  { id: "pro-labore", re: /pró-labore/i, motivo: "MEI não tem pró-labore (a retirada é lucro isento, 8%/32%, Lei 9.249/95 art.15)" },
  { id: "socios", re: /\bsócios?\b/i, motivo: "MEI é unipessoal por definição (art. 966 do Código Civil)" },
  { id: "certificado", re: /certificado digital|e-CNPJ/i, motivo: "Certificado digital é dispensado na abertura do MEI" },
  { id: "alvara", re: /alvará/i, motivo: "Alvará é dispensado pro MEI de baixo risco em BH (Decreto PBH 17.245/2019)" },
  { id: "taxa-junta", re: /taxa da Junta|DAE/i, motivo: "A abertura do MEI é gratuita em todas as instâncias" },
];

/**
 * ─── AS OCORRÊNCIAS JÁ REVISADAS ────────────────────────────────────────────
 * Chave: `arquivo:termo`. Valor: por que aquela ocorrência é segura.
 *
 * Registrar aqui é o gesto de "eu OLHEI e está guardado por `mei`" (ou é
 * comentário, ou é código morto pro MEI). Se o número de ocorrências de um par
 * arquivo:termo AUMENTAR, o script acusa — porque a linha nova não passou por
 * ninguém.
 */
const REVISADOS = {
  // ── entrada-lead.tsx (E3.1 + E3.4) ───────────────────────────────────────
  "entrada-lead.tsx:viabilidade": { max: 6, nota: "O aviso 'a prefeitura confirma na viabilidade' é `!regimeMei`; existe um par `regimeMei` que diz o oposto (não há viabilidade no MEI). O resto é comentário." },
  "entrada-lead.tsx:alvara": { max: 2, nota: "Só dentro do aviso `regimeMei`, e é o texto CORRETO (alvará dispensado em BH pra baixo risco)." },

  // ── gate-telas.tsx (E3.2 fork MEI×ME + E5F faixa) ────────────────────────
  "gate-telas.tsx:socios": { max: 33, nota: "Tudo dentro de TriagemView (que o MEI NÃO renderiza — o /gate bifurca pra ImpedimentoView) ou em comentário." },
  "gate-telas.tsx:junta": { max: 1, nota: "Comentário." },
  "gate-telas.tsx:contrato-social": { max: 1, nota: "Comentário sobre sócio PJ, na TriagemView (não alcançável pelo MEI)." },
  "gate-telas.tsx:taxa-junta": { max: 1, nota: "Comentário." },

  // ── wizard-dinheiro.tsx (E6 conta · E7 plano · E8 contrato · E9 pagamento)
  "wizard-dinheiro.tsx:junta": { max: 21, nota: "Todas guardadas por `semTaxaJunta`/`mei`, ou comentário. O subtítulo do E6 virou `subConta(mei)` em 28/08." },
  "wizard-dinheiro.tsx:taxa-junta": { max: 19, nota: "Guardadas por `semTaxaJunta` — no MEI o card mostra 'Não tem'." },
  "wizard-dinheiro.tsx:viabilidade": { max: 7, nota: "Guardadas por `semTaxaJunta` no PlanoView/ContratoView, ou comentário." },
  "wizard-dinheiro.tsx:socios": { max: 2, nota: "Comentário." },
  "wizard-dinheiro.tsx:fator-r": { max: 1, nota: "Comentário." },
  "wizard-dinheiro.tsx:pro-labore": { max: 1, nota: "Comentário." },
  "wizard-dinheiro.tsx:certificado": { max: 9, nota: "🟡 DECISÃO DE NEGÓCIO, não bug: o ramo `semTaxaJunta` do E8 diz 'certificado digital vem incluso' como contrapartida da fidelidade de 12 meses (ADR 04/08). É verdade pra OPERAR (procuração e-CAC, FGTS Digital), mas o cliente acabou de ler que a ABERTURA dispensa certificado. Pedro precisa decidir se a copy separa os dois momentos." },

  // ── wizard-dossie.tsx (C1 socio · C4 empresa · C7 nome) ──────────────────
  "wizard-dossie.tsx:socios": { max: 47, nota: "SociosView (C3) inteira, que o MEI PULA; a pergunta de residência no C4 virou `!mei` em 28/08; o resto é comentário." },
  "wizard-dossie.tsx:iptu": { max: 19, nota: "O campo inteiro virou `!mei` em 28/08 (o formulário do MEI não pede IPTU), e o gate do Continuar também. O resto é comentário e o aviso de reclassificação, dentro do bloco `!mei` de sócio." },
  "wizard-dossie.tsx:junta": { max: 12, nota: "Comentários + a dica do campo de IPTU, que agora é `!mei`." },
  "wizard-dossie.tsx:capital-social": { max: 8, nota: "Campo guardado por `!mei` desde 03/08." },
  "wizard-dossie.tsx:contrato-social": { max: 5, nota: "Comentários explicando por que capital/estado civil são `!mei`." },
  "wizard-dossie.tsx:pro-labore": { max: 4, nota: "VinculoView (C2) inteira, que o MEI PULA." },
  "wizard-dossie.tsx:fator-r": { max: 1, nota: "Comentário no C5 (CNAE secundários), que o MEI PULA." },
  "wizard-dossie.tsx:alvara": { max: 1, nota: "Comentário do bloco de forma de atuação, e é o texto correto (dispensa de alvará)." },
  "wizard-dossie.tsx:taxa-junta": { max: 9, nota: "Comentários + copy guardada por `!mei`." },

  // ── wizard-cauda.tsx (A1 revisar · A2 termo · A5 home dia-1) ─────────────
  "wizard-cauda.tsx:junta": { max: 13, nota: "Revisar e Termo corrigidos em 28/08 (ramo `mei` próprio). O resto vive em CertificadoGateView/AssinaturaView, que o MEI PULA." },
  "wizard-cauda.tsx:socios": { max: 5, nota: "AssinaturaView (A4), que o MEI PULA, + comentários." },
  "wizard-cauda.tsx:certificado": { max: 7, nota: "CertificadoGateView (A3.2), que o MEI PULA." },
  "wizard-cauda.tsx:taxa-junta": { max: 8, nota: "Recap do A1 e Termo, guardados por `!mei`." },
  "wizard-cauda.tsx:capital-social": { max: 2, nota: "Recap do A1, guardado por `!mei`." },
  "wizard-cauda.tsx:alvara": { max: 2, nota: "No Termo, dentro do bloco `mei`, e é o texto CORRETO (dispensa de alvará, Res. CGSIM 59/2020)." },
  "wizard-cauda.tsx:fator-r": { max: 2, nota: "No A1, dentro do ramo `mei ?` que diz justamente que NÃO existe Fator R no MEI." },
  "wizard-cauda.tsx:pro-labore": { max: 2, nota: "Recap do A1, guardado por `!mei`." },

  // ── painel.tsx (A3) ──────────────────────────────────────────────────────
  "painel.tsx:junta": { max: 4, nota: "ETAPAS_ABERTURA (pipeline do ME). O MEI recebe `etapas` próprio via prop desde 28/08." },
  "painel.tsx:taxa-junta": { max: 12, nota: "Etapa da guia da Junta, só no pipeline default (ME)." },
  "painel.tsx:viabilidade": { max: 4, nota: "Comentários do pipeline do ME." },
  "painel.tsx:socios": { max: 2, nota: "Faixa de notificação, só quando `socios > 1`. O MEI sempre passa 1." },
  "painel.tsx:contrato-social": { max: 1, nota: "Comentário." },

  // ── mei-telas.tsx (exclusivas do MEI) ────────────────────────────────────
  "mei-telas.tsx:socios": { max: 2, nota: "Comentários explicando por que a triagem de sócios do ME não serve aqui." },
};

/* ═══════════════════════ EXECUÇÃO ═══════════════════════════════════════ */

const arquivos = [...new Set(CADEIA_MEI.map((c) => c.componente))];
const problemas = [];
const contagem = {};

for (const arq of arquivos) {
  const caminho = join(APP, "components", arq);
  let texto;
  try {
    texto = readFileSync(caminho, "utf8");
  } catch {
    problemas.push(`arquivo da cadeia não existe: ${relative(RAIZ, caminho)}`);
    continue;
  }
  const linhas = texto.split("\n");

  for (const termo of TERMOS_SO_ME) {
    const achados = linhas.filter((l) => termo.re.test(l)).length;
    if (achados === 0) continue;
    const chave = `${arq}:${termo.id}`;
    contagem[chave] = achados;
    const revisado = REVISADOS[chave];
    if (!revisado) {
      problemas.push(
        `🆕 NÃO REVISADO — ${chave} (${achados}×)\n     ${termo.motivo}\n     → olhe cada linha e registre em REVISADOS, ou guarde por \`mei\`.`,
      );
    } else if (achados > revisado.max) {
      problemas.push(
        `📈 CRESCEU — ${chave}: ${achados}× (revisado até ${revisado.max}×)\n     ${termo.motivo}\n     → a linha nova não passou por ninguém. Confira e atualize o max.`,
      );
    }
  }
}

// Sanidade: toda tela exclusiva do MEI existe? Toda pulada segue existindo?
for (const c of CADEIA_MEI) {
  try {
    readFileSync(join(APP, "components", c.componente), "utf8");
  } catch {
    problemas.push(`cadeia aponta pra componente inexistente: ${c.etapa} → ${c.componente}`);
  }
}

console.log("═══ VERIFICADOR DO RAMO MEI ═══\n");
console.log(`Cadeia rastreada: ${CADEIA_MEI.length} etapas · ${arquivos.length} arquivos`);
console.log(`Telas que o MEI PULA: ${PULADAS.length} (documentadas com motivo)\n`);

if (problemas.length === 0) {
  const total = Object.values(contagem).reduce((a, b) => a + b, 0);
  console.log(`✅ ${total} ocorrências de vocabulário de ME, todas revisadas.`);
  console.log("   Nenhum termo novo entrou sem passar por alguém.\n");
  process.exit(0);
}

console.log(`🔴 ${problemas.length} ponto(s) pra olhar:\n`);
problemas.forEach((p) => console.log(`  ${p}\n`));
process.exit(1);
