"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { Campo, Texto, Checkbox } from "@/components/ui/form";
import { StatusIcon } from "@/components/ui/status";
import { PainelView, type Etapa } from "@/components/painel";
import { CUSTOS, brl } from "@/lib/fiscal";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FLOW #2 — MIGRAR DE CONTADOR (M1–M5) · construído 30/07
 * ═══════════════════════════════════════════════════════════════════════════
 * Fonte da lógica: `execucao/motor-testes/flow-migrar.js` (M0–M5, 15 passos,
 * 3 personas: migra-limpo · migra-passivo · migra-refem) + o bloco I da
 * `pesquisa/fiscal-simples-bh-2026.md` (🟢 alta confiança).
 *
 * O flow #2 era o blind spot mais antigo do projeto — "metade do mercado, zero
 * testado" desde 15/07. A lógica estava modelada e testada; faltavam as telas.
 *
 * ─── AS 4 DIFERENÇAS ESTRUTURAIS EM RELAÇÃO AO FLOW #1 ────────────────────
 *
 * 1. **NÃO existe entrevista de atividade.** O CNAE já está registrado — a
 *    gente LÊ o cartão CNPJ em vez de perguntar o que a pessoa faz. Some o N4
 *    inteiro (pills, typewriter, desambiguação); entra uma consulta.
 *
 * 2. **O diagnóstico usa o número REAL, não estimativa.** Empresa com 12+ meses
 *    tem histórico (CGSN 140/18 art. 26 — usa os 12 meses sem proporcionalizar).
 *    É a diferença mais importante: no flow #1 o teaser é promessa em cima de
 *    faixa (e daí nasceu a dívida `promessa-quebrada`); aqui a conta é dele.
 *
 * 3. **Não tem taxa de governo.** A empresa já existe: sem DAE da Junta, sem
 *    TFLF. O choque de custo do flow #1 (~R$463 na tela do plano) não existe.
 *
 * 4. 🔴 **A pausa mais perigosa do produto inteiro mora aqui: o TTRT.** O Termo
 *    de Transferência de Responsabilidade Técnica é aberto pelo contador NOVO
 *    no portal do CRC-MG e **validado pelo ANTIGO**. Todas as pausas do flow #1
 *    esperam um órgão (neutro) ou o próprio cliente. Esta espera um
 *    **concorrente que está perdendo o cliente pra nós**. Persona `migra-refem`.
 *
 * ─── 💰 DECISÃO TRAVADA (Pedro, 30/07): COBRA ANTES DO TTRT ───────────────
 * O pagamento (M3) acontece ANTES da transferência (M4), igual ao flow #1.
 * ⚠️ O risco assumido, dito na cara: a gente cobra por algo cujo destravamento
 * depende de um terceiro hostil. Se o contador antigo não validar o TTRT, o
 * cliente pagou e está travado por culpa de quem não é nem ele nem a gente.
 * Por isso o M4 tem um estado de exceção dedicado (`/migrar/transferencia?
 * estado=travado`) que assume o problema em vez de deixar o cliente no limbo,
 * e o M3 promete explicitamente devolução se a transferência não sair.
 *
 * 🟡 PENDÊNCIA D (fila-Larissa): o nº da resolução CFC e o código "Evento 232"
 * ainda não foram conferidos em fonte primária. Por isso **nenhuma tela exibe
 * esses códigos pro cliente** — a copy fala em linguagem de gente ("a gente
 * transfere a responsabilidade no conselho"). A mecânica está certa; a citação
 * é que não pode ir pra tela antes de ratificada.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/* ═══════════════════ mock do CNPJ consultado ════════════════════════════ */

/**
 * 🚧 Vem da consulta real por CNPJ (InfoSimples — validado 24/07: o CNPJ 🔓
 * puxa razão social, endereço, sócios, situação e CNAE). Aqui é farol.
 */
export interface EmpresaMigrar {
  cnpj: string;
  razao: string;
  fantasia: string;
  abertura: string;
  situacao: string;
  natureza: string;
  porte: string;
  regime: "simples" | "mei" | "presumido";
  cnae: string;
  cnaeHumano: string;
  endereco: string;
}

export const EMPRESA_MIGRAR: EmpresaMigrar = {
  cnpj: "12.345.678/0001-90",
  razao: "Ana Beatriz Ramos Web Studio LTDA",
  fantasia: "Ramos Studio",
  abertura: "14/03/2023",
  situacao: "ATIVA",
  natureza: "Sociedade Limitada Unipessoal (SLU)",
  porte: "Microempresa (ME)",
  regime: "simples",
  cnae: "6201-5/02",
  cnaeHumano: "Criação de sites e web design",
  endereco: "Rua dos Timbiras, 1200, Funcionários, Belo Horizonte/MG",
};

/**
 * 🆕 04/08 — cenários de demo pra exercitar os gaps achados no cruzamento com
 * o `Fluxo Migração GEMINI.md`: hoje o M1 só checava "situação ativa +
 * optante Simples + CNAE liso", sem nunca perguntar SE o regime de origem é
 * um dos que migramos, nem tratar CNPJ inapto/suspenso (hoje passaria batido
 * ou cairia num veredito genérico). Mesmo padrão de `?cenario=` já usado em
 * `migrar/diagnostico` e `migrar/passivo`.
 *
 * 🆕 04/08 (2ª rodada, decisão do Pedro) — **MEI entra no escopo do Migrar.**
 * Reverte a leitura anterior desta mesma pendência: só Lucro Presumido segue
 * bloqueado (`/saida/regime-nao-suportado`, sem decisão de motor fiscal
 * próprio ainda). MEI ganha um subfluxo dedicado no M2 (ver
 * `MigrarDiagnosticoView`) porque MEI não é obrigado a ter contador — a
 * pergunta "você tem contador hoje?" decide se reusa o pipeline de
 * transferência (TTRT/CRC-MG) ou pula direto pra M5.
 */
export type CenarioM1 = "padrao" | "mei" | "presumido" | "inapto";

export const EMPRESA_MIGRAR_CENARIOS: Record<CenarioM1, EmpresaMigrar> = {
  padrao: EMPRESA_MIGRAR,
  mei: { ...EMPRESA_MIGRAR, porte: "Microempreendedor Individual (MEI)", regime: "mei" },
  presumido: { ...EMPRESA_MIGRAR, porte: "Microempresa (ME)", natureza: "Lucro Presumido", regime: "presumido" },
  inapto: { ...EMPRESA_MIGRAR, situacao: "SUSPENSA" },
};

/**
 * Histórico dos últimos 12 meses — o cálculo por trás do diagnóstico de
 * Fator R. 🔴 04/08 (3ª rodada): não é mais usado na entrada (M2 pré-
 * pagamento cortou o diagnóstico de ME — a API que puxaria isso não roda
 * antes do pagamento). Fica de motor pronto pra quando o diagnóstico real
 * pós-pagamento for construído (mesma doutrina de `/impostos/aliquotas`).
 * Cenário de propósito: Fator R ABAIXO do corte (a pessoa paga Anexo V sem
 * precisar). É o caso que prova o valor do produto.
 */
export const HISTORICO_12M = {
  receita: 240000,
  folha: 52800,
};

const FATOR_R_LIMIAR = 0.28;
const ALIQ_III = 0.06;
const ALIQ_V = 0.155;

export function calcFatorR(folha: number, receita: number) {
  const fr = folha / receita;
  const mensal = receita / 12;
  const jaOtimo = fr >= FATOR_R_LIMIAR;
  const ganhoMes = jaOtimo ? 0 : Math.round((ALIQ_V - ALIQ_III) * mensal);
  return { fr, mensal, jaOtimo, ganhoMes };
}

/* ═══════════════════ M1 · SEU CNPJ (consulta + veredito) ════════════════ */

function mascaraCnpj(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

type FaseM1 = "input" | "consultando" | "achou";

/**
 * M1' — VALIDANDO O CNPJ · tela própria (🆕 04/08, pedido do Pedro).
 *
 * Até 04/08 isto era um `if` interno do M1 (fase "consultando"), sem existir
 * como tela catalogável — a prancheta só via através do fluxo interativo, não
 * dava pra abrir direto nem listar ao lado do M1 no `/mockup`. Extraído como
 * componente próprio pelo mesmo motivo do resto do arquivo: fonte única, zero
 * cópia. `MigrarCnpjView` reusa isto na fase "consultando"; a rota
 * `/migrar/cnpj?fase=validando` (ver page.tsx) renderiza isto sozinho, parado,
 * pra virar tela catalogável sem correr contra o `setTimeout` de 1400ms.
 */
export function MigrarValidandoView({ onVoltar }: { onVoltar?: () => void }) {
  return (
    <>
      <TelaHeader meta="Sua empresa" onVoltar={onVoltar} />
      <main className="app-main">
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center">
          <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface-tint-brand">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-action-primary border-t-transparent" />
          </span>
          <p className="text-h2 mb-1">Buscando sua empresa</p>
          <p className="text-body text-text-secondary max-w-[34ch]">
            Estamos consultando o CNPJ na Receita Federal pra ver o que já está
            registrado.
          </p>
        </div>
      </main>
    </>
  );
}

/**
 * M1'' — ACHAMOS SUA EMPRESA · tela própria (🆕 04/08, correção do pedido do
 * Pedro — ele queria ESTA tela separada, não o loading).
 *
 * Card com os dados puxados da Receita + as 4 checagens + veredito. Extraído
 * do `if (fase === "achou")` de `MigrarCnpjView` pelo mesmo motivo de sempre:
 * fonte única, reusada pelo fluxo interativo E pela rota estática
 * `/migrar/cnpj?fase=achou` (ver page.tsx) — que existe pra catalogar esta
 * tela ao lado do M1 no `/mockup`, sem precisar digitar um CNPJ pra ver.
 */
export function MigrarAchouView({
  empresa,
  situacaoOk,
  onVoltar,
  onSeguir,
  onSaidaInapto,
}: {
  empresa: EmpresaMigrar;
  situacaoOk: boolean;
  onVoltar?: () => void;
  onSeguir?: () => void;
  onSaidaInapto?: () => void;
}) {
  const e = empresa;
  return (
    <>
      <TelaHeader meta="Sua empresa" onVoltar={onVoltar} />
      <main className="app-main">
        <Titulo sub="Confira se é essa mesmo. Puxamos da Receita com o seu CNPJ, você não digita nada.">
          Achamos sua empresa
        </Titulo>

        <Corpo>
          <Card>
            <p className="text-body font-semibold text-text-primary">{e.razao}</p>
            <p className="text-caption text-text-secondary mt-0.5">{e.cnpj}</p>
            <div className="mt-3 flex flex-col gap-1.5 border-t border-border-hairline pt-3">
              <LinhaFicha rotulo="Atividade principal" valor={`${e.cnaeHumano} (${e.cnae})`} />
              <LinhaFicha rotulo="Tipo" valor={e.natureza} />
              <LinhaFicha rotulo="Porte" valor={e.porte} />
              <LinhaFicha rotulo="Aberta em" valor={e.abertura} />
              <LinhaFicha rotulo="Endereço" valor={e.endereco} />
            </div>
          </Card>

          {/* O veredito é consequência do que a consulta trouxe, não de uma
              interpretação nossa. Por isso vem junto, sem tela extra.
              🔴 05/08 — a checagem de REGIME que existia aqui foi removida:
              a consulta cadastral (R$0,20) não confirma Simples×Presumido
              nem MEI (ver `pesquisa/integracoes-apis/infosimples-funcionalidades.md`
              §CNPJ) — isso só vem da API paga separada, que só roda pós-
              pagamento (decisão 04/08). Mostrar um check de "regime" aqui era
              prometer uma confirmação que a consulta não faz. Regime já veio
              autodeclarado lá na E3.2 (MEI · ME/Simples · Lucro Presumido, o
              último já sai por lá) — não pergunta de novo aqui.
              🔴 05/08 — a 2ª checagem ("Prestação de serviço, sem conselho de
              classe") também saiu: era `ok` fixo, sem checar dado nenhum da
              consulta. Ao lado de um check real (situação ativa), lia como se
              os dois fossem confirmação da API — só um era. */}
          <div className="flex flex-col gap-2">
            <ChecagemLinha ok={situacaoOk} titulo="Situação ativa na Receita" />
          </div>

          {!situacaoOk ? (
            <Aviso variante="danger" titulo="Essa empresa precisa regularizar antes">
              A Receita mostra situação {e.situacao.toLowerCase()}, não ativa.
              A gente não consegue assumir a contabilidade nesse estado — o
              primeiro passo é regularizar o CNPJ.
            </Aviso>
          ) : e.regime === "mei" ? (
            <Aviso variante="success" titulo="A gente cuida do seu MEI">
              Sua atividade está dentro do que a gente atende. O próximo passo é
              entender como você quer que a gente assuma a sua contabilidade.
            </Aviso>
          ) : (
            <Aviso variante="success" titulo="A gente cuida dessa empresa">
              Sua atividade está dentro do que a gente atende. O próximo passo é
              ver o plano.
            </Aviso>
          )}

        </Corpo>

        <Rodape>
          {situacaoOk ? (
            <Button full onClick={onSeguir}>
              É essa a minha empresa
            </Button>
          ) : (
            <Button full variant="dark" onClick={onSaidaInapto}>
              Ver como regularizar
            </Button>
          )}
        </Rodape>
      </main>
    </>
  );
}

/**
 * M1 — a porta do flow #2.
 *
 * ⚠️ Decisão de tela: consulta e veredito na MESMA tela, não em duas. No flow #1
 * o veredito é tela própria porque depende de uma interpretação (a IA lê o que a
 * pessoa escreveu e pode errar). Aqui não há interpretação: o CNAE está
 * registrado, é fato. Separar em duas telas só adicionaria um toque pra mostrar
 * um dado que já estava na anterior.
 */
export function MigrarCnpjView({
  preencher,
  cenario = "padrao",
  onSeguir,
  onSaidaInapto,
  onVoltar,
}: {
  /**
   * Nonce do "✨ Preencher automático" da demo — mesmo padrão do dossiê. A
   * apresentação não escreve no campo (ela não conhece o estado interno da
   * tela): incrementa o nonce e a tela se preenche sozinha. Nonce e não
   * booleano porque apresentar é repetir.
   */
  preencher?: number;
  /** 🆕 04/08 — qual empresa mockada consultar. Ver `EMPRESA_MIGRAR_CENARIOS`. */
  cenario?: CenarioM1;
  /** MEI e ME seguem os dois direto: regime já foi autodeclarado na E3.2, não pergunta de novo aqui. */
  onSeguir?: () => void;
  /** 🆕 04/08 — CNPJ inapto/suspenso/baixado: precisa regularizar antes de migrar. */
  onSaidaInapto?: () => void;
  onVoltar?: () => void;
}) {
  const [cnpj, setCnpj] = useState("");
  const [fase, setFase] = useState<FaseM1>("input");

  const empresa = EMPRESA_MIGRAR_CENARIOS[cenario];
  const situacaoOk = empresa.situacao === "ATIVA";

  const feito = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (preencher === undefined || preencher === 0 || feito.current === preencher) return;
    feito.current = preencher;
    setCnpj(empresa.cnpj);
    setFase("input");
  }, [preencher, empresa.cnpj]);

  const digitos = cnpj.replace(/\D/g, "");
  const completo = digitos.length === 14;

  function consultar() {
    setFase("consultando");
    // 🌾 mesmo padrão do "Analisando" do N4: loading que EXPLICA, com tempo de
    // leitura. Aqui a espera é honesta — existe consulta de verdade por trás.
    setTimeout(() => setFase("achou"), 1400);
  }

  if (fase === "consultando") {
    return <MigrarValidandoView onVoltar={onVoltar} />;
  }

  if (fase === "achou") {
    return (
      <MigrarAchouView
        empresa={empresa}
        situacaoOk={situacaoOk}
        onVoltar={() => setFase("input")}
        onSeguir={onSeguir}
        onSaidaInapto={onSaidaInapto}
      />
    );
  }

  return (
    <>
      <TelaHeader meta="Sua empresa" onVoltar={onVoltar} />
      <main className="app-main">
        <Titulo sub="Com o CNPJ a gente puxa da Receita: atividade, sócios e endereço. Você não preenche nada disso.">
          Qual é o CNPJ da sua empresa?
        </Titulo>

        <Corpo>
          <Campo rotulo="CNPJ">
            <Texto
              valor={cnpj}
              onChange={(v) => setCnpj(mascaraCnpj(v))}
              placeholder="00.000.000/0000-00"
              inputMode="numeric"
            />
          </Campo>

          <Aviso variante="info" titulo="Por que a gente pede só isso">
            Diferente de abrir uma empresa, aqui não precisamos perguntar o que
            você faz: já está registrado. A gente lê e confere.
          </Aviso>
        </Corpo>

        <Rodape>
          <Button full disabled={!completo} onClick={consultar}>
            Buscar minha empresa
          </Button>
        </Rodape>
      </main>
    </>
  );
}

