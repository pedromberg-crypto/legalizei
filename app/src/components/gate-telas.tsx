"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TelaHeader, Aviso, Rolagem } from "@/components/ui/tela";
// 🔄 27/08 — `CUSTOS` saiu junto com a escolha de endereço, que migrou da
// `FaixaView` pro E3.3 (`components/entrada-lead.tsx`).
// 🔁 28/08 — `Aviso` e `brl` voltaram, agora a serviço do gate de teto do MEI.
import { OpcoesLinha, Select, Campo } from "@/components/ui/form";
import { OutrasOpcoes, SheetCnae, encaixeDeResultado, type OpcaoCnae } from "@/components/encaixe";
import { mapear } from "@/lib/mock-veredito";
import { FISCAL, brl } from "@/lib/fiscal";
import { linkWhatsApp } from "@/lib/contato";
import { TETO_MEI_ANUAL, TETO_MEI_MENSAL } from "@/lib/mei";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N4 · GATE — as telas, FONTE ÚNICA
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ EXTRAÍDO de `(wizard)/gate/page.tsx` em 29/07, pelo mesmo motivo do
 * `EntradaView`: a `/apresentacao` tem que renderizar a tela APROVADA, não
 * uma cópia. Cópia diverge em silêncio.
 *
 * Cada tela recebe seu estado por props (controlada). Isso não é ceremônia:
 * é o que permite a demo pré-preencher um cenário com 1 clique sem duplicar
 * a tela, e o que mantém o `/gate` de produção mandando na navegação.
 *
 * Racional das decisões (typewriter, pill que não valida, painel único,
 * thumb zone, fail-fast da triagem, faixa guiada) segue documentado inline.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Colhido do protótipo: atividades reais, não lorem.
 *
 * Frase inteira e em 1ª pessoa, não rótulo de categoria. Este placeholder é a
 * única coisa na tela que responde "o que é uma resposta boa aqui?", e
 * "Fotografia" respondia "uma palavra basta" — o oposto do que a IA precisa
 * pra mapear o CNAE, e do que a caixa grande promete.
 *
 * ⚠️ Só atividade que o MVP ATENDE. "Fisioterapia" estava na lista e saiu: é
 * regulamentada, cai na waitlist. Sugerir no placeholder o que a gente vai
 * recusar 2 telas depois é convidar pra porta fechada.
 */
export const EXEMPLOS = [
  "Faço sites e lojas virtuais para pequenas empresas",
  "Desenvolvo sistemas e aplicativos sob encomenda",
  "Crio logo e identidade visual de marca",
  "Fotografo casamento e ensaio de família",
  "Cuido das redes sociais de uns cinco clientes",
  "Dou consultoria de gestão para dono de pequena empresa",
  "Dou aula particular de inglês online",
  "Edito vídeo para canal do YouTube e para redes",
];

/**
 * Pills de reconhecimento do N4 (14) — derivadas dos 87 CNAEs "atendemos com
 * certeza" (pesquisa/cnae-matriz/cnae-liso-servico.md, fonte primária, 27/08).
 * 🔄 27/08: substitui a v1 (17 categorias/103 CNAEs herdados da Contabilizei,
 * não ratificados). Detalhe completo, CNAE por categoria, e o que mudou vs a
 * v1 (Conserto de veículos e Manutenção de máquinas SAÍRAM — não têm CNAE
 * `liso` na base atual, caem em `verificar-licenciamento`) em
 * `pesquisa/cnae-matriz/taxonomia-pills-n4.md`.
 *
 * 🔴 28/08 — categoria "Recuperação de materiais" (2 CNAEs) SAIU: o eixo de
 * registro setorial nunca tinha rodado nesses 2 códigos especificamente
 * (achado do `cnae-verifica-atende.js`). Seguem pendentes de pesquisa, não
 * descartados — volta se confirmar "não exige registro federal". Ver
 * `pesquisa/cnae-matriz/taxonomia-pills-n4.md` item 7.
 *
 * ⚠️ A pill ESTREITA, não valida (decisão 17/07 → legalize-pill-estreita-nao-valida).
 * Clicar não dá veredito: só afunila o universo pra IA e troca o exemplo do
 * campo. A pessoa AINDA descreve no textarea — é lá que a IA cruza e decide.
 * `ex` é a frase em 1ª pessoa que vira placeholder quando a pill é escolhida.
 */
/**
 * 🆕 02/09 (pedido do Pedro) — máscara do CNAE: `0000-0/00`.
 * São 7 dígitos (4 da classe, 1 do DV, 2 da subclasse — estrutura da CONCLA).
 * Mesmo padrão dos outros campos do app (`mascaraCpf`/`mascaraCep`): só
 * dígitos entram, a pontuação é nossa, e o corte em 7 impede digitar além.
 */
export function mascaraCnae(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 7);
  return d.replace(/(\d{4})(\d)/, "$1-$2").replace(/(\d{4}-\d)(\d{1,2})$/, "$1/$2");
}

export const PILLS = [
  { id: "tech", label: "Tecnologia e software", ex: "Desenvolvo sites, apps ou sistemas sob encomenda" },
  { id: "design", label: "Design", ex: "Crio design gráfico, de interiores ou de produto" },
  { id: "foto", label: "Foto, vídeo e áudio", ex: "Fotografo, filmo e edito vídeo ou áudio" },
  { id: "mkt", label: "Marketing e publicidade", ex: "Cuido das redes sociais e faço publicidade pra clientes" },
  { id: "edicao", label: "Edição e mídia", ex: "Edito livros, jornais ou revistas" },
  { id: "consult", label: "Consultoria, pesquisa e tradução", ex: "Faço consultoria, pesquisa ou tradução pra empresas" },
  { id: "cursos", label: "Ensino e cursos", ex: "Dou aula de idioma, música, dança ou curso profissionalizante" },
  { id: "arte", label: "Arte, cultura e patrimônio", ex: "Produzo teatro, música, ou represento artista e atleta" },
  { id: "eventos", label: "Eventos e entretenimento", ex: "Organizo eventos, festas ou casas de jogos" },
  { id: "admin", label: "Apoio administrativo", ex: "Faço serviços de escritório, cobrança e teleatendimento" },
  { id: "aluguel", label: "Aluguel de equipamentos", ex: "Alugo equipamentos, móveis ou objetos" },
  { id: "reparos", label: "Reparos e manutenção", ex: "Conserto computador, celular, bicicleta ou relógio" },
  { id: "salao", label: "Salão e beleza", ex: "Trabalho com cabelo, manicure e pedicure" },
  { id: "hospedagem", label: "Hospedagem", ex: "Tenho albergue ou pensão" },
];

/**
 * Ritmo do typewriter. Constante nomeada porque é botão de ajuste, e o valor
 * certo é o que dá pra LER — isso não se calcula, se olha.
 * `segura` é o que mais pesa: é o tempo com a frase parada e inteira na tela.
 */
const RITMO = {
  digita: 62, // ms por caractere digitado
  segura: 2800, // ms com a frase completa, antes de começar a apagar
  apaga: 20, // ms por caractere apagado (ninguém lê apagando; some rápido)
};

/**
 * 🔄 01/09 (pedido do Pedro) — AS FAIXAS FORAM REDESENHADAS PRO TETO DO ME.
 *
 * A grade antiga (até 10k · 10-20k · 20-30k · **+30k**) tinha um problema de
 * premissa: a última faixa oferecia justamente o que a Legalizai não atende
 * hoje. O limite do ME é **R$360.000/ano = R$30.000/mês** (LC 123 art. 3º II);
 * acima disso a empresa é EPP, que está fora do escopo. Deixar "+ R$ 30 mil"
 * como opção era convidar alguém a se declarar fora do produto no meio do
 * funil — e a gente decidiu em 01/09 NÃO barrar por faturamento (a ideia é
 * acompanhar o crescimento e propor o desenquadramento depois), então a
 * pergunta não pode ter uma resposta que não leva a lugar nenhum.
 *
 * A grade nova cobre a faixa REAL do ME e termina exatamente no teto. Quem
 * fatura mais que isso usa "Sei o valor exato", que aceita qualquer número —
 * ninguém fica sem resposta possível.
 *
 * `min`/`max` (em R$/mês) não são decoração: é com eles que o gate de teto do
 * MEI se calcula sozinho, em vez de comparar id de faixa na mão — se a grade
 * mudar de novo, o gate acompanha.
 */
/**
 * 🆕 01/09 — teto do ME em R$/mês: R$360 mil/ano (LC 123 art. 3º II) ÷ 12.
 * É o mesmo número que fecha a última faixa e que trava o campo de valor
 * exato — declarar os dois em lugares diferentes seria pedir divergência.
 */
export const TETO_ME_MENSAL = 30000;

export const FAIXAS = [
  /**
   * 🔄 01/09 (pedido do Pedro) — a faixa "Até R$ 5 mil" virou **"Não sei
   * ainda"**. Quem abre a 1ª empresa muitas vezes não tem estimativa, e
   * forçar um número faz a pessoa chutar — chute que depois vira base do
   * pró-labore sugerido e do enquadramento. Resposta honesta vale mais que
   * número inventado.
   *
   * `desconhecida` marca que este cartão não é uma faixa de valor, é a
   * ausência de resposta. Por isso `min`/`max` cobrem tudo o que atendemos
   * (0 a 30k): não dá pra afirmar nada sobre o teto do MEI a partir dela, e o
   * gate precisa ler "incerto", nunca "seguro".
   */
  { id: "nao-sei", label: "Não sei ainda", min: 0, max: 30000, desconhecida: true },
  { id: "5-10k", label: "R$ 5 a 10 mil", min: 5000, max: 10000 },
  { id: "10-20k", label: "R$ 10 a 20 mil", min: 10000, max: 20000 },
  { id: "20-30k", label: "R$ 20 a 30 mil", min: 20000, max: 30000 },
];

/* ─── 🆕 29/08 (pedido do Pedro) — grade de cartões ilustrados pra Faixa de
   faturamento, layout ficava vazio como lista de pills finas. Ícone é PNG
   exportado pelo Pedro (Photoshop), 1 par (coral/creme) por faixa — cédulas
   empilhadas, 1 maço na faixa 1 até 4 maços na faixa 4, canvas/proporção
   travados no Photoshop pra bater entre si. Coral no card claro (fundo
   card-alt), creme no card selecionado (fundo coral sólido). ────────────── */
