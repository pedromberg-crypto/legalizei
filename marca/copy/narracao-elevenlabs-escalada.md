---
tipo: derivado
status: vivo
data: 2026-08-13
assunto: pitch-investidor
deriva_de: [roteiro-escalada-mercado]
tags: [marca, copy, video, narracao, tts, elevenlabs]
---

# 🎧 Narração ElevenLabs — Multilingual v2

> Adaptação de [[roteiro-escalada-mercado]] (v3) pro modelo **ElevenLabs Multilingual v2**. Texto pronto pra colar, sem mudar 1 palavra da copy aprovada.
>
> **Marcação por pontuação**, que é o que funciona em qualquer caixa de texto do ElevenLabs: vírgula, ponto, reticência, travessão e quebra de parágrafo. Sem tag XML, sem colchete.
>
> ⚠️ Se uma palavra mudar no roteiro-fonte, muda aqui também, nunca o contrário.

---

## Por que pontuação em vez de `<break time>`

Dois recursos que **este modelo não tem**:

- **Audio tags** (`[confident]`, `[serious]`): só o Eleven v3. No v2 ele **fala o colchete em voz alta**.
- **`<break time="1.0s" />`**: funciona na API e em parte das interfaces, mas **não em todas**. Onde não funciona, ou some, ou vira texto falado ("break time um vírgula zero s"), que estraga o take inteiro.

Pontuação funciona nos dois cenários. Perde controle fino de milissegundo, ganha previsibilidade. E **pausa longa a gente resolve na edição**, que é onde ela deveria estar de qualquer jeito.

### Teste de 10 segundos pra saber o que a tua caixa aceita

Cole isto sozinho e ouça:

```
Zero vírgula sete por cento. <break time="1.5s" /> Menos de uma em cada cem.
```

| O que acontece | Conclusão |
|---|---|
| pausa longa de verdade entre as frases | tua caixa aceita break: pode usar o **apêndice** no fim deste doc |
| a voz fala "break time" | **não** aceita: usa os textos principais abaixo |
| passa direto, sem pausa nenhuma | ignora a tag: usa os textos principais abaixo |

### A gramática de pausa usada nos textos

| Sinal | Efeito na voz | Uso aqui |
|---|---|---|
| `,` | respiro curto | dentro da frase |
| `.` | pausa normal | separando ideias |
| `...` | suspensão, pausa longa e macia | antes de revelação e de golpe emocional |
| ` — ` (travessão entre espaços) | pausa marcada, mais seca que a reticência | isolando aposto e virada |
| linha em branco | maior pausa que o modelo dá sozinho | entre blocos da escalada |

⚠️ **O travessão aqui é instrução de máquina, não copy.** A regra de marca que proíbe travessão vale pro texto que alguém **lê**; este só existe pra ser falado. Não deixe ele vazar de volta pro roteiro-fonte.

Uma ressalva de uso: reticência demais deixa a voz **hesitante e insegura**, que é o oposto de um pitch. Por isso ela aparece pouco, e sempre onde a hesitação é proposital.

---

## Configuração recomendada (os 5 controles do teu print)

| Controle | Está em | **Sugestão** | Por quê |
|---|---|---|---|
| **Velocidade** | 1x | **0,9x** | um tico mais lenta dá gravidade e ajuda a encaixar nos beats. Se aparecer artefato metálico, volta pra 1x e resolve o ritmo na edição |
| **Estabilidade** | 50% | **45%** | sem tags, a variação de emoção precisa vir daqui. Abaixo de 35% começa a oscilar entre blocos |
| **Similaridade** | 75% | **75%**, sem mexer | ponto de equilíbrio. Acima de 85% ele copia junto os defeitos da amostra (chiado, respiração) |
| **Estilo exagerado** | 0% | **0%**, só sobe se vier chapado | estilo alto no v2 puxa a entonação de volta pro idioma de origem da voz. Teto de 15% |
| **Reforço de alto-falante** | ligado | **manter ligado** | melhora a fidelidade à voz escolhida, sem custo perceptível aqui |

### 🔴 O maior risco não é config, é a voz

As 5 vozes do print (**Brittney, Ashwin, Jessica, Erin, Jennifer**) são vozes de **língua inglesa**. O v2 fala português com elas, mas o sotaque vaza exatamente onde dói: *Belo Horizonte*, *milhões*, *vírgula*, *contabilidade*. Numa peça pra investidor brasileiro, isso custa credibilidade antes do primeiro número.

Abra **"Exibir mais"** e filtre a Voice Library por **português brasileiro** antes de gastar teste. Se testar as 5 mesmo assim, compare usando o **bloco do meio**, nunca a abertura: sotaque some em frase curta e aparece em frase longa.

### Regras de geração

1. **Corpo numa tirada só.** Picotar por frase faz cada pedaço voltar ao tom neutro e a escalada morre.
2. **Fecho em take separado** (seção própria abaixo).
3. **As pausas grandes são da edição.** O texto entrega o ritmo; o silêncio dramático você monta na timeline, em cima da trilha.
4. **Nada de CAPS pra dar ênfase.** O v2 pode soletrar ou gritar.
5. Sem tags, **a escalada emocional nasce no mix**, não no TTS: trilha subindo, corte acelerando, nível da voz abrindo a cada bloco. Não queime crédito tentando arrancar do modelo o que é trabalho de montagem.

