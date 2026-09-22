---
tipo: proposta
status: parcialmente-aplicada
data: 2026-09-22
aplicado_em: 2026-09-22
assunto: curadoria-da-base-do-leo
tags: [leo, rag, base, curadoria, fatia, busca]
---

# 🧠 Curadoria da base do Léo — o que perguntar, o que falta, como fatiar

> 📌 **Para o Pedro curar.** Marque ✅ no que faz sentido, ❌ no que não, e escreva ao lado o que quiser mudar. Nada daqui vira mudança sem a sua passada.
>
> 🧭 **De onde isto vem:** o `buscar_base` deu zero chamada em quatro medições. O teste barato de 22/09 provou que **a busca acha** (9 de 10, 8 em primeiro lugar) — mas uma pergunta falhou, e ao investigar por que, apareceu coisa maior. Li as **13 notas inteiras, 69.123 caracteres**, e medi o corte de cada uma.

---

## 0 · 📍 ESTADO — o que já foi executado (medido em 22/09, fim do dia)

> 🔴 **Este bloco existe porque o resto do doc está escrito no futuro.** Ele foi redigido como proposta pela manhã; as ondas 1, 2 e 3 rodaram no mesmo dia. **Onde o texto abaixo disser "proposta", leia contra esta tabela.** Os números aqui foram contados no arquivo, não lembrados.

| | Proposto | ✅ Real hoje |
|---|---|---|
| **Trechos na base** | 63, alvo ~130 | **100** (`seed/contagem-esperada.json`) |
| **Caracteres invisíveis** | 5.922, em 13 notas | **0** — sobrou só frontmatter e título antes do 1º `##` |
| **`04-QUEBRA-OBJECOES`** | 3 → ~20 | **24 seções**, uma por objeção |
| **`05` §4** (4.145 chars) | partir em 4 | **partido em 4A/4B/4C/4D** |
| **`08-MAPA-DO-DOSSIE`** | 1 → 5 | **2** — ⚠️ ver a ressalva abaixo |
| **Teste de busca** | 9/10, 1 falha | **12/12 entre os 4, zero falha** |

**As 11 respostas curadas (§3.12) estão na base.** Conferido por busca literal: alvará · IPTU · conta PJ · desativar pró-labore · guia única do MEI · assinatura gov.br · `contato@legalizai.com.br`. ✅ E o telefone **não entrou** — zero ocorrências do número nas 13 notas, como você decidiu na Q82 (o WhatsApp do Léo é a própria conversa).

🆕 **Uma decisão que o resto deste doc ainda não conhece: a doutrina saiu do RAG.** Oito preâmbulos eram **instrução para o agente**, não resposta para cliente (*"isto não é pra você recitar"*, *"a ferramenta ainda não está ligada"*). Virar `##` os teria jogado na busca do cliente. Foram para o `RULES.md` §10. Isso acrescenta uma régua de corte ao §5 — está lá como **régua 6**.

### ⬜ O que continua aberto

| | O quê | De quem depende |
|---|---|---|
| **1** | ⚠️ **O `08` parou no meio do caminho.** O P-02 funcionou — a tabela dos 14 campos voltou para a busca — mas como **um bloco de 2.173 caracteres**, o dobro do teto de ~1.000 da régua do §5. A proposta previa 5 seções por etapa; entregou 2 | onda 4 |
| **2** | **F-02** (formas de pagamento) e **F-03** (servidor público) — conferido: **ausentes das 13 notas** | 🔴 **você**: F-02 é decisão de negócio · F-03 precisa do Leonan |
| **3** | Os demais **F-04 a F-12** e o resto da reestruturação do §5 | onda 4 |
| **4** | As **84 perguntas do §3** que não foram curadas | você |

---

## 1 · 🔴 O achado que muda a prioridade: 5.922 caracteres são invisíveis

O fatiador corta **no `##`** e joga fora **tudo que vem antes do primeiro**. Não é opinião, é a linha do código:

```ts
const blocos = corpo.split(/^## /m).slice(1)   // ← o .slice(1) descarta o preâmbulo
```

E é justamente no preâmbulo que moram as regras mais vermelhas:

| Nota | Descartado | O que se perdeu |
|---|---:|---|
| **`08-MAPA-DO-DOSSIE`** | **2.228** | 🔴 **a tabela inteira dos 14 campos do dossiê.** A nota inteira, na prática |
| **`11-COMO-CONSULTAR-CNAE`** | **1.044** | 🔴 *"a ferramenta `consultar_cnae` ainda não está ligada. Não tente chamá-la"* |
| `06-CALCULO-FISCAL` | 491 | 🔴 *"isto não é pra você recitar"* + *"você não dá valor de imposto do caso da pessoa"* |
| `02-PRODUTO-E-USABILIDADE` | 366 | *"o app está em pré-lançamento"* |
| `09-ESCOPO-E-LIMITES` | 329 | *"leia isto antes de qualquer promessa de venda"* |
| `01-PLANOS-E-OFERTAS` | 309 | 🔴 *"R$ 19 e R$ 79 expiraram e não existem mais"* |
| `12-GATE-DE-SAIDA` | 304 | *"aqui está só o que fazer quando a resposta é não"* |
| demais | 851 | — |

