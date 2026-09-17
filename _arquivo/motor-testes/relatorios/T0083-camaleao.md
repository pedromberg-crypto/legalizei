# Relatório T0083 — persona "camaleao" (Carla — "vendo material de construção")

> flow **abertura** v0.2.2 · 2026-07-15 · **PASS ✅**

**Perfil (médio):** Sabe o que faz mas descreve de um jeito que confunde comércio com representação. Se levar 🔴 injusto, xinga e some.

**Cobertura:** Entrada + B1 + B2 (completo, c/ simulador Fator R) + B3 (cobrança) + B4 (constituição) + B4.5 (ativação fiscal)

| #  | Tela      | Passo            | Resultado                                             | OK | Sugestão (olhar leigo)                                                                                                                                                                                                                                                               |
|----|-----------|------------------|-------------------------------------------------------|----|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 01 | ENTRADA·3 | entrada.fork     | rota: abertura de CNPJ                                | ✅  |                                                                                                                                                                                                                                                                                      |
| 02 | B1·4      | b1.descricao     | descrição aceita                                      | ✅  |                                                                                                                                                                                                                                                                                      |
| 03 | B1·4      | b1.mapeamento    | CNAE 4613-3/00 · confiança media · AMBÍGUO            | ✅  |                                                                                                                                                                                                                                                                                      |
| 04 | B1·4      | b1.desambiguacao | desambiguou: represento fábricas, sem estoque próprio | ✅  |                                                                                                                                                                                                                                                                                      |
| 05 | B1·4      | b1.filtro        | serviço ✓ · Simples ✓ · REGULADA                      | ✅  |                                                                                                                                                                                                                                                                                      |
| 06 | B1·4      | b1.veredito      | 🟡 waitlist                                           | ✅  | Captura de waitlist já existe (resolvido). 2ª ordem: e depois? Ela quer abrir HOJE. Falta o 'enquanto isso' — previsão de quando abre pra representação + alternativa concreta (rota pro escritório do Mauro, que atende manual). Waitlist sem próximo passo = ela some e não volta. |

**Resumo:** veredito B1: 🟡 waitlist ✅  ·  status: waitlist ✅  ·  parou em: b1.veredito ✅  ·  RESULTADO: ✅ PASS

Fonte da persona: [[casos-teste-fluxo-cnae]] FLOW 2 — Camaleão
