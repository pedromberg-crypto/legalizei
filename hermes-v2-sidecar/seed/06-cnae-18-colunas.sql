-- ============================================================================
--  seed/06-cnae-18-colunas.sql  ·  a tabela de CNAE vira 18 colunas,
--                                  ganha sinonimos, e a busca para de mentir
--
--  🪟 JURISDICAO. Este arquivo mora em `seed/`, que e territorio da VPS: quem
--     decide indice, peso e forma final e quem tem o banco na frente. Ele veio
--     do vault porque o Pedro pediu a migration junto com a refatura, e deve
--     ser lido como PROPOSTA COM CRITERIO ANEXO, nao como desenho fechado. O
--     criterio de aceite, esse sim e do vault:
--     `execucao/agente-whatsapp-vault/_aceite-busca-de-cnae.md`, 6 itens.
--
--  ── POR QUE ISTO EXISTE ────────────────────────────────────────────────────
--
--  Dois defeitos medidos em 24/09, e nenhum dos dois era o modelo.
--
--  1. O AGENTE DELIRAVA COM FATOR R porque a tabela tinha uma categoria que
--     nao devia existir. O classificador tratava "nao achei inciso" como
--     estado terminal (`requer-revisao`), quando a LC 123 tem DOIS residuais
--     que se completam: §5º-F (demais servicos → Anexo III fixo) e §5º-I XII
--     (atividade intelectual → Fator R). Nao achar inciso nominado E a
--     resposta. Eram 7 dos 87 CNAEs em que o apurador se recusava a calcular
--     o DAS, incluindo design de UI/UX, que o §5º-I VI nomeia em letra.
--
--  2. O AGENTE DELIRAVA COM ATIVIDADE porque a busca olhava o campo errado:
--
--       WHERE p_busca <% coalesce(c.titulo_amigavel, c.descricao)
--
--     Ela comparava a frase do cliente contra um campo de 36 caracteres em
--     media, e ignorava o `atividades`, que tem 542 e e a lista do IBGE com o
--     vocabulario real (BARBEARIA, SAPATEIRO, "CRIACAO DE LOGO, LOGOTIPO").
--     Nao era o trigrama que era ruim: era o alvo curto demais.
--
--     🔴 E o pior nao era devolver vazio, era devolver um CNAE NOSSO para quem
--        a casa nao atende. Medido: "tenho um restaurante" devolvia Restauracao
--        de obras de arte (atende=sim) e "vendo roupa" devolvia Aluguel de
--        roupas (atende=sim). O agente lia `atende_me = true` no topo e dizia
--        que atendia.
--
--  ── ORDEM DE EXECUCAO ──────────────────────────────────────────────────────
--
--    1. este arquivo   (psql -f, ou pelo editor do Supabase)
--    2. carregar-cnae  (node .build/seed/carregar-cnae.js) — recarrega as 1.332
--                       linhas ja curadas, da `_entrega-leo/cnae.csv`
--
--  🔴 A ORDEM IMPORTA: a carga escreve nas colunas novas e nos sinonimos. Rodar
--     ao contrario falha no INSERT, que e o comportamento certo — melhor falhar
--     na carga do que servir meia tabela.
-- ============================================================================

BEGIN;

-- ════════════════════════════════════════════════════════════════════════════
--  1 · A TABELA — 22 colunas viram 18, e o vocabulario muda junto
-- ════════════════════════════════════════════════════════════════════════════
--  ALTER em vez de DROP + CREATE de proposito: `agenda.atividade_cnae` tem FK
--  para `fatos.cnae(codigo)`, e recriar a tabela levaria a referencia junto.

-- 1.1 · o que so muda de nome
ALTER TABLE fatos.cnae RENAME COLUMN descricao           TO titulo_oficial;
ALTER TABLE fatos.cnae RENAME COLUMN anexo_fator_r_grupo TO anexo;
ALTER TABLE fatos.cnae RENAME COLUMN anexo_fator_r_fonte TO anexo_inciso;
ALTER TABLE fatos.cnae RENAME COLUMN atende_me_certeza   TO atende_me;
ALTER TABLE fatos.cnae RENAME COLUMN atende_mei_certeza  TO atende_mei;

