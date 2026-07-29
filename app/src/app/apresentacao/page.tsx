"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { EntradaView, type Intencao } from "@/components/entrada";
import {
  PerguntaView,
  AnalisandoView,
  TriagemView,
  FaixaView,
} from "@/components/gate-telas";
import { MolduraAparelho } from "@/components/lab/versao-board";
import { SaidaView, type DadosSaida } from "@/components/saida";
import { TelaHeader } from "@/components/ui/tela";
import { VereditoView, type Resultado } from "@/components/veredito";
import {
  ContaView,
  PlanoView,
  ContratoView,
  PagamentoView,
  type DadosConta,
  type Metodo,
} from "@/components/wizard-dinheiro";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * /apresentacao — DEMO PRA GESTÃO INTERNA (Legalize Digital), 28–29/07.
 * ═══════════════════════════════════════════════════════════════════════════
 * COBERTURA: N3 (fork + gate de cidade) · N4 inteiro (descrever · analisar ·
 * veredito 3 vias · triagem · faixa) · **B3, a travessia do dinheiro**
 * (N6 conta → N7 a conta da abertura → N8 contrato → N9 pagamento).
 *
 * ⚠️ O ENCAIXE saiu da demo em 29/07: depois que o veredito 🟢 ganhou os cards
 * clicáveis (UX-65), as duas telas passaram a fazer a mesma pergunta. A rota
 * `/encaixe` continua existindo em produção.
 *
 * ─── 🔗 FIDELIDADE É POR CONSTRUÇÃO, NÃO POR DISCIPLINA (29/07) ────────────
 * Todas as telas aqui são os componentes APROVADOS, importados: `EntradaView`
 * · `PerguntaView` · `AnalisandoView` · `VereditoView` · `EncaixeView` ·
 * `TriagemView` · `FaixaView`. As rotas de produção (`/entrada`, `/gate`)
 * consomem exatamente os mesmos. **Não existe cópia** — a v1 desta tela tinha
 * uma, e ela divergiu em silêncio (o N3 perdeu o Lottie, os ícones e o layout
 * dos cards em 1 dia). Se mudar na oficial, muda aqui. Sem sincronizar na mão.
 *
 * ⚠️ REGRA (Pedro, 29/07): quando eu editar uma tela aqui pra testar um achado,
 * ela **deslinka** da oficial → ganha selo visível + observação no painel, e o
 * flow de produção só muda depois que ele validar. Ver `DIVERGENCIAS`.
 *
 * Mecanismo da demo:
 *   · Split-screen: aparelho (esquerda, SEM iframe pra o estado ficar
 *     sincronizado com o painel) + explicação (direita).
 *   · Cenários: PREENCHEM o campo (pill + texto plausível) e param. Quem
 *     dispara o desfecho é o CTA de dentro do aparelho — a gestão precisa ver
 *     a CAUSA, não só o resultado.
 *   · "Simular validação": só nas pausas que dependem do usuário.
 *   · Seta externa: volta um passo (restaura o snapshot inteiro).
 *   · Dono da pausa (🟧 usuário · 🟦 nossa) — taxonomia do kanban de leads.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/* ─────────────────────────────────────────────────────────────────────────
   MOCK DA IA — estende o `mapear` do /gate com o 3º ramo 🔴.
   ⚠️ DIVERGÊNCIA CONSCIENTE (registrada em DIVERGENCIAS): no /gate de
   produção o split "Mauro atende" × "ninguém atende" ainda é mock estático
   por página. Aqui os 3 desfechos precisam sair do MESMO campo, senão a
   gestão não vê a causa. Quando o split real existir, isto some.
   ───────────────────────────────────────────────────────────────────────── */
function mapear(texto: string): Resultado {
  const t = texto.toLowerCase();
  if (/nutri|dentist|médic|medic|advog|arquitet|psicó|psico/.test(t)) {
    return {
      humano: "Atividade regulamentada",
      explica: "Sua área precisa de responsável técnico registrado no conselho.",
      cnae: "8650-0/02",
      veredito: "waitlist",
    };
  }
  if (/fazenda|gado|agropecu|planta[çc]|colheita|min[ée]rio|extra[çc][ãa]o|pesca/.test(t)) {
    return {
      humano: "Atividade fora do nosso escopo",
      explica:
        "Esse tipo de atividade não é regulamentado nem é comércio, mas também não é algo que a gente ou nosso parceiro atenda.",
      cnae: "0000-0/00",
      veredito: "nao-atende",
      motivo: "descarta",
    };
  }
  if (/loja|revend|estoque|vend[oa] produto|comérci|comerci|restaurante/.test(t)) {
    return {
      humano: "Comércio",
      explica: "Você vende produtos, não serviço — a gente só atende quem presta serviço.",
      cnae: "4713-0/02",
      veredito: "nao-atende",
      motivo: "mauro",
    };
  }
  return {
    humano: "Criação de sites e web design",
    explica: "Você entrega sites e presença digital pra outras empresas.",
    cnae: "6201-5/02",
    veredito: "atende",
    compreende: [
      "Criar e desenvolver sites, páginas e portais na internet",
      "Desenhar a interface (o visual e a navegação) desses sites",
    ],
    vizinhas: [
      { oque: "Sistema sob medida, customizável", cnae: "6202-3/00", comoSecundaria: "mesmo-imposto" },
      { oque: "Software pronto, de prateleira", cnae: "6203-1/00", comoSecundaria: "mesmo-imposto" },
      { oque: "Consultoria em tecnologia", cnae: "6204-0/00", comoSecundaria: "mesmo-imposto" },
      { oque: "Design gráfico (logo, material impresso)", cnae: "7410-2/99", comoSecundaria: "mesmo-imposto" },
    ],
    fiscal: { entradas: [6, 15.5], dependeProLabore: true },
  };
}

/**
 * CENÁRIOS DE DEMO. Os botões só PREENCHEM a tela (pill + texto); quem dispara
 * o desfecho é o "Validar minha atividade", dentro do aparelho.
 *
 * ⚠️ A pill dos cenários 🔴/🟡 é de propósito uma que a pessoa CLICARIA achando
 * que encaixa — as 17 pills são só serviço-liso, então advocacia/comércio não
 * têm pill própria. É a prova visual da regra travada em 17/07: a pill estreita
 * o universo, mas quem decide é o texto.
 */
type Cenario = {
  id: string;
  botao: string;
  /** Dot de estado. Emoji desalinha baseline e varia de tamanho por SO. */
  cor: "sucesso" | "aviso" | "perigo";
  pill: string | null;
  texto: string;
  desfecho: string;
  porque: string;
};

const COR_DOT: Record<Cenario["cor"], string> = {
  sucesso: "bg-state-success",
  aviso: "bg-state-warning",
  perigo: "bg-state-danger",
};

