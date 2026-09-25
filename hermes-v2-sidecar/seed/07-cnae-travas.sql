-- ============================================================================
--  seed/07-cnae-travas.sql  ·  as travas do CNAE, DEPOIS da carga
--
--  🔴 POR QUE ESTE ARQUIVO EXISTE SEPARADO — e a resposta e um erro medido.
--
--  Estas travas moravam dentro do `06-cnae-18-colunas.sql`, antes da carga. Na
--  primeira rodada na VPS, em 24/09, a migration abortou:
--
--      check constraint "cnae_anexo_valido" of relation "cnae"
--      is violated by some row
--
--  E a trava estava CERTA. Ela so estava no lugar errado da fila: trava guarda
--  o dado NOVO, e antes da carga o banco ainda tem o VELHO — com os 7
--  `requer-revisao` que morreram naquele mesmo dia, e com `III-fixo` gravado
--  onde hoje se escreve `III`.
--
--  🔑 A ordem que faz sentido:  FORMA → DADOS → TRAVAS.
--
--      1. npm run sql seed/06-cnae-18-colunas.sql
--      2. npm run seed:cnae
--      3. este arquivo
--
--  ⚠️ Rodar este arquivo antes da carga reprova por construcao. Se acontecer,
--     nao e defeito das travas: e a fila fora de ordem.
-- ============================================================================

BEGIN;

-- ════════════════════════════════════════════════════════════════════════════
--  1 · CAMPO DEPENDENTE DECLARA QUE DEPENDE — nunca fica vazio
-- ════════════════════════════════════════════════════════════════════════════
--  🔴 Vazio significava QUATRO coisas diferentes na tabela antiga: nao se
--     aplica · nao verificado · existe na fonte e nunca importado · coluna
--     morta. E o agente lia ausencia como NEGACAO — foi assim que ele mandou
--     cliente de folha de pagamento procurar outro contador.
ALTER TABLE fatos.cnae
  ALTER COLUMN titulo_oficial     SET NOT NULL,
  ALTER COLUMN titulo_amigavel    SET NOT NULL,
  ALTER COLUMN descricao_oficial  SET NOT NULL,
  ALTER COLUMN descricao_amigavel SET NOT NULL,
  ALTER COLUMN termos_de_busca    SET NOT NULL,
  ALTER COLUMN familia            SET NOT NULL,
  ALTER COLUMN anexo              SET NOT NULL,
  ALTER COLUMN anexo_inciso       SET NOT NULL,
  ALTER COLUMN mei_ocupacoes      SET NOT NULL,
  ALTER COLUMN conselho_qual      SET NOT NULL,
  ALTER COLUMN motivo_nao_atende  SET NOT NULL;

-- ════════════════════════════════════════════════════════════════════════════
--  2 · O VOCABULARIO FECHADO DO ANEXO
-- ════════════════════════════════════════════════════════════════════════════
--  🔴 `requer-revisao` NAO esta na lista, e e o ponto do dia inteiro: a
--     categoria deixou de existir. Ela nascia de tratar "nao achei inciso"
--     como estado terminal, quando a LC 123 tem dois residuais que se
--     completam. Se voltar, o banco recusa — e recusar aqui e barato.
ALTER TABLE fatos.cnae DROP CONSTRAINT IF EXISTS cnae_anexo_valido;
ALTER TABLE fatos.cnae ADD CONSTRAINT cnae_anexo_valido
  CHECK (anexo IN ('III', 'IV', 'III-ou-V', 'nao-se-aplica'));

--  🔴 Um CNAE que a casa ATENDE e nao tem anexo e o `requer-revisao` voltando
--     com outro nome. Eram 7 dos 87, e o apurador se recusava a calcular o DAS
--     deles — incluindo design de UI/UX, que o §5º-I VI nomeia em letra.
ALTER TABLE fatos.cnae DROP CONSTRAINT IF EXISTS cnae_atendido_tem_anexo;
ALTER TABLE fatos.cnae ADD CONSTRAINT cnae_atendido_tem_anexo
  CHECK (NOT atende_me OR anexo <> 'nao-se-aplica');

--  🔴 Sem motivo, o agente diz "nao atendemos" e IMPROVISA o porque. O motivo
--     e a resposta, nao enfeite.
ALTER TABLE fatos.cnae DROP CONSTRAINT IF EXISTS cnae_tem_motivo;
ALTER TABLE fatos.cnae ADD CONSTRAINT cnae_tem_motivo
  CHECK (btrim(motivo_nao_atende) <> '');

-- ════════════════════════════════════════════════════════════════════════════
--  3 · OS PORTOES — agora sobre o dado JA CARREGADO
-- ════════════════════════════════════════════════════════════════════════════
DO $$
DECLARE
  v_total int; v_me int; v_sem_anexo int; v_revisao int; v_sinonimos int; v_orfaos int;
BEGIN
  SELECT count(*), count(*) FILTER (WHERE atende_me),
         count(*) FILTER (WHERE atende_me AND anexo = 'nao-se-aplica'),
         count(*) FILTER (WHERE anexo = 'requer-revisao')
    INTO v_total, v_me, v_sem_anexo, v_revisao
    FROM fatos.cnae;

  SELECT count(*) INTO v_sinonimos FROM fatos.cnae_sinonimos;
  SELECT count(*) INTO v_orfaos
    FROM fatos.cnae_sinonimos s
   WHERE NOT EXISTS (SELECT 1 FROM fatos.cnae c WHERE c.codigo = s.cnae_codigo);

  IF v_total < 1300 THEN
    RAISE EXCEPTION 'so % linhas em fatos.cnae — a carga nao rodou ou veio truncada', v_total;
  END IF;
  IF v_me < 50 THEN
    RAISE EXCEPTION 'so % CNAEs atendidos — a carga trouxe o veredito errado', v_me;
  END IF;
  IF v_sem_anexo > 0 THEN
    RAISE EXCEPTION '% CNAE(s) atendidos sem anexo definido', v_sem_anexo;
  END IF;
  IF v_revisao > 0 THEN
    RAISE EXCEPTION 'a categoria requer-revisao voltou em % linha(s)', v_revisao;
  END IF;
  IF v_orfaos > 0 THEN
    RAISE EXCEPTION '% sinonimo(s) apontam para CNAE que nao existe', v_orfaos;
  END IF;

  RAISE NOTICE 'fatos.cnae: % linhas · % atendidos no ME · % sinonimos · 0 sem anexo',
    v_total, v_me, v_sinonimos;
END $$;

COMMIT;
