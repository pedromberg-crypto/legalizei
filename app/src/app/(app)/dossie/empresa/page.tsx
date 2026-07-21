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
  Aviso,
} from "../campos";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N13 — DADOS DA EMPRESA · A1 · shell APP
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: spec-telas-entrada-b1-b2.md → Tela 9 (2.4) · mapa T9→N13
 * Motor: b2.coleta (empresa) · flag de endereço fiscal → injeta no plano do B3
 *
 * Regras da spec:
 *   · Índice cadastral IPTU guardado pro registro em BH (🟡 opcional se não tem).
 *   · UPSELL endereço fiscal Legalizai: NÃO bloqueia — só oferece. Se aceita,
 *     salva flag + injeta no plano do B3. Resolve "sem endereço comercial".
 *   · Capital social > 0; IA alerta se muito baixo/alto.
 *   · Tipo de endereço afeta viabilidade em BH (flag pra blocos futuros).
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

function mascaraCep(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.replace(/(\d{5})(\d)/, "$1-$2");
}
function mascaraReais(v: string) {
  const d = v.replace(/\D/g, "");
  if (!d) return "";
  return Number(d).toLocaleString("pt-BR");
}

export default function EmpresaPage() {
  const [usarProprio, setUsarProprio] = useState<boolean | null>(null);
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [iptu, setIptu] = useState("");
  const [tipo, setTipo] = useState("");
  const [capital, setCapital] = useState("");

  const querFiscal = usarProprio === false;
  const cepCheio = cep.replace(/\D/g, "").length === 8;
  const capitalNum = Number(capital.replace(/\D/g, "")) || 0;
  const capitalBaixo = capitalNum > 0 && capitalNum < 1000;

  // Se pega endereço fiscal, o endereço próprio deixa de ser obrigatório.
  const completo =
    querFiscal ||
    (usarProprio === true && cepCheio && numero.trim() !== "" && tipo !== "" && capitalNum > 0);

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
              <Campo rotulo="CEP da empresa" dica="A gente completa a rua.">
                <Texto
                  valor={cep}
                  onChange={(v) => setCep(mascaraCep(v))}
                  placeholder="00000-000"
                  inputMode="numeric"
                />
              </Campo>
              {cepCheio && (
                <div className="-mt-3 grid grid-cols-[1fr_auto] gap-3">
                  <div className="flex min-h-12 items-center rounded-md border border-border-hairline bg-surface-alt px-3 text-caption text-text-secondary">
                    Rua encontrada pelo CEP
                  </div>
                  <div className="w-24">
                    <Texto
                      valor={numero}
                      onChange={setNumero}
                      placeholder="Nº"
                      inputMode="numeric"
                    />
                  </div>
                </div>
              )}

              <Campo
                rotulo="Índice cadastral do IPTU"
                dica="Está no carnê do IPTU. Se não tiver agora, a gente segue e pede depois."
              >
                <Texto
                  valor={iptu}
                  onChange={setIptu}
                  placeholder="Opcional"
                  inputMode="numeric"
                />
              </Campo>

              <Campo rotulo="Como é esse endereço?">
                <Select valor={tipo} onChange={setTipo} opcoes={TIPO_ENDERECO} />
              </Campo>
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
