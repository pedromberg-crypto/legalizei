/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MÁSCARAS E FORMATOS DO RAMO MEI.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09.
 *
 * ⚠️ ISTO É UMA CÓPIA, E É DE PROPÓSITO — mas com data de validade.
 *
 * As mesmas 4 máscaras existem em `components/wizard-dinheiro.tsx`, que é
 * tela de ME. O ramo MEI não importa tela de ME (trava
 * `verificar-fronteira-mei.mjs`), e o pedido do Pedro em 07/09 foi explícito:
 * *"se certifique desde agora que não vamos alterar em nada as telas de ME"*.
 * Promover as máscaras pra `lib/` agora exigiria editar o `wizard-dinheiro`
 * pra re-exportar — mudança inofensiva, mas mudança.
 *
 * O risco de as duas cópias divergirem é praticamente zero: são funções puras
 * de formatação, sem nenhuma decisão de produto dentro (CPF tem 11 dígitos em
 * qualquer regime). Ainda assim, a dívida fica registrada:
 *
 * 📌 **Quando alguém for mexer no `wizard-dinheiro.tsx` por outro motivo**,
 *    promova as 4 pra `lib/mascaras.ts` e faça os dois lados importarem de lá.
 *    É o mesmo caminho que o `ui/tela.tsx` percorreu em 19/07 (regra dos 3).
 * ═══════════════════════════════════════════════════════════════════════════
 */

export function mascaraCpf(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function mascaraTelefone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

export function mascaraData(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2}\/\d{2})(\d{1,4})$/, "$1/$2");
}

export function mascaraCep(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.replace(/(\d{5})(\d)/, "$1-$2");
}

/** Reais em pt-BR, sem casas quando o valor é redondo. */
export function reais(v: number) {
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: Number.isInteger(v) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export interface EnderecoCep {
  logradouro: string;
  bairro: string;
  municipio: string;
  uf: string;
}

/**
 * 🚧 Mock do autofill por CEP — sem API real ainda, igual ao caminho ME.
 *
 * ⚠️ A diferença que importa: aqui o município NÃO é gate. O ME só atende BH
 * (JUCEMG + prefeitura); o MEI registra pela Redesim e a gente presta o
 * serviço contábil de qualquer lugar. Por isso o mock devolve cidades
 * diferentes sem que nenhuma delas signifique "não atendo".
 */
export function buscarCep(cepDigitos: string): EnderecoCep | null {
  if (cepDigitos.length !== 8) return null;
  if (cepDigitos === "39560000") {
    return { logradouro: "Rua Comércio", bairro: "Centro", municipio: "Salinas", uf: "MG" };
  }
  return {
    logradouro: "Rua dos Timbiras",
    bairro: "Funcionários",
    municipio: "Belo Horizonte",
    uf: "MG",
  };
}
