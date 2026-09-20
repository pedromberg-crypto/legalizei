-- ============================================================================
--  seed/02-cnae.sql  ·  as 1.332 linhas da matriz CNAE
--
--  🔑 POR QUE STAGING, E NAO UM PARSER EM NODE.
--
--  As descricoes oficiais do CNAE tem virgula, aspas e quebra de linha DENTRO
--  do campo ("Esta classe compreende - o transporte..., sob o regime de..."),
--  e a matriz tem 40 colunas. Parser de CSV escrito a mao quebra nisso, e
--  quebra silenciosamente: a linha entra deslocada e o anexo de um CNAE vai
--  parar no campo do outro. Num dado que decide enquadramento, isso e o pior
--  tipo de bug, porque parece certo.
--
--  O parser de CSV do proprio Postgres nao quebra. Entao: COPY para uma tabela
--  de staging toda em `text`, e dali um INSERT SELECT com os casts explicitos.
--
--  Rodar com `psql -f`, nao por cliente que nao suporte `\copy`.
-- ============================================================================

BEGIN;

DROP TABLE IF EXISTS fatos._cnae_bruto;
CREATE TABLE fatos._cnae_bruto (
  cnae text, descricao text, secao_id text, secao text, divisao_id text,
  grupo_id text, grupo_descricao text, classe_id text, classe_observacoes text,
  subclasse_observacoes text, atividades text, anexo_base text, anexo_just text,
  fator_r text, aliquota_inicial text, contabilizei_atende text, contabilizei_just text,
  mei_permitido text, mei_ocupacoes text, mei_iss_fixo_das text, mei_icms_fixo_das text,
  risco_baixo_cgsim text, risco_cgsim_desc_oficial text, vedado_simples_cgsn_anexo_vi text,
  ambiguo_simples_cgsn_anexo_vii text, anexo_fator_r_grupo text, anexo_fator_r_fonte text,
  anexo_fator_r_confianca text, iss_bh_aliquota text, iss_bh_varia text, iss_bh_detalhe text,
  exige_conselho text, conselho_qual text, conselho_fonte text, conselho_confianca text,
  atende_me_certeza text, atende_mei_certeza text, exige_registro_setorial text,
  registro_setorial_qual text, registro_setorial_fonte text
);

DROP TABLE IF EXISTS fatos._cnae_amigavel;
CREATE TABLE fatos._cnae_amigavel (code text, friendly_title text, friendly_description text);

-- ⚠️ Ajustar o caminho para a raiz do repo na maquina que roda a carga.
--    A matriz e `cnae-matriz.csv`; a coluna `motor_apura` so existe no
--    `cnae-atendemos-certeza.csv`, que e um SUBCONJUNTO (87 linhas) e por isso
--    nao serve de fonte principal.
\copy fatos._cnae_bruto FROM 'pesquisa/cnae-matriz/cnae-matriz.csv' WITH (FORMAT csv, HEADER true)
\copy fatos._cnae_amigavel FROM 'pesquisa/cnae-matriz/cnae-friendly.csv' WITH (FORMAT csv, HEADER true)

-- `sim`/`nao` viram boolean aqui, uma vez so, em vez de virar `=== 'sim'`
-- espalhado por tres linguagens.
CREATE OR REPLACE FUNCTION fatos._sim(t text) RETURNS boolean
LANGUAGE sql IMMUTABLE AS $$ SELECT lower(coalesce(trim(t), '')) IN ('sim','s','true','1') $$;

