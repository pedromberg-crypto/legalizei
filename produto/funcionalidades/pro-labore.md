---
tipo: verdade
status: vivo
dominio: funcionalidade
data: 2026-09-09
assunto: pro-labore
autoridade: fonte-verdade
cobertura: nao-existe
balde: core
dependencia: externa
confianca: alta
bloqueio: motor de cálculo; estado de pagamento por competência (2.4)
tags: [produto, funcionalidade, pro-labore, folha, fator-r]
---

# 👥 Pró-labore — a nossa funcionalidade

> 🧭 **Autoridade:** esta nota manda no **desenho do pró-labore no nosso app**. É o que o dev implementa.
> O que o concorrente faz está em [[2026-09-09-contabilizei-pro-labore]], que é foto com data e **não manda em nada**.
> Hub: [[HOME-produto]] · catálogo: [[_catalogo]] (linhas 4.1–4.7) · dependências: [[_matriz-dependencia]] (4.5).

---


## 🔗 Cruzamentos declarados

> Seção obrigatória, criada pela regra do [[_mapa-de-cruzamentos]] em 09/09. Nenhuma funcionalidade fiscal se documenta sozinha.

| | |
|---|---|
| **⬅️ Recebe de** | **faturamento** (a receita de 12m é o denominador do Fator R) · **cadastro de sócios** (quantos, e o pró-labore de cada um **soma**) · **outro vínculo** (pode zerar o INSS) · **dependentes** (muda o IRRF) |
| **➡️ Manda em** | 🔑 **[[aliquota-e-enquadramento]]** — é a alavanca do Fator R, que escolhe Anexo III (6%) ou V (15,5%) · **DARF Unificado** (INSS + IRRF) · **informe de rendimentos** e o **IRPF do sócio** |
| **📅 Obrigação que dispara** | eSocial S-1200 (dia **15**, antecipa) → DCTFWeb → **DARF** (dia **20**, **ANTECIPA**) · recibo mensal · informe anual |
| **👁️ O cliente precisa ver** | quanto recebe líquido · **quanta folga tem no Fator R** · e que subir o pró-labore **sobe o DARF e desce o DAS** (é gangorra, o que importa é a soma) |

🔴 **O cruzamento em uma frase:** pró-labore **não é um campo de valor, é o preço de uma alíquota**. Mexer nele muda dois impostos em direções opostas. Cadeia completa em [[_mapa-de-cruzamentos]].

---

## 🔭 Por que esta funcionalidade primeiro

O pró-labore parece um campo de valor. Não é. Ele é o **nó onde quatro coisas se cruzam**, e desenhá-lo direito responde muita coisa que ainda está aberta no nosso app:

1. **Fator R** — a folha no numerador decide Anexo III (6%) ou V (15,5%). O pró-labore é a alavanca que a empresa controla.
2. **INSS mensal** — 11% sobre o pró-labore vira DARF, que vira obrigação com vencimento próprio.
3. **eSocial → DCTFWeb** — o valor declarado é evento periódico, e é o que a Receita cruza.
4. **IRPF do sócio** — o informe de rendimentos do ano que vem sai daqui, junto com a distribuição de lucros.

Ou seja: acertar o desenho do pró-labore **destrava** o desenho do cálculo de imposto, do calendário de obrigações, do informe anual e da folha.

---

---

## 📦 Contrato de dados (validado em produção pelo líder)

> Extraído dos 17 endpoints do líder em 09/09, na varredura retroativa de API. Detalhe em [[2026-09-09-contabilizei-pro-labore|§9 da evidência]].

### O payload de uma competência — é o formato da nossa tela "por que pago isso"

```ts
type CalculoCompetencia = {
  faturamentoTotal: number
  nomeMesCompetencia: string

  dasSimples: {
    impostoBruto: number
    deducaoRetencao: number            // 🔑 ISS retido na fonte ABATE do DAS
    impostoTotal: number
    faturamentosPorAliquota: [{ aliquota, faturamento, imposto }]   // 🔑 ARRAY
    inconsistente: boolean             // 🔑 flag de cálculo inconsistente
  }

  darf: {
    inss: { prolabore, aliquota, totalImposto, teto }
    irrf: { prolaboreMaximoIsencaoIRRF, prolabore, deducaoSimplificada,
            valorDeducao, baseCalculoIrrf, aliquota, subTotal, deducaoIrrf, totalImposto }
    total: number
  }

  valorProlaboreUltimos12Meses: number
  valorFaturamentoUltimos12Meses: number
  percentualFatorR: number             // 🔴 eles têm e escondem. Nós MOSTRAMOS
  ultimaCompetenciaSemFaturamento: boolean
  teveAumentoProlabore: boolean
  historicoFaturamento: [{ mes, valorProlabore, valorFaturamento }]  // 12 meses
}
```

