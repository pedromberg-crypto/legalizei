"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { TelaHeader } from "@/components/ui/tela";
import { Button } from "@/components/ui/button";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAIS · CERTIFICADO DIGITAL — o gate universal (27/07). Drill-down de /mais.
 * ═══════════════════════════════════════════════════════════════════════════
 * O certificado é o que destrava TUDO (emitir nota, cuidar de imposto, assinar
 * declaração). Aqui mostra o estado dele: no mock, ATIVO (e-CNPJ A1, válido até
 * 12/2027, coerente com o Perfil). Ações: renovar (serviço, quando aproxima o
 * vencimento) e trocar.
 *
 * 🆕 06/08 — o estado PENDENTE, que até aqui só existia de nome no comentário
 * ("se estivesse pendente, o mesmo layout vira alerta + enviar certificado"),
 * ganhou tela de verdade: upload do arquivo (.pfx/.p12) + senha. É o passo que
 * `MigrarDiagnosticoView` promete pra quem já tem certificado próprio ("vai
 * precisar subir os arquivos do seu certificado") — antes a promessa não tinha
 * onde pousar dentro do app. `?status=pendente` simula o estado pra review,
 * sem mexer no mock de ATIVO que já foi validado.
 *
 * ⚠️ Dados = FAROL/mock.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const CERT = {
  tipo: "e-CNPJ A1",
  titular: "54.321.000/0001-09",
  emissor: "AC Certisign",
  emitidoEm: "12/12/2025",
  validoAte: "12/12/2027",
  restante: "faltam ~16 meses",
};

export default function CertificadoPage() {
  return (
    <Suspense fallback={null}>
      <CertificadoConteudo />
    </Suspense>
  );
}

function CertificadoConteudo() {
  const searchParams = useSearchParams();
  const pendenteInicial = searchParams.get("status") === "pendente";
  const [status, setStatus] = useState<"ativo" | "pendente">(
    pendenteInicial ? "pendente" : "ativo",
  );
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);

  function enviar() {
    setEnviando(true);
    // 🌾 mesmo padrão do "Analisando" do M1 (migrar): loading que explica,
    // não trava sem feedback. Aqui simula a validação do arquivo+senha.
    setTimeout(() => {
      setEnviando(false);
      setStatus("ativo");
    }, 1200);
  }

  if (status === "pendente") {
    return (
      <CertificadoPendente
        arquivo={arquivo}
        setArquivo={setArquivo}
        senha={senha}
        setSenha={setSenha}
        enviando={enviando}
        onEnviar={enviar}
      />
    );
  }

  return <CertificadoAtivo />;
}

/* ═══════════════════ estado ATIVO (mock original, 27/07) ════════════════ */

