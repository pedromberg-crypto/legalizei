---
tipo: fato
status: vivo
data: 2026-08-27
concorrente: contabilizei
artefato: funil-abertura-generico
fonte: prints do Pedro, percurso real via CTA genérico "Abrir empresa grátis" (não veio de um plano específico)
tags: [concorrente, funil, onboarding, cobranca, pricing, ux, contrato, juridico]
---

# 🔍 Funil de abertura da Contabilizei — 2ª captura (entrada genérica, 4 etapas) + contrato completo

> Segunda captura do mesmo funil já mapeado em [[2026-07-16-funil-abertura-ate-pagamento]]. Diferença: aquela entrou direto pelo CTA "Contratar" do plano Padrão (pulava a escolha de plano). Esta entrou pelo **CTA genérico "Abrir empresa grátis"**, então a escolha de plano vira **etapa própria do wizard**. Resultado: **4 etapas, não 3** — e aparecem mecânicas novas que a 1ª captura não pegou.

## ⚡ Contradição encontrada vs registro anterior

🔴 **`contabilizei.md` e [[2026-07-08-planos-servico]] registravam "Básico R$139 EXTINTO"** (08/07/2026, tabela pública). **Esta captura mostra o Básico R$139 vivo**, oferecido dentro do próprio wizard como "Procurando um plano mais econômico?" — card de downsell no fim da tabela de planos, com CTA "Contratar" e mensalidade real (mesma grade de faixas de [[2026-07-30-tabela-real-faixas]]: 139 / 228 / 406 / 584 / 673 / 762...). **Corrigido abaixo** — não estava extinto, só saiu da vitrine principal e virou oferta secundária dentro do funil.

## As 4 etapas

### 1/4 — Dados pessoais
Nome completo · E-mail · Celular. Pré-preenchido quando logado via Google/conta existente (print mostrou nome/e-mail/celular reais do Pedro já preenchidos — **provável autofill de conta Google**, não input manual). Confirma achado da 1ª captura: 3 campos, nada mais.

### 2/4 — Dados da empresa
- **"Qual atividade você vai exercer?"** — dropdown, mesmas 13 categorias grosseiras já documentadas (PJ em empresa · Serviços de TI · Serviços Administrativos · Comércio · Medicina · Psicologia e outros saúde · Marketing/Publicidade · Engenharia/Arquitetura · Educação/Cursos · Advocacia · Consultoria · Representação Comercial · "Minha atividade não está na lista"). Confirma: **nenhum gate de CNAE real**.
- **CEP** → revela endereço particular vs Escritório Virtual.
- 🆕 **Modal de disclosure do Escritório Virtual** (ícone "i"): *"Escritório virtual é um espaço fornecido por uma empresa especializada, onde é possível alugar um endereço fiscal para realizar a abertura da empresa; ficando registrado junto à Receita Federal como endereço sede do CNPJ. **O serviço de Escritório Virtual está sujeito à aprovação.**"* — ou seja, **não é automático**, passa por triagem deles. Isso não estava na 1ª captura.
- Endereço particular → mesma revelação de form completo (Rua/Número/Complemento/Bairro/Cidade/Estado travado).
- Selo final antes de avançar: **"Custo Zero: Nós pagamos o custo da abertura de empresa e as taxas obrigatórias do governo."** — 🔥 aqui a copy deles diz explicitamente que **absorvem a taxa de governo** (a pergunta em aberto da 1ª captura, item 3, fica respondida: **absorvem**, não cobram depois). Isso é dado novo e relevante pro nosso unit economics benchmark.

