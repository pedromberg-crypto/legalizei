"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  TelaHeader,
  Titulo,
  Corpo,
  Rodape,
  Campo,
  Texto,
  Select,
  OpcoesLinha,
  Aviso,
} from "../campos";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N13 — DADOS DA EMPRESA · A1 · shell APP
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: spec-telas-entrada-b1-b2.md → Tela 9 (2.4) · mapa T9→N13
 * Motor: b2.coleta (empresa) · flag de endereço fiscal → injeta no plano do B3
 *
 * ⚠️ REESCRITA 28/07 (cruzamento de dados JUCEMG):
 *
 * 1. CEP AGORA PUXA TUDO — logradouro, bairro, município, UF. Antes era um
 *    placeholder decorativo ("Rua encontrada pelo CEP", texto fixo, nenhum
 *    dado real). A pessoa só COMPLEMENTA (número + complemento).
 *
 * 2. RESIDÊNCIA DE SÓCIO — pergunta nova, DINÂMICA pelo que foi respondido
 *    na triagem do N4: solo → a pergunta nem aparece (não existe "outro
 *    sócio" pra confirmar). Com sócio (2, o máximo do MLP) → trava até
 *    responder pelos DOIS, nominalmente.
 *
 * 3. ÁREA UTILIZADA (m²) — de propósito FORA da UI. É dado interno nosso,
 *    preenchido automaticamente por trás (é prestação de serviço, não
 *    precisamos que o cliente saiba disso). NÃO adicionar campo aqui.
 *
 * 4. ATIVIDADE INÓCUA — também de propósito FORA da UI. É derivada do CNAE
 *    (baixo impacto, elegível a funcionar em residência) internamente, na
 *    arrecadação do resto dos dados. O `tipo` abaixo (próprio/coworking/
 *    virtual) é um campo DIFERENTE — sobre o imóvel, não sobre a atividade.
 *
 * 🕓 Preço do endereço fiscal = placeholder FAKE (~R$60/mês). Não reabrir até
 * o Pedro fechar custo (legalize-preco-deferido-custo-real). Marcado na UI.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const TIPO_ENDERECO = [
  { v: "proprio", label: "Endereço próprio (casa ou ponto)" },
  { v: "coworking", label: "Coworking" },
  { v: "virtual", label: "Endereço virtual" },
];

// Herdado da triagem do N4 (mock, sem estado real ainda). 1 = solo, 2 = com
// sócio — é o máximo do MLP, 3+ já saiu pela saída graciosa lá atrás.
const SOCIOS_N4: number = 2;
const NOMES_SOCIOS = SOCIOS_N4 === 2 ? ["Ana Beatriz Ramos", "Carlos Eduardo Silva"] : ["Ana Beatriz Ramos"];

function mascaraCep(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.replace(/(\d{5})(\d)/, "$1-$2");
}
function mascaraReais(v: string) {
  const d = v.replace(/\D/g, "");
  if (!d) return "";
  return Number(d).toLocaleString("pt-BR");
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

export default function EmpresaPage() {
  const [usarProprio, setUsarProprio] = useState<boolean | null>(null);
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [iptu, setIptu] = useState("");
  const [tipo, setTipo] = useState("");
  const [capital, setCapital] = useState("");
  const [residenciaSocios, setResidenciaSocios] = useState<Record<string, boolean>>({});

  const querFiscal = usarProprio === false;
  const cepDigitos = cep.replace(/\D/g, "");
  const cepCheio = cepDigitos.length === 8;
  const endereco = buscarCep(cepDigitos);
  const capitalNum = Number(capital.replace(/\D/g, "")) || 0;
  const capitalBaixo = capitalNum > 0 && capitalNum < 1000;

  // Dinâmico pelo N4: solo não precisa responder (não existe outro sócio pra
  // confirmar); com sócio, trava até os DOIS nomes terem resposta.
  const residenciaCompleta =
    SOCIOS_N4 === 1 || NOMES_SOCIOS.every((n) => n in residenciaSocios);

  // Se pega endereço fiscal, o endereço próprio deixa de ser obrigatório.
  const completo =
    querFiscal ||
    (usarProprio === true &&
      cepCheio &&
      numero.trim() !== "" &&
      iptu.trim() !== "" &&
      tipo !== "" &&
      capitalNum > 0 &&
      residenciaCompleta);

  return (
    <>
      <TelaHeader meta="Dados da empresa" />

      <main className="app-main">
        <Titulo sub="O endereço vai no CNPJ e é onde a empresa fica registrada.">
          Onde a empresa fica?
        </Titulo>

        <Corpo>
          {/* Upsell: oferece, não obriga (spec Tela 9). A oferta tem MAIS peso
              que a opção neutra (borda mais forte, chip de preço sólido, linha
              de benefício legível) sem pré-selecionar — chama atenção, não
              empurra. 🕓 R$60 é FAKE (legalize-preco-deferido-custo-real). */}
          <Campo rotulo="Você tem um endereço comercial pra usar?">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setUsarProprio(true)}
                className={`min-h-12 rounded-md border px-4 text-left text-body font-semibold transition-colors
                  ${
                    usarProprio === true
                      ? "border-border-focus bg-surface-tint-brand text-text-primary"
                      : "border-border-hairline bg-surface-card text-text-secondary hover:border-border-strong"
                  }`}
              >
                Uso um endereço meu
              </button>
              <button
                onClick={() => setUsarProprio(false)}
                className={`rounded-md border p-4 text-left transition-colors
                  ${
                    usarProprio === false
                      ? "border-border-focus bg-surface-tint-brand"
                      : "border-border-strong bg-surface-card hover:border-border-focus"
                  }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-body font-semibold text-text-primary">
                    Quero um endereço fiscal da Legalizai
                  </span>
                  {/* chip escuro: AA seguro (texto pequeno em coral falharia) e
                      concreto o bastante pra puxar o olho. */}
                  <span className="shrink-0 rounded-full bg-surface-dark px-2.5 py-1 text-micro font-semibold text-text-on-dark">
                    R$ 60/mês
                  </span>
                </div>
                <p className="text-caption text-text-secondary mt-1.5">
                  Um endereço comercial pronto pra receber a empresa, sem usar o
                  seu. A gente cuida da regularização.
                </p>
              </button>
            </div>
          </Campo>

          {querFiscal && (
            <Aviso variante="success" titulo="A gente cuida do endereço">
              Fechado. Ele entra junto no seu plano.
            </Aviso>
          )}

          {usarProprio === true && (
            <>
              <Campo rotulo="CEP da empresa" dica="A gente puxa o resto do endereço, você só completa.">
                <Texto
                  valor={cep}
                  onChange={(v) => setCep(mascaraCep(v))}
                  placeholder="00000-000"
                  inputMode="numeric"
                />
              </Campo>

              {/* Autofill REAL (mock): logradouro, bairro, município e UF vêm
                  do CEP. A pessoa só completa número + complemento. */}
              {endereco && (
                <>
                  <div className="-mt-3 rounded-md border border-border-hairline bg-surface-alt px-3 py-2.5 text-caption text-text-secondary">
                    {endereco.logradouro}, {endereco.bairro} — {endereco.municipio}/{endereco.uf}
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
                    <Campo rotulo="Complemento" dica="Opcional">
                      <Texto
                        valor={complemento}
                        onChange={setComplemento}
                        placeholder="Bloco, sala..."
                      />
                    </Campo>
                  </div>
                </>
              )}

              {/* ⚠️ 28/07 (reunião Rua Satélite 9): OBRIGATÓRIO, travado — sem
                  ele a documentação não passa na JUCEMG. Antes era opcional. */}
              <Campo
                rotulo="Índice cadastral do IPTU"
                dica="Está no carnê do IPTU. Obrigatório — sem ele a documentação não passa na Junta."
              >
                <Texto
                  valor={iptu}
                  onChange={setIptu}
                  placeholder="000.000.000.000"
                  inputMode="numeric"
                />
              </Campo>

              <Campo rotulo="Como é esse endereço?">
                <Select valor={tipo} onChange={setTipo} opcoes={TIPO_ENDERECO} />
              </Campo>

              {/* Residência de sócio — DINÂMICO pelo N4. Solo: nem aparece
                  (não existe outro sócio pra confirmar). Com sócio: trava até
                  responder pelos dois, nominalmente. */}
              {SOCIOS_N4 > 1 && (
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

          {usarProprio !== null && (
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
          <Button full disabled={!completo}>
            Continuar
          </Button>
        </Rodape>
      </main>
    </>
  );
}
