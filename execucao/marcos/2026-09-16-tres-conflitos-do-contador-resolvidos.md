---
tipo: marco
data: 2026-09-16
decide: Pedro
origem: reunião com Leonan (3 áudios, ~5h)
---

# ⚖️ Os três conflitos da reunião do Leonan, decididos

> 🧭 **Por que existe.** Os três áudios de 16/09 ratificaram quase tudo, mas deixaram **três conflitos** que eu não podia resolver sozinho: um revogava regra travada, um contradizia assunto encerrado, e um era o Leonan contra ele mesmo. O Pedro decidiu os três no mesmo dia.
>
> 🔑 **A régua usada nos três foi a mesma:** onde a fala do contador e a norma capturada divergem, **a norma manda**; onde as duas permitem, **a decisão é de produto** e fica escrita como escolha, não como obrigação.

---

## 1 · 🟡 EPP — fica em STANDBY, com as observações guardadas

**O conflito:** o Leonan disse que EPP continua no Simples até R$4,8 milhões e que o desenquadramento é quase inócuo, o que abria caminho para revogar a regra travada em 13/09 (*"EPP só como porta de SAÍDA, nunca como permanência"*).

**✅ Decisão do Pedro:** **continua em standby.** A `_persona.mjs` **não muda** e a trava `verificar-persona.mjs` segue derrubando a rodada. O que muda é que agora sabemos o custo de mudar de ideia — e ele é baixo.

🔑 **As observações que ficam guardadas, e que tornam fácil atender se quisermos:**

| | O que o Leonan estabeleceu |
|---|---|
| **Teto** | O Simples vai até **R$4,8 milhões**. O limite de R$360 mil é do **porte ME**, não do regime |
| **O que muda no cálculo** | *"O Simples Nacional dele fica igual, exatamente igual."* Sem grandes alterações |
| **O que muda de verdade** | Só o campo **porte** no cartão CNPJ, de ME para EPP |
| **É automático?** | **Não.** *"Ele nem gera um processo automático para isso"* — é processo na Junta |
| **E se não fizer?** | 🔑 *"**A Receita não trava o CNPJ dele** por falta desse enquadramento como EPP."* A empresa continua operando e declarando normal |
| **O risco real** | Confundir EPP com **Lucro Presumido**. *"Tem EPP que fica no lucro presumido"* — e esse **segue fora**, sem discussão |
| **Se virar produto** | Alteração de porte como **serviço**: honorário + taxas da Junta |

⚠️ **O que isso muda HOJE na P16:** a persona diz que ela *"encosta no teto do ME sem passar"* e trata o EPP como porta de saída. Segue correto enquanto o EPP estiver em standby. **Se sair do standby, essa linha vira upsell** — e é a única das cinco personas afetada.

---

## 2 · ✅ CPP — a manobra existe, e nós NÃO a faremos

**O conflito:** o Leonan disse que dá para pegar a CPP embutida no DAS e somá-la ao numerador do Fator R (*"pode considerar em tudo"*, *"vai acumular mais 1% ali, vai virar 30"*), contra o `E-CPP` que encerramos em 14/09 com a Res. CGSN 140/2018 art. 26 §2º I 'a'.

🔑 **E a leitura certa do que ele disse desfaz o conflito.** Ele não estava contestando a norma: estava **descrevendo uma manobra** — pegar o valor já gerado na guia e usá-lo na conta para alcançar a porcentagem. É prática, não interpretação.

**✅ Decisão do Pedro, literal:**

> *"Na verdade a gente faria essa manobra de pegar esse valor e considerar ele no Fator R para chegar à porcentagem que precisamos, **mas na verdade de fato não faremos isso**. O CPP continuará sendo apenas gerado dentro da guia normal como sempre é gerado, **a gente não vai pegar o valor gerado e fazer essa matemática sugerida**."*

### O que fica travado

| | |
|---|---|
| **A CPP é gerada** | dentro do DAS, como sempre. É a maior parcela da guia — **43,40%** no Anexo III faixa 1 |
| **A CPP NÃO é usada** | como numerador do Fator R. Nem soma, nem "plus", nem arredondamento para cima |
| **O Fator R usa** | só a **folha efetivamente paga** — pró-labore, e salário/13º/férias/FGTS quando houver colaborador |

🔑 **E a decisão é mais forte que a norma sozinha.** Antes, o `E-CPP` se apoiava só na leitura de que o silêncio da Res. CGSN sobre os Anexos III e V é vedação. Agora tem **duas camadas**: a norma diz que não entra, **e** nós decidimos não fazer a manobra mesmo se alguém interpretar que entra.

⚠️ **Por que isso importa mais do que parece:** a manobra move o Fator R em cerca de **1 ponto percentual**. Aplicada numa empresa em 27,x%, ela a declararia no Anexo III. Se a interpretação estiver errada, o erro é **por cliente, por mês, e retroativo** — a Receita reclassifica de ofício e recalcula tudo com Selic e multa. A nossa margem de 30% existe justamente para não depender de ponto nenhum na borda.

---

## 3 · ✅ O 1º mês — a confusão era de PERGUNTA, não de regra

**O conflito:** no áudio 2 o Leonan disse que o Fator R lê a **competência anterior** (logo, quem fatura no mês da abertura paga 15,5%); no áudio 3 disse que *"o próprio mês vai contar"*, e emendou *"ali não sou 100% não"*.

🔑 **A memória do Pedro estava certa, e ela resolve o conflito sem precisar escolher entre as duas falas.** O desenho combinado está no **áudio 2**, e eu o reencontrei literal:

### O que foi combinado, com as falas

**A regra geral — e por que ela quase sempre basta** *(áudio 2, linhas 44 e 48)*

