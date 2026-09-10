---
tipo: verdade
status: vivo
dominio: funcionalidade
data: 2026-09-09
assunto: folha-de-pagamento
autoridade: fonte-verdade
cobertura: nao-existe
balde: backlog
dependencia: externa
confianca: media
bloqueio: fora do MVP; motor de folha; eSocial via Serpro
tags: [produto, funcionalidade, folha, fopag, esocial, rubricas, fator-r]
---

# 👷 Folha de pagamento — a nossa funcionalidade

> 🧭 **Autoridade:** manda no desenho da folha no nosso app.
> O que o concorrente faz está em [[2026-09-09-contabilizei-folha-pagamento]], foto com data.
> Hub: [[HOME-produto]] · catálogo: [[_catalogo]] · dependências: [[_matriz-dependencia]].
>
> ⚠️ **Escopo:** ME serviço no MVP é **quase sempre sem funcionário**. Isto é 🔵 **backlog**, não core. A nota existe porque a varredura entregou o **modelo de dados**, e ele muda coisa no que já é core.

---

## 🔗 Cruzamentos declarados

| | |
|---|---|
| **⬅️ Recebe de** | **cadastro do colaborador** (PIS/NIT, admissão, cargo/CBO) · **rubricas lançadas** no mês · **benefícios** (plano de saúde, VT, VR) |
| **➡️ Manda em** | 🔑 **[[aliquota-e-enquadramento]]** — folha CLT **soma no Fator R** junto com o pró-labore · **[[guia-de-imposto]]** (INSS patronal, FGTS, IRRF) · **contabilidade** (cada rubrica já traz débito e crédito) |
| **📅 Obrigação que dispara** | eSocial · EFD-Reinf R-2099 · EFD-Reinf R-4099 · DCTFWeb — **todas dia 15** (observado na varredura) · ⚠️ **FGTS Digital dia 20, antecipa** — isto vem da [[2026-09-09-verificacao-auditoria-tributaria|verificação fiscal]], **não da varredura do líder**, onde o FGTS não apareceu como rotina (ver §"o que não sei") |
| **👁️ O cliente precisa ver** | quanto custa o funcionário **de verdade** (salário + encargos) e **o que a folha faz com a alíquota dele** |

🔴 **O cruzamento que importa mesmo sem funcionário:** **folha CLT e pró-labore somam no MESMO numerador do Fator R.** Quem contrata alguém muda a própria alíquota. Isso precisa estar no simulador antes de existir folha.

---

## 📦 Contrato de dados (validado em produção pelo líder)

### A rubrica, e as 4 flags que decidem tudo

```ts
type Rubrica = {
  codigo: string
  descricao: string
  naturezaMovimento: "PROVENTO" | "DESCONTO" | "INFORMATIVA"
  unidadeDeMedida: "un" | "h" | "d" | "m" | "%"
  visibilidade: "FOLHA" | "CADASTRO" | "AMBOS"
  habilitaQtde: boolean
  habilitaValor: boolean

  incideINSS: boolean       // 🔑 decide o FATOR R
  incideFGTS: boolean
  incideIRRF: boolean
  escrituraProlabore: boolean

  contaContabilCredito: { id, descricao }   // 🔑 plano de contas
  contaContabilDebito:  { id, descricao }
}
```

**606 rubricas** no líder: 390 proventos, 207 descontos, 9 informativas.

🔑 **Três decisões que valem copiar, e a primeira muda o que já é core:**

| | O quê |
|:--:|---|
| 1 | 🔴 **`incideINSS` por rubrica é o que define o Fator R.** Não é "tudo que se paga": é o que tem incidência de INSS (296 das 606). **Nosso motor de Fator R precisa somar por flag, não por total bruto** — e isso vale **hoje**, pro pró-labore, antes de existir folha |
| 2 | **Cada rubrica carrega débito e crédito contábil.** É o que faz a folha alimentar Balancete e DRE sem trabalho manual. Sem isso, o motor contábil vira digitação |
| 3 | **A natureza `INFORMATIVA`**: benefício aparece no holerite e **não entra na conta**. Existe porque o funcionário precisa ver o VT/VR sem que vire base de cálculo |

⚠️ **Duas tabelas de rubrica, não uma.** As do pró-labore (`042 Prolabore`, `043 INSS Prolabore`) **não estão** na tabela de folha. Elas só se tocam pelos **descontos de benefício**: plano de saúde do sócio sai do pró-labore (`escrituraProlabore` → conta *"Pró-Labore a Pagar"*).

---

## 🪜 O passo a passo para ter um colaborador

> 🔒 **Regra desta seção:** montada **só** com o que a varredura de 09/09 devolveu. Cada linha diz de onde veio, e o que é **observado** está separado do que é **inferido**. Nada de fonte externa.
>
> ⚠️ **O limite que define a confiança de tudo abaixo:** o **formulário de admissão está bloqueado** no líder (*"entre em contato com a nossa equipe"*). **Nunca vi os campos de cadastro.** O bloco 1 é montado de fontes indiretas, e está marcado como tal.