🎯 **Um payload só já tem tudo:** os dois impostos, as duas bases, o Fator R, o histórico de 12 meses e as flags de exceção.

### A configuração do sócio

```ts
{
  tipoGerenciamento: "INTELIGENTE" | "PERSONALIZADO" | …
  elegivelNoMotor: boolean           // 🔑 o motor NÃO é para todos
  socios: [{
    valorProlabore, dataUltimaAtualizacao, admin, responsavelReceita,
    possuiDuploVinculo, cnpjDuploVinculo, nomesDependentes,
    exibirInsightIrrf: boolean,
    fluxoAssessorPendente, fluxoAssessorFinalizado   // 🔑 há GENTE no meio
  }]
  valorMaximoInss: 932.3105          // ⚠️ 4 casas; a tela mostra 932,31
  zerarProlabore: boolean            // o toggle "meses sem faturamento"
  valorProlaboreMinimo: number|null  // o piso do sócio
  deveExibirAlertaDividendos: boolean
  prolaboreIndisponivel: boolean
}
```

### 🔴 Três coisas que a API revelou e mudam o desenho

| # | Achado | Efeito na nossa spec |
|:--:|---|---|
| 1 | **`percentualFatorR: 37.72` viaja no payload**, e a tela desenha "≥ 28%" | Encerra a dúvida: esconder é **decisão de produto**, não limitação. Reforça a nossa escolha de mostrar a folga |
| 2 | **A alíquota efetiva real é 5,99987%**, não 6% (`474,59 ÷ 7.910`) | 🔴 O centavo **não é arredondamento**: é a exibida ≠ a calculada. Nossa regra: ou mostra a efetiva com as casas que importam, ou o valor bate com a arredondada. Nunca as duas |
| 3 | **`fluxoAssessorPendente` existe** | A "gestão automática" tem **humano no meio**. Se a gente prometer 100% automático, promete mais que o líder entrega |

⚠️ **`valorMaximoInss: 932.3105`** repete o padrão do centavo: o dado tem 4 casas, a tela mostra 2. **Decidir onde arredondar, uma vez, e testar.**

### Casos que a API expôs e não estavam na nossa lista

| Caso | Onde aparece |
|---|---|
| **ISS retido abate do DAS** | `deducaoRetencao` — liga com `valorPendenteRetencao` por cliente na [[emitir-nota-fiscal|NF]] |
| **Várias alíquotas na mesma competência** | `faturamentosPorAliquota[]` é array (várias atividades, ou interno + externo) |
| **Desconto simplificado no IRRF** | `deducaoSimplificada` |
| **Adiantamento de lucros** | `totalAdiantamentos`, separado do distribuído |
| 🔴🔴 **Débito federal PROÍBE distribuição de lucro** | *"multa de 50% sobre o valor distribuído"*. **Guia não paga → o sócio não pode tirar dinheiro da empresa.** Eleva a 2.4 de higiene contábil para o que **libera o dono a receber** |
| 🔴 **O Fator R soma por RUBRICA, não por total** | O líder marca `incideINSS` em cada rubrica de folha (296 de 606 incidem). O numerador **não é "tudo que se paga"**. Vale já pro pró-labore: nem toda linha do recibo entra |
| 🔑 **Plano de saúde do sócio SAI do pró-labore** | rubricas `escrituraProlabore` batem na conta *"Pró-Labore a Pagar"*. Benefício do sócio é desconto de pró-labore, não despesa separada |
| 🔑 **Lucro é inferido do EXTRATO** | *"qualquer retirada que não seja pró-labore nem devolução de empréstimo"*. Não é ato declarado: é saque identificado |
| 📅 **Dia 15: movimentações** | extrato, investimentos e empréstimos precisam chegar até o dia 15 para entrar na EFD-Reinf |
| 🔴 **Informe bloqueado por pendência** | 5 estados de bloqueio, incluindo **período contábil fechado**, que só destrava contratando **reabertura do balanço** (R$142,90 no líder — distinta da reabertura de MÊS, R$21,90) |

