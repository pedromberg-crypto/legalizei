---
tipo: derivado
status: vivo
data: 2026-07-21
assunto: auditoria-copy-flow
deriva_de: [flow-data, mapa-flow-mermaid, compilado-ux-flow]
tags: [produto, ux, copy, flow, auditoria, redundancia, negativa]
---

# 🔎 Auditoria de copy do flow — âncora de adaptação

> **Nota-âncora.** É daqui que a gente adapta a copy do flow de abertura (N1 → empresa ativa). Cada achado tem **ID estável** (R#/M#/F#) e **status** que a gente vira conforme aplica. O **Índice de telas** é GERADO do `flow-data.mjs` (links de código + rota que não apodrecem); os **achados** são curadoria à mão.
>
> Varredura-base: 2026-07-21 (26 telas + 8 componentes lidos integralmente). Companheira do [[mapa-flow-mermaid]] (que é ESTRUTURA); esta é COPY.

## 🧭 Como usar
1. **Adaptar uma tela?** Acha ela no **Índice** → abre o código pelo link → confere no `/mockup` pela rota.
2. **Fechar um achado?** Vira o status na tabela (§ Achados) e, se virou decisão, registra no ADR `marca/decisoes-marca.md`.
3. **Regenerar o índice** (mudou/renomeou tela): `node execucao/flow/gerar-indice-telas.mjs`. **NÃO editar o bloco entre `<!-- INDICE -->` à mão** — o gerador sobrescreve.
4. **Links de código** usam `<...>` por causa dos parênteses dos route-groups (`(app)`/`(wizard)`), senão o markdown quebra.
5. **Rodar uma varredura nova?** Segue a rubrica viva em [[metodo-varredura-flow]] (as 11 dimensões D1–D11, mecânica + crítica numa passada só).

## 📊 Legenda de status
🔲 aberto · 🔄 em debate · ✅ aplicado · ⏸️ deixado de propósito

---

## 🧱 Índice de telas (GERADO — não editar à mão)

<!-- INDICE:INI -->
| # | Tela | Shell | Código | Rota viva |
|---|---|:--:|:--:|---|
| N1 | N1 · Splash | wizard | [código](<app/src/app/(wizard)/splash/page.tsx>) | [/splash](http://localhost:3000/splash) |
| N2 | N2 · Welcome | wizard | [código](<app/src/app/(wizard)/welcome/page.tsx>) | [/welcome](http://localhost:3000/welcome) |
| N3 | N3 · Fork · 3 rotas | wizard | [código](<app/src/app/(wizard)/entrada/page.tsx>) | [/entrada](http://localhost:3000/entrada) |
| LOGIN | Login / portal | wizard | [código](<app/src/app/(wizard)/login/page.tsx>) | [/login](http://localhost:3000/login) |
| N4A | Descreve atividade + pills | wizard | [código](<app/src/app/(wizard)/gate/page.tsx>) | [/gate](http://localhost:3000/gate) |
| VA | 🟢 Atende | wizard | [código](<app/src/app/(wizard)/veredito/atende/page.tsx>) | [/veredito/atende](http://localhost:3000/veredito/atende) |
| VW | 🟡 Waitlist | wizard | [código](<app/src/app/(wizard)/veredito/waitlist/page.tsx>) | [/veredito/waitlist](http://localhost:3000/veredito/waitlist) |
| VC | 🔴 Comercial Mauro | wizard | [código](<app/src/app/(wizard)/veredito/nao-atende/page.tsx>) | [/veredito/nao-atende](http://localhost:3000/veredito/nao-atende) |
| N5 | N5 · Teaser · swap / fator-R / serviço | wizard | [código](<app/src/app/(wizard)/teaser/swap/page.tsx>) | [/teaser/swap](http://localhost:3000/teaser/swap) · [/teaser/fator-r](http://localhost:3000/teaser/fator-r) · [/teaser/servico](http://localhost:3000/teaser/servico) |
| N6 | N6 · Criar conta | wizard | [código](<app/src/app/(wizard)/conta/page.tsx>) | [/conta](http://localhost:3000/conta) |
| N7 | N7 · A conta da abertura | wizard | [código](<app/src/app/(wizard)/plano/page.tsx>) | [/plano](http://localhost:3000/plano) |
| N8 | N8 · Aceite contrato · reversível, CDC 49 | wizard | [código](<app/src/app/(wizard)/contrato/page.tsx>) | [/contrato](http://localhost:3000/contrato) |
| N9 | N9 · Pagamento | wizard | [código](<app/src/app/(wizard)/pagamento/page.tsx>) | [/pagamento](http://localhost:3000/pagamento) |
| P2 | P2 · Aguardando boleto · dossiê já liberado | app | [código](<app/src/app/(app)/aguardando/page.tsx>) | [/aguardando](http://localhost:3000/aguardando) |
| N10 | N10 · Seus dados | app | [código](<app/src/app/(app)/dossie/socio/page.tsx>) | [/dossie/socio](http://localhost:3000/dossie/socio) |
| N11 | N11 · Vínculo INSS | app | [código](<app/src/app/(app)/dossie/vinculo/page.tsx>) | [/dossie/vinculo](http://localhost:3000/dossie/vinculo) |
| N12 | N12 · Sócios? | app | [código](<app/src/app/(app)/dossie/socios/page.tsx>) | [/dossie/socios](http://localhost:3000/dossie/socios) |
| N13 | N13 · Dados da empresa · +upsell endereço | app | [código](<app/src/app/(app)/dossie/empresa/page.tsx>) | [/dossie/empresa](http://localhost:3000/dossie/empresa) |
| N14 | N14 · CNAE secundários | app | [código](<app/src/app/(app)/dossie/cnae-secundarios/page.tsx>) | [/dossie/cnae-secundarios](http://localhost:3000/dossie/cnae-secundarios) |
| N15 | N15 · Natureza jurídica | app | [código](<app/src/app/(app)/dossie/natureza/page.tsx>) | [/dossie/natureza](http://localhost:3000/dossie/natureza) |
| N16 | N16 · Nome / razão social | app | [código](<app/src/app/(app)/dossie/nome/page.tsx>) | [/dossie/nome](http://localhost:3000/dossie/nome) |
| N17 | N17 · CNAE ótimo | app | [código](<app/src/app/(app)/dossie/cnae-otimo/page.tsx>) | [/dossie/cnae-otimo](http://localhost:3000/dossie/cnae-otimo) |
| N18 | N18 · Simulador pró-labore | app | [código](<app/src/app/(app)/simulador/page.tsx>) | [/simulador](http://localhost:3000/simulador) |
| P1 | P1 · Retomar de onde parou | app | [código](<app/src/app/(app)/retomar/page.tsx>) | [/retomar](http://localhost:3000/retomar) |
| SE | Saída · exterior · LC 123 art.17 | wizard | [código](<app/src/app/(wizard)/saida/exterior/page.tsx>) | [/saida/exterior](http://localhost:3000/saida/exterior) |
| SS | Saída · 3+ sócios · limite do produto | wizard | [código](<app/src/app/(wizard)/saida/socios/page.tsx>) | [/saida/socios](http://localhost:3000/saida/socios) |
| N19 | N19 · Revisar dossiê | app | [código](<app/src/app/(app)/revisar/page.tsx>) | [/revisar](http://localhost:3000/revisar) |
| N20 | N20 · Termo irreversível | app | [código](<app/src/app/(app)/termo/page.tsx>) | [/termo](http://localhost:3000/termo) |
| N21 | N21 · Painel / timeline órgãos | app | [código](<app/src/app/(app)/painel/page.tsx>) | [/painel](http://localhost:3000/painel) |
| REC | REC · Órgão recusa · 'precisa de você' | app | [código](<app/src/app/(app)/painel/recusa/page.tsx>) | [/painel/recusa](http://localhost:3000/painel/recusa) |
| N22 | N22 · Assinatura dos sócios | app | [código](<app/src/app/(app)/assinatura/page.tsx>) | [/assinatura](http://localhost:3000/assinatura) |
| ATIVA | ✅ Empresa ativa | app | [código](<app/src/app/(app)/ativa/page.tsx>) | [/ativa](http://localhost:3000/ativa) |

_32 telas navegáveis · gerado de `flow-data.mjs`._
<!-- INDICE:FIM -->

---

## 🔁 Achados — Redundância (mesma info em telas diferentes)

| ID | Status | Onde | O que se repete | Recomendação | Sev |
|---|:--:|---|---|---|:--:|
| R1 | ✅ | N9 · P2 · N21 · P1 | "não cobra / não abre duas vezes" (idempotência, quase igual) | forte no **N9**; meia-linha nas telas de espera. Boleto vê 3× na mesma jornada | 🔴 |
| R2 | ✅ | N7 · N8 · N19 · N20 | "a taxa é do governo, não é nossa / não volta" | N7 é o dono; N8 e N19 só mencionam de raspão. Ver **M1** (o pior é interno ao N20) | 🔴 |
| R3 | ✅ | N2 = N3 | "22 anos de escritório por trás do app" (**string idêntica**, telas coladas) | varia a redação numa das duas | 🟠 |
| R4 | ✅ | N5 · N17 · N18 · N19 | carimbo "Estimativa. A gente confirma com o contador..." (idêntico 4×) | obrigatório por regra; variar a forma pro olho não pular | 🟠 |
| R5 | ✅ | N5 · N17 | "Não é malandragem / é o que um bom contador faz" | N17 assume que já foi dito no N5 e vai ao número | 🟠 |
| R6 | ✅ | N4 = N10 | bloqueio exterior ("existe, mas fica fora do Simples") | N10 confirma seco, sem repetir o corpo | 🟡 |
| R7 | ✅ | N7 · N8 | sub "Sem letra miúda" | tira de uma | 🟡 |

**Menores (contexto exclusivo, provável não mexer):** "limite 2 sócios" N4/N12/saída · "a parte chata é com a gente" (refrão de marca, N2/N3/N21) · "você não repete nada" (veredito/saída, ramos que o mesmo user não vê).

**✅ Aplicado 2026-07-21 (R1–R7):**
- **R1** — N9 fica âncora (mantido). **P2** "Se você já pagou, não cobramos de novo" · **P1** "Seu pagamento está registrado. Nada é cobrado nem aberto duas vezes" · **N21** "A abertura roda uma vez só, sem cobrança dupla".
- **R2** — N8 bullet perdeu "e vão direto pro Estado" · N19 taxa virou **"Taxa da Junta (já paga) / Repasse ao governo, já incluído no que você pagou"**. (N20 fica pro **M1**.)
- **R3** — N3 selo → **"Um escritório de verdade, não um app sozinho."** (N2 mantém os 22 anos.)
- **R4** — carimbos variados: N5 "O número exato a gente fecha com o contador" · N17 "O contador confirma antes de trocar o código" · N19 "O contador confere tudo antes da gente registrar" · **N18 mantido canônico**.
- **R5** — N17 título → **"Por que a troca é legítima"** + corpo encurtado (assume o argumento do N5).
- **R6** — N10 exterior reescrito, não copia mais o N4.
- **R7** — N8 perdeu "Sem letra miúda" (N7 mantém).

## 📚 Achados — Informação massiva

| ID | Status | Onde | O peso | Recomendação | Sev |
|---|:--:|---|---|---|:--:|
| M1 | ✅ | N20 termo | Aviso + Item 2 + Camada 2 dizem a MESMA coisa ("taxa não volta") 3× na mesma tela | Camada 2 é o lugar canônico; Aviso vira 1 linha ou sai | 🔴 |
| M2 | ✅ | N17 CNAE ótimo | 2 avisos empilhados + pré-explica a alavanca do N18 (pró-labore) | menção de 1 linha, deixa o N18 explicar | 🟠 |
| M3 | ✅ | N8 contrato | card de credenciais (3 pontos) logo após 4 bullets | card vira 1-2 pontos | 🟠 |

**Menores:** N18 simulador é denso por natureza (farol "complexa", usa expander) · N11 pode empilhar 2 avisos.

**✅ Aplicado 2026-07-21 (M1–M3):**
- **M1** — N20: a "taxa não volta" foi de 3× pra 1×. **Camada 2** vira o dono do dinheiro (não-reembolsável); o **Aviso** passa a ser só a irreversibilidade da AÇÃO ("a abertura começa de verdade... o registro segue em frente"); o **checkbox** consente na irreversibilidade sem re-encodar a taxa. Item 2 fica (é repasse, faceta distinta). Sumiu o `import CUSTOS/brl`.
- **M2** — N17: o bloco "Existem dois caminhos" (que pré-explicava o pró-labore, assunto inteiro do N18) virou **1 linha**: "esse é o mais fácil dos dois; o outro a gente vê na próxima tela".
- **M3** — N8: card de credenciais **3 → 2 pontos**. Saiu "Nada acontece sem você" (a tranquilidade de "não travou" já vem do bullet "nada é irreversível hoje"); ficam as 2 provas de com quem se assina (22 anos + contador com nome). Removido o `IconeMao` órfão. ⚠️ **decisão a validar:** dropei "nada acontece sem você" e mantive "22 anos"; se preferir o inverso, é 1 troca.

## 🚫 Achados — Frase negativa (foco no caminho feliz)

| ID | Status | Onde | Trecho | Reenquadre proposto | Sev |
|---|:--:|---|---|---|:--:|
| F1 | 🔲 | N24 ativa | "A gente **não some** depois de abrir" (na tela de celebração) | "A gente continua com você depois de abrir" | 🟠 |
| F2 | 🔲 | N6 conta | "**Ainda não** estamos cobrando nada" | "Criar conta é de graça. Você só paga quando decidir abrir" | 🟠 |
| F3 | 🔲 | N15 natureza | "**Não precisa** decorar sigla" | "A gente cuida da sigla. Os dois separam seu dinheiro do da empresa" | 🟠 |
| F4 | 🔲 | N16 nome | "evitar que o nome seja **reprovado** no meio do caminho" | "pra o nome passar de primeira" | 🟡 |
| F5 | 🔲 | N13 empresa | "**Sem** endereço comercial **deixa de ser problema**" | "Você fica com um endereço comercial pronto, mesmo sem ter um" | 🟡 |
| F6 | 🔲 | N9 pagamento | "**nunca** cobra duas vezes" (dupla negação na fronteira do dinheiro) | "Pago uma vez, aberto uma vez" | 🟡 |

**Deixados de fora de propósito** (⏸️ negativo é honestidade estrutural, não mexer): N5 fator-r "começa em zero" · N18 "encostado no limite" · N20 "não dá pra desfazer" · todas as saídas/waitlist (rejeição = registro correto).

**Travessão:** ✅ limpo — nenhum `—` em copy visível (só em comentário de código).

**Priorização sugerida (aplicar primeiro):** R1 · R2+M1 (família da taxa) · R3 · F1 · F2.

---

## 🎯 Olhar crítico (K) — craft / flow / feel

> Além da auditoria mecânica: julgamento de design sobre as telas que a gente mexeu. Todos aplicados 2026-07-21.

| ID | Status | Tela | O que mudou | Por quê | Sev |
|---|:--:|---|---|---|:--:|
| K1 | ✅ | N21 painel | "cerca de 8 dias úteis" → qualitativo ("depende de cada órgão, a gente avisa a cada passo") | **Anti-guru:** número inventado na tela mais ansiosa. Prazo de abertura é o que o concorrente não divulga; furar destrói confiança. Volta como estimativa COM fonte quando o pipeline do dev der tempo real | 🔴 |
| K2 | ✅ | N3 entrada | selo → **"Um escritório de contabilidade de verdade, em BH."** | Meu fix do R3 tinha virado negativa ("não um app sozinho"). Positivo, mantém a credencial, sem o "não" | 🟠 |
| K3 | ✅ | N24 ativa | **entrada comemorativa** (card sobe + selo verde dá pop com overshoot) | Abrir empresa é vitória real; 1 beat sem tapar conteúdo. *(Revisado 21/07: o Confetti da marca resolvia num check coral PARADO no meio da tela cobrindo o texto, o Pedro pegou no mockup. Trocado por materialização.)* | 🟠 |
| K4 | ✅ | N8 + N20 | **checkbox unificado no DS** (`ui/form.tsx`) | Duas telas-irmãs de aceite, dois padrões (N8 nativo × N20 custom verde). Um só, coral (ação, não estado-sucesso). ⚠️ mudou o texto do aceite do N8 pra caption/secondary | 🟠 |
| K5 | ✅ | N19 revisar | "Ajustar" = **contrato de interação travado** (edit-and-return, nunca re-anda N14→N18) | Sem isso decidido, ou forçava re-walk (punitivo) ou quebrava. Decisão no código; dev implementa | 🟠 |
| K6 | ✅ | N21 painel | footer sticky → **link inline** | Tela de status não tem ação primária; botão sticky prometia ação inexistente. Rodapé fixo só volta na recusa (aí há ação) | 🟡 |
| K7 | ✅ | N22 assinatura | legenda da lista alinhada aos botões | "Você: sua vez de assinar" brigava com o CTA "convidar o Bruno". Agora a linha do dono espelha o ghost, a do sócio espelha o primário (consenso-first) | 🟡 |
| K8 | ✅ | N19 revisar | CTA "Está tudo certo, continuar" → **"Confirmar e seguir"** | Título já pergunta "Está tudo certo?"; CTA repetia na mesma tela | 🟡 |
| K9 | ✅ | N20 termo | 4 camadas: lista numerada → **bullets** | Número implicava sequência; são 4 fatos independentes, não passos | 🟡 |
| K10 | ✅ | N19 revisar | tira a **re-venda de economia** do review | No confirm final o trabalho é conferir FATO (pró-labore escolhido), não revender economia (4ª vez). *(Supera a instância N19 do R4: sem número estimado, sem carimbo.)* | 🟡 |

---

## 🔬 Varredura pesada (V) — rubrica inteira D1–D11 nas 3 telas do round M

> 2026-07-21. Duas câmeras (agente adversarial + camada crítica) sobre N20/N17/N8 no estado pós-M. **Achado-chave:** o método pegou um fix MEU incompleto (V6 — o R5 só arrumou o título do aviso do N17). D4/D6/D8 limpos.

| ID | Status | Tela | Dim | Achado → o que virou |
|---|:--:|---|:--:|---|
| V1 | ✅ | N20 | D5 | "a taxa da Junta que você já pagou" era 2× (Item 2 + Camada 2) → Camada 2 vira "A taxa da Junta não é reembolsável..." |
| V2 | ✅ | N20 | D5 | corpo do Aviso só recapitulava o intro+Item 1 → agora fala da consequência ("ponto sem volta") |
| V3 | ✅ | N20 | D7 | checks verdes (`state-success`) em ações futuras → coral (`action-primary`) |
| V4 | ✅🟡 | N20 | D11 | checkbox não nomeava a taxa não-reembolsável → agora nomeia. Reverte em parte a M1 de propósito (consentir ≠ divulgar). **Redação final = Larissa** |
| V5 | ✅ | N20 | D3 | "Você não paga nada de novo" (negativo) → "A taxa que você já pagou cobre esse registro" |
| V6 | ✅ | N17 | D1 | corpo do aviso "por que legítima" ecoava o N5 quase verbatim (R5 só arrumou o título) → só o mecanismo novo ("o que muda é a tabela") |
| V7 | ✅ | N17 | D9 | "Baixar PDF" tinha peso de CTA → virou link leve com ícone |
| V8 | ⏸️ | N17 | D2 | 2 avisos empilhados → **não mexido**: a spec obriga o tradeoff visível, fundir enterraria disclosure |
| V9 | ✅ | N8 | D5 | cluster "escritório"/"de verdade" 2-3× no card → textos dos 2 pontos enxutos |
| V10 | ✅ | N8 | D3 | "7 dias pra **desistir**" → "pra **mudar de ideia** e receber tudo de volta" (mantido "sem honorário", que é preciso vs N7) |
| V11 | ⏸️ | N8 | D1 | resumo de custo reafirma o N7 → **aceito** (função de contrato) |

---

## 📋 Inventário por tela (a prova — compacto)

> A base que sustenta os achados acima. Só texto visível ao usuário. Pra o texto integral + linha, abre o código pelo Índice.

**N1 splash** — sem copy (só logo negativa).
**N2 welcome** — 3 slides: "Contador de verdade. Não robô." / "A parte chata é com a gente." / "Sem contabilês. Sem susto no boleto." · selo "22 anos de escritório por trás do app." · CTA "Começar"/"Próximo"/"Pular".
**N3 entrada** — "Como a gente pode te ajudar? A parte chata fica com a gente." · selo "22 anos..." (idêntico N2) · cards "Quero abrir minha empresa" / "Já tenho empresa" · link "Já é cliente? Entrar".
**N4 gate** — "O que você faz?" + 17 pills · triagem "Duas perguntas rápidas" (sócios / exterior) + bloqueios · faixa "Quanto você vai receber por mês?".
**N5 teaser** — 3 modos: swap ("Você economiza por mês" + "Não é malandragem"), fator-r ("R$ 0 a X" + "começa em zero"), serviço ("já entra na tabela mais barata"). Carimbo de estimativa.
**Veredito (VA/VW/VC)** — selo + card reconhecimento + recibo "Sua atividade na Receita / CNAE" · 🟢 expander "E se eu faço mais de uma coisa?" · 🟡/🔴 captura + "Você não vai repetir nada".
**N6 conta** — "Vamos criar seu acesso" · Google/Apple/e-mail · "É a primeira empresa que você abre?" · microcopy "Ainda não estamos cobrando nada."
**N7 plano** — "Quanto custa abrir": card Grátis · card R$195/mês · card taxa R$268,51 "vai direto pro Estado" · rodapé "Você paga hoje R$463,51".
**N8 contrato** — "Está tudo combinado" · 4 bullets ("taxas do governo à parte", "permanência mínima", "7 dias pra desistir") · card "escritório de verdade" (22 anos + contador + "nada acontece sem você") · aceite.
**N9 pagamento** — "Falta só isso" (R$463,51 hoje) · CPF (cobrança+elegibilidade) · método (cartão/pix/boleto) · idempotência "nunca cobra duas vezes".
**N10 socio** — "Seus dados" · CPF/RG/civil/regime (cônjuge comunhão universal) · endereço · "mora fora do Brasil?" + bloqueio exterior.
**N11 vínculo** — "Você já contribui pro INSS por fora?" · aviso teto/folga · aviso "Como você se paga (pró-labore)" · privacidade.
**N12 sócios** — "Vai ter mais sócios?" · aviso "até 2 sócios, limite do produto" · 2º sócio + divisão 100%.
**N13 empresa** — "Onde a empresa fica?" · upsell endereço fiscal R$60/mês ("deixa de ser problema") · IPTU opcional · capital social + warning.
**N14 cnae-secundários** — "Sua empresa faz mais alguma coisa?" · principal travado · 4 sugestões "mesmo imposto".
**N15 natureza** — "O tipo da sua empresa" · SLU × LTDA · card "Não precisa decorar sigla".
**N16 nome** — "O nome da empresa" · razão social (disponível/em uso) · variações · aviso "confere antes... evitar reprovado".
**N17 cnae-ótimo** — "Achamos um jeito de pagar menos" · a troca (atual × ótimo) · "Não é malandragem" · "dois caminhos" (pré-explica N18) · warning "antes de trocar" · PDF.
**N18 simulador** — "Quanto você se paga?" · número + slider + sugestão · aviso borda · custo por sócio · expander "Ver a conta".
**N19 revisar** 🆕 — "Está tudo certo?" · blocos Você/Empresa/Atividades/Enquadramento + "Ajustar" · card taxa R$268,51 · carimbo estimativa.
**N20 termo** 🆕 — "Pode começar a abrir?" · 3 itens · Aviso "não dá pra desfazer" · 4 camadas cancelamento · checkbox.
**N21 painel / REC** 🆕 — "Estamos abrindo sua empresa" · previsão ~8d · timeline 9 etapas · idempotência · REC "O nome não passou na Junta" + ação.
**N22 assinatura** 🆕 — "Hora de assinar" · nível GOV.BR (bronze→upgrade) · quem assina (consenso 2 sócios) · procuração e-CAC.
**N24 ativa** 🆕 — "Sua empresa existe" · CNPJ · 3 primeiros passos (nota/DAS/certificado) · "A gente não some depois de abrir" · WhatsApp.
**P1 retomar** — "Bem-vindo de volta" · lista de passos · idempotência "não cobra de novo".
**P2 aguardando** — "Seu boleto está a caminho" · lista de passos (travados) · boleto R$463,51/Pix · idempotência.
**Saídas (exterior/sócios)** — selo humano · explica + origem (LC 123 art.17 / limite do produto) · captura "não repete nada".
**Login** — "Bem-vindo de volta." · e-mail/senha · Google/Apple · "Criar conta".

---

## 🔗 Links
[[metodo-varredura-flow]] (a rubrica) · [[mapa-flow-mermaid]] · [[flow-data]] · [[compilado-ux-flow]] · [[legalize-telas-padrao-layout]] · [[spec-telas-b3-b4-aterrissagem]] · [[spec-telas-entrada-b1-b2]] · [[HOME]]
