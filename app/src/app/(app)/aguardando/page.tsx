"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AguardandoView } from "@/components/wizard-cauda";
import { ehMei, comRegime } from "@/lib/regime";
import { ehEnderecoFiscal, comEndereco } from "@/lib/endereco";
import { categoriaDe, comCategoria } from "@/lib/categoria";
import { TEM_SOCIO } from "@/app/(app)/dossie/mock";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * P2 — AGUARDANDO O BOLETO · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-cauda.tsx` (`AguardandoView`) desde
 * 29/07. Esta page é o wrapper: liga a navegação (antes o CTA não ia pra
 * lugar nenhum).
 *
 * Spec: spec-telas-b3-b4-aterrissagem.md → T19 (dunning) · UX-45 · UX-38.
 * Persona-guarda: `knife` (paga por boleto e some por 3 dias).
 *
 * ─── ESTA TELA EXISTE PORQUE O BOLETO FICOU (decisão do Pedro) ────────────
 * `N9 --boleto--> P2 --> N10`. ⚠️ 29/07: o `/pagamento` de produção não
 * respeitava essa aresta (ia sempre direto pro dossiê, até por boleto);
 * corrigido junto com esta extração.
 *
 * 🔴 30/08 (pedido do Pedro) — REVOGADO "cartão/Pix pulam direto pro N10". No
 * caminho ME, todo método passa por aqui agora: boleto chega direto
 * (pendente), cartão/Pix chegam via `/splash-pagamento` com `?pago=1` (prop
 * `pago`, ver `AguardandoView`). MEI segue com o comportamento antigo por
 * ora (fora do escopo desta rodada).
 *
 * 🆕 04/08 — `?regime=mei` corrige o valor do boleto (sem DAE, mensalidade
 * própria) e repassa o regime adiante pro dossiê.
 *
 * 🔒 31/08 (reunião Rua Satélite 38-40, pedido do Pedro) — FUSÃO A3+E9: esta
 * rota deixou de ser só "aguardando boleto" e virou A TELA DE STATUS única da
 * abertura inteira. `?fase=junta` mostra a fase pós-dossiê (era `/painel`,
 * agora aposentado pro caminho ME — MEI e Migrar continuam lá, pipelines
 * diferentes). `/retomar` sempre cai aqui.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function AguardandoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mei = ehMei(searchParams);
  const enderecoFiscal = ehEnderecoFiscal(searchParams);
  const categoria = categoriaDe(searchParams);
  // 🆕 30/08 — E9.1P do mapa: quem pagou por método instantâneo (cartão/Pix)
  // chega aqui vindo do splash "pagamento confirmado" (`/splash-pagamento`),
  // com `?pago=1`. Boleto continua sem o flag (pendente, comportamento de
  // sempre).
  const pago = searchParams.get("pago") === "1";
  // 🆕 31/08 — fase pós-dossiê (era `/painel`, caminho ME). Mock por query:
  // `?fase=junta` (farol: documentação+viabilidade ok, DAE aguardando).
  const fase = searchParams.get("fase") === "junta" ? "junta" : "dossie";
  // 🆕 01/09 — volta do pagamento da guia (`/guia`): a etapa da DAE fecha e
  // "Agora é só assinar" vira a vez. Mock por query, mesmo padrão de `?pago`.
  const guiaParam = searchParams.get("guia");
  const guiaPaga = guiaParam === "paga";
  // 🆕 01/09 — pagou a guia por BOLETO: a etapa segue em andamento, mas
  // esperando o banco (ver `guiaBoleto` em AguardandoView).
  const guiaBoleto = guiaParam === "boleto";
  /**
   * 🆕 01/09 (pedido do Pedro) — volta da 2ª rodada de nomes (C7′): a jornada
   * RECUA pra "Analisando viabilidade". É o único ponto do flow em que uma
   * etapa já concluída volta a ser a atual, e é honesto: os nomes novos vão
   * pra Junta de novo, então a viabilidade recomeça. Mostrar "Pague a guia"
   * aqui seria dizer que a análise já passou, quando ela nem começou.
   */
  const reanalisando = searchParams.get("viabilidade") === "1";
  /**
   * 🆕 04/09 (Pedro, destrinchando o processo real) — A 1ª ASSINATURA JÁ FOI.
   *
   * São duas até o CNPJ existir (contrato social, depois a abertura com o
   * contador junto), e entre uma e outra a pessoa volta pra cá. Sem este
   * estado a volta da 1ª caía num status que ainda mandava assinar a 1ª.
   */
  const assinou1 = searchParams.get("assinatura") === "1";
  /**
   * 🆕 04/09 (decisão do Pedro) — ROTA ASSISTIDA (`?rota=assistida`).
   *
   * É assim que a operação nasce: automático até a guia paga, humano da
   * assinatura em diante. As telas A4/A4.1/A4″ seguem intactas — elas são a
   * rota automática, que continua sendo o destino. Racional em
   * `components/consultor.tsx`.
   */
  const assistida = searchParams.get("rota") === "assistida";
  /** A frase do compromisso ("Hoje às 15:00") — hero, CTA e mensagens. */
  const agendado = searchParams.get("agendado");
  /* 🆕 05/09 — as PARTES do compromisso, pro cartão desenhar o bloco de data
     (ver `CardCompromisso`). Vêm juntas ou não vêm: o cartão só aparece com o
     conjunto completo, e sem ele o status cai no estado "a marcar". */
  const dia = searchParams.get("dia");
  const semana = searchParams.get("semana");
  const mes = searchParams.get("mes");
  const hora = searchParams.get("hora");
  const compromisso =
    agendado && dia && semana && mes && hora
      ? { numero: Number(dia), semana, mes, hora, hoje: searchParams.get("hoje") === "1" }
      : null;

  return (
    <AguardandoView
      mei={mei}
      temSocios={TEM_SOCIO}
      pago={pago}
      fase={fase}
      junta={
        reanalisando
          ? { concluidas: 0, emAndamento: 0 }
          : assinou1
            ? { concluidas: 3, emAndamento: 3 }
            : guiaPaga
              ? { concluidas: 2, emAndamento: 2 }
              : undefined
      }
      guiaBoleto={guiaBoleto}
      /* 🆕 04/09 — o mesmo flag que recua a timeline agora também troca o hero:
         a volta da 2ª rodada é um estado próprio, não a chegada do A2. */
      rodada2={reanalisando}
      /* 🆕 04/09 — o hero precisa reconhecer que a 1ª assinatura já passou. */
      assinou1={assinou1}
      assistida={assistida}
      agendado={agendado}
      compromisso={compromisso}
      /* 🆕 04/09 — o CTA da rota assistida leva pra agenda, não pro A4. */
      /* 🆕 04/09 — quem vem REMARCAR carrega o horário atual: sem isso, tocar
         em "Remarcar" e desistir devolvia a pessoa pra um status sem
         agendamento nenhum, como se ela tivesse cancelado sem querer. */
      onAgendar={() =>
        router.push(agendado ? `/agendar?agendado=${encodeURIComponent(agendado)}` : "/agendar")
      }
      // 🆕 01/09 — leva pra tela do bloco (continuar ou corrigir), preservando
      // regime e endereço fiscal, como o resto da navegação do wizard.
      onIrParaBloco={(rota) => router.push(comEndereco(comRegime(rota, mei), enderecoFiscal))}
      /**
       * 🗑️ 01/09 (decisão do Pedro) — ia pro gate de certificado (A3.2). A
       * tela SAIU do caminho de constituição de ME: o certificado digital é
       * incluso no plano e emitido por nós "quando chegar a hora", o que a
       * própria tela do plano (E7) já promete. Pedir upload/entrevista de
       * certificado no meio da abertura era cobrar do cliente uma coisa que a
       * gente faz por ele — e o motivo documentado pra ela existir aqui
       * (a procuração eletrônica exigiria certificado já validado) não se
       * sustenta: o certificado é e-CNPJ, e o CNPJ ainda nem existe neste
       * ponto do flow. Segue viva pro MEI (`/certificado?regime=mei`) e pro
       * caminho migrar, onde a empresa já existe.
       */
      /**
       * 🔄 01/09 (pedido do Pedro) — o CTA da etapa "Pague a guia da Junta"
       * agora leva pra TELA DE PAGAMENTO DA GUIA (`/guia`), que é o mesmo
       * PagamentoView do E9 no modo guia. Antes ia direto pra assinatura,
       * como se a guia se pagasse sozinha.
       */
      onPagarDae={() => router.push("/guia")}
      // 🆕 01/09 — último passo da fase Junta: o CTA do rodapé leva pro A4.
      onAssinar={() => router.push(assinou1 ? "/assinatura?rodada=2" : "/assinatura")}
      // 🔄 27/08 — a 1ª tela do dossiê virou a C0 (`/dossie/atividade`), não
      // mais o C1. Mesma mudança do `/pagamento` (racional lá).
      // 🐛 28/08 — faltava o ramo MEI: ia sempre pra C0 (ME), mesmo quando
      // `mei=true`. MEI não usa a C0 (não aceita CNAE livre) — vai pra M-O
      // (`/dossie/ocupacao`), mesmo destino que `/pagamento` já usa.
      onSeguir={() =>
        router.push(
          comCategoria(
            comEndereco(
              // 🔒 02/09 — o ME entra pela CHEGADA da C0 (`?vazia=1`, nó
              // C0.0 do mapa): tela limpa, sem palpite de CNAE antes de a
              // pessoa contar o que faz. Sem esta query o app caía direto na
              // tela com os 5 cartões e a chegada não existia pra ninguém —
              // o mapa dizia uma coisa e o link fazia outra.
              comRegime(mei ? "/dossie/ocupacao" : "/dossie/atividade?vazia=1", mei),
              enderecoFiscal,
            ),
            categoria,
          ),
        )
      }
    />
  );
}
