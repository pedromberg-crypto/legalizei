---
tipo: hub
status: vivo
data: 2026-07-19
---

## 🦴 ESPINHA — caminho crítico (North Star: abrir 1 empresa real) · [[2026-07-13-plano-sequencia-pm]]

- [ ] **[Pedro] Cauda do flow (N19–N25)** — revisão do dossiê, termo de início irreversível, painel de acompanhamento, assinatura GOV.BR, dia-2 (1ª nota/1º imposto/certificado) ⏫
- [ ] **[Pedro] Decidir a cobaia do E2E** — a do North Star foi gasta (CNPJ do Pedro já existe): 2ª empresa, outra pessoa, ou usar o caso dele no flow #2 (migrar) 🔴
- [ ] **[Dev] Teste E2E do backend** (robôs RPA: busca → clica → protocolo + cancelamento na Junta) — dev em validação de APIs, aguardando algo mais definitivo
- [ ] **[Dev] IACA** — entrevista → CNAE principal + 3 secundários + projeção de alíquota + prolabore
- [ ] **[Dev] Infra própria** (banco/nuvem) — em curso
- [ ] **[Dev] Bitwarden "Legalize"** + centralizar credenciais — em curso
- [ ] **[Pedro] Convidar `pedro.melodata`** no repo `base-flow-legalizai-story-book` (acesso é do Pedro)
- [ ] **[Pedro/Dev] Mapa de Confusão CNAE** — pares traiçoeiros de desambiguação (treino IA + guarda-corpo do falso 🔴); deferido de propósito → [[blocos-fluxo-abertura]]
- [ ] **[Dev] Portal mínimo:** emitir nota + ver vencimentos — semana 3

## 🎨 TELAS — o wizard em código (`app/`, `/mockup`)

- [x] **A1 — coleta do dossiê (N10–N16)** — 7 telas, shell APP, form components locais · 19/07
- [x] **A2 — veredito 🟢/🟡/🔴** — fonte única `veredito.tsx`, 3 rotas + confete da marca no CTA 🟢 · 19/07
- [x] **A3 — número** — N5 teaser 3 modos + N17 CNAE ótimo (valores derivados da `lib/fiscal`) · 19/07
- [x] **Entrada N1–N3** (splash · welcome · fork), sem a palavra "migrar" (UX-55) · 19/07
- [x] **Dinheiro N6–N9** (conta · a conta da abertura · aceite · pagamento) — travessia inteira · 19/07
- [x] **A7 Espera** (retomar · boleto) + **A9 Saída graciosa** (exterior · 3+ sócios) + Login · 19/07
- [x] **Infra DS:** `lib/passos.ts` (fonte única, 10 passos) · `ui/tela.tsx` + `ui/form.tsx` promovidos · `Card` com `tom` · 19/07
- [ ] **Rodar as telas contra as 19 personas** (validar a experiência construída)
- [ ] **Inverter guarda-corpo das pills** — hoje obriga todo CNAE a ter pill; virar "toda pill só aponta pra 🟢" → sobram ~6 pills → [[legalize-pill-estreita-nao-valida]]

## ⚖️ Decisões caras a FORÇAR

- [ ] **Certificado digital → começar TERCEIRO** (Sete Minas, mesmo dia); internalizar depois — sondar/fechar
- [ ] **Prazo de fidelidade** do plano (12m como o líder? menos, pra vender mais fácil?) — 🟡 Pedro valida
- [ ] **Contrato + termo de início** (Mauro/Larissa) — redação jurídica das 4 camadas de cancelamento
- [x] **Gateway → Asaas** (cartão/Pix/boleto) — travado 14/07
- [x] **Cobrança** — abertura grátis + 1ª mensalidade = 1º mês; boleto fora do happy path — 14/07
- [x] **Cancelamento em 4 camadas** (autorização expressa + taxa não reembolsável + fidelidade + pagar antes de constituir) — 14/07
- [x] **Limite 2 sócios · endereço fiscal = upsell · 1 plano único · MVP só serviço · sócio exterior = bloqueio** — 15/07

## 🕓 Fila humana (não bloqueia) → [[fila-validacao-humana]]

