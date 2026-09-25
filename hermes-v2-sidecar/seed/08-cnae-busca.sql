-- ============================================================================
--  seed/08-cnae-busca.sql  ·  so a funcao de busca, e por isso da para rodar
--                             quantas vezes precisar
--
--  🔴 POR QUE ESTE ARQUIVO EXISTE. O `06-` faz `ALTER TABLE ... RENAME`, que
--     NAO e idempotente: rodado uma segunda vez ele morre em
--
--         column "descricao" does not exist
--
--     e, como o arquivo inteiro vive numa transacao, a correcao da BUSCA morria
--     junto com ele. Aconteceu em 24/09, logo depois de o `06-` ja ter passado.
--
--  🔑 Aqui dentro so ha `CREATE OR REPLACE FUNCTION` e indice com
--     `DROP ... IF EXISTS`. Rodar de novo e seguro, e e o caminho para ajustar
--     limiar de busca sem tocar em estrutura.
--
--  ── O QUE MUDOU NESTA VERSAO, e foi medido na VPS ─────────────────────────
--
--  A primeira versao filtrava o titulo so por `b.q <% titulo`. O operador `<%`
--  carrega o limiar padrao do `pg_trgm`, que e **0.6** — quatro vezes mais
--  estrito que a funcao ANTIGA, que tinha `word_similarity > 0.15` entre
--  quatro condicoes em OR. O resultado, medido:
--
--      "conserto notebook"      → vazio   (e o titulo TEM a palavra notebook)
--      "dou aula de ingles"     → vazio   (e o titulo TEM ingles)
--      "cursinho pra concurso"  → vazio   (e o titulo TEM cursinho e concurso)
--      "faco sites"             → vazio
--
--  Sao todas frases de MULTIPLAS PALAVRAS contra titulo curto, que e onde 0.6
--  corta. As condicoes permissivas voltaram, e `similarity` entrou no score:
--  `word_similarity` so olha janela CONTIGUA, e "conserto notebook" nao forma
--  janela em "Conserto de computador e notebook" — mas a similaridade do
--  conjunto inteiro e alta. As duas medem coisas diferentes.
--
--  ⚠️ O simulador do vault nao pegou isso porque calcula a cobertura na
--     direcao INVERTIDA, e por isso e mais permissivo que o Postgres. Serve
--     para escolher entre dois titulos; nao serve para prever onde o banco
--     corta. Quem mede o corte e `npm run teste:cnae`, aqui.
-- ============================================================================

BEGIN;

-- ════════════════════════════════════════════════════════════════════════════
--  3 · OS INDICES
-- ════════════════════════════════════════════════════════════════════════════
DROP INDEX IF EXISTS fatos.cnae_atende_me_idx;
DROP INDEX IF EXISTS fatos.cnae_titulo_trgm;
DROP INDEX IF EXISTS fatos.cnae_descricao_trgm;

CREATE INDEX IF NOT EXISTS cnae_atende_me_idx   ON fatos.cnae (atende_me) WHERE atende_me;
CREATE INDEX IF NOT EXISTS cnae_familia_idx     ON fatos.cnae (familia);
CREATE INDEX IF NOT EXISTS cnae_titulo_trgm     ON fatos.cnae USING gin (titulo_amigavel gin_trgm_ops);
CREATE INDEX IF NOT EXISTS cnae_oficial_trgm    ON fatos.cnae USING gin (titulo_oficial gin_trgm_ops);
-- 🔑 O indice que faltava. `to_tsvector` em vez de trigrama porque aqui o alvo
--    e uma lista longa de termos, e busca por PALAVRA e mais precisa que por
--    pedaco de 3 letras num texto de 542 caracteres.
CREATE INDEX IF NOT EXISTS cnae_termos_fts      ON fatos.cnae
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
/* 🔴 O FILTRO AQUI JA FOI ESTREITO DEMAIS, E CUSTOU 4 CASOS DO ACEITE.
   A primeira versao usava so `b.q <% titulo`, e o `<%` carrega o limiar padrao
   do `pg_trgm`, que e **0.6**. A funcao ANTIGA tinha quatro condicoes em OR,
   uma delas `word_similarity > 0.15` — quatro vezes mais permissiva. Trocar
   uma pela outra derrubou exatamente as frases de MULTIPLAS PALAVRAS contra
   titulo curto, medido na VPS em 24/09:

     "conserto notebook"      → vazio   (o titulo TEM a palavra notebook)
     "dou aula de ingles"     → vazio   (o titulo TEM ingles)
     "cursinho pra concurso"  → vazio   (o titulo TEM cursinho e concurso)
     "faco sites"             → vazio

   🔑 E o simulador local do vault nao pegou porque ele calcula a cobertura na
   direcao INVERTIDA — fracao da janela coberta pela busca, nao o contrario.
   Ele e mais permissivo que o Postgres. Vale para escolher entre dois titulos,
   nao para prever o corte. Quem mede o corte e este banco. */
por_titulo AS (
  SELECT c.*,
         greatest(
           word_similarity(b.q, c.titulo_amigavel),
           word_similarity(b.q, c.titulo_oficial),
           -- 🔑 `similarity` entra no score porque `word_similarity` so olha
           --    janela CONTIGUA: "conserto notebook" nao forma janela em
           --    "Conserto de computador e notebook", mas a similaridade do
           --    conjunto inteiro e alta. As duas medem coisas diferentes.
           similarity(b.q, c.titulo_amigavel)
         )::real AS score,
         'titulo'::text AS via
    FROM fatos.cnae c, busca b
   WHERE NOT EXISTS (SELECT 1 FROM exato e WHERE e.codigo = c.codigo)
     AND (b.q <% c.titulo_amigavel
          OR b.q <% c.titulo_oficial
          OR word_similarity(b.q, c.titulo_amigavel) > 0.2
          OR word_similarity(b.q, c.titulo_oficial)  > 0.2
          OR similarity(b.q, c.titulo_amigavel)      > 0.2
          OR c.titulo_amigavel ILIKE '%' || b.q || '%')
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
 /* 🔴 O DESEMPATE NAO PODE PREFERIR OS NOSSOS — e a primeira versao deste
    arquivo fazia isso (`t.atende_me DESC`), o que viola o criterio A3 do
    aceite. Em empate, puxar um CNAE que a casa atende para o topo e
    exatamente o defeito que a migration existe para matar: "tenho um
    restaurante" devolvia Restauracao de obras de arte com `atende_me = true`,
    e o agente dizia que atendia. Errar para "nao atendemos" e barato; errar
    para "atendemos" abre empresa errada. Empate desempata por codigo, que e
    arbitrario e NAO e enviesado. */
 ORDER BY t.score DESC, t.codigo
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

COMMIT;
