---
tipo: hub
status: vivo
dominio: produto
data: 2026-09-14
assunto: dossie-contabilizei
tags: [produto, evidencia, dossie, indice, persona-zero, sensivel]
---

# 🗂️ O dossiê da Contabilizei — índice de tudo que foi lido

> 🔒 **Contém links para arquivos com DADO PESSOAL EM CLARO.** Não colar em prompt de agente, em vault do Léo, em handoff pro dev nem em issue.

**O que esta nota é:** o mapa do que já foi lido dentro da plataforma do líder, **em que ordem**, por **qual método**, e o que cada peça cobre. Nasceu de uma auditoria pedida pelo Pedro em 14/09: os 30 arquivos estavam bem escritos e bem ligados entre si, mas **não havia nenhuma nota dizendo que eles formam um conjunto**. Quem chegasse depois (Mauro, advogada, dev) navegava por sorte.

## 📐 As duas camadas, e a diferença entre elas

| Pasta | O que é | Quem usa |
|---|---|---|
| `produto/me/_evidencias/` | **leitura analisada** — o achado, a aritmética refeita, a etiqueta de 3 vias, o que não prova | nós, para decidir produto |
| `produto/me/_evidencias/fontes/` | **texto literal salvo**, 100%, sem paráfrase | advogada e contador, para conferir sem depender da minha leitura |

⚠️ A separação é regra, não arrumação: paráfrase minha não é o que profissional valida ([[legalize-leitura-integral-documento]]).

## 🔖 A etiqueta de 3 vias

Toda evidência classifica o que encontra em uma de três:

⚖️ **obrigação legal** (copiar, citando a lei) · 🏢 **decisão deles** (decidir de novo, do zero) · 🐛 **defeito ou interesse deles** (não copiar).

---

## 1 · 🧪 A varredura CRONOLÓGICA (persona zero) — 13 a 14/09

**Método:** usar a empresa real do Pedro como cliente fixo e percorrer **a ordem real de execução**, da constituição do CNPJ (12/12/2025) em diante, mês a mês. Fonte externa só onde a conta do líder não responde. Doutrina em [[legalize-metodo-cronologico-persona-zero]].

### 1.1 · A constituição e os documentos

| Nota | Cobre |
|---|---|
| [[constituicao]] | 🏠 **a casa do estudo** — 90 campos em 19 telas instanciados com os valores reais |
| [[2026-09-13-contrato-social-persona-zero]] | as 16 cláusulas, as duas datas de nascimento, o objeto social |
| [[2026-09-13-documentos-municipais-da-abertura]] | Alvará, Termo de Compromisso, dispensas, renovação 2030 |
| [[2026-09-13-ecac-procuracao-e-caixa-postal]] | procuração de 5 anos com confissão de débitos, DTE, intimação não lida |
| [[2026-09-13-certificado-16-minutos-e-o-contrato-que-nunca-chegou]] | certificado em 16 min; o contrato social que o líder nunca entregou |
| [[2026-09-13-cartao-cnpj-persona-zero-LITERAL]] | 📄 cartão CNPJ, texto literal |

### 1.2 · A cadeia de e-mails

| Nota | Cobre |
|---|---|
| [[2026-09-13-cadeia-de-emails-da-abertura]] | 10/12 a 15/12 — a abertura vista de fora |
| [[2026-09-13-email-abertura-11-12-confirmacao-de-dados]] | o e-mail de confirmação de dados |
| [[2026-09-13-cadeia-de-emails-22-12-a-20-01]] | 🔑 **o R$139 é promoção de 3 meses**; TFE R$168,48; 5 avisos em 4 dias; "Cobre Seu Cliente" |

### 1.3 · As obrigações mês a mês

| Nota | Cobre |
|---|---|
| [[2026-09-13-teardown-prolabore-e-pgdas-conta-real]] | o recibo do PGDAS-D que provou o **arredondamento por tributo** |
| [[2026-09-14-declaracoes-mensais-serie-completa]] | 9 competências de PGDAS + DCTFWeb; um CPF humano transmite tudo |
| [[2026-09-14-declaracao-anual-e-informe-de-rendimentos]] | DEFIS; Informe; a trava de distribuição de lucro |
| [[2026-09-14-recibos-de-prolabore-e-cadastro-do-socio]] | 🔑 os recibos por dentro; **qualificação cadastral pendente**; a 3ª data |

### 1.4 · Os relatórios contábeis (7 de 7)

