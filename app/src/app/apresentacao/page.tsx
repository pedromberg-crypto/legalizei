"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { EntradaView, type Intencao } from "@/components/entrada";
import {
  DadosPessoaisView,
  EnderecoCategoriaView,
  type DadosLead,
} from "@/components/entrada-lead";
import { SplashView } from "@/components/splash";
import { WelcomeView } from "@/components/welcome";
import {
  PerguntaView,
  AnalisandoView,
  TriagemView,
  FaixaView,
  MeiOuMeView,
} from "@/components/gate-telas";
import { MolduraAparelho } from "@/components/lab/versao-board";
import { SaidaView } from "@/components/saida";
import { TelaHeader } from "@/components/ui/tela";
import { VereditoView, type Resultado } from "@/components/veredito";
import {
  SocioView,
  VinculoView,
  SociosView,
  EmpresaView,
  CnaeSecundariosView,
  NaturezaView,
  NomeView,
} from "@/components/wizard-dossie";
import {
  RevisarView,
  TermoView,
  AssinaturaView,
  HomeAtivacaoView,
  RetomarCpfView,
  RetomarView,
  AguardandoView,
  CertificadoGateView,
} from "@/components/wizard-cauda";
import { PainelView } from "@/components/painel";
import {
  MigrarCnpjView,
  MigrarDiagnosticoView,
  MigrarDadosBaseView,
  MigrarGovView,
  MigrarPlanoView,
  MigrarContratoView,
  MigrarContadorAntigoView,
  MigrarTransferenciaView,
  MigrarAtivaView,
  EMPRESA_MIGRAR,
} from "@/components/wizard-migrar";
import {
  ContaView,
  PlanoView,
  PagamentoView,
  type DadosConta,
  type Metodo,
} from "@/components/wizard-dinheiro";
import { mapear } from "@/lib/mock-veredito";
import {
  DADOS_SAIDA_FORA_BH,
  DADOS_SAIDA_EXTERIOR,
  DADOS_SAIDA_SOCIOS,
  DADOS_SAIDA_SOCIO_PJ,
  DADOS_SAIDA_MEI_OUTRA_EMPRESA,
  DADOS_SAIDA_MEI_SERVIDOR,
  DADOS_SAIDA_CNPJ_INAPTO,
} from "@/lib/dados-saida";
// 🆕 28/08 — as 3 telas exclusivas do ramo MEI (fidelidade por construção: a
// demo renderiza os MESMOS componentes que as rotas de produção).
import {
  ImpedimentoView,
  OcupacaoView,
  ProximosPassosView,
  type CampoCola,
} from "@/components/mei-telas";
import { IMPEDIMENTOS } from "@/lib/mei";
import { GRUPOS } from "@/lib/telas-flow";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * /apresentacao — DEMO PRA GESTÃO INTERNA (Legalize Digital), 28–29/07.
 * ═══════════════════════════════════════════════════════════════════════════
 * COBERTURA: E1–E2 (splash + welcome, 🆕 11/08) · E3 (fork + gate de cidade E4) ·
 * E5 inteiro (descrever · analisar · veredito 3 vias · triagem · faixa) ·
 * **a travessia do dinheiro** (E6 conta → E7 a conta da abertura → E8 contrato →
 * E9 pagamento).
 *
 * ⚠️ O ENCAIXE saiu da demo em 29/07: depois que o veredito 🟢 ganhou os cards
 * clicáveis (UX-65), as duas telas passaram a fazer a mesma pergunta. 🆕 31/07:
 * confirmado pelo Pedro e REMOVIDO de produção também — `/encaixe`,
 * `EncaixeView` e a etapa "encaixe" do `/gate` não existem mais.
 *
 * ─── 🔗 FIDELIDADE É POR CONSTRUÇÃO, NÃO POR DISCIPLINA (29/07) ────────────
 * Todas as telas aqui são os componentes APROVADOS, importados: `EntradaView`
 * · `PerguntaView` · `AnalisandoView` · `VereditoView` ·
 * `TriagemView` · `FaixaView`. As rotas de produção (`/entrada`, `/gate`)
 * consomem exatamente os mesmos. **Não existe cópia** — a v1 desta tela tinha
 * uma, e ela divergiu em silêncio (o E3 perdeu o Lottie, os ícones e o layout
 * dos cards em 1 dia). Se mudar na oficial, muda aqui. Sem sincronizar na mão.
 *
 * ⚠️ REGRA (Pedro, 29/07): quando eu editar uma tela aqui pra testar um achado,
 * ela **deslinka** da oficial → ganha selo visível + observação no painel, e o
 * flow de produção só muda depois que ele validar. Ver `DIVERGENCIAS`.
 *
 * 🆕 06/08 — a fidelidade por construção tinha 2 furos: o mock da IA
 * (`mapear`) e o conteúdo das 3 saídas (fora-BH/exterior/3+sócios) eram
 * CÓPIA local, porque as rotas reais guardam esse dado solto dentro do
 * próprio `page.tsx`, sem exportar. Os dois viraram fonte única —
 * `@/lib/mock-veredito` e `@/lib/dados-saida`, importados aqui E nas rotas
 * reais — depois de 2 travessões terem sobrevivido só na cópia da demo. Os
 * RÓTULOS do painel (`NOME_MOCKUP`) também deixaram de ser digitados à mão:
 * vêm de `@/lib/telas-flow` (o mesmo `GRUPOS` que o `/mockup` usa) — mudou o
 * nome de uma tela lá, muda aqui também, sem tocar neste arquivo.
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
 *   · 🆕 11/08 — E1 (splash) não tem CTA nem em produção (`SplashView` não
 *     auto-navega, por decisão registrada no próprio componente) e nada liga
 *     a rota `/splash → /welcome` hoje. Pra avançar aqui, a tela inteira vira
 *     área de toque — affordance SÓ da demo, igual a seta externa. Não é
 *     divergência da TELA (o componente é o mesmo, intocado).
 * ═══════════════════════════════════════════════════════════════════════════
 */

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
 * 🆕 03/08 — GAP DE COBERTURA fechado: E5.4/E5.5 (saídas da triagem) existiam
 * em `/mockup` mas não eram alcançáveis na demo (TriagemView tinha
 * `onSaida={() => {}}`, um no-op).
 *
 * O CONTEÚDO das 3 (`DADOS_SAIDA_FORA_BH`/`_EXTERIOR`/`_SOCIOS`) vem de
 * `@/lib/dados-saida` — mesma fonte das rotas reais (`/saida/fora-bh`,
 * `/saida/exterior`, `/saida/socios`). As `acoes` da confirmação da
 * fora-BH ficam de fora do conteúdo compartilhado de propósito: blog/site
 * ainda não têm rota (🔴 pendente), então só a demo mostra esses 2 CTAs
 * "pendente" — a rota real não promete link morto.
 */
const ACOES_PENDENTES_FORA_BH = [
  // Coral (`primary` = text-lg bold, o que mantém AA sobre coral-600).
  { label: "Ler o blog", variante: "primary" as const, pendente: true },
  { label: "Conhecer o site", variante: "primary" as const, pendente: true },
];

type Etapa =
  | "splash"
  | "welcome"
  | "fork"
  // 🆕 27/08 — E3.1 e E3.3, telas NOVAS da captura de lead. Substituem a
  // "cidade" (E4, gate autodeclarado), que foi removida do flow.
  | "dados"
  // 🆕 29/08 — E3.2 (MEI×ME) faltava na demo: o caminho abrir pulava direto
  // de "dados" pra "endereco", achado do Pedro testando no iPhone.
  | "mei-ou-me"
  | "endereco"
  | "fora-bh"
  | "perguntando"
  | "analisando"
  | "veredito"
  | "triagem"
  | "faixa"
  // 🆕 03/08 — E5.4/E5.5, saídas da triagem (gap fechado, ver DADOS_SAIDA_EXTERIOR/
  // DADOS_SAIDA_SOCIOS). Alcançáveis só pela interação real (escolher exterior/3+
  // sócios na TriagemView), sem pill de atalho — mesmo padrão de veredito.
  | "saida-exterior"
  | "saida-socios"
  | "saida-socio-pj"
  // 🆕 28/08 — RAMO MEI. As 3 telas exclusivas + as 2 saídas de impedimento.
  // Nascem de `pesquisa/abertura-mei/abertura-mei-processo.md`: não existe API
  // nem procuração que permita abrir MEI por terceiro, então o ramo é
  // concierge (a gente prepara, o titular finaliza no gov.br).
  | "m-impedimento"
  | "m-ocupacao"
  | "m-proximos-passos"
  | "m-certificado"
  | "saida-mei-outra-empresa"
  | "saida-mei-servidor"
  | "conta"
  | "conta-codigo"
  | "plano"
  | "pagamento"
  // ─── CONSTITUIÇÃO · o dossiê (29/07) ─────────────────────────────────────
  // Depois do dinheiro, a coleta. Estas 7 só puderam entrar na demo junto com
  // a extração pra `components/wizard-dossie.tsx`: antes eram `page.tsx` com
  // estado próprio, e o que não é componente não renderiza dentro do aparelho.
  | "socio"
  | "vinculo"
  | "socios"
  | "empresa"
  | "cnae-secundarios"
  | "natureza"
  | "nome"
  // ─── APROVAÇÃO (A1–A5) + as 2 pausas de pagamento (C0.1, E9.1) — 29/07 ──
  // C0.1/E9.1 NÃO são sequenciais: são pausas de pagamento (`E9--boleto-->E9.1`,
  // `C0.1--reentrada-->C1`), alcançáveis por pill própria, não pelo botão
  // Continuar de nenhuma tela do meio.
  | "revisar"
  | "termo"
  | "painel"
  | "painel-recusa"
  | "assinatura"
  | "ativacao"
  // ─── MIGRAR DE CONTADOR (30/07) — decimal de Entrada ─────────────────────
  // Ramo decimal, não continuação: sai do fork E4 e reencontra o tronco só no
  // pagamento (E9). Por isso tem sequência própria, não entra em ETAPAS_CAUDA.
  | "m-cnpj"
  | "m-diagnostico"
  | "m-cnpj-inapto"
  | "m-plano"
  | "m-contrato"
  | "m-pagamento"
  | "m-contador"
  | "m-dados"
  | "m-socios"
  | "m-gov"
  | "m-transferencia"
  | "m-travado"
  | "m-ativa"
  | "retomar-cpf"
  | "retomar"
  | "aguardando"
  | "certificado"
  | "fim";

/**
 * As 7 etapas do dossiê, na ordem. Fonte única do roteamento da demo: o
 * `momento`, o shell de tela cheia e a sequência de "Continuar" leem daqui, em
 * vez de repetir a lista em três `||` diferentes.
 */
// 🔄 28/08 (pedido do Pedro) — C5 saiu de entre C4/C6, virou a 1ª do dossiê,
// logo após o veredito da C0. `depoisDoDossie`/`antesDoDossie` já são
// genéricas (leem por índice), então só a ordem aqui muda o roteamento real.
const ETAPAS_DOSSIE = [
  "cnae-secundarios",
  "socio",
  "vinculo",
  "socios",
  "empresa",
  "natureza",
  "nome",
] as const satisfies readonly Etapa[];

type EtapaDossie = (typeof ETAPAS_DOSSIE)[number];

function noDossie(e: Etapa): e is EtapaDossie {
  return (ETAPAS_DOSSIE as readonly string[]).includes(e);
}

/**
 * A etapa seguinte à do dossiê. A última (`nome`) segue pro A1 (revisar) —
 * era `?? "fim"` até a cauda entrar na demo; agora "fim" é depois do A5.
 */
function depoisDoDossie(e: EtapaDossie): Etapa {
  const i = ETAPAS_DOSSIE.indexOf(e);
  return ETAPAS_DOSSIE[i + 1] ?? "revisar";
}

/**
 * A etapa anterior. 🔄 27/08 — a primeira (`socio`) volta pro **veredito**, não
 * mais pro pagamento: descrever a atividade e achar o CNAE atravessaram o
 * pagamento e agora são a C0, primeira tela do dossiê.
 */
function antesDoDossie(e: EtapaDossie): Etapa {
  const i = ETAPAS_DOSSIE.indexOf(e);
  return i === 0 ? "veredito" : ETAPAS_DOSSIE[i - 1];
}

/**
 * As etapas da Aprovação (A1–A5) — só as que ligam num shell de tela cheia
 * igual à Entrada/Constituição. C0.1/E9.1 (retomar, aguardando) NÃO entram
 * aqui: são pausas isoladas, sem posição fixa nesta sequência (ver comentário
 * no `type Etapa`).
 */
const ETAPAS_CAUDA = [
  "revisar",
  "termo",
  "painel",
  "painel-recusa",
  // 🆕 26/08 (reunião Rua Satélite 36, item 7) — A3.2, entre painel e
  // assinatura. Certificado agora é validado ANTES de assinar (a procuração
  // que sai junto da assinatura exige o certificado já pronto).
  "certificado",
  "assinatura",
  "ativacao",
] as const satisfies readonly Etapa[];

type EtapaCauda = (typeof ETAPAS_CAUDA)[number];

function naCauda(e: Etapa): e is EtapaCauda {
  return (ETAPAS_CAUDA as readonly string[]).includes(e);
}

/**
 * MIGRAR DE CONTADOR — na ordem real (30/07), decimal de Entrada (E4→E9).
 *
 * ⚠️ É um ramo decimal, não continuação do caminho abrir: sai do fork E4 e
 * reencontra o tronco só no pagamento (E9). Por isso tem sequência própria —
 * `depoisDoMigrar` e `antesDoMigrar` andam só aqui dentro, e o "antes" do 1º
 * passo devolve pro gate de cidade (`cidade`), que é de onde ele de fato veio.
 *
 * `m-travado` fica FORA da sequência: é estado de exceção do `m-transferencia`
 * (persona `migra-refem`), alcançável por pill própria, não por "Continuar".
 *
 * 🔴 04/08 (3ª rodada) — `m-diagnostico` (M2, certificado) SAIU da sequência
 * quando ainda era só "Fator R pra ME cortado". ⚠️ 06/08: a tela MUDOU DE
 * ESCOPO (virou "tem certificado digital?", ver `MigrarDiagnosticoView`) e
 * hoje roda pros 2 regimes no produto real — mas a demo NÃO foi atualizada
 * pra incluir de volta. Gap conhecido, não corrigido nesta rodada (é sobre
 * M2; o que entrou agora é o passo NOVO logo depois do pagamento, M3c).
 * 🔴 05/08 — M1b (`/migrar/tributario`) foi DESCARTADA de vez (duplicava a
 * E3.2, que já autodeclara o regime antes disso). Não é mais gap: a etapa
 * simplesmente não existe no produto.
 * 🔴 06/08 — M4a (`/migrar/passivo`, auditoria de passivo) também foi
 * RETIRADA: a gente não busca pendência do contador anterior antes de
 * assumir.
 * 🆕 06/08 — `m-contador` (M3c, "seu contador atual") entra entre pagamento e
 * transferência: dados pro TTRT, novo achado da reunião Rua Satélite 19. No
 * produto real só ME passa por aqui (MEI nunca tem TTRT) — a demo, que já
 * não bifurca esta esteira por regime (`MigrarPlanoView`/`MigrarContratoView`
 * aqui embaixo também não recebem `mei`), segue o mesmo nível de
 * simplificação: mostra pra todo mundo que entra pelo Migrar.
 * 🆕 24/08 (reunião Leonan 19/08, achado tardio — Pedro re-lendo a reunião)
 * — TRÊS etapas novas entre `m-contador` e `m-transferencia`: `m-dados`
 * (E9.2b, CPF/RG/estado civil que o cartão CNPJ não traz), `m-socios` (E9.2c,
 * MESMA tela do C3 reusada com `contexto="migrar"`) e `m-gov` (E9.2d, GOV.BR
 * + procuração, reusa `CodigoGovView` do A4 com `soProcuracao`). A reunião
 * foi explícita sobre a ORDEM: "durante essa migração, eu preciso que [...]
 * ele preencha TODOS os dados base de uma constituição [...] a gente vem
 * para a parte de estamos encerrando lá, transferindo a responsabilidade" —
 * dados base (incl. sociedade) e procuração vêm DEPOIS do contador atual e
 * ANTES do pipeline de transferência, não antes do pagamento (1ª tentativa
 * desta rodada colocou errado, logo depois de `m-cnpj` — corrigido).
 */
const ETAPAS_MIGRAR = [
  "m-cnpj",
  // 🆕 26/08 — E4.3 (`MigrarDiagnosticoView`, "tem certificado?") faltava na
  // sequência da demo desde 06/08 (a tela mudou de escopo — de "Fator R
  // cortado" pra "tem certificado?" — mas ninguém trouxe de volta pra cá).
  // GRUPOS/telas-flow.ts já documentava; a demo é que ficou defasada.
  "m-diagnostico",
  "m-plano",
  "m-contrato",
  "m-pagamento",
  "m-contador",
  "m-dados",
  "m-socios",
  "m-gov",
  "m-transferencia",
  "m-ativa",
] as const satisfies readonly Etapa[];

type EtapaMigrar = (typeof ETAPAS_MIGRAR)[number];

function noMigrar(e: Etapa): e is EtapaMigrar | "m-travado" {
  return (ETAPAS_MIGRAR as readonly string[]).includes(e) || e === "m-travado";
}
/**
 * 🆕 26/08 — "m-cnpj-inapto" é saída terminal do M1 (`onSaidaInapto`), FORA
 * de `noMigrar` de propósito: ela precisa do shell próprio de saída (header
 * "Sobre a situação do CNPJ" + `SaidaView`), não o shell genérico de
 * travessia que `noMigrar` (via `naTravessia`) dá pras telas sequenciais do
 * Migrar. Mesmo padrão de "saida-exterior"/"saida-socios"/"saida-socio-pj",
 * que também ficam fora dos guards de sequência.
 */

function depoisDoMigrar(e: EtapaMigrar): Etapa {
  const i = ETAPAS_MIGRAR.indexOf(e);
  return ETAPAS_MIGRAR[i + 1] ?? "fim";
}

