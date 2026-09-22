-- ============================================================================
--  07-parametro-fiscal.sql  ·  os números que a nota apaga e ninguém guardava
--
--  🔴 O buraco, medido em 22/09/2026 no pente fino do fatiador.
--
--  O `sanitizarNumeros` troca valor e percentual das notas por «valor em
--  fatos» / «percentual em fatos». A regra está certa: número dentro do texto
--  vetorizado faz o agente responder de memória em vez de consultar, e foi a
--  regressão de 19/09 (a nota de contrato aberta 1 vez em 632 chamadas).
--
--  Só que o ponteiro precisa apontar para algum lugar. Conferindo um a um:
--  teto, taxa da Junta, endereço fiscal, planos, multa, fidelidade e
--  arrependimento TÊM casa em `fatos`. Estes quatro NÃO tinham:
--
--    · o limiar do Fator R (28% da lei, 30% nossa margem)
--    · o piso do pró-labore (o salário mínimo da competência)
--    · o INSS do sócio (11%, teto do salário de contribuição)
--    · o custo de mercado do certificado digital
--
--  Resultado prático: perguntado sobre o Fator R, o agente lia «percentual em
--  fatos», não achava o fato, e — obedecendo a regra de não inventar — ficava
--  sem responder. O número foi apagado para não ser inventado e não foi
--  guardado para ser consultado.
--
--  Idempotente: roda de novo sem duplicar.
-- ============================================================================

CREATE TABLE IF NOT EXISTS fatos.parametro_fiscal (
  id             text PRIMARY KEY,
  nome           text    NOT NULL,
  texto          text    NOT NULL,   -- a regra em português, para o agente dizer
  valor_numerico numeric,            -- o número, quando existe um só
  unidade        text,               -- 'percentual' · 'centavos' · 'meses'
  vigencia       text,               -- quando o valor muda com o ano
  fonte          text    NOT NULL,
  atualizado_em  date    NOT NULL DEFAULT current_date
);

COMMENT ON TABLE fatos.parametro_fiscal IS
  'Os parametros da regra fiscal que as notas citam e a sanitizacao apaga. '
  'Existe porque apagar sem guardar deixa o agente mudo: ele nao pode inventar '
  'o numero e nao tinha onde consulta-lo. Fonte de cada linha: 06-CALCULO-FISCAL '
  'e 05-DICIONARIO-CNAE-TRIBUTARIO, validados com contador em 16/09/2026.';

INSERT INTO fatos.parametro_fiscal (id, nome, texto, valor_numerico, unidade, vigencia, fonte) VALUES
  ('fator-r-limiar-lei',
   'Limiar do Fator R (lei)',
   'Folha dos ultimos 12 meses dividida pelo faturamento dos ultimos 12 meses. '
   'Igual ou acima de 28%, a atividade e tributada pelo Anexo III; abaixo, pelo Anexo V. '
   '🔴 O limiar e seco: a lei nao da margem de seguranca. '
   '🔴 E retrovisor: le os 12 meses anteriores, entao pro-labore pago hoje so faz efeito nos '
   'meses seguintes. 🔴 E regime de caixa: so entra o que foi efetivamente PAGO. '
   '⚠️ So vale para atividade que o Fator R decide. Para Anexo III fixo, nao mencione.',
   28, 'percentual', 'LC 123/2006, vigente',
   '06-CALCULO-FISCAL §3'),

  ('fator-r-margem-legalizai',
   'Margem de trabalho da Legalizai no Fator R',
   'A Legalizai trabalha com 30%, e nao com os 28% cravados da lei. '
   '🔴 Os 30% sao recomendacao NOSSA, nao sao a lei: nunca apresente como exigencia legal. '
   'O sistema acompanha mes a mes e ajusta o pro-labore sozinho desde o primeiro mes, '
   'porque corrigir tarde nao conserta o passado.',
   30, 'percentual', 'decisao interna',
   '06-CALCULO-FISCAL §3'),

  ('pro-labore-piso',
   'Piso do pro-labore',
   'O pro-labore nao pode ser menor que o salario minimo DO MES DE COMPETENCIA. '
   'Em 2026 sao R$ 1.621,00; em 2025 eram R$ 1.518,00. '
   '⚠️ Quem apura competencia antiga usa o minimo daquele ano, nao o de hoje.',
   162100, 'centavos', '2026 (em 2025: 151800 centavos)',
   '06-CALCULO-FISCAL §4'),

  ('inss-socio',
   'INSS sobre o pro-labore',
   '11% sobre o pro-labore, limitado ao teto do salario de contribuicao, que e '
   'R$ 8.475,55 — o que da INSS maximo de R$ 932,31 por mes. '
   '🔴 O teto e da PESSOA, nao da empresa: quem ja tem carteira assinada em outra empresa '
   'consome parte dele, e o INSS do pro-labore cai. '
   '🔴 A guia e por socio: com 2 ou mais socios nunca se soma a folha como se fosse uma '
   'pessoa so, porque o teto e individual e a tabela do IR e progressiva por beneficiario.',
   11, 'percentual', '2026',
   '06-CALCULO-FISCAL §4'),

  ('inss-teto-contribuicao',
   'Teto do salario de contribuicao do INSS',
   'R$ 8.475,55 por mes. Acima disso o INSS nao incide, e o recolhimento maximo do socio '
   'fica em R$ 932,31 por mes.',
   847555, 'centavos', '2026',
   '06-CALCULO-FISCAL §4'),

  ('certificado-custo-mercado',
   'Custo de mercado do certificado digital',
   'Fora da Legalizai, certificadoras cobram em torno de R$ 209,00 por ano pelo e-CNPJ. '
   'No plano ME ele vem incluso, sem custo extra. '
   '🔴 No plano MEI o certificado NAO esta incluso, e o MEI nao precisa dele para emitir '
   'nota de servico. Nunca use o certificado para justificar a fidelidade de quem e MEI.',
   20900, 'centavos', 'referencia de mercado, 2026',
   '01-PLANOS-E-OFERTAS §2 · 07-OBRIGACOES-MENSAIS §2')
ON CONFLICT (id) DO UPDATE SET
  nome = excluded.nome, texto = excluded.texto,
  valor_numerico = excluded.valor_numerico, unidade = excluded.unidade,
  vigencia = excluded.vigencia, fonte = excluded.fonte,
  atualizado_em = current_date;