- [ ] **[Larissa] 91 CNAEs duvidosos** — 7 baldes com pergunta fechada; urgente: 10 que exigem conselho estão como "atende" (cobra antes de barrar)
- [ ] **[Larissa] SLU × LTDA de sócio único = mesma natureza?** Se sim, uma tela do app não precisa existir (CNPJ do Pedro é a prova)
- [ ] **[Larissa] 7 pontos fiscais** — mecânica meses 2-12, CPP-no-DAS, FS12 caixa, citações CFC, DEFIS, taxas BH → [[perguntas-larissa-fiscal]]
- [ ] **[Pedro] Martelo nos 45 CNAEs impossíveis** (ninguém abre empresa disso)
- [ ] **[Contadores] Crivo dos 124 CNAEs "sobreviventes"** — são NÃO-refutados, não validados
- [ ] **[Mauro] Preço do plano** (placeholder ~R$195 FAKE; não bloqueia) · **UX-42** (servir nutri com RT? cotar MEI/Lucro Presumido nos bloqueios?)
- [ ] **[Pedro] Decisões do dev** — chave de idempotência · providers CPF/situação + cartão CNPJ → `contrato/decisoes-abertas.md`
- [ ] **[Larissa] Ratificar CNAE ótimo** + swaps de menor confiança (tráfego pago/white-label) → [[cnae-fiscalmente-otimo]]
- [ ] **[Dev] Validar nome na Junta = validar viabilidade da empresa?** Muda o que dá pra liberar antes do pagamento
- [ ] **INPI** — busca de anterioridade pronta p/ consultor PI do Mauro → [[legalize-marca-inpi]]

## 🎀 ENFEITE — validado, DEFERIR (backlog pós-espinha)

- [ ] Estudar **API p/ puxar notas externas** (refresh ~5 dias) — validar custo
- [ ] Mapear **custos unitários de APIs** (InfoSimples × CEPRO × alternativas) · [[2026-07-08-conversa-leo]]
- [ ] **Extensão de navegador** (estilo Melius) empurrando o cliente pro app
- [ ] Automatizar **obrigações acessórias** via rotina/API no domínio (com o Léo)
- [ ] Cards de **notícia por CNAE** (SSR) no dashboard → base de monetização
- [ ] Parcerias com **conselhos** (medicina/advocacia) — comissão por lead
- [ ] **Anti-scraping** (bloquear bots de concorrente; acesso manual liberado)
- [ ] Lembrete WhatsApp p/ assinatura pendente (cadência 1x/dia, anti-spam)
- [ ] Dashboard CRM/Kanban c/ automação condicional (card pula → WhatsApp) + conexão Leghub p/ leads não atendidos
- [ ] **Escada de expansão CNAE** — do happy path (103 serviço-liso) até os 387; médio×alto = municipal, deferido → [[cnae-complexidade-abertura]]

## 👥 Time / paralelo (fora do caminho crítico)

- [x] **2º dev júnior contratado — começou 21/07** (além do Pedro Dev/`pedro.melodata`) ⏫ ⚠️ *confirmar qual dev recebeu as páginas do flow (abaixo)*
- [x] **Enviadas ao dev as páginas iniciais do flow de abertura** (do zero) + mais algumas — material de arranque
- [ ] **Onboarding do 2º dev júnior** — o quê ele pega primeiro (flow de abertura?), sob revisão de quem, fluxo branch→review→merge
- [x] **Gestor de tráfego pago autorizado — início agosto/2026** ⏫ ⚠️ *amarrar a objetivo EXPLÍCITO: smoke test de demanda (o V0 da BASE §4), não "gerar leads" genérico — pré-requisito: LP publicada + waitlist funcionando*
- [ ] Contratar **operador** (amigo do Pedro Dev: CC + IA + assistentes WhatsApp) + onboarding sob instrução
- [ ] Definir fluxo **branch → review → merge** pro operador (agora vale pros 2 devs + operador)
- [ ] Abrir conta **API WhatsApp Business** + treinar assistente em número simbólico → oficial
- [ ] **Registrar domínios de fato** (Hostinger 3 + registro.br legalizai-story-book.app.br) — Mauro pagou ✅; depois DNS→Vercel + email contato@legalizai-story-book.app
- [ ] **Repo/Vercel do app** `app/` — decisão do Pedro, depois
- [ ] **Banner PNG final do LinkedIn** + linktree waitlist → [[redes-sociais]]
- [ ] **Review visual da LP** pelo Pedro (`npx serve ux-ui/lp -l 4173`) + Sora local + links reais das lojas

## 📚 Backlog (anterior — ainda válido)

