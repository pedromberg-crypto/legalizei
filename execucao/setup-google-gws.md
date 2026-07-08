---
tipo: referencia
data: 2026-07-08
tags: [meta]
---

# Setup Google (gws CLI) — agenda e Gmail via Claude

> Configurado 2026-07-08. Claude opera Google Calendar/Gmail/Drive/Sheets/Docs desta pasta via CLI oficial `gws` (@googleworkspace/cli — publicado pelo Google, experimental).

## O que está configurado
- **Conta conectada:** pedromberg@gmail.com (pessoal — a do celular)
- **Agenda do projeto:** "Legalizei" (agenda própria dentro da conta, cor separada)
- **Escopos autorizados:** calendar, gmail (modify), drive, sheets, docs
- **Credenciais:** `C:\Users\pedro\.config\gws\` — client_secret.json + token criptografado no keyring do Windows. **FORA do repo git** ✓
- **OAuth app:** projeto Google Cloud próprio, publicado "Em produção" (token não expira em 7 dias)

## Como usar (em conversa com Claude nesta pasta)
- "marca reunião X sexta 14h na agenda" → evento criado na agenda Legalizei
- "o que tenho na agenda essa semana?" → leitura via `gws calendar events list`
- Plaud ingerido com reunião futura mencionada → Claude pergunta se agenda

## Padrão multicliente (replicar em outros projetos)
`GOOGLE_WORKSPACE_CLI_CONFIG_DIR` isola credenciais por pasta:
1. Criar OAuth client no Google Cloud DA CONTA do cliente
2. Salvar client_secret.json em pasta própria (ex: `~/.config/gws-clienteX/`)
3. No projeto do cliente, definir env `GOOGLE_WORKSPACE_CLI_CONFIG_DIR` apontando pra ela (via .claude/settings.json do projeto)
4. `gws auth login` com a conta do cliente
→ Cada pasta de trabalho = sua conta Google, sem vazamento entre clientes. (Princípio infra cliente-dono do CLAUDE.md raiz.)

## Manutenção
- `gws auth status` — checar autenticação
- `gws auth login` — reautorizar se expirar
- Revogar acesso: myaccount.google.com → Segurança → Apps de terceiros → gws-pedro

## Links
- [[obsidian-estado-da-arte]] · [[HOME]]