🔑 **O `08` é o caso extremo:** ele tem **um único `##`** (*"Coisas que a gente NÃO pergunta"*), e a tabela de 14 campos está **acima** dele. Quando alguém pergunta *"quais documentos vocês vão me pedir?"*, o que a busca pode devolver é a nota que diz **o que a gente não pergunta**.

⚠️ E repara na ironia: no teste, essa pergunta **acertou em 1º lugar**. Ela achou o `08` — e o trecho que achou é o único que não responde.

**Conserto:** transformar preâmbulo em `## 0` (ou equivalente) nas 13 notas. É mudança de markdown, sem tocar no código do fatiador.

| | Proposta | ✅/❌ |
|---|---|:--:|
| **P-01** | Todo preâmbulo vira uma seção `##` própria, nas 13 notas | ✅ feito (onda 1) |
| **P-02** | No `08`, a tabela de 14 campos vira `## 1. O que o app pede, campo a campo` | ✅ feito — mas ficou em **um bloco de 2.173 chars**, ver §0 |

---

## 2 · As três camadas do problema

| Camada | O que é | Quantos casos |
|---|---|---|
| **A · invisível** | texto antes do 1º `##` nunca entra na busca | ✅ **zerada** — 13 notas, eram 5.922 chars |
| **B · diluído** | fatia com muitos assuntos vira vetor médio, longe de todos | `04` (2.541) · `05` (4.145) · `03` (1.824) |
| **C · ausente** | o assunto não está escrito em lugar nenhum | ver §4 |

**Prova da camada B, do próprio teste:** *"vocês atendem quem tem loja de roupa?"* trouxe `09-ESCOPO` em 1º. Mas essa pergunta **existe literalmente no `04`** (*"Minha empresa é uma loja. Serve?"*). O `04` perdeu na pergunta que ele responde palavra por palavra — porque o pedaço dele carrega oito assuntos.

---

## 3 · As perguntas novas, por assunto

> **Como ler:** `nota` é onde a resposta deveria estar. **Previsão** é meu palpite do que acontece hoje — ✅ acha · 🟡 acha diluído · 🔴 não acha · ⚫ **não existe resposta na base**.
>
> As perguntas estão na **redação do cliente**, com erro de português e tudo, porque é assim que chegam.

> ✅ **Onze destas já foram curadas pelo Pedro em 22/09** — as respostas travadas estão no **§3.12**, no fim desta seção. Três delas conflitam com regra já escrita e estão sinalizadas lá.

### 3.1 · Preço e valor percebido *(a objeção que não existe na base)*

| # | Pergunta | Nota | O que testa | Previsão | ✅/❌ |
|---|---|---|---|:--:|:--:|
| Q01 | tá caro, o contador aqui do bairro cobra menos | `04` | a objeção mais comum do ramo | ⚫ | |
| Q02 | por que eu pago mensalidade se só emito uma nota por mês? | `04` | valor percebido no volume baixo | ⚫ | |
| Q03 | dá pra abrir sozinho no portal do governo de graça, né? | `04` | a objeção do "faço eu mesmo" | ⚫ | |
| Q04 | vou pensar e te falo | `04` | objeção de indecisão | ⚫ | |
| Q05 | meu cunhado é contador, ele faz por 100 | `04` | comparação com relação pessoal | ⚫ | |
| Q06 | vocês são novos né, e se fecharem no meio do caminho? | `04` | risco de empresa nova | ⚫ | |
| Q07 | tem desconto se eu pagar o ano todo? | `01` | pagamento anual | ⚫ | |
| Q08 | qual a diferença de preço entre o MEI e o ME? | `01` | comparação de planos | 🟡 | |
| Q09 | esses 49 reais é do plano ou do endereço? | `03` §1 | 🔴 a colisão declarada dos R$ 49 | 🟡 | |
| Q10 | a promoção vale até quando mesmo? | `01` | validade 31/12/2026 | ✅ | |
| Q11 | eu vi 19 reais num anúncio de vocês | `01` | 🔴 valor expirado — **está no preâmbulo invisível** | 🔴 | |

### 3.2 · Formas de pagamento e cobrança *(assunto que não existe em nota nenhuma)*