### 3/4 — Planos (agora é etapa própria do wizard, não landing separada)
- Widget expansível no topo: **"Por que pagar por um plano se a abertura da empresa é gratuita?"** → resposta: *"Para a sua empresa ser aberta, ela precisa por lei de um contador (Lei 10.406/02 - art. 1.179 do Código Civil). O valor do plano escolhido agora é um adiantamento da sua primeira mensalidade... Normalmente o processo burocrático completo de abertura custa em média R$600,00, mas na Contabilizei não cobramos nada."** — é a peça de copy que justifica juridicamente por que "abertura grátis" não é grátis de verdade (o valor pago é adiantamento de mensalidade, não honorário zero disfarçado).
- Tabela: Padrão R$195 · Multibenefícios R$225 · Experts Essencial R$395 (mesmos valores de [[2026-07-08-planos-servico]]).
- **Modal "Condições especiais para empresas de serviço"** (novo, capturado completo):
  - Preços válidos só p/ Simples Nacional + prestadora de serviço; faturamento influencia mensalidade (link p/ tabela de valores — é a mesma tabela de [[2026-07-30-tabela-real-faixas]]).
  - Lucro Presumido + serviço = tabela DIFERENTE da exibida no site.
  - Abertura sem sair de casa: só **BH, Curitiba, Floripa e São Paulo** (confirma achado antigo).
  - Experts Essencial: até **35 notas fiscais/mês**, extra **R$8/nota**.
  - Experts Essencial: até **2 contas bancárias**, extra **R$29/mês por conta**.
  - **Todos os planos** incluem conta digital PJ (Contabilizei.bank) grátis, sem taxa de manutenção, sujeito a aprovação cadastral, uso NÃO obrigatório.
  - Academias/TotalPass: elegibilidade só Multibenefícios + Experts Essencial.
  - Contratáveis separadamente: alteração contratual · certidões negativas (INSS/FGTS/Federais/ICMS/ISS).
- 🆕 **Card de downsell "Procurando um plano mais econômico?"** no fim da tabela: **Plano Básico R$139/mês**, CTA "Contratar" próprio, com bullets: contabilidade completa · processo de abertura grátis · abertura sem sair de casa · atendimento via chat e e-mail · faturamento mensal ideal até R$25 mil · conta PJ gratuita · plataforma para emissão gratuita de notas fiscais · pró-labore de sócios até 2 sócios grátis. **É o Básico que julgávamos extinto — só não está mais na vitrine principal, mora aqui.**

### 4/4 — Pagamento
- **CPF** → método de pagamento (Cartão de crédito default, com badge "Acelere seu processo!" e explicação "Antecipe em até 3 dias a emissão do seu CNPJ pagando com cartão de crédito"; Boleto bancário/Pix como alternativa) → toggle "Salvar este cartão para as demais mensalidades" (ligado por default) — tudo confirma a 1ª captura.
- Painel lateral "Sua escolha": mostra **PLANO PADRÃO R$195,00/mês** mesmo quando o usuário estava prestes a escolher o Básico — o resumo carrega o plano selecionado ANTES do clique no card de downsell.
- 🆕 **Ao clicar no CTA do Básico R$139, dispara modal de retenção**: *"Promoção por tempo limitado! Plano Padrão de R$195 por apenas R$139/mês por 3 meses"* + *"Atendimento via WhatsApp até às 22h ✓ · Certificado Digital [Grátis no plano Padrão] ✓"* + bloco "O Certificado Digital é obrigatório: para realizar suas rotinas de contabilidade · para assinar notas fiscais e contratos online · para acessar serviços online da Receita Federal" → **"QUERO APROVEITAR O DESCONTO"** (aceita = veste o Padrão a R$139/3 meses, some a badge de "3 meses" só no rodapé em texto pequeno "Após 3 meses, continue com o plano Padrão e mantenha todos os benefícios ou volte para o plano Básico") vs **"Não, obrigado"**.
  - 🔥 **Mecânica de dark-pattern-lite**: a escolha explícita do usuário (Básico R$139 fixo) é interceptada por uma oferta que troca silenciosamente pro Padrão R$195 disfarçado de "mesmo preço por 3 meses" — e a reversão pro Básico depois dos 3 meses exige AÇÃO do cliente (default é ficar no Padrão-195). Ninguém lembra o cliente passado o trial. **Não copiar.**
