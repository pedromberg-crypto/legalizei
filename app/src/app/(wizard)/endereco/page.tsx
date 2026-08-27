"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EnderecoCategoriaView } from "@/components/entrada-lead";
import { ehMei, comRegime } from "@/lib/regime";
import { comEndereco } from "@/lib/endereco";
import { comCategoria } from "@/lib/categoria";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * E3.3 — ENDEREÇO + CATEGORIA · rota de produção (shell WIZARD)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 27/08 — tela NOVA, os 2 gates do produto reunidos antes do dinheiro.
 * Racional completo em `components/entrada-lead.tsx`.
 *
 * ─── O QUE ELA SUBSTITUI ───────────────────────────────────────────────────
 * · **E4 (gate de cidade)**, REMOVIDO: perguntava "é em BH?" e acreditava no
 *   clique. Aqui o CEP valida de verdade (`ehCepBh`).
 * · A escolha "endereço próprio × fiscal Legalizai", que morava no E5F (Faixa)
 *   desde 26/08.
 * · O papel de GATE DE ELEGIBILIDADE que era do veredito de CNAE (E5V): a
 *   categoria só lista o que a gente atende, então ela filtra aqui e o CNAE
 *   pode ir pra depois do pagamento (`/dossie/atividade`).
 *
 * Só chega aqui quem é **ME abrindo**: MEI não tem limite geográfico (pula
 * direto pro `/gate`), e Migrar não abre endereço novo (a empresa já existe).
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function EnderecoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mei = ehMei(searchParams);

  const [enderecoProprio, setEnderecoProprio] = useState<boolean | null>(null);
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);

  return (
    <EnderecoCategoriaView
      enderecoProprio={enderecoProprio}
      setEnderecoProprio={setEnderecoProprio}
      cep={cep}
      setCep={setCep}
      numero={numero}
      setNumero={setNumero}
      categoria={categoria}
      setCategoria={setCategoria}
      // Os 3 flags que atravessam o wizard viajam por querystring (RF-01):
      // regime (MEI×ME), endereço fiscal (soma no preço do E7) e categoria
      // (alimenta a busca de CNAE lá no /dossie/atividade, pós-pagamento).
      onSeguir={() =>
        router.push(
          comCategoria(
            comEndereco(comRegime("/gate", mei), enderecoProprio === false),
            categoria,
          ),
        )
      }
      // Não achou a atividade na lista: waitlist captura o contato em vez de
      // fechar a porta. É a única saída de "não atendo" que sobra no caminho
      // abrir, e ela acontece ANTES de qualquer cobrança.
      onForaDeEscopo={() => router.push("/veredito/waitlist")}
      onVoltar={() => router.push("/entrada?intencao=abrir")}
    />
  );
}
