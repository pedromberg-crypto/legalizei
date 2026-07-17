---
tipo: historico
status: vivo
data: 2026-07-17
assunto: construcao-telas
tags: [marco, telas, app, arquetipo, ux, lottie]
---

# 🏗️ Marco — telas A1 (dossiê) + A2 (veredito) construídas em código

> 4º flow de 17/07. Saiu da fase "layout provado, construção destravada" (marco
> [[2026-07-17-complexidade-abertura-e-telas]]) pra **telas navegáveis e
> revisadas pelo Pedro em tempo real** no `/mockup`. Por arquétipo, como decidido.

## O que foi construído

### A1 · Pergunta — coleta do dossiê (N10–N16), 7 telas
`app/src/app/(app)/dossie/` (shell APP, pós-pagamento). Cada tela carrega a
regra da spec (T6–T12, [[spec-telas-entrada-b1-b2]]):
- **N10 socio** — CPF valida situação · casado revela regime · comunhão universal avisa cônjuge (UX-30) · exterior = bloqueio que educa
- **N11 vinculo** — teto INSS = FOLGA não binário · pró-labore reenquadrado como ganho (UX-27) · alimenta o N18 (UX-24)
- **N12 socios** — limite 2 (trava, N4 já filtrou) · divisão soma 100%, atalhos 25/50/75, slider de 5 em 5
- **N13 empresa** — upsell endereço fiscal (oferece, não obriga; preço FAKE ~R$60) · IPTU opcional · alerta capital baixo
- **N14 cnae-secundarios** — principal herdado travado · prova social · comércio avisa, nunca some silencioso
- **N15 natureza** — recomenda (solo→SLU) sem travar; LTDA-solo permitido (fato do CNPJ do Pedro); SLU+sócio barrado
- **N16 nome** — IA sugere razão · viabilidade: nome em uso → variações

### A2 · Veredito — 🟢/🟡/🔴, 3 rotas
`app/src/app/(wizard)/veredito/{atende,waitlist,nao-atende}`. Renderizam a
**fonte única** `src/components/veredito.tsx`, extraída do gate (o gate passou a
importar dela — muda num lugar, muda nos dois). 🟡/🔴 saem pelo template de
saída graciosa (A9), que ainda vai ser fatorado quando A9 existir.

### Micro-interação de sucesso
Confete da marca (`src/components/confetti.tsx` + `public/lottie/`) no CTA 🟢:
burst **localizado** sobre o botão (não full-screen), botão encolhe `scale(.18)`,
refazer some instantâneo. Runtime lottie-web carregado **sob demanda** (zero
npm install), guarda anti-trava, respeita reduced-motion.

## Decisões travadas neste flow
1. **Fade de scroll = affordance, NÃO gate.** O Pedro propôs travar o CTA até a
   pessoa rolar até o fim (garantir leitura). Recusado com fundamento: rolar ≠
   ler (teatro), puniria a Cida (CTA cinza sem motivo visível = UX-12), e
   quebraria o UX-48 (densidade nunca vira obrigação). Solução aceita: fade nas
   pontas do corpo (mesmo mask das pills do N4), mecânico no `Corpo`. Gate real
   só pra consentimento (N8 aceite, N20 termo), via checkbox com motivo à vista.
2. **Componentes de form são LOCAIS ao dossiê**, não DS (regra dos 3: só promove
   o que está nas 2 farol). `campos.tsx` fica local até bater numa 3ª superfície.
3. **Veredito vira fonte única** em vez de duplicar — a lição "muda num lugar,
   muda em todos" aplicada; o mesmo motivo do dropdown custom (1 `Select` → 3 telas).

## Fix de brinde
`useTypewriter` usava setState-em-effect pro `prefers-reduced-motion`; virou
`useSyncExternalStore`. Além de limpar o lint, **destravou o UX-12 de verdade**:
antes o reduced-motion só matava CSS e o typewriter JS passava batido.

## Próximo
- **A3 · Número** (N5 teaser 3 modos + N17 CNAE ótimo) — próximo arquétipo.
- Depois: A7 Espera + A9 Saída graciosa (fatora o template do veredito 🟡/🔴).
- Rodar as 7 telas do A1 contra as 19 personas (validação comportamental).

Ver [[legalize-telas-padrao-layout]] · [[reordenacao-flow-cobranca-cedo]] · [[design-system]].
