"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardNota } from "@/components/ui/card-nota";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
// 🆕 03/09 (pedido do Pedro) — o "i" + sheet de explicação, agora em TODAS as
// telas do dossiê. Mecânica no componente; cada tela manda só o conteúdo.
import { SheetInfo, BotaoInfo } from "@/components/ui/sheet-info";
import { ImagemZoom } from "@/components/ui/imagem-zoom";
import { Campo, Texto, Select, OpcoesLinha } from "@/components/ui/form";
// 🗑️ 01/09 — `CUSTOS` saiu junto do upsell de endereço fiscal do C4: a única
// coisa que lia preço aqui era aquele card, e ele deixou de existir.
import { FISCAL, brl } from "@/lib/fiscal";
import { FORMAS_ATUACAO } from "@/lib/mei";
import { linkWhatsApp } from "@/lib/contato";
// 🆕 01/09 — mesma máscara do E6, pro CPF do sócio extra (C3).
import { mascaraCpf, mascaraTelefone, mascaraData } from "@/components/wizard-dinheiro";
import { OutrasOpcoes, SheetCnae, type OpcaoCnae } from "@/components/encaixe";
import {
  CLIENTE,
  TEM_SOCIO,
  SOCIO_2,
  SOCIOS,
  NOME_EMPRESARIAL,
  CNAE_PRINCIPAL,
  PREENCHIMENTO,
  // 🆕 03/09 — subiram pro mock quando o A1 passou a reler os 3 nomes e o
  // objeto social. Aqui o uso não mudou, só o lugar de onde vêm (`CNAES_
  // SECUNDARIAS` saiu junto: a única coisa que lia a lista aqui era o gerador
  // do objeto social).
  RAZAO_OPCOES,
  OBJETO_SOCIAL,
} from "@/app/(app)/dossie/mock";
// 🆕 03/09 — rótulos de qualificação civil viraram `lib/` porque o recap do A1
// mostra os mesmos valores e precisa do mesmo texto.
import { ESTADO_CIVIL, REGIME_BENS, TIPO_IMOVEL } from "@/lib/qualificacao";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AS 7 TELAS DO DOSSIÊ (B4 · N10–N16) — fonte única, igual ao B3.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 FIDELIDADE POR CONSTRUÇÃO (a decisão de 29/07, agora aplicada ao dossiê).
 *
 * Até agora estas telas eram `export default function XPage()` dentro dos
 * `page.tsx`, com estado próprio. Isso bastava enquanto o único consumidor era
 * a rota — mas a `/apresentacao` precisa renderizar as MESMAS telas dentro do
 * aparelho, e o que não é componente não dá pra renderizar em dois lugares.
 *
 * A alternativa seria a demo COPIAR as telas. Já sabemos no que dá: a v1 da
 * demo era cópia e divergiu da produção **em um dia** (o N3 perdeu Lottie,
 * ícones e layout). Por isso a regra é a mesma do `wizard-dinheiro.tsx`:
 *
 *   · A TELA mora aqui. É a única cópia que existe.
 *   · As `page.tsx` de produção são **wrappers finos** — leem params e ligam a
 *     navegação. Nenhuma delas mudou 1 pixel nesta extração.
 *   · Editou na demo? Edita AQUI, e muda nos dois. Se algum dia uma versão
 *     precisar divergir, ela deslinka explicitamente (prop `layout`), com selo
 *     visível — nunca por cópia silenciosa.
 *
 * ─── ⚠️ O QUE ESTA EXTRAÇÃO **NÃO** RESOLVEU ─────────────────────────────
 * Cada View guarda o próprio estado, exatamente como as pages guardavam. Na
 * demo isso significa que voltar e avançar **reseta os campos** daquela tela: o
 * histórico de snapshot da `/apresentacao` restaura a ETAPA, não o que foi
 * digitado. É o mesmo comportamento de antes (as pages também remontavam), só
 * que agora fica visível numa navegação contínua. Resolver de verdade é o RF-01
 * (estado real entre telas), não um remendo aqui.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * ─── ✨ O PREENCHER AUTOMÁTICO DA DEMO ────────────────────────────────────
 * 🐛 29/07 — o botão "Preencher automático" da `/apresentacao` APARECIA nestas
 * telas e não fazia nada. Ele é ligado por `naTravessia`, que passou a incluir
 * o dossiê quando as 7 entraram na demo; mas o `preencherEtapa()` da demo só
 * conhecia os campos do B3. Botão visível que não responde é pior que botão
 * ausente, ainda mais numa apresentação.
 *
 * A correção não podia ser a demo mexer no estado interno de 7 telas — ela não
 * conhece esses campos, e passar a conhecer criaria de novo o acoplamento que a
 * fidelidade por construção existe pra evitar. Então **cada tela sabe se
 * preencher**: recebe um nonce e, quando ele muda, escreve os valores de
 * `PREENCHIMENTO` (que moram junto do resto do cliente de mentira).
 *
 * Nonce e não booleano de propósito: apresentar é repetir. Com booleano, clicar
 * duas vezes na mesma tela não faria nada na segunda.
 *
 * `undefined` = produção. As rotas `/dossie/*` não passam nada e nunca
 * preenchem sozinhas.
 */
function usePreencher(nonce: number | undefined, aplicar: () => void) {
  const feito = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (nonce === undefined || nonce === 0 || feito.current === nonce) return;
    feito.current = nonce;
    aplicar();
    // `aplicar` é recriada a cada render; incluí-la re-dispararia o efeito a
    // cada digitação e sobrescreveria o que a pessoa acabou de escrever. O
    // gatilho é o nonce, e só ele.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce]);
}

/* ═══════════════════ N10 · SEUS DADOS (confirmação) ═════════════════════ */

/**
 * 🔴 24/08 (reunião Rua Satélite 35, Natanael Dev) — upload/leitura de
 * documento por IA foi REMOVIDO do MVP (tinha entrado nesta mesma tela horas
 * antes, na reunião do Leonan). Motivo: custo e velocidade de leitura de
 * imagem por IA, e "o cara já pagou, tem interesse em preencher manualmente
 * 4 campos" (Pedro, R35). Fica como feature pra depois, não removida por
 * engano — se reaparecer, é decisão nova, não reversão de bug.
 */
/* 🔄 03/09 — `ESTADO_CIVIL` e `REGIME_BENS` mudaram pra `lib/qualificacao.ts`:
   o A1 (`/revisar`) relê esses valores e precisa do mesmo rótulo. */

