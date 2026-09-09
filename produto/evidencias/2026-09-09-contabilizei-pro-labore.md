---
tipo: fato
status: vivo
dominio: evidencia
data: 2026-09-09
fonte: Contabilizei
acesso: cliente-interno # conta real do Pedro, plano Padrão R$195
assunto: pro-labore
tags: [produto, evidencia, concorrente, pro-labore, folha]
---

# 🔎 Evidência — pró-labore na Contabilizei (09/09/2026)

> ⚠️ **Isto é uma foto com data, não uma decisão.** Descreve o que a Contabilizei mostrava em **09/09/2026**. Eles mudam a tela e esta nota envelhece sozinha. O que a gente **vai fazer** vive em [[pro-labore]], e não envelhece pelo mesmo motivo.
>
> **Método:** navegação só-leitura na conta logada do Pedro. Nenhum botão de salvar, confirmar, recalcular ou pagar foi clicado. **Único toque:** um rádio foi selecionado na tela de gestão para revelar o conteúdo condicional, e a tela foi abandonada sem confirmar. Regra completa em [[_metodo]].
>
> 🔄 **Backfill de 09/09 (2ª rodada):** este foi o **primeiro** teardown da série e rodou **antes** de a leitura de API virar passo do método. A varredura de API foi feita depois, a pedido do Pedro, e está em **§9**.
>
> **Rotas visitadas:** `#/socio/central` · `#/socio/editar-gestao/{id}` · `#/socio/{id}/duplo-vinculos` · `#/socio/comprovante-rendimentos` · `/sistema/#/prolabore` · `/sistema/#/ficha-financeira` · `#/impostos` · `#/impostos-a-pagar/como-foi-calculado`
>
> **Ligações:** [[pro-labore]] (a spec) · [[_matriz-dependencia]] (linhas 4.5, 2.4, 2.7) · [[2026-09-09-verificacao-auditoria-tributaria]] · [[2026-07-21-dossie-plataforma-logada]]

---


## 🗺️ Mapa do que existe no líder

### A arquitetura, e o que ela entrega de graça pra gente

O pró-labore vive em **duas gerações de app ao mesmo tempo**, e a costura é visível pro usuário:

| Onde | Rota | Geração | O que faz |
|---|---|---|---|
| Central de Sócios | `/painel-de-controle/#/socio/central` | nova | hub, configuração, histórico |
| Escolha do modo | `/painel-de-controle/#/socio/editar-gestao/{id}` | nova | as 4 formas de gerir |
| Duplo vínculo | `/painel-de-controle/#/socio/{id}/duplo-vinculos` | nova | isenção de INSS |
| Informe de rendimentos | `/painel-de-controle/#/socio/comprovante-rendimentos` | nova | IRPF + lucros |
| **Recibo / folha** | `/sistema/#/prolabore` | **legada** | demonstrativo mensal |
| **Ficha financeira** | `/sistema/#/ficha-financeira` | **legada** | saldos de migração |

⚠️ **O detalhe que entrega a estratégia deles:** o botão "Cadastrar pró-labore" **dentro do app legado redireciona de volta pro app novo**. Ou seja, a **escrita já migrou e a leitura ficou pra trás**. Eles migraram por onde o usuário decide, não por onde o usuário consulta.

🎯 **O que isso vale pra nós:** é a confirmação de que o caminho de migração de um sistema contábil é *decisão primeiro, documento depois*. E é também o defeito de UX mais visível do produto deles: o usuário atravessa duas identidades visuais pra completar uma tarefa só.

---

### 1. Central de Sócios (o hub)

Dois cards no topo, lado a lado:

| Card | Conteúdo |
|---|---|
| **Total de pró-labore** | `R$ 1.621,00` · selo de competência `Set/2026` · "1 sócio com pró-labore definido" |
| **Gestão inteligente ativa** ⚡ | "Seu pró-labore está otimizado para economia mensal dos impostos." + botão `Editar` |

Abaixo, **Configurações do sócio**, um acordeão por sócio com o nome, o CPF e a tag `Sócio Admin`. Dentro, três linhas com ação à direita:

| Linha | Valor | Ação | Extra |
|---|---|---|---|
| Pró-labore atual | R$ 1.621,00 ✅ | `Editar` | pill `Gestão Inteligente ⚡` + "Última atualização 01/06/2026" |
| Vínculo empregatício ou sócio (Duplo vínculo) | Não | `Gerenciar` | |
| Dependentes | 0 | `Gerenciar` | |

