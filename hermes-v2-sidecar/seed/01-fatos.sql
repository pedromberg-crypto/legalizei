-- ============================================================================
--  seed/01-fatos.sql  ·  o combustivel relacional
--
--  🔴 TODO VALOR AQUI FOI COPIADO DE UM ARQUIVO DO `_origem/`, NAO INVENTADO.
--  Cada bloco declara o arquivo e a secao de onde saiu, na coluna `fonte`.
--  Valor sem fonte nao entra: e a regra anti-guru do vault, aplicada a carga.
--
--  Fontes usadas, todas em `_origem/vault-v12/skills-legalizai/base-legalizai/references/`:
--    01-PLANOS-E-OFERTAS.md              precos, promocao, validade, links
--    03-REGRAS-DOS-ORGAOS.md  §1 §2      endereco fiscal, taxa da Junta
--    09-ESCOPO-E-LIMITES.md              escopo, tetos, CEP, socios
--    10-CONTRATO-GARANTIA-CANCELAMENTO   sete dias, fidelidade, multa
--  E, para as tabelas do Simples:
--    produto/me/viver/motor/regra/_tabelas.mjs   (LC 123/2006, Anexos III e V)
--
--  Idempotente: roda de novo sem duplicar.
-- ============================================================================

BEGIN;

-- ── ESCOPO ──────────────────────────────────────────────────────────────────
INSERT INTO fatos.escopo_regra (id, dentro, dimensao, valor, motivo, saida_sugerida, fonte) VALUES
  ('geo-bh', true, 'geografia', 'Belo Horizonte, CEP 30000-000 a 31999-999',
   'O processo e calibrado para a Prefeitura de BH e para o ISS de BH.',
   NULL, '09-ESCOPO-E-LIMITES §1'),
  ('geo-rmbh', false, 'geografia', 'regiao metropolitana (Contagem, Betim, Nova Lima, Santa Luzia e vizinhas)',
   'A Junta e a mesma, mas a Prefeitura e o ISS sao outros.',
   'endereco fiscal da Legalizai, so no plano ME', '09-ESCOPO-E-LIMITES §1'),
  ('dono-mora-fora', true, 'geografia', 'dono domiciliado em qualquer cidade',
   'O que vale e o endereco da EMPRESA, nao onde o dono mora.',
   NULL, '09-ESCOPO-E-LIMITES §1'),
  ('atividade-servico', true, 'atividade', 'servico',
   'Escopo de hoje.', NULL, '09-ESCOPO-E-LIMITES §2'),
  ('atividade-comercio', false, 'atividade', 'comercio, e-commerce, revenda',
   'Regra de imposto diferente, que o processo ainda nao cobre. Nem como atividade secundaria.',
   'gate de saida, com site e Instagram', '09-ESCOPO-E-LIMITES §2'),
  ('atividade-industria', false, 'atividade', 'industria',
   'Fora do escopo do produto.', 'gate de saida', '09-ESCOPO-E-LIMITES §2'),
  ('regime-mei', true, 'regime', 'MEI', 'Atendido, com motor proprio.', NULL, '09-ESCOPO-E-LIMITES §2'),
  ('regime-me', true, 'regime', 'ME no Simples Nacional, Anexos III e V',
   'Escopo travado.', NULL, '09-ESCOPO-E-LIMITES §2'),
  ('anexo-iv', false, 'regime', 'Anexo IV (construcao civil, limpeza, vigilancia, advocacia)',
   'Fora, apesar de ser servico e de ser Simples.', 'gate de saida', '09-ESCOPO-E-LIMITES §2'),
  ('regime-epp', false, 'regime', 'EPP',
   'Nao e fase, e escopo do produto hoje. So existe como porta de SAIDA, no desenquadramento.',
   'gate de saida', '09-ESCOPO-E-LIMITES §2'),
  ('regime-lucro', false, 'regime', 'Lucro Presumido e Lucro Real',
   'Fora do escopo.', 'gate de saida', '09-ESCOPO-E-LIMITES §2'),
  ('socios-1-4', true, 'societario', 'de 1 a 4 socios, pessoa fisica, domiciliados no Brasil',
   'Escopo travado em 13/09.', NULL, '09-ESCOPO-E-LIMITES §2'),
  ('socios-5-mais', false, 'societario', '5 ou mais socios, socio pessoa juridica, socio no exterior',
   'Fora do escopo.', 'gate de saida', '09-ESCOPO-E-LIMITES §2'),
  ('socio-beneficio', false, 'societario', 'beneficio para socio (plano de saude, vale)',
   'Nao faz parte do produto hoje. 🔑 E legal no nosso regime e mesmo assim nao existe aqui: '
   'e o filtro que a trava de escopo nao pega.',
   NULL, '09-ESCOPO-E-LIMITES §2'),
  ('folha-colaborador', true, 'servico', 'folha de pagamento de colaborador',
   'Admissao, holerite, ferias, rescisao, guias trabalhistas e eSocial sao do nosso time. '
   '🔴 Sem esta linha o agente lia a tabela, nao achava folha, e concluia FORA por analogia '
   'com o beneficio do socio logo acima. Corrigir o cartao nao resolvia: consultar_escopo e '
   'a tool mais chamada e buscar_cartao ficou em zero chamadas em 28 turnos.',
   NULL, '09-ESCOPO-E-LIMITES §2'),
  ('situacao-abertura', true, 'situacao', 'empresa nascendo (abertura)', 'Escopo.', NULL, '09-ESCOPO-E-LIMITES §2'),
  ('situacao-migracao', true, 'situacao', 'migracao de quem ja tem CNPJ', 'Escopo.', NULL, '09-ESCOPO-E-LIMITES §2'),
  ('situacao-regularizacao', false, 'situacao', 'empresa abandonada, baixa de CNPJ, divida antiga, passivo',
   '🔴 Nem com o time humano. O atendente entra para dizer o que da para fazer, nao para executar. '
   'Resolvido por fora, a pessoa volta e a casa abre a empresa nova normalmente.',
   'dizer o que da para fazer, sem prometer resolver', '09-ESCOPO-E-LIMITES §2')
