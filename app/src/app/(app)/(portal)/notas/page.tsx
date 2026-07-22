import { TelaHeader, Titulo, Corpo } from "@/components/ui/tela";

/**
 * P5/P6/P7 — NOTAS · aba do portal · STUB.
 * A aba existe pra a nav ser real; o conteúdo (lista + emitir NFS-e + o guia da
 * 1ª nota do N24) vem no próximo batch. Matriz: matriz-portal-interno.md Módulo C.
 */
export default function NotasPage() {
  return (
    <>
      <TelaHeader meta="Notas" />
      <main className="app-main">
        <Titulo sub="Emitir e consultar suas notas fiscais, sem os 3 códigos crus que o líder pede.">
          Suas notas
        </Titulo>
        <Corpo>
          <p className="text-caption text-text-tertiary">
            Em construção — próximo batch do portal (P5 lista · P6 emitir · P7 emitida).
          </p>
        </Corpo>
      </main>
    </>
  );
}
