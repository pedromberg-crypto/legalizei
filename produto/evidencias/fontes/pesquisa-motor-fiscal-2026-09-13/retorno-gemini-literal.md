<!-- LITERAL. Retorno do Gemini em 13/09/2026 para o prompt de
     pesquisa/prompts/2026-09-13-motor-fiscal-fator-r-rbt12-prolabore.md
     Original: ~/Downloads/Pesquisa Fiscal Simples Nacional.md (84.531 chars).
     Aqui foram removidas 11 linhas de base64 (49.683 chars, 59% do arquivo):
     as formulas vieram como IMAGEM, nao como texto, e por isso nao sao
     legiveis. A prosa esta 100% integra: 34.848 caracteres. -->

# **Relatório Técnico de Pesquisa Fiscal: Parametrização Algorítmica do Fator R e Apuração do Simples Nacional**

A presente análise técnica detalha a engenharia tributária e as bases normativas primárias necessárias para a parametrização de um software de contabilidade. O escopo lógico, as premissas matemáticas e as obrigações acessórias aqui descritas aplicam-se estrita e exclusivamente a um contribuinte com o seguinte perfil: Microempresa (ME) optante pelo Simples Nacional; prestadora de serviços de atividade não regulamentada (sem conselho de classe); sujeita à tributação pelos Anexos III ou V; emissora de Nota Fiscal de Serviços Eletrônica (NFS-e) com incidência de ISS municipal; sediada em município do estado de Minas Gerais (como Belo Horizonte ou Contagem); possuindo de um a quatro sócios, todos pessoas físicas domiciliadas no Brasil.

Quaisquer aplicações destas regras a Microempreendedor Individual (MEI), Empresa de Pequeno Porte (EPP), empresas optantes pelo Lucro Presumido ou Lucro Real, atividades de comércio ou indústria sujeitas ao ICMS, Anexos I, II ou IV, bem como a atividades regulamentadas, difere, e está fora do escopo desta parametrização.

A arquitetura do Simples Nacional para prestadores de serviços de natureza intelectual e assemelhada orbita em torno do mecanismo do Fator R, introduzido pela Lei Complementar nº 155/2016 e regulamentado pela Resolução CGSN nº 140/2018. O Fator R atua como uma chave de roteamento algorítmico: se a razão entre a folha de salários e a receita bruta for igual ou superior a 0,28 (28%), o sistema deve direcionar a tributação para o Anexo III; caso contrário, para o Anexo V. A precisão absoluta na composição deste numerador e do denominador é o que previne passivos tributários ocultos (glosas) e otimiza a carga fiscal do contribuinte.

## **PERGUNTA 1 — O QUE COMPÕE O NUMERADOR DO FATOR R**

O algoritmo de cálculo do numerador do Fator R exige a consolidação da folha de salários e encargos dos doze meses anteriores ao período de apuração (FS12). A exatidão desta variável requer o mapeamento rigoroso de quais eventos de folha de pagamento são absorvidos pela matriz de cálculo e quais são rejeitados, observando-se a natureza jurídica de cada rubrica.

### **1.1 O que ENTRA na folha de salários incluídos encargos**

**a) Salários de empregados**

* **Resposta direta:** Confirmado. Os salários brutos pagos aos empregados compõem o numerador do Fator R.  
* **Base legal:** Lei Complementar nº 123/2006, art. 18, § 24 e Resolução CGSN nº 140/2018, art. 26, § 1º, inciso I1. Em vigor em SETEMBRO DE 2026\.  
* **Observação prática:** O software deve capturar o valor bruto da folha de pagamento (antes das deduções de imposto de renda e contribuição previdenciária do empregado), conforme informado nos eventos remuneratórios do eSocial (S-1200) e consolidados no fechamento (S-1299).

**b) Pró-labore de sócio**

* **Resposta direta:** Confirmado. A remuneração do trabalho dos sócios compõe o numerador.  
* **Base legal:** Lei Complementar nº 123/2006, art. 18, § 24 e Resolução CGSN nº 140/2018, art. 26, § 1º, inciso II1. Em vigor em SETEMBRO DE 2026\.  
* **Observação prática:** O sistema deve isolar estritamente o valor classificado contábil e fiscalmente como pró-labore, segregando-o de eventuais antecipações de lucros, que possuem tratamento tributário distinto.

**c) 13º salário**

* **Resposta direta:** O 13º salário entra no cálculo exclusivamente no mês de seu efetivo pagamento (agregado na competência da incidência da contribuição previdenciária). Não deve ser rateado (provisionado) mês a mês.  
* **Base legal:** Resolução CGSN nº 140/2018, art. 26, § 1º, inciso II1. Em vigor em SETEMBRO DE 2026\.  
* **Observação prática:** A arquitetura do software deve prever picos na variável FS12 nos meses de novembro e dezembro, meses tradicionais de liquidação do 13º salário. A utilização de provisões contábeis de 1/12 ao mês no cálculo do Fator R é um erro grave de modelagem que resulta em autuação fiscal.

**d) Férias e o terço constitucional**

* **Resposta direta:** Entram no cálculo no mês em que o pagamento é efetivamente realizado ao trabalhador.  
* **Base legal:** Resolução CGSN nº 140/2018, art. 26, § 1º, inciso I2. Em vigor em SETEMBRO DE 2026\. A norma consolida como folha os salários informados na forma prevista no art. 32, inciso IV, da Lei nº 8.212/1991, o que abrange as férias e seu respectivo terço.  
* **Observação prática:** Semelhante ao 13º salário, o impacto no algoritmo de cálculo ocorre de forma concentrada na competência do desembolso, elevando transitoriamente o FS12.

