"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/form";
import { TelaHeader, Titulo, Corpo, Rodape } from "@/components/ui/tela";
import { StatusIcon } from "@/components/ui/status";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M11 · REVISAR E AUTORIZAR — no layout aprovado da A1.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09, redesenhada no mesmo dia (pedido do Pedro: layouts do ME, copy
 * daqui).
 *
 * ─── DE ONDE VEM O LAYOUT ───────────────────────────────────────────────────
 * Da A1 (`RevisarView` em `wizard-cauda.tsx`), na forma validada em 03 e
 * 04/09 — e cada detalhe abaixo é uma correção que já custou uma rodada:
 *
 *   · **título de seção FORA do cartão**, em `text-h2` (04/09): dentro, em
 *     `caption` semibold, ele tinha o tamanho de um valor qualquer do recap e
 *     competia com as linhas em vez de mandar nelas. Fora, ele vira RÉGUA — a
 *     subdivisão da tela é lida antes do conteúdo;
 *   · **a pill "Ajustar" sobe junto com o título**, porque é a ação DA SEÇÃO;
 *     dentro do cartão ela ficava órfã do título que ajusta;
 *   · **a pill é cinza, não coral** (04/09): 5 pills corais competiam entre si
 *     e com o CTA do rodapé, que é o único coral que deveria mandar aqui. E
 *     some a dívida de contraste do branco sobre coral-600;
 *   · **o cartão é BRANCO** (04/09): nasceu cinza pra ecoar a C4, mas cinza no
 *     app já significa "campo travado, dado que não se mexe" — numa tela em
 *     que a ação principal é ajustar, o fundo dizia o contrário do botão;
 *   · **o botão "Conferi" é toggle**, com rótulo no passado quando ligado
 *     ("Conferido"), pra ler como estado e não como uma segunda tarefa.
 *
 * ⚠️ Reescrito, não importado: a trava de fronteira proíbe o ramo MEI de
 * importar tela de ME.
 *
 * ─── O QUE TINHA ACONTECIDO COM ESTA TELA ───────────────────────────────────
 * 🔴 É a correção do defeito mais grave do ramo. O MEI tinha a sua própria A2
 * (`/termo?regime=mei`), escrita e auditada em 28/08. Em 01/09 a A2 do ME foi
 * aposentada — o aceite virou o último bloco da A1 — e a rota morreu. Ninguém
 * percebeu que o MEI morava nela.
 *
 * Resultado: a partir de 01/09, quem fazia o caminho MEI saía do `/revisar` e
 * caía em `/iniciar-viabilidade` — **uma tela sobre a consulta prévia de
 * viabilidade, que foi EXTINTA pro MEI pela Res. CGSIM 61/2020**. O flow
 * prometia uma etapa que não existe, na tela mais sensível do funil.
 *
 * A copy abaixo junta as duas telas certas: o recap da `RevisarMeiView`
 * (variante MEI da A1) e as declarações da `TermoView` aposentada, recuperadas
 * antes que ela seja apagada.
 *
 * ─── A REGRA DE COPY QUE MANDA AQUI ─────────────────────────────────────────
 * ✍️ **Nunca dizer "a gente abre pra você".** Não existe API nem procuração
 * que cubra o registro de MEI, e a senha gov.br é pessoal e intransferível por
 * Termo de Uso. O que a gente faz é conferir, escolher a ocupação certa e
 * deixar pronto. O clique é dele, e a tela diz isso na cara.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Um bloco do recap, com a porta pra ajustar. */
export interface BlocoRevisao {
  titulo: string;
  /** Cada linha é rótulo miúdo em cima do valor, igual ao cartão da C4. */
  linhas: { rotulo: string; valor: string }[];
  /** Pra onde o "Ajustar" leva. Ausente = bloco não editável aqui. */
  onAjustar?: () => void;
}

/** O que a gente faz depois que ela autoriza. 4 passos, nesta ordem. */
const O_QUE_ACONTECE = [
  "Nosso time confere seus dados e a ocupação que você escolheu.",
  "A gente deixa cada campo pronto, na ordem do Portal do Empreendedor.",
  "Você finaliza o registro com a sua conta gov.br, e o CNPJ sai na hora.",
  "Com o CNPJ na mão, a gente assume guias, notas e declarações.",
];

