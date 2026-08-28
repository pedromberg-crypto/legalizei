"use client";

import type { DadosSaida } from "@/components/saida";
import { Lottie } from "@/components/lottie";

/**
 * Conteúdo das telas de saída fora do veredito (E4.1 fora-BH · E5.4 exterior
 * · E5.5 5+ sócios · E5.6 sócio PJ) — FONTE ÚNICA usada pelas rotas reais
 * (`/saida/*`) e pela `/apresentacao`. Só o CONTEÚDO mora aqui; as `acoes` da
 * confirmação (que variam por contexto — a rota real navega de verdade, a
 * demo reinicia o snapshot) continuam montadas no lugar que consome.
 */

export const DADOS_SAIDA_FORA_BH: DadosSaida = {
  // 🆕 04/08 — mesmo ícone "Alert" (Lottie) recolorido pro nosso azul de
  // status, no lugar do símbolo padrão de pessoa.
  icone: <Lottie path="/lottie/alert-legalizai-story-book.json" fps={30} className="h-[125px] w-[125px]" />,
  tag: "Outra cidade",
  titulo: "Por enquanto, só abrimos em Belo Horizonte",
  explica:
    "Estamos testando o produto com foco total numa cidade antes de expandir. Hoje só abrimos empresa em Belo Horizonte/MG.",
  origem: {
    rotulo: "Por que só BH",
    texto:
      "É a fase de testes (MLP) do produto. Preferimos fazer bem para uma cidade antes de abrir para mais.",
  },
  saida:
    "Entra na lista de espera que a gente te avisa assim que abrir na sua cidade. Você é o primeiro a saber.",
  extra: {
    rotulo: "Qual a sua cidade?",
    placeholder: "Comece a digitar: Uberl…",
    obrigatorio: true,
    tipo: "municipio",
  },
  ctaEnviar: "Me avisem quando chegarem aqui",
  confirmacao: {
    titulo: "Você está na nossa lista especial",
    texto:
      "A gente te avisa assim que expandir as operações pra sua cidade. Enquanto isso, acompanha a gente por aqui: é onde a gente explica imposto sem contabilês.",
  },
};

export const DADOS_SAIDA_EXTERIOR: DadosSaida = {
  titulo: "Com sócio morando fora, o caminho é outro",
  explica:
    "A sua empresa pode existir normalmente. O que a lei não permite é ela entrar no Simples Nacional, que é o regime em que a gente abre empresa aqui pelo app.",
  origem: {
    rotulo: "De onde vem essa regra",
    texto:
      "Lei Complementar 123, artigo 17: empresa com sócio que mora no exterior não pode optar pelo Simples Nacional.",
  },
  saida:
    "Existem outros regimes que atendem o seu caso, e o nosso time contábil faz esse tipo de abertura fora do app. Quer conversar com eles?",
};

export const DADOS_SAIDA_SOCIOS: DadosSaida = {
  titulo: "Com cinco ou mais sócios, ainda não pelo app",
  explica:
    "Não tem nada de errado com a sua sociedade, e a lei permite. É o nosso app que hoje abre empresa com no máximo quatro sócios.",
  origem: {
    rotulo: "De onde vem esse limite",
    texto:
      "É uma escolha nossa, não uma regra do governo. A cada sócio a mais mudam as assinaturas e o contrato, e a gente preferiu fazer bem até quatro antes de abrir para mais.",
  },
  saida:
    "O escritório que está por trás do app faz esse tipo de abertura todo dia, fora do aplicativo. Quer que a gente te apresente?",
};

/**
 * 🆕 24/08 (reunião Leonan 19/08 + pedido do Pedro) — sócio pessoa jurídica
 * tira a empresa do Simples Nacional (regra fiscal: contrato social com sócio
 * PJ vai automático pro Presumido ou Real). Hoje o produto só atende Simples
 * (Lucro Presumido segue fora do MVP), então esse caso vira atendimento
 * interno em vez de deixar a pessoa avançar e travar mais na frente.
 */
export const DADOS_SAIDA_SOCIO_PJ: DadosSaida = {
  titulo: "Com sócio pessoa jurídica, ainda não pelo app",
  explica:
    "Sócio CNPJ tira a empresa do Simples Nacional assim que o contrato social é registrado — ela vai automático pro Lucro Presumido ou Real. Hoje o nosso produto só atende empresas no Simples.",
  origem: {
    rotulo: "De onde vem essa regra",
    texto:
      "É regra fiscal, não escolha nossa: empresa com sócio pessoa jurídica não pode optar pelo Simples Nacional.",
  },
  saida:
    "O escritório que está por trás do app atende Lucro Presumido todo dia, fora do aplicativo. Quer que a gente te apresente?",
};

