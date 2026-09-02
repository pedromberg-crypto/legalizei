"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PerguntaView, AnalisandoView, PILLS } from "@/components/gate-telas";
import { VereditoView, type Resultado } from "@/components/veredito";
import { ehMei, comRegime } from "@/lib/regime";
import { ehEnderecoFiscal, comEndereco } from "@/lib/endereco";
import { categoriaDe } from "@/lib/categoria";
import { mapear } from "@/lib/mock-veredito";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * C0 — SUA ATIVIDADE (descrever + CNAE) · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 27/08 — esta tela é o antigo **E5A + E5V** (`/gate` e `/gate?etapa=veredito`),
 * movidos de ANTES do pagamento pra DEPOIS dele. Primeira tela do dossiê.
 *
 * ─── POR QUE ELA PÔDE ATRAVESSAR O PAGAMENTO ───────────────────────────────
 * Porque o gate de elegibilidade mudou de lugar, não sumiu. Ele era o veredito
 * de CNAE (que podia responder 🔴 "não atendemos"); agora é a **categoria**
 * escolhida no E3.3 (`/endereco`), que só oferece o que a Legalizai atende.
 *
 * Consequência direta: quem chega aqui JÁ passou pelo filtro. A pessoa escolhe
 * o CNAE que mais se parece com o que faz **dentro de um universo inteiramente
 * atendido**, e o veredito não pode mais devolver "não". Sem isso, mover a
 * tela criaria o pior caso possível: cliente que pagou e descobre depois que a
 * gente não atende (que é exatamente o que a Contabilizei faz, e o que a nossa
 * tese de produto sempre rejeitou).
 *
 * ⚠️ Por isso a `categoria` (via `?cat=`) não é decoração aqui: ela é a prova
 * de que o gate rodou. Se ela não vier (deep-link direto, `/mockup`), a tela
 * ainda funciona, mas está fora do caminho real.
 *
 * ─── O QUE FICOU PRA TRÁS, DE PROPÓSITO ────────────────────────────────────
 * As 3 saídas do veredito antigo (E5.1 waitlist · E5.2 Mauro atende · E5.3
 * descarta) NÃO são mais alcançáveis daqui. A única porta de "não atendo" no
 * caminho abrir é o "minha atividade não está na lista" do E3.3, que leva pra
 * waitlist ANTES de qualquer cobrança. As rotas continuam vivas (o Migrar
 * ainda usa E5.1/E5.2, e o /mockup ainda cataloga as três).
 *
 * 🚧 IA dublada: `mapear()` é mock. A tela testa a LÓGICA, não a IA.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function AtividadePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mei = ehMei(searchParams);
  const enderecoFiscal = ehEnderecoFiscal(searchParams);
  const catInicial = categoriaDe(searchParams);

  const [etapa, setEtapa] = useState<"perguntando" | "analisando" | "veredito">(
    "perguntando",
  );
  const [texto, setTexto] = useState("");
  // A categoria vem PRÉ-SELECIONADA do E3.3 — a pessoa já respondeu isso antes
  // de pagar.
  // 🔒 31/08 (pedido do Pedro) — deixou de ser editável aqui: quando veio do
  // gate, aparece como CHIP CONFIRMADO e a pessoa só descreve o que faz (a
  // descrição + a categoria é o que cruza pra achar a atividade principal).
  // Sem `?cat=` (demo/entrada direta), a lista de pills volta como antes.
  const categoriaDoGate = catInicial && PILLS.some((p) => p.id === catInicial) ? catInicial : null;
  const [categoria, setCategoria] = useState<string | null>(categoriaDoGate);
  const [sabeCodigo, setSabeCodigo] = useState(false);
  /**
   * 🆕 02/09 — a passagem C0.0 → C0 (nós do mapa). A chegada é a mesma
   * rota num estado anterior: apertar "Buscar atividade principal" REVELA os
   * códigos ali mesmo, sem navegar. Navegar exigiria refazer o carregamento
   * pra mostrar o resto da própria tela.
   * `?vazia=1` continua sendo quem ABRE na chegada, então quem revisa entra
   * direto no estado que quer ver.
   */
  const [buscou, setBuscou] = useState(false);
  const naChegada = searchParams.get("vazia") === "1" && !buscou;
  const [resultado, setResultado] = useState<Resultado | null>(null);

  /**
   * 🐛→🔒 02/09 — GUARDA O CNAE ESCOLHIDO. Antes esta função recebia
   * nada e recalculava tudo por `mapear(texto)`: a escolha do slot da C0 era
   * jogada fora, e quem selecionasse a 4ª sugestão seguia com a 1ª. No dado
   * que trava nome empresarial, objeto social e o registro na Junta.
   */
  const [cnaeEscolhido, setCnaeEscolhido] = useState<string | undefined>();

  function validar(escolhido?: string) {
    setCnaeEscolhido(escolhido);
    setEtapa("analisando");
    setTimeout(() => {
      setResultado(mapear(texto));
      setEtapa("veredito");
    }, 1400);
  }

  // 🔄 28/08 (pedido do Pedro) — CNAE secundário deixou de vir depois de
  // "Dados da empresa" (C4) e passou pra logo aqui, na sequência natural de
  // quem acabou de escolher a atividade principal. Ver `dossie/cnae-secundarios`
  // (próximo destino) e `dossie/empresa` (que perdeu esse destino).
  const seguir = () =>
    router.push(comEndereco(comRegime("/dossie/cnae-secundarios", mei), enderecoFiscal));

  return (
    <>
      <header className="pt-6 pb-4">
        <p className="text-micro text-text-tertiary">Legalizai</p>
      </header>

      <main className="app-main">
        {etapa === "perguntando" && (
          <PerguntaView
            texto={texto}
            setTexto={setTexto}
            categoria={categoria}
            setCategoria={setCategoria}
            sabeCodigo={sabeCodigo}
            setSabeCodigo={setSabeCodigo}
            // Na chegada o botão busca (revela os códigos); com eles na tela,
            // confirma a atividade escolhida e segue.
            onValidar={naChegada ? () => setBuscou(true) : validar}
            /* 🆕 02/09 — voltar. Como C0.0 e C0 são a MESMA rota em dois
               momentos, voltar da tela com resultados é desfazer a busca, não
               navegar: `router.back()` ali sairia do dossiê inteiro e
               perderia o que a pessoa escreveu. Só quem já está na chegada
               (ou entrou direto na C0, sem `?vazia=1`) sai de fato. */
            onVoltar={() => {
              if (!naChegada && searchParams.get("vazia") === "1") {
                setBuscou(false);
                return;
              }
              router.back();
            }}
            // 🆕 27/08 — a copy muda porque o contexto mudou: a pessoa já é
            // cliente, já passou pelo gate. Não estamos decidindo se atendemos,
            // estamos achando o código certo dela.
            jaCliente
            // 🔄 02/09 — a tela não bifurca mais entre "chip travado" e
            // "grade de pills": é sempre chip + "Trocar categoria". O que a
            // `?cat=` decide agora é só qual categoria vem preenchida.
            //
            // 🆕 02/09 — `?vazia=1` abre a CHEGADA (nó C0_0 do mapa): a tela
            // sem os cartões de código, antes de a pessoa descrever. Por
            // querystring, e não por `texto === ""`, porque ainda não está
            // decidido se a virada é automática ao digitar ou por ação — o
            // Pedro está lapidando essa tela. Enquanto isso, quem revisa
            // consegue abrir os dois estados por rota.
            semResultados={naChegada}
          />
        )}
        {etapa === "analisando" && <AnalisandoView />}
        {etapa === "veredito" && resultado && (
          <VereditoView
            r={resultado}
            onRefazer={() => setEtapa("perguntando")}
            // A escolha feita na C0 abre promovida aqui, em vez de o veredito
            // recomeçar pelo maior %.
            cnaeEscolhido={cnaeEscolhido}
            onSeguir={seguir}
            mostrarAlternativas
          />
        )}
      </main>
    </>
  );
}
