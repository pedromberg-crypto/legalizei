"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AguardandoView } from "@/components/wizard-cauda";
import { ehMei, comRegime } from "@/lib/regime";
import { ehEnderecoFiscal, comEndereco } from "@/lib/endereco";
import { categoriaDe, comCategoria } from "@/lib/categoria";
import { compromissoDaQuery, queryDoCompromisso } from "@/lib/compromisso";
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
  /* 🔒 05/09 (auditoria) — GUARDA POR REGIME. `?rota=assistida&regime=mei`
     renderizava a rota assistida inteira (cartão do consultor, "Escolher um
     horário") num regime que não tem contrato social nem guia da Junta pra
     assinar. O MEI tem pipeline próprio (`/painel`) e chegava aqui só por URL
     na mão, mas tela compartilhada sem guarda é como o vazamento aparece na
     próxima mudança — a regra da casa é guardar por regime. */
  const assistida = !mei && searchParams.get("rota") === "assistida";
  /* 🔄 05/09 (auditoria) — O COMPROMISSO CHEGA EM PARTES, E SÓ EM PARTES.
     Antes vinha uma frase pronta (`?agendado=`) ao lado das partes, e desistir
     de remarcar devolvia a frase sem elas: hero, etapa e CTA diziam "hora
     marcada" e o cartão da hora sumia. A frase agora é derivada das partes
     dentro da view (`lib/compromisso`). */
  const compromisso = compromissoDaQuery(searchParams);
  /* 🆕 05/09 — `?socios=` é a CONTAGEM de sócios (mesma convenção do C3:
     `/dossie/socios?socios=4`), e ela VENCE o mock. Sem isso os dois nós do
     mapa (A3.H sem sócio × A3.H′ com sócio) renderizariam igual, porque
     `TEM_SOCIO` é `true` — o mock existe pra mostrar o máximo de UI, não pra
     decidir qual variante uma rota específica demonstra. */
  const socios = Number(searchParams.get("socios"));
  const temSocios =
    Number.isFinite(socios) && socios > 0 ? socios > 1 : TEM_SOCIO;

  return (
    <AguardandoView
      mei={mei}
      temSocios={temSocios}
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
      /* 🐛 05/09 (auditoria) — recuar a viabilidade zerava a guia junto, e a
         tela voltava a cobrar de quem já pagou. As duas coisas são
         independentes: o nome volta pra Junta, o dinheiro não volta pro
         cliente. */
      guiaJaPaga={reanalisando && guiaPaga}
      /* 🆕 04/09 — o hero precisa reconhecer que a 1ª assinatura já passou. */
      assinou1={assinou1}
      assistida={assistida}
      compromisso={compromisso}
      /* 🆕 04/09 — o CTA da rota assistida leva pra agenda, não pro A4. */
      /* 🔄 05/09 (auditoria) — quem vem REMARCAR carrega o compromisso INTEIRO,
         não só a frase dele. É esse conjunto que a agenda usa pra abrir no dia
         certo, pré-selecionar a hora e reconstruir o status se a pessoa
         desistir no meio; com só a frase, desistir apagava o cartão da hora.
         A RODADA viaja junto: sem ela, remarcar a 2ª assinatura devolvia a
         pessoa pra tela da 1ª. */
      onAgendar={() => {
        const q = new URLSearchParams(
          compromisso ? queryDoCompromisso(compromisso) : "",
        );
        if (assinou1) q.set("rodada", "2");
        /* 🆕 05/09 — a agenda precisa saber que são DOIS assinando: o contrato
           social é assinado por todos os sócios, e o horário marcado lá vale
           pros dois. Vai só o flag; o nome vem do mock do outro lado, como no
           resto do wizard. */
        /* 🔒 05/09 — vale nas DUAS rodadas. Na 1ª o sócio assina junto; na 2ª
           a agenda usa o nome dele pra dizer que ele não precisa estar.
           🐛 05/09 — a contagem só ia quando havia sócio, e no caso SOLO a
           volta caía no mock (`TEM_SOCIO = true`): a pessoa saía de um status
           que dizia "sua assinatura" e voltava pra um que citava um sócio que
           ela não tem. A contagem viaja sempre, inclusive quando é 1. */
        q.set("socios", temSocios ? "2" : "1");
        const s = q.toString();
        router.push(s ? `/agendar?${s}` : "/agendar");
      }}
      // 🆕 01/09 — leva pra tela do bloco (continuar ou corrigir), preservando
      // regime e endereço fiscal, como o resto da navegação do wizard.
      onIrParaBloco={(rota) =>
        router.push(comEndereco(comRegime(rota, mei), enderecoFiscal))
      }
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
      onAssinar={() =>
        router.push(assinou1 ? "/assinatura?rodada=2" : "/assinatura")
      }
      // 🔄 27/08 — a 1ª tela do dossiê virou a C0 (`/dossie/atividade`), não
      // mais o C1. Mesma mudança do `/pagamento` (racional lá).
      /* 🗑️ 07/09 — saiu o desvio pro MEI (`/dossie/ocupacao`, rota removida
         no fork). O ramo MEI tem `/mei/ocupacao` e não passa mais por esta
         tela vindo do "abrir". */
      onSeguir={() =>
        router.push(
          comCategoria(
            comEndereco(
              // 🔒 02/09 — o ME entra pela CHEGADA da C0 (`?vazia=1`, nó
              // C0.0 do mapa): tela limpa, sem palpite de CNAE antes de a
              // pessoa contar o que faz. Sem esta query o app caía direto na
              // tela com os 5 cartões e a chegada não existia pra ninguém —
              // o mapa dizia uma coisa e o link fazia outra.
              comRegime("/dossie/atividade?vazia=1", mei),
              enderecoFiscal,
            ),
            categoria,
          ),
        )
      }
    />
  );
}
