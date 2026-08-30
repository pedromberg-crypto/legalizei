---
tags: [flow, gates-saida, revisao]
---

# Revisão dos gates de saída — 29/08

Pedido do Pedro: os 11 gates de saída do app (`flow-data.mjs`, `classe: "saida"`) foram desenhados no início pra cercar ao máximo e não perder lead — fazia sentido na época, mas agora precisamos **reduzir e reposicionar**. Regra dura pra qualquer mudança: **gate tem que continuar antes do pagamento** (1ª parte do processo).

Fazendo isso com cautela, **gate por gate**, começando pelo flow de abertura de ME do Simples Nacional (é onde os programadores estão mexendo agora).

## Levantamento — gates no caminho abrir → ME → Simples Nacional

Rastreado em `execucao/flow/flow-data.mjs` (nós + arestas), não em `/mapa` — cruzamento fonte-primária. Só 5 dos 11 gates do app são alcançáveis neste caminho específico; todos antes do E9 (pagamento).

| # | Gate | Onde aparece | Motivo |
|---|------|---------------|--------|
| 1 | **E4.1 · Fora de BH/MG** | Sai do **E3.4** (Endereço + categoria), quando o CEP não valida BH e a pessoa recusa o endereço fiscal da Legalizai | MLP só atende BH-MG; só dispara se a pessoa recusar a solução (endereço fiscal) que resolveria o caso |
| 2 | **E5.1 · 🟡 Waitlist** | Sai do **E3.4**, quando a atividade não está em nenhuma das 15 categorias oferecidas | Única porta de "não atendemos" antes do dinheiro no caminho abrir — desde 27/08 o veredito de CNAE (C0) é pós-pagamento e não pode mais recusar ninguém |
| 3 | **E5.4 · Saída · exterior** | Sai da **E5T** (Triagem), sócio mora fora do Brasil | LC 123 art.17 — sócio no exterior tira do Simples |
| 4 | **E5.5 · Saída · 5+ sócios** | Sai da **E5T** (Triagem), 5+ sócios | Limite do produto (subiu de 2→4 em 24/08, só 5+ bloqueia) |
| 5 | **E5.6 · Saída · sócio PJ** | Sai da **E5T** (Triagem), sócio é CNPJ (não CPF) | Sócio-PJ tira do Simples no ato do contrato social — regra fiscal |

**Fora do caminho abrir-ME** (não listar de novo quando revisarmos esse flow): E4.2.1 (CNPJ inapto) e E4.2B.1 (Presumido fora de escopo) só existem no ramo Migrar (nascem do E4.2, "lê o cartão CNPJ" — não há cartão numa abertura nova). E5.2 (Contato especial/Mauro) e E5.3 (Fora de escopo/descarta) ficaram órfãos no caminho abrir desde que o veredito virou C0 pós-pagamento (27/08) — E5.3 está com **zero arestas** em todo o grafo hoje, nem o Migrar alcança.

## Gate 1 de 5 — E4.1 · Fora de BH/MG — ✅ RESOLVIDO (deixa de ser exit)

**Achado do Pedro (29/08):** esse gate já acontecia dentro da própria tela **E3.4** (`/endereco`) — a mensagem "não atendemos fora de BH" já aparecia em vários lugares da MESMA tela, inclusive quando o CEP não batia. Cortada a redundância de copy primeiro (mensagem de 3 linhas → 1 frase sucinta, reaproveitada no aviso de CEP errado).

Copy-base (definida pelo Pedro): *"Por enquanto a gente só abre empresa em Belo Horizonte/MG. Isso é sobre o endereço da empresa, não sobre onde você mora."*

**Redesenho final:** o gate deixou de expulsar pra `/saida/fora-bh` (terminal separado). Agora, CEP fora de BH mostra um alerta POSITIVO com 2 saídas: usar o endereço fiscal da Legalizai (já existia) ou entrar na fila da própria cidade — nesse caso, mostra a cidade travada (via CEP) e o CTA do rodapé vira "Me inscrever e garantir condição". `/saida/fora-bh` (E4.1) fica órfão no caminho abrir-ME: ninguém mais chega nele por aqui.

## Gate 2 de 5 — E5.1 · 🟡 Waitlist (atividade fora da lista) — ✅ RESOLVIDO (deixa de ser exit)

