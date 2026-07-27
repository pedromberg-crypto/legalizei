---
name: legalize-portal-telas-construidas
description: portal interno construído (mockup) — os 4 tabs + sub-páginas + decisões de billing/guia
metadata: 
  node_type: memory
  type: project
  originSessionId: c1f12df9-c52e-4ad8-89b1-9a68f64bfb1e
  modified: 2026-07-27T19:42:31.076Z
---

Portal do cliente (dia-2) **construído como UI mockup/farol** (16º+17º flow, 2026-07-27) no app `app/` (Next 16), navegável no `/mockup-home`. Sem backend, sem número fiscal ratificado. `tsc`+`eslint` limpos. **17º flow: MLP do portal FECHADO** — as 19 telas do backlog existem, sem stub.

**Telas prontas (rotas em `app/src/app/(app)/(portal)/`):**
- `emitir` (NF-e) · `notas` + `notas/detalhe` (P7 `?s=`) · `impostos` (dashboard) + `impostos/guias` + `impostos/pagar` (VER/BAIXAR guia) + **`impostos/aliquotas`** (P4: alíquota efetiva + Fator R + "número vivo").
- `mais` (hub) + `mais/plano` + `mais/servicos` (loja, deep-link `?abrir=<id>` abre o sheet do serviço) + **dobra Sua empresa** (`mais/empresa` c/ copiar-por-dobra e copiar-tudo WhatsApp · `mais/socios` · `mais/documentos` · `mais/certificado`) + **dobra Contabilidade** (`mais/em-dia` = painel de conformidade · `mais/relatorios` · `mais/declaracoes`).
- **`avisos`** (central de notificações; sino no header da home). **`blog`** + **`blog/post`** (hero full-bleed sob notch, sugeridos no fim, curtir+compartilhar). **`home-dia1`** (home de ativação). **`pro-labore`** (P8+P9 interativo, reusa `lib/fiscal`). `perfil` (só a Conta) · `obrigacoes`.

**Decisões de produto travadas (duráveis):**
- **Não intermediamos pagamento de guia** → mostramos/baixamos + copiar código de barras.
- 🔴 **Serviço avulso = solicitação EFETIVA, NÃO removível** (revertido 27/07): pedir contrata (trabalho começa na hora) → cai efetivo na próxima fatura, chip "Em andamento/Recalculando", **double-check** obrigatório. (Antes eu dizia "removível" — ERRADO, corrigido.)
- **Dobras do Mais = página, não acordeon; honestidade antes do toque** (mudança cadastral/contratual = serviço pago).
- **Certificado no dia-1 (abertura) = parceira valida por videochamada, não upload** (transfer = upload); tela de validação sem navbar + perfil desativado.
- **Pró-labore = interativo "sai do bolso" (imposto+INSS)**, sugestão mira 30%, avisa borda/Anexo V.
- **Débito automático** = benefício do plano · **Recalcular guia** só em vencida ≥1 dia · **Perfil = só Conta** · número-guru fiscal só em Impostos.

**Falta (é FLOW, não página):** 🔴 flow #2 (migração/transferência) · settings menores de Conta (e-mail/senha) deferíveis.

**How to apply:** ao editar o portal, essas rotas já existem — consolidar/lapidar, não recriar. Review de UI é do Pedro ([[legalize-pedro-confere-ui-sozinho]]). Cards = `rounded-2xl` ([[legalize-card-radius-padrao]]).
