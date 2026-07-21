---
tipo: referencia
status: vivo
data: 2026-07-21
assunto: contabilizei-dossie-plataforma-logada
tags: [concorrente, contabilizei, teardown, produto, portal, dossie]
---

# 🕵️ Dossiê — plataforma LOGADA da Contabilizei (o portal do cliente)

> **Objetivo:** mapear, tela por tela, o portal logado do líder — resumo, conexões, o que cada botão faz, positivos/negativos/melhoras — com a lente **"o que o plano básico entrega que um CNPJ recém-aberto de fato precisa"**. Base pra montar a **parte interna do nosso app** (o portal pós-abertura, o "dia-2" que ainda não construímos).
>
> **Método:** navegação READ-ONLY na conta real do Pedro (nada de emitir/pagar/mover dinheiro). Cada modal/popup do DOM foi capturado e catalogado (§Catálogo de Popups). Datado 2026-07-21.
>
> ⚠️ **Conta real:** dados específicos (nº de conta, valores) são incidentais, não o foco. O que importa é a ESTRUTURA, os FLUXOS e a MÁQUINA DE CONVERSÃO.

---

## 🗺️ Mapa de navegação (nav lateral)
`Home · Minhas Rotinas · Relatórios · Mensalidade · Sócios e Pró-labore · Folha de Pagamento · Plano de Saúde · Meus Benefícios · Cobrar seu cliente · Serviços adicionais`
Topo: `Ajuda · Dados da empresa e banco · Minha conta`. Canto: chat "Fale conosco".

## ⚡ Sumário executivo (leia isto primeiro)
Mapeei **14 superfícies** + **16 popups/modais** do portal logado. O portal do líder é **completo, denso e feito pra durar** — mas **hostil ao recém-chegado**: jargão contábil, obrigação misturada com upsell, e trabalho empurrado pro cliente. Um CNPJ novo precisa de um **subconjunto pequeno** (emitir nota · pagar imposto · pró-labore · sentir-se em dia); o resto é fundo ou upsell.
**3 achados que mandam:** (1) **a máquina de conversão é medo** (dunning: exclusão do Simples, multas, "o que você perde") — flanco ético a atacar; (2) **eles deixam loops abertos** (você confirma manualmente se pagou o imposto, envia extrato manual) — nosso maior espaço pra encantar; (3) **pró-labore inteligente eles JÁ têm** (mas sem simulador interativo) — nosso N18 tem que ser visivelmente melhor. Grade de preço viva: **Básico R$139 · Padrão R$195 · Multi R$225 · Experts R$395 · Manutenção R$79** (+ surcharge de faturamento/funcionários escondido).
→ **A recomendação acionável está no fim (§D "Por onde começar").**

---

## 1. 🏠 Home / Central de Rotinas
`app.contabilizei.com.br/painel-de-controle/#/home`

**Resumo:** o command center. Um calendário de rotinas do mês + "Pendências críticas" no topo, e abaixo 4 cards-função (Notas fiscais · Pró-labore · Impostos · Conta Digital PJ) + blocos de benefícios/serviços/rotinas rápidas. É a tela que o dono vê todo dia; concentra ação (emitir nota, ver imposto) e nudge (ative isto, contrate aquilo).

**Conexões (o que leva a quê):**
- Pendências críticas → `Ver pendência` / `Ir para a central de rotinas` (→ Minhas Rotinas).
- Card Notas → Emitir/Importar/Replicar/Consultar (→ módulo Notas Fiscais) + "Simular impostos" + "Emitir certificado digital".
- Card Pró-labore → Consultar / Personalizar cálculo inteligente (→ módulo Sócios e Pró-labore).
- Card Impostos → "Informar status de pagamento" + "Ativar débito automático".
- Card Conta Digital PJ → dados bancários + "Ativar Conta PJ" (Contabilizei.bank).
- Blocos "Ajuda" rápida → Adicionar/remover sócios · Alterar nome/endereço · Solicitar documentos · Regularizar pendências (→ Serviços adicionais).
- "Rotinas Mensais" → atalhos: Notas Fiscais · Pró-labore · Movimentações Bancárias · Declarações Contábeis.