-- 1.2 · o que nasce agora
ALTER TABLE fatos.cnae
  ADD COLUMN IF NOT EXISTS descricao_oficial text,
  -- 🔑 A coluna que muda a busca: 542 caracteres por CNAE de vocabulario real
  --    do IBGE, que ate hoje nunca foram consultados.
  ADD COLUMN IF NOT EXISTS termos_de_busca   text,
  ADD COLUMN IF NOT EXISTS familia           text,
  -- 🔴 Sem ela o agente responde "nao atendemos" e NAO SABE POR QUE — e quando
  --    nao sabe, improvisa. Foi assim que ele mandou cliente de folha de
  --    pagamento procurar outro contador.
  ADD COLUMN IF NOT EXISTS motivo_nao_atende text;

-- 1.3 · o que sai, e vira curadoria no repo
--  Nenhuma delas responde ao cliente: sao o RASTRO de por que o CNAE entrou
--  nos 87 ou ficou fora. Coluna de curadoria no banco do agente e peso morto
--  que ele pode ler errado — e a `anexo_fator_r_confianca` provou isso o dia
--  inteiro: media o NOSSO dever de casa e ele leria como incerteza da LEI.
ALTER TABLE fatos.cnae
  DROP COLUMN IF EXISTS anexo_base,
  DROP COLUMN IF EXISTS anexo_fator_r_confianca,
  DROP COLUMN IF EXISTS vedado_simples,
  DROP COLUMN IF EXISTS ambiguo_simples,
  DROP COLUMN IF EXISTS iss_bh_aliquota,
  DROP COLUMN IF EXISTS iss_bh_varia,
  DROP COLUMN IF EXISTS risco_baixo_cgsim,
  DROP COLUMN IF EXISTS exige_registro_setorial,
  DROP COLUMN IF EXISTS secao_id,
  DROP COLUMN IF EXISTS motor_apura,
  DROP COLUMN IF EXISTS motor_bloqueio;

-- 1.4 · as duas GERADAS
--  🔑 Duas colunas que sao a mesma verdade nao podem divergir se so existe
--     uma. `mei_permitido` era coluna propria e media exatamente "mei_ocupacoes
--     esta preenchida" — 351 de 351, zero excecao. `fator_r` era a pergunta
--     sim/nao que o Pedro pediu, e sai direto do anexo.
ALTER TABLE fatos.cnae DROP COLUMN IF EXISTS mei_permitido;
ALTER TABLE fatos.cnae
  ADD COLUMN mei_permitido boolean
    GENERATED ALWAYS AS (mei_ocupacoes IS NOT NULL AND mei_ocupacoes <> 'nao-se-aplica') STORED,
  ADD COLUMN fator_r boolean
    GENERATED ALWAYS AS (anexo = 'III-ou-V') STORED;

-- 1.5 · o vocabulario de ausencia
--  🔴 Vazio significava QUATRO coisas diferentes na tabela antiga — nao se
--     aplica, nao verificado, existe na fonte e nunca importado, coluna morta
--     — e o agente lia ausencia como negacao. Campo dependente agora DECLARA
--     que depende.
UPDATE fatos.cnae SET
  titulo_amigavel    = coalesce(nullif(trim(titulo_amigavel), ''),    'nao-se-aplica'),
  descricao_amigavel = coalesce(nullif(trim(descricao_amigavel), ''), 'nao-se-aplica'),
  descricao_oficial  = coalesce(nullif(trim(descricao_oficial), ''),  'nao-se-aplica'),
  termos_de_busca    = coalesce(nullif(trim(termos_de_busca), ''),    'nao-se-aplica'),
  familia            = coalesce(nullif(trim(familia), ''),            'nao-se-aplica'),
  anexo              = coalesce(nullif(trim(anexo), ''),              'nao-se-aplica'),
  anexo_inciso       = coalesce(nullif(trim(anexo_inciso), ''),       'nao-se-aplica'),
  mei_ocupacoes      = coalesce(nullif(trim(mei_ocupacoes), ''),      'nao-se-aplica'),
  conselho_qual      = coalesce(nullif(trim(conselho_qual), ''),      'nao-se-aplica'),
  motivo_nao_atende  = coalesce(nullif(trim(motivo_nao_atende), ''),  'nao-se-aplica');

ALTER TABLE fatos.cnae
  ALTER COLUMN titulo_amigavel    SET NOT NULL,
  ALTER COLUMN descricao_amigavel SET NOT NULL,
  ALTER COLUMN descricao_oficial  SET NOT NULL,
  ALTER COLUMN termos_de_busca    SET NOT NULL,
  ALTER COLUMN familia            SET NOT NULL,
  ALTER COLUMN anexo              SET NOT NULL,
  ALTER COLUMN anexo_inciso       SET NOT NULL,
  ALTER COLUMN mei_ocupacoes      SET NOT NULL,
  ALTER COLUMN conselho_qual      SET NOT NULL,
  ALTER COLUMN motivo_nao_atende  SET NOT NULL;

