---
tipo: analise-custo
status: gerado
data: 2026-09-20
assunto: hermes-v2-sidecar
rodadas: 8
tags: [sidecar, custo, e2e, otimizacao, roi]
---

# Evolução de custo · 8 rodadas de E2E · 2026-09-20

Todas no mesmo dia, mesma suíte (`curta`, 20 casos), mesmo modelo
(`gemini-3.1-flash-lite`), câmbio 5,1442. Os números saem dos próprios
relatórios de rodada, não de anotação à parte.

## A tabela

| # | rodada | placar | RAG (cartão+nota) | tokens entrada | tokens saída | custo R$ | Δ custo |
|---|---|---|---|---|---|---|---|
| 1 | `2314` | 14/20 | **0** (0+0) | 308.920 | 5.292 | 0,4381 | base |
| 2 | `2324` | 15/20 | 12 (0+12) | 404.790 | 5.672 | 0,5643 | **+28,8%** |
| 3 | `2330` | **16/20** | 12 (0+12) | 434.749 | 5.745 | 0,6034 | +6,9% |
| 4 | `2332` | 14/20 | 12 (0+12) | 433.442 | 5.975 | 0,6035 | +0,02% |
| 5 | `2338` | **16/20** | **28** (12+16) | 524.747 | 6.129 | 0,7221 | +19,7% |
| 6 | `2345` | 14/20 | 13 (9+4) | 510.972 | 5.764 | 0,7016 | −2,8% |
| 7 | `2348` | **16/20** | 19 (15+4) | 549.841 | 6.229 | 0,7552 | +7,6% |
| 8 | `21-0004` | **17/20** | 22 (14+8) | 507.735 | 5.898 | **0,1485** | 🟢 **−80,3%** |

**Acumulado até a #7:** custo **+72,4%** · entrada **+78,0%** · placar 14 → 16.
**Com a #8 (otimizada):** custo **−66,1%** contra a #1, com o melhor placar da
série. O detalhe da #8 está no §5.

O que cada salto foi:

* **#2 (+28,8%)** nasceu a tool `buscar_base` e o `consultar_escopo` passou a
  devolver os tetos. Duas consultas a mais por caso.
* **#5 (+19,7%)** o extreme makeover da `buscar_cartao`: ela saiu de 0 para 12.
* **#3, #4, #7** são crescimento de prompt, não de comportamento: cada regra
  nova no `RULES.md` engorda TODA chamada.

---

## 1. O aumento de tokens comprou placar? Não.

**14 → 16 é +2 pontos, e a banda de ruído declarada desta suíte é 3.** Em sete
rodadas o placar foi 14, 15, 16, 14, 16, 14, 16: ele oscila sem correlação com o
custo. A #4 custou 37,7% mais que a #1 e fez o MESMO placar. A #6 custou menos
que a #5 e fez menos ponto. Não há sinal.

🔴 **Concluir ROI pelo placar aqui seria erro de leitura**, e é o erro que o
próprio relatório de rodada abre avisando.

### O que o aumento comprou de verdade, e isso não é ruído

| métrica | #1 | #7 |
|---|---|---|
| turnos sem lastro técnico | 18 | **8** |
| chamadas de RAG | 0 | **19** |
| falhas de provedor | 8 | **0** |

E três defeitos nomeados que sumiram: o teto citado da lei em vez do nosso, o
link reescrito de memória, e a afirmação de que uma profissão não pode ser MEI.

**A leitura honesta: pagamos 72% a mais por um agente que passou a consultar em
vez de responder de cabeça.** Isso é a compra. O placar não mede isso porque as
checagens são de forma, não de fundamento, e foi por isso que dois dos três
defeitos acima só apareceram na leitura da resposta inteira.

---

## 2. Onde o custo está, medido

Prompt de sistema por trilha, incluindo o schema das tools que vai em toda
chamada:

| trilha | sistema | + tools | total | ≈ tokens |
|---|---|---|---|---|
| escalonamento | 21.108 | 6.538 | 27.646 | 7.378 |
| fora_escopo | 21.669 | 6.538 | 28.207 | 7.528 |
| técnico | 24.766 | 6.538 | 31.304 | **8.354** |
| comercial | 33.349 | 6.538 | 39.887 | **10.645** |

