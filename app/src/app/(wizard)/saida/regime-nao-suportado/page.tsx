"use client";

import { useRouter } from "next/navigation";
import { SaidaView, type DadosSaida } from "@/components/saida";
import { TelaHeader } from "@/components/ui/tela";

/**
 * A9 · SAÍDA — REGIME NÃO SUPORTADO (MEI / Lucro Presumido) · 🆕 04/08
 *
 * Nasce do M1 (`/migrar/cnpj`), não da triagem. Achado do cruzamento com o
 * `Fluxo Migração GEMINI.md`: o app só migra hoje quem já é ME/Simples —
 * MEI (desenquadramento) e Lucro Presumido (readequação) são 2 transições
 * reais que o Gemini modela e o nosso flow ainda não decidiu servir. Mesma
 * pendência de escopo já aberta em `legalize-escopo-mei-lucro-presumido-aberto`
 * (memória 03/08), agora reforçada por 2ª fonte independente.
 *
 * Mesmo template A9 das outras saídas — não é falha do cliente, é limite do
 * MLP ainda sem decisão de negócio.
 */
const D: DadosSaida = {
  tag: "Regime diferente",
  titulo: "Esse regime a gente ainda não migra",
  explica:
    "Hoje só assumimos empresas que já estão no Simples Nacional como Microempresa (ME). MEI e Lucro Presumido são regimes com regras próprias que ainda não temos pronto pra migrar.",
  origem: {
    rotulo: "Por que ainda não",
    texto:
      "É limite do produto nesta fase (MLP), não uma restrição legal — dá pra fazer, só não está construído ainda.",
  },
  saida:
    "Deixa seu contato que a gente avisa assim que abrir migração pro seu regime. Você é o primeiro a saber.",
  ctaEnviar: "Me avisem quando abrir",
  confirmacao: {
    titulo: "Anotado",
    texto:
      "A gente avisa assim que migração pro seu regime estiver pronta. Enquanto isso, segue com seu contador atual sem problema.",
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
