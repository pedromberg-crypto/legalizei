/**
 * ════════════════════════════════════════════════════════════════════════════
 *  tipos.ts  ·  o vocabulario do roteador
 *
 *  Os nomes daqui sao os mesmos do `schema.sql` e do `RULES.md` §5, de
 *  proposito: quando o banco, o documento e o codigo chamam a mesma coisa pelo
 *  mesmo nome, a divergencia entre eles vira erro de compilacao em vez de bug
 *  silencioso.
 * ════════════════════════════════════════════════════════════════════════════
 */

/** As quatro saidas do roteador. Exclusivas: toda mensagem sai por uma so. */
export type Saida = 'escalonamento' | 'fora_escopo' | 'tecnico' | 'comercial'

/**
 * Os tres estados de falha que o "nao sei" escondia.
 *
 * 🔴 A distincao nao e taxonomia, muda a resposta:
 *   fora_escopo           vai para o gate de saida, e NUNCA para "nao tenho
 *                         essa informacao", que implica "existe e eu vou buscar"
 *   nao_e_meu_julgamento  e escalonamento
 *   lacuna_da_base        e a unica falha de verdade, e vira dado de produto
 */
export type FalhaTipo = 'fora_escopo' | 'nao_e_meu_julgamento' | 'lacuna_da_base'

export type Regime = 'mei' | 'me_simples' | 'epp' | 'lucro_presumido' | 'lucro_real'
export type Confianca = 'alta' | 'media' | 'baixa' | 'nao_verificado'
export type Promessa = 'pode' | 'parcial' | 'nao'

/**
 * O que o classificador devolve.
 *
 * 🔑 Repare que ele NAO devolve a saida. Ele devolve SINAIS, e quem aplica a
 * precedencia e o Node, em codigo. Pedir ao modelo que aplique precedencia e
 * abrir mao de determinismo justamente na regra que mais custa quando falha:
 * foi por ordem errada que o agente respondeu preco para quem tinha acabado de
 * contar um prejuizo.
 */
export interface Sinais {
  /** Algum gatilho do RULES.md §5.4 apareceu. Vence tudo. */
  gatilho_escalonamento: boolean
  /** Regime, atividade, cidade ou porte fora do escopo travado. */
  fora_do_escopo: boolean
  /** Ha uma pergunta que a base responde. */
  pergunta_tecnica: boolean
  /** Ha interesse comercial: preco, plano, "serve pra mim?", comparacao. */
  interesse_comercial: boolean
  /** Medo, prejuizo ou irritacao. Desliga o humor (PERSONA, secao Humor). */
  tensao: boolean
  /** O que o classificador entendeu, em uma linha, para o log interno. */
  resumo: string
  /** Dados que a pessoa revelou nesta mensagem, para a classificacao do contato. */
  revelou?: {
    regime_alvo?: Regime
    atividade?: string
    cidade?: string
  }
}

export interface Entrada {
  contatoId: string
  sessaoId: string
  texto: string
}

/** O resultado de uma tentativa de resolucao tecnica. */
export interface Resolucao {
  texto: string
  /** 🔴 A chave da trava comercial. Ver `RULES.md` §5.1. */
  ok: boolean
  falhaTipo: FalhaTipo | null
  cartoesUsados: string[]
  fatosLidos: string[]
  tokensEntrada: number
  tokensSaida: number
}

export interface Resposta {
  /** O que a pessoa vai ver. Pode sair em duas mensagens no WhatsApp. */
  texto: string
  saida: Saida
  /** Preenchido so quando `saida === 'escalonamento'`. */
  pacoteEscalonamento?: PacoteEscalonamento
}

/**
 * O pacote que vai junto da escalacao.
 *
 * 🔴 Sem dado sensivel. O agente nao coleta CPF, RG, senha nem dado bancario
 * "para adiantar o atendimento": o humano puxa isso pelo sistema.
 */
export interface PacoteEscalonamento {
  oQueElaQuer: string
  ondeEstaNaJornada: string | null
  oQueJaFoiDito: string
  urgencia: string | null
  assunto: string
}

/** Contrato minimo do provedor de LLM. Trocar de modelo nao toca no roteador. */
export interface Llm {
  completar(args: {
    sistema: string
    mensagens: { papel: 'cliente' | 'leo'; texto: string }[]
    tools?: DefinicaoTool[]
    jsonSchema?: object
  }): Promise<{
    texto: string
    chamadas: { nome: string; argumentos: Record<string, unknown> }[]
    tokensEntrada: number
    tokensSaida: number
  }>
}

/** Contrato minimo do gerador de embedding. A dimensao tem que bater com o schema. */
export interface Embedder {
  gerar(texto: string): Promise<number[]>
}

export interface DefinicaoTool {
  nome: string
  descricao: string
  parametros: object
}
