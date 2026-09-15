# Memory Index — Legalize

## Motor fiscal e estado do CNPJ
- [Anexo V tinha DUAS lacunas, so uma fechou](legalize-anexo-v-duas-lacunas.md) — 15/09: simulacao fecha COMPORTAMENTO, nunca DOCUMENTO. Efetiva continua ao 12o decimal em 8 bordas; quebra na 6a, nos dois anexos, pra baixo.
- [O Fator R e RETROVISOR](legalize-fator-r-e-retrovisor.md) — 15/09: corrigir hoje nao conserta hoje (P01 so volta ao III em ago/2027). Invariante passava pelo motivo errado.
- [Os 2 motores fiscais duplicados](legalize-dois-motores-fiscais-duplicados.md) — 14/09: 7 de 7 constantes duplicadas; `brl()` com unidades diferentes nos dois. Debito PAGO em 15/09 por gerador.
- [O apurador fiscal existe e bate ao centavo](legalize-motor-fiscal-apurador-existe.md) — 14/09: `execucao/motor-fiscal/`. A pesquisa errou o DAS que o motor acerta; so o recibo fala de arredondamento.
- [Motor fiscal: arredonda por TRIBUTO](legalize-motor-fiscal-arredonda-por-tributo.md) — 13/09: DAS = soma de 6 parcelas arredondadas. Fator R e CAIXA; empresa nova anualiza a FOLHA junto.
- [Estado recorrente de CNPJ: derivado nao se guarda](legalize-estado-recorrente-cnpj.md) — 14/09: 3 telas com 3 faturamentos viraram 1 fonte; o extrato inteiro pegou 2 bugs, um dobrando o imposto.
- [Escopo: ME Simples, Anexos III e V](legalize-escopo-me-simples-anexos-3-5.md) — 12/09 travado: virou dado + script nos 3 geradores. O enquadramento MUDA a regra (E0061).
- [Etiquetas dos Anexos III/IV/V](legalize-anexos-simples-etiquetas.md) — referencia fiscal (tabela, reparticao, Fator R, CPP), fonte LC 123. CPP fora do DAS no IV.
- [Pesquisa fiscal BH 2026](legalize-pesquisa-fiscal-bh-2026.md) — bloco consolidado em `fiscal-simples-bh-2026.md`; sem contradicao dura vs Gemini.
- [Lucro 2026 (Lei 15.270/2025) + Carta CFC](legalize-lucro-2026-e-carta-cfc.md) — 10/09: lucro sacado vai pra EFD-Reinf com IRRF antecipado. Carta CFC 1.590/2020 trava o fechamento.

## Persona, escopo e processos
- [Trava de PERSONA: o 2o filtro](legalize-trava-persona-produto.md) — 13/09: pega o que e legal no nosso regime e mesmo assim nao existe no produto. Proibido e POR CATEGORIA. INFORMAR, nunca TUTELAR.
- [Metodo virou CRONOLOGICO: persona zero](legalize-metodo-cronologico-persona-zero.md) — 13/09: ordem de execucao real, etiqueta de 3 vias (lei/decisao deles/defeito deles) + coluna do que NAO prova.
- [Modo cru: varredura por categoria](legalize-modo-cru-varredura-categoria.md) — 12/09: 2 campos obrigatorios, sem tela/API/semaforo. CONGELADO em 3 de 8 categorias.
- [Processo ANTES da tela](legalize-processo-antes-da-tela.md) — 11/09: inventario de tela e cego pro que falta. Board `/processos`, vermelho e o produto.
- [A doutrina de processos nao se enche sozinha](legalize-doutrina-processos-nao-se-enche-sozinha.md) — 11/09: §6 depende de alguem escrever; vigia avisa depois de 3 levas.
- [Nao matar um caminho corrigindo outro](legalize-nao-matar-caminho-multiplos-ramos.md) — 11/09: todo no depois de bifurcacao e compartilhado; simulador de caminhos no gerador.
- [O semaforo mede desenho, nao insumo](legalize-semaforo-mede-desenho-nao-insumo.md) — 12/09: 8 passos verdes dependiam de insumo sem entrega combinada. Dado nao vira cartao.
- [A abertura ja tem dono](legalize-fronteira-abertura-time-dev.md) — 12/09: time do dev cobre download→pagamento da guia; handoff e TABELA, nao caminho no board.
- [Escopo e so o ME abrir empresa](legalize-escopo-so-me-abrir.md) — 01/09: MEI e Migracao fora, salvo pedido; tela compartilhada exige guarda por regime.
- [Escopo MEI confirmado, Lucro Presumido fora](legalize-escopo-mei-lucro-presumido-aberto.md) — 04/08: MEI entra (inclusive Migrar); LP na saida "nao atendemos".
- [MVP so servico + corte comercio](legalize-mvp-so-servico-cnae.md) — 15/07: 200 CNAEs de comercio em standby. 🔴 limite de socios SUPERADO 29/08: teto e 4.

