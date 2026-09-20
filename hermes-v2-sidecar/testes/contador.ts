/**
 * ════════════════════════════════════════════════════════════════════════════
 *  testes/contador.ts  ·  quanto custou a rodada
 *
 *  Embrulha `Llm` e `Embedder` e conta o que atravessou a rede.
 *
 *  🔑 POR QUE NA BORDA DO PROVEDOR, E NAO NO QUE O ROTEADOR REPORTA.
 *
 *  O roteador ja soma tokens em `conversa.turno_interno`, mas ele so enxerga o
 *  que passa por ele: classificador, resolucao e sidecar. As chamadas de
 *  EMBEDDING ficam fora, porque quem as faz e a tool, por baixo. Contar pelo
 *  roteador daria um numero que parece completo e nao e, e conta de custo que
 *  erra para menos e a pior especie: ninguem vai conferir um relatorio que
 *  tranquiliza.
 *
 *  Aqui o envelope conta TODA chamada, inclusive as que falham depois de
 *  cobradas.
 * ════════════════════════════════════════════════════════════════════════════
 */

import type { Embedder, Llm } from '../tipos.js'

/**
 * 🔴 PRECO COM FONTE E DATA, como toda regra deste repo.
 *
 * Fonte: `execucao/entregas/briefing-agente-leo-2026-09-20.md` §10, tabela de
 * precos por milhao de tokens, levantada em 20/09/2026.
 *
 * ⚠️ Preco de provedor muda sem avisar. O numero aqui e o do dia em que foi
 * escrito, e o relatorio SEMPRE imprime essa data junto do valor: custo sem
 * data de referencia vira numero solto, e numero solto e o que este projeto
 * passou o mes inteiro tirando de dentro de texto.
 */
export const PRECO = {
  modelo: 'gemini-3.1-flash-lite',
  entradaPorMilhao: 0.25,
  saidaPorMilhao: 1.50,
  cachePorMilhao: 0.025,
  fonte: 'briefing-agente-leo-2026-09-20.md §10',
  medidoEm: '2026-09-20',
}

/**
 * ⚠️ O EMBEDDING NAO ENTRA NO CUSTO EM DOLAR, E ISSO E DECLARADO, NAO ESQUECIDO.
 *
 * A tabela de precos do briefing cobre os modelos de geracao. Nao existe, no
 * repo, preco de `gemini-embedding-001` com fonte. Entao o relatorio conta as
 * chamadas e os caracteres, e NAO os converte em dolar: numero sem fonte nao
 * entra, mesmo quando daria para chutar a ordem de grandeza.
 */
export interface Consumo {
  chamadasLlm: number
  tokensEntrada: number
  tokensSaida: number
  chamadasEmbedding: number
  charsEmbedding: number
  falhasDeProvedor: number
}

export function novoConsumo(): Consumo {
  return {
    chamadasLlm: 0,
    tokensEntrada: 0,
    tokensSaida: 0,
    chamadasEmbedding: 0,
    charsEmbedding: 0,
    falhasDeProvedor: 0,
  }
}

export function contarLlm(llm: Llm, consumo: Consumo): Llm {
  return {
    async completar(args) {
      consumo.chamadasLlm++
      try {
        const r = await llm.completar(args)
        consumo.tokensEntrada += r.tokensEntrada
        consumo.tokensSaida += r.tokensSaida
        return r
      } catch (erro) {
        // 🔑 Chamada que falha depois de aceita ja foi cobrada. Some no
        //    contador de falhas e nao no de tokens, porque o provedor nao
        //    devolve `usageMetadata` no erro: o custo dela fica invisivel, e o
        //    certo e dizer que ficou, nao estimar.
        consumo.falhasDeProvedor++
        throw erro
      }
    },
  }
}

export function contarEmbedder(embedder: Embedder, consumo: Consumo): Embedder {
  return {
    async gerar(texto: string) {
      consumo.chamadasEmbedding++
      consumo.charsEmbedding += texto.length
      return embedder.gerar(texto)
    },
  }
}

// ════════════════════════════════════════════════════════════════════════════
//  CAMBIO
// ════════════════════════════════════════════════════════════════════════════

export interface Cambio {
  taxa: number
  fonte: string
  quando: string
}

/**
 * A cotacao do dolar, com fonte declarada.
 *
 * 🔴 Ordem: `USD_BRL` do ambiente primeiro (quem roda manda), depois a API
 * publica da AwesomeAPI. Se as duas falharem, o relatorio sai SO em dolar e
 * diz por que. Nao existe taxa embutida no codigo: cambio chumbado envelhece
 * em dias e vira numero errado com cara de oficial, que e exatamente o defeito
 * que este projeto passou setembro inteiro corrigindo.
 */
