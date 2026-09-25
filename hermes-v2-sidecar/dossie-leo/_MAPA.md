---
tipo: indice
status: vivo
data: 2026-09-25
assunto: dossie-super-leo
papel: "O contrato de fronteiras da Lei Zero. Diz onde cada fato mora, e não guarda fato nenhum."
tags: [dossie, leo, rag, indice, lei-zero]
---

# 🗺️ MAPA DO DOSSIÊ (ONDE CADA FATO MORA)

> 🔴 **Esta nota não contém fato nenhum, e isso é proposital.** Ela é o índice de fronteiras. Se um número, preço ou regra aparecer aqui, ela vira a segunda casa daquele fato e quebra a Lei Zero por dentro do instrumento que existe para protegê-la.

## 1. A Lei Zero, dita para quem vai escrever

**Todo fato tem UMA casa.** Quando um arquivo precisa de um fato que mora em outro, ele **aponta** e não copia.

A redundância não é desperdício de espaço: é **contradição em potencial**. Duas cópias do mesmo número envelhecem em ritmos diferentes, e no dia em que divergem o modelo recupera as duas e escolhe uma sem saber que escolheu. Foi medido nesta casa em 25/09: a regra de recusa por MEI estava escrita numa fonte dizendo uma coisa e noutra dizendo o oposto, e ganhou a que fechava a venda.

## 2. Qual arquivo responde qual pergunta

| A pergunta do cliente é sobre | Abra |
|---|---|
| "vocês atendem *isso*?", teto de faturamento, cidade, tipo de empresa, sócios | `01-escopo.md` |
| como dizer não, o motivo da recusa, spam e provocação | `02-triagem.md` |
| quanto custa, o que inclui, promoção, MEI ou ME, como fechar | `03-comercial.md` |
| "tá caro", "vou pensar", "é golpe?", "faço sozinho no gov" | `04-objecoes.md` |
| anexo, alíquota, Fator R, como o imposto é calculado, pró-labore | `05-fiscal.md` |
| Prefeitura, IPTU, apartamento, Junta, taxa, Receita, quem pode ser MEI | `06-orgaos.md` |
| como o app funciona, o que ele pede, corrigir dado preenchido | `07-produto.md` |
| já é cliente: rotina do mês, emitir nota, documento, fatura, folha | `08-suporte.md` |
| 7 dias, fidelidade, multa, reembolso | `09-contrato.md` |
| o que o Léo nunca faz, escalar, canais oficiais, "você é robô?" | `10-conduta.md` |

## 3. As fronteiras que já causaram confusão, decididas

Estas não são óbvias. Foram decididas caso a caso, e a decisão fica escrita para não ser refeita de forma diferente na próxima dúvida.

| O fato | Mora em | Por que não no outro |
|---|---|---|
| **Quanto custa o endereço fiscal** | `03-comercial.md` | é preço, e preço tem uma casa só |
| **Por que o endereço fiscal existe** | `06-orgaos.md` | é a regra da Prefeitura que o torna necessário |
| **Quanto custa a taxa da Junta** | `06-orgaos.md` | não é nossa receita, é do Estado. Fica com o órgão que a cobra |
| **Que a taxa da Junta não estorna** | `09-contrato.md` | é regra de reembolso, não de órgão |
| **Os limites de quem a casa atende** | `01-escopo.md` | é fato de fronteira |
| **Como comunicar que está fora** | `02-triagem.md` | é comportamento, não fato |
| **Que o certificado é incluso no ME e não no MEI** | `03-comercial.md` | é composição de plano |
| **Que o certificado sustenta a fidelidade do ME** | `09-contrato.md` | é contrapartida contratual |
| **A régua MEI ou ME por faturamento** | `03-comercial.md` | é qualificação de venda |
| **Por que a lei proíbe certas atividades no MEI** | `06-orgaos.md` | é regra federal, não escolha nossa |
| **Como o imposto é calculado** | `05-fiscal.md` | não disputa com ninguém |
| **Que o cliente não recebe valor calculado por aqui** | `10-conduta.md` | é limite de conduta |

🔑 **O padrão das decisões acima:** separa-se **o fato** (quanto é, o que a lei diz) do **comportamento** (como falar, quando calar, quando escalar). O fato tem uma casa temática; o comportamento tem uma casa de conduta. Quando bate a dúvida "isso é dos dois", quase sempre são **dois fatos diferentes** que só parecem um.

### Dois números que aparecem em dois arquivos, e está certo

Conferidos à mão em 25/09, depois que a varredura os apontou. **Não são redundância: são fatos diferentes que por acaso têm o mesmo número.** Ficam registrados aqui para ninguém "consertar" um deles depois.

| Número | Em `05-fiscal.md` é | Em `09-contrato.md` é |
|---|---|---|
| **30%** | a margem de segurança do Fator R, acima do limiar legal | a multa sobre o saldo restante da fidelidade |
| **12 meses** | a janela retrovisora do RBT12 e do Fator R | o prazo de fidelidade, contado da emissão do CNPJ |

⚠️ Coincidência de número é armadilha de busca: quem procurar "30%" vai receber os dois. Por isso cada um aparece **sempre com o substantivo colado** ("margem", "multa"), nunca solto.

## 4. O que NÃO entra neste dossiê

* 🔴 **Os 1.332 CNAEs.** Eles têm estrutura própria, já validada, consultada por ferramenta. Nada aqui os descreve linha a linha, nem repete tabela de anexo por código. O que este dossiê guarda é **como ler o resultado da consulta**, e isso mora em `05-fiscal.md`.
* **Instrução de sistema.** Persona, tom e formato de mensagem são do prompt do Supervisor, não da base. Regra de comportamento perdida num arquivo de conteúdo pode ser recuperada e repetida ao cliente.
* **Bastidor.** Nome de arquivo, caminho de pasta, changelog. Vai no frontmatter, nunca no corpo: o corpo é lido inteiro.
* **Número sem fonte.** Valor que ninguém consegue apontar de onde saiu não entra, mesmo que pareça certo.

## 5. Como acrescentar sem quebrar a Lei Zero

1. **Procure antes de escrever.** O fato já existe em algum arquivo? Então a resposta não é escrever de novo, é **enriquecer onde ele já mora**.
2. **Se for fato novo, escolha a casa pela tabela do §2** e, se a escolha não for óbvia, **registre a decisão no §3** junto com o porquê.
3. **Referência aponta, não resume.** Escrever *"o teto do ME é R$ X, ver `01-escopo`"* cria a segunda cópia que a referência existia para evitar. A forma certa é *"o teto está em `01-escopo.md` §3, e você lê antes de responder"*.
4. **Um assunto por seção `##`.** A recuperação é por seção, não por arquivo: seção que mistura dois assuntos volta metade inútil em toda busca.
