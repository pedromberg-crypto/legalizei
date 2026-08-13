---
tipo: derivado
status: vivo
data: 2026-08-13
assunto: pitch-investidor
deriva_de: [roteiro-escalada-mercado]
tags: [marca, copy, video, narracao, tts, elevenlabs]
---

# 🎧 Narração ElevenLabs — Multilingual v2

> Adaptação de [[roteiro-escalada-mercado]] (v3) pro modelo **ElevenLabs Multilingual v2**, que é o escolhido. Texto pronto pra colar, sem mudar 1 palavra da copy aprovada.
>
> **Multilingual v2 não lê audio tag.** Nada de `[confident]` ou `[serious]`: ele fala o colchete em voz alta. Toda a expressão aqui vem de **pontuação, quebra de parágrafo e `<break time>`**, que é o que esse modelo entende.
>
> ⚠️ Se uma palavra mudar no roteiro-fonte, muda aqui também, nunca o contrário.

---

## 🔴 Antes de tudo: a voz da lista é o maior risco da peça

As 5 vozes do print (**Brittney, Ashwin, Jessica, Erin, Jennifer**) são vozes **de língua inglesa**. O Multilingual v2 fala português com elas, mas o sotaque de origem vaza, e vaza exatamente onde dói: *Belo Horizonte*, *milhões*, *vírgula*, *contabilidade*.

Numa peça pra investidor brasileiro, sotaque americano contando o mercado brasileiro **custa credibilidade antes do primeiro número**.

**O que fazer antes de gastar teste:** abrir **"Exibir mais"** e filtrar a Voice Library por **português / português brasileiro**. Procurar voz masculina ou feminina **BR nativa**, com descrição de narração/documentário. Só depois disso escolher entre as 5 do topo.

Se por algum motivo travar nas 5: teste **todas** com o mesmo trecho e escolha pelo bloco do meio, nunca pela abertura. Sotaque some em frase curta e aparece em frase longa.

---

## Configuração recomendada (os 5 controles do print)

| Controle | Está em | **Sugestão** | Por quê |
|---|---|---|---|
| **Velocidade** | 1x | **0,9x** | um tico mais lenta dá gravidade e ajuda a encaixar nos beats. Se aparecer artefato metálico, volta pra 1x e resolve o ritmo na edição |
| **Estabilidade** | 50% | **45%** | v2 não tem tag, então a variação de emoção precisa vir daqui. Abaixo de 35% começa a oscilar entre blocos e você perde a consistência |
| **Similaridade** | 75% | **75%**, sem mexer | é o ponto de equilíbrio. Acima de 85% ele copia junto os defeitos da amostra original (chiado, respiração estranha) |
| **Estilo exagerado** | 0% | **0%**, e só sobe se vier chapado | em v2, estilo alto puxa a entonação de volta pro idioma de origem da voz, que é o problema que a gente já está tentando evitar. Teto de 15% |
| **Reforço de alto-falante** | ligado | **manter ligado** | melhora a fidelidade à voz escolhida, sem custo perceptível aqui |

### O que muda na direção por causa do v2

Sem tags, **a escalada emocional não nasce no TTS. Ela nasce no mix.** A locução entrega um take firme e parelho; quem faz a peça crescer é a trilha subindo, o corte acelerando e o nível da voz abrindo alguns dB a cada bloco. Não fique tentando arrancar do modelo uma escalada que ele não sabe fazer sozinho: você vai queimar crédito e voltar pro mesmo lugar.

### Regras de geração

1. **Corpo inteiro numa tirada só.** Picotar por frase faz cada pedaço voltar ao tom neutro.
2. **Fecho em take separado** (seção própria mais abaixo).
3. **Pausa longa é edição, não TTS.** Aqui só tem pausa de 0,6s a 1,0s. Break comprido no v2 costuma vir com respiração ou ruído no meio.
4. **Nada de CAPS pra dar ênfase.** O v2 pode soletrar ou gritar. Ênfase se faz com pontuação e com o corte.

---

# Proposta 1 · A ESCADA · ~78s

```
Agora, enquanto você assiste isso, alguém no Brasil está abrindo uma empresa.

<break time="0.7s" /> Ela não sabe qual imposto vai pagar. Não sabe se escolheu o código certo. E vai descobrir isso um ano depois... quando não dá mais pra corrigir.

<break time="1.0s" /> E não é uma pessoa. São sete milhões e quatrocentas mil empresas no Simples Nacional, vivendo exatamente assim.

<break time="0.8s" /> Sabe quanto o maior aplicativo contábil do país atende disso?

<break time="0.6s" /> Zero vírgula sete por cento. Menos de uma em cada cem.

<break time="0.9s" /> O resto está com planilha, caderno, ou um contador que olha a empresa uma vez por ano.

<break time="0.8s" /> Vamos começar por Belo Horizonte, a terceira capital que mais abre empresa no país, onde uma empresa nasce em onze horas. Se funcionar no lugar mais rápido do Brasil, funciona em qualquer lugar.

<break time="0.7s" /> Vinte e dois anos de contabilidade de verdade por baixo. Um produto novo por cima. E estamos prontos para ser o maior aplicativo contábil do Brasil.
```

