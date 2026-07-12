---
tipo: reporte
etapa: evolucao-semanal
status: vivo
data: 2026-07-10
tags: [reporte, evolucao, sociedade]
---

# 📊 Evolução do Legalizei — reporte pro sócio (doc vivo)

> Log vivo da evolução, atualizado ao fim de cada sessão produtiva. Base pra pauta/reporte com o Mauro. **Versão WhatsApp (grupo ampliado) omite o item de sociedade** — ver bloco no fim.

## Semana 07–10/07/2026
| # | Frente | O que evoluiu | Status |
|---|---|---|---|
| 1 | Sociedade | Negócio fechado (07/07); framework de sociedade 1-pág; NDA + acessos | 🟢 |
| 2 | Imersão | Conversas com o time (Léo, Izabela, dev) gravadas e transformadas em decisões | 🟢 |
| 3 | Abertura de empresa (BH) | Passo a passo ME serviço Simples validado com a Izabela; órgãos/sistemas mapeados (JUCEMG, PBH/BHISS, SEF-MG/SIARE, REDESIM) | 🟢 |
| 4 | Concorrentes | Estudo a fundo dos 6 maiores: preços reais, comunicação, tom e pontos fracos | 🟢 |
| 5 | **Teto de automação** | Validado pelos 3: o processo **não é 100% digital** (~15–20% exige humano) — JUCEMG e Gov.br não têm API e exigem login manual. **Os concorrentes também não são**: todo "abrir empresa grátis" vira formulário → "um consultor entra em contato". Ver [[2026-07-10-teto-automacao-orgaos-sem-api]] | 🟢 |
| 6 | CNAEs | Mapa completo do que o app atende x não atende (460 sim / 68 condicional / 804 não) | 🟢 |
| 7 | Tecnologia | Base técnica do app definida (stack, MLP, multi-tenant) | 🟢 |
| 8 | Marca | Nome aprovado (Legalizei); tom de voz, personalidade e cor principal (coral) definidos; **logo fechado** (símbolo + logotipo, arquivos vetoriais) | 🟢 |
| 9 | Domínios e e-mail | Escolhidos + carrinho montado na Hostinger (R$186/ano), no CNPJ da Legalize Digital | ⏳ aguarda autorização de compra |
| 10 | Organização | Todo o conhecimento do projeto centralizado, versionado e seguro | 🟢 |

**Próximo:** reavaliar a rota do produto com as descobertas da semana (dev já trabalhando na nova validação). ~~fechar o logo~~ ✅ **logo fechado 12/07** ([[2026-07-12-logo-fechado]]) — falta só gerar derivados (favicon/ícone de app).

## Semana 11–12/07/2026
| # | Frente | O que evoluiu | Status |
|---|---|---|---|
| 1 | Marca | Fonte do sistema definida (Sora, pra tudo); **handoff de cores + fonte entregue pro dev** já iniciar as telas | 🟢 |
| 2 | Produto/UX | **Fluxo de entrada do app desenhado**: abrir do zero × migrar de contador; ao migrar, puxar dados do CNPJ automaticamente; filtrar já na entrada se o CNAE é atendido; pedir cadastro só depois de qualificar o cliente | 🟢 |
| 3 | Protótipo | Arrancamos o **protótipo visual das telas** já com a marca — abertura animada + primeiras telas do cadastro | 🟢 |
| 4 | Protótipo (entrada) | **Fluxo de entrada inteiro montado e navegável**: abertura animada → boas-vindas (3 telas com animações) → escolha "abrir × migrar" → **validador de atividade (CNAE)** → login. Tudo com a nossa cara e sem travar em tela nenhuma | 🟢 |
| 5 | Validador de CNAE | Uma caixa tipo chat onde o cliente **escreve o que faz** e descobre **na hora** se a gente atende (ou entra na fila de espera, se for atividade regulamentada) — transparência de cara. Mesma lógica vai pra dentro do app e pro site | 🟢 |
| 6 | Site (landing) | **Roteiro completo do site de captação** pronto pra produzir — foco em transparência (o mesmo validador de CNAE já na home) e em levar a pessoa a **baixar o app** (iOS/Android) | 🟢 (produzir) |

**Próximo (11–12):** confirmar com o dev a fonte de dados do cartão CNPJ (API); produzir o site de captação; definir os passos do cadastro (wizard).

### 📱 WhatsApp (11–12/07)
```
*Update Legalizei* 🎨
- Definimos a fonte do app e passamos as cores prontas pro dev começar as telas
- Desenhamos como o cliente entra no app: quem já tem empresa migra puxando os dados do CNPJ na hora; quem vai abrir do zero é guiado; e a gente já filtra logo na entrada se atende a atividade dele
- Montamos o protótipo visual de TODO o fluxo de entrada (abertura → boas-vindas → abrir/migrar → validador de atividade → login), já com a nossa marca e animações
- Criamos um "validador de CNAE": o cliente escreve o que faz e descobre na hora se a gente atende — transparência desde o primeiro contato
- Roteiro do site de captação pronto pra produzir, focado em baixar o app
```

## 📱 Versão WhatsApp (copiar/colar — grupo ampliado, sem item de sociedade)
```
*Relatório semanal — Legalizei* 📊
_07 a 10/07_

1️⃣ *Imersão* — conversas com o time (incl. Izabela) viraram decisões ✅
2️⃣ *Abertura de empresa (BH)* — passo a passo validado com a Izabela; Junta, Prefeitura e Estado mapeados ✅
3️⃣ *Concorrentes* — estudo a fundo dos 6 maiores: preços, comunicação e pontos fracos ✅
4️⃣ *Descoberta-chave* — ninguém é 100% automático: órgãos como JUCEMG e Gov.br exigem humano, E todos os concorrentes, no "abrir empresa grátis", terminam em "um consultor entra em contato". Confirmado pelos 3 ✅
5️⃣ *CNAEs* — mapa do que o app atende e não atende (460 sim / 804 não) ✅
6️⃣ *Tecnologia* — definida a base de como o app vai ser construído ✅
7️⃣ *Marca* — nome aprovado, tom de voz e cor principal (coral) definidos; *logo fechado* ✅
8️⃣ *Domínios e e-mail* — escolhidos e no carrinho (R$186/ano), no CNPJ da Legalize Digital ⏳ *aguardando autorização pra comprar*
9️⃣ *Organização* — conhecimento do projeto centralizado e seguro ✅

Semana que vem: reavaliar a rota do produto com essas descobertas (o dev já está nisso). Logo já fechado ✅
```

## Links
- [[decisoes-marca]] · [[conceito-marca]] · [[spec-mvp-v0]] · [[2026-07-10-teto-automacao-orgaos-sem-api]] · [[HOME]]