function LinhaFicha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-micro text-text-tertiary">{rotulo}</span>
      <span className="text-caption text-text-primary">{valor}</span>
    </div>
  );
}

function ChecagemLinha({ ok, titulo }: { ok: boolean; titulo: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <StatusIcon estado={ok ? "feito" : "recusa"} />
      <p className="text-caption text-text-secondary">{titulo}</p>
    </div>
  );
}

/* ═══════════════════ M2 · DIAGNÓSTICO ("tem contador?", só MEI) ═════════ */

/**
 * M2 — 🔴 04/08 (3ª rodada, decisão do Pedro): o diagnóstico de Fator R com
 * "número real" pra ME foi CORTADO desta tela. A premissa quebrou contra o
 * levantamento de APIs: a única API que roda pré-pagamento é a cadastral
 * (razão/endereço/CNAEs/sócios/situação) — faturamento e folha dos últimos 12
 * meses não existem em API pública nenhuma da Receita, só via procuração/
 * e-CAC (🔐), que só desbloqueia DEPOIS que a pessoa vira cliente. Pró-labore/
 * Fator R agora só entram na conversa pós-pagamento (reuso do motor de
 * `/impostos/aliquotas`, dia-2). ME segue direto do M1 (`/migrar/cnpj`) pro
 * plano (M3), sem passar por aqui.
 *
 * O que sobra nesta rota é só o SUBFLUXO MEI: MEI não tem Fator R (paga
 * DAS-MEI fixo, sem Anexo) e não é OBRIGADO a ter contador (DASN-SIMEI é
 * autodeclaratório) — a pergunta que decide tudo é "você tem contador hoje?".
 * Resposta vira `temContador` e viaja via `onSeguir` pro M3+ decidirem se
 * reusam o pipeline de transferência ou pulam pra M5 direto.
 */
