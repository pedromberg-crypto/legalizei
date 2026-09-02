"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso, useFadeScroll } from "@/components/ui/tela";
import { Campo, Texto, Checkbox } from "@/components/ui/form";
// 🆕 01/09 — o mesmo bottom-sheet que explicava o não-reembolso no A1 vem pra
// cá junto do aceite: a explicação deve morar ao lado do gesto que ela explica.
import { SheetNaoReembolsavel } from "@/components/wizard-cauda";
// 🗑️ 01/09 — ícones Google/Apple saíram junto do login social.
import { CUSTOS, brl } from "@/lib/fiscal";
import { CardIconeSelecao, CheckMiniRegime } from "@/components/gate-telas";
import { linkWhatsApp } from "@/lib/contato";
import { CardNota } from "@/components/ui/card-nota";
// 🆕 01/09 — o pagamento agora pré-preenche o que já foi coletado: identidade
// (mock da conta criada no E6) e endereço (rascunho do E3.4).
import { CLIENTE } from "@/app/(app)/dossie/mock";
import { lerRascunhoEndereco } from "@/lib/rascunho";

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
/** 🚧 Mock do autofill por CEP — mesmo padrão do N13 (sem API real ainda).
 *  🆕 29/08 (pedido do Pedro, testes do gate de cidade) — 39560-000 (Salinas,
 *  MG, de cabeça pra teste) devolve a cidade real em vez do fallback BH, pra
 *  testar o "cidade travada" do fora-de-BH sem precisar de API de verdade. */
export function buscarCep(cepDigitos: string): EnderecoCep | null {
  if (cepDigitos.length !== 8) return null;
  if (cepDigitos === "39560000") {
    return {
      logradouro: "Rua Comércio",
      bairro: "Centro",
      municipio: "Salinas",
      uf: "MG",
    };
  }
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
  /** 🆕 30/08 (pedido do Pedro) — confirmação de senha, padrão de sempre. */
  confirmarSenha: string;
  cep: string;
  numero: string;
  /** 🆕 28/08 (pedido do Pedro) — opcional, mesmo padrão do resto do form. */
  complemento: string;
  coorte: "primeira" | "ja-abri" | null;
  codigo: string;
};

/**
 * 🔄 01/09 (pedido do Pedro) — o código de verificação do E6 passou de 6 pra
 * **8 dígitos**. Fica numa constante porque o número aparece em 4 lugares
 * (copy do subtítulo, máscara do input, placeholder e a trava do CTA) e, em
 * 6 dígitos, esses 4 já tinham vivido desalinhados: mudar num lugar só deixa
 * um campo que aceita mais do que o botão libera, e a pessoa fica travada sem
 * entender por quê.
 */
