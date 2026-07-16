/**
 * SHELL DO WIZARD (N1–N9) — decisão travada 16/07 (design-system.md §0).
 *
 * O wizard é um MODO, não uma seção:
 *   · fullscreen, SEM nav, SEM saída lateral (o lead não tem pra onde ir; a
 *     única saída é pra frente ou pelo browser)
 *   · uso único, linear
 *   · NÃO herda cromo de navegação do app — a pergunta "e o menu?" não existe
 *   · nenhuma das 5 pausas vive aqui: o wizard só anda se o usuário andar,
 *     então ele quase não tem estado
 *
 * A casa (shell do app) nasce só no N9, com o pagamento.
 * Route group `(wizard)` existe justamente pra que essa fronteira seja
 * estrutural no código, não uma convenção que alguém precisa lembrar.
 */
export default function WizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="app-page">{children}</div>;
}
