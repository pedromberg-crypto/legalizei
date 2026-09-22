---
tipo: diretrizes
status: vivo
data: 2026-09-21
assunto: hermes-v2-sidecar
tags: [producao, arquitetura, regras, agente]
---

# CLAUDE.md · as diretrizes de ouro do Léo v2

Este arquivo vale para qualquer agente ou pessoa que edite este repositório.
Ele foi escrito em 21/09/2026, no dia em que o motor novo entrou no ar.

🔴 **CORRIGIDO em 22/09/2026 (Pedro): o número do Léo está em TESTE, e vai
ficar por um bom tempo.** A frase original dizia *"existe um número de WhatsApp
ao vivo atendendo cliente real do outro lado"* — **não é o caso**. Não há
cliente real na outra ponta, e enquanto isso valer, toda conversa sobre o Léo é
conversa sobre um ambiente de teste.

As cinco regras abaixo não são preferências de estilo. Cada uma existe porque o
caminho contrário já custou dinheiro, tempo ou uma conversa ruim com cliente.

---

## 1. O QUE AINDA EXIGE CUIDADO — e o que não exige

> 🧪 **O número está em TESTE** (travado em 22/09/2026 pelo Pedro, e vale até
> ele dizer o contrário). Reiniciar o serviço, subir build, rodar carga e testar
> no número **não** precisam de janela de silêncio, aviso a ninguém nem medo de
> interromper atendimento: **não há atendimento a interromper**.
>
> 🔴 **O que continua valendo:** **NUNCA** altere `bridge.js`, a pasta de sessão
> ou os arquivos `.service` sem autorização expressa — e esse motivo **não é
> produção, é a sessão pareada**.

Esses três são a camada que segura a conexão com o WhatsApp. `server.ts` é o
processo que consome a fila; `bridge.js` é a ponte Baileys que detém a sessão
pareada; os `.service` são o que o systemd usa para subir os dois.

O motivo de `bridge.js` estar nesta lista é específico: a pasta de sessão é um
aparelho registrado no WhatsApp. Quebrá-la não se conserta com `git revert` —
exige re-parear por QR, presencialmente, com o número fora do ar até alguém
escanear.

Autorização expressa significa uma pessoa dizendo "pode mexer nesse arquivo",
não uma tarefa cujo cumprimento implica mexer nele.

🔑 **A distinção que a correção de 22/09 introduz:** o risco aqui **não é
derrubar cliente**, é **perder o pareamento** — que custa presença física e QR,
e nenhum `git revert` desfaz. `server.ts` saiu da lista de intocáveis por
decreto: mexer nele é normal, testar é normal, quebrar e consertar é normal.
Quebrar a sessão, não.

## 1.1 TROCA DE CHAVE — o teste que vale e o que engana

> 🔴 **`GET /v1beta/models` com `200` NÃO prova que a chave serve.** Medido em
> 22/09/2026, e custou uma queda: a chave nova devolveu `200` no catálogo e
> **`403 PERMISSION_DENIED · "Your project has been denied access"`** ao subir
> o serviço. Catálogo é quase público; gerar conteúdo exige projeto habilitado.

**O teste certo é o endpoint que o Léo usa de verdade** — `generateContent` no
modelo em uso e `embedContent` na vetorização:

```bash
cd /opt/hermes-v2-sidecar
K=$(awk -F= '/^GEMINI_API_KEY=/{gsub(/"/,"",$2); print $2}' .env)
curl -s -o /dev/null -w "%{http_code}
" -H 'content-type: application/json'   -d '{"contents":[{"parts":[{"text":"oi"}]}]}'   "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=$K"
curl -s -o /dev/null -w "%{http_code}
" -H 'content-type: application/json'   -d '{"model":"models/gemini-embedding-001","content":{"parts":[{"text":"oi"}]}}'   "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=$K"
unset K
```

**Os dois `200`, e só então reinicia.**

🔑 **O `EnvironmentFile` é lido no START.** Editar o `.env` não muda nada até o
restart — e chave ruim **não aparece no boot** com o serviço saudável: ela
derruba o processo na primeira chamada ao LLM, que aqui acontece na subida.

🔒 **A chave nunca passa pelo chat de um agente.** Quem edita é uma pessoa, no
terminal (`nano .env`). O agente faz o teste, o restart e a conferência — nada
disso precisa ver o valor. Para confirmar que trocou, compare **comprimento e
os últimos 4 caracteres**, nunca o conteúdo.

⚠️ **Backup de `.env` é segredo igual.** `cp -a` para preservar o `600`, e
`shred -u` quando não precisar mais — `rm` não basta. E revogue a chave velha no
console depois que a nova responder: trocada e não revogada continua valendo.

## 1.2 JURISDIÇÃO — quem faz o quê, e por quê

> Travado em 22/09/2026 pelo Pedro. **Duas janelas trabalham neste sistema**, e
> a divisão não é hierarquia: é **onde cada coisa é possível**.

| | **Janela da VPS** | **Janela do vault** (`pessoal/legalize`) |
|---|---|---|
| Roda | teste, `seed:rag`, `build`, `systemctl`, `journalctl` | análise |
| Lê | log, banco, estado do serviço | relatório, notas `.md`, ADR, histórico |
| Escreve | nada de conteúdo — só relatório em `reports/` | o **conteúdo**: cartões, notas, PERSONA, RULES |
| Entrega | o relatório commitado | a correção, por `npm run deploy:docs` |

