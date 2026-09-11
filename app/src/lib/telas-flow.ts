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
    nome: "E1–E3.4 · Entrada (com Migrar fundido no fork)",
    descricao:
      "As primeiras telas, antes de qualquer pergunta de negócio — e o ponto onde o flow bifurca em 2 caminhos (ADR 03/08: Migrar não é 'flow #2', é decimal DENTRO da Entrada). 🔄 27/08 (REORDENAÇÃO): a ordem virou E3 (fork) → E3.3 (dados pessoais, NOVA) → E3.2 (MEI×ME) → E3.4 (endereço + categoria, NOVA). O E4 (gate de cidade) foi REMOVIDO: perguntava 'é em BH?' e acreditava no clique, sendo a única checagem de cidade do produto — quem valida agora é o CEP, no E3.4. Motivo da captura de lead cedo: antes disso o funil inteiro era anônimo até o E6, e o líder (Contabilizei) pede nome/e-mail/telefone na 1ª tela. ⚠️ A numeração decimal deste bloco NÃO é cronológica (E3.1 é a saída de login, E3.3 vem antes do E3.2): renumerar quebraria referência histórica em docs e memórias.",
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
        nome: "E3 · Fork 4 rotas",
        nota: 'A palavra "migrar" NÃO aparece (UX-55): é jargão e "trocar de contador" excluiria quem não tem contador, que é o melhor cliente do caminho migrar. Pergunta pelo fato, nunca pela operação. Login é link, não botão. ✅ 28/07: 3 rotas CONFIRMADAS na reunião (abrir/migrar/já-cliente).',
      },
      {
        rota: "/entrada?intencao=abrir",
        nome: "E3.2 · MEI × ME (variante Abrir)",
        nota: "03/08 — REALOCADA (morava no fim do E5). Recomendação, não trava. 🔄 27/08: agora vem DEPOIS do E3.3 (dados pessoais) e antes do E3.4 (endereço + categoria). 🔴 27/08: o card 'ME · Lucro Presumido' foi REMOVIDO — decisão do Pedro, 'não vale o desgaste da dúvida agora' (volume mínimo no ICP). Consequência assumida e parqueada: quem É Lucro Presumido não tem mais porta no caminho ABRIR (no Migrar continua sendo reconhecido pelo M1, que confirma na Receita). MEI e ME agora passam os dois pelo E3.4 — o gate de BH não vale pro MEI, mas o de CATEGORIA vale pros dois. 🔴 Ainda não corrige se a pessoa disser MEI aqui e depois a triagem revelar 2+ sócios (gap conhecido).",
      },
      {
        rota: "/entrada?intencao=migrar",
        nome: "E3.2 · MEI × ME (variante Migrar)",
        nota: "04/08 — mesma tela (`MeiOuMeView`), `contexto=\"migrar\"`: copy vira AUTODECLARAÇÃO (\"Sua empresa hoje é MEI ou ME?\", não \"qual devo escolher\" — o CNPJ já existe, não há escolha). Decisão do Pedro: inverter a ordem que existia (perguntava cidade ANTES de saber o regime). Escolher MEI pula a cidade e vai DIRETO pro M1 (`/migrar/cnpj?cenario=mei`). Escolher ME cai no gate de cidade de sempre. Autodeclarado, não trava nada — quem confirma de verdade é o M1, puxando da Receita.",
      },
      {
        rota: "/dados",
        nome: "E3.3 · Seus dados (nome · e-mail · telefone)",
        // 🆕 01/09 — ganhou hero coral com o Léo espiando: relógio preto ficava
        // ilegível em cima dele.
        statusClaro: true,
        nota: "27/08 — tela NOVA, primeira coisa depois do fork. Nome, e-mail e telefone, igual à 1ª tela do funil da Contabilizei. NÃO cria conta (isso segue no E6): só identifica quem está do outro lado. Motivo (Pedro): 'se a gente não capta isso rápido, não sabe nem quem é dono dos próximos cliques' — antes, quem desistia antes do E6 era anônimo. LGPD: consentimento mínimo em 1 linha com link, sem checkbox; o aceite contratual continua no E8. Vale pros 2 caminhos (abrir e migrar), só muda a copy.",
      },
      {
        rota: "/endereco",
        nome: "E3.4 · Endereço + categoria (os 2 gates)",
        nota: "27/08 — tela NOVA, e a peça central da reordenação. (1) ENDEREÇO: substitui o E4 (gate de cidade, REMOVIDO), que perguntava e acreditava no clique — aqui o CEP valida de verdade (faixa 30000-000 a 31999-999). Quem não tem endereço em BH recebe o endereço fiscal da Legalizai como SOLUÇÃO, não porta na cara: o município segue a sede, não o domicílio do dono, e a nossa sede fica em BH. Herdou a escolha 'próprio × fiscal' que morava no E5F. (2) CATEGORIA: assume o papel de gate de elegibilidade que era do veredito de CNAE — como a lista só oferece atividade atendida, escolher já É passar pelo filtro. É isso que autorizou o CNAE a ir pra depois do pagamento (C0). Quem não se acha na lista sai pela waitlist, antes de qualquer cobrança.",
      },
      {
        rota: "/saida/fora-bh",
        nome: "E4.1 · Saída · fora de BH · 🏷️ SÓ ME + MIGRAR",
        nota: "✅ 28/07 — mesmo template A9 das outras saídas (barra+explica+captura+roteia). 🔄 27/08: a entrada mudou. Nascia do E4 (gate de cidade), que foi removido; agora é alcançada do E3.4 e SÓ por quem recusa também o endereço fiscal (que resolveria o caso mantendo a sede em BH). O volume aqui deve cair bastante. MEI nunca cai aqui.",
      },
      {
        rota: "/migrar/cnpj",
        nome: "E4.2 · Lê o cartão CNPJ",
        nota: "Consulta e veredito na MESMA tela, de propósito: no caminho abrir o veredito é tela própria porque depende da IA interpretar texto livre (pode errar); aqui o CNAE é fato registrado. Digite qualquer CNPJ de 14 dígitos → loading que explica → cartão + as 4 checagens + veredito. 🆕 04/08 (2ª rodada): **MEI agora PASSA** (checagem de regime ok) — só Lucro Presumido segue bloqueado. `?cenario=mei|presumido|inapto` demonstra os 3 cenários. 🆕 04/08 (3ª rodada): quem chega aqui vindo de MEI na E3.2 já pula direto com `?cenario=mei` — ME continua chegando 'limpo' (padrão) depois do gate de cidade.",
      },
      {
        rota: "/migrar/cnpj?fase=achou",
        nome: "🆕 E4.2 · Achamos sua empresa",
        nota: "04/08 (pedido do Pedro) — extraída de dentro do M1 pra virar tela própria, catalogável ao lado dele: o card com os dados da Receita + as 4 checagens + veredito. `MigrarAchouView` agora é componente exportado, reusado pelo M1 de verdade E por esta rota estática. (Correção: a 1ª tentativa extraiu a tela de LOADING por engano — não era essa.)",
      },
      {
        rota: "/saida/regime-nao-suportado",
        nome: "Saída · Presumido fora de escopo",
        nota: "🔴 05/08 — entrada mudou: quem diz \"Lucro Presumido\" já sai por aqui direto na E3.2 (CTA menor abaixo dos cards MEI/ME), antes mesmo de chegar no M1. Lucro Presumido usa motor fiscal totalmente diferente (IRPJ/CSLL/PIS-COFINS/ISS, não Anexo/Fator R) que ainda não temos, decisão de negócio aberta (`pesquisa/parking-lot.md` item I).",
      },
      {
        rota: "/saida/cnpj-inapto",
        nome: "Saída · CNPJ inapto ou suspenso",
        nota: "04/08 — nasce do M1 (`/migrar/cnpj?cenario=inapto`, mock de demo): situação cadastral ≠ ativa — a Receita nem reconhece a empresa como ativa, então a regularização vem ANTES de qualquer migração. 🔴 06/08: diferente do que era 'auditoria de passivo' (M4a, empresa ATIVA com dívida) — essa tela foi retirada do flow.",
      },
      {
        rota: "/migrar/diagnostico",
        nome: "E4.3 · Diagnóstico ('tem certificado?')",
        nota: "🔴 04/08 (3ª rodada, decisão do Pedro) — o diagnóstico de Fator R pra ME foi CORTADO: a única API pré-pagamento é a cadastral, não traz faturamento/folha (isso só existe pós-pagamento, via procuração). 🔴 05/08 — E4.2b (`/migrar/tributario`) foi DESCARTADA por duplicar a E3.2 (regime já autodeclarado antes). 🔴 06/08 — pergunta do MEI trocou de 'você tem contador?' pra 'você já tem certificado digital?': TTRT transfere um contador REGISTRADO NO CRC-MG, e MEI (DASN-SIMEI autodeclaratório) normalmente não tem registro nenhum pra transferir — MEI nunca passa pelo M4b (TTRT), nos 2 casos. 🔴 06/08 (achado do Pedro) — ME TAMBÉM passa por aqui agora (antes ia do M1 direto pro M3): certificado é independente da TTRT pra ME, e não tinha pergunta nenhuma nesse caminho. 🟡 fila-Mauro: custo/fidelidade de emitir certificado pro ME (se não tiver) é decisão de preço não tomada.",
      },
      {
        rota: "/migrar/plano",
        nome: "E4.4 · Plano",
        nota: "Sem taxa de governo — a empresa já existe, não há DAE da Junta nem TFLF. O choque de custo do E7 (~R$463 na 3ª tela, UX-54) simplesmente não acontece, e a tela diz isso explicitamente em vez de só omitir. Só a mensalidade no rodapé. Igual pros dois regimes (MEI/ME) — só repassa os params adiante.",
      },
      {
        rota: "/migrar/contrato",
        nome: "E4.5 · Contrato + promessa de devolução",
        nota: "🔴 A linha que sustenta a decisão de cobrar antes do TTRT: 'se a transferência não for concluída por algum motivo fora do seu controle, você recebe tudo de volta'. NÃO é copy de marketing — é a contrapartida obrigatória de cobrar por algo cujo destravamento depende de um terceiro hostil. Se essa linha sair, a decisão inteira precisa ser reaberta. Daqui segue pro pagamento (E9, esteira seguinte) — mesmo tronco do caminho abrir. 🔴 05/08: MEI NUNCA tem TTRT pra falhar (não tem responsabilidade técnica registrada pra transferir) — a cláusula vira promessa de início imediato pra todo MEI, não só quem respondeu 'não tenho certificado' no M2.",
      },
    ],
  },
  {
    id: "n4-veredito",
    nome: "E5 · Triagem + faixa (e a C0, que atravessou o pagamento)",
    descricao:
      "🔄 27/08 (REORDENAÇÃO) — este bloco RACHOU no pagamento. O CNAE (descrever → veredito) virou a **C0** (`/dossie/atividade`), DEPOIS do dinheiro; triagem e faixa ficaram ANTES. Por que o CNAE pôde atravessar: o gate de elegibilidade mudou de lugar, não sumiu — era o veredito (que podia dizer 🔴), agora é a CATEGORIA do E3.4, que só oferece atividade atendida. Quem chega na C0 já passou pelo filtro, então lá o veredito não pode mais dizer não. Por que triagem e faixa NÃO foram junto: elas bloqueiam por motivos que a categoria não cobre (sócio via CNPJ e sócio no exterior tiram do Simples; 5+ sócios é limite do produto) — movê-las criaria reembolso pra um caso que hoje não existe. As saídas E5.1/E5.2 seguem reusadas pelo Migrar.",
    telas: [
      {
        rota: "/dossie/atividade",
        nome: "C0 · Sua atividade (descreve + pills)",
        nota: "27/08 — era o E5A (`/gate`, antes do dinheiro) e virou a primeira tela do dossiê. Copy reenquadrada: não promete mais 'validar minha atividade' (a validação já aconteceu no E3.4), agora é 'achar meu CNAE' — quem chega aqui já é cliente. A categoria escolhida no E3.4 chega pré-selecionada (`?cat=`) e afunila a busca. Mantém o atalho 'já sei o número do meu CNAE'.",
      },
      {
        rota: "/veredito/atende",
        nome: "🟢 CNAE confirmado",
        nota: "Happy path. Linguagem humana ANTES do código (UX-05). CTA 'É isso mesmo' + refazer acima sem perder texto. 🔄 27/08: agora é pós-pagamento, e é o único desfecho possível no caminho abrir (a categoria do E3.4 já garantiu que a atividade é atendida).",
      },
      {
        rota: "/gate?etapa=triagem",
        nome: "Triagem quantos sócios?",
        nota: "🔎 SEPARADA 28/07 — vivia presa dentro do SPA do gate. É o fail-fast do UX-21: sócios + exterior, ANTES do dinheiro. 🔄 27/08: agora é a PRIMEIRA tela do `/gate` (o CNAE saiu daqui e foi pra C0, pós-pagamento). Ela FICOU antes do dinheiro de propósito: bloqueia por motivos que a categoria não prevê. Bloqueado → 'Falar com o time' agora navega de verdade pra /saida/exterior ou /saida/socios (era beco sem saída até 28/07).",
      },
      {
        rota: "/gate?etapa=faixa",
        nome: "Faixa de faturamento",
        nota: "🔎 SEPARADA 28/07 — mesma amarração do SPA. Última etapa do gate; segue direto pro E6. Faixa guiada por padrão + 'sei o valor exato' (UX-51). 🔴 27/08: a escolha de endereço (próprio × fiscal) SAIU daqui e foi pro E3.4, junto do gate de cidade — ela nunca teve a ver com faturamento. Voltou a fazer uma pergunta só.",
      },
      {
        rota: "/veredito/waitlist",
        nome: "E5.1 · 🟡 Waitlist",
        nota: "Não é 'não', é 'ainda não'. UX-22: dar o enquanto isso. Captura contato, não fecha a porta. Template A9. 🔄 27/08: virou a ÚNICA porta de 'não atendo' do caminho abrir, e ela acontece ANTES do dinheiro — alcançada pelo 'minha atividade não está na lista' do E3.4, não mais pelo veredito.",
      },
      {
        rota: "/veredito/nao-atende",
        nome: "E5.2 · 🔴 Contato especial (atendido pelo Mauro)",
        nota: "✅ 28/07: RELABEL — era 'Comercial'. É quem NÃO atendemos mas a Legalize Digital (escritório do Mauro) atende do jeito tradicional. Mesmo template A9. 🔄 27/08: no caminho ABRIR ficou órfã (o veredito não decide mais elegibilidade); segue viva e alcançável pelo Migrar (E4.2).",
      },
      {
        rota: "/veredito/descartado",
        nome: "E5.3 · 🔴 Fora de escopo (descarta)",
        nota: "✅ 28/07 — 3ª via do veredito 🔴. Decline limpo, sem captura. 🔄 27/08: ficou ÓRFÃ no caminho abrir (o gate virou a categoria do E3.4, e quem não se acha na lista vai pra waitlist, que captura contato — melhor desfecho). Mantida catalogada porque a rota existe e o mock ainda produz esse desfecho.",
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
      {
        rota: "/saida/socio-pj",
        nome: "🆕 E5.6 · Saída · sócio via CNPJ",
        nota: "24/08 (pedido do Pedro, em cima da reunião Leonan 19/08) — sócio pessoa jurídica tira a empresa do Simples Nacional no ato do contrato social (regra fiscal, diferente do limite de produto da E5.5). Bloqueia na triagem, antes do dinheiro. ⚠️ Existia como rota real e no `flow-data.mjs`, mas não estava catalogada aqui — não aparecia como tile no /mockup até esta correção (26/08).",
      },
    ],
  },
  {
    id: "ramo-mei",
    nome: "🆕 M · Ramo MEI (abertura de MEI)",
    descricao:
      "🆕 28/08 — o ramo que atende quem quer abrir MEI, construído em cima de `pesquisa/abertura-mei/abertura-mei-processo.md` (70 refs oficiais). ⚠️ O achado que define tudo: **não existe API nem procuração que permita abrir MEI por terceiro** — o Portal do Empreendedor exige a conta gov.br (Prata/Ouro) DO TITULAR, não tem login por representação, e a procuração do e-CAC só cobre atos posteriores. Usar a senha do cliente violaria os Termos de Uso. Por isso o modelo é CONCIERGE: a gente coleta tudo, um atendente interno confere, e o cliente finaliza no gov.br com a nossa 'cola'. A abertura em si é gratuita e sai em minutos (sem viabilidade, sem Junta, sem contrato social, sem certificado digital, sem alvará em BH). O ramo só bifurca onde a lei obriga: E6→E9 (dinheiro) e A5 (home dia-1) são COMPARTILHADOS com o ME, e o C1/C4/C7 são as mesmas telas com prop `mei`.",
    telas: [
      {
        rota: "/endereco?regime=mei",
        nome: "E3.4 · Endereço + categoria (variante MEI)",
        nota: "Mesma tela do ME, 2 diferenças: (1) SEM gate de BH — a Legalizai abre MEI do Brasil inteiro; (2) COM gate de categoria — 3 das 14 (tecnologia, design, consultoria) não existem como MEI, porque o art. 966 do CC não considera profissão intelectual como atividade de empresário, e elas nem constam do Anexo XI. Decisão: elas NÃO somem da lista, aparecem marcadas '(só como ME)' e quem escolhe uma delas ganha a explicação real + a porta pro ME. Esconder faria a pessoa achar que não atendemos a atividade dela — quando atendemos, só não como MEI.",
      },
      {
        rota: "/mei/impedimentos",
        nome: "🆕 M-T · Impedimentos (no lugar da triagem)",
        nota: "Substitui a triagem de sócios (E5T), que não faz sentido pro MEI (unipessoal por definição). São 3 impedimentos que o PRÓPRIO GOVERNO checa: (1) já ser sócio/titular/admin de outra PJ — a RFB cruza o CPF e bloqueia, LC 123 art. 18-A; (2) servidor público federal na ativa — Lei 8.112/90 art. 117; (3) receber aposentadoria por invalidez / salário-maternidade / seguro-desemprego — este NÃO bloqueia, mas a formalização cancela o benefício de forma irreversível, então vira escolha informada com confirmação explícita. Fica ANTES do pagamento pelo mesmo motivo da triagem do ME.",
      },
      {
        rota: "/mei/saida/ja-tem-cnpj",
        nome: "M-T.1 · 🔴 Já tem CNPJ",
        nota: "Saída de bloqueio do GOVERNO, não do produto — por isso não é waitlist: oferece os 2 caminhos reais (baixar a empresa antiga OU abrir como ME), que a Legalizai faz hoje.",
      },
      {
        rota: "/mei/saida/servidor",
        nome: "M-T.2 · 🔴 Servidor federal",
        nota: "A vedação do art. 117 da Lei 8.112/90 vale só pra servidor FEDERAL na ativa. A saída não fecha a porta pra estadual/municipal de propósito: lá a regra vem do estatuto de cada ente e em muitos casos é permitido — mandar essa pessoa embora seria perder cliente por regra que não se aplica a ela.",
      },
      {
        rota: "/mei/faturamento",
        nome: "E5 · Faixa (variante MEI: gate de teto)",
        nota: "Mesma tela, mas no MEI ela vira GATE: o teto é R$81.000/ano (LC 123 art. 18-A), ou R$6.750/mês. Acima disso o Continuar trava e a saída é o ME. A faixa 'até R$10 mil' CONTÉM o teto, então ali não dá pra afirmar nada — vira aviso, não porta fechada, com convite pra informar o valor exato. Descobrir depois de aberto custa caro: acima de 20% de excesso o desenquadramento é retroativo, com juros e multa.",
      },
      {
        rota: "/mei/atividade",
        nome: "M7 · Atividade principal (Anexo XI + limite interno)",
        nota: "🔄 07/09 — a tela única virou o BLOCO ATIVIDADE, no sistema aprovado da C0/C5 do ME (pedido do Pedro): chegada, escolha da principal com slot e cartões, secundárias, splash de fecho. O que continua diferente do ME é o motor, não o gesto: o Portal não aceita CNAE livre, só OCUPAÇÃO de lista fechada (Anexo XI, Res. CGSN 140/2018), então a busca ORDENA as ocupações da categoria em vez de a IA adivinhar código entre 1332. 🎯 Carrega o LIMITE INTERNO (Solução de Consulta Cosit nº 27/2021): a ocupação é mais estrita que o CNAE que ela mapeia — quem escolhe 'Reparador(a) de bicicleta' não pode consertar moto, e descobriria numa fiscalização. É o erro que só contador pega, e é parte do que vendemos.",
      },
      {
        rota: "/mei/atividade-secundarias",
        nome: "M7.S · Atividades secundárias (até 15)",
        nota: "🆕 07/09 — a C5 do ramo. O limite de 15 aqui é OFICIAL (etapa 'Qualificação do Negócio' do Portal), não régua de produto como no ME. Duas diferenças de fundo: a busca atravessa as categorias (quem faz duas coisas de ramos diferentes precisa achar a segunda), e não existe 'muda seu enquadramento' — o DAS do MEI é fixo. O que pode mudar é outra coisa: ocupação de comércio, indústria ou transporte intermunicipal gera Inscrição Estadual automática no SIARE, e é isso que a tela avisa.",
      },
      {
        rota: "/mei/status",
        nome: "A3 · Status (variante MEI)",
        nota: "🔄 28/08 — o pipeline MEI foi REESCRITO. A versão de 03/08 tinha 1 etapa, 'Registrando no Portal do Empreendedor', que PROMETIA O QUE NÃO DÁ PRA ENTREGAR. Agora são 4: recebemos → nosso time está conferindo → próximos passos prontos (ação do cliente, CTA) → empresa aberta. Reusa a mesma máquina parametrizada do Migrar, sem tela nova. ✍️ A palavra 'contador' não aparece: o plano MEI (R$49) tem atendente; contador CRC é o que sustenta o preço do ME (R$139), ver `financeiro/estado-atual.md`.",
      },
      {
        rota: "/mei/certificado",
        nome: "A3.2' · Certificado (operar, não abrir)",
        nota: "🆕 28/08 (decisão do Pedro) — MESMA tela do ME, 2 diferenças. (1) MOTIVO: no ME o certificado destrava a procuração que acompanha a assinatura; no MEI não existe assinatura nem procuração de abertura (a abertura DISPENSA certificado — gov.br Prata/Ouro supre), então o que ele destrava é OPERAR: puxar guia, FGTS Digital, agir em nome da empresa sem pedir senha toda vez. (2) QUEM PAGA: no ME vem incluso (contrapartida da fidelidade, ADR 04/08); no MEI NÃO vem — o cliente providencia, e a tela diz isso antes da escolha. Fica ANTES da A5: tem que estar resolvido antes de a pessoa cair dentro do app, mesma régua do ME.",
      },
      {
        rota: "/mei/proximos-passos",
        nome: "M-S · Próximos passos (a 'cola')",
        nota: "A tela que FECHA o ramo, e existe por razão jurídica, não de UX: como não dá pra registrar pelo cliente, a entrega é o passo a passo com os valores DELE prontos, na ordem exata dos campos do Portal, com botão de copiar. Inclui a checagem do nível da conta gov.br (Prata/Ouro é obrigatório e a maioria não sabe qual tem) e o link pro Portal. ✍️ REGRA DE COPY DURA: nunca dizer 'a gente abre pra você' neste ramo — é promessa que não dá pra cumprir e vira reembolso.",
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
        nome: "E9 · Pagamento + contrato (variante Abrir) · 🏷️ AMBOS (MEI: sem taxa)",
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
      "Continuação decimal de E9, só de quem veio do caminho migrar. Depois de pagar, direto pra transferência no conselho (CRC-MG) — a pausa mais perigosa do produto, porque quem libera é o contador ANTIGO, um concorrente perdendo o cliente. Termina em E9.4, que entrega direto pra A5 (Home dia-1), pulando Constituição e Aprovação inteiras — a empresa já existia, não há dossiê pra montar nem Junta pra aprovar. 🔴 06/08: a E9.2 antiga (auditoria de passivo) foi RETIRADA — a gente não sai buscando pendência do contador anterior antes de assumir; isso vira serviço à parte, sob demanda, só depois que o cliente já está ativo no app. O NÚMERO da tela foi reaproveitado no mesmo flow (06/08, reunião Rua Satélite 19): agora é 'Seu contador atual', dado que a transferência (E9.3) precisa pra existir.",
    telas: [
      {
        rota: "/migrar/contador",
        nome: "E9.2 · Seu contador atual",
        nota: "06/08 (reunião Rua Satélite 19, Léo) — só ME passa por aqui (MEI nunca tem TTRT, vai direto pro E9.4). Pede nome/e-mail/telefone/CRC do contador de hoje, pra abrir o TTRT. Pré-preenche e-mail/telefone quando a consulta cadastral trouxer (nem sempre vem — não existe API pública de 'quem é o contador de um CNPJ'); o que a pessoa digitar vale, mesmo se divergir. Sem trava de Continuar: quem não sabe algum dado segue mesmo assim.",
      },
      {
        rota: "/migrar/dados",
        nome: "E9.2b · Dados que o cartão CNPJ não traz",
        nota: "24/08 (reunião Leonan 19/08, achado tardio) — reusa os mesmos campos do C1 (CPF/RG/órgão emissor/estado civil), digitação manual. Fica DEPOIS do contador atual e ANTES da transferência (1ª tentativa desta correção colocou errado, entre CNPJ e diagnóstico). ⚠️ Existia como rota real, mas não estava catalogada aqui até esta correção (26/08) — não aparecia no /mockup.",
      },
      {
        rota: "/migrar/socios",
        nome: "E9.2c · Dados dos sócios",
        nota: "24/08 (reunião Leonan 19/08) — MESMA tela do C3 (`SociosView`), reusada com `contexto=\"migrar\"`, só a copy muda. Não existe triagem prévia perguntando quantos sócios no caminho migrar, então a tela se sustenta sozinha. ⚠️ Mesmo gap de catalogação do `/migrar/dados` acima, corrigido em 26/08.",
      },
      {
        rota: "/migrar/gov",
        nome: "E9.2d · GOV.BR + procuração",
        nota: "24/08 (reunião Leonan 19/08) — reusa `CodigoGovView` (mesmo componente do A4, caminho abrir) com `soProcuracao`: não existe protocolo de registro pra assinar (empresa já existe), só a procuração. Mesma janela de 10min/3 tentativas/escala pra atendente. ⚠️ Mesmo gap de catalogação, corrigido em 26/08.",
      },
      {
        rota: "/migrar/transferencia",
        nome: "E9.3 · Iniciando transferência",
        nota: "Reusa o PainelView do A3 (parametrizado 30/07) — mesma máquina de estados, outro pipeline: encerrar com o antigo → transferir no conselho (CRC-MG) → atualizar no Redesim (Receita+Estado) → trocar responsável na Prefeitura (CadWeb PBH) → liberar acesso. Os códigos oficiais (resolução CFC, Evento 232) ficam FORA da tela: são 🟡 pendência, não ratificados em fonte primária. 🆕 04/08: pipeline virou 5 etapas (era 4) — cruzamento com `Fluxo Migração GEMINI.md` tratou a troca municipal (PBH) como ação separada da atualização federal/estadual; 🟡 se confirmar que é o mesmo mecanismo, volta pra 4.",
      },
      {
        rota: "/migrar/transferencia?estado=travado",
        nome: "E9.3 · 🔴 TTRT travado (migra-refem)",
        nota: "A pausa mais perigosa do produto inteiro. O TTRT é aberto por nós no CRC-MG e validado pelo contador ANTIGO — um concorrente que está perdendo o cliente. Todas as pausas do caminho abrir esperam órgão neutro ou o próprio cliente; esta espera alguém com interesse contrário. A tela ASSUME o problema ('a gente assumiu esse problema') em vez de repassar culpa ou deixar no limbo.",
      },
      {
        rota: "/migrar/ativa",
        nome: "✅ E9.4 · Migração concluída",
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
        nome: "E9.1 · Aguardando boleto dossiê já liberado",
        nota: 'Existe porque o boleto ficou (decisão do Pedro). Abre com o dossiê liberado, não com bloqueio: "sem sensação de travou" é regra da spec T19. Dunning com o gancho da economia (UX-45), não lembrete seco. Persona `knife`.',
      },
      {
        rota: "/retomar",
        nome: "C0.1 · Retomar (porta de CPF)",
        nota: "Retomar ≠ restaurar (UX-46): a `cida` volta sem contexto, então responde já fiz / falta / e agora — com UM passo só, porque a lista inteira recria a paralisia. UX-23: revalida a estimativa, que envelhece na virada do ano.",
      },
    ],
  },
  {
    id: "dossie",
    nome: "C5,C1–C4,C6,C7 · Constituição (o dossiê)",
    descricao:
      "A coleta do dossiê, logada e paga. 🔄 28/08 (pedido do Pedro): C5 (secundárias) MUDOU DE LUGAR — saiu de entre C4 e C6, virou a PRIMEIRA tela do grupo, direto após a C0 confirmar o CNAE principal (mesmo raciocínio, sem trocar de assunto). Ordem agora: C5→C1→C2→C3→C4→C6→C7. Dali em diante cada tela herda o que já foi dito antes — limite de sócios já filtrado na triagem (`?cat=`, tela em [Image #78]). 🟡 a frase antiga aqui ('MEI pula C2/C3 direto C1→C4') é de 03/08, ANTES da C0 e da M-O existirem — MEI hoje nem entra neste grupo, segue o próprio caminho (`/dossie/ocupacao` em diante, grupo acima); não foi reverificado se algum resquício de MEI ainda cai aqui. C4 e C7 seguem pontos de reencontro (🏷️ tags marcam cada tela).",
    telas: [
      {
        rota: "/dossie/cnae-secundarios",
        nome: "C5 · CNAE secundários",
        nota: "🔄 28/08: MUDOU DE LUGAR — era a 5ª tela do grupo (entre C4 e C6), agora é a 1ª, logo após a C0 confirmar o principal. Nota antiga dizia 'herdado do E5'; hoje é herdado da própria C0 (E5 não existe mais nesse ponto do flow desde 27/08). Sugestões com prova social. Comércio entra com aviso, nunca some silencioso.",
      },
      {
        rota: "/dossie/socio",
        nome: "C1 · Seus dados",
        nota: "✅ 28/07: RECONSTRUÍDA — não coleta mais do zero. Card read-only confirma nome/CPF/telefone/endereço já vindos do E6; só pede o que faltou (RG, órgão emissor, estado civil). Casado revela regime; comunhão universal avisa o cônjuge cedo (UX-30).",
      },
      {
        rota: "/dossie/vinculo",
        nome: "C2 · Vínculo INSS · 🏷️ SÓ ME (MEI pula)",
        nota: "Coleta o CLT que alimenta a sugestão de enquadramento (UX-24, hoje um card no A1 — o simulador dedicado foi dissolvido 28/07). Teto é FOLGA, não binário. Pró-labore reenquadrado como ganho (UX-27).",
      },
      {
        rota: "/dossie/socios",
        nome: "C3 · Sócios? · 🏷️ SÓ ME e só quem disse que teria sócio na Triagem",
        nota: "Limite 2 (trava, não 1ª notícia — E5/Triagem já filtrou). Divisão soma 100%, default 50/50. 🔄 28/08 (pedido do Pedro): não é mais 'MEI pula' apenas — ME que respondeu 'Só eu' na Triagem [Image #78] também não vê esta tela (`passosDoCliente({mei, temSocios})` em `lib/passos.ts` filtra de verdade agora).",
      },
      {
        rota: "/dossie/empresa",
        nome: "C4 · Dados da empresa · 🏷️ AMBOS — reencontro (MEI: sem capital social)",
        nota: "Upsell endereço fiscal (oferece, não obriga; preço R$49/mês, fechado 10/09). ✅ 28/07: IPTU virou OBRIGATÓRIO travado (JUCEMG exige, era opcional). Residência de sócio dinâmica pelo E5 (pula se solo). Alerta capital baixo. 🆕 04/08: campo do IPTU ganhou validação de dígito mínimo (10) — antes aceitava qualquer string não-vazia; 🟡 formato exato (10-12 dígitos) segue fila-Larissa.",
      },
      // 🗑️ 31/08 (validado pelo Pedro, reunião Rua Satélite 38-40) — C6
      // (natureza jurídica, `/dossie/natureza`) REMOVIDA do flow real: SLU ×
      // LTDA virou decisão 100% interna, sem tela nem rota. Ver
      // PREENCHIDOS_INTERNAMENTE em `execucao/flow/flow-data.mjs`.
      {
        rota: "/dossie/nome",
        nome: "C7 · Nome / razão social · 🏷️ AMBOS — reencontro final",
        nota: "IA sugere a razão. Checagem de viabilidade: nome em uso → variações (evita reprova JUCEMG).",
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
        nome: "A1 · Revisar + autorizar · 🏷️ AMBOS (MEI: sem capital/taxa)",
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
        nome: "A3.1 · Órgão recusa 'precisa de você' · 🏷️ SÓ ME (não existe pro MEI)",
        nota: "O 4º estado (UX-40): a Junta reprovou o nome apesar da prévia (persona `erro-orgao` do motor). Vermelho + 'precisa de você' + a ação, recuperação DENTRO do pipeline. Aqui o danger é legítimo: um órgão externo parou a fila mesmo. ✅ 28/07: RETRY AUTOMÁTICO — tenta as 3 opções do C7 em sequência (~1.4s cada), sem ação do cliente; só pede 3 novas sugestões se as 3 falharem. Mock sempre esgota as 3, pra provar o pior caso. 03/08: MEI não passa pela Junta, então esse tipo de disputa de nome não existe do mesmo jeito — não implementado pro MEI.",
      },
      {
        rota: "/certificado",
        nome: "'A3.2 · Certificado digital' 🗑️ REMOVIDO 01/09 (segue só no MEI/migrar)",
        nota: "26/08 (reunião Rua Satélite 36, item 7) — REINTRODUZIDO, mas reordenado. Existia um `/certificado` antigo (N24), removido como órfão em 30/07 (nada navegava até lá) — este é NOVO, não a mesma tela ressuscitada. Motivo estrutural: a procuração que sai junto da assinatura (A4) EXIGE o certificado já validado, então não dá pra deixar pra depois (era a ordem antiga, documentada como inconsistência). Pergunta 'já tem?' → upload arquivo+senha (sim) ou agenda entrevista com certificadora parceira (não).",
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
        nome: "E3.1 · Login / portal",
        nota: "A saída terminal A1: diverge no E3 (\"já sou cliente\"), sai da abertura e não reconverge. Não usa o template A9 — aquele é pra recusa, e isto é rota feliz de quem volta pra casa. Layout de 2 painéis, único no produto.",
        statusClaro: true,
      },
    ],
  },
];
