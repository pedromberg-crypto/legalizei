---
tipo: derivado
status: rascunho
data: 2026-08-28
assunto: mei-mapeamento-funcionalidades
deriva_de: [mei-obrigacoes-operacionais]
tags: [mei, produto, funcionalidades, portal, dev]
---

# 🛠️ Do dado à tela — funcionalidades do portal pro cliente MEI

> Cada obrigação de [[mei-obrigacoes-operacionais]] vira uma linha aqui: o que o sistema mostra, calcula, lembra ou emite. Rascunho pra debate — nada disso está construído ainda, é a ponte entre pesquisa e produto.

| Obrigação (fonte) | Funcionalidade | Lógica/dado necessário | Prazo/gatilho |
|---|---|---|---|
| Relatório Mensal de Receitas Brutas | Coleta digitalizada — a mesma tarefa manual de hoje, mas dentro do app, alimentando automaticamente o acumulado anual | Formulário mensal: receita PF + receita PJ (mesmo split que hoje é manual). Cada lançamento soma no contador de teto (item abaixo) | Lembrete dia 15, trava dia 20 (mesmo dia do DAS) |
| DAS-MEI | Calendário + lembrete + link de pagamento (se possível, geração direta via PGMEI/API) | Valor fixo por regime (comércio/serviço/misto), muda só com reajuste do salário mínimo | Lembrete D-5 e D-1 antes do dia 20 |
| Emissão de NF | Emissor integrado via **API oficial do gov.br/nfse** (não precisa mandar cliente pro portal do governo) | Campo "quem é o cliente" (PF/PJ) decide se NF é obrigatória ou opcional; se PJ, bloqueia "pular" | No ato da venda/serviço prestado |
| DASN-SIMEI | Assistente que puxa os 12 relatórios mensais já coletados e monta a declaração | Soma automática dos 12 relatórios (receita PF+PJ do ano) + campo "teve empregado?" (já sabemos pelo módulo de folha, se existir) | Lembrete a partir de abril, trava 31/05. Alerta extra: contagem regressiva dos 90 dias pós-prazo (risco de inaptidão de CNPJ) |
| **Teto de faturamento** | 🎯 **Monitor com alerta proativo** — nosso diferencial real, ninguém no governo faz isso | Soma do acumulado do ano (dos relatórios mensais) vs teto proporcional (R$6.750 × meses ativos). Alerta em 3 faixas: verde (<80% do teto) · amarelo (80-100%, "atenção") · vermelho (>100%, calcula automaticamente se é caso de excesso ≤20% ou >20% e explica a diferença de efeito — só ano que vem sem multa, ou retroativo com multa) | Recalcula a cada lançamento de receita, não só no fim do ano |
| MEI-empregador — guia DAE | Cálculo automático (INSS 3% + FGTS 8% + IRRF se houver) + lembrete de pagamento | Salário do único funcionário (fixo, salário mínimo/piso) | Dia 20, mesmo dia do DAS-MEI — dá pra unificar num só lembrete |
| MEI-empregador — eventos eSocial | Assistente de admissão/rescisão (S-2200/S-2299), não exige que o cliente entenda o jargão | Dados do funcionário (admissão) ou data de saída (rescisão) | No evento (não é recorrente) |
| MEI-empregador — férias | Calendário automático: aviso 30 dias antes, cálculo do 1/3 constitucional | Data de admissão (pra calcular período aquisitivo) | Contínuo, 1x/ano por funcionário |
| MEI-empregador — 13º | Cálculo automático das 2 parcelas | Salário do funcionário | 30/11 (1ª) e 20/12 (2ª) |
| MEI-empregador — exames | Lembrete de exame periódico (a cada 2 anos) e prazo de demissional (10 dias) | Data do último exame / data de rescisão | Recorrente 2 anos / 10 dias pós-rescisão |
| Distribuição de lucro | Calculadora "quanto posso retirar sem imposto" — baseada nos percentuais de presunção (8%/32%) já que não há contabilidade formal | Receita bruta acumulada × percentual de presunção da atividade | Sob demanda, não é prazo fixo |

## Princípios de design (herdados do resto do produto)

- **Nunca surpreender** — todo cálculo de teto/desenquadramento mostra o "porquê", não só o número (mesma doutrina do card verde/DAE do flow de abertura).
- **Monitoramento é o diferencial**, não a burocracia em si — o governo já tem PGMEI/eSocial/NFS-e nacional; nosso valor é a camada de alerta PROATIVO que não existe em lugar nenhum oficial.
- **API nacional de NFS-e é a peça central** do emissor — evita reinventar integração por prefeitura, já que MEI é 100% via sistema federal desde 2023.

## Aberto pra debate

1. O monitor de teto entra no MVP (V1) ou é fase 2? Dado o achado (zero ferramenta oficial faz isso), é diferencial forte, mas exige o histórico de receita mensal alimentado com disciplina pelo cliente — depende do Relatório Mensal já estar em uso.
2. Módulo de folha (MEI-empregador) — quantos clientes reais teriam funcionário no V1? Se for minoria, pode ser fase 2 mesmo sendo tecnicamente simples.
3. Emissor de NF via API oficial — precisa confirmar limites/rate-limit da API e se exige algum credenciamento prévio da Legalizai como "sistema terceiro" junto ao gov.br/nfse.

## Links
- [[mei-obrigacoes-operacionais]] — fonte dos fatos.
- `app/src/lib/fiscal.ts` — onde esses cálculos (teto, CPP, DAS) eventualmente vivem no código.
