# Motor de testes de fluxo — Legalizei

Testa a **lógica** dos fluxos do app (abertura de CNPJ e, depois, portal) rápido e barato: sem UI, sem gastar token de IA. Node puro, zero dependência.

> Arquitetura travada em [[2026-07-15-spec-telas-e-motor-testes]]. Fonte da lógica: [[spec-telas-entrada-b1-b2]] + [[blocos-fluxo-abertura]]. Personas: [[casos-teste-fluxo-cnae]].

## Rodar

```bash
node run.js reta                 # roda a persona e compara com o esperado (✅/❌)
node run.js ajuste <passo> "<frase>" "<fonte>"   # registra um ajuste no livro-caixa
```

Exit code: `0` = PASS, `1` = FAIL, `2` = erro de uso.

## Peças

| Arquivo | O que é |
|---|---|
| `flow-schema.js` | O fluxo como **dados** (passos declarativos). Cobre Entrada + B1 + **B2 completo (c/ simulador Fator R) + B3 + B4 + B4.5**. Números fiscais aterrados em [[fiscal-simples-bh-2026]] (config `FISCAL`). A IA de CNAE **não roda aqui**: vem dublada pela persona. |
| `personas/<id>.json` | Fixture: `respostas` (durável, cross-flow) + `eventos` (pausas roteirizadas) + `esperado` (trilha + veredito + status). |
| `run.js` | Motor headless. Percorre o schema, simula pausas, compara com o esperado, grava a corrida sozinho. |
| `historico-testes.jsonl` | Livro-caixa append-only. Duas linhas: `corrida` (o runner grava) e `ajuste` (tuning com fonte). |

## Livro-caixa (append-only)

Uma linha por evento, discriminada por `tipo`:

- **corrida:** `test_id · persona · persona_seq · flow · data · versao_flow · resultado · trilha`
- **ajuste:** `ajuste_id · test_id · passo · frase · fonte`

`fonte` é a ponte pro cruzamento de dados (link `[[concorrente / reunião / lei]]`). `test_id` é global e pra sempre.

## Como cresce (sem reescrever o motor)

- **Nova persona:** cria `personas/<id>.json`. Nada mais.
- **Mais telas do fluxo:** adiciona passos em `flow-schema.js` e sobe a `versao`. As personas duráveis já trazem as respostas prontas.
- **Novo flow (portal, notas, vencimentos):** vira outro schema. Motor é genérico; livro-caixa já tem a coluna `flow`. Abertura = flow #1.

## Convenção do schema

Cada passo: `pula_se` (condicional exclusiva não roda), `valida` (barra o fluxo), `deriva` (lógica → `{ resultado, dados?, veredito_b1?, termina? }`). Pausa = evento na persona, testando parar/esperar/retomar idempotente — não o órgão.

## Estado

- ✅ **v0.2.0** — cobertura **B1→B4→B4.5** (fluxo inteiro até "empresa ativa"). Simulador Fator R com números do consolidado fiscal: INSS 11% direto, teto folga, **IRRF zero ≤R$5k**, **pró-labore ótimo**.
- ✅ **13 personas codadas, 13 PASS** (v0.2.3): `reta` · `cida` · `camaleao` (🟡 waitlist) · `sociedade` (2 sócios, folga teto, III) · `fronteira` (regulada disfarçada) · `knife` (Fator R 28% + boleto não pago → aguardando-pagamento) · `monstro` (pipeline + pausas) · `bloq-3socios` · `bloq-exterior` · `bloq-cltpropria` (3 recusas graciosas) · `instrutora` (CNAE ótimo) · **`erro-orgao`** (B6: nome reprovado na JUCEMG → estado 🔴 "precisa de você" → recupera) · **`govbr-bronze`** (B7: conta bronze → upgrade guiado B1→B4).
- **v0.2.3 (2026-07-15):** fechou os blind spots do [[mapa-ramificacoes-flow]]. Novo evento `recusa` no `run.js` (irmão da `pausa`): estado 🔴 recuperável **dentro** do pipeline, sem crash nem limbo. Schema ganhou branch de viabilidade indeferida (B6) + nível GOV.BR bronze (B7).
- **14ª persona — `reta-direto` (invariância, 2026-07-16):** não modela gente, modela uma **promessa**. É a `reta` byte a byte com `coorte_experiencia: "ja_abriu"`, esperando **trilha idêntica**. Guarda-corpo da **UX-48** (trilha única + coorte instrumentada, [[spec-instrumentacao-flow]]): prova que a coorte de analytics é **dado puro** e nunca vaza pra lógica fiscal/validação. Se um passo do schema um dia ler a coorte, este teste quebra e denuncia.
- Guard-rails no schema: limite 2 sócios (B2.3), sócio exterior (B2.1), CLT-própria (B2.2).
- 🟡 Simulador roda como **"estimativa"** até a Larissa fechar A/B/C ([[perguntas-larissa-fiscal]]) — sobretudo o ponto B (CPP-no-DAS), que afina o pró-labore ótimo.
