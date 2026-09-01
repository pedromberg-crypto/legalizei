---
tipo: operacao
status: vivo
data: 2026-07-10
etapa: evolucao-semanal
tags: [reporte, evolucao, sociedade]
---

# 📊 Evolução do Legalizai Story Book — reporte pro sócio (doc vivo)

> Log vivo da evolução, atualizado ao fim de cada sessão produtiva. Base pra pauta/reporte com o Mauro. **Versão WhatsApp (grupo ampliado) omite o item de sociedade** — ver bloco no fim.

## Semana 07–10/07/2026
| # | Frente | O que evoluiu | Status |
|---|---|---|---|
| 1 | Sociedade | Negócio fechado (07/07); framework de sociedade 1-pág; NDA + acessos | 🟢 |
| 2 | Imersão | Conversas com o time (Léo, Izabela, dev) gravadas e transformadas em decisões | 🟢 |
| 3 | Abertura de empresa (BH) | Passo a passo ME serviço Simples validado com a Izabela; órgãos/sistemas mapeados (JUCEMG, PBH/BHISS, SEF-MG/SIARE, REDESIM) | 🟢 |
| 4 | Concorrentes | Estudo a fundo dos 6 maiores: preços reais, comunicação, tom e pontos fracos | 🟢 |
| 5 | **Teto de automação** | Validado pelos 3: o processo **não é 100% digital** (~15–20% exige humano) — JUCEMG e Gov.br não têm API e exigem login manual. **Os concorrentes também não são**: todo "abrir empresa grátis" vira formulário → "um consultor entra em contato". Ver [[2026-07-10-teto-automacao-orgaos-sem-api]] | 🟢 |
| 6 | CNAEs | Mapa completo do que o app atende x não atende (460 sim / 68 condicional / 804 não) | 🟢 |
| 7 | Tecnologia | Base técnica do app definida (stack, MLP, multi-tenant) | 🟢 |
| 8 | Marca | Nome aprovado (Legalizai Story Book); tom de voz, personalidade e cor principal (coral) definidos; **logo fechado** (símbolo + logotipo, arquivos vetoriais) | 🟢 |
| 9 | Domínios e e-mail | Escolhidos + carrinho montado na Hostinger (R$186/ano), no CNPJ da Legalize Digital | ⏳ aguarda autorização de compra |
| 10 | Organização | Todo o conhecimento do projeto centralizado, versionado e seguro | 🟢 |

**Próximo:** reavaliar a rota do produto com as descobertas da semana (dev já trabalhando na nova validação). ~~fechar o logo~~ ✅ **logo fechado 12/07** ([[2026-07-12-logo-fechado]]) — falta só gerar derivados (favicon/ícone de app).

**📎 Reporte técnico do dev (10/07):** Pedro Dev mandou o resumo de fundação técnica — stack mobile-first + réplica web, banco seguro com isolamento por cliente e **certificado digital em banco separado (LGPD)**, robôs "funcionários" guiados por um robô gerente, e o mapa da operação em 3 fases (entrevista IA → constituição CNPJ+certificado → portal do cliente). Já construindo infra do SaaS + protótipo de backend pra testar automações/IA/onboard. Próximo dele: fechar testes de fundo + alinhar identidade/branding comigo. → [[2026-07-10-reporte-tecnico-pedro-dev]]

## Semana 11–12/07/2026
| # | Frente | O que evoluiu | Status |
|---|---|---|---|
| 1 | Marca | Fonte do sistema definida (Sora, pra tudo); **handoff de cores + fonte entregue pro dev** já iniciar as telas | 🟢 |
| 2 | Produto/UX | **Fluxo de entrada do app desenhado**: abrir do zero × migrar de contador; ao migrar, puxar dados do CNPJ automaticamente; filtrar já na entrada se o CNAE é atendido; pedir cadastro só depois de qualificar o cliente | 🟢 |
| 3 | Protótipo | Arrancamos o **protótipo visual das telas** já com a marca — abertura animada + primeiras telas do cadastro | 🟢 |
| 4 | Protótipo (entrada) | **Fluxo de entrada inteiro montado e navegável**: abertura animada → boas-vindas (3 telas com animações) → escolha "abrir × migrar" → **validador de atividade (CNAE)** → login. Tudo com a nossa cara e sem travar em tela nenhuma | 🟢 |
| 5 | Validador de CNAE | Uma caixa tipo chat onde o cliente **escreve o que faz** e descobre **na hora** se a gente atende (ou entra na fila de espera, se for atividade regulamentada) — transparência de cara. Mesma lógica vai pra dentro do app e pro site | 🟢 |
| 6 | Site (landing) | **Roteiro completo do site de captação** pronto pra produzir — foco em transparência (o mesmo validador de CNAE já na home) e em levar a pessoa a **baixar o app** (iOS/Android) | 🟢 (produzir) |

**Próximo (11–12):** confirmar com o dev a fonte de dados do cartão CNPJ (API); produzir o site de captação; definir os passos do cadastro (wizard).

### 📱 WhatsApp (11–12/07)
```
*Update Legalizai Story Book* 🎨
- Definimos a fonte do app e passamos as cores prontas pro dev começar as telas
- Desenhamos como o cliente entra no app: quem já tem empresa migra puxando os dados do CNPJ na hora; quem vai abrir do zero é guiado; e a gente já filtra logo na entrada se atende a atividade dele
- Montamos o protótipo visual de TODO o fluxo de entrada (abertura → boas-vindas → abrir/migrar → validador de atividade → login), já com a nossa marca e animações
- Criamos um "validador de CNAE": o cliente escreve o que faz e descobre na hora se a gente atende — transparência desde o primeiro contato
- Roteiro do site de captação pronto pra produzir, focado em baixar o app
```

## Semana 13/07/2026 — alinhamento Pedro Dev + Léo
| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | Modelo operacional | **Modelo do app travado**: foco só em **serviço** (comércio vai pro tradicional), atender só atividades que "passam liso", cobrança só depois de validar a atividade, WhatsApp como canal central, e o cadastro dividido em blocos que fluem sozinhos até a assinatura | 🟢 |
| 2 | Regra de negócio (Léo) | Léo trouxe as dores do escritório digital antigo e viraram **requisito**: exigir upload de nota, prolabore padronizado, aviso de nota emitida por fora, status em tempo real pro cliente | 🟢 |
| 3 | Contrato-como-produto | Definido que o **contrato é a mitigação de risco** (nota retroativa, obrigação acessória, cancelamento) — vai ser redigido junto da copy de onboarding | 🟢 (a redigir) |
| 4 | Plano de sequência (PM) | Cortei as ~40 ideias da reunião pro **caminho crítico**: abrir 1 empresa real ponta a ponta (cobaia = CNPJ do próprio Pedro). Resto = backlog → [[2026-07-13-plano-sequencia-pm]] | 🟢 |
| 5 | Backend | Pedro Dev em **teste ponta a ponta** (robôs + IA "diretor contábil" + infra própria) mirando **sexta 17/07** | 🟡 em curso |
| 6 | Time | Consenso: **entra um operador** (indicação do Pedro Dev) pra escalar a execução, sob revisão do Dev | 🟢 (a contratar) |
| 7 | Protótipo | Telas conectadas e **navegáveis fim a fim** pra apresentar no navegador | 🟢 |

**Próximo (13/07):** [Dev] fechar teste E2E + V1 UI até 17/07 · [Pedro] especificar blocos do wizard + fechar formulário c/ Carla e Larissa + handoff Git · **fechar 3 decisões caras** (certificado terceiro / gateway Asaas / plano semestral) · **apresentar progresso ao Mauro (sex 17/07)**.

### 📱 WhatsApp (13/07)
```
*Update Legalizai Story Book* 🚀
- Travamos o modelo do app com o time: foco só em serviço, cobrança só depois de validar a atividade, WhatsApp como canal central e cadastro em blocos que fluem até a assinatura
- As dores do escritório digital antigo (nota emitida por fora, prolabore, cancelamento) viraram requisito e vão pro contrato
- Priorizei tudo num plano enxuto: a meta das próximas semanas é abrir 1 empresa REAL de ponta a ponta pelo app (cobaia = meu próprio CNPJ)
- Pedro Dev está no teste de ponta a ponta do backend (robôs + IA + infra), mirando sexta
- Protótipo já navegável fim a fim pra apresentar
Sexta (17/07): teste E2E + 1ª versão da tela + apresentação do progresso
```

## Semana 13/07/2026 — 2º flow (redes, handoff, regras de DP)
| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | Regras de negócio (DP) | **Karla (Depto Pessoal)** respondeu as dúvidas em aberto: pró-labore/INSS (mín. 1 salário, custo líquido explícito), sócio não pode ser CLT da própria empresa, sócio com CLT em outra empresa (LGPD: informa manual), eSocial "sem movimento", **Fator R** (folha ≥28% → cai de 15,5% pra 6%), funcionário/PJ fica fora do 1º produto, obrigações acessórias por tributação | 🟢 → [[2026-07-13-conversa-karla]] |
| 2 | Handoff pro dev | Repositório privado **base-ds-legalizai-story-book** com todas as telas + site + animações entregue; Pedro Dev já convidado | 🟢 |
| 3 | Redes sociais | **Instagram e LinkedIn da Legalizai Story Book criados** (pegada "estamos chegando"); descrição/marca aplicadas; organização das redes montada no projeto | 🟢 (config em curso) |
| 4 | Domínios | **Valores enviados pro Miguel aprovar contigo**: Hostinger R$312,11 + Registro.br R$76,00 (blindagem legalizai-story-book.app.br) | ⏳ aguarda pagamento |

**Próximo (13/07 2º):** fechar as perguntas de **fiscal com a Larissa** (obrigações acessórias/prazos/multa); banner final do LinkedIn; **aprovar o pagamento dos domínios**.

### 📱 WhatsApp (13/07 — 2º)
```
*Update Legalizai Story Book* 📣
- Sentei com a Karla (DP) e travamos as regras que faltavam: pró-labore/INSS, sócio CLT, eSocial sem movimento, Fator R e o que fica pra depois (funcionário/PJ). Falta só a Larissa (fiscal)
- Entreguei pro nosso dev o pacote com todas as telas, o site e as animações, num repositório próprio
- Criamos o Instagram e o LinkedIn da Legalizai Story Book no clima "estamos chegando"
- Mandei pro Miguel os valores dos domínios pra aprovação (Hostinger + Registro.br)
```

## Semana 14/07/2026 — domínios pagos + especificação do cadastro em blocos
| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | Domínios | **Mauro pagou tudo** (Hostinger R$312,11 + Registro.br R$76,00). Próximo = registrar de fato + apontar DNS + e-mail contato@legalizai-story-book.app | 🟢 pago |
| 2 | Produto (cadastro) | **Especificamos os 2 primeiros blocos do cadastro** (contrato com o dev): entrada/qualificação (descobre na hora se atende, e quem não atende vira lead pro escritório tradicional) + coleta/enquadramento (simulador de economia fiscal, dados do sócio, tudo pra abrir). Base pra o dev construir sem vai-e-volta | 🟡 em curso (faltam blocos de cobrança→constituição) |

**Próximo (14/07):** especificar os blocos seguintes (cobrança → constituição → certificado → portal); fechar fiscal com a Larissa; registrar/apontar os domínios.

## Semana 14/07/2026 — 3º flow (cobrança + como o cliente cancela)
| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | Cobrança (Bloco 3) | **Definido como o cliente paga:** a 1ª mensalidade já é o 1º mês (abertura não se cobra, igual ao mercado — cliente paga só as taxas do governo à parte); gateway de pagamento = **Asaas**; aceita cartão, Pix e boleto | 🟢 |
| 2 | Blindagem de cancelamento | **Resolvemos o risco "cliente cancela em 7 dias mas o CNPJ já foi aberto":** política em 4 camadas — autorização expressa antes de abrir (a lei tira o arrependimento de serviço já executado), taxas de governo não voltam, fidelidade com multa, e só abrimos depois de pago. Ninguém sai com empresa de graça | 🟢 (contrato a redigir) |
| 3 | Benchmark do líder | **Documentamos o plano mais barato da Contabilizei (Padrão R$195)** como régua do nosso produto: o que entra, o que é cobrado à parte, e onde eles são fracos (não prometem prazo de abertura; app ruim) | 🟢 |