-- 🔴 `requer-revisao` NAO esta na lista, e e o ponto: a categoria deixou de
--    existir. Se voltar, o banco recusa.
ALTER TABLE fatos.cnae DROP CONSTRAINT IF EXISTS cnae_anexo_valido;
ALTER TABLE fatos.cnae ADD CONSTRAINT cnae_anexo_valido
  CHECK (anexo IN ('III', 'IV', 'III-ou-V', 'nao-se-aplica'));

ALTER TABLE fatos.cnae DROP CONSTRAINT IF EXISTS cnae_atendido_tem_anexo;
ALTER TABLE fatos.cnae ADD CONSTRAINT cnae_atendido_tem_anexo
  CHECK (NOT atende_me OR anexo <> 'nao-se-aplica');

COMMENT ON COLUMN fatos.cnae.anexo IS
  'III = Anexo III sempre, Fator R nao muda nada · III-ou-V = decidido pelo '
  'Fator R, mes a mes · IV = FORA DO ESCOPO da casa (construcao, limpeza, '
  'vigilancia, advocacia) · nao-se-aplica = comercio ou industria, nao e servico.';

COMMENT ON COLUMN fatos.cnae.anexo_inciso IS
  'O dispositivo da LC 123 que fundamenta o anexo. "§5º-F" e o residual '
  '(nenhum inciso nomeia, e nao e atividade intelectual) — e RESPOSTA, nao '
  'falta de resposta. Onde aparece "SC COSIT", o lastro e Solucao de Consulta '
  'lida na integra, o mais forte que a casa tem.';

COMMENT ON COLUMN fatos.cnae.termos_de_busca IS
  'A lista do IBGE com o vocabulario que a pessoa de fato digita: BARBEARIA, '
  'SAPATEIRO, "CRIACAO DE LOGO, LOGOTIPO". 542 caracteres em media. '
  '⚠️ Tem REFERENCIA CRUZADA para outros CNAEs ("produtos para dentista" '
  'aparece em FABRICACAO DE PRODUTOS QUIMICOS), por isso pesa MENOS que o '
  'titulo na busca — ver `fatos.consultar_cnae`.';

-- ════════════════════════════════════════════════════════════════════════════
--  2 · OS SINONIMOS — a camada nossa, separada do dado do IBGE
-- ════════════════════════════════════════════════════════════════════════════
--  🔴 Existe porque `psicologo` nao aparece em NENHUM campo da tabela: nem no
--     titulo oficial, nem no amigavel, nem nos 542 caracteres de termos.
--     Profissao inteira invisivel por AUSENCIA DE DADO, nao por peso de busca
--     — e nenhum indice, peso ou embedding acha palavra que ninguem escreveu.
--
--  ⚠️ Os dois primeiros sinonimos apontam para CNAEs que a casa NAO atende
--     (8650003 psicologia exige conselho · 9313100 condicionamento fisico exige
--     alvara previo). Isso e o certo: a resposta util e a RECUSA COM MOTIVO,
--     e ela so acontece se o CNAE certo for encontrado.

CREATE TABLE IF NOT EXISTS fatos.cnae_sinonimos (
  termo       text PRIMARY KEY,
  cnae_codigo char(7) NOT NULL REFERENCES fatos.cnae (codigo),
  criado_em   date NOT NULL DEFAULT current_date
);

COMMENT ON TABLE fatos.cnae_sinonimos IS
  'Vocabulario NOSSO, nunca do IBGE. Uma linha aqui e uma afirmacao de que '
  'quem diz este termo quer este CNAE — inclusive quando a resposta e que a '
  'casa nao atende. Carregada por seed/carregar-cnae.ts a partir de '
  'pesquisa/cnae-matriz/cnae-aliases.json.';

-- ════════════════════════════════════════════════════════════════════════════
--  3 · OS INDICES
-- ════════════════════════════════════════════════════════════════════════════
DROP INDEX IF EXISTS fatos.cnae_atende_me_idx;
DROP INDEX IF EXISTS fatos.cnae_titulo_trgm;
DROP INDEX IF EXISTS fatos.cnae_descricao_trgm;

