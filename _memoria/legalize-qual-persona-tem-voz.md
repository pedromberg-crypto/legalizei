---
name: legalize-qual-persona-tem-voz
description: "25/09 - o elenco do Flutter e fixture de formulario, sem voz; quem tem voz sao as 5 dorsais + 18 volantes de pesquisa/personas-de-mercado."
metadata: 
  node_type: memory
  type: reference
  originSessionId: 12f65b6f-b033-4e22-b604-b0ad37e11175
  modified: 2026-09-26T12:47:17.792Z
---

Existem **cinco** conjuntos de "persona" no vault e eles não se misturam. Para gerar caso de conversa do Léo, o certo é o de marketing.

| Quantas | Onde | O que carrega |
|---:|---|---|
| **2** | `produto/me/` | a **PERSONA** travada (`viver/processos/PERSONA.md`, gerada de `_persona.mjs`, 19 travas) e a **persona zero** (`persona-zero/`, a empresa do Pedro) |
| **18** | `produto/me/viver/motor/vidas/vidas.mjs` | as **vidas** do motor fiscal. Travado 17/09: a persona do motor é só esse arquivo |
| **5 + 18** | `pesquisa/personas-de-mercado/` (+ `volantes/`) | as **dorsais e volantes do marketing** |
| **24** | `test/integracao/pedro_personas/` no repo Flutter | o **elenco de teste** de UI. Spec em `execucao/testes-flutter/personas-entrada-me.md` |

🔴 **O elenco do Flutter NÃO tem personalidade**, e a própria spec define por quê: *"cada persona é um conjunto fechado de valores: o que digitar, o que clicar, e onde ela deve parar"*. É nome, CPF, e-mail `pedromberg+pNN@gmail.com` e ponto de parada. Serve para dirigir tela, não gera frase nenhuma.

✅ **Quem tem voz são as dorsais**, pela seção **"Voz própria — como ELA fala"**, que nasceu de uma correção do Pedro em 26/08: *"a seção acima é o tom da EMPRESA/Léo calibrado pra ela. Esta aqui é a voz DELA MESMA."* Traz registro, jeito de escrever, o que ela digitaria e o tom emocional.

**How to apply:** caso bom é **voz × situação**. A **voz** vem do volante (`b1-cabeleireira`, `a3-designer`, `a5-fotografo-eventos`, `d2-sapateiro`…), a **situação** vem do dossiê (`01-escopo`, `05-fiscal`). O prefixo do volante diz de qual dorsal ele herda a voz.

🔑 **O que isso corrige:** os 5 casos de `casos-cnae.yaml` escritos em 25/09 são situação pura, em frase limpa (*"Sou cabeleireira e tenho meu salão, quanto eu pagaria de imposto no ME?"*). Ninguém escreve assim no WhatsApp, e o Supervisor da nova arquitetura precisa ser testado com a mensagem real: quatro assuntos juntos, sem pontuação de apoio.

⚠️ As dorsais **C, D e E** têm a seção de voz uma vez só, contra duas em A e B: podem estar rasas, e vale conferir antes de gerar caso em cima delas. Ver [[legalize-bancada-pedro-personas]] e [[legalize-persona-unica-vidas-mjs]].
