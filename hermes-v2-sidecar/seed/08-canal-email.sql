-- ============================================================================
--  08-canal-email.sql  ·  o e-mail entra como CANAL, não como URL
--
--  🔴 O que aconteceu em 22/09: a linha do e-mail foi recusada pela constraint
--  `link_tem_esquema CHECK (url ~ '^https://')`, e a carga deu rollback inteiro.
--  A constraint agiu certo — ela existe para impedir o agente de escrever
--  "legalizai.com.br" solto, que o filtro de saída do WhatsApp derruba como
--  domínio sem esquema.
--
--  Duas saídas foram consideradas e recusadas:
--
--    · `mailto:contato@legalizai.com.br` + afrouxar o CHECK. Recusada porque a
--      regra de ouro da tabela é "copie a URL caractere por caractere", e aí o
--      agente colaria `mailto:` dentro da mensagem de WhatsApp.
--    · deixar o e-mail fora da tabela. Recusada porque canal é FATO: fora daqui
--      ele volta a ser texto que o agente escreve de cabeça, que é exatamente o
--      defeito que esta tabela nasceu para impedir.
--
--  🔑 A saída: e-mail não é URL, é outro TIPO de endereço. A coluna `tipo`
--  separa os dois, e cada um é validado pela regra que faz sentido para ele.
--  A regra do `https://` continua tão dura quanto era para link.
--
--  Idempotente: roda de novo sem duplicar.
-- ============================================================================

BEGIN;

ALTER TABLE fatos.link
  ADD COLUMN IF NOT EXISTS tipo text NOT NULL DEFAULT 'url';

COMMENT ON COLUMN fatos.link.tipo IS
  '`url` ou `email`. Decide qual validacao a linha recebe, e como o agente '
  'escreve: URL vai inteira com https, e-mail vai como endereco puro, sem '
  'mailto e sem markdown.';

ALTER TABLE fatos.link DROP CONSTRAINT IF EXISTS link_tem_esquema;
ALTER TABLE fatos.link DROP CONSTRAINT IF EXISTS link_endereco_valido;

ALTER TABLE fatos.link ADD CONSTRAINT link_endereco_valido CHECK (
  (tipo = 'url'   AND url ~ '^https://') OR
  (tipo = 'email' AND url ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')
);

COMMENT ON TABLE fatos.link IS
  '🔴 Os UNICOS QUATRO enderecos que o agente pode escrever: tres links e um '
  'e-mail. Qualquer outro e invencao, inclusive link de download (o app esta em '
  'pre-lancamento e nao tem pagina em loja nenhuma) e inclusive telefone — o '
  'WhatsApp da Legalizai e a propria conversa, entao mandar o numero para quem '
  'ja esta nela e ruido.';

INSERT INTO fatos.link (id, nome, url, tipo, quando_usar, fonte) VALUES
  ('email-contato', 'E-mail de contato',
   'contato@legalizai.com.br', 'email',
   'Quem prefere escrever fora do WhatsApp, ou pede um contato formal. Nao substitui o '
   'atendimento por aqui: e canal alternativo, nao fila de suporte. Escreva o endereco '
   'puro, sem mailto e sem markdown.',
   '01-PLANOS-E-OFERTAS §6')
ON CONFLICT (id) DO UPDATE SET
  nome = excluded.nome, url = excluded.url, tipo = excluded.tipo,
  quando_usar = excluded.quando_usar, fonte = excluded.fonte,
  atualizado_em = current_date;

COMMIT;
