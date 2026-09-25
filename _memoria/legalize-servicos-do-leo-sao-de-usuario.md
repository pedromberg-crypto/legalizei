---
name: legalize-servicos-do-leo-sao-de-usuario
description: 25/09 - leo-sidecar e whatsapp-bridge sao unidades systemd de USUARIO; sem --user o systemctl devolve vazio e parece nao existir servico.
metadata: 
  node_type: memory
  type: project
  originSessionId: 12f65b6f-b033-4e22-b604-b0ad37e11175
  modified: 2026-09-25T03:34:17.037Z
---

Os dois processos do Léo na VPS são unidades **systemd de usuário**, filhas do `systemd --user` (PID 2459, ativo desde 16/09):

| Unidade | |
|---|---|
| `leo-sidecar.service` | 🟢 o motor de atendimento. **É este que se reinicia** |
| `whatsapp-bridge.service` | 🔴 a ponte Baileys, detém a sessão pareada. **Intocável** |
| `hermes-gateway-leo.service` | ⚫ `failed`, motor v1 aposentado em 21/09 |
| `hermes-gateway.service` | ⚫ `not-found`, unidade fantasma sem arquivo |

```bash
systemctl --user list-units --type=service --all
systemctl --user restart leo-sidecar
```

🔴 **`systemctl list-units | grep -i hermes` devolve VAZIO**, porque olha o escopo do sistema. Em 25/09 eu li esse vazio como "não existe serviço nenhum", concluí que os processos rodavam soltos e que não havia supervisor, e mandei reiniciar com `kill` mais `nohup`.

**Why:** havia supervisor. O `kill` no server foi seguido de reinício automático em **11 segundos**, e o `nohup` subiu um **segundo** servidor: dois processos consumindo a mesma fila, ambos em polling de 1500ms. Só não gerou resposta duplicada a cliente porque o número está em teste.

**How to apply:** ao procurar como um processo é gerenciado no Linux, `ps -ef --forest` antes de qualquer conclusão: ele mostra o **pai**, e o pai é quem responde se existe supervisor. `ps aux` mostra o processo e esconde quem o segura. E escopo vazio no `systemctl` significa "não está neste escopo", nunca "não existe".

⚠️ O `server.js` no ar roda **sem** `--env-file`: as variáveis vêm do `EnvironmentFile` da unidade. Subida manual exige conferir que o `.env` do disco bate com o ambiente do processo, comparando comprimento e os 4 últimos caracteres, nunca o valor. Ver [[legalize-troca-chave-gemini-teste-certo]] e [[legalize-leo-numero-em-teste]].
