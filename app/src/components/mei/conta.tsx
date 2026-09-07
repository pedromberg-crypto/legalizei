"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Campo, Texto } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { CardNota } from "@/components/ui/card-nota";
import { TelaHeader, Titulo, Corpo, Rolagem, Rodape } from "@/components/ui/tela";
import { mascaraCpf, mascaraData, mascaraTelefone } from "./_formato";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M4 · SUA CONTA — no layout aprovado do E6 (painel coral + folha branca).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09, redesenhada no mesmo dia (pedido do Pedro: layouts do ME, copy
 * daqui).
 *
 * ─── DE ONDE VEM O LAYOUT ───────────────────────────────────────────────────
 * Do E6 (`ContaPainel` em `wizard-dinheiro.tsx`), na forma validada entre
 * 30/08 e 01/09: painel coral sangrando nos 3 lados com a composição da mesa,
 * o Léo escorado na quina, e a **folha clara sobreposta** (raio de 32px,
 * sombra projetada pra cima) que carrega o formulário e é a região que rola.
 *
 * ⚠️ 3 números não são estéticos, são cálculo — copiados de lá porque foram
 * MEDIDOS, não estimados (método travado em 01/09):
 *   · a folha sobrepõe o painel em **36px** (`-mt-9`), e a sobreposição tem
 *     que ser ≥ o raio (32px): com menos, o arco cai fora do coral e mostra o
 *     fundo da página nos cantos;
 *   · o Léo tem o corte reto do corpo em 72,45% da altura do asset, e os
 *     27,55% restantes são a pata, que precisa cair SOBRE a folha. Daí a
 *     fórmula `bottom = 36 − 0,2755 × altura`, que em 240px dá −30px;
 *   · `z-20` põe a garra na frente da folha; sem isso ela cobre a pata e o
 *     efeito morre.
 * Trocou a altura do Léo ou a sobreposição da folha? Recalcula pela fórmula.
 *
 * Reescrito, não importado: a trava de fronteira proíbe o ramo MEI de importar
 * tela de ME.
 *
 * ─── O QUE MUDA EM RELAÇÃO AO E6 ────────────────────────────────────────────
 * Os campos são quase os mesmos, o SENTIDO não é — e era isso que a auditoria
 * de 28/08 pegou (erro nº 5): o subtítulo do E6 dizia *"a gente já adianta o
 * que precisa **pra Junta**"*. O MEI não vai à Junta Comercial; ele registra
 * no Portal do Empreendedor, pela Redesim.
 *
 * A frase certa aqui é outra e vale mais: **estes campos são literalmente os
 * do formulário oficial**. Nome, CPF, data de nascimento e telefone aparecem
 * no Portal com esses nomes. Não é "a gente adianta pra um órgão"; é "a gente
 * está montando a sua cola desde agora".
 *
 * ⚠️ A CONFERÊNCIA DO CPF (com data de nascimento) fica, pelo mesmo motivo do
 * ME: quem casou, mudou o nome no CPF e não atualizou na Receita descobre o
 * problema tarde. No MEI descobre PIOR — no meio do registro que ele mesmo
 * está fazendo, sozinho, sem ninguém do lado.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type EtapaConta = "form" | "codigo" | "cpf-divergente";

export interface DadosContaMei {
  nome: string;
  cpf: string;
  nascimento: string;
  telefone: string;
  email: string;
  senha: string;
}

export const CONTA_MEI_VAZIA: DadosContaMei = {
  nome: "",
  cpf: "",
  nascimento: "",
  telefone: "",
  email: "",
  senha: "",
};

