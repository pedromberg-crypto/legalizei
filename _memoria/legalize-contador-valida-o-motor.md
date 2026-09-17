---
name: legalize-contador-valida-o-motor
description: "16/09 — 1ª validação do motor por contador (Leonan, ~5h, 293k caracteres). 32 itens com veredito, 4 corrigidos contra nós, Bloco E passou 7 de 7"
metadata: 
  node_type: memory
  type: project
  originSessionId: 18d871f7-f68b-4a33-9b45-4de15b38bc7c
  modified: 2026-09-17T02:27:42.323Z
---

**Leonan, contador especializado, ~5h, 3 áudios, 293.345 caracteres lidos 100%.** O briefing de perguntas virou registro validado: **32 itens** — 20 ratificados, **4 corrigidos**, 5 viraram decisão, 3 abertos.

🔑 **O Bloco E (as 7 contas do motor) passou 7 de 7**, com o DAS conferido contra a guia real dele: *"bateu 100% do valor, que é o que eu paguei lá"*.

## 🔴 Os quatro erros que ele achou

1. **Recebe pró-labore quem TRABALHA**, não quem administra formalmente. Derruba o default de 15/09. ⚠️ **O `cru/prolabore.mjs` já dizia o certo desde 13/09** — quem derivou foi o motor. **O desenho de processo sabia antes do código.**
2. **MEI ativo IMPEDE** outro CNPJ. Mas a Receita deixa abrir e desenquadra depois → **avisar, não travar**.
3. **Empresa aberta em dezembro NÃO declara o ano inteiro** — declara da abertura. Estava em "já respondido por pesquisa"; **a pesquisa errou**.
4. **A projeção do 1º mês (receita × 12) só vale se a nota sair no mês da abertura.**

## 🔑 A colisão que ele criou sem querer

Validou no mesmo dia *"paga quem trabalha"* **e** *"dividir meia a meia é o ótimo tributário"*. **Colidem quando só um sócio administra:** concentrar a folha cruza a faixa do IRRF que o rateio evitava.

📌 Folha de **R$5.600**: R$616,00 entre dois · **R$844,86** num só. Abaixo de R$5.000/pessoa, zero.

🔴 **A regra certa cobra mais.** Decisão do Pedro (opção c): aplicar **e mostrar a conta** — `ganhoDeIncluirSocio()`. Pergunta sobre **fato** (*"algum outro sócio também trabalha?"*), nunca sobre conveniência.

## Decisões travadas

**EPP** standby · **CPP** a manobra existe e não fazemos · **1º mês** alerta interno, 15,5% sem reverter · **margem 30%** ratificada com caso dele · **onboarding** pergunta quando começar (**revoga a decisão 36**).

## 🔴 O que NÃO pode ser tocado sem fonte

O **redutor do IRRF**: a régua dele (até 3.500 zera · 3.500-5.000 redutor · **acima de 5.000 sem**) **diverge do motor** e muda a guia de todo cliente acima de R$5.000. Ele hesitou (*"não vou lembrar o certo"*). **Exige a Lei 15.270/2025 literal.**

E **três das quatro mudanças de 2027** (regime de caixa, janela do Fator R pulando um mês, ISS no local da prestação) vieram **só da memória dele**.

⚠️ **A pejotização passou batida** — maior risco declarado do perfil, sem opinião de contador. Virou o item **73**.

**How to apply:** o veredito de cada item está em `_duvidas-contador`; o medido em `_ANTES-E-DEPOIS-do-contador`.

Relacionado: [[legalize-aplicacao-das-decisoes-do-contador]] · [[legalize-motor-fiscal-apurador-existe]] · [[legalize-fator-r-e-retrovisor]].