E, solto abaixo do card, um toggle:

> ⬜ **"Não quero ter pró-labore cadastrado em meses sem faturamento."**

🔴 **Esse toggle é o achado mais subestimado da tela.** Ele existe porque a folha só conta no Fator R **se foi efetivamente paga**, e porque pró-labore em mês sem receita é dinheiro saindo sem necessidade. É a mesma armadilha que a [[2026-09-09-verificacao-auditoria-tributaria|verificação de ontem]] levantou (competência × caixa), resolvida na interface com uma frase de nove palavras.

---

### 2. As 4 formas de gerir o pró-labore

Tela `Como você prefere gerenciar seu pró-labore?`, agrupada em duas famílias:

**⚡ Gestão Inteligente**
- **Otimização automática inteligente** `recomendado` `gestão inteligente ⚡`
  "Calculamos e ajustamos mensalmente o melhor valor para reduzir seus impostos."

**📄 Gestão tradicional**
- **Personalizado** — "Você define um valor fixo para o pró-labore."
- **Salário Mínimo** — "Pró-labore fixo no salário mínimo vigente: R$ 1.621,00."
- **Teto do INSS** — "Pró-labore no valor do teto do INSS vigente R$ 8.475,55."

A opção selecionada **expande** e mostra dois blocos, sempre nessa ordem:

| Bloco | Cor | Exemplo (Personalizado) |
|---|---|---|
| **Benefícios** ✓ | verde | "Previsibilidade do valor dos impostos." |
| **Considere** ⚠️ | âmbar | "Pagar mais imposto do que o necessário na soma de todos os impostos." · "As suas preferência de faturamento não serão consideradas." |

🎯 **Padrão que vale copiar:** toda escolha mostra o custo dela, não só o ganho. É honestidade-antes-do-toque aplicada a uma decisão fiscal. Combina com o que já está travado na nossa doutrina de portal.

⚠️ **Bug real no líder, anotado:** na opção **Salário Mínimo**, o bloco Benefícios mostra `Pró-labore fixo no salário mínimo vigente: R$ 178,31`. R$ 178,31 é o **desconto de INSS**, não o pró-labore. Trocaram a variável. Serve de lembrete de que o líder erra em produção também.

---

### 3. A mecânica da Gestão Inteligente (extraída dos modais)

Os modais estão no DOM antes de abrir, e juntos descrevem o algoritmo e a política inteira:

**a) O algoritmo, em uma frase**
> "Você pode cadastrar um valor mínimo para o sócio receber todo mês. A gestão inteligente **pode aumentar** o valor do pró-labore para adequar a contabilidade, **mas nunca abaixá-lo** do valor mínimo definido."

🔑 **Traduzindo:** o valor mínimo do sócio é tratado como **piso da otimização**, nunca como alvo. A otimização sobe o pró-labore acima desse piso quando precisa alcançar os 28% do Fator R, e nunca desce abaixo dele.

✅ **Precisado em seguida:** a tela `#/impostos-a-pagar/como-foi-calculado` (seção abaixo) mostra que isso é uma **minimização com restrição**, não simplesmente "subir". Ver [[#🧮 A matemática inteira, na tela deles]].

**b) O anti-nudge, que é o oposto do que se espera**
> ⚠️ "O valor mínimo que você definir **pode não ser a melhor opção** para pagar menos impostos totais da sua empresa. Para pagar menos impostos, confirme sem valor mínimo."
>
> Botões: `Definir valor mínimo` · `Confirmar sem valor mínimo`

Eles empurram o usuário a **abrir mão do controle**, e justificam com economia. Sugestões pré-carregadas no campo: `Teto do INSS R$ 8.475,55` e `Salário mínimo R$ 1.621,00`.

**c) A trava de saída**
> **"Tem certeza que deseja mudar?"**
> "Sua empresa vai sair da Gestão Inteligente e não terá mais a configuração do pró-labore automática. **Esta mudança pode causar um aumento de impostos a pagar todo mês.**"
>
> Botões: `Manter Gestão Inteligente` · `Confirmar alteração para Tradicional`

⚠️ Botões assimétricos, com o caminho de saída em texto longo e o de permanência em destaque. Está no limite do dark pattern. **O aviso é verdadeiro** (sair pode custar imposto), então não é mentira; o que incomoda é o peso visual. Nossa versão diz a mesma verdade com os dois botões no mesmo peso.

