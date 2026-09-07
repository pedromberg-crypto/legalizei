"use client";

import { Button } from "@/components/ui/button";
import { Rolagem, Rodape } from "@/components/ui/tela";
import { TimelineBlocosMei, type BlocoStatus } from "./_timeline-blocos";
import { CUSTOS } from "@/lib/fiscal";
import { linkWhatsApp } from "@/lib/contato";
import { reais } from "./_formato";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M12 · ACOMPANHAMENTO — no layout aprovado do status do ME.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09, redesenhada no mesmo dia (pedido do Pedro: layouts do ME, copy
 * daqui).
 *
 * ─── DE ONDE VEM O LAYOUT ───────────────────────────────────────────────────
 * Do status do caminho ME (`PainelView` em `painel.tsx`, no modo `escuro` que
 * o `AguardandoView` usa desde a fusão A3+E9 de 31/08): **hero escuro** com o
 * gradiente coral saindo do canto superior esquerdo, e a **timeline com fio
 * ligando os pontos** — não uma lista solta.
 *
 * As regras que vieram junto, todas testadas e algumas já revertidas uma vez:
 *   · no modo escuro o hero ABSORVE o prazo e a linha do WhatsApp; o card
 *     branco de "quanto tempo leva" some, porque com o hero escuro os dois
 *     cards "brigavam entre si" (correção do Pedro em 31/08);
 *   · o `detalhe` só aparece na etapa DA VEZ — nas outras vira parede de
 *     texto;
 *   · quando a vez é do CLIENTE agir, a etapa continua GIRANDO e ganha o CTA
 *     dentro dela: o anel diz "é aqui", o card diz o que fazer (correção de
 *     01/09 — antes o CTA suprimia o anel e a etapa ficava cinza, com cara de
 *     "nem começou", justamente onde a jornada parou).
 *
 * ⚠️ Reescrito, não importado: a trava de fronteira proíbe o ramo MEI de
 * importar tela de ME.
 *
 * ─── O QUE TINHA ACONTECIDO COM ESTA TELA ───────────────────────────────────
 * O pipeline do MEI estava CERTO desde 28/08, mas em 31/08 o status do ME
 * migrou pro `/aguardando?fase=junta` e levou a navegação do MEI junto: quem
 * fazia o caminho MEI via **"fase Junta"**, órgão pelo qual ele não passa, e a
 * tela certa virou inalcançável, viva só por URL direta.
 *
 * ─── POR QUE 4 ETAPAS, E NÃO AS 9 DO ME ─────────────────────────────────────
 * Não é versão simplificada: é outro processo. O ME tem dossiê de 9 passos,
 * viabilidade, guia da Junta, protocolo e assinatura. O MEI tem conferência
 * humana e o clique do titular. Foi por isso que ele ficou fora da fusão A3+E9
 * de propósito — e por isso não podia continuar caindo na tela que nasceu
 * dela. Sem blocos colapsáveis pelo mesmo motivo: 4 etapas não pedem
 * agrupamento, e agrupar 4 em 1 seria cerimônia sem função.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface EtapaMei {
  nome: string;
  /** Aparece só quando a etapa é a da vez. */
  sub?: string;
  /** A ação, quando a vez é do CLIENTE (não do nosso time). */
  acao?: { label: string; onClick?: () => void };
}

/**
 * O pipeline concierge, recuperado do `ETAPAS_MEI` de 28/08.
 *
 * ✍️ REGRA DE COPY DURA: **nenhuma etapa pode dizer que a Legalizai registra
 * o MEI.** Não há API nem procuração que permita, e a senha gov.br é
 * intransferível. A palavra "contador" também não aparece: o plano MEI tem
 * atendente, e contador CRC é o que sustenta o preço do ME.
 * Ver `pesquisa/abertura-mei/abertura-mei-processo.md`.
 */
export const ETAPAS_MEI: EtapaMei[] = [
  { nome: "Recebemos seus dados" },
  {
    nome: "Nosso time está conferindo tudo",
    sub: "A conferência é humana: alguém lê sua ocupação e o que ela cobre, campo por campo.",
  },
  {
    nome: "Seus próximos passos ficam prontos",
    sub: "Aí é com você: são 3 passos no Portal, com os seus dados prontos pra colar.",
  },
  { nome: "Empresa aberta" },
];

