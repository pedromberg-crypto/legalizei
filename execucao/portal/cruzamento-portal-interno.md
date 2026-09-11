---
tipo: operacao
status: vivo
data: 2026-07-22
assunto: cruzamento-portal-interno-spec
tags: [portal, home, dia-2, ux, feature, spec, navegacao]
---

# 🧩 Portal interno — cruzamento paridade × inovação (spec canônica)

> 🔻 **PRECEDÊNCIA (travada 11/09).** Este documento é de **julho** e nasceu da primeira leva de comparação com o líder, que foi o que gerou as telas do portal. **Ele é histórico, não é guia.**
>
> Para a rodada de lapidação do MVP, quem manda é a pesquisa de setembro, muito mais robusta: o painel de 51 funcionalidades em [[HOME-produto]], as evidências com API e endpoint em `produto/evidencias/`, e o inventário de capacidades em `execucao/portal/portal-data.mjs`.
>
> ⚠️ **Não apagar.** Aqui mora o porquê de cada tela ter nascido como nasceu, e isso não está em nenhum outro lugar. O que não vale é usar este arquivo para decidir o que construir agora.

> A **parte interna do app** (dia-2) desenhada cruzando o esqueleto da Contabilizei ([[2026-07-21-dossie-plataforma-logada]], paridade) com o banco de inovação ([[home-candidatos-modulos]]). Define **navegação + home + abas + monetização + faseamento**. Vira a base pra montar a home final (mesclando os campeões do acervo `/componentes`).
>
> **Fixes aplicados** (auto-auditoria 22/07): densidade → hierarquia · 1 gauge virou vigília preditiva · dia-1 × regime separados · economia acumulada travada (anti-guru) · gauge+pró-labore acoplados · trilha alinhada ao "certificado invisível" · pagar-pelo-app com fallback · redundância de ações removida · veredito único · avisos+2º sócio previstos.

**Legenda origem:** 🔵 paridade (do líder) · 🟣 inovação (nosso) · ⚪ ambos (paridade repensada)
**Dado:** ✅ temos · 🟡 derivável · 🔴 não temos ainda · **Fase:** MVP · F2 · backlog

---

## 🗺️ Mapa de navegação
Honra a navbar já construída (`app/(app)/(portal)/layout.tsx`): 4 abas + CTA central elevado.

```
┌─ INÍCIO ──── IMPOSTOS ──[ EMITIR NF-e ]── NOTAS ──── MAIS ─┐
│                              (CTA)                          │
```
- **Início** — a home (o copiloto). Estado **dia-1** × **regime** (ver abaixo).
- **Impostos** — ver + **pagar** DAS, alíquotas, simulador.
- **Emitir NF-e** (CTA central) — atalho direto pro wizard.
- **Notas** — emitidas, tomadores, consultar/cancelar.
- **Mais** — pró-labore, documentos, **catálogo de serviços (vendáveis)**, config, plano, ajuda, avançado.

Topo global: **bell de avisos** (casa dos alertas proativos da IACA/vigília) + acesso do **2º sócio** (sociedade até 2).

> 👤 **Acesso à parte (não é nav do cliente): operador externo do parceiro do certificado** — login escopado só pra upload dos docs do certificado do cliente atribuído (ver §Resolvido abaixo). Superfície de ops/admin, isolada do app do cliente.

---

## 🏠 Home — 2 estados reais (data-driven, não por persona → alinha UX-48)
O estado é decidido pelo **dado da conta** (tem nota/faturamento? certificado?), não por escolha de perfil. Densidade muda apresentação, jamais obrigação.

### Estado DIA-1 (recém-aberto, sem nota/faturamento)
Herói = **começar**, não um dashboard de zeros.
| Camada | Módulo | Origem | Conteúdo | Fase |
|---|---|:--:|---|:--:|
| **HERÓI** | Trilha de ativação | ⚪ | "✓ empresa aberta · **certificado: em emissão pelo nosso parceiro** (1 videochamada rápida com eles) → ✓ pronto · **→ emita sua 1ª nota**" + "o que esperar" (quando cai o 1º imposto, como funciona) | MVP |
| Secundário | Perguntar à IACA | ⚪ | tira a 1ª dúvida fiscal sem jargão | MVP |
| Cuidado | Quem cuida + WhatsApp | ⚪ | rosto do time (22 anos) + falar com humano | MVP |
| Dormente | Vigília fiscal | 🟣 | "seu monitoramento começa quando você emitir a 1ª nota" (sem número fake) | MVP |

⚠️ **Regra:** nada de faturamento 0 nem Fator R fictício no dia-1. O gauge só **acende** com histórico.

