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

## 📊 Painel de cobertura de mapeamento (revisado 11/09)

> **O que mede:** quanto do que eu precisaria para **escrever a spec pro dev** já está documentado — modelo de dados, regras de negócio, dependência externa resolvida e cruzamentos declarados.
>
> ⚠️ **É avaliação, não medição.** O % é julgamento meu a partir dos teardowns, e serve para priorizar, não para reportar progresso.
>
> 🔒 **Recorte:** só os **49 itens core** (`balde: 🟢`). **Fora:** os 15 à-la-carte (§8 do catálogo), os rejeitados e os de backlog.
>
> 🔄 **O que mudou nesta revisão:** **folha de pagamento entrou como §8** (decisão de 10/09, que revogou a de 08/09). Três itens novos nasceram das leituras de 10/09: **5.5** Carta de Responsabilidade, **5.6** distribuição de lucro e **6.4** contrato e aceites. E **6.1** saltou de 30% para 75%, porque a Área de Documentos finalmente foi aberta.

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
| 4.2 | Fator R + alerta preditivo | `/pro-labore` | 80% | falta o **gatilho**. 🔑 A fórmula e o `incideINSS` **por rubrica** vieram do teardown de folha, que agora é core (§8) |
| 4.3 | Toggle sem faturamento | `/pro-labore` | 95% | — |
| 4.4 | Recibo + informe | — | 90% | — |
| 4.5 | Guia do INSS (DARF) | — | 80% | 🔴 Serpro |
| 4.6 | Duplo vínculo | `/mais/socios` | 90% | — |
| 4.7 | Dependentes (IRRF) | — | 40% | só vi o contador "0" e a coluna `Dep. IRRF`. Nunca abri |

### §5 · Estar em dia — 75%

| # | Funcionalidade | Nossa tela | % | O que falta |
|:--:|---|---|:--:|---|
| 5.1 | "Você está em dia ✓" | `/mais/em-dia` | 85% | 🔑 elevar ao padrão *"a casa faz por você"* |
| 5.2 | Declarações entregues | `/mais/declaracoes` | 90% | 🔴 transmissão depende do Serpro |
| 5.3 | Calendário de obrigações | `/obrigacoes` | 90% | — |
| 5.4 | Vigília preditiva | `/inicio` (bloco) | 60% | 🔴 **DTE-SN sem caminho** + falta o gatilho |
| 5.5 🆕 | **Carta de Responsabilidade anual** | — | 80% | 🔑 **obrigatória** (Res. CFC 1.590/2020, art. 3º) e **trava o fechamento contábil**. Temos o texto literal (6.418 car.); falta a tela, o lembrete anual e o ciclo de aceite |
| 5.6 🆕 | **Distribuição de lucro e EFD-Reinf** | — | **45%** | 🔴 a partir de 2026 todo saque de sócio vai pra EFD-Reinf, com IRRF antecipado. 🕓 **Lei 15.270/2025 não ratificada em fonte primária.** Sem o extrato integrado, depende do envio do cliente |

### §6 · Documentos e certificado — 79%

| # | Funcionalidade | Nossa tela | % | O que falta |
|:--:|---|---|:--:|---|
| 6.1 | Documentos da empresa | `/mais/documentos` | **75%** ↑ | 🔄 era 30%. Área de Documentos aberta em 10/09: **10 pastas fixas** do que o cliente envia. ⚠️ Só a área `DOCUMENTOS_CONTABEIS` foi vista, e **não há upload de documento da empresa** (contrato social, cartão CNPJ, alvará) — o que a nossa tela provavelmente precisa ter |
| 6.2 | Certificado digital | `/mais/certificado` | 80% | falta o fluxo de renovação. 🔑 4 de 5 obrigações mensais dependem dele |
| 6.4 🆕 | **Contrato e aceites do cliente** | — | 70% | 🔑 arquitetura mapeada: contrato é o tronco, Termos são galhos com **trilha própria de data, IP e navegador**. **Requisito de engenharia**: cada cliente fica preso à versão que aceitou, e com 3 coortes de preço isso deixa de ser hipótese |
| 6.6 | Dados da empresa | `/mais/empresa` | 90% | — |

### 🆕 §8 · Folha de pagamento — 64%

> 🔄 **Entrou no core em 10/09**, revogando a decisão de 08/09 que a deixava no backlog. Regra travada: **R$39 por colaborador ativo na competência, teto de 10**, contratado no app depois da abertura.

