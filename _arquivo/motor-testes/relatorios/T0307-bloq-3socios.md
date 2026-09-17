# Relatório T0307 — persona "bloq-3socios" (Bloqueio 7 — 3 sócios (acima do limite))

> flow **abertura** v0.4.0 · 2026-07-16 · **PASS ✅**

**Perfil (médio):** Trio querendo abrir junto. Não sabe que o MVP só cobre até 2 sócios.

**Cobertura:** Entrada + B1 (gate+teaser) + B3 (cobrança) + B2 (dossiê, dentro do app) + B4 + B4.5

| #  | Tela       | Passo            | Resultado                                   | OK | Sugestão (olhar leigo) |
|----|------------|------------------|---------------------------------------------|----|------------------------|
| 01 | ENTRADA·N3 | entrada.fork     | rota: abertura de CNPJ (flow #1)            | ✅  |                        |
| 02 | B1·N4      | b1.descricao     | descrição aceita                            | ✅  |                        |
| 03 | B1·N4      | b1.mapeamento    | CNAE 7020-4/00 · confiança alta · sem fork  | ✅  |                        |
| 04 | B1·N4      | b1.desambiguacao | (pulado)                                    | ✅  |                        |
| 05 | B1·N4      | b1.filtro        | serviço ✓ · Simples ✓ · não-regulada ✓      | ✅  |                        |
| 06 | B1·N4      | b1.veredito      | 🟢 atende                                   | ✅  |                        |
| 07 | B1·N4      | b1.triagem       | ERRO: acima de 2 sócios: atendimento humano | ✅  |                        |

**Resumo:** veredito B1: 🟢 atende ✅  ·  status: bloqueado ✅  ·  parou em: b1.triagem ✅  ·  RESULTADO: ✅ PASS

Fonte da persona: [[casos-teste-fluxo-cnae]] FLOWS 7–9 — testes de bloqueio
