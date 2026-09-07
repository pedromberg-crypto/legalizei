"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Campo, Select } from "@/components/ui/form";
import { TelaHeader, Rolagem } from "@/components/ui/tela";
import { SheetInfo, BotaoInfo } from "@/components/ui/sheet-info";
import { OCUPACOES, CATEGORIAS_MEI, categoriaTemMei, type Ocupacao } from "@/lib/mei";
import { escopoDe } from "@/lib/mei-escopo-cnae";
import { CartaoOcupacao, SheetOcupacao, type OpcaoOcupacao } from "./_cartao-ocupacao";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M7.0 / M7 · SUA ATIVIDADE — o sistema da C0 do ME, com a lista do MEI.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09 (pedido do Pedro): *"usar o mesmo sistema de escolha de atividade
 * principal e secundária, telas similares, apenas com os filtros do MEI"*.
 *
 * 🔄 07/09, 2ª rodada, e a correção vale como regra: *"preciso que a gente
 * seja mais fiel nas replicações de layouts"*. A 1ª versão herdou o GESTO da
 * C0 mas remontou o esqueleto com `Rolagem` + `Rodape`, e chegou comprimida —
 * hero menor, campo espremido, espaçamento que não batia lado a lado. O que
 * se replica é a ANATOMIA, não a descrição dela:
 *
 *   · uma coluna `flex-1 min-h-0` com um bloco interno `flex-1 gap-4` (é ele
 *     que dá a sobra pro hero se centralizar na chegada);
 *   · o CTA no `app-footer-cta`, não no `Rodape`;
 *   · `Campo` do DS no dropdown, rótulo `<p>` à mão no textarea (com
 *     `aria-labelledby`, senão ele fica sem nome acessível);
 *   · textarea `rows={2}`, `rounded-md`, `border-hairline`, com o X de limpar;
 *   · a linha de dica com piso de 1,25rem SÓ na chegada (com resultados a
 *     frase nunca aparece, e o espaço vira buraco);
 *   · slot fora da área rolável, só a lista rola, e os campos ficam no pé.
 *
 * ─── O QUE VEIO DA C0, INTEIRO ──────────────────────────────────────────────
 * O gesto que o Pedro aprovou em 02/09 depois de 3 rodadas: a categoria chega
 * escolhida dentro de um `Select` fechado; o campo CRESCE com o texto em vez
 * de rolar por dentro; a busca CONGELA o resultado (mexeu depois, o CTA vira
 * "Buscar de novo"); um SLOT tracejado onde a escolha encosta; cartões
 * clicáveis com "ver detalhes"; e escolher ROLA DE VOLTA pro slot.
 *
 * ─── O QUE MUDOU, E POR QUÊ NÃO DAVA PRA SER SÓ UM FILTRO ───────────────────
 *   1. **Não existe IA cruzando.** No ME o `mapear()` roda sobre 1332 CNAEs e
 *      devolve palpite. Aqui o universo é uma lista FECHADA de 66 ocupações do
 *      Anexo XI (Res. CGSN 140/2018), das quais a categoria já recorta um
 *      punhado. Buscar aqui é casar texto com nome de ocupação, não adivinhar
 *      código — e o resultado é mais confiável justamente por isso.
 *   2. **Descrever não é obrigatório** (decisão de 02/09 do ME): sem texto, a
 *      pessoa recebe as ocupações da categoria dela. A descrição REORDENA, não
 *      filtra — quem escreve "conserto bike" vê reparação de bicicletas em
 *      primeiro, mas continua vendo o resto. Filtrar esconderia a ocupação
 *      certa de quem descreveu com outra palavra.
 *   3. **Não existe "já sei o número do meu CNAE".** Ver o comentário no lugar
 *      onde o link mora no ME.
 *   4. **Sem etiqueta fiscal** nos cartões: MEI é DAS fixo, não tem anexo nem
 *      Fator R. Ver `_cartao-ocupacao.tsx`.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/* ═══════════════════════ A BUSCA ═════════════════════════════════════════ */

