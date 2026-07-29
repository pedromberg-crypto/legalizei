---
tipo: marco
status: fechado
data: 2026-07-29
assunto: apresentacao-gestao-e-fidelidade-por-construcao
tags: [flow, apresentacao, componentes, fidelidade, ux, achados]
---

# 🏁 19º flow — a apresentação pra gestão e a fidelidade por construção

> **O que este flow entregou:** o acervo voltou a refletir o produto, nasceu a `/apresentacao` (demo pra a gestão da Legalize Digital) e, junto com ela, um **mecanismo que impede as telas de divergirem** — o problema que a própria demo expôs em 24 horas.

## 1. O acervo tinha virado museu
`/componentes` guardava os "vencedores" extraídos das explorações, mas as telas de produção seguiram evoluindo sem ele. Resultado: **13 componentes divergiam**.

- **Swap direto** (a versão nova já existia): `Saudacao`→`CabecalhoCampea` · `BlogCarousel`→`AprendaGradiente` · grid bare→`AtalhosRapidos` · `MovimentacoesRecentes`+`NotasRecentes`→`NotasRecentesMov`. Mais `Vigilancia`, que era componente **aprovado e nem estava no acervo**.
- **Reescritos** (o tweak tinha virado JSX local dentro da página): `DayStripFiscal` · `ProximasObrigacoes` · `ContaSwipe` · `EmitirPra` · `CategoriaChips` · `IndiqueGanhe` · `SuaSituacao` · `ProfileRow` · `ProfileHeader` · `SearchMic` · `GuiasRecentes` · `SuasGuias` · `ResumoNegocio`.

⚠️ Achados de produto no meio: `IndiqueGanhe` tinha sido **descopado** pra "Em breve" travado e ninguém tinha atualizado o acervo; `swipe-to-pay` foi **abandonado** no app inteiro; `SuaSituacao` virou página (`mais/em-dia`).

## 2. `/mockup-v2` — comparar antes de decidir
Rotina nova pedida pelo Pedro: pra cada tela, **original × contido × robusto**, lado a lado. Aprovado sobe pro produto, os candidatos somem.

| Tela | Decisão |
|---|---|
| N4 · Gate-CNAE | ✅ **robusto** (painel único escuro agrupando pills+textarea, pill ativa coral) |
| ENCAIXE | ✅ **híbrido**: card do robusto (barra de adequação + stat cards + check-list) + alternativas empilhadas do contido |
| N4 Triagem · N4 Faixa | ⏸️ mantido o original |
| 🟡 Waitlist · 🔴 Contato especial · 🔴 Fora de escopo | ⏸️ mantido o original |
| N6 Criar conta · N7 A conta da abertura | comparados; seguiram pro trabalho da apresentação |

## 3. `/apresentacao` — a demo pra gestão
Ferramenta pra apresentar o onboarding ao time contábil da Legalize Digital (âncora técnica do negócio).

- **Split-screen:** aparelho 15 Pro Max à esquerda (sem iframe, senão o painel não reage ao estado) + explicação à direita: *o que a tela faz · o que interfere na constituição · por que pede o dado*.
- **Dono da pausa** por tela (🟧 usuário · 🟦 nossa), mesma taxonomia do kanban de leads.
- **Cenários preenchem, não navegam:** 🟢 caminho feliz · 🟡 regulamentada · 🔴 comércio · 🔴 fora de escopo põem pill + texto plausível no campo, e quem dispara o desfecho é o CTA de dentro do aparelho. A gestão precisa ver a **causa**, não só o resultado. No 🟡 a pill escolhida é de propósito uma que **não corresponde** (advocacia não tem pill), virando prova visual de [[legalize-pill-estreita-nao-valida]].
- **Seta de voltar externa** com pilha de snapshots do estado inteiro, e **nota técnica camuflada** (aparece no hover, some ao trocar de tela).
- **Cobertura:** N3 (fork + gate de cidade) → N4 → **B3 inteiro** (N6 conta · N7 a conta da abertura · N8 contrato · N9 pagamento).

