---
tipo: marco
data: 2026-09-16
assunto: validacao-do-motor-com-o-contador-e-aplicacao
tags: [execucao, marco, motor-fiscal, leonan, validacao]
---

# 🎙️ 16/09 — O contador valida o motor, e as decisões viram código no mesmo dia

> 🧭 **O que este marco registra.** A primeira validação do motor fiscal por um contador especializado, e a aplicação completa do que saiu dela. Detalhe item a item em [[_duvidas-contador]]; o medido em [[_ANTES-E-DEPOIS-do-contador]].

## O que aconteceu

**~5 horas com o Leonan**, contador especializado. 3 áudios, **293.345 caracteres de transcript lidos 100%**, literais salvos em `reunioes/fontes/`.

O documento que era **briefing de perguntas** virou **registro validado**.

| | |
|---|---:|
| Itens com veredito | **32** |
| ✅ Ratificados | 20 |
| 🔴 Corrigidos contra nós | **4** |
| 🆕 Viraram decisão nova | 5 |
| ⏳ Seguem abertos | 3 |

🔑 **O Bloco E — as 7 contas do motor — passou 7 de 7**, com o DAS conferido contra a guia real dele: *"bateu 100% do valor, que é o que eu paguei lá"*.

---

## 🔒 As decisões travadas pelo Pedro

| | Decisão |
|---|---|
| **EPP** | 🟡 fica em **standby**. A `_persona.mjs` não muda. As observações ficam guardadas porque **baixam o custo de mudar de ideia** |
| **CPP** | ✅ a manobra de somá-la ao numerador **existe e não a faremos**. *"O CPP continuará sendo apenas gerado dentro da guia normal"* |
| **1º mês** | ✅ alerta **interno** + contato humano. Leitura **conservadora**: o mês da constituição fica em 15,5%, sem promessa de reverter |
| **Quem recebe** | ✅ **sócio-administrador**. Cotista nasce sem pró-labore |
| **Concentração** | ✅ opção **(c)**: aplicar a regra **e mostrar a conta**. Pergunta sobre **fato**, nunca sobre conveniência fiscal |
| **Margem** | ✅ **30%**, não os 28% da lei. Ratificado com caso de campo dele |
| **Onboarding** | 🔄 **perguntar** quando começar o pró-labore. **Revoga a decisão 36** |

---

## 🔴 Os quatro erros que ele achou em nós

1. **Quem recebe pró-labore é quem TRABALHA.** Derruba o default de 15/09 (*"todo sócio recebe"*). 🔑 E o `cru/prolabore.mjs` **já dizia o certo desde 13/09** — quem tinha derivado era o motor. **O desenho de processo sabia antes do código.**
2. **MEI ativo IMPEDE** participação em outro CNPJ. O doc dizia o contrário. Mas a Receita deixa abrir e desenquadra depois, então **avisamos em vez de travar**.
3. **Empresa aberta em dezembro NÃO declara o ano inteiro.** Declara da abertura ao 31/12, e o sistema nem aceita data anterior. Estava na tabela de *"já respondido por pesquisa"* — **a pesquisa errou**.
4. **A projeção do 1º mês só vale se a nota sair no mês da abertura.** O motor já fazia certo; a narrativa é que generalizava.

⚠️ E duas linhas da tabela de *"não perguntar de novo"* **caíram**: DEFIS e PGDAS zerado **passaram a gerar multa** em 2026.

---

## 🔑 A colisão que a reunião produziu sem querer

Ele validou **no mesmo dia**:

> *"O cara que efetivamente trabalha é obrigado a ser contribuinte."*
> *"Se eu dividir o pró-labore entre os dois, eu não pago o excesso de imposto de renda."*

**As duas colidem quando só um sócio administra.** Concentrar a folha cruza a faixa do IRRF que o rateio evitava.

📌 Medido: folha de **R$5.600** custa **R$616,00** repartida entre dois e **R$844,86** num sócio só. Abaixo de R$5.000 por pessoa, **zero de diferença**.

🔴 **A regra certa cobra mais.** Por isso a decisão não foi escolher por ele: o `ganhoDeIncluirSocio()` varre todos os arranjos e mostra a conta.

---

## 🔴 A terceira cópia da CPP errada

A leitura refutada em 14/09 estava **viva em `cru/prolabore.mjs` e `processos-data.mjs`** — afirmada como fato, na fonte que **gera** o desenho de processo.

```
13/09  escrita      "a CPP conta no numerador, é pacífico"
14/09  refutada     Res. CGSN 140/2018 art. 26 §2º I 'a' nomeia só o Anexo IV
15/09  1ª cópia corrigida   ← só porque o Pedro mandou conferir
16/09  3ª cópia ainda viva, ensinando o erro
```

🔑 **Sobreviveu por motivo estrutural.** A trava varria só os 4 docs de pendência, porque nasceu para pegar assunto encerrado voltando como **dúvida**. A CPP nunca voltou como dúvida — ela **nunca saiu**, afirmada como **verdade**.

✅ A trava ganhou **segunda varredura**, com regra própria para fontes de desenho, e **prova negativa**.

---

## 📊 O que a aplicação mediu

| | Antes | Depois |
|---|---:|---:|
| Vidas | 16 | **17** |
| Competências | 156 | **162** |
| Invariantes | 32 | **54** |
| Agregação auditada | 142 | **154** |
| Falhas | 0 | **0** |

**Só uma vida mudou de imposto:** a P04, de R$2.930,62 para **R$3.159,48**. A P14 mudou de regra e **não mudou de imposto**.

🔑 **Duas das quatro correções não moveram um centavo** nas 17 vidas. O relatório diz isso em vez de esconder — mostrar só o que mexeu seria mentir por seleção.

---

## ⚠️ O que ficou INTOCADO, e por quê

| | |
|---|---|
| 🔴 **Redutor do IRRF** | A régua que ele descreveu (até R$3.500 zera · 3.500-5.000 redutor · **acima de 5.000 sem redutor**) **diverge do motor**. Ele hesitou — *"aí eu não vou lembrar o certo"* — e isto muda a guia de todo cliente acima de R$5.000. **Exige a Lei 15.270/2025 literal** |
| 🔴 **Três mudanças de 2027** | regime de caixa · janela do Fator R pulando um mês · ISS no local da prestação. **Só da memória dele**, sem norma nomeada |
| 🔴 **Pejotização** | o maior risco declarado do nosso perfil **passou batido** na reunião. Virou o item **73** da fila |

## Links
[[_duvidas-contador]] · [[_ANTES-E-DEPOIS-do-contador]] · [[2026-09-16-tres-conflitos-do-contador-resolvidos]] · [[2026-09-16-leonan-audio-1-bloco-a-e-c]] · [[PENDENCIAS]]
