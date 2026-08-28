"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { Campo, Texto, Checkbox } from "@/components/ui/form";
import { IconeApple, IconeGoogle } from "@/components/marcas-sociais";
import { Logo } from "@/components/logo";
import { CUSTOS, brl } from "@/lib/fiscal";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * B3 · A TRAVESSIA DO DINHEIRO (N6→N9) — as telas, FONTE ÚNICA
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ EXTRAÍDO das pages `(wizard)/conta|plano|contrato|pagamento` em 29/07,
 * mesmo padrão de `EntradaView` e `gate-telas`: a `/apresentacao` renderiza a
 * tela APROVADA, não uma cópia. Cópia diverge em silêncio.
 *
 * Estado por props (controlado) pra a demo conseguir preencher com 1 clique
 * sem duplicar tela. As pages de produção seguem donas da navegação.
 *
 * O racional de cada tela continua documentado na respectiva page.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/* ═══════════════════ N6 · CRIAR CONTA ═══════════════════════════════════ */

export function mascaraCpf(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
export function mascaraTelefone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}
export function mascaraCep(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.replace(/(\d{5})(\d)/, "$1-$2");
}

interface EnderecoCep {
  logradouro: string;
  bairro: string;
  municipio: string;
  uf: string;
}
/** 🚧 Mock do autofill por CEP — mesmo padrão do N13 (sem API real ainda). */
export function buscarCep(cepDigitos: string): EnderecoCep | null {
  if (cepDigitos.length !== 8) return null;
  return {
    logradouro: "Rua dos Timbiras",
    bairro: "Funcionários",
    municipio: "Belo Horizonte",
    uf: "MG",
  };
}

export type DadosConta = {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  senha: string;
  cep: string;
  numero: string;
  coorte: "primeira" | "ja-abri" | null;
  codigo: string;
};

/**
 * 🆕 28/08 — subtítulo do E6 por regime. "a gente já adianta o que precisa pra
 * Junta" é FALSO no MEI: ele não passa pela Junta Comercial (o registro é
 * direto no Portal do Empreendedor, e quem registra é o próprio titular).
 * Ver `pesquisa/abertura-mei/abertura-mei-processo.md`.
 */
function subConta(mei: boolean, leadJaCaptado: boolean) {
  if (leadJaCaptado)
    return "A gente já tem seus dados. Agora é só a senha e o CPF pra proteger sua conta.";
  return mei
    ? "Assim seu progresso fica salvo, e a gente já adianta o que precisa pro seu registro."
    : "Assim seu progresso fica salvo, e a gente já adianta o que precisa pra Junta.";
}