- Contrato final mostrou o **Plano Básico (139,00) selecionado em destaque azul** com a MESMA tabela de faixas do Básico já documentada em [[2026-07-30-tabela-real-faixas]] (139/228/406/584/673/762 fixo dali pra cima) — confirma que a tabela de faixas por faturamento é idêntica entre as duas capturas, dado consistente.
- **Assinatura eletrônica com trilha de auditoria explícita no rodapé do contrato**: *"Registro da assinatura através do IP [ip] em [data_confirmação], através do usuário [nome] e CPF: [cpf]."* — clickwrap com log de IP+timestamp+nome+CPF. Continua **sem checkbox de aceite explícito** (confirma achado 1ª captura: "Ao clicar em Finalizar, você está declarando que leu e concordou...").

## 📜 Contrato completo — extração das cláusulas que importam (não capturadas na 1ª rodada)

Duas entidades jurídicas por trás de "Contabilizei":
| Entidade | CNPJ | Papel |
|---|---|---|
| Contabilizei Contabilidade LTDA | 34.346.830/0001-97 (CRC/PR 010346/O-2) | presta o serviço contábil/fiscal/folha |
| Contabilizei Tecnologia LTDA | 20.182.807/0001-08 | licencia o software (inclusive as funcionalidades de abertura) |

Ambas sediadas em Curitiba/PR — **foro contratual é Curitiba/PR** (cláusula 11.13), sem exceção.

### Preço da abertura — o mecanismo real (cláusulas 3.2–3.3, 4.4)
- Licenciamento de software p/ Abertura de Empresa **avulso custa R$999 à vista (ou R$1.049,90 em 3x)**.
- **Isento** se contratado junto com Assessoria Mensal com fidelidade de 12 meses.
- Isenção só é concedida **após pagamento antecipado de 1 mensalidade** — que vira **crédito abatido na 1ª mensalidade cobrada a partir da emissão do CNPJ**. Ou seja: o valor pago no checkout (R$139/195/225/395) não é "primeiro mês pago", é **depósito antecipado que garante a isenção do R$999**, resgatado como crédito depois. Bate com a copy do modal "Por que pagar..." (item 3/4 acima).
- Se o cliente não finalizar cadastro/enviar docs dentro do prazo (máx. 90 dias, cláusula 2.1-b), **isenção é cancelada, contrato encerrado, nada é devolvido**.

### Fidelidade e cancelamento (cláusulas 2.1, 7.1)
- Fidelidade mínima **12 meses contados a partir da EMISSÃO DO CNPJ** (não da assinatura do contrato).
- Cancelar **durante o processo de abertura** (antes do CNPJ existir): multa de **R$20**.
- Cancelar **depois do CNPJ emitido**, dentro da fidelidade: multa de **30% sobre as parcelas restantes até o fim da fidelidade** (bate com a memória já travada `legalize-contrato-lider-achados`).
- Empresa inativa/sem movimento: mensalidade continua devida até pedido formal de cancelamento (cláusula 3.13) — "sem movimento" ainda gera obrigação acessória.

### Certificado digital — obrigatoriedade e custódia (cláusulas 4.3-c, 5.1, 5.8)
- Cliente se compromete a emitir o e-CNPJ Modelo A1 (ou outro indicado).
- 🔥 **Cláusula 5.8: cliente autoriza a Contabilizei a armazenar e solicitar a SENHA do certificado A1** — usado para emitir NF, guias, consultar Registrato/BACEN, acessar sistemas de órgãos. É custódia de credencial declarada em contrato, não just "usamos seu certificado pontualmente".
- Falta do certificado pode gerar multas não reembolsáveis pela Contabilizei (risco fica 100% com o cliente).

### Reajuste automático por reforma tributária (cláusulas 3.8–3.12) — cláusula nova, não existia nas capturas antigas
- Qualquer aumento de carga tributária sobre a Contabilizei decorrente da Reforma Tributária (IBS/CBS/Imposto Seletivo, EC 132/2023) **dá direito a reajuste automático e imediato** da mensalidade, limitado ao impacto líquido percentual sofrido, mediante aviso de 30 dias + memória de cálculo.
- Isso é **além** do reajuste anual por índice de inflação (cláusula 3.7) — dois mecanismos de reajuste empilhados.

