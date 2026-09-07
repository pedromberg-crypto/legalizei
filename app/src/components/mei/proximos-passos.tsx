"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/form";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M13 · ÚLTIMOS PASSOS — a "cola".
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 28/08, mudou de casa em 07/09 (fork do ramo).
 *
 * ⚠️ ESTA TELA EXISTE POR RAZÃO JURÍDICA, NÃO DE UX. Não dá pra abrir MEI pelo
 * cliente: não há API, não há procuração que cubra o registro originário (a do
 * e-CAC só vale pra atos posteriores), e a senha gov.br é "pessoal e
 * intransferível" por Termo de Uso — pedir a senha dele seria violação, não
 * atalho.
 *
 * Então a entrega é o passo a passo com os valores DELE prontos, na ordem dos
 * campos do Portal. É o oposto do ME, onde a gente executa e ele assina no fim.
 *
 * ✍️ A copy NUNCA pode dizer "a gente abre pra você". O que a gente faz é
 * conferir, escolher a ocupação certa e entregar pronto. O clique final é
 * dele, e a tela diz isso na cara — porque a alternativa é uma promessa que a
 * gente não pode cumprir.
 *
 * 🔴 Aberto desde 28/08: definir se o "copiar tudo" vira PDF ou mensagem de
 * WhatsApp. E esta é a tela mais cara de evoluir se um dia a automação for
 * possível — o que ela entrega hoje é justamente a ausência de automação.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Um campo do formulário oficial, já com o valor do cliente pronto. */
export interface CampoCola {
  rotulo: string;
  valor: string;
  /** Explicação curta de onde esse campo aparece ou por que o valor é esse. */
  nota?: string;
}

export function ProximosPassosMeiView({
  meta,
  campos,
  nivelGovBrOk,
  setNivelGovBrOk,
  onAbrirPortal,
  onCopiarTudo,
  onConfirmarCnpj,
  onVoltar,
}: {
  /** Nome de PRA ONDE O VOLTAR LEVA (vem de `mei-flow.metaDoVoltar`). */
  meta: string;
  /** Os valores dele, na ordem dos campos do Portal do Empreendedor. */
  campos: CampoCola[];
  /** Ele já confirmou que tem conta gov.br Prata ou Ouro? */
  nivelGovBrOk: boolean;
  setNivelGovBrOk: (v: boolean) => void;
  onAbrirPortal?: () => void;
  onCopiarTudo?: () => void;
  onConfirmarCnpj?: () => void;
  onVoltar?: () => void;
}) {
  const [copiado, setCopiado] = useState<string | null>(null);

  function copiar(rotulo: string, valor: string) {
    // `navigator.clipboard` não existe em contexto inseguro nem em alguns
    // WebViews — o try/catch evita quebrar a tela por uma conveniência.
    try {
      void navigator.clipboard?.writeText(valor);
      setCopiado(rotulo);
      setTimeout(() => setCopiado(null), 1600);
    } catch {
      /* silencioso: o valor continua visível e selecionável na tela */
    }
  }

  return (
    <>
      <TelaHeader meta={meta} onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo sub="Conferimos tudo e deixamos seus dados prontos. O registro em si só pode ser feito por você, com sua conta gov.br.">
          Está tudo pronto pra você finalizar
        </Titulo>

        <Corpo>
          {/* Honestidade antes do toque: explicar a limitação ANTES de pedir a
              ação, não depois que ele estranhar. */}
          <Aviso variante="info" titulo="Por que essa parte é você quem faz">
            O governo não permite que ninguém registre um MEI no lugar de outra
            pessoa: o Portal do Empreendedor exige a sua conta gov.br, e ela é
            pessoal. Então a gente fez tudo o que dava — conferiu seus dados,
            escolheu a ocupação certa e deixou cada campo pronto aqui embaixo.
          </Aviso>

          {/* ── PASSO 1 · a conta gov.br ─────────────────────────────────── */}
          <Card>
            <p className="text-micro text-text-tertiary">Passo 1</p>
            <p className="text-body font-semibold text-text-primary mt-0.5 mb-1">
              Confira o nível da sua conta gov.br
            </p>
            <p className="text-caption text-text-secondary mb-3">
              Precisa ser <strong>Prata</strong> ou <strong>Ouro</strong>. Se a
              sua for Bronze, dá pra subir na hora pelo app do seu banco ou pelo
              reconhecimento facial do gov.br.
            </p>
            <Checkbox checked={nivelGovBrOk} onChange={setNivelGovBrOk}>
              Minha conta gov.br já é Prata ou Ouro
            </Checkbox>
          </Card>

          {/* ── PASSO 2 · a cola ─────────────────────────────────────────── */}
          <div>
            <p className="text-micro text-text-tertiary">Passo 2</p>
            <p className="text-body font-semibold text-text-primary mt-0.5 mb-1">
              Copie e cole no Portal, na ordem
            </p>
            <p className="text-caption text-text-secondary mb-3">
              É a mesma ordem que aparece lá. Nome, CPF e data de nascimento o
              próprio gov.br preenche sozinho.
            </p>

            <div className="flex flex-col gap-2">
              {campos.map((c) => (
                <div
                  key={c.rotulo}
                  className="rounded-md border border-border-hairline bg-surface-card p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-micro text-text-tertiary">{c.rotulo}</p>
                      <p className="text-body text-text-primary break-words">
                        {c.valor}
                      </p>
                      {c.nota && (
                        <p className="text-micro text-text-tertiary mt-0.5">
                          {c.nota}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => copiar(c.rotulo, c.valor)}
                      className="shrink-0 text-caption font-semibold text-action-primary-sm underline underline-offset-4"
                    >
                      {copiado === c.rotulo ? "Copiado" : "Copiar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-center">
              <Button variant="ghost" onClick={onCopiarTudo}>
                Copiar tudo de uma vez
              </Button>
            </div>
          </div>

          {/* ── PASSO 3 · o CNPJ de volta ────────────────────────────────── */}
          <Card>
            <p className="text-micro text-text-tertiary">Passo 3</p>
            <p className="text-body font-semibold text-text-primary mt-0.5 mb-1">
              Volta aqui com o CNPJ
            </p>
            <p className="text-caption text-text-secondary">
              O CNPJ sai na hora, ainda na mesma tela. Assim que você tiver o
              número, é só informar aqui que a gente assume o resto: guias,
              notas, declaração e o acompanhamento do seu faturamento.
            </p>
          </Card>

          <p className="text-micro text-text-tertiary">
            Travou em algum passo? Chama a gente no WhatsApp que um atendente te
            acompanha na hora.
          </p>
        </Corpo>

        <Rodape>
          <div className="flex flex-col gap-2">
            <Button full disabled={!nivelGovBrOk} onClick={onAbrirPortal}>
              Abrir o Portal do Empreendedor
            </Button>
            <Button full variant="secondary" onClick={onConfirmarCnpj}>
              Já abri, informar meu CNPJ
            </Button>
          </div>
        </Rodape>
      </main>
    </>
  );
}
