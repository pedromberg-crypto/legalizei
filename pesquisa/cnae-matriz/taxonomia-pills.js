/**
 * ═══════════════════════════════════════════════════════════════════════════
 * taxonomia-pills.js — as pills do N4, derivadas dos CNAEs que sobreviveram
 * ═══════════════════════════════════════════════════════════════════════════
 * Consome `classificar-260.js` e agrupa os `real` em ÁREAS QUE UM HUMANO
 * RECONHECE. Seção do IBGE não é pill: ninguém se apresenta dizendo "trabalho
 * com Atividades Administrativas E Serviços Complementares". UX-05 manda a
 * linguagem humana vir ANTES do código, e aqui isso é a regra do arquivo.
 *
 * ⚠️ STATUS DA BASE: os 124 NÃO são lista validada. São os que sobreviveram à
 * classificação de 16/07 sem serem refutados. Nenhum contador olhou. A
 * taxonomia herda essa confiança e não pode fingir outra.
 *
 * ─── O GUARDA-CORPO ────────────────────────────────────────────────────────
 * Todo CNAE `real` PRECISA de exatamente uma pill. O script quebra se sobrar
 * um sem pill ou se algum cair em duas. Não é preciosismo:
 *   · CNAE sem pill  = atividade que a gente atende e a tela não anuncia
 *   · CNAE em 2 pills = a mesma atividade prometida por dois caminhos
 * A pill é uma PROMESSA ("essa área a gente abre"). Promessa sem lastro é o
 * falso 🟢, e com a cobrança no N9 o falso 🟢 custa dinheiro: o sujeito paga e
 * só depois descobre que não podia abrir.
 *
 * Rodar:  node pesquisa/cnae-matriz/taxonomia-pills.js
 *         node pesquisa/cnae-matriz/taxonomia-pills.js --nota
 * ═══════════════════════════════════════════════════════════════════════════
 */

const fs = require("fs");
const path = require("path");
const { out, fmt } = require("./classificar-260.js");

/**
 * PILLS.
 *
 * `exemplo` é o texto que a pill oferece: 1ª pessoa, frase inteira, sem
 * travessão (regra dura 13/07). Ele calibra o tamanho da resposta esperada,
 * que é o serviço que o placeholder do N4 já presta.
 *
 * ⚠️ 9 pills é MAIS do que eu recomendaria embarcar. Ver a leitura no fim.
 */
