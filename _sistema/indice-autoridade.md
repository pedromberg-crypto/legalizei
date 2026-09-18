---
tipo: hub
status: vivo
data: 2026-07-16
tags: [sistema, autoridade, vocabulario, meta]
---

# 🧭 Índice de autoridade — quem manda em cada assunto

> **Por que existe:** em 16/07 o Pedro provocou uma coisa certa. Numa semana a gente
> validou, revalidou e refez centenas de informações, e os achados viraram frequentes
> demais: *"passou despercebido"*, *"isso não estava na minha visão"*. Nove só naquele dia.
>
> A medição mostrou que **não era falta de documentação** (o vault é bem linkado: 143 notas,
> `BASE-ESTRATEGICA` com 15 backlinks, `cnae-atendidos` com 16). Eram outras três coisas:
>
> 1. **Gravidade invertida** — os docs cuja ORDEM morreu tinham 5× mais backlinks que os que
>    os substituíram (`blocos-fluxo-abertura` 22 × `reordenacao-flow` 4). O grafo apontava
>    pro passado.
> 2. **Dependência não rastreada** — 7 dos 9 achados eram do tipo *"X dependia de Y e ninguém
>    sabia"*. O vault registrava o **quê** e o **porquê**, nunca o **de quem isto depende**.
> 3. **Vocabulário improvisado** — 20 `status` e 25 `tipo` diferentes. Nenhum script consegue
>    verificar 20 status inventados.
>
> **Este doc é a resposta às três.** Ele responde a pergunta que ninguém conseguia responder:
> **qual documento manda neste assunto?**

---

## ⚠️ A regra que mais importa

**Um documento pode ser VERDADE sobre um assunto e MENTIR sobre outro.**

Esse é o erro que quase cometi ao arrumar isto: ia carimbar 6 docs como "superados" porque
a reordenação de 16/07 matou a ordem T1–T23. **Errado.** Ela matou a **ordem** e o **momento
da cobrança**. Não matou o campo-a-campo do `spec-telas-entrada-b1-b2` (28kb de validação e
microdetalhe), nem as condicionais do `mapa-ramificacoes-flow`.

Então a pergunta nunca é *"esse doc está vivo?"*. É sempre **"esse doc manda NESTE assunto?"**.

---

## 📋 Tabela de autoridade

