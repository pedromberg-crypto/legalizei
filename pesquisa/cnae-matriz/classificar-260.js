/**
 * ═══════════════════════════════════════════════════════════════════════════
 * classificar-260.js — limpeza dos 260 CNAEs de serviço
 * ═══════════════════════════════════════════════════════════════════════════
 * POR QUE ESTE ARQUIVO EXISTE
 *
 * Os "260 atendidos de serviço" nasceram de DUAS heurísticas por SEÇÃO,
 * empilhadas, e nenhuma delas foi amostrada até 2026-07-16:
 *   1. `contabilizei_atende` = espelho do filtro do concorrente, aplicado por
 *      seção/divisão. A própria nota carimba "confiança MÉDIA, validar por
 *      amostragem" (cnae-atendidos-e-nao-atendidos.md).
 *   2. `anexo_base` = regra por seção (I=comércio, II=indústria, resto=serviço).
 *      A nota diz, com todas as letras, que o anexo exato "NÃO está resolvido
 *      por código ainda".
 * O corte "MVP só serviço" (15/07) usou `anexo_base !== 'I'`. Ou seja: um campo
 * declaradamente não resolvido virou a fronteira do escopo do produto.
 *
 * Regra de seção acerta no atacado e erra no varejo. Errou: entraram DEFESA,
 * JUSTIÇA, RELAÇÕES EXTERIORES, CARTÓRIOS, GERAÇÃO DE ENERGIA ELÉTRICA,
 * CASAS DE BINGO e ORGANISMOS INTERNACIONAIS na lista do que "atendemos".
 *
 * ─── O QUE ESTE SCRIPT NÃO É ───────────────────────────────────────────────
 * Não é veredito fiscal. É uma PROPOSTA rastreável, item a item, com motivo.
 * `impossivel` = decisão do Pedro (é factual: ninguém abre ME assim).
 * `duvidoso`   = fila humana (Larissa/Mauro). NA DÚVIDA, VAI PRA CÁ.
 *   Direção segura: duvidoso volta da fila; impossível some da lista.
 *
 * ⚠️ As citações de LC 123/2006 art. 17 (artigo das vedações ao Simples) estão
 * SEM inciso de propósito: o artigo eu sustento, o inciso exato é pergunta pra
 * Larissa. Anti-guru: número sem fonte não entra.
 *
 * Rodar:  node pesquisa/cnae-matriz/classificar-260.js
 * ═══════════════════════════════════════════════════════════════════════════
 */

const fs = require("fs");
const path = require("path");

const MATRIZ = path.join(__dirname, "cnae-matriz.json");

/* ─────────────────────────────────────────────────────────────────────────
   IMPOSSÍVEL — não existe ME no Simples aqui. Decisão nossa, é factual.
   ───────────────────────────────────────────────────────────────────────── */
const IMPOSSIVEL = {
  "funcao-estatal": {
    motivo:
      "função de Estado ou delegação estatal. Não se abre por CNPJ de ME: ou é órgão público, ou é concurso/outorga.",
    cnaes: [
      "8411600", "8412400", "8413200", "8421300", "8422100", "8423000",
      "8424800", "8425600", "8430200", // seção O inteira
      "9900800", // organismos internacionais (seção U)
      "6912500", // cartórios = delegação do Estado, via concurso público
      "8550301", // administração de caixas escolares = fundo de escola pública
    ],
  },
  "nao-e-empresa": {
    motivo:
      "relação de emprego doméstico entre pessoas físicas. Não gera CNPJ.",
    cnaes: ["9700500"],
  },
  "vedacao-simples": {
    motivo:
      "vedação expressa ao Simples Nacional (LC 123/2006, art. 17). Mesmo abrindo, a empresa não pode optar pelo Simples, que é a premissa do produto inteiro.",
    cnaes: [
      "3511501", "3511502", "3512300", "3513100", "3514000", // energia elétrica: geração, transmissão, distribuição, comercialização
      "6810203", // loteamento de imóveis próprios
    ],
  },
  "concessao-infra": {
    motivo:
      "concessão/outorga pública de infraestrutura (ANATEL, ANTT, ANAC, ANEEL, saneamento, radiodifusão). Escala e barreira de entrada incompatíveis com ME.",
    cnaes: [
      "5221400", "5222200", // rodovias, terminais rodoviários/ferroviários
      "5231101", "5231102", "5231103", // portos
      "5240101", // aeroportos
      "3600601", "3701100", // captação/distribuição de água, redes de esgoto
      "3520401", "3520402", // gás: produção e distribuição por rede urbana
      "6010100", "6021700", // rádio e TV aberta = concessão (CF art. 223)
      "6110801", "6110802", "6110899", // telefonia fixa
      "6120501", "6120502", "6120599", // telefonia móvel
      "6130200", // satélite
      "6141800", "6142600", "6143400", // operadoras de TV por assinatura
    ],
  },
  "proibido-restrito": {
    motivo:
      "jogo de azar. Atividade proibida/restrita no Brasil; não é mercado de MLP de contabilidade.",
    cnaes: ["9200301", "9200302", "9200399"],
  },
  "institucional-publico": {
    motivo: "equipamento público ou de conservação, não empresa de serviço.",
    cnaes: ["9103100"], // jardins botânicos, zoológicos, parques nacionais, reservas
  },
};

