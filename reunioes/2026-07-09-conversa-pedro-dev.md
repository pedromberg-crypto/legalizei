---
tipo: reuniao
data: 2026-07-09
participantes:
  - Pedro Maia
  - Pedro Dev
tags: [decisao, tech]
---

# Reunião — Pedro Dev: stack, arquitetura e MLP (17:40)

## Contexto
Conduzida pelo [[playbook-reuniao-pedro-dev]] (fluxo App×Leghub → stack → arquitetura → integração → produto → UX → MLP). Vocês passaram bloco a bloco. **Muita coisa decidida; cloud e integrações ficaram pra V2.** Fonte: transcrição + Plaud.

## 🟢 DECISÕES TRAVADAS

### Stack (definitiva)
- **Linguagem: TypeScript/JavaScript** (front + back, mesma linguagem) — "definitiva, ao infinito".
- **Front: React Native + Expo** (revertido do Flutter — Dart não reaproveita pra web; RN reaproveita código pro desktop). **Mobile-first**; desktop = **réplica funcional** (emitiu no celular, aparece no desktop instantâneo).
- **Back: TS/JS na Vercel** (rotas de API, requisições, automações).
- **Banco: Supabase/Postgres** — 🟡 mas sob revisão (ver Cloud abaixo). Back-end mora no Supabase + tabelas multi-tenant.
- **Design: Tailwind + Cloud Design** (animações estilo Duolingo, plugins pra visual "menos cara de IA").
- **Modelos IA:** **Fable 5** (construção/dev) + **Opus 4.8** (operação/produção — Fable é caro demais pra operar). Cloud Vision + Opus 4.8 pra OCR de documentos. (Pedro Dev usa plugin PCPix que encoda input em imagem = -70% tokens.)
- **Background jobs:** Workers Node + Trigger.dev (robôs fiscais, filas de deploy).

### App × Leghub → **CONSTRUIR DO ZERO** 🔑
- **Legalizei = produto novo, do zero.** Leghub é **single-tenant interno** (outro propósito); Legalizei é **multi-tenant** pra comercializar. Não reaproveita.
- **Multi-tenant TRAVADO** (visando venda; oposto do single-tenant interno).

### Integrações (build-vs-buy)
- **Preferência: construir interno** (escalabilidade). Exceção inicial: **certificado digital** (parceira externa comissionada — estratégico no início, nosso depois).
- **NFS-e: Focus NFe** ✅ (nossa recomendação). **Receita/consultas: InfoSimples** ✅ (já usa no Leghub; faz ECAC etc.). **Pagamento: Asaas** ✅ (checkout, Pix automático, boleto — o gateway que mapeamos na pesquisa).
- 🔴 **GARGALO CRÍTICO: JUCEMG não tem API.** InfoSimples faz junta de SP, NÃO a de MG. Playwright serve pros 30 testes mas NÃO escala. **Prioridade: esgotar busca por API** (Contabilizei opera em BH → solução existe; ligar, e-mailar, saturar). Pedro Dev confiante em pesquisar + replicar em semanas.

### Segurança (o forte dele — detalhado)
- **2FA obrigatório** pra todos (e-mail/SMS/WhatsApp) — não opcional. Motivado pela dor: Pedro mapeou 30 telas da Contabilizei; não quer ser scrapeado.
- **Anti-robô + anti-print (captura de tela) desde o início.**
- Autenticação middleware + autorização handler + **RLS no banco** + testes de invasão (OWASP) + bloqueio ativo de rota suspeita.
- **Certificado A1 = o dado MAIS sensível** (chave privada do CNPJ — vazou, emite nota em nome de qualquer um). No Supabase com **dupla camada + criptografia + rastreamento contínuo**; navega criptografado no back-end (invisível). Pedro Dev vai consultar pastor dele (Banco do Brasil) pra segurança bancária.
- **Backup em HD físico** (restauração rápida se hackear a nuvem — ele já viveu isso).