**d) Multi-sócio: a regra de convivência**
> **"Atenção"** — "Sua empresa permanecerá na Gestão Inteligente devido à configuração de otimização de impostos escolhida por **um dos sócios**. Fique tranquilo: o seu pró-labore individual continuará sendo processado com o valor fixo que você definiu."
>
> E: "Esta configuração será aplicada para 1 sócio(s) que escolheram a Gestão Inteligente."

🔑 **A regra: o modo é da EMPRESA, o valor é do SÓCIO.** Um sócio em Personalizado não tira a empresa da otimização; ele apenas se retira do cálculo automático. Isso resolve o conflito sem bloquear ninguém, e é o desenho certo.

---

### 4. Duplo vínculo

Empty state honesto e didático:
> "Você ainda não tem nenhum vínculo cadastrado.
> **Trabalha em outra empresa? Cadastre seu vínculo para verificar se você tem direito à isenção de INSS sobre o seu pró-labore.**"

Formulário `Adicionar vínculo empregatício`:

| Campo | Tipo | Observação |
|---|---|---|
| Categoria | select | 5 opções (abaixo) |
| CNPJ do outro vínculo | máscara CNPJ | |
| Tipo de remuneração | rádio | `Fixa` · `Variável` |
| Base de cálculo (Remuneração) | moeda | "É o valor sobre o qual é calculado o desconto do INSS do funcionário no mês." |
| Descontos do INSS | moeda | "Valor descontado do salário para contribuição do INSS." |

**Categorias:** CLT (Trabalhador com Carteira Assinada) · PJ, sócio ou dono da Empresa · Trabalhador Autônomo (Profissional Liberal) · Médico Residente · Servidor público ou contratado temporário público.

🔑 **Por que existe:** o INSS do segurado tem **teto único por pessoa**, não por vínculo. Se o sócio já contribui em outro lugar, o desconto sobre o pró-labore pode ser reduzido ou zerado. Pedir os dois valores (base + desconto já feito) é o que permite calcular a sobra até o teto.

---

### 5. O recibo (app legado)

Lista por competência (seletor mês/ano com setas), colunas `Sócio · CPF · Pró-Labore · **Status Pró-Labore** · Visualizar`. Em Ago/2026 o status é `Confirmado`. Setembro ainda não tem folha: *"Nenhuma folha pró-labore cadastrada."*

O `Visualizar` abre uma pré-visualização imprimível:

**Demonstrativo de Pagamento Mensal — AGOSTO / 2026**

Cabeçalho: Empresa + CNPJ · `Colaborador | PIS/NIT | CBO-Cargo | Admissão`. O cargo aparece como **"Sócio"** e a admissão como a data de entrada no quadro societário.

| Código | Descrição | Referência | Proventos | Descontos |
|---|---|---|---|---|
| 042 | Prolabore | 30 un | 1.621,00 | |
| 043 | INSS Prolabore | 11 % | | 178,31 |
| | **TOTAL** | | **1.621,00** | **178,31** |
| | **LÍQUIDO** | | **1.442,69** | |

Rodapé com as bases: `Salário base | Salário contr. INSS | Dep. IRRF | Base cálculo IRRF | FGTS mês | Salário FGTS` → `1.621,00 | 1.621,00 | 0 | 0,00 | 0,00 | 0,00`.

E a declaração: *"Declaro ter recebido a importância líquida discriminada neste recibo."*

🔑 **Três coisas a aprender daqui:**
- **Rubricas codificadas** (042 provento, 043 desconto). Isso não é decoração: é o vocabulário da folha, e é o que permite o mesmo motor servir pró-labore e CLT depois.
- **FGTS zerado** no recibo do sócio, e corretamente. Sócio não tem FGTS. As colunas existem porque o layout é compartilhado com a folha CLT.
- **IRRF zerado** porque R$1.621 está abaixo da faixa de isenção. Com pró-labore no teto do INSS, essa linha acende. Nosso motor tem que tratar as duas situações.

---

### 6. Informe de rendimentos

Seleção de `Ano Competência` + sócio, com `Pré-visualizar` e `Baixar Informe`. Abaixo, painel **Distribuição de Lucros**: *"O informe de rendimentos considera os seguintes valores encontrados no período"*, com três cards: `Lucros acumulados` · `Lucros distribuídos aos sócios` · `Lucros da empresa`.

