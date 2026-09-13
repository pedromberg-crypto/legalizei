---
tipo: operacao
status: vivo
data: 2026-09-13
assunto: checklist-de-lancamento-mlp
autoridade: fonte-verdade
tags: [execucao, lancamento, mlp, checklist]
---

# 🚀 Lançamento do MLP — o que falta, por dono

> 🧭 **Autoridade:** manda no **estado do lançamento**. É o único lugar onde a lista existe inteira — antes de 13/09 ela morava espalhada em oito docs e só completa na cabeça do Pedro.
>
> ⚠️ **Doc VIVO, editado no lugar.** Não é log: quando um item vira ✅, ele muda de estado aqui e sobe pro topo da sua tabela. O histórico das decisões fica no ADR ([[decisoes-marca]]).
>
> 🔒 **Escopo: MLP, não sistema pronto.** O corte é *"o mínimo que pode ser vendido e entregue sem mentir"*, não *"tudo que a lista de 58 promete"*.

**31 itens · ✅ 12 prontos · 🟡 16 pendentes · 🔴 3 críticos**

---

## 👤 Pedro

| # | | Item | Onde está |
|:--:|:--:|---|---|
| 1 | ✅ | **Funcionalidades core escritas** | 58 itens em 8 categorias, lista ratificada, semáforo derivado. [[FUNCIONALIDADES]] |
| 2 | ✅ | **Decisão: pós-guia + assinaturas = atendimento interno próprio** | Telas do trecho assistido já existem (`A3.H → A5.H`) |
| 3 | ✅ | **Stone contratada** | Meio de pagamento fechado |
| 4 | ✅ | **Arquitetura do Léo desenhada e alimentada** | Vault isolado, 12 arquivos, CNAEs como tool com gate de confiança |
| 5 | ✅ | **APIs resolvidas** | Públicas sem custo de contratação + **InfoSimples contratada e com crédito** |
| 6 | 🟡 | **Desenho minucioso dos processos internos** | 2 de 8 categorias fechadas (Notas · Impostos). `execucao/processos/cru/` |
| 7 | 🟡 | **Adaptação das telas depois do levantamento** | Ver **o que reaproveita · o que corrige · o que cria do zero** pras funcionalidades core rodarem redondas. **Depende do 6** |
| 8 | 🟡 | **Contrato com a advogada** | Minuta enviada; ela adapta com base no da Contabilizei. Depende da entrega dela |
| 9 | 🟡 | **Certificadora parceira** | Existe, ainda não conversada. Plano B: a que a Legalize Group já usa nos atenderia no início, e dá pra passar leads avulsos como clientes comuns da contabilidade |
| 10 | 🟡 | **Levantar os cálculos do motor fiscal** | Com o que já temos + **validação com contadores especializados** |

## 💻 Devs

| # | | Item | Onde está |
|:--:|:--:|---|---|
| 11 | ✅ | **Entrada do app → emissão da guia da Junta**, back + front | Testado pelo programador de frontend |
| 12 | ✅ | **Empacotamento do app** | Feito e **testado em `.apk`** |
| 13 | ✅ | **Criação de conta na entrada** | Dados + senha captados nas primeiras perguntas; conta efetivada após o pagamento. A pessoa já é lead e usuária |
| 14 | 🟡 | **Conexão da Stone** | Em andamento |
| 15 | 🟡 | **Certificar que TODAS as dúvidas de pagamento foram sanadas** | Já debatido pessoalmente; confirmar por escrito. Inclui o **mandato recorrente** (o pagamento da abertura deixa forma salva pra mensalidade?) |
| 16 | 🟡 | **RPA: o que adaptar ou refazer pro ME Simples** | Em leitura/início |
| 17 | 🟡 | **Léo: conectar + configurar pra iniciar testes** | Arquitetura básica pronta |
| 18 | 🟡 | **Protótipo da plataforma de CRM e Gestão** | Criado pelo **Natanael**. É a base; precisa ser reavaliado e adaptado pro início |
| 19 | 🟡 | **CRM — leads de constituição ME** | Depende do 18 |
| 20 | 🟡 | **CRM — atendente conduzir as assinaturas até a certificadora** | Depende do 18 |
| 21 | 🟡 | **CRM — subir certificado digital + senha no usuário** | Depende do 18 |
| 22 | 🟡 | **Cadastro Play Store / Apple Store** | O pacote existe; falta a conta nas lojas |
| 23 | 🔴 | **Aplicação das 8 funcionalidades core no MLP** | É o produto que a assinatura paga, e hoje só existe como tela de mockup. As 8 categorias: **🏠 Home e navegação · 🏛 Impostos · 🧾 Notas fiscais · 👥 Pró-labore e sócios · ✅ Estar em dia · 📄 Documentos e certificado · 💳 Plano e cobrança · 👷 Folha de pagamento** |

