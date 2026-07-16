---
tipo: fato
status: vivo
data: 2026-07-16
concorrente: contabilizei
artefato: pos-pagamento-operacao
fonte: portal de solicitações (Zendesk) + 4 tickets + 5 anexos oficiais + cruzamento com os e-mails capturados (dez/2025 a jan/2026)
tags: [concorrente, operacao, pos-pagamento, abertura, prazos, taxas, certificado, ux, cronologia]
---

# 🔬 Contabilizei pós-pagamento — a operação real, dia a dia (caso Pedro)

> **Continuação de [[2026-07-16-funil-abertura-ate-pagamento]].** O funil acaba no cartão; esta nota mostra **o que acontece depois**. O Pedro abriu o próprio CNPJ pela Contabilizei em **dez/2025** e recuperou tickets + anexos oficiais. Cruzado com [[emails-onboarding]] · [[emails-acesso-seguranca]] · [[emails-cobranca]] · [[emails-fiscal-operacional]] · [[emails-suporte]].
>
> **Não é teardown de fora: é o caso real, com datas, valores e documentos oficiais.**
>
> 🔒 CPF do titular omitido. CNPJ e alvará são dados públicos.

## ⚡ Resumo em três números
- **2 dias** do pagamento ao CNPJ + Simples deferido.
- **23 dias** até a abertura estar de fato completa (dispensas emitidas).
- **40 dias** até a taxa da prefeitura aparecer — **com 4 dias pra pagar e correção monetária já embutida**.

---

## 🗓️ Cronologia completa

| Data | O que aconteceu | Canal | Evidência |
|---|---|---|---|
| **10/12** 16:24 | **Pagamento** · "[Contabilizei] Pagamento disponível" | e-mail | [[emails-cobranca]] |
| **10/12** | Ticket **#26968878 "Seja bem-vindo — Próximos passos"**: pede **Razão Social, Capital Social, Natureza e Enquadramento** + IPTU, RG/CNH, carteira profissional. Manda entrar via **"Esqueci minha senha"** | Zendesk | print |
| **10/12** | "Compartilhar seu feedback conosco" (**pesquisa de satisfação no mesmo dia do ticket**) | e-mail | [[emails-suporte]] |
| **10/12** | 🔴 **"Redefinir de senha" (1ª)** | e-mail | [[emails-acesso-seguranca]] |
| **11/12** | "[Abertura] Criação da sua assinatura digital" · "[Abertura] Sua empresa está sendo criada" | e-mail | [[emails-onboarding]] |
| **11/12** | 🔴 **"Redefinir de senha" ×5 no mesmo dia** | e-mail | [[emails-acesso-seguranca]] |
| **12/12** | "[Abertura] Hora de assinar os documentos da sua empresa" | e-mail | [[emails-onboarding]] |
| **12/12** | 🔴 **"Redefinir de senha" ×2** | e-mail | [[emails-acesso-seguranca]] |
| **12/12** | ✅ **CNPJ 64.037.271/0001-02 registrado** · **Simples Nacional deferido** · IM registrada | — | Ficha IM + ticket |
| **15/12** 08:10 | Ticket **#26994688 "[BR-BH] Etapa Prefeitura"**: IM emitida · **"desabilite o 2FA do gov.br"** · TFLF "em até 90 dias" · voucher do certificado sob demanda | Zendesk | print |
| **15/12** | ✅ **Alvará de Localização e Funcionamento nº 2025098844** — "Alvará **imediato**", validade 15/12/2030 | — | DML (PDF) |
| **17/12** 09:01 | Ticket da prefeitura encerrado | Zendesk | print |
| **17/12 → 02/01** | 🔴 **16 dias de silêncio operacional** | — | — |
| **23/12** | 🔴 **Upsell no meio do silêncio:** "Link de pagamento liberado: use o **Cobre Seu Cliente** agora mesmo" | e-mail | [[emails-cobranca]] |
| **02/01** 14:31 | Ticket **#27126269 "Emissão Dispensas — finalizado"** | Zendesk | print |
| **02/01** | ✅ **Dispensa de Licenciamento Sanitário** (Secretaria Municipal de Saúde, art. 19 Lei 7031/96) | — | PDF |
| **02/01** 14:30 | ✅ **Dispensa Corpo de Bombeiros** — REDESIMPLES `MGL2506942520` · **é AUTODECLARAÇÃO** | — | PDF |
| **08/01** | 1ª fatura recorrente ("Sua fatura já está disponível") — **29 dias depois do 1º pagamento** | e-mail | [[emails-cobranca]] |
| **12/01** | "Sua mensalidade vence em 3 dias!" | e-mail | [[emails-cobranca]] |
| **15/01** | ✅ Confirmação de pagamento (2ª mensalidade) | e-mail | [[emails-cobranca]] |
| **17/01** | "O imposto DARF Unificado vence em 3 dias" | e-mail | [[emails-fiscal-operacional]] |
| **19/01** 11:58 | Ticket **#27282421 "VOCÊ POSSUI TAXA(S) DO MUNICÍPIO A VENCER"** + 3 e-mails de imposto no mesmo dia | Zendesk | print |
| **19/01** | 🔴 **TFLF emitida: R$161,36 + R$7,12 de correção = R$168,48. Vence 23/01 (4 dias). Referência: 12/2025** | — | TFE.pdf |
| **20/01** | "O imposto TAXA DE FISCALIZAÇÃO DE ESTABELECIMENTOS vence em 3 dias" | e-mail | [[emails-fiscal-operacional]] |
| **21/01** 12:02 | Ticket da taxa encerrado | Zendesk | print |