export function MigrarDiagnosticoView({
  onSeguir,
  onVoltar,
}: {
  /** Carrega se a pessoa tem contador hoje (decide se pula a transferência). */
  onSeguir?: (temContador?: boolean) => void;
  onVoltar?: () => void;
}) {
  const [temContador, setTemContador] = useState<boolean | null>(null);

  if (temContador === null) {
    return (
      <>
        <TelaHeader meta="Seu diagnóstico" onVoltar={onVoltar} />
        <main className="app-main">
          <Titulo sub="Isso muda como a gente assume sua contabilidade a partir de agora.">
            Você tem contador hoje?
          </Titulo>

          <Corpo>
            <Aviso variante="info" titulo="Por que a gente pergunta isso">
              MEI não é obrigado a ter contador — muita gente cuida disso
              sozinho. Se você já tem um, a gente faz a transferência
              combinada com ele. Se não tem, a gente já assume direto, sem
              burocracia extra.
            </Aviso>
          </Corpo>

          <Rodape>
            <div className="flex flex-col gap-2">
              <Button full onClick={() => setTemContador(true)}>
                Sim, tenho contador
              </Button>
              <Button full variant="secondary" onClick={() => setTemContador(false)}>
                Não, cuido sozinho
              </Button>
            </div>
          </Rodape>
        </main>
      </>
    );
  }

  return (
    <>
      <TelaHeader meta="Seu diagnóstico" onVoltar={() => setTemContador(null)} />
      <main className="app-main">
        <Titulo
          sub={
            temContador
              ? "A gente combina a transferência com quem cuida de você hoje."
              : "Sem contador pra transferir, a gente já assume direto, sem burocracia."
          }
        >
          {temContador ? "Vamos assumir sua contabilidade" : "Vamos começar direto"}
        </Titulo>

        <Corpo>
          <Card tom="sucesso">
            <p className="text-body font-semibold text-text-primary mb-2">
              O que muda pra você
            </p>
            <div className="flex flex-col gap-1.5">
              <LinhaFicha rotulo="Guia mensal (DAS-MEI)" valor="calculada e paga por você, do jeito que já é" />
              <LinhaFicha rotulo="Limite de faturamento" valor="a gente acompanha os R$ 81 mil/ano de perto" />
              <LinhaFicha rotulo="Nota fiscal" valor="emissão pelo app, sem complicação" />
            </div>
          </Card>

          <Aviso variante="info" titulo="O que a gente faz com isso">
            {temContador
              ? "A gente cuida da transferência com seu contador atual. Você não precisa ligar pra ninguém."
              : "Como você não tem contador hoje, a gente já assume sua contabilidade a partir do pagamento, sem etapa de transferência no meio."}
          </Aviso>
        </Corpo>

        <Rodape>
          <Button full onClick={() => onSeguir?.(temContador ?? undefined)}>
            Quero continuar
          </Button>
        </Rodape>
      </main>
    </>
  );
}

