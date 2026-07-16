---
tipo: artefato-concorrente
concorrente: contabilizei
artefato: funil-abertura
data: 2026-07-16
status: capturado-completo
fonte: prints do Pedro, percurso real no site (plano Padrão R$195)
tags: [concorrente, funil, onboarding, cobranca, pricing, ux]
---

# 🔍 Funil de abertura da Contabilizei — da LP até o pagamento

> **Captura COMPLETA (LP → pagamento).** Percurso real feito pelo Pedro em 2026-07-16, entrando pelo CTA "Contratar" do plano **Padrão R$195**. Responde: **em que tela o concorrente cobra**, e quanto dado ele coleta antes. Alimenta a reordenação do nosso flow → [[mapa-telas-mobile]] · [[blocos-fluxo-abertura]] · [[plano-padrao-195-referencia]].
>
> ## ⚡ Resposta em uma linha
> **Planos → 3 campos → 2 campos → cartão.** O funil inteiro tem **3 telas** e cobra com **nome, e-mail, celular, categoria de atividade, endereço e CPF**. Nada mais. **Zero validação de elegibilidade antes do dinheiro.**

## Passo 0 — Página de planos (ponto de entrada)

**O preço é a PRIMEIRA coisa.** Zero telas de esforço antes de ver valor. O funil começa numa tabela de 3 planos:

| Plano | Âncora (riscada) | Preço | Pitch | Badge |
|---|---|---|---|---|
| **Padrão** | R$280 | **R$195/mês** | "Você emite suas notas e paga seus impostos em nossa plataforma online." | — |
| **Multibenefícios** | R$320 | **R$225/mês** | "Pacote de benefícios exclusivos no plano." | MELHOR CUSTO-BENEFÍCIO |
| **Experts Essencial** | R$515 | **R$395/mês** | "Ideal para quem precisa de apoio nas rotinas de contabilidade." | ATENDIMENTO DEDICADO |

- **🆕 "Certificado digital incluso no plano"** aparece como subtítulo do **Padrão**. Confrontar com [[plano-padrao-195-referencia]] (nosso doc de escopo do R$195).
- Todos os preços usam **âncora riscada** ("a partir de R$280" → R$195). Desconto permanente como default.
- Tabela comparativa por baixo (primeira linha: "Contabilidade completa" ✅ nos 3).
- Barra fixa no rodapé: "Fale com um especialista" + widget de chat. **Saída humana sempre visível.**
- Nav topo: Serviços · Planos · Conteúdos · Como funciona · Dúvidas? · Login · CTA "Abra sua empresa".

## Tela 1/3 — Dados pessoais

Header **"Abrir empresa"** + barra de progresso **1/3**.

| Campo | Tipo | Observação |
|---|---|---|
| Nome completo | input | Valida 2 palavras: *"Informe seu nome e sobrenome."* (erro inline, vermelho) |
| E-mail | input | — |
| Celular | input | — |

- CTA **"Avançar"** desabilitado até preencher.
- Painel lateral: *"Boas-vindas! Sua empresa começa aqui."* + *"Agora, vamos começar a etapa de cadastro para iniciarmos a abertura da sua empresa."* + ilustração.
- **3 campos. Só isso.** Nenhuma senha, nenhum CPF.

## Tela 2/3 — Dados da empresa

**"Sua empresa"** — *"Precisamos saber um pouco mais sobre como será sua empresa."*

### Campo "Qual atividade você vai exercer?" — dropdown FECHADO de 13 opções

`PJ em uma empresa` · `Serviços de TI` · `Serviços Administrativos` · `Comércio` · `Medicina` · `Psicologia e outros saúde` · `Marketing / Publicidade` · `Engenharia / Arquitetura` · `Educação / Cursos` · `Advocacia` · `Consultoria` · `Representação Comercial` · `Minha atividade não está na lista`

> 🔥 **Achado central:** **não existe gate de CNAE.** A atividade é uma **categoria grosseira escolhida num dropdown de 13**. Nenhuma entrevista, nenhuma desambiguação, nenhum código CNAE, nenhum veredito. O nosso T4 inteiro não tem equivalente aqui.

### Campo CEP

- *"CEP do endereço de registro da empresa"* + hint: *"A maioria das prefeituras aceita o uso de endereço residencial. Você poderá alterá-lo futuramente"*
- Link de escape: **"Não sei o CEP"**

### Upsell de endereço (revelado após o CEP)

*"Deseja abrir sua empresa utilizando um endereço particular ou o endereço do **Escritório Virtual** da Contabilizei em Curitiba?"*

| Opção | Conteúdo |
|---|---|
| **Escritório Virtual da Contabilizei** | Vantagens: abertura mais rápida · endereço particular protegido · economia nos custos de abertura. **R$60/mês — cobrado a partir da segunda parcela do plano de contabilidade** |
| **Meu endereço particular** | "Endereço particular como sede da empresa." |

> ✅ **Confirma nosso benchmark de endereço fiscal: R$60/mês** (estava 🟡 estimado em [[spec-telas-entrada-b1-b2]] T9 e [[spec-telas-b3-b4-aterrissagem]]). Agora tem **fonte e print**. Mecânica: **cobrado a partir da 2ª parcela**, não na 1ª.
>
> ✅ **Confirma a nossa decisão de upsell de endereço no meio do wizard** (nosso T9), com injeção no plano — mesma jogada.

