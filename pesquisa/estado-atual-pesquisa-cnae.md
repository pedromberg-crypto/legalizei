---
tipo: estado
status: vivo — atualizar sempre que este processo avançar
data: 2026-08-27
assunto: estado-pesquisa-cnae
tags: [pesquisa, cnae, torre-de-controle]
---

# 📍 Onde estamos — aprofundamento de CNAE

> Nota de estado deste processo específico (reclassificar/aprofundar CNAE). Abriu sessão nova aqui em `pesquisa/`? Lê esta nota primeiro — ela conta onde paramos e qual é o próximo passo, sem precisar do histórico da conversa anterior.
>
> 🔀 **Mudança estratégica (27/08):** esta nota mora em `pesquisa/` (não dentro de `cnae-matriz/`) de propósito — o conteúdo em si (`fundamentos-cnae.md`, o prompt) continua em `cnae-matriz/`, mas o ponto de entrada fica um nível acima porque o próximo passo real é **cruzar CNAE com o teardown dos concorrentes** (`pesquisa/concorrentes/`), que é irmã de pasta daqui. Mais fácil linkar os dois quando a sessão abre já na raiz de `pesquisa/`.

## Por quê

A pesquisa original de CNAE (`cnae-matriz.csv/json`, julho/2026) está **ultrapassada** — decisão do Pedro (27/08). Vamos aprofundar de verdade antes de tocar em qualquer reclassificação.

## O que já está feito

1. ✅ **`fundamentos-cnae.md`** — explicação-base do que é CNAE, estrutura, e os 4 efeitos no imposto (Anexo, MEI, risco municipal, comércio×serviço). 🟡 Confiança geral, ainda não ratificada em fonte primária — é o V1 que a pesquisa abaixo vai validar/corrigir.
2. ✅ **`prompt-pesquisa-fundamentos-cnae-anexos-mei.md`** — prompt pronto, 4 blocos (mecânica Anexo III×V, fórmula do Fator R, por que MEI tem lista de CNAE diferente do ME, risco municipal/dispensa de vistoria). Exige só fonte oficial (Receita, CGSN, LC 123, IBGE/CONCLA, Portal do Empreendedor).

## Onde estamos AGORA

✅ **Resultado colado e cruzado (27/08).** Pesquisa rodou no Gemini Pro, salva por Pedro em `Downloads/Tributação Simples Nacional E MEI.md`, versão limpa arquivada em [[resultado-pesquisa-fundamentos-cnae-27-08]].

Cruzamento feito:
- `fundamentos-cnae.md` → **v2, ratificado** (🟢). As 2 hipóteses 🔑 do V1 confirmaram: (1) não existe lista oficial de "sempre Anexo V" (é penalidade condicional, não destino fixo); (2) MEI É filtro jurídico separado do Simples ME (Art. 966 CC), não o mesmo filtro com teto menor — contabilidade é o exemplo mais didático (Anexo III privilegiado, mas vedada ao MEI).
- `execucao/cnae-fiscalmente-otimo.md` → **bate, sem contradição.** Grupos A/B/C do motor continuam válidos; pesquisa não cobriu §5º-C (Anexo IV) que o motor já usa pro Grupo C, então não havia como contradizer aí — é escopo pra rodada futura, não pendência travada.

## Próximo passo

Ainda não feito — cruzar o fundamento ratificado contra o resto da `cnae-matriz/`:
- `cnae-matriz.csv/json` (matriz original)
- `contabilizei-cnae-completo.*` (tabela do líder)
- `cnae-complexidade-abertura.*`
- `cnae-liso-servico.md`

Foco prático: identificar CNAEs marcados como "atende MEI" na matriz atual que na verdade são atividade intelectual/regulamentada (deviam estar barrados pelo Art. 966 CC) — é o ponto de maior risco de erro herdado do V1, já que a distinção MEI×ME só ficou clara agora. Além disso, `fundamentos-cnae.md` ficou com 2 lacunas de dado bruto (lista completa Anexo XI CGSN140 e lista completa Anexo I Res. CGSIM 51/2019) que podem virar prompt de pesquisa dedicado se o produto precisar filtrar CNAE-a-CNAE.

## Pendência separada, não travada ainda

Pedro perguntou se faz sentido mover pra dentro de `cnae-matriz/` alguns arquivos CNAE que hoje vivem espalhados (`execucao/cnae-fiscalmente-otimo.md`, alguns marcos datados em `execucao/marcos/`). **Ainda não decidido** — acho que os marcos datados (`execucao/marcos/*cnae*`) devem ficar onde estão (são "descobertas datadas", tipo de nota diferente de dado de referência), mas `cnae-fiscalmente-otimo.md` é candidato real a vir pra cá. Retomar essa conversa depois que a pesquisa fechar — não é bloqueante.

## Links
- [[fundamentos-cnae]]
- [[prompt-pesquisa-fundamentos-cnae-anexos-mei]]
- [[resultado-pesquisa-fundamentos-cnae-27-08]]