### Responsabilidade — o cliente carrega quase tudo (cláusulas 5.11, 8.1, 9.4)
- Contabilizei explicitamente **não assume responsabilidade solidária/subsidiária** por IBS, CBS, split payment ou tributos do cliente.
- Multa por atraso do cliente em declarações: SÓ se "culpa exclusiva e comprovada" da Contabilizei — na dúvida, é o cliente que paga.
- Autoriza a Contabilizei a consultar Registrato/BACEN do cliente "para melhoria da prestação de serviço" (leitura ampla, cláusula 8.1-h).

## 🔎 Leitura — cruzamento com o que JÁ oferecemos/decidimos (nosso lado ratificado)

| Tema | Contabilizei (contrato/funil real) | Legalizai Story Book (nossa decisão travada) | Veredito |
|---|---|---|---|
| Preço de entrada | Básico R$139 "vitrine escondida" (downsell dentro do wizard) + Padrão R$195 na vitrine principal | R$79/mês 3 primeiros meses → R$139/mês estável (`fiscal.ts` `CUSTOS.MENSALIDADE`, decisão 20/08) | ✅ **Sem contradição de valor** (139 bate exato), mas 🔴 **atenção**: nosso trial 79→139 é **subida transparente e anunciada** desde o início (o preço final já está na tela). O deles é **reversão silenciosa pro tier mais caro** disfarçada de desconto. Manter a diferença — não adotar o padrão deles. |
| "Abertura grátis" | Confirmado: absorvem taxa de governo, "Custo Zero" explícito na tela 2/4. Mas o valor pago no checkout é ADIANTAMENTO de mensalidade, resgatado como crédito — não é "primeira mensalidade normal" | `HONORARIO_ABERTURA: 0` — honorário zero, mas **taxa de governo (DAE R$268,51) é cobrada à parte, depois, só na viabilidade deferida** (decisão recente: removemos DAE do total "você paga hoje") | 🟡 **Modelo diferente, mesma direção.** Eles absorvem 100% (governo + honorário) upfront disfarçado de crédito; nós cobramos governo depois, honrário nunca. **Nosso modelo é mais honesto** (não existe "crédito misterioso" — é claro que a DAE vem depois e por quê). Não mudar. |
| Fidelidade | 12 meses, contados da EMISSÃO DO CNPJ | `FIDELIDADE_MEI_MESES: 12` — mesmo período, mas aplicado hoje só ao MEI no código; ME não tem constante equivalente ainda | 🔴 **Gap a fechar**: confirmar se ME (não-MEI) também trava 12 meses ou é livre. Contrato deles trava os DOIS regimes por 12m quando bundlam abertura+assessoria — decisão nossa pra ME parece não estar no código ainda. |
| Multa de cancelamento pós-CNPJ | 30% sobre parcelas restantes da fidelidade | Já registrado em `legalize-contrato-lider-achados` (30% do SALDO) como achado do concorrente, mas não achei constante equivalente em `fiscal.ts`/`wizard-dinheiro.tsx` pra NOSSA multa | 🟡 **Confirmar**: é intenção nossa copiar esse número, ou é só "achado do concorrente" ainda sem decisão própria? Não travar sem o Pedro confirmar. |
| Multa de cancelamento pré-CNPJ | R$20 fixo | Não encontrado equivalente nosso | 🟡 Não temos essa cláusula ainda — provavelmente porque nosso modelo não cobra nada adiantado (nada a estornar/multar antes do CNPJ existir). Pode ser não-aplicável ao nosso desenho, não necessariamente gap. |
| Escritório Virtual / endereço fiscal | R$60/mês, cobrado a partir da 2ª parcela, **sujeito a aprovação** (disclosure nova desta captura) | `ENDERECO_FISCAL: 60` (🔴 FAKE, valor de referência do concorrente, não preço nosso fechado) | ✅ Valor já espelhado corretamente como referência. 🔴 **Gap**: não vi no nosso flow/copy nenhuma menção a "sujeito a aprovação" — se formos oferecer endereço fiscal como serviço nosso (parceiro/parceria), precisamos decidir se aprovamos automaticamente ou também temos triagem. Não decidido ainda. |
| Certificado digital — custódia de senha | Cliente autoriza Contabilizei armazenar a SENHA do certificado A1 (cláusula 5.8) | Copy nossa (`wizard-dinheiro.tsx` linha ~1172): "o certificado digital vem incluso... plano tem fidelidade... descrita no contrato" — não especifica custódia de senha | 🟡 **Decisão pendente, não é contradição, é lacuna**: precisamos decidir e documentar em contrato se VAMOS guardar a senha do certificado do cliente (operacionalmente quase obrigatório pra emitir NF/guias em nome dele) ou se o cliente insere a senha a cada uso. Isso é decisão jurídica + operacional, não só copy. |
| Reajuste automático por Reforma Tributária | Cláusula explícita (3.8–3.12), empilhada sobre o reajuste anual por índice | Não encontrado equivalente nosso em nenhum doc/contrato | 🟡 **Gap real, mas não necessariamente ruim pra nós.** Com a Reforma Tributária valendo pra todo mundo (inclusive nós), talvez precisemos de cláusula similar pra não absorver aumento de carga tributária como prejuízo silencioso. Levar pro Mauro — decisão de sócio, não de produto. |
| Responsabilidade solidária (IBS/CBS/split payment) | Explicitamente isenta a Contabilizei | Nenhum contrato nosso version final visto nesta sessão pra comparar | 🟡 Não avaliável sem ver nosso contrato-modelo atual. Se ainda não temos cláusula equivalente, é recomendável ter — protege a Legalize Digital do mesmo jeito. |
| Coleta pré-pagamento | Nome, e-mail, celular, categoria (dropdown 13), CEP/endereço, CPF — **zero validação de elegibilidade** | Nosso flow inteiro (T4/CNAE, gate, triagem, faixa) valida elegibilidade ANTES de cobrar — é diferencial já documentado (`legalize-encaixe-cluster-fiscal`, etc.) | ✅ **Sem contradição — reforça o que já era diferencial.** Eles cobram sem saber se dá certo; nós validamos antes. Manter. |

