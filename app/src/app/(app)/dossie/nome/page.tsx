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
  Aviso,
} from "../campos";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N16 — RAZÃO SOCIAL + OBJETO SOCIAL + NOME FANTASIA · A1 · shell APP
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: spec-telas-entrada-b1-b2.md → Tela 12 (2.7) · mapa T12→N16
 * Motor: b2.coleta (nome) · última tela da coleta antes do N18
 *
 * ⚠️ REESCRITA 28/07 (cruzamento de dados JUCEMG) — 2 mudanças de fundo:
 *
 * 1. RAZÃO SOCIAL: 3 OPÇÕES POR PRIORIDADE, não 1 campo com "check ao vivo".
 *    Não existe API de consulta prévia na Junta (o "Nome disponível na Junta"
 *    antigo MENTIA — não tínhamos como saber isso). A honestidade possível:
 *    a IA sugere 3 nomes, a pessoa ORDENA por prioridade (1ª/2ª/3ª escolha,
 *    sem drag — reordena com ▲▼, mesmo padrão de botão do resto do DS), e a
 *    gente tenta registrar nessa ordem. Se a 1ª cair, tenta a 2ª, sem travar
 *    o cliente. Deixa EXPLÍCITO que a ordem não muda nada na abertura.
 *
 * 2. OBJETO SOCIAL: campo novo, sugerido por IA a partir do CNAE principal +
 *    secundárias (herdados do N4/N14). Editável, mas não em branco — ninguém
 *    deveria escrever objeto social do zero.
 *
 * Nome fantasia segue igual (opcional).
 *
 * 🚧 Mock: as 3 sugestões e o objeto social são gerados por template aqui;
 * no app real vêm de um provider de IA + os CNAEs reais do wizard (hoje sem
 * estado compartilhado entre telas — ver nota em flow-data.mjs/HOME).
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Herdado do N10 (mock).
const NOME_SOCIO = "Ana Souza";
// Herdados do N4 (principal) + N14 (secundárias) — mock, sem estado real ainda.
const CNAE_PRINCIPAL = { cnae: "6201-5/02", humano: "criação de sites e web design" };
const CNAES_SECUNDARIAS = [
  { cnae: "6202-3/00", humano: "desenvolvimento de sistemas sob encomenda" },
  { cnae: "7410-2/99", humano: "design gráfico e identidade visual" },
];

// 3 sugestões da IA, já na ordem de prioridade default (a pessoa pode reordenar).
const SUGESTOES_RAZAO = [
  `${NOME_SOCIO} Web Studio`,
  `${NOME_SOCIO} Desenvolvimento de Software`,
  `${NOME_SOCIO.split(" ")[0]} Tecnologia ME`,
];

// Objeto social gerado por template a partir do principal + secundárias.
function gerarObjetoSocial(): string {
  const secs = CNAES_SECUNDARIAS.map((s) => s.humano).join(", ");
  return `Prestação de serviços de ${CNAE_PRINCIPAL.humano}, podendo também exercer ${secs}.`;
}

export default function NomePage() {
  const [ordem, setOrdem] = useState<string[]>(SUGESTOES_RAZAO);
  const [fantasia, setFantasia] = useState("");
  const [objeto, setObjeto] = useState(gerarObjetoSocial());

  const completo = objeto.trim().length >= 10;

  function mover(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= ordem.length) return;
    setOrdem((o) => {
      const novo = [...o];
      [novo[i], novo[j]] = [novo[j], novo[i]];
      return novo;
    });
  }

  return (
    <>
      <TelaHeader meta="Nome da empresa" />

      <main className="app-main">
        <Titulo sub="A gente sugeriu 3 nomes. Escolha a ORDEM que quer que a gente tente registrar.">
          Qual nome você prefere?
        </Titulo>

        <Corpo>
          {/* Sem API de disponibilidade: em vez de fingir "disponível na Junta",
              a gente é honesta sobre o que dá pra prometer — tentar em ordem. */}
          <div>
            <p className="text-caption font-semibold text-text-primary mb-2">
              Suas 3 opções, na ordem que a gente vai tentar
            </p>
            <div className="flex flex-col gap-2">
              {ordem.map((nome, i) => (
                <div
                  key={nome}
                  className="flex items-center gap-3 rounded-md border border-border-hairline bg-surface-card p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-tint-brand text-caption font-bold text-action-primary-sm">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-body font-semibold text-text-primary">
                    {nome}
                  </span>
                  <div className="flex shrink-0 flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => mover(i, -1)}
                      disabled={i === 0}
                      aria-label="Subir prioridade"
                      className="flex h-6 w-6 items-center justify-center rounded text-text-secondary transition-colors hover:bg-surface-alt disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => mover(i, 1)}
                      disabled={i === ordem.length - 1}
                      aria-label="Descer prioridade"
                      className="flex h-6 w-6 items-center justify-center rounded text-text-secondary transition-colors hover:bg-surface-alt disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Aviso variante="info" titulo="A ordem não muda nada na abertura">
            A gente tenta registrar a 1ª opção na Junta. Se ela não passar, já
            seguimos pra 2ª, e depois a 3ª — sem te avisar toda vez nem travar
            o processo.
          </Aviso>

          {/* Objeto social — sugerido por IA a partir do CNAE principal +
              secundárias, NUNCA em branco. */}
          <Campo
            rotulo="Objeto social"
            dica="O que a empresa faz, em texto oficial. Já sugerimos a partir das suas atividades."
          >
            <textarea
              value={objeto}
              onChange={(e) => setObjeto(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-md border border-border-hairline bg-surface-card p-3
                         text-body text-text-primary placeholder:text-text-muted
                         focus:border-border-focus focus:outline-none"
            />
          </Campo>

          <Campo
            rotulo="Nome fantasia"
            dica="Opcional. É a marca que aparece pro cliente."
          >
            <Texto
              valor={fantasia}
              onChange={setFantasia}
              placeholder="Como o público vai te conhecer"
            />
          </Campo>
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
