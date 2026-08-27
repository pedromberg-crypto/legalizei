---
name: legalize-equacao-fiscal-camadas-cnae-cnpj
description: "Modelo em camadas da \"equação fiscal viva\" que o Pedro quer — regra estática por CNAE (vigia regulatória) + dado dinâmico mensal do CNPJ (Fator R/RBT12) — provocação em andamento, ainda sem desenho final"
metadata: 
  node_type: memory
  type: project
  originSessionId: d2ccc846-d594-41b7-93a1-f6220ff1b9b1
  modified: 2026-08-27T16:25:35.313Z
---

Provocação do Pedro em 27/08, depois de fechar a camada tributária dos 4 dados (MEI/risco/Anexo-FatorR/ISS) na `pesquisa/cnae-matriz/`. Ele quer ir além de ter os dados soltos em colunas — quer a **equação condicional** que conecta as variáveis, porque é isso que o backend precisa executar sozinho enquanto o usuário só confirma "esse CNAE está bom" no flow de abertura.

## Camada 1 — regra estática por CNAE (já mapeada 27/08)
Grupo legal (via [[legalize-cnae-camada-tributaria-4-dados-completa]]) → se é Fator R dinâmico ou fixo → MEI permitido → risco municipal → ISS BH. Muda raramente (só quando o governo altera lei/resolução).

**Requisito do Pedro sobre essa camada:** precisa ser **versionada e linkada ao CNPJ do usuário** (não um ponteiro solto pra "matriz atual"). Quando o governo mudar uma alíquota/renomear um anexo, o sistema precisa (a) identificar todo CNPJ que travou naquela versão, (b) atualizar em massa, (c) **notificar** quem foi afetado. Ele chama isso de "nossa vigia constante" — é descrito como uma das ferramentas mais importantes do produto, não um nice-to-have.

## Camada 2 — dado dinâmico mensal do CNPJ (ainda não mapeada, é o próximo passo real)
A regra estática (camada 1) define a FÓRMULA; o resultado real depende do histórico financeiro do CNPJ, recalculado mensalmente (janela móvel 12 meses, já ratificado em `fundamentos-cnae.md`):
- **Pró-labore pago** → numerador do Fator R (regime de caixa) → muda o % do Fator R → muda se cai em Anexo III ou V.
- **Faturamento/NF emitidas** → receita bruta → denominador do Fator R (regime de competência) **e** também decide a faixa da tabela progressiva (RBT12) que define a alíquota efetiva.

**Próximo passo pedido pelo Pedro (ainda não feito):** entender quais dessas variáveis do CNPJ são **diretamente alteradas pelo uso/definições dentro do nosso próprio app** — ou seja, mapear quais inputs da camada 2 o sistema já controla/captura via a experiência do usuário (ex: pró-labore escolhido é uma decisão que o app pode guiar) vs quais são puramente externos/declarados. A expectativa dele é que, uma vez desenhadas, essas regras "fiquem simples de aplicar".

## Why isto importa (palavras do Pedro)
"Enquanto o usuário está preenchendo os dados pra abrir a empresa, nós por trás precisamos ter toda essa informação extremamente mapeada pra entregar um serviço com exatidão" — é dinheiro/legalidade real do cliente, não conteúdo. A precisão cirúrgica não é sobre documentação pro Pedro ler, é sobre o motor que decide o imposto de verdade de alguém.

## How to apply
Quando o Pedro pedir pra desenhar/implementar essa equação (ainda não pediu — isso é provocação/exploração, não decisão travada), lembrar que são DUAS camadas distintas que se combinam, não uma tabela só: (1) regra regulatória versionada com vigia+notificação, (2) dado financeiro mensal do CNPJ que alimenta a mesma fórmula. Ele já tinha uma modelagem parcial disso em `modelagem-cnae.drawio` (DER Chen, entidades CNAE/ENQUADRAMENTO/EMPRESA/SIMULAÇÃO DE ENQUADRAMENTO) — a entidade SIMULAÇÃO DE ENQUADRAMENTO já antecipa a camada 2 (folha mensal, pró-labore, faixa de faturamento → anexo resultante). Ver cruzamento desse DER em conversa de 27/08 (ainda sem nota própria no vault até este ponto — verificar se foi criada depois).