**O que cada botão/ação faz:**
- **Ver pendência / Regularize imediatamente** — abre a pendência crítica (aqui: imposto pendente). Também há confirmações de rotina no DOM: "Confirmar ausência de estoque", "Confirmar envio do contrato", "Confirmar que não fez intermediações", "Alterar lançamento bancário" (Voltar / Salvar nova classificação).
- **Emitir nova nota / Importar / Replicar / Consultar** — o fluxo de NFS-e (mapeado na §Notas).
- **Simular impostos** — "inclua as notas do mês e descubra quanto vai pagar".
- **Emitir certificado grátis** — o certificado digital é PRÉ-REQUISITO pra emitir nota pela plataforma; sem ele, emite na prefeitura e importa.
- **Pró-labore R$1.621 "valor bruto ideal pra pagar menos impostos"** + **Personalizar cálculo inteligente** — cálculo adaptativo (ver §Pró-labore).
- **Informar status de pagamento** — o cliente confirma que pagou o DAS (a plataforma não paga sozinha, a menos que ative débito automático).
- **Ativar débito automático / Ativar Conta PJ** — nudges de comodidade e de captura pro banco deles.

**✅ Positivos:**
- Central de Rotinas com **calendário** dá senso de "o que precisa fazer e quando" — combate a ansiedade do leigo.
- **Pendências críticas no topo, em vermelho** — hierarquia de urgência clara.
- **Cálculo inteligente de pró-labore** exposto na home (nossa feature-âncora, eles já têm).
- Atalhos de "Rotinas Mensais" agrupam o dever-de-casa recorrente num lugar.

**❌ Negativos:**
- **Densidade brutal.** A home empilha 4 cards + benefícios + serviços + rotinas + N nudges. Um recém-aberto se perde no que é obrigação vs upsell.
- **"Informar status de pagamento" empurra trabalho pro cliente** (ele confirma o pagamento manualmente) — fricção que a gente pode eliminar.
- **Certificado digital como pré-requisito** exposto de forma técnica ("sem ele, emita na prefeitura") — jargão que trava leigo.
- A distinção obrigação × upsell é fraca: o mesmo espaço visual vende plano de saúde e cobra imposto.

**🔧 Melhoras (o que a gente faz melhor):**
- **Separar dever-de-casa de upsell** com hierarquia dura (o nosso princípio anti-densidade do flow de abertura vale aqui).
- **Pagar o DAS pelo app** (não "informe que pagou") — fecha o loop que eles deixam aberto.
- Certificado digital resolvido nos bastidores (a gente já emite no B4), então o cliente **nunca** vê "emita na prefeitura".
- Um **"o que fazer hoje"** único e curto no topo, em vez de 4 cards competindo.

**🎯 Relevância pro CNPJ recém-aberto (plano básico):** **ESSENCIAL.** É a casa. Precisamos de um equivalente, mas **muito menos denso**: 1 foco (a próxima obrigação) + acesso rápido a emitir nota e ver imposto.

---

## 🪟 Catálogo de Popups / Modais (a máquina de conversão)
> Capturados do DOM da Home (muitos são condicionais — disparam por estado da conta; alguns trazem datas antigas de 2024, sinal de que são templates seeded no código). **Isto é ouro competitivo:** é a máquina de upsell/retenção/dunning do líder, exposta.

