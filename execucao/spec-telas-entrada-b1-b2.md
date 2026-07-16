---
tipo: derivado
status: vivo
data: 2026-07-14
assunto: conteudo-das-telas
deriva_de: [reordenacao-flow-cobranca-cedo, compilado-ux-flow]
tags: [produto, ux, telas, spec, onboarding, entrada, b1, b2]
---

# 🎛️ Spec de telas — Entrada + B1 + B2 (campo a campo)

> Especificação funcional das telas do fluxo de abertura, nível campo/input/validação/microdetalhe. Não cobre B3 (cobrança) ainda. Casa com [[blocos-fluxo-abertura]] (lógica dos blocos) + [[mapa-telas-mobile]] (inventário) + [[casos-teste-fluxo-cnae]] (personas de teste). Valores fiscais concretos ficam 🟡 *confirmar* (anti-guru): a spec trava a **mecânica**, não o número.
>
> 🔧 **Rodada de UX #1 aplicada 2026-07-15:** as sugestões da 1ª bateria de personas (11 relatórios) foram incorporadas tela a tela — CNAE humano, tela nova do CNAE ótimo, simulador em R$ sem jargão, bloqueios que educam (exterior/CLT-própria/3 sócios/waitlist), acessibilidade Cida. Log de status: [[compilado-ux-flow]].
> 🔧 **Rodada de UX #2 aplicada 2026-07-15 (2ª ordem):** 13 itens que o flow já robusto revelou — fail-fast dos bloqueios, waitlist com "enquanto isso", acoplar CLT→simulador, custo por sócio, carimbo de estimativa + prova exportável no CNAE ótimo, bloqueio que vira ganho, anuência do cônjuge, gov.br cedo. Os que dependem de surface sem spec (portal/dia-2, co-founder no B4, modo assistido, e-CAC) ficam 🟡 nas Notas transversais. IDs UX-19→31 em [[compilado-ux-flow]].
> 🔧 **Rodada de UX #3 aplicada 2026-07-15 (3ª ordem):** os 4 🟡 da cauda foram aterrados na spec nova [[spec-telas-b3-b4-aterrissagem]] (UX-36). Aqui na spec B1/B2 entraram: **mapa da jornada + custo** (UX-32), **dossiê exportável** (UX-34, T15), **bloqueio/waitlist → handoff humano com dossiê meio-pronto** (UX-35, T4/T6/T7/T8), **idempotência visível** (UX-38), **margem de segurança na borda do Fator R** (UX-39, T14). IDs UX-32→39 em [[compilado-ux-flow]].
> 🎛️ **Decisão de trilha 2026-07-16 (UX-48):** trilha **ÚNICA**, sem bifurcação por perfil. Os "universais" (botão grande, zero jargão, recap, acessibilidade) viram **default pra todos**; a profundidade (memória de cálculo, base legal) vira **expander pra todos**; o **ritmo/layout** — único tradeoff real — **não se constrói até haver dado**. T5 captura a coorte *"É a primeira empresa que você abre?"* como **dado puro** (zero mudança de comportamento) → [[spec-instrumentacao-flow]]. Ver Notas transversais.
> 🔧 **Rodada de UX #4 aplicada 2026-07-15 (4ª ordem — recuperação/decisão):** **memória de cálculo + "e se?"** (UX-47, T14) e **reorientação ao reabrir** (UX-46, transversais). A cauda ganhou failure-state, consenso multi-sócio, re-engajamento e loop estimativa→realidade em [[spec-telas-b3-b4-aterrissagem]] (UX-40/41/44/45). **UX-43** (over-block da CLT-própria) virou correção no **motor** (não é spec). IDs UX-40→47 em [[compilado-ux-flow]].

## Legenda das colunas
- **Campo/Elemento** = o que aparece na tela
- **Entrada** = como o usuário preenche
- **Validação & margem de erro** = o que aceita/rejeita/tolera
- **IA / sugestão / microdetalhe** = comportamento esperto, default, micro-interação

---

## 🚪 ENTRADA

### Tela 1 — Splash
| Campo/Elemento | Entrada | Validação & margem de erro | IA / sugestão / microdetalhe |
|---|---|---|---|
| Logo negativa sobre coral | passiva | Se JS/asset falhar → timeout força avanço | Handoff slide-up após ~1,2s; sem botão |
| Pré-load de assets | — | Lottie não carrega → segue sem animação | Aquece Sora + JSONs antes do welcome |