**Próximo (14/07 3º):** [Pedro/Mauro] decidir o **prazo de fidelidade** do plano; [Mauro/Larissa] redigir o **contrato + termo de início de serviço**; especificar Bloco 4 (constituição).

### 📱 WhatsApp (14/07 — 3º)
```
*Update Legalizai Story Book* 💳
- Fechamos como o cliente vai pagar: a 1ª mensalidade já é o 1º mês (a abertura em si a gente não cobra, igual ao mercado; ele paga só as taxas do governo). Gateway = Asaas, com cartão, Pix e boleto
- Resolvemos o risco do cancelamento: montamos uma política em 4 camadas pra ninguém cancelar e sair com o CNPJ aberto de graça (autorização antes de abrir, taxas não reembolsáveis, fidelidade com multa e só abrir depois de pago)
- Documentamos o plano mais barato da Contabilizei (R$195) como nossa régua, incluindo onde eles deixam a desejar
Falta decidir: prazo de fidelidade e redigir o contrato
```

## Semana 15/07/2026 — marca no INPI + monitoramento do líder
| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | Marca (INPI) | **Levantamos que precisamos registrar a marca "Legalizai Story Book" no INPI** — não é obrigatório pra operar, mas protege o nome (domínio e rede social não garantem nada; no Brasil quem registra primeiro leva). Dois pontos de atenção: o nome é "descritivo" (pode dar exigência) e é parecido com "Contabilizei" (precisa de busca prévia). **Decisão que depende de nós dois: em qual CNPJ registrar** (proposta: Legalize Digital). Próximo = busca de anterioridade | 🟡 a decidir |
| 2 | Monitoramento do líder | Seguimos acompanhando a Contabilizei por dentro (caixa de cliente): mapeamos o e-mail de uma **função nova deles ("teto mínimo" de pró-labore)**, que revela como a automação de pró-labore deles funciona por baixo — insumo direto pro nosso simulador ser mais transparente | 🟢 |

**Próximo (15/07):** [Pedro/Mauro] decidir titular da marca + autorizar busca/registro no INPI; seguir com a construção do motor de testes e os blocos seguintes do cadastro.

### 📱 WhatsApp (15/07)
```
*Update Legalizai Story Book* ™️
- Levantei que a gente precisa registrar a marca "Legalizai Story Book" no INPI pra proteger o nome (domínio e rede social não garantem). Não é obrigatório pra funcionar, mas é importante: no Brasil quem registra primeiro leva
- Dois cuidados: o nome é meio "descritivo" e parecido com "Contabilizei", então dá pra ter exigência. Vou rodar a busca prévia
- Decisão nossa: registrar em qual CNPJ (penso na Legalize Digital)
- Continuo acompanhando a Contabilizei por dentro: mapeei uma função nova deles (teto mínimo de pró-labore) que ajuda a gente a fazer melhor
```

## Semana 15/07/2026 — 2º flow (motor de testes + pesquisa fiscal oficial)
| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | Motor de testes | Criamos um "robô testador" do cadastro: roda o fluxo inteiro com **7 clientes fictícios** (do leigo total ao mais avançado) e entrega um **relatório em tabela** mostrando onde cada um passaria ou travaria, com sugestões. Valida a experiência **rápido e barato** antes de programar as telas | 🟢 rodando |
| 2 | Pesquisa fiscal (fontes oficiais) | Fomos direto às fontes oficiais (Receita, lei do Simples, Junta de MG, Prefeitura BH) e **confirmamos as regras que faltavam**: abertura em BH sai em ~1 dia (alvará imediato pra baixo risco), dá pra **emitir as guias (DAS) de forma automática** via API oficial da Receita/Serpro, e os valores de 2026. Tudo salvo e com fonte | 🟢 |
| 3 | Foco do produto | Decidimos que o **MVP atende só serviço**: os CNAEs de comércio saem do 1º produto (ficam guardados pra reencaixe futuro). Enxuga o motor fiscal | 🟢 |

**Próximo (15/07 2º):** [Pedro] rodar a 3ª pesquisa fiscal (2 pontos que faltaram: Fator R no 1º ano da empresa + migração de contador) e **fechar com a Larissa** · estender o motor pro resto do cadastro · especificar a constituição (Bloco 4).

### 📱 WhatsApp (15/07 — 2º)
```
*Update Legalizai Story Book* 🧪
- Montamos um "robô testador" do cadastro: ele roda o fluxo inteiro com 7 clientes fictícios (do mais leigo ao mais avançado) e mostra num relatório onde cada um travaria. Assim a gente valida a experiência rápido, antes de programar as telas
- Fizemos uma pesquisa fiscal pesada só em fontes oficiais (Receita, lei do Simples, Junta de MG, Prefeitura de BH) e confirmamos o que faltava: abertura em BH em cerca de 1 dia, guias (DAS) que dá pra emitir de forma automática pela API oficial, e os valores de 2026
- Decidimos focar o 1º produto só em serviço (comércio fica pra depois)
Falta confirmar 2 pontos fiscais com a Larissa (Fator R no 1º ano e troca de contador)
```

## Semana 15/07/2026 — 3º flow (planejamento tributário com dado real + lapidação da experiência)
| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | Feature "pagar menos imposto (legal)" | O app não só acerta a atividade do cliente — recomenda, **entre os códigos que servem pra mesma atividade, o que paga menos imposto**. Agora com **dado fiscal aterrado** (cruzamos uma pesquisa pesada de Belo Horizonte contra nossas fontes, sem contradição). Exemplo comprovado: quem dá treinamento pode economizar **~R$1.425/mês** com o enquadramento certo, com respaldo em decisões oficiais da Receita | 🟢 (falta a Larissa dar o carimbo final) |
| 2 | Experiência do cadastro | O "robô testador" apontou **16 melhorias de linguagem e clareza** (mostrar tudo em R$ e não em jargão, bloqueios que explicam em vez de só barrar, acessibilidade pra cliente idoso) — **todas já registradas na especificação das telas**. Regra nova: primeiro deixamos a experiência redonda, a parte visual vem depois | 🟢 |

**Próximo (15/07 3º):** rodar a 2ª bateria do robô testador com o fluxo já melhorado; fechar os pontos fiscais com a Larissa; seguir pra constituição (Bloco 4).

### 📱 WhatsApp (15/07 — 3º)
```
*Update Legalizai Story Book* 💡
- A função-chave do app (recomendar o enquadramento que faz o cliente pagar menos imposto, dentro da lei) agora está com dado fiscal firme: cruzamos uma pesquisa pesada de BH com nossas fontes e bateu. Exemplo real: quem dá treinamento pode economizar ~R$1.400/mês, com respaldo da Receita
- O "robô testador" apontou 16 melhorias de clareza no cadastro (tudo em reais e não em jargão, telas que explicam em vez de só bloquear, acessibilidade) e já registramos todas
- Regra que adotamos: primeiro deixamos a experiência redonda, o visual vem numa 2ª etapa
Falta o carimbo final da Larissa no fiscal
```

## Semana 15/07/2026 — 4º flow (experiência do cadastro redonda de ponta a ponta)
| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | Experiência do cadastro | Rodamos **mais 3 baterias** do robô testador (com o fluxo já melhorado). O cadastro está **redondo de ponta a ponta** — da 1ª tela até "empresa aberta e operando", testado com **11 clientes fictícios** (do mais leigo ao mais avançado). Criamos uma **nota de quão redonda** está a experiência de cada perfil; **subiu em todos** e o pior caso saiu de ~76% pra ~88% | 🟢 |
| 2 | Parte final do fluxo | Especificamos o que faltava: **pagamento → constituição → primeiros dias** (a "conta da abertura" clara antes de pagar, o painel que mostra o andamento na Junta/Receita, e o "e agora?" pós-CNPJ: 1ª nota, 1º imposto, certificado) | 🟢 |
| 3 | Correção de trava | O robô achou uma trava boba: quem confundia **pró-labore com "ser CLT da própria empresa"** era barrado. Corrigimos — agora o app **explica e deixa seguir**, em vez de travar. Um cliente a mais que abre | 🟢 |
| 4 | **Decisão pra você + Larissa** | Quando o cliente **não encaixa** no app (ex: nutricionista, que precisa de responsável técnico; ou quem se encaixa melhor no MEI), queremos **oferecer o caminho certo ali na hora** em vez de só mandar pra fila. Isso é **decisão de negócio**: até onde a gente atende e o que oferece de alternativa | 🟡 aguarda call |

**Próximo (15/07 4º):** a experiência das 11 personas está no teto — próximo ganho vem de **testar casos novos** (erro no meio do caminho, quem já tem CNPJ e quer trocar de contador) e das **decisões com você/Larissa**.

### 📱 WhatsApp (15/07 — 4º)
```
*Update Legalizai Story Book* ✅
- O cadastro do app está redondo de ponta a ponta: testamos com 11 clientes fictícios, da 1ª tela até a empresa aberta e operando. Criamos uma nota de "quão redonda" está a experiência de cada perfil e ela subiu em todos
- Especificamos a parte final que faltava: pagamento, constituição e os primeiros dias (1ª nota, 1º imposto, certificado)
- Corrigimos uma trava: quem confundia pró-labore com "ser CLT da própria empresa" era barrado; agora o app explica e deixa seguir
Tem 1 ponto que precisa de uma decisão nossa (com a Larissa): o que oferecer pra quem não encaixa no app (ex: nutricionista que precisa de responsável técnico, ou caso de MEI)
```

## Semana 16/07/2026 — cadastro entregue pro dev construir
| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | **Entrega pro dev** | **Entreguei o cadastro inteiro pro Pedro Dev construir o backend**, num repositório próprio: o "robô testador" + a especificação de todas as telas + a lista de CNAEs pronta pro sistema consultar. **O pulo do gato:** os **14 clientes fictícios viraram a prova de aceite** — se o sistema dele rodar os 14 e der o mesmo resultado, está certo por construção. Vale mais que qualquer documento | 🟢 entregue |
| 2 | Raio-X do cadastro | Contamos e mapeamos tudo: **22 telas** da 1ª tela até a empresa aberta, **5 momentos em que o processo espera** (pagamento, sócio, cartório digital, órgãos) e **os caminhos alternativos** (quem vira fila de espera, quem vai pro escritório tradicional, quem é barrado). Descobrimos que 3 dessas saídas podem usar **a mesma tela** — economia de trabalho | 🟢 |
| 3 | Robô testador | Achamos **2 buracos** e cobrimos: (a) **e se um órgão recusar no meio?** (ex: Junta reprova o nome mesmo com a consulta prévia aprovada) — agora o app mostra "precisa de você" com a ação clara e **recupera**, em vez de deixar o cliente achando que travou; (b) **cliente com conta gov.br incompleta** — o app avisa cedo e ensina a resolver, em vez de travar na hora de assinar | 🟢 14/14 |
| 4 | Decisão de experiência | O cliente leigo e o experiente querem coisas opostas na mesma tela. **Decidimos NÃO fazer dois caminhos diferentes**: o que é bom (botão grande, linguagem sem jargão) vira padrão **pra todos**; o detalhe fica escondido pra quem quiser abrir. **O resto a gente mede antes de construir** — perguntamos "é a primeira empresa que você abre?" só pra acompanhar, e só separamos os caminhos **se o dado provar que precisa**. Evita construir em cima de achismo | 🟢 |
| 5 | **Decisão sua** | 🕓 **O preço NÃO trava mais** (mudei de ideia em 16/07): não dá pra precificar sem saber quanto **custa** rodar cada empresa (banco de dados + APIs). Sigo com o ~R$195 da Contabilizei como **placeholder marcado FAKE** e a gente crava o nosso depois do teste real de uso. **Quando sentar com você, é uma conversa só** e já tenho a lista pronta | 🕓 quando for a hora |

**Próximo (16/07):** [Pedro] convidar o dev no repositório + **começar a construir as telas** (pelo miolo do cadastro, que está 100% especificado) · [Pedro/Mauro] **fechar o preço do plano** (destrava a cobrança) · [Pedro] decidir com o dev a base técnica de segurança (não cobrar/abrir duas vezes) e os fornecedores de consulta de CPF/CNPJ.

