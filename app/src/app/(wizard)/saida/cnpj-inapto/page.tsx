"use client";

import { useRouter } from "next/navigation";
import { SaidaView, type DadosSaida } from "@/components/saida";
import { TelaHeader } from "@/components/ui/tela";
import { Lottie } from "@/components/lottie";

/**
 * A9 · SAÍDA — CNPJ INAPTO/SUSPENSO/BAIXADO · 🆕 04/08
 *
 * Nasce do M1 (`/migrar/cnpj`). Achado do cruzamento com o `Fluxo Migração
 * GEMINI.md`: o Gemini trava isso já na entrada (status cadastral ≠ ativo →
 * regularização, não migração direta). Nosso M1 hoje não tinha essa saída — o
 * veredito só cobria "ativo com CNAE aceito ou não". CNPJ suspenso/inapto é
 * situação cadastral (a Receita nem reconhece a empresa como ativa) — problema
 * DIFERENTE de "empresa ativa com dívida", que a gente não audita mais de
 * propósito (🔴 06/08: M4a/auditoria de passivo retirada, vira serviço à
 * parte sob demanda, só pós-ativação).
 *
 * Mesmo template A9 — aqui o motivo é regularização cadastral, não escopo do
 * produto, então a copy é mais prática (o que fazer) que educativa.
 */
const D: DadosSaida = {
  // 🆕 04/08 — mesmo teste do Pedro: ícone "Alert" (Lottie) recolorido pro
  // nosso azul de status, no lugar do símbolo padrão de pessoa.
  icone: <Lottie path="/lottie/alert-legalizei.json" fps={30} className="h-[125px] w-[125px]" />,
  tag: "CNPJ irregular",
  titulo: "Essa empresa precisa regularizar antes de migrar",
  explica:
    "A Receita mostra sua empresa com situação diferente de ativa (suspensa, inapta ou baixada). A gente não consegue assumir a contabilidade nesse estado, a regularização vem primeiro.",
  origem: {
    rotulo: "Por que isso trava a migração",
    texto:
      "Sem situação ativa na Receita não dá pra fazer a transferência de responsabilidade nem declarar nada em nome da empresa. É exigência dos próprios órgãos, não nossa.",
  },
  saida:
    "Deixa seu contato que a gente te ajuda a entender o que falta pra regularizar. Depois de ativa de novo, a migração segue normal.",
  ctaEnviar: "Quero ajuda pra regularizar",
  confirmacao: {
    titulo: "Recebemos seu contato",
    texto:
      "Nosso time entra em contato pra entender o que está pendente na sua empresa e como regularizar. Assim que resolver, você volta e migra com a gente.",
  },
};

export default function SaidaCnpjInaptoPage() {
  const router = useRouter();

  return (
    <>
      <TelaHeader meta="Sobre a situação do CNPJ" />
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