/** Seta clara, pro painel coral (a do `TelaHeader` é escura, some no coral). */
function SetaVoltarPainel() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function ContaMeiView({
  meta,
  etapa,
  dados,
  setDados,
  codigo,
  setCodigo,
  onSeguir,
  onVoltar,
  onFalarComTime,
}: {
  /** Nome de PRA ONDE O VOLTAR LEVA (vem de `mei-flow.metaDoVoltar`). */
  meta: string;
  etapa: EtapaConta;
  dados: DadosContaMei;
  setDados: (d: DadosContaMei) => void;
  codigo: string;
  setCodigo: (v: string) => void;
  onSeguir?: () => void;
  onVoltar?: () => void;
  /** Saída da divergência de CPF: isso não se resolve num formulário. */
  onFalarComTime?: () => void;
}) {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const set = <K extends keyof DadosContaMei>(k: K, v: DadosContaMei[K]) =>
    setDados({ ...dados, [k]: v });

  const nomeOk = dados.nome.trim().split(/\s+/).length >= 2;
  const cpfCheio = dados.cpf.replace(/\D/g, "").length === 11;
  const nascimentoCheio = dados.nascimento.replace(/\D/g, "").length === 8;
  const telefoneCheio = dados.telefone.replace(/\D/g, "").length >= 10;
  /* Senha forte de verdade (regra de 30/08 do ME): mín. 8, maiúscula,
     minúscula e número. Sem "repita a senha" — por isso o olho existe. */
  const senhaOk =
    dados.senha.length >= 8 &&
    /[a-z]/.test(dados.senha) &&
    /[A-Z]/.test(dados.senha) &&
    /[0-9]/.test(dados.senha);
  const completo =
    nomeOk && cpfCheio && nascimentoCheio && telefoneCheio && /@/.test(dados.email) && senhaOk;

  /* ── M4.2 · O CPF NÃO CONFERE ─────────────────────────────────────────
     Estado de exceção: usa o esqueleto padrão de tela (não a folha), porque
     aqui não há formulário — há uma explicação e uma saída. */
  if (etapa === "cpf-divergente") {
    return (
      <>
        <TelaHeader meta={meta} onVoltar={onVoltar} />
        <main className="app-main">
          <Titulo sub="O nome que você digitou não bate com o que a Receita tem no seu CPF.">
            Precisamos conferir isso antes
          </Titulo>
          <Corpo>
            <CardNota variante="atencao" titulo="Por que isso trava o seu MEI">
              O Portal do Empreendedor puxa seu nome direto da Receita. Se o
              cadastro lá estiver desatualizado (casamento, divórcio, correção
              de grafia), o registro não completa e você descobre no meio do
              caminho, sozinho.
            </CardNota>
            <p className="text-caption text-text-secondary">
              Isso se resolve na Receita, e é rápido. A gente te mostra o que
              fazer e fica com o seu cadastro guardado até lá.
            </p>
          </Corpo>
          <Rodape>
            <Button full onClick={onFalarComTime}>
              Falar com o time
            </Button>
          </Rodape>
        </main>
      </>
    );
  }

  /* ── M4.1 · O CÓDIGO ──────────────────────────────────────────────────
     Mesma folha, conteúdo mínimo: no E6 o código também vive no layout de
     painel, com o conteúdo empurrado pro pé da tela. */
  if (etapa === "codigo") {
    return (
      <main className="app-main">
        <PainelCoral onVoltar={onVoltar} />
        <FolhaClara titulo="Confirma que é você" sub={`Mandamos um código de 6 dígitos pro ${dados.telefone || "seu WhatsApp"}.`}>
          <Campo rotulo="Código">
            <Texto
              valor={codigo}
              onChange={(v) => setCodigo(v.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              inputMode="numeric"
              maxLength={6}
            />
          </Campo>
          <p className="mt-3 text-micro text-text-tertiary">
            Não chegou? Confere o número e pede de novo em alguns segundos.
          </p>
        </FolhaClara>
        <Rodape>
          <Button full disabled={codigo.length !== 6} onClick={onSeguir}>
            {codigo.length !== 6 ? "Digite os 6 dígitos" : "Confirmar"}
          </Button>
        </Rodape>
      </main>
    );
  }

  /* ── M4 · O FORMULÁRIO ────────────────────────────────────────────────── */
  return (
    <main className="app-main">
      <PainelCoral onVoltar={onVoltar} />

      <FolhaClara
        titulo="Criar acesso"
        sub="Estes são, literalmente, os campos do formulário do MEI. Preenchendo aqui, você não preenche de novo lá."
      >
        <div className="flex flex-col gap-4">
          <Campo rotulo="Seu nome completo" dica="Igualzinho ao que está no seu CPF.">
            <Texto
              valor={dados.nome}
              onChange={(v) => set("nome", v)}
              placeholder="Nome e sobrenome"
            />
          </Campo>

          <div className="grid grid-cols-2 gap-3">
            <Campo rotulo="CPF">
              <Texto
                valor={dados.cpf}
                onChange={(v) => set("cpf", mascaraCpf(v))}
                placeholder="000.000.000-00"
                inputMode="numeric"
                maxLength={14}
              />
            </Campo>
            <Campo rotulo="Nascimento">
              <Texto
                valor={dados.nascimento}
                onChange={(v) => set("nascimento", mascaraData(v))}
                placeholder="00/00/0000"
                inputMode="numeric"
                maxLength={10}
              />
            </Campo>
          </div>

          <Campo
            rotulo="WhatsApp"
            dica="É por aqui que a gente te avisa quando estiver tudo pronto."
          >
            <Texto
              valor={dados.telefone}
              onChange={(v) => set("telefone", mascaraTelefone(v))}
              placeholder="(31) 90000-0000"
              inputMode="tel"
              maxLength={15}
            />
          </Campo>

          <Campo rotulo="E-mail">
            <Texto
              valor={dados.email}
              onChange={(v) => set("email", v)}
              placeholder="voce@email.com"
              inputMode="email"
              type="email"
            />
          </Campo>

          <Campo
            rotulo="Senha"
            dica="Mínimo de 8 caracteres, com maiúscula, minúscula e número."
            /* O olho existe porque não há "repita a senha": erro de digitação
               num campo cego só apareceria no próximo login. */
            acao={
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="text-micro font-semibold text-text-secondary underline underline-offset-4"
              >
                {mostrarSenha ? "Ocultar" : "Mostrar"}
              </button>
            }
          >
            <Texto
              valor={dados.senha}
              onChange={(v) => set("senha", v)}
              placeholder="••••••••"
              type={mostrarSenha ? "text" : "password"}
            />
          </Campo>

          <Card>
            <p className="text-caption text-text-secondary">
              A gente confere seu CPF com a Receita agora, não lá na frente.
              Divergência de cadastro é o que mais trava registro de MEI, e é
              bem mais barato descobrir aqui.
            </p>
          </Card>
        </div>
      </FolhaClara>

      <Rodape>
        {/* O botão DIZ O QUE FALTA, régua de 04/09. */}
        <Button full disabled={!completo} onClick={onSeguir}>
          {!completo ? "Complete seus dados" : "Criar conta"}
        </Button>
      </Rodape>
    </main>
  );
}

/* ═══════════════════ AS 2 PEÇAS DO LAYOUT DO E6 ═════════════════════════ */

/**
 * O painel coral que sangra nos 3 lados, com o Léo escorado.
 *
 * A margem negativa desfaz o padding do shell pra COR chegar na borda do
 * vidro, e o padding devolve a inset pro CONTEÚDO. O coral é o hex EXATO do
 * hero do E3.3 (medido na composição do Pedro), não o token `action-primary`:
 * as telas ficam lado a lado na apresentação, e tom diferente entre elas lê
 * como erro de impressão.
 */
function PainelCoral({ onVoltar }: { onVoltar?: () => void }) {
  return (
    <div
      className="relative -mx-6 shrink-0 px-7 pb-44"
      style={{
        marginTop: "calc(-1 * var(--safe-top))",
        paddingTop: "calc(var(--safe-top) + 1.5rem)",
        backgroundColor: "#CD4E2C",
        backgroundImage: "url(/leo/fundo-mesa-v2.png)",
        backgroundSize: "cover",
        backgroundPosition: "left 28px",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex h-8 items-center">
        {onVoltar && (
          <button
            onClick={onVoltar}
            aria-label="Voltar"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-on-dark/70 transition-colors hover:text-text-on-dark"
          >
            <SetaVoltarPainel />
          </button>
        )}
      </div>

      {/* Encaixe medido, não estimado — ver a fórmula no cabeçalho do arquivo. */}
      <Image
        src="/leo/leo-escorado.png"
        alt=""
        aria-hidden
        width={758}
        height={864}
        priority
        className="pointer-events-none absolute right-6 z-20 h-[240px] w-auto"
        style={{ bottom: "-30px" }}
      />
    </div>
  );
}

/**
 * A folha clara que sobrepõe o painel e carrega o formulário.
 *
 * Título e subtítulo são FIXOS (só os campos rolam): quando a folha inteira
 * rolava, o título sumia junto e a âncora da tela se perdia. A `Rolagem` traz
 * o degradê de continuidade de fábrica — este contêiner nasceu sem ele no E6,
 * e foi um dos bugs que fizeram o componente existir no DS.
 */
function FolhaClara({
  titulo,
  sub,
  children,
}: {
  titulo: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative -mx-6 -mt-9 flex min-h-0 flex-1 flex-col rounded-t-[32px] bg-surface-page px-7 pt-7"
      style={{ boxShadow: "0 -10px 22px -6px rgba(0,0,0,.28)" }}
    >
      <div className="mb-5 shrink-0">
        <h1 className="text-h1 text-text-primary">{titulo}</h1>
        <p className="text-caption text-text-secondary mt-1.5">{sub}</p>
      </div>
      <Rolagem>
        <div className="pb-4">{children}</div>
      </Rolagem>
    </div>
  );
}