| # | Pergunta | Nota | O que testa | Previsão | ✅/❌ |
|---|---|---|---|:--:|:--:|
| Q12 | aceita pix? | — | forma de pagamento | ⚫ | |
| Q13 | posso pagar no boleto? | — | idem | ⚫ | |
| Q14 | é cartão de crédito recorrente? vai debitar sozinho todo mês? | — | recorrência | ⚫ | |
| Q15 | quando vocês começam a cobrar? | — | início da cobrança | ⚫ | |
| Q16 | se eu atrasar a mensalidade, o que acontece? | — | inadimplência | ⚫ | |
| Q17 | vocês dão nota fiscal da mensalidade de vocês? | — | nota do próprio serviço | ⚫ | |

### 3.3 · Quem pode abrir *(perfil do titular)*

| # | Pergunta | Nota | O que testa | Previsão | ✅/❌ |
|---|---|---|---|:--:|:--:|
| Q18 | trabalho de carteira assinada, posso abrir CNPJ? | `08` §7 · nova | o caso mais comum que não tem resposta direta | ⚫ | |
| Q19 | sou servidor público, posso ser sócio? | — | 🔴 impedimento legal real (Lei 8.112 art. 117) | ⚫ | |
| Q20 | sou aposentado, posso abrir empresa? | — | vínculo de INSS | ⚫ | |
| Q21 | tô com o nome sujo, consigo abrir? | `03` §3 · `04` | SPC/Serasa não impede | 🟡 | |
| Q22 | meu CPF tá irregular na receita, trava? | `03` §3 | o que realmente trava | 🟡 | |
| Q23 | sou menor de idade, posso? | — | idade mínima | ⚫ | |
| Q24 | sou estrangeiro morando no brasil, dá? | `09` §2 | sócio domiciliado no Brasil | 🟡 | |
| Q25 | posso abrir sozinho ou preciso de sócio? | — | SLU — o app abre unipessoal | ⚫ | |
| Q26 | meu sócio mora em outro estado, dá problema? | `04` | assinatura digital | 🟡 | |
| Q27 | quero abrir com 5 sócios | `09` §2 | limite de 4 | 🟡 | |
| Q28 | meu sócio é uma empresa, pode? | `09` §2 | sócio PJ está fora | 🟡 | |

### 3.4 · Escopo — quem a gente atende

| # | Pergunta | Nota | O que testa | Previsão | ✅/❌ |
|---|---|---|---|:--:|:--:|
| Q29 | vocês atendem quem tem loja de roupa? | `09` · `12` | comércio fora | ✅ | |
| Q30 | moro em contagem, vocês pegam? | `09` §1 · `03` §1 | fora de BH + endereço fiscal | 🟡 | |
| Q31 | minha empresa vai faturar uns 40 mil por mês | `09` §3 · `12` | acima do teto do ME → EPP | 🟡 | |
| Q32 | faço bolo em casa e vendo, serve? | `09` §2 | comércio disfarçado de serviço | ⚫ | |
| Q33 | sou dentista, vocês atendem? | `09` §4 · `05` §4C | regulamentada + conselho de classe | ⚫ | |
| Q34 | faço obra, reforma de casa. vocês atendem? | `09` §2 | 🔴 Anexo IV, fora do escopo | 🟡 | |
| Q35 | tenho serviço e também revendo produto | `12` §6 | atividade mista | 🟡 | |
| Q36 | quero abrir no lucro presumido | `09` §2 · `12` §7 | fora do escopo | ✅ | |
| Q37 | minha empresa tá parada com dívida, vocês regularizam? | `09` §2 | 🔴 regularização não está no produto | 🟡 | |
| Q38 | quero fechar minha empresa, vocês fazem? | — | baixa de CNPJ | ⚫ | |

### 3.5 · MEI × ME e elegibilidade

| # | Pergunta | Nota | O que testa | Previsão | ✅/❌ |
|---|---|---|---|:--:|:--:|
| Q39 | sou fotógrafo, posso ser MEI? | `05` §4C | a exceção escrita | 🟡 | |
| Q40 | sou programador, consigo ser MEI? | `05` §4C | a exceção do "não pode" | 🟡 | |
| Q41 | sou adestrador de cães, posso ser MEI? | `05` §4C | 🔴 a regra base do "eu não sei" | 🟡 | |
| Q42 | faturo uns 5 mil por mês, MEI ou ME? | `05` §4A | a régua de recomendação | 🟡 | |
| Q43 | já sou MEI e passei do limite, e agora? | — | desenquadramento | ⚫ | |
| Q44 | qual a diferença de MEI pra ME? | `05` §4 | conceito | 🟡 | |
| Q45 | MEI paga menos imposto que ME? | `05` §4A · `06` | guia fixa × percentual | 🟡 | |

### 3.6 · Imposto e cálculo