### Dev (reunião 09/07) → [[2026-07-09-conversa-pedro-dev]]
- [ ] V2 das stacks: Cloud (Supabase × AWS × Azure) — custo/segurança/IA-MCP
- [ ] Esgotar busca por API da JUCEMG (se não achar, construir) 🔴
- [ ] Mapear API×RPA por portal gov (JUCEMG, Redesim, ALF, DES-BH/BHISS, SISDRAM, SIARE)
- [ ] 2FA obrigatório (e-mail/SMS/WhatsApp)
- [ ] Anti-robô + anti-print desde o início

### Marca / pesquisa
- [ ] Design System (tokens) — pós derivados do logo (favicon/app-icon) + teste de fogo
- [ ] Refazer teardown cronometrado da Contabilizei (tempo de resposta) + 1 concorrente
- [ ] Overlay tributário (anexo/Fator R/alíquota) dos CNAEs do nicho · [[cnae-matriz-governo]]
- [ ] Cobertura CNAE dos outros concorrentes (Agilize, Contaja...) · [[cnae-matriz-governo]]

## ✅ Concluído

- [x] **Wizard N1–N9 + dossiê + espera/saída — 26 telas em código, `/mockup` sem grupo vazio** — 19/07 → [[2026-07-19-telas-n1-n9-espera-e-saida]]
- [x] **Pesquisa fiscal fechou 8 pendências** (taxa Junta R$268,51 · CPP no Fator R · Anexos · prazos) — 19/07 → [[fiscal-simples-bh-2026]]
- [x] **Cobaia analisada** — Pedro paga 6%, tese virou monitoramento (Fator R vivo) — 19/07
- [x] **CNAE furada na raiz** achado + limpeza 45/91/124 (script re-executável) — 17/07 → [[limpeza-260-servico]]
- [x] **Tabela CNAE do líder extraída** (387, com anexo/Fator R/faixa) — 17/07 → [[cnae-atendidos-hub]]
- [x] **Eixo de complexidade de abertura** (170 liso/120 verificar/97 tato) — 17/07 → [[cnae-complexidade-abertura]]
- [x] **Motor v0.4.0** — 19 personas, 2 flows (abertura + migrar), 19/19 PASS
- [x] **Ordem do app invertida** — cobra no N9, não no fim
- [x] **HANDOFF pro dev — repo `base-flow-legalizai-story-book`** (motor + spec + contrato + dados) — 16/07
- [x] **UX-48 trilha única + coorte instrumentada** travada — 16/07
- [x] **4 rodadas de UX** (45 ✅/1 🟡); % por persona convergiu 76-92 → 88-95 — 15/07
- [x] **CNAE fiscalmente ótimo** — dado Gemini cruzado, ISS BH mapeado — 15/07
- [x] **Instagram @legalizai-story-book.app + LinkedIn** criados — 13/07
- [x] Handoff Git → Dev: repo **base-ds-legalizai-story-book** (8 telas + LP v1 + Lotties) — 13/07
- [x] **Mauro PAGOU domínios** (Hostinger R$312,11 + Registro.br R$76,00) — 13/07
- [x] Landing page v1 construída (local) · [[2026-07-12-lp-construida]]
- [x] Protótipo do fluxo de entrada inteiro navegável · [[2026-07-12-fluxo-entrada-completo-prototipo]]
- [x] Logo fechado (símbolo + logotipo, vetor) · [[2026-07-12-logo-fechado]] · Fonte Sora travada
- [x] Marca: nome + conceito + tom + paleta
- [x] Stack + MLP + multi-tenant decididos · [[2026-07-09-stack-e-mlp-decididos]]
- [x] Fluxo de abertura BH validado c/ Izabela · [[2026-07-09-fluxo-abertura-validado-izabela]]
- [x] Matriz CNAE (governo) — atendidos × não · [[cnae-atendidos-e-nao-atendidos]]
- [x] Teto de automação (órgãos sem API) mapeado · [[2026-07-10-teto-automacao-orgaos-sem-api]]
- [x] 6 teardowns de concorrentes + páginas públicas + tom
- [x] [[assinar-nda-e-acessos]] — NDA + acessos (negócio fechado 07/07) · [[framework-sociedade-1-pagina]]

%% kanban:settings
```
{"kanban-plugin":"board","list-collapse":[false,false,false,false,false,false,false,false]}
```
%%
