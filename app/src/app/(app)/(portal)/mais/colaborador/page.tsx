"use client";

import { useSearchParams } from "next/navigation";
import { TelaHeader } from "@/components/ui/tela";
import { Button } from "@/components/ui/button";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAIS · MEU COLABORADOR — 🆕 04/08 (Plano MEI). Drill-down de /mais.
 * ═══════════════════════════════════════════════════════════════════════════
 * Exclusiva do plano MEI: a lei permite ao MEI ter **1 funcionário** com
 * carteira assinada (diferente de sócio — MEI não tem sócio, `/mais/socios`
 * não se aplica a ele). Substitui esse item no hub `/mais` quando `mei`.
 *
 * Cadastrar não é self-serve de verdade: mexe com eSocial/FGTS/INSS
 * patronal — o formulário aqui é a COLETA, o processamento é da gente
 * (mesma doutrina de "documento que precisa ser emitido vai pra Serviços",
 * só que aqui o serviço já está incluso no Plano MEI, não é avulso).
 *
 * `?cenario=cadastrado` mostra o estado COM colaborador já ativo (farol).
 * ⚠️ Dados = FAROL/mock.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const COLABORADOR = {
  nome: "Rafael Costa Lima",
  ini: "RC",
  cpf: "•••.789.123-••",
  cargo: "Assistente administrativo",
  admissao: "03/06/2026",
  salario: "R$ 1.621,00",
};

export default function ColaboradorPage() {
  const searchParams = useSearchParams();
  const cadastrado = searchParams.get("cenario") === "cadastrado";

  return (
    <>
      <TelaHeader meta="Sua empresa · Colaborador" voltar="/mais" />

      <main className="app-main">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            className="flex flex-col gap-6 pt-2"
            style={{ paddingBottom: "calc(24px + var(--safe-bottom))" }}
          >
            <div>
              <h1 className="text-h1 text-text-primary">Meu colaborador</h1>
              <p className="mt-1 text-body text-text-secondary">
                A lei permite ao MEI ter até 1 funcionário com carteira
                assinada. Seu plano já inclui isso.
              </p>
            </div>

            {cadastrado ? (
              <>
                <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-dark text-body font-bold text-text-on-dark">
                      {COLABORADOR.ini}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-body font-semibold text-text-primary">
                        {COLABORADOR.nome}
                      </p>
                      <p className="text-micro text-text-tertiary">
                        {COLABORADOR.cargo} · CPF {COLABORADOR.cpf}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-state-success-tint px-2.5 py-1 text-micro font-semibold text-state-success-text">
                      Ativo
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border-hairline pt-3">
                    <Dado rotulo="Admissão" valor={COLABORADOR.admissao} />
                    <Dado rotulo="Salário" valor={COLABORADOR.salario} />
                  </div>
                </div>

                <div className="rounded-2xl border border-border-hairline bg-surface-alt p-4">
                  <p className="text-caption font-semibold text-text-primary">
                    O que a gente já cuida
                  </p>
                  <p className="mt-1 text-micro text-text-secondary">
                    FGTS, INSS patronal e a folha de pagamento dele são
                    calculados e recolhidos automaticamente. Você não precisa
                    lembrar de nada.
                  </p>
                </div>

                <Button variant="secondary" full>
                  Desligar colaborador
                </Button>
              </>
            ) : (
              <>
                <div className="rounded-2xl border border-dashed border-border-hairline bg-surface-alt p-4 text-center">
                  <p className="text-body font-semibold text-text-primary">
                    Você ainda não tem colaborador cadastrado
                  </p>
                  <p className="mt-1 text-micro text-text-secondary">
                    Só dá pra ter 1 (é o limite do MEI). A gente cuida do
                    registro no eSocial, FGTS e INSS patronal por você.
                  </p>
                </div>

                <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
                  <p className="text-body font-semibold text-text-primary mb-3">
                    Dados do colaborador
                  </p>
                  <div className="flex flex-col gap-3">
                    <CampoMock rotulo="Nome completo" placeholder="Nome do colaborador" />
                    <CampoMock rotulo="CPF" placeholder="000.000.000-00" />
                    <CampoMock rotulo="Cargo" placeholder="Ex: Assistente administrativo" />
                    <CampoMock rotulo="Salário combinado" placeholder="R$ 0,00" />
                  </div>
                  <p className="mt-3 text-micro text-text-tertiary">
                    Depois de enviar, a gente processa o registro — não é
                    instantâneo, envolve órgãos de verdade (eSocial/FGTS).
                  </p>
                </div>

                <Button full>Enviar pra registro</Button>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

function Dado({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <p className="text-micro text-text-tertiary">{rotulo}</p>
      <p className="mt-0.5 text-caption font-semibold text-text-primary">{valor}</p>
    </div>
  );
}

/** Campo estático (farol) — sem estado, é coleta de mock. */
function CampoMock({ rotulo, placeholder }: { rotulo: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="text-caption font-semibold text-text-primary">{rotulo}</span>
      <input
        placeholder={placeholder}
        className="mt-1.5 w-full min-h-12 rounded-md border border-border-hairline
                   bg-surface-card px-3 text-body text-text-primary
                   placeholder:text-text-muted focus:border-border-focus
                   focus:outline-none"
      />
    </label>
  );
}