### Estado REGIME (empresa rodando, com histórico)
Hierarquia dura: 1 herói, resto progressivo/abaixo da dobra.
| Camada | Módulo | Origem | Conteúdo | Dado | Fase |
|---|---|:--:|---|:--:|:--:|
| **HERÓI** | Veredito + próxima obrigação | ⚪ | "**Tá tudo certo.** Seu DAS de R$178 vence dia 20 — **pagar agora**." (funde status de prazo + declarações + a ação de pagar) | 🟡 | MVP |
| Secundário | Ações secundárias (grid) | ⚪ | Pró-labore · Docs · Perguntar (IACA). *(Emitir = CTA central; Pagar = no herói → sem redundância)* | ✅ | MVP |
| Pulso | Faturamento vivo | 🔵 | mês/ano + tendência | ✅ | MVP |
| **VIGÍLIA** ⭐ | Fator R + pró-labore acoplados + **alerta preditivo** | 🟣 | mostrador (alavanca=pró-labore, dial=Fator R) **+** "quando você voltar a faturar cheio, cai pra 15,5% — a gente avisa antes" + swap de CNAE que economiza | 🟡 | **MVP** (o diferencial) |
| Cuidado | Quem cuida + WhatsApp | ⚪ | confiança + suporte humano | ✅ | MVP |
| Crescer | Dicas / "você sabia?" | 🟣 | carousel de micro-educação | 🟡 | F2 |
| Crescer | Economia acumulada 🔒 | 🟣 | "te devolvemos R$X" — **só com baseline auditável** (trava anti-guru) | 🟡 | F2 |
| Crescer | Cofrinho + swipe-to-pay | 🟣 | reserva o DAS conforme fatura · desliza pra pagar | 🔴 | F2/F3 |
| Crescer | Marcos / story / indique | 🟣 | confete "1ª nota!" · linha do tempo · referral | 🟡 | backlog |

**Postura (❌ nunca):** dunning, "você pagou?", muro de número que assusta. A vigília **explica**, não ameaça.

---

## 📑 Abas por dentro

**IMPOSTOS**
| Item | Origem | Fase |
|---|:--:|:--:|
| Ver DAS + **pagar pelo app** *(⚠️ validar infra c/ dev; fallback = guia + Pix copia-e-cola)* | ⚪ | MVP |
| Guia / recalcular / histórico | 🔵 | MVP |
| Minhas alíquotas (composição Fator R → alimenta a vigília) | 🔵 | MVP |
| Simulador de impostos (é o "modo e se?") | 🔵 | F2 |
| Débito automático (toggle) | 🔵 | MVP |
| Reemissão de guia | 🛒 vendável | MVP |

**NOTAS + [Emitir]**
| Item | Origem | Fase |
|---|:--:|:--:|
| Emitir NFS-e — **só valor + cliente** (pré-preenchemos os 3 códigos) | ⚪ | MVP |
| Guia da 1ª nota + certificado invisível | 🟣 | MVP |
| Tomadores (clientes) + B2C | 🔵 | MVP |
| Consultar / cancelar / importar | 🔵 | MVP/F2 |
| Consultor tributário (IACA sugere código) | ⚪ | MVP |
| NF emitida pela equipe (concierge) | 🛒 vendável | F2 |

**PRÓ-LABORE / VIGÍLIA** (âncora — mora na home + detalhe aqui)
| Item | Origem | Fase |
|---|:--:|:--:|
| **N18 interativo** (mexe e vê o imposto mudar — o líder só tem preset) | 🟣 | **MVP âncora** |
| Fator R + alerta preditivo (teto do Simples, swap de CNAE) | 🟣 | MVP |
| Toggle "sem pró-labore em mês sem faturar" **explicado** | ⚪ | MVP |
| Vínculo / dependentes / histórico / recibo / informe | 🔵 | MVP |
| Alteração de pró-labore já processado | 🛒 vendável | F2 |

**MAIS** (o menu)
| Bloco | Conteúdo | Fase |
|---|---|:--:|
| Documentos | CND, declaração de faturamento, contrato, certificado | MVP |
| **Serviços** (catálogo à-la-carte) | os 15 vendáveis — a casa da receita | MVP |
| Conciliação bancária | Open Finance, sem forçar banco | F2 |
| Relatórios contábeis (avançado) | DRE/Balanço/Razão/Diário + 1 linha traduzindo | F2 |
| Plano / faturas / config / dados da empresa / ajuda | mensalidade + conta | MVP |
| Em breve | folha · benefícios · cobrar-cliente | backlog |

---