**e) FGTS**

* **Resposta direta:** Entra como "encargo" na composição do Fator R, mas restringe-se ao montante efetivamente recolhido no período.  
* **Base legal:** Resolução CGSN nº 140/2018, art. 26, § 1º, inciso III, alínea "b"1. Em vigor em SETEMBRO DE 2026\.  
* **Observação prática:** O sistema de contabilidade não pode somar o FGTS apurado (devido), mas apenas o FGTS cuja guia foi baixada (paga) no financeiro. Em caso de inadimplência do FGTS por parte da microempresa, o valor não incrementa o Fator R daquele mês.

**f) A Contribuição Previdenciária Patronal (CPP)**

* **Resposta direta:** A CPP apurada e recolhida DENTRO do próprio DAS (Documento de Arrecadação do Simples Nacional) compõe integralmente o numerador do Fator R como encargo, não sendo exigido que seja recolhida em guia separada (GPS/DARF previdenciário). O entendimento é pacífico.  
* **Base legal:** Lei Complementar nº 123/2006, art. 18, § 24; Resolução CGSN nº 140/2018, art. 26, § 1º, inciso III, alínea "a"; e Solução de Consulta COSIT nº 17, de 18 de março de 20212. Em vigor em SETEMBRO DE 2026\.  
* **Observação prática:** Ponto pacífico, não há divergência. A Solução de Consulta COSIT nº 17/2021 estabeleceu claramente que a legislação não especifica exceções; logo, a CPP embutida no DAS entra no cálculo5. O desafio computacional para o software é a extração deste dado. Como a CPP está aglutinada na alíquota efetiva do Simples Nacional, o algoritmo deve acessar o percentual de repartição dos tributos do Anexo correspondente (III ou V) da competência anterior, aplicar a fração destinada à CPP sobre o valor total do DAS pago, e injetar este montante na matriz do FS12.

**g) Contribuição previdenciária DESCONTADA do segurado (parte do empregado e contribuinte individual)**

* **Resposta direta:** Entra na base de cálculo de forma intrínseca, pois o valor considerado no numerador é o salário ou pró-labore BRUTO, que já contém essa parcela. Não deve ser somada uma segunda vez.  
* **Base legal:** Lei nº 8.212/1991, art. 22 e Resolução CGSN nº 140/2018, art. 26, § 1º1. Em vigor em SETEMBRO DE 2026\.  
* **Observação prática:** O software não deve realizar a soma do valor líquido pago ao sócio/empregado acrescido da guia de retenção do INSS, pois isso geraria redundância e distorção algorítmica. O parâmetro base é sempre o valor bruto da folha de pagamento.

### **1.2 O que NÃO entra, de forma expressa**

A legislação delimita fronteiras rígidas sobre o que não pode ser interpretado como massa salarial para inflar artificialmente o Fator R. Contudo, há uma correção interpretativa fundamental a ser feita quanto à premissa da pergunta em relação aos autônomos.

**a) Pagamento a autônomo por RPA**

* **Resposta direta:** Atenção à premissa: o pagamento a autônomo pessoa física (RPA) **ENTRA** de forma expressa na folha de salários para o Fator R.  
* **Base legal:** Resolução CGSN nº 140/2018, art. 26, § 1º, inciso II. A norma define categoricamente que se consideram salários o valor da base de cálculo da contribuição prevista no art. 22 da Lei nº 8.212/1991, o que inclui as remunerações pagas a segurados contribuintes individuais, abrangendo tanto o pró-labore quanto os pagamentos a "autônomos"1. Em vigor em SETEMBRO DE 2026\.  
* **Observação prática:** O software deve capturar os Recibos de Pagamento a Autônomo (RPA) emitidos para pessoas físicas sem vínculo empregatício e integrá-los ao FS12.

**b) Pagamento a prestador PJ**

* **Resposta direta:** Não entra. O Fator R considera exclusivamente remunerações a pessoas físicas.  
* **Base legal:** Resolução CGSN nº 140/2018, art. 26, caput e § 3º2. Em vigor em SETEMBRO DE 2026\.  
* **Observação prática:** Notas fiscais recebidas de empresas terceirizadas (B2B) são tratadas sistemicamente como despesas operacionais (custos de serviços prestados) e devem ser isoladas e ignoradas pela rotina de cálculo do Fator R.

**c) Estagiário**

* **Resposta direta:** Não entra. Os valores pagos a título de bolsa-auxílio a estagiários são excluídos do Fator R.  
* **Base legal:** Lei nº 11.788/2008 (Lei do Estágio), arts. 3º e 12, § 2º, corroborado pelas diretrizes do Manual do PGDAS-D (Pergunta 5.11)2. Em vigor em SETEMBRO DE 2026\.  
* **Observação prática:** Como os estagiários não possuem vínculo empregatício e não são classificados como contribuintes individuais pela legislação previdenciária, o software deve classificar as bolsas de estágio em uma rubrica contábil cega para o motor do Simples Nacional.

**d) Distribuição de lucro**

* **Resposta direta:** Não entra de forma expressa.  
* **Base legal:** Resolução CGSN nº 140/2018, art. 26, § 2º2. Em vigor em SETEMBRO DE 2026\.  
* **Observação prática:** A distribuição de dividendos isentos é o retorno sobre o capital investido, não remuneração pelo trabalho. O sistema contábil deve possuir travas que impeçam contas de patrimônio líquido e distribuição de lucros de alimentarem o acumulador FS12.

