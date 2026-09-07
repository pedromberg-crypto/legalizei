"use client";

import { Button } from "@/components/ui/button";
import { Campo, Texto } from "@/components/ui/form";
import { TelaHeader, Titulo, Corpo, Rodape, Aviso } from "@/components/ui/tela";
import { mascaraCpf, mascaraData, mascaraTelefone } from "./_formato";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * M4 · SUA CONTA — os dados que o Portal do Empreendedor vai pedir.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 07/09. Substitui o uso que o MEI fazia da `ContaView` do ME.
 *
 * ─── O QUE MUDA EM RELAÇÃO À TELA DO ME ─────────────────────────────────────
 * Os campos são quase os mesmos, o SENTIDO não é — e era exatamente isso que
 * a auditoria de 28/08 pegou (erro nº 5): o subtítulo do E6 dizia *"a gente já
 * adianta o que precisa **pra Junta**"*. O MEI não vai à Junta Comercial; ele
 * registra no Portal do Empreendedor, pela Redesim.
 *
 * A frase certa aqui é outra e vale mais: **estes campos são literalmente os
 * do formulário oficial**. Nome, CPF, data de nascimento e telefone aparecem
 * no Portal com esses nomes. Não é "a gente adianta pra um órgão"; é "a gente
 * está montando a sua cola desde agora".
 *
 * ⚠️ A CONFERÊNCIA DO CPF (data de nascimento junto) fica, e fica pelo mesmo
 * motivo do ME: quem casou, mudou o nome no CPF e não atualizou na Receita
 * descobre o problema tarde. No MEI descobre PIOR — no meio do registro que
 * ele mesmo está fazendo no Portal, sozinho, sem ninguém do lado.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type EtapaConta = "form" | "codigo" | "cpf-divergente";

export interface DadosContaMei {
  nome: string;
  cpf: string;
  nascimento: string;
  telefone: string;
  email: string;
  senha: string;
}

export const CONTA_MEI_VAZIA: DadosContaMei = {
  nome: "",
  cpf: "",
  nascimento: "",
  telefone: "",
  email: "",
  senha: "",
};

