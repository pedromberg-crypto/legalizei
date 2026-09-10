---
tipo: hub
status: vivo
data: 2026-09-09
assunto: frente-funcionalidades
autoridade: fonte-verdade
tags: [produto, hub, funcionalidades]
---

# 🧱 Produto — a fonte-verdade das funcionalidades

> **O que é esta pasta.** O lugar único onde mora **o que o app faz, por que faz, e como faz**. Nasceu em 09/09/2026, quando o teardown de pró-labore mostrou que uma funcionalidade só estava espalhada por seis pastas diferentes.
>
> **Acima daqui:** `CLAUDE.md` da raiz e [[HOME]] continuam mandando no projeto. Esta pasta manda **no produto**.

---

## 🧭 Por que existe (o diagnóstico que a criou)

O vault está organizado por **fonte**: `pesquisa/` guarda o que veio de fora, `execucao/` o que a gente fez, `marca/` o que a gente decidiu. Isso funciona bem pra quase tudo.

Não funciona pra funcionalidade. Uma funcionalidade tem seis facetas, e elas caíam em seis pastas:

| Faceta | Onde caía antes |
|---|---|
| o que o líder faz | `pesquisa/concorrentes/contabilizei/` |
| onde entra no catálogo | `execucao/portal/funcionalidades-me-simples.md` |
| a lei e o prazo | `pesquisa/rotina-fiscal/` |
| de que API depende | `pesquisa/integracoes-apis/` |
| que tela nossa cobre | `execucao/portal/matriz-portal-interno.md` |
| a decisão travada | `marca/decisoes-marca.md` |

Ninguém respondia *"como está o pró-labore?"* sem abrir seis arquivos. **Aqui a unidade de organização é o objeto (a funcionalidade), não a fonte.**

---

## 🗺️ Como esta pasta se lê

| Arquivo | Manda em | Não manda em |
|---|---|---|
| **[[_catalogo]]** | quais funcionalidades existem · a cobertura de cada uma (✅🟡🔴⚪) · o balde de monetização | como automatizar |
| **[[_matriz-dependencia]]** | de que terceiro cada uma depende · o que sabemos do caminho técnico | se a funcionalidade existe |
| **[[_metodo]]** | como se faz um teardown · a regra de navegação na conta do líder | conteúdo de funcionalidade |
| **[[_mapa-de-cruzamentos]]** | **como as funcionalidades se conectam** · a cadeia fiscal inteira · o calendário consolidado | o desenho de uma funcionalidade isolada |
| `funcionalidades/<nome>.md` | **o nosso desenho.** Spec viva, é o que o dev implementa | o que o concorrente faz |
| `evidencias/<data>-<fonte>-<tema>.md` | o que foi **observado**, com data | o que a gente vai fazer |

### 🔑 A separação que mais importa

**`funcionalidades/` é decisão viva. `evidencias/` é foto com data.**

O teardown do líder envelhece sozinho: a Contabilizei muda a tela e a nota vira mentira sem avisar. Nosso desenho não envelhece pelo mesmo motivo. Misturar os dois num arquivo só significa que, em seis meses, metade dele mente e ninguém sabe qual metade.

Então: **a spec manda, a evidência é fonte.** É a mesma doutrina do [[indice-autoridade]], aplicada a esta frente.

---

## 📍 Estado da frente

**Catálogo:** 51 funcionalidades mapeadas (§1–7 mais o à-la-carte), 31 construídas em mockup.
**Matriz:** 23 dependências externas. Placar de 09/09: 🟢 16 · 🟡 3 · 🔴 4.

### Os 4 vermelhos, que são o trabalho real

| # | O que é | Por que trava |
|:--:|---|---|
| **2.4** | Saber que o imposto foi pago sem perguntar | Maior buraco do produto. É decisão de **arquitetura**, não de fornecedor |
| **5.7** | Monitorar o DTE-SN | Ciência presumida em 45 dias, 30 pra regularizar. **Único ponto onde o silêncio custa a empresa do cliente** |
| **8.4** | Alvará (ALF PBH) | Municipal, sem caminho mapeado |
| **8.5** | CPOM | Idem |

### 🔴 Dois prazos correndo, e não são de código

- **Simples Híbrido: opção até 30/09/2026.** Decisão de negócio com o Mauro.
- **Emissor Nacional de NFS-e obrigatório em 01/11/2026.** Se a gente pretende emitir nota em produção este ano, é essa data que manda no roadmap.

