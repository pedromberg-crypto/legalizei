/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 FOLHA ÚNICA — o panorama do sócio numa página A4 só.
 * ═══════════════════════════════════════════════════════════════════════════
 * `node _sistema/pdf/montar-folha-unica.mjs`
 *
 * Pedido do Pedro em 15/09: *"pode criar um PDF de folha única com esses dados
 * que levantamos, esse eu enviarei para o Mauro."*
 *
 * 🔑 **Por que não usei o pipeline normal.** O `gerar-html.py` é feito para
 * nota longa e respirada — o mesmo conteúdo saiu em **5 páginas**. Folha única
 * é outro problema de design: duas colunas, tipo menor, tabela sem zebra e
 * hierarquia por peso em vez de por espaço.
 *
 * ⚠️ O que ele reaproveita do pipeline, de propósito: as **fontes Sora
 * embutidas em base64** (extraídas para `.build/_fontes.css`) e a **paleta**.
 * Assim a folha única não vira um segundo padrão visual.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..", "..");
const FONTES = readFileSync(resolve(AQUI, ".build", "_fontes.css"), "utf8");

/** A paleta, tirada do `globals.css` do app. */
const C = {
  papel: "#FAF8F5",
  tinta: "#1A1614",
  suave: "#6B635C",
  linha: "#E8E2DA",
  coral: "#F2643C",
  coralClaro: "#FEF3EE",
  verde: "#2E7D52",
  amarelo: "#B8860B",
  vermelho: "#C0392B",
  laranja: "#D4711F",
};

const L = { "🟢": C.verde, "🟡": C.amarelo, "🔴": C.vermelho, "🟠": C.laranja };
const luz = (m) =>
  `<span class="luz" style="background:${L[m] ?? C.suave}"></span>`;

