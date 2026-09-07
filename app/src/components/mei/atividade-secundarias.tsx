"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Campo, Texto } from "@/components/ui/form";
import { TelaHeader, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { SheetInfo, BotaoInfo } from "@/components/ui/sheet-info";
import { OCUPACOES, type Ocupacao } from "@/lib/mei";
import { escopoDe } from "@/lib/mei-escopo-cnae";
import { CartaoOcupacao, SheetOcupacao, type OpcaoOcupacao } from "./_cartao-ocupacao";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M7.S · ATIVIDADES SECUNDÁRIAS — a C5 do ME, com a lista do MEI.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09 (pedido do Pedro), corrigida no mesmo dia pela regra que ele deu
 * junto: *"preciso que a gente seja mais fiel nas replicações de layouts"*.
 *
 * ─── A ANATOMIA DA C5, QUE A 1ª VERSÃO NÃO TINHA ────────────────────────────
 * Não é o "assunto" da tela que se copia, é o esqueleto:
 *   · **sem `Titulo` visível.** O `h1` é `sr-only` e a PERGUNTA desce pro
 *     cabeçalho da lista, colada na resposta (decisão de 04/09 no ME: são
 *     ~40px de volta numa tela que é uma lista longa);
 *   · **o cartão da principal e o cabeçalho da lista TRAVAM juntos**, fora da
 *     área rolável. Rolando, a pessoa perdia de vista a referência de tudo o
 *     que está marcando — e perdia o cabeçalho que diz o que a lista é;
 *   · **sem rótulo "Sua atividade principal"**: a pill dentro do cartão já
 *     diz, e os dois colados viravam a mesma frase duas vezes;
 *   · **as secundárias moram DENTRO do cartão da principal**, num rodapé que
 *     cresce pra baixo. Soltas num cartão próprio, as duas informações liam
 *     como assuntos independentes; aqui a hierarquia (uma principal, N
 *     penduradas nela) é dita pela estrutura, sem texto explicando;
 *   · **contagem à direita do cabeçalho**, em coral.
 *
 * ─── AS 3 DIFERENÇAS QUE SÃO DE FUNDO ───────────────────────────────────────
 *   1. **O limite de 15 é OFICIAL aqui**, não régua de produto. O Portal do
 *      Empreendedor aceita 1 principal + até 15 secundárias, na etapa
 *      "Qualificação do Negócio". No ME o teto veio de decisão nossa (reunião
 *      Leonan, 19/08); aqui, de quem manda no formulário.
 *   2. **A busca atravessa as categorias.** As sugestões saem da categoria da
 *      principal, porque é onde estão as ocupações irmãs — mas quem faz duas
 *      coisas de ramos diferentes (fotógrafo que também dá aula) tem que achar
 *      a segunda, e ela mora em outra categoria. É a mesma ressalva que a C5
 *      guarda no rótulo da busca: é lá, e só lá, que dá pra sair do ramo.
 *   3. **Não existe "muda seu enquadramento".** No ME uma secundária pode
 *      jogar a empresa pro Anexo IV, e a C5 troca o CTA por "Falar com
 *      atendente". No MEI não há enquadramento pra mudar: o DAS é fixo, igual
 *      pra toda ocupação. O que pode mudar é OUTRA coisa — ocupação de
 *      comércio, indústria ou transporte intermunicipal gera Inscrição
 *      Estadual automática no SIARE, e é isso que a tela avisa.
 *
 * ⚠️ Reescrita, não importada: `wizard-dossie` está na lista da fronteira.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Limite oficial do Portal: 1 principal + até 15 secundárias. */
export const LIMITE_SECUNDARIAS = 15;

/** Chave estável de uma ocupação: o CNAE sozinho não identifica (duas
 *  ocupações diferentes podem mapear o mesmo código). */
const chave = (o: Ocupacao) => `${o.cnae}|${o.nome}`;

/** Todas as ocupações do recorte, de todas as categorias, sem repetir. */
function todasAsOcupacoes(): Ocupacao[] {
  const vistas = new Set<string>();
  const fora: Ocupacao[] = [];
  for (const lista of Object.values(OCUPACOES)) {
    for (const o of lista) {
      if (!vistas.has(chave(o))) {
        vistas.add(chave(o));
        fora.push(o);
      }
    }
  }
  return fora;
}

function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

const soDigitos = (s: string) => s.replace(/\D/g, "");

export function AtividadeSecundariasMeiView({
  meta,
  principal,
  secundarias,
  setSecundarias,
  categoriaDaPrincipal,
  onSeguir,
  onVoltar,
}: {
  /** Nome de PRA ONDE O VOLTAR LEVA (vem de `mei-flow.metaDoVoltar`). */
  meta: string;
  /** A escolhida na M7, mostrada travada no topo. */
  principal: Ocupacao | null;
  secundarias: Ocupacao[];
  setSecundarias: (v: Ocupacao[]) => void;
  /** Define quais entram nas sugestões curadas. */
  categoriaDaPrincipal: string | null;
  onSeguir?: () => void;
  onVoltar?: () => void;
}) {
  const [busca, setBusca] = useState("");
  const [detalhe, setDetalhe] = useState<OpcaoOcupacao | null>(null);
  const [info, setInfo] = useState(false);

  const todas = useMemo(() => todasAsOcupacoes(), []);
  const escolhidas = new Set(secundarias.map(chave));
  const noLimite = secundarias.length >= LIMITE_SECUNDARIAS;
  const buscando = busca.trim() !== "";

  /* Sem busca: as irmãs da categoria da principal (é o caso comum — quem faz
     duas coisas costuma fazer duas do mesmo ramo). Com busca: o recorte
     inteiro, porque o segundo ofício pode ser de outra categoria. */
  const lista = useMemo(() => {
    const termo = normalizar(busca.trim());
    const base = termo ? todas : (OCUPACOES[categoriaDaPrincipal ?? ""] ?? []);
    return base.filter((o) => {
      if (principal && chave(o) === chave(principal)) return false;
      if (!termo) return true;
      const escopo = escopoDe(o.cnae);
      const alvo = normalizar(
        `${o.nome} ${escopo?.descricao ?? ""} ${(escopo?.cobre ?? []).join(" ")}`,
      );
      /* Busca pelo NÚMERO também, comparando só dígitos dos dois lados: quem
         digita "9511800" (como está nos sistemas do governo) tem que achar o
         mesmo que quem digita "9511-8/00". Achado de 04/09 no ME. */
      const porNumero =
        soDigitos(busca).length >= 2 && soDigitos(o.cnae).startsWith(soDigitos(busca));
      return alvo.includes(termo) || porNumero;
    });
  }, [busca, todas, categoriaDaPrincipal, principal]);

  const alternar = (o: Ocupacao) => {
    if (escolhidas.has(chave(o))) {
      setSecundarias(secundarias.filter((s) => chave(s) !== chave(o)));
    } else if (!noLimite) {
      setSecundarias([...secundarias, o]);
    }
  };

  return (
    <>
      <TelaHeader
        meta={meta}
        onVoltar={onVoltar}
        acao={<BotaoInfo onClick={() => setInfo(true)} rotulo="Pra que serve atividade secundária" />}
      />

      <main className="app-main">
        {/* ⚠️ `sr-only`, não removido: sem `h1` a página fica sem âncora pra
            quem navega por cabeçalho no leitor de tela. A pergunta em si vive
            no cabeçalho da lista, colada na resposta. */}
        <h1 className="sr-only">Você faz mais alguma coisa?</h1>

        {/* 🔒 O BLOCO TRAVADO: cartão da principal + cabeçalho da lista. Só a
            lista rola, por baixo. */}
        <div className="mb-5 shrink-0">
          {principal && (
            <CartaoOcupacao
              ocupacao={{ ...principal, adequacao: 100 }}
              selecionado
              /* Aqui a pill é "Principal", não "compatível": na M7 o rótulo
                 respondia "qual dessas encaixa?", a pergunta daquela tela.
                 Aqui a escolha já foi feita, e o que o cartão informa é o
                 PAPEL dele no meio das secundárias montadas embaixo. Mesma
                 troca que a C5 do ME faz. */
              pill="Principal"
              onVerDetalhes={() => setDetalhe({ ...principal, adequacao: 100 })}
              rodape={
                secundarias.length === 0 ? null : (
                  <div className="mt-3 rounded-md bg-action-primary-sm p-2">
                    <p className="text-caption font-semibold text-text-on-brand">
                      {secundarias.length === 1
                        ? "1 atividade secundária"
                        : `${secundarias.length} atividades secundárias`}
                    </p>
                    <p className="mt-0.5 truncate text-micro text-text-on-brand/80">
                      {secundarias.map((s) => s.nome).join(" · ")}
                    </p>
                  </div>
                )
              }
            />
          )}

          {/* O cabeçalho troca de papel na busca: sem termo ele é a PERGUNTA
              da tela; com termo ele volta a descrever, porque aí a lista é
              resultado de busca, não sugestão nossa. */}
          <div className="mt-5 flex items-baseline justify-between gap-3">
            <p
              className={
                buscando
                  ? "text-micro text-text-tertiary"
                  : "text-caption font-semibold text-text-primary"
              }
            >
              {buscando ? "Resultados da busca" : "Você faz mais alguma coisa?"}
            </p>
            <p className="shrink-0 text-micro font-semibold text-action-primary-sm">
              {secundarias.length} de {LIMITE_SECUNDARIAS}
            </p>
          </div>
        </div>

        <Corpo>
          {/* ⚠️ O aviso da Inscrição Estadual aparece DEPOIS de escolher, e só
              quando já há alguma marcada. Antes disso seria abstrato — mesma
              regra do limite interno na M7. */}
          {secundarias.length > 0 && (
            <Aviso neutro variante="warning" titulo="Uma escolhida pode virar obrigação nova">
              Ocupação de comércio, indústria ou transporte entre cidades gera
              Inscrição Estadual automática no SIARE, junto com o registro. Não
              custa nada e a gente cuida, mas você vai ver esse número aparecer.
            </Aviso>
          )}

          {noLimite && (
            <p className="text-micro text-text-secondary">
              Você chegou ao limite oficial de {LIMITE_SECUNDARIAS} secundárias.
              Pra trocar alguma, é só desmarcar.
            </p>
          )}

          <div className="flex flex-col gap-2">
            {lista.length === 0 ? (
              <p className="text-caption text-text-secondary">
                Nada com esse termo na lista oficial. Tenta outra palavra, ou
                segue sem: dá pra incluir depois, de graça, no Portal.
              </p>
            ) : (
              lista.map((o) => {
                const marcada = escolhidas.has(chave(o));
                return (
                  <CartaoOcupacao
                    key={chave(o)}
                    ocupacao={{ ...o, adequacao: 0 }}
                    selecionado={marcada}
                    /* Marcada vira "Secundária" (o papel dela); as demais
                       levam "compatível", a mesma palavra do ME — a pill
                       responde à pergunta da tela, não classifica o item. */
                    pill={marcada ? "Secundária" : "compatível"}
                    onClick={!marcada && noLimite ? undefined : () => alternar(o)}
                    onVerDetalhes={() => setDetalhe({ ...o, adequacao: 0 })}
                  />
                );
              })
            )}
          </div>
        </Corpo>

        <Rodape>
          {/* 🔄 07/09 (auditoria de anatomia) — A BUSCA FICA FIXA ACIMA DO CTA,
              não no topo do corpo. Foi decisão do Pedro na C5 em 02/09, pelo
              motivo oposto ao que eu tinha assumido: no corpo, quem não se
              encontra nas sugestões precisa ROLAR ATÉ O FIM pra descobrir que
              existe busca. Fixa, ela é uma saída sempre à mão — e os
              RESULTADOS aparecem lá em cima, no corpo, que é onde a lista mora.
              ✍️ O rótulo e o placeholder ensinam as 2 saídas: buscar fora do
              ramo da principal, e buscar pelo número do código. Sem dizer,
              ninguém descobre nenhuma das duas. */}
          <div className="mb-4">
            <Campo rotulo="Buscar por atividade ou código">
              <Texto
                valor={busca}
                onChange={setBusca}
                placeholder="Ex: fotografia, aulas ou 9511-8/00"
              />
            </Campo>
          </div>
          {/* Nunca trava: a tela é opcional, e o botão diz isso em vez de
              ficar neutro. */}
          <Button full onClick={onSeguir}>
            {secundarias.length === 0
              ? "Continuar sem secundárias"
              : `Continuar com ${secundarias.length} secundária${secundarias.length > 1 ? "s" : ""}`}
          </Button>
        </Rodape>
      </main>

      {detalhe && (
        <SheetOcupacao
          ocupacao={detalhe}
          selecionado={escolhidas.has(chave(detalhe))}
          onEscolher={
            principal && chave(detalhe) === chave(principal)
              ? undefined
              : () => alternar(detalhe)
          }
          onFechar={() => setDetalhe(null)}
        />
      )}

      {info && (
        <SheetInfo
          titulo="Pra que serve atividade secundária"
          pontos={[
            `O Portal aceita até ${LIMITE_SECUNDARIAS} secundárias, além da principal. É limite do governo, não nosso.`,
            "Não muda o que você paga: o MEI recolhe um DAS fixo por mês, independente de quantas ocupações tiver.",
            "Não precisa ser do mesmo ramo da principal. Use a busca pra achar em qualquer área.",
            "Incluir agora é melhor que incluir depois, mas alterar é gratuito e leva minutos no Portal.",
            "Cada secundária carrega o mesmo limite interno da principal: vale a ocupação nomeada, não o CNAE inteiro.",
          ]}
          destaque={{
            titulo: "Só coloque o que você faz de verdade",
            texto:
              "Ocupação a mais não é reserva pro futuro: ela entra no seu registro e pode puxar obrigação (como a Inscrição Estadual, no caso de comércio e transporte). Quando começar a fazer, você inclui na hora, de graça.",
          }}
          onFechar={() => setInfo(false)}
        />
      )}
    </>
  );
}
