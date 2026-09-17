---
tipo: fato
status: vivo
dominio: produto
data: 2026-09-14
assunto: persona-zero
tags: [produto, persona-zero, evidencia, defis, informe-rendimentos, dark-pattern, sensivel]
---

# 📅 Declaração Anual e Informe de Rendimentos

> 🔒 **DADO PESSOAL EM CLARO.** Mesmas regras de [[constituicao]].

**Fonte:** abas *Declaração Anual* e *Informe de Rendimentos* da conta logada, 14/09/2026. Recibos baixados e lidos 100%.

---

## 1 · 📄 DEFIS 2025 — 19 dias de empresa geram uma obrigação anual inteira

Recibo de entrega, lido integralmente:

| | |
|---|---|
| Declaração | **DEFIS** — Informações Socioeconômicas e Fiscais |
| Exercício / Ano-calendário | **2026 / 2025** |
| **Período abrangido** | **01/01/2025 a 31/12/2025** |
| Tipo | Declaração **Original** |
| **Regime de Apuração** | **competência** |
| **Transmissão** | **08/02/2026 00:05:03** |
| Nº do Recibo | 02.07.26039.0000182-9 |

🔑 **A empresa nasceu em 12/12/2025 e mesmo assim declarou o ano-calendário 2025 inteiro.** Dezenove dias de existência produzem uma DEFIS completa, com prazo (31/03) e multa por atraso. **Para todo cliente nosso que abrir empresa em novembro ou dezembro, a primeira obrigação anual cai poucas semanas depois** — e ele ainda nem entendeu o que é DAS.

⚠️ **A DEFIS não está em nenhuma das nossas 8 categorias.** Já tinha aparecido na leitura da tela em 13/09; agora tem recibo, data e prazo.

✅ **`Regime de Apuração: competência`** — confirma no documento oficial o que já tínhamos travado em 12/09: a competência de uma nota é a **data de emissão**, não o mês do serviço.

🔑 **Transmitida às 00:05 do dia 08/02** — 51 dias antes do prazo, de madrugada, no mesmo padrão de lote automático das mensais.

---

## 2 · 💵 Informe de Rendimentos 2025 — a terceira prova dos R$100

Comprovante de Rendimentos Pagos e de IRRF, ano-calendário **2025**:

| Campo | Valor |
|---|---:|
| **Total dos rendimentos (inclusive férias)** | **R$ 100,00** |
| **Contribuição previdenciária oficial** | **R$ 11,00** |
| Imposto sobre a renda retido na fonte | R$ 0,00 |
| **Natureza do rendimento** | **"Rendimentos do trabalho assalariado"** |
| Linha 4.6 — *"Valores pagos ao titular ou sócio da ME/EPP, exceto pró-labore, aluguéis ou serviços prestados"* (**distribuição de lucro isenta**) | **R$ 0,00** |

✅ **Terceira fonte independente confirmando o pró-labore de R$100,00 em 2025** — depois da DCTFWeb e da aritmética do acumulado de 28%. O número está fechado.

🔑 **Dois achados de modelagem:**
1. O pró-labore do sócio é declarado como **"rendimentos do trabalho assalariado"** no informe — não tem natureza própria.
2. A **linha 4.6 é onde a distribuição de lucro aparece** no IRPF do sócio, como rendimento **isento**. Em 2025 foi zero. É o campo que o nosso produto precisa alimentar quando desenhar distribuição de lucro.

⚠️ **O Informe é obrigação ANUAL da empresa para o sócio**, e também não está em nenhuma das 8 categorias. Sem ele, o sócio não declara o IRPF dele.

---

## 3 · 🔴🔴 O LÍDER TEM A TRAVA DE DISTRIBUIÇÃO DE LUCRO CONSTRUÍDA — e o Pedro já tinha proibido isso

> ⚠️ **CORREÇÃO (Pedro, 14/09).** Eu tinha escrito que *"a aba está bloqueada"*. **Não está.** Ela abre e funciona: seleciona-se o sócio no dropdown e clica-se em *Pré-visualizar*. Os textos abaixo são **modais escondidos no DOM**, que eu li como se fossem estado de tela — **4ª vez neste estudo** que confundo o que o DOM contém com o que a tela mostra. Confirmado por duas vias: o fluxo funcionou na prática, e `RESOLUCAO_DEBITOS_IMPOSTOS_2025 = NENHUM:NAO_POSSUI_IMPOSTOS_DEVIDOS` na API de parâmetros ([[2026-09-14-api-relatorios-endpoints]] §3).
>
> 🔑 **O achado sobrevive à correção, e fica melhor:** o código da trava **existe e está embarcado**, pronto para disparar quando houver pendência. O que muda é a etiqueta — não é *"o líder travou o Pedro"*, é *"o líder tem a trava construída e a dispara por condição"*. A leitura de produto do §3 vale inteira; o que não vale é dizer que ela estava ativa nesta conta.