### Produto / MLP (confirmado)
- **MLP = abrir/migrar empresa + emitir NFS-e + pagar DAS + ver situação** (= o que o líder cobra R$195). ~3 meses.
- **2 matrizes de dados:** CNPJ (abertura) + certificado digital → alimentam tudo (DAS/NF = consultas).
- Diferenciais lovable confirmados (nossa auditoria): emissão 1-toque, onboarding sem fricção + **filtro CNAE por regime**, dashboard limpo/zero cross-sell, linguagem humana (traduzir DAS/DARF/SLU), proatividade (lembrete + recálculo, 1º grátis), dados-empresa em botão flutuante, transparência de custo/prazo, mobile-first de verdade. Fora: as 17 categorias, banco próprio, benefícios de terceiros, folha pesada.
- Insight que ressoou: **13 resets de senha** no relacionamento dele com a Contabilizei.

### Negócio / operação
- **Regional: BH only** (~100–175 mil CNPJs — nosso número). Sustentável em **5 mil assinaturas**, aspiracional 10 mil no 1º ano. Validar/estabilizar BH antes de expandir. Levar pro Mauro.
- **Cronograma: MVP pra 30–100 usuários de teste no início de outubro** (~8/out), escalar gradual.
- **Dailies: 2ª (8h30–9h, abre a semana) + 6ª (tarde, fecha).**
- **Suporte: assistente IA que EXECUTA** (estilo Hostinger, não só orienta) — Opus 4.8 ou Sonnet por custo. Testar.

## 🟡 PENDENTE (V2 — Pedro Dev pesquisa e a gente resenta)
- **Cloud: Supabase × AWS × Azure.** Pedro Maia empurrou: custo/margem em escala (pode dar R$15k/mês de diferença com 10k users) + é decisão "quase definitiva" (migrar depois = caos). AWS/Azure = mais barato/seguro/configurável mas complexo; Azure tem familiaridade dele (Windows Server). Pedro Dev traz **V2 das stacks** cruzando custo + **conectividade com IA/MCP**.
- **Contratar dev React** (acelerar) — decidir com Mauro; poderia entrar como time Legalizei.
- **Pedro Dev full-time no Legalizei** — hoje dividido com Leghub = risco de atraso. Pedro Maia vai bater na tecla com o Mauro.

## ✅ Tarefas (viram cards)
**Pedro Dev:** V2 cloud (Supabase/AWS/Azure + IA) · esgotar busca API JUCEMG · mapear API×RPA dos portais · estruturar 2FA · anti-robô + anti-print · protótipo de back-end "feião" testando conexões de API · consultar pastor (BB) segurança · pesquisar Asaas + conectividade IA.
**Pedro Maia:** Design System (tokens, até 6ª) · wireframe mobile-first (após concorrentes) · **mapear 4 concorrentes com a Jéssica** (abrir empresa em cada, onboarding ponta a ponta) · apresentar ao Mauro (build-vs-buy + foco BH + Pedro Dev full-time + novo dev) · definir parceria de certificado (preço/comissão) · resolver compartilhamento do vault · nº exato de empresas/CNAEs BH + publicar lista no app.

## 🧠 Nota: o vault vira cérebro COMPARTILHADO
Pedro Dev vai ter acesso ao nosso Obsidian (via convite ao Git + Obsidian, ou plano básico compartilhável ~$4–5). Ele quer sobretudo **consultar o cérebro** (ex: "quais os links da reunião com a Isabela?"). Valida toda a infra de conhecimento que montamos — vira base técnica + de negócio pros dois.

## 🔗 Cruzamento: nossa pesquisa ALIMENTOU as decisões
Entraram direto do que levantamos: **número de BH (100–175k)** · **Focus NFe** · **mobile-first** (auditoria) · **framing MLP** · **Asaas** (pesquisa de gateway) · **filtro CNAE por regime** (Izabela) · fluxo de portais (Izabela) · InfoSimples (1ª reunião). O playbook conduziu a reunião bloco a bloco.

## Relatório bruto (Plaud)
> `Conversa Pedro Dev. 09_07-transcript.txt` + `-Summary.md` (Downloads). Riscos apontados pela IA do Plaud: JUCEMG sem plano B · APIs dos portais não consolidadas · contratação do dev não confirmada · multi-tenant + A1 precisam detalhe técnico · tech do assistente de suporte indefinida · dependência do Pedro Dev no outro projeto = risco de atraso.

## Links
- [[playbook-reuniao-pedro-dev]] · [[spec-mvp-v0]] · [[_relatorio-auditoria]] · [[cnae-matriz-governo]] · [[mercado-bh-regional]] · [[2026-07-09-conversa-izabela]] · [[HOME]]
