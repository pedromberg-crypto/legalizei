---
tipo: marco
status: vivo
dominio: execucao
data: 2026-09-13
assunto: persona-zero
tags: [execucao, marco, persona-zero, metodo]
---

# 🏁 O método virou cronológico, e a persona zero virou o motor

**59º flow, 13/09/2026.** Dois blocos: um de correção fiscal, um de mudança de método.

## 1 · O arredondamento por tributo foi aplicado

Achado de 13/09 (o DAS é a **soma de 6 parcelas arredondadas**, não `receita × alíquota`) estava documentado mas não propagado. Corrigido em 5 arquivos, incluindo uma **conclusão errada de 09/09** que ainda estava marcada ✅ em três lugares dizendo *"não era arredondamento"*. Era.

No modo cru: `I6` ganhou a ordem da conta como regra (base → reparte nos 6 → arredonda cada um → soma) e `I30` passou a exigir **6 linhas** na composição, não uma alíquota. Meia pergunta do Mauro fechou junto (a folha de empresa nova anualiza, Res. CGSN 140/2018 art. 26 §4º); falta a metade da receita.

## 2 · 🔑 A mudança de método (provocação do Pedro)

> *"me usar como a persona 1 de fato, com características travadas… e ir estudando pelo histórico da minha conta como eles aplicaram cálculos, guias e tudo que é preciso de funcionalidade básica."*

Sai a varredura por **categoria** (o que a função precisa fazer), entra a varredura por **ordem de execução real** (o que aconteceu com esta empresa, nesta data, e o que o contador fez).

**Duas travas nasceram junto**, ambas negociadas antes de começar:

1. 🏷️ **Etiqueta de três vias.** O líder é evidência, não autoridade: ⚖️ obrigação legal (copiar, citando a lei) · 🏢 decisão deles (decidir de novo) · 🐛 defeito ou interesse deles (não copiar). Sem isso, em três semanas temos um clone com os defeitos junto.
2. 🚫 **Coluna do que o caso NÃO prova.** A persona zero é unipessoal, Anexo III, 1 nota/mês, sem funcionário. Ficam mudos: 2+ sócios, Anexo V, Fator R virando, teto, folha, CNAE secundário. Ausência de evidência não é ausência de requisito — foi assim que nasceu o "plano de saúde do sócio".

**Arquivo 1:** `produto/persona-zero/constituicao.md` — os **90 campos / 19 telas** do schema gerado, instanciados com os valores reais.

## 3 · O que a varredura achou em um dia

| | Achado | Etiqueta |
|:--:|---|:--:|
| 🔴 | **Procuração da Contabilizei: 5 anos, TODOS os serviços, inclusive confissão de débitos.** Assinada 08/01/2026, válida até 08/01/2031. Ter procuração é inevitável; a **largura** é escolha, e eles escolheram o máximo | 🏢 |
| 🔴 | **Intimação da Receita de 20/08/2026 sem primeira leitura.** 4 mensagens no DTE, 4 não lidas. O dono não sabe que existe; quem tem poder de tomar ciência é o contador | 🐛 |
| 🔴 | **A líder nunca entregou o contrato social ao cliente.** 44 e-mails no marcador, **zero anexos**; no portal, a "Área de Documentos" é upload do cliente para eles. Para ter o próprio documento de constituição, o dono precisa pagar | 🏢 |
| ⏱️ | **O certificado digital leva 16 minutos.** AC SAFEWEB, 22/12/2025, 16:33→16:49, videochamada no meio, **senha chega junto com o arquivo**. Fecha uma incógnita do handoff de 12/09 | ⚖️ |
| 🔑 | **O pró-labore só começa em março/2026** — quase 3 meses de CNPJ ativo sem nenhum. Esse intervalo não existe no nosso mapa, e é onde todo cliente nosso vai nascer | — |
| 🔑 | **O aceite do contrato é 38 dias depois da abertura** (12/12 → 19/01), e a procuração veio 11 dias antes do aceite. Se o ciclo de cobrança ancora no aceite, ancora depois da empresa existir | — |
| ⚠️ | **Nossa regra de natureza jurídica discorda do caso real:** o RPA manda SLU no unipessoal, o Cartão CNPJ traz **206-2 LTDA**. Pergunta pro Ademar | — |
| 🐛 | **A DEFIS de 2025 foi transmitida** — e não está em nenhuma das nossas 8 categorias. Primeira confirmação prática de que o recorte funcional tem furo no eixo temporal | ⚖️ |
| 🐛 | **O e-CAC vai ser desativado** e migra pro portal `servicos.receitafederal.gov.br`, que já tem link próprio quebrado. Nosso roadmap de integração tem prazo | — |

## 4 · Doutrina que nasceu

🔴 **Conferir a CONTA antes de concluir ausência.** Quase registrei "não existe e-mail de constituição" olhando o inbox errado: o conector estava no `pedro.melodata@`, e a empresa vive no `pedromberg@`. Na caixa errada, a Contabilizei aparece como **prospecção**, não como contador.

🔴 **A tela C4 é a mais cega que temos:** 10 campos, **9 preenchidos por nós com valor fixo e zero conferidos** contra caso real (capital social R$10.000, metragem 20m², "atividade inócua = Sim"). Resolve com um documento só — o contrato social.

## 5 · Aberto

- 🔴 **Contrato social**: único caminho restante é a certidão paga da JUCEMG. Ato **31217298589**, aprovado **12/12/2025**, imagem 798 KB, **único ato da empresa** (nenhuma alteração em 9 meses). Já está na cesta em Serviços WEB.
- 🔴 Conteúdo da **Intimação nº 19445629** — não aberta de propósito: abrir registra data de ciência, com efeito jurídico. Decisão do Pedro.
- 🟡 2 das 4 mensagens do DTE não lidas por mim (iframe, abaixo da dobra).
- 🟡 Arredondamento por tributo aplicado na doc, **não no simulador** nem em código.
- ⚠️ Procuração ativa até 2030 no **CPF** do Pedro para **ATTEMPO SOLUÇÕES CONTÁBEIS** (01.386.616/0001-05), que não é a Contabilizei. Provável contador anterior de PF. Conferir.
- ⚠️ Processo de teste **26/616.178-2 (PEDRO MARKETING BOM LTDA)** parado em "Aguardando Assinatura" na JUCEMG desde 31/08.

## Links
[[constituicao]] · [[2026-09-13-ecac-procuracao-e-caixa-postal]] · [[2026-09-13-certificado-16-minutos-e-o-contrato-que-nunca-chegou]] · [[2026-09-13-cartao-cnpj-persona-zero-LITERAL]] · [[2026-09-13-teardown-prolabore-e-pgdas-conta-real]] · [[HOME]]