const ICONES_FAIXA = [
  { coral: "/icones/faixa-1-coral.png", creme: "/icones/faixa-1-creme.png" },
  { coral: "/icones/faixa-2-coral.png", creme: "/icones/faixa-2-creme.png" },
  { coral: "/icones/faixa-3-coral.png", creme: "/icones/faixa-3-creme.png" },
  { coral: "/icones/faixa-4-coral.png", creme: "/icones/faixa-4-creme.png" },
];

function CheckBadgeFaixa() {
  return (
    <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-action-primary-sm">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="m5 12 4 4 8-9" />
      </svg>
    </span>
  );
}

function CardFaixa({
  label,
  nivel,
  selecionado,
  onClick,
}: {
  label: string;
  nivel: number;
  selecionado: boolean;
  onClick: () => void;
}) {
  const icone = ICONES_FAIXA[nivel - 1];
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-colors
        ${
          selecionado
            ? "border-action-primary bg-action-primary"
            : "border-border-hairline bg-surface-card hover:border-border-strong"
        }`}
    >
      {selecionado && <CheckBadgeFaixa />}
      <Image
        src={selecionado ? icone.creme : icone.coral}
        alt=""
        width={67}
        height={67}
        aria-hidden
      />
      <span className={`text-body font-semibold ${selecionado ? "text-text-on-brand" : "text-text-primary"}`}>{label}</span>
    </button>
  );
}

/** 🆕 29/08 — mesma estrutura visual da `CardFaixa` (ícone direto no fundo,
 *  badge de check no canto quando selecionado, troca coral/creme), genérico
 *  pra qualquer par de opções fixas (coorte, regime MEI×ME, etc.) em vez de
 *  uma lista indexada por nível. */
// 🔄 01/09 — exportado: o E9 (pagamento) passou a usar o MESMO card pra
// escolher a forma de pagamento. Mesma pergunta ("escolha um dos dois"),
// mesmo componente — duas gramáticas pro mesmo gesto era inconsistência.
export function CardIconeSelecao({
  label,
  iconeCoral,
  iconeCreme,
  selecionado,
  onClick,
  // 🆕 29/08 (pedido do Pedro) — os prédios de MEI×ME pareciam pequenos perto
  // da prancheta (que usa o padrão de 67px). Fica ajustável por chamada em
  // vez de mudar o default global (a prancheta continua 67).
  tamanho = 67,
}: {
  label: string;
  iconeCoral: string;
  iconeCreme: string;
  selecionado: boolean;
  onClick: () => void;
  tamanho?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-colors
        ${
          selecionado
            ? "border-action-primary bg-action-primary"
            : "border-border-hairline bg-surface-card hover:border-border-strong"
        }`}
    >
      {selecionado && <CheckBadgeFaixa />}
      <Image
        src={selecionado ? iconeCreme : iconeCoral}
        alt=""
        width={tamanho}
        height={tamanho}
        aria-hidden
      />
      <span className={`text-body font-semibold ${selecionado ? "text-text-on-brand" : "text-text-primary"}`}>{label}</span>
    </button>
  );
}