| # | Popup / Modal | Onde | O que diz | 🎯 Propósito (hipótese) |
|---|---|---|---|---|
| P1 | **Integração bancária** | Home | "importamos automaticamente seus extratos todo mês" · Importar manual / Integrar conta | **Ativação** — puxa pro fluxo automatizado (e pro banco deles) |
| P2 | **Renovar integração expirada** | Home | "integração bancária expirada, renove pra retomar" | **Reativação** de feature que expira (cria dependência) |
| P3 | **Termo TotalPass** | Home | adesão a programa de benefício (academia) | **Cross-sell** de benefício |
| P4 | **Carta de responsabilidade da Administração** | Home | Aceitar declarações / Regularizar depois | **Compliance** (coleta aceite legal) |
| P5 | **Certificado digital** | Card Notas | "precisa de certificado pra emitir pela plataforma" | **Ativação** (destrava emissão de nota) |
| P6 | **Cálculo inteligente de pró-labore** | Card Pró-labore | "você escolheu economia máxima; em meses sem faturar, não retira pró-labore" | **Educação + feature-âncora** (Fator R vivo) |
| P7 | **Ativar débito automático** | Card Impostos | "mais comodidade, ative o débito" | **Ativação** (reduz churn de pagamento) |
| P8 | **App Contabilizei evoluiu** | Card Conta Digital | "baixe o app, QR code" | **Cross-device** (fisga pro app mobile) |
| P9 | **Sem o Contabilizei.bank você envia extrato todo mês** | Card Conta Digital | "ative a Conta PJ pra automatizar; senão, envie extrato manual ou terá tributação incorreta" | **Captura bancária por medo** (fricção proposital se usar outro banco) |
| P10 | **Contrato de prestação de serviços** | Home | "exigência do CFC, garante responsabilidades" | **Compliance** (aceite do contrato) |
| P11 | **Novidade** | Home | Agora não / Quero saber mais | **Anúncio** genérico de feature |
| P12 | 🔴 **Termo de Exclusão do Simples** | Home | "sua empresa será excluída do Simples por pendências; regularize; a Contabilizei faz a verificação; +R$95 na mensalidade" | **Upsell por medo** (vende serviço de regularização em cima de risco fiscal) |
| P13 | 🔴 **Plano Manutenção R$79/mês** | Home | "sem faturamento? plano exclusivo pra manter o CNPJ regular" (sem NF, sem WhatsApp) | **Downsell / retenção** de empresa sem faturar |
| P14 | 🔴 **Mensalidade atrasada / "Aqui está o que você perde"** | Home | lista o que perde (garantia, distribuição de lucro, NF, suporte) + "riscos: multas >R$450/mês" | **Dunning por medo** (retenção de inadimplente) |
| P15 | **CSAT "Central do Sócio"** | Central de Sócios | "Quão satisfeito com a experiência?" (1–5) | **Medição de satisfação** da feature (fechei no X) |
| P16 | **"Avalie esta tela"** (pervasivo) | Impostos + várias | CSAT inline no rodapé de quase toda tela | **Instrumentação de satisfação** por tela — o líder mede tudo |

**Leitura estratégica:** o líder monetiza o **medo** (exclusão do Simples, multas, tributação incorreta) e cria **dependência** (extrato só automatiza no banco deles). É eficaz e é o **flanco ético** que a gente ataca — nosso posicionamento pode ser o oposto: transparência, sem pegadinha, sem vender pânico. (Casa com a decisão do flow de abertura de não usar "vende pânico".)

---

## 2. 📋 Minhas Rotinas (mega-menu de ações)
Não é página — é um **flyout de navegação** que abre sobre a home, indexando TODAS as rotinas por categoria. É a taxonomia do produto:
- **Notas Fiscais:** Emitir NFS-e · Como emitir notas de serviço · Importar notas fiscais · Consultar notas fiscais · Cancelar nota fiscal · Registrar notas tomadas · Ver minhas alíquotas
- **Movimentações:** Importar extrato bancário · Fazer lançamentos caixa · Gerenciar conta bancária
- **Impostos:** Histórico de impostos · Ver impostos a pagar · Simulador de impostos · Ver minhas alíquotas
- *(abaixo da dobra: Declarações Contábeis e outras — ver "Rotinas Mensais" da Home)*

**✅ Positivo:** um índice único de tudo que dá pra fazer, agrupado por assunto — bom pra quem já sabe o que quer.
**❌ Negativo:** é um menu dentro de um menu (nav lateral → flyout → item) — 2 níveis pra chegar numa ação. Muito jargão contábil ("Registrar notas tomadas", "lançamentos caixa").
**🔧 Melhora:** pro leigo recém-aberto, a maioria disso é ruído. A gente expõe **só as 3-4 rotinas que um novo CNPJ usa** (emitir nota, ver/pagar imposto, pró-labore) e esconde o resto atrás de "avançado".
**🎯 Relevância:** ÚTIL como taxonomia de referência; a maioria dos itens é **dispensável** pro nosso MVP interno.

---

## 3. 👥 Sócios e Pró-labore → Central de Sócios ⭐ (o espelho do nosso N18/N11)
`#/socio/central` · flyout: Gerenciar sócios e pró-labore · Ver recibo · Ver informe de rendimentos

**Resumo:** a gestão de pró-labore/sócios. Banner topo "Reforma da Renda: o que muda em 2026 (afeta pró-labore e distribuição de lucros)". 2 cards: **Total de pró-labore R$1.621,00** (1 sócio) e **"Gestão inteligente ativa ⚡ — seu pró-labore está otimizado para economia mensal dos impostos"** [Editar]. Depois "Configurações do sócio" (por sócio) e "Histórico de pró-labore".

