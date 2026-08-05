---
name: legalize-pesquisa-grande-via-gemini
description: "Pesquisa de mercado de escopo grande roda via prompt otimizado pro Google Search do Gemini, executado fora pelo Pedro — não pesquisar direto na sessão."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: ec340b0b-6fec-4cbe-a29d-f5be1f63d070
  modified: 2026-08-05T17:53:15.239Z
---

Regra de trabalho travada 05/08: sempre que a tarefa precisar de pesquisa de mercado ampla (demografia, comportamento, benchmark de mídia/CAC, dado setorial), a resposta correta NÃO é tentar pesquisar dentro da sessão do Claude Code — é gerar um prompt denso e bem estruturado (com instrução de citar fonte+data+confiança por dado, formato anti-guru do vault) pra rodar no Gemini com Google Search ativado. O Pedro roda fora, salva o `.md` em Downloads, e cola de volta pra análise.

**Why:** Gemini com grounding de busca traz pesquisa mais profunda e atualizada do que buscas pontuais dentro da sessão; separa bem os papéis (eu estruturo a pergunta certa, ele roda a ferramenta certa, eu analiso e integro).

**How to apply:** ao identificar necessidade de pesquisa de mercado grande (não pesquisa pontual de 1-2 fatos), montar o prompt no formato usado 2x com sucesso em 05/08 (blocos numerados, pedido de fonte+data+confiança, seção final de lacunas) e entregar pro Pedro rodar — não usar WebSearch/WebFetch direto pra isso. Usado em: perfil demográfico do microempreendedor ([[legalize-estrategia-marketing-completa]]) e benchmark de tráfego pago do nicho contábil.
