"use client";

import { Button } from "@/components/ui/button";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { ocupacoesDe } from "@/lib/mei";
import { LinhaEscolha } from "./_linha-escolha";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M7 · SUA OCUPAÇÃO — o Anexo XI, e o limite interno que ninguém conta.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 28/08, mudou de casa em 07/09 (fork do ramo).
 *
 * ⚠️ ISTO NÃO É O C0 DO ME. Lá a pessoa DESCREVE a atividade em texto livre e
 * a IA cruza pra achar o CNAE. Aqui não existe descrever: o Portal do
 * Empreendedor só aceita ocupação de uma lista fechada (Anexo XI da Res. CGSN
 * 140/2018). Oferecer um campo livre criaria a expectativa errada, e foi
 * exatamente por isso que a C0 nunca pôde ser reaproveitada com uma prop.
 *
 * 🎯 O AVISO DO LIMITE INTERNO É A RAZÃO DE A TELA EXISTIR. A Solução de
 * Consulta Cosit nº 27/2021 diz que o MEI só pode exercer a faceta NOMEADA na
 * ocupação, não todo o escopo do CNAE que ela mapeia. Quem escolhe
 * "Reparador(a) de bicicleta" não pode consertar moto — e descobre isso numa
 * fiscalização, não no cadastro. É o erro que só um contador pega, e é parte
 * literal do que a gente vende neste plano.
 *
 * ✍️ O aviso só aparece DEPOIS da escolha. Antes dela seria abstrato e
 * ninguém leria: "sua ocupação tem limites" não significa nada até a ocupação
 * ter nome.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Limite oficial: 1 principal + até 15 secundárias. */
const LIMITE_SECUNDARIAS = 15;

export function OcupacaoMeiView({
  meta,
  categoria,
  principal,
  setPrincipal,
  secundarias,
  setSecundarias,
  onSeguir,
  onVoltar,
}: {
  /** Nome de PRA ONDE O VOLTAR LEVA (vem de `mei-flow.metaDoVoltar`). */
  meta: string;
  /** Categoria escolhida na M1 — define a lista oferecida. */
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
      <TelaHeader meta={meta} onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo sub="No MEI a atividade não é digitada: o governo tem uma lista fechada, e você escolhe da lista.">
          O que você faz?
        </Titulo>

        <Corpo>
          {lista.length === 0 ? (
            /* Guarda-corpo: não deveria acontecer (a M1 já barra as categorias
               sem MEI), mas se o deep-link furar, a tela explica em vez de
               mostrar lista vazia. */
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
                    <LinhaEscolha
                      key={`${o.cnae}-${o.nome}`}
                      titulo={o.nome}
                      nota={o.cnae}
                      selecionada={principal === o.nome}
                      onClick={() => setPrincipal(o.nome)}
                    />
                  ))}
                </div>
              </div>

              {/* 🎯 O aviso que justifica a tela inteira. */}
              {escolhida && (
                <Aviso
                  variante="warning"
                  titulo="O que essa ocupação cobre (e o que não cobre)"
                >
                  Como MEI, você pode exercer exatamente{" "}
                  <strong>{escolhida.nome.toLowerCase()}</strong> — não tudo o
                  que o código {escolhida.cnae} permitiria pra uma empresa
                  maior. É uma regra da Receita que pega muita gente de surpresa
                  numa fiscalização. Se você faz mais coisas, adiciona como
                  atividade secundária abaixo.
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
                      <LinhaEscolha
                        key={`sec-${o.cnae}-${o.nome}`}
                        titulo={o.nome}
                        nota={o.cnae}
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
