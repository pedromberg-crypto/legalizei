"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TelaHeader, Titulo, Corpo, Rodape } from "@/components/ui/tela";
import { brl } from "@/lib/fiscal";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * N19 — REVISAR O DOSSIÊ  ·  arquétipo A5 (recap) · shell APP (pago)
 * ═══════════════════════════════════════════════════════════════════════════
 * Spec: execucao/spec-telas-b3-b4-aterrissagem.md → Tela 20 (o "revisar e
 * confirmar" de lib/passos) · vem depois do N18, antes do N20 irreversível.
 *
 * ─── POR QUE ESTA TELA EXISTE ───────────────────────────────────────────────
 * O N20 é IRREVERSÍVEL (taxa de governo não volta). Ninguém deve cruzar essa
 * porta sem ver, num lugar só, tudo que a gente vai registrar na Junta com o
 * nome dele. É o último ponto em que corrigir ainda é de graça.
 *
 * É LEITURA, não formulário: cada bloco tem um "ajustar" que volta pro passo
 * de origem. A confiança vem de ele reconhecer o que digitou, não de redigitar.
 *
 * ⚠️ Os números fiscais entram com CARIMBO de estimativa (UX-26) e derivam do
 * que foi escolhido no N18 — nunca um valor novo inventado aqui. A única quantia
 * DURA é a taxa da Junta (R$ 268,51, ME, fiscal-simples-bh-2026 🟢); o resto é
 * estimativa até o contador confirmar.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Viria do estado do wizard. Mock pra farol — solo, com CNAE ótimo aplicado.
const DOSSIE = {
  socio: { nome: "Ana Beatriz Ramos", cpf: "123.456.789-00", contato: "(31) 99999-0000" },
  empresa: {
    razao: "Ana Beatriz Ramos Desenvolvimento de Software",
    natureza: "Sociedade Limitada Unipessoal (SLU)",
    endereco: "Rua dos Timbiras, 1200, Funcionários, BH",
    capital: 10000,
  },
  atividade: {
    principal: { cnae: "6201-5/01", nome: "Desenvolvimento de software sob encomenda" },
    secundarias: [
      { cnae: "6311-9/00", nome: "Hospedagem na internet" },
      { cnae: "6209-1/00", nome: "Suporte técnico em informática" },
    ],
  },
  enquadramento: {
    // Derivado do N18. Estimativa, não fato.
    proLabore: 3600,
    economiaMes: 940,
  },
  taxaJunta: 268.51, // 🟢 fato duro (JUCEMG ME)
};

export default function RevisarPage() {
  const d = DOSSIE;
  return (
    <>
      <TelaHeader meta="Revisar" />

      <main className="app-main">
        <Titulo sub="Confira com calma. Depois que você autoriza, a gente já começa a registrar isso na Junta com o seu nome.">
          Está tudo certo?
        </Titulo>

        <Corpo>
          <Bloco titulo="Você" passo="Seus dados">
            <Linha rotulo="Nome" valor={d.socio.nome} />
            <Linha rotulo="CPF" valor={d.socio.cpf} />
            <Linha rotulo="Contato" valor={d.socio.contato} />
          </Bloco>

          <Bloco titulo="A empresa" passo="Dados da empresa">
            <Linha rotulo="Nome" valor={d.empresa.razao} />
            <Linha rotulo="Tipo" valor={d.empresa.natureza} />
            <Linha rotulo="Endereço" valor={d.empresa.endereco} />
            <Linha rotulo="Capital social" valor={brl(d.empresa.capital)} />
          </Bloco>

          <Bloco titulo="O que a empresa faz" passo="Atividades">
            <Linha
              rotulo="Principal"
              valor={`${d.atividade.principal.nome} (${d.atividade.principal.cnae})`}
            />
            {d.atividade.secundarias.map((s) => (
              <Linha
                key={s.cnae}
                rotulo="Secundária"
                valor={`${s.nome} (${s.cnae})`}
              />
            ))}
          </Bloco>

          {/* K10: no review final o trabalho é CONFERIR fato, não revender. O
              pró-labore é o que ELA escolheu (fato a confirmar); a economia é
              projeção e já apareceu antes (N5/N17/N18). Some daqui, e sem número
              estimado a tela não precisa do carimbo. */}
          <Bloco titulo="Quanto você se paga" passo="Quanto você se paga">
            <Linha rotulo="Por mês" valor={brl(d.enquadramento.proLabore)} />
          </Bloco>

          {/* A taxa dura como LINHA de recap: ela já foi paga no N9 e o N7 já é
              o dono da explicação (repasse de governo). Aqui não re-argumenta
              (R2), só confirma o valor dentro do que ela está conferindo. */}
          <Card>
            <div className="flex items-baseline justify-between">
              <span className="text-body font-semibold text-text-primary">
                Taxa da Junta (já paga)
              </span>
              <span className="text-body font-semibold text-text-primary">
                {brl(d.taxaJunta)}
              </span>
            </div>
            <p className="text-micro text-text-tertiary mt-1">
              Repasse ao governo, já incluído no que você pagou.
            </p>
          </Card>
        </Corpo>

        <Rodape>
          {/* K8: o título já pergunta "Está tudo certo?"; o CTA repetir a frase
              era eco na mesma tela. O botão diz a AÇÃO. */}
          <Button full>Confirmar e seguir</Button>
        </Rodape>
      </main>
    </>
  );
}

/* ─── Um bloco do recap: título + "ajustar" que volta pro passo ────────────── */
function Bloco({
  titulo,
  passo,
  children,
}: {
  titulo: string;
  /** Nome humano do passo de origem (o mesmo de lib/passos). */
  passo: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-body font-semibold text-text-primary">{titulo}</h2>
        {/* "Ajustar", não "editar": editar soa técnico; ajustar é o gesto dele.
            🔒 CONTRATO DE INTERAÇÃO (K5): abre SÓ aquele passo, salva e VOLTA
            pra este N19 — nunca re-anda N14→N18 inteiro. Editar 1 campo não pode
            custar re-caminhar meio flow (puniria quem só quer trocar o CEP). No
            mock não navega; o dev implementa o edit-and-return. */}
        <button
          className="shrink-0 text-caption font-semibold text-action-primary-sm underline underline-offset-4"
          aria-label={`Ajustar ${passo}`}
        >
          Ajustar
        </button>
      </div>
      <div className="flex flex-col gap-1.5">{children}</div>
    </Card>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-micro text-text-tertiary">{rotulo}</span>
      <span className="text-caption text-text-primary">{valor}</span>
    </div>
  );
}