/* ═══════════════════ M3 · A CONTA DA MIGRAÇÃO ═══════════════════════════ */

/**
 * M3 — o plano.
 *
 * ⚠️ Diferença de fundo em relação ao N7: **não existe taxa de governo aqui.**
 * A empresa já existe, então não há DAE da Junta nem TFLF. O cliente paga só a
 * mensalidade. O "choque de custo" que o flow #1 tem na 3ª tela simplesmente
 * não acontece — e isso é argumento, não ausência.
 *
 * 🆕 04/08 — PLANO MEI (decisão do Pedro): MEI não é o plano ME com desconto,
 * é um plano LIMITADO (emitir NF + gerenciar o 1 colaborador que a lei
 * permite) — por isso preço próprio (`MENSALIDADE_MEI`), fidelidade de 12
 * meses (contrapartida do certificado digital incluso, que a gente PAGA
 * porque precisa dele pra movimentar em nome do cliente) e escopo menor no
 * card "depois, todo mês".
 */
export function MigrarPlanoView({
  mei = false,
  onSeguir,
  onVoltar,
}: {
  /** 🆕 04/08 — troca o card de mensalidade+escopo pro Plano MEI (preço próprio, fidelidade, certificado incluso). */
  mei?: boolean;
  onSeguir?: () => void;
  onVoltar?: () => void;
}) {
  const mensalidade = mei ? CUSTOS.MENSALIDADE_MEI : CUSTOS.MENSALIDADE;

  return (
    <>
      <TelaHeader meta="A conta da migração" onVoltar={onVoltar} />
      <main className="app-main">
        <Titulo sub="Sem taxa de governo, sem custo de transferência. Você paga a mensalidade e mais nada.">
          Quanto custa trocar
        </Titulo>

        <Corpo>
          <Card tom="sucesso">
            <p className="text-caption text-state-success-text mb-1">
              A transferência em si
            </p>
            <div className="flex items-center gap-2.5">
              <StatusIcon estado="feito" />
              <p className="text-display text-state-success-text">Grátis</p>
            </div>
            <p className="text-caption text-text-secondary mt-2">
              Distrato, transferência no conselho e atualização nos órgãos. Tudo
              por nossa conta.
            </p>
          </Card>

          <Card>
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-caption text-text-secondary">Depois, todo mês</p>
              {mei && (
                <span className="rounded-full bg-state-info-tint px-2.5 py-0.5 text-micro font-semibold text-state-info-text">
                  Plano MEI
                </span>
              )}
            </div>
            <p className="text-display text-text-primary">{brl(mensalidade)}</p>
            <p className="text-caption text-text-secondary mt-2">
              {mei
                ? "Emitir suas notas fiscais e gerenciar o colaborador que a lei permite pro MEI."
                : "Suas guias todo mês, notas fiscais, obrigações do governo e contador de verdade pra falar."}
            </p>
            {mei && (
              <div className="mt-3 flex flex-col gap-1.5 border-t border-border-hairline pt-3">
                <LinhaFicha rotulo="Fidelidade" valor={`${CUSTOS.FIDELIDADE_MEI_MESES} meses`} />
                <LinhaFicha rotulo="Certificado digital" valor="incluso, emitido por nós" />
              </div>
            )}
          </Card>

          {/* Não existe repasse de governo na migração — dizer isso é vantagem
              concreta sobre a abertura, não ausência de informação. */}
          <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
            <p className="text-body font-semibold text-text-primary">
              Nenhuma taxa de governo
            </p>
            <p className="text-caption text-text-secondary mt-1">
              Sua empresa já existe, então não tem taxa de Junta Comercial nem de
              prefeitura pra pagar. Trocar de contador não custa nada aos órgãos.
            </p>
          </div>

          {mei && (
            /* 🆕 04/08 — o certificado é PRÉ-REQUISITO nosso, não um extra: sem
               ele a gente não consegue emitir nota nem mexer em nada em nome
               do cliente. Fidelidade é a contrapartida de pagar por isso. */
            <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
              <p className="text-body font-semibold text-text-primary">
                Por que a fidelidade de {CUSTOS.FIDELIDADE_MEI_MESES} meses
              </p>
              <p className="text-caption text-text-secondary mt-1">
                A gente emite e paga o seu certificado digital, porque precisa
                dele pra fazer as movimentações da sua empresa. A fidelidade é
                a contrapartida desse custo.
              </p>
            </div>
          )}

          <p className="text-micro text-text-tertiary">
            Valores de referência enquanto fechamos o preço final.
          </p>
        </Corpo>

        <Rodape>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <span className="text-caption text-text-secondary">Você paga hoje</span>
            <span className="text-h2 text-text-primary">{brl(mensalidade, true)}</span>
          </div>
          <Button full onClick={onSeguir}>
            Continuar
          </Button>
        </Rodape>
      </main>
    </>
  );
}