**O que cada elemento faz:**
- **Pró-labore atual R$1.621 ✓ · badge "Gestão Inteligente ⚡" · última atualização 01/06** → [Editar] (muda a estratégia/valor).
- **Vínculo empregatício ou sócio (Duplo vínculo): Não** → [Gerenciar] = **o nosso N11** (duplo vínculo CLT/INSS com folga do teto).
- **Dependentes: 0** → [Gerenciar] (IRRF/folha).
- **Toggle "Não quero ter pró-labore cadastrado em meses sem faturamento"** = **a alavanca Fator R exata do achado da cobaia** (mês sem faturar → sem pró-labore → sobe o Fator R). O líder a expõe como um switch cru.
- **Histórico de pró-labore** (tabela: competência, novo valor, prazo, documento) + Ver recibo + Guia de pró-labore.

**✅ Positivos:** a "Gestão Inteligente" é nomeada e com badge (vende a otimização); o toggle da estratégia é explícito; banner educativo proativo (reforma da renda); histórico e documentos organizados.
**❌ Negativos:** **mostra o valor pronto, mas não deixa BRINCAR** — não há simulador interativo, o cliente não entende POR QUE R$1.621 nem a relação pró-labore→imposto; "vínculo empregatício ou sócio (Duplo vínculo)", "informe de rendimentos" = jargão; popup CSAT invadiu a tela na entrada.
**🔧 Melhoras (nosso diferencial-âncora):** o nosso N18 é **interativo** (mexe no valor, vê o imposto mudar na hora, com o "encostado na borda") — ensina a mecânica em vez de entregar um número fechado. Explicar o Fator R **sem jargão**. Tornar o toggle "sem faturamento" uma recomendação inteligente **explicada**, não um switch cru.
**🎯 Relevância:** **ESSENCIAL — e é a confirmação-chave do dossiê:** o líder **já faz** gestão inteligente de pró-labore. Então a nossa não pode só "existir", tem que ser **visivelmente melhor** (interativa, transparente, sem jargão). É aqui que a gente ganha ou empata.
**🪟 Popup P15** (ver catálogo): CSAT "Quão satisfeito com a Central do Sócio?" (1–5), canto inferior esquerdo — medir satisfação da feature. Fechado no X.

---

## 4. 🏛️ Impostos a pagar ⭐ (obrigação nº1 do novo CNPJ)
`#/impostos` · menu: Ver impostos a pagar · Histórico de impostos · Simulador de impostos · Ver minhas alíquotas

**Resumo:** a lista de guias a pagar. 2 cards de status: **Estimativa deste mês** (R$0,00, pago/a confirmar) e **Em atraso** (R$356,62, X guias vencidas / Y a confirmar, em vermelho). Abaixo, a tabela de guias.

**O que cada elemento faz:**
- **Tabela:** Imposto (DARF Unificado) · Competência (Mai/Jun 2026) · Vencimento · Valor (R$178,31) · **Confirmação de pagamento (✓ paguei / ✗ não paguei)** · [Recalcular].
- **A mecânica-chave:** *"Você ainda não informou a situação de pagamento destes impostos. As opções de pagamento serão habilitadas apenas para os impostos marcados como não pago."* → o cliente **confirma manualmente** se pagou; só depois aparece como pagar.
- [Histórico] · [Entenda a confirmação de pagamento] · [Recalcular] (recalcula a guia).

**✅ Positivos:** separa "estimativa do mês" de "em atraso" com cor/urgência; recalcular a guia; histórico.
**❌ Negativos (o flanco grande):** **a plataforma não sabe se você pagou — ela te faz marcar ✓/✗.** Isso é trabalho e fonte de erro. O fluxo é tortuoso ("marque não-pago pra habilitar o pagamento"). Jargão cru ("DARF Unificado", "competência", "guias"). **Não paga sozinho** (a menos que ative débito automático, que é upsell).
**🔧 Melhoras (oportunidade forte):** nosso app **paga o DAS pelo app** ou **sabe o status** via integração bancária nativa — fecha o loop que eles deixam aberto. Linguagem humana: "seu imposto de junho, R$178, vence dia 20 — pagar agora". Zero "confirme que pagou".
**🎯 Relevância:** **ESSENCIAL.** Pagar imposto é o que um CNPJ recém-aberto mais precisa. E é onde o líder é mais fraco (empurra a conciliação pro cliente) → nossa maior chance de encantar.
**🪟 Popup/padrão:** "Avalie esta tela" (CSAT inline) aparece aqui também → **P16: o líder instrumenta CSAT em quase toda tela** (medição de satisfação pervasiva).

