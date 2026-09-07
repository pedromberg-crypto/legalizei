"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Campo, Texto, OpcoesLinha, Checkbox } from "@/components/ui/form";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { IMPEDIMENTOS } from "@/lib/mei";
import { SAIDAS_POR_IMPEDIMENTO } from "./saidas";
import { mascaraTelefone } from "./_formato";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M2 · OS 3 IMPEDIMENTOS — a triagem que substitui a de sócios.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 28/08, mudou de casa em 07/09 (fork do ramo). Antes vivia em
 * `components/mei-telas.tsx` e era renderizada de dentro do `/gate`, que é
 * tela de ME; agora tem rota e arquivo próprios.
 *
 * ⚠️ O ME não tem impedimento de PESSOA — ele tem impedimento de SÓCIO (CNPJ
 * no quadro, sócio no exterior, 5+ pessoas). O MEI tem 3 que o próprio governo
 * checa e bloqueia no ato do registro. São coisas diferentes com o mesmo lugar
 * no flow, que é a razão de esta tela existir em vez de uma variante da E5T.
 *
 * Vive ANTES do pagamento pelo mesmo motivo que a triagem de sócios: a gente
 * não cobra de quem já sabe que não pode ser atendido. Se o atendente
 * descobrisse depois, viraria reembolso mais hora humana gasta à toa.
 *
 * ✍️ A ORDEM IMPORTA. Os 2 que BLOQUEIAM vêm primeiro (outra empresa, servidor
 * federal) e o que só ALERTA vem por último (benefício). Invertido, a pessoa
 * leria um alerta assustador sobre perder o benefício pra só então descobrir
 * que nem podia seguir.
 *
 * ⚠️ O benefício não fecha a porta, de propósito. O governo deixa registrar; o
 * que acontece é o benefício ser cancelado, e isso é irreversível. Fingir que
 * é bloqueio seria mentir; deixar passar em silêncio seria pior. Vira escolha
 * informada, com confirmação explícita.
 *
 * ─── 🔄 07/09: OS 2 GATES VIRARAM ESTADO DESTA TELA ─────────────────────────
 * Pedido do Pedro: *"temos 2 telas para 2 gates e eu quero que esses gates
 * fossem condicionais dentro dessa própria tela"*. Era o que faltava pra a M2
 * fechar sozinha — ela já mostrava o aviso inline e depois mandava a pessoa
 * pra OUTRA tela repetir a mesma informação com mais detalhe.
 *
 * Segue o precedente do ME: em 04/09 o E6.2 (CPF não confere) deixou de ser
 * tela e virou `/conta?cpf=nome`, estado da própria E6. E o E3.4 já fazia
 * assim com "essa categoria não pode ser MEI".
 *
 * O que a tela separada tinha e agora mora aqui: a **base legal em card** (sem
 * ela, "não pode" soa como regra da casa), o texto completo da alternativa, e
 * o **formulário de contato** — que é o que transforma um bloqueio em lead.
 * Nada foi cortado; mudou de lugar.
 *
 * 🔗 Continuam alcançáveis por rota (`?bloqueio=ja-tem-cnpj` e `?bloqueio=
 * servidor`), como M4.1/M4.2 fazem: estado que não é navegável no mapa é
 * estado que ninguém revisa.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function ImpedimentosView({
  meta,
  respostas,
  setResposta,
  cienteBeneficio,
  setCienteBeneficio,
  onSeguir,
  onVerMe,
  onVoltar,
}: {
  /** Nome de PRA ONDE O VOLTAR LEVA (vem de `mei-flow.metaDoVoltar`). */
  meta: string;
  /** id do impedimento → resposta. `null` = ainda não respondeu. */
  respostas: Record<string, boolean | null>;
  setResposta: (id: string, v: boolean) => void;
  /** Confirmação explícita de quem recebe benefício e quer seguir mesmo assim. */
  cienteBeneficio: boolean;
  setCienteBeneficio: (v: boolean) => void;
  onSeguir?: () => void;
  /** A alternativa concreta de quem foi bloqueado: abrir como ME. */
  onVerMe?: () => void;
  onVoltar?: () => void;
}) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [leadEnviado, setLeadEnviado] = useState(false);

  // O primeiro bloqueio respondido "sim" trava a tela inteira: não adianta
  // continuar perguntando, e continuar daria a impressão de que ainda dá.
  const bloqueado = IMPEDIMENTOS.find(
    (i) => i.bloqueia && respostas[i.id] === true,
  );
  /* O conteúdo que morava na tela de saída: base legal, alternativa completa e
     o formulário. Continua em `saidas.tsx` porque é DADO, não tela. */
  const saidaDoBloqueio = bloqueado ? SAIDAS_POR_IMPEDIMENTO[bloqueado.id] : null;

  const beneficio = IMPEDIMENTOS.find((i) => !i.bloqueia)!;
  const alertaBeneficio = respostas[beneficio.id] === true;

  const todasRespondidas = IMPEDIMENTOS.every(
    (i) => respostas[i.id] !== null && respostas[i.id] !== undefined,
  );
  const completo =
    !bloqueado && todasRespondidas && (!alertaBeneficio || cienteBeneficio);
  const podeEnviarLead =
    nome.trim().length > 1 && telefone.replace(/\D/g, "").length >= 10;

  return (
    <>
      <TelaHeader meta={meta} onVoltar={onVoltar} />

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

                {r === true && (
                  <div className="mt-3 flex flex-col gap-3">
                    {/* ⚠️ Bloqueio usa `info` (azul), não danger — mesma regra
                        do template de saída: aqui o desfecho é "tem caminho, e
                        a gente te leva". Vermelho é pra quando um órgão parou
                        a fila e a bola está com o cliente. */}
                    <Aviso
                      variante={imp.bloqueia ? "info" : "warning"}
                      titulo={imp.tituloBloqueio}
                    >
                      {imp.motivo}
                    </Aviso>

                    {/* 🔄 07/09 — o que era a tela de saída, agora aqui.
                        A BASE LEGAL fica à vista de propósito: sem ela, "não
                        pode" soa como regra da casa. Com ela, a pessoa entende
                        que a gente está do lado dela contra um sistema. */}
                    {imp.bloqueia && saidaDoBloqueio && !leadEnviado && (
                      <>
                        <Card>
                          <p className="text-micro text-text-tertiary">
                            {saidaDoBloqueio.origem.rotulo}
                          </p>
                          <p className="text-caption text-text-secondary mt-1">
                            {saidaDoBloqueio.origem.texto}
                          </p>
                        </Card>

                        <p className="text-caption text-text-secondary">
                          {saidaDoBloqueio.saida}
                        </p>

                        {/* O formulário é o que transforma um bloqueio em
                            lead. Sem ele, a tela vira só um "não". */}
                        <div className="flex flex-col gap-4">
                          <Campo rotulo="Seu nome">
                            <Texto
                              valor={nome}
                              onChange={setNome}
                              placeholder="Como te chamam"
                            />
                          </Campo>
                          <Campo rotulo="Seu WhatsApp">
                            <Texto
                              valor={telefone}
                              onChange={(v) => setTelefone(mascaraTelefone(v))}
                              placeholder="(31) 90000-0000"
                              inputMode="tel"
                              maxLength={15}
                            />
                          </Campo>
                        </div>
                      </>
                    )}

                    {imp.bloqueia && saidaDoBloqueio && leadEnviado && (
                      <Aviso variante="success" titulo={saidaDoBloqueio.confirmacao.titulo}>
                        {saidaDoBloqueio.confirmacao.texto}
                      </Aviso>
                    )}

                    {!imp.bloqueia && (
                      <p className="text-caption text-text-secondary">{imp.saida}</p>
                    )}

                    {/* Quem recebe benefício NÃO está bloqueado — está diante
                        de uma escolha cara e irreversível. Confirmação
                        explícita, não checkbox escondido em rodapé. */}
                    {!imp.bloqueia && (
                      <Checkbox
                        checked={cienteBeneficio}
                        onChange={setCienteBeneficio}
                      >
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
            /* 🔄 07/09 — o CTA parou de mandar pra outra tela ("Ver o que dá
               pra fazer") e passou a FAZER, aqui. Duas ações, e a ordem
               importa: mandar o contato é o que resolve o caso concreto dela;
               ver o ME é a alternativa que sempre existe. Depois de enviado,
               sobra só o ME — repetir o formulário seria pedir de novo o que
               ela acabou de dar. */
            <div className="flex flex-col gap-2">
              {!leadEnviado && (
                <Button
                  full
                  disabled={!podeEnviarLead}
                  onClick={() => setLeadEnviado(true)}
                >
                  {saidaDoBloqueio?.ctaEnviar ?? "Quero entender meu caso"}
                </Button>
              )}
              <Button
                full
                variant={leadEnviado ? "secondary" : "ghost"}
                onClick={onVerMe}
              >
                Ver como seria em ME
              </Button>
            </div>
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
