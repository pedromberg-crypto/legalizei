---
tipo: derivado
status: vivo
data: 2026-08-13
assunto: pitch-investidor
deriva_de: [roteiro-escalada-mercado]
tags: [marca, copy, video, narracao, tts, elevenlabs]
---

# 🎧 Narração ElevenLabs — os 3 roteiros prontos pra colar

> Adaptação de [[roteiro-escalada-mercado]] (v3) pra síntese de voz. O texto é **o mesmo**, o que muda é a marcação: números por extenso, pausas explícitas e sinalização de entonação.
>
> ⚠️ **Nada aqui altera a copy aprovada.** Se uma palavra mudar no roteiro-fonte, muda aqui também, nunca o contrário.

---

## Antes de gerar: 4 coisas que decidem o resultado

**1. Escolha o modelo primeiro, porque a marcação muda com ele.**

| Modelo | Aceita `[tag]` de emoção | O que usar |
|---|---|---|
| **Eleven v3** | sim | **Variante A** (com tags) |
| **Multilingual v2 / Turbo / Flash** | **não** | **Variante B** (só pontuação e `<break>`) |

🔴 **Teste obrigatório antes de gerar a peça inteira:** cole só a primeira frase com uma tag e ouça. Se a voz **falar "colchete confident"**, o modelo não suporta tags: use a Variante B. É o erro mais comum e queima crédito à toa.

**2. Números sempre por extenso.** "7,4 milhões" e "0,7%" saem imprevisíveis em português. Aqui já estão escritos como se fala: *sete milhões e quatrocentas mil*, *zero vírgula sete por cento*, *onze horas*, *vinte e dois anos*.

**3. Pausa longa é trabalho de edição, não de TTS.** Deixei no texto só pausas curtas (0,3s a 1,0s). O **silêncio dramático antes do fecho** não está marcado de propósito: gere o *"Vai, legaliza aí"* como **take separado** e monte o intervalo na timeline. Break longo no TTS costuma vir com respiração ou ruído no meio, e essa é a linha mais importante da peça.

**4. Gere a peça inteira numa tirada só** (menos o fecho). A voz mantém prosódia dentro de uma mesma geração; picotar em frases faz cada pedaço voltar ao tom neutro e a escalada morre.

### Configuração sugerida pra este tipo de peça

| Parâmetro | Sugestão | Porquê |
|---|---|---|
| Voz | masculina PT-BR, grave, com peso. Testar 2 ou 3 | é institucional épico, não locução de varejo |
| Stability | média (v3: *Natural*) | baixa demais oscila entre blocos, alta demais mata a escalada |
| Similarity | alta | mantém a voz igual do começo ao fim |
| Style / exagero | baixo a médio | a trilha já carrega o épico; voz exagerada vira propaganda de carro |
| Speed | ~0,9 a 0,95 | um tico mais lenta dá gravidade e ajuda o encaixe nos beats |
| Seed | **fixa** | pra reproduzir o take bom depois, em vez de tentar a sorte de novo |

---

# Proposta 1 · A ESCADA

### Variante A · Eleven v3 (com audio tags)

```
[serious] Agora, enquanto você assiste isso, alguém no Brasil está abrindo uma empresa.

<break time="0.7s" /> Ela não sabe qual imposto vai pagar. Não sabe se escolheu o código certo. E vai descobrir isso um ano depois, quando não dá mais pra corrigir.

<break time="1.0s" /> [emphatic] E não é uma pessoa. São sete milhões e quatrocentas mil empresas no Simples Nacional vivendo exatamente assim.

<break time="0.8s" /> [curious] Sabe quanto o maior aplicativo contábil do país atende disso?

<break time="0.6s" /> Zero vírgula sete por cento. [slowly] Menos de uma em cada cem.

<break time="0.9s" /> O resto está com planilha, caderno, ou um contador que olha a empresa uma vez por ano.

<break time="0.8s" /> [confident] Vamos começar por Belo Horizonte, a terceira capital que mais abre empresa no país, onde uma empresa nasce em onze horas. Se funcionar no lugar mais rápido do Brasil, funciona em qualquer lugar.

<break time="0.7s" /> [proud] Vinte e dois anos de contabilidade de verdade por baixo. Um produto novo por cima. E estamos prontos para ser o maior aplicativo contábil do Brasil.
```