export function ContaView({
  d,
  set,
  etapa,
  onCriarConta,
  onConfirmar,
  onVoltar,
  layout = "classico",
  leadJaCaptado = false,
  mei = false,
}: {
  d: DadosConta;
  set: <K extends keyof DadosConta>(k: K, v: DadosConta[K]) => void;
  /** `form` = os dados; `codigo` = validação obrigatória (front-load 28/07). */
  etapa: "form" | "codigo";
  onCriarConta: () => void;
  onConfirmar: () => void;
  /** UX-60: seta de voltar (a demo navega por estado). */
  onVoltar?: () => void;
  /**
   * 🔓 UX-71 (29/07) — `painel` recria o N6 com o layout do LOGIN: painel
   * escuro que sangra (marca + saudação) + folha clara sobreposta com o
   * formulário. Default `classico` mantém a tela aprovada intacta.
   */
  layout?: "classico" | "painel";
  /** 🆕 27/08 — ver `ContaPainel`: nome/e-mail/telefone/endereço já vieram do
   *  E3.1 e do E3.3, então esta tela só pede senha e CPF. */
  leadJaCaptado?: boolean;
  /** 🆕 28/08 — só troca o subtítulo (MEI não passa pela Junta). */
  mei?: boolean;
}) {
  if (layout === "painel" && etapa === "form") {
    return (
      <ContaPainel
        d={d}
        set={set}
        onCriarConta={onCriarConta}
        onVoltar={onVoltar}
        leadJaCaptado={leadJaCaptado}
        mei={mei}
      />
    );
  }
  const nomeOk = d.nome.trim().split(/\s+/).length >= 2;
  const cpfCheio = d.cpf.replace(/\D/g, "").length === 11;
  const telefoneCheio = d.telefone.replace(/\D/g, "").length >= 10;
  const cepDigitos = d.cep.replace(/\D/g, "");
  const cepCheio = cepDigitos.length === 8;
  const endereco = buscarCep(cepDigitos);

  const completo =
    nomeOk &&
    cpfCheio &&
    telefoneCheio &&
    /@/.test(d.email) &&
    d.senha.length >= 8 &&
    cepCheio &&
    d.numero.trim() !== "";

  if (etapa === "codigo") {
    return (
      <>
        <TelaHeader meta="Confirme seu acesso" onVoltar={onVoltar} />
        <main className="app-main">
          <Titulo sub={`Mandamos um código de 6 dígitos pro ${d.email || "seu e-mail"} e por SMS.`}>
            Digite o código
          </Titulo>
          <Corpo>
            <Campo rotulo="Código de verificação">
              <Texto
                valor={d.codigo}
                onChange={(v) => set("codigo", v.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                inputMode="numeric"
              />
            </Campo>
            <p className="text-micro text-text-tertiary">
              Não chegou? Confere o spam ou pede um novo em 30s.
            </p>
          </Corpo>
          <Rodape>
            <Button full disabled={d.codigo.length !== 6} onClick={onConfirmar}>
              Confirmar
            </Button>
          </Rodape>
        </main>
      </>
    );
  }

  return (
    <>
      <TelaHeader meta="Sua conta" onVoltar={onVoltar} />
      <main className="app-main">
        <Titulo sub={subConta(mei, false)}>
          Vamos criar seu acesso
        </Titulo>

        <Corpo>
          {/* Social primeiro: caminho de menos atrito, e quem tem Google não
              precisa inventar mais uma senha. */}
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
              valor={d.nome}
              onChange={(v) => set("nome", v)}
              placeholder="Como está no seu documento"
              erro={d.nome.length > 0 && !nomeOk ? "Escreva o nome completo." : undefined}
            />
          </Campo>

          <div className="grid grid-cols-2 gap-3">
            <Campo rotulo="CPF">
              <Texto
                valor={d.cpf}
                onChange={(v) => set("cpf", mascaraCpf(v))}
                placeholder="000.000.000-00"
                inputMode="numeric"
              />
            </Campo>
            <Campo rotulo="Telefone">
              <Texto
                valor={d.telefone}
                onChange={(v) => set("telefone", mascaraTelefone(v))}
                placeholder="(31) 90000-0000"
                inputMode="tel"
              />
            </Campo>
          </div>

          <Campo rotulo="Seu e-mail">
            <Texto
              valor={d.email}
              onChange={(v) => set("email", v)}
              type="email"
              inputMode="email"
              placeholder="voce@email.com.br"
            />
          </Campo>

          <Campo rotulo="Crie uma senha" dica="No mínimo 8 caracteres.">
            <Texto
              valor={d.senha}
              onChange={(v) => set("senha", v)}
              type="password"
              placeholder="••••••••"
            />
          </Campo>

          {/* 🆕 Endereço — mesmo autofill do N13, front-load 28/07. */}
          <Campo rotulo="Seu CEP" dica="A gente puxa o resto do endereço.">
            <Texto
              valor={d.cep}
              onChange={(v) => set("cep", mascaraCep(v))}
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
                  valor={d.numero}
                  onChange={(v) => set("numero", v)}
                  placeholder="Nº"
                  inputMode="numeric"
                />
              </div>
            </>
          )}

          {/* 🔴 24/08 (reunião Rua Satélite 35) — coorte SAIU daqui, realocada
              pra `FaixaView` (E5F, `gate-telas.tsx`). Este `layout="classico"`
              não é o usado em produção (`/conta` usa `layout="painel"`, ver
              `ContaPainel`), mas mantido consistente pra não sobrar pergunta
              duplicada em nenhuma variante. */}
        </Corpo>

        <Rodape>
          <Button full disabled={!completo} onClick={onCriarConta}>
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

/* ─────────────────────────────────────────────────────────────────────────
   🔓 UX-71 · N6 com o layout do LOGIN (2 painéis)
   ─────────────────────────────────────────────────────────────────────────
   O login é a ÚNICA tela com essa estrutura, e ela existe pra marcar "aqui é
   outro lugar: você está entrando em casa, não no meio de um processo". Trazer
   pro N6 faz sentido porque criar conta é o irmão do entrar — e é a primeira
   vez no flow que a pessoa ganha credencial.

   ⚠️ DIFERENÇA QUE IMPORTA (e é o motivo de não ser cópia literal):
   · No login a folha clara é `shrink-0` e NÃO rola — são 2 campos. Aqui são 7
     + a coorte, então a folha é a região rolável e o CTA vai pro rodapé fixo
     (thumb zone). Copiar o `shrink-0` estouraria a tela no iPhone SE.
   · O login usa placeholder COMO rótulo ("é a exceção que só o login
     justifica", diz o comentário lá). Aqui os campos têm formato (CPF, CEP,
     telefone) e são 7: mantive o `aria-label` em cada um pra não perder
     acessibilidade quando o placeholder some ao digitar (UX-48).
   ───────────────────────────────────────────────────────────────────────── */
function ContaPainel({
  d,
  set,
  onCriarConta,
  onVoltar,
  leadJaCaptado = false,
  mei = false,
}: {
  d: DadosConta;
  set: <K extends keyof DadosConta>(k: K, v: DadosConta[K]) => void;
  onCriarConta: () => void;
  onVoltar?: () => void;
  /** 🆕 28/08 — só troca o subtítulo (MEI não passa pela Junta). */
  mei?: boolean;
  /**
   * 🆕 27/08 — nome, e-mail e telefone agora vêm do **E3.1** (`/dados`), e o
   * endereço do **E3.3** (`/endereco`), lá no comecinho do flow. Esta tela
   * deixa de coletar tudo de novo e vira o que sobrou de verdade: **senha e
   * CPF**, que é o que transforma um lead em conta.
   *
   * É o mesmo conserto que o N9 (pagamento) recebeu em 29/07 quando o CPF
   * passou a ser pedido 2×: dado já digitado e validado não se repergunta,
   * se CONFIRMA. Repetir não vira segurança, vira desconfiança.
   */
  leadJaCaptado?: boolean;
}) {
  /**
   * 🔓 UX-72 — cadastro por Google/Apple. O provedor já entrega nome e e-mail
   * (e o Apple pode entregar um e-mail de relay), então repetir esses campos é
   * pedir o que a gente já tem. Ao conectar, a tela passa a mostrar **só o que
   * falta**: CPF, telefone e endereço, que nenhum provedor fornece.
   * `null` = ainda não conectou (cadastro por e-mail).
   */
  const [social, setSocial] = useState<"google" | "apple" | null>(null);

  function conectar(provedor: "google" | "apple") {
    setSocial(provedor);
    // 🚧 Mock do retorno do provedor. No real vem do OAuth.
    set("nome", "Ana Beatriz Ramos");
    set("email", provedor === "apple" ? "ana.b@privaterelay.appleid.com" : "ana.beatriz@gmail.com");
    // Senha não existe em conta social: satisfaz a regra sem pedir nada.
    set("senha", "__social__");
  }

  const nomeOk = d.nome.trim().split(/\s+/).length >= 2;
  const cpfCheio = d.cpf.replace(/\D/g, "").length === 11;
  const telefoneCheio = d.telefone.replace(/\D/g, "").length >= 10;
  const cepDigitos = d.cep.replace(/\D/g, "");
  const endereco = buscarCep(cepDigitos);
  // Com o lead já captado (E3.1 + E3.3), o que falta pra virar conta é só CPF
  // e senha — os outros campos nem aparecem, então não podem travar o CTA.
  const completo = leadJaCaptado
    ? cpfCheio && (d.senha.length >= 8 || social !== null)
    : nomeOk &&
      cpfCheio &&
      telefoneCheio &&
      /@/.test(d.email) &&
      d.senha.length >= 8 &&
      cepDigitos.length === 8 &&
      d.numero.trim() !== "";

  return (
    <main className="app-main">
      {/* PAINEL ESCURO — sangra nos 3 lados, mesma mecânica do login: a margem
          negativa desfaz o padding do shell pra COR chegar na borda do vidro,
          e o padding devolve a inset pro CONTEÚDO. */}
      <div
        className="-mx-6 shrink-0 px-7 pb-14"
        style={{
          marginTop: "calc(-1 * var(--safe-top))",
          paddingTop: "calc(var(--safe-top) + 1.5rem)",
          backgroundColor: "var(--color-surface-dark)",
          backgroundImage:
            "radial-gradient(120% 80% at 15% 0%, color-mix(in srgb, var(--color-brand) 22%, transparent), transparent 60%)",
        }}
      >
        {/* Logo CENTRALIZADO; a seta fica absoluta pra não deslocar o centro. */}
        <div className="relative flex items-center justify-center">
          {onVoltar && (
            <button
              onClick={onVoltar}
              aria-label="Voltar"
              className="absolute left-0 flex h-7 w-7 items-center justify-center rounded-md text-text-on-dark/70 transition-colors hover:text-text-on-dark"
            >
              <SetaVoltarPainel />
            </button>
          )}
          <Logo variante="escura" className="h-8 w-auto shrink-0" />
        </div>

        <div className="mt-10">
          <h1 className="text-h1 text-text-on-dark">
            {leadJaCaptado ? "Falta só criar seu acesso." : "Vamos criar seu acesso."}
          </h1>
          <p className="text-caption text-text-on-dark/70 mt-1.5">
            {subConta(mei, leadJaCaptado)}
          </p>
        </div>
      </div>

      {/* FOLHA CLARA — sobrepõe o painel (o canto arredondado "monta" na cor).
          Diferente do login, ela ROLA: é a região elástica da tela. */}
      <div className="-mx-6 -mt-5 flex min-h-0 flex-1 flex-col overflow-y-auto rounded-t-xl bg-surface-page px-7 pt-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* 🔓 UX-72 — conectado por Google/Apple: nome e e-mail vêm do provedor,
            então em vez de repetir os campos a tela CONFIRMA quem entrou e pede
            só o que falta. */}
        {social && (
          <div className="mb-4 flex items-center gap-3 rounded-lg border border-border-hairline bg-surface-card p-3">
            <span className="shrink-0">
              {social === "google" ? <IconeGoogle /> : <IconeApple />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-caption font-semibold text-text-primary">{d.nome}</p>
              <p className="truncate text-micro text-text-tertiary">{d.email}</p>
            </div>
            <button
              onClick={() => {
                setSocial(null);
                set("nome", "");
                set("email", "");
                set("senha", "");
              }}
              className="shrink-0 text-micro font-semibold text-text-secondary underline underline-offset-4"
            >
              Trocar
            </button>
          </div>
        )}

        {/* 🆕 27/08 — RECAP do que já veio do E3.1/E3.3, read-only. Sem isso a
            tela pareceria ter "esquecido" o que a pessoa acabou de digitar 4
            telas atrás. "Editar" é mock (mesmo padrão do C1/A1): no app real
            abre só aquele campo e volta pra cá. */}
        {leadJaCaptado && (
          <div className="mb-4 rounded-lg border border-border-hairline bg-surface-card p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-caption font-semibold text-text-primary">
                Seus dados
              </p>
              <button className="shrink-0 text-micro font-semibold text-text-secondary underline underline-offset-4">
                Editar
              </button>
            </div>
            <p className="mt-1.5 text-caption text-text-secondary">{d.nome}</p>
            <p className="text-caption text-text-secondary">{d.email}</p>
            <p className="text-caption text-text-secondary">{d.telefone}</p>
          </div>
        )}

        {/* Um campo por linha: CPF e telefone lado a lado cortavam o valor
            mascarado (000.000.000-00 não cabe em meia largura no SE). */}
        <div className="flex flex-col gap-3.5">
          {!social && !leadJaCaptado && (
            <CampoIconeConta icone={<IconePessoaConta />}>
              <input
                value={d.nome}
                onChange={(e) => set("nome", e.target.value)}
                placeholder="Nome completo"
                aria-label="Nome completo"
                autoComplete="name"
                className="min-h-12 flex-1 bg-transparent text-body text-text-primary outline-none placeholder:text-text-muted"
              />
            </CampoIconeConta>
          )}

          <CampoIconeConta icone={<IconeDoc />}>
            <input
              value={d.cpf}
              onChange={(e) => set("cpf", mascaraCpf(e.target.value))}
              placeholder="CPF"
              aria-label="CPF"
              inputMode="numeric"
              className="min-h-12 flex-1 bg-transparent text-body text-text-primary outline-none placeholder:text-text-muted"
            />
          </CampoIconeConta>

          {!leadJaCaptado && (
            <CampoIconeConta icone={<IconeTelefone />}>
              <input
                value={d.telefone}
                onChange={(e) => set("telefone", mascaraTelefone(e.target.value))}
                placeholder="Telefone"
                aria-label="Telefone"
                inputMode="tel"
                className="min-h-12 flex-1 bg-transparent text-body text-text-primary outline-none placeholder:text-text-muted"
              />
            </CampoIconeConta>
          )}

          {!social && (
            <>
              {!leadJaCaptado && (
                <CampoIconeConta icone={<IconeEmailConta />}>
                  <input
                    value={d.email}
                    onChange={(e) => set("email", e.target.value)}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="E-mail"
                    aria-label="E-mail"
                    className="min-h-12 flex-1 bg-transparent text-body text-text-primary outline-none placeholder:text-text-muted"
                  />
                </CampoIconeConta>
              )}

              <CampoIconeConta icone={<IconeCadeadoConta />}>
                <input
                  value={d.senha}
                  onChange={(e) => set("senha", e.target.value)}
                  type="password"
                  autoComplete="new-password"
                  placeholder="Senha (mín. 8 caracteres)"
                  aria-label="Senha"
                  className="min-h-12 flex-1 bg-transparent text-body text-text-primary outline-none placeholder:text-text-muted"
                />
              </CampoIconeConta>
            </>
          )}

          {/* 🔴 27/08 — CEP e número saíram daqui: o endereço da EMPRESA agora
              é perguntado no E3.3 (`/endereco`), que também é onde o gate de
              BH acontece. Pedir de novo aqui reperguntaria o mesmo dado com
              outra pergunta implícita ("é o seu endereço ou o da empresa?"),
              que era ambíguo desde o front-load de 28/07. */}
          {!leadJaCaptado && (
            <>
              <CampoIconeConta icone={<IconeLocal />}>
                <input
                  value={d.cep}
                  onChange={(e) => set("cep", mascaraCep(e.target.value))}
                  placeholder="CEP"
                  aria-label="CEP"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  className="min-h-12 flex-1 bg-transparent text-body text-text-primary outline-none placeholder:text-text-muted"
                />
              </CampoIconeConta>

              {/* Endereço em LINHA PRÓPRIA, sem truncate: cortar o logradouro
                  esconde justamente o que a pessoa precisa conferir. O número
                  vem abaixo, com largura inteira. */}
              {endereco && (
                <>
                  <div className="rounded-lg bg-surface-alt px-4 py-3">
                    <p className="text-caption text-text-secondary">
                      {endereco.logradouro}, {endereco.bairro}
                    </p>
                    <p className="text-caption text-text-secondary">
                      {endereco.municipio}/{endereco.uf}
                    </p>
                  </div>
                  <CampoIconeConta>
                    <input
                      value={d.numero}
                      onChange={(e) => set("numero", e.target.value)}
                      placeholder="Número"
                      aria-label="Número"
                      inputMode="numeric"
                      className="min-h-12 flex-1 bg-transparent text-body text-text-primary outline-none placeholder:text-text-muted"
                    />
                  </CampoIconeConta>
                </>
              )}
            </>
          )}
        </div>

        {/* 🔴 24/08 (reunião Rua Satélite 35) — a pergunta "é a primeira
            empresa que você abre?" SAIU daqui. Realocada pra `FaixaView`
            (E5F, `gate-telas.tsx`), abaixo da faixa de faturamento — dado
            puro de log/marketing, não precisa estar junto do cadastro
            (Tiagão/Natanael Dev: "isso aí não interfere em nada no
            processo dele"). A antiga nota UX-73 (coorte obrigatória, contra
            UX-48) fica sem efeito: a pergunta nem mora mais aqui. */}

        {/* Social só faz sentido antes de conectar. */}
        {!social && (
          <>
            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-border-hairline" />
              <span className="text-micro text-text-tertiary">ou crie com</span>
              <span className="h-px flex-1 bg-border-hairline" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={() => conectar("google")}>
                <IconeGoogle />
                Google
              </Button>
              <Button variant="secondary" onClick={() => conectar("apple")}>
                <IconeApple />
                Apple
              </Button>
            </div>
          </>
        )}

        <div className="h-6 shrink-0" />
      </div>

      {/* CTA no rodapé (thumb zone). No login ele mora dentro da folha porque
          lá nada rola; aqui rolaria pra fora da vista. */}
      <Rodape>
        <Button full disabled={!completo} onClick={onCriarConta}>
          Criar minha conta
        </Button>
        <p className="text-micro text-text-tertiary mt-3 text-center">
          Criar conta é de graça. Você só paga quando decidir abrir.
        </p>
      </Rodape>
    </main>
  );
}

/** Campo com ícone à esquerda — colhido do login. `icone` opcional (o Nº não tem). */
function CampoIconeConta({ icone, children }: { icone?: ReactNode; children: ReactNode }) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-border-hairline bg-surface-card px-4 transition-colors focus-within:border-border-focus">
      {icone && <span className="shrink-0 text-text-muted">{icone}</span>}
      {children}
    </label>
  );
}