/**
 * As 3 declarações do formulário oficial.
 *
 * ⚠️ No MEI elas não são letra miúda: a de dispensa de alvará (Res. CGSIM
 * 59/2020) transfere responsabilidade cível e penal pro titular, e é ELE que
 * vai marcar o aceite lá no Portal. Chegar no Portal sem nunca ter lido o que
 * está aceitando seria o oposto da doutrina de honestidade antes do toque.
 */
const DECLARACOES = [
  "Que não é impedido por lei de ser empresário, e que não tem outra empresa ativa no seu nome.",
  "Que opta pelo Simples Nacional na forma do SIMEI, o regime de valor fixo mensal.",
  "Que sua atividade é de baixo risco, assumindo o compromisso de seguir as normas municipais. É esse termo que dispensa o alvará.",
];

export function RevisarMeiView({
  meta,
  blocos,
  autorizado,
  setAutorizado,
  onSeguir,
  onVoltar,
}: {
  /** Nome de PRA ONDE O VOLTAR LEVA (vem de `mei-flow.metaDoVoltar`). */
  meta: string;
  blocos: BlocoRevisao[];
  autorizado: boolean;
  setAutorizado: (v: boolean) => void;
  onSeguir?: () => void;
  onVoltar?: () => void;
}) {
  const [conferidos, setConferidos] = useState<string[]>([]);
  const faltam = blocos.filter((b) => !conferidos.includes(b.titulo)).length;

  return (
    <>
      <TelaHeader meta={meta} onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo sub="Confira com calma. É com esses dados que a gente monta o seu registro, e é você quem vai finalizar no Portal do Empreendedor.">
          Está tudo certo?
        </Titulo>

        <Corpo>
          {/* ═══ O RECAP, BLOCO A BLOCO ═════════════════════════════════════ */}
          {blocos.map((b) => (
            <BlocoRevisaoMei
              key={b.titulo}
              titulo={b.titulo}
              onAjustar={b.onAjustar}
              conferido={conferidos.includes(b.titulo)}
              onConferir={() =>
                setConferidos((c) =>
                  c.includes(b.titulo)
                    ? c.filter((x) => x !== b.titulo)
                    : [...c, b.titulo],
                )
              }
            >
              {b.linhas.map((l) => (
                <LinhaRevisao key={l.rotulo} rotulo={l.rotulo} valor={l.valor} />
              ))}
            </BlocoRevisaoMei>
          ))}

          {/* ═══ O ENQUADRAMENTO ════════════════════════════════════════════
              O card que a `RevisarMeiView` do ME já trazia: no MEI o cálculo
              é fixo, sem Anexo nem Fator R. É informação que tranquiliza, não
              alerta — por isso card neutro. */}
          <Card>
            <p className="text-body font-semibold text-text-primary mb-1">
              Seu enquadramento
            </p>
            <p className="text-caption text-text-secondary">
              MEI paga um DAS fixo por mês, sem Fator R nem Anexo pra calcular.
              É bem mais simples que o Simples Nacional de uma ME.
            </p>
          </Card>

          {/* ═══ O QUE ACONTECE DEPOIS ══════════════════════════════════════ */}
          <div>
            <h2 className="text-h2 text-text-primary mb-2">
              Quando você autoriza
            </h2>
            <div className="rounded-md border border-border-hairline bg-surface-card p-3">
              <div className="flex flex-col gap-2.5">
                {O_QUE_ACONTECE.map((p) => (
                  <div key={p} className="flex items-start gap-2.5">
                    <span className="mt-0.5 shrink-0">
                      <StatusIcon estado="a-fazer" />
                    </span>
                    <p className="text-caption text-text-secondary">{p}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 🎯 A frase que não pode faltar em nenhuma versão desta tela.
              Cartão branco com título na cor do estado (`neutro` do `Aviso`,
              04/09): a mensagem é "isto acontece assim", não alarme. */}
          <div className="rounded-md border border-border-hairline bg-surface-card p-4">
            <p className="text-body font-semibold text-state-warning-text mb-1">
              O registro em si é você quem faz
            </p>
            <p className="text-caption text-text-secondary">
              O governo não permite que ninguém abra um MEI no lugar de outra
              pessoa: o Portal exige a sua conta gov.br, e ela é pessoal. A
              gente faz todo o resto, e te acompanha nesse passo. Depois de
              registrado, não tem como desfazer.
            </p>
          </div>

          {/* ═══ AS 3 DECLARAÇÕES ═══════════════════════════════════════════ */}
          <div>
            <h2 className="text-h2 text-text-primary mb-2">
              O que você vai declarar no Portal
            </h2>
            <div className="rounded-md border border-border-hairline bg-surface-card p-3">
              <div className="flex flex-col gap-2.5">
                {DECLARACOES.map((d) => (
                  <p key={d} className="text-caption text-text-secondary">
                    {d}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ CANCELAMENTO ═══════════════════════════════════════════════
              ⚠️ Sem a cláusula de taxa da Junta que o ME tem: no MEI não
              existe taxa nenhuma pra não reembolsar. */}
          <div>
            <h2 className="text-h2 text-text-primary mb-2">
              Como funciona o cancelamento
            </h2>
            <div className="rounded-md border border-border-hairline bg-surface-card p-3">
              <div className="flex flex-col gap-2.5">
                <p className="text-caption text-text-secondary">
                  Você autoriza de forma expressa, aqui, marcando o aceite. Nada
                  começa sem esse passo.
                </p>
                <p className="text-caption text-text-secondary">
                  O nosso serviço (a mensalidade) você cancela quando quiser,
                  respeitando o prazo do plano.
                </p>
                <p className="text-caption text-text-secondary">
                  Até aqui nada foi registrado. Se desistir antes de autorizar,
                  recebe de volta o que pagou.
                </p>
              </div>
            </div>
          </div>

          <Checkbox checked={autorizado} onChange={setAutorizado}>
            Autorizo a Legalizai a preparar o meu MEI, e entendi que o registro
            final é feito por mim no Portal do Empreendedor.
          </Checkbox>
        </Corpo>

        <Rodape>
          {/* O botão DIZ O QUE FALTA, régua de 04/09 — e aqui ele conta os
              blocos que ainda não foram conferidos, que é a informação que a
              pessoa não tem de relance numa tela longa. */}
          <Button full disabled={!autorizado} onClick={onSeguir}>
            {faltam > 0 && !autorizado
              ? `Falta conferir ${faltam} ${faltam === 1 ? "bloco" : "blocos"}`
              : !autorizado
                ? "Falta autorizar"
                : "Autorizo, pode preparar"}
          </Button>
        </Rodape>
      </main>
    </>
  );
}

/* ═══════════════════ AS 2 PEÇAS DO RECAP DA A1 ══════════════════════════ */

/**
 * Título de seção FORA do cartão, com a pill de ajuste na mesma linha.
 * Ver o cabeçalho do arquivo pra por que cada uma dessas escolhas existe.
 */
function BlocoRevisaoMei({
  titulo,
  onAjustar,
  conferido,
  onConferir,
  children,
}: {
  titulo: string;
  onAjustar?: () => void;
  conferido: boolean;
  onConferir: () => void;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-h2 text-text-primary">{titulo}</h2>
        {onAjustar && (
          <button
            type="button"
            onClick={onAjustar}
            aria-label={`Ajustar ${titulo}`}
            className="shrink-0 rounded-full border border-border-hairline bg-surface-alt px-3.5 py-1.5 min-h-9
                       text-caption font-semibold text-text-secondary transition-colors
                       hover:bg-surface-card hover:text-text-primary"
          >
            Ajustar
          </button>
        )}
      </div>

      <div className="rounded-md border border-border-hairline bg-surface-card p-3">
        <div className="flex flex-col gap-2">{children}</div>

        {/* Toggle, não trava: quem confirmou por engano desfaz no mesmo botão.
            Rótulo no PASSADO quando ligado, pra ler como estado. */}
        <button
          type="button"
          onClick={onConferir}
          aria-pressed={conferido}
          className={`mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-md border text-caption font-semibold transition-colors ${
            conferido
              ? "border-transparent bg-state-success-tint text-state-success-text"
              : "border-border-strong text-text-primary hover:bg-surface-alt"
          }`}
        >
          {conferido && <StatusIcon estado="feito" />}
          {conferido ? "Conferido" : "Conferi"}
        </button>
      </div>
    </section>
  );
}

/** Rótulo miúdo em cima, valor em semibold: o que a pessoa veio conferir. */
function LinhaRevisao({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-micro text-text-tertiary">{rotulo}</span>
      <span className="text-caption font-semibold text-text-primary">
        {valor}
      </span>
    </div>
  );
}
