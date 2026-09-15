# CLAUDE.md — Legalizai Story Book (vault + projeto)

Constituição desta janela. O `CLAUDE.md` da raiz `Projetos/` continua valendo acima deste.

## O que é
**Legalizai Story Book** — app de contabilidade digital (MVP tipo Contabilizei, melhor). Sociedade **Pedro** (PM/sócio, dev solo) + **Mauro** (dono da Legalize Digital, escritório 22 anos BH). Negócio fechado 2026-07-07. Nicho: ME serviço no Simples, geo BH/MG. Fonte-verdade estratégica: `BASE-ESTRATEGICA.md`.

Este diretório **é o vault do Obsidian** — todo `.md` é nota viva (`[[links]]`, properties, Bases). Git = backup/histórico. Auto-memória (`.claude/.../memory/`) = cache cross-sessão que carrega sozinho.

## 🔑 Regra de BOOT (início de toda janela)
Antes de QUALQUER ação num assunto novo:
1. Leia `HOME.md` — em especial o bloco `## 📍 Agora` (torre de controle).
2. Rode `git log -1 --date=short` e compare a data do último commit com a "Última atualização" do §Agora. Divergiu? **Avise que o dashboard pode estar velho.**
3. Devolva um briefing curto (onde estamos + o que está aberto) e pergunte qual flow tocar. Só então execute.
Atalho: comando `/boot`.

## 🎨 Exceção de prioridade — motor de posts (`atelie/`)
Pedido de post/peça/copy de marketing **dentro da pasta `atelie/`**: quem manda é `atelie/CLAUDE.md`, não a Regra de BOOT acima (não precisa ler `HOME.md`/checar `git log` pra pedir 3 posts). Fora de `atelie/`, ou se o pedido for sobre produto/roadmap/negócio, o BOOT deste arquivo volta a valer normalmente. Motor migrado 25/08 pra `atelie/` (peça vira JSON com schema); agentes antigos `legalizai-copywriter`/`legalizai-guardian` foram **arquivados** (`_arquivo/agentes-antigos-marketing/`) — não recriar em `.claude/agents/`. ADR completo: `marca/decisoes-marca.md` 2026-08-25.

## 🪟 Regra de SAÚDE DA JANELA — ❌ REVOGADA (04/09, pedido do Pedro)
**Não emitir a linha 🟢/🟡/🔴 no fim do flow, nem sugerir `/fechar` por aquecimento.** A janela é ~1M e o Pedro acompanha a barra sozinho; o aviso virou ruído repetido no fim de toda resposta. Continua valendo só a parte silenciosa: se você se pegar repetindo, perdendo o fio ou entrando numa 2ª compactação, **diga isso em uma linha** — não como carimbo de rotina, mas como fato.

## 🔒 Regra de FECHO (fim de todo flow)
Nunca encerre um flow sem: (1) atualizar `HOME §Agora`; (2) registrar decisão travada no ADR `marca/decisoes-marca.md` e/ou marco em `execucao/marcos/`; (3) atualizar `execucao/evolucao-para-mauro.md` se rendeu reporte; (4) `git commit` + `push`. Atalho: comando `/fechar`.

## Onde as coisas vivem
- `HOME.md` — hub + §Agora (estado corrente). `BASE-ESTRATEGICA.md` — teses/custo/equity/roadmap.
- `marca/` — `decisoes-marca.md` (ADR, log de decisões travadas), `conceito/`, `identidade-visual/` (`paleta-cores.md`), `naming/`, `referencias/`.
- `execucao/` — `spec-mvp-v0.md`, `marcos/` (descobertas datadas), `evolucao-para-mauro.md` (reporte sócio), `kanban-legalizai-story-book.md`, `parking-lot.md`.
- `pesquisa/` — `concorrentes/` (teardowns), `cnae-matriz/`, `mercado-*`, `PESQUISA-MERCADO.md`.
- `reunioes/` — atas Plaud (1 nota/reunião). Auto-memória — fatos duráveis cross-sessão.

