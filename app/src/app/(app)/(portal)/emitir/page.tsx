"use client";

import { Suspense, useState, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Rodape } from "@/components/ui/tela";
import { ResumoSheet, type ResumoNota } from "./resumo-sheet";
import { ClientesSheet } from "./clientes-sheet";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EMITIR NF-e (P6) — CTA central da navbar. Drill-down, sem navbar.
 * ═══════════════════════════════════════════════════════════════════════════
 * Pede só FAVORECIDO + VALOR. O serviço vem TRAVADO do cadastro (decisão A,
 * 24/07): sem "Alterar" — a atividade é a registrada, mexer nisso é risco fiscal
 * pro leigo. (Multi-CNAE guiado fica pra depois.)
 *
 * Favorecido: bolhas ordenadas por FREQUÊNCIA de emissão (o mais recorrente
 * primeiro — resolve o scroll lateral quando a base cresce). "Novo cliente" abre
 * uma ficha com opção de salvar na base. "Consumidor final" = B2C.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type Cliente = {
  id: string;
  tipo: "PJ" | "PF";
  ini: string;
  l1: string;
  l2: string;
  nome: string;
  doc: string;
  cidade: string;
  emissoes: number;
};

// Ordenados por nº de emissões (mais recorrente primeiro).
const CLIENTES: Cliente[] = (
  [
    { id: "tf", tipo: "PJ", ini: "TF", l1: "TechFlow", l2: "Software", nome: "TechFlow Software Ltda", doc: "CNPJ 98.765.432/0001-10", cidade: "Contagem/MG", emissoes: 12 },
    { id: "pp", tipo: "PJ", ini: "PP", l1: "Padaria", l2: "Pão Quente", nome: "Padaria Pão Quente Ltda", doc: "CNPJ 12.345.678/0001-90", cidade: "Belo Horizonte/MG", emissoes: 8 },
    { id: "mc", tipo: "PF", ini: "MC", l1: "Maria", l2: "Costa", nome: "Maria Costa", doc: "CPF 123.456.789-00", cidade: "Belo Horizonte/MG", emissoes: 5 },
    { id: "jl", tipo: "PF", ini: "JL", l1: "João", l2: "Lima", nome: "João Lima", doc: "CPF 456.789.123-00", cidade: "Nova Lima/MG", emissoes: 3 },
  ] as Cliente[]
).sort((a, b) => b.emissoes - a.emissoes);

// Valores recentes POR CLIENTE (mock, centavos, mais recente primeiro). No real:
// histórico de NF do próprio cliente. Viram pills de clique rápido no valor.
const VALORES_POR_CLIENTE: Record<string, number[]> = {
  tf: [180000, 90000],
  pp: [50000, 45000],
  mc: [30000],
  jl: [120000, 60000],
};

// Última NF emitida (mock) — alimenta o atalho "Repetir última nota".
const ULTIMA_NF = { clienteId: "pp", valorCentavos: 50000 };

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/**
 * 🆕 06/08 (reunião Rua Satélite 19) — TRAVA DE RETROATIVIDADE.
 * Decisão travada: só emite de hoje pra frente dentro do app. Retroagir
 * bagunça a média dos 12 meses (recalcula alíquota pra trás inteira) e não
 * escala em suporte manual — cliente que perdeu o prazo é orientado a falar
 * com a gente, não a forçar uma data velha por aqui.
 */