| Assunto | 👑 Manda | Mente sobre isso (não leia lá) |
|---|---|---|
| **ORDEM do flow · momento da cobrança** | [[reordenacao-flow-cobranca-cedo]] + `produto/_flow/flow-data.mjs` (os 124 nós, na ordem) | 🔴 **17/09:** o `_arquivo/motor-testes/flow-schema.js` saiu daqui e foi para `_arquivo/` — ele parou em 21/07 e ainda afirmava o `b1.encaixe` e o `N5' resumo`, que não existem no `flow-data`. | ❌ mapa-telas-mobile · spec-telas-* · blocos-fluxo-abertura · mapa-ramificacoes (todos têm a ordem T1–T23, morta) |
| **CONTEÚDO das telas** (campo, validação, margem, microdetalhe) | [[spec-telas-entrada-b1-b2]] (T1–T15) · [[spec-telas-b3-b4-aterrissagem]] (T16–T23) | ⚠️ a numeração T é velha → use o mapa T→N abaixo |
| **CONDICIONAIS / ramificações** | [[mapa-ramificacoes-flow]] | ⚠️ a ordem é velha; os forks e o template de saída graciosa valem |
| **INVENTÁRIO de telas + pausas** | [[mapa-telas-mobile]] | ⚠️ ordem velha; as 5 pausas foram reclassificadas por shell em [[design-system]] §0 |
| **LÓGICA de negócio dos blocos** | `produto/_flow/flow-data.mjs` — o campo `falta` de cada nó é o ADR da tela, e `dados` é o que ela coleta | ❌ [[blocos-fluxo-abertura]] tem a ordem T1–T23, morta. 🔴 **17/09:** o `_arquivo/motor-testes/flow-schema.js` era citado aqui como quem ganha quando divergem, e foi arquivado: 35 passos contra os 124 nós de hoje, com a numeração N morta e uma tela (`b2.natureza`) removida do produto em 31/08. |
| **PERSONAS / critério de aceite** | 🔴 **em aberto desde 17/09.** As 19 de `_arquivo/motor-testes/personas/` foram arquivadas (este índice já as declarava mortas na linha das vidas). O flow de entrada é coberto hoje por `execucao/testes-flutter/personas-entrada-me.md` (24, do app do dev) e a vida depois da constituição pelas 18 de `vidas.mjs` — **nenhum dos dois é critério de aceite do flow de telas deste vault.** ❌ [[casos-teste-fluxo-cnae]] tem as 11 originais |
| **Flow #2 MIGRAR** | `produto/_flow/flow-data.mjs`, os 14 nós com `caminho: "migrar"` (`E4_2`, `E9_2`…) | 🔴 **17/09:** o `_arquivo/motor-testes/flow-migrar.js` (17 passos `m0`…`fim.migrada`) foi arquivado — numeração e rotas que o app não tem. |
| **NÚMEROS fiscais** | [[fiscal-simples-bh-2026]] bloco **CONSOLIDADO** | derivados: `flow-schema.js` FISCAL · `app/src/lib/fiscal.ts` |
| **PREÇO de plano · CAC-alvo · margem/custo** | [[estado-atual]] (`financeiro/estado-atual.md`) — não é log, é o estado corrente | ❌ `posicionamento.md`/`estrategia-organica.md`/`frente-1-captacao-meta-bh.md` ainda citam MEI R$49,90 velho; `decisoes-marca.md` tem a história completa mas é cronológico, não cite direto de lá |
| **CNAE atendido / não atendido** (mapa de mercado, espelho do LÍDER) | [[cnae-atendidos-e-nao-atendidos]] | [[cnae-comercio-standby]] = os 200 cortados. ⚠️ NÃO é a whitelist do nosso V1 — ver linha abaixo |
| **CNAE que ATENDEMOS de verdade no V1** (**87 atendíveis · 80 COBRÁVEIS** · 51 MEI, fonte primária) | [[cnae-liso-servico]] · export `cnae-atendemos-certeza.json`, campo **`motor_apura`** | 🔴 **Revalidado em 18/09:** 7 dos 87 estão em `requer-revisao` e o `apurador.anexoDoCnae()` **recusa calcular o DAS** deles — atendíveis pela pesquisa, não cobráveis pelo motor. Quem manda em *podemos cobrar?* é o `motor_apura`, não o `atende_me_certeza`. | v1 antiga (103, herdada da Contabilizei) superada 27/08 — não usar. Export dev completo (40 colunas): `cnae-atendemos-certeza.json`/`.csv` |
| **Categorias de UX pra achar CNAE** (pills/dropdown do produto) | [[taxonomia-pills-n4]] (v2, 14 categorias) | v1 antiga (17 categorias/103 CNAEs, arquivada em `_arquivo/`) superada 27/08. Implementado em `app/src/components/gate-telas.tsx` (`PILLS`) |
| **CNAE fiscalmente ótimo** | [[cnae-fiscalmente-otimo]] | 🕓 famílias 🟡 esperam Larissa |
| **Dados oficiais por CNAE** (IBGE + Anexo/Fator R + MEI + risco municipal + ISS BH) | [[cnae-matriz-governo]] (descreve `cnae-matriz.csv`/`.json`, 1332 códigos) | ⚠️ `contabilizei-cnae-completo.csv` tem `pode_mei`/`anexos_romano`/`fator_r` **próprios da Contabilizei** (o que o CONCORRENTE assume) — não são nossa verdade, útil só pra comparar. 🕓 coluna `anexo_fator_r_grupo` (62 `requer-revisao` + tudo) espera Larissa ratificar antes de virar produto |
| **Consultas de órgãos · autofill (o que uma API de fato entrega)** | [[infosimples-funcionalidades]] + [[orgaos-e-cobertura-infosimples]] | ⚠️ **regra dura 24/07:** antes de criar QUALQUER campo de autofill/consulta, checar aqui. Não assumir o que um número (CNPJ/CPF/CEP) puxa — já erramos supondo |
| **Obrigações operacionais do MEI** (DAS, NF/NFS-e, DASN-SIMEI, teto, funcionário) | [[mei-obrigacoes-operacionais]] (fonte primária, 28/08) | ME/Simples Nacional geral ainda não pesquisado — só a base compartilhada (§7 do doc) já existe. Mapeamento de funcionalidade em [[mei-mapeamento-funcionalidades]] |
| **Abertura/constituição de MEI** (processo, elegibilidade, formulário, BH) | [[abertura-mei-processo]] (fonte primária, 28/08) | Achado duro: **não existe API nem procuração** que permita abrir MEI por terceiro — o titular tem que clicar. Abertura é grátis e síncrona. Equivalente MEI de `produto/me/entrar/constituir/processo-abertura-empresa-bh.md`. Proposta de flow em [[cruzamento-flow-mei-vs-me]] (**status: proposta**, aguarda OK do Pedro) |
| **Cor · tipo · espaço · shell · arquétipo** | [[design-system]] | derivado: `app/src/app/globals.css` |
| **Primitivos de cor** | [[paleta-cores]] | as **regras** em prosa lá viraram token no [[design-system]] §2 |
| **Decisões de marca** | [[decisoes-marca]] (ADR) | — |
| **Otimizações de UX** | [[compilado-ux-flow]] | ⚠️ "✅" lá significa **decidido**, não construído (ver Estados) |
| **Estratégia · custo · equity** | [[BASE-ESTRATEGICA]] | — |
| **Funil real do líder** | [[2026-07-16-funil-abertura-ate-pagamento]] · [[2026-07-16-pos-pagamento-operacao-real]] | ⚠️ [[onboarding-jornada-completa]] (08/07) é anterior e mais rasa |
| 🆕 **QUAIS funcionalidades o app tem** · e a LUZ de cada uma | [[FUNCIONALIDADES]] (`produto/`, gerado de `funcionalidades-data.mjs`) | 🔻 **Travado 12/09 (Pedro):** são as **58** que foram ao Mauro, com a folha DENTRO do MVP. A luz é **derivada** (tem rota? tem passo?), nunca digitada. ❌ [[_catalogo]] perdeu a lista e a cobertura; ⚠️ a numeração dele difere em §1 e §2 |
| **POR QUE cada funcionalidade é assim** · o que o líder faz · como automatizar · balde de monetização | [[_catalogo]] (`produto/`) | ❌ não manda mais na lista nem na cobertura (saiu em 12/09). ✅ segue mandando nos **15 vendáveis do à-la-carte**, nas decisões de 08/09 e 27/07, no desenho da central de avisos e no §9 "o que decidimos não fazer" |
| **De que TERCEIRO cada funcionalidade depende** (API, órgão, provedor) | [[_matriz-dependencia]] (`produto/`) | ⚠️ a coluna "como automatizar" do [[_catalogo]] é anterior e é **hipótese**; quando divergirem, **a matriz ganha** (ela tem fonte) |
| **DESENHO de uma funcionalidade** (o que o dev implementa) | `produto/me/viver/funcionalidades/specs/<nome>.md` | ❌ nunca a evidência do concorrente: ela é foto com data e não manda em nada |
| **O que o CONCORRENTE faz**, com data | `produto/me/_evidencias/<data>-<fonte>-<tema>.md` | ⚠️ **envelhece sozinho.** Nunca ratificar dado fiscal por tela de concorrente |
| 🆕 **QUE TELA cobre qual funcionalidade** · o que cada tela do portal entrega | `caps` e `cobre` em `produto/me/viver/portal/portal-data.mjs` + o painel de [[HOME-produto]] | ❌ `produto/me/viver/portal/matriz-portal-interno` é de **22/07** e virou histórico em 11/09: mostra o mapeamento da primeira leva, não o de agora |
| 🆕 **Se uma capacidade SUMIU da tela** (regressão de redesenho) | `node produto/me/viver/portal/verificar-capacidades.mjs` | ⚠️ pega capacidade, **não pega qualidade**: que a tela continua boa é olho do Pedro no print. Régua completa em [[_doutrina-capacidades]] |
| 🆕 **Resíduos de julho do portal** (matriz, cruzamento, candidatos de home, backlog) | ⛔ nenhum — são **histórico** | 🔻 Travado 11/09 (Pedro): explicam por que cada tela nasceu assim e por isso não se apagam, mas **não decidem o que construir agora**. Quem decide é a pesquisa de setembro em `produto/` |
| **Como se destrincha uma funcionalidade** · regra de navegação na conta do líder | [[_metodo]] (`produto/`) | — |
| **CNPJs da casa** · CRC · quem assina o quê · responsabilidade técnica | [[entidades-legais]] (`execucao/`) | ❌ o ADR de 03/08 gravou a razão social ANTIGA ("Legalize Digital"). São **duas** empresas, não uma |
| **O que o contrato do LÍDER diz**, cláusula a cláusula | [[2026-09-10-contabilizei-contrato-integral]] (`produto/me/_evidencias/`) | ⚠️ a captura de 27/08 ([[2026-08-27-funil-4-etapas-contrato-completo]]) é **parcial**: não tem a cláusula 1. Quando divergirem, a de 10/09 ganha |
| **Estado corrente do projeto** | [[HOME]] §Agora | — |
| **Valores a validar com gente** | [[fila-validacao-humana]] | — |
| 🆕 **CÁLCULO fiscal que roda** (DAS, RBT12, Fator R, DARF do sócio, vencimento, multa) | `produto/me/viver/motor/regra/apurador.mjs` · as tabelas e constantes da lei em `produto/me/viver/motor/regra/_tabelas.mjs` | ⚠️ **Precedência 1 aplica aqui com força:** quando o motor e um doc divergirem, **o motor ganha** — ele bate ao centavo contra recibo real. ❌ [[fiscal-simples-bh-2026]] segue mandando na PESQUISA e no que ainda não virou código, mas não no cálculo. ❌ `app/src/lib/fiscal.ts` é **estimador de abertura**, não apurador |
| 🆕 **O que a casa DEVE fazer, quando, e com que dado** (calendário de obrigações do cliente travado) | `produto/me/viver/motor/vidas/ciclo-do-cnpj.mjs` | 🔴 É lista **FECHADA**: obrigação que não está lá **não existe** para o nosso cliente. Quem quiser acrescentar diz de onde vem. ❌ não é o board de processos, que descreve caminho e tela |
| 🆕 **ESTADO de um CNPJ** (o que se guarda × o que se deriva) | `produto/me/viver/motor/vidas/_modelo.mjs` | 🔴 Regra dura: **derivado não se guarda**. Tela que guardar número fiscal próprio é bug dela |
| 🆕 **AJUSTE automático de pró-labore** (o "piloto") | `produto/me/viver/motor/regra/piloto-pro-labore.mjs` | ⚠️ `proLaboreOtimo`/`naBorda` no `fiscal.ts` miram a margem de 30% (UX-39, recomendação nossa), não o limiar legal — são conselho de interface |
| 🆕 **PERSONAS como empresas vivas** (a vida depois da constituição) | `produto/me/viver/motor/vidas/vidas.mjs` — **18 vidas, e é a ÚNICA persona deste fluxo** | 🔴 **Travado pelo Pedro em 17/09:** `execucao/testes-flutter/personas-entrada-me.md` (24) **não tem a ver com o motor** — é o flow de entrada no app do dev. A linha antiga dizia *"mesmo elenco, superfícies diferentes"* e **era falsa**: medido, P16 é "BH" num e "fora de BH" no outro, e P21/P22 são pessoas com nomes diferentes sob o mesmo id. Não reconciliar, não importar. ❌ `_arquivo/motor-testes/personas/*.json` é de 16/07 e está morto para isto |
| 🆕 **O que já foi ENCERRADO e não se reabre** | `produto/me/viver/motor/provar/_encerrados.mjs` | 🔴 `node produto/me/viver/motor/provar/verificar-encerrados.mjs` derruba a rodada se um assunto encerrado voltar para lista de pendência. Nasceu em 15/09 depois de eu reabrir o mesmo assunto 3× |
| 🆕 **Defeitos achados rodando persona** (com quem pegou, custo e trava) | `produto/me/viver/motor/notas/_achados-do-motor.md` | ❌ o ledger do Flutter (`docs/achados/` no repo deles) é do **app**, não do motor. Não duplicar |
| 🆕 **O que o elenco de vidas NÃO exercita** | `produto/me/viver/processos/_cobertura-das-vidas.md` — mora em `/processos` porque quem o escreve é o `gerar-cru.mjs` | ⚠️ a régua é *"existe código que nenhuma vida faz rodar?"*, não *"temos personas suficientes?"* |
| 🆕 **Suficiência do motor** (o que está provado, e por qual tipo de prova) | `produto/me/viver/motor/notas/_SUFICIENCIA.md` §2 | 🔴 Separa **regra fechada por fonte oficial** de **convenção provada por documento**. Um não substitui o outro, e regra provada por norma **não vira 🟡** por falta de recibo daquele caso |
| 🆕 **Dúvidas que sobram para o contador** | `produto/me/viver/motor/notas/_duvidas-contador.md` | 🔴 Travado 15/09 (Pedro): **só entra aqui o que NÃO se responde com documentação já validada no vault.** Antes de escrever uma pergunta, procurar a resposta nas linhas acima |

