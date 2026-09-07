"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Campo, Texto, Select, Checkbox } from "@/components/ui/form";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { FORMAS_ATUACAO } from "@/lib/mei";
import { LinhaEscolha } from "./_linha-escolha";
import { mascaraCpf } from "./_formato";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * O DOSSIÊ DO MEI — M8, M9 e M10.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09. Substitui o uso que o MEI fazia da C1, C4 e C7 do ME
 * (`wizard-dossie.tsx`), onde 4 dos 8 erros da auditoria de 28/08 moravam.
 *
 * ─── AS 3 TELAS DO ME QUE O MEI NÃO USA, E POR QUÊ ──────────────────────────
 * Documentar o que ele NÃO usa é tão importante quanto o que usa: foi
 * exatamente aí que os erros de dedução nasceram.
 *   · **C2 · Vínculo INSS / pró-labore** — MEI não tem pró-labore. A retirada
 *     é lucro isento (8%/32%, Lei 9.249/95 art. 15), e o INSS dele já está
 *     dentro do DAS mensal. A pergunta não tem resposta possível.
 *   · **C3 · Sócios** — MEI é unipessoal por definição (art. 966 CC).
 *   · **C6 · Natureza jurídica** — é sempre 213-5, automática. Não há escolha.
 *
 * ─── O QUE ESTAS TELAS COLETAM E A DO ME NÃO ────────────────────────────────
 * **RG, órgão emissor, UF e nome da mãe** (M8) e a **forma de atuação** (M9)
 * são campos LITERAIS do formulário do Portal do Empreendedor. No ME o RG não
 * é pedido, e a forma de atuação a gente preenche internamente ("Internet",
 * decisão de 26/08) porque não gera dúvida útil. No MEI ela gera: interage com
 * a dispensa de alvará e com a validade do endereço residencial.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const UFS = [
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS",
  "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC",
  "SE", "SP", "TO",
];

/* ═══════════════════ M8 · SEUS DADOS (o titular) ════════════════════════ */

export interface DadosTitular {
  rg: string;
  orgaoEmissor: string;
  ufEmissor: string;
  nomeMae: string;
}

export const TITULAR_VAZIO: DadosTitular = {
  rg: "",
  orgaoEmissor: "",
  ufEmissor: "",
  nomeMae: "",
};

/**
 * ⚠️ NÃO É COLETA DO ZERO, É CONFIRMAÇÃO + o que faltou. Nome, CPF e
 * nascimento já vieram na M4 (front-load, doutrina travada na Rua Satélite 9)
 * e aparecem travados: mostrar em cinza é mais honesto que esconder — a pessoa
 * confere que é o dela sem achar que pode trocar ali.
 */
