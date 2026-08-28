"use client";

import { Button } from "@/components/ui/button";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { Campo, Texto, Select } from "@/components/ui/form";
import { PILLS } from "@/components/gate-telas";
import { mascaraTelefone, mascaraCep, buscarCep } from "@/components/wizard-dinheiro";
import { ehCepBh } from "@/lib/endereco";
import { categoriaTemMei } from "@/lib/mei";
import { CUSTOS, brl } from "@/lib/fiscal";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * E3.1 + E3.3 — CAPTURA DE LEAD, logo depois do fork
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 27/08 — reordenação do flow de entrada (ADR `marca/decisoes-marca.md`).
 *
 * ─── POR QUE ESTAS DUAS TELAS EXISTEM ──────────────────────────────────────
 * Cruzamento com o funil da Contabilizei (`pesquisa/concorrentes/contabilizei/
 * funcionalidades/2026-08-27-funil-4-etapas-contrato-completo.md`): eles pedem
 * nome/e-mail/telefone na PRIMEIRA tela do wizard. A gente só pedia lá no E6
 * (criar conta), depois de CNAE + triagem + faixa. Consequência medida: quem
 * desistia no meio era anônimo, e não dava pra saber "quem é dono dos próximos
 * cliques" (palavras do Pedro).
 *
 * As duas telas resolvem coisas diferentes:
 *   · **E3.1 (`DadosPessoaisView`)** — identidade do lead. 3 campos, igual ao
 *     líder. Não cria conta (isso continua no E6): só identifica.
 *   · **E3.3 (`EnderecoCategoriaView`)** — os DOIS gates do produto, agora
 *     juntos e ANTES do dinheiro: onde a empresa fica (BH, validado por CEP de
 *     verdade) e o que a pessoa faz (categoria, que substitui o veredito de
 *     CNAE como filtro de elegibilidade).
 *
 * ─── O QUE ELAS SUBSTITUEM ─────────────────────────────────────────────────
 * · **E4 (gate de cidade)** foi REMOVIDO. Ele perguntava "é em BH?" e confiava
 *   no clique. Aqui o CEP valida de verdade (`ehCepBh`), e quem não tem
 *   endereço em BH recebe o endereço fiscal da Legalizai como SOLUÇÃO em vez
 *   de porta na cara: a sede fica em BH de qualquer forma, porque o município
 *   da empresa segue o endereço da sede, não o domicílio do dono.
 * · A escolha "endereço próprio × fiscal" saiu do E5F (Faixa), onde morava
 *   desde 26/08. Ela pertence à mesma pergunta que o gate de cidade, não à
 *   pergunta de faturamento.
 *
 * ─── LGPD ──────────────────────────────────────────────────────────────────
 * Nome/e-mail/telefone é dado pessoal de verdade, e agora é captado antes de
 * qualquer aceite contratual (o "li e concordo" continua no E8, antes do
 * pagamento). Por isso a E3.1 carrega o consentimento mínimo em 1 linha, com
 * link, sem checkbox pesado: bloquear o fluxo com aceite formal aqui mataria
 * exatamente a captura cedo que motivou a mudança.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type DadosLead = {
  nome: string;
  email: string;
  telefone: string;
};

/* ─────────────────────────────────────────────────────────────────────────
   E3.1 · DADOS PESSOAIS — 3 campos, o mínimo pra saber quem está do outro lado
   ───────────────────────────────────────────────────────────────────────── */