INSERT INTO fatos.cnae (
  codigo, descricao, titulo_amigavel, descricao_amigavel, secao_id, divisao_id,
  anexo_base, anexo_fator_r_grupo, anexo_fator_r_fonte, anexo_fator_r_confianca,
  vedado_simples, ambiguo_simples, mei_permitido, mei_ocupacoes,
  iss_bh_aliquota, iss_bh_varia, risco_baixo_cgsim,
  exige_conselho, conselho_qual, exige_registro_setorial,
  atende_me_certeza, atende_mei_certeza
)
SELECT
  regexp_replace(b.cnae, '\D', '', 'g'),
  b.descricao,
  a.friendly_title,
  a.friendly_description,
  b.secao_id,
  lpad(b.divisao_id, 2, '0'),
  nullif(trim(b.anexo_base), ''),
  nullif(trim(b.anexo_fator_r_grupo), ''),
  nullif(trim(b.anexo_fator_r_fonte), ''),
  -- 🔴 O GATE. Ausente ou desconhecido vira `nao_verificado`, NUNCA `alta`.
  --    Default permissivo aqui autorizaria o agente a afirmar anexo com base
  --    em celula vazia, que e pior que nao ter o dado.
  (CASE lower(coalesce(trim(b.anexo_fator_r_confianca), ''))
     WHEN 'alta'  THEN 'alta'
     WHEN 'media' THEN 'media'
     WHEN 'baixa' THEN 'baixa'
     ELSE 'nao_verificado'
   END)::fatos.confianca,
  fatos._sim(b.vedado_simples_cgsn_anexo_vi),
  fatos._sim(b.ambiguo_simples_cgsn_anexo_vii),
  fatos._sim(b.mei_permitido),
  nullif(trim(b.mei_ocupacoes), ''),
  nullif(trim(b.iss_bh_aliquota), '')::numeric,
  fatos._sim(b.iss_bh_varia),
  CASE WHEN trim(coalesce(b.risco_baixo_cgsim,'')) = '' THEN NULL ELSE fatos._sim(b.risco_baixo_cgsim) END,
  fatos._sim(b.exige_conselho),
  nullif(trim(b.conselho_qual), ''),
  fatos._sim(b.exige_registro_setorial),
  fatos._sim(b.atende_me_certeza),
  fatos._sim(b.atende_mei_certeza)
FROM fatos._cnae_bruto b
LEFT JOIN fatos._cnae_amigavel a
  ON regexp_replace(a.code, '\D', '', 'g') = regexp_replace(b.cnae, '\D', '', 'g')
WHERE regexp_replace(b.cnae, '\D', '', 'g') <> ''
ON CONFLICT (codigo) DO UPDATE SET
  titulo_amigavel         = excluded.titulo_amigavel,
  descricao_amigavel      = excluded.descricao_amigavel,
  anexo_fator_r_confianca = excluded.anexo_fator_r_confianca,
  atende_me_certeza       = excluded.atende_me_certeza,
  atende_mei_certeza      = excluded.atende_mei_certeza,
  atualizado_em           = current_date;

-- ── OS PORTOES DA CARGA ─────────────────────────────────────────────────────
--  Cada um deles ja foi um erro real em algum lugar deste projeto.
DO $$
DECLARE total int; com_gate int; atendidos int;
BEGIN
  SELECT count(*) INTO total FROM fatos.cnae;
  SELECT count(*) INTO com_gate FROM fatos.cnae WHERE anexo_fator_r_confianca = 'alta';
  SELECT count(*) INTO atendidos FROM fatos.cnae WHERE atende_me_certeza;

  IF total < 1300 THEN
    RAISE EXCEPTION 'matriz carregou so % linhas, esperado ~1332: CSV truncado ou caminho errado', total;
  END IF;

  -- ⚠️ Nao e assert de valor exato, e cerca de ordem de grandeza. O numero de
  --    codigos com confianca alta MUDA quando a contadora fecha os 54 em
  --    conflito. O que nao pode mudar sozinho e a ordem de grandeza: se todos
  --    virarem `alta`, o gate deixou de existir e o agente passa a afirmar
  --    anexo de qualquer codigo.
  IF com_gate = 0 OR com_gate > total / 2 THEN
    RAISE EXCEPTION 'gate de confianca suspeito: % de % codigos com confianca alta', com_gate, total;
  END IF;

  RAISE NOTICE 'CNAE carregado: % linhas, % com confianca alta, % atendidos no ME',
    total, com_gate, atendidos;
END $$;

DROP TABLE fatos._cnae_bruto;
DROP TABLE fatos._cnae_amigavel;

COMMIT;
