---
tipo: verdade
status: GERADO — não editar à mão, nasce de `execucao/flow/gerar-mapa.mjs`
data: 2026-09-01
assunto: dados-coletados-abertura
tags: [execucao, flow, dados, abertura]
---

# 📋 Dados coletados — Abertura de CNPJ, até a 1ª tentativa de viabilidade

> ⚠️ **Nota gerada** — roda `node execucao/flow/gerar-mapa.mjs` pra atualizar depois de mexer em `flow-data.mjs`. Escopo: só o caminho **Abrir** (não Migrar). Do primeiro toque no app até o clique que dispara a 1ª tentativa de viabilidade na Junta (`C7`, CTA que envia a razão social pra JUCEMG). Ver [[mapa-flow-mermaid]] pro diagrama completo, [[gap-analise-dados-abertura-vs-pesquisa-gemini]] pro cruzamento com pesquisa externa.

## Telas do caminho, em ordem

### E1 · Splash
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E2.1 · Welcome (1/3 · Léo vigia, contador é gente)
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E2.2 · Welcome (2/3 · Aquece o fork)
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E2.3 · Welcome (3/3 · Sem susto no boleto)
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E3 · Fork 4 rotas
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E3.3 · Seus dados (nome · e-mail · telefone)
- Nome completo
- e-mail
- telefone
- consentimento de privacidade (implícito, ao continuar)

### E3.2 · MEI × ME (variante Abrir)
- Regime autodeclarado (MEI ou ME)

### E3.4 · Endereço + categoria (os 2 gates)
- Endereço da empresa (CEP validado BH + número) OU endereço fiscal Legalizai (+R$60/mês) OU cidade pra fila de espera
- categoria de atividade (1 das 15 categorias, `pesquisa/cnae-matriz/taxonomia-pills-n4.md`, v2 27/08 -- 90 CNAEs certeza) OU atividade regulamentada (≤12 opções) pra quem não se encontrou

### E3.4.1 · CEP fora de BH (gate resolvido inline)
- Confirma: usa endereço fiscal Legalizai OU entra na fila da própria cidade

### Triagem quantos sócios?
- Quantidade de sócios (1 / 2 / 3 / 4)
- é a 1ª empresa que abre? (opcional)
- sócio que não se encaixa no card informativo (opcional, texto livre via 'Falar com o time')

### Faixa de faturamento
- Faixa de faturamento mensal (ou valor exato, se souber)

### E5F.1 · Splash 'conseguimos te atender'
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E6 · Criar conta
- Nome
- CPF
- telefone
- e-mail
- senha
- CEP
- número
- complemento
- coorte (opcional)
- código de verificação (mock)

### E7 · A conta da abertura
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E7.1 · A conta da abertura (variante endereço fiscal)
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E9 · Pagamento + contrato (variante Abrir)
- CPF (cobrança + elegibilidade)
- método de pagamento (cartão/Pix/boleto)
- aceite do contrato de serviço (checkbox)

### E9.S · Splash 'pagamento confirmado'
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E9.SB · Splash 'boleto gerado'
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E9.1 · Aguardando boleto dossiê já liberado
- _(sem dado novo — contexto, confirmação ou decisão do sistema)_

### E9.1P · Status (pago, via instantâneo)
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
- se houver, de cada sócio extra: nome completo + % de participação (CPF implícito) + data de nascimento + nacionalidade + RG + órgão emissor + estado civil (+ regime de bens se casado)

### C4 · Dados da empresa
- CEP (autofill) + número + complemento
- índice cadastral IPTU (obrigatório, só se próprio)
- tipo de endereço (próprio/coworking)
- tipo de imóvel (casa/apartamento/outro, só se próprio)
- você mora nesse endereço? (obrigatório se apartamento, JUCEMG indefere sem isso)
- seu endereço pessoal, se não reside no local

### C5 · CNAE secundários
- CNAEs secundários (seleção múltipla + busca, opcional, até 15)

### C7 · Nome / razão social
- 3 opções de razão social, editáveis inline, por ordem de prioridade (sugeridas por IA)
- objeto social (gerado automaticamente, travado)
- nome fantasia (opcional)