/** Uma tabela compacta: título + linhas [nome, texto, marca]. */
const bloco = (titulo, linhas, n) => `
<section class="bloco">
  <h2><i>${n}</i>${titulo}</h2>
  <table>
    ${linhas
      .map(
        ([nome, texto, marca]) => `<tr>
      <td class="l">${luz(marca)}</td>
      <td class="n">${nome}</td>
      <td class="t">${texto}</td>
    </tr>`
      )
      .join("")}
  </table>
</section>`;

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>Legalizai — panorama</title>
<style>
${FONTES}
@page { size: A4; margin: 9mm 10mm; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Sora', system-ui, sans-serif;
  background: ${C.papel}; color: ${C.tinta};
  font-size: 7.1pt; line-height: 1.32;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
header { border-bottom: 2.2pt solid ${C.coral}; padding-bottom: 2.4mm; margin-bottom: 2.8mm; }
h1 { font-size: 15pt; font-weight: 800; letter-spacing: -0.4pt; }
h1 em { color: ${C.coral}; font-style: normal; }
.sub { color: ${C.suave}; font-size: 7pt; margin-top: 1.1mm; font-weight: 500; }
.sub b { color: ${C.tinta}; font-weight: 700; }

/* O destaque do custo por lead: a única coisa que respira na folha. */
.destaque {
  background: ${C.coralClaro}; border-left: 2.4pt solid ${C.coral};
  padding: 2.4mm 3mm; margin-bottom: 3mm; border-radius: 0 2mm 2mm 0;
  display: flex; align-items: center; gap: 4mm;
}
.destaque .nums { display: flex; gap: 5.5mm; white-space: nowrap; }
.destaque .num b { display: block; font-size: 13pt; font-weight: 800; line-height: 1; color: ${C.coral}; }
.destaque .num span { font-size: 5.9pt; color: ${C.suave}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.25pt; }
.destaque p { font-size: 7.3pt; line-height: 1.38; }
.destaque p b { font-weight: 700; }

.colunas { column-count: 2; column-gap: 5.5mm; column-fill: balance; }
.bloco { break-inside: avoid; margin-bottom: 2.6mm; }
h2 {
  font-size: 7.6pt; font-weight: 800; text-transform: uppercase;
  letter-spacing: 0.35pt; margin-bottom: 1.1mm;
  display: flex; align-items: center; gap: 1.6mm;
}
h2 i {
  font-style: normal; background: ${C.coral}; color: #fff;
  width: 3.5mm; height: 3.5mm; border-radius: 0.8mm;
  font-size: 5.6pt; display: flex; align-items: center; justify-content: center; font-weight: 800;
}
table { width: 100%; border-collapse: collapse; }
tr { border-bottom: 0.4pt solid ${C.linha}; }
tr:last-child { border-bottom: 0; }
td { padding: 0.85mm 0; vertical-align: top; }
td.l { width: 3mm; padding-top: 1.35mm; }
td.n { width: 31%; font-weight: 700; padding-right: 1.6mm; }
td.t { color: ${C.suave}; }
td.t b { color: ${C.tinta}; font-weight: 700; }
.luz { display: block; width: 1.7mm; height: 1.7mm; border-radius: 50%; }

footer {
  margin-top: 2.6mm; padding-top: 2.2mm; border-top: 0.6pt solid ${C.linha};
  font-size: 7.2pt; line-height: 1.4;
}
footer b { font-weight: 700; }
footer .rod { margin-top: 1.6mm; color: ${C.suave}; font-size: 5.9pt; display: flex; justify-content: space-between; }
</style></head><body>

<header>
  <h1>Legalizai — onde chegamos em <em>71 dias</em></h1>
  <div class="sub">07/07 a 15/09/2026 · <b>58</b> dias trabalhados · <b>283</b> entregas · <b>584</b> commits · <b>13</b> reuniões · <b>140</b> leads captados</div>
</header>

<div class="destaque">
  <div class="nums">
    <div class="num"><b>140</b><span>leads</span></div>
    <div class="num"><b>R$ 13,61</b><span>nosso custo</span></div>
    <div class="num"><b>R$ 30,00</b><span>benchmark meta</span></div>
    <div class="num"><b>−55%</b><span>abaixo do mercado</span></div>
  </div>
  <p>Com o mesmo dinheiro, ao custo de mercado, teríamos <b>63 leads</b>. Compramos <b>140</b> — e com o produto <b>ainda não lançado</b>. A conversão vem só da promessa, da landing page e da marca.</p>
</div>

<div class="colunas">
${bloco("Produto", [
  ["App de abertura", "103 telas: 58 do caminho ME, 34 do MEI, 9 da migração", "🟢"],
  ["Backend ligado ao app", "do primeiro clique até a <b>1ª assinatura</b>, já depois do pagamento da guia da Junta", "🟢"],
  ["Gateway de pagamento", "configurado na operadora, em fase final de testes", "🟡"],
  ["Portal do cliente", "32 telas — o que ele usa depois que a empresa existe", "🟢"],
  ["Motor fiscal", "<b>158 conferências automáticas</b>, conferido contra recibos reais da Receita e batendo ao centavo", "🟢"],
  ["Base de atividades", "1.332 CNAEs mapeados, <b>87 atendidos</b>. Parecer técnico amanhã", "🟡"],
  ["Catálogo", "58 funcionalidades: 40 com tela, 58 com processo desenhado", "🟢"],
], 1)}

${bloco("Sistemas internos", [
  ["CRM", "construído e <b>online</b>. Desenho base e funcionalidades existem. <b>Prioridade para o lançamento</b>", "🟡"],
  ["Portal de gestão", "construído e online. Cruzará dados para decisão de negócio e marketing. <b>Segundo plano de propósito</b> — não bloqueia", "🟢"],
], 2)}

${bloco("Captação — já rodando", [
  ["Campanhas Meta", "<b>5 campanhas</b> rodadas e otimizadas, no ar desde 15/08", "🟢"],
  ["Google Ads", "plataforma configurada; 1ª campanha de busca começa hoje", "🟡"],
  ["Site (home)", "finalizado e no ar", "🟢"],
  ["Landing page", "formulário de lista de espera no ar — é o que converte os 140", "🟢"],
  ["Redes sociais", "calendário editorial em dia; LinkedIn da empresa criado e configurado", "🟢"],
], 3)}

${bloco("Base", [
  ["Contrato próprio", "minuta de 16 cláusulas, com a advogada", "🟡"],
  ["Preço ME", "<b>R$ 139</b>/mês. Ofertas de R$ 79 e R$ 99 nas 3 primeiras competências", "🟢"],
  ["Preço MEI", "<b>R$ 49</b>/mês cheio. Promoções de R$ 19 e R$ 29 nos 3 primeiros meses", "🟢"],
  ["Marca", "design system completo, personagem próprio, 1ª campanha auditada sem reprovações", "🟢"],
  ["Pesquisa fiscal", "9 rodadas em fonte primária, 5 documentos oficiais salvos na íntegra", "🟢"],
  ["Concorrente", "25 evidências datadas, conta paga destrinchada por dentro", "🟢"],
], 4)}

${bloco("O que separa do lançamento", [
  ["Transmitir ao governo", "eSocial e Integra Contador/SERPRO — canais identificados, documentação em estudo", "🟡"],
  ["Emitir nota fiscal", "pela API pública do governo; em estudo", "🟡"],
  ["Backend pós-assinatura", "continua depois da validação do <b>RPA da JUCEMG</b>, que está em aplicação", "🟡"],
  ["CRM falando com o app", "ligar aos dados do RPA e desenhar a passagem da 1ª assinatura para um humano. <b>Mesma dependência: o RPA</b>", "🟡"],
  ["Gateway em produção", "testes finais", "🟡"],
  ["Ratificação das 87 atividades", "parecer técnico interno amanhã", "🔴"],
  ["Contrato assinado", "com a advogada", "🔴"],
  ["Gate do Simples", "descoberto em 15/09: é possível vender, abrir e a opção ser indeferida depois", "🟠"],
  ["Tributação do repasse", "6% a 16% sobre dinheiro de terceiro (taxa da Junta e certificado). Precisa do financeiro", "🟠"],
], 5)}
</div>

<footer>
  O produto está construído, a demanda está comprovada e sai <b>mais barata que o mercado</b>, e o que falta é <b>de outra natureza do que já foi feito</b>: integração, ratificação e assinatura. A parte difícil de descobrir já foi descoberta.
  <div class="rod"><span>Legalizai · panorama para o sócio</span><span>15 de setembro de 2026</span></div>
</footer>
</body></html>`;

const saida = resolve(AQUI, ".build", "panorama-folha-unica.html");
writeFileSync(saida, html, "utf8");
console.log(`HTML de folha única: ${saida} (${html.length} bytes)`);
