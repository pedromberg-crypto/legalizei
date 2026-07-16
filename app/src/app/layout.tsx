import type { Metadata } from "next";
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
  title: "Legalizei",
  description:
    "Contabilidade digital de quem vive de prestar serviço. Você cuida do negócio, a gente cuida da papelada.",
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