CREATE INDEX cnae_atende_me_idx   ON fatos.cnae (atende_me) WHERE atende_me;
CREATE INDEX cnae_familia_idx     ON fatos.cnae (familia);
CREATE INDEX cnae_titulo_trgm     ON fatos.cnae USING gin (titulo_amigavel gin_trgm_ops);
CREATE INDEX cnae_oficial_trgm    ON fatos.cnae USING gin (titulo_oficial gin_trgm_ops);
-- 🔑 O indice que faltava. `to_tsvector` em vez de trigrama porque aqui o alvo
--    e uma lista longa de termos, e busca por PALAVRA e mais precisa que por
--    pedaco de 3 letras num texto de 542 caracteres.
CREATE INDEX cnae_termos_fts      ON fatos.cnae
  USING gin (to_tsvector('portuguese', termos_de_busca));

-- ════════════════════════════════════════════════════════════════════════════
--  4 · A BUSCA — em tres degraus, e o primeiro decide sozinho
-- ════════════════════════════════════════════════════════════════════════════
--  A · SINONIMO exato       → score 1.0, devolve e para
--  B · TITULO por trigrama  → o que ja existia, e o que a lapidacao de 46
--                             titulos em 24/09 afinou
--  C · TERMOS por tsvector  → os 542 caracteres, com peso MENOR
--
--  🔴 O PESO MENOR NO DEGRAU C NAO E DETALHE, E O CRITERIO A5 DO ACEITE.
--     O `termos_de_busca` tem referencia cruzada: "dentista" aparece em 4
--     CNAEs e o primeiro e FABRICACAO DE PRODUTOS QUIMICOS; "restaurante"
--     aparece em 9 e o primeiro e FABRICACAO DE ARTIGOS DE VIDRO. Trazer o
--     campo sem peso troca um falso negativo por um falso positivo — que e
--     pior, porque abre empresa errada.
--
--  🔴 E O PISO (criterio A4). A funcao antiga devolvia SEMPRE 5 linhas, mesmo
--     quando a melhor tinha 0.04 de semelhanca — foi assim que "tiro xerox"
--     devolveu "Consultoria em TI". Agora, abaixo do piso, ela devolve ZERO, e
--     o agente pede mais detalhe em vez de inventar.

DROP FUNCTION IF EXISTS fatos.consultar_cnae(text);

CREATE FUNCTION fatos.consultar_cnae(p_busca text)
RETURNS TABLE (
  codigo                 char(7),
  titulo                 text,
  titulo_oficial         text,
  familia                text,
  -- 🔴 "a CASA atende", nunca "a lei permite". O prefixo veio do 05 e FICA:
  --    o nome antigo era `atende_mei`, e o agente leu `false` como "esta
  --    atividade nao pode ser MEI", afirmando regra federal falsa a um cliente.
  casa_atende_me         boolean,
  casa_atende_mei        boolean,
  anexo                  text,
  fator_r                boolean,
  anexo_inciso           text,
  motivo_nao_atende      text,
  pode_afirmar_anexo     boolean,
  -- 🔴 Sempre false. Nao e dado, e aviso que viaja junto da linha: a lista de
  --    ocupacoes do MEI e do governo e nao esta neste banco.
  pode_afirmar_lista_mei boolean,
  exige_conselho         boolean,
  semelhanca             real,
  achou_por              text
)
LANGUAGE sql STABLE AS $$
WITH busca AS (
  SELECT lower(btrim(p_busca)) AS q,
         regexp_replace(p_busca, '\D', '', 'g') AS so_digitos
),
-- ── A · o codigo digitado direto, e o sinonimo. Os dois sao exatos. ────────
exato AS (
  SELECT c.*, 1.0::real AS score, 'codigo'::text AS via
    FROM fatos.cnae c, busca b
   WHERE length(b.so_digitos) = 7 AND c.codigo = b.so_digitos
  UNION ALL
  SELECT c.*, 1.0::real, 'sinonimo'::text
    FROM fatos.cnae_sinonimos s
    JOIN fatos.cnae c ON c.codigo = s.cnae_codigo, busca b
   WHERE s.termo = b.q OR b.q LIKE '%' || s.termo || '%'
),
-- ── B · o titulo, por trigrama. O peso cheio. ──────────────────────────────
por_titulo AS (
  SELECT c.*,
         greatest(
           word_similarity(b.q, c.titulo_amigavel),
           word_similarity(b.q, c.titulo_oficial)
         )::real AS score,
         'titulo'::text AS via
    FROM fatos.cnae c, busca b
   WHERE NOT EXISTS (SELECT 1 FROM exato e WHERE e.codigo = c.codigo)
     AND (b.q <% c.titulo_amigavel OR b.q <% c.titulo_oficial)
),
-- ── C · os termos do IBGE, por palavra, valendo no maximo 0.55 ─────────────
--     O teto e deliberado: um casamento so por termo cruzado nunca pode
--     ficar a frente de um casamento por titulo, que comeca em 0.6 (o
--     `word_similarity_threshold` padrao do `<%`).
por_termos AS (
  SELECT c.*,
         least(0.55, 0.30 + ts_rank(to_tsvector('portuguese', c.termos_de_busca),
                                    plainto_tsquery('portuguese', b.q)))::real AS score,
         'termos'::text AS via
    FROM fatos.cnae c, busca b
   WHERE c.termos_de_busca <> 'nao-se-aplica'
     AND NOT EXISTS (SELECT 1 FROM exato e      WHERE e.codigo = c.codigo)
     AND NOT EXISTS (SELECT 1 FROM por_titulo t WHERE t.codigo = c.codigo)
     AND to_tsvector('portuguese', c.termos_de_busca)
         @@ plainto_tsquery('portuguese', b.q)
),
tudo AS (
  SELECT * FROM exato
  UNION ALL SELECT * FROM por_titulo
  UNION ALL SELECT * FROM por_termos
)
SELECT t.codigo,
       t.titulo_amigavel,
       t.titulo_oficial,
       t.familia,
       t.atende_me,
       t.atende_mei,
       t.anexo,
       t.fator_r,
       t.anexo_inciso,
       t.motivo_nao_atende,
       -- 🔑 O GATE, com a pergunta nova. Ele media `confianca = 'alta'`, que
       --    media o NOSSO dever de casa, e o agente lia como incerteza da lei.
       --    Hoje a categoria indefinida nao existe mais: o que resta e saber se
       --    a linha TEM anexo. Anexo IV tambem nao se afirma — esta fora do
       --    escopo, e cravar aliquota dele seria prometer o que a casa nao faz.
       (t.anexo IN ('III', 'III-ou-V')),
       false,
       t.exige_conselho,
       t.score,
       t.via
  FROM tudo t
 -- 🔴 O PISO. Abaixo disto e ruido, e devolver ruido e pior que devolver nada.
 WHERE t.score >= 0.25
 ORDER BY t.score DESC, t.atende_me DESC, t.codigo
 LIMIT 5;