### 📱 WhatsApp (16/07)
```
*Update Legalizai Story Book* 📦
- Entreguei o cadastro inteiro pro nosso dev construir o backend, num repositório próprio: o robô testador, a especificação de todas as telas e a lista de CNAEs pronta pro sistema
- O pulo do gato: os 14 clientes fictícios viraram a PROVA DE ACEITE. Se o sistema dele rodar os 14 e der o mesmo resultado, está certo por construção. Vale mais que qualquer documento
- Fizemos o raio-X do cadastro: 22 telas, 5 momentos de espera e todos os caminhos alternativos mapeados
- O robô achou 2 buracos e cobrimos: (1) e se um órgão recusar no meio (ex: Junta reprova o nome)? agora o app mostra o que fazer e recupera, em vez do cliente achar que travou; (2) cliente com conta gov.br incompleta é avisado cedo, não trava na assinatura
- Decisão de experiência: NÃO vamos fazer dois caminhos (leigo x experiente). O que é bom vira padrão pra todos, e o resto a gente MEDE antes de construir, em vez de chutar
Preciso de você: fechar o preço do nosso plano. Sem ele não fecho as telas de pagamento
```

### 🗓️ 2026-07-16 (2ª sessão) — inverti a ordem do app e comecei as telas

| # | Frente | O que aconteceu | Status |
|---|---|---|---|
| 1 | **Ordem do app INVERTIDA** | Achei um erro grande na minha própria montagem: a gente só pedia o pagamento **depois de 15 telas**. O cliente ia investir tempo, ver o preço no fim e pensar *"achei que fosse mais barato"*. **Agora: valida a atividade → mostra o que ele ganha → paga → o resto acontece dentro do app**, já logado | 🟢 travado |
| 2 | **Abri o funil da Contabilizei tela a tela** | Usei o **CNPJ que abri com eles em dez/2025** + prints do site. Achados: eles **cobram na 3ª tela** com 6 campos e **zero validação** · o "portal" deles é um **help desk (4 tickets)** · pedem por e-mail que o cliente **desabilite a segurança em 2 fatores do gov.br** · a **taxa da prefeitura (R$168) chegou no dia 40** com 4 dias pra pagar e nunca foi citada no checkout · **8 e-mails de "redefinir senha" em 3 dias** porque o onboarding deles não cria senha | 🟢 documentado |
| 3 | **O prazo real deles** | Pagou 10/12 → **CNPJ em 12/12** → alvará 15/12 → dispensas só em **02/01**. Ou seja: **o CNPJ sai rápido, a cauda é longa** e é onde eles somem. Era "prazo não divulgado" no nosso benchmark; agora tem número com documento | 🟢 |
| 4 | **Robô testador** | 14 → **19 casos, 2 fluxos** (abertura + **trocar de contador**, que era metade do mercado e a gente nunca tinha testado). Uma auditoria achou **5 regras que estavam escritas e não estavam no sistema** — uma delas fazia o robô dar **o conselho contrário** ao que a regra manda | 🟢 19/19 |
| 5 | **Comecei as telas** | As 2 primeiras telas de verdade já rodam. Decidi fazer **direto em código, sem Figma** | 🟢 |
| 6 | **Pra Larissa** | Duas coisas que o caso real levantou: (a) meu CNPJ saiu **LTDA** sendo sócio único, e nossa regra diz SLU — qual é a certa? (b) a lista de perguntas fiscais segue de pé | 🕓 |
| 7 | **Pra você, sem pressa** | Preço · taxa da Junta (**R$268 × R$288**, divergência aberta desde 09/07) · certificado · endereço fiscal (o deles é **R$60/mês, cobrado da 2ª parcela** — confirmado com print). **Nada disso me trava agora**, junto tudo e a gente vê numa conversa só | 🕓 |

### 📱 WhatsApp (16/07 — 2ª)
> Mauro, dois avanços grandes hoje.
>
> 1️⃣ **Inverti a ordem do app.** Do jeito que estava, o cliente passava por 15 telas e só via o preço no fim. Agora ele valida a atividade, vê o que ganha, paga, e o resto acontece dentro do app. Mais honesto e para de vazar cliente no meio.
>
> 2️⃣ **Abri o funil da Contabilizei tela a tela**, usando o CNPJ que abri com eles ano passado. Eles cobram na 3ª tela sem validar quase nada, o "portal" deles é um help desk, e a taxa da prefeitura (R$168) chega no dia 40 sem nunca ter sido citada. O CNPJ sai em 2 dias, mas a cauda é longa e é onde eles somem. **É aí que a gente ganha.**
>
> 3️⃣ **Comecei as telas de verdade.** As duas primeiras já rodam.
>
> Sobre preço: **mudei de ideia, não me trava mais.** Não dá pra cravar sem saber quanto custa rodar cada empresa. Sigo com placeholder e a gente crava com dado. Quando sentar com você é **uma conversa só** — já tenho a lista pronta.

## Semana 17/07/2026 — a lista de CNAE não estava de pé
| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | 🔥 **Achado grave: a lista de CNAEs** | Fui montar as categorias das telas e descobri que **a nossa lista de "quais atividades a gente atende" nunca foi verificada**. Ela foi montada assim: a Contabilizei **não publica** o que atende, só publica **17 categorias que ela recusa**. A gente pegou essas 17, tirou da lista completa do IBGE, e **presumiu que todo o resto era atendido**. Resultado: o sistema hoje diz que a gente atende **"Defesa", "Justiça", "Relações Exteriores", "Geração de Energia Elétrica" e "Casas de Bingo"**. E até o mapeamento das 17 falhou: **"Cartórios" está escrito na lista de recusados** e mesmo assim saiu como atendido | 🔴 achado |
| 2 | O que fiz | Separei os 260 de serviço em 3: **45 impossíveis** (ninguém abre empresa disso, eu decido) · **91 duvidosos** (precisam da Larissa, cada um com **uma pergunta objetiva**, não "revisa aí") · **124 que sobreviveram**. Tudo em script que **roda de novo** e trava sozinho se alguém errar. **Os 124 não estão validados** — só não foram refutados por mim | 🟢 listado |
| 3 | **Precisa da Larissa** | Os **91 duvidosos**, em 7 grupos. Os mais importantes: **10 atividades que exigem conselho** (corretor/CRECI, leiloeiro, clínica geriátrica, agronomia/CREA) estão marcadas como "atende" — isso é grave agora, porque **a gente cobra antes de conferir**: o corretor pagaria e só depois descobriria que não dá. E **9 de bar/restaurante/lanchonete** que eu acho que são comércio, não serviço | 🕓 aguarda |
| 4 | Por que isso é bom, não ruim | Achamos **antes de ter cliente**. Se descobre depois, é cliente pago que não dá pra atender, e a conta cai no seu escritório sem estar combinada. **A Contabilizei convive com isso** porque tem call center absorvendo (por isso o WhatsApp está no rodapé de toda tela deles). A gente não tem, então tem que acertar antes | 🟢 |
| 5 | Telas | Segui construindo. A tela de review agora simula o **iPhone de verdade** (antes o app desenhava por baixo do relógio e da bateria) e a **1ª tela do cadastro** ficou redonda. **Decisão travada:** a tela vai ter **botões de área** pra facilitar, mas o cliente **ainda escreve uma frase** do que faz. Só o botão não basta: quem dá treinamento **e** consultoria pagaria **15,5%** em vez de **6%** se a gente deixasse ele escolher só por categoria | 🟢 |

**Próximo (17/07):** [Pedro] bater o martelo nos 45 impossíveis · [Pedro] levar os 91 pro crivo da contabilidade · [Pedro] extrair a tabela pública de CNAE da Contabilizei (ela tem **anexo, Fator R e alíquota por código** — dado que a gente não tem) · [Pedro] avisar o dev (agora são **os dados também**, não só a especificação).

### 📱 WhatsApp (17/07)
```
*Update Legalizai Story Book* 🔎
- Achado importante: nossa lista de "quais atividades a gente atende" nunca tinha sido verificada. Ela foi montada de trás pra frente: a Contabilizei não publica o que atende, só as 17 categorias que RECUSA. A gente tirou essas 17 da lista do IBGE e presumiu que todo o resto era atendido
- Na prática o sistema dizia que a gente atende "Defesa", "Justiça" e "Casas de Bingo". E "Cartórios", que está escrito na lista de recusados
- Já separei tudo: 45 impossíveis (eu resolvo), 91 que precisam da Larissa (com pergunta objetiva em cada um) e 124 que sobreviveram. Em script que roda de novo e trava sozinho se errar
- A parte boa: achamos ANTES de ter cliente. Depois seria cliente pago que a gente não consegue atender, e a conta cairia no escritório
Preciso da Larissa: 91 casos. O mais urgente são 10 atividades que exigem conselho (corretor, leiloeiro, agronomia) marcadas como "atende" — como a gente cobra antes de conferir, essa pessoa pagaria e só depois descobriria que não dá
```

## Semana 17/07/2026 — 2º flow (as telas do cadastro, construídas e navegáveis)
| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | Telas de coleta (7) | Construí **as 7 telas onde o cliente preenche os dados pra abrir** (dados do sócio, INSS/vínculo, sócios, empresa, atividades secundárias, tipo de empresa, nome) — direto em código, já com a nossa cara e com as regras que a gente travou embutidas: avisa o cônjuge cedo quando o regime de casamento exige, explica o INSS em vez de assustar, limita em 2 sócios com jeito, oferece o endereço fiscal sem empurrar. Todas navegáveis na prancheta de review | 🟢 |
| 2 | Tela do "sim/não" da atividade | A tela que dá o veredito (🟢 a gente abre / 🟡 fila de espera / 🔴 caso pro escritório) ficou pronta nos 3 casos, com uma **animação de comemoração** (confete da marca) quando o cliente confirma. Detalhe que faz o app dar gosto de usar | 🟢 |
| 3 | Acabamento | Revisei tela a tela e lapidei: menu de opções com a nossa cara (o padrão do celular é feio), atalhos de porcentagem na divisão entre sócios, e uma dica visual de "tem mais coisa pra rolar" que ajuda o cliente a ler o importante **sem** travar o botão | 🟢 |

**Próximo (17/07 2º):** construir as telas de **resultado** (a economia de imposto, o número grande), depois as de espera e as de "não encaixa"; **rodar as telas contra os clientes fictícios** pra validar a experiência. Backend segue com o dev, em paralelo.

### 📱 WhatsApp (17/07 — 2º)
```
*Update Legalizai Story Book* 📱
- Construí as 7 telas onde o cliente preenche os dados pra abrir a empresa (sócio, INSS, sócios, empresa, atividades, tipo, nome), já com a nossa cara e com as regras embutidas: avisa o cônjuge cedo, explica o INSS, limita 2 sócios, oferece endereço fiscal sem empurrar. Todas navegáveis
- A tela do "sim/não" da atividade ficou pronta nos 3 casos (a gente abre / fila / caso pro escritório), com uma animação de comemoração quando o cliente confirma
- Lapidei tela a tela: menu de opções com a nossa cara, atalhos na divisão entre sócios, dica visual de rolagem
Próximo: as telas de resultado (economia de imposto) e depois rodar tudo contra os clientes fictícios
```

## Semana 19/07/2026 — custos confirmados na fonte + o que meu próprio CNPJ ensinou
| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | **Custo de abertura corrigido** | Fomos na tabela oficial da Junta: a taxa de constituição é **R$ 268,51** (microempresa), não os **R$ 288** que a gente vinha usando desde o começo. Também confirmamos que **contrato padrão é mais barato que personalizado** (R$429,61), porque a Junta criou incentivo pra automação. **Custo total de governo: ~R$ 437** | 🟢 |
| 2 | **Dúvida fiscal que travava o simulador** | A pergunta "aquele encargo que já vem dentro da guia do Simples conta pro cálculo que decide se a empresa paga 6% ou 15,5%?" foi **respondida pela própria Receita Federal** (Solução de Consulta 17/2021): **conta**. Isso faz o valor que o sócio precisa se pagar ser **menor** do que a gente calculava. Fechamos mais 7 números com fonte oficial | 🟢 |
| 3 | **Meu CNPJ virou laboratório** | Analisei minhas próprias guias. Descobri que **eu pago 6%, então não fui mal enquadrado** — minha primeira suspeita estava errada e o dado me corrigiu. **Mas achei coisa melhor:** meu pró-labore foi reduzido pela metade num mês sem nota, e **quando eu voltar a faturar cheio isso me joga pra 15,5%**, custando **R$ 1.140 a mais por mês**. Ninguém me avisou | 🟢 |
| 4 | **A tese comercial ficou mais afiada** | O erro do mercado **não é enquadrar errado na abertura**. É que esse cálculo **muda todo mês e ninguém fica olhando**. Isso não é um serviço de abertura, é de **acompanhamento** — e é exatamente onde o modelo deles (abre e some) não alcança | 🟢 |
| 5 | Telas | Mais **9 telas** construídas e revisadas. O app já mostra o caminho inteiro: da porta de entrada até a prova de quanto o cliente economiza. **17 telas navegáveis** | 🟢 |
| 6 | **Decisão sua** | 🕓 O plano previa **abrir 1 empresa de teste usando o meu CNPJ** — só que **o meu já existe**. Precisamos escolher: abrir uma segunda (custa taxa + certificado de verdade), usar outra pessoa, ou testar pelo caminho de **trocar de contador**, que é o meu caso real | 🕓 |