### 🆕 17/09 · As 11 que já se diziam fonte-verdade e não estavam aqui

> 🔑 **Como apareceram:** o `verificar-autoridade.mjs` passou a cruzar o frontmatter `autoridade:` de **579 documentos** com esta tabela. Onze declaravam `fonte-verdade` no cabeçalho e **nenhuma linha aqui** — a contradição exata que este índice existe para não deixar acontecer: um doc pedindo para ser obedecido sem ninguém saber que ele existe.
>
> ⚠️ Não são docs novos. São docs que **sempre mandaram** nas áreas deles e nunca foram declarados. O censo do mesmo dia: **556 sem etiqueta** (que é o default `memoria` — explica, não decide), **22 fonte-verdade**, **1 ratificado**.

| Assunto | 👑 Manda | Mente sobre isso (não leia lá) |
|---|---|---|
| **Entrega do MLP** (o que entra e o que fica de fora) | `execucao/lancamento-mlp.md` | ⚠️ roadmap em [[BASE-ESTRATEGICA]] é estratégia, não recorte de entrega |
| **Como o modo cru funciona** (as 2 regras da varredura por categoria) | `produto/me/viver/processos/cru/_como-funciona.md` | ❌ os `cru/*.md` são **gerados** — a regra mora aqui, o mapa sai do `.mjs` |
| **Doutrina de processos** (o que é nó, o que é variável, o que é saída) | `produto/me/viver/processos/_doutrina-processos.md` | ⚠️ o formato P1–P6 completo está **adiado**, não revogado (11/09) |
| **Variáveis de entrada do ME** (o que o app pergunta no dia 1) | `execucao/testes-flutter/variaveis-entrada-me.md` | ❌ `vidas.mjs` manda do **mês 1** em diante; este manda no **dia 1** |
| **Teardown do pró-labore e do PGDAS na conta real** | `produto/me/_evidencias/2026-09-13-teardown-prolabore-e-pgdas-conta-real.md` | 🔴 é **evidência**, não autoridade fiscal: o líder é evidência, a lei é que manda |
| **Alíquota e enquadramento** (a funcionalidade, não o cálculo) | `produto/me/viver/funcionalidades/specs/aliquota-e-enquadramento.md` | ❌ o **cálculo** é do `apurador.mjs`; aqui mora o que a funcionalidade entrega |
| **Compliance e rotinas** | `produto/me/viver/funcionalidades/specs/compliance-e-rotinas.md` | ⚠️ o **calendário** fechado é o `ciclo-do-cnpj.mjs` |
| **Emitir nota fiscal** | `produto/me/viver/funcionalidades/specs/emitir-nota-fiscal.md` | ⚠️ o desenho de processo é `cru/notas.mjs` |
| **Folha de pagamento** | `produto/me/viver/funcionalidades/specs/folha-de-pagamento.md` | 🔒 colaborador está **travado fora** das vidas por decisão do Pedro (15/09) |
| **Guia de imposto** | `produto/me/viver/funcionalidades/specs/guia-de-imposto.md` | ⚠️ o valor da guia é do `apurador.mjs`; aqui mora a experiência |
| **Cruzamentos entre funcionalidades** | `produto/me/viver/_mapa-de-cruzamentos.md` | ⚠️ é mapa de **dependência**, não de ordem de construção |

