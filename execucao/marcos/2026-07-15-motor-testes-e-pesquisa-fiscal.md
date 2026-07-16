---
tipo: historico
status: congelado
data: 2026-07-15
tags: [produto, testes, fiscal, cnae, pesquisa, decisao]
---

# 🏁 Marco 2026-07-15 (2º flow) — Motor de testes construído + pesquisa fiscal oficial (2 rodadas)

> Flow longo: saímos da arquitetura travada ([[2026-07-15-spec-telas-e-motor-testes]]) pro **motor rodando**, tomamos 4 decisões de produto, cortamos comércio do MVP e rodamos **2 pesquisas fiscais aterradas em fonte oficial** ([[fiscal-simples-bh-2026]]).

## 1. Motor de testes CONSTRUÍDO (`execucao/motor-testes/`)
- **Headless, Node puro, zero dependência.** `flow-schema.js` (fluxo como dados: Entrada + B1 + começo do B2) + `personas/*.json` (fixture durável cross-flow) + `run.js` + livro-caixa `historico-testes.jsonl` + relatórios `.md` por corrida.
- Roda via `node run.js <persona>`. **Saída em TABELA** (# · tela · passo · resultado · OK · **sugestão de olhar leigo**) + veredito PASS/FAIL. Livro-caixa append-only (2 tipos: `corrida` + `ajuste` com fonte).
- **7 personas** com PERFIL/personalidade (espectro leigo→expert): reta (leigo total), + espectro proposto p/ camaleão/sociedade/fronteira/knife-edge/monstro, + **cida** (7ª, baixa familiaridade digital, casada → exercita regime de bens). Reta e Cida rodando ✅ PASS.
- IA de CNAE **dublada pela persona** (motor testa lógica sem gastar token). Pausas de órgão = eventos roteirizados (parar/esperar/retomar idempotente).
- Falta escalar as 5 personas restantes ponta a ponta (dependem de estender o schema pra B2 inteiro + B3).

## 2. Decisões travadas (produto)
| Decisão | Valor | Racional |
|---|---|---|
| **Limite de sócios = 2** | espelha Contabilizei | ⚠️ **corrige a spec que dizia 3** ([[spec-telas-entrada-b1-b2]] a ajustar) |
| **Endereço fiscal = upsell** | add-on, não bloqueia | injeta no plano do B3 |
| **B3 = 1 plano único no início** | "igual" ao Padrão R$195 da Contabilizei | sem tier por faixa agora |
| **Fator R + cancelamento = regra Contabilizei/lei já mapeada** | — | Fator R é lei (LC 123), não da Contabilizei |
| **MVP = só serviço → cortar comércio** | 200 CNAEs Anexo I saem | congelados em [[cnae-comercio-standby]] (reencaixe futuro) |
| **Sócio no exterior = bloqueio duro** | rota humana | art. 17 II LC 123 impede o Simples (único caso fatal das 5 condicionais) |

## 3. Pesquisa fiscal oficial — 2 rodadas ([[fiscal-simples-bh-2026]])
**Confirmado (fonte primária):**
- Fator R **parcialmente determinístico por CNAE**: 3 grupos (sempre III · Fator-R III×V · Anexo IV). NÃO existe CNAE "sempre V".
- CNAEs atendidos hoje = **200 comércio (Anexo I) + 260 serviço** (contagem `cnae-matriz.csv`).
- Abertura BH = **7 etapas integradas** (JUCEMG/Redesim), entrega CNPJ+inscrição+**alvará imediato** em ~1 dia útil pra baixo risco (escritório = ~96%). Certificado ICP-Brasil é pré-req.
- **Automação de DAS VIÁVEL**: API **Serpro Integra Contador** (`TRANSDECLARACAO11`, `GERARDAS12`) + procuração e-CAC granular. → concretiza passo "ativação fiscal (B4.5)".
- Valores 2026: salário mín **R$1.621** · teto INSS **R$8.475,55** · **IRRF isento na prática até ~R$5.000/mês** (redutor Lei 15.270/2025) · sublimite MG **R$3,6M**.
- Viabilidade de nome JUCEMG **sem API aberta** (constraint da tela 2.7).
- Contabilizei R$195 = Padrão (não o piso; Básico R$139); atende Simples e Lucro Presumido.

**Lacunas (double-check Larissa + 3ª rodada):** **H · Fator R no 1º ano** (proporcionalização, composição da folha) — ZERO claims; **I · migração de contador** — ZERO claims; **D resíduo** (INSS pró-labore % + alíquotas iniciais DAS III/V). H e I são críticos (empresa nova + flow MIGRAR).

## Próximo passo (janela nova)
- Rodar **3ª pesquisa: H + I + D-resíduo** (prompt pronto no fim do flow) e **cruzar com o Gemini** (2 rodadas + esta).
- Corrigir spec (limite 2). Estender schema p/ B2 inteiro + B3 e acender as 5 personas. Especificar B4 (constituição, happy path já mapeado) + B4.5 (ativação fiscal/DAS).
- Parking-lot novo: provocação Lucro Presumido no MVP · passo "ativação fiscal/DAS".

## Links
- [[2026-07-15-spec-telas-e-motor-testes]] · [[fiscal-simples-bh-2026]] · [[cnae-comercio-standby]] · [[cnae-atendidos-e-nao-atendidos]] · [[blocos-fluxo-abertura]] · [[parking-lot]] · [[HOME]]
