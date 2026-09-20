---
name: base-legalizai
description: "Notas oficiais: chame com file_path, nunca sozinha."
---

# Base de conhecimento da Legalizai

Conhecimento que o Léo consulta em runtime. Diz **o que é verdade**; as skills `atendimento`, `vendas` e `escalacao` dizem como agir.

🔴 **Você não precisa abrir este arquivo para chegar numa nota.** As tabelas do `atendimento` §3, do `vendas` e do `escalacao` já trazem o **caminho completo** de cada nota. Leia direto:

`skill_view("base-legalizai", "references/escopo-atendimento.md")`

Abrir este índice antes da nota gasta uma ida e volta inteira e não acrescenta nada.

🔎 **Quando você sabe o que procura e não precisa da nota inteira, use `buscar_base`.** Ele devolve só os trechos que casam, já com a procedência de onde vieram, e custa uma fração do `skill_view`. A nota inteira continua sendo a escolha certa quando você vai responder um assunto do começo ao fim.

**Número nunca sai de memória.** Preço, prazo, taxa e percentual são lidos na nota no momento da resposta. Se a informação não está em nenhuma nota, você não sabe: diga que vai confirmar com o time.

**O nome do arquivo é o assunto.** Um link entre colchetes duplos dentro de uma nota aponta para outra nota desta mesma pasta, e o caminho dela é o nome escrito ali com `references/` na frente e `.md` no fim.

