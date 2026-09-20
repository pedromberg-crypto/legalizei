# Como rodar

O Node nao remapeia `./x.js` para `./x.ts` ao carregar tipos direto, e o
TypeScript com `NodeNext` exige a extensao `.js` no import. Entao os testes
rodam sobre a saida compilada, em vez de sobre o `.ts`:

```bash
# 1. compila para .build/ (ignorado pelo git)
../app/node_modules/.bin/tsc -p tsconfig.build.json
cp PERSONA.md RULES.md .build/

# 2. offline, sem banco e sem chave de LLM
node --test .build/testes/router.test.js

# 3. com banco
DATABASE_URL=postgres://... node --test .build/testes/db.test.js
```

⚠️ O passo `cp` existe porque o `router.ts` le `PERSONA.md` e `RULES.md` ao lado
de si. Num `package.json` de verdade isso vira um script de build.

## O que cada suite prova

`router.test.ts` roda **offline**. Prova a precedencia das quatro saidas e a
trava comercial. O teste obrigatorio (`falha tecnica: o sidecar NAO roda`) conta
as **chamadas ao LLM**, nao so o texto: um teste que olhasse so a resposta
passaria mesmo com o sidecar rodando e devolvendo vazio por acaso.

`db.test.ts` **exige banco**, e sem `DATABASE_URL` ele PULA em vez de passar.
Suite verde sem ter rodado nada e pior que suite vermelha, porque mente com cara
de prova. Ele confere a conta do DAS centavo por centavo, sem nenhum LLM.