function antesDoMigrar(e: EtapaMigrar): Etapa {
  const i = ETAPAS_MIGRAR.indexOf(e);
  // 🔄 27/08 — o 1º passo do Migrar volta pro E3.1 (`dados`), que é de onde
  // ele vem agora: o gate de cidade (E4) foi removido do flow.
  return i === 0 ? "dados" : ETAPAS_MIGRAR[i - 1];
}

/** C0.1 (retomar) e E9.1 (aguardando) — pausas de pagamento, fora da sequência. */
const ETAPAS_ESPERA = ["retomar-cpf", "retomar", "aguardando"] as const satisfies readonly Etapa[];

type EtapaEspera = (typeof ETAPAS_ESPERA)[number];

function naEspera(e: Etapa): e is EtapaEspera {
  return (ETAPAS_ESPERA as readonly string[]).includes(e);
}

/** Estado inteiro da tela — unidade do histórico (seta de voltar). */
type Snapshot = {
  etapa: Etapa;
  intencao: Intencao | null;
  texto: string;
  categoria: string | null;
  sabeCodigo: boolean;
  resultado: Resultado | null;
  enviadoV: boolean;
  cidadeS: string;
  enviadoS: boolean;
  socios: number | null;
  exterior: boolean | null;
  socioTipo: "cpf" | "cnpj" | null;
  faixaEsc: string | null;
  modoExato: boolean;
  exato: string;
  cenarioArmado: string | null;
};

type Dono = "usuario" | "nossa" | null;

/**
 * 🆕 28/08 — a "cola" do M-S na demo: os campos do formulário oficial do MEI,
 * na ORDEM em que aparecem no Portal do Empreendedor (não na ordem do nosso
 * dossiê — quem está com o Portal aberto na outra aba segue de cima pra baixo).
 *
 * Nome, CPF e data de nascimento não entram de propósito: o gov.br preenche
 * sozinho e não são editáveis. Listá-los faria a pessoa procurar campo que não
 * existe. Espelha `app/(app)/mei/proximos-passos/page.tsx`.
 */
const CAMPOS_COLA_DEMO: CampoCola[] = [
  { rotulo: "RG", valor: "MG-12.345.678", nota: "Órgão emissor: SSP/MG" },
  { rotulo: "Telefone", valor: "(31) 99999-0000" },
  { rotulo: "E-mail", valor: "ana.ramos@email.com" },
  {
    rotulo: "Ocupação principal",
    valor: "Técnico(a) de manutenção de computador",
    nota: "Escolhe exatamente essa na lista. É a que corresponde ao que você faz.",
  },
  {
    rotulo: "Forma de atuação",
    valor: "Pela internet",
    nota: "Pode marcar mais de uma se for o seu caso.",
  },
  {
    rotulo: "Endereço comercial",
    valor: "Rua dos Timbiras, 1200, Funcionários, Belo Horizonte/MG",
  },
  {
    rotulo: "Endereço residencial",
    valor: "Rua dos Timbiras, 1200, Funcionários, Belo Horizonte/MG",
    nota: "Se for o mesmo do comercial, marca a opção de repetir.",
  },
  {
    rotulo: "Capital social",
    valor: "R$ 1.000",
    nota: "Não existe valor mínimo por lei. Esse é o que você declarou com a gente.",
  },
  {
    rotulo: "Nome fantasia",
    valor: "—",
    nota: "Opcional. A razão social sai automática: seu CNPJ + seu nome.",
  },
];

type Momento =
  | "splash"
  | "welcome"
  | "fork"
  | "dados"
  | "mei-ou-me"
  | "endereco"
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
  | "saida-exterior"
  | "saida-socios"
  | "saida-socio-pj"
  | "m-impedimento"
  | "m-ocupacao"
  | "m-proximos-passos"
  | "m-certificado"
  | "saida-mei-outra-empresa"
  | "saida-mei-servidor"
  | "conta"
  | "conta-codigo"
  | "plano"
  | "pagamento"
  | "socio"
  | "vinculo"
  | "socios"
  | "empresa"
  | "cnae-secundarios"
  | "natureza"
  | "nome"
  | "revisar"
  | "termo"
  | "painel"
  | "painel-recusa"
  | "assinatura"
  | "ativacao"
  // ─── MIGRAR DE CONTADOR (30/07) — decimal de Entrada ─────────────────────
  // Ramo decimal, não continuação: sai do fork E4 e reencontra o tronco só no
  // pagamento (E9). Por isso tem sequência própria, não entra em ETAPAS_CAUDA.
  | "m-cnpj"
  | "m-diagnostico"
  | "m-cnpj-inapto"
  | "m-plano"
  | "m-contrato"
  | "m-pagamento"
  | "m-contador"
  | "m-dados"
  | "m-socios"
  | "m-gov"
  | "m-transferencia"
  | "m-travado"
  | "m-ativa"
  | "retomar-cpf"
  | "retomar"
  | "aguardando"
  | "certificado"
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
      status: "✅ mesclado em /entrada (03/08, Pedro escolheu consistência sobre AA)",
    },
  ],
  "veredito-atende": [
    {
      id: "UX-65",
      oque: "'Outras opções compatíveis' + % de compatibilidade no card de cima. Os cards são clicáveis: tocar promove a opção pro topo e devolve a antiga pra lista.",
      status: "✅ mesclado em /veredito/atende (03/08) — prop `mostrarAlternativas` já existia no VereditoView desde 31/07, só o wrapper de produção não passava",
    },
    {
      id: "⚠️ decidir (obsoleto)",
      oque: "Preocupação original: a troca feita aqui não chegava no ENCAIXE (tela seguinte), que remontava a lista a partir do CNAE original. Ficou sem objeto: o ENCAIXE foi removido 31/07 (o veredito 🟢 já trava o CNAE direto, cards clicáveis).",
      status: "✅ resolvido por remoção da tela que gerava o conflito",
    },
  ],
  "veredito-waitlist-enviado": [
    {
      id: "UX-64",
      oque: "Ganhou saídas: 'Ler o blog', 'Conhecer o site' e 'Voltar ao início'. A tela aprovada só oferece 'Falar com um contador agora' — quem não quer falar com ninguém agora fica sem pra onde ir.",
      status: "✅ 'Voltar ao início' mesclado (03/08, real: /entrada) — 'Ler o blog'/'Conhecer o site' seguem 🔴, blog/site ainda sem rota",
    },
  ],
  "veredito-mauro-enviado": [
    {
      id: "UX-64",
      oque: "Mesmas saídas da waitlist. Na tela aprovada este estado não tem CTA nenhum — é beco puro.",
      status: "✅ 'Voltar ao início' mesclado (03/08, real: /entrada) — 'Ler o blog'/'Conhecer o site' seguem 🔴, blog/site ainda sem rota",
    },
  ],
  conta: [
    {
      id: "UX-71",
      oque: "E6 recriado com o layout do LOGIN: painel escuro que sangra (marca centralizada + saudação) + folha clara sobreposta com os campos (ícone à esquerda, placeholder como rótulo). A tela aprovada é o formulário clássico com rótulo em cima. Diferenças necessárias: a folha ROLA (são 7 campos, não 2) e o CTA foi pro rodapé fixo. Campos passaram a ser 1 por linha (CPF/telefone lado a lado cortavam o valor mascarado) e o endereço do CEP não trunca mais.",
      status: "✅ mesclado em /conta (03/08, prop layout='painel')",
    },
    {
      id: "UX-72",
      oque: "Cadastro por Google/Apple agora CONECTA de verdade: nome e e-mail vêm do provedor, a tela mostra um card 'conectado como…' (com opção de trocar) e pede só o que falta — CPF, telefone e endereço, que nenhum provedor fornece. Senha some (conta social não tem).",
      status: "🟡 visual mesclado (layout='painel', 03/08); `conectar()` segue MOCK — falta OAuth real (Google/Apple)",
    },
    {
      id: "UX-73",
      oque: "A pergunta 'é a primeira empresa?' virou OBRIGATÓRIA (inclusive no cadastro social). ⚠️ Contraria a decisão UX-48, que a definiu como 'dado puro, pulável sem custo' — lá o racional era não cobrar fricção por algo que não muda nada no fluxo.",
      status: "🔴 NÃO mesclado de propósito (03/08): ao ligar layout='painel' em produção, a coorte ficou opcional (regra já travada da UX-48) — essa parte da demo continua deslinkada até decisão explícita",
    },
  ],
  plano: [
    {
      id: "UX-74",
      oque: "E7 reconstruído como OFERTA: o plano vira produto, com card escuro e os itens inclusos em linguagem de dono, e a âncora verdadeira (escritório tradicional cobra honorário, a gente não). A tela aprovada é honesta mas não vende: dois cards e uma linha de taxa.",
      status: "✅ mesclado em /plano (03/08, prop layout='oferta')",
    },
    {
      id: "UX-75",
      oque: "LAPIDAÇÃO da própria UX-74 (achado do Pedro: 'muita informação'). Saíram 3 blocos, cada um por um motivo: (1) o FAQ era pré-eco do E8, que já responde 3 das 4 perguntas na tela onde a pessoa assina; a 4ª, que o E8 não cobre, virou micro-linha VISÍVEL sob o preço, porque letra miúda escondida em acordeon é a pegadinha que a tela existe pra evitar; (2) o card comparativo era o 3º lugar dizendo 'grátis' e usava preço riscado, linguagem de varejo, o mesmo vício cortado do E5 no mesmo dia; a âncora sobreviveu como 1 linha no card verde; (3) os '22 anos' já apareciam no E2 e no E8, onde são card completo. Inclusos caíram de 7 pra 5 ('Abertura do CNPJ' misturava balde, estava dentro do card MENSAL). 8 blocos → 4.",
      status: "✅ aplicado no PlanoOferta (29/07)",
    },
    {
      id: "⚠️ preço",
      oque: "A mensalidade continua PLACEHOLDER declarado (marcado FAKE no lib/fiscal) e a tela avisa. Nenhum desconto, contagem regressiva ou vaga limitada foi inventado: escassez falsa em contabilidade queima a confiança que os 22 anos constroem.",
      status: "🟡 preço final deferido ao Mauro",
    },
    {
      id: "⚓ âncora",
      oque: "A comparação com a contabilidade tradicional sobrevive como UMA linha no card verde, sem número: 'costuma custar em torno de um salário mínimo de honorário'. O card comparativo com o R$ 1.621 riscado saiu junto na lapidação. Sem número exposto, some também o risco de fingir precisão estatística numa régua que é referência de mercado.",
      status: "✅ resolvido pela UX-75 (não depende mais de valor)",
    },
    {
      id: "✅ RESOLVIDO 26/08",
      oque: "Era a 'pendência real de spec' documentada há semanas: o add-on de endereço fiscal não aparecia aqui, e a 'conta total' desta tela não era total. Reunião Rua Satélite 36 (item 2) resolveu na raiz: a escolha 'endereço próprio × fiscal Legalizai' saiu do C4 (pós-pagamento) e subiu pro E5F (`FaixaView`, antes do cadastro) — quando escolhido, o valor já soma na mensalidade mostrada aqui, com 1 linha de explicação ('Inclui R$60/mês de endereço fiscal, porque você optou por usar o nosso').",
      status: "✅ aplicado em PlanoView + PlanoOferta (prop `enderecoFiscal`, `wizard-dinheiro.tsx`)",
    },
  ],
  pagamento: [
    {
      id: "🐛 BUG-04",
      oque: "CPF pedido DUAS VEZES. O E6 virou front-load em 28/07 e passou a coletar CPF, mas o E9 continuava abrindo campo vazio e pedindo de novo. É literalmente o '1 dado duplicado sem reuso (CPF pedido 2x)' que o cruzamento com os dados da JUCEMG pegou na reunião de 28/07: a correção foi aplicada no C1 e esqueceu esta tela. Agora o E9 só EXIBE o CPF: como ele já foi digitado e validado no cadastro, não há o que reconfirmar nem editar (decisão do Pedro, 29/07).",
      status: "✅ corrigido — ⚠️ na produção só funciona com persistência (RF-01)",
    },
    {
      id: "UX-77",
      oque: "'Acelere seu processo' era imperativo de varejo numa tela onde não há mais nada a vender: a pessoa já decidiu, só falta pagar. O título agora AFIRMA o fato ('Sua abertura começa hoje'). E o aviso repetia a pill do botão a 3 cm de distância: agora a pill diz quando o DINHEIRO cai e o aviso diz o que acontece com a EMPRESA. ⚠️ A decisão de fundo não mudou (o cartão é empurrado porque destrava a abertura na hora, e a vantagem é real do cliente); mudou só a redação.",
      status: "✅ aplicado no PagamentoView (29/07)",
    },
    {
      id: "🔄 E8 eliminado",
      oque: "30/08 (pedido do Pedro) — igual à Contabilizei, o aceite do contrato acontece no ATO DO PAGAMENTO, não numa tela própria antes dele. O E8 (`ContratoView`) foi removido do fluxo; o checkbox 'Li e aceito' e o botão 'Ler o contrato completo' subiram pra dentro do E9.",
      status: "✅ aplicado — E9 vira 'Pagamento + contrato'",
    },
  ],
  /* ═══ B4 · o dossiê — 29/07 ═══════════════════════════════════════════
     Estas telas entraram na demo hoje, junto com a extração pra
     `components/wizard-dossie.tsx`. Os achados abaixo saíram da leitura das 7
     e JÁ ESTÃO CORRIGIDOS: não são divergências da demo, são defeitos de
     produção que a demo agora renderiza consertados. */
  socio: [
    {
      id: "UX-80",
      oque: "REMOVIDA a pergunta 'Você mora fora do Brasil?'. Era confirmação do que a triagem do E5 já pergunta e já barra, com saída dedicada (LC 123 art. 17) — mesma duplicação que tiramos do CPF no E9. Saíram junto o aviso de bloqueio e o botão 'Falar com o time'. ⚠️ Efeito colateral assumido: o C1 passa a CONFIAR na resposta do E5, e a segunda barreira deixou de existir. A saída /saida/exterior continua alcançável pela triagem.",
      status: "✅ decisão do Pedro (29/07), aplicada no SocioView",
    },
    {
      id: "🐛 BUG-08",
      oque: "O '✨ Preencher automático' APARECIA nas 7 telas do dossiê e não fazia nada. Ele é ligado por `naTravessia`, que passou a incluir o dossiê quando as telas entraram na demo, mas o preencherEtapa() só conhecia os campos do B3. Botão visível e inerte numa apresentação é pior que botão ausente. A demo NÃO passou a mexer no estado interno das 7 (isso recriaria o acoplamento que a fidelidade por construção evita): ela incrementa um nonce e cada tela sabe se preencher, com valores que moram junto do cliente de mentira.",
      status: "✅ corrigido (29/07) — vale pras 7 telas",
    },
    {
      id: "🐛 BUG-05",
      oque: "Os dois botões da tela eram MORTOS — nem 'Continuar' nem 'Falar com o time' tinham onClick, e o arquivo nem importava useRouter. Pior no segundo: quem chega nele é justamente quem foi barrado (mora fora do Brasil), então a pessoa recebia a notícia ruim e o único caminho adiante não respondia. Mesma classe do beco sem saída pego em 28/07. ⚠️ Ao consertar, apareceu que a cadeia INTEIRA do dossiê estava morta: nenhuma das 7 telas navegava, o flow parava no C1.",
      status: "✅ corrigido — cadeia C1→C7→/revisar ligada",
    },
    {
      id: "🎭 mock",
      oque: "As telas do dossiê declaravam mocks próprios e contraditórios: o C3 deixava escolher 'Só eu', o C4 tinha 2 sócios fixos e perguntava pelos dois nominalmente, o C6 tinha solo fixo. E o nome trocava no meio: 'Ana Beatriz Ramos' aqui, 'Ana Souza' no C7. Agora existe uma fonte única (`dossie/mock.ts`) e a cliente tem um nome só do começo ao fim.",
      status: "✅ unificado — 🚧 morre com o RF-01 (estado real entre telas)",
    },
  ],
  socios: [
    {
      id: "UX-78",
      oque: "O limite de 2 sócios era um Aviso de bloco inteiro, com título, e aparecia pra 100% de quem chega aqui — a triagem do E5 já barrou 3+ lá atrás, então todo mundo que lia estava DENTRO do limite. Dar peso de notícia ruim a quem não foi barrado gasta atenção contra o próprio usuário. Virou nota de rodapé do campo: a trava continua dita, sem alarme. Também caiu um dos três 'só' da tela ('Dá pra ser só você' + 'Só eu' + 'Empresa só sua').",
      status: "✅ aplicado no SociosView (29/07)",
    },
  ],
  empresa: [
    {
      id: "🐛 BUG-06",
      oque: "O CAPITAL SOCIAL ESCAPAVA. A condição de liberação era `querFiscal || (…)`, e o `||` fazia curto-circuito: quem escolhia 'quero um endereço fiscal da Legalizai' liberava o Continuar NA HORA, com o capital social em branco — e o campo estava ali, renderizado logo abaixo, porque ele aparece nos dois caminhos. Capital social vai no contrato social e a JUCEMG exige. O endereço é que é condicional, não ele.",
      status: "✅ corrigido no EmpresaView (29/07)",
    },
    {
      id: "🕓 preço",
      oque: "O chip 'R$ 60/mês' do endereço fiscal aparecia sem marcação nenhuma, embora o doc da tela afirmasse 'Marcado na UI'. Não estava. O E7 declara os valores provisórios; esta tela não declarava nenhum, e número provisório sem aviso é igual a número sem fonte. A marcação foi criada de verdade.",
      status: "✅ corrigido — 🟡 preço final segue com o Mauro",
    },
    {
      id: "🔄 26/08 — escolha saiu daqui",
      oque: "A pergunta 'próprio × fiscal Legalizai' e o aviso de cobrança recorrente SAÍRAM desta tela (reunião Rua Satélite 36, item 2) — moram no E5F desde antes do cadastro, e o valor já vem confirmado do E7. Esta tela agora só CONFIRMA a escolha (card read-only, mesma doutrina do C3 pra sócios) e coleta os detalhes de endereço (CEP/IPTU/tipo) quando for próprio.",
      status: "✅ aplicado — prop `enderecoProprio` em `EmpresaView` (`wizard-dossie.tsx`)",
    },
    {
      id: "✍️ título",
      oque: "'Onde a empresa fica?' numa tela que também coleta capital social, que não é lugar nenhum. Virou 'Os dados da empresa'.",
      status: "✅ aplicado",
    },
  ],
  natureza: [
    {
      id: "🐛 BUG-07",
      oque: "O GUARD-RAIL NUNCA TINHA RODADO. `TEM_SOCIO` era um const false local, e a condição de incoerência é 'escolheu dono único E tem sócio' — sempre falsa. O bloco de bloqueio jamais renderizou, nem uma vez, em review nenhuma, e o doc da tela afirmava que o mock existia justamente 'pra provar o guard-rail'. Com a fonte única (hoje com sócio) o caminho virou alcançável. E apareceu que a copy mentiria: dizia 'A gente já ajustou pra você' e nada ajustava, só desabilitava o botão — agora o aviso traz o botão que faz o que ele promete.",
      status: "✅ corrigido no NaturezaView (29/07)",
    },
  ],
  nome: [
    {
      id: "✍️ UX-79",
      oque: "O aviso dizia 'A ordem não muda nada na abertura' logo abaixo de um subtítulo que pede pra pessoa ORDENAR os 3 nomes. Lidos em sequência, o segundo esvaziava o primeiro: por que ordenar algo que não muda nada? O que a frase queria dizer era 'não atrasa' — virou 'Nenhuma tentativa atrasa a sua abertura'.",
      status: "✅ aplicado no NomeView (29/07)",
    },
  ],
  /* ═══ A CAUDA (A1–A5) + C0.1/E9.1 — entraram na demo hoje (29/07) ═══════ */
  revisar: [
    {
      id: "🐛 BUG-09",
      oque: "A1 tinha mock de identidade PRÓPRIO (`DOSSIE`), divergente do resto do dossiê: CNAE principal com um dígito diferente do travado no Encaixe (6201-5/01 × 6201-5/02) e secundárias (Hospedagem, Suporte técnico) que o C5 nunca ofereceu como opção. Mesma classe de bug que o `dossie/mock.ts` foi criado pra matar — corrigido herdando de lá.",
      status: "✅ corrigido no RevisarView (29/07)",
    },
    {
      id: "🐛 BUG-10",
      oque: "'Confirmar e seguir' não tinha onClick — a tela nunca tinha sido ligada a lugar nenhum, porque nunca tinha sido apresentada.",
      status: "✅ corrigido — segue pro A2",
    },
  ],
  termo: [
    {
      id: "🐛 BUG-10",
      oque: "Mesmo defeito do A1: 'Autorizo, pode abrir' não navegava.",
      status: "✅ corrigido — segue pro A3 (painel)",
    },
  ],
  painel: [
    {
      id: "✍️ reduzido (1ª passada)",
      oque: "Caiu de 9 pra 4 status: tudo que vinha DEPOIS do registro (pagar taxa · tirar CNPJ · Simples · certificado · liberar nota · deixar pronto) saiu — o certificado já tem tela própria (A5). 'Registrar a empresa' virou 'Analisando viabilidade' (nome mais honesto pro que a Junta faz — é onde a recusa de nome acontece). Entrou 'Agora é só assinar', cinza até a Junta deferir.",
      status: "✅ aplicado no painel.tsx (29/07)",
    },
    {
      id: "✍️ reduzido (2ª passada)",
      oque: "'Conferir o nome' + 'Montar o contrato social' — os 2 passos ANTES da análise — eram trabalho NOSSO nos bastidores, não algo que o cliente reconhece ter feito. Viraram 1 status só: 'Documentação completa preenchida', já verde ao chegar no painel. Lista caiu de 4 pra 3.",
      status: "✅ aplicado — índices de `concluidas`/`emAndamento` ajustados em /painel, /painel/recusa e na demo (2/2 → 1/1)",
    },
    {
      id: "🔄 26/08 (3ª passada) — item 6",
      oque: "O pagamento da DAE (taxa da Junta), que desde 28/07 era timing de BACKEND (paga no E9 junto da mensalidade, a gente segura e repassa depois), voltou a ser etapa VISÍVEL: reunião Rua Satélite 36 decidiu que o cliente só paga DEPOIS que a viabilidade sai, com um CTA coral inline aqui no painel ('Pagar a guia agora' — 'pagardar', literal da reunião). 'Agora é só assinar' passa a depender dessa etapa nova, não só do deferimento. Lista voltou de 3 pra 4.",
      status: "✅ aplicado — `Etapa.acaoCliente` + `onPagarDae` (`components/painel.tsx`)",
    },
  ],
  assinatura: [
    {
      id: "🐛 BUG-10",
      oque: "Nenhum dos 3 CTAs (convidar sócio · assinar direto · assinar no GOV.BR) navegava. ⚠️ Sem estado real de consenso multi-sócio (mock pra farol): qualquer CTA habilitado avança — simular a espera assíncrona de verdade é trabalho de painel/CRM, não desta apresentação.",
      status: "✅ corrigido — segue pro A5 (home de ativação)",
    },
    {
      id: "🔄 26/08 — item 7",
      oque: "Reunião Rua Satélite 36: o certificado digital agora é validado ANTES desta assinatura (tela nova, A3.2 `CertificadoGateView`, `/certificado`), não depois — a procuração que sai junto da assinatura EXIGE o certificado já validado, e a ordem antiga (certificado só na home de ativação, depois de já ter assinado) era uma inconsistência real, não só preferência de ordenação. Não está mesclado nesta timeline de carrossel (fica como rota própria, fora do passo-a-passo guiado) — só a documentação e o componente real existem por enquanto.",
      status: "🟡 componente/rota real existem (`/certificado`); NÃO entrou no carrossel guiado desta apresentação",
    },
  ],
  ativacao: [
    {
      id: "🔓 SWAP",
      oque: "O que vem depois da assinatura NÃO é a antiga 'empresa ativa' (3 primeiros passos genéricos, removida 30/07): é esta home de dia-1 (A5), que trata o certificado como item 'agora' de uma trilha (1 de 3), não como coisa já liberada. ⚠️ Autocrítica: a 1ª tentativa desta correção trouxe a tela ERRADA (`/certificado`, um gate isolado que também existe, também chamado de 'A5' num doc antigo) — o Pedro mandou o print da tela real pra corrigir.",
      status: "✅ corrigido — HomeAtivacaoView substitui o que era CertificadoView na sequência",
    },
    {
      id: "🔄 26/08 — item 7 (segue do achado acima)",
      oque: "Desde que o certificado passou a ser validado ANTES da assinatura (A3.2, ver scene 'assinatura'), o item 'certificado' desta trilha deixou de ser 'agora' e virou 'feito' — quem vira 'agora' é 'Conferir os dados da empresa'. `/mais/certificado` (Portal) continua existindo, só que agora é pra RENOVAR/trocar, não pra validar a 1ª vez.",
      status: "✅ aplicado em `PASSOS_ATIVACAO` (`wizard-cauda.tsx`)",
    },
    {
      id: "✍️ sem confete",
      oque: "A fonte (`home-dia1/page.tsx`) tinha `<Confetti>` no hero de nascimento. Removido por pedido explícito — mesmo padrão do dia inteiro (celebração saiu do CTA do veredito 🟢, materialização saiu da antiga 'empresa ativa').",
      status: "✅ aplicado no HomeAtivacaoView (29/07)",
    },
  ],
  aguardando: [
    {
      id: "🐛 BUG-11",
      oque: "O `/pagamento` de produção mandava TODO MUNDO direto pro dossiê, inclusive quem pagou boleto. A aresta `E9--boleto-->E9.1` do mapa (`flow-data.mjs`) nunca tinha sido implementada — a E9.1 existia como rota isolada, sem ninguém apontando pra ela.",
      status: "✅ corrigido no wrapper de produção `/pagamento` — boleto agora passa por E9.1 antes do C1",
    },
  ],
  retomar: [
    {
      id: "🐛 BUG-12",
      oque: "'Continuar de onde parei' não navegava.",
      status: "✅ corrigido — segue pro C1 (mesma aresta do mapa: reentrada aterrissa no início do dossiê)",
    },
  ],
  "fora-bh": [
    {
      id: "UX-62",
      oque: "Virou lista de espera classificada: etiqueta '📍 Outra cidade' + campo obrigatório 'qual a sua cidade?' + confirmação que promete só avisar (a oficial promete ligação em 1 dia útil, que aqui não se cumpre).",
      status: "✅ mesclado em /saida/fora-bh (03/08) — 'Voltar ao início' real; blog/site continuam sem rota",
    },
  ],
  perguntando: [
    {
      id: "UX-60",
      oque: "Seta de voltar no header, pra sair do E5 e revisar o fork do E3. A tela aprovada não tem — quem erra a escolha do E3 fica preso.",
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
      oque: "Pergunta do exterior virou condicional: some no 'Só eu', e só aparece depois de escolher o nº de sócios. O título se dirige a quem existe — 2 sócios: 'Seu sócio mora fora do Brasil?'; 3+: 'Algum sócio mora fora do Brasil?'. ⚠️ Ressalva fiscal: o gate do E4 confirma onde fica a EMPRESA (BH), não onde a pessoa MORA — sócio único domiciliado fora derruba o Simples igual (LC 123 art.17). Alternativa sem furo pro caso solo: 'Você mora fora do Brasil?' em vez de remover.",
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
      status: "✅ mesclado em /gate (03/08, prop exatoInline)",
    },
  ],
  "veredito-descarta": [
    {
      id: "UX-64",
      oque: "Decline limpo ganhou saídas ('Ler o blog', 'Conhecer o site', 'Voltar ao início'). A tela aprovada não tem CTA nenhum: explica e para, sem oferecer pra onde ir.",
      status: "✅ 'Voltar ao início' mesclado (03/08, real: /entrada) — 'Ler o blog'/'Conhecer o site' seguem 🔴, blog/site ainda sem rota",
    },
    {
      id: "demo",
      oque: "O 3º desfecho 🔴 ('ninguém atende') sai do mesmo campo que os outros.",
      status: "✅ 06/08: mapear() virou fonte única (@/lib/mock-veredito) — /gate agora também tem os 4 desfechos, só o VALOR do split ainda é mock (a IA real depende da lista de CNAEs, fila Larissa)",
    },
  ],
};

