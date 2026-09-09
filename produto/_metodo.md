---
tipo: verdade
status: vivo
dominio: metodo
data: 2026-09-09
assunto: metodo-teardown-funcionalidade
autoridade: fonte-verdade
tags: [produto, metodo, teardown, concorrente]
---

# 🔬 Método — como se destrincha uma funcionalidade

> Nasceu do teardown de pró-labore (09/09/2026), o primeiro feito funcionalidade a funcionalidade. Ele rendeu mais em uma sessão do que semanas de leitura de fora, e o motivo foi o método, não a sorte. Está escrito aqui pra repetir.
> Hub: [[HOME-produto]].

---

## 🔒 A regra de navegação na conta do Pedro

O Pedro é cliente pagante da Contabilizei (plano Padrão). A conta é dele, o acesso é legítimo, e mesmo assim:

| | Regra |
|:--:|---|
| ✅ | **Ler, abrir, expandir, filtrar.** Trocar competência, selecionar sócio, abrir modal, passar o mouse pra ler tooltip |
| ✅ | **Selecionar um rádio ou aba** só pra revelar conteúdo condicional, e **sair sem confirmar** |
| ❌ | **Nunca** clicar em salvar, confirmar, enviar, cancelar, recalcular ou pagar |
| ❌ | **Nunca** preencher campo com dado real |
| ❌ | **Nunca** disparar nada que gere cobrança, protocolo ou registro no lado deles |

⚠️ **A conta é de produção.** Um clique errado não é bug de laboratório, é uma guia recalculada ou um pró-labore alterado de verdade, com efeito fiscal. Na dúvida entre entender melhor e não tocar, **não tocar**.

📌 Registrar no cabeçalho de toda evidência **o que foi tocado**. A nota de pró-labore diz, textualmente, que um rádio foi selecionado e a tela abandonada sem confirmar. Isso não é burocracia: é o que permite conferir depois se algum valor mudou por nossa causa.

---

## 🧭 Os 8 passos

### 1. Escolher pelo que destrava, não pelo que é fácil
Pró-labore veio primeiro porque cruza Fator R, INSS, eSocial e IRPF. Desenhar ele destravou o cálculo de imposto, o calendário e o informe anual de uma vez. **Pergunta certa:** quantas outras funcionalidades esta aqui responde?

### 2. Varrer o caminho inteiro, não a tela principal
No pró-labore, o que mais rendeu **não estava na tela do pró-labore**: estava em `Impostos a pagar` (onde ele vira dinheiro) e numa página **sem entrada no menu**, alcançável só por um link de rodapé, que continha a matemática inteira.

🔑 **Regra:** seguir a funcionalidade até onde ela vira **guia, documento ou obrigação**. É lá que a conta aparece.

### 3. Ler o DOM, não só a tela
`get_page_text` devolve **os modais que ainda não abriram**. No pró-labore, foi assim que saíram, de uma vez, o algoritmo da otimização, a política multi-sócio, o anti-nudge e a trava de saída. Nenhum deles estava visível.

**Vale sempre:** rodar `get_page_text` numa tela de configuração antes de clicar em qualquer coisa.

### 4. 🔌 Ler a API que alimenta a tela, não só a tela

🆕 **Travado em 09/09**, depois que um `<select>` nativo não respondeu ao teclado via CDP. Em vez de insistir no clique, fui ver de onde o campo vinha, e **rendeu muito mais**.

**Como fazer:** `read_network_requests` na rota, achar o endpoint, e dar um `GET` de mesma origem na sessão do próprio Pedro. Só leitura, devolvendo o dado que a página já exibia.

O que a tela **não** mostrava e a API mostrou:
- `anexo: 5` → a empresa é **Anexo V por padrão** e sobe pro III. A tela só dizia "Variável"
- `motorFatorR: true` e `deveExibirVersaoReformaRenda: true` → **feature flags por empresa**, inclusive uma versão já pronta pra Reforma da Renda
- `codigoServicoItemServico` → um **terceiro nível de código** (o do município) que a tela nunca exibe
- o campo se chama **`fatorR`** literalmente, o que prova que esconder o jargão foi escolha de UX, não desconhecimento

🔑 **A regra:** quando o clique travar, **não insista** — vá pela API. E mesmo quando o clique funcionar, a API costuma entregar o **contrato de dados**, que é o que o dev precisa e a tela nunca mostra.

⚠️ **Limite:** só `GET` de leitura, na sessão do Pedro, de endpoint que a própria página já chamou. Nunca `POST`, `PUT` ou `DELETE`. Nunca endpoint que a tela não usou.

### 5. Conferir a aritmética, sempre
Não aceitar o número: refazer a conta.

