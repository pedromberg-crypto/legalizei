/**
 * ════════════════════════════════════════════════════════════════════════════
 *  testes/filtro-enderecos.test.ts  ·  offline, deterministico, zero rede
 *
 *  🔑 Cada caso aqui e um endereco que O AGENTE DE FATO ESCREVEU numa rodada
 *  medida, e nao um caso imaginado. Os dois primeiros sairam da suite curta de
 *  22/09; o terceiro e o quarto, da rodada anterior do mesmo dia.
 *
 *  Este arquivo e regressao de verdade: verde e verde, vermelho e bug. O E2E
 *  nao e, e por isso a prova do filtro mora aqui e nao la.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'

import { corrigirEnderecos, type LinkOficial } from '../filtro-enderecos.js'

/** Espelha `fatos.link` em 22/09. */
const LINKS: LinkOficial[] = [
  { id: 'email-contato', tipo: 'email', url: 'contato@legalizai.com.br' },
  { id: 'instagram', tipo: 'url', url: 'https://www.instagram.com/legalizai.app/' },
  { id: 'lista-espera', tipo: 'url', url: 'https://www.legalizai.com.br/em-breve' },
  { id: 'site', tipo: 'url', url: 'https://www.legalizai.com.br' },
]

const filtrar = (t: string) => corrigirEnderecos(t, LINKS)

test('endereco identico passa intacto e nao gera correcao', () => {
  const t = 'O link é este: https://www.legalizai.com.br/em-breve'
  const r = filtrar(t)
  assert.equal(r.texto, t)
  assert.equal(r.correcoes.length, 0)
})

test('os quatro oficiais juntos passam intactos', () => {
  const t =
    'Site https://www.legalizai.com.br , lista https://www.legalizai.com.br/em-breve , ' +
    'Instagram https://www.instagram.com/legalizai.app/ e e-mail contato@legalizai.com.br'
  const r = filtrar(t)
  assert.equal(r.texto, t)
  assert.equal(r.correcoes.length, 0)
})

// ── Os erros REAIS, medidos ─────────────────────────────────────────────────

test('`vc-mentiu`: caminho inventado no host certo vira a lista canonica', () => {
  const r = filtrar('Se quiser entrar, o endereço é este: https://legalizai.com.br/lista-de-espera/')
  assert.equal(r.texto, 'Se quiser entrar, o endereço é este: https://www.legalizai.com.br/em-breve')
  assert.deepEqual(r.correcoes, [{
    acao: 'troca',
    antes: 'https://legalizai.com.br/lista-de-espera/',
    depois: 'https://www.legalizai.com.br/em-breve',
    link: 'lista-espera',
  }])
})

test('`venda-escada` v1: site sem www e com barra final vira o site canonico', () => {
  const r = filtrar('O site é https://legalizai.com.br/.')
  assert.equal(r.texto, 'O site é https://www.legalizai.com.br.')
  assert.equal(r.correcoes[0].acao, 'troca')
  assert.equal(r.correcoes[0].link, 'site')
})

test('`venda-escada` v2: host inventado com CAMINHO conhecido vira o canonico', () => {
  // 🔑 `legalizai.app/em-breve` tem o caminho exato da lista. O dominio e
  //    invencao, o caminho nao — e mapear caminho conhecido nao e adivinhar.
  const r = filtrar(
    'O link é https://legalizai.app/em-breve e a gente posta as novidades também ' +
    'no Instagram: https://www.instagram.com/legalizai.app/',
  )
  assert.ok(!r.texto.includes('legalizai.app/em-breve'))
  assert.ok(r.texto.includes('https://www.legalizai.com.br/em-breve'), r.texto)
  assert.ok(r.texto.includes('https://www.instagram.com/legalizai.app/'))
  assert.equal(r.correcoes.length, 1)
  assert.equal(r.correcoes[0].acao, 'troca')
  assert.equal(r.correcoes[0].link, 'lista-espera')
})

