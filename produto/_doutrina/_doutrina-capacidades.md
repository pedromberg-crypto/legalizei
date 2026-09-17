---
tipo: verdade
status: vivo
data: 2026-09-11
assunto: doutrina-capacidades
autoridade: fonte-verdade
tags: [produto, capacidades, trava, doutrina, portal]
---

# 🧩 Doutrina das CAPACIDADES — como a gente não perde funcionalidade ao redesenhar

> **O problema que isto resolve**, na frase do Pedro em 11/09: *"tenho medo da gente perder funcionalidades nas novas telas, sendo que as que já criamos estão muito boas."*
>
> 🔴 **Congelar cópia não resolve.** Uma cópia só serve pra comparar DEPOIS que o estrago aconteceu, e ainda exige que alguém lembre de comparar. Além disso, o projeto já pagou por esse caminho: o fork do ramo MEI (07/09) custou **4 defeitos em 8 dias**, e virou regra que *réplica de tela se porta, não se remonta*.
>
> **O que resolve é declarar e verificar.** A tela diz o que faz; um script confere se ainda faz.

---

## 1. O que é uma CAPACIDADE

**Régua dura:** capacidade é **toda ação que a pessoa pode fazer** e **todo dado que decide alguma coisa**.

| É capacidade | NÃO é capacidade |
|---|---|
| "Baixar guia" | um card cinza |
| "Copiar código de barras" | o título da seção |
| "Cancelar plano" | um ícone decorativo |
| "Ver o valor do DAS do mês" | o espaçamento entre linhas |
| "Trocar a forma de pagamento" | a animação de entrada |
| "Ver por que o Fator R mudou" | a cor do badge |

**Por que a régua precisa ser dura:** sem ela, duas pessoas marcam coisas diferentes e o inventário vira ruído. Um inventário que ninguém confia é pior que nenhum, porque dá falsa segurança.

⚠️ **Caso de fronteira que eu já sei que vai aparecer:** texto que É a funcionalidade. "Você está em dia ✓" não tem botão, mas é o produto inteiro daquela tela. **Conta como capacidade.** A pergunta certa não é *"tem clique?"*, é *"se isso sumir, o cliente perde alguma coisa?"*.

---

## 2. Como se nomeia

```
area.acao
```

Minúsculo, kebab-case, **prefixo pela ÁREA e não pela rota**.

```
impostos.baixar-guia
impostos.copiar-codigo
plano.cancelar
plano.trocar-pagamento
notas.emitir
```

🔑 **Prefixo por área, não por rota, de propósito:** mover a tela de lugar não pode renomear a capacidade. Se fosse `mais-plano.cancelar`, o dia em que `/mais/plano` virar `/plano` renomearia tudo e o histórico se perderia.

**Áreas válidas** (as abas + transversais, mesma gramática de `portal-data.mjs`):
`inicio` · `impostos` · `notas` · `emitir` · `mais` · `plano` · `prolabore` · `folha` · `documentos` · `perfil` · `avisos`

---

## 3. Onde mora

**Duas pontas, e as duas obrigatórias:**

**① No JSX**, como atributo `data-cap`:

```tsx
<button data-cap="plano.cancelar">Cancelar plano</button>
```

`data-cap` **não é classe nem texto**. É isso que faz o mecanismo aguentar redesenho: você troca cor, layout, copy, componente e biblioteca, e o marcador vai junto do elemento. Se o elemento sumir, o marcador some com ele, e é exatamente aí que o script grita.

**② Em `execucao/portal/portal-data.mjs`**, no nó da tela:

```js
{ id: "P_PLANO", rota: "/mais/plano", ...,
  caps: ["plano.ver-fatura", "plano.trocar-pagamento", "plano.historico", "plano.cancelar"],
  cobre: ["7.1", "7.2", "7.3", "7.4", "8.8"] }
```

🔑 **`portal-data.mjs` é a casa, e não um arquivo novo.** Ele já existe, já tem as rotas, já é irmão do `flow-data.mjs` e o `gerar-mapa-portal.mjs` **já confere drift contra as rotas reais** (achou `/mais/colaborador` faltando ao rodar em 11/09). Criar um segundo inventário seria repetir a doença que a pasta `produto/` nasceu pra curar: o mesmo objeto espalhado em dois lugares que divergem.

