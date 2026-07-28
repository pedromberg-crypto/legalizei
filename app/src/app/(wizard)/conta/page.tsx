"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TelaHeader, Titulo, Corpo, Rodape } from "@/components/ui/tela";
import { Campo, Texto } from "@/components/ui/form";
import { IconeApple, IconeGoogle } from "@/components/marcas-sociais";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N6 — CRIAR CONTA · arquétipo A1 (Pergunta) · shell WIZARD (ainda não pagou)
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: spec-telas-entrada-b1-b2.md → Tela 5 · mapa T5→N6
 *
 * A primeira tela depois do teaser (N5). O lead viu a prova, agora dá o nome.
 * Sai daqui com **credencial funcionando** — não é "cadastro", é conta: se ele
 * fechar o app no N7 e voltar amanhã, o progresso está lá.
 *
 * ─── ⚠️ FRONT-LOAD DE DADOS PESSOAIS (28/07, reunião Rua Satélite 9) ────────
 * Decisão travada: nome completo, CPF, telefone e endereço migram PRA CÁ —
 * antes só viviam no N10 (pós-pagamento). Motivo: captar tudo num lugar só,
 * com validação obrigatória por e-mail/SMS logo na entrada. O N10 deixa de
 * coletar do zero e vira tela de CONFIRMAÇÃO do que já veio daqui.
 *
 * 🚧 Mock: CEP autofill e validação de código são dublados, mesmo padrão do
 * resto do wizard (sem provider real ainda).
 *
 * ─── 🔴 O AVISO DO GOV.BR SAIU DAQUI (19/07) — e por quê ──────────────────
 * A tela nasceu com um bloco avisando que a assinatura no N23 exige conta
 * GOV.BR prata/ouro. Ele foi REMOVIDO. Os três motivos, do menor pro maior:
 *   · Jargão puro ("prata", "ouro", "bronze", "banco credenciado") numa tela
 *     cujo único trabalho é pegar um e-mail. UX-48 manda zero jargão.
 *   · **Informava um problema sem deixar resolver.** Sem botão, sem link, sem
 *     verificação. Terminava em "a gente te lembra na hora certa", que traduz
 *     pra "guarde essa preocupação". Aviso que não age é só ansiedade.
 *   · **Contradizia o posicionamento.** O N2 promete "a parte chata é com a
 *     gente"; três telas depois, antes de pagar, a primeira entrega concreta
 *     era uma tarefa de governo pro cliente fazer sozinho.
 *
 * A UX-29 continua CERTA no diagnóstico — descobrir bronze só no N23, com
 * dossiê montado e pago, é desastre. Errada era esta solução: a UX-29 pede
 * "detectar e guiar", e o bloco não fazia nem um nem outro.
 *
 * ❌ **Descartado: GOV.BR como provedor de login.** Resolveria de vez
 * (detecção real no ato, zero jargão), mas o Login Único gov.br não se abre
 * pra empresa privada. Decisão do Pedro 19/07, sem gasto de pesquisa.
 * ✅ **Plano B em vigor:** o GOV.BR vira **tarefa acionável no painel (N21)**,
 * com estado, link direto e notificação. Lá o cliente já pagou, já confia, e o
 * painel já existe pra mostrar coisas acontecendo em paralelo. A persona
 * `govbr-bronze` migra de guarda-corpo desta tela pra guarda-corpo de lá.
 * 🚧 O N21 ainda não foi construído — este parágrafo é o que impede a UX-29
 * de sumir no caminho.
 *
 * ─── O QUE ESTA TELA CARREGA ALÉM DO ÓBVIO ────────────────────────────────
 *
 * **UX-48 — a coorte é DADO PURO, não bifurcação.** "É a primeira empresa
 *    que você abre?" não muda absolutamente nada no que vem depois: as duas
 *    respostas veem as mesmas telas, na mesma ordem, com a mesma lógica. A tag
 *    só alimenta a análise, pra decidir COM DADO, depois, se vale bifurcar
 *    ritmo. Por isso é **pulável sem custo** (o `reta-direto` ignora e segue).
 *    ⚠️ Nunca rotular a pessoa: "modo leigo" é proibido em copy.
 *    ❌ Descartado marcar a coorte por comportamento — usar o atalho "já sei
 *    meu CNAE" no N4 não qualifica experiência: pesquisar 1 código ≠ saber
 *    abrir empresa.
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
  return d
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}
function mascaraCep(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.replace(/(\d{5})(\d)/, "$1-$2");
}

interface EnderecoCep {
  logradouro: string;
  bairro: string;
  municipio: string;
  uf: string;
}
// 🚧 Mock do autofill por CEP — mesmo padrão do N13 (sem API real ainda).
function buscarCep(cepDigitos: string): EnderecoCep | null {
  if (cepDigitos.length !== 8) return null;
  return {
    logradouro: "Rua dos Timbiras",
    bairro: "Funcionários",
    municipio: "Belo Horizonte",
    uf: "MG",
  };
}

