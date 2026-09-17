# Relatório T0031 — persona "knife" (Gustavo — consultor de TI solo (Fator R na borda + boleto))

> flow **abertura** v0.2.2 · 2026-07-15 · **PASS ✅**

**Perfil (alto):** Sabe de imposto, quer o Anexo III no talo. Escolhe boleto por hábito e esquece de pagar. Volta depois.

**Cobertura:** Entrada + B1 + B2 (completo, c/ simulador Fator R) + B3 (cobrança) + B4 (constituição) + B4.5 (ativação fiscal)

| #  | Tela      | Passo            | Resultado                                                      | OK | Sugestão (olhar leigo)                                                                                |
|----|-----------|------------------|----------------------------------------------------------------|----|-------------------------------------------------------------------------------------------------------|
| 01 | ENTRADA·3 | entrada.fork     | rota: abertura de CNPJ                                         | ✅  |                                                                                                       |
| 02 | B1·4      | b1.descricao     | descrição aceita                                               | ✅  |                                                                                                       |
| 03 | B1·4      | b1.mapeamento    | CNAE 6204-0/00 · confiança alta · sem fork                     | ✅  |                                                                                                       |
| 04 | B1·4      | b1.desambiguacao | (pulado)                                                       | ✅  |                                                                                                       |
| 05 | B1·4      | b1.filtro        | serviço ✓ · Simples ✓ · não-regulada ✓                         | ✅  |                                                                                                       |
| 06 | B1·4      | b1.veredito      | 🟢 atende                                                      | ✅  |                                                                                                       |
| 07 | B1·5      | b1.conta         | conta criada · entra no B2                                     | ✅  |                                                                                                       |
| 08 | B2·6      | b2.socio         | sócio ok · solteiro (sem regime de bens)                       | ✅  |                                                                                                       |
| 09 | B2·7      | b2.clt           | sem duplo vínculo · pró-labore normal                          | ✅  |                                                                                                       |
| 10 | B2·8      | b2.socios        | solo (sem +sócios)                                             | ✅  |                                                                                                       |
| 11 | B2·9      | b2.empresa       | empresa ok · capital R$10000 · endereço próprio                | ✅  |                                                                                                       |
| 12 | B2·10     | b2.cnae_sec      | sem secundários                                                | ✅  |                                                                                                       |
| 13 | B2·11     | b2.natureza      | natureza SLU (coerente com nº de sócios)                       | ✅  |                                                                                                       |
| 14 | B2·12     | b2.nome          | razão social + fantasia · nome disponível (viabilidade prévia) | ✅  |                                                                                                       |
| 15 | B2·13     | b2.cnae_otimo    | enquadramento único (sem CNAE alternativo)                     | ✅  |                                                                                                       |
| 16 | B2·13     | b2.simulador     | est. Fator R 28% → Anexo III (6%) · já otimizado               | ✅  | Na borda (28% cravado) mostrar a sensibilidade: 'um real a menos de pró-labore te joga pro Anexo V'.  |
| 17 | B2·14     | b2.revisao       | dossiê completo · handoff B3                                   | ✅  |                                                                                                       |
| 18 | B3·15     | b3.recap         | recap: economia do Fator R + escopo (abertura grátis + mensal) | ✅  |                                                                                                       |
| 19 | B3·16     | b3.plano         | plano pro (faixa 30k+)                                         | ✅  |                                                                                                       |
| 20 | B3·17     | b3.aceite        | contrato + termo de início aceitos (assinatura)                | ✅  |                                                                                                       |
| 21 | B3·18     | b3.pagamento     | pagamento não pago (boleto) · dunning · NÃO destrava B4        | ✅  | Boleto fora do happy path: deixar explícito que a abertura só começa quando compensar. Dunning claro. |

**Resumo:** veredito B1: 🟢 atende ✅  ·  status: aguardando-pagamento ✅  ·  parou em: b3.pagamento ✅  ·  RESULTADO: ✅ PASS

Fonte da persona: [[casos-teste-fluxo-cnae]] FLOW 5 — Knife-edge & Boleto
