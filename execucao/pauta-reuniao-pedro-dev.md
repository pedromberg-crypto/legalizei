---
tipo: operacao
status: rascunho
data: 2026-07-09
tags: [tech, produto]
---

# 🧑‍💻 Pauta técnica — reunião Pedro Dev (sexta 10/07, 9h)

> Do que levantamos (auditoria UX, fluxo Izabela, matriz CNAE, playbook), o que vale debater/virar tarefa. **Rascunho pra Pedro avaliar** antes de fechar as tarefas.

| # | Tema | O que já temos | Por que levar (debate/decisão) | Tarefa candidata (Pedro Dev) |
|---|---|---|---|---|
| 1 | **Portais gov: API × RPA** | Mapa Izabela: portal por passo (JUCEMG, Redesim, ALF PBH, SISDRAM, BHISS/DES-BH, SIARE). Ele já faz scraper JUCEMG | Definir o que dá pra integrar por API oficial vs precisa RPA/Playwright | Mapear cada portal: tem API? sandbox? senão, RPA viável? |
| 2 | **Build-vs-buy commodity** | NFS-e (Focus NFe cobre BH, R$90–114/mês) · certificado A1 (parceira comissionada) · gateway assinatura · conta PJ | Não construir do zero; escolher parceiros | PoC/avaliação das APIs: custo, cobertura BH, sandbox |
| 3 | **NFS-e Nacional (Reforma Tributária)** | BHISS cita NFS-e Nacional | Decisão arquitetural: integrar já no padrão nacional, não só municipal BH | Pesquisar padrão NFS-e Nacional + se o parceiro suporta |
| 4 | **🔐 Segurança do dado fiscal + chave A1** | O forte dele (2,5a segurança). Vamos guardar a chave privada do CNPJ dos clientes | O ponto mais crítico/arriscado — vazamento = fim | Desenhar arquitetura de guarda/uso do certificado A1 |
| 5 | **Filtro CNAE por regime** (feature validada Izabela) | Matriz CNAE 1332 IBGE + anexo pronta ([[cnae-matriz-governo]]) | Feature-chave do onboarding (resolve "escolhi anexo errado") | Usar a matriz pra montar filtro regime→CNAE |
| 6 | **Modelo de dados multi-tenant + LGPD** | Muitos clientes/empresas, dado fiscal sensível | Fundação — decidir agora, caro mudar depois | Debater esquema multi-tenant + LGPD |
| 7 | **App Legalizei × Leghub** | Leghub já automatiza ~50% da operação interna | Compartilham código/dados? App novo separado? | Debater relação/arquitetura app cliente × back-office |
| 8 | **Direção de UX do MVP** | Auditoria de 15 telas + wizard ([[_relatorio-auditoria]]): mobile-first real, emissão 1-toque, sem cross-sell, dados-empresa 1ª classe, linguagem humana | Base dos wireframes; complementa a análise tech dele da Contabilizei | Cruzar nossa auditoria UX com o teardown tech dele |
| 9 | **Stack** | Modelo pleno-core + guardrail sênior (§13 base). É a pauta principal | Ele propõe (React/Node?); debatemos com olhar de segurança/escala | Apresentar stack candidata + justificativa |
| 10 | **Motor de compliance / acessórias** | Matriz de responsabilidades (DES-BH, DEFIS, DCTFWeb...) — pendente Larissa | Flag de arquitetura: app precisa orquestrar/lembrar acessórias | (aguardar Larissa) desenho preliminar do motor |

## Como usar
Avaliar com Pedro quais debater na sexta × quais viram tarefa já. Aprovados → viram cards no [[kanban-legalizei]] (Triagem) com origem nesta pauta.

## Links
- [[_relatorio-auditoria]] · [[cnae-matriz-governo]] · [[2026-07-09-conversa-izabela]] · [[spec-mvp-v0]] · [[orgaos-sistemas-abertura-bh]] · [[HOME]]