ON CONFLICT (id) DO NOTHING;

-- ── TETOS ───────────────────────────────────────────────────────────────────
INSERT INTO fatos.teto (id, nome, valor_centavos, periodicidade, acima_disso, atendemos_acima, fonte) VALUES
  -- R$ 81.000,00 = 8.100.000 centavos. R$ 360.000,00 = 36.000.000 centavos.
  ('teto-mei', 'Teto do MEI', 8100000, 'ano',
   'vira ME, que a gente atende', true, '09-ESCOPO-E-LIMITES §3'),
  ('teto-me', 'Teto do ME que a gente atende', 36000000, 'ano',
   'vira EPP, que vai ate R$ 4,8 milhoes por ano, e EPP a gente nao atende', false, '09-ESCOPO-E-LIMITES §3')
ON CONFLICT (id) DO NOTHING;

-- ── PLANOS ──────────────────────────────────────────────────────────────────
--  🔴 Os valores antigos de promocao (R$ 19 no MEI, R$ 79 no ME) EXPIRARAM e
--     nao entram nesta carga. Se o cliente citar um deles, a regra e dizer que
--     a condicao mudou e passar o valor atual.
INSERT INTO fatos.plano (id, nome, regime, valor_centavos, promocional, vigencia_ate, inclui, nao_inclui, fonte) VALUES
  ('mei-cheio', 'Plano MEI', 'mei', 4900, false, NULL,
   ARRAY['abertura sem honorario', 'manutencao mensal', 'emissao de guias', 'assistente virtual de contabilidade'],
   ARRAY['contador humano dedicado', 'certificado digital'],
   '01-PLANOS-E-OFERTAS §1'),
  ('mei-promo', 'Plano MEI, 3 primeiros meses', 'mei', 2900, true, DATE '2026-12-31',
   ARRAY['abertura sem honorario', 'manutencao mensal', 'emissao de guias', 'assistente virtual de contabilidade'],
   ARRAY['contador humano dedicado', 'certificado digital'],
   '01-PLANOS-E-OFERTAS §1 e §5'),
  ('me-cheio', 'Plano ME', 'me_simples', 13900, false, NULL,
   ARRAY['contador humano com registro no CRC', 'app com acompanhamento',
         'certificado digital e-CNPJ incluso', 'abertura sem honorario'],
   ARRAY[]::text[],
   '01-PLANOS-E-OFERTAS §2'),
  ('me-promo', 'Plano ME, 3 primeiros meses', 'me_simples', 9900, true, DATE '2026-12-31',
   ARRAY['contador humano com registro no CRC', 'app com acompanhamento',
         'certificado digital e-CNPJ incluso', 'abertura sem honorario'],
   ARRAY[]::text[],
   '01-PLANOS-E-OFERTAS §2 e §5')
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE fatos.plano IS
  'Promocao vale ate 31/12/2026 e quem garante e quem entra na lista de espera. '
  'A data e real e pode ser usada como gatilho, porque e verdade. Continua '
  'proibido inventar escassez ("so hoje", "ultimas vagas").';