/**
 * M3b — aceite do contrato.
 *
 * ⚠️ A promessa de devolução aqui NÃO é copy de marketing: é a contrapartida da
 * decisão de cobrar antes do TTRT (30/07). Como o destravamento depende do
 * contador antigo — um terceiro com interesse contrário —, o cliente precisa
 * saber, ANTES de pagar, o que acontece se a transferência não sair.
 */
export function MigrarContratoView({
  aceito,
  setAceito,
  semTransferencia = false,
  mei = false,
  onSeguir,
  onVoltar,
  onLerContrato,
}: {
  aceito: boolean;
  setAceito: (v: boolean) => void;
  /** 🆕 04/08 — MEI sem contador hoje: não há TTRT pra falhar, então a
   *  cláusula de devolução vira uma promessa de início imediato em vez de
   *  contrapartida de risco. */
  semTransferencia?: boolean;
  /** 🆕 04/08 — Plano MEI: preço próprio + fidelidade com número + certificado incluso. */
  mei?: boolean;
  onSeguir?: () => void;
  onVoltar?: () => void;
  onLerContrato?: () => void;
}) {
  const mensalidade = mei ? CUSTOS.MENSALIDADE_MEI : CUSTOS.MENSALIDADE;

  return (
    <>
      <TelaHeader meta="Contrato de serviço" onVoltar={onVoltar} />
      <main className="app-main">
        <Titulo sub="O que a gente faz por você e o que você paga.">
          Está tudo combinado
        </Titulo>

        <Corpo>
          <div>
            <p className="text-body font-semibold text-text-primary mb-2">
              Em quatro linhas
            </p>

            <div className="rounded-2xl border border-border-hairline bg-surface-card">
              <div className="flex items-baseline justify-between gap-3 px-4 pt-3.5">
                <span className="text-caption text-text-secondary">Você paga hoje</span>
                <span className="shrink-0 text-body font-semibold text-text-primary">
                  {brl(mensalidade, true)}
                </span>
              </div>
              <p className="px-4 pb-3.5 text-micro text-text-tertiary">
                {semTransferencia
                  ? "só a 1ª mensalidade. Sem custo de transferência nem taxa de governo"
                  : "só a 1ª mensalidade. A transferência não tem custo nem taxa de governo"}
              </p>

              <div className="border-t border-border-hairline">
                <div className="flex items-baseline justify-between gap-3 px-4 pt-3.5">
                  <span className="text-caption text-text-secondary">Depois, todo mês</span>
                  <span className="shrink-0 text-body font-semibold text-text-primary">
                    {brl(mensalidade)}
                  </span>
                </div>
                <p className="px-4 pb-3.5 text-micro text-text-tertiary">
                  {mei
                    ? "emitir notas fiscais e gerenciar seu colaborador, certificado digital incluso"
                    : "sua contabilidade completa, a partir da data de corte combinada"}
                </p>
              </div>
            </div>

            <ul className="mt-2 flex flex-col gap-2">
              <Bullet>
                {mei
                  ? `O certificado digital vem incluso: a gente precisa dele pra movimentar sua empresa. Em troca, o plano tem fidelidade de ${CUSTOS.FIDELIDADE_MEI_MESES} meses, descrita no contrato.`
                  : semTransferencia
                    ? "Como não há transferência de responsabilidade a esperar, o plano tem um período mínimo de permanência, descrito no contrato."
                    : "Como a transferência é gratuita, o plano tem um período mínimo de permanência, descrito no contrato."}
              </Bullet>
              {semTransferencia ? (
                /* 🆕 04/08 — MEI sem contador hoje: não existe TTRT pra
                   falhar, então não faz sentido prometer devolução por algo
                   que não vai acontecer. A promessa vira início imediato. */
                <Bullet>
                  Sua contabilidade começa a valer assim que o pagamento
                  confirmar, sem etapa de transferência no meio.
                </Bullet>
              ) : (
                /* 🔴 A contrapartida de cobrar antes do TTRT. Sem isso, a decisão
                    de 30/07 seria cobrar por algo que a gente não controla, sem
                    dar saída ao cliente. */
                <Bullet>
                  Se a transferência não for concluída por algum motivo fora do seu
                  controle, você recebe tudo de volta.
                </Bullet>
              )}
            </ul>
          </div>

          <button
            type="button"
            onClick={onLerContrato}
            className="flex min-h-12 w-full items-center justify-center rounded-md border
                       border-border-strong bg-surface-card px-4 text-body font-semibold
                       text-text-primary transition-colors hover:bg-surface-alt"
          >
            Ler o contrato completo
          </button>

          <Card tom="marca">
            <p className="text-body font-semibold text-text-primary mb-1">
              Você está trocando por um escritório de verdade
            </p>
            <p className="text-caption text-text-secondary">
              22 anos de contabilidade em Belo Horizonte, de antes de existir app
              pra isso. Quem cuida da sua empresa é uma pessoa, e você fala direto
              com ela.
            </p>
          </Card>

          <Checkbox checked={aceito} onChange={setAceito}>
            Li e aceito o contrato de serviço da Legalizai.
          </Checkbox>
        </Corpo>

        <Rodape>
          <Button full disabled={!aceito} onClick={onSeguir}>
            Aceitar e continuar
          </Button>
        </Rodape>
      </main>
    </>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-action-primary" />
      <span className="text-body text-text-secondary">{children}</span>
    </li>
  );
}