export function TitularMeiView({
  meta,
  nome,
  cpf,
  nascimento,
  dados,
  setDados,
  onSeguir,
  onVoltar,
}: {
  meta: string;
  nome: string;
  cpf: string;
  nascimento: string;
  dados: DadosTitular;
  setDados: (d: DadosTitular) => void;
  onSeguir?: () => void;
  onVoltar?: () => void;
}) {
  const set = <K extends keyof DadosTitular>(k: K, v: DadosTitular[K]) =>
    setDados({ ...dados, [k]: v });

  const completo =
    dados.rg.trim().length > 3 &&
    dados.orgaoEmissor.trim().length > 1 &&
    dados.ufEmissor !== "" &&
    dados.nomeMae.trim().length > 2;

  return (
    <>
      <TelaHeader meta={meta} onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo sub="Faltam 4 campos que o formulário do MEI pede e a gente ainda não tinha.">
          Seus dados
        </Titulo>

        <Corpo>
          <Card>
            <p className="text-micro text-text-tertiary mb-2">
              O que você já preencheu
            </p>
            <p className="text-body text-text-primary">{nome || "—"}</p>
            <p className="text-caption text-text-secondary">
              {mascaraCpf(cpf) || "—"} · {nascimento || "—"}
            </p>
          </Card>

          <Campo rotulo="RG" dica="O número do seu documento de identidade.">
            <Texto valor={dados.rg} onChange={(v) => set("rg", v)} placeholder="MG-00.000.000" />
          </Campo>

          <div className="flex gap-3">
            <div className="flex-1">
              <Campo rotulo="Órgão emissor">
                <Texto
                  valor={dados.orgaoEmissor}
                  onChange={(v) => set("orgaoEmissor", v.toUpperCase())}
                  placeholder="SSP"
                />
              </Campo>
            </div>
            <div className="w-28">
              <Campo rotulo="UF">
                <Select
                  valor={dados.ufEmissor}
                  onChange={(v) => set("ufEmissor", v)}
                  opcoes={UFS.map((u) => ({ v: u, label: u }))}
                  placeholder="UF"
                />
              </Campo>
            </div>
          </div>

          <Campo
            rotulo="Nome completo da sua mãe"
            dica="O Portal do Empreendedor pede pra confirmar sua identidade."
          >
            <Texto
              valor={dados.nomeMae}
              onChange={(v) => set("nomeMae", v)}
              placeholder="Nome e sobrenome"
            />
          </Campo>
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

/* ═══════════════════ M9 · SEU ENDEREÇO E COMO VOCÊ ATUA ═════════════════ */

/**
 * ⚠️ 2 COISAS QUE A C4 DO ME PEDE E ESTA TELA NÃO PEDE — as duas foram erro
 * real, achado pela auditoria de 28/08:
 *
 *   · **Índice cadastral do IPTU** (erro nº 3). A C4 exigia, justificando com
 *     "sem ele a documentação não passa na Junta". O formulário do MEI não
 *     pede IPTU, e ele não vai à Junta. Pior: o gate travava o Continuar. Na
 *     época o campo virou `!mei`; aqui ele simplesmente não existe.
 *   · **"Esse endereço é residência de algum SÓCIO?"** (erro nº 4). MEI não
 *     tem sócio.
 *
 * ✅ O **capital social** FICA — ele é campo real da etapa "Qualificação do
 * Negócio" do Portal (`abertura-mei-processo.md`, linha 103). A diferença pro
 * ME é que aqui não existe mínimo legal: pode ser R$1,00, e a tela diz isso em
 * vez de deixar a pessoa achando que precisa provar dinheiro que não tem.
 */
export function EmpresaMeiView({
  meta,
  endereco,
  formas,
  setFormas,
  capital,
  setCapital,
  confirmaBaixoRisco,
  setConfirmaBaixoRisco,
  onSeguir,
  onVoltar,
}: {
  meta: string;
  /** O endereço montado na M1, pra conferência. */
  endereco: string;
  /** Formas de atuação (multi-seleção, obrigatória: pelo menos 1). */
  formas: string[];
  setFormas: (v: string[]) => void;
  /** Capital social declarado. Sem mínimo legal. */
  capital: string;
  setCapital: (v: string) => void;
  /** A declaração de baixo risco, que é o que dispensa o alvará. */
  confirmaBaixoRisco: boolean;
  setConfirmaBaixoRisco: (v: boolean) => void;
  onSeguir?: () => void;
  onVoltar?: () => void;
}) {
  function alternar(id: string) {
    setFormas(
      formas.includes(id) ? formas.filter((f) => f !== id) : [...formas, id],
    );
  }

  const completo =
    formas.length > 0 && capital.trim().length > 0 && confirmaBaixoRisco;

  return (
    <>
      <TelaHeader meta={meta} onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo sub="Confere o endereço e diz como você atende. As duas coisas vão no seu cadastro.">
          Sua empresa
        </Titulo>

        <Corpo>
          <Card>
            <p className="text-micro text-text-tertiary mb-1">Endereço da empresa</p>
            <p className="text-body text-text-primary">{endereco || "—"}</p>
          </Card>

          <div>
            <p className="text-caption font-semibold text-text-primary mb-0.5">
              Como você atende seus clientes?
            </p>
            <p className="text-micro text-text-tertiary mb-2">
              Pode marcar mais de uma.
            </p>
            <div className="flex flex-col gap-2">
              {FORMAS_ATUACAO.map((f) => (
                <LinhaEscolha
                  key={f.id}
                  titulo={f.label}
                  selecionada={formas.includes(f.id)}
                  onClick={() => alternar(f.id)}
                />
              ))}
            </div>
          </div>

          <Campo
            rotulo="Capital social"
            dica="É o que você declara ter investido no negócio. Não existe valor mínimo: pode ser R$ 1,00, e ninguém confere."
          >
            <Texto
              valor={capital}
              onChange={setCapital}
              placeholder="R$ 1.000"
              inputMode="numeric"
            />
          </Campo>

          {/* 🎯 A declaração que substitui o alvará. Não é letra miúda: é o
              ato jurídico que dispensa a licença prévia (Res. CGSIM 51/2019).
              Por isso é checkbox explícito, e não um "ao continuar você
              concorda" escondido no rodapé. */}
          <Aviso variante="info" titulo="A declaração que dispensa o alvará">
            No MEI não existe vistoria antes de abrir. Em vez disso, você
            declara que a sua atividade é de baixo risco, e a licença sai
            automática. Se a prefeitura fiscalizar depois e a atividade não for,
            a declaração é o que responde.
          </Aviso>

          <Checkbox checked={confirmaBaixoRisco} onChange={setConfirmaBaixoRisco}>
            Declaro que minha atividade é de baixo risco e não exige licença
            especial
          </Checkbox>
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

/* ═══════════════════ M10 · NOME DA EMPRESA ══════════════════════════════ */

/**
 * 🔴 ESTA TELA É CONFIRMAÇÃO, NÃO ESCOLHA — e foi o erro nº 7 da auditoria de
 * 28/08: a A1 mostrava pro MEI uma "razão social escolhida", como se ele
 * tivesse escolhido alguma coisa.
 *
 * No MEI a razão social é **gerada por lei**: nome civil completo + o número
 * do CPF (Lei 14.195/2021 e Res. CGSIM 48/2018). Não há sugestão de nomes, não
 * há 2ª rodada, não há consulta de viabilidade de nome — a C7 e a C7′ do ME
 * não têm equivalente aqui, e oferecer um campo pra digitar criaria uma
 * expectativa que o Portal desmente 3 telas depois.
 *
 * O que existe de escolha é o **nome fantasia**, que é opcional e não passa
 * por análise de ninguém.
 */
export function NomeMeiView({
  meta,
  nomeCivil,
  cpf,
  fantasia,
  setFantasia,
  onSeguir,
  onVoltar,
}: {
  meta: string;
  nomeCivil: string;
  cpf: string;
  fantasia: string;
  setFantasia: (v: string) => void;
  onSeguir?: () => void;
  onVoltar?: () => void;
}) {
  const digitos = cpf.replace(/\D/g, "");
  const razaoSocial = nomeCivil ? `${nomeCivil} ${mascaraCpf(digitos)}` : "—";

  return (
    <>
      <TelaHeader meta={meta} onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo sub="No MEI o nome da empresa não se escolhe: a lei manda usar o seu nome com o CPF.">
          O nome da sua empresa
        </Titulo>

        <Corpo>
          <Card tom="marca">
            <p className="text-micro text-text-tertiary mb-1">
              Sua razão social vai ser
            </p>
            <p className="text-body font-semibold text-text-primary break-words">
              {razaoSocial}
            </p>
            <p className="text-caption text-text-secondary mt-2">
              É automático (Lei 14.195/2021). Ninguém analisa, ninguém recusa, e
              não tem 2ª rodada de nomes como acontece numa empresa comum.
            </p>
          </Card>

          <Campo
            rotulo="Nome fantasia"
            dica="Opcional. É o nome que aparece pro seu cliente, na nota e na fachada."
          >
            <Texto
              valor={fantasia}
              onChange={setFantasia}
              placeholder="Como seu cliente te chama"
            />
          </Campo>

          <p className="text-micro text-text-tertiary">
            O nome fantasia não é registrado como marca. Se você quiser proteger
            o nome, isso é INPI, e a gente te explica quando fizer sentido.
          </p>
        </Corpo>

        <Rodape>
          <Button full onClick={onSeguir}>
            Continuar
          </Button>
        </Rodape>
      </main>
    </>
  );
}