**Próximo (19/07):** confirmar 3 pontos que ficaram sem fonte oficial (obrigatoriedade do certificado digital em BH, texto da nova lei do imposto de renda, e a mecânica da taxa da prefeitura); seguir com as telas de espera e de saída; decidir a cobaia do teste real.

### 📱 WhatsApp (19/07)
```
*Update Legalizai Story Book* 🔍
- Fomos na fonte oficial e corrigimos o custo de abertura: a taxa da Junta é R$ 268,51, não R$ 288 como a gente usava. Custo total de governo fica em ~R$ 437
- A Receita Federal já respondeu (numa consulta oficial) a dúvida que travava nosso simulador de economia. Resultado: o valor que o sócio precisa se pagar pra cair no imposto menor é MENOR do que a gente calculava. Fechamos mais 7 números com fonte
- Analisei as guias do MEU CNPJ (aberto pela Contabilizei). Boa notícia: eu pago 6%, então não fui mal enquadrado, minha suspeita inicial estava errada
- Mas achei algo melhor: meu pró-labore foi cortado pela metade num mês sem nota, e quando eu voltar a faturar cheio isso me joga pro imposto de 15,5%. R$ 1.140 a mais por mês. Ninguém me avisou
- É aí que a gente ganha: o erro do mercado não é a abertura, é que esse cálculo muda todo mês e ninguém acompanha. Nosso produto é o acompanhamento
- Mais 9 telas prontas. O app já mostra o caminho todo, da entrada até a prova da economia
Preciso de você: o plano era testar abrindo o MEU CNPJ, mas ele já existe. Temos que escolher outro caminho pro teste real
```

## Semana 19/07/2026 — 2º flow: o app já tem o caminho inteiro até o pagamento

| # | Frente | O que evoluiu | Status |
|---|---|---|---|
| 1 | **Telas** | **Mais 13 telas prontas.** Agora existe o caminho completo: abertura da marca, boas-vindas, escolha "abrir × já tenho empresa", criar conta, **a conta da abertura**, contrato, pagamento, telas de espera e telas de saída pra quem a gente não atende | 🟢 |
| 2 | **A conta da abertura** | Tela que **fecha o custo na cara do cliente antes de pedir dinheiro**: o que é grátis (nosso trabalho), o que é taxa do governo (R$ 268,51 da Junta, que não é nossa) e o que é mensalidade. Nenhum concorrente mostra isso separado | 🟢 |
| 3 | **Contrato** | Reescrito: em vez de um bloco grande sobre cancelamento, entrou um card com **os 22 anos do escritório** — quem assina precisa saber com quem está assinando | 🟢 |
| 4 | **Quem paga por boleto** | O cliente **entra no app e adianta a empresa toda** enquanto o boleto não cai. Só o passo final fica travado. Antes ele ficaria 3 dias sem nada pra fazer, achando que travou | 🟢 |
| 5 | **Economia de custo** | Decidido que a **checagem do nome na Junta só roda depois do pagamento**. Como a JUCEMG não tem API (é robô), checar antes gastaria o recurso mais caro do sistema com quem talvez nunca pague | 🟢 |
| 6 | **Pra Larissa** | Some à lista: **SLU e LTDA de sócio único são a mesma natureza?** Se forem, uma tela inteira do app não precisa existir (meu CNPJ é a evidência) | 🕓 |
| 7 | **Pro dev** | **Validar o nome na Junta é a mesma coisa que validar a viabilidade da empresa?** A resposta muda o que dá pra liberar antes do pagamento | 🕓 |

**Próximo:** a cauda do flow (revisão do dossiê, termo de início, painel de acompanhamento, assinatura no GOV.BR e o dia seguinte à empresa aberta).

## Semana 21/07/2026 — mapa vivo do app + como o líder trata sociedade
| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | Organização | Fizemos um **mapa visual do app inteiro** (as 26 telas + todos os caminhos e saídas), com uma tabela de **o que já está validado × o que ainda depende de gente** (Larissa/você). O mapa **se atualiza sozinho** a partir do código e guarda versões, então nunca mais fica desatualizado | 🟢 |
| 2 | Sociedade (decisão) | Debatemos se valia cortar sociedade do 1º produto (abrir só individual e vender sócio depois). **Decidi manter até 2 sócios grátis na abertura, igual à Contabilizei** — porque adicionar sócio depois é uma alteração contratual cara, então "cobrar simbólico" não fecha e penalizaria quem já quer abrir com sócio | 🟢 |
| 3 | Inteligência do líder | Confirmei na fonte pública como a Contabilizei trata sociedade: a **abertura é grátis** (o cliente paga só as taxas do governo) e exige **fidelidade de 12 meses**; o *"até 2 sócios grátis"* é do **serviço mensal (pró-labore)**, não da abertura. Insumo direto pra nossa decisão de **prazo de fidelidade** | 🟢 |
| 4 | Tela de atividades | Ajuste: as sugestões de atividade secundária agora só mostram as que **não mudam o imposto** do cliente (antes o exemplo sugeria comércio, que não fazia sentido e mudava o enquadramento) | 🟢 |

**Próximo (21/07):** seguir com a cauda do flow; levar à Larissa o ponto SLU × LTDA (agora com evidência de que SLU é a sociedade limitada de sócio único); decidir o prazo de fidelidade (referência do líder: 12 meses).

### 📱 WhatsApp (21/07)
```
*Update Legalizai Story Book* 🗺️
- Montei um mapa visual do app inteiro (as 26 telas + todos os caminhos), com uma tabela de o que já está validado e o que ainda depende da Larissa/de você. Ele se atualiza sozinho a partir do código e guarda versões
- Decisão sobre sociedade: mantenho até 2 sócios grátis na abertura, igual à Contabilizei. Adicionar sócio depois é uma alteração cara, então não compensa cobrar "simbólico" e empurrar pra depois
- Confirmei na fonte como o líder trata isso: a abertura é grátis (paga só as taxas do governo) com fidelidade de 12 meses; o "até 2 sócios grátis" que aparece é do serviço mensal, não da abertura. Serve de referência pro nosso prazo de fidelidade
- Ajustei a tela de atividades: só sugere atividades secundárias que NÃO mudam o imposto do cliente
```

## Semana 21/07/2026 — 2º flow: o app inteiro em pé + máquina de qualidade da copy
| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | App ponta a ponta | **Construí a parte final que faltava**: revisar tudo antes de abrir, autorizar o início (o passo sem volta), o painel que mostra a abertura andando na Junta/Receita (inclusive o que fazer se um órgão recusar), a assinatura no GOV.BR e a tela de "empresa aberta, e agora" (1ª nota, 1º imposto, certificado). **Agora o app existe do início ao fim, da 1ª tela até a empresa operando.** Falta só o caminho de quem já tem empresa e quer trocar de contador | 🟢 |
| 2 | Qualidade da copy | Montei uma **"máquina de revisão de texto" do app**: um robô varre todas as telas atrás de repetição, excesso de informação e frase negativa, e eu reviso o que exige olho humano (tom, hierarquia, sensação). Passei o app inteiro por ela em 4 rodadas e enxuguei dezenas de pontos. **Ela se atualiza e melhora sozinha** a cada uso | 🟢 |
| 3 | Pra Larissa | 1 ponto novo: no passo de autorizar a abertura, o texto do "li e aceito" deve dizer que **a taxa da Junta já paga não é reembolsável** (fecha o risco de contestação) | 🕓 |

**Próximo (21/07 2º):** revisar as frases negativas que sobraram (última rodada de copy); seguir com o caminho de "trocar de contador"; decidir o prazo de fidelidade.

### 📱 WhatsApp (21/07 — 2º)
```
*Update Legalizai Story Book* 🏁
- Construí a parte final que faltava do app: revisar antes de abrir, autorizar o início, o painel que mostra a abertura andando nos órgãos (com o que fazer se algo for recusado), a assinatura no GOV.BR e a tela de "empresa aberta, e agora". Agora o app existe do início ao fim
- Montei uma máquina de revisão de texto: um robô varre todas as telas atrás de repetição, excesso e frase negativa, e eu reviso o que precisa de olho humano. Passei o app inteiro por ela e enxuguei dezenas de pontos. Ela melhora sozinha a cada uso
Falta 1 ponto pra Larissa: no aceite da abertura, o texto deve dizer que a taxa da Junta já paga não é reembolsável
```

## Semana 22/07/2026 — o preço real da Contabilizei por dentro (conta de cliente)
| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | **Inteligência de preço do líder** | Continuei o raio-X da plataforma da Contabilizei por dentro (na minha conta de cliente, só olhando). Achado que muda nossa conversa de preço: **o "R$195" é só a fachada.** A conta real do cliente é **plano + um adicional que sobe conforme o faturamento e o nº de funcionários (escondido) + uma prateleira de ~45 serviços cobrados à parte**. E a mensalidade **reajusta todos os anos** por um índice (IGP-DI), vendido dentro do chat como conversa amigável | 🟢 documentado |
| 2 | **Onde eles ganham dinheiro escondido** | Os números da prateleira à parte (todos da tela real): **fechar a empresa custa R$1.406 a R$1.999** · **mudar a empresa / adicionar um sócio depois custa a partir de R$1.299** · comprovante de renda do sócio (DECORE) **R$713,90** · declaração pra abrir conta no banco **R$68,90** · certidão negativa **R$35,90**. Tem até uma isca: "verificação de pendências" por **R$24,90** que serve pra gerar orçamento de regularização (a máquina de medo deles) | 🟢 |
| 3 | **O que isso vale pra gente** | Confirma nosso flanco: **incluir no plano** o que o cliente novo precisa cedo e eles cobram à parte (certidão, declaração pra abrir conta, liberação de nota), **não punir quem quer sair ou mudar**, e **preço transparente de verdade** com regra de reajuste na cara (eles escondem). Isso vai direto pro nosso benchmark de preço | 🟢 |
| 4 | Cobertura | O dossiê da plataforma deles está em **~85%**. O que falta é ou impossível daqui (o app de celular deles), ou eu **escolhi não mexer** (a conta bancária de verdade), ou é irrelevante pro que a gente constrói | 🟢 |

