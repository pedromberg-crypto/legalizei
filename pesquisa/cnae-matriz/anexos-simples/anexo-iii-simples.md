---
tipo: referencia
status: vivo
data: 2026-07-17
fonte: LC 123/2006 (Anexo III) · conferido contra contabilizei.com.br/anexo-3 (atualizado 22/06/26, revisão CRC)
confianca: alta (valor estatutário)
---
# Anexo III — Simples Nacional (serviços)

> Etiqueta fiscal. Linkar `[[anexo-iii-simples]]` sempre que o Anexo III aparecer no flow/CNAE. **Fonte-verdade = a LEI** (LC 123/2006); Contabilizei só apresenta.

## Resumo
Tributação da maioria dos **serviços**. Alíquota **6% → 33%** sobre a receita bruta dos últimos 12 meses (RBT12). **CPP dentro do DAS.** É o anexo mais barato pra serviço (≈10% menos que Lucro Presumido) — destino do Fator R.

## Tabela (6 faixas)
| Faixa | RBT12 (R$) | Alíquota nominal | Parcela a deduzir (R$) |
|---|---|---|---|
| 1ª | até 180.000,00 | 6,00% | — |
| 2ª | 180.000,01 – 360.000,00 | 11,20% | 9.360,00 |
| 3ª | 360.000,01 – 720.000,00 | 13,50% | 17.640,00 |
| 4ª | 720.000,01 – 1.800.000,00 | 16,00% | 35.640,00 |
| 5ª | 1.800.000,01 – 3.600.000,00 | 21,00% | 125.640,00 |
| 6ª | 3.600.000,01 – 4.800.000,00 | 33,00% | 648.000,00 |

## Alíquota efetiva (o que realmente se paga)
`efetiva = (RBT12 × nominal − parcela_deduzir) ÷ RBT12` · DAS do mês = receita do mês × efetiva.
**Ex.** RBT12 = R$ 300k (2ª faixa): `(300000×0,112 − 9360)/300000 = 8,08%`. Nominal 11,2%, **efetiva 8,08%** — a dedução é o que segura a carga.

## Repartição dos tributos (composição do DAS por faixa, %)
> Não se paga separado — é 1 guia só. Serve pra saber quanto do DAS é cada imposto.

| Faixa | CPP | ISS | CSLL | IRPJ | Cofins | PIS/Pasep |
|---|---|---|---|---|---|---|
| 1ª | 43,40 | 33,50 | 3,50 | 4,00 | 12,82 | 2,78 |
| 2ª | 43,40 | 32,00 | 3,50 | 4,00 | 14,05 | 3,05 |
| 3ª | 43,40 | 32,50 | 3,50 | 4,00 | 13,64 | 2,96 |
| 4ª | 43,40 | 32,50 | 3,50 | 4,00 | 13,64 | 2,96 |
| 5ª | 43,40 | 33,50 (*) | 3,50 | 4,00 | 12,82 | 2,78 |
| 6ª | 30,50 | — | 15,00 | 35,00 | 16,03 | 3,47 |

- **(*) Teto de ISS = 5%:** na 5ª faixa, quando a efetiva passa de **14,92537%**, o ISS trava em 5% e a diferença vai proporcional aos federais.
- **6ª faixa:** ICMS e ISS **saem do DAS** (pagos à parte).
- Ex.: CPP dentro do DAS na 1ª faixa = 43,40% × 6% (efetiva).

## Quem é Anexo III (por tipo de atividade)
**Fixos no III (sempre):** manutenção/reparos · educação (creche→médio, cursos livres, autoescola) · transporte municipal · corretagem (seguros/imóveis) · locação de imóvel próprio p/ eventos · produções culturais/artísticas · agências (viagem/Correios/lotérica) · contabilidade (ISS fixo) · locação de bens móveis.

**Variáveis por Fator R (III se FR ≥ 28%, senão [[anexo-v-simples]]):** 🔴 TI/software · atividade física/bem-estar (academias, clínicas de nutrição/psico/fono) · saúde/medicina/odonto/veterinária · consultoria/perícia/administração/representação comercial · profissões regulamentadas (arquitetura/engenharia/design) · comunicação/publicidade/jornalismo.
> Essa segunda lista = onde a feature-âncora [[cnae-fiscalmente-otimo]] atua.

## Fator R
`FR = folha (inclui pró-labore) ÷ receita bruta`, 12 meses. `≥ 0,28` → III (piso 6%) · `< 0,28` → V (piso 15,5%). Decidido **mês a mês**.

## Pagamento + exportação
- Pago via **DAS** unificado, CPP inclusa.
- **Exportação:** receita de mercado externo tem desoneração (reduz Cofins/PIS/IPI/ICMS/ISS na apuração) — segregar receita interna × externa.

## Ligações
[[fiscal-simples-bh-2026]] · [[cnae-fiscalmente-otimo]] · [[anexo-v-simples]] · [[anexo-iv-simples]] · [[cnae-liso-servico]]
