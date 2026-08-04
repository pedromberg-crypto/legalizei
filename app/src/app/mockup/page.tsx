"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * /mockup — prancha de review das telas, em moldura de celular.
 * ═══════════════════════════════════════════════════════════════════════════
 * NÃO É PRODUTO. É ferramenta de review do Pedro: ver as telas como mockup,
 * com a borda do aparelho em volta, em vez de página solta no browser.
 *
 * Mora FORA dos route groups (wizard)/(app) de propósito: não pertence a
 * nenhum dos dois shells. É chrome de ferramenta.
 *
 * Por isso também é o ÚNICO arquivo do app que pode usar cor fora dos tokens:
 * a moldura é um objeto físico (alumínio, vidro, barra de status do iOS), não
 * superfície do produto. Se ela usasse `surface-card`, o token estaria
 * mentindo sobre o que é.
 *
 * ─── O que mudou em 16/07 e por quê ───────────────────────────────────────
 * A v1 desenhava a Dynamic Island como ADESIVO por cima do iframe, e o app
 * pintava embaixo dela sem saber que existia. A moldura tinha cara de iPhone
 * e espaço de browser: mentia nas duas pontas (topo, embaixo da Island;
 * rodapé, embaixo da barra de gesto, justo onde o CTA NÃO pode estar).
 *
 * Agora a moldura SIMULA o aparelho: injeta --safe-top/--safe-bottom dentro
 * do documento do iframe. O app então respeita a inset igual respeitaria num
 * telefone. Os números não são estética, são o que o `useSafeAreaInsets()` do
 * React Native vai devolver no aparelho de verdade (stack travada 09/07).
 *
 * Injetar de fora, em vez de o app ler um `?mockup=1`, é de propósito: a tela
 * não fica sabendo que existe prancheta. Quem sabe de aparelho é a moldura.
 * ═══════════════════════════════════════════════════════════════════════════
 */

type Topo = "island" | "notch" | "barra";

interface Aparelho {
  id: string;
  nome: string;
  porque: string;
  /** Pontos lógicos (o que o CSS e o RN chamam de px). Não é pixel físico. */
  w: number;
  h: number;
  safeTop: number;
  safeBottom: number;
  raio: number;
  topo: Topo;
}

const APARELHOS: Aparelho[] = [
  {
    id: "15-pro-max",
    nome: "iPhone 15 Pro Max",
    porque: "o aparelho do Pedro. É nele que a review acontece.",
    w: 430,
    h: 932,
    safeTop: 59,
    safeBottom: 34,
    raio: 55,
    topo: "island",
  },
  {
    id: "13-mini",
    nome: "iPhone 13 mini",
    porque: "o alvo antigo do mapa-telas-mobile. Notch, e a inset é menor.",
    w: 375,
    h: 812,
    safeTop: 44,
    safeBottom: 34,
    raio: 44,
    topo: "notch",
  },
  {
    id: "se",
    nome: "iPhone SE",
    porque: 'o chão. 667 de altura é onde a regra "sem scroll" morre primeiro.',
    w: 375,
    h: 667,
    safeTop: 20,
    safeBottom: 0,
    raio: 6,
    topo: "barra",
  },
];

/** Altura da barra de status. Não é a safe area: na Island sobram ~5pt embaixo. */
const BARRA_H: Record<Topo, number> = { island: 54, notch: 44, barra: 20 };

/**
 * Telas AGRUPADAS NA ORDEM DO FLOW. Cada grupo é uma esteira horizontal: as
 * telas dele aparecem lado a lado e, quando passam da largura, viram scroll
 * lateral (clicar-segurar-arrastar).
 *
 * 🆕 03/08 — nomenclatura E·C·A·P (ADR em [[decisoes-marca]]): letra por
 * flow + numeração fluida + decimal em condicional/saída. A ordem dos
 * GRUPOS segue `flow/flow-data.mjs` + `portal/portal-data.mjs` (fontes-
 * únicas): Entrada (E1–E4, com Migrar fundido como decimal do fork E4) →
 * E5 porta+veredito → saídas da triagem → dinheiro (E6–E9) → Migrar
 * pós-pagamento (E9.2–E9.4, decimal de E9) → pausas (C0.1/E9.1) →
 * Constituição/dossiê (C1–C7) → Aprovação (A1–A5) → Portal (P-INI/P-IMP/
 * P-NOT/P-EMI/P-MAIS/P-GER) → fora do flow. Onde o flow bifurca, o ramo
 * entra logo depois do nó que o gera — não no fim.
 */
interface Tela {
  rota: string;
  nome: string;
  nota: string;
  /** Tela de fundo escuro: o cromo do iOS inverte pra branco. Só a splash. */
  statusClaro?: boolean;
}

