---
tipo: derivado
status: vivo
data: 2026-07-15
assunto: inventario-de-telas
deriva_de: [reordenacao-flow-cobranca-cedo]
tags: [produto, ux, telas, mobile, onboarding, caminho-critico, inventario, pausas]
---

# 📱 Mapa de telas mobile — inventário + pausas (Entrada → B4 → dia-2)

> Inventário-verdade das telas do fluxo de abertura, na ordem, com estado de construção e **onde o flow pausa**. Sincronizado 2026-07-15 com as specs campo-a-campo: [[spec-telas-entrada-b1-b2]] (T1–T15) + [[spec-telas-b3-b4-aterrissagem]] (T16–T23). Lógica dos blocos em [[blocos-fluxo-abertura]]. Personas de validação em [[casos-teste-fluxo-cnae]].
>
> ⚠️ **Reescrito 2026-07-15:** a versão anterior (07-14, 20 telas, numeração antiga) ficou defasada depois das 4 rodadas de UX e da spec da cauda. Esta é a contagem oficial.

## 📊 Contagem oficial
- **22 telas** no arco **Entrada → B4**. **23** contando a aterrissagem/dia-2 (T23, já é pós-B4).
- **Ressalvas:** T2 (Welcome) = **3 slides** numa tela só (contagem crua ~24). **3 telas condicionais** não aparecem sempre → caminho mínimo (solo, cartão, sem swap) = **~20 telas**.
  - T8 +sócios (renderiza sempre, mas blocos repetidos só se há sócio) · **T13 CNAE ótimo** (só se há família de swap) · **T21 convite 2º sócio** (só se >1 sócio).
- **Protótipo cobre T1–T6** (entrada + B1 + 1ª tela do B2). Faltam **T7–T23**.
- **🎛️ A decisão de trilha (UX-48, 16/07) NÃO muda esta contagem.** Trilha única: a coorte capturada no T5 (*"É a primeira empresa que você abre?"*) é **dado puro**, não bifurcação — zero tela nova, zero fork. Os "universais" (botão grande, zero jargão, recap) são default pra todos e a profundidade é expander pra todos, dentro das mesmas telas. → [[mapa-ramificacoes-flow]] · [[spec-instrumentacao-flow]]

## Inventário (na ordem do fluxo)

| # | Tela | Bloco | Temos? | Arquivo | O que é (simples) |
|---|---|---|---|---|---|
| 1 | Splash | Entrada | ✅ | `splash.html` | Abertura coral, logo, handoff slide-up |
| 2 | Welcome (3 slides) | Entrada | ✅ | `welcome.html` | Boas-vindas, o que o app faz |
| 3 | Entrada (fork) | Entrada | ✅ | `fluxo-entrada.html` | "Já tenho CNPJ" × "Quero abrir" |
| 4 | Gate-CNAE | **B1** | ✅ | `gate-cnae.html` | Descreve atividade → valida CNAE → veredito 🟢/🟡/🔴 + waitlist |
| 5 | Login / criar conta | B1→B2 | ✅ | `login.html` | Cria conta depois do 🟢; detecta nível GOV.BR |
| 6 | 2.1 Dados do sócio | **B2** | ✅ | `fase-0-dados-socio.html` | Nome, CPF (valida situação), estado civil, endereço, reside no exterior |
| 7 | 2.2 Duplo vínculo CLT | B2 | ❌ | — | "Contribui pro INSS por fora?" + valor + folga do teto INSS |
| 8 | 2.3 +Sócios | B2 | ❌ | — | Máx 2 sócios; % participação = 100% |
| 9 | 2.4 Dados da empresa | B2 | ❌ | — | Endereço, IPTU, capital social + upsell endereço fiscal |
| 10 | 2.5 CNAE secundários | B2 | ❌ | — | IA sugere secundários + pill prova social; cliente edita |
| 11 | 2.6 Natureza jurídica | B2 | ❌ | — | IA recomenda (SLU solo / LTDA 2+); confirma |
| 12 | 2.7 Razão social + fantasia | B2 | ❌ | — | Nomes + checagem de viabilidade |
| 13 | 2.8 **CNAE fiscalmente ótimo** | B2 (condicional) | ❌ | — | Só se há família de swap; CNAE atual × ótimo + prova exportável |
| 14 | 2.9 **Simulador Fator R + pró-labore** | B2 | ❌ | — | **Clímax:** Anexo III×V, pró-labore ótimo, quanto economiza, "e se?" |
| 15 | 2.10 Revisão do dossiê | B2 | ❌ | — | Confere tudo + dossiê exportável → handoff pro B3 |
| 16 | 3.1 Recap + "conta da abertura" | **B3** | ❌ | — | Custo total num lugar: grátis × governo × recorrente |
| 17 | 3.2 Plano + método de pagamento | B3 | ❌ | — | Plano único ~R$195 · cartão/boleto/Pix (Asaas) |
| 18 | 3.3 Aceite + termo irreversível | B3 | ❌ | — | Contrato + termo ("taxas de governo não voltam") + cancelamento |
| 19 | 3.4 Pagamento + dunning | B3 | ❌ | — | Cartão destrava B4; boleto/Pix = aguardando pagamento |
| 20 | 4.0 **Painel de acompanhamento** | **B4** | ❌ | — | Timeline assíncrona (junta→receita→certificado); 4 estados (✅/⏳/⬜/🔴) |
| 21 | 4.1 Convite do 2º sócio | B4 (condicional) | ❌ | — | Só se >1 sócio; sócio confirma dados + aprova (consenso) |
| 22 | 4.2 Assinatura GOV.BR + procuração e-CAC | B4 | ❌ | — | Assina no GOV.BR (prata/ouro); procuração e-CAC explicada |
| 23 | 5.1 Empresa ativa + 1ºs passos | 🛬 Dia-2 | ❌ | — | 1ª nota · 1º DAS · certificado; loop estimativa→realidade |

