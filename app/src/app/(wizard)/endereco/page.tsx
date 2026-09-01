"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EnderecoCategoriaView } from "@/components/entrada-lead";
import { ehMei, comRegime } from "@/lib/regime";
import { comEndereco } from "@/lib/endereco";
import { comCategoria } from "@/lib/categoria";
import { salvarRascunhoEndereco, limparRascunhoEndereco } from "@/lib/rascunho";

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
  /**
   * 🆕 31/08 (pedido do Pedro) — `?simular=fora-bh` PRÉ-PREENCHE o estado pra
   * já nascer no gate "CEP fora de BH" (E3.4.1). Existe só pra prévia ao vivo
   * do `/mapa` (`components/mapa/tela-node.tsx`, iframe sem jeito de simular
   * digitação) — não é fluxo real, não navega por aqui em produção.
   */
  const simulaForaBh = searchParams.get("simular") === "fora-bh";

  const [enderecoProprio, setEnderecoProprio] = useState<boolean | null>(
    simulaForaBh ? true : null,
  );
  const [cep, setCep] = useState(simulaForaBh ? "39560-000" : "");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  // 🆕 01/09 — tipo de imóvel + residência subiram do C4 (ver o comentário na
  // prop `tipoImovel` de `EnderecoCategoriaView`).
  const [tipoImovel, setTipoImovel] = useState("");
  const [resideNoEndereco, setResideNoEndereco] = useState<boolean | null>(null);
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
      tipoImovel={tipoImovel}
      setTipoImovel={setTipoImovel}
      resideNoEndereco={resideNoEndereco}
      setResideNoEndereco={setResideNoEndereco}
      categoria={categoria}
      setCategoria={setCategoria}
      // 🆕 28/08 — MEI não tem limite de cidade, mas tem limite de atividade.
      exigeBh={!mei}
      regimeMei={mei}
      simularFilaCidade={simulaForaBh}
      // Categoria sem ocupação de MEI: reentra no MESMO passo como ME (perde
      // o `?regime=mei`), preservando o que ela já preencheu de endereço.
      onTrocarParaMe={() => router.push("/endereco")}
      // Os 3 flags que atravessam o wizard viajam por querystring (RF-01):
      // regime (MEI×ME), endereço fiscal (soma no preço do E7) e categoria
      // (alimenta a busca de CNAE lá no /dossie/atividade, pós-pagamento).
      onSeguir={() => {
        // 🆕 01/09 (pedido do Pedro) — o endereço respondido aqui atravessa o
        // flow e chega PREENCHIDO no C4: a pessoa completa o que falta (IPTU,
        // tipo de imóvel, residência), não redigita o que já disse. Vai por
        // `sessionStorage`, não por querystring — endereço é dado pessoal
        // (mesma regra do RF-01 que tirou nome/CPF/telefone da URL).
        if (enderecoProprio) {
          salvarRascunhoEndereco({ cep, numero, complemento, tipoImovel, resideNoEndereco });
        } else {
          // Escolheu o endereço fiscal da Legalizai: não existe endereço
          // próprio pra lembrar, e um rascunho velho (de quem voltou e trocou
          // a resposta) precisa sumir.
          limparRascunhoEndereco();
        }
        router.push(
          comCategoria(
            comEndereco(comRegime("/gate", mei), enderecoProprio === false),
            categoria,
          ),
        );
      }}
      onVoltar={() => router.push(comRegime("/entrada?intencao=abrir", mei))}
    />
  );
}
