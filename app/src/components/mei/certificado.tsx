"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/form";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { CUSTOS } from "@/lib/fiscal";
import { reais } from "./_formato";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M14 · CERTIFICADO DIGITAL — pra OPERAR, não pra abrir.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 28/08 (decisão do Pedro), mudou de casa em 07/09 (fork do ramo).
 *
 * ─── AS 2 DIFERENÇAS PRO ME, E AS DUAS SÃO DE FUNDO ─────────────────────────
 *
 *   1. **O MOTIVO.** No ME o certificado destravava a procuração da
 *      assinatura. No MEI não existe assinatura nem procuração de abertura —
 *      a abertura DISPENSA certificado (conta gov.br Prata/Ouro supre). O que
 *      ele destrava aqui é a OPERAÇÃO: puxar guia, mexer no FGTS Digital, agir
 *      sem pedir a senha do cliente toda vez.
 *
 *   2. **QUEM PAGA.** No ME vem incluso (contrapartida da fidelidade, ADR
 *      04/08). No MEI **não vem** — decisão do Pedro em 28/08, dita desde o
 *      fork (E3.2), repetida no plano (M5) e escrita no contrato (M6). Esta
 *      tela é a 4ª vez que a pessoa ouve, e é a primeira em que ela decide.
 *
 * ─── POR QUE É O ÚLTIMO PASSO, E NÃO UM DO MEIO ─────────────────────────────
 * Ele vem DEPOIS da M13, quando o CNPJ já existe — e não podia ser antes: o
 * certificado é e-CNPJ, e sem CNPJ não há o que emitir. Foi exatamente esse o
 * erro que tirou a A3.2 do caminho ME em 01/09 (ela pedia certificado num
 * ponto em que o CNPJ ainda não existia).
 *
 * ─── 🔄 07/09: ELE VIROU GATE, E ISSO REVOGA A REGRA ANTERIOR ───────────────
 * Até hoje esta tela dizia *"não é gate, dá pra seguir sem"*, e a escolha
 * "depois" levava direto pra casa. Decisão do Pedro em 07/09: **sem
 * certificado a gente não libera o acesso total ao app, e a jornada PARA no
 * status** — o mesmo lugar que a taxa da Junta ocupa no ME.
 *
 * A outra metade da mesma decisão: o certificado passa a ser **cobrado dentro
 * do app** (M14.P), e não mais "pago direto na certificadora". O valor segue
 * sendo o dela, repassado sem acréscimo — o que muda é por onde o dinheiro
 * entra, e portanto quem pode dizer "está pago" sem depender de aviso de
 * terceiro.
 *
 * ✍️ O que a tela NÃO pode fazer é fingir que sempre foi assim. Ela abre
 * dizendo que a abertura não precisou dele (verdade, e a dúvida mais provável
 * de quem acabou de abrir), e só depois diz o que trava daqui pra frente.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** O que o certificado destrava, do lado de cá. Concreto, não abstrato. */
const O_QUE_DESTRAVA = [
  "A gente puxa suas guias sem te pedir senha toda vez",
  "Nota fiscal emitida direto, sem você entrar em site nenhum",
  "FGTS Digital e eSocial, se você registrar seu colaborador",
  "Qualquer coisa no e-CAC resolvida por nós, no mesmo dia",
];

