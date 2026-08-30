"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { Checkbox, Campo, Texto, OpcoesLinha } from "@/components/ui/form";
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
                {canalConvite === "whatsapp" ? "Enviar convite pro Bruno no WhatsApp" : "Enviar convite pro Bruno por e-mail"}
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
    id: "certificado",
    estado: "feito",
    titulo: "Certificado digital validado",
    sub: "Você já resolveu isso antes de assinar. Pra renovar ou trocar depois, é só entrar em Mais.",
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

// 🔄 28/08 (correção do Pedro) — `concluidos` era 4 (contava os 2 CNAEs como
// feitos), mas o destino real do retomar é a C0 (`/retomar/page.tsx` manda
// pra `/dossie/atividade` ou `/dossie/ocupacao`) — quem volta aqui ainda NÃO
// escolheu CNAE nenhum. 2 = só os 2 passos de pré-pagamento (dados base +
// plano escolhido e pago); "CNAE principal da empresa" é a vez agora.
const ESTADO_P1 = { diasFora: 6, concluidos: 2 };

/** Cartão-resumo do progresso — badge "Constituição"+%, "Você está em/X de Y
 *  passos", meta "Agora"+2ª info à direita. Origem: `components/lab/
 *  validados.tsx` (asset "Cartão de saldo — progresso"), promovido pra
 *  produção aqui — usado nas 2 telas da cauda que retomam o cliente
 *  (Retomar de onde parou / Boleto a caminho). */
