---
tipo: playbook
data: 2026-07-09
status: pronto
tags: [tech, produto, imersao]
---

# 🎯 Playbook — Reunião Pedro Dev (condução PM)

> Reunião conduzida como PM: fluxo cronológico onde cada decisão destrava a próxima, com árvore de "resposta → tarefa gerada". Fecha em decisão onde dá; em "investigar" onde não dá. Substitui a tabela plana da [[pauta-reuniao-pedro-dev]].

## 🎬 Resultado esperado (o que tem que SAIR da reunião)
1. **Direção travada:** App reaproveita o Leghub OU é produto novo (a decisão-mãe).
2. **Stack candidata** alinhada (ele apresenta) + abordagem mobile.
3. **Princípios de arquitetura** de dados/segurança combinados (multi-tenant, A1, LGPD).
4. **Lista de tarefas do Pedro Dev** saindo pronta (definidas + as condicionais que as respostas acionarem).

## 📎 Compartilhar com ele antes/no início
[[_relatorio-auditoria]] (UX do líder) · [[cnae-matriz-governo]] (dado pronto) · [[orgaos-sistemas-abertura-bh]] (portais por passo) · [[spec-mvp-v0]] (direção de produto).

---

## FLUXO DA REUNIÃO (na ordem)

### Bloco 0 — Abertura + "o que já temos" (mostrar a evolução)
Alinhar objetivo (MVP tipo Contabilizei, ICP ME serviço Simples BH) e mostrar o **chão já construído** — dá contexto e credibilidade (produto embasado em pesquisa, não achismo):

**1. Mercado (desk research BR + regional):** ~16 mi empresas no perfil no Brasil · líder <1% (não saturado) · 5 concorrentes mapeados · pricing do líder rastreado (Básico R$139 extinto, entrada R$195→R$210,90 real). **BH (piloto): ~450–545 mil ativas, ~100–175 mil no nosso ICP** (ME serviço Simples) + abertura em 11h (3ª capital do país) — ver [[mercado-bh-regional]].

**2. Inteligência do líder (Contabilizei) — fundo:** auditoria de **30 telas** (desktop + mobile) + wizard de emissão · playbook de CRM dos **82 emails** · jornada de onboarding (23 dias, D0→D+29) · ranking de oportunidades: **mobile fraco, cross-sell excessivo, contabilês, dados-empresa escondido**.

**3. Regras do jogo (compliance/CNAE):** **matriz CNAE do governo (1332 IBGE)** + cobertura do líder · **fluxo de abertura BH validado com a contadora (Izabela)** passo a passo · mapa de portais (JUCEMG, Redesim, ALF, BHISS/DES-BH, SISDRAM, SIARE) · custos e prazos reais (R$288 junta, 5 dias BH).

**4. Produto:** **spec-cunha do MVP v0** (núcleo + princípios + o que NÃO fazer).

**5. Marca:** frente iniciada — defesa do naming **Legalizei**.

**6. Infra:** vault Obsidian versionado no **git** — tudo rastreável, nada se perde.
> Mensagem: "temos o mapa do líder, das regras e do produto. Agora precisamos do trilho técnico — é o que vim fechar com você."

### Bloco 1 — FUNDAÇÃO: App × Leghub 🔑 (a decisão-mãe, destrava tudo)
**Decisão:** o app do cliente **reaproveita o Leghub** (que ele já construiu, ~50% automação) como back-office/motor, ou é **produto novo separado**?
**Ramificações:**
- 🌿 **Reusa Leghub** → gera tarefa *"mapear o que do Leghub vira base + gaps"*; stack tende a seguir a do Leghub (economiza meses); integração é interna.
- 🌿 **Novo separado** → gera tarefa *"definir integração app↔Leghub (API entre eles)"*; stack livre pra escolher a ideal cliente-facing; cap table de código limpo, mais trabalho inicial.
**Quem lidera:** Pedro Dev (conhece o Leghub por dentro). **Esta resposta condiciona o Bloco 2.**

### Bloco 2 — Stack (depende do Bloco 1)
**Decisão:** stack do app (ele apresenta — React/Node?) + **abordagem mobile** (nossa auditoria provou que mobile-first é a cunha; ele já falou "mobile first").
**Ramificações:**
- Stack = a do Leghub → reuso de conhecimento, velocidade.
- Stack nova → justificar por quê melhor pro cliente-facing + mobile.
- Mobile: PWA? React Native? web responsivo de verdade? → gera *"definir abordagem mobile"*.
**Gera tarefa (já definida):** ele documenta stack + justificativa. **Valida:** passar pelo sênior guardrail (arquitetura).

### Bloco 3 — ARQUITETURA de dados + segurança (o forte dele) 🔐
**Decisão:** modelo multi-tenant + LGPD + **guarda da chave privada do certificado A1**.
**Ramificações:**
- A1 (chave privada do CNPJ do cliente) → gera *"desenhar arquitetura de guarda/uso do A1"* (CRÍTICA — o moat de segurança dele).
- Multi-tenant: schema por cliente × compartilhado com isolamento → gera *"definir modelo multi-tenant"*.
- LGPD: mapear dado sensível → gera *"checklist LGPD do MVP"*.
**Valida:** ele (segurança) + sênior guardrail. **Posicionar: "essa é a parte que só você resolve."**

