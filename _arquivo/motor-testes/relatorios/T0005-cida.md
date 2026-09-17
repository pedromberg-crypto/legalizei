# Relatório T0005 — persona "cida" (Cida — professora particular, 61 anos)

> flow **abertura** v0.2.0 · 2026-07-15 · **PASS ✅**

**Perfil (baixa familiaridade digital):** Dá aula de reforço e inglês há anos no informal, quer emitir nota pros pais dos alunos. Usa o celular só pra WhatsApp e foto. Fonte pequena a incomoda, lê devagar, tem medo de apertar o botão errado e estragar tudo. Se trava, chama a filha e desiste até ela chegar.

**Cobertura:** Entrada + B1 + B2 (completo, c/ simulador Fator R) + B3 (cobrança) + B4 (constituição) + B4.5 (ativação fiscal)

| #  | Tela      | Passo              | Resultado                                                                      | OK | Sugestão (olhar leigo)                                                                                          |
|----|-----------|--------------------|--------------------------------------------------------------------------------|----|-----------------------------------------------------------------------------------------------------------------|
| 01 | ENTRADA·3 | entrada.fork       | rota: abertura de CNPJ                                                         | ✅  | Botões grandes com rótulo literal ('abrir meu CNPJ'), não ícone; ela não decodifica símbolo.                    |
| 02 | B1·4      | b1.descricao       | descrição aceita                                                               | ✅  | Oferecer ditado por voz; ela digita devagar e erra no teclado do celular.                                       |
| 03 | B1·4      | b1.mapeamento      | CNAE 8593-7/00 · confiança alta · sem fork                                     | ✅  |                                                                                                                 |
| 04 | B1·4      | b1.desambiguacao   | (pulado)                                                                       | ✅  |                                                                                                                 |
| 05 | B1·4      | b1.filtro          | serviço ✓ · Simples ✓ · não-regulada ✓                                         | ✅  |                                                                                                                 |
| 06 | B1·4      | b1.veredito        | 🟢 atende                                                                      | ✅  | Confirmação com botão único e grande; medo de apertar errado exige zero ambiguidade.                            |
| 07 | B1·4      | b1.veredito::pausa | ⏸ chamou a filha pra confirmar · espera algumas horas · ▶ retomada idempotente | ✅  |                                                                                                                 |
| 08 | B1·5      | b1.conta           | conta criada · entra no B2                                                     | ✅  |                                                                                                                 |
| 09 | B2·6      | b2.socio           | sócio ok · casado (regime: comunhão parcial de bens)                           | ✅  | Fonte pequena no CPF/CEP a trava; permitir aumentar o texto e validar sem punir tentativa.                      |
| 10 | B2·7      | b2.clt             | sem duplo vínculo · pró-labore normal                                          | ✅  | Aposentada não é CLT. A pergunta tem que cobrir aposentado/autônomo, não só 'emprego registrado'.               |
| 11 | B2·8      | b2.socios          | solo (sem +sócios)                                                             | ✅  |                                                                                                                 |
| 12 | B2·9      | b2.empresa         | empresa ok · capital R$3000 · endereço próprio                                 | ✅  |                                                                                                                 |
| 13 | B2·10     | b2.cnae_sec        | sem secundários                                                                | ✅  |                                                                                                                 |
| 14 | B2·11     | b2.natureza        | natureza SLU (coerente com nº de sócios)                                       | ✅  |                                                                                                                 |
| 15 | B2·12     | b2.nome            | razão social + fantasia · nome disponível (viabilidade prévia)                 | ✅  |                                                                                                                 |
| 16 | B2·13     | b2.simulador       | est. Fator R 30% → Anexo III (6%) · já otimizado                               | ✅  | Jargão fiscal a perde. Falar 'quanto você se paga' e 'quanto economiza', com letra grande. Nunca 'Fator R' cru. |
| 17 | B2·14     | b2.revisao         | dossiê completo · handoff B3                                                   | ✅  |                                                                                                                 |
| 18 | B3·15     | b3.recap           | recap: economia do Fator R + escopo (abertura grátis + mensal)                 | ✅  |                                                                                                                 |
| 19 | B3·16     | b3.plano           | plano base (faixa ate 10k)                                                     | ✅  |                                                                                                                 |
| 20 | B3·17     | b3.aceite          | contrato + termo de início aceitos (assinatura)                                | ✅  | Medo de erro irreversível é o pico dela aqui. Botão único grande + explicação curta do que é o termo.           |
| 21 | B3·18     | b3.pagamento       | pagamento confirmado (cartao) · destrava B4                                    | ✅  |                                                                                                                 |
| 22 | B4·19     | b4.viabilidade     | viabilidade deferida (nome+endereço+CNAE) — JUCEMG unificada                   | ✅  | Pausa longa de órgão: mandar aviso proativo (WhatsApp) pra ela não achar que perdeu o dinheiro.                 |
| 23 | B4·20     | b4.dbe             | DBE gerado (Coleta Web/Receita)                                                | ✅  |                                                                                                                 |
| 24 | B4·21     | b4.registro        | contrato pronto (JUCEMG) + assinado GOV.BR prata/ouro                          | ✅  |                                                                                                                 |
| 25 | B4·21     | b4.taxa            | DAE JUCEMG paga (repasse ~R$268,51)                                            | ✅  |                                                                                                                 |
| 26 | B4·22     | b4.cnpj            | CNPJ emitido + opção Simples automática + CRC assina                           | ✅  |                                                                                                                 |
| 27 | B4·23     | b4.certificado     | certificado A1 emitido (pós-CNPJ)                                              | ✅  |                                                                                                                 |
| 28 | B4·24     | b4.municipal       | inscrição municipal + credenciamento NFS-e (DES-BH)                            | ✅  |                                                                                                                 |
| 29 | B4.5·25   | b45.ativacao       | procuração e-CAC → API Serpro (PGDAS-D/DAS automatizado)                       | ✅  |                                                                                                                 |
| 30 | FIM·—     | fim.ativa          | empresa ativa e operando ✅                                                     | ✅  |                                                                                                                 |

**Resumo:** veredito B1: 🟢 atende ✅  ·  status: ativa ✅  ·  parou em: fim.ativa ✅  ·  RESULTADO: ✅ PASS

Fonte da persona: [[casos-teste-fluxo-cnae]] (persona nova, eixo acessibilidade) · CNAE 🟡 [[cnae-atendidos-e-nao-atendidos]]