### Tela 2 — Welcome (3 telas)
| Campo/Elemento | Entrada | Validação & margem de erro | IA / sugestão / microdetalhe |
|---|---|---|---|
| 3 slides (Lottie coral) | swipe / "próximo" | — | Dots de progresso; "pular" sempre visível |
| CTA "começar" | tap | — | Só no 3º slide; leva ao fork |
| Estado "já vi" | — | — | Flag local: reabrir não repete welcome |

### Tela 3 — Entrada (fork)
| Campo/Elemento | Entrada | Validação & margem de erro | IA / sugestão / microdetalhe |
|---|---|---|---|
| "Quero abrir meu CNPJ" | tap | — | Rota principal → Gate-CNAE (B1) |
| "Já tenho CNPJ / sou cliente" | tap | — | Rota → login (fora do fluxo de abertura) |
| Logo estático | — | — | Sem animação (decisão rápida) |

---

## 🧭 B1 — Gate-CNAE + Login

### Tela 4 — Gate-CNAE (coração do B1)
| Campo/Elemento | Entrada | Validação & margem de erro | IA / sugestão / microdetalhe |
|---|---|---|---|
| Descrição da atividade | textarea livre | Vazio ou < ~10 car. → bloqueia + "conta um pouco mais do que você faz" | Placeholder typewriter (15 atividades populares, ink-400); aceita gíria |
| Atalho "já sei meu CNAE" | input código | Máscara `0000-0/00`; formato inválido rejeita; código inexistente → "descreve pra mim" | Pula entrevista, vai direto ao filtro |
| Botão "validar" | tap | Desabilitado enquanto inválido | Vira loading Lottie (arquivos+lupa) |
| Card de resultado | leitura | — | CNAE em **linguagem humana antes do código** (leigo não decora número); o código `0000-0/00` aparece como detalhe secundário. Confiança + veredito 🟢/🟡/🔴 |
| Desambiguação (se ambíguo) | chips/botões | Nunca dá veredito com baixa confiança (regra de ouro) | Pergunta **humana, não fiscal** (antídoto do falso 🔴), com exemplos reais: *"representa/intermedeia ou tem estoque próprio?"* · *"é nutricionista registrada / prescreve dieta?"* Vem do Mapa de Confusão |
| Limite de perguntas | — | Após 1–2 ainda incerto → fallback humano (fila "incerto"), nunca 🔴 automático | "Vou te conectar com um humano pra confirmar" |
| CTA 🟢 "É isso mesmo" | tap | — | Círculo coral + check → confete → login; colado no rodapé. **Microcopy 1 linha do que vem agora** ("vamos criar sua conta") — senão o leigo hesita |
| "Refazer / não é isso" | tap | — | Acima do CTA; volta sem perder texto |
| Captura 🟡 (waitlist) | nome + contato | Contato válido; consentimento LGPD | Deixar explícito que **não é "não"** — é "ainda não pra sua atividade, avisamos quando abrir". Captura o contato, não fecha a porta. **UX-22 — waitlist não pode ser beco:** dar o **"enquanto isso"** (previsão de quando abre pra aquela família + **rota pro escritório do Mauro**, que atende manual hoje) e **separar dois 🟡 diferentes** — *"fora do nosso escopo por ora"* (ex: representação/comércio) × *"dá pra abrir, mas você precisa de responsável técnico"* (ex: nutri registrada). Sem isso a pessoa espera eternamente por um caminho que ou nunca vem ou já existe |
| Triagem precoce de elegibilidade (novo) | — | — | **UX-21 — fail-fast:** o que **mata a elegibilidade** (sócio no exterior · mais de 2 sócios) tem que ser perguntado **aqui no B1 / na entrada do B2**, não no fim do 1º sócio. Duas perguntas rápidas ("vai ter sócios? quantos?" · "algum sócio mora fora do Brasil?") antes de investir o dossiê. Barrar tarde frustra tanto quanto barrar cego |
| Captura 🔴 (comercial Mauro) | nome + contato + atividade | Contato válido | "Seu caso é melhor com nosso time contábil" — roteia |
| **Handoff humano com dossiê (UX-35)** | — | vale p/ 🟡 waitlist, 🔴 comercial e bloqueios fatais (exterior/3-sócios/CLT-própria) | Toda saída "não encaixa" **não pode ser só um e-mail capturado**: entregar pro humano (Mauro/manual) **o que já foi preenchido** — atividade, CNAE tentado, motivo do desencaixe. O cliente vira **lead quente com contexto**, não recomeça do zero no atendimento. Fecha o loop do cohort que hoje é bem despedido mas frio |

