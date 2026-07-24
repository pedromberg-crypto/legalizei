"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rodape, Aviso } from "@/components/ui/tela";
import { PillCnpj } from "@/components/lab/campea-blocks";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PERFIL — chega pelo círculo de iniciais (avatar) da home. Drill-down, então
 * NÃO entra nas RAIZES: a navbar some e a seta "voltar" assume (regra do shell).
 * ═══════════════════════════════════════════════════════════════════════════
 * ─── A TESE (ref. do print do Pedro) ────────────────────────────────────────
 * Aquele perfil de referência não é tela de config — é um CURRÍCULO. Os stat
 * tiles (2k pacientes · 7 anos · €25/h) são o TRACK RECORD da pessoa. Nossa
 * tradução: o track record não é do usuário, é DA EMPRESA dele. Isso vira
 * "Dados cadastrais" (chato, o que o líder faz) em IDENTIDADE + orgulho.
 *
 * ─── CONSOLIDAÇÃO (decisão nova) ────────────────────────────────────────────
 * As abas Empresa · Sócios · Documentos · Conta absorvem P12 + P13 + P14 da
 * matriz: 3 telas viram 3 abas. O líder espalha isso em cantos diferentes do
 * topbar ("Dados da empresa e banco" × "Minha conta"); a gente unifica em
 * "quem eu sou aqui".
 *
 * ─── HONESTIDADE SOBRE EDIÇÃO ───────────────────────────────────────────────
 * Quase nada aqui é auto-editável: razão social, CNAE, endereço e capital só
 * mudam por ALTERAÇÃO CONTRATUAL (45–120 dias, serviço pago). O líder deixa
 * clicar "editar" e só depois apresenta a conta. A gente diz ANTES do toque.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const PESSOA = {
  iniciais: "AB",
  nome: "Ana Beatriz",
  razao: "Ana Beatriz Ramos Desenvolvimento de Software",
};

const ABAS = ["Empresa", "Sócios", "Documentos", "Conta"] as const;
type Aba = (typeof ABAS)[number];

