/**
 * ═══════════════════════════════════════════════════════════════════════════
 * O CLIENTE DE MENTIRA DO DOSSIÊ — uma pessoa só, atravessando as 7 telas.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🐛 POR QUE ISTO EXISTE (29/07)
 *
 * Cada tela do B4 declarava o próprio mock, e eles se contradiziam. Andando as
 * telas em sequência (que é exatamente o que uma review no `/mockup` e uma
 * apresentação pra gestão fazem), a pessoa mudava de identidade no meio:
 *
 *   · N12 deixava escolher "Só eu" …
 *   · N13 tinha `SOCIOS_N4 = 2` fixo e perguntava pelos DOIS sócios, nominais.
 *   · N15 tinha `TEM_SOCIO = false` fixo e recomendava empresa de dono único.
 *   · N10 chamava a cliente de "Ana Beatriz Ramos"; N16, de "Ana Souza".
 *
 * Três telas contando três histórias sobre o mesmo dado, e um nome trocado no
 * meio do caminho. É o mesmo pecado do rótulo de faixa escrito em 5 arquivos e
 * do contador de passos de 19/07: **informação repetida sem dono diverge.**
 * A cura é a mesma — fonte única.
 *
 * ─── POR QUE O MOCK É COM SÓCIO, E NÃO SOLO ──────────────────────────────
 * Solo é o caso mais comum do ICP, mas mock não existe pra ser típico: existe
 * pra ser REVISÁVEL. Com `TEM_SOCIO = true` as telas mostram o máximo de UI de
 * uma vez — o bloco de residência de sócio do N13, a divisão de participação
 * do N12, a recomendação de LTDA do N15 — e, principalmente, **o guard-rail de
 * incoerência do N15 vira alcançável** (ele exigia sócio pra disparar e, com o
 * mock fixo em solo, nunca rodou uma única vez).
 *
 * 🚧 Tudo aqui morre quando existir estado real entre telas (RF-01). Enquanto
 * não existe, este arquivo é o contrato: **nenhuma tela do dossiê declara mock
 * próprio de identidade, sócios ou CNAE.**
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { nomeCnae, nomeCnaeEmFrase } from "@/lib/cnae";

/** Coletado no N6 (front-load, 28/07) e só CONFIRMADO no N10. */
export const CLIENTE = {
  nome: "Ana Beatriz Ramos",
  cpf: "123.456.789-00",
  telefone: "(31) 99999-0000",
  /**
   * 🆕 03/09 — o e-mail é coletado desde o E3.3 e nunca tinha entrado no mock,
   * porque nenhuma tela o exibia. O A1 (`/revisar`) exibe: é por ele que a
   * pessoa recebe tudo depois do protocolo, então entra na conferência.
   */
  email: "ana.ramos@email.com",
  endereco: "Rua dos Timbiras, 1200, Funcionários, Belo Horizonte/MG",
};

/**
 * Vem da triagem do N4 e é confirmado no N12. 4 é o teto do MLP (subiu de 2
 * pra 4 em 24/08, reunião Leonan 19/08 — o que trava lá na frente não é o
 * número, é que todo mundo assina). O mock demonstra o caso com 1 sócio
 * extra (o mais comum); o N12 agora suporta adicionar até 3 sócios extras.
 */
export const TEM_SOCIO = true;
export const SOCIO_2 = { nome: "Carlos Eduardo Silva" };

export const SOCIOS: number = TEM_SOCIO ? 2 : 1;
export const NOMES_SOCIOS: string[] = TEM_SOCIO
  ? [CLIENTE.nome, SOCIO_2.nome]
  : [CLIENTE.nome];

/**
 * Nome usado pra montar sugestões de razão social no N16. Nome completo inteiro
 * ficaria longo demais numa razão social ("Ana Beatriz Ramos Web Studio"), então
 * usa primeiro + último, que é o que um contador escreveria.
 */
export const NOME_EMPRESARIAL = (() => {
  const partes = CLIENTE.nome.trim().split(/\s+/);
  return partes.length > 1 ? `${partes[0]} ${partes[partes.length - 1]}` : partes[0];
})();

/**
 * ─── O QUE O "✨ PREENCHER AUTOMÁTICO" DA DEMO ESCREVE ────────────────────
 * A `/apresentacao` tem um botão que preenche a tela corrente pra a gestão ver
 * a CAUSA (o campo preenchendo) e não só o resultado. Os valores vivem aqui, e
 * não dentro do botão, por dois motivos:
 *   · são da MESMA cliente de mentira do resto do dossiê (o CEP é o endereço
 *     dela, o 2º sócio é o mesmo nome) — separar convidaria a divergir de novo;
 *   · a tela sabe preencher a si mesma, então quem apresenta não depende de a
 *     demo conhecer os campos internos de cada uma das 7.
 *
 * ⚠️ Escolhas deliberadas, porque preenchimento de demo é roteiro:
 *   · **Regime de bens = comunhão parcial**, não universal. A universal dispara
 *     o aviso do cônjuge (UX-30), que é um bom momento de demo — mas é o
 *     CAMINHO DE EXCEÇÃO. O automático entrega o happy path; quem apresenta
 *     troca pra universal na mão quando quiser mostrar o aviso.
 *   · **Vínculo de INSS = sim, R$ 4.500.** Aqui o oposto: vale gastar o
 *     automático no caminho que MOSTRA a inteligência (o INSS incide só sobre
 *     a folga até o teto). Com "não" a tela fica muda.
 */
