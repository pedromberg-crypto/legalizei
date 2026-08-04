"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { Checkbox } from "@/components/ui/form";
import { PillCnpj, AprendaGradiente } from "@/components/lab/campea-blocks";
import { QuemCuida } from "@/components/lab/ref9-blocks";
import { CUSTOS, brl } from "@/lib/fiscal";
import { passosDoCliente } from "@/lib/passos";
import { ListaPassos } from "@/components/lista-passos";
import { CLIENTE, TEM_SOCIO, NOME_EMPRESARIAL, CNAE_PRINCIPAL, CNAES_SECUNDARIAS } from "@/app/(app)/dossie/mock";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * A CAUDA (N19–N24) + AS 2 PAUSAS DE PAGAMENTO (P1, P2) — fonte única, 29/07.
 * ═══════════════════════════════════════════════════════════════════════════
 * Mesma regra do `wizard-dinheiro.tsx`/`wizard-dossie.tsx`: a TELA mora aqui, e
 * as `page.tsx` de produção viram wrappers finos. Nenhuma teve o pixel mudado
 * na extração — só ganharam `onSeguir`/`onVoltar` (a maioria não tinha CTA
 * ligado a lugar nenhum, porque nenhuma delas tinha sido apresentada ainda).
 *
 * ⚠️ `PainelView` (N21 + REC) **não está aqui** — já era componente
 * compartilhado em `components/painel.tsx` desde antes de hoje (`/painel` e
 * `/painel/recusa` já reusavam). A demo importa de lá direto.
 *
 * ─── AS 2 PAUSAS NÃO SÃO "DEPOIS DO N16" — ENTRAM ANTES DO DOSSIÊ ─────────
 * P1 (retomar) e P2 (aguardando boleto) vivem no mapa como:
 *   `N9 --boleto--> P2 --> N10` · `P1 --volta ao passo pausado--> N10`
 * Ou seja: são pausas de PAGAMENTO, não do fim do flow. P2 só existe pra quem
 * escolheu boleto no N9; P1 é reentrada de quem fechou o app e voltou depois
 * (em qualquer ponto do dossiê, o mapa mostra a aterrissagem em N10). A demo
 * respeita isso: P2 é condicional ao método escolhido, e P1 é acessível pela
 * pill própria, fora da sequência linear.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/* ═══════════════════ N19 · REVISAR O DOSSIÊ ═════════════════════════════ */

/**
 * 🔗 IDENTIDADE UNIFICADA COM O RESTO DO DOSSIÊ (29/07).
 * Antes esta tela tinha o próprio mock `DOSSIE`, com um CNAE (`6201-5/01`) que
 * não batia com o principal travado no Encaixe (`6201-5/02`, um dígito de
 * diferença) e secundárias (`Hospedagem`, `Suporte técnico`) que o N14 nunca
 * ofereceu como opção. É a mesma classe de divergência que o `dossie/mock.ts`
 * foi criado pra matar — então esta tela passou a herdar de lá.
 */
function useRevisao() {
  const secundarias = CNAES_SECUNDARIAS;
  return {
    socio: { nome: CLIENTE.nome, cpf: CLIENTE.cpf, contato: CLIENTE.telefone },
    empresa: {
      razao: `${NOME_EMPRESARIAL} Web Studio`,
      natureza: TEM_SOCIO
        ? "Sociedade Limitada (LTDA)"
        : "Sociedade Limitada Unipessoal (SLU)",
      endereco: CLIENTE.endereco,
      capital: 10000,
    },
    atividade: {
      principal: { cnae: CNAE_PRINCIPAL.cnae, nome: CNAE_PRINCIPAL.humano },
      secundarias: secundarias.map((s) => ({ cnae: s.cnae, nome: s.humano })),
    },
    // 🚧 Cálculo fiscal do card de sugestão — mock pra farol, independente da
    // unificação de identidade (é matéria de `lib/fiscal`, não de mock.ts).
    // Anexo III/6% já é consistente com o `fiscal.entradas[0]` do veredito 🟢.
    enquadramento: { anexo: "III", aliquota: 6, proLabore: 3600, economiaMes: 940 },
    taxaJunta: CUSTOS.DAE_JUCEMG,
  };
}

