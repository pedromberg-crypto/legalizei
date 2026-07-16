/**
 * SHELL DO APP (N10+) — decisão travada 16/07 (design-system.md §0).
 *
 * A casa. Nasce no N9 (pagamento): antes disso o sujeito é um lead num funil;
 * depois, tem uma empresa em andamento e um lugar pra voltar.
 * Teste que separa os dois: *casa é onde você vai ver o que aconteceu enquanto
 * você não estava*. Do N1 ao N8, nada acontece sem ele.
 *
 * Aqui vivem 4 das 5 pausas (P1 salvar&retomar · P2 boleto · P3 consenso ·
 * P4 GOV.BR · P5 constituição).
 *
 * 🚧 A navegação persistente NÃO está aqui ainda, e isso é proposital:
 * "fundação larga, componente estreito". O N18 (farol) não pede nav, e o
 * portal ainda não tem spec — construir a nav agora seria abstração
 * especulativa, o pecado que a fundação proíbe. O route group já reserva o
 * lugar dela pra quando o requisito existir.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <div className="app-page">{children}</div>;
}
