---
tipo: spec
data: 2026-07-14
status: em-construcao
tags: [produto, ux, telas, mobile, onboarding, caminho-critico]
---

# 📱 Mapa de telas mobile — inventário temos × faltam

> Estado de construção das telas do fluxo de abertura, na ordem. Casa com os blocos do [[blocos-fluxo-abertura]]. "Temos" = HTML no protótipo `ux-ui/prototipo/`. Objetivo: base de trabalho pra fechar B2 + B3 em tela. Companheiro dos [[casos-teste-fluxo-cnae|casos de teste de fluxo]].

## Onde paramos
- Protótipo cobre **entrada + B1 + começo do B2** (telas 1–6).
- Faltam **8 telas do B2** (7–14) + **6 do B3** (15–20). Checkout do B3 fica no fim; tem o miolo do B2 no caminho.

## Inventário (na ordem do fluxo)

| # | Tela | Bloco | Temos? | Arquivo | O que é (simples) |
|---|---|---|---|---|---|
| 1 | Splash | entrada | ✅ | `splash.html` | Abertura coral, logo, handoff |
| 2 | Welcome (3 telas) | entrada | ✅ | `welcome.html` | Boas-vindas, o que o app faz |
| 3 | Entrada (fork) | entrada | ✅ | `fluxo-entrada.html` | "Já tenho CNPJ" × "Quero abrir" |
| 4 | Gate-CNAE | **B1** | ✅ | `gate-cnae.html` | Descreve atividade → valida CNAE → veredito 🟢/🟡/🔴 + waitlist |
| 5 | Login / criar conta | B1→B2 | ✅ | `login.html` | Cria conta depois do 🟢 |
| 6 | 2.1 Dados do sócio | **B2** | ✅ | `fase-0-dados-socio.html` | Nome, CPF, estado civil, endereço |
| 7 | 2.2 Duplo vínculo CLT | B2 | ❌ | — | "Tem outro emprego CLT?" + valor + aviso teto INSS |
| 8 | 2.3 +Sócios | B2 | ❌ | — | Dados dos outros sócios (se houver) |
| 9 | 2.4 Dados da empresa | B2 | ❌ | — | Endereço, IPTU, capital social |
| 10 | 2.5 CNAE secundários | B2 | ❌ | — | IA sugere secundários + pill prova social; cliente edita |
| 11 | 2.6 Natureza jurídica | B2 | ❌ | — | IA recomenda default (SLU p/ solo); confirma |
| 12 | 2.7 Razão social + fantasia | B2 | ❌ | — | Nomes + checagem de viabilidade |
| 13 | 2.8 **Simulador Fator R** | B2 | ❌ | — | **Clímax:** Anexo III×V, pró-labore, quanto economiza |
| 14 | 2.9 Revisão do dossiê | B2 | ❌ | — | Confere tudo → handoff pro pagamento |
| 15 | Recap do valor | **B3** | ❌ | — | Reprisa economia do Fator R + "o que você leva" |
| 16 | Escolha do plano | B3 | ❌ | — | Tiers ancorados na faixa; vitrine só o mensal |
| 17 | Detalhe de custos | B3 | ❌ | — | Separa honorário × taxas de governo (repasse) |
| 18 | Aceite do contrato | B3 | ❌ | — | Contrato honorários + termo de início (pausa assinatura) |
| 19 | Pagamento (Asaas) | B3 | ❌ | — | Cartão / Pix / boleto |
| 20 | Pagamento confirmado | B3 | ❌ | — | "Ok, começamos sua abertura" → destrava B4 |
| 21+ | Constituição (DBE→JUCEMG→certificado→portal) | **B4+** | ❌ | — | Nem specado ainda |

## Links
- [[blocos-fluxo-abertura]] — spec dos blocos (state machine)
- [[casos-teste-fluxo-cnae]] — personas p/ validar a lógica do fluxo
- [[legalize-prototipo-ux]] · [[2026-07-12-fluxo-entrada-completo-prototipo]] · [[HOME]]
