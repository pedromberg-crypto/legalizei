---
name: legalize-arvore-produto-me-mei
description: 17/09 - o produto se organiza por REGIME (me/mei) e depois por CICLO DE VIDA (entrar/viver/desenquadrar); o motor saiu de execucao/ e mora em produto/me/viver/motor/.
metadata:
  type: project
---

**Onde as coisas moram desde 17/09.** Seis etapas num dia. **Nao existem mais:** `execucao/{motor-fiscal,estado-cnpj,entrega,processos,flow,portal,handoff,motor-testes}`, `ux-ui/` e `apresentacao/`. O vault saiu de 14 pastas de raiz para 13, a raiz de `produto/` de 13 arquivos soltos para 2, e a de `execucao/` de 24 para 6.

```
produto/
├── HOME-produto.md · _raiz.mjs         a raiz tem SO estes dois
├── _doutrina/                          _metodo · _doutrina-capacidades (transversal)
├── _flow/                              as 124 telas: abrir 69 · mei 36 · migrar 14
│   ├── flow-data.mjs · gerar-mapa.mjs · as 3 travas MEI
│   ├── mapa-flow-mermaid.md · dados-coletados-*.md · auditoria-copy-flow.md
│   ├── specs/                          os 8 docs de tela (vieram de execucao/specs)
│   └── versoes/                        SO a corrente; o resto em _arquivo/
├── me/                                 ME Simples, Anexos III e V
│   ├── persona-zero/ · _evidencias/    a empresa do Pedro · teardown do lider
│   ├── entrar/constituir/              141 prints da JUCEMG + checklist + orgaos
│   ├── entrar/migrar/
│   ├── viver/
│   │   ├── motor/{regra,vidas,provar,rodar,publicar,notas}/
│   │   ├── processos/                  board + cru + PERSONA.md
│   │   ├── funcionalidades/            as 58 + gerador + specs/
│   │   ├── portal/                     portal-data + _historico/ de julho
│   │   └── obrigacoes/
│   ├── desenquadrar/                   saida para EPP
│   └── devs/{back,front,gerador}/      a entrega, GERADA
└── mei/{entrar,viver,desenquadrar}/    motor proprio: DAS fixo, sem Fator R
```

Dentro do motor: `regra/` = `_tabelas` · `apurador` · `piloto-pro-labore` · `_afirmar`. `vidas/` = as 18 + `_modelo` + `persona-zero` + `ciclo-do-cnpj` + `alertas-internos` + `replay-piloto`. `provar/` = as 8 travas + `_encerrados` (o antigo `estado-cnpj/verificar.mjs` virou `verificar-retrato.mjs`). `publicar/` = `gerar-tabelas-app` + `gerar-entrega`.

**Why:** o eixo e o CICLO DE VIDA, nao a porta de entrada. Constituir e migrar sao duas portas para a mesma casa, e **o motor e a casa** — nenhuma das 18 vidas comeca numa tela de abertura, todas comecam num CNPJ vivo apurando competencia. Por isso ele mora em `viver/`, e as duas portas o consomem sem duplicar. O `desenquadrar/` (ajuste do Pedro sobre a minha proposta de `sair/`) existe porque MEI→ME e saida de um e entrada no outro: a transicao mora na ORIGEM, e o MEI que desenquadra **nao passa por `me/entrar/`** — o CNPJ dele ja existe, ele cai direto em `me/viver/`.

**How to apply:** duas regras nasceram junto e valem sempre. (1) **`motor/publicar/` ESCREVE, `devs/` so RECEBE** — gerado x escrito a mao e fronteira de PASTA, nao aviso no topo do arquivo; nunca editar nada em `produto/me/devs/`. (2) **Nunca contar `../` a mao**: importar `RAIZ` de `produto/_raiz.mjs`. Ainda fora da arvore, por decisao: `produto/_flow/` (263 arquivos), `produto/me/viver/portal/`, `produto/me/devs/gerador/`, as 3 travas de vault (`verificar-tudo`, `verificar-defasagem`, `verificar-autoridade`, que ficam em `execucao/`) e ~71 notas na raiz de `produto/`. Ver [[legalize-motor-fiscal-apurador-existe]] · [[legalize-persona-unica-vidas-mjs]] · [[legalize-trava-defasagem-e-ordem]].