const PILLS = [
  {
    id: "tecnologia",
    label: "Tecnologia",
    exemplo: "Desenvolvo sistemas e aplicativos sob encomenda",
    cnaes: [
      "6201501", "6201502", "6202300", "6203100", "6204000", "6209100",
      "6311900", "6319400",
    ],
  },
  {
    id: "design-audiovisual",
    label: "Design e audiovisual",
    exemplo: "Crio logo e identidade visual de marca",
    cnaes: [
      "7410202", "7410203", "7410299", // design
      "7420001", "7420002", "7420003", "7420004", "7420005", // fotografia
      "5911101", "5911102", "5911199", // produção de filme e vídeo
      "5912001", "5912002", "5912099", // pós, dublagem, mixagem
      "5913800", "5920100", // distribuição, gravação de som
    ],
  },
  {
    id: "marketing",
    label: "Marketing e publicidade",
    exemplo: "Cuido das redes sociais de uns cinco clientes",
    cnaes: [
      "7311400", "7312200", "7319001", "7319002", "7319003", "7319004",
      "7319099", "7320300",
    ],
  },
  {
    id: "comunicacao-midia",
    label: "Comunicação e mídia",
    exemplo: "Escrevo e edito conteúdo para revista e jornal",
    cnaes: [
      "5811500", "5812301", "5812302", "5813100", "5819100", // edição
      "6391700", "6399200", // agências de notícias, outros serviços de informação
    ],
  },
  {
    id: "consultoria-empresas",
    label: "Consultoria e apoio a empresas",
    exemplo: "Dou consultoria de gestão para dono de pequena empresa",
    cnaes: [
      "7020400", "7210000", "7220700", // consultoria, P&D
      "7490101", "7490104", "7490105", "7490199", // tradução, intermediação, agenciamento
      "8211300", "8219901", "8219999", // escritório e apoio administrativo
      "8220200", "8291100", // teleatendimento, cobrança
      "8299702", "8299703", "8299705", "8299707", "8299799", // vales, carimbos, fundos, internet, outros
      "7723300", "7733100", // aluguel de objetos e de máquinas de escritório
    ],
  },
  {
    id: "educacao",
    label: "Educação e cursos",
    exemplo: "Dou aula particular de inglês online",
    cnaes: [
      "8550302", "8592901", "8592902", "8592903", "8592999", "8593700",
      "8599603", "8599604", "8599605", "8599699",
    ],
  },
  {
    id: "beleza-bemestar",
    label: "Beleza, bem-estar e pets",
    exemplo: "Atendo em salão de beleza e faço unha",
    cnaes: [
      "9601701", "9601702", "9601703", // lavanderia, tinturaria, toalheiro
      "9602501", "9602502", // cabeleireiro, estética
      "9609202", "9609204", "9609299", // agência matrimonial, máquinas, outros pessoais
      "9609207", "9609208", // pets
    ],
  },
  {
    id: "eventos-cultura",
    label: "Eventos, cultura e esporte",
    exemplo: "Organizo festa e evento corporativo",
    cnaes: [
      "9001901", "9001902", "9001903", "9001904", "9001906", "9001999", // produção cênica e musical
      "9002701", "9002702", "9003500", // artistas, restauração de obra, gestão de espaço
      "9311500", "9313100", "9319101", "9319199", // esporte e condicionamento físico
      "9329801", "9329802", "9329803", "9329804", "9329899", // recreação
      "8230001", "8230002", // feiras, congressos, casas de festa
      "7911200", "7912100", "7990200", // turismo
    ],
  },
  {
    id: "manutencao-reparos",
    label: "Limpeza, manutenção e reparos",
    exemplo: "Faço limpeza em prédio e em condomínio",
    cnaes: [
      "8111700", "8121400", "8122200", "8129000", "8130300", // apoio a edifícios, limpeza, pragas, paisagismo
      "9511800", "9512600", "9521500", // reparo de computador, comunicação, eletroeletrônico
      "9529101", "9529102", "9529103", "9529104", "9529105", "9529106", "9529199", // reparos diversos
      "5223100", "5229001", "5229002", "5229099", // estacionamento, apoio a táxi, reboque
      "3600602", "3702900", "3811400", "3821100", // água por caminhão, esgoto, resíduos
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   GUARDA-CORPO
   ═══════════════════════════════════════════════════════════════════════════ */

const reais = out.filter((r) => r.veredito === "real");
const porCnae = new Map(reais.map((r) => [r.cnae, r]));

const dono = new Map();
for (const p of PILLS) {
  for (const c of p.cnaes) {
    if (dono.has(c)) {
      throw new Error(
        `CNAE ${fmt(c)} em 2 pills: "${dono.get(c)}" e "${p.id}". Uma atividade, uma promessa.`
      );
    }
    dono.set(c, p.id);
    if (!porCnae.has(c)) {
      throw new Error(
        `Pill "${p.id}" promete ${fmt(c)}, que NÃO está entre os ${reais.length} reais. Promessa sem lastro.`
      );
    }
  }
}

const orfaos = reais.filter((r) => !dono.has(r.cnae));
if (orfaos.length) {
  throw new Error(
    `${orfaos.length} CNAE real sem pill (a tela não anuncia o que a gente atende):\n` +
      orfaos.map((r) => `  ${fmt(r.cnae)} ${r.descricao}`).join("\n")
  );
}

module.exports = { PILLS, reais };

/* ═══════════════════════════════════════════════════════════════════════════
   SAÍDA
   ═══════════════════════════════════════════════════════════════════════════ */

function gerarNota() {
  const L = [];
  L.push("---");
  L.push("tipo: derivado");
  L.push("status: rascunho");
  L.push("data: 2026-07-16");
  L.push("assunto: taxonomia-pills-n4");
  L.push("deriva_de: [limpeza-260-servico]");
  L.push("gerado_por: pesquisa/cnae-matriz/taxonomia-pills.js");
  L.push("tags: [cnae, ux, n4, pills, rascunho]");
  L.push("---");
  L.push("");
  L.push("# 🏷️ Taxonomia de pills do N4");
  L.push("");
  L.push(
    "> ⚠️ **NOTA DERIVADA. Não editar na mão.** Sai de `node pesquisa/cnae-matriz/taxonomia-pills.js --nota`."
  );
  L.push("");
  L.push("## ⚠️ Confiança desta lista");
  L.push("");
  L.push(
    `As **${reais.length} subclasses** aqui embaixo **não são lista validada**. São as que sobreviveram à classificação de 16/07 sem serem refutadas ([[limpeza-260-servico]]). **Nenhum contador olhou.** A taxonomia herda exatamente essa confiança.`
  );
  L.push("");
  L.push(
    "**Serve pra:** testar o mecanismo da pill no N4. **Não serve pra:** prometer cobertura a cliente."
  );
  L.push("");
  L.push("## Por que pill não é seção do IBGE");
  L.push("");
  L.push(
    "Ninguém se apresenta dizendo *\"trabalho com Atividades Administrativas E Serviços Complementares\"*. UX-05: linguagem humana ANTES do código. A seção serviu pra classificar; ela não serve pra falar."
  );
  L.push("");
  L.push("## As pills");
  L.push("");
  L.push("| Pill | CNAEs | Exemplo que ela oferece |");
  L.push("|---|---|---|");
  PILLS.forEach((p) =>
    L.push(`| **${p.label}** | ${p.cnaes.length} | *"${p.exemplo}"* |`)
  );
  L.push(`| | **${reais.length}** | |`);
  L.push("");
  L.push("## 🔎 Leitura honesta");
  L.push("");
  L.push(
    "**9 pills é mais do que eu embarcaria.** A Contabilizei tem 13 e é um dropdown, que rola. Pill é chip, ocupa área. Num vidro de 430pt, 9 pills = 3 a 4 fileiras, e elas comem justamente a caixa de texto que acabou de crescer pra ser superfície de escrita."
  );
  L.push("");
  L.push("**Onde o corte dói menos, se for pra cortar:**");
  L.push("");
  L.push(
    "1. **Fundir `Comunicação e mídia` (7) em `Marketing e publicidade`** → 15. Editora de livro fica torta lá dentro, mas é a fusão mais barata."
  );
  L.push(
    "2. **`Eventos, cultura e esporte` (23) e `Limpeza, manutenção e reparos` (23) são sacos**. Cobrem muito CNAE e pouca identidade: quem faz reboque não se reconhece na mesma pill de quem faz paisagismo. Se der pra medir demanda, provavelmente quebram ou encolhem."
  );
  L.push(
    "3. **A pill não precisa cobrir os 124.** A caixa de texto é o escape, e é melhor que o *\"Minha atividade não está na lista\"* do líder. Cobrir a DEMANDA (5 ou 6 áreas de quem de fato aparece) vale mais que cobrir a LISTA."
  );
  L.push("");
  L.push("⚠️ **Não temos dado de demanda.** A ordem acima é palpite meu, não medição.");
  L.push("");
  L.push("---");
  L.push("");
  L.push("## Composição");
  PILLS.forEach((p) => {
    L.push("");
    L.push(`### ${p.label} (${p.cnaes.length})`);
    L.push("");
    L.push(`> Exemplo: *"${p.exemplo}"*`);
    L.push("");
    L.push("| CNAE | Descrição |");
    L.push("|---|---|");
    p.cnaes
      .map((c) => porCnae.get(c))
      .sort((a, b) => a.cnae.localeCompare(b.cnae))
      .forEach((r) => L.push(`| \`${fmt(r.cnae)}\` | ${r.descricao} |`));
  });
  L.push("");
  return L.join("\n");
}

if (require.main !== module) {
  // importado: só exporta. Ver a mesma nota em classificar-260.js.
} else if (process.argv.includes("--nota")) {
  const alvo = path.join(__dirname, "taxonomia-pills-n4.md");
  fs.writeFileSync(alvo, gerarNota(), "utf8");
  console.log(`nota escrita: ${alvo}`);
} else {
  console.log(`\n✅ guarda-corpo passou: ${reais.length} reais, ${PILLS.length} pills, 0 órfão\n`);
  PILLS.forEach((p) =>
    console.log(`  ${String(p.cnaes.length).padStart(3)}  ${p.label}`)
  );
  console.log(`  ${"─".repeat(34)}`);
  console.log(`  ${String(reais.length).padStart(3)}  total\n`);
}