export function SocioView({
  preencher,
  onSeguir,
  onVoltar,
  mei = false,
  ctaLabel,
}: {
  preencher?: number;
  onSeguir?: () => void;
  onVoltar?: () => void;
  /**
   * 🆕 28/08 — MEI esconde estado civil e regime de bens.
   *
   * Esses dois campos existem por causa do CONTRATO SOCIAL: a JUCEMG precisa
   * saber o regime pra saber se o cônjuge assina (por isso o aviso de comunhão
   * universal aqui embaixo). O MEI **não tem contrato social** — o documento
   * constitutivo é o CCMEI, e o formulário do Portal do Empreendedor não
   * pergunta estado civil em lugar nenhum.
   *
   * ⚠️ Tudo o mais nesta tela CONTINUA valendo pros dois: RG, órgão emissor e
   * data de nascimento. Nada foi retirado do caminho ME.
   *
   * `false` (default) = ME, tela idêntica ao que sempre foi.
   */
  mei?: boolean;
  /**
   * 🆕 01/09 (pedido do Pedro) — rótulo do CTA. Existe pro MODO AJUSTE: quem
   * volta pra corrigir um bloco vê "Atualizar dados" na última tela dele, em
   * vez de "Continuar" (que sugeriria refazer o wizard inteiro).
   * Ausente = "Continuar", o comportamento de sempre.
   */
  ctaLabel?: string;
}) {
  /**
   * 🗑️ 01/09 (auditoria 1-a-1, item 7) — **nome da mãe REMOVIDO**. Ele entrou
   * em 26/08 como "exigência de DBE ausente do dossiê", por raciocínio. A
   * gravação real derrubou isso: em 141 prints não existe campo de filiação em
   * lugar nenhum — nem no DBE (a Identificação do Representante, tela 54, é
   * nome + CPF + qualificação, o resto vem do CPF na base da Receita), nem no
   * Integrador (Dados do Sócio, telas 102-104), nem na qualificação do contrato
   * social (preview da tela 117).
   *
   * O MEI também não precisa: `pesquisa/abertura-mei/abertura-mei-processo.md`
   * (linha 98) diz que nome da mãe é **puxado do gov.br e não editável**. Era
   * campo obrigatório na 1ª tela pós-pagamento, sem consumidor conhecido.
   *
   * Se a certificadora parceira pedir na emissão do certificado, o lugar é lá
   * (A3.2), com o motivo à vista — não aqui.
   */
  const [rg, setRg] = useState("");
  const [orgao, setOrgao] = useState("");
  const [nascimento, setNascimento] = useState("");
  /**
   * 🆕 01/09 (2ª passada da auditoria, contra a ata da Izabela) — GAP ASSIMÉTRICO
   * fechado: o sócio extra tinha nacionalidade desde 31/08, o titular não — e o
   * contrato social qualifica TODO sócio com nacionalidade (art. 997 CC, visível
   * no preview real da JUCEMG, print 117: "brasileiro, Empresário, Solteiro…").
   * Nasce preenchido com "Brasileira", igual ao card do sócio: quem é brasileiro
   * não digita nada, e quem não é corrige. Fricção perto de zero, e evita
   * contrato errado pra estrangeiro (que existe no nosso escopo: o gate barra
   * domicílio fora do Brasil, não nacionalidade).
   */
  const [nacionalidade, setNacionalidade] = useState("Brasileira");
  /* 🆕 02/09 — nome e telefone viram estado editável (vinham do cadastro e
     eram só leitura). Seguir daqui revalida os dois no banco. */
  const [nome, setNome] = useState(CLIENTE.nome);
  const [telefone, setTelefone] = useState(CLIENTE.telefone);
  const [civil, setCivil] = useState("");
  const [regime, setRegime] = useState("");
  /**
   * 🆕 01/09 (pedido do Pedro) — ENDEREÇO PESSOAL, que era pedido no E6.
   * Migrou porque lá ele não tinha moldura: a pessoa acabava de responder o
   * endereço da EMPRESA no E3.4 e o cadastro pedia outro endereço sem dizer
   * de quem era (pior ainda pra quem escolheu o endereço fiscal da Legalizai).
   * Aqui a tela toda já se chama "Seus dados", e ele fica junto do resto da
   * qualificação que o contrato exige (art. 997 CC).
   *
   * É o endereço do REPRESENTANTE no DBE (telas 55-58 da gravação): CEP,
   * número e complemento, com o complemento estruturado (tipo APARTAMENTO +
   * descrição) sendo trabalho do RPA, não pergunta a mais aqui.
   */
  const [cepPessoal, setCepPessoal] = useState("");
  const [numeroPessoal, setNumeroPessoal] = useState("");
  const [complementoPessoal, setComplementoPessoal] = useState("");
  // 🆕 03/09 (pedido do Pedro) — "i" do cabeçalho: por que a gente pede RG,
  // estado civil e o endereço PESSOAL de quem já deu CPF.
  const [info, setInfo] = useState(false);
  const enderecoPessoal = buscarCep(cepPessoal.replace(/\D/g, ""));

  usePreencher(preencher, () => {
    setRg(PREENCHIMENTO.socio.rg);
    setOrgao(PREENCHIMENTO.socio.orgao);
    setNascimento(PREENCHIMENTO.socio.nascimento);
    setNacionalidade(PREENCHIMENTO.socio.nacionalidade);
    setCivil(PREENCHIMENTO.socio.civil);
    setRegime(PREENCHIMENTO.socio.regime);
  });

  const completo =
    rg.trim() !== "" &&
    orgao.trim() !== "" &&
    nascimento.trim() !== "" &&
    nacionalidade.trim() !== "" &&
    // 🆕 01/09 — endereço pessoal (vindo do E6) é obrigatório: é a ficha do
    // Representante no DBE. Complemento segue opcional.
    cepPessoal.replace(/\D/g, "").length === 8 &&
    numeroPessoal.trim() !== "" &&
    // Estado civil/regime só entram no ME (vão pro contrato social).
    (mei || (civil !== "" && (civil !== "casado" || regime !== "")));

  return (
    <>
      {/* "Seus dados", não "Dados do sócio" (19/07): quem abre sozinho não se
          vê como sócio, se vê como dono. */}
      <TelaHeader
        meta="Seus dados"
        onVoltar={onVoltar}
        acao={<BotaoInfo onClick={() => setInfo(true)} rotulo="Por que a gente pede esses dados" />}
      />

      <main className="app-main">
        {/* 🗑️ 02/09 (pente fino do Pedro) — subtítulo fora, como na C0 e na
            C5. Ele narrava a mecânica ("confira o que já preencheu e complete
            o resto") que a própria tela mostra: um card fechado do que veio do
            cadastro e campos vazios embaixo. A promessa de "não vamos pedir
            tudo de novo" continua sendo feita, e melhor, pelo card. */}
        {/* 🔄 02/09 (pedido do Pedro) — "pessoais" no título: a tela agora
            coleta nome, telefone, RG, nascimento e endereço DE CASA, e vem
            logo depois de duas telas sobre a empresa. O adjetivo separa os
            dois assuntos sem precisar de subtítulo. */}
        <Titulo>Seus dados pessoais</Titulo>

        <Corpo>
          {/* 🔄 02/09 (decisão do Pedro) — O CARD DE CONFIRMAÇÃO VIROU CAMPO.
              Nome e telefone eram linhas read-only num cartão, com um link de
              correção que saía do app. Agora são campos normais, preenchidos e
              EDITÁVEIS: seguir daqui revalida os dados no banco, então esta
              tela deixa de ser "confira" e passa a ser o ponto onde eles
              ficam certos. Corrigir um telefone digitado errado no cadastro
              não deveria custar uma conversa no WhatsApp. */}
          <Campo rotulo="Nome completo">
            <Texto valor={nome} onChange={setNome} />
          </Campo>

          <Campo rotulo="Telefone">
            <Texto
              valor={telefone}
              onChange={(v) => setTelefone(mascaraTelefone(v))}
              inputMode="tel"
            />
          </Campo>

          {/* O QUE FALTA — só o que o N6 não pergunta. */}
          <div className="grid grid-cols-2 gap-3">
            <Campo rotulo="RG">
              <Texto valor={rg} onChange={setRg} placeholder="00.000.000" />
            </Campo>
            <Campo rotulo="Órgão emissor">
              <Texto valor={orgao} onChange={setOrgao} placeholder="SSP/MG" />
            </Campo>
          </div>

          {/* 🔒 02/09 (decisão do Pedro) — O CPF FICA, TRAVADO. Nome e
              telefone se corrigem aqui; o CPF não: ele identifica a pessoa em
              tudo que já rodou antes desta tela (cobrança, consulta de
              situação) e vai identificar no DBE. Mostrar em cinza é mais
              honesto que esconder — ela confere que é o dela sem achar que
              pode trocar. Trocar CPF é outro assunto, e passa por gente. */}
          <Campo rotulo="CPF" dica="Confirmado no seu cadastro. Não muda por aqui.">
            <Texto valor={CLIENTE.cpf} onChange={() => {}} travado />
          </Campo>

          {/* 🆕 26/08 (achado do cruzamento com a pesquisa JUCEMG/DBE) — data
              de nascimento e nome da mãe são campo padrão do DBE (Receita
              Federal) e não existiam em nenhuma tela do dossiê. */}
          <div className="grid grid-cols-2 gap-3">
            <Campo rotulo="Data de nascimento">
              <Texto
                valor={nascimento}
                onChange={(v) => setNascimento(mascaraData(v))}
                placeholder="DD/MM/AAAA"
                inputMode="numeric"
                maxLength={10}
              />
            </Campo>
            {/* 🆕 01/09 — mesma dupla do card do sócio extra (nascimento +
                nacionalidade lado a lado), agora também pro titular. */}
            <Campo rotulo="Nacionalidade">
              {/* Sem placeholder: o campo nasce preenchido com "Brasileira",
                  e um placeholder igual ao valor nunca aparece. */}
              <Texto valor={nacionalidade} onChange={setNacionalidade} />
            </Campo>
          </div>

          {/* 🆕 28/08 — os 2 campos abaixo são do CONTRATO SOCIAL, que o MEI
              não tem. Some no MEI, intacto no ME. */}
          {!mei && (
            <Campo rotulo="Estado civil">
              <Select valor={civil} onChange={setCivil} opcoes={ESTADO_CIVIL} />
            </Campo>
          )}

          {/* Condicional: só casado revela o regime (spec Tela 6). */}
          {!mei && civil === "casado" && (
            <Campo rotulo="Regime de bens">
              <Select
                valor={regime}
                onChange={setRegime}
                opcoes={REGIME_BENS}
                placeholder="Como está na certidão de casamento"
              />
              {/* UX-30: avisa o cônjuge CEDO, não no cartório. */}
              {regime === "universal" && (
                <div className="mt-3">
                  <Aviso variante="info" titulo="Seu cônjuge vai precisar assinar">
                    Na comunhão universal, ele assina um documento nesta abertura.
                    Bom já alinhar com ele agora pra não travar no fim.
                  </Aviso>
                </div>
              )}
            </Campo>
          )}

          {/* 🆕 01/09 — ENDEREÇO PESSOAL (migrado do E6). O rótulo diz de quem
              é, que era exatamente o que faltava lá: no cadastro a pessoa
              tinha acabado de informar o endereço da EMPRESA e não sabia se
              estava repetindo. */}
          <Campo
            rotulo="Onde você mora"
            dica="O seu, não o da empresa."
          >
            <Texto
              valor={cepPessoal}
              onChange={(v) => setCepPessoal(mascaraCep(v))}
              placeholder="00000-000"
              inputMode="numeric"
            />
          </Campo>

          {enderecoPessoal && (
            <>
              {/* 🔄 02/09 (pente fino do Pedro) — O ENDEREÇO ENCONTRADO DEIXA
                  DE PARECER CAMPO. Era um bloco cinza (`surface-alt`) sem
                  rótulo, colado no CEP: lia como mensagem de erro do campo de
                  cima, e usava o MESMO cinza do CPF travado — que significa
                  outra coisa ("é seu, e você não mexe"). Agora é uma linha de
                  confirmação, com o check verde que o app usa pra "deu certo"
                  e o texto dizendo o que ele é. */}
              {/* 🔄 02/09 (pedido do Pedro) — o endereço encontrado usa o
                  `CardNota` positivo, o mesmo cartão de check verde que o app
                  já usa pra confirmar coisa boa (E3.2, E3.4). Era uma linha
                  solta; virou o componente que existe pra isso. */}
              <div className="-mt-3">
                <CardNota>
                  {/* 🐛 02/09 — tinha travessão, proibido em texto público
                      desde 24/07. Escapou porque não é frase, é concatenação. */}
                  {enderecoPessoal.logradouro}, {enderecoPessoal.bairro},{" "}
                  {enderecoPessoal.municipio}/{enderecoPessoal.uf}
                </CardNota>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Campo rotulo="Número">
                  <Texto
                    valor={numeroPessoal}
                    onChange={setNumeroPessoal}
                    placeholder="Nº"
                    inputMode="numeric"
                  />
                </Campo>
                <Campo rotulo="Complemento">
                  <Texto
                    valor={complementoPessoal}
                    onChange={setComplementoPessoal}
                    placeholder="Bloco, apto..."
                  />
                </Campo>
              </div>
            </>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              🪒 29/07 — AQUI FICAVA "VOCÊ MORA FORA DO BRASIL?" (removida).

              Era uma CONFIRMAÇÃO: a triagem do N4 já pergunta isso, e barra
              quem responde sim, com saída dedicada (LC 123 art. 17). Repetir a
              pergunta aqui é a mesma duplicação que tiramos do CPF no N9 —
              perguntar de novo o que a pessoa já respondeu não vira segurança,
              vira desconfiança.

              Saiu com ela o `Aviso` de bloqueio e o botão "Falar com o time"
              (que, até hoje de manhã, era um beco sem saída sem `onClick`).

              ⚠️ O que isto significa na prática: o N10 passa a CONFIAR na
              resposta do N4. A saída `/saida/exterior` continua existindo e
              continua alcançável pela triagem — o que deixou de existir é a
              segunda barreira. Se um dia o dado do N4 puder se perder entre as
              telas, é aqui que a falta vai doer.
              ───────────────────────────────────────────────────────────────── */}
        </Corpo>

        {/* Sheet é irmão do `Corpo`, nunca filho (senão sai cortado). */}
        {info && (
          <SheetInfo
            titulo="Por que a gente pede isso"
            onFechar={() => setInfo(false)}
            pontos={[
              "O CPF identifica você nos sistemas, mas o contrato social exige a qualificação completa: RG com órgão emissor, nascimento, nacionalidade e estado civil (art. 997 do Código Civil).",
              "O estado civil e o regime de bens entram porque, em alguns regimes, o cônjuge precisa assinar junto. Melhor descobrir agora do que na hora da assinatura.",
              "O endereço aqui é o SEU, de moradia, não o da empresa. Ele vai na ficha do representante na Receita Federal, e é separado do endereço onde a empresa funciona.",
              "Nada disso vira consulta a órgão nenhum por conta própria: os dados só são usados nos documentos da sua abertura.",
            ]}
            exemplo={{
              titulo: "Onde achar o órgão emissor",
              nota: "Está no seu RG, abaixo ou ao lado do número, em siglas: SSP/MG, PC/MG, DETRAN/MG. Se o seu documento é a CNH, use o que está escrito nela como documento de origem.",
            }}
          />
        )}

        <Rodape>
          <Button full disabled={!completo} onClick={onSeguir}>
            {/* 🔄 02/09 (pedido do Pedro) — fora o "Continuar" genérico. O
                botão diz o que a pessoa está afirmando, que é o critério que
                a C0 e a C5 já seguem. Aqui ela PREENCHEU o que faltava (RG,
                nascimento, endereço) e REVALIDOU o que já estava lá (nome,
                telefone) — "confirmar" cobre as duas.
                Não "salvar": vocabulário de sistema, e hoje seria mentira
                (não há persistência entre telas, dívida RF-01).
                No modo ajuste o `ctaLabel` manda e vira "Atualizar dados". */}
            {ctaLabel ?? "Confirmar meus dados"}
          </Button>
        </Rodape>
      </main>
    </>
  );
}

/* 🗑️ 02/09 — `LinhaConfirma` (rótulo + valor read-only) morreu com o card
   de confirmação da C1: nome e telefone viraram campos editáveis e o CPF virou
   campo travado. Nenhuma outra tela usava. */

/* ═══════════════════ N11 · VÍNCULO INSS ═════════════════════════════════ */

function mascaraReais(v: string) {
  const d = v.replace(/\D/g, "");
  if (!d) return "";
  return Number(d).toLocaleString("pt-BR");
}

export function VinculoView({
  preencher,
  onSeguir,
  onVoltar,
  ctaLabel,
}: {
  preencher?: number;
  onSeguir?: () => void;
  onVoltar?: () => void;
  /**
   * 🆕 01/09 (pedido do Pedro) — rótulo do CTA. Existe pro MODO AJUSTE: quem
   * volta pra corrigir um bloco vê "Atualizar dados" na última tela dele, em
   * vez de "Continuar" (que sugeriria refazer o wizard inteiro).
   * Ausente = "Continuar", o comportamento de sempre.
   */
  ctaLabel?: string;
}) {
  const [contribui, setContribui] = useState<boolean | null>(null);
  const [valor, setValor] = useState("");
  // 🆕 03/09 (pedido do Pedro) — "i" do cabeçalho. É a tela mais desconfiada
  // do dossiê ("por que isso é da conta de vocês?"), e o sheet é onde a
  // resposta cabe sem pesar a tela (a linha sobre não consultar vínculo de
  // ninguém tinha saído da tela em 02/09 justamente por peso).
  const [info, setInfo] = useState(false);

  usePreencher(preencher, () => {
    setContribui(PREENCHIMENTO.vinculo.contribui);
    setValor(PREENCHIMENTO.vinculo.valor);
  });

  const clt = Number(valor.replace(/\D/g, "")) || 0;
  const folga = Math.max(0, FISCAL.TETO_INSS - clt);
  const zerado = folga <= 0;

  const completo = contribui === false || (contribui === true && clt > 0);

  return (
    <>
      {/* 🐛 02/09 — `meta` dizia "Como você já contribui", uma descrição
          DESTA tela. Ele nomeia o DESTINO do voltar (padrão do gate, 29/08):
          daqui volta pra C1. 4ª ocorrência da mesma família hoje. */}
      <TelaHeader
        meta="Seus dados pessoais"
        onVoltar={onVoltar}
        acao={<BotaoInfo onClick={() => setInfo(true)} rotulo="Por que a gente pergunta isso" />}
      />

      <main className="app-main">
        {/* 🔄 02/09 (pente fino do Pedro) — o subtítulo perdeu o "Vale a
            pena acertar", que era enfeite e soava como se a gente estivesse
            convencendo. Ficou só o PORQUÊ da pergunta, que não está em nenhum
            outro lugar da tela — e aqui ele se justifica: é a única pergunta
            do dossiê sobre a vida da pessoa FORA da empresa. */}
        {/* 🆕 02/09 (pedido do Pedro) — O COFRINHO 3D NO TOPO.
            Mesmo tratamento do E6.1 e do C0.1: a ilustração ocupa o vazio e
            se centraliza NELE, com sombra de contato em 2 camadas e
            flutuação sutil. Cofrinho e não carteira de trabalho: a pergunta
            cobre CLT, aposentadoria, autônomo e sócio de outra empresa, e um
            símbolo de emprego formal faria o aposentado achar que não é com
            ele — justamente o erro que a dica existe pra evitar.
            ⚠️ Some quando a pessoa responde "sim": aí a tela ganha os campos
            do vínculo e não sobra vazio pra ocupar. */}
          <div className="flex min-h-0 flex-1 items-center justify-center py-4">
            <div id="vinculo-flutua" className="relative flex h-[65%] max-h-[254px] items-end">
              <div
                aria-hidden
                className="absolute -bottom-2 left-1/2 h-5 w-[72%] -translate-x-1/2 blur-md"
                style={{
                background:
                  "radial-gradient(closest-side, rgba(27,30,36,.30), rgba(27,30,36,.10) 62%, transparent 100%)",
                }}
              />
              <Image
                src="/icones/vinculo-cofrinho.png"
                alt=""
                aria-hidden
                width={500}
                height={645}
                className="relative z-10 h-full w-auto"
                style={{ filter: "drop-shadow(6px 14px 12px rgba(27,30,36,.20))" }}
              />
            </div>

            {/* Mesma dosagem do E6.1/C0.1: durações que não se dividem entre
                si (7s / 5,5s) pro loop não virar sobe-e-desce mecânico.
                ♿ desliga em `prefers-reduced-motion`. */}
            <style jsx global>{`
              @keyframes vinculo-flutua-obj {
                0%   { transform: translate3d(0, 0, 0) rotate(0deg); }
                35%  { transform: translate3d(4px, -7px, 0) rotate(0.6deg); }
                70%  { transform: translate3d(-3px, -3px, 0) rotate(-0.5deg); }
                100% { transform: translate3d(0, 0, 0) rotate(0deg); }
              }
              @keyframes vinculo-flutua-sombra {
                0%   { transform: translateX(-50%) scaleX(1); opacity: 1; }
                35%  { transform: translateX(-50%) scaleX(0.9); opacity: 0.72; }
                70%  { transform: translateX(-50%) scaleX(0.96); opacity: 0.88; }
                100% { transform: translateX(-50%) scaleX(1); opacity: 1; }
              }
              #vinculo-flutua img {
                animation: vinculo-flutua-obj 7s ease-in-out infinite;
                will-change: transform;
              }
              #vinculo-flutua > div[aria-hidden] {
                animation: vinculo-flutua-sombra 5.5s ease-in-out infinite;
                will-change: transform, opacity;
              }
              @media (prefers-reduced-motion: reduce) {
                #vinculo-flutua img,
                #vinculo-flutua > div[aria-hidden] {
                animation: none;
                }
              }
            `}</style>
          </div>
        
        <Titulo sub="Isso muda o imposto que a empresa paga.">
          Você já contribui pro INSS por fora?
        </Titulo>

        {/* 🔄 02/09 (pedido do Pedro) — conteúdo COLADO NO RODAPÉ: quem
            estica é a ilustração, lá em cima. Por isso não usa o `Corpo` (que
            é flex-1 e disputaria a sobra com ela); é um bloco fixo, e quando a
            resposta é "sim" os campos que aparecem empurram a ilustração, que
            encolhe em vez de sumir. */}
        <div className="flex shrink-0 flex-col gap-6 pb-4">
          {/* 🗑️ 02/09 — o rótulo "Já recolhe INSS hoje?" saiu: era a MESMA
              pergunta do título, com outras palavras, e quem lia as duas
              parava pra checar se eram a mesma coisa. A dica fica — ela não
              repete a pergunta, define o escopo do que conta como vínculo. */}
          <Campo
            rotulo=""
            dica="Vale emprego de carteira, aposentadoria, autônomo ou sócio de outra empresa."
          >
            <OpcoesLinha
              opcoes={[
                { v: false, label: "Não" },
                { v: true, label: "Sim" },
              ]}
              valor={contribui}
              onChange={setContribui}
            />
          </Campo>

          {contribui === true && (
            <>
              <Campo
                rotulo="Quanto você recebe por mês nesse vínculo?"
                dica="É sobre esse valor que o INSS já é descontado."
              >
                <Texto
                  valor={valor}
                  onChange={(v) => setValor(mascaraReais(v))}
                  placeholder="R$ 0"
                  inputMode="numeric"
                />
              </Campo>

              {/* Teto = FOLGA, não binário (spec Tela 7). */}
              {clt > 0 && (
                <Aviso
                  variante={zerado ? "success" : "info"}
                  titulo={
                    zerado
                      ? "Você não paga INSS de novo na empresa"
                      : "Na empresa, o INSS vem só sobre a folga"
                  }
                >
                  {zerado ? (
                    <>
                      Seu vínculo já bate o teto de {brl(FISCAL.TETO_INSS)}. O
                      pró-labore não recolhe INSS de novo.
                    </>
                  ) : (
                    <>
                      Você já contribui sobre {brl(clt)}. Na empresa, o INSS incide
                      só sobre o que falta pro teto: {brl(folga)}. Não é o valor
                      cheio nem zero, então não precisa forçar o pró-labore por
                      causa disso.
                    </>
                  )}
                </Aviso>
              )}
            </>
          )}

          {/* 🗑️ 02/09 (pente fino do Pedro) — o bloco "Como você se paga na
              sua empresa" saiu. Ele explicava pró-labore em 3 linhas, SEMPRE
              visíveis, respondendo uma dúvida que esta tela não levanta: aqui
              a pergunta é se a pessoa contribui POR FORA. Era o maior peso
              visual de uma tela que faz uma pergunta binária.
              O reenquadramento do UX-27 ("pró-labore é ganho, não só 'você não
              pode ser CLT'") continua valendo — o lugar dele é onde o
              pró-labore é definido de fato (C4/A1), não aqui. */}
          {/* 🗑️ 02/09 (pedido do Pedro) — a linha "a gente não consulta o
              vínculo de ninguém sozinho" saiu. Eu tinha defendido mantê-la
              como resposta à desconfiança certa desta tela; o Pedro cortou. A
              declaração continua sendo declaração, só sem a nota de rodapé. */}
        </div>

        {info && (
          <SheetInfo
            titulo="Por que a gente pergunta isso"
            onFechar={() => setInfo(false)}
            pontos={[
              "O INSS tem um teto por mês. Se você já contribui em outro lugar, na empresa você recolhe só sobre o que falta pro teto, e não o valor cheio de novo.",
              "Sem essa resposta a gente teria que assumir o pior caso e você pagaria mais do que deve, todo mês.",
              "Vale emprego de carteira, aposentadoria, autônomo que já recolhe e sócio de outra empresa.",
              "A gente não consulta o vínculo de ninguém por conta própria, e seu empregador não fica sabendo de nada: quem informa é você, aqui.",
            ]}
          />
        )}

        <Rodape>
          <Button full disabled={!completo} onClick={onSeguir}>
            {ctaLabel ?? "Confirmar"}
          </Button>
        </Rodape>
      </main>
    </>
  );
}

/* ═══════════════════ N12 · SÓCIOS ═══════════════════════════════════════ */

/**
 * ⚠️ 29/07 — A PERGUNTA "TEM OUTRO SÓCIO?" FOI REMOVIDA (decisão do Pedro).
 *
 * A triagem do N4 já pergunta quantos sócios a empresa vai ter, e barra 3+ lá
 * atrás. Esta tela vinha perguntando de NOVO com um toggle "Só eu / Tem sócio",
 * como se fosse a 1ª notícia — a mesma duplicação que já tinha sido apontada no
 * doc antigo (UX-21) mas nunca corrigida na prática. É a mesma direção do N10
 * (removeu "mora fora do Brasil?") e do N15 (parou de oferecer o formato
 * impossível): não reperguntar o que já foi respondido.
 *
 * A tela agora É DINÂMICA por `TEM_SOCIO` (a resposta dada "lá atrás" — hoje um
 * import de `../mock`, no app real viria do estado da triagem):
 *   · TEM_SOCIO → mostra direto o formulário do 2º sócio (nome + participação).
 *   · !TEM_SOCIO → mostra direto a confirmação "Empresa só sua", sem pergunta.
 * Nos dois casos não sobra escolha pra fazer aqui — só CONFIRMAR e completar.
 */
/**
 * 🆕 24/08 (reunião Leonan 19/08) — SÓCIOS EXTRAS VIRARAM LISTA, não mais um
 * campo fixo de "2º sócio". Limite subiu de 2 pra 4 sócios totais (titular +
 * até 3 extras) — ver `TriagemView` em `gate-telas.tsx`.
 *
 * 🔒 24/08 (pedido do Pedro, em cima da reunião) — DOIS TRAVAMENTOS NOVOS:
 *   1. **Quantidade travada.** A pergunta "quantos sócios" já foi respondida
 *      lá atrás, na triagem (E5T). Esta tela não oferece mais adicionar/
 *      remover — ela renderiza exatamente os slots que faltam (`SOCIOS - 1`,
 *      vindo do mock que representa a resposta da triagem) e só pede pra
 *      PREENCHER, não pra decidir de novo quantos são.
 *   2. **CPF travado, sem pergunta.** O tipo (CPF/CNPJ) também já foi
 *      perguntado na triagem (E5T) — CNPJ já bloqueou lá, antes do dinheiro
 *      (ver `/saida/socio-pj`). Quem chega aqui só pode ser CPF, então nem
 *      aparece a pergunta "pessoa física ou jurídica?" — seria reperguntar o
 *      que já foi respondido, mesma doutrina do resto do dossiê (não
 *      reconfirmar "mora fora do Brasil?" no C1, não repetir CNAE no C5).
 */
/**
 * 🆕 31/08 (achado da reunião Rua Satélite 38-40 + gap-analysis contra o flow)
 * — sócio extra só tinha nome+%. A JUCEMG/DBE exige a MESMA qualificação do
 * titular (art. 997 CC) pra qualquer sócio, não só quem cadastra. Profissão
 * FICA DE FORA de propósito: é preenchida internamente como "Empresário" pra
 * todo mundo (titular e extras), decisão validada 31/08 — não é campo.
 */
/**
 * 🆕 01/09 (auditoria 1-a-1 campo-do-órgão × campo-do-app, itens 1 e 2) — CPF e
 * endereço do sócio extra faltavam. Os dois são exigência direta:
 *
 * · **CPF** é a CHAVE do sócio nos 3 sistemas (Viabilidade tela 14, QSA do DBE
 *   telas 63-70, Integrador tela 102). O RG entra na qualificação do contrato,
 *   mas não identifica a linha do sócio em lugar nenhum. O `dados` do C3 dizia
 *   "(CPF implícito)" — o que a triagem (E5T) trava é o TIPO (só pessoa
 *   física), nunca o número.
 * · **Endereço** entra na qualificação do contrato social (art. 997 CC, visto
 *   no preview real da JUCEMG, print 117) e tem ficha própria no DBE
 *   ("Endereço do Sócio/Administrador", telas 67-69). Na gravação ele veio
 *   preenchido sozinho porque a empresa era SOLO: o sócio era o representante,
 *   e o sistema manda usar a ficha do representante nesse caso (popup da tela
 *   66). Com 2 sócios não existe de onde herdar.
 */
interface SocioExtra {
  id: string;
  nome: string;
  cpf: string;
  participacao: number;
  nascimento: string;
  nacionalidade: string;
  rg: string;
  orgao: string;
  civil: string;
  regime: string;
  cep: string;
  numero: string;
  complemento: string;
}

function novoSocioExtra(nome = "", participacao = 0): SocioExtra {
  return {
    id: `s${Math.random().toString(36).slice(2, 8)}`,
    nome,
    cpf: "",
    participacao,
    nascimento: "",
    nacionalidade: "Brasileira",
    rg: "",
    orgao: "",
    civil: "",
    regime: "",
    cep: "",
    numero: "",
    complemento: "",
  };
}

export function SociosView({
  preencher,
  onSeguir,
  onVoltar,
  contexto = "abrir",
  socios,
  ctaLabel,
}: {
  preencher?: number;
  onSeguir?: () => void;
  onVoltar?: () => void;
  /**
   * 🆕 24/08 (reunião Leonan 19/08, "durante essa migração... ele preencha
   * TODOS os dados base de uma constituição... [inclusive] a sociedade") —
   * esta MESMA tela é reusada no caminho migrar (`/migrar/socios`, depois do
   * E4.2b). Só a copy muda: no caminho abrir, "Você disse" se refere à
   * triagem (E5T); no migrar não existe essa triagem prévia, então a tela
   * precisa se sustentar sozinha, sem fingir uma resposta anterior que não
   * existiu.
   */
  contexto?: "abrir" | "migrar";
  /**
   * 🆕 01/09 — quantidade de sócios da empresa (titular incluído). Sem ela vale
   * o mock (`SOCIOS`), que é 2. Existe pra dar como VER o caso de 3-4 sócios,
   * onde a pergunta de administração deixa de ser sim/não e vira lista de
   * nomes: a triagem real (E5T) já aceita até 4, mas o mock congela em 2 e a
   * variante ficava invisível na demo.
   */
  socios?: number;
  /**
   * 🆕 01/09 (pedido do Pedro) — rótulo do CTA. Existe pro MODO AJUSTE: quem
   * volta pra corrigir um bloco vê "Atualizar dados" na última tela dele, em
   * vez de "Continuar" (que sugeriria refazer o wizard inteiro).
   * Ausente = "Continuar", o comportamento de sempre.
   */
  ctaLabel?: string;
}) {
  // 🔒 24/08 — quantidade FIXA, vinda do que a triagem já decidiu (`SOCIOS`,
  // fonte única em `dossie/mock.ts`). Divide 100% em partes iguais entre os
  // extras como ponto de partida; a pessoa ajusta.
  const qtdExtras = Math.max(0, (socios ?? SOCIOS) - 1);
  // 🆕 31/08 — só o 1º extra (SOCIO_2) nasce com a qualificação de exemplo;
  // extras além dele nascem em branco, igual sempre foi com nome.
  const socioExtraPreenchido = () => ({
    ...novoSocioExtra(SOCIO_2.nome, 0),
    ...PREENCHIMENTO.socioExtra,
  });
  const inicial = () =>
    qtdExtras === 0
      ? []
      : qtdExtras === 1
        ? [{ ...socioExtraPreenchido(), participacao: 50 }]
        : Array.from({ length: qtdExtras }, (_, i) =>
            i === 0
              ? { ...socioExtraPreenchido(), participacao: Math.round(100 / (qtdExtras + 1)) }
              : novoSocioExtra("", Math.round(100 / (qtdExtras + 1))),
          );

  const [extras, setExtras] = useState<SocioExtra[]>(inicial);
  // Quantidade manda no plural do título e do subtítulo.
  const varios = extras.length > 1;
  const [socioAberto, setSocioAberto] = useState<string | null>(null);
  // Sheet "o que significa administrar" — conteúdo fixo, não depende de quem
  // está marcado (fala dos dois papéis, administrador e sócio comum).
  const [infoAdmin, setInfoAdmin] = useState(false);
  /* 🆕 03/09 (pedido do Pedro) — "i" do CABEÇALHO, separado do "i" do card de
     administração: são assuntos diferentes (aquele responde "o que é
     administrar", este responde "como funciona ter sócio e dividir a
     empresa"). Fundir os dois num sheet só transformaria a resposta curta de
     um card numa aula sobre sociedade. */
  const [infoSocios, setInfoSocios] = useState(false);

  /**
   * 🆕 01/09 (reunião Rua Satélite 42) — QUEM ADMINISTRA.
   *
   * `null` = ainda não respondeu, e é diferente de "só eu": a resposta define
   * a qualificação de cada sócio no DBE (49 sócio-administrador × 22 sócio) e
   * quem sai na cláusula de administração do contrato. Deixar o default valendo
   * como resposta escolheria pelo cliente um contrato que ele nunca leu.
   */
  const [administracao, setAdministracao] = useState<"so-eu" | "com-socios" | "lista" | null>(null);
  /** Ids dos sócios extras que também administram (só usado com 2+ extras). */
  const [admins, setAdmins] = useState<string[]>([]);

  // Esta tela já nasce preenchida pelo mock; o botão serve pra DESFAZER o que
  // quem apresenta mexeu ao vivo e voltar pro estado canônico.
  usePreencher(preencher, () => {
    setExtras(inicial());
  });

  const somaExtras = extras.reduce((acc, s) => acc + s.participacao, 0);
  const parte1 = 100 - somaExtras; // participação do titular, derivada

  /**
   * 🆕 31/08 (pedido do Pedro) — o card do titular ganhou campo editável de %.
   * `parte1` continua DERIVADO (100 - soma dos extras), pra não ter 2 fontes
   * de verdade — editar o titular aqui redistribui os extras proporcionalmente
   * pra fechar 100% nos dois sentidos ("muda a dele, muda a do sócio abaixo, e
   * vice-versa"). Com 1 extra só, vira o espelho direto (extra = 100 - titular).
   */
  function onChangeParte1(novoParte1: number) {
    const alvoExtras = Math.max(0, Math.min(99, 100 - novoParte1));
    setExtras((atual) => {
      if (atual.length === 0) return atual;
      const somaAtual = atual.reduce((acc, s) => acc + s.participacao, 0);
      if (somaAtual <= 0) {
        const cada = Math.round(alvoExtras / atual.length);
        return atual.map((s) => ({ ...s, participacao: cada }));
      }
      const fator = alvoExtras / somaAtual;
      return atual.map((s) => ({
        ...s,
        participacao: Math.round(s.participacao * fator),
      }));
    });
  }

  const nomesOk = extras.every((s) => s.nome.trim().split(/\s+/).length >= 2);
  const somaOk = somaExtras > 0 && somaExtras < 100;
  // 🆕 31/08 — mesma qualificação exigida do titular (C1), agora também do
  // sócio extra: nascimento, nacionalidade, RG+órgão, estado civil (+regime
  // se casado). Profissão não entra — preenchida internamente.
  // 🆕 01/09 — CPF (chave do sócio no QSA) e endereço (qualificação do contrato,
  // art. 997 CC) entraram na conta. Complemento fica opcional, como no E6.
  const qualificacaoDoSocioOk = (s: SocioExtra) =>
    s.cpf.replace(/\D/g, "").length === 11 &&
    s.nascimento.trim() !== "" &&
    s.nacionalidade.trim() !== "" &&
    s.rg.trim() !== "" &&
    s.orgao.trim() !== "" &&
    s.civil !== "" &&
    (s.civil !== "casado" || s.regime !== "") &&
    s.cep.replace(/\D/g, "").length === 8 &&
    s.numero.trim() !== "";
  const qualificacaoOk = extras.every(qualificacaoDoSocioOk);
  /* 🐛 03/09 (pente-fino, pedido do Pedro) — o check verde do card colapsado
     vinha de um `socioSalvo` marcado só pelo clique no botão "Salvar
     informações". Fechar o card de qualquer outra forma (tocar no cabeçalho
     de novo, abrir outro card) deixava o check MENTINDO — verde travado de
     um clique antigo, mesmo com edição depois. Agora "salvo" é DERIVADO das
     mesmas regras da validação real: reflete o dado atual, não o último
     clique. Mesmo predicado reaproveitado pra sinalizar QUAL card falta
     completar, com o card fechado (achado do pente-fino: o CTA travava sem
     apontar onde faltava algo). */
  const socioCompleto = (s: SocioExtra) => s.nome.trim().split(/\s+/).length >= 2 && qualificacaoDoSocioOk(s);
  /**
   * 🆕 01/09 — com sócio, a administração é obrigatória no caminho ABRIR: sem
   * ela o RPA não sabe qual qualificação mandar pro DBE. Com 2+ extras e a
   * opção "eu e sócio(s)", pelo menos 1 tem que estar marcado — senão a
   * resposta é, na prática, "só eu", e aí é isso que a pessoa deveria ter
   * escolhido.
   */
  const administracaoOk =
    contexto !== "abrir" || !TEM_SOCIO || extras.length > 1 || administracao !== null;
  const completo = (!TEM_SOCIO || (nomesOk && somaOk && qualificacaoOk)) && administracaoOk;
  /* 🐛 03/09 (pente-fino, pedido do Pedro) — o CTA travava (disabled) sem
     nenhuma pista de ONDE faltava algo: nome e CPF têm erro inline, o resto
     da qualificação (nascimento, RG, órgão, civil, regime, endereço) não.
     Com os cards colapsados, a pessoa só descobria tentando "Continuar" e
     nada acontecendo. Esta lista alimenta um aviso no rodapé apontando QUAL
     sócio (por nome) ainda tem dado faltando. */
  const sociosIncompletos = extras
    .map((s, i) => ({ s, titulo: s.nome.trim() || `${i + 2}º sócio` }))
    .filter(({ s }) => !socioCompleto(s))
    .map(({ titulo }) => titulo);

  function atualizar(id: string, patch: Partial<SocioExtra>) {
    setExtras((atual) => atual.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  return (
    <>
      {/* Mesmo alinhamento do N10: o cliente lê "Sócios" na lista de passos
          (P1/P2), então é isso que a tela precisa dizer. */}
      {/* 🐛 02/09 — `meta` é o nome do DESTINO do voltar, não desta tela
          (regra 6 do CLAUDE.md). Daqui volta pra C2. */}
      <TelaHeader
        meta="Vínculo com o INSS"
        onVoltar={onVoltar}
        acao={<BotaoInfo onClick={() => setInfoSocios(true)} rotulo="Como funciona ter sócio" />}
      />

      <main className="app-main">
        <Titulo
          sub={
            contexto === "migrar"
              ? TEM_SOCIO
                ? "Pra fazer a procuração e a transferência, a gente precisa dos dados de todos os sócios da empresa."
                : "Confirma: sua empresa é só sua, sem outros sócios?"
              : TEM_SOCIO
                ? // 🔄 03/09 (pedido do Pedro) — sem o "você disse que teria
                  // sócio": a tela não precisa provar que lembrou da resposta
                  // anterior, e quem chegou aqui já sabe por que está aqui. Só
                  // a instrução, no plural certo.
                  varios
                  ? "Preencha os dados dos seus sócios."
                  : "Preencha os dados do seu sócio."
                : "Você disse que abriria sozinho. É só confirmar."
          }
        >
          {/* 🔄 03/09 (pedido do Pedro) — título e subtítulo concordam com a
              QUANTIDADE. Com 2 ou 3 sócios extras a tela dizia "Seu sócio" no
              singular e "os dados dele", como se fosse um só. */}
          {contexto === "migrar"
            ? TEM_SOCIO
              ? varios
                ? "Sua empresa tem sócios"
                : "Sua empresa tem sócio"
              : "Empresa só sua"
            : TEM_SOCIO
              ? varios
                ? "Seus sócios"
                : "Seu sócio"
              : "Empresa só sua"}
        </Titulo>

        <Corpo>
          {TEM_SOCIO ? (
            <>
              {/* ✍️ 29/07 — o limite era um `Aviso` de bloco, com título, e
                  aparecia pra 100% de quem chega aqui: a triagem do N4 já barrou
                  quem excede lá atrás, então todo mundo que lê está DENTRO do
                  limite. Dar peso de notícia ruim a quem não foi barrado gasta
                  atenção contra o usuário. Virou nota de rodapé.
                  🔒 24/08 — quantidade e tipo (CPF) já foram travados na
                  triagem; aqui só falta preencher nome + participação. */}
{/* 🗑️ 02/09 (levantamento C3→A1) — a frase "os outros dados de cada
                  sócio a gente coleta igual aos seus, na sequência" saiu: era
                  FALSA. Todos os dados do sócio (nome, CPF, nascimento, RG,
                  órgão, estado civil, regime, endereço) estão nesta mesma
                  tela. Nada vem depois. */}

              {/* 🆕 26/08 (pedido do Pedro) — card travado do 1º sócio (você),
                  em TODAS as telas de sócios: mostra que você já É um sócio
                  (não uma pergunta em aberto). Nome sem edição, mesmo padrão
                  do card read-only "Já preenchido no cadastro" do `SocioView`.
                  🆕 31/08 (pedido do Pedro) — % agora é EDITÁVEL aqui também:
                  mudar a sua % redistribui os sócios extras proporcionalmente
                  (e mudar a de um extra já recalculava a sua, como sempre) —
                  o vínculo passou a valer nos dois sentidos. */}
              {/* 🔄 03/09 (pedido do Pedro, 2ª rodada) — O CARD DO TITULAR
                  VOLTA, mas como RECIBO: sem a %, que mora só na mesa da
                  divisão, sobra só "quem é você" — no mesmo desenho da linha
                  colapsada dos sócios, pra não ficar um peixe fora d'água
                  acima deles.
                  🔄 03/09 (5ª rodada, pedido do Pedro) — mesma estrutura de
                  linha dos cards de sócio (flex normal, sem absolute): nome
                  com `flex-1`, pills, check — todos fluindo no mesmo espaço,
                  pra bater o mesmo padding com quem tem chevron e quem não
                  tem. Check sempre VERDE (mesma cor de confirmação).
                  🐛 03/09 (6ª rodada) — o card da Ana era filho direto do
                  `Corpo` (gap-6, 24px) enquanto os sócios extras viviam num
                  wrapper próprio (gap-3, 12px): o espaço ANTES do Carlos saía
                  o DOBRO do espaço entre Carlos e o 3º sócio. Ana entra pro
                  mesmo wrapper, mesmo gap-3, pra todo mundo respirar igual.
                  Pill "Administra" também virou verde aqui — mesma cor de
                  quem administra nos cards de baixo, sem distinção. */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 rounded-md border border-border-hairline bg-surface-card p-3">
                  <span className="min-w-0 flex-1 truncate text-caption font-semibold text-text-primary">
                    {CLIENTE.nome}
                  </span>
                  <span className="shrink-0 rounded-full bg-surface-alt px-2 py-0.5 text-micro font-semibold text-text-tertiary">
                    Você
                  </span>
                  {/* Titular sempre administra (é o representante perante a
                      Receita). */}
                  <span className="shrink-0 rounded-full bg-state-success-tint px-2 py-0.5 text-micro font-semibold text-state-success-text">
                    Administra
                  </span>
                  <span
                    aria-hidden
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-state-success-tint text-state-success-text"
                  >
                    <CheckMiniDossie />
                  </span>
                </div>

                {extras.map((s, i) => {
                  /* 🔄 03/09 (pedido do Pedro, 8ª rodada) — TODOS OS CARDS
                     COLAPSAM, mesmo com 1 sócio extra só. Consistência de
                     layout vence a economia de 1 toque.
                     🧹 03/09 (pente-fino) — `colapsavel` virava sempre `true`
                     (não existe mais caso de card fixo aberto): variável e o
                     ramo morto do `? :` saíram. */
                  const aberto = socioAberto === s.id;
                  const salvo = socioCompleto(s);
                  const titulo = s.nome.trim() || `${i + 2}º sócio`;
                  return (
                  <div
                    key={s.id}
                    className={`relative flex flex-col rounded-md border border-border-hairline bg-surface-card p-3 ${
                      aberto ? "gap-3" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSocioAberto(aberto ? null : s.id)}
                      aria-expanded={aberto}
                      className="flex items-center gap-2 text-left"
                    >
                      <span className="min-w-0 flex-1 truncate text-caption font-semibold text-text-primary">
                        {titulo}
                      </span>
                      {/* 🔄 03/09 (pedido do Pedro, 5ª rodada) — pill e check
                          LADO A LADO, mesmo padrão do card da Ana. Os
                          dois só aparecem fechado: aberto, a resposta já
                          está logo ali, no próprio campo.
                          🐛 03/09 (pente-fino) — "salvo" (check verde) agora é
                          DERIVADO de `socioCompleto`, não de um clique
                          isolado: fechar o card de qualquer jeito (cabeçalho,
                          trocar de card) sempre reflete o dado real. Faltando
                          algo, mostra "Incompleto" em vez de check — pista de
                          ONDE falta preencher sem precisar abrir card por card. */}
                      {!aberto && admins.includes(s.id) && (
                        <span className="shrink-0 rounded-full bg-state-success-tint px-2 py-0.5 text-micro font-semibold text-state-success-text">
                          Administra
                        </span>
                      )}
                      {!aberto &&
                        (salvo ? (
                          <span
                            aria-hidden
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-state-success-tint text-state-success-text"
                          >
                            <CheckMiniDossie />
                          </span>
                        ) : (
                          <span className="shrink-0 rounded-full bg-state-warning-tint px-2 py-0.5 text-micro font-semibold text-state-warning-text">
                            Incompleto
                          </span>
                        ))}
                    </button>

                    {aberto && (
                      <>

                    <Campo rotulo="Nome completo">
                      <Texto
                        valor={s.nome}
                        onChange={(v) => atualizar(s.id, { nome: v })}
                        placeholder="Como está no documento do sócio"
                        erro={
                          s.nome.length > 0 && s.nome.trim().split(/\s+/).length < 2
                            ? "Escreva o nome completo."
                            : undefined
                        }
                      />
                    </Campo>

                    {/* 🆕 01/09 — CPF é o que identifica o sócio no QSA do DBE
                        e no Integrador. Vem logo depois do nome porque são o
                        par que forma a identidade da pessoa. */}
                    <Campo rotulo="CPF do sócio">
                      <Texto
                        valor={s.cpf}
                        onChange={(v) => atualizar(s.id, { cpf: mascaraCpf(v) })}
                        placeholder="000.000.000-00"
                        inputMode="numeric"
                        erro={
                          s.cpf.replace(/\D/g, "").length > 0 &&
                          s.cpf.replace(/\D/g, "").length < 11
                            ? "CPF incompleto."
                            : undefined
                        }
                      />
                    </Campo>

                    {/* 🗑️ 03/09 (pedido do Pedro) — A PARTICIPAÇÃO SAIU DO CARD.
                        Ela vivia em 3 lugares (aqui, no card do titular e no
                        resumo da divisão), e com os cards colapsados dava pra
                        editar só abrindo um card — enquanto o único lugar que
                        mostrava a divisão inteira era o que não deixava mexer.
                        Agora o card responde "quem é essa pessoa" e a mesa da
                        divisão responde "quanto cada um tem". */}

                    {/* 🆕 31/08 — mesma qualificação exigida do titular (C1):
                        a JUCEMG/DBE não distingue "quem cadastrou" de "quem é
                        sócio". Profissão fica de fora, preenchida internamente
                        como "Empresário" pra todo mundo. */}
                    <div className="grid grid-cols-2 gap-3">
                      <Campo rotulo="Data de nascimento">
                        <Texto
                          valor={s.nascimento}
                          onChange={(v) => atualizar(s.id, { nascimento: mascaraData(v) })}
                          placeholder="DD/MM/AAAA"
                          inputMode="numeric"
                          maxLength={10}
                        />
                      </Campo>
                      <Campo rotulo="Nacionalidade">
                        <Texto
                          valor={s.nacionalidade}
                          onChange={(v) => atualizar(s.id, { nacionalidade: v })}
                          placeholder="Brasileira"
                        />
                      </Campo>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Campo rotulo="RG">
                        <Texto
                          valor={s.rg}
                          onChange={(v) => atualizar(s.id, { rg: v })}
                          placeholder="00.000.000"
                        />
                      </Campo>
                      <Campo rotulo="Órgão emissor">
                        <Texto
                          valor={s.orgao}
                          onChange={(v) => atualizar(s.id, { orgao: v })}
                          placeholder="SSP/MG"
                        />
                      </Campo>
                    </div>

                    <Campo rotulo="Estado civil">
                      <Select
                        valor={s.civil}
                        onChange={(v) => atualizar(s.id, { civil: v })}
                        opcoes={ESTADO_CIVIL}
                      />
                    </Campo>

                    {s.civil === "casado" && (
                      <Campo rotulo="Regime de bens">
                        <Select
                          valor={s.regime}
                          onChange={(v) => atualizar(s.id, { regime: v })}
                          opcoes={REGIME_BENS}
                          placeholder="Como está na certidão de casamento"
                        />
                      </Campo>
                    )}

                    {/* 🆕 01/09 — endereço do sócio. Entra na qualificação do
                        contrato social (art. 997 CC) e tem ficha própria no
                        DBE. Mesmo autofill por CEP do C4/E6; complemento
                        opcional, igual ao resto do app. */}
                    <Campo rotulo="CEP do sócio" dica="A gente puxa o resto do endereço.">
                      <Texto
                        valor={s.cep}
                        onChange={(v) => atualizar(s.id, { cep: mascaraCep(v) })}
                        placeholder="00000-000"
                        inputMode="numeric"
                      />
                    </Campo>

                    {buscarCep(s.cep.replace(/\D/g, "")) && (
                      <>
                        {/* Mesma linha de confirmação da C1 (02/09): o
                            endereço encontrado não é campo, é recibo. Tinha o
                            travessão proibido junto. */}
                        {/* Mesmo `CardNota` da C1 (02/09). */}
                        {/* &#x1F41B; 03/09 — tinha `-mt-3`, copiado da C1. Lá o container
                            do Corpo tem gap-6 e a margem negativa deixa 12px;
                            aqui dentro do card do sócio o gap é 3 (12px), então
                            ela zerava o espaço e colava o cartão no campo do
                            CEP. Sem margem, o gap do container já resolve. */}
                        <div>
                          <CardNota>
                            {(() => {
                              const e = buscarCep(s.cep.replace(/\D/g, ""))!;
                              return `${e.logradouro}, ${e.bairro}, ${e.municipio}/${e.uf}`;
                            })()}
                          </CardNota>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Campo rotulo="Número">
                            <Texto
                              valor={s.numero}
                              onChange={(v) => atualizar(s.id, { numero: v })}
                              placeholder="Nº"
                              inputMode="numeric"
                            />
                          </Campo>
                          <Campo rotulo="Complemento">
                            <Texto
                              valor={s.complemento}
                              onChange={(v) => atualizar(s.id, { complemento: v })}
                              placeholder="Bloco, apto..."
                            />
                          </Campo>
                        </div>
                      </>
                    )}

                    {/* 🆕 03/09 (pedido do Pedro) — ADMINISTRAÇÃO VIRA CAMPO DO
                        SÓCIO. Ela é uma característica DELE, igual ao CPF, e
                        estava numa lista de checks longe daqui. Como última
                        pergunta do card, ela fecha a qualificação da pessoa.
                        ⚠️ Só pros sócios extras: quem abre a empresa é sempre
                        administrador (representante na Receita, reunião 42), e
                        perguntar sugeriria que dá pra escolher.
                        ⚠️ Sem explicar o que é administrar AQUI: a explicação
                        mora uma vez só, no resumo lá embaixo — repetida em 3
                        cards viraria aula. */}
                    <Campo rotulo="Esse sócio vai administrar a empresa?">
                      <OpcoesLinha
                        opcoes={[
                          { v: false, label: "Não" },
                          { v: true, label: "Sim" },
                        ]}
                        valor={admins.includes(s.id)}
                        onChange={(v) => {
                          setAdmins((atual) =>
                            v ? [...atual, s.id] : atual.filter((id) => id !== s.id),
                          );
                          setAdministracao("lista");
                        }}
                      />
                    </Campo>

                    {/* 🐛 03/09 (pente-fino) — o botão só FECHAVA o card
                        (`setSocioAberto(null)`); check nunca dependia dele.
                        Continua fechando; o check/"Incompleto" já reflete o
                        dado real assim que fecha, salvo ou não. */}
                    <Button
                      full
                      variant="secondary"
                      onClick={() => setSocioAberto(null)}
                    >
                      Salvar informações
                    </Button>
                      </>
                    )}
                  </div>
                  );
                })}
              </div>

              <div className="rounded-md border border-border-hairline bg-surface-alt p-3">
                <p className="text-caption font-semibold text-text-primary mb-1.5">
                  Como fica a divisão da empresa
                </p>
                {/* 🔄 03/09 (pedido do Pedro) — A MESA DA DIVISÃO passou a ser
                    o ÚNICO lugar onde a % se edita, de todo mundo. Antes era
                    leitura, e o valor se mexia dentro de cada card — com os
                    cards colapsados, isso virava abrir/fechar pra ajustar um
                    número que só faz sentido comparado com os outros.
                    Aqui a pessoa vê o todo e mexe no todo. */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate text-caption text-text-primary">
                      {CLIENTE.nome} <span className="text-text-tertiary">(você)</span>
                    </span>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <input
                        type="number"
                        inputMode="numeric"
                        step={1}
                        min={1}
                        max={99}
                        /* 🐛 03/09 (pente-fino) — `parte1` é 100 - soma dos
                           extras SEM clamp: se os extras somarem mais de 100
                           (dá pra fazer, cada um vai até 99), esse campo
                           mostrava número NEGATIVO. Clamp só de exibição — a
                           matemática de redistribuição continua a mesma. */
                        value={(parte1 > 0 ? parte1 : 0) || ""}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (raw === "") return;
                          const n = Number(raw);
                          if (Number.isNaN(n)) return;
                          const preso = Math.min(99, Math.max(1, n));
                          onChangeParte1(Math.round(preso));
                        }}
                        aria-label="Sua participação, em porcentagem"
                        className={`w-16 min-h-10 rounded-md border bg-surface-card px-2
                                   text-body text-text-primary focus:border-border-focus focus:outline-none ${
                                     somaOk ? "border-border-hairline" : "border-state-warning-text"
                                   }`}
                      />
                      <span className="text-caption font-semibold text-text-secondary">%</span>
                    </div>
                  </div>

                  {extras.map((s, i) => (
                    <div key={s.id} className="flex items-center justify-between gap-3">
                      <span className="min-w-0 truncate text-caption text-text-primary">
                        {s.nome.trim() || `${i + 2}º sócio`}
                      </span>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <input
                          type="number"
                          inputMode="numeric"
                          step={1}
                          min={1}
                          max={99}
                          value={s.participacao || ""}
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (raw === "") {
                              atualizar(s.id, { participacao: 0 });
                              return;
                            }
                            const n = Number(raw);
                            if (Number.isNaN(n)) return;
                            const preso = Math.min(99, Math.max(0, n));
                            atualizar(s.id, { participacao: Math.round(preso) });
                          }}
                          aria-label={`Participação do ${i + 2}º sócio, em porcentagem`}
                          className="w-16 min-h-10 rounded-md border border-border-hairline bg-surface-card px-2
                                     text-body text-text-primary focus:border-border-focus focus:outline-none"
                        />
                        <span className="text-caption font-semibold text-text-secondary">%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 🆕 03/09 (pedido do Pedro) — TOTAL fixo como referência: a
                    sua % é DERIVADA (100 - soma dos extras), então a soma
                    sempre fecha 100% por construção — mostrar isso deixa
                    explícito o porquê de mexer num campo mudar o outro.
                    🐛 03/09 (pente-fino) — mas era SEMPRE verde, mesmo com o
                    aviso de erro logo abaixo dizendo que a divisão tá errada
                    (extras=0% ou titular caindo a 0/negativo): mostrava
                    sucesso e alerta ao mesmo tempo, na mesma tela. A cor
                    agora segue `somaOk` — o número continua 100% (é
                    identidade matemática), mas só fica verde quando a
                    divisão É válida de verdade. */}
                <div className="mt-1 flex items-center justify-between gap-3 border-t border-border-hairline pt-2">
                  <span className="text-caption font-semibold text-text-primary">Total</span>
                  <span
                    className={`text-caption font-semibold ${
                      somaOk ? "text-state-success-text" : "text-state-warning-text"
                    }`}
                  >
                    {parte1 + somaExtras}%
                  </span>
                </div>

                {!somaOk && (
                  <p className="text-micro text-state-warning-text mt-1.5">
                    {somaExtras === 0
                      ? "Preencha a participação de cada sócio."
                      : "A soma dos sócios extras precisa ficar abaixo de 100% — você, como titular, não pode ficar com 0%."}
                  </p>
                )}
              </div>

              {/* ═══════════ 🆕 01/09 · QUEM ADMINISTRA A EMPRESA ═════════════
                  Reunião Rua Satélite 42 (simulação de DBE + contrato real com
                  2 sócios, feita ao vivo). Toda a discussão de administração,
                  assinatura isolada × conjunta e cláusula 8ª desaguou em UM
                  campo só, e é este.

                  ─── AS 3 REGRAS QUE ESTE CAMPO CARREGA ────────────────────
                  1. Quem começa o cadastro JÁ É o administrador, sempre. É ele
                     que vai como representante perante a Receita no DBE, e daí
                     o sistema puxa a qualificação sozinho. Por isso o titular
                     aparece travado, sem opção de tirar: se quem administra é
                     outra pessoa, é essa outra pessoa que abre o app.
                  2. A pergunta é binária: só o titular, ou o titular + o(s)
                     sócio(s) marcado(s). Quem NÃO for marcado entra no DBE como
                     sócio (código 22) e não aparece na cláusula de
                     administração; quem for marcado entra como
                     sócio-administrador (código 49).
                  3. 🔴 NÃO existe pergunta de "assinatura isolada × conjunta", e
                     isso é decisão, não esquecimento: o contrato PADRÃO da Junta
                     não tem campo pra isso, e inserir cláusula própria tira o
                     processo do padrão → cai em ANÁLISE HUMANA (mesma família do
                     achado da procuração em 31/08, que derruba o Registro
                     Automático). Os 2 caminhos daqui passam automático.

                  ⚠️ Só no caminho ABRIR: na migração a empresa já existe e a
                  administração já está definida no contrato dela — perguntar
                  ali sugeriria que a resposta muda alguma coisa. */}
              {contexto === "abrir" && (
                <Card
                  onClick={() => setInfoAdmin(true)}
                >
                  {/* 🔄 03/09 (pedido do Pedro, 3ª rodada) — DE BLOCO CORRIDO A
                      RECIBO + "i". Era um card com definição (3 linhas) +
                      resultado + consequência (mais 3-4 linhas): informação
                      correta, mas em volume que "dá preguiça de ler" — as
                      palavras do Pedro. O recibo (quem administra) fica
                      sempre visível, que é o que muda de pessoa pra pessoa; a
                      explicação do que isso SIGNIFICA (pros dois papéis, não
                      só um) vai pro sheet, sob demanda.
                      🔄 03/09 (6ª rodada, pedido do Pedro) — CARD INTEIRO
                      clicável (faz sentido: card já existe pra abrir o sheet,
                      não só o "i"), `Card` ganhou `onClick` opcional pra isso. */}
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-body font-semibold text-text-primary">
                      Quem administra a empresa
                    </p>
                    <span
                      aria-hidden
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-hairline text-micro font-bold text-text-tertiary"
                    >
                      i
                    </span>
                  </div>
                  <p className="text-caption text-text-primary mt-1">
                    {admins.length === 0
                      ? "Só você administra."
                      : `Você e ${listar(
                          extras
                            .filter((s) => admins.includes(s.id))
                            .map((s, i) => primeiroNome(s.nome) || `${i + 2}º sócio`),
                        )}.`}
                  </p>
                </Card>
              )}
            </>
          ) : (
            <Aviso variante="info" titulo="Empresa só sua">
              {contexto === "migrar"
                ? "Sem sócios, é só seguir — a gente já tem o que precisa."
                : "Sem sócios, a gente abre no formato certo pra dono único. Você confirma o tipo na próxima etapa."}
            </Aviso>
          )}
        </Corpo>

        {/* 🐛 03/09 — o sheet vivia DENTRO do `Corpo` (o container
            `overflow-y-auto` com fade de rolagem), então herdava o clip/scroll
            dele e aparecia cortado/deslocado. Mesma doutrina do `SheetCnae` e
            `SheetSecundarias`: sheet é irmão do `Corpo`, nunca filho. */}
        {infoAdmin && <SheetAdministracao onFechar={() => setInfoAdmin(false)} />}

        {infoSocios && (
          <SheetInfo
            titulo="Como funciona ter sócio"
            onFechar={() => setInfoSocios(false)}
            pontos={[
              "A porcentagem diz quanto cada um tem da empresa, e é por ela que o lucro se divide quando vocês tirarem dinheiro dela.",
              "Ela não muda o imposto da empresa: o Simples é calculado sobre o faturamento, não sobre quem tem quanto.",
              "Não precisa ser meio a meio. A divisão é escolha de vocês, só precisa fechar 100%.",
              "Dá pra mudar depois, mas envolve alterar o contrato social na Junta (com custo e prazo). Vale acertar agora.",
              "Você precisa dos dados do sócio em mãos: documento com RG e órgão emissor, CPF, data de nascimento, estado civil e endereço.",
            ]}
            exemplo={{
              titulo: "Divisão em 3 sócios",
              nota: "Não precisa dar número redondo: 34% / 33% / 33% fecha 100% e é o mais comum quando ninguém quer ficar por cima.",
            }}
          />
        )}

        <Rodape>
          {/* 🆕 03/09 (pente-fino) — só aparece quando o motivo do CTA
              travado é dado faltando num sócio específico (não cobre soma
              inválida — essa já tem aviso próprio na mesa da divisão, logo
              acima, pra não duplicar mensagem). */}
          {TEM_SOCIO && sociosIncompletos.length > 0 && (
            <p className="text-micro text-state-warning-text mb-2 text-center">
              Falta preencher os dados de {listar(sociosIncompletos)}.
            </p>
          )}
          <Button full disabled={!completo} onClick={onSeguir}>
            {ctaLabel ?? "Continuar"}
          </Button>
        </Rodape>
      </main>
    </>
  );
}

/* ═══════════════════ N13 · DADOS DA EMPRESA ═════════════════════════════ */

/**
 * 🔒 31/08 (validado pelo Pedro contra a transcrição real, RS38 linha 14/20:
 * "Endereço próprio, casa ou ponto, coworking, endereço virtual") — "Endereço
 * virtual" SAI daqui. Confirmado na gravação: "virtual" é o valor que a
 * própria JUCEMG usa quando a empresa está no endereço FISCAL da Legalizai
 * (não é escolha de quem usa endereço próprio) — por isso virou fixo/interno
 * (ver PREENCHIDOS_INTERNAMENTE), nunca opção pro usuário aqui. O parêntese
 * "(casa ou ponto)" bate com a fala real da especialista — não é "casa ou
 * apartamento" (isso é outro campo, ver TIPO_IMOVEL abaixo).
 */
// 🗑️ 01/09 — `TIPO_ENDERECO` saiu junto da pergunta "Como é esse endereço?":
// o E3.4 já resolve isso (endereço dele × o nosso) e o tipo de imóvel
// (casa/apartamento/outro) responde o resto. Sem consumidor, a lista sai.

/**
 * 🆕 31/08 (achado da reunião Rua Satélite 38-40 + prints reais da JUCEMG) —
 * campo que NUNCA existiu no produto: quando o endereço é PRÓPRIO da pessoa,
 * a Prefeitura de BH pergunta se é apartamento, e se for, EXIGE que o sócio
 * resida no local (senão a viabilidade é indeferida — visto ao vivo na
 * gravação). "Tipo de endereço" (acima) é outro eixo (próprio × coworking) —
 * não resolve essa pergunta, que é sobre o IMÓVEL em si.
 */
/* 🔄 03/09 — `TIPO_IMOVEL` foi pra `lib/qualificacao.ts` pelo mesmo motivo dos
   outros dois: o recap do A1 mostra o tipo de imóvel que a pessoa respondeu. */

function mascaraCep(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.replace(/(\d{5})(\d)/, "$1-$2");
}

/**
 * 🆕 03/09 (pedido do Pedro) — máscara do índice cadastral do IPTU: grupos de
 * 3 dígitos separados por ponto, igual ao carnê da PBH.
 * 🔄 03/09 (pedido do Pedro) — teto subiu de 12 pra 15 dígitos: existe carnê
 * com índice mais longo que o placeholder sugeria. A validação continua com
 * piso de 10 (o formato EXATO segue na fila-Larissa).
 */
function mascaraIptu(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 15);
  return d.replace(/(\d{3})(?=\d)/g, "$1.");
}

interface EnderecoCep {
  logradouro: string;
  bairro: string;
  municipio: string;
  uf: string;
}

// 🚧 Mock do autofill por CEP. No app real: API de CEP (ViaCEP ou similar).
function buscarCep(cepDigitos: string): EnderecoCep | null {
  if (cepDigitos.length !== 8) return null;
  return {
    logradouro: "Rua dos Timbiras",
    bairro: "Funcionários",
    municipio: "Belo Horizonte",
    uf: "MG",
  };
}

/**
 * 🆕 03/09 — o "conteúdo colado no rodapé" da C2/C4 em forma de componente,
 * pra poder alternar com o `Corpo` (rolável) por regime sem duplicar a tela.
 * Bloco FIXO: quem estica é a ilustração acima, não ele.
 */
/**
 * 🆕 03/09 (pedido do Pedro) — variante do bloco colado no rodapé pra telas
 * com MAIS conteúdo (a 2ª rodada do C7): rola por dentro em vez de empurrar o
 * CTA. O `BlocoColadoNoRodape` puro continua pras telas curtas (C2, C4).
 */
function BlocoColadoRolavel({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-col gap-6 overflow-y-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {children}
    </div>
  );
}

function BlocoColadoNoRodape({ children }: { children: ReactNode }) {
  return <div className="flex shrink-0 flex-col gap-6 pb-4">{children}</div>;
}

export function EmpresaView({
  preencher,
  onSeguir,
  onVoltar,
  mei = false,
  enderecoProprio,
  inicial,
  ctaLabel,
  metaVoltar,
}: {
  preencher?: number;
  onSeguir?: () => void;
  onVoltar?: () => void;
  /**
   * 🆕 03/08 — MEI não tem capital social formal (não é sociedade).
   * 🔄 03/09 (pente-fino) — a doc dizia que "endereço, IPTU e tipo de imóvel
   * são iguais pros dois", e não são: **IPTU e tipo de imóvel/residência não
   * existem no MEI** (guardas `!mei`), e no lugar deles entra "Como você
   * atende?" (forma de atuação). O MEI também é o único que chega aqui com
   * endereço fiscal nosso (`enderecoProprio={false}`), e aí a tela fica só
   * com essa pergunta.
   */
  mei?: boolean;
  /**
   * 🆕 26/08 (reunião Rua Satélite 36, item 2) — a escolha "próprio × fiscal
   * Legalizai" saiu daqui e subiu pro `/gate` (`FaixaView`), antes até do
   * cadastro. Quando vem preenchido (`true`/`false`), esta tela NÃO pergunta
   * de novo — mesma doutrina do C3 (sócios, `SociosView`): mostra confirmação
   * read-only em vez do picker. `undefined` = ninguém decidiu ainda (fallback
   * pro comportamento antigo — usado quando esta view é chamada sem o carry
   * forward, ex.: alguma tela solta da demo).
   */
  enderecoProprio?: boolean;
  /**
   * 🆕 01/09 (pedido do Pedro) — o endereço que a pessoa já respondeu no gate
   * (E3.4, `/endereco`) chega aqui PREENCHIDO: ela completa o que falta (IPTU,
   * tipo de imóvel, residência) em vez de redigitar CEP e número. Mesma
   * doutrina que tirou o CPF duplicado do E9 e virou o C1 em confirmação: não
   * reperguntar o que já foi respondido.
   *
   * Vem do `sessionStorage` (ver `lib/rascunho.ts`), não da URL — é dado
   * pessoal. Ausente (deep-link, `/mockup`, aba nova) = campos vazios, tela
   * funciona igual.
   */
  inicial?: {
    cep: string;
    numero: string;
    complemento: string;
    tipoImovel: string;
    resideNoEndereco: boolean | null;
  };
  /**
   * 🆕 01/09 (pedido do Pedro) — rótulo do CTA. Existe pro MODO AJUSTE: quem
   * volta pra corrigir um bloco vê "Atualizar dados" na última tela dele, em
   * vez de "Continuar" (que sugeriria refazer o wizard inteiro).
   * Ausente = "Continuar", o comportamento de sempre.
   */
  ctaLabel?: string;
  /**
   * 🐛 03/09 (pente-fino) — nome da tela pra onde o VOLTAR leva (regra 6 do
   * CLAUDE.md). Era fixo "Sócios", mas o destino real varia: MEI vem da C1
   * (pula C2/C3) e ME "só eu" vem da C2 (o passo Sócios é filtrado por
   * `passosDoCliente`). Quem manda o `onVoltar` manda o rótulo junto, pros
   * dois não divergirem.
   */
  metaVoltar?: string;
}) {
  /**
   * 🔄 01/09 (decisão do Pedro) — não existe mais escolha de endereço AQUI.
   * Quem escolheu o endereço fiscal da Legalizai nem chega nesta tela (o
   * `dossie/empresa/page.tsx` redireciona); quem chega tem endereço próprio,
   * ponto. Sem prop (deep-link, `/mockup`, apresentação), assume próprio —
   * que é o único caso que esta tela atende.
   */
  const usarProprio = enderecoProprio ?? true;
  /**
   * 🔄 01/09 (pedido do Pedro) — sem `inicial` (deep-link, `/mockup`, prévia
   * do `/mapa`), a tela cai no MOCK em vez de mostrar formulário vazio. Não é
   * conveniência de demo: quem chega nesta tela SEMPRE veio do E3.4 no flow
   * real, então o formulário vazio era um estado que não existe — e era ele
   * que aparecia no board, dando a impressão de que a C4 repergunta o
   * endereço.
   */
  const doGate = inicial ?? {
    cep: PREENCHIMENTO.empresa.cep,
    numero: PREENCHIMENTO.empresa.numero,
    complemento: PREENCHIMENTO.empresa.complemento,
    tipoImovel: PREENCHIMENTO.empresa.tipoImovel,
    resideNoEndereco: true as boolean | null,
  };
  const [cep, setCep] = useState(doGate.cep);
  const [numero, setNumero] = useState(doGate.numero);
  const [complemento, setComplemento] = useState(doGate.complemento);
  const [iptu, setIptu] = useState("");
  /* 🧹 03/09 (pente-fino) — saíram daqui:
     · `tipo = "proprio"` (constante) e o `tipo === "proprio"` do
       `precisaResidencia`, que era sempre verdadeiro;
     · `capital`/`capitalNum`, travados em R$10.000 desde 31/08 e preenchidos
       no backend — `capitalNum > 0` era um gate que nunca reprovava, sobra do
       tempo em que capital social era campo desta tela. */
  // 🆕 31/08 — tipo de imóvel (casa/apartamento/outro), só quando o endereço é
  // PRÓPRIO. Dirige a regra de residência logo abaixo.
  // 🔄 01/09 — nasce do que foi respondido no E3.4 (a pergunta subiu pra lá,
  // pré-pagamento); aqui vira confirmação.
  const [tipoImovel, setTipoImovel] = useState(doGate.tipoImovel);
  // 🆕 28/08 — só o MEI usa (ver o bloco "Como você atende?" mais abaixo).
  const [atuacao, setAtuacao] = useState<string[]>([]);
  // 🆕 03/09 (pedido do Pedro) — sheet do "i" do cabeçalho.
  const [infoEndereco, setInfoEndereco] = useState(false);
  /* 🆕 03/09 (pedido do Pedro) — 2º "i", este NO CAMPO do índice cadastral.
     O do cabeçalho responde "por que essa tela pede isso"; este responde
     "como eu acho esse número", que é dúvida do campo e precisa de espaço
     próprio (link da PBH e, em breve, a ilustração da folha do IPTU). */
  const [infoIptu, setInfoIptu] = useState(false);
  /**
   * 🔒 31/08 (validado pelo Pedro contra a reunião real) — a pergunta de
   * residência é SEMPRE sobre o TITULAR (quem está constituindo), nunca sobre
   * sócio extra. A gravação real mostrou o campo "endereço do sócio
   * responsável" auto-preenchendo do Representante — não existe pergunta
   * separada por sócio extra nesse ponto do fluxo.
   */
  const [resideNoEndereco, setResideNoEndereco] = useState<boolean | null>(
    doGate.resideNoEndereco,
  );
  /**
   * 🆕 01/09 — a resposta sobre o imóvel veio do gate (E3.4)? Então esta tela
   * CONFIRMA em vez de perguntar. Sem isso a pessoa responderia a mesma coisa
   * duas vezes, com a segunda vez chegando depois de já ter pago.
   * 🗑️ E o bloco "Onde você mora" saiu daqui: endereço pessoal virou pergunta
   * fixa do C1, pra todo mundo.
   */
  const respostaImovelVeioDoGate =
    doGate.tipoImovel !== "" && doGate.resideNoEndereco !== null;

  /**
   * 🆕 01/09 — o endereço em si (CEP + número) veio do E3.4? Então ele aparece
   * TRAVADO aqui: a pessoa já digitou, e redigitar convida divergência entre o
   * que foi para a viabilidade e o que vai para o DBE.
   */
  const enderecoVeioDoGate =
    doGate.cep.replace(/\D/g, "").length === 8 && doGate.numero !== "";

  // A tela mais pesada da constituição — e por isso a que mais precisa do
  // automático numa apresentação. Preenche o caminho "endereço próprio", que é
  // o que exercita IPTU, tipo de imóvel e residência.
  usePreencher(preencher, () => {
    const p = PREENCHIMENTO.empresa;
    // 🔄 01/09 — `setUsarProprio` saiu: não há mais escolha de endereço nesta
    // tela (quem usa o fiscal não chega aqui).
    setCep(p.cep);
    setNumero(p.numero);
    setComplemento(p.complemento);
    setIptu(p.iptu);
    setTipoImovel(p.tipoImovel);
    setResideNoEndereco(true);
  });

  /* ⚠️ `querFiscal` NÃO é código morto: o MEI é o único que chega nesta tela
     com o endereço fiscal da Legalizai (o ME nesse caso é redirecionado em
     `dossie/empresa/page.tsx`), e aí a tela fica só com "Como você atende?". */
  const querFiscal = usarProprio === false;
  const cepDigitos = cep.replace(/\D/g, "");
  const cepCheio = cepDigitos.length === 8;
  const endereco = buscarCep(cepDigitos);
  // 🔒 31/08 — apartamento OBRIGA o titular a residir no local (senão a
  // Prefeitura de BH indefere a viabilidade — visto ao vivo na gravação real).
  const ehApartamento = tipoImovel === "apartamento";
  /**
   * 🐛 03/09 (pente-fino) — o fallback editável ainda FORÇAVA "Sim" quando o
   * imóvel era apartamento ("residência implícita"), com um aviso dizendo que
   * não dava pra continuar com "não". É exatamente o beco sem saída que a
   * decisão de 01/09 desmontou ao subir a pergunta pro E3.4: quem tem
   * apartamento onde NÃO mora precisava declarar algo falso. Agora a resposta
   * é dela, e "não moro" bloqueia o avanço mostrando a saída real (o endereço
   * fiscal da Legalizai), igual o gate faz antes do pagamento.
   */
  const apartamentoSemResidencia = ehApartamento && resideNoEndereco === false;

  /**
   * 🆕 04/08 — cruzamento com pesquisa Gemini: o campo só checava "não vazio",
   * deixava passar 1 dígito solto. O índice cadastral do IPTU varia 10-12
   * dígitos dependendo do carnê (nosso mock usa 12 em `dossie/mock.ts`, o
   * Gemini cravou 11 sem citar fonte) — sem confirmação de qual é o formato
   * EXATO de BH, valida um piso (10 dígitos) em vez de travar num número que
   * pode estar errado. 🟡 fila-Larissa: formato exato do índice.
   */
  const iptuDigitos = iptu.replace(/\D/g, "");
  /* 🔄 03/09 (pedido do Pedro) — o aviso só aparece a partir do 6º dígito:
     antes pulava na tela já no 1º número digitado, cobrando o índice inteiro
     de quem tinha acabado de começar a digitar. */
  const iptuCurto = iptuDigitos.length >= 6 && iptuDigitos.length < 10;
  const iptuOk = iptuDigitos.length >= 10;

  // 🐛→🔒 31/08 — CORRIGIDO: antes só perguntava residência com SOCIOS > 1
  // (`grep` confirmou zero pergunta pro caso mais comum — dono único). A
  // regra da Prefeitura vale igual, é sempre sobre o titular.
  const precisaResidencia = !mei;

  const tipoImovelOk = !precisaResidencia || tipoImovel !== "";

  /**
   * 🔄 01/09 (pedido do Pedro) — o endereço PESSOAL saiu daqui: ele agora é
   * perguntado no C1 pra todo mundo, sempre, com rótulo próprio ("Onde você
   * mora"). Antes só era pedido no ramo "não moro no endereço da empresa", o
   * que deixava o DBE sem a ficha do Representante em todos os outros casos.
   */
  const enderecoOk =
    querFiscal ||
    (usarProprio === true &&
      cepCheio &&
      numero.trim() !== "" &&
      // 🆕 28/08 — IPTU não é campo do formulário do MEI (ver o comentário no
      // render). Exigir aqui travava o Continuar por um documento que ele não
      // precisa ter.
      (mei || iptuOk) &&
      tipoImovelOk &&
      (!precisaResidencia || resideNoEndereco !== null) &&
      // 🐛 03/09 (pente-fino) — apartamento onde a pessoa não mora trava aqui
      // em vez de virar um "Sim" forçado (a Prefeitura de BH indefere).
      !apartamentoSemResidencia);

  /**
   * 🧹 03/09 (pente-fino) — o `usarProprio !== null` saiu (o valor é
   * `enderecoProprio ?? true`, nunca nulo) e o gate de capital social também
   * (travado em R$10.000 no backend desde 31/08, nunca reprovava). Sobra a
   * regra real: endereço resolvido e, no MEI, a forma de atuação — que o
   * formulário oficial do Portal não deixa passar em branco.
   */
  const completo = enderecoOk && (!mei || atuacao.length > 0);

  /**
   * 🐛 03/09 (pente-fino) — O LAYOUT NOVO (conteúdo colado no rodapé, sem
   * `Corpo`) VALE SÓ PRO ME. No ME sobra pouco conteúdo (1 card + o IPTU),
   * mas o MEI troca isso por "Como você atende?", que são 7 botões (~380px):
   * sem container rolável, a ilustração encolhe até zero e o resto é CLIPADO,
   * fora de alcance. O MEI segue no `Corpo` de sempre (rola).
   */
  const Bloco = mei ? Corpo : BlocoColadoNoRodape;

  return (
    <>
      {/* 🐛 03/09 (pente-fino) — `meta` nomeia o DESTINO do voltar, e ele
          varia: MEI vem da C1, ME "só eu" vem da C2, ME com sócio vem da C3.
          Quem navega (a page) manda o rótulo junto.
          🆕 03/09 (pedido do Pedro) — "i" na ponta direita do cabeçalho, na
          altura do voltar: abre a explicação do que está sendo pedido e por
          que o endereço aparece travado. É a dúvida que a tela levanta e não
          respondia em lugar nenhum. */}
      <TelaHeader
        meta={metaVoltar ?? "Sócios"}
        onVoltar={onVoltar}
        acao={
          <button
            type="button"
            onClick={() => setInfoEndereco(true)}
            aria-label="Por que a gente pede esses dados"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-hairline text-micro font-bold text-text-tertiary"
          >
            i
          </button>
        }
      />

      <main className="app-main">
        {/* 🔄 03/09 (pedido do Pedro) — MESMO MODELO DA C2 (`VinculoView`):
            conteúdo COLADO NO RODAPÉ, vazio em cima ocupado pela ilustração —
            não é `Corpo` (flex-1 rolável) porque quem ocupa a sobra é este
            espaço, não o conteúdo.
            🔄 03/09 (pedido do Pedro) — ícone do prédio: pro ME, arquivo NOVO
            exportado (`c4-endereco-me.png`, 400×367 — o `regime-me-coral.png`
            do gate só tem 140×129 nativo, esticado pra este espaço saía
            borrado). MEI segue no ícone antigo (sem export novo, fora do
            escopo desta rodada). Guardado por regime igual o título.
            🔄 03/09 (pedido do Pedro) — flutuação sutil, mesmo tratamento
            do C2/retomar (sombra de contato em 2 camadas + drop-shadow).
            🐛 03/09 (pente-fino) — só no ME: no MEI o conteúdo é grande e o
            `Corpo` volta a ser quem ocupa a sobra. */}
        {!mei && (
        <div className="flex min-h-0 flex-1 items-center justify-center py-4">
          <div id="c4-endereco-flutua" className="relative flex h-[79%] max-h-[302px] items-end">
            <div
              aria-hidden
              className="absolute -bottom-2 left-1/2 h-5 w-[72%] -translate-x-1/2 blur-md"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(27,30,36,.30), rgba(27,30,36,.10) 62%, transparent 100%)",
              }}
            />
            <Image
              src="/icones/c4-endereco-me.png"
              alt=""
              aria-hidden
              width={400}
              height={367}
              className="relative z-10 h-full w-auto"
              style={{ filter: "drop-shadow(6px 14px 12px rgba(27,30,36,.20))" }}
            />
          </div>

          {/* Mesma dosagem do C2/retomar: durações que não se dividem entre
              si (7s / 5,5s) pro loop não virar sobe-e-desce mecânico.
              ♿ desliga em `prefers-reduced-motion`. */}
          <style jsx global>{`
            @keyframes c4-endereco-flutua-obj {
              0%   { transform: translate3d(0, 0, 0) rotate(0deg); }
              35%  { transform: translate3d(4px, -7px, 0) rotate(0.6deg); }
              70%  { transform: translate3d(-3px, -3px, 0) rotate(-0.5deg); }
              100% { transform: translate3d(0, 0, 0) rotate(0deg); }
            }
            @keyframes c4-endereco-flutua-sombra {
              0%   { transform: translateX(-50%) scaleX(1); opacity: 1; }
              35%  { transform: translateX(-50%) scaleX(0.9); opacity: 0.72; }
              70%  { transform: translateX(-50%) scaleX(0.96); opacity: 0.88; }
              100% { transform: translateX(-50%) scaleX(1); opacity: 1; }
            }
            #c4-endereco-flutua img {
              animation: c4-endereco-flutua-obj 7s ease-in-out infinite;
              will-change: transform;
            }
            #c4-endereco-flutua > div[aria-hidden] {
              animation: c4-endereco-flutua-sombra 5.5s ease-in-out infinite;
              will-change: transform, opacity;
            }
            @media (prefers-reduced-motion: reduce) {
              #c4-endereco-flutua img,
              #c4-endereco-flutua > div[aria-hidden] {
                animation: none;
              }
            }
          `}</style>
        </div>
        )}

        {/* ✍️ 29/07 — o título era "Onde a empresa fica?", mas a tela também
            coletava capital social, que não é lugar nenhum.
            🐛→✍️ 01/09 (achado pelo E2E) — o SUBTÍTULO continuou prometendo
            capital social depois que o campo saiu (31/08, valor travado em
            R$10.000 no backend). Trocado pelo que a tela de fato faz: é o
            endereço que a Prefeitura analisa pra deferir ou indeferir. */}
        <Titulo sub="É esse endereço que a Prefeitura analisa pra liberar a empresa.">
          {/* 🔄 03/09 (pedido do Pedro) — subtítulo cortado pra 1 linha: o
              "vai no CNPJ" saiu (a dica do IPTU logo abaixo já explica o
              motivo prático, "obrigatório pra Junta" — não precisa das duas
              justificativas juntas aqui em cima).
              🔄 03/09 (pedido do Pedro) — "Endereço da empresa" só no ME: é
              tudo que esta tela pergunta ali. Guardado por regime porque o
              MEI ainda tem a pergunta extra "Como você atende?" (forma de
              atuação), que não é endereço — mudar o título pros dois vazaria
              essa diferença. */}
          {mei ? "Os dados da empresa" : "Endereço da empresa"}
        </Titulo>

        <Bloco>
          {/* 🗑️ 01/09 (decisão do Pedro) — O UPSELL DE ENDEREÇO FISCAL SAIU
              DAQUI, e com ele o card de "já decidido lá atrás".

              A regra ficou binária e sem zona cinzenta: ou a pessoa escolheu o
              endereço fiscal da Legalizai lá no E3.4 (e aí **esta tela não
              existe pra ela**, ver o redirect em `dossie/empresa/page.tsx`), ou
              ela informou um endereço próprio — e aqui a gente só TERMINA de
              coletar o que faltou. Oferecer o endereço fiscal neste ponto seria
              vender depois do pagamento uma coisa que muda a mensalidade, o
              oposto da doutrina de "honestidade antes do toque".

              O que veio do gate (CEP, número, complemento) aparece TRAVADO: é
              confirmação, não recoleta. O que falta continua editável. */}
          {/* 🔄 03/09 (pedido do Pedro) — DOIS CARDS CINZAS viraram UM. Endereço
              (este bloco) e "Sobre o imóvel" (mais abaixo) são as duas
              confirmações travadas desta tela — nada aqui é editável, então
              não precisavam de dois cartões separados. O IPTU continua fora:
              é o único campo que ainda se preenche aqui. */}
          {(enderecoVeioDoGate || (!mei && usarProprio === true && respostaImovelVeioDoGate)) && (
            <div className="rounded-md border border-border-hairline bg-surface-alt p-3">
              {enderecoVeioDoGate && (
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-micro text-text-tertiary">
                      Endereço da empresa, informado no começo
                    </p>
                    {endereco && (
                      <p className="text-caption font-semibold text-text-primary mt-0.5">
                        {endereco.logradouro}, {numero}
                        {complemento ? ` · ${complemento}` : ""}
                      </p>
                    )}
                    <p className="text-caption text-text-secondary">
                      {endereco ? `${endereco.bairro}, ` : ""}
                      {cep}
                    </p>
                  </div>
                </div>
              )}

              {!mei && usarProprio === true && respostaImovelVeioDoGate && (
                <div className={enderecoVeioDoGate ? "mt-3 border-t border-border-hairline pt-3" : ""}>
                  <p className="text-caption font-semibold text-text-primary">
                    Sobre o imóvel, você já respondeu
                  </p>
                  <p className="text-caption text-text-secondary mt-0.5">
                    {TIPO_IMOVEL.find((t) => t.v === tipoImovel)?.label} ·{" "}
                    {resideNoEndereco ? "você mora nele" : "você não mora nele"}
                  </p>
                </div>
              )}
            </div>
          )}
          {usarProprio === true && (
            <>
              {/* 🔄 01/09 — os campos de endereço só aparecem quando NÃO vieram
                  do gate. Vindo de lá, o card travado acima já mostra tudo. */}
              {!enderecoVeioDoGate && (
                <>
              <Campo
                rotulo="CEP da empresa"
                dica="A gente puxa o resto do endereço, você só completa."
              >
                <Texto
                  valor={cep}
                  onChange={(v) => setCep(mascaraCep(v))}
                  placeholder="00000-000"
                  inputMode="numeric"
                />
              </Campo>

              {endereco && (
                <>
                  <div className="-mt-3 rounded-md border border-border-hairline bg-surface-alt px-3 py-2.5 text-caption text-text-secondary">
                    {endereco.logradouro}, {endereco.bairro}, {endereco.municipio}/
                    {endereco.uf}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Campo rotulo="Número">
                      <Texto
                        valor={numero}
                        onChange={setNumero}
                        placeholder="Nº"
                        inputMode="numeric"
                      />
                    </Campo>
                    {/* ✍️ 29/07 — o "Opcional" saiu daqui (decisão do Pedro).
                        Era a única dica da tela e virava um subtítulo solto
                        entre os dois campos lado a lado. O placeholder já
                        entrega o mesmo: "Bloco, sala..." não cobra nada. */}
                    <Campo rotulo="Complemento">
                      <Texto
                        valor={complemento}
                        onChange={setComplemento}
                        placeholder="Bloco, sala..."
                      />
                    </Campo>
                  </div>
                </>
              )}
                </>
              )}

              {/* ⚠️ 28/07 (reunião Rua Satélite 9): OBRIGATÓRIO — sem ele a
                  documentação não passa na JUCEMG.
                  🆕 28/08 — some no MEI, e não é simplificação: o formulário do
                  Portal do Empreendedor **não pede índice cadastral do IPTU**
                  (ver a lista campo a campo em `abertura-mei-processo.md`), e a
                  justificativa que o campo dá ("não passa na Junta") não vale
                  pra ele, que nem vai à Junta. Era um bloqueio real pedindo um
                  documento que ele não precisa ter em mãos. */}
              {!mei && (
              <Campo
                rotulo="Índice cadastral do IPTU"
                acao={<BotaoInfo onClick={() => setInfoIptu(true)} rotulo="Como achar o índice cadastral" />}
                /* 🐛 03/09 (pente-fino) — "Pode conter até 15 dígitos" entrava
                   pelo `erro` do `Texto`: borda vermelha e cor de perigo pra
                   uma ORIENTAÇÃO ("o número é mais longo do que você imagina"),
                   não pra um erro. Virou dica, que é neutra — e só troca a
                   frase base a partir do 6º dígito, quando ela passa a ser o
                   que a pessoa precisa ler. */
                dica={
                  iptuCurto
                    ? "Pode conter até 15 dígitos."
                    : "Está no carnê do IPTU e é obrigatório pra Junta."
                }
              >
                <Texto
                  valor={iptu}
                  onChange={(v) => setIptu(mascaraIptu(v))}
                  placeholder="000.000.000.000"
                  inputMode="numeric"
                />
              </Campo>
              )}

              {/* 🗑️ 01/09 (pedido do Pedro) — "Como é esse endereço?" SAIU. Era
                  a última pergunta desta tela que o E3.4 já tinha respondido:
                  lá a pessoa escolhe entre o endereço dela e o nosso, e depois
                  diz se é casa, apartamento ou outro. Perguntar "próprio ou
                  coworking" aqui, depois do pagamento, era pedir a mesma coisa
                  com outras palavras — e ainda deixava a pessoa mudar um dado
                  que já foi pra viabilidade. O valor aparece TRAVADO no card
                  do endereço, lá em cima (03/09: fundido no mesmo cartão). */}

              {/* Fallback editável: deep-link, `/mockup` e apresentação, onde
                  não existe resposta anterior. Segue preso ao endereço PRÓPRIO
                  (coworking não tem ambiguidade residencial). */}
              {precisaResidencia && !respostaImovelVeioDoGate && (
                <Campo rotulo="Esse endereço é casa ou apartamento?">
                  <Select valor={tipoImovel} onChange={setTipoImovel} opcoes={TIPO_IMOVEL} />
                </Campo>
              )}

              {/* 🐛→🔒 31/08 — CORRIGIDO: antes só aparecia com 2+ sócios. A
                  Prefeitura de BH exige essa resposta sempre, inclusive dono
                  único (SLU) — visto ao vivo indo de indeferido pra deferido
                  só mudando essa resposta. 🔒 validado pelo Pedro: é sempre
                  sobre o TITULAR (quem constitui), nunca sobre sócio extra. */}
              {precisaResidencia && !respostaImovelVeioDoGate && (
                <div>
                  <p className="text-caption font-semibold text-text-primary mb-2">
                    Você mora nesse endereço?
                  </p>
                  {/* 🐛 03/09 (pente-fino) — a resposta era FORÇADA em "Sim"
                      quando o imóvel era apartamento, com aviso dizendo que
                      não dava pra continuar com "não". Era o beco sem saída
                      que a decisão de 01/09 desmontou no E3.4: quem tem
                      apartamento onde não mora só podia declarar algo falso.
                      Agora responde de verdade, e o "não" mostra a saída real
                      em vez de travar calado. */}
                  <OpcoesLinha
                    opcoes={[
                      { v: false, label: "Não" },
                      { v: true, label: "Sim" },
                    ]}
                    valor={resideNoEndereco}
                    onChange={setResideNoEndereco}
                  />
                  {apartamentoSemResidencia && (
                    <div className="mt-3">
                      <Aviso variante="warning" titulo="Apartamento precisa de morador">
                        A Prefeitura de Belo Horizonte indefere empresa em
                        apartamento quando nenhum sócio mora no endereço. Dá
                        pra resolver usando outro endereço seu, ou o endereço
                        fiscal da Legalizai. Chama a gente no WhatsApp que a
                        gente troca isso pra você.
                      </Aviso>
                    </div>
                  )}
                  {/* 🗑️ 01/09 — o bloco "Onde você mora" saiu daqui: o endereço
                      pessoal virou pergunta fixa do C1, pra TODO mundo (antes
                      só existia neste ramo, e o DBE ficava sem a ficha do
                      Representante em todos os outros casos). */}
                </div>
              )}

              {/* 🆕 24/08 (reunião Leonan 19/08) — quando o endereço é a sua
                  residência, o IPTU pode subir na prefeitura (às vezes dobra)
                  por causa da mudança de uso residencial→comercial. Ninguém
                  alerta isso normalmente; a gente alerta. */}
              {/* 🗑️ 01/09 (pedido do Pedro) — o aviso "O IPTU desse endereço
                  pode subir" saiu. Ele nasceu em 24/08 como zelo, mas chegava
                  tarde: nesta altura a pessoa já pagou e já mandou o endereço
                  pra viabilidade, então o alerta não muda decisão nenhuma — só
                  planta dúvida sobre uma escolha que ela não pode mais desfazer
                  aqui. Se voltar, o lugar é o E3.4, antes do dinheiro. */}
            </>
          )}

          {/* 🔒 31/08 (validado pelo Pedro, reunião Rua Satélite 38-40) —
              capital social TRAVADO em R$10.000 pra prestador de serviço,
              preenchido 100% no backend. Não aparece na tela nem como card —
              o cliente nunca vê esse dado (ver PREENCHIDOS_INTERNAMENTE). */}

          {/* ─── FORMA DE ATUAÇÃO — só MEI ──────────────────────────────────
              No ME a gente PREENCHE isso internamente ("Internet", decisão de
              26/08 em `decisoes-marca.md`): lá não gera dúvida útil, porque o
              cliente é serviço remoto e a JUCEMG só quer o campo preenchido.

              No MEI é diferente e por isso a pergunta existe: a forma de
              atuação interage com a **dispensa de alvará** (o Termo de Ciência
              declara atividade de baixo risco no endereço declarado) e com a
              validade de usar o endereço residencial como comercial. Quem
              atende porta a porta e quem monta loja não têm o mesmo risco, e
              quem responde isso é o titular, não a gente.

              Multi-seleção porque o formulário oficial é multi-seleção. */}
          {mei && (
            <Campo
              rotulo="Como você atende?"
              dica="Pode marcar mais de uma. É o mesmo campo que o Portal do Empreendedor pede."
            >
              <div className="flex flex-col gap-2">
                {FORMAS_ATUACAO.map((f) => {
                  const on = atuacao.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() =>
                        setAtuacao(
                          on
                            ? atuacao.filter((a) => a !== f.id)
                            : [...atuacao, f.id],
                        )
                      }
                      aria-pressed={on}
                      className={`min-h-12 rounded-md border px-4 text-left text-body transition-colors ${
                        on
                          ? "border-action-primary bg-action-primary font-semibold text-text-on-brand"
                          : "border-border-hairline bg-surface-card text-text-secondary hover:border-border-strong"
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </Campo>
          )}
        </Bloco>

        {/* Sheet é IRMÃO do bloco de conteúdo, nunca filho (mesma doutrina do
            `SheetCnae`/`SheetSecundarias`/`SheetAdministracao`: dentro de um
            container com clip/scroll ele aparece cortado). */}
        {infoEndereco && (
          <SheetEnderecoEmpresa mei={mei} onFechar={() => setInfoEndereco(false)} />
        )}

        {infoIptu && (
          <SheetInfo
            titulo="Como achar o índice cadastral"
            onFechar={() => setInfoIptu(false)}
            pontos={[
              "É o número que identifica o seu imóvel no cadastro da Prefeitura. Cada imóvel tem o seu, e ele não muda de dono pra dono.",
              "Ele está na sua guia do IPTU, no topo, junto dos dados do imóvel.",
              "Sem a guia em mãos, dá pra consultar no portal da Prefeitura de BH, no serviço de consulta do índice cadastral.",
            ]}
            /* 🆕 03/09 (arte do Pedro) — a guia real do IPTU.
               🔄 03/09 (2ª rodada, pedido do Pedro) — era só a FAIXA recortada
               do índice; ele derrubou porque a pessoa precisa reconhecer a
               folha inteira pra saber que é aquele papel, mesmo pequena. Agora
               entra completa, encaixada, com pill de zoom que aproxima no
               número (foco MEDIDO no arquivo: a caixa coral fica em
               14,3% / 74,9% da imagem, não é chute).
               🔒 Nome e endereço do contribuinte estão tarjados no arquivo,
               com a mesma pílula cinza que a própria guia usa nos outros
               campos: a folha continua inteira, sem dado pessoal de ninguém. */
            ilustracao={
              <ImagemZoom
                src="/icones/c4-iptu-guia.jpg"
                alt="Guia do IPTU de Belo Horizonte inteira, com o índice cadastral destacado em coral logo abaixo dos dados do imóvel"
                largura={1200}
                altura={578}
                focoX={14.3}
                focoY={74.9}
                escala={2.6}
              />
            }
            link={{
              /* Serviço oficial "IPTU – Consulta do Índice Cadastral e CIB",
                 achado no portal da PBH em 03/09. 🟡 URL do Portal de
                 Serviços carrega ids que a PBH pode rotacionar: se cair, a
                 porta estável é prefeitura.pbh.gov.br/fazenda/iptu. */
              href: "https://servicos.pbh.gov.br/servicos/i/650b5f6f44d15a1dffe97660/5dc8470253fd6b5bbd99185f/servicos+iptu-consulta-de-numero-do-indice-cadastral",
              label: "Consultar no site da Prefeitura",
            }}
          />
        )}

        <Rodape>
          {/* 🆕 03/09 (pedido do Pedro) — escape hatch pra quem trava aqui
              (endereço/IPTU são os campos que mais geram dúvida da tela),
              mesmo padrão do E3.2 (`gate-telas.tsx`): abre o WhatsApp com a
              dúvida já contextualizada, número único em `lib/contato.ts`.
              🐛 03/09 (pente-fino) — a mensagem citava IPTU, que não existe na
              versão MEI desta tela. Texto guardado por regime. */}
          <a
            href={linkWhatsApp(
              mei
                ? "Oi! Estou abrindo meu MEI no app da Legalizai e tô com dúvida nos dados da empresa. Podem me ajudar?"
                : "Oi! Estou no cadastro da empresa no app da Legalizai e tô com dúvida nos dados do endereço/IPTU. Podem me ajudar?",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 block text-center w-full text-caption font-medium text-text-secondary underline underline-offset-4"
          >
            Está com dúvida? Chama no WhatsApp
          </a>
          <Button full disabled={!completo} onClick={onSeguir}>
            {ctaLabel ?? "Continuar"}
          </Button>
        </Rodape>
      </main>
    </>
  );
}

/* ═══════════════════ N14 · CNAE SECUNDÁRIOS ═════════════════════════════ */

interface Sugestao {
  id: string;
  cnae: string;
  humano: string;
  prova: string;
  /** 🆕 24/08 (reunião Leonan) — nem todo CNAE atendido é mesmo-imposto. A
   *  maioria das curadas continua sendo (decisão 21/07); a busca abre pra
   *  qualquer CNAE que a gente ATENDE, mesmo mudando o anexo. */
  mudaEnquadramento?: boolean;
}

// Todas MESMO-IMPOSTO que a principal (Anexo III/V com Fator R). Nenhuma muda o
// enquadramento — é a condição pra estar nesta lista curada (decisão 21/07).
const SUGESTOES: Sugestao[] = [
  {
    id: "s1",
    cnae: "6202-3/00",
    humano: "Sistemas de computador sob encomenda",
    prova: "Comum como secundário de quem faz site.",
  },
  {
    id: "s2",
    cnae: "6204-0/00",
    humano: "Consultoria em tecnologia da informação",
    prova: "Quem entrega site costuma orientar a parte técnica também.",
  },
  {
    id: "s3",
    cnae: "7410-2/99",
    humano: "Design gráfico e identidade visual",
    prova: "Anda junto de web design na maioria dos casos.",
  },
  {
    id: "s4",
    cnae: "6203-1/00",
    humano: "Software pronto (de prateleira)",
    prova: "Se além do site você licencia algum produto seu.",
  },
  /* 🆕 02/09 (pedido do Pedro: "4 é pouco, traz umas 8") — os 4 novos são
     todos da mesma família da principal (divisões 62 e 63 da CONCLA, serviços
     de TI), que é a condição pra estar nesta lista curada: mesmo imposto,
     sem disparar o aviso de enquadramento. Códigos reais; a classificação
     fiscal segue a régua do arquivo (mock, não ratificado por contador). */
  {
    id: "s5",
    cnae: "6201-5/01",
    humano: "Programas de computador sob encomenda",
    prova: "Irmão direto do web design: o mesmo 6201, outra subclasse.",
  },
  {
    id: "s6",
    cnae: "6209-1/00",
    humano: "Suporte técnico e manutenção em TI",
    prova: "Quem entrega o site quase sempre dá o suporte depois.",
  },
  {
    id: "s7",
    cnae: "6311-9/00",
    humano: "Hospedagem na internet",
    prova: "Se você revende ou administra a hospedagem do cliente.",
  },
  {
    id: "s8",
    cnae: "6319-4/00",
    humano: "Portais e provedores de conteúdo",
    prova: "Pra quem mantém portal ou publica conteúdo próprio.",
  },
];

/**
 * 🆕 24/08 (reunião Leonan 19/08) — banco de BUSCA: mesma lista de CNAEs que a
 * entrevista principal (E5A) já sabe se atende ou não. Restrito aos que a
 * gente atende — se a pessoa digitar um que a gente não atende, ela não acha
 * (mesma régua da entrevista principal, não uma segunda lista solta). Alguns
 * itens aqui MUDAM o enquadramento — é o caso que dispara o aviso + rota pro
 * atendente em vez de deixar continuar sozinho.
 */
const BANCO_BUSCA: Sugestao[] = [
  ...SUGESTOES,
  {
    id: "b1",
    cnae: "8599-6/04",
    humano: "Treinamento em desenvolvimento profissional",
    prova: "Fora do segmento de web, mas a gente atende.",
    mudaEnquadramento: true,
  },
  {
    id: "b2",
    cnae: "7020-4/00",
    humano: "Consultoria em gestão empresarial",
    prova: "Atividade diferente da principal, sem problema — é só complemento.",
    mudaEnquadramento: true,
  },
  {
    id: "b3",
    cnae: "8230-0/01",
    humano: "Organização de eventos",
    prova: "Exemplo de secundária de outro segmento que mantém o mesmo imposto.",
  },
  /* 🆕 02/09 (pedido do Pedro) — BANCO DE BUSCA ENGORDADO, de 3 pra 15
     exclusivas. Com 8 curadas, a busca tinha só 3 resultados possíveis: quase
     tudo que a pessoa digitasse dava "não atendemos", e a demo passava a
     impressão de que o produto atende pouca coisa. Pior, 2 das 3 mudavam o
     enquadramento — o aviso amarelo e o desvio pro atendente, que deviam ser
     exceção, apareciam em 2 de cada 3 buscas.
     São atividades de SERVIÇO de outros ramos (é o ponto: secundária não
     precisa ser do mesmo ramo). Nenhuma regulamentada — essas o produto não
     atende e sairiam pela waitlist lá no E3.4, não aqui.
     🔴 Mesma régua de confiança do resto do arquivo: códigos reais, mas a
     classificação fiscal (quem muda anexo e quem não muda) é mock. A lista de
     verdade sai da matriz CNAE quando ela for ratificada. */
  { id: "b4", cnae: "7420-0/01", humano: "Fotografia", prova: "" },
  { id: "b5", cnae: "7420-0/04", humano: "Filmagem de festas e eventos", prova: "" },
  { id: "b6", cnae: "5911-1/02", humano: "Produção de filmes para publicidade", prova: "" },
  { id: "b7", cnae: "5920-1/00", humano: "Gravação de som e edição de música", prova: "" },
  { id: "b8", cnae: "7311-4/00", humano: "Agência de publicidade", prova: "" },
  { id: "b9", cnae: "7319-0/03", humano: "Marketing direto", prova: "" },
  { id: "b10", cnae: "7319-0/02", humano: "Promoção de vendas", prova: "" },
  { id: "b11", cnae: "8592-9/99", humano: "Ensino de arte e cultura", prova: "" },
  { id: "b12", cnae: "8599-6/03", humano: "Treinamento em informática", prova: "" },
  { id: "b13", cnae: "8219-9/99", humano: "Preparação de documentos e apoio administrativo", prova: "" },
  { id: "b14", cnae: "8299-7/99", humano: "Outros serviços prestados a empresas", prova: "" },
  { id: "b15", cnae: "7490-1/04", humano: "Agenciamento de serviços e negócios", prova: "" },
];

export function CnaeSecundariosView({
  preencher,
  onSeguir,
  onVoltar,
  onFalarAtendente,
  ctaLabel,
}: {
  preencher?: number;
  onSeguir?: () => void;
  onVoltar?: () => void;
  /** 🆕 24/08 — quando alguma secundária escolhida muda o enquadramento, o
   *  CTA principal troca de "Continuar" pra "Falar com atendente" (mesma
   *  lógica já usada no gate de CNAE principal). */
  onFalarAtendente?: () => void;
  /**
   * 🆕 01/09 (pedido do Pedro) — rótulo do CTA. Existe pro MODO AJUSTE: quem
   * volta pra corrigir um bloco vê "Atualizar dados" na última tela dele, em
   * vez de "Continuar" (que sugeriria refazer o wizard inteiro).
   * Ausente = "Continuar", o comportamento de sempre.
   */
  ctaLabel?: string;
}) {
  const [ativos, setAtivos] = useState<Record<string, boolean>>({});
  const [busca, setBusca] = useState("");

  usePreencher(preencher, () => {
    setAtivos(Object.fromEntries(PREENCHIMENTO.cnaeSecundarios.map((id) => [id, true])));
    setBusca("");
  });

  const TODAS = [...SUGESTOES, ...BANCO_BUSCA.filter((s) => !SUGESTOES.some((x) => x.id === s.id))];
  const idsAtivos = Object.entries(ativos).filter(([, v]) => v).map(([id]) => id);
  // Limite do produto: até 15 secundárias (reunião Leonan 19/08).
  const noLimite = idsAtivos.length >= 15;
  /* A principal no formato que o cartão da C0 espera. `adequacao` não é
     usada (o percentual saiu dos cartões em 02/09), fica no dado só porque o
     tipo pede. */
  const principalComoOpcao = {
    humano: CNAE_PRINCIPAL.humano,
    cnae: CNAE_PRINCIPAL.cnae,
    adequacao: 94,
  };
  const [detalhe, setDetalhe] = useState<OpcaoCnae | null>(null);
  /* O sheet trabalha em RASCUNHO: desmarcar lá não mexe na tela até salvar.
     É o que justifica o botão dizer "Salvar" — e o que permite fechar sem
     aplicar, se a pessoa só foi conferir. */
  const [vendoSecundarias, setVendoSecundarias] = useState(false);
  // 🆕 03/09 (pedido do Pedro) — "i" do cabeçalho: a tela é opcional e isso
  // gera hesitação ("preciso mesmo?", "aumenta meu imposto?").
  const [info, setInfo] = useState(false);
  const [rascunho, setRascunho] = useState<Record<string, boolean>>({});
  // As escolhidas, venham de onde vierem (sugestão curada ou busca).
  const escolhidas = idsAtivos
    .map((id) => TODAS.find((s) => s.id === id))
    .filter((s): s is (typeof TODAS)[number] => !!s);
  const algumaMudaEnquadramento = idsAtivos.some(
    (id) => TODAS.find((s) => s.id === id)?.mudaEnquadramento,
  );

  /* 🔄 02/09 (achado do Pedro: "ela só some, fica confuso") — O ITEM
     ESCOLHIDO CONTINUA NA LISTA, marcado.
     Eu tinha tirado ele daqui ao criar o cartão-resumo, aplicando a regra da
     C0 (onde o escolhido sobe pro slot e sai da lista). Foi rígido demais: lá
     a escolha é ÚNICA e o slot é o mesmo cartão mudando de lugar; aqui ela
     marca várias seguidas, e o resumo lá em cima é outra coisa — contagem e
     nomes, não o cartão. Sumir deixava o feedback longe do dedo, e ainda
     encolhia a lista de 8 pra 5 enquanto a pessoa escolhia.
     Agora o toque responde onde a mão está, e tocar de novo desmarca. */
  const resultadosBusca = busca.trim()
    ? BANCO_BUSCA.filter(
        (s) =>
          !SUGESTOES.some((x) => x.id === s.id) &&
          (s.humano.toLowerCase().includes(busca.toLowerCase()) ||
            s.cnae.includes(busca)),
      )
    : [];

  function alterna(id: string) {
    setAtivos((a) => {
      const ligado = !a[id];
      if (ligado && noLimite) return a; // trava em 15
      return { ...a, [id]: ligado };
    });
  }

  return (
    <>
      {/* 🐛 02/09 — `meta` é o nome do DESTINO do voltar, não desta tela
          (padrão corrigido no gate em 29/08). Daqui volta pra C0. */}
      <TelaHeader
        meta="Sua atividade"
        onVoltar={onVoltar}
        acao={<BotaoInfo onClick={() => setInfo(true)} rotulo="Pra que serve atividade secundária" />}
      />

      <main className="app-main">
        {/* 🗑️ 02/09 (pedido do Pedro) — SEM SUBTÍTULO, pra padronizar com a
            C0. Ele carregava 2 coisas: "se fizer, marque aqui" (que o título
            já pergunta e os cartões já mostram) e "não precisa ser do mesmo
            ramo" — esta NOVA, e vinda da reunião de 19/08 justamente porque as
            pessoas presumem o contrário.
            ⚠️ Só apagar perderia a segunda, e aqui o silêncio não é neutro: as
            4 sugestões curadas são todas do mesmo ramo da principal, então a
            tela CONFIRMA a expectativa errada. A ressalva foi pro rótulo da
            busca, que é onde ela vira ação — é lá, e só lá, que dá pra
            escolher fora do ramo. */}
        <Titulo>Sua empresa faz mais alguma coisa?</Titulo>

        {/* 🔒 02/09 (pedido do Pedro) — TÍTULO E CARTÃO DA PRINCIPAL TRAVADOS.
            O cartão vivia dentro do `Corpo` e subia junto com a lista: a
            pessoa rolava pra escolher e perdia de vista qual é a atividade
            principal, que é justamente a referência de tudo que ela está
            marcando (e onde as secundárias ficam penduradas). Agora só a
            lista rola. */}
        {/* 🔄 02/09 (pedido do Pedro) — A PRINCIPAL É O MESMO CARTÃO DA C0.
            Era um `Card` neutro, com outro rótulo ("Atividade principal (já
            definida)") e sem o "Ver detalhes". Duas telas do mesmo bloco
            mostrando o MESMO dado de dois jeitos fazia a pessoa reconferir
            se era a mesma coisa. Agora é o cartão coral idêntico, com a pill
            e o acesso ao detalhe — a identidade visual atravessa o bloco.
            Reusa `OutrasOpcoes` (encaixe.tsx), a mesma fonte da C0. */}
        {/* 🔄 02/09 — respiro entre o bloco travado e a lista que rola. Sem
            ele o cartão encostava no "Sugestões pra você", e a tela lia como
            se o cartão fizesse parte da lista. */}
        <div className="mb-5 shrink-0">
          {/* 🗑️ 02/09 (pedido do Pedro) — o rótulo "Sua atividade
              principal" saiu: a pill "Principal" dentro do cartão já diz
              isso, e os dois colados viravam a mesma frase duas vezes. Na
              C0 o par não se repetia, porque lá a pill é "+ compatível". */}
          <OutrasOpcoes
            titulo=""
            alternativas={[principalComoOpcao]}
            escolhido={principalComoOpcao.cnae}
            // 🔒 02/09 (pedido do Pedro) — aqui a pill é "Principal", não
            // "+ compatível". Na C0 o rótulo respondia "qual dessas encaixa
            // melhor?", a pergunta daquela tela. Aqui a escolha já foi
            // feita: o que o cartão informa é o PAPEL dele no meio das
            // secundárias que estão sendo montadas embaixo.
            pillDe={() => "Principal"}
            onVerDetalhes={setDetalhe}
            /* 🔄 02/09 (ideia do Pedro) — as secundárias moram DENTRO do
               cartão da principal, e ele cresce pra baixo. Soltas num
               cartão próprio, as duas informações liam como assuntos
               independentes; aqui a hierarquia (uma principal, N
               secundárias penduradas nela) é dita pela estrutura, sem
               precisar de texto explicando. */
            rodapeDoCartao={() =>
              escolhidas.length === 0 ? null : (
                <button
                type="button"
                onClick={() => {
                  setRascunho(ativos);
                  setVendoSecundarias(true);
                }}
                className="mt-3 flex w-full items-center justify-between gap-3 rounded-md bg-action-primary-sm p-2 text-left"
                >
                <span className="min-w-0">
                  <span className="block text-caption font-semibold text-text-on-brand">
                    {escolhidas.length === 1
                      ? "1 atividade secundária"
                      : `${escolhidas.length} atividades secundárias`}
                  </span>
                  <span className="mt-0.5 block truncate text-micro text-text-on-brand/80">
                    {escolhidas.map((s) => s.humano).join(" · ")}
                  </span>
                </span>
                {/* 🗑️ 02/09 — testamos uma pill "Secundárias" aqui, par da
                    "Principal". Saiu na mesma rodada: a própria linha já
                    diz "3 atividades secundárias", então a pill repetia a
                    palavra ao lado dela mesma. */}
                <ChevronResumo />
                </button>
              )
            }
          />
        </div>


        <Corpo>
          {/* 🗑️ 02/09 (pente fino do Pedro) — 3 linhas que repetiam o que a
              tela já dizia em outros 4 lugares ("é opcional", "complemento").
              A única informação nova, "não precisa ser do mesmo ramo", subiu
              pro subtítulo; o teto de 15 a própria UI garante (para de deixar
              marcar). Tinha travessão, proibido em copy pública desde 24/07. */}

          {algumaMudaEnquadramento && (
            <Aviso variante="warning" titulo="Uma dessas muda seu enquadramento">
              Pelo menos uma atividade que você escolheu muda o imposto que sua
              empresa paga. Isso a gente prefere acertar com você, não sozinho —
              por isso o próximo passo é falar com um atendente em vez de
              continuar direto.
            </Aviso>
          )}

          {busca.trim() && (
            <div className="flex flex-col gap-2">
              {resultadosBusca.length === 0 ? (
                <p className="text-caption text-text-secondary">
                  Nenhuma atividade encontrada que a gente atenda com esse termo.
                </p>
              ) : (
                resultadosBusca.map((s) => {
                const on = !!ativos[s.id];
                  return (
                    <button
                      key={s.id}
                      onClick={() => alterna(s.id)}
                      /* Mesma regra das sugestões (02/09): o cartão não pinta,
                         quem marca é o check. */
                      className={`rounded-md border p-3 text-left transition-colors
                        ${
                          on
                            ? "border-action-primary bg-surface-card"
                            : "border-border-hairline bg-surface-card hover:border-border-strong"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-body font-semibold text-text-primary">
                            {s.humano}
                          </p>
                          <p className="text-caption mt-0.5 text-text-secondary">
                            CNAE {s.cnae}
                          </p>
                        </div>
                        <span
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full
                            ${
                              on
                                ? "bg-action-primary text-text-on-brand"
                                : "border border-border-strong text-text-tertiary"
                            }`}
                          aria-hidden
                        >
                          {on ? <CheckMarcado /> : <MaisMarcador />}
                        </span>
                      </div>
                      {/* 🔒 02/09 (decisão do Pedro) — ETIQUETA SÓ NO QUE MUDA.
                          O "Mantém seu enquadramento" saiu: ele aparecia na
                          maioria dos cartões dizendo sempre a mesma coisa, e
                          etiqueta que não varia não informa, vira decoração.
                          Alerta só existe quando há o que alertar; o silêncio
                          passa a significar "nada muda". */}
                      {s.mudaEnquadramento && (
                        <span
                          className={`mt-1 inline-block rounded-full px-2 py-0.5 text-micro font-semibold
                            ${
                              on
                                ? "bg-surface-card/20 text-text-on-brand"
                                : "bg-state-warning-tint text-state-warning-text"
                            }`}
                        >
                          Muda seu enquadramento
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}

          {/* 🔄 02/09 (pente fino do Pedro) — SUGESTÕES ANTES DA BUSCA.
              A busca vinha primeiro, então a pessoa lia "buscar outra
              atividade" antes de ver o que a gente já tinha pra oferecer:
              primeiro o esforço, depois a conveniência. Invertida, a busca
              vira o que ela é — a saída pra quem não se encontrou na lista. */}
          <div>
            {/* 🆕 02/09 (pedido do Pedro) — a contagem no canto direito, na
                mesma fonte do rótulo e em coral. Ela conta o que está NA
                CURADORIA, e é fixo: o escolhido continua na lista, marcado.
                Quem conta o que a pessoa montou é o cartão-resumo. Cada número
                com um dono só. */}
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <p className="text-micro text-text-tertiary">Sugestões pra você</p>
              <p className="shrink-0 text-micro font-semibold text-action-primary-sm">
                {SUGESTOES.length} opções
              </p>
            </div>
            {/* 🗑️ 02/09 — a garantia "não muda o imposto" saiu daqui: cada
                cartão já a carrega na etiqueta, e lá ela é acionável (é o que
                distingue um cartão do outro). Aqui era só mais uma promessa
                repetida. */}
            <div className="flex flex-col gap-2">
              {SUGESTOES.map((s) => {
                const on = !!ativos[s.id];
                return (
                  <button
                    key={s.id}
                    onClick={() => alterna(s.id)}
                    /* 🔄 02/09 (pedido do Pedro) — SELECIONADO SEM PINTAR O
                       CARTÃO. Com 8 sugestões, cada marcada virava um bloco
                       coral cheio e a lista ficava pesada. Agora o cartão
                       segue branco e quem marca é o CHECK coral no canto
                       superior direito, com a borda acompanhando de leve.
                       ⚠️ Vale AQUI porque a seleção é múltipla e some no meio
                       de uma lista longa. Onde a escolha é única e precisa
                       gritar (a principal na C0, o slot), o fill cheio
                       continua. */
                    className={`rounded-md border p-3 text-left transition-colors
                      ${
                        on
                          ? "border-action-primary bg-surface-card"
                          : "border-border-hairline bg-surface-card hover:border-border-strong"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-body font-semibold text-text-primary">
                          {s.humano}
                        </p>
                        <p className="text-caption mt-0.5 text-text-secondary">
                          CNAE {s.cnae}
                        </p>
                        {/* 🗑️ 02/09 (decisão do Pedro) — a etiqueta "Mantém seu
                            enquadramento" saiu daqui. Ela nasceu em 06/08 (WA
                            walkthrough, tag "PIL") pra tornar visível por item a
                            garantia que a curadoria já dá — só que as 4 sugestões
                            são TODAS mesmo-imposto, então ela dizia a mesma coisa
                            quatro vezes. Etiqueta que não varia não informa.
                            Agora só existe alerta quando há o que alertar, e o
                            silêncio passa a significar "nada muda". */}
                      </div>
                      {/* Agora o marcador é o ÚNICO sinal de seleção: coral
                          cheio com check branco quando marcado, contorno vazio
                          quando não. */}
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full
                          ${
                            on
                              ? "bg-action-primary text-text-on-brand"
                              : "border border-border-strong text-text-tertiary"
                          }`}
                        aria-hidden
                      >
                        {on ? <CheckMarcado /> : <MaisMarcador />}
                      </span>
                    </div>
                    {/* 🗑️ 02/09 (decisão do Pedro) — a linha de justificativa
                        ("Comum como secundário de quem faz site.") saiu de
                        todos os cartões. Eram 8 linhas, a maior massa de texto
                        da tela, e três diziam a mesma coisa: "isso combina com
                        web design". É informação de CURADORIA (por que
                        sugerimos), não de decisão — e o nome do CNAE já se
                        explica. O campo `prova` segue no dado, pro caso de
                        virar conteúdo do sheet de detalhes. */}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 🗑️ 02/09 — 3ª vez que a tela dizia "é opcional", e a mais fraca
              ("está ótimo" soa como consolo). O subtítulo e o CTA já dão essa
              licença. 🔒 O "pode adicionar depois" saiu por decisão do Pedro
              mesmo tendo sido sugerido pro subtítulo: convida a pular a tela. */}
        </Corpo>

        {detalhe && <SheetCnae opcao={detalhe} onFechar={() => setDetalhe(null)} />}

        {info && (
          <SheetInfo
            titulo="Pra que serve atividade secundária"
            onFechar={() => setInfo(false)}
            pontos={[
              "A atividade principal é o que você mais faz. As secundárias são o resto que você também faz e quer poder cobrar por isso.",
              "Você só emite nota do que está no seu CNPJ. Fazer um serviço que não está lá te deixa sem como faturar direito.",
              "Incluir agora é de graça. Depois, acrescentar atividade é uma alteração cadastral, com taxa e prazo.",
              "As sugestões daqui são do mesmo grupo fiscal da sua principal: não mudam o que você paga.",
              "Não é obrigatório. Se hoje você só faz uma coisa, pode seguir sem escolher nada.",
            ]}
            exemplo={{
              titulo: "Um caso comum",
              nota: "Quem tem design como principal costuma incluir consultoria e treinamento: são serviços que aparecem em projeto de cliente e, sem o código, não dava pra colocar na nota.",
            }}
          />
        )}

        {vendoSecundarias && (
          <SheetSecundarias
            itens={TODAS}
            rascunho={rascunho}
            setRascunho={setRascunho}
            original={ativos}
            onSalvar={(novo) => {
              setAtivos(novo);
              setVendoSecundarias(false);
            }}
            onFechar={() => setVendoSecundarias(false)}
          />
        )}

        <Rodape>
          {/* 🔄 02/09 (pedido do Pedro) — A BUSCA FICA FIXA ACIMA DO CTA.
              Ela vivia no fim do corpo rolável: quem não se encontrava nas 8
              sugestões precisava rolar até o fim pra descobrir que existia
              busca. Fixa, ela é uma saída sempre à mão, e os RESULTADOS
              aparecem lá em cima, no corpo, que é onde a lista mora.
              Mesmo padrão do link de WhatsApp preso acima do CTA na E9.1P. */}
          {/* 🆕 24/08 — busca restrita ao que a gente atende (mesma lista da
              entrevista principal), pedido original da Jéssica (reunião 19/07)
              e reforçado pelo Leonan. */}
          <div className="mb-4"><Campo rotulo="Buscar outra atividade, de qualquer ramo">
            <Texto
              valor={busca}
              onChange={setBusca}
              placeholder="Ex: consultoria, eventos, treinamento..."
            />
          </Campo></div>


          {algumaMudaEnquadramento ? (
            <Button full variant="dark" onClick={onFalarAtendente}>
              Falar com atendente
            </Button>
          ) : (
            <Button full onClick={onSeguir}>
              {/* 🆕 02/09 (pedido do Pedro) — O CTA CONFIRMA O QUE FOI
                  ESCOLHIDO. Dizia "Continuar" com zero ou com dez marcadas, e
                  a pessoa seguia sem recibo nenhum do que acabou de montar.
                  "Incluir", não "Validar": validar sugere que alguém vai
                  conferir e aprovar depois, e não vai — a inclusão é imediata.
                  O caso zero tem rótulo próprio, senão o botão diria
                  "Incluir 0 atividades". `ctaLabel` (modo ajuste) continua
                  mandando: lá o botão volta pro status, não inclui nada. */}
              {ctaLabel ??
                (escolhidas.length === 0
                  ? "Continuar sem secundárias"
                  : escolhidas.length === 1
                    ? "Incluir 1 atividade secundária"
                    : `Incluir ${escolhidas.length} atividades secundárias`)}
            </Button>
          )}
        </Rodape>
      </main>
    </>
  );
}

/* ═══════════════════ N15 · NATUREZA JURÍDICA ════════════════════════════ */

type Tipo = "slu" | "ltda";

const INFO: Record<Tipo, { nome: string; linha: string; sigla: string }> = {
  slu: {
    nome: "Empresa de dono único",
    sigla: "SLU",
    linha:
      "Feita pra quem abre sozinho. Seu patrimônio pessoal fica separado da empresa.",
  },
  ltda: {
    nome: "Sociedade entre sócios",
    sigla: "LTDA",
    linha: "Feita pra 2 ou mais donos, com a divisão da empresa em contrato.",
  },
};

/**
 * ⚠️ Sem `preencher`: depois de virar condicional, esta tela não tem campo
 * nenhum pra preencher — o formato é derivado do nº de sócios e já vem
 * selecionado. A demo esconde o botão aqui em vez de mostrá-lo inerte.
 */
export function NaturezaView({
  onSeguir,
  onVoltar,
  ctaLabel,
}: {
  onSeguir?: () => void;
  onVoltar?: () => void;
  ctaLabel?: string;
}) {
  /**
   * ⚠️ 29/07 — A TELA VIROU CONDICIONAL (decisão do Pedro).
   *
   * Antes ela mostrava SEMPRE os dois formatos, com o "Sugerido" no que batia
   * com o número de sócios, e barrava só a combinação impossível (dono único
   * tendo sócio). Agora ela mostra **só o formato que existe pro caso da
   * pessoa**: solo → dono único; com sócio → sociedade.
   *
   * Consequência 1: não há mais o que escolher, então a tela deixou de ser
   * escolha e virou CONFIRMAÇÃO. É a mesma direção do resto do dia — não
   * oferecer o que já foi decidido lá atrás.
   *
   * Consequência 2: o guard-rail de incoerência sai de cena. Ele foi consertado
   * hoje de manhã (nunca tinha rodado, `TEM_SOCIO` era um const false local) e
   * agora fica desnecessário: não dá pra escolher o impossível se o impossível
   * não é oferecido. Prevenir por construção > bloquear depois.
   *
   * ⚠️ Consequência 3, que vale registrar: **isto fecha o caminho LTDA-solo.**
   * O doc desta tela apontava um fato datado — o CNPJ real do Pedro saiu LTDA
   * num caso solo — e a regra antiga permitia isso de propósito ("a recomendação
   * nunca é uma trava, só a incoerência é"). Com a tela condicional, quem abre
   * sozinho não consegue mais pedir LTDA por aqui. Se esse caminho precisar
   * voltar, ele volta como uma saída explícita ("quero outro formato"), não
   * como uma opção solta na lista.
   */
  const opcoes: Tipo[] = TEM_SOCIO ? ["ltda"] : ["slu"];

  return (
    <>
      <TelaHeader meta="Tipo da empresa" onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo
          sub={
            TEM_SOCIO
              ? "Como vocês têm sócios, o formato já está definido. É só conferir."
              : "Como você abre sozinho, o formato já está definido. É só conferir."
          }
        >
          O tipo da sua empresa
        </Titulo>

        <Corpo>
          <div>
            <p className="text-micro text-text-tertiary mb-1.5">
              {TEM_SOCIO ? "O formato pra quem tem sócio" : "O formato pra quem abre sozinho"}
            </p>
            {/* Uma opção só, já selecionada. O coral sólido não é "você
                escolheu", é "é este" — e o texto interno inverte junto. */}
            <div className="flex flex-col gap-2">
              {opcoes.map((t) => (
                <div
                  key={t}
                  className="rounded-md border border-action-primary bg-action-primary p-4 text-left"
                >
                  <p className="text-body font-semibold text-text-on-brand mb-1">
                    {INFO[t].nome}
                  </p>
                  <p className="text-caption text-text-on-brand/80">{INFO[t].linha}</p>
                  <p className="text-micro text-text-on-brand/70 mt-1">
                    Sigla oficial: {INFO[t].sigla}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Card>
            <p className="text-caption font-semibold text-text-primary mb-1">
              A gente cuida da sigla
            </p>
            <p className="text-caption text-text-secondary">
              {TEM_SOCIO
                ? "Ela separa o dinheiro de vocês do dinheiro da empresa. O resto do papel a gente resolve."
                : "Ela separa o seu dinheiro do dinheiro da empresa. O resto do papel a gente resolve."}
            </p>
          </Card>
        </Corpo>

        <Rodape>
          <Button full onClick={onSeguir}>
            {ctaLabel ?? "Continuar"}
          </Button>
        </Rodape>
      </main>
    </>
  );
}

/* ═══════════════════ N16 · NOME / RAZÃO SOCIAL ══════════════════════════ */

/**
 * 1ª RODADA — a 1ª linha vira o ponto de partida da pessoa (campo aberto) e as
 * 2 seguintes são as nossas reservas travadas (decisão do Pedro, 03/09).
 * 🔄 03/09 — a lista mora em `dossie/mock.ts` (`RAZAO_OPCOES`): o A1 mostra as
 * 3 na ordem, e duas cópias divergiriam na 1ª correção.
 */

/**
 * 🆕 03/09 (pedido do Pedro) — 2ª RODADA: as reservas são OUTRAS.
 *
 * Se as 3 primeiras caíram, repetir as nossas seria mandar de volta o que a
 * Junta acabou de recusar. E o critério de construção também muda, pelo mesmo
 * motivo que faz a gente travar as reservas: nome novo tem que sair de outra
 * ideia, não de outra palavra. Aqui a 1ª usa só o SOBRENOME (some o primeiro
 * nome, que é a colisão mais provável) e a 2ª usa as INICIAIS.
 */
const RESERVAS_2A_RODADA = [
  `${NOME_EMPRESARIAL.split(" ").slice(-1)[0]} Digital Soluções`,
  `${NOME_EMPRESARIAL.split(" ")
    .map((parte) => parte[0])
    .join("")} Sistemas e Serviços`,
];

/* 🔄 03/09 — `gerarObjetoSocial()` virou a const `OBJETO_SOCIAL` no mock: o A1
   exibe o mesmo texto como leitura, e ele é derivado das atividades nos dois. */

/* 🗑️ 03/09 — `IconeLapis` e `IconeCheckMini` saíram com o modo de edição:
   os campos ficam abertos, não há mais o que "editar" nem o que "salvar". */

/* 🗑️ 03/09 — `ChevronOrdem` saiu com as setas: a ordem deixou de ser escolha
   (a opção da pessoa vai primeiro, as nossas 2 reservas seguram atrás). */

/**
 * 🔒 03/09 (achado do Pedro) — TETO DE 50 CARACTERES NA RAZÃO SOCIAL.
 *
 * O campo do registro aceita 60. A gente acrescenta o tipo societário no fim
 * ("… LTDA") automaticamente, e esse sufixo tem que caber dentro dos mesmos
 * 60 — então o que a pessoa escreve para em 50. Sem o teto, o nome passaria
 * na tela e seria cortado (ou recusado) na hora de registrar, que é o pior
 * lugar possível pra descobrir.
 *
 * 🟡 O 60 veio do Pedro, não de fonte oficial lida por mim: se o limite real
 * variar por natureza jurídica, é este número que muda.
 */
const LIMITE_RAZAO = 50;

/**
 * 🆕 03/09 (pedido do Pedro) — o nome APARECE INTEIRO, quebrando linha se
 * precisar. `input` não quebra: some o começo ou o fim do texto, e nome de
 * empresa é exatamente o que a pessoa precisa reler antes de mandar pra Junta.
 * Então é um `textarea` de 1 linha que cresce com o conteúdo — mesma técnica
 * do campo de descrição da C0 (`gate-telas.tsx`), sem rolagem interna.
 */
function CampoNomeAberto({
  valor,
  onChange,
  autoFocus,
  rotulo,
  placeholder,
  limite,
}: {
  valor: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
  rotulo: string;
  placeholder: string;
  /** Teto de caracteres. Ver `LIMITE_RAZAO` pro porquê do número. */
  limite: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [valor]);

  return (
    <textarea
      ref={ref}
      rows={1}
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      // Enter não quebra linha aqui: o nome é uma linha só de conteúdo, a
      // quebra é só visual (o campo cresce sozinho quando não cabe).
      onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
      autoFocus={autoFocus}
      aria-label={rotulo}
      placeholder={placeholder}
      maxLength={limite}
      className="min-w-0 flex-1 resize-none overflow-hidden bg-transparent py-3 text-body
                 leading-snug text-text-primary placeholder:text-text-muted focus:outline-none"
    />
  );
}

/** Cadeado das reservas — mesmo traço dos outros ícones do wizard. */
function IconeCadeado() {
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
      className="shrink-0 text-text-tertiary"
    >
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

/**
 * 🆕 24/08 (pedido do Pedro) — a pessoa reescreve a sugestão da IA no lugar,
 * em vez de digitar uma opção À PARTE ("Nenhuma dessas? Digite a sua",
 * removido). Objeto usa `id` estável (não o texto) porque o texto MUDA quando
 * editado — usar o próprio nome como key quebraria a lista.
 * 🔄 03/09 — o lápis que abria a edição saiu: os campos ficam sempre abertos.
 */
interface SugestaoNome {
  id: string;
  valor: string;
}

function sugestoesIniciais(novaRodada = false): SugestaoNome[] {
  // 🔄 03/09 — nas DUAS rodadas a regra é a mesma: 1 linha da pessoa + 2
  // reservas nossas travadas. O que muda é o lote das reservas e o fato de a
  // 1ª nascer vazia na 2ª rodada (ali ela vem escrever, não escolher).
  if (novaRodada) {
    return [
      { id: "r0", valor: "" },
      ...RESERVAS_2A_RODADA.map((valor, i) => ({ id: `r${i + 1}`, valor })),
    ];
  }
  return RAZAO_OPCOES.map((valor, i) => ({ id: `n${i}`, valor }));
}

export function NomeView({
  preencher,
  onSeguir,
  onVoltar,
  mei = false,
  novaRodada = false,
  ctaLabel,
}: {
  preencher?: number;
  onSeguir?: () => void;
  onVoltar?: () => void;
  /**
   * 🆕 28/08 — no MEI a razão social NÃO É ESCOLHIDA.
   *
   * A Lei 14.195/2021 mandou gerar automaticamente: os 8 primeiros dígitos do
   * CNPJ + o nome civil do titular (ex.: "12.345.678 JOAO DA SILVA"). Não há
   * consulta de colidência, não há 3 tentativas na Junta, não há objeto social
   * (que existe pro contrato). Oferecer as 3 sugestões pro MEI seria pedir uma
   * escolha que o governo não aceita.
   *
   * O que SOBRA e continua importando: o **nome fantasia**, que é opcional e
   * livre nos dois regimes.
   *
   * ⚠️ Nada disso muda o caminho ME: com `mei` ausente, a tela é exatamente a
   * de sempre (3 sugestões + reordenar + objeto social + fantasia).
   */
  mei?: boolean;
  /**
   * 🆕 01/09 (pedido do Pedro) — 2ª rodada de nomes, aberta pelo CTA "Sugerir
   * mais 3 nomes" do A3.1 (as 3 primeiras não passaram na Junta).
   *
   * É a MESMA tela, adaptada em 3 pontos: os campos nascem VAZIOS (a IA já deu
   * as sugestões dela e as 3 foram recusadas — sugerir de novo seria oferecer
   * o mesmo tipo de nome que acabou de falhar), começam em modo de edição (a
   * pessoa veio aqui pra escrever, não pra escolher) e a copy diz por que ela
   * está aqui. Reordenar, objeto social e nome fantasia continuam iguais.
   */
  novaRodada?: boolean;
  /**
   * 🆕 01/09 (pedido do Pedro) — rótulo do CTA. Existe pro MODO AJUSTE: quem
   * volta pra corrigir um bloco vê "Atualizar dados" na última tela dele, em
   * vez de "Continuar" (que sugeriria refazer o wizard inteiro).
   * Ausente = "Continuar", o comportamento de sempre.
   */
  ctaLabel?: string;
}) {
  const [ordem, setOrdem] = useState<SugestaoNome[]>(() =>
    sugestoesIniciais(novaRodada),
  );
  /* 🗑️ 03/09 (pedido do Pedro) — `editandoId` saiu junto com o lápis: os 3
     campos agora estão sempre abertos, então não existe mais "qual está em
     edição". O foco inicial da 2ª rodada virou `autoFocus` no 1º campo. */
  const [fantasia, setFantasia] = useState("");
  /* 🆕 03/09 — "i" da SEÇÃO das opções (no MEI, do cabeçalho): responde como
     funcionam as 3 tentativas e por que as 2 reservas são travadas. */
  const [info, setInfo] = useState(false);
  /* 🆕 03/09 (pedido do Pedro) — "i" DENTRO do campo de escrever o nome, só
     com as dicas de como montar uma razão social que passa. Um sheet só
     estava virando texto demais: são duas dúvidas diferentes ("que nome eu
     escrevo?" × "e se não passar?") e cada uma agora tem a sua porta. */
  const [infoRegras, setInfoRegras] = useState(false);
  /* 🆕 03/09 (pedido do Pedro) — "i" DENTRO do campo de nome fantasia, mesma
     doutrina: o contraste "aqui é livre" responde melhor no próprio campo do
     que numa lista lá em cima. */
  const [infoFantasia, setInfoFantasia] = useState(false);
  // 🔒 24/08 (reunião Leonan 19/08) — TRAVADO, não editável. Erro de grafia
  // do cliente (S↔Z etc) subia pro contrato e virava reclamação real no
  // escritório antigo do Leonan. Objeto social é 100% gerado a partir das
  // atividades (CNAE principal + secundárias) — se as atividades mudam, o
  // objeto se regenera sozinho; a pessoa não digita nele.
  const objeto = OBJETO_SOCIAL;
  /* 🔒 03/09 (pedido do Pedro) — a 2ª rodada tem tela própria: pouco conteúdo
     e espaço reservado pra ilustração, no modelo da C2. A 1ª rodada é cheia
     (3 nomes + fantasia + objeto social) e segue no `Corpo` de sempre. */
  const BlocoDaTela = novaRodada ? BlocoColadoRolavel : Corpo;

  usePreencher(preencher, () => {
    setOrdem(sugestoesIniciais(novaRodada));
    setFantasia(PREENCHIMENTO.nome.fantasia);
  });

  const completo = mei || ordem.every((o) => o.valor.trim().length > 0);

  /* 🗑️ 03/09 — `mover()` saiu com as setas: a ordem virou regra do produto
     (a opção da pessoa vai primeiro, as 2 nossas seguram atrás), não escolha
     de tela. */

  function editarValor(id: string, valor: string) {
    setOrdem((o) => o.map((s) => (s.id === id ? { ...s, valor } : s)));
  }

  return (
    <>
      {/* 🐛 02/09 — `meta` nomeia o destino. Na rodada 2 o voltar devolve
          pra tela de recusa da Junta; no fluxo normal, pro dossiê da empresa
          (ou pros sócios, quando a C4 foi pulada por endereço fiscal — daí o
          rótulo genérico, que serve aos dois). */}
      <TelaHeader
        meta={novaRodada ? "O que a Junta pediu" : "Dados do dossiê"}
        onVoltar={onVoltar}
        /* 🔄 03/09 (pedido do Pedro) — o "i" da TELA volta pro cabeçalho,
           no mesmo lugar das outras (C0-C5): os "i" de campo respondem "o
           que escrevo aqui", este responde "como isso funciona". */
        acao={
          <BotaoInfo
            onClick={() => setInfo(true)}
            rotulo={mei ? "Nome fantasia × razão social" : "Como funcionam as 3 tentativas"}
          />
        }
      />

      <main className="app-main">
        {/* 🔒 03/09 (pedido do Pedro) — O LAYOUT NOVO É SÓ DA 2ª RODADA.
            A C7 normal volta pro `Corpo`, sem espaço em branco: são telas
            diferentes, e amarrar o desenho de uma na outra foi erro meu.
            🔄 MODELO DA C2 (só aqui): conteúdo embaixo, ilustração em cima.
            🐛 A 1ª tentativa deixou a área vazia só com `flex-1` e ela
            colapsou: numa coluna dimensionada por conteúdo, quem cria altura é
            a ILUSTRAÇÃO (na C2, a imagem do cofrinho), não o `flex-1`. Por
            isso a caixa vazia precisava de `min-h`. Com a ilustração dentro
            (03/09, arte do Pedro: a mão escrevendo o 3º card), quem cria a
            altura é a imagem, e o `min-h` saiu. */}
        {novaRodada && (
          <div className="flex min-h-0 flex-1 items-center justify-center py-4">
            <div id="c7-mao-flutua" className="relative flex h-[70%] max-h-[230px] items-end">
              {/* Sombra de contato em 2 camadas, igual C2/C4/retomar: a elipse
                  curta é o apoio, o drop-shadow segue a silhueta. */}
              <div
                aria-hidden
                className="absolute -bottom-2 left-1/2 h-5 w-[72%] -translate-x-1/2 blur-md"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(27,30,36,.30), rgba(27,30,36,.10) 62%, transparent 100%)",
                }}
              />
              <Image
                src="/icones/c7-nome-mao-escrevendo.png"
                alt=""
                aria-hidden
                width={600}
                height={443}
                className="relative z-10 h-full w-auto"
                style={{ filter: "drop-shadow(6px 14px 12px rgba(27,30,36,.20))" }}
              />
            </div>

            {/* Mesma dosagem do C2/C4/retomar: 7s e 5,5s não se dividem entre
                si, então o loop não fecha sempre no mesmo ponto.
                ♿ desliga em `prefers-reduced-motion`. */}
            <style jsx global>{`
              @keyframes c7-mao-flutua-obj {
                0%   { transform: translate3d(0, 0, 0) rotate(0deg); }
                35%  { transform: translate3d(4px, -7px, 0) rotate(0.6deg); }
                70%  { transform: translate3d(-3px, -3px, 0) rotate(-0.5deg); }
                100% { transform: translate3d(0, 0, 0) rotate(0deg); }
              }
              @keyframes c7-mao-flutua-sombra {
                0%   { transform: translateX(-50%) scaleX(1); opacity: 1; }
                35%  { transform: translateX(-50%) scaleX(0.9); opacity: 0.72; }
                70%  { transform: translateX(-50%) scaleX(0.96); opacity: 0.88; }
                100% { transform: translateX(-50%) scaleX(1); opacity: 1; }
              }
              #c7-mao-flutua img {
                animation: c7-mao-flutua-obj 7s ease-in-out infinite;
                will-change: transform;
              }
              #c7-mao-flutua > div[aria-hidden] {
                animation: c7-mao-flutua-sombra 5.5s ease-in-out infinite;
                will-change: transform, opacity;
              }
              @media (prefers-reduced-motion: reduce) {
                #c7-mao-flutua img,
                #c7-mao-flutua > div[aria-hidden] {
                  animation: none;
                }
              }
            `}</style>
          </div>
        )}

        <Titulo
          sub={
            mei
              ? "No MEI o nome oficial é definido por lei. O que você escolhe é a marca que aparece pro cliente."
              : novaRodada
                ? // 🐛 03/09 (pente-fino do Pedro) — a frase envelheceu duas
                  // vezes: ela não escreve "outras 3" (escreve UMA, as 2
                  // reservas são nossas) e não "escolhe a ORDEM" (as setas
                  // saíram). Ficou só o fato, que é o que ela precisa saber.
                  "As 3 primeiras não passaram na Junta."
                : // ✍️ 03/09 (pedido do Pedro) — saiu o "A gente sugeriu 3
                  // nomes": os 3 cards logo abaixo já dizem isso. Sobra a
                  // instrução, que é o que só o subtítulo entrega.
                  "Edite o que quiser e deixe na ordem que a gente deve tentar."
          }
        >
          {mei
            ? "O nome da sua empresa"
            : novaRodada
              ? // 🐛 03/09 — "Sugira mais 3 nomes" mentia: a pessoa escreve 1.
                "Escreva outro nome"
              : "Qual nome você prefere?"}
        </Titulo>

        <BlocoDaTela>
          {/* ─── VARIANTE MEI ────────────────────────────────────────────────
              Razão social gerada (Lei 14.195/2021): não há o que escolher, e
              fingir escolha seria pior que explicar a regra. */}
          {mei && (
            <>
              <Campo
                rotulo="Razão social"
                dica="Definida por lei: os 8 primeiros dígitos do seu CNPJ + seu nome completo. Sai automático quando o CNPJ é gerado."
              >
                <div
                  className="w-full rounded-md border border-border-hairline bg-surface-alt p-3
                             text-body text-text-secondary"
                >
                  00.000.000 {CLIENTE.nome.toUpperCase()}
                </div>
              </Campo>

              {/* ✍️ 03/09 (pedido do Pedro) — a regra estava em 3 lugares
                  (este aviso, a dica do campo acima e o "i"). Aqui ficou só a
                  consequência prática, que é o que tranquiliza. */}
              <Aviso variante="info" titulo="Ninguém escolhe o nome de um MEI">
                O sistema monta a razão social sozinho, então não existe risco
                de recusa.
              </Aviso>
            </>
          )}

          {/* Sem API de disponibilidade: em vez de fingir "disponível na Junta",
              a gente é honesta sobre o que dá pra prometer — tentar em ordem.
              🆕 24/08 (pedido do Pedro) — lápis de edição por sugestão, no
              lugar do campo separado "Digite a sua". A pessoa reescreve a
              sugestão da IA direto, mantendo a seta pra reordenar prioridade.
              🆕 28/08 — daqui até o objeto social é EXCLUSIVO do ME. */}
          {!mei && (
          <div>
            {/* ═══ 🔒 03/09 (decisão do Pedro) — AS 2 RESERVAS SÃO NOSSAS E
                FICAM TRAVADAS ═══════════════════════════════════════════════
                Até hoje as 3 opções eram editáveis e reordenáveis. Virou:
                a 1ª é DELA (o nome que ela quer), a 2ª e a 3ª são nossas e
                não se editam.

                O porquê: a Junta reprova por regras que ninguém que abre a
                primeira empresa conhece (semelhança com nome já registrado no
                estado, palavra genérica demais, termo de atividade que exige
                registro em conselho). Quem escreve 3 nomes livres tende a
                escrever 3 variações da MESMA ideia — e as 3 caem juntas pelo
                mesmo motivo. Travar as 2 de baixo garante que existam
                tentativas construídas por outro critério.

                Consequência direta: SUMIRAM AS SETAS. A ordem deixou de ser
                escolha (a dela vai primeiro, as nossas seguram atrás), então
                reordenar não é mais uma pergunta desta tela. */}
            {/* 🔄 03/09 (pedido do Pedro) — O "i" SOBE PRO RÓTULO DA SEÇÃO.
                Ele morava no cabeçalho (regras da Junta) e no campo de nome
                fantasia (fantasia × razão social), e os dois assuntos são a
                MESMA conversa: o que é rígido, o que é livre, e por que a
                gente trava as reservas. Fundidos num sheet só, ancorado onde
                a dúvida nasce — a opção dela. */}
            <p className="text-caption font-semibold text-text-primary mb-1">
              {novaRodada
                ? "Sua opção, e as nossas 2 reservas"
                : "Sua opção, e as nossas 2 de reserva"}
            </p>

            {/* Nota fina, não bloco: a tela acabou de perder um `Aviso` por
                peso, e esta explicação não pode virar o próximo.
                ⚠️ Sem taxa de aprovação inventada ("nossas passam mais", "90%
                aprovadas"): o produto não está no ar, o número não existe, e
                número sem fonte não entra. O argumento honesto é o COMO. */}
            <p className="text-micro text-text-tertiary mb-2.5">
              {novaRodada
                ? // ✍️ 03/09 — rótulo e nota diziam a mesma coisa, e "novas"
                  // aparecia 3 vezes na mesma dobra. Sobra o que só a nota
                  // entrega: elas não repetem o que já foi recusado.
                  "Nenhuma delas já foi tentada."
                : "As duas de baixo não mudam: são nossas, feitas pra passar nos critérios da Junta se a sua não passar."}
            </p>

            <div className="flex flex-col gap-2">
              {ordem.map((s, i) => {
                /* 🔒 A 1ª é dela; 2ª e 3ª são reservas nossas, travadas —
                   regra igual nas duas rodadas (03/09, pedido do Pedro). Na
                   2ª o que muda é o LOTE das reservas, que não repete o que a
                   Junta já recusou. */
                const travado = i > 0;

                if (travado) {
                  return (
                    /* Mesmo desenho de "isto não se edita" que o dossiê já
                       usa (CPF travado na C1, cartões de confirmação da C4):
                       fundo `surface-alt`, texto terciário, sem borda de
                       campo. 🔒 Sem a palavra "travado" — decisão do Pedro na
                       C4: o cinza já diz isso. */
                    <div
                      key={s.id}
                      className="flex min-h-12 items-start gap-2.5 rounded-md border border-border-hairline bg-surface-alt px-3 py-2.5"
                    >
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-card text-caption font-bold text-text-tertiary">
                        {i + 1}º
                      </span>
                      {/* 🐛 03/09 (pedido do Pedro) — era `truncate`: nome
                          comprido virava "Vértice Desenvolvimen…", justo o
                          que a pessoa precisa ler pra decidir. Agora quebra
                          linha e aparece inteiro. */}
                      <span className="min-w-0 flex-1 break-words py-1 text-caption font-semibold leading-snug text-text-tertiary">
                        {s.valor}
                      </span>
                      <IconeCadeado />
                    </div>
                  );
                }

                return (
                  /* 🔄 03/09 (pedido do Pedro) — A LINHA É O CAMPO COMUM DO
                     APP. Antes tinha padding e tipografia próprios; agora usa
                     exatamente o desenho do `Texto` do DS (min-h-12,
                     rounded-md, border hairline, px-3, `text-body`, borda de
                     foco), e a ÚNICA diferença é o ordinal morando dentro
                     dele. O contador saiu de dentro do campo e virou linha
                     abaixo, no lugar onde o DS já põe erro e confirmação. */
                  <div key={s.id}>
                    <div
                      className="flex min-h-12 items-start gap-2.5 rounded-md border border-border-hairline
                                 bg-surface-card px-3 transition-colors focus-within:border-border-focus"
                    >
                      {/* Coral cheio na 1ª: mesma linguagem de "esta é a
                          escolhida" do gate e da C0. Ordinal, não número
                          solto: aqui é posição, não quantidade. */}
                      <span
                        className={`mt-2.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-caption font-bold ${
                          i === 0
                            ? "bg-action-primary text-text-on-brand"
                            : "bg-surface-tint-brand text-action-primary-sm"
                        }`}
                      >
                        {i + 1}º
                      </span>

                      <CampoNomeAberto
                        valor={s.valor}
                        onChange={(v) => editarValor(s.id, v)}
                        autoFocus={novaRodada && i === 0}
                        rotulo={`Nome da ${i + 1}ª opção`}
                        placeholder="Veja algumas regras no “i” ao lado"
                        limite={LIMITE_RAZAO}
                      />

                      {/* O "i" mora DENTRO do campo: a dúvida "que nome eu
                          escrevo aqui?" nasce na hora de digitar. Alinhado
                          pelo topo, junto do ordinal, pra não dançar quando o
                          nome ocupa 2 linhas. */}
                      <div className="mt-3 shrink-0">
                        <BotaoInfo
                          onClick={() => setInfoRegras(true)}
                          rotulo="Dicas pra escolher o nome"
                        />
                      </div>
                    </div>

                    {/* Contador só quando aperta (últimos 10 caracteres): a
                        tela é de escrever nome curto, e um "0/50" fixo em
                        cada linha seria ruído no caso comum. */}
                    {s.valor.length >= LIMITE_RAZAO - 10 && (
                      <p
                        className={`mt-1 text-right text-micro font-semibold ${
                          s.valor.length >= LIMITE_RAZAO
                            ? "text-state-warning-text"
                            : "text-text-tertiary"
                        }`}
                      >
                        {s.valor.length}/{LIMITE_RAZAO}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          )}

          {/* ✍️ 29/07 — o título dizia "A ordem não muda nada na abertura",
              logo abaixo de um subtítulo que pede pra ORDENAR. Lidos em
              sequência, o segundo esvaziava o primeiro. */}
          {/* 🔄 01/09 — some na 2ª rodada: dizer "nenhuma tentativa atrasa"
              pra quem acabou de ter as 3 recusadas seria desmentir o que ela
              acabou de viver. */}
          {/* 🗑️ 03/09 (pedido do Pedro) — O AVISO "nenhuma tentativa atrasa"
              SAIU DA TELA. Foi reduzido a 1 linha nesta mesma sessão e ainda
              assim não se pagava: era o maior bloco de cor de uma tela cuja
              única tarefa é escolher 3 nomes, respondendo uma pergunta que a
              pessoa nem fez ainda. A informação continua viva no "i" do
              cabeçalho, que é o lugar de quem foi atrás dela. */}

          {/* 🔄 03/09 (pedido do Pedro) — ORDEM TROCADA: nome fantasia sobe
              pra logo abaixo dos nomes empresariais (os dois são "como sua
              empresa se chama", e ler os dois seguidos é o que a pessoa faz
              de cabeça), e o objeto social desce pro fim — ele é recibo do
              que já foi decidido nas atividades, não decisão desta tela. */}
          {/* Nome fantasia vale pros DOIS regimes — é o único campo de nome
              que o formulário do MEI realmente oferece. */}
          {/* 🆕 03/09 (pedido do Pedro) — "i" DE CAMPO, mesmo padrão do
              índice cadastral na C4: fantasia × razão social é dúvida deste
              campo, não da tela, e no ME o "i" do cabeçalho fala de outra
              coisa (como a Junta avalia o nome). */}
          {!novaRodada && (
            <Campo
              rotulo="Nome fantasia"
              /* ✍️ 03/09 (pedido do Pedro) — depois de travar 2 das 3 razões
                 sociais, este campo é o contrapeso: aqui a pessoa é livre, e
                 a dica diz isso em vez de só definir o que é. */
              dica="Opcional e livre: é a marca que o cliente vê."
            >
              <Texto
                valor={fantasia}
                onChange={setFantasia}
                acao={
                  <BotaoInfo
                    onClick={() => setInfoFantasia(true)}
                    rotulo="As regras do nome fantasia"
                  />
                }
                /* ✍️ 03/09 (pedido do Pedro) — o placeholder repetia a dica
                   ("marca que o cliente vê" × "como o público vai te
                   conhecer"). Virou exemplo, que é o que falta ali. */
                placeholder="Ex.: Vértice Studio"
              />
            </Campo>
          )}
          {/* 🔄 01/09 (pedido do Pedro) — na 2ª rodada a tela é SÓ os 3 nomes:
              objeto social já foi definido e não muda por causa de um nome
              recusado. (A 1ª tentativa de gate pegou o bloco errado — este é
              o que de fato renderiza.) */}
          {!mei && !novaRodada && (
          <Campo
            rotulo="Objeto social"
            /* ✍️ 03/09 (pedido do Pedro) — a 2ª frase era justificativa
               NOSSA ("assim evitamos erro de grafia"), não informação que
               muda a decisão dela: o campo está travado de qualquer jeito. */
            dica="Gerado a partir das suas atividades. Vai assim no contrato."
          >
            {/* 🔄 03/09 (pedido do Pedro) — era um bloco cinza próprio desta
                tela. Virou `CardNota`, que é o componente que o dossiê já usa
                pra dizer "isto é recibo, não campo" (endereço achado pelo CEP
                na C1/C3, confirmação da C4). Mesma função, um desenho só. */}
            <CardNota>{objeto}</CardNota>
          </Campo>
          )}

        </BlocoDaTela>

        {/* 🔄 03/09 (pedido do Pedro) — SHEET FUNDIDO. Eram dois ("como a
            Junta avalia o nome", no cabeçalho, e "o que é nome fantasia", no
            campo), e os dois respondiam a mesma pergunta por metades: onde a
            regra aperta e onde ela não existe. Junto, o texto fecha o
            raciocínio — inclusive o porquê de travarmos as 2 reservas. */}
        {infoFantasia && (
          <SheetInfo
            titulo="As regras do nome fantasia"
            onFechar={() => setInfoFantasia(false)}
            pontos={[
              "Aqui não tem regra de Junta: o nome fantasia é livre, você escreve o que quiser.",
              "Ele é a marca que o cliente vê (fachada, site, Instagram) e pode ser bem diferente da razão social.",
              "Pode ficar em branco. Nesse caso, a empresa se apresenta pela razão social mesmo.",
              "Dá pra trocar depois sem mexer no seu CNPJ.",
              "Fantasia não é marca registrada: exclusividade sobre o nome é registro no INPI, que é outro processo.",
            ]}
          />
        )}

        {infoRegras && (
          <SheetInfo
            titulo="Dicas pra escolher o nome"
            onFechar={() => setInfoRegras(false)}
            pontos={[
              "A Junta compara seu nome com o que já está registrado em Minas Gerais. Idêntico ou parecido demais com outro do mesmo ramo é reprovado.",
              "Nome genérico, feito só de palavras comuns da atividade, costuma travar: ele não distingue sua empresa de nenhuma outra.",
              "Uma palavra própria (inventada, seu sobrenome, uma referência sua) mais a atividade é a combinação que passa com mais facilidade.",
              "Não entram termos que sugerem órgão público, nem palavras de atividade que você não exerce (banco, seguros, engenharia sem registro no conselho).",
              "Cabem 50 caracteres: o registro aceita 60 e a gente completa com o tipo da empresa no fim.",
            ]}
            exemplo={{
              titulo: "Na prática",
              bom: "“Vértice Studio de Design”. Tem palavra própria e diz o que a empresa faz.",
              ruim: "“Design e Publicidade”. É o que dezenas de empresas já registraram, e a Junta bate como parecido demais.",
            }}
          />
        )}

        {info && (
          <SheetInfo
            titulo={mei ? "Nome fantasia × razão social" : "Como funcionam as 3 tentativas"}
            onFechar={() => setInfo(false)}
            pontos={
              mei
                ? [
                    "A razão social é o nome oficial da empresa, o que aparece em contrato e em nota. No MEI ela é definida por lei: seu nome completo + os 8 primeiros dígitos do CNPJ.",
                    "O nome fantasia é a marca: é o que você usa na fachada, no Instagram e o que o cliente chama.",
                    "Você escolhe o fantasia livremente, e ele pode mudar depois sem mexer no CNPJ.",
                    "Nome fantasia não é marca registrada. Se quiser exclusividade sobre ele, o caminho é o registro no INPI, que é outro processo.",
                  ]
                : [
                    "A razão social é o nome oficial: vai no contrato, na nota fiscal e nos órgãos. É nela que a Junta é rígida.",
                    "A 2ª e a 3ª são nossas e ficam travadas: quem escreve 3 nomes livres costuma escrever 3 versões da mesma ideia, e aí os 3 caem pelo mesmo motivo. As nossas nascem de outro critério, pra segurar o processo.",
                    "A gente tenta a sua primeiro. Se não passar, seguimos pras nossas duas. Se as 3 caírem, você escreve outras e a gente manda de novo, sem custo e sem atrasar a abertura.",
                  ]
            }
          />
        )}

        <Rodape>
          {/* Última tela da coleta: daqui o cliente vai pro N19 (revisar).
              🔄 01/09 (pedido do Pedro) — na 2ª rodada o CTA nomeia o que
              acontece de verdade: os nomes voltam pra Junta, não pro dossiê. */}
          <Button full disabled={!completo} onClick={onSeguir}>
            {novaRodada ? "Mandar para a viabilidade" : "Continuar"}
          </Button>
        </Rodape>
      </main>
    </>
  );
}

/* ═══════════════════ HELPERS DE NOME (C3) ══════════════════════════════ */

/** "Carlos Eduardo Silva" → "Carlos". Nome inteiro em caixinha vira parede. */
function primeiroNome(nome: string): string {
  return nome.trim().split(/\s+/)[0] ?? "";
}

/** ["Ana"] → "Ana" · ["Ana","Léo"] → "Ana e Léo" · 3+ → "Ana, Léo e Bia". */
function listar(nomes: string[]): string {
  if (nomes.length <= 1) return nomes[0] ?? "";
  return `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}`;
}

function ChevronResumo() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0 text-text-on-brand/80"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/**
 * ═══ SHEET DAS SECUNDÁRIAS — conferir e tirar, sem sair da tela. 02/09 ══
 *
 * 🆕 Ideia do Pedro. O cartão-resumo da C5 abre aqui: a lista inteira do que
 * foi escolhido, com o toque tirando item. Mesmo bottom-sheet do DS
 * (`EnviarSheet` · `SheetNaoReembolsavel` · `SheetCnae`).
 *
 * ⚠️ Trabalha em RASCUNHO: desmarcar aqui não mexe na tela até salvar. É o
 * que faz o botão poder dizer "Salvar" com honestidade, e o que permite abrir
 * só pra conferir e fechar sem consequência. Sem mudança nenhuma, o botão
 * nem promete salvamento: vira "Fechar".
 */
function SheetSecundarias({
  itens,
  rascunho,
  setRascunho,
  original,
  onSalvar,
  onFechar,
}: {
  itens: Sugestao[];
  rascunho: Record<string, boolean>;
  setRascunho: (v: Record<string, boolean>) => void;
  original: Record<string, boolean>;
  onSalvar: (novo: Record<string, boolean>) => void;
  onFechar: () => void;
}) {
  const [entrou, setEntrou] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntrou(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const sair = () => {
    setEntrou(false);
    window.setTimeout(onFechar, 240);
  };

  const marcados = (r: Record<string, boolean>) =>
    Object.entries(r)
      .filter(([, v]) => v)
      .map(([id]) => id)
      .sort()
      .join(",");
  const mudou = marcados(rascunho) !== marcados(original);
  const lista = itens.filter((s) => original[s.id]);

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
        aria-label="Atividades secundárias escolhidas"
        className="absolute inset-x-0 bottom-0 flex max-h-[86%] flex-col rounded-t-3xl bg-surface-page px-5"
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

        <p className="mt-4 shrink-0 text-body-strong font-semibold text-text-primary">
          Atividades secundárias
        </p>

        <div className="mt-3 min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-2">
            {lista.map((s) => {
              const on = !!rascunho[s.id];
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setRascunho({ ...rascunho, [s.id]: !on })}
                  /* 🔄 02/09 (pedido do Pedro) — MESMO LAYOUT DA LISTA: o
                     cartão não pinta, quem marca é o check coral. O sheet
                     usava coral cheio e ficava sendo outro vocabulário pro
                     mesmo estado, na mesma tela. */
                  className={`flex items-center justify-between gap-3 rounded-md border p-3 text-left transition-colors ${
                    on ? "border-action-primary bg-surface-card" : "border-border-hairline bg-surface-card"
                  }`}
                >
                  <span className="min-w-0">
                    {/* Riscado em vez de sumir: sumindo, a pessoa perderia a
                        chance de voltar atrás antes de atualizar. */}
                    <span
                      className={`block text-body font-semibold ${
                        on ? "text-text-primary" : "text-text-tertiary line-through"
                      }`}
                    >
                      {s.humano}
                    </span>
                    <span className="block text-caption text-text-secondary">
                      CNAE {s.cnae}
                    </span>
                  </span>
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      on
                        ? "bg-action-primary text-text-on-brand"
                        : "border border-border-strong text-text-tertiary"
                    }`}
                    aria-hidden
                  >
                    {on ? <CheckMarcado /> : <MaisMarcador />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 shrink-0">
          {mudou ? (
            <Button full onClick={() => onSalvar(rascunho)}>
              {/* 🔄 02/09 (pedido do Pedro) — "Atualizar", não "Salvar":
                  salvar sugere guardar algo novo, e aqui a pessoa está
                  MEXENDO numa lista que já existe. Mesmo verbo do
                  "Atualizar dados" do modo ajuste. */}
              Atualizar
            </Button>
          ) : (
            <Button full variant="secondary" onClick={sair}>
              Fechar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 🆕 02/09 (pedido do Pedro) — o marcador dos cartões de seleção usa o MESMO
 * check dos cartões de regime e de faixa (`CheckBadgeFaixa`, gate-telas): o
 * traço vetorial, não o caractere "✓", que vinha com o desenho e o peso da
 * fonte e destoava do resto do app.
 */
function CheckMarcado() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m5 12 4 4 8-9" />
    </svg>
  );
}

/** O par vazio: convida a incluir, com o mesmo traço do check. */
function MaisMarcador() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

/** O mesmo check do selo verde usado no E9. */
function CheckMiniDossie() {
  return (
    <svg
      width="12"
      height="12"
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

/**
 * 🆕 03/09 (ideia do Pedro) — sheet do "i" da administração. Mesmo
 * bottom-sheet do DS (EnviarSheet · SheetNaoReembolsavel · SheetCnae ·
 * SheetSecundarias) e a MESMA lista de checks do card de regime em
 * `MeiOuMeView` (gate-telas.tsx) — título + check verde + texto, um item por
 * responsabilidade. É a explicação que saiu do card de fora, agora com
 * espaço pra falar dos DOIS papéis, não só de quem administra.
 */
/**
 * 🆕 03/09 (pedido do Pedro) — o "i" do cabeçalho da C4.
 *
 * Responde a dúvida que a tela levanta e não respondia: **por que o endereço
 * aparece travado** (foi o que já rodou a viabilidade na Prefeitura, trocar
 * aqui divergiria do que foi analisado) e **por que a gente pede o IPTU**
 * (é o que prova o endereço na Junta). O tom é de tranquilizar: nada aqui é
 * cobrança de documento raro, e quem trava tem WhatsApp no rodapé.
 */
function SheetEnderecoEmpresa({ mei, onFechar }: { mei: boolean; onFechar: () => void }) {
  return (
    <SheetInfo
      titulo="Por que a gente pede isso"
      onFechar={onFechar}
      pontos={
        mei
          ? [
              "O endereço já foi confirmado no começo, por isso aparece travado aqui: é ele que vale pro seu CNPJ.",
              "A forma de atendimento é o mesmo campo que o Portal do Empreendedor pede. Pode marcar mais de uma.",
              "Precisa mudar alguma coisa do endereço? Chama a gente no WhatsApp, aqui embaixo, que a gente ajusta.",
            ]
          : [
              "O endereço aparece travado porque foi com ele que a gente consultou a viabilidade na Prefeitura. Trocar agora divergiria do que já foi analisado.",
              "O índice cadastral do IPTU é o que prova esse endereço na Junta. Sem ele, o registro não anda.",
              "Nada aqui vira conta nova: é o mesmo imóvel, só identificado do jeito que os órgãos pedem.",
              "Precisa trocar o endereço? Chama a gente no WhatsApp, aqui embaixo.",
            ]
      }
    />
  );
}

function SheetAdministracao({ onFechar }: { onFechar: () => void }) {
  return (
    <SheetInfo
      titulo="Administrar × ser só sócio"
      onFechar={onFechar}
      pontos={[
        "O administrador assina pela empresa no dia a dia: abrir conta em banco, transferir um veículo, assinar em cartório.",
        "Quem não administra continua sócio, com os mesmos direitos sobre os resultados, só não assina pela empresa.",
        "Atos grandes (vender ou dar em garantia um imóvel da empresa, por exemplo) precisam da assinatura de todos os administradores, não só de quem cadastrou.",
        "Alguns bancos pedem a assinatura de todos os administradores pra abrir a conta.",
      ]}
    />
  );
}