---

## ⚖️ Precedência (quando duas fontes divergem)

1. **Código que roda > documento.** O motor e o app não mentem: eles executam.
   Regra já travada no handoff do dev: *contradição → motor ganha*.
2. **Fato datado > decisão.** O CNPJ real do Pedro saiu **LTDA** num caso solo; a spec diz
   "solo→SLU". O fato ganha, a spec vira suspeita. (Anti-guru aplicado ao próprio vault.)
3. **Decisão nova > decisão velha** — **mas** só no assunto que ela de fato decidiu.
4. **Nada > nada.** Ausência de doc não é permissão pra inventar. Vira 🕓 fila.

> ⚠️ **"✅ na spec" NÃO significa implementado.** Isso não é teoria: a auditoria de 16/07 achou
> **5 itens ✅ que nunca viraram código**, e um deles (UX-39) fazia o motor recomendar
> exatamente o oposto do que a spec mandava. Por isso os Estados abaixo são três, não um.

---

## 🗺️ Mapa T → N (a tradução que faltava)

A numeração antiga (T) aparece em ~8 docs e nos relatórios do motor. Ela **não vai ser
reescrita** (custaria um dia e criaria 8 docs novos pra manter). Traduza por aqui.

| Antigo | Novo | Tela |
|---|---|---|
| T1 · T2 · T3 | N1 · N2 · **N3** | splash · welcome · fork *(N3 virou 3 rotas, UX-55)* |
| T4 | **N4** | gate-CNAE *(+ triagem UX-21 e faixa de faturamento)* |
| — | 🆕 **N5** | **teaser em 3 modos** (não existia) |
| T5 | **N6** | criar conta |
| T16 + T17 | **N7** | conta da abertura + plano *(fundidos)* |
| **T18** | **N8** *(metade)* | **aceite do contrato** — reversível |
| T19 | **N9** | pagamento · **← a casa nasce aqui** |
| T6 → T15 | **N10 → N19** | todo o dossiê *(desceu pra depois do pagamento)* |
| — | 🆕 **N19.5** | **consenso do 2º sócio** (UX-50; sem spec de UI) |
| **T18** | **N20** *(outra metade)* | **termo irreversível** — aqui a máquina liga |
| T20 · T21 · T22 · T23 | N21 · N22 · N23 · N24 | painel · convite sócio · GOV.BR · empresa ativa |
| — | 🆕 **N25** | **TFLF** (dia ~40) — evento de portal |

