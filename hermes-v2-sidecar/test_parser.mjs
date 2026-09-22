import { parsearCartoes } from './.build/seed/carregar-conhecimento.js';

const markdown_valido = `
### 1.1 · Titulo Valido
\`secao: xyz\` · \`promessa: pode\`
**Estado.** 1
**Ação.** 2
**Restrição.** 3
`;

const markdown_invalido = `
### 1.2 · Titulo Invalido
\`secao: xyz\` · \`promessa: pode\`

Este texto vai ser descartado sem avisar!

**Estado.** 1
**Ação.** 2
**Restrição.** 3
`;

console.log("Testando valido:");
try {
  parsearCartoes(markdown_valido);
  console.log("OK!");
} catch (e) {
  console.error("FALHOU VALIDO:", e.message);
}

console.log("Testando invalido:");
try {
  parsearCartoes(markdown_invalido);
  console.log("FALHOU: Nao jogou erro!");
} catch (e) {
  console.log("OK JOGOU ERRO:", e.message);
}