export function CertificadoMeiView({
  meta,
  escolha,
  setEscolha,
  aceiteContato,
  setAceiteContato,
  onSeguir,
  onVoltar,
}: {
  /** Nome de PRA ONDE O VOLTAR LEVA (vem de `mei-flow.metaDoVoltar`). */
  meta: string;
  /** `quero` = fala com a parceira · `depois` = segue sem, por ora. */
  escolha: "quero" | "depois" | null;
  setEscolha: (v: "quero" | "depois") => void;
  /** Só quem escolheu "quero" confirma o contato da certificadora parceira. */
  aceiteContato: boolean;
  setAceiteContato: (v: boolean) => void;
  onSeguir?: () => void;
  onVoltar?: () => void;
}) {
  const completo =
    escolha === "depois" || (escolha === "quero" && aceiteContato);

  return (
    <>
      <TelaHeader meta={meta} onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo sub="Seu MEI já está aberto e o CNPJ é seu. Falta o passo que deixa a gente cuidar dele por dentro do app.">
          O seu certificado digital
        </Titulo>

        <Corpo>
          {/* Primeiro o que ele NÃO é: a dúvida mais provável de quem acabou de
              abrir é "eu precisava disso antes?". Responder na primeira linha
              evita a sensação de ter pulado uma etapa. */}
          <Aviso variante="success" titulo="Você não precisou dele pra abrir">
            E não precisa mesmo: a abertura do MEI dispensa certificado, sua
            conta gov.br já resolveu essa parte. Ele serve pro dia a dia daqui
            pra frente, e é o que libera o app inteiro.
          </Aviso>

          <div>
            <p className="text-caption font-semibold text-text-primary mb-2">
              O que muda com ele
            </p>
            <div className="flex flex-col gap-2">
              {O_QUE_DESTRAVA.map((item) => (
                <p key={item} className="text-caption text-text-secondary">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <Card>
            <p className="text-micro text-text-tertiary">Quanto custa</p>
            <p className="text-body font-semibold text-text-primary mt-0.5">
              Cerca de {reais(CUSTOS.CERTIFICADO_PRECO)} por ano
            </p>
            <p className="text-caption text-text-secondary mt-1">
              É o valor da certificadora, repassado sem acréscimo. Você paga
              aqui, em uma vez, com os mesmos meios do plano. No plano MEI ele
              não vem incluso, e a gente disse isso desde o começo.
            </p>
          </Card>

          <div className="flex flex-col gap-2">
            <Card tom={escolha === "quero" ? "marca" : "neutro"} onClick={() => setEscolha("quero")}>
              <p className="text-body font-semibold text-text-primary">
                Quero resolver agora
              </p>
              <p className="text-caption text-text-secondary mt-0.5">
                A certificadora parceira te chama pra marcar a videochamada de
                validação. Leva uns 15 minutos.
              </p>
            </Card>

            <Card tom={escolha === "depois" ? "marca" : "neutro"} onClick={() => setEscolha("depois")}>
              <p className="text-body font-semibold text-text-primary">
                Deixa pra depois
              </p>
              {/* ✍️ 07/09 — esta copy MUDOU junto com a decisão. Ela dizia
                  "segue tudo funcionando", e agora não segue: o que a pessoa
                  escolhe aqui é esperar, não pular. Dizer o custo da escolha
                  na hora de escolher é o oposto de descobrir depois, batendo
                  numa porta trancada. */}
              <p className="text-caption text-text-secondary mt-0.5">
                Seu CNPJ continua ativo e nada se perde. Mas o app fica no modo
                limitado até o certificado sair, e a gente não consegue puxar
                guia nem emitir nota no seu lugar.
              </p>
            </Card>
          </div>

          {escolha === "quero" && (
            <Checkbox checked={aceiteContato} onChange={setAceiteContato}>
              Autorizo a certificadora parceira a entrar em contato comigo pra
              marcar a videochamada
            </Checkbox>
          )}
        </Corpo>

        <Rodape>
          {/* 🔄 07/09 — o CTA deixou de prometer "entrar no meu painel" pra
              quem escolheu esperar: com o gate, esse caminho leva pro status,
              não pra casa. Prometer a casa e entregar uma tela de espera é o
              tipo de quebra que a pessoa lê como bug. */}
          <Button full disabled={!completo} onClick={onSeguir}>
            {escolha === "quero"
              ? `Pagar ${reais(CUSTOS.CERTIFICADO_PRECO)}`
              : "Ver meu acompanhamento"}
          </Button>
        </Rodape>
      </main>
    </>
  );
}