Foi o que transformou observação em achado:
- R$ 178,31 ÷ R$ 1.621,00 = 11% → **o "DARF Unificado" é a guia do INSS do pró-labore**
- 11% × R$ 8.475,55 = R$ 932,31 → confirma o teto que a nota de rodapé afirma
- 7.910,00 × 6% = 474,60, mas a tela mostra **474,59** → divergência de um centavo que vira regra de arredondamento nossa
- 16.564 ÷ 43.910 = 37,7%, e a tela só diz "maior ou igual a 28%" → **eles escondem a folga de propósito**

### 6. Separar o que é dado do que é decisão
Toda tela mistura três coisas, e elas têm validades diferentes:

| | O que é | Envelhece |
|---|---|---|
| **Fato de lei** (teto do INSS, faixa do IRRF, prazo) | precisa de fonte primária, não do concorrente | quando a lei muda |
| **Escolha de produto** (esconder a folga, botão assimétrico) | é onde a gente pode ser melhor | quando eles mudam |
| **Bug deles** | serve de alerta, não de referência | quando corrigem |

🔴 **Nunca ratificar dado fiscal pela tela do concorrente.** A tabela do IRRF que eles exibem foi anotada como **não ratificada**, justamente porque o app deles carrega um banner de reforma tributária. Vale a regra de sempre: valor + fonte + confiança.

### 7. 🔗 Declarar os cruzamentos, sempre

🔒 **Regra dura, travada em 09/09 a pedido do Pedro.** Nenhuma funcionalidade fiscal se documenta sozinha. Toda spec em `produto/funcionalidades/` abre com uma seção **Cruzamentos declarados**, com quatro linhas:

| | O que declarar |
|---|---|
| **⬅️ Recebe de** | que dado de outra funcionalidade entra no cálculo |
| **➡️ Manda em** | que outra funcionalidade muda quando esta muda |
| **📅 Obrigação que dispara** | guia, declaração, prazo |
| **👁️ O cliente precisa ver** | o resultado, não o mecanismo |

**Por que virou regra:** pró-labore e alíquota foram destrinchados separadamente e chegaram **no mesmo número (37,72%) por caminhos diferentes** — um pela divisão folha ÷ faturamento, o outro por uma coluna chamada "Folha". Ninguém tinha notado, e o líder também não conecta as duas telas. O mapa completo da cadeia vive em [[_mapa-de-cruzamentos]].

⚠️ **O teste:** se der pra escrever a spec sem citar nenhuma outra funcionalidade, ou ela é isolada de verdade (raro), ou o cruzamento passou batido.

### 8. Fechar com desenho, não com resumo
Toda evidência termina virando **spec nossa**, com três blocos obrigatórios:

- **o que a gente copia sem vergonha** (e por quê)
- **o que a gente faz diferente** (e por quê, um a um)
- **as fórmulas que já viram teste unitário**

Sem isso, o teardown é curiosidade. Com isso, é backlog.

---

## 📁 Onde cada coisa cai

```
produto/evidencias/AAAA-MM-DD-<fonte>-<tema>.md    ← o que foi observado, com data
produto/funcionalidades/<tema>.md                   ← o nosso desenho, vivo
```

A evidência **linka** a spec e a spec **linka** a evidência. Quando a evidência envelhecer, a spec continua de pé.

### Frontmatter (o que a `.base` lê)

🔒 **`tipo` e `status` são vocabulário FECHADO** do [[indice-autoridade]] (6 tipos, 5 status). Não inventar valor novo neles. `dominio` e os campos abaixo são **propriedades**, e essas sim podem crescer.

⚠️ Registrado em 09/09: na primeira versão desta pasta eu inventei quatro `tipo` fora do vocabulário (`spec`, `funcionalidade`, `evidencia`, `metodo`) e tive que corrigir. O vault inteiro já derivou pra 34 tipos onde deviam ser 6. **Não piorar.**

**Spec de funcionalidade:**
```yaml
tipo: verdade                        # fechado
status: vivo                         # fechado
dominio: funcionalidade              # é isto que a .base filtra
cobertura: construida | parcial | nao-existe | nao-faremos
balde: core | vendavel | backlog | rejeitado
dependencia: interna | externa
confianca: alta | media | baixa      # do caminho TÉCNICO, não do desenho
bloqueio: <o que trava, ou vazio>
```

**Evidência:**
```yaml
tipo: fato                           # "dado externo, datado" — encaixa exato
status: vivo
dominio: evidencia
fonte: Contabilizei
acesso: cliente-interno
```

---

## Links
[[HOME-produto]] · [[_catalogo]] · [[_matriz-dependencia]] · [[indice-autoridade]] · [[pro-labore]] · [[2026-09-09-contabilizei-pro-labore]]