const GRUPOS: {
  id: string;
  nome: string;
  descricao: string;
  telas: Tela[];
}[] = [
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
        nota: "04/08 — nasce do M1 (`/migrar/cnpj?cenario=presumido`, mock de demo): CNPJ ativo, mas Lucro Presumido usa motor fiscal totalmente diferente (IRPJ/CSLL/PIS-COFINS/ISS, não Anexo/Fator R) que ainda não temos. 🆕 04/08 (2ª rodada): MEI SAIU desta saída — decisão do Pedro, MEI migra normal agora. Só resta Presumido aqui, decisão de negócio aberta (`pesquisa/parking-lot.md` item I).",
      },
      {
        rota: "/saida/cnpj-inapto",
        nome: "🆕 E4.2 · Saída · CNPJ inapto/suspenso",
        nota: "04/08 — nasce do M1 (`/migrar/cnpj?cenario=inapto`, mock de demo): situação cadastral ≠ ativa. Diferente da auditoria de passivo (M4a, que pressupõe CNPJ ATIVO com dívida): aqui a Receita nem reconhece a empresa como ativa, então a regularização vem ANTES de qualquer migração.",
      },
      {
        rota: "/migrar/tributario",
        nome: "🆕 E4.2b · Simples Nacional ou Lucro Presumido? (só ME)",
        nota: "04/08 — debate de custo com o Pedro: a API paga que confirma Simples×Presumido de verdade (`receita-federal/simples`, R$0,24) só roda DEPOIS que a pessoa virar cliente (M4a/ativação fiscal) — não faz sentido cobrar isso de um lead que ainda não converteu. Autodeclarado aqui, mesma doutrina da E3.2 (MEI×ME). Simples → segue pro M2; Presumido → `/saida/regime-nao-suportado`. MEI pula essa pergunta (vai direto do M1 pro M2 com `?regime=mei`).",
      },
      {
        rota: "/migrar/diagnostico",
        nome: "E4.3 · Migrar · Diagnóstico com o número REAL",
        nota: "🎯 A maior vantagem sobre o caminho abrir: empresa com 12+ meses tem histórico, então o Fator R sai do que DE FATO aconteceu — não de faixa declarada. Cenário padrão = Fator R abaixo do corte (paga Anexo V sem precisar), com a conta aberta: receita 12m, folha 12m, o % e o corte de 28%.",
      },
      {
        rota: "/migrar/diagnostico?cenario=ja-otimo",
        nome: "E4.3 · ⚖️ Guarda-corpo de honestidade",
        nota: "O caminho que a maioria dos produtos não constrói: e se o contador atual JÁ acertou? A tela diz isso ('seu imposto já está certo') e troca o argumento pra SERVIÇO — guia pronta, nota em 2 toques, alguém olhando o número. Vender economia pra quem não tem seria a `promessa-quebrada` do caminho migrar.",
      },
      {
        rota: "/migrar/diagnostico?regime=mei",
        nome: "🆕 E4.3 · Migrar · Diagnóstico MEI (\"tem contador?\")",
        nota: "04/08 — MEI não tem Fator R (paga DAS-MEI fixo), então o diagnóstico de número real não se aplica. Vira uma pergunta que decide tudo: 'você tem contador hoje?' — MEI não é obrigado a ter um (DASN-SIMEI é autodeclaratório). Resposta vira `?contador=sim|nao` e viaja até o pagamento pra decidir se pula M4 (auditoria+TTRT) inteiro.",
      },
      {
        rota: "/migrar/plano",
        nome: "E4.4 · Migrar · A conta da migração",
        nota: "Sem taxa de governo — a empresa já existe, não há DAE da Junta nem TFLF. O choque de custo do E7 (~R$463 na 3ª tela, UX-54) simplesmente não acontece, e a tela diz isso explicitamente em vez de só omitir. Só a mensalidade no rodapé. Igual pros dois regimes (MEI/ME) — só repassa os params adiante.",
      },
      {
        rota: "/migrar/contrato",
        nome: "E4.5 · Migrar · Contrato (com a promessa de devolução)",
        nota: "🔴 A linha que sustenta a decisão de cobrar antes do TTRT: 'se a transferência não for concluída por algum motivo fora do seu controle, você recebe tudo de volta'. NÃO é copy de marketing — é a contrapartida obrigatória de cobrar por algo cujo destravamento depende de um terceiro hostil. Se essa linha sair, a decisão inteira precisa ser reaberta. Daqui segue pro pagamento (E9, esteira seguinte) — mesmo tronco do caminho abrir. 🆕 04/08: MEI sem contador (`?regime=mei&contador=nao`) não tem TTRT pra falhar — a cláusula vira promessa de início imediato em vez de devolução.",
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

/* ═══════════════════════════════════════════════════════════════════════════
   MAPA MENTAL — visão panorâmica de TODAS as telas + conexões reais.
   ═══════════════════════════════════════════════════════════════════════════
   🆕 03/08 — CTA no header abre este overlay. Reusa `GRUPOS` (mesma fonte das
   esteiras, zero cópia de dado) como colunas do mapa. As CONEXÕES abaixo são
   a tradução manual pra `rota` das arestas reais de `flow/flow-data.mjs` +
   `portal/portal-data.mjs` (que usam `id`, não `rota` — por isso não dá pra
   importar direto). ⚠️ Herança manual: se o flow mudar de novo, este mapa
   pode ficar defasado até alguém atualizar as duas listas juntas.
   ─────────────────────────────────────────────────────────────────────────── */

interface Conexao {
  de: string;
  para: string;
  /** Ramo/alternativa/atalho de navbar — mais fino e claro que o fluxo principal. */
  tracejado?: boolean;
}

const MAPA_EDGES: Conexao[] = [
  // ── Entrada + Migrar fundido ──────────────────────────────────────────────
  { de: "/splash", para: "/welcome" },
  { de: "/welcome", para: "/entrada" },
  { de: "/entrada", para: "/entrada?intencao=abrir" },
  { de: "/entrada", para: "/login", tracejado: true },
  // 🆕 03/08 — E3.2 (MEI×ME) fica ENTRE o fork e o gate de cidade. MEI pula
  // o E4 inteiro (sem limite geográfico); só ME confirma cidade.
  { de: "/entrada?intencao=abrir", para: "/gate?regime=mei", tracejado: true },
  { de: "/entrada?intencao=abrir", para: "/entrada?intencao=abrir&regime=me" },
  { de: "/entrada?intencao=abrir&regime=me", para: "/gate" },
  { de: "/entrada?intencao=abrir&regime=me", para: "/saida/fora-bh", tracejado: true },
  // 🆕 04/08 (2ª rodada) — Migrar TAMBÉM passa pela E3.2 agora (copy própria,
  // autodeclaração). MEI pula a cidade e vai direto pro M1 já sinalizado
  // (`?cenario=mei`); ME cai no MESMO tile de gate de cidade do Abrir (é a
  // mesma tela reusada) e só depois segue pro M1.
  { de: "/entrada", para: "/entrada?intencao=migrar", tracejado: true },
  { de: "/entrada?intencao=migrar", para: "/migrar/cnpj?cenario=mei", tracejado: true },
  { de: "/entrada?intencao=migrar", para: "/entrada?intencao=abrir&regime=me" },
  { de: "/entrada?intencao=abrir&regime=me", para: "/migrar/cnpj" },
  { de: "/migrar/cnpj", para: "/migrar/cnpj?fase=achou", tracejado: true },
  { de: "/migrar/cnpj", para: "/migrar/tributario" },
  { de: "/migrar/tributario", para: "/migrar/diagnostico" },
  { de: "/migrar/tributario", para: "/saida/regime-nao-suportado", tracejado: true },
  { de: "/migrar/cnpj", para: "/migrar/diagnostico?cenario=ja-otimo", tracejado: true },
  { de: "/migrar/cnpj", para: "/migrar/diagnostico?regime=mei", tracejado: true },
  { de: "/migrar/cnpj", para: "/veredito/waitlist", tracejado: true },
  { de: "/migrar/cnpj", para: "/veredito/nao-atende", tracejado: true },
  { de: "/migrar/cnpj", para: "/saida/regime-nao-suportado", tracejado: true },
  { de: "/migrar/cnpj", para: "/saida/cnpj-inapto", tracejado: true },
  { de: "/migrar/diagnostico", para: "/migrar/plano" },
  { de: "/migrar/diagnostico?regime=mei", para: "/migrar/plano", tracejado: true },
  { de: "/migrar/plano", para: "/migrar/contrato" },
  { de: "/migrar/contrato", para: "/pagamento?fluxo=migrar" },

  // ── E5 porta+veredito ──────────────────────────────────────────────────────
  { de: "/gate", para: "/veredito/atende" },
  { de: "/veredito/atende", para: "/gate?etapa=triagem" },
  { de: "/gate", para: "/veredito/waitlist", tracejado: true },
  { de: "/gate", para: "/veredito/nao-atende", tracejado: true },
  { de: "/gate", para: "/veredito/descartado", tracejado: true },
  { de: "/gate?etapa=triagem", para: "/gate?etapa=faixa" },
  { de: "/gate?etapa=triagem", para: "/saida/exterior", tracejado: true },
  { de: "/gate?etapa=triagem", para: "/saida/socios", tracejado: true },
  { de: "/gate?etapa=faixa", para: "/conta" },

  // ── Dinheiro + Migrar pós-pagamento ────────────────────────────────────────
  { de: "/conta", para: "/plano" },
  { de: "/plano", para: "/contrato" },
  { de: "/contrato", para: "/pagamento" },
  { de: "/pagamento", para: "/dossie/socio" },
  { de: "/pagamento", para: "/aguardando", tracejado: true },
  { de: "/pagamento?fluxo=migrar", para: "/migrar/passivo" },
  { de: "/migrar/passivo", para: "/migrar/transferencia" },
  { de: "/migrar/passivo?cenario=limpo", para: "/migrar/transferencia", tracejado: true },
  { de: "/migrar/transferencia", para: "/migrar/ativa" },
  { de: "/migrar/transferencia?estado=travado", para: "/migrar/ativa", tracejado: true },
  { de: "/migrar/ativa", para: "/home-dia1" },

  // ── Pausas → dossiê ────────────────────────────────────────────────────────
  { de: "/aguardando", para: "/dossie/socio", tracejado: true },
  { de: "/retomar", para: "/dossie/socio", tracejado: true },

  // ── Constituição (dossiê, sequencial) ──────────────────────────────────────
  { de: "/dossie/socio", para: "/dossie/vinculo" },
  { de: "/dossie/vinculo", para: "/dossie/socios" },
  { de: "/dossie/socios", para: "/dossie/empresa" },
  { de: "/dossie/empresa", para: "/dossie/cnae-secundarios" },
  { de: "/dossie/cnae-secundarios", para: "/dossie/natureza" },
  { de: "/dossie/natureza", para: "/dossie/nome" },
  { de: "/dossie/nome", para: "/revisar" },

  // ── Aprovação ───────────────────────────────────────────────────────────────
  { de: "/revisar", para: "/termo" },
  { de: "/termo", para: "/painel" },
  { de: "/painel", para: "/painel/recusa", tracejado: true },
  { de: "/painel/recusa", para: "/painel", tracejado: true },
  { de: "/painel", para: "/assinatura" },
  { de: "/assinatura", para: "/home-dia1" },

  // ── Portal (grafo de navegação) ────────────────────────────────────────────
  { de: "/home-dia1", para: "/inicio" },
  { de: "/inicio", para: "/impostos", tracejado: true },
  { de: "/inicio", para: "/impostos/aliquotas", tracejado: true },
  { de: "/inicio", para: "/pro-labore", tracejado: true },
  { de: "/inicio", para: "/avisos", tracejado: true },
  { de: "/inicio", para: "/blog", tracejado: true },
  { de: "/inicio", para: "/notas", tracejado: true },
  { de: "/inicio", para: "/mais", tracejado: true },
  { de: "/inicio", para: "/emitir", tracejado: true },
  { de: "/impostos", para: "/impostos/guias" },
  { de: "/impostos", para: "/impostos/pagar" },
  { de: "/impostos", para: "/impostos/aliquotas" },
  { de: "/impostos", para: "/obrigacoes" },
  { de: "/impostos/guias", para: "/impostos/pagar" },
  { de: "/notas", para: "/notas/detalhe" },
  { de: "/notas/detalhe", para: "/emitir", tracejado: true },
  { de: "/mais", para: "/perfil" },
  { de: "/mais", para: "/mais/plano" },
  { de: "/mais", para: "/mais/servicos" },
  { de: "/mais", para: "/mais/empresa" },
  { de: "/mais", para: "/mais/socios" },
  { de: "/mais", para: "/mais/colaborador", tracejado: true },
  { de: "/mais", para: "/mais/documentos" },
  { de: "/mais", para: "/mais/certificado" },
  { de: "/mais", para: "/mais/em-dia" },
  { de: "/mais", para: "/mais/relatorios" },
  { de: "/mais", para: "/mais/declaracoes" },
  { de: "/mais", para: "/avisos" },
  { de: "/mais", para: "/blog" },
  { de: "/mais/empresa", para: "/mais/servicos", tracejado: true },
  { de: "/mais/certificado", para: "/mais/servicos", tracejado: true },
  { de: "/mais/servicos", para: "/impostos/guias", tracejado: true },
  { de: "/blog", para: "/blog/post" },
];

const CORES_GRUPO = [
  "#e0603f", "#5b6cf0", "#2f9e5a", "#e0a03f", "#9a5bd0",
  "#3f8fe0", "#d05b8f", "#6ba03f", "#c26b2f", "#4fa0a0", "#8a5b3f",
];

type Rect = { x: number; y: number; w: number; h: number };

function MapaMental({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pos, setPos] = useState<Record<string, Rect>>({});
  const [tamanho, setTamanho] = useState({ w: 0, h: 0 });

  const recalcular = useCallback(() => {
    const base = contentRef.current;
    if (!base) return;
    const baseRect = base.getBoundingClientRect();
    const proximo: Record<string, Rect> = {};
    for (const [rota, el] of Object.entries(nodeRefs.current)) {
      if (!el) continue;
      const r = el.getBoundingClientRect();
      proximo[rota] = {
        x: r.left - baseRect.left,
        y: r.top - baseRect.top,
        w: r.width,
        h: r.height,
      };
    }
    setPos(proximo);
    setTamanho({ w: base.scrollWidth, h: base.scrollHeight });
  }, []);

  useEffect(() => {
    recalcular();
    window.addEventListener("resize", recalcular);
    return () => window.removeEventListener("resize", recalcular);
  }, [recalcular]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  // Arrasto 2D (pan) — mesma ideia do useDragScroll das esteiras, nas 2 direções.
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    let down = false;
    let sx = 0;
    let sy = 0;
    let sl = 0;
    let st = 0;
    const onDown = (e: PointerEvent) => {
      down = true;
      sx = e.clientX;
      sy = e.clientY;
      sl = el.scrollLeft;
      st = el.scrollTop;
      el.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      el.scrollLeft = sl - (e.clientX - sx);
      el.scrollTop = st - (e.clientY - sy);
    };
    const stop = () => {
      down = false;
      el.style.cursor = "grab";
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stop);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stop);
    };
  }, []);

  function caminho(de: Rect, para: Rect): string {
    const dx = para.x + para.w / 2 - (de.x + de.w / 2);
    const dy = para.y + para.h / 2 - (de.y + de.h / 2);
    // Colunas (mesmo grupo) tendem a empilhar verticalmente; entre grupos o
    // salto é mais horizontal. Escolhe o par de âncoras pela direção dominante.
    if (Math.abs(dy) >= Math.abs(dx)) {
      const x1 = de.x + de.w / 2;
      const y1 = de.y + de.h;
      const x2 = para.x + para.w / 2;
      const y2 = para.y;
      const my = (y1 + y2) / 2;
      return `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
    }
    const x1 = dx >= 0 ? de.x + de.w : de.x;
    const y1 = de.y + de.h / 2;
    const x2 = dx >= 0 ? para.x : para.x + para.w;
    const y2 = para.y + para.h / 2;
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-surface-page/98 backdrop-blur-sm">
      <div className="flex shrink-0 items-center justify-between border-b border-border-hairline px-6 py-4">
        <div>
          <p className="text-micro font-semibold tracking-wide text-text-tertiary">
            Legalizai · mapa mental
          </p>
          <h2 className="text-h2 text-text-primary">Todas as telas, todas as conexões</h2>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-caption text-text-tertiary">Arraste pra navegar · Esc pra fechar</p>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-hairline bg-surface-card text-text-secondary transition-colors hover:border-border-strong"
            aria-label="Fechar mapa"
          >
            ✕
          </button>
        </div>
      </div>

      <div ref={canvasRef} className="flex-1 cursor-grab select-none overflow-auto">
        <div ref={contentRef} className="relative inline-flex gap-16 p-16">
          <svg
            width={tamanho.w}
            height={tamanho.h}
            className="pointer-events-none absolute left-0 top-0"
          >
            {MAPA_EDGES.map((e, i) => {
              const de = pos[e.de];
              const para = pos[e.para];
              if (!de || !para) return null;
              return (
                <path
                  key={i}
                  d={caminho(de, para)}
                  fill="none"
                  stroke={e.tracejado ? "#c9ccd6" : "#9aa0ac"}
                  strokeWidth={e.tracejado ? 1.25 : 1.75}
                  strokeDasharray={e.tracejado ? "4 4" : undefined}
                />
              );
            })}
          </svg>

          {GRUPOS.map((g, gi) => (
            <div key={g.id} className="relative z-10 flex w-[190px] shrink-0 flex-col gap-3">
              <p
                className="sticky top-0 mb-1 rounded-md bg-surface-page/95 px-1 py-0.5 text-micro font-bold uppercase tracking-wide"
                style={{ color: CORES_GRUPO[gi % CORES_GRUPO.length] }}
              >
                {g.nome}
              </p>
              {g.telas.map((t) => (
                <a
                  key={t.rota}
                  ref={(el) => {
                    nodeRefs.current[t.rota] = el;
                  }}
                  href={t.rota}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={t.nota}
                  className="block rounded-lg border bg-surface-card px-3 py-2.5 text-caption shadow-sm transition-colors hover:border-border-strong"
                  style={{ borderLeftWidth: 3, borderLeftColor: CORES_GRUPO[gi % CORES_GRUPO.length] }}
                >
                  <p className="font-semibold text-text-primary leading-snug">{t.nome}</p>
                  <p className="mt-0.5 truncate text-micro text-text-tertiary">{t.rota}</p>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MockupPage() {
  const [nonce, setNonce] = useState(0);
  const [apId, setApId] = useState(APARELHOS[0].id);
  // 75% é o default porque a prancheta cresceu: com 11 grupos e o flow inteiro,
  // 100% obriga a rolar pra ver uma esteira inteira. O zoom é da MOLDURA, não do
  // conteúdo (o iframe segue renderizando em 430pt), então nada do que o Pedro
  // revisa muda de tamanho relativo — só cabe mais na mesa.
  const [escala, setEscala] = useState(0.75);
  const [insets, setInsets] = useState(true);
  const [mapaAberto, setMapaAberto] = useState(false);

  const ap = APARELHOS.find((a) => a.id === apId) ?? APARELHOS[0];

  return (
    <div className="min-h-dvh bg-surface-page">
      <div className="mx-auto max-w-[1180px] px-6 py-10">
        <header className="mb-8">
          <p className="text-micro text-text-tertiary mb-1">
            Legalizai · prancha de review
          </p>
          <h1 className="text-h1 text-text-primary">Telas na ordem do flow</h1>
          <p className="text-body text-text-secondary mt-2 max-w-[60ch]">
            Ordem real do flow, por esteira. Arraste pra passar tela por tela.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            {/* 🆕 03/08 — visão panorâmica: todas as telas menores + conexões
                reais, estilo mapa mental. Pro programador enxergar o flow
                inteiro de uma vez, sem rolar esteira por esteira. */}
            <button
              onClick={() => setMapaAberto(true)}
              className="rounded-xl bg-action-primary px-4 py-2.5 text-caption font-bold text-text-on-brand transition-colors hover:bg-action-primary-hover"
            >
              🗺️ Ver mapa mental (todas as telas + conexões)
            </button>
            {/* Laboratório de VERSÕES de página (todas as explorações num board). */}
            <p className="text-caption">
              <a
                href="/mockup-inicio"
                className="font-semibold text-action-primary-sm underline underline-offset-4"
              >
                → Laboratório de versões (Início, Mais, e as próximas)
              </a>
            </p>
          </div>
        </header>

        {mapaAberto && <MapaMental onClose={() => setMapaAberto(false)} />}

        {/* ── Controles da prancheta ── */}
        <div className="mb-10 flex flex-wrap items-end gap-x-8 gap-y-5">
          <Campo rotulo="Aparelho">
            <Segmentado
              opcoes={APARELHOS.map((a) => ({ id: a.id, label: a.nome }))}
              valor={apId}
              onChange={setApId}
            />
          </Campo>

          <Campo rotulo="Zoom">
            <Segmentado
              opcoes={[
                { id: "1", label: "100%" },
                { id: "0.75", label: "75%" },
                { id: "0.5", label: "50%" },
              ]}
              valor={String(escala)}
              onChange={(v) => setEscala(Number(v))}
            />
          </Campo>

          {/* O A/B que prova a correção: desligar tem que fazer o conteúdo
              subir pra debaixo da Island. Se não mexer, a inset não chegou. */}
          <Campo rotulo="Safe area">
            <Segmentado
              opcoes={[
                { id: "on", label: "Respeitando" },
                { id: "off", label: "Ignorando" },
              ]}
              valor={insets ? "on" : "off"}
              onChange={(v) => setInsets(v === "on")}
            />
          </Campo>

          <button
            onClick={() => setNonce((n) => n + 1)}
            className="min-h-10 rounded-md border border-border-strong bg-surface-card
                       px-4 text-caption font-semibold text-text-secondary
                       transition-colors hover:bg-surface-alt"
          >
            Recarregar as duas
          </button>
        </div>

        <p className="text-caption text-text-tertiary mb-8 max-w-[68ch]">
          <strong className="text-text-secondary">{ap.nome}</strong> · {ap.w}×
          {ap.h}pt · inset {ap.safeTop} em cima, {ap.safeBottom} embaixo.{" "}
          {ap.porque}
        </p>

        <div className="flex flex-col gap-6">
          {GRUPOS.map((a) => (
            <Grupo
              key={a.id}
              a={a}
              ap={ap}
              escala={escala}
              insets={insets}
              nonce={nonce}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ESTEIRA POR GRUPO (ordem do flow) — telas lado a lado, scroll lateral por arrasto.
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Clicar-segurar-arrastar pra rolar a esteira na horizontal.
 * ⚠️ Limite conhecido: o <iframe> engole os eventos que COMEÇAM sobre o vidro
 * (a tela em si continua clicável, bom pra validar). Então o arrasto pega o
 * ALUMÍNIO da moldura, a legenda e o vão entre telas — sobra superfície de
 * sobra. `window` nos move/up: o arrasto continua mesmo saindo da esteira.
 */
function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let down = false;
    let startX = 0;
    let startLeft = 0;
    const onDown = (e: PointerEvent) => {
      down = true;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      el.scrollLeft = startLeft - (e.clientX - startX);
    };
    const stop = () => {
      down = false;
      el.style.cursor = "grab";
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stop);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stop);
    };
  }, []);
  return ref;
}

interface EsteiraProps {
  ap: Aparelho;
  escala: number;
  insets: boolean;
  nonce: number;
}

function Grupo({
  a,
  ...rest
}: EsteiraProps & {
  a: (typeof GRUPOS)[number];
}) {
  const dragRef = useDragScroll();
  return (
    <section className="mb-10">
      <div className="mb-5">
        <h2 className="text-h2 text-text-primary">{a.nome}</h2>
        <p className="text-caption text-text-secondary mt-1 max-w-[72ch]">
          {a.descricao}
        </p>
      </div>

      {a.telas.length === 0 ? (
        <div
          className="flex h-[180px] items-center justify-center rounded-lg border
                     border-dashed border-border-strong text-caption text-text-tertiary"
        >
          Aguardando as telas deste arquétipo (construção na próxima sessão).
        </div>
      ) : (
        // A esteira: mesmo gap-x-10 e mesma moldura de antes; overflow-x-auto +
        // arrasto. Poucas telas cabem lado a lado; da 3ª/4ª em diante, rola.
        <div
          ref={dragRef}
          className="flex cursor-grab select-none gap-x-10 overflow-x-auto pb-4"
        >
          {a.telas.map((t) => (
            <PhoneFigure key={t.rota} t={t} {...rest} />
          ))}
        </div>
      )}
    </section>
  );
}

function PhoneFigure({
  t,
  ap,
  escala,
  insets,
  nonce,
}: EsteiraProps & { t: Tela }) {
  // ── Lazy-mount ────────────────────────────────────────────────────────────
  // Cada <iframe> é um DOCUMENTO inteiro (árvore React + conexão HMR próprias).
  // Montar as ~26 (logo ~40, com o portal) de uma vez é o que estoura a RAM do
  // note. Aqui a figura só monta o Phone quando entra perto da viewport; fora de
  // vista fica um placeholder do MESMO tamanho (sem iframe), então a esteira não
  // pula e a RAM fica limitada ao que está à vista — não cresce com o nº de telas.
  //
  // rootMargin generoso ("600px 250px") pré-carrega o que está prestes a entrar,
  // pra não dar flash em rolagem normal. O clipping das esteiras horizontais já
  // é considerado pelo IntersectionObserver (root = viewport), então tela fora de
  // vista NA HORIZONTAL também desmonta.
  const wrapRef = useRef<HTMLDivElement>(null);
  const [perto, setPerto] = useState(false);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setPerto(entries[0]?.isIntersecting ?? false),
      { rootMargin: "600px 250px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure className="flex shrink-0 flex-col items-center gap-4">
      {/* Duas caixas (idêntico ao que era): a de fora reserva o rastro já
          escalado; a de dentro fica no tamanho natural e só o transform encolhe.
          A largura explícita evita a moldura espremer o vidro fora do 100%. */}
      <div
        ref={wrapRef}
        style={{
          width: (ap.w + 24) * escala,
          height: (ap.h + 24) * escala,
          minHeight: 0,
        }}
      >
        <div
          style={{
            width: ap.w + 24,
            height: ap.h + 24,
            transform: `scale(${escala})`,
            transformOrigin: "top left",
          }}
        >
          {perto ? (
            <Phone
              // ⚠️ 28/07: rota pode JÁ ter querystring (?etapa=, ?s=, ?id=).
              // `?v=` fixo dava dois `?` (etapa=triagem?v=0) — quebrava o
              // parse e a tela sempre caía no default. `&` quando já tem `?`.
              src={`${t.rota}${t.rota.includes("?") ? "&" : "?"}v=${nonce}`}
              ap={ap}
              insets={insets}
              statusClaro={t.statusClaro}
            />
          ) : (
            <PhonePlaceholder ap={ap} nome={t.nome} />
          )}
        </div>
      </div>

      <figcaption className="max-w-[300px] text-center">
        <p className="text-body font-semibold text-text-primary">{t.nome}</p>
        {/* 🆕 03/08 (Pedro): a nota some por padrão — texto grande embaixo de
            cada tela confundia o programador escaneando o flow. Continua a 1
            clique (fonte pro Pedro), só não fica exposta o tempo todo. */}
        <details className="group mt-1.5 text-left">
          <summary className="cursor-pointer list-none text-micro font-semibold text-text-tertiary marker:hidden [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block transition-transform group-open:rotate-90">▸</span>
              nota
            </span>
          </summary>
          <p className="text-caption text-text-secondary mt-1.5">{t.nota}</p>
        </details>
      </figcaption>
    </figure>
  );
}

/**
 * Placeholder do MESMO tamanho da moldura, SEM iframe. Segura o layout (a esteira
 * não pula) e a RAM (nenhum documento montado) enquanto a tela está fora de vista.
 * Mesma moldura de alumínio do Phone; o vidro é uma superfície neutra com o nome,
 * pra dar de relance qual tela vai aparecer ali quando rolar até ela.
 */
function PhonePlaceholder({ ap, nome }: { ap: Aparelho; nome: string }) {
  return (
    <div
      className="relative shrink-0 p-3"
      style={{
        width: "fit-content",
        borderRadius: ap.raio + 12,
        background:
          "linear-gradient(150deg, #3a3d44 0%, #16181d 45%, #2b2e35 100%)",
        boxShadow: "0 0 0 1px rgba(255,255,255,.06) inset",
      }}
    >
      <div
        className="relative flex items-center justify-center overflow-hidden bg-surface-alt"
        style={{ width: ap.w, height: ap.h, borderRadius: ap.raio }}
      >
        <span className="text-caption text-text-tertiary px-6 text-center">
          {nome}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOLDURA
   ═══════════════════════════════════════════════════════════════════════════ */

function Phone({
  src,
  ap,
  insets,
  statusClaro = false,
}: {
  src: string;
  ap: Aparelho;
  insets: boolean;
  statusClaro?: boolean;
}) {
  const ref = useRef<HTMLIFrameElement>(null);

  /**
   * O coração da coisa. `env()` dentro de um iframe é sempre 0: o iframe não
   * herda a safe area de ninguém, e nem saberia de qual aparelho herdar.
   * Então a moldura escreve o valor dentro do documento do iframe. Mesma
   * origem + allow-same-origin = pode.
   *
   * Via <style> no <head>, e NÃO via style inline no <html>: o <html> é
   * renderizado pelo RootLayout, então o React reconcilia os atributos dele e
   * acusa hydration mismatch a cada Fast Refresh. Um <style> que a gente
   * anexa está fora da árvore do React, que nem sabe que ele existe.
   *
   * `:root:root` dobrado de propósito: sobe a especificidade pra (0,2,0) e
   * ganha do `:root` do globals.css sem depender de quem foi injetado por
   * último no head (em dev, o HMR reinjeta CSS a qualquer momento).
   */
  const aplicarInsets = useCallback(() => {
    const doc = ref.current?.contentDocument;
    if (!doc?.head) return;
    const top = insets ? ap.safeTop : 0;
    const bottom = insets ? ap.safeBottom : 0;

    let tag = doc.getElementById("mockup-insets") as HTMLStyleElement | null;
    if (!tag) {
      tag = doc.createElement("style");
      tag.id = "mockup-insets";
      doc.head.appendChild(tag);
    }
    tag.textContent = `:root:root{--safe-top:${top}px;--safe-bottom:${bottom}px}`;
  }, [ap, insets]);

  // Dois gatilhos, e os dois importam: onLoad pega o boot e o "recarregar";
  // este effect pega a troca de aparelho, que NÃO recarrega o iframe.
  useEffect(() => {
    aplicarInsets();
  }, [aplicarInsets]);

  return (
    <div
      className="relative shrink-0 p-3"
      style={{
        // A moldura se mede pelo vidro, nunca pelo pai. `width: auto` num div
        // de bloco vira "a largura de quem me contém", e aí o alumínio encolhe
        // enquanto o vidro (fixo em ap.w) fica do tamanho que era. Aparelho
        // não é elástico: quem manda no tamanho dele é ele.
        width: "fit-content",
        borderRadius: ap.raio + 12,
        // alumínio: gradiente sutil, não chapado. É objeto físico, não UI.
        background:
          "linear-gradient(150deg, #3a3d44 0%, #16181d 45%, #2b2e35 100%)",
        // Sem sombra de projeção (pedido do Pedro 17/07). Fica só o filete
        // interno que define a borda do alumínio — é o aparelho, não sombra.
        boxShadow: "0 0 0 1px rgba(255,255,255,.06) inset",
      }}
    >
      {/* botões laterais */}
      <span className="absolute -left-[3px] top-[120px] h-8 w-[3px] rounded-l bg-[#0e1013]" />
      <span className="absolute -left-[3px] top-[168px] h-12 w-[3px] rounded-l bg-[#0e1013]" />
      <span className="absolute -right-[3px] top-[150px] h-16 w-[3px] rounded-r bg-[#0e1013]" />

      <div
        className="relative overflow-hidden bg-white"
        style={{ width: ap.w, height: ap.h, borderRadius: ap.raio }}
      >
        <iframe
          ref={ref}
          src={src}
          title={src}
          onLoad={aplicarInsets}
          className="h-full w-full border-0"
          // allow-same-origin não é conveniência: é o que deixa a moldura
          // escrever a inset no documento de dentro.
          sandbox="allow-scripts allow-same-origin allow-forms"
        />

        {/* Cromo do iOS. pointer-events-none em tudo: a tela continua clicável. */}
        <BarraDeStatus ap={ap} claro={statusClaro} />
        {ap.topo === "island" && <Island />}
        {ap.topo === "notch" && <Notch />}
        {ap.safeBottom > 0 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-[8px]">
            <div className="h-[5px] w-[139px] rounded-full bg-black/85" />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Relógio + sinal + wifi + bateria. É o "tem dados na parte de cima" — o
 * motivo de a tela não começar em y=0. Fixo em 9:41 de propósito: relógio vivo
 * é ruído numa prancheta, e 9:41 é a convenção de mockup da Apple.
 *
 * ✅ 19/07 — a variante CLARA nasceu junto com a tela que a exigia (E1 splash,
 * coral cheio). Era o que o comentário anterior deixava reservado: não se
 * constrói variante antes da tela existir (design-system.md §6), mas quando a
 * tela chega, o cromo tem que acompanhar — senão a prancheta mostra um relógio
 * preto ilegível sobre coral e o Pedro revisa um artefato que não existe.
 */
function BarraDeStatus({ ap, claro = false }: { ap: Aparelho; claro?: boolean }) {
  const h = BARRA_H[ap.topo];
  const lado = ap.topo === "barra" ? 12 : ap.w >= 430 ? 24 : 21;

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 z-10 flex
                 items-center justify-between ${claro ? "text-white" : "text-black"}`}
      style={{ height: h, paddingLeft: lado, paddingRight: lado }}
    >
      <span
        className="font-semibold tracking-[-.2px]"
        style={{ fontSize: ap.topo === "barra" ? 13 : 15 }}
      >
        9:41
      </span>

      <span className="flex items-center gap-[5px]">
        <Sinal />
        <Wifi />
        <Bateria />
      </span>
    </div>
  );
}

