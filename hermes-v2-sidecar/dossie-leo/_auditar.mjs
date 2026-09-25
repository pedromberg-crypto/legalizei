/**
 * ════════════════════════════════════════════════════════════════════════════
 *  dossie-leo/_auditar.mjs  ·  a Lei Zero virou script
 *
 *  🔴 POR QUE ELE EXISTE. "Eu revisei e não achei repetição" e uma opiniao.
 *  Redundancia documental e o defeito que mais produz delirio, e ela nao se
 *  ve lendo: ela aparece quando o MESMO numero mora em dois arquivos e os dois
 *  envelhecem em ritmos diferentes. Quem mede isso e uma varredura, nao o olho.
 *
 *  O que ele pega: um valor de dinheiro, percentual, prazo ou contagem que
 *  aparece em mais de um arquivo sem estar declarado como travessia legitima.
 *
 *  ⚠️ O que ele NAO pega: a mesma regra dita com outras palavras, sem numero.
 *  Essa fronteira e a mesma da trava de anatomia do MEI e da trava de escopo:
 *  script pega forma, sentido continua sendo leitura humana.
 *
 *  Uso:  node dossie-leo/_auditar.mjs
 * ════════════════════════════════════════════════════════════════════════════
 */

import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const AQUI = dirname(fileURLToPath(import.meta.url))

/* Os fatos que tem dono unico. A chave e o rotulo; `dono` e o arquivo onde ele
   PODE morar. Aparecer em qualquer outro e defeito. */
const FATOS = [
  { rotulo: 'mensalidade MEI (49)', re: /R\$ ?49\b/, dono: '03-comercial.md' },
  { rotulo: 'promocao MEI (29)', re: /R\$ ?29\b/, dono: '03-comercial.md' },
  { rotulo: 'mensalidade ME (139)', re: /R\$ ?139\b/, dono: '03-comercial.md' },
  { rotulo: 'promocao ME (99)', re: /R\$ ?99\b/, dono: '03-comercial.md' },
  { rotulo: 'certificado no mercado (209)', re: /R\$ ?209\b/, dono: '03-comercial.md' },
  { rotulo: 'taxa da Junta (281,08)', re: /281,08/, dono: '06-orgaos.md' },
  { rotulo: 'teto MEI ano (81 mil)', re: /R\$ ?81\.?000|R\$ ?81 mil/, dono: '01-escopo.md' },
  { rotulo: 'teto MEI mes (6.750)', re: /6\.750/, dono: '01-escopo.md' },
  { rotulo: 'teto ME ano (360 mil)', re: /R\$ ?360\.?000|R\$ ?360 mil/, dono: '01-escopo.md' },
  { rotulo: 'teto ME mes (30 mil)', re: /R\$ ?30\.?000|R\$ ?30 mil/, dono: '01-escopo.md' },
  { rotulo: 'faixa 1 do Simples (180 mil)', re: /R\$ ?180 mil/, dono: '05-fiscal.md' },
  { rotulo: 'limiar do Fator R (28%)', re: /\b28%/, dono: '05-fiscal.md' },
  { rotulo: 'margem da casa (30%) x multa (30%)', re: /\b30%/, dono: 'AMBIGUO' },
  { rotulo: 'piso do pro-labore (1.621)', re: /1\.621/, dono: '05-fiscal.md' },
  { rotulo: 'teto do INSS (8.475,55)', re: /8\.475,55/, dono: '05-fiscal.md' },
  { rotulo: 'INSS maximo (932,31)', re: /932,31/, dono: '05-fiscal.md' },
  { rotulo: 'CNAEs ME atendidos (87)', re: /\b87\b/, dono: '01-escopo.md' },
  { rotulo: 'CNAEs MEI atendidos (51)', re: /\b51\b/, dono: '01-escopo.md' },
  { rotulo: 'garantia (7 dias)', re: /7 dias/, dono: '09-contrato.md' },
  { rotulo: 'fidelidade (12 meses)', re: /12 meses/, dono: 'AMBIGUO' },
  { rotulo: 'validade da promocao (31/12/2026)', re: /31\/12\/2026/, dono: '03-comercial.md' },
  { rotulo: 'CEP de BH', re: /30000-000|31999-999/, dono: '01-escopo.md' },
]

/* 🔑 `AMBIGUO` nao e preguica: sao numeros que legitimamente descrevem coisas
   DIFERENTES em arquivos diferentes. `30%` e a margem do Fator R no fiscal e a
   multa no contrato; `12 meses` e a fidelidade no contrato e a janela do RBT12
   no fiscal. O script lista onde eles aparecem e quem le decide, em vez de
   fingir um veredito que ele nao tem como dar. */

/* 🔑 O PREFIXO `_` MARCA META, E META NAO E CONHECIMENTO.
   `_MAPA` e `_MIGRACAO` existem para quem CONSTROI a base, nao para o agente
   responder cliente: um e o contrato de fronteiras, o outro e a conferencia do
   corte. Eles nao entram na carga, entao nao podem contar como "segunda casa"
   de um fato. E a propria auditoria provou isso ao se acusar: a tabela que
   documenta a coincidencia do 30% precisa escrever 30% para poder avisar. */
const arquivos = readdirSync(AQUI)
  .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
  .sort()

const texto = new Map(arquivos.map((f) => [f, readFileSync(join(AQUI, f), 'utf8')]))

let defeitos = 0
let ambiguos = 0

console.log(`\nauditando ${arquivos.length} arquivos\n${'─'.repeat(72)}`)

for (const fato of FATOS) {
  const onde = arquivos.filter((f) => {
    /* O `_MAPA` cita rotulo, nunca valor, entao ele nao conta como casa. E
       linha que APONTA para outro arquivo tambem nao: `03-comercial.md` numa
       frase e referencia, nao copia. */
    const corpo = texto
      .get(f)
      .split('\n')
      .filter((l) => !/`\d\d-[a-z-]+\.md`/.test(l))
      .join('\n')
    return fato.re.test(corpo)
  })

  if (onde.length <= 1) continue

  if (fato.dono === 'AMBIGUO') {
    ambiguos++
    console.log(`🟡 ${fato.rotulo}`)
    console.log(`   aparece em: ${onde.join(' · ')}  (leitura humana decide)`)
    continue
  }

  const invasores = onde.filter((f) => f !== fato.dono)
  if (!invasores.length) continue

  defeitos++
  console.log(`🔴 ${fato.rotulo}`)
  console.log(`   dono: ${fato.dono}`)
  console.log(`   também em: ${invasores.join(' · ')}`)
}

console.log('─'.repeat(72))
console.log(`${defeitos} defeito(s) de Lei Zero · ${ambiguos} ambiguidade(s) para ler\n`)
process.exitCode = defeitos > 0 ? 1 : 0
