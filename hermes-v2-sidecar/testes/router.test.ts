/**
 * ════════════════════════════════════════════════════════════════════════════
 *  testes/router.test.ts  ·  a blindagem da trava comercial
 *
 *  Roda OFFLINE. Sem banco, sem `pg`, sem chave de LLM. Foi para isso que as
 *  dependencias de I/O do roteador viraram injetaveis: trava que so pode ser
 *  testada com infraestrutura de pe nao vira regressao, vira intencao.
 *
 *  🔴 O TESTE OBRIGATORIO E O `trava comercial`: falha tecnica precisa barrar
 *  a saida comercial. E ele nao verifica so o texto: conta as CHAMADAS ao LLM.
 *  Um teste que so olhasse a resposta passaria mesmo com o sidecar rodando e
 *  devolvendo vazio por acaso, e ai a trava estaria quebrada sem ninguem ver.
 *
 *  node --experimental-strip-types --test testes/router.test.ts
 * ════════════════════════════════════════════════════════════════════════════
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  responder, decidirSaida, podeInjetarGancho, MARCA_LACUNA, type Deps,
} from '../router.js'
import type { Llm, Sinais, Resolucao, Embedder, Saida, FalhaTipo } from '../tipos.js'

// ── Andaimes ────────────────────────────────────────────────────────────────

const SINAIS_BASE: Sinais = {
  gatilho_escalonamento: false,
  fora_do_escopo: false,
  pergunta_tecnica: false,
  interesse_comercial: false,
  tensao: false,
  resumo: 'teste',
}

function sinais(p: Partial<Sinais>): Sinais {
  return { ...SINAIS_BASE, ...p }
}

function resolucao(p: Partial<Resolucao>): Resolucao {
  return {
    texto: 'resposta', ok: true, falhaTipo: null,
    cartoesUsados: [], fatosLidos: [], toolsChamadas: [], tokensEntrada: 0, tokensSaida: 0, tokensCache: 0,
    ...p,
  }
}

interface RespostaFalsa {
  texto: string
  chamadas?: { nome: string; argumentos: Record<string, unknown> }[]
}

/** LLM de mentira com fila de respostas. Conta quantas vezes foi chamado. */
function llmFalso(fila: RespostaFalsa[]) {
  const chamadasFeitas: { sistema: string }[] = []
  const llm: Llm = {
    async completar({ sistema }) {
      chamadasFeitas.push({ sistema })
      const r = fila.shift()
      if (!r) throw new Error('o roteador chamou o LLM mais vezes do que o teste previu')
      return {
        texto: r.texto,
        chamadas: r.chamadas ?? [],
        tokensEntrada: 100,
        tokensSaida: 20,
      }
    },
  }
  return { llm, chamadasFeitas, sobraram: () => fila.length }
}

const embedderFalso: Embedder = { async gerar() { return new Array(1536).fill(0) } }

interface Gravado {
  saida: Saida
  tecnicaOk: boolean
  falhaTipo: FalhaTipo | null
  textoLeo: string
}

function depsFalsas(executar?: Deps['executarTool']) {
  const gravados: Gravado[] = []
  const deps: Deps = {
    async carregarHistorico() { return [] },
    async gravarTurno(_s, _cliente, textoLeo, medicao) {
      gravados.push({
        saida: medicao.saida,
        tecnicaOk: medicao.tecnicaOk,
        falhaTipo: medicao.falhaTipo,
        textoLeo,
      })
    },
    async atualizarClassificacao() {},
    executarTool: executar ?? (async () => ({ conteudo: {}, cartoes: [], fatos: [] })),
  }
  return { deps, gravados }
}

const ENTRADA = { contatoId: 'c1', sessaoId: 's1', texto: 'quanto custa pra abrir minha empresa?' }

// ════════════════════════════════════════════════════════════════════════════
//  1. PRECEDENCIA  ·  funcao pura, RULES.md §5.1
// ════════════════════════════════════════════════════════════════════════════

test('gatilho de escalonamento vence pergunta comercial na mesma frase', () => {
  // "tomei multa do meu contador, quanto custa ai?"
  const s = sinais({ gatilho_escalonamento: true, interesse_comercial: true, pergunta_tecnica: true, tensao: true })
  assert.equal(decidirSaida(s), 'escalonamento')
})

test('fora de escopo vence comercial: nao se vende para quem o produto nao atende', () => {
  const s = sinais({ fora_do_escopo: true, interesse_comercial: true, pergunta_tecnica: true })
  assert.equal(decidirSaida(s), 'fora_escopo')
})

