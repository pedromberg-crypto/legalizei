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
--    1. npm run sql seed/06-cnae-18-colunas.sql   ← a FORMA
--    2. npm run seed:cnae                          ← os DADOS
--    3. npm run sql seed/07-cnae-travas.sql        ← as TRAVAS
--
--  🔴 A ORDEM NAO E PREFERENCIA, E CORRECAO — e a primeira versao errou nisso.
--     As travas moravam aqui, antes da carga. Mas trava guarda o dado NOVO, e
--     antes da carga o banco ainda tem o VELHO: `cnae_atendido_tem_anexo` exige
--     que todo CNAE atendido tenha anexo, e o banco tinha os 7 `requer-revisao`
--     que morreram em 24/09. A migration abortou na VPS com
--     `check constraint "cnae_anexo_valido" is violated by some row`, e estava
--     certa em abortar — so estava no lugar errado da fila.
--
--     forma → dados → travas. Nessa ordem, e por esse motivo.
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

-- 1.4 · 🔴 A TRADUCAO DO VOCABULARIO — e a primeira versao deste arquivo
--        ESQUECEU dela, e por isso a migration abortou na VPS em 24/09:
--
--          check constraint "cnae_anexo_valido" is violated by some row
--
--        Renomear a coluna nao renomeia o CONTEUDO. O banco continuava com
--        `III-fixo`, `fator-r-dinamico(III<->V, limiar 28%)` e `requer-revisao`
--        gravados nas 1.332 linhas, e a trava so aceita o vocabulario novo.
--
--        🔑 A traducao acontece ANTES das geradas e das travas, porque
--        `fator_r` sai de `anexo`: computar a coluna gerada sobre o valor
--        antigo daria `false` em toda linha, calado.
UPDATE fatos.cnae SET anexo = CASE
  WHEN anexo = 'III-fixo'                 THEN 'III'
  WHEN anexo LIKE 'fator-r-dinamico%'     THEN 'III-ou-V'
  WHEN anexo = 'IV'                       THEN 'IV'
  -- A categoria que morreu em 24/09. Aqui ela vira ausencia declarada; a carga
  -- logo em seguida escreve o anexo de verdade, que hoje existe para os 87.
  WHEN anexo = 'requer-revisao'           THEN 'nao-se-aplica'
  WHEN coalesce(trim(anexo), '') = ''     THEN 'nao-se-aplica'
  ELSE anexo
END;

-- O prefixo `LC123 art18 ` sai aqui: a tabela nova guarda so o inciso.
UPDATE fatos.cnae
   SET anexo_inciso = regexp_replace(anexo_inciso, '^LC123 art18 ', '')
 WHERE anexo_inciso LIKE 'LC123 art18 %';

-- 1.5 · as duas GERADAS
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

-- 1.6 · o vocabulario de ausencia
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

/* 🔴 Os `NOT NULL` e os `CHECK` foram para `seed/07-cnae-travas.sql`, que roda
   DEPOIS da carga. Trava guarda o dado novo; aplicada aqui ela julga o velho,
   e foi exatamente isso que abortou a primeira rodada na VPS. */

/* 🔴 AS TRAVAS MUDARAM DE ARQUIVO — e a razao e o segundo erro que a rodada
   de 24/09 na VPS expos.

   Elas estavam aqui, antes da carga. Mas trava guarda o dado NOVO, e aqui
   ainda esta o VELHO: `cnae_atendido_tem_anexo` exige que todo CNAE atendido
   tenha anexo, e o banco tem os **7 `requer-revisao`** que morreram hoje.
   Aplicar a trava contra o dado velho reprova por construcao — e reprova
   certo, so que no momento errado.

   A ordem que faz sentido e:  forma → dados → travas.

   Por isso elas foram para `seed/07-cnae-travas.sql`, que roda DEPOIS do
   `npm run seed:cnae`. */

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

-- ════════════════════════════════════════════════════════════════════════════
--  5 · O QUE ESTE ARQUIVO CONFERE, E O QUE ELE NAO PODE CONFERIR
-- ════════════════════════════════════════════════════════════════════════════
--  🔑 Aqui so da para conferir a FORMA. O conteudo ainda e o antigo — a carga
--     vem depois. Portao sobre dado velho reprova por construcao, que foi
--     exatamente o erro da primeira versao.
DO $$
DECLARE v_total int; v_colunas int;
BEGIN
  SELECT count(*) INTO v_total FROM fatos.cnae;
  SELECT count(*) INTO v_colunas
    FROM information_schema.columns
   WHERE table_schema = 'fatos' AND table_name = 'cnae';

  IF v_total < 1300 THEN
    RAISE EXCEPTION 'so % linhas em fatos.cnae — a tabela ja estava incompleta', v_total;
  END IF;

  RAISE NOTICE 'forma migrada: % colunas · % linhas (conteudo ainda e o antigo)', v_colunas, v_total;
  RAISE NOTICE 'proximo passo: npm run seed:cnae, e SO DEPOIS 07-cnae-travas.sql';
END $$;

COMMIT;
