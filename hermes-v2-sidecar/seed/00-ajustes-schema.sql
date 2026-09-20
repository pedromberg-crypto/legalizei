-- ============================================================================
--  seed/00-ajustes-schema.sql
--
--  🔴 TRES FATOS DUROS QUE O `schema.sql` NAO TINHA ONDE GUARDAR.
--
--  Nao e refinamento: a carga de dado real achou tres objetos que existem no
--  vault, tem valor exato, e nao cabiam em nenhuma tabela. Os tres sao
--  exatamente onde o agente ja errou em producao, o que nao e coincidencia:
--  fato sem casa vira fato solto no texto, e fato solto no texto e o que o
--  modelo responde de memoria.
--
--    1. TAXA PUBLICA   a taxa da Junta nao e nossa, e do Estado de Minas, e
--                      nao e reembolsavel depois do protocolo. Guardar em
--                      `plano` diria que e receita nossa, o que e falso.
--    2. ADD-ON         o endereco fiscal e RECORRENTE, somado a mensalidade.
--                      `servico_avulso` diria que e cobranca unica.
--                      ⚠️ O valor dele COINCIDE com a mensalidade do plano MEI,
--                      e o vault manda perguntar antes de confirmar quando o
--                      cliente cita o numero solto. Duas linhas com o mesmo
--                      valor e coisas diferentes: motivo de sobra para as duas
--                      terem casa propria.
--    3. TETO           os dois degraus de faturamento. Escritos como texto em
--                      `escopo_regra.valor`, voltariam a ser numero dentro de
--                      texto, que e a regressao que este desenho existe para
--                      impedir.
--
--  Rodar ANTES de `01-fatos.sql`.
-- ============================================================================

-- ── 1. Taxa publica ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fatos.taxa_publica (
  id               text PRIMARY KEY,
  nome             text NOT NULL,
  orgao            text NOT NULL,
  valor_centavos   integer NOT NULL CHECK (valor_centavos >= 0),
  regime_aplicavel fatos.regime NOT NULL,
  reembolsavel     boolean NOT NULL,
  quando_cobrada   text NOT NULL,
  fonte            text NOT NULL,
  atualizado_em    date NOT NULL DEFAULT current_date
);

COMMENT ON TABLE fatos.taxa_publica IS
  '🔴 Dinheiro que NAO e nosso. Vai inteiro para o orgao e aparece separado na '
  'tela. Chamar isso de preco, ou somar na mensalidade, e o erro que faz o '
  'cliente achar que a casa embolsou taxa de Estado.';

-- ── 2. Add-on recorrente ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fatos.addon (
  id               text PRIMARY KEY,
  nome             text NOT NULL,
  valor_centavos   integer NOT NULL CHECK (valor_centavos >= 0),
  recorrente       boolean NOT NULL DEFAULT true,
  regime_aplicavel fatos.regime[] NOT NULL,
  para_quem        text NOT NULL,
  alerta           text,
  fonte            text NOT NULL,
  atualizado_em    date NOT NULL DEFAULT current_date
);

COMMENT ON COLUMN fatos.addon.alerta IS
  'Texto que o agente TEM que dizer junto do valor. Existe porque o vault trava '
  'que preco e condicao do endereco fiscal vao na MESMA mensagem da oferta: '
  'oferecer sem o valor faz a pessoa achar que e cortesia, e o susto aparece no '
  'fechamento.';

-- ── 3. Tetos de faturamento ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fatos.teto (
  id             text PRIMARY KEY,
  nome           text NOT NULL,
  valor_centavos bigint NOT NULL CHECK (valor_centavos > 0),
  periodicidade  text NOT NULL CHECK (periodicidade IN ('ano', 'mes')),
  acima_disso    text NOT NULL,
  atendemos_acima boolean NOT NULL,
  fonte          text NOT NULL
);

COMMENT ON TABLE fatos.teto IS
  '🔴 Os dois degraus aparecem SEMPRE com o valor: "teto do MEI" sem o numero '
  'nao situa ninguem. E acima do teto do ME a resposta nunca e "cai no ME": '
  'vira EPP, e EPP esta fora do escopo.';