/**
 * 🔄 07/09 (3ª correção do Pedro: *"todas são padrão, corrija todas"*) — OS
 * BLOCOS DA FASE DE ABERTURA.
 *
 * A tela usava lista PLANA, com a justificativa registrada em 28/08 de que
 * "4 etapas não pedem agrupamento". Eu repeti essa justificativa quando o
 * Pedro pediu a anatomia idêntica, e ela não se sustenta: a decisão de 28/08
 * é anterior ao acordeão virar o padrão do status no ME, e o que ele pediu
 * foi PADRÃO — não a defesa de cada exceção.
 *
 * O agrupamento espelha o que o ME faz na fase Junta: o que já passou vira
 * UM bloco fechado ("Informações confirmadas", no A3), e a fase corrente abre.
 * Sumir com o que passou faria a pessoa achar que perdeu o progresso; deixar
 * tudo aberto numa lista só devolve a parede que o acordeão existe pra evitar.
 */
export const BLOCOS_ABERTURA_MEI: BlocoStatus[] = [
  {
    id: 1,
    titulo: "Informações confirmadas",
    itens: [
      { nome: "Cadastro completo", jaFeito: true },
      { nome: "Autorização assinada", jaFeito: true },
    ],
  },
  {
    id: 2,
    titulo: "Registro do seu MEI",
    itens: ETAPAS_MEI.map((e) => ({ nome: e.nome, detalhe: e.sub })),
  },
];

/**
 * 🆕 07/09 (pedido do Pedro) — O PIPELINE DO SEGUNDO PAGAMENTO.
 *
 * Espelha o que o ME faz com a guia da Junta: a mesma tela de status cobre 2
 * FASES da jornada, e a fase é que troca a lista, o hero e o CTA. Aqui a fase
 * `certificado` começa depois que o CNPJ já saiu (M13) — por isso a abertura
 * aparece fechada no topo dela, e não some: sumir faria a pessoa achar que
 * perdeu o progresso.
 *
 * ✍️ A copy diz o que TRAVA, não o que "está pendente": o Pedro travou em
 * 07/09 que sem certificado o app não libera. Espera sem consequência escrita
 * é espera que ninguém resolve.
 */
export const ETAPAS_CERTIFICADO_MEI: EtapaMei[] = [
  { nome: "Seu MEI está aberto" },
  {
    nome: "Certificado digital",
    sub: "É o que falta pra gente agir no seu lugar: puxar guia, emitir nota e resolver no e-CAC sem te pedir senha.",
  },
  {
    nome: "Videochamada de validação",
    sub: "A certificadora parceira marca com você. Leva uns 15 minutos, e é exigência deles.",
  },
  { nome: "App liberado" },
];

/**
 * Os blocos da fase do certificado, no mesmo padrão da fase de abertura.
 *
 * 🐛→🔒 07/09 (E2E do ramo) — A ETAPA PAGA AINDA MANDAVA PAGAR. Com o boleto
 * compensando, o hero dizia "Boleto do certificado gerado" e o item logo
 * abaixo seguia dizendo *"é o que falta pra gente agir no seu lugar"*: a
 * pessoa já tinha pago e a timeline a cobrava de novo.
 *
 * É o mesmo defeito que o ME corrigiu no A3′/A3″ em 04/09, e a lição de lá
 * vale palavra por palavra: **etapa concluída se descreve no passado — é
 * recibo, não instrução.** Por isso os blocos são derivados do ESTADO, e não
 * uma lista fixa.
 */