## Conta real do lider (evidencia, nao autoridade)
- [Achados da conta real, 13/09](legalize-achados-conta-real-13-09.md) — procuracao de 5 anos com confissao de debitos; intimacao nao lida no DTE; certificado em 16 min com senha junto.
- [Retirada sem lucro vira EMPRESTIMO ao socio](legalize-retirada-sem-lucro-vira-emprestimo.md) — 14/09: lancado em Creditos com Pessoas Ligadas, no ativo, sem bloquear nem avisar. Nota cancelada nao deixa rastro no Diario.
- [A API da a arquitetura, nunca a conta](legalize-api-nao-entrega-a-equacao.md) — 14/09: tela de Relatorios e leitor de resultado, nao motor. Equacao sai do recibo + lei + Mauro.
- [Metodo de teardown funcionalidade a funcionalidade](legalize-metodo-teardown-funcionalidade.md) — 09/09: conta de producao, so leitura; ler o DOM antes de clicar; refazer toda aritmetica.
- [Contrato do lider: enumera o incluso](legalize-contrato-lider-enumera-incluso.md) — 10/09: 11 clausulas + 3 anexos; a 4.2 e exclusao nominal; a 5.4 remete pro anexo errado.
- [Contrato + tabela real do lider](legalize-contrato-lider-achados.md) — 30/07: cliente paga TODAS taxas publicas; multa = 30% do SALDO; R$139 so ate R$25k/mes.
- [Dossie Contabilizei logada](legalize-contabilizei-dossie-coverage.md) — teardown ~85%: camada a-la-carte de ~45 servicos = receita oculta. Base do portal interno.
- [Portal ME/Simples: lista consolidada](legalize-portal-lista-consolidada.md) — 08/09: 51 funcionalidades, 31 construidas; "pagar o DAS pelo app" morreu em 27/07.
- [Tabela CNAE do lider extraida (387)](legalize-tabela-cnae-contabilizei-extraida.md) — dado em `window.__NUXT__`; fidelidade ALTA, veracidade nao-ratificada.
- [Benchmark Padrao R$195](legalize-benchmark-padrao-195.md) — 22/07: escada 139-395 + surcharge oculto + IGP-DI anual.