---

## 📊 Painel de cobertura de mapeamento (10/09)

> **O que mede:** quanto do que eu precisaria para **escrever a spec pro dev** já está documentado — modelo de dados, regras de negócio, dependência externa resolvida e cruzamentos declarados.
>
> ⚠️ **É avaliação, não medição.** O % é julgamento meu a partir dos 6 teardowns, e serve para priorizar, não para reportar progresso.
>
> 🔒 **Recorte:** só os **38 itens core** (`balde: 🟢`) das seções §1–7. **Fora:** os 15 à-la-carte (§8), os rejeitados (§9) e os de backlog. Foi pedido do Pedro: *"quero tabela apenas de funcionalidades que o usuário terá acesso pelo plano"*.

### §1 · Home e navegação — 68%

| # | Funcionalidade | Nossa tela | % | O que falta pra 100% |
|:--:|---|---|:--:|---|
| 1.1 | Home "o que fazer hoje" | `/inicio` | 80% | temos o modelo de `rotinas` deles; falta definir nossa regra de "1 foco só" |
| 1.2 | Home dia-1 (sem nota) | `/home-dia1` | **30%** | 🔴 nunca observei o estado dia-1 deles: a conta do Pedro já é madura |
| 1.3 | Barra de abas + CTA | `layout.tsx` | 100% | decisão de front, não depende de mapeamento |
| 1.4 | Central de avisos | `/avisos` | 60% | 🔴 nunca abri o sino deles. Só sei que a central "está em evolução" e que avisam por e-mail/WhatsApp |
| 1.5 | Acesso do 2º sócio | — | 40% | vi `Cadastrar novo usuário` e o endpoint `multiusuario/status/servico`; nunca entrei |
| 1.6 | Blog | `/blog` | 100% | conteúdo nosso |

### §2 · Impostos — 82%

| # | Funcionalidade | Nossa tela | % | O que falta |
|:--:|---|---|:--:|---|
| 2.1 | Ver DAS do mês | `/impostos` | 95% | — modelo, 10 status e `acaoBotao` mapeados |
| 2.2 | Baixar guia + código de barras | `/impostos/guias` | 70% | 🔴 a **geração** depende do Serpro, não contratado |
| 2.4 | Saber que foi pago | — | 50% | 🔴 sabemos o mecanismo **deles**; o nosso é **decisão**, não descoberta |
| 2.5 | Histórico de guias | `/impostos/guias` | 95% | — |
| 2.6 | Minhas alíquotas | `/impostos/aliquotas` | 95% | 🕓 tabela do IRRF não ratificada |
| 2.8 | Simulador | — | 85% | nunca vi calcular (o `select` travou no CDP) |

### §3 · Notas fiscais — 76%

| # | Funcionalidade | Nossa tela | % | O que falta |
|:--:|---|---|:--:|---|
| 3.1 | Emitir NFS-e | `/emitir` | 75% | 🔴 **o POST de transmissão ao ADN** |
| 3.2 | Lista de notas | `/notas` | 90% | — |
| 3.3 | Ver / baixar nota | `/notas/detalhe` | 70% | PDF e XML vêm do ADN, não lido |
| 3.4 | Cancelar / reemitir | `/notas/detalhe` | 90% | o POST; os prazos já foram resolvidos |
| 3.5 | Cadastro de tomadores | `/emitir` (sheet) | 90% | — |
| 3.6 | Consultor tributário | — | 40% | a engine já existe ([[cnae-fiscalmente-otimo]]); falta ligar ao de-para da LC 116 |

### §4 · Pró-labore e sócios — 81%

| # | Funcionalidade | Nossa tela | % | O que falta |
|:--:|---|---|:--:|---|
| 4.1 | Pró-labore interativo | `/pro-labore` | 95% | — |
| 4.2 | Fator R + alerta preditivo | `/pro-labore` | 80% | falta o **gatilho**. 🔑 A fórmula e o `incideINSS` **por rubrica** estão (veio do teardown de folha) |
| 4.3 | Toggle sem faturamento | `/pro-labore` | 95% | — |
| 4.4 | Recibo + informe | — | 90% | — |
| 4.5 | Guia do INSS (DARF) | — | 80% | 🔴 Serpro |
| 4.6 | Duplo vínculo | `/mais/socios` | 90% | — |
| 4.7 | Dependentes (IRRF) | — | 40% | só vi o contador "0" e a coluna `Dep. IRRF`. Nunca abri |

