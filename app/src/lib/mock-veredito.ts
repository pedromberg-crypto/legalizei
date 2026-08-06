import type { Resultado } from "@/components/veredito";

/**
 * Mock do b1.mapeamento (IA dublada) — FONTE ÚNICA, usada por `/gate`
 * (produção) e `/apresentacao` (demo). Antes cada um tinha a própria cópia
 * e elas divergiram em silêncio (2 achados 06/08: travessão sobrevivendo
 * só na cópia da demo). A tela testa a LÓGICA do fluxo, não a IA real.
 */
export function mapear(texto: string): Resultado {
  const t = texto.toLowerCase();
  if (/nutri|dentist|médic|medic|advog|arquitet|psicó|psico/.test(t)) {
    return {
      humano: "Atividade regulamentada",
      explica: "Sua área precisa de responsável técnico registrado no conselho.",
      cnae: "8650-0/02",
      veredito: "waitlist",
    };
  }
  if (/fazenda|gado|agropecu|planta[çc]|colheita|min[ée]rio|extra[çc][ãa]o|pesca/.test(t)) {
    return {
      humano: "Atividade fora do nosso escopo",
      explica:
        "Esse tipo de atividade não é regulamentado nem é comércio, mas também não é algo que a gente ou nosso parceiro atenda.",
      cnae: "0000-0/00",
      veredito: "nao-atende",
      motivo: "descarta",
    };
  }
  if (/loja|revend|estoque|vend[oa] produto|comérci|comerci|restaurante/.test(t)) {
    return {
      humano: "Comércio",
      explica: "Você vende produtos, não serviço.",
      cnae: "4713-0/02",
      veredito: "nao-atende",
      motivo: "mauro",
    };
  }
  // Dados reais do 6201-5/02 (contabilizei-cnae-completo.json + CONCLA/IBGE).
  // As `vizinhas` fazem DUAS coisas: guarda-corpo do falso-🟢 (quem tem outra
  // atividade PRINCIPAL se corrige aqui, antes do pagamento) e porta de entrada
  // dos CNAEs secundários (quem faz as duas coisas descobre que cabe).
  return {
    humano: "Criação de sites e web design",
    explica: "Você entrega sites e presença digital pra outras empresas.",
    cnae: "6201-5/02",
    veredito: "atende",
    compreende: [
      "Criar e desenvolver sites, páginas e portais na internet",
      "Desenhar a interface (o visual e a navegação) desses sites",
    ],
    vizinhas: [
      { oque: "Sistema sob medida, customizável", cnae: "6202-3/00", comoSecundaria: "mesmo-imposto" },
      { oque: "Software pronto, de prateleira", cnae: "6203-1/00", comoSecundaria: "mesmo-imposto" },
      { oque: "Consultoria em tecnologia", cnae: "6204-0/00", comoSecundaria: "mesmo-imposto" },
      { oque: "Design gráfico (logo, material impresso)", cnae: "7410-2/99", comoSecundaria: "mesmo-imposto" },
    ],
    fiscal: { entradas: [6, 15.5], dependeProLabore: true },
  };
}