Coluna lateral de dúvidas, que é um retrato do que o usuário não entende:
- "Meu informe está zerado. O que aconteceu?"
- "Para que serve a distribuição de lucros?"
- "O que é informe de rendimentos?"
- "Quais os passos para declarar meu IRPF?"
- "Sou obrigado a declarar o IRPF?"
- "Qual a diferença entre IRPJ e IRPF?"
- "Vocês também irão entregar meu IRPF?" ← **pergunta de upsell disfarçada de dúvida**

🎯 O informe é onde o pró-labore **encontra** a distribuição de lucros. As duas formas de tirar dinheiro da empresa aparecem na mesma tela, uma tributada e outra isenta. É a tela mais didática do produto deles e a que mais claramente prepara uma venda avulsa.

---

### 7. Onde o pró-labore vira dinheiro a pagar

Em `Impostos a pagar`, competência Ago/2026:

| Imposto | Competência | Vencimento | Valor |
|---|---|:--:|---|
| **DARF Unificado** | Ago/2026 | **18/09/2026** | Calculando |
| **DAS SIMPLES** | Ago/2026 | **21/09/2026** | Calculando |

🔴 **Confirmação empírica do nosso calendário.** 20/09/2026 cai num domingo. O **DARF antecipou para sexta (18)** e o **DAS prorrogou para segunda (21)**. Mesma competência, duas guias, três dias de diferença e regras opostas de deslocamento. Exatamente o que a verificação de ontem afirmou em teoria, agora visto funcionando na tela do líder.

E as vencidas confirmam o vínculo com o pró-labore:

| Imposto | Competência | Vencimento | Valor |
|---|---|:--:|---|
| DARF Unificado | Mai/2026 | 19/06/2026 | R$ 178,31 |
| DARF Unificado | Jun/2026 | 20/07/2026 | R$ 178,31 |
| DARF Unificado | Jul/2026 | 20/08/2026 | R$ 178,31 |

R$ 178,31 = 11% de R$ 1.621,00. **O "DARF Unificado" é a guia do INSS do pró-labore**, saindo via DCTFWeb. Isso fecha a linha **4.5** da nossa matriz de dependência com evidência de tela, não só de documentação.

Também há botão `Recalcular` com a instrução *"Peça o recálculo para atualizar o valor com juros e multas"* — nossa linha **2.7**, funcionando.

---

---

## 🔴 O achado que mexe com a nossa linha 2.4

No topo da tela de impostos:
> "Nossa auditoria identificou a falta de pagamento de uma ou mais guias de imposto. Saiba mais na aba **Em atraso**."

E o tooltip por guia:
> **"Nossa auditoria identificou a falta de pagamento desta guia. Caso você já tenha feito o pagamento nos últimos 30 dias, marque novamente como paga."**

Isso reabre o que a gente tinha como certo. Leitura honesta:

| O que a gente supunha | O que a tela mostra |
|---|---|
| O líder só pergunta "você pagou?" | Ele pergunta **e** audita. As duas coisas convivem |
| 2.4 não tem solução no mercado | Tem uma solução **parcial**, com atraso declarado de ~30 dias |

⚠️ **Mas o preço dessa solução aparece na própria frase.** A auditoria **derruba a marcação do usuário**: quem já tinha marcado "paguei" precisa marcar de novo. O sistema desconfia do cliente e obriga ele a repetir a afirmação. É um contrato de UX ruim, e é a brecha exata onde a nossa promessa vale alguma coisa.

🎯 **O que muda pra nós:** 2.4 continua 🔴, mas a pergunta muda. Não é mais *"dá pra saber que foi pago?"*. É **"dá pra saber com menos de 30 dias de atraso, e sem desmentir o cliente?"**. Se a resposta for sim, isso é diferencial vendável. Se for não, a gente pelo menos sabe qual é o piso do mercado.

---

---

## 🧮 A matemática inteira, na tela deles

> Rota: `#/impostos-a-pagar/como-foi-calculado`, título **"Seus impostos desse mês"**. Não está no menu: só se chega por um link no rodapé da tela de impostos ("Como meu imposto foi calculado?"). É a peça mais valiosa do teardown, e é literalmente o motor de cálculo que a gente precisa reproduzir.

Abre com `Faturamento de Agosto: R$ 7.910,00` e dois cartões.

### Cartão 1 — DAS SIMPLES

> "Calculado sobre o faturamento **do mês anterior**, reúne diversas arrecadações em um único imposto."

| Linha | Valor |
|---|---|
| Faturamento | R$ 7.910,00 |
| Alíquota aplicada | 6% |
| **Total** | **R$ 474,59** |

