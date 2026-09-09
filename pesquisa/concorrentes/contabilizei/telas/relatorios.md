---
tipo: fato
data: 2026-07-09
concorrente: Contabilizei
plataforma: [desktop, mobile]
media: 5.8
tags: [concorrente, ux]
---

# Tela: Relatórios — Contabilizei

## Notas (0–10)
| Eixo | Nota | Justificativa |
|---|---|---|
| Clareza | 5 | O layout é limpo (5 tipos + competência + baixar), mas **o QUE é cada relatório é opaco**: Balanço, DRE, Balancete, Razão, Diário sem uma linha de explicação. Um dono de ME não sabe qual escolher. |
| Eficiência | 7 | Mecânica direta: escolhe tipo → mês/ano → busca → baixa. Steppers `«»` + dropdown dão duas formas de navegar competência. Poucos cliques. |
| Feedback | 5 | "Baixar" fica esmaecido (desabilitado) até buscar — feedback implícito. Mas **sem prévia**: você baixa um arquivo às cegas, sem ver o conteúdo antes. Sem estado de "gerando…". |
| Linguagem | 3 | **Contabilês puro e sem tradução**: Balanço / DRE / Balancete / Razão / Diário / Competência. Zero tooltip, zero "para que serve". Barreira total para leigo. |
| Confiança | 6 | São os relatórios oficiais, o que passa seriedade. Mas a falta de contexto ("qual uso pra empréstimo? qual o contador pede?") reduz a utilidade prática pra quem não é contador. |
| Mobile | 9 | Ótima adaptação: os 5 botões viram **um dropdown único**, competência com mês/ano + steppers + busca + Baixar, tudo acessível e legível. Melhor responsividade do conjunto. |
| **Média** | **5.8** | |

## O que vi (fatos)
- Título "Relatórios Contábeis".
- **5 tipos** em botões/abas: **Balanço · DRE · Balancete · Razão · Diário**.
- Linha "Competência:" com **dropdown de mês (Dezembro)** entre steppers `«»`, **dropdown de ano (2025)** entre steppers `«»`, **botão azul de busca (lupa)** e botão **"Baixar"** (azul-claro, aparência desabilitada até buscar).
- Nenhuma explicação do que cada relatório contém; nenhuma prévia; download direto de arquivo.
- **Mobile**: os 5 tipos colapsam em **um único dropdown**; competência (mês/ano + steppers), lupa e "Baixar" empilhados. Tudo tocável e legível.

## 👍 Forças (o que copiar)
- **Colapso de 5 botões → 1 dropdown no mobile** — padrão responsivo elegante que devemos adotar.
- **Seletor de competência com dois modos** (stepper rápido + dropdown direto) atende quem quer velocidade e quem quer precisão.
- **CTA desabilitado até haver seleção válida** previne download vazio.
- Tela enxuta, sem ruído.

## 👎 Fraquezas (nossa oportunidade)
- **Contabilês sem tradução**: DRE, Balancete, Razão, Diário jogados sem uma frase do que são ou pra que servem. É a tela mais hostil ao leigo do conjunto.
- **Sem prévia**: baixa-se o arquivo às cegas — não dá pra ver o relatório na tela antes de baixar.
- **Sem orientação de uso**: qual relatório o banco pede pra crédito? Qual o contador externo precisa? Nenhuma pista.
- **Sem feedback de geração** ("preparando seu relatório…") nem confirmação pós-download.

## 🎯 Contraproposta Legalizai Story Book
- **Cada relatório com uma linha humana**: "DRE — quanto sua empresa lucrou no período", "Balancete — foto das contas do mês", "Razão — histórico detalhado de cada conta". Traduzir contabilês em resultado.
- **Prévia na tela antes de baixar** (ao menos totais/gráfico-resumo), com opção de baixar PDF/Excel — não obrigar download às cegas.
- **Etiquetas de uso**: "Peça este pro banco", "Este o contador precisa", "Este pra sócios" — orientar a decisão.
- **Estado de geração explícito** ("Gerando seu relatório…") + confirmação/toast pós-download.
- Manter o **colapso responsivo em dropdown** no mobile como referência.

## Links
- [[contabilizei]] · [[playbook-crm-contabilizei]] · [[HOME]]