$$;

COMMENT ON FUNCTION fatos.consultar_cnae IS
  '🔴 `motivo_nao_atende` NAO e enfeite: quando `atende_me` e false, ele e a '
  'RESPOSTA. Sem ele o agente diz "nao atendemos" e improvisa o porque. '
  '🔑 `achou_por` diz em qual degrau bateu — `sinonimo` e `codigo` sao exatos; '
  '`titulo` e forte; `termos` e o mais fraco e tem teto de 0.55, porque o '
  'campo tem referencia cruzada para outros CNAEs. '
  '⚠️ Zero linhas e RESULTADO VALIDO: significa que nada passou do piso, e a '
  'saida certa e pedir mais detalhe, nunca chutar o primeiro da lista.';

-- ════════════════════════════════════════════════════════════════════════════
--  5 · OS PORTOES — cada um ja foi um erro real neste projeto
-- ════════════════════════════════════════════════════════════════════════════
DO $$
DECLARE
  v_total int; v_me int; v_sem_anexo int; v_revisao int;
BEGIN
  SELECT count(*), count(*) FILTER (WHERE atende_me),
         count(*) FILTER (WHERE atende_me AND anexo = 'nao-se-aplica'),
         count(*) FILTER (WHERE anexo = 'requer-revisao')
    INTO v_total, v_me, v_sem_anexo, v_revisao
    FROM fatos.cnae;

  IF v_total < 1300 THEN
    RAISE EXCEPTION 'so % linhas em fatos.cnae — carga incompleta', v_total;
  END IF;
  -- 🔴 Um CNAE que a casa atende e nao tem anexo E o `requer-revisao` voltando
  --    com outro nome. Se aparecer, para aqui e nao em producao.
  IF v_sem_anexo > 0 THEN
    RAISE EXCEPTION '% CNAE(s) atendidos sem anexo definido', v_sem_anexo;
  END IF;
  IF v_revisao > 0 THEN
    RAISE EXCEPTION 'a categoria requer-revisao voltou em % linha(s)', v_revisao;
  END IF;

  RAISE NOTICE 'fatos.cnae: % linhas · % atendidos no ME · 0 sem anexo', v_total, v_me;
END $$;

COMMIT;
