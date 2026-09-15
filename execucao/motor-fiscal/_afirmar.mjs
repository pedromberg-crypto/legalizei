/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧷 AFIRMAR — o teste tem que provar que TESTOU alguma coisa.
 * ═══════════════════════════════════════════════════════════════════════════
 * Travado pelo Pedro em 15/09, depois do terceiro erro grave do mesmo dia:
 * *"precisamos travar e aprender sempre, para pararmos de parametrizar com
 * itens errados cálculos que são muito graves."*
 *
 * ── OS TRÊS CASOS, E A RAIZ COMUM ──────────────────────────────────────────
 *
 * **1 · O verde a vazio.** `proj.linha.map(l => l.fatorR).filter(x => x != null)`
 * devolvia lista VAZIA, porque o campo se chama `fr` e não `fatorR`. O
 * `.every()` sobre lista vazia é `true`. O teste de monotonia do Fator R
 * passou sem comparar nada.
 *
 * **2 · O verde pelo motivo errado.** O invariante afirmava *"volta pro Anexo
 * III quando corrige o pró-labore"* e passava — com UMA competência, que era
 * um mês de razão infinita, sem nenhuma relação com correção.
 *
 * **3 · O verde que descrevia o bug.** *"O INSS do P09 é ZERO porque o CLT
 * passou do teto"* passava porque o motor somava dois sócios como uma pessoa.
 * O teste documentava o defeito e chamava de invariante.
 *
 * 🔑 **A raiz é a mesma nos três:** a asserção olhava a CONSEQUÊNCIA e nunca
 * exigia prova de que houve CASO. Verde sem evidência não é proteção, é
 * anestesia — e é pior que vermelho, porque tapa o buraco.
 *
 * ── A REGRA ────────────────────────────────────────────────────────────────
 *
 * 🔴 **Toda afirmação sobre uma coleção declara quantos casos esperava.**
 * Zero caso derruba a rodada. Menos casos que o mínimo declarado, idem.
 *
 * 🔴 **Toda afirmação sobre número recusa `undefined` e `NaN`.** Ler campo com
 * o nome errado passa a ser erro barulhento em vez de silêncio verde.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Afirma que TODOS os itens satisfazem o predicado — e que **houve itens**.
 *
 * @param colecao       o que se está avaliando
 * @param predicado     (item, i) => boolean
 * @param minimoDeCasos quantos itens a afirmação espera encontrar, no mínimo.
 *                      Declarar isto é o ponto: obriga quem escreve o teste a
 *                      saber o tamanho do que está afirmando.
 */
export function todos(colecao, predicado, minimoDeCasos = 1) {
  const itens = [...colecao];

  if (itens.length < minimoDeCasos) {
    return {
      ok: false,
      avaliados: itens.length,
      motivo:
        `afirmação A VAZIO: ${itens.length} caso(s), mínimo declarado ` +
        `${minimoDeCasos}. Um \`every()\` sobre coleção vazia devolve true e ` +
        `não prova nada.`,
    };
  }

  const falhou = itens.findIndex((item, i) => !predicado(item, i));
  return falhou < 0
    ? { ok: true, avaliados: itens.length }
    : {
        ok: false,
        avaliados: itens.length,
        motivo: `item ${falhou} falhou o predicado`,
      };
}

/**
 * Lê um número exigindo que ele EXISTA.
 *
 * 🔑 Existe por causa do `fr.fatorR`: um campo com nome errado devolve
 * `undefined`, e `undefined` some em `filter`, vira `NaN` em conta e `false`
 * em comparação — sempre em silêncio. Aqui ele grita.
 */
export function numero(valor, rotulo) {
  if (valor === undefined || valor === null) {
    throw new Error(
      `${rotulo}: valor ausente (${valor}). Campo com nome errado some em ` +
        `silêncio — confira o nome antes de confiar no verde.`
    );
  }
  if (typeof valor !== "number" || Number.isNaN(valor)) {
    throw new Error(`${rotulo}: esperava número, recebeu ${JSON.stringify(valor)}`);
  }
  return valor;
}

/**
 * 🔴 Afirma a CAUSA, não só a consequência.
 *
 * Nasceu do caso 3: *"o INSS é zero"* era verdade e era sintoma. O que o teste
 * precisava afirmar era **por que** é zero — qual sócio, com qual CLT.
 *
 * Recebe as duas pontas e exige as duas. Se a consequência vale e a causa não,
 * é exatamente o cenário do P09: passando pelo motivo errado.
 */
export function porque({ consequencia, causa, rotulo }) {
  if (consequencia && !causa) {
    return {
      ok: false,
      motivo:
        `${rotulo}: a consequência vale mas a CAUSA declarada não. É verde ` +
        `pelo motivo errado — o caso do P09 em 15/09.`,
    };
  }
  return { ok: consequencia && causa };
}