> 🔑 **O T18 rachou em dois** (N8 aceite reversível · N20 termo irreversível). É a mudança
> menos óbvia e a de maior efeito jurídico.

---

## 🏷️ Vocabulário fechado

**16/07:** 25 `tipo` e 20 `status` improvisados, 106 notas sem status nenhum. Fechou em 6 tipos, 5 status.
**09/09:** a regra existia e **não era aplicada por nada**, e o vault tinha voltado a 34 tipos. Duas coisas mudaram: o vocabulário abriu pra **8 tipos** (onde ele estava apertado demais) e o verificador passou a **rodar sozinho** (onde faltava trava). Detalhe do diagnóstico em [[2026-09-09-vocabulario-fechado-aplicado]].

### 🆕 `autoridade` — quanto a nota MANDA *(fechado em 17/09)*

> 🔑 **O default é o silêncio.** Doc sem `autoridade:` é `memoria`: explica e data, **não decide**. É o que **556 dos 579** docs da órbita são de fato — marco, ata, achado, briefing —, e marcá-los um a um seria trabalho mecânico para dizer o que a ausência já diz.
>
> O que exige declaração é o contrário: **dizer que manda é um ato**. Quem escreve `autoridade: fonte-verdade` está pedindo para ser obedecido, e por isso tem que aparecer na tabela lá em cima. O `verificar-autoridade.mjs` derruba a rodada nos dois casos que importam: **valor inventado** e **doc que se diz fonte-verdade sem estar no índice**.

