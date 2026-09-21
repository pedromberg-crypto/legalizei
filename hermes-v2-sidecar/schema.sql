-- ============================================================================
--  hermes-v2-sidecar / schema.sql
--  PostgreSQL 16+ com pgvector. Arquitetura multicamadas (Sidecar) do Leo.
--
--  Gerado em 2026-09-20. Substitui o SQLite de arquivo unico do runtime atual
--  (tabelas `messages`, `sessions`, `session_model_usage`, `gateway_routing`).
--
--  ── A LINHA QUE ORGANIZA TUDO ──────────────────────────────────────────────
--
--  FATO DURO nunca e recuperado por semantica. TEXTO nunca guarda numero.
--
--  Dois motivos medidos, nao estetica:
--
--  1. Em 19/09 o arquivo de personalidade guardava os numeros que mandava
--     consultar. Resultado: a nota de contrato foi aberta 1 vez em 632
--     chamadas, porque o prompt ja entregava a resposta. Numero dentro de
--     texto mata a consulta que o proprio texto manda fazer.
--
--  2. Busca semantica responde "o que mais se parece com a pergunta". Aliquota,
--     vedacao e teto nao admitem "o que mais se parece". Ou e o CNAE daquele
--     codigo, ou e outro CNAE. Por isso fato vai em tabela relacional, lido por
--     Tool Calling com chave exata.
--
--  Os tres schemas abaixo existem para que essa linha seja estrutural, nao
--  disciplina de quem escreve:
--
--     fatos/        tabela relacional pura. So Tool Calling. Zero embedding.
--     conhecimento/ texto vetorizado no formato Estado-Acao-Restricao.
--                   CHECK constraint proibe numero dentro do texto.
--     conversa/     estado do dialogo. Separa o que a pessoa viu do que so o
--                   roteador pensou.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;   -- busca por nome de atividade, lexical

CREATE SCHEMA IF NOT EXISTS fatos;
CREATE SCHEMA IF NOT EXISTS conhecimento;
CREATE SCHEMA IF NOT EXISTS conversa;


-- ============================================================================
--  1. FATOS  ·  tabela relacional pura, acessada por Tool Calling
--     🔴 Nenhuma tabela deste schema recebe coluna `vector`. Se um dia receber,
--        a linha que organiza o desenho foi rompida.
-- ============================================================================

-- ── 1.1 Escopo do produto ───────────────────────────────────────────────────
--  A primeira pergunta de toda conversa nao e "o que ele quer", e "a gente
--  atende?". Esta tabela e o que a saida FORA DE ESCOPO do roteador consulta.

CREATE TYPE fatos.regime AS ENUM ('mei', 'me_simples', 'epp', 'lucro_presumido', 'lucro_real');

CREATE TABLE fatos.escopo_regra (
  id              text PRIMARY KEY,
  dentro          boolean NOT NULL,
  dimensao        text    NOT NULL,   -- regime · atividade · geografia · societario · situacao
  valor           text    NOT NULL,
  motivo          text    NOT NULL,
  saida_sugerida  text,               -- o que oferecer a quem cai fora
  fonte           text    NOT NULL,
  atualizado_em   date    NOT NULL DEFAULT current_date
);

COMMENT ON TABLE fatos.escopo_regra IS
  'Escopo travado em 12/09 e refinado em 13/09. ME no Simples, Anexos III e V, '
  'servico, BH/MG, de um a quatro socios pessoa fisica, socio sem beneficio. '
  'EPP existe so como porta de SAIDA (desenquadramento), nunca como permanencia. '
  'A trava `verificar-escopo.mjs` do repo deriva desta mesma lista.';

COMMENT ON COLUMN fatos.escopo_regra.saida_sugerida IS
  'Fora de escopo NAO e escalonamento: nenhum atendente resolve o que o produto '
  'nao faz. Esta coluna alimenta o gate de saida, que termina com site e Instagram.';