## 🔁 Como o Pedro pede alteração de tela (travado 02/09)
O Pedro revisa o produto **só** por `/apresentacao` e `/mapa`, e pede de onde estiver olhando. Um pedido pode ser layout, flow, ou os dois juntos. O método abaixo existe porque, antes dele, ele virou o detector de bug sistêmico: apontava um sintoma numa tela, eu corrigia só ali, e o mesmo bug reaparecia na próxima (o degradê de rolagem foi pedido 4 vezes; o carry-forward que não atravessa a demo, 2).

1. **Mapa é espelho da apresentação.** Mesma coleção de telas, duas vistas: uma conectada e em ordem de flow, a outra navegável. Nada existe num sem existir no outro. A coleção única é `NODES` em `execucao/flow/flow-data.mjs`; a fita de pills da apresentação **deriva** dela (`TELAS_DO_FLOW`), não é mais lista escrita à mão.
2. **Tela nova nasce declarada, não copiada.** Um nó no `flow-data` (com `caminho`), o render na apresentação, e a linha no `MOMENTO_POR_NO`. Rodar `node execucao/flow/gerar-mapa.mjs`: mapa, doc do dev e `/conferencia` se atualizam juntos, e a auditoria de espelho avisa o que ficou solto. Sem render, a pill aparece apagada como **"sem tela ainda"** em vez de sumir.
3. **Pré-voo antes de tocar na tela.** "Vou mexer na tela X" → devolver, ANTES de editar: código e nome, rota, o que ela coleta, o que recebe das telas anteriores, o que passa adiante, variantes/estados que ela tem, e onde ela aparece. Custa segundos e evita rodada de correção besta.
4. **Lote por tela, não por ajuste.** Esperar o Pedro apontar tudo o que viu numa tela e aplicar junto, em vez de uma rodada por micro-correção.
5. **Sintoma repetido = bug de raiz.** Se o mesmo tipo de defeito aparece na 2ª tela, parar de corrigir a tela e corrigir a origem (foi assim que nasceram o `Rolagem` e o espelho derivado).
6. 🔴 **Réplica de tela do ME se PORTA, não se remonta.** Em 07/09 o Pedro pegou 5 telas do ramo MEI que deviam ser réplicas e não eram: a M7 com outro esqueleto (chegou comprimida), o cartão de ocupação com a pill do lado errado e jargão de órgão no lugar de "compatível", a M6.1 com lista plana onde o E9.1 tem acordeão de blocos, a M7.S com a busca no topo em vez de fixa no rodapé, e as telas de status escuras com um `TelaHeader` que o `PainelView` não renderiza no escuro. Nenhum foi descuido pontual: em todos eu montei a tela **no espírito** da original em vez de portar a anatomia dela. Duas travas nasceram disso: `verificar-anatomia-mei.mjs` (roda junto com o `gerar-mapa.mjs` e compara o esqueleto das duas telas; diferença não declarada em `DIVERGENCIAS_OK` é defeito) e a extração das peças compartilhadas (`components/mei/_timeline-blocos.tsx`, `_cartao-ocupacao.tsx`). ⚠️ A trava pega ESTRUTURA, não espaçamento, cor nem copy — isso ainda é olho humano no print.
7. 🔴 **Toda tela de wizard tem VOLTAR, e o `meta` nomeia o DESTINO.** Dois erros que apareceram 4 vezes em 02/09 (gate 29/08, C0, C5, C2): (a) a página esquece de passar `onVoltar` e o `TelaHeader` renderiza só o texto, sem seta e **sem erro** — a tela nasce sem saída e só o Pedro pega, testando no aparelho; (b) o `meta` recebe o nome da PRÓPRIA tela, quando ele é o nome de pra onde o voltar leva. Quem não tem voltar de propósito (splash, saída terminal, laboratório) declara `semVoltar`. Duas travas já no código: o componente avisa em dev, e `gerar-mapa.mjs` audita as telas do flow a cada rodada.

