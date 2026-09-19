---
name: base-legalizai
description: Base de conhecimento oficial da Legalizai, a única fonte de verdade do Léo. Use sempre que for citar preço, promoção, prazo, taxa, alíquota ou qualquer número, explicar regra de órgão, campo do app, escopo atendido, contrato, garantia ou cancelamento, e sempre que outra skill citar uma nota pelo nome (ex. 01-PLANOS-E-OFERTAS).
---

# Base de conhecimento da Legalizai

Conhecimento que o Léo consulta em runtime. Diz **o que é verdade**; as skills `atendimento`, `vendas` e `escalacao` dizem como agir.

## Como consultar

Cada nota é um arquivo em `references/`. Quando uma skill citar uma nota pelo nome, leia na hora:

`skill_view("base-legalizai", "references/<NOME>.md")`

Exemplo: `01-PLANOS-E-OFERTAS` → `skill_view("base-legalizai", "references/01-PLANOS-E-OFERTAS.md")`.

Link no formato `[[NOME]]` dentro das notas aponta para outra nota desta mesma pasta.

`skill_view` é a única forma de ler a base. Não existe ferramenta de busca (`search_files`, `skill_search`, `read_file`): escolha a nota pela tabela abaixo e leia direto. Uma ou duas notas bastam para responder.

**Número nunca sai de memória.** Preço, prazo, taxa e percentual são lidos na nota no momento da resposta. Se a informação não está em nenhuma nota, você não sabe: diga que vai confirmar com o time.

## Notas

| Nota | Quando ler |
|---|---|
| `00-DIRETRIZES-SEGURANCA` | Quem é o Léo, o que ele nunca faz, quando escala, fala de "sou robô?" |
| `01-PLANOS-E-OFERTAS` | Preços, promoção e validade, lista de espera, endereço fiscal, taxa da Junta |
| `02-PRODUTO-E-USABILIDADE` | Ordem real das etapas do app, corrigir dado |
| `03-REGRAS-DOS-ORGAOS` | Prefeitura, JUCEMG, Receita, filtro do MEI |
| `04-QUEBRA-OBJECOES` | Calibragem de resposta a objeções, por estágio de funil |
| `05-DICIONARIO-CNAE-TRIBUTARIO` | Conceito de CNAE, anexos do Simples, Fator R |
| `06-CALCULO-FISCAL` | Como o imposto da ME é calculado, faixas de alíquota, Fator R retrovisor, pró-labore e guias do sócio |
| `07-OBRIGACOES-MENSAIS` | Rotina depois que a empresa nasce, 🔴 quem faz o quê (sistema x cliente x contador), emitir nota, prazos |
| `08-MAPA-DO-DOSSIE` | Campo a campo do app, com o motivo do órgão |
| `09-ESCOPO-E-LIMITES` | 🔴 Pra quem a gente atende, os dois tetos (MEI e ME), EPP fora, CNAEs atendidos. Ler antes de vender |
| `10-CONTRATO-GARANTIA-CANCELAMENTO` | 🔴 Garantia de 7 dias, fidelidade, multa, cancelamento. **Você não tem nenhum desses números fora daqui** |
| `11-COMO-CONSULTAR-CNAE` | Regra da ferramenta de consulta de CNAE |
| `12-GATE-DE-SAIDA` | 🔴 Como dizer não. Ler **antes** de recusar qualquer caso: EPP, comércio, Lucro Presumido, fora de BH, 5+ sócios |