-- ── 1.2 CNAE ────────────────────────────────────────────────────────────────
--  1.332 linhas. A fonte no repo e `pesquisa/cnae-matriz/cnae-matriz.csv`.
--  🔑 O gate de confianca e a razao de existir desta tabela: o bot so afirma
--     enquadramento quando `anexo_fator_r_confianca = 'alta'`.

CREATE TYPE fatos.confianca AS ENUM ('alta', 'media', 'baixa', 'nao_verificado');

CREATE TABLE fatos.cnae (
  codigo                    char(7) PRIMARY KEY,          -- subclasse, so digitos
  descricao                 text    NOT NULL,             -- o nome oficial, em caixa alta
  titulo_amigavel           text,                         -- o nome que o cliente reconhece
  descricao_amigavel        text,
  secao_id                  char(1) NOT NULL,
  divisao_id                char(2) NOT NULL,

  -- camada fiscal
  anexo_base                text,                         -- 'III', 'V', 'III/IV/V*', 'I', 'II'
  anexo_fator_r_grupo       text,                         -- 'III-fixo' · 'fator-r-dinamico(III<->V)'
  anexo_fator_r_fonte       text,
  anexo_fator_r_confianca   fatos.confianca NOT NULL DEFAULT 'nao_verificado',
  vedado_simples            boolean NOT NULL DEFAULT false,
  ambiguo_simples           boolean NOT NULL DEFAULT false,

  -- camada MEI
  mei_permitido             boolean NOT NULL DEFAULT false,
  mei_ocupacoes             text,

  -- camada municipal (BH)
  iss_bh_aliquota           numeric(5,4),
  iss_bh_varia              boolean NOT NULL DEFAULT false,

  -- camada de abertura
  risco_baixo_cgsim         boolean,
  exige_conselho            boolean NOT NULL DEFAULT false,
  conselho_qual             text,
  exige_registro_setorial   boolean NOT NULL DEFAULT false,

  -- veredito do produto
  atende_me_certeza         boolean NOT NULL DEFAULT false,
  atende_mei_certeza        boolean NOT NULL DEFAULT false,
  motor_apura               boolean NOT NULL DEFAULT false,
  motor_bloqueio            text,

  atualizado_em             date    NOT NULL DEFAULT current_date,

  CONSTRAINT cnae_so_digitos CHECK (codigo ~ '^[0-9]{7}$')
);

CREATE INDEX cnae_atende_me_idx  ON fatos.cnae (atende_me_certeza) WHERE atende_me_certeza;
CREATE INDEX cnae_divisao_idx    ON fatos.cnae (divisao_id);
CREATE INDEX cnae_titulo_trgm    ON fatos.cnae USING gin (titulo_amigavel gin_trgm_ops);
CREATE INDEX cnae_descricao_trgm ON fatos.cnae USING gin (descricao gin_trgm_ops);

COMMENT ON INDEX fatos.cnae_titulo_trgm IS
  '🔴 Busca de atividade por NOME e lexical (trigrama), nao semantica. "Sou '
  'fotografo" tem que cair em fotografia, nao no CNAE que o embedding achou '
  'parecido. Semantica aqui produz enquadramento errado com cara de certeza.';

COMMENT ON COLUMN fatos.cnae.anexo_fator_r_confianca IS
  '🔴 O GATE. So `alta` autoriza o agente a AFIRMAR anexo ou aliquota. Nas '
  'demais ele pergunta o que a pessoa faz no dia a dia e orienta por atividade, '
  'ou escala. Medido no repo: 118 de 1.332 codigos sao `alta`, e 54 ficaram em '
  'conflito aguardando decisao com a contadora.';


-- ── 1.3 As tabelas do Simples ───────────────────────────────────────────────
--  Fonte: LC 123/2006, Anexos III e V. Espelha `motor/regra/_tabelas.mjs`.
--  🔒 So III e V: o Anexo IV existe na lei e esta FORA do escopo do produto.