### Bloco 0 — pré-condições da EMPRESA, antes de existir qualquer colaborador

| # | O que precisa | Evidência | |
|:--:|---|---|:--:|
| 0.1 | **Certificado Digital A1 ou Procuração** | campo `requisitos` das rotinas eSocial, EFD-Reinf R-2099, R-4099 e DCTFWeb: *"Certificado Digital ou Procuração"* | 🟢 observado |
| 0.2 | **PIS/NIT do beneficiário cadastrado** | pendência cód **43** (*"Cadastre o PIS para ativar o pró-labore automático"*) + coluna `PIS/NIT` no demonstrativo | 🟡 observado para o **sócio**; para empregado é **inferência** (o layout do recibo é compartilhado) |
| 0.3 | **Plano de contas contábil** | toda rubrica traz `contaContabilCreditoId` e `contaContabilDebitoId` | 🟢 observado |

### Bloco 1 — cadastrar o colaborador

| # | O que precisa | Evidência | |
|:--:|---|---|:--:|
| 1.1 | **Identificação:** nome · PIS/NIT · CBO-Cargo · data de admissão | colunas do cabeçalho do demonstrativo de pagamento | 🟡 inferido do layout compartilhado |
| 1.2 | 🔑 **Rubricas de valor fixo, definidas no cadastro** | **88 rubricas** com `visibilidade: CADASTRO` (+321 `AMBOS`): valem por cadastro, não por mês | 🟢 observado |
| 1.3 | **Categoria do trabalhador** | enum de duplo vínculo: CLT · PJ/sócio · autônomo · médico residente · servidor público | 🟡 observado em **outro** contexto (vínculo do sócio) |
| 1.4 | **Dependentes** (para IRRF) | coluna `Dep. IRRF` no demonstrativo + item "Dependentes" na Central de Sócios | 🟡 inferido |
| 1.5 | 🔴 **Atendimento humano** | `ADICIONAR COLABORADOR` devolve *"entre em contato com a nossa equipe"* | 🟢 observado |

### Bloco 2 — a rotina mensal, depois que existe colaborador

| # | O que precisa | Evidência | |
|:--:|---|---|:--:|
| 2.1 | **Lançar as rubricas do mês** | `fopag/movimento/list` · **197 rubricas** com `visibilidade: FOLHA` | 🟢 observado |
| 2.2 | **Classificar cada rubrica em 4 flags** | `incideINSS` · `incideFGTS` · `incideIRRF` · `escrituraProlabore` | 🟢 observado |
| 2.3 | 🔑 **Somar no Fator R só o que tem `incideINSS`** | **296 de 606** incidem | 🟢 observado |
| 2.4 | **Fechar a competência** | `fopag/folha/getMesCompetencia` devolve `{mes, ano}` **do servidor** | 🟢 observado |
| 2.5 | **eSocial** — funcionários, sócios, RPA e folha | descrição da rotina · prazo **dia 15** | 🟢 observado |
| 2.6 | **EFD-Reinf R-2099** — retenção de INSS em notas | rotina da casa · dia **15** | 🟢 observado |
| 2.7 | **EFD-Reinf R-4099** — IRRF em notas tomadas, aluguel PF, distribuição de lucro | rotina da casa · dia **15** | 🟢 observado |
| 2.8 | **DCTFWeb** — consolida eSocial + EFD-Reinf e gera o DARF | descrição da rotina · dia **15** | 🟢 observado |
| 2.9 | 🔴 **Declarar mesmo em mês SEM movimento** | serviço à-la-carte *"GFIP/DCTFWeb/eSocial **Sem Movimento**"*, R$71,90 | 🟢 observado |

### Bloco 3 — desligar

| # | O que precisa | Evidência | |
|:--:|---|---|:--:|
| 3.1 | **Escolher a modalidade** entre 11+ | `enumeration/tipoDesligamento`: sem justa causa · por justa causa · a pedido · término de prazo · término de contrato · 5 modalidades de aposentadoria · … | 🟢 observado |
| 3.2 | **Rubricas de rescisão** | ex.: `082 13º Salário Rescisão`, `0257 1/3 Férias indenizadas Rescisão` | 🟢 observado |
| 3.3 | 🔴 **Atendimento humano** | *"Rescisão Retroativa"* é serviço de catálogo, R$103,40 | 🟢 observado |

### 💰 O que o líder cobra por cada movimento

| Movimento | Preço |
|---|---:|
| Admissão retroativa | R$ 98,90 |
| Rescisão retroativa | R$ 103,40 |
| Alteração na folha (FOPAG) | R$ 98,90 |
| GFIP/DCTFWeb/eSocial **sem movimento** | R$ 71,90 |