### Tela 5 — Login / criar conta
| Campo/Elemento | Entrada | Validação & margem de erro | IA / sugestão / microdetalhe |
|---|---|---|---|
| Só aparece após 🟢 | — | Bloqueia acesso direto sem veredito 🟢 | Conta vem depois do "sim" |
| E-mail | input | Formato válido; duplicado → "já tem conta? entrar" | Autofill amigável |
| Social login | tap (Google/Apple) | Falha OAuth → fallback e-mail | — |
| Senha (se e-mail) | input | Força mínima 🟡; mostra/oculta | 🟡 política a travar |
| Estado do veredito | — | — | Carrega CNAE 🟢 do B1 pro dossiê (não repergunta) |
| Nível da conta GOV.BR (novo) | detecção passiva | — | **UX-29 — detectar cedo:** a assinatura do contrato no B4 exige conta GOV.BR **prata/ouro**; o leigo total costuma ter **bronze** ou nem ter conta. Sinalizar já aqui e **guiar o upgrade** (biometria/banco credenciado) enquanto ele preenche o B2 — senão monta o dossiê inteiro e só descobre que não consegue assinar no fim |
| **Coorte de experiência (UX-48)** | 2 botões: *"É a primeira empresa que você abre?"* → **Sim** / **Não, já abri antes** | Opcional — pular **não bloqueia** nem atrasa | **É captura de DADO, não bifurcação.** Decisão 2026-07-16: **ninguém muda de trilha** — as duas coortes veem exatamente as mesmas telas, na mesma ordem, com a mesma lógica. Quem já abriu empresa **também** descreve a atividade no T4, igual a quem abre do zero. A tag só alimenta a análise de performance por coorte (→ [[spec-instrumentacao-flow]]) pra decidir **com dado, depois**, se a bifurcação de ritmo vale. **Nunca rotular a pessoa** ("modo leigo" é proibido em copy). ❌ **Descartado o pré-mark por comportamento:** usar o atalho "já sei meu CNAE" **não** qualifica experiência — pesquisar 1 código ≠ saber abrir empresa |

---

## 📋 B2 — Coleta + Enquadramento

### Tela 6 — 2.1 Dados do sócio
| Campo/Elemento | Entrada | Validação & margem de erro | IA / sugestão / microdetalhe |
|---|---|---|---|
| Nome completo | input | Não vazio; 2+ palavras | — |
| CPF | input máscara | **Dígito verificador + consulta situação cadastral (existe/regular na Receita)** → inválido/irregular = erro inline. 🟡 provider (Serpro/InfoSimples/CNPJá) | Autoavança ao completar; não deixa CPF errado seguir pro dossiê |
| RG + órgão emissor | input | Não vazio | — |
| Estado civil | dropdown | — | Se "casado" → revela regime de bens (campo condicional) |
| Regime de bens | dropdown (condicional) | Obrigatório só se casado | Comunhão universal → flag p/ atos que pedem anuência do cônjuge. **UX-30 — avisar cedo:** se o regime dispara assinatura do cônjuge lá no registro, **dizer isso aqui**, não no cartório. Microcopy "seu cônjuge vai precisar assinar um documento nesta etapa — bom já alinhar" pra ele não travar no fim sem o cônjuge por perto |
| Endereço do sócio | input + CEP | CEP válido (busca auto); nº obrigatório | Autocompleta rua/bairro pelo CEP |
| Contato | input | Formato válido | Herdado do login quando possível |
| Reside no exterior? | toggle por sócio | Sim em **qualquer** sócio → **bloqueio que educa**: a empresa até pode existir, mas fica **fora do Simples** (LC 123 art.17, II) → rota humana, nunca crash | Perguntar **cedo** (idealmente sinalizar já no B1) pra não frustrar o cliente no fim do dossiê. **UX-21 — executado:** a triagem precoce do B1 (Tela 4) já faz a pergunta "algum sócio mora fora?" **antes** do dossiê; este toggle vira **confirmação**, não a 1ª vez que o cliente descobre o bloqueio |

