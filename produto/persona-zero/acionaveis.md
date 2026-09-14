---
tipo: hub
status: vivo
dominio: produto
data: 2026-09-14
assunto: persona-zero
tags: [produto, persona-zero, acionavel, pendencia]
---

# 🎯 Acionáveis da varredura cronológica

> **O que esta nota é:** a saída prática do estudo da persona zero ([[constituicao]]). Cada achado que **exige ação** vira uma linha aqui, com **dono** e **tipo**. Achado que só informa fica na evidência e não sobe.
>
> **Tipos:** 🔨 **adaptar** (mexe em código ou dado nosso) · ⚖️ **decidir** (escolha de produto/negócio) · ❓ **perguntar** (precisa de pessoa — espelhado em [[fila-validacao-humana]]).
>
> 🔒 **Fora daqui, de propósito:** capital R$10.000, natureza SLU, metragem 20 m² e o rótulo "RG" são **decisões travadas** (Pedro, 14/09), não pendências. Não reabrir.

---

## 🗓️ As duas datas de nascimento da empresa

**O fato:** o contrato foi assinado em **11/12/2025**, a Junta registrou em **12/12/2025**, e o Termo de Autenticação diz *"Efeitos do registro: **11/12/2025**"*. A Cláusula Quarta fixa início de atividades em **11/12**; o Cartão CNPJ traz abertura em **12/12**. **Duas datas, ambas corretas, para coisas diferentes.**

**O mecanismo:** levado a registro dentro do prazo legal (~30 dias da assinatura), os efeitos **retroagem** à assinatura; fora do prazo, valem só do despacho. 🕓 A base legal exata **não foi confirmada** — é pergunta pro Ademar, não dedução.

| | Item | Tipo | Dono |
|:--:|---|:--:|---|
| D1 | **Guardar as DUAS datas como campos distintos** (`dataAssinatura` e `dataRegistro`). Hoje o C7 grava só *"data de assinatura = dia do preenchimento"*, e o handoff pro dev não pede a segunda | 🔨 adaptar | Pedro + dev |
| D2 | **Decidir qual data alimenta cada cálculo**: 1º DAS, competência inicial, os 12 meses de RBT12, os 13 meses de Fator R, o aniversário do certificado | ⚖️ decidir | Pedro + Mauro |
| D3 | **Contar o relógio dos ~30 dias.** Se o cliente demora a assinar e o processo fica parado, os efeitos deixam de retroagir. O app precisa saber avisar | 🔨 adaptar | dev |
| D4 | **Qual a base legal da retroação e qual o prazo exato?** | ❓ perguntar | **Ademar** |

🔑 **Por que agora:** no caso do Pedro as duas datas caíram no mesmo mês e ninguém sentiu. O problema aparece na virada: assina **30/11**, registra **02/12** → início de atividades em novembro e CNPJ em dezembro, com uma competência que tem obrigação e ainda não tem CNPJ. **É barato agora, caro depois.**

---

## 📜 As quatro cláusulas do contrato padrão

### C-9/10 · O "fecha o ano" societário
Exercício encerra **31/12**; o administrador presta contas com **inventário + balanço patrimonial + balanço de resultado**; os sócios têm **4 meses** (até 30/04) para deliberar.

| | Item | Tipo | Dono |
|:--:|---|:--:|---|
| L1 | **É obrigação societária, não fiscal** — e nosso mapa só tem as fiscais (DAS, DEFIS, DARF). Existe em paralelo e não está em nenhuma das 8 categorias | ⚖️ decidir | Pedro |
| L2 | **Para ME unipessoal, a aprovação de contas precisa de ata registrada ou basta o registro contábil?** Com 2+ sócios vira ato formal | ❓ perguntar | **Mauro** |

🔗 Amarra com a **Carta de Responsabilidade** (CFC 1.590/2020) e com a **ata até 31/01/2026 que isenta o lucro acumulado** (Lei 15.270/2025) — deliberação de sócios já apareceu como instrumento que vale dinheiro.

### C-13 · O pró-labore é FACULTATIVO no contrato
*"Os sócios **poderão**, de comum acordo, fixar uma retirada mensal a título de 'pro labore'."* O e-mail educativo da líder diz *"é obrigatório"*. As duas convivem: **o contrato não obriga, a legislação previdenciária puxa** quando há trabalho do sócio.

| | Item | Tipo | Dono |
|:--:|---|:--:|---|
| L3 | **O app FORÇA definir pró-labore no dia 1, ou aceita "ainda não vou retirar"?** ⚠️ Não pagar **trava o numerador do Fator R** (regime de caixa) — é legítimo no começo e caro depois | ⚖️ decidir | Pedro |
| L4 | **Qual o risco real de ficar meses sem pró-labore no início, e qual a tese que o escritório usa hoje?** | ❓ perguntar | **Mauro** |

🔑 **Explica o caso real:** a persona zero passou dez/jan/fev **sem pró-labore nenhum**, e só começou em março. Contratualmente, nada a obrigava.

### C-11 · A declaração de ME está assinada DENTRO do contrato
O sócio declara que a receita bruta anual **não excederá o limite de ME** (LC 123, art. 3º, I) e que **não se enquadra nas hipóteses de exclusão** do §4º.

