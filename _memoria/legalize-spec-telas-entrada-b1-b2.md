---
name: legalize-spec-telas-entrada-b1-b2
description: "Spec campo a campo das telas Entrada+B1+B2 (input/validação/margem/IA) + mapa de telas (temos 1-6, faltam 8 B2 + 6 B3); nota spec-telas-entrada-b1-b2.md."
metadata: 
  node_type: memory
  type: project
  originSessionId: 2b138de1-6d80-46f8-901a-58ce799ebff4
---

Spec funcional das telas do fluxo de abertura, nível campo/input/validação/microdetalhe, travada 2026-07-15. Nota: [[spec-telas-entrada-b1-b2]]. Cobre Entrada + B1 (gate-cnae + login) + B2 (2.1→2.9). NÃO cobre B3 ainda.

**Mapa de telas** ([[mapa-telas-mobile]]): protótipo tem telas 1–6 (entrada + B1 + `fase-0-dados-socio`). Faltam 8 do B2 (2.2→2.9) + 6 do B3 (checkout). B4+ nem specado.

**3 adições travadas nesta rodada:**
- **Limite de sócios = 3 no total** (1 + 2 adicionais), espelha Contabilizei. 🟡 confirmar se é 3 ou 2 (Pedro).
- **Upsell endereço fiscal:** add-on ~R$60/mês (🟡 preço nosso). NÃO bloqueia o fluxo; salva flag no dossiê; injeta automático no plano do B3. Resolve gargalo "sem endereço comercial".
- **CPF valida situação cadastral** (existe/regular na Receita), não só dígito verificador. 🟡 provider (Serpro/InfoSimples/CNPJá, mesmo pool do cartão CNPJ).

**Padrões transversais:** barra de progresso persistente · salvar & retomar em qualquer ponto do B2 · altura sem scroll (`100dvh`+`min-h-0`) · sem travessão · erros inline (microcopy que ensina).

🟡 Pendências: limite sócios · preço endereço fiscal · provider CPF · valores fiscais vigentes (salário mín, teto INSS) · política de senha.

Deriva de [[legalize-blocos-fluxo-abertura]]. Ver [[legalize-motor-testes-arquitetura]] (como testar) e [[casos-teste-fluxo-cnae]] (personas).
