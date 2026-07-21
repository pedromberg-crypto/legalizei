import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

// Sora = TODO o sistema (display, títulos, corpo, UI). Travado 12/07 —
// não é só o wordmark. Ver marca/decisoes-marca.md.
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Legalizai",
  description:
    "Contabilidade digital de quem vive de prestar serviço. Você cuida do negócio, a gente cuida da papelada.",
};

/**
 * `viewportFit: "cover"` é o que LIGA o env(safe-area-inset-*). Sem ele o
 * browser já recorta o viewport sozinho, o env() devolve 0 sempre, e o
 * --safe-top/--safe-bottom do globals.css nunca sai de zero em aparelho
 * nenhum. Estava assim até agora: o env() do rodapé era código morto.
 *
 * Só tem efeito quando esta prancheta é aberta em tela cheia num celular
 * (dev server pelo Wi-Fi, "adicionar à tela de início"). O produto é RN, onde
 * quem responde isto é o `useSafeAreaInsets()`, não o CSS.
 */
export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={sora.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