function hojeISO(): string {
  return new Date().toISOString().slice(0, 10);
}
function clampFutura(v: string): string {
  const min = hojeISO();
  return v && v < min ? min : v;
}
function formatDataLabel(iso: string): string {
  if (!iso) return "";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Máscaras progressivas (formatam durante a digitação).
function maskCNPJ(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 14);
  if (d.length > 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
  if (d.length > 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  if (d.length > 5) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length > 2) return `${d.slice(0, 2)}.${d.slice(2)}`;
  return d;
}
function maskCPF(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length > 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  if (d.length > 6) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  if (d.length > 3) return `${d.slice(0, 3)}.${d.slice(3)}`;
  return d;
}

export default function EmitirPage() {
  return (
    <Suspense fallback={null}>
      <EmitirForm />
    </Suspense>
  );
}

function EmitirForm() {
  // "Corrigir e reemitir" (vindo de uma nota recusada, P7): pré-preenche o
  // favorecido + valor e mostra o motivo, pra corrigir o dado que falhou.
  const sp = useSearchParams();
  const corrigir = sp.get("corrigir") === "1";
  const motivo = sp.get("motivo") ?? "";

  const [cliente, setCliente] = useState<string | null>(
    corrigir ? sp.get("cliente") : null,
  );
  const [valor, setValor] = useState(corrigir ? (sp.get("valor") ?? "") : "");
  const [data, setData] = useState(hojeISO); // trava hoje/futuro — ver `clampFutura`
  const [resumoAberto, setResumoAberto] = useState(false); // sheet de revisão/emissão
  const [buscaAberta, setBuscaAberta] = useState(false); // sheet "ver todos" clientes

  // Ficha do novo cliente
  const [novoTipo, setNovoTipo] = useState<"PJ" | "PF">("PJ");
  const [novoDoc, setNovoDoc] = useState(""); // CNPJ/CPF — o 1º campo, a chave
  const [novoNome, setNovoNome] = useState(""); // razão social / nome
  const [novoEndereco, setNovoEndereco] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novoTelefone, setNovoTelefone] = useState("");
  const [situacao, setSituacao] = useState<"ativa" | "baixada" | null>(null);
  const [buscou, setBuscou] = useState(false); // rodou a consulta (CNPJ→Receita)
  const [salvarNaBase, setSalvarNaBase] = useState(true);

  // Mock. No real: o CNPJ vai pra API pública oficial (o mesmo dado do cartão
  // CNPJ, aberto e gratuito) e volta com TUDO — razão, endereço, e-mail,
  // telefone, situação.
  const buscarPelo = (documento: string) => {
    const digits = documento.replace(/\D/g, "");
    if (digits.length < 8) return;
    // Demo: CNPJ começando com "00" simula BAIXADA (pra ver o aviso); resto = ativa.
    const baixada = digits.startsWith("00");
    setNovoNome("Studio Alfa Comunicação Ltda");
    setNovoEndereco("Av. do Contorno, 4500 · Funcionários · Belo Horizonte/MG · 30110-090");
    setNovoEmail("contato@studioalfa.com.br");
    setNovoTelefone("(31) 3555-0100");
    setSituacao(baixada ? "baixada" : "ativa");
    setBuscou(true);
  };

  const trocarTipo = (t: "PJ" | "PF") => {
    setNovoTipo(t);
    setBuscou(false);
    setSituacao(null);
    setNovoDoc("");
    setNovoNome("");
    setNovoEndereco("");
    setNovoEmail("");
    setNovoTelefone("");
  };

  const numero = Number(valor.replace(/\D/g, "")) / 100;
  const temValor = numero > 0;

  const favorecidoOk =
    cliente === "novo" ? novoDoc.trim() !== "" && novoNome.trim() !== "" : true;
  const podeEmitir = temValor && cliente !== null && favorecidoOk;

  // Rótulo do favorecido pro resumo do sheet (o que a pessoa revê antes de emitir).
  const favObj = CLIENTES.find((c) => c.id === cliente) ?? null;
  const favorecidoLabel =
    cliente === "sem"
      ? "Consumidor final"
      : cliente === "novo"
        ? novoNome.trim() || "Novo cliente"
        : (favObj?.nome ?? "");
  const favorecidoSub =
    cliente === "sem"
      ? "Nota sem tomador (B2C)"
      : cliente === "novo"
        ? novoDoc.trim() || undefined
        : favObj
          ? `${favObj.doc} · ${favObj.cidade}`
          : undefined;

  const dadosResumo: ResumoNota = {
    favorecido: favorecidoLabel,
    favorecidoSub,
    servico: "Marketing e publicidade",
    servicoMeta: "CNAE 7319-0/04 · Alíquota 6%",
    valor: numero,
    dataLabel: formatDataLabel(data),
  };

  // "Emitir outra": zera o formulário e fecha o sheet (fase enviada).
  const reemitir = () => {
    setResumoAberto(false);
    setCliente(null);
    setValor("");
    setData(hojeISO());
    trocarTipo("PJ");
    setSalvarNaBase(true);
  };

  // Valores recentes DO cliente selecionado (dedup, no máx 2) — pills de valor.
  const valoresCliente = cliente
    ? [...new Set(VALORES_POR_CLIENTE[cliente] ?? [])].slice(0, 2)
    : [];

  // Atalho "repetir última nota" (só na tela fresca, antes de tocar em nada).
  const ultimaNfCliente = CLIENTES.find((c) => c.id === ULTIMA_NF.clienteId) ?? null;
  const repetirUltima = () => {
    setCliente(ULTIMA_NF.clienteId);
    setValor(String(ULTIMA_NF.valorCentavos));
  };

  return (
    <>
      <header className="flex items-center gap-1.5 pb-4 pt-6">
        <Link
          href="/home-campea"
          aria-label="Voltar"
          className="-ml-1.5 flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-alt"
        >
          <SetaVoltar />
        </Link>
        <p className="text-micro text-text-tertiary">Emitir nota</p>
      </header>

      <main className="app-main">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-6 pb-4">
            {/* ── Corrigindo uma nota recusada (vindo do P7) ── */}
            {corrigir && (
              <div className="flex items-start gap-2.5 rounded-2xl bg-state-warning-tint p-3">
                <span className="mt-0.5 shrink-0 text-state-warning-text">
                  <Alerta />
                </span>
                <div className="min-w-0">
                  <p className="text-caption font-semibold text-state-warning-text">
                    Corrigindo uma nota recusada
                  </p>
                  <p className="mt-0.5 text-micro text-text-secondary">
                    {motivo || "Confira os dados do favorecido e reemita."}
                  </p>
                </div>
              </div>
            )}

            {/* ── Repetir última nota (atalho — só na tela fresca) ──
                Cobrança recorrente é a emissão mais comum: 1 toque preenche
                cliente + valor da última. Some assim que ele toca em algo. */}
            {!cliente && valor === "" && ultimaNfCliente && (
              <button
                type="button"
                onClick={repetirUltima}
                className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3 text-left transition-colors hover:border-border-strong active:bg-surface-alt"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-tint-brand text-action-primary-sm">
                  <Repetir />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-caption font-semibold text-text-primary">
                    Repetir última nota
                  </span>
                  <span className="block truncate text-micro text-text-tertiary">
                    {ultimaNfCliente.nome} · {formatBRL(ULTIMA_NF.valorCentavos / 100)}
                  </span>
                </span>
                <span className="shrink-0 text-text-tertiary">
                  <ChevronDir />
                </span>
              </button>
            )}

            {/* ── Favorecido ── */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-body-strong font-semibold text-text-primary">
                  Pra quem é a nota?
                </p>
                {/* Discreto: as bolhas mostram os recorrentes; "Ver todos" abre
                    a base inteira, pesquisável (resolve base grande sem poluir). */}
                <button
                  type="button"
                  onClick={() => setBuscaAberta(true)}
                  className="flex shrink-0 items-center gap-1 text-caption font-semibold text-action-primary-sm"
                >
                  <LupaMini /> Ver todos
                </button>
              </div>
              <div className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <ClienteBolha ativo={cliente === "novo"} onClick={() => setCliente("novo")} ini={<Mais />} l1="Novo" l2="cliente" tracejado />
                <ClienteBolha ativo={cliente === "sem"} onClick={() => setCliente("sem")} ini={<Pessoa />} l1="Consumidor" l2="final" />
                {CLIENTES.map((c) => (
                  <ClienteBolha key={c.id} ativo={cliente === c.id} onClick={() => setCliente(c.id)} ini={c.ini} l1={c.l1} l2={c.l2} />
                ))}
              </div>
            </div>

            {/* ── Confirmação / ficha do favorecido (tempo real) ── */}
            {cliente === "novo" ? (
              <FichaNovoCliente
                tipo={novoTipo}
                setTipo={trocarTipo}
                doc={novoDoc}
                setDoc={setNovoDoc}
                nome={novoNome}
                setNome={setNovoNome}
                endereco={novoEndereco}
                setEndereco={setNovoEndereco}
                email={novoEmail}
                setEmail={setNovoEmail}
                telefone={novoTelefone}
                setTelefone={setNovoTelefone}
                situacao={situacao}
                buscou={buscou}
                onBuscar={buscarPelo}
                salvar={salvarNaBase}
                setSalvar={setSalvarNaBase}
              />
            ) : cliente ? (
              <CardFavorecido cliente={cliente} obj={CLIENTES.find((c) => c.id === cliente) ?? null} />
            ) : null}

            {/* ── Valor ── */}
            <div>
              <p className="mb-2 text-body-strong font-semibold text-text-primary">
                Qual o valor?
              </p>
              <div className="flex items-baseline gap-2 rounded-2xl border border-border-hairline bg-surface-card p-4">
                <span className="text-h2 text-text-tertiary">R$</span>
                <input
                  value={valor === "" ? "" : formatBRL(numero).replace("R$", "").trim()}
                  onChange={(e) => setValor(e.target.value)}
                  inputMode="numeric"
                  placeholder="0,00"
                  aria-label="Valor da nota"
                  className="w-full bg-transparent text-display font-bold text-text-primary outline-none placeholder:text-text-muted"
                />
              </div>
              {temValor ? (
                // O imposto NÃO é afirmado aqui: no Simples é DAS mensal sobre
                // receita, não retenção por nota. A aba Impostos cobre com dado
                // assertivo; aqui, só o ponteiro (observação, não número-guru).
                <p className="mt-2 text-caption text-text-secondary">
                  Os impostos dessa nota você acompanha na aba{" "}
                  <span className="font-semibold text-text-primary">Impostos</span>.
                </p>
              ) : valoresCliente.length > 0 ? (
                // Clique rápido: últimos valores DESSE cliente (só quando há um
                // com histórico; consumidor final / novo cliente não têm).
                <div className="mt-3">
                  <p className="mb-2 text-micro text-text-tertiary">
                    Últimos valores desse cliente
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {valoresCliente.map((centavos) => (
                      <button
                        key={centavos}
                        type="button"
                        onClick={() => setValor(String(centavos))}
                        className="rounded-full border border-border-hairline bg-surface-card px-3 py-1.5 text-caption text-text-secondary transition-colors hover:border-border-strong active:bg-surface-alt"
                      >
                        {formatBRL(centavos / 100)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* ── Data da nota: trava hoje/futuro (Rua Satélite 19, 06/08) ──
                Retroagir bagunça a média dos 12 meses do Simples inteira pra
                trás — a orientação pra quem perdeu o prazo é falar com a
                gente, não forçar uma data velha por aqui. */}
            <div>
              <p className="mb-2 text-body-strong font-semibold text-text-primary">
                Data da nota
              </p>
              <input
                type="date"
                value={data}
                min={hojeISO()}
                onChange={(e) => setData(clampFutura(e.target.value))}
                aria-label="Data da nota"
                className="w-full rounded-2xl border border-border-hairline bg-surface-card px-4 py-3 text-body text-text-primary outline-none focus:border-border-focus"
              />
              <p className="mt-2 text-caption text-text-secondary">
                Só dá pra emitir de hoje pra frente. Perdeu o prazo de um mês
                fechado? Fala com a gente antes de emitir.
              </p>
            </div>

            {/* ── O serviço: TRAVADO no cadastro (decisão A, sem "Alterar") ── */}
            <div>
              <p className="mb-2 text-body-strong font-semibold text-text-primary">
                O serviço
              </p>
              <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
                <p className="text-caption font-semibold text-text-primary">
                  Marketing e publicidade
                </p>
                <p className="text-micro text-text-tertiary mt-0.5">
                  CNAE 7319-0/04 · Serviço 17.06 · Alíquota 6%
                </p>
                <p className="mt-3 border-t border-border-hairline pt-3 text-micro text-text-tertiary">
                  É a atividade do seu cadastro, e é isso que a gente declara. Os
                  códigos que a prefeitura exige ficam por nossa conta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* O CTA de trás REVISA (não emite): abre o sheet com o resumo. Emitir de
          fato é o botão de dentro do sheet — por isso este mudou de "Emitir"
          pra "Revisar" (dois "emitir" lado a lado confundiriam). */}
      <Rodape>
        <Button
          variant="primary"
          full
          disabled={!podeEmitir}
          onClick={() => setResumoAberto(true)}
        >
          {podeEmitir ? `Revisar nota de ${formatBRL(numero)}` : "Revisar nota"}
        </Button>
      </Rodape>

      {resumoAberto && (
        <ResumoSheet
          dados={dadosResumo}
          onFechar={() => setResumoAberto(false)}
          onReemitir={reemitir}
        />
      )}

      {buscaAberta && (
        <ClientesSheet
          clientes={CLIENTES}
          selecionado={cliente}
          onSelect={(id) => {
            setCliente(id);
            setBuscaAberta(false);
          }}
          onFechar={() => setBuscaAberta(false)}
        />
      )}
    </>
  );
}

/* ─── Ficha do NOVO cliente ──────────────────────────────────────────────────
   PJ: CNPJ é o 1º campo e a CHAVE — razão social + endereço vêm da Receita
   (autofill, marcados "✓ Receita"). Manual sobra só o e-mail.
   PF: CPF não puxa nada (LGPD) → tudo manual (o CEP ajudaria no endereço, v-next).
   O "Ler cartão CNPJ" aceita foto OU arquivo: a IA acha o número no que subir. */
function FichaNovoCliente({
  tipo,
  setTipo,
  doc,
  setDoc,
  nome,
  setNome,
  endereco,
  setEndereco,
  email,
  setEmail,
  telefone,
  setTelefone,
  situacao,
  buscou,
  onBuscar,
  salvar,
  setSalvar,
}: {
  tipo: "PJ" | "PF";
  setTipo: (t: "PJ" | "PF") => void;
  doc: string;
  setDoc: (v: string) => void;
  nome: string;
  setNome: (v: string) => void;
  endereco: string;
  setEndereco: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  telefone: string;
  setTelefone: (v: string) => void;
  situacao: "ativa" | "baixada" | null;
  buscou: boolean;
  onBuscar: (doc: string) => void;
  salvar: boolean;
  setSalvar: (v: boolean) => void;
}) {
  const ehPJ = tipo === "PJ";
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border-hairline bg-surface-card p-4">
      <p className="text-caption font-semibold text-text-primary">Dados do novo cliente</p>

      {/* Segmento Empresa/Pessoa */}
      <div className="flex gap-1 rounded-xl bg-surface-alt p-1">
        {(["PJ", "PF"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTipo(t)}
            className={`flex-1 rounded-lg py-1.5 text-caption font-semibold transition-colors ${
              tipo === t ? "bg-surface-card text-text-primary" : "text-text-tertiary"
            }`}
          >
            {t === "PJ" ? "Empresa" : "Pessoa"}
          </button>
        ))}
      </div>

      {ehPJ ? (
        <>
          {/* Ler cartão (foto/arquivo) — a IA extrai só o número (placeholder) */}
          <button
            type="button"
            className="flex items-center gap-2 self-start text-caption font-semibold text-action-primary-sm"
          >
            <Scan /> Ler cartão CNPJ (foto ou arquivo)
          </button>

          {/* CNPJ = 1º campo + Buscar (destrava o resto pela Receita) */}
          <label className="block">
            <span className="text-micro text-text-tertiary">CNPJ</span>
            <div className="mt-1 flex gap-2">
              <input
                value={doc}
                onChange={(e) => setDoc(maskCNPJ(e.target.value))}
                inputMode="numeric"
                placeholder="00.000.000/0000-00"
                className="w-full rounded-xl border border-border-hairline bg-surface-page px-3 py-2.5 text-caption text-text-primary outline-none placeholder:text-text-muted focus:border-border-focus"
              />
              <button
                type="button"
                onClick={() => onBuscar(doc)}
                className="shrink-0 rounded-xl bg-action-primary-sm px-4 text-caption font-semibold text-text-on-brand"
              >
                Buscar
              </button>
            </div>
          </label>

          {buscou ? (
            <>
              {situacao === "baixada" ? (
                <div className="flex gap-2.5 rounded-2xl bg-state-warning-tint p-3">
                  <span className="mt-0.5 shrink-0 text-state-warning-text">
                    <Alerta />
                  </span>
                  <p className="text-micro text-state-warning-text">
                    Esse CNPJ consta como <strong>baixado ou suspenso</strong> na
                    Receita. Você ainda consegue emitir, mas uma nota pra um CNPJ
                    baixado <strong>pode ser recusada ou questionada depois</strong>.
                    Confirme com o cliente antes de seguir.
                  </p>
                </div>
              ) : (
                <span className="flex items-center gap-1.5 self-start rounded-full bg-state-success-tint px-2.5 py-1 text-micro font-semibold text-state-success-text">
                  <CheckMini /> Ativa na Receita
                </span>
              )}
              {/* Identidade fiscal SEMPRE travada (vem validada da API). Só
                  e-mail e telefone abrem — são contato, o cliente pode pedir
                  pra mudar e não afeta a NF. */}
              <Campo label="Razão social" value={nome} onChange={setNome} tag="Receita" locked />
              <Campo label="Endereço" value={endereco} onChange={setEndereco} tag="Receita" locked />
              <Campo label="E-mail" value={email} onChange={setEmail} inputMode="email" />
              <Campo label="Telefone" value={telefone} onChange={setTelefone} inputMode="numeric" />
              <p className="text-micro text-text-tertiary">
                Razão social e endereço vêm travados da Receita (dado oficial).
                E-mail e telefone você pode ajustar.
              </p>
            </>
          ) : (
            <p className="text-micro text-text-tertiary">
              Digite o CNPJ e a gente puxa o resto da Receita: razão social,
              endereço, e-mail e telefone.
            </p>
          )}
        </>
      ) : (
        <>
          <Campo label="CPF" value={doc} onChange={(v) => setDoc(maskCPF(v))} placeholder="000.000.000-00" inputMode="numeric" />
          <Campo label="Nome completo" value={nome} onChange={setNome} placeholder="Nome do cliente" />
          <Campo label="Endereço" value={endereco} onChange={setEndereco} placeholder="Rua, número, cidade" />
          <Campo label="E-mail (opcional)" value={email} onChange={setEmail} placeholder="pra enviar a nota" inputMode="email" />
          <Campo label="Telefone (opcional)" value={telefone} onChange={setTelefone} placeholder="(00) 0000-0000" inputMode="numeric" />
          <p className="text-micro text-text-tertiary">
            No CPF a gente só confere se o número é válido. Os dados da pessoa
            você digita.
          </p>
        </>
      )}

      {/* Salvar na base — true/false */}
      <button
        type="button"
        role="switch"
        aria-checked={salvar}
        onClick={() => setSalvar(!salvar)}
        className="flex items-center justify-between gap-3 border-t border-border-hairline pt-4 text-left"
      >
        <span className="min-w-0">
          <span className="block text-caption font-semibold text-text-primary">
            Salvar na minha base de clientes
          </span>
          <span className="block text-micro text-text-tertiary">
            {salvar
              ? "Fica salvo pra reemitir rápido da próxima vez."
              : "Some depois de emitir — a nota sai, os dados não ficam."}
          </span>
        </span>
        <span
          className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${
            salvar ? "bg-action-primary" : "bg-border-strong"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
              salvar ? "left-[18px]" : "left-0.5"
            }`}
          />
        </span>
      </button>
    </div>
  );
}

function Campo({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  tag,
  locked = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: "numeric" | "email" | "text";
  tag?: string;
  locked?: boolean;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5">
        <span className="text-micro text-text-tertiary">{label}</span>
        {tag && (
          <span className="flex items-center gap-0.5 text-micro font-semibold text-state-success-text">
            <CheckMini /> {tag}
          </span>
        )}
        {locked && <Cadeado />}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        readOnly={locked}
        className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-caption outline-none placeholder:text-text-muted ${
          locked
            ? "cursor-default border-transparent bg-surface-alt text-text-secondary"
            : "border-border-hairline bg-surface-page text-text-primary focus:border-border-focus"
        }`}
      />
    </label>
  );
}

function CheckMini() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}
function Cadeado() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-text-tertiary">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
function Alerta() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4M12 17v.01" />
    </svg>
  );
}

