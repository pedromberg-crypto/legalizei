-- ════════════════════════════════════════════════════════════════════════════
--  06-tokens-cache.sql  ·  a medicao de cache em producao
--
--  🔴 MIGRACAO ADITIVA. Nao derruba nada e nao reescreve linha existente.
--     NAO use `run-sql.cjs` para aplicar: aquele script comeca com
--     `DROP SCHEMA ... conversa CASCADE` e existe para montar a base do zero.
--
--  Aplicar:
--    node --env-file=.env -e "..."  (ver reports/evolucao-2026-09-21-whatsapp-manual.md)
--    ou psql "$DATABASE_URL" -f seed/06-tokens-cache.sql
--
--  ⚠️ As linhas anteriores a 21/09/2026 ficam com NULL, e isso e de proposito:
--     NULL diz "nao foi medido", zero diria "nao houve cache". Media sobre
--     zeros falsos derruba a taxa e esconde a economia real.
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE conversa.turno_interno
  ADD COLUMN IF NOT EXISTS tokens_cache integer;

COMMENT ON COLUMN conversa.turno_interno.tokens_cache IS
  'Quantos dos tokens_entrada vieram de cache. SUBCONJUNTO de tokens_entrada, '
  'nunca parcela a somar. NULL = turno gravado antes da metrica existir.';