- "Precisa de ajuda? **Fale com a gente no Whatsapp**" — rodapé de toda tela do wizard.

### Endereço particular escolhido → revela form completo

Rua (auto do CEP) · Número · Complemento · Bairro · Cidade · **Estado (travado, cinza)**. Só então o "Avançar" acende.

## Tela 3/3 — Pagamento

Barra **3/3 - Pagamento**. É a terceira tela. **É aqui que cobram.**

| Elemento | Conteúdo |
|---|---|
| **CPF** | *"Informe seu CPF para prosseguir com o pagamento"* — **enquadrado como requisito do PAGAMENTO, não como validação de elegibilidade** |
| Método | ⦿ **Cartão de crédito** (default) · ○ Boleto bancário/Pix |
| **Incentivo do cartão** | Badge laranja **"Acelere seu processo!"** + *"Antecipe em até 3 dias a emissão do seu CNPJ pagando com cartão de crédito."* |
| Campos do cartão | Número · Nome · Validade · CVC |
| Toggle | *"Salvar este cartão para as demais mensalidades"* — **ligado por default** |
| Painel "Sua escolha" | PLANO PADRÃO — **R$ 195,00/mês** |
| Cupom | *"Possui um cupom de desconto?"* + código + Ativar |
| **Resumo** | **Total a pagar: R$ 195** |
| **Aceite** | *"Ao clicar em Finalizar, você está declarando que leu e concordou com nosso **Contrato de Prestação de Serviços** e com o **Plano Contratado**"* — **texto cinza, SEM checkbox** |
| CTA | "Finalizar Pagamento" |

---

## 🔎 Leitura

### 1. Cobram na 3ª tela, com 6 campos e zero validação
Nome, e-mail, celular, categoria (dropdown de 13), endereço, CPF. **Nenhum RG, estado civil, sócio, capital social, faturamento, GOV.BR.**

### 2. 🔥 Nenhum dos campos pré-pagamento valida elegibilidade
- **Categoria de atividade** = filtro grosseiro com escape hatch (*"Minha atividade não está na lista"*). Não vira CNAE, não dá veredito.
- **CEP** ≠ validador. O hint diz *"**A maioria** das prefeituras aceita o uso de endereço residencial. Você poderá alterá-lo futuramente"* — isso é **disclaimer**, o oposto de validação. Empurra o risco pro cliente e avisa nas entrelinhas que pode dar errado.
- **CPF** = requisito de gateway/antifraude, pela própria copy (*"para prosseguir com o pagamento"*). Não é consulta de situação cadastral exposta ao usuário.

> **Eles cobram sem garantir que a empresa pode ser aberta.** O risco de elegibilidade é transferido pro pós-pagamento e absorvido pelo **atendimento humano** — que é exatamente por que o WhatsApp está no rodapé de toda tela. **O humano é o plano B do funil.**

### 3. 🔥 Total a pagar = R$195. A taxa de governo NÃO aparece
Nenhuma menção a DAE da JUCEMG (nosso motor usa ~R$268,51) nem a taxa de registro. O checkout mostra só a mensalidade.
- **Pergunta aberta (não dá pra responder pelo print):** eles **absorvem** a taxa de governo (compra de cliente com prejuízo no mês 1, recupera no LTV) ou **cobram depois**?
- **Impacto direto no nosso preço:** se absorvem, o unit economics deles embute ~R$268 de CAC que o nosso R$195 de benchmark **não** cobre. Isso muda a leitura do R$195 como régua → [[legalize-preco-deferido-custo-real]] · [[plano-padrao-195-referencia]].
- Nosso **UX-33 ("conta da abertura", 3 baldes: grátis × governo × recorrente)** não tem equivalente aqui. É invenção nossa, e é mais honesta.

### 4. 🔥 Aceite de contrato é IMPLÍCITO, sem checkbox
*"Ao clicar em Finalizar, você está declarando que leu e concordou..."* em texto cinza acima do botão. **Não existe tela de aceite, termo irreversível nem política de cancelamento exibida.** Nosso T18 inteiro não tem contraparte.
- ⚠️ **Não copiar.** É clickwrap fraco. Nossa política de cancelamento em 4 camadas (CDC art.49 + exceção de serviço iniciado) exige aceite explícito. Ser melhor aqui é barato.

### 5. ✅ "Acelere seu processo" — copiar o enquadramento
O incentivo pro cartão é **velocidade** (*"antecipe em até 3 dias a emissão do seu CNPJ"*), não desconto. Nossa spec hoje diz "boleto fora do happy path" — mesma mecânica, enquadramento negativo. **O deles é melhor.**

### 6. Outros
- **Preço é o ponto de PARTIDA**, não o de chegada. Âncora riscada em todos os planos (desconto permanente como default).
- **Toggle "salvar cartão" ligado por default.**
- **Cupom de desconto** no checkout (não temos na spec).
- **Barra 1/3 · 2/3 · 3/3** — wizard curto e honesto sobre o tamanho. O nosso tem ~20 passos.
- **Zero inteligência antes da cobrança** — confirma a hipótese: o funil deles cobra cedo **porque não há o que demonstrar**. O produto é commodity; o argumento é preço + marca.

## Links
- [[plano-padrao-195-referencia]] · [[contabilizei]] · [[mapa-telas-mobile]] · [[blocos-fluxo-abertura]] · [[spec-telas-b3-b4-aterrissagem]] · [[HOME]]