---

# Proposta 2 · LOOPS ABERTOS · ~83s

O que faz esta peça funcionar é o **silêncio depois de cada pergunta**. As três pausas de 1 segundo abaixo não são enfeite: são o gancho. Se precisar cortar tempo, corte em outro lugar.

```
Uma pergunta. Quantas empresas brasileiras vivem hoje no Simples Nacional?

<break time="1.0s" /> Sete milhões e quatrocentas mil.

<break time="1.0s" /> Outra pergunta. Quanto disso o maior aplicativo contábil do país atende?

<break time="1.0s" /> Zero vírgula sete por cento. Menos de uma em cada cem.

<break time="1.0s" /> Então onde estão as outras noventa e nove?

<break time="1.0s" /> Planilha. Caderno. Um contador que olha a empresa uma vez por ano. Gente pagando imposto a mais, sem nunca saber.

<break time="0.8s" /> A gente está construindo o contrário disso. Preço fechado, contador de verdade desde o primeiro plano, e um app que olha o seu número todo mês, não uma vez por ano.

<break time="0.8s" /> E onde vamos começar? Por Belo Horizonte, onde uma empresa abre em onze horas e existem mais de cem mil no nosso perfil.

<break time="0.8s" /> E por que parar aqui?

<break time="0.9s" /> A gente não vai parar. Estamos prontos para ser o maior aplicativo contábil do Brasil.
```

---

# Proposta 3 · A ONDA · ~88s

```
Belo Horizonte abre uma empresa em onze horas. É a abertura mais rápida do Brasil.

<break time="0.7s" /> Na terceira capital que mais abre empresa no país. E a gente não vai começar aqui porque é pequeno. Vai começar porque é o campo de prova mais rápido que existe.

<break time="0.8s" /> Se o produto aguentar a cidade que mais acelera, ele aguenta o país.

<break time="1.0s" /> E o país são sete milhões e quatrocentas mil empresas no Simples Nacional.

<break time="0.8s" /> Com o maior aplicativo contábil do Brasil atendendo zero vírgula sete por cento delas.

<break time="1.0s" /> Esse mercado não está consolidado. Ele ainda está por ser servido.

<break time="0.8s" /> Primeiro Belo Horizonte. Depois Minas. Depois o Brasil inteiro. Mesmo motor, mesmo preço fechado, mesmo contador de verdade atrás. Com vinte e dois anos de contabilidade real por baixo.

<break time="0.8s" /> Não vai ser uma contabilidade de bairro querendo crescer. Vai ser um produto nacional que escolheu onde nascer. E estamos prontos para ser o maior aplicativo contábil do Brasil.
```

---

# O fecho: gerar à parte, 3 versões

É a linha que carrega a marca e a que mais depende de sorte no TTS. Gere as três, ouça em sequência, escolha. Custa quase nada e evita refazer a peça inteira por 2 segundos.

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

⚠️ Esta linha é candidata séria a **voz humana**, gravada por você mesmo. São 2 segundos, é a assinatura da marca, e é justamente onde sotaque de voz importada estraga tudo.

---

## Se algum trecho sair errado na escuta

| Sintoma | O que tentar |
|---|---|
| Sotaque forte em "Belo Horizonte" | trocar a voz antes de qualquer outra coisa. Se insistir, testar a grafia fonética `Bélo Orizonti` **só nesse trecho**, e voltar a grafia normal depois |
| "Zero vírgula sete por cento" arrastado | separar em duas frases: `Zero vírgula sete.` / `Por cento.` e juntar na edição |
| Números soando como algarismo | conferir se está tudo por extenso no texto colado (o modelo lê melhor assim em PT) |
| Take chapado, sem escalada | baixar Estabilidade pra 40%, e só depois considerar subir Estilo pra 10% |
| Take oscilando de tom entre blocos | subir Estabilidade pra 55% e construir a escalada no mix |
| Respiração ou ruído dentro da pausa | encurtar o `<break>` e fazer a pausa real na edição |

## Checklist

- [ ] Procurar voz **PT-BR nativa** em "Exibir mais" antes de usar as 5 do topo
- [ ] Testar as vozes candidatas com o **bloco do meio**, não com a abertura
- [ ] Aplicar config: velocidade 0,9x · estabilidade 45% · similaridade 75% · estilo 0% · reforço ligado
- [ ] Gerar o corpo numa tirada só
- [ ] Gerar as 3 versões do fecho em separado
- [ ] Conferir na escuta: "sete milhões e quatrocentas mil", "zero vírgula sete por cento", "onze horas", "vinte e dois anos", "cem mil", "Belo Horizonte"
- [ ] Anotar a config do take aprovado na tabela abaixo

## Registro dos testes

| Data | Proposta | Voz | Vel. | Estab. | Simil. | Estilo | Veredito |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

## Links
[[roteiro-escalada-mercado]] · [[roteiro-teaser-investidor]] · [[decisoes-marca]] · [[HOME]]
