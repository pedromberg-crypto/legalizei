# Relatório T0367 — persona "bloq-exterior" (Bloqueio 8 — sócio no exterior (único fatal))

> flow **abertura** v0.5.0 · 2026-07-21 · **PASS ✅**

**Perfil (médio-alto):** Empreendedor com sócio morando fora. Não sabe que isso barra o Simples.

**Cobertura:** Entrada + B1 (gate+ENCAIXE+resumo) + B3 (cobrança) + B2 (dossiê, sem N17) + B4 + B4.5

| #  | Tela       | Passo            | Resultado                                                                        | OK | Sugestão (olhar leigo) |
|----|------------|------------------|----------------------------------------------------------------------------------|----|------------------------|
| 01 | ENTRADA·N3 | entrada.fork     | rota: abertura de CNPJ (flow #1)                                                 | ✅  |                        |
| 02 | B1·N4      | b1.descricao     | descrição aceita                                                                 | ✅  |                        |
| 03 | B1·N4      | b1.mapeamento    | CNAE 7020-4/00 · confiança alta · sem fork                                       | ✅  |                        |
| 04 | B1·N4      | b1.desambiguacao | (pulado)                                                                         | ✅  |                        |
| 05 | B1·N4      | b1.filtro        | serviço ✓ · Simples ✓ · não-regulada ✓                                           | ✅  |                        |
| 06 | B1·N4      | b1.veredito      | 🟢 atende                                                                        | ✅  |                        |
| 07 | B1·N-ENC   | b1.encaixe       | enquadramento único (sem CNAE alternativo) · segue com o código encontrado       | ✅  |                        |
| 08 | B1·N4      | b1.triagem       | ERRO: sócio no exterior: bloqueia opção Simples (LC 123 art.17 II) → rota humana | ✅  |                        |

**Resumo:** veredito B1: 🟢 atende ✅  ·  status: bloqueado ✅  ·  parou em: b1.triagem ✅  ·  RESULTADO: ✅ PASS

Fonte da persona: [[casos-teste-fluxo-cnae]] FLOWS 7–9 — testes de bloqueio · [[fiscal-simples-bh-2026]] F