---

## 🖥️ O "portal" de acompanhamento é um Zendesk

Tela **"Minhas solicitações"**: help desk genérico (*Solicitações · Contribuições · Seguindo*). **Quatro tickets** cobrem a abertura inteira. Não há timeline, etapa, estado nem previsão. **O cliente acompanha a abertura da própria empresa lendo ticket de suporte.**

> 🎯 Nosso **T20** (9 etapas, 4 estados, previsão, WhatsApp proativo) não é "melhor que o deles" — **é uma categoria que eles não têm**.

---

## 🔥 Os sete achados

### 1. 🔴 O onboarding não cria senha, e há prova de dano
O e-mail de boas-vindas manda, por escrito: *"Se não tiver senha, vá em **'Esqueci minha senha'**"*. O resultado está em [[emails-acesso-seguranca]]:

> **8 e-mails de "Redefinir de senha" entre 10 e 12/12** (1 no dia 10, **5 no dia 11**, 2 no dia 12).

O cliente pagou R$195 e passou três dias tentando entrar. **Não é erro do usuário: é o fluxo oficial funcionando como desenhado.** O arquivo de e-mails já marcava isso como "evidência de fricção de UX" — agora sabemos a **causa**, e ela está escrita no e-mail padrão da empresa.

*(Corrigiram depois: a partir de jun/2026 os e-mails viram "Seu código de acesso à plataforma chegou!" — migraram pra OTP.)*

### 2. 🔴 A taxa chega em 40 dias, com 4 dias pra pagar e correção que não é culpa do cliente
**TFLF (Taxa de Fiscalização de Localização e Funcionamento) — PBH:**

| Item | Valor |
|---|---|
| Valor lançado | **R$ 161,36** |
| Correção monetária | **R$ 7,12** |
| **Total** | **R$ 168,48** |
| Referência | **12/2025** |
| Emissão | **19/01/2026** |
| **Vencimento** | **23/01/2026** (**4 dias**) |
| Base de cálculo | atividade `731900400` · área **5 m²** · faixa "0 a 50" |

**A taxa nasceu com 4,4% de correção monetária** porque o fato gerador é 12/2025 e a prefeitura só lançou em 19/01. **O cliente paga correção de um atraso que não foi dele.** E teve 4 dias pra pagar, avisado no mesmo dia da emissão.

Ainda: *"Você poderá receber as taxas do município enviadas pela prefeitura **ao endereço da sua empresa**"* — que aqui é a casa do cliente. Boleto de papel, na residência.
E: *"apenas **confirme o pagamento através da plataforma**, para que o mesmo seja atualizado no sistema"* — **o cliente confirma manualmente; eles não sabem se ele pagou.**
Com ameaça: *"pode levar a **cassação da sua licença e inscrição municipal**, bem como o cadastramento em **dívida ativa**"*.

> ✅ **Fecha a pergunta da nota do funil:** eles **não absorvem** a taxa. Empurram, sem citar no checkout. 🟡 Falta saber da **DAE da JUCEMG** (estadual — outra taxa).

### 3. 🔴 Pedem pro cliente desabilitar o 2FA do gov.br
> *"é imprescindível que **desabilite a verificação em duas etapas através do gov.br!**"*

Por escrito, em e-mail operacional padrão. A conta que dá acesso a Receita, INSS, CNH, título. A automação deles não lida com 2FA, então a solução é o cliente baixar a própria segurança.

> 🎯 Nosso B4 resolve o mesmo por **procuração e-CAC + assinatura gov.br** (UX-31), sem tocar na segurança de ninguém. **Diferencial vendável.**

### 4. 🔴 As dispensas são AUTODECLARAÇÃO feita em nome do cliente
A "Dispensa Corpo de Bombeiros" não é dispensa emitida por órgão. É uma **declaração do empreendedor** via REDESIMPLES:

> *"Declaro que o empreendimento será explorado em **ambiente inócuo ou virtual**."*
> *"Declaro que **instalarei as medidas de segurança contra incêndio e pânico** conforme normas vigentes no estado antes do início das atividades."*

**A Contabilizei declarou isso em nome do cliente** e mandou como "boa notícia". O cliente assumiu obrigação legal de instalar medidas de segurança contra incêndio — e provavelmente não sabe.

A Dispensa Sanitária tem a mesma mecânica de repasse: *"**Verifique** se a atividade dispensada do licenciamento municipal é passível de licenciamento sanitário pela Vigilância Sanitária do **Estado** de Minas Gerais."*

