-- ════════════════════════════════════════════════════════════════════════════
--  11-lastro.sql  ·  o lastro automatico em producao
--
--  🔴 MIGRACAO ADITIVA. Nao derruba nada e nao reescreve linha existente.
--     NAO use `run-sql.cjs`: aquele script comeca com `DROP SCHEMA ... conversa
--     CASCADE` e existe para montar a base do zero.
--
--  Aplicar:
--    node --env-file=.env scripts/rodar-sql.mjs seed/11-lastro.sql
--
--  🔑 POR QUE UMA COLUNA SEPARADA DE `fatos_lidos`.
--
--  `fatos_lidos` e `tecnica_ok` significam "uma tool sustentou a resposta
--  porque o MODELO a escolheu". O lastro automatico e o oposto: o sistema
--  entregou a base sem perguntar. Somar os dois deixaria `tecnica_ok`
--  verdadeiro em todo turno, inclusive numa saudacao, e a constraint
--  `comercial_exige_tecnica_ok` pararia de barrar o que existe para barrar.
--
--  A separacao tambem e o que permite responder, daqui a alguns dias, a unica
--  pergunta que importa: o modelo passou a ESCOLHER a ferramenta, ou so esta
--  sendo carregado pelo lastro? `tools_chamadas` responde a primeira,
--  `lastro_ids` a segunda.
--
--  ⚠️ NULL = turno gravado antes do lastro existir. `{}` = o lastro rodou e nao
--     trouxe trecho nenhum, que e buraco de conteudo e nao ausencia de medicao.
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE conversa.turno_interno
  ADD COLUMN IF NOT EXISTS lastro_ids text[];

COMMENT ON COLUMN conversa.turno_interno.lastro_ids IS
  'Os ids dos trechos de `conhecimento.nota` que o LASTRO AUTOMATICO entregou '
  'ao modelo junto da pergunta, antes de qualquer decisao dele. NAO e escolha '
  'do modelo: para isso existe tools_chamadas. NULL = turno anterior ao lastro; '
  '{} = o lastro rodou e a base nao tinha o que devolver.';
