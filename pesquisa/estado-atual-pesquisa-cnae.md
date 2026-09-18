---
tipo: operacao
status: vivo
data: 2026-08-28
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
- `produto/me/entrar/constituir/cnae-fiscalmente-otimo.md` → **bate, sem contradição.** Grupos A/B/C do motor continuam válidos; pesquisa não cobriu §5º-C (Anexo IV) que o motor já usa pro Grupo C, então não havia como contradizer aí — é escopo pra rodada futura, não pendência travada.

## ✅ Camada tributária dos 4 dados — FECHADA (27/08)

Depois do cruzamento acima, fomos atrás dos 4 dados que faltavam na matriz (nenhum vem do IBGE). Todos feitos, nessa ordem (escolhida por tratabilidade):

1. ✅ **MEI** (Anexo XI CGSN140) — 351/1332 CNAEs permitem MEI. PDF oficial parseado, 0 gap.
2. ✅ **Risco municipal** (CGSIM Anexo I, Res. 51/2019) — 284/1332 baixo risco. 2 órfãos documentados (CNAE renumerado).
3. ✅ **Anexo III/IV/V + Fator R** — o grande. Confirmado (a pedido do Pedro) que **não existe crosswalk oficial em lugar nenhum** — nem lei, nem CGSN140, nem PGDAS-D (o próprio sistema da Receita pede pro contador escolher manualmente). Classificado via regex contra a descrição oficial IBGE + os 5 grupos taxativos da LC123 ([[lc123-art18-anexos-taxativo]]). 481 III-fixo · 47 Fator R dinâmico · 51 Anexo IV · 62 `requer-revisao` (ambíguo, não chutado). ⚠️ **Não ratificado por contador** — precisa do mesmo tratamento que `cnae-fiscalmente-otimo.md` já exige (Larissa assina) antes de virar verdade de produto.
4. ✅ **ISS por CNAE (BH)** — surpresa boa: aqui EXISTE crosswalk oficial (BH estrutura a lei municipal direto por CNAE). Planilha oficial `fazenda.pbh.gov.br`, 524/1332 CNAEs com alíquota. 2 órfãos documentados.

**Achado bônus no caminho:** CGSN140 Anexo VI/VII (101 CNAEs vedados ao Simples inteiro + 21 ambíguos) — não era um dos 4, mas achamos procurando o crosswalk do #3 e vale de segurança (nenhum CNAE vedado deve virar recomendação).

Detalhe completo de cada um em `cnae-matriz-governo.md` §2a-2d.

## ✅ Lista "atendemos com certeza" — FECHADA, 3 rodadas de correção (27/08, mesmo dia)

Depois da camada tributária, construímos a lista real de CNAEs que o produto atende no V1 (substitui a v1 de 103 herdada da Contabilizei):

- **90 ME / 53 MEI** — critério de 7 filtros, todos com fonte, ver [[cnae-liso-servico]] (agora `tipo: verdade`, registrado no índice de autoridade).
- **Export dedicado pro dev:** `cnae-atendemos-certeza.csv/json` — os 90, com as 40 colunas completas da matriz (atividades, observações, fonte legal do enquadramento, etc.), não só as 6 colunas do `.md`.
- **3 rodadas de correção**, cada uma achando um bug real: (1) 21 códigos eram comércio/indústria disfarçados de serviço + 2 regulamentados que passaram batido; (2) cruzamento com `cnae-complexidade-abertura` achou 4 códigos que exigem **registro setorial federal** (CADASTUR/Polícia Federal/Bacen-CVM-SUSEP — eixo que a pesquisa de conselho profissional não cobria); (3) Pedro pegou que **restaurante/lanchonete é comércio (Anexo I), não serviço** — Decreto 7.212/2010 RIPI, corrigido na matriz inteira (9 CNAEs da divisão 56 recodificados), não só na lista dos 90.
- `cnae-complexidade-abertura.md` foi **fundido** dentro de `cnae-liso-servico.md` (pedido do Pedro) — não existe mais como arquivo separado, só os datasets `.csv/.json` continuam.

## ✅ Categorias de UX — FECHADA e implementada (27/08, mesmo dia)

Taxonomia de categorias tipo Contabilizei, pra usuário achar seu CNAE intuitivamente, agora com **15 categorias** (não 17 — 2 saíram no debate: "Conserto de veículos" e "Manutenção de máquinas" não têm CNAE `liso` na base atual, caem em `verificar-licenciamento`). Debate achou e corrigiu um "saco" (categoria "Agenciamento" forçando 3 CNAEs sem relação) e uma confusão de rótulo ("agências matrimoniais" ≠ "cerimonialista de casamento" — são profissões diferentes).

- **Doc**: [[taxonomia-pills-n4]] (v2, substitui a v1 de 16/07 arquivada) — 15 categorias, CNAE por categoria, o que mudou vs v1.
- **Implementado**: `PILLS` em `app/src/components/gate-telas.tsx` — usado na tela E3.4 (`/endereco`) do flow de produção, dropdown de categoria.

## ⏸️ Pedro sinalizou "alguns passos para trás" (27/08, fim da sessão)

Depois de fechar a correção do restaurante, o Pedro disse que ia dar passos pra trás — **não detalhado o quê ainda**. Não presumir o que significa; perguntar antes de continuar a expandir escopo.

## Decisões já tomadas, não reabrir sem o Pedro trazer de novo

