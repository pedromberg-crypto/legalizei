"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { Campo, Texto, Select, OpcoesLinha } from "@/components/ui/form";
import { FISCAL, brl } from "@/lib/fiscal";
import {
  CLIENTE,
  TEM_SOCIO,
  SOCIO_2,
  SOCIOS,
  NOMES_SOCIOS,
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
}: {
  preencher?: number;
  onSeguir?: () => void;
  onVoltar?: () => void;
}) {
  const [rg, setRg] = useState("");
  const [orgao, setOrgao] = useState("");
  const [civil, setCivil] = useState("");
  const [regime, setRegime] = useState("");

  usePreencher(preencher, () => {
    setRg(PREENCHIMENTO.socio.rg);
    setOrgao(PREENCHIMENTO.socio.orgao);
    setCivil(PREENCHIMENTO.socio.civil);
    setRegime(PREENCHIMENTO.socio.regime);
  });

  const completo =
    rg.trim() !== "" &&
    orgao.trim() !== "" &&
    civil !== "" &&
    (civil !== "casado" || regime !== "");

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
              <LinhaConfirma rotulo="Endereço" valor={CLIENTE.endereco} />
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

          <Campo rotulo="Estado civil">
            <Select valor={civil} onChange={setCivil} opcoes={ESTADO_CIVIL} />
          </Campo>

          {/* Condicional: só casado revela o regime (spec Tela 6). */}
          {civil === "casado" && (
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
            Continuar
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
}: {
  preencher?: number;
  onSeguir?: () => void;
  onVoltar?: () => void;
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
            Continuar
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
export function SociosView({
  preencher,
  onSeguir,
  onVoltar,
}: {
  preencher?: number;
  onSeguir?: () => void;
  onVoltar?: () => void;
}) {
  const [nome2, setNome2] = useState(TEM_SOCIO ? SOCIO_2.nome : "");
  const [parte1, setParte1] = useState(50);

  // Esta tela já nasce preenchida pelo mock; o botão serve pra DESFAZER o que
  // quem apresenta mexeu ao vivo e voltar pro estado canônico.
  usePreencher(preencher, () => {
    setNome2(TEM_SOCIO ? SOCIO_2.nome : "");
    setParte1(50);
  });

  const parte2 = 100 - parte1;
  const completo = !TEM_SOCIO || nome2.trim().split(/\s+/).length >= 2;

  return (
    <>
      {/* Mesmo alinhamento do N10: o cliente lê "Sócios" na lista de passos
          (P1/P2), então é isso que a tela precisa dizer. */}
      <TelaHeader meta="Sócios" onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo
          sub={
            TEM_SOCIO
              ? "Você disse que teria sócio. Complete os dados dele."
              : "Você disse que abriria sozinho. É só confirmar."
          }
        >
          {TEM_SOCIO ? "Seu sócio" : "Empresa só sua"}
        </Titulo>

        <Corpo>
          {TEM_SOCIO ? (
            <>
              {/* ✍️ 29/07 — o limite de 2 era um `Aviso` de bloco, com título, e
                  aparecia pra 100% de quem chega aqui: a triagem do N4 já barrou
                  3+ lá atrás, então todo mundo que lê está DENTRO do limite. Dar
                  peso de notícia ruim a quem não foi barrado gasta atenção
                  contra o usuário. Virou nota de rodapé do campo. */}
              <Campo rotulo="Nome completo do 2º sócio">
                <Texto
                  valor={nome2}
                  onChange={setNome2}
                  placeholder="Como está no documento dele"
                  erro={
                    nome2.length > 0 && nome2.trim().split(/\s+/).length < 2
                      ? "Escreva o nome completo."
                      : undefined
                  }
                />
              </Campo>

              <p className="text-micro text-text-tertiary -mt-3">
                Os outros dados dele a gente coleta igual aos seus, na sequência.
                Aqui a gente abre com até 2 sócios: é limite do nosso produto,
                não da lei.
              </p>

              {/* % de participação: soma 100, default 50/50 editável. */}
              <Campo
                rotulo="Como fica a divisão da empresa?"
                dica="Precisa somar 100%. Toque num atalho ou arraste."
              >
                <div className="mb-3 flex gap-2">
                  {[25, 50, 75].map((p) => {
                    const on = parte1 === p;
                    return (
                      <button
                        key={p}
                        onClick={() => setParte1(p)}
                        className={`min-h-10 flex-1 rounded-full border text-caption font-semibold transition-colors
                          ${
                            on
                              ? "border-action-primary bg-action-primary text-text-on-brand"
                              : "border-border-hairline bg-surface-card text-text-secondary hover:border-border-strong"
                          }`}
                      >
                        {p}%
                      </button>
                    );
                  })}
                </div>
                <input
                  type="range"
                  min={5}
                  max={95}
                  step={5}
                  value={parte1}
                  onChange={(e) => setParte1(Number(e.target.value))}
                  aria-label="Sua participação na empresa"
                  className="w-full accent-[var(--color-action-primary)]"
                />
                <div className="mt-2 flex justify-between text-caption">
                  <span className="font-semibold text-text-primary">
                    Você: {parte1}%
                  </span>
                  <span className="font-semibold text-text-primary">
                    {nome2.trim().split(/\s+/)[0] || "2º sócio"}: {parte2}%
                  </span>
                </div>
              </Campo>
            </>
          ) : (
            <Aviso variante="info" titulo="Empresa só sua">
              Sem sócios, a gente abre no formato certo pra dono único. Você
              confirma o tipo na próxima etapa.
            </Aviso>
          )}
        </Corpo>

        <Rodape>
          <Button full disabled={!completo} onClick={onSeguir}>
            Continuar
          </Button>
        </Rodape>
      </main>
    </>
  );
}

/* ═══════════════════ N13 · DADOS DA EMPRESA ═════════════════════════════ */

const TIPO_ENDERECO = [
  { v: "proprio", label: "Endereço próprio (casa ou ponto)" },
  { v: "coworking", label: "Coworking" },
  { v: "virtual", label: "Endereço virtual" },
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
}: {
  preencher?: number;
  onSeguir?: () => void;
  onVoltar?: () => void;
  /** 🆕 03/08 — MEI não tem capital social formal (não é sociedade). Campo
   *  some; o resto da tela (endereço, IPTU, tipo de imóvel) é igual pros dois. */
  mei?: boolean;
}) {
  const [usarProprio, setUsarProprio] = useState<boolean | null>(null);
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [iptu, setIptu] = useState("");
  const [tipo, setTipo] = useState("");
  const [capital, setCapital] = useState("");
  const [residenciaSocios, setResidenciaSocios] = useState<Record<string, boolean>>({});

  // A tela mais pesada da constituição — e por isso a que mais precisa do
  // automático numa apresentação. Preenche o caminho "endereço próprio", que é
  // o que exercita IPTU, tipo de imóvel e residência de sócio.
  usePreencher(preencher, () => {
    const p = PREENCHIMENTO.empresa;
    setUsarProprio(true);
    setCep(p.cep);
    setNumero(p.numero);
    setComplemento(p.complemento);
    setIptu(p.iptu);
    setTipo(p.tipo);
    setCapital(p.capital);
    setResidenciaSocios(Object.fromEntries(NOMES_SOCIOS.map((n) => [n, false])));
  });

  const querFiscal = usarProprio === false;
  const cepDigitos = cep.replace(/\D/g, "");
  const cepCheio = cepDigitos.length === 8;
  const endereco = buscarCep(cepDigitos);
  const capitalNum = Number(capital.replace(/\D/g, "")) || 0;
  const capitalBaixo = capitalNum > 0 && capitalNum < 1000;

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

  const residenciaCompleta =
    SOCIOS === 1 || NOMES_SOCIOS.every((n) => n in residenciaSocios);

  const enderecoOk =
    querFiscal ||
    (usarProprio === true &&
      cepCheio &&
      numero.trim() !== "" &&
      iptuOk &&
      tipo !== "" &&
      residenciaCompleta);

  /**
   * 🐛 29/07 — O CAPITAL SOCIAL ESCAPAVA. A condição era
   * `querFiscal || (usarProprio === true && ... && capitalNum > 0 && ...)`, e o
   * `||` fazia curto-circuito: quem escolhia o endereço fiscal liberava o
   * Continuar com o capital social em branco — e o campo estava ali,
   * renderizado, porque aparece nos DOIS caminhos. Capital social vai no
   * contrato social e a JUCEMG exige. O endereço é que é condicional, não ele.
   */
  const completo = usarProprio !== null && enderecoOk && (mei || capitalNum > 0);

  return (
    <>
      <TelaHeader meta="Dados da empresa" onVoltar={onVoltar} />

      <main className="app-main">
        {/* ✍️ 29/07 — o título era "Onde a empresa fica?", mas a tela também
            coleta capital social, que não é lugar nenhum. */}
        <Titulo sub="O endereço vai no CNPJ, e o capital social entra no contrato.">
          Os dados da empresa
        </Titulo>

        <Corpo>
          {/* Upsell: oferece, não obriga. A oferta tem MAIS peso que a opção
              neutra sem pré-selecionar. 🕓 R$60 é FAKE. */}
          <Campo rotulo="Você tem um endereço comercial pra usar?">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setUsarProprio(true)}
                className={`min-h-12 rounded-md border px-4 text-left text-body font-semibold transition-colors
                  ${
                    usarProprio === true
                      ? "border-action-primary bg-action-primary text-text-on-brand"
                      : "border-border-hairline bg-surface-card text-text-secondary hover:border-border-strong"
                  }`}
              >
                Uso um endereço meu
              </button>
              {/* Card rico: quando selecionado vira coral sólido igual aos
                  botões simples, então o texto interno inverte junto — senão o
                  cinza-secundário sumiria dentro do coral. */}
              <button
                onClick={() => setUsarProprio(false)}
                className={`rounded-md border p-4 text-left transition-colors
                  ${
                    usarProprio === false
                      ? "border-action-primary bg-action-primary"
                      : "border-border-strong bg-surface-card hover:border-border-focus"
                  }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`text-body font-semibold ${
                      usarProprio === false ? "text-text-on-brand" : "text-text-primary"
                    }`}
                  >
                    Quero um endereço fiscal da Legalizai
                  </span>
                  <span className="shrink-0 rounded-full bg-surface-dark px-2.5 py-1 text-micro font-semibold text-text-on-dark">
                    R$ 60/mês
                  </span>
                </div>
                <p
                  className={`text-caption mt-1.5 ${
                    usarProprio === false ? "text-text-on-brand/80" : "text-text-secondary"
                  }`}
                >
                  Um endereço comercial pronto pra receber a empresa, sem usar o
                  seu. A gente cuida da regularização.
                </p>
              </button>
            </div>
            {/* 🕓 29/07 — o chip mostrava "R$ 60/mês" sem marcação nenhuma, e o
                doc afirmava "Marcado na UI". Não estava. */}
            {usarProprio === false && (
              <p className="text-micro text-text-tertiary mt-2">
                Valor de referência enquanto fechamos o preço final.
              </p>
            )}
          </Campo>

          {querFiscal && (
            <Aviso variante="success" titulo="A gente cuida do endereço">
              Fechado. Ele entra junto no seu plano.
            </Aviso>
          )}

          {usarProprio === true && (
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

              {/* ⚠️ 28/07 (reunião Rua Satélite 9): OBRIGATÓRIO — sem ele a
                  documentação não passa na JUCEMG. */}
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

              <Campo rotulo="Como é esse endereço?">
                <Select valor={tipo} onChange={setTipo} opcoes={TIPO_ENDERECO} />
              </Campo>

              {SOCIOS > 1 && (
                <div>
                  <p className="text-caption font-semibold text-text-primary mb-2">
                    Esse endereço é residência de algum sócio?
                  </p>
                  <div className="flex flex-col gap-2">
                    {NOMES_SOCIOS.map((nome) => (
                      <Campo key={nome} rotulo={nome}>
                        <OpcoesLinha
                          opcoes={[
                            { v: false, label: "Não" },
                            { v: true, label: "Sim" },
                          ]}
                          valor={residenciaSocios[nome] ?? null}
                          onChange={(v) =>
                            setResidenciaSocios((r) => ({ ...r, [nome]: v }))
                          }
                        />
                      </Campo>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {usarProprio !== null && !mei && (
            <Campo
              rotulo="Capital social"
              dica="Quanto a empresa começa valendo. Pode ser um valor simbólico."
            >
              <Texto
                valor={capital}
                onChange={(v) => setCapital(mascaraReais(v))}
                placeholder="R$ 1.000"
                inputMode="numeric"
              />
              {capitalBaixo && (
                <p className="text-micro text-state-warning-text mt-1">
                  Costuma ser pelo menos R$ 1.000. Valores muito baixos podem
                  pegar mal com banco e fornecedor.
                </p>
              )}
            </Campo>
          )}
        </Corpo>

        <Rodape>
          <Button full disabled={!completo} onClick={onSeguir}>
            Continuar
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
}

// Todas MESMO-IMPOSTO que a principal (Anexo III/V com Fator R). Nenhuma muda o
// enquadramento — é a condição pra estar nesta lista (decisão 21/07).
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
];

export function CnaeSecundariosView({
  preencher,
  onSeguir,
  onVoltar,
}: {
  preencher?: number;
  onSeguir?: () => void;
  onVoltar?: () => void;
}) {
  const [ativos, setAtivos] = useState<Record<string, boolean>>({});

  usePreencher(preencher, () => {
    setAtivos(Object.fromEntries(PREENCHIMENTO.cnaeSecundarios.map((id) => [id, true])));
  });

  function alterna(id: string) {
    setAtivos((a) => ({ ...a, [id]: !a[id] }));
  }

  return (
    <>
      <TelaHeader meta="Atividades da empresa" onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo sub="A principal já está definida. Marque o que mais você faz, se fizer.">
          Sua empresa faz mais alguma coisa?
        </Titulo>

        <Corpo>
          {/* Principal herdado do N4 — travado. */}
          <div>
            <p className="text-micro text-text-tertiary mb-1.5">
              Atividade principal (já definida)
            </p>
            <Card>
              <p className="text-body font-semibold text-text-primary">
                {CNAE_PRINCIPAL.humano}
              </p>
              <p className="text-caption text-text-secondary mt-0.5">
                CNAE {CNAE_PRINCIPAL.cnae}
              </p>
            </Card>
          </div>

          <div>
            <p className="text-micro text-text-tertiary mb-1.5">
              Sugestões pra você (toque pra incluir)
            </p>
            {/* A garantia vira argumento: incluir não muda o imposto. */}
            <p className="text-caption text-text-secondary mb-2.5">
              Todas ficam no mesmo imposto da sua atividade principal, então
              incluir não muda o que você paga.
            </p>
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

          <p className="text-micro text-text-tertiary">
            Sem secundárias também está ótimo. Você pode adicionar depois.
          </p>
        </Corpo>

        <Rodape>
          <Button full onClick={onSeguir}>
            Continuar
          </Button>
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
}: {
  onSeguir?: () => void;
  onVoltar?: () => void;
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
            Continuar
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

export function NomeView({
  preencher,
  onSeguir,
  onVoltar,
}: {
  preencher?: number;
  onSeguir?: () => void;
  onVoltar?: () => void;
}) {
  const [ordem, setOrdem] = useState<string[]>(SUGESTOES_RAZAO);
  const [fantasia, setFantasia] = useState("");
  const [objeto, setObjeto] = useState(gerarObjetoSocial());

  usePreencher(preencher, () => {
    setOrdem(SUGESTOES_RAZAO);
    setFantasia(PREENCHIMENTO.nome.fantasia);
    setObjeto(gerarObjetoSocial());
  });

  const completo = objeto.trim().length >= 10;

  function mover(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= ordem.length) return;
    setOrdem((o) => {
      const novo = [...o];
      [novo[i], novo[j]] = [novo[j], novo[i]];
      return novo;
    });
  }

  return (
    <>
      <TelaHeader meta="Nome da empresa" onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo sub="A gente sugeriu 3 nomes. Escolha a ORDEM que quer que a gente tente registrar.">
          Qual nome você prefere?
        </Titulo>

        <Corpo>
          {/* Sem API de disponibilidade: em vez de fingir "disponível na Junta",
              a gente é honesta sobre o que dá pra prometer — tentar em ordem. */}
          <div>
            <p className="text-caption font-semibold text-text-primary mb-2">
              Suas 3 opções, na ordem que a gente vai tentar
            </p>
            <div className="flex flex-col gap-2">
              {ordem.map((nome, i) => (
                <div
                  key={nome}
                  className="flex items-center gap-3 rounded-md border border-border-hairline bg-surface-card p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-tint-brand text-caption font-bold text-action-primary-sm">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-body font-semibold text-text-primary">
                    {nome}
                  </span>
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
              ))}
            </div>
          </div>

          {/* ✍️ 29/07 — o título dizia "A ordem não muda nada na abertura",
              logo abaixo de um subtítulo que pede pra ORDENAR. Lidos em
              sequência, o segundo esvaziava o primeiro. */}
          <Aviso variante="info" titulo="Nenhuma tentativa atrasa a sua abertura">
            A gente tenta registrar a 1ª opção na Junta. Se ela não passar, já
            seguimos pra 2ª, e depois a 3ª — sem te avisar toda vez nem travar
            o processo.
          </Aviso>

          <Campo
            rotulo="Objeto social"
            dica="O que a empresa faz, em texto oficial. Já sugerimos a partir das suas atividades."
          >
            <textarea
              value={objeto}
              onChange={(e) => setObjeto(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-md border border-border-hairline bg-surface-card p-3
                         text-body text-text-primary placeholder:text-text-muted
                         focus:border-border-focus focus:outline-none"
            />
          </Campo>

          <Campo rotulo="Nome fantasia" dica="Opcional. É a marca que aparece pro cliente.">
            <Texto
              valor={fantasia}
              onChange={setFantasia}
              placeholder="Como o público vai te conhecer"
            />
          </Campo>
        </Corpo>

        <Rodape>
          {/* Última tela da coleta: daqui o cliente vai pro N19 (revisar). */}
          <Button full disabled={!completo} onClick={onSeguir}>
            Continuar
          </Button>
        </Rodape>
      </main>
    </>
  );
}