function CartaoResumoPassos({
  titulo,
  pct,
  feito,
  total,
  agora,
  metaDirRotulo,
  metaDirValor,
  escuro = false,
}: {
  /** 🔄 28/08 (pedido do Pedro) — "coloque o bem-vindo dentro desse card,
   *  ficando 1 só": funde o hero de saudação com o resumo de progresso. */
  titulo?: string;
  pct: number;
  feito: number;
  total: number;
  agora: string;
  metaDirRotulo: string;
  metaDirValor: string;
  /** 🧪 28/08 (pedido do Pedro) — "só pra eu ver", preview em modo escuro.
   *  Não é decisão travada, `false` continua o padrão (light-only). */
  escuro?: boolean;
}) {
  return (
    <div
      className={`rounded-[24px] p-5 ${escuro ? "text-text-on-dark" : "border border-border-hairline bg-surface-card"}`}
      style={
        escuro
          ? {
              background:
                "radial-gradient(120% 100% at 0% 0%, color-mix(in srgb, var(--color-action-primary) 45%, transparent) 0%, transparent 55%), var(--color-surface-dark)",
            }
          : undefined
      }
    >
      {titulo && <p className="mb-4 text-display font-bold leading-tight">{titulo}</p>}
      <div className="flex items-center justify-between">
        <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${escuro ? "bg-white/10" : "bg-surface-alt"}`}>
          <IconeBandeiraPasso />
          <span className={`text-micro font-semibold ${escuro ? "" : "text-text-primary"}`}>Constituição</span>
        </span>
        <span className={`text-caption font-bold ${escuro ? "text-text-on-dark/60" : "text-text-tertiary"}`}>{pct}%</span>
      </div>
      <p className={`mt-4 text-caption ${escuro ? "text-text-on-dark/60" : "text-text-tertiary"}`}>Você está em</p>
      <p className={`text-h1 font-bold leading-tight ${escuro ? "" : "text-text-primary"}`}>
        {feito} de {total} passos
      </p>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className={`text-micro ${escuro ? "text-text-on-dark/60" : "text-text-tertiary"}`}>Agora</p>
          <p className={`text-caption font-semibold ${escuro ? "" : "text-text-primary"}`}>{agora}</p>
        </div>
        <div className="text-right">
          <p className={`text-micro ${escuro ? "text-text-on-dark/60" : "text-text-tertiary"}`}>{metaDirRotulo}</p>
          <p className={`text-caption font-semibold ${escuro ? "" : "text-text-primary"}`}>{metaDirValor}</p>
        </div>
      </div>
    </div>
  );
}

function IconeBandeiraPasso() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 21V4" />
      <path d="M4 5h13l-2 4 2 4H4" />
    </svg>
  );
}

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
        <Rodape>
          <Button full disabled={!cpfOk} onClick={onContinuar}>
            Continuar
          </Button>
        </Rodape>
      </main>
    </>
  );
}

export function RetomarView({
  mei = false,
  temSocios = true,
  onSeguir,
}: {
  /** MEI não tem "Sócios" na lista (repassa pra `ListaPassos`). */
  mei?: boolean;
  /** ME "Só eu" também não tem "Sócios" na lista. */
  temSocios?: boolean;
  onSeguir?: () => void;
}) {
  const passos = passosDoCliente({ mei, temSocios });
  const feito = ESTADO_P1.concluidos;
  // ⚠️ O destino ("Empresa constituída") NÃO entra no denominador — mesma
  // régua de sempre (`lista-passos.tsx`): passo é o que o cliente FAZ, o
  // destino é o que ele RECEBE. A barra de progresso é chrome novo (A5), o
  // número "X de Y" continua exatamente o de antes.
  const total = passos.length;
  const pct = Math.round((feito / total) * 100);

  return (
    <>
      <TelaHeader meta="Continuando" />

      <main className="app-main">
        {/* 🔄 28/08 (pedido do Pedro: "layout da A5, só layout") — mesma
            estrutura da Home dia-1: hero escuro com o título, depois um card
            branco com barra de progresso + trilha conectada. Conteúdo e
            estados não mudaram, só a casca. */}
        <div className="min-h-0 flex-1 overflow-y-auto pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-4 pb-[calc(24px+var(--safe-bottom))]">
            {/* 🔄 28/08 (pedido do Pedro: "coloque o bem-vindo dentro desse
                card, ficando 1 só") — hero de saudação + resumo de progresso
                fundidos num cartão só (era 2 cartões separados). */}
            <CartaoResumoPassos
              titulo="Bem-vindo de volta"
              pct={pct}
              feito={feito}
              total={total}
              agora={passos[feito]?.nome ?? "—"}
              metaDirRotulo="Saiu há"
              metaDirValor={`${ESTADO_P1.diasFora} dias`}
              escuro
            />

            <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
              <ListaPassos concluidos={feito} mostrarDestino mei={mei} temSocios={temSocios} />
            </div>

            <p className="text-micro text-text-tertiary px-1">
              Seu pagamento está registrado. Nada é cobrado nem aberto duas vezes.
            </p>
          </div>
        </div>

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

// 🔄 28/08 (correção do Pedro) — era 7 (contava até "Sócios" como feito), mas
// o destino real do "Continuar" desta tela é a C0 (`/aguardando/page.tsx`
// manda pra `/dossie/atividade` ou `/dossie/ocupacao`), o mesmo ponto do
// retomar: quem está aqui pagou por boleto e ainda NÃO escolheu CNAE nenhum.
// 2 = dados base + plano escolhido e pago; "CNAE principal da empresa" é a
// vez agora. O boleto pendente não trava nada além disso — só "Revisar e
// confirmar" (o desfecho) fica retido até compensar.
const BOLETO_P2 = { passosFeitos: 2 };

export function AguardandoView({
  mei = false,
  temSocios = true,
  onSeguir,
}: {
  /** 🆕 04/08 — MEI não paga taxa da Junta e tem mensalidade própria
   *  (`CUSTOS.MENSALIDADE_MEI`) — esta tela ainda cravava DAE+mensalidade
   *  genérica no boleto, mesmo gap já corrigido em `wizard-dinheiro.tsx`.
   *  Também: MEI não tem "Sócios" na lista (repassa pra `ListaPassos`). */
  mei?: boolean;
  /** ME "Só eu" também não tem "Sócios" na lista. */
  temSocios?: boolean;
  onSeguir?: () => void;
}) {
  const passos = passosDoCliente({ mei, temSocios });
  const total = passos.length;
  const pct = Math.round((BOLETO_P2.passosFeitos / total) * 100);
  const boleto = mei ? CUSTOS.MENSALIDADE_MEI : CUSTOS.DAE_JUCEMG + CUSTOS.MENSALIDADE;

  return (
    <>
      <TelaHeader meta="Seu pagamento" />

      <main className="app-main">
        {/* 🔄 28/08 (pedido do Pedro: "layout da A5, só layout") — mesma
            estrutura da Home dia-1: hero escuro (com os 2 CTAs de boleto
            virando chips, no idioma do CNPJ-copiar/Cartão-CNPJ do A5), card
            branco com progresso + trilha. Conteúdo e estados intactos. */}
        <div className="min-h-0 flex-1 overflow-y-auto pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-4 pb-[calc(24px+var(--safe-bottom))]">
            <div
              className="rounded-2xl p-5 text-text-on-dark"
              style={{
                background:
                  "radial-gradient(120% 100% at 0% 0%, color-mix(in srgb, var(--color-action-primary) 45%, transparent) 0%, transparent 55%), var(--color-surface-dark)",
              }}
            >
              <p className="text-h2 font-bold leading-tight">Seu boleto está a caminho</p>
              <p className="mt-1 text-caption text-text-on-dark/70">
                Boleto leva de 1 a 3 dias úteis pra cair. Enquanto isso, vamos
                adiantar algumas informações?
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-full bg-surface-card px-3 py-1.5 text-caption font-semibold text-text-primary transition-colors active:bg-surface-alt"
                >
                  Ver o boleto de {brl(boleto, true)}
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-full border border-border-hairline px-3 py-1.5 text-caption font-medium text-text-on-dark/80 transition-colors active:bg-white/10"
                >
                  Prefiro pagar por Pix
                </button>
              </div>
            </div>

            <CartaoResumoPassos
              pct={pct}
              feito={BOLETO_P2.passosFeitos}
              total={total}
              agora={passos[BOLETO_P2.passosFeitos]?.nome ?? "—"}
              metaDirRotulo="Boleto"
              metaDirValor="1 a 3 dias úteis"
            />

            <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
              <ListaPassos
                concluidos={BOLETO_P2.passosFeitos}
                pagamentoPendente
                mostrarDestino
                mei={mei}
                temSocios={temSocios}
              />
            </div>

            <p className="text-micro text-text-tertiary px-1">
              Seu progresso está salvo. Se você já pagou, não cobramos de novo.
            </p>
          </div>
        </div>

        <Rodape>
          <Button full onClick={onSeguir}>
            Continuar preenchendo
          </Button>
        </Rodape>
      </main>
    </>
  );
}