Mesmo tratamento do gate 1, na mesma tela: o dropdown de categoria ganhou uma última opção em coral, "Não encontrei minha categoria". Escolhendo ela, abre um 2º dropdown com as ≤12 atividades regulamentadas mais comuns (Comércio primeiro, depois Engenharia/Medicina/Advocacia/etc., mais "É outra atividade" com campo livre) — dado valioso de mkt que antes se perdia (só "não atendemos", sem saber o quê).

Ao escolher a categoria fora-da-lista, o gate de endereço logo abaixo JÁ simplifica pro modo "só cidade" (mesma UI do gate 1), e a mensagem final é condicional: CEP de BH avisa só sobre a atividade; CEP fora de BH avisa sobre atividade E cidade juntas. `/veredito/waitlist` (E5.1) fica órfão no caminho abrir-ME.

**Resultado: 2 dos 5 gates do caminho abrir-ME resolvidos numa tela só (E3.4).** Faltam 3 (E5.4 exterior, E5.5 5+ sócios, E5.6 sócio PJ — todos na Triagem/E5T).

## Gates 3-5 de 5 — E5.4 exterior · E5.5 5+ sócios · E5.6 sócio PJ — ✅ RESOLVIDOS (deixam de ser exit)

Diferente dos gates 1-2: não são 3 iguais. **E5.5 (5+ sócios)** é limite do PRODUTO (pode subir um dia) — mesmo espírito dos gates 1-2, CTA virou "Me avisar se isso mudar". **E5.4 (exterior)** e **E5.6 (sócio PJ)** são fato LEGAL/fiscal (LC 123 art.17 / regra do contrato social) — não "resolvem" com o tempo, mas o Pedro confirmou que a Legalize Digital (contabilidade tradicional do Mauro) atende esses 2 casos fora do produto automatizado, então o CTA ("Falar com o time") conecta com um humano de verdade em vez de prometer algo que não muda.

Mecanicamente foi mais simples que os gates 1-2: `TriagemView` já tinha TUDO inline (as 3 respostas + um aviso educando o motivo do bloqueio já existiam ali) — só faltava trocar a navegação (`onSaida` pras 3 telas `/saida/exterior`, `/saida/socios`, `/saida/socio-pj`) por um estado local (`resolvidoInline`) que mostra confirmação na própria tela. Não precisou de nenhum campo novo: nome/e-mail/telefone já vieram da E3.3, e o motivo do bloqueio já está nas respostas da própria Triagem.

`/saida/exterior`, `/saida/socios` e `/saida/socio-pj` ficam órfãos no caminho abrir-ME.

## 🔒 Revisão do dia seguinte (decisão de negócio travada) — os 3 gates da Triagem deixam de ser PERGUNTA

Pedro reconsiderou e travou algo mais forte que "resolver inline": os 3 critérios (5+ sócios, sócio via CNPJ, sócio no exterior) **deixaram de ser pergunta**, viraram fato/checklist:
- Seletor de quantidade de sócios passou a ir só até 4 ("Eu + 3") — a opção "5+" foi **removida do produto**, não só escondida. Sem ela no seletor, o caso "5+ sócios" não existe mais pra travar.
- As perguntas CPF×CNPJ e "mora fora do Brasil?" **saíram inteiras**. Racional do Pedro: quem chega na Triagem já escolheu Simples Nacional lá atrás (E3.2) — não é uma pergunta com 2 respostas úteis, é consequência da escolha anterior. Viraram um card "Vale saber" com 3 checks (mesmo componente visual de `MeiOuMeView`): mora no Brasil · entra só com CPF · vai assinar no GOV.BR (esse 3º check absorveu o antigo aviso de assinaturas, que antes só aparecia com 3+ sócios — agora aparece desde o 1º sócio, porque a assinatura vale sempre).
- Abaixo do card, ficou 1 link de escape ("Meu sócio não atende um dos critérios") pra quem sabe que o próprio caso foge da regra — só aí o CTA vira "Falar com o time" e resolve inline (mesmo padrão dos gates 1-2), sem reintroduzir pergunta obrigatória pra todo mundo.

⚠️ Risco assumido conscientemente: a checagem ATIVA de "sócio no exterior" (fail-fast, UX-21) deixou de existir — antes bloqueava antes do pagamento, agora é só lembrete + escape opcional. Documentado no código (`gate-telas.tsx`, doc comment de `TriagemView`).

