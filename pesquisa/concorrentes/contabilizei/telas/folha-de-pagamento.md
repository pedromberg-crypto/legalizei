---
tipo: teardown-tela
data: 2026-07-09
concorrente: Contabilizei
plataforma: [desktop, mobile]
media: 5.8
tags: [concorrente, ux]
---

# Tela: Folha de Pagamento — Contabilizei

> **CAI NA HOME (fato observado).** A recaptura confirma pelo log: a URL de "Folha de Pagamento" resolve para `#/home` — **não existe rota/tela dedicada**. Clicar no item do menu lateral **não navega**: abre um **flyout de submenu** sobreposto à Home, com ícone de pessoa e dois links: **"Gerenciar funcionários"** e **"Consultar folha mensal"**. No mobile o mesmo submenu aparece empilhado no topo, solto, antes do conteúdo da Home. Ou seja: folha é uma **categoria de menu** (grupo com 2 sub-destinos reais), não uma tela de 1ª classe — o líder NÃO dá superfície própria pra folha (coerente: ME de serviço solo raramente tem funcionários). Correção vs. leitura anterior: os sub-destinos **existem** ("Gerenciar funcionários"/"Consultar folha mensal") — não é beco sem saída total; é submenu sem contexto. As telas-filhas em si não foram capturadas.

## Notas (0–10)
| Eixo | Nota | Justificativa |
|------|------|---------------|
| Clareza | 6 | Os dois rótulos do flyout ("Gerenciar funcionários", "Consultar folha mensal") são autoexplicativos. Mas o pai cai na Home: não há landing de folha, nem contexto ("você tem X funcionários"), nem título de onde estou. |
| Eficiência | 6 | 2 passos pra chegar a qualquer coisa (abrir o flyout → escolher sub-item). Sem hub de folha; o flyout some ao mover o mouse. |
| Feedback | 5 | O submenu não mostra estado nenhum: tenho funcionários? há holerite pendente? competência aberta? Zero sinal — e nenhum empty-state pra quem não tem folha. |
| Linguagem | 7 | Aqui acertam: "Gerenciar funcionários" / "Consultar folha mensal" é linguagem de dono, sem contabilês. Melhor que a média da plataforma. |
| Confiança | 6 | Atrás do flyout está a Home (pendências, calendário) — nada específico de folha pra ancorar confiança na área. |
| Mobile | 5 | O submenu vira uma listinha solta no topo de um scroll de ~4195px, desconectada de qualquer cabeçalho; a nav flutuante e o "Fale conosco" ainda disputam espaço. |
| **Média** | **5.8** | Folha existe como **grupo de menu com flyout**, não como tela. Navegação clara nos rótulos, pobre em contexto e estado. |

## O que vi (fatos)
- URL da captura: `#/home` (confirmado no `recaptura_log.json`) — não há rota dedicada de folha.
- Item "Folha de Pagamento" no menu lateral (ícone de pessoa) abre **flyout de submenu** sobre a Home com: **"Gerenciar funcionários"** e **"Consultar folha mensal"**.
- Fundo do flyout = dashboard Home (banner "Sua mensalidade do plano Padrão no valor de R$ 210,90 chegou!", Central de Rotinas com "Pendências críticas: Pagamento de imposto pendente", cards Impostos/Conta Digital PJ/Pró-labore).
- **Não vi**: nenhuma tela de folha propriamente (lista de funcionários, holerite, eSocial, admissão, competência) — só o submenu que aponta pra elas.
- Mobile: submenu renderiza no topo, sem cabeçalho de seção, antes de todo o conteúdo da Home.

## 👍 Forças (o que copiar)
- **Rótulos humanos no submenu**: "Gerenciar funcionários" e "Consultar folha mensal" são exatamente os 2 jobs, ditos sem jargão. Bom padrão de nomenclatura pra copiar.
- Manter folha como **área existente porém discreta** faz sentido pro público (ME solo) — não infla o produto com uma tela cheia que 90% não usa.

## 👎 Fraquezas (nossa oportunidade)
- **Submenu sem contexto nem estado**: o flyout não diz se você tem funcionários, se há folha pendente, ou o que acontece se clicar. Abre no vazio.
- **Cai na Home ao clicar o pai**: item de menu que não leva a lugar próprio desorienta — o usuário clica esperando uma tela e recebe um popover.
- **Zero empty-state educativo** pra quem nunca teve funcionário: perde-se a chance de educar + captar intenção de contratar.
- **Mobile solta o submenu no limbo**: sem título, no topo de um scroll gigante.

## 🎯 Contraproposta Legalizei
- **Menu adaptativo ao perfil**: ME de serviço sem funcionários vê "Folha" como item secundário com estado explícito — "Ative quando contratar seu 1º funcionário". Menu = espelho do negócio, não catálogo genérico.
- Se clicar, **abrir uma tela de verdade** (não flyout sobre a Home) com **empty-state útil**: "Você ainda não tem funcionários. Contratar alguém? A gente cuida de admissão, holerite e eSocial." — educar + captar intenção.
- **Manter os rótulos humanos** ("Gerenciar funcionários", "Consultar folha mensal") — nisso a Contabilizei acerta; herdar o tom.
- Com folha ativa, mostrar **estado no próprio item** (nº de funcionários, folha do mês, pendências) — o que o submenu deles esconde.

## Links
- [[contabilizei]] · [[_relatorio-auditoria]] · [[HOME]]
