---
tipo: operacao
status: vivo
data: 2026-07-22
assunto: home-portal-candidatos-modulos
tags: [ux, feature, portal, home, dia-2, brainstorm]
---

# 🏠 Home do portal — candidatos a módulo (brainstorm pra cruzar)

> Banco de ideias do que PODE aparecer na home real do portal interno (dia-2), **antes** de cruzar com o esqueleto da Contabilizei ([[2026-07-21-dossie-plataforma-logada]]) e com o acervo de componentes (`/componentes`). Gerado 2026-07-22 a pedido do Pedro ("saia da caixinha"). **Inclui itens SEM dado ainda** — marcados na coluna Dado. Nada aqui está decidido; é matéria-prima de debate.
>
> Cruza com: [[matriz-portal-interno]] (P0–P14) · [[legalize-contabilizei-dossie-coverage]] · [[cnae-fiscalmente-otimo]] (Fator R = âncora).

## Tese
A home NÃO é um dashboard que se confere, é um **copiloto que vigia por você**. O líder converte por **medo** (dunning) e deixa **loop aberto** (cliente confirma manual se pagou). Nossa virada: 1ª coisa = **alívio** ("tá tudo certo, a gente avisa se precisar"). O diferencial que ninguém no nicho faz = **tornar visível o risco fiscal invisível** (Fator R vivo, teto do Simples chegando) = o "número vivo que ninguém olha" ([[legalize-cobaia-cnpj-pedro]]) vira mostrador.

**Arco de rolagem proposto:** Respiro → Agir → Inteligência → Cuidado → Crescer (+ estado dia-1).

## Legenda
- **Ousadia:** 🟢 padrão (todo app tem) · 🟡 diferencial (poucos fazem bem) · 🔴 fora da caixa (ninguém no nicho faz)
- **Dado:** ✅ temos · 🟡 derivável/precisa engenharia · 🔴 não temos ainda (infra/dado novo)

## Tabela de candidatos
| Zona | Módulo | O que aparece | Job / encanto | Ousad. | Dado |
|---|---|---|---|:--:|:--:|
| Dia-1 | Trilha de ativação | "3 passos: certificado ✓ · conectar conta · 1ª nota" | home nova não é dashboard vazio, é próximo passo (gate P0) | 🟢 | ✅ |
| Respiro | Saudação + veredito | "Bom dia, Pedro. Tá tudo certo." status como HERÓI | 1ª coisa = alívio, anti-medo do líder | 🟡 | ✅ |
| Respiro | Próximo vencimento | DAS dia 20 · "faltam 8 dias, já preparamos a guia" | o medo real é perder prazo; matamos com antecipação | 🟢 | ✅ |
| Respiro | Faturamento vivo | número do mês/ano + tendência | pulso do negócio (ref fintech) | 🟢 | ✅ |
| Agir | Grid de ações | Emitir · Pagar · Pró-labore · Docs (1 toque) | acesso imediato ao que se faz toda semana (ref11/12) | 🟢 | ✅ |
| Agir | Swipe-to-pay do DAS | deslizar pra pagar sem sair pro banco | pagar imposto em 1 gesto (ref12) | 🔴 | 🟡 |
| Agir | Emitir por voz | "emite R$500 pro cliente X" + waveform | wow + acessível pro leigo (ref11) | 🔴 | 🔴 |
| Intelig. | **Fator R ao vivo (gauge)** | "paga 6% · falta R$X de folha pro limite" | torna visível o risco invisível = **North Star** | 🔴 | 🟡 |
| Intelig. | Guarda preditivo | "no ritmo atual, chega no teto do Simples em ~7 meses" | avisar ANTES da dor, não depois | 🔴 | 🔴 |
| Intelig. | IACA proativa | ela fala 1º: "vi que não emitiu nota esse mês" | copiloto que age, não FAQ que espera | 🔴 | 🟡 |
| Intelig. | Próxima melhor ação | 1 card recomendado pela IA | tira fadiga de decisão do leigo | 🟡 | 🟡 |
| Intelig. | Explicador inline | toca em "DAS/Fator R" → IACA traduz | leigo entende sem sair da tela | 🟡 | 🟡 |
| Cuidado | Quem cuida da sua empresa | rosto do time (22 anos Legalize) | anti-robô frio, confiança (ref wellness) | 🟡 | ✅ |
| Cuidado | Falar com humano | atalho WhatsApp | leigo trava, quer gente na hora | 🟢 | ✅ |
| Cuidado | Dicas / "você sabia?" | carousel de micro-educação contextual | app vivo = motivo pra voltar (ref5) | 🟢 | 🟡 |
| Cuidado | Cofrinho do imposto | reserva visual do DAS conforme você fatura | nunca mais susto do boleto; comportamental | 🔴 | 🔴 |
| Crescer | **Economia acumulada** | "esse ano a Legalizai te devolveu R$X" | prova de valor recorrente = anti-churn (contra reajuste IGP-DI silencioso, P18) | 🔴 | 🟡 |
| Crescer | Story / linha do tempo | marcos da empresa, orgulho | você não abandona o que construiu junto | 🔴 | 🟡 |
| Crescer | Celebração de marcos | confete "1ª nota!", "R$100k!" | encantamento (já temos confetti) | 🟡 | 🟡 |
| Crescer | Modo "e se?" | simulador de cenário na home | dono planeja sem medo | 🔴 | 🟡 |
| Crescer | Benchmark de pares | "seu ramo fatura ~Y" (anônimo) | contexto que ninguém dá | 🔴 | 🔴 |
| Crescer | Débito automático | promo "nunca mais atrase" | retenção + tranquilidade (ref12) | 🟡 | 🟡 |
| Crescer | Indique e ganhe | referral loop | crescimento (o líder tem, P18/achado 2) | 🟢 | 🟡 |

## 4 apostas fortes (onde ir fundo)
1. **Fator R ao vivo (gauge) + guarda preditivo** — a feature-âncora virando VISÍVEL na home. O líder esconde num relatório; a gente põe um mostrador que respira. Motivo de trocar de contador.
2. **IACA proativa** — o pulo do gato de IA não é "pergunte", é ela EMPURRAR a coisa certa. De ferramenta pra parceiro.
3. **Economia acumulada** — o líder reajusta por IGP-DI no silêncio (P18); a gente mostra todo mês quanto DEVOLVEU. Blinda churn e justifica preço.
4. **Cofrinho + swipe-to-pay** — o par comportamental que mata o "susto do imposto": reserva sozinho, paga num gesto.

## Anti-home (o que NÃO pôr — o oposto do líder)
- Confirmação manual "você pagou?" (loop aberto — a gente detecta sozinho).
- Muro de números que assusta o leigo (6%→15,5% cru sem contexto).
- Dunning/medo como gancho de conversão.

## Perguntas abertas pro debate
1. Home é **uma tela canônica** ou **2 estados vivos** (dia-1 ativação × regime empresa rodando)?
2. Topo claro (wellness/acolhe) × topo hero-escuro (fintech premium)? Decide o tom antes do conteúdo.
3. Quais 🔴 fora-da-caixa entram no MVP vs backlog?
