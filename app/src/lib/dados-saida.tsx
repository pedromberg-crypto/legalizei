"use client";

import type { DadosSaida } from "@/components/saida";
import { Lottie } from "@/components/lottie";

/**
 * Conteúdo das 3 telas de saída fora do veredito (E4.1 fora-BH · E5.4 exterior
 * · E5.5 3+ sócios) — FONTE ÚNICA usada pelas rotas reais (`/saida/*`) e pela
 * `/apresentacao`. Só o CONTEÚDO mora aqui; as `acoes` da confirmação (que
 * variam por contexto — a rota real navega de verdade, a demo reinicia o
 * snapshot) continuam montadas no lugar que consome.
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
  titulo: "Com três ou mais sócios, ainda não pelo app",
  explica:
    "Não tem nada de errado com a sua sociedade, e a lei permite. É o nosso app que hoje abre empresa com no máximo dois sócios.",
  origem: {
    rotulo: "De onde vem esse limite",
    texto:
      "É uma escolha nossa, não uma regra do governo. A cada sócio a mais mudam as assinaturas e o contrato, e a gente preferiu fazer bem para dois antes de abrir para mais.",
  },
  saida:
    "O escritório que está por trás do app faz esse tipo de abertura todo dia, fora do aplicativo. Quer que a gente te apresente?",
};