| autoridade | O que significa | Quando usar |
|---|---|---|
| `fonte-verdade` | **Manda no assunto.** Contradisse outro doc? O outro é que está errado | precisa de linha na tabela de autoridade |
| `ratificado` | foi conferido contra **fonte externa** e fechou | pesquisa validada, consulta respondida |
| `contrato` | é o que **outro time consome** — entrega, handoff, spec de dados | quando alguém de fora implementa em cima |
| `memoria` | explica o porquê e a data. **Não decide** | 🔑 o default: não precisa ser escrito |

⚠️ **Isto não substitui o `status`.** `status: vivo` diz se o doc acompanha o código; `autoridade` diz se ele **manda**. Um marco pode ser `vivo` e `memoria` ao mesmo tempo — está atualizado e mesmo assim não decide nada.

### `tipo` — o que a nota É
| tipo | O que é | Regra |
|---|---|---|
| `hub` | navegação | HOME, este índice |
| `verdade` | **fonte-verdade de um assunto** | só uma por assunto (ver tabela). ⚠️ pode ter `deriva_de`: ser fonte de um assunto não impede derivar de outro |
| `derivado` | **deriva de uma verdade** | ⚠️ **apodrece** quando a fonte muda → o script pega |
| `fato` | dado externo, datado | teardown, captura, pesquisa. **Não muda**, só ganha data |
| `historico` | registro do que aconteceu | reunião, diário. **Nunca leia como atual** |
| `operacao` | trabalho corrente | kanban, briefing, prompt de pesquisa, campanha. Muda toda hora, não é fonte |
| `marco` | 🆕 **entrega datada de um flow** | `execucao/marcos/`. É `historico` com estrutura própria, e `marcos.base` filtra por ele |
| `referencia` | 🆕 **material externo consultável** | doc de API, tabela de anexo, template. Você **volta nele**, não o lê uma vez |

