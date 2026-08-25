# Handoff — Sistema de Gestão do App (estrutura + camada de dados)

**De:** Pedro (PM) · **Data:** 2026-07-23 · **Para:** dev
**Contexto:** você já recebeu o *Handoff — Dashboard de Administração* (métricas + eventos de telemetria). Este doc mostra **como o dashboard e o CRM operacional (kanban de leads) se encaixam num sistema de gestão único**, e a **camada de dados compartilhada** que sustenta os dois. **Fora do escopo aqui:** usuários, papéis, hierarquia e permissões (fase posterior).

---

## 1. Princípio — 1 sistema, 2 lentes sobre o MESMO dado

- **CRM operacional = AGIR** (card a card, tempo real): o operador trabalha cada lead.
- **Dashboard = MEDIR** (agregado, tendência): PM/marketing decidem.

**Não são 2 produtos.** A **máquina de estado do lead** é o que alimenta os dois: cada estágio vira **coluna do kanban** (agir) e **métrica de funil** (medir). Construir dois modelos de estado = caçar o mesmo funil em duas telas.

---

## 2. Estrutura — 3 setores sobre 1 camada de dados

```
SISTEMA DE GESTÃO (admin do app)
│
├── 🎯 OPERAÇÃO  (agir — o CRM)
│   ├── Pipeline de leads         → Kanban Board A (por dono-da-pausa)
│   └── Certificado (parceiro)    → Board B (funil scoped do parceiro)
│
├── 📊 MÉTRICAS  (decidir — o Dashboard, já handoff-ado)
│   ├── Funil                     → conversão/abandono/pós-pagamento/recusa
│   ├── Demanda & Mercado         → input do gate/dossiê (marketing)
│   └── Ver completo              → billing/fiscal/ticket [futuro]
│
└── 👥 CLIENTES  (base ativa — seam = coluna "Ativa"; quase tudo [futuro])
    └── ficha + saúde/monitoramento (Fator R, DAS)

     ▲ tudo puxa da MESMA ▼
┌──────────────────────────────────────────────┐
│  CAMADA DE DADOS COMPARTILHADA (o núcleo)     │
│  • Entidade LEAD/CLIENTE (1 registro/pessoa)  │
│  • Stream de EVENTOS (telemetria, ver §6)     │
│  fontes: gate · dossiê · UTM · Asaas · órgãos │
│          · engine fiscal · Board B parceiro   │
└──────────────────────────────────────────────┘
```

Setores separados porque as **audiências diferem** (operador × PM/mkt × pós-venda) — já encaixa a hierarquia de usuários da fase posterior sem retrabalho.

---

## 3. Setor OPERAÇÃO — o CRM

### 3.1 Pipeline de leads (Board A) — kanban por DONO-DA-PAUSA
O eixo do board é *"a bola está no lado de quem?"*. Cada coluna tem um relógio/alerta diferente.

```
🟦 NOSSA   🟨 EXTERNA(órgãos)   🟧 USUÁRIO   🔵 CERTIFICADO(parceiro)   🟩 ATIVA   ⬜ SAÍDAS
```

| Coluna | Bola em | Lead aqui quando (ex.) | Operador | Relógio / alerta |
|---|---|---|---|---|
| 🟦 **NOSSA** | nós | revisar nome antes da Junta · gate de validação do certificado | **AGE** | SLA nosso, alerta rápido `>24h` *[a validar]* |
| 🟨 **EXTERNA** | órgão | constituição rodando na Junta/Receita | **MONITORA** | alerta se `>3 dias úteis` *[a validar]* ou recusa |
| 🟧 **USUÁRIO** | cliente | aguardando pagamento (boleto) · assinar constituição · GOV.BR bronze | **CUTUCA** | nudge automático `24h→72h→op 5d` *[a validar]* |
| 🔵 **CERTIFICADO** | parceiro | pós-constituição, parceiro emitindo | **MONITORA** | ver §3.2 (alerta 48h no "Novo") |
| 🟩 **ATIVA** | — | certificado validado, app destravado | — | — |
| ⬜ **SAÍDAS** | humano | waitlist (regulamentada) · comercial (não encaixa) | **ROTEIA** | fila do escritório |

**Regras:**
- **Dono = coluna, passo = card.** O lead migra entre 🟦/🟨/🟧 quantas vezes o flow pedir; a coluna sempre reflete de quem é a bola AGORA. O passo do flow (ex. N21) fica no card.
- **Recusa é FLAG, não coluna.** Órgão reprovou nome / exigência = card volta de 🟨 → 🟦 (refazemos) ou → 🟧 (cliente corrige), com 🚨.
- **Auto-feed:** o card cai na coluna **sozinho**, dirigido pelo estado real do lead. O operador não arrasta — o sistema posiciona.

**Card (Board A):** razão social + CNPJ (quando existir) · nome · atividade/CNAE · passo atual · dias parado · próxima ação · 🚨 se recusa · contato · **origem/UTM**.

### 3.2 Certificado / parceiro (Board B) — funil SCOPED
O parceiro do certificado tem **login escopado no nosso sistema**, com um funil próprio (só vê clientes atribuídos na etapa de certificado).

```
📥 Novo(contatar)  →  📞 Agendando  →  📅 Agendado  →  🎥 Pós-call/emitindo  →  ⬆️ Upload + Concluir
```
- **📥 Novo:** contatar pra agendar. **⏰ SLA 48h** (não contatou → alerta pra nós = parceiro lento).
- **📞/📅/🎥:** dependem da agenda do cliente → sem SLA duro.
- **⬆️ Concluir:** sobe os arquivos do certificado + a chave na "pasta do cliente" → botão **Concluir**.