**e) Aluguel pago ao sócio**

* **Resposta direta:** Não entra de forma expressa.  
* **Base legal:** Resolução CGSN nº 140/2018, art. 26, § 2º2. Em vigor em SETEMBRO DE 2026\.  
* **Observação prática:** Qualquer remuneração derivada de cessão de direitos, uso ou gozo de bens móveis ou imóveis (aluguéis), mesmo que o beneficiário seja o sócio administrador, não compõe a métrica de emprego fomentada pelo Fator R.

### **1.3 REGIME DE APURAÇÃO — Valor pago vs. Valor devido**

Este é o componente mais crítico para o desenho do banco de dados e do fluxo de processamento de um software de contabilidade tributária. A dissociação entre o registro no eSocial e o fluxo de caixa gera riscos severos de passivo fiscal.

* **Resposta direta:** O numerador do Fator R considera estrita e exclusivamente o valor **PAGO (regime de caixa)**, independentemente do regime escolhido pela empresa para apurar a receita bruta (competência ou caixa). Pró-labore declarado no eSocial (competência), mas não liquidado financeiramente em dinheiro na conta do sócio, **NÃO CONTA** no Fator R.  
* **Base legal:** Lei Complementar nº 123/2006, art. 18, § 24; Resolução CGSN nº 140/2018, art. 26, § 6º; Solução de Consulta COSIT nº 17, de 18 de março de 2021; e Solução de Consulta COSIT nº 251, de 04 de setembro de 20246. Em vigor em SETEMBRO DE 2026\.  
* **Observação prática e consequências:** A legislação determina que a FS12 seja formada pelo "montante pago". Se a Receita Federal, em procedimento de malha fina ou auditoria (cruzando dados da EFD-Reinf, e-Financeira e PGDAS-D), identificar que uma rubrica de pró-labore foi transmitida no eSocial apenas para elevar artificialmente a folha e atingir os 28%, mas permaneceu como "Contas a Pagar / Obrigações com Sócios" no passivo circulante do balanço sem efetiva transferência bancária, o fisco efetuará a **glosa** deste montante11. A consequência imediata da glosa é a redução retrospectiva da FS12. Com o Fator R caindo abaixo de 28%, a empresa sofre **reclassificação de ofício para o Anexo V**. O software deve prever que a reclassificação impõe o recálculo do Simples Nacional de todas as competências afetadas, com a cobrança da diferença de alíquota (que pode saltar de 6% para 15,5% na primeira faixa), acrescida de juros equivalentes à taxa Selic e multa de ofício de 75% sobre o valor não recolhido (art. 44, I, da Lei nº 9.430/1996)3. Do ponto de vista sistêmico, o software de contabilidade deve possuir uma conciliação entre o módulo de folha e o módulo financeiro/contábil: a variável do FS12 só pode ser populada após a confirmação da baixa (liquidação) do título a pagar gerado pelo fechamento da folha.

## **PERGUNTA 2 — RBT12 DE EMPRESA COM MENOS DE 13 MESES**

Para empresas recém-constituídas, o sistema algorítmico do Simples Nacional prevê regras de transição que projetam a receita para um cenário anual (anualização), garantindo que a empresa seja enquadrada na faixa de alíquota correta, sem ser indevidamente beneficiada nos primeiros meses por não possuir doze meses de histórico. O tratamento de Empresas de Pequeno Porte (EPP) com receitas mais elevadas difere, e está fora do escopo.

### **2.1 Regra exata de proporcionalização**

* **Resposta direta:** A regra exige a apuração de uma média aritmética da receita dos meses de atividade anteriores ao período de apuração, multiplicando-se o resultado por doze.  
* **Base legal:** Lei Complementar nº 123/2006, art. 18, §§ 1º e 2º, art. 3º; e Resolução CGSN nº 140/2018, art. 2214. Em vigor em SETEMBRO DE 2026\. (Nota: As alterações promovidas pelas Resoluções CGSN 183/2025 e 190/2026 mantiveram a estrutura matemática de anualização do art. 22 inalterada para 2026).

### **2.2 Fórmulas matemáticas explícitas**

A arquitetura do código-fonte deve implementar as seguintes condicionais:

**a) No primeiro mês de atividade (Mês 1\)**

* **Fórmula:** ![][image1]  
* **Critério de tempo:** O mês de abertura conta como **MÊS INTEIRO**, independentemente do dia em que o CNPJ foi inscrito. Não existe proporcionalização por dias (pro rata die) na apuração do RBT12 para o Simples Nacional3. Se a empresa for constituída em 30 de outubro e faturar R$ 5.000,00 neste único dia, o RBT12 será R$ 60.000,00.

**b) Do segundo ao décimo segundo mês (Mês 2 ao Mês 12\)**

* **Fórmula:** ![][image2]  
* **Critério lógico:** A receita do mês de apuração corrente *não* entra na média. Utiliza-se estritamente o histórico fechado dos meses anteriores3.

**c) A partir do décimo terceiro mês (Mês 13 em diante)**

* **Fórmula:** ![][image3]  
* **Critério lógico:** A regra de proporcionalização é desativada no software, adotando-se a janela móvel padrão de 12 meses.

### **2.3 Integração da RBT12 proporcional na Alíquota Efetiva**

