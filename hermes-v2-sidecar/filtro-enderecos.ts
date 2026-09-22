/**
 * ════════════════════════════════════════════════════════════════════════════
 *  filtro-enderecos.ts  ·  a ultima rede: endereco que sai e endereco da tabela
 *
 *  🔴 POR QUE AQUI, E NAO ANTES DA GERACAO.
 *
 *  A descricao da tool nao segurou: `consultar_links` foi oferecida em 27 de 27
 *  turnos e chamada em 0, com os gatilhos escritos na lingua do cliente. Pior,
 *  o defeito de 22/09 nao tinha gatilho NENHUM na entrada — o cliente disse
 *  "Boa, gostei do valor" e o agente escreveu `https://legalizai.app/em-breve`,
 *  um dominio que nao existe, montado com o `.app` que ele leu no handle do
 *  Instagram. Nada decidido ANTES da geracao pega isso, porque nao ha nada na
 *  pergunta para decidir em cima. O defeito nasce no texto, e e no texto que
 *  ele morre.
 *
 *  🔑 A TABELA E A FONTE, A MEMORIA DO MODELO NAO E. Este modulo nunca carrega
 *  endereco escrito em codigo: recebe as linhas de `fatos.link` e compara. Se a
 *  tabela mudar, o filtro acompanha sem edicao.
 *
 *  As tres decisoes, e por que a terceira e remover:
 *
 *    identico                          passa
 *    variacao do mesmo host            troca pela forma canonica
 *    host errado, caminho conhecido    troca pela forma canonica
 *    nada disso                        REMOVE a frase inteira
 *
 *  🔑 O CAMINHO TAMBEM IDENTIFICA. `legalizai.app/em-breve` tem o caminho
 *  EXATO da lista de espera e so o dominio e inventado — mapear caminho
 *  conhecido para o endereco canonico nao e adivinhar, e ler a tabela por outra
 *  chave. ⚠️ So vale quando o caminho bate com UMA entrada: dois links com o
 *  mesmo caminho em hosts diferentes tornariam a escolha um palpite, e ai o
 *  endereco sai.
 *
 *  Link inventado e pior que link nenhum: sem link a pessoa pergunta de novo,
 *  com link errado ela clica, cai em lugar nenhum e conclui que a empresa nao
 *  existe. Foi o que aconteceu no caso `vc-mentiu`, onde o cliente voltou
 *  dizendo "vc mentiu, nenhum link esta funcionando".
 *
 *  ⚠️ FUNCAO PURA, sem I/O e sem banco. E o que permite prova-la offline, no
 *  `testes/filtro-enderecos.test.ts`, com os casos que de fato sairam errados.
 * ════════════════════════════════════════════════════════════════════════════
 */

/** Uma linha de `fatos.link`, so o que o filtro precisa. */
export interface LinkOficial {
  id: string
  tipo: string
  url: string
}

export interface Correcao {
  /**
   * `troca`         — virou a forma canonica de `fatos.link`.
   * `remocao_frase` — nao deu para salvar, e a frase inteira saiu.
   * `remocao_url`   — so o endereco saiu, porque a frase carregava outro
   *                   endereco VALIDO e apaga-la levaria junto um link certo.
   *                   Foi o caso do `venda-escada`: link da lista inventado e
   *                   Instagram correto na mesma frase.
   */
  acao: 'troca' | 'remocao_url' | 'remocao_frase'
  /** O que o modelo escreveu. */
  antes: string
  /** A forma canonica, ou `null` quando foi removido. */
  depois: string | null
  /** O `fatos.link.id` que sustentou a troca, ou `null` na remocao. */
  link: string | null
}

export interface Resultado {
  texto: string
  correcoes: Correcao[]
}

/**
 * Captura URL e e-mail.
 *
 * ⚠️ A classe final exclui `.,;:!?)` de proposito: o endereco quase sempre
 * termina colado na pontuacao da frase (`... o link e https://x.com/y.`) e
 * engolir o ponto transformaria a correcao em erro novo. A barra final, ao
 * contrario, ENTRA na captura: ela e parte do endereco em `/legalizai.app/` e
 * e justamente uma das variacoes que o filtro precisa normalizar.
 */