export function RevisarView({
  onSeguir,
  onVoltar,
  mei = false,
}: {
  onSeguir?: () => void;
  onVoltar?: () => void;
  /** 🆕 03/08 — MEI: some capital social (não existe), a taxa da Junta
   *  (não passa por lá) e o enquadramento Simples/Anexo (MEI é DAS fixo, não
   *  Anexo/Fator R). 🔴 valor exato do DAS-MEI 2026 NÃO está ratificado no
   *  vault — por isso a tela diz "DAS fixo" sem número, em vez de inventar. */
  mei?: boolean;
}) {
  const d = useRevisao();
  return (
    <>
      <TelaHeader meta="Revisar" onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo sub="Confira com calma. Depois que você autoriza, a gente já começa a registrar isso na Junta com o seu nome.">
          Está tudo certo?
        </Titulo>

        <Corpo>
          <Bloco titulo="Você" passo="Seus dados">
            <Linha rotulo="Nome" valor={d.socio.nome} />
            <Linha rotulo="CPF" valor={d.socio.cpf} />
            <Linha rotulo="Contato" valor={d.socio.contato} />
          </Bloco>

          <Bloco titulo="A empresa" passo="Dados da empresa">
            <Linha rotulo="Nome" valor={d.empresa.razao} />
            <Linha rotulo="Tipo" valor={mei ? "MEI" : d.empresa.natureza} />
            <Linha rotulo="Endereço" valor={d.empresa.endereco} />
            {!mei && <Linha rotulo="Capital social" valor={brl(d.empresa.capital)} />}
          </Bloco>

          <Bloco titulo="O que a empresa faz" passo="Atividades">
            <Linha
              rotulo="Principal"
              valor={`${d.atividade.principal.nome} (${d.atividade.principal.cnae})`}
            />
            {d.atividade.secundarias.map((s) => (
              <Linha key={s.cnae} rotulo="Secundária" valor={`${s.nome} (${s.cnae})`} />
            ))}
          </Bloco>

          {/* ⚠️ 28/07: virou CARD de SUGESTÃO, não recap de escolha manual — o
              N18 (simulador interativo) saiu do caminho obrigatório pré-
              constituição. O pró-labore some como PILL dentro do mesmo card. */}
          <Card>
            <div className="mb-2 flex items-center justify-between gap-3">
              <h2 className="text-body font-semibold text-text-primary">
                Seu enquadramento
              </h2>
              {!mei && (
                <span className="shrink-0 rounded-full bg-surface-tint-brand px-2.5 py-1 text-micro font-semibold text-action-primary-sm">
                  ✨ Sugestão
                </span>
              )}
            </div>
            {mei ? (
              <p className="text-caption text-text-secondary">
                MEI paga um DAS fixo por mês, sem Fator R nem Anexo pra
                calcular — bem mais simples que o Simples Nacional.
              </p>
            ) : (
              <>
                <p className="text-caption text-text-secondary mb-3">
                  Já escolhemos o melhor enquadramento pra você, com base no
                  que você preencheu.
                </p>
                <div className="flex flex-col gap-1.5">
                  <Linha
                    rotulo="Regime"
                    valor={`Simples Nacional · Anexo ${d.enquadramento.anexo} (${d.enquadramento.aliquota}%)`}
                  />
                  <Linha rotulo="Quanto você se paga por mês" valor={brl(d.enquadramento.proLabore)} />
                </div>
                <p className="text-micro text-text-tertiary mt-3">
                  Esse número é uma estimativa. Depois que a empresa nascer, a
                  gente lapida ele com você de verdade (é o Pró-labore, na aba
                  Impostos).
                </p>
              </>
            )}
          </Card>

          {/* A taxa dura como LINHA de recap: já foi paga no N9, o N7 já é o
              dono da explicação. Aqui não re-argumenta, só confirma o valor.
              MEI não tem essa taxa — o card some (não faz sentido "R$0"). */}
          {!mei && (
            <Card>
              <div className="flex items-baseline justify-between">
                <span className="text-body font-semibold text-text-primary">
                  Taxa da Junta (já paga)
                </span>
                <span className="text-body font-semibold text-text-primary">
                  {brl(d.taxaJunta)}
                </span>
              </div>
              <p className="text-micro text-text-tertiary mt-1">
                Repasse ao governo, já incluído no que você pagou.
              </p>
            </Card>
          )}
        </Corpo>

        <Rodape>
          <Button full onClick={onSeguir}>
            Confirmar e seguir
          </Button>
        </Rodape>
      </main>
    </>
  );
}