export function blocosDoCertificado(
  estado: "pendente" | "boleto" | "pronto" | "liberado",
): BlocoStatus[] {
  const pago = estado !== "pendente";
  return [
    {
      id: 1,
      titulo: "Sua empresa",
      itens: [
        { nome: "MEI registrado no Portal", jaFeito: true },
        { nome: "CNPJ emitido", jaFeito: true },
      ],
    },
    {
      id: 2,
      titulo: "Certificado digital",
      itens: [
        estado === "boleto"
          ? {
              /* Pagou por boleto: a etapa diz o FATO (foi paga) e fica girando,
                 porque o banco está compensando neste instante. Cinza aqui
                 diria "não aconteceu", que é o oposto. */
              nome: "Certificado pago",
              emCurso: true,
              detalhe:
                "Você já pagou. O banco confirma em 1 a 3 dias úteis, e aí a certificadora começa a emissão.",
            }
          : pago
            ? { nome: "Certificado pago", jaFeito: true }
            : {
                nome: "Certificado digital",
                deQuem: "cliente",
                detalhe:
                  "É o que falta pra gente agir no seu lugar: puxar guia, emitir nota e resolver no e-CAC sem te pedir senha.",
              },
        {
          nome: "Videochamada de validação",
          jaFeito: estado === "liberado",
          detalhe:
            "A certificadora parceira marca com você. Leva uns 15 minutos, e é exigência deles.",
        },
        { nome: "App liberado", jaFeito: estado === "liberado" },
      ],
    },
  ];
}