/**
 * 🆕 26/08 (fonte: `/saida/cnpj-inapto/page.tsx`, 04/08) — nasce do M1
 * (`/migrar/cnpj`, `MigrarCnpjView`'s `onSaidaInapto`). Situação cadastral ≠
 * ativa: a Receita nem reconhece a empresa como ativa, então a regularização
 * vem ANTES de qualquer migração. Diferente das 3 saídas acima, a rota real
 * TEM formulário de captura (nome+contato) — trazido junto pra fidelidade.
 */
export const DADOS_SAIDA_CNPJ_INAPTO: DadosSaida = {
  icone: <Lottie path="/lottie/alert-legalizai-story-book.json" fps={30} className="h-[125px] w-[125px]" />,
  tag: "CNPJ irregular",
  titulo: "Essa empresa precisa regularizar antes de migrar",
  explica:
    "A Receita mostra sua empresa com situação diferente de ativa (suspensa, inapta ou baixada). A gente não consegue assumir a contabilidade nesse estado, a regularização vem primeiro.",
  origem: {
    rotulo: "Por que isso trava a migração",
    texto:
      "Sem situação ativa na Receita não dá pra fazer a transferência de responsabilidade nem declarar nada em nome da empresa. É exigência dos próprios órgãos, não nossa.",
  },
  saida:
    "Deixa seu contato que a gente te ajuda a entender o que falta pra regularizar. Depois de ativa de novo, a migração segue normal.",
  ctaEnviar: "Quero ajuda pra regularizar",
  confirmacao: {
    titulo: "Recebemos seu contato",
    texto:
      "Nosso time entra em contato pra entender o que está pendente na sua empresa e como regularizar. Assim que resolver, você volta e migra com a gente.",
  },
};

/* ═══════════════════ SAÍDAS DO RAMO MEI (M-T · impedimento) ══════════════ */

/**
 * 🆕 28/08 — as 2 saídas do `ImpedimentoView` (M-T, `components/mei-telas.tsx`).
 *
 * ⚠️ Elas são de natureza diferente das saídas de triagem do ME. Lá o bloqueio
 * é do PRODUTO ("a gente ainda não atende esse caso"). Aqui é do GOVERNO: o
 * Portal do Empreendedor cruza o CPF e barra sozinho. Não existe negociação,
 * exceção nem "vou falar com o time" — o que existe é caminho alternativo.
 *
 * Por isso as duas terminam oferecendo o ME, que é solução de verdade, e não
 * lista de espera: a Legalizai atende essas pessoas hoje, só não como MEI.
 *
 * Fonte: `pesquisa/abertura-mei/abertura-mei-processo.md` §Elegibilidade.
 */
export const DADOS_SAIDA_MEI_OUTRA_EMPRESA: DadosSaida = {
  icone: <Lottie path="/lottie/alert-legalizai-story-book.json" fps={30} className="h-[125px] w-[125px]" />,
  tag: "MEI · já tem CNPJ",
  titulo: "Com outra empresa no seu nome, o MEI não sai",
  explica:
    "Quem já é sócio, titular ou administrador de uma empresa ativa não pode abrir MEI. Vale até pra empresa parada que nunca foi baixada, e pra outro MEI.",
  origem: {
    rotulo: "De onde vem essa regra",
    texto:
      "É a LC 123, art. 18-A. A Receita Federal cruza o seu CPF no momento do registro e barra automaticamente, dentro do próprio Portal do Empreendedor.",
  },
  saida:
    "Tem dois caminhos, e os dois a gente faz: dar baixa na empresa antiga, ou abrir a nova como ME no Simples Nacional. Deixa seu contato que a gente te mostra qual compensa no seu caso.",
  ctaEnviar: "Quero entender meu caso",
  confirmacao: {
    titulo: "Recebemos seu contato",
    texto:
      "Nosso time vai olhar a situação da empresa que já está no seu nome e te dizer o que faz mais sentido: baixar aquela ou abrir esta como ME.",
  },
};

export const DADOS_SAIDA_MEI_SERVIDOR: DadosSaida = {
  icone: <Lottie path="/lottie/alert-legalizai-story-book.json" fps={30} className="h-[125px] w-[125px]" />,
  tag: "MEI · servidor federal",
  titulo: "Servidor público federal não pode ser MEI",
  explica:
    "A vedação vale pra quem está na ativa no serviço público federal. Servidor estadual ou municipal depende do estatuto de cada um, e aí a regra pode ser outra.",
  origem: {
    rotulo: "De onde vem essa regra",
    texto:
      "É o art. 117 da Lei 8.112/90, que proíbe o servidor federal de participar de gerência ou administração de empresa. O Portal do Empreendedor bloqueia no ato do registro.",
  },
  saida:
    "Se você é estadual ou municipal, vale conferir o seu estatuto antes de descartar: em muitos casos é permitido. Deixa seu contato que a gente confere junto com você.",
  ctaEnviar: "Quero conferir meu caso",
  confirmacao: {
    titulo: "Recebemos seu contato",
    texto:
      "Nosso time vai te ajudar a ler o que o seu estatuto permite. Se houver caminho, a gente segue daí.",
  },
};