### §5 · Estar em dia — 81%

| # | Funcionalidade | Nossa tela | % | O que falta |
|:--:|---|---|:--:|---|
| 5.1 | "Você está em dia ✓" | `/mais/em-dia` | 85% | 🔑 elevar ao padrão *"a casa faz por você"* |
| 5.2 | Declarações entregues | `/mais/declaracoes` | 90% | 🔴 transmissão depende do Serpro |
| 5.3 | Calendário de obrigações | `/obrigacoes` | 90% | — |
| 5.4 | Vigília preditiva | `/inicio` (bloco) | 60% | 🔴 **DTE-SN sem caminho** + falta o gatilho |

### §6 · Documentos e certificado — 67%

| # | Funcionalidade | Nossa tela | % | O que falta |
|:--:|---|---|:--:|---|
| 6.1 | Documentos da empresa | `/mais/documentos` | **30%** | 🔴 vi "Área de Documentos" no painel e **nunca abri** |
| 6.2 | Certificado digital | `/mais/certificado` | 80% | falta o fluxo de renovação. 🔑 4 de 5 obrigações mensais dependem dele |
| 6.6 | Dados da empresa | `/mais/empresa` | 90% | — |

### 🔴 §7 · Plano, cobrança e conta — 38%

| # | Funcionalidade | Nossa tela | % | O que falta |
|:--:|---|---|:--:|---|
| 7.1 | Ver plano, fatura, avulsos | `/mais/plano` | 35% | 🔴 vi as rotas no menu (`sistema/planos`), **nunca entrei** |
| 7.2 | Trocar forma de pagamento | `/mais/plano` | 25% | 🔴 idem (`painel/formas-pagamento`) |
| 7.3 | Histórico de faturas | `/mais/plano` | 25% | 🔴 idem (`sistema/pagto-historico`) |
| 7.4 | Cancelar plano sem punição | `/mais/plano` | **15%** | 🔴 nunca vi. É o nosso anti-dark-pattern e **não sei como eles fazem** |
| 7.6 | Perfil / conta / login | `/perfil` | 60% | vi o painel lateral; não entrei em "Alterar dados" |
| 7.7 | Reajuste anunciado | — | 70% | tenho a copy inteira do IGP-DI deles; falta **nossa regra** |

---

### 🎯 O placar

| Seção | % |
|---|:--:|
| §2 Impostos | **82%** |
| §4 Pró-labore | **81%** |
| §5 Estar em dia | **81%** |
| §3 Notas | **76%** |
| §1 Home | **68%** |
| §6 Documentos | **67%** |
| 🔴 **§7 Plano e cobrança** | **38%** |
| **Total (38 itens core)** | **≈ 70%** |

### As três leituras

**1. 🔴 §7 é o buraco, e é o pior lugar pra ter um.** É onde mora **a nossa receita**: plano, fatura, cancelamento. Está em 38% porque **nunca varri** — sete rodadas nas telas de contabilidade e nenhuma na de dinheiro. **Ponto cego meu, não escolha.**

**2. Os bloqueios de verdade são 4, e são concentrados.** Fora do §7, o que falta pra chegar perto de 100%:

| | O quê | Destrava | Natureza |
|:--:|---|---|---|
| 🔴 | **Swagger do Emissor Nacional** | 3.1 · 3.3 · 3.4 | **leitura** |
| 🔴 | **Contrato Serpro Integra Contador** | 2.2 · 4.5 · 5.2 | **contratação** |
| 🔴 | **2.4 status de pagamento** | 2.4 · 2.5 | **decisão** |
| 🔴 | **5.7 DTE-SN** | 5.4 | **investigação** |

🔑 **Três dos quatro não são pesquisa aberta.** Um é ler documento público, outro é assinar contrato, outro é o Pedro e o Mauro decidirem. Só o DTE-SN é investigação de verdade.

**3. Seis telas já construídas têm pouco lastro de mapeamento:** `/home-dia1` (30%) · `/avisos` (60%) · `/mais/documentos` (30%) · e as três de `/mais/plano` (15–35%). Foram desenhadas **antes** desta série de teardowns. ⚠️ **Vale conferir se o que a gente supôs bate com o que agora sabemos** — é exatamente o tipo de drift que o vault já pagou caro pra aprender.

---

### ⚪ Por que folha de pagamento não está nesta tabela

