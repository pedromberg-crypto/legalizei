---
name: legalize-api-antes-de-funcionalidade
description: "08/09: não discutir funcionalidade sem saber que API existe; matriz de dependência externa em produto/me/viver/_matriz-dependencia.md tem 24 deps, 10 sem resposta"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: b04232d3-1d88-4ff0-a086-83edf7ab4826
  modified: 2026-09-09T11:44:08.984Z
---

Antes de detalhar, priorizar ou prometer funcionalidade do portal, verifique se
ela **depende de alguém de fora**. O Pedro parou a análise no meio pra isso:
*"não adianta a gente falar de todas essas funcionalidades sem de fato validar
o que temos de API disponível realmente"*.

A **matriz de dependência externa** vive em
`produto/me/viver/_matriz-dependencia.md` (era `execucao/portal/funcionalidades-me-simples.md`, movida em 09/09). Regra de entrada dura: **só
entra o que depende de terceiro** (órgão, provedor, parceiro). O que se resolve
com dado interno + programação fica fora — já está resolvido, é só construir.

**Why:** eu tinha escrito uma coluna "como automatizar" cheia de 🤖 que eram
hipóteses não testadas. Discutir escopo em cima disso leva a prometer o que um
órgão trava. Das 51 funcionalidades, 23 dependem de fora.

⚠️ **Placar recontado em 09/09** pela verificação fiscal em fonte primária: era
🟢8 · 🟡6 · 🔴10, virou **🟢16 · 🟡3 · 🔴4**. Os 4 vermelhos: 2.4 (status de
pagamento) · 5.7 (DTE-SN) · 8.4 (alvará) · 8.5 (CPOM).

**How to apply:**
- Os 2 que decidem o produto: **emitir NFS-e (3.1)** e **emitir a guia do DAS
  (2.2)**. Sem os dois não existe app de contabilidade, existe painel bonito.
  Nenhuma decisão de §2 ou §3 antes deles.
- **JUCEMG não tem API** (09/07, reconfirmar). Isso atinge os 3 avulsos mais
  caros do catálogo (alteração contratual, baixa, alteração de porte). Se
  seguir assim, são humanos e o preço tem que refletir.
- **InfoSimples é quase só consulta, não emite** — serve pra CND, pendências,
  dados do CNPJ e autopreencher tomador. Ver [[legalize-mei-obrigacoes-e-apis]].
- Marque 🟢 confirmado / 🟡 indício / 🔴 não sabemos, e **nunca** deixe hipótese
  passar por plano. Isso é a regra anti-guru aplicada a fornecedor.