/* ═══════════════════ M4 · AUDITORIA DE PASSIVO ══════════════════════════ */

/**
 * M4a — o risco EXCLUSIVO do flow #2: a empresa chega com passado.
 *
 * 🔥 O consolidado fiscal (#14) diz que as obrigações do período antigo ficam
 * com o contador anterior — mas **o cliente não sabe disso, e a dívida é da
 * empresa, não do contador.** Assumir sem auditar é herdar problema que a gente
 * não criou e virar o culpado por ele.
 *
 * Por isso esta tela vem ANTES de qualquer transferência: mostra o que
 * encontramos, separa o que é responsabilidade de quem, e deixa o cliente
 * decidir sabendo. Persona: `migra-passivo`.
 */
export function MigrarPassivoView({
  comPassivo = true,
  onSeguir,
  onVoltar,
}: {
  comPassivo?: boolean;
  onSeguir?: () => void;
  onVoltar?: () => void;
}) {
  return (
    <>
      <TelaHeader meta="Antes de assumir" onVoltar={onVoltar} />
      <main className="app-main">
        <Titulo
          sub={
            comPassivo
              ? "Olhamos a situação da sua empresa nos órgãos. Achamos coisas que precisam da sua atenção."
              : "Olhamos a situação da sua empresa nos órgãos. Está tudo em ordem."
          }
        >
          {comPassivo ? "O que encontramos" : "Sua empresa está limpa"}
        </Titulo>

        <Corpo>
          {comPassivo ? (
            <>
              <div className="flex flex-col gap-2">
                <ItemPassivo
                  titulo="DAS em atraso"
                  valor="R$ 1.840,00"
                  detalhe="3 guias não pagas, referentes a jan, fev e mar deste ano."
                />
                <ItemPassivo
                  titulo="Declaração anual pendente"
                  detalhe="A DEFIS do ano passado não foi entregue."
                />
              </div>

              {/* A separação que protege os dois lados. Sem isso, ou a gente
                  herda culpa alheia, ou o cliente descobre depois e a culpa
                  vira nossa de qualquer jeito. */}
              <Aviso variante="warning" titulo="De quem é cada coisa">
                A dívida é da empresa, então ela continua sendo sua. Mas a
                responsabilidade por não ter entregue no prazo é de quem cuidava
                da contabilidade naquele período.
              </Aviso>

              <Card>
                <p className="text-body font-semibold text-text-primary mb-1">
                  O que a gente faz
                </p>
                <p className="text-caption text-text-secondary">
                  A gente assume daqui pra frente e te mostra o caminho pra
                  regularizar o que ficou. Se quiser, a gente cuida disso também,
                  como um serviço à parte.
                </p>
              </Card>
            </>
          ) : (
            <>
              <Card tom="sucesso">
                <div className="flex items-center gap-2 mb-2">
                  <StatusIcon estado="feito" />
                  <span className="text-caption font-semibold text-state-success-text">
                    Nada pendente
                  </span>
                </div>
                <p className="text-caption text-text-secondary">
                  Impostos em dia, declarações entregues, sem inscrição em dívida
                  ativa. A migração é limpa.
                </p>
              </Card>
              <Aviso variante="info" titulo="Por que a gente confere isso">
                Porque a empresa chega com um passado, e você tem o direito de
                saber o que está assumindo antes da gente encostar nela.
              </Aviso>
            </>
          )}
        </Corpo>

        <Rodape>
          <Button full onClick={onSeguir}>
            {comPassivo ? "Entendi, pode continuar" : "Continuar"}
          </Button>
        </Rodape>
      </main>
    </>
  );
}

