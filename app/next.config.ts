import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O badge flutuante do dev tools sobrepõe o CTA do rodapé (thumb zone),
  // que é justamente o que precisamos avaliar em mobile.
  devIndicators: false,
  // 🆕 29/08 — testando no iPhone real pela rede local (Pedro): Next 16
  // recusa requisição de dev vinda de origem ≠ localhost por padrão (HMR/RSC
  // bloqueado, a tela carrega mas fica sem interação — hidratação nunca
  // completa). Libera os IPs da LAN usados pra abrir `http://<ip>:3000` do
  // celular. Sem efeito em produção (só existe em `next dev`).
  // 01/09 — máquina mudou de IP na LAN (agora .241); sem ele aqui o teste
  // pelo celular volta a travar sem hidratação.
  // 05/09 — IP mudou de novo (.112).
  allowedDevOrigins: [
    "192.168.0.68",
    "192.168.0.67",
    "192.168.0.241",
    "192.168.0.112",
  ],
  // 05/09 — existe um `package-lock.json` órfão em ~/. Sem isso aqui o
  // Turbopack infere a HOME inteira como raiz do workspace (aviso no boot).
  turbopack: {
    root: __dirname,
  },
  // 05/09 — Next 16.2 liga por padrão o cache persistente do Turbopack em dev
  // (`.next/dev/cache/turbopack`). Ele só cresce, nunca compacta: chegou a
  // 3,1 GB em 9 dias e cada boot carregava isso tudo, com a máquina indo pro
  // swap. Desligado: boot a frio um pouco mais lento, mas nada acumula.
  // Se ainda pesar, `npm run dev:restart` limpa o `.next` e sobe de novo.
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