/**
 * Rótulo de cada etapa — puxado DIRETO do `/mockup` (`@/lib/telas-flow`,
 * FONTE ÚNICA de rota+rótulo+ordem), não mais digitado à mão aqui. 🆕 06/08:
 * antes eram 2 dicionários gêmeos que só ficavam iguais por disciplina;
 * agora renomear uma tela no mockup renomeia o painel da demo também.
 *
 * Só os poucos MOMENTOS sem linha própria no mockup (confirmações e o
 * código de acesso — são sub-passo da MESMA tela, não uma tela nova) ganham
 * um sufixo manual em `SUFIXO_MOMENTO`. `fim` não tem rota (é só desta
 * demo) e fica de fora do gerador.
 */
const LABEL_POR_ROTA: Record<string, string> = Object.fromEntries(
  GRUPOS.flatMap((g) => g.telas.map((t) => [t.rota, t.nome] as const))
);

const ROTA_POR_MOMENTO: Partial<Record<Momento, string>> = {
  splash: "/splash",
  welcome: "/welcome",
  fork: "/entrada",
  dados: "/dados",
  "mei-ou-me": "/entrada?intencao=abrir",
  endereco: "/endereco",
  "fora-bh": "/saida/fora-bh",
  "fora-bh-enviado": "/saida/fora-bh",
  // 🔄 27/08 — atravessaram o pagamento: viraram a C0 (`/dossie/atividade`).
  perguntando: "/dossie/atividade",
  analisando: "/dossie/atividade",
  "veredito-atende": "/veredito/atende",
  "veredito-waitlist": "/veredito/waitlist",
  "veredito-waitlist-enviado": "/veredito/waitlist",
  "veredito-mauro": "/veredito/nao-atende",
  "veredito-mauro-enviado": "/veredito/nao-atende",
  "veredito-descarta": "/veredito/descartado",
  triagem: "/gate?etapa=triagem",
  faixa: "/gate?etapa=faixa",
  "saida-exterior": "/saida/exterior",
  "saida-socios": "/saida/socios",
  "saida-socio-pj": "/saida/socio-pj",
  "m-impedimento": "/gate?etapa=triagem&regime=mei",
  "m-ocupacao": "/dossie/ocupacao",
  "m-proximos-passos": "/mei/proximos-passos",
  "m-certificado": "/certificado?regime=mei",
  "saida-mei-outra-empresa": "/saida/mei-outra-empresa",
  "saida-mei-servidor": "/saida/mei-servidor",
  conta: "/conta",
  "conta-codigo": "/conta",
  plano: "/plano",
  pagamento: "/pagamento",
  socio: "/dossie/socio",
  vinculo: "/dossie/vinculo",
  socios: "/dossie/socios",
  empresa: "/dossie/empresa",
  "cnae-secundarios": "/dossie/cnae-secundarios",
  natureza: "/dossie/natureza",
  nome: "/dossie/nome",
  revisar: "/revisar",
  termo: "/termo",
  painel: "/painel",
  "painel-recusa": "/painel/recusa",
  assinatura: "/assinatura",
  ativacao: "/home-dia1",
  "m-cnpj": "/migrar/cnpj",
  "m-diagnostico": "/migrar/diagnostico",
  "m-cnpj-inapto": "/saida/cnpj-inapto",
  "m-plano": "/migrar/plano",
  "m-contrato": "/migrar/contrato",
  "m-pagamento": "/pagamento?fluxo=migrar",
  "m-contador": "/migrar/contador",
  "m-dados": "/migrar/dados",
  "m-socios": "/migrar/socios",
  "m-gov": "/migrar/gov",
  "m-transferencia": "/migrar/transferencia",
  "m-travado": "/migrar/transferencia?estado=travado",
  "m-ativa": "/migrar/ativa",
  "retomar-cpf": "/retomar",
  retomar: "/retomar",
  aguardando: "/aguardando",
  certificado: "/certificado",
};

const SUFIXO_MOMENTO: Partial<Record<Momento, string>> = {
  "fora-bh-enviado": " · na lista",
  "veredito-waitlist-enviado": " · confirmada",
  "veredito-mauro-enviado": " · confirmado",
  "conta-codigo": " · confirmar código",
};

const NOME_MOCKUP: Record<Momento, string> = Object.fromEntries(
  (Object.keys(ROTA_POR_MOMENTO) as Momento[]).map((m) => [
    m,
    (LABEL_POR_ROTA[ROTA_POR_MOMENTO[m]!] ?? m) + (SUFIXO_MOMENTO[m] ?? ""),
  ])
) as Record<Momento, string>;
NOME_MOCKUP.fim = "— fim do piloto —";
// 🆕 29/08 — a rota real leva query string (`/entrada?intencao=abrir`), que
// não bate com a chave exata de `LABEL_POR_ROTA` (keyed pela rota base
// listada em `GRUPOS`). Sobrescreve manual, mesmo padrão do `fim` acima.
NOME_MOCKUP["mei-ou-me"] = "E3.2 · MEI × ME";
// 🆕 30/08 — "retomar-cpf" divide a mesma rota (`/retomar`) com "retomar" (a
// página real tem 2 passos, CPF depois status); sem override os dois
// herdariam o mesmo nome do `Object.fromEntries` acima.
NOME_MOCKUP["retomar-cpf"] = "C0.1 · Voltar de onde parei (CPF)";