CREATE TABLE fatos.simples_faixa (
  anexo     text    NOT NULL CHECK (anexo IN ('III', 'V')),
  faixa     smallint NOT NULL CHECK (faixa BETWEEN 1 AND 6),
  rbt12_ate numeric(14,2) NOT NULL,
  nominal   numeric(6,5)  NOT NULL,   -- a aliquota da tabela, que NAO e a que se paga
  deduzir   numeric(14,2) NOT NULL,
  PRIMARY KEY (anexo, faixa)
);

COMMENT ON TABLE fatos.simples_faixa IS
  'A efetiva sai de (RBT12 x nominal - deduzir) / RBT12, e e sempre menor que a '
  'nominal a partir da 2a faixa. Quem cita a nominal como "o imposto" assusta o '
  'cliente com um numero que ele nao paga.';

CREATE TABLE fatos.simples_reparticao (
  anexo   text     NOT NULL,
  faixa   smallint NOT NULL,
  tributo text     NOT NULL CHECK (tributo IN ('cpp','iss','csll','irpj','cofins','pis')),
  fracao  numeric(6,5) NOT NULL,
  PRIMARY KEY (anexo, faixa, tributo),
  FOREIGN KEY (anexo, faixa) REFERENCES fatos.simples_faixa (anexo, faixa)
);

COMMENT ON TABLE fatos.simples_reparticao IS
  '🔴 E ela que faz a guia fechar ao centavo. O DAS e UMA guia, mas por dentro e '
  'a soma de seis tributos, cada um arredondado sozinho. Quem calcula '
  '`receita x aliquota` erra centavo em toda guia, e guia diferente do PGDAS e '
  'divergencia com a Receita. Cada faixa soma 1,00000.';

-- A soma de cada faixa tem que fechar. Isto nao e teste, e invariante do banco.
CREATE OR REPLACE VIEW fatos.v_reparticao_fecha AS
  SELECT anexo, faixa, round(sum(fracao), 5) AS total
  FROM fatos.simples_reparticao
  GROUP BY anexo, faixa
  HAVING round(sum(fracao), 5) <> 1.00000;

COMMENT ON VIEW fatos.v_reparticao_fecha IS
  'Tem que vir VAZIA. Linha aqui significa reparticao que nao soma 1, e guia que '
  'nao vai fechar ao centavo. Rodar na carga e no deploy.';


-- ── 1.4 Precos ──────────────────────────────────────────────────────────────
--  🔴 O numero mora AQUI e em nenhum outro lugar. Nem no cartao, nem no
--     PERSONA, nem no RULES, nem no prompt.

CREATE TABLE fatos.plano (
  id             text PRIMARY KEY,
  nome           text NOT NULL,
  regime         fatos.regime NOT NULL,
  valor_centavos integer NOT NULL CHECK (valor_centavos >= 0),
  promocional    boolean NOT NULL DEFAULT false,
  vigencia_ate   date,
  inclui         text[] NOT NULL DEFAULT '{}',
  nao_inclui     text[] NOT NULL DEFAULT '{}',
  fonte          text NOT NULL,
  atualizado_em  date NOT NULL DEFAULT current_date
);

COMMENT ON COLUMN fatos.plano.valor_centavos IS
  '🔴 Centavos inteiros, nunca float. Doutrina do repo: dinheiro em centavos, '
  'porque float de dinheiro erra meio centavo e o erro so aparece na guia.';

COMMENT ON COLUMN fatos.plano.nao_inclui IS
  '🔑 Existe porque o certificado digital e incluso no ME e INEXISTENTE no MEI, '
  'e o agente ja errou isso em producao dizendo que a abertura e o certificado '
  'ficavam por nossa conta para os dois regimes.';

CREATE TABLE fatos.servico_avulso (
  id             text PRIMARY KEY,
  nome           text NOT NULL,
  valor_centavos integer NOT NULL CHECK (valor_centavos >= 0),
  executa        text NOT NULL CHECK (executa IN ('app', 'equipe', 'contador', 'parceiro')),
  prazo_declarado boolean NOT NULL DEFAULT false,
  fonte          text NOT NULL
);

