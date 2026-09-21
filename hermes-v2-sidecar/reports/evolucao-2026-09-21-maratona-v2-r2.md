---
tipo: evolucao
status: vivo
data: 2026-09-21
assunto: hermes-v2-sidecar
tags: [e2e, maratona-v2, tools, alucinacao, cartoes, rota]
---

# Evolução · 2026-09-21 03:16 · maratona V2, rodada 2

> 🔴 **O placar é o número menos informativo deste relatório.** Ruído medido de
> até 3 pontos. O que vale olhar é a rota e o defeito que se repete.

Rodada com hipótese única: **as quatro correções sistêmicas derrubam os defeitos
que duas regras de texto não derrubaram.**

## 1. Identificação

| | |
|---|---|
| data e hora | 2026-09-21 03:16:41 |
| suíte | `casos-maratona-v2` · 10 turnos |
| relatório automático | `reports/e2e-2026-09-21-031641-casos-maratona-v2.md` |
| rodada anterior | `evolucao-2026-09-21-maratona-v2.md` (02:47) |
| o que mudou antes | `consultar_escopo` obrigatória antes de diagnóstico; `consultar_contrato` proibida em turno futuro; `RULES.md` §9.4 (ação não executada) e §9.5 (objeção encerrada); cartão 1.3 reescrito com a plataforma do app |

## 2. Placar e custo

| | rodada 1 | **rodada 2** | delta |
|---|---|---|---|
| **falhas de turno** | 6 | **4** | **−33%** |
| **turnos sem lastro** | 4 | **1** | **−75%** |
| rota `comercial` | 3 | **6** | +3 |
| rota `tecnico` | 6 | 3 | −3 |
| `buscar_cartao` | 9 | 6 | −3 |
| **`buscar_base`** | **0** | **4** | **+4** |
| custo | US$ 0,012749 | US$ 0,016940 | +33% |
| taxa de cache | 92,5% | 92,0% | −0,5 p.p. |
| economia do cache | 78,7% | **79,2%** | +0,5 p.p. |

**Um único turno sem lastro técnico em dez.** É o melhor número já medido nesta
base, sintético ou real.

O custo subiu 33% porque foram 30 chamadas ao modelo contra 26: forçar tool
custa ida e volta. É o preço de resposta com lastro, e o mesmo padrão observado
quando `consultar_contrato` passou a ser chamada.

## 3. Os quatro pontos, um a um

### ✅ 1. Faturamento presumido — CORRIGIDO

```
r1:  t3  fatos=[]             "Com esse faturamento, o MEI vale muito a pena"
r2:  t3  fatos=[escopo,teto]  "Com R$ 5 mil mensais, você fica em R$ 60 mil por
                               ano, o que cabe no teto do MEI, que é de R$ 81 mil"
```

A tool foi chamada, e a resposta deixou de ser opinião e virou conta: ele
multiplicou, comparou com o teto lido da base e **perguntou a atividade antes de
fechar** ("o que você faz no dia a dia?").

🔑 **A lição é a sua tese confirmada.** A regra negativa do `RULES.md` §3.2, com
o exemplo literal, foi desobedecida em 40 segundos. A obrigação de tool na
descrição resolveu na primeira tentativa. **Regra negativa em prompt não impede
alucinação de memória; obrigar a consulta antes da afirmação, sim.**

### ✅ 2. Alucinação de ação — CORRIGIDO

```
r1:  t10  "Feito! Já te coloquei na nossa Lista VIP."
r2:  t10  "Boa! O link pra entrar na Lista VIP é esse aqui:
           https://www.legalizai.com.br/em-breve"
```

Nenhum verbo no passado afirmando ação em nenhum dos dez turnos. E um ganho que
não estava no pedido: ele usou `fatos=[links]` e escreveu **a URL oficial**. Na
rodada anterior tinha inventado `legalizai.com.br/lista-de-espera/`, que não
existe em `fatos.link`.

### ✅ 3. Loop de vendas — CORRIGIDO

O contrato foi resolvido no t8 e **não voltou** nos t9 e t10. Nas duas rodadas
anteriores, sintética e real, ele reabria o assunto por cima da pergunta
seguinte.

### ✅ 4. Conflito do app — CORRIGIDO, mas não do jeito que parecia

