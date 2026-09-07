"use client";

import { useEffect, useState, type ReactNode } from "react";
import { escopoDe } from "@/lib/mei-escopo-cnae";
import type { Ocupacao } from "@/lib/mei";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * O CARTÃO DE OCUPAÇÃO E O SHEET DE DETALHES — as peças do bloco ATIVIDADE.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09 (pedido do Pedro: usar o sistema de escolha de atividade do ME no
 * MEI, com os filtros e a lista dele).
 *
 * ⚠️ Reescrito, não importado: `encaixe` está na lista de telas de ME da trava
 * de fronteira. Herda-se o DESENHO e os tokens, nunca o arquivo.
 *
 * ─── A DIFERENÇA QUE NÃO É COSMÉTICA ────────────────────────────────────────
 * O cartão do ME carrega uma **etiqueta fiscal** (Anexo III/IV/V, Fator R).
 * Aqui ela não existe e a ausência é fato, não esquecimento: o MEI paga DAS
 * FIXO, não tem anexo nem Fator R. Pôr a etiqueta aqui seria inventar uma
 * variável que não existe no regime.
 *
 * No lugar dela vai o que de fato varia entre uma ocupação e outra do MEI: o
 * **limite interno**.
 *
 * ─── 🔴 O LIMITE INTERNO É A REGRA DESTE ARQUIVO ────────────────────────────
 * Solução de Consulta Cosit nº 27/2021: o MEI só pode exercer a faceta
 * NOMEADA na ocupação (Anexo XI), não todo o escopo do CNAE que ela mapeia.
 *
 * Decisão do Pedro (07/09): o sheet MOSTRA o escopo real do CNAE, porque
 * esconder empobrece a tela sem proteger ninguém — **mas rotulado como sendo
 * do CNAE, com a ressalva grudada logo abaixo.** As duas coisas andam juntas
 * ou nenhuma vai: uma lista de atividades sem o rótulo vira uma promessa que
 * a Receita não honra, e é o erro que a tela existe pra evitar.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Uma ocupação com o quanto ela casa com o que a pessoa descreveu. */
export interface OpcaoOcupacao extends Ocupacao {
  /** 0–100. Só ordena a lista; não aparece na tela (mesma decisão de 02/09
   *  que tirou o percentual dos cartões do ME). */
  adequacao: number;
}

/* ═════════════════════════ O CARTÃO ══════════════════════════════════════ */

/**
 * 🔄 07/09 (2ª revisão, achado do Pedro comparando lado a lado) — O CARTÃO
 * ESTAVA OUTRO. Ele foi escrito "parecido" com o do ME e saiu diferente em 4
 * pontos que juntos mudam a leitura da tela:
 *
 *   1. **a pill ficava à esquerda, na linha do código.** No ME ela é a coluna
 *      da DIREITA (`justify-between`), separada do texto;
 *   2. **"Ver detalhes" morava numa linha própria**, custando altura. No ME
 *      ele entra na linha do código, depois de um " · " — a linha já existe e
 *      sobra vazia à direita;
 *   3. **a pill era cinza e dizia "ocupação do Anexo XI"**. O Pedro cortou com
 *      todas as letras: *"a pessoa nem sabe o que é isso e nem precisa
 *      saber"*. A pill responde a pergunta da TELA ("qual dessas encaixa?"),
 *      e a resposta é **compatível** — a mesma palavra do ME, no mesmo verde;
 *   4. **`rounded-2xl`** (16px, raio de card de conteúdo) num cartão que vive
 *      no meio de formulário. O ME corrigiu isso em 02/09 pra `rounded-md`
 *      (12px) porque, empilhados na mesma tela, os 4px apareciam.
 *
 * ⚠️ E o card NÃO é um `<button>`: com o "Ver detalhes" dentro dele existem
 * dois alvos com ações diferentes, e botão dentro de botão é HTML inválido (o
 * navegador desmonta a árvore e um dos dois para de responder). Padrão
 * "stretched button": o alvo de seleção é um botão absoluto cobrindo o card, e
 * o conteúdo passa por cima com os cliques desligados — menos o link, que os
 * religa.
 */
