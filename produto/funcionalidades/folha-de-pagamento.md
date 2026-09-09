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
| **📅 Obrigação que dispara** | eSocial (dia 15) · FGTS Digital (dia 20, **antecipa**) · DCTFWeb · RAIS/DIRF (extintas, absorvidas) |
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

---

## Links
[[_mapa-de-cruzamentos]] · [[2026-09-09-contabilizei-folha-pagamento]] · [[pro-labore]] · [[aliquota-e-enquadramento]] · [[guia-de-imposto]] · [[HOME-produto]] · [[_catalogo]]