## APIs, dados e CNAE
- [API antes de funcionalidade](legalize-api-antes-de-funcionalidade.md) — 08/09: matriz em `produto/_matriz-dependencia.md`. Emitir NFS-e e emitir a guia do DAS decidem o produto.
- [APIs de orgaos = autoridade](legalize-apis-orgaos-autoridade.md) — 24/07, corrigida 04/08: CNPJ e Simples/SIMEI sao 2 endpoints pagos separados.
- [BH ja obriga o Emissor Nacional desde 01/11/2025](legalize-bh-emissor-nacional-desde-2025.md) — 12/09: empresa nova emite SEM inscricao municipal; nao existe procuracao na NFS-e.
- [MEI: obrigacoes operacionais + cobertura de API](legalize-mei-obrigacoes-e-apis.md) — 27/08: NFS-e nacional via API federal unica; zero monitor oficial de teto (diferencial).
- [Camada tributaria CNAE: os 4 dados fechados](legalize-cnae-camada-tributaria-4-dados-completa.md) — 27/08: MEI, risco, Anexo/FatorR e ISS BH nos 1332 CNAEs. Nao ratificado por contador.
- [Fundamentos CNAE ratificados](legalize-cnae-fundamentos-ratificados-mei-vs-me.md) — 27/08: MEI≠ME, sem lista "sempre V", sem margem 28%. Matriz com 1332 CNAEs (IBGE completo).
- [CNAE fiscalmente otimo](legalize-cnae-fiscalmente-otimo.md) — recomenda o CNAE mais barato que cobre a mesma atividade; engine pronta, falta Larissa ratificar.
- [Complexidade de abertura (liso/verificar/tato)](legalize-cnae-complexidade-abertura.md) — eixo ortogonal ao fiscal; 103 servico-liso = happy path do MVP.
- [Equacao fiscal viva: camadas CNAE + CNPJ](legalize-equacao-fiscal-camadas-cnae-cnpj.md) — 27/08: provocacao em andamento, sem desenho final.
- [DER modelagem-cnae: cruzamento pausado](legalize-der-cnae-cruzamento-achados.md) — 27/08: fiscal.ts sem Anexo IV (bug real), refs fantasma no DER.

