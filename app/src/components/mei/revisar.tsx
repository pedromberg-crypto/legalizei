"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/form";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { StatusIcon } from "@/components/ui/status";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M11 · REVISAR E AUTORIZAR — a tela que o MEI tinha perdido.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09, e esta é a correção do defeito mais grave do levantamento.
 *
 * ─── O QUE TINHA ACONTECIDO ─────────────────────────────────────────────────
 * O MEI tinha a sua própria A2 (`/termo?regime=mei`, `TermoView` com uma
 * variante `mei` inteira, escrita e auditada em 28/08). Em 01/09 a A2 do ME
 * foi aposentada — o aceite virou o último bloco da A1 — e a rota morreu.
 * Ninguém percebeu que o MEI morava nela.
 *
 * Resultado: a partir de 01/09, quem fazia o caminho MEI saía do `/revisar` e
 * caía em `/iniciar-viabilidade` — **uma tela sobre a consulta prévia de
 * viabilidade, que foi EXTINTA pro MEI pela Res. CGSIM 61/2020**. O flow
 * prometia uma etapa que não existe, na tela mais sensível do funil.
 *
 * A copy abaixo é a da `TermoView` variante MEI, recuperada e trazida pra cá
 * antes que o componente aposentado seja apagado. Ela não foi reescrita: foi
 * auditada em 28/08 (é dela o erro nº 8, "Registra sua empresa no Portal do
 * Empreendedor", que era a promessa que a gente não pode cumprir).
 *
 * ─── A REGRA DE COPY QUE MANDA AQUI ─────────────────────────────────────────
 * ✍️ **Nunca dizer "a gente abre pra você".** Não existe API nem procuração
 * que cubra o registro de MEI, e a senha gov.br é pessoal e intransferível por
 * Termo de Uso. O que a gente faz é conferir, escolher a ocupação certa e
 * deixar pronto. O clique é dele, e a tela diz isso na cara.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Um bloco do que foi preenchido, com a porta pra ajustar. */
export interface BlocoRevisao {
  titulo: string;
  linhas: string[];
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
  return (
    <>
      <TelaHeader meta={meta} onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo sub="Você já pagou e já montou tudo. Confere e autoriza que a gente começa.">
          Pode preparar seu MEI?
        </Titulo>

        <Corpo>
          {/* ── O QUE FOI PREENCHIDO ──────────────────────────────────────── */}
          {blocos.map((b) => (
            <Card key={b.titulo}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-micro text-text-tertiary">{b.titulo}</p>
                  {b.linhas.map((l) => (
                    <p key={l} className="text-body text-text-primary break-words">
                      {l}
                    </p>
                  ))}
                </div>
                {b.onAjustar && (
                  <button
                    type="button"
                    onClick={b.onAjustar}
                    className="shrink-0 text-caption font-semibold text-action-primary-sm underline underline-offset-4"
                  >
                    Ajustar
                  </button>
                )}
              </div>
            </Card>
          ))}

          {/* ── O QUE ACONTECE DEPOIS ─────────────────────────────────────── */}
          <div>
            <p className="text-body font-semibold text-text-primary mb-2">
              Quando você autoriza, a gente começa agora:
            </p>
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

          {/* 🎯 A frase que não pode faltar em nenhuma versão desta tela. */}
          <Aviso neutro variante="warning" titulo="O registro em si é você quem faz">
            O governo não permite que ninguém abra um MEI no lugar de outra
            pessoa: o Portal exige a sua conta gov.br, e ela é pessoal. A gente
            faz todo o resto, e te acompanha nesse passo. Depois de registrado,
            não tem como desfazer.
          </Aviso>

          {/* ── AS 3 DECLARAÇÕES ──────────────────────────────────────────── */}
          <div>
            <p className="text-body font-semibold text-text-primary mb-2">
              O que você vai declarar no Portal
            </p>
            <div className="flex flex-col gap-2.5">
              {DECLARACOES.map((d) => (
                <p key={d} className="text-caption text-text-secondary">
                  {d}
                </p>
              ))}
            </div>
          </div>

          {/* ── CANCELAMENTO ──────────────────────────────────────────────
              ⚠️ Sem a cláusula de taxa da Junta que o ME tem: no MEI não
              existe taxa nenhuma pra não reembolsar. */}
          <div>
            <p className="text-body font-semibold text-text-primary mb-2">
              Como funciona o cancelamento
            </p>
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

          <Checkbox checked={autorizado} onChange={setAutorizado}>
            Autorizo a Legalizai a preparar o meu MEI, e entendi que o registro
            final é feito por mim no Portal do Empreendedor
          </Checkbox>
        </Corpo>

        <Rodape>
          <Button full disabled={!autorizado} onClick={onSeguir}>
            Autorizar
          </Button>
        </Rodape>
      </main>
    </>
  );
}