COMMENT ON COLUMN fatos.servico_avulso.prazo_declarado IS
  'false significa que NAO existe prazo prometido. O agente nao inventa prazo '
  'para avulso que depende de orgao.';

CREATE TABLE fatos.contrato_regra (
  id       text PRIMARY KEY,   -- arrependimento · fidelidade · multa · reajuste
  texto    text NOT NULL,
  valor_numerico numeric(14,2),
  unidade  text,               -- 'dias' · 'meses' · 'percentual'
  fonte    text NOT NULL,
  atualizado_em date NOT NULL DEFAULT current_date
);

COMMENT ON TABLE fatos.contrato_regra IS
  'Fidelidade, multa, prazo de arrependimento e reajuste. 🔴 Isto e CONSULTA, '
  'nao escalonamento: o agente le e passa a regra com os numeros, o que '
  'tranquiliza junto com o que pesa. Vira escalonamento so quando a pessoa PEDE '
  'o cancelamento dela ou quer negociar.';


-- ── 1.5 Fila de escalonamento ───────────────────────────────────────────────
--  🟡 PENDENTE de decisao. A tabela existe para o dia em que a fila existir;
--     enquanto isso `ativo = false` em tudo e o destino e o canal humano unico.

CREATE TABLE fatos.escalonamento_destino (
  assunto text PRIMARY KEY,
  destino text NOT NULL,
  ativo   boolean NOT NULL DEFAULT false,
  nota    text
);

COMMENT ON TABLE fatos.escalonamento_destino IS
  '🟡 Roteamento proposto, sem fila definida no produto. Enquanto `ativo` for '
  'false em todas as linhas, toda escalacao vai para o canal humano unico e o '
  'assunto entra marcado no pacote de contexto.';


-- ============================================================================
--  2. CONHECIMENTO  ·  texto vetorizado, Estado-Acao-Restricao
-- ============================================================================

CREATE TYPE conhecimento.promessa AS ENUM ('pode', 'parcial', 'nao');

CREATE TABLE conhecimento.cartao (
  id            text PRIMARY KEY,          -- '2.1', '8.6'. Numeracao estavel do PDF
  secao         text NOT NULL,
  titulo        text NOT NULL,
  estado        text NOT NULL,             -- a situacao do cliente. E o que a busca casa
  acao          text NOT NULL,             -- o que o produto faz
  restricao     text NOT NULL,             -- o limite: o que nao prometer
  promessa      conhecimento.promessa NOT NULL,
  onde_no_app   text,                      -- em portugues de gente, nunca rota
  fonte         text NOT NULL,
  atualizado_em date NOT NULL DEFAULT current_date,

  -- 🔴 O que se embeda e titulo + estado, NAO o cartao inteiro.
  --    A mensagem do cliente descreve uma SITUACAO ("perdi o prazo da guia"),
  --    nao uma funcionalidade. Embedar a acao junto arrasta o cartao para o
  --    vocabulario do produto e afasta do vocabulario de quem pergunta.
  --    Acao e restricao sao PAYLOAD: voltam inteiras, nunca sao pesquisadas.
  busca         text GENERATED ALWAYS AS (titulo || E'\n' || estado) STORED,
  embedding     vector(768),

  -- 🔴 Numero nao mora em texto vetorizado. Mora em `fatos`.
  CONSTRAINT cartao_sem_numero CHECK (
    (estado || ' ' || acao || ' ' || restricao) !~ '(R\$|[0-9]+,[0-9]{2}|[0-9]+\s?%)'
  ),
  -- 🔴 Travessao proibido: o texto vira few-shot, e few-shot ensina forma.
  CONSTRAINT cartao_sem_travessao CHECK (
    (titulo || estado || acao || restricao) !~ U&'\2014'
  )
);

CREATE INDEX cartao_embedding_idx ON conhecimento.cartao
  USING hnsw (embedding vector_cosine_ops);
CREATE INDEX cartao_promessa_idx  ON conhecimento.cartao (promessa);