/** Tira acento e caixa, pra "salao" achar "salão". */
function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/**
 * Ordena as ocupações da categoria pelo quanto casam com a descrição.
 *
 * ⚠️ ORDENA, não filtra — ver o ponto 2 do cabeçalho. Uma ocupação com zero
 * palavras em comum continua na lista, no fim.
 *
 * O score olha 3 campos, e o peso segue o quanto cada um é confiável: o nome
 * da ocupação é o texto oficial que a pessoa vai ver no Portal, então casar
 * com ele vale mais; a descrição do CNAE vem depois; o escopo (`cobre`) é o
 * mais amplo e por isso o mais fraco, mas é ele que acha quem descreveu a
 * atividade com a palavra do dia a dia em vez do nome burocrático.
 */
export function buscarOcupacoes(categoria: string | null, texto: string): OpcaoOcupacao[] {
  const lista: Ocupacao[] = categoria ? (OCUPACOES[categoria] ?? []) : [];
  const termos = normalizar(texto)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3);

  const comScore = lista.map((o) => {
    if (termos.length === 0) return { ...o, adequacao: 0 };
    const escopo = escopoDe(o.cnae);
    const nome = normalizar(o.nome);
    const desc = normalizar(escopo?.descricao ?? "");
    const cobre = normalizar((escopo?.cobre ?? []).join(" "));
    let pontos = 0;
    for (const t of termos) {
      if (nome.includes(t)) pontos += 5;
      else if (desc.includes(t)) pontos += 3;
      else if (cobre.includes(t)) pontos += 1;
    }
    /* Normaliza pelo número de termos pra uma descrição longa não inflar o
       score de todo mundo por igual. */
    return { ...o, adequacao: Math.min(100, Math.round((pontos / (termos.length * 5)) * 100)) };
  });

  /* Empate mantém a ordem da fonte (o Anexo XI já vem em ordem de código), e
     `sort` é estável — então não há aleatoriedade entre duas de mesmo score. */
  return comScore.sort((a, b) => b.adequacao - a.adequacao);
}

/* ═══════════════════════ A TELA ══════════════════════════════════════════ */

