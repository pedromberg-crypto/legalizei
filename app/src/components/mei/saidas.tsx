"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Campo, Texto } from "@/components/ui/form";
import { TelaHeader, Titulo, Rolagem, Rodape } from "@/components/ui/tela";
import { Lottie } from "@/components/lottie";
import { mascaraTelefone } from "./_formato";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AS SAÍDAS DO RAMO MEI — bloqueio do GOVERNO, não do produto.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09 (fork do ramo). O conteúdo nasceu em 28/08 e morava em
 * `lib/dados-saida.tsx`, no template compartilhado com as saídas do ME.
 *
 * ─── POR QUE ELAS SAÍRAM DO TEMPLATE COMPARTILHADO ──────────────────────────
 * Não foi só isolamento: as duas saídas são de NATUREZA diferente das do ME.
 * Lá o bloqueio é do produto ("a gente ainda não atende esse caso") e o
 * desfecho honesto é lista de espera. Aqui quem barra é o Portal do
 * Empreendedor, que cruza o CPF e recusa sozinho — não existe negociação,
 * exceção, nem "vou falar com o time pra ver se abre".
 *
 * O que existe é **caminho alternativo**, e ele é real: a Legalizai atende
 * essas duas pessoas hoje, só não como MEI. Por isso nenhuma das duas termina
 * em waitlist, e as duas terminam oferecendo o ME.
 *
 * ✍️ Tom: azul, nunca vermelho. Vermelho diria "você errou" — e ninguém errou:
 * uma pessoa tem uma empresa, a outra tem um cargo público. Mesma doutrina do
 * template do ME, chegando lá por outro caminho.
 *
 * 🔒 Terminal: `semVoltar` é declarado explicitamente, porque o `TelaHeader`
 * avisa em dev quando uma tela nasce sem saída. Aqui a saída é o CTA, não a
 * seta — voltar pra tela de impedimento significaria "responde de novo, mas
 * agora responde diferente".
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface SaidaMei {
  tag: string;
  titulo: string;
  /** Por que aconteceu, em linguagem de gente. */
  explica: string;
  /** A base legal. No MEI é sempre lei — nunca limite nosso. */
  origem: { rotulo: string; texto: string };
  /** O que ainda é possível. Nenhuma saída termina em beco. */
  saida: string;
  ctaEnviar: string;
  confirmacao: { titulo: string; texto: string };
}

export const SAIDA_JA_TEM_CNPJ: SaidaMei = {
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

export const SAIDA_SERVIDOR: SaidaMei = {
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

export function SaidaMeiView({
  dados,
  onVerMe,
}: {
  dados: SaidaMei;
  /** A alternativa concreta: abrir como ME. É o desfecho, não consolo. */
  onVerMe?: () => void;
}) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [enviado, setEnviado] = useState(false);

  const podeEnviar = nome.trim().length > 1 && telefone.replace(/\D/g, "").length >= 10;

  return (
    <>
      <TelaHeader meta={dados.tag} semVoltar />

      <main className="app-main">
        <Titulo sub={enviado ? dados.confirmacao.texto : dados.explica}>
          {enviado ? dados.confirmacao.titulo : dados.titulo}
        </Titulo>

        <Rolagem className="flex flex-col gap-6">
          <div className="flex justify-center">
            <Lottie
              path="/lottie/alert-legalizai-story-book.json"
              fps={30}
              className="h-[125px] w-[125px]"
            />
          </div>

          {!enviado && (
            <>
              {/* A base legal fica à vista de propósito: sem ela, "não pode"
                  soa como regra da casa. Com ela, a pessoa entende que a gente
                  está do lado dela contra um sistema, não contra ela. */}
              <Card>
                <p className="text-micro text-text-tertiary">{dados.origem.rotulo}</p>
                <p className="text-caption text-text-secondary mt-1">
                  {dados.origem.texto}
                </p>
              </Card>

              <p className="text-body text-text-secondary">{dados.saida}</p>

              <div className="flex flex-col gap-4">
                <Campo rotulo="Seu nome">
                  <Texto valor={nome} onChange={setNome} placeholder="Como te chamam" />
                </Campo>
                <Campo rotulo="Seu WhatsApp">
                  <Texto
                    valor={telefone}
                    onChange={(v) => setTelefone(mascaraTelefone(v))}
                    placeholder="(31) 90000-0000"
                    inputMode="tel"
                    maxLength={15}
                  />
                </Campo>
              </div>
            </>
          )}
        </Rolagem>

        <Rodape>
          {enviado ? (
            <Button full variant="secondary" onClick={onVerMe}>
              Ver como seria em ME
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <Button full disabled={!podeEnviar} onClick={() => setEnviado(true)}>
                {dados.ctaEnviar}
              </Button>
              <Button full variant="ghost" onClick={onVerMe}>
                Ver como seria em ME
              </Button>
            </div>
          )}
        </Rodape>
      </main>
    </>
  );
}
