---
tipo: operacao
status: decisao-aberta
data: 2026-09-25
assunto: dossie-super-leo
papel: "Onde foi parar cada uma das 13 notas antigas, e a decisão de corte que falta."
tags: [dossie, leo, rag, migracao, lei-zero]
---

# 🔀 MIGRAÇÃO (DE ONDE VEIO CADA COISA)

## 🔴 A decisão que falta, e ela é do Pedro

Esta pasta é **sucessora**, não irmã.

A base de conhecimento hoje carrega `_origem/vault-v12/.../references/` (13 arquivos, **102 trechos**) e o `CARTOES-PRODUTO.md` (**55 cartões**). Se o `dossie-leo/` entrar **junto** com as 13 notas, o mesmo fato passa a existir duas vezes na mesma tabela vetorizada, e **a Lei Zero morre no dia do deploy**, quebrada pelo próprio instrumento que veio protegê-la.

Então há duas saídas, e as duas são legítimas:

| | O que acontece |
|---|---|
| **A · Corte** | as 13 notas saem da carga e o `dossie-leo/` assume. Lei Zero preservada. Exige conferir que nada essencial ficou de fora, e este documento é a conferência |
| **B · Convívio temporário** | as duas bases carregam juntas por um período de teste. 🔴 Lei Zero suspensa enquanto durar, **com prazo declarado**, não indefinidamente |

⚠️ **O que não é opção:** deixar as duas convivendo sem decisão. É assim que a base envelhece em dois ritmos e o modelo passa a recuperar versões que se contradizem, escolhendo uma sem saber que escolheu.

## De onde veio cada coisa

| Nota antiga | Foi para |
|---|---|
| `00-DIRETRIZES-SEGURANCA` | `10-conduta.md` (isolamento, proibições, escalação, transparência) · personalidade e falas de referência **não vieram**: são prompt, não base |
| `01-PLANOS-E-OFERTAS` | `03-comercial.md` (preços, composição, promoção) · canais → `10-conduta.md` |
| `02-PRODUTO-E-USABILIDADE` | `07-produto.md` inteiro |
| `03-REGRAS-DOS-ORGAOS` | `06-orgaos.md` · o preço do endereço fiscal → `03-comercial.md` |
| `04-QUEBRA-OBJECOES` | `04-objecoes.md`, reescrita: as 24 objeções viraram **movimento** (o que a pessoa está dizendo · a armadilha · o que resolve), sem repetir número |
| `05-DICIONARIO-CNAE-TRIBUTARIO` | `05-fiscal.md` · a régua MEI×ME → `03-comercial.md` · o filtro federal do MEI → `06-orgaos.md` |
| `06-CALCULO-FISCAL` | `05-fiscal.md` |
| `07-OBRIGACOES-MENSAIS` | `08-suporte.md` |
| `08-MAPA-DO-DOSSIE` | `07-produto.md` §4 e §5 |
| `09-ESCOPO-E-LIMITES` | `01-escopo.md` |
| `10-CONTRATO-GARANTIA-CANCELAMENTO` | `09-contrato.md` |
| `11-COMO-CONSULTAR-CNAE` | `05-fiscal.md` §9 a §13 |
| `12-GATE-DE-SAIDA` | `02-triagem.md` |

## As fusões, e por que cada uma aconteceu

🔑 **Estas são as redundâncias que já existiam na base antiga.** Elas não foram criadas aqui: foram encontradas e desfeitas.

1. **Anexos e Fator R estavam explicados duas vezes**, no `05` §2-3 e no `06` §2-3, com os mesmos números (6%, 15,5%, 28%, 30%) escritos de formas ligeiramente diferentes. Viraram `05-fiscal.md` §2, §3 e §5.
2. **O certificado digital aparecia em três notas** (`01` §1-2, `07` §2A, `10` §3). Agora a **composição** mora em `03-comercial.md` e a **contrapartida contratual** em `09-contrato.md`, que são dois fatos, não um repetido.
3. **A regra "não fale de Fator R para quem é III fixo" estava no `05` e no `06`.** Virou `05-fiscal.md` §6, uma vez.
4. **A regra do endereço fiscal estava partida** entre preço e motivo, e a partição estava certa. Foi mantida, e o porquê da partição virou linha explícita no `_MAPA.md`.
5. **Os tetos de faturamento apareciam em quatro notas.** Agora moram só em `01-escopo.md` §3, e as outras apontam.

## O que ENTROU e não existia

* **A tradução dos 9 motivos de recusa** (`02-triagem.md` §7). O campo já voltava da consulta e nenhum documento dizia o que fazer com ele.
* **A mecânica de desambiguação** (`02-triagem.md` §8), incluindo a regra do verbo e o caso do representante comercial.
* **A generalização para dizer SIM como defeito** (`02-triagem.md` §2). Medido em 25/09: *"fotografia é serviço e a gente cobre"* garante uma família que tem exceção dentro.
* **Spam, provocação e tentativa de sequestro de instrução** (`02-triagem.md` §9). Não existia nada escrito.
* **A ordem de qualificação da venda** (`03-comercial.md` §7) e **o fechamento** (§8).
* **O que sustenta o preço** (`03-comercial.md` §10), separado das objeções.
* **Migração de quem já tem contador** (`03-comercial.md` §9).
* **As objeções reescritas como movimento**, com a emoção e a armadilha de cada uma, que antes eram só exemplo de resposta.
* **Mensagem com quatro perguntas juntas** (`04-objecoes.md` §25), que é o caso normal no WhatsApp e não tinha tratamento.
* **Gatilho junto com pergunta comercial** (`04-objecoes.md` §24), com a ordem de resposta invertida em relação à ordem da frase.
* **Quando negar o Fator R em vez de calar** (`05-fiscal.md` §6).

## O que deliberadamente NÃO veio

* **Personalidade, tom, falas de assinatura e formato de mensagem.** São instrução de sistema e vivem no prompt do Supervisor. Regra de comportamento perdida num arquivo de conteúdo pode ser recuperada e repetida ao cliente.
* **Os 55 cartões de produto.** Eles descrevem funcionalidade e já têm estrutura própria de carga. O `08-suporte.md` cobre a **rotina**, não o catálogo de telas.
* **Os 1.332 CNAEs.** Estrutura própria, validada, consultada por ferramenta.
* **A tabela de preço de EPP.** Existe e está decidida, mas a casa não atende essa faixa hoje: preço que não se pode vender, dito a cliente, vira promessa.
* **O valor da guia fixa do MEI.** Não está travado com fonte, então não entra (`08-suporte.md` §2 diz isso ao agente).

## Como conferir que o corte é seguro

```bash
node dossie-leo/_auditar.mjs      # Lei Zero, por varredura
npm run validar:docs              # o parser estrito, se a pasta entrar na carga
```

🔴 **E o que o script não faz:** ele pega número repetido, não regra repetida com outras palavras. Mesma fronteira da trava de anatomia do MEI e da trava de escopo: **script pega forma, sentido continua sendo leitura humana.**