O Informe, na conta real, **abre normalmente**. O que segue são os textos literais dos modais de bloqueio que vivem na mesma tela, prontos para aparecer quando a condição bater:

> *"**Seu Informe de Rendimentos está indisponível.** Para ter acesso ao seu informe você precisa finalizar o processo de regularização de pendências que você iniciou anteriormente."*

> *"Verificamos que você ainda possui **pendências documentais** referentes ao exercício anterior. […] Caso opte por 'Não regularizar pendência', **NÃO HAVERÁ DISTRIBUIÇÃO DE LUCROS**."*

> *"**Identificamos débitos federais que devem ser regularizados.** […] sua empresa está sujeita a fiscalização da Receita Federal, por isso sugerimos que regularize os débitos de 2023 ou anteriores."*

### 🔑 Isto fecha um arco nosso, e o Pedro venceu duas vezes

Em **13/09** eu tinha desenhado a distribuição de lucro como **porta travada por débito federal**. O Pedro derrubou:

> *"não é nosso papel regular como é usado esse faturamento, temos apenas que fazer nossa parte de cálculos e guias corretas nas datas corretas"*

E na mesma rodada, a pesquisa externa **recomendou o mesmo erro meu** (*"parametrizar o software para impedir"*). Agora sabemos de onde vinha o desenho: **é literalmente o comportamento do líder.**

🏢 **Etiqueta: DECISÃO DELES.** Não é obrigação legal — é escolha de produto. E a trava do Pedro venceu a recomendação técnica **e** o benchmark do líder. Fica registrado que a doutrina *"INFORMAR, NUNCA TUTELAR"* tem agora um contraexemplo nomeado.

### 🐛 E a escada de bloqueio vai mais fundo do que eu imaginava

> *"**Seu período contábil já foi fechado.** Para regularizar as pendências documentais é necessário que você **contrate o serviço de reabertura do balanço**. Esse serviço gera uma cobrança de **R$ .** Deseja contratar o serviço?"*

A sequência completa:

1. O cliente quer o **Informe de Rendimentos** (documento que ele precisa para o IRPF **dele**, pessoa física)
2. O documento está **retido** por pendência documental
3. Para regularizar, precisa reabrir o período contábil
4. Reabrir o período **é serviço pago**
5. 🐛 E o **valor aparece em branco** — `"cobrança de R$ ."` — mais um merge tag quebrado em produção, o terceiro que encontro

🔴 **Reter documento fiscal pessoal do sócio como alavanca de cobrança é mais grave que travar o lucro.** O Informe não é um relatório de conveniência: sem ele o sócio não declara o próprio imposto de renda. 🔑 Para nós, vira regra: **documento que o órgão obriga a empresa a entregar ao sócio nunca fica atrás de pendência comercial.**

---

## 4 · 📋 O Termo de Ciência amarra lucro à EFD-Reinf com prazo do dia 15

Texto literal, na mesma tela:

> *"te orientamos sobre a necessidade de fornecer informações completas e precisas sobre as movimentações financeiras da sua empresa **até o dia 15 de cada mês**."*

> *"Enquanto o aceite referente ao termo não for concedido, os **adiantamentos/retiradas de lucros não serão considerados na entrega da EFD-Reinf**. A inclusão dos lucros após o prazo final da entrega da obrigação acarretará **multa, a qual será de responsabilidade do cliente**."*

🔑 **Amarra três coisas que estavam soltas no nosso mapa:**
- **Dia 15** é o prazo real de entrada da movimentação financeira, não o dia 20 do DAS
- **A distribuição de lucro passa pela EFD-Reinf** — confirma o achado de 10/09 sobre a Lei 15.270/2025, e explica por que a Reinf apareceu na DCTFWeb de 01/2026
- **A multa por lucro declarado fora do prazo é do cliente**, por contrato

⚠️ Este termo já tinha sido lido em 10/09 ([[2026-09-10-contabilizei-aceites-LITERAL]] §2). O que é novo é **vê-lo funcionando como gate**, ligado ao bloqueio do Informe.

## Links
[[constituicao]] · [[acionaveis]] · [[2026-09-14-declaracoes-mensais-serie-completa]] · [[2026-09-14-api-relatorios-endpoints]] · [[legalize-trava-persona-produto]] · [[legalize-lucro-2026-e-carta-cfc]] · [[HOME]]
