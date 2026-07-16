import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O badge flutuante do dev tools sobrepõe o CTA do rodapé (thumb zone),
  // que é justamente o que precisamos avaliar em mobile.
  devIndicators: false,
};

export default nextConfig;