| Nota | Cobre |
|---|---|
| [[2026-09-14-api-relatorios-endpoints]] | a camada de API; as 21 feature flags por CNPJ |
| [[2026-09-14-balanco-patrimonial-serie-mensal]] | 🔑 **a contabilidade não vê dinheiro**; o piso do pró-labore medido |
| [[2026-09-14-dre-balancete-razao-diario]] | 🔑 **retirada sem lucro vira empréstimo ao sócio**; a nota cancelada sem rastro |

---

## 2 · 🔬 O teardown por FUNCIONALIDADE — 09 a 12/09

**Método anterior:** varrer o painel funcionalidade a funcionalidade, refazendo toda aritmética. Continua válido como fonte; o hub de cruzamento é [[_mapa-de-cruzamentos]].

| Nota | Cobre |
|---|---|
| [[2026-09-09-contabilizei-aliquotas]] · [[2026-09-09-contabilizei-guia-imposto]] | alíquota, enquadramento, a guia do DAS |
| [[2026-09-09-contabilizei-nota-fiscal]] · [[2026-09-12-contabilizei-emissao-nf-fluxo-completo]] | emissão de NFS-e, ponta a ponta |
| [[2026-09-09-contabilizei-pro-labore]] · [[2026-09-09-contabilizei-folha-pagamento]] | pró-labore e folha |
| [[2026-09-09-contabilizei-central-rotinas]] | a central de rotinas |
| [[2026-09-12-pbh-nfse-nacional-portaria-75]] · [[2026-09-12-nfse-nacional-eventos-cancelamento]] | 📚 fonte externa: BH e o Emissor Nacional |

---

## 3 · 📄 As fontes literais (`fontes/`)

Texto 100%, salvo para validação profissional. Inventário próprio em [[_inventario-documentos]].

[[2026-09-10-contabilizei-contrato-LITERAL]] · [[2026-09-10-contabilizei-aceites-LITERAL]] · [[2026-09-10-contabilizei-plano-contratado-LITERAL]] · [[2026-09-11-contabilizei-modelo-de-cobranca]] · [[2026-09-10-contabilizei-contrato-integral]]

E três pastas de captura bruta: `nfse-nacional-2026-09-12/` (19 arquivos) · `pbh-nfse-2026-09-12/` (2) · `pesquisa-motor-fiscal-2026-09-13/` (1).

---

## 4 · 🎯 Para onde vai o que foi encontrado

Evidência **não decide nada sozinha**. Cada achado que exige ação sai daqui para um destes:

| Destino | O que recebe |
|---|---|
| [[acionaveis]] | 🔨 adaptar · ⚖️ decidir · ❓ perguntar — com dono nomeado |
| [[fila-validacao-humana]] | as perguntas que só pessoa responde (Mauro, Ademar, advogada) |
| [[PENDENCIAS]] | 📞 a **vista consolidada** de tudo que está aberto, agrupada por quem resolve |
| [[decisoes-marca]] | o ADR: toda decisão travada, datada, com o racional |
| `execucao/processos/cru/` | o que vira regra de processo |
| [[HOME]] §Agora | o estado corrente |

---

## 5 · ✅ Estado da auditoria (14/09)

| Verificação | |
|---|---|
| Frontmatter completo | ✅ 30/30 |
| Seção `## Links` | ✅ 30/30 |
| Links quebrados | ✅ zero |
| Vocabulário fora de escopo | ✅ limpo |
| Órfãos | ✅ zero (era 1, ligado nesta rodada) |

### 🔴 O que a auditoria achou de aberto e ainda não tem dono

| Item | Onde nasceu |
|---|---|
| **"Em breve o acesso ao e-CAC será desativado"** — migração pro gov.br. Muda a infraestrutura em que nossa procuração se apoia | [[2026-09-13-ecac-procuracao-e-caixa-postal]] |
| **Aviso prévio de 30 dias** no contrato do líder — citado, sem dono | [[2026-09-10-contabilizei-contrato-integral]] |
| **Licenciamento sanitário estadual** — a dispensa municipal aponta pro estado e para aí | [[2026-09-13-documentos-municipais-da-abertura]] |

Os três entraram em [[acionaveis]] nesta rodada.

## Links
[[constituicao]] · [[acionaveis]] · [[_mapa-de-cruzamentos]] · [[_inventario-documentos]] · [[fila-validacao-humana]] · [[decisoes-marca]] · [[PERSONA]] · [[HOME]]