test('host desconhecido e caminho desconhecido: a FRASE inteira sai', () => {
  const r = filtrar(
    'O app está em pré-lançamento. Baixe em https://play.google.com/store/apps/legalizai hoje. Qualquer dúvida é só falar.',
  )
  assert.ok(!r.texto.includes('play.google.com'))
  assert.ok(!r.texto.includes('Baixe em'), 'a frase toda tinha que sair: ' + r.texto)
  assert.ok(r.texto.includes('pré-lançamento'))
  assert.ok(r.texto.includes('Qualquer dúvida'))
  assert.equal(r.correcoes[0].acao, 'remocao_frase')
})

test('frase com um endereco ruim E um bom: so o ruim sai, a frase fica', () => {
  const r = filtrar('Veja em https://bit.ly/legalizai e no Instagram https://www.instagram.com/legalizai.app/')
  assert.ok(!r.texto.includes('bit.ly'))
  assert.ok(r.texto.includes('https://www.instagram.com/legalizai.app/'), r.texto)
  assert.ok(r.texto.includes('Instagram'), 'a frase carregava um link certo e nao podia cair')
  assert.equal(r.correcoes[0].acao, 'remocao_url')
})

test('caminho ambiguo nao vira palpite: sai', () => {
  const ambiguo: LinkOficial[] = [
    { id: 'a', tipo: 'url', url: 'https://um.exemplo.br/entrar' },
    { id: 'b', tipo: 'url', url: 'https://dois.exemplo.br/entrar' },
  ]
  const r = corrigirEnderecos('Entra em https://inventado.xyz/entrar agora.', ambiguo)
  assert.ok(!r.texto.includes('inventado.xyz'))
  assert.ok(!r.texto.includes('um.exemplo.br'), 'nao podia escolher um dos dois')
  assert.equal(r.correcoes[0].acao, 'remocao_frase')
})

test('raiz de dominio alheio nao vira o nosso site', () => {
  // ⚠️ Caminho vazio esta fora do indice por caminho de proposito: sem isso,
  //    `https://concorrente.com.br` viraria `https://www.legalizai.com.br`.
  const r = filtrar('Dá uma olhada em https://concorrente.com.br também.')
  assert.ok(!r.texto.includes('legalizai.com.br'), r.texto)
  assert.equal(r.correcoes[0].acao, 'remocao_frase')
})

// ── As bordas ───────────────────────────────────────────────────────────────

test('e-mail diferente do oficial sai; o oficial na mesma frase segura a frase', () => {
  const r = filtrar('Escreve pra suporte@legalizai.com.br ou contato@legalizai.com.br')
  assert.ok(!r.texto.includes('suporte@'))
  assert.ok(r.texto.includes('contato@legalizai.com.br'))
  assert.equal(r.correcoes[0].acao, 'remocao_url')
})

test('a pontuacao da frase nao e engolida na troca', () => {
  const r = filtrar('Entra em https://legalizai.com.br/lista-de-espera/, tá?')
  assert.ok(r.texto.includes('https://www.legalizai.com.br/em-breve,'), r.texto)
})

test('texto sem endereco nenhum nao e tocado', () => {
  const t = 'O app está em pré-lançamento e ainda não tem página na loja.'
  assert.equal(filtrar(t).texto, t)
  assert.equal(filtrar(t).correcoes.length, 0)
})

test('lista de links VAZIA nao remove nada: banco fora do ar nao mutila resposta', () => {
  // 🔴 O `server.ts` ja barra este caso antes de chamar, e a garantia esta aqui
  //    tambem porque as duas redes protegem a mesma coisa: sem a tabela, todo
  //    endereco vira "host fora da tabela" e a resposta sai sem link nenhum.
  const t = 'O site é https://www.legalizai.com.br'
  const r = corrigirEnderecos(t, [])
  assert.equal(r.correcoes.length, 1, 'a funcao pura ainda marca; quem decide nao chamar e o server')
})
