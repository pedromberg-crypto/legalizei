---
tipo: plano-migracao
status: diagnostico
data: 2026-09-21
assunto: hermes-v2-sidecar
servidor: srv1868768 (Hostinger KVM 2, Ubuntu, kernel 6.8.0-139)
tags: [sidecar, devops, migracao, vps, baileys, blue-green]
---

# Migração do motor do Léo · diagnóstico e plano

**Reconhecimento feito em 2026-09-21, por SSH, somente leitura.** Nenhum
processo foi parado, nenhuma configuração alterada, nenhum arquivo escrito no
servidor. Todo comando foi de inspeção (`ps`, `ss`, `systemctl list`, `grep`,
`curl /health`).

---

## 🔴 A conclusão que vem antes do plano

**O desenho blue-green proposto não se aplica a esta máquina**, e não por
detalhe: as duas alavancas previstas não existem aqui.

* **Não há servidor web.** `nginx`, `caddy`, `apache2` e `traefik`: nenhum
  instalado. Não existe porta para trocar nem `reload` para dar.
* **Não há webhook.** A conexão com o WhatsApp **não** é a API oficial da Meta.
  É `@whiskeysockets/baileys` 7.0.0-rc13, ou seja, **sessão pareada por QR**,
  com um WebSocket de saída que o próprio servidor abre. Não existe URL de
  entrada para repontar.

A única porta pública da máquina é a 22 (SSH). A porta 3000 existe, mas escuta
em `127.0.0.1` e a própria ponte recusa requisição cujo `Host` não seja
loopback.

🔑 **A virada de chave existe, mas é em outro lugar:** no contrato HTTP local
entre a ponte e o cérebro. Azul e verde não são dois servidores web, são **dois
cérebros atrás da mesma boca**.

---

## 1. O retrato da VPS

### Como o bot roda

| | |
|---|---|
| supervisor | `systemd --user`, unidade `hermes-gateway-leo.service`, com `Linger=yes` |
| PM2 | não instalado |
| Docker | não instalado |
| unidade em `/etc/systemd/system` | **nenhuma** para hermes/leo/whatsapp |

A unidade tem `Restart=always`, `RestartSec=5` e `KillMode=mixed`. ⚠️ Esse
`KillMode` importa para a migração: parar a unidade manda `SIGTERM` para o
processo principal **e para os filhos**.

```
ExecStart=/usr/local/lib/hermes-agent/venv/bin/python -m hermes_cli.main --profile leo gateway run
WorkingDirectory=/root/.hermes/profiles/leo
HERMES_HOME=/root/.hermes/profiles/leo
```

### Os dois processos

```
pid 211842  python  -m hermes_cli.main --profile leo gateway run      (o cérebro)
pid 211956  node    bridge.js --port 3000 --session .../whatsapp/session --mode bot
```

🔴 **O segundo é filho do primeiro.** Confirmado por `ppid`. Isso é o fato mais
importante deste documento, e a §4 explica por quê.

### Rede

| porta | escopo | quem |
|---|---|---|
| 22 | **pública** | sshd |
| 3000 | loopback | ponte WhatsApp (express) |
| 53 | loopback | systemd-resolved |
| 65529 | loopback | monarx-agent (scanner do provedor) |

`ufw` está **inativo**. Nada além de SSH é alcançável de fora.

### A conexão com o WhatsApp

`package.json` da ponte:

```json
"@whiskeysockets/baileys": "7.0.0-rc13",
"express": "^4.21.0",
"qrcode-terminal": "^0.12.0",
"pino": "^9.0.0"
```

Sessão em `/root/.hermes/profiles/leo/whatsapp/session`, com os arquivos de
credencial e de sincronismo de estado (`app-state-sync-key-*`,
`app-state-sync-version-*`).

🔴 **Uma sessão é UM aparelho registrado.** Dois processos não podem usá-la ao
mesmo tempo: o WhatsApp derruba uma das conexões, e no meio disso a pasta de
sessão pode corromper. Re-parear significa **QR na mão, presencialmente**, com o
número fora do ar até alguém escanear.

### Saúde no momento do diagnóstico

```json
{"status":"connected","queueLength":0,"uptime":20498,"sendReadReceipts":false}
```

`state.db`: 47 MB. Máquina com 4 dias de uptime; o gateway com ~5h40.

⚠️ **Achado de brinde, e ele é sério:** o log da unidade registra, às 19:08 de
20/09, o mesmo `402` de cobrança do Gemini que travou a nossa carga vetorial.
Ou seja, **a produção também ficou sem cérebro hoje**, com a conexão de pé e o
agente devolvendo erro. Não é problema de migração, mas é problema.

### Capacidade para rodar os dois em paralelo

| | |
|---|---|
| RAM | 7,9 GB total · 7,1 GB disponível |
| **swap** | 🔴 **nenhum** |
| disco | 96 GB, 7% usado |
| node | v24.21.0 · npm 11.19.0 |

