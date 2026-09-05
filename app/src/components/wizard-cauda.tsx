"use client";

import Link from "next/link";
import Image from "next/image";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso, Rolagem } from "@/components/ui/tela";
import { Checkbox, Campo, Texto, OpcoesLinha } from "@/components/ui/form";
import { PillCnpj, AprendaGradiente } from "@/components/lab/campea-blocks";
import { QuemCuida } from "@/components/lab/ref9-blocks";
import { CUSTOS, brl } from "@/lib/fiscal";
import { passosDoCliente } from "@/lib/passos";
// 🆕 03/09 — o recap mostra estado civil, regime de bens e tipo de imóvel com
// o MESMO rótulo que a pessoa viu ao responder (fonte única em `lib/`).
import { ESTADO_CIVIL, REGIME_BENS, TIPO_IMOVEL, rotuloDe } from "@/lib/qualificacao";
/* 🆕 04/09 — fonte única do nome de cada CNAE (oficial IBGE). Ver `lib/cnae`. */
import { nomeCnae } from "@/lib/cnae";
// 🆕 03/09 — nome/CPF/e-mail/telefone não se ajustam aqui (bloco 1): a saída é
// o canal humano, no pé do próprio cartão.
import { linkWhatsApp } from "@/lib/contato";
import { PainelView, ETAPAS_ABERTURA, type Etapa, type Recusa } from "@/components/painel";
/* 🆕 04/09 — rota assistida: da assinatura em diante quem conduz é gente da
   casa. O racional inteiro do corte mora em `components/consultor.tsx`. */