function Bloco({
  titulo,
  passo,
  children,
}: {
  titulo: string;
  passo: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-body font-semibold text-text-primary">{titulo}</h2>
        <button
          className="shrink-0 text-caption font-semibold text-action-primary-sm underline underline-offset-4"
          aria-label={`Ajustar ${passo}`}
        >
          Ajustar
        </button>
      </div>
      <div className="flex flex-col gap-1.5">{children}</div>
    </Card>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-micro text-text-tertiary">{rotulo}</span>
      <span className="text-caption text-text-primary">{valor}</span>
    </div>
  );
}

/* ═══════════════════ N20 · TERMO DE INÍCIO (IRREVERSÍVEL) ═══════════════ */

export function TermoView({
  aceito,
  setAceito,
  onSeguir,
  onVoltar,
  mei = false,
}: {
  aceito: boolean;
  setAceito: (v: boolean) => void;
  onSeguir?: () => void;
  onVoltar?: () => void;
  /** 🆕 03/08 — MEI registra no Portal do Empreendedor, não na Junta; e não
   *  pagou taxa nenhuma, então a cláusula de não-reembolso da taxa não existe
   *  pra ela. */
  mei?: boolean;
}) {
  return (
    <>
      <TelaHeader meta="Autorização" onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo sub="Você já pagou e já montou tudo. Este é o último passo antes da gente registrar a empresa de verdade.">
          Pode começar a abrir?
        </Titulo>

        <Corpo>
          <div>
            <p className="text-body-strong font-semibold text-text-primary mb-2">
              Quando você autoriza, a gente começa agora:
            </p>
            <ul className="flex flex-col gap-2">
              <Item>
                {mei
                  ? "Registra sua empresa no Portal do Empreendedor."
                  : "Protocola sua empresa na Junta Comercial de Minas."}
              </Item>
              {!mei && <Item>A taxa que você já pagou cobre esse registro.</Item>}
              <Item>Segue com Receita, Simples e Prefeitura até o CNPJ ativar.</Item>
            </ul>
          </div>

          <Aviso variante="warning" titulo="A partir daqui, não dá pra desfazer">
            {mei
              ? "É o ponto sem volta: o que for registrado a partir de agora não tem como ser desfeito. Vale conferir tudo antes de autorizar."
              : "É o ponto sem volta: o que a Junta registrar a partir de agora não tem como ser desfeito. Vale conferir tudo antes de autorizar."}
          </Aviso>

          <div>
            <p className="text-body-strong font-semibold text-text-primary mb-2">
              Como funciona o cancelamento
            </p>
            <div className="flex flex-col gap-2.5">
              <Camada>
                Você autoriza esta abertura de forma expressa, aqui, marcando o
                aceite. Nada é registrado sem esse passo.
              </Camada>
              {!mei && (
                <Camada>
                  A taxa da Junta não é reembolsável depois que a gente
                  registra, porque ela vai pro governo, não pra gente.
                </Camada>
              )}
              <Camada>
                O nosso serviço (a mensalidade) você cancela quando quiser,
                respeitando o prazo do plano.
              </Camada>
              <Camada>
                Até aqui, nada foi registrado. Se você desistir antes de
                autorizar, recebe de volta o que pagou{!mei && ", inclusive a taxa"}.
              </Camada>
            </div>
          </div>

          <Checkbox checked={aceito} onChange={setAceito}>
            {mei
              ? "Autorizo o início da abertura, ciente de que ela não pode ser desfeita."
              : "Autorizo o início da abertura, ciente de que ela não pode ser desfeita e de que a taxa da Junta já paga não é reembolsável."}
          </Checkbox>
        </Corpo>

        <Rodape>
          <Button full disabled={!aceito} onClick={onSeguir}>
            Autorizo, pode abrir
          </Button>
        </Rodape>
      </main>
    </>
  );
}

