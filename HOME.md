# 🧠 Legalizei — HQ

> Nota-hub do vault. Tudo parte daqui. Produto: **Legalizei** (contabilidade digital, MVP tipo Contabilizei).
> Status: ✅ negócio fechado com Mauro (2026-07-07) · V0/imersão em curso.

## 📍 Agora (torre de controle — mantida via `/fechar`)
> **Última atualização:** 2026-07-13 (2º flow) · Janela nova? rode `/boot`. **Fase:** imersão mês 1 + modelo operacional travado + plano de sequência PM + protótipo conectado + LP v1 + **handoff Git pro Dev + redes sociais no ar (IG+LinkedIn) + regras de DP com a Karla**.

**North Star (~3 sem):** abrir **1 empresa real ponta a ponta pelo app** (cobaia = CNPJ do próprio Pedro). Espinha = entrevista IA → valida CNAE → cobra → constitui CNPJ → certificado → portal (nota+vencimentos). Enfeite (extensão, notícias, parcerias, anti-scraping) = backlog. → [[2026-07-13-plano-sequencia-pm]]
**Âncora da semana:** sexta **17/07** = teste E2E do backend + V1 UI + demo Mauro.

**Régua:** é **MLP (mínimo LOVABLE), não MVP** — craft/encanto (animação, micro-interação) no escopo. Spec ainda diz "MVP" em vários lugares (corrigir) → [[legalize-mlp-nao-mvp]]

**Estado das frentes:**
- 🟢 **Pesquisa concorrente** — 6 teardowns + páginas públicas + tom → [[_sintese-paginas-publicas]]
- 🟢 **Abertura BH** — fluxo validado c/ Izabela; órgãos mapeados → [[fluxo-abertura-portais-pedro-dev]]
- 🟢 **CNAE** — atendidos/não atendidos (460/68/804) pronto pro dev → [[cnae-atendidos-e-nao-atendidos]]
- 🟢 **Marca** — nome+conceito+tom+paleta+logo travados; **fonte Sora = sistema inteiro (travado)**; falta teste de fogo + derivados (favicon/app-icon) → [[decisoes-marca]] · [[paleta-cores]]
- 🟡 **Produto/tech** — stack+MLP+multi-tenant; **modelo operacional travado 13/07** (só serviço; KINAE "passa liso"; onboard antes do pagamento; WhatsApp central; wizard em blocos; contrato-como-produto). **Dev em teste E2E do backend** (RPA+IACA+infra) mirando 17/07 → [[2026-07-13-alinhamento-pedro-dev-leonam]] · [[2026-07-13-plano-sequencia-pm]]
- 🟢 **Regras de negócio (DP)** — **Karla (Depto Pessoal) respondeu os encaminhamentos**: pró-labore/INSS, sócio CLT (não pode/duplo vínculo LGPD), eSocial sem movimento, Fator R (V→III, ≥28%, 15,5%→6%), funcionário/PJ = fora do MVP, obrigações acessórias por tributação. **Falta só a Larissa (fiscal)** → [[2026-07-13-conversa-karla]]
- 🟢 **Handoff Git pro Dev** — repo privado **base-ds-legalizei** (8 telas + LP v1 + 8 Lotties + README) criado e Pedro Dev convidado (pedro.melodata). ✅ tirado do caminho crítico
- 🟢 **Redes sociais** — estrutura nova `mkt/redes-sociais/` (hub + perfil por rede). **IG `@legalizei.app`** criado (bio/config em curso, pegada "vem aí"). **LinkedIn** `company/legalizei-app` criado + pré-config ("Sobre" oficial + slogan + logo). Falta banner PNG final + linktree waitlist → [[redes-sociais]]
- 🟢 **Protótipo UI** — throwaway HTML+Tailwind em `ux-ui/prototipo/` (método página-primeiro, DS emerge). **Fluxo de entrada inteiro montado:** `splash` (coral, logo negativa, handoff slide-up) → `welcome` (3 telas, 4 Lottie recoloridos coral) → `fluxo-entrada` (fork, logo estático) → `gate-cnae` (concierge validador CNAE + waitlist + "já sei meu CNAE" código direto) · `login` (gradiente ink+coral, social) · wizard `fase-0` (barra simples). **gate-cnae polido nesta rodada:** placeholder animado (typewriter, 15 atividades CNAE populares, cor ink-400) · **loading = lottie arquivos+lupa recolorida** (`loading-legalizei.json`, no lugar dos 3 dots) · **confirmação = confete** (botão "É isso mesmo" vira círculo coral + check branco/eco do logo → navega login; `success-confetti-legalizei.json`) · **CTA colado no rodapé** na tela de resultado (padrão "CTA em baixo", refazer acima) · **travessões removidos de toda copy** (gate + LP + entrada + fase-0). Padrões travados: **altura sem scroll** (`100dvh`+`min-h-0`) · **Lottie local** (`lottie.min.js` + `*-legalizei.json`, driver manual só p/ pane) → [[legalize-prototipo-ux]] · [[2026-07-12-fluxo-entrada-completo-prototipo]]
- 🟢 **Landing page** — **CONSTRUÍDA (v1 local)** em `ux-ui/lp/` (HTML+CSS+JS puros, zero backend): 9 dobras, validador CNAE concierge (whitelist real, regulamentada vence verde), marquee de burocracias, chat WhatsApp mock, tabela vs., CTA gradiente assinatura. Review multi-agente: 51 achados AA/JS/copy aplicados. Falta: **review visual do Pedro** (`npx serve ux-ui/lp -l 4173`), Sora local (woff2), links reais das lojas, backend da waitlist → [[2026-07-12-lp-construida]]
- ⏳ **Infra** — **valores dos domínios enviados p/ aprovação (Miguel → Mauro)**: Hostinger R$312,11 + Registro.br R$76,00 (legalizei.app.br). Aguarda 2 PIX/pagamento; titular CNPJ Legalize Digital

**Decisões a forçar (semana 2):** **certificado digital** → recomendo começar terceiro (Sete Minas) · **gateway** → recomendo Asaas · **plano** → semestral + política de cancelamento. **Ainda abertas:** autorização compra domínios (Mauro) · **especificar os BLOCOS do wizard** (onde pausa/retoma) · provider API cartão CNPJ (InfoSimples/CNPJá) · derivados do logo + teste de fogo → Design System · review visual da LP (Pedro) + destino publicação.

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
