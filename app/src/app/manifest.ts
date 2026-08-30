import type { MetadataRoute } from "next";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * WEB APP MANIFEST — modo standalone de verdade no iPhone
 * ═══════════════════════════════════════════════════════════════════════════
 * 🐛 29/08 — achado testando no iPhone real (Pedro): só a meta tag
 * `apple-mobile-web-app-capable` (sem manifest) segura o modo tela cheia na
 * PRIMEIRA tela, mas qualquer navegação depois (Próximo, Pular etc) jogava de
 * volta pro Safari com as barras. É limitação conhecida da técnica antiga
 * (pensada pra 1 página só, não pra app com várias rotas).
 *
 * O manifest com `scope: "/"` é o mecanismo de verdade que o iOS usa (desde
 * 11.3) pra saber que TODA navegação dentro desse escopo continua no app
 * standalone, não só a URL salva.
 *
 * ⚠️ Ícone antigo salvo na Tela de Início não pega o manifest sozinho —
 * precisa apagar e "Adicionar à Tela de Início" de novo depois desse deploy.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Legalizai",
    short_name: "Legalizai",
    description:
      "Contabilidade digital de quem vive de prestar serviço. Você cuida do negócio, a gente cuida da papelada.",
    start_url: "/splash",
    scope: "/",
    display: "standalone",
    background_color: "#F2643C",
    theme_color: "#F2643C",
    icons: [
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