const CENARIOS: Cenario[] = [
  {
    id: "feliz",
    botao: "Caminho feliz",
    cor: "sucesso",
    pill: "tech",
    texto: "Desenvolvo sites, apps ou sistemas sob encomenda",
    desfecho: "🟢 Atende — segue pro fluxo pago",
    porque: "Serviço no Simples, sem conselho de classe e sem venda de produto: é exatamente o nosso ICP.",
  },
  {
    id: "waitlist",
    botao: "Regulamentada",
    cor: "aviso",
    pill: "consult",
    texto: "Sou advogado e atendo causas trabalhistas",
    desfecho: "🟡 Waitlist — entra na lista de espera",
    porque:
      "Advocacia exige registro em conselho (OAB) e responsável técnico. Repare que a pessoa clicou em 'Consultoria e gestão' achando que servia — a pill não valida, o texto é que decide.",
  },
  {
    id: "mauro",
    botao: "Comércio",
    cor: "perigo",
    pill: null,
    texto: "Tenho uma loja de roupas e revendo peças",
    desfecho: "🔴 Contato especial — vai pro escritório do Mauro",
    porque:
      "Vender produto é comércio (Anexo I), fora do MVP que é só serviço. Nenhuma das 17 pills cobre isso, então a pessoa vai direto pro texto.",
  },
  {
    id: "descarta",
    botao: "Fora de escopo",
    cor: "perigo",
    pill: null,
    texto: "Tenho uma fazenda de gado e vendo a produção",
    desfecho: "🔴 Fora de escopo — decline limpo",
    porque:
      "Atividade rural não é serviço, não é regulamentada por conselho e não é o comércio que a Legalize Digital atende. Ninguém atende, então a honestidade é declinar.",
  },
];

/**
 * 🔓 UX-62 (29/07) — a saída de cidade vira LISTA DE ESPERA classificada.
 * Hoje `/saida/fora-bh` já captura contato, mas: (a) a demo não chegava lá,
 * (b) não pergunta QUAL cidade — e uma waitlist geográfica sem a cidade não
 * diz pra onde expandir, (c) a confirmação promete ligação em 1 dia útil, que
 * nesta saída não é verdade.
 */
const SAIDA_FORA_BH: DadosSaida = {
  tag: "Outra cidade",
  titulo: "Por enquanto, só abrimos em Belo Horizonte",
  explica:
    "Estamos testando o produto com foco total numa cidade antes de expandir. Hoje só abrimos empresa em Belo Horizonte/MG.",
  origem: {
    rotulo: "Por que só BH",
    texto:
      "É a fase de testes (MLP) do produto — preferimos fazer bem para uma cidade antes de abrir para mais.",
  },
  saida:
    "Entra na lista de espera que a gente te avisa assim que abrir na sua cidade. Você é o primeiro a saber.",
  extra: {
    rotulo: "Qual a sua cidade?",
    placeholder: "Comece a digitar: Uberl…",
    obrigatorio: true,
    tipo: "municipio",
  },
  ctaEnviar: "Me avisem quando chegarem aqui",
  confirmacao: {
    titulo: "Você está na nossa lista especial",
    texto:
      "A gente te avisa assim que expandir as operações pra sua cidade. Enquanto isso, acompanha a gente por aqui: é onde a gente explica imposto sem contabilês.",
    // 🚧 Blog público e site institucional ainda não existem como rota do app
    // (o /blog de hoje é o do portal LOGADO). Ficam visíveis porque a decisão
    // de produto é essa; o destino é pendência declarada. O "Voltar ao início"
    // é injetado no JSX, porque depende do estado da demo.
    acoes: [
      // Coral (`primary` = text-lg bold, o que mantém AA sobre coral-600).
      { label: "Ler o blog", variante: "primary", pendente: true },
      { label: "Conhecer o site", variante: "primary", pendente: true },
    ],
  },
};

type Etapa =
  | "fork"
  | "cidade"
  | "fora-bh"
  | "perguntando"
  | "analisando"
  | "veredito"
  | "triagem"
  | "faixa"
  | "conta"
  | "conta-codigo"
  | "plano"
  | "contrato"
  | "pagamento"
  | "fim";

/** Estado inteiro da tela — unidade do histórico (seta de voltar). */
type Snapshot = {
  etapa: Etapa;
  intencao: Intencao | null;
  texto: string;
  categoria: string | null;
  sabeCodigo: boolean;
  resultado: Resultado | null;
  nomeV: string;
  contatoV: string;
  enviadoV: boolean;
  nomeS: string;
  contatoS: string;
  cidadeS: string;
  enviadoS: boolean;
  socios: number | null;
  exterior: boolean | null;
  faixaEsc: string | null;
  modoExato: boolean;
  exato: string;
  cenarioArmado: string | null;
};

type Dono = "usuario" | "nossa" | null;

type Momento =
  | "fork"
  | "cidade"
  | "fora-bh"
  | "fora-bh-enviado"
  | "perguntando"
  | "analisando"
  | "veredito-atende"
  | "veredito-waitlist"
  | "veredito-waitlist-enviado"
  | "veredito-mauro"
  | "veredito-mauro-enviado"
  | "veredito-descarta"
  | "triagem"
  | "faixa"
  | "conta"
  | "conta-codigo"
  | "plano"
  | "contrato"
  | "pagamento"
  | "fim";

/**
 * 🔓 DESLINKADAS — onde a demo DIVERGE da tela aprovada, e por quê.
 * Regra do Pedro (29/07): editar aqui não altera o oficial; vira observação
 * visível, ele valida, e só então a mudança sobe pro flow de produção.
 */