## 📣 Tráfego + Social

| # | | Item | Onde está |
|:--:|:--:|---|---|
| 24 | ✅ | **Site no ar** | `legalizai.com.br` em modo pré-lançamento; vira site normal com um comando |
| 25 | ✅ | **LP de lista de espera no ar** | Coorte fundador R$79 nos 3 primeiros meses |
| 26 | ✅ | **Meta conectado, configurado e rendendo leads** | Campanha viva |
| 27 | ✅ | **Peças da campanha atual** | 24 peças feitas externamente, alinhadas com a campanha de lista de espera promocional |
| 28 | 🟡 | **Google indexado com o site novo** | `canonical`, `og:url` e `sitemap` já apontam pra raiz desde 08/09 — nada precisa ser reaprendido pelo buscador. Falta saber se a propriedade foi verificada e o sitemap submetido |
| 29 | 🟡 | **Campanha do Google no lançamento** | Vai rodar. **Budget sobe para R$ 5.000.** ⚠️ `frente-1-captacao-meta-bh` ainda registra Google como "adiado pro V1" — o doc está desatualizado |
| 30 | 🟡 | **Calendário editorial do lançamento** | **Não existe como documento** |
| 31 | 🔴 | **Número oficial de WhatsApp** | ❓ **Um número só serve pro Léo e pro atendimento, ou precisam ser dois?** Hoje as 4 CTAs de WhatsApp estão **ocultas na LP** porque o número é placeholder |

---

## 🔗 A corrente crítica

```
6  desenhar os processos (2 de 8)
     ↓
7  decidir o que reaproveita, corrige e cria do zero
     ↓
23 construir as 8 funcionalidades core
```

🔴 **O 23 não pode começar antes do 7, e é o item mais pesado da tabela inteira.** É o que separa "vendemos uma abertura" de "temos uma assinatura".

## ⚠️ O que ficou de fora do MLP, de propósito

Corte proposto em 13/09, ainda **não ratificado pelo Pedro**:

**Fica:** emitir nota · ver e baixar a guia do DAS · pró-labore interativo · documentos · plano e fatura.

**Sai:** simulador de impostos · débito automático · notas tomadas · relatórios contábeis · DECORE · **a folha inteira** (§8, 9 itens, zero processo, e ME de serviço quase nunca tem funcionário).

**Fica, mas com gente em vez de automação:** *saber que o imposto foi pago* (o 🔴 nº 1, e é **decisão**, não descoberta) · retificação · certidões.

## ⚠️ Um ponto a confirmar no item 5

A [[_matriz-dependencia]] registra que **emitir a guia do DAS (PGDAS-D) sai pelo Serpro Integra Contador, ~R$300/mês** — não por API pública. Se o caminho mudou, **escrever qual é**, porque a matriz vai continuar dizendo Serpro pro próximo que ler.

## Links
- [[FUNCIONALIDADES]] · [[_matriz-dependencia]] · [[HANDOFF-DADOS]] · [[decisoes-marca]]
- Processos: `execucao/processos/cru/` (modo cru, por categoria) · [[PROCESSOS]] (formato completo, P1–P6)