| # | Funcionalidade | Nossa tela | % | O que falta |
|:--:|---|---|:--:|---|
| 8.1 | Cadastrar colaborador | — | **35%** | 🔴 o formulário do líder **está bloqueado** (*"entre em contato com a nossa equipe"*). **Nunca vi os campos.** O que sei veio do layout do demonstrativo, por inferência |
| 8.2 | Rubricas e lançamentos do mês | — | **95%** | 🔑 **606 rubricas** com `incideINSS`, `incideFGTS`, `incideIRRF` e o **plano de contas** por linha. É o ativo mais completo que temos de qualquer frente |
| 8.3 | Holerite e demonstrativo | — | 55% | vi as colunas do cabeçalho (PIS/NIT, CBO, Dep. IRRF); nunca vi um holerite montado |
| 8.4 | Fechamento da competência | — | 75% | `getMesCompetencia` vem do **servidor**, coerente com o padrão. Falta a regra de trava |
| 8.5 | Obrigações mensais (eSocial, EFD-Reinf, DCTFWeb) | — | 70% | prazos e requisitos mapeados (dia 15, certificado ou procuração). 🔴 **transmissão depende do Serpro** |
| 8.6 | Guias de FGTS, INSS e IRRF | — | **40%** | 🔴 **anomalia aberta:** `incideFGTS` existe em 314 rubricas e o **FGTS não aparece em nenhuma das 15 rotinas** da casa. Ou sai por outro caminho, ou a lista está incompleta |
| 8.7 | Rescisão | — | 55% | 11+ modalidades do enum `tipoDesligamento` e as rubricas de rescisão. Falta o fluxo e o prazo de 10 dias |
| 8.8 | Cobrança por colaborador **ativo** | `/mais/plano` | 90% | 🔑 regra nossa, já em contrato (cláusula 7.4): cobra mesmo sem movimento, porque a obrigação existe. Falta a mecânica de faturamento |

### 🔴 §7 · Plano, cobrança e conta — 38%

| # | Funcionalidade | Nossa tela | % | O que falta |
|:--:|---|---|:--:|---|
| 7.1 | Ver plano, fatura, avulsos | `/mais/plano` | 35% | 🔴 vi as rotas no menu (`sistema/planos`), **nunca entrei** |
| 7.2 | Trocar forma de pagamento | `/mais/plano` | 25% | 🔴 idem (`painel/formas-pagamento`) |
| 7.3 | Histórico de faturas | `/mais/plano` | 25% | 🔴 idem (`sistema/pagto-historico`) |
| 7.4 | Cancelar plano sem punição | `/mais/plano` | **15%** | 🔴 nunca vi. É o nosso anti-dark-pattern e **não sei como eles fazem** |
| 7.6 | Perfil / conta / login | `/perfil` | 60% | vi o painel lateral; não entrei em "Alterar dados" |
| 7.7 | Reajuste anunciado | — | 70% | tenho a copy inteira do IGP-DI deles + a nossa regra de coorte travada em contrato |

---

### 🎯 O placar

| Seção | % | |
|---|:--:|---|
| §2 Impostos | **82%** | |
| §4 Pró-labore | **81%** | |
| §6 Documentos | **79%** | ↑ era 67% |
| §3 Notas | **76%** | |
| §5 Estar em dia | **75%** | ↓ era 81%, com 2 itens novos |
| §1 Home | **68%** | |
| 🆕 §8 Folha | **64%** | entrou agora |
| 🔴 §7 Plano e cobrança | **38%** | |
| **Total (49 itens core)** | **≈ 70%** | era 70% com 38 itens |

🔑 **O total não mexeu, e isso é informação.** Entraram **11 itens novos**, a maioria abaixo da média, e ao mesmo tempo o §6 subiu 12 pontos. **A base cresceu 29% e a cobertura se manteve**, o que significa que o trabalho de 10/09 pagou o custo de ampliar o escopo.

### As quatro leituras

**1. 🔴 §7 continua sendo o buraco, e piorou de significado.** Segue em 38% porque **nunca varri**. Só que agora é pior: em 10/09 a gente **fechou a tabela de preço inteira** (3 coortes, 5 faixas de EPP, folha, avulsos) sem nunca ter visto as telas de plano, fatura e cancelamento do líder. **Decidimos o preço antes de olhar onde o preço mora.**

**2. 🆕 A folha entra desequilibrada, e o desequilíbrio é útil.** A linha **8.2 está em 95%**, a melhor de todo o painel, porque a API entregou as 606 rubricas com incidência e plano de contas. Mas **8.1 está em 35%**, porque o formulário de admissão do líder é bloqueado e **nunca vi um campo**. Ou seja: **sabemos calcular a folha e não sabemos cadastrar quem entra nela.**

**3. Os bloqueios de verdade agora são 5.**

| | O quê | Destrava | Natureza |
|:--:|---|---|---|
| 🔴 | **Swagger do Emissor Nacional** | 3.1 · 3.3 · 3.4 | **leitura** |
| 🔴 | **Contrato Serpro Integra Contador** | 2.2 · 4.5 · 5.2 · 8.5 · 8.6 | **contratação** |
| 🔴 | **2.4 status de pagamento** | 2.4 · 2.5 | **decisão** |
| 🔴 | **5.7 DTE-SN** | 5.4 | **investigação** |
| 🆕 🔴 | **Por onde sai o FGTS** | 8.6 | **investigação** |

