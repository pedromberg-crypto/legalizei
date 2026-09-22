-- ============================================================================
--  seed/04-links.sql  ·  os tres links oficiais viram FATO
--
--  🔴 LINK E FATO DURO, E FATO DURO NAO SE RECUPERA POR SEMANTICA.
--
--  A regra esta escrita no topo do `schema.sql` desde o primeiro dia e eu nao a
--  apliquei aos links: eles moravam so dentro do texto das notas, recuperados
--  por embedding. O resultado apareceu na rodada de E2E de 20/09, e e exatamente
--  o que a regra existe para impedir.
--
--  O agente escreveu:  https://www.instagram.com/legalizai
--  O endereco real e:  https://www.instagram.com/legalizai.app/
--
--  Ele nao inventou do nada: leu o trecho da nota e REESCREVEU de cabeca, que e
--  o que um modelo faz com texto corrido. String exata nao admite parafrase, e
--  meio link e pior que link nenhum, porque a pessoa clica e cai em lugar
--  errado, ou em lugar nenhum.
--
--  ⚠️ O `.app` no fim do handle e justamente a parte que some, porque parece
--  extensao de arquivo. Foi o mesmo pedaco que ja derrubou o filtro de saida do
--  runtime antigo.
--
--  Fonte dos tres valores: `01-PLANOS-E-OFERTAS.md` §5, de 2026-09-17.
-- ============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS fatos.link (
  id            text PRIMARY KEY,
  nome          text NOT NULL,
  url           text NOT NULL,
  quando_usar   text NOT NULL,
  fonte         text NOT NULL,
  atualizado_em date NOT NULL DEFAULT current_date,

  -- URL se copia inteira ou nao se copia. Sem esquema, o agente monta
  -- "legalizai.com.br" e o filtro de saida do WhatsApp derruba como dominio solto.
  CONSTRAINT link_tem_esquema CHECK (url ~ '^https://')
);

COMMENT ON TABLE fatos.link IS
  '🔴 Os UNICOS tres enderecos que o agente pode escrever. Qualquer outro e '
  'invencao, inclusive link de download: o app esta em pre-lancamento e nao tem '
  'pagina em loja nenhuma.';

COMMENT ON COLUMN fatos.link.url IS
  'Copiar caractere por caractere. Nao encurtar, nao tirar o https, nao trocar '
  'por arroba, nao "limpar" o final.';

INSERT INTO fatos.link (id, nome, url, quando_usar, fonte) VALUES
  -- 🆕 22/09/2026: o e-mail passa a existir como canal. Ate aqui a regra era
  --    "e-mail e telefone nao estao na base: nao invente", e agora ha o que
  --    informar. Telefone continua FORA de proposito: o WhatsApp da Legalizai e
  --    a propria conversa, e mandar o numero para quem ja esta nele e ruido.
  ('email-contato', 'E-mail de contato',
   'contato@legalizai.com.br',
   'Quem prefere escrever fora do WhatsApp, ou pede um contato formal. Nao substitui o '
   'atendimento por aqui: e canal alternativo, nao fila de suporte.',
   '01-PLANOS-E-OFERTAS §5'),
  ('lista-espera', 'Lista de espera',
   'https://www.legalizai.com.br/em-breve',
   'Quem quer garantir o preco promocional. Nao cobra nada na entrada e nao compromete '
   'com contratacao: serve para ser avisado quando abrir.',
   '01-PLANOS-E-OFERTAS §5'),
  ('site', 'Site da Legalizai',
   'https://www.legalizai.com.br',
   'No gate de saida, para quem a casa ainda nao atende acompanhar os lancamentos.',
   '01-PLANOS-E-OFERTAS §5'),
  ('instagram', 'Instagram',
   'https://www.instagram.com/legalizai.app/',
   'Canal de atualizacao de quem quer acompanhar de perto. Vai junto com o site no gate '
   'de saida. ⚠️ SEMPRE como URL completa, nunca como arroba solta: escrito como handle, '
   'o filtro de saida bloqueia antes de chegar no cliente, porque o final parece dominio.',
   '01-PLANOS-E-OFERTAS §5')
ON CONFLICT (id) DO UPDATE SET
  url = excluded.url,
  quando_usar = excluded.quando_usar,
  atualizado_em = current_date;

COMMIT;

SELECT id, url FROM fatos.link ORDER BY id;
