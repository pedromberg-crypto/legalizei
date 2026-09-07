"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Campo, Texto, Select } from "@/components/ui/form";
import { CardNota } from "@/components/ui/card-nota";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { LinhaEscolha } from "./_linha-escolha";
import {
  CATEGORIAS_MEI,
  FORMAS_ENDERECO_MEI,
  categoriaTemMei,
} from "@/lib/mei";
import { mascaraCep, buscarCep, type EnderecoCep } from "./_formato";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M1 · ONDE VOCÊ TRABALHA — no layout aprovado do E3.4.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09, redesenhada no mesmo dia (pedido do Pedro: layouts do ME, copy
 * daqui).
 *
 * ─── DE ONDE VEM O LAYOUT ───────────────────────────────────────────────────
 * Do E3.4 (`EnderecoCategoriaView` em `entrada-lead.tsx`): duas seções com
 * título em `body-strong` + linha de apoio, a categoria num **`Select` do DS**
 * (era pill até 27/08, quando o Pedro pediu dropdown: 14 opções em pill
 * quebram em várias linhas e pesam a tela), e o endereço logo abaixo com CEP
 * + autofill.
 *
 * A ORDEM também veio de lá, e é decisão: a categoria vem ANTES do endereço
 * (mudança de 29/08). Quem abandona no meio já deixou o dado mais útil.
 *
 * ⚠️ Reescrito, não importado: a trava de fronteira proíbe o ramo MEI de
 * importar tela de ME. E a lista de categorias é a do Anexo XI
 * (`CATEGORIAS_MEI`), não as `PILLS` do ME — universos diferentes que por
 * acaso se encontram.
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
 *      Res. CGSIM 22/2010), então seria vender solução pra um problema que
 *      ele não tem. (Erro nº 1 da auditoria de 28/08.)
 *
 *   3. **A frase sobre viabilidade sai.** A E3.4 avisava que "a prefeitura
 *      confirma na viabilidade". A consulta prévia foi **extinta pro MEI**
 *      (Res. CGSIM 61/2020) e o alvará é dispensado por declaração. Repetir a
 *      frase do ME criaria expectativa de uma espera que não vai acontecer.
 *      (Erro nº 2 da mesma auditoria.)
 *
 * ─── A PERGUNTA QUE NASCE AQUI E NÃO EXISTE NO ME ───────────────────────────
 * **A forma de endereço.** Ela não é decoração: interage com a dispensa de
 * alvará (o Termo de Ciência declara atividade de baixo risco) e com a
 * validade de usar a casa como endereço comercial. No ME essa pergunta não faz
 * sentido, porque a sede tem que ser um endereço comercial em BH.
 *
 * ✍️ As 3 categorias sem MEI aparecem na lista, marcadas "(só como ME)" — o
 * MESMO tratamento do E3.4 (decisão 27/08). Some-las faria a pessoa achar que
 * a gente não atende a atividade dela.
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
  setCategoria: (v: string | null) => void;
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

  const categoriaSemMei = categoria !== null && !categoriaTemMei(categoria);

  const completo =
    categoria !== null &&
    !categoriaSemMei &&
    forma !== null &&
    achado !== null &&
    numero.trim().length > 0;

  return (
    <>
      <TelaHeader meta={meta} onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo sub="Duas perguntas rápidas">Sobre o seu trabalho</Titulo>

        <Corpo>
          {/* ═══ 1 · O QUE A PESSOA FAZ ═════════════════════════════════════
              Vem ANTES do endereço (decisão de 29/08 no ME): quem abandona no
              meio já deixou o dado mais útil. */}
          <div>
            <p className="text-body-strong font-semibold mb-1">O que você faz?</p>
            <p className="text-caption text-text-secondary mb-3">
              Escolha o que mais se parece. A ocupação exata você escolhe
              depois, de uma lista do governo.
            </p>

            <Select
              valor={categoria ?? ""}
              onChange={(v) => setCategoria(v || null)}
              opcoes={CATEGORIAS_MEI.map((c) => ({
                v: c.id,
                label: categoriaTemMei(c.id) ? c.label : `${c.label} (só como ME)`,
              }))}
              placeholder="Escolha uma categoria"
            />

            {/* 🔴 A porta fechada que vira porta aberta — mesmo bloco do E3.4,
                onde ele nasceu justamente pro caminho MEI. */}
            {categoriaSemMei && (
              <div className="mt-3 flex flex-col gap-3">
                <Aviso neutro variante="info" titulo="Essa atividade não pode ser MEI">
                  A lei não considera empresário quem exerce profissão
                  intelectual (art. 966 do Código Civil), então tecnologia,
                  design e consultoria não entram na lista do MEI. Não é escolha
                  nossa, e não tem exceção.
                </Aviso>
                <p className="text-caption text-text-secondary">
                  A boa notícia: a gente atende essa atividade como ME no
                  Simples Nacional, que é o caminho certo pro seu caso.
                </p>
                <Button full onClick={onQueroMe}>
                  Continuar como ME
                </Button>
              </div>
            )}
          </div>

          {/* ═══ 2 · ONDE ELA VAI FICAR ═════════════════════════════════════ */}
          {!categoriaSemMei && categoria && (
            <div>
              <p className="text-body-strong font-semibold mb-1">
                Onde ela vai ficar?
              </p>
              <p className="text-caption text-text-secondary mb-3">
                É o endereço que vai ficar no seu CNPJ, e pode ser o da sua
                casa. Como MEI, você abre de qualquer cidade do Brasil.
              </p>

              {/* A pergunta que só existe no MEI. Cartões-linha, o mesmo
                  idioma da lista de inclusos do E7. */}
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
            </div>
          )}

          {!categoriaSemMei && forma && (
            <>
              <Campo
                rotulo="CEP do endereço que vai no cadastro"
                dica={
                  forma === "casa"
                    ? "Pode ser o da sua casa mesmo. No MEI isso vale como endereço comercial: é a lei (LC 123, art. 3º-A), não um jeitinho."
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
                  <div className="grid grid-cols-2 gap-3">
                    <Campo rotulo="Número">
                      <Texto
                        valor={numero}
                        onChange={setNumero}
                        placeholder="123"
                        inputMode="numeric"
                      />
                    </Campo>
                    <Campo rotulo="Complemento">
                      <Texto
                        valor={complemento}
                        onChange={setComplemento}
                        placeholder="Apto, sala"
                      />
                    </Campo>
                  </div>

                  <p className="text-micro text-text-tertiary">
                    {achado.municipio} · {achado.uf}. A cidade não muda nada no
                    seu MEI: a gente cuida da contabilidade de qualquer lugar do
                    Brasil.
                  </p>
                </>
              )}

              {/* 🎯 O aviso que só existe no MEI, e é a boa notícia que o ME
                  não tem. `CardNota` positivo (não bloco tingido): é
                  informação, não alerta — mesma correção que o E9 fez em
                  01/09. Chega ANTES de a pessoa se preocupar, em vez de ela
                  passar o flow inteiro esperando um alvará que não vem. */}
              <CardNota variante="positivo" titulo="Sem alvará e sem análise prévia">
                No MEI a prefeitura não analisa nada antes: você declara que a
                atividade é de baixo risco e o registro sai na hora. A consulta
                de viabilidade, que existe pra empresa comum, foi extinta pro
                MEI em 2020.
              </CardNota>
            </>
          )}
        </Corpo>

        <Rodape>
          {/* O botão DIZ O QUE FALTA, régua de 04/09. */}
          <Button full disabled={!completo || categoriaSemMei} onClick={onSeguir}>
            {!categoria
              ? "Escolha o que você faz"
              : categoriaSemMei
                ? "Essa atividade não pode ser MEI"
                : !forma
                  ? "Diga de onde você trabalha"
                  : !achado
                    ? "Informe o CEP"
                    : !numero.trim()
                      ? "Falta o número"
                      : "Continuar"}
          </Button>
        </Rodape>
      </main>
    </>
  );
}
