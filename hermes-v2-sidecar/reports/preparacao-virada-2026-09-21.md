---
tipo: relatorio-entrega
status: pronto-para-execucao
data: 2026-09-21
assunto: hermes-v2-sidecar
tags: [sidecar, devops, migracao, vps, entrega, runbook]
---

# Preparação da virada · o que ficou pronto e o que falta

Complemento de execução do [plano-migracao-vps](plano-migracao-vps.md). Aquele
documento é o **diagnóstico**; este é o **estado da preparação** e o runbook.

**750 linhas novas**, tudo compilado, e o laço provado ponta a ponta contra uma
ponte de mentira. Nada foi executado na VPS.

---

## 1. O que foi construído

| arquivo | linhas | o que é |
|---|---|---|
| `server.ts` | 328 | o ponto de entrada: polling, atendimento, envio |
| `scripts-vps/swap.sh` | 224 | o script da virada, com ensaio e rollback |
| `scripts-vps/whatsapp-bridge.service` | 66 | emancipa a ponte do processo Python |
| `scripts-vps/leo-sidecar.service` | 55 | o motor novo sob `systemd --user` |
| `scripts/ponte-falsa.mjs` | 77 | a ponte de mentira, para testar sem tocar em produção |
| `db.ts` | +1 função | `garantirContatoESessao` |

### O contrato foi lido, não suposto

Todo o formato veio do `bridge.js` na VPS, inspecionado em 21/09:

* o evento da fila, incluindo `readReceiptKey`, que é o que o `POST /read`
  espera no campo `key`;
* o corpo de cada rota (`/send` recebe `{chatId, message, replyTo?}`, `/typing`
  recebe `{chatId}`);
* e a semântica da fila: `messageQueue.splice(0, length)`, em memória.

🔑 Inventar esse contrato teria produzido um adaptador que compila, sobe, e não
funciona na primeira mensagem real.

---

## 2. As decisões do `server.ts` que não são óbvias

**Ele não abre porta nenhuma.** A ponte não chama ninguém de volta e só aceita
loopback. Um `listen()` aqui seria superfície de ataque sem função.

**Trava de reentrância no tick.** `setInterval` não espera a execução anterior
terminar. Sem a trava, duas leituras simultâneas de `GET /messages` dividiriam a
fila entre si, porque a leitura é destrutiva: mensagens atendidas fora de ordem e
risco de duas respostas no mesmo chat.

**Uma fila por chat, não global.** Duas mensagens seguidas da mesma pessoa
precisam de ordem, ou o histórico grava invertido e a segunda resposta responde à
primeira pergunta. Chats diferentes não têm motivo para esperar um pelo outro.

**`/read` depois do `/send`.** Marcar como lida e então falhar deixa a pessoa
vendo "visto" sem resposta, que é pior do que parecer que a mensagem não chegou.

**Encerramento limpo.** `SIGTERM` para de **ler** e espera quem já estava sendo
atendido. É isso que faz a virada não perder mensagem: o que ficou na fila da
ponte continua lá, esperando o próximo consumidor.

**Os dois plugins do Hermes viraram função** (`limparSaida`, `emBatidas`). No
runtime antigo eram camada separada, e foi exatamente isso que produziu o defeito
de 20/09: três camadas discordando sobre formato, o trailer mandando escrever
markdown enquanto o prompt proibia e o plugin desfazendo depois. Aqui a regra
mora no prompt e a limpeza é a última rede, não uma segunda opinião.

🔴 **E silêncio deixou de ser opção.** Quando o provedor falha, o cliente recebe
uma linha honesta, sem motivo técnico. Em 20/09 a produção ficou sem crédito e o
agente parou de responder com a conexão de pé: do lado de lá, isso é abandono.

---

## 3. A prova

`scripts/ponte-falsa.mjs` fala o mesmo contrato, com `splice` igual ao real.

🔴 **Ela existe por segurança, não por conveniência.** Apontar o `server.ts` para
a produção "só para testar" **rouba mensagens de clientes**: elas somem da fila e
o cérebro em produção nunca as vê. Não existe teste inofensivo contra aquela
porta.

Rodada real, em 5,4 s:

```
[inicio] ponte 127.0.0.1:3999 · status connected · fila 1
[ponte-falsa] digitando...
[1] Honorário de abertura a gente não cobra, a mensalidade já cobre.
    O que sobra é a taxa da Junta no ME...
[2] Os planos promocionais ... valem até 31/12/2026.
    Já sabe se o seu caso é MEI ou ME?
[ponte-falsa] marcada como lida
[...9999@s.whatsapp.net] comercial (sessao nova) · 307c · 5436ms
```