const ACHAR = /\bhttps?:\/\/[^\s<>"']+|\b[\w.+-]+@[\w-]+\.[\w.-]+/gi

/** Tira pontuacao que ficou pendurada no fim da captura. */
function semPontuacaoFinal(bruto: string): { endereco: string; cauda: string } {
  const m = bruto.match(/[.,;:!?)]+$/)
  if (!m) return { endereco: bruto, cauda: '' }
  return { endereco: bruto.slice(0, -m[0].length), cauda: m[0] }
}

/** `WWW.Legalizai.COM.BR` e `legalizai.com.br` sao o mesmo host. */
const normalizarHost = (h: string) => h.toLowerCase().replace(/^www\./, '')

/** `/em-breve/` e `/em-breve` sao o mesmo caminho. `/` e vazio. */
const normalizarCaminho = (c: string) => c.replace(/\/+$/, '')

interface Partes { host: string; caminho: string }

function partir(endereco: string): Partes | null {
  try {
    const u = new URL(endereco)
    return { host: normalizarHost(u.hostname), caminho: normalizarCaminho(u.pathname) }
  } catch {
    return null
  }
}

/** Quantos caracteres os dois caminhos compartilham desde o inicio. */
function prefixoComum(a: string, b: string): number {
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) i++
  return i
}

/**
 * Entre os links do MESMO host, qual e a forma canonica deste endereco.
 *
 * 🔑 `www.legalizai.com.br` hospeda dois: o site (caminho vazio) e a lista
 * (`/em-breve`). Escolher "o primeiro" erraria metade das vezes, entao a
 * escolha e por maior prefixo de caminho em comum. Nos dois erros reais isso
 * acerta: `/lista-de-espera/` compartilha a barra com `/em-breve` e vira a
 * lista, enquanto `/` nao compartilha nada e vira o site.
 */
function canonicoDoHost(alvo: Partes, candidatos: { link: LinkOficial; p: Partes }[]): LinkOficial {
  let melhor = candidatos[0]
  let melhorScore = -1
  for (const c of candidatos) {
    const score = c.p.caminho === alvo.caminho
      ? Number.MAX_SAFE_INTEGER
      : prefixoComum(alvo.caminho, c.p.caminho)
    if (score > melhorScore) { melhor = c; melhorScore = score }
  }
  return melhor.link
}

/**
 * Corta o texto em frases, guardando o delimitador em cada pedaco.
 *
 * 🔑 A quebra de linha conta como fim de frase, e nao so o ponto: no WhatsApp o
 * agente escreve em batidas curtas, e "O link e X" costuma ser uma linha
 * inteira sem pontuacao final. Sem isso, apagar "a frase" levaria o paragrafo.
 *
 * ⚠️ O ponto de `https://` e de `legalizai.com.br` nao pode virar fim de frase.
 * Por isso o corte ignora ponto seguido de caractere que nao seja espaco.
 */
function emFrases(texto: string): string[] {
  const partes: string[] = []
  let atual = ''
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i]
    atual += c
    const fimDeLinha = c === '\n'
    const pontuacao = (c === '.' || c === '!' || c === '?') &&
      (i + 1 >= texto.length || /[\s]/.test(texto[i + 1]))
    if (fimDeLinha || pontuacao) { partes.push(atual); atual = '' }
  }
  if (atual) partes.push(atual)
  return partes
}

/**
 * Normaliza o espaco que sobra depois de uma frase apagada.
 *
 * 🔴 NAO escreve texto novo, e essa e a fronteira. O filtro e a ultima rede,
 * nao uma segunda opiniao sobre a resposta: em 20/09 o defeito veio de camadas
 * que reescreviam o que o modelo tinha dito. Apagar e operacao limitada; compor
 * frase nao seria.
 */
function costurar(texto: string): string {
  return texto
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/[ \t]+([.,;:!?])/g, '$1')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * Confere todo endereco do texto contra `fatos.link`.
 *
 * 🔴 NAO decide nada sobre conteudo e nao adiciona endereco que o modelo nao
 * escreveu. Ele so corrige ou remove o que ja esta la: acrescentar link seria
 * o filtro falando pelo agente, e ai voltariamos a ter duas camadas discordando
 * sobre a resposta, que e o defeito de 20/09 descrito no `server.ts`.
 */
