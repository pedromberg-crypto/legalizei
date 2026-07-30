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
 * Telas AGRUPADAS NA ORDEM DO FLOW (reorg 28/07 — antes era por arquétipo).
 * Cada grupo é uma esteira horizontal: as telas dele aparecem lado a lado e,
 * quando passam da largura, viram scroll lateral (clicar-segurar-arrastar).
 * A ordem dos GRUPOS segue `flow/flow-data.mjs` (fonte-única do mapa-flow-
 * mermaid): Entrada → N4+veredito → saídas da triagem → dinheiro (N6–N9) →
 * pausas (P1–P2) → dossiê (N10–N16) → constituição (N19–N22) →
 * empresa ativa → portal (dia-2) → fora do flow. Onde o flow bifurca (N4
 * veredito, N4 triagem), o ramo entra logo depois do nó que o gera — não no
 * fim. O flow de abertura inteiro (N1 → empresa ativa) já existe como rota;
 * falta só o flow #2 (migração).
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
    nome: "Entrada · N1–N3",
    descricao:
      "As 3 primeiras telas, antes de qualquer pergunta. ⚠️ NÃO são um arquétipo: não mapeiam em nenhum de A1–A10 do design-system.md, porque não perguntam, não julgam e não provam nada. Ficam primeiro na prancheta porque são primeiras no flow — a ordem aqui é a ordem que o lead vê.",
    telas: [
      {
        rota: "/splash",
        nome: "N1 · Splash",
        nota: "O único momento em que o coral cobre a tela toda. Logo negativa, check em wipe (mesmo gesto que o confete do N4 ecoa). 🚧 Não auto-navega: numa prancheta, tela que se substitui sozinha some.",
        statusClaro: true,
      },
      {
        rota: "/welcome",
        nome: "N2 · Welcome",
        nota: "3 teses da marca na ordem que desarma a desconfiança: gente de verdade → a dor sem contabilês → preço sem susto. Pulável desde o slide 1 (o `reta-direto` odeia onboarding que prende).",
      },
      {
        rota: "/entrada",
        nome: "N3 · Fork de 3 rotas",
        nota: 'A palavra "migrar" NÃO aparece (UX-55): é jargão e "trocar de contador" excluiria quem não tem contador, que é o melhor cliente do flow #2. Pergunta pelo fato, nunca pela operação. Login é link, não botão. ✅ 28/07: 3 rotas CONFIRMADAS na reunião (abrir/migrar/já-cliente).',
      },
      {
        rota: "/entrada?intencao=abrir",
        nome: "🆕 N3G · Gate de cidade (BH-MG)",
        nota: "✅ 28/07 (reunião Rua Satélite 9) — 2º passo do N3, mesma tela. MLP só atende Belo Horizonte/MG; trava 'abrir'/'migrar' até confirmar (login pula, já passou por isso). Deep-link ?intencao= pra ver sem clicar através do passo 1.",
      },
      {
        rota: "/saida/fora-bh",
        nome: "🆕 Saída · fora de BH",
        nota: "✅ 28/07 — nasce do gate de cidade (N3G), não da triagem do N4. Mesmo template A9 das outras saídas (barra+explica+captura+roteia). MLP em fase de testes, só BH por enquanto.",
      },
    ],
  },
  {
    id: "n4-veredito",
    nome: "N4 · Porta + veredito",
    descricao:
      "A porta do flow, numa tela só (pills, veredito, triagem, faixa). Do veredito 🟢/🟡/🔴 saem 3 desfechos — regra de ouro: nunca dar veredito com baixa confiança. O 🟢 Atende segue direto pro ENCAIXE (trava o CNAE, ainda pré-pago, porque nome/objeto/Junta dependem dele); 🟡 e 🔴 saem pelo template de saída graciosa (A9). Fonte única VereditoView.",
    telas: [
      {
        rota: "/gate",
        nome: "N4 · Gate-CNAE",
        nota: "A porta. Pills + veredito 🟢/🟡/🔴 + triagem + faixa. ✅ 28/07: ganhou o atalho 'já sei o número do meu CNAE' (troca pra modo código, mesma engine, pula descrição+pills).",
      },
      {
        rota: "/veredito/atende",
        nome: "🟢 Atende",
        nota: "Happy path. Linguagem humana ANTES do código (UX-05). CTA 'É isso mesmo' + refazer acima sem perder texto.",
      },
      {
        rota: "/encaixe",
        nome: "🆕 ENCAIXE · escolhe o CNAE",
        nota: "NOVO (reordenacao-cluster-fiscal-encaixe): logo após o 🟢, ainda pré-pago, TRAVA o CNAE (o nome/objeto/Junta dependem dele). Recomendado + alternativas. 4 regras: vem após o veredito · % é fit real (IA cruza pill+texto), não vinculante · garante o SETUP não o resultado · defesa de legitimidade inline. STAGE 1 aditivo: dissolve N5 teaser + N17 no stage 2.",
      },
      {
        rota: "/gate?etapa=triagem",
        nome: "N4 · Triagem (sócios + exterior)",
        nota: "🔎 SEPARADA 28/07 — vivia presa dentro do SPA do gate, invisível na prancheta (só dava pra ver clicando através de tudo). É o fail-fast do UX-21: sócios (máx. 2 no MLP) + exterior, perguntado logo após o ENCAIXE, ANTES do dinheiro. Bloqueado → 'Falar com o time' agora navega de verdade pra /saida/exterior ou /saida/socios (era beco sem saída até 28/07).",
      },
      {
        rota: "/gate?etapa=faixa",
        nome: "N4 · Faixa de faturamento",
        nota: "🔎 SEPARADA 28/07 — mesma amarração do SPA. Última etapa do gate; segue direto pro N6 (o N5' foi removido). Faixa guiada por padrão + 'sei o valor exato' pra quem já sabe o número (UX-51).",
      },
      {
        rota: "/veredito/waitlist",
        nome: "🟡 Waitlist (regulada)",
        nota: "Não é 'não', é 'ainda não'. UX-22: dar o enquanto isso. Captura contato, não fecha a porta. Template A9. ✅ 28/07: ganhou campo CNAE pretendido (read-only, junto do nome+contato).",
      },
      {
        rota: "/veredito/nao-atende",
        nome: "🔴 Contato especial (Mauro)",
        nota: "✅ 28/07: RELABEL — era 'Comercial'. É quem NÃO atendemos mas a Legalize Digital (escritório do Mauro) atende do jeito tradicional. Mesmo template A9. Coral nunca é erro: token de estado.",
      },
      {
        rota: "/veredito/descartado",
        nome: "🆕 🔴 Fora de escopo (descarta)",
        nota: "✅ 28/07 (reunião Rua Satélite 9) — 3ª via do veredito 🔴, antes inexistente. Ninguém atende (nem a gente, nem regulamentado, nem o Mauro) — decisão explícita de descartar. SEM formulário de captura: não tem pra onde rotear, é decline limpo dentro do VereditoView (`motivo: 'descarta'`).",
      },
    ],
  },
  {
    id: "saidas-triagem",
    nome: "Antes do dinheiro · saídas da triagem",
    descricao:
      "A triagem do N4 (sócios? exterior?) barra ANTES do dinheiro (UX-21) — quem cai aqui nunca chega a ver preço. Mesmo template de saída graciosa do veredito: educa, não pune, nenhuma saída termina em beco.",
    telas: [
      {
        rota: "/saida/exterior",
        nome: "Sócio no exterior",
        nota: 'UX-07: "a empresa existe, mas fora do Simples". A LC 123 art. 17 barra a opção pelo Simples, não a abertura — confundir as duas daria uma notícia muito pior que a verdadeira. Rota humana. 🟡 sem cotar Lucro Presumido (UX-42 depende do Mauro). 🟡 28/07: Pedro cogitou descartar esta saída dedicada — "estou pensando", NÃO travado. Conteúdo jurídico revisado, não apagar sem confirmação final.',
      },
      {
        rota: "/saida/socios",
        nome: "3 ou mais sócios",
        nota: '🟡 28/07: UX-09: "limite do PRODUTO, não da lei". Pedro cogitou juntar esta saída com a Waitlist (regulamentados) — "estou pensando", NÃO travado.',
      },
    ],
  },
  {
    id: "dinheiro",
    nome: "💰 N6–N9 · O dinheiro",
    descricao:
      "A travessia da fronteira, da faixa (N4) ao pagamento. ⚠️ 28/07: o N5' (Resumo de valor) foi REMOVIDO — a faixa segue direto pro N6, sem teaser intermediário. N6–N9 são a sequência clássica — conta, proposta, contrato, pagamento — e é onde a ORDEM carrega o argumento (N6 = A1 pergunta · N7 = A5 recap · N8 = A6 aceite · N9 = A1). A casa (shell do app) só nasce depois do N9; até aqui é tudo wizard.",
    telas: [
      {
        rota: "/conta",
        nome: "N6 · Criar conta",
        nota: "Sai com credencial funcionando. Coorte é dado puro e pulável, nunca bifurca trilha (UX-48). 🔴 O aviso do GOV.BR foi REMOVIDO em 19/07 (jargão + sem ação + contradizia \"a parte chata é com a gente\"); a UX-29 migra pro painel N21 como tarefa acionável. ✅ 28/07: FRONT-LOAD — nome/CPF/telefone/endereço (autofill CEP) migraram pra cá do N10, + etapa de código de verificação (mock).",
      },
      {
        rota: "/plano",
        nome: "N7 · A conta da abertura",
        nota: 'Fecha a conta na cara do cliente antes de pedir dinheiro (UX-33). ✂️ Enxugada 19/07: hoje × todo mês SUBIU pro topo (é a resposta), os 3 baldes desceram pra justificativa. Cortados recap, aviso do "grátis" e expander redundante: 8 blocos → 5.',
      },
      {
        rota: "/contrato",
        nome: "N8 · Aceite do contrato",
        nota: "Metade do T18: só o contrato de serviço. REVERSÍVEL, CDC art.49 limpo, então a copy não assusta. O termo irreversível desceu pro N20. Cancelamento aberto na tela: conteúdo legal nunca vai pra expander.",
      },
      {
        rota: "/pagamento",
        nome: "N9 · Pagamento",
        nota: 'Mesmo CPF, dois usos: cobrança + elegibilidade. Situação irregular NÃO é cobrada (persona `cpf-irregular`) e não é "cartão recusado". Boleto fica, fora do happy path: entra no app e adianta tudo.',
      },
    ],
  },
  {
    id: "pausas",
    nome: "⏸ Pausas · P1–P2",
    descricao:
      "Loading que EXPLICA o que está acontecendo, não spinner mudo. Espera com tarefa não é espera, é andamento — por isso as duas abrem com o que DÁ pra fazer, nunca com o que está parado. P2 nasce do boleto (branch do N9); P1 reentra no fluxo pelo N10 — por isso moram entre o dinheiro e o dossiê. (A espera de órgão do B4 não mora aqui: virou a timeline do painel N21, no UX-18.)",
    telas: [
      {
        rota: "/aguardando",
        nome: "P2 · Aguardando o boleto",
        nota: 'Existe porque o boleto ficou (decisão do Pedro). Abre com o dossiê liberado, não com bloqueio: "sem sensação de travou" é regra da spec T19. Dunning com o gancho da economia (UX-45), não lembrete seco. Persona `knife`.',
      },
      {
        rota: "/retomar",
        nome: "P1 · Retomar de onde parou",
        nota: "Retomar ≠ restaurar (UX-46): a `cida` volta sem contexto, então responde já fiz / falta / e agora — com UM passo só, porque a lista inteira recria a paralisia. UX-23: revalida a estimativa, que envelhece na virada do ano.",
      },
    ],
  },
  {
    id: "dossie",
    nome: "N10–N16 · O dossiê",
    descricao:
      "A coleta do dossiê, logada e paga. N10 é a mais longa (testa o corpo rolável); dali em diante cada tela herda o que já foi dito antes — CNAE principal já travado no N4, limite de sócios já filtrado na triagem.",
    telas: [
      {
        rota: "/dossie/socio",
        nome: "N10 · Seus dados (confirmação)",
        nota: "✅ 28/07: RECONSTRUÍDA — não coleta mais do zero. Card read-only confirma nome/CPF/telefone/endereço já vindos do N6; só pede o que faltou (RG, órgão emissor, estado civil). Casado revela regime; comunhão universal avisa o cônjuge cedo (UX-30).",
      },
      {
        rota: "/dossie/vinculo",
        nome: "N11 · Vínculo INSS",
        nota: 'Coleta o CLT que alimenta a sugestão de enquadramento (UX-24, hoje um card no N19 — o simulador dedicado N18 foi dissolvido 28/07). Teto é FOLGA, não binário. Pró-labore reenquadrado como ganho (UX-27).',
      },
      {
        rota: "/dossie/socios",
        nome: "N12 · +Sócios",
        nota: "Limite 2 (trava, não 1ª notícia — N4 já filtrou). Divisão soma 100%, default 50/50.",
      },
      {
        rota: "/dossie/empresa",
        nome: "N13 · Dados da empresa",
        nota: "Upsell endereço fiscal (oferece, não obriga; preço FAKE ~R$60). ✅ 28/07: IPTU virou OBRIGATÓRIO travado (JUCEMG exige, era opcional). Residência de sócio dinâmica pelo N4 (pula se solo). Alerta capital baixo.",
      },
      {
        rota: "/dossie/cnae-secundarios",
        nome: "N14 · CNAE secundários",
        nota: "Principal herdado do N4, travado. Sugestões com prova social. Comércio entra com aviso, nunca some silencioso.",
      },
      {
        rota: "/dossie/natureza",
        nome: "N15 · Natureza jurídica",
        nota: "Recomenda (solo→SLU), não trava. LTDA solo permitido (fato do CNPJ do Pedro). SLU+sócio = incoerência barrada.",
      },
      {
        rota: "/dossie/nome",
        nome: "N16 · Razão social",
        nota: "IA sugere a razão. Checagem de viabilidade: nome em uso → variações (evita reprova JUCEMG).",
      },
    ],
  },
  {
    id: "b4",
    nome: "N19–N22 · Constituição",
    descricao:
      "Depois do pagamento e do dossiê, a reta final: revisar, autorizar o irreversível, e acompanhar a máquina rodando. O gargalo aqui é a JUCEMG, não o cliente, então o padrão muda de 'pergunta' pra 'andamento visível' (A8). A recusa de órgão é o 4º estado do painel, não uma tela à parte.",
    telas: [
      {
        rota: "/revisar",
        nome: "N19 · Revisar",
        nota: "Recap read-only de tudo antes do irreversível. Cada bloco tem 'ajustar' que volta pro passo. Último ponto em que corrigir é de graça. Números com carimbo de estimativa; a taxa da Junta (R$ 268,51) é a única quantia dura.",
      },
      {
        rota: "/termo",
        nome: "N20 · Termo irreversível",
        nota: "A outra metade do T18 racha: aqui é o commit. 'A taxa do governo não volta' em 1 linha, sem letra miúda. As 4 camadas do cancelamento abertas na tela (conteúdo legal nunca vai pra expander). Botão único, trava até o aceite.",
      },
      {
        rota: "/painel",
        nome: "N21 · Painel (andamento)",
        nota: "O coração do B4. Timeline de 9 etapas com 4 estados (feito/girando/a fazer/recusa). Faixa de idempotência (UX-38: 'não cobramos de novo'). Previsão honesta. Zero jargão na frente, órgão como recibo.",
      },
      {
        rota: "/painel/recusa",
        nome: "REC · Órgão recusa",
        nota: "O 4º estado (UX-40): a Junta reprovou o nome apesar da prévia (persona `erro-orgao` do motor). Vermelho + 'precisa de você' + a ação, recuperação DENTRO do pipeline. Aqui o danger é legítimo: um órgão externo parou a fila mesmo. ✅ 28/07: RETRY AUTOMÁTICO — tenta as 3 opções do N16 em sequência (~1.4s cada), sem ação do cliente; só pede 3 novas sugestões se as 3 falharem. Mock sempre esgota as 3, pra provar o pior caso.",
      },
      {
        rota: "/assinatura",
        nome: "N22 · Assinatura dos sócios",
        nota: "GOV.BR + e-CAC. Dobra o check de nível (N23: bronze→upgrade inline). Consenso multi-sócio (UX-44): o 2º sócio aprova custo e assina, o dono nunca clica por ele. Procuração e-CAC explicada em 1 linha (UX-31). Mock na sociedade de 2.",
      },
    ],
  },
  {
    id: "dia2",
    nome: "Aterrissagem · dia-2",
    descricao:
      "O flow NÃO acaba no troféu. 'Empresa ativa' é ponte, não linha de chegada (mesma doutrina do Destino em lista-passos). Pro leigo que não sabe operar, esta tela vira o ✅ em 'e agora, faça isto'.",
    telas: [
      {
        rota: "/ativa",
        nome: "N24 · Empresa ativa",
        nota: "CNPJ ativo + 3 primeiros passos acionáveis (1ª nota, 1º DAS, certificado — UX-19). O loop estimativa→realidade (UX-41): daqui a uns meses a gente confere o Fator R real. WhatsApp fixo. Celebração curta: o produto COMEÇA aqui.",
      },
    ],
  },
  {
    id: "migrar",
    nome: "🆕 FLOW #2 · Migrar de contador (M1–M5)",
    descricao:
      "O blind spot mais antigo do projeto, construído em 30/07: \"metade do mercado, zero testado\" desde 15/07. A lógica já estava modelada e testada no motor (`flow-migrar.js`, M0–M5, 3 personas); faltavam as telas. 4 diferenças estruturais em relação ao flow #1: (1) NÃO tem entrevista de atividade — o CNAE já existe, a gente lê o cartão CNPJ; (2) o diagnóstico usa o número REAL dos 12 meses (CGSN 140/18 art. 26), não estimativa em cima de faixa — a dívida `promessa-quebrada` não se aplica aqui; (3) NÃO tem taxa de governo (a empresa já existe); (4) 🔴 a pausa mais perigosa do produto inteiro mora no M4 — o TTRT depende do contador ANTIGO validar, ou seja, de um terceiro que está perdendo o cliente pra nós. 💰 DECISÃO TRAVADA (Pedro, 30/07): cobra ANTES do TTRT, com promessa explícita de devolução no contrato como contrapartida.",
    telas: [
      {
        rota: "/entrada?intencao=migrar",
        nome: "M0 · A porta que era beco",
        nota: "O achado M0 do motor: o fork do N3 mandava quem escolhia 'já tenho empresa' pra um card 'essa parte ainda não existe'. Metade do mercado batia numa porta fechada. ✅ 30/07: o gate de cidade agora segue pro M1 quando a intenção é migrar. O título também conjuga certo ('onde FICA', presente — a empresa já existe).",
      },
      {
        rota: "/migrar/cnpj",
        nome: "M1 · Seu CNPJ (consulta + veredito)",
        nota: "Consulta e veredito na MESMA tela, de propósito: no flow #1 o veredito é tela própria porque depende da IA interpretar o que a pessoa escreveu (e ela pode errar); aqui o CNAE é fato registrado. Digite qualquer CNPJ de 14 dígitos → loading que explica → cartão + as 3 checagens + veredito. As 2 saídas (regulada / não atendemos) estão alcançáveis por link discreto, pra a prancheta ver sem trocar de CNPJ.",
      },
      {
        rota: "/migrar/diagnostico",
        nome: "M2 · Diagnóstico com o número REAL",
        nota: "🎯 O coração comercial do flow #2 e a maior vantagem sobre o #1: empresa com 12+ meses tem histórico, então o Fator R sai do que DE FATO aconteceu — não de faixa declarada. Cenário padrão = Fator R abaixo do corte (paga Anexo V sem precisar), com a conta aberta: receita 12m, folha 12m, o % e o corte de 28%.",
      },
      {
        rota: "/migrar/diagnostico?cenario=ja-otimo",
        nome: "M2 · ⚖️ Guarda-corpo de honestidade",
        nota: "O caminho que a maioria dos produtos não constrói: e se o contador atual JÁ acertou? A tela diz isso ('seu imposto já está certo') e troca o argumento pra SERVIÇO — guia pronta, nota em 2 toques, alguém olhando o número. Vender economia pra quem não tem seria a `promessa-quebrada` do flow #2.",
      },
      {
        rota: "/migrar/plano",
        nome: "M3 · A conta da migração",
        nota: "Sem taxa de governo — a empresa já existe, não há DAE da Junta nem TFLF. O choque de custo do N7 (~R$463 na 3ª tela, UX-54) simplesmente não acontece, e a tela diz isso explicitamente em vez de só omitir. Só a mensalidade no rodapé.",
      },
      {
        rota: "/migrar/contrato",
        nome: "M3b · Contrato (com a promessa de devolução)",
        nota: "🔴 A linha que sustenta a decisão de cobrar antes do TTRT: 'se a transferência não for concluída por algum motivo fora do seu controle, você recebe tudo de volta'. NÃO é copy de marketing — é a contrapartida obrigatória de cobrar por algo cujo destravamento depende de um terceiro hostil. Se essa linha sair, a decisão inteira precisa ser reaberta.",
      },
      {
        rota: "/pagamento?fluxo=migrar",
        nome: "M3c · Pagamento (reusa o N9)",
        nota: "Mesma tela do N9 com `?fluxo=migrar`: o total não soma taxa de governo e o aviso fala de MIGRAÇÃO ('sua migração começa hoje' / 'a gente já aciona seu contador anterior'). CPF, métodos e a faixa de idempotência são idênticos — não valia uma tela nova.",
      },
      {
        rota: "/migrar/passivo",
        nome: "M4a · 🔥 Auditoria de passivo",
        nota: "O risco EXCLUSIVO do flow #2: a empresa chega com passado. O consolidado fiscal (#14) diz que as obrigações do período antigo ficam com o contador anterior — mas o cliente não sabe disso, e a DÍVIDA é da empresa. Assumir sem auditar = herdar problema que a gente não criou e virar o culpado. Persona `migra-passivo`. 🕓 Se isso vira upsell é decisão do Mauro.",
      },
      {
        rota: "/migrar/passivo?cenario=limpo",
        nome: "M4a · Migração limpa",
        nota: "Persona `migra-limpo`: nada pendente. A tela existe mesmo sem problema porque a auditoria é a promessa ('você tem o direito de saber o que está assumindo antes da gente encostar nela'), não o alarme.",
      },
      {
        rota: "/migrar/transferencia",
        nome: "M4b · A transferência (pipeline)",
        nota: "Reusa o PainelView do N21 (parametrizado em 30/07) — mesma máquina de 4 estados, outro pipeline: encerrar com o antigo → transferir no conselho → atualizar os órgãos → liberar acesso. Os códigos oficiais (resolução CFC, Evento 232) ficam FORA da tela: são 🟡 pendência D, não ratificados em fonte primária.",
      },
      {
        rota: "/migrar/transferencia?estado=travado",
        nome: "M4b · 🔴 TTRT travado (migra-refem)",
        nota: "A pausa mais perigosa do produto inteiro. O TTRT é aberto por nós no CRC-MG e validado pelo contador ANTIGO — um concorrente que está perdendo o cliente. Todas as pausas do flow #1 esperam órgão neutro ou o próprio cliente; esta espera alguém com interesse contrário. A tela ASSUME o problema ('a gente assumiu esse problema') em vez de repassar culpa ou deixar no limbo.",
      },
      {
        rota: "/migrar/ativa",
        nome: "M5 · Empresa migrada",
        nota: "Fecha o loop do M2: a economia prometida com número REAL vira a 1ª tarefa concreta, com valor na cara ('ajustar seu pró-labore e economizar R$X/mês'). Diferença central vs. o N24: lá a promessa é estimativa que só resolve meses depois; aqui o número era real desde a 2ª tela, então pode virar ação imediata.",
      },
    ],
  },
  {
    id: "cenario-empresa-paga",
    nome: "🆕 Cenário alternativo · Legalizai paga o DAE",
    descricao:
      "✅ 28/07 (reunião Rua Satélite 9). DECISÃO TRAVADA: o cliente paga a taxa da Junta (definitiva, é o que está em todas as telas acima). Este cenário é a alternativa DOCUMENTADA — não implementada em produção — pra caso a Legalizai decida absorver o custo do DAE. Mostra só as 4 telas que MUDAM (via `?cenario=empresa-paga`); todo o resto do flow é idêntico, por isso não replica. Compare com as versões normais acima.",
    telas: [
      {
        rota: "/plano?cenario=empresa-paga",
        nome: "N7 · A conta (sem taxa)",
        nota: "A linha 'Taxa da Junta Comercial' (R$268,51) some — vira um card dizendo 'por nossa conta'. O total no rodapé cai pra só a mensalidade.",
      },
      {
        rota: "/pagamento?cenario=empresa-paga",
        nome: "N9 · Pagamento (sem taxa)",
        nota: "Total cobrado = só a mensalidade (`CUSTOS.MENSALIDADE`), sem somar o DAE_JUCEMG.",
      },
      {
        rota: "/revisar?cenario=empresa-paga",
        nome: "N19 · Revisar (sem taxa)",
        nota: "O card 'Taxa da Junta (já paga)' vira 'Taxa da Junta — por nossa conta': não tem valor pra confirmar, porque o cliente nunca pagou essa parte.",
      },
      {
        rota: "/termo?cenario=empresa-paga",
        nome: "N20 · Termo (sem taxa)",
        nota: "O argumento de irreversibilidade PERDE a base 'a taxa não volta' (o cliente nunca pagou). Item da lista, Camada 2 e o texto do checkbox de aceite mudam todos juntos.",
      },
    ],
  },
  {
    id: "portal",
    nome: "Portal interno · dia-2 (NOVO)",
    descricao:
      "A parte interna, pós-abertura — o portal que o N24 entrega. Matriz: matriz-portal-interno.md (P0–P14, só o grátis-R$195). P0–P2 aqui são as versões mais ATUAIS (puxadas de /mockup-home, 27/07): a home dia-1 de ativação, a Campeã em montagem, e o dashboard de Impostos completo. 🆕 SHELL DO PORTAL no ar: barra de abas (Início · Impostos · Notas · Pró-labore · Mais) nas telas-raiz, e seta 'voltar' no detalhe (pagar). Toque as abas dentro do iframe pra navegar. Os demais (P4–P14) reusam estes shells + a mesma engine fiscal (`lib/fiscal`, do antigo N18, dissolvido 28/07 — a experiência completa agora só vive aqui, pós-constituição).",
    telas: [
      {
        rota: "/home-dia1",
        nome: "P0 · Home de ativação (estado dia-1)",
        nota: "O 2º estado da home (empresa recém-nascida: faturamento 0, Fator R projetado → o diferencial ainda não tem o que vigiar). Vira TRILHA DE ATIVAÇÃO: hero celebra o nascimento (confetti da marca) + CNPJ pill → checklist com progresso (o certificado é o passo 'agora', gate universal) → 'sem pressa com imposto' → Aprenda + Quem cuida (reuso). Transição dia-1→regime é data-driven no real.",
      },
      {
        rota: "/home-campea",
        nome: "P1 · ★ Campeã (em montagem)",
        nota: "Seu canvas: os trechos que você valida entram aqui, na ordem, pra mover / manter / ajustar / remover. Começou com Saudação + Próximo compromisso (da A). Mande o print do próximo trecho e eu adiciono.",
      },
      {
        rota: "/impostos",
        nome: "P2 · Impostos (dashboard fiscal)",
        nota: "Onde a promessa 'o imposto você acompanha em Impostos' aterrissa. Herói = DAS do mês (valor + vence + de-onde-vem + Pagar → P3) · Vigília fiscal (diferencial) · Débito automático (toggle) · Guias anteriores com status AUTOMÁTICO (anti-líder: sem 'confirme que pagou') · Calendário fiscal → /obrigacoes. Números farol; composição = fila-Larissa.",
      },
      {
        rota: "/impostos/pagar",
        nome: "P3 · Pagar o DAS ⭐",
        nota: "O diferencial nº1: paga pelo app, o status vira sozinho. ⚠️ a EXECUÇÃO (Pix/Open Finance) é dependência aberta 🔴 — o CTA é farol. Número grande + de-onde-vem sem jargão + 'não precisa confirmar nada'.",
      },
    ],
  },
  {
    id: "fora",
    nome: "Fora do flow de abertura",
    descricao:
      "Telas SEM número N, e a ausência é a informação: a numeração N1–N25 cobre quem está abrindo empresa. Estas ficam do lado de fora. Aqui também mora o portal (pós-abertura) quando ele existir.",
    telas: [
      {
        rota: "/login",
        nome: "Login",
        nota: "A saída terminal A1: diverge no N3 (\"já sou cliente\"), sai da abertura e não reconverge. Não usa o template A9 — aquele é pra recusa, e isto é rota feliz de quem volta pra casa. Layout de 2 painéis, único no produto.",
        statusClaro: true,
      },
    ],
  },
];

