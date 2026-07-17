---
tipo: marco
status: vivo
data: 2026-07-17
assunto: complexidade-abertura + pills N4 + padrão de layout
tags: [cnae, ux, telas, design-system, decisao]
---
# Marco 2026-07-17 (3º flow) — complexidade de abertura + telas

> Descobertas e decisões travadas no 3º flow do dia. Fonte com link quando é dado.

## 1. Eixo de complexidade de abertura (NOVO, ortogonal ao fiscal)
Pergunta do Pedro: *quais CNAEs a Legalizei abre sozinha (passa liso) × quais precisam de tato/humano?* — o "asterisco" da Contabilizei, reconstruído por **dado oficial** (não raspado dela: o dado não existe no site).
- **3 níveis** (regra determinística, re-executável): `tato-registro` (conselho/setorial) > `verificar-licenciamento` (fora do baixo-risco CGSIM) > `liso`.
- **387 → 170 liso / 120 verificar / 97 tato.** Fonte do risco: **CGSIM Res 51/2019 Anexo I** (baixo risco A, red. Res 57/2020); fonte regulamentado: conjunto **fechado** de ~17 conselhos/órgãos.
- **Direção segura do erro travada:** falso-liso é o pecado (cobra antes de barrar), falso-tato é conservador → só marca liso quem está na lista oficial; ausência nunca vira "presumido liso".
- Revisão pegou 2 erros do tipo: **+CORE** nos representantes comerciais (era falso-liso), **−CRF** em cosméticos (era falso-tato).
- **103 serviço-liso = happy path do MVP** (filtro fiscal correto: serviço = Anexo III/IV/V, sem I comércio nem II indústria). **Escada de expansão até 387** documentada = backlog, pode virar feature.
- **Médio×alto dos 120 = municipal (Art. 5º CGSIM), DEFERIDO.** Não está em tabela nacional. Próxima fonte = REDESIM-MG (Simulador de Grau de Risco, hoje bloqueado por período eleitoral) ou decreto de risco de BH. JUCEMG Dec 49.013/2025 só **expande o baixo** (não traz alto/médio).
- Achado paralelo: o **compreende/não-compreende** da Contabilizei (já extraído) é **taxonomia de escopo**, não complexidade — serve pro Mapa de Confusão CNAE, não pro eixo tato.
- Arquivos: `pesquisa/cnae-matriz/cnae-complexidade-abertura.{md,json,csv}` · `cnae-liso-servico.{md,csv}` · `cgsim-res51-baixo-risco.pdf`. Confiança: **liso confirmado por nós sobre fonte oficial; lista-base "atende" herdada da Contabilizei, não ratificada por contador** (fila Larissa).

## 2. Etiquetas de anexo do Simples (III/IV/V)
`pesquisa/anexos-simples/anexo-{iii,iv,v}-simples.md` — tabela completa (6 faixas + parcela a deduzir), repartição de tributos por faixa, alíquota efetiva, Fator R, CPP (dentro do DAS no III/V, **fora no IV**). **Fonte = LC 123/2006**; Contabilizei só conferência. Linkar `[[anexo-iii-simples]]` sempre que alíquota aparecer.

## 3. Pills do N4 (17)
- **17 pills de reconhecimento** derivadas dos 103 serviço-liso (cobrem 103/103). Decisão do Pedro: **granular > enxuto** — mais pills pra pessoa achar a dela direto antes de escrever (invertendo o "~6" anterior).
- Reafirma **pill estreita, não valida**: clicar afunila o universo pra IA e troca o exemplo do campo; a pessoa ainda descreve no textarea, e é lá que fecha.
- Beleza/estética/pets **não viram pill** no happy path (colapsaram: foram pra verificar/tato).

## 4. Padrão de layout travado (Design System)
- **Regra das 3 partes: título+subtítulo FIXOS / corpo ROLA / CTA FIXO.** Vale pra toda tela do wizard/app.
- **Shell `.app-page` = `height:100dvh`** (era `min-height`, que deixava a página crescer e rolar tudo — bug do single-scroll no SE). Com teto real, `flex-1 min-h-0` obriga a região interna a rolar sozinha.
- **Toda tela alta precisa de `overflow-y-auto` no corpo** (scrollbar escondida no mobile). `/gate` e `/simulador` já têm.
- **N4:** pills = a região rolável, com **fade-mask dinâmico** (só desbota a ponta com mais conteúdo) + **input de altura fixa** (não estica mais; as pills absorvem a variação de tela).

## 5. Mockup por arquétipo (preparo)
`/mockup` deixou de ser "as 2 farol" e virou **esteira por arquétipo** (A1 Pergunta · A2 Veredito · A3 Número · A7 Espera · A9 Saída). Cada arquétipo = esteira horizontal com **clicar-segurar-arrastar** (da 3ª/4ª tela rola). N4 em A1, N18 em A3; resto aguardando. **Preparado pra receber as telas — próxima janela constrói o A1.**

## Próximos passos
- **Construir as telas por arquétipo, começando pelo A1** (coleta N10–N16, mesmo esqueleto do N4). Nível: mock de alta fidelidade (IA/dado dublados), testável contra as 19 personas do motor.
- Larissa ratifica complexidade + anexos.
- Médio×alto dos 120 quando a fonte BH liberar.

## Ligações
[[cnae-complexidade-abertura]] · [[cnae-liso-servico]] · [[anexo-iii-simples]] · [[design-system]] · [[legalize-pill-estreita-nao-valida]] · [[fila-validacao-humana]]