export function corrigirEnderecos(texto: string, links: LinkOficial[]): Resultado {
  const correcoes: Correcao[] = []
  if (!texto) return { texto, correcoes }

  const urls = links.filter((l) => l.tipo !== 'email')
  const emails = links.filter((l) => l.tipo === 'email').map((l) => l.url.toLowerCase())

  const porHost = new Map<string, { link: LinkOficial; p: Partes }[]>()
  const porCaminho = new Map<string, LinkOficial[]>()
  for (const link of urls) {
    const p = partir(link.url)
    if (!p) continue
    porHost.set(p.host, [...(porHost.get(p.host) ?? []), { link, p }])
    // ⚠️ Caminho vazio NAO entra no indice por caminho: toda raiz de dominio
    //    inventado casaria com o site e o filtro viraria uma maquina de
    //    transformar dominio alheio em endereco nosso.
    if (p.caminho) porCaminho.set(p.caminho, [...(porCaminho.get(p.caminho) ?? []), link])
  }

  /** O veredito de UM endereco, sem tocar no texto. */
  const julgar = (endereco: string): { acao: 'passa' } | { acao: 'troca'; link: LinkOficial } | { acao: 'sai' } => {
    if (!/^https?:\/\//i.test(endereco)) {
      return emails.includes(endereco.toLowerCase()) ? { acao: 'passa' } : { acao: 'sai' }
    }
    const alvo = partir(endereco)
    if (!alvo) return { acao: 'sai' }

    const mesmoHost = porHost.get(alvo.host)
    if (mesmoHost) {
      const canonico = canonicoDoHost(alvo, mesmoHost)
      return endereco === canonico.url ? { acao: 'passa' } : { acao: 'troca', link: canonico }
    }

    // 🔑 Host desconhecido, caminho conhecido: `legalizai.app/em-breve`.
    //    So quando UMA entrada tem esse caminho — ambiguo e palpite, e palpite
    //    sai.
    const porCam = alvo.caminho ? porCaminho.get(alvo.caminho) : undefined
    if (porCam && porCam.length === 1) return { acao: 'troca', link: porCam[0] }

    return { acao: 'sai' }
  }

  // ── Frase a frase, porque a remocao e por frase ──────────────────────────
  const saida = emFrases(texto).map((frase) => {
    const achados = frase.match(ACHAR) ?? []
    if (achados.length === 0) return frase

    const vereditos = achados.map((bruto) => {
      const { endereco, cauda } = semPontuacaoFinal(bruto)
      return { bruto, endereco, cauda, v: julgar(endereco) }
    })

    const sobrevive = vereditos.filter((x) => x.v.acao !== 'sai')
    const saem = vereditos.filter((x) => x.v.acao === 'sai')

    // 🔴 A FRASE INTEIRA SO CAI SE NADA DE BOM MORRER JUNTO. Quando ela carrega
    //    tambem um endereco valido — `venda-escada`, com a lista inventada e o
    //    Instagram certo na mesma frase — apagar tudo tiraria do cliente um link
    //    que estava correto. Ai so o endereco ruim sai.
    if (saem.length > 0 && sobrevive.length === 0) {
      for (const x of saem) {
        correcoes.push({ acao: 'remocao_frase', antes: x.endereco, depois: null, link: null })
      }
      return ''
    }

    let resultado = frase
    for (const x of vereditos) {
      if (x.v.acao === 'passa') continue
      if (x.v.acao === 'troca') {
        correcoes.push({ acao: 'troca', antes: x.endereco, depois: x.v.link.url, link: x.v.link.id })
        resultado = resultado.replace(x.bruto, x.v.link.url + x.cauda)
      } else {
        correcoes.push({ acao: 'remocao_url', antes: x.endereco, depois: null, link: null })
        resultado = resultado.replace(x.bruto, x.cauda)
      }
    }
    return resultado
  }).join('')

  const mexeu = correcoes.some((c) => c.acao !== 'troca')
  return { texto: mexeu ? costurar(saida) : saida, correcoes }
}