export const PREENCHIMENTO = {
  /** N10 — o que o N6 não coletou. */
  socio: {
    rg: "MG-14.892.331",
    orgao: "SSP/MG",
    // 🆕 26/08 — campo padrão de DBE (Receita), achado no cruzamento com a
    // pesquisa JUCEMG/DBE.
    nascimento: "14/03/1988",
    // 🆕 01/09 — nacionalidade do TITULAR (o sócio extra já tinha desde 31/08).
    nacionalidade: "Brasileira",
    // 🗑️ 01/09 — `nomeMae` removido junto do campo (auditoria 1-a-1, item 7):
    // nenhum dos 141 prints da JUCEMG/DBE/Integrador tem filiação, e no MEI o
    // dado vem do gov.br, não editável.
    civil: "casado",
    regime: "parcial",
  },
  /** N11 — abaixo do teto de propósito, pra renderizar o cálculo da folga. */
  vinculo: { contribui: true, valor: "4.500" },
  /** N12 — qualificação do 2º sócio (SOCIO_2), mesma exigência do titular
   *  (art. 997 CC). 🆕 31/08 — profissão fica de fora: preenchida internamente
   *  como "Empresário" pra qualquer sócio, não é campo. */
  socioExtra: {
    // 🆕 01/09 — CPF e endereço entraram (auditoria 1-a-1, itens 1 e 2): CPF é
    // a chave do sócio no QSA do DBE; endereço entra na qualificação do
    // contrato social (art. 997 CC) e tem ficha própria no DBE.
    cpf: "045.221.876-30",
    nascimento: "22/11/1985",
    nacionalidade: "Brasileira",
    rg: "MG-15.887.222",
    orgao: "SSP/MG",
    civil: "casado",
    regime: "parcial",
    cep: "30310-000",
    numero: "412",
    complemento: "Apto 501",
  },
  /** N13 — endereço da CLIENTE, com o IPTU que a JUCEMG exige.
   *  🆕 31/08 — `tipoImovel: "apartamento"` de propósito: exercita a trava
   *  automática de residência (a lei exige que o titular resida no local).
   *  Capital social saiu daqui — virou valor fixo (R$10.000), preenchido no
   *  backend, nem aparece mais na tela. */
  empresa: {
    cep: "30140-060",
    numero: "1000",
    complemento: "Sala 302",
    iptu: "001.234.567.890",
    tipo: "proprio",
    tipoImovel: "apartamento",
  },
  /** N14 — 2 secundárias, não as 4: marcar tudo não parece escolha. */
  cnaeSecundarios: ["s1", "s3"],
  /** N16 — o objeto social já nasce sugerido; falta só o fantasia. */
  nome: { fantasia: "Ana Ramos Studio" },
} as const;

/** Travado no ENCAIXE (pré-pagamento, 21/07) — o N14 e o N16 herdam. */
export const CNAE_PRINCIPAL = {
  cnae: "6201-5/02",
  humano: "Criação de sites e web design",
};

/**
 * Secundárias escolhidas no N14. Todas MESMO-IMPOSTO que a principal — é a
 * condição pra existirem (decisão 21/07). O N16 usa pra montar o objeto social.
 */
export const CNAES_SECUNDARIAS = [
  { cnae: "6202-3/00", humano: "desenvolvimento de sistemas sob encomenda" },
  { cnae: "7410-2/99", humano: "design gráfico e identidade visual" },
];

/**
 * ─── 🆕 03/09 — O QUE O A1 (`/revisar`) RELÊ ────────────────────────────────
 * As 3 coisas abaixo eram consts locais do `wizard-dossie.tsx` (C7). Subiram
 * pra cá quando o recap passou a mostrar os 3 nomes na ordem e o objeto social:
 * duas telas lendo o mesmo dado de dois lugares é exatamente a divergência que
 * este arquivo existe pra matar (o CNAE com um dígito trocado, 29/07).
 */

/**
 * As 3 tentativas de razão social, NA ORDEM em que vão pra Junta: a 1ª é a
 * linha que a pessoa escreve, as 2 seguintes são as nossas reservas travadas
 * (decisão do Pedro, 03/09). A ordem importa — a Junta tenta uma por vez.
 */
export const RAZAO_OPCOES: string[] = [
  `${NOME_EMPRESARIAL} Web Studio`,
  `${NOME_EMPRESARIAL} Desenvolvimento de Software`,
  `${NOME_EMPRESARIAL.split(" ")[0]} Tecnologia ME`,
];

/**
 * 🔒 24/08 (reunião Leonan 19/08) — gerado a partir das atividades, nunca
 * digitado. Se o CNAE muda, ele se regenera; é por isso que é derivado e não
 * um campo.
 */
/* 🔄 04/09 (decisão do Pedro) — o objeto social passou a ser montado com os
   nomes OFICIAIS do IBGE (`lib/cnae`), não com os apelidos de cada tela. É o
   texto que vai pro contrato e ele precisa espelhar a descrição da subclasse:
   objeto divergente do CNAE do DBE é o ponto de falha nº 1 da JUCEMG (ver
   `pesquisa/exigencias-jucemg.md`). */
export const OBJETO_SOCIAL = `Prestação de serviços de ${nomeCnaeEmFrase(
  CNAE_PRINCIPAL.cnae,
)}, podendo também exercer ${CNAES_SECUNDARIAS.map((s) => nomeCnaeEmFrase(s.cnae)).join(", ")}.`;

/**
 * O que o autofill de CEP devolve no mock (mesmo retorno de `buscarCep` no
 * `wizard-dossie`). O A1 precisa dele pra montar o endereço da empresa por
 * extenso, já que só guarda CEP + número + complemento.
 */
export const ENDERECO_CEP = {
  logradouro: "Rua dos Timbiras",
  bairro: "Funcionários",
  municipio: "Belo Horizonte",
  uf: "MG",
};
