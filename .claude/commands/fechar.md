---
description: Ritual de fecho de flow no vault Legalizai Story Book — atualiza estado, registra decisões, commita e empurra
---

Ritual de FECHO de flow no vault do Legalizai Story Book. Faça, nesta ordem, só o que de fato aconteceu no flow (não invente estado):

1. **`HOME.md` → `## 📍 Agora`:** atualize o estado das frentes que mudaram, o que ficou aberto / o próximo passo, e a linha "Última atualização: <data de hoje>".
2. **Decisão travada?** Registre no ADR `marca/decisoes-marca.md` e/ou crie um marco em `execucao/marcos/AAAA-MM-DD-<slug>.md`.
3. **Fato durável cross-sessão?** Atualize a auto-memória do projeto (e o `MEMORY.md`).
4. **Rendeu item de reporte?** Atualize `execucao/mauro/evolucao-para-mauro.md` (tabela interna + bloco WhatsApp). **Depois de escrever, rode `node execucao/mauro/gerar-placar-mauro.mjs`** — ele reconta o placar do topo (entregas, status, dias trabalhados) a partir das tabelas. 🔑 O bloco entre `PLACAR:INICIO` e `PLACAR:FIM` é **gerado**: nunca editar à mão, nunca digitar número lá.
5. **Git:** `git add -A && git commit` com mensagem clara e `git push`. A assinatura vai no fim da mensagem, **com o modelo que está rodando de fato** (hoje, 12/09, é o Opus 5) e a linha da sessão:

   ```
   Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
   Claude-Session: https://claude.ai/code/session_<id>
   ```

   ⚠️ Este arquivo dizia `Opus 4.8` até 12/09, quando o repo já assinava Opus 5 havia dias. Se a sua sessão rodar em outro modelo, **assine o seu** e corrija esta linha em vez de copiar o exemplo.
6. Confirme, em 1 linha, que está seguro fechar e que a próxima janela deve abrir com `/boot`.

🔴 **Nada de veredito 🪟 de saúde da janela** (revogado em 04/09, pedido do Pedro, e este comando ficou pedindo até 12/09). A janela é ~1M e ele acompanha a barra sozinho. Continua valendo só a parte silenciosa do `CLAUDE.md`: se você se pegar repetindo, perdendo o fio ou entrando numa 2ª compactação, **diga isso em uma linha** — como fato, não como carimbo de rotina.

Seja sucinto. Anti-guru: só registra o que aconteceu, com fonte quando for dado.