## ⏸️ Pausas do flow

> Pausa = o flow para e espera (usuário sai · aguarda órgão externo · aguarda 3º). Todas idempotentes: retomar restaura estado + revalida dados perecíveis (UX-23/38).

| # | Pausa | Tela | Tipo | Quando | Como sai |
|---|---|---|---|---|---|
| P1 | Salvar & retomar | B2 (6→15) | Voluntária | Qualquer ponto do B2 | Retoma idempotente + revalida perecíveis |
| P2 | Aguardando pagamento | 19 | Assíncrona (horas/dias) | Só boleto/Pix — cartão NÃO pausa | Compensou → destrava B4; dunning + re-engajamento (UX-45) |
| P3 | Aguardando 2º sócio | 21 | Espera de 3º | Só se >1 sócio | Sócio confirma dados + aprova (consenso UX-44) |
| P4 | Assinatura GOV.BR | 22 | Externa (sai do app) | Sempre (todos os sócios) | Deep-link GOV.BR → volta idempotente |
| P5 | Constituição assíncrona | 20 | Órgão externo (**dias**) | Sempre — a maior | Timeline por etapa + WhatsApp proativo (UX-18) |

- **P5 é multi-pausa interna:** cada órgão é uma espera — viabilidade → DBE → JUCEMG → DAE → CNPJ → Simples → certificado → inscrição municipal/NFS-e → e-CAC. Cada uma mostra "leva ~X dias".
- **Pausa-armadilha (fora do happy path):** T20 tem 4º estado **🔴 "precisamos de você"** (UX-40) — órgão recusa (nome reprovado, DAE volta, doc pendente). Exige ação sua, não só espera.
- **Pré-condição que vira pausa:** conta GOV.BR bronze→prata/ouro (sinalizada no B1 T5, exigida no B4 T22). Sem ela, trava a assinatura.

## Links
- [[spec-telas-entrada-b1-b2]] · [[spec-telas-b3-b4-aterrissagem]] — specs campo-a-campo (fonte-verdade)
- [[blocos-fluxo-abertura]] — spec dos blocos (state machine)
- [[casos-teste-fluxo-cnae]] — personas p/ validar a lógica do fluxo
- [[legalize-prototipo-ux]] · [[2026-07-12-fluxo-entrada-completo-prototipo]] · [[compilado-ux-flow]] · [[HOME]]
