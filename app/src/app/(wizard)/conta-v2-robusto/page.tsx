"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TelaHeader, Titulo, Corpo, Rodape } from "@/components/ui/tela";
import { IconeApple, IconeGoogle } from "@/components/marcas-sociais";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N6 — CRIAR CONTA · REDESIGN v2 ROBUSTO (28/07) — PREVIEW, não substitui /conta.
 * ═══════════════════════════════════════════════════════════════════════════
 * Irmã do /conta-v2 (ajuste contido). Aqui, referência direta ao acervo
 * atualizado (/componentes):
 *   · Os campos de dados pessoais (nome/CPF/telefone/e-mail/senha/endereço)
 *     ganham painel único (rounded-3xl bg-surface-alt p-4, idioma do
 *     /gate/triagem/faixa/waitlist) — cada campo vira card claro dentro dele.
 *   · A pergunta de coorte (opcional, baixo peso) vira PILL row (estilo
 *     CategoriaChips: ativo = coral preenchido) em vez de 2 blocos grandes —
 *     comunica "isso é leve, pode pular" melhor que um segmented control.
 * Login social fica FORA do painel (é caminho alternativo, não dado a
 * preencher). Campo/Texto do DS (ui/form.tsx) não foram tocados — mesma
 * cautela do contido, ver comentário lá.
 * ═══════════════════════════════════════════════════════════════════════════
 */

function mascaraCpf(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
function mascaraTelefone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}
function mascaraCep(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.replace(/(\d{5})(\d)/, "$1-$2");
}

function buscarCep(cepDigitos: string) {
  if (cepDigitos.length !== 8) return null;
  return { logradouro: "Rua dos Timbiras", bairro: "Funcionários", municipio: "Belo Horizonte", uf: "MG" };
}

const CAMPO_CARD =
  "w-full min-h-12 rounded-2xl border border-border-hairline bg-surface-card px-3 text-body text-text-primary shadow-sm placeholder:text-text-muted focus:border-border-focus focus:outline-none";