/* ─── Card de confirmação (cliente já cadastrado ou consumidor final) ───────── */
function CardFavorecido({ cliente, obj }: { cliente: string; obj: Cliente | null }) {
  if (cliente === "sem") {
    return (
      <Card>
        <Rotulo>Favorecido</Rotulo>
        <p className="text-caption font-semibold text-text-primary">Consumidor final</p>
        <p className="text-micro text-text-tertiary mt-0.5">
          Nota sem tomador identificado (B2C).
        </p>
      </Card>
    );
  }
  if (!obj) return null;
  return (
    <Card>
      <Rotulo>Confira o favorecido</Rotulo>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-dark text-caption font-bold text-text-on-dark">
          {obj.ini}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption font-semibold text-text-primary">{obj.nome}</p>
          <p className="text-micro text-text-tertiary mt-0.5">
            {obj.doc} · {obj.cidade}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-surface-alt px-2 py-0.5 text-micro font-semibold text-text-secondary">
          {obj.tipo}
        </span>
      </div>
    </Card>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">{children}</div>
  );
}
function Rotulo({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-micro text-text-tertiary">{children}</p>;
}

/* ─── Bolha de favorecido: rótulo SEMPRE em 2 linhas ────────────────────────── */
function ClienteBolha({
  ativo,
  onClick,
  ini,
  l1,
  l2,
  tracejado = false,
}: {
  ativo: boolean;
  onClick: () => void;
  ini: ReactNode;
  l1: string;
  l2: string;
  tracejado?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} className="flex shrink-0 flex-col items-center gap-1.5" aria-pressed={ativo}>
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full text-caption font-bold transition-colors ${
          ativo
            ? "bg-action-primary text-text-on-brand"
            : tracejado
              ? "border border-dashed border-border-strong text-text-secondary"
              : "bg-surface-alt text-text-secondary"
        }`}
      >
        {ini}
      </span>
      <span className="text-center leading-tight">
        <span className={`block whitespace-nowrap text-micro ${ativo ? "font-semibold text-text-primary" : "text-text-tertiary"}`}>
          {l1}
        </span>
        <span className={`block whitespace-nowrap text-micro ${ativo ? "text-text-secondary" : "text-text-tertiary"}`}>
          {l2}
        </span>
      </span>
    </button>
  );
}

/* ─── ícones ───────────────────────────────────────────────────────────────── */
function ic() {
  return {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}
function SetaVoltar() {
  return <svg {...ic()}><path d="m15 18-6-6 6-6" /></svg>;
}
function Mais() {
  return <svg {...ic()}><path d="M12 5v14M5 12h14" /></svg>;
}
function Pessoa() {
  return <svg {...ic()}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>;
}
function LupaMini() {
  return <svg {...ic()} width={15} height={15}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>;
}
function Repetir() {
  return (
    <svg {...ic()} width={18} height={18}>
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 4v5h-5" />
    </svg>
  );
}
function ChevronDir() {
  return <svg {...ic()} width={18} height={18}><path d="m9 6 6 6-6 6" /></svg>;
}
function Scan() {
  return (
    <svg {...ic()} width={16} height={16}>
      <path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2" />
      <path d="M8 12h8" />
    </svg>
  );
}
