/**
 * ════════════════════════════════════════════════════════════════════════════
 *  seed/verificar-carga.ts  ·  o que o banco recusaria, dito antes de tentar
 *
 *  Roda OFFLINE e aplica aos 58 cartoes e aos trechos de nota exatamente os
 *  dois predicados dos CHECKs do `schema.sql`. Sai com codigo 1 se algo
 *  passaria a ser recusado.
 *
 *  🔑 Por que existe: em 20/09 a carga no Supabase deu rollback e a unica
 *  informacao disponivel era o nome da constraint. Descobrir QUEM violou exigiu
 *  uma volta inteira de diagnostico, com banco no meio. Esta checagem responde a
 *  mesma pergunta em um segundo, sem rede, e aponta o trecho exato.
 *
 *  Ela tambem pega o que a constraint NAO pega e mesmo assim quebra a carga:
 *  cartao com campo vazio e cartao que engoliu a secao seguinte.
 *
 *    node --test  nao: isto e script, nao teste
 *    node .build/seed/verificar-carga.js
 * ════════════════════════════════════════════════════════════════════════════
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import {
  parsearCartoes, fatiarNota, sanitizarNumeros,
  PREDICADO_NUMERO, PREDICADO_TRAVESSAO, RAIZ,
} from './carregar-conhecimento.js'



const REFERENCES = join(RAIZ, '_origem', 'vault-v12', 'skills-legalizai', 'base-legalizai', 'references')

interface Problema { onde: string; o_que: string; trecho: string }

function casar(re: RegExp, texto: string): string | null {
  const copia = new RegExp(re.source, re.flags.replace('g', ''))
  return texto.match(copia)?.[0] ?? null
}

function contexto(texto: string, achado: string): string {
  const i = texto.indexOf(achado)
  return `...${texto.slice(Math.max(0, i - 70), i + 70).replace(/\s+/g, ' ')}...`
}

export function verificar(): Problema[] {
  const problemas: Problema[] = []

  // ── Cartoes ───────────────────────────────────────────────────────────────
  const cartoes = parsearCartoes(readFileSync(join(RAIZ, 'CARTOES-PRODUTO.md'), 'utf8'))

  if (cartoes.length !== 58) {
    problemas.push({
      onde: 'CARTOES-PRODUTO.md',
      o_que: `o parse achou ${cartoes.length} cartoes, a lista ratificada tem 58`,
      trecho: '',
    })
  }

  for (const c of cartoes) {
    const corpo = `${c.estado} ${c.acao} ${c.restricao}`

    const numero = casar(PREDICADO_NUMERO, corpo)
    if (numero) {
      problemas.push({
        onde: `cartao ${c.id}`,
        o_que: `CHECK cartao_sem_numero recusaria: "${numero}"`,
        trecho: contexto(corpo, numero),
      })
    }

    const travessao = casar(PREDICADO_TRAVESSAO, `${c.titulo}${corpo}`)
    if (travessao) {
      problemas.push({
        onde: `cartao ${c.id}`,
        o_que: 'CHECK cartao_sem_travessao recusaria',
        trecho: contexto(corpo, travessao),
      })
    }

    // 🔴 O que a constraint nao pega, e que ja aconteceu de verdade: o ultimo
    //    cartao de cada secao engolir o cabecalho da secao seguinte. O banco
    //    aceita numa boa, e o cartao de reajuste de plano passa a responder
    //    pergunta de folha de pagamento.
    if (/\n?---|\s## |^## /.test(c.restricao) || /^>|\s> /.test(c.restricao)) {
      problemas.push({
        onde: `cartao ${c.id}`,
        o_que: 'a restricao engoliu conteudo da secao seguinte',
        trecho: `...${c.restricao.slice(-110)}`,
      })
    }

    for (const [nome, valor] of Object.entries({ estado: c.estado, acao: c.acao, restricao: c.restricao })) {
      if (!valor.trim()) {
        problemas.push({ onde: `cartao ${c.id}`, o_que: `campo ${nome} vazio`, trecho: '' })
      }
    }
  }

  // ── Notas ─────────────────────────────────────────────────────────────────
  let trechos = 0
  let sanitizados = 0

  for (const arquivo of readdirSync(REFERENCES).filter((f) => f.endsWith('.md')).sort()) {
    for (const t of fatiarNota(arquivo, readFileSync(join(REFERENCES, arquivo), 'utf8'))) {
      trechos++
      const limpo = sanitizarNumeros(t.trecho)
      if (limpo !== t.trecho) sanitizados++

      // Depois da sanitizacao nao pode sobrar nada: se sobrar, o banco recusa
      // e o trecho fica de fora da base do agente sem ninguem perceber.
      const restou = casar(PREDICADO_NUMERO, limpo)
      if (restou) {
        problemas.push({
          onde: `nota ${t.id}`,
          o_que: `sobrou numero depois da sanitizacao: "${restou}"`,
          trecho: contexto(limpo, restou),
        })
      }
    }
  }

  console.log(`cartoes: ${cartoes.length} · trechos: ${trechos} · sanitizados: ${sanitizados}`)
  return problemas
}

const problemas = verificar()

if (problemas.length === 0) {
  console.log('✅ nada seria recusado pelo banco')
} else {
  console.error(`\n🔴 ${problemas.length} problema(s):\n`)
  for (const p of problemas) {
    console.error(`  ${p.onde}: ${p.o_que}`)
    if (p.trecho) console.error(`    ${p.trecho}`)
  }
  process.exit(1)
}
