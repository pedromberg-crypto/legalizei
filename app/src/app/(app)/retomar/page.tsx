"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RetomarCpfView } from "@/components/wizard-cauda";
import { ContaView, type DadosConta } from "@/components/wizard-dinheiro";
import { ehMei } from "@/lib/regime";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * P1 — RETOMAR DE ONDE PAROU · rota de produção (shell APP)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ A TELA vive em `components/wizard-cauda.tsx` (`RetomarCpfView`) desde
 * 29/07. Esta page é o wrapper: liga a navegação.
 *
 * Spec: UX-46 (reorientação ao reabrir) · UX-23 · UX-38. Persona-guarda: `cida`.
 *
 * 🔒 31/08 (reunião Rua Satélite 38-40, pedido do Pedro) — "teremos uma tela
 * única de retorno, que é a E9": depois de confirmar o CPF, SEMPRE manda pra
 * `/aguardando` — não existe mais um "status de retomada" separado
 * (`RetomarView` foi retirada, ver `wizard-cauda.tsx`). A própria
 * `/aguardando` decide o que mostrar (dossiê pendente, boleto, ou já na fase
 * Junta) a partir do progresso salvo. 🔴 MOCK, RF-01 — sem backend real ainda,
 * então essa página só faz a CPF-gate; a ramificação de fase é da tela seguinte.
 * ═══════════════════════════════════════════════════════════════════════════
 */
/**
 * 🆕 04/09 (pedido do Pedro) — O CÓDIGO ENTROU NA REENTRADA (C0.3).
 *
 * Confirmar o CPF abria o processo inteiro de alguém: nome da empresa,
 * endereço, sócios, status de pagamento. CPF não é segredo (circula em
 * cadastro, boleto, recibo), então a porta anterior não era porta. Agora, CPF
 * identifica e o código autentica, com a MESMA tela do E6.1 (`ContaView`,
 * etapa "codigo") reusada nesta posição.
 *
 * 🔴 MOCK, RF-01: sem backend, o código não é conferido e o contato da conta
 * não existe pra ser mostrado. Os campos ficam vazios de propósito, e a tela
 * cai no texto genérico ("pro seu e-mail", "pro seu telefone") em vez de
 * inventar um e-mail que não é da pessoa.
 */
export default function RetomarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mei = ehMei(searchParams);
  const [cpf, setCpf] = useState("");
  /** Deep-link `?etapa=codigo`: é a rota do nó C0.3 no mapa (prévia ao vivo). */
  const [etapa, setEtapa] = useState<"cpf" | "codigo">(
    searchParams.get("etapa") === "codigo" ? "codigo" : "cpf",
  );
  const [dados, setDados] = useState<DadosConta>({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    cep: "",
    numero: "",
    complemento: "",
    coorte: null,
    codigo: "",
  });

  if (etapa === "codigo") {
    return (
      <ContaView
        d={dados}
        set={(k, v) => setDados((p) => ({ ...p, [k]: v }))}
        etapa="codigo"
        /* A tela nasce no código aqui; o passo de form é do E6. */
        onCriarConta={() => {}}
        onConfirmar={() =>
          router.push(mei ? "/aguardando?regime=mei&pago=1" : "/aguardando?pago=1")
        }
        onVoltar={() => setEtapa("cpf")}
        layout="painel"
        mei={mei}
      />
    );
  }

  return (
    <RetomarCpfView
      cpf={cpf}
      setCpf={setCpf}
      onContinuar={() => setEtapa("codigo")}
      onVoltar={() => router.push("/entrada")}
    />
  );
}
