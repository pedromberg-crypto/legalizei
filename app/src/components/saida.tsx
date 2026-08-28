"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CampoMunicipio } from "@/components/campo-municipio";
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
  /**
   * 🆕 04/08 — override pontual do selo azul do topo (ex: Lottie do "Alert").
   * Opcional: sem isso, segue o símbolo padrão (pessoa traçada) de sempre.
   */
  icone?: ReactNode;
  /** O que aconteceu, em linguagem de gente. Vira o título do card. */
  titulo: string;
  /** Por que aconteceu. Uma frase, sem juridiquês. */
  explica: string;
  /** A base: lei ou limite nosso. A distinção muda o tom e é obrigatória. */
  origem: { rotulo: string; texto: string };
  /** O que ainda é possível. Nenhuma saída termina em beco. */
  saida: string;
  /**
   * 🆕 29/07 — etiqueta do MOTIVO, pro lead já chegar classificado no CRM.
   * Uma lista de espera sem motivo é uma lista de e-mails: não dá pra
   * priorizar expansão, nem saber quantos esperam por quê. Opcional — as
   * saídas antigas seguem sem, e nada muda nelas.
   */
  tag?: string;
  /**
   * 🆕 29/07 — pergunta extra específica da saída. Na saída de cidade é QUAL
   * cidade: sem isso a waitlist geográfica não informa pra onde expandir.
   */
  extra?: {
    rotulo: string;
    placeholder: string;
    obrigatorio?: boolean;
    /** `municipio` = autocomplete validado contra a base do IBGE. */
    tipo?: "texto" | "municipio";
  };
  /** CTA do envio. Default "Falar com o time" (saídas que viram atendimento). */
  ctaEnviar?: string;
  /**
   * 🆕 29/07 — copy da confirmação. O default promete "nosso time fala com
   * você em até um dia útil", o que é VERDADE nas saídas de triagem (exterior,
   * 3+ sócios: um humano assume o caso) e MENTIRA numa lista de espera de
   * cidade — lá ninguém vai ligar amanhã, a gente avisa quando abrir. Saída
   * que não promete ligação sobrescreve.
   */
  confirmacao?: {
    titulo: string;
    texto: string;
    /** CTA único (default das saídas antigas). */
    cta?: string;
    /**
     * 🆕 29/07 — várias saídas na confirmação. A tela terminal não pode ser
     * beco: quem entrou na lista de espera continua sendo público, e merece
     * pra onde ir (blog, site) além de poder recomeçar.
     */
    acoes?: {
      label: string;
      variante?: "primary" | "secondary" | "ghost" | "dark";
      onClick?: () => void;
      /** true = destino ainda não existe; a demo mostra, mas avisa. */
      pendente?: boolean;
    }[];
  };
}

export function SaidaView({
  d,
  captura,
}: {
  d: DadosSaida;
  /**
   * 🆕 29/07 — captura CONTROLADA (opcional), mesmo padrão do `VereditoView`.
   * Sem isto a tela segue com o estado interno de sempre. Existe pra a
   * `/apresentacao` conseguir "Preencher automático" sem clonar a tela.
   *
   * 🔴 28/08 (pedido do Pedro) — `nome`/`contato` SAÍRAM daqui. Quem chega
   * numa saída já passou pelo E3.1 (`/dados`, `DadosPessoaisView`), que
   * coleta exatamente nome+e-mail+telefone — pedir de novo repetiria o que a
   * pessoa já digitou. O lead sai daqui já identificado; só falta o `extra`
   * (quando a saída tem uma pergunta própria, tipo cidade).
   */
  captura?: {
    extra: string;
    setExtra: (v: string) => void;
    enviado: boolean;
    setEnviado: (v: boolean) => void;
  };
}) {
  const [extraI, setExtraI] = useState("");
  const [enviadoI, setEnviadoI] = useState(false);
  const extra = captura?.extra ?? extraI;
  const setExtra = captura?.setExtra ?? setExtraI;
  const enviado = captura?.enviado ?? enviadoI;
  const setEnviado = captura?.setEnviado ?? setEnviadoI;
  const podeEnviar = !d.extra?.obrigatorio || extra.trim().length > 1;

  if (enviado) {
    return (
      <>
        <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Frase própria: o default do selo `sucesso` é "Achei o seu
              encaixe", que aqui seria mentira (ninguém encaixou — a pessoa
              entrou numa fila). Ver fix de 29/07 em veredito.tsx. */}
          <Selo tipo="sucesso" frase="Recebemos o seu contato" />
          <Card>
            {d.tag && (
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-state-info-tint px-2.5 py-1 text-micro font-semibold text-state-info-text">
                {d.tag}
              </span>
            )}
            <h2 className="text-h2 mb-1">
              {d.confirmacao?.titulo ?? "Recebemos o seu contato"}
            </h2>
            <p className="text-body text-text-secondary">
              {d.confirmacao?.texto ??
                "Nosso time vai falar com você em até um dia útil, já sabendo do seu caso. Você não vai precisar explicar tudo de novo."}
            </p>
          </Card>
        </div>
        <div className="app-footer-cta">
          {d.confirmacao?.acoes ? (
            <div className="flex flex-col gap-2">
              {d.confirmacao.acoes.map((a) => (
                <Button
                  key={a.label}
                  full
                  variant={a.variante ?? "secondary"}
                  onClick={a.onClick}
                >
                  {a.label}
                </Button>
              ))}
            </div>
          ) : (
            <Button full variant="secondary">
              {d.confirmacao?.cta ?? "Falar agora no WhatsApp"}
            </Button>
          )}
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
        <Selo tipo="humano" simbolo={d.icone} />

        <Card>
          {/* A etiqueta do motivo aparece ANTES do título: quem chega aqui
              precisa entender em 1 segundo que não é erro dele, é escopo. */}
          {d.tag && (
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-state-info-tint px-2.5 py-1 text-micro font-semibold text-state-info-text">
              {d.tag}
            </span>
          )}
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

        {/* CAPTURA — 28/08 (pedido do Pedro): nome/e-mail/telefone SAÍRAM.
            Já vieram do E3.1 e estão salvos no lead; só sobra a pergunta
            própria da saída (`d.extra`), quando ela existe. */}
        <div className="flex flex-col gap-3">
          {d.extra?.tipo === "municipio" ? (
            <CampoMunicipio
              rotulo={d.extra.rotulo}
              placeholder={d.extra.placeholder}
              valor={extra}
              onSelecionar={setExtra}
            />
          ) : (
            d.extra && (
              <CampoSaida
                rotulo={d.extra.rotulo}
                valor={extra}
                onChange={setExtra}
                placeholder={d.extra.placeholder}
              />
            )
          )}
          {/* UX-35: o diferencial em uma linha. Sem isso o handoff é um
              e-mail solto e o cliente recomeça a conversa do zero. */}
          <p className="text-micro text-text-tertiary">
            Já temos seu nome e contato — e o que você já preencheu vai junto,
            pra você não ter que repetir nada. A gente usa isso só pra falar
            do seu caso.
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
          {d.ctaEnviar ?? "Falar com o time"}
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
