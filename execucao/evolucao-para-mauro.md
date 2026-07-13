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

**📎 Reporte técnico do dev (10/07):** Pedro Dev mandou o resumo de fundação técnica — stack mobile-first + réplica web, banco seguro com isolamento por cliente e **certificado digital em banco separado (LGPD)**, robôs "funcionários" guiados por um robô gerente, e o mapa da operação em 3 fases (entrevista IA → constituição CNPJ+certificado → portal do cliente). Já construindo infra do SaaS + protótipo de backend pra testar automações/IA/onboard. Próximo dele: fechar testes de fundo + alinhar identidade/branding comigo. → [[2026-07-10-reporte-tecnico-pedro-dev]]

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

## Semana 13/07/2026 — alinhamento Pedro Dev + Léo
| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | Modelo operacional | **Modelo do app travado**: foco só em **serviço** (comércio vai pro tradicional), atender só atividades que "passam liso", cobrança só depois de validar a atividade, WhatsApp como canal central, e o cadastro dividido em blocos que fluem sozinhos até a assinatura | 🟢 |
| 2 | Regra de negócio (Léo) | Léo trouxe as dores do escritório digital antigo e viraram **requisito**: exigir upload de nota, prolabore padronizado, aviso de nota emitida por fora, status em tempo real pro cliente | 🟢 |
| 3 | Contrato-como-produto | Definido que o **contrato é a mitigação de risco** (nota retroativa, obrigação acessória, cancelamento) — vai ser redigido junto da copy de onboarding | 🟢 (a redigir) |
| 4 | Plano de sequência (PM) | Cortei as ~40 ideias da reunião pro **caminho crítico**: abrir 1 empresa real ponta a ponta (cobaia = CNPJ do próprio Pedro). Resto = backlog → [[2026-07-13-plano-sequencia-pm]] | 🟢 |
| 5 | Backend | Pedro Dev em **teste ponta a ponta** (robôs + IA "diretor contábil" + infra própria) mirando **sexta 17/07** | 🟡 em curso |
| 6 | Time | Consenso: **entra um operador** (indicação do Pedro Dev) pra escalar a execução, sob revisão do Dev | 🟢 (a contratar) |
| 7 | Protótipo | Telas conectadas e **navegáveis fim a fim** pra apresentar no navegador | 🟢 |

**Próximo (13/07):** [Dev] fechar teste E2E + V1 UI até 17/07 · [Pedro] especificar blocos do wizard + fechar formulário c/ Carla e Larissa + handoff Git · **fechar 3 decisões caras** (certificado terceiro / gateway Asaas / plano semestral) · **apresentar progresso ao Mauro (sex 17/07)**.

### 📱 WhatsApp (13/07)
```
*Update Legalizei* 🚀
- Travamos o modelo do app com o time: foco só em serviço, cobrança só depois de validar a atividade, WhatsApp como canal central e cadastro em blocos que fluem até a assinatura
- As dores do escritório digital antigo (nota emitida por fora, prolabore, cancelamento) viraram requisito e vão pro contrato
- Priorizei tudo num plano enxuto: a meta das próximas semanas é abrir 1 empresa REAL de ponta a ponta pelo app (cobaia = meu próprio CNPJ)
- Pedro Dev está no teste de ponta a ponta do backend (robôs + IA + infra), mirando sexta
- Protótipo já navegável fim a fim pra apresentar
Sexta (17/07): teste E2E + 1ª versão da tela + apresentação do progresso
```

## Semana 13/07/2026 — 2º flow (redes, handoff, regras de DP)
| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | Regras de negócio (DP) | **Karla (Depto Pessoal)** respondeu as dúvidas em aberto: pró-labore/INSS (mín. 1 salário, custo líquido explícito), sócio não pode ser CLT da própria empresa, sócio com CLT em outra empresa (LGPD: informa manual), eSocial "sem movimento", **Fator R** (folha ≥28% → cai de 15,5% pra 6%), funcionário/PJ fica fora do 1º produto, obrigações acessórias por tributação | 🟢 → [[2026-07-13-conversa-karla]] |
| 2 | Handoff pro dev | Repositório privado **base-ds-legalizei** com todas as telas + site + animações entregue; Pedro Dev já convidado | 🟢 |
| 3 | Redes sociais | **Instagram e LinkedIn da Legalizei criados** (pegada "estamos chegando"); descrição/marca aplicadas; organização das redes montada no projeto | 🟢 (config em curso) |
| 4 | Domínios | **Valores enviados pro Miguel aprovar contigo**: Hostinger R$312,11 + Registro.br R$76,00 (blindagem legalizei.app.br) | ⏳ aguarda pagamento |

**Próximo (13/07 2º):** fechar as perguntas de **fiscal com a Larissa** (obrigações acessórias/prazos/multa); banner final do LinkedIn; **aprovar o pagamento dos domínios**.

### 📱 WhatsApp (13/07 — 2º)
```
*Update Legalizei* 📣
- Sentei com a Karla (DP) e travamos as regras que faltavam: pró-labore/INSS, sócio CLT, eSocial sem movimento, Fator R e o que fica pra depois (funcionário/PJ). Falta só a Larissa (fiscal)
- Entreguei pro nosso dev o pacote com todas as telas, o site e as animações, num repositório próprio
- Criamos o Instagram e o LinkedIn da Legalizei no clima "estamos chegando"
- Mandei pro Miguel os valores dos domínios pra aprovação (Hostinger + Registro.br)
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
- [[decisoes-marca]] · [[conceito-marca]] · [[spec-mvp-v0]] · [[2026-07-10-teto-automacao-orgaos-sem-api]] · [[2026-07-10-reporte-tecnico-pedro-dev]] · [[HOME]]