export function CartaoOcupacao({
  ocupacao,
  selecionado = false,
  pill = "compatível",
  rodape,
  onClick,
  onVerDetalhes,
}: {
  ocupacao: OpcaoOcupacao;
  selecionado?: boolean;
  /**
   * O rótulo da pill. Default "compatível", igual ao ME: ela responde à
   * pergunta da tela, não classifica o item.
   *
   * 🚫 Nunca jargão de órgão. A 1ª versão dizia "ocupação do Anexo XI", e o
   * Pedro cortou: a pessoa não sabe o que é o Anexo XI e não precisa saber
   * pra escolher. O fato continua vivo onde ele é útil — no sheet, junto do
   * limite interno, na hora em que muda o que ela pode fazer.
   *
   * 🚫 Nunca anexo do Simples nem Fator R: MEI é DAS fixo, e inventar essa
   * variável aqui seria dizer que existe uma decisão fiscal que não existe.
   *
   * Na M7.S ela vira "Principal": ali a escolha já foi feita, e o que o cartão
   * informa é o PAPEL dele no meio das secundárias montadas embaixo.
   */
  pill?: string;
  /**
   * Conteúdo pendurado DENTRO do cartão, abaixo dele. Existe pro mesmo motivo
   * que na C5 do ME: as secundárias moram dentro do cartão da principal, e a
   * hierarquia (uma principal, N penduradas nela) fica dita pela estrutura em
   * vez de por um texto explicando.
   *
   * ⚠️ Só em lista de UM cartão. Numa lista de escolha, um rodapé por item
   * competiria com o toque de escolher.
   */
  rodape?: ReactNode;
  onClick?: () => void;
  onVerDetalhes?: () => void;
}) {
  const on = selecionado;

  const conteudo = (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p
          className={`text-caption font-semibold ${
            on ? "text-text-on-brand" : "text-text-primary"
          }`}
        >
          {ocupacao.nome}
        </p>
        <p className={`text-micro mt-0.5 ${on ? "text-text-on-brand" : "text-text-tertiary"}`}>
          CNAE {ocupacao.cnae}
          {onVerDetalhes && (
            <>
              {" · "}
              <button
                type="button"
                onClick={(e) => {
                  // O card inteiro seleciona; este alvo vive dentro dele e faz
                  // outra coisa.
                  e.stopPropagation();
                  onVerDetalhes();
                }}
                /* `-my-2.5 py-2.5` leva o alvo a 40px sem mudar uma linha do
                   que se vê. */
                className="pointer-events-auto relative -my-2.5 py-2.5 underline underline-offset-2"
              >
                Ver detalhes
              </button>
            </>
          )}
        </p>
      </div>
      {pill && (
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-micro font-semibold ${
            on
              ? "bg-action-primary-sm text-text-on-brand"
              : "bg-state-success-tint text-state-success-text"
          }`}
        >
          {pill}
        </span>
      )}
    </div>
  );

  /* Escolhido = card inteiro coral, tipografia branca, pill em coral-700.
     Borda + tint deixava a diferença fina demais numa tela em que a escolha
     precisa ser óbvia. Branco sobre coral-700 = 6,4:1, passa AA. */
  const estilo = `rounded-md border p-3 text-left transition-colors ${
    on
      ? "border-action-primary bg-action-primary"
      : "border-border-hairline bg-surface-card hover:border-border-strong"
  }`;

  const miolo = (
    <>
      {conteudo}
      {rodape}
    </>
  );

  return onClick ? (
    <div className={`relative ${estilo}`}>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={on}
        aria-label={`Usar a atividade ${ocupacao.nome}, CNAE ${ocupacao.cnae}`}
        className="absolute inset-0 rounded-md"
      />
      <div className="pointer-events-none relative">{miolo}</div>
    </div>
  ) : (
    <div className={estilo}>{miolo}</div>
  );
}

/* ═════════════════════════ O SHEET ═══════════════════════════════════════ */

export function SheetOcupacao({
  ocupacao,
  selecionado = false,
  onEscolher,
  onFechar,
}: {
  ocupacao: OpcaoOcupacao;
  selecionado?: boolean;
  /** Ausente = sheet só de leitura (é o caso quando ela já está escolhida). */
  onEscolher?: () => void;
  onFechar: () => void;
}) {
  /* Entrada e saída animadas, mesma mecânica do `SheetInfo` do DS: o estado
     entra num frame seguinte pra o browser ter o que transicionar. */
  const [entrou, setEntrou] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntrou(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const sair = () => {
    setEntrou(false);
    window.setTimeout(onFechar, 240);
  };

  const escopo = escopoDe(ocupacao.cnae);

  return (
    /* ⚠️ Renderizar SEMPRE como irmão do corpo da tela, nunca dentro do
       `Corpo`: o container rolável tem clip e o sheet apareceria cortado
       (bug real da C3 em 03/09). */
    <div className="absolute inset-0 z-[60]">
      <button
        type="button"
        aria-label="Fechar"
        onClick={sair}
        className={`absolute inset-0 bg-surface-dark/40 transition-opacity duration-200 ${
          entrou ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute inset-x-0 bottom-0 max-h-[82%] overflow-y-auto rounded-t-3xl
                    bg-surface-card px-6 pb-6 pt-5 shadow-2xl transition-transform duration-200 ${
                      entrou ? "translate-y-0" : "translate-y-full"
                    }`}
      >
        <div aria-hidden className="mx-auto mb-4 h-1 w-10 rounded-full bg-border-strong" />

        <p className="text-h2 font-bold text-text-primary">{ocupacao.nome}</p>
        <p className="mt-1 text-caption text-text-tertiary">
          CNAE {ocupacao.cnae}
          {escopo ? ` · ${escopo.descricao}` : ""}
        </p>

        {/* ═══ O LIMITE INTERNO, ANTES DA LISTA ═════════════════════════════
            A ordem importa e não é estética: quem lê a lista primeiro conclui
            que pode fazer tudo aquilo, e a ressalva depois chega tarde. */}
        <div className="mt-4 rounded-2xl border border-state-warning/40 bg-state-warning/8 p-4">
          <p className="text-caption font-semibold text-text-primary">
            O que você pode fazer como MEI
          </p>
          <p className="mt-1 text-caption text-text-secondary">
            Só a atividade nomeada acima: <strong>{ocupacao.nome}</strong>. O
            código CNAE abaixo é mais amplo que isso, e o MEI não acompanha ele
            inteiro (Solução de Consulta Cosit nº 27/2021). Quem se registra
            como reparador de bicicleta, por exemplo, não pode consertar moto,
            mesmo os dois caindo no mesmo código.
          </p>
        </div>

        {escopo && escopo.cobre.length > 0 && (
          <div className="mt-4">
            {/* 🔴 O RÓTULO É OBRIGATÓRIO. Ele diz de quem é este escopo, e sem
                ele a lista vira uma promessa que a Receita não honra. */}
            <p className="text-caption font-semibold text-text-primary">
              O que o CNAE {ocupacao.cnae} cobre
            </p>
            <p className="mt-0.5 text-micro text-text-tertiary">
              Isto é o escopo do código no IBGE, não a sua permissão como MEI.
              Serve pra você reconhecer se é este mesmo o seu ramo.
            </p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {escopo.cobre.map((item) => (
                <li key={item} className="flex gap-2 text-caption text-text-secondary">
                  <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-border-strong" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2">
          {onEscolher && !selecionado && (
            <button
              type="button"
              onClick={() => {
                onEscolher();
                sair();
              }}
              className="flex min-h-12 w-full items-center justify-center rounded-md
                         bg-action-primary px-4 text-body font-semibold text-text-on-dark"
            >
              É essa a minha atividade
            </button>
          )}
          <button
            type="button"
            onClick={sair}
            className="flex min-h-12 w-full items-center justify-center rounded-md border
                       border-border-strong bg-surface-card px-4 text-body font-semibold
                       text-text-primary"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