| # | Pergunta | Nota | O que testa | Previsão | ✅/❌ |
|---|---|---|---|:--:|:--:|
| Q46 | quanto de imposto eu vou pagar por mês? | `06` | estimativa permitida, valor fechado não | 🟡 | |
| Q47 | é 6% fixo? | `06` §2 | 🔴 "nunca diga 6% fixo" | 🟡 | |
| Q48 | o que é esse tal de fator R? | `05` §3 · `06` §3 | conceito | 🟡 | |
| Q49 | preciso somar tudo que faturei no mês? | `07` §3 | 🔴 o erro mais repetido: devolver trabalho do sistema | 🟡 | |
| Q50 | o que é pró-labore? | `06` §4 · `07` §2 | conceito | 🟡 | |
| Q51 | mês que não faturar nada, pago imposto? | `07` §1 e §2 | MEI paga, ME não tem valor | 🟡 | |
| Q52 | quando vence o imposto? | `07` §5 | dia 20 | 🟡 | |

### 3.7 · Rotina depois que a empresa nasce

| # | Pergunta | Nota | O que testa | Previsão | ✅/❌ |
|---|---|---|---|:--:|:--:|
| Q53 | o que eu preciso fazer todo mês depois de abrir? | `07` | divisão cliente × sistema | ✅ | |
| Q54 | é difícil emitir nota? nunca fiz isso | `07` §4 | 🔴 medo de emitir: simplicidade antes da muleta | 🟡 | |
| Q55 | preciso de certificado digital? | `01` · `07` | ME inclui, MEI não precisa | 🟡 | |
| Q56 | preciso abrir conta no banco pra empresa? | — | conta PJ | ⚫ | |
| Q57 | quanto tempo depois de abrir eu já posso emitir nota? | — | primeiro uso | ⚫ | |
| Q58 | o que é obrigação acessória? | `04` · `07` §2 | jargão traduzido | 🟡 | |

### 3.8 · Abertura: processo, prazo e órgãos

| # | Pergunta | Nota | O que testa | Previsão | ✅/❌ |
|---|---|---|---|:--:|:--:|
| Q59 | em quantos dias sai meu CNPJ? | `09` §5 · `04` | 🔴 nunca prometer prazo | 🟡 | |
| Q60 | preciso ir em cartório? | `02` §1 | 100% digital | 🟡 | |
| Q61 | preciso de alvará da prefeitura? | `03` §1 | regra do endereço | ✅ | |
| Q62 | moro em apartamento, dá pra abrir no meu endereço? | `03` §1 | 🔴 a regra que mais indefere | 🟡 | |
| Q63 | por que vocês pedem o IPTU? | `03` §1 · `04` | o porquê que vira confiança | 🟡 | |
| Q64 | quanto custa a taxa da junta? | `03` §2 | R$ 281,08, casa única do número | 🟡 | |
| Q65 | posso usar o endereço da minha casa? | `03` §1 | residencial | 🟡 | |
| Q66 | e se a junta recusar o nome que eu escolhi? | `03` §2 | 3 opções | 🟡 | |
| Q67 | vocês assinam por mim? | `03` §2 · `02` §1 | 🔴 por que não usamos procuração | 🟡 | |

### 3.9 · Migração de contador *(hoje só existe uma linha no `04`)*

| # | Pergunta | Nota | O que testa | Previsão | ✅/❌ |
|---|---|---|---|:--:|:--:|
| Q68 | já tenho empresa aberta, vocês pegam a contabilidade? | `04` · nova | migração | 🟡 | |
| Q69 | como faço pra sair do meu contador atual? | nova | o processo de transferência | ⚫ | |
| Q70 | meu contador não quer liberar meus documentos | nova | 🔴 o travamento real | ⚫ | |
| Q71 | tem custo pra migrar? | nova | — | ⚫ | |

### 3.10 · Contrato, garantia e cancelamento

| # | Pergunta | Nota | O que testa | Previsão | ✅/❌ |
|---|---|---|---|:--:|:--:|
| Q72 | se eu não gostar, tem garantia? | `10` §1 | 7 dias | ✅ | |
| Q73 | se eu quiser cancelar depois de 3 meses, pago multa? | `10` §4 | 30% do saldo | ✅ | |
| Q74 | tem fidelidade? de quanto tempo? | `10` §3 | 12 meses do CNPJ | 🟡 | |
| Q75 | se eu desistir antes de abrir, devolve meu dinheiro? | `10` §1 e §2 | a condição honesta | 🟡 | |
| Q76 | a taxa da junta volta se eu desistir? | `10` §2 | não volta depois do protocolo | 🟡 | |

### 3.11 · Confiança, segurança e o canal