---

## ✍️ O desenho da NOSSA funcionalidade

> Base: tudo acima, filtrado pelo nosso propósito (ME serviço no Simples, BH/MG, app que já tem o A1 do cliente em posse).

### Princípio de partida

O líder trata o pró-labore como **configuração**. A gente vai tratar como **decisão recorrente com consequência visível**. A diferença prática: eles mostram o valor; a gente mostra o valor **e o que ele causou neste mês**.

### As 4 telas

| # | Tela | O que faz | De onde veio |
|:--:|---|---|---|
| **P1** | **Central do sócio** | hub: valor atual, modo ativo, e o efeito do mês | Central de Sócios, mas com a linha de efeito que eles não têm |
| **P2** | **Como você quer definir seu pró-labore** | as 4 formas, cada uma com ganho e custo | tela de gestão, mantendo o par Benefícios/Considere |
| **P3** | **Piso do sócio** | valor mínimo mensal, com o aviso de que piso pode custar imposto | modal de valor mínimo |
| **P4** | **Recibo do mês** | demonstrativo, com as rubricas | recibo legado, trazido pra dentro |

Mais duas de apoio, que não são do flow principal: **outro vínculo** (isenção de INSS) e **dependentes** (IRRF).

### O que a gente copia sem vergonha

1. **O par Benefícios / Considere em toda opção.** Escolha fiscal sem o custo escrito é meia informação.
2. **Modo é da empresa, valor é do sócio.** A regra de convivência multi-sócio deles está certa e resolve o conflito sem travar ninguém.
3. **A otimização é monotônica pra cima, e o piso é piso.** Nunca abaixar do que o sócio disse que precisa receber.
4. **Rubricas codificadas no recibo.** É o que deixa o mesmo motor servir folha CLT depois, sem reescrever.
5. **O toggle de mês sem faturamento.** Resolve a armadilha competência × caixa com uma frase.

### O que a gente faz diferente, e por quê

| # | Eles | Nós | Por quê |
|:--:|---|---|---|
| 1 | Pró-labore em duas gerações de app, com redirect no meio | **Uma tela só**, configuração e recibo no mesmo lugar | Atravessar duas identidades visuais pra uma tarefa é o defeito mais visível deles |
| 2 | "Gestão inteligente ativa. Seu pró-labore está otimizado." | **"Este mês seu pró-labore foi R$X. Isso te manteve no Anexo III e economizou R$Y."** | Eles afirmam a otimização, a gente **mostra a conta**. É a diferença entre confiar e verificar |
| 3 | Botões assimétricos pra sair da otimização | Mesmo aviso, **dois botões no mesmo peso** | O aviso é verdadeiro e continua. O empurrão visual sai |
| 4 | Auditoria derruba a marcação do cliente sem explicar quando | Se a auditoria contradisser o cliente, **dizer a data da checagem** e perguntar, não reverter calado | Desmentir o cliente sem mostrar a fonte é o que corrói a confiança |
| 5 | O Fator R nunca aparece nomeado ao usuário | Nomear o efeito **sem** nomear o jargão: "sua folha está em 31% do faturamento, e é isso que segura sua alíquota em 6%" | O usuário não precisa saber "Fator R". Ele precisa saber que existe uma alavanca e onde ela está |
| 6 | Erro de variável em produção (R$178,31 no lugar de R$1.621) | Valor exibido sempre derivado de uma função, nunca de campo solto | O bug deles é de arquitetura de dado, não de digitação |

### 🔴 A regra nova que este teardown obriga a escrever

O item mais grave não está na interface deles, está no que a interface **permite**:

> **Pró-labore lançado e não pago é passivo, não é folha.**
>
> A folha só entra no numerador do Fator R **se foi efetivamente paga** (regime de caixa), enquanto a receita entra por competência. Recibo emitido sem trânsito financeiro gera glosa, reclassificação para o Anexo V e multa, e a Receita cruza EFD-Reinf com DCTFWeb pra achar isso.