### Bloco 4 — INTEGRAÇÃO: portais gov + build-vs-buy
**Decisão:** o que integra por API oficial × RPA × parceiro.
**Ramificações:**
- Portais (JUCEMG, Redesim, ALF, BHISS/DES-BH, SISDRAM, SIARE) → gera *"mapear API×RPA por portal"* (definida). Ele já faz scraper JUCEMG.
- NFS-e: Focus NFe cobre BH + suporta **NFS-e Nacional** (Reforma Tributária)? → gera *"PoC Focus NFe + padrão nacional"*.
- Certificado A1: certificadora parceira comissionada da Legalize (Izabela) → gera *"avaliar API/fluxo da certificadora parceira"*.
- Gateway de assinatura + conta PJ → gera *"avaliar parceiros de pagamento"*.
**Valida:** ele + spike sênior (fim do V0).

### Bloco 5 — PRODUTO / dados: filtro CNAE
**Decisão:** usar a matriz CNAE (1332, pronta) pro filtro **regime→CNAE** no onboarding (feature validada pela Izabela).
**Gera tarefa (definida):** implementar o filtro com a matriz.
**Condicional:** overlay tributário (anexo/Fator R) depende da Larissa → tarefa nasce depois.

### Bloco 6 — UX
**Decisão:** princípios de UX do MVP (mobile-first real, emissão 1-toque, sem cross-sell, dados-empresa 1ª classe, linguagem humana).
**Gera tarefa (definida):** cruzar nossa auditoria UX × a análise tech dele da Contabilizei → base dos wireframes.

### Bloco 7 — Fechamento
Recapitular decisões travadas · consolidar tarefas (baldes A+B) · combinar cadência (reuniões pontuais, não sobrecarregar) · listar pendências externas.

---

## 🗂️ BALDE A — Tarefas JÁ definidas (acontecem independente da conversa)
1. Pedro Dev: documentar **stack proposta + justificativa**.
2. **Mapear API×RPA** por portal gov.
3. **PoC Focus NFe** (NFS-e BH + padrão nacional).
4. **Implementar filtro CNAE** por regime (matriz pronta).
5. **Cruzar auditoria UX × teardown tech** da Contabilizei → base wireframes.
6. **Analisar app Contabilizei** (tech) — tarefa herdada da 1ª reunião dele.
7. **Puxar dado preciso de empresas em BH** (base aberta da Receita/CNPJ ou JUCEMG): município BH + CNAE do perfil + Simples + porte ME → número cravado do ICP regional (hoje é estimativa ~100–175k). Usa a expertise de dados dele. Origem: [[mercado-bh-regional]].

## 🌿 BALDE B — Tarefas CONDICIONAIS (nascem da decisão de cada bloco)
- **Bloco 1:** [reusa] mapear Leghub base+gaps · [novo] definir integração app↔Leghub.
- **Bloco 2:** definir abordagem mobile (PWA/RN/web).
- **Bloco 3:** desenhar guarda do A1 · definir multi-tenant · checklist LGPD.
- **Bloco 4:** avaliar certificadora parceira · avaliar gateways/conta PJ.
- **Bloco 5:** [pós-Larissa] preencher overlay tributário na matriz.

## 📦 O QUE SERIA O MLP (pra debater — âncora do Bloco 5/6)
> **MLP = Minimum Lovable Product** (termo da 1ª reunião): não "o mínimo que funciona", mas "o mínimo que as pessoas AMAM". Separa o loop essencial (não cortar) dos diferenciais (a alma). Base: [[spec-mvp-v0]].

**1. Núcleo mínimo — o loop que TEM que funcionar (o "viável"):**
Abrir/migrar empresa → **emitir NFS-e** → pagar guia (**DAS**) → ver situação. = o core do plano R$195 do líder que mapeamos.

**2. O que torna LOVABLE (as otimizações cruciais, cada uma com evidência):**
- Emissão de NF em **1 toque** ← auditoria do wizard [[nf-emissao-2]]
- Onboarding sem fricção + **filtro CNAE por regime** ← validado Izabela [[2026-07-09-conversa-izabela]]
- Dashboard limpo, **zero cross-sell** ← auditoria da home [[_relatorio-auditoria]]
- **Linguagem humana** (traduzir DARF/DEFIS/NBS) ← auditoria
- **Proatividade** (lembrete configurável + recálculo — supera o D-3/D-1 do líder) ← [[playbook-crm-contabilizei]]
- **Dados da empresa em 1ª classe** (CNPJ/contrato copiáveis) ← a brecha de ouro do líder
- **Transparência de custo/prazo desde o início** ← dor confirmada pela Izabela (custos-surpresa)
- **Mobile-first de verdade** ← o mobile fraco do líder (nossa maior cunha demonstrável)

**3. O que fica de FORA do MLP (escopo negativo):**
As 17 categorias CNAE recusadas ([[cnae-cobertura]]) · banco próprio · benefícios de terceiros · folha pesada · atividades regulamentadas (fase posterior) · Lucro Real/indústria.

**4. Validar que é "lovable":** teste com os **25–30 clientes fundadores** (mês 3).

> **Uso no debate:** o loop (camada 1) é o que o Pedro Dev NÃO pode cortar do escopo. Os diferenciais (camada 2) são o coração — priorizar sem matar a alma. O escopo negativo (camada 3) = o que economizar.

## ⏳ Pendências externas (NÃO fecham hoje)
- **Larissa** (fiscal): acessórias reais → alimenta o **motor de compliance** (arquitetura futura).
- **Carla** (DP) · **Jessica** (abrir em 4 concorrentes) · **sênior guardrail** (validar arquitetura/segurança).

## Links
- [[pauta-reuniao-pedro-dev]] · [[spec-mvp-v0]] · [[_relatorio-auditoria]] · [[cnae-matriz-governo]] · [[2026-07-09-conversa-izabela]] · [[kanban-legalizei]] · [[HOME]]