const DIVERGENCIAS: Partial<Record<Momento, { id: string; oque: string; status: string }[]>> = {
  fork: [
    {
      id: "UX-63",
      oque: "Card de destaque usa o coral-600 do botão primário (era coral-700). ⚠️ Custa contraste: branco sobre coral-600 = 4,04:1, e o título tem 16px bold (não conta como texto grande) — AA exige 4,5:1. No coral-700 era 5,64:1.",
      status: "🔴 decisão do Pedro (AA × consistência de cor)",
    },
  ],
  "veredito-atende": [
    {
      id: "UX-65",
      oque: "Ganhou 'Outras opções compatíveis' (mesmo componente do ENCAIXE) + % de compatibilidade no card de cima. Os cards são clicáveis: tocar promove a opção pro topo e devolve a antiga pra lista. A tela aprovada só mostra o recomendado + a gaveta 'e se eu faço mais de uma coisa?'.",
      status: "🔴 pendente no VereditoView",
    },
    {
      id: "⚠️ decidir",
      oque: "A troca feita AQUI não chega no ENCAIXE (tela seguinte), que remonta a lista a partir do CNAE original — promover 'Design gráfico' aqui e seguir mostra 'Criação de sites' como recomendado lá. Ou o veredito escolhe e o encaixe confirma, ou o encaixe escolhe e aqui é só leitura. Hoje as duas escolhem.",
      status: "🔴 decisão de produto (Pedro)",
    },
  ],
  "veredito-waitlist-enviado": [
    {
      id: "UX-64",
      oque: "Ganhou saídas: 'Ler o blog', 'Conhecer o site' e 'Voltar ao início'. A tela aprovada só oferece 'Falar com um contador agora' — quem não quer falar com ninguém agora fica sem pra onde ir.",
      status: "🔴 pendente no VereditoView (blog/site ainda sem rota)",
    },
  ],
  "veredito-mauro-enviado": [
    {
      id: "UX-64",
      oque: "Mesmas saídas da waitlist. Na tela aprovada este estado não tem CTA nenhum — é beco puro.",
      status: "🔴 pendente no VereditoView (blog/site ainda sem rota)",
    },
  ],
  conta: [
    {
      id: "UX-71",
      oque: "N6 recriado com o layout do LOGIN: painel escuro que sangra (marca centralizada + saudação) + folha clara sobreposta com os campos (ícone à esquerda, placeholder como rótulo). A tela aprovada é o formulário clássico com rótulo em cima. Diferenças necessárias: a folha ROLA (são 7 campos, não 2) e o CTA foi pro rodapé fixo. Campos passaram a ser 1 por linha (CPF/telefone lado a lado cortavam o valor mascarado) e o endereço do CEP não trunca mais.",
      status: "🔴 pendente no ContaView (prop layout='painel')",
    },
    {
      id: "UX-72",
      oque: "Cadastro por Google/Apple agora CONECTA de verdade: nome e e-mail vêm do provedor, a tela mostra um card 'conectado como…' (com opção de trocar) e pede só o que falta — CPF, telefone e endereço, que nenhum provedor fornece. Senha some (conta social não tem).",
      status: "🔴 pendente no ContaView",
    },
    {
      id: "UX-73",
      oque: "A pergunta 'é a primeira empresa?' virou OBRIGATÓRIA (inclusive no cadastro social). ⚠️ Contraria a decisão UX-48, que a definiu como 'dado puro, pulável sem custo' — lá o racional era não cobrar fricção por algo que não muda nada no fluxo.",
      status: "🔴 decisão do Pedro × UX-48",
    },
  ],
  plano: [
    {
      id: "UX-74",
      oque: "N7 reconstruído como OFERTA: âncora verdadeira (escritório tradicional cobra honorário, a gente não) · o plano vira produto, com card escuro e os 7 itens inclusos em linguagem de dono · FAQ que desarma as 4 objeções reais (pegadinha, fidelidade, desistência, reajuste) · prova dos 22 anos do escritório. A tela aprovada é honesta mas não vende: dois cards e uma linha de taxa.",
      status: "🔴 pendente no PlanoView (prop layout='oferta')",
    },
    {
      id: "⚠️ preço",
      oque: "A mensalidade continua PLACEHOLDER declarado (marcado FAKE no lib/fiscal) e a tela avisa. Nenhum desconto, contagem regressiva ou vaga limitada foi inventado: escassez falsa em contabilidade queima a confiança que os 22 anos constroem.",
      status: "🟡 preço final deferido ao Mauro",
    },
    {
      id: "🟡 número",
      oque: "Card comparativo novo: mostra o honorário de abertura numa contabilidade tradicional (R$ 1.621, o salário mínimo vigente) contra o nosso R$ 0, deixando explícito que as taxas de governo são as mesmas nos dois casos. A régua é referência de mercado, não média estatística, e a copy diz isso.",
      status: "🟡 valor definido pelo Pedro (29/07); confirmar com o Mauro",
    },
  ],
  "fora-bh": [
    {
      id: "UX-62",
      oque: "Virou lista de espera classificada: etiqueta '📍 Outra cidade' + campo obrigatório 'qual a sua cidade?' + confirmação que promete só avisar (a oficial promete ligação em 1 dia útil, que aqui não se cumpre).",
      status: "🔴 pendente em /saida/fora-bh",
    },
  ],
  perguntando: [
    {
      id: "UX-60",
      oque: "Seta de voltar no header, pra sair do N4 e revisar o fork do N3. A tela aprovada não tem — quem erra a escolha do N3 fica preso.",
      status: "🔴 pendente no /gate de produção",
    },
  ],
  triagem: [
    {
      id: "UX-60",
      oque: "Seta de voltar no header (a tela aprovada não tem).",
      status: "🔴 pendente",
    },
    {
      id: "UX-67",
      oque: "Pergunta do exterior virou condicional: some no 'Só eu', e só aparece depois de escolher o nº de sócios. O título se dirige a quem existe — 2 sócios: 'Seu sócio mora fora do Brasil?'; 3+: 'Algum sócio mora fora do Brasil?'. ⚠️ Ressalva fiscal: o gate do N3 confirma onde fica a EMPRESA (BH), não onde a pessoa MORA — sócio único domiciliado fora derruba o Simples igual (LC 123 art.17). Alternativa sem furo pro caso solo: 'Você mora fora do Brasil?' em vez de remover.",
      status: "🔴 decisão do Pedro (risco de falso-negativo antes do pagamento)",
    },
  ],
  faixa: [
    {
      id: "UX-60",
      oque: "Seta de voltar no header (a tela aprovada não tem).",
      status: "🔴 pendente",
    },
    {
      id: "UX-68",
      oque: "'Sei o valor exato' revela o campo ABAIXO das faixas, em vez de trocar a tela inteira. Tocar numa faixa limpa o valor digitado (senão o número continuaria mandando e a seleção mentiria).",
      status: "🔴 pendente no FaixaView",
    },
  ],
  "veredito-descarta": [
    {
      id: "UX-64",
      oque: "Decline limpo ganhou saídas ('Ler o blog', 'Conhecer o site', 'Voltar ao início'). A tela aprovada não tem CTA nenhum: explica e para, sem oferecer pra onde ir.",
      status: "🔴 pendente no VereditoView (blog/site ainda sem rota)",
    },
    {
      id: "demo",
      oque: "O 3º desfecho 🔴 ('ninguém atende') sai do mesmo campo que os outros. No /gate aprovado o split 'Mauro atende' × 'ninguém atende' ainda é mock estático por página.",
      status: "🟡 depende da lista de CNAEs (fila Larissa)",
    },
  ],
};

/**
 * Nome da tela EXATAMENTE como aparece no `/mockup` — pra o Pedro apontar
 * alteração usando o mesmo vocabulário nos dois lugares.
 */
const NOME_MOCKUP: Record<Momento, string> = {
  fork: "N3 · Fork de 3 rotas",
  cidade: "🆕 N3G · Gate de cidade (BH-MG)",
  "fora-bh": "🆕 Saída · fora de BH",
  "fora-bh-enviado": "🆕 Saída · fora de BH (na lista)",
  perguntando: "N4 · Gate-CNAE",
  analisando: "N4 · Gate-CNAE (analisando)",
  "veredito-atende": "🟢 Atende",
  "veredito-waitlist": "🟡 Waitlist (regulada)",
  "veredito-waitlist-enviado": "🟡 Waitlist · confirmada",
  "veredito-mauro": "🔴 Contato especial (Mauro atende)",
  "veredito-mauro-enviado": "🔴 Contato especial · confirmado",
  "veredito-descarta": "🔴 Fora de escopo (descarta)",
  triagem: "N4 · Triagem (sócios + exterior)",
  faixa: "N4 · Faixa de faturamento",
  conta: "N6 · Criar conta",
  "conta-codigo": "N6 · Confirmar acesso (código)",
  plano: "N7 · A conta da abertura",
  contrato: "N8 · Aceite do contrato",
  pagamento: "N9 · Pagamento",
  fim: "— fim do piloto —",
};

