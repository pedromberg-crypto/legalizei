# Relatório T0010 — persona "fronteira" (Fernanda — "consultoria de alimentação e bem-estar")

> flow **abertura** v0.2.1 · 2026-07-15 · **PASS ✅**

**Perfil (médio-alto):** Profissional, articulada. Descreve como 'consultoria' pra parecer serviço livre, mas é conselho regulado. Boa-fé, não está tentando burlar.

**Cobertura:** Entrada + B1 + B2 (completo, c/ simulador Fator R) + B3 (cobrança) + B4 (constituição) + B4.5 (ativação fiscal)

| #  | Tela      | Passo            | Resultado                                                   | OK | Sugestão (olhar leigo)                                                                                              |
|----|-----------|------------------|-------------------------------------------------------------|----|---------------------------------------------------------------------------------------------------------------------|
| 01 | ENTRADA·3 | entrada.fork     | rota: abertura de CNPJ                                      | ✅  |                                                                                                                     |
| 02 | B1·4      | b1.descricao     | descrição aceita                                            | ✅  |                                                                                                                     |
| 03 | B1·4      | b1.mapeamento    | CNAE 8650-0/02 · confiança media · AMBÍGUO                  | ✅  |                                                                                                                     |
| 04 | B1·4      | b1.desambiguacao | desambiguou: sou nutricionista registrada e prescrevo dieta | ✅  | Perguntar 'você é nutricionista registrada / prescreve dieta?' — separa o conselho regulado da orientação genérica. |
| 05 | B1·4      | b1.filtro        | serviço ✓ · Simples ✓ · REGULADA                            | ✅  |                                                                                                                     |
| 06 | B1·4      | b1.veredito      | 🟡 waitlist                                                 | ✅  | 🟡 aqui é proteção dela (RT/CRN), não rejeição. Explicar em linguagem humana.                                       |

**Resumo:** veredito B1: 🟡 waitlist ✅  ·  status: waitlist ✅  ·  parou em: b1.veredito ✅  ·  RESULTADO: ✅ PASS

Fonte da persona: [[casos-teste-fluxo-cnae]] FLOW 4 — Fronteira Regulada
