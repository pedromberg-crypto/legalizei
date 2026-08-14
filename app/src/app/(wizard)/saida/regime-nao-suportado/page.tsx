"use client";

import { useRouter } from "next/navigation";
import { SaidaView, type DadosSaida } from "@/components/saida";
import { TelaHeader } from "@/components/ui/tela";
import { Lottie } from "@/components/lottie";

/**
 * A9 · SAÍDA — REGIME PEDE ESPECIALISTA (Lucro Presumido) · 🆕 04/08
 *
 * Nasce da E3.2 (CTA "ME · Lucro Presumido", abaixo dos cards MEI/ME) — desde
 * 05/08, o autodeclarado. Achado do cruzamento com o `Fluxo Migração
 * GEMINI.md`: o app não tem motor fiscal de Lucro Presumido (IRPJ/CSLL/PIS/
 * COFINS/ISS por atividade — nada a ver com Anexo/Fator R do Simples). Fica
 * em `pesquisa/parking-lot.md` item I até rodar uma pesquisa fiscal dedicada,
 * mesmo processo que gerou `fiscal-simples-bh-2026.md`.
 *
 * 🔴 05/08 (pedido do Pedro) — copy e CTA reformulados: de "lista de espera
 * pro futuro" pra "atendimento humano agora". A gente atende Simples e MEI
 * pelo produto; Lucro Presumido é caso pra especialista da equipe, não uma
 * feature que falta. CTA "Falar com especialista" cai no CRM interno (mesmo
 * padrão fake-sem-backend do resto das capturas do produto — sem integração
 * real ainda).
 *
 * Mesmo template A9 das outras saídas — não é falha do cliente.
 */
const D: DadosSaida = {
  // 🆕 04/08 — teste do Pedro: ícone "Alert" (Lottie) recolorido pro nosso
  // azul de status (#3B82E0), no lugar do símbolo padrão de pessoa. Escopo
  // pontual: só esta saída e `/saida/cnpj-inapto` por enquanto.
  icone: <Lottie path="/lottie/alert-legalizai-story-book.json" fps={30} className="h-[125px] w-[125px]" />,
  tag: "Regime diferente",
  titulo: "Seu regime pede um especialista",
  explica:
    "A gente atende empresas no Simples Nacional (ME) e MEI. Lucro Presumido tem um cálculo de imposto próprio (IRPJ, CSLL, PIS/COFINS e ISS separados), então esse caso a gente resolve com uma pessoa da equipe falando direto com você, não pelo automático do app.",
  origem: {
    rotulo: "Por que fala com humano",
    texto:
      "Lucro Presumido não segue Anexo nem Fator R do Simples: é outro cálculo, com outras regras. Prefere te colocar direto com quem entende disso do que te jogar num formulário genérico.",
  },
  saida: "Deixa seu contato que um especialista da nossa equipe fala com você.",
  ctaEnviar: "Falar com especialista",
  confirmacao: {
    titulo: "Recebemos seu contato",
    texto:
      "Um especialista da nossa equipe entra em contato pra entender seu caso e ver como te ajudar.",
  },
};

export default function SaidaRegimeNaoSuportadoPage() {
  const router = useRouter();

  return (
    <>
      <TelaHeader meta="Sobre o seu regime" />
      <main className="app-main">
        <SaidaView
          d={{
            ...D,
            confirmacao: {
              ...D.confirmacao!,
              acoes: [{ label: "Voltar ao início", variante: "ghost", onClick: () => router.push("/entrada") }],
            },
          }}
        />
      </main>
    </>
  );
}
