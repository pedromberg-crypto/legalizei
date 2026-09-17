---
name: legalize-trava-defasagem-e-ordem
description: "17/09: número em prosa tem trava própria (verificar-defasagem) e a ordem de verificação virou um comando só (verificar-tudo); o '7' errado vivia em 4 arquivos porque ninguém soma prosa"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 137c5c62-5907-425e-84f8-713185c5d706
  modified: 2026-09-17T03:23:36.786Z
---

**Duas travas de método nasceram em 2026-09-17**, da provocação do Pedro: *"quero de fato ter 100% de segurança para seguir validando processos… sinto que estamos delirando demais entre uma varredura e outra, sinto que você muitas vezes erra e na mesma resposta conserta"*, com a restrição **"nunca criar novos documentos de forma desnecessária"**. Saldo: 2 scripts, 0 notas novas.

1. **`execucao/verificar-defasagem.mjs`** — número em prosa. As 4 travas anteriores pegam contradição (`verificar-encerrados`), vocabulário (`verificar-escopo`, `verificar-persona`) e ausência (`verificar-etiquetas`); nenhuma pegava **defasagem**. Mede 9 números **rodando as suítes** e varre 12 textos vivos, **código incluído** — comentário é prosa e ninguém relê comentário. Selo `[HISTÓRICO]` autoriza número velho em citação legítima.
2. **`execucao/verificar-tudo.mjs`** — a ordem. 13 etapas em 4 fases: fontes → geradores → suítes → **defasagem por último**, porque ela compara com o que as suítes acabaram de medir. Varre o repo atrás de verificador **órfão** e derruba a rodada.

**Why:** o diagnóstico é arquitetural, não de disciplina. Na auditoria de 16/09 os docs **gerados** tiveram **0** deriva e os escritos à mão, **7 de 7**. Número em prosa não recalcula.

🔴 **O achado que justifica tudo:** o número **7** estava errado em 4 arquivos (incluindo o reporte ao Mauro) e eram **8**. Duas frases **complementares** diziam 7 num elenco de 16 — 7 + 7 = 14. Cada uma morava num arquivo, nenhuma contradizia nada visível de onde estava, e **ninguém soma prosa**.

🐛 **E a trava nova nasceu cega, de duas maneiras** — o recuo `(?!…com|que|sem…)` sem `\b` fazia `com` casar dentro de **`começam`**; e o padrão varria a marcação, não o texto, então `**45 conferências** no motor` não casava. Ela rodou **verde** afirmando que estava tudo em dia. **Trava cega é pior que trava ausente.** Padrão novo se testa **plantando o erro de propósito** e conferindo que morde.

**How to apply:** rodar `node execucao/verificar-tudo.mjs` antes de afirmar qualquer número ao Pedro. Escrever recorte na forma **`N das M vidas <predicado>`** (o denominador também é conferido). Número que não acabou de rodar sai como *"vou medir"*, nunca citado.

⚠️ **A fronteira:** pega dígito, **não quantificador** — *"todas, sem exceção"* passou limpo e era falso. E não pega regra bem escrita e errada: isso é o contador.

Relacionado: [[legalize-travas-de-metodo-15-09]], [[legalize-aplicacao-das-decisoes-do-contador]], [[legalize-placar-do-reporte-gerado]], [[legalize-contador-valida-o-motor]].
