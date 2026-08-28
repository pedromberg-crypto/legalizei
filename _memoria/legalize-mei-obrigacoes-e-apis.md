---
name: legalize-mei-obrigacoes-e-apis
description: Obrigações operacionais do MEI pesquisadas e fechadas (2 rodadas cruzadas) + o que InfoSimples cobre e o que não cobre de API
metadata: 
  node_type: memory
  type: project
  originSessionId: 6ed7f6b2-cb26-40c5-a32b-e0efe1f43415
  modified: 2026-08-28T02:37:24.799Z
---

Pesquisa de obrigações pós-constituição do MEI fechada em 27-28/08, 2 rodadas independentes cruzadas (própria via WebSearch/WebFetch + Gemini rodada pelo Pedro). Fonte-verdade: `pesquisa/obrigacoes-operacionais/mei-obrigacoes-operacionais.md`.

**2 achados que mexem com produto:**
1. **NFS-e Nacional obrigatória pro MEI desde 01/09/2023** (Res. CGSN 169/2022 → 171/2022 → 172/2023), via API federal única gov.br/nfse, **sem certificado digital**, municípios **proibidos** de manter emissão local (BH confirmado: Portaria SMFA 042/2023 bloqueou o BHISS). Não precisa integração por prefeitura.
2. **Não existe ferramenta oficial de monitoramento do teto de faturamento do MEI.** Manual, sem alerta de proximidade. Confirmado nas 2 rodadas — é o diferencial mais forte do portal MEI.

**Cobertura de API (InfoSimples checado ponto a ponto em 27/08 — quase tudo é CONSULTA, não emissão):**

| Resolve | NÃO resolve |
|---|---|
| CNPJ/situação fiscal · MEI/Simples cadastral · **status** da DASN-SIMEI · DAS-MEI (RPA que puxa boleto) · guia de parcelamento · FGTS/Guia de Arrecadação · NFS-e **por chave de acesso** | **Emitir NFS-e nova** (exige API oficial gov.br/nfse direta, mTLS+ICP-Brasil, ou parceiro tipo Focus NFe/Nota Gateway) · **eSocial** (zero cobertura, Dataprev descontinuou) · **Transmitir** DASN-SIMEI (nem InfoSimples nem API oficial) |

Consultas InfoSimples por RPA (DAS-MEI, FGTS) **exigem credencial do próprio cliente** (CPF+senha gov.br ou certificado pkcs12) — não é puxar sem o cliente autorizar. URLs e parâmetros de cada endpoint estão salvos em `pesquisa/obrigacoes-operacionais/mei-mapeamento-funcionalidades.md`.

**Why:** determina o que é construível de verdade no portal MEI e o que depende de fornecedor/credenciamento externo — é o que separa funcionalidade de promessa.

**How to apply:** antes de prometer automação de qualquer obrigação do MEI, cheque nessa tabela se existe API. Emissão de NF e eSocial são os 2 gargalos reais. Ver [[legalize-portal-drift-mei]] e [[legalize-apis-orgaos-autoridade]].