## Decisões (27/08, Pedro) — fecha os 4 pontos em aberto

1. ✅ **ME (não-MEI) tem as MESMAS condições de fidelidade/multa do MEI** — 12 meses da emissão do CNPJ, multa 30% do saldo. Não é mais só "achado do concorrente" — decisão própria, travada em `marca/decisoes-marca.md` 27/08. `CUSTOS.FIDELIDADE_MEI_MESES` renomeado pra `CUSTOS.FIDELIDADE_MESES` (`lib/fiscal.ts`) — aplica aos dois regimes agora. Nova constante `CUSTOS.MULTA_CANCELAMENTO_PCT: 0.3`.
2. ✅ **Vamos guardar a senha do certificado digital do cliente**, mesma mecânica da Contabilizei. Falta entrar no texto do CONTRATO (não só na copy de tela) — pendência de redação jurídica, não de decisão de produto.
3. ✅ **Cláusula de reajuste automático por Reforma Tributária entra no nosso contrato**, empilhada sobre o reajuste anual por índice. Redação final = Larissa/Mauro.
4. ✅ **Escritório Virtual (endereço fiscal): aprovação AUTOMÁTICA**, ao contrário do concorrente (manual). Mantém fricção mínima do funil.

## 🔬 Comparativo passo-a-passo — dado por dado, até o pagamento (27/08)