---

## 4. O campo `cobre` — o que ele compra

Cada capacidade se liga ao item do painel das 51 funcionalidades ([[HOME-produto]] §Painel).

Com isso, **o placar de cobertura deixa de ser escrito à mão e passa a ser calculado**. Isso não é preciosismo: o painel manual já estava errado em dois pontos quando foi cruzado em 11/09 (a 2.2 creditava a tela errada, a 8.1 dizia "—" para uma tela que existe desde 04/08) e cego para duas telas inteiras (`/mais/relatorios`, `/mais/servicos`).

---

## 5. O verificador

`execucao/portal/verificar-capacidades.mjs`, rodando junto do `gerar-mapa-portal.mjs`. Três saídas:

| | O que significa | Gravidade |
|---|---|---|
| 🔴 **SUMIU** | declarada no `portal-data` e não está mais no JSX | **regressão** — é o medo do Pedro, e é o motivo de tudo isto existir |
| 🟡 **NÃO DECLARADA** | está no JSX e ninguém registrou | capacidade órfã: não tem % e não entra no placar |
| ⚪ **SEM TELA** | declarada e a rota não existe | o buraco conhecido (o §8 inteiro hoje) |

---

## 6. As regras que fazem isso sobreviver

1. 🔴 **Capacidade nova nasce declarada, no mesmo commit.** Sem isto o inventário envelhece igual o `portal-data.mjs` envelheceu (parado de 03/08 a 11/09) e igual o vocabulário do vault, que ficou **cego em 79%** sem ninguém notar.
2. 🔴 **Remover capacidade é DECISÃO, não limpeza.** Some do `portal-data` só junto de uma linha no ADR dizendo por quê. O script não distingue "tiramos de propósito" de "esquecemos" — quem distingue é o registro.
3. 🟡 **Redesenho não começa sem rodar o verificador antes e depois.** O "antes" é a fotografia; o "depois" é a prova.

---

## 7. 🔻 De onde se olha (precedência, travada 11/09)

**Quem guia esta rodada é a pesquisa de setembro**, que é incomparavelmente mais robusta que a primeira: o painel de 51 funcionalidades em [[HOME-produto]], os teardowns com **API, endpoint e modelo de dados** em `produto/me/_evidencias/`, e o contrato literal do líder.

🔻 **O que NÃO pesa:** os quatro documentos de **22 a 23/07** do `execucao/portal/` (matriz, cruzamento, candidatos de home, backlog). Eles são da primeira leva de comparação, a que gerou as telas. **Continuam no vault porque explicam por que cada tela nasceu como nasceu, e isso não está em nenhum outro lugar.** Mas não decidem o que construir agora.

🔴 **E uma regra de método que vale mais que as duas acima:** o inventário nasce **da nossa tela pra fora**, não da lista do líder pra dentro.

Abrir uma tela perguntando *"o que o líder tem aqui?"* é como o painel foi montado, e foi por isso que `/mais/relatorios` e `/mais/servicos` ficaram **invisíveis por um mês e meio**: as duas são tese nossa, o líder não tem equivalente claro, e um inventário feito pela lista dele não as enxerga. Duas das nossas melhores telas escaparam por serem originais.

A pergunta certa ao abrir uma tela é **"o que ela deixa a pessoa fazer?"**. O amarre com o item do painel vem **depois**, e capacidade que não amarra em item nenhum não é erro: é diferencial, e vira item novo.

## 8. ⚠️ O que isto NÃO protege

**Capacidade, não qualidade.** O script garante que o botão "Cancelar plano" ainda existe. Não garante que ele continua bom, nem que está no lugar certo, nem que a copy melhorou.

É a mesma fronteira da trava de anatomia do MEI, que pega **estrutura** e não pega espaçamento, cor nem copy: isso segue sendo olho humano no print. Quem sabe se a tela ficou melhor é o Pedro.

## Links
- [[HOME-produto]] — o painel das 51 funcionalidades, que é o alvo do campo `cobre`
- [[_catalogo]] — quais funcionalidades existem e o balde de monetização
- [[legalize-replica-de-tela-se-porta]] — por que cópia de tela não é a resposta
