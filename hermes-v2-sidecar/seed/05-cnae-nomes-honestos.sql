-- ============================================================================
--  seed/05-cnae-nomes-honestos.sql
--
--  🔴 UM NOME DE CAMPO AMBIGUO FEZ O AGENTE AFIRMAR REGRA JURIDICA FALSA.
--
--  A `fatos.consultar_cnae` devolvia uma coluna chamada `atende_mei`, que vinha
--  de `atende_mei_certeza`. Os dois nomes dizem coisas diferentes:
--
--    atende_mei_certeza = A CASA tem certeza de que atende esta atividade no MEI
--    mei_permitido      = a LEI permite esta atividade no MEI
--
--  Chamada de `atende_mei`, a primeira se le como a segunda. Medido no E2E de
--  20/09, caso `mei-especulacao-nova-profissao`:
--
--    a tool devolveu   atende_mei: false
--    a matriz dizia    mei_permitido: true
--    o agente escreveu "O adestramento de caes NAO esta na lista oficial de
--                       atividades permitidas para MEI"
--
--  Ele nao alucinou: leu o campo e concluiu o que o nome sugeria. E a frase e
--  falsa, dita a um cliente, sobre a lei.
--
--  ⚠️ E tem uma camada a mais, que e a razao de este arquivo nao simplesmente
--  expor `mei_permitido`: o vault trava que a elegibilidade ao MEI **nao se
--  responde daqui**. A lista de ocupacoes e do governo, e fechada, e nao esta
--  neste banco. Nem `false` nem `true` autorizam o agente a afirmar.
--
--  Entao a funcao passa a devolver nomes que so podem ser lidos de um jeito,
--  e um campo que diz em voz alta que a pergunta da lei nao se responde aqui.
-- ============================================================================

BEGIN;

DROP FUNCTION IF EXISTS fatos.consultar_cnae(text);

CREATE FUNCTION fatos.consultar_cnae(p_busca text)
RETURNS TABLE (
  codigo                 char(7),
  titulo                 text,
  -- "a CASA atende", nunca "a lei permite". O prefixo existe para que nenhuma
  -- leitura apressada transforme escopo comercial em regra juridica.
  casa_atende_me         boolean,
  casa_atende_mei        boolean,
  anexo                  text,
  pode_afirmar_anexo     boolean,
  -- 🔴 Sempre false. Nao e coluna de dado, e um aviso que viaja junto da linha:
  --    a lista de ocupacoes do MEI e do governo e nao esta neste banco.
  pode_afirmar_lista_mei boolean,
  exige_conselho         boolean,
  semelhanca             real
)
LANGUAGE sql STABLE AS $$
  SELECT c.codigo,
         coalesce(c.titulo_amigavel, c.descricao),
         c.atende_me_certeza,
         c.atende_mei_certeza,
         c.anexo_fator_r_grupo,
         (c.anexo_fator_r_confianca = 'alta'),
         false,
         c.exige_conselho,
         greatest(
           similarity(coalesce(c.titulo_amigavel, ''), p_busca),
           similarity(c.descricao, p_busca)
         )
  FROM fatos.cnae c
  WHERE p_busca <% coalesce(c.titulo_amigavel, c.descricao)
     OR c.codigo = regexp_replace(p_busca, '\D', '', 'g')
  ORDER BY 9 DESC
  LIMIT 5;
$$;

COMMENT ON FUNCTION fatos.consultar_cnae IS
  '🔴 `casa_atende_mei = false` significa QUE A CASA NAO CONFIRMOU, e nunca que a '
  'atividade e proibida no MEI. A diferenca nao e sutil: uma e escopo comercial '
  'nosso, a outra e regra federal. `pode_afirmar_lista_mei` vem sempre false '
  'porque a lista de ocupacoes e do governo, fechada, e nao esta neste banco. '
  'Quando a pergunta for elegibilidade, oriente por FATURAMENTO, que e verificavel, '
  'e diga que a ocupacao exata se confirma no app.';

COMMIT;

SELECT codigo, titulo, casa_atende_mei, pode_afirmar_lista_mei
  FROM fatos.consultar_cnae('adestramento de caes');