function ItemPassivo({
  titulo,
  valor,
  detalhe,
}: {
  titulo: string;
  valor?: string;
  detalhe: string;
}) {
  return (
    <div className="rounded-2xl border border-state-warning bg-state-warning-tint p-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-body font-semibold text-state-warning-text">{titulo}</p>
        {valor && (
          <span className="shrink-0 text-body font-semibold text-state-warning-text">
            {valor}
          </span>
        )}
      </div>
      <p className="text-caption text-text-secondary mt-1">{detalhe}</p>
    </div>
  );
}

/* ═══════════════════ M4b · A TRANSFERÊNCIA (pipeline) ═══════════════════ */

/**
 * O pipeline da migração, em linguagem de gente. Os códigos oficiais (resolução
 * CFC, Evento 232 do Redesim) ficam FORA da tela — são 🟡 pendência D, não
 * ratificados em fonte primária, e o cliente não precisa deles de qualquer jeito.
 *
 * 🆕 04/08 — cruzamento com `Fluxo Migração GEMINI.md`: o Gemini trata "trocar
 * o responsável técnico na Prefeitura (CadWeb PBH)" como ação PRÓPRIA, separada
 * da transferência no Conselho (CRC-MG) e da atualização federal/estadual
 * (Redesim/DBE Evento 232). O pipeline tinha 4 etapas comprimindo os 2 —
 * separei em 5 pra não fingir que "atualizar os órgãos" é um evento único
 * quando pode ser 2 sistemas de fato. 🟡 segue fila-Larissa: se confirmar que
 * é o MESMO mecanismo, volta pra 4.
 */
const ETAPAS_MIGRACAO: Etapa[] = [
  { nome: "Encerramos com seu contador antigo" },
  { nome: "Transferindo a responsabilidade", orgao: "Conselho de Contabilidade" },
  { nome: "Atualizando no Redesim", orgao: "Receita Federal e Estado" },
  { nome: "Trocando o responsável contábil", orgao: "Prefeitura de Belo Horizonte" },
  { nome: "Liberando o acesso pra gente cuidar" },
];

export function MigrarTransferenciaView({
  travado = false,
  onSeguir,
  onAcaoTravado,
}: {
  /** `true` = o contador antigo não validou o TTRT (persona `migra-refem`). */
  travado?: boolean;
  onSeguir?: () => void;
  onAcaoTravado?: () => void;
}) {
  if (travado) {
    return (
      <PainelView
        etapas={ETAPAS_MIGRACAO}
        eyebrow="Sua migração"
        concluidas={1}
        emAndamento={1}
        titulo={{
          normal: "Estamos migrando sua empresa",
          recusa: "A gente assumiu esse problema",
        }}
        sub={{
          normal: "",
          recusa:
            "Seu contador anterior ainda não liberou a transferência no conselho. Isso acontece, e não é você que resolve.",
        }}
        recusa={{
          etapa: 1,
          titulo: "O contador anterior não respondeu",
          motivo:
            "A transferência precisa do aceite dele no conselho. Já acionamos e, se não houver resposta, o próprio conselho destrava — a gente conduz isso do começo ao fim.",
          acao: "Falar com quem está cuidando",
        }}
        onAcaoRecusa={onAcaoTravado}
      />
    );
  }

  return (
    <PainelView
      etapas={ETAPAS_MIGRACAO}
      eyebrow="Sua migração"
      concluidas={2}
      emAndamento={2}
      titulo={{
        normal: "Estamos migrando sua empresa",
        recusa: "A gente assumiu esse problema",
      }}
      sub={{
        normal:
          "A parte chata é com a gente. Você não precisa falar com seu contador antigo — a gente faz isso.",
        recusa: "",
      }}
      prazo="Costuma levar alguns dias, e depende do aceite do seu contador anterior."
      idempotencia="A migração roda uma vez só. Pode fechar o app que o processo segue sozinho, de onde parou."
      ctaNormal={{ label: "Ver o que já dá pra fazer", onClick: onSeguir }}
    />
  );
}