const DIGITOS_CODIGO = 8;

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
  // 🆕 30/08 (pedido do Pedro) — contador de reenvio do código (E6.1), 60s
  // (era 30s, só na copy, sem contador de verdade nenhum). Declarado ANTES de
  // qualquer `return` condicional: hook tem que rodar em toda renderização,
  // mesmo quando `etapa` ainda é "form" (regra dos hooks — o componente troca
  // de etapa sem desmontar).
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
  // 🗑️ 01/09 — idem layout "classico": endereço pessoal migrou pro C1.
  const completo =
    nomeOk && cpfCheio && telefoneCheio && /@/.test(d.email) && d.senha.length >= 8;

  if (etapa === "codigo") {
    return (
      <>
        <TelaHeader meta="Confirme seu acesso" onVoltar={onVoltar} />
        <main className="app-main">
          {/* 🆕 01/09 (pedido do Pedro) — ilustração 3D em cima, conteúdo
              descendo. Mesmo idioma dos ícones do DS (família A: clay macio,
              bevel grosso, brilho satinado) e nas cores da paleta: corpo em
              ink escuro, tela em papel quente, os 3 asteriscos em coral — o
              único ponto de coral, porque coral é marca e AÇÃO, e a ação aqui
              é justamente o código que ela vai digitar.
              🔄 01/09 (2ª rodada, pedido do Pedro) — o aparelho passou a
              CENTRALIZAR no espaço livre (`flex-1` + `items-center`) e o
              conteúdo desceu inteiro pro pé da tela. Não é margem chutada: o
              ícone ocupa a sobra, então ele fica no meio em qualquer aparelho,
              do iPhone SE ao Pro Max, sem número mágico por tamanho de tela. */}
          <div className="flex min-h-0 flex-1 items-center justify-center py-4">
            {/* 🆕 01/09 (pedido do Pedro) — sombra de CONTATO: o aparelho
                parece escorado numa mesa. São 2 camadas, e as duas importam:
                a elipse borrada embaixo é o contato com a superfície (mais
                densa e curta, porque a base do objeto encosta ali), e o
                `drop-shadow` no próprio PNG segue a silhueta dele, projetando
                pra baixo e pra DIREITA — mesma direção de luz dos ícones do
                DS, que vem do alto à esquerda. Sombra chapada centralizada
                faria o objeto flutuar em vez de apoiar. */}
            <div id="codigo-flutua" className="relative flex h-[90%] max-h-[414px] items-end">
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
              // 🔄 01/09 (4ª rodada, pedido do Pedro) — o aparelho deixa de
              // ter altura fixa e passa a OCUPAR o espaço livre (`h-full`).
              // Como o container é o `flex-1`, ele cresce até onde dá e para
              // sozinho quando o conteúdo de baixo precisa do espaço — some o
              // vai-e-vem de "aumenta mais 20%". 🔄 -10% depois de ver na
              // tela: ocupa 90% da sobra, com teto de 414px pra não virar
              // pôster num Pro Max.
                className="relative z-10 h-full w-auto"
                style={{ filter: "drop-shadow(6px 14px 12px rgba(27,30,36,.20))" }}
              />
            </div>

            {/* 🆕 01/09 (pedido do Pedro) — flutuação sutil. Animação LOCAL
                (styled-jsx), não vira token nem utilitário: acontece nesta
                tela só, e promover ao DS seria abstração especulativa
                (design-system.md §6).

                O truque pra não parecer um "sobe e desce" mecânico: dois
                movimentos com DURAÇÕES QUE NÃO SE DIVIDEM (7s e 5,5s). Como
                não fecham no mesmo ponto, o caminho nunca se repete igual e o
                olho lê como flutuar, não como loop. O aparelho anda no eixo
                vertical e gira 1 grau; a sombra faz o contraponto (encolhe e
                clareia quando ele sobe), que é o que dá a leitura de altura.

                ♿ `prefers-reduced-motion` desliga tudo: movimento contínuo em
                tela de digitar código é gatilho real de desconforto. */}
            <style jsx global>{`
              @keyframes codigo-flutua-obj {
                0%   { transform: translate3d(0, 0, 0) rotate(0deg); }
                35%  { transform: translate3d(4px, -7px, 0) rotate(0.6deg); }
                70%  { transform: translate3d(-3px, -3px, 0) rotate(-0.5deg); }
                100% { transform: translate3d(0, 0, 0) rotate(0deg); }
              }
              @keyframes codigo-flutua-sombra {
                0%   { transform: translateX(-50%) scaleX(1); opacity: 1; }
                35%  { transform: translateX(-50%) scaleX(0.9); opacity: 0.72; }
                70%  { transform: translateX(-50%) scaleX(0.96); opacity: 0.88; }
                100% { transform: translateX(-50%) scaleX(1); opacity: 1; }
              }
              #codigo-flutua img {
                animation: codigo-flutua-obj 7s ease-in-out infinite;
                will-change: transform;
              }
              #codigo-flutua > div[aria-hidden] {
                animation: codigo-flutua-sombra 5.5s ease-in-out infinite;
                will-change: transform, opacity;
              }
              @media (prefers-reduced-motion: reduce) {
                #codigo-flutua img,
                #codigo-flutua > div[aria-hidden] {
                  animation: none;
                }
              }
            `}</style>
          </div>
          {/* Bloco de baixo: título + campo + reenvio, ancorados no pé da
              tela (o `flex-1` de cima é quem empurra). `shrink-0` pra ele
              nunca ser espremido quando o teclado abre. */}
          <div className="shrink-0">
          {/* 🔄 30/08 (pedido do Pedro) — explicita PRA ONDE foi cada envio
              (e-mail e telefone, os dois em coral+negrito), não só "e por
              SMS" genérico. */}
          <Titulo
            sub={
              <>
                {/* 🔒 01/09 (regra do Pedro) — e-mail e telefone NUNCA quebram
                    no meio. `whitespace-nowrap` faz a linha quebrar ANTES do
                    dado, empurrando ele inteiro pra linha de baixo. Endereço
                    ou número partido em duas linhas é o tipo de coisa que a
                    pessoa lê errado e conclui que a gente mandou pro lugar
                    errado — justamente na tela em que ela está conferindo
                    isso. Vale como padrão pra qualquer dado de contato
                    embutido em frase. */}
                Mandamos um código de 8 dígitos pro{" "}
                <strong className="whitespace-nowrap font-bold text-action-primary-sm">
                  {d.email || "seu e-mail"}
                </strong>{" "}
                e por SMS pro{" "}
                <strong className="whitespace-nowrap font-bold text-action-primary-sm">
                  {d.telefone || "seu telefone"}
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
                valor={d.codigo}
                onChange={(v) => set("codigo", v.replace(/\D/g, "").slice(0, DIGITOS_CODIGO))}
                placeholder="00000000"
                inputMode="numeric"
              />
            </Campo>
            {/* 🔄 30/08 (pedido do Pedro) — era só copy estática ("...em
                30s"), sem contador nem CTA de reenvio de verdade. Agora conta
                de 60 em 60 pra baixo e vira botão quando zera. */}
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
            {/* 🆕 01/09 (pedido do Pedro) — escape hatch acima do CTA, mesmo
                padrão do E3.2: quem não recebe o código fica sem saída nenhuma
                (o reenvio só repete o que não chegou). Vai pro WhatsApp com a
                situação já descrita. */}
            <a
              href={linkWhatsApp(
                "Oi! Estou criando minha conta no app da Legalizai e o código de verificação não está chegando. Podem me ajudar?",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-3 block w-full text-center text-caption font-medium text-text-secondary underline underline-offset-4"
            >
              O código não está chegando? Chama a gente.
            </a>
            <Button full disabled={d.codigo.length !== DIGITOS_CODIGO} onClick={onConfirmar}>
              Confirmar código
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
          {/* 🗑️ 01/09 (decisão do Pedro) — LOGIN SOCIAL (Google/Apple) SAIU.
              Não teremos por enquanto: manter os botões prometia um caminho
              que não existe, e o pior tipo de fricção é o botão que decepciona
              quem clica. Volta quando a integração existir de verdade. */}
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

          {/* 🗑️ 01/09 — endereço pessoal saiu do cadastro e foi pro C1 (ver a
              nota longa no layout "painel", que é o de produção). */}

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
  // 🗑️ 01/09 — sem botões sociais, `social` é sempre null; fica como const
  // pra não espalhar `false` nas 3 condições que ainda leem esse estado.
  const social: "google" | "apple" | null = null;
  // 🆕 28/08 (sugestão minha, pedido do Pedro) — mostrar/ocultar senha. Campo
  // de senha cego numa tela sem confirmação (não tem "repita a senha") é onde
  // esse toggle mais compensa: erro de digitação só aparece no próximo login.
  // Destructuring no ponto da chamada: acessar `rolagem.viewport` dentro do
  // JSX conta como leitura de ref durante o render pro lint do React.
  const {
    viewport: refRolagem,
    conteudo: refConteudoRolagem,
    style: estiloFade,
  } = useFadeScroll();
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // 🗑️ 01/09 — `conectar()` removida junto dos botões sociais.

  const nomeOk = d.nome.trim().split(/\s+/).length >= 2;
  const cpfCheio = d.cpf.replace(/\D/g, "").length === 11;
  const telefoneCheio = d.telefone.replace(/\D/g, "").length >= 10;
  // 🆕 30/08 (pedido do Pedro) — senha forte de verdade (maiúscula + minúscula
  // + número, mín. 8), e confirmação tem que bater com a senha. Conta social
  // nunca passa por aqui: `senha` vira o valor mock `__social__`.
  const senhaForte =
    d.senha.length >= 8 && /[a-z]/.test(d.senha) && /[A-Z]/.test(d.senha) && /[0-9]/.test(d.senha);
  const senhaOk = social !== null || (senhaForte && d.senha === d.confirmarSenha);
  // Com o lead já captado (E3.1 + E3.3), o que falta pra virar conta é só CPF
  // e senha — os outros campos nem aparecem, então não podem travar o CTA.
  // 🗑️ 01/09 — CEP/número saíram da conta (viraram o endereço pessoal do C1),
  // então não travam mais o CTA.
  const completo = leadJaCaptado
    ? cpfCheio && senhaOk
    : nomeOk && cpfCheio && telefoneCheio && /@/.test(d.email) && senhaOk;

  return (
    <main className="app-main">
      {/* PAINEL ESCURO — sangra nos 3 lados, mesma mecânica do login: a margem
          negativa desfaz o padding do shell pra COR chegar na borda do vidro,
          e o padding devolve a inset pro CONTEÚDO. */}
      {/* 🔄 01/09 (pedido do Pedro) — o painel escuro cresce (`pb-14` →
          `pb-32`) e a folha clara desce junto: mais respiro em volta da marca,
          que é a única coisa que mora aqui em cima. Mesmo movimento da tela do
          código, onde o conteúdo foi pro pé da tela. */}
      {/* 🔄 01/09 (pedido do Pedro) — `pb-32` → `pb-44`: o painel coral cresce
          mais 48px e leva TUDO junto pra baixo (folha, Léo e formulário), sem
          nenhum ajuste extra — o Léo é ancorado na base do painel e a folha é
          irmã dele no fluxo, então os três se movem em bloco. */}
      <div
        className="relative -mx-6 shrink-0 px-7 pb-44"
        style={{
          marginTop: "calc(-1 * var(--safe-top))",
          paddingTop: "calc(var(--safe-top) + 1.5rem)",
          // 🔄 01/09 (pedido do Pedro) — o painel de cima vira CORAL (era o
          // ink escuro), e é o coral EXATO do hero do E3.3 (#DF5530, medido na
          // composição que o Pedro montou), não o token `action-primary`
          // (#F2643C). As duas telas são vizinhas no flow e ficam lado a lado
          // na apresentação: tom diferente entre elas lê como erro de
          // impressão. 🔴 Se um dia o hero for recolorido pro token, esta
          // linha vai junto — por isso o hex está anotado nos dois lugares.
          // 🔄 01/09 (asset do Pedro) — o painel deixa de ser cor+degradê+PNG
          // da mesa e passa a ser UMA composição pronta: coral, plano escuro
          // diagonal e mesa, tudo achatado num arquivo só (`fundo-mesa.png`).
          // Mesmo movimento do hero da E3.3 e pelo mesmo motivo: com tudo
          // achatado não há alfa pra interpretar nem 3 camadas pra alinhar.
          // A ancoragem é `left` + um offset vertical: `left top` colava a
          // mesa no teto do painel (e ela ficava rente ao relógio). 28px pra
          // baixo dão o respiro que o Pedro pediu sem mexer no `cover`.
          backgroundColor: "#CD4E2C",
          backgroundImage: "url(/leo/fundo-mesa-v2.png)",
          backgroundSize: "cover",
          backgroundPosition: "left 28px",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* 🗑️ 01/09 (decisão do Pedro) — o LOGO SAIU deste painel. Ele veio
            do layout de login, onde a marca precisava se apresentar; aqui a
            pessoa já atravessou 5 telas do app e sabe onde está — a marca
            repetida só disputava a faixa com o Léo. Sobra a seta de voltar,
            que é função, não enfeite. */}
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

        {/* 🆕 01/09 (ideia do Pedro) — o Léo ESCORADO na quina da folha, queixo
            apoiado no braço dobrado, acompanhando a pessoa preencher. Mesma
            gramática do hero do E3.3 (personagem atrás de uma superfície que é
            a própria interface), gesto diferente: lá ele repara em quem chega,
            aqui ele faz companhia enquanto ela digita.

            A conta que posiciona: o asset tem 864px e o corpo é cortado reto
            em 72,5% (626px) — os 27,5% de baixo são a pata com as garras, que
            precisam cair SOBRE a folha. Com 260px de altura na tela, a garra
            mede 71px; a folha começa 20px acima da base do painel (o `-mt-5`
            dela), então a base da imagem desce 51px além do painel pra linha
            do corte bater exatamente na quina. `z-20` põe as garras na frente
            da folha; sem isso ela cobriria a pata e o efeito morre.
            🔄 01/09 (2ª tentativa) — 260px era grande demais pra faixa: ele
            invadia o logo e dominava a tela. Em 205px a garra sobrando mede
            🔄 01/09 (encaixe medido, método do Pedro) — nada de olho: o corte
            reto do asset foi localizado coluna a coluna. A base da blusa está
            em y=626 de 864 = **72,45%**, e essa linha atravessa a figura
            inteira (x=15→742). Só a pata desce além dela (x=393→665), que são
            os 27,55% que ficam SOBRE a folha.

            Daí sai a fórmula, sem chute: garra = 0,2755 × altura; a folha
            sobe 36px no painel (`-mt-9`); logo `bottom = 36 − 0,2755 × altura`.
            Em 240px: 36 − 66 = −30px. Trocou a altura OU a sobreposição da
            folha? Recalcula por aqui.

            `right-6` tira ele do canto: em cima da curva do canto arredondado
            o braço não tem superfície reta onde apoiar, e o efeito lia como
            flutuação. */}
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

      {/* FOLHA CLARA — sobrepõe o painel (o canto arredondado "monta" na cor).
          Diferente do login, ela ROLA: é a região elástica da tela. */}
      {/* 🔄 01/09 (pedido do Pedro: "copia o que deu certo na E3.3") — a folha
          ganha o MESMO tratamento do hero da E3.3: raio de 32px (fora da escala
          do DS, exceção já registrada lá) e sombra PROJETADA pra cima sobre o
          coral, em vez de encostar seca. É a sombra que faz a folha ler como
          superfície na frente do painel — e é o que sustenta a ilusão de que o
          Léo está atrás dela, escorado na quina.
          🐛 01/09 (achado do Pedro) — a sobreposição era `-mt-5` (20px) com
          quina de 32px: os últimos 12px do arco caíam FORA do painel coral e
          mostravam o fundo da página nos cantos. Sobreposição tem que ser
          >= o raio, senão a curva revela o que não deve. `-mt-9` = 36px. */}
      <div
        className="relative -mx-6 -mt-9 flex min-h-0 flex-1 flex-col rounded-t-[32px] bg-surface-page px-7 pt-7"
        style={{ boxShadow: "0 -10px 22px -6px rgba(0,0,0,.28)" }}
      >
        {/* 🔄 30/08 (pedido do Pedro) — título e subtítulo migraram do painel
            escuro pra dentro da folha clara, como título do próprio card. */}
        {/* 🔄 01/09 (pedido do Pedro) — título e subtítulo FIXOS, como no
            resto do wizard (`Titulo` + `Corpo` das outras telas): a folha
            inteira rolava e o título sumia junto, quebrando a âncora da tela.
            Agora só os campos rolam, no container logo abaixo. */}
        <div className="mb-5 shrink-0">
          {/* 🔄 01/09 (pedido do Pedro) — título curto: "Criar acesso". O
              anterior ("Vamos criar seu acesso.") ocupava a largura toda e
              passava por baixo da pata do Léo; encurtar resolveu a colisão sem
              mexer no layout nem empurrar o texto pra baixo. */}
          <h1 className="text-h1 text-text-primary">Criar acesso</h1>
          <p className="text-caption text-text-secondary mt-1.5">
            {subConta(mei, leadJaCaptado)}
          </p>
        </div>

        {/* 🐛 01/09 (achado do Pedro) — este contêiner rola mas NASCEU sem o
            degradê de continuidade que todas as outras telas têm (o `Corpo` do
            DS traz de fábrica; aqui a folha branca tem rolagem própria). Agora
            usa o mesmo hook, então o comportamento é idêntico ao resto. */}
        <div
          ref={refRolagem}
          style={estiloFade}
          className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div ref={refConteudoRolagem}>

        {/* 🗑️ 01/09 — o card "conectado por Google/Apple" saiu junto do login
            social: sem os botões, `social` nunca vira diferente de null e este
            bloco era inalcançável. Recuperável no git quando o OAuth existir. */}

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
                  type={mostrarSenha ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Senha (mín. 8 caracteres)"
                  aria-label="Senha"
                  className="min-h-12 flex-1 bg-transparent text-body text-text-primary outline-none placeholder:text-text-muted"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  className="shrink-0 text-text-tertiary transition-colors hover:text-text-secondary"
                >
                  {mostrarSenha ? <IconeOlhoFechado /> : <IconeOlhoAberto />}
                </button>
              </CampoIconeConta>
              {/* 🆕 30/08 (pedido do Pedro) — orientação de força da senha,
                  logo abaixo do campo (a regra é checada de verdade em
                  `senhaForte`, isso não é só decoração). */}
              {/* 🔄 01/09 (achado do Pedro) — faltava o mínimo de 8
                  caracteres, que `senhaForte` já exigia desde 30/08. Regra
                  cobrada e não avisada é a pior combinação: a pessoa digita
                  uma senha com os 3 tipos de caractere, o CTA continua morto e
                  ela não sabe por quê. */}
              <p className="text-micro text-text-tertiary -mt-2">
                Pelo menos 8 caracteres, com letras maiúsculas, minúsculas e
                números.
              </p>

              {/* 🆕 30/08 (pedido do Pedro) — confirmar senha, padrão de
                  sempre. Reusa o mesmo toggle de mostrar/ocultar da senha
                  (os dois campos viram texto/senha juntos). */}
              <CampoIconeConta icone={<IconeCadeadoConta />}>
                <input
                  value={d.confirmarSenha}
                  onChange={(e) => set("confirmarSenha", e.target.value)}
                  type={mostrarSenha ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirmar senha"
                  aria-label="Confirmar senha"
                  className="min-h-12 flex-1 bg-transparent text-body text-text-primary outline-none placeholder:text-text-muted"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  className="shrink-0 text-text-tertiary transition-colors hover:text-text-secondary"
                >
                  {mostrarSenha ? <IconeOlhoFechado /> : <IconeOlhoAberto />}
                </button>
              </CampoIconeConta>
              {d.confirmarSenha.length > 0 && d.senha !== d.confirmarSenha && (
                <p className="text-micro text-state-danger-text -mt-2">
                  As senhas não são iguais.
                </p>
              )}
            </>
          )}

          {/* 🗑️ 01/09 (pedido do Pedro) — O ENDEREÇO PESSOAL SAIU DAQUI.
              Duas telas antes (E3.4) a pessoa responde o endereço da EMPRESA;
              pedir outro endereço no cadastro, sem moldura, fazia parecer que
              era o mesmo dado de novo — e ficava pior pra quem escolheu o
              endereço fiscal da Legalizai ("eu já disse que uso o de vocês").
              A nota discreta de 28/08 ("esse é o seu endereço pessoal") não
              resolvia: chegava depois da dúvida. Agora o endereço pessoal é
              perguntado no C1 (`/dossie/socio`), junto do resto da
              qualificação da pessoa (RG, nascimento, nacionalidade, estado
              civil), onde a moldura da tela já diz de quem é. Efeito colateral
              bom: o E6 fica mais curto, e ele é PRÉ-pagamento. */}
        </div>

        {/* 🔴 24/08 (reunião Rua Satélite 35) — a pergunta "é a primeira
            empresa que você abre?" SAIU daqui. Realocada pra `FaixaView`
            (E5F, `gate-telas.tsx`), abaixo da faixa de faturamento — dado
            puro de log/marketing, não precisa estar junto do cadastro
            (Tiagão/Natanael Dev: "isso aí não interfere em nada no
            processo dele"). A antiga nota UX-73 (coorte obrigatória, contra
            UX-48) fica sem efeito: a pergunta nem mora mais aqui. */}

        {/* 🗑️ 01/09 (decisão do Pedro) — o bloco "ou crie com" (Google/Apple)
            SAIU deste layout também. A maquinaria de conta social (`social`,
            `conectar`) fica no componente: ela é o que faz a senha deixar de
            ser exigida, e vai ser reusada quando a integração existir. Sem
            botão, nenhum caminho leva até ela — é código dormindo, não código
            morto. */}

        {/* 🆕 28/08 (sugestão minha, pedido do Pedro) — consentimento LGPD.
            Mesma linha do E3.1 (`entrada-lead.tsx`), que existia lá porque
            aquela era, até então, a 1ª tela a coletar dado pessoal de
            verdade. Com a tela voltando a coletar tudo aqui (reposição no
            /mapa), o consentimento precisa estar ONDE o dado é digitado —
            não deixar essa linha só em E3.1 seria dado pessoal sem aviso
            visível no ponto de coleta real. */}
        {!leadJaCaptado && (
          <p className="mt-4 text-micro text-text-tertiary">
            Ao continuar, você concorda que a gente use esses dados pra te
            atender, como está na nossa{" "}
            <a
              href="/privacidade"
              className="font-semibold text-text-secondary underline underline-offset-4"
            >
              política de privacidade
            </a>
            .
          </p>
        )}

        <div className="h-6 shrink-0" />
          </div>
        </div>
      </div>

      {/* CTA no rodapé (thumb zone). No login ele mora dentro da folha porque
          lá nada rola; aqui rolaria pra fora da vista. */}
      <Rodape>
        {/* 🆕 28/08 (pedido do Pedro) — CTA renomeado e a micro-copy "criar
            conta é de graça" removida: com o form voltando a coletar tudo
            aqui (reposição de 28/08), o próximo passo real do funil é o
            plano (E7), não só "criar conta" — o texto avisa isso.
            🔄 30/08 (pedido do Pedro) — "efetuar pagamento" virou "ver
            plano": o pagamento em si só acontece na E9, depois do E7/E8. */}
        <Button full disabled={!completo} onClick={onCriarConta}>
          Criar conta e ver plano
        </Button>
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
// 🔄 30/08 (pedido do Pedro) — era o fone de gancho clássico ("ligação"), virou
// celular de verdade (retângulo + indicador de home), mais coerente com o
// resto do app (o mesmo traço já usado no ícone "mobile-first").
function IconeTelefone() {
  return (
    <svg {...ic20()}>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
    </svg>
  );
}
function IconeEmailConta() {
  return <svg {...ic20()}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>;
}
function IconeCadeadoConta() {
  return <svg {...ic20()}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
}
// 🗑️ 01/09 — `IconeLocal` (pin de endereço) saiu junto do bloco de endereço
// pessoal, que migrou pro C1.
function IconeOlhoAberto() {
  return <svg {...ic20()}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
}
function IconeOlhoFechado() {
  return <svg {...ic20()}><path d="M3 3l18 18" /><path d="M10.6 10.6a3 3 0 0 0 4.2 4.2" /><path d="M9.9 5.1A11 11 0 0 1 12 4c7 0 11 8 11 8a18.4 18.4 0 0 1-4 5.1M6.1 6.1A18.6 18.6 0 0 0 1 12s4 8 11 8a10.6 10.6 0 0 0 4.2-.9" /></svg>;
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
            {/* 🔴 28/08 (decisão do Pedro) — o certificado deixou de vir
                incluso NO PLANO MEI. No ME continua grátis (contrapartida da
                fidelidade, ADR 04/08). Mostrar "grátis" pro MEI seria vender
                algo que ele vai ter que comprar depois. */}
            <div className="mt-1.5 flex items-center gap-1.5">
              {semTaxaJunta ? (
                <span className="rounded-full bg-state-info-tint px-2.5 py-0.5 text-micro font-semibold text-state-info-text">
                  Certificado digital: você providencia
                </span>
              ) : (
                <span className="rounded-full bg-state-success-tint px-2.5 py-0.5 text-micro font-semibold text-state-success-text">
                  Certificado digital grátis
                </span>
              )}
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
/**
 * 🔄 28/08 (pedido do Pedro) — o card verde "Nosso honorário de abertura"
 * (design antigo) parou de ser card próprio: virou o 1º item desta lista,
 * com ícone e peso igual aos outros. Ficar solto no topo, sozinho, lia como
 * sobra da fusão preview→produção, não como conteúdo.
 */
const INCLUSO: { titulo: string; sub: string; icone: ReactNode; semBadge?: boolean }[] = [
  {
    titulo: "Abertura completa da empresa",
    sub: "Documentação, contrato social, protocolo e CNPJ, sem honorário. Em escritório tradicional, isso custa em torno de um salário mínimo.",
    icone: <IconeTesteGlossy src="/icones/certificado-predio-teste.png" />,
    semBadge: true,
  },
  {
    titulo: "Certificado digital",
    sub: `Incluso, sem custo extra. Fora daqui, certificadoras cobram em torno de ${brl(CUSTOS.CERTIFICADO_PRECO, true)}/ano.`,
    // 🧪 30/08 (teste do Pedro) — todos os 5 ícones trocados por PNG glossy
    // (mesma referência/ângulo do cadeado). `semBadge`: já vem com cor/sombra
    // próprias, sai do círculo verde-claro padrão (redundante nele).
    icone: <IconeTesteGlossy src="/icones/certificado-cadeado-teste.png" />,
    semBadge: true,
  },
  {
    titulo: "Imposto e declarações",
    sub: "Guia pronta todo mês e obrigação entregue no prazo.",
    icone: <IconeTesteGlossy src="/icones/certificado-papel-teste.png" />,
    semBadge: true,
  },
  {
    titulo: "Notas fiscais sem limite",
    sub: "Emite pelo app, em segundos.",
    icone: <IconeTesteGlossy src="/icones/certificado-raio-teste.png" />,
    semBadge: true,
  },
  {
    titulo: "Pró-labore de até 2 sócios",
    sub: "Calculado junto com o seu imposto.",
    icone: <IconeTesteGlossy src="/icones/certificado-pessoas-teste.png" />,
    semBadge: true,
  },
  {
    titulo: "Contador de verdade",
    sub: "Uma pessoa com nome, no WhatsApp.",
    icone: <IconeTesteGlossy src="/icones/certificado-balao-teste.png" />,
    semBadge: true,
  },
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
const INCLUSO_MEI: { titulo: string; sub: string; icone: ReactNode; semBadge?: boolean }[] = [
  // A abertura grátis vale pros dois regimes — mesmo item do array ME acima.
  {
    titulo: "Abertura completa da empresa",
    sub: "Registro direto no Portal do Empreendedor, sem honorário nenhum.",
    icone: <IconePredio />,
  },
  // 🔴 28/08 (decisão do Pedro) — o certificado SAIU da lista de incluso do
  // MEI. Ele continua sendo o que destrava a operação otimizada, mas o custo é
  // do cliente. Fica logo abaixo da lista, num bloco próprio de "não incluso":
  // esconder seria o oposto da doutrina de honestidade antes do toque.
  { titulo: "Notas fiscais sem limite", sub: "Emite pelo app, em segundos.", icone: <IconeRaioPlano /> },
  { titulo: "1 colaborador", sub: "O único que a lei permite ao MEI. FGTS e INSS patronal inclusos.", icone: <IconePessoasPlano /> },
  { titulo: "Assistente de contabilidade", sub: "Tira dúvida e resolve a rotina do MEI, a qualquer hora.", icone: <IconeChatPlano /> },
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

  // 🔧 28/08 (correção do Pedro: "essa tela não herdou o fade do topo/rodapé
  // que as outras têm") — esta tela rola num `<div>` próprio (não usa o
  // `Corpo` do DS, porque o espaçamento aqui é por `mt-*` em cada bloco, não
  // por `gap-6`), então nunca ganhou a mesma mask de scroll do `Corpo`
  // (`ui/tela.tsx`). Mesma técnica, copiada 1:1: afordância "tem mais pra
  // ver", nunca gate.
  const viewportRef = useRef<HTMLDivElement>(null);
  const conteudoRef = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState({ topo: false, base: false });
  useEffect(() => {
    const vp = viewportRef.current;
    const ct = conteudoRef.current;
    if (!vp || !ct) return;
    const recompute = () => {
      const topo = vp.scrollTop > 2;
      const base = vp.scrollTop + vp.clientHeight < vp.scrollHeight - 2;
      setFade((f) => (f.topo === topo && f.base === base ? f : { topo, base }));
    };
    recompute();
    vp.addEventListener("scroll", recompute, { passive: true });
    const ro = new ResizeObserver(recompute);
    ro.observe(ct);
    ro.observe(vp);
    return () => {
      vp.removeEventListener("scroll", recompute);
      ro.disconnect();
    };
  }, []);
  const topStop = fade.topo ? "transparent 0, #000 20px" : "#000 0";
  const baseStop = fade.base
    ? "#000 calc(100% - 28px), transparent 100%"
    : "#000 100%";
  const maskScroll = `linear-gradient(to bottom, ${topStop}, ${baseStop})`;

  return (
    <>
      <TelaHeader meta="A conta da abertura" onVoltar={onVoltar} />
      <main className="app-main">
        {/* ═══════════════════════════════════════════════════════════════════
            🆕 28/08 (pedido do Pedro: "essa tela do preço tá feia, quero algo
            mais premium") — REDESIGN validado em `/plano-premium` (preview
            isolado) e aplicado aqui, na tela oficial. Referência: print de
            app de viagem, TRADUZIDO pros nossos tokens (não copiada a
            paleta) — título bicolor/bipeso, card-herói com profundidade real
            (`shadow`, raio grande), lista de inclusos como cartões-linha, CTA
            como barra flutuante. Nenhum conteúdo/ramo (MEI×ME, colaboradores,
            citação legal, endereço fiscal) foi cortado — só a casca mudou.
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="shrink-0">
          {/* 🔄 30/08 (pedido do Pedro) — o eyebrow verde saiu daqui: desceu
              pra virar o 1º item de "O que está incluso", em vez de repetir
              a mesma mensagem 2x na tela. */}
          {/* 🆕 28/08 (pedido do Pedro) — título e subtítulo em LINHA ÚNICA.
              O título deixa de empilhar em 2 blocos (era `block`+`block`) e
              vira 1 span inline, com fonte menor pra caber; o subtítulo foi
              encurtado, não só diminuído — copy comprida encolhida fica
              ilegível antes de caber numa linha só. */}
          <h1 className="text-[1.375rem] leading-tight tracking-tight whitespace-nowrap">
            <span className="font-bold text-text-primary">Quanto custa</span>{" "}
            <span className="font-bold text-text-tertiary">manter em dia</span>
          </h1>
          <p className="text-body text-text-secondary mt-2 whitespace-nowrap">
            Sem letra miúda, sem surpresa depois.
          </p>
        </div>

        <div
          ref={viewportRef}
          style={{ maskImage: maskScroll, WebkitMaskImage: maskScroll }}
          className="mt-5 flex-1 min-h-0 overflow-y-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
        <div ref={conteudoRef}>
          {/* O PLANO COMO PRODUTO — card-herói escuro, profundidade real.
              🔴 28/08 — o badge "certificado grátis/você providencia" que
              vivia aqui SAIU: ele já aparece embaixo (na lista de inclusos
              pro ME, no bloco de "não incluso" pro MEI) — duplicar a mesma
              informação em 2 lugares da mesma tela é ruído, não reforço. */}
          {/* 🔧 28/08 (correção do Pedro) — a sombra (`shadow-2xl`) seguia
              ruim mesmo depois do wrapper separado (visível demais, sem
              ganho real); removida. Volta a ser um único elemento. */}
          <div
            // 🔄 01/09 — `overflow-hidden` VOLTOU: ele tinha saído pro selo
            // dourado sangrar pra fora da quina, e o selo foi removido. Agora
            // ele é necessário de novo, por outro motivo — é o que faz a quina
            // arredondada recortar o Léo, sustentando a leitura de que ele
            // está DENTRO do card, saindo da lateral.
            className="relative mt-4 overflow-hidden rounded-[28px] p-6"
            style={{
              backgroundColor: "var(--color-surface-dark)",
              // 🔄 01/09 (pedido do Pedro) — o brilho coral saiu do canto
              // SUPERIOR DIREITO e foi pro INFERIOR ESQUERDO. Lá em cima ele
              // disputava com o selo dourado (duas fontes de luz quente na
              // mesma quina); embaixo à esquerda ele fica atrás do preço e a
              // quina do selo volta a ser ink puro, que é o contraste que faz
              // o ouro brilhar.
              backgroundImage:
                "radial-gradient(110% 85% at 2% 105%, color-mix(in srgb, var(--color-brand) 32%, transparent), transparent 62%)",
            }}
          >
            {/* 🔴 30/08 (pedido do Pedro) — "Depois, todo mês" saiu: soltinha
                do jeito que estava, confundia mais que explicava. O pill do
                nome do plano fica sozinho agora. */}
            {/* 🔄 01/09 (pedido do Pedro) — o pill sai da DIREITA e vai pra
                ESQUERDA, alinhado com o preço e o texto abaixo. Solto no canto
                oposto ele flutuava sem relação com nada; na margem esquerda
                ele vira a etiqueta do bloco, lida na mesma coluna de leitura
                do valor. */}
            {/* 🆕 01/09 (pedido do Pedro) — o Léo saindo da lateral DIREITA do
                card, no lugar do selo dourado.

                Encaixe medido, não estimado (método travado hoje): o asset já
                vem cortado reto na borda direita — 363 das 468 linhas terminam
                exatamente no último pixel (x=239 de 240). Logo, `right-0`
                alinha o corte do corpo com a lateral do card, e é isso que faz
                ele parecer emergir da parede em vez de estar colado nela.
                `bottom-0` + o `overflow-hidden` do card deixam a quina
                arredondada recortá-lo embaixo, o que reforça a mesma leitura.
                `pointer-events-none` porque ele é cenário, não alvo. */}
            <Image
              src="/leo/leo-parede.png"
              alt=""
              aria-hidden
              width={240}
              height={468}
              // 🔄 01/09 (2 rodadas) — maior e mais baixo: 165 → 190px com a
              // base 40px pra fora do card. O corte de baixo é aceito de
              // propósito (pedido do Pedro, "nem que corte um pouco"): quem
              // não pode ser cortada é a cabeça, que é onde está o gesto.
              className="pointer-events-none absolute -bottom-10 right-0 h-[190px] w-auto"
            />

            <div className="flex items-center gap-3">
              {/* 🧪 01/09 (teste do Pedro) — o pill era `bg-white/12` (véu
                  claro sobre o card). Vira ink sólido com sombra: em vez de
                  clarear o fundo, ele fura o card — a sombra afunda a peça e
                  o texto ganha borda escura em volta, que é o que faz uma
                  etiqueta parecer aplicada e não impressa. */}
              {/* 🧪 01/09 (teste do Pedro) — pill em CORAL (era ink escuro).
                  Fill sólido `action-primary` com texto branco: sobre o card
                  escuro é o maior contraste possível, e amarra com o CTA coral
                  do rodapé. Sombra mantida pra não virar adesivo chapado. */}
              <span
                className="rounded-full bg-action-primary px-4 py-1.5 text-caption font-semibold text-text-on-brand"
                style={{ boxShadow: "0 3px 10px rgba(0,0,0,.35)" }}
              >
                {semTaxaJunta ? "Plano MEI" : "Plano único"}
              </span>
            </div>
            {/* Preço sem centavos aqui em cima (mesma decisão de 28/08 do
                preview): "R$ 139", não "R$ 139,00". O valor COM centavos
                continua no rodapé ("Você paga hoje"), que é onde precisão
                de centavo importa de verdade. */}
            {/* 🔄 01/09 (pedido do Pedro) — `mt-1` → `mt-5`: o pill estava
                colado no preço e os dois liam como uma coisa só. Com respiro,
                o pill é etiqueta e o número é o assunto. */}
            <div className="mt-5 flex items-baseline gap-2">
              {/* 🔄 01/09 (pedido do Pedro) — 3.5rem (56px) → 2.75rem (44px). O número
                  ocupava quase a largura do card e empurrava o "/mês" pra beira;
                  menor, ele continua sendo o assunto do card sem virar cartaz. */}
              <p className="text-[2.75rem] font-bold leading-none text-text-on-dark">
                {brl(mensalidade)}
              </p>
              <span className="text-h2 text-text-on-dark/60">/mês</span>
            </div>
            <p className="mt-3 text-caption text-text-on-dark/70">
              {semTaxaJunta
                ? `A 1ª mensalidade já é o seu 1º mês. Fidelidade de ${CUSTOS.FIDELIDADE_MESES} meses.`
                : "A 1ª mensalidade já é o seu 1º mês."}
            </p>
            {/* 🔴 30/08 (pedido do Pedro) — subtítulo "O valor acompanha o seu
                faturamento..." saiu: pesado demais pra essa altura da tela,
                a variação por faturamento já fica clara no resto do fluxo. */}
          </div>

          {/* 🔄 30/08 (pedido do Pedro) — o aviso do endereço fiscal era 1
              linha de texto solta dentro do card escuro: "pouco visual e
              entendível" que aquele valor já está somado na mensalidade.
              Virou seção própria, mesmo formato de card das outras (ícone +
              texto), com o valor explícito à direita — só aparece se a
              pessoa escolheu o endereço fiscal lá no E5F. */}
          {enderecoFiscal && (
            <>
              <p className="mb-2.5 mt-6 text-caption font-semibold text-text-primary">
                O que você adicionou
              </p>
              <div className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
                  <IconeTesteGlossy src="/icones/certificado-gps-teste.png" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-body font-semibold text-text-primary">Endereço fiscal Legalizai</p>
                  <p className="text-micro text-text-tertiary">Escolhido lá atrás, na tela do faturamento.</p>
                </div>
                <span className="shrink-0 text-body font-semibold text-text-primary">
                  +{brl(CUSTOS.ENDERECO_FISCAL)}/mês
                </span>
              </div>
            </>
          )}

          {/* LISTA DE INCLUSOS — cartões-linha elevados (idioma "Nearby
              Destination" da referência), fora do card escuro. */}
          <p className="mb-2.5 mt-6 text-caption font-semibold text-text-primary">
            O que está incluso
          </p>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
                <IconeTesteGlossy src="/icones/certificado-check-teste.png" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-body font-semibold text-text-primary">
                  Processo contábil 100% grátis
                </p>
              </div>
            </div>
            {(semTaxaJunta ? INCLUSO_MEI : INCLUSO).map((i) => (
              <div
                key={i.titulo}
                className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3.5"
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                    i.semBadge ? "" : "bg-state-success-tint text-state-success-text"
                  }`}
                >
                  {i.icone}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-body font-semibold text-text-primary">{i.titulo}</p>
                  <p className="text-micro text-text-tertiary">{i.sub}</p>
                </div>
              </div>
            ))}

            {/* 🔴 28/08 — O QUE NÃO ESTÁ INCLUSO, na mesma lista onde a pessoa
                lê o que está. Sem valor de propósito — não temos preço
                fechado com a certificadora. */}
            {semTaxaJunta && (
              <div className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-alt text-text-tertiary">
                  <span className="text-body font-bold" aria-hidden>
                    !
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-body font-semibold text-text-primary">
                    Certificado digital: por sua conta
                  </p>
                  <p className="text-micro text-text-tertiary">
                    Não precisa dele pra abrir. Precisa pra gente cuidar do dia
                    a dia sem te pedir senha. Se não tiver, a gente te conecta
                    com a certificadora e te passa o valor.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* A TAXA — honesta, com valor, sem holofote. Regra dura: o repasse
              de governo NUNCA se esconde dentro do preço.
              🔄 30/08 (pedido do Pedro) — ganhou título próprio de seção, pra
              separar visualmente "o que ainda custa pra abrir" do resto (que
              já é só mensalidade). Copy reforça que é taxa de QUALQUER
              contabilidade (órgão estadual, não é markup nosso), não só um
              aviso solto. Card de Colaboradores (03/08) foi REMOVIDO daqui —
              não fazia parte do custo de abertura. */}
          <p className="mb-2.5 mt-6 text-caption font-semibold text-text-primary">
            O que ainda tem de custo pra abrir o CNPJ
          </p>
          <div className="rounded-2xl bg-surface-alt px-4 py-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-caption text-text-secondary">Taxa da Junta Comercial</p>
              <p className="text-caption font-semibold text-text-primary">
                {semTaxaJunta ? "Não tem" : brl(CUSTOS.DAE_JUCEMG, true)}
              </p>
            </div>
            {/* ✍️ 01/09 (correção do Pedro) — saiu "A guia é da Junta, a gente
                só emite o boleto". A cobrança vai ser feita por boleto NOSSO,
                não pela guia do órgão, então descrever o mecanismo assim seria
                afirmar algo que não vai acontecer. O que continua verdadeiro e
                é o que importa pra pessoa: o valor é do órgão e não fica com a
                gente. A frase agora fala de DESTINO do dinheiro (repasse
                integral), não de quem emite o documento. */}
            <p className="mt-1 text-micro text-text-tertiary">
              {semTaxaJunta ? (
                "MEI não passa pela Junta Comercial. O registro é direto no Portal do Empreendedor, sem essa taxa."
              ) : (
                <>
                  Qualquer contabilidade também repassaria essa taxa: é o custo de
                  registro na Junta Comercial de Minas Gerais, o órgão estadual da
                  abertura.{" "}
                  {/* Negrito só nesta frase (pedido do Pedro): é a que responde
                      "vocês estão embutindo margem aqui?" — a objeção real do
                      card. O resto é contexto. */}
                  <strong className="font-bold text-text-secondary">
                    Nada aqui fica com a gente, é repasse integral.
                  </strong>{" "}
                  Depois disso, o único custo é a sua mensalidade.
                </>
              )}
            </p>
          </div>

          {/* 🔴 28/08 (pedido do Pedro: "achei desnecessário") — a citação
              legal (CC art. 1.179) foi REMOVIDA. Segue existindo na versão
              clássica (`PlanoView`), que não é a usada em produção. */}
        </div>
        </div>

        {/* 🔄 30/08 (pedido do Pedro) — o CTA flutuante escuro (pill) destoava
            do padrão das outras telas. Voltou pro Rodape padrão: total à
            esquerda, botão full-width embaixo. */}
        <Rodape>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <span className="text-caption text-text-secondary">Você paga hoje</span>
            <span className="text-h2 text-text-primary">{brl(hoje, true)}</span>
          </div>
          <Button full onClick={onSeguir}>
            Ótimo, continuar
          </Button>
        </Rodape>
      </main>
    </>
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

/**
 * 🆕 28/08 (pedido do Pedro: "quero os ícones que validamos") — o mesmo
 * conjunto de ícones por item validado no preview `/plano-premium`,
 * restaurado aqui. Na 1ª fusão pra produção eu tinha simplificado pra um
 * checkmark genérico repetido — o Pedro pediu de volta a distinção por item.
 */
function ic18Plano() {
  return {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}
/** 🧪 30/08 (teste do Pedro) — PNG glossy 3D, mesmo tratamento do cadeado. */
function IconeTesteGlossy({ src }: { src: string }) {
  return <Image src={src} alt="" width={26} height={26} aria-hidden />;
}
function IconePredio() {
  return (
    <svg {...ic18Plano()}>
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9v.01M9 12v.01M9 15v.01" />
    </svg>
  );
}
function IconeCheckPlano() {
  return (
    <svg {...ic18Plano()}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}
function IconeCadeado() {
  return (
    <svg {...ic18Plano()}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function IconeDocPlano() {
  return (
    <svg {...ic18Plano()}>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <path d="M10 13h5M10 17h3" />
    </svg>
  );
}
function IconeRaioPlano() {
  return (
    <svg {...ic18Plano()}>
      <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
    </svg>
  );
}
function IconePessoasPlano() {
  return (
    <svg {...ic18Plano()}>
      <circle cx="8" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M2 20c0-3.5 2.7-6 6-6s6 2.5 6 6" />
      <path d="M14.5 14.2c2.5.3 4.5 2.4 4.5 5.8" />
    </svg>
  );
}
function IconeChatPlano() {
  return (
    <svg {...ic18Plano()}>
      <path d="M4 4h16v12H8l-4 4z" />
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
/**
 * 🆕 01/09 — ícones 3D das formas de pagamento, na paleta da marca. Dois
 * arquivos por método, e isso não é capricho: o card inverte o fundo quando
 * está selecionado (branco → coral), então a versão coral serve o estado
 * normal e a creme serve o selecionado. Um arquivo só sumiria no fundo em um
 * dos dois estados.
 */
const ICONE_METODO: Record<Metodo, { coral: string; creme: string }> = {
  cartao: {
    coral: "/icones/metodo-cartao-coral.png",
    creme: "/icones/metodo-cartao-creme.png",
  },
  pix: {
    coral: "/icones/metodo-pix-coral.png",
    creme: "/icones/metodo-pix-creme.png",
  },
  // Fora da seleção hoje (ver `METODOS_VISIVEIS_IDS`); mantém o par do cartão
  // pra nunca renderizar vazio se o boleto voltar pra tela.
  boleto: {
    coral: "/icones/metodo-cartao-coral.png",
    creme: "/icones/metodo-cartao-creme.png",
  },
};

/**
 * 🔴 01/09 (decisão do Pedro) — só CARTÃO e PIX aparecem na escolha. No Asaas,
 * o boleto emitido já vem com QR de Pix embutido (boleto híbrido), então
 * oferecer os dois separados era pedir pra pessoa escolher entre a mesma
 * coisa. O `boleto` continua existindo em `METODOS` e no tipo `Metodo`: o
 * mapa, a demo e as telas de espera (E9.SB, E9.1) seguem alcançáveis por
 * rota. ⚠️ Consequência aberta: sem o card, o caminho "pagamento pendente"
 * perde a porta de entrada no produto real.
 */
const METODOS_VISIVEIS_IDS: Metodo[] = ["cartao", "pix"];

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
    // ✍️ 01/09 (correção do Pedro, 2 rodadas) — a copy PROMETIA prazo
    // ("começa hoje"), e depois ainda prometia confirmação ("confirma na
    // hora"). Nenhuma das duas está na nossa mão: nem o processo depois do
    // pagamento (dossiê, protocolo, fila dos órgãos), nem a autorização do
    // cartão, que é do adquirente e pode cair em análise. Sobra o que é
    // verdade e ainda vende: é o caminho que COSTUMA ser mais rápido, por não
    // ter compensação pra esperar. Comparativo, não garantia.
    aviso: "O caminho mais rápido",
    efeito:
      "É a forma de pagamento que costuma liberar o processo antes, sem espera de compensação.",
    avisoMigrar: "O caminho mais rápido",
    efeitoMigrar:
      "É a forma de pagamento que costuma liberar o processo antes, sem espera de compensação.",
  },
  {
    id: "pix",
    // 🔄 01/09 (pedido do Pedro) — "Pix e Boleto" no mesmo card: no Asaas o
    // boleto emitido já vem com QR de Pix embutido (boleto híbrido), então
    // são a mesma escolha pra quem paga. O nome diz isso em vez de esconder o
    // boleto e deixar quem procura por ele achar que não tem.
    nome: "Pix e Boleto",
    quando: "em minutos",
    // Mesma correção do cartão: fala do PAGAMENTO (que a gente controla), não
    // do prazo da abertura (que depende dos órgãos).
    aviso: "Pelo Pix, o caminho fica livre em minutos",
    efeito:
      "O Pix cai rápido, então a abertura não fica parada esperando o pagamento. Se preferir boleto, ele compensa em 1 a 3 dias úteis.",
    avisoMigrar: "Pelo Pix, o caminho fica livre em minutos",
    efeitoMigrar:
      "O Pix cai rápido, então a migração não fica parada esperando o pagamento. Se preferir boleto, ele compensa em 1 a 3 dias úteis.",
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

export const METODOS_VISIVEIS = METODOS.filter((m) => METODOS_VISIVEIS_IDS.includes(m.id));

/**
 * 🆕 01/09 (pedido do Pedro) — o aceite irreversível, que estava na A1, veio
 * pra tela de pagamento da guia.
 *
 * Por que aqui é o lugar certo: é NESTE clique que a taxa da Junta deixa de
 * ser reembolsável, porque é aqui que ela é efetivamente paga. Na A1 a frase
 * "a taxa já paga não é reembolsável" era descolada do gesto — a pessoa
 * autorizava numa tela e pagava na outra.
 *
 * Mesma estrutura do aceite do A1 (input irmão do texto, nunca dentro do
 * label): nesting de botão em label some da árvore de acessibilidade e quebra
 * o toggle — problema real, achado em 01/09.
 */
function AceiteIrreversivelGuia({
  aceito,
  setAceito,
}: {
  aceito: boolean;
  setAceito: (v: boolean) => void;
}) {
  const [popupAberto, setPopupAberto] = useState(false);
  return (
    <div className="flex items-start gap-3 rounded-md border border-border-hairline bg-surface-card p-3">
      <input
        id="aceite-guia"
        type="checkbox"
        checked={aceito}
        onChange={(e) => setAceito(e.target.checked)}
        className="sr-only"
      />
      <label
        htmlFor="aceite-guia"
        aria-hidden
        className={`mt-0.5 flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border-2 transition-colors ${
          aceito
            ? "border-action-primary bg-action-primary"
            : "border-border-strong bg-surface-card"
        }`}
      >
        {aceito && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 12.5 9.5 18 20 6"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </label>
      <p className="text-caption text-text-secondary">
        <label htmlFor="aceite-guia" className="cursor-pointer">
          Autorizo o início da abertura. Depois que a guia é paga, a Junta
          começa o registro, e essa taxa{" "}
        </label>
        {/* O link fica FORA do label de propósito: dentro dele, o Chrome poda
            o botão da árvore de acessibilidade e o toggle para de responder
            (achado de 01/09, ao construir a versão anterior no A1). */}
        <button
          type="button"
          onClick={() => setPopupAberto(true)}
          className="font-semibold text-action-primary-sm underline underline-offset-4"
        >
          não é reembolsável
        </button>
        .
      </p>
      {popupAberto && <SheetNaoReembolsavel onFechar={() => setPopupAberto(false)} />}
    </div>
  );
}

export function PagamentoView({
  cpf,
  setCpf,
  metodo,
  setMetodo,
  cpfCadastrado,
  fluxo = "abertura",
  semTaxaJunta = false,
  guia = false,
  recusado = false,
  enderecoFiscal = false,
  onPagar,
  onVoltar,
  aceito,
  setAceito,
  onLerContrato,
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
  /**
   * 🆕 01/09 (pedido do Pedro) — modo GUIA DA JUNTA (DAE). Mesma tela de
   * pagamento, outro objeto: aqui não se paga mensalidade, se paga a taxa
   * do Estado, DEPOIS que a viabilidade foi deferida (a pessoa chega pelo
   * CTA da tela de status). Muda o valor, a copy e o aceite; o resto — CPF,
   * métodos, efeito da escolha, idempotência — é idêntico de propósito:
   * pagar duas coisas em telas diferentes já é confuso o bastante sem duas
   * gramáticas visuais.
   */
  guia?: boolean;
  /**
   * 🆕 01/09 (pedido do Pedro) — a pessoa volta do splash de recusa. A tela é
   * a MESMA, com um aviso no topo dizendo o que houve e pedindo outra forma
   * de pagar. Não zera nada do que ela preencheu: quem teve o cartão recusado
   * já está frustrado, refazer o formulário inteiro seria punir duas vezes.
   */
  recusado?: boolean;
  /**
   * 🆕 01/09 — a pessoa escolheu ENDEREÇO FISCAL da Legalizai no E3.4. Só serve
   * pro pré-preenchimento do endereço de cobrança: nesse caso o endereço da
   * empresa é o NOSSO, e usá-lo na fatura do cartão é pedir recusa por
   * divergência com o emissor. Vem da mesma query que o resto do flow lê
   * (`?endereco=fiscal`, `lib/regime.ts`).
   */
  enderecoFiscal?: boolean;
  /** 🆕 03/08 — MEI não paga taxa da Junta. Só se aplica a `fluxo="abertura"`
   *  (migrar já não soma DAE por natureza, empresa já existe). */
  semTaxaJunta?: boolean;
  onPagar?: () => void;
  onVoltar?: () => void;
  /**
   * 🔄 30/08 (pedido do Pedro) — igual à Contabilizei: o aceite do contrato
   * acontece no ATO DO PAGAMENTO, não numa tela própria antes dele. O antigo
   * E8 (`ContratoView`) foi ELIMINADO do fluxo; o checkbox "Li e aceito" +
   * "Ler o contrato completo" desceram pra cá. Só aparecem em `fluxo="abertura"`
   * — o `migrar` continua com seu próprio `MigrarContratoView`, intocado.
   */
  aceito?: boolean;
  setAceito?: (v: boolean) => void;
  onLerContrato?: () => void;
}) {
  const migrar = fluxo === "migrar";
  // 🆕 04/08 — Plano MEI tem mensalidade própria (R$49,90) em qualquer fluxo
  // (abrir OU migrar) — antes esta tela sempre usava `CUSTOS.MENSALIDADE`
  // genérico mesmo quando `semTaxaJunta` (MEI) era true.
  const mensalidade = semTaxaJunta ? CUSTOS.MENSALIDADE_MEI : CUSTOS.MENSALIDADE;
  // 🔄 26/08 (pedido do Pedro) — a DAE não soma mais aqui. Ela só vira
  // cobrança de verdade depois que a viabilidade voltar deferida (A3),
  // então cobrar agora seria cobrar por algo que ainda não foi emitido.
  // 🆕 01/09 — no modo guia o valor é a taxa da Junta, não a mensalidade.
  const total = guia ? CUSTOS.DAE_JUCEMG : mensalidade;
  const escolhido = METODOS.find((m) => m.id === metodo)!;

  /**
   * 🆕 01/09 (pedido do Pedro) — OS DADOS QUE O ASAAS EXIGE PRA COBRAR.
   *
   * Até aqui a tela escolhia o método e mandava pagar, sem nunca pedir cartão:
   * era maquete de decisão, não de pagamento. Agora carrega o formulário real,
   * campo a campo, na forma que o Asaas espera (ver `dadosAsaasVazios` pro
   * mapeamento com a doc).
   *
   * Estado LOCAL de propósito: dado de cartão não sobe pro estado do wizard,
   * não vai pra sessionStorage e não viaja em querystring — no app real ele vai
   * direto pro Asaas (idealmente tokenizado) e nunca encosta no nosso banco.
   */
  const [dados, setDados] = useState<DadosAsaas>(() => dadosAsaasVazios(cpfCadastrado ?? cpf));
  const set = <K extends keyof DadosAsaas>(k: K, v: DadosAsaas[K]) =>
    setDados((p) => ({ ...p, [k]: v }));

  /**
   * PRÉ-PREENCHIMENTO (pedido do Pedro: "não fazer a pessoa repetir o que já
   * coletamos"). Roda no cliente, uma vez: `sessionStorage` não existe no SSR.
   *
   * ⚠️ O endereço vem do E3.4, que é o endereço da EMPRESA. Quando a pessoa
   * escolheu endereço fiscal, esse endereço é o NOSSO, não o dela — prefilar
   * a fatura do cartão com ele levaria a recusa por divergência com o emissor
   * (ver a regra de `creditCardHolderInfo` na doc do Asaas). Nesse caso os
   * campos de endereço nascem vazios, de propósito.
   */
  useEffect(() => {
    const r = enderecoFiscal ? null : lerRascunhoEndereco();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- store client-only (sessionStorage), lido após a montagem
    setDados((p) => ({
      ...p,
      titularNome: p.titularNome || CLIENTE_PAGAMENTO.nome,
      titularCpf: p.titularCpf || cpfCadastrado || cpf || CLIENTE_PAGAMENTO.cpf,
      titularEmail: p.titularEmail || CLIENTE_PAGAMENTO.email,
      titularTelefone: p.titularTelefone || CLIENTE_PAGAMENTO.telefone,
      cep: p.cep || r?.cep || "",
      numero: p.numero || r?.numero || "",
      complemento: p.complemento || r?.complemento || "",
    }));
    // Só no monte: depois disso quem manda é o que a pessoa digitou.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dadosOk = dadosAsaasCompletos(dados, metodo);

  return (
    <>
      <TelaHeader
        meta={guia ? "Taxa da Junta" : migrar ? "Pagamento" : "Pagamento e contrato"}
        onVoltar={onVoltar}
      />
      <main className="app-main">
        <Titulo
          sub={
            guia
              ? `${brl(total, true)}, uma vez só. É a taxa que a Junta cobra pra registrar, e ela vai inteira pro Estado.`
              : // ✍️ 01/09 (pedido do Pedro) — "e depois R$ 139 por mês" repetia
                // o número que a pessoa acabou de ver 2 linhas acima, no card do
                // plano. Vira referência ao valor, não repetição dele.
                `${brl(total, true)} hoje, depois esse valor mensal.`
          }
        >
          {guia ? "Pague a guia da Junta" : "Falta só isso"}
        </Titulo>

        <Corpo>
          {/* 🆕 01/09 — volta da recusa: explica ANTES de qualquer campo, com
              o caminho concreto (outro cartão ou Pix), sem culpar a pessoa. */}
          {recusado && (
            <Aviso variante="warning" titulo="O pagamento não passou">
              O banco recusou a cobrança, e isso raramente é problema seu. Dá
              pra tentar outro cartão, ou trocar pra Pix, que cai na hora.
            </Aviso>
          )}

          {/* 🗑️ 01/09 (decisão do Pedro) — o CARD "Seu CPF" SAIU do E9.
              Ele nasceu em 29/07 pra provar que a gente tinha guardado o dado
              do cadastro, mas hoje o CPF é pedido logo abaixo, dentro do bloco
              do Asaas (titular do cartão / quem paga), já pré-preenchido.
              Mostrar o mesmo número duas vezes na mesma tela é o "CPF pedido
              2×" que a auditoria de 28/07 tinha eliminado, voltando pela porta
              dos fundos.
              ⚠️ A checagem na Receita continua existindo como promessa: ela
              está registrada em `PREENCHIDOS_API` e aparece no bloco de
              pagamento. As props `cpf`/`setCpf`/`cpfCadastrado` seguem no
              componente porque o estado do wizard e a demo ainda os usam. */}

          <div>
            <p className="text-caption font-semibold text-text-primary mb-2">
              Como você prefere pagar
            </p>
            {/* 🔄 01/09 (pedido do Pedro) — a lista de botões empilhados virou
                o MESMO card de ícone do E3.2 (`CardIconeSelecao`): é a mesma
                pergunta ("escolha um dos dois") e não fazia sentido ter duas
                gramáticas visuais pro mesmo gesto no mesmo flow.
                Ícones 3D próprios, com par coral/creme pra sobreviver à
                inversão de fundo do card selecionado. */}
            <div className="grid grid-cols-2 gap-3">
              {METODOS_VISIVEIS.map((m) => (
                <CardIconeSelecao
                  key={m.id}
                  label={m.nome}
                  iconeCoral={ICONE_METODO[m.id].coral}
                  iconeCreme={ICONE_METODO[m.id].creme}
                  selecionado={metodo === m.id}
                  onClick={() => setMetodo(m.id)}
                  tamanho={58}
                />
              ))}
            </div>
          </div>

          {/* O EFEITO DA ESCOLHA, EM TEMPO REAL: o cliente escolhe QUANDO a
              empresa dele começa a existir, não "meio de pagamento".
              🔄 01/09 (pedido do Pedro) — era `Aviso` (bloco tingido inteiro,
              verde). Virou `CardNota`, o cartão neutro com ícone-círculo já
              usado no E3.4: aqui não há alerta nenhum, é informação sobre a
              escolha que a pessoa acabou de fazer — bloco colorido dava peso
              de aviso a um texto que só explica. Variante positiva (check
              verde) porque as duas formas de pagamento levam a um bom
              caminho; nenhuma delas é problema. */}
          <CardNota variante="positivo" titulo={migrar ? escolhido.avisoMigrar : escolhido.aviso}>
            {migrar ? escolhido.efeitoMigrar : escolhido.efeito}
          </CardNota>

          {/* 🆕 01/09 — o formulário de verdade, na forma que o Asaas exige. */}
          <DadosAsaasForm
            metodo={metodo}
            dados={dados}
            set={set}
            enderecoFiscal={enderecoFiscal}
          />

          {/* 🗑️ 01/09 (decisão do Pedro) — a linha de IDEMPOTÊNCIA VISÍVEL
              (UX-38, "você paga uma vez só, mesmo que o app feche") SAIU. Ela
              levantava um problema que a pessoa não estava cogitando: falar em
              app fechando no meio do pagamento planta a dúvida em vez de
              acalmar. A garantia técnica continua valendo no backend; o
              equivalente na tela de espera (`wizard-cauda`, "se o boleto já
              foi pago, não cobramos de novo") permanece, porque lá a dúvida é
              real — a pessoa já pagou e voltou. */}

          {/* 🔄 30/08 (pedido do Pedro) — aceite do contrato, realocado do
              extinto E8 (`ContratoView`). Só no fluxo de abertura.
              🔄 01/09 — no modo GUIA o aceite é outro: não é o contrato de
              serviço (esse já foi aceito no E9), é a autorização do ato
              irreversível, que veio da A1. Faz mais sentido aqui: é neste
              clique que a taxa vira gasto e o registro começa. */}
          {guia ? (
            <AceiteIrreversivelGuia
              aceito={aceito ?? false}
              setAceito={setAceito ?? (() => {})}
            />
          ) : (
            !migrar && (
              <>
                <button
                  type="button"
                  onClick={onLerContrato}
                  className="flex min-h-12 w-full items-center justify-center rounded-md border
                             border-border-strong bg-surface-card px-4 text-body font-semibold
                             text-text-primary transition-colors hover:bg-surface-alt"
                >
                  Ler o contrato completo
                </button>
                <Checkbox checked={aceito ?? false} onChange={setAceito ?? (() => {})}>
                  {/* ✍️ 01/09 (pedido do Pedro) — negrito só no ATO ("li e
                      aceito o contrato"); o resto fica normal. É o gesto
                      jurídico que precisa saltar, não o nome da empresa. */}
                  <strong className="font-bold">Li e aceito o contrato</strong> de
                  serviço da Legalizai.
                </Checkbox>
              </>
            )
          )}
        </Corpo>

        <Rodape>
          {/* 🆕 01/09 — o CTA agora também espera os dados do Asaas. Sem eles a
              cobrança volta erro 400 do gateway, e erro de gateway depois do
              clique é a pior hora possível pra descobrir campo faltando. */}
          <Button full disabled={(!migrar && !aceito) || !dadosOk} onClick={onPagar}>
            {guia ? `Pagar a guia · ${brl(total, true)}` : `Pagar ${brl(total, true)}`}
          </Button>
        </Rodape>
      </main>
    </>
  );
}

/* ═══════════ E9/A3.P · OS DADOS QUE O ASAAS EXIGE PRA COBRAR ═══════════════
 *
 * 🆕 01/09 (pedido do Pedro) — "puxe da documentação do Asaas o que a pessoa
 * precisa preencher pra pagar". Fonte: docs.asaas.com, consultada em 01/09/2026:
 *
 *   · POST /v3/payments (cartão)  — `customer`, `billingType`, `value`,
 *     `dueDate` e **`remoteIp`** obrigatórios. `remoteIp` é o IP do DISPOSITIVO
 *     do pagador, não do nosso servidor (a doc é explícita) — logo é campo de
 *     backend, invisível na tela.
 *   · `creditCard` — `holderName`, `number`, `expiryMonth`, `expiryYear`,
 *     `ccv`. Todos obrigatórios.
 *   · `creditCardHolderInfo` — `name`, `email`, `cpfCnpj`, `postalCode`,
 *     `addressNumber` e `phone` OBRIGATÓRIOS; `addressComplement` e
 *     `mobilePhone` opcionais.
 *   · POST /v3/customers — só `name` e `cpfCnpj` são obrigatórios; `email`,
 *     `mobilePhone`, `postalCode`, `addressNumber`, `complement`, `province`
 *     são opcionais, e informar `postalCode` já preenche o resto do endereço
 *     (CEP inválido devolve 400).
 *
 * 🔴 CARTÃO DE DÉBITO NÃO EXISTE nesta tela, e não é esquecimento: o Asaas não
 * aceita dado de débito pela API. O enum de criação de cobrança é BOLETO,
 * CREDIT_CARD, PIX e UNDEFINED (DEBIT_CARD só aparece em resposta, histórico),
 * e a orientação da doc pra débito é mandar a pessoa pro `invoiceUrl` (checkout
 * hospedado do Asaas). Oferecer débito aqui significaria sair do nosso app no
 * meio do pagamento — decisão de produto, não de código, então fica registrada
 * e não implementada.
 *
 * ─── POR QUE O FORMULÁRIO NASCE PREENCHIDO E MESMO ASSIM EDITÁVEL ──────────
 * Nome, CPF, e-mail e telefone já foram coletados (E3.3 e E6) e o endereço no
 * E3.4: repetir os quatro na hora de pagar é atrito puro. Mas nada disso é
 * travado, porque a fatura do cartão pode ser de OUTRA pessoa e de outro
 * endereço — e a doc do Asaas avisa que divergência com o cadastro do emissor
 * derruba a transação por suspeita de fraude. Prefill acelera; trava reprova.
 * ═════════════════════════════════════════════════════════════════════════ */

/**
 * Mock do que já foi coletado antes desta tela (E3.3 nome/e-mail/telefone, E6
 * CPF). No app real vem da conta criada no E6, não daqui.
 */
const CLIENTE_PAGAMENTO = {
  nome: CLIENTE.nome,
  cpf: CLIENTE.cpf,
  email: "ana.ramos@email.com",
  telefone: CLIENTE.telefone,
};

export interface DadosAsaas {
  /* creditCard */
  numeroCartao: string;
  nomeImpresso: string;
  validade: string;
  cvv: string;
  /* creditCardHolderInfo / customer */
  titularNome: string;
  titularCpf: string;
  titularEmail: string;
  titularTelefone: string;
  cep: string;
  numero: string;
  complemento: string;
}

export function dadosAsaasVazios(cpf = ""): DadosAsaas {
  return {
    numeroCartao: "",
    nomeImpresso: "",
    validade: "",
    cvv: "",
    titularNome: "",
    titularCpf: cpf,
    titularEmail: "",
    titularTelefone: "",
    cep: "",
    numero: "",
    complemento: "",
  };
}

/**
 * O que o gateway precisa ter em mãos pra cobrança não voltar 400.
 *
 * Pix e boleto pedem MENOS que cartão de propósito: pro Asaas, os dois só
 * precisam de um `customer` (nome + CPF), e o resto é conveniência nossa
 * (e-mail pra mandar o link, telefone pra avisar). Exigir endereço pra pagar
 * um Pix seria burocracia inventada por nós.
 */
export function dadosAsaasCompletos(d: DadosAsaas, metodo: Metodo): boolean {
  const base =
    d.titularNome.trim().length > 2 &&
    d.titularCpf.replace(/\D/g, "").length === 11 &&
    /.+@.+\..+/.test(d.titularEmail.trim());
  if (metodo !== "cartao") return base;
  return (
    base &&
    d.numeroCartao.replace(/\D/g, "").length >= 13 &&
    d.nomeImpresso.trim().length > 2 &&
    /^\d{2}\/\d{2}$/.test(d.validade) &&
    d.cvv.replace(/\D/g, "").length >= 3 &&
    // Obrigatórios do `creditCardHolderInfo`, os 3 que faltavam:
    d.titularTelefone.replace(/\D/g, "").length >= 10 &&
    d.cep.replace(/\D/g, "").length === 8 &&
    d.numero.trim() !== ""
  );
}

/**
 * 🆕 01/09 (pedido do Pedro) — o mesmo círculo de check do `CardNota` no canto
 * do bloco resolvido. A borda verde sozinha é sutil demais pra quem está de
 * olho no campo que digita; o selo dá o "pronto" explícito. `absolute` pra não
 * deslocar título nem campos — por isso o `Card` do bloco vira `relative`.
 *
 * ⚠️ Fora do componente de propósito: definido dentro do render, viraria um
 * componente NOVO a cada tecla digitada (React remonta a árvore inteira).
 */
function SeloOk() {
  return (
    <span
      aria-hidden
      className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-state-success-tint text-state-success-text"
    >
      <CheckMiniRegime />
    </span>
  );
}

function DadosAsaasForm({
  metodo,
  dados,
  set,
  enderecoFiscal,
}: {
  metodo: Metodo;
  dados: DadosAsaas;
  set: <K extends keyof DadosAsaas>(k: K, v: DadosAsaas[K]) => void;
  enderecoFiscal: boolean;
}) {
  const cartao = metodo === "cartao";
  // Mock do autofill por CEP (mesma função do E3.4). No app real vira consulta
  // à API de CEP — já registrada em `PREENCHIDOS_API` como pendência.
  const enderecoFatura = buscarCep(dados.cep.replace(/\D/g, ""));

  /**
   * 🧪 01/09 (teste do Pedro) — BLOCO COMPLETO fica com a borda VERDE.
   *
   * Mesma espessura de sempre (1px, `border`), só a cor muda: hairline cinza →
   * `state-success`, o mesmo verde do traço do check do CardNota. A ideia é dar
   * progresso sem inventar componente: a pessoa vê o formulário "fechando"
   * bloco a bloco em vez de descobrir o que falta só quando o CTA não habilita.
   *
   * As regras por bloco são as MESMAS de `dadosAsaasCompletos` — se um bloco
   * ficasse verde com campo que o Asaas exige em branco, a borda viraria
   * mentira e o CTA seguiria travado sem explicação.
   */
  const digitos = (v: string) => v.replace(/\D/g, "").length;
  const blocoCartaoOk =
    digitos(dados.numeroCartao) >= 13 &&
    dados.nomeImpresso.trim().length > 2 &&
    /^\d{2}\/\d{2}$/.test(dados.validade) &&
    digitos(dados.cvv) >= 3;
  const blocoTitularOk =
    dados.titularNome.trim().length > 2 &&
    digitos(dados.titularCpf) === 11 &&
    /.+@.+\..+/.test(dados.titularEmail.trim()) &&
    // Telefone só é obrigatório no cartão (`creditCardHolderInfo.phone`).
    (!cartao || digitos(dados.titularTelefone) >= 10);
  const blocoEnderecoOk = digitos(dados.cep) === 8 && dados.numero.trim() !== "";
  /**
   * Borda verde quando fecha; a espessura não muda, só a cor.
   * 🔄 01/09 — testamos o verde do FUNDO do check (`state-success-tint`) e
   * ficou apagado demais numa borda de 1px: tint foi feito pra área grande,
   * não pra fio. Fica o verde do TRAÇO (`state-success`).
   */
  const borda = (ok: boolean) => (ok ? "border-state-success" : "");


  return (
    <div className="flex flex-col gap-4">
      {cartao && (
        <Card className={`relative ${borda(blocoCartaoOk)}`}>
        {blocoCartaoOk && <SeloOk />}
          <p className="text-body font-semibold text-text-primary mb-3">Dados do cartão</p>
          <div className="flex flex-col gap-3">
            <Campo rotulo="Número do cartão">
              <Texto
                valor={dados.numeroCartao}
                onChange={(v) => set("numeroCartao", mascaraCartao(v))}
                inputMode="numeric"
                maxLength={19}
                placeholder="0000 0000 0000 0000"
              />
            </Campo>
            <Campo
              rotulo="Nome impresso no cartão"
              dica="Igualzinho ao que está no plástico, sem acento se lá não tiver."
            >
              <Texto
                valor={dados.nomeImpresso}
                onChange={(v) => set("nomeImpresso", v.toUpperCase())}
                placeholder="ANA B RAMOS"
              />
            </Campo>
            <div className="grid grid-cols-2 gap-3">
              <Campo rotulo="Validade">
                <Texto
                  valor={dados.validade}
                  onChange={(v) => set("validade", mascaraValidade(v))}
                  inputMode="numeric"
                  maxLength={5}
                  placeholder="MM/AA"
                />
              </Campo>
              <Campo rotulo="CVV">
                <Texto
                  valor={dados.cvv}
                  onChange={(v) => set("cvv", v.replace(/\D/g, "").slice(0, 4))}
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="123"
                />
              </Campo>
            </div>
          </div>
        </Card>
      )}

      <Card className={`relative ${borda(blocoTitularOk)}`}>
        {blocoTitularOk && <SeloOk />}
        <p className="text-body font-semibold text-text-primary">
          {cartao ? "Titular do cartão" : "Quem vai pagar"}
        </p>
        {/* Diz de onde veio o que já está escrito, e que dá pra trocar. Sem
            isso, campo preenchido sozinho parece dado travado. */}
        <p className="text-micro text-text-tertiary mt-1 mb-3">
          {cartao
            ? "Já preenchemos com o que você informou. Se o cartão for de outra pessoa, é só trocar aqui: o banco compara esses dados com o cadastro dele."
            : "Já preenchemos com o que você informou. Dá pra corrigir qualquer campo."}
        </p>
        <div className="flex flex-col gap-3">
          <Campo rotulo={cartao ? "Nome do titular do cartão" : "Nome completo"}>
            <Texto
              valor={dados.titularNome}
              onChange={(v) => set("titularNome", v)}
              placeholder="Nome de quem paga"
            />
          </Campo>
          {/* ⚠️ NÃO é duplicata do CPF do topo, e a copy tem que deixar isso
              claro. Aquele é o CPF de QUEM ABRE a empresa (vale a checagem na
              Receita); este é o de QUEM PAGA, e pode ser outra pessoa — a doc
              do Asaas trata `creditCardHolderInfo.cpfCnpj` como o dado do
              titular do cartão, comparado com o cadastro do emissor. */}
          <Campo
            rotulo={cartao ? "CPF do titular do cartão" : "CPF de quem paga"}
            dica="Pode ser diferente do seu, se quem paga for outra pessoa."
          >
            <Texto
              valor={dados.titularCpf}
              onChange={(v) => set("titularCpf", v)}
              inputMode="numeric"
              maxLength={14}
              placeholder="000.000.000-00"
            />
          </Campo>
          <Campo
            rotulo="E-mail"
            dica={cartao ? undefined : "É pra onde vai o link do pagamento e o comprovante."}
          >
            <Texto
              valor={dados.titularEmail}
              onChange={(v) => set("titularEmail", v)}
              placeholder="voce@email.com"
            />
          </Campo>
          <Campo rotulo={cartao ? "Telefone" : "Telefone (opcional)"}>
            <Texto
              valor={dados.titularTelefone}
              onChange={(v) => set("titularTelefone", v)}
              inputMode="numeric"
              maxLength={16}
              placeholder="(31) 90000-0000"
            />
          </Campo>
        </div>
      </Card>

      {/* Endereço só no cartão: é exigência do `creditCardHolderInfo`. Pix e
          boleto do Asaas se viram com nome + CPF, então pedir CEP ali seria
          formulário que a gente inventou. */}
      {cartao && (
        <Card className={`relative ${borda(blocoEnderecoOk)}`}>
        {blocoEnderecoOk && <SeloOk />}
          <p className="text-body font-semibold text-text-primary">Endereço da fatura</p>
          <p className="text-micro text-text-tertiary mt-1 mb-3">
            {enderecoFiscal
              ? "Como você escolheu o endereço fiscal da Legalizai, este a gente não tem: preencha o endereço da fatura do seu cartão."
              : "Veio do endereço que você já informou. Se a fatura do cartão vai pra outro lugar, troque aqui."}
          </p>

          <div className="flex flex-col gap-3">
            <Campo rotulo="CEP">
              {/* 🐛 01/09 (achado do Pedro) — o campo aceitava o CEP CRU
                  ("30220310"): faltava a máscara que todo outro CEP do app
                  aplica. */}
              <Texto
                valor={dados.cep}
                onChange={(v) => set("cep", mascaraCep(v))}
                inputMode="numeric"
                maxLength={9}
                placeholder="00000-000"
              />
            </Campo>

            {/* 🆕 01/09 (achado do Pedro: "não teria que puxar automático?") —
                o endereço resolvido pelo CEP, read-only, igual ao E3.4. O
                Asaas só precisa de `postalCode` + `addressNumber` (ele deriva
                o resto), então isto não é dado a mais pra enviar: é
                CONFIRMAÇÃO visual de que o CEP está certo. Sem isso a pessoa
                digita 8 números e segue no escuro — e CEP errado só apareceria
                como recusa do emissor, depois do clique em pagar. */}
            {enderecoFatura && (
              <div className="rounded-md border border-border-hairline bg-surface-card p-3">
                <p className="text-caption text-text-secondary">
                  {enderecoFatura.logradouro}, {enderecoFatura.bairro}
                </p>
                <p className="text-caption font-semibold text-text-primary">
                  {enderecoFatura.municipio} · {enderecoFatura.uf}
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Campo rotulo="Número">
                <Texto
                  valor={dados.numero}
                  onChange={(v) => set("numero", v)}
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="1200"
                />
              </Campo>
              <Campo rotulo="Complemento">
                <Texto
                  valor={dados.complemento}
                  onChange={(v) => set("complemento", v)}
                  maxLength={40}
                  placeholder="Apto 302"
                />
              </Campo>
            </div>
          </div>
        </Card>
      )}

      {/* O que o Asaas exige e a pessoa NÃO digita: fica dito, não escondido. */}
      <p className="text-micro text-text-tertiary">
        {cartao
          ? "Não guardamos o número do seu cartão: ele vai direto pro nosso meio de pagamento."
          : metodo === "pix"
            ? "O QR Code e o copia-e-cola aparecem na próxima tela, com seu nome e CPF já na cobrança."
            : "O boleto sai no seu nome e CPF, e o link chega no seu e-mail."}
      </p>
    </div>
  );
}

/** 0000 0000 0000 0000 — só visual; o que vai pro Asaas é `replace(/\D/g,"")`. */
function mascaraCartao(v: string): string {
  const so = v.replace(/\D/g, "").slice(0, 16);
  return so.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

/** MM/AA — o Asaas recebe `expiryMonth` e `expiryYear` separados (backend parte). */
function mascaraValidade(v: string): string {
  const so = v.replace(/\D/g, "").slice(0, 4);
  return so.length <= 2 ? so : `${so.slice(0, 2)}/${so.slice(2)}`;
}
