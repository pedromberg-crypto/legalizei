// HTML de impressao -> PDF A4, com rodape numerado.
//
// Uso:  node _sistema/pdf/gerar-pdf.mjs <entrada.html> <saida.pdf> ["rodape"]
//
// Playwright em vez de `chrome --headless --print-to-pdf` de proposito:
// o Chrome direto "sucede" e escreve um PDF com a PROPRIA TELA DE ERRO dentro
// quando a fonte nao existe (armadilha real, 32o flow, 12/08). Aqui a fonte e'
// checada antes e o processo morre com codigo != 0 se faltar.
//
// Roda de qualquer pasta: o playwright e' resolvido em app/node_modules na mao
// (ESM resolve pacote pelo caminho do ARQUIVO, nao pelo cwd).
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..');
const require = createRequire(pathToFileURL(path.join(RAIZ, 'app', 'package.json')));
const { chromium } = require('playwright');

const [entrada, saida, rodapeTxt] = process.argv.slice(2);
if (!entrada || !saida) {
  console.error('uso: node gerar-pdf.mjs <entrada.html> <saida.pdf> ["rodape"]');
  process.exit(2);
}

const html = path.resolve(entrada);
const out = path.resolve(saida);
if (!existsSync(html)) {
  console.error('ERRO: fonte HTML nao existe ->', html);
  process.exit(1);
}

const legenda =
  rodapeTxt || 'Legalizai · Estratégia de marketing, leitura para validação · ago/2026';

let browser;
try {
  browser = await chromium.launch();
} catch {
  browser = await chromium.launch({ channel: 'chrome' });
}

const page = await browser.newPage();
await page.goto('file:///' + html.replace(/\\/g, '/'), { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(600);

const rodape = `
<div style="width:100%;font-family:sans-serif;font-size:7pt;color:#A19B92;
     padding:0 13mm;display:flex;justify-content:space-between;align-items:center;">
  <span>${legenda.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span>
  <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
</div>`;

await page.pdf({
  path: out,
  format: 'A4',
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate: rodape,
  margin: { top: '14mm', bottom: '16mm', left: '13mm', right: '13mm' },
});

await browser.close();
console.log('PDF:', out);
