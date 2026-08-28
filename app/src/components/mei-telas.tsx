"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { Campo, OpcoesLinha, Checkbox } from "@/components/ui/form";
import { StatusIcon } from "@/components/ui/status";
import { IMPEDIMENTOS, ocupacoesDe, type Ocupacao } from "@/lib/mei";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AS TELAS EXCLUSIVAS DO RAMO MEI — fonte única (fidelidade por construção).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 28/08. Nasce do cruzamento `execucao/flow/cruzamento-flow-mei-vs-me.md`,
 * em cima da pesquisa `pesquisa/abertura-mei/abertura-mei-processo.md`.
 *
 * ⚠️ POR QUE ESTAS TELAS SÃO NOVAS E NÃO ADAPTAÇÕES ─────────────────────────
 * O resto do ramo MEI reusa as telas do ME com props (`mei`), porque o dado
 * coletado é o mesmo. Estas 3 não têm equivalente no ME:
 *
 *   · **M-T · ImpedimentoView** — o ME não tem impedimento de pessoa (só de
 *     sócio: CNPJ, exterior, 5+). O MEI tem 3 que o próprio governo checa e
 *     bloqueia. Vive ANTES do pagamento pelo mesmo motivo que a triagem de
 *     sócios: a gente não cobra de quem já sabe que não pode ser atendido.
 *
 *   · **M-O · OcupacaoView** — o ME escolhe CNAE livre (o C0 descreve a
 *     atividade e a IA cruza). O MEI escolhe de uma **lista fechada**
 *     (Anexo XI, Res. CGSN 140/2018), e carrega o "limite interno" da Solução
 *     de Consulta Cosit nº 27/2021 — a ocupação é mais estrita que o CNAE que
 *     ela mapeia. Isso não existe no ME e é onde mora parte do nosso valor.
 *
 *   · **M-S · ProximosPassosView** — no ME a gente executa e o cliente assina.
 *     No MEI é **legalmente impossível** executar por ele (sem API, sem
 *     procuração que cubra o registro, e a senha gov.br é intransferível por
 *     Termo de Uso). Então esta é a tela que entrega a "cola": os valores dele
 *     prontos, na ordem dos campos do Portal, pra ele finalizar.
 *
 * ⚠️ NENHUMA destas telas é alcançável pelo caminho ME. Elas não alteram nada
 * do que o ME coleta.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/* ═══════════════════ M-T · TRIAGEM DE IMPEDIMENTO ═══════════════════════ */

/**
 * Os 3 impedimentos, um de cada vez, com a resposta mudando a tela na hora.
 *
 * ✍️ A ordem importa: os 2 que BLOQUEIAM vêm primeiro (outra empresa,
 * servidor federal), e o que só ALERTA vem por último (benefício). Se o
 * bloqueio viesse depois, a pessoa leria um alerta assustador sobre benefício
 * pra só então descobrir que nem podia seguir.
 *
 * ⚠️ O benefício não fecha a porta de propósito. O governo deixa registrar —
 * o que acontece é o benefício ser cancelado, e isso é irreversível. Fingir
 * que é bloqueio seria mentir; deixar passar em silêncio seria pior. Vira
 * escolha informada, com confirmação explícita.
 */
