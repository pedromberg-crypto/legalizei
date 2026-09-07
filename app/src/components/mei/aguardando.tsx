"use client";

import { Button } from "@/components/ui/button";
import { Rolagem, Rodape } from "@/components/ui/tela";
import { CUSTOS } from "@/lib/fiscal";
import { linkWhatsApp } from "@/lib/contato";
import { reais } from "./_formato";
import { TimelineBlocosMei, type BlocoStatus } from "./_timeline-blocos";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M6.1 / M6.1P · O STATUS DEPOIS DO PAGAMENTO — a anatomia do E9.1.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09 (pedido do Pedro). É o par do E9.1/E9.1P do ME, que o ramo não
 * tinha: quem pagava saía do splash direto pra atividade, sem nenhuma tela
 * dizendo o que acabou de acontecer nem o que falta.
 *
 * 🔄 07/09 — REESCRITA DUAS VEZES no mesmo dia, e as duas correções foram do
 * Pedro comparando com o original. Vale registrar o padrão, porque ele é o
 * aprendizado da rodada: nas duas vezes eu montei a tela "no espírito" do ME
 * em vez de PORTAR a anatomia dele.
 *
 *   · 1ª correção — o hero: eu tinha inventado um check "Plano MEI ativo"
 *     (no ME o estado pago é a AUSÊNCIA dos chips, não um selo), chips
 *     genéricos sem valor e sem hierarquia, faltava a linha do WhatsApp e as
 *     bolinhas eram próprias em vez do `StatusIcon` do DS.
 *   · 2ª correção — a lista: ela era uma `<ol>` PLANA de passos. O status do
 *     ME é um **acordeão de blocos** (`TimelineEmBlocos`), com contador
 *     "X de Y" por bloco, borda coral no bloco da vez e o da vez nascendo
 *     aberto. Portado pro ramo em `_timeline-blocos.tsx` — e agora ele é peça
 *     compartilhada, pra a próxima tela de status não repetir o erro.
 *
 * ─── POR QUE NÃO DÁ PRA REUSAR O M12 ────────────────────────────────────────
 * O M12 é o status DEPOIS do M11 — ele fala de conferência humana em curso e
 * de empresa a caminho. Aqui nada disso começou: a pessoa acabou de pagar e
 * ainda tem o cadastro inteiro pela frente.
 *
 * ─── OS 2 ESTADOS ──────────────────────────────────────────────────────────
 * Mesma doutrina do E9.1 × E9.1P: muda o TOPO, não a tela.
 *   · `pago` (cartão/Pix)  → sem chips, o hero só confirma;
 *   · boleto pendente      → os 2 chips empilhados, e o item "Plano escolhido"
 *     fica GIRANDO com o detalhe da compensação, exatamente como no E9.1.
 *
 * ─── 🔴 A DIVERGÊNCIA DELIBERADA (a única) ──────────────────────────────────
 * No ME, com boleto pendente, o CTA fica **travado** ("Aguardando compensar",
 * `desabilitado: !pago`): lá o dossiê inteiro espera o dinheiro.
 *
 * Aqui ele **continua ativo**, e isso é decisão de produto, não descuido: no
 * MEI o registro depende do titular clicar no Portal, não do nosso
 * processamento — travar o cadastro criaria uma espera que não existe. O que
 * de fato espera o boleto é a CONFERÊNCIA do nosso time, e é isso que o item
 * girando diz. Se essa leitura mudar, é trocar 2 linhas: `desabilitado` no
 * CTA e o rótulo.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Os blocos do cadastro do MEI.
 *
 * ⚠️ A lista cobre a jornada INTEIRA, não só o que falta — foi o outro erro da
 * 1ª versão. No E9.1 o bloco "Conta e plano" aparece com "Dados base
 * preenchidos" já verde: a pessoa precisa ver o que ela JÁ fez, senão a tela
 * lê como se ela estivesse no começo depois de ter pago.
 */
