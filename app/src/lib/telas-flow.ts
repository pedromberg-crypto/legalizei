/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CATÁLOGO DE TELAS — FONTE ÚNICA de rota + rótulo + ordem do flow.
 * ═══════════════════════════════════════════════════════════════════════════
 * Nasceu em `/mockup` (prancha de review) e foi extraído pra cá em 06/08 pra
 * `/apresentacao` deixar de ter cópia própria dos rótulos (2 bugs de copy só
 * sobreviviam na cópia da demo — a raiz era duplicação, não falta de
 * auditoria). Editar aqui muda o `/mockup` E o rótulo mostrado no painel da
 * `/apresentacao` ao mesmo tempo — zero sincronização manual entre os dois.
 *
 * `nota` é comentário de review (por que a tela é como é, pro Pedro reler no
 * `/mockup`) — não é consumido pela apresentação, só pelo mockup e pelo mapa
 * mental embutido nele.
 *
 * Ordem dos GRUPOS segue `execucao/flow/flow-data.mjs` (Entrada→Dinheiro→
 * Constituição→Aprovação) + `execucao/portal/portal-data.mjs` (Portal).
 */

export interface Tela {
  rota: string;
  nome: string;
  nota: string;
  /** Tela de fundo escuro: o cromo do iOS inverte pra branco. Só a splash. */
  statusClaro?: boolean;
}

export interface GrupoTelas {
  id: string;
  nome: string;
  descricao: string;
  telas: Tela[];
}

