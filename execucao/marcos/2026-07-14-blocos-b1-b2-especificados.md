---
tipo: historico
status: congelado
data: 2026-07-14
etapa: spec-blocos
tags: [marco, produto, spec, blocos, onboarding, decisao]
---

# 🧱 Marco — Blocos 1 e 2 do fluxo especificados + KINAE aposentado

> Flow de lapidação Pedro + Claude sobre a tarefa P0 "Especificar os BLOCOS do fluxo". Nasceu a nota-contrato [[blocos-fluxo-abertura]] (interface Pedro↔Dev, com Fontes-verdade rastreáveis). Fontes: [[processo-abertura-empresa-bh]] · [[2026-07-09-conversa-izabela]] · [[2026-07-13-conversa-karla]] · [[fluxo-abertura-portais-pedro-dev]].

## Decisões travadas (14/07)

### Terminologia
- **"KINAE" aposentado → "CNAE"** (principal/secundário). Era transcrição Plaud, não conceito distinto. Normalizado em todo o vault; nota de normalização deixada na ata [[2026-07-13-alinhamento-pedro-dev-leonam]].

### Bloco 1 — Porta de entrada / Qualificação
- Job = pergunta binária "esse cliente é pra gente?", fricção mínima.
- **Conta criada DEPOIS** do veredito 🟢 (mostra valor antes do cadastro).
- B1 = só binário atende/não; enquadramento fino é o B2.
- **Mapeamento CNAE = mini-loop com score de confiança** (não string→string). Ambiguidade que cruza a linha atende/não → **desambiguação obrigatória** → persistindo dúvida → **humano**. Nunca 🔴 automático. Motivo: **falso 🔴 (bounce quem atende) = pior erro possível** (pagante perdido).
- **Filtro por regime** = guarda invisível (ICP travado em Simples); whitelist ~300 CNAE com 3 critérios (serviço + Simples-elegível + não-regulamentada).
- **Roteamento:** 🟢 atende → B2 · 🟡 regulamentada → **waitlist do produto (só)** · 🔴 não atende ("maiores") → **comercial do Mauro (tradicional)**. Lógica: waitlist = futuros clientes do app; Mauro = quem nunca será do app (vira canal de aquisição do escritório).
- **Pendência do bloco:** construir o **Mapa de Confusão CNAE** (pares traiçoeiros de desambiguação) — deferido de propósito p/ não desviar foco.

### Bloco 2 — Coleta + Enquadramento (IACA)
- Output = **dossiê de constituição** (alimenta os blocos de constituição). Cobre Fase 0+1 da Izabela.
- **Natureza jurídica:** IA recomenda default (SLU p/ solo) + explicação; cliente confirma.
- **Ordem do wizard:** simulador **cedo** (engajamento) → **candidato a A/B**.
- **Secundários:** IA sugere sozinha + **pill de prova social** no card; cliente edita.
- **Faturamento estimado = faixa guiada** (não campo aberto) + **default inteligente** cruzando CNAE+sócios + slider opcional. Insight: faturamento **não é campo legal** (não entra em DBE/contrato; esses usam capital social) → é input de simulação; faixa não compromete nada legal e é mais honesta (empresa nem existe ainda).
- **Motor Fator R:** folha ≥28% faturamento → Anexo III (6%) senão V (15,5%); simulador A×B + transparência de custo (folha + pró-labore líquido).
- **Validações:** pró-labore mín. 1 salário; sócio ≠ CLT da própria empresa; duplo vínculo CLT (campo manual + teto INSS).
- **Sem pausa externa** — só soft-pause self-service (salvar & retomar). Fim → handoff pro B3.

## Pendências
- 🟡 **Larissa (fiscal):** anexos diferentes (tributa pela maior × pela nota) — bloqueia parte do motor de enquadramento do B2.
- ⏳ **Mapa de Confusão CNAE** — construir a partir da matriz.
- Especificar **Blocos 3+** (cobrança → constituição → certificado → portal).
- 🟡 Confirmar com Izabela que nenhum doc de abertura captura receita estimada.

## Links
- [[blocos-fluxo-abertura]] · [[2026-07-13-plano-sequencia-pm]] · [[kanban-legalizei]] · [[HOME]]
