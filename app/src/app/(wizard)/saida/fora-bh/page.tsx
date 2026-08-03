"use client";

import { useRouter } from "next/navigation";
import { SaidaView, type DadosSaida } from "@/components/saida";
import { TelaHeader } from "@/components/ui/tela";

/**
 * A9 · SAÍDA — FORA DE BELO HORIZONTE · 🆕 28/07 (reunião Rua Satélite 9)
 *
 * Nasce do GATE DE CIDADE (N3G), não da triagem do N4. O MLP testa só em
 * Belo Horizonte/MG — nenhum outro município ou estado ainda. Barra ANTES
 * de qualquer outra pergunta (N3, logo depois do fork), junto com o gate.
 *
 * Mesmo template A9 (barra + explica + captura + roteia) das outras saídas —
 * não é falha do cliente, é limite do MLP.
 *
 * 🆕 03/08 — UX-62 mesclado (fonte: /apresentacao): a saída virou lista de
 * espera CLASSIFICADA — pergunta a cidade (`extra`, obrigatório) em vez de só
 * capturar contato, e a confirmação promete só o que a gente cumpre (avisar
 * quando abrir), sem prazo de ligação inventado. "Voltar ao início" é real
 * aqui (não existe conceito de "reiniciar demo" em produção).
 */
const D: DadosSaida = {
  tag: "Outra cidade",
  titulo: "Por enquanto, só abrimos em Belo Horizonte",
  explica:
    "Estamos testando o produto com foco total numa cidade antes de expandir. Hoje só abrimos empresa em Belo Horizonte/MG.",
  origem: {
    rotulo: "Por que só BH",
    texto:
      "É a fase de testes (MLP) do produto — preferimos fazer bem para uma cidade antes de abrir para mais.",
  },
  saida:
    "Entra na lista de espera que a gente te avisa assim que abrir na sua cidade. Você é o primeiro a saber.",
  extra: {
    rotulo: "Qual a sua cidade?",
    placeholder: "Comece a digitar: Uberl…",
    obrigatorio: true,
    tipo: "municipio",
  },
  ctaEnviar: "Me avisem quando chegarem aqui",
  confirmacao: {
    titulo: "Você está na nossa lista especial",
    texto:
      "A gente te avisa assim que expandir as operações pra sua cidade. Enquanto isso, acompanha a gente por aqui: é onde a gente explica imposto sem contabilês.",
  },
};

export default function SaidaForaBhPage() {
  const router = useRouter();

  return (
    <>
      <TelaHeader meta="Sobre a sua cidade" />
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
