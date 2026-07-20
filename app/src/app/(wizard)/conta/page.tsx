"use client";

import { useState } from "react";
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
export default function ContaPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [coorte, setCoorte] = useState<"primeira" | "ja-abri" | null>(null);

  return (
    <>
      <TelaHeader meta="Sua conta" />

      <main className="app-main">
        <Titulo sub="Assim seu progresso fica salvo. Você pode sair e voltar quando quiser, do jeito que parou.">
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
          <Button full>Criar minha conta</Button>
          <p className="text-micro text-text-tertiary mt-3 text-center">
            Ainda não estamos cobrando nada.
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
