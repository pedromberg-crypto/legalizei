---
tipo: spec
data: 2026-07-16
status: em-construcao
tags: [produto, ux, dados, instrumentacao, metricas, coorte, flow]
---

# 📊 Spec de instrumentação do flow — coorte de experiência

> **Por que existe:** decidimos **não bifurcar** a UX por perfil (leigo × avançado) em cima de hipótese. Em vez disso: **1 trilha pra todos + captura da coorte como dado + medição real + decisão depois, com dado.** Esta nota define **o que medir** — porque uma tag sem métrica definida é uma coluna morta no banco. Decisão de trilha: [[mapa-ramificacoes-flow]] · telas: [[spec-telas-entrada-b1-b2]] T5 (UX-48).
>
> **Princípio:** anti-guru aplicado a produto. "Número sem fonte não entra" vale pra UX também. Não se bifurca flow por achismo.

## 🏷️ A tag

| | |
|---|---|
| Campo | `coorte_experiencia` |
| Valores | `primeira_vez` · `ja_abriu` · `nao_respondeu` |
| Onde captura | **T5 (login/criar conta)** — tela que já existe, 2 botões. Zero tela nova |
| Copy | *"É a primeira empresa que você abre?"* → **Sim** / **Não, já abri antes** |
| Obrigatória? | **Não.** Pular não bloqueia nem atrasa → vira `nao_respondeu` |
| Muda o flow? | **NÃO. Zero.** Mesmas telas, mesma ordem, mesma lógica, mesma copy. É dado puro |

**Por que no T5 e não no T4:** o dado que queremos é **performance dentro do flow**. Quem cai em waitlist (🟡) ou comercial Mauro (🔴) no T4 não tem flow pra performar. T5 também é onde a fricção é mais barata (a pessoa já disse "É isso mesmo" e está criando conta).
**Custo conhecido:** leads de waitlist/Mauro ficam **sem coorte**. Se um dia interessar saber se os leads do Mauro são de primeira viagem (uso comercial, não de UX), a pergunta sobe pro T4. Hoje não compensa a fricção no portão de conversão.

**❌ Descartado — pré-mark por comportamento:** usar o atalho *"já sei meu CNAE"* como proxy de experiência. **Proxy inválido:** pesquisar 1 código não quer dizer conhecer as complexidades de abrir empresa (caso real do próprio Pedro: chegou na contabilidade digital sabendo o CNAE e nada mais).

## 📏 O que medir (por coorte)

| # | Métrica | Recorte | Por que importa |
|---|---|---|---|
| 1 | **Drop-off por tela** | por tela (T4→T23) | **Sinal principal.** Onde cada coorte desiste. Se as curvas forem iguais, a bifurcação não se justifica |
| 2 | **Tempo por tela** | por tela | T14 (simulador Fator R) é o suspeito nº1 de travar o leigo |
| 3 | **Uso do expander** ⭐ | T13 (base legal/prova) · **T14 (memória de cálculo + "e se?")** · T20 (detalhe por etapa) | **Testa a hipótese de graça.** Se `primeira_vez` abre muito "ver a conta", a tese de que leigo não quer profundidade cai. Se `ja_abriu` nunca abre, idem. Métrica mais barata e mais informativa do conjunto |
| 4 | **Erro/retry por campo** | CPF · CEP · capital social · razão social | Onde o leigo apanha de verdade (validação que pune) |
| 5 | **Pausas (salvar & retomar)** | onde pausou · voltou? · em quanto tempo | O leigo pausa mais? Volta menos? Retomada precisa de mais recap? |
| 6 | **Conclusão B1→ativa** | taxa por coorte | A régua final. Se as duas convertem igual, o resto é ruído |
| 7 | **Handoff pro humano/WhatsApp** | quem pede socorro · em que tela | Onde o produto falha e vira custo de atendimento |

## 🚦 Gate de decisão (quando bifurcar)

**Honestidade estatística:** com volume de MLP inicial (**dezenas de aberturas, não milhares**) **não haverá significância estatística tão cedo**. O gate **não pode ser p-valor** — seria teatro de rigor.

**Gate proposto — bifurca só quando as 3 baterem:**
1. **Padrão direcional claro e repetido** de drop-off ou tempo numa **tela específica**, separando as coortes (não um delta difuso no funil inteiro).
2. **Conversa com usuário real** daquela coorte confirmando a causa (a métrica diz *onde*, não *por quê*).
3. A causa é **ritmo/layout** — a única coisa que expander e universal já não resolvem. Se a causa for jargão, botão ou falta de recap, **conserta pra todos** (é universal), não bifurca.

**N mínimo:** 🟡 **a travar quando houver tráfego.** Não invento número sem base (anti-guru).

**Regra de parada honesta:** se depois de N reais as curvas forem parecidas, a decisão é **não bifurcar** — e a tag continua útil como recorte de análise. Bifurcação é o caso excepcional, não o padrão.

## 🔒 Invariância (garantida no motor)

A tag é **dado puro** e nunca pode vazar pra lógica. Garantido por teste, não por promessa:
- Persona **`reta-direto`** = `reta` com `coorte_experiencia: "ja_abriu"`, esperando **trilha idêntica**.
- Se um dia alguém fizer um passo fiscal/validação ler a coorte, **o teste quebra**. É o guarda-corpo da regra dura.
- → `execucao/motor-testes/personas/reta-direto.json`

## 🛠️ Implicações pro Dev
1. Campo `coorte_experiencia` no cadastro (T5), opcional, 3 valores.
2. **Evento de telemetria por tela**: entrada, saída, tempo, resultado (avançou/voltou/abandonou) — com a coorte anexada.
3. **Evento de expander** (abriu/fechou, qual, em que tela) — a métrica ⭐.
4. Evento de erro/retry por campo.
5. Eventos de pausa (salvou / retomou / tempo parado).
6. A coorte **não entra** em nenhuma regra de negócio, cálculo fiscal ou validação. Só em analytics.
7. LGPD: é dado de comportamento do próprio usuário, ligado à conta dele. Sem cruzamento com terceiro.

## 🟡 Pendências
- **N mínimo por coorte** pro gate (travar quando houver tráfego).
- Stack de analytics (🟡 a definir — evitar dependência que atrase o E2E de 17/07).
- Se a coorte deve subir pro T4 pra taguear lead de waitlist/Mauro (**uso comercial**, decisão do Mauro).

## Links
- [[mapa-ramificacoes-flow]] (decisão de trilha) · [[spec-telas-entrada-b1-b2]] (T5 + notas transversais) · [[spec-telas-b3-b4-aterrissagem]] · [[compilado-ux-flow]] (UX-48) · [[casos-teste-fluxo-cnae]] · [[HOME]]
