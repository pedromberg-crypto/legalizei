---
tipo: verdade
status: GERADO — não editar à mão, nasce de `execucao/flow/gerar-mapa.mjs`
data: 2026-08-27
assunto: dados-coletados-abertura
tags: [execucao, flow, dados, abertura]
---

# 📋 Dados coletados — Abertura de CNPJ, até a 1ª tentativa de viabilidade

> ⚠️ **Nota gerada** — roda `node execucao/flow/gerar-mapa.mjs` pra atualizar depois de mexer em `flow-data.mjs`. Escopo: só o caminho **Abrir** (não Migrar). Do primeiro toque no app até o clique que dispara a 1ª tentativa de viabilidade na Junta (`C7`, CTA que envia a razão social pra JUCEMG). Ver [[mapa-flow-mermaid]] pro diagrama completo, [[gap-analise-dados-abertura-vs-pesquisa-gemini]] pro cruzamento com pesquisa externa.

## Telas do caminho, em ordem

### E1 · Splash
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E2.1 · Welcome (1/3 · Contador de verdade)
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E2.2 · Welcome (2/3 · Parte chata)
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E2.3 · Welcome (3/3 · Sem susto no boleto)
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E3 · Fork 3 rotas
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E3.3 · Seus dados (nome · e-mail · telefone)
- Nome completo
- e-mail
- telefone
- consentimento de privacidade (implícito, ao continuar)

### E3.2 · MEI × ME (variante Abrir)
- Regime autodeclarado (MEI ou ME)

### E3.4 · Endereço + categoria (os 2 gates)
- Endereço da empresa (CEP validado BH + número) OU endereço fiscal Legalizai (+R$60/mês)
- categoria de atividade (1 das 17 pills)

### Triagem sócios? CPF/CNPJ? exterior?
- Quantidade de sócios (1 / 2 / 3 / 4 / 5+)
- sócio via CPF ou CNPJ (quando há sócio)
- mora fora do Brasil (sim/não)
- é a 1ª empresa que abre? (opcional)

### Faixa de faturamento
- Faixa de faturamento mensal (ou valor exato, se souber)

### E6 · Criar conta
- Senha
- CPF
- código de verificação (mock)
- CONFIRMA nome/e-mail/telefone já captados no E3.3 (não recoleta)

### E7 · A conta da abertura
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E8 · Aceite contrato reversível, CDC 49
- Aceite do contrato de serviço (checkbox)

### E9 · Pagamento (variante Abrir)
- CPF (cobrança + elegibilidade)
- método de pagamento (cartão/Pix/boleto)

### E9.1 · Aguardando boleto dossiê já liberado
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### C0 · Sua atividade (descreve + pills)
- Descrição da atividade (texto livre) → CNAE principal (derivado por IA)
- OU o código já sabido (atalho 28/07, mesma engine)
- categoria já vem pré-selecionada do E3.4

### C0.2 · CNAE encontrado
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### Desambiguação mini-loop
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### 🟢 CNAE confirmado
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### C1 · Seus dados
- CONFIRMA nome/CPF/endereço já captados no E6 (não recoleta)
- RG + órgão emissor (digitação manual)
- data de nascimento
- nome da mãe
- estado civil (+ regime de bens se casado)
- confirma se mora fora do Brasil

### C2 · Vínculo INSS
- Já contribui INSS por fora? (sim/não)
- valor do vínculo (CLT/aposentadoria/autônomo/sócio de outro CNPJ)

### C3 · Sócios?
- Confirma se terá mais sócios (sem reperguntar quantidade/tipo)
- se houver, nome completo + % de participação de cada sócio extra (quantidade fixa, CPF implícito)

### C4 · Dados da empresa
- CEP (autofill) + número + complemento
- índice cadastral IPTU (obrigatório, só se próprio)
- tipo de endereço
- residência de sócio (trava duplicidade)
- capital social

### C5 · CNAE secundários
- CNAEs secundários (seleção múltipla + busca, opcional, até 15)

### C6 · Natureza jurídica
- Escolha da natureza jurídica (SLU ou LTDA — sugerida, editável)

### C7 · Nome / razão social
- 3 opções de razão social, editáveis inline, por ordem de prioridade (sugeridas por IA)
- objeto social (gerado automaticamente, travado)
- nome fantasia (opcional)

🔴 **É aqui que o CTA dispara a 1ª tentativa de viabilidade na Junta (JUCEMG)** — os campos acima são exatamente o que vai pro pedido de viabilidade.

## Preenchidos por nós, não pelo cliente

> Campos que a viabilidade/DBE exigem, mas a Legalizai preenche internamente — decisões travadas em `marca/decisoes-marca.md`.

| Campo | Valor | Onde entraria | Status | Por quê |
|---|---|---|---|---|
| Forma de atuação (JUCEMG) | "Internet" / atividade fora do estabelecimento | C4 · Dados da empresa | 🟡 travado internamente, pendente de validação técnica | Não gera dúvida útil pro cliente nem interfere na atuação dele — vale enquanto o escopo for serviço 100% remoto. Reabrir se o produto passar a atender CNAEs com atendimento físico (cabeleireira, personal trainer etc.) |
| Tipo de unidade (JUCEMG) | "Sede" | C4 · Dados da empresa | 🟢 travado | Toda abertura nova (1 endereço só) é sempre Sede — não existe cenário no MVP onde seria Unidade Administrativa (só valeria numa 2ª filial de empresa já aberta) |
| Metragem (m² do imóvel + m² da operação) | — (não implementado) | C4 · Dados da empresa | 🟡 pendente, sem decisão | Nenhuma fonte confirma esse campo além do índice cadastral IPTU (já coletado) — não implementar até aparecer confirmação real |

## Nota de fonte

Gerado direto do campo `dados` de `flow-data.mjs` — reflete o que está **documentado como construído**, não necessariamente o que está validado em produção (ver campo `validado` de cada nó). Qualquer mudança de campo nessas telas precisa entrar em `flow-data.mjs` primeiro; rodar o gerador de novo atualiza esta nota sozinho.
