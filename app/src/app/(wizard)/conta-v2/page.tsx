"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TelaHeader, Titulo, Corpo, Rodape } from "@/components/ui/tela";
import { IconeApple, IconeGoogle } from "@/components/marcas-sociais";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N6 — CRIAR CONTA · REDESIGN v2 CONTIDO (28/07) — PREVIEW, não substitui /conta.
 * ═══════════════════════════════════════════════════════════════════════════
 * Cópia funcional de /conta (mesma lógica, mesmos 2 estados). Ajuste pontual:
 *   · campos de texto, autofill de endereço e pills de coorte → rounded-2xl
 *     (padrão DS de card, memória card-radius-padrao; eram rounded-md).
 * Campo/Texto do DS (ui/form.tsx) NÃO foram tocados aqui de propósito — são
 * compartilhados com as 7 telas do dossiê; a versão local deste preview só
 * imita o visual pra não vazar mudança pra quem ainda não validou. Layout e
 * copy idênticos ao original.
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

export default function ContaV2Page() {
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
            <CampoLocal rotulo="Código de verificação">
              <input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                inputMode="numeric"
                className="w-full min-h-12 rounded-2xl border border-border-hairline bg-surface-card px-3 text-body text-text-primary placeholder:text-text-muted focus:border-border-focus focus:outline-none"
              />
            </CampoLocal>
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

          <CampoLocal rotulo="Nome completo">
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Como está no seu documento"
              className="w-full min-h-12 rounded-2xl border border-border-hairline bg-surface-card px-3 text-body text-text-primary placeholder:text-text-muted focus:border-border-focus focus:outline-none"
            />
          </CampoLocal>

          <div className="grid grid-cols-2 gap-3">
            <CampoLocal rotulo="CPF">
              <input
                value={cpf}
                onChange={(e) => setCpf(mascaraCpf(e.target.value))}
                placeholder="000.000.000-00"
                inputMode="numeric"
                className="w-full min-h-12 rounded-2xl border border-border-hairline bg-surface-card px-3 text-body text-text-primary placeholder:text-text-muted focus:border-border-focus focus:outline-none"
              />
            </CampoLocal>
            <CampoLocal rotulo="Telefone">
              <input
                value={telefone}
                onChange={(e) => setTelefone(mascaraTelefone(e.target.value))}
                placeholder="(31) 90000-0000"
                inputMode="tel"
                className="w-full min-h-12 rounded-2xl border border-border-hairline bg-surface-card px-3 text-body text-text-primary placeholder:text-text-muted focus:border-border-focus focus:outline-none"
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
              className="w-full min-h-12 rounded-2xl border border-border-hairline bg-surface-card px-3 text-body text-text-primary placeholder:text-text-muted focus:border-border-focus focus:outline-none"
            />
          </CampoLocal>

          <CampoLocal rotulo="Crie uma senha" dica="No mínimo 8 caracteres.">
            <input
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full min-h-12 rounded-2xl border border-border-hairline bg-surface-card px-3 text-body text-text-primary placeholder:text-text-muted focus:border-border-focus focus:outline-none"
            />
          </CampoLocal>

          <CampoLocal rotulo="Seu CEP" dica="A gente puxa o resto do endereço.">
            <input
              value={cep}
              onChange={(e) => setCep(mascaraCep(e.target.value))}
              placeholder="00000-000"
              inputMode="numeric"
              className="w-full min-h-12 rounded-2xl border border-border-hairline bg-surface-card px-3 text-body text-text-primary placeholder:text-text-muted focus:border-border-focus focus:outline-none"
            />
          </CampoLocal>
          {endereco && (
            <>
              <div className="-mt-3 rounded-2xl border border-border-hairline bg-surface-alt px-3 py-2.5 text-caption text-text-secondary">
                {endereco.logradouro}, {endereco.bairro} — {endereco.municipio}/{endereco.uf}
              </div>
              <div className="-mt-3 w-24">
                <input
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="Nº"
                  inputMode="numeric"
                  className="w-full min-h-12 rounded-2xl border border-border-hairline bg-surface-card px-3 text-body text-text-primary placeholder:text-text-muted focus:border-border-focus focus:outline-none"
                />
              </div>
            </>
          )}

          <div>
            <p className="text-caption font-semibold text-text-primary">É a primeira empresa que você abre?</p>
            <p className="text-micro text-text-tertiary mt-0.5">
              Só pra gente entender quem usa o app. Não muda nada no seu processo, e dá pra pular.
            </p>
            <div className="mt-2 flex gap-2">
              <BotaoCoorte on={coorte === "primeira"} onClick={() => setCoorte("primeira")}>
                É a primeira
              </BotaoCoorte>
              <BotaoCoorte on={coorte === "ja-abri"} onClick={() => setCoorte("ja-abri")}>
                Já abri antes
              </BotaoCoorte>
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

function BotaoCoorte({
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
      className={`min-h-12 flex-1 rounded-2xl border px-3 text-body transition-colors ${
        on
          ? "border-border-focus bg-surface-tint-brand font-semibold text-text-primary"
          : "border-border-hairline bg-surface-card text-text-secondary hover:bg-surface-alt"
      }`}
    >
      {children}
    </button>
  );
}