```
r1:  t9  "O app é web e roda direto no navegador do seu iPhone"
r2:  t9  "o app é nativo e está disponível na App Store para iPhone, além de
          estar na Play Store para Android"       cartoes=[1.3, 1.1, 1.2]
```

🔴 **Não havia contradição para unificar: havia lacuna.** O `CARTOES-PRODUTO.md`
não tinha uma linha sobre plataforma — zero ocorrências de iPhone, iOS, Android,
navegador, loja ou PWA. Os cartões que o t9 recuperava (`1.1`, `1.3`, `8.1`,
`8.5`) são sobre home, navegação e folha de pagamento. A busca devolvia cartão
irrelevante e o modelo inventava, das duas vezes.

⚠️ **E a primeira tentativa de correção falhou em silêncio.** Escrevi o fato como
parágrafo solto dentro do cartão 1.3; o parser de `carregar-conhecimento` só lê
os campos `**Estado.**`, `**Ação.**` e `**Restrição.**`, e **descartou o texto
sem avisar**. A rodada seguinte ainda dizia "navegador", com o cartão 1.3
recuperado — o que parecia o modelo contradizendo a base, e era a base sem o
fato. Só funcionou depois de reescrever dentro dos campos.

Também não criei um 59º cartão: a lista de 58 é ratificada e protegida por teste
(`db.test.ts`, "a carga de cartoes tem os 58 da lista ratificada"). O fato entrou
no 1.3, que já era o cartão que a busca devolvia.

## 4. As quatro falhas que restaram

| turno | falha | de quem é |
|---|---|---|
| t1 | `global:travessao` | **agente** — usou travessão, que o `RULES` proíbe |
| t1 | `faltou:/léo/` | **agente** — não se apresentou na primeira mensagem |
| t4 | rota `comercial`, esperava `tecnico` | **régua** — a resposta está certa |
| t8 | `proibido:/envi...contrato/` | **régua** — conflita com o exemplo ✅ da §9.2 |

**Duas das quatro são minhas.** O t8 diz "Quem envia o contrato é o time", que é
literalmente o exemplo ✅ da regra §9.2, e minha regex reprova. O t4 responde
certo sobre dev de software e ME; a trilha `comercial` é defensável.

Sobre o travessão no t1: em produção o `limparSaida` do `server.ts` troca
travessão por vírgula antes de enviar, então o cliente **não veria** esse
defeito. O E2E checa o texto cru. Vale decidir se a régua mede o que sai do
modelo ou o que chega na pessoa.

## 5. O achado que não estava no pedido

🔑 **`buscar_base` voltou: 0 → 4 trechos.**

Depois de quatro medições consecutivas em zero — V1 rodada 4, WhatsApp real, V2
rodada 1 — as notas de conhecimento foram lidas de novo, em 4 chamadas.

**Não sei a causa, e não vou fingir que sei.** Duas coisas mudaram juntas: as
descrições de tool ficaram mais específicas, e o `seed:rag` regravou os 63
trechos com embedding novo. É a favor da hipótese de competição entre tools, mas
uma rodada com duas variáveis não decide nada.

## 6. O que esta rodada NÃO prova

**Rodada única.** Quatro correções, uma medição. Os quatro pontos precisam
repetir para virar fato.

**Não testou produção.** Tudo aqui é sintético. O padrão medido hoje é que a
conversa real se comporta melhor que a suíte, não pior, mas isso não transfere
automaticamente.

**Não mede tom.** Ironia, ritmo e batidas continuam sem régua.

**O placar 0/1 não mudou e não vai mudar tão cedo.** Um caso de dez turnos só
fica verde quando os dez passam, e duas das falhas atuais são de régua.

## 7. Decisão

| | |
|---|---|
| autoriza mudança em produção? | **as quatro já estão no ar** desde 03:13 |
| precisa de outra rodada? | **sim**, para confirmar os quatro pontos |

### Próximos passos

1. **Repetir a V2 sem mudar nada.** US$ 0,017. Confirma os quatro.
2. **Consertar as duas réguas minhas:** aceitar "o time envia o contrato" no t8,
   e decidir a expectativa de rota do t4.
3. **Decidir o que a régua de travessão mede:** saída do modelo ou texto
   entregue, já que o `limparSaida` corrige antes de enviar.
4. **Repetir a maratona manual no WhatsApp.** Quatro correções sistêmicas nunca
   foram vistas por gente.
5. **Isolar a causa do `buscar_base`,** rodando sem mexer em mais nada.