function Item({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="mt-0.5 shrink-0 text-action-primary"
        aria-hidden
      >
        <circle cx="12" cy="12" r="11" fill="currentColor" />
        <path
          d="m7.5 12.4 3.1 3.1 6-6.2"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-caption text-text-secondary">{children}</span>
    </li>
  );
}

function Camada({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-action-primary" />
      <p className="text-caption text-text-secondary">{children}</p>
    </div>
  );
}

/* ═══════════════════ N22 · ASSINATURA (GOV.BR + N23 dobrado) ═══════════ */

type StatusSocio = "voce" | "convidar" | "aguardando" | "assinou";

const SOCIOS_ASSINATURA: { nome: string; status: StatusSocio }[] = [
  { nome: "Você", status: "voce" },
  { nome: "Bruno Costa", status: "convidar" },
];

const NIVEL_GOVBR: "bronze" | "prata" | "ouro" = "prata";

/**
 * ⚠️ SEM ESTADO REAL DE CONSENSO (mock pra farol). O produto real trackearia
 * convite→aguardando→assinou por sócio, em dias. Aqui, qualquer CTA habilitado
 * avança a demo pro N24 — simular a espera assíncrona de verdade é trabalho de
 * outro momento (painel/CRM), não desta apresentação.
 */
export function AssinaturaView({
  onSeguir,
  onVoltar,
  mei = false,
}: {
  onSeguir?: () => void;
  onVoltar?: () => void;
  /** 🆕 03/08 — MEI assina no Portal do Empreendedor, não na Junta. Sócio já
   *  não se aplica (MEI é sempre solo, `sociedade` abaixo já cobre isso). */
  mei?: boolean;
}) {
  const sociedade = SOCIOS_ASSINATURA.length > 1;
  const bronze = NIVEL_GOVBR === "bronze";

  return (
    <>
      <TelaHeader meta="Assinatura" onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo
          sub={
            mei
              ? "O registro do MEI é pelo GOV.BR, com o seu CPF. Leva uns minutos."
              : "A Junta registra a empresa com a assinatura dos sócios. É pelo GOV.BR e leva uns minutos."
          }
        >
          Hora de assinar
        </Titulo>

        <Corpo>
          {bronze ? (
            <Aviso variante="warning" titulo="Sua conta GOV.BR precisa subir de nível">
              Pra assinar, o GOV.BR exige nível prata ou ouro, e o seu está
              bronze. A gente te mostra como subir em 2 minutos, aqui mesmo.
            </Aviso>
          ) : (
            <Card tom="sucesso">
              <div className="flex items-center gap-2">
                <Check />
                <span className="text-caption font-semibold text-state-success-text">
                  Sua conta GOV.BR está no nível prata
                </span>
              </div>
              <p className="text-micro text-text-secondary mt-1">
                {mei
                  ? "É o nível que o Portal do Empreendedor aceita pra assinar. Pode seguir."
                  : "É o nível que a Junta aceita pra assinar. Pode seguir."}
              </p>
            </Card>
          )}

          {sociedade && (
            <div>
              <p className="text-body-strong font-semibold text-text-primary mb-2">
                Quem precisa assinar
              </p>
              <div className="flex flex-col gap-2">
                {SOCIOS_ASSINATURA.map((s) => (
                  <SocioLinha key={s.nome} nome={s.nome} status={s.status} />
                ))}
              </div>
              <p className="text-micro text-text-tertiary mt-2">
                A empresa só é registrada quando os dois assinam. Seu sócio
                confirma os próprios dados e aprova o custo antes, ninguém assina
                pelo outro.
              </p>
            </div>
          )}

          <Aviso variante="info" titulo="Junto vai uma procuração eletrônica">
            É o que deixa a gente pagar seu DAS e cuidar das obrigações por você.
            Tem limite, serve só pra isso, e você revoga quando quiser.
          </Aviso>
        </Corpo>

        <Rodape>
          {sociedade && SOCIOS_ASSINATURA[1].status === "convidar" ? (
            <>
              <Button full onClick={onSeguir}>
                Enviar convite pro Bruno
              </Button>
              <div className="mt-2 flex justify-center">
                <Button variant="ghost" onClick={onSeguir}>
                  Assinar a minha parte agora
                </Button>
              </div>
            </>
          ) : (
            <Button full disabled={bronze} onClick={onSeguir}>
              {bronze ? "Subir de nível no GOV.BR" : "Assinar no GOV.BR"}
            </Button>
          )}
        </Rodape>
      </main>
    </>
  );
}

