-- ════════════════════════════════════════════════════════════════════════════
--  09-tools-chamadas.sql  ·  a medicao por CHAMADA em producao
--
--  🔴 MIGRACAO ADITIVA. Nao derruba nada e nao reescreve linha existente.
--     NAO use `run-sql.cjs` para aplicar: aquele script comeca com
--     `DROP SCHEMA ... conversa CASCADE` e existe para montar a base do zero.
--
--  Aplicar:
--    node --env-file=.env scripts/rodar-sql.mjs seed/09-tools-chamadas.sql
--
--  🔑 POR QUE ESTA COLUNA EXISTE.
--
--  Ate 22/09 `conversa.turno_interno` media tool por EFEITO: `cartoes_usados` e
--  `fatos_lidos`. Tool que roda e volta vazia emite lista vazia nos dois campos
--  e fica INDISTINGUIVEL de tool que nunca foi chamada. Quatro rodadas de E2E
--  leram "buscar_base: 0" dentro dessa ambiguidade e a conclusao tirada foi
--  "o modelo nao escolhe a ferramenta" — que a medicao nao autorizava.
--
--  O nome da chamada existe no `router.ts` (`r.chamadas[].nome`) desde sempre e
--  era descartado depois de executar. Esta coluna so para de jogar fora.
--
--  ⚠️ As linhas anteriores a 22/09/2026 ficam com NULL, e isso e de proposito:
--     NULL diz "gravado antes da instrumentacao", `{}` diz "nenhuma tool foi
--     chamada". Contar NULL como `{}` reproduz exatamente o erro que esta
--     coluna existe para corrigir. Toda consulta filtra `IS NOT NULL`.
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE conversa.turno_interno
  ADD COLUMN IF NOT EXISTS tools_chamadas text[];

COMMENT ON COLUMN conversa.turno_interno.tools_chamadas IS
  'Os NOMES das tools chamadas no turno, na ordem, com repeticao. Medicao por '
  'CHAMADA, nao por efeito: `{}` = nenhuma tool foi chamada; uma tool que '
  'rodou e voltou vazia aparece aqui e nao aparece em cartoes_usados nem em '
  'fatos_lidos. NULL = turno gravado antes da instrumentacao existir, e nao '
  '"nenhuma chamada".';