const DESCRICOES: Record<Momento, { dono: Dono; faz: string; interfere: string; porque: string }> = {
  fork: {
    dono: "usuario",
    faz: "Divide o produto em dois caminhos: quem ainda não tem CNPJ vai pro fluxo de abertura; quem já tem vai pro fluxo de migração. Quem já é cliente entra na conta.",
    interfere: "Define QUAL processo será executado. Abrir empresa e migrar contabilidade são operações completamente diferentes na Junta e na Receita.",
    porque:
      "A copy pergunta pelo FATO ('já tenho empresa'), nunca pela operação ('migrar'). 'Migrar' é jargão e excluiria quem não tem contador nenhum — que é justamente o caso mais fácil pra gente, porque não existe distrato nem transferência de responsabilidade técnica.",
  },
  cidade: {
    dono: "usuario",
    faz: "Confirma que a empresa será aberta em Belo Horizonte antes de deixar seguir. Fora de BH, cai numa saída dedicada.",
    interfere:
      "O município define a Prefeitura que emite inscrição municipal e NFS-e, e a Junta é estadual (JUCEMG). Todo o processo é regionalizado.",
    porque:
      "Decisão da reunião de 28/07: o MLP atende só BH/MG. Perguntar aqui evita levar alguém de outra cidade por todo o fluxo pra barrar no fim. Quem já é cliente pula esse passo.",
  },
  "fora-bh": {
    dono: "usuario",
    faz: "Quem não abre em BH não é jogado fora: entra numa lista de espera classificada, dizendo qual é a cidade dele.",
    interfere:
      "Não abre CNPJ agora. Vira um lead geográfico — e o conjunto dessas respostas é o que diz pra qual cidade vale expandir primeiro.",
    porque:
      "Nome e contato pra avisar; a CIDADE porque sem ela a lista é só um monte de e-mail, não um mapa de demanda. A confirmação promete só o que a gente cumpre: avisar quando abrir, sem prometer ligação em 1 dia útil.",
  },
  "fora-bh-enviado": {
    dono: "nossa",
    faz: "Confirma a entrada na lista e devolve caminhos: blog, site e voltar ao início.",
    interfere:
      "Encerra o fluxo de abertura, mas não encerra o relacionamento — a pessoa segue no radar até a gente abrir na cidade dela.",
    porque:
      "Tela terminal não pode ser beco. Quem não pôde comprar hoje continua sendo público: se sai sem lugar pra ir, a gente perde o lead duas vezes (não abriu e não acompanha).",
  },
  perguntando: {
    dono: "usuario",
    faz: "A pessoa descreve o que faz (texto livre) ou já entra com o número do CNAE, se souber. As pills só afunilam o universo — quem decide é a IA cruzando com o texto.",
    interfere: "O CNAE encontrado aqui é o que trava nome empresarial, objeto social e o registro na Junta Comercial mais à frente. Errar aqui é retrabalho lá na frente.",
    porque: "Pill sozinha não vale como resposta (decisão travada 17/07) — o texto livre é o dado que a IA de fato usa pra mapear o código certo.",
  },
  analisando: {
    dono: "nossa",
    faz: "Nosso backend/IA cruza a descrição com a base de CNAEs de serviço já mapeados e decide o veredito.",
    interfere: "É aqui que se decide se a pessoa segue pro fluxo pago (🟢), entra na waitlist (🟡) ou é encaminhada/descartada (🔴).",
    porque: "A copy explica o que está rolando (não é spinner mudo) — evita a sensação de tela travada.",
  },
  "veredito-atende": {
    dono: "usuario",
    faz: "Confirma o enquadramento encontrado em linguagem humana, com o CNAE como recibo discreto.",
    interfere: "Esse é o CNAE que vai literalmente pra Junta e pra Receita — nome da empresa e objeto social nascem dele.",
    porque: "Nenhum dado novo é pedido aqui — é confirmação. A gaveta 'e se eu faço mais de uma coisa?' é o guarda-corpo contra o falso-🟢.",
  },
  "veredito-waitlist": {
    dono: "usuario",
    faz: "Explica honestamente que a atividade é regulamentada (ainda não atendemos) e oferece entrar na lista de espera.",
    interfere: "Não abre CNPJ agora. Gera um lead qualificado pro nosso time, já com o enquadramento encontrado anotado.",
    porque: "Nome + contato é o mínimo pra retomar sem pedir tudo de novo depois.",
  },
  "veredito-waitlist-enviado": {
    dono: "nossa",
    faz: "Confirma que o contato foi registrado na lista de espera.",
    interfere: "A partir daqui é nosso time que avisa quando abrirmos pra essa atividade.",
    porque: "Fecha o loop — sem essa tela o lead 'sumiria' sem confirmação.",
  },
  "veredito-mauro": {
    dono: "usuario",
    faz: "Explica que o app não atende esse caso (ex. comércio), mas a Legalize Digital atende do jeito tradicional.",
    interfere: "Não abre CNPJ pelo app. Gera lead direto pro escritório do Mauro.",
    porque: "Nome + contato é o mínimo pro escritório retomar já com contexto.",
  },
  "veredito-mauro-enviado": {
    dono: "nossa",
    faz: "Confirma que o contato foi enviado.",
    interfere: "A Legalize Digital recebe o lead e chama no WhatsApp.",
    porque: "Mesmo motivo do waitlist: fechar o loop, sem beco silencioso.",
  },
  "veredito-descarta": {
    dono: null,
    faz: "Decline limpo: explica que ninguém atende esse caso (nem a gente, nem regulado, nem o Mauro).",
    interfere: "Encerra o funil aqui — sem fingir uma rota que não existe.",
    porque: "Honestidade > beco sem saída silencioso (doutrina das telas de saída, A9).",
  },
  triagem: {
    dono: "usuario",
    faz: "Duas perguntas rápidas: quantos sócios, e se alguém mora fora do Brasil.",
    interfere: "Mais de 2 sócios ou sócio no exterior barra o MLP/Simples — descobrir isso aqui evita cobrar de quem não pode abrir.",
    porque: "Fail-fast (UX-21): com a cobrança logo depois, o que mata elegibilidade tem que ser perguntado ANTES do dinheiro.",
  },
  faixa: {
    dono: "usuario",
    faz: "Pergunta quanto a pessoa espera faturar por mês — faixa guiada ou valor exato.",
    interfere: "Alimenta o cálculo de enquadramento e Fator R nas telas seguintes (a conta da abertura e o pró-labore).",
    porque: "Base necessária pra estimar corretamente o que a empresa vai pagar — sem isso o resto do fluxo chuta.",
  },
  conta: {
    dono: "usuario",
    faz: "Cria o acesso e já coleta os dados pessoais: nome, CPF, telefone e endereço. Antes isso só era pedido depois do pagamento.",
    interfere:
      "São exatamente os dados que a Junta exige pra constituir: quem é o sócio, com que documento e onde ele mora. Coletar aqui adianta o dossiê inteiro.",
    porque:
      "Front-load decidido em 28/07: captar num lugar só, com validação por código logo na entrada. Assim o N10 vira confirmação, não recoleta. Criar conta é grátis; o dinheiro só aparece na tela seguinte.",
  },
  "conta-codigo": {
    dono: "usuario",
    faz: "Valida e-mail e telefone com um código de 6 dígitos antes de deixar seguir.",
    interfere:
      "Contato validado é o que garante que a gente consegue avisar sobre exigência de órgão depois. Um e-mail errado aqui quebra a comunicação no meio do processo.",
    porque:
      "É a contrapartida do front-load: se a gente vai confiar nesses dados pro dossiê, eles precisam ser de alguém alcançável.",
  },
  plano: {
    dono: "usuario",
    faz: "Fecha a conta na cara do cliente: o que é grátis, o que é taxa de governo e o que é mensalidade.",
    interfere:
      "Não interfere na constituição em si, mas é o que separa nossa receita do repasse ao Estado. A taxa da Junta passa direto pra JUCEMG.",
    porque:
      "Os 3 baldes não podem se misturar: 'abertura grátis' significa honorário zero, NUNCA governo zero. Esconder o repasse dentro do preço viraria pegadinha lá na frente. Por isso o total do dia fica no rodapé, conferível, mas quem é herói na tela é o 'Grátis'.",
  },
  contrato: {
    dono: "usuario",
    faz: "Aceite do contrato de serviço, com resumo humano em 4 linhas acima do jurídico.",
    interfere:
      "É aqui que a pessoa vira cliente. Ainda NÃO é o ponto sem volta: nada foi executado, e o CDC art. 49 (7 dias) vale limpo.",
    porque:
      "O termo irreversível é outra tela (N20), depois do dossiê. Separar os dois atos é o que mantém cada um juridicamente sólido. Conteúdo legal nunca fica atrás de expander.",
  },
  pagamento: {
    dono: "usuario",
    faz: "Última tela do wizard. Pede o CPF e o método de pagamento; o método define QUANDO a abertura começa.",
    interfere:
      "O CPF faz dois trabalhos: cobrança e elegibilidade. Situação irregular na Receita significa que a pessoa não pode abrir empresa, então a gente não cobra. Depois daqui nasce a casa (o portal).",
    porque:
      "Um campo, dois usos, sem gastar uma tela a mais. E a copy precisa distinguir 'CPF suspenso' de 'cartão recusado': trocar de cartão não resolve o primeiro.",
  },
  fim: {
    dono: null,
    faz: "Fim da travessia do dinheiro. No fluxo real, o pagamento aprovado abre a casa (o portal) e começa o dossiê: N10 em diante.",
    interfere: "É a partir daqui que a constituição de fato roda: dossiê, viabilidade na JUCEMG, registro, CNPJ e Simples.",
    porque: "Próxima fase da demo: B4 (o dossiê + o painel de acompanhamento), onde aparecem as pausas de ÓRGÃO — as que não dependem nem do cliente nem da gente.",
  },
};