function blocosDoCadastro(pago: boolean): BlocoStatus[] {
  return [
    {
      id: 1,
      titulo: "Conta e plano",
      itens: [
        { nome: "Dados base preenchidos", jaFeito: true },
        pago
          ? { nome: "Plano escolhido e pago", jaFeito: true }
          : {
              /* ✍️ Com o boleto pendente o item NÃO pode dizer "e pago" — nada
                 compensou ainda. Mesma correção que o Pedro fez no ME em
                 31/08, vendo a tela ao vivo. */
              nome: "Plano escolhido",
              emCurso: true,
              detalhe:
                "Aguardando o banco confirmar o boleto. Costuma cair em 1 a 3 dias úteis.",
            },
      ],
    },
    /* ⚠️ Daqui pra baixo a vez é do CLIENTE, e o `deQuem` existe por isso: sem
       ele o item da vez dizia "Em andamento agora, te avisaremos quando
       terminar" — a frase de quem espera um órgão — logo acima de um CTA
       "Continuar preenchendo". A tela dizia que a gente estava fazendo e
       mandava a pessoa fazer, na mesma dobra. */
    {
      id: 2,
      titulo: "O que você faz",
      itens: [
        { nome: "Atividade principal", deQuem: "cliente" },
        { nome: "Atividades secundárias", deQuem: "cliente" },
      ],
    },
    {
      id: 3,
      titulo: "Seus dados",
      itens: [{ nome: "Dados do titular", deQuem: "cliente" }],
    },
    {
      id: 4,
      titulo: "Sua empresa",
      itens: [
        { nome: "Endereço e formas de atuação", deQuem: "cliente" },
        { nome: "Nome da empresa", deQuem: "cliente" },
      ],
    },
    {
      id: 5,
      titulo: "Autorização",
      itens: [{ nome: "Revisar e autorizar o registro", deQuem: "cliente" }],
    },
  ];
}

export function AguardandoMeiView({
  pago = false,
  onSeguir,
  onVerBoleto,
  onPagarPix,
}: {
  /** `true` = cartão/Pix (caiu na hora) · `false` = boleto esperando compensar. */
  pago?: boolean;
  onSeguir?: () => void;
  onVerBoleto?: () => void;
  onPagarPix?: () => void;
}) {
  const blocos = blocosDoCadastro(pago);
  /* Os 2 itens do bloco 1 já aconteceram (a conta e a escolha do plano); o
     ponteiro para na atividade, que é o próximo passo real. Com boleto
     pendente o 2º item vira `emCurso` em vez de feito — ele gira, mas o
     ponteiro não recua: o cadastro segue disponível. */
  const concluidas = pago ? 2 : 1;
  const emAndamento = 2;

  return (
    <>
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
              Mesma anatomia do `PainelView` no modo escuro: `mt-4 mb-5
              rounded-2xl p-5`, gradiente coral no canto sobre `surface-dark`,
              título `text-h1`, subtítulo em baixa opacidade, chips e a linha
              do WhatsApp no pé. O eyebrow some sozinho no escuro (o título já
              carrega o contexto). */}
          <div
            className="mt-4 mb-5 rounded-2xl p-5 text-text-on-dark"
            style={{
              background:
                "radial-gradient(120% 100% at 0% 0%, color-mix(in srgb, var(--color-action-primary) 45%, transparent) 0%, transparent 55%), var(--color-surface-dark)",
            }}
          >
            <p className="text-h1 font-bold leading-tight">
              {pago ? "Pagamento confirmado" : "Seu boleto está a caminho"}
            </p>
            <p className="mt-1.5 text-caption text-text-on-dark/70">
              {pago
                ? "Seu plano está ativo. Agora é montar seu cadastro, e é rápido."
                : "Boleto leva de 1 a 3 dias úteis pra cair."}
            </p>

            {/* Os chips só existem com o boleto pendente — condição exata do
                `heroExtra` no ME. EMPILHADOS e com largura de conteúdo
                (`items-start`, não `flex-wrap` lado a lado): o 1º é sólido e
                carrega o VALOR, o 2º é contorno. Dois chips iguais na mesma
                linha não teriam hierarquia nenhuma. */}
            {!pago && (
              <div className="mt-4 flex flex-col items-start gap-2">
                <button
                  type="button"
                  onClick={onVerBoleto}
                  className="flex min-h-10 items-center gap-1.5 rounded-full bg-surface-card px-3.5 text-caption font-semibold text-text-primary transition-colors active:bg-surface-alt"
                >
                  Ver o boleto de {reais(CUSTOS.MENSALIDADE_MEI)}
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
          <TimelineBlocosMei
            blocos={blocos}
            concluidas={concluidas}
            emAndamento={emAndamento}
          />
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
              "Oi! Estou abrindo meu MEI no app da Legalizai e queria tirar uma dúvida.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 w-full items-center justify-center text-center text-caption font-medium text-text-secondary underline underline-offset-4"
          >
            Tirar uma dúvida no WhatsApp
          </a>
        </div>

        <Rodape>
          {/* 🔴 Ver a divergência deliberada no cabeçalho: no ME este botão
              fica travado enquanto o boleto não compensa. Aqui não, porque o
              cadastro do MEI não depende do nosso processamento. */}
          <Button full onClick={onSeguir}>
            Continuar preenchendo
          </Button>
        </Rodape>
      </main>
    </>
  );
}
