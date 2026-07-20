"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape } from "@/components/ui/tela";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N8 — ACEITE DO CONTRATO · arquétipo A6 (Aceite) · shell WIZARD
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: spec-telas-b3-b4-aterrissagem.md → Tela 18, **METADE** dela.
 *
 * ─── ⚠️ O T18 RACHOU EM DOIS, E ESTA TELA É SÓ A PRIMEIRA METADE ──────────
 * Decisão travada 16/07 (reordenacao-flow §3). Os dois atos estavam colados
 * por acidente de ordenação, e a natureza jurídica deles é oposta:
 *
 *   · **Aceite do contrato de serviço** → AQUI (N8). O cliente vira cliente.
 *     **Reversível.** O CDC art. 49 (arrependimento em 7 dias) vale limpo,
 *     porque nada foi executado ainda.
 *   · **Termo irreversível de início** → desce pro **N20**, depois do dossiê.
 *     É lá que a máquina liga e o dinheiro de governo sai, e é lá que a
 *     exceção de "serviço já exaurido" morde de verdade.
 *
 * Juntos, a alegação de serviço exaurido aconteceria quando NADA foi
 * executado — juridicamente frágil. Separados, cada ato fica onde a lei
 * espera. 🟡 ratificação com Larissa/Mauro pendente.
 *
 * ⚠️ **POR ISSO ESTA TELA NÃO ASSUSTA.** Nenhuma copy aqui fala em
 * irreversível, em taxa que não volta, em "tem certeza?". Seria mentira: neste
 * ponto ele pode desistir e receber tudo de volta. O peso mora no N20.
 *
 * ─── A EXCEÇÃO NÃO NEGOCIÁVEL DO UX-48 ────────────────────────────────────
 * Densidade muda apresentação, JAMAIS obrigação. Conteúdo legal (contrato,
 * política de cancelamento) é **idêntico e integralmente visível** pras duas
 * coortes: nunca atrás de expander, nunca variando por perfil. Nenhum
 * `<details>` é permitido nesta tela. Resumo humano ACIMA do jurídico não é
 * esconder — é ordenar.
 *
 * ─── ⚖️ O CANCELAMENTO SAIU DE BLOCO PRÓPRIO (19/07) ──────────────────────
 * Duas rodadas do Pedro, e a segunda foi a que importou:
 *   1ª — "está dando destaque demais ao cancelamento". Eram 3 cards, o maior
 *        bloco da tela do SIM, e dois deles listavam o que o cliente PERDE.
 *   2ª — **"quem entra num app pra abrir empresa está pensando em crescimento.
 *        Abrir empresa é uma vitória."** O problema não era tamanho, era
 *        MOLDURA: a tela tinha clima de saída de emergência.
 *
 * Duas causas, e as duas são resíduo do **racha do T18**: quando aceite e termo
 * irreversível eram uma tela só, as 4 camadas cabiam juntas e o tom cauteloso
 * fazia sentido. Viraram duas telas; o conteúdo e o tom não se dividiram junto.
 *
 * O que ficou onde:
 *   · Camada 1 (7 dias, devolve tudo) → **bullet**, enquadrado como garantia
 *     ("nada é irreversível hoje"), não como rota de fuga.
 *   · Camada 3 (permanência mínima) → **bullet**, dita como CONSEQUÊNCIA do
 *     benefício: a abertura é gratuita PORQUE existe permanência. Mesma
 *     cláusula, ordem que respeita a verdade em vez de soar punição.
 *   · Camada 2 (taxa e mensalidade não voltam depois de aberto) → **vai pro
 *     N20**. Descreve o depois-de-abrir, que começa lá.
 *   · Camada 4 (só constitui depois de pago) → desenho de fluxo, nunca foi tela.
 *
 * ⚠️ **O que NÃO fiz:** jogar isso pra dentro do "Ler o contrato completo",
 * que foi a sugestão inicial. Esbarra no UX-48 (conteúdo legal nunca atrás de
 * expander, e um link esconde igual) e a permanência mínima é a única coisa
 * aqui que **custa dinheiro ao cliente se ele não souber** — ele aceita nesta
 * tela e paga na seguinte. A informação continua na tela; o que mudou foi a
 * moldura, não a visibilidade. "Não enterrar" ≠ "dar o maior destaque"; as
 * duas coisas estavam confundidas.
 *
 * 🚧 **DÍVIDA:** o N20 ainda não existe. Quando for construído, a camada 2
 * completa TEM que estar nele, antes do botão irreversível. Se nascer sem
 * isso, esta redução vira omissão. Mesma classe da UX-29 esperando o N21.
 * 🟡 Redação jurídica final é do Mauro/Larissa — aqui é a mecânica, não a letra.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function ContratoPage() {
  const [aceito, setAceito] = useState(false);

  return (
    <>
      <TelaHeader meta="Contrato de serviço" />

      <main className="app-main">
        {/* O tom aqui importa: abrir empresa é uma VITÓRIA, e quem chegou até
            aqui está pensando em crescer. A tela não celebra (a celebração é o
            N24, empresa ativa) mas também não pode soar como saída de
            emergência. "Está tudo combinado" fecha um acordo; "leia com calma
            antes de aceitar" pedia cautela pra uma decisão que não é arriscada. */}
        <Titulo sub="O que a gente faz por você e o que você paga. Sem letra miúda.">
          Está tudo combinado
        </Titulo>

        <Corpo>
          {/* ───── RESUMO HUMANO, ACIMA DO JURÍDICO ─────
              Quem lê só isto entendeu o contrato. Tudo o que o cliente assume
              cabe aqui, em 4 linhas — inclusive o que antes tinha bloco
              próprio. Ver o cabeçalho: o assunto não sumiu, mudou de moldura. */}
          <div>
            <p className="text-body font-semibold text-text-primary mb-2">
              Em quatro linhas
            </p>
            <ul className="flex flex-col gap-2">
              <Bullet>
                A gente abre a sua empresa sem cobrar honorário e cuida da sua
                contabilidade todo mês.
              </Bullet>
              <Bullet>
                Você paga uma mensalidade. As taxas do governo são à parte e vão
                direto pro Estado.
              </Bullet>
              {/* A fidelidade dita como CONSEQUÊNCIA do benefício, não como
                  punição. É a mesma cláusula, na ordem que respeita a verdade:
                  a abertura é gratuita PORQUE existe permanência mínima. */}
              <Bullet>
                Como a abertura é gratuita, o plano tem um período mínimo de
                permanência.
              </Bullet>
              <Bullet>
                Nada é irreversível hoje: você tem 7 dias pra desistir e receber
                de volta.
              </Bullet>
            </ul>
          </div>

          <a
            href="#"
            className="flex min-h-12 w-full items-center justify-center rounded-md border
                       border-border-strong bg-surface-card px-4 text-body font-semibold
                       text-text-primary transition-colors hover:bg-surface-alt"
          >
            Ler o contrato completo
          </a>


          {/* ───── QUEM ESTÁ DO OUTRO LADO ─────
              Antes era um `Aviso` azul dizendo "aceitar aqui não abre nada
              ainda": trabalho DEFENSIVO num momento que pede o contrário. O
              instante do aceite é o de maior dúvida sobre **com quem** se está
              assinando, e a melhor resposta que temos pra isso são os 22 anos
              do escritório do Mauro. É o diferencial que nenhum concorrente
              digital tem, e o único lugar do flow onde ele vale mais.

              `tom="marca"` e não `Aviso info`: quem fala aqui é a marca, não um
              alerta do sistema. O azul é token de estado e não tem nada a
              informar neste ponto.

              A última frase preserva o que o card velho fazia de útil: avisar
              que existe uma confirmação separada (o N20). Sem ela, a gente
              trocaria ansiedade agora por surpresa depois. */}
          <Card tom="marca">
            <p className="text-body font-semibold text-text-primary mb-3">
              Você está abrindo com um escritório de verdade
            </p>
            {/* Os 3 argumentos saíram da prosa e viraram itens. Em parágrafo
                corrido eles existiam mas ninguém lia: são as credenciais que
                justificam apertar o botão, e credencial enterrada em texto não
                credencia nada. Cada um tem manchete (o que é) e uma linha (por
                que importa). */}
            <div className="flex flex-col gap-3">
              <Ponto
                icone={<IconeEscudo />}
                titulo="22 anos de estrada"
                texto="Um escritório de contabilidade em Belo Horizonte, de antes de existir app pra isso."
              />
              <Ponto
                icone={<IconePessoa />}
                titulo="Contador com nome e telefone"
                texto="Quem cuida da sua empresa é gente de verdade, e você fala direto com ela."
              />
              <Ponto
                icone={<IconeMao />}
                titulo="Nada acontece sem você"
                texto="Na hora de registrar pra valer, a gente pede a sua confirmação."
              />
            </div>
          </Card>

          {/* ───── CHECKBOX EXPLÍCITO ─────
              Nunca pré-marcado, nunca "ao continuar você concorda". O aceite é
              um ato, e ele fica registrado com data e hora (prova da camada 1
              da política de cancelamento). */}
          <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border-hairline bg-surface-card p-4">
            <input
              type="checkbox"
              checked={aceito}
              onChange={(e) => setAceito(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-action-primary)]"
            />
            <span className="text-body text-text-primary">
              Li e aceito o contrato de serviço da Legalizei.
            </span>
          </label>
        </Corpo>

        {/* Botão único grande (A6). Desabilitado até marcar: o gate é o aceite,
            não a rolagem — travar por scroll puniria quem já leu. */}
        <Rodape>
          <Button full disabled={!aceito}>
            Aceitar e continuar
          </Button>
        </Rodape>
      </main>
    </>
  );
}

/**
 * Credencial: ícone + manchete + uma linha. Local, não DS — só o card de
 * confiança do N8 usa este formato. Se o mesmo trio de argumentos aparecer no
 * N20 (o irmão A6) e num terceiro lugar, aí sim vira componente.
 */
function Ponto({
  icone,
  titulo,
  texto,
}: {
  icone: React.ReactNode;
  titulo: string;
  texto: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 shrink-0 text-action-primary">{icone}</span>
      <div>
        <p className="text-caption font-semibold text-text-primary">{titulo}</p>
        <p className="text-caption text-text-secondary mt-0.5">{texto}</p>
      </div>
    </div>
  );
}

/* Ícones locais. Traço de 2px, 20px — mesma família dos outros da entrada. */

function IconeEscudo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconePessoa() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconeMao() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 11V6a1.5 1.5 0 0 1 3 0v5" />
      <path d="M14 10.5V5a1.5 1.5 0 0 1 3 0v6" />
      <path d="M17 11V7.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6v-1.5" />
      <path d="M11 11.5V10a1.5 1.5 0 0 0-3 0v4" />
    </svg>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-action-primary" />
      <span className="text-body text-text-secondary">{children}</span>
    </li>
  );
}
