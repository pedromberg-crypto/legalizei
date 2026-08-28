---
tipo: derivado
status: proposta
data: 2026-08-28
assunto: cruzamento-flow-mei-vs-me
deriva_de: [abertura-mei-processo]
tags: [mei, flow, telas, produto, constituicao, proposta]
---

# 🔀 Flow de MEI × flow de ME — o que aproveita, o que muda, o que nasce

> Cruzamento de [[abertura-mei-processo]] (o que a lei e o Portal exigem) com `execucao/flow/flow-data.mjs` (o flow de ME que já existe, E1→C7→A5). **Proposta pra aprovação do Pedro** — nada implementado.

## A pergunta que muda tudo

No **ME**, o modelo é: *a gente executa, o cliente assina no fim*. A gente entra na JUCEMG, monta o DBE, protocola, acompanha status.

No **MEI**, isso é **legalmente impossível**. Não existe API, não existe procuração que cubra o registro, e usar a senha gov.br do cliente viola os Termos de Uso. **Quem clica é obrigatoriamente o titular.**

E a abertura em si é **grátis e leva minutos**.

> Então a pergunta não é "como adapto o flow". É: **o que a gente vende, se a abertura é grátis e a gente não pode executá-la?**

**Minha resposta:** vendemos **não errar** + **o ano seguinte**. O difícil do MEI nunca foi preencher o formulário — é saber *qual ocupação* (com o limite interno da Cosit 27/2021), *se você pode* (os 5 bloqueios), *o que declarar*, e depois *manter em dia* (as 14 funcionalidades de [[mei-mapeamento-funcionalidades]], incluindo o monitor de teto que nenhuma ferramenta oficial tem).

## Tabela 1 — o flow atual, tela por tela

Legenda: ✅ aproveita como está · 🔧 aproveita com adaptação · ❌ não se aplica · 🆕 nasce novo

| # | Tela hoje (ME) | MEI | O que muda e por quê |
|---|---|---|---|
| E1 | Splash | ✅ | Igual |
| E2.1-2.3 | Welcome (3 telas) | ✅ | Igual |
| E3 | Fork abrir/migrar/login | ✅ | Igual |
| E3.1 | **Dados pessoais** (nome/email/telefone) | ✅ | Igual — e fica **mais valioso**: telefone e e-mail são campos literais do formulário oficial |
| E3.2 | **MEI × ME** | ✅ | **Já existe e já bifurca.** Hoje o ramo MEI só serve pro Migrar. É aqui que o novo caminho pendura |
| E3.4 | **Endereço + categoria** | 🔧 | Endereço serve (o MEI pede comercial + residencial). **A categoria não**: 3 das 14 pills ficam vazias no MEI (tech 0/8, design 0/4, consultoria 0/5). Precisa de lista própria |
| E5T | **Triagem de sócios** | ❌ | MEI não tem sócio. Mas o slot não fica vazio — vira a triagem de impedimento (🆕 abaixo) |
| E5F | **Faixa de faturamento** | 🔧 | **Fica mais importante.** Vira o gate do teto R$81k. Acima disso, MEI não serve e a saída é honesta (vira ME) |
| E6 | Criar conta (senha + CPF) | ✅ | Igual |
| E7 | Plano | 🔧 | Preço próprio (R$49 travado no ADR 20/08). **A copy precisa mudar**: não pode dizer "abrimos pra você" |
| E8 | Contrato | 🔧 | Cláusulas próprias — em especial **o que é e o que não é nosso** na abertura |
| E9 | Pagamento | ✅ | Igual |
| C0 | **Atividade / CNAE** | 🔧 | Vira escolha de **ocupação** do Anexo XI, não CNAE. Já temos o de-para (`mei_ocupacoes`, 351/351) |
| C0.2 | Veredito CNAE | 🔧 | Vira "sua ocupação é X" + **o aviso do limite interno** (o que você NÃO pode fazer dentro dela) |
| C1 | Dados do sócio | 🔧 | Vira "dados do titular". **Acrescenta RG + órgão emissor + UF + nome da mãe** (campos do formulário oficial) |
| C2 | Vínculo INSS | 🔧 | Muda de sentido: no ME é pró-labore/INSS. No MEI vira **checagem de benefício** (invalidez/maternidade/seguro-desemprego → a formalização cancela) |
| C3 | Sócios | ❌ | MEI é unipessoal por definição |
| C4 | Dados da empresa | 🔧 | Encolhe muito: **capital social** (sem mínimo) + **forma de atuação** (7 opções, multi) + **nome fantasia** (opcional) |
| C5 | CNAE secundários | 🔧 | Vira **ocupações secundárias, até 15** |
| C6 | Natureza jurídica | ❌ | Sempre 213-5, automático. Não é escolha |
| C7 | Nome / razão social | ❌ | Razão social é **gerada** (CNPJ + nome civil, Lei 14.195/2021). Só sobra nome fantasia, que cabe no C4 |
| A1 | Revisar dossiê | ✅ | Mesma função, outro conteúdo. **Fica crítico** — é o último check antes de o cliente digitar no gov.br |
| A2 | Termo irreversível | 🔧 | Vira as **3 declarações oficiais** (desimpedimento · opção SIMEI · Termo de Ciência/dispensa de alvará) — explicadas, não só aceitas |
| A3 | Painel 4 status | 🔧 | Não tem espera de órgão (CNPJ é síncrono). Vira **painel da sessão guiada** |
| A3.1 | Órgão recusa | 🔧 | Vira **tela de bloqueio** com os motivos reais (já sócio · servidor federal · benefício) |
| A3.2 | Certificado digital | ❌ | **Dispensado na abertura.** Vira, no máximo, aviso de nível gov.br |
| A4 | Assinatura dos sócios | ❌ | Não existe. A assinatura é o aceite dentro do gov.br |
| A5 | Home dia-1 | ✅ | Igual — e chega **no mesmo dia**, não em semanas |

