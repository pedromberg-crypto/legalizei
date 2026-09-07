"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { StatusIcon } from "@/components/ui/status";
import { CUSTOS } from "@/lib/fiscal";
import { reais } from "./_formato";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M5 · SEU PLANO — a conta honesta do MEI.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09. Substitui o uso que o MEI fazia da `PlanoView` do ME.
 *
 * ─── A DIFERENÇA QUE OBRIGA A TELA A SER OUTRA ──────────────────────────────
 * A tela do ME se chama "a conta da abertura" e o número grande dela é a soma
 * do que a pessoa vai desembolsar pra abrir: mensalidade + taxa da Junta
 * (R$281,08, repasse ao Estado). **No MEI não existe nenhum dos dois lados
 * dessa conta**: a abertura é gratuita em todas as instâncias, e o honorário
 * de abertura já é zero por decisão nossa desde 14/07.
 *
 * Então a pergunta que esta tela responde é outra: *se abrir é grátis e eu
 * mesmo clico, o que eu estou pagando?* Fugir dela seria o pior caminho
 * possível — a pessoa faria a pergunta sozinha, no pagamento.
 *
 * A resposta, e ela é a tese do produto (`cruzamento-flow-mei-vs-me.md`):
 * **não errar agora, e o ano seguinte**. O difícil do MEI nunca foi preencher
 * o formulário; é saber qual ocupação (com o limite da Cosit 27/2021), se você
 * pode, o que declarar, e depois manter em dia.
 *
 * ─── 🔴 O CERTIFICADO NÃO VEM INCLUSO, E ISSO SE DIZ AQUI ───────────────────
 * Decisão do Pedro (28/08): o plano MEI não inclui certificado digital. A
 * pessoa já ouviu isso no fork (E3.2) e ouve de novo aqui, com o valor. Não é
 * repetição à toa — é a regra de honestidade-antes-do-toque: quem descobre um
 * custo no meio do caminho não confia mais no resto dos números.
 *
 * 🔴 PENDÊNCIA DE NEGÓCIO, ANOTADA E NÃO INVENTADA: tirando o certificado do
 * plano, a fidelidade de 12 meses ficou **sem contrapartida escrita** (o ADR
 * de 04/08 dizia, com todas as letras, que a fidelidade era a contrapartida de
 * pagar o certificado). O número segue valendo porque não foi revogado, e a
 * copy usa a formulação genérica de sempre — não inventei justificativa nova.
 * Precisa de decisão Pedro/Mauro antes de virar cláusula. Ver
 * `execucao/flow/rastreio-mei.md` §"A consequência que ficou aberta".
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * O que o plano MEI entrega. Escopo LIMITADO de propósito (nota do
 * `CUSTOS.MENSALIDADE_MEI`): não é o plano ME completo com preço menor, é
 * escopo menor mesmo — e o teto legal do MEI é 1 colaborador.
 */
const INCLUSO_MEI = [
  "Escolha da ocupação certa, com o que ela cobre e o que não cobre",
  "Emissão das suas notas fiscais de serviço",
  "A DASN-SIMEI todo ano, feita e entregue por nós",
  "Suas guias mensais (DAS) na mão, sem você caçar no site do governo",
  "Monitor do teto: a gente avisa antes de você estourar, não depois",
  "1 colaborador registrado, que é o limite legal do MEI",
];

export function PlanoMeiView({
  meta,
  onSeguir,
  onVoltar,
}: {
  /** Nome de PRA ONDE O VOLTAR LEVA (vem de `mei-flow.metaDoVoltar`). */
  meta: string;
  onSeguir?: () => void;
  onVoltar?: () => void;
}) {
  return (
    <>
      <TelaHeader meta={meta} onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo sub="Abrir o MEI é de graça, e continua sendo. O que você paga aqui é o que vem depois.">
          Seu plano
        </Titulo>

        <Corpo>
          {/* ── O NÚMERO ──────────────────────────────────────────────────
              Um valor só, sem soma. No ME o card soma taxa de governo; aqui
              somar seria inventar uma linha que não existe. */}
          <Card tom="marca">
            <p className="text-micro text-text-tertiary">Plano MEI</p>
            <p className="text-h1 text-text-primary mt-1">
              {reais(CUSTOS.MENSALIDADE_MEI)}
              <span className="text-body text-text-secondary"> por mês</span>
            </p>
            <p className="text-caption text-text-secondary mt-2">
              A abertura em si custa {reais(0)}: o registro do MEI é gratuito em
              todas as instâncias, e a gente não cobra honorário pra te
              acompanhar nela.
            </p>
          </Card>

          {/* ── O QUE VOCÊ ESTÁ COMPRANDO ─────────────────────────────────
              Ordem proposital: a ocupação vem primeiro porque é o que resolve
              o erro caro, não porque é o mais bonito de listar. */}
          <div>
            <p className="text-caption font-semibold text-text-primary mb-2">
              O que entra
            </p>
            <div className="flex flex-col gap-2.5">
              {INCLUSO_MEI.map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <span className="mt-0.5 shrink-0">
                    <StatusIcon estado="feito" />
                  </span>
                  <p className="text-caption text-text-secondary">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── 🔴 O QUE NÃO ENTRA ────────────────────────────────────────
              Bloco PRÓPRIO, não um item riscado no meio da lista de inclusos.
              Custo que a pessoa vai ter merece o mesmo peso visual do que ela
              está ganhando. */}
          <Aviso variante="info" titulo="O certificado digital não vem no plano">
            Ele custa cerca de {reais(CUSTOS.CERTIFICADO_PRECO)} por ano, pago
            direto na certificadora. Não é obrigatório pra abrir o MEI, e a
            gente só recomenda depois que o CNPJ existir. Ele serve pro dia a
            dia: com ele, a gente puxa suas guias e resolve o que precisa sem
            pedir sua senha toda vez.
          </Aviso>

          <p className="text-micro text-text-tertiary">
            Período mínimo de permanência de {CUSTOS.FIDELIDADE_MESES} meses,
            contado a partir da emissão do seu CNPJ. Cancelando antes, a multa é
            de {Math.round(CUSTOS.MULTA_CANCELAMENTO_PCT * 100)}% sobre as
            mensalidades que faltam, nunca sobre o que você já pagou.
          </p>
        </Corpo>

        <Rodape>
          <Button full onClick={onSeguir}>
            Continuar
          </Button>
        </Rodape>
      </main>
    </>
  );
}