**Próximo (22/07):** sentar (eu e você) pra **decidir pra onde levar essa inteligência de preço** — o que a gente inclui no plano, como se posiciona contra a opacidade deles; seguir com o caminho de "trocar de contador" (flow #2). O **preço do nosso plano segue em aberto de propósito**, até a gente medir o custo real de rodar uma empresa.

### 📱 WhatsApp (22/07)
```
*Update Legalizai Story Book* 💰
- Continuei o raio-X da Contabilizei por dentro (minha conta de cliente, só olhando) e achei o que faltava sobre o preço deles: o "R$195" é só a fachada
- A conta real do cliente é: plano + um adicional que sobe com faturamento/funcionários (escondido) + uma prateleira de ~45 serviços cobrados à parte. E a mensalidade reajusta todo ano por índice, vendido como conversa amigável no chat
- Os números da prateleira (da tela real): fechar a empresa R$1.406 a 1.999, mudar a empresa/adicionar sócio depois a partir de R$1.299, comprovante de renda do sócio R$713, declaração pra abrir conta no banco R$68. Tem até uma isca de R$24,90 pra gerar orçamento de regularização
- Isso confirma nosso caminho: incluir no plano o que o cliente novo precisa cedo, não punir quem sai ou muda, e preço transparente de verdade
- O dossiê da plataforma deles está em ~85%. O que falta é impossível daqui (o app deles) ou eu escolhi não mexer (a conta bancária real)
Próximo: sentar com você pra decidir o que a gente faz com essa inteligência de preço
```

## Semana 22/07/2026 — 2º flow: definimos a parte interna do app (o "depois que abre")
| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | Parte interna do app | **Definimos o que o cliente vê depois que a empresa abre** (a área logada, o "dia a dia"): o que aparece na tela inicial, como ele navega, e o que cada tela mostra. Antes a gente só tinha telas de teste soltas; agora tem um mapa fechado | 🟢 |
| 2 | Como a gente cobra (3 baldes) | Peguei **tudo** que a Contabilizei oferece por dentro e separei em: o que **entra no nosso plano**, o que a gente **vende à parte** (aquela prateleira de serviços que eles escondem), o que fica **pra depois**, e as práticas deles que a gente **recusa** (vender por medo, pegadinha de preço) | 🟢 |
| 3 | **Decisão que precisa de você depois** | Os serviços que o cliente novo precisa cedo (certidão, declaração pra abrir conta no banco, liberação de nota) **eu deixei como vendáveis por ora** — mas **preço e o que a gente inclui de graça é decisão nossa, com você**. Não travei no produto | 🕓 conversa com você |
| 4 | O diferencial da tela inicial | O nosso trunfo (acompanhar o imposto vivo e avisar antes de subir) **só brilha depois de alguns meses de empresa** — no 1º dia a empresa não tem número nenhum. Então desenhei **duas versões da tela inicial**: a de quem acabou de abrir (foco em dar o 1º passo) e a de quem já está rodando (o painel de acompanhamento). Evita prometer o que não dá pra mostrar no dia 1 | 🟢 |
| 5 | Achei e corrigi um erro meu | Revisando meu próprio trabalho, achei um conflito: eu tinha escrito que o **certificado digital seria invisível**, mas ele **exige uma videoconferência do cliente** com a certificadora. Corrigi antes de construir em cima do erro | 🟢 |

**Próximo (22/07 2º):** amarrar essa definição nova com o mapa do portal que eu já tinha (tem um ponto a reconciliar) e depois montar a tela inicial de verdade juntando os componentes que já validei. O **preço + a lista do que a gente inclui vs cobra à parte** fica pra nossa conversa.

### 📱 WhatsApp (22/07 — 2º)
```
*Update Legalizai Story Book* 🧩
- Definimos a parte interna do app (o que o cliente vê depois que a empresa abre): a tela inicial, a navegação e o que cada tela mostra. Antes eram telas soltas, agora é um mapa fechado
- Peguei tudo que a Contabilizei oferece por dentro e separei em 4 caixas: o que entra no nosso plano, o que a gente vende à parte (a prateleira que eles escondem), o que fica pra depois, e o que a gente recusa fazer (vender por medo, pegadinha de preço)
- Uma decisão fica pra nossa conversa: os serviços que o cliente novo precisa cedo (certidão, declaração pra abrir conta, liberação de nota) eu deixei como vendáveis por ora, mas o preço e o que incluir de graça é decisão nossa
- Desenhei duas versões da tela inicial: a de quem acabou de abrir e a de quem já está rodando. Nosso diferencial (acompanhar o imposto vivo) só faz sentido depois de alguns meses, então não adianta prometer no dia 1
```

## Semana 23–24/07/2026 — o app ganhou cara: tela inicial, perfil, emitir nota + gestão interna + automação de consultas
| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | Tela inicial do app (a home) | **Montamos a home final** escolhendo peça por peça (mostrei 6 versões, você aprovou os trechos e a gente foi montando a "campeã"): o resumo do negócio, o imposto do mês pra pagar, atalhos, notas recentes, dicas e "quem cuida de você". Fica de pé e navegável | 🟢 |
| 2 | Tela de perfil da empresa | Construída como um **currículo da empresa** (tempo de CNPJ, notas emitidas, faturamento, situação fiscal), não como um cadastro chato — e já dizendo com honestidade o que só muda por alteração contratual (que é serviço pago) | 🟢 |
| 3 | Tela de emitir nota (NF-e) | A tela mais importante do dia a dia: pede só **cliente + valor**, puxa **tudo do cliente automaticamente pelo CNPJ**, mostra o imposto na hora e trava a atividade pra não dar erro. Ainda estamos lapidando | 🟡 em edição |
| 4 | Gestão interna do app | Definimos **como a gente vai operar por dentro**: um painel (kanban) pra acompanhar cada cliente pelas etapas (o que depende de nós, do governo, do cliente ou do parceiro do certificado) + o painel de métricas + como o **parceiro do certificado** trabalha dentro do nosso sistema. Entregue pro dev | 🟢 |
| 5 | Automação de consultas ao governo | Estudamos a fundo uma empresa de APIs (**InfoSimples**) e validamos **exatamente o que dá pra automatizar**: pelo CNPJ o sistema puxa razão social, endereço, e-mail, telefone, sócios, situação, certidões (federal, estadual, municipal de BH), FGTS, trabalhista. Isso vira base da automação e **corta erro** | 🟢 |
| 6 | **Decisão sua** | 🕓 O modelo do **parceiro do certificado** (a gente transfere o cliente, eles fazem, sobem o doc no nosso sistema) + **preço/política dos serviços vendáveis** seguem pra nossa conversa | 🕓 |

**Próximo (23–24/07):** terminar a tela de emitir nota, seguir com as outras telas do app (pagar imposto, pró-labore, notas, impostos), e as perguntas fiscais que se acumularam pra Larissa.

### 📱 WhatsApp (24/07)
```
*Update Legalizai Story Book* 📱
- Montamos a tela inicial final do app: escolhi as peças com você aprovando trecho a trecho, e ela já fica de pé (resumo do negócio, imposto do mês, atalhos, notas, dicas, "quem cuida de você")
- Construímos a tela de perfil da empresa (um currículo do CNPJ, não um cadastro chato) e a tela de emitir nota fiscal, que puxa tudo do cliente só pelo CNPJ e mostra o imposto na hora
- Definimos a gestão interna do app: um painel pra acompanhar cada cliente pelas etapas + como o parceiro do certificado trabalha dentro do nosso sistema. Já entreguei pro dev
- Validamos a fundo uma empresa de APIs (InfoSimples): pelo CNPJ o sistema puxa sozinho quase tudo (dados, endereço, sócios, certidões de BH, FGTS). Isso automatiza e corta erro
Precisa de você: fechar o modelo/preço do parceiro do certificado e dos serviços vendáveis
```

## Semana 24–27/07/2026 — o app por dentro ficou inteiro (parte do cliente)
| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | Emitir nota | Terminei a tela mais usada do dia a dia: pede só cliente + valor, e no fim **sobe um resumo pra conferir e confirmar** ("nota enviada"). Dá pra **ver todos os clientes** com busca, repetir a última nota num toque, e se uma nota é recusada o app leva o cliente **de volta pra corrigir e reemitir**, já preenchido | 🟢 |
| 2 | Notas | Construí a área de notas: a **lista** (com busca, filtro por situação e navegação por mês, pra achar uma nota antiga) e o **detalhe de cada nota** (ver o documento, baixar o PDF, enviar pro cliente por WhatsApp/e-mail). O status é automático — o cliente **não precisa marcar "paguei/emiti" na mão**, ao contrário do líder | 🟢 |
| 3 | Impostos | A área de impostos ficou de pé: o **imposto do mês pra pagar**, o acompanhamento fiscal (nosso diferencial), o histórico e o calendário de obrigações. **Decisão prática:** como a gente **não intermedia o pagamento por ora**, ao "pagar" o app **mostra e deixa baixar a guia + copiar o código de barras**, e a pessoa paga no banco/Pix/lotérica do jeito dela | 🟢 |
| 4 | Área "Mais" + plano | Montei o hub do app (a gaveta do que não é rotina) e a tela de **gerenciar o plano**: trocar forma de pagamento (cartão **ou Pix**), ver faturas passadas e cancelar. O jeito de cobrar os **serviços avulsos** ficou igual ao do líder no que funciona bem: **não cobra na hora, entra na próxima fatura** e dá pra remover antes | 🟢 |
| 5 | Loja de serviços avulsos | Construí a **prateleira de serviços à-la-carte** (certidão, declaração de faturamento, recálculo de guia, alteração, etc.) pensada pra **converter**: os mais pedidos em destaque e a fricção baixa ("sem cobrança agora"). É por onde entra a receita extra que a gente mapeou no líder | 🟢 |
| 6 | **Decisão sua (segue de pé)** | 🕓 **Preço** do plano e dos avulsos, **política do parceiro do certificado**, e o que a gente inclui de graça vs vende à parte. No app estão como **valores de exemplo**, marcados | 🕓 |

**Observação honesta:** tudo isso é **protótipo visual** (a "casca" do app, navegável), sem o motor por trás ainda e sem os números fiscais carimbados pela Larissa. Serve pra a gente ver e decidir a experiência antes de programar de verdade.

**Próximo (24–27/07):** lapidar detalhes; fechar com a Larissa o que é fiscal (o cálculo do imposto, o caso do cliente com CNPJ baixado); o caminho de "trocar de contador" (flow #2); e a nossa conversa de preço/parceiro.

### 📱 WhatsApp (27/07)
```
*Update Legalizai Story Book* 📱
- Terminei o app por dentro (a parte do cliente depois que a empresa abre): emitir nota, a área de notas, os impostos, o perfil e a área "Mais" com o plano. Tudo navegável
- Emitir nota: pede só cliente + valor, sobe um resumo pra confirmar, e se a nota é recusada leva o cliente de volta pra corrigir. Status automático, sem o cliente marcar nada na mão (diferente do líder)
- Impostos: como a gente não intermedia o pagamento por ora, o app mostra/baixa a guia e deixa copiar o código de barras — a pessoa paga do jeito dela
- Montei a tela de gerenciar plano (trocar cartão ou Pix, faturas, cancelar) e a "loja" de serviços avulsos, cobrando igual ao líder no que funciona: não cobra na hora, cai na próxima fatura
- Importante: tudo isso é protótipo visual (a casca do app), sem o motor por trás e sem os números fiscais carimbados pela Larissa ainda
Preciso de você (sem pressa): preço do plano e dos avulsos, e o modelo do parceiro do certificado. No app estão como valores de exemplo
```

## 📱 Versão WhatsApp (copiar/colar — grupo ampliado, sem item de sociedade)
```
*Relatório semanal — Legalizai Story Book* 📊
_07 a 10/07_

1️⃣ *Imersão* — conversas com o time (incl. Izabela) viraram decisões ✅
2️⃣ *Abertura de empresa (BH)* — passo a passo validado com a Izabela; Junta, Prefeitura e Estado mapeados ✅
3️⃣ *Concorrentes* — estudo a fundo dos 6 maiores: preços, comunicação e pontos fracos ✅
4️⃣ *Descoberta-chave* — ninguém é 100% automático: órgãos como JUCEMG e Gov.br exigem humano, E todos os concorrentes, no "abrir empresa grátis", terminam em "um consultor entra em contato". Confirmado pelos 3 ✅
5️⃣ *CNAEs* — mapa do que o app atende e não atende (460 sim / 804 não) ✅
6️⃣ *Tecnologia* — definida a base de como o app vai ser construído ✅
7️⃣ *Marca* — nome aprovado, tom de voz e cor principal (coral) definidos; *logo fechado* ✅
8️⃣ *Domínios e e-mail* — escolhidos e no carrinho (R$186/ano), no CNPJ da Legalize Digital ⏳ *aguardando autorização pra comprar*
9️⃣ *Organização* — conhecimento do projeto centralizado e seguro ✅

Semana que vem: reavaliar a rota do produto com essas descobertas (o dev já está nisso). Logo já fechado ✅
```

## Semana 28/07/2026 — reunião gravada virou 12 decisões travadas no fluxo de entrada
| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | **Só Belo Horizonte no MLP** | O app agora **trava logo na entrada**: se a pessoa não é de BH, a gente avisa que ainda não atende e captura o contato pra avisar quando abrir. Ninguém passa disso achando que a gente atende em outra cidade | 🟢 |
| 2 | **3 caminhos do "não atende"** | Antes era só "regulamentado" ou "comércio → time do Mauro". Agora tem um 3º: quando **ninguém** atende (nem a gente, nem regulamentado, nem o seu escritório), o app é honesto e não finge que existe pra onde mandar | 🟢 |
| 3 | **Dado pessoal logo no cadastro** | Nome, CPF, telefone e endereço passam a ser pedidos **já na criação da conta**, com confirmação por código (e-mail/SMS). Mais adiante o cliente só CONFERE, não digita tudo de novo | 🟢 |
| 4 | **Índice do IPTU virou obrigatório** | Corrigi um erro: o app deixava esse campo opcional, mas sem ele a documentação **não passa na Junta**. Agora trava até preencher | 🟢 |
| 5 | **Nome recusado: tenta sozinho antes de incomodar** | Se o 1º nome cai na Junta, o app já tenta o 2º e o 3º (as opções que o cliente priorizou) **sozinho**, sem precisar chamar ele de novo. Só se as 3 falharem é que pede novas sugestões | 🟢 |
| 6 | **Taxa da Junta: confirmado o formato atual** | Debatemos os dois jeitos de cobrar a taxa da Junta (a gente absorve × o cliente paga) e **fechamos no formato que já estava**: o cliente paga junto com a assinatura, e a gente só repassa pro governo depois que a Junta aprova o nome — sem cobrar de novo nem travar ele numa tela extra | 🟢 |
| 7 | Design system em página só | Fiz uma página (HTML, abre em qualquer navegador) com todo o padrão visual do app — cor, tipografia, componentes — **incluindo modo escuro**, testado pra garantir que o texto fica legível de verdade. Serve pra qualquer um da equipe consultar sem precisar instalar nada | 🟢 |

**Observação honesta:** o **motor de testes** (o que garante que o backend vai se comportar certo) ainda **não foi atualizado** com essas 12 mudanças — é o próximo passo antes de qualquer um começar a programar em cima disso.

**Próximo:** revalidar o motor de testes contra o fluxo novo; seguem pendentes preço do plano/avulsos e o modelo do parceiro do certificado.

### 📱 WhatsApp (28/07)
```
*Update Legalizai Story Book* 🗺️
- Travamos 12 decisões do fluxo de entrada numa reunião: o app só abre empresa em Belo Horizonte por enquanto (avisa e captura contato se não for); separamos melhor quem a gente não atende (regulamentado vai pra fila, quem seu escritório atende vai pra vocês, e quem ninguém atende recebe resposta honesta)
- Nome, CPF, telefone e endereço agora são pedidos já na criação da conta, com confirmação por código
- Corrigi um erro: o índice do IPTU estava como opcional, mas sem ele a Junta recusa a documentação — já travei como obrigatório
- Se o nome escolhido é recusado, o app tenta as outras 2 opções sozinho antes de incomodar o cliente de novo
- Confirmamos o formato da taxa da Junta: o cliente paga junto com a assinatura, e só repassamos pro governo depois que aprova — sem tela extra
- Fiz uma página com todo o padrão visual do app (cores, tipografia, modo escuro testado) — dá pra abrir e conferir sem instalar nada
Segue pendente: preço do plano/avulsos e o modelo do parceiro do certificado
```

## Semana 29/07/2026 — uma apresentação pra vocês, e o que ela já corrigiu
| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | **Apresentação pra equipe** | Montei uma tela que mostra o app **do lado do celular** e, do lado direito, a explicação de cada passo: o que aquela tela faz, **o que ela interfere na constituição da empresa** e por que pede aquele dado. Também marca **de quem é a espera** em cada momento (do cliente, nossa, ou do órgão) | 🟢 |
| 2 | **Preenchimento com 1 clique** | Na apresentação dá pra preencher qualquer tela num toque, e escolher o cenário: caminho normal, atividade regulamentada, comércio, ou fora de escopo. Assim dá pra mostrar **o que causa cada desfecho**, não só o resultado | 🟢 |
| 3 | **2 erros achados e corrigidos** | Preparar a apresentação expôs dois defeitos reais: (a) quem escolhia "já tenho empresa", voltava e escolhia "quero abrir" **via a tela errada**; (b) a tela de confirmação dizia *"achei o seu encaixe"* até para quem tinha entrado na **lista de espera** (onde nada foi encontrado) | 🟢 |
| 4 | **A tela de preço ficou vendedora** | A tela que mostra quanto custa era honesta mas fraca. Agora o plano vira **produto**: lista do que está incluso, perguntas frequentes que respondem as objeções reais (*"onde está a pegadinha?"*, *"por que fidelidade?"*) e um **comparativo** com o que se paga de honorário numa contabilidade tradicional | 🟢 |
| 5 | **Cidade validada de verdade** | Quem não é de BH entra numa lista de espera que agora **pergunta qual é a cidade**, com a lista oficial dos 5.570 municípios do IBGE. Sem isso a fila era só um monte de e-mail; agora dá pra saber **pra onde vale expandir** | 🟢 |
| 6 | **Padrão visual reconciliado** | O acervo de componentes tinha ficado desatualizado em relação às telas reais. Reconciliei, e as telas agora são **peça única**: o que muda no app muda na apresentação, sem risco de mostrar algo que não existe | 🟢 |

**Observação honesta:** o **motor de testes** continua sem atualizar (agora também em relação às mudanças desta semana). Segue sendo o passo antes de programar em cima disso.

**Pergunta pro Mauro:** no comparativo de preço usei **R$ 1.621** (um salário mínimo) como honorário médio de abertura numa contabilidade tradicional. Você tem o número real de mercado — qual valor devo usar?

**Próximo:** seguir a apresentação pelas telas seguintes (dossiê e acompanhamento na Junta) e revalidar o motor de testes. Preço do plano/avulsos e modelo do parceiro do certificado seguem pendentes.

### 📱 WhatsApp (29/07)
```
*Update Legalizai Story Book* 🎤
- Montei uma *apresentação* do app pra mostrar pra equipe de vocês: de um lado o celular com a tela real, do outro a explicação do que cada passo faz e o que ele interfere na constituição da empresa
- Ela também mostra *de quem é a espera* em cada momento: do cliente, nossa, ou do órgão público
- Preparar isso já achou e corrigiu 2 erros reais: quem escolhia "já tenho empresa" e voltava via a tela errada, e a confirmação dizia "achei o seu encaixe" até pra quem entrou na lista de espera
- A tela de preço ficou bem mais vendedora: o que está incluso item a item, perguntas frequentes que respondem as objeções ("onde está a pegadinha?") e um comparativo com o honorário de uma contabilidade tradicional
- Quem não é de BH agora entra numa lista que pergunta a cidade, validada na lista oficial do IBGE. Assim dá pra saber pra onde vale expandir
*Pergunta:* no comparativo usei R$ 1.621 (um salário mínimo) como honorário de abertura numa contabilidade tradicional. Qual o número real que vocês praticam?
```

## Semana 30/07/2026 — o caminho de quem JÁ TEM empresa passou a existir
| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | **Migrar de contador: telas prontas** | Metade do mercado é quem **já tem CNPJ** e quer trocar de contador. Esse caminho existia só no papel: quem clicava em "já tenho empresa" batia num aviso de *"ainda não disponível"*. Agora tem **as 9 telas do começo ao fim**, navegáveis | 🟢 |
| 2 | **A promessa aqui é mais forte que a da abertura** | Quem migra já tem **12 meses de faturamento e folha reais**. Então o app não estima nada: mostra **o número dele**, e quanto ele está deixando na mesa hoje. É o argumento comercial mais forte do produto | 🟢 |
| 3 | **Honestidade quando não há economia** | Se o contador atual **já fez certo**, a tela **diz isso** e vende serviço (atendimento, prazo, portal), não economia inventada. Prometer redução pra quem já está otimizado seria a mesma armadilha que a gente critica nos outros | 🟢 |
| 4 | ⚠️ **Decisão: cobramos ANTES da transferência** | Igual à abertura. Mas com uma diferença dura: quem libera a transferência é o **contador ANTIGO** (ele valida no Conselho). É a única espera do produto que depende de alguém que está **perdendo o cliente**. Por isso travei uma contrapartida obrigatória no contrato: *"se a transferência não sair por motivo fora do seu controle, você recebe tudo de volta"* | 🟢 (contrapartida é condição) |
| 5 | 🔥 **CNAEs: o "atendemos" encolheu de 124 → 111** | Passei um pente fino nos atendidos contra a **lista oficial de baixo risco** (CGSIM Res. 51/2019). Resultado: 6 saíram pra "não atendemos", 7 foram pra "em validação". **A seção de água/esgoto/resíduos saiu inteira** — exige licenciamento ambiental, e o pior: aqueles CNAEs **nunca tinham sido avaliados**, entraram na lista por não terem sido recusados | 🟢 |
| 6 | 📄 **Li o contrato do concorrente (plano R$195)** | 3 achados que mexem com a gente: (a) eles **não pagam a taxa da Junta** — está escrito que é obrigação do cliente. Vamos fazer igual; (b) a multa de rescisão é **30% do que falta pagar**, não do total; (c) a fidelidade deles **conta a partir do CNPJ emitido**, não da assinatura — protege o cliente contra demora do governo | 🟢 |
| 7 | 💰 **Simulação do plano de R$139** | Com a taxa da Junta fora, sobra **um só custo nosso na abertura: o certificado digital (~R$200)**. Simulei 3 cenários (cliente fica 12 meses / sai no 3º / sai no 8º) — em todos, a multa de 30% do saldo cobre o certificado com folga. **Mas:** na tabela real deles, R$139 só vale até R$25 mil/mês de faturamento; nosso cliente-alvo no teto da ME já pagaria **R$228** lá | 🟢 |
| 8 | **Apresentação pra vocês (HTML)** | Montei um documento único com: os links de tudo, a lista dos CNAEs por categoria clicável, **6 perguntas pra você decidir** e as simulações de preço com a conta aberta | 🟢 |
| 9 | 🐛 **8 defeitos reais corrigidos** | Entre eles: a sequência inteira de telas do dossiê **não avançava**; o capital social podia passar em branco; o CPF era pedido duas vezes; quem pagava por boleto **nunca chegava** na tela de acompanhamento | 🟢 |

**Observação honesta:** o **motor de testes** segue sem atualizar (agora somam-se as mudanças de 28, 29 e 30/07). É dívida acumulada há 3 sessões e continua sendo o passo antes de programar em cima disso.

**Perguntas pro Mauro (as 6 estão na apresentação):** teto de faturamento do plano · cartão pra tráfego pago · taxa da Junta e certificado (quanto considerar) · plano do Simples × plano do Lucro Presumido · fidelidade de 12 meses com multa de 30% · destino dos CNAEs que precisam de licença municipal.

**Próximo:** revalidar o motor de testes; concluir a reorganização da documentação (em curso). Preço do plano/avulsos e parceiro do certificado seguem pendentes.

### 📱 WhatsApp (30/07)
```
*Update Legalizai Story Book* 🔁
- O caminho de quem *já tem empresa e quer trocar de contador* agora existe de verdade: 9 telas do começo ao fim. Antes esbarrava num "ainda não disponível" (e isso é metade do mercado)
- Aqui a promessa é mais forte que na abertura: como a empresa já fatura, mostramos o *número real* dos 12 meses dele, não uma estimativa
- E se o contador atual já fez certo, a tela *diz isso* e vende serviço, não economia inventada
- Decisão: cobramos antes da transferência. Só que quem libera a transferência é o contador antigo (ele valida no Conselho), então travei no contrato: se não sair por motivo fora do controle do cliente, devolvemos tudo
- Pente fino nos CNAEs: caiu de 124 pra 111 atendidos. Água/esgoto/resíduos saiu inteiro (exige licença ambiental) e nem tinha sido avaliado antes
- Li o contrato da Contabilizei: eles *não pagam a taxa da Junta* (é obrigação do cliente) e a multa deles é 30% do que falta pagar. Vamos fazer igual
- Simulei o plano de R$139 com 12 meses de fidelidade: com a Junta fora, nosso único custo na abertura é o certificado (~R$200), e a multa cobre em qualquer cenário de saída
- Montei uma apresentação com tudo isso + *6 perguntas pra você decidir*
```

## Semana 31/07/2026 — organizamos a "caixa de ferramentas" do design e conectamos o painel interno

| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | **Catálogo vivo de telas e componentes** | Montei uma ferramenta (Storybook) que mostra CADA tela e peça visual do app renderizada de verdade — não é mais um documento que pode ficar desatualizado, é o próprio código. Isso evita o que já aconteceu antes: um documento dizer uma coisa e o app fazer outra | 🟢 |
| 2 | **3 bugs pequenos achados organizando isso** | O botão "Começar" da 2ª tela do app não levava a lugar nenhum (corrigido); e 2 telas que a gente achava que estavam catalogadas na verdade não estavam | 🟢 |
| 3 | **Limpeza de telas que não existem mais** | 3 rotas que sobraram de uma versão antiga do fluxo (viraram beco sem saída depois de mudanças já aprovadas) foram removidas de vez, não só esquecidas no código | 🟢 |
| 4 | **Painel interno (CRM) conectado ao mesmo sistema visual do app** | O CRM já roda no modo escuro (é o padrão dele). Conectei os dois pra que, se a gente mudar uma cor no app principal, o CRM acompanhe — antes eram cópias independentes que podiam divergir sem ninguém perceber | 🟢 |

**Observação honesta:** o **motor de testes** segue sem atualizar, agora 4 sessões atrasado (28, 29, 30 e 31/07).

**Próximo:** decidir com você o destino de ~30 telas de exploração que ainda estão no código mas não são mais usadas (manter como arquivo histórico ou remover).

### 📱 WhatsApp (31/07)
```
*Update Legalizai Story Book* 🧰
- Montei um catálogo vivo de todas as telas e peças do app — renderizado do código de verdade, não um documento que pode ficar desatualizado
- Isso já achou e corrigiu 3 bugs pequenos (um botão que não levava a lugar nenhum, 2 telas que a gente achava catalogadas e não estavam)
- Limpei 3 rotas que sobraram de uma versão antiga e não iam a lugar nenhum
- Conectei o painel interno (CRM, que já roda no modo escuro) ao mesmo sistema visual do app principal — antes eram cópias que podiam divergir sem ninguém perceber
```

## Semana 03/08/2026 — o site saiu do papel: no ar, com marca nova e páginas que os anúncios exigem

| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | **Rebrand Legalizai valeu pra valer** | A marca virou Legalizai (não mais Legalizai Story Book) no site também, não só no app — logo, textos, tudo trocado | 🟢 |
| 2 | **Site (landing page) e página "em breve" no ar** | Publiquei os dois no ar de verdade (não é mais rascunho local): o site principal e uma página simples de "chegando em breve" que já captura nome, e-mail, WhatsApp e cidade de quem quiser ser avisado no lançamento | 🟢 |
| 3 | **Política de Privacidade e Termos de Uso publicados** | O Google e o Meta (Instagram/Facebook) exigem essas 2 páginas pra aprovar conta de anúncio — já estão no ar com os dados reais da Legalize Digital | 🟢 |
| 4 | **2 bugs achados e corrigidos ao publicar** | Coisas que só aparecem quando o site vai pro ar de verdade (link quebrado entre as páginas, estilo não carregando) — achei e corrigi na hora | 🟢 |

**Próximo:** configurar de fato as contas de anúncio no Google e Meta (as páginas só destravam a aprovação, o cadastro em si ainda falta).

### 📱 WhatsApp (03/08)
```
*Update Legalizai Story Book* 🚀
- O site saiu do papel: publiquei o site principal e uma página de "chegando em breve" (já captura nome, e-mail, WhatsApp e cidade de quem quiser ser avisado)
- A marca virou Legalizai também no site, não só no app
- Publiquei Política de Privacidade e Termos de Uso — o Google e o Meta exigem isso pra aprovar conta de anúncio
- Achei e corrigi 2 bugs que só apareceram quando o site foi pro ar de verdade
- Próximo passo: configurar as contas de anúncio de fato
```

## Semana 04/08/2026 — MEI entra de vez, e descobrimos que dá pra economizar consulta paga

| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | **MEI entra de vez no produto** | Reverti a decisão antiga de deixar MEI fora do foco. Agora MEI pode **migrar de contador** com a gente também, não só abrir do zero. Achado no caminho: MEI não é obrigado a ter contador hoje — então a tela pergunta isso e decide se pula a parte de transferência | 🟢 |
| 2 | **Plano MEI criado: R$49,90/mês** | Não é o plano normal (R$195) com desconto — é um plano **menor de propósito**: emitir nota fiscal + cuidar do único funcionário que a lei permite ao MEI. Certificado digital incluso, com fidelidade de 12 meses (a gente paga o certificado, por isso a fidelidade) | 🟢 (preço é ponto de partida, não travado com você ainda) |
| 3 | **Lucro Presumido: decisão explícita de ficar de fora, por enquanto** | Diferente de MEI, Lucro Presumido usa uma conta de imposto totalmente diferente (não é só trocar 1 número) — decidimos não fingir que atendemos até termos isso pronto de verdade. Quem cai nesse caso vê uma tela honesta, não um erro | 🟢 |
| 4 | **Achado que economiza dinheiro: 2 consultas pagas na Receita, não 1** | Testei as 2 consultas reais que a gente vai usar (uma confirma o cadastro da empresa, a outra confirma se é Simples ou Lucro Presumido). Rodar as duas em **todo mundo que só está testando, ainda sem pagar nada**, custaria dinheiro à toa. Decisão: a 2ª consulta (a mais cara) só roda depois que a pessoa **já é cliente** — antes disso, a gente pergunta direto pra pessoa (mesmo jeito que já fazíamos pra saber se é MEI ou ME) | 🟢 |
| 5 | **Ícones animados — 1º teste** | Comecei a trocar alguns ícones do app por pequenas animações (mais vivo que ícone parado). Primeiro teste já aplicado em 3 telas de aviso/saída, pra você ver o estilo antes de estender pro resto | 🟡 em teste |

**Próximo:** seguir trocando os ícones animados 1 por 1 com a sua validação; decidir se topa incluir Lucro Presumido no roadmap (exige uma pesquisa fiscal nova, do zero) e validar o preço do Plano MEI.

### 📱 WhatsApp (04/08)
```
*Update Legalizai Story Book* 🧩
- MEI agora pode migrar de contador com a gente também (antes só abria do zero)
- Criei um plano específico pro MEI: R$49,90/mês (emitir nota + cuidar do funcionário que a lei permite), certificado digital incluso, fidelidade de 12 meses
- Lucro Presumido: decidi deixar de fora por enquanto, de forma explícita — o cálculo de imposto é outro motor inteiro, não dá pra fingir que atendemos
- Achado que economiza dinheiro: testei as 2 consultas pagas que vamos usar na Receita Federal. Rodar as duas em quem ainda nem virou cliente custaria à toa — a mais cara só roda depois que a pessoa já pagou
- Comecei a trocar alguns ícones do app por animações, 1 por 1, pra você ir validando o estilo
```

## Semana 05/08/2026 — montei a estratégia de marketing inteira, e um cálculo errado apareceu

| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | **Estratégia de marketing completa** | Montei o guia inteiro de marketing e produto: quem são nossos clientes (personas), o que postar nas redes, como vamos anunciar, e a conta de quanto custa trazer cada cliente. Não é mais só o produto — agora tem o plano de como vender ele | 🟢 |
| 2 | **Preço do plano ME revisado: R$139/mês** (era R$195 provisório) | Rodei a conta com o custo técnico que já sabemos (sem contar seu honorário ainda, isso segue pendente com você) | 🟢 (preço técnico, falta seu número real) |
| 3 | **Achado importante: nosso cálculo de quanto podemos gastar pra trazer 1 cliente estava errado** | Eu tinha calculado em cima de 1 mês só; o certo é calcular em cima do tempo que o cliente fica com a gente (2 anos, por exemplo). Corrigi a conta. Resultado: o plano MEI (R$49,90) é frágil pra atrair cliente com anúncio pago — a margem é curta demais. Decisão: MEI não vai ter anúncio pago direto, só vem por indicação/orgânico ou de quem já é cliente ME | 🟢 |
| 4 | **Descobri onde anunciar de verdade** | Pesquisei o mercado específico de contabilidade digital (não só "empresa em geral"): Instagram é a rede certa (63-83% do nosso público tá lá), e no anúncio pago o Meta (Instagram/Facebook) funciona melhor que Google pra esse público, no nosso orçamento inicial | 🟢 |
| 5 | **Descobri o jeito certo de vender: WhatsApp, não formulário** | A decisão de comprar não acontece numa página com formulário — acontece numa conversa no WhatsApp com uma pessoa de verdade tirando a dúvida na hora. O anúncio vai levar direto pra conversa, não pra um site | 🟢 |

**Próximo:** falta seu número de custo real (honorário por cliente) pra travar a margem de verdade — sem isso, os R$139 e o cálculo de anúncio ainda são só técnicos. E falta configurar de fato as contas de anúncio pra começar a testar.

### 📱 WhatsApp (05/08)
```
*Update Legalizai Story Book* 📈
- Montei a estratégia de marketing inteira: quem são nossos clientes, o que postar, como anunciar e quanto custa trazer cada um
- Revisei o preço do plano ME pra R$139/mês (ainda sem contar seu honorário, isso segue pendente)
- Achei um erro no cálculo de quanto podemos gastar pra trazer 1 cliente — corrigido. Descoberta: o plano MEI é frágil pra anúncio pago, então ele não vai ter anúncio direto, só vem por indicação
- Descobri que Instagram é a rede certa pro nosso público, e que a venda de verdade acontece numa conversa de WhatsApp, não num formulário de site
- Falta seu número de custo real pra travar a conta de vez
```

## Semana 06/08/2026 — revisei o texto de todas as telas de entrada + achei que MEI não precisa da parte mais arriscada da migração

| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | **PDF pro gestor de tráfego** | Compilei os 14 documentos da estratégia de marketing num PDF de leitura fácil pra ele e eu debatermos os próximos passos com calma | 🟢 |
| 2 | **Revisão de texto ponta a ponta** (das telas iniciais até o veredito de "a gente atende você") | Reli cada tela procurando promessa que a gente não cumpre, termo técnico sem explicação e texto que não bate com o que a API de fato traz da Receita. Achei e corrigi vários pontos — nada que trocasse dinheiro de mão, só honestidade de tela | 🟢 |
| 3 | **Simplificação real na migração de MEI** | Reparei que a pergunta "você tem contador?" confundia 2 coisas diferentes. Troquei pra "você já tem certificado digital?" — pergunta mais direta e que resolve o mesmo problema sem a parte mais arriscada do processo (a transferência formal com o contador antigo), que pesquisando direito, o MEI normalmente nem tem pra transferir | 🟡 (dedução minha, ainda não confirmada com a Larissa) |
| 4 | **Tela nova pra quem escolhe o regime errado** | Adicionei uma opção "Lucro Presumido" na tela de MEI×ME, que hoje leva direto pra falar com um especialista — antes essa pessoa não tinha opção nenhuma que batesse com a realidade dela | 🟢 |

**Próximo:** confirmar com a Larissa se todo MEI migrando realmente não tem contador registrado formalmente (pra travar o item 3 de vez). Pedro ainda vai revisar a tela seguinte da migração (o plano/preço), apontou que precisa de ajuste mas não detalhou o quê.

### 📱 WhatsApp (06/08)
```
*Update Legalizai Story Book* 🔍
- Montei um PDF de leitura da estratégia de marketing pra debater com o gestor de tráfego
- Revisei o texto de todas as telas iniciais do app, corrigindo promessas que não batiam com o que a gente de fato entrega
- Simplifiquei a migração de quem é MEI: em vez de perguntar sobre contador, agora pergunto sobre certificado digital — resolve o mesmo problema sem o passo mais arriscado (ainda preciso confirmar essa hipótese com a Larissa)
- Criei um caminho novo pra quem é Lucro Presumido: antes não tinha pra onde ir, agora vai direto falar com um especialista
```

## Semana 13/08/2026 — vou levar a estratégia de marketing inteira pra uma segunda opinião

| # | Frente | O que evoluiu | Status |
|---|--------|---------------|--------|
| 1 | **Estratégia de marketing vai passar por revisão externa** | Montei um documento com a estratégia inteira (mercado, concorrentes, posicionamento, jeito da marca falar, tipos de cliente, o que postar, preço e margem, como a venda acontece, riscos) pra sentar com o gestor de tráfego e ele conferir ponto a ponto. Ele não vai só cuidar de anúncio: vai dar a segunda opinião na estratégia toda, que até agora eu montei sozinho | 🟡 (documento pronto, reunião ainda não aconteceu) |
| 2 | **Corrigi um arquivo quebrado que eu não tinha percebido** | O PDF de leitura que eu tinha gerado semana passada estava corrompido e ninguém tinha aberto ainda. Refiz e criei um jeito de conferir antes de dar por pronto, pra não repetir | 🟢 |
| 3 | **A estratégia virou um documento apresentável** | Transformei o documento em um PDF de 29 páginas com a nossa cara (nossa cor, nossa fonte, nossa marca na capa), pronto pra mandar pra qualquer pessoa de fora sem parecer rascunho. Serve pro gestor de tráfego agora e pra investidor depois | 🟢 |
| 4 | **Comecei o roteiro do vídeo de apresentação da empresa** | Três versões diferentes de um vídeo curto (mais ou menos 1 minuto e meio) pra apresentar a Legalizai pra investidor ou aceleradora. Todas começam pelo tamanho do mercado, mostram por que começamos por Belo Horizonte e terminam dizendo que estamos prontos pra ser o maior aplicativo contábil do Brasil. Estou testando a narração antes de gravar | 🟡 (3 versões escritas, falta escolher uma) |

**Próximo:** a reunião com o gestor de tráfego. O que sair dela ajusta a estratégia antes de a gente gastar o primeiro real em anúncio. Continuam pendentes com você: seu número de honorário por cliente (destrava a margem de verdade) e os números de corte pra decidir se o teste deu certo ou não.

### 📱 WhatsApp (13/08)
```
*Update Legalizei* 🧭
- Organizei a estratégia de marketing inteira num documento só pra levar pro gestor de tráfego revisar comigo ponto a ponto. Ele vai dar a segunda opinião na estratégia toda, não só na parte de anúncio
- Achei e corrigi um arquivo quebrado da semana passada que tinha passado batido
- Assim que a reunião acontecer eu te trago o que mudou
```

### 📱 WhatsApp (14/08)
```
*Update Legalizei* 🎬
- A estratégia de marketing virou um PDF de 29 páginas com a nossa cara, pronto pra mandar pra gente de fora sem parecer rascunho
- Comecei o roteiro do vídeo de apresentação da empresa pra investidor: 3 versões de mais ou menos 1 minuto e meio, todas fechando em "estamos prontos pra ser o maior aplicativo contábil do Brasil"
- Todas usam os seus 22 anos de contabilidade como lastro e explicam por que a gente começa por BH (a capital que abre empresa mais rápido do país)
- Falta escolher qual das 3 e gravar a narração
```

## Semana 20-21/08/2026 — a primeira campanha de anúncio ficou pronta, e fechamos o preço de lançamento por telefone

| # | Frente | O que evoluiu | Status |
|---|---|---|---|
| 1 | **Primeira campanha de tráfego pago montada inteira** | É uma campanha de lista de espera: a pessoa deixa o contato e garante a condição de lançamento antes do app existir de verdade. Criei um jeito organizado de guardar toda campanha futura (não só essa), pra não se perder quando vierem a 2ª, 3ª campanha | 🟢 |
| 2 | **Preço de lançamento fechado com você por telefone** | Ficou assim: MEI entra a R$19/mês nos 3 primeiros meses, depois R$49. ME/Simples entra a R$99/mês nos 3 primeiros, depois R$139 (esse é o preço de quando o app já estiver no ar). **Só nesta campanha**, quem entrar na lista antes do lançamento garante o ME por R$79 nos 3 primeiros meses, em vez de R$99 — é o prêmio de quem chegou primeiro. Vale até 31/12/2026 | 🟢 |
| 3 | **Simulei o pior cenário antes de assinar embaixo** | Fiz a conta de "e se o cliente cancelar já no primeiro mês, com a multa que o contrato prevê?" pros dois planos. Nos dois, mesmo no pior caso, a conta fecha positiva — não corre risco de prejuízo por causa do preço de entrada baixo | 🟢 |
| 4 | **24 peças de anúncio escritas e revisadas** | 12 posts estáticos + 12 roteiros de vídeo curto (15 e 30 segundos), sempre em 2 tons (um mais sério, um mais brincalhão) pra testar o que funciona melhor. Passaram por uma revisão própria antes de eu considerar prontas — nenhuma foi reprovada, algumas ganharam ajuste fino | 🟢 |
| 5 | **A página que recebe o anúncio (formulário) foi corrigida** | Ela ainda dizia "1º mês grátis", que não é mais a oferta real, e prometia "contador de verdade" pro MEI sem deixar claro que no MEI quem atende é o assistente virtual, não um contador dedicado (isso é assim desde 17/07). Mandei a correção pra quem tá mexendo no site agora; falta eu conferir se ficou certo | 🟡 |

**Próximo:** revisar o resultado da página corrigida, decidir orçamento/período/meta da campanha e colocar o anúncio no ar. Continua pendente com você: seu número de honorário por cliente (é o dado que mais muda a conta de margem, ainda estimado).

### 📱 WhatsApp (20-21/08)
```
*Update Legalizai* 📣
- Montei a primeira campanha de anúncio (Instagram/Meta): é lista de espera, quem entra antes garante a condição de lançamento
- Fechamos por telefone: MEI R$19 nos 3 primeiros meses (depois R$49), ME/Simples R$99 (depois R$139) como preço padrão, e R$79 como prêmio exclusivo de quem entra na lista antes, válido até 31/12
- Testei a conta do pior caso (cliente cancela rápido, com multa) e fecha positiva nos dois planos
- 24 peças de anúncio prontas e revisadas (posts + vídeos curtos), nenhuma reprovada
- Corrigi 2 erros na página do formulário (oferta desatualizada + promessa que não valia pro MEI) e já mandei ajustar
```

## Semana 25/08/2026 — arrumei toda a organização do projeto e criei um lugar único pro preço

| # | Frente | O que evoluiu | Status |
|---|---|---|---|
| 1 | **Organização geral dos documentos** | O projeto já tinha bastante coisa documentada, mas espalhada de um jeito que dificultava achar rápido (ex: estratégia de marketing misturada com pesquisa pura, pauta de reunião longe da ata). Reorganizei tudo por assunto, sem perder nada (histórico do git preservado) | 🟢 |
| 2 | **Achei e resolvi um risco real: preço espalhado em vários lugares** | Testei perguntando "qual é o preço decidido hoje?" e descobri que o número certo só aparecia se eu soubesse exatamente onde procurar — em pelo menos 3 documentos ainda ficou o preço antigo do MEI (R$49,90 em vez de R$49). Criei 1 arquivo único ("estado atual") que sempre tem o preço/CAC/margem certo e atualizado, pra nunca mais depender de eu lembrar onde está | 🟢 |
| 3 | **Arquivei o que já morreu** | Protótipo antigo (já substituído pelo app de verdade), diário da imersão e uma reorganização que tinha ficado travada desde julho — tudo virou histórico organizado em vez de ficar solto confundindo | 🟢 |

**Próximo:** nenhuma pendência nova pra você aqui — foi organização interna. Continua pendente: seu número de honorário por cliente.

### 📱 WhatsApp (25/08)
```
*Update Legalizai* 📣
- Reorganizei toda a documentação do projeto por assunto (nada foi perdido, só arrumado)
- Achei um risco real: o preço do MEI ainda aparecia errado (R$49,90 velho) em 3 lugares diferentes — criei 1 arquivo único que sempre tem o preço/custo certo e atualizado
- Arquivei o que já não serve mais (protótipo antigo, diário da imersão) pra não confundir mais ninguém
```

## Semana 31/08/2026 — gravamos uma abertura de verdade na Junta e o app tinha erro que teria travado cliente

> Esta é a semana mais importante do produto até aqui em termos de "o que a gente achava × o que é". Sentamos com a Izabela e **abrimos uma empresa de verdade na JUCEMG**, gravando a tela campo a campo, da consulta de viabilidade até a hora de assinar. Depois comparei tudo com o que o app fazia.

| # | Frente | O que evoluiu | Status |
|---|---|---|---|
| 1 | **Achamos um erro que teria travado cliente de verdade** | Em Belo Horizonte, se o endereço da empresa é **apartamento**, a Prefeitura só aprova se o sócio morar lá. Vimos isso ao vivo: a mesma empresa foi **indeferida e depois deferida** só mudando essa resposta. O nosso app **nem perguntava isso** pra quem abre sozinho — que é justamente o caso mais comum. Corrigido | 🟢 |
| 2 | **Faltavam os dados do sócio** | O app pedia só nome e percentual do sócio. A Junta exige o mesmo tanto de dado do sócio e do titular (nascimento, RG, estado civil, regime de bens). Com 2 sócios, o contrato **não poderia ser feito** com o que a gente coletava. Corrigido | 🟢 |
| 3 | **Descoberta que economiza tempo em toda abertura** | Se a gente anexar procuração no processo, a Junta **tira a empresa da aprovação automática** e joga pra análise manual. Isso responde de vez a dúvida que estava aberta desde julho: **não vale pedir procuração da Junta** | 🟢 |
| 4 | **Tiramos 1 tela e 1 pergunta do caminho do cliente** | "Tipo de empresa" (SLU × LTDA) virou decisão nossa, automática, dos dois lados. Capital social também: fixo em R$10 mil, a gente preenche. Menos coisa pra pessoa decidir, mais rápido pra ela chegar no fim | 🟢 |
| 5 | **Documentei os 20 campos que a gente preenche sem perguntar** | Eram 3 documentados, e **2 estavam errados**. Agora são 20, cada um com o valor certo e o porquê — serve tanto pra mim desenhar tela quanto pro desenvolvedor programar o robô sem adivinhar nada | 🟢 |
| 6 | **Juntei 2 telas de acompanhamento numa só** | Quem sai do app e volta agora cai sempre no mesmo lugar, vendo a jornada inteira (do primeiro dado até o CNPJ sair). Antes eram 2 telas parecidas, e a pessoa não sabia em qual estava | 🟢 |
| 7 | **141 prints da Junta guardados e organizados** | Cada tela do processo real, com a explicação da Izabela do lado. Vira material de treinamento e referência pro desenvolvedor não errar campo | 🟢 |

**Próximo (preciso de você / da Izabela):**
1. **Assinatura**: os documentos oficiais (DBE e a guia DAE) têm campo de "assinatura com firma reconhecida". Na prática a gente assina pelo GOV.BR. **Vale confirmar com a Izabela** se o eletrônico substitui mesmo, ou se em algum caso precisa do cartório.
2. **Endereço do contador**: no formulário, no campo de endereço da *pessoa física* do contador, a gente coloca o endereço do escritório. A Izabela disse que não tem impedimento, mas ninguém confirmou isso numa fonte. Vale checar.
3. **Procuração do e-CAC** (a que deixa a gente pagar guia e cuidar das obrigações): ela só pode ser feita **depois** que o CNPJ sai. Preciso reposicionar isso no fluxo — e vale decidir se a gente emite certificado digital pro cliente (aí a procuração nem seria necessária).

### 📱 WhatsApp (31/08)
```
*Update Legalizai* 📣
- Sentamos com a Izabela e abrimos uma empresa DE VERDADE na Junta, gravando tela por tela (141 prints guardados)
- Achamos um erro sério no nosso app: em apartamento, a Prefeitura de BH exige que o sócio more no local — e a gente nem perguntava isso pra quem abre sozinho. Vimos ao vivo a empresa ser indeferida e depois deferida só por causa dessa resposta. Já corrigido
- Faltavam dados obrigatórios do sócio (RG, nascimento, estado civil) — com 2 sócios o contrato não sairia. Corrigido
- Descoberta boa: anexar procuração no processo TIRA a empresa da aprovação automática da Junta. Ou seja, não vale a pena pedir procuração da Junta pro cliente
- Tirei 1 tela e 1 pergunta do caminho: tipo de empresa e capital social agora a gente preenche sozinho
- 3 coisas pra confirmar com a Izabela: se assinatura GOV.BR substitui firma reconhecida, se pode usar o endereço do escritório no campo pessoal do contador, e quando exatamente fazer a procuração do e-CAC
```

## Links
- [[decisoes-marca]] · [[conceito-marca]] · [[spec-mvp-v0]] · [[2026-07-10-teto-automacao-orgaos-sem-api]] · [[2026-07-10-reporte-tecnico-pedro-dev]] · [[HOME]] · [[estado-atual]] · [[indice-autoridade]]