🔑 **O Serpro subiu de 3 para 5 linhas** com a entrada da folha. Era importante, virou o item mais alavancado da lista.

**4. Sete telas construídas têm pouco lastro.** `/home-dia1` (30%) · `/avisos` (60%) · as três de `/mais/plano` (15–35%) · e agora as telas de folha, que **não existem**. ⚠️ Vale conferir se o que a gente supôs bate com o que agora sabemos.

---
## 📚 Funcionalidades destrinchadas

| Funcionalidade | Spec | Evidência | Estado |
|---|---|---|---|
| **Pró-labore** | [[pro-labore]] | [[2026-09-09-contabilizei-pro-labore]] | 🟢 desenho fechado, motor a construir |
| **Alíquota e enquadramento** | [[aliquota-e-enquadramento]] | [[2026-09-09-contabilizei-aliquotas]] | 🟢 desenho fechado · 🔴 tabela do IRRF não ratificada |
| **Emitir nota fiscal** | [[emitir-nota-fiscal]] | [[2026-09-09-contabilizei-nota-fiscal]] | 🟢 desenho fechado · 🔴 prazo 01/11/2026 e de-para NBS inexistente |
| **A guia de imposto** | [[guia-de-imposto]] | [[2026-09-09-contabilizei-guia-imposto]] | 🟢 desenho fechado · 🔴 2.4 é decisão de arquitetura, não descoberta |
| **Compliance e rotinas** | [[compliance-e-rotinas]] | [[2026-09-09-contabilizei-central-rotinas]] | 🟢 desenho fechado · 🔴 DTE-SN (5.7) sem caminho |
| **Folha de pagamento** | [[folha-de-pagamento]] | [[2026-09-09-contabilizei-folha-pagamento]] | 🟢 **CORE desde 10/09** · R$39 por colaborador ativo, teto 10 · 🔴 cadastro de colaborador em 35%: o formulário do líder é bloqueado |

🔗 **[[_mapa-de-cruzamentos]]** — como as funcionalidades se puxam. Nasceu em 09/09, quando pró-labore e alíquota chegaram **no mesmo número (37,72%) por caminhos diferentes** e ninguém tinha notado. Toda spec fiscal agora abre com uma seção **Cruzamentos declarados**; a regra está no [[_metodo]], passo 7.

### Fila, na ordem sugerida

✅ **Já feitos (6):** [[pro-labore]] · [[aliquota-e-enquadramento]] · [[emitir-nota-fiscal]] · [[guia-de-imposto]] · [[compliance-e-rotinas]] · [[folha-de-pagamento]].

🔗 **O ciclo mensal está fechado e o estado agregado também:** nota entra → alíquota precifica → pró-labore ajusta → guia sai → compliance diz se está tudo em dia.

1. 🔴 **§7 · Plano, cobrança e conta** — o painel de cobertura acima colocou em **38%**, o pior da casa, e é **onde mora a nossa receita**. Rotas já localizadas e nunca visitadas: `sistema/planos` · `sistema/pagto-pendente` · `sistema/pagto-historico` · `painel/formas-pagamento`. Inclui o **cancelamento**, que é o nosso anti-dark-pattern e sobre o qual não sei nada do líder.
2. ⚪ ~~Extrato bancário~~ — **FORA DE ESCOPO** (Pedro, 09/09): não seremos financeira e não teremos conta PJ. ⚠️ Efeito colateral: a **2.4 perde o caminho do trilho próprio** e sobra a consulta de arrecadação.
3. 🆕 🔴 **§8 · Cadastro de colaborador** — a folha entrou no core em 10/09 e a linha **8.1 está em 35%**: o formulário de admissão do líder é **bloqueado** e nunca vi um campo. Sabemos calcular a folha (8.2 em 95%) e não sabemos cadastrar quem entra nela. ⚠️ Como o líder não mostra, este não sai de teardown: sai de **fonte primária do eSocial** (leiaute do S-2200) ou do Ademar.
4. **§6 · Documentos e certificado** — o A1 é pré-condição de tudo e já apareceu como campo em **5 payloads**, sempre com `diasParaVencimento`. 🔄 A Área de Documentos já foi aberta em 10/09 (10 pastas), então o que falta é o **upload de documento da EMPRESA**, que o líder não tem.
5. **Consultar e cancelar nota** — fecha a NF, e tem a divergência de prazo aberta (730 dias × "mesmo mês").

🔴 **Fora da fila, porque não é descoberta:** a **2.4** não sai de teardown. Já sabemos a resposta do líder (lote mensal + trilho próprio). É **decisão de arquitetura e de negócio**, e precisa do Pedro e do Mauro, não de mais uma passada.

---

## Links
[[HOME]] · [[BASE-ESTRATEGICA]] · [[indice-autoridade]] · [[decisoes-marca]] · [[matriz-portal-interno]] · [[cruzamento-portal-interno]] · [[2026-07-21-dossie-plataforma-logada]]