export function DadosPessoaisView({
  d,
  set,
  onSeguir,
  onVoltar,
  contexto = "abrir",
}: {
  d: DadosLead;
  set: <K extends keyof DadosLead>(k: K, v: DadosLead[K]) => void;
  onSeguir: () => void;
  onVoltar?: () => void;
  /** Muda só o subtítulo: quem migra já tem empresa, quem abre ainda não. */
  contexto?: "abrir" | "migrar";
}) {
  const nomeOk = d.nome.trim().split(/\s+/).length >= 2;
  const emailOk = /@/.test(d.email) && /\./.test(d.email.split("@")[1] ?? "");
  const telefoneOk = d.telefone.replace(/\D/g, "").length >= 10;
  const completo = nomeOk && emailOk && telefoneOk;

  return (
    <>
      <TelaHeader meta="Seus dados" onVoltar={onVoltar} />
      <main className="app-main">
        <Titulo
          sub={
            contexto === "migrar"
              ? "Pra gente falar com você sobre a sua empresa e acompanhar a migração."
              : "Pra gente conseguir te acompanhar daqui em diante e guardar o seu progresso."
          }
        >
          Como a gente te chama?
        </Titulo>

        <Corpo>
          <Campo rotulo="Nome completo">
            <Texto
              valor={d.nome}
              onChange={(v) => set("nome", v)}
              placeholder="Como está no seu documento"
              erro={d.nome.length > 0 && !nomeOk ? "Escreva o nome completo." : undefined}
            />
          </Campo>

          <Campo rotulo="Seu e-mail">
            <Texto
              valor={d.email}
              onChange={(v) => set("email", v)}
              type="email"
              inputMode="email"
              placeholder="voce@email.com.br"
            />
          </Campo>

          <Campo rotulo="Celular" dica="A gente usa pra te avisar de cada etapa.">
            <Texto
              valor={d.telefone}
              onChange={(v) => set("telefone", mascaraTelefone(v))}
              placeholder="(31) 90000-0000"
              inputMode="tel"
            />
          </Campo>

          {/* LGPD — consentimento mínimo, 1 linha, sem checkbox. O aceite
              contratual de verdade continua no E8 (antes do pagamento). */}
          <p className="text-micro text-text-tertiary">
            Ao continuar, você concorda que a gente use esses dados pra te
            atender, como está na nossa{" "}
            <a
              href="/privacidade"
              className="font-semibold text-text-secondary underline underline-offset-4"
            >
              política de privacidade
            </a>
            . Nada de vender seus dados pra ninguém.
          </p>
        </Corpo>

        <Rodape>
          {/* 🆕 27/08 (pedido do Pedro) — o CTA passa a AFIRMAR o consentimento
              acima, não só "avançar". O botão É o gesto de concordar: não faz
              sentido ter uma linha de LGPD e um CTA genérico do lado. */}
          <Button full disabled={!completo} onClick={onSeguir}>
            Concordo, continuar
          </Button>
        </Rodape>
      </main>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   E3.3 · ENDEREÇO + CATEGORIA — os 2 gates do produto, numa tela
   ───────────────────────────────────────────────────────────────────────── */
export function EnderecoCategoriaView({
  enderecoProprio,
  setEnderecoProprio,
  cep,
  setCep,
  numero,
  setNumero,
  categoria,
  setCategoria,
  onSeguir,
  onForaDeEscopo,
  onVoltar,
  exigeBh = true,
  regimeMei = false,
  onTrocarParaMe,
}: {
  /** `null` = ainda não escolheu. `true` = endereço próprio. `false` = fiscal. */
  enderecoProprio: boolean | null;
  setEnderecoProprio: (v: boolean) => void;
  cep: string;
  setCep: (v: string) => void;
  numero: string;
  setNumero: (v: string) => void;
  /** id de uma das `PILLS`. `null` = ainda não escolheu. */
  categoria: string | null;
  setCategoria: (v: string | null) => void;
  onSeguir: () => void;
  /** "Minha atividade não está na lista" → waitlist, captura o lead. */
  onForaDeEscopo: () => void;
  onVoltar?: () => void;
  /**
   * 🆕 27/08 — o gate de BH só vale pro **ME**. MEI não tem o limite
   * geográfico do MLP (decisão 03/08: a Legalizai abre MEI do Brasil inteiro),
   * então pra ele qualquer CEP serve e a tela só coleta o endereço.
   *
   * ⚠️ MEI passa por esta tela mesmo assim, e é de propósito: a CATEGORIA é o
   * gate de elegibilidade agora, e vale pros dois regimes. Pular a tela pro
   * MEI (como o E4 fazia) deixaria o `/dossie/atividade` sem filtro nenhum.
   */
  exigeBh?: boolean;
  /**
   * 🆕 28/08 — o caminho MEI usa a MESMA lista de categorias, mas 3 delas não
   * existem como MEI (`CATEGORIAS_SEM_MEI` em `lib/mei.ts`): tecnologia,
   * design e consultoria são profissão intelectual, e o art. 966 do Código
   * Civil não considera isso atividade de empresário — nem existe a ocupação
   * pra escolher no Anexo XI.
   *
   * ⚠️ A decisão (com o Pedro) foi **não esconder** essas 3 no caminho MEI.
   * Sumir com elas faria a pessoa achar que a Legalizai não atende a atividade
   * dela — quando atende, só não como MEI. Então ela escolhe, lê o motivo real
   * e ganha a porta pro ME. Porta fechada vira upsell honesto.
   *
   * `false` (default) = caminho ME, comportamento idêntico ao de sempre.
   */
  regimeMei?: boolean;
  /** Só no MEI: leva pro caminho ME quando a categoria escolhida não tem MEI. */
  onTrocarParaMe?: () => void;
}) {
  const cepDigitos = cep.replace(/\D/g, "");
  const cepCheio = cepDigitos.length === 8;
  const cepValido = cepCheio && (!exigeBh || ehCepBh(cep));
  const endereco = cepCheio ? buscarCep(cepDigitos) : null;
  // Fora de BH não bloqueia a tela: vira o argumento do endereço fiscal, que
  // resolve o caso em vez de mandar a pessoa embora.
  const foraDeBh = cepCheio && exigeBh && !ehCepBh(cep);

  // Só no MEI: a categoria escolhida existe como ocupação do Anexo XI?
  const categoriaSemMei =
    regimeMei && categoria !== null && !categoriaTemMei(categoria);

  const enderecoResolvido =
    enderecoProprio === false ||
    (enderecoProprio === true && cepValido && numero.trim() !== "");
  const completo = enderecoResolvido && categoria !== null && !categoriaSemMei;

  return (
    <>
      <TelaHeader meta="Sua empresa" onVoltar={onVoltar} />
      <main className="app-main">
        <Titulo sub="Duas coisas rápidas: onde ela vai ficar e o que você faz.">
          Sobre a sua empresa
        </Titulo>

        <Corpo>
          {/* ═══ GATE 1 · ONDE A EMPRESA FICA ═══
              Substitui o E4 (gate de cidade), que era autodeclarado. */}
          <div>
            <p className="text-body-strong font-semibold mb-1">
              Onde ela vai ficar?
            </p>
            <p className="text-caption text-text-secondary mb-3">
              {exigeBh
                ? "Por enquanto a gente só abre empresa em Belo Horizonte/MG. Isso é sobre o endereço da empresa, não sobre onde você mora."
                : "É o endereço que vai ficar registrado no seu CNPJ. Como MEI, você pode abrir de qualquer cidade do Brasil."}
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setEnderecoProprio(true)}
                aria-pressed={enderecoProprio === true}
                className={`min-h-12 rounded-md border px-4 text-left text-body font-semibold transition-colors
                  ${
                    enderecoProprio === true
                      ? "border-action-primary bg-action-primary text-text-on-brand"
                      : "border-border-hairline bg-surface-card text-text-secondary hover:border-border-strong"
                  }`}
              >
                {exigeBh ? "Tenho um endereço em BH" : "Uso um endereço meu"}
              </button>

              <button
                onClick={() => setEnderecoProprio(false)}
                aria-pressed={enderecoProprio === false}
                className={`rounded-md border p-4 text-left transition-colors
                  ${
                    enderecoProprio === false
                      ? "border-action-primary bg-action-primary"
                      : "border-border-strong bg-surface-card hover:border-border-focus"
                  }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`text-body font-semibold ${
                      enderecoProprio === false ? "text-text-on-brand" : "text-text-primary"
                    }`}
                  >
                    Quero um endereço da Legalizai
                  </span>
                  <span className="shrink-0 rounded-full bg-surface-dark px-2.5 py-1 text-micro font-semibold text-text-on-dark">
                    {brl(CUSTOS.ENDERECO_FISCAL, true)}/mês
                  </span>
                </div>
                <p
                  className={`text-caption mt-1.5 ${
                    enderecoProprio === false ? "text-text-on-brand/80" : "text-text-secondary"
                  }`}
                >
                  O endereço do nosso escritório em BH vira a sede da sua
                  empresa, sem usar o seu. Serve inclusive pra quem mora em
                  outra cidade.
                </p>
              </button>
            </div>

            {/* Endereço próprio → pede o CEP de verdade. É AQUI que o gate de
                cidade acontece agora, com dado em vez de autodeclaração. */}
            {enderecoProprio === true && (
              <div className="mt-4 flex flex-col gap-4">
                <Campo rotulo="CEP da empresa" dica="A gente puxa o resto do endereço.">
                  <Texto
                    valor={cep}
                    onChange={(v) => setCep(mascaraCep(v))}
                    placeholder="00000-000"
                    inputMode="numeric"
                  />
                </Campo>

                {foraDeBh ? (
                  <Aviso variante="warning" titulo="Esse CEP não é de Belo Horizonte">
                    Hoje a gente só abre empresa com sede em BH. Dá pra
                    resolver usando o endereço da Legalizai aqui em cima: a
                    empresa fica em BH e você continua morando onde mora.
                  </Aviso>
                ) : (
                  endereco && (
                    <>
                      <div className="rounded-md border border-border-hairline bg-surface-card p-3">
                        <p className="text-caption text-text-secondary">
                          {endereco.logradouro}, {endereco.bairro}
                        </p>
                        <p className="text-caption font-semibold text-text-primary">
                          {endereco.municipio} · {endereco.uf}
                        </p>
                      </div>
                      <Campo rotulo="Número">
                        <Texto
                          valor={numero}
                          onChange={setNumero}
                          placeholder="123"
                          inputMode="numeric"
                        />
                      </Campo>
                    </>
                  )
                )}

                {/* 🆕 27/08 (achado do cruzamento com a Contabilizei): eles
                    avisam do risco de zoneamento, a gente não avisava em lugar
                    nenhum. O aviso mora aqui agora, junto do endereço. */}
                {cepValido && (
                  <Aviso variante="info" titulo="A prefeitura confirma na viabilidade">
                    A maioria dos endereços residenciais é aceita, mas depende
                    do zoneamento e da sua atividade. A gente confirma quando a
                    viabilidade sair, e se não der você troca sem custo.
                  </Aviso>
                )}
              </div>
            )}

            {enderecoProprio === false && (
              <Aviso variante="warning" titulo="Essa cobrança é mensal, recorrente">
                Não é cobrança única. Entra somada na sua mensalidade todo mês,
                a partir de agora. Você confirma o valor total no próximo passo.
              </Aviso>
            )}
          </div>

          {/* ═══ GATE 2 · O QUE A PESSOA FAZ ═══
              🔑 Esta é a peça que permitiu mover o CNAE pra depois do
              pagamento. A lista só tem o que a gente ATENDE, então escolher já
              é passar pelo gate: lá no `/dossie/atividade` (pós-pagamento) a
              pessoa só refina DENTRO da categoria, e por construção não existe
              mais "não atendemos" naquele ponto. Quem não se encontra aqui sai
              pela waitlist, antes de qualquer cobrança. */}
          <div>
            <p className="text-body-strong font-semibold mb-1">
              O que você faz?
            </p>
            <p className="text-caption text-text-secondary mb-3">
              Escolhe o que mais se parece. Depois você conta com as suas
              palavras e a gente acha o código certo.
            </p>

            {/* 🔄 27/08 (pedido do Pedro: "quero as categorias em dropdown,
                traga um bonito") — eram pills (mesmo estilo do E5A/pré-27/08).
                17 opções em pill quebra em várias linhas e pesa a tela; o
                `Select` do DS (já usado em estado civil/tipo) resolve com 1
                gatilho + lista flutuante, sem perder teclado/a11y básica. */}
            <Select
              valor={categoria ?? ""}
              onChange={(v) => setCategoria(v || null)}
              opcoes={PILLS.map((p) => ({
                v: p.id,
                // No MEI, as 3 sem ocupação ganham o rótulo na própria lista —
                // a pessoa já lê o limite antes de escolher, e quem escolhe
                // mesmo assim encontra a explicação completa logo abaixo.
                label:
                  regimeMei && !categoriaTemMei(p.id)
                    ? `${p.label} (só como ME)`
                    : p.label,
              }))}
              placeholder="Escolhe uma categoria"
            />

            {/* 🔴 A porta fechada que vira porta aberta. Só existe no MEI. */}
            {categoriaSemMei && (
              <div className="mt-3 flex flex-col gap-3">
                <Aviso variante="info" titulo="Essa atividade não pode ser MEI">
                  A lei não considera empresário quem exerce profissão
                  intelectual (art. 966 do Código Civil), então tecnologia,
                  design e consultoria não entram na lista do MEI. Não é
                  escolha nossa, e não tem exceção.
                </Aviso>
                <p className="text-caption text-text-secondary">
                  A boa notícia: a gente atende essa atividade como ME no
                  Simples Nacional, que é o caminho certo pro seu caso.
                </p>
                <Button full onClick={onTrocarParaMe}>
                  Continuar como ME
                </Button>
              </div>
            )}

            <button
              onClick={onForaDeEscopo}
              className="mt-3 self-start text-caption font-medium text-text-secondary underline underline-offset-4"
            >
              Minha atividade não está na lista
            </button>
          </div>
        </Corpo>

        <Rodape>
          <Button full disabled={!completo} onClick={onSeguir}>
            Continuar
          </Button>
        </Rodape>
      </main>
    </>
  );
}