/* ─────────────────────────────────────────────────────────────────────────
   DUVIDOSO — fila humana. Cada balde tem uma PERGUNTA fechada.
   ───────────────────────────────────────────────────────────────────────── */
const DUVIDOSO = {
  "deveria-ser-condicional": {
    pergunta:
      "Exigem responsável técnico/registro em conselho ou junta? Se sim, isto não é 'atendido': é dos 68 CONDICIONAIS, e o gate tem que mandar pra waitlist, não passar liso.",
    cnaes: [
      "6821801", "6821802", // corretagem de imóveis → CRECI
      "8299704", // leiloeiro independente → matrícula na Junta
      "5239701", // praticagem → praticante autorizado
      "8711501", // clínicas e residências geriátricas → RT de saúde
      "8712300", // assistência a paciente no domicílio → RT
      "8720401", "8720499", // assistência psicossocial → RT
      "8591100", // ensino de esportes → CREF
      "7490103", // agronomia → CREA
    ],
  },
  "licenca-especial": {
    pergunta:
      "Dependem de licença setorial (DETRAN, ANAC, MEC/CEE, vigilância sanitária, ambiental). A empresa abre, mas não OPERA sem a licença. A gente abre e avisa, ou manda pra waitlist?",
    cnaes: [
      "8599601", "8599602", // autoescola (DETRAN), pilotagem (ANAC)
      "8511200", "8512100", "8513900", "8520100", // creche → ensino médio (CEE/MEC)
      "8531700", "8532500", "8533300", "8541400", "8542200", // superior e técnico (MEC)
      "9603301", "9603302", "9603303", "9603304", "9603305", "9603399", // cemitério, cremação, sepultamento, funerária
      "3812200", "3822000", "3900500", // resíduos perigosos, descontaminação (ambiental)
      "9609206", // tatuagem e piercing (vigilância sanitária)
      "9609205", // sauna e banhos (vigilância sanitária)
      "5250802", // despachante aduaneiro (registro na RFB)
      "5211701", // armazéns gerais - warrant (matrícula na Junta)
      "8299706", // casas lotéricas = permissão da Caixa, via licitação
    ],
  },
  "anexo-provavelmente-errado": {
    pergunta:
      "🔥 O `anexo_base` veio de regra por SEÇÃO, e a seção não sabe o que a atividade faz. Bar/restaurante/lanchonete são Anexo I (comércio) no Simples; 'edição integrada à impressão' IMPRIME (transformação, Anexo II); recuperação de material é transformação. Se eu estiver certo, estes já estavam fora pelo corte de 15/07 e só sobraram por causa da heurística. Quais confirmam?",
    cnaes: [
      "5611201", "5611203", "5611204", "5611205", // restaurantes, lanchonetes, bares
      "5612100", // ambulantes de alimentação
      "5620101", "5620102", "5620103", "5620104", // bufê, cantinas, marmita
      "5821200", "5822101", "5822102", "5823900", "5829800", // edição INTEGRADA À IMPRESSÃO = gráfica
      "3831901", "3831999", "3832700", "3839401", "3839499", // recuperação de sucatas/plásticos/compostagem
    ],
  },
  "imovel-proprio": {
    pergunta:
      "LC 123 art. 17 veda locação de imóveis próprios (com ressalva quando há ISS). Compra e venda de imóvel próprio entra na mesma leitura? Qual sobrevive?",
    cnaes: ["6810201", "6810202"],
  },
  "terceiro-setor": {
    pergunta:
      "Orfanato, albergue, ILPI e assistência social costumam ser associação/OSC, não ME com sócio e pró-labore. Existe mercado de ME aqui ou é lista morta?",
    cnaes: [
      "8730101", "8730102", "8730199", "8800600",
      "8711502", "8711503", "8711504", "8711505",
    ],
  },
  "provedor-pequeno": {
    pergunta:
      "SCM e provedor de acesso têm ISP pequeno de bairro que É ME de verdade, diferente das operadoras. Fica ou sai junto com as teles?",
    cnaes: ["6110803", "6190601", "6190602", "6190699"],
  },
  "escala-duvidosa": {
    pergunta:
      "Cabem em ME de 2 sócios em BH ou são operação de porte? Se não tiver demanda real, é lista morta que só suja o gate.",
    cnaes: [
      "3530100", // vapor, água quente e ar condicionado (district heating)
      "5211702", "5211799", "5212500", // guarda-móveis, depósitos, carga e descarga
      "5232000", "5239799", "5240199", // agenciamento marítimo, auxiliares aquaviário/aéreo
      "5250801", "5250803", "5250804", "5250805", // comissária, agenciamento de cargas, logística, OTM
      "7490102", // escafandria e mergulho
      "8292000", // envasamento e empacotamento sob contrato
      "8299701", // medição de consumo de energia, gás e água
      "9102301", "9102302", // museus, restauração de prédios históricos
      "9312300", "9321200", // clubes sociais, parques de diversão
      "9001905", // espetáculos de rodeios e vaquejadas
      "5914600", // exibição cinematográfica = sala de cinema, capex de rede
      "6022501", "6022502", // programadoras e TV por assinatura: barrei as OPERADORAS ao lado, então estas não podem passar liso
      "9101500", // bibliotecas e arquivos = quase sempre institucional
    ],
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   MOTOR
   ═══════════════════════════════════════════════════════════════════════════ */

const fmt = (c) =>
  c.length === 7 ? `${c.slice(0, 4)}-${c[4]}/${c.slice(5)}` : c;

function indexar(tabela, campo) {
  const m = new Map();
  for (const [balde, def] of Object.entries(tabela)) {
    for (const c of def.cnaes) {
      if (m.has(c)) {
        throw new Error(
          `CNAE ${fmt(c)} classificado 2x: "${m.get(c).balde}" e "${balde}". Um CNAE, um balde.`
        );
      }
      m.set(c, { balde, texto: def[campo] });
    }
  }
  return m;
}

const mImpossivel = indexar(IMPOSSIVEL, "motivo");
const mDuvidoso = indexar(DUVIDOSO, "pergunta");

for (const c of mImpossivel.keys()) {
  if (mDuvidoso.has(c)) {
    throw new Error(`CNAE ${fmt(c)} está em impossivel E duvidoso.`);
  }
}

const matriz = JSON.parse(fs.readFileSync(MATRIZ, "utf8"));
const base = matriz.filter(
  (r) => r.contabilizei_atende === "atende" && r.anexo_base !== "I"
);

// Guarda-corpo: se a base mudar de tamanho, a classificação está velha.
if (base.length !== 260) {
  console.warn(
    `⚠️ base tem ${base.length} CNAEs, não 260. A matriz mudou — revisar antes de confiar.`
  );
}

const orfaos = [...mImpossivel.keys(), ...mDuvidoso.keys()].filter(
  (c) => !base.some((r) => r.cnae === c)
);
if (orfaos.length) {
  throw new Error(
    `Classifiquei CNAE que não está nos 260: ${orfaos.map(fmt).join(", ")}`
  );
}

const out = base.map((r) => {
  const i = mImpossivel.get(r.cnae);
  const d = mDuvidoso.get(r.cnae);
  return {
    ...r,
    veredito: i ? "impossivel" : d ? "duvidoso" : "real",
    balde: i?.balde ?? d?.balde ?? null,
    texto: i?.texto ?? d?.texto ?? null,
  };
});

const cont = { impossivel: 0, duvidoso: 0, real: 0 };
out.forEach((r) => cont[r.veredito]++);

module.exports = { out, cont, IMPOSSIVEL, DUVIDOSO, fmt };

/* ─────────────────────────────────────────────────────────────────────────
   Gerador da nota. A nota é DERIVADA: nunca editar na mão, rodar com --nota.
   Editar lá e não aqui é como o vault volta a mentir.
   ───────────────────────────────────────────────────────────────────────── */
function gerarNota() {
  const L = [];
  const linhas = (v, balde) =>
    out
      .filter((r) => r.veredito === v && r.balde === balde)
      .sort((a, b) => a.cnae.localeCompare(b.cnae))
      .map((r) => `| \`${fmt(r.cnae)}\` | ${r.descricao} |`)
      .join("\n");

  L.push("---");
  L.push("tipo: derivado");
  L.push("status: fila-humana");
  L.push("data: 2026-07-16");
  L.push("assunto: cnae-escopo-mvp");
  L.push("deriva_de: [cnae-atendidos-e-nao-atendidos, cnae-matriz.json]");
  L.push("gerado_por: pesquisa/cnae-matriz/classificar-260.js");
  L.push("tags: [cnae, escopo, mvp, fila]");
  L.push("---");
  L.push("");
  L.push("# 🧹 Limpeza dos 260 CNAEs de serviço");
  L.push("");
  L.push(
    "> ⚠️ **NOTA DERIVADA. Não editar na mão.** Sai de `node pesquisa/cnae-matriz/classificar-260.js --nota`."
  );
  L.push("> Mexer aqui e não no script é exatamente como esta lista mentiu da primeira vez.");
  L.push("");
  L.push("## Por que esta nota existe");
  L.push("");
  L.push(
    "Os **260 atendidos de serviço** nunca foram uma lista do que a Legalizei atende. São o resultado de **duas heurísticas por seção, empilhadas**, e nenhuma tinha sido amostrada até 16/07:"
  );
  L.push("");
  L.push(
    "1. `contabilizei_atende` = espelho do filtro do concorrente, aplicado por seção/divisão. [[cnae-atendidos-e-nao-atendidos]] carimba **confiança MÉDIA, validar por amostragem**."
  );
  L.push(
    "2. `anexo_base` = regra por seção (`I`=comércio, `II`=indústria, resto=serviço). A mesma nota diz que o anexo exato **\"NÃO está resolvido por código ainda\"**."
  );
  L.push("");
  L.push(
    "O corte **MVP só serviço** (15/07 → [[legalize-mvp-so-servico-cnae]]) foi executado como `anexo_base !== 'I'`. Ou seja: **um campo declaradamente não resolvido virou a fronteira do escopo do produto.**"
  );
  L.push("");
  L.push(
    "Regra de seção acerta no atacado e erra no varejo. O que entrou na lista do que \"atendemos\": `DEFESA`, `JUSTIÇA`, `RELAÇÕES EXTERIORES`, `CARTÓRIOS`, `GERAÇÃO DE ENERGIA ELÉTRICA`, `CASAS DE BINGO`, `ORGANISMOS INTERNACIONAIS`."
  );
  L.push("");
  L.push(
    "🔴 **Isto não é só doc.** O `cnae-lookup-b1.json` entregue ao dev em 15/07 sai das **mesmas 1332 subclasses pela mesma regra**. A triagem que ele está codando responde **\"atende, passa liso\"** para `8422-1/00 DEFESA`. Entra no mesmo balaio do contrato desatualizado → [[legalize-handoff-dev-repo]]."
  );
  L.push("");
  L.push("## Resumo");
  L.push("");
  L.push("| Veredito | Qtd | Quem decide |");
  L.push("|---|---|---|");
  L.push(
    `| ⛔ **Impossível** | ${cont.impossivel} | **Pedro** (é factual: ninguém abre ME assim) |`
  );
  L.push(
    `| 🕓 **Duvidoso** | ${cont.duvidoso} | **Larissa/Mauro** → [[fila-validacao-humana]]. 🕓 não bloqueia |`
  );
  L.push(`| ✅ **Real** | ${cont.real} | sobrevive. É daqui que as pills do N4 nascem |`);
  L.push(`| | **${out.length}** | |`);
  L.push("");
  L.push(
    "**Política de dúvida:** na dúvida vai pra `duvidoso`, nunca pra `impossivel`. Direção segura: duvidoso volta da fila; impossível some da lista."
  );
  L.push("");
  L.push(
    "⚠️ As citações de **LC 123/2006 art. 17** (artigo das vedações ao Simples) estão **sem inciso** de propósito: o artigo eu sustento, o inciso exato é pergunta pra Larissa. Anti-guru."
  );
  L.push("");
  L.push("---");
  L.push("");
  L.push(`## ⛔ Impossível (${cont.impossivel}) — decisão do Pedro`);
  for (const [balde, def] of Object.entries(IMPOSSIVEL)) {
    L.push("");
    L.push(`### \`${balde}\` (${def.cnaes.length})`);
    L.push("");
    L.push(`> ${def.motivo}`);
    L.push("");
    L.push("| CNAE | Descrição |");
    L.push("|---|---|");
    L.push(linhas("impossivel", balde));
  }
  L.push("");
  L.push("---");
  L.push("");
  L.push(`## 🕓 Duvidoso (${cont.duvidoso}) — fila humana`);
  L.push("");
  L.push("Cada balde tem **uma pergunta fechada**. Não é \"revisa isso aí\".");
  for (const [balde, def] of Object.entries(DUVIDOSO)) {
    L.push("");
    L.push(`### \`${balde}\` (${def.cnaes.length})`);
    L.push("");
    L.push(`> **Pergunta:** ${def.pergunta}`);
    L.push("");
    L.push("| CNAE | Descrição |");
    L.push("|---|---|");
    L.push(linhas("duvidoso", balde));
  }
  L.push("");
  L.push("---");
  L.push("");
  L.push(`## ✅ Real (${cont.real}) — sobrevive`);
  L.push("");
  L.push(
    "É desta lista que a taxonomia de pills do N4 tem que nascer. **Não da lista suja.**"
  );
  const secs = [...new Set(out.filter((r) => r.veredito === "real").map((r) => r.secao_id))].sort();
  for (const s of secs) {
    const rs = out
      .filter((r) => r.veredito === "real" && r.secao_id === s)
      .sort((a, b) => a.cnae.localeCompare(b.cnae));
    L.push("");
    L.push(`### ${s} · ${rs[0].secao} (${rs.length})`);
    L.push("");
    L.push("| CNAE | Descrição |");
    L.push("|---|---|");
    rs.forEach((r) => L.push(`| \`${fmt(r.cnae)}\` | ${r.descricao} |`));
  }
  L.push("");
  return L.join("\n");
}

// `require.main === module` PRIMEIRO, e não junto do --nota: sem isto, quem só
// importa este módulo (taxonomia-pills.js) herda o argv do processo e escreve a
// nota sem pedir. Importar um módulo não pode mexer em disco.
if (require.main !== module) {
  // importado: só exporta, não faz nada
} else if (process.argv.includes("--nota")) {
  const alvo = path.join(__dirname, "limpeza-260-servico.md");
  fs.writeFileSync(alvo, gerarNota(), "utf8");
  console.log(`nota escrita: ${alvo}`);
} else {
  console.log(`\nBASE: ${base.length} CNAEs de serviço\n`);
  console.log(`⛔ impossível : ${String(cont.impossivel).padStart(3)}  (decisão nossa, sai da lista)`);
  console.log(`🕓 duvidoso   : ${String(cont.duvidoso).padStart(3)}  (fila humana, não bloqueia)`);
  console.log(`✅ real       : ${String(cont.real).padStart(3)}  (sobrevive)`);
  console.log(`${"─".repeat(52)}`);
  console.log(`   total      : ${String(base.length).padStart(3)}\n`);

  console.log("⛔ IMPOSSÍVEL, por balde:");
  for (const [b, def] of Object.entries(IMPOSSIVEL)) {
    console.log(`   ${String(def.cnaes.length).padStart(3)}  ${b}`);
  }
  console.log("\n🕓 DUVIDOSO, por balde:");
  for (const [b, def] of Object.entries(DUVIDOSO)) {
    console.log(`   ${String(def.cnaes.length).padStart(3)}  ${b}`);
  }

  console.log("\n✅ REAL, por seção:");
  const s = {};
  out.filter((r) => r.veredito === "real").forEach((r) => {
    s[r.secao_id] = (s[r.secao_id] || 0) + 1;
  });
  Object.entries(s)
    .sort((a, b) => b[1] - a[1])
    .forEach(([k, v]) => {
      const nome = out.find((r) => r.secao_id === k).secao;
      console.log(`   ${String(v).padStart(3)}  ${k} · ${nome}`);
    });
  console.log("");
}