export function StatusMeiView({
  /** Índice da etapa em andamento, DENTRO do pipeline (não da lista achatada). */
  emAndamento,
  /** Só habilita quando a conferência termina (etapa 2 em diante). */
  onVerProximosPassos,
  fase = "abertura",
  certificado = "pendente",
  onPagarCertificado,
  onEntrar,
  onVerBoleto,
  onPagarPix,
}: {
  emAndamento?: number;
  onVerProximosPassos?: () => void;
  /**
   * 🆕 07/09 — a MESMA tela cobre 2 fases: `abertura` (conferência humana,
   * era o `StatusMeiView` de sempre) e `certificado` (o 2º pagamento). Uma
   * rota só (`/mei/status`), como o ME faz com `/aguardando?fase=`.
   */
  fase?: "abertura" | "certificado";
  /**
   * Só importa na fase `certificado`:
   * · `pendente` — ainda não pagou (é aqui que a jornada PARA);
   * · `boleto`   — pagou por boleto e está compensando;
   * · `pronto`   — pago, esperando a videochamada de validação;
   * · `liberado` — certificado emitido, app inteiro liberado. É o único
   *   estado em que a jornada volta a andar, e o equivalente do A3′ do ME.
   */
  certificado?: "pendente" | "boleto" | "pronto" | "liberado";
  onPagarCertificado?: () => void;
  /** Só no estado `liberado`: a saída pra casa. */
  onEntrar?: () => void;
  /** Só no estado `boleto`: os 2 chips do hero. */
  onVerBoleto?: () => void;
  onPagarPix?: () => void;
}) {
  const naFaseCertificado = fase === "certificado";
  const blocos = naFaseCertificado
    ? blocosDoCertificado(certificado)
    : BLOCOS_ABERTURA_MEI;

  /* ⚠️ O ponteiro conta a lista ACHATADA (é assim que o acordeão distribui os
     estados entre os blocos), e os 2 primeiros itens são sempre o que já
     passou. Por isso o `+ 2`: o índice que chega de fora continua sendo o da
     etapa dentro do pipeline, que é como o resto do app fala dele. */
  const JA_PASSOU = 2;

  /* Na fase do certificado o ponteiro é o ESTADO do pagamento, não um número
     solto: pendente e boleto param no certificado em si, e só o `pronto`
     avança pra videochamada. Derivar em vez de receber evita o descasamento
     clássico entre o que o topo diz e onde a timeline está. */
  const emAndamentoReal = naFaseCertificado
    ? certificado === "liberado"
      ? JA_PASSOU + 2
      : certificado === "pronto"
        ? JA_PASSOU + 1
        : JA_PASSOU
    : JA_PASSOU + (emAndamento ?? 1);
  const concluidas = emAndamentoReal;
  const liberado = naFaseCertificado ? false : (emAndamento ?? 1) >= 2;

  return (
    <>
      {/* 🔒 Terminal por natureza: é a tela de espera, não um passo do wizard.
          Voltar daqui significaria desfazer a autorização, que não é o que a
          seta faz em lugar nenhum do app. */}
      {/* 🗑️ 07/09 (trava de anatomia) — SEM `TelaHeader` AQUI, e a ausência é
          a regra do ME, não esquecimento: no `PainelView` o cabeçalho só
          existe no modo CLARO (`{!escuro && <header>}`). No escuro o hero
          absorve o contexto, e o eyebrow acima dele viraria um rótulo que o
          E9.1 não tem — 40px de cromo antes do que importa.
          ⚠️ O "esta tela não tem voltar" continua declarado, só que no lugar
          certo: `semVoltar: true` no nó do `flow-data`, que é de onde a
          auditoria do gerador lê. */}
      <main className="app-main">
        <div className="shrink-0">
          {/* ═══ O HERO ESCURO ═══════════════════════════════════════════════
              Mesmo gradiente e mesma anatomia do status do ME. No modo escuro
              ele absorve o prazo e a promessa de aviso — por isso não existe
              card branco de "quanto tempo leva" logo abaixo. */}
          <div
            className="mt-4 mb-5 rounded-2xl p-5 text-text-on-dark"
            style={{
              background:
                "radial-gradient(120% 100% at 0% 0%, color-mix(in srgb, var(--color-action-primary) 45%, transparent) 0%, transparent 55%), var(--color-surface-dark)",
            }}
          >
            <p className="text-h1 font-bold leading-tight">
              {naFaseCertificado
                ? certificado === "liberado"
                  ? "Tudo liberado"
                  : certificado === "pronto"
                    ? "Pagamento confirmado"
                    : certificado === "boleto"
                      ? "Boleto do certificado gerado"
                      : "Falta o certificado digital"
                : liberado
                  ? "Está pronto pra você finalizar"
                  : "Estamos conferindo tudo"}
            </p>
            <p className="mt-1.5 text-caption text-text-on-dark/70">
              {naFaseCertificado
                ? certificado === "liberado"
                  ? "Seu certificado está emitido e guardado com a gente. Daqui pra frente a gente resolve suas obrigações sem te pedir senha."
                  : certificado === "pronto"
                    ? "A certificadora vai te chamar pra videochamada de validação. Assim que ela passar, o app libera sozinho."
                    : certificado === "boleto"
                      ? "Mandamos no seu WhatsApp. A emissão começa quando ele compensar, em 1 a 3 dias úteis."
                      : "Seu MEI já está aberto e o CNPJ é seu. Pra gente cuidar dele por dentro do app, o certificado é o que falta."
                : liberado
                  ? "Conferimos seus dados e a ocupação. O registro em si é você quem faz, com a sua conta gov.br."
                  : "Enviamos seus dados pro nosso time. A conferência depende de gente, e costuma sair no mesmo dia útil."}
            </p>
            {/* ⚠️ Nenhum prazo em horas aqui, e isso é regra anti-guru: a
                conferência depende de pessoa, e prometer "24h" numa tela de
                espera é a promessa mais fácil de quebrar do app. */}
            {/* 🆕 07/09 (revisão contra o original) — OS CHIPS DO BOLETO
                FALTAVAM. No ME eles aparecem também quando a taxa foi paga por
                BOLETO e está compensando (`guiaBoleto` no `heroExtra`), com o
                valor daquela cobrança. O estado equivalente aqui é o
                certificado no boleto, e sem os chips a pessoa ficava com uma
                espera e nenhuma alavanca — o oposto do que o par existe pra
                fazer. Hierarquia igual à de lá: o 1º sólido e com o valor, o
                2º em contorno. */}
            {/* EMPILHADOS, largura de conteúdo — igual à M6.1 e ao hero do
                E9.1. Lado a lado eles perdem a hierarquia entre o sólido (que
                carrega o valor) e o de contorno. */}
            {naFaseCertificado && certificado === "boleto" && (
              <div className="mt-4 flex flex-col items-start gap-2">
                <button
                  type="button"
                  onClick={onVerBoleto}
                  className="flex min-h-10 items-center gap-1.5 rounded-full bg-surface-card px-3.5 text-caption font-semibold text-text-primary transition-colors active:bg-surface-alt"
                >
                  Ver o boleto de {reais(CUSTOS.CERTIFICADO_PRECO)}
                </button>
                <button
                  type="button"
                  onClick={onPagarPix}
                  className="flex min-h-10 items-center gap-1.5 rounded-full border border-border-hairline px-3.5 text-caption font-medium text-text-on-dark/80 transition-colors active:bg-white/10"
                >
                  Prefiro pagar por Pix
                </button>
              </div>
            )}

            <p className="mt-3 text-micro text-text-on-dark/50">
              Assim que um passo anda, a gente atualiza aqui e te avisa no
              WhatsApp.
            </p>
          </div>
        </div>

        <Rolagem className="pb-4">
          {/* ═══ A TIMELINE ══════════════════════════════════════════════════
              🔄 07/09 — era uma `<ol>` PLANA. Virou o mesmo acordeão de blocos
              da M6.1 e do status do ME (`_timeline-blocos.tsx`), que é o padrão
              das telas de status da casa. As 3 telas do ramo consomem a MESMA
              peça agora, então elas não têm como divergir uma da outra — que
              foi exatamente o defeito que o Pedro pegou 3 vezes hoje. */}
          <TimelineBlocosMei
            blocos={blocos}
            concluidas={concluidas}
            emAndamento={emAndamentoReal}
          />

          <p className="mt-4 text-micro text-text-tertiary">
            {naFaseCertificado
              ? certificado === "liberado"
                ? "Pronto. Daqui em diante o app é seu por inteiro."
                : "Seu CNPJ está ativo e não depende disso. O que espera é o acesso completo ao app, e ele te espera aqui."
              : "Enquanto a gente confere, você não precisa fazer nada. Seus dados ficam guardados: pode fechar o app que nada se perde."}
          </p>
        </Rolagem>

        {/* 🔄 07/09 (auditoria de anatomia) — O LINK FICA FORA DA ROLAGEM.
            Ele estava no fim do corpo rolável, e nesta tela isso o esconde de
            quem não rola até o fim — justamente numa tela de espera, onde
            falar com gente é a única coisa que a pessoa pode fazer quando não
            quer esperar. No ME ele mora num `app-footer-cta` próprio, colado
            acima do CTA, com alvo de 44px. */}
        <div className="app-footer-cta flex items-center justify-center pb-0">
          <a
            href={linkWhatsApp(
              naFaseCertificado
                ? "Oi! Meu MEI já está aberto e queria tirar uma dúvida sobre o certificado digital."
                : "Oi! Estou abrindo meu MEI no app da Legalizai e queria tirar uma dúvida.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 w-full items-center justify-center text-center text-caption font-medium text-text-secondary underline underline-offset-4"
          >
            Tirar uma dúvida no WhatsApp
          </a>
        </div>

        <Rodape>
          {/* O CTA fica VISÍVEL e travado enquanto espera, não escondido: a
              pessoa precisa VER que existe um próximo passo, só não pode agir
              ainda (regra de 31/08 do ME). */}
          {naFaseCertificado ? (
            /* 🔴 07/09 (decisão do Pedro) — AQUI A JORNADA PARA. Quem não pagou
               o certificado não entra no app, e o CTA é a saída, não um aviso.
               Quem já pagou fica esperando a emissão: o botão continua visível
               e travado, mesma regra de 31/08 do ME (a pessoa precisa VER que
               existe um próximo passo, só não pode agir ainda). */
            <Button
              full
              disabled={certificado === "boleto" || certificado === "pronto"}
              onClick={
                certificado === "liberado" ? onEntrar : onPagarCertificado
              }
            >
              {certificado === "pendente"
                ? "Pagar meu certificado"
                : certificado === "boleto"
                  ? "Aguardando o boleto compensar"
                  : certificado === "pronto"
                    ? "Aguardando a validação"
                    : "Entrar no meu painel"}
            </Button>
          ) : (
            <Button full disabled={!liberado} onClick={onVerProximosPassos}>
              {liberado ? "Ver meus próximos passos" : "Aguardando a conferência"}
            </Button>
          )}
        </Rodape>
      </main>
    </>
  );
}