const DESCRICOES: Record<Momento, { dono: Dono; faz: string; interfere: string; porque: string }> = {
  splash: {
    dono: null,
    faz: "A marca se apresenta em tela cheia — o único momento do produto inteiro em que o coral cobre o vidro todo.",
    interfere: "Não pede nem grava nenhum dado. É pura apresentação de marca, antes de qualquer pergunta.",
    porque:
      "Logo negativa com o check em wipe: o mesmo gesto de 'conferido' que o confete do veredito 🟢 ecoa lá na frente. Não auto-navega por escolha, nem aqui nem em produção — a ponte /splash→/welcome ainda não foi ligada a lugar nenhum, então a demo precisa de um toque próprio pra seguir.",
  },
  welcome: {
    dono: "usuario",
    faz: "3 slides puláveis com as teses da marca: contador de verdade (não robô) · a parte chata é com a gente · sem contabilês, sem susto no boleto.",
    interfere:
      "Não pede dado nenhum — é posicionamento, não passo de flow. Pular ou terminar os 3 slides levam pro mesmo lugar (o fork, E3).",
    porque:
      "Onboarding que prende é o que a persona reta-direto odeia (guarda-corpo da trilha única, UX-48) — por isso 'Pular' fica visível desde o slide 1, longe do polegar pra não competir com o CTA.",
  },
  fork: {
    dono: "usuario",
    faz: "Divide o produto em dois caminhos: quem ainda não tem CNPJ vai pro fluxo de abertura; quem já tem vai pro fluxo de migração. Quem já é cliente entra na conta.",
    interfere: "Define QUAL processo será executado. Abrir empresa e migrar contabilidade são operações completamente diferentes na Junta e na Receita.",
    porque:
      "A copy pergunta pelo FATO ('já tenho empresa'), nunca pela operação ('migrar'). 'Migrar' é jargão e excluiria quem não tem contador nenhum — que é justamente o caso mais fácil pra gente, porque não existe distrato nem transferência de responsabilidade técnica.",
  },
  dados: {
    dono: "usuario",
    faz: "Pede nome, e-mail e telefone logo depois do fork, antes de qualquer pergunta de negócio. Não cria conta: só identifica quem está do outro lado.",
    interfere:
      "Nada no processo da Junta. Interfere no NOSSO lado: sem isso, quem desiste no meio do funil é anônimo e não dá pra retomar contato.",
    porque:
      "Reordenação de 27/08, em cima do cruzamento com o funil da Contabilizei: eles pedem esses 3 campos na PRIMEIRA tela, e a gente só pedia depois de 6 telas de gate. A frase do Pedro resume: 'se a gente não capta isso rápido, não sabe nem quem é dono dos próximos cliques'. 🔄 30/08 — o aceite formal do contrato subiu pro E9 (junto do pagamento, o E8 foi eliminado); aqui vai só o consentimento mínimo de privacidade, em 1 linha.",
  },
  "mei-ou-me": {
    dono: "usuario",
    faz: "Pergunta direto se a pessoa é MEI ou ME, com os critérios de cada regime lado a lado (teto de faturamento, cidade, sócio, funcionário).",
    interfere:
      "Decide o Anexo/regime que o resto do wizard segue: MEI não passa pelo gate de cidade (abre em qualquer lugar do Brasil), ME sim.",
    porque:
      "🔄 29/08 (pedido do Pedro) — o título deixou de perguntar 'você já sabe' e virou direto 'você é MEI ou ME'; o subtítulo tirou 'dá pra trocar de ideia depois' (a escolha aqui não é reversível de graça lá na frente). Ganhou um link de escape ('Estou com dúvida, preciso de ajuda') pra quem trava, e a ordem dos cards inverteu (ME em cima, MEI embaixo).",
  },
  endereco: {
    dono: "usuario",
    faz: "Duas perguntas numa tela: onde a empresa vai ficar (endereço em BH, validado por CEP, ou o endereço fiscal da Legalizai) e o que a pessoa faz (categoria de atividade).",
    interfere:
      "Define o município da empresa, que decide a Junta (JUCEMG) e a Prefeitura que emite inscrição municipal e NFS-e. E a categoria é o que filtra quem a gente atende: a lista só tem atividade atendida.",
    porque:
      "Substitui o E4 (gate de cidade), que perguntava 'é em BH?' e acreditava no clique — era a única checagem de cidade do produto inteiro, e não checava nada. Aqui o CEP valida de verdade, e quem não tem endereço em BH recebe o endereço fiscal como SOLUÇÃO em vez de porta na cara (o município segue a sede, não onde a pessoa mora). A categoria é a peça que permitiu mover o CNAE pra depois do pagamento: como ela só oferece o que atendemos, o veredito lá na frente não pode mais dizer não.",
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
    faz: "Perguntas rápidas: quantos sócios, se o sócio é CPF ou CNPJ (🆕 24/08), e se alguém mora fora do Brasil.",
    interfere: "Mais de 4 sócios, sócio pessoa jurídica ou sócio no exterior barra o MLP/Simples — descobrir isso aqui evita cobrar de quem não pode abrir.",
    porque: "Fail-fast (UX-21): com a cobrança logo depois, o que mata elegibilidade tem que ser perguntado ANTES do dinheiro.",
  },
  faixa: {
    dono: "usuario",
    faz: "Pergunta quanto a pessoa espera faturar por mês — faixa guiada ou valor exato.",
    interfere: "Alimenta o cálculo de enquadramento e Fator R nas telas seguintes (a conta da abertura e o pró-labore).",
    porque: "Base necessária pra estimar corretamente o que a empresa vai pagar — sem isso o resto do fluxo chuta.",
  },
  "saida-exterior": {
    dono: null,
    faz: "Explica que a empresa pode existir, mas fora do Simples — a lei (LC 123 art.17) barra a opção pelo Simples com sócio domiciliado no exterior.",
    interfere: "Encerra o funil do app (que só faz Simples). Não é 'não pode abrir empresa', é 'não pelo Simples' — confundir as duas seria uma notícia pior que a verdadeira.",
    porque: "Honestidade > beco sem saída silencioso (doutrina das telas de saída, A9). Roteia pro time contábil, que atende esse regime fora do app.",
  },
  "saida-socios": {
    dono: null,
    faz: "Explica que o limite de 4 sócios é do PRODUTO, não da lei — a sociedade é legal, só o app que ainda não abre com 5+.",
    interfere: "Encerra o funil do app. 'Ainda' porque o limite pode cair (subiu de 2 pra 4 em 24/08, reunião Leonan — não é regra externa).",
    porque: "Dizer que o limite é nosso custa orgulho e compra confiança — mesma escolha da doutrina anti-guru. Roteia pro escritório, que já faz esse tipo de abertura fora do app.",
  },
  "saida-socio-pj": {
    dono: null,
    faz: "Explica que sócio pessoa jurídica tira a empresa do Simples Nacional no ato do contrato social — regra fiscal, não limite nosso.",
    interfere: "Encerra o funil do app (só atende Simples hoje). Diferente do limite de sócios: aqui é a LEI que empurra pro Presumido/Real, não uma escolha nossa.",
    porque: "🆕 24/08 (reunião Leonan 19/08 + pedido do Pedro) — bloqueia na TRIAGEM, antes do dinheiro, em vez de deixar a pessoa avançar e travar só lá no C3 do dossiê. Roteia pro escritório, que atende Presumido fora do app.",
  },
  "m-impedimento": {
    dono: "nossa",
    faz: "Faz as 3 perguntas que o próprio governo checa no registro do MEI: já tem outra empresa? é servidor federal? recebe benefício (invalidez, salário-maternidade, seguro-desemprego)?",
    interfere:
      "Substitui a triagem de sócios no ramo MEI — que não faz sentido, porque MEI é unipessoal por definição (art. 966 do CC). As duas primeiras BLOQUEIAM (a Receita cruza o CPF e barra sozinha); a terceira não bloqueia, mas a formalização cancela o benefício de forma irreversível.",
    porque:
      "🆕 28/08 — fica ANTES do pagamento pelo mesmo motivo da triagem do ME: a gente não cobra de quem já sabe que não pode ser atendido. E aqui isso pesa mais, porque o modelo do MEI usa hora de atendente — descobrir o impedimento depois é reembolso + trabalho humano gasto à toa.",
  },
  "m-ocupacao": {
    dono: "usuario",
    faz: "Escolhe a ocupação principal numa lista fechada (Anexo XI da Res. CGSN 140/2018) e, se quiser, até 15 secundárias. Não existe campo de texto livre.",
    interfere:
      "É a C0 do ramo MEI, mas NÃO é o C0 adaptado: o Portal do Empreendedor não aceita CNAE livre. E a tela avisa do LIMITE INTERNO (Solução de Consulta Cosit nº 27/2021) — a ocupação é mais estrita que o CNAE que ela mapeia.",
    porque:
      "🎯 É onde mora parte do que a gente vende. Quem escolhe 'Reparador(a) de bicicleta' não pode consertar moto, mesmo o CNAE parecendo permitir — e descobriria isso numa fiscalização, não no cadastro. É exatamente o erro que só contador pega.",
  },
  "m-certificado": {
    dono: "usuario",
    faz: "O gate do certificado digital, com a variante do MEI: explica que a ABERTURA não precisou dele, mas o dia a dia precisa — e que ele NÃO vem no plano.",
    interfere:
      "É a mesma tela do ME (`CertificadoGateView`), com 2 diferenças. O MOTIVO: no ME o certificado destrava a procuração da assinatura; no MEI não existe assinatura nem procuração de abertura, então o que ele destrava é OPERAR (puxar guia, FGTS Digital, agir sem pedir senha). E QUEM PAGA: no ME vem incluso; no MEI é do cliente.",
    porque:
      "🆕 28/08 (decisão do Pedro) — fica ANTES da home dia-1 de propósito: 'tem que ser efetivado antes da pessoa cair pra dentro do app com as funcionalidades, da mesma forma do ME'. E o custo aparece desde o card de escolha MEI×ME, não como surpresa no contrato.",
  },
  "m-proximos-passos": {
    dono: "usuario",
    faz: "Entrega os dados dele prontos, na ordem exata dos campos do Portal do Empreendedor, com botão de copiar. Confere o nível da conta gov.br (Prata ou Ouro) e abre o Portal.",
    interfere:
      "É a tela que FECHA o ramo MEI, e existe por razão jurídica: não há API, não há procuração que cubra o registro (a do e-CAC só vale pra atos posteriores), e a senha gov.br é intransferível por Termo de Uso. Não dá pra registrar pelo cliente.",
    porque:
      "🆕 28/08 — ✍️ REGRA DE COPY DURA deste ramo: **nunca dizer 'a gente abre pra você'**. O que a gente promete é conferir, escolher a ocupação certa e deixar pronto — que já é o trabalho difícil. Promessa que não dá pra cumprir vira reembolso.",
  },
  "saida-mei-outra-empresa": {
    dono: null,
    faz: "Explica que quem já é sócio, titular ou administrador de outra empresa ativa não consegue abrir MEI — inclusive empresa parada que nunca foi baixada.",
    interfere:
      "Bloqueio do GOVERNO, não do produto: é a LC 123 art. 18-A, e a Receita cruza o CPF dentro do próprio Portal. Não há exceção nem negociação.",
    porque:
      "Por isso a saída NÃO é waitlist: oferece os 2 caminhos reais (dar baixa na antiga ou abrir como ME), que a Legalizai faz hoje. Porta fechada vira encaminhamento.",
  },
  "saida-mei-servidor": {
    dono: null,
    faz: "Explica a vedação do art. 117 da Lei 8.112/90, que vale pra servidor público FEDERAL na ativa.",
    interfere:
      "Encerra o caminho MEI pra quem é federal. Mas não fecha a porta pra estadual/municipal: lá a regra vem do estatuto de cada ente, e em muitos casos é permitido.",
    porque:
      "Mandar embora todo servidor seria perder cliente por regra que não se aplica a ele. A saída convida a conferir o estatuto junto com a gente.",
  },
  conta: {
    dono: "usuario",
    faz: "Cria o acesso e já coleta os dados pessoais: nome, CPF, telefone e endereço. Antes isso só era pedido depois do pagamento.",
    interfere:
      "São exatamente os dados que a Junta exige pra constituir: quem é o sócio, com que documento e onde ele mora. Coletar aqui adianta o dossiê inteiro.",
    porque:
      "Front-load decidido em 28/07: captar num lugar só, com validação por código logo na entrada. Assim o C1 vira confirmação, não recoleta. Criar conta é grátis; o dinheiro só aparece na tela seguinte.",
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
  pagamento: {
    dono: "usuario",
    faz: "Última tela do wizard: pede o CPF, o método de pagamento e o aceite do contrato de serviço (resumo humano + checkbox). 🔄 30/08 — o aceite subiu pra cá; o E8 (`ContratoView`) foi eliminado, igual à Contabilizei (aceita no ato do pagamento, não numa tela própria antes).",
    interfere:
      "O CPF faz dois trabalhos: cobrança e elegibilidade. Situação irregular na Receita significa que a pessoa não pode abrir empresa, então a gente não cobra. O aceite é o que vira a pessoa cliente — ainda NÃO é o ponto sem volta (CDC art. 49, 7 dias, vale limpo). Depois daqui nasce a casa (o portal).",
    porque:
      "Um campo, dois usos, sem gastar uma tela a mais. O termo irreversível é outra tela (A2), depois do dossiê — separar os dois atos é o que mantém cada um juridicamente sólido. E a copy precisa distinguir 'CPF suspenso' de 'cartão recusado': trocar de cartão não resolve o primeiro.",
  },

  /* ═══════════════════ CONSTITUIÇÃO · O DOSSIÊ (C1–C7) ═══════════════════
     A partir daqui o cliente JÁ PAGOU e a casa (o portal) já nasceu. O que
     acontece nas 7 telas seguintes é a montagem do documento que vai pra
     JUCEMG — por isso o "o que interfere na constituição" fica muito mais
     literal do que no bloco do dinheiro: aqui quase todo campo VIRA linha de
     contrato social ou de formulário de registro. */

  socio: {
    dono: "usuario",
    faz: "Confirma o que já foi preenchido no cadastro e completa o que falta: RG, órgão emissor, estado civil e regime de bens.",
    interfere:
      "Estado civil e regime de bens vão no contrato social e podem CONVOCAR outra pessoa: na comunhão universal, o cônjuge assina esta abertura. Descobrir isso no cartório trava tudo; descobrir aqui é só um aviso.",
    porque:
      "Nome, CPF, telefone e endereço não são pedidos de novo — eles subiram pro E6 no front-load de 28/07. Esta tela vira CONFIRMAÇÃO. É a mesma regra que tirou o CPF duplicado do E9.",
  },
  vinculo: {
    dono: "usuario",
    faz: "Pergunta se a pessoa já recolhe INSS por fora (carteira, aposentadoria, autônomo ou sócio de outra empresa) e quanto.",
    interfere:
      "Não entra no registro da empresa, mas muda o CUSTO do pró-labore. Quem já contribui paga INSS na empresa só sobre a FOLGA até o teto, não sobre o valor cheio.",
    porque:
      "É o dado que impede a gente de sugerir um pró-labore alto sem necessidade. E aproveita pra reenquadrar: na própria empresa não existe CLT, e o pró-labore conta a favor da aposentadoria.",
  },
  socios: {
    dono: "usuario",
    faz: "Confirma se a empresa tem 2º sócio e, se tiver, coleta o nome e a divisão de participação.",
    interfere:
      "A divisão em % vai literalmente no contrato social, e o número de sócios determina a natureza jurídica da tela seguinte. Também define quantas assinaturas o GOV.BR vai exigir no fim.",
    porque:
      "O produto abre com até 2 sócios: é limite nosso, não da lei, e a copy diz isso. A triagem do E5 já barrou 3+ lá atrás, então aqui é só trava de segurança — por isso deixou de ter peso de alerta.",
  },
  empresa: {
    dono: "usuario",
    faz: "Endereço da empresa (CEP puxa o resto), índice do IPTU, tipo do imóvel, residência de sócio e capital social.",
    interfere:
      "É a tela mais pesada da constituição. O índice do IPTU é OBRIGATÓRIO: sem ele a documentação não passa na JUCEMG. O capital social vai no contrato. E se o endereço é residência de sócio, muda a análise de viabilidade da prefeitura.",
    porque:
      "Área utilizada e atividade inócua a gente resolve por dentro, sem perguntar — são dados que derivamos do CNAE. Só pedimos o que ninguém consegue adivinhar. E quem não tem endereço comercial compra o nosso aqui, em vez de travar.",
  },
  "cnae-secundarios": {
    dono: "usuario",
    faz: "Oferece atividades secundárias pra somar à principal, que já foi travada lá no Encaixe.",
    interfere:
      "Os CNAEs secundários entram no CNPJ e no objeto social. Errar aqui é o que faz a empresa nascer impedida de faturar algo que ela de fato faz.",
    porque:
      "A regra dura: só sugerimos secundárias de MESMO IMPOSTO que a principal (mesmo Anexo, mesma dependência de Fator R). O que trocaria o regime não aparece nem com aviso — a feature-âncora existe pra baixar imposto, não pra subir sem a pessoa perceber.",
  },
  natureza: {
    dono: "usuario",
    faz: "Sugere o formato jurídico (dono único ou sociedade) a partir do número de sócios, e deixa mudar.",
    interfere:
      "Define o tipo do registro na Junta e o modelo de contrato social. Escolher dono único tendo sócio é impossível, e a tela bloqueia com a correção na mão.",
    porque:
      "A recomendação nunca é uma trava: só a incoerência é. O CNPJ real do Pedro saiu LTDA num caso solo, então o produto sugere, explica, e deixa a pessoa decidir.",
  },
  nome: {
    dono: "usuario",
    faz: "Três opções de razão social pra ordenar por prioridade, mais o objeto social sugerido e o nome fantasia.",
    interfere:
      "É o último dado da coleta. A Junta pode recusar um nome já existente — por isso pedimos 3 e tentamos em ordem, sem voltar pra incomodar o cliente a cada tentativa.",
    porque:
      "Não existe API pra consultar disponibilidade na JUCEMG antes de protocolar. O 'nome disponível' ao vivo que a tela tinha antes MENTIA. Três opções ordenadas é a honestidade possível: prometemos o que dá pra cumprir.",
  },

  fim: {
    dono: null,
    faz: "Fim do dossiê. Daqui o cliente vai pro A1 (revisar o que foi montado) e pro A2 (o termo irreversível), que autoriza a abertura de fato.",
    interfere:
      "É o ponto em que o documento está completo e a máquina liga: viabilidade na JUCEMG, registro, CNPJ e enquadramento no Simples.",
    porque:
      "Próxima fase da demo: a APROVAÇÃO (A1–A5), onde aparecem as pausas de ÓRGÃO — as que não dependem nem do cliente nem da gente, e que são justamente as mais difíceis de explicar sem um painel.",
  },

  /* ═══════════════════ APROVAÇÃO (A1–A5) ══════════════════════════════════
     Do "está tudo certo?" ao CNPJ ativo. Diferença de tom em relação a
     Entrada/Constituição: aqui o cliente já pagou e já preencheu — o que
     resta é AUTORIZAR e depois ESPERAR o órgão. Por isso a partir do A3 o
     "dono da pausa" vira 🟦 nossa (ou "espera de terceiro"): não há mais
     formulário pra avançar, só status. */

  revisar: {
    dono: "usuario",
    faz: "Mostra tudo que foi preenchido, bloco por bloco, com 'ajustar' em cada um. É leitura, não formulário.",
    interfere:
      "É o último ponto em que corrigir é de graça. A tela seguinte (A2) é irreversível: depois dela, a Junta já está sendo protocolada com esses dados.",
    porque:
      "Ninguém deveria autorizar um registro que nunca viu inteiro. O enquadramento aparece como SUGESTÃO (não escolha manual): o antigo simulador pré-empresa foi dissolvido em 28/07, porque gerava mais dúvida que clareza antes de a empresa existir.",
  },
  termo: {
    dono: "usuario",
    faz: "Pede autorização explícita pra começar o registro de verdade. É o ponto sem volta do fluxo inteiro.",
    interfere:
      "A partir do aceite, a taxa da Junta (já paga no E9) é gasta e o protocolo começa. Antes disso, tudo ainda é reversível (CDC art. 49).",
    porque:
      "O antigo T18 juntava contrato reversível e autorização irreversível na mesma tela — problema jurídico e de tom. Racharam em duas: E8 (contrato, não assusta) e este A2 (autorização, existe pra assustar exatamente o necessário, nem mais nem menos).",
  },
  painel: {
    dono: "nossa",
    faz: "Timeline do que está rolando na Junta, Receita e Prefeitura. Sem CTA de avançar: é status, não formulário.",
    interfere:
      "Nada mais depende do cliente até o CNPJ sair (ou até um órgão recusar algo). É o pipeline assíncrono rodando — dias, não minutos.",
    porque:
      "Sem painel, quem pagou e nunca mais viu nada acha que comprou e ninguém fez nada. Cada etapa mostra se é 'a vez do órgão' ou 'precisamos de você' (o 4º estado, recusa) — nunca um limbo mudo.",
  },
  "painel-recusa": {
    dono: "nossa",
    faz: "O 4º estado do painel: a Junta reprovou as 3 opções de nome que a pessoa priorizou lá no C7, apesar do retry automático.",
    interfere: "A constituição PARA até o cliente sugerir 3 novos nomes — é a única pausa da Aprovação que volta a depender dele, não do órgão.",
    porque: "Vermelho legítimo (um órgão externo parou a fila mesmo) + 'precisa de você' + a ação, tudo DENTRO do pipeline — nunca um limbo mudo (UX-40). Produção tenta as 3 opções sozinha antes de chegar aqui; a demo pula direto pro pior caso.",
  },
  // 🆕 26/08 (reunião Rua Satélite 36, item 7) — A3.2, entre painel-recusa e
  // assinatura. Certificado passou a ser validado ANTES de assinar.
  certificado: {
    dono: "usuario",
    faz: "Pergunta se a pessoa já tem certificado digital: quem tem, sobe arquivo (.pfx/.p12) + senha; quem não tem, agenda entrevista com a certificadora parceira.",
    interfere:
      "A assinatura que vem em seguida inclui a procuração eletrônica, e a procuração EXIGE certificado já validado. Sem essa tela antes, a assinatura ficaria pela metade.",
    porque:
      "Existia um `/certificado` antigo (N24), removido como órfão em 30/07 — nada navegava até lá, porque vinha DEPOIS da assinatura (ordem que a própria reunião apontou como inconsistente). Este é novo, na posição certa: antes, não depois.",
  },
  assinatura: {
    dono: "usuario",
    faz: "Pede a assinatura via GOV.BR (todos os sócios, quando há mais de um) e explica a procuração eletrônica que acompanha.",
    interfere:
      "A Junta só registra com a assinatura de quem é sócio. Nível GOV.BR abaixo de prata trava a assinatura — por isso o gate de nível mora dobrado aqui (A4G no mapa).",
    porque:
      "Com 2 sócios, ninguém assina pelo outro: o parceiro confirma os próprios dados e o custo antes de assinar (consenso antes do commit). Evita o cenário 'um decidiu e o outro descobriu depois'.",
  },
  ativacao: {
    dono: "usuario",
    faz: "A home do dia-1: celebra o CNPJ nascido e vira uma trilha de ativação. 🔄 26/08: certificado já vem 'feito' (validado antes de assinar, na A3.2) — quem vira o passo 'agora' é conferir os dados da empresa.",
    interfere:
      "Antes o certificado era pré-requisito verificado AQUI; agora essa verificação já aconteceu na A3.2, antes da assinatura. Empresa recém-nascida ainda não tem o que vigiar de imposto (faturamento zero) — por isso a home não é a de regime.",
    porque:
      "🔓 SWAP validado (29/07): é ESTA tela que vem depois da assinatura, não a antiga 'empresa ativa' (3 primeiros passos, removida 30/07) nem o gate isolado de certificado. Sem confete no hero de nascimento, por pedido explícito — mesmo padrão do dia (a celebração saiu do CTA do veredito 🟢 e a materialização saiu da tela antiga).",
  },

  /* ═══════════════════ MIGRAR DE CONTADOR (decimal de Entrada) ═══════════
     Ramo decimal: sai do fork E4 (quem já tem CNPJ) e reencontra o tronco só
     no pagamento (E9). Era o blind spot mais antigo do projeto — "metade do
     mercado, zero testado" desde 15/07. Construído em 30/07. */

  "m-cnpj": {
    dono: "usuario",
    faz: "Pede só o CNPJ e puxa tudo da Receita: atividade, tipo, porte, endereço. Mostra o cartão e o veredito na mesma tela.",
    interfere:
      "Não interfere na constituição — a empresa já existe. O que se decide aqui é se a gente ATENDE essa empresa: atividade de serviço, no Simples, sem conselho de classe.",
    porque:
      "É a maior diferença em relação ao caminho abrir: aqui NÃO existe entrevista de atividade. O CNAE já está registrado, então a gente lê em vez de perguntar. Todo o E5 (pills, IA, desambiguação) desaparece — e com ele o risco de a IA errar a interpretação.",
  },
  // 🆕 26/08 — E4.3 estava faltando na sequência da demo (ver ETAPAS_MIGRAR).
  "m-diagnostico": {
    dono: "usuario",
    faz: "Pergunta se a pessoa já tem certificado digital — decide se a gente reaproveita o que ela tem ou providencia um novo.",
    interfere:
      "Define o resto do pipeline pós-pagamento: com certificado, a procuração é só atualizada; sem, a gente emite um novo em paralelo à transferência (uma coisa não trava a outra).",
    porque:
      "🔄 06/08: a tela mudou de escopo (era sobre Fator R, cortado por falta de API pré-pagamento; virou 'tem certificado?') e passou a valer pros 2 regimes — mas ninguém trouxe a mudança de volta pra sequência da demo até agora.",
  },
  "m-cnpj-inapto": {
    dono: "nossa",
    faz: "Saída do M1 quando a Receita mostra a empresa com situação diferente de ativa (suspensa, inapta, baixada).",
    interfere:
      "A migração para inteiramente: sem situação ativa não dá pra transferir responsabilidade nem declarar nada em nome da empresa. Regularização vem antes de qualquer coisa.",
    porque:
      "O componente (`onSaidaInapto`) existe desde 04/08, mas a demo nunca ligou o callback — CNPJ inapto simplesmente não tinha pra onde ir aqui até esta correção.",
  },
  "m-plano": {
    dono: "usuario",
    faz: "A conta da migração: transferência grátis + a mensalidade. Nada além disso.",
    interfere:
      "Nenhuma taxa de governo incide aqui. A empresa já existe, então não há DAE da Junta nem TFLF a pagar.",
    porque:
      "É vantagem concreta sobre o caminho abrir, e a tela diz isso em vez de só omitir. Na abertura o cliente leva um choque de ~R$463 na 3ª tela; aqui ele vê só a mensalidade. Trocar de contador não custa nada aos órgãos.",
  },
  "m-contrato": {
    dono: "usuario",
    faz: "Aceite do contrato, com a conta em números e a promessa de devolução se a transferência não sair.",
    interfere:
      "É onde a pessoa vira cliente. A partir daqui a gente aciona o contador antigo dela.",
    porque:
      "🔴 A linha da devolução é a contrapartida obrigatória da decisão de cobrar ANTES da transferência. Como o destravamento depende do contador antigo (um terceiro que está perdendo o cliente), o cliente precisa saber antes de pagar o que acontece se travar. Sem essa promessa, a decisão de cobrar antes seria cobrar por um resultado que a gente não controla.",
  },
  "m-pagamento": {
    dono: "usuario",
    faz: "Mesma tela do E9, sem somar taxa de governo. O aviso fala de migração: 'a gente já aciona seu contador anterior'.",
    interfere:
      "O pagamento é o gatilho: é ele que autoriza a gente a acionar o escritório antigo e abrir a transferência no conselho.",
    porque:
      "💰 Decisão travada em 30/07: cobra ANTES da transferência, igual ao caminho abrir. O risco assumido está dito na cara — a gente cobra por algo cujo destravamento depende de terceiro. Por isso o contrato promete devolução e a tela de transferência tem um estado dedicado pra quando trava.",
  },
  "m-contador": {
    dono: "usuario",
    faz: "Pede nome, e-mail, telefone e CRC do contador atual. Pré-preenche o e-mail/telefone quando o cartão CNPJ trouxe.",
    interfere:
      "É o dado que abre a transferência: sem saber quem é o contador atual, a gente não consegue se indicar como novo responsável no CRC-MG.",
    porque:
      "🆕 06/08 (reunião Rua Satélite 19, Léo) — não existe API pública que devolva 'quem é o contador de um CNPJ'. O caminho real é o cartão CNPJ, que na maioria das vezes traz o e-mail/telefone do escritório (é pra lá que a Receita manda intimação). Não vem sempre — por isso não trava o Continuar: quem não sabe algum dado segue mesmo assim, a gente confirma o resto com o conselho.",
  },
  "m-dados": {
    dono: "usuario",
    faz: "Pede CPF, RG e estado civil — os únicos dados de pessoa física que o cartão CNPJ não traz.",
    interfere:
      "Sem isso, a procuração não tem como sair: são dados de pessoa física, não de empresa, e o e-CAC só libera com o GOV.BR do próprio cliente.",
    porque:
      "🆕 24/08 (reunião Leonan 19/08, achado tardio) — 'fica até disponível, mas fica lá dentro do e-CAC' (Leonan). Entra DEPOIS do contador atual e ANTES da transferência — a reunião foi explícita sobre essa ordem, corrigido de uma 1ª tentativa que colocou logo depois do CNPJ.",
  },
  "m-socios": {
    dono: "usuario",
    faz: "MESMA tela do C3 (dossiê de constituição), reusada aqui: nome + % de cada sócio extra, se a empresa tiver mais de um.",
    interfere:
      "Sem os dados de TODOS os sócios, a procuração e a assinatura ficam incompletas — quem assina precisa estar identificado.",
    porque:
      "🆕 24/08 (reunião Leonan 19/08) — Leonan foi explícito: 'ele terminou de preencher a sociedade' é parte de 'preencher TODOS os dados base de uma constituição'. Essa tela simplesmente não existia na migração até esta rodada, apesar da reunião ter travado que precisa.",
  },
  "m-gov": {
    dono: "usuario",
    faz: "Código de 6 dígitos do GOV.BR (janela de 10min) — o mesmo mecanismo do A4 (`CodigoGovView`), mas só pra procuração: não tem protocolo de registro pra assinar, a empresa já existe.",
    interfere:
      "É a procuração que destrava a gente agir em nome do cliente — sem ela, a transferência (m-transferencia) não pode começar.",
    porque:
      "🆕 24/08 (reunião Leonan 19/08) — Léo foi direto: 'mesma coisa, procuração, GOV, acesso ao GOV, mesma coisa do outro [caminho abrir]'. Reusa o componente do A4 em vez de duplicar a lógica do código/janela/tentativas.",
  },
  "m-transferencia": {
    dono: "nossa",
    faz: "Timeline do que está acontecendo: encerrar com o antigo, transferir no conselho, atualizar os órgãos, liberar o acesso.",
    interfere:
      "É a transferência formal da responsabilidade técnica. Sem ela, a gente não pode assinar nada pela empresa nem acessar os sistemas da Receita.",
    porque:
      "🔴 Aqui mora a pausa mais perigosa do produto inteiro: a transferência no conselho é aberta por nós e VALIDADA PELO CONTADOR ANTIGO. Todas as pausas do flow de abertura esperam um órgão neutro ou o próprio cliente. Esta espera um concorrente que está perdendo o cliente para nós.",
  },
  "m-travado": {
    dono: "nossa",
    faz: "O estado de exceção: o contador antigo não validou a transferência. A tela assume o problema e explica o caminho.",
    interfere:
      "A migração fica parada até destravar. O cliente já pagou, então a responsabilidade de resolver é nossa, não dele.",
    porque:
      "É a contrapartida de UX de cobrar antes. A tela não repassa a culpa nem deixa o cliente no limbo: diz que a gente acionou, que o conselho destrava se não houver resposta, e que a gente conduz do começo ao fim. O contrato garante a devolução se nada disso funcionar.",
  },
  "m-ativa": {
    dono: null,
    faz: "Migração concluída. A economia que o diagnóstico prometeu vira a primeira tarefa, com o valor na tela.",
    interfere:
      "A contabilidade passa a ser nossa a partir da data de corte. O cliente não precisa mais falar com o escritório antigo.",
    porque:
      "Fecha o loop do E4.3. No caminho abrir a promessa é estimativa e só se resolve meses depois; aqui o número era real desde a segunda tela, então pode virar ação imediata. Deixar a promessa sumir depois da venda seria repetir o erro que este flow não precisa cometer.",
  },

  /* ═══════════════════ C0.1 · E9.1 — pausas de pagamento ═══════════════════
     ⚠️ NÃO ficam entre C7 e A1. Vivem entre E9 e C1 (mapa: `flow-data.mjs`):
     E9.1 só existe pra quem pagou boleto; C0.1 é reentrada de quem fechou o app. */

  "retomar-cpf": {
    dono: "usuario",
    faz: "Porta de entrada da reentrada (C0.1): pede o CPF antes de mostrar qualquer status. Sem isso, `/retomar` era rota órfã — só alcançável digitando a URL.",
    interfere:
      "É o CPF que decide o resto: se o boleto ainda não compensou, manda pro E9.1 (aguardando); se já pagou, mostra o `retomar` de status normal.",
    porque:
      "🔴 MOCK, RF-01 — não existe backend real de 'status de pagamento por CPF' ainda. O dígito final do CPF decide a ramificação, documentado como mock no código (não é lógica de produção real).",
  },
  retomar: {
    dono: "usuario",
    faz: "Reorienta quem fechou o app e voltou depois: o que já fez, o que falta, e UM próximo passo só.",
    interfere:
      "Não interfere na constituição — é sobre CONTINUIDADE da experiência. Sem ela, quem sai no meio do dossiê volta sem saber se perdeu algo.",
    porque:
      "UX-46: reorientar ≠ restaurar. Devolver a tela exata de onde parou só ajuda quem lembra o que estava fazendo. Quem esqueceu precisa das 3 respostas (o que já fiz, o que falta, o que faço agora), não de 4 pendências pra escolher.",
  },
  aguardando: {
    dono: "usuario",
    faz: "Mostra que o boleto está a caminho e que dá pra adiantar o dossiê inteiro enquanto ele não compensa.",
    interfere:
      "Só os 2 últimos passos (A1 revisar + A2 autorizar) ficam retidos até o pagamento cair — o resto do dossiê (C1–C7) roda livre.",
    porque:
      "Boleto foi mantido fora do happy path (perderia cliente se cortado), mas a tela existe pra matar a 'sensação de travou': espera com tarefa não é espera, é andamento.",
  },
};

const DONO_LABEL: Record<Exclude<Dono, null>, { label: string; cor: string }> = {
  usuario: { label: "🟧 Pausa: usuário", cor: "bg-state-warning-tint text-state-warning-text" },
  nossa: { label: "🟦 Pausa: nossa", cor: "bg-state-info-tint text-state-info-text" },
};

export default function ApresentacaoPage() {
  const [etapa, setEtapa] = useState<Etapa>("splash");
  const [intencao, setIntencao] = useState<Intencao | null>(null);
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);
  const [sabeCodigo, setSabeCodigo] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const [enviadoV, setEnviadoV] = useState(false);

  /**
   * Nonce do "✨ Preencher automático" nas telas do dossiê. Cada clique
   * incrementa; as Views escutam a MUDANÇA (não o valor), então clicar de novo
   * na mesma tela preenche de novo — apresentar é repetir.
   */
  const [preenchimento, setPreenchimento] = useState(0);

  // Captura da saída de cidade (separada da do veredito: são telas distintas
  // e preencher uma não pode contaminar a outra).
  // 🔴 28/08 (pedido do Pedro) — `nomeS`/`contatoS` SAÍRAM: já vêm do E3.1.
  const [cidadeS, setCidadeS] = useState("");
  const [enviadoS, setEnviadoS] = useState(false);

  // 🆕 26/08 — captura da saída "CNPJ inapto" (m-cnpj-inapto).
  // 🔴 28/08 (pedido do Pedro) — `nomeCnpjInapto`/`contatoCnpjInapto` SAÍRAM.
  const [enviadoCnpjInapto, setEnviadoCnpjInapto] = useState(false);

  // ── 🆕 28/08 · estado do RAMO MEI ────────────────────────────────────────
  // Mesma doutrina do resto da demo: o estado das telas novas mora aqui, e os
  // componentes são os mesmos que a produção renderiza.
  const [impedimentosDemo, setImpedimentosDemo] = useState<
    Record<string, boolean | null>
  >(Object.fromEntries(IMPEDIMENTOS.map((i) => [i.id, null])));
  const [cienteBeneficioDemo, setCienteBeneficioDemo] = useState(false);
  const [ocupacaoDemo, setOcupacaoDemo] = useState<string | null>(null);
  const [secundariasDemo, setSecundariasDemo] = useState<string[]>([]);
  const [govBrOkDemo, setGovBrOkDemo] = useState(false);

  const [socios, setSocios] = useState<number | null>(null);
  const [exterior, setExterior] = useState<boolean | null>(null);
  // 🆕 24/08 (reunião Leonan 19/08 + pedido do Pedro) — CPF/CNPJ do sócio.
  const [socioTipo, setSocioTipo] = useState<"cpf" | "cnpj" | null>(null);

  const [faixaEsc, setFaixaEsc] = useState<string | null>(null);
  const [modoExato, setModoExato] = useState(false);
  const [exato, setExato] = useState("");
  // 🆕 26/08 (reunião Rua Satélite 36, item 2) — escolha de endereço, realocada
  // do C4 (dossiê) pro E5F (faixa), antes até do cadastro.
  const [enderecoProprioDemo, setEnderecoProprioDemo] = useState<boolean | null>(null);
  // 🆕 27/08 — estado das 2 telas novas de captura de lead (E3.1 e E3.3).
  const [dadosLead, setDadosLead] = useState<DadosLead>({
    nome: "",
    sobrenome: "",
    email: "",
    telefone: "",
  });
  // 🆕 29/08 — E3.2 (MEI×ME), faltava na demo.
  const [regimeDemo, setRegimeDemo] = useState<"mei" | "me" | null>(null);
  const [cepDemo, setCepDemo] = useState("");
  const [numeroDemo, setNumeroDemo] = useState("");
  const [complementoDemo, setComplementoDemo] = useState("");

  // Qual cenário está armado no campo (só pra o painel antecipar o desfecho
  // antes de validar). null = campo livre / digitado na mão.
  const [cenarioArmado, setCenarioArmado] = useState<string | null>(null);

  // Nota técnica da tela deslinkada: escondida por padrão (não é conteúdo da
  // apresentação). `visivel` = hover no selo; `fixada` = clique, pra conseguir
  // ler com calma sem manter o mouse parado.
  const [notaVisivel, setNotaVisivel] = useState(false);
  const [notaFixada, setNotaFixada] = useState(false);

  // ── ENTRADA · a travessia do dinheiro (E6→E9) ──────────────────────────
  const [dadosConta, setDadosConta] = useState<DadosConta>({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    cep: "",
    numero: "",
    complemento: "",
    coorte: null,
    codigo: "",
  });
  const [aceite, setAceite] = useState(false);
  const [cpfPag, setCpfPag] = useState("");
  const [metodo, setMetodo] = useState<Metodo>("cartao");

  // ── "Voltar de onde parei" (30/08, pedido do Pedro) ────────────────────
  // 4ª saída do fork (`EntradaView`, prop `onRetomar`), real em produção
  // também: pede CPF (`RetomarCpfView`) e ramifica: dígito final PAR → já
  // pagou, cai no C0.1 (retomar de onde parou); ÍMPAR → boleto ainda não
  // compensou, cai no E9.1 (aguardando). 🔴 MOCK, RF-01 — mesma regra do
  // wrapper de produção `/retomar/page.tsx`.
  const [cpfRetomar, setCpfRetomar] = useState("");

  // ── Aprovação (A2) ─────────────────────────────────────────────────────
  // Estado PRÓPRIO, separado do aceite do contrato (E9): são dois consentimentos
  // jurídicos distintos (reversível × irreversível). Reusar o mesmo booleano
  // faria o A2 nascer pré-marcado só porque o contrato já foi aceito antes.
  const [aceiteTermo, setAceiteTermo] = useState(false);

  // ── Migrar (decimal de Entrada) ────────────────────────────────────────
  // Aceite PRÓPRIO: o contrato da migração é outro documento (promete devolução
  // se a transferência travar). Reusar o `aceite` do E8 faria o E4.5 nascer
  // pré-marcado pra quem tivesse passado pelo caminho abrir na mesma sessão.
  const [aceiteMigrar, setAceiteMigrar] = useState(false);

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
    enviadoV,
    cidadeS,
    enviadoS,
    socios,
    exterior,
    socioTipo,
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
    setEnviadoV(s.enviadoV);
    setCidadeS(s.cidadeS);
    setEnviadoS(s.enviadoS);
    setSocios(s.socios);
    setExterior(s.exterior);
    setSocioTipo(s.socioTipo);
    setFaixaEsc(s.faixaEsc);
    setModoExato(s.modoExato);
    setExato(s.exato);
    setCenarioArmado(s.cenarioArmado);
  }

  /**
   * VOLTAR — desempilha e restaura. É a ÚNICA forma de andar pra trás na demo.
   *
   * 🐛 FIX 29/07: antes cada botão de volta (seta externa · "Voltar" do E3 ·
   * seta do E5 · "refazer" do veredito) fazia `setEtapa(...)` por conta
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
    setEtapa("splash");
    setIntencao(null);
    setTexto("");
    setCategoria(null);
    setSabeCodigo(false);
    setResultado(null);
    setCenarioArmado(null);
    setEnviadoV(false);
    setCidadeS("");
    setEnviadoS(false);
    setSocios(null);
    setExterior(null);
    setSocioTipo(null);
    setFaixaEsc(null);
    setModoExato(false);
    setExato("");
    setDadosConta({
      nome: "",
      cpf: "",
      telefone: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      cep: "",
      numero: "",
    complemento: "",
      coorte: null,
      codigo: "",
    });
    setAceite(false);
    setCpfPag("");
    setMetodo("cartao");
    setAceiteTermo(false);
    setAceiteMigrar(false);
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
      // Cidade canônica do IBGE — o mesmo formato que o autocomplete devolve.
      // 🔴 28/08 — nome/contato SAÍRAM daqui junto com o campo (já vêm do E3.1).
      setCidadeS("Uberlândia - Minas Gerais");
    } else if (etapa === "conta") {
      // Mesma pessoa do resto da demo: o dado precisa ser coeso até o fim.
      setDadosConta({
        nome: "Ana Beatriz Ramos",
        cpf: "123.456.789-00",
        telefone: "(31) 98888-7766",
        email: "ana.beatriz@email.com",
        senha: "legalizai2026",
        confirmarSenha: "legalizai2026",
        cep: "30140-060",
        numero: "1000",
        complemento: "",
        coorte: "primeira",
        codigo: "",
      });
    } else if (etapa === "conta-codigo") {
      setDadosConta((p) => ({ ...p, codigo: "482913" }));
    } else if (etapa === "pagamento") {
      // 🔄 30/08 (pedido do Pedro) — E8 (Contrato) foi ELIMINADO do fluxo; o
      // aceite (`aceite`/`setAceite`) subiu pra dentro do E9 (Pagamento).
      setAceite(true);
      setCpfPag("123.456.789-00");
      setMetodo("cartao");
    } else if (etapa === "termo") {
      setAceiteTermo(true);
    } else if (etapa === "m-contrato") {
      setAceiteMigrar(true);
    } else if (etapa === "m-cnpj") {
      // O CNPJ é estado INTERNO do MigrarCnpjView (mesmo caso do dossiê), então
      // a demo não escreve nele: incrementa o nonce e a tela se preenche.
      setPreenchimento((n) => n + 1);
    } else if (noDossie(etapa)) {
      /**
       * 🐛 29/07 — AQUI NÃO EXISTIA RAMO NENHUM, e o botão aparecia mesmo
       * assim: `mostraPreencher` liga por `naTravessia`, que passou a incluir
       * o dossiê quando as 7 telas entraram na demo. Resultado: "✨ Preencher
       * automático" visível e inerte nas 7. Botão que não responde numa
       * apresentação é pior que botão ausente.
       *
       * A demo NÃO mexe nos campos internos das telas — ela não os conhece, e
       * passar a conhecer recriaria o acoplamento que a fidelidade por
       * construção existe pra evitar. Ela só incrementa um nonce; cada View
       * sabe se preencher (ver `usePreencher` em `wizard-dossie.tsx`).
       */
      setPreenchimento((n) => n + 1);
    }
  }

  function simularValidacao() {
    // 🔴 28/08 — nome/contato SAÍRAM (já vêm do E3.1); só resta "enviado".
    setEnviadoV(true);
  }

  /**
   * ✈️ PULAR PRA QUALQUER TELA — barra de pills no rodapé (29/07).
   *
   * Motivo: depois de cada edição de código o Fast Refresh reseta o estado da
   * demo pro `fork`, e reandar o flow inteiro (E3→C7) só pra chegar na tela
   * que acabou de mudar é lento. As pills navegam direto.
   *
   * `setEtapa` sozinho não bastaria: telas do meio do flow (`triagem`,
   * `faixa`, `conta`, `contrato`, `pagamento`, `veredito`…) leem dado que só
   * existe se as telas ANTERIORES foram andadas — pular direto renderizaria
   * formulário vazio ou (no caso do veredito) a tela nem existe sem
   * `resultado`. Por isso esta função garante, IDEMPOTENTE (só preenche o que
   * ainda está vazio — não pisa em edição ao vivo), os dados de que cada
   * trecho do flow depende, na mesma ordem em que o flow real os produziria.
   */
  function pularPara(alvo: Etapa) {
    if (!resultado) setResultado(mapear(""));
    if (socios === null) setSocios(1);
    if (exterior === null) setExterior(false);
    if (faixaEsc === null) setFaixaEsc("20-30k");
    if (!dadosConta.nome) {
      setDadosConta({
        nome: "Ana Beatriz Ramos",
        cpf: "123.456.789-00",
        telefone: "(31) 98888-7766",
        email: "ana.beatriz@email.com",
        senha: "legalizai2026",
        confirmarSenha: "legalizai2026",
        cep: "30140-060",
        numero: "1000",
        complemento: "",
        coorte: "primeira",
        codigo: "482913",
      });
    }
    if (!aceite) setAceite(true);
    if (!cpfPag) setCpfPag("123.456.789-00");
    // Aprovação: termo/painel/assinatura/ativa pressupõem o aceite do A2 já
    // dado — sem isso o A2, se alguém voltasse até lá, mostraria o CTA
    // travado por engano.
    if (!aceiteTermo) setAceiteTermo(true);
    // Migrar: sem isso, pular direto pro E4.5 mostraria o CTA travado (o
    // checkbox nasce desmarcado e ninguém marcou).
    if (!aceiteMigrar) setAceiteMigrar(true);
    // A pilha de "voltar" não faz sentido pra um salto: zera, senão a seta
    // externa devolveria pra uma tela de trás do salto, não de trás do fluxo.
    setHistorico([]);
    momentoAnterior.current = null;
    anterior.current = null;
    setEtapa(alvo);
  }

  /** Ordem real do flow — a mesma ordem das pills no rodapé. */
  const PILLS: { etapa: Etapa; label: string }[] = [
    { etapa: "splash", label: "E1 · Splash" },
    { etapa: "welcome", label: "E2 · Welcome" },
    { etapa: "fork", label: "E3 · Fork" },
    { etapa: "dados", label: "🆕 E3.1 · Seus dados" },
    { etapa: "mei-ou-me", label: "🆕 E3.2 · MEI × ME" },
    { etapa: "endereco", label: "🆕 E3.3 · Endereço + categoria" },
    { etapa: "triagem", label: "E5 · Triagem" },
    { etapa: "faixa", label: "E5 · Faixa" },
    { etapa: "conta", label: "E6 · Conta" },
    { etapa: "conta-codigo", label: "E6 · Código" },
    { etapa: "plano", label: "E7 · Plano" },
    { etapa: "pagamento", label: "🔄 E9 · Pagamento + contrato" },
    // 🔄 27/08 — atividade + veredito ATRAVESSARAM o pagamento: viraram a C0,
    // primeira tela do dossiê. Ver `app/(app)/dossie/atividade/page.tsx`.
    { etapa: "perguntando", label: "🔄 C0 · Sua atividade" },
    { etapa: "veredito", label: "🔄 C0 · CNAE encontrado" },
    // 🔄 28/08 (pedido do Pedro) — C5 mudou de lugar: era a 5ª tela do
    // dossiê (entre C4 e C6), agora é a 1ª, logo após o veredito da C0.
    { etapa: "cnae-secundarios", label: "C5 · Secundários" },
    { etapa: "socio", label: "C1 · Seus dados" },
    { etapa: "vinculo", label: "C2 · Vínculo" },
    { etapa: "socios", label: "C3 · Sócios" },
    { etapa: "empresa", label: "C4 · Empresa" },
    { etapa: "natureza", label: "C6 · Natureza" },
    { etapa: "nome", label: "C7 · Nome" },
    { etapa: "revisar", label: "A1 · Revisar" },
    { etapa: "termo", label: "A2 · Termo" },
    { etapa: "painel", label: "A3 · Painel" },
    { etapa: "certificado", label: "🆕 A3.2 · Certificado" },
    { etapa: "assinatura", label: "A4 · Assinatura" },
    { etapa: "ativacao", label: "🔓 A5 · Ativação" },
    { etapa: "fim", label: "Fim" },
  ];

  /**
   * As pausas de pagamento (C0.1/E9.1, entre E9 e C1) não são sequência — por
   * isso ficam numa barra separada, não na `PILLS` principal (ver comentário
   * no `type Etapa`).
   */
  const PILLS_PAUSA: { etapa: Etapa; label: string }[] = [
    { etapa: "retomar-cpf", label: "🆕 C0.1 · Voltar de onde parei" },
    { etapa: "retomar", label: "🆕 C0.1 · Retomar" },
    { etapa: "aguardando", label: "🆕 E9.1 · Aguardando boleto" },
  ];

  /**
   * MIGRAR — barra própria, porque é um RAMO decimal de Entrada (E4/E9), não
   * continuação sequencial. Misturar na fila de cima sugeriria que E4.2 vem
   * depois de A5, o que é falso: ele sai do fork E4 e reencontra o tronco só
   * no pagamento (E9).
   */
  const PILLS_MIGRAR: { etapa: Etapa; label: string }[] = [
    { etapa: "m-cnpj", label: "E4.2 · Seu CNPJ" },
    { etapa: "m-diagnostico", label: "🆕 E4.3 · Tem certificado?" },
    { etapa: "m-plano", label: "E4.4 · A conta" },
    { etapa: "m-contrato", label: "E4.5 · Contrato" },
    { etapa: "m-pagamento", label: "E9 · Pagamento" },
    { etapa: "m-contador", label: "🆕 E9.2 · Seu contador" },
    { etapa: "m-dados", label: "🆕 E9.2b · Seus dados" },
    { etapa: "m-socios", label: "🆕 E9.2c · Sócios" },
    { etapa: "m-gov", label: "🆕 E9.2d · GOV + procuração" },
    { etapa: "m-transferencia", label: "E9.3 · Transferência" },
    { etapa: "m-travado", label: "🔴 E9.3 · TTRT travado" },
    { etapa: "m-ativa", label: "E9.4 · Migrada" },
  ];

  const momento: Momento =
    etapa === "splash"
      ? "splash"
      : etapa === "welcome"
        ? "welcome"
        : etapa === "fork"
      ? "fork"
      : etapa === "dados"
        ? "dados"
        : etapa === "mei-ou-me"
          ? "mei-ou-me"
        : etapa === "endereco"
        ? "endereco"
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
                  : etapa === "saida-exterior"
                    ? "saida-exterior"
                    : etapa === "saida-socios"
                      ? "saida-socios"
                      : etapa === "saida-socio-pj"
                        ? "saida-socio-pj"
                        : etapa === "m-cnpj-inapto"
                          ? "m-cnpj-inapto"
                          : etapa === "m-impedimento" ||
                              etapa === "m-ocupacao" ||
                              etapa === "m-proximos-passos" ||
                              etapa === "m-certificado" ||
                              etapa === "saida-mei-outra-empresa" ||
                              etapa === "saida-mei-servidor"
                            ? etapa
                  : etapa === "conta"
                    ? "conta"
                    : etapa === "conta-codigo"
                      ? "conta-codigo"
                      : etapa === "plano"
                        ? "plano"
                        : etapa === "pagamento"
                          ? "pagamento"
                            : noDossie(etapa) ||
                                naCauda(etapa) ||
                                naEspera(etapa) ||
                                noMigrar(etapa)
                              ? etapa
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
  const naEntrada = etapa === "fork";
  const naSaidaCidade = etapa === "fora-bh";
  const naSaidaTriagem =
    etapa === "saida-exterior" || etapa === "saida-socios" || etapa === "saida-socio-pj";
  // 🆕 28/08 — as 2 saídas de impedimento do ramo MEI. As 3 telas exclusivas
  // (m-impedimento, m-ocupacao, m-proximos-passos) são checadas inline no
  // render: cada uma tem props próprias e não compartilha shell como estas.
  const naSaidaMei =
    etapa === "saida-mei-outra-empresa" || etapa === "saida-mei-servidor";

  const naTravessia =
    // 🆕 27/08 — E3.1/E3.3 trazem o próprio header+main (TelaHeader), igual às
    // telas do dinheiro. Por isso entram aqui, não no bloco genérico.
    etapa === "dados" ||
    etapa === "mei-ou-me" ||
    etapa === "endereco" ||
    etapa === "conta" ||
    etapa === "conta-codigo" ||
    etapa === "plano" ||
    etapa === "pagamento" ||
    // O dossiê usa o mesmo shell de tela cheia da travessia do dinheiro: são
    // telas de coleta, sem navbar, dentro do aparelho.
    noDossie(etapa) ||
    // A Aprovação (A1–A5) e as 2 pausas (C0.1/E9.1) seguem o mesmo shell —
    // todas trazem o próprio header+main, igual às de cima.
    naCauda(etapa) ||
    naEspera(etapa) ||
    // Migrar inteiro também: são telas de tela-cheia, sem navbar.
    noMigrar(etapa);
  const mostraPreencher =
    etapa === "triagem" ||
    etapa === "faixa" ||
    (etapa === "fora-bh" && !enviadoS) ||
    // ⚠️ 29/07 — "natureza" saiu daqui. A tela virou condicional (só existe o
    // formato que bate com o nº de sócios, já selecionado): não sobrou campo
    // nenhum pra preencher. Botão sem função é pior que botão ausente.
    // "revisar", "painel", "assinatura", "ativacao", "retomar",
    // "aguardando" nunca entram: são recap/status/home/aceite sem campo
    // livre — só "termo" tem um checkbox (o aceite irreversível).
    // 🐛 30/07 — o MIGRAR quase repetiu o BUG-08. `naTravessia` passou a
    // incluir as telas de migração, então o botão apareceria nas 9 — e o
    // `preencherEtapa` só conheceria 2 delas. Em vez de listar exceção por
    // exceção (que foi o que deixou o bug passar da 1ª vez), a regra agora é
    // POSITIVA: só mostra onde existe campo livre pra preencher.
    (naTravessia &&
      etapa !== "natureza" &&
      etapa !== "revisar" &&
      etapa !== "painel" &&
      etapa !== "assinatura" &&
      etapa !== "ativacao" &&
      etapa !== "retomar" &&
      etapa !== "aguardando" &&
      // Do Migrar, só estas 2 têm o que preencher: o CNPJ (input) e o aceite
      // (checkbox). Diagnóstico, plano, passivo, transferência, travado e
      // migrada são leitura/status — botão ali seria inerte. `m-contador`
      // (🆕 06/08) TEM campos livres, mas fica de fora de propósito: o ponto
      // da tela é mostrar o prefill PARCIAL (e-mail/telefone às vezes vêm,
      // nome/CRC nunca vêm) — um botão de preencher tudo escondia isso.
      (!noMigrar(etapa) || etapa === "m-cnpj" || etapa === "m-contrato"));
  const mostraSimularValidacao = momento === "veredito-waitlist" || momento === "veredito-mauro";
  // 🆕 03/08 — atalho pro A3.1 (gap fechado): produção só chega lá por retry
  // automático mockado, sem interação real pra demo replicar.
  const mostraSimularRecusa = momento === "painel";
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
              Da splash (E1) ao pagamento (E9). As telas são as aprovadas (mesmo componente
              do app), não maquete. Escolha um cenário pra preencher o campo e avance
              pelos botões de dentro do aparelho.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={reiniciar}
              className="rounded-full border border-border-hairline bg-surface-card px-4 py-2 text-caption font-semibold text-text-secondary transition-colors hover:border-border-strong"
            >
              ↺ Reiniciar demo
            </button>
          </div>
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
              {mostraSimularRecusa && (
                <button
                  onClick={() => setEtapa("painel-recusa")}
                  className="rounded-xl bg-surface-dark px-4 py-2.5 text-caption font-bold text-text-on-dark transition-colors hover:opacity-90"
                >
                  🔴 Simular recusa de nome
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
                {/* Status bar clara só na splash: é a única tela de fundo coral. */}
                <MolduraAparelho statusClaro={etapa === "splash"}>
                  {/* `.app-page` usa height:100dvh (viewport). Dentro da moldura
                      o teto é a altura DELA, então sobrescreve pra 100%. */}
                  <div className="app-page" style={{ height: "100%" }}>
                    {etapa === "splash" ? (
                      // 🆕 11/08 — SplashView não tem CTA (produção também não
                      // liga a próxima rota, ver nota no cabeçalho do arquivo).
                      // A tela inteira vira botão SÓ na demo, pra dar pra seguir.
                      // ⚠️ `transform` aqui não é estético: o `fixed inset-0` da
                      // SplashView precisa de um ancestral próximo que crie
                      // containing block pra fixed, senão ele escapa do recorte
                      // arredondado do aparelho (`overflow-hidden` do MolduraAparelho
                      // só clipa quem está na cadeia de containing block).
                      //
                      // 🆕 18/08 — `absolute inset-0` em vez de `h-full w-full`.
                      // A splash é a ÚNICA tela que sangra até o vidro, e como
                      // filha normal ela herdava o recuo do `.app-page`
                      // (padding-inline 24px + padding-top do safe-top): o coral
                      // ficava numa ilha branca. Absoluto resolve contra a caixa
                      // de PADDING do `.app-page` (que é `position:relative`),
                      // então cobre os 430×932 inteiros. Sem z-index de propósito:
                      // a status bar (z-10) e a Dynamic Island (z-20) continuam
                      // pintando por cima, que é o que o aparelho real faz.
                      <button
                        type="button"
                        onClick={() => setEtapa("welcome")}
                        aria-label="Continuar"
                        className="absolute inset-0 block text-left"
                        style={{ transform: "translateZ(0)" }}
                      >
                        <SplashView />
                      </button>
                    ) : etapa === "welcome" ? (
                      // WelcomeView traz o próprio header+main. Pular e terminar
                      // os 3 slides levam pro mesmo lugar que em produção: /entrada.
                      // 🐛 29/08 — o fundo full-bleed do slide "card" chegou a
                      // usar `fixed inset-0`, o que exigia um wrapper com
                      // `transform` aqui igual à Splash (2 comentários acima).
                      // Trocado por `absolute inset-0` (ancorado no próprio
                      // `.app-page`, já `position:relative`) dentro do
                      // `welcome.tsx` — não precisa mais de wrapper nenhum aqui.
                      <WelcomeView
                        onPular={() => setEtapa("fork")}
                        onSeguir={() => setEtapa("fork")}
                      />
                    ) : naEntrada ? (
                      // EntradaView traz o próprio header+main (é a tela inteira).
                      <EntradaView
                        // 🔄 27/08 — o fork não tem mais passo 2 (gate de
                        // cidade removido): escolher já leva pro E3.1, que é a
                        // captura de lead nova. O Migrar reencontra a sua
                        // esteira depois do E3.1, igual em produção.
                        onIntencao={(i) => {
                          setIntencao(i);
                          setEtapa("dados");
                        }}
                        onLogin={() => {}}
                        // 🆕 30/08 — 4ª saída do fork, real em produção também
                        // (ver `entrada.tsx`, `onRetomar`).
                        onRetomar={() => setEtapa("retomar-cpf")}
                        destaqueCoral600
                      />
                    ) : naTravessia ? (
                      /* Entrada · E6→E9. Como o EntradaView, estas telas trazem
                         o próprio header+main — por isso ficam fora do bloco
                         genérico abaixo. */
                      <>
                        {/* 🆕 27/08 — E3.1 · dados pessoais (captura de lead). */}
                        {etapa === "dados" && (
                          <DadosPessoaisView
                            d={dadosLead}
                            set={(k, v) => setDadosLead((p) => ({ ...p, [k]: v }))}
                            contexto={intencao === "migrar" ? "migrar" : "abrir"}
                            onSeguir={() =>
                              setEtapa(intencao === "migrar" ? "m-cnpj" : "mei-ou-me")
                            }
                            onVoltar={() => voltar(() => setEtapa("fork"))}
                          />
                        )}
                        {/* 🆕 29/08 — E3.2 · MEI × ME, achado do Pedro
                            (faltava na demo, o caminho abrir pulava direto de
                            "dados" pra "endereco"). Só existe no caminho abrir
                            aqui: migrar já reencontra sua própria esteira via
                            "m-cnpj" logo depois de "dados". */}
                        {etapa === "mei-ou-me" && (
                          <MeiOuMeView
                            contexto="abrir"
                            regime={regimeDemo}
                            setRegime={setRegimeDemo}
                            onSeguir={() => setEtapa("endereco")}
                            onVoltar={() => voltar(() => setEtapa("dados"))}
                          />
                        )}
                        {/* 🆕 27/08 — E3.3 · endereço (gate de BH real) +
                            categoria (o gate de elegibilidade novo). */}
                        {etapa === "endereco" && (
                          <EnderecoCategoriaView
                            enderecoProprio={enderecoProprioDemo}
                            setEnderecoProprio={setEnderecoProprioDemo}
                            cep={cepDemo}
                            setCep={setCepDemo}
                            numero={numeroDemo}
                            setNumero={setNumeroDemo}
                            complemento={complementoDemo}
                            setComplemento={setComplementoDemo}
                            categoria={categoria}
                            setCategoria={setCategoria}
                            onSeguir={() => setEtapa("triagem")}
                            onVoltar={() => voltar(() => setEtapa("mei-ou-me"))}
                          />
                        )}
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
                            onSeguir={() => setEtapa("pagamento")}
                            onVoltar={() => voltar(() => setEtapa("conta"))}
                            layout="oferta"
                          />
                        )}
                        {/* 🔴 30/08 (pedido do Pedro) — E8 (`ContratoView`) foi
                            ELIMINADO do fluxo: igual à Contabilizei, o aceite
                            do contrato acontece no ato do pagamento, não numa
                            tela própria antes dele. O checkbox + "Ler o
                            contrato completo" subiram pro E9 (`PagamentoView`
                            abaixo). */}
                        {etapa === "pagamento" && (
                          <PagamentoView
                            cpf={cpfPag}
                            setCpf={setCpfPag}
                            metodo={metodo}
                            setMetodo={setMetodo}
                            // 🐛 O CPF já foi coletado no E6 (front-load 28/07).
                            // A demo é o único lugar que carrega o estado das
                            // duas telas, então é aqui que dá pra provar o
                            // reuso: o E9 confirma em vez de pedir de novo.
                            cpfCadastrado={dadosConta.cpf}
                            aceito={aceite}
                            setAceito={setAceite}
                            // O pagamento aprovado não é mais o fim da demo:
                            // ele abre a casa e começa o dossiê (C1). 🔄 30/08
                            // (pedido do Pedro) — boleto NÃO vai direto pro
                            // dossiê: passa pela pausa E9.1 (aguardando
                            // compensar) primeiro, igual à produção real
                            // (`/pagamento/page.tsx`, função `destino()`).
                            onPagar={() =>
                              setEtapa(metodo === "boleto" ? "aguardando" : "perguntando")
                            }
                            onVoltar={() => voltar(() => setEtapa("plano"))}
                          />
                        )}

                        {/* ═══ CONSTITUIÇÃO · O DOSSIÊ (C1–C7) ═══════════════
                            As MESMAS telas das rotas `/dossie/*` — elas moram
                            em `components/wizard-dossie.tsx` desde 29/07, e as
                            pages de produção são wrappers finos. A demo não
                            tem cópia própria de nenhuma delas. */}
                        {etapa === "socio" && (
                          <SocioView
                            preencher={preenchimento}
                            onSeguir={() => setEtapa(depoisDoDossie("socio"))}
                            onVoltar={() => voltar(() => setEtapa(antesDoDossie("socio")))}
                          />
                        )}
                        {etapa === "vinculo" && (
                          <VinculoView
                            preencher={preenchimento}
                            onSeguir={() => setEtapa(depoisDoDossie("vinculo"))}
                            onVoltar={() => voltar(() => setEtapa(antesDoDossie("vinculo")))}
                          />
                        )}
                        {etapa === "socios" && (
                          <SociosView
                            preencher={preenchimento}
                            onSeguir={() => setEtapa(depoisDoDossie("socios"))}
                            onVoltar={() => voltar(() => setEtapa(antesDoDossie("socios")))}
                          />
                        )}
                        {etapa === "empresa" && (
                          <EmpresaView
                            preencher={preenchimento}
                            onSeguir={() => setEtapa(depoisDoDossie("empresa"))}
                            onVoltar={() => voltar(() => setEtapa(antesDoDossie("empresa")))}
                          />
                        )}
                        {etapa === "cnae-secundarios" && (
                          <CnaeSecundariosView
                            preencher={preenchimento}
                            onSeguir={() => setEtapa(depoisDoDossie("cnae-secundarios"))}
                            onVoltar={() =>
                              voltar(() => setEtapa(antesDoDossie("cnae-secundarios")))
                            }
                            // 🆕 24/08 — busca livre pode escolher secundária que
                            // muda enquadramento; na rota real isso navega pra
                            // `/veredito/nao-atende`. Gap conhecido, não corrigido
                            // nesta rodada: a demo não tem um estado equivalente
                            // alcançável a partir do meio do dossiê sem reconstruir
                            // o `momento` da etapa "veredito" — no-op documentado
                            // em vez de mapear pra uma tela com copy errada.
                            onFalarAtendente={() => {}}
                          />
                        )}
                        {etapa === "natureza" && (
                          <NaturezaView
                            onSeguir={() => setEtapa(depoisDoDossie("natureza"))}
                            onVoltar={() => voltar(() => setEtapa(antesDoDossie("natureza")))}
                          />
                        )}
                        {etapa === "nome" && (
                          <NomeView
                            preencher={preenchimento}
                            onSeguir={() => setEtapa(depoisDoDossie("nome"))}
                            onVoltar={() => voltar(() => setEtapa(antesDoDossie("nome")))}
                          />
                        )}

                        {/* ═══ APROVAÇÃO (A1–A5) ═══════════════════════════
                            Mesmas telas de `/revisar` · `/termo` · `/painel` ·
                            `/assinatura` · `/ativa` — moram em
                            `components/wizard-cauda.tsx` desde 29/07. */}
                        {etapa === "revisar" && (
                          <RevisarView
                            onSeguir={() => setEtapa("termo")}
                            onVoltar={() => voltar(() => setEtapa("nome"))}
                          />
                        )}
                        {etapa === "termo" && (
                          <TermoView
                            aceito={aceiteTermo}
                            setAceito={setAceiteTermo}
                            onSeguir={() => setEtapa("painel")}
                            onVoltar={() => voltar(() => setEtapa("revisar"))}
                          />
                        )}
                        {etapa === "painel" && (
                          // Sem `onVoltar`: o componente original (`/painel`)
                          // não tem seta própria — é status assíncrono, não
                          // passo de wizard. A seta EXTERNA do aparelho segue
                          // funcionando (lê o histórico, não este prop).
                          // 🔄 26/08 (item 6): índices 2/2 — `ETAPAS` voltou a
                          // ter 4 (a DAE virou etapa visível com CTA próprio,
                          // ver `components/painel.tsx`). CTA coral ("Pagar a
                          // guia agora") agora avança pra A3.2 (certificado).
                          <PainelView
                            concluidas={2}
                            emAndamento={2}
                            socios={socios ?? 1}
                            onPagarDae={() => setEtapa("certificado")}
                          />
                        )}
                        {/* 🆕 26/08 (item 7) — A3.2, entre painel e assinatura. */}
                        {etapa === "certificado" && (
                          <CertificadoGateView
                            onSeguir={() => setEtapa("assinatura")}
                            onVoltar={() => voltar(() => setEtapa("painel"))}
                          />
                        )}
                        {/* 🆕 03/08 — A3.1, gap fechado. Sem interação natural pra
                            chegar aqui (produção retry-automático mockado); estado
                            'esgotado' fixo, idêntico ao de `/painel/recusa`. */}
                        {etapa === "painel-recusa" && (
                          <PainelView
                            concluidas={1}
                            emAndamento={1}
                            socios={socios ?? 1}
                            recusa={{
                              etapa: 1,
                              titulo: "As 3 opções de nome não passaram",
                              motivo:
                                "Testamos automaticamente as 3 que você priorizou, e nenhuma passou na Junta. Precisamos de mais 3 sugestões suas pra tentar de novo.",
                              acao: "Sugerir mais 3 nomes",
                            }}
                          />
                        )}
                        {etapa === "assinatura" && (
                          <AssinaturaView
                            onSeguir={() => setEtapa("ativacao")}
                            // 🔄 26/08 (item 7) — voltava pro painel; agora
                            // volta pro certificado (A3.2), que é quem precede
                            // a assinatura desde a reunião Rua Satélite 36.
                            onVoltar={() => voltar(() => setEtapa("certificado"))}
                            // 🆕 24/08 — código GOV expirado/sem tentativas navega
                            // pra `/veredito/nao-atende` na rota real. Mesmo gap
                            // documentado do onFalarAtendente acima: sem estado
                            // equivalente na demo, no-op em vez de tela errada.
                            onEscalar={() => {}}
                          />
                        )}
                        {/* 🔓 SWAP validado (29/07): a home de ativação (A5)
                            substitui a antiga 'empresa ativa' aqui — ver nota em `wizard-cauda.tsx`.
                            Sem onVoltar/onSeguir: a tela original não tem CTA de
                            avançar (é a home, não passo de wizard); a seta
                            externa do aparelho segue funcionando via histórico. */}
                        {etapa === "ativacao" && <HomeAtivacaoView />}

                        {/* ═══ C0.1 · E9.1 — pausas de pagamento ════════════
                            Fora da sequência linear: alcançadas pelo E3
                            ("Voltar de onde parei") ou pela pill própria. */}
                        {etapa === "retomar-cpf" && (
                          <RetomarCpfView
                            cpf={cpfRetomar}
                            setCpf={setCpfRetomar}
                            onContinuar={() => {
                              const digitos = cpfRetomar.replace(/\D/g, "");
                              const ultimo = Number(digitos[digitos.length - 1] ?? "0");
                              setEtapa(ultimo % 2 !== 0 ? "aguardando" : "retomar");
                            }}
                            onVoltar={() => voltar(() => setEtapa("fork"))}
                          />
                        )}
                        {etapa === "retomar" && (
                          <RetomarView onSeguir={() => setEtapa("perguntando")} />
                        )}
                        {etapa === "aguardando" && (
                          <AguardandoView onSeguir={() => setEtapa("perguntando")} />
                        )}

                        {/* ═══ MIGRAR (E4.2–E9.4) ════════════════════════════
                            As MESMAS telas das rotas `/migrar/*`. Ramo decimal:
                            entra pelo fork E4 e reencontra o tronco só em E9. */}
                        {etapa === "m-cnpj" && (
                          <MigrarCnpjView
                            preencher={preenchimento}
                            onSeguir={() => setEtapa(depoisDoMigrar("m-cnpj"))}
                            onVoltar={() => voltar(() => setEtapa(antesDoMigrar("m-cnpj")))}
                            // 🆕 26/08 — saída existia no componente
                            // (`onSaidaInapto`) desde 04/08, mas a demo nunca
                            // ligou o callback: CNPJ inapto/suspenso não tinha
                            // pra onde ir aqui.
                            onSaidaInapto={() => setEtapa("m-cnpj-inapto")}
                          />
                        )}
                        {/* 🆕 26/08 — E4.3, faltava na sequência (ver ETAPAS_MIGRAR). */}
                        {etapa === "m-diagnostico" && (
                          <MigrarDiagnosticoView
                            // A demo não bifurca esta esteira por regime
                            // (mesma simplificação de MigrarPlanoView/
                            // MigrarContratoView, que também não recebem `mei`).
                            mei={false}
                            onSeguir={() => setEtapa(depoisDoMigrar("m-diagnostico"))}
                            onVoltar={() => voltar(() => setEtapa(antesDoMigrar("m-diagnostico")))}
                          />
                        )}
                        {etapa === "m-plano" && (
                          <MigrarPlanoView
                            onSeguir={() => setEtapa(depoisDoMigrar("m-plano"))}
                            onVoltar={() => voltar(() => setEtapa(antesDoMigrar("m-plano")))}
                          />
                        )}
                        {etapa === "m-contrato" && (
                          <MigrarContratoView
                            aceito={aceiteMigrar}
                            setAceito={setAceiteMigrar}
                            onSeguir={() => setEtapa(depoisDoMigrar("m-contrato"))}
                            onVoltar={() =>
                              voltar(() => setEtapa(antesDoMigrar("m-contrato")))
                            }
                          />
                        )}
                        {etapa === "m-pagamento" && (
                          <PagamentoView
                            cpf={cpfPag}
                            setCpf={setCpfPag}
                            metodo={metodo}
                            setMetodo={setMetodo}
                            cpfCadastrado={dadosConta.cpf}
                            fluxo="migrar"
                            onPagar={() => setEtapa(depoisDoMigrar("m-pagamento"))}
                            onVoltar={() =>
                              voltar(() => setEtapa(antesDoMigrar("m-pagamento")))
                            }
                          />
                        )}
                        {etapa === "m-contador" && (
                          <MigrarContadorAntigoView
                            empresa={EMPRESA_MIGRAR}
                            onSeguir={() => setEtapa(depoisDoMigrar("m-contador"))}
                          />
                        )}
                        {/* 🆕 24/08 (reunião Leonan 19/08, achado tardio) — E9.2b/c/d.
                            Dados base + sociedade + GOV/procuração, na ordem que a
                            reunião travou: depois do contador atual, antes da
                            transferência (não antes do pagamento — 1ª tentativa
                            desta rodada colocou errado, corrigido). */}
                        {etapa === "m-dados" && (
                          <MigrarDadosBaseView
                            onSeguir={() => setEtapa(depoisDoMigrar("m-dados"))}
                          />
                        )}
                        {etapa === "m-socios" && (
                          <SociosView
                            contexto="migrar"
                            onSeguir={() => setEtapa(depoisDoMigrar("m-socios"))}
                          />
                        )}
                        {etapa === "m-gov" && (
                          <MigrarGovView
                            onSeguir={() => setEtapa(depoisDoMigrar("m-gov"))}
                            onEscalar={() => {}}
                          />
                        )}
                        {etapa === "m-transferencia" && (
                          // Sem onVoltar: é tela de status assíncrono, igual ao
                          // A3. A seta externa do aparelho segue funcionando.
                          <MigrarTransferenciaView
                            onSeguir={() => setEtapa(depoisDoMigrar("m-transferencia"))}
                          />
                        )}
                        {etapa === "m-travado" && (
                          <MigrarTransferenciaView
                            travado
                            onAcaoTravado={() => setEtapa("m-transferencia")}
                          />
                        )}
                        {etapa === "m-ativa" && (
                          <MigrarAtivaView onSeguir={() => setEtapa("fim")} />
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
                              ...DADOS_SAIDA_FORA_BH,
                              confirmacao: {
                                ...DADOS_SAIDA_FORA_BH.confirmacao!,
                                acoes: [
                                  ...ACOES_PENDENTES_FORA_BH,
                                  {
                                    label: "Voltar ao início",
                                    variante: "ghost",
                                    onClick: reiniciar,
                                  },
                                ],
                              },
                            }}
                            captura={{
                              extra: cidadeS,
                              setExtra: setCidadeS,
                              enviado: enviadoS,
                              setEnviado: setEnviadoS,
                            }}
                          />
                        </main>
                      </>
                    ) : naSaidaTriagem ? (
                      <>
                        <TelaHeader meta="Sobre o seu caso" />
                        <main className="app-main">
                          <SaidaView
                            d={
                              etapa === "saida-exterior"
                                ? DADOS_SAIDA_EXTERIOR
                                : etapa === "saida-socio-pj"
                                  ? DADOS_SAIDA_SOCIO_PJ
                                  : DADOS_SAIDA_SOCIOS
                            }
                          />
                        </main>
                      </>
                    ) : etapa === "m-cnpj-inapto" ? (
                      // 🆕 26/08 — saída do M1 (`onSaidaInapto`), mesmo padrão
                      // das outras saídas: shell próprio, sem header genérico.
                      <>
                        <TelaHeader meta="Sobre a situação do CNPJ" />
                        <main className="app-main">
                          <SaidaView
                            d={DADOS_SAIDA_CNPJ_INAPTO}
                            captura={{
                              // Sem pergunta extra nesta saída (`d.extra` não
                              // existe) — campos aqui só pra satisfazer o tipo.
                              extra: "",
                              setExtra: () => {},
                              enviado: enviadoCnpjInapto,
                              setEnviado: setEnviadoCnpjInapto,
                            }}
                          />
                        </main>
                      </>
                    ) : naSaidaMei ? (
                      // 🆕 28/08 — as 2 saídas de impedimento do ramo MEI.
                      // Bloqueio do GOVERNO, não do produto: por isso elas
                      // encaminham (baixar a antiga / abrir como ME / conferir
                      // o estatuto) em vez de virarem lista de espera.
                      <>
                        <TelaHeader meta="Sobre o seu caso" />
                        <main className="app-main">
                          <SaidaView
                            d={
                              etapa === "saida-mei-outra-empresa"
                                ? DADOS_SAIDA_MEI_OUTRA_EMPRESA
                                : DADOS_SAIDA_MEI_SERVIDOR
                            }
                          />
                        </main>
                      </>
                    ) : etapa === "m-impedimento" ? (
                      <ImpedimentoView
                        respostas={impedimentosDemo}
                        setResposta={(id, v) =>
                          setImpedimentosDemo((r) => ({ ...r, [id]: v }))
                        }
                        cienteBeneficio={cienteBeneficioDemo}
                        setCienteBeneficio={setCienteBeneficioDemo}
                        onSeguir={() => setEtapa("faixa")}
                        // A demo navega pra saída de verdade: é justamente o
                        // desfecho que precisa ser mostrado na apresentação.
                        onSaida={() =>
                          setEtapa(
                            impedimentosDemo["outra-empresa"] === true
                              ? "saida-mei-outra-empresa"
                              : "saida-mei-servidor",
                          )
                        }
                        onVoltar={() => setEtapa("endereco")}
                      />
                    ) : etapa === "m-ocupacao" ? (
                      <OcupacaoView
                        // A demo fixa "reparos": é a categoria com mais
                        // ocupações (20) e a que melhor mostra o limite
                        // interno na tela.
                        categoria="reparos"
                        principal={ocupacaoDemo}
                        setPrincipal={setOcupacaoDemo}
                        secundarias={secundariasDemo}
                        setSecundarias={setSecundariasDemo}
                        onSeguir={() => setEtapa("socio")}
                        onVoltar={() => setEtapa("pagamento")}
                      />
                    ) : etapa === "m-certificado" ? (
                      // 🆕 28/08 — MESMA view do ME (fidelidade por construção),
                      // com a variante `mei`: motivo é OPERAR, e o custo é do
                      // cliente (não vem no plano).
                      <CertificadoGateView
                        mei
                        onSeguir={() => setEtapa("fim")}
                        onVoltar={() => setEtapa("m-proximos-passos")}
                      />
                    ) : etapa === "m-proximos-passos" ? (
                      <ProximosPassosView
                        campos={CAMPOS_COLA_DEMO}
                        nivelGovBrOk={govBrOkDemo}
                        setNivelGovBrOk={setGovBrOkDemo}
                        onConfirmarCnpj={() => setEtapa("m-certificado")}
                        onVoltar={() => setEtapa("painel")}
                      />
                    ) : (
                      <>
                        {/* 🔓 UX-60 aplicado AQUI (deslinkado): o E5 aprovado
                            não tem volta pro E3. */}
                        {/* 🔓 UX-60 — nenhuma tela do wizard tem voltar. Aqui
                            todas as do piloto ganham (menos a de loading, que
                            não é passo). */}
                        <header className="pt-6 pb-4 shrink-0 flex items-center gap-1.5">
                          {etapa !== "analisando" && (
                            <button
                              onClick={() =>
                                // 🔄 27/08 — o voltar depende de que lado do
                                // pagamento a tela está: a atividade (C0) volta
                                // pro pagamento; triagem/faixa voltam pro E3.3.
                                voltar(() => {
                                  setIntencao("abrir");
                                  setEtapa(
                                    etapa === "perguntando" || etapa === "veredito"
                                      ? "pagamento"
                                      : "endereco",
                                  );
                                })
                              }
                              aria-label="Voltar"
                              className="-ml-1.5 flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-alt"
                            >
                              <SetaVoltarDemo />
                            </button>
                          )}
                          {/* 🐛 29/08 (achado do Pedro) — triagem/faixa
                              mostravam "Legalizai" fixo, igual ao bug que já
                              tinha corrigido na rota real (`/gate`). Mesmo
                              rótulo usado lá: `meta` é o destino do voltar,
                              não o nome desta tela. */}
                          <p className="text-micro text-text-tertiary">
                            {etapa === "faixa"
                              ? "Perguntas rápidas"
                              : etapa === "triagem"
                                ? "Sobre sua empresa"
                                : "Legalizai"}
                          </p>
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
                              // 🔄 27/08 — daqui segue pro dossiê, não mais
                              // pra triagem: a triagem ficou lá atrás, antes
                              // do pagamento. 🔄 28/08 — a 1ª tela do dossiê
                              // virou C5 (secundárias), não mais C1.
                              onSeguir={() => setEtapa(ETAPAS_DOSSIE[0])}
                              captura={{
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
                              onSeguir={() => setEtapa("faixa")}
                              // 🆕 26/08 — 3ª realocação da coorte (Veredito →
                              // aqui, dentro da própria Triagem). Mesmo
                              // `dadosConta.coorte` de sempre, só muda quem
                              // renderiza a UI.
                              coorte={dadosConta.coorte}
                              setCoorte={(v) => setDadosConta((p) => ({ ...p, coorte: v }))}
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
                              // 🔴 27/08 — a escolha de endereço saiu daqui e
                              // foi pro E3.3 (`endereco`), junto do gate de BH.
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
              {(momento === "m-transferencia" || momento === "m-travado") && <CardPipelineTecnico />}
            </div>
          </div>
        </div>

        {/* ✈️ NAVEGAÇÃO RÁPIDA — pills na ordem real do flow (29/07).
            Cada clique preenche (idempotente) o que a tela-alvo depende e
            pula direto pra ela, sem reandar o flow inteiro. */}
        <div className="mt-8 border-t border-border-hairline pt-5">
          <p className="text-micro font-semibold tracking-wide text-text-tertiary mb-2.5">
            IR DIRETO PRA TELA
          </p>
          <div className="flex flex-wrap gap-2">
            {PILLS.map((p) => {
              const atual = etapa === p.etapa;
              return (
                <button
                  key={p.etapa}
                  onClick={() => pularPara(p.etapa)}
                  aria-current={atual}
                  className={`rounded-full px-3.5 py-1.5 text-caption font-semibold transition-colors
                    ${
                      atual
                        ? "bg-action-primary text-text-on-brand"
                        : "border border-border-hairline bg-surface-card text-text-secondary hover:border-border-strong"
                    }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* C0.1/E9.1 numa linha separada: não são passo da sequência, são
              pausas de pagamento (ver `type Etapa`). Misturar na fila de cima
              sugeriria "depois do C7 vem isso", que é falso — elas vivem
              entre E9 e C1. */}
          {/* MIGRAR — barra própria. É ramo decimal (sai do fork E4),
              não continuação sequencial do caminho abrir. */}
          <p className="text-micro font-semibold tracking-wide text-text-tertiary mt-4 mb-2.5">
            🆕 MIGRAR DE CONTADOR (E4.2–E9.4, ramo decimal, sai do E4)
          </p>
          <div className="flex flex-wrap gap-2">
            {PILLS_MIGRAR.map((p) => {
              const atual = etapa === p.etapa;
              return (
                <button
                  key={p.etapa}
                  onClick={() => pularPara(p.etapa)}
                  aria-current={atual}
                  className={`rounded-full px-3.5 py-1.5 text-caption font-semibold transition-colors
                    ${
                      atual
                        ? "bg-action-primary text-text-on-brand"
                        : "border border-border-hairline bg-surface-card text-text-secondary hover:border-border-strong"
                    }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          <p className="text-micro font-semibold tracking-wide text-text-tertiary mt-4 mb-2.5">
            🆕 PAUSAS DE PAGAMENTO (entre E9 e C1 — não é sequência)
          </p>
          <div className="flex flex-wrap gap-2">
            {PILLS_PAUSA.map((p) => {
              const atual = etapa === p.etapa;
              return (
                <button
                  key={p.etapa}
                  onClick={() => pularPara(p.etapa)}
                  aria-current={atual}
                  className={`rounded-full px-3.5 py-1.5 text-caption font-semibold transition-colors
                    ${
                      atual
                        ? "bg-action-primary text-text-on-brand"
                        : "border border-border-hairline bg-surface-card text-text-secondary hover:border-border-strong"
                    }`}
                >
                  {p.label}
                </button>
              );
            })}
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

/**
 * 🆕 06/08 — pedido do Pedro: card pra conferir com o time interno (Larissa)
 * se o passo a passo TÉCNICO por trás do E9.3 está certo. NÃO é o que o
 * cliente vê (a tela só mostra a timeline em linguagem de gente) — é o
 * mapeamento real que essa timeline representa.
 *
 * Fonte: `pesquisa/fiscal-simples-bh-2026.md` §I (🟢 alta, tabela CONSOLIDADO
 * #14) cruzado com `pesquisa/cruzamento-gemini-fluxo-migracao.md` achados
 * #6-7. Os pontos ⚠️ abaixo são achados REAIS desse cruzamento, não
 * enfeite — nenhum foi confirmado em fonte primária/oficial ainda.
 *
 * 🆕 06/08 (2ª rodada, achado do Pedro) — passo 5 (certificado) é NOVO: até
 * hoje o certificado digital não aparecia em NENHUM lugar do caminho ME
 * (só existia pergunta pro MEI, tela própria). TTRT move responsabilidade
 * TÉCNICA, não o certificado — são artefatos independentes, e sem certificado
 * credenciado com a gente a automação (DAS/PGDAS-D via Serpro) não roda pra
 * ninguém. Já implementado: `MigrarDiagnosticoView` (M2) agora pergunta pros
 * 2 regimes, `MigrarTransferenciaView` (M4b) ganha o passo quando a resposta
 * é "não tenho". 🟡 fila-Mauro: se isso carrega custo/fidelidade extra pro
 * ME (como já existe pro MEI) é decisão de preço NÃO tomada — Pedro escolheu
 * decidir depois, mesmo padrão usado pro M2 do MEI.
 */
const PASSOS_TECNICOS_TRANSFERENCIA: { passo: string; oque: string; fonte: string; ressalva?: string }[] = [
  {
    passo: "1 · Distrato",
    oque: "Encerramento do contrato com o contador antigo. Define a DATA DE CORTE — a competência que fica sob responsabilidade dele.",
    fonte: "CFC (norma de transferência)",
  },
  {
    passo: "2 · TTRT Eletrônico",
    oque: "Termo de Transferência de Responsabilidade Técnica: o contador NOVO abre no portal do CRC-MG, o ANTIGO precisa validar. É aqui que mora a pausa mais arriscada (persona migra-refem).",
    fonte: "CRC-MG",
  },
  {
    passo: "3 · DBE Evento 232 \"Alteração do Contabilista\"",
    oque: "Via Coletor Redesim, assinado com e-CNPJ da empresa. Nossa fonte de maior confiança diz que atualiza Receita Federal + Sefaz-MG + Prefeitura de BH numa cascata SÓ.",
    fonte: "Redesim / RFB",
    ressalva:
      "O produto mostra isso como 2 passos separados (\"Atualizando no Redesim\" + \"Trocando o responsável · Prefeitura de BH\"), por precaução — não por confirmação de que são 2 trâmites reais. Se for 1 evento só, o pipeline volta de 6 pra 5 passos.",
  },
  {
    passo: "4 · Procuração e-CAC nova",
    oque: "Revoga a procuração do escritório antigo e emite uma nova pro nosso, direto no site da Receita.",
    fonte: "gov.br / RFB",
    ressalva:
      "Ordem em disputa: a pesquisa cruzada (Gemini) diz que isso vem ANTES do distrato/TTRT — o contador novo precisaria de algum acesso pra sequer iniciar o processo. Nosso desenho tem isso por ÚLTIMO. Não decidido.",
  },
  {
    passo: "5 · Certificado digital (se não tiver um) — NOVO",
    oque: "Independente da TTRT (não é responsabilidade técnica) — roda em paralelo. Sem certificado credenciado com a gente, não dá pra automatizar DAS/PGDAS-D/NFe pra essa empresa, com ou sem TTRT resolvido.",
    fonte: "achado 06/08 (Pedro) — sem pesquisa fiscal dedicada ainda",
    ressalva:
      "🟡 fila-Mauro: custo/fidelidade extra igual ao MEI, ou incluso sem custo (ME já tem a garantia de devolução do TTRT como contrapartida)? Decisão de preço não tomada de propósito.",
  },
  {
    passo: "6 · Libera o acesso",
    oque: "A partir daqui a gente já pode operar a empresa no app (emitir nota, ver guia, etc).",
    fonte: "—",
  },
];

function CardPipelineTecnico() {
  return (
    <div className="rounded-2xl border border-state-warning bg-state-warning-tint p-5">
      <p className="text-caption font-bold text-state-warning-text mb-1">
        🔧 Passo a passo técnico por trás (não aparece pro cliente)
      </p>
      <p className="text-caption text-text-secondary mb-4">
        Confere com quem entende de contabilidade — os pontos ⚠️ abaixo ainda não têm fonte primária ou decisão travada.
      </p>
      <ol className="flex flex-col gap-4">
        {PASSOS_TECNICOS_TRANSFERENCIA.map((p) => (
          <li key={p.passo}>
            <p className="text-body font-semibold text-text-primary">{p.passo}</p>
            <p className="text-caption text-text-secondary mt-0.5">{p.oque}</p>
            <p className="text-micro text-text-tertiary mt-1">Fonte: {p.fonte}</p>
            {p.ressalva && (
              <p className="text-caption font-semibold text-state-warning-text mt-1.5">
                ⚠️ {p.ressalva}
              </p>
            )}
          </li>
        ))}
      </ol>
      <p className="text-micro text-text-tertiary mt-4 pt-3 border-t border-state-warning">
        Fonte: `pesquisa/fiscal-simples-bh-2026.md` §I + `pesquisa/cruzamento-gemini-fluxo-migracao.md` achados #6-7.
      </p>
    </div>
  );
}

function FimPiloto({ onReiniciar }: { onReiniciar: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
      <p className="text-h2 text-text-primary">Fim do piloto</p>
      <p className="text-body text-text-secondary max-w-[26ch]">
        O flow real segue pro E6 (Criar conta). Essa parte entra na próxima fase.
      </p>
      <Button onClick={onReiniciar}>Recomeçar demo</Button>
    </div>
  );
}