🔑 **A conta que fecha o diagnóstico:** a rodada #7 fez 85 chamadas. Vinte são do
classificador, que não carrega nenhum dos dois documentos. As outras 65, a
~8.500 tokens de sistema cada, dão **552 mil**, contra 549.841 medidos.

**Praticamente todo o input é o prompt de sistema, reenviado inteiro a cada
chamada.** Histórico e payload de tool são o resto. É a mesma lei que o pacote
antigo já tinha medido, com outra roupa: o piso é quase tudo.

Payload de tool, para comparar a ordem de grandeza:

| tool | tokens devolvidos |
|---|---|
| `buscar_base` (4 trechos) | 1.319 |
| `consultar_escopo` | 1.014 |
| `buscar_cartao` (3 cartões) | 373 |
| `consultar_cnae` | 333 |

---

## 3. Plano de ação, na ordem do que realmente paga

### 🥇 a) Context caching · redução estimada de **~75% do custo de entrada**

Suportado: o SDK expõe `ai.caches` (create, get, update, delete) e o
`usageMetadata` já traz `cachedContentTokenCount`.

A aritmética: token em cache custa **0,025 por milhão** contra **0,25** de
entrada normal, ou seja **um décimo**. O prompt de sistema é estável por trilha
e responde por ~93% do input, então cachear só ele levaria a rodada de
**US$ 0,1375 para ~US$ 0,032**.

🔑 **E o ganho cresce com o uso, ao contrário dos outros dois.** Prompt de
sistema idêntico entre casos e entre conversas é exatamente o caso de uso do
cache: em produção, com milhares de conversas contra os mesmos dois documentos,
essa é a única otimização cuja economia escala.

⚠️ **O que precisa ser verificado antes de prometer o número:** o mínimo de
tokens para criar cache explícito, e o **preço de armazenamento por hora**, que
não existe com fonte neste repo. Cache barato de ler e caro de guardar pode
inverter a conta num volume baixo. Medir com o `cachedContentTokenCount`, que já
vem na resposta, antes de decidir.

### 🥈 b) Prompt pruning · redução estimada de **10% a 20%**

Dois alvos, e eles não são iguais.

**O schema das tools (1.745 tokens em toda chamada) é o alvo mais seguro.** Hoje
as oito tools vão em todas as trilhas. A trilha `fora_escopo` precisa de três
(`consultar_escopo`, `consultar_links`, `buscar_base`) e carrega oito. Filtrar o
conjunto por trilha corta ~60% desse bloco onde ele não serve, **sem tocar em
uma linha de conteúdo**.

**A trilha comercial (10.645 tokens) carrega os dois arquivos inteiros**, e é a
mais cara. Ela pode perder do `RULES.md` as seções que não decidem venda.

🔴 **O que eu NÃO cortaria:** o `Banco de falas` (3.046 chars, a maior seção do
PERSONA). É few-shot, e few-shot é o que sustenta modelo pequeno. Cortá-lo
economiza ~800 tokens por chamada e ataca justamente a aderência, que é o único
defeito de qualidade medido neste agente. Economia ali é a mais tentadora e a
mais cara.

### 🥉 c) Menos chunks no RAG · redução estimada de **menos de 1%**

Contra a intuição, este é o menor dos três. `buscar_cartao` devolve 3 cartões e
custa **373 tokens**; com 15 recuperações na rodada, são ~1.900 tokens de
549.841, ou **0,35%**. Cair para 2 cartões economizaria ~0,1%.

O `buscar_base` é quatro vezes mais gordo (1.319 tokens por chamada, porque
trecho de nota é texto corrido). Baixar de 4 para 2 trechos economizaria ~0,5% e
**aumentaria o risco de não trazer o trecho certo**, que é o que acabou de
corrigir os links e os tetos.

⚠️ **Mexer aqui é trocar fundamento por centavos.** Só vale se a medição mostrar
que o 3º e o 4º trecho nunca são usados, e essa medição não existe: o relatório
registra quais IDs voltaram, não quais entraram na resposta.

---

## 4. Recomendação

