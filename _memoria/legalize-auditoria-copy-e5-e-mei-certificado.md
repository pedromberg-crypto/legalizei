---
name: legalize-auditoria-copy-e5-e-mei-certificado
description: "28º flow (05-06/08) — auditoria de copy E1-E4.5+E5 aplicada, E4.2b descartada, MEI trocou pergunta de contador por certificado digital"
metadata: 
  node_type: memory
  type: project
  originSessionId: b4be8b66-8eb3-43a9-876a-98f5b36f7c30
  modified: 2026-08-06T11:21:58.082Z
---

Auditoria de copy rodou nas 2 primeiras fatias do flow de entrada (E1-E4.5 abrir/migrar + E5 gate-CNAE), usando [[legalize-base-copy-insuficiente]] (agora resolvida) como régua. Achados aplicados direto no código, não só documentados: travessão removido em 12+ pontos, jargão fiscal cru traduzido, 1 promessa quebrada corrigida (E4.2 prometia comparação de imposto que a API não confirma).

**E4.2b (`/migrar/tributario`, Simples×Presumido autodeclarado) descartada** — duplicava a E3.2, que já autodeclara o regime (MEI/ME/Lucro Presumido) antes disso. Ganhou junto um CTA novo "ME · Lucro Presumido" na E3.2, roteando pra "Falar com especialista".

**Achado do Pedro, mudança estrutural no flow Migrar de MEI:** a pergunta do M2 (`/migrar/diagnostico`) trocou de "você tem contador?" pra "você já tem certificado digital?". Racional: TTRT (Termo de Transferência de Responsabilidade Técnica) transfere um contador REGISTRADO NO CRC-MG — e MEI não tem escrituração contábil obrigatória (DASN-SIMEI é autodeclaratório), então normalmente não há registro nenhum pra transferir. MEI agora nunca passa pelo M4b (`/migrar/transferencia`, TTRT), em nenhum dos 2 casos.

**Why:** "tem contador" misturava ajuda informal × responsabilidade técnica formal — só a 2ª dispara TTRT de verdade. O escopo real do MEI no app (emitir NF, gerir 1 colaborador, pagar guia) precisa de ACESSO operacional (procuração e-CAC/eSocial/prefeitura via certificado), não de responsabilidade transferida.

**How to apply:** 🟡 Hipótese assumida a pedido do Pedro, **NÃO confirmada em fonte primária** — mesma fila-Larissa do nº da resolução CFC/Evento 232 já registrada em `cruzamento-gemini-fluxo-migracao.md`. Se questionado sobre a mecânica de migração de MEI, citar como pendente de validação, não como fato fechado. Se a Larissa confirmar que MEI ÀS VEZES tem registro formal no CRC, essa decisão precisa ser reaberta.

Registrado formalmente em `marca/decisoes-marca.md` (2026-08-05, entrada "M2 do Migrar trocou tem contador por tem certificado").
