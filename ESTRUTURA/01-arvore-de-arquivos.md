---
tipo: inventario
status: vivo
data: 2026-09-20
assunto: agente-whatsapp-vault
tags: [estrutura, leo, agente, arvore, inventario]
---

# 01 — A árvore de arquivos do Léo, por nível

**Medido em 2026-09-20, commit `69f2acb`.** Unidade: caractere.

O agente vive em **três camadas que não se misturam**: o que ele lê, o que descreve
ele, e quem ele é. Confundir as três é o que faz documento de bastidor cair no prompt.

---

## N1 — O QUE O AGENTE LÊ (prompt em produção)

`execucao/agente-whatsapp-vault/` · **214.788 chars** · fonte-verdade (o VPS é cópia)

```
execucao/agente-whatsapp-vault/
│
├── N2 ── SEMPRE NO CONTEXTO                                     25.166
│   ├── 00-SOUL-personalidade.md                                 23.297
│   └── skills-legalizai/DESCRIPTION.md                           1.869   passa INTEIRO
│
├── N2 ── SOB DEMANDA — as 4 skills                              40.935
│   └── skills-legalizai/
│       ├── atendimento/SKILL.md                                 11.358   abre em 100% das conversas
│       ├── vendas/SKILL.md                                      19.403   maior · 5% de aproveitamento
│       ├── escalacao/SKILL.md                                    9.224
│       └── base-legalizai/SKILL.md                                 950   esvaziado em 20/09 (era 2.763)
│
├── N3 ── CONHECIMENTO — 13 notas                                69.123
│   └── skills-legalizai/base-legalizai/references/
│       ├── 00-DIRETRIZES-SEGURANCA.md                            4.876
│       ├── 01-PLANOS-E-OFERTAS.md                                4.135
│       ├── 02-PRODUTO-E-USABILIDADE.md                           3.291
│       ├── 03-REGRAS-DOS-ORGAOS.md                               5.699
│       ├── 04-QUEBRA-OBJECOES.md                                 7.229
│       ├── 05-DICIONARIO-CNAE-TRIBUTARIO.md                      7.837
│       ├── 06-CALCULO-FISCAL.md                                  5.566
│       ├── 07-OBRIGACOES-MENSAIS.md                              6.259
│       ├── 08-MAPA-DO-DOSSIE.md                                  3.057   aberto 0x em 632 chamadas
│       ├── 09-ESCOPO-E-LIMITES.md                                6.048
│       ├── 10-CONTRATO-GARANTIA-CANCELAMENTO.md                  3.792   aberto 1x em 632 chamadas
│       ├── 11-COMO-CONSULTAR-CNAE.md                             5.212
│       └── 12-GATE-DE-SAIDA.md                                   6.122
│
├── N3 ── TESTES (não entram no prompt)                          68.092
│   └── _testes/
│       ├── casos.yaml                                           23.091   58 casos · 1 turno
│       ├── casos-conversados.yaml                               10.100   3 conversas × 12 turnos
│       ├── runner/rodar_testes.py                               17.856   cópia versionada do runner
│       ├── suites.yaml                                           4.918
│       ├── README.md                                             3.838
│       └── relatorios/2026-09-20-piloto-roteamento.md            8.289
│
├── N3 ── OPERAÇÃO                                               11.472
│   ├── README.md                                                 5.933
│   └── sync-vps.sh                                               5.539   repo → VPS, com diff + backup
│
└── N4 ── CONGELADO                                             245.457 · 27 arquivos
    └── _arquivo/pacote-v12-2026-09-20/
        ├── LEIA-ANTES-DE-TOCAR.md
        ├── runtime/   config.yaml · skills_prompt_snapshot.json
        ├── vault/     cópia byte-a-byte do pacote v12
        └── testes/    casos · conversados · runner · suites
```

🔑 **O que a árvore revela de cara:** o que de fato sobe no prompt em toda mensagem é
o N2 "sempre no contexto" (**25.166 chars**, 11,7% do vault). Todo o resto é potencial
— e é por isso que a conta do Léo é de **custo de caminho**, não de volume.

⚠️ `_arquivo/` (245.457) é **maior que o vault vivo inteiro**. É backup congelado do
pacote v12, guardado a pedido do Pedro antes da reescrita de 20/09 que acabou revertida.
Não é lixo e não é dívida: é a referência byte-a-byte que fechou a reversão.

---

## N1 — O QUE DESCREVE O AGENTE (histórico, não vai pro prompt)

**106.544 chars** em 9 arquivos, espalhados por três pastas.

```
execucao/entregas/
├── briefing-agente-leo-2026-09-20.md                            14.206   ← mais novo, porta de entrada
├── handoff-leo-ajustes-2026-09-17.md                            24.018
├── handoff-leo-agente-whatsapp.md                               17.630
├── _RETOMADA-leo-fork-e-atualizacao.md                           8.250
├── handoff-vps-medicao-sem-token-2026-09-19.md                   7.430
├── handoff-vps-fase-a-medicao-valida-2026-09-19.md               6.685
└── handoff-vps-traco-real-caminho-2026-09-19.md                  5.402

execucao/marcos/
└── 2026-09-19-leo-respondia-de-memoria.md                        6.051

pesquisa/prompts/
└── prompt-pesquisa-motor-do-leo-e-testes-otimizados.md          16.872
```

🟡 **Pendência visível daqui:** são **5 documentos contando a mesma história** em
graus diferentes de atualidade (2 handoffs de Léo, 3 de VPS, 1 briefing, 1 retomada).
Nenhum declara quem substitui quem. O briefing de 20/09 é o mais completo e o mais novo,
mas não carimba os outros como históricos.

---

## N1 — QUEM O LÉO É (personalidade · 4 cópias, 2 já divergiram)

```
marca/personagem-leo.md                                          22.864   🔑 FONTE
atelie/ds/legalizai/personagem-leo.md                            22.097   derivado · congelou em 26/08
execucao/agente-whatsapp-vault/00-SOUL-personalidade.md          23.297   derivado · já contado em N1
marca/identidade-visual/leo-render-3d-doutrina.md                20.533   derivado visual
app/public/leo/                                                           leo-escorado · leo-espiando · leo-parede (.png)
```

🔴 A divergência já está registrada em [[legalize-leo-personalidade-4-copias]]: a cópia
do Ateliê parou nos pilares v3 de 26/08 e ainda descreve o polo com "L" em vez do check,
corrigido na fonte em 29/08. Carimbo de "derivado" nos 3 foi proposto e **aguarda ok**.

---

## Correção de medição

Numa leitura anterior desta mesma árvore, no chat de 20/09, dois subtotais saíram
errados: as 13 notas de conhecimento foram ditas como **65.100** quando são **69.123**,
e os testes como **68.001** quando são **68.092**. O total de 214.788 estava certo — os
erros eram de soma parcial, não de medição. Fica registrado porque
[[legalize-trava-defasagem-e-ordem]] vale aqui: número em prosa não recalcula sozinho.

Ver também [[02-arquitetura-vs-realidade]].
