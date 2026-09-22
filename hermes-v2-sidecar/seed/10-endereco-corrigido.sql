-- ════════════════════════════════════════════════════════════════════════════
--  10-endereco-corrigido.sql  ·  a telemetria do filtro de enderecos
--
--  🔴 MIGRACAO ADITIVA. Nao derruba nada e nao reescreve linha existente.
--     NAO use `run-sql.cjs` para aplicar: aquele script comeca com
--     `DROP SCHEMA ... conversa CASCADE` e existe para montar a base do zero.
--
--  Aplicar:
--    node --env-file=.env scripts/rodar-sql.mjs seed/10-endereco-corrigido.sql
--
--  🔑 POR QUE UMA TABELA, E NAO UMA COLUNA EM `turno_interno`.
--
--  O turno interno e gravado DENTRO do `responder()`, e o filtro roda DEPOIS,
--  no `server.ts`, na hora de enviar. Uma coluna exigiria ou voltar para dar
--  UPDATE no turno recem-gravado, ou mover o filtro para dentro do roteador —
--  e mover mudaria o texto que vai para `conversa.mensagem`, que e decisao de
--  produto, nao de instrumentacao.
--
--  Uma linha por CORRECAO, e nao por turno, porque um turno pode escrever dois
--  enderecos errados de uma vez, e foi exatamente o que aconteceu em
--  `venda-escada`: link da lista inventado e Instagram correto na mesma frase.
--
--  ⚠️ `mensagem_id` referencia a fala do Leo que continha o endereco. Pode ser
--     NULL se a mensagem nao tiver sido localizada — a telemetria nunca derruba
--     o envio, pelo mesmo motivo que o cache nao derruba a rodada.
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS conversa.endereco_corrigido (
  id          bigserial PRIMARY KEY,
  sessao_id   text NOT NULL,
  mensagem_id bigint,
  acao        text NOT NULL,
  antes       text NOT NULL,
  depois      text,
  link        text,
  criado_em   timestamptz NOT NULL DEFAULT now(),

  -- Troca sempre tem destino; remocao nunca tem. Se o Node deixar passar, o
  -- INSERT estoura — a mesma redundancia deliberada de `falha_coerente`.
  CONSTRAINT acao_conhecida CHECK (acao IN ('troca', 'remocao_url', 'remocao_frase')),
  CONSTRAINT troca_tem_destino CHECK (
    (acao =  'troca' AND depois IS NOT NULL) OR
    (acao <> 'troca' AND depois IS NULL)
  )
);

CREATE INDEX IF NOT EXISTS endereco_corrigido_sessao
  ON conversa.endereco_corrigido (sessao_id, criado_em DESC);

COMMENT ON TABLE conversa.endereco_corrigido IS
  '🔴 Uma linha por endereco que o filtro de saida trocou ou removeu. Cada '
  'linha e uma alucinacao de endereco que NAO chegou ao cliente. Tabela vazia '
  'com trafego significa que o agente parou de inventar endereco; tabela '
  'crescendo significa que a descricao da tool continua sem segurar e o filtro '
  'esta carregando sozinho.';

COMMENT ON COLUMN conversa.endereco_corrigido.antes IS
  'O endereco exatamente como o modelo escreveu. E o dado que diz QUAL erro ele '
  'comete: dominio inventado, www ausente, caminho de pagina montado de cabeca.';

COMMENT ON COLUMN conversa.endereco_corrigido.acao IS
  'troca = host OU caminho reconhecido em `fatos.link`, virou a forma canonica. '
  'remocao_frase = nada reconhecido, e a frase inteira saiu. '
  'remocao_url = nada reconhecido, mas a frase carregava outro endereco VALIDO, '
  'entao so o endereco ruim saiu para nao levar junto um link certo.';