🔑 **A linha 2.9 é a mais reveladora da tabela inteira.** Ter um funcionário **cria obrigação mensal permanente**, mesmo em mês sem nada a declarar. **Não existe "pausar a folha"** — e isso muda a conversa de preço: o custo não é do movimento, é da existência do vínculo.

🎯 **Consequência direta para o nosso ICP:** contratar a primeira pessoa **não é um evento, é uma mudança de regime operacional** — e o cliente precisa saber disso **antes** de contratar, não depois.

### 🔴 O que NÃO sei, e não vou preencher

| | O que ficou sem resposta |
|:--:|---|
| ❌ | **Os campos reais do formulário de admissão.** Bloqueado; nunca vi |
| ❌ | **Prazo de admissão** (quantos dias antes do início o eSocial exige) — não apareceu em nada que li |
| ❌ | **Se há exame admissional, contrato ou ASO** no fluxo deles — não observado |
| ❌ | **O 3º filtro `Selecione`** da tela "Movimentações da Folha" — vi o campo, não vi as opções |
| ❌ | **Como o FGTS é gerado e por qual rotina** — a flag existe, a rotina não apareceu |
| ❌ | **Outras enumerações** (tipo de contrato, jornada, motivo de afastamento) — o endpoint é genérico, mas **não adivinhei nomes**, conforme a regra do [[_metodo]] |

⚠️ **O item do FGTS é o mais estranho da lista, e vale investigar:** `incideFGTS` existe em **314 rubricas**, e o FGTS **não aparece em nenhuma das 15 rotinas** que a casa executa. Ou ele sai por outro caminho, ou a lista de rotinas está incompleta — e ela mesma avisa que *"algumas rotinas ainda não aparecem aqui"*.

---

## 🔴 A decisão de produto que o líder já tomou por nós

**No líder, admitir funcionário NÃO é self-service.** O botão existe e devolve *"entre em contato com a nossa equipe"*. E o catálogo cobra por cada movimento: admissão R$98,90, rescisão R$103,40, alteração de FOPAG R$98,90.

🎯 **Folha, no produto deles, é SERVIÇO — não funcionalidade.** O cliente consulta; o contador executa.

**E isso é defensável:** admissão erra caro (eSocial rejeita, prazo de 1 dia útil antes do início), e um app que deixa o leigo admitir sozinho está criando passivo. **Mas o botão verde que só dá erro é o pior dos dois mundos.**

### Nossa posição

| | |
|---|---|
| 🔵 **MVP** | **não temos folha.** ME serviço no nosso ICP é quase sempre solo. Se o cliente contratar, é caso de atendimento |
| 🎯 **Mas o SIMULADOR precisa saber de folha desde já** | "e se eu contratar alguém?" muda o Fator R, a alíquota e o custo. **É pergunta de quem está crescendo, e a gente atende quem cresce** |
| ✍️ **Se um dia tiver** | ou é self-service de verdade, com validação e prazo explicados, **ou o botão não existe**. Nunca botão que só devolve erro |

---

## ✍️ O que fazemos diferente

| # | Eles | Nós |
|:--:|---|---|
| 1 | Botão `ADICIONAR COLABORADOR` que só devolve erro | **Ou faz, ou não existe.** Se é atendimento, a tela diz isso antes do clique |
| 2 | 606 rubricas, incluindo dezenas de acordos coletivos que não se aplicam ao ICP | **Só as que o perfil usa.** Mesmo argumento das 21 pendências |
| 3 | Folha e pró-labore em tabelas separadas, sem o cliente ver a soma | **Mostrar o Fator R somando os dois.** É a pergunta real de quem vai contratar |

---

## 🔴 O que trava

| | O quê |
|:--:|---|
| 🔵 | **Fora do MVP** por decisão de escopo (ICP solo) |
| 🔴 | Motor de folha não existe |
| 🔴 | eSocial depende do Serpro Integra Contador, não contratado |
| 🟡 | Tabela de rubricas própria: precisa ser curada pro nosso perfil, não copiada |
| 🕓 | **FGTS: a flag existe, a rotina não.** `incideFGTS` em 314 rubricas, e o FGTS **não aparece em nenhuma das 15 rotinas** que a casa executa. Ou sai por outro caminho, ou a lista deles está incompleta — e ela mesma avisa que *"algumas rotinas ainda não aparecem aqui"*. **Investigar antes de desenhar folha** |
| ❌ | **Campos do formulário de admissão desconhecidos** — bloqueado no líder. O bloco 1 do passo a passo é inferência marcada, não observação |

---

## Links
[[_mapa-de-cruzamentos]] · [[2026-09-09-contabilizei-folha-pagamento]] · [[pro-labore]] · [[aliquota-e-enquadramento]] · [[guia-de-imposto]] · [[HOME-produto]] · [[_catalogo]]
