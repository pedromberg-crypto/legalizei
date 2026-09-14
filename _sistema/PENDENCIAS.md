---
tipo: hub
status: vivo
data: 2026-09-14
assunto: pendencias
tags: [sistema, pendencia, decisao, fila, meta]
---

# ☎️ Tudo que está aberto — a lista de quem chamar

> ⚠️ **Esta nota é uma VISTA, não uma quarta fonte.** Ela reúne num lugar só o que já vive em [[acionaveis]], [[fila-validacao-humana]], `execucao/processos/_persona.mjs` e nas evidências. **A fonte continua sendo cada um deles** — se divergir, quem manda é a origem. Existe porque o Pedro precisa ver a lista inteira para chamar as pessoas certas, e isso estava espalhado em quatro lugares.
>
> **Legenda:** 🔴 **bloqueia** algo hoje · 🟡 **espera pessoa** (não bloqueia, mas trava decisão) · ⚪ **construção nossa**, é só fazer.

---

## 📞 1 · ADEMAR (Junta / registro)

Responde em minutos, e a regra de ouro é **não deduzir regra de órgão** ([[legalize-regra-de-orgao-nao-se-deduz]]).

| | O que perguntar | Por que importa | Fonte |
|:--:|---|---|---|
| 🟡 | **Qual a base legal da retroação dos efeitos do registro, e qual o prazo exato?** O Termo da JUCEMG diz *"Efeitos: 11/12/2025"* para ato registrado em 12/12. A regra dos ~30 dias existe; o artigo não foi confirmado | Decide qual data alimenta o 1º DAS, o RBT12 e o Fator R — e o relógio que o app precisa contar | `D4` |
| 🟡 | **O texto literal da Cláusula 8ª do contrato padrão** (assinatura isolada × conjunta). O que está na nossa tela foi **deduzido** da conversa de 01/09 | É a redação que a pessoa vai assinar de verdade | [[fila-validacao-humana]] |
| 🟡 | **Com 2+ CNAEs, como o contrato lista as atividades?** Não temos caso real para ver a forma | Objeto social de quem tem secundárias. Hoje o template erra por excesso | [[2026-09-13-contrato-social-persona-zero]] |

---

## 📞 2 · MAURO (sócio / contador responsável)

| | O que perguntar / decidir | Por que importa | Fonte |
|:--:|---|---|---|
| 🔴 | **Qual o risco concreto de transmitir pró-labore com a qualificação cadastral PENDENTE?** Na conta real: `FALTA DADOS`, PIS não informado, **9 competências já transmitidas assim** | A DCTFWeb é **confissão de dívida irretratável**. E o cliente não sabe: só aparece no JSON | `S1` |
| 🟡 | **`salarioBaseIRRF` vem ZERO em todas**, inclusive nas de R$3.360 — base declarada zero, em vez de base calculada com imposto zero | Se for campo vazio, nosso motor não pode copiar: a base alimenta eSocial e DCTFWeb | `S7` |
| 🟡 | **A `dataAdmissao` do sócio é 01/12/2025, onze dias antes de a empresa existir.** Escolha ou erro? | É a data que decide a **competência do primeiro pró-labore** | `S8` |
| 🟡 | **A nota diz "Anexo: 5" e declara 6,00% na mesma linha.** Anexo-de-origem × efetivo pós-Fator R? | Se for isso, nossa tela resolve com uma palavra | `C8` |
| 🟡 | **Qual o risco real de ficar meses sem pró-labore no início**, e qual a tese do escritório hoje? | A persona zero passou 3 meses assim. Não pagar **trava o numerador do Fator R** (caixa) | `L4` |
| 🟡 | **ME unipessoal: aprovação anual de contas precisa de ata registrada?** | Decide se vira processo no app ou fica invisível | `L2` |
| 🟡 | **Nosso preço** — hoje `~R$195` é **placeholder FAKE** | N7 e N9. Se virar parcelamento ou +1 plano, muda a **estrutura** das telas | [[fila-validacao-humana]] |
| 🟡 | **Certificado digital: terceirizar (Sete Minas) ou emitir?** E o A1 a R$209–229/ano | N7 e a cláusula do MEI | idem |
| 🟡 | **InfoSimples: preço por consulta e limite de chamadas** (CPF na Receita) | Não estão na página pública. Entra no custo unitário | idem |
| 🟡 | **Flow #2: certificado pro ME sem certificado** — carrega custo/fidelidade extra ou fica incluso? | Pergunta já está na tela (M2); o preço não | idem |
| 🟡 | **Flow #2: cobrar antes do TTRT?** É cobrar por algo que não controlamos | SLA? reembolso? | idem |
| 🟡 | **Reguladas** — decidimos waitlist, o líder **atende** (cobra e pede a carteira depois) | Divergência consciente, vale reavaliar | idem |
| 🟡 | **DAE JUCEMG em disputa desde 09/07**: tabela diz R$268,51, a Izabela cravou R$288 | ⚠️ nunca reconciliado. Aparece na "conta da abertura" (N7) | idem |

