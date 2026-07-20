/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MARCAS DE TERCEIROS — Google e Apple, pros botões de login social.
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ Estes são os DOIS únicos lugares do app, além do `mockup`, que podem usar
 * cor fora dos tokens. E o motivo é o mesmo da moldura de celular: não são
 * superfície do nosso produto. São a marca de outra empresa, e as diretrizes
 * de identidade delas exigem os valores exatos. Um "azul do Google" tirado da
 * nossa paleta estaria errado por definição, e o token estaria mentindo sobre
 * o que representa.
 *
 * Módulo compartilhado porque as duas telas de autenticação (N6 criar conta ·
 * login) mostram os mesmos botões. Duplicar SVG de marca de terceiro é como se
 * garante que uma das cópias envelheça errado.
 *
 * · **Google** — as 4 cores oficiais, não negociáveis.
 * · **Apple** — monocromática por diretriz: usa `currentColor` e herda a cor
 *   do texto do botão. Assim funciona em fundo claro e escuro sem variante.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export function IconeGoogle() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

export function IconeApple() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 12.54c-.03-2.72 2.22-4.02 2.32-4.09-1.26-1.85-3.23-2.1-3.93-2.13-1.67-.17-3.26.98-4.11.98-.85 0-2.16-.96-3.55-.93-1.83.03-3.51 1.06-4.45 2.7-1.9 3.29-.49 8.16 1.36 10.83.9 1.31 1.98 2.77 3.4 2.72 1.36-.06 1.88-.88 3.53-.88s2.11.88 3.55.85c1.47-.02 2.4-1.33 3.3-2.64 1.04-1.51 1.47-2.98 1.5-3.05-.03-.02-2.88-1.11-2.92-4.36zM14.5 4.6c.75-.91 1.25-2.17 1.11-3.43-1.08.04-2.38.72-3.15 1.62-.69.8-1.29 2.08-1.13 3.31 1.2.09 2.43-.61 3.17-1.5z" />
    </svg>
  );
}