export const GRUPOS: GrupoTelas[] = [
  {
    id: "entrada",
    nome: "E1–E4 · Entrada (com Migrar fundido no fork)",
    descricao:
      "As primeiras telas, antes de qualquer pergunta de negócio — e o ponto onde o flow bifurca em 2 caminhos (ADR 03/08: Migrar não é 'flow #2', é decimal DENTRO da Entrada). E1–E3 não mapeiam em nenhum arquétipo A1–A10: não perguntam, não julgam, não provam nada. 🆕 03/08: quem escolhe 'abrir' passa pela E3.2 (MEI×ME) ANTES do gate de cidade — MEI pula E4 inteiro (sem limite geográfico) e vai direto pro E5; só ME confirma cidade. 🆕 04/08 (2ª rodada): Migrar TAMBÉM passa pela E3.2 agora (copy própria, autodeclaração em vez de critério de escolha) — MEI pula direto pro E4.2 (M1), só ME confirma cidade antes.",
    telas: [
      {
        rota: "/splash",
        nome: "E1 · Splash",
        nota: "O único momento em que o coral cobre a tela toda. Logo negativa, check em wipe (mesmo gesto que o confete do E5 ecoa). 🚧 Não auto-navega: numa prancheta, tela que se substitui sozinha some.",
        statusClaro: true,
      },
      {
        rota: "/welcome",
        nome: "E2 · Welcome",
        nota: "3 teses da marca na ordem que desarma a desconfiança: gente de verdade → a dor sem contabilês → preço sem susto. Pulável desde o slide 1 (o `reta-direto` odeia onboarding que prende).",
      },
      {
        rota: "/entrada",
        nome: "E3 · Fork de 3 rotas",
        nota: 'A palavra "migrar" NÃO aparece (UX-55): é jargão e "trocar de contador" excluiria quem não tem contador, que é o melhor cliente do caminho migrar. Pergunta pelo fato, nunca pela operação. Login é link, não botão. ✅ 28/07: 3 rotas CONFIRMADAS na reunião (abrir/migrar/já-cliente).',
      },
      {
        rota: "/entrada?intencao=abrir",
        nome: "🆕 E3.2 · MEI × ME (variante Abrir)",
        nota: "03/08 — REALOCADA (morava no fim do E5, decisão revertida). Pergunta DIRETA logo após o fork, antes do gate de cidade — quem abre MEI geralmente já sabe. Recomendação, não trava. Escolher MEI pula o E4 inteiro e vai direto pro E5 (`/gate?regime=mei`) — MEI atende o Brasil todo, só o ME/Simples é que hoje só atende BH/MG. 🔴 Ainda não corrige se a pessoa disser MEI aqui e depois a triagem revelar 2+ sócios (gap conhecido). Copy = critério de ELEGIBILIDADE (\"o que devo escolher\"), diferente da variante Migrar.",
      },
      {
        rota: "/entrada?intencao=migrar",
        nome: "🆕 E3.2 · MEI × ME (variante Migrar)",
        nota: "04/08 — mesma tela (`MeiOuMeView`), `contexto=\"migrar\"`: copy vira AUTODECLARAÇÃO (\"Sua empresa hoje é MEI ou ME?\", não \"qual devo escolher\" — o CNPJ já existe, não há escolha). Decisão do Pedro: inverter a ordem que existia (perguntava cidade ANTES de saber o regime). Escolher MEI pula a cidade e vai DIRETO pro M1 (`/migrar/cnpj?cenario=mei`). Escolher ME cai no gate de cidade de sempre. Autodeclarado, não trava nada — quem confirma de verdade é o M1, puxando da Receita.",
      },
      {
        rota: "/entrada?intencao=abrir&regime=me",
        nome: "E4 · Gate de cidade (BH-MG) · 🏷️ SÓ ME (abrir + migrar)",
        nota: "✅ 28/07 (reunião Rua Satélite 9) — 2º passo do E3, mesma tela. MLP só atende Belo Horizonte/MG; trava 'abrir'/'migrar' até confirmar (login pula, já passou por isso). 03/08: MEI PULA esta tela inteira (sem limite geográfico) — vale pros 2 caminhos desde 04/08 (Migrar também passa pela E3.2 agora, antes desta tela). Rota com `&regime=me` pula a pergunta pra revisão direta.",
      },
      {
        rota: "/saida/fora-bh",
        nome: "E4.1 · Saída · fora de BH · 🏷️ SÓ ME + MIGRAR",
        nota: "✅ 28/07 — nasce do gate de cidade (E4), não da triagem do E5. Mesmo template A9 das outras saídas (barra+explica+captura+roteia). MLP em fase de testes, só BH por enquanto. 03/08: MEI nunca cai aqui — pula o E4 inteiro (nos 2 caminhos).",
      },
      {
        rota: "/migrar/cnpj",
        nome: "E4.2 · Migrar · Seu CNPJ (consulta + veredito)",
        nota: "Consulta e veredito na MESMA tela, de propósito: no caminho abrir o veredito é tela própria porque depende da IA interpretar texto livre (pode errar); aqui o CNAE é fato registrado. Digite qualquer CNPJ de 14 dígitos → loading que explica → cartão + as 4 checagens + veredito. 🆕 04/08 (2ª rodada): **MEI agora PASSA** (checagem de regime ok) — só Lucro Presumido segue bloqueado. `?cenario=mei|presumido|inapto` demonstra os 3 cenários. 🆕 04/08 (3ª rodada): quem chega aqui vindo de MEI na E3.2 já pula direto com `?cenario=mei` — ME continua chegando 'limpo' (padrão) depois do gate de cidade.",
      },
      {
        rota: "/migrar/cnpj?fase=achou",
        nome: "🆕 E4.2 · Achamos sua empresa",
        nota: "04/08 (pedido do Pedro) — extraída de dentro do M1 pra virar tela própria, catalogável ao lado dele: o card com os dados da Receita + as 4 checagens + veredito. `MigrarAchouView` agora é componente exportado, reusado pelo M1 de verdade E por esta rota estática. (Correção: a 1ª tentativa extraiu a tela de LOADING por engano — não era essa.)",
      },
      {
        rota: "/saida/regime-nao-suportado",
        nome: "🆕 E4.2 · Saída · Regime não suportado (só Lucro Presumido)",
        nota: "🔴 05/08 — entrada mudou: quem diz \"Lucro Presumido\" já sai por aqui direto na E3.2 (CTA menor abaixo dos cards MEI/ME), antes mesmo de chegar no M1. Lucro Presumido usa motor fiscal totalmente diferente (IRPJ/CSLL/PIS-COFINS/ISS, não Anexo/Fator R) que ainda não temos, decisão de negócio aberta (`pesquisa/parking-lot.md` item I).",
      },
      {
        rota: "/saida/cnpj-inapto",
        nome: "🆕 E4.2 · Saída · CNPJ inapto/suspenso",
        nota: "04/08 — nasce do M1 (`/migrar/cnpj?cenario=inapto`, mock de demo): situação cadastral ≠ ativa. Diferente da auditoria de passivo (M4a, que pressupõe CNPJ ATIVO com dívida): aqui a Receita nem reconhece a empresa como ativa, então a regularização vem ANTES de qualquer migração.",
      },
      {
        rota: "/migrar/diagnostico",
        nome: "E4.3 · Migrar · Diagnóstico MEI (\"tem certificado?\")",
        nota: "🔴 04/08 (3ª rodada, decisão do Pedro) — o diagnóstico de Fator R pra ME foi CORTADO: a única API pré-pagamento é a cadastral, não traz faturamento/folha (isso só existe pós-pagamento, via procuração). 🔴 05/08 — E4.2b (`/migrar/tributario`) foi DESCARTADA por duplicar a E3.2 (regime já autodeclarado antes). ME agora vai do M1 direto pro M3, sem passar aqui. 🔴 06/08 — pergunta do MEI trocou de 'você tem contador?' pra 'você já tem certificado digital?': TTRT transfere um contador REGISTRADO NO CRC-MG, e MEI (DASN-SIMEI autodeclaratório) normalmente não tem registro nenhum pra transferir. MEI nunca passa pelo M4b (TTRT) — nos 2 casos.",
      },
      {
        rota: "/migrar/plano",
        nome: "E4.4 · Migrar · A conta da migração",
        nota: "Sem taxa de governo — a empresa já existe, não há DAE da Junta nem TFLF. O choque de custo do E7 (~R$463 na 3ª tela, UX-54) simplesmente não acontece, e a tela diz isso explicitamente em vez de só omitir. Só a mensalidade no rodapé. Igual pros dois regimes (MEI/ME) — só repassa os params adiante.",
      },
      {
        rota: "/migrar/contrato",
        nome: "E4.5 · Migrar · Contrato (com a promessa de devolução)",
        nota: "🔴 A linha que sustenta a decisão de cobrar antes do TTRT: 'se a transferência não for concluída por algum motivo fora do seu controle, você recebe tudo de volta'. NÃO é copy de marketing — é a contrapartida obrigatória de cobrar por algo cujo destravamento depende de um terceiro hostil. Se essa linha sair, a decisão inteira precisa ser reaberta. Daqui segue pro pagamento (E9, esteira seguinte) — mesmo tronco do caminho abrir. 🔴 05/08: MEI NUNCA tem TTRT pra falhar (não tem responsabilidade técnica registrada pra transferir) — a cláusula vira promessa de início imediato pra todo MEI, não só quem respondeu 'não tenho certificado' no M2.",
      },
    ],
  },
  {
    id: "n4-veredito",
    nome: "E5 · Porta + veredito",
    descricao:
      "A porta do flow, numa tela só (pills, veredito, triagem, faixa). Do veredito 🟢/🟡/🔴 saem 3 desfechos — regra de ouro: nunca dar veredito com baixa confiança. O 🟢 Atende trava o CNAE direto (cards clicáveis, UX-65); 🟡 e 🔴 saem pelo template de saída graciosa (A9). Fonte única VereditoView. As saídas E5.1/E5.2 também são reusadas pelo Migrar (E4.2, esteira anterior). O `regime` (MEI×ME, decidido lá na Entrada — E3.2) atravessa esta esteira inteira e o resto do flow (🏷️ tags mostram onde MEI difere).",
    telas: [
      {
        rota: "/gate",
        nome: "E5 · Gate-CNAE",
        nota: "A porta. Pills + veredito 🟢/🟡/🔴 + triagem + faixa. ✅ 28/07: ganhou o atalho 'já sei o número do meu CNAE' (troca pra modo código, mesma engine, pula descrição+pills).",
      },
      {
        rota: "/veredito/atende",
        nome: "🟢 Atende",
        nota: "Happy path. Linguagem humana ANTES do código (UX-05). CTA 'É isso mesmo' + refazer acima sem perder texto.",
      },
      {
        rota: "/gate?etapa=triagem",
        nome: "E5 · Triagem (sócios + exterior)",
        nota: "🔎 SEPARADA 28/07 — vivia presa dentro do SPA do gate, invisível na prancheta (só dava pra ver clicando através de tudo). É o fail-fast do UX-21: sócios (máx. 2 no MLP) + exterior, perguntado logo após travar o CNAE, ANTES do dinheiro. Bloqueado → 'Falar com o time' agora navega de verdade pra /saida/exterior ou /saida/socios (era beco sem saída até 28/07).",
      },
      {
        rota: "/gate?etapa=faixa",
        nome: "E5 · Faixa de faturamento",
        nota: "🔎 SEPARADA 28/07 — mesma amarração do SPA. Última etapa do gate; segue direto pro E6 (o resumo intermediário foi removido). Faixa guiada por padrão + 'sei o valor exato' pra quem já sabe o número (UX-51).",
      },
      {
        rota: "/veredito/waitlist",
        nome: "E5.1 · 🟡 Waitlist (regulada)",
        nota: "Não é 'não', é 'ainda não'. UX-22: dar o enquanto isso. Captura contato, não fecha a porta. Template A9. ✅ 28/07: ganhou campo CNAE pretendido (read-only, junto do nome+contato).",
      },
      {
        rota: "/veredito/nao-atende",
        nome: "E5.2 · 🔴 Contato especial (Mauro)",
        nota: "✅ 28/07: RELABEL — era 'Comercial'. É quem NÃO atendemos mas a Legalize Digital (escritório do Mauro) atende do jeito tradicional. Mesmo template A9. Coral nunca é erro: token de estado.",
      },
      {
        rota: "/veredito/descartado",
        nome: "E5.3 · 🔴 Fora de escopo (descarta)",
        nota: "✅ 28/07 (reunião Rua Satélite 9) — 3ª via do veredito 🔴, antes inexistente. Ninguém atende (nem a gente, nem regulamentado, nem o Mauro) — decisão explícita de descartar. SEM formulário de captura: não tem pra onde rotear, é decline limpo dentro do VereditoView (`motivo: 'descarta'`).",
      },
    ],
  },
  {
    id: "saidas-triagem",
    nome: "Antes do dinheiro · saídas da triagem (E5.4–E5.5)",
    descricao:
      "A triagem do E5 (sócios? exterior?) barra ANTES do dinheiro (UX-21) — quem cai aqui nunca chega a ver preço. Mesmo template de saída graciosa do veredito: educa, não pune, nenhuma saída termina em beco.",
    telas: [
      {
        rota: "/saida/exterior",
        nome: "E5.4 · Sócio no exterior",
        nota: 'UX-07: "a empresa existe, mas fora do Simples". A LC 123 art. 17 barra a opção pelo Simples, não a abertura — confundir as duas daria uma notícia muito pior que a verdadeira. Rota humana. 🟡 sem cotar Lucro Presumido (UX-42 depende do Mauro). 🟡 28/07: Pedro cogitou descartar esta saída dedicada — "estou pensando", NÃO travado. Conteúdo jurídico revisado, não apagar sem confirmação final.',
      },
      {
        rota: "/saida/socios",
        nome: "E5.5 · 3 ou mais sócios",
        nota: '🟡 28/07: UX-09: "limite do PRODUTO, não da lei". Pedro cogitou juntar esta saída com a Waitlist (regulamentados) — "estou pensando", NÃO travado.',
      },
    ],
  },
  {
    id: "dinheiro",
    nome: "💰 E6–E9 · O dinheiro",
    descricao:
      "A travessia da fronteira, da faixa (E5) ao pagamento. E6–E9 são a sequência clássica — conta, proposta, contrato, pagamento — e é onde a ORDEM carrega o argumento (E6 = A1 pergunta · E7 = A5 recap · E8 = A6 aceite · E9 = A1). A casa (shell do app) só nasce depois do E9; até aqui é tudo wizard. É também onde o Migrar (esteira 1) reencontra o tronco — mesma tela E9, aviso muda por `?fluxo=migrar`. 🆕 03/08: E7/E8/E9 também variam por `?regime=mei` — sem taxa da Junta (🏷️ tags em cada tela).",
    telas: [
      {
        rota: "/conta",
        nome: "E6 · Criar conta",
        nota: "Sai com credencial funcionando. Coorte é dado puro e pulável, nunca bifurca trilha (UX-48). 🔴 O aviso do GOV.BR foi REMOVIDO em 19/07 (jargão + sem ação + contradizia \"a parte chata é com a gente\"); a UX-29 migra pro painel A3 como tarefa acionável. ✅ 28/07: FRONT-LOAD — nome/CPF/telefone/endereço (autofill CEP) migraram pra cá do C1, + etapa de código de verificação (mock).",
      },
      {
        rota: "/plano",
        nome: "E7 · A conta da abertura · 🏷️ AMBOS (MEI: sem taxa)",
        nota: 'Fecha a conta na cara do cliente antes de pedir dinheiro (UX-33). ✂️ Enxugada 19/07: hoje × todo mês SUBIU pro topo (é a resposta), os 3 baldes desceram pra justificativa. Cortados recap, aviso do "grátis" e expander redundante: 8 blocos → 5. 03/08: MEI não paga taxa da Junta — card "Colaboradores" (R$39/cabeça, referência real Contabilizei) visível pros dois.',
      },
      {
        rota: "/contrato",
        nome: "E8 · Aceite do contrato · 🏷️ AMBOS (MEI: copy sem taxa)",
        nota: "Metade do T18: só o contrato de serviço. REVERSÍVEL, CDC art.49 limpo, então a copy não assusta. O termo irreversível desceu pro A2. Cancelamento aberto na tela: conteúdo legal nunca vai pra expander. 03/08: MEI vê 'só a 1ª mensalidade' em vez de 'taxa da Junta + mensalidade'.",
      },
      {
        rota: "/pagamento",
        nome: "E9 · Pagamento · 🏷️ AMBOS (MEI: sem taxa)",
        nota: 'Mesmo CPF, dois usos: cobrança + elegibilidade. Situação irregular NÃO é cobrada (persona `cpf-irregular`) e não é "cartão recusado". Boleto fica, fora do happy path: entra no app e adianta tudo. 03/08: total não soma a taxa da Junta quando MEI.',
      },
      {
        rota: "/pagamento?fluxo=migrar",
        nome: "E9 · Pagamento (variante Migrar)",
        nota: "Mesma tela com `?fluxo=migrar`: o total não soma taxa de governo e o aviso fala de MIGRAÇÃO ('sua migração começa hoje' / 'a gente já aciona seu contador anterior'). CPF, métodos e a faixa de idempotência são idênticos — não valia uma tela nova.",
      },
    ],
  },
  {
    id: "migrar-pos-pagamento",
    nome: "Migrar · pós-pagamento (E9.2–E9.4)",
    descricao:
      "Continuação decimal de E9, só de quem veio do caminho migrar. Depois de pagar, o passivo herdado + a transferência no conselho (CRC-MG) — a pausa mais perigosa do produto, porque quem libera é o contador ANTIGO, um concorrente perdendo o cliente. Termina em E9.4, que entrega direto pra A5 (Home dia-1), pulando Constituição e Aprovação inteiras — a empresa já existia, não há dossiê pra montar nem Junta pra aprovar.",
    telas: [
      {
        rota: "/migrar/passivo",
        nome: "E9.2 · 🔥 Auditoria de passivo",
        nota: "O risco EXCLUSIVO do caminho migrar: a empresa chega com passado. O consolidado fiscal diz que as obrigações do período antigo ficam com o contador anterior — mas o cliente não sabe disso, e a DÍVIDA é da empresa. Assumir sem auditar = herdar problema que a gente não criou e virar o culpado. Persona `migra-passivo`. 🕓 Se isso vira upsell é decisão do Mauro.",
      },
      {
        rota: "/migrar/passivo?cenario=limpo",
        nome: "E9.2 · Migração limpa",
        nota: "Persona `migra-limpo`: nada pendente. A tela existe mesmo sem problema porque a auditoria é a promessa ('você tem o direito de saber o que está assumindo antes da gente encostar nela'), não o alarme.",
      },
      {
        rota: "/migrar/transferencia",
        nome: "E9.3 · A transferência (pipeline)",
        nota: "Reusa o PainelView do A3 (parametrizado 30/07) — mesma máquina de estados, outro pipeline: encerrar com o antigo → transferir no conselho (CRC-MG) → atualizar no Redesim (Receita+Estado) → trocar responsável na Prefeitura (CadWeb PBH) → liberar acesso. Os códigos oficiais (resolução CFC, Evento 232) ficam FORA da tela: são 🟡 pendência, não ratificados em fonte primária. 🆕 04/08: pipeline virou 5 etapas (era 4) — cruzamento com `Fluxo Migração GEMINI.md` tratou a troca municipal (PBH) como ação separada da atualização federal/estadual; 🟡 se confirmar que é o mesmo mecanismo, volta pra 4.",
      },
      {
        rota: "/migrar/transferencia?estado=travado",
        nome: "E9.3 · 🔴 TTRT travado (migra-refem)",
        nota: "A pausa mais perigosa do produto inteiro. O TTRT é aberto por nós no CRC-MG e validado pelo contador ANTIGO — um concorrente que está perdendo o cliente. Todas as pausas do caminho abrir esperam órgão neutro ou o próprio cliente; esta espera alguém com interesse contrário. A tela ASSUME o problema ('a gente assumiu esse problema') em vez de repassar culpa ou deixar no limbo.",
      },
      {
        rota: "/migrar/ativa",
        nome: "E9.4 · ✅ Empresa migrada",
        nota: "Fecha o loop do E4.3: a economia prometida com número REAL vira a 1ª tarefa concreta, com valor na cara ('ajustar seu pró-labore e economizar R$X/mês'). Diferença central vs. o caminho abrir: lá a promessa é estimativa que só resolve meses depois; aqui o número era real desde a 2ª tela. Segue direto pra A5 (Home dia-1, esteira Aprovação). 🆕 04/08: `?regime=mei` troca isso por vigilância do limite de faturamento (R$81 mil/ano) — MEI não tem Fator R.",
      },
    ],
  },
  {
    id: "pausas",
    nome: "⏸ Pausas · C0.1 / E9.1",
    descricao:
      "Loading que EXPLICA o que está acontecendo, não spinner mudo. Espera com tarefa não é espera, é andamento — por isso as duas abrem com o que DÁ pra fazer, nunca com o que está parado. E9.1 nasce do boleto (branch de E9); C0.1 reentra no fluxo pelo C1 — por isso moram entre o dinheiro e o dossiê. (A espera de órgão da Aprovação não mora aqui: virou a timeline do painel A3.)",
    telas: [
      {
        rota: "/aguardando",
        nome: "E9.1 · Aguardando o boleto",
        nota: 'Existe porque o boleto ficou (decisão do Pedro). Abre com o dossiê liberado, não com bloqueio: "sem sensação de travou" é regra da spec T19. Dunning com o gancho da economia (UX-45), não lembrete seco. Persona `knife`.',
      },
      {
        rota: "/retomar",
        nome: "C0.1 · Retomar de onde parou",
        nota: "Retomar ≠ restaurar (UX-46): a `cida` volta sem contexto, então responde já fiz / falta / e agora — com UM passo só, porque a lista inteira recria a paralisia. UX-23: revalida a estimativa, que envelhece na virada do ano.",
      },
    ],
  },
  {
    id: "dossie",
    nome: "C1–C7 · Constituição (o dossiê)",
    descricao:
      "A coleta do dossiê, logada e paga. C1 é a mais longa (testa o corpo rolável); dali em diante cada tela herda o que já foi dito antes — CNAE principal já travado no E5, limite de sócios já filtrado na triagem. 🆕 03/08: MEI e ME divergem AQUI — MEI pula C2/C3 (direto C1→C4) e C6 (C5→C7), ME segue a sequência cheia. C4 e C7 são pontos de reencontro (🏷️ tags marcam cada tela).",
    telas: [
      {
        rota: "/dossie/socio",
        nome: "C1 · Seus dados (confirmação)",
        nota: "✅ 28/07: RECONSTRUÍDA — não coleta mais do zero. Card read-only confirma nome/CPF/telefone/endereço já vindos do E6; só pede o que faltou (RG, órgão emissor, estado civil). Casado revela regime; comunhão universal avisa o cônjuge cedo (UX-30).",
      },
      {
        rota: "/dossie/vinculo",
        nome: "C2 · Vínculo INSS · 🏷️ SÓ ME (MEI pula)",
        nota: "Coleta o CLT que alimenta a sugestão de enquadramento (UX-24, hoje um card no A1 — o simulador dedicado foi dissolvido 28/07). Teto é FOLGA, não binário. Pró-labore reenquadrado como ganho (UX-27). 03/08: Fator R não existe pra MEI (DAS já é fixo) — MEI pula direto de C1 pra C4.",
      },
      {
        rota: "/dossie/socios",
        nome: "C3 · +Sócios · 🏷️ SÓ ME (MEI pula)",
        nota: "Limite 2 (trava, não 1ª notícia — E5 já filtrou). Divisão soma 100%, default 50/50. 03/08: MEI não pode ter sócio (fato legal) — pulada junto com C2.",
      },
      {
        rota: "/dossie/empresa",
        nome: "C4 · Dados da empresa · 🏷️ AMBOS — reencontro (MEI: sem capital social)",
        nota: "Upsell endereço fiscal (oferece, não obriga; preço FAKE ~R$60). ✅ 28/07: IPTU virou OBRIGATÓRIO travado (JUCEMG exige, era opcional). Residência de sócio dinâmica pelo E5 (pula se solo). Alerta capital baixo. 03/08: os 2 caminhos se reencontram aqui (MEI vem direto de C1, ME vem de C3); capital social some pro MEI (não é sociedade formal). 🆕 04/08: campo do IPTU ganhou validação de dígito mínimo (10) — antes aceitava qualquer string não-vazia; 🟡 formato exato (10-12 dígitos) segue fila-Larissa.",
      },
      {
        rota: "/dossie/cnae-secundarios",
        nome: "C5 · CNAE secundários",
        nota: "Principal herdado do E5, travado. Sugestões com prova social. Comércio entra com aviso, nunca some silencioso.",
      },
      {
        rota: "/dossie/natureza",
        nome: "C6 · Natureza jurídica · 🏷️ SÓ ME (MEI pula)",
        nota: "Recomenda (solo→SLU), não trava. LTDA solo permitido (fato do CNPJ do Pedro). SLU+sócio = incoerência barrada. 03/08: natureza do MEI é sempre fixa (Empresário Individual - MEI), sem escolha — pula direto de C5 pra C7.",
      },
      {
        rota: "/dossie/nome",
        nome: "C7 · Razão social · 🏷️ AMBOS — reencontro final",
        nota: "IA sugere a razão. Checagem de viabilidade: nome em uso → variações (evita reprova JUCEMG). 03/08: reencontro dos 2 caminhos (MEI vem de C5, ME vem de C6) antes de seguir pra Aprovação.",
      },
    ],
  },
  {
    id: "b4",
    nome: "A1–A5 · Aprovação",
    descricao:
      "Depois do pagamento e do dossiê, a reta final: revisar, autorizar o irreversível, acompanhar a máquina rodando e chegar na home de ativação. O gargalo aqui é a JUCEMG, não o cliente, então o padrão muda de 'pergunta' pra 'andamento visível' (A8). A recusa de órgão é o 4º estado do painel, não uma tela à parte. A5 é o handoff pro Portal (próxima esteira) — e também onde o Migrar (E9.4) aterrissa direto, sem passar pelas A1–A4. 🆕 03/08: as 4 telas EXISTEM pros dois (MEI×ME), mas a copy/timeline varia — A3.1 (recusa) só existe pra ME.",
    telas: [
      {
        rota: "/revisar",
        nome: "A1 · Revisar · 🏷️ AMBOS (MEI: sem capital/taxa)",
        nota: "Recap read-only de tudo antes do irreversível. Cada bloco tem 'ajustar' que volta pro passo. Último ponto em que corrigir é de graça. Números com carimbo de estimativa; a taxa da Junta (R$ 268,51) é a única quantia dura. 03/08: MEI não vê capital social nem taxa da Junta; enquadramento vira 'DAS fixo' em vez de 'Simples Anexo X'.",
      },
      {
        rota: "/termo",
        nome: "A2 · Termo irreversível · 🏷️ AMBOS (MEI: sem cláusula de taxa)",
        nota: "A outra metade do T18 racha: aqui é o commit. 'A taxa do governo não volta' em 1 linha, sem letra miúda. As 4 camadas do cancelamento abertas na tela (conteúdo legal nunca vai pra expander). Botão único, trava até o aceite. 03/08: MEI perde a camada 'taxa não reembolsável' (não pagou taxa) e o texto de protocolo cita Portal do Empreendedor, não Junta.",
      },
      {
        rota: "/painel",
        nome: "A3 · Painel (andamento) · 🏷️ AMBOS — timeline bem diferente",
        nota: "O coração da Aprovação. Timeline de 3 status com 4 estados (feito/girando/a fazer/recusa). Faixa de idempotência (UX-38: 'não cobramos de novo'). Previsão honesta. Zero jargão na frente, órgão como recibo. 03/08: reusa a MESMA parametrização que o Migrar já usa (`etapas`/`titulo`/`sub`/`prazo`) — MEI vira 1 passo só ('Registrando no Portal do Empreendedor'), sem Junta, prazo qualitativo 'minutos, não dias'.",
      },
      {
        rota: "/painel/recusa",
        nome: "A3.1 · Órgão recusa · 🏷️ SÓ ME (não existe pro MEI)",
        nota: "O 4º estado (UX-40): a Junta reprovou o nome apesar da prévia (persona `erro-orgao` do motor). Vermelho + 'precisa de você' + a ação, recuperação DENTRO do pipeline. Aqui o danger é legítimo: um órgão externo parou a fila mesmo. ✅ 28/07: RETRY AUTOMÁTICO — tenta as 3 opções do C7 em sequência (~1.4s cada), sem ação do cliente; só pede 3 novas sugestões se as 3 falharem. Mock sempre esgota as 3, pra provar o pior caso. 03/08: MEI não passa pela Junta, então esse tipo de disputa de nome não existe do mesmo jeito — não implementado pro MEI.",
      },
      {
        rota: "/assinatura",
        nome: "A4 · Assinatura dos sócios · 🏷️ AMBOS (MEI: copy sem Junta)",
        nota: "GOV.BR + e-CAC. Dobra o check de nível (bronze→upgrade inline). Consenso multi-sócio (UX-44): o 2º sócio aprova custo e assina, o dono nunca clica por ele. Procuração e-CAC explicada em 1 linha (UX-31). Mock na sociedade de 2. 03/08: consenso multi-sócio já não aparece pro MEI de qualquer forma (é sempre solo); só a copy do subtítulo/aviso troca 'Junta' por 'Portal do Empreendedor'.",
      },
      {
        rota: "/home-dia1",
        nome: "✅ A5 · Home dia-1 (ativação)",
        nota: "O handoff pro Portal. Empresa recém-nascida: faturamento 0, Fator R projetado → o diferencial ainda não tem o que vigiar. Vira TRILHA DE ATIVAÇÃO: hero celebra o nascimento (confetti da marca) + CNPJ pill → checklist com progresso (o certificado é o passo 'agora', gate universal, validado por videochamada da parceira) → 'sem pressa com imposto' → Aprenda + Quem cuida. SEM navbar até liberar acesso. 🔓 SWAP validado 30/07: substitui a antiga 'empresa ativa' — sem confete/selo no hero.",
      },
    ],
  },
  {
    id: "portal",
    nome: "Portal (P) · dia-2, grafo de navegação",
    descricao:
      "A parte interna, pós-ativação — o que A5 entrega. NÃO é flow linear (é grafo: 4 abas + CTA central + drill-downs), então o código é POR ABA, não sequência única (ver `portal/portal-data.mjs`). Ordem da esteira: Início → Impostos → Notas → Emitir (CTA central) → Mais (hub + drill-downs) → transversais (Avisos/Pró-labore/Blog, alcançáveis de vários lugares). Barra flutuante de 4 abas + CTA nas telas-raiz — toque dentro do iframe pra navegar de verdade.",
    telas: [
      {
        rota: "/inicio",
        nome: "P-INI1 · Início · Home (regime)",
        nota: "Home Campeã: saudação+CNPJ-pill, próximo compromisso, atalhos, notas recentes, aprenda, quem cuida, vigília preditiva. Número-guru fora. 🆕 04/08: `?regime=mei` reduz \"Seu negócio\" de 4 pra 2 números (faturamento + limite anual) e troca os atalhos (emitir + colaborador, sem pró-labore/impostos completos) — Plano MEI não tem Fator R/Anexo pra vigiar.",
      },
      {
        rota: "/impostos",
        nome: "P-IMP1 · Impostos · dashboard",
        nota: "Carrossel do mês (DAS+INSS) · vigília fiscal · guias anteriores clicáveis (status automático) · calendário. NÃO intermediamos pagamento.",
      },
      {
        rota: "/impostos/guias",
        nome: "P-IMP2 · Guias anteriores",
        nota: "Mesma estrutura da lista de notas (busca+filtro+mês); status automático por param.",
      },
      {
        rota: "/impostos/aliquotas",
        nome: "P-IMP3 · Alíquota efetiva",
        nota: "Alíquota efetiva + Fator R numa barra contra o corte dos 28% + 'número vivo' (tese North Star) + memória de cálculo. Fiscal → Larissa.",
      },
      {
        rota: "/impostos/pagar",
        nome: "P-IMP4 · Ver / baixar guia",
        nota: "'Pagar' virou VER/BAIXAR: documento + copiar código de barras + enviar. NÃO intermediamos pagamento; status-aware por param.",
      },
      {
        rota: "/obrigacoes",
        nome: "P-IMP5 · Calendário de obrigações",
        nota: "Exploração mantida a pedido do Pedro (calendário).",
      },
      {
        rota: "/notas",
        nome: "P-NOT1 · Notas · lista",
        nota: "Ledger: busca + filtro por status (escopado ao mês) + seletor de mês + exportar + alerta de recusadas + vazio. Card único (home↔P-NOT1).",
      },
      {
        rota: "/notas/detalhe",
        nome: "P-NOT2 · Nota · visualizador",
        nota: "Status-aware (emitida/emitindo/recusada/cancelada) + documento em tela cheia + enviar por canal + corrigir-e-reemitir.",
      },
      {
        rota: "/emitir",
        nome: "P-EMI1 · Emitir NF-e",
        nota: "Favorecido (bolhas por frequência, Consumidor final, Novo cliente) + valor (prévia viva do imposto) + serviço travado. Autofill por CNPJ (API pública); emissão NFS-e = RPA (não coberto). B2C = 'Consumidor final'.",
      },
      {
        rota: "/mais",
        nome: "P-MAIS1 · Mais · hub",
        nota: "Ordem por praticidade: Você→Perfil · plano · serviços à-la-carte · seções (Empresa/Contabilidade) · WhatsApp · Conta. 🆕 04/08: `?regime=mei` troca o `PlanoCard` (Plano MEI, R$49,90, fidelidade 12m, certificado incluso) e o item \"Sócios\" vira \"Meu colaborador\" — MEI nunca tem sócio. Avulsos NÃO somem (decisão do Pedro: MEI também é assinante, também vê a oferta depois da mensalidade).",
      },
      {
        rota: "/perfil",
        nome: "P-MAIS2 · Perfil (a Conta)",
        nota: "Só a Conta (currículo/empresa migrou pro Mais) + lápis no avatar (trocar foto/logo).",
      },
      {
        rota: "/mais/plano",
        nome: "P-MAIS3 · Gerenciar plano",
        nota: "Preço FAKE (Mauro/custo). Próxima fatura com avulsos ADICIONADOS (modelo Contabilizei) · trocar pagamento (Pix) · cancelar (4 camadas, CDC art.49).",
      },
      {
        rota: "/mais/servicos",
        nome: "P-MAIS4 · Loja de avulsos",
        nota: "Camada à-la-carte (CND, declaração, alteração, reemissão). Preço+catálogo → Mauro. Avulso EFETIVO não-removível + double-check.",
      },
      {
        rota: "/mais/empresa",
        nome: "P-MAIS5 · Sua empresa · ficha",
        nota: "Ficha em blocos + copiar por dobra + copiar TUDO (formato WhatsApp) + CNPJ solto. Regra: página, não acordeon; honestidade antes do toque.",
      },
      {
        rota: "/mais/socios",
        nome: "P-MAIS6 · Sócios",
        nota: "Lista de sócios da empresa e % de participação, herdados do dossiê (C3). Não existe pro Plano MEI (some do hub, vira Meu colaborador).",
      },
      {
        rota: "/mais/colaborador",
        nome: "🆕 P-MAIS6b · Meu colaborador (Plano MEI)",
        nota: "04/08 — a lei permite ao MEI 1 funcionário com carteira. Substitui Sócios no hub `/mais` quando `?regime=mei`. Cadastro não é self-serve de verdade (mexe com eSocial/FGTS/INSS patronal): o formulário aqui é a COLETA, o processamento é da gente, já incluso no plano (não é avulso). `?cenario=cadastrado` mostra o estado com colaborador ativo.",
      },
      {
        rota: "/mais/documentos",
        nome: "P-MAIS7 · Documentos",
        nota: "Documentos da constituição disponíveis pra download (contrato social, cartão CNPJ). 🆕 04/08: ganhou Alvará (dispensa de licenciamento) + Termo de Opção pelo Simples — faltavam na Pasta Digital vs. cruzamento com Gemini. `?fluxo=migrar` mostra também o Relatório de Oportunidade Fiscal (a prova da economia do E4.3), seção própria acima dos grupos.",
      },
      {
        rota: "/mais/certificado",
        nome: "P-MAIS8 · Certificado (ativo)",
        nota: "Estado ativo do certificado; emissão/renovação = certificadora parceira (transfer = upload).",
      },
      {
        rota: "/mais/em-dia",
        nome: "P-MAIS9 · Você está em dia",
        nota: "Painel de conformidade: hero escuro + streak + órgãos + cumprido-no-mês.",
      },
      {
        rota: "/mais/relatorios",
        nome: "P-MAIS10 · Relatórios",
        nota: "Anti-jargão: gráfico de faturamento + 'depois do imposto', honesto. Fiscal → Larissa.",
      },
      {
        rota: "/mais/declaracoes",
        nome: "P-MAIS11 · Declarações",
        nota: "PGDAS-D mensal · DEFIS anual, 'você não preenche nada'. Fiscal → Larissa.",
      },
      {
        rota: "/avisos",
        nome: "P-GER1 · Avisos (central)",
        nota: "Central de notificações (tipos com cor de estado, não-lido, marcar-lidas); sino no header da home + Mais>Conta.",
      },
      {
        rota: "/pro-labore",
        nome: "P-GER2 · Pró-labore",
        nota: "Reusa a engine `lib/fiscal` (mesma da Constituição): estado atual + interativo (imposto + INSS ao vivo), mira 30%, aviso de borda. Fiscal → Larissa.",
      },
      {
        rota: "/blog",
        nome: "P-GER3 · Blog · home",
        nota: "Busca + chips de categoria + carrossel-herói + lista (ref. TripGlide). 'Aprenda com a gente' liga aqui.",
      },
      {
        rota: "/blog/post",
        nome: "P-GER4 · Blog · post",
        nota: "Leitura: imagem full-bleed sob o notch + folha arredondada + curtir + compartilhar + sugeridos.",
      },
    ],
  },
  {
    id: "fora",
    nome: "Fora do flow de abertura",
    descricao:
      "Telas SEM código E/C/A/P, e a ausência é a informação: a numeração cobre quem está abrindo/migrando/aprovando empresa. Estas ficam do lado de fora.",
    telas: [
      {
        rota: "/login",
        nome: "Login",
        nota: "A saída terminal A1: diverge no E3 (\"já sou cliente\"), sai da abertura e não reconverge. Não usa o template A9 — aquele é pra recusa, e isto é rota feliz de quem volta pra casa. Layout de 2 painéis, único no produto.",
        statusClaro: true,
      },
    ],
  },
];