### Tela 7 — 2.2 Duplo vínculo CLT
| Campo/Elemento | Entrada | Validação & margem de erro | IA / sugestão / microdetalhe |
|---|---|---|---|
| "Já contribui pro INSS por fora?" | toggle | — | Pergunta cobre **CLT, aposentado, autônomo ou sócio de outro CNPJ** — não só "emprego registrado" (aposentada não é CLT e precisa cair aqui). "Não" → pula resto da tela |
| Valor da remuneração CLT | input R$ (se sim) | Obrigatório se sim; rejeita 0/negativo | Alimenta cálculo do teto INSS |
| Aviso de teto INSS | leitura | — | **Cálculo de FOLGA, não binário:** INSS do pró-labore incide sobre `teto − salário CLT`. Só ZERA se o CLT já ≥ **teto R$8.475,55** (2026). Ex: CLT R$8k → ainda recolhe 11% sobre a folga de R$475,55. **Deixar claro que é só sobre a folga** (não zero, não cheio) — evita o cliente pedir aumento de pró-labore por engano. Fonte: [[fiscal-simples-bh-2026]] #6 |
| Bloqueio: CLT da própria empresa | — | Se o sócio tenta se registrar como **CLT da própria** → barra + **ensina** | Sócio se remunera por **pró-labore**, não CLT da própria (duplo vínculo impossível). Explica a diferença, sem culpar. **UX-27 — bloqueio vira ganho:** o medo real é "perder direitos trabalhistas". Não parar em "não pode" — mostrar o que o pró-labore **garante**: recolhe INSS que **conta pra aposentadoria** (RGPS), dá direito a benefícios previdenciários e pode contribuir acima do mínimo. Reenquadrar como ganho, não só corrigir o conceito. Fonte: [[2026-07-13-conversa-karla]] |
| Privacidade | — | Sistema não puxa vínculo de terceiro (LGPD) — cliente declara | Microcopy de confiança |

### Tela 8 — 2.3 +Sócios
| Campo/Elemento | Entrada | Validação & margem de erro | IA / sugestão / microdetalhe |
|---|---|---|---|
| "Tem outros sócios?" | toggle | — | "Não" → solo (afeta natureza em 2.6) |
| **Limite de sócios** | — | **Máx 2 no total** (decisão 15/07). Passou → bloqueia "+adicionar" | **Bloqueio que oferece saída:** "acima de 2 sócios = atendimento humano". Explicar que é **limite do produto, não da lei** — não é um "não" seco. ✅ travado em 2 (era 3, corrigido). **UX-21 — fail-fast:** o **"quantos sócios?"** já foi perguntado na triagem precoce do B1 (Tela 4); quem tem 3+ é roteado pro humano **antes** de preencher o 1º sócio. Aqui o limite vira só a trava de segurança, não a 1ª notícia ruim |
| Bloco 2.1 por sócio | form repetível | Mesmas validações do 2.1 (CPF etc.) | "+ adicionar sócio" |
| % de participação | input % | Soma obrigatória = 100% (rejeita ≠100) | Divisão igual como default editável |

### Tela 9 — 2.4 Dados da empresa
| Campo/Elemento | Entrada | Validação & margem de erro | IA / sugestão / microdetalhe |
|---|---|---|---|
| Endereço da empresa | input + CEP | CEP válido; nº obrigatório | Guarda índice cadastral IPTU (p/ registro BH) |
| Índice cadastral IPTU | input | Formato a validar; 🟡 opcional se não tem | Explica onde achar (carnê IPTU) |
| **Upsell: endereço fiscal Legalizei** | oferta (toggle "usar endereço próprio" × "quero um endereço") | **Não bloqueia** — só oferece; seguir em frente independe da escolha | Se "não tenho / não quero usar o meu" → oferece add-on (~R$60/mês 🟡). **Salva flag no dossiê** + **injeta automático no plano do B3**. Resolve gargalo "sem endereço comercial" |
| Capital social | input R$ | > 0; valor real | IA sugere faixa coerente; alerta se muito baixo/alto |
| Tipo de endereço | dropdown (próprio/coworking/virtual/fiscal-Legalizei) | — | Afeta viabilidade em BH (flag p/ blocos futuros) |