### Variante B · Multilingual v2 / Turbo (sem tags)

```
Agora, enquanto você assiste isso, alguém no Brasil está abrindo uma empresa.

<break time="0.7s" /> Ela não sabe qual imposto vai pagar. Não sabe se escolheu o código certo. E vai descobrir isso um ano depois... quando não dá mais pra corrigir.

<break time="1.0s" /> E não é uma pessoa. São sete milhões e quatrocentas mil empresas no Simples Nacional vivendo exatamente assim.

<break time="0.8s" /> Sabe quanto o maior aplicativo contábil do país atende disso?

<break time="0.6s" /> Zero vírgula sete por cento. Menos de uma em cada cem.

<break time="0.9s" /> O resto está com planilha, caderno, ou um contador que olha a empresa uma vez por ano.

<break time="0.8s" /> Vamos começar por Belo Horizonte, a terceira capital que mais abre empresa no país, onde uma empresa nasce em onze horas. Se funcionar no lugar mais rápido do Brasil, funciona em qualquer lugar.

<break time="0.7s" /> Vinte e dois anos de contabilidade de verdade por baixo. Um produto novo por cima. E estamos prontos para ser o maior aplicativo contábil do Brasil.
```

**Take separado do fecho:** ver seção "O fecho" abaixo.

---

# Proposta 2 · LOOPS ABERTOS

As três perguntas são o gancho da peça. O que faz elas funcionarem é a **pausa depois da pergunta**, não a entonação: deixe o silêncio respirar antes da resposta.

### Variante A · Eleven v3 (com audio tags)

```
[curious] Uma pergunta. Quantas empresas brasileiras vivem hoje no Simples Nacional?

<break time="1.0s" /> Sete milhões e quatrocentas mil.

<break time="1.0s" /> [curious] Outra pergunta. Quanto disso o maior aplicativo contábil do país atende?

<break time="1.0s" /> [serious] Zero vírgula sete por cento. Menos de uma em cada cem.

<break time="1.0s" /> [questioning] Então onde estão as outras noventa e nove?

<break time="1.0s" /> Planilha. Caderno. Um contador que olha a empresa uma vez por ano. [serious] Gente pagando imposto a mais sem nunca saber.

<break time="0.8s" /> [confident] A gente está construindo o contrário disso. Preço fechado, contador de verdade desde o primeiro plano, e um app que olha o seu número todo mês, não uma vez por ano.

<break time="0.8s" /> [curious] E onde vamos começar? Por Belo Horizonte, onde uma empresa abre em onze horas e existem mais de cem mil no nosso perfil.

<break time="0.8s" /> E por que parar aqui?

<break time="0.9s" /> [determined] A gente não vai parar. Estamos prontos para ser o maior aplicativo contábil do Brasil.
```

### Variante B · Multilingual v2 / Turbo (sem tags)

```
Uma pergunta. Quantas empresas brasileiras vivem hoje no Simples Nacional?

<break time="1.0s" /> Sete milhões e quatrocentas mil.

<break time="1.0s" /> Outra pergunta. Quanto disso o maior aplicativo contábil do país atende?

<break time="1.0s" /> Zero vírgula sete por cento. Menos de uma em cada cem.

<break time="1.0s" /> Então onde estão as outras noventa e nove?

<break time="1.0s" /> Planilha. Caderno. Um contador que olha a empresa uma vez por ano. Gente pagando imposto a mais sem nunca saber.

<break time="0.8s" /> A gente está construindo o contrário disso. Preço fechado, contador de verdade desde o primeiro plano, e um app que olha o seu número todo mês, não uma vez por ano.

<break time="0.8s" /> E onde vamos começar? Por Belo Horizonte, onde uma empresa abre em onze horas e existem mais de cem mil no nosso perfil.

<break time="0.8s" /> E por que parar aqui?

<break time="0.9s" /> A gente não vai parar. Estamos prontos para ser o maior aplicativo contábil do Brasil.
```