### 5. 🔴 16 dias de silêncio, e o que chegou no meio foi venda
Ticket da prefeitura fecha **17/12**. Próxima notícia operacional: **02/01**. No meio, um único contato: **23/12, upsell do "Cobre Seu Cliente"**.

**Enquanto a entrega estava pendente, o que chegou foi oferta.**

### 6. 🟡 Certificado digital: "incluso" com asterisco
A LP diz *"Certificado digital incluso no plano"* (Padrão). Na prática: *"é só **responder essa mensagem** para receber o voucher gratuito e **adquirir** o certificado"*. Depois o cliente faz **upload na plataforma**. Sem ele, trava licenciamento e emissor de nota.

### 7. 🟡 Eles ATENDEM atividade regulamentada
*"Carteira Profissional, em caso de atividades regulamentadas (ex Advocacia, consultoria empresarial, engenharia)"* — cobram primeiro, pedem a carteira depois. Nosso B1 manda regulada pra **waitlist 🟡**. **Divergência estratégica dura** → [[cnae-atendidos-e-nao-atendidos]].

---

## 📎 Documentos oficiais (anexos)

| Doc | Data | Conteúdo-chave |
|---|---|---|
| **Ficha de Inscrição Cadastral (IM)** | 15/12/25 | IM `1.724.064/001-7` · CNAE **7319-0/04 Consultoria em publicidade** · **sem secundários** · natureza **SOCIEDADE EMPRESÁRIA LIMITADA** · porte **ME** · área 5 m² · Regional Centro-Sul |
| **Alvará de Localização e Funcionamento (DML)** | 15/12/25 | nº 2025098844 · **"Alvará imediato"** · validade 15/12/2030 · **"local é residência de um dos sócios: Sim"** · imóvel APARTAMENTO · ADE Serra do Curral |
| **Dispensa Licenciamento Sanitário** | 02/01/26 | Sec. Municipal de Saúde · art. 19 Lei 7031/96 · repassa verificação estadual pro cliente |
| **Dispensa Corpo de Bombeiros** | 02/01/26 | REDESIMPLES `MGL2506942520` · **autodeclaração de ambiente inócuo + compromisso de instalar medidas anti-incêndio** |
| **TFE.pdf (DRAM/TFLF)** | 19/01/26 | **R$168,48** · vence 23/01 · ref. 12/2025 · Pix disponível |

---

## 🔎 Leituras estruturais

### O CNAE: "Marketing / Publicidade" → 7319-0/04, sem secundário
A categoria grosseira do dropdown de 13 virou **Consultoria em publicidade**, sem CNAE secundário, sem o cliente ver nem escolher.
- 🎯 **Rodar o caso real no nosso motor** (`b2.cnae_otimo`): [[cnae-fiscalmente-otimo]] tem *"agência → 8219-9"* como swap do MVP. **Se a gente economizaria dinheiro nesse CNPJ, essa é a demo do produto — com o CNPJ do sócio como prova.**
- Nosso **T10** (IA sugere secundários) não tem contraparte.

### ⚠️ Natureza jurídica: LTDA num caso solo
Saiu **SOCIEDADE EMPRESÁRIA LIMITADA** pra titular único. Nossa [[spec-telas-entrada-b1-b2]] T11 diz *"Solo → SLU · 2+ sócios → LTDA"* como se fossem naturezas distintas.
> 🟡 **Verificar com a Larissa:** SLU é LTDA de sócio único (mesma natureza 206-2) ou natureza separada? Se for a mesma, **a regra do T11 está mal formulada** e o guard-rail C6 pode estar errado.

### ✅ Endereço residencial funciona em BH
Apartamento, 5 m², *"residência de um dos sócios: Sim"*, **alvará imediato em 3 dias**. Confirma o disclaimer deles na prática (baixo risco, BH).
> Reforça: o **upsell de endereço fiscal** (nosso T9) é conveniência e privacidade, **não necessidade**. Vender como necessidade seria desonesto — e o boleto de papel na casa do cliente (achado 2) é um argumento honesto de verdade.

### O padrão
Cobram cedo com dados rasos → coletam o resto por e-mail → **o cliente executa o trabalho** (achar IPTU, adquirir certificado, upload, desabilitar 2FA, pagar taxa não citada, confirmar pagamento manualmente) → e acompanha lendo ticket.

**A automação deles termina no CNPJ (2 dias). A cauda é humana, manual e do cliente.**

## Links
- [[2026-07-16-funil-abertura-ate-pagamento]] · [[emails-acesso-seguranca]] · [[emails-cobranca]] · [[emails-fiscal-operacional]] · [[emails-onboarding]] · [[emails-suporte]] · [[plano-padrao-195-referencia]] · [[cnae-fiscalmente-otimo]] · [[spec-telas-entrada-b1-b2]] · [[spec-telas-b3-b4-aterrissagem]] · [[fluxo-abertura-portais-pedro-dev]] · [[legalize-preco-deferido-custo-real]] · [[contabilizei]] · [[HOME]]
