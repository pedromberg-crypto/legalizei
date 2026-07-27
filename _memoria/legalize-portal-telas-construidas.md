---
name: legalize-portal-telas-construidas
description: portal interno construído (mockup) — os 4 tabs + sub-páginas + decisões de billing/guia
metadata: 
  node_type: memory
  type: project
  originSessionId: c1f12df9-c52e-4ad8-89b1-9a68f64bfb1e
  modified: 2026-07-27T15:11:30.538Z
---

Portal interno (dia-2) **construído como UI mockup/farol** (16º flow, 2026-07-27) no app `app/` (Next 16), navegável no `/mockup-home`. Sem backend, sem número fiscal ratificado. `tsc`+`eslint` limpos.

**Telas prontas (rotas em `app/src/app/(app)/(portal)/`):**
- `emitir` (NF-e: revisar→emitir sheet, ver-todos clientes, pills valor por-cliente, repetir última, corrigir-e-reemitir).
- `notas` (P5 lista-gestão) + `notas/detalhe` (P7 visualizador status-aware `?s=`). Card = componente único `components/nota-linha.tsx` (home↔P5).
- `impostos` (dashboard) + `impostos/guias` (lista P5-like) + `impostos/pagar` (VER/BAIXAR guia, status-aware por param).
- `mais` (hub) + `mais/plano` (billing) + `mais/servicos` (loja de upsells). `perfil` (só a Conta). `obrigacoes` (calendário).

**Decisões de produto travadas (duráveis):**
- **Não intermediamos pagamento de guia** por ora → mostramos/baixamos + **copiar código de barras**; pessoa paga por fora; status via reconciliação.
- **Serviço avulso não cobra na hora** → entra na PRÓXIMA FATURA (modelo Contabilizei), removível antes de fechar.
- **Débito automático do DAS** = benefício do plano mensal (não toggle solto).
- **Recalcular guia** só em guia **vencida ≥1 dia**.
- **Perfil = só Conta**; empresa/sócios/documentos/currículo → aba **Mais**.
- Número-guru fiscal por-nota fora do Emitir/Notas → vive em **Impostos** (com dado assertivo, [[legalize-preco-deferido-custo-real]] + Larissa).

**How to apply:** ao editar o portal, essas rotas já existem — consolidar/lapidar, não recriar. Review de UI é do Pedro ([[legalize-pedro-confere-ui-sozinho]]). Cards = `rounded-2xl` ([[legalize-card-radius-padrao]]).