* **Resposta direta:** O valor matemático encontrado através da anualização (RBT12 proporcionalizado) é utilizado de forma idêntica e simultânea nas duas posições da equação geral.  
* **Fórmula Padrão:** ![][image4]  
* **Observação prática:** O software fará um único cálculo de RBT12. O mesmo valor hipotético projetado servirá primeiramente para localizar a "Alíquota Nominal" e a "Parcela a Deduzir" nas tabelas dos Anexos, e em seguida alimentará a equação como o multiplicador do numerador e o divisor global. Não se utiliza a receita real acumulada em nenhuma das posições da fórmula de alíquota.

### **2.4 O FATOR R NO MESMO PERÍODO (Proporcionalização da Folha)**

* **Resposta direta:** SIM, a janela de 12 meses da folha de salários (FS12) **também é rigorosamente proporcionalizada** (anualizada) para empresas com menos de 13 meses, utilizando o exato espelho matemático da receita. Ela NÃO usa apenas os meses existentes somados de forma simples.  
* **Base legal:** Resolução CGSN nº 140/2018, art. 26, § 4º8. O dispositivo crava: "Na hipótese de a ME ou EPP ter menos de 13 (treze) meses de atividade, *adotar-se-ão, para a determinação da folha de salários anualizada, incluídos encargos, os mesmos critérios* para a determinação da receita bruta total acumulada, estabelecidos no art. 22, no que couber." Em vigor em SETEMBRO DE 2026\.  
* **Observação prática:** Uma falha comum em sistemas é anualizar a receita e esquecer de anualizar a folha. Se o software calcular a RBT12 multiplicando por 12, mas somar a FS12 dos poucos meses reais, a razão matemática (FS12/RBT12) despencará artificialmente para perto de zero, punindo a empresa recém-aberta com o enquadramento equivocado no Anexo V. O código deve forçar a equação ![][image5].

### **2.5 Conferência Numérica (Caso Hipotético)**

**Parâmetros de Entrada no Sistema:**

* **Abertura:** 12/12/2025.  
* **Tributação:** Anexo V (Serviços sem atingimento do Fator R de 28%).  
* **Faturamento Fixo:** R$ 10.000,00 por mês, todos os meses.  
* **Competência de Apuração:** Setembro/2026.

**Passo 1: Definir o índice de meses (n) e o período de análise** O mês de apuração (Setembro/2026) representa o 10º mês de atividade. Meses anteriores \= 9 meses (Dez/25, Jan/26, Fev/26, Mar/26, Abr/26, Mai/26, Jun/26, Jul/26, Ago/26).

**Passo 2: Apurar a RBT12 proporcional** Soma das receitas anteriores: R$ 10.000,00 ![][image6] 9 \= R$ 90.000,00. Média aritmética: R$ 90.000,00 ![][image7] 9 \= R$ 10.000,00. RBT12 Proporcionalizada \= R$ 10.000,00 ![][image6] 12 \= **R$ 120.000,00**.

**Passo 3: Identificar a Faixa no Anexo V** Com RBT12 de R$ 120.000,00, a ME enquadra-se na **1ª Faixa do Anexo V** (que vai até R$ 180.000,00)3.

* Alíquota Nominal da 1ª Faixa: 15,50%.  
* Parcela a Deduzir (PD): R$ 0,00.

**Passo 4: Processar a Alíquota Efetiva**

**![][image8]**

**![][image9]**

**Passo 5: Calcular o imposto devido no mês (DAS)** O DAS incide sobre a receita bruta efetiva auferida *no mês corrente de apuração* (Setembro/2026).

![][image10]

![][image11]

O motor de cálculo do software deve retornar a saída final de **R$ 1.550,00**.

## **PERGUNTA 3 — PRÓ-LABORE EM MÊS SEM FATURAMENTO**

A manipulação da rubrica de pró-labore visando estritamente a sustentação do Fator R, especialmente em holdings patrimoniais, clínicas médicas e escritórios de tecnologia isolados, atrai forte escrutínio da administração tributária. A arquitetura de software deve compreender a natureza trabalhista e previdenciária desta operação para não induzir o usuário a infrações.

### **3.1 Obrigatoriedade do pagamento de pró-labore**

* **Resposta direta:** O pagamento de pró-labore ao sócio administrador NÃO é obrigatório de forma estática todo mês. A obrigatoriedade de remuneração (e consequente contribuição previdenciária) surge apenas quando há remuneração efetivamente paga ou creditada pelo trabalho prestado à pessoa jurídica.  
* **Base legal:** Lei nº 8.212/1991, art. 12, inciso V, alínea "f", e art. 22, inciso III, combinados com a Instrução Normativa RFB nº 2.110/2022, art. 8º9. Em vigor em SETEMBRO DE 2026\.  
* **Ponto pacificado:** A Solução de Consulta COSIT nº 120/2016 e, num contexto análogo recente, a COSIT nº 251/2024, cristalizaram o entendimento de que a lei não obriga a emissão de contracheques artificiais se a empresa não possui atividade econômica ou fluxo de caixa que justifique a remuneração pelo trabalho9.

### **3.2 Omissão de pró-labore em mês sem faturamento**

* **Resposta direta:** Sim. Se a empresa não fatura e não possui capacidade de caixa em um determinado mês, ela pode legitimamente abster-se de gerar e pagar pró-labore naquele período sem cometer infração tributária24.  
* **Observação prática:** O software de folha não deve gerar um holerite de pró-labore de forma automatizada (em *batch*) para empresas inativas no mês, a menos que haja configuração explícita e disponibilidade financeira na contabilidade.