---

## 📞 3 · LARISSA (fiscal)

| | O que perguntar | Por que importa | Fonte |
|:--:|---|---|---|
| 🟡 | **Os 7 pontos fiscais** — Fator R meses 2–12 · CPP-no-DAS no numerador · FS12 caixa · citações CFC · lista CNAE · DEFIS · taxas BH | [[perguntas-larissa-fiscal]] | [[fila-validacao-humana]] |
| 🟡 | **Os 91 CNAEs duvidosos**, em 7 baldes com pergunta fechada cada | [[limpeza-260-servico]] | idem |
| 🟡 | **Natureza jurídica: SLU × LTDA** — nossa regra diz "solo→SLU", o CNPJ real do Pedro saiu **LTDA** num caso solo | Se SLU é LTDA de sócio único (206-2), o guard-rail do N15 está errado | idem |
| 🟡 | **Famílias de swap CNAE** — 3 entram limpas; tráfego pago e white-label são de menor confiança | [[cnae-fiscalmente-otimo]] | idem |
| 🟡 | **Pró-labore de R$100 abaixo do mínimo de contribuição** — implicação previdenciária. 🔴 **não copiar antes de ratificar** | Apareceu na conta real e está no motor | [[2026-09-09-contabilizei-guia-imposto]] |

### 📚 Citações a conferir em fonte primária (com ela ou sozinho)

| | O que | Risco |
|:--:|---|---|
| 🟡 | **Resolução CFC "1.590/2020"** (carta de responsabilidade / transferência) | possível **citação trocada** — as refs do próprio Gemini citam CFC 987/2003 e 1493/2015. Usada no flow #2 |
| 🟡 | **"Evento 232"** (Alteração do Contabilista) | conferir no Coletor Redesim oficial |
| 🟡 | **COSIT 17/2021** (FS12 regime de caixa) | o alerta 🟡 do N18 **não deve ser exibido** até verificar |

---

## 📞 4 · ADVOGADA

| | O que | Fonte |
|:--:|---|---|
| 🟡 | **A minuta do nosso contrato ME** (16 cláusulas) foi enviada e aguarda retorno | [[minuta-contrato-me]] |
| 🟡 | **Quem assina o Termo de Compromisso do Alvará** — o cliente ou nós? É decisão de **risco**, não de UX | [[2026-09-13-documentos-municipais-da-abertura]] |
| 🟡 | **A largura da nossa procuração e-CAC** — a do líder é de 5 anos e inclui **confissão de débitos** | [[2026-09-13-ecac-procuracao-e-caixa-postal]] |
| 🟡 | **Aviso prévio de 30 dias** no contrato do líder — comparar com a nossa minuta | [[2026-09-10-contabilizei-contrato-integral]] |

---