const DONO_LABEL: Record<Exclude<Dono, null>, { label: string; cor: string }> = {
  usuario: { label: "🟧 Pausa: usuário", cor: "bg-state-warning-tint text-state-warning-text" },
  nossa: { label: "🟦 Pausa: nossa", cor: "bg-state-info-tint text-state-info-text" },
};

export default function ApresentacaoPage() {
  const [etapa, setEtapa] = useState<Etapa>("fork");
  const [intencao, setIntencao] = useState<Intencao | null>(null);
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);
  const [sabeCodigo, setSabeCodigo] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const [nomeV, setNomeV] = useState("");
  const [contatoV, setContatoV] = useState("");
  const [enviadoV, setEnviadoV] = useState(false);

  // Captura da saída de cidade (separada da do veredito: são telas distintas
  // e preencher uma não pode contaminar a outra).
  const [nomeS, setNomeS] = useState("");
  const [contatoS, setContatoS] = useState("");
  const [cidadeS, setCidadeS] = useState("");
  const [enviadoS, setEnviadoS] = useState(false);

  const [socios, setSocios] = useState<number | null>(null);
  const [exterior, setExterior] = useState<boolean | null>(null);

  const [faixaEsc, setFaixaEsc] = useState<string | null>(null);
  const [modoExato, setModoExato] = useState(false);
  const [exato, setExato] = useState("");

  // Qual cenário está armado no campo (só pra o painel antecipar o desfecho
  // antes de validar). null = campo livre / digitado na mão.
  const [cenarioArmado, setCenarioArmado] = useState<string | null>(null);

  // Nota técnica da tela deslinkada: escondida por padrão (não é conteúdo da
  // apresentação). `visivel` = hover no selo; `fixada` = clique, pra conseguir
  // ler com calma sem manter o mouse parado.
  const [notaVisivel, setNotaVisivel] = useState(false);
  const [notaFixada, setNotaFixada] = useState(false);

  // ── B3 · a travessia do dinheiro (N6→N9) ───────────────────────────────
  const [dadosConta, setDadosConta] = useState<DadosConta>({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    senha: "",
    cep: "",
    numero: "",
    coorte: null,
    codigo: "",
  });
  const [aceite, setAceite] = useState(false);
  const [cpfPag, setCpfPag] = useState("");
  const [metodo, setMetodo] = useState<Metodo>("cartao");

  /**
   * HISTÓRICO — pilha de snapshots pra a seta de voltar.
   * Guardar só a `etapa` não bastaria: voltar do veredito pro campo tem que
   * devolver o texto/pill que causaram aquele veredito (é o ponto da demo).
   */
  const [historico, setHistorico] = useState<Snapshot[]>([]);
  const anterior = useRef<Snapshot | null>(null);
  const momentoAnterior = useRef<string | null>(null);

  const snapshot: Snapshot = {
    etapa,
    intencao,
    texto,
    categoria,
    sabeCodigo,
    resultado,
    nomeV,
    contatoV,
    enviadoV,
    nomeS,
    contatoS,
    cidadeS,
    enviadoS,
    socios,
    exterior,
    faixaEsc,
    modoExato,
    exato,
    cenarioArmado,
  };

  function restaurar(s: Snapshot) {
    setEtapa(s.etapa);
    setIntencao(s.intencao);
    setTexto(s.texto);
    setCategoria(s.categoria);
    setSabeCodigo(s.sabeCodigo);
    setResultado(s.resultado);
    setNomeV(s.nomeV);
    setContatoV(s.contatoV);
    setEnviadoV(s.enviadoV);
    setNomeS(s.nomeS);
    setContatoS(s.contatoS);
    setCidadeS(s.cidadeS);
    setEnviadoS(s.enviadoS);
    setSocios(s.socios);
    setExterior(s.exterior);
    setFaixaEsc(s.faixaEsc);
    setModoExato(s.modoExato);
    setExato(s.exato);
    setCenarioArmado(s.cenarioArmado);
  }

  /**
   * VOLTAR — desempilha e restaura. É a ÚNICA forma de andar pra trás na demo.
   *
   * 🐛 FIX 29/07: antes cada botão de volta (seta externa · "Voltar" do N3 ·
   * seta do N4 · "refazer" do veredito) fazia `setEtapa(...)` por conta
   * própria. Como o histórico empilha toda troca de momento, a VOLTA também
   * era empilhada — e a seta externa passava a levar pra FRENTE. Era esse o
   * "vai e volta confuso". Agora tudo que anda pra trás passa por aqui.
   *
   * `fallback` cobre o caso de pilha vazia (ex: alguém já está no fork).
   */
  function voltar(fallback?: () => void) {
    const passo = historico[historico.length - 1];
    if (!passo) {
      fallback?.();
      return;
    }
    setHistorico((h) => h.slice(0, -1));
    restaurar(passo);
    // Zera as refs pra o effect não reempilhar o que acabamos de desempilhar.
    momentoAnterior.current = null;
    anterior.current = null;
  }

  function reiniciar() {
    setEtapa("fork");
    setIntencao(null);
    setTexto("");
    setCategoria(null);
    setSabeCodigo(false);
    setResultado(null);
    setCenarioArmado(null);
    setNomeV("");
    setContatoV("");
    setEnviadoV(false);
    setNomeS("");
    setContatoS("");
    setCidadeS("");
    setEnviadoS(false);
    setSocios(null);
    setExterior(null);
    setFaixaEsc(null);
    setModoExato(false);
    setExato("");
    setDadosConta({
      nome: "",
      cpf: "",
      telefone: "",
      email: "",
      senha: "",
      cep: "",
      numero: "",
      coorte: null,
      codigo: "",
    });
    setAceite(false);
    setCpfPag("");
    setMetodo("cartao");
    setHistorico([]);
    momentoAnterior.current = null;
    anterior.current = null;
  }

  function validar() {
    setEtapa("analisando");
    setTimeout(() => {
      setResultado(mapear(texto));
      setEnviadoV(false);
      setEtapa("veredito");
    }, 1400);
  }

  /** ARMA o cenário na tela (pill + texto), SEM navegar. */
  function armarCenario(c: Cenario) {
    setSabeCodigo(false);
    setCategoria(c.pill);
    setTexto(c.texto);
    setCenarioArmado(c.id);
    setResultado(null);
    setEnviadoV(false);
  }

  function preencherEtapa() {
    if (etapa === "triagem") {
      setSocios(1);
      setExterior(false);
    } else if (etapa === "faixa") {
      setModoExato(false);
      setFaixaEsc("20-30k");
    } else if (etapa === "fora-bh") {
      setNomeS("Ana Beatriz Ramos");
      setContatoS("ana.beatriz@email.com");
      // Cidade canônica do IBGE — o mesmo formato que o autocomplete devolve.
      setCidadeS("Uberlândia - Minas Gerais");
    } else if (etapa === "conta") {
      // Mesma pessoa do resto da demo: o dado precisa ser coeso até o fim.
      setDadosConta({
        nome: "Ana Beatriz Ramos",
        cpf: "123.456.789-00",
        telefone: "(31) 98888-7766",
        email: "ana.beatriz@email.com",
        senha: "legalizai2026",
        cep: "30140-060",
        numero: "1000",
        coorte: "primeira",
        codigo: "",
      });
    } else if (etapa === "conta-codigo") {
      setDadosConta((p) => ({ ...p, codigo: "482913" }));
    } else if (etapa === "contrato") {
      setAceite(true);
    } else if (etapa === "pagamento") {
      setCpfPag("123.456.789-00");
      setMetodo("cartao");
    }
  }

  function simularValidacao() {
    setNomeV("Ana Beatriz Ramos");
    setContatoV("ana.beatriz@email.com");
    setEnviadoV(true);
  }

  const momento: Momento =
    etapa === "fork"
      ? "fork"
      : etapa === "cidade"
        ? "cidade"
        : etapa === "fora-bh"
          ? enviadoS
            ? "fora-bh-enviado"
            : "fora-bh"
          : etapa === "perguntando"
          ? "perguntando"
          : etapa === "analisando"
            ? "analisando"
              : etapa === "triagem"
                ? "triagem"
                : etapa === "faixa"
                  ? "faixa"
                  : etapa === "conta"
                    ? "conta"
                    : etapa === "conta-codigo"
                      ? "conta-codigo"
                      : etapa === "plano"
                        ? "plano"
                        : etapa === "contrato"
                          ? "contrato"
                          : etapa === "pagamento"
                            ? "pagamento"
                            : etapa === "fim"
                    ? "fim"
                    : resultado
                      ? resultado.veredito === "atende"
                        ? "veredito-atende"
                        : resultado.veredito === "waitlist"
                          ? enviadoV
                            ? "veredito-waitlist-enviado"
                            : "veredito-waitlist"
                          : resultado.motivo === "descarta"
                            ? "veredito-descarta"
                            : enviadoV
                              ? "veredito-mauro-enviado"
                              : "veredito-mauro"
                      : "perguntando";

  /**
   * Empilha o snapshot do momento ANTERIOR sempre que o momento muda.
   * "analisando" fica FORA: é transitório (1,4s), voltar pra um loading seria
   * um beco. `voltar()` zera as refs pra não reempilhar o que desempilhou.
   */
  useEffect(() => {
    if (momentoAnterior.current === momento) return;
    const passo = anterior.current;
    if (passo && passo.etapa !== "analisando") {
      setHistorico((h) => [...h, passo]);
    }
    momentoAnterior.current = momento;
    // Cada tela nova começa camuflada: a nota técnica não pode ficar aberta
    // de uma tela pra outra no meio da apresentação.
    setNotaFixada(false);
    setNotaVisivel(false);
  }, [momento]);

  // Sem deps de propósito: `anterior` precisa acompanhar TODO render, senão o
  // snapshot empilhado acima perderia o que foi digitado desde a última troca
  // de momento. Declarado DEPOIS do effect acima pra ele ler o valor antigo.
  useEffect(() => {
    anterior.current = snapshot;
  });

  const desc = DESCRICOES[momento];
  const divergencias = DIVERGENCIAS[momento];
  const mostraCenarios = etapa === "perguntando";
  const naEntrada = etapa === "fork" || etapa === "cidade";
  const naSaidaCidade = etapa === "fora-bh";
  const naTravessia =
    etapa === "conta" ||
    etapa === "conta-codigo" ||
    etapa === "plano" ||
    etapa === "contrato" ||
    etapa === "pagamento";
  const mostraPreencher =
    etapa === "triagem" ||
    etapa === "faixa" ||
    (etapa === "fora-bh" && !enviadoS) ||
    naTravessia;
  const mostraSimularValidacao = momento === "veredito-waitlist" || momento === "veredito-mauro";
  const cenario = CENARIOS.find((c) => c.id === cenarioArmado) ?? null;

  return (
    <div className="min-h-dvh bg-surface-page">
      <div className="mx-auto max-w-[1280px] px-8 py-8">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-micro font-semibold tracking-wide text-text-tertiary">
              LEGALIZAI · APRESENTAÇÃO PRA GESTÃO
            </p>
            <h1 className="text-h1 text-text-primary">Onboarding — como funciona por dentro</h1>
            <p className="text-body text-text-secondary mt-1 max-w-[70ch]">
              Do fork (N3) ao pagamento (N9). As telas são as aprovadas (mesmo componente
              do app), não maquete. Escolha um cenário pra preencher o campo e avance
              pelos botões de dentro do aparelho.
            </p>
          </div>
          <button
            onClick={reiniciar}
            className="shrink-0 rounded-full border border-border-hairline bg-surface-card px-4 py-2 text-caption font-semibold text-text-secondary transition-colors hover:border-border-strong"
          >
            ↺ Reiniciar demo
          </button>
        </header>

        {/* Grid de 2 LINHAS (não 2 colunas com padding chutado): linha 1 são os
            controles da demo, linha 2 é aparelho | explicação. Assim o título
            da direita alinha sozinho com o topo do celular, e continua alinhado
            se os controles mudarem de altura. */}
        <div className="grid grid-cols-[minmax(0,436px)_1fr] gap-x-10">
          {/* ── linha 1 · col 1: vazia. Quem define a altura desta linha são os
              controles na col 2 — é isso que mantém o topo do aparelho
              alinhado com o topo da explicação, sem padding chutado. ── */}
          <div />

          {/* ── linha 1 · col 2: controles da demo, alinhados ao bloco de
              explicação. Ficam aqui (e não sobre o aparelho) porque são
              ferramenta de quem apresenta, não parte do produto. ── */}
          <div className="mb-4 min-h-[104px]">
            {mostraCenarios && (
              <>
                <p className="mb-2 text-micro font-semibold tracking-wide text-text-tertiary">
                  PREENCHER CENÁRIO
                </p>
                {/* Uma linha só: a coluna é larga o bastante pros 4. Dot de cor
                    no lugar de emoji — emoji varia de tamanho por SO e
                    desalinha a baseline do texto. */}
                <div className="flex flex-wrap items-center gap-2">
                  {CENARIOS.map((c) => {
                    const on = cenarioArmado === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => armarCenario(c)}
                        aria-pressed={on}
                        className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-caption font-semibold transition-colors ${
                          on
                            ? "border-action-primary bg-surface-tint-brand text-text-primary"
                            : "border-border-hairline bg-surface-card text-text-secondary hover:border-border-strong"
                        }`}
                      >
                        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${COR_DOT[c.cor]}`} />
                        {c.botao}
                      </button>
                    );
                  })}
                </div>
                {/* Altura reservada (h-5) mesmo vazia: sem isso o conteúdo
                    inteiro pula quando a dica aparece. */}
                <p className="mt-2 h-5 text-micro text-text-tertiary">
                  {cenarioArmado
                    ? "Campo preenchido. Agora toque em “Validar minha atividade”."
                    : ""}
                </p>
              </>
            )}
            <div className="flex flex-wrap items-center gap-2">
              {mostraPreencher && (
                <button
                  onClick={preencherEtapa}
                  className="rounded-xl bg-action-primary px-4 py-2.5 text-caption font-bold text-text-on-brand transition-colors hover:bg-action-primary-hover"
                >
                  ✨ Preencher automático
                </button>
              )}
              {mostraSimularValidacao && (
                <button
                  onClick={simularValidacao}
                  className="rounded-xl bg-surface-dark px-4 py-2.5 text-caption font-bold text-text-on-dark transition-colors hover:opacity-90"
                >
                  ✅ Simular validação
                </button>
              )}
            </div>
          </div>

          {/* ── linha 2 · col 1: seta + aparelho ──
              Seta FORA do aparelho: é controle da apresentação, não do
              produto (o wizard real não tem saída lateral). */}
          <div>
            <div className="flex items-start gap-3">
              <button
                onClick={() => voltar()}
                disabled={historico.length === 0}
                aria-label="Voltar ao passo anterior"
                title="Voltar ao passo anterior"
                className="mt-[300px] flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-hairline bg-surface-card text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-border-hairline"
              >
                <SetaVoltarDemo />
              </button>

              {/* Mesmo aparelho dos outros mockups (15 Pro Max, insets 59/34) —
                  sem iframe: aqui o painel da direita precisa reagir ao estado. */}
              <div className="origin-top-left" style={{ transform: "scale(.82)", width: 478 * 0.82, height: 980 * 0.82 }}>
                <MolduraAparelho>
                  {/* `.app-page` usa height:100dvh (viewport). Dentro da moldura
                      o teto é a altura DELA, então sobrescreve pra 100%. */}
                  <div className="app-page" style={{ height: "100%" }}>
                    {naEntrada ? (
                      // EntradaView traz o próprio header+main (é a tela inteira).
                      <EntradaView
                        intencao={intencao}
                        onIntencao={(i) => {
                          // `null` = o "Voltar" interno da tela (passo 2 → 1).
                          // Vai pela MESMA porta de volta que a seta externa.
                          if (i === null) {
                            voltar(() => {
                              setIntencao(null);
                              setEtapa("fork");
                            });
                            return;
                          }
                          setIntencao(i);
                          setEtapa("cidade");
                        }}
                        onSeguir={() => setEtapa("perguntando")}
                        onForaBh={() => setEtapa("fora-bh")}
                        onLogin={() => {}}
                        destaqueCoral600
                      />
                    ) : naTravessia ? (
                      /* B3 · N6→N9. Como o EntradaView, estas telas trazem o
                         próprio header+main — por isso ficam fora do bloco
                         genérico abaixo. */
                      <>
                        {(etapa === "conta" || etapa === "conta-codigo") && (
                          <ContaView
                            d={dadosConta}
                            set={(k, v) => setDadosConta((p) => ({ ...p, [k]: v }))}
                            etapa={etapa === "conta" ? "form" : "codigo"}
                            onCriarConta={() => setEtapa("conta-codigo")}
                            onConfirmar={() => setEtapa("plano")}
                            onVoltar={() => voltar(() => setEtapa("faixa"))}
                            layout="painel"
                          />
                        )}
                        {etapa === "plano" && (
                          <PlanoView
                            onSeguir={() => setEtapa("contrato")}
                            onVoltar={() => voltar(() => setEtapa("conta"))}
                            layout="oferta"
                          />
                        )}
                        {etapa === "contrato" && (
                          <ContratoView
                            aceito={aceite}
                            setAceito={setAceite}
                            onSeguir={() => setEtapa("pagamento")}
                            onVoltar={() => voltar(() => setEtapa("plano"))}
                          />
                        )}
                        {etapa === "pagamento" && (
                          <PagamentoView
                            cpf={cpfPag}
                            setCpf={setCpfPag}
                            metodo={metodo}
                            setMetodo={setMetodo}
                            onPagar={() => setEtapa("fim")}
                            onVoltar={() => voltar(() => setEtapa("contrato"))}
                          />
                        )}
                      </>
                    ) : naSaidaCidade ? (
                      <>
                        <TelaHeader meta="Sobre a sua cidade" />
                        <main className="app-main">
                          <SaidaView
                            // Composto por spread (não por chamada de função):
                            // `reiniciar` toca refs, e passá-lo a uma função
                            // executada no render acionaria a regra de refs.
                            d={{
                              ...SAIDA_FORA_BH,
                              confirmacao: {
                                ...SAIDA_FORA_BH.confirmacao!,
                                acoes: [
                                  ...(SAIDA_FORA_BH.confirmacao?.acoes ?? []),
                                  {
                                    label: "Voltar ao início",
                                    variante: "ghost",
                                    onClick: reiniciar,
                                  },
                                ],
                              },
                            }}
                            captura={{
                              nome: nomeS,
                              setNome: setNomeS,
                              contato: contatoS,
                              setContato: setContatoS,
                              extra: cidadeS,
                              setExtra: setCidadeS,
                              enviado: enviadoS,
                              setEnviado: setEnviadoS,
                            }}
                          />
                        </main>
                      </>
                    ) : (
                      <>
                        {/* 🔓 UX-60 aplicado AQUI (deslinkado): o N4 aprovado
                            não tem volta pro N3. */}
                        {/* 🔓 UX-60 — nenhuma tela do wizard tem voltar. Aqui
                            todas as do piloto ganham (menos a de loading, que
                            não é passo). */}
                        <header className="pt-6 pb-4 shrink-0 flex items-center gap-1.5">
                          {etapa !== "analisando" && (
                            <button
                              onClick={() =>
                                voltar(() => {
                                  setIntencao("abrir");
                                  setEtapa("cidade");
                                })
                              }
                              aria-label="Voltar"
                              className="-ml-1.5 flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-alt"
                            >
                              <SetaVoltarDemo />
                            </button>
                          )}
                          <p className="text-micro text-text-tertiary">Legalizai</p>
                        </header>

                        <main className="app-main">
                          {etapa === "perguntando" && (
                            <PerguntaView
                              texto={texto}
                              setTexto={setTexto}
                              categoria={categoria}
                              setCategoria={setCategoria}
                              sabeCodigo={sabeCodigo}
                              setSabeCodigo={setSabeCodigo}
                              onValidar={validar}
                            />
                          )}
                          {etapa === "analisando" && <AnalisandoView />}
                          {etapa === "veredito" && resultado && (
                            <VereditoView
                              r={resultado}
                              onRefazer={() => voltar(() => setEtapa("perguntando"))}
                              onSeguir={() => setEtapa("triagem")}
                              captura={{
                                nome: nomeV,
                                setNome: setNomeV,
                                contato: contatoV,
                                setContato: setContatoV,
                                enviado: enviadoV,
                                setEnviado: setEnviadoV,
                              }}
                              // 🔓 UX-65: alternativas de CNAE no veredito 🟢.
                              mostrarAlternativas
                              // 🔓 UX-64: mesmas saídas da lista de espera de
                              // cidade. Blog/site ainda não têm rota.
                              acoesConfirmacao={[
                                { label: "Ler o blog", variante: "primary" },
                                { label: "Conhecer o site", variante: "primary" },
                                {
                                  label: "Voltar ao início",
                                  variante: "ghost",
                                  onClick: reiniciar,
                                },
                              ]}
                            />
                          )}
                          {etapa === "triagem" && (
                            <TriagemView
                              socios={socios}
                              setSocios={setSocios}
                              exterior={exterior}
                              setExterior={setExterior}
                              onSeguir={() => setEtapa("faixa")}
                              onSaida={() => {}}
                              exteriorSoComSocio
                            />
                          )}
                          {etapa === "faixa" && (
                            <FaixaView
                              faixa={faixaEsc}
                              setFaixa={setFaixaEsc}
                              modoExato={modoExato}
                              setModoExato={setModoExato}
                              exato={exato}
                              setExato={setExato}
                              onSeguir={() => setEtapa("conta")}
                              autoFocus={false}
                              exatoInline
                            />
                          )}

                          {etapa === "fim" && <FimPiloto onReiniciar={reiniciar} />}
                        </main>
                      </>
                    )}
                  </div>
                </MolduraAparelho>
              </div>
            </div>

            {/* Selo de LINKADA × DESLINKADA — anotação técnica do Pedro, não
                da apresentação. Fica embaixo do aparelho, discreto e apagado,
                e só revela o detalhe no hover: durante a demo pra gestão ele
                não pode competir com a tela. */}
            <div
              className="mt-5 flex justify-center pl-14"
              onMouseEnter={() => setNotaVisivel(true)}
              onMouseLeave={() => setNotaVisivel(false)}
            >
              {divergencias ? (
                <button
                  type="button"
                  onClick={() => setNotaFixada((v) => !v)}
                  title="Detalhe da alteração (passe o mouse ou clique pra fixar)"
                  className="inline-flex items-center gap-1.5 rounded-full bg-state-warning-tint px-3 py-1 text-micro font-semibold text-state-warning-text"
                >
                  🔓 Deslinkada · {divergencias.map((d) => d.id).join(" · ")}
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-alt px-3 py-1 text-micro font-semibold text-text-tertiary">
                  🔗 Tela aprovada
                </span>
              )}
            </div>
          </div>

          {/* ── linha 2 · col 2: explicação, sincronizada com o momento ── */}
          <div>
            {/* Título + chip do dono da pausa na MESMA linha: assim o título
                fica na altura exata do topo do aparelho (com o chip acima, ele
                descia ~30px). Título = o MESMO nome do /mockup, pra o Pedro
                pedir alteração usando o mesmo vocabulário nos dois lugares. */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <h2 className="text-h1 text-text-primary">{NOME_MOCKUP[momento]}</h2>
              {desc.dono && (
                <span className={`shrink-0 rounded-full px-3 py-1 text-micro font-bold ${DONO_LABEL[desc.dono].cor}`}>
                  {DONO_LABEL[desc.dono].label}
                </span>
              )}
              {desc.dono === null && momento !== "fim" && (
                <span className="shrink-0 rounded-full bg-surface-alt px-3 py-1 text-micro font-bold text-text-tertiary">
                  ⏹ Fim de linha (sem próxima ação)
                </span>
              )}
            </div>

            <div className="flex flex-col gap-5">
              {/* Cenário armado no campo, ainda não validado: antecipa PRA ONDE
                  vai e POR QUÊ. Some assim que o veredito sai. */}
              {mostraCenarios && cenario && (
                <div className="rounded-2xl border border-border-strong bg-surface-alt p-5">
                  <p className="text-caption font-bold text-text-primary mb-2">
                    🧪 Cenário no campo → {cenario.desfecho}
                  </p>
                  <p className="text-body text-text-secondary">{cenario.porque}</p>
                </div>
              )}

              {/* Observações da tela deslinkada — anotação técnica, escondida
                  por padrão. Aparece no hover (ou clique) do selo embaixo do
                  aparelho: durante a demo pra gestão isto não pode estar na
                  tela competindo com o conteúdo. */}
              {divergencias && (notaVisivel || notaFixada) && (
                <div
                  onMouseEnter={() => setNotaVisivel(true)}
                  onMouseLeave={() => setNotaVisivel(false)}
                  className="rounded-2xl border border-state-warning bg-state-warning-tint p-5"
                >
                  <p className="text-caption font-bold text-state-warning-text mb-2">
                    🔓 Esta tela foi editada aqui (ainda não está no app)
                  </p>
                  <ul className="flex flex-col gap-2">
                    {divergencias.map((d) => (
                      <li key={d.id} className="text-body text-text-secondary">
                        <strong className="text-text-primary">{d.id}</strong> — {d.oque}{" "}
                        <span className="text-caption text-text-tertiary">({d.status})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Bloco titulo="🎯 O que essa tela faz">{desc.faz}</Bloco>
              <Bloco titulo="🏗️ O que interfere na constituição da empresa">{desc.interfere}</Bloco>
              <Bloco titulo="📋 Por que pede esses dados">{desc.porque}</Bloco>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SetaVoltarDemo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function Bloco({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border-hairline bg-surface-card p-5">
      <p className="text-caption font-bold text-text-primary mb-2">{titulo}</p>
      <p className="text-body text-text-secondary">{children}</p>
    </div>
  );
}

function FimPiloto({ onReiniciar }: { onReiniciar: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
      <p className="text-h2 text-text-primary">Fim do piloto</p>
      <p className="text-body text-text-secondary max-w-[26ch]">
        O flow real segue pro N6 (Criar conta). Essa parte entra na próxima fase.
      </p>
      <Button onClick={onReiniciar}>Recomeçar demo</Button>
    </div>
  );
}