### Tela 10 — 2.5 CNAE secundários
| Campo/Elemento | Entrada | Validação & margem de erro | IA / sugestão / microdetalhe |
|---|---|---|---|
| CNAE principal | herdado do B1 | Travado | Mostrado no topo, não editável aqui |
| Secundários sugeridos | lista com toggle | Secundário que quebra o recorte (regulada/comércio) → pill de aviso, não some silencioso | IA sugere sozinha; pill de prova social ("comum como secundário nessa atividade") |
| Adicionar manual | busca CNAE | Valida contra whitelist; fora do recorte → aviso 🟡 | Cliente aceita/remove livre |

### Tela 11 — 2.6 Natureza jurídica
| Campo/Elemento | Entrada | Validação & margem de erro | IA / sugestão / microdetalhe |
|---|---|---|---|
| Recomendação da IA | card default | — | Solo → SLU · 2+ sócios → LTDA (não dropdown seco) |
| Confirmar / mudar | tap | — | Explica a diferença em 1 linha |
| Coerência com 2.3 | — | SLU + tem sócios → bloqueia + corrige | Guard-rail contra escolha impossível |

### Tela 12 — 2.7 Razão social + nome fantasia
| Campo/Elemento | Entrada | Validação & margem de erro | IA / sugestão / microdetalhe |
|---|---|---|---|
| Razão social | input | Regras de composição | IA sugere a partir do nome + atividade |
| Nome fantasia | input | Opcional | — |
| Checagem de viabilidade | ação automática | Nome em uso → sugere variações | Consulta prévia (evita reprova JUCEMG) — 🟡 API |

### Tela 13 — 2.8 CNAE fiscalmente ótimo (feature-âncora)
> Aparece **só quando existe família de swap** pra atividade (senão pula direto ao simulador). Recomenda o CNAE de **menor carga entre os que cobrem a mesma atividade real**. **Nunca troca em silêncio.** Base: [[cnae-fiscalmente-otimo]].

| Campo/Elemento | Entrada | Validação & margem de erro | IA / sugestão / microdetalhe |
|---|---|---|---|
| Card "achamos um jeito de pagar menos" | leitura | só renderiza se há família | CNAE atual × ótimo lado a lado, em linguagem humana |
| **Por que é válido** | leitura | **obrigatório exibir** | Explica que **os dois emitem a mesma NF** pra atividade dela — não é malandragem. Sem isso, o leigo acha fraude e recusa |
| Economia em R$ | leitura | — | "esse código faz você pagar ~R$Y a menos por mês" — **sempre em R$**, nunca "Anexo III/V" cru |
| As 2 alavancas | leitura | — | Deixa explícito: **trocar de CNAE (aqui)** OU **subir pró-labore (Fator R, próxima tela)**. Quem é **solo/baixa folha ganha aqui** sem precisar de pró-labore alto |
| Botão "adotar o ótimo" | tap | opt-in explícito | Cliente escolhe; grava **trilha de auditoria** (aceitou + o porquê) |
| "manter o atual" | tap | — | Respeita a escolha, sem punir |
| Guard-rail de honestidade | — | bloqueia swap se a atividade real não cobre o código | Só oferece **dentro do que a NF real permite** (senão é passivo). Cada família é **assinada pela Larissa** |
| **Carimbo de estimativa (UX-26)** | leitura | **obrigatório** enquanto claim 🟡 | O cliente **encanta** com a economia e pode tratar como certeza. Carimbar **"estimativa — confirmamos com o contador antes de registrar"** (sobretudo em famílias 🟡 tipo 8599, pendente Larissa). Encantar sem prometer o número como fechado |
| **Tradeoff honesto (UX-26)** | leitura | — | Não vender só "mais barato". Sinalizar o custo do outro lado quando existir: algum **cliente/edital exige um CNAE específico?** algum secundário some? O ótimo fiscal nem sempre é o ótimo comercial — deixar a escolha informada |
| **Prova exportável (UX-26)** | botão "baixar o porquê" | — | Gerar um **PDF/print** com o comparativo (atual × ótimo, mesma NF, base legal) que ela mostra pro **contador antigo ou pro cliente**. Materializa a confiança fora do app — vira defesa, não "confia em mim". Reaproveita a trilha de auditoria |

