# Relatório T0003 — persona "cida" (Cida — professora particular, 61 anos)

> flow **abertura** v0.1.0 · 2026-07-15 · **PASS ✅**

**Perfil (baixa familiaridade digital):** Dá aula de reforço e inglês há anos no informal, quer emitir nota pros pais dos alunos. Usa o celular só pra WhatsApp e foto. Fonte pequena a incomoda, lê devagar, tem medo de apertar o botão errado e estragar tudo. Se trava, chama a filha e desiste até ela chegar.

**Cobertura:** Entrada + B1 (gate-cnae / login) + começo do B2 (2.1 sócio, 2.2 CLT)

| #  | Tela      | Passo              | Resultado                                                                      | OK | Sugestão (olhar leigo)                                                                            |
|----|-----------|--------------------|--------------------------------------------------------------------------------|----|---------------------------------------------------------------------------------------------------|
| 01 | ENTRADA·3 | entrada.fork       | rota: abertura de CNPJ                                                         | ✅  | Botões grandes com rótulo literal ('abrir meu CNPJ'), não ícone; ela não decodifica símbolo.      |
| 02 | B1·4      | b1.descricao       | descrição aceita                                                               | ✅  | Oferecer ditado por voz; ela digita devagar e erra no teclado do celular.                         |
| 03 | B1·4      | b1.mapeamento      | CNAE 8593-7/00 · confiança alta · sem fork                                     | ✅  |                                                                                                   |
| 04 | B1·4      | b1.desambiguacao   | (pulado)                                                                       | ✅  |                                                                                                   |
| 05 | B1·4      | b1.filtro          | serviço ✓ · Simples ✓ · não-regulada ✓                                         | ✅  |                                                                                                   |
| 06 | B1·4      | b1.veredito        | 🟢 atende                                                                      | ✅  | Confirmação com botão único e grande; medo de apertar errado exige zero ambiguidade.              |
| 07 | B1·4      | b1.veredito::pausa | ⏸ chamou a filha pra confirmar · espera algumas horas · ▶ retomada idempotente | ✅  |                                                                                                   |
| 08 | B1·5      | b1.conta           | conta criada · entra no B2                                                     | ✅  |                                                                                                   |
| 09 | B2·6      | b2.socio           | sócio ok · casado (regime: comunhão parcial de bens)                           | ✅  | Fonte pequena no CPF/CEP a trava; permitir aumentar o texto e validar sem punir tentativa.        |
| 10 | B2·7      | b2.clt             | sem duplo vínculo · pró-labore normal                                          | ✅  | Aposentada não é CLT. A pergunta tem que cobrir aposentado/autônomo, não só 'emprego registrado'. |

**Resumo:** veredito B1: 🟢 atende ✅  ·  status: segue ✅  ·  parou em: b2.clt ✅  ·  RESULTADO: ✅ PASS

Fonte da persona: [[casos-teste-fluxo-cnae]] (persona nova, eixo acessibilidade) · CNAE 🟡 [[cnae-atendidos-e-nao-atendidos]]
