---
name: legalize-motor-testes-arquitetura
description: Motor de testes em execucao/motor-testes/ (headless, Node puro). **v0.4.0 · 19 personas · 2 flows** (16 abertura + 3 migrar). Ordem: ENTRADA→B1→B3→B2→B4 (a cobranca SUBIU). Guard-rails fatais vivem no b1.triagem (N4, ANTES do dinheiro). Motor = criterio de aceite do backend; contradicao motor x spec, motor ganha.
metadata:
  node_type: memory
  type: project
  originSessionId: 2b138de1-6d80-46f8-901a-58ce799ebff4
---

**O que é:** motor headless que percorre personas pelas telas em ms, sem UI e sem gastar token
(a IA de mapeamento CNAE vem **dublada** pela persona; só o determinístico é testado).
`node run.js <persona>` → tabela + PASS/FAIL + grava sozinho no livro-caixa append-only.

**Princípio:** separar **motor (lógica headless)** da **tela (UI fina)**. Persona = **dado
(fixture JSON)**, não clique. Pausas de órgão/usuário = **eventos roteirizados** na persona.

---

## ⚠️ ESTADO ATUAL — v0.4.0 (2026-07-16)

**A ORDEM MUDOU. A cobrança subiu.** Execução: `ENTRADA → B1 → **B3** → **B2** → B4 → B4.5`.
Os nomes dos blocos são os do vault; o que mudou foi a **ordem**. Telas renumeradas T1–T23 →
**N1–N25** → [[reordenacao-flow-cobranca-cedo]] tem o mapa T→N.

**19 personas, 19/19 PASS · 2 flows:**
- **flow #1 `abertura`** (`flow-schema.js`, 16 personas)
- **flow #2 `migrar`** (`flow-migrar.js`, 3 personas) — quem **já tem CNPJ** e troca de contador.
  Era o blind spot mais antigo ("metade do mercado, zero testado"). **Agora existe.**
  `run.js` virou multi-flow de verdade: a persona declara `meta.flow`.

**🔑 Guard-rails fatais vivem no `b1.triagem` (N4), ANTES do dinheiro.**
Sócio no exterior e 3+ sócios **NÃO** são mais barrados no B2. Subiram na v0.3.0, e isso é o
coração da reordenação: **com cobrança no N9, barrar depois = cobrar de quem não pode abrir.**
(`b2.socios` virou input sem `valida`; `b2.socio` não checa mais exterior.)

**Passos que nasceram na reordenação:** `b1.triagem` · `b1.faturamento` · `b1.teaser` (3 modos:
swap = número fechado · fator-r = **faixa** que inclui R$0 · servico = sem número) · `b2.consenso`
(N19.5, 2º sócio ratifica antes do irreversível) · `b2.termo` (N20, o irreversível, separado do
aceite do N8) · `b4.dispensas`.

**Boleto NÃO termina o flow:** entra no app, faz o B2, e trava `b2.revisao` (export) +
`b2.termo` (execução) até compensar. **CPF valida elegibilidade dentro do `b3.pagamento`** —
irregular não cobra, roteia.

**Personas:** `reta` `cida` `camaleao`(🟡 waitlist) `sociedade` `fronteira` `knife`(boleto)
`monstro` `bloq-3socios` `bloq-exterior` `bloq-cltpropria`(recuperação, UX-43) `instrutora`
`erro-orgao`(evento `recusa`) `govbr-bronze` `reta-direto`(invariância UX-48) ·
**`promessa-quebrada`** (guarda-corpo do teaser: a margem não comporta o pró-labore ótimo) ·
**`cpf-irregular`** · **`migra-limpo`** `migra-refem`(TTRT travado por contador hostil)
`migra-passivo`(DAS atrasado + dívida ativa).

**Simulador:** pró-labore ótimo mira **30%** (`FATOR_R_MARGEM`), **não** os 28% cravados — a
spec sempre pediu colchão e o motor dava o conselho oposto até a auditoria de 16/07 (UX-39).
Custo **consome o CLT** declarado (UX-24). As 2 alavancas (Fator R × CNAE-swap) são
**alternativas, não cumulativas** (`max`, não soma). CNAE III-por-padrão (8599-6/04) já é
Anexo III **sem** Fator R.

## 🔴 Buracos conhecidos (auditoria 16/07)
- **IRRF não é calculado.** `custoProLabore()` devolve só `{inss}`; IRRF existe como **rótulo**.
  A spec manda "INSS + IRRF". Antes de corrigir: a alíquota acima da isenção **não está
  aterrada** em [[fiscal-simples-bh-2026]] — sem fonte, o fix vira número de guru.
- **A rota `incerto` não existe.** A regra de ouro ("nunca veredito com baixa confiança; dúvida
  persistente → humano") **não está no código**. Nenhuma persona tem `cnae_confianca: "baixa"`.
  O caso existia em [[casos-teste-fluxo-cnae]] e se perdeu na migração pras personas.
- **`ARGUMENTO_SERVICO` promete "~2 dias úteis"** — prazo medido na operação **da Contabilizei**,
  não na nossa (a Izabela estima **5 dias**; a JUCEMG não tem API).

## 📦 Contrato com o dev — DESATUALIZADO
O motor foi pro repo privado `base-flow-legalizei` em 15/07, onde **"as 14 personas são o
critério de aceite"**. Hoje são **19, a ordem é outra, e existe um flow #2**.
🔴 **O dev precisa ser avisado.** → [[legalize-handoff-dev-repo]]
**Anti-drift:** contradição motor × spec → **motor ganha**.

## 🗄️ Histórico
- **v0.2.x (15/07)** — 11 → 14 personas. Ordem antiga (cobrança no T16). `erro-orgao` (fecha
  UX-37, 4º estado vermelho), `govbr-bronze`, `reta-direto`. `run.js` ganhou o evento `recusa`
  (irmão da `pausa`: injeta 🔴 + recuperação e **continua**). 4 rodadas de UX (45 ✅).
- **v0.3.x (16/07)** — reordenação + auditoria spec×motor (5 gaps: UX-39, UX-24, UX-06 corrigidos;
  UX-25 e UX-30 seguem 🔴). Rodada #5 de UX (UX-49 teaser sem argumento · UX-50 consenso quebrado).

Deriva de [[reordenacao-flow-cobranca-cedo]] (ordem) + [[fiscal-simples-bh-2026]] (números).
Autoridade por assunto: [[indice-autoridade]].