⚠️ **Divergência de um centavo, anotada:** 7.910,00 × 6% = **474,60**, e a tela mostra **474,59**. Ou eles truncam em vez de arredondar, ou a alíquota exibida (6%) é um arredondamento da alíquota efetiva real. Não dá pra concluir qual pela tela. **Importa pra nós:** o valor exibido e o valor da guia têm que fechar ao centavo, senão o cliente encontra a diferença e a confiança vai junto. Definir a regra de arredondamento **antes** de escrever o motor.

### Cartão 2 — DARF UNIFICADO (é a soma de dois tributos)

Aqui está a resposta limpa pra pergunta "o que é o DARF Unificado": **IRRF + INSS sobre o pró-labore**, numa guia só.

**IRRF** — "Semelhante ao IRPF, é calculado sobre pró-labore com valores **a partir de R$ 2.428,80**."

Cadeia de cálculo, na ordem em que a tela mostra:
```
Pró-labore ideal
  − Dedução INSS
  = Base de cálculo IRRF
  × Alíquota do IRRF
  = Subtotal
  − Dedução do IRRF
  = Total IRRF
```

**Tabela do IRRF** (modal, valores exibidos em Set/2026):

| Base de cálculo (R$) | Alíquota | Dedução do IR |
|---|:--:|---|
| até R$ 2.428,80 | — | — |
| de R$ 2.428,81 até R$ 2.826,65 | 7,5% | R$ 182,16 |
| de R$ 2.826,66 até R$ 3.751,05 | 15% | R$ 394,16 |
| de R$ 3.751,06 até R$ 4.664,68 | 22,5% | R$ 675,49 |
| acima de R$ 4.664,69 | 27,5% | R$ 908,73 |

🔴 **Não ratificar essa tabela ainda.** É o que o líder exibe hoje, não fonte primária, e o próprio app deles carrega um banner "Reforma da Renda: veja o que muda em 2026". Antes de virar código, conferir a tabela vigente na fonte. Vale a regra de sempre: valor + fonte + confiança.

**INSS** — "Calculado a partir do seu pró-labore, contribui para a sua aposentadoria e outros benefícios."

| Linha | Valor |
|---|---|
| Pró-labore ideal | R$ 1.621,00 |
| Alíquota INSS | 11% |
| **Total INSS** | **R$ 178,31** |

E a nota de rodapé que fecha a conta: **"O teto do INSS é de R$ 932,31 por sócio."**

✅ Bate: 11% × R$ 8.475,55 (teto do INSS) = **R$ 932,31**. Ou seja, a contribuição do sócio é `min(11% × pró-labore; 932,31)`.

**Fechamento do DARF:** `Total INSS + Total IRRF = Total`. No caso, 178,31 + 0 = **R$ 178,31**, que é exatamente o valor das três guias vencidas vistas na tela de impostos.

---

### 🔑 O algoritmo do "pró-labore ideal", enfim explícito

Duas definições aparecem na mesma página, e **não são a mesma coisa**:

**(a) O tooltip, versão simples**
> "Percentual de 28% sobre a **média** de faturamento dos últimos 12 meses."

**(b) O box "Cálculo do pró-labore", versão que manda**
> "Nós consideramos o **acúmulo** de faturamento e pró-labore dos últimos 12 meses e lançamos **o menor valor possível** para que a tributação continue a 6% no mês seguinte."

| | Pró-labore dos últimos 12 meses | R$ 16.564,00 |
|---|---|---|
| ÷ | Faturamento dos últimos 12 meses | R$ 43.910,00 |
| = | **Percentual** | **maior ou igual a 28%** |

🔑 **A regra correta é a (b), e a diferença importa.** A (a) olha só o mês; a (b) olha o **acumulado**, que carrega o histórico. Se os meses passados ficaram abaixo, o mês atual precisa **compensar**. A (a) nunca saberia disso.

**Reescrevendo como o nosso motor precisa:**

```
Restrição:  Σ(pró-labore, 12m)  ≥  0,28 × Σ(faturamento, 12m)

pró_labore_do_mês = max(
    piso,                                  // salário mínimo, ou o piso que o sócio definiu
    0,28 × Σ(faturamento 12m) − Σ(pró-labore 11m anteriores)
)
```

É uma **minimização com restrição**, não um "subir quando precisa": lança-se o **menor** valor que ainda satisfaz os 28%, limitado por baixo pelo piso.

