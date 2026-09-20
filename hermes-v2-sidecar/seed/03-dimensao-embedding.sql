-- ============================================================================
--  seed/03-dimensao-embedding.sql  ·  1536 para 768
--
--  O `schema.sql` nasceu com `vector(1536)`. O modelo escolhido foi o de
--  embedding do Gemini, que entrega **768** dimensoes. Este arquivo migra um
--  banco que ja foi criado com a dimensao antiga.
--
--  🔴 TROCAR A DIMENSAO INVALIDA TODO EMBEDDING JA GRAVADO. Nao e conversao:
--  vetor de 1536 e vetor de 768 sao objetos diferentes, e nao existe "cortar as
--  ultimas 768 posicoes". Por isso as colunas sao zeradas de proposito, e a
--  carga (`seed/carregar-conhecimento.ts`) precisa rodar depois desta migracao.
--
--  ⚠️ O indice HNSW tem que CAIR antes do ALTER e nascer de novo depois. Ele
--  guarda a dimensao na propria estrutura: manter o indice antigo sobre coluna
--  nova daria erro de dimensao so na hora da primeira busca, ja em uso.
--
--  Idempotente: roda de novo sem estragar nada.
-- ============================================================================

BEGIN;

DROP INDEX IF EXISTS conhecimento.cartao_embedding_idx;
DROP INDEX IF EXISTS conhecimento.nota_embedding_idx;

-- A funcao de busca declara a dimensao na assinatura, entao ela tambem some e
-- volta. `DROP FUNCTION` antes do `CREATE OR REPLACE` porque mudanca de tipo de
-- parametro cria uma sobrecarga nova em vez de substituir: ficariam duas
-- funcoes com o mesmo nome, e o Postgres escolheria a errada em silencio.
DROP FUNCTION IF EXISTS conhecimento.buscar_cartao(vector, int);

UPDATE conhecimento.cartao SET embedding = NULL WHERE embedding IS NOT NULL;
UPDATE conhecimento.nota   SET embedding = NULL WHERE embedding IS NOT NULL;

ALTER TABLE conhecimento.cartao ALTER COLUMN embedding TYPE vector(768);
ALTER TABLE conhecimento.nota   ALTER COLUMN embedding TYPE vector(768);

CREATE INDEX cartao_embedding_idx ON conhecimento.cartao
  USING hnsw (embedding vector_cosine_ops);
CREATE INDEX nota_embedding_idx ON conhecimento.nota
  USING hnsw (embedding vector_cosine_ops);

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

COMMIT;

-- Conferencia: as duas colunas tem que reportar 768.
SELECT c.relname AS tabela, a.atttypmod AS dimensao
  FROM pg_attribute a
  JOIN pg_class c ON c.oid = a.attrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
 WHERE n.nspname = 'conhecimento' AND a.attname = 'embedding';