## 📖 Regra de LEITURA INTEGRAL (travada 10/09, provocação do Pedro)

🔴 **Documento de alto grau para o negócio se lê INTEIRO, nunca por amostra.** Contrato, termo, aceite, anexo, política, procuração, laudo, tabela de preço oficial: **100% do texto, literal**, salvo em arquivo do vault, com a fonte e a data. Nada de "li as cláusulas que importam".

Nasceu porque em 10/09 eu apresentei o contrato do líder como lido e ele estava **12% literal** (9.000 de 74.700 caracteres): eu tinha o mapa das 11 cláusulas e o texto só das que respondiam a pergunta da vez. O Pedro pegou perguntando *"incluindo scroll?"*. Antes disso, no mesmo dia, a captura de 27/08 do mesmo contrato tinha perdido a **cláusula 1**, que era justamente onde estava a resposta que ele procurava.

**O que a regra obriga:**
1. **Ler até o fim e provar.** Declarar o tamanho total e o quanto foi lido. Se leu 12%, dizer 12% — nunca deixar "li o documento" no ar.
2. **Salvar o texto literal em arquivo**, não só a paráfrase. Paráfrase minha não é o que advogado, contador ou sócio valida.
3. **Inventariar o que ficou de fora.** Documento que existe e não foi aberto entra numa lista de pendência explícita, com o nome dele.
4. **Vale para tela também** (regra de 09/09, que esta generaliza): medir o `innerText` e comparar com o que foi lido, em vez de confiar no que coube na primeira olhada.

⚠️ **Não vale como desculpa** limite de ferramenta. A leitura por `javascript_exec` trunca em ~1.000 caracteres por chamada; a saída é **paginar até o fim** (`browser_batch` roda várias de uma vez), não resumir.

## 🧩 Regra das CAPACIDADES (travada 11/09, medo declarado pelo Pedro)

🔴 **Tela do portal declara o que faz, e um script confere se ainda faz.** Nasceu de uma pergunta do Pedro em 11/09: *"tenho medo da gente perder funcionalidades nas novas telas, sendo que as que já criamos estão muito boas."*

A resposta **não** é duplicar tela nem congelar cópia. Cópia só serve pra comparar depois do estrago, e o fork do ramo MEI (07/09) já provou o preço: **4 defeitos em 8 dias**. A resposta é declarar e verificar.

1. **Toda capacidade tem um `data-cap` no JSX** (`<button data-cap="plano.cancelar">`). Atributo, não classe nem texto: assim ela sobrevive a redesenho inteiro e só some se o elemento sumir.
2. **E uma linha em `execucao/portal/portal-data.mjs`**, nos campos `caps` (o que a tela entrega) e `cobre` (que itens do painel de 51 ela cobre). Esse arquivo é a casa; **não criar um segundo inventário**.
3. 🔴 **Capacidade nova nasce declarada, no mesmo commit.** Sem isso o inventário envelhece igual o `portal-data.mjs` envelheceu (parado 03/08→11/09) e igual o vocabulário do vault, que ficou cego em 79% sem ninguém notar.
4. 🔴 **Remover capacidade é DECISÃO, não limpeza.** Só sai junto de uma linha no ADR. O script não distingue "tiramos de propósito" de "esquecemos"; quem distingue é o registro.

🔻 **Precedência (Pedro, 11/09):** quem guia é a pesquisa de **setembro** (`produto/` — painel de 51, evidências com API e endpoint). Os quatro docs de **22-23/07** do `execucao/portal/` (matriz, cruzamento, candidatos de home, backlog) são **histórico**: explicam por que as telas nasceram assim, **não decidem o que construir agora**. Não apagar, não obedecer.