🔑 **Por que a execução fica lá:** o banco do sidecar
(`db.*.supabase.co`) resolve **só em IPv6**, e a máquina do Pedro não alcança.
Em 21/09 isso produziu um **falso negativo**: o E2E rodou local, as tools de
banco deram zero chamada, o roteador engoliu o `ENOTFOUND` e **o teste passou
mascarado**. Teste que roda onde o banco não existe não é teste, é encenação.

🔑 **Por que a análise fica aqui:** o *porquê* de cada regra mora no vault — as
18 vidas, os ADRs, as decisões de preço, a persona travada. A VPS tem o
ambiente; o vault tem o contexto. Trocar isso produz correção tecnicamente
válida e comercialmente errada.

### O ciclo, e ele é fechado

```
VPS roda  →  escreve reports/*.md  →  commit + push
                        ↓
   vault lê o relatório + as notas, acha a brecha, corrige o .md
                        ↓
              npm run deploy:docs  (com as 3 travas)
                        ↓
                  VPS roda de novo
```

📦 **Em PACOTE, nunca ajuste solto** (Pedro, 22/09). Cada `seed:rag` custa
embedding e cada restart é um ciclo; corrigir um ponto de cada vez multiplica
custo e ruído, e ainda dificulta saber **qual** mudança produziu qual efeito.
Acumula-se o achado, agrupa-se a correção, roda-se uma vez.

⚠️ **O que a janela do vault NÃO faz:** `systemctl`, `build` na VPS, ler
`journalctl`, mexer em serviço. Duas janelas mexendo em serviço é como se perde
trabalho não commitado — já aconteceu, e foi o `deploy:docs` que passou a
recusar.

## 2. ARQUITETURA

> O `router.ts` é uma função pura de 4 trilhas. Não adicione complexidade
> cíclica nele. A inteligência mora no Prompt e nas Tools, não no IF/ELSE do
> código.

As quatro trilhas são `escalonamento`, `fora_escopo`, `tecnico` e `comercial`
(ver `tipos.ts`). O roteador escolhe uma, entrega as tools daquela trilha
(`TOOLS_POR_SAIDA` em `tools-def.ts`) e sai da frente.

Um `if` novo dentro do roteador parece barato e é o começo da máquina de
estados que ninguém consegue testar depois. Se uma situação nova não cabe nas
quatro trilhas, isso é conversa de arquitetura, não um `else if`.

## 3. MUTAÇÕES DE COMPORTAMENTO

> Se o Léo estiver errando uma resposta, a correção **DEVE** ser feita primeiro
> melhorando a descrição da tool (`tools-def.ts`), editando o `RULES.md` ou
> ajustando o RAG. Alterar código TypeScript para consertar texto é proibido.

A ordem de tentativa, sempre:

1. A descrição da tool em `tools-def.ts` — o modelo escolhe a tool pela
   descrição, então tool errada quase sempre é descrição fraca.
2. O `RULES.md` — regra de redação e de postura.
3. O RAG — cartões e notas de conhecimento, se o que falta é fato.

Só depois disso, e com o defeito já isolado, se discute código. Resposta ruim
consertada com `if` no TypeScript é regra que existe em um lugar onde ninguém
vai procurar, e que o próximo ajuste de prompt vai contradizer sem perceber.

## 4. TESTES E2E

> Testes rodam em memória. O comando `npm run e2e` **nunca** deve vazar para a
> ponte HTTP real.

O E2E monta suas próprias `Deps` em memória (`depsDeTeste`, em `testes/e2e.ts`)
e de propósito não grava em `conversa.mensagem`. Rodada de teste não suja o
histórico de produção, e cada caso precisa de sessão limpa para poder repetir.

As tools continuam batendo no banco de verdade — isso é intencional, é o que o
teste existe para exercitar. O que não pode acontecer é o E2E falar com a ponte
em `127.0.0.1:3000`: ali existe um número de WhatsApp real, e mensagem de teste
que vaza para lá chega em cliente.

## 5. CACHING

> Qualquer alteração no array de mensagens do Gemini deve preservar a estrutura
> exata para não quebrar o Context Caching (custa 1/10 do preço).

O preço em vigor está em `testes/contador.ts`: `cachePorMilhao` é um décimo de
`entradaPorMilhao`. A rodada de 21/09 às 00:04 mediu −80,3% de custo depois do
cache explícito.

O cache casa por prefixo idêntico. Trocar a ordem de dois blocos, inserir uma
linha no topo do sistema ou mudar espaçamento invalida o prefixo inteiro, e a
rodada seguinte paga preço cheio sem nenhum erro aparecer no log. O sintoma é
sempre o mesmo: a conta sobe e o placar não muda.

Depois de mexer no array, confira `taxaDeAcerto` no relatório da rodada. Se
caiu para perto de zero, o prefixo quebrou.

---

## O que ler antes de mudar qualquer coisa

| quero | leia |
|---|---|
| a persona e a voz | `PERSONA.md` |
| as regras de redação e postura | `RULES.md` |
| o que o produto faz | `CARTOES-PRODUTO.md` |
| o que cada suíte de teste prova | `testes/README.md` |
| quanto custou e o que o gasto comprou | `reports/` |
