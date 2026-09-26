# Memory Index — Legalize

## O agente do WhatsApp (Leo)
- [Trocar a chave do Gemini: o teste que vale](legalize-troca-chave-gemini-teste-certo.md) — 22/09: 200 em /models nao prova nada; generateContent + embedContent, sim.
- [A base do Leo: o fatiador e as 3 ondas](legalize-base-do-leo-fatiador-e-ondas.md) — 22/09: 5.922 chars invisiveis (a tabela do dossie inteira); 63 -> 100 trechos; busca 9/10 -> 12/12.
- [Descricao de tool nao move chamada](legalize-descricao-de-tool-nao-move-chamada.md) — 22/09: 4 tools dizem OBRIGATORIA e estao em zero; proibir string funciona, mandar chamar nao. Codigo move.
- [O numero do Leo esta em TESTE](legalize-leo-numero-em-teste.md) — 22/09 travado: sem cliente real; restart/build sem janela de silencio. Intocavel e a SESSAO pareada, nao o server.
- [Os servicos do Leo sao de USUARIO](legalize-servicos-do-leo-sao-de-usuario.md) — 25/09: `systemctl --user restart leo-sidecar`. Sem `--user` da vazio e parece nao existir; ha supervisor, e `kill` + `nohup` criou 2 servers na mesma fila.
- [O Leo trocou de motor, e esta em producao](legalize-sidecar-em-producao.md) — 21/09 02:20: Node+Postgres+pgvector no ar; o codigo de producao NAO esta no repo.
- [Regra negativa nao impede alucinacao](legalize-regra-negativa-nao-impede-alucinacao.md) — 21/09 medido 4x: obrigar a consulta antes da afirmacao, sim.
- [A busca de CNAE fechou em 21/21, com 3 camadas](legalize-busca-cnae-tres-camadas.md) — 24/09: teto de 0.30 no termo cruzado + bonus de corroboracao + sinonimo. Alias e DADO: so entra por `seed:cnae`, nunca por deploy.
- [A doc do agente envelhece CALADA](legalize-doc-do-agente-envelhece-calada.md) — 25/09: campo inexistente numa regra vira condicao insatisfazivel; o RULES recusava 36 dos 87 atendidos.
- [Lei Zero: o dossie-leo e SUCESSORA das 13 notas](legalize-lei-zero-dossie-leo.md) — 25/09: copiar fato pra pasta nova duplica na mesma tabela vetorizada. `_auditar.mjs` varre 22 fatos com dono.
- [Qual persona tem VOZ](legalize-qual-persona-tem-voz.md) — 25/09: o elenco do Flutter e fixture sem voz; caso bom e voz (volante) x situacao (dossie).
- [Numero mora em UM lugar so](legalize-numero-mora-em-um-lugar-so.md) — 25/09: 58 cravado x 55 em arquivo derrubou o deploy 9 commits depois.
- [Sinonimo e FRASE, nao verbo solto](legalize-sinonimo-cnae-e-frase-nao-verbo.md) — 24/09 travado: 4 dos 87 tem venda na propria atividade; alias amplo troca A3 por falso negativo pior.

