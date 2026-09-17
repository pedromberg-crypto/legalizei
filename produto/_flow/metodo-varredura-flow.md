---
tipo: referencia
status: vivo
data: 2026-07-21
assunto: metodo-varredura-flow
tags: [produto, ux, copy, flow, auditoria, metodo, rubrica]
---

# 🧪 Método de varredura do flow — rubrica viva

> Como a gente audita as telas do flow, numa passada só. Junta as **duas** varreduras que a gente rodou (mecânica + olhar crítico) em **dimensões nomeadas** (D1…D11). É VIVA: cada varredura nova **promove** os padrões que aprendeu (regra dos 3, igual o DS). Os achados moram em [[auditoria-copy-flow]]; aqui mora o **como**.

## ▶️ Como rodar (2 camadas, 1 rubrica)
1. **Camada mecânica (fan-out, um agente).** Brief do agente = *"lê TODAS as telas de `app/src/app/**` + os componentes com copy, extrai só texto visível (ignora comentário), aplica D1–D6, devolve achados com ID + `arquivo:linha` + trecho exato + por quê + severidade + o inventário-prova."*
2. **Camada crítica (eu, sobre o resultado).** Aplico D7–D11 (exigem julgamento, o agente não pega sozinho) e cruzo com o inventário.
3. **Registro.** Cada achado entra na [[auditoria-copy-flow]] com **ID estável** (R#/M#/F# mecânicos · K# críticos) e **status** (🔲→✅).

## 🔬 As 11 dimensões

### Mecânicas (o agente pega sozinho) — D1–D6
| D | Nome | Gatilho | Exceção | Sev típica |
|---|---|---|---|:--:|
| **D1** | Redundância cross-screen | mesma info/frase em 2+ telas que o **mesmo** usuário vê | ramos mutuamente exclusivos · refrão de marca deliberado | 🔴 se caminho feliz sequencial |
| **D2** | Informação massiva | muitos blocos / 2+ avisos empilhados / parágrafo longo | tela-farol densa por natureza (N18) | 🟠 |
| **D3** | Frase negativa | negativo (não/nunca/sem/perde/bloqueio/reprovado), sobretudo happy path | negativo **estruturalmente honesto** (piso R$0, "encostado no limite", saídas/waitlist) NÃO positiva | 🟠 |
| **D4** | Número sem fonte (anti-guru) | R$/prazo/%/contagem cravado sem fonte nem carimbo | fato duro com norma+URL | 🔴 (regra da marca) |
| **D5** | Eco intra-tela | mesma frase/número 2× na MESMA tela (título=CTA, aviso=camada) | — | 🟡 |
| **D6** | Travessão | qualquer `—` em copy visível | nenhuma (regra dura) | 🟠 |

### Críticas (exigem julgamento — camada minha) — D7–D11
| D | Nome | Gatilho | Ex. que originou |
|---|---|---|---|
| **D7** | Consistência de DS / token | dois padrões pro mesmo gesto · token fora do papel (coral como estado, verde-sucesso decorativo) | K4 (checkbox nativo × custom) |
| **D8** | Interação indefinida | affordance sem comportamento decidido | K5 ("Ajustar" re-anda tudo?) |
| **D9** | Hierarquia / peso | botão sticky em tela sem ação · primário×secundário trocados · o maior elemento é o que menos importa | K6 (footer sticky no status) · N7 (R$463 gigante) |
| **D10** | Feel / beat emocional | clímax sem comemoração · tela defensiva num momento de vitória · tom que não bate com o momento | K3 (N24 seco) · N8 ("saída de emergência") |
| **D11** | Legenda × ação | rótulo que contradiz o botão | K7 (N22 "sua vez" × "convidar") |

## 📏 Regras de produto que a varredura SEMPRE checa
Herdadas de [[design-system]] / [[decisoes-marca]] — travessão zero · **coral nunca é estado** · número sem fonte não entra · estimativa carimbada · PT-BR · botão `min-h-12` + rótulo literal · **conteúdo legal nunca em expander** · densidade muda apresentação, não obrigação (UX-48).

## 🔄 Como EVOLUIR (a parte "otimizando")
- **Regra dos 3 na auditoria:** um achado do olhar crítico (K) que aparece **2+ vezes** em telas diferentes deixa de ser one-off e vira **dimensão nomeada** aqui. (Foi assim que D4/D7–D11 nasceram do round K.)
- **Poda:** dimensão que não pega nada em **3 varreduras** seguidas → revisar (provável que o padrão já virou reflexo no DS e não precisa mais de check).
- **Promoção ao DS:** se D7 (consistência) pega o mesmo componente 3×, ele para de ser achado e vira item do design-system (governança mecânica > vigilância).
- **Versiona** no histórico abaixo: o que entrou/saiu e de qual round veio.

## 🗓️ Histórico
- **v1** · 2026-07-21 · nasce juntando a varredura mecânica (D1–D3, D6) com o 1º olhar crítico (D4, D5, D7–D11). Origem: os rounds **R1–R7** + **K1–K10** nas telas da cauda + tocadas.

## 🔗 Links
[[auditoria-copy-flow]] (os achados) · [[design-system]] · [[decisoes-marca]] · [[legalize-telas-padrao-layout]] · [[HOME]]