**Conferindo com os números reais da conta:**
- 28% × 43.910,00 = **R$ 12.294,80** de folha necessária no acumulado
- Folha acumulada real: **R$ 16.564,00**
- Folga: **R$ 4.269,20**, ou seja, 37,7% contra os 28% exigidos

Com essa folga, o valor ótimo do mês cairia abaixo do salário mínimo (28% da média mensal de R$ 3.659,17 dá R$ 1.024,57). Por isso o pró-labore está **travado no piso de R$ 1.621,00**. E é exatamente o que o gráfico mostra: em Fev-Abr/26, com faturamento perto de R$ 12 mil, o pró-labore subiu pra **R$ 3.360**; quando o faturamento caiu, voltou pro piso.

⚠️ **A escolha de UX mais reveladora da página:** eles mostram `maior ou igual a 28%`, **não** os 37,7% reais. Esconder a folga evita a pergunta óbvia ("se sobra folga, por que ainda pago pró-labore?"), mas também esconde a informação que o dono da empresa mais quer: **quanta margem eu tenho**. É uma decisão de produto, não uma limitação técnica.

---

---

## 9. 🔌 As APIs do pró-labore — varredura retroativa (09/09, 2ª rodada)

> 🔄 **Backfill.** Este foi o **primeiro** teardown da série e rodou **antes** de a leitura de API virar passo do [[_metodo]]. O Pedro pediu a varredura retroativa. Rodada com o rastreio ligado **antes** de navegar, como a regra manda.
>
> 🔒 Só `GET`, mesma origem, sessão do Pedro, endpoints que a própria página chamou. Os payloads trazem CPF e nome: **aqui está a forma e os valores fiscais, nunca o dado pessoal.**

### Os 17 endpoints, em 3 famílias

| Família | Endpoint (`/api/plataforma/…`) |
|---|---|
| **pró-labore** | `prolabore/central/rollout` · `prolabore/central/init` · `prolabore/central/historico/{idSocio}` |
| **informe / lucros** | `informerendimento/v2/{ano}/restricoes` · `informerendimento/carta-responsabilidade/{ano}` · `informerendimento/recuperardadosdistribuicaocliente` · `informerendimento/listSocioInformeRendimentos/{ano}` · `informerendimento/clientedistribuilucro?ano=` |
| **impostos** | `impostos/rollout` · `impostos/v4/impostos-a-pagar/init` · `impostos/v4/impostos-a-pagar/previsao?dados=ESTE_MES` · `…?dados=EM_ATRASO` · **`impostos/como-imposto-foi-calculado/init`** |

---

### 🔑 `impostos/como-imposto-foi-calculado/init` — o motor inteiro num payload

```json
{
  "faturamentoTotal": 7910,
  "nomeMesCompetencia": "Agosto",

  "dasSimples": {
    "impostoBruto": 474.59,
    "deducaoRetencao": 0,              // 🔑 ISS retido DEDUZ do DAS
    "impostoTotal": 474.59,
    "faturamentosPorAliquota": [       // 🔑 ARRAY: várias alíquotas na mesma competência
      { "aliquota": 6, "faturamento": 7910, "imposto": 474.59 }
    ],
    "inconsistente": false             // 🔑 flag de inconsistência do cálculo
  },

  "darf": {
    "inss": { "prolabore": 1621, "aliquota": 11, "totalImposto": 178.31, "teto": 932.31 },
    "irrf": {
      "prolaboreMaximoIsencaoIRRF": 2428.8,
      "prolabore": 1621,
      "deducaoSimplificada": false,    // 🔑 desconto simplificado × deduções legais
      "valorDeducao": null, "baseCalculoIrrf": null, "aliquota": null,
      "subTotal": null, "deducaoIrrf": null, "totalImposto": null
    },
    "total": 178.31
  },

  "valorProlaboreUltimos12Meses": 16564,
  "valorFaturamentoUltimos12Meses": 43910,
  "percentualFatorR": 37.72,           // 🔴 O NÚMERO REAL VAI NO PAYLOAD
  "ultimaCompetenciaSemFaturamento": false,
  "teveAumentoProlabore": false,
  "historicoFaturamento": [ { "mes": "ago./26", "valorProlabore": 1621, "valorFaturamento": 7910 }, … 12 meses ]
}
```

### 🔴 Confirmação definitiva: eles escondem o Fator R na renderização, não no dado

A tela mostra **`maior ou igual a 28%`**. O payload traz **`percentualFatorR: 37.72`**.