export default function ContaPage() {
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
    nomeOk &&
    cpfCheio &&
    telefoneCheio &&
    /@/.test(email) &&
    senha.length >= 8 &&
    cepCheio &&
    numero.trim() !== "";

  // ─── ETAPA 2: validação obrigatória por e-mail/SMS (28/07) ────────────────
  if (etapa === "codigo") {
    return (
      <>
        <TelaHeader meta="Confirme seu acesso" />
        <main className="app-main">
          <Titulo sub={`Mandamos um código de 6 dígitos pro ${email || "seu e-mail"} e por SMS.`}>
            Digite o código
          </Titulo>
          <Corpo>
            <Campo rotulo="Código de verificação">
              <Texto
                valor={codigo}
                onChange={(v) => setCodigo(v.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                inputMode="numeric"
              />
            </Campo>
            <p className="text-micro text-text-tertiary">
              Não chegou? Confere o spam ou pede um novo em 30s.
            </p>
          </Corpo>
          <Rodape>
            <Button
              full
              disabled={codigo.length !== 6}
              onClick={() => router.push("/plano")}
            >
              Confirmar
            </Button>
          </Rodape>
        </main>
      </>
    );
  }

  // ─── ETAPA 1: formulário (front-load 28/07) ────────────────────────────────
  return (
    <>
      <TelaHeader meta="Sua conta" />

      <main className="app-main">
        <Titulo sub="Assim seu progresso fica salvo, e a gente já adianta o que precisa pra Junta.">
          Vamos criar seu acesso
        </Titulo>

        <Corpo>
          {/* Social primeiro: é o caminho de menos atrito, e quem tem Google
              não precisa inventar mais uma senha. */}
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

          <Campo rotulo="Nome completo">
            <Texto
              valor={nome}
              onChange={setNome}
              placeholder="Como está no seu documento"
              erro={nome.length > 0 && !nomeOk ? "Escreva o nome completo." : undefined}
            />
          </Campo>

          <div className="grid grid-cols-2 gap-3">
            <Campo rotulo="CPF">
              <Texto
                valor={cpf}
                onChange={(v) => setCpf(mascaraCpf(v))}
                placeholder="000.000.000-00"
                inputMode="numeric"
              />
            </Campo>
            <Campo rotulo="Telefone">
              <Texto
                valor={telefone}
                onChange={(v) => setTelefone(mascaraTelefone(v))}
                placeholder="(31) 90000-0000"
                inputMode="tel"
              />
            </Campo>
          </div>

          <Campo rotulo="Seu e-mail">
            <Texto
              valor={email}
              onChange={setEmail}
              type="email"
              inputMode="email"
              placeholder="voce@email.com.br"
            />
          </Campo>

          <Campo rotulo="Crie uma senha" dica="No mínimo 8 caracteres.">
            <Texto
              valor={senha}
              onChange={setSenha}
              type="password"
              placeholder="••••••••"
            />
          </Campo>

          {/* 🆕 Endereço — mesmo autofill do N13, front-load 28/07. */}
          <Campo rotulo="Seu CEP" dica="A gente puxa o resto do endereço.">
            <Texto
              valor={cep}
              onChange={(v) => setCep(mascaraCep(v))}
              placeholder="00000-000"
              inputMode="numeric"
            />
          </Campo>
          {endereco && (
            <>
              <div className="-mt-3 rounded-md border border-border-hairline bg-surface-alt px-3 py-2.5 text-caption text-text-secondary">
                {endereco.logradouro}, {endereco.bairro} — {endereco.municipio}/{endereco.uf}
              </div>
              <div className="-mt-3 w-24">
                <Texto
                  valor={numero}
                  onChange={setNumero}
                  placeholder="Nº"
                  inputMode="numeric"
                />
              </div>
            </>
          )}

          {/* ───── UX-48: coorte. Dado puro, opcional, sem rótulo ───── */}
          <div>
            <p className="text-caption font-semibold text-text-primary">
              É a primeira empresa que você abre?
            </p>
            <p className="text-micro text-text-tertiary mt-0.5">
              Só pra gente entender quem usa o app. Não muda nada no seu
              processo, e dá pra pular.
            </p>
            <div className="mt-2 flex gap-2">
              <BotaoCoorte
                on={coorte === "primeira"}
                onClick={() => setCoorte("primeira")}
              >
                É a primeira
              </BotaoCoorte>
              <BotaoCoorte
                on={coorte === "ja-abri"}
                onClick={() => setCoorte("ja-abri")}
              >
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

/**
 * Local, não DS: parece o `OpcoesLinha` do dossiê, mas o comportamento é
 * outro — aqui **desmarcar é válido** (a pergunta é opcional) e nenhuma
 * validação depende da resposta. Unificar os dois esconderia essa diferença.
 */
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
      className={`min-h-12 flex-1 rounded-md border px-3 text-body transition-colors ${
        on
          ? "border-border-focus bg-surface-tint-brand font-semibold text-text-primary"
          : "border-border-hairline bg-surface-card text-text-secondary hover:bg-surface-alt"
      }`}
    >
      {children}
    </button>
  );
}