## Produto, telas e flow
- [Pasta produto/ e a fonte-verdade das funcionalidades](legalize-pasta-produto-fonte-verdade.md) — 09/09: spec viva e evidencia datada SEPARADAS.
- [Metodo de alteracao de tela travado](legalize-metodo-alteracao-tela-travado.md) — 03/09: pre-voo, lote por tela, sintoma repetido = raiz. 2 auditorias no gerador.
- [Mapa e espelho da apresentacao](legalize-espelho-mapa-apresentacao.md) — 02/09: uma colecao de telas, duas vistas; pills derivam do flow-data.
- [Mapa vivo do flow (gerado)](legalize-mapa-flow-vivo.md) — `execucao/mapa-flow-mermaid.md` e GERADO; fonte unica `flow/flow-data.mjs`.
- [Mapa e estatico, reposicao entra na apresentacao junto](legalize-mapa-estatico-apresentacao-junto.md) — 28/08: mexe nos dois sempre; `/mockup` fica de fora.
- [Replica de tela se PORTA, nao se remonta](legalize-replica-de-tela-se-porta.md) — 07/09: 5 telas erradas no mesmo dia; nasceu `verificar-anatomia-mei.mjs`.
- [Fork do ramo MEI](legalize-fork-ramo-mei.md) — 07/09: MEI virou caminho proprio; heranca por prop custou 4 defeitos em 8 dias.
- [Padrao de layout das telas](legalize-telas-padrao-layout.md) — titulo fixo/corpo rola/CTA fixo; `lib/passos.ts` fonte unica.
- [Reordenacao + telas em CODIGO](legalize-reordenacao-e-telas-em-codigo.md) — 16/07: cobra no N9; sem Figma, app em `app/`. Regra dos 3.
- [Portal do cliente construido (mockup)](legalize-portal-telas-construidas.md) — MLP fechado 27/07: 19 telas sem stub.
- [Portal tem flow salvo, mas defasado e sem MEI](legalize-portal-drift-mei.md) — 27/08: `portal-data.mjs` congelou 28/07.
- [Portal interno + laboratorio + acervo](legalize-portal-interno-lab-acervo.md) — 22/07: portal dia-2 + acervo `/componentes`.
- [Portal: monetizacao em 3 baldes](legalize-portal-monetizacao-baldes.md) — incluir(core) · vendavel(a-la-carte) · cortar · rejeitar(anti-dark-pattern).
- [Apresentacao pra gestao = demo + lente UX](legalize-apresentacao-gestao.md) — 29/07: split-screen, dono da pausa em 3 cores.
- [Pill estreita, nao valida (N4)](legalize-pill-estreita-nao-valida.md) — 17/07: pill descreve mais, IA cruza, aceite, pagamento.
- [Blocos do fluxo (spec Pedro x Dev)](legalize-blocos-fluxo-abertura.md) — B1+B2+B3 travados 14/07; mini-loop de desambiguacao CNAE.
- [Flow #2 (migrar) construido](legalize-flow-2-migrar-construido.md) — 30/07: 9 telas M1-M5; cobra ANTES do TTRT com devolucao escrita.
- [Reta final: 2 assinaturas + videochamada do certificado](legalize-reta-final-certificado-e-assinaturas.md) — 05/09: 1a = todos os socios · 2a = contador + representante.
- [Certificado do MEI virou gate E cobranca](legalize-certificado-vira-gate-e-cobranca.md) — 07/09: sem ele o app nao libera. Pede clausula com o Mauro.
- [Regra de orgao nao se deduz, se pergunta](legalize-regra-de-orgao-nao-se-deduz.md) — 05/09: a procuracao teve 5 versoes em 2 dias, 4 deduzidas por mim.
- [Gravacao da JUCEMG e fonte-verdade do flow](legalize-gravacao-jucemg-fonte-primaria.md) — 31/08: 141 prints da constituicao real.
- [Reuniao Rua Satelite 9 — 12 decisoes](legalize-reuniao-rua-satelite-9.md) — 28/07: gate cidade BH-MG, veredito 3 vias, IPTU obrigatorio.
- [So o uso real corrige o mapa](legalize-uso-real-corrige-o-mapa.md) — 12/09: emitimos NF de verdade e o uso achou 3 erros conceituais.
- [UX-48: trilha unica + coorte instrumentada](legalize-trilha-unica-ux48.md) — NAO bifurca UX por perfil; densidade muda apresentacao, jamais obrigacao.
- [Log-UX vivo + regra UI-inline](legalize-log-ux-flow-e-regra-ui.md) — `compilado-ux-flow.md` = fonte unica do que otimizar.
- [MLP, nao MVP](legalize-mlp-nao-mvp.md) — minimo LOVABLE; craft/animacao no escopo.
- [Dashboard de administracao: priorizacao](legalize-dashboard-adm-priorizacao.md) — 23/07: 3 abas; corte por disponibilidade-de-dado.
- [Auditoria copy E5 + MEI trocou contador por certificado](legalize-auditoria-copy-e5-e-mei-certificado.md) — 06/08.

## Testes
- [Suite de teste do Flutter: 20 personas](legalize-suite-teste-flutter-personas.md) — 14/09: `execucao/testes-flutter/`, P01 rodou ate o E9.1P. PARADO por pedido do Pedro; 3 fios abertos.
- [O prototipo Next.js NAO descreve mais o Flutter](legalize-prototipo-nextjs-nao-descreve-flutter.md) — 14/09: 2 erros meus no mesmo dia por ler a fonte errada com confianca de fonte certa.
- [Nao rodar e2e sem pedir](legalize-nao-rodar-e2e-sem-pedir.md) — 30/08, reforcado 3x: um "pode rodar" vale so pra aquela rodada. Escrever spec e livre; EXECUTAR pede pedido.
- [Motor de testes: arquitetura](legalize-motor-testes-arquitetura.md) — v0.5.0, 19 personas, 2 flows. 🔴 desatualizado desde 28/07.
- [Pedro confere UI sozinho](legalize-pedro-confere-ui-sozinho.md) — subir porta local pode; abrir navegador pra CONFERIR nao. `next build` com dev ativo corrompe `.next`.
- [Storybook = fonte de verdade renderizada](legalize-storybook-fonte-verdade.md) — 31/07: 33+ stories. Deploy Vercel pendente.

## Contrato, precos e negocio
- [Decisoes do NOSSO contrato ME](legalize-contrato-proprio-decisoes.md) — 10/09, minuta enviada a advogada: 16 clausulas; 3 coortes ME (79/99/139); folha R$39 teto 10; migracao REMOVIDA.
- [Billing = fatura por competencia](legalize-cobranca-fatura-competencia.md) — 11/09: itens de linha, `plano: null`, competencia AAAAMM; gateway por ultimo.
- [Endereco fiscal = R$49/mes](legalize-endereco-fiscal-49.md) — 11/09 revoga o R$60. ⚠️ colide com o preco do plano MEI, tambem R$49.
- [Asaas fora, Pagar.me em avaliacao](legalize-gateway-asaas-fora.md) — 08/09: o formato do Asaas nos jogaria pro escopo PCI.
- [Preco DEFERIDO ate custo real](legalize-preco-deferido-custo-real.md) — 16/07: placeholder ~R$195 FAKE; nao reabrir sem o Pedro mencionar.
- [Objetivo e papel do Pedro](legalize-objetivo-e-papel-pedro.md) — negocio fechado com Mauro 07/07; Pedro PM/socio; `BASE-ESTRATEGICA.md` = fonte da verdade.
- [A casa tem DOIS CNPJs](legalize-entidades-duas-empresas.md) — 10/09: Legalizai Tecnologia (41.569.345/0001-48) + Legalize Auditoria (12.423.332/0001-68, CRC-MG 007900/O).
- [Dominios e infra](legalize-dominios-infra.md) — 4 dominios Hostinger pagos 13/07; falta DNS Vercel + email.
- [Marca no INPI (thread aberto)](legalize-marca-inpi.md) — risco de nome descritivo + colisao Contabilizei.
- [Reorg repo inteiro, 25/08](legalize-reorg-repo-inteiro-25-08.md) — FECHADO: 8 commits + `financeiro/` novo.

## Marca, marketing e agente
- [Estrategia de marketing/produto completa](legalize-estrategia-marketing-completa.md) — 05/08: 14/14 slots; preco ME R$139; CAC-alvo por LTV; 12 personas.
- [Puntel valida a estrategia INTEIRA](legalize-doc-estrategia-mkt-validacao.md) — 12/08: par de validacao estrategica, nao fornecedor de midia.
- [Primeira campanha fechada ponta a ponta](legalize-primeira-campanha-fechada.md) — 20-21/08: 24 pecas auditadas, 0 reprovacoes.
- [Atelie substitui agentes copywriter/guardian](legalize-atelie-substitui-agentes-copywriter-guardian.md) — 25/08: engine `atelie/` troca os 2 subagentes arquivados.
- [Vault isolado do agente de WhatsApp](legalize-agente-whatsapp-vault-isolado.md) — 04/09: 12 arquivos em runtime; os 1332 CNAEs viram tool com gate por confianca.
- [Personalidade do Leo mora em 4 lugares](legalize-leo-personalidade-4-copias.md) — 04/09: fonte e `marca/personagem-leo.md`; a copia do Atelie divergiu.
- [Video de investidor: 3 propostas de escalada](legalize-video-investidor-escalada.md) — 13-14/08: provocacao mora na palavra, nao na entonacao.
- [Base de copy/tom-de-voz e PARCIAL](legalize-base-copy-insuficiente.md) — 05/08: falta glossario tecnico + exemplos por tela.
- [Copy SEM travessao](legalize-copy-sem-travessao.md) — REGRA DURA: nenhum texto publico usa travessao.
- [Auditoria de copy + rubrica viva](legalize-auditoria-copy-rubrica.md) — rubrica D1-D11; sobra so V4 (Larissa).
- [Rename → Legalizai](legalize-rename-legalizai.md) — 03/08: marca virou Legalizai no app; rename brand-level e decisao aberta de socio.
- [LP virou a raiz, em modo pre-lancamento](legalize-lp-na-raiz-modo-espera.md) — 11/09 no ar. 🔴 `lp/_lab` e a FONTE e nao esta versionada.
- [LP institucional + rebrand + paginas legais](legalize-lp-atualizada-rebrand-legal.md) — 03/08: LP + coming-soon no ar.
- [LP construida](legalize-lp-construida.md) — v1 HTML/CSS/JS puros; regra AA coral travada.

## Design e assets
- [Design system em HTML](legalize-design-system-html.md) — `marca/identidade-visual/design-system.html`, referencia viva.
- [Raio de card = rounded-2xl](legalize-card-radius-padrao.md) — cards `rounded-2xl` (16px); inputs `rounded-xl`.
- [Fonte Sora = sistema inteiro](legalize-fonte-sora-sistema.md) — travado 12/07.
- [Tema escuro legalizai x CRM](legalize-tema-escuro-legalizai-story-book-crm.md) — `globals.css` e fonte canonica; app light-only na pratica.
- [Encaixe de asset se MEDE, nao se estima](legalize-encaixe-asset-medido-nao-no-olho.md) — 01/09: achar o pixel do corte por coluna e derivar por formula.
- [Halo escuro = alfa premultiplicado](legalize-alfa-premultiplicado-halo-escuro.md) — 01/09: comparar cor de borda x solido antes de culpar cache.
- [Mockup 3D do iPhone no Blender](legalize-blender-iphone-mockup-pipeline.md) — 21/08: UV dedicado + flip, min. 432dpi, HDRI Poly Haven.
- [Doutrina do pipeline vetor Illustrator](legalize-illustrator-vector-pipeline-doutrina.md) — 21/08: MCP nao cria geometria; ponte entre docs e manual.

## Metodo de trabalho e vault
- [Documento importante se le INTEIRO](legalize-leitura-integral-documento.md) — 10/09 TRAVADO: 100% literal salvo em arquivo, e o que ficou de fora vira lista com nome.
- [Escrever arquivo so via Edit/Write](legalize-escrita-arquivo-so-edit-write.md) — 01/09: script Python truncou 2 arquivos do vault. Reincidiu em 15/09 (UnicodeEncodeError no print).
- [Edicao simples se resolve com Edit direto](legalize-edicao-simples-editar-direto.md) — 05/09: nada de script de patch nem e2e em pedido pontual de layout.
- [Vocabulario do vault: doutrina virou trava](legalize-vocabulario-tipo-derivou.md) — 09/09 RESOLVIDO: `verificar.js` estava cego em 79% por CRLF.
- [Vault: indice de autoridade + fila humana](legalize-vault-organizado.md) — `_sistema/indice-autoridade.md` diz quem manda em cada assunto.
- [Worktrees: branches irmas do vault](legalize-worktree-reorg-branches.md) — `.obsidian` trackeado duplica notas.
- [Pesquisa grande roda via Gemini](legalize-pesquisa-grande-via-gemini.md) — 05/08: Pedro roda fora e cola; nao pesquisar direto na sessao.
- [PR automatico quando pedido](legalize-git-pr-automatico.md) — 05/08: commit + `gh pr create` sem confirmar; NAO inclui merge.
- [Handoff pro dev: repo base-flow](legalize-handoff-dev-repo.md) — 19/07: schema e contrato de comportamento, nao arquitetura pra copiar.
- [Armadilha do PDF via Chrome headless](legalize-pdf-chrome-headless-armadilha.md) — 12/08: PDF "sucesso" pode ser print de erro; validar com `pypdf`.
- [Janela de contexto: ~1M](legalize-janela-contexto-1m.md) — NAO emitir linha de saude nem sugerir `/fechar` por aquecimento.
- [Reorganizacao flow/telas/design em curso](legalize-reorganizacao-flow-design-em-curso.md) — 31/07: pergunta do Pedro ficou sem resposta, nao presumir.
- [Cluster fiscal reordenado (ENCAIXE)](legalize-encaixe-cluster-fiscal.md) — 21/07: CNAE escolhido pre-pago, nao em swap tardio.
