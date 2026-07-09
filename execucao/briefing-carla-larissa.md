---
tipo: briefing
data: 2026-07-09
status: pronto
tags: [compliance, imersao]
---

# 🎤 Briefing — Carla (Pessoal) & Larissa (Fiscal)

> Perguntas que a Izabela encaminhou. Como elas NÃO viram o passo a passo, cada bloco abre com contexto. ICP: **ME prestador de serviço, Simples, sem funcionário, BH.** Detalhe do fluxo: [[2026-07-09-conversa-izabela]].

## 📌 Contexto pra abrir com as duas (30 segundos)
"Estou construindo com o Mauro o **Legalizei** — app de contabilidade digital que automatiza abrir empresa + a rotina fiscal, tipo Contabilizei mas melhor. Mapeei a abertura passo a passo com a Izabela; ela me mandou tirar com vocês algumas dúvidas específicas da área de vocês. É rápido, gravo pra registrar."

---

# 👩‍💼 CARLA — Departamento Pessoal

**Contexto:** na coleta de dados da abertura, um dos campos é "o sócio tem vínculo CLT?" e a nota diz que isso afeta **pró-labore e INSS**. Nosso ICP começa **sem funcionário**, mas o sócio precisa de pró-labore. Quero entender as regras de DP.

1. **Sócio pode ser também contratado CLT da própria empresa?** Existe esse vínculo? O que muda?
   - *Por quê:* apareceu como campo no onboarding; preciso saber se é um cenário real pra tratar no app.
2. **Pró-labore + INSS do sócio:** como funciona, qual a regra/mínimo?
   - *Por quê:* o pró-labore impacta o **Fator R** (que decide o anexo/imposto) — o app vai orientar isso.
3. **eSocial numa ME de serviço SEM funcionário:** precisa transmitir algo? "Sem movimento" transmite mesmo assim?
   - *Por quê:* é uma obrigação acessória; preciso saber se se aplica ao nosso ICP sem funcionário.
4. **Duplo vínculo:** se o sócio já é CLT em outra empresa, isso afeta o pró-labore/INSS dele na nova?
   - *Por quê:* vi isso num comunicado da Contabilizei; quero saber se o app precisa perguntar/tratar.
5. **Quando entra o 1º funcionário**, o que muda no DP (eSocial, FGTS, folha)?
   - *Por quê:* nosso ICP nasce sem funcionário, mas o cliente cresce — quero mapear o próximo passo.

---

# 👩‍💼 LARISSA — Departamento Fiscal

**Contexto:** o Mauro cravou que **"obrigações acessórias" é foco** — as declarações que o contador transmite aos órgãos, mesmo sem imposto extra, e que o cliente nem vê. O app precisa orquestrar isso no back-end. Também tenho dúvidas de anexo/Fator R que a Izabela pediu pra confirmar com você.

1. **Anexos diferentes:** se a empresa tem 2 atividades de anexos diferentes (uma com Fator R, outra não), a Izabela disse que **tributa pela maior** — confirma? Como funciona exatamente?
   - *Por quê:* quero que o app **alerte/explique no onboarding** pra pessoa não escolher errado e pagar imposto a mais (foi a minha própria dor como cliente Contabilizei).
2. **Fator R:** como você orienta o cliente? (os 28% de folha/pró-labore sobre a receita que decidem Anexo III 6% vs V 15,5%). O que o app deveria calcular/mostrar?
   - *Por quê:* é a maior **alavanca de economia** do nosso ICP de serviço.
3. **Obrigações acessórias — a lista REAL pro nosso ICP** (ME serviço Simples, sem funcionário): quais se aplicam e quais NÃO? Pra cada uma: **órgão, periodicidade, prazo e risco de multa.**
   - Candidatas: **DES-BH · DEFIS · DCTFWeb · EFD-Reinf · SPED (ECD/ECF) · eSocial.**
   - *Por quê:* é o back-end invisível que o app precisa orquestrar e lembrar — o coração da camada de compliance.
4. **DES-BH:** periodicidade, prazo, o que trava, e se o cliente precisa ver ou é 100% back-end.
   - *Por quê:* é a declaração municipal de BH — nosso piloto.
5. **DAS:** quem gera hoje — o fiscal na mão ou dá pra automatizar por sistema/API?
   - *Por quê:* a Izabela disse "as meninas geram lá no fiscal"; quero saber se o app pode gerar.
6. **Declaração zerada:** se a empresa não faturou no mês, precisa declarar algo? O quê?
   - *Por quê:* a Izabela mencionou; vira regra de negócio no app.
7. **Acessória estadual (MG):** tem alguma obrigação estadual pra serviço PURO (sem ICMS)?
   - *Por quê:* inscrição estadual é só comércio, mas quero confirmar se há acessória estadual pra serviço.
8. **Onde mora o MAIOR risco de multa** por acessória esquecida?
   - *Por quê:* pra priorizar os alertas/lembretes do app onde mais importa.

---

## Depois (não é com elas)
- **Leonão:** o que o software prepara × o que só o contador transmite/assina.
- **Jessica:** abrir empresa do Mauro em 4 concorrentes (mapear onboarding).

## Links
- [[2026-07-09-conversa-izabela]] · [[processo-abertura-empresa-bh]] · [[spec-mvp-v0]] · [[HOME]]