1. **Instrumentar antes de otimizar.** Ligar a leitura de
   `cachedContentTokenCount` no contador e rodar uma vez. O Gemini faz cache
   implícito de prefixo, então parte do ganho pode já estar acontecendo sem
   ninguém ter medido, e otimizar sobre número não medido é chute caro.
2. **Filtrar o schema de tools por trilha.** É barato, é seguro, não toca em
   conteúdo e vale mais que o item (c) inteiro.
3. **Cache explícito do prompt de sistema**, depois de conferir mínimo e preço
   de armazenamento.
4. **Não mexer nos chunks nem no banco de falas** enquanto o defeito aberto for
   aderência.

🔴 **E o de sempre: nada disso se mede pelo placar.** Otimização de custo tem que
sair com o mesmo comportamento, e comportamento aqui se lê em turnos sem lastro,
chamadas de RAG e resposta inteira, não em pontuação que oscila 3 pontos sozinha.

---

## 5. A otimização aplicada · rodada `21-0004`

As recomendações (a) e (b) do §3 foram implementadas e medidas na mesma suíte.

| | antes (`2348`) | depois (`21-0004`) |
|---|---|---|
| tokens de entrada | 549.841 | 507.735 |
| **dos quais em cache** | 0 | **475.176 (93,6%)** |
| custo da rodada | R$ 0,7552 | **R$ 0,1485** |
| custo por caso | R$ 0,0378 | **R$ 0,0074** |
| placar | 16/20 | **17/20** |
| falhas de provedor | 0 | 0 |

**Redução de 80,3% no custo**, com o melhor placar da série.

### O número que vale mais que o total: 93,6% de acerto

A previsão do §3 era "~93% do input é cacheável". O medido foi **93,6%**. Não é
sorte: é a mesma conta de que o prompt de sistema é quase todo o input, agora
confirmada pelo próprio provedor em vez de estimada por nós.

🔑 **E o contrafactual está no relatório, não na cabeça de ninguém.** O contador
calcula o que a MESMA rodada custaria sem cache (US$ 0,1358) e imprime a
diferença. Economia declarada sem contrafactual é sempre suspeita, porque
qualquer rodada mais barata pode ser só uma rodada menor.

### 🔴 A conta que erra fácil, e que o código evita de propósito

`cachedContentTokenCount` é **subconjunto** de `promptTokenCount`, não uma
parcela a somar. Cobrar os dois separadamente e somar conta o token cacheado
duas vezes, uma a preço cheio e outra a preço de cache, e infla a fatura em até
10%. O preço cheio incide sobre a **diferença**, e isso está escrito na função.

### O que cada medida contribuiu

**O cache é praticamente toda a economia.** O filtro de tools por trilha cortou
~42 mil tokens de entrada (7,7%), e num mundo sem cache isso valeria ~R$ 0,05.
Com cache, a maior parte desses tokens custaria um décimo de qualquer jeito.

⚠️ **O filtro continua valendo**, por dois motivos que não são custo: a trilha de
escalonamento deixou de receber a calculadora de imposto, numa trilha cuja regra
dura é "você para de resolver", e menos tool no prompt é menos chance de o modelo
chamar a errada.

### O que não foi feito, e por quê

**(c) reduzir chunks do RAG: descartado.** A análise já apontava menos de 1%, e
com cache a conta piora ainda mais: o payload de tool é justamente a parte que
NÃO se cacheia, mas ele é pequeno. Trocar fundamento por centavos ficou pior
depois da otimização, não melhor.

### ⚠️ O que ainda não está medido

**O custo de armazenamento do cache por hora.** Não existe com fonte no repo, e
ele não aparece no `usageMetadata`. Para uma rodada de teste de 4 minutos com
TTL de 15, é desprezível. **Para produção 24/7 a conta é outra** e precisa do
preço na mão antes de se prometer os 80%.

🔑 O desenho já reconhece isso: o cache é opcional (`SEM_CACHE=1` desliga), o TTL
é curto, e a chave é um hash do conteúdo. Mudou uma linha do `RULES.md`, nasce
cache novo. Sem isso, editar o prompt e seguir rodando o cache velho seria um bug
invisível do pior tipo: o teste mediria a versão anterior.
