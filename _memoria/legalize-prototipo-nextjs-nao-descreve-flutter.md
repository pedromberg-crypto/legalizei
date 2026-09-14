---
name: legalize-prototipo-nextjs-nao-descreve-flutter
description: 14/09 - o app Flutter divergiu do prototipo Next.js; ler o prototipo e afirmar sobre o app produz erro confiante. Duas vezes no mesmo dia.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 349af8f2-bd19-4385-8de7-9e1f53328c23
  modified: 2026-09-14T23:31:00.995Z
---

O app **Flutter** (repo proprio, sessao `flutter-legalizai-app-00`) foi reconectado a `legalizai-api` nas fases 1-4 e **divergiu do prototipo Next.js** que serviu de base. Nenhuma afirmacao sobre o comportamento do app pode sair da leitura do prototipo.

**Os 2 erros que fizeram a regra nascer, no mesmo dia:**

1. **Codigo de verificacao (E6.1).** Afirmei que era mock porque o Next.js valida so comprimento (`codigo.length !== DIGITOS_CODIGO`, em `wizard-dinheiro.tsx:449` e `mei/conta.tsx:350`). O Flutter faz `POST /identity/signups/verification` e **o servidor valida o valor** — `12345678` foi recusado no aparelho. A AWS **dispara e-mail de verdade** (`nao-responda@mail.legalizai.com.br`, assunto "Seu codigo de confirmacao"), entrega na caixa de entrada, 8 digitos, **expira em poucos minutos**.

2. **Campos internos.** Mandei conferir **no app** capital social, metragem, natureza juridica, quota, qualificacao 49/22, profissao, forma de atuacao e tipo de unidade. **Nao existem no Flutter** — `montar_revisao_do_dossie.dart:24-26` declara que nao entram porque sao o que a casa preenche por dentro. Busca em `lib/` nao acha `metragem`, `Produtiva`, `Pedestre` nem `20,00`.

**Why:** os dois erros tem a mesma forma — li a fonte errada com confianca de fonte certa. O prototipo continua util pra entender *intencao de tela*; ele nao e evidencia de *comportamento do app*.

**How to apply:** pra qualquer afirmacao sobre o app, a fonte e o repo do Flutter ou uma rodada no aparelho. E a verificacao e de **2 camadas**: o app prova tela, copy, navegacao e os valores que chegam a tela (`taxaDaJunta` 281.08, objeto social, preco do plano, CNAE derivado); a `api-app`/RPA prova o envio aos orgaos. Ver [[legalize-suite-teste-flutter-personas]] e [[legalize-metodo-alteracao-tela-travado]].