### Tela 14 — 2.9 Simulador Fator R + pró-labore (clímax)
> ⚠️ **Saída é PROJEÇÃO, não anexo travado.** Empresa nova não tem 12 meses de folha; o Fator R real só se firma operando. Rotular tudo como **"estimativa"** e explicar a anualização do 1º ano em 1 linha. **A palavra "Fator R" não aparece pro leigo** — traduzir pra "quanto você se paga" e "quanto economiza", sempre em R$. Base: [[fiscal-simples-bh-2026]] #3 (bloco CONSOLIDADO).

| Campo/Elemento | Entrada | Validação & margem de erro | IA / sugestão / microdetalhe |
|---|---|---|---|
| Faturamento estimado | faixa guiada (botões/slider) | Nunca campo aberto; slider fino opcional | IA já chega com faixa marcada (CNAE + solo/sócios) |
| Pró-labore | slider/opções | Mínimo = **1 salário mín (R$1.621, 2026)**; rejeita abaixo | 3 cenários lado a lado (A · B · **Ótimo**) |
| Resultado Fator R | leitura (est.) | Motor: folha ≥ **28%** do faturamento → Anexo III (**6%**), senão Anexo V (**15,5%**) | Ponto médio da faixa + **sensibilidade na borda** ("um real a menos de pró-labore te joga pro Anexo V") |
| **Margem de segurança (UX-39)** | leitura + default | quando o ótimo cai colado nos 28% | Não deixar o cliente **cravar 28%**. Um mês de folha menor/atrasada joga pro Anexo V no **ano inteiro**. Sugerir mirar **~30%** como colchão e sinalizar visualmente "você está encostado na borda". O que economiza R$ colado no limite pode custar caro num mês ruim |
| **Pró-labore ÓTIMO (NOVO)** | recomendação da IA | calcula o pró-labore que cruza 28% **e** fica ≤ **R$5.000** (isenção de IRRF) | O diferencial: mostra "pague-se R$X → cai no Anexo III **sem pagar IRRF** → economia ~R$Y/mês". Base #3+#9. **UX-24 — acoplar as telas:** o ótimo tem que **consumir o dado do CLT (Tela 7)**. Sócio com CLT ≥ teto **zera** o INSS do pró-labore; sócio com CLT parcial recolhe só sobre a folga. Recalcular o ótimo do zero, ignorando o CLT já declarado, dá número errado — as duas telas **não podem ser ilhas** |
| **Custo por sócio (UX-25)** | leitura | só quando >1 sócio | Com 2 sócios de situação diferente (um tem CLT, outro não), mostrar o custo do pró-labore **por sócio**, não um número agregado. O medo real da sociedade é "não saber o custo de **cada um**". Um card por sócio |
| Transparência de custo | leitura | — | Custo da folha = **INSS 11% do pró-labore** (máx R$932,31/mês) **+ IRRF**. **⚠️ IRRF = ZERO até ~R$5.000/mês de pró-labore** (Lei 15.270/2025) — não inflar o custo com imposto que não existe. Base #2 |
| **Estimativa perecível (UX-23)** | leitura + gatilho de re-entrada | revalida ao retomar após pausa longa | A simulação é uma **foto do dia**. Se o cliente pausa e volta semanas depois (ou vira o ano), os parâmetros mudam (**teto INSS, salário mínimo, faixa de IRRF**). Ao retomar, **recalcular e avisar se algo mudou** — nunca reexibir o número velho como se fosse de hoje. Ver nota transversal de re-entrada |
| **Memória de cálculo + "e se?" (UX-47)** | expandível + slider | opcional (default fechado) | Pro cliente avançado (knife/monstro) que desconfia de caixa-preta: um **"ver a conta"** que abre a memória de cálculo do Fator R (folha ÷ faturamento, alíquota, custo do pró-labore) — não só o resultado. E um modo **"e se?"** pra simular cenários (subo o pró-labore? mudo a faixa?) **sem sair do fluxo**. O leigo mantém a versão simples; o avançado brinca com os números antes de cravar |
| Alerta regime de caixa | leitura (🟡) | — | "Pró-labore atrasado sai do cálculo do mês → pode cair pro Anexo V." Folha conta por **caixa**. 🟡 verificar COSIT 17/2021 antes de exibir. Base #C |
| Caso anexos diferentes | flag | "Pela maior × pela nota" → motor não crava, marca 🟡 | Raro no MVP só-serviço; pendência Larissa. Não chuta número |

