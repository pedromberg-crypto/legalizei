import type { ReadonlyURLSearchParams } from "next/navigation";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * O COMPROMISSO — a hora marcada com o consultor, em PARTES
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 05/09 (auditoria do ramo assistido) — este arquivo nasceu de UMA raiz que
 * gerou três bugs de uma vez. O compromisso viajava entre as telas como FRASE
 * PRONTA (`?agendado=Hoje às 15:00`), montada a partir do `label` do dia mock:
 *
 * 1. 🐛 O cartão do compromisso SUMIA. A frase e as partes viajavam em campos
 *    separados, e o "Remarcar" só recolocava a frase: desistir de remarcar
 *    devolvia a pessoa a um status que dizia "Você tem hora marcada" no hero,
 *    na etapa e no CTA, mas mostrava o cartão de APRESENTAÇÃO no lugar do
 *    cartão da hora. O único bloco que respondia QUANDO era o que sumia.
 * 2. 🐛 O rótulo do mock VAZAVA pra copy pública. O dia 15 se chamava
 *    "Segunda 15" (nome inventado só pra distinguir das duas segundas da
 *    fila), e o app dizia, no botão: "Confirmar Segunda 15 às 09:00".
 * 3. 🐛 A frase não carregava a DATA. "Marcado pra segunda às 09:30" com duas
 *    segundas na agenda não diz qual — e era exatamente por isso que o mock
 *    tinha inventado o "Segunda 15" do item 2.
 *
 * A regra que sai daí, e que este módulo existe pra impor: **o compromisso é
 * DADO, não texto**. Ele viaja em partes, e toda frase que a interface mostra
 * (hero, CTA, etapa da timeline, mensagem de WhatsApp) é DERIVADA aqui, num
 * lugar só. Dado derivado que viaja é dado que um dia chega divergente do
 * original — foi literalmente o que aconteceu.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Qual das duas assinaturas este compromisso marca.
 *
 * 🔄 05/09, duas vezes no mesmo dia: virou 3 (a procuração e-CAC também é
 * assinada pelo cliente) e voltou pra 2, com o Ademar confirmando por telefone
 * que **o certificado digital dispensa a procuração**. Ver o passo do
 * certificado em `wizard-cauda.tsx` pro racional inteiro.
 *
 *   1 = contrato social · 2 = a que gera o CNPJ (contador junto)
 */
export type RodadaAssinatura = 1 | 2;

export type Compromisso = {
  /** Dia do mês: 5. */
  numero: number;
  /** Sigla do dia da semana, como o cartão de data mostra: "Sex". */
  semana: string;
  /** Sigla do mês, como o cartão de data mostra: "Set". */
  mes: string;
  /** Começo do slot: "15:00". */
  hora: string;
  /** É hoje: o cartão troca a sigla da semana por "HOJE". */
  hoje: boolean;
};

/**
 * Sigla → nome por extenso.
 *
 * Mora aqui, e não no dia da agenda, porque é tradução de um dado e não um
 * atributo dele: o dia sabe que é "Sex", e quem escreve a frase é que precisa
 * de "sexta". Foi o campo `label` fazendo esse papel que vazou "Segunda 15"
 * pro botão.
 */
const NOME_DA_SEMANA: Record<string, string> = {
  Seg: "segunda",
  Ter: "terça",
  Qua: "quarta",
  Qui: "quinta",
  Sex: "sexta",
  Sáb: "sábado",
  Dom: "domingo",
};

/** "segunda" a partir de "Seg". Devolve a sigla se um dia chegar coisa nova. */
export function nomeDaSemana(sigla: string) {
  return NOME_DA_SEMANA[sigla] ?? sigla.toLowerCase();
}

/**
 * A frase do compromisso, em minúsculas, pra encaixar no meio de outra ("Marcado
 * pra ___", "Confirmar ___").
 *
 * 🔒 FORA DE HOJE, A FRASE CARREGA O DIA DO MÊS. É o que resolve o bug 3: a
 * agenda mostra duas segundas, e "segunda às 09:30" não escolhe entre elas. O
 * "hoje" é a única exceção porque ele já é único por definição, e "hoje, dia 5"
 * seria precisão que ninguém pediu.
 */
export function fraseCompromisso(c: Compromisso) {
  return c.hoje
    ? `hoje às ${c.hora}`
    : `${nomeDaSemana(c.semana)}, dia ${c.numero}, às ${c.hora}`;
}

/**
 * Só o DIA, sem a hora.
 *
 * 🆕 05/09 (pedido do Pedro) — o CTA travado do status ("Marcado pra segunda,
 * dia 8, às 09:30") virava duas linhas no aparelho, e a hora ali era repetição:
 * ela já está no maior tamanho da tela, no cartão logo acima. O botão fica com
 * o que o cartão não grita, que é QUE DIA.
 */
export function fraseDoDia(c: Compromisso) {
  return c.hoje ? "hoje" : `${nomeDaSemana(c.semana)}, dia ${c.numero}`;
}

/**
 * Fim do slot: começo + 30 minutos, que é o passo da agenda.
 *
 * Calculado, não guardado: é derivação pura de um dado que já existe.
 */
export function fimDoSlot(hora: string) {
  const [h, m] = hora.split(":").map(Number);
  const total = h * 60 + m + 30;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

/**
 * 🚧 Mock (RF-01): sem estado entre telas, o compromisso viaja no querystring.
 * Em PARTES, e todas juntas — meio compromisso não existe: ou a tela sabe a
 * hora marcada, ou ela está no estado "a marcar". Era a ausência dessa regra
 * que deixava passar o estado híbrido do bug 1.
 */
export function compromissoDaQuery(
  sp: URLSearchParams | ReadonlyURLSearchParams,
): Compromisso | null {
  const dia = sp.get("dia");
  const semana = sp.get("semana");
  const mes = sp.get("mes");
  const hora = sp.get("hora");
  if (!dia || !semana || !mes || !hora) return null;
  const numero = Number(dia);
  if (!Number.isFinite(numero)) return null;
  return { numero, semana, mes, hora, hoje: sp.get("hoje") === "1" };
}

/** O caminho inverso: as partes viram os mesmos campos que a leitura espera. */
export function queryDoCompromisso(c: Compromisso) {
  const q = new URLSearchParams({
    dia: String(c.numero),
    semana: c.semana,
    mes: c.mes,
    hora: c.hora,
  });
  if (c.hoje) q.set("hoje", "1");
  return q.toString();
}
