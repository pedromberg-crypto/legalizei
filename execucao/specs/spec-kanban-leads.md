---
tipo: spec
status: vivo
data: 2026-07-23
assunto: kanban-leads-operacional
tags: [produto, gestao-interna, operacao, kanban, leads, certificado, parceiro]
---

# 🗂️ Spec — Kanban de leads (gestão operacional) + funil do parceiro do certificado

> **O que é:** o board operacional que acompanha **cada lead/cliente** pelas etapas de abertura, do pagamento até a empresa ativa. ≠ do [[spec-dashboard-adm-metricas]] (que é métrica agregada), ≠ do [[kanban-time]] (tarefas do time dev), ≠ do [[kanban-legalizai-story-book]] (pessoal do Pedro). Este é o **pipeline vivo de clientes** que um **operador (contador)** trabalha.
>
> **Princípio central — dividir por DONO DA PAUSA:** a única pergunta do operador o dia todo é *"a bola está no lado de quem?"*. A coluna responde isso; o passo do flow vai no card.
>
> **Tese (anti-líder):** o card **cai na coluna sozinho**, alimentado pelo estado real do sistema — o sistema sabe se espera o órgão, a assinatura, a nossa validação ou o parceiro. O operador **não arrasta nada**. O líder faz humano rastrear; a gente fecha o loop.

## 🎯 Escopo
Cobre o lead **do pagamento em diante** (é onde as pausas + o trabalho de ops vivem) + a raia de **Saídas** (waitlist/comercial Mauro) que precisa de contato humano. O lead **antes** do pagamento (navegando o wizard) é self-service/automação → vive no **funil do dashboard** ([[spec-dashboard-adm-metricas]]), não aqui.

---

## 🅰️ BOARD A — Kanban de gestão (o operador contador vive aqui)

```
🟦 NOSSA   🟨 EXTERNA(órgãos)   🟧 USUÁRIO   🔵 CERTIFICADO(parceiro)   🟩 ATIVA   ⬜ SAÍDAS
(age)       (monitora)           (cutuca)      (monitora o parceiro)      (fim)      (roteia)
```

| Coluna | Bola em | Lead está aqui quando (exemplos) | Operador faz | Relógio / alerta |
|---|---|---|---|---|
| 🟦 **NOSSA** | nós | revisar nome antes de enviar à Junta · conferir dossiê · **gate de validação do certificado** (ver §gate) | **AGE** | SLA NOSSO — **grita** rápido (somos o gargalo). Alerta `>24h` *[chute]* |
| 🟨 **EXTERNA** | órgão | constituição rodando na Junta/Receita | **MONITORA** | alerta só se estourar o tempo normal do órgão (`>3 dias úteis` *[chute]*) ou vier recusa |
| 🟧 **USUÁRIO** | cliente | aguardando pagamento (boleto) · assinar constituição · GOV.BR / gov.br bronze | **CUTUCA** | **nudge automático** escalando pro operador (`24h → 72h → op em 5d` *[chute]*) |
| 🔵 **CERTIFICADO** | parceiro | pós-constituição, certificado sendo emitido pelo parceiro | **MONITORA** (conta desde que passou a bola) | ver §Board B — alerta `48h` na sub-etapa "Novo" (travado) |
| 🟩 **ATIVA** | — | certificado validado, app destravado full | — | — |
| ⬜ **SAÍDAS** | humano | 🟡 waitlist (atividade regulamentada) · 🔴 comercial Mauro (não encaixa) | **ROTEIA/CONTATA** | fila do escritório |

**Card do Board A** carrega: razão social + CNPJ (quando existir) · nome do lead · atividade/CNAE · **passo atual** (onde no flow, ex. N21) · dono da pausa (= a coluna) · **dias parado** · próxima ação · 🚨 se recusa · contato.

**Regra de ouro:** o **dono é a coluna, o passo é o card**. O lead migra entre 🟦/🟨/🟧 quantas vezes o flow pedir — a coluna sempre reflete de quem é a bola AGORA.

**🚨 Recusa não é coluna, é flag.** Órgão reprovou nome / exigência = card que **volta** de 🟨 → 🟦 (a gente refaz) ou → 🟧 (cliente corrige), com 🚨. Mantém o board em poucas colunas.

---

## 🅱️ BOARD B — Funil do parceiro do certificado (login escopado no nosso sistema)

