---
tipo: original
status: vivo
data: 2026-08-10
assunto: pitch-investidor
tags: [pesquisa, pitch, captacao, video, roteiro]
---

# 🎬 Roteiro de pitch em vídeo pra acelerador — arquitetura e rascunho

> Fonte externa: `Roteiros De Pitch Para Investidores.md` (pesquisa Gemini trazida pelo Pedro, 10/08) — cruzada aqui com o estado real do Legalizei. **Público-alvo: aceleradora brasileira (perfil Baita/ACE/Endeavor Scale-up), não VC internacional puro.** Isso muda o que conta como prova — ver §0.

## 0. Achado crítico antes de escrever 1 linha — TIMING

A pesquisa (§6.2 do documento-fonte) descreve o filtro real das aceleradoras "top tier" brasileiras: **MVP ativo na rua + clientes pagantes reais (baseline 5-10) + crescimento mensal de 15-20%** — bem mais rígido que o padrão Vale do Silício (equipe forte + protótipo já financia).

Hoje o Legalizei está em **V0** — 2 meses de "provar + escopar + fundar", **sem produto no ar**, rodando smoke test de tráfego pago (ver `BASE-ESTRATEGICA.md` §13). Isso cria uma fricção direta com o Bloco 7 (Tração) do roteiro-padrão: **não tem MRR, não tem cliente pagante ainda.**

Duas saídas, sem fingir dado que não existe (regra anti-guru):

1. **Gravar agora, com Bloco 7 honesto** — troca "métricas de crescimento" por "prova de compromisso": sociedade fechada, term sheet, plano de validação com gate go/no-go, sem gastar em build antes de provar demanda fria. Serve pra aceleradoras que aceitam estágio pré-produto quando o founder-market-fit é forte (nosso caso: Mauro já tem a operação, o risco é só o digital).
2. **Esperar o gate do fim do V0** (mês 2, `BASE-ESTRATEGICA.md` §13 — sem data travada ainda) e gravar com número real do smoke test ("X leads qualificados em Y semanas de tráfego frio, CPL de R$Z"). Bloco 7 fica muito mais forte e bate com a régua da matriz local.

**Decisão de qual caminho tomar é sua.** O roteiro abaixo já vem com o Bloco 7 nas duas versões, pra não travar a produção esperando essa escolha.

## 1. Framework escolhido (fusão, não escolha única)

| Camada | Framework | Papel aqui |
|---|---|---|
| Abertura | Raskin (Zuora) | Nomear a mudança de mundo, não o "problema" — evita colocar o investidor na defensiva |
| Meio | StoryBrand (Donald Miller) | Cliente = herói, Legalizei = guia, plano em passos simples, sem jargão |
| Números | YC / Sequoia | Bottom-up, "unique insight" real e não-óbvio, teste das 2 frases |
| Filtro de aprovação | Matriz local (doc-fonte §6.2) | MVP + tração + governança — é o que decide se a aceleradora brasileira sequer termina de assistir |
| Cadência | Wistia (retenção) | Nose/Body/Tail — Ask antes de qualquer sinal de encerramento |

## 2. Cronometria alvo — 180s / ~400 palavras

| Bloco | Janela | Palavras |
|---|---|---|
| 1. Hook (mudança de mundo) | 0:00–0:15 | ~35 |
| 2. Problema + porquê agora | 0:15–0:35 | ~45 |
| 3. Terra prometida | 0:35–0:55 | ~45 |
| 4. Produto (presente mágico) | 0:55–1:15 | ~45 |
| 5. Unique insight + fosso | 1:15–1:45 | ~65 |
| 6. TAM/SOM bottom-up | 1:45–2:10 | ~50 |
| 7. Tração / momentum | 2:10–2:35 | ~50 |
| 8. Founder-market fit | 2:35–2:50 | ~35 |
| 9. Ask + fecho visionário | 2:50–3:00 | ~25 |

## 3. Roteiro bloco a bloco (rascunho — todo número com fonte+confiança)

### Bloco 1 — Hook (0:00–0:15)
> "O Simples Nacional virou a porta de entrada de quem presta serviço no Brasil. Só em Belo Horizonte, entre 100 e 175 mil microempresas estão exatamente nesse perfil. Elas nasceram digitais. A contabilidade que cuida delas, não."

🟡 100–175 mil = estimativa por faixa, [[mercado-bh-regional]] (conf. baixa-média, base comercial 2026 + Prefeitura BH). Citar como estimativa, não número seco — a própria nota fonte pede isso.

### Bloco 2 — Problema + "por que agora" (0:15–0:35)
> "Eu mesmo testei no meu CNPJ: hoje pago a alíquota certa. Mas se meu pró-labore cair um único mês, meu Fator R estoura — e ninguém me avisa. Nem eu, nem meu contador. Essa é a conta que a contabilidade tradicional simplesmente parou de olhar."

Base: [[legalize-cobaia-cnpj-pedro]] — caso real, verificado por dupla checagem, não hipotético.

### Bloco 3 — Terra prometida (0:35–0:55)
> "A Legalizei transforma o CNPJ de cada cliente num número vivo — monitorado todo mês, não uma vez por ano. Quem abre ou migra empresa recebe o enquadramento fiscal mais barato pro que já faz, e nunca mais paga imposto a mais por decisão de contador ausente."

Ancorado no framework StoryBrand: cliente = herói, "número vivo" = a Terra Prometida (contraste direto com "número morto" do escritório tradicional).

