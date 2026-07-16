---
name: legalize-motor-testes-arquitetura
description: Motor de testes do fluxo em execucao/motor-testes/ (headless, Node puro, tabela + livro-caixa). Cobre B1→B4→B4.5; **v0.2.3, 14 personas PASS**; simulador Fator R aterrado no consolidado + CNAE ótimo. 4 rodadas de UX (45 ✅); blind spots B6/B7 fechados (evento `recusa`); motor foi pro repo do dev = critério de aceite do backend.
metadata: 
  node_type: memory
  type: project
  originSessionId: 2b138de1-6d80-46f8-901a-58ce799ebff4
---

**CONSTRUÍDO 2026-07-15**, estendido no mesmo dia p/ **v0.2.2** em `execucao/motor-testes/` (Node puro, zero dep): `flow-schema.js` (fluxo=dados: **Entrada+B1+B2 completo+B3+B4+B4.5**, config `FISCAL` aterrada no consolidado) · `personas/*.json` · `run.js` · livro-caixa `historico-testes.jsonl` · relatórios. Roda `node run.js <persona>`. **Saída em TABELA** + PASS/FAIL. **11 personas rodando ✅ PASS:** `reta` `cida` (acessibilidade) `camaleao`(→waitlist B1) `sociedade`(2 sócios, folga teto, LTDA, III) `fronteira`(regulada disfarçada) `knife`(Fator R 28% borda + boleto não pago→aguardando-pagamento) `monstro`(pipeline+2 pausas) `bloq-3socios`/`bloq-exterior`(2 recusas graciosas) `bloq-cltpropria`(**recuperação**: educa→segue→ativa, era bloqueio) `instrutora`(testa CNAE ótimo). **Guard-rails FATAIS no schema:** limite 2 sócios (b2.socios), sócio exterior (b2.socio). **CLT-própria NÃO é mais fatal** — correção UX-43 (4ª sessão 15/07): confusão conceitual educa e destrava, não termina o flow. **Simulador Fator R** com números do consolidado: INSS 11% direto, teto **folga** (não binário), **IRRF zero ≤R$5k**, **pró-labore ótimo**. **Passo `b2.cnae_otimo`** = recomendador de CNAE fiscalmente ótimo (ver [[legalize-cnae-fiscalmente-otimo]]).

Arquitetura de testes do fluxo Legalizei, travada 2026-07-15. Objetivo: percorrer as personas pelas telas MUITO rápido, dezenas de vezes, sem tokens por teste.

**Princípio:** separar **motor (lógica headless)** da **tela (UI fina)**. Persona = **dado (fixture JSON)**, não clique.

**3 camadas, mesma fixture:** (1) fixtures de persona; (2) runner headless valida a lógica em ms, sem UI, **sem token** (a IA de mapeamento CNAE vem "dublada" pela persona — só o determinístico é testado); (3) piloto-automático + deep-link (`?persona=x&step=2.8`) reusa a fixture pra QA visual quando as telas existirem.

**Pausas** (órgão/contador/usuário — não-sistema) = **eventos roteirizados na persona** ("JUCEMG aprovou em 5 dias"). O motor testa parar/esperar/retomar idempotente, não chama nada externo. Mapeado p/ B1/B2/B3; pausas pesadas = B4+ (identificadas, não specadas).

**Persona = entidade durável cross-flow.** Abertura = flow #1; depois portal (nota, vencimentos, pró-labore). Motor genérico → **adicionar flow futuro = adicionar arquivo, não reescrever**. Livro-caixa tem coluna `flow`.

**Livro-caixa (append-only, o runner grava sozinho):**
- Log de corridas: `test_id` (global, pra sempre) · `persona` · `persona_seq` · `flow` · `data` · `versao_flow` · `resultado` · `trilha`.
- Log de ajustes: `ajuste_id` · `test_id` · `passo` · `frase curta` · **`fonte`** ([[link]] concorrente/reunião/lei = ponte pro cruzamento de dados, inclusive com concorrentes).

**Diretriz pro Dev:** motor-primeiro (núcleo headless) + UI fina, senão retrabalho.

**4 rodadas de UX rodadas (15/07)** — o veio das 11 personas originais **esgotou** (compreensão→confiança→cauda→recuperação, 45 ✅ na spec / 1 🟡). Spec da cauda em [[spec-telas-b3-b4-aterrissagem]].

## 🆕 v0.2.3 (2026-07-16) — 11 → **14 personas, 14/14 PASS**
Os blind spots viraram teste (nasceram do [[mapa-ramificacoes-flow]], que mapeou todos os forks do flow):
- **`erro-orgao`** — fecha o **UX-37** (era 🔴 no backlog). Nome reprovado na JUCEMG **apesar da prévia** → estado 🔴 **"precisa de você"** (ação concreta: reescolher nome) → **recupera DENTRO do pipeline** → ativa. Prova que a cauda assíncrona tem **4º estado (vermelho)**, não só ✅/⏳/⬜ — nem crash, nem limbo "em andamento" que na real travou.
- **`govbr-bronze`** — Marta, professora particular. Detecta bronze no B1 → **upgrade guiado** → assina prata/ouro no B4 sem travar. Fecha o arco UX-29 + UX-31.
- **`reta-direto`** — **não modela gente, modela uma promessa.** É a `reta` byte a byte com `coorte_experiencia: "ja_abriu"`, esperando **trilha IDÊNTICA**. Guarda-corpo do [[legalize-trilha-unica-ux48]]: se um passo fiscal um dia ler a coorte, **quebra e denuncia**.

**Mudanças no motor:** `run.js` ganhou o evento **`recusa`** (irmão da `pausa`: injeta o estado 🔴 + recuperação e **continua** o pipeline, sem terminar) · `flow-schema.js` ganhou branch de **viabilidade indeferida** (`viabilidade_recusa`) e **nível GOV.BR** (`govbr_nivel`) em `b1.conta` + `b4.registro`. **Defaults preservam as strings antigas** → nenhuma persona anterior quebrou.

**📦 O motor virou o handoff pro dev** — copiado pro repo privado `base-flow-legalizei`, onde **as 14 personas são o CRITÉRIO DE ACEITE do backend** (rodou as 14 com a mesma trilha = correto por construção). Ver [[legalize-handoff-dev-repo]]. **Anti-drift:** a fonte do motor passou a ser o **repo compartilhado**; o vault mantém a cópia de trabalho. Contradição motor × spec → **motor ganha**.

**Blind spots que SOBRAM:** `saas`/`bpo` (famílias 2-3 do CNAE ótimo) · **flow #2 MIGRAR** (esqueleto pronto, metade do mercado) · cartão recusado · API de viabilidade fora · MEI→ME · upsell-taker.

Deriva de [[legalize-blocos-fluxo-abertura]]. Personas em [[casos-teste-fluxo-cnae]]; telas em [[spec-telas-entrada-b1-b2]] + [[mapa-telas-mobile]].