## 💰 Monetização — 3 baldes (decidido 22/07)
- 🟢 **Plano R$195** *(placeholder FAKE, preço deferido → [[legalize-preco-deferido-custo-real]])* = core: emitir, pagar DAS, pró-labore interativo, vigília, em-dia, home enxuta. **Paridade + supera** (fecha os loops abertos do líder).
- 🛒 **Catálogo vendável** = 1B + balde 2 (tabela abaixo). Preço/política **a ajustar com Mauro** (decisão de negócio).
- 🔴 **Backlog** = folha, benefícios, banco próprio, cobrar-cliente, relatórios avançados.

### Catálogo à-la-carte (preço = ref. do líder, o nosso é a definir c/ Mauro)
| Serviço | Ref. líder |
|---|:--:|
| Alteração contratual (add sócio/CNAE/endereço/nome/capital) | a partir de R$1.299 |
| Baixa de empresa | R$1.406–1.999 *(⚠️ debater: não punir a saída)* |
| DECORE (comprovante de renda) | R$713,90 |
| Alvará (obtenção/renovação) | R$416 |
| CPOM/CEPOM (faturar fora de BH) | R$249 |
| Regularização de Inscrição Estadual | R$230,90 |
| Alteração de porte ME/EPP | R$156,40 |
| Liberação p/ emitir NF (AIDF) | R$103,20 *(⚠️ se bloqueia a 1ª nota, não pode ser paywall puro)* |
| Alteração de pró-labore já processado | R$98,90 |
| Declaração / previsão de faturamento | R$68,90 |
| Emissão de CND | R$35,90 |
| Verificação de pendências (one-off) | R$24,90 *(o monitoramento passivo na home segue grátis e core)* |
| Reemissão de guia | R$15,90 |
| NF emitida pela equipe (concierge) | Experts |
| Balanço/DRE assinado (sem índices) | R$0 |

---

## ❌ Postura — anti-dark-pattern (o oposto do líder)
| Prática do líder | Nossa postura |
|---|---|
| Confirmação manual "você pagou?" | detecta / paga sozinho |
| Dunning por medo (exclusão do Simples, multas) | transparência, sem pânico |
| Surcharge oculto ("a partir de") | preço transparente do perfil real |
| Lock-in bancário (extrato manual noutro banco) | Open Finance, sem prender |
| Reajuste IGP-DI no silêncio (P18) | regra de reajuste anunciada |
| CSAT invadindo toda tela | medir sem incomodar |
| 2 gerações de UI coladas / emissor instável | nascer consistente |

---

## ✅ Resolvido 22/07 — modelo do certificado (P0) + acesso do parceiro
**Emissão 100% do parceiro terceirizado, FORA do nosso app** (contato, agendamento, videochamada de identidade). A gente só **transfere** o cliente e recebe o certificado de volta. Reconcilia o conflito spec × matriz: P0 no nosso app = **status + handoff + validação do upload**, não videoconf embutida nem ✓ invisível. **Requisito novo — operador externo:** um funcionário do parceiro tem **login escopado** (ver clientes atribuídos aguardando cert · **upload** dos docs do certificado · nada além). **Trava de segurança (LGPD):** escopo mínimo · só o cliente atribuído · log de auditoria · zero acesso a dado fiscal/financeiro. ⚠️ **construir esse acesso → carregar a skill `seguranca-de-sistema`.** Provider específico + mecânica de atribuição = 🟡. Detalhe canônico em [[matriz-portal-interno]] §Módulo 0.

## 🔓 Decisões abertas (pra fechar antes/durante a construção)
1. **Pagar o DAS pelo app** — viabilidade de infra com o dev; fallback Pix copia-e-cola se não fechar no MVP.
2. **Open Finance no dia-1** — a trilha de ativação inclui "conectar conta" (MVP) ou fica F2? (hoje: F2, fora da trilha).
3. **Economia acumulada** — metodologia de baseline auditável antes de exibir qualquer R$.
4. **Preço** do plano + do catálogo à-la-carte — com Mauro (política de baixa/alteração não-punitiva).
5. **AIDF** — venda avulsa OU embutido quando bloqueia a 1ª nota.
6. **Acesso do 2º sócio** — escopo mínimo no MVP.

## Cruza com
[[matriz-portal-interno]] (P0–P14) · [[home-candidatos-modulos]] (banco de inovação) · [[2026-07-21-dossie-plataforma-logada]] (paridade) · [[cnae-fiscalmente-otimo]] (âncora) · [[legalize-cobaia-cnpj-pedro]] (o insight da vigília) · [[plano-padrao-195-referencia]].

> 🔌 **Autofill/consulta:** todo campo que puxa dado de órgão (CNPJ, CEP, situação, certidão) segue [[infosimples-funcionalidades]] — autoridade do que cada API entrega. Não assumir; checar lá.