### **3.3 O que continua obrigatório mesmo sem pró-labore**

A suspensão temporal da retirada do pró-labore por ausência de caixa deflagra uma cascata de eventos em obrigações acessórias que o sistema deve controlar.

* **eSocial:** O envio passa a ser obrigatório com o indicativo de "Sem Movimento". O software deve gerar o evento **S-1299 (Fechamento dos Eventos Periódicos)** com a flag indicando a ausência de fatos geradores. Esta declaração de sem movimento deve ser transmitida na primeira competência do ano em que ocorrer (geralmente janeiro), não havendo necessidade de envio mensal iterativo para os meses subsequentes em que a situação persistir25. Base: IN RFB nº 2.110/2022, art. 43, inciso II.  
* **DCTFWeb:** Sim, a transmissão é necessária e acompanha a lógica do eSocial. Ao transmitir o fechamento do eSocial sem movimento, o sistema da Receita Federal gera a DCTFWeb sem movimento, que deve ser devidamente validada e transmitida pelo contribuinte26.  
* **Multa:** Sim, há penalidade pela omissão ou atraso. A ausência da transmissão da DCTFWeb, ainda que a empresa esteja completamente inativa e a declaração seja zerada (sem movimento), gera a aplicação de multa de ofício.  
* **Valor da Multa:** O valor da multa mínima estipulada para a DCTFWeb sem movimento é de **R$ 200,00** (duzentos reais). Base legal: Instrução Normativa RFB nº 2.005/2021, art. 14, § 3º, inciso I (substituída e consolidada no arcabouço pela IN RFB nº 2.237/2024)27. Em vigor em SETEMBRO DE 2026\.

### **3.4 Valores Mínimo e Máximo quando o pró-labore é pago**

* **Valor Mínimo:** A legislação civil não estipula piso para remuneração societária. No entanto, o Regulamento da Previdência Social determina que o salário de contribuição de qualquer segurado (incluindo o contribuinte individual) não pode ser inferior ao salário mínimo vigente. O software deve travar o limite inferior no valor do salário mínimo de 2026, que é **R$ 1.621,00**30.  
* **Valor Máximo (Teto):** Societariamente, não há limite superior para a retirada do pró-labore se a empresa tiver caixa. Porém, no módulo previdenciário do sistema, a retenção de 11% (INSS do contribuinte individual) deve ser estancada ao atingir o teto do Regime Geral de Previdência Social (RGPS).  
* **Teto Vigente (2026):** O limite máximo previdenciário estipulado para 2026 é de **R$ 8.475,55**30.  
* **Base Legal:** Fixado pela **Portaria Interministerial MPS/MF nº 13, de 09 de janeiro de 2026**, art. 2º30.

| Variável | Competência | Valor Vigente (Portaria MPS/MF 13/2026) | Ação no Sistema (Folha de Pagamento) |
| :---- | :---- | :---- | :---- |
| **Piso** | 2026 | R$ 1.621,00 | Travar base mínima de retenção do INSS patronal e do sócio. |
| **Teto** | 2026 | R$ 8.475,55 | Limitar a alíquota de 11% retida do segurado (máx. R$ 932,31). |

### **3.5 Sócio Quotista (Não-Administrador)**

* **Resposta direta:** Não precisa receber pró-labore.  
* **Base legal:** Lei nº 8.212/1991, art. 12\. A legislação define que apenas o sócio que efetivamente presta serviços laborais à sociedade enquadra-se como segurado obrigatório (contribuinte individual). O sócio quotista, mero investidor do capital que não exerce atos de gestão ou labor diário, tem direito apenas à parcela dos lucros apurados (dividendos), não incorrendo na obrigatoriedade de remuneração por pró-labore9.

### **3.6 Efeito do mês com pró-labore zero no Fator R dos 12 meses**

* **Resposta direta:** O mês entra na matriz matemática de cálculo como zero. O mês de calendário não é desconsiderado ou suprimido da janela móvel temporal (RBT12/FS12).  
* **Observação prática e impacto sistêmico:** O sistema tributário trabalha com uma janela deslizante inexorável de 12 meses. Se em janeiro e fevereiro a empresa não pagou salários nem pró-labore, as rubricas FS12 desses meses registrarão 0,00. Enquanto isso, a receita (RBT12) continua agregando o faturamento. O resultado matemático é a compressão imediata do quociente. O Fator R tenderá a cair abaixo da barreira dos 0,28 (28%), acionando o redirecionamento sistêmico da tributação do Anexo III (alíquotas mais amenas) de volta para o Anexo V (carga tributária mais severa)3. O software contábil deve fornecer um painel de alerta preventivo (dashboard) indicando a projeção da queda do Fator R em virtude de competências zeradas.

### **3.7 Entendimento da Receita sobre pró-labore desproporcional e DDL**