⚠️ **`marco` e `referencia` foram promovidos, não inventados.** Eram 19 e 17 notas, e o `marcos.base` já filtrava `tipo == "marco"` — a doutrina proibia o que a ferramenta exigia. Quando isso acontecer de novo, **a ferramenta é o sintoma, não o culpado**.

### `status` — em que estado está
| status | Significa |
|---|---|
| `vivo` | atual, pode usar |
| `superado` | morreu **neste assunto** → aponta o sucessor em `superado_por` |
| `rascunho` | em construção, não confie ainda |
| `congelado` | snapshot **intencional** (a spec no repo do dev, pesquisa externa arquivada na íntegra) |
| `fila-humana` | 🕓 espera Mauro / Larissa / Karla → [[fila-validacao-humana]] |

🔒 **`status` não é campo de recado.** Em 09/09 havia `status: GERADO — não editar à mão...` e `status: vivo — v0.2, rodada 2 de correções aplicada`. Recado tem campo próprio (`gerado_por`) ou vai pro corpo. Quem escreve estado no campo de estado deixa o script cego.

### 🕓 `fila-humana` não é 🔴
Decisão do Pedro em 16/07, e é uma correção de um vício meu: eu vinha carimbando 🔴 em
preço, `TEASER_PISO`, DAE, SLU×LTDA — **misturando "isto trava a construção" com "isto
precisa de um contador"**. São coisas diferentes.