🔑 **O dado exato viaja até o navegador e é descartado na hora de desenhar.** Não é limitação de cálculo nem de arquitetura: é **decisão de produto**, tomada depois de o número já estar na mão. Isso encerra a dúvida que ficou registrada em [[2026-09-09-contabilizei-aliquotas]] e sustenta a nossa escolha oposta (mostrar a folga).

### ✅ O mistério do centavo, resolvido

Refazendo as contas com os números do payload:

```
Fator R:  16.564 ÷ 43.910 = 37,72%          ✓ idêntico ao campo `percentualFatorR`
DAS:      474,59 ÷ 7.910  = 5,99987%        ← a alíquota EFETIVA real
          7.910 × 6%      = 474,60          ← o que daria com a exibida
```

🔑 **A alíquota real não é 6%: é 5,99987%.** A tela mostra `6,00%` porque é o `aliquotaApresentacao` (campo que a evidência da [[2026-09-09-contabilizei-nota-fiscal|NF]] mostrou existir separado do `aliquotaBase`). **O centavo não é bug de arredondamento: é a alíquota exibida sendo diferente da calculada.**

🕓 **Por que 5,99987% e não 6%?** Hipótese, **não conclusão**: a empresa é de início recente (histórico com meses zerados), e o Simples manda **proporcionalizar o RBT12** nos 12 primeiros meses (LC 123 art. 18 §2º). Isso mudaria a base e explicaria a fração. **Não deduzir** — vale a regra de sempre: confirmar antes de virar código.

⚠️ **A lição de produto vale mesmo sem a explicação:** eles **exibem uma alíquota e cobram por outra**, com diferença de centavos. A nossa regra precisa ser: **ou mostra a efetiva com as casas que importam, ou mostra a arredondada e o valor bate com ela.** As duas coisas ao mesmo tempo é o que gera a ligação do cliente.

### Três campos que revelam casos que a gente não tinha mapeado

| Campo | O que é |
|---|---|
| **`deducaoRetencao`** | ISS retido na fonte **abate do DAS**. Liga direto com o `valorPendenteRetencao` por cliente visto na [[2026-09-09-contabilizei-nota-fiscal|NF]] |
| **`faturamentosPorAliquota[]`** | é **array**: a mesma competência pode ter faturamento em alíquotas diferentes (várias atividades, ou interno + externo). Nosso modelo precisa nascer assim |
| **`deducaoSimplificada`** | no IRRF, o **desconto simplificado** como alternativa às deduções legais. Não estava no nosso radar |

---

### 🔑 `prolabore/central/init` — a configuração, e o que ela esconde

```ts
{
  tipoGerenciamento: "INTELIGENTE",     // o modo escolhido
  elegivelNoMotor: boolean,             // 🔑 nem toda empresa pode usar o motor
  socios: [{
    id, cpf, nome,
    possuiProlabore, responsavelReceita, admin,
    valorProlabore, dataUltimaAtualizacao,
    exibirInsightIrrf: boolean,         // insight de IRRF é condicional
    possuiDuploVinculo, indicativoDuploVinculo, cnpjDuploVinculo,
    nomesDependentes,
    insightGestao: "INTELIGENTE",
    fluxoAssessorPendente: boolean,     // 🔑 existe FLUXO DE ASSESSOR
    fluxoAssessorFinalizado: boolean
  }],
  qtdSocioGestaoInteligente: number,
  totalProLabore: number,
  prolaboreIndisponivel: boolean,
  valorMaximoInss: 932.3105,            // 🔑 4 casas, a tela mostra 932,31
  baseCalculoIrrf: 5000,
  zerarProlabore: boolean,              // o toggle "meses sem faturamento"
  deveExibirAlertaDividendos: boolean,  // 🔑 alerta de dividendos
  valorProlaboreMinimo: number | null   // o piso do sócio
}
```

**O que isso entrega que a tela não entregava:**

| | Achado |
|:--:|---|
| 🔑 | **`elegivelNoMotor`**: a Gestão Inteligente **não é para todos**. Existe critério de elegibilidade que a tela nunca menciona |
| 🔑 | **`fluxoAssessorPendente` / `fluxoAssessorFinalizado`**: há **gente no meio do caminho**. O pró-labore não é 100% automático como a copy sugere |
| ⚠️ | **`valorMaximoInss: 932.3105`** com 4 casas, exibido como `932,31`. **Mesmo padrão do centavo:** o dado tem mais precisão que a tela |
| 🔑 | **`deveExibirAlertaDividendos`**: existe alerta de dividendos que não apareceu nesta conta |
| 🔑 | **`zerarProlabore`** e **`valorProlaboreMinimo`** são campos de primeira classe, não preferência escondida |

