# 🧠 Legalizei — HQ

> Nota-hub do vault. Tudo parte daqui. Produto: **Legalizei** (contabilidade digital, MVP tipo Contabilizei).
> Status: ✅ negócio fechado com Mauro (2026-07-07) · V0/imersão em curso.

## 📍 Agora (torre de controle — mantida via `/fechar`)
> **Última atualização:** 2026-07-12 (madrugada) · Janela nova? rode `/boot`. **Fase:** imersão mês 1 + marca + protótipo UI (gate-cnae polido) + **LP construída (v1 local)**.

**Régua:** é **MLP (mínimo LOVABLE), não MVP** — craft/encanto (animação, micro-interação) no escopo. Spec ainda diz "MVP" em vários lugares (corrigir) → [[legalize-mlp-nao-mvp]]

**Estado das frentes:**
- 🟢 **Pesquisa concorrente** — 6 teardowns + páginas públicas + tom → [[_sintese-paginas-publicas]]
- 🟢 **Abertura BH** — fluxo validado c/ Izabela; órgãos mapeados → [[fluxo-abertura-portais-pedro-dev]]
- 🟢 **CNAE** — atendidos/não atendidos (460/68/804) pronto pro dev → [[cnae-atendidos-e-nao-atendidos]]
- 🟢 **Marca** — nome+conceito+tom+paleta+logo travados; **fonte Sora = sistema inteiro (travado)**; falta teste de fogo + derivados (favicon/app-icon) → [[decisoes-marca]] · [[paleta-cores]]
- 🟡 **Produto/tech** — stack+MLP+multi-tenant; **reavaliar rota** semana que vem. **Fluxo de entrada TRAVADO** (splash→fork abrir/migrar→gate CNAE concierge→login deferido→wizard; migrar puxa cartão CNPJ) → [[2026-07-12-fluxo-entrada-prototipo]]
- 🟢 **Protótipo UI** — throwaway HTML+Tailwind em `ux-ui/prototipo/` (método página-primeiro, DS emerge). **Fluxo de entrada inteiro montado:** `splash` (coral, logo negativa, handoff slide-up) → `welcome` (3 telas, 4 Lottie recoloridos coral) → `fluxo-entrada` (fork, logo estático) → `gate-cnae` (concierge validador CNAE + waitlist + "já sei meu CNAE" código direto) · `login` (gradiente ink+coral, social) · wizard `fase-0` (barra simples). **gate-cnae polido nesta rodada:** placeholder animado (typewriter, 15 atividades CNAE populares, cor ink-400) · **loading = lottie arquivos+lupa recolorida** (`loading-legalizei.json`, no lugar dos 3 dots) · **confirmação = confete** (botão "É isso mesmo" vira círculo coral + check branco/eco do logo → navega login; `success-confetti-legalizei.json`) · **CTA colado no rodapé** na tela de resultado (padrão "CTA em baixo", refazer acima) · **travessões removidos de toda copy** (gate + LP + entrada + fase-0). Padrões travados: **altura sem scroll** (`100dvh`+`min-h-0`) · **Lottie local** (`lottie.min.js` + `*-legalizei.json`, driver manual só p/ pane) → [[legalize-prototipo-ux]] · [[2026-07-12-fluxo-entrada-completo-prototipo]]
- 🟢 **Landing page** — **CONSTRUÍDA (v1 local)** em `ux-ui/lp/` (HTML+CSS+JS puros, zero backend): 9 dobras, validador CNAE concierge (whitelist real, regulamentada vence verde), marquee de burocracias, chat WhatsApp mock, tabela vs., CTA gradiente assinatura. Review multi-agente: 51 achados AA/JS/copy aplicados. Falta: **review visual do Pedro** (`npx serve ux-ui/lp -l 4173`), Sora local (woff2), links reais das lojas, backend da waitlist → [[2026-07-12-lp-construida]]
- ⏳ **Infra** — domínios **aguardando autorização de compra** (Mauro); titular CNPJ Legalize Digital

**Decisões abertas:** autorização compra domínios (Mauro) · reavaliação rota produto (semana que vem) · **provider da API de cartão CNPJ** (confirmar c/ dev — InfoSimples/CNPJá) · **definir/nomear as 4 etapas do wizard Fase 0** (hoje só "Etapa 1 · Seus dados" travada) · derivados do logo + teste de fogo, depois Design System · **review visual da LP** (Pedro) + destino de publicação (Vercel? aguarda domínio).

**Atalhos:** [[kanban-legalizei]] · [[parking-lot]] · [[evolucao-para-mauro]] (reporte sócio) · [[CHECKLIST-IMERSAO-30-DIAS]]

## 🗺️ Mapa do vault
- [[BASE-ESTRATEGICA]] — fonte da verdade (teses, custo travado, equity, roadmap)
- [[PESQUISA-MERCADO]] — desk research BR + benchmark de custos
- [[CHECKLIST-IMERSAO-30-DIAS]] — mês 1 semana a semana + anexo mês 2 (funil + gate)
- `reunioes/` — atas e relatórios (Plaud) — uma nota por reunião
- `diario/` — diário da imersão (1 nota por dia dentro da Legalize)
- `pesquisa/concorrentes/` — teardown profundo por concorrente. **Contabilizei = pasta-domínio** (`emails/` · `social/` · `funcionalidades/` · `pricing-snapshots/`) — cada email/post/tela vira nota datada via template `artefato-concorrente`
- [[obsidian-estado-da-arte]] — stack do vault verificada contra doc oficial (Bases, não Dataview · CLI · backup)
- `ux-ui/` — estudos de UX/UI pro desenvolvimento
- `marca/` — construção da marca ([[marca]] hub): naming → conceito → referências → identidade. Etapa atual: **identidade visual** — paleta validada + **logo fechado** ([[legalizei-logo-horizontal.svg]]); próximo = derivados + Design System ([[paleta-cores]] · [[decisoes-marca]] · [[2026-07-12-logo-fechado]])
- `mkt/` — estratégias de marketing (ativa quando chegarmos lá)
- `apresentacao/` — deck 9 slides + gerador + cola PDF
- `_templates/` — modelos de nota (reunião, teardown, diário, shadowing)

## 🔒 Regras do cérebro
1. **Uma nota = um assunto.** Reunião de 2h vira 1 nota de reunião + N notas de insight linkadas.
2. **Linkar sempre:** dor observada → `[[cliente]]` → `[[feature]]` → spec. O valor está nas conexões.
3. **Padrão anti-guru continua:** número sem fonte não entra.
4. **Nomes de arquivo:** kebab-case, datas em `AAAA-MM-DD`.

## 🏷️ Tags padrão
`#dor` `#insight` `#feature` `#decisao` `#pendencia` `#concorrente` `#cliente` `#compliance` `#ux` `#mkt`
