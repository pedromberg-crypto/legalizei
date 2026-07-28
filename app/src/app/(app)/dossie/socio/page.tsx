"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
 * N10 — SEUS DADOS (confirmação) · arquétipo A5 (recap) → A1 (o que faltou)
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: execucao/spec-telas-entrada-b1-b2.md → Tela 6 (2.1) · mapa T6→N10
 *
 * ⚠️ REESCRITA 28/07 (reunião Rua Satélite 9) — VIRA CONFIRMAÇÃO, não coleta
 * do zero. Nome/CPF/telefone/endereço migraram pro N6 (front-load, criar
 * conta). Aqui a pessoa só CONFERE (com "editar" pra cada bloco) e preenche
 * o que faltou: RG, órgão emissor, estado civil (+ regime de bens), e
 * confirma se mora fora do Brasil.
 *
 * "Editar" é mock — mesmo padrão do N19 (Ajustar): no app real abre só
 * aquele campo, salva e volta pra cá, sem re-andar o N6 inteiro.
 *
 * Regras que seguem valendo:
 *   · Comunhão universal dispara aviso do cônjuge CEDO (UX-30).
 *   · "Reside no exterior?" aqui é CONFIRMAÇÃO — a triagem do N4 já perguntou
 *     (UX-21 fail-fast). Sim = bloqueio que educa, fora do Simples (LC 123 art.17).
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Herdado do N6 (mock, sem estado real compartilhado ainda).
const JA_CAPTADO = {
  nome: "Ana Beatriz Ramos",
  cpf: "123.456.789-00",
  telefone: "(31) 99999-0000",
  endereco: "Rua dos Timbiras, 1200, Funcionários, Belo Horizonte/MG",
};

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

export default function SocioPage() {
  const [rg, setRg] = useState("");
  const [orgao, setOrgao] = useState("");
  const [civil, setCivil] = useState("");
  const [regime, setRegime] = useState("");
  const [exterior, setExterior] = useState<boolean | null>(null);

  const completo =
    rg.trim() !== "" &&
    orgao.trim() !== "" &&
    civil !== "" &&
    (civil !== "casado" || regime !== "") &&
    exterior === false;

  return (
    <>
      {/* "Seus dados", não "Dados do sócio" (19/07): quem abre sozinho não se
          vê como sócio, se vê como dono. */}
      <TelaHeader meta="Seus dados" />

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
              <LinhaConfirma rotulo="Nome" valor={JA_CAPTADO.nome} />
              <LinhaConfirma rotulo="CPF" valor={JA_CAPTADO.cpf} />
              <LinhaConfirma rotulo="Telefone" valor={JA_CAPTADO.telefone} />
              <LinhaConfirma rotulo="Endereço" valor={JA_CAPTADO.endereco} />
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
              Morando fora, a empresa pode existir, mas não pelo Simples. Nosso
              time te mostra as opções, e você não perde nada do que já preencheu.
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

function LinhaConfirma({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-micro text-text-tertiary">{rotulo}</span>
      <span className="text-caption text-text-primary">{valor}</span>
    </div>
  );
}