function CertificadoAtivo() {
  return (
    <>
      <TelaHeader meta="Sua empresa · Certificado" voltar="/mais" />

      <main className="app-main">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            className="flex flex-col gap-6 pt-2"
            style={{ paddingBottom: "calc(24px + var(--safe-bottom))" }}
          >
            {/* Cabeçalho */}
            <div>
              <h1 className="text-h1 text-text-primary">Certificado digital</h1>
              <p className="mt-1 text-body text-text-secondary">
                A chave que deixa a gente emitir nota e cuidar dos seus impostos
                por você.
              </p>
            </div>

            {/* Status hero — ATIVO */}
            <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-state-success-tint text-state-success-text">
                  <IconeEscudo />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-body font-semibold text-text-primary">
                    Certificado ativo
                  </p>
                  <p className="text-caption text-text-secondary">
                    {CERT.tipo} · válido até {CERT.validoAte}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-state-success-tint px-2.5 py-1 text-micro font-semibold text-state-success-text">
                  Em dia
                </span>
              </div>
              <p className="mt-3 border-t border-border-hairline pt-3 text-micro text-text-tertiary">
                {CERT.restante}. A gente avisa e renova bem antes de vencer, pra
                nunca travar sua emissão.
              </p>
            </div>

            {/* O que ele destrava */}
            <div>
              <p className="mb-2 text-body-strong font-semibold text-text-primary">
                O que ele destrava
              </p>
              <div className="flex flex-col gap-2">
                <Destrava>Emitir nota fiscal (NF-e) em segundos</Destrava>
                <Destrava>Calcular e gerar suas guias de imposto</Destrava>
                <Destrava>Assinar declarações e certidões por você</Destrava>
              </div>
            </div>

            {/* Detalhes */}
            <div>
              <p className="mb-2 text-body-strong font-semibold text-text-primary">
                Detalhes
              </p>
              <div className="overflow-hidden rounded-2xl border border-border-hairline bg-surface-card">
                <Linha rotulo="Tipo" valor={CERT.tipo} />
                <Linha rotulo="Titular (CNPJ)" valor={CERT.titular} />
                <Linha rotulo="Emissor" valor={CERT.emissor} />
                <Linha rotulo="Emitido em" valor={CERT.emitidoEm} />
                <Linha rotulo="Válido até" valor={CERT.validoAte} />
              </div>
            </div>

            {/* Ações */}
            <div className="rounded-2xl border border-border-hairline bg-surface-alt p-4">
              <p className="text-caption font-semibold text-text-primary">
                Vai renovar ou trocar?
              </p>
              <p className="mt-1 text-micro text-text-secondary">
                A renovação é um serviço à parte, mas a gente conduz do começo ao
                fim. Você não precisa mexer em nada nos órgãos.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href="/mais/servicos?abrir=renovacao-cert"
                  className="inline-flex min-h-10 items-center justify-center rounded-md bg-action-primary-sm px-4 text-body font-semibold text-text-on-brand transition-colors hover:bg-action-primary-hover"
                >
                  Renovar certificado
                </Link>
                <button
                  type="button"
                  className="inline-flex min-h-10 items-center justify-center rounded-md border border-border-strong px-4 text-body font-semibold text-text-primary transition-colors hover:bg-surface-alt"
                >
                  Trocar certificado
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

/* ═══════════════════ estado PENDENTE (🆕 06/08) ══════════════════════════ */

function CertificadoPendente({
  arquivo,
  setArquivo,
  senha,
  setSenha,
  enviando,
  onEnviar,
}: {
  arquivo: File | null;
  setArquivo: (f: File | null) => void;
  senha: string;
  setSenha: (v: string) => void;
  enviando: boolean;
  onEnviar: () => void;
}) {
  const completo = arquivo !== null && senha.trim() !== "";

  return (
    <>
      <TelaHeader meta="Sua empresa · Certificado" voltar="/mais" />

      <main className="app-main">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            className="flex flex-col gap-6 pt-2"
            style={{ paddingBottom: "calc(24px + var(--safe-bottom))" }}
          >
            <div>
              <h1 className="text-h1 text-text-primary">Certificado digital</h1>
              <p className="mt-1 text-body text-text-secondary">
                Falta só subir o seu certificado pra gente liberar tudo.
              </p>
            </div>

            {/* Status hero — PENDENTE */}
            <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-state-warning-tint text-state-warning-text">
                  <IconeAlerta />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-body font-semibold text-text-primary">
                    Certificado pendente
                  </p>
                  <p className="text-caption text-text-secondary">
                    Sem ele, a gente não emite nota nem paga guia por você.
                  </p>
                </div>
              </div>
              <p className="mt-3 border-t border-border-hairline pt-3 text-micro text-text-tertiary">
                Você disse que já tem certificado próprio — é só subir o arquivo
                e a senha. A gente confere e libera em minutos.
              </p>
            </div>

            {/* Upload */}
            <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
              <p className="mb-3 text-body-strong font-semibold text-text-primary">
                Enviar certificado
              </p>

              <label className="block">
                <span className="text-micro text-text-tertiary">
                  Arquivo do certificado (.pfx ou .p12)
                </span>
                <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-dashed border-border-strong bg-surface-alt px-3 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-card text-text-secondary">
                    <IconeUpload />
                  </span>
                  <span className="min-w-0 flex-1 text-caption text-text-secondary">
                    {arquivo ? (
                      <span className="truncate font-semibold text-text-primary">
                        {arquivo.name}
                      </span>
                    ) : (
                      "Toque pra escolher o arquivo"
                    )}
                  </span>
                  <input
                    type="file"
                    accept=".pfx,.p12"
                    onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
                    className="absolute h-0 w-0 opacity-0"
                    aria-label="Arquivo do certificado"
                  />
                </div>
              </label>

              <label className="mt-4 block">
                <span className="text-micro text-text-tertiary">
                  Senha do certificado
                </span>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="A mesma senha que você usa pra assinar"
                  className="mt-1.5 w-full min-h-12 rounded-md border border-border-hairline bg-surface-card px-3 text-body text-text-primary
                             placeholder:text-text-muted focus:border-border-focus focus:outline-none"
                />
              </label>

              <p className="mt-3 text-micro text-text-tertiary">
                A senha fica guardada só pra assinar em seu nome — a gente nunca
                usa pra mais nada.
              </p>
            </div>

            <Button full disabled={!completo || enviando} onClick={onEnviar}>
              {enviando ? "Conferindo..." : "Enviar certificado"}
            </Button>

            <div className="rounded-2xl border border-border-hairline bg-surface-alt p-4">
              <p className="text-caption font-semibold text-text-primary">
                Não tem certificado próprio?
              </p>
              <p className="mt-1 text-micro text-text-secondary">
                A gente providencia um novo pra você, sem depender de ninguém.
              </p>
              <Link
                href="/mais/servicos?abrir=renovacao-cert"
                className="mt-3 inline-flex min-h-10 items-center justify-center rounded-md border border-border-strong px-4 text-body font-semibold text-text-primary transition-colors hover:bg-surface-alt"
              >
                Emitir certificado novo
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

/* ─── auxiliares ───────────────────────────────────────────────────────────── */
function Destrava({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-state-success-tint text-state-success-text">
        <IconeCheck />
      </span>
      <span className="text-caption text-text-secondary">{children}</span>
    </div>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-border-hairline px-4 py-3 last:border-b-0">
      <p className="w-32 shrink-0 text-micro text-text-tertiary">{rotulo}</p>
      <p className="min-w-0 flex-1 text-caption font-medium text-text-primary">
        {valor}
      </p>
    </div>
  );
}

function IconeEscudo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function IconeCheck() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}
function IconeAlerta() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4M12 17v.01" />
    </svg>
  );
}
function IconeUpload() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
    </svg>
  );
}