> Cruzamento completo pedido pelo Pedro: o que a Contabilizei pede/mostra em cada etapa × o que a Legalizai pede/mostra na etapa equivalente. Fonte do nosso lado: `execucao/dados-coletados-abertura-ate-viabilidade.md` (gerado de `flow-data.mjs`) + leitura direta de `gate-telas.tsx`/`wizard-dinheiro.tsx`. **Diferença estrutural que já muda a leitura de tudo abaixo:** a ordem é INVERTIDA. Eles pedem dado pessoal → atividade → plano → pagamento, SEM checar elegibilidade em nenhum ponto. Nós validamos CNAE/elegibilidade (E5A→E5V→E5T→E5F) **antes** de pedir qualquer dado pessoal (E6) ou cobrar (E9). Por isso o mapeamento abaixo é por TEMA de dado/informativo, não por número de tela.

| Tema | Contabilizei pede/mostra | Legalizai pede/mostra | Situação |
|---|---|---|---|
| **Dado pessoal básico** (nome/e-mail/celular) | 3 campos, tela 1/4, isolados, sem validar nada ainda | E6 (`Criar conta`): nome, e-mail, senha, CPF, telefone, endereço, código de verificação — **7 campos**, MAS só chega aqui depois do CNAE já ter sido validado (E5A-E5V) | 🟡 **Pedimos mais dado no mesmo momento**, só que o "momento" já vem depois de confirmar que a empresa PODE ser aberta. Trade-off consciente, não gap. |
| **Atividade/CNAE** | Dropdown fechado de 13 categorias genéricas, zero validação, escape "não está na lista" | Descrição livre → CNAE real via IA + veredito de elegibilidade (atende/regulado/não atende), com desambiguação | ✅ **Diferencial nosso, já documentado.** Sem contradição, reforça o que já era tese. |
| **CEP / endereço próprio** | CEP + hint explícito: *"A maioria das prefeituras aceita o uso de endereço residencial. Você poderá alterá-lo futuramente"* — **disclaimer de risco**, avisa que pode não dar certo | E5F: "Uso um endereço meu" — **sem nenhum aviso equivalente** sobre a prefeitura poder recusar endereço residencial | 🔴 **Negligenciado — achado real.** Eles avisam o risco antes, empurrando expectativa correta; a gente hoje deixa o cliente escolher "endereço meu" sem avisar que pode ser recusado por zoneamento/CNAE. Vale adicionar um aviso equivalente na opção "Uso um endereço meu" do E5F. |
| **Upsell de endereço fiscal** | Bullets de vantagem (abertura mais rápida · endereço protegido · economia) + preço R$60/mês "cobrado a partir da 2ª parcela" (letra pequena) + (nesta captura) modal "sujeito a aprovação" | Card com preço visível (R$60/mês) + **aviso destacado** "Essa cobrança é mensal, recorrente... você confirma o valor total no próximo passo" (`Aviso variante="warning"`) — sem menção a aprovação (decisão 27/08: automática) | ✅ **Mais transparente que eles** no timing da cobrança (aviso destacado vs letra miúda); ✅ consistente por não ter disclaimer de aprovação manual (decisão nossa é aprovação automática, não precisa avisar filtro que não existe). |
| **Justificativa legal de por que se paga algo** | Widget explícito citando **Lei 10.406/02, art. 1.179 (Código Civil)**: empresa precisa de contador por lei; "processo custa em média R$600, na Contabilizei não cobramos nada" | Argumento "honorário zero" repetido 3x (card verde · comparativo · FAQ) — **mas sem citar a base legal** de por que contabilidade é obrigatória | 🟡 **Oportunidade, não gap crítico.** Nosso argumento já é mais forte no fundo (honorário realmente zero, deles é "adiantamento disfarçado de crédito"), mas citar a mesma base legal (art. 1.179 CC) reforçaria credibilidade sem custar nada — considerar adicionar na tela `/plano` (E7). |
| **Plano/preço** | Tabela de 3 tiers (Padrão/Multibenefícios/Experts) + downsell Básico escondido, escolha explícita do cliente | 1 plano único (`PlanoOferta`), tela de confirmação (não escolha) — sem tiers | ✅ Consistente com decisão de produto (preço único, sem paralisia de tier) já registrada em `plano-padrao-195-referencia.md` item 4. Não é gap, é escopo. |
| **CPF** | Pedido pela 1ª vez na tela de pagamento (4/4), "para prosseguir com o pagamento" | Já coletado no E6 (bem mais cedo), **só EXIBIDO** no E9 (decisão 29/07, corrigiu bug de "CPF pedido 2×") | ✅ **Melhor que eles** — zero duplicação, e a validação de CPF acontece mais cedo (pode reagir a CPF inválido antes de chegar no pagamento). |
| **Método de pagamento** | Cartão (default, badge "acelere seu processo") · Boleto/Pix · toggle salvar cartão (default ligado) | Cartão/Pix/boleto (E9) — mesma lógica geral | 🟡 **Confirmar se copy de "acelere seu processo pagando com cartão" (antecipa emissão do CNPJ) existe do nosso lado** — não encontrei equivalente explícito no trecho lido; se não tivermos, é copy barata de adotar (motivo real: cartão evita espera de compensação do boleto). |
| **Aceite de contrato** | Texto cinza sem checkbox: "Ao clicar em Finalizar, você declara que leu..." — clickwrap fraco | E8: **checkbox explícito** de aceite, tela própria (CDC art. 49, reversível) | ✅ **Melhor que eles**, já documentado como princípio (T18/E8). |
| **Total a pagar / taxa de governo** | "Custo Zero" explícito (absorvem taxa) — total mostrado = só a mensalidade, sem taxa de governo em lugar nenhum | Taxa de governo (DAE) **removida do total "você paga hoje"** (decisão recente) — cobrada só depois, na viabilidade deferida, com explicação de por quê | ✅ **Mais honesto que eles**: nosso modelo explica que a taxa vem depois e por quê; o deles não menciona a taxa em nenhum momento do checkout (ela existe, só não aparece — decisão de copy, não de isenção real, já que cláusula 4.3-h joga a taxa pro cliente). |
| **Trial/downsell no checkout** | Modal "Promoção por tempo limitado" tentando reverter escolha de plano mais barato pro mais caro, com reversão silenciosa após 3 meses | Trial nosso é R$79→R$139 (3 meses), **subida transparente e anunciada desde o início**, sem interceptar escolha do cliente | ✅ Já registrado como diferença consciente (não copiar o padrão deles) na 1ª análise desta captura. |