**Placar:** 8 ✅ aproveita direto · 12 🔧 adapta · 6 ❌ não se aplica.

## Tabela 2 — o que nasce novo

| Novo | O que é | Por que precisa existir |
|---|---|---|
| 🆕 **M-T · Triagem de impedimento** | 3 perguntas duras: você é sócio/titular de outra empresa? é servidor público federal? recebe aposentadoria por invalidez, salário-maternidade ou seguro-desemprego? | São os bloqueios que **o governo aplica automaticamente**. Descobrir depois do pagamento é o pior caso possível. Ocupa o slot que era do E5T |
| 🆕 **M-O · Escolha de ocupação** (com limite interno) | Ocupação principal + até 15 secundárias, com o aviso explícito do que **não** está incluído | Solução de Consulta Cosit 27/2021: a ocupação é mais estrita que o CNAE. Errar aqui = exercer atividade proibida sem saber |
| 🆕 **M-G · Nível da conta gov.br** | Checa/orienta: tem conta Prata ou Ouro? Se não, como elevar (internet banking, biometria TSE/CNH) | Sem isso ele **não consegue** abrir. É pré-requisito técnico, e a maioria não sabe qual nível tem |
| 🆕 **M-S · Sessão guiada de formalização** | A tela mais importante do ramo. Passo a passo do Portal do Empreendedor com **os valores dele já prontos** pra copiar/colar, campo por campo, na ordem exata | É a única forma legal de entregar valor no ato da abertura. Substitui o A3/A4 do ME |
| 🆕 **M-C · Confirmação pós-abertura** | Cliente informa o CNPJ gerado → validamos na Receita (InfoSimples) → puxamos CCMEI/Cartão CNPJ | Fecha o loop: precisamos do CNPJ real pra começar a operar as 14 funcionalidades |
| 🆕 **M-N · Primeiro acesso ao Emissor Nacional** | Guia o primeiro acesso em nfse.gov.br | Achado da pesquisa: o MEI **não** está apto a emitir NFS-e no minuto seguinte à abertura, precisa de cadastro secundário |

## Como eu aplicaria (minha recomendação)

### Princípio: o MEI não é um flow paralelo, é um **ramo** que reencontra o tronco

Construir dois flows completos duplicaria 8 telas idênticas e criaria duas fontes de verdade — exatamente o que a doutrina de **fidelidade por construção** proíbe. O ramo deve ser o mais curto possível.

### A ordem que eu proponho

