---
tipo: hub
status: vivo
data: 2026-09-09
assunto: frente-funcionalidades
autoridade: fonte-verdade
tags: [produto, hub, funcionalidades]
---

# 🧱 Produto — a fonte-verdade das funcionalidades

> **O que é esta pasta.** O lugar único onde mora **o que o app faz, por que faz, e como faz**. Nasceu em 09/09/2026, quando o teardown de pró-labore mostrou que uma funcionalidade só estava espalhada por seis pastas diferentes.
>
> **Acima daqui:** `CLAUDE.md` da raiz e [[HOME]] continuam mandando no projeto. Esta pasta manda **no produto**.

---

## 🧭 Por que existe (o diagnóstico que a criou)

O vault está organizado por **fonte**: `pesquisa/` guarda o que veio de fora, `execucao/` o que a gente fez, `marca/` o que a gente decidiu. Isso funciona bem pra quase tudo.

Não funciona pra funcionalidade. Uma funcionalidade tem seis facetas, e elas caíam em seis pastas:

| Faceta | Onde caía antes |
|---|---|
| o que o líder faz | `pesquisa/concorrentes/contabilizei/` |
| onde entra no catálogo | `execucao/portal/funcionalidades-me-simples.md` |
| a lei e o prazo | `pesquisa/rotina-fiscal/` |
| de que API depende | `pesquisa/integracoes-apis/` |
| que tela nossa cobre | `execucao/portal/matriz-portal-interno.md` |
| a decisão travada | `marca/decisoes-marca.md` |

Ninguém respondia *"como está o pró-labore?"* sem abrir seis arquivos. **Aqui a unidade de organização é o objeto (a funcionalidade), não a fonte.**

---

## 🗺️ Como esta pasta se lê

| Arquivo | Manda em | Não manda em |
|---|---|---|
| **[[_catalogo]]** | quais funcionalidades existem · a cobertura de cada uma (✅🟡🔴⚪) · o balde de monetização | como automatizar |
| **[[_matriz-dependencia]]** | de que terceiro cada uma depende · o que sabemos do caminho técnico | se a funcionalidade existe |
| **[[_metodo]]** | como se faz um teardown · a regra de navegação na conta do líder | conteúdo de funcionalidade |
| **[[_mapa-de-cruzamentos]]** | **como as funcionalidades se conectam** · a cadeia fiscal inteira · o calendário consolidado | o desenho de uma funcionalidade isolada |
| `funcionalidades/<nome>.md` | **o nosso desenho.** Spec viva, é o que o dev implementa | o que o concorrente faz |
| `evidencias/<data>-<fonte>-<tema>.md` | o que foi **observado**, com data | o que a gente vai fazer |

### 🔑 A separação que mais importa

**`funcionalidades/` é decisão viva. `evidencias/` é foto com data.**

O teardown do líder envelhece sozinho: a Contabilizei muda a tela e a nota vira mentira sem avisar. Nosso desenho não envelhece pelo mesmo motivo. Misturar os dois num arquivo só significa que, em seis meses, metade dele mente e ninguém sabe qual metade.

Então: **a spec manda, a evidência é fonte.** É a mesma doutrina do [[indice-autoridade]], aplicada a esta frente.

---

## 📍 Estado da frente

**Catálogo:** 51 funcionalidades mapeadas (§1–7 mais o à-la-carte), 31 construídas em mockup.
**Matriz:** 23 dependências externas. Placar de 09/09: 🟢 16 · 🟡 3 · 🔴 4.

### Os 4 vermelhos, que são o trabalho real

| # | O que é | Por que trava |
|:--:|---|---|
| **2.4** | Saber que o imposto foi pago sem perguntar | Maior buraco do produto. É decisão de **arquitetura**, não de fornecedor |
| **5.7** | Monitorar o DTE-SN | Ciência presumida em 45 dias, 30 pra regularizar. **Único ponto onde o silêncio custa a empresa do cliente** |
| **8.4** | Alvará (ALF PBH) | Municipal, sem caminho mapeado |
| **8.5** | CPOM | Idem |

### 🔴 Dois prazos correndo, e não são de código

- **Simples Híbrido: opção até 30/09/2026.** Decisão de negócio com o Mauro.
- **Emissor Nacional de NFS-e obrigatório em 01/11/2026.** Se a gente pretende emitir nota em produção este ano, é essa data que manda no roadmap.

---

## 📚 Funcionalidades destrinchadas

| Funcionalidade | Spec | Evidência | Estado |
|---|---|---|---|
| **Pró-labore** | [[pro-labore]] | [[2026-09-09-contabilizei-pro-labore]] | 🟢 desenho fechado, motor a construir |
| **Alíquota e enquadramento** | [[aliquota-e-enquadramento]] | [[2026-09-09-contabilizei-aliquotas]] | 🟢 desenho fechado · 🔴 tabela do IRRF não ratificada |
| **Emitir nota fiscal** | [[emitir-nota-fiscal]] | [[2026-09-09-contabilizei-nota-fiscal]] | 🟢 desenho fechado · 🔴 prazo 01/11/2026 e de-para NBS inexistente |
| **A guia de imposto** | [[guia-de-imposto]] | [[2026-09-09-contabilizei-guia-imposto]] | 🟢 desenho fechado · 🔴 2.4 é decisão de arquitetura, não descoberta |
| **Compliance e rotinas** | [[compliance-e-rotinas]] | [[2026-09-09-contabilizei-central-rotinas]] | 🟢 desenho fechado · 🔴 DTE-SN (5.7) sem caminho |

🔗 **[[_mapa-de-cruzamentos]]** — como as funcionalidades se puxam. Nasceu em 09/09, quando pró-labore e alíquota chegaram **no mesmo número (37,72%) por caminhos diferentes** e ninguém tinha notado. Toda spec fiscal agora abre com uma seção **Cruzamentos declarados**; a regra está no [[_metodo]], passo 7.

### Fila, na ordem sugerida

✅ **Já feitos (5):** [[pro-labore]] · [[aliquota-e-enquadramento]] · [[emitir-nota-fiscal]] · [[guia-de-imposto]] · [[compliance-e-rotinas]].

🔗 **O ciclo mensal está fechado e o estado agregado também:** nota entra → alíquota precifica → pró-labore ajusta → guia sai → compliance diz se está tudo em dia.

1. **Extrato bancário / movimentações** — a matéria-prima do fechamento contábil e a **porta da 2.4**. O líder tem **duas pendências só pro ciclo de vida da integração**, o que mostra o peso. É a última peça de dado que entra no ciclo.
2. **§6 · Documentos e certificado** — o A1 é pré-condição de tudo e já apareceu como campo em **5 payloads**, sempre com `diasParaVencimento`.
3. **Consultar e cancelar nota** — fecha a NF, e tem a divergência de prazo aberta (730 dias × "mesmo mês").

🔴 **Fora da fila, porque não é descoberta:** a **2.4** não sai de teardown. Já sabemos a resposta do líder (lote mensal + trilho próprio). É **decisão de arquitetura e de negócio**, e precisa do Pedro e do Mauro, não de mais uma passada.

---

## Links
[[HOME]] · [[BASE-ESTRATEGICA]] · [[indice-autoridade]] · [[decisoes-marca]] · [[matriz-portal-interno]] · [[cruzamento-portal-interno]] · [[2026-07-21-dossie-plataforma-logada]]