---

## 5. 🧾 Notas Fiscais → Consultar/Emitir NFS-e ⭐
`/sistema/#/consultarnotas` · menu: Emitir NFS-e · Como emitir · Importar · Consultar · Cancelar · Registrar notas tomadas · Ver alíquotas

**Resumo:** lista/busca de notas por período (mês/ano) + [Emitir nova NFS-e] + [Atualizar Lista]. Pra um CNPJ recém-aberto: vazio ("Nenhuma Nota Fiscal encontrada neste período").

**🔴 Achado de arquitetura:** este módulo vive num **shell mais ANTIGO** (`app.contabilizei.com.br/sistema/`) — visual mais cru, plain table — enquanto a Home é o painel novo (`/painel-de-controle/`). **São 2 gerações de UI coladas.** A costura aparece (barra do topo muda, estilo muda). Sinal de dívida técnica/legado que o cliente sente.

**Botões:** Emitir nova NFS-e (destaque) · Atualizar Lista · busca por número · seletor mês/ano + setas.

**✅ Positivos:** emitir sempre acessível; busca + navegação por período.
**❌ Negativos:** **inconsistência de UI** (módulo legado); depende de **certificado digital** (visto na Home, jargão + fricção); "NFS-e" cru; **empty state morto** ("nenhuma nota") — não guia o primeiro uso, justo o momento mais frágil do novo CNPJ.
**🔧 Melhoras:** o nosso **N24 já resolve** ("sua 1ª nota, passo a passo, sem pressa"); UI única e consistente; certificado nos bastidores; empty state que **convida** ("emita sua primeira nota, a gente te guia").
**🎯 Relevância:** **ESSENCIAL.** É o ato que "prova" que a empresa existe. O empty state + o certificado são exatamente onde o leigo trava — nossa chance de encantar no dia-1.

---

## 6. 📊 Relatórios (flyout de docs contábeis)
Itens: **Declarações mensais · Declarações anuais · Balanço patrimonial · DRE · Balancete · Razão · Diário.**

**Resumo:** hub dos relatórios/declarações contábeis. É a "entrega" de compliance que a contabilidade produz.
**✅ Positivos:** transparência total — o cliente pode baixar todos os documentos contábeis (bom pra banco/empréstimo/auditoria).
**❌ Negativos:** **100% jargão contábil** (DRE, Balancete, Razão, Diário) sem uma linha explicando o que é ou pra que serve. Pro dono leigo é grego — ele não sabe qual olhar nem por quê.
**🔧 Melhoras:** pro novo CNPJ, expor só **"suas declarações entregues ✓"** (a prova de que está em dia com o governo, que é o que ele quer sentir) e jogar os docs técnicos pra um "Relatórios contábeis (avançado)" com 1 linha de tradução em cada.
**🎯 Relevância:** **Declarações = ÚTIL** (prova de compliance, tranquiliza). **Balanço/DRE/Balancete/Razão/Diário = DISPENSÁVEL** no dia-a-dia do novo (existem por obrigação, quase ninguém abre).

---

## 7. 💳 Mensalidade → Central de planos ⭐⭐ (a RÉGUA de preço — dado vivo)
`/sistema/#/planos` · flyout: Meu plano · Ver faturas pendentes · Consultar histórico · Formas de pagamento

**A grade de preço COMPLETA (capturada ao vivo 21/07):**
| Plano | Preço/mês | Posicionamento | Destaques |
|---|---|---|---|
| **Básico** | **R$ 139** | "abertura grátis + gestão da contabilidade" | contabilidade completa · emissor NF grátis · e-mail 9–22h · **certificado cobrado à parte** · sem contador exclusivo · sem telefone |
| **Padrão** ⭐(atual do Pedro) | **R$ 195** (era ~~R$199~~, "R$4 OFF") | básico + certificado e-CNPJ grátis | + certificado e-CNPJ grátis · **R$2,70 por boleto** · ainda sem contador exclusivo/telefone |
| **Multibenefícios** | **R$ 225** | padrão + parceiros | + telemedicina + benefícios de parceiros |
| **Experts** | **R$ 395** | padrão + consultoria | + contador/consultoria exclusiva · **NF emitida PELA Contabilizei** · certificado incluso · WhatsApp estendido (18–22h) · folha · prioridade |
| *(oculto)* **Manutenção** | **R$ 79** | só p/ empresa SEM faturamento (dunning) | sem NF, sem WhatsApp, só mantém CNPJ regular |

