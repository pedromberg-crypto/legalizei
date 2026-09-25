---
name: legalize-numero-mora-em-um-lugar-so
description: 25/09 - verificar-carga tinha 58 cravado e contagem-esperada dizia 55; duas travas da mesma verdade derrubaram um deploy sem relacao.
metadata: 
  node_type: memory
  type: project
  originSessionId: 12f65b6f-b033-4e22-b604-b0ad37e11175
  modified: 2026-09-25T03:18:52.643Z
---

Duas travas mediam a mesma coisa e discordavam: `seed/verificar-carga.ts` tinha **58 cartões cravados em código** e `seed/contagem-esperada.json` dizia **55**.

A errada era a do código. Em 23/09 o commit `5f05a1e` fundiu quatro cartões de folha (`8.2` lançamentos, `8.3` holerite, `8.4` guias, `8.5` obrigações) num só: 58 − 4 + 1 = 55, **de propósito**. O commit seguinte atualizou só o JSON, que é literalmente o que o próprio arquivo manda não fazer (*"Se você está editando este arquivo sozinho, pare: ou o conteúdo mudou junto, ou alguma coisa se perdeu"*).

🔑 **O custo não apareceu ali, apareceu nove commits depois:** o `deploy:docs` morreu no passo 2 com *"o banco recusaria este conteúdo"*, num deploy que não tinha nada a ver com cartões. Diagnosticar exigiu ler duas travas e o histórico de um arquivo que ninguém tinha motivo pra suspeitar.

**Why:** o conserto óbvio é trocar 58 por 55, e ele recria o bug na próxima fusão de cartão. O certo é o mesmo princípio das colunas geradas da tabela de CNAE (`fator_r` derivada de `anexo`, `mei_permitido` de `mei_ocupacoes`): **duas coisas que são a mesma verdade não divergem se só uma existir.** `contagemEsperada()` virou export e o verificador lê de lá.

**How to apply:** número que já tem casa não ganha uma segunda. Antes de cravar uma constante de verificação, procurar se o mesmo número já mora em arquivo. E mensagem de trava diz o que aconteceu, não o número esperado: *"um dos dois mudou sem o outro"* é diagnóstico, *"a lista ratificada tem 58"* é enigma.

⚠️ Vale também pro `deploy:docs`, que ganhou guard no mesmo dia: rodado de dentro da VPS ele tentava `ssh legalize-vps`, apelido que só existe no `~/.ssh/config` local, e devolvia stack trace em vez de *"o git pull já colocou os arquivos, roda `npm run seed:rag`"*. Ver [[legalize-trava-defasagem-e-ordem]].