🔴 **É aqui que o CTA dispara a 1ª tentativa de viabilidade na Junta (JUCEMG)** — os campos acima são exatamente o que vai pro pedido de viabilidade.

### M-T · Impedimentos (no lugar da triagem)
- Já tem outra empresa? (sim/não)
- é servidor federal? (sim/não)
- recebe benefício? (sim/não) + ciência explícita se sim

### M-O · Ocupação (Anexo XI + limite interno)
- Ocupação principal (1 da lista do Anexo XI)
- até 15 ocupações secundárias

## Preenchidos por nós, não pelo cliente

> Campos que a viabilidade/DBE exigem, mas a Legalizai preenche internamente — decisões travadas em `marca/decisoes-marca.md`.

| Campo | Valor | Onde entraria | Status | Por quê |
|---|---|---|---|---|
| Forma de atuação (JUCEMG) | "Internet" / atividade fora do estabelecimento | C4 · Dados da empresa | 🟡 travado internamente, pendente de validação técnica | Não gera dúvida útil pro cliente nem interfere na atuação dele — vale enquanto o escopo for serviço 100% remoto. Reabrir se o produto passar a atender CNAEs com atendimento físico (cabeleireira, personal trainer etc.) |
| Tipo de unidade (JUCEMG) | "Produtiva" | C4 · Dados da empresa | 🟢 travado, corrigido 31/08 | 🔴 Estava documentado como "Sede" — ERRADO. Prints reais (Viabilidade e Integrador) confirmam "Produtiva": Sede/Filial nem aparece como opção fixa relevante pra uma constituição nova. Toda abertura nova (matriz) usa Produtiva |
| Metragem (m² do imóvel + m² da operação) | 20 m² (fixo) | C4 · Dados da empresa | 🟢 travado, resolvido 31/08 | 🔴 Estava "não implementado, sem decisão" — RESOLVIDO. Print real da Viabilidade mostra Área Total e Área Utilizada sempre preenchidas com 20,00 — mesmo valor usado em toda a gravação, virou padrão |
| Profissão (titular E qualquer sócio) | "Empresário" | C1 · Seus dados / C3 · Sócios | 🟢 travado, validado 31/08 pelo Pedro | Campo obrigatório no Integrador (Dados do Sócio/Administrador) pra qualquer sócio — nunca varia por atividade, então não gera dúvida útil pro cliente. Preenchido igual pra titular e sócio extra |
| Qualificação do representante (JUCEMG/DBE) | "49 - Sócio-Administrador" | C1 · Seus dados | 🟢 travado | Sempre o mesmo código no DBE (Identificação do Representante) — não existe outra qualificação possível pra quem está constituindo a própria empresa |
| Capital social | R$ 10.000,00 (fixo) | C4 · Dados da empresa | 🔒 travado, validado 31/08 pelo Pedro | 🔴 ATÉ 31/08 era campo editável (chips R$1k/5k/10k + valor livre) — a reunião Rua Satélite 38-40 decidiu travar em R$10.000 pra prestador de serviço. Deixou de ser pergunta: o app mostra o valor, não pede mais |
| Valor nominal de cotas | R$ 1,00 | C4 · Dados da empresa | 🟢 travado | Campo do Integrador (Dados da Matriz) sempre preenchido como R$1,00 — o capital social é dividido em quotas de R$1, nunca outro valor nominal |
| Data de assinatura da declaração / início das atividades | dia do preenchimento (nunca retroativa) | C7 · Nome / razão social (dispara a viabilidade) | 🟢 travado | Integrador não aceita data retroativa — sempre o dia em que o RPA roda o processo, pros dois campos (mesma data) |
| Acesso ao endereço | "Pedestre" | C4 · Dados da empresa | 🟢 travado | Campo da Prefeitura de BH (Dados Adicionais), sempre Pedestre pro nosso perfil de prestador de serviço remoto — nunca veículo leve/pesado |
| "Atividade exercida no local?" (principal e secundárias) | Não (sempre) | C0 · Sua atividade / C5 · CNAE secundários | 🟢 travado | Marcar Não em TODAS as atividades é o que habilita a opção "Escritório/sede administrativa" — se qualquer uma virasse Sim, a Prefeitura entenderia como comércio/loja física, errado pro nosso perfil |
| "Atividade é inócua ou virtual?" | Sim (sempre) | C4 · Dados da empresa | 🟢 travado | Pergunta do Licenciamento (Corpo de Bombeiros): atividade sem circulação de pessoas no local, sempre verdade pro nosso perfil 100% remoto/administrativo |
| Sociedade de Propósito Específico? | Não (sempre) | C6 · Natureza jurídica | 🟢 travado | Cláusula do Contrato Núcleo — nenhuma empresa do nosso escopo (ME prestador de serviço comum) é SPE. Campo do contrato, não pergunta ao cliente |
| Capital Totalmente Integralizado em Moeda Corrente? | Sim (sempre) | C4 · Dados da empresa | 🟢 travado | Cláusula do Contrato Núcleo — o capital social (R$10.000, também travado) já entra integralizado, sem parcelamento |
| Tipo de contrato (Integrador) | Padrão · 15 cláusulas obrigatórias (sem anexo, sem cláusula extra) | Pós-C7 · Geração do contrato (RPA/Integrador) | 🟢 travado | 🔴 ACHADO-CHAVE (31/08): incluir anexo/procuração/cláusula extra no processo DERRUBA a elegibilidade ao Registro Automático (aviso visto ao vivo no print da JUCEMG) — por isso a opção de 15 cláusulas sem anexo é a única que usamos, nunca a de 7 cláusulas nem o contrato personalizado (upload) |
| Testemunhas (Contrato Núcleo) | Nenhuma (sempre) | Pós-C7 · Geração do contrato (RPA/Integrador) | 🟢 travado | Contrato padrão de 15 cláusulas não exige testemunha — campo sempre vazio, nunca preenchido |
| E-mail e telefone de contato (DBE/Integrador) | sempre o nosso (Legalizai), nunca o do cliente | DBE/Integrador · Dados para Contato | 🟢 travado | Evita que boletim de ocorrência (BO) ou notificação oficial da Receita/Junta chegue direto pro cliente por e-mail — a gente centraliza e repassa o que for relevante |
| Endereço de correspondência | sempre igual ao do estabelecimento | DBE/Integrador · Dados para Contato | 🟢 travado | Checkbox "igual ao do Estabelecimento" sempre marcado — nenhum caso do nosso escopo precisa de endereço de correspondência diferente |
| Natureza jurídica (SLU × LTDA) | SLU se sem sócio · LTDA se com sócio (automático, sem pergunta) | C6 · Natureza jurídica (REMOVIDA 31/08) | 🟢 travado, validado 31/08 pelo Pedro | 🔴 ATÉ 31/08 era pergunta ao cliente (recomendação editável, Leonan 24/08) — a reunião Rua Satélite 38-40 decidiu tirar a pergunta de vez: a regra (sem sócio→SLU, com sócio→LTDA) não tem exceção real no nosso escopo, então virou decisão de backend nos dois casos. Tela e rota `/dossie/natureza` removidas do app |
| Tipo de endereço (JUCEMG) — endereço fiscal Legalizai | "Endereço virtual" (fixo) | C4 · Dados da empresa | 🟢 travado, validado 31/08 pelo Pedro | Confirmado na gravação real (RS38): quando a empresa usa o endereço fiscal da Legalizai (não o do cliente), o valor sempre enviado à JUCEMG é "Endereço virtual" — nunca aparece como opção pro usuário, só se aplica ao caminho endereço-próprio ("proprio"/"coworking") |
| Requerente (emissão do DAE) | sempre o titular (sócio-administrador) | Pós-C7 · Emissão do DAE (RPA) | 🟢 travado | Quem solicita a taxa no Integrador é sempre a pessoa que está constituindo a empresa — não existe cenário de "outro requerente" no nosso fluxo |

## Nota de fonte

Gerado direto do campo `dados` de `flow-data.mjs` — reflete o que está **documentado como construído**, não necessariamente o que está validado em produção (ver campo `validado` de cada nó). Qualquer mudança de campo nessas telas precisa entrar em `flow-data.mjs` primeiro; rodar o gerador de novo atualiza esta nota sozinho.
