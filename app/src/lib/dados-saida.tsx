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

/* 🗑️ 07/09 — AS 2 SAÍDAS DO RAMO MEI SAÍRAM DAQUI (mudaram de casa, não
   foram descartadas): `DADOS_SAIDA_MEI_OUTRA_EMPRESA` e
   `DADOS_SAIDA_MEI_SERVIDOR` viraram `SAIDA_JA_TEM_CNPJ` e `SAIDA_SERVIDOR`
   em `components/mei/saidas.tsx`, com view própria.

   O comentário que morava aqui já dizia o motivo sem tirar a consequência:
   estas 2 são de NATUREZA diferente das saídas do ME. Lá o bloqueio é do
   PRODUTO e o desfecho honesto é lista de espera; aqui quem barra é o Portal
   do Empreendedor, e o desfecho é caminho alternativo real (baixar a empresa
   antiga, ou abrir como ME). Duas coisas diferentes não deviam dividir um
   template — e não dividem mais. */

/**
 * 🔄 02/09 — saiu da page (`(wizard)/saida/regime-nao-suportado`) pro lib:
 * a `/apresentacao` precisa dos MESMOS dados pra renderizar a tela real, e
 * essa era uma das 2 telas do mapa que a demo não sabia mostrar (auditoria de
 * nomes, 02/09).
 */
export const DADOS_SAIDA_REGIME: DadosSaida = {
  // 🆕 04/08 — teste do Pedro: ícone "Alert" (Lottie) recolorido pro nosso
  // azul de status (#3B82E0), no lugar do símbolo padrão de pessoa. Escopo
  // pontual: só esta saída e `/saida/cnpj-inapto` por enquanto.
  icone: <Lottie path="/lottie/alert-legalizai-story-book.json" fps={30} className="h-[125px] w-[125px]" />,
  tag: "Regime diferente",
  titulo: "Seu regime pede um especialista",
  explica:
    "A gente atende empresas no Simples Nacional (ME) e MEI. Lucro Presumido tem um cálculo de imposto próprio (IRPJ, CSLL, PIS/COFINS e ISS separados), então esse caso a gente resolve com uma pessoa da equipe falando direto com você, não pelo automático do app.",
  origem: {
    rotulo: "Por que fala com humano",
    texto:
      "Lucro Presumido não segue Anexo nem Fator R do Simples: é outro cálculo, com outras regras. Prefere te colocar direto com quem entende disso do que te jogar num formulário genérico.",
  },
  saida: "Deixa seu contato que um especialista da nossa equipe fala com você.",
  ctaEnviar: "Falar com especialista",
  confirmacao: {
    titulo: "Recebemos seu contato",
    texto:
      "Um especialista da nossa equipe entra em contato pra entender seu caso e ver como te ajudar.",
  },
};