export function ImpedimentoView({
  respostas,
  setResposta,
  cienteBeneficio,
  setCienteBeneficio,
  onSeguir,
  onSaida,
  onVoltar,
}: {
  /** id do impedimento → resposta. `null` = ainda não respondeu. */
  respostas: Record<string, boolean | null>;
  setResposta: (id: string, v: boolean) => void;
  /** Confirmação explícita de quem recebe benefício e quer seguir mesmo assim. */
  cienteBeneficio: boolean;
  setCienteBeneficio: (v: boolean) => void;
  onSeguir?: () => void;
  /** Chamado quando um impedimento que BLOQUEIA foi respondido "sim". */
  onSaida?: () => void;
  onVoltar?: () => void;
}) {
  // O primeiro bloqueio respondido "sim" trava a tela inteira: não adianta
  // continuar perguntando, e continuar daria a impressão de que ainda dá.
  const bloqueado = IMPEDIMENTOS.find(
    (i) => i.bloqueia && respostas[i.id] === true,
  );

  const beneficio = IMPEDIMENTOS.find((i) => !i.bloqueia)!;
  const alertaBeneficio = respostas[beneficio.id] === true;

  const todasRespondidas = IMPEDIMENTOS.every(
    (i) => respostas[i.id] !== null && respostas[i.id] !== undefined,
  );
  const completo =
    !bloqueado && todasRespondidas && (!alertaBeneficio || cienteBeneficio);

  return (
    <>
      <TelaHeader meta="Quem pode ser MEI" onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo sub="São 3 perguntas rápidas. O governo checa isso no ato do registro, então é melhor a gente saber agora que depois.">
          Antes de seguir, 3 coisas
        </Titulo>

        <Corpo>
          {IMPEDIMENTOS.map((imp) => {
            const r = respostas[imp.id] ?? null;
            // Depois de um bloqueio, as perguntas seguintes somem: pedir mais
            // resposta pra quem já não pode seguir é só custo, não informação.
            if (bloqueado && bloqueado.id !== imp.id) return null;
            const mostraAviso = r === true;

            return (
              <Campo key={imp.id} rotulo={imp.pergunta} dica={imp.dica}>
                <OpcoesLinha
                  opcoes={[
                    { v: false, label: "Não" },
                    { v: true, label: "Sim" },
                  ]}
                  valor={r}
                  onChange={(v) => setResposta(imp.id, v)}
                />

                {mostraAviso && (
                  <div className="mt-3 flex flex-col gap-3">
                    {/* ⚠️ Bloqueio usa `info` (azul), não danger — mesma regra
                        do template de saída: aqui o desfecho é "tem caminho, e
                        a gente te leva". Vermelho é pra quando um órgão parou
                        a fila e a bola está com o cliente (ver painel.tsx). */}
                    <Aviso
                      variante={imp.bloqueia ? "info" : "warning"}
                      titulo={imp.tituloBloqueio}
                    >
                      {imp.motivo}
                    </Aviso>
                    <p className="text-caption text-text-secondary">
                      {imp.saida}
                    </p>

                    {/* Quem recebe benefício NÃO está bloqueado — está diante
                        de uma escolha cara e irreversível. Confirmação
                        explícita, não checkbox escondido em rodapé. */}
                    {!imp.bloqueia && (
                      <Checkbox checked={cienteBeneficio} onChange={setCienteBeneficio}>
                        Entendi que abrir MEI encerra esse benefício, e quero
                        seguir
                      </Checkbox>
                    )}
                  </div>
                )}
              </Campo>
            );
          })}

          {!bloqueado && (
            <p className="text-micro text-text-tertiary">
              A gente não consulta a situação de ninguém sozinho. Você declara,
              e isso fica protegido.
            </p>
          )}
        </Corpo>

        <Rodape>
          {bloqueado ? (
            <Button full onClick={onSaida}>
              Ver o que dá pra fazer
            </Button>
          ) : (
            <Button full disabled={!completo} onClick={onSeguir}>
              Continuar
            </Button>
          )}
        </Rodape>
      </main>
    </>
  );
}

/* ═══════════════════ M-O · OCUPAÇÃO (Anexo XI) ══════════════════════════ */

/**
 * A escolha da ocupação principal + as secundárias (até 15).
 *
 * ⚠️ ISTO NÃO É O C0 DO ME. Lá a pessoa DESCREVE a atividade e a IA cruza pra
 * achar o CNAE. Aqui não existe descrever: o Portal do Empreendedor só aceita
 * ocupação de uma lista fechada (Anexo XI da Res. CGSN 140/2018). Oferecer um
 * campo livre criaria a expectativa errada.
 *
 * 🎯 O AVISO DO LIMITE INTERNO é a razão de a tela existir. A Solução de
 * Consulta Cosit nº 27/2021 diz que o MEI só pode exercer a faceta NOMEADA na
 * ocupação, não todo o escopo do CNAE que ela mapeia. Quem escolhe
 * "Reparador(a) de bicicleta" não pode consertar moto — e descobre isso numa
 * fiscalização, não no cadastro. É exatamente o erro que só um contador pega.
 */
