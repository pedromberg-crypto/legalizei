---
tipo: operacao
status: vivo
data: 2026-09-24
assunto: fila-correcoes-tabela-cnae
deriva_de: [cnae-liso-servico, lc123-art18-anexos-taxativo]
deriva_de_codigo: [pesquisa/cnae-matriz/cnae-matriz-v2.csv, pesquisa/cnae-matriz/reclassificar-anexo.mjs]
tags: [cnae, fila, correcao, simples-nacional, tabela]
---

# 🧾 Fila de correção da tabela de CNAE

> O que ainda falta arrumar na tabela completa, com o porquê e o critério de pronto de cada item. **Nasceu em 24/09**, quando o Pedro perguntou se a gente estava salvando o que precisa corrigir — e a resposta honesta era *não*: estava espalhado entre o `HOME §Agora`, o ADR e uma resposta de chat, que some quando a janela fecha.

## 🗺️ Onde cada coisa vive, para não se perder de novo

| Arquivo | Papel | Regra |
|---|---|---|
| `cnae-matriz.csv` · `cnae-friendly.csv` | 🔒 **as originais** | **intocadas.** md5 conferido a cada rodada |
| `cnae-matriz-v2.csv` | ✍️ **onde se edita** | 1.332 linhas × 40 colunas. É a fonte de trabalho |
| `cnae-amostra.csv` | 👁️ **onde se olha** | 🤖 **gerada** por `gerar-amostra.mjs`. Editar aqui é trabalho perdido: a próxima rodada reescreve do zero |
| `cnae-atendemos-certeza.csv` | 📤 **o export que o motor lê** | ainda **não regerado** — ver item 1 |
| `marca/decisoes-marca.md` | ⚖️ decisão travada | o *porquê*, datado |
| **este arquivo** | 📋 **o que falta** | o *ainda não*, com critério de pronto |

---

## 🔴 Trava — impede o produto de responder

### 1. O export não foi regerado, e o motor ainda recusa 7 CNAEs
As correções de 24/09 entraram na `cnae-matriz-v2.csv`, mas o `cnae-atendemos-certeza.csv` — que é o que o `apurador.anexoDoCnae()` consome — **é anterior a elas**. Na prática o motor segue em **80/87**, e os contadores `65/15/7` de `produto/me/viver/motor/regra/_tabelas.mjs` seguem valendo.

> **Pronto quando:** o export tiver os 87 com `anexo_fator_r_grupo` preenchido e zero `requer-revisao`, o `_tabelas.mjs` marcar `71/16/0`, e o apurador calcular DAS para `7410-2/99`.
> ⚠️ Regerar o export **toca a original** — só com o seu ok, e é a última etapa, depois que a tabela estiver definida.

### 2. `motivo_nao_atende` não existe — 1.245 "não" sem razão
O Léo responde *"não atendemos"* e **não sabe por quê**. Quando não sabe, improvisa — é o mesmo mecanismo que fez ele mandar cliente de folha de pagamento procurar outro contador. O dado para derivar já está na tabela (`risco_baixo_cgsim`, `vedado_simples`, `exige_conselho`, comércio/indústria), só não foi consolidado em coluna.

> **Pronto quando:** toda linha com `atende_me = nao` tiver um motivo de vocabulário fechado, e nenhum motivo for campo vazio.

### 3. ISS de BH: 524 alíquotas existem no CSV e valem `null` no banco
`Number("5%")` = `NaN` → `null` no `carregar-cnae.ts`. A coluna está na lista do loader, então o defeito é **silencioso**: parece importada. É resposta que ninguém mais dá em BH.

> **Pronto quando:** o parser aceitar `"5%"` e o banco tiver 524 alíquotas — **ou** as 3 colunas de ISS saírem por decisão registrada. Deixar como está é a única opção ruim.

---

## 🟡 Decisão — precisa do Pedro, e é barato

### 4. Três CNAEs do §5º-F que a cascata quer mover
Estão dentro dos 87, hoje `III-fixo` por residual. **Nada foi aplicado**: mover CNAE que já tem anexo é decisão fiscal, não faxina de script.

| CNAE | Proposta | Força |
|---|---|---|
| `6391-7/00` agências de notícias | → **Fator R**, §5º-I X (*jornalismo*) | 🟢 inciso nomeado |
| `7210-0/00` P&D em ciências físicas e naturais | → **Fator R**, §5º-I XII | 🟡 julgamento |
| `7220-7/00` P&D em ciências sociais e humanas | → **Fator R**, §5º-I XII | 🟡 julgamento |

> **Pronto quando:** cada um tiver anexo gravado e linha no ADR — inclusive se a decisão for *fica como está*.

### 5. `8020002` — a cascata e o irmão se contradizem
`OUTRAS ATIVIDADES DE SERVIÇOS DE SEGURANÇA`: a cascata diz **IV** (§5º-C VI, *vigilância*), o irmão `8020001` (monitoramento eletrônico) diz **III**. Não foi gravado, por regra: irmão contradiz, a linha vira fila. **Não atendemos nenhum dos dois** — não bloqueia.

> **Pronto quando:** houver inciso escolhido com razão no ADR. Se for IV, sai do escopo por regra (12/09).