**🔴 A pegadinha do preço:** cada plano diz "**a partir de**" + tem **cobrança variável** por cima: *"Cobrança de Faturamento (visualizar)"* + *"Cobrança de Funcionários (visualizar)"*. O preço real **escala com a receita e o headcount** — você só descobre clicando "visualizar". O anunciado é o piso.

**✅ Positivos:** 4 tiers claros, comparados lado a lado; badge "Seu plano atual"; nudge "R$4 OFF"; "Falar com especialista" pra quem não decide.
**❌ Negativos:** **preço real escondido** (a partir de + surcharges); **certificado cobrado à parte no básico** (surpresa clássica deles, já vista nos e-mails); **contador exclusivo e telefone só nos caros** (o básico R$139 não fala com humano por telefone); benefícios em jargão ("Emissor de NF**", asteriscos).
**🔧 Melhoras (nosso posicionamento):** **preço transparente de verdade** — mostrar o custo real pro perfil dele, sem "a partir de" nem surcharge-surpresa; **certificado incluído** (a gente já emite no B4); provavelmente **1 plano único simples** (mata a paralisia de escolha e o jogo de tiers).
**🎯 Relevância:** **ESSENCIAL — é a régua do nosso preço.** Confirma o **R$195 (Padrão)** que a gente usava de benchmark E revela o **piso real R$139 (Básico)** + o **R$79 (Manutenção)** + a mecânica de surcharge. Nosso pricing tem que atacar exatamente a opacidade deles. ⚠️ **Atualizar a memória de benchmark** com esses números.

---

## 8. 🏦 Conta Digital PJ (Contabilizei.bank)
*(mapeada pelo card da Home + modais P8/P9 — NÃO naveguei DENTRO do banco, por segurança: é conta real.)*
**Resumo:** banco PJ próprio (banco 301), integrado à contabilidade. Card na Home com dados + saldo oculto. A jogada: **integração bancária automatiza o envio de extrato** — e quem usa OUTRO banco tem que enviar extrato manual todo mês (P9: "senão, tributação incorreta").
**✅ Positivo:** extrato automático = menos rotina; conta + contabilidade num lugar.
**❌ Negativo:** **lock-in por fricção** — usar outro banco é penalizado (envio manual, medo de erro). É captura, não conveniência pura.
**🔧 Melhora:** integração bancária via **Open Finance (read-only)** com QUALQUER banco, sem forçar conta própria. Conveniência sem prender.
**🎯 Relevância:** ÚTIL (conciliação), mas é upsell/lock-in. Pro MVP: integrar extrato, não virar banco.

## 9–14. Superfícies secundárias (upsell / config / suporte) — glance
| # | Superfície | O que é | 🎯 Relevância (novo CNPJ solo) |
|---|---|---|---|
| 9 | **Serviços adicionais** (flyout) | à-la-carte: alterar contrato · solicitar documentos · regularizar pendências · ver todos | ÚTIL pontual (alterar endereço/contrato acontece), mas **cobrado à parte** |
| 10 | **Meus Benefícios + Plano de Saúde** | cross-sell: plano de saúde, telemedicina, TotalPass (academia) | **UPSELL** — dispensável no dia-1 |
| 11 | **Folha de Pagamento** | folha/eSocial | **DISPENSÁVEL** p/ solo sem funcionário (só quando contratar) |
| 12 | **Cobrar seu cliente** | emitir cobrança/boleto PRO cliente dele (recebíveis) | ÚTIL se fatura por boleto; supérfluo no dia-1 |
| 13 | **Minha conta / Dados da empresa** (topo) | cadastro da empresa/sócio/banco (badge "1" de pendência) | config, só leitura — ESSENCIAL de existir, raro de usar |
| 14 | **Ajuda / Fale conosco** | chat persistente (canto) + Ajuda no topo | suporte reativo; **no básico/padrão: sem telefone, só chat/e-mail 9–22h** |

---

# 📌 SÍNTESE (a parte pra amanhã)