export default function PerfilPage() {
  const [aba, setAba] = useState<Aba>("Empresa");

  return (
    <>
      {/* 1. Topo: voltar + config. (Sem compartilhar/favoritar do ref: é o
          perfil dele mesmo, não tem pra quem compartilhar.) */}
      <header className="flex items-center justify-between pb-4 pt-6">
        <Link
          href="/home-campea"
          aria-label="Voltar"
          className="-ml-1.5 flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-alt"
        >
          <SetaVoltar />
        </Link>
        <button
          type="button"
          aria-label="Configurações"
          className="-mr-1.5 flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-alt"
        >
          <Engrenagem />
        </button>
      </header>

      <main className="app-main">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-6 pb-4">
            {/* 2. Identidade — o selo verde que saiu do cabeçalho da home tem
                casa melhor aqui: no header era ruído, no currículo é credencial. */}
            <div className="flex flex-col items-center text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-dark text-h2 font-bold text-text-on-dark">
                {PESSOA.iniciais}
              </span>
              <p className="mt-3 text-h1 text-text-primary">{PESSOA.nome}</p>
              <p className="mt-1 text-caption text-text-secondary">{PESSOA.razao}</p>
              <span className="mt-3 flex items-center gap-1.5 rounded-full bg-state-success-tint px-3 py-1.5 text-micro font-semibold text-state-success-text">
                <Check />
                Ativa e em dia
              </span>
              <div className="mt-3">
                <PillCnpj />
              </div>
            </div>

            {/* 4. Track record da EMPRESA (o "2k pacientes · 7 anos" do ref) */}
            <div className="grid grid-cols-3 gap-2">
              <Stat valor="4 meses" rotulo="De CNPJ" />
              <Stat valor="12" rotulo="Notas emitidas" />
              <Stat valor="R$ 38,4 mil" rotulo="Faturado em 12m" />
            </div>

            {/* 5. Credenciais — o currículo fiscal: o que a empresa é aos olhos
                do governo (o "★4.8 · Mercy Hospital · idiomas" do ref) */}
            <div className="flex flex-col gap-2">
              <Credencial
                Icone={IconePercent}
                titulo="Simples Nacional · Anexo III"
                sub="Sua alíquota hoje é 6%"
              />
              <Credencial
                Icone={IconeMala}
                titulo="7319-0/04"
                sub="Marketing e publicidade · atividade principal"
              />
              <Credencial
                Icone={Check}
                titulo="Ativa na Receita Federal"
                sub="Situação cadastral regular"
              />
              <Credencial
                Icone={IconeEscudo}
                titulo="Certificado digital"
                sub="Válido até 12/2027"
              />
            </div>

            {/* 6. Abas — absorvem P12 + P13 + P14 */}
            <div>
              <div className="-mx-6 flex gap-5 overflow-x-auto border-b border-border-hairline px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {ABAS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setAba(t)}
                    aria-current={aba === t ? "true" : undefined}
                    className={`shrink-0 border-b-2 pb-2.5 text-caption font-semibold transition-colors ${
                      aba === t
                        ? "border-action-primary text-text-primary"
                        : "border-transparent text-text-tertiary"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                {aba === "Empresa" && <AbaEmpresa />}
                {aba === "Sócios" && <AbaSocios />}
                {aba === "Documentos" && <AbaDocumentos />}
                {aba === "Conta" && <AbaConta />}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 7. CTA — o perfil é LEITURA; a ação que sobra é humana. Escuro, como o
          "Book Appointment" do ref (e AA-safe pelo variant do DS). */}
      <Rodape>
        <Button variant="dark" full>
          Falar com meu contador
        </Button>
      </Rodape>
    </>
  );
}

/* ─── Abas ─────────────────────────────────────────────────────────────────── */

function AbaEmpresa() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Dado rotulo="Razão social" valor={PESSOA.razao} />
        <Dado rotulo="Nome fantasia" valor="Beatriz Studio" />
        <Dado rotulo="Natureza jurídica" valor="Sociedade Limitada Unipessoal" />
        <Dado rotulo="Capital social" valor="R$ 10.000,00" />
        <Dado rotulo="Endereço" valor="Rua Padre Rolim, 123 · Belo Horizonte/MG" />
        <Dado rotulo="Inscrição municipal" valor="1.234.567-8" />
      </div>
      {/* A honestidade antes do toque — o oposto da pegadinha do líder */}
      <Aviso variante="info" titulo="Esses dados não mudam por aqui">
        Razão social, endereço, capital e atividade só mudam por alteração
        contratual na Junta e na Receita. Leva de 45 a 120 dias e é um serviço à
        parte. Fale com a gente antes: a gente te diz o custo e o prazo primeiro.
      </Aviso>
    </div>
  );
}

function AbaSocios() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="rounded-2xl border border-border-hairline bg-surface-card p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-dark text-caption font-bold text-text-on-dark">
              AB
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-caption font-semibold text-text-primary">
                Ana Beatriz Ramos
              </p>
              <p className="text-micro text-text-tertiary mt-0.5">
                Administradora · 100% das cotas
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-1.5 border-t border-border-hairline pt-3">
            <LinhaMini rotulo="Pró-labore" valor="R$ 1.621,00/mês" />
            <LinhaMini rotulo="Outro vínculo (CLT)" valor="Não" />
          </div>
        </div>
      </div>
      <Aviso variante="info" titulo="Quer adicionar um sócio?">
        Entrar com um segundo sócio depois da abertura é alteração contratual
        (serviço à parte). Se for o caso, a gente cota antes de fazer.
      </Aviso>
    </div>
  );
}

function AbaDocumentos() {
  const DOCS = [
    { nome: "Contrato social", sub: "Assinado · 03/2026" },
    { nome: "Cartão CNPJ", sub: "Emitido pela Receita" },
    { nome: "Certificado digital e-CNPJ", sub: "Válido até 12/2027" },
    { nome: "Certidão negativa (CND)", sub: "Emitida em 07/2026" },
    { nome: "Declarações entregues", sub: "Todas em dia" },
  ];
  return (
    <div className="flex flex-col gap-2">
      {DOCS.map((d) => (
        <button key={d.nome} type="button" className="text-left">
          <div className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-alt text-text-secondary">
              <IconeDoc />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-caption font-semibold text-text-primary">{d.nome}</p>
              <p className="text-micro text-text-tertiary mt-0.5">{d.sub}</p>
            </div>
            <Chevron />
          </div>
        </button>
      ))}
    </div>
  );
}

function AbaConta() {
  const ITENS = [
    { nome: "E-mail", sub: "ana@beatrizstudio.com.br" },
    { nome: "Telefone", sub: "(31) 9 9999-0000" },
    { nome: "Senha", sub: "Alterada há 3 meses" },
    { nome: "Notificações", sub: "WhatsApp e e-mail" },
    { nome: "Acesso do 2º sócio", sub: "Nenhum convite ativo" },
  ];
  return (
    <div className="flex flex-col gap-2">
      {ITENS.map((i) => (
        <button key={i.nome} type="button" className="text-left">
          <div className="flex items-center gap-3 rounded-2xl border border-border-hairline bg-surface-card p-3">
            <div className="min-w-0 flex-1">
              <p className="text-caption font-semibold text-text-primary">{i.nome}</p>
              <p className="text-micro text-text-tertiary mt-0.5">{i.sub}</p>
            </div>
            <Chevron />
          </div>
        </button>
      ))}
      <button type="button" className="mt-2 text-left">
        <p className="text-caption font-semibold text-state-danger-text">Sair da conta</p>
      </button>
    </div>
  );
}

/* ─── auxiliares ───────────────────────────────────────────────────────────── */

function Stat({ valor, rotulo }: { valor: string; rotulo: string }) {
  return (
    <div className="rounded-2xl border border-border-hairline bg-surface-card p-3 text-center">
      <p className="text-body-strong font-bold text-text-primary">{valor}</p>
      <p className="text-micro text-text-tertiary mt-0.5">{rotulo}</p>
    </div>
  );
}

function Credencial({
  Icone,
  titulo,
  sub,
}: {
  Icone: () => ReactNode;
  titulo: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-alt text-text-secondary">
        <Icone />
      </span>
      <div className="min-w-0">
        <p className="text-caption font-semibold text-text-primary">{titulo}</p>
        <p className="text-micro text-text-tertiary">{sub}</p>
      </div>
    </div>
  );
}

function Dado({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded-xl bg-surface-alt p-3">
      <p className="text-micro text-text-tertiary">{rotulo}</p>
      <p className="text-caption font-medium text-text-primary mt-0.5">{valor}</p>
    </div>
  );
}

function LinhaMini({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-micro text-text-tertiary">{rotulo}</p>
      <p className="text-micro font-semibold text-text-primary">{valor}</p>
    </div>
  );
}

/* ─── ícones ───────────────────────────────────────────────────────────────── */
function ic() {
  return {
    width: 18,
    height: 18,
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
  return <svg {...ic()} width={20} height={20}><path d="m15 18-6-6 6-6" /></svg>;
}
function Engrenagem() {
  return (
    <svg {...ic()} width={20} height={20}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.36.44.63.8.75H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function Check() {
  return <svg {...ic()} width={14} height={14} strokeWidth={2.5}><path d="m5 12 4.5 4.5L19 7" /></svg>;
}
function IconePercent() {
  return <svg {...ic()}><path d="M19 5 5 19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>;
}
function IconeMala() {
  return <svg {...ic()}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;
}
function IconeEscudo() {
  return <svg {...ic()}><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z" /><path d="m9 12 2 2 4-4" /></svg>;
}
function IconeDoc() {
  return <svg {...ic()}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /></svg>;
}
function Chevron() {
  return (
    <svg {...ic()} className="shrink-0 text-text-tertiary">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