### 6. `9329-8/04` — mesmo padrão do fliperama, a conferir
`EXPLORAÇÃO DE JOGOS ELETRÔNICOS RECREATIVOS` está como Fator R. O `7729-2/01` estava igual e era **falso positivo**: o matcher via *"jogos eletrônicos"* no §5º-D IV, que trata de **elaborar software**, não de explorar máquina. Explorar arcade provavelmente também não é.

> **Pronto quando:** o inciso for conferido contra a subclasse e gravado.

---

## 🟠 Estrutura — a tabela nova, acordada em 24/09

### 7. Campo vazio tem que ser alguma coisa
Hoje "vazio" significa **quatro coisas diferentes** e não dá para distinguir olhando: *não se aplica* (dependente cujo pai disse não) · *não verificado* · *existe na fonte e nunca foi importado* · *coluna morta*. Foi assim que `registro_setorial` pareceu resolvido em **942 linhas onde ninguém olhou**.

Desenho fechado: `NOT NULL` + vocabulário de ausência (`nao-se-aplica` · `nao-verificado` · `sem-previsao-na-fonte`), dependente **gerado** por `CHECK`, contador de `nao-verificado` que só pode cair, e proibição de `nao-verificado` dentro dos 87.

> **Pronto quando:** o schema recusar nulo em toda coluna e o contador existir.

### 8. Das 44 colunas para 18
Curadoria fechada em 24/09: 18 sobem para o Léo, o resto vira **curadoria** (fica no repo, não sobe). Inclui renomear (`descricao` → `titulo_oficial`, `subclasse_observacoes` → `descricao_oficial`, `atividades` → `termos_de_busca`), colapsar as 4 colunas de Fator R em 3, e transformar `fator_r` e `mei_permitido` em **colunas geradas**.

> ⚠️ **Não anda no mesmo commit que correção de dado.** Em 24/09 escrevi `III`/`III-ou-V` (vocabulário novo) numa coluna que o apurador lê como `III-fixo` — 4 valores para 2 conceitos, motor teria parado. Revertido por md5.
> **Pronto quando:** a tabela nova existir com as 18, e o `apurador` ler o vocabulário novo na mesma leva.

### 9. `familia` — a categorização nossa
A divisão do IBGE agrupa por lógica econômica; o cliente se descreve por profissão. A `divisao 96` junta cabeleireiro com lavanderia e agência funerária. Regra acordada: **aditiva, nunca substitutiva** (entra ao lado da `divisao_id`, que fica intacta), **derivada de mapa declarado** (`familias.mjs`), e **só nos 87**.

> **Pronto quando:** cada um dos 87 tiver família, e a `divisao_id` continuar intacta.

### 10. `mei_iss_fixo_das` e `mei_icms_fixo_das` nunca foram importados
351 linhas no CSV, zero no banco. É quanto o MEI paga por mês — a pergunta nº 1 de quem quer ser MEI.

> **Pronto quando:** as duas colunas estiverem no loader, ou saírem por decisão registrada.

---

## ⚪ Adiável — não muda resposta a cliente hoje

### 11. Os 395 `§5º-F` que não atendemos
Dos 449 residuais, **54 estão dentro dos 87** (51 confirmados em III, 3 no item 4). Os outros **395 são de CNAE que não atendemos** — revisar o anexo deles não responde nada enquanto o veredito for "não".

### 12. `registro_setorial`: 942 de 1.332 em `nao-verificado`
O eixo só foi cruzado para os 387 do footprint do líder. **Dentro dos 87 está 100% verificado** (`nao` nas 87), então não trava. Vira item real se o escopo crescer. Ver item 7.

### 13. As 15 classes onde os irmãos divergem
Medido em 24/09: 106 concordam × 15 divergem (12%), e as 15 parecem ser **a lei dividindo mesmo** (`6911-7/01` advocacia é IV, `6911-7/02` auxiliares da justiça é III, porque o §5º-C VII nomeia só advocacia). Vale uma passada de olho, sem pressa.

---

## 🔒 Fora daqui — não se resolve com tabela nem com pesquisa

Os dois documentos de BH, que o doc de 18/09 já enfileirou pro contador:

| Documento | O que classifica | Situação |
|---|---|---|
| Decreto Municipal 17.245/2019, Anexo I | atividades dispensadas de Alvará | **111 de 276 itens**, por cópia de terceiro (LegisWeb, não o DOM) |
| Portaria SMSA/SUS-BH 0221/2022, Anexos I-VII | risco sanitário em BH | **não obtido** — PDF sem OCR |

🔑 **A norma que usamos (`risco_baixo_cgsim`, Res. CGSIM 51/2019) é a federal subsidiária** — vale *na ausência* de lei municipal, e BH tem a sua. Não está provado que erramos; está provado que **não sabemos**. **62 dos 80 são inconclusivos**, e é obtenção de fonte, não pesquisa.

---

## Links
[[cnae-liso-servico]] · [[lc123-art18-anexos-taxativo]] · [[fundamentos-cnae]] · [[2026-09-18-validacoes-cnae-para-contador]] · [[decisoes-marca]] (24/09, 5 linhas) · [[fila-validacao-humana]]