import { CardConsultor, CardCompromisso } from "@/components/consultor";
import {
  CLIENTE,
  TEM_SOCIO,
  SOCIO_2,
  SOCIOS,
  CNAE_PRINCIPAL,
  CNAES_SECUNDARIAS,
  PREENCHIMENTO,
  RAZAO_OPCOES,
  OBJETO_SOCIAL,
  ENDERECO_CEP,
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
 *
 * ─── 🔴 03/09 (varredura pedida pelo Pedro) — O RECAP ESTAVA RASO ──────────
 * Mostrava 8 linhas (nome, CPF, contato, razão, tipo, endereço, CNAEs) numa
 * tela que é a ÚLTIMA antes do irreversível. Ficavam de fora dados que a
 * pessoa digitou à mão, que ninguém valida por ela, e que quando saem errados
 * derrubam o processo na Junta ou na Prefeitura: RG e órgão emissor, data de
 * nascimento, estado civil e regime de bens, endereço residencial, a
 * qualificação inteira de cada sócio, a % de cada um, quem administra, as 3
 * tentativas de razão social (só a 1ª aparecia), o tipo do imóvel, se ela mora
 * nele (a resposta que produziu o indeferimento real na gravação da JUCEMG) e
 * o índice cadastral do IPTU.
 *
 * ─── O CRITÉRIO DO QUE ENTRA (decisão do Pedro, 03/09) ─────────────────────
 * Entra o que a PESSOA informou e vai pro protocolo. NÃO entra o que a gente
 * preenche por ela no backend (capital social, quotas, natureza jurídica,
 * metragem, profissão, qualificação 49/22, forma de atuação...): ela nunca
 * respondeu isso, não tem como julgar se está certo, e pedir conferência de
 * dado nosso só convida erro confiante. Também saiu o que não vai pra Junta
 * (vínculo de INSS, enquadramento/pró-labore estimado): esta tela é sobre o
 * REGISTRO, não sobre o que ela vai pagar depois.
 */
interface SocioRevisao {
  nome: string;
  cpf: string;
  participacao: number;
  administra: boolean;
  nascimento: string;
  nacionalidade: string;
  rg: string;
  orgao: string;
  civil: string;
  regime: string;
  endereco: string;
}

function useRevisao() {
  /**
   * A participação nasce dividida em partes iguais, igual ao C3 (`inicial()`):
   * com 1 sócio extra são 50/50. A do titular é DERIVADA (100 menos a soma),
   * mesma regra de lá — duas fontes de verdade pro mesmo 100% foi o bug que o
   * C3 já tinha resolvido, não vale reintroduzir aqui.
   */
  const extrasQtd = Math.max(0, SOCIOS - 1);
  const pctExtra = extrasQtd > 0 ? Math.round(100 / SOCIOS) : 0;

  const e = PREENCHIMENTO.socioExtra;
  const extras: SocioRevisao[] = TEM_SOCIO
    ? [
        {
          nome: SOCIO_2.nome,
          cpf: e.cpf,
          participacao: pctExtra,
          /**
           * 🚧 No app real vem da resposta do C3 (quem administra). No mock o
           * titular administra sozinho, que é o caso mais comum: é essa
           * resposta que define a qualificação 49 × 22 no DBE.
           */
          administra: false,
          nascimento: e.nascimento,
          nacionalidade: e.nacionalidade,
          rg: e.rg,
          orgao: e.orgao,
          civil: e.civil,
          regime: e.regime,
          endereco: `${ENDERECO_CEP.logradouro}, ${e.numero}${
            e.complemento ? ` · ${e.complemento}` : ""
          }, ${ENDERECO_CEP.bairro}, ${e.cep}`,
        },
      ]
    : [];

  const t = PREENCHIMENTO.socio;
  const titular: SocioRevisao = {
    nome: CLIENTE.nome,
    cpf: CLIENTE.cpf,
    participacao: 100 - extras.reduce((acc, s) => acc + s.participacao, 0),
    administra: true,
    nascimento: t.nascimento,
    nacionalidade: t.nacionalidade,
    rg: t.rg,
    orgao: t.orgao,
    civil: t.civil,
    regime: t.regime,
    endereco: CLIENTE.endereco,
  };

  const emp = PREENCHIMENTO.empresa;
  return {
    titular,
    extras,
    contato: { email: CLIENTE.email, telefone: CLIENTE.telefone },
    atividade: {
      /* 🆕 04/09 — nome vem do dicionário (oficial IBGE), igual ao C0 e ao C5.
         O recap era a 3ª grafia do mesmo código. */
      principal: { cnae: CNAE_PRINCIPAL.cnae, nome: nomeCnae(CNAE_PRINCIPAL.cnae, CNAE_PRINCIPAL.humano) },
      secundarias: CNAES_SECUNDARIAS.map((s) => ({
        cnae: s.cnae,
        nome: nomeCnae(s.cnae, s.humano),
      })),
      objeto: OBJETO_SOCIAL,
    },
    nomes: RAZAO_OPCOES,
    fantasia: PREENCHIMENTO.nome.fantasia,
    empresa: {
      linha1: `${ENDERECO_CEP.logradouro}, ${emp.numero}${
        emp.complemento ? ` · ${emp.complemento}` : ""
      }`,
      linha2: `${ENDERECO_CEP.bairro}, ${emp.cep}`,
      tipoImovel: emp.tipoImovel,
      /**
       * 🚧 Mock: o C4/E3.4 guarda a resposta real. Aqui vale `true` porque o
       * mock é apartamento, e apartamento sem morador é justamente o caso que
       * a Prefeitura indefere (o aviso do C4 existe por causa disso).
       */
      resideNoEndereco: true,
      iptu: emp.iptu,
    },
    /** Só pra manter o recap do MEI de pé, que não mudou nesta rodada. */
    mei: {
      endereco: CLIENTE.endereco,
    },
  };
}

export function RevisarView({
  onSeguir,
  onVoltar,
  mei = false,
  aceito: aceitoProp,
  setAceito: setAceitoProp,
  onAjustar,
  enderecoFiscal = false,
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
  /**
   * 🆕 03/09 (pedido do Pedro) — a pill "Ajustar" de cada seção. Recebe o id
   * do BLOCO (ver `lib/passos.ts`) e a página resolve a navegação (entra na
   * 1ª tela do bloco em `?ajuste=<id>`, o MODO AJUSTE de 01/09).
   * Ausente = pills somem: é o recap read-only, sem volta.
   */
  onAjustar?: (blocoId: number) => void;
  /**
   * 🆕 01/09 — quem escolheu o endereço fiscal da Legalizai no E3.4 não passa
   * pelo C4: não tem IPTU, tipo de imóvel nem "você mora nele" pra conferir.
   * O recap mostra o que ela de fato decidiu (usar o nosso endereço) em vez de
   * campos vazios.
   */
  enderecoFiscal?: boolean;
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
  /**
   * 🆕 04/09 (decisão do Pedro) — CONFERÊNCIA POR SEÇÃO.
   *
   * Recap comprido tem um problema conhecido: ele é lido como decoração. A
   * pessoa rola até o fim, aperta o CTA e só descobre o RG trocado quando a
   * Junta exige. Agora cada seção tem o próprio "Está tudo certo", e o CTA
   * final só destrava quando TODAS foram conferidas — a leitura vira ato, com
   * um toque por seção em vez de um toque no fim de tudo.
   *
   * ⚠️ É um gate, e gate contraria o hábito da casa (o fade de rolagem existe
   * justamente pra NÃO travar o CTA). A diferença: lá o gate punia quem lê
   * rápido, sem nada em troca; aqui a tela é a última antes do irreversível e
   * o custo é 4 toques. Vale registrar a tensão, não desfazer a decisão.
   *
   * Guardado no estado da TELA. Duas consequências que ficam registradas:
   * (a) sair pra ajustar e voltar zera tudo, não só a seção ajustada — hoje
   *     isso não acontece no flow (o modo ajuste termina no `/aguardando`),
   *     e quando o carry-forward real existir, isto sobe pro estado do wizard;
   * (b) o clique em "Ajustar" limpa a seção ANTES de navegar, que é o pedido
   *     do Pedro: entrou pra mexer, revalida, tenha mudado algo ou não.
   */
  const [conferidas, setConferidas] = useState<string[]>([]);

  /**
   * 🔒 03/09 — A VARREDURA NOVA É SÓ DO ME (regra de escopo do CLAUDE.md).
   * O MEI não passa pela Junta, não tem sócio, não escolhe razão social e não
   * responde regulação urbana: o recap detalhado não teria o que mostrar. Ele
   * continua exatamente como estava, aceite incluído.
   */
  if (mei) {
    return (
      <RevisarMeiView
        d={d}
        aceito={aceito}
        setAceito={setAceito}
        onSeguir={onSeguir}
        onVoltar={onVoltar}
        onAjustar={onAjustar}
      />
    );
  }

  const administradores = [d.titular, ...d.extras]
    .filter((s) => s.administra)
    .map((s) => s.nome);

  /**
   * As seções que precisam de conferência. A dos sócios só existe quando há
   * sócio — por isso a lista é derivada, e não uma constante: o denominador do
   * "faltam N" tem que bater com o que está na tela.
   */
  const SECOES = [
    "Seus dados",
    ...(d.extras.length > 0 ? ["Sócios"] : []),
    "Atividades",
    "Dados da empresa",
  ];
  const faltam = SECOES.filter((s) => !conferidas.includes(s)).length;

  /**
   * Tudo que uma seção precisa pro pedido do Pedro, num lugar só: o estado do
   * "Está tudo certo", o toggle, e o "Ajustar" que LIMPA a conferência antes
   * de navegar. Fica junto de propósito — separar o botão do reset é como o
   * segundo nasceria esquecido na próxima seção.
   */
  const secao = (chave: string, blocoId: number) => ({
    passo: chave,
    conferido: conferidas.includes(chave),
    onConferir: () =>
      setConferidas((c) => (c.includes(chave) ? c.filter((x) => x !== chave) : [...c, chave])),
    onAjustar:
      onAjustar &&
      (() => {
        setConferidas((c) => c.filter((x) => x !== chave));
        onAjustar(blocoId);
      }),
  });

  return (
    <>
      {/* 🐛 02/09 — `meta` nomeia o destino: daqui volta pro C7. */}
      <TelaHeader meta="Nome da empresa" onVoltar={onVoltar} />

      <main className="app-main">
        {/* 🐛 04/09 (pente-fino de copy) — O SUBTÍTULO PROMETIA O QUE NÃO
            ACONTECE AQUI. Ele dizia "depois que você autoriza, a gente já
            começa a registrar na Junta": sobra da época em que o aceite morava
            nesta tela. Desde 01/09 o ME não autoriza nada aqui (o aceite foi
            pra `/guia`) e o CTA leva pro ponto sem volta, não pra Junta. O
            "isso" vago também saiu: é justo a frase que define o risco. */}
        {/* 🔄 04/09 (2ª correção do dia) — dizia "é com esses dados que a gente
            REGISTRA a sua empresa na Junta". Registro é o fim da linha; o que
            sai daqui é o pedido de viabilidade, e o registro só acontece
            depois da guia e da assinatura. Prometer o fim numa tela que abre o
            começo é o mesmo erro que o subtítulo anterior já tinha cometido
            com o aceite. */}
        <Titulo sub="Confira com calma. É com esses dados que a gente dá entrada do seu pedido na Junta, no seu nome.">
          Está tudo certo?
        </Titulo>

        <Corpo>
          {/* ─── VOCÊ ─────────────────────────────────────────────────────
              A ordem é a de um documento: quem é, documento, qualificação,
              onde mora. Nome/CPF/e-mail/telefone vêm do cadastro (bloco 1,
              que não se ajusta) — aparecem porque errar o CPF trava o
              processo inteiro, e a saída é o WhatsApp, no pé do cartão. */}
          <Bloco
            tituloFora
            titulo="Você"
            {...secao("Seus dados", 3)}
            /* ✍️ 04/09 — a lista dos 4 campos repetia os rótulos logo acima. */
            rodape={<PeCadastro texto="Vêm do seu cadastro e não mudam por aqui." />}
          >
            <Linha rotulo="Nome" valor={d.titular.nome} />
            <Linha rotulo="CPF" valor={d.titular.cpf} />
            <Linha rotulo="Data de nascimento" valor={d.titular.nascimento} />
            <Linha rotulo="RG" valor={`${d.titular.rg} · ${d.titular.orgao}`} />
            {/* ✍️ 04/09 — nacionalidade e estado civil eram 2 linhas e são um
                dado só no contrato: a qualificação da pessoa. */}
            <Linha
              rotulo="Qualificação"
              valor={`${d.titular.nacionalidade} · ${civilPorExtenso(d.titular)}`}
            />
            <Linha rotulo="Onde você mora" valor={d.titular.endereco} />
            {/* ✍️ 04/09 — e-mail e telefone viram um par só, igual ao recap
                do MEI: são o mesmo assunto e nenhum dos dois se ajusta aqui. */}
            <Linha rotulo="Contato" valor={d.contato.email} segunda={d.contato.telefone} />
          </Bloco>

          {/* ─── SÓCIOS ────────────────────────────────────────────────────
              🆕 03/09 (decisão do Pedro) — RESUMO COM "VER DETALHES". Cada
              sócio tem 9 campos de qualificação; com 4 sócios abertos de uma
              vez a tela vira um rolo de 40 linhas e ninguém confere nada. O
              resumo mostra o que distingue um do outro (nome, CPF, % e papel)
              e o detalhe abre só pra quem vai conferir de fato. */}
          {d.extras.length > 0 && (
            <Bloco
              tituloFora
              /* 🔄 04/09 (pente-fino de copy) — era "Você e seus sócios". Com
                 o título fora do cartão, dois blocos seguidos começando por
                 "Você" ficaram lendo como a mesma seção repetida. Você segue
                 na lista, marcado com "· você" no cartão. */
              titulo="Sócios"
              {...secao("Sócios", 3)}
              /* 🆕 04/09 (pedido do Pedro) — A SOMA, no pé do bloco. É o único
                 erro caro que a tela não deixava ver: participação que não
                 fecha 100% derruba o contrato na Junta, e é justamente por
                 causa dela que o titular aparece nesta lista. Colorido só
                 quando dá diferente, pra não virar enfeite. */
              rodape={<SomaParticipacoes socios={[d.titular, ...d.extras]} />}
            >
              {/* 🔄 04/09 (pedido do Pedro) — QUEM ADMINISTRA SAIU DE CIMA E
                  VIROU NOTA EMBAIXO. Era uma `Linha` no topo ("Quem administra
                  a empresa: Ana e João") mais uma etiqueta repetida em cada
                  cartão ("· administra" / "· não administra"): o mesmo fato
                  dito 3 vezes, e o cartão fechado virou uma fila de itens
                  separados por ponto que ninguém lê. Agora o cartão guarda só
                  a participação, e a administração é uma nota visual embaixo
                  da lista, com os nomes em negrito. */}
              {[d.titular, ...d.extras].map((s, i) => (
                <CartaoSocio key={s.cpf} socio={s} titular={i === 0} />
              ))}
              <NotaAdministracao nomes={administradores} />
            </Bloco>
          )}

          {/* ─── O QUE A EMPRESA FAZ ───────────────────────────────────────
              O objeto social entra aqui, e não no bloco da empresa, porque é
              DERIVADO destas atividades: ajustar o CNAE é o que o reescreve.
              Entra como leitura (a pessoa nunca digitou nele) mas precisa
              aparecer, porque é o texto que vai pro contrato. */}
          <Bloco
            tituloFora
            titulo="O que a empresa faz"
            {...secao("Atividades", 2)}
          >
            <Linha
              rotulo="Atividade principal"
              valor={`${d.atividade.principal.nome} (${d.atividade.principal.cnae})`}
            />
            {/* ✍️ 04/09 — o rótulo "Atividade secundária" se repetia a cada
                CNAE e lia como dado duplicado. Um rótulo, a lista embaixo. Os
                códigos saíram: ninguém confere o número, confere o nome, e 4
                códigos entre parênteses eram o maior ruído do cartão. O da
                principal fica, que é o que define anexo e alíquota. */}
            {/* 🐛 04/09 (achado do Pedro) — DUAS ATIVIDADES VIRAVAM UM
                PARÁGRAFO SÓ. Os nomes oficiais do IBGE ocupam 2 e 3 linhas
                cada, e a lista era só uma pilha de `<span>`: sem separação,
                não dava pra ver onde uma acaba e a outra começa.
                O conserto é a estrutura contar isso, não o texto: cada
                atividade vira um item com marcador e o CNAE embaixo. O código
                separa, numera e ainda é o dado que vai pro DBE — a única
                coisa que distingue com certeza duas atividades de nome
                parecido. Contagem no rótulo pelo mesmo motivo ("2 atividades
                secundárias" antes de listar as duas). */}
            {d.atividade.secundarias.length > 0 && (
              <div className="flex flex-col">
                <span className="text-micro text-text-tertiary">
                  {d.atividade.secundarias.length > 1
                    ? `${d.atividade.secundarias.length} atividades secundárias`
                    : "Atividade secundária"}
                </span>
                <ul className="mt-1 flex flex-col gap-2">
                  {d.atividade.secundarias.map((s) => (
                    <li key={s.cnae} className="flex gap-2">
                      <span
                        aria-hidden
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-text-tertiary"
                      />
                      <span className="min-w-0">
                        <span className="block text-caption font-semibold text-text-primary">
                          {s.nome}
                        </span>
                        <span className="block text-micro text-text-tertiary">
                          CNAE {s.cnae}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Linha
              rotulo="Objeto social"
              valor={d.atividade.objeto}
              /* 🔄 04/09 — "Gerado" soava a máquina numa tela que fala na voz
                 da casa o tempo todo ("a gente registra", "a gente escreve"). */
              dica="É esse texto que vai no contrato."
            />
          </Bloco>

          {/* ─── A EMPRESA ─────────────────────────────────────────────────
              🆕 03/09 — AS 3 TENTATIVAS, NA ORDEM. O recap mostrava só a 1ª,
              como se o nome fosse um. São 3 pedidos por ordem de prioridade:
              se a Junta recusa o primeiro, é o segundo que vira o nome da
              empresa dela — e ela precisa ter visto os três antes. */}
          <Bloco
            tituloFora
            titulo="A empresa"
            {...secao("Dados da empresa", 4)}
          >
            {/* 🆕 04/09 (pente-fino de copy) — a tela listava 1ª/2ª/3ª opção e
                calava o MOTIVO de serem três. Sem isso, quem não lembra do C7
                acha que escolheu três nomes à toa. A dica vai só na primeira:
                repetir em todas viraria ruído. */}
            {/* 🐛 04/09 (pente-fino) — "1ª/2ª/3ª opção de nome" tratava os três
                como escolha dela. Desde o travamento do C7 (01/09), só o
                primeiro é dela: a 2ª e a 3ª são RESERVAS nossas e não se
                editam. Com a etiqueta antiga, quem estranhasse um nome que não
                escreveu ia apertar Ajustar e bater numa tela que não deixa
                mexer. O rótulo agora conta isso sozinho, e a dica encolheu. */}
            {d.nomes.map((nome, i) => (
              <Linha
                key={nome}
                rotulo={i === 0 ? "Seu nome" : `${i}ª reserva`}
                valor={nome}
                dica={i === 0 ? "A Junta analisa na ordem." : undefined}
              />
            ))}
            {d.fantasia && <Linha rotulo="Nome fantasia" valor={d.fantasia} />}

            {enderecoFiscal ? (
              <Linha
                rotulo="Endereço da empresa"
                valor="Endereço fiscal da Legalizai, em BH"
                /* ✍️ 04/09 — "Você escolheu usar o nosso endereço" era
                   redundante: a tela inteira é o que você escolheu. */
                dica={`${brl(CUSTOS.ENDERECO_FISCAL, true)}/mês, já na sua mensalidade.`}
              />
            ) : (
              <>
                <Linha
                  rotulo="Endereço da empresa"
                  valor={d.empresa.linha1}
                  segunda={d.empresa.linha2}
                />
                <Linha
                  /* ✍️ 04/09 — eram DUAS linhas com DUAS dicas sobre o mesmo
                     assunto (o imóvel e o número que o identifica). Viraram
                     uma: tipo + moradia em cima, IPTU embaixo, uma dica só. O
                     rótulo "Sobre o imóvel" era vago; agora nomeia o dado. */
                  rotulo="Tipo do imóvel"
                  valor={`${rotuloDe(TIPO_IMOVEL, d.empresa.tipoImovel)} · ${
                    d.empresa.resideNoEndereco ? "você mora nele" : "você não mora nele"
                  }`}
                  segunda={`IPTU ${d.empresa.iptu}`}
                  dica="A Prefeitura analisa isso pra liberar a empresa no endereço."
                />
              </>
            )}
          </Bloco>
        </Corpo>

        <Rodape>
          {/* 🔄 01/09 — no ME o CTA não depende de aceite: o aceite mudou pra
              tela da guia (`/guia`), onde a taxa vira gasto irreversível.
              🆕 04/09 — mas depende da CONFERÊNCIA: destrava quando as seções
              estiverem todas confirmadas.

              🔄 04/09 (pedido do Pedro) — O CONTADOR VIROU O PRÓPRIO RÓTULO.
              Era uma linha de apoio acima do botão ("faltam 2 seções") e o
              botão dizia sempre "Confirmar e seguir". Duas vozes pro mesmo
              assunto, e a de baixo era a que a pessoa olhava: botão cinza com
              rótulo de botão pronto lê como app quebrado. Agora o rótulo é o
              estado ("1 de 4 conferidas") e só vira CTA de verdade quando o
              caminho abre — a mudança de copy É o sinal de que destravou. */}
          {/* 🆕 04/09 (pedido do Pedro) — ESCAPE HATCH acima do CTA, mesmo
              padrão do E3.2 e do E6.1 (código): quem chega com dúvida numa tela
              que antecede passo irreversível não tem pra onde ir sem abandonar
              o flow. A mensagem já vai escrita, com a tela nomeada, pra não
              começar a conversa do zero. */}
          <a
            href={linkWhatsApp(
              "Oi! Estou revisando o dossiê da minha empresa no app da Legalizai e fiquei com uma dúvida antes de confirmar.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 block w-full text-center text-caption font-medium text-text-secondary underline underline-offset-4"
          >
            Ainda com dúvida? Chama no WhatsApp.
          </a>
          <Button full disabled={faltam > 0} onClick={onSeguir}>
            {/* "seções" entra pra fechar o sentido de "0 de 4"; "conferidas"
                fica de fora por LARGURA: em 18px bold, "0 de 4 seções
                conferidas" passa de 280px e quebra em duas linhas num iPhone
                SE. O particípio já está no botão de cada seção, logo acima. */}
            {faltam > 0
              ? `${SECOES.length - faltam} de ${SECOES.length} seções`
              : "Tudo certo, seguir"}
          </Button>
        </Rodape>
      </main>
    </>
  );
}

/** "Casado(a) · Comunhão parcial de bens" — o regime só existe pra casado. */
function civilPorExtenso(s: SocioRevisao): string {
  const civil = rotuloDe(ESTADO_CIVIL, s.civil);
  const regime = s.civil === "casado" ? rotuloDe(REGIME_BENS, s.regime) : "";
  return regime ? `${civil} · ${regime}` : civil;
}

/**
 * 🆕 03/09 (decisão do Pedro) — O CARTÃO DE CADA SÓCIO.
 *
 * Fechado mostra o que identifica (nome, CPF, participação, papel). Aberto
 * mostra a qualificação inteira, que é o que de fato vai pro contrato e pro
 * DBE. O titular entra na mesma lista porque a participação dele também é um
 * número que precisa fechar 100% com a dos outros.
 */
function CartaoSocio({ socio, titular }: { socio: SocioRevisao; titular: boolean }) {
  const [aberto, setAberto] = useState(false);
  return (
    <div className="rounded-md border border-border-hairline bg-surface-alt p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-caption font-semibold text-text-primary">
            {socio.nome}
            {titular && <span className="text-text-tertiary"> · você</span>}
          </p>
          {/* 🔄 04/09 (pedido do Pedro) — o cartão fechado guarda SÓ a
              participação. O papel virou a nota de administração embaixo da
              lista, e o CPF desceu pro detalhe: ele continua na tela pra quem
              vai conferir de fato, sem competir com o número que distingue um
              sócio do outro. */}
          {/* ✍️ 04/09 — "da empresa" saiu: repetia em cada cartão e a seção
              já se chama Sócios. */}
          <p className="text-micro text-text-tertiary mt-0.5">{socio.participacao}%</p>
        </div>
        <button
          type="button"
          onClick={() => setAberto((a) => !a)}
          aria-expanded={aberto}
          className="flex min-h-9 shrink-0 items-center rounded-full border border-border-hairline px-3 text-micro font-semibold text-text-secondary transition-colors hover:border-border-strong"
        >
          {aberto ? "Ocultar" : "Ver detalhes"}
        </button>
      </div>

      {aberto && (
        <div className="mt-3 flex flex-col gap-2 border-t border-border-hairline pt-3">
          <Linha rotulo="CPF" valor={socio.cpf} />
          <Linha rotulo="Data de nascimento" valor={socio.nascimento} />
          <Linha rotulo="RG" valor={`${socio.rg} · ${socio.orgao}`} />
          <Linha rotulo="Nacionalidade" valor={socio.nacionalidade} />
          <Linha rotulo="Estado civil" valor={civilPorExtenso(socio)} />
          <Linha rotulo="Endereço" valor={socio.endereco} />
        </div>
      )}
    </div>
  );
}

/**
 * 🆕 03/09 (decisão do Pedro) — a saída pro que NÃO se ajusta aqui.
 *
 * O bloco 1 (conta e plano) não tem modo de ajuste: o cadastro já foi usado na
 * cobrança (decisão 02/09). Mas nome e CPF são os dados que mais travam
 * processo quando saem errados, então eles aparecem pra conferência mesmo
 * assim, com o canal humano logo abaixo em vez de uma pill que não existe.
 */
function PeCadastro({ texto }: { texto: string }) {
  return (
    <p className="text-micro text-text-tertiary">
      {texto}{" "}
      <a
        href={linkWhatsApp(
          "Oi! Estou revisando o dossiê da minha empresa no app da Legalizai e preciso corrigir um dado do meu cadastro.",
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-text-secondary underline underline-offset-2"
      >
        Corrigir pelo WhatsApp
      </a>
    </p>
  );
}

/**
 * O recap do MEI, intocado nesta rodada (varredura de 03/09 é do caminho ME).
 * Ele não passa pela Junta: registro é no Portal do Empreendedor, feito pelo
 * próprio titular, e por isso o aceite continua morando aqui.
 */
function RevisarMeiView({
  d,
  aceito,
  setAceito,
  onSeguir,
  onVoltar,
  onAjustar,
}: {
  d: ReturnType<typeof useRevisao>;
  aceito: boolean;
  setAceito: (v: boolean) => void;
  onSeguir?: () => void;
  onVoltar?: () => void;
  onAjustar?: (blocoId: number) => void;
}) {
  return (
    <>
      <TelaHeader meta="Nome da empresa" onVoltar={onVoltar} />

      <main className="app-main">
        {/* 🆕 28/08 — o subtítulo do ME dizia "a gente já começa a registrar
            isso na Junta". Duas coisas falsas no MEI: ele não passa pela Junta
            Comercial, e não somos nós que registramos — é o titular, com a
            conta gov.br dele. Ver `abertura-mei-processo.md` §Bloco 1. */}
        <Titulo sub="Confira com calma. É com esses dados que a gente monta o seu registro, e é você quem vai finalizar no Portal do Empreendedor.">
          Está tudo certo?
        </Titulo>

        <Corpo>
          <Bloco titulo="Você" passo="Seus dados" onAjustar={onAjustar && (() => onAjustar(3))}>
            <Linha rotulo="Nome" valor={d.titular.nome} />
            <Linha rotulo="CPF" valor={d.titular.cpf} />
            <Linha rotulo="Contato" valor={d.contato.telefone} />
          </Bloco>

          <Bloco
            titulo="A empresa"
            passo="Dados da empresa"
            onAjustar={onAjustar && (() => onAjustar(4))}
          >
            {/* No MEI a razão social não é escolhida: sai automática do CNPJ +
                nome civil (Lei 14.195/2021). Mostrar um nome aqui daria a
                entender que houve escolha — e que ela pode ser recusada. */}
            <Linha rotulo="Nome" valor="Sai automático: seu CNPJ + seu nome" />
            <Linha rotulo="Tipo" valor="MEI" />
            <Linha rotulo="Endereço" valor={d.mei.endereco} />
          </Bloco>

          <Bloco
            titulo="O que a empresa faz"
            passo="Atividades"
            onAjustar={onAjustar && (() => onAjustar(2))}
          >
            <Linha
              rotulo="Principal"
              valor={`${d.atividade.principal.nome} (${d.atividade.principal.cnae})`}
            />
            {d.atividade.secundarias.map((s) => (
              <Linha key={s.cnae} rotulo="Secundária" valor={`${s.nome} (${s.cnae})`} />
            ))}
          </Bloco>

          <Card>
            <div className="mb-2 flex items-center justify-between gap-3">
              <h2 className="text-body font-semibold text-text-primary">Seu enquadramento</h2>
            </div>
            <p className="text-caption text-text-secondary">
              MEI paga um DAS fixo por mês, sem Fator R nem Anexo pra calcular,
              bem mais simples que o Simples Nacional.
            </p>
          </Card>

          <Checkbox checked={aceito} onChange={setAceito}>
            Autorizo a Legalizai a preparar minha abertura, e entendo que o
            registro final é feito por mim no Portal do Empreendedor.
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

/**
 * 🔄 03/09 (pedido do Pedro) — O RECAP USA O CARTÃO DE CONFIRMAÇÃO DA C4.
 *
 * Era `Card` branco com título em `text-body` e um link "Ajustar" sublinhado.
 * Agora é o mesmo desenho que o dossiê já usa pra dizer "isto é o que você
 * respondeu, confira": rótulo miúdo em cima do valor, e uma PILL por seção
 * como única ação. Um estilo só pro mesmo papel, em vez de dois.
 *
 * 🔄 04/09 (pedido do Pedro) — O CARTÃO VOLTOU A SER BRANCO. Ele nasceu cinza
 * (`surface-alt`) pra ecoar o cartão de confirmação da C4, mas cinza no app
 * já significa OUTRA coisa: campo travado, dado que não se mexe. Numa tela em
 * que a ação principal é justamente ajustar, o fundo dizia o contrário do
 * botão. Agora é `surface-card` + `border-hairline`, o mesmo par branco/borda
 * cinza-claro de todo card do DS.
 *
 * ⚠️ Efeito em cascata: o cartão de cada sócio (`CartaoSocio`) era o branco
 * que se destacava por cima do cinza. Com o `Bloco` branco, ele passou pro
 * cinza — a hierarquia inverteu de lado, ela não sumiu.
 *
 * A pill (e não link) é de propósito: ela é a única coisa clicável do cartão,
 * e pill lê como alvo de toque num bloco que, no resto, é leitura.
 */
function Bloco({
  titulo,
  passo,
  onAjustar,
  rodape,
  tituloFora = false,
  conferido = false,
  onConferir,
  children,
}: {
  titulo: string;
  /** Nome do bloco, só pro leitor de tela ("Ajustar Seus dados"). */
  passo: string;
  /** Ausente = recap sem volta (ex.: depois do protocolo). A pill some. */
  onAjustar?: () => void;
  /**
   * 🆕 03/09 — nota no pé do cartão, separada do conteúdo por uma linha. Existe
   * pro bloco "Você", onde parte dos dados não se ajusta por aqui e a saída
   * precisa estar visível junto deles, não numa tela adiante.
   */
  rodape?: ReactNode;
  /**
   * 🆕 04/09 (pedido do Pedro, na A1) — TÍTULO DE SEÇÃO FORA DO CARTÃO.
   *
   * O título morava dentro do cartão, em `text-caption` semibold: do tamanho
   * de um valor qualquer do recap, competindo com as linhas em vez de mandar
   * nelas. Numa tela de 5 blocos, ninguém enxergava onde uma seção acaba e a
   * outra começa. Fora e em `text-h2` ele vira RÉGUA: a subdivisão da tela é
   * lida antes do conteúdo, e o cartão fica sendo só a caixa dos dados.
   *
   * 🔒 Guardado por regime (regra de escopo do CLAUDE.md): o `Bloco` também
   * serve o `RevisarMeiView`, que está fora deste escopo. Sem a prop, nada
   * muda — o MEI segue com o título dentro do cartão.
   */
  tituloFora?: boolean;
  /**
   * 🆕 04/09 (decisão do Pedro) — CONFIRMAÇÃO DA SEÇÃO, no pé do próprio
   * cartão. Ausente = cartão de leitura pura (é o caso do MEI, que tem um
   * aceite único no fim da tela, e do recap sem volta depois do protocolo).
   */
  conferido?: boolean;
  onConferir?: () => void;
  children: ReactNode;
}) {
  const pill = onAjustar && (
    <button
      type="button"
      onClick={onAjustar}
      aria-label={`Ajustar ${passo}`}
      /**
       * 🔄 04/09 (pedido do Pedro, em 2 rodadas) — CINZA CLARO, E MAIOR.
       *
       * Nasceu coral-700 em 12px (carimbo, não alvo de toque). Passou por
       * coral-600 e o coral gritou: numa tela com 4 seções, 4 pills coral
       * puxavam mais atenção que o próprio conteúdo que a pessoa veio
       * conferir, e ainda competiam com o CTA do rodapé — que é o único
       * coral que deveria mandar aqui.
       *
       * Agora é cinza claro (`surface-alt` + borda hairline) em 14px, com
       * 36px de altura. Ação secundária com cara de ação secundária: visível
       * porque tem caixa e alvo, silenciosa porque não tem cor de marca.
       * Bônus: sai a dívida de contraste do branco sobre coral-600 (4,04:1,
       * que só passa AA em texto ≥18,66px bold — regra travada em 12/07).
       */
      className="shrink-0 rounded-full border border-border-hairline bg-surface-alt px-3.5 py-1.5 min-h-9 text-caption font-semibold text-text-secondary transition-colors hover:bg-surface-card hover:text-text-primary"
    >
      Ajustar
    </button>
  );

  const cartao = (
    <div className="rounded-md border border-border-hairline bg-surface-card p-3">
      {!tituloFora && (
        <div className="mb-2 flex items-center justify-between gap-3">
          <h2 className="text-caption font-semibold text-text-primary">{titulo}</h2>
          {pill}
        </div>
      )}
      <div className="flex flex-col gap-2">{children}</div>
      {rodape && (
        <div className="mt-3 border-t border-border-hairline pt-2.5">{rodape}</div>
      )}
      {onConferir && (
        <button
          type="button"
          onClick={onConferir}
          aria-pressed={conferido}
          /* Toggle, não trava: quem confirmou por engano desfaz no mesmo
             botão. Rótulo no PASSADO quando ligado ("Conferido") pra ler como
             estado, e não como uma segunda coisa a fazer. */
          className={`mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-md border text-caption font-semibold transition-colors ${
            conferido
              ? "border-transparent bg-state-success-tint text-state-success-text"
              : "border-border-strong text-text-primary hover:bg-surface-alt"
          }`}
        >
          {conferido && <Certo />}
          {/* 🔄 04/09 (pente-fino de copy) — era "Está tudo certo", a mesma
              frase do título da tela E do CTA final: a pergunta do topo era
              respondida com as próprias palavras dela, três vezes. "Conferi"
              é ato em 1ª pessoa; o estado segue no particípio. */}
          {conferido ? "Conferido" : "Conferi"}
        </button>
      )}
    </div>
  );

  if (!tituloFora) return cartao;

  /* A pill sobe junto: ela é a ação DA SEÇÃO, e ficar sozinha dentro do
     cartão a deixaria órfã do título que ela ajusta. */
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-h2 text-text-primary">{titulo}</h2>
        {pill}
      </div>
      {cartao}
    </section>
  );
}

/**
 * 🆕 04/09 (pedido do Pedro) — A SOMA DAS PARTICIPAÇÕES.
 *
 * A tela mostrava 30% aqui, 70% ali, e deixava a conta pro leitor. Participação
 * que não fecha 100% é reprova na Junta, e é o tipo de erro que ninguém pega
 * relendo cartão por cartão. Três palavras no pé do bloco resolvem.
 *
 * Fora de 100% vira vermelho: o wizard não deveria deixar chegar aqui, mas se
 * chegar, esta é a última tela antes do irreversível.
 */
function SomaParticipacoes({ socios }: { socios: SocioRevisao[] }) {
  const soma = socios.reduce((t, s) => t + s.participacao, 0);
  const fecha = soma === 100;
  return (
    <p
      className={`text-micro ${fecha ? "text-text-tertiary" : "font-semibold text-state-danger-text"}`}
    >
      Juntos: {soma}%{fecha ? "" : " (precisa fechar 100%)"}
    </p>
  );
}

/**
 * 🆕 04/09 (pedido do Pedro) — A NOTA DE QUEM ADMINISTRA.
 *
 * Mesma gramática do `CardNota` (círculo verde-claro + check + texto), fundo
 * `surface-card`. Ela nasceu cinza pra separar do cartão branco da seção, e o
 * Pedro pediu branco na hora (04/09): com os cartões dos sócios logo acima já
 * em cinza, mais um cinza empilhava dois níveis do mesmo tom e a nota lia como
 * um quinto sócio. Branco com borda hairline a devolve pro papel de nota.
 *
 * Nomes em negrito porque é o que a pessoa procura aqui: numa lista de 3 ou 4
 * sócios, "quem assina" é a única coisa que ela não consegue deduzir olhando.
 *
 * ⚠️ Sem gênero no singular ("é quem administra", não "é a administradora"):
 * o dossiê não coleta gênero, e chutar erraria com nome ambíguo.
 */
function NotaAdministracao({ nomes }: { nomes: string[] }) {
  if (nomes.length === 0) return null;
  const varios = nomes.length > 1;
  return (
    <div className="flex items-start gap-2.5 rounded-md border border-border-hairline bg-surface-card p-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-state-success-tint text-state-success-text">
        <Certo />
      </span>
      <p className="text-caption text-text-secondary">
        {/* ✍️ 04/09 (auditoria) — PRIMEIRO nome. O cartão logo acima já mostra
            o nome completo de cada sócio; repetir por extenso aqui só alonga a
            frase sem acrescentar identificação. */}
        {nomes.map((nome, i) => (
          <span key={nome}>
            {i > 0 && (i === nomes.length - 1 ? " e " : ", ")}
            <strong className="font-semibold text-text-primary">
              {nome.trim().split(/\s+/)[0]}
            </strong>
          </span>
        ))}
        {/* ✍️ 04/09 (2ª rodada, pedido do Pedro) — enxugado. A 1ª versão dizia
            "são os sócios administradores" e emendava "assinam pela empresa no
            banco, no cartório e nos contratos": duas voltas pro mesmo fato, com
            "sócios" repetindo o título da seção e as preposições esticando a
            lista. Ficou o papel + a lista seca, mesmo formato do gate. */}
        {varios
          ? " são os administradores. Assinam pela empresa: banco, cartório, contratos."
          : " é quem administra. Assina pela empresa: banco, cartório, contratos."}
      </p>
    </div>
  );
}

/** Mesmo glifo do `CardNota` positivo — um check só no app, não dois. */
function Certo() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m5 12 4 4 8-9" />
    </svg>
  );
}

function Linha({
  rotulo,
  valor,
  segunda,
  dica,
}: {
  rotulo: string;
  valor: string;
  /** 2ª linha do mesmo valor, em peso normal (bairro + CEP do endereço). */
  segunda?: string;
  /**
   * 🆕 03/09 — micro-texto abaixo do valor, pra dado que a pessoa não digitou
   * (objeto social) ou cuja consequência não é óbvia (o imóvel, que é o que a
   * Prefeitura analisa). Não vira `Aviso`: aqui é leitura, não alerta.
   */
  dica?: string;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-micro text-text-tertiary">{rotulo}</span>
      {/* Valor em semibold, igual ao cartão da C4: o rótulo é etiqueta, o
          valor é o que a pessoa veio conferir. */}
      <span className="text-caption font-semibold text-text-primary">{valor}</span>
      {segunda && <span className="text-caption text-text-secondary">{segunda}</span>}
      {dica && <span className="text-micro text-text-tertiary mt-0.5">{dica}</span>}
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

          <Aviso neutro
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

/* 🗑️ 04/09 (Pedro) — `NIVEL_GOVBR` REMOVIDA. A gente NÃO tem acesso nenhum à
   conta GOV.BR da pessoa: não dá pra saber se ela é bronze, prata ou ouro. A
   constante era mock ("prata") e a tela afirmava o nível como se soubesse —
   inventar um estado que o produto não consegue ler é pior do que não dizer
   nada, porque a pessoa acredita. O requisito (prata ou ouro) continua sendo
   dito, sem afirmar em qual a pessoa está. */

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
  rodada = 1,
}: {
  onValidar?: () => void;
  onEscalar?: () => void;
  onVoltar?: () => void;
  /** 🆕 04/09 — qual das duas assinaturas do registro (ver `AssinaturaView`).
   *  Só troca a frase que diz o que o código assina; o mecanismo é idêntico. */
  rodada?: 1 | 2;
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
              ? "É o código que chegou no seu app ou celular cadastrado no GOV.BR. Serve pra fazer a procuração: sua empresa já existe, não tem registro novo pra assinar."
              : /* 🐛 04/09 (decisão do Pedro, com a pesquisa) — dizia "serve
                   pra procuração E pra assinatura, de uma vez só". A procuração
                   é e-CAC e SÓ pode ser assinada depois que o CNPJ existe, o
                   que não acontece aqui (a premissa caiu em 01/09, quando a
                   A3.2 saiu do caminho ME, e a tela continuou prometendo).
                   Agora o código faz uma coisa só, e a procuração virou passo
                   próprio na A5, quando o CNPJ já saiu. */
                rodada === 2
                ? /* 🆕 04/09 — a 2ª assinatura. Dizer "o registro" de novo
                     faria a pessoa achar que está repetindo o passo anterior. */
                  "É o código que chegou no seu app ou celular cadastrado no GOV.BR. É ele que assina a abertura do CNPJ, junto com o seu contador."
                : "É o código que chegou no seu app ou celular cadastrado no GOV.BR. É ele que assina o contrato social da sua empresa."
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
            <Aviso neutro variante="warning" titulo={expirou ? "O código expirou" : "As tentativas acabaram"}>
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
                a gente chama um atendente pra te ajudar na hora.
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
            /* 🐛 04/09 (auditoria) — O GATE NÃO TRAVAVA. O botão nascia
               habilitado e seguia habilitado com o campo vazio: clicar marcava
               erro e, com qualquer coisa digitada, avançava. É o único gate de
               segurança do bloco. Agora ele trava até os 6 dígitos, igual ao
               código do E6.1, e o rótulo diz o que falta. */
            <Button full disabled={codigo.replace(/\D/g, "").length < 6} onClick={validar}>
              {codigo.replace(/\D/g, "").length < 6 ? "Digite os 6 dígitos" : "Validar código"}
            </Button>
          )}
        </Rodape>
      </main>
    </>
  );
}

/**
 * Raio: o gesto "agora". 🔄 05/09 (pedido do Pedro) — era relógio + raio, e o
 * relógio remetia a MARCAR HORA, que é exatamente o outro caminho da tela. Em
 * 20px os dois símbolos juntos ainda viravam borrão. Sozinho, o raio diz uma
 * coisa só, e diz rápido.
 */
function IconeExpresso() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="text-text-primary">
      <path
        d="M13 2 4 13.5h6.2L11 22l9-11.5h-6.2L13 2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Chevron do cartão expresso: sai do app (WhatsApp), não seleciona. */
function ChevronExpresso() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-text-tertiary">
      <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ═══════════════ A3.H1 · AGENDAR A ASSINATURA (rota assistida) ═════════════
 * 🆕 04/09 (decisão do Pedro).
 *
 * ─── POR QUE AGENDAR, E NÃO "FALAR AGORA" ────────────────────────────────
 * A assinatura exige SINCRONIA: o código do GOV.BR vale 10 minutos, então os
 * dois precisam estar juntos. "Manda mensagem e espera" quebra dos dois lados
 * — a pessoa não sabe quando vem, e a consultora liga no vazio. Escolher a
 * hora resolve os dois com um toque.
 *
 * "Falar agora" continua existindo, como saída secundária: quem está com
 * pressa não pode ser obrigado a marcar horário.
 *
 * ─── O QUE ESTA TELA NÃO FAZ ─────────────────────────────────────────────
 * Não promete prazo de órgão (isso não é nosso). O horário aqui é o NOSSO, o
 * único tempo do processo que a casa controla de fato.
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Grade mock. No produto real vem da agenda da consultora. */
/**
 * Grade mock. No produto real vem da disponibilidade da consultora.
 *
 * 🔄 05/09 (referência do Pedro) — cada dia carrega 3 campos, e não um rótulo
 * só: `numero` e `semana` desenham o cartão (número grande em cima, dia da
 * semana embaixo), e `label` é como o dia se chama numa FRASE ("Hoje às
 * 15:00", "Segunda às 09:30"). Partido na fonte de novo, pelo mesmo motivo da
 * janela de atendimento: montar "5 Sex às 15:00" com `split` daria uma frase
 * que ninguém fala.
 *
 * 🔒 Fim de semana não entra: o atendimento é de segunda a sexta, e oferecer
 * sábado seria marcar hora com quem não vai estar lá.
 */
const DIAS_AGENDA: {
  id: string;
  numero: number;
  semana: string;
  /** 🆕 05/09 — o cartão do compromisso (A3.H2) mostra o mês no bloco de data. */
  mes: string;
  label: string;
  /** A casa não atende nesse dia (feriado, folga). Diferente de lotado. */
  fechado?: boolean;
  horarios: string[];
}[] = [
  /* 🔄 05/09 (pedido do Pedro) — hoje passa a ser um dia CHEIO, com 10
     horários de 30 em 30: é o dia que abre selecionado, e era ele quem tinha
     que mostrar a grade preenchida. O estado "poucos" continua visível na
     fila, no dia 10 ("1 livre"). A pausa das 12h às 14h é o almoço — grade
     corrida das 9h às 18h seria a única agenda do Brasil sem intervalo. */
  {
    id: "d1",
    numero: 5,
    semana: "Sex",
    mes: "Set",
    label: "Hoje",
    horarios: [
      "09:00", "09:30", "10:00", "10:30", "11:00",
      "11:30", "14:00", "14:30", "15:00", "15:30",
    ],
  },
  { id: "d2", numero: 8, semana: "Seg", mes: "Set", label: "Segunda", horarios: ["09:30", "11:00", "14:00", "16:00"] },
  { id: "d3", numero: 9, semana: "Ter", mes: "Set", label: "Terça", horarios: [] },
  /* 🆕 05/09 (pedido do Pedro) — dia 10 com UM horário só, pra ver o estado
     amarelo no meio da fila (e o singular "1 livre", que é outro caso). */
  { id: "d4", numero: 10, semana: "Qua", mes: "Set", label: "Quarta", horarios: ["14:00"] },
  /* 🆕 05/09 (pedido do Pedro) — os DOIS jeitos de um dia sair de jogo:
     `horarios: []` = a agenda encheu · `fechado` = a gente decidiu não atender
     (feriado, folga, o que for). Os dois viram o mesmo cartão desativado; o
     que muda é a palavra, porque "lotado" e "fechado" pedem reações
     diferentes de quem lê (esperar uma vaga × nem tentar). */
  { id: "d5", numero: 11, semana: "Qui", mes: "Set", label: "Quinta", horarios: ["09:00", "10:30", "14:30", "16:30"] },
  /* 🔄 05/09 (pedido do Pedro) — 5 → 7 dias. Com 7 cartões a fila passa de
     375px e ROLA, que é o comportamento certo de agenda: mostra que existe
     mais semana adiante sem empurrar os horários pra fora da primeira tela. */
  { id: "d6", numero: 12, semana: "Sex", mes: "Set", label: "Sexta", fechado: true, horarios: [] },
  { id: "d7", numero: 15, semana: "Seg", mes: "Set", label: "Segunda 15", horarios: ["09:00", "10:00", "14:00", "16:00", "17:30"] },
];

/**
 * O compromisso marcado, em partes.
 *
 * 🆕 05/09 — o cartão do A3.H2 desenha um bloco de data (semana · número ·
 * mês) ao lado do horário, então a frase pronta ("Hoje às 15:00") deixou de
 * bastar. Mesma lição da janela de atendimento e do cartão de dia: dado
 * partido na FONTE, não com `split` na tela — quem monta layout a partir de
 * string quebra no primeiro texto que mudar de forma.
 *
 * `frase` continua existindo porque hero, CTA e mensagem de WhatsApp precisam
 * dele numa linha só ("Marcado pra hoje às 15:00").
 */
export type Compromisso = {
  frase: string;
  numero: number;
  semana: string;
  mes: string;
  hora: string;
  /** 🆕 05/09 — o compromisso é pra HOJE. O cartão troca a sigla do dia da
   *  semana por "HOJE", que é a informação que a pessoa procura primeiro. */
  hoje: boolean;
};

export function AgendarAssinaturaView({
  onConfirmar,
  onVoltar,
}: {
  onConfirmar?: (c: Compromisso) => void;
  onVoltar?: () => void;
}) {
  /* 🆕 05/09 (pedido do Pedro) — DIA SEM VAGA SAI DE JOGO. Dois motivos, um
     resultado: a agenda encheu (`horarios` vazio) ou a casa não atende naquele
     dia (`fechado`). O cartão fica cinza e não clica. */
  const indisponivel = (d: (typeof DIAS_AGENDA)[number]) => !!d.fechado || d.horarios.length === 0;
  /* O default é o 1º dia COM vaga, não o 1º da lista: se hoje estiver lotado,
     abrir nele mostraria uma grade de horários vazia sem explicação. */
  const [dia, setDia] = useState((DIAS_AGENDA.find((d) => !indisponivel(d)) ?? DIAS_AGENDA[0]).id);
  const [hora, setHora] = useState<string | null>(null);

  /* ═══════════ 🆕 05/09 (pedido do Pedro) — ARRASTA E SOLTA ════════════════
   * No celular o trilho já rola com o dedo (scroll nativo, com inércia). No
   * DESKTOP não: `overflow-x` sem barra visível vira uma fila que parece
   * travada, porque não existe gesto de arrastar por padrão. Isto liga o
   * arrasto do mouse.
   *
   * 🔒 SÓ PRA MOUSE (`pointerType === "mouse"`). Capturar o ponteiro no touch
   * mataria o scroll nativo e a inércia — trocaria algo bom por uma imitação.
   *
   * 🐛 O detalhe que faz ou quebra: `moveu`. Sem ele, arrastar a fila
   * SELECIONA o cartão onde o dedo levantou, e a pessoa muda de dia sem
   * querer só de navegar. Passou de 4px, o clique seguinte é engolido.
   * ═══════════════════════════════════════════════════════════════════════ */
  const trilho = useRef<HTMLDivElement>(null);
  const arrasto = useRef({ ativo: false, x0: 0, scroll0: 0, moveu: false });

  function aoApertar(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || !trilho.current) return;
    arrasto.current = {
      ativo: true,
      x0: e.clientX,
      scroll0: trilho.current.scrollLeft,
      moveu: false,
    };
    /* 🐛 05/09 (achado do Pedro: "não consigo trocar de dia") — A CAPTURA
       COMEÇAVA AQUI, E ISSO MATAVA O CLIQUE.
       `setPointerCapture` redireciona os eventos de ponteiro pro elemento que
       capturou, e o `click` nasce do alvo comum entre pointerdown e pointerup:
       com a captura no trilho desde o primeiro toque, TODO clique passava a
       ser do trilho, nunca do cartão. O dia de hoje vinha selecionado e não
       havia como trocar — o arrasto tinha engolido a seleção.
       A captura agora só entra quando o gesto VIRA arrasto de fato (ver
       `aoArrastar`): clique parado não captura nada e chega no botão. */
  }

  function aoArrastar(e: React.PointerEvent<HTMLDivElement>) {
    const a = arrasto.current;
    if (!a.ativo || !trilho.current) return;
    const dx = e.clientX - a.x0;
    if (!a.moveu && Math.abs(dx) > 4) {
      a.moveu = true;
      // Passou do limiar: agora sim é arrasto, e a captura garante que ele
      // continue mesmo se o cursor sair do trilho no meio do gesto.
      trilho.current.setPointerCapture(e.pointerId);
    }
    if (!a.moveu) return;
    trilho.current.scrollLeft = a.scroll0 - dx;
  }

  function aoSoltar(e: React.PointerEvent<HTMLDivElement>) {
    if (!arrasto.current.ativo) return;
    arrasto.current.ativo = false;
    if (trilho.current?.hasPointerCapture(e.pointerId)) {
      trilho.current.releasePointerCapture(e.pointerId);
    }
  }

  const diaAtual = DIAS_AGENDA.find((d) => d.id === dia) ?? DIAS_AGENDA[0];
  const quando: Compromisso | null = hora
    ? {
        frase: `${diaAtual.label} às ${hora}`,
        numero: diaAtual.numero,
        semana: diaAtual.semana,
        mes: diaAtual.mes,
        hora,
        hoje: diaAtual.label === "Hoje",
      }
    : null;

  return (
    <>
      {/* Regra 6: o `meta` nomeia o DESTINO do voltar, não esta tela. */}
      <TelaHeader meta="Status da abertura" onVoltar={onVoltar} />
      <main className="app-main">
        {/* 🗑️ 04/09 (Pedro) — SAIU "por vídeo": não vamos fazer videochamada
            nesta etapa. Prometer um canal que não existe é o tipo de detalhe
            que ninguém confere no desenho e o cliente cobra na hora.
            ⚠️ Não confundir com a tela de certificado (`/certificado`), onde a
            videochamada é real: quem faz é a certificadora parceira, e a
            entrevista por vídeo é exigência dela. */}
        {/* 🔄 05/09 (pedido do Pedro) — 3 → 2 linhas. Saiu "Escolha quando fica
            melhor pra você": o título já manda marcar e a tela inteira embaixo
            é a escolha, então a frase gastava uma linha pra instruir o óbvio.
            Ficou o que a pessoa NÃO sabe: quanto tempo leva e por onde é. */}
        <Titulo
          sub={
            <>
              {/* 🔄 05/09 (pedido do Pedro) — a DURAÇÃO em negrito. É o dado
                  que decide se a pessoa marca pra hoje ou pra semana que vem,
                  e no meio da frase ele passava batido. O resto fica em peso
                  normal: negritar tudo é o mesmo que não negritar nada. */}
              <strong className="font-semibold text-text-primary">
                A assinatura leva cerca de 15 minutos,
              </strong>{" "}
              e a gente faz junto, por telefone ou WhatsApp.
            </>
          }
        >
          {/* 🔄 05/09 — era "Marque com a Larissa". Sem consultor designado,
              o que se marca é o ATO, não a pessoa. */}
          Marque sua assinatura
        </Titulo>

        {/* ═══════════ 🔄 05/09 (achado do Pedro) — O TRILHO SAIU DO `Corpo`
            O pedido era simples ("colado nas laterais do aparelho") e o
            `-mx-6` não bastava: o `Corpo` do DS rola verticalmente
            (`overflow-y-auto`), e contêiner com overflow RECORTA o filho que
            passa da largura dele. A margem negativa existia e não vazava.
            O welcome, único outro carrossel do app, sangra de verdade porque
            o trilho dele é filho direto do `app-main`, que não corta. Mesma
            estrutura aqui: consultora e seletor de dia ficam FIXOS acima, e
            só a grade de horários rola.
            Efeito colateral bom: numa tela pequena, o dia escolhido não sai
            de vista enquanto a pessoa procura a hora.
            ═══════════════════════════════════════════════════════════════ */}
        <div className="flex shrink-0 flex-col gap-6 pb-6">
          {/* Sem repetir o porquê: quem chega aqui acabou de ler na tela
              anterior. O cartão fica só pra dar rosto a quem vai atender. */}
          <CardConsultor motivo={false} />

          <div>
            {/* 🔄 05/09 (pedido do Pedro) — mais respiro entre o rótulo e a
                fila: com o contador de horários os cartões ficaram mais altos
                e encostavam no "Dia". */}
            <p className="text-body-strong font-semibold text-text-primary mb-3">Dia</p>
            {/* 🔄 05/09 (referência do Pedro) — CARTÃO DE DATA, não pill de
                texto. Número do dia grande em cima, dia da semana embaixo:
                é o formato que todo app de agendamento usa, e ele carrega
                mais informação no mesmo espaço (a pessoa vê a semana inteira
                de uma vez, em vez de ler 5 palavras).
                🔄 05/09 (pedido do Pedro) — SCROLL LATERAL de verdade, com o
                mesmo padrão do welcome (o único outro carrossel do app):
                barra ESCONDIDA (`[scrollbar-width:none]` + o pseudo do
                webkit) e `snap-x` pros cartões pararem alinhados em vez de
                meio cortados. Barra de rolagem visível dentro de um cartão de
                formulário lê como bug de layout, não como "tem mais coisa".
                `-mx-6 px-6`: o trilho SANGRA até a borda do vidro, senão o 7º
                cartão parece cortado pelo padding em vez de continuar — e o
                padding devolve o alinhamento do primeiro com o resto da tela. */}
            <div
              ref={trilho}
              onPointerDown={aoApertar}
              onPointerMove={aoArrastar}
              onPointerUp={aoSoltar}
              onPointerCancel={aoSoltar}
              /* 🔄 05/09, 2ª rodada (correção do Pedro) — SANGRA, MAS COMEÇA
                 ALINHADO. `-mx-6` tira os 24px do shell (é o que deixa os
                 cartões atravessarem a borda ao rolar) e o `px-6` os devolve
                 ao CONTEÚDO: em repouso o dia de hoje nasce na mesma linha
                 vertical do "Dia", da consultora e do "Horário". Sem o `px-6`
                 o primeiro cartão colava no vidro e lia como desalinhado, não
                 como carrossel.
                 `scroll-pl-6`: o snap precisa saber do padding, senão ele
                 encosta o cartão na borda do scrollport e desfaz o
                 alinhamento no primeiro arrasto.
                 `select-none` + `cursor-grab`: sem eles, arrastar seleciona os
                 números como texto e o cursor não convida ao gesto. */
              className="-mx-6 flex cursor-grab snap-x scroll-pl-6 select-none gap-2 overflow-x-auto px-6 pb-1
                         active:cursor-grabbing
                         [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {DIAS_AGENDA.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  disabled={indisponivel(d)}
                  onClick={() => {
                    // Arrastou a fila? Isso não é escolha de dia (ver `arrasto`).
                    if (arrasto.current.moveu) return;
                    setDia(d.id);
                    /* Trocar de dia zera a hora: manter "15:00" de um dia que
                       não tem 15:00 deixaria o CTA confirmar um horário que
                       não existe. */
                    setHora(null);
                  }}
                  aria-pressed={dia === d.id}
                  aria-label={`${d.label}, dia ${d.numero}, ${
                    d.fechado
                      ? "não atendemos neste dia"
                      : d.horarios.length === 0
                        ? "sem horários livres"
                        : `${d.horarios.length} ${d.horarios.length === 1 ? "horário livre" : "horários livres"}`
                  }`}
                  /* 🔄 04/09 (decisão do Pedro, 2ª rodada) — SELECIONADO É
                     CORAL CHEIO COM LETRA BRANCA, igual ao CTA do rodapé.
                     Passou por coral-50 (tint quase branco sobre cartão
                     branco: a seleção sumia) e coral-100, até o Pedro cravar o
                     padrão do DS — é exatamente o que o `BotaoOpcao` faz em
                     `ui/form.tsx`, e é assim que escolha se marca no app
                     inteiro. Eu tinha evitado por achar que competiria com o
                     CTA; competir aqui é o certo: os dois são a mesma decisão
                     (o horário), um escolhe e o outro confirma. */
                  /* 🐛 05/09 (achado do Pedro) — LARGURA FIXA, não mínima.
                     Com `min-w` cada cartão crescia até caber o próprio texto,
                     e "10 livres" ficava visivelmente mais largo que "1 livre":
                     a fila virava um serrote, e a largura passava a informar
                     quantidade sem querer. Agora todos têm a largura do maior
                     caso (2 dígitos + "livres"), e o que varia é só o
                     conteúdo — que é o certo numa fila de datas. */
                  className={`flex w-[86px] shrink-0 snap-start flex-col items-center rounded-md border px-2 py-2.5 transition-colors ${
                    indisponivel(d)
                      ? /* Cinza claro e sem cursor de ação: o dia continua na
                           fila (sumir daria a impressão de que a semana tem
                           buraco) mas não convida ao toque. */
                        "cursor-not-allowed border-border-hairline bg-surface-alt"
                      : dia === d.id
                        ? "border-action-primary bg-action-primary text-text-on-brand"
                        : "border-border-hairline bg-surface-card"
                  }`}
                >
                  <span
                    /* 🔄 05/09 (pedido do Pedro) — h2 (20px) → h1 (26px). O
                       número é o que a pessoa lê primeiro na fila; no tamanho
                       antigo ele competia de igual pra igual com o dia da
                       semana logo abaixo. */
                    className={`text-h1 font-bold leading-none tabular-nums ${
                      indisponivel(d)
                        ? "text-text-muted"
                        : dia === d.id
                          ? "text-text-on-brand"
                          : "text-text-primary"
                    }`}
                  >
                    {d.numero}
                  </span>
                  <span
                    className={`mt-1 text-micro font-medium ${
                      indisponivel(d)
                        ? "text-text-muted"
                        : dia === d.id
                          ? "text-text-on-brand/80"
                          : "text-text-tertiary"
                    }`}
                  >
                    {d.semana}
                  </span>
                  {/* 🆕 05/09 (referência do Pedro) — QUANTOS HORÁRIOS SOBRAM.
                      Sem isso a pessoa escolhe um dia às cegas e descobre a
                      escassez só depois de tocar: a informação que decide o
                      dia estava escondida atrás da escolha do dia.
                      A bolinha carrega o alarme e o número carrega o fato —
                      ≤2 é amarelo (corre, que está acabando), 3+ é verde.
                      🔒 No cartão SELECIONADO a bolinha vira branca: verde ou
                      amarelo sobre coral cheio brigam, e ali o estado já não
                      precisa chamar atenção (a pessoa já escolheu, e a grade
                      de horários logo abaixo mostra exatamente o que sobrou). */}
                  <span className="mt-1.5 flex items-center gap-1">
                    {/* Sem bolinha quando não há vaga: ela existe pra graduar
                        urgência, e "nenhuma" não é um grau — é o fim da linha. */}
                    {!indisponivel(d) && (
                      <span
                        aria-hidden
                        className={`h-1.5 w-1.5 rounded-full ${
                          dia === d.id
                            ? "bg-text-on-brand"
                            : d.horarios.length <= 2
                              ? "bg-state-warning"
                              : "bg-state-success"
                        }`}
                      />
                    )}
                    <span
                      className={`text-micro ${
                        indisponivel(d)
                          ? "text-text-muted"
                          : dia === d.id
                            ? "text-text-on-brand/80"
                            : "text-text-tertiary"
                      }`}
                    >
                      {/* "Lotado" e "Fechado" pedem reações diferentes de quem
                          lê: numa dá pra esperar vaga, na outra nem tentar. */}
                      {d.fechado
                        ? "Fechado"
                        : d.horarios.length === 0
                          ? "Lotado"
                          : d.horarios.length === 1
                            ? "1 livre"
                            : `${d.horarios.length} livres`}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <Corpo>
          <div>
            <p className="text-body-strong font-semibold text-text-primary mb-2">
              Horário disponível
            </p>
            <div className="grid grid-cols-3 gap-2">
              {diaAtual.horarios.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHora(h)}
                  aria-pressed={hora === h}
                  /* 44px de alvo: é uma grade densa, e alvo pequeno em grade é
                     onde o toque erra de vizinho (WCAG 2.5.8 pede 24, a régua
                     da casa é 44 no confortável). */
                  className={`min-h-11 rounded-md border text-caption font-semibold tabular-nums transition-colors ${
                    hora === h
                      ? "border-action-primary bg-action-primary text-text-on-brand"
                      : "border-border-hairline bg-surface-card text-text-secondary"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* 🗑️ 04/09 (pedido do Pedro) — SAIU o aviso "Se precisar remarcar".
              Na tela de MARCAR, falar em remarcar é ansiedade adiantada: a
              pessoa ainda não tem compromisso nenhum pra desmarcar. A saída
              vira ação de verdade DEPOIS do agendamento, no rodapé do status
              (A3.H2), onde existe um horário pra mexer. */}
        </Corpo>

        <Rodape>
          {/* CTA travado NOMEIA o que falta (régua da casa), em vez de ficar
              mudo e deixar a pessoa descobrir clicando. */}
          <Button full disabled={!quando} onClick={() => quando && onConfirmar?.(quando)}>
            {quando ? `Confirmar ${quando.frase}` : "Escolha um horário"}
          </Button>
          {/* ═══════════ 🆕 05/09 (referência do Pedro) — O EXPRESSO ═══════════
              Era um link sublinhado embaixo do botão, e link no rodapé lê como
              rodapé: quem estava com pressa passava batido. Virou CARTÃO, com
              ícone e duas linhas — mesma anatomia da referência (ícone · título
              + detalhe · chevron).

              🔒 Chevron, e NÃO o círculo de seleção da referência. Lá o círculo
              é rádio: escolher entre entregas. Aqui o toque SAI do app pro
              WhatsApp, e um rádio que nunca marca prometeria uma escolha que
              não acontece nesta tela.

              🔴 O que ele NÃO promete: prazo de atendimento. Sem consultor
              designado, "falamos em 5 minutos" seria a mesma mentira que a
              agenda fixa era. Ele declara o que a PESSOA tem (15 minutos
              livres) e diz a condição de verdade: se houver consultor livre. */}
          <a
            href={linkWhatsApp(
              "Oi! Paguei a guia da Junta e tenho 15 minutos livres agora pra fazer a assinatura, se tiver alguém disponível.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-3 rounded-md border border-border-hairline bg-surface-card p-3 transition-colors hover:border-border-strong"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border-hairline">
              <IconeExpresso />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-caption font-semibold text-text-primary">
                Tenho 15 minutos agora
              </span>
              <span className="block text-micro text-text-secondary">
                Falar com um consultor livre, pelo WhatsApp
              </span>
            </span>
            <ChevronExpresso />
          </a>
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
  faseInicial = "assinar",
  rodada = 1,
}: {
  onSeguir?: () => void;
  onVoltar?: () => void;
  /** 🆕 04/09 — abre direto no código (rota `?etapa=codigo`, nó A4.1). */
  faseInicial?: "assinar" | "codigo";
  /**
   * 🆕 04/09 (Pedro, destrinchando o processo real) — QUAL DAS DUAS.
   *
   * Até o CNPJ existir a pessoa assina duas vezes: a 1ª sozinha, formalizando
   * o contrato social; a 2ª com o CONTADOR assinando junto, e é ela que gera o
   * CNPJ. É a MESMA tela e o MESMO gesto (GOV.BR + código), então vira
   * variante em vez de tela nova — mesmo padrão do `?etapa=codigo`.
   *
   * O que muda é só o que ela está assinando, e isso não é detalhe: assinar
   * "de novo" sem saber por quê é a leitura de que algo deu errado.
   */
  rodada?: 1 | 2;
  /** 🆕 24/08 — código do GOV expirou ou estourou tentativas: escala pra
   *  atendimento humano em vez de travar o cliente sozinho. */
  onEscalar?: () => void;
  /** 🆕 03/08 — MEI assina no Portal do Empreendedor, não na Junta. Sócio já
   *  não se aplica (MEI é sempre solo, `sociedade` abaixo já cobre isso). */
  mei?: boolean;
}) {
  /* 🐛 04/09 (auditoria) — A VARIANTE MEI MOSTRAVA SÓCIO. `SOCIOS_ASSINATURA`
     é constante e ignorava o regime, então `/assinatura?regime=mei` listava o
     Carlos e dizia "a empresa só é registrada quando os dois assinam" — num
     regime que é sempre solo. O comentário do código afirmava que `sociedade`
     já cobria isso; não cobria. */
  const socios = mei ? SOCIOS_ASSINATURA.slice(0, 1) : SOCIOS_ASSINATURA;
  const sociedade = socios.length > 1;
  // 🆕 24/08 — depois de "Assinar no GOV.BR", entra o código único
  // (procuração + assinatura concentrados, ver `CodigoGovView`).
  /* 🆕 04/09 (pedido do Pedro) — A TELA DO CÓDIGO VIRA VISÍVEL NO FLOW.
     Ela era sub-estado do A4: existia no produto e na demo, mas escondida
     ATRÁS da tela anterior — sem nó, sem pill, e no mapa a prévia mostrava a
     assinatura. Mesmo buraco do E6.1 (código da conta) e do C0.3. Com
     `faseInicial`, a rota `?etapa=codigo` abre direto nela e o nó A4.1 passa a
     ter tela própria. No flow real ninguém entra por aqui: quem chega vem do
     CTA de assinar. */
  const [fase, setFase] = useState<"assinar" | "codigo">(faseInicial);
  const [canalConvite, setCanalConvite] = useState<"whatsapp" | "email">("whatsapp");

  if (fase === "codigo") {
    return (
      <CodigoGovView
        onVoltar={() => setFase("assinar")}
        onValidar={onSeguir}
        onEscalar={onEscalar}
        rodada={rodada}
      />
    );
  }

  return (
    <>
      {/* 🐛 04/09 (auditoria) — o `meta` trazia "Assinatura", que é o nome
          DESTA tela e não o destino do voltar (regra 6). Daqui volta pro
          status da abertura, que é de onde ela veio. */}
      <TelaHeader meta="Status da abertura" onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo
          sub={
            mei
              ? "O registro do MEI é pelo GOV.BR, com o seu CPF. Leva uns minutos."
              : /* 🆕 04/09 — a 2ª assinatura precisa se apresentar como
                   PROGRESSO, não como repetição: quem chega aqui já assinou uma
                   vez e, sem uma frase que diga o que mudou, lê "deu errado". */
                rodada === 2
                ? "Falta só esta. Seu contador assina junto com você, e é a assinatura que gera o CNPJ."
                : "A Junta registra a empresa com a assinatura dos sócios. É pelo GOV.BR e leva uns minutos."
          }
        >
          {rodada === 2 ? "Última assinatura" : "Hora de assinar"}
        </Titulo>

        <Corpo>
          {/* ═══════════ 🗑️→✍️ 04/09 (Pedro) ═══════════════════════════════
              A TELA AFIRMAVA UM DADO QUE A GENTE NÃO TEM.

              Eram 2 estados: card verde "Sua conta GOV.BR está no nível prata"
              e o aviso "o seu está bronze". Os dois vinham de `NIVEL_GOVBR`,
              uma constante mock — a gente NÃO tem acesso nenhum à conta GOV.BR
              da pessoa e não consegue ler o nível dela. Afirmar um estado que
              o produto não lê é pior do que ficar calado: o card verde dizia
              "pode seguir" pra quem talvez fosse ser barrado no GOV.BR, e o
              aviso mandava subir de nível quem já estava prata.

              Fica só o que é VERDADE e é nosso dizer: o requisito existe, e
              quem estiver abaixo dele resolve em minutos. Sem gate e sem
              checkbox — a pessoa não precisa declarar nada pra seguir, e quem
              confere o nível de fato é o GOV.BR, na hora de assinar.

              (O MEI já fazia assim desde sempre, por outro caminho: o M-S
              PERGUNTA por checkbox em vez de afirmar. Foi o único lugar que
              não precisou de conserto.)
              ═══════════════════════════════════════════════════════════════ */}
          <Aviso neutro variante="info" titulo="Antes de assinar, confira sua conta GOV.BR">
            {mei
              ? "O Portal do Empreendedor só aceita assinatura de conta nível prata ou ouro. Se a sua ainda for bronze, dá pra subir em poucos minutos, pelo app do seu banco ou pelo reconhecimento facial do GOV.BR."
              : "A Junta só aceita assinatura de conta nível prata ou ouro. Se a sua ainda for bronze, dá pra subir em poucos minutos, pelo app do seu banco ou pelo reconhecimento facial do GOV.BR."}
            <a
              href="https://www.gov.br/governodigital/pt-br/conta-gov-br/aumentar-nivel-da-conta-gov-br"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block font-semibold text-action-primary-sm underline"
            >
              Ver como subir de nível
            </a>
          </Aviso>

          {sociedade && (
            <div>
              <p className="text-body-strong font-semibold text-text-primary mb-2">
                Quem precisa assinar
              </p>
              <div className="flex flex-col gap-2">
                {socios.map((s) => (
                  <SocioLinha key={s.nome} nome={s.nome} status={s.status} />
                ))}
              </div>
              <p className="text-micro text-text-tertiary mt-2">
                {/* 🐛 04/09 — na 2ª rodada a empresa JÁ está registrada: repetir
                    "só é registrada quando os dois assinam" contaria uma etapa
                    que passou. O que trava agora é o CNPJ. */}
                {rodada === 2
                  ? "O CNPJ só sai quando os dois assinam. Ninguém assina pelo outro."
                  : "A empresa só é registrada quando os dois assinam. Seu sócio confirma os próprios dados e aprova o custo antes, ninguém assina pelo outro."}
              </p>

              {/* 🆕 24/08 (reunião Leonan 19/08) — link de convite rastreável
                  por canal. O status ("Falta convidar" → "Aguardando" →
                  "Assinou") já existe em `SocioLinha`; isto só torna
                  explícito POR ONDE o convite sai. */}
              {sociedade && socios[1]?.status === "convidar" && (
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

{/* 🔄 04/09 — a procuração SAIU desta tela: ela é e-CAC e precisa do CNPJ,
              que ainda não existe aqui. O que a pessoa precisa saber neste ponto
              é o que a assinatura faz, não o que vem junto (não vem). */}
          <Aviso neutro variante="info" titulo={rodada === 2 ? "O que esta assinatura faz" : "O que a assinatura faz"}>
            {/* 🔒 guardado por regime: o MEI não passa pela Junta (registro é
                no Portal do Empreendedor, feito pelo próprio titular). Dizer
                "Junta" pra ele seria o mesmo erro que a lista de sócios era. */}
            {/* 🐛 04/09 (Pedro, destrinchando o processo real) — A TELA PULAVA
                UMA ASSINATURA. Dizia "fecha o registro na Junta, depois disso o
                CNPJ sai", e não é assim: entre uma coisa e outra existe uma
                SEGUNDA assinatura, com o contador junto, e é ela que gera o
                CNPJ. Prometer o CNPJ aqui fazia a 2ª chegar como surpresa ruim.
                Agora a 1ª anuncia a 2ª, e a 2ª é a que fala do que vem depois. */}
            {mei
              ? "É ela que fecha o seu registro no Portal do Empreendedor. Depois disso o CNPJ sai, e aí a gente te chama pra assinar a procuração que deixa a gente cuidar das suas obrigações."
              : rodada === 2
                ? "É ela que gera o CNPJ. Seu contador assina junto e se responsabiliza pela empresa. Com o CNPJ na mão, a gente te chama pra assinar a procuração que deixa a gente cuidar do DAS e das obrigações por você."
                : "É ela que formaliza o contrato social da empresa. Depois dela vem a última assinatura, com o seu contador junto, e é essa que gera o CNPJ."}
          </Aviso>
        </Corpo>

        <Rodape>
          {/* 🔄 04/09 (decisão do Pedro) — HIERARQUIA INVERTIDA. O primário era
              "Enviar convite pro Carlos" e o secundário "Assinar a minha parte":
              a tela empurrava primeiro o que depende de OUTRA pessoa. Assinar é
              o que ela controla e pode fazer agora; convidar é o que ela
              delega. O convite continua a um toque, logo abaixo, e o card do
              sócio (com o seletor de canal) segue no corpo. */}
          {/* 🗑️ 04/09 (Pedro) — o RAMO BRONZE saiu do rodapé junto com a
              detecção de nível: ele trocava o botão de assinar por um link
              "Subir de nível no GOV.BR", decidido por uma constante mock. Sem
              saber o nível, não existe motivo pra desviar ninguém: quem
              estiver abaixo de prata é barrado pelo próprio GOV.BR, e o aviso
              lá em cima já dá o caminho de subir. O rodapé volta a ter uma
              coisa só — assinar. */}
          {sociedade && socios[1]?.status === "convidar" ? (
            <>
              <Button full onClick={() => setFase("codigo")}>
                Assinar a minha parte agora
              </Button>
              <div className="mt-2 flex justify-center">
                <Button variant="ghost" onClick={() => setFase("codigo")}>
                  {canalConvite === "whatsapp"
                    ? `Enviar convite pro ${PRIMEIRO_NOME_SOCIO} no WhatsApp`
                    : `Enviar convite pro ${PRIMEIRO_NOME_SOCIO} por e-mail`}
                </Button>
              </div>
            </>
          ) : (
            <Button full onClick={() => setFase("codigo")}>
              Assinar no GOV.BR
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
    /* 🆕 04/09 (Izabela, 09/07) — a opção pelo Simples entra JUNTO com a
       liberação do CNPJ: a Receita sincroniza as duas coisas no mesmo ato. A
       pessoa escolheu o regime lá no começo do flow e não ouvia falar dele de
       novo até a primeira guia chegar. Dizer aqui fecha o ciclo do que ela
       decidiu, no primeiro momento em que virou fato. */
    sub: "Sua empresa já está ativa na Receita Federal, e o Simples Nacional entrou junto.",
  },
  {
    /**
     * 🔄 04/09 (decisão do Pedro, com a pesquisa) — A PROCURAÇÃO DEIXOU DE SER
     * "JÁ FEITA".
     *
     * Ela vinha marcada como concluída, "junto da assinatura do registro". Só
     * que procuração e-CAC exige e-CNPJ, e no A4 o CNPJ ainda não existe — a
     * premissa caiu em 01/09, quando a A3.2 saiu do caminho ME, e ninguém
     * mexeu na trilha. Aqui na A5 o CNPJ JÁ SAIU, então este é o primeiro
     * lugar do flow em que ela pode de fato ser assinada: vira tarefa, não
     * recibo.
     */
    id: "procuracao",
    estado: "agora",
    titulo: "Assinar a procuração",
    sub: "Agora que o CNPJ saiu, é ela que deixa a gente pagar seu DAS e cuidar das obrigações por você. Leva um minuto, pelo GOV.BR.",
    status: "Sua vez",
    href: "/assinatura",
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
    /* 🔄 04/09 — com a procuração virando a vez da pessoa, esta passa a ser a
       tarefa SEGUINTE. Segue clicável (é ela que abre o app por completo), só
       não disputa mais o "agora" com a procuração. */
    id: "dados",
    estado: "agora",
    titulo: "Conferir os dados da empresa",
    sub: "Dê uma olhada se está tudo certo no seu cadastro.",
    status: "Depois disso",
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

export function HomeAtivacaoView({ assistida = false }: { assistida?: boolean }) {
  /**
   * 🆕 04/09 (rota assistida) — A PROCURAÇÃO TAMBÉM É CONDUZIDA.
   *
   * Na rota automática ela é tarefa da pessoa ("Assinar a procuração", com
   * href pro GOV.BR). Na assistida não pode ser: procuração é e-CAC, tem
   * CAPTCHA, e no RS36 (26/08) o Ademar contou que são quatro procurações
   * diferentes, todas lá dentro. É exatamente o tipo de passo que motivou o
   * corte — terminar a rota mandando a pessoa fazer sozinha logo isso
   * desmentiria tudo que as telas anteriores prometeram.
   *
   * Vira recado do que a consultora já vai fazer com ela, sem CTA: a conversa
   * já está aberta no WhatsApp, e um botão aqui abriria um segundo canal pro
   * mesmo assunto.
   */
  const passos = assistida
    ? PASSOS_ATIVACAO.map((p) =>
        p.id === "procuracao"
          ? {
              ...p,
              titulo: "Procuração, com um consultor",
              sub: "É ela que deixa a gente pagar seu DAS e cuidar das obrigações por você. Um consultor faz junto com você, no mesmo formato da assinatura.",
              status: "A gente te chama",
              href: undefined,
            }
          : p,
      )
    : PASSOS_ATIVACAO;

  return (
    <main className="app-main">
      <Rolagem>
        <div className="flex flex-col gap-6 pb-[calc(24px+var(--safe-bottom))] pt-3">
          {/* Sem navbar nesta tela: a pessoa não navega livre até liberar o
              acesso. Avatar DESATIVADO; sino segue ativo. */}
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              {/* 🐛 04/09 (auditoria) — "Bem-vinda" flexiona no feminino, e o
                  app não coleta gênero. Mesmo bug que a C3 teve hoje ("Vou
                  abrir sozinho", "único dono"), agora na PRIMEIRA tela que a
                  pessoa vê como cliente. */}
              <p className="text-caption text-text-secondary">Olá, Ana</p>
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
              {/* 🐛 04/09 (auditoria) — dizia "Ativa há 3 dias" numa tela que
                  abre LOGO DEPOIS de assinar: o texto foi escrito pra home de
                  retorno, não pro dia 1. */}
              Ativa desde hoje. Agora é deixar tudo pronto pra você faturar.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <PillCnpj />
              <button
                type="button"
                /* 🔄 04/09 (auditoria) — 34px de alvo, igual ao chip do CNPJ ao lado. */
                className="flex min-h-10 items-center gap-1.5 rounded-full border border-border-hairline bg-surface-card px-3.5 text-caption font-medium text-text-secondary transition-colors active:bg-surface-alt"
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
              {/* ✍️ 04/09 (auditoria) — o contador dizia "2 de 4" e a lista
                  mostrava 5 linhas: o 5º item é o DESFECHO ("acesso completo"),
                  não tarefa, e sai do denominador por dentro. A palavra
                  "tarefas" fecha a conta pra quem lê. */}
              <span className="text-caption font-semibold text-text-secondary">
                {FEITOS_ATIVACAO} de {TAREFAS_ATIVACAO.length} tarefas
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-alt">
              <div
                className="h-full rounded-full bg-action-primary transition-all"
                style={{ width: `${PCT_ATIVACAO}%` }}
              />
            </div>
            {/* ✍️ 04/09 — a linha citava só a conferência de dados, que era a
                única tarefa aberta. Com a procuração virando tarefa também, ela
                passa a falar das duas. */}
            <p className="mt-1.5 text-micro text-text-tertiary">
              Feitas essas duas, seu app abre por completo.
            </p>

            <div className="mt-4">
              {passos.map((p, i) => (
                <PassoAtivacaoItem
                  key={p.id}
                  p={p}
                  n={i + 1}
                  ultimo={i === passos.length - 1}
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
/**
 * 🐛→🔒 04/09 (achado do Pedro, chegando do A2) — O ESTADO DE CHEGADA MENTIA.
 *
 * O default era `{concluidas: 1, emAndamento: 1}`: a viabilidade aparecia com
 * CHECK VERDE e o hero dizia que ela tinha passado na Junta. Só que quem chega
 * aqui acabou de tocar no A2 — a análise começou HÁ SEGUNDOS. A tela dava por
 * concluído o passo que ela deveria estar mostrando rodando, e o hero
 * comemorava um resultado que ninguém tinha.
 *
 * Agora a chegada é `{0, 0}`: "Revisar e confirmar" fica verde (foi o que a
 * pessoa fez), "Analisando viabilidade" gira, e a guia segue PAGÁVEL em
 * paralelo (regra travada hoje, ver `iniciar-viabilidade`). Os estados de
 * guia paga/boleto continuam vindo por prop, com os mesmos números de antes.
 */
const JUNTA_MOCK = { concluidas: 0, emAndamento: 0 };

/**
 * 🆕 04/09 — o bloco que recebe os 9 passos do dossiê quando eles se fundem na
 * fase Junta. Reusa o id 1 de propósito: ele já é o único bloco não editável
 * do dossiê (`telas: []` em `lib/passos.ts`), então o "Ajustar" continua sem
 * aparecer mesmo se um dia o `podeAjustar` global for afrouxado.
 *
 * 🔄 04/09 (3ª rodada) — o cartão fundido deixou de ser permanente na fase
 * Junta: ele vive só ENQUANTO viabilidade ou guia ainda estão em validação
 * (ver `dossieNaLista`). Resolvidas as duas, ele sai e cede o lugar.
 */
const BLOCO_DOSSIE_FUNDIDO = 1;
/** Nome do cartão fundido. Faz par com "Registro nos órgãos", o de baixo. */
const TITULO_DOSSIE_FUNDIDO = "Informações confirmadas";

export function AguardandoView({
  mei = false,
  temSocios = true,
  pago = false,
  fase = "dossie",
  guiaBoleto = false,
  rodada2 = false,
  assinou1 = false,
  assistida = false,
  agendado = null,
  compromisso = null,
  dossieFeitos,
  junta = JUNTA_MOCK,
  recusa,
  onSeguir,
  onPagarDae,
  onIrParaBloco,
  onAssinar,
  onAgendar,
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
   * 🆕 04/09 (auditoria do bloco A3) — A REANÁLISE PRECISA SE ANUNCIAR.
   *
   * O A3‴ (volta da 2ª rodada de nomes) usava a MESMA copy da chegada do A2:
   * "a Junta já está analisando seu nome e endereço". Verdade nos dois casos,
   * mas aqui a pessoa acabou de reenviar nomes DEPOIS de uma exigência, e a
   * tela não reconhecia nada disso — as duas viravam indistinguíveis, o que a
   * auditoria pegou como efeito colateral do estado `{0,0}`.
   *
   * Só muda o hero. A timeline é a mesma (a viabilidade recomeçou de fato).
   */
  rodada2?: boolean;
  /**
   * 🆕 04/09 (Pedro) — A 1ª DAS DUAS ASSINATURAS JÁ FOI FEITA.
   *
   * Entre a assinatura do contrato social e a da abertura do CNPJ (a que o
   * contador assina junto) a pessoa passa por aqui. Sem isto o hero recebia
   * quem acabou de assinar dizendo "o último passo é a assinatura" — o mesmo
   * furo que o A3′ tinha com a guia paga: a tela não reconhecia o que mudou.
   */
  assinou1?: boolean;
  /**
   * 🆕 04/09 (decisão do Pedro) — ROTA ASSISTIDA.
   *
   * No lançamento o app conduz sozinho até aqui (guia paga). Da assinatura em
   * diante quem assume é uma consultora nossa, por WhatsApp: é a parte com
   * CAPTCHA, 2FA, nível de conta GOV.BR que a gente não consegue ler, código
   * que expira em 10 minutos e o contador assinando junto. O flow automático
   * ATÉ AQUI já entrega mais do que a contabilidade digital que existe hoje;
   * automatizar o resto vira otimização de depois, não requisito de lançar.
   *
   * As telas A4/A4.1/A4″ continuam existindo e intactas — são a rota
   * automática, o destino. Isto é um desvio no fim, não uma amputação.
   */
  assistida?: boolean;
  /** A frase do compromisso ("Hoje às 15:00"). Null = a marcar. */
  agendado?: string | null;
  /** 🆕 05/09 — as partes do compromisso, pro cartão desenhar o bloco de data. */
  compromisso?: {
    numero: number;
    semana: string;
    mes: string;
    hora: string;
    hoje?: boolean;
  } | null;
  /**
   * 🆕 01/09 — com o CTA da fase Junta no rodapé, o último passo ("Agora é só
   * assinar") precisava de destino: sem isso a tela virava beco depois da guia
   * paga. Leva pro A4.
   */
  onAssinar?: () => void;
  /** 🆕 04/09 (rota assistida) — leva pra tela de marcar horário (A3.H1). */
  onAgendar?: () => void;
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

  /* ═══════════ 🔄 04/09, 3ª rodada (refinamento do Pedro) ══════════════════
   * OS DOIS ESTADOS DA FASE JUNTA, E O QUE CADA UM MOSTRA.
   *
   * `junta` já chega RELATIVO à cauda (0 = viabilidade · 1 = guia · 2 e 3 = as
   * assinaturas), então dá pra saber onde a pessoa está sem depender de como a
   * lista foi montada. Isso importa porque agora a lista MUDA conforme o
   * estado, e derivar uma da outra seria circular.
   *
   * · Enquanto viabilidade OU guia ainda estão pendentes, a tela é de ESPERA.
   *   Aí o cartão do dossiê ("Informações confirmadas · 9 de 9") ganha função:
   *   é a âncora de progresso, o que já passou enquanto se espera o que falta.
   * · Quando os dois fecham, a espera acabou e a tela vira de AÇÃO. Aí o
   *   cartão é só peso — e cede o lugar pro que importa agora: na rota
   *   assistida, o cartão da consultora, que entra exatamente onde ele sai.
   *
   * 🔒 UMA condição governa três coisas (o hero "Falta só a assinatura", o
   * cartão do dossiê e o da consultora). Se um dia divergirem, é porque
   * alguém duplicou a regra — ela mora aqui.
   * ═══════════════════════════════════════════════════════════════════════ */
  const viabilidadeOk = naFaseJunta && junta.concluidas > 0;
  const guiaPaga = naFaseJunta && junta.concluidas > 1;
  /** A Junta já respondeu e o dinheiro já saiu: nada mais está em validação. */
  const juntaResolvida = viabilidadeOk && guiaPaga;
  /** O dossiê aparece na timeline enquanto ainda houver algo sendo validado. */
  const dossieNaLista = !naFaseJunta || !juntaResolvida;

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

  // A lista da fase DOSSIÊ: os 9 passos primeiro, depois as etapas da Junta
  // ainda por vir — UMA jornada só, do 1º dado digitado ao CNPJ sair. Na fase
  // Junta a lista é só a cauda (ver `etapasCombinadas`).
  // 🆕 31/08 (pedido do Pedro) — cada passo carrega `descricao` (o que envolve
  // + quanto tempo leva, ver `lib/passos.ts`); o PainelView só mostra a do
  // passo ATUAL, como orientação do que vem pela frente.
  /**
   * 🆕 04/09 (pedido do Pedro) — O DOSSIÊ SÓ EXISTE NA FASE DOSSIÊ.
   *
   * Os 4 blocos ("Conta e plano", "O que a empresa faz", "Você e os sócios",
   * "A empresa") existem pra dar ordem a quem está PREENCHENDO: cada um é um
   * assunto que se fecha, e o "Ajustar" mora neles. Passado o ponto sem volta,
   * nenhum dos dois motivos sobrevive.
   *
   * A correção veio em duas rodadas no mesmo dia. Primeiro os 4 acordeões
   * viraram um cartão fundido; depois o Pedro pegou o que sobrou e o cartão
   * saiu inteiro (ver `etapasCombinadas`, logo abaixo).
   */
  const etapasDossie: Etapa[] = passos.map((p, i) => ({
    nome: boletoPendente && i === indiceGirandoBoleto ? (p.nomeEnquantoGirando ?? p.nome) : p.nome,
    detalhe: p.descricao,
    // 🆕 01/09 — o bloco vem do próprio passo (`lib/passos.ts`); as 3 etapas
    // da Junta entram todas no bloco 5, junto do "Revisar e confirmar" que as
    // dispara. É o que permite a timeline agrupar.
    bloco: p.bloco,
  }));
  /**
   * 🗑️ 04/09, 2ª rodada (achado do Pedro, na A3.H) — O DOSSIÊ SAIU DA TIMELINE
   * DA FASE JUNTA DE VEZ.
   *
   * De manhã os 4 acordeões do dossiê viraram UM cartão fundido ("Informações
   * confirmadas · 9 de 9"). Foi meia correção: o cartão continuava lá, e o
   * Pedro pegou o resto — "já validamos e nem tem como mais voltar nesse
   * status". É verdade e é o fim do argumento. Passado o ponto sem volta o
   * dossiê não é passo, é histórico: não há o que preencher, não há o que
   * ajustar, e nada do que ele mostra muda o que a pessoa faz agora.
   *
   * Some, então, e a timeline da fase Junta fica só com o que ainda acontece:
   * viabilidade, guia e as 2 assinaturas. Vale nas OITO telas da fase (A3, A3′,
   * A3″, A3‴, A3⁗, A3.1, A3.H, A3.H2) — o que criava o cartão era o dossiê ter
   * fechado, não a rota. Corrigir só na A3.H traria ele de volta na próxima.
   *
   * ⚠️ Os índices passam a ser RELATIVOS à cauda na fase Junta (`junta` já vem
   * assim do consumidor), então o offset `dossieTotal` sai de `concluidas`,
   * `emAndamento` e `recusa`.
   */
  const etapasCombinadas: Etapa[] = dossieNaLista
    ? [
        /* Na fase Junta os 9 passos entram FUNDIDOS num cartão só: os 4 blocos
           existem pra dar ordem a quem preenche, e ali não há mais o que
           preencher nem o que ajustar. Fundir é só reetiquetar o bloco de cada
           passo — a timeline agrupa por esse número. */
        ...etapasDossie.map((e) =>
          naFaseJunta ? { ...e, bloco: BLOCO_DOSSIE_FUNDIDO } : e,
        ),
        ...ETAPAS_ABERTURA.map((e) => ({ ...e, bloco: 5 })),
      ]
    : ETAPAS_ABERTURA.map((e) => ({ ...e, bloco: 5 }));

  /** Offset da cauda dentro da lista: 0 quando o dossiê já saiu dela. */
  const offsetCauda = dossieNaLista ? dossieTotal : 0;

  const emAndamentoDossie = boletoPendente ? indiceGirandoBoleto : feitos;
  const concluidas = naFaseJunta
    ? offsetCauda + junta.concluidas
    : boletoPendente
      ? indiceGirandoBoleto
      : feitos;
  const emAndamento = naFaseJunta ? offsetCauda + junta.emAndamento : emAndamentoDossie;

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
  /**
   * 🔒 04/09 — VIABILIDADE E GUIA NÃO SE ESPERAM (regra travada com o Pedro no
   * A2). A timeline é uma linha, então ela mostra a viabilidade girando; mas
   * "girando" aqui não bloqueia nada: a guia continua pagável, e é por isso
   * que a vez do cliente deixou de ser "a etapa ATUAL tem ação" e passou a ser
   * "a guia ainda não foi paga".
   *
   * ⚠️ Declarados ANTES do `etapas` abaixo: o `map` roda na hora e lê `iGuia`.
   */
  const iGuia = etapasCombinadas.findIndex((e) => e.acaoCliente);
  /* 🔄 04/09 — a 1ª etapa da Junta na lista. Depende de o dossiê ainda estar
     nela ou não, e é por isso que o offset é derivado num lugar só. */
  const iViabilidade = offsetCauda;
  /* 🆕 04/09 — a cauda da Junta virou 4 etapas (viabilidade · guia · assinar o
     contrato · assinar o CNPJ com o contador), então "a última da lista" parou
     de significar "hora de assinar". O CTA passa a olhar pra 1ª ASSINATURA:
     chegou nela, o botão leva pro A4, e vale pras duas. */
  const iAssinatura = iViabilidade + 2;

  const etapas = naFaseJunta
    ? etapasCombinadas.map((e, i) => {
        /* ✍️ 04/09 (auditoria) — na 2ª rodada o endereço já passou; o que
           voltou pra análise foram só os nomes novos. O detalhe genérico
           ("nome e endereço") contradizia o hero desta variante. */
        if (rodada2 && i === iViabilidade) {
          return {
            ...e,
            detalhe: "A Junta confere os nomes novos. Não precisa fazer nada, a gente te avisa.",
          };
        }
        /* 🐛 04/09 (achado do Pedro, comparando A3 e A3″) — O RENOME DA GUIA
           DEPENDIA DE ELA SER A ETAPA ATUAL. Enquanto a viabilidade e a guia
           eram uma fila, a guia paga por boleto era sempre a etapa da vez e a
           condição funcionava por acidente. Com o paralelismo (a análise fica
           girando enquanto a guia é paga), a etapa da vez passou a ser a
           viabilidade — e o A3″ mostrava "Seu boleto está a caminho" no hero
           com "Pague a guia da Junta (DAE)" pendente logo abaixo, como se o
           pagamento não tivesse acontecido. Agora o gatilho é a ETAPA DA GUIA,
           não o índice atual. */
        if (i !== iGuia || !e.acaoCliente) return e;
        /* 🐛 04/09 (achado do Pedro, no A3′) — DEPOIS DE PAGA, A ETAPA AINDA
           MANDAVA PAGAR. Ela ficava verde mas com o nome no imperativo
           ("Pague a guia da Junta (DAE)"), e o detalhe seguia explicando uma
           taxa que já tinha saído da conta. Etapa concluída se descreve no
           passado: é recibo, não instrução. */
        if (guiaPaga) {
          return {
            ...e,
            nome: "Guia da Junta paga",
            detalhe: undefined,
            acaoCliente: undefined,
          };
        }
        if (guiaBoleto) {
          // 🔄 01/09 (correção do Pedro) — SEM card de ação aqui embaixo. As 2
          // ações (ver boleto / adiantar por Pix) sobem pro hero, como chips,
          // igual ao status do boleto da mensalidade: embaixo a etapa fica só
          // girando, dizendo que está esperando. Duplicar a ação nos dois
          // lugares faria a lista disputar atenção com o hero.
          return {
            ...e,
            /* 🆕 04/09 (pedido do Pedro) — a etapa fica ATIVA, girando, mesmo
               não sendo a etapa da vez: o banco está compensando neste
               instante. Cinza aqui dizia "não aconteceu", que é o oposto. */
            emCurso: true,
            /* ✍️ 04/09 (auditoria) — o nome da etapa e o rótulo do CTA diziam
               a MESMA frase ("aguardando compensação") na mesma tela. A etapa
               passa a dizer o FATO (foi paga) e o CTA continua com a espera. */
            nome: "Guia da Junta paga",
            /* 🔄 04/09 — o detalhe dizia só "Em andamento agora". Com a etapa
               desenhada em cinza (quem gira é a viabilidade), ela precisava
               dizer que o dinheiro JÁ SAIU, senão lê como passo não feito. */
            detalhe: "Você já pagou. O banco confirma em 1 a 3 dias úteis, e a gente te avisa.",
            acaoCliente: undefined,
          };
        }
        // 🔄 01/09 (pedido do Pedro) — o CTA de pagar a guia SAIU de dentro da
        // etapa e virou o CTA fixo do rodapé, igual ao "Continuar preenchendo"
        // do status do dossiê. Padroniza o gesto: ação principal da tela mora
        // sempre no mesmo lugar, não ora no meio da lista, ora embaixo.
        /* 🆕 04/09 (pedido do Pedro) — A GUIA PENDENTE TAMBÉM GIRA. Ela ficava
           CINZA (a-fazer) porque quem "é a vez" é a viabilidade, e cinza numa
           etapa que já está disponível lê como "ainda não chegou" — quando na
           verdade ela está aberta desde já (viabilidade e guia correm em
           paralelo, regra travada hoje). Vale nos dois estados em que a guia
           está pendente: no A3 e no A3.1, onde a etapa aparecia apagada no meio
           de uma tela de alerta.
           ⚠️ Registro a tensão: o anel girando, no vocabulário da UX-40,
           significa "a vez é do órgão". Aqui ele passa a dizer também "isto
           está disponível agora". Se um dia confundir, o caminho é um 5º
           estado ("disponível"), não voltar pro cinza. */
        /* 🐛 04/09 (auditoria do bloco A3) — A EXIGÊNCIA TIRAVA O ACESSO AO
           PAGAMENTO. O CTA do rodapé é o único lugar de onde se paga a guia, e
           na A3.1 ele vira "Sugerir mais 3 nomes": a etapa aparecia disponível
           (girando) sem nenhum jeito de pagar. Isso contradizia a regra travada
           hoje ("a guia não espera a análise") justamente na tela em que a
           análise emperrou. Com recusa na tela, a ação VOLTA pra dentro da
           etapa — que é onde ela morava até 01/09, e o motivo de ter saído (não
           competir com o CTA do rodapé) não vale aqui: o rodapé está ocupado
           por outro assunto. */
        return recusa
          ? { ...e, emCurso: true, acaoCliente: { label: "Pagar a guia agora", onClick: onPagarDae } }
          : { ...e, emCurso: true, acaoCliente: undefined };
      })
    : etapasCombinadas;

  /* 🆕 04/09 (rota assistida) — AS ETAPAS DE ASSINATURA TROCAM DE DONO.
     Elas continuam na lista, no mesmo lugar: o que muda é quem move. A da vez
     ganha o 5º estado (`comConsultor` → silhueta de pessoa) e, se já houver
     horário, o detalhe passa a ser o compromisso marcado. A seguinte fica
     a-fazer, como sempre — anunciar duas pessoas cuidando ao mesmo tempo
     seria falso. Sem isto a timeline mandava a pessoa assinar sozinha numa
     rota em que ninguém vai deixar ela sozinha. */
  const etapasFinais =
    assistida && juntaResolvida
      ? etapas.map((e, i) => {
          const iVez = assinou1 ? iAssinatura + 1 : iAssinatura;
          if (i !== iVez) return e;
          return {
            ...e,
            comConsultor: true,
            detalhe: agendado
              ? `Marcado pra ${agendado.toLowerCase()}. Um consultor te chama por aqui e por WhatsApp.`
              : /* ✍️ 05/09 — era "Um consultor faz este passo junto com você.
                   Leva cerca de 15 minutos", a TERCEIRA vez que a tela dizia a
                   mesma coisa (hero e cartão já disseram). Aqui sobra o que só
                   a etapa entrega: quanto tempo. O ícone de pessoa na linha já
                   diz de quem é a vez. */
                "Leva cerca de 15 minutos.",
          };
        })
      : etapas;

  /**
   * 🐛→🔒 04/09 (achado do Pedro: "o card do header não casa com este status")
   * — O HERO FALAVA DE ESPERA NUMA TELA DE AÇÃO.
   *
   * Na fase Junta o hero era um só: "Estamos abrindo sua empresa · a parte
   * chata é com a gente". Verdade quando a vez é do órgão. Só que este é
   * exatamente o estado em que a vez é DELA — a viabilidade passou e a guia
   * está esperando pagamento, com "Pagar a guia agora" no rodapé. O hero
   * mandava relaxar e o rodapé cobrava ação: a pessoa lê o hero primeiro e
   * conclui que não tem nada pra fazer.
   *
   * Agora o hero segue a etapa da vez, que é o que o resto da tela já fazia.
   */
  const vezDoCliente = naFaseJunta && !guiaBoleto && !guiaPaga;

  const t = naFaseJunta
    ? {
        // 🔄 01/09 — com a guia paga por boleto o hero fala do boleto, igual
        // ao status da mensalidade: o que prende a jornada agora é o banco.
        normal: guiaBoleto
          ? "Seu boleto está a caminho"
          : rodada2
            ? // 🆕 04/09 — a volta da 2ª rodada fala do que ela acabou de fazer.
              "Seus novos nomes estão com a Junta"
            : /* 🆕 04/09 (auditoria) — o A3′ voltava ao hero genérico depois do
                 splash "Pagamento confirmado": não reconhecia a guia paga, que
                 é justamente o que mudou. Mesma omissão que o A3‴ tinha. */
              juntaResolvida
              ? /* 🆕 04/09 (rota assistida) — o título deixa de cobrar e passa
                   a APRESENTAR: quem chega aqui não tem tarefa, tem hora
                   marcada. "Falta só a assinatura" numa rota em que a pessoa
                   não assina sozinha soletra uma cobrança sem destino. */
                assistida
                ? agendado
                  ? "Você tem hora marcada"
                  : "Agora é com a gente"
                : assinou1
                  ? "Falta só a última assinatura"
                  : "Falta só a assinatura"
              : vezDoCliente
              ? // 🔄 04/09 — "quase lá" só quando a Junta já respondeu. Na
                // chegada do A2 a análise mal começou, e comemorar ali seria a
                // mesma mentira do check verde.
                viabilidadeOk
                ? "Sua empresa está quase lá"
                : "Estamos abrindo sua empresa"
              : "Estamos abrindo sua empresa",
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
          : rodada2
            ? "A análise recomeçou com as opções novas. O resto do processo continua de onde parou, sem recomeçar nada."
            : juntaResolvida
              ? assistida
                ? agendado
                  ? /* 🔄 04/09 (pedido do Pedro) — VAZIO de propósito. O
                       compromisso ganhou cartão próprio logo abaixo do hero
                       (`CardCompromisso`), e dizer "Hoje às 15:00" nos dois
                       seria a mesma informação em blocos colados. O hero fica
                       só com o título, que é o veredito ("Você tem hora
                       marcada"), e o cartão carrega o detalhe. */
                    ""
                  : assinou1
                    ? "O contrato social já está assinado. Falta a assinatura que gera o CNPJ, e a gente faz essa com você também."
                    : /* ✍️ 05/09 (pente-fino do Pedro: "texto demais") — SAIU
                         o recap "A Junta aprovou o nome e a guia está paga":
                         a timeline logo abaixo mostra exatamente isso, com
                         dois checks verdes. Contar em palavras o que a lista
                         desenha é o jeito mais fácil de encher uma tela. */
                      "Só falta assinar, e um consultor faz isso com você."
                : assinou1
                  ? "O contrato social já está assinado. Falta a assinatura que gera o CNPJ, com o seu contador junto."
                  : "A Junta aprovou o nome e a guia está paga. O último passo é a assinatura dos sócios."
              : vezDoCliente
            ? viabilidadeOk
              ? /* Diz o que já aconteceu (a viabilidade passou), o que falta e
                   de quem é a vez. Sem prazo: o detalhe da etapa já informa
                   que o pagamento leva cerca de 1 minuto. */
                "A viabilidade passou na Junta. Falta pagar a taxa dela, e o registro é com a gente."
              : /* 🆕 04/09 — chegada do A2: a análise está rodando E a guia já
                   pode ser paga. A frase existe pra dizer que uma coisa não
                   trava a outra, que é o que a pessoa acabou de ler no A2. */
                "A Junta já está analisando seu nome e endereço. A guia não espera a análise: dá pra pagar quando quiser."
            : /* ✍️ 04/09 — saiu "e a gente avisa no WhatsApp a cada passo": a
                 linha miúda logo abaixo, dentro do mesmo hero, já diz isso.
                 Era a mesma promessa duas vezes na mesma caixa. */
              "A parte chata é com a gente. Você acompanha por aqui.",
        /* ✍️ 04/09 (auditoria) — "é rápido de resolver" brigava com o prazo de
           30 dias que o card logo abaixo passou a mostrar: uma frase mandava
           correr, a outra dizia pra respirar. Ficou o que é verdade nas duas
           leituras — o ajuste é pequeno e a gente já sabe qual é. */
        recusa: "A abertura seguiu bem até aqui. Um órgão pediu um ajuste, e a gente já sabe qual é.",
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
              /* 🔄 04/09 (auditoria) — chips do hero tinham 32/34px de alvo. Sobem pra
                 40px sem mudar a silhueta (mesmo raio, mesma cor, mais respiro). */
              className="flex min-h-10 items-center gap-1.5 rounded-full bg-surface-card px-3.5 text-caption font-semibold text-text-primary transition-colors active:bg-surface-alt"
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
              className="flex min-h-10 items-center gap-1.5 rounded-full border border-border-hairline px-3.5 text-caption font-medium text-text-on-dark/80 transition-colors active:bg-white/10"
            >
              Prefiro pagar por Pix
            </button>
          </div>
        ) : undefined
      }
      concluidas={concluidas}
      emAndamento={emAndamento}
      etapas={etapasFinais}
      /* 🆕 04/09 — na rota assistida o cartão da consultora vem ANTES da
         timeline: é ele que explica por que as duas últimas etapas mudaram de
         dono. Depois de marcado o horário ele some — a informação já migrou
         pro hero e pra própria etapa, e mantê-lo seria dizer a mesma coisa em
         três lugares (o erro que o A1 e o C3 já corrigiram nesta rodada). */
      /* 🔄 04/09 — o mesmo slot serve os dois momentos da rota assistida, e
         nunca os dois ao mesmo tempo: ANTES de marcar, quem precisa aparecer é
         a consultora (é ela que explica por que as etapas mudaram de dono);
         DEPOIS, o compromisso, que é a única coisa que a pessoa precisa reter
         nesta tela. */
      /* Na rota assistida quem avisa é o consultor, com hora marcada — a
         promessa genérica de "a gente te avisa" só somaria linha. */
      semAvisoWhats={assistida && juntaResolvida}
      antesDaTimeline={
        assistida && juntaResolvida
          ? agendado && compromisso
            ? (
                <CardCompromisso
                  quando={compromisso}
                  /* O contato mora no cartão, junto de quem atende (ver
                     `CardCompromisso`). Por isso saiu do rodapé. */
                  onFalar={linkWhatsApp(
                    `Oi! Tenho a assinatura marcada pra ${agendado.toLowerCase()} e preciso de ajuda.`,
                  )}
                />
              )
            : <CardConsultor />
          : undefined
      }
      /* 🆕 04/09 (pedido do Pedro) — com horário marcado, a dúvida provável
         não é genérica: é REMARCAR. O link do rodapé assume esse papel em vez
         de ganhar um irmão — remarcar é pelo WhatsApp, o mesmo canal de
         qualquer outra dúvida.

         🐛 04/09 (achado do Pedro) — O RÓTULO PROMETIA A CONSULTORA DISPONÍVEL.
         Era "Remarcar ou falar com a Larissa", e isso está errado justamente
         AQUI: ela tem hora marcada com esta pessoa às 15h porque a agenda dela
         é finita — se estivesse livre a qualquer momento, agendar não faria
         sentido nenhum. Quem atende fora do horário marcado é quem estiver
         disponível, e a tela passa a dizer isso. ⚠️ Vale só onde a frase
         promete atendimento AGORA: "marcado com a Larissa" e "a Larissa faz
         este passo com você" continuam certos — são compromisso, não
         disponibilidade. */
      /* 🗑️ 05/09 — o "Falar com um consultor" SAIU daqui: com a referência
         nova, o atalho de contato passou a morar dentro do cartão do
         compromisso, ao lado de quem atende. A mesma ação em dois lugares na
         mesma tela faz a pessoa achar que são coisas diferentes. */
      /* 🆕 04/09 (achado do Pedro) — REMARCAR É AÇÃO DO APP, não pedido no
         WhatsApp: a agenda é nossa e a tela de escolher horário já existe.
         Divide a linha com o canal humano, cada um no seu destino. */
      acaoExtra={
        assistida && agendado ? { label: "Remarcar horário", onClick: onAgendar } : undefined
      }
      /* 🆕 04/09 — só na fase Junta: o cartão fundido não pode herdar o nome
         do bloco 1 ("Conta e plano"), que é um quarto do que ele contém. */
      /* O rótulo do cartão fundido, enquanto ele existe (ver `dossieNaLista`). */
      titulosBloco={
        naFaseJunta && dossieNaLista
          ? { [BLOCO_DOSSIE_FUNDIDO]: TITULO_DOSSIE_FUNDIDO }
          : undefined
      }
      onIrParaBloco={onIrParaBloco}
      /**
       * 🔴 Corrigir só existe ANTES do protocolo. Na fase JUNTA os dados já
       * estão com o órgão, e a pessoa aceitou isso na tela do ponto sem volta
       * (`/iniciar-viabilidade`) — deixar o "Ajustar" ali prometeria o que a
       * Junta não permite mais.
       */
      podeAjustar={!naFaseJunta}
      /* 🔄 04/09 — a `recusa.etapa` já chega relativa à cauda, e a cauda agora
         é a lista inteira na fase Junta: o offset do dossiê saiu junto com ele. */
      recusa={recusa ? { ...recusa, etapa: offsetCauda + recusa.etapa } : undefined}
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
                // 🆕 04/09 (pedido do Pedro) — com anel girando: botão apagado
                // e mudo lê como quebrado; com o anel, lê como espera.
                label: "Aguardando compensação",
                desabilitado: true,
                carregando: true,
              }
            : /* 🔄 04/09 — ANTES ESTE CTA ENSINAVA A FILA QUE A REGRA DERRUBOU.
                 Ele só oferecia pagar quando a guia era a etapa ATUAL; com a
                 viabilidade rodando, ficava travado dizendo "Aguardando
                 viabilidade". Agora a condição é a que importa: guia não paga,
                 botão de pagar. */
              !guiaPaga
              ? { label: "Pagar a guia agora", onClick: onPagarDae }
              : emAndamento >= iAssinatura
                ? /* 🆕 04/09 (rota assistida) — o CTA muda de verbo. Sem
                     horário: marcar. Com horário: fica TRAVADO dizendo o
                     compromisso, mesmo padrão do "Aguardando compensação" do
                     boleto — o botão não some (a tela perderia a anatomia no
                     meio da jornada), ele conta o estado. A dúvida continua
                     saindo pelo link de WhatsApp logo acima dele. */
                  assistida
                  ? agendado
                    ? {
                        label: `Marcado pra ${agendado.toLowerCase()}`,
                        desabilitado: true,
                      }
                    : { label: "Escolher um horário", onClick: onAgendar }
                  : { label: "Ir para a assinatura", onClick: onAssinar }
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
            : /* 🐛 04/09 (auditoria) — "o processo segue sozinho" era FALSO na
                 tela de exigência: ali ele PAROU e espera a pessoa. A promessa
                 de idempotência continua (nada duplica, nada se perde), mas o
                 que tranquiliza muda: no alerta é o progresso guardado, não o
                 andamento automático. */
              recusa
              ? "Seu progresso está guardado. Pode fechar o app: nada se perde, e nada recomeça do zero."
              : /* ✍️ 05/09 — na rota assistida sem horário marcado, "o
                   processo segue sozinho" é falso: ele parou e espera a pessoa
                   marcar. A promessa que vale aqui é a mesma da tela de
                   exigência — o progresso está guardado. */
                assistida && !agendado
                ? "Seu progresso está guardado. Pode fechar o app: nada se perde, e nada recomeça do zero."
                : "A abertura roda uma vez só. Pode fechar o app que o processo segue sozinho, de onde parou."
          : pago
            ? "Seu progresso está salvo. Pode sair e voltar quando quiser."
            : "Seu progresso está salvo. Se você já pagou, não cobramos de novo."
      }
    />
  );
}