Há folga de sobra para dois processos. ⚠️ **Sem swap, porém, um pico de memória
não degrada: mata.** O OOM killer escolhe a vítima, e ela pode ser o processo
que segura a sessão do WhatsApp.

---

## 2. O motor novo: o que falta

**`hermes-v2-sidecar` não está na VPS.** E, mais importante:

🔴 **BLOQUEIO: não existe camada HTTP nem wrapper de WhatsApp no motor novo.**

Busca por `createServer`, `express`, `fastify`, `listen(`, `webhook` e `baileys`
em todo o `hermes-v2-sidecar` (fora `node_modules` e `_origem`): **nenhuma
ocorrência**.

O que existe hoje é `responder(entrada, llm, embedder, deps)` em `router.ts`,
uma função pura de orquestração que **ninguém chama a partir da rede**. Quem a
chama é o `testes/e2e.ts`, com deps de teste em memória.

Para virar produção falta escrever um adaptador com, no mínimo:

1. **Laço de polling** em `GET http://127.0.0.1:3000/messages`, respeitando que
   a leitura é destrutiva (§3);
2. **Envio** por `POST /send`, com `/typing` e `/read` se quisermos manter a
   experiência atual;
3. **Mapeamento de identidade**: o `chatId` do WhatsApp virando
   `conversa.contato` e `conversa.sessao` no Postgres, com regra de quando uma
   sessão termina;
4. **Equivalente aos dois plugins** que hoje rodam no Hermes: o formatador de
   saída e a cadência que quebra em duas mensagens. ⚠️ Sem eles, o Léo muda de
   comportamento visível no dia da virada, e a mudança vai parecer regressão;
5. **Supervisão**: unidade `systemd --user` própria, espelhando `Restart=always`;
6. **Resiliência**: o que fazer quando a ponte devolve `503 Not connected`, e o
   que fazer quando o provedor devolve 402 ou 429. Hoje isso vira erro no log e
   silêncio para o cliente.

---

## 3. Onde a costura realmente está

A ponte expõe, em `127.0.0.1:3000`:

```
GET  /messages      → fila de entrada
POST /send          → enviar texto
POST /edit          → editar mensagem
POST /send-media    → mídia
POST /send-poll     → enquete
POST /send-location → localização
POST /typing        → "digitando..."
POST /read          → confirmação de leitura
GET  /chat/:id      → dados do chat
GET  /health        → estado da conexão
```

**A ponte nunca chama ninguém de volta.** Não há webhook de entrada: o cérebro
faz polling. Isso é ótimo para a migração, porque o consumidor pode ser trocado
sem a ponte saber.

### 🔴 Mas a leitura da fila é DESTRUTIVA

```js
const messageQueue = []          // em memória, sem persistência
app.get('/messages', (req, res) => {
  const msgs = messageQueue.splice(0, messageQueue.length)   // drena tudo
  res.json(msgs)
})
```

Duas consequências, e as duas mandam no plano:

1. 🟢 **A favor:** enquanto a ponte continuar viva, mensagem que chega durante a
   troca de cérebro **fica na fila** e o próximo consumidor a recebe. É por isso
   que existe caminho com perda zero.
2. 🔴 **Contra:** **azul e verde NÃO podem consultar ao mesmo tempo.** Quem
   chegar primeiro no `splice` leva a mensagem e o outro nunca a vê. Não existe
   "rodar os dois em paralelo com tráfego real" contra a mesma ponte. Sombra de
   verdade exigiria um `tee` na ponte, ou uma segunda ponte com outro número.

⚠️ A fila é **em memória e limitada** (`MAX_QUEUE_SIZE`). Ela sobrevive à troca
do cérebro, **não** sobrevive ao restart da ponte, e estoura se a troca demorar.

---

## 4. 🔴 O bloqueio estrutural: a ponte é filha do processo que queremos matar

`bridge.js` é filho do gateway Python, e a unidade usa `KillMode=mixed`.
Portanto:

> **Parar o azul hoje derruba a ponte, e derrubar a ponte derruba o WhatsApp.**

Isso torna a virada direta impossível com perda zero. E não se resolve na hora
da migração: resolve-se **antes**, numa janela própria.

### A pré-migração obrigatória: emancipar a ponte

Promover `bridge.js` a unidade `systemd --user` própria, apontando para a **mesma
pasta de sessão**, e configurar o gateway Python para usar a ponte existente em
vez de subir a sua.

* **Custo:** uma reconexão do WhatsApp, de segundos. Não é zero, mas é o único
  momento de indisponibilidade do plano inteiro, e ele acontece **dias antes** da
  migração de verdade, em horário escolhido.
* **Ganho:** a partir daí, a sessão do WhatsApp deixa de depender de qual cérebro
  está rodando. É isso que torna a virada final instantânea e reversível.
