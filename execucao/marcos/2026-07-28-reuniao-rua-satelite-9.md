---
tipo: marco
status: vivo
data: 2026-07-28
assunto: reuniao-rua-satelite-9-decisoes-flow
deriva_de: [flow-data, mapa-flow-mermaid]
tags: [produto, ux, flow, decisoes, jucemg, reuniao]
---

# 🗺️ Reunião "Rua Satélite 9" (28/07) — 12 decisões travadas no flow

> Ata gravada (resumo em .md trazido pelo Pedro) cruzada contra o flow de abertura atual (N1→ATIVA), célula por célula. As 12 decisões abaixo **já estão implementadas em código** (não só documentadas) — ver `execucao/flow/flow-data.mjs` v9 e o histórico de versões em `flow/versoes/`.

## O gatilho: cruzamento com os dados reais de constituição na JUCEMG

Antes da reunião, cruzamos os 17 campos exigidos pra constituir empresa (EMPRESA · SÓCIO · ENDEREÇO) contra as telas N1–N18. Achado: **12 de 17 já eram captados**, mas 4 faltavam de verdade (objeto social, logradouro completo, residência de sócio, atividade inócua) e o CPF era pedido 2× sem reuso. A reunião resolveu esses buracos e foi além, revisando roteamento e ordem de cobrança.

## As 12 decisões

| # | Decisão | Onde mexe | Status |
|---|---|---|---|
| 1 | **N3 = 3 rotas confirmadas** (abrir · migrar · já sou cliente) | Nenhuma mudança estrutural — a arquitetura já estava certa | ✅ confirmado |
| 2a | **CNAE travado** (não vira "KINAI") | Terminologia do produto | ✅ travado |
| 2b | **Gate de cidade novo** — MLP só atende Belo Horizonte/MG | N3 ganhou 2º passo (`N3G`) + saída dedicada `/saida/fora-bh` | ✅ construído |
| 2c | **Veredito 🔴 vira 3 vias** (era 2) | Waitlist (regulamentado) · "Contato especial" (Mauro atende) · **novo:** "Fora de escopo" (ninguém atende, decline limpo) | ✅ construído (`Resultado.motivo`) |
| 2d | 3+ sócios → juntar com waitlist? | Saída `SS` | 🟡 tentativo, "estou pensando" — NÃO travado |
| 2e | Sócio exterior → descartar saída dedicada? | Saída `SE` (tem conteúdo jurídico LC123 revisado) | 🟡 tentativo — NÃO travado, não apagar sem confirmação |
| 2f | **Atalho "já sei meu CNAE"** em N4 | Pula descrição, vai direto pra consulta | ✅ construído |
| 3 | **Front-load de dados pessoais** — nome/CPF/telefone/endereço migram pro N6 | N6 reescrito (+ validação por código) · N10 vira tela de confirmação | ✅ construído |
| 4 | **Waitlist ganha campo CNAE pretendido** | Read-only, junto de nome+contato. Tags de CRM ficam pra depois (não trava) | ✅ construído |
| 5 | Aceite jurídico: PDF ou modal? | N8/N20 | 🟡 aguarda jurídico, mantido como está |
| 6 | **IPTU vira obrigatório travado** — sem ele não passa na JUCEMG | N13 | ✅ construído |
| 7 | Faixas de capital social sugeridas | N13 | 🟡 aguarda validação com mais técnicos contábeis, mantido como está |
| 8 | **REC: retry automático pelas 3 opções de nome** (N16) antes de pedir ajuda ao cliente | REC reescrito, testado no browser até esgotar as 3 | ✅ construído |
| 9 | **DAE (taxa da Junta): cliente paga, do jeito que já está** = definitiva. "Empresa paga" = alternativa documentada, opcional | Nenhuma tela nova — repasse à JUCEMG é timing de backend pós-viabilidade, invisível pro cliente. Cenário alternativo via `?cenario=empresa-paga` em N7/N9/N19/N20 (só as 4 telas que mudam) | ✅ construído + documentado |

## O erro corrigido na própria reunião

Minha primeira proposta pro item 9 (cenário B) inventava uma **tela nova de pagamento pós-viabilidade** — errado. O Pedro corrigiu: o cliente paga tudo junto no N9 (como hoje); a Legalizai só **segura o valor** e repassa à JUCEMG depois que a viabilidade aprova. Reorder é operacional, não visual. Zero tela nova.

## O que NÃO foi tocado

`_contrato/motor/` (as 19 personas, o contrato de comportamento no repo do dev) **segue refletindo o flow antigo** — com N5 e N18, sem o gate de cidade, sem o veredito de 3 vias. Reconciliar exige revalidar as 19 personas uma por uma; não é ajuste mecânico. Ficou como dívida explícita no commit e na PR.

## Fontes
- `execucao/flow/flow-data.mjs` (fonte-única, campo `dados` + `falta` de cada nó, buscar `28/07`)
- `execucao/mapa-flow-mermaid.md` v9 (diagrama + tabela regenerados)
- PR #1 em `legalizai-story-book-app` (branch `sync/28-07-portal-e-jucemg`)

## Links
[[mapa-flow-mermaid]] · [[legalize-motor-testes-arquitetura]] · [[HOME]]