```
E1 → E2.1-2.3 → E3 (fork) → E3.1 dados pessoais
                                   ↓
                            E3.2 MEI × ME
                    ┌──────────────┴──────────────┐
                 [ME]                           [MEI]
                    │                              │
              E3.4 endereço+categoria      E3.4 endereço + categoria-MEI  🔧
                    │                              │
              E5T triagem sócios           M-T triagem de impedimento     🆕
                    │                              │
              E5F faixa                    E5F faixa (gate do teto 81k)   🔧
                    └──────────────┬──────────────┘
                          E6 conta · E7 plano · E8 contrato · E9 pagamento
                    ┌──────────────┴──────────────┐
                 [ME]                           [MEI]
              C0 atividade/CNAE            M-O ocupação (+ limite interno) 🆕
              C1..C7 dossiê                C1' titular (+RG/mãe)          🔧
                    │                      C2' benefício                  🔧
                    │                      C4' capital+atuação+fantasia   🔧
                    │                      M-G nível gov.br               🆕
              A1 revisar                   A1' revisar                    🔧
              A2 termo                     A2' as 3 declarações           🔧
              A3 painel · A3.2 cert · A4   M-S sessão guiada              🆕
                    │                      M-C confirmar CNPJ             🆕
                    │                      M-N primeiro acesso NFS-e      🆕
                    └──────────────┬──────────────┘
                              A5 home dia-1
```

**Reencontros do tronco:** o bloco de dinheiro (E6→E9) e o A5 são **compartilhados**. Só bifurca onde a lei obriga.

### 4 decisões de produto que isso força (precisam do Pedro)

**1. 🔴 O que vendemos no MEI?** A abertura é grátis. Minha proposta: reposicionar de *"a gente abre pra você"* para *"a gente garante que você abre certo, e cuida do resto do ano"*. Isso é honesto, é defensável, e é onde o valor real está. **A copy do E7/E8 depende dessa decisão.**

**2. 🔴 A gente cobra ANTES ou DEPOIS da abertura?** Hoje o ME cobra no E9, antes do dossiê. No MEI, a abertura é ato do cliente — cobrar antes e ele travar no gov.br gera pedido de reembolso por algo que não controlamos. **Minha recomendação: manter a cobrança antes**, porque a triagem de impedimento (M-T) já filtra 100% dos bloqueios conhecidos antes do dinheiro. Mas é decisão sua.

**3. 🟡 A lista de categorias do MEI é subconjunto ou lista própria?** 3 das 14 pills ficam vazias. **Minha recomendação: mesma lista, com as 3 desabilitadas e um motivo honesto** ("Dev, designer e consultor não podem ser MEI — a lei considera profissão intelectual. Te mostro o ME."). Isso converte uma porta fechada em upsell honesto, em vez de fingir que a categoria não existe.

**4. 🟡 A sessão guiada (M-S) é tela ou é humano?** Pode ser: (a) tela nossa lado a lado com o portal; (b) WhatsApp com contador conduzindo; (c) os dois. **Minha recomendação: (a) no V1**, com (b) como escada de suporte — a tela escala, o humano não.

### O que já temos pronto e não precisa pesquisar de novo

| Insumo | Onde vive | Estado |
|---|---|---|
| As 351 ocupações do Anexo XI, com de-para CNAE | `pesquisa/cnae-matriz/cnae-matriz.json`, campo `mei_ocupacoes` | ✅ 351/351 preenchidas |
| Os 51 CNAEs que atendemos **e** aceitam MEI | `cnae-atendemos-certeza.json`, campo `atende_mei_certeza` | ✅ pronto |
| Regras de teto/proporcionalidade/desenquadramento | [[mei-obrigacoes-operacionais]] §5 | ✅ com fonte |
| As 14 funcionalidades pós-abertura | [[mei-mapeamento-funcionalidades]] | ✅ pronto |
| Preço MEI R$49 | ADR `decisoes-marca.md` 20/08 | ✅ travado com Mauro |
| Variante `?regime=mei` do portal | `layout.tsx`, `inicio`, `mais`, `/mais/colaborador` | 🟡 existe no código, fora do mapa |

### Ordem de implementação que eu sugiro

1. **Primeiro o flow-data** (`flow-data.mjs`): nós novos + arestas do ramo. Barato, reversível, e gera o mapa pra você conferir antes de existir código.
2. **Depois as 3 telas de gate** (M-T, E3.4 adaptada, E5F): são as que impedem venda errada. Maior valor por linha de código.
3. **Depois o dossiê** (M-O, C1', C2', C4'): reaproveitam componentes existentes.
4. **Por último a sessão guiada** (M-S) — é a mais cara de desenhar e a que mais depende da decisão nº 4.

## Links
- [[abertura-mei-processo]] — a fonte dos fatos.
- [[mei-mapeamento-funcionalidades]] · [[mei-obrigacoes-operacionais]] — o depois.
- `execucao/flow/flow-data.mjs` — onde isso vira nó.
- `execucao/portal/portal-data.mjs` — 🟡 defasado, ver [[2026-08-27-mei-obrigacoes-mapeamento-e-drift-do-portal]].
