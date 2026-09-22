---
name: legalize-bancada-pedro-personas
description: "21/09 - nasce test/integracao/pedro_personas/ no repo Flutter: 24 roteiros gerados do vault, registro de rodadas versionado, e o personas_20_test.dart partido em 8 blocos. Tres achados medidos, entre eles TRES elencos divergentes com o mesmo rotulo pNN."
metadata: 
  node_type: memory
  type: project
  originSessionId: 12f65b6f-b033-4e22-b604-b0ad37e11175
  modified: 2026-09-21T18:31:32.711Z
---

A bancada das personas mora em `test/integracao/pedro_personas/` no repo Flutter (`pessoal/App Testes/front-end-app`), criada a pedido do Pedro em 21/09/2026. Ela junta o que estava espalhado: **o caso** (`roteiros/`, 24 arquivos gerados do vault por `ferramentas/gerar-roteiros.mjs`), **o que aconteceu** (`rodadas/`, com `ACHADOS.md`) e **os testes** (`harness/` + 8 `bloco_*_test.dart`, partidos das 2.521 linhas do `personas_20_test.dart` por `ferramentas/partir-personas.mjs`). `flutter analyze` na pasta: **No issues found**.

✅ **B-001 nasceu e fechou no mesmo dia. Existiam TRÊS elencos com o rótulo `pNN`, e não batiam.** A spec do vault diz que P01 é *Bruno Almeida Souza*, CPF `107.654.321-96`; o `test/suporte/personas.dart` diz que p01 é só um número com e-mail `pedromberg+p01@gmail.com`; o `personas_20_test.dart` diz que p01 é *Ana Ribeiro*, CPF `111.000.000-62`, caixa `legalizeiapp+p01@gmail.com`. São **duas caixas de e-mail reais diferentes** recebendo o código de 8 dígitos. **Decisão A do Pedro, 21/09: o vault manda** — o elenco de lá carrega o porquê de cada persona (CNAE, anexo, cobertura das 14 categorias, desfecho), o do teste tinha só nome e CPF. Aplicado por `ferramentas/alinhar-personas-com-o-vault.mjs`, que lê a spec e reescreve o mapa `personas` do harness: 20 -> **24** personas, caixa `legalizeiapp` -> `pedromberg`. 🔑 Mudar persona agora e mudar a SPEC e rodar o script; editar o Dart a mao recria a divergencia. O script morre se a spec nao devolver exatamente 24. ⚠️ Segue aberto: os CPFs sao sinteticos com DV valido, e DV valido nao garante que o CPF nao pertence a ninguem.

Os outros dois: **B-002** — o `ESTADO_PERSONAS` tem como padrão um caminho absoluto do scratchpad de outra pessoa (`/tmp/claude-1000/-home-natanael-…`), então em qualquer outra máquina toda rodada recomeça do zero; **B-003** — o cabeçalho do `personas_20_test.dart` manda rodar com `--dart-define=BLOCOS=A` e **não há `String.fromEnvironment('BLOCOS')` no arquivo**: quem segue o comando documentado roda a suíte inteira contra a API dev e queima os CPFs de todas.

🔑 **Por que o registro de rodada nasceu dentro do repo:** o `docs/achados/` (ledger A-001…A-009, o relatório da P01 e 13 evidências, 2,4 MB) sumiu ao igualar a `main` local ao remoto, sem nunca ter sido pushado. Por isso o ledger novo começa em **B-001** — reusar a letra `A` faria achado novo carregar número de achado perdido. Ver [[legalize-suite-teste-flutter-personas]].

⚠️ **O `personas_20_test.dart` original NÃO foi apagado** — é repo compartilhado com o Natanael. Enquanto os dois existirem, `flutter test --tags integracao` sem caminho roda tudo **duas vezes** contra a API dev. Apagar é a última etapa e é decisão de quem mantém o repo.

## 🔧 22/09 — a frente do MOTOR DE TESTES

🔴 **A rodada manual da P01 custou US$ 340 medidos** (66 capturas, 435 turnos, 166 M de cache read: imagem nao sai do contexto e e relida a cada turno). 63% do custo e dirigir a tela por `adb tap` em coordenada deduzida de screenshot. Com 24 personas seriam ~US$ 8.160, e o Pedro precisa de centenas de rodadas — entao o alvo e **US$ 0 por rodada**, com o modelo entrando so quando aparece divergencia NOVA.

**Desenho: 4 aneis, modelo so no ultimo.** ✅ Anel 2 (`ferramentas/conferir-banco.mjs`, 11 consultas, PII mascarada) e ✅ anel 3 (`montar-relatorio.mjs`, placar + ✅/🔴 automaticos) **estao prontos e rodam a custo zero** — na P01 deram 40 ✅ em 4 segundos. 🔴 O anel 1 (dirigir a UI sem modelo) nao fechou: o teste parou no `E3.3` e **o banco provou que a rede nunca saiu da maquina** (nenhum lead da p02), porque `HttpOverrides.global = null` no `setUpAll` nao alcanca a *zone* do `testWidgets`.

🔑 **O anel 2, na 1a execucao, derrubou duas afirmacoes da rodada manual:** o dossie NAO e mock (C0/C1/C3/C4/C7 gravam; 11 linhas de progresso, nao 3) e abriu o **B-016** — 7 valores que ninguem digitou (capital R$10.000, 20 m², atividade inocua) indo ao contrato social. Errata escrita no topo do relatorio.

⚠️ **O teto deixou de ser token e virou AMBIENTE:** 5 leads/hora por IP, CPF `@unique` (queima so depois do `E6`, achado B-005), e dados acumulando no dev. Sem identidade rotativa e limpeza, o motor fica pronto e esbarra em `Retry-After: 3600`.

📌 **Estado completo, fila e a pergunta aberta** (dá para abrir tela do meio com estado injetado, sem percorrer o funil?) em `test/integracao/pedro_personas/MOTOR-ESTADO.md`, no repo Flutter. Retomar essa frente = ler aquele arquivo primeiro.