export function OcupacaoView({
  categoria,
  principal,
  setPrincipal,
  secundarias,
  setSecundarias,
  onSeguir,
  onVoltar,
}: {
  /** Categoria escolhida no E3.4 — define a lista oferecida. */
  categoria: string | null;
  principal: string | null;
  setPrincipal: (v: string) => void;
  secundarias: string[];
  setSecundarias: (v: string[]) => void;
  onSeguir?: () => void;
  onVoltar?: () => void;
}) {
  const lista = ocupacoesDe(categoria);
  const escolhida = lista.find((o) => o.nome === principal) ?? null;

  // Limite oficial: 1 principal + até 15 secundárias.
  const LIMITE_SECUNDARIAS = 15;
  const disponiveis = lista.filter((o) => o.nome !== principal);

  function alternarSecundaria(nome: string) {
    if (secundarias.includes(nome)) {
      setSecundarias(secundarias.filter((s) => s !== nome));
    } else if (secundarias.length < LIMITE_SECUNDARIAS) {
      setSecundarias([...secundarias, nome]);
    }
  }

  return (
    <>
      <TelaHeader meta="Sua atividade" onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo sub="No MEI a atividade não é digitada: o governo tem uma lista fechada, e você escolhe da lista.">
          O que você faz?
        </Titulo>

        <Corpo>
          {lista.length === 0 ? (
            /* Guarda-corpo: não deveria acontecer (o E3.4 já barra as
               categorias sem MEI), mas se o deep-link furar, a tela explica
               em vez de mostrar lista vazia. */
            <Aviso variante="info" titulo="Essa atividade não existe como MEI">
              A lei não considera empresário quem exerce profissão intelectual
              (art. 966 do Código Civil), então essas atividades não entram na
              lista do MEI. Volta um passo que a gente te mostra o ME.
            </Aviso>
          ) : (
            <>
              <div>
                <p className="text-caption font-semibold text-text-primary mb-2">
                  Sua ocupação principal
                </p>
                <div className="flex flex-col gap-2">
                  {lista.map((o) => (
                    <LinhaOcupacao
                      key={`${o.cnae}-${o.nome}`}
                      ocupacao={o}
                      selecionada={principal === o.nome}
                      onClick={() => setPrincipal(o.nome)}
                    />
                  ))}
                </div>
              </div>

              {/* 🎯 O aviso que justifica a tela. Só aparece depois da escolha
                  — antes dela seria abstrato e ninguém leria. */}
              {escolhida && (
                <Aviso variante="warning" titulo="O que essa ocupação cobre (e o que não cobre)">
                  Como MEI, você pode exercer exatamente{" "}
                  <strong>{escolhida.nome.toLowerCase()}</strong> — não tudo o
                  que o código {escolhida.cnae} permitiria pra uma empresa
                  maior. É uma regra da Receita que pega muita gente de
                  surpresa numa fiscalização. Se você faz mais coisas, adiciona
                  como atividade secundária abaixo.
                </Aviso>
              )}

              {escolhida && disponiveis.length > 0 && (
                <div>
                  <p className="text-caption font-semibold text-text-primary mb-0.5">
                    Faz mais alguma coisa?
                  </p>
                  <p className="text-micro text-text-tertiary mb-2">
                    Opcional. Dá pra somar até {LIMITE_SECUNDARIAS}, e não muda
                    o que você paga por mês.
                  </p>
                  <div className="flex flex-col gap-2">
                    {disponiveis.map((o) => (
                      <LinhaOcupacao
                        key={`sec-${o.cnae}-${o.nome}`}
                        ocupacao={o}
                        selecionada={secundarias.includes(o.nome)}
                        onClick={() => alternarSecundaria(o.nome)}
                      />
                    ))}
                  </div>
                  {secundarias.length >= LIMITE_SECUNDARIAS && (
                    <p className="text-micro text-text-tertiary mt-2">
                      Você chegou no limite de {LIMITE_SECUNDARIAS} atividades
                      secundárias.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </Corpo>

        <Rodape>
          <Button full disabled={!escolhida} onClick={onSeguir}>
            Continuar
          </Button>
        </Rodape>
      </main>
    </>
  );
}

/** Uma linha selecionável de ocupação, com o CNAE como recibo discreto. */
function LinhaOcupacao({
  ocupacao,
  selecionada,
  onClick,
}: {
  ocupacao: Ocupacao;
  selecionada: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selecionada}
      className={`flex items-center gap-3 rounded-md border p-3 text-left transition-colors ${
        selecionada
          ? "border-border-focus bg-surface-tint-brand"
          : "border-border-hairline bg-surface-card hover:bg-surface-alt"
      }`}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-body text-text-primary">{ocupacao.nome}</span>
        <span className="block text-micro text-text-tertiary">{ocupacao.cnae}</span>
      </span>
      {selecionada && (
        <span className="shrink-0">
          <StatusIcon estado="feito" />
        </span>
      )}
    </button>
  );
}

/* ═══════════════════ M-S · PRÓXIMOS PASSOS (a "cola") ═══════════════════ */

/** Um campo do formulário oficial, já com o valor do cliente pronto. */
export interface CampoCola {
  rotulo: string;
  valor: string;
  /** Explicação curta de onde esse campo aparece ou por que o valor é esse. */
  nota?: string;
}

/**
 * A tela que fecha o ramo. Aparece quando o atendente interno já conferiu
 * tudo e liberou.
 *
 * ⚠️ ESTA TELA EXISTE PORQUE A LEI OBRIGA. Não dá pra abrir MEI pelo cliente:
 * não há API, não há procuração que cubra o registro (a do e-CAC só vale pra
 * atos posteriores), e a senha gov.br é "pessoal e intransferível" por Termo
 * de Uso — pedir a senha dele seria violação, não atalho.
 *
 * ✍️ A copy NUNCA pode dizer "a gente abre pra você". O que a gente faz é
 * conferir, escolher a ocupação certa e entregar os valores prontos. O clique
 * final é dele, e a tela diz isso na cara — porque a alternativa é uma
 * promessa que a gente não pode cumprir.
 */
export function ProximosPassosView({
  campos,
  nivelGovBrOk,
  setNivelGovBrOk,
  onAbrirPortal,
  onCopiarTudo,
  onConfirmarCnpj,
  onVoltar,
}: {
  /** Os valores dele, na ordem dos campos do Portal do Empreendedor. */
  campos: CampoCola[];
  /** Ele já confirmou que tem conta gov.br Prata ou Ouro? */
  nivelGovBrOk: boolean;
  setNivelGovBrOk: (v: boolean) => void;
  onAbrirPortal?: () => void;
  onCopiarTudo?: () => void;
  onConfirmarCnpj?: () => void;
  onVoltar?: () => void;
}) {
  const [copiado, setCopiado] = useState<string | null>(null);

  function copiar(rotulo: string, valor: string) {
    // `navigator.clipboard` não existe em contexto inseguro nem em alguns
    // WebViews — o try/catch evita quebrar a tela por causa de uma conveniência.
    try {
      void navigator.clipboard?.writeText(valor);
      setCopiado(rotulo);
      setTimeout(() => setCopiado(null), 1600);
    } catch {
      /* silencioso: o valor continua visível e selecionável na tela */
    }
  }

  return (
    <>
      <TelaHeader meta="Últimos passos" onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo sub="Conferimos tudo e deixamos seus dados prontos. O registro em si só pode ser feito por você, com sua conta gov.br.">
          Está tudo pronto pra você finalizar
        </Titulo>

        <Corpo>
          {/* ── POR QUE É VOCÊ QUEM CLICA ────────────────────────────────
              Honestidade antes do toque (mesma doutrina do portal): explicar
              a limitação ANTES de pedir a ação, não depois que ele estranhar. */}
          <Aviso variante="info" titulo="Por que essa parte é você quem faz">
            O governo não permite que ninguém registre um MEI no lugar de outra
            pessoa: o Portal do Empreendedor exige a sua conta gov.br, e ela é
            pessoal. Então a gente fez tudo o que dava — conferiu seus dados,
            escolheu a ocupação certa e deixou cada campo pronto aqui embaixo.
          </Aviso>

          {/* ── PASSO 1 · a conta gov.br ─────────────────────────────────── */}
          <Card>
            <p className="text-micro text-text-tertiary">Passo 1</p>
            <p className="text-body font-semibold text-text-primary mt-0.5 mb-1">
              Confira o nível da sua conta gov.br
            </p>
            <p className="text-caption text-text-secondary mb-3">
              Precisa ser <strong>Prata</strong> ou <strong>Ouro</strong>. Se a
              sua for Bronze, dá pra subir na hora pelo app do seu banco ou pelo
              reconhecimento facial do gov.br.
            </p>
            <Checkbox checked={nivelGovBrOk} onChange={setNivelGovBrOk}>
              Minha conta gov.br já é Prata ou Ouro
            </Checkbox>
          </Card>

          {/* ── PASSO 2 · a cola ─────────────────────────────────────────── */}
          <div>
            <p className="text-micro text-text-tertiary">Passo 2</p>
            <p className="text-body font-semibold text-text-primary mt-0.5 mb-1">
              Copie e cole no Portal, na ordem
            </p>
            <p className="text-caption text-text-secondary mb-3">
              É a mesma ordem que aparece lá. Nome, CPF e data de nascimento o
              próprio gov.br preenche sozinho.
            </p>

            <div className="flex flex-col gap-2">
              {campos.map((c) => (
                <div
                  key={c.rotulo}
                  className="rounded-md border border-border-hairline bg-surface-card p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-micro text-text-tertiary">{c.rotulo}</p>
                      <p className="text-body text-text-primary break-words">
                        {c.valor}
                      </p>
                      {c.nota && (
                        <p className="text-micro text-text-tertiary mt-0.5">
                          {c.nota}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => copiar(c.rotulo, c.valor)}
                      className="shrink-0 text-caption font-semibold text-action-primary-sm underline underline-offset-4"
                    >
                      {copiado === c.rotulo ? "Copiado" : "Copiar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-center">
              <Button variant="ghost" onClick={onCopiarTudo}>
                Copiar tudo de uma vez
              </Button>
            </div>
          </div>

          {/* ── PASSO 3 · o CNPJ de volta ────────────────────────────────── */}
          <Card>
            <p className="text-micro text-text-tertiary">Passo 3</p>
            <p className="text-body font-semibold text-text-primary mt-0.5 mb-1">
              Volta aqui com o CNPJ
            </p>
            <p className="text-caption text-text-secondary">
              O CNPJ sai na hora, ainda na mesma tela. Assim que você tiver o
              número, é só informar aqui que a gente assume o resto: guias,
              notas, declaração e o acompanhamento do seu faturamento.
            </p>
          </Card>

          <p className="text-micro text-text-tertiary">
            Travou em algum passo? Chama a gente no WhatsApp que um atendente
            te acompanha na hora.
          </p>
        </Corpo>

        <Rodape>
          <div className="flex flex-col gap-2">
            <Button full disabled={!nivelGovBrOk} onClick={onAbrirPortal}>
              Abrir o Portal do Empreendedor
            </Button>
            <Button full variant="secondary" onClick={onConfirmarCnpj}>
              Já abri, informar meu CNPJ
            </Button>
          </div>
        </Rodape>
      </main>
    </>
  );
}