O parceiro do certificado tem **login e senha do nosso sistema**, com um **funil próprio** onde só ele enxerga os clientes que precisam de certificado. Ele **evolui o card lá**; a gente não vê esse detalhe no Board A (lá é só a coluna 🔵 monitor).

```
📥 Novo(contatar) → 📞 Agendando → 📅 Agendado → 🎥 Pós-call/emitindo → ⬆️ Upload + Concluir
```

| Etapa | O parceiro faz |
|---|---|
| 📥 **Novo** | cliente caiu no funil → **contatar** pra agendar. **⏰ SLA 48h** (não contatou em 48h → alerta pra gente = parceiro lento) |
| 📞 **Agendando** | em contato, buscando data (depende da agenda do cliente → sem SLA duro) |
| 📅 **Agendado** | call marcada (data no card) |
| 🎥 **Pós-call / emitindo** | fez a videochamada de identidade, emitindo o e-CNPJ |
| ⬆️ **Upload + Concluir** | sobe os arquivos do certificado + a chave na **"pasta do cliente"** → botão **"Concluir"** |

**Card do Board B (FILTRADO — só o mínimo pra contatar + emitir):**
- Razão social + **CNPJ** (já emitido)
- **Nome do responsável** (sócio administrador)
- **CPF do responsável** (a validação de identidade exige)
- **Telefone + e-mail**
- (opcional) tipo de certificado a emitir
- data que caiu no funil (conta o SLA de 48h)

⛔ **NÃO aparece pro parceiro:** dado fiscal (anexo, Fator R, faturamento), financeiro (plano, pagamento), outros sócios, nada além do necessário pro certificado.

---

## 🌉 A ponte (auto-feed entre os boards)
1. **Cliente assina a constituição → CNPJ sai na Junta** *(trigger = CNPJ emitido; o e-CNPJ precisa do CNPJ existir)* → o card **cai na 🔵 CERTIFICADO** (Board A) **E** dispara um card **📥 Novo** no Board B do parceiro.
2. Parceiro trabalha no Board B (contato → call → emissão), sobe arquivos + chave, dá **"Concluir"**.
3. "Concluir" → **gate de validação automático** (§abaixo) → se OK, empurra o card do Board A pra 🟩 **ATIVA** sozinho e **destrava o app completo** pro cliente.

## 🔒 Gate de validação (entre "Concluir" e "Ativa")
Ao "Concluir", **o sistema confere sozinho** (não é trabalho humano):
- arquivo de certificado presente + formato válido;
- **não vencido** (validade futura);
- **CNPJ do certificado == CNPJ do cliente**;
- responsável confere.

✅ Passou → 🟩 ATIVA. ❌ Falhou → card volta pra 🟦 NOSSA com 🚨 *"certificado inválido, revisar com o parceiro"* — **não destrava** o app quebrado.

---

## 🛡️ Segurança (acesso externo a dado sensível)
O funil do parceiro é **acesso de terceiro a dado sensível** (o certificado = a identidade digital pra agir pela empresa; CPF do responsável). Requisitos:
- **Escopo mínimo:** só os clientes **atribuídos**, só a **etapa de certificado**, só os campos filtrados acima.
- **Zero acesso** a dado fiscal/financeiro/outros sócios.
- **Log de auditoria** de cada acesso e upload.
- Certificado vai pra **armazenamento isolado do cliente** (o dev já isola certificado em banco separado, LGPD).
- ⚠️ **Ao CONSTRUIR esse acesso → carregar a skill `seguranca-de-sistema`** (autenticação/autorização + acesso externo).

## 🔓 Pendências / a confirmar
- **SLAs marcados [chute]** (NOSSA 24h · EXTERNA 3 dias úteis · USUÁRIO 24/72h→op 5d) — validar na operação real. Só o **48h do "Novo" do parceiro está travado**.
- Quem é o **operador** (nosso? do Dev-Pedro? do escritório do Mauro?) — define quem loga no Board A.
- Provider/parceiro específico do certificado (decisão de negócio, na fila do Mauro).
- Cadência dos nudges automáticos da coluna 🟧 (texto + canal: WhatsApp/e-mail).

## 🔗 Cruza com
[[cruzamento-portal-interno]] (P0 certificado = a origem deste handoff) · [[matriz-portal-interno]] §Módulo 0 · [[spec-dashboard-adm-metricas]] (métrica, o par deste board) · [[mapa-ramificacoes-flow]] (as pausas do flow) · [[fluxo-abertura-portais-pedro-dev]] (os órgãos) · [[HOME]].
