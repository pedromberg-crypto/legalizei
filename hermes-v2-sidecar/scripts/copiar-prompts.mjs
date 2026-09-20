// Copia os markdowns que o `router.ts` le ao lado de si para a saida
// compilada. Sem isto, `.build/router.js` nao acha PERSONA.md nem RULES.md.
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = dirname(dirname(fileURLToPath(import.meta.url)))
const destino = join(raiz, '.build')
mkdirSync(destino, { recursive: true })
for (const arquivo of ['PERSONA.md', 'RULES.md']) {
  copyFileSync(join(raiz, arquivo), join(destino, arquivo))
}
console.log('prompts copiados para .build/')
