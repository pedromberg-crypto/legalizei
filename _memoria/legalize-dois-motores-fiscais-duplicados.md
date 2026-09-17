---
name: legalize-dois-motores-fiscais-duplicados
description: 14/09 - existem DOIS motores fiscais no repo e eles duplicam 7 de 7 constantes; o brl() tem unidades diferentes nos dois. E o ponto de retomada pedido pelo Pedro.
metadata: 
  node_type: memory
  type: project
  originSessionId: 349af8f2-bd19-4385-8de7-9e1f53328c23
  modified: 2026-09-15T02:48:52.324Z
---

🔴 **PONTO DE RETOMADA declarado pelo Pedro em 14/09:** *"quero voltar resolvendo sobre esses 2 motores, parece duplicado"*. Esta e a primeira coisa do proximo flow.

## O diagnostico, medido

| | `app/src/lib/fiscal.ts` | `produto/me/viver/motor/regra/` (era `execucao/motor-fiscal/`) |
|---|---|---|
| Papel | **estimador de abertura** | **apurador de competencia** |
| Testes | nenhum | 41 conferencias |

**7 de 7 constantes fiscais existem nos dois, com o MESMO valor:** `SALARIO_MIN` 1621 · `TETO_INSS` 8475.55 · `INSS_ALIQ` 0.11 · `FATOR_R_LIMIAR` 0.28 · `FATOR_R_MARGEM` 0.3 · `ANEXO_III` 0.06 · `ANEXO_V` 0.155.

🔑 **Ainda nao quebrou porque os valores coincidem.** Basta a lei mudar um — e o salario minimo muda **todo janeiro** — para os dois lados divergirem em silencio.

## 🔴 A armadilha pior: `brl()` com unidades diferentes

As duas existem, mesmo nome, mesma finalidade:

- `fiscal.ts` → `brl(reais)`, e **sem centavos por padrao**. `brl(474.59)` da **"R$ 475"**.
- `apurador.mjs` → `brl(centavos)`. `brl(47459)` da **"R$ 474,59"**.

Importar a errada erra por **100x**, e o TypeScript nao acusa: as duas assinaturas aceitam `number`. Passa em revisao e aparece na fatura do cliente.

## 🏷️ E uma constante com nome errado

`fiscal.ts` tem `IRRF_ISENCAO: 5000 // isencao efetiva/mes (Lei 15.270/2025)`. **Nao e isencao.** Depois da pesquisa de 14/09: R$5.000 e o **teto do rendimento que o redutor zera**, e acima disso ha rampa ate R$7.350. Quem ler o nome vai implementar uma faixa isenta que a lei nao criou.

## A decisao a tomar

Portar as tres funcoes orfas — `proLaboreOtimo`, `naBorda`, `custoProLabore` — pro apurador e deixar o `fiscal.ts` so com **custo de abertura** (papel legitimo, nao conflita). Ou o inverso. **Nao fazer as duas coisas.**

⚠️ Junto vem a pergunta que ficou em aberto: o Next.js e **prototipo**, o produto real e o **Flutter**. Portar pro `app/src/lib/` pode ser trabalho no cliente errado. Por isso o estado recorrente nasceu agnostico, em `produto/me/viver/motor/vidas/` (era `execucao/estado-cnpj/`).

Detalhe completo em `produto/me/viver/motor/notas/_SUFICIENCIA.md` §6.
Relacionado: [[legalize-motor-fiscal-apurador-existe]] · [[legalize-estado-recorrente-cnpj]]
