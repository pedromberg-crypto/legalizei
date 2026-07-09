---
tipo: teardown-tela
data: 2026-07-09
concorrente: Contabilizei
plataforma: [desktop, mobile]
media: 4.8
tags: [concorrente, ux]
---

# Tela: Dados da Empresa — Contabilizei

> **Alerta de captura + achado forte:** o print (desktop e mobile) NÃO abriu uma tela de "Dados da Empresa" — caiu no **dashboard Home** (mesma imagem de `folha-de-pagamento` e `meus-beneficios`). O único caminho visível para os dados cadastrais é o link discreto **"Dados da empresa e banco"** no canto superior direito (fora do menu principal), mais alguns itens em "Serviços Adicionais" (Alterar nome/endereço). **Isso valida diretamente a dor mapeada:** achar CNPJ / contrato social exige caçar — não é cidadão de primeira classe na navegação. Notas avaliam esse acesso.

## Notas (0–10)
| Eixo | Nota | Justificativa |
|------|------|---------------|
| Clareza | 4 | Nenhum dado da empresa (CNPJ, razão social, contrato social) aparece na tela principal. A porta de entrada é um link pequeno no topo direito, fácil de não ver. |
| Eficiência | 3 | **A dor confirmada**: dados cadastrais e documentos societários não estão no menu lateral nem na Home — estão atrás de um link secundário. Muitos cliques para uma informação que se consulta com frequência. |
| Feedback | 5 | A Home dá bom feedback de rotina (pendências, calendário), mas nada sobre o cadastro em si. |
| Linguagem | 6 | "Dados da empresa e banco" é claro como rótulo; o problema é a hierarquia, não a palavra. |
| Confiança | 6 | Ponto positivo: "Conta Digital PJ" mostra Banco/Agência/Conta com botão de copiar — transparência bancária boa. Mas os documentos jurídicos (CNPJ, contrato, cartão CNPJ) ficam ocultos, o que frustra na hora do aperto. |
| Mobile | 5 | O link "Dados da empresa e banco" vira ícone/rótulo minúsculo no topo — ainda mais difícil de achar no mobile do que no desktop. |
| **Média** | **4.8** | A menor nota do conjunto — e de propósito: é aqui que a Contabilizei mais dói e onde temos a maior brecha. |

## O que vi (fatos)
- Dashboard Home capturado no lugar da tela de dados.
- Acesso a dados cadastrais só por: (1) link "Dados da empresa e banco" no topo direito; (2) "Serviços Adicionais" → "Alterar nome da empresa", "Alterar endereço da empresa", "Solicitar outros documentos".
- Card "Conta Digital PJ" (Contabilizei.bank) mostra Banco 301 / Agência 0001 / Conta 311101883 com ícones de copiar e saldo ocultável — **estes** dados estão à mão.
- **Não vi na tela**: CNPJ, razão social, nome fantasia, CNAE, regime tributário, data de abertura, contrato social, cartão CNPJ, certificado digital.
- "Solicitar outros documentos" sugere que baixar documentos é um pedido/fluxo, não um download direto.

## 👍 Forças (o que copiar)
- **Dados bancários com "copiar"**: Banco/Agência/Conta com botão de cópia é ótimo micro-UX (o dado que mais se copia no dia a dia).
- Rótulo "Dados da empresa e banco" agrupa cadastro + banco num lugar (a ideia é boa; a colocação é que falha).

## 👎 Fraquezas (nossa oportunidade)
- **Dado crítico enterrado** (dor nº1 confirmada): CNPJ e contrato social não têm atalho de primeira classe. Quem precisa passar o CNPJ num cadastro externo tem que caçar.
- **Documentos por solicitação**: "Solicitar outros documentos" indica fricção — provavelmente não há download imediato do cartão CNPJ / contrato social.
- **Sem os campos que o dono mais precisa colar**: CNAE, regime, IE, data de abertura — nada à mão.
- Hierarquia trata "Indique um amigo" com mais destaque no menu do que os dados da própria empresa.

## 🎯 Contraproposta Legalizei
- **"Minha Empresa" como item fixo do menu principal** (não link escondido no topo). Abre com um **cartão-resumo copiável**: CNPJ, razão social, nome fantasia, CNAE, regime, IE, data de abertura — cada campo com botão "copiar" (igual ao que a Contabilizei já faz bem com o banco).
- **Documentos em 1 clique, sem "solicitar"**: contrato social, cartão CNPJ, certificado digital e comprovantes disponíveis para download imediato, sempre atualizados.
- Busca global ("digite: CNPJ") que leva ao dado em 1 passo.
- Este é um **diferencial barato e óbvio**: onde a líder faz o usuário caçar, a Legalizei entrega em 1 tela copiável. Ótimo ponto de demo e de posicionamento ("transparência sem cliques").

## Links
- [[contabilizei]] · [[playbook-crm-contabilizei]] · [[HOME]]