### Bloco 4 — Produto / presente mágico (0:55–1:15)
> "O cliente responde o que faz, em linguagem simples — sem jargão fiscal. Por trás, cruzamos isso com a tabela de CNAEs e o Fator R pra devolver o enquadramento mais barato ANTES de cobrar qualquer coisa. Nenhuma tela pede pra entender Anexo III ou alíquota efetiva."

Base: gate CNAE (`gate-telas.tsx`) + engine de CNAE fiscalmente ótimo — feature-âncora já construída e testada.

### Bloco 5 — Unique insight + fosso competitivo (1:15–1:45)
> "Esse insight não veio de fora. Meu sócio dirige a Legalize Digital há 22 anos, quase mil clientes em Belo Horizonte e Minas. O que ele viu de dentro: nenhum concorrente digital monitora o Fator R depois do primeiro enquadramento — todos vendem abertura barata e cobram caro depois, serviço avulso por serviço avulso. A Legalizei fecha esse buraco com monitoramento contínuo, não abertura descartável."

Base: `BASE-ESTRATEGICA.md` (Mauro, 22 anos, ~1000 clientes BH/MG) + [[legalize-contabilizei-dossie-coverage]] (camada à-la-carte do líder = receita oculta, ~45 serviços).

### Bloco 6 — TAM/SOM bottom-up (1:45–2:10)
> "Só em BH, entre 100 e 175 mil microempresas de serviço estão no nosso perfil. A R$139 por mês, capturar 0,1% desse mercado já são de 100 a 175 clientes recorrentes — e Belo Horizonte é só o piloto de Minas Gerais."

🟡 mesma fonte do Bloco 1, [[mercado-bh-regional]]. Preço ME R$139 🟢 travado ([[economia-preco-cac]]).

### Bloco 7 — Tração / momentum (2:10–2:35) — DUAS VERSÕES

**Versão A — gravar agora (pré-smoke-test):**
> "Fechamos sociedade com quem já opera essa carteira há 22 anos. Nosso plano de validação está no papel: 60 dias, tráfego pago real, gate de decisão go/no-go — sem gastar 1 real construindo antes de provar que existe demanda fria pelo produto."

**Versão B — gravar pós-gate V0 (preencher com dado real):**
> "Em [Y] semanas de tráfego frio, geramos [X] leads qualificados a um custo por lead de R$[Z] — a prova de que existe demanda antes de construir uma linha de código."

🔴 Versão B tem placeholders — só preencher com dado saído do smoke test real (`BASE-ESTRATEGICA.md` §13, mês 2 do V0). Nunca estimar aqui.

### Bloco 8 — Founder-market fit (2:35–2:50)
> "Eu sou o desenvolvedor e PM que construiu esse produto sozinho, do zero. Meu sócio já resolve essa dor pra quase mil empresários há 22 anos. Ele traz a confiança e o compliance que levam décadas pra construir; eu trago o produto digital que ele nunca teve tempo de construir."

### Bloco 9 — Ask + fecho visionário (2:50–3:00)
> "[ASK A DEFINIR]. Com isso, levamos o Legalizei da validação ao produto real no ar em 5 meses — e começamos a substituir a contabilidade reativa por uma que nunca para de olhar pro seu negócio."

🔴 **Pendente:** o "ask" exato pra uma aceleradora não é necessariamente dinheiro (pode ser vaga em edital, mentoria, ou capital semente do próprio programa) — não decidido ainda qual aceleradora nem o que pedir dela. Ver §5.

## 4. Checklist pré-gravação

**As 7 perguntas da YC** (se não responder cada uma em 1 frase seca, reescrever):
1. O que a empresa realmente faz? → Bloco 3/4
2. Tamanho do mercado (bottom-up)? → Bloco 6
3. Progresso atual (métricas × tempo)? → Bloco 7
4. Qual o unique insight? → Bloco 5
5. Anatomia do modelo de negócio (1 modelo dominante, não híbrido confuso)? → assinatura mensal, ponto.
6. DNA da equipe fundadora? → Bloco 8
7. O que pedem e qual o ask? → Bloco 9

**Filtro da matriz local (aceleradora BR)** — onde hoje FALHA, sem maquiar:
- MVP ativo + clientes pagantes reais → 🔴 não tem ainda (V0 em curso). Ver §0.
- Crescimento mensal 15-20% → 🔴 não aplicável, sem produto.
- Governança/Cap Table clara → 🟡 framework de equity travado (`BASE-ESTRATEGICA.md` §8, faixa 15-35%), % exato ainda não fechado.
- GTM realista, sem "100% orgânico" ilusório → 🟢 forte: `frente-1-captacao-meta-bh.md` já tem canal pago definido, sem ilusão de orgânico puro.

**Passe anti-guru final:** todo número no roteiro tem fonte + confiança do vault do lado. Se algum número aparecer solto num rascunho futuro, ele não entra na gravação.

## 5. Pendências abertas (fila-Pedro)

- 🔴 **Timing de gravação:** agora (Versão A do Bloco 7) ou pós-gate V0 (Versão B)?
- 🔴 **Ask exato:** dinheiro, vaga em edital, mentoria, ou combinação — não definido.
- 🔴 **Qual aceleradora-alvo:** muda ênfase regional (BH/MG) × nacional, e o que cada uma pede no formulário de aplicação.
- 🟡 Honorário contábil real ainda fora do cálculo de unit economics ([[economia-preco-cac]]) — se o pitch citar CAC/LTV, marcar "teto inflado", nunca como número final pra uma banca técnica.

## Links
[[BASE-ESTRATEGICA]] · [[mercado-bh-regional]] · [[economia-preco-cac]] · [[legalize-cobaia-cnpj-pedro]] · [[legalize-contabilizei-dossie-coverage]] · [[HOME]]
