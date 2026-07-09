---
tipo: processo
data: 2026-07-09
status: rascunho-validar
tags: [produto, compliance, imersao]
---

# 🏛️ Passo a passo — Abertura de empresa (ME serviço, Simples, BH)

> **Rascunho de mercado pra validar COM a contadora interna.** Baseado em conhecimento de mercado + o onboarding real da Contabilizei que mapeamos ([[onboarding-jornada-completa]], que documentou os passos de BH). Nível: **Belo Horizonte / MG**. ⚠️ Cada item marcado 🟡 = confirmar/refinar com ela. Vira o mapa de processo oficial (entregável S1/S2).

## Fase 0 — Coleta de informações do cliente
- [ ] Dados pessoais do(s) sócio(s): nome, CPF, RG, estado civil, endereço, contato
- [ ] Atividade que vai exercer (→ vira o CNAE)
- [ ] Endereço da empresa (comercial / residencial / escritório virtual) 🟡 regras de BH p/ endereço residencial
- [ ] Capital social pretendido
- [ ] Nº de sócios / se tem sócio ou empresário individual
- [ ] Se o sócio tem vínculo CLT (impacta pró-labore/INSS)
- [ ] Se a atividade é regulamentada (exige conselho/RT — ex: saúde, eng, advocacia) 🟡

## Fase 1 — Definições e enquadramento
- [ ] **CNAE** (principal + secundários) — da matriz; serviço leve no Simples ([[cnae-matriz-governo]])
- [ ] **Natureza jurídica** (ME / EI / SLU / LTDA) 🟡 qual ela recomenda p/ o nosso ICP
- [ ] **Razão social** + **nome fantasia**
- [ ] **Regime tributário** = Simples Nacional (opção) · **Anexo** (III/V) + **Fator R** 🟡
- [ ] **Pró-labore** definido (impacta INSS + Fator R)
- [ ] **Capital social** confirmado

## Fase 2 — Viabilidade (antes de registrar)
- [ ] **Consulta de viabilidade** na RedeSim / **JUCEMG** (nome + endereço + atividade aceitos?) 🟡
- [ ] **Viabilidade municipal na Prefeitura de BH** — endereço permite a atividade (zoneamento)? 🟡
- [ ] Definir **grau de risco** da atividade (baixo/médio/alto → muda o licenciamento) 🟡

## Fase 3 — Registro e CNPJ
- [ ] **DBE / Coleta Web** (Documento Básico de Entrada — Receita Federal)
- [ ] **Conta GOV.BR nível Prata/Ouro** do sócio (necessária p/ assinar digital) — ⚠️ ponto de atrito confirmado no líder
- [ ] **Contrato social / requerimento de empresário** elaborado
- [ ] **Registro na JUCEMG** + assinatura digital (GOV.BR)
- [ ] **CNPJ emitido** (Receita Federal) ✅ empresa "nasce"

## Fase 4 — Municipal BH (o que vimos no onboarding do líder)
- [ ] **Inscrição Municipal (IM)** — cadastro mobiliário na Prefeitura de BH 🟡
- [ ] **Licenciamento** — portal Licenciador de BH (exige o **certificado digital**); baixo/médio risco = simplificado/dispensa 🟡
- [ ] **Taxa de Funcionamento / Fiscalização de Estabelecimentos (BH)** — cobrança municipal 🟡 (vimos nos emails do líder)
- [ ] **Dispensas** conforme atividade: **Vigilância Sanitária** + **Corpo de Bombeiros** (o líder emitiu ambas p/ o Pedro) 🟡

## Fase 5 — Fiscal e habilitação
- [ ] **Certificado digital A1 (e-CNPJ)** — obrigatório p/ NFS-e e portais (Focus NFe/parceiro) — R$149,90–274,90/ano
- [ ] **Opção pelo Simples Nacional** — dentro do prazo legal ⚠️ prazo é crítico 🟡
- [ ] **Inscrição Estadual** — em geral **NÃO** p/ serviço puro (só se houver ICMS/comércio) 🟡 confirmar
- [ ] **Credenciamento p/ emissão de NFS-e em BH** — cadastro no sistema da Prefeitura de BH 🟡 (o "Buraco 2" municipal da pesquisa)

## Fase 6 — Operacional / entrega ao cliente
- [ ] **Conta bancária PJ** aberta (parceiro)
- [ ] Orientação de rotina: quando emitir NF, DAS, pró-labore, obrigações
- [ ] Empresa **ativa e operando** ✅

## ⏱️ Prazo de referência (mercado)
- Contabilizei real (do Pedro, em BH): **~23 dias** cadastro → CNPJ + dispensas ([[onboarding-jornada-completa]]).
- Contajá promete "72h" p/ partes do fluxo (marketing). 🟡 perguntar a ela o prazo REAL médio da Legalize em BH.

