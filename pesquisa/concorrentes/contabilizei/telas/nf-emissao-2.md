---
tipo: fato
status: vivo
data: 2026-07-09
concorrente: Contabilizei
tags: [concorrente, ux]
---

# Tela: Emitir Nota (formulário de emissão) — Contabilizei 👑

> A JOIA DA COROA. Fluxo: NF listagem → "Emitir nova nota" → selecionar tomador (`#/emissor/tomadores`) → **formulário de emissão**. Capturado sem emitir nota real.

## Notas (0–10)
| Eixo | Nota | Justificativa |
|---|---|---|
| Clareza | 8 | Seções claras (empresa, valor, serviço, ISS, descrição); serviço pré-preenchido; frase de tranquilidade no fim |
| Eficiência | 7 | **Auto-preenche o NBS pela CNAE** (ótimo) e mostra alíquota; mas descrição é texto livre manual e valor começa R$0,00 |
| Feedback | 7 | Dicas inline (por que o NBS não muda imposto; quando marcar ISS); mas SEM preview da nota antes de "Continuar" |
| Linguagem | 6 | Jargão NBS/ISS/CNAE presente — explicado, mas ainda é contabilês exposto no fluxo mais usado |
| Confiança | 8 | "cancele dentro do mesmo mês", alíquota visível, FAQ lateral, tags (Intelectual/Atividade principal) |
| Mobile | 3 | 🔴 Barra de nav inferior CORTA o formulário no meio + "Fale conosco" tapa o card do serviço — na tela mais crítica |
| **Média** | **6.5** | |

## O que vi (fatos)
- Campos: Dados da empresa (tomador, dropdown) · Valor (R$) · Serviço prestado (NBS pré-selecionado: 7319-0/04 Consultoria em publicidade, NBS 111033300, alíquota 6%) · toggle "ISS retido na fonte?" · Descrição do serviço (textarea) · botão Continuar.
- Caixa de dica: "Preenchemos automaticamente o serviço prestado (NBS) com base na atividade principal da sua empresa (CNAE)... não impacta nos seus impostos."
- Placeholder da descrição JÁ mostra o formato ideal: "Serviço de 7319-0/04 - Consultoria em publicidade prestado entre os dias 19/07 e 30/07" — mas obriga o usuário a digitar.
- "Consultor de NBS" (link) + "Alterar serviço prestado (NBS)".
- Rodapé tranquilizador: "Emita sua nota tranquilamente, você poderá cancelar dentro do mesmo mês."
- FAQ lateral (Dúvidas frequentes) + Central de ajuda.

## 👍 Forças (o que copiar)
- **Auto-preenchimento do NBS pela CNAE** — reduz muito a fricção do campo mais difícil. Copiar e melhorar.
- Alíquota visível + tags de contexto = transparência boa.
- Mensagem de segurança ("cancele no mesmo mês") reduz medo de errar.
- Ajuda inline no ISS (explica o caso de uso, não só o termo).

## 👎 Fraquezas (nossa oportunidade)
- **Descrição manual** apesar de já saberem o formato (mostram no placeholder!) — deviam auto-gerar.
- Sem **preview** da nota antes de continuar.
- Jargão (NBS/ISS) exposto.
- **Mobile quebra** (nav inferior sobre o form) — inaceitável na tela mais usada.
- Antes de chegar aqui, um **modal de cobrança por medo** bloqueia (ver [[nf-emissao-1]]).

## 🎯 Contraproposta Legalizai Story Book
- **Emissão em 1 toque pro caso recorrente:** mesmo cliente + mesmo serviço do mês passado → botão "Repetir última nota", só confirma valor.
- **Auto-gerar a descrição** a partir de serviço + período (eles já têm o formato — só não usam).
- **Preview da nota** antes de emitir (some com o medo de errar melhor que texto).
- **Linguagem humana:** "Onde você prestou o serviço?" em vez de "ISS retido na fonte?"; NBS escondido atrás de "tipo de serviço" com o código em segundo plano.
- **Mobile de verdade:** form em foco, sem nav flutuante por cima — nosso diferencial declarado, provado na tela que mais importa.
- Meta: bater a nota deles (6.5) fácil — o núcleo é bom, mas o mobile e a linguagem são brechas largas.

## Links
- [[nf-emissao-1]] · [[nf-listagem]] · [[_relatorio-auditoria]] · [[contabilizei]] · [[HOME]]