---

# Proposta 1 · A ESCADA · ~78s

```
Agora, enquanto você assiste isso, alguém no Brasil está abrindo uma empresa.

Ela não sabe qual imposto vai pagar. Não sabe se escolheu o código certo. E vai descobrir isso um ano depois... quando não dá mais pra corrigir.

E não é uma pessoa. São sete milhões e quatrocentas mil empresas no Simples Nacional, vivendo exatamente assim.

Sabe quanto o maior aplicativo contábil do país atende disso?

Zero vírgula sete por cento... Menos de uma em cada cem.

O resto está com planilha, caderno, ou um contador que olha a empresa uma vez por ano.

Vamos começar por Belo Horizonte — a terceira capital que mais abre empresa no país — onde uma empresa nasce em onze horas. Se funcionar no lugar mais rápido do Brasil, funciona em qualquer lugar.

Vinte e dois anos de contabilidade de verdade por baixo. Um produto novo por cima. E estamos prontos... para ser o maior aplicativo contábil do Brasil.
```

---

# Proposta 2 · LOOPS ABERTOS · ~83s

As três pausas depois das perguntas **são o gancho da peça**, e são grandes demais pra confiar na pontuação. Gere esta em **4 blocos separados** e monte os silêncios na edição:

**Bloco 1**
```
Uma pergunta. Quantas empresas brasileiras vivem hoje no Simples Nacional?
```

**Bloco 2**
```
Sete milhões e quatrocentas mil.

Outra pergunta. Quanto disso o maior aplicativo contábil do país atende?
```

**Bloco 3**
```
Zero vírgula sete por cento... Menos de uma em cada cem.

Então onde estão as outras noventa e nove?
```

**Bloco 4**
```
Planilha. Caderno. Um contador que olha a empresa uma vez por ano. Gente pagando imposto a mais, sem nunca saber.

A gente está construindo o contrário disso. Preço fechado, contador de verdade desde o primeiro plano, e um app que olha o seu número todo mês, não uma vez por ano.

E onde vamos começar? Por Belo Horizonte — onde uma empresa abre em onze horas e existem mais de cem mil no nosso perfil.

E por que parar aqui?

A gente não vai parar. Estamos prontos para ser o maior aplicativo contábil do Brasil.
```

> Se preferir gerar tudo de uma vez pra manter a prosódia, cole os 4 blocos seguidos e **corte o silêncio na edição**. Fica melhor que confiar na pontuação pra segurar 1 segundo.

---

# Proposta 3 · A ONDA · ~88s

```
Belo Horizonte abre uma empresa em onze horas. É a abertura mais rápida do Brasil.

Na terceira capital que mais abre empresa no país. E a gente não vai começar aqui porque é pequeno. Vai começar porque é o campo de prova mais rápido que existe.

Se o produto aguentar a cidade que mais acelera, ele aguenta o país.

E o país são sete milhões e quatrocentas mil empresas no Simples Nacional.

Com o maior aplicativo contábil do Brasil atendendo... zero vírgula sete por cento delas.

Esse mercado não está consolidado. Ele ainda está por ser servido.

Primeiro Belo Horizonte. Depois Minas. Depois o Brasil inteiro. Mesmo motor, mesmo preço fechado, mesmo contador de verdade atrás. Com vinte e dois anos de contabilidade real por baixo.

Não vai ser uma contabilidade de bairro querendo crescer. Vai ser um produto nacional que escolheu onde nascer. E estamos prontos para ser o maior aplicativo contábil do Brasil.
```

---

# O fecho: gerar à parte, 3 versões

É a linha que carrega a marca e a que mais depende de sorte no TTS. Gere as três, ouça em sequência, escolha.

```
Vai, legaliza aí.
```

```
Vai! Legaliza aí.
```

```
Vai... legaliza aí!
```

**Critério de escolha:** o peso tem que cair no **aí**, que é onde o **AI do wordmark acende em coral**. Se a voz apoiar em "legaliza" e largar o final, o take não serve, por melhor que soe o resto. A terceira versão costuma jogar mais peso pro fim.

⚠️ Candidata séria a **voz humana**, gravada por você. São 2 segundos, é a assinatura da marca, e é onde sotaque de voz importada estraga tudo.

---

## Se algum trecho sair errado na escuta

| Sintoma | O que tentar |
|---|---|
| Sotaque forte em "Belo Horizonte" | trocar a voz antes de qualquer outra coisa. Se insistir, testar a grafia fonética `Bélo Orizonti` **só nesse trecho**, e voltar a grafia normal depois |
| Voz hesitante demais | tirar uma ou duas reticências. Elas suspendem, mas em excesso soam insegurança |
| Travessão virando pausa longa demais | trocar por vírgula no trecho e recuperar a pausa no corte |
| "Zero vírgula sete por cento" arrastado | separar em duas gerações: `Zero vírgula sete.` e `Por cento.` e juntar na edição |
| Números soando como algarismo | conferir se está tudo por extenso no texto colado |
| Take chapado, sem escalada | baixar Estabilidade pra 40%, e só depois considerar subir Estilo pra 10% |
| Take oscilando de tom entre blocos | subir Estabilidade pra 55% e construir a escalada no mix |

