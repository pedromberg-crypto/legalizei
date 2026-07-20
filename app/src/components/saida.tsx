"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Selo } from "@/components/veredito";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * A9 — SAÍDA GRACIOSA · o template das saídas terminais · shell WIZARD
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: design-system.md §A9 · mapa-ramificacoes-flow (Tipo A) · UX-07 · UX-09
 * · UX-35 (handoff com dossiê) · UX-22 (dar o "enquanto isso").
 *
 * ─── UM TEMPLATE, QUATRO SAÍDAS ──────────────────────────────────────────
 * O mapa lista 5 saídas terminais; a 1ª (login) é rota feliz e vive fora. As
 * outras 4 seguem a mesma sequência: **barra · explica · captura · roteia**.
 *   · 🟡 waitlist e 🔴 comercial → já construídas, dentro do `VereditoView`
 *     (nascem do CNAE, então mostram a atividade na Receita).
 *   · sócio no exterior e 3+ sócios → **aqui**. Nascem da triagem do N4, não
 *     do CNAE: não há atividade pra exibir, e o motivo é outro.
 *
 * ─── A REGRA QUE MANDA: BLOQUEIO QUE EDUCA, NÃO QUE PUNE ─────────────────
 * Ninguém sai daqui achando que fez algo errado. As duas saídas existem por
 * motivos que **não são falha do cliente**: uma é a lei, a outra é limite
 * nosso. Por isso as duas usam o selo `humano` (azul), e não `danger`.
 *
 * ⚠️ Isso contraria uma nota que eu mesmo deixei no `veredito.tsx` ("danger
 * fica reservado pro que de fato barra: exterior, 3+ sócios"). Mudei de ideia
 * ao escrever a copy, por dois motivos:
 *   1. No caso dos 3 sócios o limite é NOSSO. Vermelho culparia o cliente por
 *      uma escolha de produto que ele não tomou.
 *   2. No exterior a empresa continua possível — só não no Simples, e não por
 *      este app. Vermelho anunciaria um fim que não existe.
 * Precedente já aplicado 3x nesta sessão: o 🔴 do veredito também usa info,
 * porque o desfecho é "nosso time resolve", não "você falhou".
 *
 * ─── UX-35 · O DOSSIÊ VAI JUNTO ─────────────────────────────────────────
 * Todo bloqueio entrega pro humano **o que já foi preenchido**, não só um
 * e-mail. Quem não encaixou no produto vira lead quente com contexto, e o
 * cliente não repete de boca o que já digitou.
 *
 * 🟡 **UX-42 fica de fora de propósito.** A ideia de modelar a alternativa
 * ("Lucro Presumido custaria Y", "2+1 sócios funcionaria assim") exige decisão
 * de Mauro/Larissa sobre servir esses casos e a que preço. Cotar por conta
 * própria seria número sem fonte na tela mais sensível do flow.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface DadosSaida {
  /** O que aconteceu, em linguagem de gente. Vira o título do card. */
  titulo: string;
  /** Por que aconteceu. Uma frase, sem juridiquês. */
  explica: string;
  /** A base: lei ou limite nosso. A distinção muda o tom e é obrigatória. */
  origem: { rotulo: string; texto: string };
  /** O que ainda é possível. Nenhuma saída termina em beco. */
  saida: string;
}

export function SaidaView({ d }: { d: DadosSaida }) {
  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [enviado, setEnviado] = useState(false);
  const podeEnviar = nome.trim().length > 1 && contato.trim().length > 5;

  if (enviado) {
    return (
      <>
        <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Selo tipo="humano" />
          <Card>
            <h2 className="text-h2 mb-1">Recebemos o seu contato</h2>
            <p className="text-body text-text-secondary">
              Nosso time vai falar com você em até um dia útil, já sabendo do
              seu caso. Você não vai precisar explicar tudo de novo.
            </p>
          </Card>
        </div>
        <div className="app-footer-cta">
          <Button full variant="secondary">
            Falar agora no WhatsApp
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* BARRA — o selo. Mesmo componente do veredito: quem chega aqui pode
            ter visto aquela tela minutos antes, e dois vocabulários visuais
            pro mesmo tipo de desfecho fariam parecer erro do app. */}
        <Selo tipo="humano" />

        <Card>
          <h2 className="text-h2 mb-1">{d.titulo}</h2>
          <p className="text-body text-text-secondary mb-4">{d.explica}</p>
          {/* EXPLICA — a origem separada do resto, porque "a lei impede" e "a
              gente ainda não faz" são coisas diferentes e o cliente merece
              saber qual das duas é. */}
          <div className="pt-3 border-t border-border-hairline">
            <p className="text-micro text-text-tertiary mb-0.5">
              {d.origem.rotulo}
            </p>
            <p className="text-caption text-text-secondary">{d.origem.texto}</p>
          </div>
        </Card>

        {/* ROTEIA — o "enquanto isso" do UX-22: nenhuma saída é beco. */}
        <p className="text-body text-text-secondary mt-4 mb-4">{d.saida}</p>

        {/* CAPTURA — 2 campos, sem conta e sem senha. Quem foi barrado não vai
            criar login pra ser atendido. */}
        <div className="flex flex-col gap-3">
          <CampoSaida
            rotulo="Seu nome"
            valor={nome}
            onChange={setNome}
            placeholder="Como a gente te chama"
          />
          <CampoSaida
            rotulo="WhatsApp ou e-mail"
            valor={contato}
            onChange={setContato}
            placeholder="(31) 90000-0000"
          />
          {/* UX-35: o diferencial em uma linha. Sem isso o handoff é um
              e-mail solto e o cliente recomeça a conversa do zero. */}
          <p className="text-micro text-text-tertiary">
            O que você já preencheu vai junto, pra você não ter que repetir
            nada. A gente usa isso só pra falar do seu caso.
          </p>
        </div>
      </div>

      <div className="app-footer-cta">
        <Button
          full
          variant="dark"
          disabled={!podeEnviar}
          onClick={() => setEnviado(true)}
        >
          Falar com o time
        </Button>
      </div>
    </>
  );
}

/** Campo mínimo das telas de saída. Local: não é o form do dossiê. */
function CampoSaida({
  rotulo,
  valor,
  onChange,
  placeholder,
}: {
  rotulo: string;
  valor: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-caption font-semibold text-text-primary">
        {rotulo}
      </span>
      <input
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full min-h-12 rounded-md border border-border-hairline
                   bg-surface-card px-3 text-body text-text-primary
                   placeholder:text-text-muted focus:border-border-focus
                   focus:outline-none"
      />
    </label>
  );
}