> **Léo:** *"O cara abre hoje, mês 9. **O ideal seria que ele começasse a faturar no mês 10.** Porque quando eu tiver no mês 11 fazendo o mês 10, **eu já vou ter os 28% do mês 9**."*
>
> *"Pra simplificar: **deixa o cara tributar nos 15,5 no primeiro mês.** Como ele já vai ter esse valor formado dos meses anteriores, na hora que chegar no mês 10, você já faz a média dos 28 e já gera do mês."*

**Por que isso cobre quase todo mundo** *(áudio 2, linhas 222 e 224)*

> **Léo:** *"**Dificilmente eu vi um caso assim, o cara faturou e emitiu uma nota no mesmo mês. Muito difícil.** Normalmente o mês vira, o cara não vai emitir no mês 9, ele emite lá no mês 10."*
>
> **Pedro:** *"O nosso nicho, que é prestador de serviço, ele de fato vai ter que **cumprir a competência dos 30 dias trabalhados** para emitir a nota."*

🔑 **É estrutural, não estatístico.** Serviço se presta antes de se cobrar. O prestador trabalha o mês 9 inteiro e emite no mês 10 — então **o mês da constituição quase nunca tem nota**, e a partir do 3º mês o Fator R roda fluido desde o início, sem manobra nenhuma.

**A exceção, e o que fazemos com ela** *(áudio 2, linhas 210, 214, 218 e 220)*

> **Léo:** *"O que a gente pode rastrear é o seguinte: **gerar um alerta para a gente**. O cara abriu — lá vai ter uma data de abertura —, o cara abriu 16 do 9, competência 9 ele faturou. **Alertar para nós.** Ao invés de eu ser pego de surpresa, **eu posso tratar esse caso como um caso**."*
>
> **Pedro:** *"Eu acho que a gente pode criar uma forma do sistema gerar um alerta pra gente que **o cara faturou no mesmo mês que ele abriu**."*
>
> **Pedro:** *"Pode ser um **segundo aceite**: a gente consegue, no mês seguinte, de uma forma que você vai economizar — só que **eu preciso que você confirme isso pra mim, porque a gente vai fazer isso pra você**."*

### ✅ A decisão, fechada

| | |
|---|---|
| **Regra geral** | O pró-labore começa **na primeira nota** *(default do onboarding)*. Nenhuma manobra |
| **O mês da constituição com nota** | 🔴 **dispara alerta INTERNO**, não tela. O cliente não vê |
| **O que a casa faz** | **Entra em contato** e oferece gerar a folha da competência da constituição, para que o **mês seguinte já saia no Anexo III** |
| **Quem decide** | O cliente, com **segundo aceite registrado**. Não fazemos por conta |
| **O mês da constituição em si** | 🔒 fica em **15,5%**. Não prometemos reverter |

### 🔑 E aqui está a correção que o levantamento trouxe: NÃO é retroativo

Na reunião ficou a impressão de que essa operação exigiria **retificação de eSocial com guia complementar, juros e multa**. É o que o Leonan descrevia — mas ele estava falando de consertar **o próprio mês da constituição**, que é impossível porque exigiria folha num mês em que a empresa não existia.

**O que o Pedro descreveu é outra coisa, e ela cabe dentro do prazo normal:**

```
16/09  constitui e emite nota           → competência 09 nasce
até 15/10  geramos a folha de 09        ← PRAZO NORMAL do eSocial/DCTFWeb
20/10  DARF do INSS de 09 vence         ← pagamento normal
competência 10 (apurada em 11)          → a janela já tem folha em 09
                                        → ✅ ANEXO III a partir de outubro
```

| | Como ficou na conversa | Como de fato é |
|---|---|---|
| Natureza | retificação **retroativa** | 🔑 **lançamento dentro do prazo** |
| Custo | guia complementar + juros + multa | **zero de acréscimo** |
| Janela | já perdida | **até o dia 15 do mês seguinte** |

⚠️ **Só vira retroativo — com juros e multa — se passar do dia 15.** Por isso o alerta tem que disparar **na emissão da nota**, não no fechamento do mês. É o que dá à casa até 15 dias úteis para ligar para o cliente.

### 🔒 E por que isso encerra o conflito entre os áudios 2 e 3

**A ação é a mesma nas duas leituras.** Se o Fator R lê a competência anterior *(áudio 2)*, a folha do mês 9 faz o mês 10 ser Anexo III. Se o próprio mês contasse *(áudio 3)*, a mesma folha faria o mês 9 também ser — um bônus.

✅ **Adotamos a leitura conservadora do áudio 2**, por três razões: ele a afirmou **com exemplo numérico**, no áudio 3 ele mesmo **recuou** (*"não sou 100%"*), e errar para o lado estrito **nunca gera cobrança a menos**. Se depois confirmarmos a outra, o cliente ganha um mês — nunca deve um.

⏳ **Segue aberto, mas deixa de ser bloqueio:** confirmar qual das duas leituras é a da norma. Vira pergunta de pesquisa, não trava de produto.

---

## O que muda nos arquivos

| Arquivo | Mudança |
|---|---|
| `_encerrados.mjs` · **E-CPP** | ganha a **decisão de produto** do Pedro, além do argumento de norma |
| `_persona.mjs` | 🔒 **nada** — EPP segue fora |
| `vidas.mjs` | ⏳ falta uma vida que **constitui e fatura no mesmo mês** com CNAE de Fator R |
| `_duvidas-contador.md` | a P16 mantém o EPP como porta de saída |

## Links
[[2026-09-16-leonan-audio-1-bloco-a-e-c]] · [[2026-09-16-leonan-audio-2-bloco-d]] · [[2026-09-16-leonan-audio-3-bloco-d-e-e]] · [[_encerrados]] · [[_duvidas-contador]] · [[ciclo-do-cnpj]]