* ⚠️ **Verificar antes:** se o gateway Python aceita ponte externa por
  configuração. Se ele insistir em subir a própria, a emancipação exige mexer no
  Hermes, e o risco muda de tamanho. **Isto não foi verificado neste
  diagnóstico** e é a primeira coisa a apurar.

---

## 5. O plano, em fases

### Fase 0 · Destravar o motor novo  *(sem tocar na VPS)*

Escrever o adaptador da §2. Enquanto ele não existir, não há o que migrar.
Critério de pronto: o motor novo conversa com uma ponte local de mentira, na
máquina de desenvolvimento, e responde uma mensagem ponta a ponta.

### Fase 1 · Preparar o terreno  *(VPS, sem impacto)*

1. Clonar o repo em `/opt/hermes-v2-sidecar`, `npm ci`, `npm run build`.
2. `.env` com `DATABASE_URL` e `GEMINI_API_KEY`, permissão `600`.
3. Rodar `npm run teste` (offline) e `npm run teste:db` na própria VPS: prova
   que banco e rede respondem de lá, não só da máquina do Pedro.
4. Criar a unidade `systemd --user` do verde, **parada e desabilitada**.

Nada disso encosta no azul.

### Fase 2 · Emancipar a ponte  *(a única janela de indisponibilidade)*

Conforme §4. Horário de baixo movimento. Confirmar `GET /health` respondendo
`connected` antes de seguir.

### Fase 3 · Ensaio do verde com a ponte parada  *(sem tráfego real)*

Com o azul **ainda no ar**, subir o verde apontando para uma ponte de teste com
**segundo número** e sessão própria. É o que substitui a "sombra": como a fila é
destrutiva, a única sombra honesta é com outro número.

⚠️ Se não houver segundo número, esta fase cai e o risco sobe. Vale dizer isso em
voz alta em vez de fingir que o ensaio aconteceu.

### Fase 4 · A virada

```
1. systemctl --user stop hermes-gateway-leo      # para o azul; a ponte segue viva
2. curl -s localhost:3000/health                 # confirma "connected"
3. systemctl --user start leo-sidecar            # sobe o verde
4. curl -s localhost:3000/health                 # confirma queueLength drenando
5. mensagem de teste de um número interno, ponta a ponta
```

🔑 **O momento exato da virada é o passo 1.** Não é trocar porta no Nginx nem
repontar webhook: é **parar o consumidor do `GET /messages` e subir outro**. A
conexão com o WhatsApp nunca cai, porque ela vive na ponte, que não é tocada.

**Janela de troca: segundos.** As mensagens que chegarem nela ficam na fila em
memória da ponte e são entregues ao verde na primeira leitura.

### Fase 5 · Observação

Azul fica **parado, não removido**, por pelo menos uma semana. `state.db` do
Hermes preservado.

---

## 6. Rollback

```
systemctl --user stop leo-sidecar
systemctl --user start hermes-gateway-leo
```

Volta em segundos, pelo mesmo motivo: a ponte não foi tocada.

⚠️ **O rollback é fácil na infraestrutura e difícil no dado.** O verde grava em
Postgres e o azul em SQLite: conversa atendida pelo verde **não existe** para o
azul. Numa volta, o histórico daquele período some do ponto de vista do cliente.
Isso é aceitável numa janela curta e **não** é aceitável depois de dias.
Define-se um prazo, e ele é curto.

---

## 7. O que este diagnóstico NÃO verificou

Listado porque documento que só diz o que sabe engana pela omissão.

1. 🔴 **Se o gateway Python aceita ponte externa.** É a premissa da Fase 2 e a
   primeira coisa a apurar.
2. 🔴 **O comportamento dos dois plugins** (`leo-formatador`, `leo-cadencia`).
   Sei o que fazem, não li o código. Replicá-los é parte da Fase 0.
3. **Se existe segundo número de WhatsApp** para o ensaio da Fase 3.
4. **Volume real de mensagens**, e portanto quanto tempo a fila aguenta.
5. **Backup da pasta de sessão.** Copiar `.../whatsapp/session` antes de tudo é
   barato e evita re-pareamento presencial se algo corromper. Não confirmei que
   exista rotina disso.
6. **`state.db` de 47 MB**: não foi decidido se o histórico migra para o Postgres
   ou se fica como arquivo morto.

---

## 8. Resumo para decisão

| | |
|---|---|
| o plano blue-green proposto | ❌ não se aplica: sem nginx, sem webhook |
| o caminho que existe | trocar o **consumidor** do `GET /messages` |
| indisponibilidade da virada | **segundos**, sem perder mensagem |
| indisponibilidade real do projeto | **uma reconexão**, na Fase 2, dias antes |
| bloqueio atual | 🔴 o motor novo **não tem camada de rede** |
| risco maior | a ponte ser filha do azul, e o `KillMode=mixed` |
| risco silencioso | sem swap: pico de memória **mata**, e pode matar a ponte |
