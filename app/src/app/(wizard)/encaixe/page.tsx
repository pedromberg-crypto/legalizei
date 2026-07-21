import { EncaixeView, type EncaixeData } from "@/components/encaixe";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N-ENCAIXE — rota FAROL (standalone) do ENCAIXE, pra review no /mockup.
 * ═══════════════════════════════════════════════════════════════════════════
 * No flow real o ENCAIXE é um sub-passo do gate (N4), entre o veredito e a
 * triagem — não uma rota. Esta rota existe só pra a tela ganhar um tile no
 * /mockup sem os cliques do gate. Mock do caso `marketing` (o print do Pedro).
 * ═══════════════════════════════════════════════════════════════════════════
 */
const MOCK: EncaixeData = {
  recomendado: {
    humano: "Marketing e publicidade",
    cnae: "7319-0/03",
    adequacao: 94,
    descricao: "Você cuida da divulgação e das vendas de outras empresas.",
    cobre: [
      "Gestão de campanhas e anúncios (tráfego pago)",
      "Marketing em redes sociais e na internet",
      "E-mail marketing e mala direta",
      "Promoção de produtos e serviços de outras empresas",
    ],
  },
  alternativas: [
    { humano: "Design e criação visual", cnae: "7410-2/99", adequacao: 72 },
    { humano: "Consultoria em comunicação", cnae: "7020-4/00", adequacao: 64 },
  ],
};

export default function EncaixePage() {
  return (
    <>
      <header className="pt-6 pb-4">
        <p className="text-micro text-text-tertiary">Sua atividade</p>
      </header>
      <main className="app-main">
        <EncaixeView dados={MOCK} />
      </main>
    </>
  );
}