function Island() {
  // 125×36.7 a 11pt do topo. Idle — o print do Itaú mostra ela EXPANDIDA
  // (Live Activity tocando som), que é estado do sistema, não da nossa tela.
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center pt-[11px]">
      <div className="h-[37px] w-[125px] rounded-full bg-black" />
    </div>
  );
}

function Notch() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center">
      <div className="h-[30px] w-[209px] rounded-b-[20px] bg-black" />
    </div>
  );
}

function Sinal() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden>
      <rect x="0" y="8" width="3" height="4" rx="1" />
      <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
      <rect x="10" y="3" width="3" height="9" rx="1" />
      <rect x="15" y="0" width="3" height="12" rx="1" />
    </svg>
  );
}

function Wifi() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden>
      <path d="M8 11.5 6.1 9.2a2.9 2.9 0 0 1 3.8 0L8 11.5Z" />
      <path d="M8 5.9c1.4 0 2.7.5 3.7 1.4l1.3-1.6A7.8 7.8 0 0 0 8 3.8a7.8 7.8 0 0 0-5 1.9l1.3 1.6A5.6 5.6 0 0 1 8 5.9Z" />
      <path d="M8 .4C5.1.4 2.5 1.4.5 3.1l1.3 1.6A9.6 9.6 0 0 1 8 2.4c2.4 0 4.6.8 6.2 2.3l1.3-1.6A11.4 11.4 0 0 0 8 .4Z" />
    </svg>
  );
}

