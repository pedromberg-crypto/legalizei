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
 * N10 — DADOS DO SÓCIO  ·  arquétipo A1 (Pergunta) · shell APP (dentro, pago)
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: execucao/spec-telas-entrada-b1-b2.md → Tela 6 (2.1) · mapa T6→N10
 * Motor: b2.coleta (dados do sócio)
 *
 * Primeira tela da coleta. É a mais longa do dossiê, então é o teste do corpo
 * rolável: título fixo em cima, campos rolam, CTA fixo embaixo.
 *
 * O que a spec exige e por quê:
 *   · CPF valida dígito + situação cadastral (não deixa CPF errado seguir).
 *     🚧 IA dublada: aqui o "regular na Receita" é mock; provider real 🟡.
 *   · Estado civil "casado" REVELA regime de bens (campo condicional).
 *   · Comunhão universal dispara aviso do cônjuge CEDO (UX-30), não no cartório.
 *   · "Reside no exterior?" aqui é CONFIRMAÇÃO — a triagem do N4 já perguntou
 *     (UX-21 fail-fast). Sim = bloqueio que educa, fora do Simples (LC 123 art.17).
 * ═══════════════════════════════════════════════════════════════════════════
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

// 🚧 IA dublada: só o dígito conta (11 números). O "regular na Receita" é o que
// o provider (Serpro/InfoSimples) vai devolver; aqui é mock pra farol.
function mascaraCpf(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function mascaraCep(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.replace(/(\d{5})(\d)/, "$1-$2");
}

export default function SocioPage() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [orgao, setOrgao] = useState("");
  const [civil, setCivil] = useState("");
  const [regime, setRegime] = useState("");
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [contato, setContato] = useState("");
  const [exterior, setExterior] = useState<boolean | null>(null);

  const cpfDigitos = cpf.replace(/\D/g, "");
  const cpfCheio = cpfDigitos.length === 11;
  const nomeOk = nome.trim().split(/\s+/).length >= 2;
  // Mock do autocomplete de CEP: 8 dígitos "acha" o endereço.
  const cepCheio = cep.replace(/\D/g, "").length === 8;

  const completo =
    nomeOk &&
    cpfCheio &&
    rg.trim() !== "" &&
    orgao.trim() !== "" &&
    civil !== "" &&
    (civil !== "casado" || regime !== "") &&
    cepCheio &&
    numero.trim() !== "" &&
    contato.trim() !== "" &&
    exterior === false;

  return (
    <>
      <TelaHeader meta="Dados do sócio" />

      <main className="app-main">
        <Titulo sub="É com eles que a empresa nasce na Junta. Confira com calma.">
          Seus dados
        </Titulo>

        <Corpo>
          <Campo rotulo="Nome completo">
            <Texto
              valor={nome}
              onChange={setNome}
              placeholder="Como está no seu documento"
              erro={
                nome.length > 0 && !nomeOk ? "Escreva o nome completo." : undefined
              }
            />
          </Campo>

          <Campo rotulo="CPF">
            <Texto
              valor={cpf}
              onChange={(v) => setCpf(mascaraCpf(v))}
              placeholder="000.000.000-00"
              inputMode="numeric"
              ok={cpfCheio ? "Encontramos e está regular na Receita." : undefined}
            />
          </Campo>

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

          <Campo rotulo="Seu endereço" dica="A gente completa a rua pelo CEP.">
            <Texto
              valor={cep}
              onChange={(v) => setCep(mascaraCep(v))}
              placeholder="CEP 00000-000"
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

          <Campo rotulo="Seu contato (WhatsApp)">
            <Texto
              valor={contato}
              onChange={setContato}
              placeholder="(31) 90000-0000"
              inputMode="tel"
            />
          </Campo>

          {/* Confirmação, não 1ª notícia: o N4 já perguntou (UX-21). */}
          <Campo rotulo="Você mora fora do Brasil?">
            <OpcoesLinha
              opcoes={[
                { v: false, label: "Não" },
                { v: true, label: "Sim" },
              ]}
              valor={exterior}
              onChange={setExterior}
            />
          </Campo>

          {/* Bloqueio que educa, nunca crash. ⚠️ danger, nunca coral. */}
          {exterior === true && (
            <Aviso variante="danger" titulo="Esse caso a gente resolve com uma pessoa">
              Com sócio morando fora, a empresa até existe, mas fica fora do
              Simples. Nosso time te explica as opções sem você perder o que já
              preencheu.
            </Aviso>
          )}
        </Corpo>

        <Rodape>
          {exterior === true ? (
            <Button full variant="dark">
              Falar com o time
            </Button>
          ) : (
            <Button full disabled={!completo}>
              Continuar
            </Button>
          )}
        </Rodape>
      </main>
    </>
  );
}
