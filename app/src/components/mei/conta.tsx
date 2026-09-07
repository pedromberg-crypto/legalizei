"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Campo, Texto } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { CardNota } from "@/components/ui/card-nota";
import { TelaHeader, Titulo, Corpo, Rolagem, Rodape } from "@/components/ui/tela";
import { linkWhatsApp } from "@/lib/contato";
import { mascaraCpf, mascaraData, mascaraTelefone } from "./_formato";

/**
 * Dígitos do código de verificação. 🔄 07/09: era 6, virou 8 pra bater com o
 * E6.1 do ME. O código sai do MESMO disparo de autenticação nos dois caminhos;
 * ter tamanhos diferentes por regime seria divergência de sistema, não de
 * produto. Copiado como VALOR (a fronteira proíbe importar do ME).
 */
const DIGITOS_CODIGO = 8;

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

  /* 🆕 07/09 — contador de reenvio do código (M4.1), no mesmo mecanismo que o
     E6.1 do ME ganhou em 30/08. Declarado ANTES de qualquer `return`
     condicional: hook tem que rodar em toda renderização, inclusive quando a
     `etapa` ainda é "form" (o componente troca de etapa sem desmontar). */
  const [segundosReenvio, setSegundosReenvio] = useState(60);
  useEffect(() => {
    if (etapa !== "codigo" || segundosReenvio <= 0) return;
    const t = setTimeout(() => setSegundosReenvio((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [etapa, segundosReenvio]);
  // 🚧 mock (RF-01): sem reenvio real de código ainda, só reseta o contador.
  function reenviarCodigo() {
    setSegundosReenvio(60);
  }

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
     🔄 07/09 (pedido do Pedro): a tela era a folha do E6 com um campo curto
     dentro. Passa a ser o LAYOUT APROVADO DO E6.1, porque é o mesmo mecanismo
     — validar contato logo depois de criar o acesso. O que ele traz e faltava
     aqui: o aparelho 3D ocupando a sobra, o contador de reenvio de verdade,
     o escape hatch de quem não recebe o código, e o subtítulo dizendo PRA ONDE
     cada envio foi.

     ⚠️ O painel coral sai daqui de propósito: ele é o vestíbulo da criação da
     conta (M4). Repetir o Léo na confirmação faria a pessoa achar que voltou
     pra tela anterior, e é exatamente o momento em que ela precisa saber que
     avançou. Reescrito, não importado — a fronteira proíbe puxar tela do ME. */
  if (etapa === "codigo") {
    return (
      <>
        <TelaHeader meta={meta} onVoltar={onVoltar} />
        <main className="app-main">
          {/* O aparelho CENTRALIZA na sobra (`flex-1` + `items-center`) e o
              conteúdo desce pro pé. Não é margem chutada: o ícone come o
              espaço livre, então fica no meio em qualquer aparelho, do SE ao
              Pro Max, sem número mágico por tamanho de tela. */}
          <div className="flex min-h-0 flex-1 items-center justify-center py-4">
            {/* Sombra de CONTATO, 2 camadas: a elipse borrada embaixo é o
                encosto na superfície; o `drop-shadow` segue a silhueta do PNG
                e projeta pra baixo e pra DIREITA, mesma direção de luz dos
                ícones do DS. Sombra chapada centralizada faria flutuar em vez
                de apoiar. */}
            <div id="mei-codigo-flutua" className="relative flex h-[90%] max-h-[414px] items-end">
              <div
                aria-hidden
                className="absolute -bottom-2 left-1/2 h-5 w-[72%] -translate-x-1/2 blur-md"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(27,30,36,.30), rgba(27,30,36,.10) 62%, transparent 100%)",
                }}
              />
              <Image
                src="/icones/codigo-aparelho.png"
                alt=""
                aria-hidden
                width={569}
                height={1011}
                priority
                className="relative z-10 h-full w-auto"
                style={{ filter: "drop-shadow(6px 14px 12px rgba(27,30,36,.20))" }}
              />
            </div>

            {/* Flutuação sutil, LOCAL (styled-jsx): acontece nesta tela só.
                O truque pra não virar "sobe e desce" mecânico são durações que
                não se dividem (7s e 5,5s) — o caminho nunca repete igual, e o
                olho lê flutuar, não loop. A sombra faz o contraponto (encolhe
                e clareia quando ele sobe), que é o que dá leitura de altura.
                ♿ `prefers-reduced-motion` desliga tudo: movimento contínuo em
                tela de digitar código é gatilho real de desconforto.
                🔒 Os nomes levam prefixo `mei-` porque `styled-jsx global`
                vaza pro documento: keyframe homônimo do E6.1 se sobreporia na
                `/apresentacao`, onde os dois caminhos vivem na mesma página. */}
            <style jsx global>{`
              @keyframes mei-codigo-flutua-obj {
                0%   { transform: translate3d(0, 0, 0) rotate(0deg); }
                35%  { transform: translate3d(4px, -7px, 0) rotate(0.6deg); }
                70%  { transform: translate3d(-3px, -3px, 0) rotate(-0.5deg); }
                100% { transform: translate3d(0, 0, 0) rotate(0deg); }
              }
              @keyframes mei-codigo-flutua-sombra {
                0%   { transform: translateX(-50%) scaleX(1); opacity: 1; }
                35%  { transform: translateX(-50%) scaleX(0.9); opacity: 0.72; }
                70%  { transform: translateX(-50%) scaleX(0.96); opacity: 0.88; }
                100% { transform: translateX(-50%) scaleX(1); opacity: 1; }
              }
              #mei-codigo-flutua img {
                animation: mei-codigo-flutua-obj 7s ease-in-out infinite;
                will-change: transform;
              }
              #mei-codigo-flutua > div[aria-hidden] {
                animation: mei-codigo-flutua-sombra 5.5s ease-in-out infinite;
                will-change: transform, opacity;
              }
              @media (prefers-reduced-motion: reduce) {
                #mei-codigo-flutua img,
                #mei-codigo-flutua > div[aria-hidden] {
                  animation: none;
                }
              }
            `}</style>
          </div>

          {/* Bloco de baixo ancorado no pé (o `flex-1` de cima é quem empurra).
              `shrink-0` pra ele nunca ser espremido quando o teclado abre. */}
          <div className="shrink-0">
            <Titulo
              sub={
                <>
                  {/* 🔒 e-mail e telefone NUNCA quebram no meio
                      (`whitespace-nowrap`): a linha quebra ANTES do dado.
                      Número partido em duas linhas é o tipo de coisa que a
                      pessoa lê errado e conclui que a gente mandou pro lugar
                      errado — justamente na tela em que ela confere isso. */}
                  Mandamos um código de {DIGITOS_CODIGO} dígitos pro{" "}
                  <strong className="whitespace-nowrap font-bold text-action-primary-sm">
                    {dados.email || "seu e-mail"}
                  </strong>{" "}
                  e por SMS pro{" "}
                  <strong className="whitespace-nowrap font-bold text-action-primary-sm">
                    {dados.telefone || "seu telefone"}
                  </strong>
                  .
                </>
              }
            >
              Digite o código
            </Titulo>
            <Corpo>
              <Campo rotulo="Código de verificação">
                <Texto
                  valor={codigo}
                  onChange={(v) => setCodigo(v.replace(/\D/g, "").slice(0, DIGITOS_CODIGO))}
                  placeholder="00000000"
                  inputMode="numeric"
                  maxLength={DIGITOS_CODIGO}
                />
              </Campo>
              {segundosReenvio > 0 ? (
                <p className="text-micro text-text-tertiary">
                  Não chegou? Confere o spam ou pede um novo em{" "}
                  <strong className="font-bold text-action-primary-sm">{segundosReenvio}s</strong>.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={reenviarCodigo}
                  className="self-start text-micro font-semibold text-text-secondary underline underline-offset-4"
                >
                  Reenviar código
                </button>
              )}
            </Corpo>
          </div>

          <Rodape>
            {/* Escape hatch acima do CTA: quem não recebe o código fica sem
                saída nenhuma (o reenvio só repete o que não chegou). Vai pro
                WhatsApp com a situação já descrita. */}
            <a
              href={linkWhatsApp(
                "Oi! Estou abrindo meu MEI no app da Legalizai e o código de verificação não está chegando. Podem me ajudar?",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-3 block w-full text-center text-caption font-medium text-text-secondary underline underline-offset-4"
            >
              O código não está chegando? Chama a gente.
            </a>
            <Button full disabled={codigo.length !== DIGITOS_CODIGO} onClick={onSeguir}>
              Confirmar código
            </Button>
          </Rodape>
        </main>
      </>
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