| | Item | Tipo | Dono |
|:--:|---|:--:|---|
| L5 | **Estourar o teto não é "mudar de faixa": contraria declaração do contrato social** e exige **alteração contratual** para virar EPP. O aviso de teto deixa de ser informativo e ganha consequência nomeada | 🔨 adaptar | Pedro + dev |

🔗 É exatamente o **desenquadramento R$139** já previsto na nossa minuta. E reposiciona o enquadramento: não é só o **evento 315** na capa do processo, é **declaração assinada pela pessoa**.

### C-15 · O administrador declara que não está impedido
Declaração, sob as penas da lei, de ausência de condenação criminal que impeça administrar (crime falimentar, peculato, contra o sistema financeiro, contra relações de consumo…).

| | Item | Tipo | Dono |
|:--:|---|:--:|---|
| L6 | 🔴 **Nosso flow nunca pergunta isso, e a pessoa assina mesmo assim.** Se houver impedimento, ela assina declaração falsa — e o processo pode ser rejeitado **depois do pagamento**. Resolve com um **checkbox de ciência** no C1 ou na revisão; não precisa ser pergunta invasiva | 🔨 adaptar | dev |

🔑 **É o mais barato dos seis e o de melhor relação custo/risco.** Uma linha de texto tira o problema do nosso colo.

---

## ⚠️ Um item impreciso que sobrou

| | Item | Tipo | Dono |
|:--:|---|:--:|---|
| X1 | **O contrato padrão tem 16 cláusulas, não 15.** Nossos docs dizem 15 em três lugares (`dados-coletados-abertura-ate-viabilidade`, `handoff-dev-2026-09-01`, `conferencia`) | 🔨 adaptar | — |

---

## 📊 Do balanço patrimonial (14/09)

| | Item | Tipo | Dono |
|:--:|---|:--:|---|
| B1 | 🔴 **Conciliação bancária: temos ou não?** Sem extrato o balanço é competência pura — no líder, a receita inteira fica "a receber", o pró-labore inteiro fica "a pagar" e o caixa vai a **−5.012,83**. ⚠️ O caminho perigoso é o do meio: exibir "Caixa" e "Lucro disponível" só por competência produz cliente sacando lucro que não existe | ⚖️ decidir | **Pedro + Mauro** |
| B2 | **Fator R não pode zerar em 1º de janeiro.** Provado: os R$100 de dez/2025 estão no numerador (16.564 ÷ 43.910 = 37,72%) e fora da DRE de 2026 (16.464 = 37,49%). Janela é de **13 meses cruzando o exercício** | 🔨 adaptar | dev |
| B3 | **Pró-labore se modela em 3 contas:** bruto no custo, **11% de INSS** na retenção, **líquido** na obrigação (`16.464 × 11% = 1.811,04` exato). É o desenho a copiar | 🔨 adaptar | dev |
| B4 | **"Você pagou R$ X de multa este ano"** — a conta de multas e juros existe no livro e **nenhuma tela do líder mostra**. Funcionalidade nomeada, e é INFORMAR, não tutelar | ⚖️ decidir | Pedro |
| B5 | **O sinal do saldo:** `saldoExercicio = crédito − débito` sempre, ignorando a natureza da conta. Na nossa API isso se decide de propósito — ou vem na convenção contábil, ou o nome do campo diz que é `creditoMenosDebito` | 🔨 adaptar | dev |
| B6 | **Relatório contábil é geração assíncrona** (`PENDENTE/PROCESSANDO/GERANDO_ARQUIVO`), não consulta. A tela precisa de estado de espera de verdade | 🔨 adaptar | dev |
| B7 | **De onde vieram os R$15,90 a mais em mai/jun/jul?** Três meses a R$210,90 em vez de R$195, e depois volta. Serviço avulso? Reajuste revertido? | ❓ perguntar | **Pedro** |
| B8 | 🔴 **A empresa pagou R$229,85 de multa e juros entre abril e junho** e isso não apareceu em tela nem e-mail nenhum. Vale saber qual guia atrasou e por quê | ❓ perguntar | **Pedro** |

---

## 🔴 O que segue aberto do estudo (fora deste bloco)

| Item | Onde |
|---|---|
| **Objeto social: encurtar o template** — o real é só `CONSULTORIA EM PUBLICIDADE`, e o nosso erra por excesso nas duas pontas; o bug da lista vazia mora aí | [[2026-09-13-contrato-social-persona-zero]] §2 |
| **Quem assina o Termo de Compromisso do Alvará** — o cliente ou nós? Decisão de risco, não de UX | [[2026-09-13-documentos-municipais-da-abertura]] §1 |
| **A largura da nossa procuração e-CAC** | [[2026-09-13-ecac-procuracao-e-caixa-postal]] |
| **Espelhar o DTE no app** — "a Receita te escreveu" | idem |
| **Renovação do Alvará (15/12/2030) e do certificado (22/12/2026)** — ciclo longo sem vigia | [[2026-09-13-documentos-municipais-da-abertura]] §6 |
| **Alteração cadastral tem prazo de 30 dias e multa** (Decreto Municipal 17.175/2019) | idem |

## Links
[[constituicao]] · [[2026-09-14-balanco-patrimonial-serie-mensal]] · [[2026-09-13-contrato-social-persona-zero]] · [[fila-validacao-humana]] · [[decisoes-marca]] · [[HOME]]