## 🧠 5 · PEDRO (decisão de produto e de negócio)

| | O que decidir | Por que agora | Fonte |
|:--:|---|---|---|
| 🔴 | **Informar o PIS na plataforma do líder** — ação na conta dele, não decisão | Qualificação cadastral do eSocial pendente | `S1` |
| 🔴 | **P2.3 — como o lucro entra nos nossos cálculos sem extrato?** ⚠️ **É a única pergunta que trava o gerador de processos** (`PROLABORE.md` sai `aberto`) | O balanço do líder provou o que acontece sem conciliação: receita toda "a receber", pró-labore todo "a pagar", caixa a **−5.012,83** | `B1` · `_persona.mjs` |
| 🟡 | **Conciliação bancária: temos ou não?** ⚠️ O caminho do meio (mostrar "Caixa" e "Lucro disponível" só por competência) **produz cliente sacando lucro que não existe** | É a mesma decisão do P2.3, vista pelo produto | `B1` |
| 🟡 | **Retirada sem lucro apurado vira empréstimo ao sócio?** O líder lança em *Créditos com Pessoas Ligadas* e deixa lá até devolver, **sem bloquear nem avisar** | Resolve sem tutelar — o oposto da trava do Informe. **Vale copiar** | `C1` |
| 🟡 | **Lucro acumulado se mostra sem o porquê?** A DRE real cai **R$5.650,70** entre abril e julho sem nenhuma venda perdida | Painel que mostre "seu lucro" exibe queda que o cliente não causou | `C2` |
| 🟡 | **Cancelamento de nota deixa rastro contábil?** No líder não deixa nenhum | Cliente que pergunta *"cadê a nota 4?"* não acha resposta no relatório que baixa | `C3` |
| 🟡 | **"Você pagou R$X de multa este ano"** entra no produto? | Existe no livro e **nenhuma tela do líder mostra**. R$229,85 em 3 competências | `B4` |
| 🟡 | **O app FORÇA definir pró-labore no dia 1**, ou aceita "ainda não vou retirar"? | Não pagar trava o numerador do Fator R | `L3` |
| 🟡 | **A obrigação societária anual entra no mapa?** (inventário + balanço + 4 meses pra deliberar) | Não está em nenhuma das 8 categorias | `L1` |
| 🟡 | **Prazo de fidelidade** — 12 meses como o líder, ou menos? | [[fila-validacao-humana]] | idem |
| 🟡 | **Promessa quebrada** — o que o produto faz quando o teaser não se cumpre? Hoje o motor só **marca** | idem | idem |
| 🟡 | **`FISCAL.TEASER_PISO = 0.5`** é chute meu, não ratificado | só o modo `swap` do teaser | idem |
| ⚪ | **De onde vieram os R$15,90 a mais em mai/jun/jul** na mensalidade? | Três meses a R$210,90 em vez de R$195, e some depois | `B7` |
| ⚪ | **Qual guia atrasou entre abril e junho**, e por quê? | R$229,85 de multa, 3 competências seguidas | `B8` |
| 🟡 | 🔒 **Confirmar que o repositório é privado** — o vault tem dado pessoal em claro e vai pro GitHub | Perguntei em 13/09 e não foi respondido | — |

---

## 🔨 6 · DEV (só construir, nada a decidir)

Nenhum destes espera pessoa. Entram no handoff.