function GradeFaixas({
  selecionada,
  onSelecionar,
}: {
  selecionada: string | null;
  onSelecionar: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {FAIXAS.map((f, i) => (
        <CardFaixa
          key={f.id}
          label={f.label}
          nivel={i + 1}
          selecionado={selecionada === f.id}
          onClick={() => onSelecionar(f.id)}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ARQUÉTIPO A1 — PERGUNTA (o mais comum do flow; N4, N10–N16)
   ───────────────────────────────────────────────────────────────────────── */
export function PerguntaView({
  texto,
  setTexto,
  categoria,
  setCategoria,
  sabeCodigo,
  setSabeCodigo,
  onValidar,
  jaCliente = false,
  semResultados = false,
}: {
  texto: string;
  setTexto: (v: string) => void;
  categoria: string | null;
  setCategoria: (v: string | null) => void;
  /** 🆕 28/07 (reunião Rua Satélite 9): atalho "já sei o número do meu CNAE" —
      pra quem já vem informado, pula descrever/pills e vai direto pra consulta
      na lista validada. Mesma engine (mapear/veredito), só muda o que o campo
      pede e como valida. */
  sabeCodigo: boolean;
  setSabeCodigo: (v: boolean) => void;
  onValidar: () => void;
  /**
   * 🆕 27/08 — a tela atravessou o pagamento (agora é C0, `/dossie/atividade`).
   * O CONTEÚDO é o mesmo, mas o enquadramento não pode ser: antes a gente
   * estava decidindo SE atende, e a copy dizia "validar minha atividade". Quem
   * chega aqui já é cliente e já passou pelo gate (a categoria do E3.3), então
   * prometer validação seria mentir sobre o que a tela faz. Aqui a gente está
   * ACHANDO O CÓDIGO da pessoa, não julgando se ela entra.
   */
  jaCliente?: boolean;
  /**
   * 🆕 02/09 (pedido do Pedro) — a CHEGADA da C0 (nó C0_0 do mapa): a
   * tela "pelada", antes de a pessoa contar o que faz. Some o slot da
   * atividade principal e os 3 cartões de código — não há o que mostrar
   * enquanto ninguém descreveu nada, e mostrar palpite antes da pergunta é
   * fingir que a IA adivinhou.
   *
   * É PROP, não componente novo: o que as duas telas têm em comum (título,
   * categoria, campo, link do código, CTA) é quase tudo. Duplicar o
   * componente faria cada ajuste virar dois, que é o defeito que este projeto
   * passou o dia consertando. 🟡 Em lapidação — a versão vazia vai ganhar
   * conteúdo próprio.
   */
  semResultados?: boolean;
}) {
  const sel = PILLS.find((p) => p.id === categoria);
  /**
   * 🔄 02/09 (pedido do Pedro, 2 rodadas) — A GRADE DE 17 PILLS SAIU.
   *
   * 1ª rodada: chip confirmado + botão "Trocar categoria" que abria o
   * dropdown. 2ª: o Pedro viu e cortou o intermediário — "a visualização em
   * dropdown é mais confortável". O dropdown É a categoria: chega com a
   * escolha do E3.4 dentro dele, e trocar é abrir e escolher outra. Um
   * componente, um gesto, o MESMO que ela já usou lá no E3.4.
   *
   * A lista continua sendo só a validada (as mesmas 17), SEM "não encontrei
   * minha categoria": essa porta é do E3.4, antes do dinheiro. Aqui a pessoa
   * já pagou, e mandar cliente pra waitlist seria beco.
   */
  const tw = useTypewriter(EXEMPLOS, texto.length > 0 || categoria !== null);
  // Pill escolhida troca o exemplo por uma frase fixa da categoria; sem pill,
  // o typewriter cicla exemplos genéricos. O EXEMPLO é o que ensina o campo.
  const placeholder = sabeCodigo ? "Ex: 6201-5/02" : sel ? `Ex: ${sel.ex}` : tw;
  // b1.descricao valida >= 10 caracteres. Espelha o motor exatamente.
  // No modo código, a régua é outra: só precisa parecer um CNAE (dígitos).
  /**
   * 🔄 02/09 (pedido do Pedro: "sem scroll, aumente até que não precise")
   * — o campo CRESCE com o texto em vez de rolar por dentro. Rolagem dentro
   * de um campo de 2 linhas esconde o que a pessoa acabou de escrever, e é
   * justamente a descrição que a IA vai usar pra achar o CNAE.
   *
   * Base = 3 linhas; daí em diante acompanha o conteúdo. O teto existe porque
   * o shell é 100dvh (`.app-page`): sem ele, um texto longo empurraria o CTA
   * pra fora da tela. Só ao bater no teto volta a haver rolagem interna.
   */
  const areaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const TETO = 240;
    el.style.height = "auto";
    // Campo vazio: quem ocupa espaço é o PLACEHOLDER, e `scrollHeight` não o
    // enxerga — o exemplo da categoria tem 2 linhas e apareceria cortado.
    // Mede com ele dentro e devolve. Atribuir `value` direto não dispara
    // evento nem mexe no estado do React.
    if (el.value === "" && el.placeholder) {
      el.value = el.placeholder;
      el.style.height = `${Math.min(el.scrollHeight, TETO)}px`;
      el.value = "";
      return;
    }
    el.style.height = `${Math.min(el.scrollHeight, TETO)}px`;
    el.style.overflowY = el.scrollHeight > TETO ? "auto" : "hidden";
  }, [texto, sabeCodigo, placeholder]);

  /**
   * 🔒 02/09 (achado do Pedro) — OS RESULTADOS CONGELAM NA BUSCA.
   *
   * Antes eles saíam de `mapear(texto)` ao vivo: mudavam a cada tecla, e a
   * escolha da pessoa caía do slot no meio da digitação. Ninguém decidiu isso,
   * era efeito de não existir uma "busca" de verdade — e é mentira sobre o
   * produto real, onde a IA roda quando alguém pede, não a cada letra.
   *
   * Agora a lista é da ÚLTIMA BUSCA. Mexeu na descrição ou na categoria depois
   * dela? O resultado na tela está velho, e o CTA passa a oferecer buscar de
   * novo em vez de continuar — que é a resposta pra pergunta do Pedro ("e se
   * ela quiser pesquisar outra coisa, como faz?").
   */
  /* 🐛 02/09 (teste do Pedro: "selecionei um cnae, digitei no campo e o CTA
     não virou nova busca") — a busca nascia `null` e só ganhava valor em quem
     passava pela chegada. Entrando direto na C0 não havia baseline, então
     nada nunca ficava desatualizado. Agora ela nasce com o estado do primeiro
     render: o que está na tela ao chegar É o resultado corrente. */
  const [busca, setBusca] = useState<{ texto: string; categoria: string | null }>(() => ({
    texto,
    categoria,
  }));
  // 🧪 02/09 (teste do Pedro) — 5 sugestões em vez de 3. Sobrou espaço
  // depois que a tela enxugou, e a rolagem com degradê já sinaliza que há
  // mais embaixo. No modo código a lista some, então lá sobra ainda mais.
  const encaixe = encaixeDeResultado(mapear(busca.texto), 4);
  const desatualizado = texto !== busca.texto || categoria !== busca.categoria;
  /**
   * 🆕 02/09 (pedido do Pedro) — a escolha do CNAE JÁ NASCE FEITA, no
   * "+ compatível". A tela não pergunta "qual desses?": ela mostra o que a
   * IA achou, já marcado, e deixa trocar quem discorda. Quem descreveu a
   * atividade não tem como julgar entre 3 códigos parecidos, e obrigar essa
   * decisão é devolver pro cliente o trabalho que a gente vende.
   *
   * Reseta junto com o resultado: se a descrição muda, o recomendado muda, e
   * manter marcado um código da resposta anterior seria mentira silenciosa.
   */
  const [escolha, setEscolha] = useState<string | null>(null);
  /**
   * 🔄 02/09 (2ª rodada, ideia do Pedro) — A ESCOLHA COMEÇA VAZIA.
   *
   * Antes o "+ compatível" já vinha marcado em coral. Ficou ambíguo: a pessoa
   * não sabia se aquilo era uma escolha dela ou uma informação nossa, e o
   * sheet virou um segundo lugar pra escolher a mesma coisa. Agora tem um
   * SLOT vazio no topo ("Escolha sua atividade principal") e os códigos
   * embaixo, nenhum marcado: clicar num cartão SOBE ele pro slot, clicar em
   * outro troca. O gesto passa a ser óbvio e existe num lugar só.
   *
   * 🔒 02/09 (3ª rodada, decisão do Pedro) — BUSCA NOVA ESVAZIA O SLOT.
   * O resultado velho não sobrevive a uma pesquisa nova: manter no slot um
   * código que veio de outra descrição é afirmar que ele ainda é a melhor
   * resposta pro que a pessoa acabou de escrever, e ninguém verificou isso.
   * Ela reescolhe entre os novos, que é justamente o que ela pediu ao buscar.
   */
  const escolhido = escolha;
  const opcoes = [encaixe.recomendado, ...encaixe.alternativas];
  const principal = opcoes.find((o) => o.cnae === escolhido) ?? null;
  /**
   * 🆕 02/09 (pedido do Pedro) — escolher ROLA DE VOLTA PRO SLOT.
   *
   * Com 5 sugestões a lista rola, e quem escolhe a última fica olhando pro
   * fim da lista: o cartão sai de onde estava e reaparece no topo, fora da
   * vista. Sem a rolagem, o gesto parece não ter feito nada — ou pior, parece
   * ter APAGADO a opção, já que ela some da lista.
   *
   * `requestAnimationFrame` porque o slot só existe depois do render que a
   * escolha dispara.
   */
  const slotRef = useRef<HTMLDivElement>(null);
  const escolherCnae = (cnae: string) => {
    setEscolha(cnae);
    requestAnimationFrame(() =>
      slotRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };
  // 🆕 02/09 — qual CNAE está com o sheet de detalhes aberto.
  const [detalhe, setDetalhe] = useState<OpcaoCnae | null>(null);

  const sub = sabeCodigo
    ? jaCliente
      ? "A gente confirma se é esse mesmo e segue com ele."
      : "A gente confere se ele está na nossa lista de atendidos."
    : jaCliente
      ? null
      : "Acha o que mais parece. Depois conta do seu jeito.";

  /**
   * 🔒 02/09 (decisão do Pedro) — DESCREVER DEIXOU DE SER OBRIGATÓRIO.
   *
   * A régua era 10 caracteres de descrição. Só que a categoria já foi
   * respondida lá no E3.4, antes de pagar, e ela sozinha já estreita o
   * universo: quem não souber o que escrever aperta e recebe as 3 atividades
   * MAIS USADAS da categoria dele. A descrição vira refinamento, não pedágio.
   * Travar um cliente que já pagou num campo de texto livre é cobrar dele o
   * trabalho que a gente vende.
   *
   * Por momento: na chegada (C0.0) basta ter categoria; com os códigos na
   * tela, o que o botão pede é a escolha do slot, que é o que ele promete
   * ("Continuar com essa atividade").
   */
  const podeValidar = sabeCodigo
    // 🔄 02/09 — com a máscara, a régua vira o código COMPLETO: 7 dígitos
    // (4 da classe + DV + 2 da subclasse). Antes eram 6, quando o campo era
    // livre e não dava pra saber o que a pessoa tinha digitado.
    ? texto.replace(/\D/g, "").length === 7
    : semResultados || desatualizado
      ? categoria !== null
      : escolhido !== null;

  /* 🗑️ 02/09 — o scroll-fade daqui (scRef + ResizeObserver + mask) morreu
     junto com a grade de pills: era ele que desbotava a ponta da lista quando
     ainda havia categoria pra rolar. Sem lista, não há o que desbotar. */

  return (
    <>
      {/* Título/subtítulo fixos; o campo de descrição ocupa a sobra. Depende
          do shell travado em 100dvh (.app-page, globals.css) — sem o teto, a
          página inteira cresce em vez de o campo se ajustar. */}
      <div className="flex-1 min-h-0 flex flex-col">
        {/* 🗑️ 02/09 (pedido do Pedro) — a C0 perdeu o subtítulo pra
            liberar altura: "Conta do seu jeito. A gente acha o código que
            combina com isso." explicava um mecanismo que a própria tela já
            mostra desde que os cartões de CNAE passaram a viver nela. Os
            outros 3 contextos (modo código, e o uso pré-pagamento) seguem com
            o deles — lá ainda não há resultado na tela pra falar sozinho. */}
        <h1 className={`text-h1 ${sub ? "mb-2" : "mb-4"}`}>
          {sabeCodigo ? "Qual o número do seu CNAE?" : "O que você faz?"}
        </h1>
        {sub && <p className="text-body text-text-secondary mb-4">{sub}</p>}

        {/* 🗑️ 02/09 (pedido do Pedro) — O PAINEL CINZA SAIU.
            Ele existia (28/07, redesign v2) pra AGRUPAR a grade de 17 pills
            com o textarea: eram muitos elementos soltos, e o cartão dava
            unidade. Com as pills fora, sobrou um cartão em volta de dois
            campos — cinza sem função, e diferente de todo o resto do wizard,
            que põe campo direto no fundo claro. Agora a tela usa o mesmo
            `Campo` do C1/C4/E3.4: rótulo, campo, nada em volta. */}
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          {/* 🧪 02/09 (pedido do Pedro, passo 2) — AS 3 OPÇÕES DE CNAE
              NA PRÓPRIA TELA. Primeiro ensaio da fusão da C0.2 (CNAE
              encontrado) aqui dentro: em vez de a pessoa mandar descrever,
              esperar e trocar de tela pra ver o veredito, o que a IA acha
              aparece na faixa que abrimos no passo 1.

              Cartões REUSADOS do veredito (`OutrasOpcoes`, `encaixe.tsx`) —
              mesmo desenho que já roda na C0.2, com o nome humano, o código,
              a etiqueta fiscal e o % de encaixe. Nada de card novo: se o
              veredito vai morar aqui, ele tem que ser o MESMO veredito.

              🔴 Só visualização, a pedido: os cartões não clicam e não
              escolhem nada ainda. Os dados saem do `mapear()` (mock de sempre)
              cruzado com o texto — com o campo vazio, cai no exemplo padrão.
              Falta decidir com o Pedro: aparece enquanto digita ou só depois
              do CTA, e o que o CTA vira quando o resultado já está na tela. */}
          {semResultados ? (
            /* 🆕 02/09 (pedido do Pedro) — a faixa reservada dos resultados
               deixa de ser um buraco e passa a dizer pra que ela serve. Texto
               grande (display, 32px), no ink da marca, com "atividade
               principal" em coral: é o único termo da frase que a pessoa vai
               reencontrar no slot logo abaixo, então destacar ele amarra a
               promessa ao lugar onde ela se cumpre.
               A fonte é Sora por herança — ela é a fonte do sistema inteiro
               desde 12/07, então não há nada a declarar aqui. */
            <div className="flex min-h-0 flex-1 flex-col justify-center">
              <p className="text-display text-text-primary">
                Aqui é onde você escolhe a{" "}
                <span className="text-action-primary-sm">atividade principal</span> com
                que trabalha.
              </p>
              {/* 🆕 02/09 (pedido do Pedro) — tira o peso da palavra
                  "principal". Quem faz três coisas trava aqui achando que
                  precisa escolher UMA e perder as outras, e essa é a hora de
                  dizer que não.
                  ⚠️ "logo depois", não "na próxima tela": as secundárias (C5)
                  estão a 3 passos daqui (C0.2 → C0.3 → C5). Cravar a posição
                  seria falso hoje, e voltaria a ficar falso a cada mudança de
                  ordem do flow. */}
              <p className="mt-3 text-body text-text-secondary">
                Se você faz mais de uma coisa, fica tranquilo: logo depois dá
                pra incluir as atividades secundárias.
              </p>
            </div>
          ) : (
          <Rolagem className="min-h-0 flex-1">
            {/* 🆕 02/09 (ideia do Pedro) — O SLOT DO PRINCIPAL.
                Um lugar de chegada, vazio e pontilhado, com o nome do que
                falta. O contorno tracejado é a convenção de "cabe algo aqui"
                e diz, sem texto extra, que a tela ainda espera uma ação —
                coisa que o cartão pré-marcado não dizia. Preenchido, ele é o
                MESMO cartão coral, agora inequivocamente uma escolha dela. */}
            <div ref={slotRef} className="scroll-mt-1">
            <p className="text-micro text-text-tertiary mb-2">Sua atividade principal</p>
            {principal ? (
              <OutrasOpcoes
                titulo=""
                alternativas={[principal]}
                escolhido={principal.cnae}
                // 🐛 02/09 — a pill sumia quando o cartão subia: o slot não
                // recebia `pillDe`, só a lista de baixo. Mesma regra dos dois
                // lados, senão o cartão perde informação ao ser escolhido.
                pillDe={(o) =>
                  o.cnae === encaixe.recomendado.cnae ? "+ compatível" : "compatível"
                }
                onVerDetalhes={setDetalhe}
              />
            ) : (
              <div className="flex min-h-[62px] items-center justify-center rounded-2xl border border-dashed border-border-strong px-3 py-4">
                <p className="text-caption text-text-muted">
                  Escolha sua atividade principal, é só selecionar
                </p>
              </div>
            )}
            </div>

            {/* Os que ainda não foram escolhidos. Quem sobe pro slot sai
                daqui, então a lista nunca mostra o mesmo código duas vezes —
                é a "troca" que o Pedro descreveu. */}
            <OutrasOpcoes
              titulo={principal ? "Trocar por" : "O que mais se encaixa"}
              alternativas={opcoes.filter((o) => o.cnae !== escolhido)}
              // O recomendado se distingue pelo "+"; os outros seguem
              // marcados como compatíveis, que é o que eles são.
              pillDe={(o) =>
                o.cnae === encaixe.recomendado.cnae ? "+ compatível" : "compatível"
              }
              onEscolher={escolherCnae}
              onVerDetalhes={setDetalhe}
            />
          </Rolagem>
          )}

          {!sabeCodigo && (
            <Campo rotulo="Sua categoria">
              <Select
                valor={categoria ?? ""}
                onChange={(v) => setCategoria(v || null)}
                opcoes={PILLS.map((p) => ({ v: p.id, label: p.label }))}
                placeholder="Escolhe uma categoria"
                valorEmDestaque
              />
            </Campo>
          )}

          {/* O campo de descrição herda a sobra que era da lista de pills: é
              o trabalho real desta tela, e campo grande convida a escrever
              mais, que é exatamente o que a IA usa. */}
          {/* 🔄 02/09 — o campo parou de esticar. Ele herdou a sobra
              quando a lista de pills saiu; agora a sobra é do vazio acima, e
              o campo tem piso de 3 linhas e cresce com o texto. */}
          <div className="flex shrink-0 flex-col">
            <p className="text-caption font-semibold text-text-primary">
              {sabeCodigo ? "Número do CNAE" : "O que você faz na prática"}
            </p>
            <div className="relative mt-1.5">
              {sabeCodigo ? (
                /* Código não é texto livre: 1 linha, teclado numérico e a
                   pontuação por nossa conta. Textarea aqui deixava dar enter
                   e colar parágrafo num campo de 7 dígitos. */
                <input
                  value={texto}
                  onChange={(e) => setTexto(mascaraCnae(e.target.value))}
                  inputMode="numeric"
                  placeholder={placeholder}
                  className="block min-h-12 w-full rounded-md border border-border-hairline
                             bg-surface-card px-4 pr-9 text-body text-text-primary
                             placeholder:text-text-muted focus:border-border-focus focus:outline-none"
                />
              ) : (
              <textarea
                ref={areaRef}
                // 🔄 02/09 (pedido do Pedro) — piso de 3 linhas. Cresce daí.
                rows={3}
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder={placeholder}
                // 🐛 02/09 (achado do Pedro: "parece mais redonda que o
                // dropdown") — estava `rounded-xl` (24px). TODO campo do DS
                // usa `rounded-md` (12px): Texto, Select, Checkbox, opção.
                className="block w-full resize-none rounded-md border border-border-hairline
                           bg-surface-card p-4 pr-9 text-body text-text-primary
                           placeholder:text-text-muted focus:border-border-focus focus:outline-none"
              />
              )}
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

        {/* Microcopy que ENSINA, não pune (UX-16).
            🗑️ 02/09 (pedido do Pedro) — saiu o "Boa. Agora conta um pouco
            mais pra gente confirmar.", que aparecia assim que a categoria
            estava escolhida. Ela CHEGA escolhida do E3.4: elogiar uma escolha
            que a pessoa não fez aqui, e pedir mais, antes de ela digitar
            qualquer coisa, é ruído. A linha que corrige de verdade (texto
            curto demais) continua. */}
        {/* 🔄 02/09 — a linha que cobrava "conta um pouco mais" saiu do
            estado de chegada: descrever deixou de ser obrigatório, então
            cobrar texto seria contradizer o botão, que já libera. No lugar,
            a chegada diz o que acontece se a pessoa não escrever nada. */}
        <p className="text-caption text-text-tertiary mt-2 min-h-[1.25rem]">
          {/* 🗑️ 02/09 (pedido do Pedro) — "Formato: 0000-0/00" saiu: a
              máscara já mostra o formato enquanto a pessoa digita, e repetir
              em texto é explicar o que está acontecendo na frente dela. */}
          {sabeCodigo
            ? ""
            : semResultados && texto.trim().length === 0
              ? "Se não escrever, sugerimos as atividades mais usadas da categoria."
              : ""}
        </p>

        {/* 🆕 28/07: CTA discreto do atalho — não compete com o CTA principal
            (texto pequeno, sublinhado, sem fill). */}
        <button
          onClick={() => {
            setSabeCodigo(!sabeCodigo);
            setTexto("");
            // 🔒 31/08, mantido 02/09 — a categoria veio do gate (E3.4), não é
            // escolha desta tela: alternar pro modo código não pode apagá-la.
            // Voltando pra descrição, ela ainda está lá.
          }}
          className="mt-2 self-center text-caption font-medium text-text-secondary underline underline-offset-4"
        >
          {sabeCodigo ? "Prefiro descrever o que faço" : "Já sei o número do meu CNAE"}
        </button>
      </div>

      {/* ⚠️ O sheet mora FORA da `Rolagem`: ele é `absolute inset-0` e, se
          ficasse dentro do contêiner que rola, seria recortado por ele em vez
          de cobrir a tela. */}
      {detalhe && <SheetCnae opcao={detalhe} onFechar={() => setDetalhe(null)} />}

      {/* 🌾 CTA no rodapé = thumb zone (design-system.md §6) */}
      <div className="app-footer-cta">
        {/* Um CTA, três trabalhos, decididos pelo estado da tela: buscar
            (chegada), buscar DE NOVO (mexeu em algo depois da última busca) e
            seguir com a atividade escolhida. */}
        <Button
          full
          onClick={() => {
            if (semResultados) {
              setBusca({ texto, categoria });
              setEscolha(null);
              onValidar();
              return;
            }
            if (desatualizado) {
              setBusca({ texto, categoria });
              // Busca nova, slot limpo: ver o comentário do `escolhido`.
              setEscolha(null);
              return;
            }
            onValidar();
          }}
          disabled={!podeValidar}
        >
          {/* 🔄 02/09 (pedido do Pedro) — era "Achar meu CNAE", e ficou
              mentiroso quando o veredito passou a morar nesta tela: o CNAE já
              está achado, na tela, marcado. O botão agora nomeia o que vai
              acontecer, que é o canal mais barato pra dizer "o cartão coral é
              o que vai no seu CNPJ" — sem gastar uma linha de texto na tela. */}
          {/* 🆕 02/09 (pedido do Pedro) — o rótulo segue o momento: na CHEGADA
              (C0.0) ainda não existe atividade nenhuma na tela, então o botão
              pede a busca; depois que os códigos aparecem e um está no slot,
              ele confirma a escolha. */}
          {semResultados
            ? "Buscar atividade principal"
            : desatualizado
              ? "Buscar de novo"
              : jaCliente
                ? "Continuar com essa atividade"
                : "Validar minha atividade"}
        </Button>
      </div>
    </>
  );
}

function IconeX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ARQUÉTIPO A7 (variação curta) — ESPERA
   🌾 colhido: o loading EXPLICA. "Analisando o que você faz…" em vez de spinner mudo.
   ───────────────────────────────────────────────────────────────────────── */
export function AnalisandoView() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="flex gap-1.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-action-primary animate-bounce"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
      <p className="text-body text-text-secondary" role="status">
        Analisando o que você faz…
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   🆕 TRIAGEM (UX-21 fail-fast) — não existia no protótipo.
   Nasce da reordenação: com cobrança no N9, o que mata a elegibilidade tem
   que ser perguntado ANTES do dinheiro. Espelha b1.triagem do motor.

   🔓 24/08 (reunião Leonan 19/08) — LIMITE SUBIU DE 2 PRA 4. O Leonan validou
   que empresa pequena com 3-4 sócios acontece (raro acima disso); o que trava
   de verdade lá na frente não é o número em si, é que TODOS precisam assinar
   (GOV.BR/e-CAC) na Constituição. Aviso PROATIVO (não bloqueio) avisa da
   assinatura de todos quando são 3-4 sócios.

   🔒 29/08 (pedido do Pedro, decisão de negócio travada) — os 3 gates que
   existiam aqui (5+ sócios · sócio via CNPJ · sócio no exterior) DEIXARAM DE
   SER PERGUNTA. Viraram fato/lembrete, sem bloqueio nenhum:
     · Sócio via CPF/CNPJ e sócio no exterior nunca foram ESCOLHA de verdade
       — quem chegou até aqui já escolheu Simples Nacional lá atrás (E3.2), e
       o Simples só aceita sócio pessoa física domiciliado no Brasil. Não é
       uma pergunta que pode dar 2 respostas úteis: é consequência de uma
       decisão anterior. Por isso virou 1 aviso sutil só, não 2 perguntas.
     · O seletor de quantidade passou a ir só até 4 ("Eu + 3") — a opção "5+"
       foi REMOVIDA do produto, não só escondida. Sem ela, o gate de 5+ sócios
       fica estruturalmente inalcançável (não existe input que dispare).
   ⚠️ Efeito colateral ACEITO pelo Pedro: a checagem ativa de "sócio no
   exterior" (fail-fast, UX-21) deixa de existir. Antes, dizer "sim" aqui
   bloqueava ANTES do pagamento; agora é só um lembrete, e ninguém confere a
   resposta. Se um sócio no exterior passar batido, só aparece como problema
   real mais na frente (contrato social/CRC). Risco assumido conscientemente,
   não descoberto depois.
   ───────────────────────────────────────────────────────────────────────── */
export function TriagemView({
  socios,
  setSocios,
  onSeguir,
  coorte,
  setCoorte,
  simularSocioNaoAtende = false,
}: {
  socios: number | null;
  setSocios: (n: number) => void;
  onSeguir: () => void;
  /**
   * 🆕 26/08 (pedido do Pedro) — 3ª realocação da pergunta "é a primeira
   * empresa que você abre?": E6 → E5F (24/08) → Veredito (26/08, 1ª tentativa)
   * → aqui, dentro da própria Triagem, junto das outras "perguntas rápidas"
   * (era isso que o Pedro queria desde o início — "na verdade eu queria nela
   * e não no veredito"). Opcional (dado puro de log/marketing, UX-48).
   */
  coorte?: "primeira" | "ja-abri" | null;
  setCoorte?: (v: "primeira" | "ja-abri") => void;
  /**
   * 🆕 31/08 (pedido do Pedro) — `?simular=socio-nao-encaixa` PRÉ-ABRE o
   * escape hatch (E5T.1) pra prévia ao vivo do `/mapa`. Mesmo mecanismo do
   * E3.4.1 (`simularFilaCidade`): o estado JÁ existia e era alcançável no app
   * real (link "Meu sócio não atende um dos critérios"), mas o nó do mapa não
   * tinha `rota`, então a prévia renderizava um card vazio. NÃO é fluxo real.
   */
  simularSocioNaoAtende?: boolean;
}) {
  const solo = socios === 1;
  const temSocio = socios !== null && !solo;
  // 🆕 29/08 (pedido do Pedro) — escape hatch pra quem NÃO se encaixa nos
  // checks de "Vale saber" (sócio no exterior, via CNPJ, etc.): não é mais
  // pergunta obrigatória, mas quem sabe que o próprio caso foge da regra
  // ainda consegue avisar e falar com um humano, em vez de só continuar
  // como se nada fosse.
  const [socioNaoAtende, setSocioNaoAtende] = useState(!!simularSocioNaoAtende);
  const [resolvidoInline, setResolvidoInline] = useState(false);
  // 🔄 29/08 (pedido do Pedro) — "é a primeira empresa que você abre?" vira
  // obrigatória. Só entra na conta quando a pergunta de fato aparece (função
  // recebeu `setCoorte`) — sem isso, quem não usa essa prop nunca travaria.
  /**
   * 🆕 01/09 (pedido do Pedro, reunião Rua Satélite 42) — QUEM ADMINISTRA,
   * agora também aqui, logo depois de escolher a quantidade de sócios.
   *
   * ⚠️ Versão BINÁRIA de propósito: neste ponto do flow ainda não existem os
   * nomes dos sócios (só são coletados no C3, pós-pagamento), então não dá
   * pra oferecer a escolha nome a nome. O refinamento por nome continua no
   * C3; aqui a pessoa só diz se administra sozinha ou com os sócios.
   *
   * Só aparece com sócio: dono único é administrador por definição.
   */
  const [administracao, setAdministracao] = useState<"so-eu" | "com-socios" | null>(null);
  const completo =
    socios !== null &&
    (!setCoorte || coorte !== null) &&
    (!temSocio || administracao !== null);

  return (
    <>
      {/* Título FIXO (padrão de 3 partes: título fixo / corpo rola / CTA fixo).
          🔒 29/08 — voltou a ser só 1 pergunta de verdade (quantidade); o
          resto virou lembrete, não pergunta. */}
      <div className="shrink-0">
        <h1 className="text-h1 mb-2">Perguntas rápidas</h1>
        <p className="text-body text-text-secondary mb-6">
          Rápido, só o essencial antes da gente continuar.
        </p>
      </div>

      <Rolagem>
        <p className="text-body-strong font-semibold mb-3">
          Quantas pessoas vão ser donas da empresa?
        </p>
        <div className="flex gap-2 mb-8">
          {/* 🔒 29/08 (pedido do Pedro, decisão travada) — teto vira 4
              (era 1-5 com "5+"). A opção de 5+ sócios SAI do produto, não só
              da tela — sem ela, o gate de 5+ sócios não tem como disparar. */}
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setSocios(n)}
              className={`flex-1 min-h-12 rounded-md border text-body font-semibold transition-colors
                ${
                  socios === n
                    ? "border-action-primary bg-action-primary text-text-on-brand"
                    : "border-border-hairline bg-surface-card text-text-secondary hover:border-border-strong"
                }`}
            >
              {/* 🔄 29/08 (pedido do Pedro) — "2" sozinho confundia (parecia
                  "eu + 2 pessoas", quando na verdade a pessoa JÁ conta como
                  1 sócio). "Eu + N" deixa claro que o número é o TOTAL,
                  incluindo quem está respondendo. */}
              {n === 1 ? "Só eu" : `Eu + ${n - 1}`}
            </button>
          ))}
        </div>

        {/* 🔒 29/08 (pedido do Pedro, decisão travada) — substitui as 2
            perguntas antigas (CPF×CNPJ + mora fora do Brasil). Não é mais
            pergunta: quem chegou aqui já escolheu Simples Nacional lá atrás
            (E3.2), e o Simples só aceita sócio pessoa física domiciliado no
            Brasil — não tem 2ª resposta possível, é consequência da escolha
            anterior, não uma decisão nova. Vira lembrete sutil, sem bloqueio. */}
        {/* 🆕 29/08 (pedido do Pedro) — mesmo cartão do lado "tem sócio",
            reassegurando quem escolheu "Só eu": sozinho é a norma, não a
            exceção. */}
        {solo && (
          <div className="mb-8 rounded-md border border-border-hairline bg-surface-card p-4">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-state-success-tint text-state-success-text">
                <CheckMiniRegime />
              </span>
              <p className="text-caption text-text-secondary">
                É o mais comum entre os prestadores de serviço. Se um dia você
                quiser ter sócio, dá pra incluir depois, já com a empresa em
                pé.
              </p>
            </div>
          </div>
        )}

        {/* 🔄 29/08 (pedido do Pedro) — mesmo padrão visual do card de
            check-list usado em `MeiOuMeView` (ícone verde + texto), não mais
            um bloco de aviso solto. */}
        {temSocio && (
          <div className="mb-8 rounded-md border border-border-hairline bg-surface-card p-4">
            <p className="text-body-strong font-bold text-text-primary mb-2">
              Vale saber
            </p>
            <div className="flex flex-col gap-1.5">
              {[
                socios === 2 ? "Seu sócio precisa morar no Brasil" : "Seus sócios precisam morar no Brasil",
                socios === 2
                  ? "Seu sócio entra só com CPF, não CNPJ"
                  : "Seus sócios entram só com CPF, não CNPJ",
                // 🔄 29/08 (pedido do Pedro) — era um aviso separado, só a
                // partir de 3 sócios. Vale desde o 1º sócio (a assinatura de
                // todos é sempre necessária, não só com grupo maior), então
                // virou 3º check da mesma lista.
                socios === 2
                  ? "Seu sócio vai assinar (GOV.BR) na hora de constituir a empresa"
                  : "Seus sócios vão assinar (GOV.BR) na hora de constituir a empresa",
              ].map((texto) => (
                <div key={texto} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-state-success-tint text-state-success-text">
                    <CheckMiniRegime />
                  </span>
                  <p className="text-caption text-text-secondary">{texto}</p>
                </div>
              ))}
            </div>

            {/* 🆕 29/08 (pedido do Pedro) — mesmo padrão de link do gate de
                atividade (E3.4, "Minha atividade não está na lista"): quem
                não se encaixa em algum dos checks avisa aqui, sem precisar
                de pergunta obrigatória pra todo mundo. */}
            {!socioNaoAtende && (
              <button
                onClick={() => setSocioNaoAtende(true)}
                className="mt-3 self-start text-caption font-medium text-text-secondary underline underline-offset-4"
              >
                Meu sócio não atende um dos critérios
              </button>
            )}

            {socioNaoAtende && !resolvidoInline && (
              <div className="mt-3 rounded-md bg-state-info-tint p-4">
                <p className="text-caption text-text-secondary">
                  Sem problema. Esse caso a Legalize Digital atende pela
                  contabilidade tradicional, fora do produto automatizado.
                </p>
              </div>
            )}

            {resolvidoInline && (
              <div className="mt-3 rounded-md bg-state-success-tint p-4">
                <p className="text-body-strong font-semibold text-state-success-text mb-1">
                  Combinado, já anotamos
                </p>
                <p className="text-caption text-text-secondary">
                  Nosso time da Legalize Digital vai entrar em contato pra
                  seguir pela contabilidade tradicional.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 🆕 01/09 (pedido do Pedro) — quem administra. Fica logo abaixo do
            "Vale saber", ainda no bloco de sócios, porque é consequência
            direta da resposta anterior: escolheu ter sócio, precisa dizer
            quem manda. Pré-pagamento porque a resposta vira a qualificação de
            cada um no DBE (49 sócio-administrador × 22 sócio) e a cláusula de
            administração do contrato — quanto antes estiver decidido, menos
            retrabalho lá na frente.

            🔴 NÃO existe pergunta de assinatura isolada × conjunta, e é
            decisão travada (RS42): o contrato PADRÃO da Junta não tem esse
            campo, e inserir cláusula própria tira o processo do padrão e
            manda pra análise humana. */}
        {temSocio && (
          <div className="mt-8">
            <p className="text-body-strong font-semibold mb-1">
              Quem vai administrar a empresa?
            </p>
            {/* ✍️ 01/09 (pedido do Pedro) — texto anterior tinha 3 ideias em
                4 linhas: o que é administrar, exemplos, e o que acontece com
                quem não administra. Ficou só a 1ª, que é a única que a pessoa
                precisa pra responder. A tranquilização ("continua sócio") foi
                pra baixo, na consequência da opção "Só eu", que é exatamente
                onde a dúvida nasce. */}
            <p className="text-caption text-text-secondary mb-3">
              Quem administra assina pela empresa: banco, cartório, contratos.
            </p>
            <OpcoesLinha
              opcoes={[
                { v: "so-eu" as const, label: "Só eu" },
                {
                  v: "com-socios" as const,
                  // ✍️ 01/09 (pedido do Pedro) — concorda com a quantidade
                  // escolhida logo acima: "Eu + 1" é UM sócio. Plural onde só
                  // existe um sócio soa a texto genérico, e a pessoa acabou de
                  // dizer quantos são.
                  label: socios === 2 ? "Eu e meu sócio" : "Eu e meus sócios",
                },
              ]}
              valor={administracao}
              onChange={setAdministracao}
            />
            {/* A consequência só da opção escolhida — as duas ao mesmo tempo
                virariam aula de direito societário no meio da triagem. */}
            {administracao === "so-eu" && (
              <p className="text-micro text-text-tertiary mt-2">
                Você resolve tudo sozinho.{" "}
                {socios === 2
                  ? "Seu sócio continua sócio e participa dos resultados."
                  : "Seus sócios continuam sócios e participam dos resultados."}
              </p>
            )}
            {administracao === "com-socios" && (
              <p className="text-micro text-text-tertiary mt-2">
                Cada um pode assinar sozinho. Alguns bancos pedem todos juntos
                pra abrir a conta.
              </p>
            )}
          </div>
        )}

        {/* 🆕 26/08 — 3ª realocação da coorte (Veredito → aqui, junto das
            outras perguntas rápidas). Dado puro de marketing/log, opcional,
            não interfere no processo.
            🔄 29/08 (pedido do Pedro) — ganhou ilustração (mesmo padrão da
            `GradeFaixas`: ícone direto no fundo do card, sem círculo, troca
            coral/creme conforme seleção, badge de check no canto). Prancheta
            rala (1 check) = primeira vez; prancheta cheia (3 checks) = já
            abriu antes. */}
        {setCoorte && (
          <div className="mt-8">
            <p className="text-body-strong font-semibold mb-1">
              É a primeira empresa que você abre?
            </p>
            <p className="text-caption text-text-secondary mb-3">
              Ajuda a gente a te acompanhar do jeito certo.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <CardIconeSelecao
                label="É a primeira"
                iconeCoral="/icones/coorte-primeira-coral.png"
                iconeCreme="/icones/coorte-primeira-creme.png"
                selecionado={coorte === "primeira"}
                onClick={() => setCoorte("primeira")}
              />
              <CardIconeSelecao
                label="Já abri antes"
                iconeCoral="/icones/coorte-ja-abri-coral.png"
                iconeCreme="/icones/coorte-ja-abri-creme.png"
                selecionado={coorte === "ja-abri"}
                onClick={() => setCoorte("ja-abri")}
              />
            </div>
          </div>
        )}

      </Rolagem>

      <div className="app-footer-cta">
        {socioNaoAtende ? (
          <Button
            full
            variant="dark"
            disabled={resolvidoInline}
            onClick={() => setResolvidoInline(true)}
          >
            {resolvidoInline ? "Combinado" : "Falar com o time"}
          </Button>
        ) : (
          <Button full onClick={onSeguir} disabled={!completo}>
            Continuar
          </Button>
        )}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   🆕 FAIXA de faturamento — alimenta o teaser do N5.
   ⚠️ Faixa guiada segue sendo o DEFAULT (spec): campo aberto sozinho trava
   quem está estimando. Sem perguntar margem (UX-51).

   🆕 17/07 — "eles já sabem o número" (provocação do Pedro, e ele é o caso):
   boa parte do nicho é PJ-ização — a pessoa abre CNPJ PORQUE já tem contrato
   ou salário fechado. Pra ela, "quanto você ESPERA faturar" pede um chute
   sobre algo que ela sabe com precisão. Duas correções:
     · copy acolhe os dois ("já sabe" e "estima"), sem rotular ninguém;
     · "sei o valor exato" abre entrada precisa — profundidade sob demanda
       (UX-48), sem bifurcar trilha. A faixa é derivada do valor, então o
       resto do flow continua recebendo o mesmo dado de sempre.
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Deriva a faixa a partir do valor exato: quem sabe o número não repete a
 * escolha. Sai direto do `FAIXAS`, então acompanha qualquer redesenho da grade.
 *
 * 🔄 01/09 — quem digita ACIMA do teto do ME (R$30 mil/mês) cai na última
 * faixa, não em `null`: não existe mais a opção "+30k" e a gente decidiu não
 * barrar por faturamento. O dado exato fica registrado, e é ele que vai
 * alimentar a vigília de desenquadramento pra EPP quando ela existir.
 */
export function faixaDoValor(v: number): string | null {
  if (v <= 0) return null;
  // Pula a opção "Não sei ainda": ela cobre 0-30k de propósito (pro gate do
  // MEI ler incerteza), mas quem digitou um valor exato NUNCA deve cair nela.
  const faixa = FAIXAS.find((f) => !f.desconhecida && v > f.min && v <= f.max);
  return faixa ? faixa.id : FAIXAS[FAIXAS.length - 1].id;
}

export function FaixaView({
  faixa,
  setFaixa,
  modoExato,
  setModoExato,
  exato,
  setExato,
  onSeguir,
  autoFocus = true,
  exatoInline = false,
  regimeMei = false,
  onTrocarParaMe,
}: {
  faixa: string | null;
  setFaixa: (v: string | null) => void;
  modoExato: boolean;
  setModoExato: (v: boolean) => void;
  exato: string;
  setExato: (v: string) => void;
  onSeguir: () => void;
  /** A demo desliga: roubar o foco dentro da moldura rola a página do board. */
  autoFocus?: boolean;
  /**
   * 🆕 28/08 — no caminho MEI esta tela deixa de ser só enquadramento e vira
   * **gate de teto**. O MEI tem limite de R$81.000/ano (LC 123 art. 18-A), ou
   * R$6.750/mês — quem passa disso não pode ser MEI, e descobrir depois do
   * pagamento seria o pior caso possível (desenquadramento retroativo, com
   * juros e multa, se o excesso passar de 20%).
   *
   * `false` (default) = caminho ME, tela idêntica ao que sempre foi.
   */
  regimeMei?: boolean;
  /** Só no MEI: leva pro caminho ME quando o faturamento estoura o teto. */
  onTrocarParaMe?: () => void;
  /**
   * 🔓 UX-68 (29/07) — "sei o valor exato" REVELA o campo abaixo das faixas,
   * em vez de trocar a tela inteira. Trocar fazia parecer que a pessoa saiu
   * do passo (e some a referência das faixas justamente na hora de digitar um
   * número que vai cair numa delas).
   */
  exatoInline?: boolean;
  /**
   * 🔴 27/08 — a escolha "endereço próprio × fiscal Legalizai" SAIU daqui.
   * Ela morou nesta tela entre 26/08 e 27/08 (tinha vindo do C4), e agora vive
   * no **E3.3** (`/endereco`, `EnderecoCategoriaView`), junto do gate de
   * cidade que ela sempre foi parte: as duas respondem "onde a empresa fica",
   * e faturamento não tem nada a ver com isso. O valor continua somando na
   * mensalidade do E7 pelo mesmo mecanismo (`?endereco=fiscal`).
   */
}) {
  const valor = Number(exato.replace(/\D/g, "")) || 0;
  const faixaExata = faixaDoValor(valor);
  const escolhida = exatoInline
    ? // Inline: o valor digitado manda; sem valor, vale a faixa tocada.
      (valor > 0 ? faixaExata : faixa)
    : modoExato
      ? faixaExata
      : faixa;
  const rotuloEscolhida = FAIXAS.find((f) => f.id === escolhida)?.label;

  // ─── GATE DE TETO (só MEI) ────────────────────────────────────────────────
  // Duas certezas diferentes, e a tela trata cada uma como ela é:
  //   · valor exato acima de R$6.750 → estoura, ponto final.
  //   · faixa acima de "até R$10 mil" → estoura em qualquer ponto dela.
  //   · faixa "até R$10 mil" → PODE estourar (R$6.750 cai dentro dela). Não dá
  //     pra bloquear sem saber, então vira aviso, não porta fechada.
  // 🔄 01/09 — calculado a partir do `min`/`max` da faixa, não de um id fixo:
  // a grade mudou (teto do ME) e o gate do MEI passou a acompanhar sozinho.
  // Com a grade atual, o teto do MEI (R$6.750) cai dentro de "R$ 5 a 10 mil".
  const faixaEscolhida = FAIXAS.find((f) => f.id === escolhida);
  const estouraTeto =
    regimeMei &&
    (valor > TETO_MEI_MENSAL ||
      (valor === 0 && !!faixaEscolhida && faixaEscolhida.min >= TETO_MEI_MENSAL));
  const tetoIncerto =
    regimeMei &&
    !estouraTeto &&
    valor === 0 &&
    !!faixaEscolhida &&
    faixaEscolhida.max > TETO_MEI_MENSAL;

  return (
    <>
      {/* Título FIXO (padrão de 3 partes: título fixo / corpo rola / CTA fixo) */}
      <div className="shrink-0">
        {/* "Pode ser estimativa!" entra no TÍTULO (mesmo padrão do N3, com a
            2ª parte em tom secundário): tira a pressão de acertar o número
            antes da pessoa olhar as opções. Com isso o subtítulo parou de
            repetir "estimativa" e ficou só com o acolhimento de quem já sabe
            o valor (a persona PJ-ização, que abre CNPJ com contrato fechado). */}
        <h1 className="text-h1 mb-2">
          Quanto você vai receber por mês?{" "}
          <span className="text-text-tertiary">Pode ser estimativa!</span>
        </h1>
        <p className="text-body text-text-secondary mb-6">
          Se você já sabe o valor, melhor ainda.
        </p>
      </div>

      <Rolagem>
        {exatoInline ? (
          /* 🔓 UX-68 — as faixas FICAM; o campo exato aparece abaixo. */
          <div className="flex flex-col gap-4">
            <GradeFaixas
              selecionada={valor === 0 ? faixa : faixaExata}
              onSelecionar={(id) => {
                setFaixa(id);
                // Tocar numa faixa desfaz o valor digitado: senão o número
                // continuaria mandando e a seleção visual mentiria.
                setExato("");
                setModoExato(false);
              }}
            />

            {modoExato ? (
              <div className="mt-2 flex flex-col gap-2">
                <p className="text-caption font-semibold text-text-primary">
                  Valor exato por mês
                </p>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-body text-text-secondary">
                    R$
                  </span>
                  <input
                    value={exato}
                    onChange={(e) => {
                      /**
                       * 🔄 01/09 (pedido do Pedro) — o campo NÃO é livre: para
                       * no teto do ME (R$30 mil/mês = R$360 mil/ano, LC 123
                       * art. 3º II). Digitar acima disso descrevia uma empresa
                       * que a Legalizai não atende hoje, e ainda contradizia a
                       * própria grade de faixas, que termina exatamente aí.
                       *
                       * Trava por CLAMP, não por rejeição: quem digita 50000
                       * vê 30.000 no campo e o aviso logo abaixo explicando. Um
                       * campo que simplesmente ignora a tecla deixa a pessoa
                       * achando que o app travou.
                       */
                      const digitado = Number(e.target.value.replace(/\D/g, "")) || 0;
                      const preso = Math.min(digitado, TETO_ME_MENSAL);
                      setExato(preso ? preso.toLocaleString("pt-BR") : "");
                    }}
                    placeholder="0"
                    inputMode="numeric"
                    autoFocus={autoFocus}
                    aria-label="Quanto você vai receber por mês"
                    className="w-full min-h-12 rounded-md border border-border-hairline bg-surface-card
                               py-3 pl-10 pr-3 text-body text-text-primary placeholder:text-text-muted
                               focus:border-border-focus focus:outline-none"
                  />
                </div>
                {valor >= TETO_ME_MENSAL && (
                  <p className="text-micro text-text-tertiary">
                    Esse é o teto do ME: {brl(TETO_ME_MENSAL)} por mês
                    ({brl(TETO_ME_MENSAL * 12)} por ano). Acima disso a empresa
                    vira EPP, e aí a gente conversa antes de abrir.
                  </p>
                )}
                {/* Devolve o enquadramento na hora: mostra que o número foi
                    entendido, e liga o valor à faixa que ficou logo acima. */}
                {valor > 0 && rotuloEscolhida && (
                  <p className="text-caption text-text-secondary">
                    Isso te coloca na faixa{" "}
                    <strong className="text-text-primary">{rotuloEscolhida}</strong>.
                  </p>
                )}
              </div>
            ) : (
              <button
                onClick={() => setModoExato(true)}
                className="mt-2 self-start text-caption font-medium text-text-secondary underline underline-offset-4"
              >
                Sei o valor exato
              </button>
            )}
          </div>
        ) : modoExato ? (
          <div className="flex flex-col gap-2">
            <input
              value={exato}
              onChange={(e) => {
                // Mesmo teto da outra variante desta tela (comentário longo
                // lá em cima): o campo para em R$30 mil/mês, o limite do ME.
                const digitado = Number(e.target.value.replace(/\D/g, "")) || 0;
                const preso = Math.min(digitado, TETO_ME_MENSAL);
                setExato(preso ? preso.toLocaleString("pt-BR") : "");
              }}
              placeholder="R$ 0"
              inputMode="numeric"
              autoFocus={autoFocus}
              aria-label="Quanto você vai receber por mês"
              className="w-full min-h-12 rounded-md border border-border-hairline bg-surface-card
                         px-3 text-body text-text-primary placeholder:text-text-muted
                         focus:border-border-focus focus:outline-none"
            />
            {/* Devolve o enquadramento na hora: mostra que o número foi entendido. */}
            {rotuloEscolhida && (
              <p className="text-caption text-text-secondary">
                Isso te coloca na faixa{" "}
                <strong className="text-text-primary">{rotuloEscolhida}</strong>.
              </p>
            )}
            <button
              onClick={() => setModoExato(false)}
              className="mt-2 self-start text-caption font-medium text-text-secondary underline underline-offset-4"
            >
              Prefiro escolher uma faixa
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <GradeFaixas selecionada={faixa} onSelecionar={setFaixa} />
            <button
              onClick={() => setModoExato(true)}
              className="self-start text-caption font-medium text-text-secondary underline underline-offset-4"
            >
              Sei o valor exato
            </button>
          </div>
        )}

        {/* ─── O GATE DE TETO DO MEI (não existe no caminho ME) ───────────
            Estourar o teto não é "erro do cliente": é a empresa dele crescendo
            além do que esse regime comporta. A copy trata assim, e a saída é
            o ME — nunca um beco. */}
        {estouraTeto && (
          <div className="mt-4 flex flex-col gap-3">
            <Aviso variante="info" titulo="Com esse faturamento, o MEI não serve">
              O MEI tem teto de {brl(TETO_MEI_ANUAL, true)} por ano, que dá{" "}
              {brl(TETO_MEI_MENSAL, true)} por mês. Passar disso não é
              impedimento pra abrir empresa: é só sinal de que o seu caso é ME
              no Simples Nacional.
            </Aviso>
            <p className="text-caption text-text-secondary">
              Melhor descobrir agora. Quem estoura o teto depois de aberto paga
              a diferença como ME, e acima de 20% ainda entra juros e multa.
            </p>
            <Button full onClick={onTrocarParaMe}>
              Continuar como ME
            </Button>
          </div>
        )}

        {/* A faixa "até R$10 mil" contém o teto (R$6.750), então não dá pra
            afirmar nada — avisa sem bloquear, e oferece o campo exato. */}
        {tetoIncerto && (
          <div className="mt-4">
            <Aviso variante="warning" titulo="Fica de olho no teto do MEI">
              O limite do MEI é {brl(TETO_MEI_MENSAL, true)} por mês (
              {brl(TETO_MEI_ANUAL, true)} no ano), e ele cai dentro dessa faixa.
              Se quiser ter certeza agora, informa o valor exato aqui em cima.
            </Aviso>
          </div>
        )}
      </Rolagem>
      <div className="app-footer-cta">
        {/* 28/07: N5' (Resumo de valor) foi REMOVIDO — segue direto pro N6.
            Copy trocada: "ver o que eu ganho" prometia uma revelação que só
            existia no N5'; sem ele, a promessa vira mentira. */}
        <Button full disabled={!escolhida || estouraTeto} onClick={onSeguir}>
          Continuar e cadastrar
        </Button>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MEI × ME — `MeiOuMeView` é usada hoje em `/entrada` (E3.2), logo depois do
   fork, ANTES do gate de cidade. 🔁 REALOCADA 03/08 — morava no fim do E5
   (depois da faixa), decisão revertida pelo Pedro: quem abre MEI já sabe que
   é MEI, e MEI não tem o limite geográfico do MLP (pula o gate de cidade).

   ⚠️ Recomendação, não trava (mesma doutrina do C6/Natureza jurídica): quem
   se qualifica pode preferir ME mesmo assim (planeja sócio, quer teto maior).
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Elegibilidade ao MEI. Checa sócio (fato legal: MEI não tem sócio) + faixa
 * de faturamento (teto LC 123 art.18-A). 🔴 NÃO checa atividade/CNAE — essa
 * lista ainda não está no vault (fila Larissa). Ver comentário em `FISCAL`.
 *
 * 🟡 ÓRFÃ desde a realocação de 03/08 — a pergunta agora acontece ANTES de
 * sócio/faturamento existirem, então não dá mais pra usar isto pra GATEAR a
 * tela. Fica pronta pra virar guard-rail (ex: se a pessoa disse "MEI" aqui e
 * depois a triagem revelar 2+ sócios, corrigir) — isso ainda NÃO foi
 * construído, é gap conhecido.
 */
export function elegivelParaMei(
  socios: number | null,
  faixa: string | null,
  modoExato: boolean,
  exato: string,
): boolean {
  if (socios !== 1) return false;
  const valor = Number(exato.replace(/\D/g, "")) || 0;
  if (modoExato && valor > 0) return valor <= FISCAL.MEI_TETO_MENSAL;
  // Sem valor exato: compatível com o MEI é qualquer faixa que COMECE abaixo
  // do teto (R$6.750/mês) — dentro dela pode estar acima ou abaixo, e a tela
  // deixa a pessoa decidir (o aviso `tetoIncerto`).
  // 🔄 01/09 — era `faixa === "ate 10k"` fixo; com a grade nova (que termina
  // no teto do ME) as faixas compatíveis são "até 5 mil" e "5 a 10 mil".
  const f = FAIXAS.find((x) => x.id === faixa);
  return !!f && f.min < FISCAL.MEI_TETO_MENSAL;
}

/**
 * 🆕 04/08 — E3.2 agora é reusada pelo Migrar também (decisão do Pedro:
 * inverter a ordem — pergunta o regime ANTES da cidade, não só depois no M1).
 * A copy muda de "qual devo ESCOLHER" (critério de elegibilidade, faz sentido
 * pra quem ainda vai abrir) pra "qual eu JÁ SOU" (autoidentificação — o CNPJ
 * já existe, não há escolha). Mesma estrutura de dados, conteúdo por contexto.
 *
 * ⚠️ Autodeclarado, não trava nada: pro Migrar, quem confirma de verdade o
 * regime é o M1 (`/migrar/cnpj`), puxando da Receita. Esta tela só decide se
 * pula ou não o gate de cidade — igual já fazia pro Abrir.
 */
function opcoesRegime(contexto: "abrir" | "migrar") {
  if (contexto === "migrar") {
    return [
      {
        id: "mei" as const,
        nome: "MEI · Microempreendedor Individual",
        checks: [
          "Já é MEI (Microempreendedor Individual)",
          "A gente atende MEI de qualquer cidade do Brasil",
          "Imposto fixo todo mês, não depende do que você retira",
          "Sem sócio · até 1 funcionário com carteira",
        ],
      },
      {
        id: "me" as const,
        nome: "ME · Simples Nacional",
        checks: [
          "Microempresa no Simples Nacional",
          "Por enquanto, só atendemos empresas de Belo Horizonte/MG",
          "Imposto pode variar conforme o que você retira pra você",
          "Pode ter sócio · sem o teto de faturamento do MEI",
        ],
      },
    ];
  }
  return [
    // 🔄 29/08 (pedido do Pedro) — ME vem primeiro agora (era MEI). Sem
    // motivo de negócio pra MEI abrir a lista; o pedido foi só inverter.
    {
      id: "me" as const,
      nome: "ME · Simples Nacional",
      // ✍️ 01/09 (enxugada de copy, pedido do Pedro) — cortes sem perder
      // informação: o "R$81 mil" era o teto do MEI citado no card do ME
      // (confundia); "crescer" já estava no check 1; "sem limite do regime" é
      // contabilês.
      checks: [
        "Fatura acima de ~R$6.750/mês, ou espera crescer rápido",
        "Só Belo Horizonte/MG, por enquanto",
        "Sem teto: cresce sem trocar de regime",
        "Pode ter sócio e quantos funcionários precisar",
      ],
    },
    {
      id: "mei" as const,
      // ✍️ 01/09 — soletrar a sigla não ensina nada a quem não sabe; "ME ·
      // Simples Nacional" fica porque ali o sufixo carrega regime.
      nome: "MEI",
      // 🆕 03/08 — lista ÚNICA (era pontos + "Recomendado para" separados —
      // duas listas com estilo diferente pra informação do mesmo tipo lia como
      // inconsistência, não hierarquia). Concreto (número) primeiro.
      // 🆕 28/08 (decisão do Pedro) — o certificado digital entra AQUI, na
      // primeira tela em que a pessoa escolhe ser MEI, e não lá no fim. Ele
      // deixou de vir incluso no plano MEI, e descobrir isso só no contrato
      // seria a surpresa que a marca inteira existe pra não dar.
      // ✍️ 01/09 (enxugada) — parêntese duplo desfeito, "praticamente" era
      // hedge (o registro MEI é síncrono mesmo), certificado com a MESMA
      // honestidade de 28/08 na metade das palavras.
      checks: [
        "Fatura até ~R$6.750/mês (R$81 mil/ano)",
        "Abre em qualquer cidade do Brasil",
        "Sem taxa da Junta · registro na hora",
        "Sem sócio · até 1 funcionário com carteira",
        "Certificado digital por sua conta (não vem no plano)",
      ],
    },
  ];
}

export function CheckMiniRegime() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12 4 4 8-9" />
    </svg>
  );
}

export function MeiOuMeView({
  contexto = "abrir",
  regime,
  setRegime,
  onSeguir,
  onVoltar,
}: {
  /** 🆕 04/08 — "abrir" pergunta o que ESCOLHER (elegibilidade); "migrar" pergunta o que a pessoa JÁ É (autodeclaração, o CNPJ já existe). */
  contexto?: "abrir" | "migrar";
  /** 🔴 27/08 — "presumido" saiu do tipo junto com o card (ver comentário no
   *  JSX). A tela agora tem exatamente 2 saídas, MEI e ME. */
  regime: "mei" | "me" | null;
  setRegime: (v: "mei" | "me") => void;
  onSeguir: () => void;
  /** Volta pro fork (E3) — quem chegou aqui pode ter errado abrir×migrar. */
  onVoltar?: () => void;
}) {
  const opcoes = opcoesRegime(contexto);
  // 🆕 29/08 (pedido do Pedro) — link de escape pra quem trava na escolha:
  // "Falar com o time" no MESMO padrão mock já usado no gate de sócios
  // (TriagemView) — ainda não existe canal real (WhatsApp/chat) ligado em
  // lugar nenhum do app, então fica resolução inline até existir um de
  // verdade.
  return (
    <>
      {/* 🆕 03/08 — faltava até o chrome de página (esta tela é renderizada
          sozinha, sem `/gate` ao redor pra fornecer header+main). Seta de
          voltar em CIMA, mesmo padrão de todas as outras telas (ex: E4.2).
          🐛 29/08 — `meta` é o rótulo do DESTINO do voltar, não desta tela.
          Estava "Sobre a sua empresa" (nome da tela SEGUINTE). */}
      <TelaHeader meta="Primeiros dados" onVoltar={onVoltar} />
      <main className="app-main">
      <div className="shrink-0">
        <h1 className="text-h1 mb-2">
          {contexto === "migrar" ? "Sua empresa hoje é MEI ou ME?" : "Você será MEI ou ME?"}
        </h1>
        {/* 🔄 29/08 (pedido do Pedro) — tirou o "se não souber"/"dá pra trocar
            de ideia depois": a escolha aqui não é reversível de graça lá na
            frente, então o tom não pode soar leve/opcional. */}
        <p className="text-body text-text-secondary mb-6">
          {contexto === "migrar"
            ? "Isso muda se a cidade importa e como a gente confirma seus dados."
            : // ✍️ 01/09 (enxugada de copy, pedido do Pedro) — "a diferença
              // real é essa" apontava pros checks que moravam DENTRO dos
              // cards; desde 29/08 só tem ícone lá, a frase apontava pro
              // vazio. A nova diz o gesto (tocar) e o peso (define o resto).
              "Toque pra comparar. A escolha define o resto da abertura."}
        </p>
      </div>

      <Rolagem>
        <div className="flex flex-col gap-3">
          {/* 🔄 29/08 (pedido do Pedro) — vira o mesmo padrão de card
              ilustrado (prédio MEI menor × prédio ME maior, mesma família dos
              ícones de faixa/coorte). Antes cada opção já vinha com a lista de
              checks dentro do próprio botão; agora os checks só aparecem
              embaixo, depois de escolher — os 2 cards ficam lado a lado, só
              ícone + rótulo. */}
          <div className="grid grid-cols-2 gap-3">
            {opcoes.map((o) => (
              <CardIconeSelecao
                key={o.id}
                label={o.id === "mei" ? "MEI" : "ME"}
                iconeCoral={
                  o.id === "mei" ? "/icones/regime-mei-coral.png" : "/icones/regime-me-coral.png"
                }
                iconeCreme={
                  o.id === "mei" ? "/icones/regime-mei-creme.png" : "/icones/regime-me-creme.png"
                }
                selecionado={regime === o.id}
                onClick={() => setRegime(o.id)}
                tamanho={90}
              />
            ))}
          </div>

          {/* 🆕 03/08 — lista única de checks (mesmo padrão visual do "O que
              esse CNAE cobre", ConteudoCnae/tela Atende). Era 2 listas com
              estilo diferente (bullet + check) pra informação do mesmo tipo —
              lia como inconsistência, não hierarquia.
              🔄 29/08 — passou pra FORA do card, só aparece depois de
              escolher o regime. */}
          {regime && (
            <div className="rounded-md border border-border-hairline bg-surface-card p-4">
              <p className="text-body-strong font-bold text-text-primary mb-2">
                {opcoes.find((o) => o.id === regime)?.nome}
              </p>
              <div className="flex flex-col gap-1.5">
                {opcoes
                  .find((o) => o.id === regime)
                  ?.checks.map((c) => (
                    <div key={c} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-state-success-tint text-state-success-text">
                        <CheckMiniRegime />
                      </span>
                      <p className="text-caption text-text-secondary">{c}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 🔴 27/08 — o card "ME · Lucro Presumido" foi REMOVIDO daqui.
              Decisão do Pedro na reordenação do flow de entrada: "não vale o
              desgaste da dúvida agora" — a 3ª opção fazia mais gente parar pra
              pensar num regime que ela provavelmente não tem do que
              genuinamente reconhecia alguém (volume conhecidamente mínimo no
              ICP: ME de serviço no Simples).

              ⚠️ Como captar quem É Lucro Presumido ficou PARQUEADO de
              propósito, não resolvido. `/saida/regime-nao-suportado` continua
              existindo e alcançada pelo M1 (`/migrar/cnpj`), que confirma o
              regime pela Receita — ou seja, no caminho MIGRAR a pessoa ainda é
              reconhecida. Só o caminho ABRIR ficou sem porta pra ela.
              Ver `marca/decisoes-marca.md` 27/08. */}
        </div>

        {/* 🔄 29/08 (pedido do Pedro) — a versão "abrir" desse aviso saiu:
            "sua atividade ainda precisa estar na lista..." é redundante, a
            pessoa vê isso naturalmente na tela seguinte (E3.4). */}
        {contexto === "migrar" && (
          <p className="text-micro text-text-tertiary mt-4">
            A gente confirma o regime de verdade puxando o CNPJ da Receita, no
            próximo passo.
          </p>
        )}
      </Rolagem>

      <div className="app-footer-cta">
        {/* 🆕 29/08 (pedido do Pedro) — escape hatch pra quem trava na
            escolha, acima do CTA principal.
            🔄 01/09 (pedido do Pedro) — deixou de ser mensagem morta ("nosso
            time vai entrar em contato", que não levava a lugar nenhum) e
            passou a ABRIR o WhatsApp com a dúvida já contextualizada. O
            número é placeholder em `lib/contato.ts` até existir o real. */}
        <a
          href={linkWhatsApp(
            "Oi! Estou abrindo minha empresa no app da Legalizai e travei na escolha entre MEI e ME. Podem me ajudar?",
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3 block text-center w-full text-caption font-medium text-text-secondary underline underline-offset-4"
        >
          Tirar dúvida no WhatsApp
        </a>
        <Button full disabled={!regime} onClick={onSeguir}>
          Continuar
        </Button>
      </div>
      </main>
    </>
  );
}

/**
 * 🐛 ACHADO ao verificar no browser (16/07): o `prefers-reduced-motion` do
 * globals.css só desliga animação CSS. O typewriter é JS, então passava batido
 * e ficava em movimento perpétuo — violando o UX-12 justamente pra quem mais
 * precisa dele. O protótipo tem o mesmo bug e ninguém tinha visto.
 *
 * `useSyncExternalStore` = a forma canônica de assinar um store externo
 * (matchMedia). Sem setState-em-effect (não cascateia render) e SSR-safe: o
 * snapshot do servidor é `false`, e no cliente lê o valor real na 1ª pintura.
 */
function useReducedMotion() {
  return useSyncExternalStore(
    (notificar) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", notificar);
      return () => mq.removeEventListener("change", notificar);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   🌾 Typewriter — colhido do protótipo. Não é enfeite: dá EXEMPLO REAL de
   resposta pro campo aberto, que é o que trava o leigo ("campo aberto sem
   exemplo" está na lista de estresse da persona `reta`).
   ───────────────────────────────────────────────────────────────────────── */
function useTypewriter(palavras: string[], pausado: boolean) {
  const [txt, setTxt] = useState("");
  const i = useRef(0);
  const c = useRef(0);
  const apagando = useRef(false);
  const reduzido = useReducedMotion();

  useEffect(() => {
    if (pausado || reduzido) return;
    const t = setTimeout(
      () => {
        const alvo = palavras[i.current % palavras.length];
        if (!apagando.current) {
          c.current++;
          setTxt(alvo.slice(0, c.current));
          if (c.current === alvo.length) {
            apagando.current = true;
          }
        } else {
          c.current--;
          setTxt(alvo.slice(0, c.current));
          if (c.current === 0) {
            apagando.current = false;
            i.current++;
          }
        }
      },
      apagando.current
        ? RITMO.apaga
        : c.current === palavras[i.current % palavras.length].length
          ? RITMO.segura
          : RITMO.digita
    );
    return () => clearTimeout(t);
  }, [txt, pausado, palavras, reduzido]);

  // Sem animação: mostra um exemplo estático. O EXEMPLO é o que importa
  // ("campo aberto sem exemplo" trava a persona `reta`); a animação é enfeite.
  if (reduzido) return palavras[0];
  return pausado ? "" : txt;
}
