"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { Campo, Texto, Select, OpcoesLinha } from "@/components/ui/form";
// 🗑️ 01/09 — `CUSTOS` saiu junto do upsell de endereço fiscal do C4: a única
// coisa que lia preço aqui era aquele card, e ele deixou de existir.
import { FISCAL, brl } from "@/lib/fiscal";
import { FORMAS_ATUACAO } from "@/lib/mei";
// 🆕 01/09 — mesma máscara do E6, pro CPF do sócio extra (C3).
import { mascaraCpf } from "@/components/wizard-dinheiro";
import { OutrasOpcoes, SheetCnae, type OpcaoCnae } from "@/components/encaixe";
import {
  CLIENTE,
  TEM_SOCIO,
  SOCIO_2,
  SOCIOS,
  NOME_EMPRESARIAL,
  CNAE_PRINCIPAL,
  CNAES_SECUNDARIAS,
  PREENCHIMENTO,
} from "@/app/(app)/dossie/mock";

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
const ESTADO_CIVIL = [
  { v: "solteiro", label: "Solteiro(a)" },
  { v: "casado", label: "Casado(a)" },
  { v: "uniao", label: "União estável" },
  { v: "divorciado", label: "Divorciado(a)" },
  { v: "viuvo", label: "Viúvo(a)" },
];

const REGIME_BENS = [
  { v: "parcial", label: "Comunhão parcial de bens" },
  { v: "universal", label: "Comunhão universal de bens" },
  { v: "separacao", label: "Separação total de bens" },
  { v: "final", label: "Participação final nos aquestos" },
];

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
      <TelaHeader meta="Seus dados" onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo sub="Confira o que você já preencheu e complete o resto.">
          Seus dados
        </Titulo>

        <Corpo>
          {/* CONFIRMAÇÃO — já veio do N6, só conferir. "Editar" mock, mesmo
              padrão do N19. */}
          <Card>
            <div className="mb-2 flex items-center justify-between gap-3">
              <h2 className="text-body font-semibold text-text-primary">
                Já preenchido no cadastro
              </h2>
              <button
                className="shrink-0 text-caption font-semibold text-action-primary-sm underline underline-offset-4"
                aria-label="Editar dados do cadastro"
              >
                Editar
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              <LinhaConfirma rotulo="Nome" valor={CLIENTE.nome} />
              <LinhaConfirma rotulo="CPF" valor={CLIENTE.cpf} />
              <LinhaConfirma rotulo="Telefone" valor={CLIENTE.telefone} />
              {/* 🗑️ 01/09 — "Endereço" saiu do card de confirmação: o cadastro
                  (E6) não coleta mais endereço nenhum. Ele agora é PERGUNTADO
                  aqui embaixo, com o rótulo dizendo de quem é. */}
            </div>
          </Card>

          {/* O QUE FALTA — só o que o N6 não pergunta. */}
          <div className="grid grid-cols-2 gap-3">
            <Campo rotulo="RG">
              <Texto valor={rg} onChange={setRg} placeholder="00.000.000" />
            </Campo>
            <Campo rotulo="Órgão emissor">
              <Texto valor={orgao} onChange={setOrgao} placeholder="SSP/MG" />
            </Campo>
          </div>

          {/* 🆕 26/08 (achado do cruzamento com a pesquisa JUCEMG/DBE) — data
              de nascimento e nome da mãe são campo padrão do DBE (Receita
              Federal) e não existiam em nenhuma tela do dossiê. */}
          <div className="grid grid-cols-2 gap-3">
            <Campo rotulo="Data de nascimento">
              <Texto
                valor={nascimento}
                onChange={setNascimento}
                placeholder="DD/MM/AAAA"
                inputMode="numeric"
                maxLength={10}
              />
            </Campo>
            {/* 🆕 01/09 — mesma dupla do card do sócio extra (nascimento +
                nacionalidade lado a lado), agora também pro titular. */}
            <Campo rotulo="Nacionalidade">
              <Texto
                valor={nacionalidade}
                onChange={setNacionalidade}
                placeholder="Brasileira"
              />
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
            dica="Seu endereço pessoal, não o da empresa. A gente puxa o resto pelo CEP."
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
              <div className="-mt-1 rounded-md border border-border-hairline bg-surface-alt px-3 py-2.5 text-caption text-text-secondary">
                {enderecoPessoal.logradouro}, {enderecoPessoal.bairro} —{" "}
                {enderecoPessoal.municipio}/{enderecoPessoal.uf}
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

        <Rodape>
          <Button full disabled={!completo} onClick={onSeguir}>
            {ctaLabel ?? "Continuar"}
          </Button>
        </Rodape>
      </main>
    </>
  );
}