- 🔴 = **bloqueia**. Raro. Não dá pra construir sem.
- 🕓 = **fila**. Leve. Constrói com placeholder marcado, o Pedro valida com as pessoas certas
  quando for a hora.

---

## 🔗 Dependência declarada (o campo que faltava)

Campos de frontmatter. Não é burocracia: **é o que torna a verificação automática possível**,
e é a resposta direta ao achado nº 2 lá de cima.

```yaml
deriva_de: [fiscal-simples-bh-2026]     # se ISTO mudar, eu fico suspeito
deriva_de_codigo: [produto/_flow/flow-data.mjs]   # deriva de CÓDIGO (não dá pra datar)
gerado_por: produto/_flow/gerar-mapa.mjs          # nasce de script, não editar à mão
revisado_em: 2026-09-09                 # olhei contra a fonte nesta data, continua valendo
supera: [mapa-telas-mobile]             # eu matei estes (neste assunto)
superado_por: reordenacao-flow-cobranca-cedo   # quem me matou
assunto: ordem-do-flow                  # em QUE assunto eu mando
```

🔑 **`deriva_de` vale sozinho, independente do `tipo`.** Uma `verdade` pode derivar de outra
coisa e apodrecer igual. 8 notas estavam exatamente assim.

🔑 **`revisado_em` é a saída HONESTA do alarme.** Quando o verificador acusa "a fonte é 7 dias
mais nova", há dois caminhos: atualizar a nota, ou olhar e concluir que ela continua valendo.
No segundo caso, `revisado_em: <hoje>` **cala o alarme sem mentir** — e ele volta sozinho se a
fonte mudar de novo depois dessa data. ⚠️ Nunca resolver isso mexendo na `data:`, que é
semântica (diz quando o CONTEÚDO foi decidido, não quando o arquivo foi tocado).

⚠️ **`deriva_de` só aponta pra NOTA.** Código não tem frontmatter, logo não tem data pra
comparar; apontar pra `.mjs`/`.tsx` ali vira ruído permanente. Use `deriva_de_codigo`.

**Verificação:** `node _sistema/verificar.cjs` audita derivado apodrecido, link quebrado,
vocabulário e órfã. 🆕 **Desde 09/09 ele roda junto com `node produto/_flow/gerar-mapa.mjs`**,
como aviso — que é o comando que a regra do `CLAUDE.md` já obriga a rodar a cada tela mexida.
Antes disso ele existia havia 2 meses e nunca tinha rodado.

> Se o UX-44 tivesse `deriva_de: [ordem-do-flow]`, a reordenação teria acendido a luz em vez
> de revogá-lo em silêncio. É exatamente esse o caso que este campo existe pra evitar.

---

## Links
- [[HOME]] · [[fila-validacao-humana]] · [[reordenacao-flow-cobranca-cedo]] · [[design-system]] · [[compilado-ux-flow]]