function SocioLinha({ nome, status }: { nome: string; status: StatusSocio }) {
  const legenda: Record<StatusSocio, string> = {
    voce: "Pode assinar quando quiser",
    convidar: "Falta convidar pra confirmar e assinar",
    aguardando: "Aguardando ele confirmar e assinar",
    assinou: "Assinou",
  };
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-caption font-semibold text-text-primary truncate">{nome}</p>
          <p className="text-micro text-text-tertiary mt-0.5">{legenda[status]}</p>
        </div>
        {status === "assinou" ? (
          <Check />
        ) : (
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-micro font-semibold ${
              status === "voce"
                ? "bg-surface-tint-brand text-text-primary"
                : "bg-surface-alt text-text-secondary"
            }`}
          >
            {status === "voce" ? "Você" : "Sócio"}
          </span>
        )}
      </div>
    </Card>
  );
}

function Check() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 text-state-success"
      aria-hidden
    >
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path
        d="m7.5 12.4 3.1 3.1 6-6.2"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ═══════════════════ N24 + CERTIFICADO (ÓRFÃS, removidas 30/07) ═════════
 * AtivaView (N24, /ativa) e CertificadoView (/certificado) existiam desde
 * 29/07 mas ficaram órfãs no swap daquele dia: o que segue a assinatura
 * (N22) é o P0 (HomeAtivacaoView, abaixo), não elas. Rastreando router.push/
 * href no código real (30/07): nenhuma rota navegava mais até nenhuma das
 * duas. Removidas junto das rotas `/ativa` e `/certificado`. Ver flow-data.mjs
 * (nós ATIVA/CERT, ⚠️ ÓRFÃO) e HOME-reorganizacao.md.
 * ══════════════════════════════════════════════════════════════════════ */

/* ═══════════════════ P0 · HOME DE ATIVAÇÃO (dia-1) ══════════════════════ */

/**
 * ⚠️ 29/07 — CORREÇÃO: este é o P0 de verdade, não o gate isolado de
 * certificado que existia antes. O Pedro mandou o print da tela real (a home
 * dia-1, com "Bem-vinda, Ana" / trilha "1 de 3" / CNPJ com copiar) e a
 * etiqueta na origem — `portal-data.mjs` — chamava a rota `/certificado` de
 * "P0", mas quem o Pedro já validou como o próximo passo depois da assinatura
 * é ESTA tela (`/home-dia1`), que engloba a validação do certificado como o
 * item 2 da própria trilha, não como gate isolado.
 *
 * 🆕 30/07 — `CertificadoView` e a rota `/certificado` foram REMOVIDAS de
 * verdade (não só desativadas): rastreando router.push/href no código real,
 * nada navegava mais até lá. Ver comentário acima desta seção.
 *
 * ⚠️ SEM CONFETE, por pedido explícito do Pedro. A fonte (`home-dia1/page.tsx`)
 * tinha `<Confetti>` no hero de nascimento (`festa` toggle). Mesmo padrão do
 * dia inteiro (a celebração do CTA saiu do veredito 🟢, a materialização saiu
 * do N24): efeito de entrada em tela de meio de fluxo, fora.
 */

type EstadoAtivacao = "feito" | "agora" | "depois" | "final";
type PassoAtivacao = {
  id: string;
  estado: EstadoAtivacao;
  titulo: string;
  sub: string;
  href?: string;
  status?: string;
};

const PASSOS_ATIVACAO: PassoAtivacao[] = [
  {
    id: "cnpj",
    estado: "feito",
    titulo: "CNPJ aberto",
    sub: "Sua empresa já está ativa na Receita Federal.",
  },
  {
    id: "certificado",
    estado: "agora",
    titulo: "Validação do certificado digital",
    sub: "Nossa certificadora parceira vai te chamar pra agendar a videochamada de validação. A gente conduz, você só participa.",
    status: "Em andamento",
  },
  {
    id: "dados",
    estado: "depois",
    titulo: "Conferir os dados da empresa",
    sub: "Dê uma olhada se está tudo certo no seu cadastro.",
    href: "/mais/empresa",
  },
  {
    id: "acesso",
    estado: "final",
    titulo: "Acesso completo ao app",
    sub: "Assim que os dados forem conferidos, tudo se abre: emitir nota, impostos, relatórios e mais.",
  },
];

const TAREFAS_ATIVACAO = PASSOS_ATIVACAO.filter((p) => p.estado !== "final");
const FEITOS_ATIVACAO = TAREFAS_ATIVACAO.filter((p) => p.estado === "feito").length;
const PCT_ATIVACAO = Math.round((FEITOS_ATIVACAO / TAREFAS_ATIVACAO.length) * 100);

export function HomeAtivacaoView() {
  return (
    <main className="app-main">
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-6 pb-[calc(24px+var(--safe-bottom))] pt-3">
          {/* Sem navbar nesta tela: a pessoa não navega livre até liberar o
              acesso. Avatar DESATIVADO; sino segue ativo. */}
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-caption text-text-secondary">Bem-vinda, Ana</p>
              <h1 className="text-h1 leading-tight text-text-primary">
                Vamos ativar
                <br />
                sua empresa
              </h1>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href="/avisos"
                aria-label="Ver avisos"
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border-hairline bg-surface-card text-text-secondary transition-colors hover:border-border-strong active:bg-surface-alt"
              >
                <IconeSinoAtivacao />
                <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-surface-page bg-action-primary" />
              </Link>
              <span
                aria-disabled
                title="Disponível quando sua empresa estiver ativada"
                className="flex h-11 w-11 cursor-not-allowed items-center justify-center rounded-full bg-surface-dark/50 text-caption font-bold text-text-on-dark/50"
              >
                AB
              </span>
            </div>
          </div>

          {/* Hero de nascimento — SEM confete (decisão do Pedro, 29/07) e SEM
              o selo coral no topo (removido a pedido, mesma data). */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-dark p-5 text-text-on-dark">
            <p className="text-h2 font-bold leading-tight">Sua empresa nasceu.</p>
            <p className="mt-1 text-caption text-text-on-dark/70">
              Ativa há 3 dias. Agora é deixar tudo pronto pra você faturar.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <PillCnpj />
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full border border-border-hairline bg-surface-card px-3 py-1.5 text-caption font-medium text-text-secondary transition-colors active:bg-surface-alt"
              >
                <IconeDownloadAtivacao />
                Cartão CNPJ
              </button>
            </div>
          </div>

          {/* Trilha de ativação (o herói funcional) */}
          <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-body-strong font-semibold text-text-primary">Sua ativação</p>
              <span className="text-caption font-semibold text-text-secondary">
                {FEITOS_ATIVACAO} de {TAREFAS_ATIVACAO.length}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-alt">
              <div
                className="h-full rounded-full bg-action-primary transition-all"
                style={{ width: `${PCT_ATIVACAO}%` }}
              />
            </div>
            <p className="mt-1.5 text-micro text-text-tertiary">
              A parceira vai te chamar pra validar o certificado. Terminou de
              conferir os dados? Seu app abre por completo.
            </p>

            <div className="mt-4">
              {PASSOS_ATIVACAO.map((p, i) => (
                <PassoAtivacaoItem
                  key={p.id}
                  p={p}
                  n={i + 1}
                  ultimo={i === PASSOS_ATIVACAO.length - 1}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 rounded-2xl bg-surface-tint-brand p-4">
            <span className="mt-0.5 shrink-0 text-action-primary-sm">
              <IconeRelogioAtivacao />
            </span>
            <div>
              <p className="text-caption font-semibold text-text-primary">
                Sem pressa com imposto agora
              </p>
              <p className="mt-0.5 text-micro text-text-secondary">
                Seu primeiro DAS só chega quando você faturar. A gente calcula,
                gera a guia e te avisa. Você não precisa lembrar de nada.
              </p>
            </div>
          </div>

          <AprendaGradiente />
          <QuemCuida />
        </div>
      </div>
    </main>
  );
}

function PassoAtivacaoItem({
  p,
  n,
  ultimo,
}: {
  p: PassoAtivacao;
  n: number;
  ultimo: boolean;
}) {
  const conteudo = (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <NodeAtivacao estado={p.estado} n={n} />
        {!ultimo && <div className="my-1 w-0.5 flex-1 rounded-full bg-border-hairline" />}
      </div>
      <div className={`flex-1 ${ultimo ? "" : "pb-5"}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p
              className={`text-caption font-semibold ${
                p.estado === "feito" || p.estado === "agora"
                  ? "text-text-primary"
                  : "text-text-secondary"
              }`}
            >
              {p.titulo}
            </p>
            <p className="mt-0.5 text-micro text-text-tertiary">{p.sub}</p>
          </div>
          {p.estado === "agora" && p.status && (
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-state-info-tint px-2.5 py-1 text-micro font-semibold text-state-info-text">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-state-info-text" />
              {p.status}
            </span>
          )}
          {p.estado === "feito" && (
            <span className="shrink-0 text-micro font-semibold text-state-success-text">
              Feito
            </span>
          )}
          {p.estado === "depois" && p.href && (
            <span className="shrink-0 text-text-tertiary">
              <IconeChevronAtivacao />
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return p.href ? (
    <Link href={p.href} className="block rounded-xl transition-colors active:bg-surface-alt">
      {conteudo}
    </Link>
  ) : (
    conteudo
  );
}

function NodeAtivacao({ estado, n }: { estado: EstadoAtivacao; n: number }) {
  if (estado === "feito") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-state-success text-text-on-dark">
        <IconeCheckAtivacao />
      </span>
    );
  }
  if (estado === "agora") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-action-primary text-text-on-brand ring-4 ring-action-primary/20">
        <IconeFaiscaAtivacao sm />
      </span>
    );
  }
  if (estado === "final") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-tint-brand text-action-primary-sm">
        <IconeCadeadoAbertoAtivacao />
      </span>
    );
  }
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-strong text-micro font-bold text-text-tertiary">
      {n}
    </span>
  );
}