-- ── ADD-ON ──────────────────────────────────────────────────────────────────
INSERT INTO fatos.addon (id, nome, valor_centavos, recorrente, regime_aplicavel, para_quem, alerta, fonte) VALUES
  ('endereco-fiscal', 'Endereco fiscal da Legalizai', 4900, true, ARRAY['me_simples']::fatos.regime[],
   'quem nao tem endereco em BH, quem so tem residencial que nao pode receber a empresa, '
   'e quem mora em apartamento sem poder cumprir a regra da Prefeitura',
   '🔴 O valor coincide com a mensalidade do plano MEI. Se o cliente falar o numero sem dizer '
   'do que, PERGUNTE antes de confirmar. E o preco vai na mesma mensagem da oferta.',
   '03-REGRAS-DOS-ORGAOS §1')
ON CONFLICT (id) DO NOTHING;

-- ── TAXA PUBLICA ────────────────────────────────────────────────────────────
INSERT INTO fatos.taxa_publica (id, nome, orgao, valor_centavos, regime_aplicavel, reembolsavel, quando_cobrada, fonte) VALUES
  ('taxa-jucemg', 'Taxa da Junta Comercial de Minas', 'JUCEMG / Estado de Minas Gerais',
   28108, 'me_simples', false,
   'Depois, quando a viabilidade volta deferida da Junta. Nao junto com o pagamento do plano.',
   '03-REGRAS-DOS-ORGAOS §2')
ON CONFLICT (id) DO NOTHING;

-- ── CONTRATO ────────────────────────────────────────────────────────────────
INSERT INTO fatos.contrato_regra (id, texto, valor_numerico, unidade, fonte) VALUES
  ('arrependimento',
   '7 dias para mudar de ideia, com dinheiro de volta, pelo direito de arrependimento do '
   'Codigo de Defesa do Consumidor, art. 49. 🔴 A condicao honesta: desistir ANTES de autorizar '
   'o envio a Junta devolve tudo. Depois que a empresa foi aberta, o servico ja foi executado, '
   'a taxa paga ao Estado nao volta e a regra de cancelamento do plano vale. ⚠️ Nunca dizer '
   '"sem letra miuda" nem "incondicional": e regra dura de marca, e nao seria verdade.',
   7, 'dias', '10-CONTRATO-GARANTIA-CANCELAMENTO §1'),
  ('fidelidade',
   'Fidelidade de 12 meses, contados a partir da EMISSAO DO CNPJ. Vale para os dois regimes. '
   '🔴 A contrapartida MUDA com o regime: no ME e abertura sem honorario, certificado digital '
   'incluso e o preco promocional; no MEI e abertura sem honorario e o preco promocional, e so. '
   'Nunca usar o certificado para justificar a fidelidade de quem e MEI.',
   12, 'meses', '10-CONTRATO-GARANTIA-CANCELAMENTO §3'),
  ('multa-cancelamento',
   'Cancelamento dentro da fidelidade tem multa de 30% sobre o SALDO RESTANTE do periodo, ou '
   'seja, sobre as parcelas que ainda iam vencer, nunca sobre o que ja foi pago. Fora da '
   'fidelidade, cancela quando quiser. 🔴 O agente informa a regra, nunca calcula o valor do '
   'caso da pessoa e nunca negocia desconto ou isencao.',
   30, 'percentual', '10-CONTRATO-GARANTIA-CANCELAMENTO §4'),
  ('reembolso-taxa-junta',
   'Depois de protocolado, o Estado ja prestou o servico, entao nao existe devolucao da taxa '
   'da Junta, nem por nos nem por eles. Antes de autorizar o envio, nada disso aconteceu e '
   'quem desiste recebe de volta tudo que pagou.',
   NULL, NULL, '10-CONTRATO-GARANTIA-CANCELAMENTO §2')
