"use client";

import Link from "next/link";
import Image from "next/image";
import { type ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso, Rolagem } from "@/components/ui/tela";
import { Checkbox, Campo, Texto, OpcoesLinha } from "@/components/ui/form";
import { PillCnpj, AprendaGradiente } from "@/components/lab/campea-blocks";
import { QuemCuida } from "@/components/lab/ref9-blocks";
import { CUSTOS, brl } from "@/lib/fiscal";
import { passosDoCliente } from "@/lib/passos";
import { PainelView, ETAPAS_ABERTURA, type Etapa, type Recusa } from "@/components/painel";
import {
  CLIENTE,
  TEM_SOCIO,
  SOCIO_2,
  NOME_EMPRESARIAL,
  CNAE_PRINCIPAL,
  CNAES_SECUNDARIAS,
} from "@/app/(app)/dossie/mock";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * A CAUDA (N19–N24) + AS 2 PAUSAS DE PAGAMENTO (P1, P2) — fonte única, 29/07.
 * ═══════════════════════════════════════════════════════════════════════════
 * Mesma regra do `wizard-dinheiro.tsx`/`wizard-dossie.tsx`: a TELA mora aqui, e
 * as `page.tsx` de produção viram wrappers finos. Nenhuma teve o pixel mudado
 * na extração — só ganharam `onSeguir`/`onVoltar` (a maioria não tinha CTA
 * ligado a lugar nenhum, porque nenhuma delas tinha sido apresentada ainda).
 *
 * ⚠️ `PainelView` (N21 + REC) **não está aqui** — mora em `components/painel.tsx`.
 * 🔒 31/08 (reunião Rua Satélite 38-40, pedido do Pedro) — deixou de ser só do
 * MEI/Migrar: `AguardandoView` (P2/E9, logo abaixo) agora DELEGA pra ela. A2
 * fundiu com E9 — os 9 passos do dossiê + as 3 etapas pós-dossiê (Junta) viraram
 * UMA jornada só, na MESMA tela, e é essa tela que `/retomar` sempre mostra.
 * `RetomarView` (a tela própria de "bem-vindo de volta") foi RETIRADA — reentrada
 * agora é sempre `/aguardando` (só a CPF-gate, `RetomarCpfView`, continua aqui).
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
  aceito: aceitoProp,
  setAceito: setAceitoProp,
}: {
  onSeguir?: () => void;
  onVoltar?: () => void;
  /**
   * 🆕 01/09 (decisão do Pedro) — o aceite irreversível, que era a tela A2
   * inteira (`/termo`), virou o ÚLTIMO bloco desta tela.
   *
   * ─── POR QUE A A2 DEIXOU DE EXISTIR ────────────────────────────────────
   * A tela inteira existia pra dizer uma coisa só: a taxa da Junta não volta
   * depois que a gente registra. Isso já está no contrato aceito no pagamento
   * (E9) — aqui é REFORÇO, e reforço não merece uma tela própria depois de a
   * pessoa já ter atravessado 9 passos de dossiê. O texto miúdo que explicava
   * o não-reembolso virou link ("não é reembolsável") que abre um popup pra
   * quem quiser ler: quem já entendeu segue, quem quer detalhe tem onde ler.
   *
   * O aceite continua sendo EXPRESSO e continua travando o CTA — a garantia
   * jurídica não mudou de lugar, só a moldura.
   *
   * Estado controlado (opcional): a página passa `aceito`/`setAceito` quando
   * quer guardar a resposta; sem props, a tela controla sozinha.
   */
  aceito?: boolean;
  setAceito?: (v: boolean) => void;
  /** 🆕 03/08 — MEI: some capital social (não existe), a taxa da Junta
   *  (não passa por lá) e o enquadramento Simples/Anexo (MEI é DAS fixo, não
   *  Anexo/Fator R). 🔴 valor exato do DAS-MEI 2026 NÃO está ratificado no
   *  vault — por isso a tela diz "DAS fixo" sem número, em vez de inventar. */
  mei?: boolean;
}) {
  const d = useRevisao();
  const [aceitoLocal, setAceitoLocal] = useState(false);
  const aceito = aceitoProp ?? aceitoLocal;
  const setAceito = setAceitoProp ?? setAceitoLocal;
  return (
    <>
      <TelaHeader meta="Revisar" onVoltar={onVoltar} />

      <main className="app-main">
        {/* 🆕 28/08 — o subtítulo era único e dizia "a gente já começa a
            registrar isso na Junta com o seu nome". Duas coisas falsas no MEI:
            ele não passa pela Junta Comercial (o registro é no Portal do
            Empreendedor), e não somos nós que registramos — é o titular, com a
            conta gov.br dele. Ver `abertura-mei-processo.md` §Bloco 1. */}
        <Titulo
          sub={
            mei
              ? "Confira com calma. É com esses dados que a gente monta o seu registro, e é você quem vai finalizar no Portal do Empreendedor."
              : "Confira com calma. Depois que você autoriza, a gente já começa a registrar isso na Junta com o seu nome."
          }
        >
          Está tudo certo?
        </Titulo>

        <Corpo>
          <Bloco titulo="Você" passo="Seus dados">
            <Linha rotulo="Nome" valor={d.socio.nome} />
            <Linha rotulo="CPF" valor={d.socio.cpf} />
            <Linha rotulo="Contato" valor={d.socio.contato} />
          </Bloco>

          <Bloco titulo="A empresa" passo="Dados da empresa">
            {/* No MEI a razão social não é escolhida: sai automática do CNPJ +
                nome civil (Lei 14.195/2021). Mostrar um nome aqui daria a
                entender que houve escolha — e que ela pode ser recusada. */}
            <Linha
              rotulo="Nome"
              valor={mei ? "Sai automático: seu CNPJ + seu nome" : d.empresa.razao}
            />
            <Linha rotulo="Tipo" valor={mei ? "MEI" : d.empresa.natureza} />
            <Linha rotulo="Endereço" valor={d.empresa.endereco} />
            {/* 🗑️ 01/09 (decisão do Pedro) — "Capital social" SAIU do recap.
                O ADR de 31/08 já dizia que o capital sai da tela "por completo
                (nem card informativo)" quando virou valor travado em R$10.000
                no backend; o C4 foi limpo naquele dia e este recap ficou pra
                trás, mostrando um dado que a pessoa nunca informou. */}
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

          {/* 🗑️ 01/09 (decisão do Pedro) — o card "Taxa da Junta (já paga)"
              SAIU. Ele estava mentindo desde 26/08: a DAE deixou de ser cobrada
              no checkout e passou a ser paga DEPOIS, quando a viabilidade volta
              deferida — ou seja, neste ponto da jornada ela ainda não foi paga.
              O lugar dela agora é a tela da guia (`/guia`), que é onde ela de
              fato é cobrada. */}

          {/* 🔄 01/09, 2ª rodada (decisão do Pedro) — o aceite do ME MUDOU DE
              TELA de novo, e desta vez pro lugar onde o gesto acontece: a tela
              de pagamento da guia (`/guia`). É lá que a taxa vira gasto
              irreversível; aqui a frase "a taxa já paga não é reembolsável"
              ficava descolada, porque nada tinha sido pago ainda.
              O MEI mantém o aceite aqui: ele não paga guia nenhuma, então não
              existe uma tela de pagamento depois desta pra carregar o aceite. */}
          {mei && (
            <Checkbox checked={aceito} onChange={setAceito}>
              Autorizo a Legalizai a preparar minha abertura, e entendo que o
              registro final é feito por mim no Portal do Empreendedor.
            </Checkbox>
          )}
        </Corpo>

        <Rodape>
          {/* 🔄 01/09 — no ME o CTA não depende mais de aceite: o aceite mudou
              pra tela da guia. No MEI (que não paga guia) ele continua travando. */}
          <Button full disabled={mei && !aceito} onClick={onSeguir}>
            {mei ? "Autorizo, pode abrir" : "Confirmar e seguir"}
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

/**
 * 🗑️ 01/09 (2ª rodada) — `AceiteIrreversivel` foi removido daqui: o aceite
 * do ME mudou pra tela de pagamento da guia (`/guia`), onde a taxa de fato
 * vira gasto. O componente equivalente vive agora em `wizard-dinheiro.tsx`
 * (`AceiteIrreversivelGuia`), com a mesma estrutura (input irmão do texto) e
 * reusando o `SheetNaoReembolsavel` daqui.
 */
/**
 * 🆕 01/09 — o detalhe que morava na tela A2, agora sob demanda.
 *
 * Mesmo bottom-sheet do DS (`EnviarSheet`): overlay que escurece, folha que
 * sobe, fecha no toque fora ou no botão. Só o conteúdo muda — quem quiser
 * entender o não-reembolso lê aqui, sem custar uma tela a mais pra quem já
 * entendeu.
 */
export function SheetNaoReembolsavel({ onFechar }: { onFechar: () => void }) {
  const [entrou, setEntrou] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntrou(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const sair = () => {
    setEntrou(false);
    window.setTimeout(onFechar, 240);
  };

  return (
    <div className="absolute inset-0 z-[60]">
      <button
        type="button"
        aria-label="Fechar"
        onClick={sair}
        className={`absolute inset-0 bg-[#10151b] transition-opacity duration-300 ${
          entrou ? "opacity-45" : "opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sobre a taxa da Junta"
        className="absolute inset-x-0 bottom-0 flex flex-col rounded-t-3xl bg-surface-page px-5"
        style={{
          transform: entrou ? "translateY(0)" : "translateY(100%)",
          transition: "transform .34s cubic-bezier(.22,1,.36,1)",
          boxShadow: "0 -14px 44px -14px rgba(20,23,28,.32)",
          paddingBottom: "calc(16px + var(--safe-bottom))",
        }}
      >
        <div className="shrink-0 pt-2.5">
          <div className="mx-auto h-1 w-9 rounded-full bg-border-strong" />
        </div>

        <p className="mt-4 text-body-strong font-semibold text-text-primary">
          Por que a taxa da Junta não volta
        </p>

        <div className="mt-3 flex flex-col gap-2.5">
          <Camada>
            A taxa é do <strong>governo</strong>, não nossa: ela paga o registro
            na Junta Comercial de Minas e é repassada inteira.
          </Camada>
          <Camada>
            Depois que o processo é protocolado, o Estado já prestou o serviço —
            é por isso que não existe devolução, nem por nós nem por eles.
          </Camada>
          <Camada>
            <strong>Antes de você autorizar, nada disso aconteceu.</strong> Se
            desistir agora, você recebe de volta tudo o que pagou, inclusive a
            taxa.
          </Camada>
          <Camada>
            A nossa mensalidade é outra história: essa você cancela quando
            quiser, respeitando o prazo do plano.
          </Camada>
        </div>

        <div className="mt-5">
          <Button full variant="secondary" onClick={sair}>
            Entendi
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * ⚠️ 01/09 — `TermoView` (a tela A2, `/termo`) foi APOSENTADA: o aceite virou
 * o último bloco do A1 (`RevisarView`), com o detalhe do não-reembolso em
 * popup. O componente segue aqui só pra não quebrar o Storybook e o histórico
 * de review; nenhuma rota navega mais pra ele. Se em algum momento a decisão
 * voltar atrás, é este componente que volta — não reescrever do zero.
 */
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
            {/* 🔴 28/08 — a copy do MEI dizia "Registra sua empresa no Portal
                do Empreendedor", o que é uma PROMESSA QUE NÃO DÁ PRA CUMPRIR:
                não existe API nem procuração que cubra o registro, e a senha
                gov.br é intransferível por Termo de Uso. Ver
                `pesquisa/abertura-mei/abertura-mei-processo.md` §Bloco 1.
                O que a gente faz de verdade é conferir e deixar pronto. */}
            <ul className="flex flex-col gap-2">
              {mei ? (
                <>
                  <Item>
                    Nosso time confere seus dados e a ocupação que você
                    escolheu.
                  </Item>
                  <Item>
                    A gente deixa cada campo pronto, na ordem do Portal do
                    Empreendedor.
                  </Item>
                  <Item>
                    Você finaliza o registro com a sua conta gov.br, e o CNPJ
                    sai na hora.
                  </Item>
                  <Item>
                    Com o CNPJ na mão, a gente assume guias, notas e
                    declarações.
                  </Item>
                </>
              ) : (
                <>
                  <Item>Protocola sua empresa na Junta Comercial de Minas.</Item>
                  <Item>A taxa que você já pagou cobre esse registro.</Item>
                  <Item>
                    Segue com Receita, Simples e Prefeitura até o CNPJ ativar.
                  </Item>
                </>
              )}
            </ul>
          </div>

          <Aviso
            variante="warning"
            titulo={
              mei
                ? "O registro em si é você quem faz"
                : "A partir daqui, não dá pra desfazer"
            }
          >
            {mei
              ? "O governo não permite que ninguém abra um MEI no lugar de outra pessoa: o Portal exige a sua conta gov.br, e ela é pessoal. A gente faz todo o resto, e te acompanha nesse passo. Depois de registrado, não tem como desfazer."
              : "É o ponto sem volta: o que a Junta registrar a partir de agora não tem como ser desfeito. Vale conferir tudo antes de autorizar."}
          </Aviso>

          {/* 🆕 28/08 — as 3 declarações do formulário oficial. No MEI elas
              não são letra miúda: a de dispensa de alvará (Res. CGSIM 59/2020)
              transfere responsabilidade cível e penal pro titular, e é ele que
              vai marcar o aceite lá no Portal. Chegar nessa tela sem nunca ter
              lido o que está aceitando seria o oposto da nossa doutrina de
              honestidade antes do toque. */}
          {mei && (
            <div>
              <p className="text-body-strong font-semibold text-text-primary mb-2">
                O que você vai declarar no Portal
              </p>
              <div className="flex flex-col gap-2.5">
                <Camada>
                  Que não é impedido por lei de ser empresário, e que não tem
                  outra empresa ativa no seu nome.
                </Camada>
                <Camada>
                  Que opta pelo Simples Nacional na forma do SIMEI, o regime de
                  valor fixo mensal.
                </Camada>
                <Camada>
                  Que sua atividade é de baixo risco, assumindo o compromisso de
                  seguir as normas municipais. É esse termo que dispensa o
                  alvará em Belo Horizonte.
                </Camada>
              </div>
            </div>
          )}

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
              ? "Autorizo a Legalizai a preparar minha abertura, e entendo que o registro final é feito por mim no Portal do Empreendedor."
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

/* ═══════════════════ CERTIFICADO DIGITAL — ANTES da assinatura ══════════
 * 🆕 26/08 (reunião Rua Satélite 36, item 7) — REINTRODUZIDO, MAS REORDENADO.
 * Existia antes uma `CertificadoView`/`/certificado` no N24 antigo (removida
 * como órfã em 30/07, ver comentário mais abaixo — nada navegava até lá). Não
 * é a mesma coisa: aquela vinha DEPOIS da assinatura, esta vem ANTES, por um
 * motivo estrutural apontado na reunião: a PROCURAÇÃO eletrônica (que sai
 * junto da assinatura, `CodigoGovView` abaixo) EXIGE o certificado digital já
 * validado — não dá pra assinar procuração com um certificado que ainda não
 * existe no sistema. Antes disso ser corrigido, a ordem documentada (A4→A5)
 * tinha o certificado como item "agora" da home dia-1, ou seja, DEPOIS de já
 * ter assinado — uma inconsistência real, não só reordenação por preferência.
 *
 * Reusa o MESMO padrão visual/copy de `/mais/certificado?status=pendente`
 * (upload arquivo+senha), que continua existindo no Portal pra RENOVAÇÃO/
 * troca depois — aqui é a PRIMEIRA vez, então soma a pergunta "já tem ou não"
 * que lá não precisa (lá já se sabe que tem, é troca).
 */
export function CertificadoGateView({
  onSeguir,
  onVoltar,
  mei = false,
}: {
  onSeguir?: () => void;
  onVoltar?: () => void;
  /**
   * 🆕 28/08 (decisão do Pedro) — o MEI TAMBÉM passa por esta tela, e ela muda
   * em dois pontos:
   *
   * 1. **O motivo.** No ME o certificado destrava a PROCURAÇÃO que acompanha a
   *    assinatura do contrato social. No MEI não existe assinatura nem
   *    procuração de abertura — a abertura dispensa certificado por completo
   *    (gov.br Prata/Ouro supre). O que ele destrava é a OPERAÇÃO: puxar guia,
   *    mexer no FGTS Digital, agir por procuração sem pedir a senha do cliente
   *    toda vez.
   *
   * 2. **Quem paga.** No ME o certificado vem incluso (contrapartida da
   *    fidelidade, ADR 04/08). No MEI **não vem** — decisão de 28/08. Dizer
   *    "por nossa conta" aqui seria promessa falsa.
   */
  mei?: boolean;
}) {
  const [caminho, setCaminho] = useState<"pergunta" | "tenho" | "nao-tenho">("pergunta");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const completo = arquivo !== null && senha.trim() !== "";

  function enviar() {
    setEnviando(true);
    // 🌾 mesmo padrão do "Analisando" já usado no resto da cauda: loading
    // que explica, não trava sem feedback.
    setTimeout(() => {
      setEnviando(false);
      onSeguir?.();
    }, 1200);
  }

  if (caminho === "pergunta") {
    return (
      <>
        <TelaHeader meta="Certificado digital" onVoltar={onVoltar} />
        <main className="app-main">
          <Titulo
            sub={
              mei
                ? "Abrir o MEI não precisou dele. Cuidar da empresa no dia a dia precisa, e é rápido de resolver."
                : "A procuração eletrônica que vai junto da sua assinatura precisa dele. É rápido de resolver, dos dois jeitos."
            }
          >
            Você já tem certificado digital (e-CNPJ)?
          </Titulo>
          <Corpo>
            {mei ? (
              <>
                <Aviso variante="info" titulo="Pra que serve isso">
                  É o que deixa a gente puxar suas guias, cuidar do FGTS do seu
                  colaborador e agir em nome da empresa sem te pedir senha toda
                  vez. Sem ele a gente ainda te atende, mas cada passo vira uma
                  ida sua ao portal do governo.
                </Aviso>
                {/* 🔴 28/08 — honestidade antes do toque (mesma doutrina do
                    portal): o custo aparece ANTES da escolha, não depois. */}
                <Aviso variante="warning" titulo="O certificado não vem no plano MEI">
                  Ele é seu, não nosso — diferente da mensalidade. Se você não
                  tiver um, a gente te conecta com a nossa certificadora
                  parceira e te passa o valor antes de qualquer coisa.
                </Aviso>
              </>
            ) : (
              <Aviso variante="info" titulo="Pra que serve isso">
                É o que autoriza a gente a emitir nota, pagar guia e assinar
                coisas em nome da sua empresa depois. Sem ele, a procuração não
                sai — por isso resolve antes de assinar, não depois.
              </Aviso>
            )}
          </Corpo>
          <Rodape>
            <Button full onClick={() => setCaminho("tenho")}>
              Já tenho certificado
            </Button>
            <div className="mt-2 flex justify-center">
              <Button variant="ghost" onClick={() => setCaminho("nao-tenho")}>
                Não tenho, preciso de um
              </Button>
            </div>
          </Rodape>
        </main>
      </>
    );
  }

  if (caminho === "nao-tenho") {
    return (
      <>
        <TelaHeader meta="Certificado digital" onVoltar={() => setCaminho("pergunta")} />
        <main className="app-main">
          <Titulo
            sub={
              mei
                ? "Nossa certificadora parceira agenda uma videochamada rápida com você. A gente te passa o valor antes de fechar."
                : "Nossa certificadora parceira agenda uma videochamada rápida com você e providencia um novo, por nossa conta."
            }
          >
            {mei ? "A gente te conecta com a certificadora" : "A gente providencia um novo pra você"}
          </Titulo>
          <Corpo>
            <Aviso variante="info" titulo="Como funciona">
              Alguém do nosso time entra em contato pelo WhatsApp pra marcar o
              melhor horário. A entrevista é por vídeo, leva poucos minutos, e
              ao final o certificado já sai anexado no seu cadastro.
            </Aviso>
            {mei && (
              <p className="text-caption text-text-secondary">
                Você também pode comprar de qualquer certificadora que preferir
                e subir o arquivo aqui depois. Não precisa ser a nossa.
              </p>
            )}
          </Corpo>
          <Rodape>
            <Button full onClick={onSeguir}>
              Entendi, vou aguardar o contato
            </Button>
          </Rodape>
        </main>
      </>
    );
  }

  return (
    <>
      <TelaHeader meta="Certificado digital" onVoltar={() => setCaminho("pergunta")} />
      <main className="app-main">
        <Titulo sub="Sobe o arquivo e a senha. A gente confere e libera em minutos.">
          Envie seu certificado
        </Titulo>
        <Corpo>
          <label className="block">
            <span className="text-micro text-text-tertiary">
              Arquivo do certificado (.pfx ou .p12)
            </span>
            <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-dashed border-border-strong bg-surface-alt px-3 py-3">
              <span className="min-w-0 flex-1 text-caption text-text-secondary">
                {arquivo ? (
                  <span className="truncate font-semibold text-text-primary">
                    {arquivo.name}
                  </span>
                ) : (
                  "Toque pra escolher o arquivo"
                )}
              </span>
              <input
                type="file"
                accept=".pfx,.p12"
                onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
                className="absolute h-0 w-0 opacity-0"
                aria-label="Arquivo do certificado"
              />
            </div>
          </label>

          <Campo rotulo="Senha do certificado">
            <Texto
              valor={senha}
              onChange={setSenha}
              placeholder="A mesma que você usa pra assinar"
              type="password"
            />
          </Campo>

          <p className="text-micro text-text-tertiary">
            A senha fica guardada só pra assinar em seu nome — a gente nunca
            usa pra mais nada.
          </p>
        </Corpo>
        <Rodape>
          <Button full disabled={!completo || enviando} onClick={enviar}>
            {enviando ? "Conferindo..." : "Enviar certificado"}
          </Button>
        </Rodape>
      </main>
    </>
  );
}

/* ═══════════════════ N22 · ASSINATURA (GOV.BR + N23 dobrado) ═══════════ */

type StatusSocio = "voce" | "convidar" | "aguardando" | "assinou";

/**
 * 🐛→🔒 01/09 (achado pelo E2E da constituição) — esta lista tinha mock PRÓPRIO,
 * com o 2º sócio chamado "Bruno Costa", enquanto o dossiê inteiro (fonte única
 * `dossie/mock.ts`, desde 29/07) chama o mesmo sócio de "Carlos Eduardo Silva".
 * Na demo pra gestão a pessoa preenchia o C3 nomeando Carlos e, 4 telas depois,
 * o app convidava Bruno. É exatamente o bug de nome trocado que a fonte única
 * resolveu no dossiê e que tinha sobrevivido aqui na cauda.
 *
 * Também respeita `TEM_SOCIO` agora: com empresa solo, esta lista tem 1 linha
 * só, e o bloco de consenso multi-sócio some (antes o mock forçava sociedade,
 * independente do que a triagem tinha respondido).
 */
const SOCIOS_ASSINATURA: { nome: string; status: StatusSocio }[] = [
  { nome: "Você", status: "voce" },
  ...(TEM_SOCIO ? [{ nome: SOCIO_2.nome, status: "convidar" as StatusSocio }] : []),
];

/** Primeiro nome do sócio, pro CTA do convite ("Enviar convite pro Carlos"). */
const PRIMEIRO_NOME_SOCIO = SOCIO_2.nome.trim().split(/\s+/)[0];

const NIVEL_GOVBR: "bronze" | "prata" | "ouro" = "prata";

/**
 * ⚠️ SEM ESTADO REAL DE CONSENSO (mock pra farol). O produto real trackearia
 * convite→aguardando→assinou por sócio, em dias. Aqui, qualquer CTA habilitado
 * avança a demo pro N24 — simular a espera assíncrona de verdade é trabalho de
 * outro momento (painel/CRM), não desta apresentação.
 */
/**
 * ═══════════════════ CÓDIGO GOV (2FA da procuração + assinatura) ═════════
 * 🆕 24/08 (reunião Leonan 19/08) — o achado mais técnico da reunião. Pra
 * abrir a procuração E assinar o protocolo de registro, o GOV.BR manda um
 * código pro APARELHO do cliente (não pra gente) — a gente pede esse código
 * de volta e tem só **10 minutos** pra usar, senão expira. É a única "trava"
 * de verdade do fluxo GOV inteiro (Leonan: "tem que ter alguém ali, gerou,
 * tem que digitar na hora e validar, senão depois de 10 minutos o código
 * respira").
 *
 * Decisão da reunião: concentrar procuração + assinatura no MESMO pedido de
 * código (antes a procuração vinha antes; virou "joga tudo pra depois",
 * mesmo código serve pros dois) — por isso este componente não separa as
 * duas coisas, é 1 código só pros 2.
 *
 * Até 3 tentativas dentro da janela de 10 minutos; estourou tentativa ou
 * tempo, escala pra atendimento humano (Léo, R19: "o próximo, quando ele
 * entrar de novo, tem que chamar o mano").
 */
export function CodigoGovView({
  onValidar,
  onEscalar,
  onVoltar,
  soProcuracao = false,
}: {
  onValidar?: () => void;
  onEscalar?: () => void;
  onVoltar?: () => void;
  /** 🆕 24/08 (achado da reunião Leonan 19/08, aplicado à MIGRAÇÃO) — na
   *  migração a empresa já existe: não tem protocolo de registro pra assinar,
   *  só a procuração (que dá acesso ao e-CAC/GOV.BR do cliente). Mesmo
   *  código, mesma janela de 10min — só a copy muda. */
  soProcuracao?: boolean;
}) {
  const JANELA_SEGUNDOS = 10 * 60;
  const MAX_TENTATIVAS = 3;

  const [codigo, setCodigo] = useState("");
  const [tentativas, setTentativas] = useState(0);
  const [erro, setErro] = useState(false);
  const [restante, setRestante] = useState(JANELA_SEGUNDOS);

  useEffect(() => {
    if (restante <= 0) return;
    const id = setInterval(() => setRestante((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [restante]);

  const expirou = restante <= 0;
  const semTentativas = tentativas >= MAX_TENTATIVAS;
  const precisaEscalar = expirou || semTentativas;
  const min = String(Math.floor(restante / 60)).padStart(2, "0");
  const seg = String(restante % 60).padStart(2, "0");

  // 🚧 Mock: qualquer código de 6 dígitos "valida". No app real, a API do
  // GOV.BR confirma ou recusa.
  function validar() {
    if (codigo.trim().length < 6) {
      setErro(true);
      return;
    }
    setErro(false);
    setTentativas((t) => t + 1);
    onValidar?.();
  }

  return (
    <>
      <TelaHeader meta="Código do GOV.BR" onVoltar={onVoltar} />
      <main className="app-main">
        <Titulo
          sub={
            soProcuracao
              ? "É o código que chegou no seu app ou celular cadastrado no GOV.BR. Serve pra fazer a procuração — sua empresa já existe, não tem registro novo pra assinar."
              : "É o código que chegou no seu app ou celular cadastrado no GOV.BR. Serve pra procuração e pra assinatura, de uma vez só."
          }
        >
          Digite o código que chegou pra você
        </Titulo>

        <Corpo>
          {!precisaEscalar && (
            <div className="rounded-md border border-border-hairline bg-surface-alt px-3 py-2.5 text-center">
              <span className="text-caption text-text-secondary">Expira em </span>
              <span className="text-body font-semibold text-text-primary tabular-nums">
                {min}:{seg}
              </span>
            </div>
          )}

          {precisaEscalar ? (
            <Aviso variante="warning" titulo={expirou ? "O código expirou" : "As tentativas acabaram"}>
              {expirou
                ? "Passaram os 10 minutos da janela do GOV.BR. Sem problema — um atendente nosso te ajuda a gerar um novo agora."
                : "Foram 3 tentativas sem validar. Pra não te travar sozinho nisso, um atendente nosso assume daqui."}
            </Aviso>
          ) : (
            <>
              <Campo rotulo="Código de 6 dígitos">
                <Texto
                  valor={codigo}
                  onChange={(v) => setCodigo(v.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  inputMode="numeric"
                  erro={erro ? "Confira o código: precisa ter 6 dígitos." : undefined}
                />
              </Campo>
              <p className="text-micro text-text-tertiary">
                Tentativa {tentativas + 1} de {MAX_TENTATIVAS}. Se travar,
                a gente chama um atendente pra te ajudar ao vivo.
              </p>
            </>
          )}
        </Corpo>

        <Rodape>
          {precisaEscalar ? (
            <Button full variant="dark" onClick={onEscalar}>
              Falar com atendente agora
            </Button>
          ) : (
            <Button full onClick={validar}>
              Validar código
            </Button>
          )}
        </Rodape>
      </main>
    </>
  );
}

export function AssinaturaView({
  onSeguir,
  onVoltar,
  onEscalar,
  mei = false,
}: {
  onSeguir?: () => void;
  onVoltar?: () => void;
  /** 🆕 24/08 — código do GOV expirou ou estourou tentativas: escala pra
   *  atendimento humano em vez de travar o cliente sozinho. */
  onEscalar?: () => void;
  /** 🆕 03/08 — MEI assina no Portal do Empreendedor, não na Junta. Sócio já
   *  não se aplica (MEI é sempre solo, `sociedade` abaixo já cobre isso). */
  mei?: boolean;
}) {
  const sociedade = SOCIOS_ASSINATURA.length > 1;
  const bronze = NIVEL_GOVBR === "bronze";
  // 🆕 24/08 — depois de "Assinar no GOV.BR", entra o código único
  // (procuração + assinatura concentrados, ver `CodigoGovView`).
  const [fase, setFase] = useState<"assinar" | "codigo">("assinar");
  const [canalConvite, setCanalConvite] = useState<"whatsapp" | "email">("whatsapp");

  if (fase === "codigo") {
    return (
      <CodigoGovView
        onVoltar={() => setFase("assinar")}
        onValidar={onSeguir}
        onEscalar={onEscalar}
      />
    );
  }

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

              {/* 🆕 24/08 (reunião Leonan 19/08) — link de convite rastreável
                  por canal. O status ("Falta convidar" → "Aguardando" →
                  "Assinou") já existe em `SocioLinha`; isto só torna
                  explícito POR ONDE o convite sai. */}
              {SOCIOS_ASSINATURA[1].status === "convidar" && (
                <Campo rotulo="Enviar convite por">
                  <OpcoesLinha
                    opcoes={[
                      { v: "whatsapp", label: "WhatsApp" },
                      { v: "email", label: "E-mail" },
                    ]}
                    valor={canalConvite}
                    onChange={setCanalConvite}
                  />
                </Campo>
              )}
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
              <Button full onClick={() => setFase("codigo")}>
                {canalConvite === "whatsapp"
                  ? `Enviar convite pro ${PRIMEIRO_NOME_SOCIO} no WhatsApp`
                  : `Enviar convite pro ${PRIMEIRO_NOME_SOCIO} por e-mail`}
              </Button>
              <div className="mt-2 flex justify-center">
                <Button variant="ghost" onClick={() => setFase("codigo")}>
                  Assinar a minha parte agora
                </Button>
              </div>
            </>
          ) : (
            <Button full disabled={bronze} onClick={() => setFase("codigo")}>
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

/**
 * 🆕 24/08 (reunião Leonan 19/08) — status "Procuração" virou explícito na
 * trilha, entre CNPJ e certificado. Conclusão da própria reunião: a
 * procuração some junto do MESMO código GOV da assinatura (ver
 * `CodigoGovView` em `AssinaturaView`) — é instantânea, não é uma espera à
 * parte, mas o cliente merece ver que aconteceu, não só presumir.
 *
 * 🆕 26/08 (reunião Rua Satélite 36, item 7) — "certificado" deixou de ser
 * "agora" e virou "feito": o certificado passou a ser validado ANTES da
 * assinatura (`CertificadoGateView`, novo, entre `/painel` e `/assinatura`),
 * não depois. Por isso, ao chegar nesta trilha pós-assinatura, ele já está
 * pronto — "dados" (conferir a empresa) é quem vira "agora". Rota
 * `/mais/certificado` continua existindo (Portal), mas agora só pra
 * RENOVAR/trocar depois, não pra validar pela 1ª vez.
 */
const PASSOS_ATIVACAO: PassoAtivacao[] = [
  {
    id: "cnpj",
    estado: "feito",
    titulo: "CNPJ aberto",
    sub: "Sua empresa já está ativa na Receita Federal.",
  },
  {
    id: "procuracao",
    estado: "feito",
    titulo: "Procuração assinada",
    sub: "Junto da assinatura do registro. É o que deixa a gente cuidar do DAS e das obrigações por você.",
  },
  {
    /**
     * 🔄 01/09 (decisão do Pedro) — deixou de ser "você já resolveu antes de
     * assinar": o gate de certificado SAIU do caminho de constituição de ME.
     * O certificado é incluso no plano e emitido POR NÓS quando for preciso
     * (promessa que já está escrita na tela do plano), então aqui ele deixa de
     * ser tarefa do cliente e vira aviso do que a gente faz por ele.
     */
    id: "certificado",
    estado: "feito",
    titulo: "Certificado digital por nossa conta",
    sub: "Está incluso no seu plano. A gente emite quando for necessário, sem cobrar nada a mais e sem você precisar resolver isso agora.",
  },
  {
    id: "dados",
    estado: "agora",
    titulo: "Conferir os dados da empresa",
    sub: "Dê uma olhada se está tudo certo no seu cadastro.",
    status: "Em andamento",
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
      <Rolagem>
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
              o selo coral no topo (removido a pedido, mesma data).
              🔄 28/08 (pedido do Pedro) — brilho coral sutil no canto via
              `radial-gradient`, mesmo tratamento aplicado nos 3 heróis
              escuros da cauda (não é o selo sólido removido em 29/07, é um
              degradê de fundo, bem mais discreto). */}
          <div
            className="relative overflow-hidden rounded-2xl p-5 text-text-on-dark"
            style={{
              background:
                "radial-gradient(120% 100% at 0% 0%, color-mix(in srgb, var(--color-action-primary) 45%, transparent) 0%, transparent 55%), var(--color-surface-dark)",
            }}
          >
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
              Terminou de conferir os dados da empresa? Seu app abre por
              completo.
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
      </Rolagem>
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


/**
 * 🆕 30/08 (pedido do Pedro) — PORTA DE ENTRADA da reentrada (P1). Antes o
 * `/retomar` (C0_1) só existia como rota isolada, sem ninguém apontando pra
 * ela (órfã no mapa). Agora o E3 (`EntradaView`, "Voltar de onde parei")
 * manda pra cá primeiro: confirma QUEM é (CPF) antes de mostrar o status.
 *
 * 🔴 MOCK, RF-01: não existe backend real de "status de pagamento por CPF"
 * ainda. A ramificação (boleto pendente → E9.1 · já pago → C0.1) é decidida
 * pelo CONSUMIDOR (`onContinuar`), não por esta view — ela só coleta o CPF,
 * igual ao resto do wizard.
 */
export function RetomarCpfView({
  cpf,
  setCpf,
  onContinuar,
  onVoltar,
}: {
  cpf: string;
  setCpf: (v: string) => void;
  onContinuar?: () => void;
  onVoltar?: () => void;
}) {
  const cpfOk = cpf.replace(/\D/g, "").length === 11;
  return (
    <>
      <TelaHeader meta="Página inicial" onVoltar={onVoltar} />
      <main className="app-main">
        {/* 🆕 01/09 (pedido do Pedro) — mesmo tratamento do E6.1 (código): a
            ilustração ocupa a sobra da tela e se centraliza NELA, com o
            conteúdo ancorado no pé. A pasta entreaberta com papéis dentro diz
            o que a tela promete — nada se perdeu, seu processo está guardado
            aqui — que é a única coisa que importa pra quem volta.
            🔄 01/09 (pedido do Pedro) — −40%: `h-[90%]/414px` → `h-[54%]` com
            teto de 248px. Continua relativa à sobra (cresce e encolhe com o
            aparelho), só ocupa menos dela. */}
        <div className="flex min-h-0 flex-1 items-center justify-center py-4">
          <div id="retomar-flutua" className="relative flex h-[54%] max-h-[248px] items-end">
            {/* Sombra de contato em 2 camadas, igual ao aparelho do E6.1: a
                elipse curta é o apoio na superfície, o drop-shadow segue a
                silhueta e projeta pra direita (direção de luz do DS). */}
            <div
              aria-hidden
              className="absolute -bottom-2 left-1/2 h-5 w-[72%] -translate-x-1/2 blur-md"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(27,30,36,.30), rgba(27,30,36,.10) 62%, transparent 100%)",
              }}
            />
            <Image
              src="/icones/retomar-pasta.png"
              alt=""
              aria-hidden
              width={488}
              height={498}
              priority
              className="relative z-10 h-full w-auto"
              style={{ filter: "drop-shadow(6px 14px 12px rgba(27,30,36,.20))" }}
            />
          </div>

          {/* Flutuação sutil, mesma dosagem do E6.1: durações que não se
              dividem entre si (7s / 5,5s) pra o loop não fechar sempre no
              mesmo ponto e virar sobe-e-desce mecânico.
              ♿ desliga em `prefers-reduced-motion`. */}
          <style jsx global>{`
            @keyframes retomar-flutua-obj {
              0%   { transform: translate3d(0, 0, 0) rotate(0deg); }
              35%  { transform: translate3d(4px, -7px, 0) rotate(0.6deg); }
              70%  { transform: translate3d(-3px, -3px, 0) rotate(-0.5deg); }
              100% { transform: translate3d(0, 0, 0) rotate(0deg); }
            }
            @keyframes retomar-flutua-sombra {
              0%   { transform: translateX(-50%) scaleX(1); opacity: 1; }
              35%  { transform: translateX(-50%) scaleX(0.9); opacity: 0.72; }
              70%  { transform: translateX(-50%) scaleX(0.96); opacity: 0.88; }
              100% { transform: translateX(-50%) scaleX(1); opacity: 1; }
            }
            #retomar-flutua img {
              animation: retomar-flutua-obj 7s ease-in-out infinite;
              will-change: transform;
            }
            #retomar-flutua > div[aria-hidden] {
              animation: retomar-flutua-sombra 5.5s ease-in-out infinite;
              will-change: transform, opacity;
            }
            @media (prefers-reduced-motion: reduce) {
              #retomar-flutua img,
              #retomar-flutua > div[aria-hidden] {
                animation: none;
              }
            }
          `}</style>
        </div>

        {/* Bloco de baixo ancorado no pé (o `flex-1` de cima é quem empurra). */}
        <div className="shrink-0">
        <Titulo sub="A gente confirma onde você parou.">Voltar de onde parei</Titulo>
        <Corpo>
          <Campo rotulo="Seu CPF" dica="É o mesmo que você usou pra começar o cadastro.">
            <Texto
              valor={cpf}
              onChange={setCpf}
              inputMode="numeric"
              maxLength={14}
              placeholder="000.000.000-00"
            />
          </Campo>
        </Corpo>
        </div>
        <Rodape>
          <Button full disabled={!cpfOk} onClick={onContinuar}>
            Continuar
          </Button>
        </Rodape>
      </main>
    </>
  );
}

// 🗑️ 31/08 (validado pelo Pedro, reunião Rua Satélite 38-40) — RetomarView
// REMOVIDA. "Bem-vindo de volta" virou o mesmo `AguardandoView` de sempre
// (com `pago=true`, que já lê como "voltando" — "Tudo certo por aqui. Bora
// continuar de onde você parou?"). Retomar (`/retomar`) hoje só faz a
// CPF-gate (`RetomarCpfView`, abaixo) e manda pra `/aguardando` sempre —
// uma tela única de reentrada, não duas.

/* ═══════════════════ P2 · AGUARDANDO O BOLETO / STATUS DA ABERTURA ══════
   🔒 31/08 (reunião Rua Satélite 38-40, pedido do Pedro) — fundida com o
   antigo A3 (Painel, `components/painel.tsx`). Uma jornada só: os 9 passos
   do dossiê (`passosDoCliente`) primeiro, depois as 3 etapas da Junta
   (`ETAPAS_ABERTURA`, importado de `painel.tsx`). `PainelView` é o motor de
   render (StatusIcon 4-estados); esta função só monta os dados e adapta a
   copy/CTA conforme a fase. ═══════════════════════════════════════════ */

// 🔄 28/08 (correção do Pedro) — era 7 (contava até "Sócios" como feito), mas
// o destino real do "Continuar" desta tela é a C0 (`/aguardando/page.tsx`
// manda pra `/dossie/atividade` ou `/dossie/ocupacao`), o mesmo ponto do
// retomar: quem está aqui pagou por boleto e ainda NÃO escolheu CNAE nenhum.
// 2 = dados base + plano escolhido e pago; "CNAE principal da empresa" é a
// vez agora. O boleto pendente não trava nada além disso — só "Revisar e
// confirmar" (o desfecho) fica retido até compensar.
const BOLETO_P2 = { passosFeitos: 2 };
// 🆕 31/08 — mock da fase pós-dossiê (era o default de `/painel`, ME):
// documentação+viabilidade já ok, DAE aguardando pagamento.
const JUNTA_MOCK = { concluidas: 1, emAndamento: 1 };

export function AguardandoView({
  mei = false,
  temSocios = true,
  pago = false,
  fase = "dossie",
  guiaBoleto = false,
  dossieFeitos,
  junta = JUNTA_MOCK,
  recusa,
  onSeguir,
  onPagarDae,
  onIrParaBloco,
  onAssinar,
  onAcaoRecusa,
}: {
  /** 🆕 04/08 — MEI não tem "Sócios" na lista (repassa pra `passosDoCliente`). */
  mei?: boolean;
  /** ME "Só eu" também não tem "Sócios" na lista. */
  temSocios?: boolean;
  /**
   * 🆕 30/08 (pedido do Pedro) — E9.1P do mapa: variante "pago" pra quem pagou
   * por método instantâneo (cartão/Pix) via E9.S. Só importa enquanto
   * `fase === "dossie"` — na fase "junta" o pagamento já é passado.
   */
  pago?: boolean;
  /**
   * 🔒 31/08 (fusão A3+E9, pedido do Pedro) — a MESMA tela cobre 2 fases da
   * jornada: "dossie" (preenchendo C0-C7, era o `AguardandoView` de sempre) e
   * "junta" (dossiê fechado, era o `PainelView`/A3 isolado). Uma única rota
   * (`/aguardando`) e um único destino de "retomar" — a fase é que muda a
   * copy do hero e se existe CTA fixo no rodapé.
   */
  fase?: "dossie" | "junta";
  /**
   * 🆕 01/09 (pedido do Pedro) — a guia da Junta foi paga por BOLETO e está
   * esperando compensar. A etapa da DAE muda de "sua vez de pagar" pra
   * "aguardando compensação": segue girando, e as ações viram ver o boleto e
   * adiantar por Pix (mesmo par que o hero do E9.1 já oferecia pro boleto da
   * mensalidade). Sem isto, quem pagou por boleto voltava pro status vendo o
   * mesmo CTA de pagar, como se nada tivesse acontecido.
   */
  guiaBoleto?: boolean;
  /**
   * 🆕 01/09 — com o CTA da fase Junta no rodapé, o último passo ("Agora é só
   * assinar") precisava de destino: sem isso a tela virava beco depois da guia
   * paga. Leva pro A4.
   */
  onAssinar?: () => void;
  /** Quantos dos 9 passos do dossiê já foram feitos (fase "dossie"). Default
   *  = mock de sempre (`BOLETO_P2`). */
  dossieFeitos?: number;
  /** Progresso dentro das 3 etapas pós-dossiê (fase "junta"). */
  junta?: { concluidas: number; emAndamento: number };
  /** Recusa de nome na Junta — etapa é relativa às 3 etapas pós-dossiê (0-2). */
  recusa?: Omit<Recusa, "etapa"> & { etapa: number };
  onSeguir?: () => void;
  onPagarDae?: () => void;
  /**
   * 🆕 01/09 (pedido do Pedro) — navegação por BLOCO da timeline: continuar de
   * onde parou e, nos blocos já concluídos, voltar pra corrigir. Sem isto o
   * "Ajustar" nem aparece (`PainelView` só o mostra quando há pra onde ir).
   */
  onIrParaBloco?: (rota: string, blocoId: number) => void;
  onAcaoRecusa?: () => void;
}) {
  const passos = passosDoCliente({ mei, temSocios });
  const dossieTotal = passos.length;
  const feitos = dossieFeitos ?? BOLETO_P2.passosFeitos;

  const naFaseJunta = fase === "junta";

  /**
   * 🐛→🔒 31/08 (correção do Pedro, viu ao vivo) — com o boleto pendente, o
   * anel girando estava no passo do CNAE, dando a entender que a espera era
   * pelo CNAE. A espera é pelo BANCO: quem gira é o passo "Plano escolhido e
   * pago" (i=1), e o nome dele vira só "Plano escolhido" enquanto isso
   * (`nomeEnquantoGirando` — "e pago" mentiria, nada compensou ainda). Os
   * passos do dossiê ficam todos a-fazer, porque estão travados mesmo.
   */
  const indiceGirandoBoleto = passos.findIndex((p) => p.aguardaCompensacao);
  const boletoPendente = !naFaseJunta && !pago && indiceGirandoBoleto >= 0;

  // A lista combinada: os 9 passos do dossiê primeiro, depois as 3 etapas da
  // Junta — UMA jornada só, do 1º dado digitado ao CNPJ sair.
  // 🆕 31/08 (pedido do Pedro) — cada passo carrega `descricao` (o que envolve
  // + quanto tempo leva, ver `lib/passos.ts`); o PainelView só mostra a do
  // passo ATUAL, como orientação do que vem pela frente.
  const etapasDossie: Etapa[] = passos.map((p, i) => ({
    nome: boletoPendente && i === indiceGirandoBoleto ? (p.nomeEnquantoGirando ?? p.nome) : p.nome,
    detalhe: p.descricao,
    // 🆕 01/09 — o bloco vem do próprio passo (`lib/passos.ts`); as 3 etapas
    // da Junta entram todas no bloco 5, junto do "Revisar e confirmar" que as
    // dispara. É o que permite a timeline agrupar.
    bloco: p.bloco,
  }));
  const etapasCombinadas: Etapa[] = [
    ...etapasDossie,
    ...ETAPAS_ABERTURA.map((e) => ({ ...e, bloco: 5 })),
  ];

  const emAndamentoDossie = boletoPendente ? indiceGirandoBoleto : feitos;
  const concluidas = naFaseJunta
    ? dossieTotal + junta.concluidas
    : boletoPendente
      ? indiceGirandoBoleto
      : feitos;
  const emAndamento = naFaseJunta ? dossieTotal + junta.emAndamento : emAndamentoDossie;

  // 🐛→🔒 31/08 (correção do Pedro) — a fase DOSSIÊ não ganha `acaoCliente`
  // inline: o CTA "Continuar preenchendo" já existe fixo no rodapé, e repetir
  // dentro do passo era redundante (ele viu ao vivo, "está redundante"). Só a
  // fase JUNTA usa CTA inline, porque lá NÃO há rodapé fixo (K6) e a ação é
  // pontual daquela etapa (pagar a guia).
  /**
   * 🆕 01/09 (pedido do Pedro) — a etapa da guia tem 2 estados agora:
   *
   * · **a pagar** (default): "Pague a guia da Junta (DAE)" + CTA que abre a
   *   tela de pagamento da taxa (`/guia`).
   * · **aguardando compensação** (`guiaBoleto`): quem pagou por boleto volta
   *   pra cá e vê a etapa esperando o banco, com o boleto à mão e o atalho do
   *   Pix pra quem não quer esperar 1-3 dias. Mesmo par de ações que o hero do
   *   E9.1 já usava pro boleto da mensalidade.
   */
  const etapas = naFaseJunta
    ? etapasCombinadas.map((e, i) => {
        if (i !== emAndamento || !e.acaoCliente) return e;
        if (guiaBoleto) {
          // 🔄 01/09 (correção do Pedro) — SEM card de ação aqui embaixo. As 2
          // ações (ver boleto / adiantar por Pix) sobem pro hero, como chips,
          // igual ao status do boleto da mensalidade: embaixo a etapa fica só
          // girando, dizendo que está esperando. Duplicar a ação nos dois
          // lugares faria a lista disputar atenção com o hero.
          return {
            ...e,
            nome: "Guia da Junta · aguardando compensação",
            detalhe: "Em andamento agora. Te avisaremos quando terminar.",
            acaoCliente: undefined,
          };
        }
        // 🔄 01/09 (pedido do Pedro) — o CTA de pagar a guia SAIU de dentro da
        // etapa e virou o CTA fixo do rodapé, igual ao "Continuar preenchendo"
        // do status do dossiê. Padroniza o gesto: ação principal da tela mora
        // sempre no mesmo lugar, não ora no meio da lista, ora embaixo.
        return { ...e, acaoCliente: undefined };
      })
    : etapasCombinadas;

  const t = naFaseJunta
    ? {
        // 🔄 01/09 — com a guia paga por boleto o hero fala do boleto, igual
        // ao status da mensalidade: o que prende a jornada agora é o banco.
        normal: guiaBoleto ? "Seu boleto está a caminho" : "Estamos abrindo sua empresa",
        recusa: "Precisamos de você num ponto",
      }
    : {
        normal: pago ? "Pagamento confirmado" : "Seu boleto está a caminho",
        recusa: "Precisamos de você num ponto",
      };
  const s = naFaseJunta
    ? {
        normal: guiaBoleto
          ? "Boleto da Junta leva de 1 a 3 dias úteis pra cair. Assim que compensar, a gente segue."
          : "A parte chata é com a gente. Você acompanha por aqui e a gente avisa no WhatsApp a cada passo.",
        recusa: "A abertura seguiu bem até aqui. Um órgão pediu um ajuste, e é rápido de resolver.",
      }
    : {
        // 🐛→🔒 31/08 (correção do Pedro) — "enquanto isso, vamos adiantar
        // algumas informações?" era MENTIRA: com o boleto pendente o dossiê
        // fica travado, não dá pra adiantar nada. Ficou só o fato.
        normal: pago
          ? "Tudo certo por aqui. Bora continuar de onde você parou?"
          : "Boleto leva de 1 a 3 dias úteis pra cair.",
        recusa: "",
      };

  return (
    <PainelView
      eyebrow={naFaseJunta ? "Sua abertura" : "Seu pagamento"}
      titulo={t}
      sub={s}
      // 🆕 31/08 (pedido do Pedro, ao ver a fusão ao vivo) — hero escuro, o
      // mesmo do antigo AguardandoView. Curtiu o status+timeline do Painel,
      // mas quis de volta o "menu superior" escuro por cima, COM os 2 chips
      // de pagamento (valor do boleto + "prefiro pagar por Pix") — sem eles
      // o hero ficava "cru".
      escuro
      heroExtra={
        // 🔄 01/09 (pedido do Pedro) — os chips do hero também aparecem quando
        // a GUIA foi paga por boleto: mesma configuração do status do boleto
        // da mensalidade, só muda o valor (a taxa da Junta).
        (!naFaseJunta && !pago) || guiaBoleto ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full bg-surface-card px-3 py-1.5 text-caption font-semibold text-text-primary transition-colors active:bg-surface-alt"
            >
              Ver o boleto de{" "}
              {brl(
                guiaBoleto
                  ? CUSTOS.DAE_JUCEMG
                  : mei
                    ? CUSTOS.MENSALIDADE_MEI
                    : CUSTOS.MENSALIDADE,
                true,
              )}
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-border-hairline px-3 py-1.5 text-caption font-medium text-text-on-dark/80 transition-colors active:bg-white/10"
            >
              Prefiro pagar por Pix
            </button>
          </div>
        ) : undefined
      }
      concluidas={concluidas}
      emAndamento={emAndamento}
      etapas={etapas}
      onIrParaBloco={onIrParaBloco}
      /**
       * 🔴 Corrigir só existe ANTES do protocolo. Na fase JUNTA os dados já
       * estão com o órgão, e a pessoa aceitou isso na tela do ponto sem volta
       * (`/iniciar-viabilidade`) — deixar o "Ajustar" ali prometeria o que a
       * Junta não permite mais.
       */
      podeAjustar={!naFaseJunta}
      socios={temSocios ? 2 : 1}
      recusa={recusa ? { ...recusa, etapa: dossieTotal + recusa.etapa } : undefined}
      onAcaoRecusa={onAcaoRecusa}
      // K6 dizia: status puro não inventa ação, e na fase Junta a ação morava
      // inline na etapa. 🔄 01/09 (pedido do Pedro) — a ação da fase Junta
      // (pagar a guia) passou pro RODAPÉ, no mesmo lugar do "Continuar
      // preenchendo" do dossiê. O princípio do K6 continua: o CTA só existe
      // quando há ação de verdade — na espera da Junta ou com o boleto da guia
      // pendente ele fica desabilitado, dizendo POR QUE.
      // 🔒 31/08 (correção do Pedro) — enquanto o boleto não compensa, o
      // dossiê fica TRAVADO: o CTA continua visível (a pessoa vê que existe
      // próximo passo) mas desabilitado, senão prometeria uma ação que o
      // backend recusa.
      // 🆕 31/08 (pedido do Pedro) — o rótulo muda junto: desabilitado diz
      // POR QUE está travado ("Aguardando compensar"), não repete a ação que
      // não dá pra fazer.
      ctaNormal={
        !naFaseJunta
          ? {
              label: pago ? "Continuar preenchendo" : "Aguardando compensar",
              onClick: onSeguir,
              desabilitado: !pago,
            }
          : guiaBoleto
            ? {
                // Pagou por boleto: nada a fazer até o banco confirmar. O CTA
                // continua visível (existe próximo passo) mas travado, com o
                // motivo no rótulo — mesma regra do boleto da mensalidade.
                label: "Aguardando compensar",
                desabilitado: true,
              }
            : etapasCombinadas[emAndamento]?.acaoCliente
              ? { label: "Pagar a guia agora", onClick: onPagarDae }
              : emAndamento === etapasCombinadas.length - 1
                ? { label: "Ir para a assinatura", onClick: onAssinar }
                : {
                    // 🆕 01/09 (pedido do Pedro) — quando a vez é do ÓRGÃO, o
                    // CTA não some: fica no mesmo lugar, travado, dizendo o
                    // que está sendo esperado. Some o CTA = a tela perde o
                    // rodapé e muda de anatomia no meio da jornada, que é
                    // justamente o que a padronização veio resolver.
                    label: "Aguardando viabilidade",
                    desabilitado: true,
                  }
      }
      prazo={
        naFaseJunta
          ? undefined
          : "Boleto leva de 1 a 3 dias úteis. Se já pagou, o próximo passo libera assim que compensar."
      }
      idempotencia={
        naFaseJunta
          ? // 🆕 01/09 — a linha do cadeado também aqui: com CTA no rodapé, a
            // tela ganhou a mesma anatomia do status do dossiê (lista → aviso
            // → ação), e a promessa de idempotência vale igual.
            guiaBoleto
            ? "Você paga uma vez só. Se o boleto já foi pago, não cobramos de novo."
            : "A abertura roda uma vez só. Pode fechar o app que o processo segue sozinho, de onde parou."
          : pago
            ? "Seu progresso está salvo. Pode sair e voltar quando quiser."
            : "Seu progresso está salvo. Se você já pagou, não cobramos de novo."
      }
    />
  );
}
