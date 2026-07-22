import { TelaHeader, Titulo, Corpo } from "@/components/ui/tela";

/**
 * P8/P9 — PRÓ-LABORE · aba do portal · STUB.
 * O diferencial-âncora: o P9 é o N18 INTERATIVO (mexe e vê o imposto mudar),
 * reusando a engine de `/simulador`. Vem no próximo batch. Matriz: Módulo D.
 */
export default function ProLaborePage() {
  return (
    <>
      <TelaHeader meta="Pró-labore" />
      <main className="app-main">
        <Titulo sub="Veja e ajuste o quanto você retira. Mexeu, o imposto muda na hora — sem o preset cru do líder.">
          Seu pró-labore
        </Titulo>
        <Corpo>
          <p className="text-caption text-text-tertiary">
            Em construção — próximo batch (P8 ver · P9 ajustar, reusa o N18/simulador).
          </p>
        </Corpo>
      </main>
    </>
  );
}