🔴 **O inventário nasce da NOSSA TELA pra fora, não da lista do líder pra dentro.** Foi por olhar pela lista dele que `/mais/relatorios` e `/mais/servicos` ficaram invisíveis por um mês e meio: são tese nossa, ele não tem equivalente, e o painel não as enxergava. A pergunta ao abrir uma tela é *"o que ela deixa a pessoa fazer?"* — o amarre com o painel vem depois, e capacidade sem item correspondente é **diferencial**, não erro.

⚠️ **Protege capacidade, não qualidade.** Garante que o botão continua existindo, não que ficou bom — mesma fronteira da trava de anatomia do MEI. Isso segue sendo olho do Pedro no print.

Régua completa do que conta como capacidade, nomenclatura e o verificador: `produto/_doutrina-capacidades.md`.

## Regras de trabalho
- 🔴 **Playwright/E2E só quando o Pedro PEDIR.** Nunca rodar por iniciativa própria, nem "pra conferir", nem no fim de uma leva de alterações. Padrão de verificação é `tsc` + `eslint`. Se achar que vale rodar, **pergunta** — não roda. (Travado 30/08, reforçado 01/09.)
  - 🔒 **Um "pode rodar" vale só pra AQUELA rodada** (reforçado 07/09, 3ª vez). Depois que o Pedro pediu o E2E do ramo MEI, eu passei a rodar a suíte a cada alteração como se a autorização fosse permanente. Não é: autorização é por pedido, não por sessão nem por assunto. Spec nova continua podendo ser ESCRITA e versionada sem pedido; o que exige pedido é **executar**.