export default function ContaV2RobustoPage() {
  const router = useRouter();
  const [etapa, setEtapa] = useState<"form" | "codigo">("form");
  const [codigo, setCodigo] = useState("");

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [coorte, setCoorte] = useState<"primeira" | "ja-abri" | null>(null);

  const nomeOk = nome.trim().split(/\s+/).length >= 2;
  const cpfCheio = cpf.replace(/\D/g, "").length === 11;
  const telefoneCheio = telefone.replace(/\D/g, "").length >= 10;
  const cepDigitos = cep.replace(/\D/g, "");
  const cepCheio = cepDigitos.length === 8;
  const endereco = buscarCep(cepDigitos);

  const completo =
    nomeOk && cpfCheio && telefoneCheio && /@/.test(email) && senha.length >= 8 && cepCheio && numero.trim() !== "";

  if (etapa === "codigo") {
    return (
      <>
        <TelaHeader meta="Confirme seu acesso" semVoltar />
        <main className="app-main">
          <Titulo sub={`Mandamos um código de 6 dígitos pro ${email || "seu e-mail"} e por SMS.`}>
            Digite o código
          </Titulo>
          <Corpo>
            <div className="rounded-3xl bg-surface-alt p-4">
              <p className="mb-1.5 text-caption font-semibold text-text-primary">Código de verificação</p>
              <input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                inputMode="numeric"
                className={CAMPO_CARD}
              />
            </div>
            <p className="text-micro text-text-tertiary">Não chegou? Confere o spam ou pede um novo em 30s.</p>
          </Corpo>
          <Rodape>
            <Button full disabled={codigo.length !== 6} onClick={() => router.push("/plano")}>
              Confirmar
            </Button>
          </Rodape>
        </main>
      </>
    );
  }

  return (
    <>
      <TelaHeader meta="Sua conta" semVoltar />
      <main className="app-main">
        <Titulo sub="Assim seu progresso fica salvo, e a gente já adianta o que precisa pra Junta.">
          Vamos criar seu acesso
        </Titulo>
        <Corpo>
          <div className="flex flex-col gap-2">
            <Button variant="secondary" full>
              <IconeGoogle />
              Continuar com o Google
            </Button>
            <Button variant="secondary" full>
              <IconeApple />
              Continuar com a Apple
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-border-hairline" />
            <span className="text-micro text-text-tertiary">ou com e-mail</span>
            <span className="h-px flex-1 bg-border-hairline" />
          </div>

          {/* Painel único agrupa os dados pessoais — idioma do gate/triagem/faixa. */}
          <div className="flex flex-col gap-3 rounded-3xl bg-surface-alt p-4">
            <CampoLocal rotulo="Nome completo">
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Como está no seu documento"
                className={CAMPO_CARD}
              />
            </CampoLocal>

            <div className="grid grid-cols-2 gap-3">
              <CampoLocal rotulo="CPF">
                <input
                  value={cpf}
                  onChange={(e) => setCpf(mascaraCpf(e.target.value))}
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                  className={CAMPO_CARD}
                />
              </CampoLocal>
              <CampoLocal rotulo="Telefone">
                <input
                  value={telefone}
                  onChange={(e) => setTelefone(mascaraTelefone(e.target.value))}
                  placeholder="(31) 90000-0000"
                  inputMode="tel"
                  className={CAMPO_CARD}
                />
              </CampoLocal>
            </div>

            <CampoLocal rotulo="Seu e-mail">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                inputMode="email"
                placeholder="voce@email.com.br"
                className={CAMPO_CARD}
              />
            </CampoLocal>

            <CampoLocal rotulo="Crie uma senha" dica="No mínimo 8 caracteres.">
              <input
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                type="password"
                placeholder="••••••••"
                className={CAMPO_CARD}
              />
            </CampoLocal>

            <CampoLocal rotulo="Seu CEP" dica="A gente puxa o resto do endereço.">
              <input
                value={cep}
                onChange={(e) => setCep(mascaraCep(e.target.value))}
                placeholder="00000-000"
                inputMode="numeric"
                className={CAMPO_CARD}
              />
            </CampoLocal>
            {endereco && (
              <>
                <div className="-mt-2 rounded-2xl border border-border-hairline bg-surface-card px-3 py-2.5 text-caption text-text-secondary shadow-sm">
                  {endereco.logradouro}, {endereco.bairro} — {endereco.municipio}/{endereco.uf}
                </div>
                <div className="-mt-2 w-24">
                  <input
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    placeholder="Nº"
                    inputMode="numeric"
                    className={CAMPO_CARD}
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <p className="text-caption font-semibold text-text-primary">É a primeira empresa que você abre?</p>
            <p className="text-micro text-text-tertiary mt-0.5">
              Só pra gente entender quem usa o app. Não muda nada no seu processo, e dá pra pular.
            </p>
            <div className="mt-2 flex gap-2">
              <PillCoorte on={coorte === "primeira"} onClick={() => setCoorte("primeira")}>
                É a primeira
              </PillCoorte>
              <PillCoorte on={coorte === "ja-abri"} onClick={() => setCoorte("ja-abri")}>
                Já abri antes
              </PillCoorte>
            </div>
          </div>
        </Corpo>

        <Rodape>
          <Button full disabled={!completo} onClick={() => setEtapa("codigo")}>
            Criar minha conta
          </Button>
          <p className="text-micro text-text-tertiary mt-3 text-center">
            Criar conta é de graça. Você só paga quando decidir abrir.
          </p>
        </Rodape>
      </main>
    </>
  );
}

function CampoLocal({
  rotulo,
  dica,
  children,
}: {
  rotulo: string;
  dica?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-caption font-semibold text-text-primary">{rotulo}</p>
      {dica && <p className="text-micro text-text-tertiary mt-0.5">{dica}</p>}
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function PillCoorte({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-full px-4 py-2 text-caption font-semibold transition-colors ${
        on
          ? "bg-action-primary text-text-on-brand"
          : "border border-border-hairline bg-surface-card text-text-secondary hover:border-border-strong"
      }`}
    >
      {children}
    </button>
  );
}
