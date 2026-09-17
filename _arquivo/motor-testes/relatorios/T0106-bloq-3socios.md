# Relatório T0106 — persona "bloq-3socios" (Bloqueio 7 — 3 sócios (acima do limite))

> flow **abertura** v0.2.2 · 2026-07-15 · **PASS ✅**

**Perfil (médio):** Trio querendo abrir junto. Não sabe que o MVP só cobre até 2 sócios.

**Cobertura:** Entrada + B1 + B2 (completo, c/ simulador Fator R) + B3 (cobrança) + B4 (constituição) + B4.5 (ativação fiscal)

| #  | Tela      | Passo            | Resultado                                   | OK | Sugestão (olhar leigo)                                                                                                                                                                                                                                          |
|----|-----------|------------------|---------------------------------------------|----|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 01 | ENTRADA·3 | entrada.fork     | rota: abertura de CNPJ                      | ✅  |                                                                                                                                                                                                                                                                 |
| 02 | B1·4      | b1.descricao     | descrição aceita                            | ✅  |                                                                                                                                                                                                                                                                 |
| 03 | B1·4      | b1.mapeamento    | CNAE 7020-4/00 · confiança alta · sem fork  | ✅  |                                                                                                                                                                                                                                                                 |
| 04 | B1·4      | b1.desambiguacao | (pulado)                                    | ✅  |                                                                                                                                                                                                                                                                 |
| 05 | B1·4      | b1.filtro        | serviço ✓ · Simples ✓ · não-regulada ✓      | ✅  |                                                                                                                                                                                                                                                                 |
| 06 | B1·4      | b1.veredito      | 🟢 atende                                   | ✅  |                                                                                                                                                                                                                                                                 |
| 07 | B1·5      | b1.conta         | conta criada · entra no B2                  | ✅  |                                                                                                                                                                                                                                                                 |
| 08 | B2·6      | b2.socio         | sócio ok · solteiro (sem regime de bens)    | ✅  |                                                                                                                                                                                                                                                                 |
| 09 | B2·7      | b2.clt           | sem duplo vínculo · pró-labore normal       | ✅  |                                                                                                                                                                                                                                                                 |
| 10 | B2·8      | b2.socios        | ERRO: acima de 2 sócios: atendimento humano | ✅  | Fail-fast (UX-21) + handoff com dossiê (UX-35) já ✅. 4ª ordem: **modelar a alternativa agora** — 'com 2 sócios + o 3º como X você abriria hoje; ou o time do Mauro faz os 3'. Transformar o limite numa **decisão com opções**, não num 'não' roteado pra fila. |

**Resumo:** veredito B1: 🟢 atende ✅  ·  status: bloqueado ✅  ·  parou em: b2.socios ✅  ·  RESULTADO: ✅ PASS

Fonte da persona: [[casos-teste-fluxo-cnae]] FLOWS 7–9 — testes de bloqueio