Consequência direta de produto: o nosso app **não pode** somar pró-labore lançado ao Fator R. Ele precisa de um **estado de pagamento por competência**, o que reencontra a linha 2.4 por outro caminho. O toggle "meses sem faturamento" do líder é um paliativo pra isso, não a solução.

---

---

## ✍️ O que a matemática do líder muda no nosso desenho

**1. A tela existe e a gente vai ter uma melhor.** A "Como foi calculado" é a tese de transparência inteira num lugar só. Mas está **escondida**: não tem entrada no menu, só um link no rodapé de outra tela. Na nossa, essa explicação **não é um link, é a própria tela do imposto**. O número e a conta moram juntos.

**2. Mostrar a folga, não esconder.** Onde eles escrevem "maior ou igual a 28%", a gente escreve o número e o que ele significa:

> "Sua folha está em **37,7%** do faturamento dos últimos 12 meses. O mínimo pra manter a alíquota em 6% é 28%. **Você tem R$ 4.269 de folga.**"

Sem citar "Fator R" e sem citar "Anexo III". A alavanca aparece, o jargão não.

**3. O gráfico de 12 meses é a peça central, não um enfeite.** Faturamento e pró-labore lado a lado, com a linha dos 28%. É a única forma de o dono **ver** por que o valor dele mudou em maio. Eles já fazem, e fazem bem.

**4. Regra de arredondamento antes do motor.** O desencontro de um centavo no DAS deles é pequeno e é exatamente o tipo de coisa que destrói confiança quando o cliente confere. Nossa regra tem que ser escrita, testada e igual na tela e na guia.

**5. Fórmulas que já dá pra fixar como teste unitário:**

| # | Regra | Fonte |
|:--:|---|---|
| 1 | `INSS_sócio = min(11% × pró-labore; 932,31)` | tela + teto R$ 8.475,55 |
| 2 | `DARF Unificado = INSS + IRRF` | tela |
| 3 | `Base IRRF = pró-labore − INSS` | tela |
| 4 | `IRRF = (base × alíquota) − dedução`, faixas na tabela acima | tela (🔴 ratificar tabela) |
| 5 | `Σ(pró-labore 12m) ≥ 0,28 × Σ(faturamento 12m)` mantém Anexo III | tela + LC 123 |
| 6 | `pró-labore do mês = max(piso; o que falta para cumprir a regra 5)` | box de cálculo |
| 7 | DAS incide sobre o faturamento **do mês anterior** | tela |

---

---

## 📌 O que fica em aberto

| | Pergunta | Onde resolve |
|---|---|---|
| 🔴 | A auditoria de pagamento deles é e-CAC, Open Finance ou conciliação humana? Os 30 dias são limite técnico ou política? | investigação da linha 2.4 |
| 🔴 | Nosso motor consegue estado de pagamento do pró-labore por competência, sem perguntar? | mesma investigação |
| 🟡 | O Integra Contador devolve o DARF Unificado já numerado, ou só transmite a DCTFWeb? | contrato Serpro |
| 🟡 | Com dois sócios e um em Personalizado, como fica o rateio do Fator R? | modelagem |
| 🟡 | Faixa de IRRF sobre pró-labore alto: entra no MVP ou fica pro motor v2? | escopo |

---

---

## Próximos teardowns na mesma régua

O menu **Minhas Rotinas** do líder tem 3 seções, e cada linha é uma funcionalidade candidata a este mesmo tratamento:

- **Notas Fiscais:** Emitir NFs-e · Como emitir notas de serviço · Importar notas fiscais · Consultar notas fiscais · Cancelar nota fiscal · Registrar notas tomadas · Ver minhas alíquotas
- **Movimentações:** Importar extrato bancário · Fazer lançamentos caixa · Gerenciar conta bancária
- **Impostos:** Histórico de impostos · Ver impostos a pagar · Simulador de impostos · Ver minhas alíquotas · **Como meu imposto foi calculado?** `Novo`

🎯 Sugestão de ordem: **"Como meu imposto foi calculado?"** primeiro (é o `Novo` deles, ou seja, onde estão investindo agora, e é transparência, que é a nossa tese), depois **Emitir NFS-e** (nossa linha 3.1, já resolvida em API) e depois **Importar extrato bancário** (que é a porta de entrada do 2.4).