ON CONFLICT (id) DO NOTHING;

-- ── FILA DE ESCALONAMENTO ───────────────────────────────────────────────────
--  🟡 Nasce INATIVA. O roteamento e proposto e nao tem fila no produto.
INSERT INTO fatos.escalonamento_destino (assunto, destino, ativo, nota) VALUES
  ('enquadramento, calculo, obrigacao fiscal', 'contador com CRC', false, 'Proposto, aguardando ok'),
  ('cancelamento, reembolso, multa contratual', 'time comercial e financeiro', false, 'Proposto, aguardando ok'),
  ('cobranca indevida, pagamento em duplicidade', 'financeiro', false, 'Proposto, aguardando ok'),
  ('erro de processo em orgao, exigencia complexa', 'operacao', false, 'Proposto, aguardando ok'),
  ('irritacao, ameaca, risco de imagem', 'atendimento humano, com prioridade', false, 'Proposto, aguardando ok')
ON CONFLICT (assunto) DO NOTHING;

-- ── AS TABELAS DO SIMPLES ───────────────────────────────────────────────────
--  Fonte: LC 123/2006, Anexos III e V, espelhando `motor/regra/_tabelas.mjs`.
--  🔒 So III e V. O Anexo IV existe na lei e esta FORA do escopo do produto.
INSERT INTO fatos.simples_faixa (anexo, faixa, rbt12_ate, nominal, deduzir) VALUES
  ('III', 1,  180000.00, 0.06000,      0.00),
  ('III', 2,  360000.00, 0.11200,   9360.00),
  ('III', 3,  720000.00, 0.13500,  17640.00),
  ('III', 4, 1800000.00, 0.16000,  35640.00),
  ('III', 5, 3600000.00, 0.21000, 125640.00),
  ('III', 6, 4800000.00, 0.33000, 648000.00),
  ('V',   1,  180000.00, 0.15500,      0.00),
  ('V',   2,  360000.00, 0.18000,   4500.00),
  ('V',   3,  720000.00, 0.19500,   9900.00),
  ('V',   4, 1800000.00, 0.20500,  17100.00),
  ('V',   5, 3600000.00, 0.23000,  62100.00),
  ('V',   6, 4800000.00, 0.30500, 540000.00)
ON CONFLICT (anexo, faixa) DO NOTHING;

