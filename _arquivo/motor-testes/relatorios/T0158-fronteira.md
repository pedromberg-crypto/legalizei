# Relatório T0158 — persona "fronteira" (Fernanda — "consultoria de alimentação e bem-estar")

> flow **abertura** v0.2.3 · 2026-07-16 · **PASS ✅**

**Perfil (médio-alto):** Profissional, articulada. Descreve como 'consultoria' pra parecer serviço livre, mas é conselho regulado. Boa-fé, não está tentando burlar.

**Cobertura:** Entrada + B1 + B2 (completo, c/ simulador Fator R) + B3 (cobrança) + B4 (constituição) + B4.5 (ativação fiscal)

| #  | Tela      | Passo            | Resultado                                                   | OK | Sugestão (olhar leigo)                                                                                                                                                                                                                                              |
|----|-----------|------------------|-------------------------------------------------------------|----|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 01 | ENTRADA·3 | entrada.fork     | rota: abertura de CNPJ                                      | ✅  |                                                                                                                                                                                                                                                                     |
| 02 | B1·4      | b1.descricao     | descrição aceita                                            | ✅  |                                                                                                                                                                                                                                                                     |
| 03 | B1·4      | b1.mapeamento    | CNAE 8650-0/02 · confiança media · AMBÍGUO                  | ✅  |                                                                                                                                                                                                                                                                     |
| 04 | B1·4      | b1.desambiguacao | desambiguou: sou nutricionista registrada e prescrevo dieta | ✅  |                                                                                                                                                                                                                                                                     |
| 05 | B1·4      | b1.filtro        | serviço ✓ · Simples ✓ · REGULADA                            | ✅  |                                                                                                                                                                                                                                                                     |
| 06 | B1·4      | b1.veredito      | 🟡 waitlist                                                 | ✅  | UX-22 já separou 'precisa de RT'. 4ª ordem: **começar o caminho do RT**, não só nomear. 'Quer que a gente veja um responsável técnico pra você?' + o que muda no custo/prazo. Ela é cliente real; a distinção só vale se virar ação, senão é um 'não' mais educado. |

**Resumo:** veredito B1: 🟡 waitlist ✅  ·  status: waitlist ✅  ·  parou em: b1.veredito ✅  ·  RESULTADO: ✅ PASS

Fonte da persona: [[casos-teste-fluxo-cnae]] FLOW 4 — Fronteira Regulada