test('pergunta tecnica com interesse comercial sai por tecnico, e o comercial vira sidecar', () => {
  const s = sinais({ pergunta_tecnica: true, interesse_comercial: true })
  assert.equal(decidirSaida(s), 'tecnico')
})

test('interesse comercial sozinho sai por comercial', () => {
  assert.equal(decidirSaida(sinais({ interesse_comercial: true })), 'comercial')
})

// ════════════════════════════════════════════════════════════════════════════
//  2. A TRAVA, NA FUNCAO PURA
// ════════════════════════════════════════════════════════════════════════════

test('trava comercial: resolucao tecnica falhada barra o gancho', () => {
  const r = resolucao({ ok: false, falhaTipo: 'lacuna_da_base' })
  assert.equal(podeInjetarGancho(r, sinais({ interesse_comercial: true })), false)
})

test('trava comercial: tensao barra o gancho mesmo com tecnica ok', () => {
  // Esta condicao existe so no Node. O banco nao ve medo, prejuizo nem irritacao.
  const r = resolucao({ ok: true })
  assert.equal(podeInjetarGancho(r, sinais({ interesse_comercial: true, tensao: true })), false)
})

test('trava comercial: sem interesse comercial nao ha gancho', () => {
  assert.equal(podeInjetarGancho(resolucao({ ok: true }), sinais({})), false)
})

test('trava comercial: caminho feliz libera', () => {
  assert.equal(podeInjetarGancho(resolucao({ ok: true }), sinais({ interesse_comercial: true })), true)
})

// ════════════════════════════════════════════════════════════════════════════
//  3. 🔴 O TESTE OBRIGATORIO  ·  ponta a ponta, com LLM de mentira
// ════════════════════════════════════════════════════════════════════════════

test('falha tecnica: o sidecar NAO roda e o plano NAO e oferecido', async () => {
  const { llm, chamadasFeitas } = llmFalso([
    // 1. classificador: tem pergunta tecnica E interesse comercial
    { texto: JSON.stringify(sinais({ pergunta_tecnica: true, interesse_comercial: true })) },
    // 2. resolucao: abre uma tool (portanto ha lastro) e mesmo assim declara lacuna
    { texto: '', chamadas: [{ nome: 'buscar_cartao', argumentos: { situacao: 'abrir empresa' } }] },
    { texto: `${MARCA_LACUNA} Essa eu nao tenho aqui comigo, vou confirmar com o time.` },
    // 🔴 Nao existe 4a resposta na fila de proposito: se o sidecar rodar, o
    //    llmFalso estoura e o teste falha com a mensagem certa.
  ])
  const { deps, gravados } = depsFalsas(async () => ({
    conteudo: [{ id: '7.1', promessa: 'pode' }], cartoes: ['7.1'], fatos: [],
  }))

  const resposta = await responder(ENTRADA, llm, embedderFalso, { deps })

  assert.equal(chamadasFeitas.length, 3, 'o LLM foi chamado 3 vezes: se forem 4, o sidecar rodou')
  assert.equal(resposta.saida, 'tecnico')
  assert.equal(gravados[0].tecnicaOk, false)
  assert.equal(gravados[0].falhaTipo, 'lacuna_da_base')
  assert.ok(!resposta.texto.includes(MARCA_LACUNA), 'a marca interna nao pode vazar para o cliente')
  assert.ok(!/plano|mensalidade|R\$/i.test(resposta.texto), 'nenhuma oferta pode aparecer')
  assert.ok(!resposta.texto.includes('\n\n'), 'sem segunda batida, porque nao houve gancho')
})

test('caminho feliz: tecnica fecha, o sidecar roda e o gancho sai como segunda mensagem', async () => {
  const { llm, chamadasFeitas } = llmFalso([
    { texto: JSON.stringify(sinais({ pergunta_tecnica: true, interesse_comercial: true })) },
    { texto: '', chamadas: [{ nome: 'buscar_cartao', argumentos: { situacao: 'abrir empresa' } }] },
    { texto: 'Abrir eu resolvo por aqui, sem honorario de abertura.' },
    { texto: 'Quer que eu te mostre como fica no seu caso?' },
  ])
  const { deps, gravados } = depsFalsas(async () => ({
    conteudo: [{ id: '7.1' }], cartoes: ['7.1'], fatos: ['plano:me_simples'],
  }))

  const resposta = await responder(ENTRADA, llm, embedderFalso, { deps })

  assert.equal(chamadasFeitas.length, 4, 'classificador, resolucao com tool, resposta e sidecar')
  assert.equal(resposta.saida, 'tecnico')
  assert.equal(gravados[0].tecnicaOk, true)
  assert.equal(gravados[0].falhaTipo, null)
  assert.ok(resposta.texto.includes('\n\n'), 'duas batidas viram duas mensagens no WhatsApp')
  assert.ok(resposta.texto.endsWith('Quer que eu te mostre como fica no seu caso?'))
})

