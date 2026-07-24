"use client";

import {
  Saudacao,
  SearchServico,
  CategoriaChips,
  SuaSituacao,
  IndiqueGanhe,
} from "@/components/lab/ref7-blocks";
import { BlogCarousel } from "@/components/lab/ref5-blocks";
import { Vigilancia } from "@/components/lab/vigilancia-blocks";

/**
 * HOME FINAL · Versão F — "Descobrir & cuidar" (hub-led, ref7+5).
 * A home como hub acolhedor: saudação → busca → chips de categoria → vigília →
 * você está em dia → indique e ganhe → aprenda. Descoberta + relacionamento.
 * Mesclagem nova dos campeões (só visualização).
 */
export default function HomeFPage() {
  return (
    <main className="app-main">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-6 pb-[calc(100px+var(--safe-bottom))] pt-3">
            <Saudacao />
            <SearchServico />
            <CategoriaChips />
            <Vigilancia />
            <SuaSituacao />
            <IndiqueGanhe />
            <BlogCarousel />
          </div>
        </div>
    </main>
  );
}
