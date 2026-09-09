---
tipo: verdade
status: vivo
data: 2026-09-04
assunto: agente-whatsapp-vault
tags: [execucao, agente, whatsapp, rag, leo]
---

# Vault isolado do agente de WhatsApp (Léo)

Base de conhecimento **exclusiva** do agente de atendimento. O agente lê só esta pasta, e o motivo é duro: fora daqui o vault tem margem, CAC, custo operacional, estratégia de sócio e pesquisa não ratificada, e nada disso pode chegar a um cliente por WhatsApp.

## Ordem de leitura
| Arquivo | Papel |
|---|---|
| `00-DIRETRIZES-SEGURANCA` | Quem é o Léo, o que ele nunca faz, quando escala |
| `01-PLANOS-E-OFERTAS` | Preços, promoções, endereço fiscal, taxa da Junta |
| `02-PRODUTO-E-USABILIDADE` | A ordem real das etapas do app |
| `03-REGRAS-DOS-ORGAOS` | Prefeitura, JUCEMG, Receita, e o filtro do MEI |
| `04-QUEBRA-OBJECOES` | Q&A de calibragem, os 3 estágios de funil |
| `05-DICIONARIO-CNAE-TRIBUTARIO` | Conceito de CNAE, anexos, Fator R |
| `07-OBRIGACOES-MENSAIS` | A rotina depois que a empresa nasce |
| `08-MAPA-DO-DOSSIE` | Campo a campo do app, com o motivo de cada um |
| `09-ESCOPO-E-LIMITES` | 🔴 Pra quem a gente atende. Ler antes de vender |
| `10-CONTRATO-GARANTIA-CANCELAMENTO` | 7 dias, fidelidade, multa |
| `11-COMO-CONSULTAR-CNAE` | Contrato da ferramenta de consulta dos 1332 CNAEs |

Não existe `06`: ele foi fundido no `03` em 04/09 (eram dois arquivos dizendo a mesma coisa com redações diferentes, que é como dado começa a divergir).

## Regras de manutenção
1. **Número aqui dentro precisa existir no vault principal.** Preço vem de `financeiro/estado-atual.md` e de `app/src/lib/fiscal.ts`. Regra de órgão vem de `pesquisa/` e das gravações reais. Se um número muda lá, muda aqui no mesmo dia.
2. **Nada de instrução de sistema no meio do conhecimento.** Instrução vive no `00`. Num RAG, um parágrafo de instrução perdido no meio de um arquivo de conteúdo pode ser recuperado e repetido pro cliente.
3. **Lista grande não entra.** Os 1332 CNAEs ficam em `pesquisa/cnae-matriz/cnae-matriz.json` e são consultados por ferramenta (`11`). Cópia dentro do vault congela e diverge.
4. **Sem travessão em nenhum arquivo.** Regra dura de marca, e o agente aprende o tom pelo que lê.
5. **Duplicata é bug.** Se dois arquivos explicam a mesma regra, funde. Foi o que aconteceu com `03`+`06` e com o antigo `qa-agente-whatsapp-leo.md`, que ficava fora da pasta isolada.

## Fora de escopo deste vault
Personalidade completa do personagem, com dial de ironia por persona, banco de falas e origem: `execucao/handoffs/handoff-leo-agente-whatsapp.md`. Aquele doc é pro dev configurar o `SOUL.md`; este vault é o que o agente consulta em runtime.
