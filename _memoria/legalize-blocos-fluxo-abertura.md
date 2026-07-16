---
name: legalize-blocos-fluxo-abertura
description: Spec dos BLOCOS do onboarding/abertura (contrato Pedro↔Dev); B1+B2+B3 travados; terminologia KINAE→CNAE
metadata: 
  node_type: memory
  type: project
  originSessionId: f3ba3cc1-5370-477c-a5c9-b4635fb80441
---

Tarefa P0 "Especificar os BLOCOS do fluxo" (onde PAUSA: assinatura/externo/humano, e o que retoma). Vive na nota `execucao/blocos-fluxo-abertura.md` — contrato de interface Pedro↔Dev, com cabeçalho **Fontes-verdade** (toda decisão cita ata/doc; onde falta = 🟡 pendente). Lapidação bloco a bloco (Pedro + Claude).

**Terminologia:** "KINAE" (transcrição Plaud) foi **aposentado → CNAE** (principal/secundário) em 14/07. Não é conceito distinto. Não reintroduzir.

**Bloco 1 — Porta/Qualificação (travado 14/07):** binário "é pra gente?"; conta criada DEPOIS do 🟢; mapeamento CNAE = **mini-loop com score de confiança** + desambiguação obrigatória quando cruza a linha atende/não → persistindo dúvida vai pra **humano**, nunca 🔴 automático (falso 🔴 = pior erro, perde pagante). Filtro por regime = whitelist ~300 (serviço+Simples+não-regulada). Roteamento: 🟢→B2 · 🟡 regulamentada→**waitlist do produto** · 🔴 não atende→**comercial do Mauro (tradicional)**. Pendência: **Mapa de Confusão CNAE** (pares traiçoeiros de desambiguação) = deferido.

**Bloco 2 — Coleta+Enquadramento/IACA (travado 14/07):** output = "dossiê de constituição" (Fase 0+1 Izabela). IA recomenda natureza jurídica (default SLU solo); ordem do wizard = simulador cedo (candidato a A/B); secundários = IA sugere + pill de prova social; **faturamento = faixa guiada + default cruzando CNAE+sócios** (NÃO campo aberto — faturamento não é campo legal, só input de simulação). Motor Fator R (≥28%→Anexo III 6% × V 15,5%) + transparência de custo. Sem pausa externa (só salvar&retomar).

**Bloco 3 — Cobrança/gateway (travado 14/07):** abertura "grátis" (espelha líder), **1ª mensalidade = 1º mês**; taxas de governo = repasse à parte, não reembolsável; gateway **Asaas**; vitrine mostra só o mensal (price framing); boleto aceito fora do happy path. **Política de cancelamento = 4 camadas** (antídoto do "cancela e ganha CNPJ de graça"): autorização expressa de início (ativa exceção CDC art.49 p/ serviço exaurido) + taxa não reembolsável + fidelidade/multa ancorada na emissão do CNPJ (benchmark Contabilizei 12m+30%, **prazo 🟡 a definir**) + só constituir após pagar. Estados: aguardando-assinatura→aguardando-pagamento→pago (webhook Asaas idempotente).

**Próximo:** Bloco 4 (constituição) → certificado → portal. **Pendências:** prazo da fidelidade (Pedro depois); redação jurídica do contrato+termo de início (Mauro/Larissa); 🟡 Larissa (anexos diferentes) bloqueia parte do motor B2; Mapa de Confusão; confirmar que doc de abertura não capta receita estimada. Ver [[legalize-mlp-nao-mvp]], [[legalize-benchmark-padrao-195]], marcos `2026-07-14-blocos-b1-b2-especificados` e `2026-07-14-bloco-3-cobranca`.
