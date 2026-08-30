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
  allowedDevOrigins: ["192.168.0.68", "192.168.0.67"],
};

export default nextConfig;
