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
 * Migrar não passa por aqui (a empresa já existe, com endereço próprio).
 *
 * ─── 🆕 28/08 — O MEI TAMBÉM PASSA, com 2 diferenças ───────────────────────
 * · **Sem gate de BH** (`exigeBh={false}`): a Legalizai abre MEI do Brasil
 *   inteiro. Só o ME tem o limite geográfico do MLP.
 * · **Com gate de categoria** (`regimeMei`): 3 das 14 categorias não existem
 *   como MEI (tecnologia, design e consultoria são profissão intelectual, art.
 *   966 do CC). Elas continuam na lista, marcadas, e quem escolhe uma delas
 *   ganha a explicação real e a porta pro ME — em vez de sumirem da lista e
 *   parecer que a gente não atende a atividade.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function EnderecoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mei = ehMei(searchParams);

  const [enderecoProprio, setEnderecoProprio] = useState<boolean | null>(null);
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);

  return (
    <EnderecoCategoriaView
      enderecoProprio={enderecoProprio}
      setEnderecoProprio={setEnderecoProprio}
      cep={cep}
      setCep={setCep}
      numero={numero}
      setNumero={setNumero}
      complemento={complemento}
      setComplemento={setComplemento}
      categoria={categoria}
      setCategoria={setCategoria}
      // 🆕 28/08 — MEI não tem limite de cidade, mas tem limite de atividade.
      exigeBh={!mei}
      regimeMei={mei}
      // Categoria sem ocupação de MEI: reentra no MESMO passo como ME (perde
      // o `?regime=mei`), preservando o que ela já preencheu de endereço.
      onTrocarParaMe={() => router.push("/endereco")}
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
      onVoltar={() => router.push(comRegime("/entrada?intencao=abrir", mei))}
    />
  );
}
