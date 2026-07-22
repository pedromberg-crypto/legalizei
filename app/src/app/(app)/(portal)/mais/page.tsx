import { TelaHeader, Titulo, Corpo } from "@/components/ui/tela";

/**
 * P10–P14 — MAIS · aba do portal · STUB.
 * A gaveta do que não é rotina diária: "você está em dia ✓" (P10), relatórios
 * avançados (P11), dados da empresa (P12), documentos+certificado (P13), conta
 * (P14). Vem depois. Matriz: matriz-portal-interno.md Módulos E+F.
 */
export default function MaisPage() {
  return (
    <>
      <TelaHeader meta="Mais" />
      <main className="app-main">
        <Titulo sub="Onde ficam suas provas de estar em dia, seus documentos e os ajustes da conta.">
          Mais
        </Titulo>
        <Corpo>
          <p className="text-caption text-text-tertiary">
            Em construção — próximo batch (P10 está em dia · P11 relatórios · P12–P14 dados/documentos/conta).
          </p>
        </Corpo>
      </main>
    </>
  );
}