- 🔒 **ENQUADRAMENTO: ME do Simples, Anexos III e V, com ou sem Fator R.** Travado 12/09. Toda nota, todo imposto, todo processo do produto assume isso. **FORA, e não é "depois":** Anexo I (comércio), atividades regulamentadas, Lucro Presumido/Real. 🔑 Não é etiqueta, **muda a regra**: no mesmo dia eu desenhei "valor errado → substitui nota" e a regra E0061 do leiaute nacional proíbe exatamente isso para optante do Simples ME/EPP (`opSimpNac = 3`). O escopo estava escrito e eu não apliquei. Por isso virou **dado + script**: `execucao/processos/_escopo.mjs` é a fonte, `verificar-escopo.mjs` roda dentro dos 3 geradores e derruba a rodada se vocabulário de fora (ICMS, CFOP, NCM, SEFAZ, DANFE, Lucro Presumido…) aparecer sem a marca `FORA DO ESCOPO` na mesma linha. ⚠️ A trava pega VOCABULÁRIO, não raciocínio — e "Anexo I" e "MEI" ficaram fora da lista por ambiguidade real no vault.
- 👤 **PERSONA: o cliente é FIXO, e o que ele não tem NÃO EXISTE no produto.** Travado 13/09. 🔑 **Não é o escopo de novo, é o filtro que o escopo não pega:** escopo pergunta *"isso é de outro regime?"* (ICMS, SEFAZ, Lucro Presumido); persona pergunta *"isso é legal no nosso regime e mesmo assim não existe no nosso produto?"*. 🔴 Nasceu porque na varredura de pró-labore eu escrevi *"plano de saúde do sócio desconta do pró-labore"*, copiado do líder: **perfeitamente legal** num ME Anexo III, invisível pra trava de escopo, e mesmo assim delírio — nosso sócio não tem benefício nenhum. O nó `L26` inteiro existia por imitação. Travado: ME Simples Anexos III/V · serviço · BH · **1 a 4 sócios PF domiciliados no Brasil** · **sócio sem benefício algum** · **EPP só como porta de SAÍDA** (desenquadramento R$139), nunca como permanência · comércio fora. Fonte é dado: `execucao/processos/_persona.mjs`, trava `verificar-persona.mjs` nos 3 geradores, nota legível gerada em `produto/PERSONA.md`. ⚠️ **Proibido é POR CATEGORIA**, não global — "rescisão"/"13º"/"férias" são legítimos em folha e proibidos em pró-labore. 🧪 E existe **persona zero**: a empresa do Pedro (Anexo V, BH, 1 nota/mês, M-1), medida na emissão real de 12/09. Ao escrever um nó, a pergunta é *isso acontece com ela?* — é o teste que teria pego o plano de saúde na hora. ⏳ **12 perguntas seguem abertas** e o gerador as conta a cada rodada; 3 são críticas (folha fica ou sai do MLP · 1 ou 2 sócios no padrão · dependente é decisão ou buraco).
- 🗓️ **O MÉTODO CORRENTE É CRONOLÓGICO (13/09).** *"me usar como a persona 1 de fato, com características travadas… e ir estudando pelo histórico da minha conta como eles aplicaram cálculos, guias e tudo que é preciso"*. **Sai** a pergunta por categoria (*"o que essa função precisa fazer?"*), **entra** a ordem de execução real (*"o que aconteceu com esta empresa, nesta data, e o que o contador fez em resposta?"*). Ponto zero = a constituição em 12/12/2025, daí mês a mês. Fonte externa só onde a conta do líder não responde. Mora em `produto/persona-zero/` (`constituicao.md`, `acionaveis.md`) e nas evidências datadas de `produto/evidencias/`. **Duas travas negociadas antes de começar:** 🏷️ **etiqueta de 3 vias** — o líder é EVIDÊNCIA, não autoridade: ⚖️ obrigação legal (copiar citando a lei, nunca ele) · 🏢 decisão deles (decidir de novo, do zero) · 🐛 defeito ou interesse deles (não copiar); 🚫 **coluna "o que este caso NÃO prova"** — a persona zero é unipessoal, Anexo III, 1 nota/mês, sem funcionário, então ficam mudos 2+ sócios, Anexo V, folha de colaborador, CNAE secundário, regulamentada. **Ausência de evidência não é ausência de requisito** — foi assim que nasceu o "plano de saúde do sócio".
- 🥩 **Modo cru (12/09) — CONGELADO em 3 de 8 categorias.** Varredura por CATEGORIA do PDF de 58, sem quem executa, sem tela, sem API, sem semáforo. Fonte em `execucao/processos/cru/`, regras em `cru/_como-funciona.md`, vista no `/processos` pelo seletor. ✅ **Fechadas:** 🏛 Impostos (35 nós) · 🧾 Notas fiscais (55) · 👥 Pró-labore e sócios (33, fechou em 14/09). ⬜ **Não varridas:** 🏠 Home · ✅ Estar em dia · 📄 Documentos e certificado · 💳 Plano e cobrança · 👷 Folha. **Não foi abandonado nem revogado** — parou porque o cronológico assumiu em 13/09. Retomar as 5 é decisão aberta do Pedro: a categoria garante **cobertura da lista de 58**, o cronológico garante que é **real**.
- 🗺️ **Formato completo P1–P6 (11/09) — ADIADO, não revogado.** 82 nós, 88 arestas, com quem faz · com quem fala · o que a pessoa vê · semáforo. Em `execucao/processos/processos-data.mjs`, doutrina em `_doutrina-processos.md`. As conexões e as APIs entram depois que as categorias estiverem varridas.
- 🔴 **Escopo padrão = flow ME "abrir empresa".** MEI e Migração estão FORA de qualquer alteração, salvo pedido explícito. Quando uma tela é compartilhada (mesmo componente serve ME e MEI), a mudança tem que ser **guardada por regime** pra não vazar; se não der pra guardar, avisar antes de mexer.
- **Anti-guru:** número sem fonte não entra. Sempre valor + fonte + confiança.
- **Uma nota = um assunto.** Linkar sempre (`[[ ]]`). kebab-case, datas `AAAA-MM-DD`.
- **Commit ao fim de cada flow** (Co-Authored-By). Push quando fechar. Sem force em `main` sem ok.
- **PT-BR.** Dados sensíveis podem ficar (só o Pedro mexe por ora) — se for replicar/compartilhar, debater antes.