`prolabore/central/rollout` → `{ centralSocio: true }`. Feature flag por empresa, como no emissor.

`prolabore/central/historico/{idSocio}` → `[{ competencia, nome, prolabore, descontos }]`, tudo `string` (já formatado no servidor).

---

### 🔴 `informerendimento/v2/{ano}/restricoes` — o informe é BLOQUEÁVEL

```ts
{
  restricoes: {
    pendenciaDocumental: {
      possuiPendencia: boolean,
      fluxoRegularizacao: string,
      valorServicoAdicional: number | null,   // 🔴 regularizar é SERVIÇO PAGO
      pendencias: []
    },
    debitosFederais: {
      possuiPendencia: boolean,
      divergenciaContabilFiscal: boolean,     // 🔑 campo próprio
      debitos: []
    }
  },
  processoReabertura: { status: string }
}
```

🔴 **O informe de rendimentos não sai se houver pendência documental ou débito federal.** E `valorServicoAdicional` mostra que a regularização é **monetizada**, no mesmo padrão do Termo de Exclusão (que cobra R$95 na mensalidade).

⚠️ **Isso é uma dependência que a gente não tinha mapeado:** o documento que o sócio precisa para o IRPF depende de a contabilidade estar em dia. **Trava de fim de ano, com efeito em abril.**

### 🔑 `informerendimento/recuperardadosdistribuicaocliente` — distribuição de lucros

```ts
{
  ano, saldo, totalDistribuido,
  totalAdiantamentos: number,        // 🔑 ADIANTAMENTO de lucros
  exercicioFechado: boolean,
  lucrosSocios: [{ id, socio, valor }],
  habilitaTelaCliente: boolean,
  podeAlterar: boolean,
  motivoNaoPodeAlterar: string | null,   // 🔑 diz POR QUE não pode
  dataLimite: string,                    // 🔑 prazo para alterar
  perfil: string,
  fechadoRestritivo: boolean,
  exibirAviso: boolean
}
```

🔑 **`totalAdiantamentos` é campo próprio.** Adiantamento de lucros (antes do exercício fechar) é caso real e tem tratamento separado do distribuído.

🎯 **`motivoNaoPodeAlterar`**: quando bloqueia, o servidor manda **o motivo**, não só o `false`. É o oposto do botão cinza sem explicação, e vale copiar.

---

### 📦 O que este backfill acrescenta ao nosso contrato de dados

```ts
type CalculoCompetencia = {
  faturamentoTotal: number
  nomeMesCompetencia: string
  dasSimples: {
    impostoBruto: number
    deducaoRetencao: number              // ISS retido abate
    impostoTotal: number
    faturamentosPorAliquota: [{ aliquota, faturamento, imposto }]   // ARRAY
    inconsistente: boolean
  }
  darf: {
    inss: { prolabore, aliquota, totalImposto, teto }
    irrf: { prolaboreMaximoIsencaoIRRF, prolabore, deducaoSimplificada,
            valorDeducao, baseCalculoIrrf, aliquota, subTotal, deducaoIrrf, totalImposto }
    total: number
  }
  valorProlaboreUltimos12Meses: number
  valorFaturamentoUltimos12Meses: number
  percentualFatorR: number               // 🔴 nós MOSTRAMOS
  ultimaCompetenciaSemFaturamento: boolean
  teveAumentoProlabore: boolean
  historicoFaturamento: [{ mes, valorProlabore, valorFaturamento }]  // 12 meses
}
```

🎯 **Este é o payload de uma tela só ("por que pago isso"), e ele já tem tudo:** os dois impostos, as duas bases, o Fator R, o histórico de 12 meses e as flags de exceção. **É o formato que a nossa tela A2 precisa.**

---

## ➡️ O que fazemos com isso

Esta nota **para aqui de propósito**. Ela registra o que foi visto, e nada do que a gente decidiu.

O desenho da nossa funcionalidade, o que copiamos, o que fazemos diferente e as fórmulas que viram teste unitário estão em **[[pro-labore]]**.

## Links
[[pro-labore]] · [[HOME-produto]] · [[_metodo]] · [[_matriz-dependencia]] · [[2026-07-21-dossie-plataforma-logada]] · [[2026-09-09-verificacao-auditoria-tributaria]]