function LinhaConfirma({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-micro text-text-tertiary">{rotulo}</span>
      <span className="text-caption text-text-primary">{valor}</span>
    </div>
  );
}

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
      <TelaHeader meta="Como você já contribui" onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo sub="Isso muda quanto de imposto a empresa paga. Vale a pena acertar.">
          Você já contribui pro INSS por fora?
        </Titulo>

        <Corpo>
          <Campo
            rotulo="Já recolhe INSS hoje?"
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

          {/* UX-27: reenquadra o pró-labore como ganho, não só "não pode ser CLT". */}
          <Aviso variante="info" titulo="Como você se paga na sua empresa">
            Na sua própria empresa você não entra como CLT: você se paga por
            pró-labore. E ele conta a favor: recolhe INSS que soma pra sua
            aposentadoria e dá direito aos benefícios do INSS.
          </Aviso>

          <p className="text-micro text-text-tertiary">
            A gente não consulta o vínculo de ninguém sozinho. Você declara, e
            isso fica protegido.
          </p>
        </Corpo>

        <Rodape>
          <Button full disabled={!completo} onClick={onSeguir}>
            {ctaLabel ?? "Continuar"}
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
              ? { ...socioExtraPreenchido(), participacao: Math.round((100 / (qtdExtras + 1)) * 2) / 2 }
              : novoSocioExtra("", Math.round((100 / (qtdExtras + 1)) * 2) / 2),
          );

  const [extras, setExtras] = useState<SocioExtra[]>(inicial);

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
    const alvoExtras = Math.max(0, Math.min(99.5, 100 - novoParte1));
    setExtras((atual) => {
      if (atual.length === 0) return atual;
      const somaAtual = atual.reduce((acc, s) => acc + s.participacao, 0);
      if (somaAtual <= 0) {
        const cada = Math.round((alvoExtras / atual.length) * 2) / 2;
        return atual.map((s) => ({ ...s, participacao: cada }));
      }
      const fator = alvoExtras / somaAtual;
      return atual.map((s) => ({
        ...s,
        participacao: Math.round(s.participacao * fator * 2) / 2,
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
  const qualificacaoOk = extras.every(
    (s) =>
      s.cpf.replace(/\D/g, "").length === 11 &&
      s.nascimento.trim() !== "" &&
      s.nacionalidade.trim() !== "" &&
      s.rg.trim() !== "" &&
      s.orgao.trim() !== "" &&
      s.civil !== "" &&
      (s.civil !== "casado" || s.regime !== "") &&
      s.cep.replace(/\D/g, "").length === 8 &&
      s.numero.trim() !== "",
  );
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

  function atualizar(id: string, patch: Partial<SocioExtra>) {
    setExtras((atual) => atual.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  return (
    <>
      {/* Mesmo alinhamento do N10: o cliente lê "Sócios" na lista de passos
          (P1/P2), então é isso que a tela precisa dizer. */}
      <TelaHeader meta="Sócios" onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo
          sub={
            contexto === "migrar"
              ? TEM_SOCIO
                ? "Pra fazer a procuração e a transferência, a gente precisa dos dados de todos os sócios da empresa."
                : "Confirma: sua empresa é só sua, sem outros sócios?"
              : TEM_SOCIO
                ? "Você disse que teria sócio. Complete os dados dele."
                : "Você disse que abriria sozinho. É só confirmar."
          }
        >
          {contexto === "migrar"
            ? TEM_SOCIO
              ? "Sua empresa tem sócio"
              : "Empresa só sua"
            : TEM_SOCIO
              ? "Seu sócio"
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
              <p className="text-micro text-text-tertiary">
                Os outros dados de cada sócio a gente coleta igual aos seus, na
                sequência.
              </p>

              {/* 🆕 26/08 (pedido do Pedro) — card travado do 1º sócio (você),
                  em TODAS as telas de sócios: mostra que você já É um sócio
                  (não uma pergunta em aberto). Nome sem edição, mesmo padrão
                  do card read-only "Já preenchido no cadastro" do `SocioView`.
                  🆕 31/08 (pedido do Pedro) — % agora é EDITÁVEL aqui também:
                  mudar a sua % redistribui os sócios extras proporcionalmente
                  (e mudar a de um extra já recalculava a sua, como sempre) —
                  o vínculo passou a valer nos dois sentidos. */}
              <div className="flex flex-col gap-3 rounded-md border border-border-hairline bg-surface-alt p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-caption font-semibold text-text-primary">1º sócio</span>
                  <span className="rounded-full bg-surface-card px-2 py-0.5 text-micro font-semibold text-text-tertiary">
                    Você
                  </span>
                </div>
                <span className="text-body text-text-primary">{CLIENTE.nome}</span>

                <Campo rotulo="Sua participação">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      inputMode="decimal"
                      step={0.5}
                      min={0.5}
                      max={99.5}
                      value={parte1 || ""}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === "") return;
                        const n = Number(raw);
                        if (Number.isNaN(n)) return;
                        const preso = Math.min(99.5, Math.max(0.5, n));
                        onChangeParte1(Math.round(preso * 2) / 2);
                      }}
                      aria-label="Sua participação, em porcentagem"
                      className="w-full min-h-12 rounded-md border border-border-hairline bg-surface-card px-3
                                 text-body text-text-primary focus:border-border-focus focus:outline-none"
                    />
                    <span className="shrink-0 text-body font-semibold text-text-secondary">%</span>
                  </div>
                </Campo>
              </div>

              <div className="flex flex-col gap-3">
                {extras.map((s, i) => (
                  <div
                    key={s.id}
                    className="flex flex-col gap-3 rounded-md border border-border-hairline bg-surface-card p-3"
                  >
                    <span className="text-caption font-semibold text-text-primary">
                      {i + 2}º sócio
                    </span>

                    <Campo rotulo="Nome completo">
                      <Texto
                        valor={s.nome}
                        onChange={(v) => atualizar(s.id, { nome: v })}
                        placeholder="Como está no documento dele"
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
                    <Campo rotulo="CPF dele">
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

                    <Campo
                      rotulo="Participação dele"
                      dica="De 0,5 em 0,5%. A soma de todos os sócios extras não pode chegar a 100%."
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          inputMode="decimal"
                          step={0.5}
                          min={0.5}
                          max={99.5}
                          value={s.participacao || ""}
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (raw === "") {
                              atualizar(s.id, { participacao: 0 });
                              return;
                            }
                            const n = Number(raw);
                            if (Number.isNaN(n)) return;
                            const preso = Math.min(99.5, Math.max(0, n));
                            atualizar(s.id, { participacao: Math.round(preso * 2) / 2 });
                          }}
                          aria-label={`Participação do ${i + 2}º sócio, em porcentagem`}
                          className="w-full min-h-12 rounded-md border border-border-hairline bg-surface-card px-3
                                     text-body text-text-primary focus:border-border-focus focus:outline-none"
                        />
                        <span className="shrink-0 text-body font-semibold text-text-secondary">%</span>
                      </div>
                    </Campo>

                    {/* 🆕 31/08 — mesma qualificação exigida do titular (C1):
                        a JUCEMG/DBE não distingue "quem cadastrou" de "quem é
                        sócio". Profissão fica de fora, preenchida internamente
                        como "Empresário" pra todo mundo. */}
                    <div className="grid grid-cols-2 gap-3">
                      <Campo rotulo="Data de nascimento">
                        <Texto
                          valor={s.nascimento}
                          onChange={(v) => atualizar(s.id, { nascimento: v })}
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
                    <Campo rotulo="CEP dele" dica="A gente puxa o resto do endereço.">
                      <Texto
                        valor={s.cep}
                        onChange={(v) => atualizar(s.id, { cep: mascaraCep(v) })}
                        placeholder="00000-000"
                        inputMode="numeric"
                      />
                    </Campo>

                    {buscarCep(s.cep.replace(/\D/g, "")) && (
                      <>
                        <div className="-mt-1 rounded-md border border-border-hairline bg-surface-alt px-3 py-2.5 text-caption text-text-secondary">
                          {(() => {
                            const e = buscarCep(s.cep.replace(/\D/g, ""))!;
                            return `${e.logradouro}, ${e.bairro} — ${e.municipio}/${e.uf}`;
                          })()}
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
                  </div>
                ))}
              </div>

              <div className="rounded-md border border-border-hairline bg-surface-alt p-3">
                <p className="text-caption font-semibold text-text-primary mb-1.5">
                  Como fica a divisão da empresa
                </p>
                <div className="flex flex-col gap-1">
                  <span className="text-caption text-text-primary">
                    Você: {parte1}%
                  </span>
                  {extras.map((s, i) => (
                    <span key={s.id} className="text-caption text-text-primary">
                      {s.nome.trim().split(/\s+/)[0] || `${i + 2}º sócio`}: {s.participacao}%
                    </span>
                  ))}
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
                <Card>
                  <p className="text-body font-semibold text-text-primary">
                    Quem vai administrar a empresa?
                  </p>
                  <p className="text-caption text-text-secondary mt-1 mb-3">
                    Administrar é assinar pela empresa no dia a dia: abrir conta
                    em banco, transferir um veículo, assinar em cartório. Quem
                    não administra continua sócio e continua participando dos
                    resultados.
                  </p>

                  {/* ─── 1 SÓCIO: pergunta binária, no singular ────────────
                      Com um sócio só não há o que escolher além de sim/não, e
                      o nome dele cabe no próprio botão — "Eu e o Carlos" diz
                      mais que "Eu e sócio(s)". */}
                  {extras.length === 1 && (
                    <OpcoesLinha
                      opcoes={[
                        { v: "so-eu" as const, label: "Só eu" },
                        {
                          v: "com-socios" as const,
                          label: `Eu e ${primeiroNome(extras[0].nome) || "meu sócio"}`,
                        },
                      ]}
                      valor={administracao}
                      onChange={(v) => {
                        setAdministracao(v);
                        setAdmins(v === "com-socios" ? [extras[0].id] : []);
                      }}
                    />
                  )}

                  {/* ─── 2+ SÓCIOS: lista com os NOMES, marca quem administra ─
                      🔄 01/09 (pedido do Pedro) — aqui a pergunta binária não
                      serve: dá pra ter sócio que administra e sócio que é só
                      sócio, e a pessoa precisa escolher QUEM, nome a nome. Sem
                      passo intermediário: a lista já é a resposta.

                      O titular aparece na lista, travado e marcado, porque ele
                      É um administrador — some daqui e a lista mente sobre quem
                      vai assinar pela empresa. */}
                  {extras.length > 1 && (
                    <div className="flex flex-col gap-2">
                      <div
                        className="flex min-h-12 items-center gap-3 rounded-md border border-border-hairline
                                   bg-surface-alt p-3"
                      >
                        <span
                          aria-hidden
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2
                                     border-action-primary bg-action-primary text-text-on-brand"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </span>
                        <span className="text-caption text-text-primary">
                          {primeiroNome(CLIENTE.nome)}
                        </span>
                        <span className="ml-auto shrink-0 rounded-full bg-surface-card px-2 py-0.5 text-micro font-semibold text-text-tertiary">
                          Você
                        </span>
                      </div>

                      {extras.map((s, i) => {
                        const marcado = admins.includes(s.id);
                        return (
                          <label
                            key={s.id}
                            className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-md border p-3
                                        transition-colors ${
                                          marcado
                                            ? "border-action-primary bg-surface-tint-brand"
                                            : "border-border-hairline bg-surface-card"
                                        }`}
                          >
                            <input
                              type="checkbox"
                              checked={marcado}
                              onChange={() => {
                                setAdmins((atual) =>
                                  marcado ? atual.filter((id) => id !== s.id) : [...atual, s.id],
                                );
                                // A lista É a resposta: qualquer toque conta
                                // como pergunta respondida (inclusive
                                // desmarcar todos, que significa "só eu").
                                setAdministracao("lista");
                              }}
                              className="h-5 w-5 shrink-0 accent-[var(--color-action-primary)]"
                            />
                            <span className="text-caption text-text-primary">
                              {s.nome.trim() || `${i + 2}º sócio`}
                            </span>
                          </label>
                        );
                      })}

                      {/* Devolve a leitura da lista em 1 linha. Marcar caixinha
                          é fácil; entender o que o conjunto delas significa,
                          não — e é o conjunto que vai pro contrato. */}
                      <p className="text-micro text-text-tertiary">
                        {admins.length === 0
                          ? "Do jeito que está: só você administra."
                          : `Vão administrar: você e ${listar(
                              extras
                                .filter((s) => admins.includes(s.id))
                                .map((s, i) => primeiroNome(s.nome) || `${i + 2}º sócio`),
                            )}.`}
                      </p>
                    </div>
                  )}

                  {/* A consequência prática, na hora da escolha — e só a da
                      opção escolhida. Explicar as duas ao mesmo tempo era o
                      caminho pra transformar 1 pergunta em aula de direito
                      societário, que foi exatamente o risco levantado. */}
                  {admins.length === 0 && (extras.length > 1 || administracao !== null) && (
                    <p className="text-micro text-text-tertiary mt-3">
                      Você resolve tudo sozinho, sem depender da assinatura de
                      ninguém. Seus sócios não assinam pela empresa.
                    </p>
                  )}
                  {admins.length > 0 && (
                    <p className="text-micro text-text-tertiary mt-3">
                      Cada administrador pode assinar sozinho o dia a dia da
                      empresa. Só atos grandes (vender ou dar em garantia um
                      imóvel da empresa, por exemplo) precisam da assinatura de
                      todos. Alguns bancos pedem todos os administradores pra
                      abrir a conta.
                    </p>
                  )}
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

        <Rodape>
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
const TIPO_IMOVEL = [
  { v: "casa", label: "Casa" },
  { v: "apartamento", label: "Apartamento" },
  { v: "outro", label: "Outro" },
];

function mascaraCep(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.replace(/(\d{5})(\d)/, "$1-$2");
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

export function EmpresaView({
  preencher,
  onSeguir,
  onVoltar,
  mei = false,
  enderecoProprio,
  inicial,
  ctaLabel,
}: {
  preencher?: number;
  onSeguir?: () => void;
  onVoltar?: () => void;
  /** 🆕 03/08 — MEI não tem capital social formal (não é sociedade). Campo
   *  some; o resto da tela (endereço, IPTU, tipo de imóvel) é igual pros dois. */
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
  // 🔄 01/09 — não é mais pergunta: quem chega nesta tela tem endereço
  // próprio (quem escolheu o nosso endereço fiscal nem vê a C4).
  const tipo = "proprio";
  // 🔒 31/08 (validado pelo Pedro) — capital social TRAVADO em R$10.000 pra
  // prestador de serviço, preenchido por nós. Deixou de ser campo editável
  // (antes tinha chips de 1k/5k/10k + input livre — a decisão da reunião
  // Rua Satélite 38-40 foi travar, não sugerir).
  const capital = "10.000";
  // 🆕 31/08 — tipo de imóvel (casa/apartamento/outro), só quando o endereço é
  // PRÓPRIO. Dirige a regra de residência logo abaixo.
  // 🔄 01/09 — nasce do que foi respondido no E3.4 (a pergunta subiu pra lá,
  // pré-pagamento); aqui vira confirmação.
  const [tipoImovel, setTipoImovel] = useState(doGate.tipoImovel);
  // 🆕 28/08 — só o MEI usa (ver o bloco "Como você atende?" mais abaixo).
  const [atuacao, setAtuacao] = useState<string[]>([]);
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

  const querFiscal = usarProprio === false;
  const cepDigitos = cep.replace(/\D/g, "");
  const cepCheio = cepDigitos.length === 8;
  const endereco = buscarCep(cepDigitos);
  const capitalNum = Number(capital.replace(/\D/g, "")) || 0;
  // 🔒 31/08 — apartamento OBRIGA o titular a residir no local (senão a
  // Prefeitura de BH indefere a viabilidade — visto ao vivo na gravação real).
  const ehApartamento = tipoImovel === "apartamento";
  // 🔒 se é apartamento, a lei não dá opção: a resposta é implícita "Sim"
  // (mesma lógica que a gravação real mostrou: índice cadastral de apartamento
  // já vem com residência marcada como sim, sem perguntar).
  const residenciaImplicita = ehApartamento;
  const resideEfetivo = residenciaImplicita ? true : resideNoEndereco;

  /**
   * 🆕 04/08 — cruzamento com pesquisa Gemini: o campo só checava "não vazio",
   * deixava passar 1 dígito solto. O índice cadastral do IPTU varia 10-12
   * dígitos dependendo do carnê (nosso mock usa 12 em `dossie/mock.ts`, o
   * Gemini cravou 11 sem citar fonte) — sem confirmação de qual é o formato
   * EXATO de BH, valida um piso (10 dígitos) em vez de travar num número que
   * pode estar errado. 🟡 fila-Larissa: formato exato do índice.
   */
  const iptuDigitos = iptu.replace(/\D/g, "");
  const iptuCurto = iptuDigitos.length > 0 && iptuDigitos.length < 10;
  const iptuOk = iptuDigitos.length >= 10;

  // 🐛→🔒 31/08 — CORRIGIDO: antes só perguntava residência com SOCIOS > 1
  // (`grep` confirmou zero pergunta pro caso mais comum — dono único). A
  // regra da Prefeitura vale igual, é sempre sobre o titular.
  const precisaResidencia = !mei && tipo === "proprio";

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
      (!precisaResidencia || resideEfetivo !== null));

  /**
   * 🐛 29/07 — O CAPITAL SOCIAL ESCAPAVA. A condição era
   * `querFiscal || (usarProprio === true && ... && capitalNum > 0 && ...)`, e o
   * `||` fazia curto-circuito: quem escolhia o endereço fiscal liberava o
   * Continuar com o capital social em branco — e o campo estava ali,
   * renderizado, porque aparece nos DOIS caminhos. Capital social vai no
   * contrato social e a JUCEMG exige. O endereço é que é condicional, não ele.
   */
  const completo =
    usarProprio !== null &&
    enderecoOk &&
    // ME exige capital social (vai pro contrato); MEI exige forma de atuação
    // (o formulário oficial não deixa passar sem).
    (mei ? atuacao.length > 0 : capitalNum > 0);

  return (
    <>
      <TelaHeader meta="Dados da empresa" onVoltar={onVoltar} />

      <main className="app-main">
        {/* ✍️ 29/07 — o título era "Onde a empresa fica?", mas a tela também
            coletava capital social, que não é lugar nenhum.
            🐛→✍️ 01/09 (achado pelo E2E) — o SUBTÍTULO continuou prometendo
            capital social depois que o campo saiu (31/08, valor travado em
            R$10.000 no backend). Trocado pelo que a tela de fato faz: é o
            endereço que a Prefeitura analisa pra deferir ou indeferir. */}
        <Titulo sub="O endereço vai no CNPJ, e é ele que a Prefeitura analisa pra liberar a empresa.">
          Os dados da empresa
        </Titulo>

        <Corpo>
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
          {enderecoVeioDoGate && (
            <div className="rounded-md border border-border-hairline bg-surface-alt p-3">
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
                    {endereco ? `${endereco.bairro} — ` : ""}
                    {cep}
                  </p>
                </div>
                {/* Um cadeado explícito vale mais que campo cinza: cinza a
                    pessoa tenta clicar, cadeado ela entende de primeira. */}
                <span className="shrink-0 text-micro font-semibold text-text-tertiary">
                  🔒 travado
                </span>
              </div>
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
                    {endereco.logradouro}, {endereco.bairro} — {endereco.municipio}/
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
                dica="Está no carnê do IPTU. Obrigatório — sem ele a documentação não passa na Junta."
              >
                <Texto
                  valor={iptu}
                  onChange={setIptu}
                  placeholder="000.000.000.000"
                  inputMode="numeric"
                  erro={iptuCurto ? "Confira o número: o índice completo costuma ter mais dígitos que isso." : undefined}
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
                  acima, junto do endereço. */}

              {/* 🆕 31/08 (achado da gravação real JUCEMG) — só existe quando o
                  endereço é PRÓPRIO: coworking/virtual não têm essa ambiguidade
                  residencial. MEI segue de fora — mesma guarda de sempre.
                  🔄 01/09 — quando a resposta JÁ VEIO do E3.4 (o normal no flow
                  real), vira confirmação read-only: a regra do apartamento
                  agora é decidida antes do pagamento, e reperguntar aqui seria
                  o mesmo eco que o C1 já deixou de fazer com nome/CPF. O campo
                  editável sobrevive pro deep-link/mockup, onde não há resposta
                  anterior nenhuma. */}
              {/* A confirmação read-only não depende do "Como é esse endereço?"
                  (próprio × coworking), que é pergunta DESTA tela: se a
                  resposta sobre o imóvel já veio do gate, ela vale desde o
                  primeiro render — senão a pessoa veria um vazio até escolher
                  algo que ela já respondeu de outro jeito lá atrás. */}
              {!mei && usarProprio === true && respostaImovelVeioDoGate && (
                <div className="rounded-md border border-border-hairline bg-surface-alt p-3">
                  <p className="text-caption font-semibold text-text-primary">
                    Sobre o imóvel, você já respondeu
                  </p>
                  <p className="text-caption text-text-secondary mt-0.5">
                    {TIPO_IMOVEL.find((t) => t.v === tipoImovel)?.label} ·{" "}
                    {resideEfetivo ? "você mora nele" : "você não mora nele"}
                  </p>
                </div>
              )}

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
                  {/* 🔒 se é apartamento, a lei não dá opção. */}
                  {residenciaImplicita ? (
                    <Aviso variante="info" titulo='Marcado como "Sim" automaticamente'>
                      Como o endereço é um apartamento, a Prefeitura de Belo
                      Horizonte só aprova se você residir no local — não dá
                      pra continuar com “não” aqui.
                    </Aviso>
                  ) : (
                    <OpcoesLinha
                      opcoes={[
                        { v: false, label: "Não" },
                        { v: true, label: "Sim" },
                      ]}
                      valor={resideNoEndereco}
                      onChange={setResideNoEndereco}
                    />
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
        </Corpo>

        <Rodape>
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
      <TelaHeader meta="Atividades da empresa" onVoltar={onVoltar} />

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

        <Corpo>
          {/* 🔄 02/09 (pedido do Pedro) — A PRINCIPAL É O MESMO CARTÃO DA C0.
              Era um `Card` neutro, com outro rótulo ("Atividade principal (já
              definida)") e sem o "Ver detalhes". Duas telas do mesmo bloco
              mostrando o MESMO dado de dois jeitos fazia a pessoa reconferir
              se era a mesma coisa. Agora é o cartão coral idêntico, com a pill
              e o acesso ao detalhe — a identidade visual atravessa o bloco.
              Reusa `OutrasOpcoes` (encaixe.tsx), a mesma fonte da C0. */}
          <div>
            <p className="text-micro text-text-tertiary mb-1.5">Sua atividade principal</p>
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
            />
          </div>

          {/* 🔄 02/09 (ideia do Pedro) — AS SECUNDÁRIAS VIRAM UM CARTÃO SÓ.
              A 1ª versão listava cada escolhida num cartão do tamanho da
              principal: com 5 ou 10, a tela virava uma pilha e a busca ficava
              lá embaixo, longe. Agora é um cartão-resumo que abre um sheet com
              a lista inteira, onde dá pra tirar. Ocupa 1 linha, a hierarquia
              fica óbvia (um cartão grande = principal, um resumo = o resto) e
              a busca continua ao alcance. */}
          {escolhidas.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setRascunho(ativos);
                setVendoSecundarias(true);
              }}
              /* 🔄 02/09 (achado do Pedro) — o resumo era BRANCO e se confundia
                 com um cartão de atividade da lista. Agora usa o coral da
                 principal: no bloco inteiro, coral passa a significar "isto já
                 está no seu CNPJ" (a principal, as sugestões marcadas e este
                 resumo), e branco significa "opção disponível". */
              className="flex w-full items-center justify-between gap-3 rounded-md border border-action-primary bg-action-primary p-4 text-left"
            >
              <span className="min-w-0">
                <span className="block text-body font-semibold text-text-on-brand">
                  {escolhidas.length === 1
                    ? "1 atividade secundária"
                    : `${escolhidas.length} atividades secundárias`}
                </span>
                {/* Os nomes no resumo evitam que o cartão seja só um número:
                    a pessoa confere sem precisar abrir. */}
                <span className="mt-0.5 block truncate text-caption text-text-on-brand/80">
                  {escolhidas.map((s) => s.humano).join(" · ")}
                </span>
              </span>
              <ChevronResumo />
            </button>
          )}

          {/* 🗑️ 02/09 (pente fino do Pedro) — 3 linhas que repetiam o que a
              tela já dizia em outros 4 lugares ("é opcional", "complemento").
              A única informação nova, "não precisa ser do mesmo ramo", subiu
              pro subtítulo; o teto de 15 a própria UI garante (para de deixar
              marcar). Tinha travessão, proibido em copy pública desde 24/07. */}

          {/* 🆕 24/08 — busca restrita ao que a gente atende (mesma lista da
              entrevista principal), pedido original da Jéssica (reunião 19/07)
              e reforçado pelo Leonan. */}
          <Campo rotulo="Buscar outra atividade, de qualquer ramo">
            <Texto
              valor={busca}
              onChange={setBusca}
              placeholder="Ex: consultoria, eventos, treinamento..."
            />
          </Campo>

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
                      className={`rounded-md border p-3 text-left transition-colors
                        ${
                          on
                            ? "border-action-primary bg-action-primary"
                            : "border-border-hairline bg-surface-card hover:border-border-strong"
                        }`}
                    >
                      <p className={`text-body font-semibold ${on ? "text-text-on-brand" : "text-text-primary"}`}>
                        {s.humano}
                      </p>
                      <p className={`text-caption mt-0.5 ${on ? "text-text-on-brand/80" : "text-text-secondary"}`}>
                        CNAE {s.cnae}
                      </p>
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

          {algumaMudaEnquadramento && (
            <Aviso variante="warning" titulo="Uma dessas muda seu enquadramento">
              Pelo menos uma atividade que você escolheu muda o imposto que sua
              empresa paga. Isso a gente prefere acertar com você, não sozinho —
              por isso o próximo passo é falar com um atendente em vez de
              continuar direto.
            </Aviso>
          )}

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
                    className={`rounded-md border p-3 text-left transition-colors
                      ${
                        on
                          ? "border-action-primary bg-action-primary"
                          : "border-border-hairline bg-surface-card hover:border-border-strong"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p
                          className={`text-body font-semibold ${
                            on ? "text-text-on-brand" : "text-text-primary"
                          }`}
                        >
                          {s.humano}
                        </p>
                        <p
                          className={`text-caption mt-0.5 ${
                            on ? "text-text-on-brand/80" : "text-text-secondary"
                          }`}
                        >
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
                      {/* No selecionado o marcador inverte: círculo branco com
                          check coral, senão coral-sobre-coral desapareceria. */}
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-caption font-bold
                          ${
                            on
                              ? "bg-surface-card text-action-primary"
                              : "border border-border-strong text-text-tertiary"
                          }`}
                        aria-hidden
                      >
                        {on ? "✓" : "+"}
                      </span>
                    </div>
                    <p
                      className={`text-micro mt-2 ${
                        on ? "text-text-on-brand/70" : "text-text-tertiary"
                      }`}
                    >
                      {s.prova}
                    </p>
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

// 3 sugestões da IA, já na ordem de prioridade default (a pessoa reordena).
const SUGESTOES_RAZAO = [
  `${NOME_EMPRESARIAL} Web Studio`,
  `${NOME_EMPRESARIAL} Desenvolvimento de Software`,
  `${NOME_EMPRESARIAL.split(" ")[0]} Tecnologia ME`,
];

function gerarObjetoSocial(): string {
  const secs = CNAES_SECUNDARIAS.map((s) => s.humano).join(", ");
  return `Prestação de serviços de ${CNAE_PRINCIPAL.humano.toLowerCase()}, podendo também exercer ${secs}.`;
}

// Ícones minimalistas (stroke, `currentColor`) — pedido do Pedro pra não usar
// emoji nos botões de editar/salvar (emoji vem colorido, ignora o texto).
function IconeLapis() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}

function IconeCheckMini() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

/**
 * 🆕 24/08 (pedido do Pedro) — cada sugestão ganha lápis de edição: a pessoa
 * reescreve a sugestão da IA no lugar em vez de digitar uma opção À PARTE
 * ("Nenhuma dessas? Digite a sua", removido). Objeto usa `id` estável (não o
 * texto) porque o texto agora MUDA quando editado — usar o próprio nome como
 * key quebraria a lista.
 */
interface SugestaoNome {
  id: string;
  valor: string;
}

function sugestoesIniciais(): SugestaoNome[] {
  return SUGESTOES_RAZAO.map((valor, i) => ({ id: `n${i}`, valor }));
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
    novaRodada ? [0, 1, 2].map((i) => ({ id: `r${i}`, valor: "" })) : sugestoesIniciais(),
  );
  // Na 2ª rodada o 1º campo já abre em edição: sem isso a pessoa cai numa
  // lista de 3 vazios e precisa descobrir que o lápis é o caminho.
  const [editandoId, setEditandoId] = useState<string | null>(novaRodada ? "r0" : null);
  const [fantasia, setFantasia] = useState("");
  // 🔒 24/08 (reunião Leonan 19/08) — TRAVADO, não editável. Erro de grafia
  // do cliente (S↔Z etc) subia pro contrato e virava reclamação real no
  // escritório antigo do Leonan. Objeto social é 100% gerado a partir das
  // atividades (CNAE principal + secundárias) — se as atividades mudam, o
  // objeto se regenera sozinho; a pessoa não digita nele.
  const objeto = gerarObjetoSocial();

  usePreencher(preencher, () => {
    setOrdem(sugestoesIniciais());
    setEditandoId(null);
    setFantasia(PREENCHIMENTO.nome.fantasia);
  });

  const completo = mei || ordem.every((o) => o.valor.trim().length > 0);

  function mover(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= ordem.length) return;
    setOrdem((o) => {
      const novo = [...o];
      [novo[i], novo[j]] = [novo[j], novo[i]];
      return novo;
    });
  }

  function editarValor(id: string, valor: string) {
    setOrdem((o) => o.map((s) => (s.id === id ? { ...s, valor } : s)));
  }

  return (
    <>
      <TelaHeader meta={novaRodada ? "Novos nomes" : "Nome da empresa"} onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo
          sub={
            mei
              ? "No MEI o nome oficial é definido por lei. O que você escolhe é a marca que aparece pro cliente."
              : novaRodada
                ? "As 3 primeiras não passaram na Junta. Escreva outras 3 e escolha a ORDEM que quer que a gente tente."
                : "A gente sugeriu 3 nomes. Edite o que quiser e escolha a ORDEM que quer que a gente tente registrar."
          }
        >
          {mei
            ? "O nome da sua empresa"
            : novaRodada
              ? "Sugira mais 3 nomes"
              : "Qual nome você prefere?"}
        </Titulo>

        <Corpo>
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

              <Aviso variante="info" titulo="Ninguém escolhe o nome de um MEI">
                Diferente do ME, o MEI não passa por consulta de nome na Junta
                Comercial. A razão social é montada pelo próprio sistema, e por
                isso não existe risco de ter o nome recusado.
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
            <p className="text-caption font-semibold text-text-primary mb-2">
              Suas 3 opções, na ordem que a gente vai tentar
            </p>
            <div className="flex flex-col gap-2">
              {ordem.map((s, i) => {
                const emEdicao = editandoId === s.id;
                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 rounded-md border border-border-hairline bg-surface-card p-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-tint-brand text-caption font-bold text-action-primary-sm">
                      {i + 1}
                    </span>
                    {emEdicao ? (
                      <input
                        autoFocus
                        value={s.valor}
                        onChange={(e) => editarValor(s.id, e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && setEditandoId(null)}
                        aria-label={`Editar sugestão ${i + 1}`}
                        className="min-w-0 flex-1 rounded-md border border-border-focus bg-surface-card px-2 py-1.5
                                   text-body font-semibold text-text-primary focus:outline-none"
                      />
                    ) : (
                      <span className="min-w-0 flex-1 truncate text-body font-semibold text-text-primary">
                        {s.valor.trim() || "—"}
                      </span>
                    )}
                    {/* 🐛 24/08 — o check "travava": o input tinha `onBlur` fechando
                        a edição, e o clique no botão dispara blur ANTES do onClick
                        (mousedown tira o foco, blur roda, só depois o click chega).
                        O botão reabria com `emEdicao` antigo, capturado no closure
                        de antes do re-render do blur. Tirar o onBlur mata a corrida
                        — só Enter ou o próprio botão fecham a edição agora.
                        Ícone SVG monocromático (não emoji): emoji renderiza colorido
                        sempre, não respeita `currentColor`. */}
                    <button
                      type="button"
                      onClick={() => setEditandoId(emEdicao ? null : s.id)}
                      aria-label={emEdicao ? "Salvar edição" : "Editar sugestão"}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-text-tertiary transition-colors hover:bg-surface-alt hover:text-action-primary-sm"
                    >
                      {emEdicao ? <IconeCheckMini /> : <IconeLapis />}
                    </button>
                    <div className="flex shrink-0 flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => mover(i, -1)}
                        disabled={i === 0}
                        aria-label="Subir prioridade"
                        className="flex h-6 w-6 items-center justify-center rounded text-text-secondary transition-colors hover:bg-surface-alt disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => mover(i, 1)}
                        disabled={i === ordem.length - 1}
                        aria-label="Descer prioridade"
                        className="flex h-6 w-6 items-center justify-center rounded text-text-secondary transition-colors hover:bg-surface-alt disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>
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
          {!mei && !novaRodada && (
          <Aviso variante="info" titulo="Nenhuma tentativa atrasa a sua abertura">
            A gente tenta registrar a 1ª opção na Junta. Se ela não passar, já
            seguimos pra 2ª, e depois a 3ª — sem te avisar toda vez nem travar
            o processo.
          </Aviso>
          )}

          {/* 🔄 01/09 (pedido do Pedro) — na 2ª rodada a tela é SÓ os 3 nomes:
              objeto social já foi definido e não muda por causa de um nome
              recusado. (A 1ª tentativa de gate pegou o bloco errado — este é
              o que de fato renderiza.) */}
          {!mei && !novaRodada && (
          <Campo
            rotulo="Objeto social"
            dica="Gerado automaticamente a partir das suas atividades. Não dá pra editar aqui — assim evitamos erro de grafia indo pro contrato."
          >
            <div
              className="w-full rounded-md border border-border-hairline bg-surface-alt p-3
                         text-body text-text-secondary"
            >
              {objeto}
            </div>
          </Campo>
          )}

          {/* Nome fantasia vale pros DOIS regimes — é o único campo de nome
              que o formulário do MEI realmente oferece. */}
          {!novaRodada && (
            <Campo rotulo="Nome fantasia" dica="Opcional. É a marca que aparece pro cliente.">
              <Texto
                valor={fantasia}
                onChange={setFantasia}
                placeholder="Como o público vai te conhecer"
              />
            </Campo>
          )}
        </Corpo>

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
                  className={`flex items-center justify-between gap-3 rounded-md border p-3 text-left transition-colors ${
                    on
                      ? "border-action-primary bg-action-primary"
                      : "border-border-hairline bg-surface-card"
                  }`}
                >
                  <span className="min-w-0">
                    <span
                      className={`block text-body font-semibold ${
                        on ? "text-text-on-brand" : "text-text-tertiary line-through"
                      }`}
                    >
                      {s.humano}
                    </span>
                    <span
                      className={`block text-caption ${
                        on ? "text-text-on-brand/80" : "text-text-tertiary"
                      }`}
                    >
                      CNAE {s.cnae}
                    </span>
                  </span>
                  {/* Riscado em vez de sumir da lista: sumindo, a pessoa
                      perderia a chance de voltar atrás antes de salvar. */}
                  <span
                    className={`shrink-0 text-caption font-semibold ${
                      on ? "text-text-on-brand/80" : "text-action-primary-sm"
                    }`}
                  >
                    {on ? "Tirar" : "Voltar"}
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
