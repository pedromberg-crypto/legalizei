"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Campo, Texto } from "@/components/ui/form";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { LinhaEscolha } from "./_linha-escolha";
import {
  CATEGORIAS_MEI,
  FORMAS_ENDERECO_MEI,
  categoriaTemMei,
  motivoSemMei,
} from "@/lib/mei";
import { mascaraCep, buscarCep, type EnderecoCep } from "./_formato";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M1 · ONDE VOCÊ TRABALHA — a primeira tela do caminho MEI.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09. Substitui o uso que o MEI fazia da E3.4 do ME (`entrada-lead.tsx`,
 * "Endereço + categoria", que a auditoria de 28/08 já tinha achado 2 erros).
 *
 * ─── O QUE MUDA EM RELAÇÃO À TELA DO ME, E POR QUÊ ──────────────────────────
 * A E3.4 é a tela dos **2 gates** do MLP: o de cidade (só BH) e o de
 * categoria. Nenhum dos dois se aplica igual aqui:
 *
 *   1. **Não existe gate de BH.** O ME é limitado a Belo Horizonte porque a
 *      abertura passa por JUCEMG e pela prefeitura. O MEI registra no Portal
 *      do Empreendedor, pela Redesim, e o serviço contábil a gente presta de
 *      qualquer lugar. O CEP aqui é dado cadastral, não porta.
 *
 *   2. **Não existe o card de endereço fiscal (R$60/mês).** Ele existe no ME
 *      pra RESOLVER o gate de BH — sem gate, virou upsell sem função. Pior:
 *      o MEI pode usar o endereço residencial por lei (LC 123 art. 3º-A +
 *      Res. CGSIM 22/2010), então vender endereço pra ele seria vender uma
 *      solução pra um problema que ele não tem. (Erro nº 1 da auditoria de
 *      28/08, que na época foi corrigido com uma guarda `!mei`; agora ele
 *      simplesmente não existe neste arquivo.)
 *
 *   3. **A frase sobre viabilidade sai.** A E3.4 avisava que "a prefeitura
 *      confirma na viabilidade". A consulta prévia de viabilidade foi
 *      **extinta pro MEI** (Res. CGSIM 61/2020) e o alvará é dispensado por
 *      declaração. Repetir a frase do ME criaria expectativa de uma espera
 *      que não vai acontecer. (Erro nº 2 da mesma auditoria.)
 *
 * ─── A PERGUNTA QUE NASCE AQUI E NÃO EXISTE NO ME ───────────────────────────
 * **A forma de endereço.** Ela não é decoração: interage com a dispensa de
 * alvará (o Termo de Ciência declara atividade de baixo risco) e com a
 * validade de usar a casa como endereço comercial. No ME essa pergunta não
 * faz sentido, porque a sede tem que ser um endereço comercial em BH.
 *
 * ✍️ As 3 categorias sem MEI aparecem DESABILITADAS, com o motivo escrito e a
 * porta pro ME (decisão 27/08). Some-las faria a pessoa achar que a gente não
 * atende a atividade dela.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function EnderecoMeiView({
  meta,
  categoria,
  setCategoria,
  forma,
  setForma,
  cep,
  setCep,
  numero,
  setNumero,
  complemento,
  setComplemento,
  onSeguir,
  onVoltar,
  onQueroMe,
}: {
  /** Nome de PRA ONDE O VOLTAR LEVA (vem de `mei-flow.metaDoVoltar`). */
  meta: string;
  categoria: string | null;
  setCategoria: (v: string) => void;
  forma: string | null;
  setForma: (v: string) => void;
  cep: string;
  setCep: (v: string) => void;
  numero: string;
  setNumero: (v: string) => void;
  complemento: string;
  setComplemento: (v: string) => void;
  onSeguir?: () => void;
  onVoltar?: () => void;
  /** Saída honesta de quem escolheu uma categoria que não existe como MEI. */
  onQueroMe?: () => void;
}) {
  const [achado, setAchado] = useState<EnderecoCep | null>(null);

  function digitarCep(v: string) {
    const mascarado = mascaraCep(v);
    setCep(mascarado);
    setAchado(buscarCep(mascarado.replace(/\D/g, "")));
  }

  const bloqueada = categoria !== null && !categoriaTemMei(categoria);
  const motivo = categoria ? motivoSemMei(categoria) : null;

  const completo =
    categoria !== null &&
    !bloqueada &&
    forma !== null &&
    achado !== null &&
    numero.trim().length > 0;

  return (
    <>
      <TelaHeader meta={meta} onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo sub="Duas coisas rápidas: em que área você trabalha, e de onde. As duas entram no seu cadastro do MEI.">
          Sobre o seu trabalho
        </Titulo>

        <Corpo>
          {/* ── 1 · A ÁREA ───────────────────────────────────────────────── */}
          <div>
            <p className="text-caption font-semibold text-text-primary mb-0.5">
              Em que área você trabalha?
            </p>
            <p className="text-micro text-text-tertiary mb-2">
              A ocupação exata você escolhe depois, de uma lista do governo.
              Aqui é só pra gente já filtrar o que faz sentido pra você.
            </p>

            <div className="flex flex-col gap-2">
              {CATEGORIAS_MEI.map((c) => {
                const temMei = categoriaTemMei(c.id);
                return (
                  <LinhaEscolha
                    key={c.id}
                    titulo={c.label}
                    nota={temMei ? c.ex : "Não existe como MEI"}
                    selecionada={categoria === c.id}
                    apagada={!temMei}
                    onClick={() => setCategoria(c.id)}
                  />
                );
              })}
            </div>
          </div>

          {/* A saída honesta: bloqueio da LEI, não do produto. Por isso `info`
              (azul) e não `danger` — o desfecho é "tem caminho, e é com a
              gente", igual ao template das saídas. */}
          {bloqueada && motivo && (
            <Aviso variante="info" titulo="Essa atividade não pode ser MEI">
              {motivo}
            </Aviso>
          )}

          {/* ── 2 · A FORMA ──────────────────────────────────────────────── */}
          {!bloqueada && categoria && (
            <Campo
              rotulo="De onde você trabalha?"
              dica="No MEI a sua casa vale como endereço comercial. É a lei (LC 123, art. 3º-A), não um jeitinho."
            >
              <div className="flex flex-col gap-2">
                {FORMAS_ENDERECO_MEI.map((f) => (
                  <LinhaEscolha
                    key={f.id}
                    titulo={f.label}
                    nota={f.nota}
                    selecionada={forma === f.id}
                    onClick={() => setForma(f.id)}
                  />
                ))}
              </div>
            </Campo>
          )}

          {/* ── 3 · O ENDEREÇO ───────────────────────────────────────────── */}
          {!bloqueada && forma && (
            <>
              <Campo
                rotulo="CEP do endereço que vai no cadastro"
                dica={
                  forma === "casa"
                    ? "Pode ser o da sua casa mesmo."
                    : "O endereço que vai constar como o da sua empresa."
                }
              >
                <Texto
                  valor={cep}
                  onChange={digitarCep}
                  placeholder="00000-000"
                  inputMode="numeric"
                  maxLength={9}
                  ok={achado ? `${achado.logradouro}, ${achado.bairro}` : undefined}
                />
              </Campo>

              {achado && (
                <>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Campo rotulo="Número">
                        <Texto
                          valor={numero}
                          onChange={setNumero}
                          placeholder="123"
                          inputMode="numeric"
                        />
                      </Campo>
                    </div>
                    <div className="flex-1">
                      <Campo rotulo="Complemento">
                        <Texto
                          valor={complemento}
                          onChange={setComplemento}
                          placeholder="Apto, sala, fundos"
                        />
                      </Campo>
                    </div>
                  </div>

                  <p className="text-micro text-text-tertiary">
                    {achado.municipio} · {achado.uf}. A cidade não muda nada no
                    seu MEI: a gente cuida da contabilidade de qualquer lugar do
                    Brasil.
                  </p>
                </>
              )}

              {/* 🎯 O aviso que só existe no MEI. Ele é a boa notícia que o ME
                  não tem, e chega ANTES de a pessoa se preocupar — em vez de
                  ela passar o flow inteiro esperando um alvará que não vem. */}
              <Aviso variante="success" titulo="Sem alvará e sem análise prévia">
                No MEI a prefeitura não analisa nada antes: você declara que a
                atividade é de baixo risco e o registro sai na hora. A consulta
                de viabilidade, que existe pra empresa comum, foi extinta pro
                MEI em 2020.
              </Aviso>
            </>
          )}
        </Corpo>

        <Rodape>
          {bloqueada ? (
            <Button full onClick={onQueroMe}>
              Ver como seria em ME
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