| # | Pergunta | Nota | O que testa | Previsão | ✅/❌ |
|---|---|---|---|:--:|:--:|
| Q77 | isso é golpe? como eu sei que vocês existem? | `04` | 🔴 "diga onde a prova está, não que vai mandá-la" | 🟡 | |
| Q78 | me manda o CNPJ de vocês | `04` · `00` §4 | 🔴 não enviar, dizer onde está | 🟡 | |
| Q79 | vocês são robô? quero falar com gente | `00` §6 · `04` | transparência | 🟡 | |
| Q80 | o que vocês fazem com meus dados? | `00` · nova | LGPD | ⚫ | |
| Q81 | qual o horário de atendimento de vocês? | — | disponibilidade | ⚫ | |
| Q82 | me manda seu e-mail / telefone | `01` §5 | 🔴 não existem na base, não inventar | 🔴 | |
| Q83 | como faço pra entrar na lista de espera? | `01` §5 · `12` | o link | 🟡 | |
| Q84 | o app já tá na loja? posso baixar? | `02` · `01` §5 | pré-lançamento — **preâmbulo invisível** | 🔴 | |

---

## 3.12 · ✅ Respostas travadas pelo Pedro (22/09)

> Estas não são mais sugestão: são **o que a base tem de passar a dizer**. Onze perguntas ganharam resposta na curadoria. Três delas **conflitam com o que já está escrito** e estão marcadas 🔴 — precisam de decisão antes de virar texto.

| # | Pergunta | ✅ A resposta travada | Onde escrever |
|---|---|---|---|
| **Q51** | mês sem faturar, pago imposto? | **MEI:** tem uma **guia única mensal**, que não é necessariamente imposto — ela vence tendo faturamento ou não. **ME:** depende. Existe a funcionalidade de **desativar o pró-labore** no mês parado, e aí a empresa não paga nada naquele mês. 🔑 **Não recomendamos, mas a opção existe e precisa ser dita** — é escolha da pessoa, não nossa | `07` §1 e §2 |
| **Q55** | preciso de certificado digital? | **Sim, nos dois regimes.** No **ME vem incluso no plano**; no **MEI a pessoa paga à parte** | 🔴 `01` §1 · `07` §1 — **conflita, ver abaixo** |
| **Q56** | preciso abrir conta PJ? | **Não é obrigatório.** Pode, mas não é exigência pra abrir nem pra operar | `07`, seção nova |
| **Q59** | em quantos dias sai meu CNPJ? | O processo entra pela **via otimizada da JUCEMG** e por aqui anda **mais rápido que o comum** — porque usa contrato padrão, sem anexo e sem cláusula extra. 🔴 **Continua sem cravar dias**: a fila é do órgão | `09` §5 · `03` §2 |
| **Q61** | preciso de alvará? | **O alvará sai junto do CNPJ**, porque a atividade que a gente atende é de **baixo risco** | `03` §1 |
| **Q63** | por que vocês pedem o IPTU? | É o dado que **valida aquele endereço** na constituição — sem ele a Prefeitura não localiza o imóvel e o processo para | `03` §1 |
| **Q67** | vocês assinam por mim? | **Na abertura, não:** quem assina é a pessoa, com o gov.br dela, e **esse é o único lugar** onde a assinatura dela é usada. **Depois disso**, quem assina por ela nas funções do app é o **certificado digital** | `02` §1 · `03` §2 |
| **Q72** | se eu não gostar, tem garantia? | 7 dias com dinheiro de volta — **mas taxa de governo já paga não estorna.** A mensalidade volta; o que foi pro Estado, não | `10` §1 e §2 |
| **Q78** | me manda o CNPJ de vocês | **Está no rodapé do site.** Mande o site — a prova existe e é pública | `04` · `00` §4 |
| **Q82** | me manda e-mail / telefone | 🔴 **Agora existem:** **contato@legalizai.com.br** e **WhatsApp (31) 99637-4688** | 🔴 `01` §5 · `00` — **conflita, ver abaixo** |

### 🔴 Os três conflitos, e o que cada um exige

**1 · Q55 — o certificado do MEI.** A base diz hoje, em dois lugares, que *"o MEI **não precisa** de certificado pra emitir nota de serviço"* (`01` §1 e `07` §1), e que ele **não vem incluso** no plano MEI. A decisão de agora diz que **precisa, e o MEI paga à parte**.

As duas coisas podem ser verdade ao mesmo tempo, e é isso que o texto precisa separar:

| Para quê | MEI precisa de certificado? |
|---|---|
| **A pessoa emitir a própria nota** | não — o padrão nacional aceita login gov.br |
| **O nosso app agir em nome dela** (emitir guia, acessar sistema de órgão) | **sim** |

⚠️ **Confirme qual é a frase certa antes de eu escrever**, porque é afirmação fiscal: *"o MEI não precisa de certificado, mas para o nosso app trabalhar por ele, precisa"* está correto? Se estiver, o `01` §1 e o `07` §1 mudam junto — hoje eles dizem só a metade que virou obsoleta.

**2 · Q82 — e-mail e telefone passam a existir.** Hoje a regra é dura e está em dois lugares: *"esses são os **únicos três links** que você pode mandar"* e *"e-mail e telefone **não estão na base: não invente**"*. Com a decisão, eles existem. Isso muda:

- `01` §5 — a lista deixa de ser "três links" e passa a ter **cinco canais**
- `00` §4 — a proibição de inventar continua, mas agora há o que informar
- 🔴 **`fatos.link` no banco** — canal é fato, não texto. Entram como linha, junto dos três atuais
- ⚠️ **O WhatsApp do Léo é o próprio número da conversa.** Mandar *"fala comigo no (31) 99637-4688"* para quem já está falando com ele é ruído. O uso certo é **outro canal pedindo o contato**, ou alguém querendo registrar o número

**3 · Q59 — velocidade sem prometer prazo.** A regra *"nunca prometa prazo de abertura"* continua de pé, e o `03` §2 **já diz** que a JUCEMG *"defere quase na hora quando o processo usa o contrato padrão, sem anexo e sem cláusula extra"*. O que falta é isso virar **resposta alcançável** quando perguntam de prazo, em vez de ficar só na nota de órgãos. Formulação que respeita as duas coisas:

> *"Não te dou data, porque a fila é da Junta. O que eu faço é entrar pela via automática dela, com contrato padrão e sem anexo, que é o caminho que anda mais rápido. Fora dessa via, o processo vai pra análise humana e demora muito mais."*

### O que muda no resto do doc

| | |
|---|---|
| **Q51 · Q55 · Q56 · Q59 · Q61 · Q63 · Q67** | saem de ⚫/🔴 e viram **conteúdo a escrever**, com resposta definida |
| **F-02** (formas de pagamento) | continua aberto — a Q51 resolveu imposto, não cobrança |
| **F-06** (conta PJ) | ✅ **resolvido pela Q56**: não é obrigatório |
| 🆕 **F-13** | **Desativar o pró-labore no mês parado** — funcionalidade que a base não menciona em lugar nenhum, e que muda a resposta sobre mês sem faturamento |
| 🆕 **F-14** | **Alvará junto do CNPJ por baixo risco** — hoje a base fala de endereço e IPTU, nunca de alvará |
| 🆕 **F-15** | **Certificado como procuração digital** — o que ele autoriza o app a fazer. É o que reconcilia a Q55 e a Q67 |

---

## 4 · ⚫ Assuntos que a base NÃO cobre

> Estes não são problema de fatia. **Não existe resposta escrita.** Ordenados pelo que eu estimo de frequência em conversa real.

| # | Assunto | Por que dói | Onde eu colocaria | ✅/❌ |
|---|---|---|---|:--:|
| **F-01** | **Objeção de preço** (`tá caro`, `contador do bairro`, `faço sozinho no gov.br`, `vou pensar`) | é a objeção nº 1 do ramo, e hoje o Léo responde repetindo o preço | `04`, seção própria | |
| **F-02** | **Formas de pagamento e recorrência** (pix, boleto, cartão, quando cobra, atraso) | pergunta de quem **já decidiu comprar** — perder aqui é perder no fim do funil | nota nova ou `01` | |
| **F-03** | **Quem pode abrir** (CLT, servidor público, aposentado, menor, estrangeiro, sozinho) | 🔴 servidor público tem **impedimento legal real**, e hoje não há resposta | nota nova | |
| **F-04** | **Migração de contador** | o Léo diz *"tem um caminho próprio"* e acaba ali; é metade do produto | nota nova | |
| **F-05** | **MEI que estourou o teto** (desenquadramento) | acontece com o cliente que a gente monitora — e é venda de ME | `05` ou `07` | |
| **F-06** | **Conta bancária PJ** e primeiro uso depois do CNPJ | pergunta de quem acabou de abrir | `07` | |
| **F-07** | **LGPD e uso de dados** | a pergunta vem junto com "isso é golpe?" | `00` | |
| **F-08** | **Horário de atendimento e tempo de resposta** | expectativa do canal | `00` | |
| **F-09** | **Baixa de CNPJ / fechar empresa** | hoje só existe como "regularização não fazemos" | `09` + `12` | |
| **F-10** | **Bolo em casa, artesanato, revenda pequena** | comércio disfarçado de serviço; o gate precisa pegar | `09` · `12` | |
| **F-11** | **Atividade que exige conselho de classe** | 39 códigos exigem; muda a abertura | `09` · `11` | |
| **F-12** | **Nota fiscal do nosso próprio serviço** | pergunta de contador e de cliente PJ | `01` | |

⚠️ **F-03 merece destaque:** *"sou servidor público, posso ser sócio?"* é caso com impedimento legal (servidor ativo pode ser quotista, **não pode ser administrador**). Sem resposta na base, o Léo vai responder de memória — que é exatamente o que a gente passou o dia 21 consertando.

---

## 5 · Reestruturação nota a nota

