---
tipo: marco
data: 2026-07-14
tags: [marco, produto, spec, blocos, cobranca, decisao]
---

# 🧩 Marco — Bloco 3 (Cobrança) especificado + benchmark Padrão R$195

> Fecho do flow de 14/07 (2º do dia). Especificação do **Bloco 3 (cobrança/gateway)** no [[blocos-fluxo-abertura|spec de blocos]] + doc travado do plano de referência do líder. Continuação de [[2026-07-14-blocos-b1-b2-especificados]].

## O que travou

**Bloco 3 — Cobrança** (5 decisões):
- **D1 — o que se cobra:** abertura "grátis" (espelha Contabilizei); **1ª mensalidade = 1º mês** do cliente (não é setup à parte); taxas de governo = repasse à parte, guia separada, **não reembolsável**; certificado incluso.
- **D2 — gateway: Asaas** (travado).
- **D3 — vitrine mostra só o mensal** (price framing / âncora — segue o líder).
- **D4 — boleto aceito, fora do happy path** (compensa 1–3 dias, atrasa abertura; cartão/Pix destravam na hora).
- **D5 — política de cancelamento em 4 camadas** (blindagem do "cancela e ganha CNPJ de graça"):
  1. **autorização expressa de início** antes de constituir → ativa a exceção do CDC art. 49 (serviço exaurido com anuência não gera arrependimento devolutivo);
  2. **taxas de governo não reembolsáveis** (repasse ao Estado);
  3. **fidelidade + multa proporcional** ancorada na emissão do CNPJ (benchmark Contabilizei: 12m + 30% sobre parcelas restantes) — **prazo 🟡 a definir**;
  4. **só constituir (B4) depois do pagamento confirmado** (já é o desenho do fluxo).

**Máquina de estados B3:** `aguardando-assinatura` → `aguardando-pagamento` → `pago` (só `pago` destrava B4); webhook Asaas idempotente.

## Base de evidência (anti-guru)
- **CDC art. 49:** 7 dias de arrependimento em contratação fora do estabelecimento; exceção jurisprudencial p/ serviço já executado com autorização. 🟢 regra / 🟡 exceção (caso a caso). Fontes: Galícia Educação, Jurídico.ai, Migalhas.
- **Benchmark de cancelamento:** [Contajá](https://contaja.com.br/politica-de-cancelamento-e-estorno/) (7d depois recusa estorno) + Contabilizei (fidelidade 12m + multa 30%).
- **Modelo de cobrança + escopo:** teardown [[2026-07-14-escopo-servico-mensalidade]] ("abertura grátis — paga só as taxas do governo").

## Entregável paralelo — DOC travado do plano de referência
[[plano-padrao-195-referencia]] — escopo exato do plano **mais barato** da Contabilizei (Padrão R$195, o mais barato) como **régua do MLP**. Inclui contabilidade completa, serviços financeiros, **mecânica de pró-labore** (INSS 11% teto R$932,31, IRRF > R$5.000 — números da UI deles, validar vs. lei/reforma 2026), avulsos e **8 lacunas auditadas** com Pedro. Alertas: prazo de abertura **não divulgado** pelo líder (🔴 oportunidade), app mobile fraco.

## Pendências que ficaram
- Prazo da fidelidade (12m? menos?) — Pedro decide depois.
- Redação jurídica: contrato-como-produto + termo de início de serviço → Mauro/Larissa.
- Custos reais de terceiros (DARE JUCEMG, certificado A1) pro repasse.
- Nº de guias de pró-labore por "2 sócios grátis" · prazo de migração · IRPF do sócio.

## Próximo
**Bloco 4 (constituição):** DBE → JUCEMG → assinatura GOV.BR → registro → CNPJ → CRC → certificado A1 → NFS-e. Pausas externas pesadas.

## Links
- [[blocos-fluxo-abertura]] · [[plano-padrao-195-referencia]] · [[2026-07-14-escopo-servico-mensalidade]] · [[2026-07-14-blocos-b1-b2-especificados]] · [[HOME]]
