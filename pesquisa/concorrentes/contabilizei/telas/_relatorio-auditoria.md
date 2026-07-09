---
tipo: artefato
data: 2026-07-09
concorrente: Contabilizei
fonte: app
gatilho: ux-auditoria
tags: [concorrente, ux, insight]
---

# 🔬 Auditoria UX/UI da plataforma logada — Contabilizei (consolidado)

> 15 telas × desktop + mobile (30 prints), auditadas por 3 avaliadores contra rubrica de 6 eixos (0–10). Conta real do Pedro, 2026-07-09. Notas por tela: pasta `telas/`. Método/stealth: [[README]].

## Ranking — pior média = maior oportunidade nossa

| # | Tela | Média | Maior brecha (nossa entrada) |
|---|---|---|---|
| 1 | **Dados da Empresa** ⚠️ | 4.8 | Não tem tela de 1ª classe — CNPJ/contrato social sem atalho. **Confirma a dor mapeada.** Cunha mais barata e demonstrável |
| 2 | **Mensalidade** | 4.8 | **Mobile QUEBRADO** (só skeleton cinza) numa tela de DINHEIRO. Desktop = só banner sem ação |
| 3 | **Rotinas Mensais** | 4.8 | Empty state ambíguo "Sem informações" onde devia dizer "tudo em dia" ou "falta X, vence dia Y" |
| 4 | **Relatórios** | 5.8 | Contabilês puro (DRE, Balancete, Razão) sem tradução nem prévia |
| 5 | Meus Benefícios ⚠️ | 6.2 | Vende disfarçado de "benefício"; não separa incluído × parceria opcional |
| 6 | Minhas Rotinas | 6.3 | Item de menu carrega a Home inteira — não existe tela dedicada de rotinas |
| 7 | Folha de Pagamento ⚠️ | 6.5 | Menu não adapta ao perfil (ME sem funcionário vê "Folha" e cai na Home) |
| 8 | Home | 6.5 | 7 iscas de cross-sell diluem o "o que fazer agora e quanto pagar" |
| 9 | Rotinas Anuais | 6.5 | Padrão-ouro "✓ TRANSMITIDO + recibo", mas sigla crua (DEFIS) e tabela espremida no mobile |
| 10 | Plano de Saúde | 6.7 | Popup de NPS por cima da tarefa; "até 30%" sem número real |
| 11 | Contabilizei Bank | 7.0 | Landing de venda vestida de tela de produto, dentro do app logado |
| 12 | Emitir NFS-e | 7.2 | Não é listagem de verdade (sem tabela status/valor); filtros truncam no mobile |
| 13 | Sócios e Pró-labore | 7.2 | Caixa-preta "cálculo inteligente" — falta bruto/líquido lado a lado + simulador |
| 14 | Faturas | 7.3 | Proatividade forte, mas cross-sell rouba 1/3 e "Fale conosco" tapa CTA no mobile |
| 15 | **Conta Bancária PJ** | 7.7 | Melhor tela; ainda diz "movimentações" mas só mostra cadastro |

**Média geral ≈ 6.3.** ⚠️ = tela caiu na Home na captura (nota provisória, recapturar).

## 5 padrões que atravessam tudo (a estratégia sai daqui)

1. **🥇 "Mobile first" deles é falso.** Mobile foi o eixo MAIS FRACO em quase toda tela: Mensalidade quebrada, bottom-nav flutuante sobre conteúdo, filtros/abas truncados ("Nc", "Ju", "…DECLA"). **Como o Legalizei nasce mobile-first de verdade, essa é nossa maior vantagem demonstrável** — e joga contra o marketing deles.
2. **Cross-sell sufoca o job do usuário.** Home, Faturas, Benefícios, Bank empurram produto (débito automático, baixar app, plano saúde, cobrar cliente, indique amigo). Nossa home responde só: o que vence, quanto, e o que já cuidamos por você.
3. **Contabilês sem tradução.** DARF, DEFIS, DRE, Balancete, Competência, Pró-labore aparecem crus. Uma linha humana por termo = diferencial barato (linguagem foi eixo fraco recorrente).
4. **"Dados da Empresa" é a brecha de ouro.** O líder não dá atalho de 1ª classe pra CNPJ/CNAE/regime/contrato social — a dor que o Léo confirmou por dentro. "Minha Empresa" no topo do menu, tudo copiável e baixável em 1 clique = vitória fácil, visível, testável.
5. **Confiabilidade descuidada onde mais importa.** A tela que quebrou foi a de COBRANÇA (mensalidade mobile). Nosso princípio (§10.6 da base: "confiabilidade > velocidade de feature") vira prova viva de contraste.

## O que COPIAR (onde eles merecem nota alta)
- **Central de Rotinas proativa:** calendário com vencimentos + "Pendências críticas" em vermelho + previsão de DARF com valor e prazo. É o núcleo a igualar (e superar com lembrete configurável + recálculo — ver [[playbook-crm-contabilizei]]).
- **Padrão de confiança "✓ TRANSMITIDO em verde + comprovante baixável"** (Rotinas Anuais).
- **Responsividade pontual boa:** Relatórios (5 botões → 1 dropdown no mobile), Conta Bancária (tabela → card).
- **Bloco anti-fraude/segurança** do Bank.

## Atualização 2026-07-09 (recaptura + wizard) 🟢
- **Wizard de emissão de NF CAPTURADO** ([[nf-emissao-2]], média 6.5 · [[nf-emissao-1]] seleção de tomador, 5.2). Núcleo bom (auto-preenche NBS pela CNAE, alíquota visível, "cancele no mesmo mês") mas: descrição manual apesar de saberem o formato, sem preview, jargão, e **mobile quebra na tela mais crítica** (nav inferior corta o form). É onde o Legalizei mais ganha.
- 🔴 **Dark pattern achado:** no passo de emissão, um **modal de cobrança por medo** bloqueia quando a mensalidade está atrasada ("Aqui está o que você perde", "riscos de ficar sem contador", "Multas federais…"). Pressiona no pior momento. Nossa contra: cobrança digna, não-bloqueante.
- **Refino das 3 recapturas:** `dados-da-empresa` (4.8→6.0) é DROPDOWN, não tela — mas mais rico que supúnhamos (CNPJ, regime, IM, Copiar dados, certificado, Área de Documentos); faltam CNAE/nome fantasia/IE. `folha` = flyout com 2 sub-destinos reais. `meus-beneficios` = tela dedicada com rota `#/beneficios/landing-upsell` → **confirma "benefício = venda"**.
- **Inconsistência de preço:** banner Home "plano Padrão R$210,90" vs landing "Avançado R$195" — mancha de transparência (munição pro nosso posicionamento).

## Pendências desta auditoria
- Faltou o onboarding logado (já coberto por email em [[onboarding-jornada-completa]]).
- Passos finais da emissão (após "Continuar") não percorridos — proposital, pra não emitir nota real.

## Uso
Alimenta direto: spec do MVP (S4), wireframes do Legalizei, e a pauta técnica com o Pedro Dev (nossa auditoria UX + a análise tech dele = teardown completo). Prioridade de construção segue o ranking: as telas 1–4 (4.8–5.8) são as mais fáceis de superar.

## Links
- [[contabilizei]] · [[playbook-crm-contabilizei]] · [[onboarding-jornada-completa]] · [[2026-07-08-conversa-leo-pedro-dev]] · [[HOME]]