export default function MockupPage() {
  const [nonce, setNonce] = useState(0);
  const [apId, setApId] = useState(APARELHOS[0].id);
  // 75% é o default porque a prancheta cresceu: com 11 grupos e o flow inteiro,
  // 100% obriga a rolar pra ver uma esteira inteira. O zoom é da MOLDURA, não do
  // conteúdo (o iframe segue renderizando em 430pt), então nada do que o Pedro
  // revisa muda de tamanho relativo — só cabe mais na mesa.
  const [escala, setEscala] = useState(0.75);
  const [insets, setInsets] = useState(true);

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
            Cada grupo é uma esteira. Clique, segure e arraste pra passar tela
            por tela. Reorganizado 28/07: os grupos seguem a ordem REAL do flow
            (a mesma de `flow/flow-data.mjs`), não mais por arquétipo — onde o
            flow bifurca (veredito, triagem), o ramo entra logo depois do nó
            que o gera. O flow inteiro está aqui, da splash à empresa ativa.
            Falta só construir o flow #2 (migração).
          </p>
          {/* Laboratório de VERSÕES de página (todas as explorações num board). */}
          <p className="mt-3 text-caption">
            <a
              href="/mockup-inicio"
              className="font-semibold text-action-primary-sm underline underline-offset-4"
            >
              → Laboratório de versões (Início, Mais, e as próximas)
            </a>
          </p>
        </header>

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
        <p className="text-caption text-text-secondary mt-2">{t.nota}</p>
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
 * ✅ 19/07 — a variante CLARA nasceu junto com a tela que a exigia (N1 splash,
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