---

# Proposta 3 · A ONDA

A escalada é geográfica, então a voz precisa **subir de energia a cada bloco e nunca voltar**. Se o take vier com o último bloco no mesmo nível do primeiro, regenere: é o defeito típico desta peça.

### Variante A · Eleven v3 (com audio tags)

```
[reflective] Belo Horizonte abre uma empresa em onze horas. É a abertura mais rápida do Brasil.

<break time="0.7s" /> Na terceira capital que mais abre empresa no país. E a gente não vai começar aqui porque é pequeno. [confident] Vai começar porque é o campo de prova mais rápido que existe.

<break time="0.8s" /> Se o produto aguentar a cidade que mais acelera, ele aguenta o país.

<break time="1.0s" /> [emphatic] E o país são sete milhões e quatrocentas mil empresas no Simples Nacional.

<break time="0.8s" /> Com o maior aplicativo contábil do Brasil atendendo zero vírgula sete por cento delas.

<break time="1.0s" /> [serious] Esse mercado não está consolidado. Ele ainda está por ser servido.

<break time="0.8s" /> [confident] Primeiro Belo Horizonte. Depois Minas. Depois o Brasil inteiro. Mesmo motor, mesmo preço fechado, mesmo contador de verdade atrás. Com vinte e dois anos de contabilidade real por baixo.

<break time="0.8s" /> [proud] Não vai ser uma contabilidade de bairro querendo crescer. Vai ser um produto nacional que escolheu onde nascer. E estamos prontos para ser o maior aplicativo contábil do Brasil.
```

### Variante B · Multilingual v2 / Turbo (sem tags)

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

# O fecho: gerar à parte e escolher

É a linha que carrega a marca inteira, e a que mais depende de sorte no TTS. **Gere as três variações, ouça em sequência e escolha.** Custa quase nada e evita refazer a peça inteira por causa de 2 segundos.

```
Vai, legaliza aí.
```

```
Vai! Legaliza aí.
```

```
Vai... legaliza aí!
```

Com tags (v3), testar também:

```
[confident] Vai, legaliza aí.
```

```
[whispers] Vai, legaliza aí.
```

**O que ouvir em cada take:** o peso tem que cair no **AÍ**, que é onde o **AI do wordmark acende em coral**. Se a voz apoiar no "legaliza" e desprezar o final, o take não serve, por melhor que soe. A terceira variação (com reticências) costuma jogar mais peso pro fim.

⚠️ **Se nenhuma sair boa:** esta linha é séria candidata a **voz humana**, gravada até por você mesmo. São 2 segundos, e é a assinatura da marca.

---

## Checklist de produção

- [ ] Testar 1 frase com tag pra confirmar se o modelo suporta (senão, Variante B)
- [ ] Escolher a voz testando o bloco do meio, não a abertura (o meio é onde a peça vive)
- [ ] Fixar a seed do take aprovado e **anotar aqui**
- [ ] Gerar corpo inteiro numa tirada, fecho em take separado
- [ ] Conferir números na escuta: "sete milhões e quatrocentas mil", "zero vírgula sete por cento", "onze horas", "vinte e dois anos", "cem mil"
- [ ] Conferir "Belo Horizonte" (algumas vozes comem o "Belo")
- [ ] Montar os silêncios longos na edição, em cima da trilha, não no TTS

## Registro dos testes

| Data | Proposta | Modelo | Voz | Seed | Veredito |
|---|---|---|---|---|---|
| | | | | | |

## Links
[[roteiro-escalada-mercado]] · [[roteiro-teaser-investidor]] · [[decisoes-marca]] · [[HOME]]
