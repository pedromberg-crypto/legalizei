---
tipo: marco
status: vivo
data: 2026-09-10
assunto: contrato
tags: [juridico, contrato, marco, advogada, concorrente]
---

# 🏁 Marco — O contrato da Legalizai saiu do zero e foi para a advogada

> **O dia em uma linha:** partimos de *"será que o contrato do líder lista todos os serviços?"* e terminamos com uma minuta de 16 cláusulas enviada para parecer jurídico, com o contrato de referência lido **por inteiro** ao lado.

## O que entrou no vault

| Arquivo | O que é |
|---|---|
| `produto/evidencias/fontes/2026-09-10-contabilizei-contrato-LITERAL.md` | contrato do líder, **74.700 de 74.700 caracteres** |
| `produto/evidencias/fontes/2026-09-10-contabilizei-plano-contratado-LITERAL.md` | o 2º documento do aceite, 1.500 caracteres |
| `produto/evidencias/fontes/2026-09-10-contabilizei-aceites-LITERAL.md` | Carta de Responsabilidade (6.418) + Termo de lucro (4.615) + Área de Documentos |
| `produto/evidencias/fontes/_inventario-documentos.md` | o que foi lido inteiro e o que não foi, com nome |
| `produto/evidencias/2026-09-10-contabilizei-contrato-integral.md` | a leitura, com os achados |
| `execucao/entidades-legais.md` | fonte-verdade dos nossos dois CNPJs |
| `execucao/contrato/espelho-contrato-comentado.md` | briefing cláusula a cláusula para a advogada |
| `execucao/contrato/minuta-contrato-me.md` | 🆕 **a minuta**, 16 cláusulas + Anexo I |

**Total literal capturado do líder: 87.233 caracteres, 100% de cada documento.**

## As 5 descobertas que mudaram o desenho

**1. 🔥 O contrato do líder enumera o incluso e não enumera o avulso.** Quatro listas fechadas (4.1, 4.2, 5.2, 5.3), mas as cláusulas 1.8, 5.4 e 11.1 remetem os adicionais "à Plataforma". E a 5.4 aponta para o Anexo I, que é *Termos dos Planos Experts* e **não tem tabela nenhuma**. Consequência: a **ECD** está incluída na 5.3-a e vendida na loja por R$197,90. Ninguém consegue dizer qual vale. Nossa correção: a tabela de adicionais vira **anexo versionado**, com a regra de que item incluso não pode aparecer nela.

**2. 🔑 A arquitetura de duas empresas é funcional, não fiscal-cosmética.** O corte é **por natureza do ato**: o que é privativo de contador fica na empresa com CRC, todo o resto vira licenciamento de software. É isso que sustenta a abertura com honorário zero. Replicável com os nossos dois CNPJs, e o CNAE 62.03-1-00 (item 1.05 da LC 116) já está correto no cartão.

**3. 📋 A Carta de Responsabilidade da Administração é obrigatória.** Resolução CFC nº 1.590/2020, art. 3º. O texto deles diz que *"a confecção e assinatura das demonstrações contábeis depende da assinatura desta Carta pelo cliente"*. **Sem Carta, o contábil não fecha.** Vira requisito de produto, não opção.

**4. 🔥 Lei 15.270/2025 muda a distribuição de lucro em 2026.** Todo lucro sacado vai para a EFD-Reinf, com possível IRRF antecipado. Há janela: **ATA até 31/01/2026** isenta os lucros acumulados até 31/12/2025. 🕓 Citação do concorrente, não ratificada.

**5. 🎯 O "Plano Contratado" deles é só tabela de preço.** 1.500 caracteres, zero descrição de serviço. É a ausência que produz o defeito nº 1. O nosso traz preço **e** escopo.

## As decisões travadas

| Tema | Decisão |
|---|---|
| **Preço ME** | ~~3 coortes: Fundador **R$79** · Lançamento **R$99** · Base **R$139**, cada uma garantida por 12 meses da ativação~~ → 🔴 **REGISTRO ERRADO, corrigido em 14/09.** O certo, e que já valia desde agosto em [[estado-atual]]: preço do plano **R$139/mês**; **R$79** (campanha) e **R$99** (lançamento) são ofertas dos **3 primeiros meses**; o que dura **12 meses** é a **fidelidade**, não o preço. A minuta já tinha sido corrigida em **11/09** (cláusula 3.6). |
| **Preço EPP** | tabela única por **RBT12**: 189 · 239 · 309 · 399 · 519, terminando no teto do Simples |
| **Faixa** | sobe com aviso de 30 dias, **desce automaticamente** |
| **Desconto** | é **preço**, não adiantamento. Não se devolve. Só benefício concedido fora do plano é recuperável |
| **ME → EPP** | o cliente **permanece no app**. Honorário R$139 + taxa JUCEMG R$290 |
| **Folha** | **entra no escopo**, revogando 08/09. R$39 por colaborador ativo, **teto de 10**, preço de lançamento |
| **Certificado** | **benefício incluso**, não repasse. 6 travas, sendo a principal: cancelado na fidelidade, o certificado emitido é devido |
| **Repasse** | **mandato** só para a taxa da Junta. Lastro no CNAE 74.90-1-04 |
| **Avulso na fatura** | teto de **R$50** |
| **Elegibilidade** | 11 critérios, 3 saídas, régua **característica × conduta**: quem mudou de característica nunca é rescindido nem multado |
| **Migração** | **fora deste contrato.** Sem abertura não há isenção que justifique a fidelidade |

## O que foi entregue

**Artefato publicado** com 4 vistas: comentado · só a minuta · lado a lado · contrato do líder na íntegra.
**Dois PDFs** enviados por e-mail à advogada: minuta (15 páginas) e referência (23 páginas), validados com `pypdf` antes do envio.

## 🔴 O que ficou aberto

| | O quê | Quem |
|:--:|---|---|
| 🕓 | Parecer da advogada sobre as 12 perguntas do espelho | advogada |
| 🕓 | Lei 15.270/2025 e art. 32 da Lei 4.357/64 sem ratificação em fonte primária | advogada + Ademar |
| 🔴 | Anexos II, III e IV não redigidos | advogada |
| 🕓 | O R$1.100 da Legalize tradicional é o mesmo escopo do R$156,40 do líder? | Mauro |
| 🔴 | Páginas públicas e rodapé das LPs ainda estampam "Legalize Digital" | Pedro |
| 🔴 | Contrato do **MEI**: nada foi feito, é caminho próprio | depois |

## 📖 A regra de método que nasceu hoje

**Documento de alto grau para o negócio se lê INTEIRO.** Travada no `CLAUDE.md`. Nasceu porque apresentei o contrato do líder como lido quando estava **12% literal**, e o Pedro pegou perguntando *"incluindo scroll?"*. A regra obriga: declarar o quanto foi lido, salvar o literal em arquivo, e inventariar o que ficou de fora com nome.

## Links
[[minuta-contrato-me]] · [[espelho-contrato-comentado]] · [[entidades-legais]] · [[_inventario-documentos]] · [[2026-09-10-contabilizei-contrato-integral]] · [[decisoes-marca]] · [[HOME]]