function ic20() {
  return {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}
function SetaVoltarPainel() {
  return <svg {...ic20()} width={18} height={18}><path d="m15 18-6-6 6-6" /></svg>;
}
function IconePessoaConta() {
  return <svg {...ic20()}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>;
}
function IconeDoc() {
  return <svg {...ic20()}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /><path d="M10 13h5M10 17h3" /></svg>;
}
function IconeTelefone() {
  return <svg {...ic20()}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>;
}
function IconeEmailConta() {
  return <svg {...ic20()}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>;
}
function IconeCadeadoConta() {
  return <svg {...ic20()}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
}
function IconeLocal() {
  return <svg {...ic20()}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}

// 🔴 24/08 (reunião Rua Satélite 35) — `BotaoCoorte` removido daqui (ficou
// sem uso: a pergunta de coorte saiu do E6 e foi pra `FaixaView`, que tem o
// próprio botão inline no padrão de `gate-telas.tsx`).

/* ═══════════════════ N7 · A CONTA DA ABERTURA ═══════════════════════════ */

export function PlanoView({
  onSeguir,
  onVoltar,
  layout = "classico",
  semTaxaJunta = false,
  enderecoFiscal = false,
}: {
  onSeguir?: () => void;
  onVoltar?: () => void;
  /** 🔓 UX-74 — `oferta` é a versão vendedora (ver `PlanoOferta`). */
  layout?: "classico" | "oferta";
  /**
   * 🆕 03/08 — MEI não passa pela Junta Comercial (registro é direto no
   * Portal do Empreendedor), então não existe DAE a cobrar. ⚠️ Distinto do
   * cenário "Legalizai paga o DAE" (DESCARTADO 03/08): lá a taxa existia e
   * alguém absorvia; aqui a taxa simplesmente NÃO EXISTE pro MEI.
   */
  semTaxaJunta?: boolean;
  /**
   * 🆕 26/08 (reunião Rua Satélite 36, item 2) — a pessoa já escolheu lá no
   * `/gate` (antes do cadastro) usar o endereço fiscal da Legalizai. Antes
   * esse custo só aparecia no C4 (dossiê), pós-pagamento — era a "pendência
   * real de spec" documentada em `plano/page.tsx`. Agora soma aqui, visível.
   */
  enderecoFiscal?: boolean;
}) {
  // 🆕 04/08 — Plano MEI tem preço PRÓPRIO (R$49,90, não o plano ME com
  // desconto): `semTaxaJunta` só era usado pra tirar a taxa da Junta, mas
  // esquecia de trocar a mensalidade também. Reusa o mesmo flag como sinal
  // de MEI (já é assim em todo o resto do wizard).
  const mensalidadeBase = semTaxaJunta ? CUSTOS.MENSALIDADE_MEI : CUSTOS.MENSALIDADE;
  const mensalidade = mensalidadeBase + (enderecoFiscal ? CUSTOS.ENDERECO_FISCAL : 0);
  // 🔄 26/08 (pedido do Pedro) — a DAE NÃO soma mais no "você paga hoje". Só
  // vira cobrança de verdade depois que a viabilidade voltar deferida (A3,
  // `components/painel.tsx`, "Pague a guia da Junta").
  const hoje = mensalidade;

  if (layout === "oferta") {
    return (
      <PlanoOferta
        onSeguir={onSeguir}
        onVoltar={onVoltar}
        semTaxaJunta={semTaxaJunta}
        enderecoFiscal={enderecoFiscal}
      />
    );
  }

  return (
    <>
      <TelaHeader meta="A conta da abertura" onVoltar={onVoltar} />
      <main className="app-main">
        <Titulo sub="Tudo que você vai pagar, num lugar só. Sem letra miúda depois.">
          Quanto custa abrir
        </Titulo>

        <Corpo>
          {/* ═══ HERÓI 1 — O GRÁTIS ═══ */}
          <Card tom="sucesso">
            <p className="text-caption text-state-success-text mb-1">Abrir a sua empresa</p>
            <div className="flex items-center gap-2.5">
              <CheckGrande />
              <p className="text-display text-state-success-text">Grátis</p>
            </div>
            <p className="text-caption text-text-secondary mt-2">
              Documentos, junta comercial, CNPJ e Simples Nacional. A gente não
              cobra honorário nenhum pra abrir.
            </p>
          </Card>

          {/* ═══ HERÓI 2 — O QUE ELE DE FATO COMPRA ═══ */}
          <Card>
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-caption text-text-secondary">Depois, todo mês</p>
              {semTaxaJunta && (
                <span className="rounded-full bg-state-info-tint px-2.5 py-0.5 text-micro font-semibold text-state-info-text">
                  Plano MEI
                </span>
              )}
            </div>
            <p className="text-display text-text-primary">{brl(mensalidade)}</p>
            {/* 🆕 26/08 (pedido do Pedro: "destacar o certificado digital
                grátis também na página do plano") — antes só vivia no fim da
                frase de baixo, fácil de passar batido. Badge próprio, mesmo
                token verde do "Grátis" do card de cima — mesma linguagem
                visual pra "isso não custa nada". */}
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="rounded-full bg-state-success-tint px-2.5 py-0.5 text-micro font-semibold text-state-success-text">
                Certificado digital grátis
              </span>
            </div>
            <p className="text-caption text-text-secondary mt-2">
              {semTaxaJunta
                ? "Emitir notas fiscais e gerenciar o colaborador que a lei permite pro MEI."
                : "Suas guias todo mês, notas fiscais, obrigações do governo e contador de verdade pra falar."}
            </p>
            <p className="text-micro text-text-tertiary mt-2">
              {semTaxaJunta
                ? `a 1ª mensalidade já é o seu 1º mês · fidelidade de ${CUSTOS.FIDELIDADE_MESES} meses`
                : "a 1ª mensalidade já é o seu 1º mês"}
            </p>
            {/* 🆕 26/08 (item 2) — some no total porque você escolheu o
                endereço fiscal lá atrás, no gate. */}
            {enderecoFiscal && (
              <p className="text-micro text-text-tertiary mt-1">
                Inclui {brl(CUSTOS.ENDERECO_FISCAL, true)}/mês de endereço
                fiscal, porque você optou por usar o nosso.
              </p>
            )}
          </Card>

          {/* ═══ A TAXA — honesta, sem holofote ═══
              🔄 26/08 (pedido do Pedro) — não soma mais em "você paga hoje":
              só vira cobrança de verdade depois que a viabilidade voltar
              deferida (A3, "Pague a guia da Junta"). Valor continua visível
              aqui — sem letra miúda — só o TIMING mudou. */}
          <div className="rounded-md border border-border-hairline bg-surface-card p-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-body font-semibold text-text-primary">
                Taxa da Junta Comercial
              </p>
              <span className="shrink-0 text-body font-semibold text-text-primary">
                {semTaxaJunta ? "Não tem" : brl(CUSTOS.DAE_JUCEMG, true)}
              </span>
            </div>
            <p className="text-caption text-text-secondary mt-1">
              {semTaxaJunta
                ? "MEI não passa pela Junta Comercial — o registro é direto no Portal do Empreendedor, sem essa taxa."
                : "Vai direto pro Estado, a gente não fica com nada. Só é cobrada depois, quando a viabilidade sair aprovada — não entra na conta de hoje."}
            </p>
          </div>

          {/* 🆕 27/08 — achado do cruzamento com a Contabilizei: eles citam a
              base legal (Lei 10.406/02, art. 1.179 do Código Civil) pra
              justificar por que se paga algo. A nossa versão é mais exata:
              a lei obriga contabilidade regular, não a abertura em si — é
              por isso que a MENSALIDADE existe mesmo com abertura grátis. */}
          <p className="text-micro text-text-tertiary px-1">
            Por lei (Código Civil, art. 1.179), toda empresa precisa de
            contabilidade regular. É esse serviço contínuo que vira a sua
            mensalidade, não a abertura.
          </p>

          {/* 🆕 03/08 — COLABORADORES (mesma lógica da versão oferta).
              🆕 04/08 — Plano MEI já INCLUI o 1 colaborador que a lei
              permite — não é add-on pago (isso só vale pro plano ME). */}
          <div className="rounded-md border border-border-hairline bg-surface-card p-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-body font-semibold text-text-primary">Colaboradores</p>
              <span className="shrink-0 text-body font-semibold text-text-primary">
                {semTaxaJunta
                  ? "1 incluso"
                  : CUSTOS.COLABORADORES_INCLUSOS === 0
                    ? "não incluso"
                    : `${CUSTOS.COLABORADORES_INCLUSOS} incluso${CUSTOS.COLABORADORES_INCLUSOS > 1 ? "s" : ""}`}
              </span>
            </div>
            <p className="text-caption text-text-secondary mt-1">
              {semTaxaJunta
                ? "É o único funcionário que a lei permite ao MEI — já incluso no seu plano, sem custo extra."
                : `Cada colaborador é ${brl(CUSTOS.CUSTO_FUNCIONARIO, true)}/mês a mais na mensalidade. Sem funcionário, sem custo extra.`}
            </p>
          </div>
        </Corpo>

        {/* ═══ O TOTAL — no rodapé, junto da decisão ═══ */}
        <Rodape>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <span className="text-caption text-text-secondary">Você paga hoje</span>
            <span className="text-h2 text-text-primary">{brl(hoje, true)}</span>
          </div>
          <Button full onClick={onSeguir}>
            Continuar
          </Button>
        </Rodape>
      </main>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   🔓 UX-74 · N7 VERSÃO OFERTA — a tela mais comercial do flow
   ─────────────────────────────────────────────────────────────────────────
   A versão clássica responde "quanto custa?" com honestidade, mas não VENDE:
   dois cards e uma linha de taxa. Esta versão mantém as regras duras e trabalha
   a conversão.

   ⚠️ O QUE **NÃO** MUDOU, porque é regra travada:
   · Os 3 baldes seguem separados: grátis (honorário) · taxa de governo
     (repasse) · mensalidade (recorrente). Nunca misturar.
   · "Grátis" = **honorário zero, não governo zero**. A taxa da Junta continua
     visível, com o valor, e o total do dia continua conferível no rodapé.
     Esconder viraria a pegadinha que esta tela existe pra evitar.
   · Preço é o **valor real** da fase de lançamento, R$139/mês
     (`CUSTOS.MENSALIDADE`, decisão 20/08 — não é mais placeholder desde 26/08).
   · Nada de contagem regressiva, vaga limitada ou desconto inventado. Escassez
     falsa numa tela de contabilidade queima a confiança que os 22 anos do
     escritório constroem.

   O QUE ESTA VERSÃO ADICIONA:
   · **O plano vira produto**: card único com o que está incluso, item a item,
     em linguagem de dono (escopo espelhado do benchmark de mercado).
   · **Âncora real**, em uma linha: abertura em escritório tradicional custa
     honorário, e o nosso é zero.

   ─── 🪒 LAPIDAÇÃO 29/07 — a 1ª versão vendia a mesma coisa 3 vezes ─────────
   Achado do Pedro ("muita informação"). A auditoria achou 3 causas, e nenhuma
   delas era "texto comprido":

   1. **O FAQ era pré-eco do N8.** `ContratoView` abre com "Em quatro linhas" e
      responde 3 das 4 FAQs — honorário zero, período mínimo, 7 dias pra
      desistir — melhor escritas e na tela onde a pessoa assina. O N7 gastava 4
      acordeões pra antecipar a tela seguinte. **FAQ removido**; a única que o
      N8 não cobre (variação por faturamento) subiu pra micro-linha visível
      colada no preço, porque letra miúda dentro de acordeon numa tela que
      promete "sem letra miúda" é a própria pegadinha.
   2. **"Grátis" era argumentado 3x** (card verde · comparativo · FAQ). **O
      comparativo morreu**; a âncora virou 1 linha dentro do card verde. De
      quebra saiu o preço riscado, que é linguagem de varejo — o mesmo vício
      cortado do card verde do N4 no mesmo dia.
   3. **"22 anos" aparecia em N2, N7 e N8.** **Removido daqui**: no N8 é card
      completo e nasce onde a dúvida "com quem eu assino?" realmente aparece.

   Fora isso, `INCLUSO` caiu de 7 pra 5: "Abertura completa do CNPJ" estava
   dentro do card MENSAL (mistura de baldes, e o card verde já dizia), e
   "Declarações no prazo" fundiu com o imposto — é a mesma promessa.

   Resultado: 8 blocos → 4. A tela responde 2 perguntas (quanto pago hoje · o
   que levo todo mês); o resto é do N8.
   ───────────────────────────────────────────────────────────────────────── */

/**
 * O que a mensalidade inclui. Espelha o escopo do benchmark de mercado
 * (plano de referência), em linguagem de dono e sem jargão fiscal.
 *
 * ⚠️ **A abertura NÃO entra nesta lista.** Ela é grátis e mora no card verde,
 * acima. Listar "abertura do CNPJ" aqui dentro misturaria os baldes — a regra
 * dura que esta tela existe pra proteger — e repetiria o card de cima.
 */
const INCLUSO: { titulo: string; sub: string }[] = [
  { titulo: "Certificado digital", sub: "Incluso, sem custo extra." },
  { titulo: "Imposto e declarações", sub: "Guia pronta todo mês e obrigação entregue no prazo." },
  { titulo: "Notas fiscais sem limite", sub: "Emite pelo app, em segundos." },
  { titulo: "Pró-labore de até 2 sócios", sub: "Calculado junto com o seu imposto." },
  { titulo: "Contador de verdade", sub: "Uma pessoa com nome, no WhatsApp." },
];

/** 🆕 04/08 — Plano MEI é escopo LIMITADO (emitir NF + o 1 colaborador que a
 *  lei permite), não o plano ME reduzido — por isso lista própria, não um
 *  filtro do array acima (MEI não tem sócio, não tem Anexo/Fator R).
 *
 *  🆕 17/08 — MEI NÃO tem contador dedicado: tem assistente virtual. O contador
 *  CRC começa no plano ME/Simples. Base legal, não só margem: MEI é o único
 *  regime dispensado de contador (sem escrituração obrigatória, DASN-SIMEI
 *  autodeclaratória). Dizer "contador de verdade" aqui era a promessa vazia que
 *  a marca acusa o setor de fazer. Ver `pesquisa/posicionamento.md` §2. */
const INCLUSO_MEI: { titulo: string; sub: string }[] = [
  { titulo: "Certificado digital", sub: "Incluso, sem custo extra — a gente precisa dele pra te representar." },
  { titulo: "Notas fiscais sem limite", sub: "Emite pelo app, em segundos." },
  { titulo: "1 colaborador", sub: "O único que a lei permite ao MEI — FGTS e INSS patronal inclusos." },
  { titulo: "Assistente de contabilidade", sub: "Tira dúvida e resolve a rotina do MEI, a qualquer hora." },
];

function PlanoOferta({
  onSeguir,
  onVoltar,
  semTaxaJunta = false,
  enderecoFiscal = false,
}: {
  onSeguir?: () => void;
  onVoltar?: () => void;
  semTaxaJunta?: boolean;
  /** 🆕 26/08 (item 2) — ver `PlanoView` acima, mesma origem/mecânica. */
  enderecoFiscal?: boolean;
}) {
  // 🆕 04/08 — mesma correção do PlanoView: Plano MEI tem mensalidade própria.
  const mensalidadeBase = semTaxaJunta ? CUSTOS.MENSALIDADE_MEI : CUSTOS.MENSALIDADE;
  const mensalidade = mensalidadeBase + (enderecoFiscal ? CUSTOS.ENDERECO_FISCAL : 0);
  // 🔄 26/08 (pedido do Pedro) — a DAE NÃO soma mais no "você paga hoje". Só
  // vira cobrança de verdade depois que a viabilidade voltar deferida (A3,
  // `components/painel.tsx`, "Pague a guia da Junta").
  const hoje = mensalidade;

  return (
    <>
      <TelaHeader meta="A conta da abertura" onVoltar={onVoltar} />
      <main className="app-main">
        <Titulo sub="Tudo que você vai pagar, num lugar só. Sem letra miúda depois.">
          Quanto custa abrir
        </Titulo>

        <Corpo>
          {/* HERÓI — o grátis é o argumento mais forte do produto, e a âncora
              é verdadeira: abrir em escritório tradicional custa honorário. */}
          <Card tom="sucesso">
            <p className="text-caption text-state-success-text">
              Nosso honorário de abertura
            </p>
            <div className="mt-1 flex items-center gap-2.5">
              <CheckGrande />
              <p className="text-display text-state-success-text">Grátis</p>
            </div>
            {/* ⚠️ A copy NÃO pode listar "Junta" aqui: a taxa da Junta é cobrada
                logo abaixo. O que é grátis é o nosso TRABALHO, não o repasse ao
                Estado. Dizer "Junta por nossa conta" e cobrar a taxa depois é a
                contradição que esta tela existe pra evitar. */}
            <p className="text-caption text-text-secondary mt-2">
              Todo o trabalho de abrir é por nossa conta: documentação, contrato
              social, protocolo, CNPJ e enquadramento no Simples.
            </p>
            {/* ⚓ A ÂNCORA, em UMA linha. Era um card comparativo inteiro com
                preço riscado — e preço riscado é linguagem de varejo, o mesmo
                vício cortado do card verde do N4 em 29/07. Aqui a comparação
                vive como referência qualitativa: sem número, sem risco, sem
                fingir precisão estatística que a régua não tem. */}
            <p className="text-micro text-text-tertiary mt-2">
              Em escritório tradicional, esse mesmo trabalho costuma custar em
              torno de um salário mínimo de honorário.
            </p>
          </Card>

          {/* O PLANO COMO PRODUTO — card único (só existe 1 plano no MLP).
              🆕 04/08 — Plano MEI é OUTRO card (preço/lista próprios), não
              o mesmo card com número trocado. */}
          <div className="overflow-hidden rounded-2xl bg-surface-dark text-text-on-dark">
            <div className="px-5 pt-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-caption text-text-on-dark/70">Depois, todo mês</p>
                <span className="rounded-full bg-white/15 px-2.5 py-1 text-micro font-bold">
                  {semTaxaJunta ? "Plano MEI" : "Plano único"}
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <p className="text-display font-bold">{brl(mensalidade)}</p>
                <span className="text-body text-text-on-dark/70">/mês</span>
              </div>
              {/* 🆕 26/08 (pedido do Pedro: "destacar o certificado digital
                  grátis também na página do plano") — achado ao conferir a
                  /apresentacao: `/plano` de produção usa `layout="oferta"`
                  (este componente), não o clássico — o badge tinha ido pro
                  componente errado (não usado em produção). Corrigido aqui:
                  o certificado já aparecia na lista `INCLUSO` (item 1), mas
                  enterrado como 1 bullet entre 5 — ganha destaque próprio,
                  colado no preço. */}
              <div className="mt-1.5">
                <span className="inline-flex items-center rounded-full bg-state-success/20 px-2.5 py-0.5 text-micro font-semibold text-state-success">
                  Certificado digital grátis
                </span>
              </div>
              <p className="text-micro text-text-on-dark/60 mt-1">
                {semTaxaJunta
                  ? `a 1ª mensalidade já é o seu 1º mês · fidelidade de ${CUSTOS.FIDELIDADE_MESES} meses`
                  : "a 1ª mensalidade já é o seu 1º mês"}
              </p>
              {/* 🔓 Era a FAQ "a mensalidade muda depois?", escondida num
                  acordeon. É a ÚNICA letra miúda real da tela — e o subtítulo
                  promete "sem letra miúda depois". Esconder a variação por
                  faturamento dentro de um acordeon é exatamente a pegadinha que
                  esta tela existe pra evitar. Então ela sobe, visível, colada no
                  preço que ela qualifica. */}
              {!semTaxaJunta && (
                <p className="text-micro text-text-on-dark/60 mt-1">
                  O valor acompanha o seu faturamento. Se a empresa crescer muito,
                  a gente conversa antes.
                </p>
              )}
              {/* 🆕 26/08 (item 2) — mesma explicação da versão clássica,
                  cor invertida (card escuro). */}
              {enderecoFiscal && (
                <p className="text-micro text-text-on-dark/60 mt-1">
                  Inclui {brl(CUSTOS.ENDERECO_FISCAL, true)}/mês de endereço
                  fiscal, porque você optou por usar o nosso.
                </p>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-3 px-5 pb-5">
              {(semTaxaJunta ? INCLUSO_MEI : INCLUSO).map((i) => (
                <div key={i.titulo} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-state-success text-text-on-dark">
                    <CheckMiniPlano />
                  </span>
                  <div className="min-w-0">
                    <p className="text-caption font-semibold">{i.titulo}</p>
                    <p className="text-micro text-text-on-dark/60">{i.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* A TAXA — honesta, com valor, sem holofote. Regra dura: o repasse
              de governo NUNCA se esconde dentro do preço. */}
          <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-body font-semibold text-text-primary">
                Taxa da Junta Comercial
              </p>
              <span className="shrink-0 text-body font-semibold text-text-primary">
                {semTaxaJunta ? "Não tem" : brl(CUSTOS.DAE_JUCEMG, true)}
              </span>
            </div>
            <p className="text-caption text-text-secondary mt-1">
              {semTaxaJunta
                ? "MEI não passa pela Junta Comercial — o registro é direto no Portal do Empreendedor, sem essa taxa."
                : "Cobrada uma vez, e vai direto pro Estado: a gente não fica com nada. Você pagaria essa taxa abrindo com qualquer um."}
            </p>
          </div>

          {/* 🆕 27/08 — mesma citação legal da versão clássica (ver PlanoView). */}
          <p className="text-micro text-text-tertiary px-1">
            Por lei (Código Civil, art. 1.179), toda empresa precisa de
            contabilidade regular. É esse serviço contínuo que vira a sua
            mensalidade, não a abertura.
          </p>

          {/* 🆕 03/08 — COLABORADORES, visível desde já (achado da reunião com
              o Mauro: "quanto custa a mais" precisa aparecer cedo, não só
              depois de contratar). 🔴 Preço FAKE — referência de mercado
              (Contabilizei Avançado, R$39/cabeça linear), não decisão nossa.
              🆕 04/08 — some pro Plano MEI: o INCLUSO_MEI acima já cobre o
              único colaborador que a lei permite, card à parte seria
              contradição (diria "não incluso" ou repetiria "1 incluso"). */}
          {!semTaxaJunta && (
            <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-body font-semibold text-text-primary">Colaboradores</p>
                <span className="shrink-0 text-body font-semibold text-text-primary">
                  {CUSTOS.COLABORADORES_INCLUSOS === 0
                    ? "não incluso"
                    : `${CUSTOS.COLABORADORES_INCLUSOS} incluso${CUSTOS.COLABORADORES_INCLUSOS > 1 ? "s" : ""}`}
                </span>
              </div>
              <p className="text-caption text-text-secondary mt-1">
                Cada colaborador é {brl(CUSTOS.CUSTO_FUNCIONARIO, true)}/mês a mais na
                mensalidade. Sem funcionário, sem custo extra.
              </p>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              🪒 AQUI TERMINAVA A TELA — e não termina mais (lapidação 29/07).
              Saíram daqui 3 blocos, por 3 motivos diferentes:

              1. **COMPARATIVO** (tradicional R$ 1.621 riscado × "Aqui R$ 0") —
                 era o 3º lugar da tela dizendo "grátis", depois do card verde e
                 da FAQ. Argumento forte repetido não soma, dilui. E o preço
                 riscado é linguagem de varejo, o mesmo vício cortado do N4 no
                 mesmo dia. A âncora sobreviveu como 1 linha no card verde.

              2. **FAQ (4 acordeões)** — era pré-eco do N8. A tela seguinte abre
                 com "Em quatro linhas" e responde 3 das 4 melhor e no lugar
                 certo (honorário zero · período mínimo · 7 dias pra desistir).
                 Antecipar o N8 aqui gastava 4 blocos pra dizer o que o usuário
                 leria um toque depois. A 4ª (variação por faturamento) o N8 NÃO
                 cobre: virou micro-linha visível sob o preço.

              3. **CARD DOS 22 ANOS** — aparecia em N2, N7 e N8. No N8 ele é card
                 completo, com 2 pontos, e nasce onde a dúvida "com quem eu
                 assino?" de fato aparece. Aqui era a terceira repetição.

              A tela voltou a responder 2 perguntas: quanto pago hoje, e o que
              levo todo mês. O resto é do N8.
              ───────────────────────────────────────────────────────────────── */}

          {/* Preço é placeholder declarado: número provisório sem aviso é igual
              a número sem fonte. */}
          <p className="text-micro text-text-tertiary">
            Valores de referência enquanto fechamos o preço final.
          </p>
        </Corpo>

        <Rodape>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <span className="text-caption text-text-secondary">Você paga hoje</span>
            <span className="text-h2 text-text-primary">{brl(hoje, true)}</span>
          </div>
          <Button full onClick={onSeguir}>
            Continuar
          </Button>
        </Rodape>
      </main>
    </>
  );
}

function CheckMiniPlano() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12 4 4 8-9" />
    </svg>
  );
}
/** Check preenchido, 28px. Local: só o card do grátis usa. */
function CheckGrande() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="shrink-0 text-state-success" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path d="m7.5 12.4 3.1 3.1 6-6.2" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ═══════════════════ N8 · ACEITE DO CONTRATO ════════════════════════════ */

export function ContratoView({
  aceito,
  setAceito,
  onSeguir,
  onVoltar,
  onLerContrato,
  semTaxaJunta = false,
}: {
  aceito: boolean;
  setAceito: (v: boolean) => void;
  onSeguir?: () => void;
  onVoltar?: () => void;
  /** 🚧 O documento jurídico não existe ainda (Mauro/Larissa). Enquanto não
      existir, o botão fica inerte — mas NÃO é mais um `href="#"`, que sequestra
      a URL e rola a página pro topo no meio do aceite. */
  onLerContrato?: () => void;
  /** 🆕 03/08 — MEI não paga taxa da Junta (não existe, não é cenário). */
  semTaxaJunta?: boolean;
}) {
  // 🆕 04/08 — mesma correção das telas anteriores: Plano MEI tem mensalidade própria.
  const mensalidade = semTaxaJunta ? CUSTOS.MENSALIDADE_MEI : CUSTOS.MENSALIDADE;
  // 🔄 26/08 (pedido do Pedro) — a DAE NÃO soma mais no "você paga hoje". Só
  // vira cobrança de verdade depois que a viabilidade voltar deferida (A3,
  // `components/painel.tsx`, "Pague a guia da Junta").
  const hoje = mensalidade;

  return (
    <>
      <TelaHeader meta="Contrato de serviço" onVoltar={onVoltar} />
      <main className="app-main">
        <Titulo sub="O que a gente faz por você e o que você paga.">
          Está tudo combinado
        </Titulo>

        <Corpo>
          {/* ═══ RESUMO HUMANO, ACIMA DO JURÍDICO ═══════════════════════════
              🪒 29/07 — as 4 linhas eram 2 novas e 2 ecos. "Abre sem honorário
              e cuida todo mês" e "mensalidade; taxas à parte" RE-EXPLICAVAM com
              palavras o que o N7 tinha acabado de mostrar com números, um toque
              antes. Enquanto isso, a tela do ACEITE não exibia um único valor:
              você assinava o contrato sem ver na tela quanto paga.

              Então as duas primeiras linhas viraram os NÚMEROS (é o que um
              recap-antes-de-assinar deve fazer) e as duas que carregam
              informação nova de verdade — período mínimo e os 7 dias —
              continuam como bullet. Seguem sendo quatro linhas.
              ════════════════════════════════════════════════════════════════ */}
          <div>
            <p className="text-body font-semibold text-text-primary mb-2">Em quatro linhas</p>

            <div className="rounded-2xl border border-border-hairline bg-surface-card">
              <div className="flex items-baseline justify-between gap-3 px-4 pt-3.5">
                <span className="text-caption text-text-secondary">Você paga hoje</span>
                <span className="shrink-0 text-body font-semibold text-text-primary">
                  {brl(hoje, true)}
                </span>
              </div>
              <p className="px-4 pb-3.5 text-micro text-text-tertiary">
                {semTaxaJunta
                  ? "só a 1ª mensalidade — MEI não paga taxa da Junta. Abrir não tem honorário"
                  : "só a 1ª mensalidade. Abrir não tem honorário — a taxa da Junta é cobrada depois, quando a viabilidade sair aprovada"}
              </p>

              <div className="border-t border-border-hairline">
                <div className="flex items-baseline justify-between gap-3 px-4 pt-3.5">
                  <span className="text-caption text-text-secondary">Depois, todo mês</span>
                  <span className="shrink-0 text-body font-semibold text-text-primary">
                    {brl(mensalidade)}
                  </span>
                </div>
                <p className="px-4 pb-3.5 text-micro text-text-tertiary">
                  {semTaxaJunta
                    ? "emitir notas fiscais e gerenciar seu colaborador, certificado digital incluso"
                    : "sua contabilidade completa. As taxas do governo são sempre à parte"}
                </p>
              </div>
            </div>

            <ul className="mt-2 flex flex-col gap-2">
              {/* 🟡 O PRAZO DA FIDELIDADE segue em aberto pro plano ME
                  (Mauro/Larissa). Por decisão do Pedro (29/07) a copy fica
                  GENÉRICA ali — sem número inventado. 🆕 04/08 — o Plano MEI
                  JÁ TEM número travado (12 meses, ADR `decisoes-marca.md`):
                  contrapartida do certificado digital que a gente paga. */}
              <Bullet>
                {semTaxaJunta
                  ? `O certificado digital vem incluso — a gente precisa dele pra movimentar sua empresa. Em troca, o plano tem fidelidade de ${CUSTOS.FIDELIDADE_MESES} meses, descrita no contrato.`
                  : "Como a abertura é gratuita, o plano tem um período mínimo de permanência, descrito no contrato."}
              </Bullet>
              <Bullet>
                Nada é irreversível hoje: você tem 7 dias pra mudar de ideia e
                receber tudo de volta.
              </Bullet>
            </ul>
          </div>

          {/* 🐛 Era `<a href="#">` — âncora morta: sequestra a URL e joga a
              página pro topo bem no meio do aceite. Mesma classe do "Falar com
              o time" sem `onClick` pego em 28/07. Agora é botão de verdade,
              esperando o documento do Mauro/Larissa. */}
          <button
            type="button"
            onClick={onLerContrato}
            className="flex min-h-12 w-full items-center justify-center rounded-md border
                       border-border-strong bg-surface-card px-4 text-body font-semibold
                       text-text-primary transition-colors hover:bg-surface-alt"
          >
            Ler o contrato completo
          </button>

          {/* QUEM ESTÁ DO OUTRO LADO — o instante do aceite é o de maior dúvida
              sobre COM QUEM se assina. */}
          <Card tom="marca">
            <p className="text-body font-semibold text-text-primary mb-3">
              Você está abrindo com um escritório de verdade
            </p>
            <div className="flex flex-col gap-3">
              <Ponto
                icone={<IconeEscudo />}
                titulo="22 anos de estrada"
                texto="Contabilidade em Belo Horizonte, de antes de existir app pra isso."
              />
              <Ponto
                icone={<IconePessoa />}
                titulo="Contador com nome e telefone"
                texto="Quem cuida da sua empresa é uma pessoa, e você fala direto com ela."
              />
            </div>
          </Card>

          {/* CHECKBOX EXPLÍCITO: nunca pré-marcado. */}
          <Checkbox checked={aceito} onChange={setAceito}>
            Li e aceito o contrato de serviço da Legalizai.
          </Checkbox>
        </Corpo>

        <Rodape>
          <Button full disabled={!aceito} onClick={onSeguir}>
            Aceitar e continuar
          </Button>
        </Rodape>
      </main>
    </>
  );
}

function Ponto({ icone, titulo, texto }: { icone: ReactNode; titulo: string; texto: string }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 shrink-0 text-action-primary">{icone}</span>
      <div>
        <p className="text-caption font-semibold text-text-primary">{titulo}</p>
        <p className="text-caption text-text-secondary mt-0.5">{texto}</p>
      </div>
    </div>
  );
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-action-primary" />
      <span className="text-body text-text-secondary">{children}</span>
    </li>
  );
}

function IconeEscudo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function IconePessoa() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

/* ═══════════════════ N9 · PAGAMENTO ═════════════════════════════════════ */

export type Metodo = "cartao" | "pix" | "boleto";

/**
 * ⚠️ A DECISÃO DE FUNDO NÃO MUDOU (ver doc da rota `/pagamento` §3): o cartão é
 * empurrado porque destrava a abertura na hora, e a vantagem declarada é do
 * cliente. O que mudou em 29/07 foi só a REDAÇÃO:
 *
 *   · O título do aviso era **"Acelere seu processo"** — imperativo de varejo
 *     numa tela onde não há mais nada a vender: a pessoa já decidiu, só falta
 *     pagar. Agora o título AFIRMA o fato ("Sua abertura começa hoje") em vez
 *     de mandar a pessoa fazer algo.
 *   · O texto repetia a pill do botão selecionado a 3 cm de distância ("cai na
 *     hora" × "assim que o pagamento passar... em minutos"). Agora a pill diz
 *     QUANDO O DINHEIRO CAI e o aviso diz O QUE ACONTECE COM A EMPRESA — que
 *     são fatos diferentes e agora soam diferentes.
 */
export const METODOS: {
  id: Metodo;
  nome: string;
  quando: string;
  aviso: string;
  efeito: string;
  /** 30/07 — mesma tela serve o flow #2; lá o que começa é a MIGRAÇÃO. */
  avisoMigrar: string;
  efeitoMigrar: string;
}[] = [
  {
    id: "cartao",
    nome: "Cartão de crédito",
    quando: "na hora",
    aviso: "Sua abertura começa hoje",
    efeito: "Assim que o pagamento passar, a gente já entra com o processo.",
    avisoMigrar: "Sua migração começa hoje",
    efeitoMigrar:
      "Assim que o pagamento passar, a gente já aciona seu contador anterior.",
  },
  {
    id: "pix",
    nome: "Pix",
    quando: "em minutos",
    aviso: "Sua abertura começa em minutos",
    efeito: "Assim que o Pix cair, a gente já entra com o processo.",
    avisoMigrar: "Sua migração começa em minutos",
    efeitoMigrar:
      "Assim que o Pix cair, a gente já aciona seu contador anterior.",
  },
  {
    id: "boleto",
    nome: "Boleto",
    quando: "1 a 3 dias úteis",
    aviso: "Com boleto, a abertura espera o pagamento",
    efeito:
      "Você já entra no app e adianta tudo. A abertura em si só começa quando o boleto compensar.",
    avisoMigrar: "Com boleto, a migração espera o pagamento",
    efeitoMigrar:
      "Você já entra no app, mas a gente só aciona seu contador anterior quando o boleto compensar.",
  },
];

export function PagamentoView({
  cpf,
  setCpf,
  metodo,
  setMetodo,
  cpfCadastrado,
  fluxo = "abertura",
  semTaxaJunta = false,
  onPagar,
  onVoltar,
}: {
  cpf: string;
  setCpf: (v: string) => void;
  metodo: Metodo;
  setMetodo: (m: Metodo) => void;
  /**
   * 🐛 CPF PEDIDO 2× — corrigido em 29/07.
   *
   * O N6 virou front-load em 28/07 e passou a coletar CPF (`DadosConta.cpf`).
   * O N9 continuava abrindo um campo vazio e pedindo tudo de novo: é o mesmo
   * "1 dado duplicado sem reuso (CPF pedido 2×)" que o cruzamento com os dados
   * da JUCEMG pegou na reunião de 28/07 — a correção foi aplicada no N10 e
   * esqueceu esta tela.
   *
   * Com o CPF do N6 aqui, a tela só **EXIBE** (decisão do Pedro, 29/07): o dado
   * já foi digitado e validado no cadastro, então não há o que reconfirmar nem
   * editar. Ausente = comportamento antigo, campo em branco — é o caso das
   * rotas de produção, que ainda não têm persistência entre telas (RF-01).
   */
  cpfCadastrado?: string;
  /**
   * 30/07 — `migrar` = flow #2. Muda 2 coisas e só: (1) o total não soma taxa
   * de governo (a empresa já existe, não há DAE nem TFLF); (2) o aviso fala de
   * MIGRAÇÃO, não de abertura. O resto da tela (CPF, métodos, idempotência) é
   * idêntico, então não vale uma tela nova.
   */
  fluxo?: "abertura" | "migrar";
  /** 🆕 03/08 — MEI não paga taxa da Junta. Só se aplica a `fluxo="abertura"`
   *  (migrar já não soma DAE por natureza, empresa já existe). */
  semTaxaJunta?: boolean;
  onPagar?: () => void;
  onVoltar?: () => void;
}) {
  const migrar = fluxo === "migrar";
  // 🆕 04/08 — Plano MEI tem mensalidade própria (R$49,90) em qualquer fluxo
  // (abrir OU migrar) — antes esta tela sempre usava `CUSTOS.MENSALIDADE`
  // genérico mesmo quando `semTaxaJunta` (MEI) era true.
  const mensalidade = semTaxaJunta ? CUSTOS.MENSALIDADE_MEI : CUSTOS.MENSALIDADE;
  // 🔄 26/08 (pedido do Pedro) — a DAE não soma mais aqui. Ela só vira
  // cobrança de verdade depois que a viabilidade voltar deferida (A3),
  // então cobrar agora seria cobrar por algo que ainda não foi emitido.
  const total = mensalidade;
  const escolhido = METODOS.find((m) => m.id === metodo)!;

  const temCadastrado = Boolean(cpfCadastrado?.trim());

  return (
    <>
      <TelaHeader meta="Pagamento" onVoltar={onVoltar} />
      <main className="app-main">
        <Titulo sub={`${brl(total, true)} hoje, e depois ${brl(mensalidade)} por mês.`}>
          Falta só isso
        </Titulo>

        <Corpo>
          {/* CPF: cobrança + elegibilidade no mesmo dado (decisão nº 5).
              Já veio do N6 → confirma. Não veio → coleta, como antes. */}
          {temCadastrado ? (
            /* Só EXIBE (decisão do Pedro, 29/07). A pessoa já digitou e validou
               o CPF no cadastro do app (N6): reabrir edição aqui convidaria a
               divergir de um dado que já passou por validação, e ainda daria a
               entender que a gente não guardou o que ela preencheu. */
            <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
              <p className="text-caption text-text-secondary">Seu CPF</p>
              <p className="mt-1 text-body font-semibold text-text-primary">{cpfCadastrado}</p>
              <p className="text-micro text-text-tertiary mt-2">
                A gente confere na Receita se ele está regular pra abrir empresa.
              </p>
            </div>
          ) : (
            <Campo
              rotulo="Seu CPF"
              dica="A gente confere na Receita se ele está regular pra abrir empresa."
            >
              <Texto
                valor={cpf}
                onChange={setCpf}
                inputMode="numeric"
                maxLength={14}
                placeholder="000.000.000-00"
              />
            </Campo>
          )}

          <div>
            <p className="text-caption font-semibold text-text-primary mb-2">
              Como você prefere pagar
            </p>
            <div className="flex flex-col gap-2">
              {METODOS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMetodo(m.id)}
                  aria-pressed={metodo === m.id}
                  className={`flex min-h-12 items-center justify-between gap-3 rounded-md border p-4 text-left transition-colors ${
                    metodo === m.id
                      ? "border-action-primary bg-action-primary"
                      : "border-border-hairline bg-surface-card hover:bg-surface-alt"
                  }`}
                >
                  <span
                    className={`text-body font-semibold ${
                      metodo === m.id ? "text-text-on-brand" : "text-text-primary"
                    }`}
                  >
                    {m.nome}
                  </span>
                  <span
                    className={`text-caption ${
                      metodo === m.id ? "text-text-on-brand/80" : "text-text-secondary"
                    }`}
                  >
                    cai {m.quando}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* O EFEITO DA ESCOLHA, EM TEMPO REAL: o cliente escolhe QUANDO a
              empresa dele começa a existir, não "meio de pagamento". */}
          <Aviso
            variante={metodo === "boleto" ? "warning" : "success"}
            titulo={migrar ? escolhido.avisoMigrar : escolhido.aviso}
          >
            {migrar ? escolhido.efeitoMigrar : escolhido.efeito}
          </Aviso>

          {/* IDEMPOTÊNCIA VISÍVEL (UX-38): mata o medo de quem paga e some. */}
          <p className="text-micro text-text-tertiary">
            Você paga uma vez só, mesmo que o app feche na hora do pagamento.
          </p>
        </Corpo>

        <Rodape>
          <Button full onClick={onPagar}>
            Pagar {brl(total, true)}
          </Button>
        </Rodape>
      </main>
    </>
  );
}