/* ═══════════════════ M5 · EMPRESA MIGRADA ═══════════════════════════════ */

export function MigrarAtivaView({
  regime = "me",
  onSeguir,
}: {
  /** 🆕 04/08 — MEI não tem Fator R: troca o "ganho" de economia por vigilância de limite. */
  regime?: "me" | "mei";
  onSeguir?: () => void;
}) {
  const [entrou, setEntrou] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntrou(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const mei = regime === "mei";

  return (
    <>
      <TelaHeader meta="Pronto" />
      <main className="app-main">
        <Titulo
          sub={
            mei
              ? "Sua contabilidade é nossa a partir de agora. A gente cuida da guia, das notas e do seu limite de faturamento."
              : "A contabilidade da sua empresa é nossa a partir de agora. Você não precisa fazer mais nada com o contador antigo."
          }
        >
          Sua empresa é nossa cliente
        </Titulo>

        <Corpo>
          <div
            style={{
              transform: entrou ? "translateY(0) scale(1)" : "translateY(10px) scale(.96)",
              opacity: entrou ? 1 : 0,
              transition: "transform .5s cubic-bezier(.22,1,.36,1), opacity .4s ease",
            }}
          >
            <Card tom="sucesso">
              <div className="flex items-center gap-2 mb-2">
                <StatusIcon estado="feito" />
                <span className="text-caption font-semibold text-state-success-text">
                  Migração concluída
                </span>
              </div>
              <p className="text-body font-semibold text-text-primary">
                {EMPRESA_MIGRAR.razao}
              </p>
              <p className="text-caption text-text-secondary mt-0.5">
                {EMPRESA_MIGRAR.cnpj}
              </p>
            </Card>
          </div>

          {/* 🔴 04/08 (3ª rodada) — pra ME, NÃO promete número de economia
              aqui: o Fator R real só sai depois que a procuração/API 2
              desbloqueiam (pós-pagamento), não no instante da migração.
              Pra MEI (plano limitado) são as 2 coisas que o plano de fato
              cobre — emitir nota e gerenciar o colaborador. */}
          <div>
            <p className="text-body-strong font-semibold text-text-primary mb-2">
              {mei ? "O que você já pode fazer" : "O primeiro ganho já está na mesa"}
            </p>
            <div className="flex flex-col gap-2">
              {mei ? (
                <>
                  <PassoCard
                    titulo="Emitir sua primeira nota fiscal"
                    texto="Cliente e valor, o resto a gente já sabe do seu cadastro."
                    acao="Emitir agora"
                  />
                  <PassoCard
                    titulo="Cadastrar seu colaborador"
                    texto="A lei permite 1 funcionário com carteira pro MEI. A gente cuida do que precisa."
                    acao="Cadastrar"
                  />
                </>
              ) : (
                <PassoCard
                  titulo="Ver seu Fator R real"
                  texto="A gente confere seus últimos 12 meses de verdade e avisa se dá pra pagar menos. Leva uns dias, não uma tela."
                  acao="Como funciona"
                />
              )}
              <PassoCard
                titulo="Sua próxima guia já é com a gente"
                texto="A gente calcula, gera e te avisa. Você não precisa lembrar de nada."
                acao="Ver o calendário"
              />
              {!mei && (
                <PassoCard
                  titulo="Emitir nota pelo app"
                  texto="Cliente e valor, o resto a gente já sabe do seu cadastro."
                  acao="Emitir agora"
                />
              )}
            </div>
          </div>

          <Card tom="marca">
            <p className="text-caption font-semibold text-text-primary mb-1">
              {mei ? "A gente fica de olho no seu limite" : "A gente fica de olho pra você pagar menos"}
            </p>
            <p className="text-caption text-text-secondary">
              {mei
                ? "Faturamento perto de R$ 81 mil/ano muda tudo pro MEI. A gente acompanha e avisa antes de virar problema."
                : "Seu Fator R muda todo mês, conforme você fatura. A gente acompanha e avisa antes de virar problema, que é exatamente o que não estava acontecendo antes."}
            </p>
          </Card>
        </Corpo>

        <Rodape>
          <Button full onClick={onSeguir}>
            Ir pro meu painel
          </Button>
          <div className="mt-2 flex justify-center">
            <Button variant="ghost">Falar no WhatsApp</Button>
          </div>
        </Rodape>
      </main>
    </>
  );
}

function PassoCard({
  titulo,
  texto,
  acao,
}: {
  titulo: string;
  texto: string;
  acao: string;
}) {
  return (
    <Card>
      <p className="text-caption font-semibold text-text-primary mb-0.5">{titulo}</p>
      <p className="text-micro text-text-secondary">{texto}</p>
      <button className="mt-2 text-caption font-semibold text-action-primary-sm underline underline-offset-4">
        {acao}
      </button>
    </Card>
  );
}
