/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SHELL DO CAMINHO MEI — route group `(mei)`.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09 (decisão do Pedro): o MEI vira caminho próprio, com telas próprias.
 *
 * ─── POR QUE UM ROUTE GROUP SÓ, E NÃO DOIS ──────────────────────────────────
 * O caminho ME é dividido em `(wizard)` (o lead, sem cromo de navegação) e
 * `(app)` (a casa, que nasce no pagamento). A fronteira existe lá porque tem
 * significado: antes do N9 o sujeito é um lead num funil; depois, tem uma
 * empresa em andamento e um lugar pra voltar.
 *
 * No MEI essa fronteira **não muda nada na prática**: os dois shells são hoje
 * o mesmo `div.app-page`, nenhuma tela do ramo tem navegação persistente, e a
 * casa de verdade (`/home-dia1`) fica fora deste grupo, no portal, que é
 * compartilhado de propósito. Criar `(mei-wizard)` e `(mei-app)` seria
 * reproduzir uma distinção sem consequência — abstração especulativa, que é o
 * pecado que a doutrina de fundação do projeto proíbe.
 *
 * 📌 Quando o portal ganhar navegação persistente e o MEI precisar dela nas
 * telas pós-pagamento (M12 em diante), é AQUI que a divisão nasce.
 *
 * 🔒 Este grupo é território exclusivo do MEI. A trava
 * `execucao/flow/verificar-fronteira-mei.mjs` garante que nada aqui dentro
 * importe tela de ME, e que nenhuma tela de ME importe daqui.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function MeiLayout({ children }: { children: React.ReactNode }) {
  return <div className="app-page">{children}</div>;
}