### Tela 15 — 2.10 Revisão do dossiê
| Campo/Elemento | Entrada | Validação & margem de erro | IA / sugestão / microdetalhe |
|---|---|---|---|
| Resumo de tudo | leitura | Campos faltando → destaca e leva de volta ao passo | Cards por seção |
| Editar por seção | tap | — | Deep-link pro passo, volta pra revisão |
| Salvar & retomar | ação | Estado persistido (sobrevive dias) | Retoma idempotente. **Idempotência visível (UX-38):** ao retomar, dizer "seu progresso está salvo, nada foi cobrado nem aberto em duplicidade" — o motor já garante; a UI passa a comunicar |
| **Dossiê exportável (UX-34)** | botão "baixar meu enquadramento" | — | Generaliza a prova do CNAE ótimo (UX-26) pra **todo o enquadramento**: PDF com CNAE + natureza + anexo estimado + **por que** cada escolha (Fator R, pró-labore, secundários). Vira defesa pra quem **sai de outro contador** e quer mostrar que a Legalizei fez certo. Reaproveita a trilha de auditoria do B2 |
| "Está tudo certo" | tap | Só habilita com dossiê completo | Handoff pro B3; economia do Fator R vira gancho |

---

## Notas transversais (todo o wizard)
- **🎛️ Densidade: universal por padrão, profundidade sob demanda (UX-48 — decisão 2026-07-16).** O flow é **trilha ÚNICA**: não bifurca por perfil, não tem "modo leigo" × "modo avançado". Duas regras substituem a bifurcação:
  1. **Universal pra todos** (não é modo, é design bom): botão grande com **rótulo literal** · **zero jargão fiscal** ("quanto você se paga", não "Fator R") · **recap ao reabrir** (UX-46) · fonte ampliável · validação que não pune tentativa · acessibilidade (UX-12). **Nenhum usuário experiente é prejudicado por nada disso** — por isso não vira modo, vira default.
  2. **Profundidade sob demanda, pra todos:** o que é detalhe fica **expansível com default fechado** — memória de cálculo + "e se?" (UX-47, T14) · o porquê/base legal + prova exportável (UX-26, T13) · dossiê exportável (UX-34, T15) · detalhe por etapa (T20). Quem quer, abre; quem não quer, nem vê. **Auto-seleção por comportamento — sem flag, sem chute, sem risco de marcar errado.**
  - **O que ficou de fora DE PROPÓSITO:** **ritmo/layout** (1 bloco por vez × campos agrupados · 1 recomendação × 3 cenários lado a lado · cards seção a seção × tabela única · tutorial guiado × checklist seco) é o **único tradeoff genuíno** — expander não resolve, é estrutural. **Não se constrói até haver dado real.** A coorte capturada no T5 mede exatamente isso → [[spec-instrumentacao-flow]]. Anti-guru aplicado a produto: não se bifurca UX em cima de hipótese.
