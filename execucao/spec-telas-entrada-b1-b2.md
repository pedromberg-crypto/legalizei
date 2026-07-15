---
tipo: spec
data: 2026-07-14
status: em-construcao
tags: [produto, ux, telas, spec, onboarding, entrada, b1, b2]
---

# 🎛️ Spec de telas — Entrada + B1 + B2 (campo a campo)

> Especificação funcional das telas do fluxo de abertura, nível campo/input/validação/microdetalhe. Não cobre B3 (cobrança) ainda. Casa com [[blocos-fluxo-abertura]] (lógica dos blocos) + [[mapa-telas-mobile]] (inventário) + [[casos-teste-fluxo-cnae]] (personas de teste). Valores fiscais concretos ficam 🟡 *confirmar* (anti-guru): a spec trava a **mecânica**, não o número.

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
| Card de resultado | leitura | — | CNAE + confiança + veredito 🟢/🟡/🔴 |
| Desambiguação (se ambíguo) | chips/botões | Nunca dá veredito com baixa confiança (regra de ouro) | Pergunta humana expondo a bifurcação; vem do Mapa de Confusão |
| Limite de perguntas | — | Após 1–2 ainda incerto → fallback humano (fila "incerto"), nunca 🔴 automático | "Vou te conectar com um humano pra confirmar" |
| CTA 🟢 "É isso mesmo" | tap | — | Círculo coral + check → confete → login; colado no rodapé |
| "Refazer / não é isso" | tap | — | Acima do CTA; volta sem perder texto |
| Captura 🟡 (waitlist) | nome + contato | Contato válido; consentimento LGPD | "Ainda não abrimos pra sua atividade, avisamos" |
| Captura 🔴 (comercial Mauro) | nome + contato + atividade | Contato válido | "Seu caso é melhor com nosso time contábil" — roteia |

### Tela 5 — Login / criar conta
| Campo/Elemento | Entrada | Validação & margem de erro | IA / sugestão / microdetalhe |
|---|---|---|---|
| Só aparece após 🟢 | — | Bloqueia acesso direto sem veredito 🟢 | Conta vem depois do "sim" |
| E-mail | input | Formato válido; duplicado → "já tem conta? entrar" | Autofill amigável |
| Social login | tap (Google/Apple) | Falha OAuth → fallback e-mail | — |
| Senha (se e-mail) | input | Força mínima 🟡; mostra/oculta | 🟡 política a travar |
| Estado do veredito | — | — | Carrega CNAE 🟢 do B1 pro dossiê (não repergunta) |

---

## 📋 B2 — Coleta + Enquadramento

### Tela 6 — 2.1 Dados do sócio
| Campo/Elemento | Entrada | Validação & margem de erro | IA / sugestão / microdetalhe |
|---|---|---|---|
| Nome completo | input | Não vazio; 2+ palavras | — |
| CPF | input máscara | **Dígito verificador + consulta situação cadastral (existe/regular na Receita)** → inválido/irregular = erro inline. 🟡 provider (Serpro/InfoSimples/CNPJá) | Autoavança ao completar; não deixa CPF errado seguir pro dossiê |
| RG + órgão emissor | input | Não vazio | — |
| Estado civil | dropdown | — | Se "casado" → revela regime de bens (campo condicional) |
| Regime de bens | dropdown (condicional) | Obrigatório só se casado | Comunhão universal → flag p/ atos que pedem anuência do cônjuge |
| Endereço do sócio | input + CEP | CEP válido (busca auto); nº obrigatório | Autocompleta rua/bairro pelo CEP |
| Contato | input | Formato válido | Herdado do login quando possível |

### Tela 7 — 2.2 Duplo vínculo CLT
| Campo/Elemento | Entrada | Validação & margem de erro | IA / sugestão / microdetalhe |
|---|---|---|---|
| "Tem outro emprego CLT?" | toggle | — | "Não" → pula resto da tela |
| Valor da remuneração CLT | input R$ (se sim) | Obrigatório se sim; rejeita 0/negativo | Alimenta cálculo do teto INSS |
| Aviso de teto INSS | leitura | — | **Cálculo de FOLGA, não binário:** INSS do pró-labore incide sobre `teto − salário CLT`. Só ZERA se o CLT já ≥ **teto R$8.475,55** (2026). Ex: CLT R$8k → ainda recolhe 11% sobre a folga de R$475,55. Fonte: [[fiscal-simples-bh-2026]] #6 |
| Privacidade | — | Sistema não puxa vínculo de terceiro (LGPD) — cliente declara | Microcopy de confiança |