export function AtividadeMeiView({
  meta,
  categoria,
  setCategoria,
  texto,
  setTexto,
  principal,
  setPrincipal,
  semResultados = false,
  onBuscar,
  onSeguir,
  onVoltar,
}: {
  /** Nome de PRA ONDE O VOLTAR LEVA (vem de `mei-flow.metaDoVoltar`). */
  meta: string;
  categoria: string | null;
  setCategoria: (v: string | null) => void;
  texto: string;
  setTexto: (v: string) => void;
  /** A ocupação escolhida. Guarda CNAE + nome porque o código sozinho não
   *  identifica: duas ocupações podem mapear o mesmo. */
  principal: Ocupacao | null;
  setPrincipal: (v: Ocupacao | null) => void;
  /** `true` = M7.0, a chegada: sem slot, sem cartões. */
  semResultados?: boolean;
  /** Sai da chegada (M7.0) pra tela com resultados (M7). */
  onBuscar?: () => void;
  onSeguir?: () => void;
  onVoltar?: () => void;
}) {
  const [detalhe, setDetalhe] = useState<OpcaoOcupacao | null>(null);
  const [info, setInfo] = useState(false);

  /* 🔒 A BUSCA CONGELA (regra de 02/09 do ME). A lista na tela é a da última
     busca; mexer na descrição ou na categoria depois disso deixa o resultado
     velho, e o CTA passa a oferecer buscar de novo em vez de continuar.
     Nasce com o estado do primeiro render: o que está na tela ao chegar É o
     resultado corrente (o bug de 02/09 foi nascer `null`, e aí nada nunca
     ficava desatualizado pra quem entrava direto na tela). */
  const [busca, setBusca] = useState<{ texto: string; categoria: string | null }>(() => ({
    texto,
    categoria,
  }));
  const desatualizado = texto !== busca.texto || categoria !== busca.categoria;
  const opcoes = buscarOcupacoes(busca.categoria, busca.texto);

  /* Só as categorias que TÊM ocupação de MEI. As 3 sem (tech, design,
     consult) já foram barradas lá no fork; repetir a porta aqui seria
     oferecer uma escolha que não leva a lugar nenhum. */
  const categoriasComMei = CATEGORIAS_MEI.filter((c) => categoriaTemMei(c.id));
  const sel = CATEGORIAS_MEI.find((c) => c.id === categoria);
  /* O EXEMPLO é o que ensina o campo, e ele é da CATEGORIA — mesma mecânica da
     C0. Sem categoria, uma frase genérica (aqui não há typewriter: a categoria
     chega escolhida da M1, então o estado sem ela é raro e passageiro). */
  const placeholder = sel ? `Ex: ${sel.ex}` : "Ex: conta o que você faz no dia a dia";

  /* O campo CRESCE com o texto em vez de rolar por dentro: rolagem dentro de
     um campo de 2 linhas esconde o que a pessoa acabou de escrever, e é
     justamente a descrição que a busca usa. O teto existe porque o shell é
     100dvh — sem ele, um texto longo empurraria o CTA pra fora da tela. */
  const areaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const TETO = 200;
    el.style.height = "auto";
    if (el.value === "" && el.placeholder) {
      /* Campo vazio: quem ocupa espaço é o PLACEHOLDER, e `scrollHeight` não o
         enxerga — o exemplo da categoria tem 2 linhas e apareceria cortado.
         Mede com ele dentro e devolve. */
      el.value = el.placeholder;
      el.style.height = `${Math.min(el.scrollHeight, TETO)}px`;
      el.style.overflowY = el.scrollHeight > TETO ? "auto" : "hidden";
      el.value = "";
      return;
    }
    el.style.height = `${Math.min(el.scrollHeight, TETO)}px`;
    el.style.overflowY = el.scrollHeight > TETO ? "auto" : "hidden";
  }, [texto, semResultados, placeholder]);

  /* Escolher rola de volta pro slot: com a lista rolada, o cartão escolhido
     sai de onde estava e reaparece no topo, fora da vista — sem a rolagem o
     gesto parece não ter feito nada, ou pior, parece ter APAGADO a opção.
     🐛 Rola só o contêiner rolável mais próximo, nunca `scrollIntoView`: ele
     rola TODOS os ancestrais e, na `/apresentacao`, isso move a página em
     volta da moldura em vez do aparelho (achado de 02/09 no ME). */
  const slotRef = useRef<HTMLDivElement>(null);
  const escolher = (o: OpcaoOcupacao) => {
    setPrincipal({ cnae: o.cnae, nome: o.nome });
    requestAnimationFrame(() => {
      let el = slotRef.current?.parentElement;
      while (el) {
        const overflow = getComputedStyle(el).overflowY;
        if ((overflow === "auto" || overflow === "scroll") && el.scrollHeight > el.clientHeight) {
          el.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        el = el.parentElement;
      }
    });
  };

  const buscarDeNovo = () => {
    setBusca({ texto, categoria });
    /* 🔒 BUSCA NOVA ESVAZIA O SLOT (regra de 02/09): manter no slot uma
       ocupação que veio de outra descrição é afirmar que ela ainda é a melhor
       resposta pro que a pessoa acabou de escrever, e ninguém verificou. */
    setPrincipal(null);
  };

  const podeSeguir = semResultados || desatualizado ? categoria !== null : principal !== null;

  return (
    <>
      <TelaHeader
        meta={meta}
        onVoltar={onVoltar}
        acao={<BotaoInfo onClick={() => setInfo(true)} rotulo="Como escolher sua atividade" />}
      />

      <div className="flex min-h-0 flex-1 flex-col">
        {/* `h1` fora de vista: com resultados quem faz a pergunta é o slot; na
            chegada, o texto display. Vira `sr-only` em vez de sumir, senão a
            página fica sem âncora pra quem navega por cabeçalho. */}
        <h1 className="sr-only">O que você faz?</h1>

        <div className="flex min-h-0 flex-1 flex-col gap-4">
          {semResultados ? (
            /* ── M7.0 · A CHEGADA ───────────────────────────────────────── */
            <div className="flex min-h-0 flex-1 flex-col justify-center">
              <p className="text-display text-text-primary">
                Aqui é onde você escolhe a{" "}
                <span className="text-brand">atividade principal</span> com que
                trabalha.
              </p>
              {/* 🗑️ 07/09 (pedido do Pedro) — saiu daqui o parágrafo sobre o
                  Anexo XI ("a lista é fechada por lei…"). Ele explicava o
                  MECANISMO numa tela que ainda não pediu nada, roubava a
                  altura do hero e não tinha par no ME. O fato continua dito
                  onde ele é acionável: no "i" do cabeçalho e no sheet de cada
                  ocupação, na hora de escolher. */}
              <p className="mt-3 text-body text-text-secondary">
                Se você faz mais de uma coisa, fica tranquilo: logo depois dá
                pra incluir as atividades secundárias.
              </p>
            </div>
          ) : (
            <>
              {/* 🔒 O SLOT TRAVA NO TOPO, fora da área rolável: a pessoa desce
                  pra comparar os cartões e não pode perder de vista o lugar
                  onde a escolha vai encostar — nem a pergunta, que mora nele. */}
              <div ref={slotRef} className="shrink-0 scroll-mt-1">
                {principal ? (
                  <CartaoOcupacao
                    ocupacao={{ ...principal, adequacao: 100 }}
                    selecionado
                    onVerDetalhes={() => setDetalhe({ ...principal, adequacao: 100 })}
                  />
                ) : (
                  <div className="flex min-h-[86px] flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-border-strong px-3 py-4 text-center">
                    <p className="text-body-strong font-semibold text-text-primary">
                      O que você faz?
                    </p>
                    <p className="text-caption text-text-muted">
                      Escolha sua atividade principal, é só selecionar
                    </p>
                  </div>
                )}
              </div>

              {/* Só a LISTA rola, e ela fica ACIMA dos campos — mesma ordem da
                  C0: slot, opções, e os campos no pé, ao alcance do polegar de
                  quem quiser refinar a busca. */}
              <Rolagem className="mt-4 min-h-0 flex-1">
                <p className="text-caption font-semibold text-text-primary mb-2">
                  {desatualizado
                    ? "Resultado da busca anterior"
                    : principal
                      ? "Trocar por"
                      : "O que mais se encaixa"}
                </p>
                <div className="flex flex-col gap-2">
                  {opcoes
                    .filter(
                      (o) =>
                        !(principal && o.cnae === principal.cnae && o.nome === principal.nome),
                    )
                    .map((o) => (
                      <CartaoOcupacao
                        key={`${o.cnae}-${o.nome}`}
                        ocupacao={o}
                        onClick={() => escolher(o)}
                        onVerDetalhes={() => setDetalhe(o)}
                      />
                    ))}
                  {opcoes.length === 0 && (
                    /* Categoria vazia não deveria acontecer (as 3 sem MEI já
                       foram barradas no fork), mas se acontecer a tela diz o
                       que fazer em vez de mostrar lista vazia. */
                    <p className="text-caption text-text-secondary">
                      Não achamos atividade de MEI nessa categoria. Troque a
                      categoria abaixo, ou chama a gente que a gente resolve
                      com você.
                    </p>
                  )}
                </div>
              </Rolagem>
            </>
          )}

          <Campo rotulo="Sua categoria">
            <Select
              valor={categoria ?? ""}
              onChange={(v) => setCategoria(v || null)}
              opcoes={categoriasComMei.map((c) => ({ v: c.id, label: c.label }))}
              placeholder="Escolha uma categoria"
              /* A categoria não é campo qualquer: é a resposta que a pessoa
                 deu antes de pagar, e a tela inteira depende dela. */
              valorEmDestaque
            />
          </Campo>

          {/* Este campo não usa o `Campo` do DS (o rótulo é `<p>` à mão, por
              causa do layout desta tela), então `aria-labelledby` amarra o
              nome acessível — senão o textarea é anunciado só como "campo de
              edição". Mesmo bug que a auditoria de 04/09 pegou na C0. */}
          <div className="flex shrink-0 flex-col">
            <p id="m7-rotulo-descricao" className="text-caption font-semibold text-text-primary">
              O que você faz na prática
            </p>
            <div className="relative mt-1.5">
              <textarea
                ref={areaRef}
                rows={2}
                aria-labelledby="m7-rotulo-descricao"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder={placeholder}
                /* `rounded-md` (12px), não `rounded-xl`: é o raio de TODO
                   campo do DS. O `rounded-xl` foi exatamente o que o Pedro
                   pegou na C0 em 02/09 ("parece mais redonda que o dropdown"),
                   e a 1ª versão desta tela repetiu o erro. */
                className="block w-full resize-none rounded-md border border-border-hairline
                           bg-surface-card p-4 pr-9 text-body text-text-primary
                           placeholder:text-text-muted focus:border-border-focus focus:outline-none"
              />
              {texto !== "" && (
                <button
                  type="button"
                  onClick={() => setTexto("")}
                  aria-label="Limpar"
                  className="absolute right-3 top-3 text-text-tertiary transition-colors hover:text-text-primary"
                >
                  <IconeX />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* A altura reservada só existe onde ela serve: na chegada a frase
            aparece e some conforme a pessoa digita, e sem o piso a tela
            pularia. Com resultados a frase nunca aparece, então guardar
            espaço ali seria buraco puro (achado de 04/09 no ME). */}
        <p
          className={`text-caption text-text-tertiary ${
            semResultados ? "mt-2 min-h-[1.25rem]" : ""
          }`}
        >
          {semResultados && texto.trim().length === 0
            ? "Se não escrever, sugerimos as atividades mais usadas da categoria."
            : ""}
        </p>

        {/* ⚠️ Onde o ME tem "Já sei o número do meu CNAE" aqui não vai nada, e
            a ausência é fato, não corte de escopo: no MEI não existe código
            pra digitar. O Portal do Empreendedor trabalha com OCUPAÇÃO de
            lista fechada, e o número do CNAE é DERIVADO dela pelo Anexo XI —
            a pessoa nunca o informa. Um atalho "já sei meu código" abriria um
            campo sem nada pra aceitar. */}
      </div>

      {/* 🌾 CTA no rodapé = thumb zone (design-system.md §6). */}
      <div className="app-footer-cta">
        {/* Um CTA, três trabalhos, decididos pelo estado da tela: buscar
            (chegada), buscar DE NOVO (mexeu em algo depois da última busca) e
            seguir com a atividade escolhida. */}
        <Button
          full
          disabled={!podeSeguir}
          onClick={semResultados ? onBuscar : desatualizado ? buscarDeNovo : onSeguir}
        >
          {semResultados
            ? "Buscar atividade principal"
            : desatualizado
              ? "Buscar de novo"
              : principal
                ? "Continuar com essa atividade"
                : "Escolha sua atividade principal"}
        </Button>
      </div>

      {/* ⚠️ Sheets como IRMÃOS do corpo, nunca dentro de contêiner rolável:
          eles são `absolute inset-0` e seriam recortados por ele. */}
      {detalhe && (
        <SheetOcupacao
          ocupacao={detalhe}
          selecionado={
            !!principal && principal.cnae === detalhe.cnae && principal.nome === detalhe.nome
          }
          onEscolher={() => escolher(detalhe)}
          onFechar={() => setDetalhe(null)}
        />
      )}

      {info && (
        <SheetInfo
          titulo="Como escolher sua atividade"
          pontos={[
            "A lista do MEI é fechada por lei (Anexo XI da Res. CGSN 140/2018): só existem as ocupações de lá, e a gente já separou as da sua categoria.",
            "Escreva do seu jeito, com as palavras que você usaria pra explicar seu trabalho pra um cliente. Não precisa de termo técnico.",
            "Não escrever também vale: sem descrição, a gente mostra as atividades da sua categoria e você escolhe.",
            "Escolher aqui não trava nada: dá pra alterar depois, de graça, no próprio Portal do Empreendedor.",
            "Faz mais de uma coisa? Escolha a principal aqui. As outras entram como secundárias no passo seguinte.",
          ]}
          destaque={{
            titulo: "A ocupação vale menos que o CNAE dela",
            texto:
              "O CNAE é amplo, a ocupação é estrita, e o MEI só pode a ocupação (Cosit 27/2021). Quem se registra como reparador de bicicleta não pode consertar moto, mesmo os dois caindo no mesmo código. Toque em 'Ver detalhes' pra ver o escopo de cada uma.",
          }}
          exemplo={{
            titulo: "Duas descrições da mesma pessoa",
            bom: "“Conserto bicicleta, troco peça e faço revisão, atendo na minha garagem.” Diz o que entrega e onde.",
            ruim: "“Serviços em geral.” Cabe em dezenas de ocupações diferentes, e a gente teria que adivinhar qual é a sua.",
          }}
          onFechar={() => setInfo(false)}
        />
      )}
    </>
  );
}

/** O X de limpar o campo, mesmo desenho do da C0. */
function IconeX() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