function Bateria() {
  return (
    <svg width="27" height="13" viewBox="0 0 27 13" fill="none" aria-hidden>
      <rect
        x=".7"
        y=".7"
        width="21.6"
        height="11.6"
        rx="3.6"
        stroke="currentColor"
        strokeOpacity=".35"
        strokeWidth="1"
      />
      <rect x="2.2" y="2.2" width="14" height="8.6" rx="2.1" fill="currentColor" />
      <path
        d="M24.3 4.4a2.6 2.6 0 0 1 0 4.2V4.4Z"
        fill="currentColor"
        fillOpacity=".4"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONTROLES — chrome de ferramenta, não componente de produto.
   Não promover pro DS: a regra dos 3 não bateu, e prancheta não é produto.
   ═══════════════════════════════════════════════════════════════════════════ */

function Campo({
  rotulo,
  children,
}: {
  rotulo: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-micro text-text-tertiary mb-1.5">{rotulo}</p>
      {children}
    </div>
  );
}

function Segmentado({
  opcoes,
  valor,
  onChange,
}: {
  opcoes: { id: string; label: string }[];
  valor: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex rounded-md border border-border-hairline bg-surface-card p-1">
      {opcoes.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`min-h-8 rounded-sm px-3 text-caption font-semibold transition-colors ${
            valor === o.id
              ? "bg-surface-dark text-text-on-dark"
              : "text-text-secondary hover:bg-surface-alt"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