- **Mapa da jornada (UX-32):** barra de progresso não é só uma linha — mostra **onde estou / quanto falta / quanto já custou** no arco inteiro entrada→B4→ativa (~30 passos). O leigo (reta/cida) não trava sem mapa; o experiente (knife/monstro) quer saber o estrago antes. **⚠️ 16/07: só até o N9.** UX-32 **aposentado na cauda** ([[design-system]] §0): a barra vale no **wizard (N1–N9)**, onde o usuário é o gargalo. Do N10 em diante quem informa é a timeline do N21.
- **Idempotência visível (UX-38):** o motor já retoma idempotente em qualquer pausa; a UI passa a **comunicar** isso a cada retomada — "seu progresso está salvo, nada foi cobrado nem aberto em duplicidade". Mata o medo de quem pausou depois de pagar (reta/cida/monstro).
- **Salvar & retomar** em qualquer ponto do B2 (revalidando dados perecíveis, UX-23).
- **Reorientação ao reabrir (UX-46):** retomar não é só restaurar a tela. Pro leigo (Cida), ao reabrir dar um **recap simples/falado** — "você parou aqui, já fez isto, falta isto" — em letra grande, e apresentar **um próximo passo por vez**, não a lista inteira de campos. Excesso de opções ao reabrir paralisa quem esquece onde estava mais do que a falta delas.
- **Altura sem scroll** onde couber (`100dvh` + `min-h-0`).
- **Sem travessão** em nenhuma copy.
- Erros **inline**, nunca modal genérico; microcopy que ensina, não culpa.
- **Acessibilidade (persona Cida — leiga, idosa, medo de errar):** botões **grandes com rótulo literal** ("abrir meu CNPJ"), não só ícone; opção de **ditado por voz** na descrição da atividade; **fonte ampliável** e validação que não pune tentativa em CPF/CEP; **botão único grande** em confirmações críticas (veredito, aceite); **zero jargão fiscal** — "quanto você se paga" / "quanto economiza", letra grande.
- **Pausas de órgão externo (vale sobretudo no B4):** aviso **proativo (WhatsApp)** + "estamos abrindo, leva ~X dias" + **estado visível a cada pausa** — o cliente nunca acha que travou ou perdeu o dinheiro.
- **Termo/aceite irreversível (vive no B3):** explicar em 1 linha que **taxas de governo não voltam**, sem letra miúda; botão único + explicação curta do que é o termo.
- **🟡 Dia-2 / "e agora?" (UX-19 — vive no PORTAL, sem spec ainda):** o flow **não pode acabar no troféu** "empresa ativa". A ativação é uma **ponte**, não a linha de chegada: o cliente precisa saber **quando emite a 1ª nota, quando vence o 1º DAS, onde está o certificado**. Prever handoff ativo pro portal + (leigo/Cida) **tutorial guiado da 1ª nota**. Diretriz gravada; tela concreta = spec do portal.
- **🟡 Co-founder / 2º sócio assina (UX-20 — vive no B4, sem spec ainda):** o fluxo é **single-user**, mas o 2º sócio **confirma dados e assina o contrato no GOV.BR** no registro. Prever **convite pro 2º sócio** (link próprio pra ele confirmar/assinar) e **estado visível pros dois** — senão trava no registro esperando quem nunca abriu o app. Diretriz gravada; tela concreta = B4.
- **🟡 Modo assistido / ajuda de confiança (UX-28 — arquitetura de conta):** o comportamento real da persona leiga (Cida) é **passar o app pra filha terminar**. Prever handoff "**ajuda de alguém de confiança**": um parente continua de onde parou, **sem recomeçar e sem a titular perder o controle da conta**. Diretriz gravada; depende de decisão de arquitetura de conta.
- **🟡 Procuração e-CAC explicada (UX-31 — vive no B4.5):** o ato é opaco pro leigo ("estou dando poderes pra quem?"). Uma linha antes do aceite: **"é o que deixa o Legalizei pagar seu DAS por você — com limite e revogável quando quiser"**. Diretriz gravada; tela concreta = B4.5.
- **Re-entrada revalida (UX-23):** ao **salvar & retomar** após pausa longa, além de restaurar o estado, **revalidar dados perecíveis** (simulação fiscal, disponibilidade de nome, situação de CPF) e sinalizar o que mudou. Retomar não é só "voltar onde estava" — é "voltar com os números de hoje".

## 🟡 Pendências desta spec
- ~~Limite de sócios: 3 ou 2?~~ ✅ **travado em 2** (15/07).
- ~~Valores fiscais vigentes (salário mín, teto INSS)~~ ✅ **resolvido** em [[fiscal-simples-bh-2026]] CONSOLIDADO: mín R$1.621 · teto INSS R$8.475,55 · INSS máx R$932,31/mês · IRRF isento ~R$5k (reconferir jan/27).
- Preço do endereço fiscal Legalizei (~R$60 benchmark, definir o nosso)
- Provider da validação de CPF/situação cadastral (mesmo pool do cartão CNPJ)
- Política de senha do login
- **Fila-Larissa (impacta o simulador 2.8):** (A) mecânica Fator R meses 2–12 · (B) **CPP-no-DAS entra no numerador?** (muda o pró-labore ótimo) · (C) FS12 regime de caixa (COSIT 17/2021). Ver tabela em [[perguntas-larissa-fiscal]].

## Links
- [[blocos-fluxo-abertura]] · [[mapa-telas-mobile]] · [[casos-teste-fluxo-cnae]] · [[2026-07-13-conversa-karla]] · [[compilado-ux-flow]] · [[cnae-fiscalmente-otimo]] · [[HOME]]
