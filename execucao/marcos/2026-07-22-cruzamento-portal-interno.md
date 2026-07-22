---
tipo: marco
status: vivo
data: 2026-07-22
assunto: cruzamento-portal-interno
tags: [portal, dia-2, spec, monetizacao, ux, marco]
---

# 🏁 Marco 2026-07-22 — cruzamento do portal interno (baldes + spec + auditoria)

> 13º flow. Saiu do laboratório de mockups pra **definir a parte interna do app**: o que a home tem, como monetiza, e como se navega. Nada de tela nova — é spec + poda.

## O que aconteceu
1. **Poda do laboratório `/mockup-inicio`.** Removidas por completo as 5 explorações **sem ✓ verde** (o Pedro não gostou): `/inicio-v2` · `/inicio-v3` · `/inicio-v4` · `/mais-v2` · `/impostos-completa` (rotas + board + `RAIZES` do layout). Exceção mantida: `/obrigacoes` (sem ✓, mas o Pedro pediu). Acervo `/componentes` + os 12 `components/lab/*` **intactos** (inclusive `nexo-shell`/`home-blocks` das inicio-v* apagadas). `tsc`+eslint limpos.

2. **Home-candidatos (banco de inovação).** [[home-candidatos-modulos]] — 23 módulos candidatos pra home, fora da caixa, com marca de ousadia + prontidão de dado. 4 apostas: **Fator R ao vivo · IACA proativa · economia acumulada · cofrinho+swipe**. Salvo pra cruzar.

3. **Esqueleto da Contabilizei logada → 3 baldes.** Extraí do [[2026-07-21-dossie-plataforma-logada|dossiê ~85%]] **todas** as funcionalidades do plano Padrão R$195 + upsells + à-la-carte, e classifiquei:
   - 🟢 **Incluir no plano** (core: emitir, pagar DAS, pró-labore interativo, em-dia).
   - 🛒 **Vendável** (à-la-carte). **Decisão do Pedro:** o antigo "1B" (trunfos que eu propunha incluir grátis: CND, declaração de faturamento, AIDF, reemissão de guia, verificação de pendências) **também vira vendável agora**, junto do balde 2 — **preço/política ajustados depois com o Mauro** (é decisão de negócio, não de produto).
   - 🔴 **Cortar do MVP** (folha, benefícios, banco próprio, cobrar-cliente, relatórios avançados).
   - ❌ **Rejeitar** (postura anti-dark-pattern: sem dunning, sem "você pagou?", sem surcharge oculto, sem lock-in).

4. **Cruzamento paridade × inovação → spec canônica** [[cruzamento-portal-interno]]. Navegação (4 abas + CTA), **home em 2 estados** (dia-1 × regime), abas por dentro, monetização, faseamento MVP/F2/backlog.

5. **Auto-auditoria (10 achados) aplicada.** Os 3 🔴: (a) a home traía a própria tese anti-densidade → hierarquia (1 herói); (b) o diferencial (monitoramento) **amadurece em regime, não no dia-1** (empresa nova = faturamento 0, Fator R projetado) → 2 homes reais; (c) "economia acumulada" repetia o erro-guru da cobaia → travada com baseline auditável (F2). + o gauge virou **vigília preditiva** (resgata o CNAE-ótimo/Fator R no dia-2), gauge+pró-labore acoplados, redundância de ações removida, veredito único, avisos+2º sócio previstos.

## O que ficou aberto (próximo)
Faltam cruzamentos — o de hoje foi só **paridade × inovação (o QUÊ)**:
- **#1 (🔴 antes de construir): reconciliar a spec nova × a matriz P0–P14** ([[matriz-portal-interno]]). **Elas já conflitam:** meu fix "certificado invisível/✓" briga com a matriz, que diz que o **P0 exige validação de identidade por videoconferência = pausa com ação do cliente**, não um checkmark. Além disso, os módulos de inovação (vigília, economia, IACA proativa) não têm P-número nem arquétipo de build.
- **#2: telas/módulos × acervo `/componentes`** = a ponte spec→build ("montar a home final").
- **#3: seam N24 → P0 → dia-1** (dedupe trilha de ativação × cauda da abertura) — dobra no #1.

**6 decisões abertas** registradas na spec: pagar-DAS-pelo-app (viabilidade dev), Open Finance no dia-1, baseline da economia, preço+catálogo (Mauro), AIDF (venda × embutido quando bloqueia), acesso do 2º sócio.

## Links
[[cruzamento-portal-interno]] · [[home-candidatos-modulos]] · [[matriz-portal-interno]] · [[2026-07-21-dossie-plataforma-logada]] · [[benchmark-padrao-195]] · [[legalize-cobaia-cnpj-pedro]] · [[HOME]]
