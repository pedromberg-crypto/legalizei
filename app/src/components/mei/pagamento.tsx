"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Campo, Texto, Checkbox } from "@/components/ui/form";
import { CardNota } from "@/components/ui/card-nota";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { CUSTOS } from "@/lib/fiscal";
import { CardIconeMei, SeloOkMei } from "./_card-icone";
import { mascaraCpf, mascaraCep, mascaraTelefone, buscarCep, reais } from "./_formato";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M6 · PAGAMENTO + CONTRATO — no layout aprovado do E9.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09, redesenhada no mesmo dia (pedido do Pedro: *"traga os layouts de
 * ME aprovados, tipo forma de pagamento e talz"*).
 *
 * ─── DE ONDE VEM O LAYOUT ───────────────────────────────────────────────────
 * Do E9 (`PagamentoView` em `wizard-dinheiro.tsx`), na forma validada em
 * 01/09: os métodos como **cards de ícone 3D em grade de 2**, não como lista
 * de botões empilhados (era a mesma pergunta do E3.2 com outra gramática
 * visual, e o Pedro pediu uma só); o efeito da escolha num `CardNota` neutro
 * com check verde (era `Aviso` tingido, que dava peso de alerta a um texto que
 * só explica); os dados de cobrança em cards que **fecham com borda verde e
 * selo** conforme completam; e o CTA que DIZ O QUE FALTA em vez de ficar
 * travado e mudo.
 *
 * ⚠️ Reescrito, não importado: a trava de fronteira proíbe o ramo MEI de
 * importar tela de ME. Herda-se o desenho e os tokens, não o arquivo.
 *
 * ─── A DÍVIDA QUE ESTA TELA PAGA ────────────────────────────────────────────
 * Em 30/08 o E8 (`ContratoView`) foi eliminado do caminho ME: o aceite desceu
 * pro pagamento, igual à Contabilizei. A mudança estava certa pro ME — mas o
 * MEI tinha uma tela E8 PRÓPRIA, com cláusulas próprias, e ela morreu junto.
 * O que sobrou pro MEI no `/pagamento` compartilhado foi uma prop de preço
 * (`semTaxaJunta`) e o checkbox genérico; as 2 cláusulas que só existiam no
 * contrato dele **sumiram sem ninguém notar** (achado do levantamento de
 * 07/09). Elas voltam aqui:
 *
 *   1. **O QUE É E O QUE NÃO É NOSSO** — cláusula mais importante do contrato
 *      de MEI, porque descreve uma limitação LEGAL, não comercial: não existe
 *      API nem procuração que permita registrar MEI por terceiro, e a senha
 *      gov.br é pessoal e intransferível por Termo de Uso.
 *   2. **O CERTIFICADO FICA POR SUA CONTA** (decisão do Pedro, 28/08).
 *
 * ⚠️ NÃO EXISTE taxa de governo nesta tela, e a ausência é a regra: a abertura
 * do MEI é gratuita em todas as instâncias. A cláusula de não-reembolso da
 * taxa, que o ME tem, não existe aqui porque não há taxa pra não reembolsar.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type MetodoMei = "cartao" | "pix";

/**
 * Os 2 métodos, com o EFEITO de cada escolha.
 *
 * 🔴 Só cartão e Pix, mesma decisão do Pedro em 01/09 pro ME: no Asaas o
 * boleto emitido já vem com QR de Pix embutido (boleto híbrido), então
 * oferecer os dois separados era pedir pra pessoa escolher entre a mesma
 * coisa. O nome do card diz "Pix e Boleto" pra quem procura o boleto não achar
 * que não tem.
 *
 * ✍️ A copy fala do PAGAMENTO, que a gente controla, nunca do prazo do
 * registro — que no MEI depende do titular clicar no Portal. Prometer "sua
 * empresa sai hoje" aqui seria a mesma promessa impossível que a auditoria de
 * 28/08 tirou da A2.
 */
const METODOS: {
  id: MetodoMei;
  nome: string;
  coral: string;
  creme: string;
  aviso: string;
  efeito: string;
}[] = [
  {
    id: "cartao",
    nome: "Cartão de crédito",
    coral: "/icones/metodo-cartao-coral.png",
    creme: "/icones/metodo-cartao-creme.png",
    aviso: "O caminho mais rápido",
    efeito:
      "É a forma de pagamento que costuma liberar a conferência antes, sem espera de compensação.",
  },
  {
    id: "pix",
    nome: "Pix e Boleto",
    coral: "/icones/metodo-pix-coral.png",
    creme: "/icones/metodo-pix-creme.png",
    aviso: "Pelo Pix, o caminho fica livre em minutos",
    efeito:
      "O Pix cai rápido, então a conferência não fica parada esperando o pagamento. Se preferir boleto, ele compensa em 1 a 3 dias úteis.",
  },
];

/** As cláusulas do contrato do MEI, abertas na própria tela. */
const CLAUSULAS_MEI = [
  {
    titulo: "O que a gente faz, e o que só você pode fazer",
    texto:
      "A gente confere seus dados, escolhe com você a ocupação certa e entrega cada campo pronto, na ordem do formulário oficial. O clique final no Portal do Empreendedor é seu, obrigatoriamente: o governo não permite que ninguém registre um MEI no lugar de outra pessoa, e sua conta gov.br é pessoal e intransferível.",
  },
  {
    titulo: "O certificado digital fica por sua conta",
    texto: `Ele não é necessário pra abrir o MEI e não está incluso no plano. Se você quiser um depois, a gente indica a certificadora parceira: custa em torno de ${reais(CUSTOS.CERTIFICADO_PRECO)} por ano, pagos direto lá. Com ele, a gente resolve suas guias e obrigações sem precisar da sua senha a cada vez.`,
  },
  {
    titulo: "Abrir o MEI não custa nada, em instância nenhuma",
    texto:
      "O registro é gratuito por lei. A gente não cobra honorário de abertura, e não existe taxa de governo pra repassar. O que você paga é a mensalidade do plano, que começa a valer quando seu CNPJ sai.",
  },
  {
    titulo: "Permanência e cancelamento",
    texto: `Período mínimo de ${CUSTOS.FIDELIDADE_MESES} meses, contado da emissão do CNPJ. Cancelando antes, a multa é de ${Math.round(CUSTOS.MULTA_CANCELAMENTO_PCT * 100)}% sobre as mensalidades que ainda faltam, nunca sobre o que já foi pago.`,
  },
];

export interface DadosPagamentoMei {
  /* Cartão */
  numeroCartao: string;
  nomeImpresso: string;
  validade: string;
  cvv: string;
  /* Titular / quem paga */
  titularNome: string;
  titularCpf: string;
  titularEmail: string;
  titularTelefone: string;
  /* Endereço da fatura (só cartão: exigência do `creditCardHolderInfo`) */
  cep: string;
  numero: string;
  complemento: string;
}

export const PAGAMENTO_MEI_VAZIO: DadosPagamentoMei = {
  numeroCartao: "",
  nomeImpresso: "",
  validade: "",
  cvv: "",
  titularNome: "",
  titularCpf: "",
  titularEmail: "",
  titularTelefone: "",
  cep: "",
  numero: "",
  complemento: "",
};

const digitos = (v: string) => v.replace(/\D/g, "").length;

export function dadosPagamentoMeiOk(d: DadosPagamentoMei, metodo: MetodoMei | null) {
  if (!metodo) return false;
  const titular =
    d.titularNome.trim().length > 2 &&
    digitos(d.titularCpf) === 11 &&
    /.+@.+\..+/.test(d.titularEmail.trim());
  if (metodo !== "cartao") return titular;
  return (
    titular &&
    digitos(d.titularTelefone) >= 10 &&
    digitos(d.numeroCartao) >= 13 &&
    d.nomeImpresso.trim().length > 2 &&
    /^\d{2}\/\d{2}$/.test(d.validade) &&
    digitos(d.cvv) >= 3 &&
    digitos(d.cep) === 8 &&
    d.numero.trim() !== ""
  );
}

function mascaraCartao(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}
function mascaraValidade(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export function PagamentoMeiView({
  meta,
  metodo,
  setMetodo,
  dados,
  setDados,
  aceito,
  setAceito,
  contratoAberto,
  setContratoAberto,
  recusado = false,
  onPagar,
  onVoltar,
}: {
  /** Nome de PRA ONDE O VOLTAR LEVA (vem de `mei-flow.metaDoVoltar`). */
  meta: string;
  metodo: MetodoMei | null;
  setMetodo: (v: MetodoMei) => void;
  dados: DadosPagamentoMei;
  setDados: (d: DadosPagamentoMei) => void;
  aceito: boolean;
  setAceito: (v: boolean) => void;
  /** O contrato aberto na própria tela, não num PDF que ninguém abre. */
  contratoAberto: boolean;
  setContratoAberto: (v: boolean) => void;
  /** Volta de uma recusa do banco (M6 depois do splash de recusado). */
  recusado?: boolean;
  onPagar?: () => void;
  onVoltar?: () => void;
}) {
  const cartao = metodo === "cartao";
  const escolhido = METODOS.find((m) => m.id === metodo) ?? null;
  const set = <K extends keyof DadosPagamentoMei>(k: K, v: DadosPagamentoMei[K]) =>
    setDados({ ...dados, [k]: v });

  const enderecoFatura = buscarCep(dados.cep.replace(/\D/g, ""));
  const dadosOk = dadosPagamentoMeiOk(dados, metodo);

  /* As bordas verdes por bloco usam as MESMAS regras que liberam o CTA — selo
     verde com campo obrigatório vazio viraria mentira. */
  const blocoCartaoOk =
    digitos(dados.numeroCartao) >= 13 &&
    dados.nomeImpresso.trim().length > 2 &&
    /^\d{2}\/\d{2}$/.test(dados.validade) &&
    digitos(dados.cvv) >= 3;
  const blocoTitularOk =
    dados.titularNome.trim().length > 2 &&
    digitos(dados.titularCpf) === 11 &&
    /.+@.+\..+/.test(dados.titularEmail.trim()) &&
    (!cartao || digitos(dados.titularTelefone) >= 10);
  const blocoEnderecoOk = digitos(dados.cep) === 8 && dados.numero.trim() !== "";
  const borda = (ok: boolean) => (ok ? "border-state-success" : "");

  return (
    <>
      <TelaHeader meta={meta} onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo
          sub={`${reais(CUSTOS.MENSALIDADE_MEI)} hoje, depois esse valor mensal.`}
        >
          Falta só isso
        </Titulo>

        <Corpo>
          {recusado && (
            <Aviso neutro variante="warning" titulo="O pagamento não passou">
              O banco recusou a cobrança, e isso raramente é problema seu. Dá
              pra tentar outro cartão, ou trocar pra Pix, que cai na hora.
            </Aviso>
          )}

          {/* ═══ A FORMA DE PAGAMENTO ═══════════════════════════════════════
              Grade de 2 com os cards de ícone 3D — o mesmo gesto do E3.2,
              unificado em 01/09 pra não existirem duas gramáticas visuais
              pra "escolha um dos dois" no mesmo flow. */}
          <div>
            <p className="text-caption font-semibold text-text-primary mb-2">
              Como você prefere pagar
            </p>
            <div className="grid grid-cols-2 gap-3">
              {METODOS.map((m) => (
                <CardIconeMei
                  key={m.id}
                  label={m.nome}
                  iconeCoral={m.coral}
                  iconeCreme={m.creme}
                  selecionado={metodo === m.id}
                  onClick={() => setMetodo(m.id)}
                  tamanho={58}
                />
              ))}
            </div>
          </div>

          {/* O EFEITO DA ESCOLHA, EM TEMPO REAL. `CardNota` neutro com check
              verde, não bloco tingido: aqui não há alerta nenhum, é informação
              sobre a escolha que a pessoa acabou de fazer. */}
          {escolhido && (
            <CardNota variante="positivo" titulo={escolhido.aviso}>
              {escolhido.efeito}
            </CardNota>
          )}

          {/* ═══ OS DADOS DE COBRANÇA ═══════════════════════════════════════ */}
          {metodo && (
            <div className="flex flex-col gap-4">
              {cartao && (
                <Card className={`relative ${borda(blocoCartaoOk)}`}>
                  {blocoCartaoOk && <SeloOkMei />}
                  <p className="text-body font-semibold text-text-primary mb-3">
                    Dados do cartão
                  </p>
                  <div className="flex flex-col gap-3">
                    <Campo rotulo="Número do cartão">
                      <Texto
                        valor={dados.numeroCartao}
                        onChange={(v) => set("numeroCartao", mascaraCartao(v))}
                        inputMode="numeric"
                        maxLength={19}
                        placeholder="0000 0000 0000 0000"
                      />
                    </Campo>
                    <Campo
                      rotulo="Nome impresso no cartão"
                      dica="Igualzinho ao que está no plástico, sem acento se lá não tiver."
                    >
                      <Texto
                        valor={dados.nomeImpresso}
                        onChange={(v) => set("nomeImpresso", v.toUpperCase())}
                        placeholder="ANA B RAMOS"
                      />
                    </Campo>
                    <div className="grid grid-cols-2 gap-3">
                      <Campo rotulo="Validade">
                        <Texto
                          valor={dados.validade}
                          onChange={(v) => set("validade", mascaraValidade(v))}
                          inputMode="numeric"
                          maxLength={5}
                          placeholder="MM/AA"
                        />
                      </Campo>
                      <Campo rotulo="CVV">
                        <Texto
                          valor={dados.cvv}
                          onChange={(v) => set("cvv", v.replace(/\D/g, "").slice(0, 4))}
                          inputMode="numeric"
                          maxLength={4}
                          placeholder="123"
                        />
                      </Campo>
                    </div>
                  </div>
                </Card>
              )}

              <Card className={`relative ${borda(blocoTitularOk)}`}>
                {blocoTitularOk && <SeloOkMei />}
                <p className="text-body font-semibold text-text-primary">
                  {cartao ? "Titular do cartão" : "Quem vai pagar"}
                </p>
                {/* Diz de onde veio o que já está escrito, e que dá pra trocar.
                    Sem isso, campo preenchido sozinho parece dado travado. */}
                <p className="text-micro text-text-tertiary mt-1 mb-3">
                  {cartao
                    ? "Já preenchemos com o que você informou. Se o cartão for de outra pessoa, é só trocar aqui: o banco compara esses dados com o cadastro dele."
                    : "Já preenchemos com o que você informou. Dá pra corrigir qualquer campo."}
                </p>
                <div className="flex flex-col gap-3">
                  <Campo rotulo={cartao ? "Nome do titular do cartão" : "Nome completo"}>
                    <Texto
                      valor={dados.titularNome}
                      onChange={(v) => set("titularNome", v)}
                      placeholder="Nome de quem paga"
                    />
                  </Campo>
                  {/* ⚠️ NÃO é duplicata do CPF do cadastro: aquele é o de quem
                      ABRE o MEI (e é o que a Receita cruza); este é o de quem
                      PAGA, e pode ser outra pessoa. */}
                  <Campo
                    rotulo={cartao ? "CPF do titular do cartão" : "CPF de quem paga"}
                    dica="Pode ser diferente do seu, se quem paga for outra pessoa."
                  >
                    <Texto
                      valor={dados.titularCpf}
                      onChange={(v) => set("titularCpf", mascaraCpf(v))}
                      inputMode="numeric"
                      maxLength={14}
                      placeholder="000.000.000-00"
                    />
                  </Campo>
                  <Campo
                    rotulo="E-mail"
                    dica={cartao ? undefined : "É pra onde vai o link do pagamento e o comprovante."}
                  >
                    <Texto
                      valor={dados.titularEmail}
                      onChange={(v) => set("titularEmail", v)}
                      inputMode="email"
                      type="email"
                      placeholder="voce@email.com"
                    />
                  </Campo>
                  <Campo rotulo={cartao ? "Telefone" : "Telefone (opcional)"}>
                    <Texto
                      valor={dados.titularTelefone}
                      onChange={(v) => set("titularTelefone", mascaraTelefone(v))}
                      inputMode="tel"
                      maxLength={15}
                      placeholder="(31) 90000-0000"
                    />
                  </Campo>
                </div>
              </Card>

              {/* Endereço só no cartão: exigência do `creditCardHolderInfo`.
                  Pix e boleto do Asaas se viram com nome + CPF, então pedir
                  CEP ali seria formulário que a gente inventou. */}
              {cartao && (
                <Card className={`relative ${borda(blocoEnderecoOk)}`}>
                  {blocoEnderecoOk && <SeloOkMei />}
                  <p className="text-body font-semibold text-text-primary">
                    Endereço da fatura
                  </p>
                  <p className="text-micro text-text-tertiary mt-1 mb-3">
                    Veio do endereço que você já informou. Se a fatura do cartão
                    vai pra outro lugar, troque aqui.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Campo rotulo="CEP">
                      <Texto
                        valor={dados.cep}
                        onChange={(v) => set("cep", mascaraCep(v))}
                        inputMode="numeric"
                        maxLength={9}
                        placeholder="00000-000"
                      />
                    </Campo>
                    {/* O endereço resolvido pelo CEP, read-only: é CONFIRMAÇÃO
                        visual. Sem isso a pessoa digita 8 números e segue no
                        escuro, e CEP errado só apareceria como recusa do
                        emissor, depois do clique em pagar. */}
                    {enderecoFatura && (
                      <div className="rounded-md border border-border-hairline bg-surface-card p-3">
                        <p className="text-micro text-text-tertiary">Endereço</p>
                        <p className="text-caption text-text-primary">
                          {enderecoFatura.logradouro} · {enderecoFatura.bairro} ·{" "}
                          {enderecoFatura.municipio}/{enderecoFatura.uf}
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <Campo rotulo="Número">
                        <Texto
                          valor={dados.numero}
                          onChange={(v) => set("numero", v)}
                          inputMode="numeric"
                          placeholder="123"
                        />
                      </Campo>
                      <Campo rotulo="Complemento">
                        <Texto
                          valor={dados.complemento}
                          onChange={(v) => set("complemento", v)}
                          placeholder="Apto, sala"
                        />
                      </Campo>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* ═══ O CONTRATO ═════════════════════════════════════════════════
              Aberto AQUI e não num link: as 2 cláusulas que importam no MEI
              descrevem uma limitação legal, e limitação escondida atrás de um
              "leia o contrato completo" é limitação que ninguém leu. O botão
              segue o mesmo desenho do E9 (secundário, altura de CTA). */}
          <button
            type="button"
            onClick={() => setContratoAberto(!contratoAberto)}
            className="flex min-h-12 w-full items-center justify-center rounded-md border
                       border-border-strong bg-surface-card px-4 text-body font-semibold
                       text-text-primary transition-colors hover:bg-surface-alt"
          >
            {contratoAberto ? "Fechar o contrato" : "Ler o contrato completo"}
          </button>

          {contratoAberto && (
            <Card>
              <div className="flex flex-col gap-4">
                {CLAUSULAS_MEI.map((c) => (
                  <div key={c.titulo}>
                    <p className="text-caption font-semibold text-text-primary mb-0.5">
                      {c.titulo}
                    </p>
                    <p className="text-caption text-text-secondary">{c.texto}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Checkbox checked={aceito} onChange={setAceito}>
            {/* Negrito só no ATO: é o gesto jurídico que precisa saltar. */}
            <strong className="font-bold">Li e aceito o contrato</strong> de
            serviço da Legalizai, e entendi que o registro no Portal do
            Empreendedor é feito por mim.
          </Checkbox>
        </Corpo>

        <Rodape>
          {/* 🔄 O BOTÃO DIZ O QUE FALTA (régua de 04/09, já aplicada no A1,
              C0.0, C3, C4 e E9). Travado e mudo, a pessoa tenta, nada acontece
              e a tela não aponta nada. A ordem importa: falta de DADO vem
              antes do aceite, porque é o que se resolve rolando a tela; o
              aceite é o último gesto. */}
          <Button full disabled={!dadosOk || !aceito} onClick={onPagar}>
            {!metodo
              ? "Escolha como quer pagar"
              : !dadosOk
                ? "Complete os dados de pagamento"
                : !aceito
                  ? "Falta aceitar as condições"
                  : `Pagar ${reais(CUSTOS.MENSALIDADE_MEI)}`}
          </Button>
        </Rodape>
      </main>
    </>
  );
}