COMMENT ON TABLE conhecimento.cartao IS
  'As 58 funcionalidades core do ME no Simples, em Estado-Acao-Restricao. '
  'Origem: `hermes-v2-sidecar/CARTOES-PRODUTO.md`. Distribuicao na carga: '
  '18 `pode` · 28 `parcial` · 12 `nao`.';

COMMENT ON COLUMN conhecimento.cartao.promessa IS
  '🔴 O campo que decide o cartao. `pode` = o Leo fala em primeira pessoa. '
  '`parcial` = fala so da parte que existe. `nao` = nao promete e nao descreve '
  'como se existisse. ⚠️ `nao` NAO autoriza negar de cabeca: "a gente nao tem '
  'isso" dito sem consulta e tao inventado quanto prometer, e machuca mais, '
  'porque o cliente decide com base nisso.';

COMMENT ON CONSTRAINT cartao_sem_numero ON conhecimento.cartao IS
  'A trava que impede a regressao de 19/09 de voltar por outra porta. Se um '
  'numero entra no texto vetorizado, o agente para de consultar `fatos` e passa '
  'a responder de memoria. O CHECK derruba a carga em vez de deixar envelhecer.';

CREATE TABLE conhecimento.nota (
  id            text PRIMARY KEY,
  assunto       text NOT NULL,
  trecho        text NOT NULL,
  ordem         smallint NOT NULL,
  busca         text GENERATED ALWAYS AS (assunto || E'\n' || trecho) STORED,
  embedding     vector(768),
  fonte         text NOT NULL,
  atualizado_em date NOT NULL DEFAULT current_date,
  CONSTRAINT nota_sem_numero CHECK (trecho !~ '(R\$|[0-9]+,[0-9]{2}|[0-9]+\s?%)')
);

CREATE INDEX nota_embedding_idx ON conhecimento.nota USING hnsw (embedding vector_cosine_ops);

COMMENT ON TABLE conhecimento.nota IS
  'As notas de conhecimento do vault, fatiadas em trechos atomicos. Hoje elas '
  'sao treze arquivos lidos INTEIROS: a ferramenta do runtime atual nao tem '
  'busca e nao le secao, devolve o arquivo todo. Esta tabela e o que substitui '
  'isso. ⚠️ Fatiar so vale se cada trecho for auto-suficiente: o chunk viaja '
  'sozinho e nao leva o cabecalho do arquivo junto.';


-- ============================================================================
--  3. CONVERSA  ·  estado do dialogo
--     🔴 A regra desta secao: o que a pessoa VIU e o que o roteador PENSOU nao
--        moram na mesma tabela, porque so um dos dois volta para o prompt.
-- ============================================================================

CREATE TYPE conversa.saida AS ENUM ('tecnico', 'comercial', 'fora_escopo', 'escalonamento');

CREATE TABLE conversa.contato (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  canal         text NOT NULL DEFAULT 'whatsapp',
  identificador text NOT NULL,             -- telefone, hash. Nao logar em claro
  criado_em     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (canal, identificador)
);

CREATE TABLE conversa.sessao (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contato_id  uuid NOT NULL REFERENCES conversa.contato (id) ON DELETE CASCADE,
  aberta_em   timestamptz NOT NULL DEFAULT now(),
  fechada_em  timestamptz
);

-- ── 3.1 O que a pessoa viu ──────────────────────────────────────────────────
--  Esta e a UNICA tabela que e reenviada ao modelo como historico.