## A. Veredito — o que o líder entrega × o que um CNPJ recém-aberto (plano básico) precisa
O portal do líder é **completo e denso, feito pra durar anos** — mas **hostil ao recém-chegado**: jargão contábil cru, obrigação misturada com upsell, e trabalho empurrado pro cliente (confirmar pagamento de imposto, enviar extrato, marcar guias). O que um CNPJ novo **de fato precisa** é um subconjunto pequeno: **emitir nota · pagar imposto · gerir pró-labore · sentir que está em dia.** O resto (Balanço, DRE, Folha, Benefícios) é obrigação de fundo ou upsell.

**A grande virada estratégica:** a força do líder (feature completa) é também o flanco. A gente ganha sendo **o oposto do que incomoda:** foco, transparência, e **fechar os loops que eles deixam abertos**.

## B. Matriz de funcionalidades → o que replicar no NOSSO app interno
| Funcionalidade | Essencial p/ novo? | Tem no básico deles? | Nossa prioridade |
|---|:--:|:--:|---|
| Emitir/consultar nota (NFS-e) | 🟢 essencial | sim (emissor grátis; certificado à parte) | **P0** — com o N24 guiando a 1ª nota |
| Ver + **pagar** imposto (DAS) | 🟢 essencial | sim (mas confirmação manual) | **P0** — pagar/saber status pelo app, sem "confirme que pagou" |
| Pró-labore / Fator R (gestão inteligente) | 🟢 essencial | sim (valor pronto, sem simulador) | **P0** — nosso N18 interativo é o diferencial |
| Central de Rotinas ("o que fazer hoje") | 🟢 essencial | sim (densa) | **P1** — versão enxuta, 1 foco |
| Declarações entregues (prova de compliance) | 🟡 útil | sim (jargão) | **P1** — "você está em dia ✓", sem DRE cru |
| Conciliação / extrato bancário | 🟡 útil | sim (lock-in no banco deles) | **P2** — Open Finance, sem forçar banco |
| Relatórios contábeis (DRE/Balanço/Razão) | 🔵 dispensável | sim | **P3** — atrás de "avançado" |
| Folha · Benefícios · Cobrar cliente · Serviços | 🔵 upsell/depois | parcial (upsell) | **backlog** — não no MVP interno |

## C. Backlog de oportunidades (os gaps do líder = onde a gente ganha)
1. **Pagar o imposto pelo app** (eles fazem você confirmar manualmente se pagou) → **maior gap, maior encanto.**
2. **Pró-labore INTERATIVO** (eles mostram número pronto; a gente deixa mexer e ver o imposto mudar) → nosso N18.
3. **Zero jargão** (DRE/DARF/competência/duplo-vínculo traduzidos) → a Central de Rotinas deles é jargão puro.
4. **Preço transparente** (eles escondem em "a partir de" + surcharge de faturamento/funcionários) → nosso 1 plano claro.
5. **Certificado nos bastidores** (eles cobram à parte no básico e mandam "emita na prefeitura") → a gente já emite no B4.
6. **Onboarding do dia-1** (empty states deles são mortos: "nenhuma nota") → nosso N24 guia a 1ª nota/1º imposto.
7. **Sem vender pânico** (a máquina de dunning deles é medo: exclusão do Simples, multas R$450, "o que você perde") → nosso posicionamento é o oposto.
8. **UI única** (eles têm 2 gerações coladas: painel novo × /sistema/ legado) → a gente nasce consistente.
9. **Integração bancária sem lock-in** (Open Finance, não "use nosso banco ou envie extrato manual").

## D. Por onde COMEÇAR a montar a parte interna (recomendação)
Construir o portal na ordem da **necessidade real do novo CNPJ**, replicando só o essencial e vencendo nos gaps:
1. **Home enxuta** = "o que fazer hoje" (1 foco: a próxima obrigação) + atalho pra emitir nota e ver imposto. (não a home-catálogo deles)
2. **Módulo Imposto** = ver o DAS + **pagar pelo app** (ou status automático). O gap nº1.
3. **Módulo Nota** = emitir/consultar + o **guia da 1ª nota** (N24). Certificado invisível.
4. **Módulo Pró-labore** = o N18 interativo (já temos a mecânica). O diferencial-âncora.
5. **Prova de compliance** = "você está em dia ✓" (declarações entregues), sem despejar DRE.
6. Depois: conciliação bancária (Open Finance), relatórios avançados, e os upsells — **backlog**, não MVP.

> **Regra de ouro do dossiê:** a gente não copia a plataforma do líder. A gente **pega o subconjunto que o novo precisa, fecha os loops que eles deixam abertos, e tira o pânico e o jargão.** É menos tela, mais clareza.