--  🔴 A reparticao e o que faz a guia fechar ao centavo. Cada faixa soma 1,00000.
--  ⚠️ A 6a faixa nao tem ISS: acima de R$ 3,6 mi o ISS sai do DAS. Fica na tabela
--     porque a tabela e da LEI, nao do nosso recorte.
INSERT INTO fatos.simples_reparticao (anexo, faixa, tributo, fracao) VALUES
  ('III',1,'cpp',0.43400),('III',1,'iss',0.33500),('III',1,'csll',0.03500),('III',1,'irpj',0.04000),('III',1,'cofins',0.12820),('III',1,'pis',0.02780),
  ('III',2,'cpp',0.43400),('III',2,'iss',0.32000),('III',2,'csll',0.03500),('III',2,'irpj',0.04000),('III',2,'cofins',0.14050),('III',2,'pis',0.03050),
  ('III',3,'cpp',0.43400),('III',3,'iss',0.32500),('III',3,'csll',0.03500),('III',3,'irpj',0.04000),('III',3,'cofins',0.13640),('III',3,'pis',0.02960),
  ('III',4,'cpp',0.43400),('III',4,'iss',0.32500),('III',4,'csll',0.03500),('III',4,'irpj',0.04000),('III',4,'cofins',0.13640),('III',4,'pis',0.02960),
  ('III',5,'cpp',0.43400),('III',5,'iss',0.33500),('III',5,'csll',0.03500),('III',5,'irpj',0.04000),('III',5,'cofins',0.12820),('III',5,'pis',0.02780),
  ('III',6,'cpp',0.30500),('III',6,'iss',0.00000),('III',6,'csll',0.15000),('III',6,'irpj',0.35000),('III',6,'cofins',0.16030),('III',6,'pis',0.03470),
  ('V',1,'cpp',0.28850),('V',1,'iss',0.14000),('V',1,'csll',0.15000),('V',1,'irpj',0.25000),('V',1,'cofins',0.14100),('V',1,'pis',0.03050),
  ('V',2,'cpp',0.27850),('V',2,'iss',0.17000),('V',2,'csll',0.15000),('V',2,'irpj',0.23000),('V',2,'cofins',0.14100),('V',2,'pis',0.03050),
  ('V',3,'cpp',0.23850),('V',3,'iss',0.19000),('V',3,'csll',0.15000),('V',3,'irpj',0.24000),('V',3,'cofins',0.14920),('V',3,'pis',0.03230),
  ('V',4,'cpp',0.23850),('V',4,'iss',0.21000),('V',4,'csll',0.15000),('V',4,'irpj',0.21000),('V',4,'cofins',0.15740),('V',4,'pis',0.03410),
  ('V',5,'cpp',0.23850),('V',5,'iss',0.23500),('V',5,'csll',0.12500),('V',5,'irpj',0.23000),('V',5,'cofins',0.14100),('V',5,'pis',0.03050),
  ('V',6,'cpp',0.29500),('V',6,'iss',0.00000),('V',6,'csll',0.15500),('V',6,'irpj',0.35000),('V',6,'cofins',0.16440),('V',6,'pis',0.03560)
ON CONFLICT (anexo, faixa, tributo) DO NOTHING;

-- 🔴 O PORTAO DA CARGA. Se a view devolver linha, a reparticao nao soma 1 e a
--    guia nao vai fechar contra o PGDAS. Melhor a carga morrer aqui do que a
--    divergencia aparecer na guia do cliente.
DO $$
DECLARE quebradas int;
BEGIN
  SELECT count(*) INTO quebradas FROM fatos.v_reparticao_fecha;
  IF quebradas > 0 THEN
    RAISE EXCEPTION 'reparticao nao fecha em % faixa(s): a carga foi abortada', quebradas;
  END IF;
END $$;

COMMIT;

-- ============================================================================
--  O QUE ESTA CARGA NAO TEM, E POR QUE ISSO IMPORTA
--
--  🔴 `fatos.servico_avulso` FICA VAZIA. Os precos dos avulsos (certidao
--     negativa, DECORE, declaracao de faturamento, nota emitida pela equipe,
--     alterar pro-labore de mes processado) NAO estao em nenhum arquivo do
--     `_origem/`. Inventar seria exatamente o que a regra anti-guru proibe.
--     Consequencia pratica e correta: o agente NAO pode citar preco de avulso
--     ate essa carga existir, e a tool devolve lista vazia em vez de um numero
--     plausivel. Vazio honesto vale mais que numero inventado.
--
--  🟡 `fatos.contrato_regra` nao tem a linha de REAJUSTE. A funcionalidade 7.7
--     existe no produto ("reajuste anual com regra anunciada"), mas o indice e
--     a data nao estao no vault. Mesma regra: nao inventar.
--
--  ⚠️ `fatos.cnae` nao e populada aqui. São 1.332 linhas e vem por COPY, em
--     `02-cnae.sql`, com a tabela de staging, porque parser de CSV escrito a
--     mao quebra nas descricoes oficiais, que tem virgula e aspas dentro.
-- ============================================================================