**Card do Board B (FILTRADO — só o mínimo pra contatar + emitir):** razão social · CNPJ · nome do responsável · **CPF do responsável** · telefone · e-mail · (opcional) tipo de certificado.
⛔ **NÃO expor ao parceiro:** dado fiscal (anexo/Fator R/faturamento), financeiro (plano/pagamento), outros sócios.

### 3.3 A ponte + o gate (o auto-feed do certificado)
1. **CNPJ emitido** (constituição assinada; o e-CNPJ exige o CNPJ existir) → card cai na **🔵 CERTIFICADO** (Board A) **e** cria um **📥 Novo** no Board B.
2. Parceiro trabalha no Board B → **Concluir**.
3. **Gate de validação automático** (o sistema confere, sem humano): arquivo presente + válido · não vencido · **CNPJ do certificado == CNPJ do cliente** · responsável confere.
   - ✅ passou → **🟩 ATIVA** + destrava o app completo.
   - ❌ falhou → volta pra **🟦 NOSSA** com 🚨 *"certificado inválido, revisar com parceiro"* — **não destrava**.

---

## 4. Setor MÉTRICAS — o Dashboard (já handoff-ado)
Estrutura no *Handoff — Dashboard de Administração* (3 abas: Funil · Demanda & Mercado · Ver completo). **Ponto novo deste doc:** essas abas são **alimentadas pela mesma máquina de estado e pelo mesmo stream de eventos** do CRM. A aba **Funil** é a agregação de como os leads andam pelas colunas do Board A. **Não duplicar** a lógica de estado.

---

## 5. Setor CLIENTES — base ativa [quase tudo futuro]
Seam = a coluna **🟩 Ativa** do Board A. Depois que o lead vira cliente ativo, ele deixa o pipeline e entra na base. Ficha do cliente + saúde/monitoramento (Fator R, status do DAS) dependem de features fiscais ainda não construídas → **[futuro]**, fora do primeiro corte.

---

## 6. Camada de dados compartilhada (o núcleo)

### 6.1 Entidade LEAD/CLIENTE (1 registro por pessoa, do lead ao ativo)
Atributos-chave: identidade (razão social, CNPJ, responsável, CPF, contato) · perfil (atividade/CNAE, faixa faturamento, CEP, coorte, natureza, sócios, endereço) · **origem/UTM** · **estado atual** (pausa + passo) · fiscal (anexo, Fator R, pró-labore, economia) · pagamento (status Asaas).

### 6.2 Stream de eventos
Os mesmos eventos do §6 do *Handoff — Dashboard* (passo do wizard, pagamento, gate, dossiê, fiscal, edição de campo, retomada). **Dois consumidores do mesmo stream:** (a) analytics do dashboard, (b) máquina de estado que move os cards do CRM. **Uma lista de eventos só.**

### 6.3 Conexões de dados (o mesmo dado servindo os 2 lados)
| Dado (fonte) | → OPERAÇÃO (card/coluna) | → MÉTRICAS (tile) |
|---|---|---|
| Gate: pill · texto-livre · faixa · recusa | atividade/CNAE no card | Demanda&Mercado + Funil(recusa) |
| Dossiê: CEP · sócio · endereço · natureza · coorte | dados do card | Demanda&Mercado |
| **UTM/origem** (entrada) | "de onde veio" no card | leads por canal / CAC [futuro] |
| **Estado/pausa** (máquina de estado) | **a coluna do kanban** | **Funil: abandono/tempo por etapa** |
| Pagamento (Asaas) | move "aguardando pagamento" | conversão pós-pagamento · boleto×cartão |
| Constituição/órgãos | coluna EXTERNA + 🚨 recusa | tempo espera órgão · rejeição JUCEMG |
| Certificado (Concluir + gate) | 🔵 → Ativa | tempo até ativa |
| Fiscal (anexo · Fator R · economia) | (vai pro portal do cliente) | economia agregada · Fator R da base |

---

## 7. Os 2 pré-requisitos que sustentam o SISTEMA INTEIRO
1. **RF-01 — persistência do estado do lead.** No handoff do dashboard isso estava como bloqueador *só das métricas*. Cruzando com o CRM: **o kanban precisa do mesmo estado persistido pra o card existir e se mover.** Então RF-01 é a **fundação do sistema de gestão inteiro** (CRM + dashboard), não só do dashboard. Prioridade #0.
2. **UTM/origem no wizard, agora.** Alimenta o dashboard (CAC por canal) **e** o card do CRM ("de onde veio esse lead"). Barato de colocar, **impossível de recuperar depois** — cada dia sem captura é dado perdido.

---

## 8. Segurança (acesso do parceiro — §3.2)
Acesso externo a dado sensível (o certificado = identidade digital pra agir pela empresa; CPF do responsável). Requisitos: **escopo mínimo** (só clientes atribuídos, só a etapa de certificado, só os campos filtrados) · **zero** dado fiscal/financeiro/outros sócios · **log de auditoria** de acesso e upload · certificado em **armazenamento isolado do cliente** (banco separado, LGPD).

---

## 9. Fora deste doc / decisões abertas
- **Usuários, papéis, hierarquia, permissões** — fase posterior (mas os 3 setores já anteciparam as audiências).
- **SLAs numéricos** — só o **48h do "Novo"** do parceiro está travado; os demais são chute a validar na operação.
- **Quem é o operador** do Board A (nosso / do time dev / do escritório) — a definir.
- **Provider/parceiro específico** do certificado — decisão de negócio.
