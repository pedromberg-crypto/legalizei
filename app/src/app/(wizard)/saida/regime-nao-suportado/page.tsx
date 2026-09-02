"use client";

import { useRouter } from "next/navigation";
import { SaidaView } from "@/components/saida";
import { DADOS_SAIDA_REGIME as D } from "@/lib/dados-saida";
import { TelaHeader } from "@/components/ui/tela";

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