## ❓ Perguntas-chave pra ela (o que eu quero cravar)
1. Qual a **sequência exata** e o que trava mais? (onde mora o gargalo?)
2. Quais passos são **100% digitais** em BH e quais exigem **presencial/correspondente**?
3. **Prazo real médio** ponta a ponta em BH?
4. O que mais gera **retrabalho** (dado faltando, erro do cliente)?
5. **Custos de terceiros** por abertura (taxas BH, certificado, DBE)?
6. Onde o **contador CRC precisa assinar/se responsabilizar**?
7. O que da abertura **já é automatizado** hoje (Leghub) vs manual?
8. Diferença de fluxo entre **EI × SLU × LTDA** p/ o nosso ICP?

---

# 📂 Categorias de CNAE que atenderemos (= recorte da Contabilizei)

> Espelhamos o filtro validado do líder ([[cnae-cobertura]]): **serviço + comércio leve no Simples**, Anexos I/III/V. Abaixo, as categorias e suas peculiaridades. ⚠️ Anexo exato + Fator R por CNAE = validar com a contadora (overlay tributário fica p/ a camada fiscal).

## 🟢 Núcleo — serviços (nosso ICP principal)

| Categoria | CNAE (exemplos) | Anexo | Peculiaridade |
|---|---|---|---|
| **Consultoria / administração** | 7020-4, 8211-3, 8219-9 | III/V (Fator R) | Sem conselho obrigatório; CRA recomendado. Nosso caso mais comum |
| **TI / software / desenvolvimento** | 6201-5, 6202-3, 6209-1, 6311-9 | III/V (Fator R) | **Fator R é decisivo** (pró-labore ≥28% da receita → Anexo III 6% vs V 15,5%). Sem conselho |
| **Publicidade / marketing / design** | 7311-4, 7312-2, 7319-0, 7410-2 | III/V (Fator R) | Sem conselho. Caso do próprio Pedro |
| **Educação / ensino / treinamentos** | 8550-3, 8593-7, 8599-6 | III (Fator R) | Sem conselho p/ cursos livres |
| **Serviços pessoais** (beleza, estética) | 9602-5, 9609-2 | III | Estética pode exigir Vigilância Sanitária 🟡 |

## 🟡 Regulamentadas — atendemos COM condição (exigem conselho + RT)

| Categoria | CNAE (ex.) | Conselho / condição |
|---|---|---|
| **Saúde** (médico, fisio, fono, psico, vet) | 8610-1, 8630-5, 8650-0, 7500-1 | RT pessoa física + CRM/CREFITO/CRP/CRMV + **endereço comercial** |
| **Odontologia** | 8630-5/04, 3250-7 | RT + CRO + endereço comercial |
| **Engenharia / arquitetura** | 7111-1, 7112-0, 7119-7 | RT + CREA/CAU (às vezes RT sócio) |
| **Advocacia** | 6911-7 | OAB; **restrição a incluir outras atividades** |
| **Contabilidade** | 6920-6 | CRC |
| **Corretagem (imóveis/seguros)** | 6822-6, 6622-3 | RT + CRECI/SUSEP |
| **Representação comercial** | 4611 a 4619 | registro no CORE (sem RT) |

## 🔵 Comércio leve (Anexo I) — atendem, mas fora do foco de serviço
- Varejo leve (47xx) — **exceto** material de construção (4741–4744) e farmácia (4771), que o líder **recusa**.
- Peculiaridade: comércio pode exigir **Inscrição Estadual** (ICMS) — diferente do serviço puro.

## 🔴 NÃO atender (as 17 do líder — [[cnae-cobertura]])
Construção · indústria/fábricas · farmácia · gráfica · financeiras · ONG/igreja · material de construção · terceirização de mão de obra · hospedagem · transporte · segurança · agricultura · cartório · cooperativa · locação de transportes · montagem de móveis · administração condominial.

## 💡 Peculiaridades transversais (perguntar à contadora)
- **Fator R** (28% de folha/pró-labore sobre receita) define Anexo III × V em quase todo serviço — é a alavanca de economia. 🟡 como ela calcula/orienta?
- **Regulamentadas** = mais passos na abertura (conselho + RT + às vezes endereço comercial obrigatório) → afeta o fluxo da Fase 1–4 acima.
- **Endereço comercial obrigatório** em saúde/odonto → não pode ser residencial. 🟡

## Links
- [[onboarding-jornada-completa]] · [[cnae-matriz-governo]] · [[cnae-cobertura]] · [[spec-mvp-v0]] · [[CHECKLIST-IMERSAO-30-DIAS]] · [[HOME]]