function IconeFaiscaAtivacao({ sm = false }: { sm?: boolean }) {
  const s = sm ? 15 : 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2c.6 3.5 2 4.9 5.5 5.5C14 8.1 12.6 9.5 12 13c-.6-3.5-2-4.9-5.5-5.5C10 6.9 11.4 5.5 12 2z" />
      <path d="M18.5 13c.3 1.8 1 2.5 2.8 2.8-1.8.3-2.5 1-2.8 2.8-.3-1.8-1-2.5-2.8-2.8 1.8-.3 2.5-1 2.8-2.8z" />
    </svg>
  );
}
function IconeSinoAtivacao() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}
function IconeRelogioAtivacao() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
function IconeCheckAtivacao() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}
function IconeDownloadAtivacao() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v12M8 11l4 4 4-4" />
      <path d="M5 20h14" />
    </svg>
  );
}
function IconeCadeadoAbertoAtivacao() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 7.5-2" />
    </svg>
  );
}
function IconeChevronAtivacao() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/* ═══════════════════ P1 · RETOMAR DE ONDE PAROU ═════════════════════════ */

const ESTADO_P1 = { diasFora: 6, concluidos: 3 };

export function RetomarView({ onSeguir }: { onSeguir?: () => void }) {
  const passos = passosDoCliente();
  const feito = ESTADO_P1.concluidos;
  const total = passos.length;

  return (
    <>
      <TelaHeader meta="Continuando" />

      <main className="app-main">
        <Titulo
          sub={`Você saiu há ${ESTADO_P1.diasFora} dias e está tudo salvo, do jeitinho que deixou. Vamos continuar?`}
        >
          Bem-vindo de volta
        </Titulo>

        <Corpo>
          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <p className="text-body font-semibold text-text-primary">Onde você está</p>
              <span className="text-caption text-text-tertiary">
                {feito} de {total}
              </span>
            </div>
            <ListaPassos concluidos={feito} mostrarDestino />
          </div>

          <p className="text-micro text-text-tertiary">
            Seu pagamento está registrado. Nada é cobrado nem aberto duas vezes.
          </p>
        </Corpo>

        <Rodape>
          <Button full onClick={onSeguir}>
            Continuar de onde parei
          </Button>
        </Rodape>
      </main>
    </>
  );
}