## 4. 🔗 A decisão estrutural: fidelidade por construção
A v1 da demo era **cópia** das telas. Em 1 dia ela divergiu: o N3 perdeu o Lottie, os ícones e o layout dos cards, e ninguém notou até o Pedro apontar.

**Correção:** as telas viraram **fonte única**, mesmo padrão que `VereditoView`/`EncaixeView` já seguiam.

| Componente | Arquivo |
|---|---|
| `EntradaView` | `components/entrada.tsx` |
| `PerguntaView` · `AnalisandoView` · `TriagemView` · `FaixaView` | `components/gate-telas.tsx` |
| `ContaView` · `PlanoView` · `ContratoView` · `PagamentoView` | `components/wizard-dinheiro.tsx` |
| `ConteudoCnae` · `OutrasOpcoes` | `components/encaixe.tsx` |

As pages de produção viraram **wrappers finos** (estado + navegação), **sem mudar 1 pixel**.

**Regra travada com o Pedro:** editar uma tela na demo a **deslinka** — selo visível + observação no painel, e o flow de produção só muda depois que ele validar. Distinção que ficou clara no meio do caminho: **defeito** corrige direto na fonte (não faz sentido segurar bug esperando validação); **mudança de design** fica deslinkada.

## 5. Os 2 bugs que a demo expôs (corrigidos em produção)
- **BUG-01 · N3:** `migrarEmBreve` era estado interno e ninguém zerava ao trocar de intenção. Repro: "Já tenho empresa" → BH → *"essa parte ainda não existe"* → voltar → "Quero abrir minha empresa" → **aparecia a tela do migrar**. Quem escolheu ABRIR via a tela de MIGRAR.
- **BUG-02 · todas as confirmações:** o selo verde tinha frase fixa e dizia **"Achei o seu encaixe"** em toda tela de sucesso, inclusive na waitlist e na saída de cidade, onde ninguém encaixou em nada.

⚠️ Os dois se protegiam: o beco do UX-61 (o "em breve" não tem saída) **escondia** o BUG-01. Consertar só o beco teria exposto o bug ao usuário real.

## 6. Também em produção (validado pelo Pedro na hora)
- Card verde do CNAE: **"Imposto · mais baixo · entre os que servem"** (era *"O mais barato / que serve / pra você"*, linguagem de varejo). O rodapé preserva a regra 3 do ENCAIXE: garante o **setup**, não o resultado.
- N4 Faixa: título ganhou **"Pode ser estimativa!"**; o subtítulo parou de repetir a palavra.
- Botões de opção selecionados (sócios · exterior · faixas): **coral preenchido**.

## 7. Autocomplete de município
`components/campo-municipio.tsx` + **5.570 municípios do IBGE** congelados em `app/public/dados/municipios.json` (~190KB). Digitar não seleciona; editar depois de escolher invalida. Congelado de propósito: a demo roda em reunião, e depender de rede pra um autocomplete é convite a falhar na hora errada.

## 8. O que ficou aberto
15 achados em [[achados-apresentacao]] (**UX-60 a UX-74**), com destaque pra:

- **Nenhuma tela do wizard tem "voltar"** — varredura completa confirmou. Inclui a travessia do dinheiro (`conta`→`plano`→`contrato`→`pagamento`), onde errar custa caro. *A pergunta que a demo faz e a construção não fazia: "e se a pessoa errou o passo anterior?"*
- **3 decisões esperando o Pedro:** coral-600 × AA (**4,04:1** em 3 lugares; o token `action-primary-sm` dá 5,64:1 e resolve) · coorte obrigatória × UX-48 ("dado puro, pulável sem custo") · **Atende × Encaixe agora fazem a mesma pergunta** (o Encaixe já saiu da demo).
- **2 números pendentes de fonte:** mensalidade (placeholder FAKE declarado) e o honorário de abertura tradicional (**R$ 1.621**, definido pelo Pedro como referência de salário mínimo, a confirmar com o Mauro).

## Cruza com
[[achados-apresentacao]] · [[compilado-ux-flow]] · [[backlog-telas-portal]] · [[plano-padrao-195-referencia]] · [[HOME]]