- **Não cruzar com `contabilizei-cnae-completo.csv`** — decisão explícita do Pedro (27/08): nosso dado é fonte primária, cruzar com dado do concorrente de origem incerta só gera dúvida, não confiança.
- Os 62 `requer-revisao` do Anexo/Fator R e os órfãos documentados (CGSIM, ISS BH — CNAE renumerado pelo IBGE) são pendências pontuais conhecidas, não bloqueiam nada.

## Pendência separada, não travada ainda

Pedro perguntou se faz sentido mover pra dentro de `cnae-matriz/` alguns arquivos CNAE que hoje vivem espalhados (`produto/me/entrar/constituir/cnae-fiscalmente-otimo.md`, alguns marcos datados em `execucao/marcos/`). **Ainda não decidido** — acho que os marcos datados (`execucao/marcos/*cnae*`) devem ficar onde estão (são "descobertas datadas", tipo de nota diferente de dado de referência), mas `cnae-fiscalmente-otimo.md` é candidato real a vir pra cá.

## ⚠️ Nota técnica — RESOLVIDA (27/08, fecho)

A pasta trocou de branch algumas vezes nessa sessão (outra janela mexendo em `feat/reordenacao-entrada-lead-gate-bh` no mesmo diretório físico, sem worktree própria). **Fechado de vez:** os 4 commits que ficaram presos em `feat/mapa-interativo-e-ajustes-constituicao` (reorganização legado/fontes-oficiais, inclusive) foram mergeados no `main` e empurrados. A pasta agora vive só no `main`, sem branch de trabalho separada pra CNAE. Se abrir sessão nova aqui, já está tudo num lugar só.

## ✅ Script de classificação independente — `cnae-verifica-atende.cjs` (27/08)

`node pesquisa/cnae-matriz/cnae-verifica-atende.cjs <cnae>` (1 CNAE) ou `--auditoria` (os 1332). Recalcula o veredito atende/não-atende **do zero**, critério por critério (não lê `atende_me_certeza` como atalho — deriva e SÓ DEPOIS compara), pra pegar divergência entre a lógica documentada e o campo precomputado.

**Achado real na 1ª rodada:** 5 dos 90 "atendemos com certeza" tinham `exige_registro_setorial: nao-verificado` (não `nao`) — aprovados sem essa checagem específica ter rodado neles.

## ✅ Investigação dos 5 pendentes — FECHADA parcialmente (28/08)

Pesquisado com WebSearch/WebFetch, fonte primária onde deu:

| CNAE | Resultado | Fonte | Confiança |
|---|---|---|---|
| `5232000` agenciamento marítimo | 🔴 **Exige registro** — Receita Federal (habilitação Siscomex/RADAR aduaneiro) + ANTAQ registra o agente estrangeiro (Res. ANTAQ 18/2017) | RFB (manual habilitação Siscomex) + Res. ANTAQ 18/2017 | 🟢 alta |
| `8292000` envasamento sob contrato | 🟢 **Não exige** registro federal — o que existe é licença sanitária municipal/estadual (eixo diferente, já coberto por risco CGSIM) | Guia de serviços municipal (São Bernardo do Campo) confirma que é licença **municipal**, não federal | 🟢 alta |
| `9529104` reparação de bicicletas | 🟢 **Não exige** registro federal — nenhuma exigência encontrada além de possível Inscrição Estadual (se vender peças, eixo estadual) | Busca ampla, nenhuma fonte aponta exigência federal | 🟡 média (ausência de evidência, não prova formal de ausência) |
| `3831999` recuperação de metal | 🟡 **PENDENTE** — indício de CTF/APP (IBAMA, Lei 6.938/1981, gestão de resíduos), não confirmado contra o Anexo I/II oficial pra esta subclasse específica (PDF oficial bloqueado, páginas espelho divergem) | — | 🔴 baixa, precisa fonte melhor |
| `3832700` recuperação de plástico | 🟡 **PENDENTE**, mesmo motivo do 3831999 | — | 🔴 baixa |

**Resultado**: lista "atendemos com certeza" **caiu de 90 para 87 ME** (51 MEI, era 53) — `5232000` saiu de vez, `3831999`/`3832700` saíram até confirmar (não descartados, só não contam mais como certeza). `8292000`/`9529104` ficaram, agora com o eixo genuinamente resolvido (era assumido, virou confirmado).

**Arquivos atualizados**: `cnae-matriz.json/csv` (mestre, 1332), `cnae-atendemos-certeza.json/csv` (regenerado do mestre), `cnae-liso-servico.md`, `taxonomia-pills-n4.md` (categoria "Recuperação de materiais" saiu — só tinha esses 2 CNAEs pendentes —, 15→14 categorias), `PILLS` em `gate-telas.tsx`, `_sistema/indice-autoridade.md`. `cnae-verifica-atende.cjs --auditoria` confirma zero divergência pós-correção.

🕓 **Fila, não bloqueia**: achar o Anexo I/II oficial do CTF/APP (IBAMA) pra confirmar `3831999`/`3832700` de vez. PDF oficial (`ibama.gov.br/phocadownload/...`) bloqueou fetch (403) — precisa acesso direto ou pedido formal.

## Links
- [[fundamentos-cnae]] · [[lc123-art18-anexos-taxativo]] · [[profissoes-regulamentadas-conselhos]] · [[mei-risco-e-simplificacao-abertura]] · [[cnae-liso-servico]] · [[cnae-matriz-governo]] · [[resultado-pesquisa-fundamentos-cnae-27-08]]