## Achado novo desta rodada — aplicado (27/08)

✅ **Aviso de risco de zoneamento no E5F** — `gate-telas.tsx` (`FaixaView`), opção "Uso um endereço meu" agora mostra `Aviso variante="info"`: *"A maioria aceita endereço residencial, mas depende do zoneamento e da sua atividade. A gente confirma isso quando a viabilidade sair — se não der, você troca sem custo."*

✅ **Citação legal (Código Civil, art. 1.179) na tela `/plano`** — adicionada em `PlanoView` E `PlanoOferta` (`wizard-dinheiro.tsx`), logo após o card "Taxa da Junta Comercial": *"Por lei (Código Civil, art. 1.179), toda empresa precisa de contabilidade regular. É esse serviço contínuo que vira a sua mensalidade, não a abertura."* — versão mais exata que a deles (eles usam a mesma lei pra justificar a abertura; a nossa aplica certo, à mensalidade).

🟢 **"Cartão acelera" — já existia, sem gap.** Lendo mais fundo o `PagamentoView` (`METODOS`, linha ~1306): já tem exatamente essa lógica (cartão = "sua abertura começa hoje" vs boleto = "espera o pagamento"), inclusive com 3 níveis (cartão/Pix/boleto) contra os 2 deles. O comentário de 29/07 registra que a gente **decidiu de propósito** trocar o imperativo "Acelere seu processo" (linguagem de varejo) por uma afirmação de fato — copiar a frase deles reverteria essa correção. Não mexido.

## Links
- [[2026-07-16-funil-abertura-ate-pagamento]] — 1ª captura (entrada específica pelo Padrão R$195, 3 etapas).
- [[plano-padrao-195-referencia]] · [[2026-07-30-tabela-real-faixas]] · [[2026-07-08-planos-servico]] · [[contabilizei]] · [[HOME]]