## Motor fiscal e estado do CNPJ
- [O CONTADOR VALIDA O MOTOR](legalize-contador-valida-o-motor.md) — 16/09: 1a validacao por contador (~5h, 293k caracteres).
- [Os 7 passos que levaram a reuniao ate o codigo](legalize-aplicacao-das-decisoes-do-contador.md) — 16/09: a fila vem antes do motor. 3a copia da CPP errada. 32 -> 54 invariantes.
- [O ciclo do CNPJ: 10 obrigacoes, prazo e CANAL](legalize-ciclo-do-cnpj-e-canais.md) — 15/09: lista FECHADA. eSocial dia 15 vence antes do DAS dia 20.
- [O gate de elegibilidade ao Simples nao existia](legalize-gate-elegibilidade-simples.md) — 15/09: 4 vedacoes nos atingem.
- [A guia somava os socios e cobrava como UM](legalize-darf-por-socio-nao-por-empresa.md) — 15/09: R$3.617 onde o certo.
- [O piloto AJUSTA o pro-labore sozinho](legalize-piloto-pro-labore-automatico.md) — 15/09: produto age, nao avisa (Fator R.
- [A regua de prova: fonte oficial fecha a REGRA](legalize-regua-de-prova-fonte-oficial.md) — 15/09: documento fecha.
- [Anexo V tinha DUAS lacunas, so uma fechou](legalize-anexo-v-duas-lacunas.md) — 15/09: simulacao fecha COMPORTAMENTO, nunca.
- [O Fator R e RETROVISOR](legalize-fator-r-e-retrovisor.md) — 15/09: corrigir hoje nao conserta hoje (P01 so volta ao III.
- [Os 2 motores fiscais duplicados](legalize-dois-motores-fiscais-duplicados.md) — 14/09: 7 de 7 constantes duplicadas.
- [O apurador fiscal existe e bate ao centavo](legalize-motor-fiscal-apurador-existe.md) — 14/09; mora em `produto/me/viver/motor/` desde 17/09.
- [Motor fiscal: arredonda por TRIBUTO](legalize-motor-fiscal-arredonda-por-tributo.md) — 13/09: DAS = soma de 6 parcelas.
- [Estado recorrente de CNPJ: derivado nao se guarda](legalize-estado-recorrente-cnpj.md) — 14/09: 3 telas com 3 faturamentos.
- [Escopo: ME Simples, Anexos III e V](legalize-escopo-me-simples-anexos-3-5.md) — 12/09 travado: virou dado + script nos 3.
- [A LC 123 tem DOIS residuais, e o `requer-revisao` morreu](legalize-dois-residuais-lc123.md) — 24/09: "nao achei inciso" E a resposta; motor 80/87 -> 87/87.
- [Irmao de classe confirma ou veta, nunca decide](legalize-coerencia-de-classe-cnae.md) — 24/09: 106 concordam x 15 divergem; casar contra `atividades` deu 101 mudancas lixo.
- [Etiquetas dos Anexos III/IV/V](legalize-anexos-simples-etiquetas.md) — referencia fiscal (tabela, reparticao, Fator R, CPP).
- [Pesquisa fiscal BH 2026](legalize-pesquisa-fiscal-bh-2026.md) — bloco consolidado em `fiscal-simples-bh-2026.md`.
- [Lucro 2026 (Lei 15.270/2025) + Carta CFC](legalize-lucro-2026-e-carta-cfc.md) — 10/09: lucro sacado vai pra EFD-Reinf.

## Persona, escopo e processos
- [Trava de PERSONA: o 2o filtro](legalize-trava-persona-produto.md) — 13/09: pega o que e legal no nosso regime e mesmo assim.
- [Metodo virou CRONOLOGICO: persona zero](legalize-metodo-cronologico-persona-zero.md) — 13/09: ordem de execucao real.
- [Modo cru: varredura por categoria](legalize-modo-cru-varredura-categoria.md) — 12/09: 2 campos obrigatorios, sem.
- [Processo ANTES da tela](legalize-processo-antes-da-tela.md) — 11/09: inventario de tela e cego pro que falta.
- [A doutrina de processos nao se enche sozinha](legalize-doutrina-processos-nao-se-enche-sozinha.md) — 11/09: §6 depende.
- [Nao matar um caminho corrigindo outro](legalize-nao-matar-caminho-multiplos-ramos.md) — 11/09: todo no depois de bifurcacao.
- [O semaforo mede desenho, nao insumo](legalize-semaforo-mede-desenho-nao-insumo.md) — 12/09: 8 passos verdes dependiam.
- [A abertura ja tem dono](legalize-fronteira-abertura-time-dev.md) — 12/09: time do dev cobre download→pagamento da guia.
- [Escopo e so o ME abrir empresa](legalize-escopo-so-me-abrir.md) — 01/09: MEI e Migracao fora, salvo pedido.
- [Escopo MEI confirmado, Lucro Presumido fora](legalize-escopo-mei-lucro-presumido-aberto.md) — 04/08: MEI entra (inclusive.
- [MVP so servico + corte comercio](legalize-mvp-so-servico-cnae.md) — 15/07: 200 CNAEs de comercio em standby.

## Conta real do lider (evidencia, nao autoridade)
- [Achados da conta real, 13/09](legalize-achados-conta-real-13-09.md) — procuracao de 5 anos com confissao de debitos.
- [Retirada sem lucro vira EMPRESTIMO ao socio](legalize-retirada-sem-lucro-vira-emprestimo.md) — 14/09: lancado em Creditos.
- [A API da a arquitetura, nunca a conta](legalize-api-nao-entrega-a-equacao.md) — 14/09: tela de Relatorios e leitor.
- [Metodo de teardown funcionalidade a funcionalidade](legalize-metodo-teardown-funcionalidade.md) — 09/09: conta de producao.
- [Contrato do lider: enumera o incluso](legalize-contrato-lider-enumera-incluso.md) — 10/09: 11 clausulas + 3 anexos; a 4.2.
- [Contrato + tabela real do lider](legalize-contrato-lider-achados.md) — 30/07: cliente paga TODAS taxas publicas.
- [Dossie Contabilizei logada](legalize-contabilizei-dossie-coverage.md) — teardown ~85%: camada a-la-carte de ~45 servicos =.
- [Portal ME/Simples: lista consolidada](legalize-portal-lista-consolidada.md) — 08/09: 51 funcionalidades, 31 construidas.
- [Tabela CNAE do lider extraida (387)](legalize-tabela-cnae-contabilizei-extraida.md) — dado em `window.__NUXT__`; fidelidade.
- [Benchmark Padrao R$195](legalize-benchmark-padrao-195.md) — 22/07: escada 139-395 + surcharge oculto + IGP-DI anual.

## APIs, dados e CNAE
- [API antes de funcionalidade](legalize-api-antes-de-funcionalidade.md) — 08/09: matriz em `produto/me/viver/_matriz-dependencia.md`.
- [APIs de orgaos = autoridade](legalize-apis-orgaos-autoridade.md) — 24/07, corrigida 04/08: CNPJ e Simples/SIMEI sao 2.
- [BH ja obriga o Emissor Nacional desde 01/11/2025](legalize-bh-emissor-nacional-desde-2025.md) — 12/09: empresa nova emite.
- [MEI: obrigacoes operacionais + cobertura de API](legalize-mei-obrigacoes-e-apis.md) — 27/08: NFS-e nacional via API federal.
- [Camada tributaria CNAE: os 4 dados fechados](legalize-cnae-camada-tributaria-4-dados-completa.md) — 27/08: MEI, risco.
- [Fundamentos CNAE ratificados](legalize-cnae-fundamentos-ratificados-mei-vs-me.md) — 27/08: MEI≠ME, sem lista "sempre V", sem.
- [CNAE fiscalmente otimo](legalize-cnae-fiscalmente-otimo.md) — recomenda o CNAE mais barato que cobre a mesma atividade.
- [Risco de CNAE: em BH manda o Decreto 17.245, nao a CGSIM](legalize-risco-cnae-norma-de-bh-prevalece.md) — 18/09: usamos a norma federal subsidiaria e nunca lemos a de BH.
- [Complexidade de abertura (liso/verificar/tato)](legalize-cnae-complexidade-abertura.md) — eixo ortogonal ao fiscal; 103.
- [Equacao fiscal viva: camadas CNAE + CNPJ](legalize-equacao-fiscal-camadas-cnae-cnpj.md) — 27/08: provocacao em andamento.
- [DER modelagem-cnae: cruzamento pausado](legalize-der-cnae-cruzamento-achados.md) — 27/08: fiscal.ts sem Anexo IV (bug real).

## Produto, telas e flow
- [Pasta produto/ e a fonte-verdade das funcionalidades](legalize-pasta-produto-fonte-verdade.md) — 09/09: spec viva.
- [Metodo de alteracao de tela travado](legalize-metodo-alteracao-tela-travado.md) — 03/09: pre-voo, lote por tela, sintoma.
- [Mapa e espelho da apresentacao](legalize-espelho-mapa-apresentacao.md) — 02/09: uma colecao de telas, duas vistas.
- [Mapa vivo do flow (gerado)](legalize-mapa-flow-vivo.md) — `produto/_flow/mapa-flow-mermaid.md` e GERADO.
- [Mapa e estatico, reposicao entra na apresentacao junto](legalize-mapa-estatico-apresentacao-junto.md) — 28/08: mexe nos dois.
- [Replica de tela se PORTA, nao se remonta](legalize-replica-de-tela-se-porta.md) — 07/09: 5 telas erradas no mesmo dia.
- [Fork do ramo MEI](legalize-fork-ramo-mei.md) — 07/09: MEI virou caminho proprio.
- [Padrao de layout das telas](legalize-telas-padrao-layout.md) — titulo fixo/corpo rola/CTA fixo; `lib/passos.ts` fonte unica.
- [Reordenacao + telas em CODIGO](legalize-reordenacao-e-telas-em-codigo.md) — 16/07: cobra no N9; sem Figma, app em `app/`.
- [Portal do cliente construido (mockup)](legalize-portal-telas-construidas.md) — MLP fechado 27/07: 19 telas sem stub.
- [Portal tem flow salvo, mas defasado e sem MEI](legalize-portal-drift-mei.md) — 27/08: `portal-data.mjs` congelou 28/07.
- [Portal interno + laboratorio + acervo](legalize-portal-interno-lab-acervo.md) — 22/07: portal dia-2 + acervo `/componentes`.
- [Portal: monetizacao em 3 baldes](legalize-portal-monetizacao-baldes.md) — incluir(core) · vendavel(a-la-carte) · cortar ·.
- [Apresentacao pra gestao = demo + lente UX](legalize-apresentacao-gestao.md) — 29/07: split-screen, dono da pausa em 3 cores.
- [Pill estreita, nao valida (N4)](legalize-pill-estreita-nao-valida.md) — 17/07: pill descreve mais, IA cruza, aceite.
- [Blocos do fluxo (spec Pedro x Dev)](legalize-blocos-fluxo-abertura.md) — B1+B2+B3 travados 14/07; mini-loop de desambiguacao.
- [Flow #2 (migrar) construido](legalize-flow-2-migrar-construido.md) — 30/07: 9 telas M1-M5; cobra ANTES do TTRT com devolucao.
- [Reta final: 2 assinaturas + videochamada do certificado](legalize-reta-final-certificado-e-assinaturas.md) — 05/09: 1a =.
- [Certificado do MEI virou gate E cobranca](legalize-certificado-vira-gate-e-cobranca.md) — 07/09: sem ele o app nao libera.
- [Regra de orgao nao se deduz, se pergunta](legalize-regra-de-orgao-nao-se-deduz.md) — 05/09: a procuracao teve 5 versoes em 2.
- [Gravacao da JUCEMG e fonte-verdade do flow](legalize-gravacao-jucemg-fonte-primaria.md) — 31/08: 141 prints da constituicao.
- [Reuniao Rua Satelite 9 — 12 decisoes](legalize-reuniao-rua-satelite-9.md) — 28/07: gate cidade BH-MG, veredito 3 vias, IPTU.
- [So o uso real corrige o mapa](legalize-uso-real-corrige-o-mapa.md) — 12/09: emitimos NF de verdade e o uso achou 3 erros.
- [UX-48: trilha unica + coorte instrumentada](legalize-trilha-unica-ux48.md) — NAO bifurca UX por perfil; densidade muda.
- [Log-UX vivo + regra UI-inline](legalize-log-ux-flow-e-regra-ui.md) — `compilado-ux-flow.md` = fonte unica do que otimizar.
- [MLP, nao MVP](legalize-mlp-nao-mvp.md) — minimo LOVABLE; craft/animacao no escopo.
- [Dashboard de administracao: priorizacao](legalize-dashboard-adm-priorizacao.md) — 23/07: 3 abas; corte.
- [Auditoria copy E5 + MEI trocou contador por certificado](legalize-auditoria-copy-e5-e-mei-certificado.md) — 06/08.

## Testes
- [A persona do motor e SO vidas.mjs](legalize-persona-unica-vidas-mjs.md) — 17/09 travado: o elenco do Flutter nao tem a ver com esse fluxo.
- [A bancada Pedro Personas](legalize-bancada-pedro-personas.md) — 21-22/09: roteiros+rodadas+8 blocos+mapa; decisao A fechou o B-001; frente do MOTOR (aneis 2 e 3 prontos, custo zero) em MOTOR-ESTADO.md.
- [Suite de teste do Flutter: 24 personas](legalize-suite-teste-flutter-personas.md) — 14/09, ampliada 17/09: P21-P24 provam a ausencia do gate.
- [O prototipo Next.js NAO descreve mais o Flutter](legalize-prototipo-nextjs-nao-descreve-flutter.md) — 14/09: 2 erros meus.
- [Nao rodar e2e sem pedir](legalize-nao-rodar-e2e-sem-pedir.md) — 30/08, reforcado 3x: um "pode rodar" vale so pra aquela.
- [Motor de testes: ARQUIVADO](legalize-motor-testes-arquitetura.md) — 17/09: autoridade fantasma de 21/07; quem manda e o `flow-data.mjs`.
- [Pedro confere UI sozinho](legalize-pedro-confere-ui-sozinho.md) — subir porta local pode; abrir navegador pra CONFERIR.
- [Storybook = fonte de verdade renderizada](legalize-storybook-fonte-verdade.md) — 31/07: 33+ stories. Deploy Vercel pendente.

## Contrato, precos e negocio
- [Decisoes do NOSSO contrato ME](legalize-contrato-proprio-decisoes.md) — 10/09, minuta enviada a advogada: 16 clausulas.
- [Billing = fatura por competencia](legalize-cobranca-fatura-competencia.md) — 11/09: itens de linha, `plano: null`.
- [Preco de lancamento: R$29 e R$99](legalize-preco-lancamento-29-99.md) — 17/09: 3 primeiros meses, ate 31/12/2026, pela lista de espera. R$19/R$79 mortos.
- [Endereco fiscal = R$49/mes](legalize-endereco-fiscal-49.md) — 11/09 revoga o R$60. ✅ a colisao com o plano MEI some em 17/09.
- [Asaas fora, Pagar.me em avaliacao](legalize-gateway-asaas-fora.md) — 08/09: o formato do Asaas nos jogaria pro escopo PCI.
- [Preco DEFERIDO ate custo real](legalize-preco-deferido-custo-real.md) — 16/07: placeholder ~R$195 FAKE; nao reabrir sem.
- [Objetivo e papel do Pedro](legalize-objetivo-e-papel-pedro.md) — negocio fechado com Mauro 07/07; Pedro PM/socio.
- [A casa tem DOIS CNPJs](legalize-entidades-duas-empresas.md) — 10/09: Legalizai Tecnologia (41.569.345/0001-48) + Legalize.
- [Dominios e infra](legalize-dominios-infra.md) — 4 dominios Hostinger pagos 13/07; falta DNS Vercel + email.
- [Marca no INPI (thread aberto)](legalize-marca-inpi.md) — risco de nome descritivo + colisao Contabilizei.
- [Reorg repo inteiro, 25/08](legalize-reorg-repo-inteiro-25-08.md) — FECHADO: 8 commits + `financeiro/` novo.

## Marca, marketing e agente
- [Estrategia de marketing/produto completa](legalize-estrategia-marketing-completa.md) — 05/08: 14/14 slots; preco ME R$139.
- [Puntel valida a estrategia INTEIRA](legalize-doc-estrategia-mkt-validacao.md) — 12/08: par de validacao estrategica.
- [Primeira campanha fechada ponta a ponta](legalize-primeira-campanha-fechada.md) — 20-21/08: 24 pecas auditadas, 0.
- [Atelie substitui agentes copywriter/guardian](legalize-atelie-substitui-agentes-copywriter-guardian.md) — 25/08: engine.
- [Vault do agente de WhatsApp: fonte-verdade e o repo](legalize-agente-whatsapp-vault-isolado.md) — 19/09: SOUL + 4 skills + 13 notas + _testes/; os 1332 CNAEs viram tool.
- [Numero no prompt sempre-carregado mata a consulta](legalize-numero-no-prompt-mata-consulta.md) — 19/09: o 10-CONTRATO foi aberto 1 vez em 632 porque o SOUL entregava os numeros dele.
- [Personalidade do Leo mora em 4 lugares](legalize-leo-personalidade-4-copias.md) — 04/09: fonte e `marca/personagem-leo.md`.
- [Video de investidor: 3 propostas de escalada](legalize-video-investidor-escalada.md) — 13-14/08: provocacao mora na palavra.
- [Base de copy/tom-de-voz e PARCIAL](legalize-base-copy-insuficiente.md) — 05/08: falta glossario tecnico + exemplos por tela.
- [Copy SEM travessao](legalize-copy-sem-travessao.md) — REGRA DURA: nenhum texto publico usa travessao.
- [Auditoria de copy + rubrica viva](legalize-auditoria-copy-rubrica.md) — rubrica D1-D11; sobra so V4 (Larissa).
- [Rename → Legalizai](legalize-rename-legalizai.md) — 03/08: marca virou Legalizai no app.
- [LP virou a raiz, em modo pre-lancamento](legalize-lp-na-raiz-modo-espera.md) — 11/09 no ar. 🔴 `lp/_lab` e a FONTE.
- [LP institucional + rebrand + paginas legais](legalize-lp-atualizada-rebrand-legal.md) — 03/08: LP + coming-soon no ar.
- [LP construida](legalize-lp-construida.md) — v1 HTML/CSS/JS puros; regra AA coral travada.

## Design e assets
- [Design system em HTML](legalize-design-system-html.md) — `marca/identidade-visual/design-system.html`, referencia viva.
- [Raio de card = rounded-2xl](legalize-card-radius-padrao.md) — cards `rounded-2xl` (16px); inputs `rounded-xl`.
- [Fonte Sora = sistema inteiro](legalize-fonte-sora-sistema.md) — travado 12/07.
- [Tema escuro legalizai x CRM](legalize-tema-escuro-legalizai-story-book-crm.md) — `globals.css` e fonte canonica; app.
- [Encaixe de asset se MEDE, nao se estima](legalize-encaixe-asset-medido-nao-no-olho.md) — 01/09: achar o pixel do corte.
- [Halo escuro = alfa premultiplicado](legalize-alfa-premultiplicado-halo-escuro.md) — 01/09: comparar cor de borda x solido.
- [Mockup 3D do iPhone no Blender](legalize-blender-iphone-mockup-pipeline.md) — 21/08: UV dedicado + flip, min. 432dpi, HDRI.
- [Doutrina do pipeline vetor Illustrator](legalize-illustrator-vector-pipeline-doutrina.md) — 21/08: MCP nao cria geometria.

## Metodo de trabalho e vault
- [A arvore do produto: me/mei x entrar/viver/desenquadrar](legalize-arvore-produto-me-mei.md) — 17/09: a arvore FECHADA, em 6 etapas. `execucao/` = negocio e operacao, nao produto.
- [Doc declarado e ausente e DEFEITO](legalize-doc-declarado-ausente-e-defeito.md) — 17/09: 4 travas passariam verdes sem ler nada.
- [Caminho relativo falha CALADO](legalize-caminho-relativo-falha-calado.md) — 17/09: 3x num dia; quem LE grita, quem ESCREVE nao.
- [Trava de defasagem + a ordem obrigatoria](legalize-trava-defasagem-e-ordem.md) — 17/09: numero em prosa nao recalcula; o '7' errado vivia em 4 arquivos.
- [A entrega pro dev, e tudo em centavos](legalize-entrega-dev-e-centavos.md) — 17/09: a fixture E o contrato; a rede dos legiveis congelados.
- [Tres travas de metodo, de tres erros meus](legalize-travas-de-metodo-15-09.md) — 15/09: verde vazio, assunto reaberto 3x.
- [O reporte ao socio se mede sozinho](legalize-placar-do-reporte-gerado.md) — 15/09: placar gerado + confronto com o git.
- [Documento importante se le INTEIRO](legalize-leitura-integral-documento.md) — 10/09 TRAVADO: 100% literal salvo em arquivo.
- [Escrever arquivo so via Edit/Write](legalize-escrita-arquivo-so-edit-write.md) — 01/09: script Python truncou 2 arquivos.
- [Edicao simples se resolve com Edit direto](legalize-edicao-simples-editar-direto.md) — 05/09: nada de script de patch nem.
- [Vocabulario do vault: doutrina virou trava](legalize-vocabulario-tipo-derivou.md) — 09/09 RESOLVIDO: `verificar.js` estava.
- [Vault: indice de autoridade + fila humana](legalize-vault-organizado.md) — `_sistema/indice-autoridade.md` diz quem manda.
- [Worktrees: branches irmas do vault](legalize-worktree-reorg-branches.md) — `.obsidian` trackeado duplica notas.
- [Pesquisa grande roda via Gemini](legalize-pesquisa-grande-via-gemini.md) — 05/08: Pedro roda fora e cola; nao pesquisar.
- [PR automatico quando pedido](legalize-git-pr-automatico.md) — 05/08: commit + `gh pr create` sem confirmar; NAO inclui merge.
- [Handoff pro dev: repo base-flow](legalize-handoff-dev-repo.md) — 19/07: schema e contrato de comportamento, nao arquitetura.
- [Armadilha do PDF via Chrome headless](legalize-pdf-chrome-headless-armadilha.md) — 12/08: PDF "sucesso" pode ser print.
- [Janela de contexto: ~1M](legalize-janela-contexto-1m.md) — NAO emitir linha de saude nem sugerir `/fechar` por aquecimento.
- [Reorganizacao flow/telas/design em curso](legalize-reorganizacao-flow-design-em-curso.md) — 31/07: pergunta do Pedro ficou.
- [Cluster fiscal reordenado (ENCAIXE)](legalize-encaixe-cluster-fiscal.md) — 21/07: CNAE escolhido pre-pago, nao em swap.
