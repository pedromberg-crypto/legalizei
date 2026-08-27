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
    // 🆕 26/08 (achado do Pedro: "outras opções compatíveis" ficava com card
    // pobre ao promover — sem descrição, sem "o que cobre") — `descricao`/
    // `cobre` de cada vizinha, mesmo padrão de fidelidade do 6201-5/02 acima
    // (CONCLA/IBGE). 🟡 Não ratificado em fonte primária linha a linha —
    // mesma régua de confiança do resto deste mock.
    vizinhas: [
      {
        oque: "Sistema sob medida, customizável",
        cnae: "6202-3/00",
        comoSecundaria: "mesmo-imposto",
        descricao: "Você desenvolve sistemas sob encomenda, feitos do jeito que o cliente pede.",
        cobre: [
          "Criar sistemas customizados pra necessidade específica de cada cliente",
          "Adaptar e configurar o sistema conforme o negócio do cliente muda",
        ],
      },
      {
        oque: "Software pronto, de prateleira",
        cnae: "6203-1/00",
        comoSecundaria: "mesmo-imposto",
        descricao: "Você cria e vende programas prontos, do jeito que estão, sem sob medida.",
        cobre: [
          "Desenvolver programas padronizados, iguais pra todo mundo que compra",
          "Licenciar o uso do software, sem customização por cliente",
        ],
      },
      {
        oque: "Consultoria em tecnologia",
        cnae: "6204-0/00",
        comoSecundaria: "mesmo-imposto",
        descricao: "Você orienta empresas sobre qual solução de tecnologia usar, sem construir o sistema.",
        cobre: [
          "Analisar e planejar qual solução de TI faz sentido pro cliente",
          "Assessorar projetos de tecnologia, sem entregar o código pronto",
        ],
      },
      {
        oque: "Design gráfico (logo, material impresso)",
        cnae: "7410-2/99",
        comoSecundaria: "mesmo-imposto",
        descricao: "Você cria identidade visual e peças gráficas, sem entrar em sites ou sistemas.",
        cobre: [
          "Criar logo, papelaria e identidade visual da marca",
          "Desenvolver peças gráficas pra divulgação, impressa ou digital",
        ],
      },
    ],
    fiscal: { entradas: [6, 15.5], dependeProLabore: true },
  };
}
