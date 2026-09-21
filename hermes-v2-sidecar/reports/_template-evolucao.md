---
tipo: template
status: vivo
data: 2026-09-21
assunto: hermes-v2-sidecar
tags: [e2e, relatorio, template, evolucao]
---

# Template · relatório de evolução de rodada

Padrão obrigatório para toda rodada de teste a partir de 21/09/2026.

**Como usar.** Copie este arquivo para `reports/evolucao-AAAA-MM-DD-HHMM.md` e
preencha. Os números das seções 1 a 3 saem prontos do relatório automático que
o `npm run e2e` grava — não os recalcule à mão, copie de lá. A seção 4 é a
única que exige escrita humana, e é a única que não pode ser omitida.

> 🔴 **O placar é o número menos informativo deste relatório.** Ele tem ruído
> medido de até 3 pontos (amplitude 3, sigma 1,07 em nove rodadas do mesmo
> pacote). Diferença de 1 ou 2 pontos entre rodadas **não é sinal**. Tratar
> flutuação como sinal produz a rodada infinita de "melhorar o prompt" atrás de
> ruído. O que vale olhar é a rota escolhida e o caso que falha sempre.

Apague este bloco de instruções ao preencher. O aviso acima fica.

---

## 1. Identificação

| | |
|---|---|
| data e hora | `AAAA-MM-DD HH:MM` |
| suíte | `curta` / `acervo` / `maratona` / avulsa |
| casos | `N` |
| modelo | `gemini-3.1-flash-lite` (confirme em `PRECO.modelo`) |
| relatório automático de origem | `reports/e2e-AAAA-MM-DD-HHMM.md` |
| JSON bruto | `_testes-saida/e2e-AAAA-MM-DD.json` |
| o que mudou antes desta rodada | uma linha, concreta |

## 2. Placar e custo

| | |
|---|---|
| **placar** | **`N`/`N`** |
| custo total | `US$ 0,0000` · `R$ 0,00` |
| custo por caso | `US$ 0,0000` · `R$ 0,00` |
| chamadas ao modelo | `N` |
| tokens de entrada | `N` |
| dos quais em cache | `N` (`NN,N%` de acerto) |
| sem cache custaria | `US$ 0,0000` |
| **economia do cache** | **`US$ 0,0000` (`NN,N%`)** |
| tokens de saída | `N` |
| chamadas de embedding | `N` |
| falhas de provedor | `N` |
| coeficiente de variação do tamanho | `0,00` (alvo 0,45) |

> ⚠️ Se a **economia do cache** caiu para perto de zero sem que ninguém tenha
> mexido em prompt, o prefixo do cache quebrou. Ver diretriz 5 do `CLAUDE.md`.
> O sintoma é sempre este: a conta sobe e o placar não muda.

## 3. Chamadas de RAG

São **duas bases vetoriais com trabalhos diferentes**, e somar as duas esconde
o que importa. `buscar_cartao` responde **o que o produto faz**. `buscar_base`
responde **link, data e regra de atendimento**. Uma pode estar viva e a outra
morta na mesma rodada.

| base | trechos recuperados |
|---|---|
| `buscar_cartao` (as 58 capacidades) | `N` |
| `buscar_base` (as notas de conhecimento) | `N` |

### Cartões acionados

| cartão | vezes |
|---|---|
| `nome-do-cartao` | `N` |

> 🔴 Se a linha de `buscar_cartao` vier zerada, isso é achado de arquitetura e
> não de redação: ou a descrição da tool não compete com as tools de fato, ou
> os casos desta suíte não perguntam o que um cartão responde. Nos dois casos,
> **a rodada não autoriza nenhuma conclusão sobre a qualidade dos 58 cartões**.

### Rotas escolhidas

| trilha | turnos |
|---|---|
| `comercial` | `N` |
| `tecnico` | `N` |
| `fora_escopo` | `N` |
| `escalonamento` | `N` |

| | |
|---|---|
| turnos sem lastro técnico | `N` |

## 4. Análise de evolução

**Seção obrigatória.** Relatório entregue sem ela está incompleto. É aqui que a
rodada vira conhecimento em vez de número solto.

### 4.1 Comparação com a rodada anterior

| | rodada anterior | esta rodada | delta |
|---|---|---|---|
| placar | `N`/`N` | `N`/`N` | `+/-N` |
| custo total | `US$ 0,0000` | `US$ 0,0000` | `+/-NN%` |
| economia do cache | `NN,N%` | `NN,N%` | `+/-NN p.p.` |
| turnos sem lastro | `N` | `N` | `+/-N` |

### 4.2 O porquê da mudança

Para cada diferença relevante, responda explicitamente **qual das quatro
causas** abaixo explica o movimento. Escolher uma é obrigatório; "não sei" é
uma resposta aceitável e melhor que um palpite com cara de conclusão.

| causa | como se reconhece |
|---|---|
| **ajuste de prompt/regra** | houve edição em `RULES.md`, `PERSONA.md` ou descrição de tool antes desta rodada, e a falha que sumiu é exatamente a que a edição mirava |
| **alucinação / não determinismo** | nada mudou no repositório entre as duas rodadas, ou o caso alterna entre passar e falhar sem padrão |
| **mudança de RAG** | cartões ou notas foram recarregados, e a tabela da seção 3 mudou junto |
| **defeito de código ou de provedor** | erro de execução, `falhas de provedor` maior que zero, ou rota errada de forma sistemática |

Escreva um parágrafo curto por diferença relevante. Nomeie o caso, não só o
número:

> Exemplo do formato esperado — apague ao preencher.
> O placar subiu de 14/20 para 17/20, mas **isso não é o achado**: 3 pontos é
> exatamente o ruído da suíte. O achado é que `venda-escada`, que falhava em 9
> de 9 rodadas, passou nesta. Antes dela entrou o filtro de tools por trilha, e
> a rota do caso mudou de `comercial` para `escalonamento`. Causa: ajuste de
> arquitetura, não de prompt. Precisa de mais uma rodada para confirmar que não
> foi sorte.

### 4.3 Casos que falharam sempre

Caso que falha uma vez é flutuação. Caso que falha em todas é defeito e tem
dono.

| caso | rodadas em que falhou | hipótese | próximo passo |
|---|---|---|---|
| `id-do-caso` | `N`/`N` | | |

### 4.4 O que esta rodada NÃO prova

Três linhas, no mínimo. O que ficou fora da suíte, o que as checagens
automáticas não alcançam, e que leitura alguém poderia tirar daqui e estaria
errado em tirar.

## 5. Decisão

| | |
|---|---|
| esta rodada autoriza alguma mudança em produção? | sim / não |
| se sim, qual e sob qual diretriz do `CLAUDE.md` | |
| precisa de outra rodada antes de decidir? | sim / não — e por quê |