Ela está no **§9 do catálogo** — *"o que o líder tem e a gente decidiu NÃO fazer"* — com a justificativa de 08/09: *"Solo de serviço não tem funcionário. Backlog"*. O recorte desta tabela é só `§1–7` com balde 🟢, então ela não entra por duas razões independentes.

⚠️ **Mas o teardown dela rendeu para o core mesmo assim**, e isso vale registrar como padrão: o `incideINSS` **por rubrica** (296 de 606) mudou o motor do **Fator R**, que é a linha **4.2** e é core. **Frente fora de escopo pode ensinar sobre frente core** — o critério para varrer não é só "isso vai virar tela".

---
## 📚 Funcionalidades destrinchadas

| Funcionalidade | Spec | Evidência | Estado |
|---|---|---|---|
| **Pró-labore** | [[pro-labore]] | [[2026-09-09-contabilizei-pro-labore]] | 🟢 desenho fechado, motor a construir |
| **Alíquota e enquadramento** | [[aliquota-e-enquadramento]] | [[2026-09-09-contabilizei-aliquotas]] | 🟢 desenho fechado · 🔴 tabela do IRRF não ratificada |
| **Emitir nota fiscal** | [[emitir-nota-fiscal]] | [[2026-09-09-contabilizei-nota-fiscal]] | 🟢 desenho fechado · 🔴 prazo 01/11/2026 e de-para NBS inexistente |
| **A guia de imposto** | [[guia-de-imposto]] | [[2026-09-09-contabilizei-guia-imposto]] | 🟢 desenho fechado · 🔴 2.4 é decisão de arquitetura, não descoberta |
| **Compliance e rotinas** | [[compliance-e-rotinas]] | [[2026-09-09-contabilizei-central-rotinas]] | 🟢 desenho fechado · 🔴 DTE-SN (5.7) sem caminho |
| **Folha de pagamento** | [[folha-de-pagamento]] | [[2026-09-09-contabilizei-folha-pagamento]] | 🔵 fora do MVP · 🔑 mas o modelo de rubricas muda o motor do Fator R **hoje** |

🔗 **[[_mapa-de-cruzamentos]]** — como as funcionalidades se puxam. Nasceu em 09/09, quando pró-labore e alíquota chegaram **no mesmo número (37,72%) por caminhos diferentes** e ninguém tinha notado. Toda spec fiscal agora abre com uma seção **Cruzamentos declarados**; a regra está no [[_metodo]], passo 7.

### Fila, na ordem sugerida

✅ **Já feitos (6):** [[pro-labore]] · [[aliquota-e-enquadramento]] · [[emitir-nota-fiscal]] · [[guia-de-imposto]] · [[compliance-e-rotinas]] · [[folha-de-pagamento]].

🔗 **O ciclo mensal está fechado e o estado agregado também:** nota entra → alíquota precifica → pró-labore ajusta → guia sai → compliance diz se está tudo em dia.

1. 🔴 **§7 · Plano, cobrança e conta** — o painel de cobertura acima colocou em **38%**, o pior da casa, e é **onde mora a nossa receita**. Rotas já localizadas e nunca visitadas: `sistema/planos` · `sistema/pagto-pendente` · `sistema/pagto-historico` · `painel/formas-pagamento`. Inclui o **cancelamento**, que é o nosso anti-dark-pattern e sobre o qual não sei nada do líder.
2. ⚪ ~~Extrato bancário~~ — **FORA DE ESCOPO** (Pedro, 09/09): não seremos financeira e não teremos conta PJ. ⚠️ Efeito colateral: a **2.4 perde o caminho do trilho próprio** e sobra a consulta de arrecadação.
3. **§6 · Documentos e certificado** — o A1 é pré-condição de tudo e já apareceu como campo em **5 payloads**, sempre com `diasParaVencimento`.
4. **Consultar e cancelar nota** — fecha a NF, e tem a divergência de prazo aberta (730 dias × "mesmo mês").

🔴 **Fora da fila, porque não é descoberta:** a **2.4** não sai de teardown. Já sabemos a resposta do líder (lote mensal + trilho próprio). É **decisão de arquitetura e de negócio**, e precisa do Pedro e do Mauro, não de mais uma passada.

---

## Links
[[HOME]] · [[BASE-ESTRATEGICA]] · [[indice-autoridade]] · [[decisoes-marca]] · [[matriz-portal-interno]] · [[cruzamento-portal-interno]] · [[2026-07-21-dossie-plataforma-logada]]