test('comercial puro que nao consegue ler preco CAI para tecnico, em vez de inventar valor', async () => {
  // Espelha a constraint `comercial_exige_tecnica_ok`: o banco recusaria esta
  // linha como `comercial`, e ele estaria certo. Resposta comercial sem lastro
  // e exatamente o que vira numero de memoria.
  const { llm } = llmFalso([
    { texto: JSON.stringify(sinais({ interesse_comercial: true })) },
    { texto: 'Deixa eu confirmar isso com o time.' }, // sem tool: sem lastro
  ])
  const { deps, gravados } = depsFalsas()

  const resposta = await responder(ENTRADA, llm, embedderFalso, { deps })

  assert.equal(resposta.saida, 'tecnico', 'a saida comercial sem lastro nao pode ser gravada')
  assert.equal(gravados[0].saida, 'tecnico')
  assert.equal(gravados[0].tecnicaOk, false)
  assert.equal(gravados[0].falhaTipo, 'lacuna_da_base')
})

test('escalonamento monta o pacote e nao oferece nada', async () => {
  const { llm, chamadasFeitas } = llmFalso([
    { texto: JSON.stringify(sinais({ gatilho_escalonamento: true, interesse_comercial: true, tensao: true })) },
    { texto: 'Multa por erro de quem devia te proteger e foda mesmo. Um atendente nosso assume essa conversa.' },
  ])
  const { deps, gravados } = depsFalsas()

  const resposta = await responder(
    { ...ENTRADA, texto: 'tomei multa do meu contador, quanto custa ai?' },
    llm, embedderFalso, { deps },
  )

  assert.equal(resposta.saida, 'escalonamento')
  assert.equal(chamadasFeitas.length, 2, 'sem sidecar em escalonamento')
  assert.ok(resposta.pacoteEscalonamento, 'a escalacao sai com pacote de contexto')
  assert.ok(!/R\$|plano|mensalidade/i.test(resposta.texto))
  assert.equal(gravados[0].saida, 'escalonamento')
})

test('tool que estoura vira lacuna declarada, nunca improviso', async () => {
  const { llm } = llmFalso([
    { texto: JSON.stringify(sinais({ pergunta_tecnica: true, interesse_comercial: true })) },
    { texto: '', chamadas: [{ nome: 'tool_que_nao_existe', argumentos: {} }] },
    { texto: 'Vou confirmar com o time.' },
  ])
  const { deps, gravados } = depsFalsas(async () => {
    throw new Error('tool desconhecida')
  })

  const resposta = await responder(ENTRADA, llm, embedderFalso, { deps })

  assert.equal(gravados[0].falhaTipo, 'lacuna_da_base')
  assert.equal(gravados[0].tecnicaOk, false)
  assert.equal(resposta.saida, 'tecnico')
})

// ════════════════════════════════════════════════════════════════════════════
//  4. O PROMPT POR TRILHA  ·  a quebra do SOUL so se paga se isto valer
// ════════════════════════════════════════════════════════════════════════════

test('a trilha tecnica carrega menos persona que a comercial', async () => {
  const { llm, chamadasFeitas } = llmFalso([
    { texto: JSON.stringify(sinais({ pergunta_tecnica: true })) },
    { texto: 'Dia 20, todo mes.' },
  ])
  const { deps } = depsFalsas()
  await responder({ ...ENTRADA, texto: 'quando vence a guia?' }, llm, embedderFalso, { deps })

  const sistemaTecnico = chamadasFeitas[1].sistema
  assert.ok(sistemaTecnico.includes('Formato WhatsApp'), 'forma e obrigatoria em toda trilha')
  assert.ok(
    !sistemaTecnico.includes('Banco de falas'),
    'o banco de falas nao entra na trilha mais frequente: e ai que a quebra do SOUL se paga',
  )
})