### Tela 8 — 2.3 +Sócios
| Campo/Elemento | Entrada | Validação & margem de erro | IA / sugestão / microdetalhe |
|---|---|---|---|
| "Tem outros sócios?" | toggle | — | "Não" → solo (afeta natureza em 2.6) |
| **Limite de sócios** | — | **Máx 2 no total** (decisão 15/07). Passou → bloqueia "+adicionar" + "acima de 2 sócios = atendimento humano" | ✅ travado em 2 (era 3, corrigido) |
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

### Tela 13 — 2.8 Simulador Fator R + pró-labore (clímax)
> ⚠️ **Saída é PROJEÇÃO, não anexo travado.** Empresa nova não tem 12 meses de folha; o Fator R real só se firma operando. Rotular tudo como **"estimativa"** e explicar a anualização do 1º ano em 1 linha. Base: [[fiscal-simples-bh-2026]] #3 (bloco CONSOLIDADO).

| Campo/Elemento | Entrada | Validação & margem de erro | IA / sugestão / microdetalhe |
|---|---|---|---|
| Faturamento estimado | faixa guiada (botões/slider) | Nunca campo aberto; slider fino opcional | IA já chega com faixa marcada (CNAE + solo/sócios) |
| Pró-labore | slider/opções | Mínimo = **1 salário mín (R$1.621, 2026)**; rejeita abaixo | 3 cenários lado a lado (A · B · **Ótimo**) |
| Resultado Fator R | leitura (est.) | Motor: folha ≥ **28%** do faturamento → Anexo III (**6%**), senão Anexo V (**15,5%**) | Ponto médio da faixa + sensibilidade ("na ponta de cima já vira III") |
| **Pró-labore ÓTIMO (NOVO)** | recomendação da IA | calcula o pró-labore que cruza 28% **e** fica ≤ **R$5.000** (isenção de IRRF) | O diferencial: mostra "pague-se R$X → cai no Anexo III **sem pagar IRRF** → economia ~R$Y/mês". Base #3+#9 |
| Transparência de custo | leitura | — | Custo da folha = **INSS 11% do pró-labore** (máx R$932,31/mês) **+ IRRF**. **⚠️ IRRF = ZERO até ~R$5.000/mês de pró-labore** (Lei 15.270/2025) — não inflar o custo com imposto que não existe. Base #2 |
| Alerta regime de caixa | leitura (🟡) | — | "Pró-labore atrasado sai do cálculo do mês → pode cair pro Anexo V." Folha conta por **caixa**. 🟡 verificar COSIT 17/2021 antes de exibir. Base #C |
| Caso anexos diferentes | flag | "Pela maior × pela nota" → motor não crava, marca 🟡 | Raro no MVP só-serviço; pendência Larissa. Não chuta número |

### Tela 14 — 2.9 Revisão do dossiê
| Campo/Elemento | Entrada | Validação & margem de erro | IA / sugestão / microdetalhe |
|---|---|---|---|
| Resumo de tudo | leitura | Campos faltando → destaca e leva de volta ao passo | Cards por seção |
| Editar por seção | tap | — | Deep-link pro passo, volta pra revisão |
| Salvar & retomar | ação | Estado persistido (sobrevive dias) | Retoma idempotente |
| "Está tudo certo" | tap | Só habilita com dossiê completo | Handoff pro B3; economia do Fator R vira gancho |

---

## Notas transversais (todo o wizard)
- **Barra de progresso** simples e persistente.
- **Salvar & retomar** em qualquer ponto do B2.
- **Altura sem scroll** onde couber (`100dvh` + `min-h-0`).
- **Sem travessão** em nenhuma copy.
- Erros **inline**, nunca modal genérico; microcopy que ensina, não culpa.

## 🟡 Pendências desta spec
- ~~Limite de sócios: 3 ou 2?~~ ✅ **travado em 2** (15/07).
- ~~Valores fiscais vigentes (salário mín, teto INSS)~~ ✅ **resolvido** em [[fiscal-simples-bh-2026]] CONSOLIDADO: mín R$1.621 · teto INSS R$8.475,55 · INSS máx R$932,31/mês · IRRF isento ~R$5k (reconferir jan/27).
- Preço do endereço fiscal Legalizei (~R$60 benchmark, definir o nosso)
- Provider da validação de CPF/situação cadastral (mesmo pool do cartão CNPJ)
- Política de senha do login
- **Fila-Larissa (impacta o simulador 2.8):** (A) mecânica Fator R meses 2–12 · (B) **CPP-no-DAS entra no numerador?** (muda o pró-labore ótimo) · (C) FS12 regime de caixa (COSIT 17/2021). Ver tabela em [[perguntas-larissa-fiscal]].

## Links
- [[blocos-fluxo-abertura]] · [[mapa-telas-mobile]] · [[casos-teste-fluxo-cnae]] · [[2026-07-13-conversa-karla]] · [[HOME]]