export function ContaMeiView({
  meta,
  etapa,
  dados,
  setDados,
  codigo,
  setCodigo,
  onSeguir,
  onVoltar,
  onFalarComTime,
}: {
  /** Nome de PRA ONDE O VOLTAR LEVA (vem de `mei-flow.metaDoVoltar`). */
  meta: string;
  etapa: EtapaConta;
  dados: DadosContaMei;
  setDados: (d: DadosContaMei) => void;
  codigo: string;
  setCodigo: (v: string) => void;
  onSeguir?: () => void;
  onVoltar?: () => void;
  /** Saída da divergência de CPF: isso não se resolve num formulário. */
  onFalarComTime?: () => void;
}) {
  const set = <K extends keyof DadosContaMei>(k: K, v: DadosContaMei[K]) =>
    setDados({ ...dados, [k]: v });

  const formCompleto =
    dados.nome.trim().length > 2 &&
    dados.cpf.replace(/\D/g, "").length === 11 &&
    dados.nascimento.replace(/\D/g, "").length === 8 &&
    dados.telefone.replace(/\D/g, "").length >= 10 &&
    dados.email.includes("@") &&
    dados.senha.length >= 6;

  /* ── M4.2 · O CPF NÃO CONFERE ─────────────────────────────────────────── */
  if (etapa === "cpf-divergente") {
    return (
      <>
        <TelaHeader meta={meta} onVoltar={onVoltar} />
        <main className="app-main">
          <Titulo sub="O nome que você digitou não bate com o que a Receita tem no seu CPF.">
            Precisamos conferir isso antes
          </Titulo>
          <Corpo>
            <Aviso variante="warning" titulo="Por que isso trava o seu MEI">
              O Portal do Empreendedor puxa seu nome direto da Receita. Se o
              cadastro lá estiver desatualizado (casamento, divórcio, correção
              de grafia), o registro não completa e você descobre no meio do
              caminho, sozinho.
            </Aviso>
            <p className="text-caption text-text-secondary">
              Isso se resolve na Receita, e é rápido. A gente te mostra o que
              fazer e fica com o seu cadastro guardado até lá.
            </p>
          </Corpo>
          <Rodape>
            <Button full onClick={onFalarComTime}>
              Falar com o time
            </Button>
          </Rodape>
        </main>
      </>
    );
  }

  /* ── M4.1 · O CÓDIGO ──────────────────────────────────────────────────── */
  if (etapa === "codigo") {
    return (
      <>
        <TelaHeader meta={meta} onVoltar={onVoltar} />
        <main className="app-main">
          <Titulo sub={`Mandamos um código de 6 dígitos pro ${dados.telefone || "seu WhatsApp"}.`}>
            Confirma que é você
          </Titulo>
          <Corpo>
            <Campo rotulo="Código">
              <Texto
                valor={codigo}
                onChange={(v) => setCodigo(v.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                inputMode="numeric"
                maxLength={6}
              />
            </Campo>
            <p className="text-micro text-text-tertiary">
              Não chegou? Confere o número e pede de novo em alguns segundos.
            </p>
          </Corpo>
          <Rodape>
            <Button full disabled={codigo.length !== 6} onClick={onSeguir}>
              Confirmar
            </Button>
          </Rodape>
        </main>
      </>
    );
  }

  /* ── M4 · O FORMULÁRIO ────────────────────────────────────────────────── */
  return (
    <>
      <TelaHeader meta={meta} onVoltar={onVoltar} />

      <main className="app-main">
        <Titulo sub="Estes são, literalmente, os campos do formulário do MEI. Preenchendo aqui, você não preenche de novo lá.">
          Vamos criar sua conta
        </Titulo>

        <Corpo>
          <Campo rotulo="Seu nome completo" dica="Igualzinho ao que está no seu CPF.">
            <Texto
              valor={dados.nome}
              onChange={(v) => set("nome", v)}
              placeholder="Nome e sobrenome"
            />
          </Campo>

          <div className="flex gap-3">
            <div className="flex-1">
              <Campo rotulo="CPF">
                <Texto
                  valor={dados.cpf}
                  onChange={(v) => set("cpf", mascaraCpf(v))}
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                  maxLength={14}
                />
              </Campo>
            </div>
            <div className="flex-1">
              <Campo rotulo="Nascimento">
                <Texto
                  valor={dados.nascimento}
                  onChange={(v) => set("nascimento", mascaraData(v))}
                  placeholder="00/00/0000"
                  inputMode="numeric"
                  maxLength={10}
                />
              </Campo>
            </div>
          </div>

          <Campo
            rotulo="WhatsApp"
            dica="É por aqui que a gente te avisa quando estiver tudo pronto."
          >
            <Texto
              valor={dados.telefone}
              onChange={(v) => set("telefone", mascaraTelefone(v))}
              placeholder="(31) 90000-0000"
              inputMode="tel"
              maxLength={15}
            />
          </Campo>

          <Campo rotulo="E-mail">
            <Texto
              valor={dados.email}
              onChange={(v) => set("email", v)}
              placeholder="voce@email.com"
              inputMode="email"
              type="email"
            />
          </Campo>

          <Campo rotulo="Senha" dica="Mínimo de 6 caracteres.">
            <Texto
              valor={dados.senha}
              onChange={(v) => set("senha", v)}
              placeholder="••••••"
              type="password"
            />
          </Campo>

          <p className="text-micro text-text-tertiary">
            A gente confere seu CPF com a Receita agora, não lá na frente.
            Divergência de cadastro é o que mais trava registro de MEI, e é bem
            mais barato descobrir aqui.
          </p>
        </Corpo>

        <Rodape>
          <Button full disabled={!formCompleto} onClick={onSeguir}>
            Criar conta
          </Button>
        </Rodape>
      </main>
    </>
  );
}
