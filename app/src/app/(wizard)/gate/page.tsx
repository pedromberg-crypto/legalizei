"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { VereditoView, type Resultado } from "@/components/veredito";
import { EncaixeView, encaixeDeResultado } from "@/components/encaixe";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N4 — GATE-CNAE  ·  TELA-FAROL "mais simples" (shell: WIZARD, fora do app)
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: execucao/reordenacao-flow-cobranca-cedo.md (N4)
 * Motor: execucao/motor-testes/flow-schema.js → b1.descricao · b1.mapeamento
 *        · b1.desambiguacao · b1.filtro · b1.veredito · b1.triagem · b1.faturamento
 *
 * É farol porque é a tela mais rica do funil (textarea, typewriter, loading,
 * desambiguação, veredito 3 estados, triagem, faixa) E porque testa o shell de
 * FORA. A outra farol (N18) testa o de dentro. A tensão entre as duas é o que
 * gera o DS — as farol antigas (T7+T14) estavam as duas do mesmo lado.
 *
 * 🌾 COLHIDO do protótipo (decisão, não arquivo — design-system.md §6):
 *   · placeholder typewriter com atividades reais
 *   · loading com copy que explica ("Analisando o que você faz…")
 *   · CTA colado no rodapé → NÃO é gosto, é THUMB ZONE
 *   · "Não é bem isso, refazer" ACIMA do CTA, sem perder o texto
 *   · CNAE em linguagem humana ANTES do código (UX-05)
 *   · copy sem travessão (regra dura 13/07)
 *
 * 🆕 O que a reordenação (16/07) adicionou e o protótipo não tem:
 *   · TRIAGEM de elegibilidade antes do dinheiro (UX-21): sócios + exterior
 *   · FAIXA de faturamento (alimenta o teaser do N5)
 *
 * 🚧 IA dublada: no motor o mapeamento CNAE vem da persona; aqui vem de um
 * mock. A tela testa a LÓGICA do fluxo, não a IA.
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
const EXEMPLOS = [
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
 * Pills de reconhecimento do N4 (17) — derivadas dos 103 CNAEs serviço-liso
 * (pesquisa/cnae-matriz/cnae-liso-servico.md). Cobrem 103/103.
 *
 * ⚠️ A pill ESTREITA, não valida (decisão 17/07 → legalize-pill-estreita-nao-valida).
 * Clicar não dá veredito: só afunila o universo pra IA e troca o exemplo do
 * campo. A pessoa AINDA descreve no textarea — é lá que a IA cruza e decide.
 * `ex` é a frase em 1ª pessoa que vira placeholder quando a pill é escolhida.
 */
const PILLS = [
  { id: "tech", label: "Tecnologia e software", ex: "Desenvolvo sites, apps ou sistemas sob encomenda" },
  { id: "mkt", label: "Marketing e publicidade", ex: "Cuido das redes sociais e faço publicidade pra clientes" },
  { id: "design", label: "Design", ex: "Crio design gráfico, de interiores ou de produto" },
  { id: "foto", label: "Foto e vídeo", ex: "Fotografo, filmo e edito vídeo e áudio" },
  { id: "consult", label: "Consultoria e gestão", ex: "Dou consultoria de gestão pra pequenas empresas" },
  { id: "admin", label: "Apoio administrativo", ex: "Faço serviços de escritório, cobrança e teleatendimento" },
  { id: "cursos", label: "Cursos e treinamentos", ex: "Dou curso de idioma, informática ou preparatório" },
  { id: "ensino", label: "Ensino de arte e esporte", ex: "Ensino dança, música ou esporte" },
  { id: "eventos", label: "Eventos e festas", ex: "Organizo festas, feiras e eventos" },
  { id: "arte", label: "Arte e cultura", ex: "Sou artista ou produzo espetáculos e shows" },
  { id: "veiculos", label: "Conserto de veículos", ex: "Faço mecânica, funilaria ou borracharia" },
  { id: "eletronicos", label: "Conserto de eletrônicos", ex: "Conserto celular, computador e eletrônicos" },
  { id: "reparos", label: "Reparos em geral", ex: "Sou chaveiro ou conserto relógio, calçado e móvel" },
  { id: "maquinas", label: "Manutenção de máquinas", ex: "Faço manutenção de máquinas e equipamentos" },
  { id: "aluguel", label: "Aluguel de equipamentos", ex: "Alugo equipamentos e objetos" },
  { id: "hospedagem", label: "Hospedagem", ex: "Tenho pousada, albergue ou pensão" },
  { id: "salao", label: "Salão e beleza", ex: "Trabalho com salão, cabelo e beleza" },
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

// Mock do b1.mapeamento (IA dublada). Espelha os vereditos do motor.
// `Resultado` / `Veredito` agora vêm de @/components/veredito (fonte única A2).
function mapear(texto: string): Resultado {
  const t = texto.toLowerCase();
  if (/nutri|dentist|médic|medic|advog|arquitet|psicó|psico/.test(t)) {
    return {
      humano: "Atividade regulamentada",
      explica: "Sua área precisa de responsável técnico registrado no conselho.",
      cnae: "8650-0/02",
      veredito: "waitlist",
    };
  }
  if (/loja|revend|estoque|vend[oa] produto|comérci|comerci|restaurante/.test(t)) {
    return {
      humano: "Comércio",
      explica: "Você vende produtos, não serviço.",
      cnae: "4713-0/02",
      veredito: "nao-atende",
    };
  }
  // Dados reais do 6201-5/02 (contabilizei-cnae-completo.json + CONCLA/IBGE).
  // As `vizinhas` fazem DUAS coisas: guarda-corpo do falso-🟢 (quem tem outra
  // atividade PRINCIPAL se corrige aqui, antes do pagamento) e porta de entrada
  // dos CNAEs secundários (quem faz as duas coisas descobre que cabe).
  return {
    humano: "Criação de sites e web design",
    explica: "Você entrega sites e presença digital pra outras empresas.",
    cnae: "6201-5/02",
    veredito: "atende",
    compreende: [
      "Criar e desenvolver sites, páginas e portais na internet",
      "Desenhar a interface (o visual e a navegação) desses sites",
    ],
    vizinhas: [
      {
        oque: "Sistema sob medida, customizável",
        cnae: "6202-3/00",
        comoSecundaria: "mesmo-imposto",
      },
      {
        oque: "Software pronto, de prateleira",
        cnae: "6203-1/00",
        comoSecundaria: "mesmo-imposto",
      },
      {
        oque: "Consultoria em tecnologia",
        cnae: "6204-0/00",
        comoSecundaria: "mesmo-imposto",
      },
      {
        oque: "Design gráfico (logo, material impresso)",
        cnae: "7410-2/99",
        comoSecundaria: "mesmo-imposto",
      },
    ],
    fiscal: { entradas: [6, 15.5], dependeProLabore: true },
  };
}

type Etapa =
  | "perguntando"
  | "analisando"
  | "veredito"
  | "encaixe"
  | "triagem"
  | "faixa";

const FAIXAS = [
  { id: "ate 10k", label: "Até R$ 10 mil" },
  { id: "10-20k", label: "R$ 10 a 20 mil" },
  { id: "20-30k", label: "R$ 20 a 30 mil" },
  { id: "30k+", label: "Mais de R$ 30 mil" },
];

/**
 * ⚠️ 28/07 — DEEP-LINK por `?etapa=`. As 6 etapas do gate viviam presas dentro
 * de UM SPA: a prancheta (/mockup) só sabia carregar `/gate` do zero, então
 * nunca mostrava veredito/encaixe/triagem/faixa sem clicar através de tudo —
 * a triagem (sócios+exterior) passou batida numa revisão inteira por causa
 * disso. Mesmo padrão já usado em /notas/detalhe?s= e /blog/post?id=.
 */
const ETAPAS_LINKAVEIS: Etapa[] = ["veredito", "encaixe", "triagem", "faixa"];

export default function GatePage() {
  const searchParams = useSearchParams();
  const etapaParam = searchParams.get("etapa") as Etapa | null;
  const etapaInicial: Etapa =
    etapaParam && ETAPAS_LINKAVEIS.includes(etapaParam) ? etapaParam : "perguntando";
  // veredito/encaixe precisam de um resultado pra renderizar — usa o caso
  // 🟢 atende (o default de `mapear("")`), o mesmo caminho feliz que as
  // telas /veredito/atende e /encaixe já usam como demo.
  const resultadoInicial =
    etapaInicial === "veredito" || etapaInicial === "encaixe" ? mapear("") : null;

  const [etapa, setEtapa] = useState<Etapa>(etapaInicial);
  const [texto, setTexto] = useState("");
  const [resultado, setResultado] = useState<Resultado | null>(resultadoInicial);
  const [socios, setSocios] = useState<number | null>(null);
  const [exterior, setExterior] = useState<boolean | null>(null);

  function validar() {
    setEtapa("analisando");
    // 🌾 colhido: o loading não é decorativo, ele EXPLICA o que está acontecendo
    setTimeout(() => {
      setResultado(mapear(texto));
      setEtapa("veredito");
    }, 1400);
  }

  return (
    <>
      <header className="pt-6 pb-4">
        <p className="text-micro text-text-tertiary">Legalizai</p>
      </header>

      <main className="app-main">
        {etapa === "perguntando" && (
          <Perguntando texto={texto} setTexto={setTexto} onValidar={validar} />
        )}
        {etapa === "analisando" && <Analisando />}
        {etapa === "veredito" && resultado && (
          <VereditoView
            r={resultado}
            onRefazer={() => setEtapa("perguntando")}
            onSeguir={() => setEtapa("encaixe")}
          />
        )}
        {etapa === "encaixe" && resultado && (
          <EncaixeView
            dados={encaixeDeResultado(resultado)}
            onRefazer={() => setEtapa("perguntando")}
            onSeguir={() => setEtapa("triagem")}
          />
        )}
        {etapa === "triagem" && (
          <Triagem
            socios={socios}
            setSocios={setSocios}
            exterior={exterior}
            setExterior={setExterior}
            onSeguir={() => setEtapa("faixa")}
          />
        )}
        {etapa === "faixa" && <Faixa />}
      </main>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ARQUÉTIPO A1 — PERGUNTA (o mais comum do flow; N4, N10–N16)
   ───────────────────────────────────────────────────────────────────────── */
function Perguntando({
  texto,
  setTexto,
  onValidar,
}: {
  texto: string;
  setTexto: (v: string) => void;
  onValidar: () => void;
}) {
  const [categoria, setCategoria] = useState<string | null>(null);
  // 🆕 28/07 (reunião Rua Satélite 9): atalho "já sei o número do meu CNAE" —
  // pra quem já vem informado, pula descrever/pills e vai direto pra
  // consulta na lista validada. Mesma engine (mapear/veredito), só muda o
  // que o campo pede e como valida.
  const [sabeCodigo, setSabeCodigo] = useState(false);
  const sel = PILLS.find((p) => p.id === categoria);
  const tw = useTypewriter(EXEMPLOS, texto.length > 0 || categoria !== null);
  // Pill escolhida troca o exemplo por uma frase fixa da categoria; sem pill,
  // o typewriter cicla exemplos genéricos. O EXEMPLO é o que ensina o campo.
  const placeholder = sabeCodigo ? "Ex: 6201-5/02" : sel ? `Ex: ${sel.ex}` : tw;
  // b1.descricao valida >= 10 caracteres. Espelha o motor exatamente.
  // No modo código, a régua é outra: só precisa parecer um CNAE (dígitos).
  const podeValidar = sabeCodigo
    ? texto.replace(/\D/g, "").length >= 6
    : texto.trim().length >= 10;

  // ── Scroll-fade das pills ────────────────────────────────────────────────
  // Inversão de quem estica: o textarea virou FIXO e as PILLS são a única
  // região elástica/rolável. Garante UM scroll só (o das pills) e o input nunca
  // espreme. Depende do shell travado em 100dvh (.app-page, globals.css): sem o
  // teto, a página inteira cresce em vez de as pills rolarem — foi o bug no SE.
  const scRef = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState({ up: false, down: false });
  const recompute = useCallback(() => {
    const el = scRef.current;
    if (!el) return;
    const up = el.scrollTop > 2;
    const down = el.scrollTop + el.clientHeight < el.scrollHeight - 2;
    setFade((f) => (f.up === up && f.down === down ? f : { up, down }));
  }, []);
  // ResizeObserver, não só onScroll: o /mockup muda a altura útil ao trocar de
  // aparelho (injeta --safe-*), e isso muda se há overflow.
  useEffect(() => {
    recompute();
    const el = scRef.current;
    if (!el) return;
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [recompute]);
  // Transparência REAL (mask): só desbota a ponta que ainda tem pill pra rolar.
  const topStop = fade.up ? "transparent 0, #000 22px" : "#000 0";
  const botStop = fade.down ? "#000 calc(100% - 22px), transparent 100%" : "#000 100%";
  const mask = `linear-gradient(to bottom, ${topStop}, ${botStop})`;

  return (
    <>
      {/* Título/subtítulo fixos. As PILLS são a única coisa que rola; input e
          CTA têm altura reservada. Só funciona com o shell travado em 100dvh. */}
      <div className="flex-1 min-h-0 flex flex-col">
        <h1 className="text-h1 mb-2">
          {sabeCodigo ? "Qual o número do seu CNAE?" : "O que você faz?"}
        </h1>
        <p className="text-body text-text-secondary mb-4">
          {sabeCodigo
            ? "A gente confere se ele está na nossa lista de atendidos."
            : "Acha o que mais parece. Depois conta do seu jeito."}
        </p>

        {/* Pills de reconhecimento (17). A pill ESTREITA, não valida (decisão
            17/07 → legalize-pill-estreita-nao-valida). Aqui são a região
            rolável: flex-wrap que estoura na vertical, fade nas pontas (mask),
            scrollbar escondida. Somem no modo código — não fazem sentido pra
            quem já sabe o número. */}
        {!sabeCodigo && (
          <div
            ref={scRef}
            onScroll={recompute}
            style={{ maskImage: mask, WebkitMaskImage: mask }}
            className="flex min-h-0 flex-1 flex-wrap content-start gap-2 overflow-y-auto pb-1
                       [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {PILLS.map((p) => {
              const on = categoria === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setCategoria(on ? null : p.id)}
                  className={`h-fit rounded-full border px-3 py-1.5 text-caption font-medium transition-colors
                    ${
                      on
                        ? "border-border-focus bg-surface-tint-brand text-text-primary"
                        : "border-border-hairline bg-surface-card text-text-secondary hover:border-border-strong"
                    }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        )}

        {/* 8px de âncora (mt-2) → input de altura FIXA. Não estica mais: as pills
            é que absorvem a variação de tela. */}
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={placeholder}
          className="mt-2 h-[6.5rem] w-full shrink-0 resize-none rounded-md border border-border-hairline
                     bg-surface-card p-3 text-body text-text-primary
                     placeholder:text-text-muted focus:border-border-focus focus:outline-none"
        />

        {/* Microcopy que ENSINA, não pune (UX-16). Reforça o "descreve mais"
            quando a pill foi escolhida — a pill não fecha, o texto fecha. */}
        <p className="text-caption text-text-tertiary mt-2 min-h-[1.25rem]">
          {sabeCodigo
            ? "Formato: 0000-0/00"
            : sel
              ? "Boa. Agora conta um pouco mais pra gente confirmar."
              : texto.length > 0 && !podeValidar
                ? "Conta um pouco mais do que você faz."
                : ""}
        </p>

        {/* 🆕 28/07: CTA discreto do atalho — não compete com o CTA principal
            (texto pequeno, sublinhado, sem fill). */}
        <button
          onClick={() => {
            setSabeCodigo((v) => !v);
            setTexto("");
            setCategoria(null);
          }}
          className="mt-2 self-start text-caption font-medium text-text-secondary underline underline-offset-4"
        >
          {sabeCodigo ? "Prefiro descrever o que faço" : "Já sei o número do meu CNAE"}
        </button>
      </div>

      {/* 🌾 CTA no rodapé = thumb zone (design-system.md §6) */}
      <div className="app-footer-cta">
        <Button full onClick={onValidar} disabled={!podeValidar}>
          Validar minha atividade
        </Button>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ARQUÉTIPO A7 (variação curta) — ESPERA
   🌾 colhido: o loading EXPLICA. "Analisando o que você faz…" em vez de spinner mudo.
   ───────────────────────────────────────────────────────────────────────── */
function Analisando() {
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
   que ser perguntado ANTES do dinheiro. Barrar depois = cobrar de quem não
   pode abrir. Espelha b1.triagem do motor.
   ⚠️ 28/07: a saída AGORA navega de verdade — "Falar com o time" era beco sem
   saída (as telas /saida/exterior e /saida/socios existiam mas nada linkava
   pra elas). Exterior tem precedência (bloqueio legal, LC 123 art.17) sobre
   3+ sócios (limite do produto) — mesma ordem que já dava o texto do aviso.
   ───────────────────────────────────────────────────────────────────────── */
function Triagem({
  socios,
  setSocios,
  exterior,
  setExterior,
  onSeguir,
}: {
  socios: number | null;
  setSocios: (n: number) => void;
  exterior: boolean | null;
  setExterior: (b: boolean) => void;
  onSeguir: () => void;
}) {
  const router = useRouter();
  const bloqueado = (socios !== null && socios > 2) || exterior === true;
  const completo = socios !== null && exterior !== null;
  const rotaSaida = exterior === true ? "/saida/exterior" : "/saida/socios";

  return (
    <>
      {/* Título FIXO (padrão de 3 partes: título fixo / corpo rola / CTA fixo) */}
      <div className="shrink-0">
        <h1 className="text-h1 mb-6">Duas perguntas rápidas</h1>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <p className="text-body-strong font-semibold mb-3">
          Quantas pessoas vão ser donas da empresa?
        </p>
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => setSocios(n)}
              className={`flex-1 min-h-12 rounded-md border text-body font-semibold transition-colors
                ${
                  socios === n
                    ? "border-border-focus bg-surface-tint-brand text-text-primary"
                    : "border-border-hairline bg-surface-card text-text-secondary hover:border-border-strong"
                }`}
            >
              {n === 3 ? "3 ou mais" : n === 1 ? "Só eu" : "2"}
            </button>
          ))}
        </div>

        <p className="text-body-strong font-semibold mb-3">
          Alguém mora fora do Brasil?
        </p>
        <div className="flex gap-2">
          {[
            { v: false, label: "Não" },
            { v: true, label: "Sim" },
          ].map((o) => (
            <button
              key={String(o.v)}
              onClick={() => setExterior(o.v)}
              className={`flex-1 min-h-12 rounded-md border text-body font-semibold transition-colors
                ${
                  exterior === o.v
                    ? "border-border-focus bg-surface-tint-brand text-text-primary"
                    : "border-border-hairline bg-surface-card text-text-secondary hover:border-border-strong"
                }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        {/* Bloqueio que EDUCA (UX-07/09) e oferece saída, sem crash.
            ⚠️ danger, nunca coral: coral não é erro. */}
        {bloqueado && (
          <div className="mt-6 rounded-md bg-state-danger-tint p-4">
            <p className="text-body-strong font-semibold text-state-danger-text mb-1">
              Esse caso a gente resolve com uma pessoa
            </p>
            <p className="text-caption text-text-secondary">
              {exterior
                ? "Com sócio morando fora, a empresa até existe, mas fica fora do Simples. Nosso time te explica as opções."
                : "Acima de 2 sócios é limite do nosso produto, não da lei. Nosso time abre pra você."}
            </p>
          </div>
        )}
      </div>

      <div className="app-footer-cta">
        {bloqueado ? (
          <Button full variant="dark" onClick={() => router.push(rotaSaida)}>
            Falar com o time
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

/** Deriva a faixa a partir do valor exato: quem sabe o número não repete a escolha. */
function faixaDoValor(v: number): string | null {
  if (v <= 0) return null;
  if (v < 10000) return "ate 10k";
  if (v < 20000) return "10-20k";
  if (v <= 30000) return "20-30k";
  return "30k+";
}

function Faixa() {
  const router = useRouter();
  const [faixa, setFaixa] = useState<string | null>(null);
  const [modoExato, setModoExato] = useState(false);
  const [exato, setExato] = useState("");

  const valor = Number(exato.replace(/\D/g, "")) || 0;
  const faixaExata = faixaDoValor(valor);
  const escolhida = modoExato ? faixaExata : faixa;
  const rotuloEscolhida = FAIXAS.find((f) => f.id === escolhida)?.label;

  return (
    <>
      {/* Título FIXO (padrão de 3 partes: título fixo / corpo rola / CTA fixo) */}
      <div className="shrink-0">
        <h1 className="text-h1 mb-2">Quanto você vai receber por mês?</h1>
        <p className="text-body text-text-secondary mb-6">
          Se você já sabe o valor, melhor ainda. Se não, uma estimativa basta.
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {modoExato ? (
          <div className="flex flex-col gap-2">
            <input
              value={exato}
              onChange={(e) =>
                setExato(
                  (Number(e.target.value.replace(/\D/g, "")) || "").toLocaleString(
                    "pt-BR"
                  )
                )
              }
              placeholder="R$ 0"
              inputMode="numeric"
              autoFocus
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
          <div className="flex flex-col gap-2">
            {FAIXAS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFaixa(f.id)}
                className={`w-full min-h-12 rounded-md border px-4 text-left text-body font-semibold transition-colors
                  ${
                    faixa === f.id
                      ? "border-border-focus bg-surface-tint-brand text-text-primary"
                      : "border-border-hairline bg-surface-card text-text-secondary hover:border-border-strong"
                  }`}
              >
                {f.label}
              </button>
            ))}
            <button
              onClick={() => setModoExato(true)}
              className="mt-2 self-start text-caption font-medium text-text-secondary underline underline-offset-4"
            >
              Sei o valor exato
            </button>
          </div>
        )}
      </div>
      <div className="app-footer-cta">
        {/* 28/07: N5' (Resumo de valor) foi REMOVIDO — segue direto pro N6.
            Copy trocada: "ver o que eu ganho" prometia uma revelação que só
            existia no N5'; sem ele, a promessa vira mentira. */}
        <Button full disabled={!escolhida} onClick={() => router.push("/conta")}>
          Continuar
        </Button>
      </div>
    </>
  );
}

/**
 * 🐛 ACHADO ao verificar no browser (16/07): o `prefers-reduced-motion` do
 * globals.css só desliga animação CSS. O typewriter é JS, então passava batido
 * e ficava em movimento perpétuo — violando o UX-12 justamente pra quem mais
 * precisa dele. O protótipo tem o mesmo bug e ninguém tinha visto.
 * (Nota honesta: eu achei isto investigando um timeout de screenshot e culpei o
 * typewriter. Era falso: o simulador não tem typewriter, tem zero animações e
 * trava igual — a ferramenta de captura é que estava instável. O bug de
 * acessibilidade é real e o fix vale; a pista que me levou até ele é que era
 * coincidência.)
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