* **Resposta direta:** Há altíssimo risco de desconsideração das rubricas e emissão de auto de infração se o pró-labore for artificialmente manipulado apenas para atingir a meta fiscal.  
* **Ponto Controverso (Doutrina vs. RFB e CARF):**  
  * *Posição do Contribuinte:* A legislação permite que os sócios determinem em contrato qualquer valor de pró-labore (acima do salário mínimo) e distribuam o excedente como dividendos isentos (art. 14 da LC 123/2006).  
  * *Posição da RFB e CARF (Mais Conservadora):* A fiscalização federal invoca a figura da **Distribuição Disfarçada de Lucros (DDL)** ou Remuneração Indireta (Decreto-Lei nº 1.598/1977, art. 60). A jurisprudência maciça do Conselho Administrativo de Recursos Fiscais (CARF), ratificada em julgamentos cruciais de 2025 e 2026 (e.g., Acórdão CARF nº 1301-008.010, dez/2025), consolida que a empresa não pode pagar um pró-labore ínfimo em total descompasso com o mercado (ex: pagar um salário mínimo para o sócio de uma clínica médica faturando R$ 100.000,00/mês) enquanto realiza vastas transferências bancárias sem suporte em lucro real apurado na contabilidade13.  
  * *Riscos da Autuação:* A Receita Federal reclassifica o que o contador chamou de "distribuição de lucro isento" para "remuneração do trabalho" (salário utilidade). Com isso, aplica-se a incidência do Imposto de Renda Retido na Fonte (IRRF) a uma alíquota que pode atingir 35%, além da exigência do INSS patronal e do contribuinte, cominada com multa de ofício de 75% — que salta para 150% (multa qualificada) se caracterizado dolo, simulação ou fraude nos lançamentos contábeis13.  
* **Observação para Arquitetura de Software:** Para blindar o cliente, o software deve ser parametrizado para impedir a distribuição de lucros se o balancete de verificação do mês ou ano-calendário não demonstrar lucro contábil auferido com base em escrituração regular (Livro Caixa ou Diário). Transferências efetuadas além do limite da presunção do lucro (regra geral sem contabilidade) devem ser categorizadas sistemicamente como pró-labore, sujeitando-se à tributação.

*This is for informational purposes only. For medical advice or diagnosis, consult a professional.*

#### **Referências citadas**