CREATE TABLE conversa.mensagem (
  id         bigserial PRIMARY KEY,
  sessao_id  uuid NOT NULL REFERENCES conversa.sessao (id) ON DELETE CASCADE,
  papel      text NOT NULL CHECK (papel IN ('cliente', 'leo', 'humano')),
  texto      text NOT NULL,
  criada_em  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX mensagem_sessao_idx ON conversa.mensagem (sessao_id, id);

COMMENT ON TABLE conversa.mensagem IS
  '🔴 So o que o usuario viu. A razao e medida: o historico e reenviado inteiro '
  'a cada turno, e numa conversa de oito turnos o turno 8 custou MAIS que o '
  'turno 1 sem abrir documento nenhum. Raciocinio interno aqui multiplica o '
  'custo por turno e, pior, entra no contexto como fala do assistente: o modelo '
  'passa a imitar o proprio raciocinio como se fosse resposta.';

-- ── 3.2 O que o roteador pensou ─────────────────────────────────────────────
--  🔴 NUNCA entra no historico. Existe para medicao, auditoria e depuracao.

CREATE TABLE conversa.turno_interno (
  id             bigserial PRIMARY KEY,
  sessao_id      uuid NOT NULL REFERENCES conversa.sessao (id) ON DELETE CASCADE,
  mensagem_id    bigint REFERENCES conversa.mensagem (id) ON DELETE SET NULL,
  saida          conversa.saida NOT NULL,
  tecnica_ok     boolean NOT NULL DEFAULT false,
  falha_tipo     text CHECK (falha_tipo IN ('fora_escopo', 'nao_e_meu_julgamento', 'lacuna_da_base')),
  cartoes_usados text[] NOT NULL DEFAULT '{}',
  fatos_lidos    text[] NOT NULL DEFAULT '{}',
  tokens_entrada integer,
  tokens_saida   integer,

  -- 🔑 Quantos dos `tokens_entrada` vieram de cache. SUBCONJUNTO, nunca parcela
  --    a somar: o Gemini conta o token cacheado DENTRO do total de entrada, e
  --    quem soma os dois infla a fatura em ate 10%.
  --    NULL significa "turno gravado antes de 21/09", quando a metrica nao era
  --    capturada, e nao "zero de cache". A diferenca importa em media.
  tokens_cache   integer,
  criado_em      timestamptz NOT NULL DEFAULT now(),

  -- 🔴 A REGRA DO SIDECAR, COMO CONSTRAINT.
  --    Gancho comercial so existe depois de sucesso tecnico. Vender por cima de
  --    um "nao sei" converte frustracao em pitch, que e o mesmo erro de
  --    responder preco para quem acabou de contar um prejuizo.
  CONSTRAINT comercial_exige_tecnica_ok CHECK (saida <> 'comercial' OR tecnica_ok),

  -- Falha so se declara quando a tecnica nao fechou, e ai ela e obrigatoria.
  CONSTRAINT falha_coerente CHECK (
    (tecnica_ok AND falha_tipo IS NULL) OR (NOT tecnica_ok AND falha_tipo IS NOT NULL)
  )
);

CREATE INDEX turno_interno_sessao_idx ON conversa.turno_interno (sessao_id, id);
CREATE INDEX turno_interno_saida_idx  ON conversa.turno_interno (saida, criado_em);

COMMENT ON CONSTRAINT falha_coerente ON conversa.turno_interno IS
  'Os tres estados de falha sao diferentes e a resposta certa muda com eles. '
  '`fora_escopo` vai para o gate de saida e NUNCA para "nao tenho essa '
  'informacao", que implica "existe e eu vou buscar". '
  '`nao_e_meu_julgamento` e escalonamento. '
  '`lacuna_da_base` e a unica falha de verdade, e vira dado de produto.';

-- ── 3.3 A classificacao do contato ──────────────────────────────────────────
--  🔑 Nao e mensagem, e FATO SOBRE A PESSOA. Volta ao prompt como uma linha
--     curta injetada, nunca como turno de historico. Derivado nao se guarda
--     como mensagem: reenviado como texto, vira verdade congelada e o agente
--     para de reclassificar quando a pessoa muda de assunto. E ela muda.

CREATE TABLE conversa.classificacao (
  contato_id     uuid PRIMARY KEY REFERENCES conversa.contato (id) ON DELETE CASCADE,
  regime_alvo    fatos.regime,
  atividade_cnae char(7) REFERENCES fatos.cnae (codigo),
  cidade         text,
  dentro_escopo  boolean,
  e_cliente      boolean NOT NULL DEFAULT false,
  confianca      fatos.confianca NOT NULL DEFAULT 'baixa',
  atualizada_em  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON COLUMN conversa.classificacao.e_cliente IS
  '⚠️ Hoje isto e sempre false e nao existe lookup: o produto esta em '
  'pre-lancamento, o app nao tem link de download e a conversao e a lista de '
  'espera. A coluna nasce agora para que o dia da virada seja uma carga de '
  'dado, e nao uma refatoracao.';

COMMENT ON TABLE conversa.classificacao IS
  '🔴 ISTO E MEMORIA PERSISTENTE ENTRE CONVERSAS, com todas as consequencias '
  'dela. O toolset de memoria foi DESLIGADO de proposito no v12. Ligar esta '
  'tabela e uma decisao de produto. ⚠️ E o precedente de vazamento ja existe: '
  'o arquivo de perfil do runtime injeta o perfil do dono em toda conversa de '
  'cliente. Escopo por contato aqui nao e boa pratica, e o que impede repetir '
  'aquele bug em escala maior e com dado de terceiro.';

-- Toda mudanca de classificacao fica registrada, para a linha injetada poder
-- ser auditada contra o que a pessoa de fato disse.
CREATE TABLE conversa.classificacao_historico (
  id            bigserial PRIMARY KEY,
  contato_id    uuid NOT NULL REFERENCES conversa.contato (id) ON DELETE CASCADE,
  campo         text NOT NULL,
  de            text,
  para          text,
  mensagem_id   bigint REFERENCES conversa.mensagem (id) ON DELETE SET NULL,
  criado_em     timestamptz NOT NULL DEFAULT now()
);


-- ============================================================================
--  4. TOOL CALLING  ·  a superficie que o agente enxerga
--     🔴 O agente NAO escreve SQL. Ele chama estas funcoes, e so estas.
--        Funcao com nome de pergunta, nao de tabela.
-- ============================================================================

-- Atendemos esta atividade? Responde a saida FORA DE ESCOPO antes de qualquer
-- conversa de produto ou de preco.
CREATE OR REPLACE FUNCTION fatos.consultar_cnae(p_busca text)
RETURNS TABLE (
  codigo            char(7),
  titulo            text,
  atende_me         boolean,
  atende_mei        boolean,
  anexo             text,
  pode_afirmar      boolean,
  exige_conselho    boolean,
  semelhanca        real
)
LANGUAGE sql STABLE AS $$
  SELECT c.codigo,
         coalesce(c.titulo_amigavel, c.descricao),
         c.atende_me_certeza,
         c.atende_mei_certeza,
         c.anexo_fator_r_grupo,
         (c.anexo_fator_r_confianca = 'alta'),   -- 🔴 o gate
         c.exige_conselho,
         greatest(
           similarity(coalesce(c.titulo_amigavel, ''), p_busca),
           similarity(c.descricao, p_busca)
         )
  FROM fatos.cnae c
  WHERE p_busca <% coalesce(c.titulo_amigavel, c.descricao)
     OR c.codigo = regexp_replace(p_busca, '\D', '', 'g')
  ORDER BY 8 DESC
  LIMIT 5;
$$;

COMMENT ON FUNCTION fatos.consultar_cnae IS
  '🔴 `pode_afirmar` false significa: NAO crave anexo nem aliquota. Pergunte o '
  'que a pessoa faz no dia a dia e oriente por atividade. Se ela insistir no '
  'codigo exato, escale. Medido: 118 de 1.332 codigos autorizam afirmar.';

-- Quanto custa? Um lugar so, e o agente nunca soma nem estima daqui.
CREATE OR REPLACE FUNCTION fatos.consultar_preco(p_regime fatos.regime)
RETURNS TABLE (nome text, valor_centavos integer, promocional boolean,
               vigencia_ate date, inclui text[], nao_inclui text[])
LANGUAGE sql STABLE AS $$
  SELECT p.nome, p.valor_centavos, p.promocional, p.vigencia_ate, p.inclui, p.nao_inclui
  FROM fatos.plano p
  WHERE p.regime = p_regime
  ORDER BY p.valor_centavos;
$$;

-- Quanto eu pagaria? Estimativa, e o contrato da funcao obriga a dizer isso.
CREATE OR REPLACE FUNCTION fatos.estimar_das(p_anexo text, p_rbt12 numeric, p_receita_mes numeric)
RETURNS TABLE (faixa smallint, nominal numeric, efetiva numeric,
               das_centavos bigint, sobra_centavos bigint, e_estimativa boolean)
LANGUAGE sql STABLE AS $$
  WITH f AS (
    SELECT * FROM fatos.simples_faixa
    WHERE anexo = p_anexo AND p_rbt12 <= rbt12_ate
    ORDER BY faixa LIMIT 1
  )
  SELECT f.faixa,
         f.nominal,
         round((p_rbt12 * f.nominal - f.deduzir) / nullif(p_rbt12, 0), 6),
         round(p_receita_mes * ((p_rbt12 * f.nominal - f.deduzir) / nullif(p_rbt12, 0)) * 100)::bigint,
         round(p_receita_mes * 100)::bigint
           - round(p_receita_mes * ((p_rbt12 * f.nominal - f.deduzir) / nullif(p_rbt12, 0)) * 100)::bigint,
         true
  FROM f;
$$;

COMMENT ON FUNCTION fatos.estimar_das IS
  '🔴 Tres obrigacoes que vem junto com o resultado: dizer que e aproximado, '
  'mostrar o que SOBRA na mesma frase (a pessoa decide olhando o que fica, nao '
  'o que sai), e nunca inventar o faturamento dela. ⚠️ Isto e ESTIMATIVA de '
  'conversa. A guia de verdade sai do apurador, que soma seis tributos '
  'arredondados um a um, e os dois numeros podem divergir em centavos. Quem '
  'exige o valor fechado e recusa a estimativa vai para escalonamento.';

-- O que a gente faz sobre isso? Busca semantica, so no que e texto.
CREATE OR REPLACE FUNCTION conhecimento.buscar_cartao(p_embedding vector(768), p_limite int DEFAULT 3)
RETURNS TABLE (id text, titulo text, estado text, acao text, restricao text,
               promessa conhecimento.promessa, onde_no_app text, distancia real)
LANGUAGE sql STABLE AS $$
  SELECT c.id, c.titulo, c.estado, c.acao, c.restricao, c.promessa, c.onde_no_app,
         (c.embedding <=> p_embedding)::real
  FROM conhecimento.cartao c
  WHERE c.embedding IS NOT NULL
  ORDER BY c.embedding <=> p_embedding
  LIMIT p_limite;
$$;

COMMENT ON FUNCTION conhecimento.buscar_cartao IS
  'Devolve a `restricao` SEMPRE, junto da `acao`. Separar as duas, ou deixar a '
  'restricao para uma segunda chamada, e como o agente acaba prometendo o que '
  'nao existe: ele responde com o que veio primeiro.';


-- ============================================================================
--  5. O QUE ESTE SCHEMA NAO RESOLVE
--
--  * 🟡 A fila de escalonamento nao existe: `fatos.escalonamento_destino` nasce
--       com tudo inativo e aguardando decisao.
--  * 🟡 `conversa.classificacao` e memoria entre conversas, e ligar isso e
--       decisao de produto, nao migracao. Ver o comentario da tabela.
--  * 🔴 Aderencia nao se resolve em banco. O unico defeito de qualidade medido
--       no agente foi ele abrir a nota que proibe especular e especular mesmo
--       assim. Schema garante que o dado certo chega; nao garante que o modelo
--       obedece. Isso continua sendo bateria de teste e olho humano.
--  * ⚠️ `vector(768)` e a dimensao do modelo de embedding escolhido. Trocar de
--       modelo e migracao com recarga de todos os embeddings, nao um ALTER.
-- ============================================================================