**Resultado final: os 5 gates do caminho abrir-ME resolvidos em 2 telas (E3.4 + E5T/Triagem) — 2 continuam como escolha ativa (fora de BH / atividade fora da lista), os outros 3 viraram checklist informativo + escape opcional, nenhum expulsa mais pra tela de saída separada.**

## 🗑️ Limpeza das telas órfãs (29/08)

Com os 5 gates resolvidos, 4 telas de saída ficaram com **zero uso restante** no app inteiro (nem Migrar nem MEI alcançam) — deletadas de vez, não só desconectadas:
- `/saida/fora-bh` (E4.1)
- `/saida/exterior` (E5.4)
- `/saida/socios` (E5.5)
- `/saida/socio-pj` (E5.6)

⚠️ `/veredito/waitlist` (E5.1) **NÃO foi deletada** — parecia órfã do caminho abrir, mas o Migrar ainda chega nela (`E4.2 → 🟡 regulada`). Confirmado rastreando as arestas no `flow-data.mjs` antes de apagar qualquer coisa.

**Docs atualizados:**
- `execucao/flow/flow-data.mjs` — removidos os 4 nós (E4_1/E5_4/E5_5/E5_6) e as 5 arestas que os alcançavam (incluindo `E3_4→E5_1`, que não navega mais pra lá no caminho abrir). `falta`/`dados` de E3_4 e E5T reescritos pra refletir a resolução inline. Handle "fora" removido de E3_4 (não tem mais aresta usando ele).
- `node execucao/flow/gerar-mapa.mjs` rodado → **v45**, mapa/tabela de validação regenerados.
- `lib/dados-saida.tsx`: constantes `DADOS_SAIDA_FORA_BH`/`_EXTERIOR`/`_SOCIOS`/`_SOCIO_PJ` **mantidas** — a `/apresentacao` (ferramenta de demo/histórico de decisões) ainda importa esses objetos pra mostrar os cenários antigos; não fazem mais parte de nenhuma rota real, mas remover quebraria a demo sem necessidade.

tsc/eslint (projeto inteiro) e verificador MEI limpos depois da limpeza. `/saida/exterior` confirmado 404; `/veredito/waitlist` confirmado 200 (Migrar).

## ⏸️ Pendente — Migrar e MEI

O caminho abrir-ME está fechado. **Ainda faltam 6 gates de saída fora dele**, adiados a pedido do Pedro (29/08, "deixe registrado que precisamos olhar mas ficará pra depois"):

- **Ramo Migrar**: E4.2.1 (CNPJ inapto/suspenso), E4.2B.1 (Presumido fora de escopo), E5.2 (Contato especial/Mauro), E5.3 (Fora de escopo/descarta — órfão, zero aresta hoje).
- **Ramo MEI**: M-T.1 (Já tem CNPJ), M-T.2 (Servidor federal).

Retomar com o MESMO raio-x (rastrear nós+arestas em `flow-data.mjs`, gate por gate, sem pressupor que o padrão do abrir-ME serve igual — cada ramo pode ter racional de negócio diferente, como já vimos aqui).

## ➡️ Seguindo pras telas do flow (fora do tema gates)

29/08 — com os gates fechados, a conversa seguiu pras TELAS do próprio caminho abrir-ME (layout, não mais gate). Primeira: **Faixa de faturamento** (`FaixaView`, `/gate?etapa=faixa`) — layout ficava vazio como lista de 4 pills finas. Virou grade 2×2 de cartões ilustrados, badge de check quando selecionado — `CardFaixa`/`GradeFaixas` em `gate-telas.tsx`. Card selecionado é coral sólido (`--color-action-primary`, `#DD4E27`), não tint claro.

Ícone trocado de SVG (barras crescentes por faixa) pra PNG exportado pelo Pedro no Photoshop (`Dinheiro 1@2x.png`, ~18.7KB) — mesmo asset nos 4 cartões, sem progressão por faixa. Copiado pra `app/public/icones/faixa-dinheiro.png`, servido via `next/image`. Badge do ícone ficou sempre branco (não muda com seleção) pra manter o laranja do ícone legível tanto no card claro quanto no coral sólido.

(seguir atualizando conforme avançamos)