/* ═══════════════════ P2 · AGUARDANDO O BOLETO ═══════════════════════════ */

const BOLETO_P2 = { passosFeitos: 5 };

export function AguardandoView({ onSeguir }: { onSeguir?: () => void }) {
  const total = passosDoCliente().length;

  return (
    <>
      <TelaHeader meta="Seu pagamento" />

      <main className="app-main">
        <Titulo sub="Boleto leva de 1 a 3 dias úteis pra cair. Enquanto isso, vamos adiantar algumas informações?">
          Seu boleto está a caminho
        </Titulo>

        <Corpo>
          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <p className="text-body font-semibold text-text-primary">Onde você está</p>
              <span className="text-caption text-text-tertiary">
                {BOLETO_P2.passosFeitos} de {total}
              </span>
            </div>
            <ListaPassos concluidos={BOLETO_P2.passosFeitos} pagamentoPendente mostrarDestino />
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="secondary" full>
              Ver o boleto de {brl(CUSTOS.DAE_JUCEMG + CUSTOS.MENSALIDADE, true)}
            </Button>
            <Button variant="ghost">Prefiro pagar por Pix e adiantar</Button>
          </div>

          <p className="text-micro text-text-tertiary">
            Seu progresso está salvo. Se você já pagou, não cobramos de novo.
          </p>
        </Corpo>

        <Rodape>
          <Button full onClick={onSeguir}>
            Continuar preenchendo
          </Button>
        </Rodape>
      </main>
    </>
  );
}
