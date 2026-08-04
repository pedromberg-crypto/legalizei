"use client";

import { useRouter } from "next/navigation";
import { SaidaView, type DadosSaida } from "@/components/saida";
import { TelaHeader } from "@/components/ui/tela";

/**
 * A9 · SAÍDA — REGIME NÃO SUPORTADO (Lucro Presumido) · 🆕 04/08
 *
 * Nasce do M1 (`/migrar/cnpj?cenario=presumido`). Achado do cruzamento com o
 * `Fluxo Migração GEMINI.md`: o app não tem motor fiscal de Lucro Presumido
 * (IRPJ/CSLL/PIS/COFINS/ISS por atividade — nada a ver com Anexo/Fator R do
 * Simples). Fica em `pesquisa/parking-lot.md` item I até rodar uma pesquisa
 * fiscal dedicada, mesmo processo que gerou `fiscal-simples-bh-2026.md`.
 *
 * 🆕 04/08 (2ª rodada) — **MEI SAIU DESTA SAÍDA.** Decisão do Pedro: MEI agora
 * migra normalmente (ver `MigrarDiagnosticoView`, subfluxo "tem contador?").
 * Só Lucro Presumido segue sem rota — decisão de negócio ainda aberta, não é
 * mais a mesma pendência dupla de `legalize-escopo-mei-lucro-presumido-aberto`
 * (essa memória precisa ser splitada: MEI resolvido, LP segue aberto).
 *
 * Mesmo template A9 das outras saídas — não é falha do cliente, é limite do
 * MLP ainda sem decisão de negócio.
 */
const D: DadosSaida = {
  tag: "Regime diferente",
  titulo: "Lucro Presumido a gente ainda não migra",
  explica:
    "Hoje assumimos empresas no Simples Nacional (ME) e MEI. Lucro Presumido usa um cálculo de imposto totalmente diferente (IRPJ, CSLL, PIS/COFINS e ISS separados) — ainda não temos isso pronto.",
  origem: {
    rotulo: "Por que ainda não",
    texto:
      "É limite do produto nesta fase (MLP), não uma restrição legal — dá pra fazer, só não está construído ainda.",
  },
  saida:
    "Deixa seu contato que a gente avisa assim que abrir migração pro Lucro Presumido. Você é o primeiro a saber.",
  ctaEnviar: "Me avisem quando abrir",
  confirmacao: {
    titulo: "Anotado",
    texto:
      "A gente avisa assim que migração pro Lucro Presumido estiver pronta. Enquanto isso, segue com seu contador atual sem problema.",
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