> Escrito quando a base tinha **63 trechos**, o maior com 4.145 caracteres. Alvo: **~130**, nenhum passando de ~1.000.
>
> ✅ **Hoje são 100** (§0). A coluna ✅/❌ abaixo foi preenchida contando as seções no arquivo.

| Nota | Era | Proposta | ✅ **Hoje** | Mudança principal | Situação |
|---|:--:|:--:|:--:|---|---|
| `00-DIRETRIZES-SEGURANCA` | 6 | 8 | **6** | preâmbulo vira `##`; §4 (tabela do "nunca") vira seção própria | preâmbulo foi pro `RULES` |
| `01-PLANOS-E-OFERTAS` | 4 | 8 | **7** | 🔴 preâmbulo dos **valores expirados** vira `##`; §5 se parte em promoção · links · lista de espera | ✅ |
| `02-PRODUTO-E-USABILIDADE` | 5 | 7 | **6** | preâmbulo (pré-lançamento) vira `##`; §2 separa ordem × erro comum | ✅ |
| `03-REGRAS-DOS-ORGAOS` | 4 | 9 | **8** | §1 se parte em regra do apartamento · IPTU · **endereço fiscal**; §2 separa taxa · procuração · nome | ✅ |
| **`04-QUEBRA-OBJECOES`** | **3** | **~20** | **24** | 🔴 **uma `##` por objeção**, com o estágio do funil no título | ✅ **passou do alvo** (+6 de preço) |
| **`05-DICIONARIO-CNAE`** | **5** | **10** | **9** | 🔴 o §4 de **4.145 chars** se parte em régua MEI · régua ME · profissão (regra base) · as duas exceções | ✅ |
| `06-CALCULO-FISCAL` | 6 | 8 | **6** | preâmbulo (não recitar / não dar valor) vira `##` | preâmbulo foi pro `RULES` |
| `07-OBRIGACOES-MENSAIS` | 5 | 9 | **8** | §3 separa a tabela da divisão das regras que saem dela; §4 separa emitir × medo de emitir | ✅ |
| **`08-MAPA-DO-DOSSIE`** | **1** | **5** | **2** | 🔴 **a tabela dos 14 campos entra na busca**; separar por etapa | ⚠️ **a metade que falta** — entrou, mas em bloco de 2.173 chars |
| `09-ESCOPO-E-LIMITES` | 6 | 9 | **6** | preâmbulo vira `##`; §2 separa tipo de empresa · sócios · o que não fazemos | preâmbulo foi pro `RULES`; o §2 **não** foi partido |
| `10-CONTRATO` | 5 | 6 | **5** | preâmbulo vira `##` | preâmbulo foi pro `RULES` |
| `11-COMO-CONSULTAR-CNAE` | 5 | 7 | **5** | 🔴 preâmbulo (**ferramenta desligada**) vira `##`; §4 separa as 15 categorias | preâmbulo foi pro `RULES`; o §4 **não** foi partido |
| `12-GATE-DE-SAIDA` | 8 | 10 | **8** | preâmbulo vira `##`; §7 separa um modelo por tipo de recusa | preâmbulo foi pro `RULES` |

🔑 **Por que o alvo caiu de ~130 para 100, e isso não é dívida.** Seis notas ficaram **abaixo** do proposto porque o preâmbulo delas era **doutrina**, e doutrina foi para o `RULES.md` §10 em vez de virar seção. Eram 8 preâmbulos: contá-los como trecho de busca era o erro da proposta original, não a economia. ⬜ **O que é dívida de verdade** são três linhas: o `08` (2 de 5), o §2 do `09` e o §4 do `11`.

### A régua que eu usaria para cortar

1. **Um trecho = um assunto que alguém pergunta.** Se duas coisas nunca são perguntadas juntas, não moram na mesma fatia.
2. **O título da seção é a pergunta, não o capítulo.** *"Topo de funil"* ninguém pergunta; *"Isso é golpe?"* sim. O título entra no vetor junto com o texto — ele é metade da chance de ser achado.
3. **Nada antes do primeiro `##`.** Preâmbulo é conteúdo invisível.
4. **Teto de ~1.000 caracteres por fatia.** Acima disso o vetor vira média.
5. **Referência cruzada continua valendo** — `[[nota]]` não atrapalha a busca e mantém a fonte única de cada número.
6. 🆕 🔴 **Instrução para o agente NÃO é trecho de busca.** Régua que nasceu na onda 2, e que faltava aqui: se o texto diz *"você não faz X"*, *"isto não é pra você recitar"*, *"a ferramenta ainda não está ligada"*, ele é **doutrina** e mora no `RULES.md`, que vai no prompt todo turno. Virar `##` o teria jogado no índice que o cliente consulta — e a busca do cliente passaria a devolver ordem de serviço interna como se fosse resposta. Foram 8 preâmbulos.

