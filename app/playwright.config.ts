import { defineConfig, devices } from "@playwright/test";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PLAYWRIGHT — testes E2E de fluxo/UI (Pedro, 30/08)
 * ═══════════════════════════════════════════════════════════════════════════
 * Escopo combinado: navegação e UI reais no navegador, não integração de
 * backend (pagamento/APIs seguem mock, RF-01). `webServer` sobe o `next dev`
 * sozinho se não achar um já rodando em :3000 — reusa o que já estiver de pé
 * (útil neste projeto, que costuma ficar com o dev server aberto).
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default defineConfig({
  testDir: "./e2e",
  // 🐛 30/08 — achado testando: com vários workers em paralelo contra o MESMO
  // `next dev` (não é build de produção), rota que ainda não foi visitada
  // compila sob demanda — sob carga de várias abas ao mesmo tempo isso vira
  // flake (teste falha por lentidão, não por bug de verdade). Roda sério até
  // termos um `next build`/servidor de produção dedicado pros testes.
  fullyParallel: false,
  workers: 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    // 🐛 30/08 — a raiz "/" devolve 404 neste app (sem página em `/`); usar
    // como URL de checagem faz o Playwright achar que o server não subiu e
    // tentar iniciar um 2º (que colide com o dev server já aberto). `/splash`
    // sempre responde 200.
    url: "http://localhost:3000/splash",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
