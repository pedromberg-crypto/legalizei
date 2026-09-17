---
name: legalize-arvore-produto-me-mei
description: 17/09 - o produto se organiza por REGIME (me/mei) e depois por CICLO DE VIDA (entrar/viver/desenquadrar); o motor saiu de execucao/ e mora em produto/me/viver/motor/.
metadata:
  type: project
---

**Onde as coisas moram desde 17/09.** `execucao/motor-fiscal/`, `execucao/estado-cnpj/`, `execucao/entrega/` e `execucao/processos/` **nao existem mais** — 57 arquivos, 2 etapas, commits `b22673d` e `bf97466`.

```
produto/
├── me/                       ME Simples, Anexos III e V
│   ├── entrar/{constituir,migrar}/     as duas portas (vazias)
│   ├── viver/                          o dia-2
│   │   ├── _raiz.mjs                   acha a raiz subindo ate o CLAUDE.md
│   │   ├── motor/{regra,vidas,provar,rodar,publicar,notas}/
│   │   ├── processos/                  board + modo cru (era execucao/processos)
│   │   └── {obrigacoes,portal}/        (vazias)
│   ├── desenquadrar/                   saida para EPP (vazia)
│   └── devs/{back,front}/              a entrega gerada
└── mei/{entrar,viver,desenquadrar}/    (vazias, motor proprio: DAS fixo)
```

Dentro do motor: `regra/` = `_tabelas` · `apurador` · `piloto-pro-labore` · `_afirmar`. `vidas/` = as 18 + `_modelo` + `persona-zero` + `ciclo-do-cnpj` + `alertas-internos` + `replay-piloto`. `provar/` = as 8 travas + `_encerrados` (o antigo `estado-cnpj/verificar.mjs` virou `verificar-retrato.mjs`). `publicar/` = `gerar-tabelas-app` + `gerar-entrega`.

**Why:** o eixo e o CICLO DE VIDA, nao a porta de entrada. Constituir e migrar sao duas portas para a mesma casa, e **o motor e a casa** — nenhuma das 18 vidas comeca numa tela de abertura, todas comecam num CNPJ vivo apurando competencia. Por isso ele mora em `viver/`, e as duas portas o consomem sem duplicar. O `desenquadrar/` (ajuste do Pedro sobre a minha proposta de `sair/`) existe porque MEI→ME e saida de um e entrada no outro: a transicao mora na ORIGEM, e o MEI que desenquadra **nao passa por `me/entrar/`** — o CNPJ dele ja existe, ele cai direto em `me/viver/`.

**How to apply:** duas regras nasceram junto e valem sempre. (1) **`motor/publicar/` ESCREVE, `devs/` so RECEBE** — gerado x escrito a mao e fronteira de PASTA, nao aviso no topo do arquivo; nunca editar nada em `produto/me/devs/`. (2) **Nunca contar `../` a mao**: importar `RAIZ` de `produto/me/viver/_raiz.mjs`. Ainda fora da arvore, por decisao: `execucao/flow/` (263 arquivos), `execucao/portal/`, `execucao/handoff/`, as 3 travas de vault (`verificar-tudo`, `verificar-defasagem`, `verificar-autoridade`, que ficam em `execucao/`) e ~71 notas na raiz de `produto/`. Ver [[legalize-motor-fiscal-apurador-existe]] · [[legalize-persona-unica-vidas-mjs]] · [[legalize-trava-defasagem-e-ordem]].
