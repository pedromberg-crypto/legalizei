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
  // 🆕 29/08 (teste do Pedro no iPhone real) — sozinha a `viewport.viewportFit`
  // abaixo não tira a barra de endereço/abas do Safari, só liga o env() de
  // safe-area. Quem tira a barra do Safari de vez é isto: "Compartilhar" →
  // "Adicionar à Tela de Início" no Safari do iPhone, o ícone criado abre em
  // tela cheia de verdade (sem topo/rodapé do navegador), só sobra o status
  // bar do PRÓPRIO iOS (hora/bateria) — esse nunca some, nem no app de
  // verdade, é por isso que o `--safe-top` existe. `black-translucent` deixa
  // nosso fundo pintar atrás do status bar em vez de uma faixa branca sólida.
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Legalizai",
  },
  // 🆕 29/08 — ícone do símbolo Legalizai (coral + check) quando adiciona à
  // Tela de Início no iPhone. 180×180, tamanho nativo pro ícone do iOS.
  icons: {
    apple: "/apple-touch-icon.png",
  },
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
      <head>
        {/* 🆕 29/08 — o Next só emite a tag padrão nova
            (`mobile-web-app-capable`, iOS só lê a partir do 17.4). O Safari
            de versão mais velha só entende a com prefixo `apple-`, então ela
            entra manual aqui pra não depender da versão do iPhone. */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