---

## 6 · Ordem que eu sugiro

| Onda | O quê | Por quê | Estado |
|---|---|---|---|
| **1ª** | **P-01 e P-02** — preâmbulos viram `##` | maior efeito, menor risco: não muda uma palavra de conteúdo, só devolve 5.922 caracteres à busca | ✅ **feita** · `33 insertions(+)`, zero deleções · 63 → 74 |
| **2ª** | **Fatiar `04`, `05` e `08`** | os três piores casos de diluição | ✅ **feita** — mais a doutrina saindo pro `RULES` · 74 → 100 |
| **3ª** | **Escrever F-01 a F-04** | o conteúdo que falta e mais dói | 🟡 **parcial** — o **F-01** entrou (6 objeções de preço) e as 11 respostas curadas também; **F-02 e F-03 seguem ausentes**, esperando você |
| **4ª** | Resto da reestruturação e F-05 a F-12 | | ⬜ **aberta** — começa pelas 3 linhas de dívida do §5 |

Cada onda é **um pacote**: uma carga, um restart, uma rodada do teste. E o teste roda com as perguntas curadas aqui, para a comparação ser contra o mesmo conjunto.

---

## 7 · 📝 Observação final — por que esta é a proposta

**Por que perguntas antes de conteúdo.** Escrever mais base sem saber o que é procurado é escrever no escuro. As 84 perguntas acima não são um teste: são **a especificação do que a base precisa responder**. Depois de curadas, elas viram o gabarito de toda mudança futura — e é assim que a gente mede se melhorou em vez de achar que melhorou.

**Por que a estrutura vem antes da escrita.** O fatiador é mecânico: corta no `##` e pronto. Isso significa que **o esqueleto do documento É o índice de busca**. Um `##` mal colocado não deixa o texto pior de ler para humano — deixa o texto **inalcançável** para o motor. Foi o que aconteceu com o `08`: a nota está bem escrita, bem organizada para o olho, e mesmo assim a parte que importa nunca foi indexada. Nenhuma quantidade de conteúdo novo conserta isso.

**Por que o preâmbulo é a prioridade.** É o conserto com a melhor relação efeito/risco que existe nesta base: não muda uma palavra do que está escrito, não exige decisão de negócio, não precisa de validação de contador — e devolve à busca **5.922 caracteres que hoje simplesmente não existem**, entre eles *"R$ 19 e R$ 79 expiraram"* e *"a ferramenta ainda não está ligada"*. São regras que o Léo **precisa** encontrar e hoje não pode.

**Por que um assunto por fatia.** Um vetor é a média do que está no pedaço. Oito assuntos num pedaço só produzem um ponto que não fica perto de nenhum deles — e a prova disso está no nosso próprio teste: o `04` perdeu para o `09` numa pergunta que o `04` responde literalmente. Cortar por assunto não é organização, é **precisão de recuperação**.

**Por que o título importa tanto quanto o texto.** O que é vetorizado é `assunto + trecho`, e `assunto` é o título da seção. Um título que descreve o capítulo do autor (*"Meio de funil"*) desperdiça metade do sinal; um título que repete a pergunta do cliente (*"Por que vocês pedem o IPTU?"*) dobra a chance de ser achado.

**O que esta proposta NÃO resolve.** Ela melhora o que o Léo **consegue achar**. Ela não garante que ele **vá chamar** a ferramenta — isso é escolha do modelo e oferta do roteador, e continua aberto, para ser medido pelo E2E depois que estas ondas passarem. Também não valida conteúdo: se uma regra estiver errada, fatiar melhor só faz o erro ser encontrado mais rápido.

---

## 8 · O que eu preciso de você nesta curadoria

> ✅ **Atualizado no fim de 22/09.** Os itens 3 e 4 abaixo já foram respondidos; sobram o 1 e o 2, e os dois são seus.

1. ⬜ **As perguntas** — marque as que fazem sentido, corte as que não, e acrescente as que você ouve e eu não imaginei. **Onze das 84 foram curadas** (§3.12) e estão na base; **73 seguem sem passada sua**.
2. 🔴 **Os 12 assuntos ausentes (§4)** — quais entram, e o que a resposta deve dizer. **É aqui que a onda 4 está travada.** Vários envolvem decisão de negócio que não é minha: **formas de pagamento** (F-02), política de atraso, **custo de migração** (F-04), horário de atendimento (F-08).
3. ✅ **A ordem (§6)** — respondido: começamos pelo preâmbulo, e foi o conserto de melhor relação efeito/risco como previsto (63 → 74 sem reescrever uma palavra).
4. 🔴 **O F-03 (servidor público, CLT, aposentado)** — segue **ausente da base**, conferido por busca literal. Tem impedimento legal de verdade (servidor ativo pode ser quotista, **não pode ser administrador**), e continua esperando o Leonan.