export async function buscarCambio(): Promise<Cambio | null> {
  const doAmbiente = process.env.USD_BRL
  if (doAmbiente) {
    const taxa = Number(doAmbiente.replace(',', '.'))
    if (Number.isFinite(taxa) && taxa > 0) {
      return { taxa, fonte: 'variavel de ambiente USD_BRL', quando: 'informado por quem rodou' }
    }
  }

  try {
    const controle = AbortSignal.timeout(5000)
    const r = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL', { signal: controle })
    if (!r.ok) return null
    const j = (await r.json()) as { USDBRL?: { bid?: string; create_date?: string } }
    const taxa = Number(j.USDBRL?.bid)
    if (!Number.isFinite(taxa) || taxa <= 0) return null
    return {
      taxa,
      fonte: 'economia.awesomeapi.com.br (USD-BRL, cotacao de compra)',
      quando: j.USDBRL?.create_date ?? 'sem data na resposta',
    }
  } catch {
    // Rede indisponivel nao derruba a rodada: o relatorio so perde a coluna BRL.
    return null
  }
}

// ════════════════════════════════════════════════════════════════════════════
//  O RELATORIO
// ════════════════════════════════════════════════════════════════════════════

export interface Custo {
  entradaUsd: number
  saidaUsd: number
  totalUsd: number
  totalBrl: number | null
}

export function calcularCusto(consumo: Consumo, cambio: Cambio | null): Custo {
  const entradaUsd = (consumo.tokensEntrada / 1_000_000) * PRECO.entradaPorMilhao
  const saidaUsd = (consumo.tokensSaida / 1_000_000) * PRECO.saidaPorMilhao
  const totalUsd = entradaUsd + saidaUsd
  return {
    entradaUsd,
    saidaUsd,
    totalUsd,
    totalBrl: cambio ? totalUsd * cambio.taxa : null,
  }
}

const usd = (v: number) => `US$ ${v.toFixed(6)}`
const brl = (v: number) => `R$ ${v.toFixed(4).replace('.', ',')}`
const n = (v: number) => v.toLocaleString('pt-BR')

export function imprimirCusto(consumo: Consumo, cambio: Cambio | null, casos: number): void {
  const c = calcularCusto(consumo, cambio)
  const proporcao = consumo.tokensSaida > 0
    ? (consumo.tokensEntrada / consumo.tokensSaida).toFixed(1)
    : '∞'

  console.log('\n' + '─'.repeat(64))
  console.log('CUSTO DA RODADA')
  console.log('─'.repeat(64))
  console.log(`  modelo                  ${PRECO.modelo}`)
  console.log(`  chamadas ao modelo      ${n(consumo.chamadasLlm)}`)
  console.log(`  tokens de entrada       ${n(consumo.tokensEntrada)}`)
  console.log(`  tokens de saida         ${n(consumo.tokensSaida)}`)
  console.log(`  razao entrada/saida     ${proporcao} para 1`)
  console.log('')
  console.log(`  entrada                 ${usd(c.entradaUsd)}`)
  console.log(`  saida                   ${usd(c.saidaUsd)}`)
  console.log(`  TOTAL                   ${usd(c.totalUsd)}${c.totalBrl !== null ? `  ·  ${brl(c.totalBrl)}` : ''}`)
  if (casos > 0) {
    const porCaso = c.totalUsd / casos
    console.log(`  por caso                ${usd(porCaso)}${c.totalBrl !== null ? `  ·  ${brl((c.totalBrl) / casos)}` : ''}`)
  }
  console.log('')
  console.log(`  preco de ${PRECO.entradaPorMilhao}/${PRECO.saidaPorMilhao} por milhao (entrada/saida)`)
  console.log(`  fonte: ${PRECO.fonte}, medido em ${PRECO.medidoEm}`)
  if (cambio) {
    console.log(`  cambio: ${cambio.taxa.toFixed(4)} · ${cambio.fonte} · ${cambio.quando}`)
  } else {
    console.log('  ⚠️ sem cotacao do dolar: defina USD_BRL no ambiente para ver o total em reais')
  }

  if (consumo.chamadasEmbedding > 0) {
    console.log('')
    console.log(`  embedding               ${n(consumo.chamadasEmbedding)} chamadas · ${n(consumo.charsEmbedding)} chars`)
    console.log('  ⚠️ NAO somado ao total: nao ha preco de embedding com fonte no repo.')
  }
  if (consumo.falhasDeProvedor > 0) {
    console.log('')
    console.log(`  🔴 ${consumo.falhasDeProvedor} chamada(s) falharam DEPOIS de aceitas.`)
    console.log('     O provedor nao devolve uso no erro, entao esse custo nao esta acima.')
  }
  console.log('─'.repeat(64))
}