> 1. Cálculo do fator R na folha \- Empresário Online \- Legislação, [https://www.empresario.com.br/legislacao/edicoes/2018/0509\_calculo\_fator\_r\_folha.html](https://www.empresario.com.br/legislacao/edicoes/2018/0509_calculo_fator_r_folha.html)  
> 2. Fator R dentro do simples nacional \- Empresário Online \- Legislação, [https://www.empresario.com.br/legislacao/edicoes/2025/0601\_fator\_R\_dentro\_do\_simples.html](https://www.empresario.com.br/legislacao/edicoes/2025/0601_fator_R_dentro_do_simples.html)  
> 3. blog/fator-r-tecnologia-simples-nacional-webp \- Pigatti Contabilidade, [https://pigatti.com.br/blog/fator-r-tecnologia-simples-nacional-webp/](https://pigatti.com.br/blog/fator-r-tecnologia-simples-nacional-webp/)  
> 4. C19 \- Simples Nacional \- Cálculo do Fator R \- Base de Conhecimento, [https://ajuda.alterdata.com.br/pages/viewpage.action?pageId=148472737](https://ajuda.alterdata.com.br/pages/viewpage.action?pageId=148472737)  
> 5. CPP FATOR R \- Tributos Federais \- Portal Contábeis, [https://www.contabeis.com.br/forum/tributos-federais/401951/cpp-fator-r/](https://www.contabeis.com.br/forum/tributos-federais/401951/cpp-fator-r/)  
> 6. Solução de Consulta COSIT Nº 17 DE 18/03/2021 \- LegisWeb, [https://www.legisweb.com.br/legislacao/?id=411456](https://www.legisweb.com.br/legislacao/?id=411456)  
> 7. SOLUÇÃO DE CONSULTA COSIT Nº 17, DE 18 DE MARÇO DE 2021, [https://www.normaslegais.com.br/legislacao/solucao-de-consulta-cosit-17-2021.htm](https://www.normaslegais.com.br/legislacao/solucao-de-consulta-cosit-17-2021.htm)  
> 8. Coordenação-Geral de Tributação \- Normas \- Receita Federal, [https://normas.receita.fazenda.gov.br/sijut2consulta/anexoOutros.action?idArquivoBinario=78278](https://normas.receita.fazenda.gov.br/sijut2consulta/anexoOutros.action?idArquivoBinario=78278)  
> 9. SOLUÇÃO DE CONSULTA COSIT Nº 251, DE 04 DE SETEMBRO, [https://www.normaslegais.com.br/legislacao/solucao-de-consulta-cosit-251-2024.htm](https://www.normaslegais.com.br/legislacao/solucao-de-consulta-cosit-251-2024.htm)  
> 10. Cálculo do Fator R no Simples Nacional pelo Regime de Caixa, [https://tributodevido.com.br/portal/calculo-do-fator-r-no-simples-nacional-pelo-regime-de-caixa/](https://tributodevido.com.br/portal/calculo-do-fator-r-no-simples-nacional-pelo-regime-de-caixa/)  
> 11. Cálculo do Fator R: evite erros e maximize sua tributação \- Jettax, [https://www.jettax.com.br/blog/calculo-do-fator-r/](https://www.jettax.com.br/blog/calculo-do-fator-r/)  
> 12. Livro-Caixa para Médico: como funciona e como preencher, [https://drfinancas.com/blog/livro-caixa-para-medico/](https://drfinancas.com/blog/livro-caixa-para-medico/)  
> 13. Distribuição Disfarçada de Lucros em 2026: riscos, penalidades e, [http://hscontabil.com.br/distribuicao-disfarcada-de-lucros-em-2026-riscos-penalidades-e-como-evitar-problemas-com-a-receita/](http://hscontabil.com.br/distribuicao-disfarcada-de-lucros-em-2026-riscos-penalidades-e-como-evitar-problemas-com-a-receita/)  
> 14. Resolução CGSN Nº 140 DE 22/05/2018 \- Federal \- LegisWeb, [https://www.legisweb.com.br/noticia/?legislacao=360430](https://www.legisweb.com.br/noticia/?legislacao=360430)  
> 15. resolução cgsn nº 140, de 22.05.2018 \- Leis e Normas, [https://legismap.com.br/leis-e-normas/resolucao-cgsn-n-140-de-22-05-2018](https://legismap.com.br/leis-e-normas/resolucao-cgsn-n-140-de-22-05-2018)  
> 16. RESOLUÇÃO CGSNššš 190/2026: PRINCIPAIS MUDANÇAS NO, [http://idealsoftwares.com.br/tabelas/tabela.php?id=1608](http://idealsoftwares.com.br/tabelas/tabela.php?id=1608)  
> 17. Simples Nacional \- Rotina Fiscal, [https://www.rotinafiscal.com.br/tributos-e-declaracoes/federal/simples-nacional](https://www.rotinafiscal.com.br/tributos-e-declaracoes/federal/simples-nacional)  
> 18. Boa tarde, uma empresa do Simples Nacional com fator "r" pode, [https://www.comunidadecontabilbrasil.com/previdenciario/post/boa-tarde-uma-empresa-do-simples-nacional-com-fator-r-pode-utilizar-o-qUW9pD5x2OyvYrl](https://www.comunidadecontabilbrasil.com/previdenciario/post/boa-tarde-uma-empresa-do-simples-nacional-com-fator-r-pode-utilizar-o-qUW9pD5x2OyvYrl)  
> 19. Simples Nacional: Guia Completo e Prático | PDF | Setor terciário da, [https://pt.scribd.com/document/958159400/78237a19b2009057c7ac33c18cd1b5504048215911102e0f78bd7f2e4e3292aecb58857ab16f0022585488e6d278656dd747d7ae41098d308b821152d9af9db8-2](https://pt.scribd.com/document/958159400/78237a19b2009057c7ac33c18cd1b5504048215911102e0f78bd7f2e4e3292aecb58857ab16f0022585488e6d278656dd747d7ae41098d308b821152d9af9db8-2)  
> 20. Resolução CGSN nº 190, de 4 de agosto de 2026 \- DOU \- Imprensa, [https://www.reformatributaria.com/wp-content/uploads/2026/08/Resolucao-CGSN-no-190-de-4-de-agosto-de-2026-Resolucao-CGSN-no-190-de-4-de-agosto-de-2026-DOU-Imprensa-Nacional.pdf](https://www.reformatributaria.com/wp-content/uploads/2026/08/Resolucao-CGSN-no-190-de-4-de-agosto-de-2026-Resolucao-CGSN-no-190-de-4-de-agosto-de-2026-DOU-Imprensa-Nacional.pdf)  
> 21. Atualizações no Departamento Pessoal 2024 | PDF \- Scribd, [https://pt.scribd.com/document/732497432/Apostila-Curso-Departamento-Pessoal-Na-Pratica-15-05-2024](https://pt.scribd.com/document/732497432/Apostila-Curso-Departamento-Pessoal-Na-Pratica-15-05-2024)  
> 22. Pro Labore aos Sócios: Obrigatório ou Facultativo? \- Turivius, [https://turivius.com/portal/o-pagamento-de-pro-labore-aos-socios-e-obrigatorio/](https://turivius.com/portal/o-pagamento-de-pro-labore-aos-socios-e-obrigatorio/)  
> 23. Pró-labore ideal: quanto retirar para pagar menos imposto \- Hopecont, [https://hopecont.com/blog/pro-labore-ideal-quanto-retirar/](https://hopecont.com/blog/pro-labore-ideal-quanto-retirar/)  
> 24. \~ ait:-i•1 \- BRTransparencia, [https://api.brtransparencia.com.br/storage/EF1662F7-9A2A-4FDB-ABAD-346211F97734/materia/db049585-b337-4e8f-975b-ddbce310dcb3.pdf](https://api.brtransparencia.com.br/storage/EF1662F7-9A2A-4FDB-ABAD-346211F97734/materia/db049585-b337-4e8f-975b-ddbce310dcb3.pdf)  
> 25. MANUAL DE ORIENTAÇÃO DO ESOCIAL – VERSÃO, [https://www.gov.br/esocial/pt-br/documentacao-tecnica/manuais/mos-s-1-1-consolidada-ate-a-no-s-1-1-03-2023.pdf](https://www.gov.br/esocial/pt-br/documentacao-tecnica/manuais/mos-s-1-1-consolidada-ate-a-no-s-1-1-03-2023.pdf)  
> 26. DCTFWeb \- Sercom Engenharia de Software, [http://esof.com.br/hlp/dec-dctf.htm](http://esof.com.br/hlp/dec-dctf.htm)  
> 27. Legislao \- Empresário Online, [https://www.empresario.com.br/legislacao/edicoes/2024/3001\_entrega\_da\_DCTFWEB\_txt.html](https://www.empresario.com.br/legislacao/edicoes/2024/3001_entrega_da_DCTFWEB_txt.html)  
> 28. Instrução Normativa RFB nº 2237, de 4 de dezembro de 2024, [https://www.fiscoscan.com.br/norma/in-rfb-2237-2024](https://www.fiscoscan.com.br/norma/in-rfb-2237-2024)  
> 29. IN RFB 2005 / 2021 \- DCTF X DCTFWEB \- INSTRUÇÃO, [https://contabilplay.com.br/dctfweb/in-rfb-2005-2021-dctf-x-dctfweb-instrucao-normativa-oficial/](https://contabilplay.com.br/dctfweb/in-rfb-2005-2021-dctf-x-dctfweb-instrucao-normativa-oficial/)  
> 30. Portaria Interministerial MPS/MF nº 13/2026 atualizou os valores do, [https://hgc.adv.br/2026/01/19/portaria-interministerial-mps-mf-no-13-2026-atualizou-os-valores-do-regime-geral-de-previdencia-social-para-2026/](https://hgc.adv.br/2026/01/19/portaria-interministerial-mps-mf-no-13-2026-atualizou-os-valores-do-regime-geral-de-previdencia-social-para-2026/)  
> 31. Portaria Interministerial MPS/MF Nº 13 DE 09/01/2026 \- LegisWeb, [https://www.legisweb.com.br/legislacao/?id=489284](https://www.legisweb.com.br/legislacao/?id=489284)  
> 32. Portaria Interministerial MPS/MF nº 13, de 9 de janeiro de 2026, [https://www.gov.br/previdencia/pt-br/assuntos/rpps/documentos/PortariaInterministerialMPSMF13de9dejaneirode2026.pdf](https://www.gov.br/previdencia/pt-br/assuntos/rpps/documentos/PortariaInterministerialMPSMF13de9dejaneirode2026.pdf)  
> 33. Distribuição Disfarçada de Lucros: O que é quais cuidados tomar, [https://tactus.com.br/distribuicao-disfarcada-de-lucros/](https://tactus.com.br/distribuicao-disfarcada-de-lucros/)  
> 34. Imposto para YouTubers, Streamers e OnlyFans: Como Formalizar, [https://section.com.br/conteudo/imposto-youtubers-criadores-de-conteudo](https://section.com.br/conteudo/imposto-youtubers-criadores-de-conteudo)  
> 35. Análise do Parecer CARF 1301-008010: Remuneração Indireta, [https://piraciadv.blog/2026/06/21/parecer-sobre-distribuicao-disfarcada-de-lucros-decisao-carf-de-dez-2025-antes-da-lei-15-270-2025/](https://piraciadv.blog/2026/06/21/parecer-sobre-distribuicao-disfarcada-de-lucros-decisao-carf-de-dez-2025-antes-da-lei-15-270-2025/)  
> 36. Distribuição Disfarçada de Lucros: O que o setor de loteamento, [https://www.contabeis.com.br/artigos/76103/distribuicao-disfarcada-de-lucros-o-que-o-setor-de-loteamento-precisa-saber/](https://www.contabeis.com.br/artigos/76103/distribuicao-disfarcada-de-lucros-o-que-o-setor-de-loteamento-precisa-saber/)











---

## AS 11 FÓRMULAS, lidas do PDF em 13/09

No `.md` elas vieram como base64 e eram ilegíveis. O Pedro exportou em PDF
(`~/Downloads/Pesquisa Fiscal Simples Nacional.pdf`, 12 páginas, 36.900 chars de
texto + 11 imagens nas páginas 5, 6 e 7). As imagens foram extraídas e lidas uma
a uma. Transcrição literal:

| # | Onde | Fórmula |
|---|---|---|
| 1 | §2.2a · 1º mês | `RBT12 = Receita Bruta do Mês de Apuração × 12` |
| 2 | §2.2b · meses 2 a 12 | `RBT12 = (Soma da Receita Bruta de todos os meses anteriores ÷ Número de meses anteriores) × 12` |
| 3 | §2.2c · mês 13+ | `RBT12 = Soma da Receita Bruta dos 12 meses imediatamente anteriores` |
| 4 | §2.3 · alíquota | `Alíquota Efetiva = [(RBT12 × Alíquota Nominal) − Parcela a Deduzir] ÷ RBT12` |
| 5 | §2.4 · **A CHAVE** | `FS12 = Média da folha anterior × 12` |
| 6 | §2.5 | símbolo `×` |
| 7 | §2.5 | símbolo `÷` |
| 8 | §2.5 passo 4 | `Alíquota Efetiva = [(120.000,00 × 0,1550) − 0,00] ÷ 120.000,00` |
| 9 | §2.5 passo 4 | `Alíquota Efetiva = 18.600,00 ÷ 120.000,00 = 0,1550 ou 15,50%` |
| 10 | §2.5 passo 5 | `DAS Devido = Receita de Setembro/2026 × Alíquota Efetiva` |
| 11 | §2.5 passo 5 | `DAS Devido = 10.000,00 × 0,1550 = R$ 1.550,00` |

🔑 **A fórmula 5 é a que confirma o §2.4 por escrito**, e é o espelho exato da 2:
a folha usa MÉDIA DOS MESES ANTERIORES × 12, igual à receita. Era o achado que
tinha chegado só como prosa.

⚠️ **A fórmula 2 crava que o mês corrente NÃO entra na média** — só o histórico
fechado dos meses anteriores. Vale para a receita e, por espelho, para a folha.

⚠️ **A fórmula 4 confirma que na 1ª faixa (PD = 0) a alíquota efetiva é IDÊNTICA
à nominal.** É o que derruba o mecanismo que eu tinha proposto para explicar o
5,99987% observado na plataforma do líder: proporcionalização não produz aquela
diferença.