O que isso prova, item a item:

* o polling lê e drena a fila;
* a identidade é criada (`sessao nova`);
* o roteador escolhe a saída (`comercial`);
* **duas batidas viram duas mensagens**, que é a cadência do plugin antigo;
* `typing` antes e `read` depois;
* e a resposta trouxe o preço **com a validade junto**, que era a regra escrita
  ontem.

O contato de teste foi removido do banco depois: `conversa.contato` voltou a zero.

**Verificações:** `tsc` EXIT=0 · suíte offline 14/14 · `bash -n swap.sh` OK.

---

## 4. O runbook, para o dia

### Fase 1 · Preparar o terreno (sem impacto no bot)

```bash
# na VPS, como root
git clone <repo> /opt/hermes-v2-sidecar
cd /opt/hermes-v2-sidecar/hermes-v2-sidecar
npm ci
npm run build

# o .env, com DATABASE_URL e GEMINI_API_KEY
install -m 600 /dev/null .env && vim .env

# provar que banco e provedor respondem DE LÁ, não só da máquina do Pedro
npm run teste          # offline
npm run teste:db       # exige o .env

# as duas unidades, ainda paradas
cp scripts-vps/*.service ~/.config/systemd/user/
systemctl --user daemon-reload
```

### Fase 2 · Ensaio do swap

```bash
./scripts-vps/swap.sh          # imprime tudo o que faria, sem fazer nada
```

Ler a saída inteira. O pré-voo aborta antes de tocar em qualquer coisa se
faltar `.build/server.js`, `.env`, unidade ou acesso a banco e provedor.

### Fase 3 · A virada

```bash
./scripts-vps/swap.sh --executar
```

Depois, com as próprias mãos:

1. mensagem de um número interno, ponta a ponta;
2. conferir que resposta de duas batidas chega em **duas** mensagens;
3. `journalctl --user -u leo-sidecar -f`;
4. `select count(*) from conversa.mensagem;`

### Rollback

```bash
./scripts-vps/swap.sh --voltar
```

---

## 5. ⚠️ O que ainda custa, e o que ainda não se sabe

### Esta versão do swap custa uma reconexão

O `bridge.js` ainda é processo filho do gateway Python, e a unidade usa
`KillMode=mixed`: parar o azul mata a ponte junto. São **segundos**, e **sem
QR**, porque a pasta de sessão não é tocada. Mas não é zero.

🔑 **A pergunta que pode eliminar isso:** o gateway Python aceita usar uma ponte
externa por configuração? Se aceitar, a ponte é emancipada num dia qualquer, e
a virada vira `stop azul / start verde`, instantânea. **Não foi verificado.**

### Os riscos que já estavam no diagnóstico e continuam de pé

* 🔴 **Sem swap na VPS.** Pico de memória não degrada, mata. Por isso as duas
  unidades saíram com `MemoryMax`: se algo vazar, o systemd reinicia o culpado
  de forma previsível, em vez de o kernel escolher uma vítima ao acaso.
* 🔴 **O rollback é barato na infra e caro no dado.** O verde grava em Postgres,
  o azul em SQLite. Conversa atendida pelo verde não existe para o azul. Aceitável
  numa janela curta, inaceitável depois de dias. **Defina o prazo antes de virar.**
* ⚠️ **A fila humana de escalonamento continua sem destino.** O `server.ts`
  registra o pacote no log em vez de deixá-lo sumir, mas ninguém o consome.
  Cliente escalado hoje depende de alguém ler o journal.

### O que não foi replicado do motor antigo

Este adaptador cobre **texto**. A ponte também expõe `/send-media`,
`/send-poll`, `/send-location` e `/edit`, e o evento de entrada traz mídia,
citação e menções. Nada disso é usado hoje pelo Léo, mas se for usado, é
trabalho novo.

---

## 6. Resumo para decisão

| | |
|---|---|
| camada HTTP | ✅ pronta e provada |
| unidades systemd | ✅ escritas, **não instaladas** |
| script de virada | ✅ escrito, com ensaio por padrão |
| backup do legado | ✅ dentro do `swap.sh`, sessão em tarball próprio |
| Fase 1 na VPS | ⬜ falta, e é manual |
| indisponibilidade prevista | **uma reconexão de segundos**, sem QR |
| bloqueio remanescente | 🔴 nenhum para virar; 🟡 a fila humana segue sem dono |
