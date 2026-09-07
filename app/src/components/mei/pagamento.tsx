"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Campo, Texto, Checkbox } from "@/components/ui/form";
import { TelaHeader, Titulo, Corpo, Rodape } from "@/components/ui/tela";
import { CUSTOS } from "@/lib/fiscal";
import { LinhaEscolha } from "./_linha-escolha";
import { mascaraCpf, reais } from "./_formato";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M6 · PAGAMENTO + CONTRATO — e as cláusulas que o MEI perdeu no caminho.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09.
 *
 * ─── A DÍVIDA QUE ESTA TELA PAGA ────────────────────────────────────────────
 * Em 30/08 o E8 (`ContratoView`) foi eliminado do caminho ME: o aceite desceu
 * pro pagamento, igual à Contabilizei. A mudança estava certa pro ME — mas o
 * MEI tinha uma tela E8 PRÓPRIA, com cláusulas próprias, e ela morreu junto.
 * O que sobrou pro MEI no `/pagamento` compartilhado foi uma prop de preço
 * (`semTaxaJunta`) e o checkbox genérico; as 2 cláusulas que só existiam no
 * contrato dele **sumiram sem ninguém notar** (achado do levantamento de
 * 07/09).
 *
 * Elas voltam aqui, e são estas:
 *
 *   1. **O QUE É E O QUE NÃO É NOSSO.** É a cláusula mais importante do
 *      contrato de MEI, porque descreve uma limitação LEGAL, não uma escolha
 *      comercial: não existe API nem procuração que permita registrar MEI por
 *      terceiro, e a senha gov.br é pessoal e intransferível por Termo de Uso.
 *      Um contrato que prometesse "abrimos pra você" seria promessa que a
 *      gente não pode cumprir.
 *
 *   2. **O CERTIFICADO FICA POR SUA CONTA** (decisão do Pedro, 28/08). No ME
 *      ele vem incluso; aqui não. Já foi dito no fork e no plano; no contrato
 *      ele precisa estar escrito, não subentendido.
 *
 * ⚠️ NÃO EXISTE taxa de governo nesta tela, e a ausência é a regra: a abertura
 * do MEI é gratuita em todas as instâncias. A cláusula de não-reembolso da
 * taxa, que o ME tem, não existe aqui porque não há taxa pra não reembolsar.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const METODOS = [
  { id: "cartao", label: "Cartão de crédito", nota: "Aprova na hora" },
  { id: "pix", label: "Pix", nota: "Cai em segundos" },
  { id: "boleto", label: "Boleto", nota: "Compensa em até 3 dias úteis" },
] as const;

export type MetodoMei = (typeof METODOS)[number]["id"];

/** As cláusulas que a pessoa precisa ter lido antes de aceitar. */
const CLAUSULAS_MEI = [
  {
    titulo: "O que a gente faz, e o que só você pode fazer",
    texto:
      "A gente confere seus dados, escolhe com você a ocupação certa e entrega cada campo pronto, na ordem do formulário oficial. O clique final no Portal do Empreendedor é seu, obrigatoriamente: o governo não permite que ninguém registre um MEI no lugar de outra pessoa, e sua conta gov.br é pessoal e intransferível.",
  },
  {
    titulo: "O certificado digital fica por sua conta",
    texto:
      "Ele não é necessário pra abrir o MEI e não está incluso no plano. Se você quiser um depois, a gente indica a certificadora parceira e te passa o valor. Com ele, a gente resolve suas guias e obrigações sem precisar da sua senha a cada vez.",
  },
  {
    titulo: "Abrir o MEI não custa nada, em instância nenhuma",
    texto:
      "O registro é gratuito por lei. A gente não cobra honorário de abertura, e não existe taxa de governo pra repassar. O que você paga é a mensalidade do plano, que começa a valer quando seu CNPJ sai.",
  },
  {
    titulo: "Permanência e cancelamento",
    texto: `Período mínimo de ${CUSTOS.FIDELIDADE_MESES} meses, contado da emissão do CNPJ. Cancelando antes, a multa é de ${Math.round(CUSTOS.MULTA_CANCELAMENTO_PCT * 100)}% sobre as mensalidades que ainda faltam, nunca sobre o que já foi pago.`,
  },
];

export function PagamentoMeiView({
  meta,
  metodo,
  setMetodo,
  cpf,
  setCpf,
  aceito,
  setAceito,
  contratoAberto,
  setContratoAberto,
  onPagar,
  onVoltar,
}: {
  /** Nome de PRA ONDE O VOLTAR LEVA (vem de `mei-flow.metaDoVoltar`). */
  meta: string;
  metodo: MetodoMei | null;
  setMetodo: (v: MetodoMei) => void;
  cpf: string;
  setCpf: (v: string) => void;
  aceito: boolean;
  setAceito: (v: boolean) => void;
  /** O contrato aberto na própria tela, não num PDF que ninguém abre. */
  contratoAberto: boolean;
  setContratoAberto: (v: boolean) => void;
  onPagar?: () => void;
  onVoltar?: () => void;
}) {
  const completo =
    metodo !== null && aceito && cpf.replace(/\D/g, "").length === 11;

  return (
    <>
      <TelaHeader meta={meta} onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo sub={`${reais(CUSTOS.MENSALIDADE_MEI)} por mês. A primeira cobrança sai hoje.`}>
          Como você prefere pagar?
        </Titulo>

        <Corpo>
          <div className="flex flex-col gap-2">
            {METODOS.map((m) => (
              <LinhaEscolha
                key={m.id}
                titulo={m.label}
                nota={m.nota}
                selecionada={metodo === m.id}
                onClick={() => setMetodo(m.id)}
              />
            ))}
          </div>

          {metodo && (
            <Campo
              rotulo="CPF do pagador"
              dica="Pode ser diferente do seu, se quem paga é outra pessoa."
            >
              <Texto
                valor={cpf}
                onChange={(v) => setCpf(mascaraCpf(v))}
                placeholder="000.000.000-00"
                inputMode="numeric"
                maxLength={14}
              />
            </Campo>
          )}

          {/* ── O CONTRATO, NA PRÓPRIA TELA ───────────────────────────────
              Aberto aqui e não num link: as 2 cláusulas que importam no MEI
              descrevem uma limitação legal, e limitação escondida atrás de um
              "leia o contrato completo" é limitação que ninguém leu. */}
          <Card>
            <button
              type="button"
              onClick={() => setContratoAberto(!contratoAberto)}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <span className="text-body font-semibold text-text-primary">
                O que diz o contrato
              </span>
              <span className="shrink-0 text-caption font-semibold text-action-primary-sm underline underline-offset-4">
                {contratoAberto ? "Fechar" : "Ler"}
              </span>
            </button>

            {contratoAberto && (
              <div className="mt-4 flex flex-col gap-4">
                {CLAUSULAS_MEI.map((c) => (
                  <div key={c.titulo}>
                    <p className="text-caption font-semibold text-text-primary mb-0.5">
                      {c.titulo}
                    </p>
                    <p className="text-caption text-text-secondary">{c.texto}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Checkbox checked={aceito} onChange={setAceito}>
            Li e aceito o contrato, e entendi que o registro no Portal do
            Empreendedor é feito por mim
          </Checkbox>
        </Corpo>

        <Rodape>
          <Button full disabled={!completo} onClick={onPagar}>
            {metodo === "boleto" ? "Gerar boleto" : `Pagar ${reais(CUSTOS.MENSALIDADE_MEI)}`}
          </Button>
        </Rodape>
      </main>
    </>
  );
}