## Checklist

- [ ] Rodar o **teste de 10 segundos** e anotar se a caixa aceita `<break>`
- [ ] Procurar voz **PT-BR nativa** em "Exibir mais" antes de usar as 5 do topo
- [ ] Testar as vozes candidatas com o **bloco do meio**, não com a abertura
- [ ] Aplicar config: velocidade 0,9x · estabilidade 45% · similaridade 75% · estilo 0% · reforço ligado
- [ ] Gerar o corpo numa tirada (ou os 4 blocos, na Loops)
- [ ] Gerar as 3 versões do fecho em separado
- [ ] Conferir na escuta: "sete milhões e quatrocentas mil", "zero vírgula sete por cento", "onze horas", "vinte e dois anos", "cem mil", "Belo Horizonte"
- [ ] Anotar a config do take aprovado na tabela abaixo

## Registro dos testes

| Data | Proposta | Voz | Vel. | Estab. | Simil. | Estilo | Aceita break? | Veredito |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

---

## Apêndice · versão com `<break time>`

**Só use se o teste de 10 segundos confirmar que a tua caixa aceita.** Mesmo texto, com pausa cronometrada em vez de pontuação.

**Escada**
```
Agora, enquanto você assiste isso, alguém no Brasil está abrindo uma empresa. <break time="0.7s" /> Ela não sabe qual imposto vai pagar. Não sabe se escolheu o código certo. E vai descobrir isso um ano depois, quando não dá mais pra corrigir. <break time="1.0s" /> E não é uma pessoa. São sete milhões e quatrocentas mil empresas no Simples Nacional, vivendo exatamente assim. <break time="0.8s" /> Sabe quanto o maior aplicativo contábil do país atende disso? <break time="0.6s" /> Zero vírgula sete por cento. Menos de uma em cada cem. <break time="0.9s" /> O resto está com planilha, caderno, ou um contador que olha a empresa uma vez por ano. <break time="0.8s" /> Vamos começar por Belo Horizonte, a terceira capital que mais abre empresa no país, onde uma empresa nasce em onze horas. Se funcionar no lugar mais rápido do Brasil, funciona em qualquer lugar. <break time="0.7s" /> Vinte e dois anos de contabilidade de verdade por baixo. Um produto novo por cima. E estamos prontos para ser o maior aplicativo contábil do Brasil.
```

**Loops**
```
Uma pergunta. Quantas empresas brasileiras vivem hoje no Simples Nacional? <break time="1.0s" /> Sete milhões e quatrocentas mil. <break time="1.0s" /> Outra pergunta. Quanto disso o maior aplicativo contábil do país atende? <break time="1.0s" /> Zero vírgula sete por cento. Menos de uma em cada cem. <break time="1.0s" /> Então onde estão as outras noventa e nove? <break time="1.0s" /> Planilha. Caderno. Um contador que olha a empresa uma vez por ano. Gente pagando imposto a mais, sem nunca saber. <break time="0.8s" /> A gente está construindo o contrário disso. Preço fechado, contador de verdade desde o primeiro plano, e um app que olha o seu número todo mês, não uma vez por ano. <break time="0.8s" /> E onde vamos começar? Por Belo Horizonte, onde uma empresa abre em onze horas e existem mais de cem mil no nosso perfil. <break time="0.8s" /> E por que parar aqui? <break time="0.9s" /> A gente não vai parar. Estamos prontos para ser o maior aplicativo contábil do Brasil.
```

**Onda**
```
Belo Horizonte abre uma empresa em onze horas. É a abertura mais rápida do Brasil. <break time="0.7s" /> Na terceira capital que mais abre empresa no país. E a gente não vai começar aqui porque é pequeno. Vai começar porque é o campo de prova mais rápido que existe. <break time="0.8s" /> Se o produto aguentar a cidade que mais acelera, ele aguenta o país. <break time="1.0s" /> E o país são sete milhões e quatrocentas mil empresas no Simples Nacional. <break time="0.8s" /> Com o maior aplicativo contábil do Brasil atendendo zero vírgula sete por cento delas. <break time="1.0s" /> Esse mercado não está consolidado. Ele ainda está por ser servido. <break time="0.8s" /> Primeiro Belo Horizonte. Depois Minas. Depois o Brasil inteiro. Mesmo motor, mesmo preço fechado, mesmo contador de verdade atrás. Com vinte e dois anos de contabilidade real por baixo. <break time="0.8s" /> Não vai ser uma contabilidade de bairro querendo crescer. Vai ser um produto nacional que escolheu onde nascer. E estamos prontos para ser o maior aplicativo contábil do Brasil.
```

## Links
[[roteiro-escalada-mercado]] · [[roteiro-teaser-investidor]] · [[decisoes-marca]] · [[HOME]]
