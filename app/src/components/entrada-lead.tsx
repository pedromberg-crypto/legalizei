"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { Campo, Texto, Select } from "@/components/ui/form";
import { PILLS, CheckMiniRegime } from "@/components/gate-telas";
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
  sobrenome: string;
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
  const nomeOk = d.nome.trim().length > 0;
  const sobrenomeOk = d.sobrenome.trim().length > 0;
  const emailOk = /@/.test(d.email) && /\./.test(d.email.split("@")[1] ?? "");
  const telefoneOk = d.telefone.replace(/\D/g, "").length >= 10;
  const completo = nomeOk && sobrenomeOk && emailOk && telefoneOk;

  return (
    <>
      {/* 🐛 29/08 (achado do Pedro testando no iPhone) — `meta` é o rótulo do
          DESTINO do voltar, não o nome da própria tela (mesmo padrão em todo
          o resto do wizard). Estava mostrando "Seus dados" (o assunto DESTA
          tela), quando o voltar daqui leva pro fork (`/entrada`). */}
      <TelaHeader meta="Página inicial" onVoltar={onVoltar} />
      <main className="app-main">
        <Titulo
          sub={
            contexto === "migrar"
              ? "Pra gente falar com você sobre a sua empresa e acompanhar a migração."
              : "Pra gente te acompanhar daqui em diante e guardar o seu progresso."
          }
        >
          Como a gente te chama?
        </Titulo>

        <Corpo>
          {/* 🆕 29/08 (pedido do Pedro) — nome e sobrenome viram 2 campos,
              não mais 1 "nome completo" só. Os dois obrigatórios. */}
          <div className="flex gap-3">
            <div className="min-w-0 flex-1">
              <Campo rotulo="Nome">
                <Texto
                  valor={d.nome}
                  onChange={(v) => set("nome", v)}
                  placeholder="Primeiro nome"
                />
              </Campo>
            </div>
            <div className="min-w-0 flex-1">
              <Campo rotulo="Sobrenome">
                <Texto
                  valor={d.sobrenome}
                  onChange={(v) => set("sobrenome", v)}
                  placeholder="Sobrenome"
                />
              </Campo>
            </div>
          </div>

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
            .
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

/** Sentinela da opção coral "Não encontrei minha categoria" no dropdown —
 *  não é um id de `PILLS`, de propósito, pra nunca colidir com uma categoria
 *  real. */
const FORA_LISTA_ID = "fora-lista";
/** Última opção da lista de regulamentadas: abre um campo livre pra pessoa
 *  escrever a própria atividade, quando nem essas 11 servem. */
const REGULAMENTADA_OUTRA_ID = "outra";

/** 🆕 29/08 (pedido do Pedro) — lista CURTA (≤12) das atividades
 *  regulamentadas mais comuns entre PJ do Simples, pra quem não se encontrou
 *  nas categorias. "Comércio" primeiro, de propósito: abrange bastante coisa
 *  sozinho e não é "regulamentada" (é o catch-all mais comum). O resto é
 *  profissão regulamentada de verdade — nada de nicho, se não a lista fica
 *  enorme. */
const REGULAMENTADAS = [
  { v: "comercio", label: "Comércio" },
  { v: "engenharia", label: "Engenharia" },
  { v: "medicina", label: "Medicina" },
  { v: "odontologia", label: "Odontologia" },
  { v: "advocacia", label: "Advocacia" },
  { v: "contabilidade", label: "Contabilidade" },
  { v: "psicologia", label: "Psicologia" },
  { v: "nutricao", label: "Nutrição" },
  { v: "fisioterapia", label: "Fisioterapia" },
  { v: "arquitetura", label: "Arquitetura" },
  { v: "corretagem", label: "Corretagem de imóveis" },
  { v: REGULAMENTADA_OUTRA_ID, label: "É outra atividade" },
];

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
  complemento,
  setComplemento,
  categoria,
  setCategoria,
  onSeguir,
  onVoltar,
  exigeBh = true,
  regimeMei = false,
  onTrocarParaMe,
  simularFilaCidade = false,
}: {
  /** `null` = ainda não escolheu. `true` = endereço próprio. `false` = fiscal. */
  enderecoProprio: boolean | null;
  setEnderecoProprio: (v: boolean) => void;
  cep: string;
  setCep: (v: string) => void;
  numero: string;
  setNumero: (v: string) => void;
  /** 🆕 29/08 (achado do Pedro) — faltava o campo, só tinha número. */
  complemento: string;
  setComplemento: (v: string) => void;
  /** id de uma das `PILLS`. `null` = ainda não escolheu. */
  categoria: string | null;
  setCategoria: (v: string | null) => void;
  onSeguir: () => void;
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
  /**
   * 🆕 31/08 (pedido do Pedro) — seed de `filaCidade` pra PRÉVIA AO VIVO do
   * `/mapa` (E3.4.1): o clique em "Quero abrir na minha cidade mesmo assim"
   * é estado interno, sem prop pra acionar de fora. Sem isso o iframe do
   * board só mostraria o 1º card (fora de BH), não o CTA final resolvido.
   * Não é fluxo real — só a `endereco/page.tsx` lê `?simular=fora-bh` e passa.
   */
  simularFilaCidade?: boolean;
}) {
  const cepDigitos = cep.replace(/\D/g, "");
  const cepCheio = cepDigitos.length === 8;
  const cepValido = cepCheio && (!exigeBh || ehCepBh(cep));
  const endereco = cepCheio ? buscarCep(cepDigitos) : null;
  // Fora de BH não bloqueia a tela: vira o argumento do endereço fiscal, que
  // resolve o caso em vez de mandar a pessoa embora.
  const foraDeBh = cepCheio && exigeBh && !ehCepBh(cep);

  // 🔄 29/08 (pedido do Pedro) — o gate "fora de BH" deixou de expulsar pra
  // uma tela de saída (`/saida/fora-bh`, E4.1): agora resolve AQUI mesmo, com
  // 2 saídas positivas — usar o endereço fiscal (já existia) ou entrar na
  // fila da própria cidade (nova). Local, não viaja por querystring: nada
  // fora desta tela precisa saber que a pessoa escolheu essa opção.
  const [filaCidade, setFilaCidade] = useState(simularFilaCidade);

  // 🆕 29/08 (pedido do Pedro) — "Não encontrei minha categoria" (opção coral
  // do dropdown) pede a atividade REGULAMENTADA de verdade em vez de deixar
  // solto. `atividadeForaLista` já vira `true` no clique da 1ª pergunta (o
  // campo de cidade tem que aparecer JUNTO, não só depois de escolher a
  // regulamentada) — só o `completo` (gate de submissão) exige a
  // regulamentada (e, se for "outra", a descrição livre) também.
  const [regulamentada, setRegulamentada] = useState<string | null>(null);
  const [outraAtividade, setOutraAtividade] = useState("");
  const atividadeForaLista = categoria === FORA_LISTA_ID;
  const precisaDescreverOutra = regulamentada === REGULAMENTADA_OUTRA_ID;
  const regulamentadaOk =
    regulamentada !== null && (!precisaDescreverOutra || outraAtividade.trim() !== "");

  // Combina as 2 saídas positivas (cidade fora de BH + atividade fora do
  // escopo) num modo só: ambas terminam do MESMO jeito, capturando cidade +
  // condição especial, com o mesmo CTA no rodapé.
  const modoEspera = filaCidade || atividadeForaLista;

  // Só no MEI: a categoria escolhida existe como ocupação do Anexo XI?
  const categoriaSemMei =
    regimeMei && categoria !== null && !atividadeForaLista && !categoriaTemMei(categoria);

  const enderecoResolvido = atividadeForaLista
    ? cepCheio // só precisa saber a cidade, não validar/escolher endereço
    : regimeMei
      ? // MEI: não há escolha de endereço (ver o bloco do card fiscal abaixo),
        // então basta o CEP válido + número.
        cepValido && numero.trim() !== ""
      : filaCidade ||
        enderecoProprio === false ||
        (enderecoProprio === true && cepValido && numero.trim() !== "");
  // 🔒 29/08 (pedido do Pedro) — `categoria !== null` é OBRIGATÓRIO em
  // qualquer caminho de endereço, inclusive `filaCidade`: é dado importante
  // pra estratégia de mkt quando a Legalizai chegar na cidade da pessoa.
  // Nunca tornar a categoria opcional só pra quem entrar na fila. Quando é
  // "não encontrei minha categoria", precisa TAMBÉM da regulamentada real
  // (e da descrição livre, se for "outra").
  const completo =
    enderecoResolvido &&
    categoria !== null &&
    !categoriaSemMei &&
    (!atividadeForaLista || regulamentadaOk);

  return (
    <>
      {/* 🐛 29/08 — `meta` é o rótulo do DESTINO do voltar (a tela MEI×ME),
          não desta tela. Estava "Sua empresa" (nome da tela ATUAL). */}
      <TelaHeader meta="Enquadramento" onVoltar={onVoltar} />
      <main className="app-main">
        {/* 🔄 29/08 (pedido do Pedro) — subtítulo cortado pro essencial: as
            perguntas já vêm logo abaixo, "o que você faz e onde ela vai
            ficar" virou redundante. */}
        <Titulo sub="Duas perguntas rápidas">
          Sobre a sua empresa
        </Titulo>

        <Corpo>
          {/* ═══ GATE 2 · O QUE A PESSOA FAZ ═══
              🔄 29/08 (pedido do Pedro) — passou a vir ANTES do endereço: quem
              cai no gate de cidade (fora de BH) já preencheu a categoria, dado
              importante pra estratégia de mkt quando a Legalizai chegar na
              cidade dela — antes ficava sujeito a alguém abandonar sem
              escolher, mesmo com o "completo" já exigindo os dois.
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
              onChange={(v) => {
                setCategoria(v || null);
                if (v !== FORA_LISTA_ID) setRegulamentada(null);
              }}
              opcoes={[
                ...PILLS.map((p) => ({
                  v: p.id,
                  // No MEI, as 3 sem ocupação ganham o rótulo na própria lista —
                  // a pessoa já lê o limite antes de escolher, e quem escolhe
                  // mesmo assim encontra a explicação completa logo abaixo.
                  label:
                    regimeMei && !categoriaTemMei(p.id)
                      ? `${p.label} (só como ME)`
                      : p.label,
                })),
                // 🔄 29/08 (pedido do Pedro) — substitui o link "Minha
                // atividade não está na lista" (que saía direto pra waitlist
                // genérica): agora é a última opção do próprio dropdown, em
                // coral, e escolher ela abre a pergunta de qual atividade
                // regulamentada de verdade — dado valioso pra mkt.
                { v: FORA_LISTA_ID, label: "Não encontrei minha categoria", destaque: "coral" },
              ]}
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

            {/* 🔄 29/08 (pedido do Pedro) — atividade fora do escopo: pede a
                atividade REGULAMENTADA de verdade (lista curta, só as mais
                comuns, ≤12) em vez de deixar o dado solto. Isso vira lead
                qualificado pra mkt, não só um "não sei". Logo em seguida (SEM
                título "Onde você está?" próprio, pra não somar mais um campo
                à toa) já vem o CEP: é a mesma pergunta de sempre, só que
                incorporada aqui embaixo pra reduzir seção. */}
            {atividadeForaLista && (
              <div className="mt-3 flex flex-col gap-3">
                <Select
                  valor={regulamentada ?? ""}
                  onChange={(v) => setRegulamentada(v || null)}
                  opcoes={REGULAMENTADAS}
                  placeholder="Qual é a sua atividade?"
                />
                {precisaDescreverOutra && (
                  <Campo rotulo="Qual é a sua atividade?">
                    <Texto
                      valor={outraAtividade}
                      onChange={setOutraAtividade}
                      placeholder="Descreve com suas palavras"
                    />
                  </Campo>
                )}
                <Campo rotulo="CEP" dica="A gente usa só pra identificar sua cidade.">
                  <Texto
                    valor={cep}
                    onChange={(v) => setCep(mascaraCep(v))}
                    placeholder="00000-000"
                    inputMode="numeric"
                  />
                </Campo>
                {endereco && (
                  <div className="rounded-md border border-border-hairline bg-surface-card p-3">
                    <p className="text-body font-semibold text-text-primary">
                      {endereco.municipio} · {endereco.uf}
                    </p>
                    <p className="text-caption text-text-tertiary">
                      É essa cidade que entra na fila.
                    </p>
                  </div>
                )}
                {/* 🔄 29/08 (pedido do Pedro) — título e corpo agora se
                    adaptam ao que falta atender (só categoria, ou categoria +
                    cidade), incorporando o texto que antes vinha numa
                    mensagem própria ("Onde você está?"). */}
                {cepCheio && (
                  <Aviso
                    variante="success"
                    titulo={
                      ehCepBh(cep)
                        ? "Ainda não atendemos essa categoria"
                        : "Ainda não atendemos sua categoria e cidade"
                    }
                  >
                    A gente está em expansão. Clicando abaixo, você já
                    garante uma condição especial pra quando a gente passar a
                    te atender. Te avisaremos!
                  </Aviso>
                )}
              </div>
            )}
          </div>

          {/* ═══ GATE 1 · ONDE A EMPRESA FICA ═══
              Substitui o E4 (gate de cidade), que era autodeclarado.
              🔄 29/08 (pedido do Pedro) — o caminho "não encontrei minha
              categoria" (`atividadeForaLista`) SAIU inteiro daqui: o CEP dele
              virou parte do bloco de categoria logo acima, pra reduzir seção.
              Esse bloco agora só existe pro caminho normal. */}
          {!atividadeForaLista && (
          <div>
            <p className="text-body-strong font-semibold mb-1">
              Onde ela vai ficar?
            </p>
            {/* 🔄 29/08 (pedido do Pedro) — texto enxuto, o anterior tinha
                repetição desnecessária ("é sobre o endereço da empresa, não
                sobre onde você mora"). */}
            <p className="text-caption text-text-secondary mb-3">
              {exigeBh
                ? "O endereço da sua empresa precisa ser em Belo Horizonte. Se mora fora, você pode utilizar o nosso."
                : "É o endereço que vai ficar no seu CNPJ, e pode ser o da sua casa. Como MEI, você abre de qualquer cidade do Brasil."}
            </p>

            {/* 🔄 29/08 (pedido do Pedro) — "Quero um endereço da Legalizai"
                sobe pra cima, "Tenho um endereço em BH" desce. Só ordem
                visual, nenhuma lógica muda. */}
            <div className="flex flex-col gap-2">
              {/* 🆕 28/08 — o endereço fiscal SOME no MEI, e não é economia de
                  tela: ele existe pra resolver o gate de BH ("não tenho
                  endereço em BH, e a empresa precisa ficar em BH"). O MEI não
                  tem gate de BH — abre de qualquer cidade — então o card
                  perderia a razão de existir e viraria upsell de algo que ele
                  não precisa. Some também o argumento legal: o MEI pode usar o
                  próprio endereço residencial como comercial (LC 123/2006), e
                  como não há análise de viabilidade, ninguém confere zoneamento
                  antes. Vender endereço a R$60/mês nesse cenário seria vender
                  solução pra problema que ele não tem. */}
              {!regimeMei && (
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
                {/* 🔄 29/08 (pedido do Pedro) — cortou "Serve inclusive pra
                    quem mora em outra cidade", redundante com o subtítulo
                    logo acima. */}
                <p
                  className={`text-caption mt-1.5 ${
                    enderecoProprio === false ? "text-text-on-brand/80" : "text-text-secondary"
                  }`}
                >
                  O endereço do nosso escritório em BH vira a sede da sua
                  empresa.
                </p>
              </button>
              )}

              {/* 🔄 29/08 (pedido do Pedro) — mora logo abaixo do card
                  Legalizai agora (antes aparecia lá embaixo, depois do card
                  de BH, porque vinha só no final do bloco condicional). Trocou
                  o `Aviso variante="warning"` (laranja, assustador pra uma
                  informação que não é problema) pelo mesmo card branco/
                  amigável do "Vale saber" (TriagemView). */}
              {enderecoProprio === false && (
                <div className="rounded-md border border-border-hairline bg-surface-card p-4">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-state-success-tint text-state-success-text">
                      <CheckMiniRegime />
                    </span>
                    <p className="text-caption text-text-secondary">
                      Essa será uma cobrança recorrente junto da sua
                      mensalidade. Quando chegar na parte do plano, você vai
                      identificar.
                    </p>
                  </div>
                </div>
              )}

              {/* 🔄 29/08 (pedido do Pedro) — mesmo formato do card Legalizai
                  (título + pill + subtítulo), estavam com cara muito
                  diferente um do outro. Pill mostra "Sem custo" no lugar do
                  preço. */}
              {!regimeMei && (
              <button
                onClick={() => setEnderecoProprio(true)}
                aria-pressed={enderecoProprio === true}
                className={`rounded-md border p-4 text-left transition-colors
                  ${
                    enderecoProprio === true
                      ? "border-action-primary bg-action-primary"
                      : "border-border-hairline bg-surface-card hover:border-border-strong"
                  }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`text-body font-semibold ${
                      enderecoProprio === true ? "text-text-on-brand" : "text-text-primary"
                    }`}
                  >
                    Tenho um endereço em Belo Horizonte
                  </span>
                  <span className="shrink-0 rounded-full bg-surface-dark px-2.5 py-1 text-micro font-semibold text-text-on-dark">
                    Sem custo
                  </span>
                </div>
                <p
                  className={`text-caption mt-1.5 ${
                    enderecoProprio === true ? "text-text-on-brand/80" : "text-text-secondary"
                  }`}
                >
                  Não acrescenta nada na sua mensalidade.
                </p>
              </button>
              )}
            </div>

            {/* Endereço próprio → pede o CEP de verdade. É AQUI que o gate de
                cidade acontece agora, com dado em vez de autodeclaração. */}
            {(enderecoProprio === true || regimeMei) && (
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
                  filaCidade ? (
                    <>
                      {/* 🆕 29/08 (pedido do Pedro) — cidade travada, só pra
                          visualização: já veio do CEP validado, não edita
                          de novo aqui. */}
                      {endereco && (
                        <div className="rounded-md border border-border-hairline bg-surface-card p-3">
                          <p className="text-body font-semibold text-text-primary">
                            {endereco.municipio} · {endereco.uf}
                          </p>
                          <p className="text-caption text-text-tertiary">
                            É essa cidade que entra na fila.
                          </p>
                        </div>
                      )}
                      <Aviso variante="success" titulo="Falta só confirmar aqui embaixo">
                        Clicando abaixo, você garante oferta especial quando a
                        gente conseguir te atender.
                      </Aviso>
                    </>
                  ) : (
                    <div className="rounded-md bg-state-success-tint p-4">
                      <p className="mb-1 text-body font-semibold text-state-success-text">
                        Ainda não chegamos na sua cidade
                      </p>
                      <p className="text-caption text-text-secondary">
                        Mas isso não te trava: clica em{" "}
                        <span className="font-semibold text-text-primary">
                          &ldquo;Quero um endereço da Legalizai&rdquo;
                        </span>{" "}
                        aqui em cima, e a empresa nasce em BH do mesmo jeito,
                        sem custo extra na abertura.
                      </p>
                      <button
                        type="button"
                        onClick={() => setFilaCidade(true)}
                        className="mt-3 block text-caption font-semibold text-text-primary underline underline-offset-4"
                      >
                        Quero abrir na minha cidade mesmo assim
                      </button>
                    </div>
                  )
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
                      {/* 🆕 29/08 (achado do Pedro) — faltava o campo,
                          só tinha Número. Mesmo padrão do E6 (`/conta`):
                          lado a lado, `min-w-0` pra não vazar o
                          placeholder mais longo. */}
                      <div className="flex gap-3">
                        <div className="min-w-0 flex-1">
                          <Campo rotulo="Número">
                            <Texto
                              valor={numero}
                              onChange={setNumero}
                              placeholder="123"
                              inputMode="numeric"
                            />
                          </Campo>
                        </div>
                        <div className="min-w-0 flex-1">
                          <Campo rotulo="Complemento">
                            <Texto
                              valor={complemento}
                              onChange={setComplemento}
                              placeholder="Complemento"
                            />
                          </Campo>
                        </div>
                      </div>
                    </>
                  )
                )}

                {/* 🔴 29/08 (pedido do Pedro) — o aviso "a prefeitura confirma
                    na viabilidade" saiu: fica pra depois quando a viabilidade
                    de verdade existir, mas o texto criava expectativa de
                    checagem que ninguém faz agora (mesmo racional do aviso
                    que já não existe no MEI, ver comentário abaixo). */}
                {cepValido && regimeMei && (
                  <Aviso variante="info" titulo="Pode ser o seu endereço de casa">
                    No MEI não existe consulta prévia de viabilidade, e em BH o
                    alvará é dispensado pras atividades de baixo risco. Você
                    declara o endereço e assume o compromisso de seguir as
                    regras do município, sem análise antes.
                  </Aviso>
                )}
              </div>
            )}
          </div>
          )}
        </Corpo>

        <Rodape>
          <Button full disabled={!completo} onClick={onSeguir}>
            {modoEspera ? "Me inscrever e garantir condição" : "Continuar"}
          </Button>
        </Rodape>
      </main>
    </>
  );
}
