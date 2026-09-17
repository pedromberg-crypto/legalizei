# Relatório T0002 — persona "reta" (Bruno — dev freelancer solo)

> flow **abertura** v0.1.0 · 2026-07-15 · **PASS ✅**

**Perfil (leigo total):** Nunca abriu empresa. Não sabe o que é CNAE, pró-labore nem Simples. Quer só ficar legal pra emitir nota pros clientes. Lê tudo, tem medo de errar, abandona se travar.

**Cobertura:** Entrada + B1 (gate-cnae / login) + começo do B2 (2.1 sócio, 2.2 CLT)

| #  | Tela      | Passo            | Resultado                                                       | OK | Sugestão (olhar leigo)                                                                                     |
|----|-----------|------------------|-----------------------------------------------------------------|----|------------------------------------------------------------------------------------------------------------|
| 01 | ENTRADA·3 | entrada.fork     | rota: abertura de CNPJ                                          | ✅  |                                                                                                            |
| 02 | B1·4      | b1.descricao     | descrição aceita                                                | ✅  | Leigo trava no campo vazio. Manter placeholder typewriter com exemplos reais e aceitar gíria (já specado). |
| 03 | B1·4      | b1.mapeamento    | CNAE 6201-5/00 · confiança alta · sem fork                      | ✅  | Mostrar o CNAE em linguagem humana antes do código; leigo não decora número.                               |
| 04 | B1·4      | b1.desambiguacao | (pulado)                                                        | ✅  |                                                                                                            |
| 05 | B1·4      | b1.filtro        | serviço ✓ · Simples ✓ · não-regulada ✓                          | ✅  |                                                                                                            |
| 06 | B1·4      | b1.veredito      | 🟢 atende                                                       | ✅  | No 🟢, dizer em 1 linha o que vem agora ('vamos criar sua conta'); senão o leigo hesita.                   |
| 07 | B1·5      | b1.conta         | conta criada · entra no B2                                      | ✅  |                                                                                                            |
| 08 | B2·6      | b2.socio         | sócio ok · solteiro (sem regime de bens)                        | ✅  | Regime de bens é jargão. Microcopy inline que ensina, não culpa.                                           |
| 09 | B2·6      | b2.socio::pausa  | ⏸ usuário fechou o app · espera 2 dias · ▶ retomada idempotente | ✅  |                                                                                                            |
| 10 | B2·7      | b2.clt           | sem duplo vínculo · pró-labore normal                           | ✅  | 'Duplo vínculo CLT' é técnico. Perguntar 'você trabalha registrado em carteira em outro lugar?'            |

**Resumo:** veredito B1: 🟢 atende ✅  ·  status: segue ✅  ·  parou em: b2.clt ✅  ·  RESULTADO: ✅ PASS

Fonte da persona: [[casos-teste-fluxo-cnae]] FLOW 1 — Reta
