"use client";

import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo } from "@/components/ui/tela";
import { CONFERENCIA, type OrigemCampo, type TelaConferencia } from "@/lib/conferencia-dados";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * /conferencia · A LISTA DE COLETA DO ME, EM TELA (referência do DEV)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 01/09 (pedido do Pedro) — "uma linha acima do dossiê, cinza": não é tela
 * de produto, ninguém do lado do cliente vê isso. É o mesmo layout de cards da
 * A1 (revisão), com o conteúdo trocado: em vez do recap do que ESTE cliente
 * preencheu, a lista de TUDO que o flow coleta, na ORDEM em que coleta, com
 * cada campo etiquetado por quem o preenche.
 *
 * ─── POR QUE ETIQUETAR A ORIGEM ────────────────────────────────────────────
 * O dev olhava as telas e via só formulário. Metade do que a JUCEMG/DBE exige
 * nunca aparece pro cliente: forma de atuação, metragem, capital social, tipo
 * de contrato, natureza jurídica. Sem a etiqueta, ele implementaria só o que
 * está desenhado e o RPA chegaria na Junta com campo vazio. As 3 etiquetas
 * dizem, campo a campo, de onde vem o valor:
 *
 *   · USUÁRIO    — a pessoa digita ou escolhe na tela.
 *   · AUTOMÁTICO — a Legalizai preenche (constante nossa, decisão travada).
 *   · API        — vem de integração externa (tem latência, erro e fallback).
 *
 * ⚠️ ESCOPO: constituição de ME. MEI e migração não entram — e é de propósito.
 *
 * 🔒 A lista é GERADA (`lib/conferencia-dados.ts` ← `flow-data.mjs`), nunca
 * escrita à mão: mudou o campo na fonte-única, roda `gerar-mapa.mjs` e esta
 * tela acompanha. Foi o único jeito de ela não virar documento velho em duas
 * semanas, que é o destino de toda tabela de campos copiada.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const ETIQUETA: Record<OrigemCampo, { texto: string; classe: string }> = {
  usuario: {
    texto: "USUÁRIO",
    classe: "bg-surface-tint-brand text-action-primary-sm",
  },
  automatico: {
    texto: "AUTOMÁTICO",
    classe: "bg-state-info-tint text-state-info-text",
  },
  api: {
    texto: "API",
    classe: "bg-state-warning-tint text-state-warning-text",
  },
};

export function ConferenciaView({ onVoltar }: { onVoltar?: () => void }) {
  const total = CONFERENCIA.reduce((n, t) => n + t.campos.length, 0);
  const porOrigem = (o: OrigemCampo) =>
    CONFERENCIA.reduce((n, t) => n + t.campos.filter((c) => c.origem === o).length, 0);

  return (
    <>
      <TelaHeader meta="Referência do dev" onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo sub="Tudo que a constituição de ME coleta, na ordem em que coleta. Cada campo diz quem preenche: a pessoa, a gente, ou uma API.">
          O que entra em cada passo
        </Titulo>

        <Corpo>
          {/* Placar: o dev vê de cara que a maior parte do trabalho NÃO é
              formulário. Números derivados da lista, não digitados. */}
          <Card>
            <p className="text-caption text-text-secondary mb-3">
              {total} campos em {CONFERENCIA.length} passos, do primeiro dado do lead até
              a razão social ir pra viabilidade na JUCEMG.
            </p>
            <div className="flex flex-wrap gap-2">
              <Placar origem="usuario" n={porOrigem("usuario")} />
              <Placar origem="automatico" n={porOrigem("automatico")} />
              <Placar origem="api" n={porOrigem("api")} />
            </div>
          </Card>

          {CONFERENCIA.map((tela, i) => (
            <BlocoTela key={tela.id} tela={tela} ordem={i + 1} />
          ))}

          <p className="text-micro text-text-tertiary">
            Gerado de <code>produto/_flow/flow-data.mjs</code> por{" "}
            <code>node produto/_flow/gerar-mapa.mjs</code>. Não editar esta tela pra
            corrigir um campo: corrige na fonte e roda o gerador.
          </p>
        </Corpo>
      </main>
    </>
  );
}

function Placar({ origem, n }: { origem: OrigemCampo; n: number }) {
  const e = ETIQUETA[origem];
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-micro font-semibold tracking-wide ${e.classe}`}
    >
      {n} {e.texto}
    </span>
  );
}

function BlocoTela({ tela, ordem }: { tela: TelaConferencia; ordem: number }) {
  return (
    <Card>
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="text-body font-semibold text-text-primary">
          <span className="text-text-tertiary">{ordem}. </span>
          {tela.titulo}
        </h2>
        {tela.rota ? (
          <a
            href={tela.rota}
            className="shrink-0 text-caption font-semibold text-action-primary-sm underline underline-offset-4"
          >
            abrir
          </a>
        ) : (
          /* O card do RPA não tem rota porque não tem tela: são os campos que
             nascem no processo, depois do C7. Marcar como "sem tela" é mais
             honesto que esconder o card. */
          <span className="shrink-0 text-micro text-text-tertiary">sem tela</span>
        )}
      </div>

      {tela.rota && (
        <p className="text-micro text-text-tertiary mb-3">
          <code>{tela.rota}</code>
        </p>
      )}

      <div className="flex flex-col gap-3">
        {tela.campos.map((c, i) => {
          const e = ETIQUETA[c.origem];
          return (
            <div key={`${tela.id}-${i}`} className="flex flex-col gap-1">
              <div className="flex items-start gap-2">
                <span
                  className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-micro font-semibold tracking-wide ${e.classe}`}
                >
                  {e.texto}
                </span>
                <span className="text-caption text-text-primary">{c.nome}</span>
              </div>
              {/* 🆕 01/09 (pedido do Pedro) — nos sistemas do governo o campo é
                  um select onde o que vale é o CÓDIGO, não o rótulo: o RPA
                  escolhe "49", "2062", "101". Fica em destaque, monoespaçado,
                  porque é o que o dev vai digitar. Só aparece onde a fonte
                  confirma o código (gravação/prints) — nunca deduzido. */}
              {c.codigo && (
                <p className="pl-1">
                  <span className="rounded bg-surface-alt px-1.5 py-0.5 font-mono text-micro font-semibold text-text-primary">
                    {c.codigo}
                  </span>
                </p>
              )}
              {c.valor && (
                <p className="pl-1 text-caption text-text-secondary">
                  <span className="text-text-tertiary">valor: </span>
                  {c.valor}
                </p>
              )}
              {c.status && <p className="pl-1 text-micro text-text-tertiary">{c.status}</p>}
              {c.porque && <p className="pl-1 text-micro text-text-tertiary">{c.porque}</p>}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
