"use client";

import { Button } from "@/components/ui/button";
import { Campo, OpcoesLinha, Checkbox } from "@/components/ui/form";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { IMPEDIMENTOS } from "@/lib/mei";

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
 * ⚠️ O benefício não fecha a porta, de propósito. O governo deixa registrar —
 * o que acontece é o benefício ser cancelado, e isso é irreversível. Fingir
 * que é bloqueio seria mentir; deixar passar em silêncio seria pior. Vira
 * escolha informada, com confirmação explícita.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function ImpedimentosView({
  meta,
  respostas,
  setResposta,
  cienteBeneficio,
  setCienteBeneficio,
  onSeguir,
  onSaida,
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
                    <p className="text-caption text-text-secondary">{imp.saida}</p>

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
