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
  const [resultado, setResultado] = useState<Resultado | null>(null);

  function validar() {
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
            onValidar={validar}
            // 🆕 27/08 — a copy muda porque o contexto mudou: a pessoa já é
            // cliente, já passou pelo gate. Não estamos decidindo se atendemos,
            // estamos achando o código certo dela.
            jaCliente
            // 🔒 31/08 — categoria veio do gate: mostra confirmada, não
            // repergunta (ver `categoriaDoGate` acima).
            categoriaTravada={categoriaDoGate !== null}
          />
        )}
        {etapa === "analisando" && <AnalisandoView />}
        {etapa === "veredito" && resultado && (
          <VereditoView
            r={resultado}
            onRefazer={() => setEtapa("perguntando")}
            onSeguir={seguir}
            mostrarAlternativas
          />
        )}
      </main>
    </>
  );
}