| | O que | Fonte |
|:--:|---|---|
| ⚪ | Guardar `dataAssinatura` **e** `dataRegistro` como campos distintos | `D1` |
| ⚪ | **Guardar a TERCEIRA data**: admissão do sócio (01/12), que alimenta folha e eSocial | `S2` |
| ⚪ | Contar o relógio dos ~30 dias até o registro | `D3` |
| ⚪ | **Fator R não pode zerar em 1º de janeiro** — janela de 13 meses cruzando o exercício (provado: 16.564 ÷ 43.910 = 37,72%) | `B2` |
| ⚪ | Pró-labore em 3 contas: bruto no custo · 11% INSS na retenção · líquido na obrigação | `B3` |
| ⚪ | Decidir o sinal do saldo: `crédito − débito` ou convenção contábil | `B5` |
| ⚪ | Relatório contábil é **geração assíncrona** — estado de espera de verdade | `B6` |
| ⚪ | Relatório devolve **acumulado do exercício**, nunca o mês isolado | `C4` |
| ⚪ | Balanço e Balancete são **um contrato**, dois modos de exibição | `C5` |
| ⚪ | Modelar o plano de contas a partir das **16 reais**, em português de gente | `C6` |
| ⚪ | Lembrete de vencimento com consequência nomeada | `C7` |
| ⚪ | Exibir pendência de qualificação cadastral como **estado de tela** | `S3` |
| ⚪ | Se a rubrica carrega conta contábil, **alguém confere onde ela caiu** | `S4` |
| ⚪ | `quantidade` não pode ter duas semânticas (30 dias × 11 por cento) | `S5` |
| ⚪ | *"Não houve pró-labore"* ≠ *"não existe folha"* | `S6` |
| ⚪ | **Estourar o teto contraria declaração assinada** no contrato social, e exige alteração contratual | `L5` |
| ⚪ | **Checkbox de ciência** de que o administrador não está impedido (hoje a pessoa assina sem nunca ser perguntada) | `L6` |
| ⚪ | Corrigir **"16 cláusulas, não 15"** em 3 documentos | `X1` |
| ⚪ | **Objeto social: encurtar o template** e tratar a lista vazia (hoje gera *"…podendo também exercer ."*) | [[2026-09-13-contrato-social-persona-zero]] |
| ⚪ | **Espelhar o DTE no app** — "a Receita te escreveu" | [[2026-09-13-ecac-procuracao-e-caixa-postal]] |
| ⚪ | **Vigia de ciclo longo**: Alvará vence 15/12/2030, certificado 22/12/2026 | [[2026-09-13-documentos-municipais-da-abertura]] |
| ⚪ | **Alteração cadastral tem prazo de 30 dias e multa** (Decreto Municipal 17.175/2019) | idem |

---

## 🕓 7 · Sem dono ainda

| | O que | Fonte |
|:--:|---|---|
| 🟡 | 🔴 **"Em breve o acesso ao e-CAC será desativado"** — migração para acesso exclusivo pelo gov.br. **Muda a infraestrutura em que a nossa procuração se apoia** | [[2026-09-13-ecac-procuracao-e-caixa-postal]] §5 |
| 🟡 | **Licenciamento sanitário ESTADUAL** — a dispensa municipal manda verificar na Vigilância estadual e para aí. Caminho não percorrido | [[2026-09-13-documentos-municipais-da-abertura]] |
| ⚪ | `BALANCETE_PERIODO` e `LIST` — tipos de relatório que existem no código do líder e não estão no menu | [[2026-09-14-dre-balancete-razao-diario]] |
| ⚪ | A lista do Razão por conta **não abre**: a URL deles tem `undefined` | idem |

---

## 📊 O placar

| | Quantos |
|---|---:|
| 🔴 **Bloqueiam hoje** | **3** (P2.3 · PIS · risco da qualificação) |
| 🟡 **Esperam pessoa** | 30 |
| ⚪ **Só construir** | 26 |
| **Pessoas a chamar** | **4** — Ademar · Mauro · Larissa · advogada |

🔑 **A leitura:** quase nada está bloqueado de verdade. O que existe é **um monte de decisão esperando quatro conversas** — e três delas (Ademar, Larissa, advogada) são pautas fechadas, com perguntas prontas, que cabem numa ligação cada.

## Links
[[acionaveis]] · [[fila-validacao-humana]] · [[_dossie-contabilizei]] · [[PERSONA]] · [[constituicao]] · [[decisoes-marca]] · [[HOME]]
