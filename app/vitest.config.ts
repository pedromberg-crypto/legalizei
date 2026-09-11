import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    projects: [
      /**
       * 🔴 PROJETO "unidade" (11/09) — testes de função PURA, sem navegador.
       *
       * Existe por causa da auditoria que o Pedro pediu: 34 verificações sobre
       * o dado e ZERO sobre a vista, com 8 dos 10 defeitos do dia na vista.
       * Roda em segundos e NÃO sobe Playwright — a regra de "E2E só quando o
       * Pedro pedir" continua intacta.
       *
       *   npx vitest run --project unidade
       */
      {
        extends: true,
        // o alias "@" do Next não chega sozinho no vitest
        resolve: { alias: { '@': path.join(dirname, 'src') } },
        test: {
          name: 'unidade',
          environment: 'node',
          include: ['src/**/*.test.ts'],
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
