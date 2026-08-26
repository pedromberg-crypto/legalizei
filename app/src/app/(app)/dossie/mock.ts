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

/** Coletado no N6 (front-load, 28/07) e só CONFIRMADO no N10. */
export const CLIENTE = {
  nome: "Ana Beatriz Ramos",
  cpf: "123.456.789-00",
  telefone: "(31) 99999-0000",
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
  socio: { rg: "MG-14.892.331", orgao: "SSP/MG", civil: "casado", regime: "parcial" },
  /** N11 — abaixo do teto de propósito, pra renderizar o cálculo da folga. */
  vinculo: { contribui: true, valor: "4.500" },
  /** N13 — endereço da CLIENTE, com o IPTU que a JUCEMG exige. */
  empresa: {
    cep: "30140-060",
    numero: "1000",
    complemento: "Sala 302",
    iptu: "001.234.567.890",
    tipo: "proprio",
    capital: "10.000",
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
