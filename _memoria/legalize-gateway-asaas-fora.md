---
name: legalize-gateway-asaas-fora
description: "08/09: Asaas saiu (nos jogaria pro escopo PCI-DSS); reunião sendo marcada com Pagar.me; pesquisa arquivada em pesquisa/pagamento/"
metadata: 
  node_type: memory
  type: project
  originSessionId: b04232d3-1d88-4ff0-a086-83edf7ab4826
  modified: 2026-09-09T11:44:25.647Z
---

O **Asaas deixou de ser o gateway** (decisão do Pedro com o programador,
08/09). Motivo: no formato que ele oferece, o nosso app manipularia número de
cartão, o que nos joga pro escopo **PCI-DSS (SAQ-A-EP)**. O dev sugeriu
**Pagar.me** e **PagBank**, onde a operadora assume esse pedaço.

Pesquisa profunda rodada no Gemini e arquivada íntegra em
`pesquisa/pagamento/2026-09-08-provedores-pagamento-saas-br.md`, com 3 ressalvas
de leitura no topo. O prompt que a gerou está em
`pesquisa/prompt-pesquisa-gateways-pagamento.md`.

**O que a pesquisa achou, resumido:**
- **Efí** ficou em 1º **por preço** (3,49% puro, sem taxa fixa — num ticket de
  R$19 isso é 3,49% contra 6,05% do Pagar.me), mas aparece como "SAQ-A-EP **ou**
  SAQ-A", ambígua no critério que motivou a troca.
- **Pagar.me** é SAQ-A limpo, tem **Card Updater** (renova token de cartão
  vencido; a Efí não tem) e suporta **adicionar avulso à fatura do ciclo**, que
  é o nosso modelo. Perde no preço: ~3,99% + R$0,40.
- ⚠️ **O PagBank ficou fora da matriz**, apesar de ser uma das 2 recomendações
  do dev.

**How to apply:**
- **Reunião com o Pagar.me sendo marcada.** A pauta de 10 perguntas está na
  conversa; as 5 que decidem: taxa fixa negociável na entrada · confirmação
  por escrito de SAQ-A · Card Updater é nativo ou pago · dá pra adicionar
  avulso à fatura do ciclo · split exige KYC do recebedor.
- 🔴 **Split exige o recebedor cadastrado no PSP** (PLD/AML do BC). Isso
  atrapalha o repasse da taxa da Junta e do certificado — ver
  [[legalize-certificado-vira-gate-e-cobranca]].
- ⚠️ A tela E9 foi construída pressupondo Asaas: o `remoteIp` do dispositivo do
  pagador, o enum `CREDIT_CARD`/`PIX`/`BOLETO` e a ausência de débito vieram de
  exigências dele. Reconferir antes de integrar o provedor novo.
- Fidelidade é cláusula do **nosso contrato**, não do gateway: o que se pede ao
  provedor é recorrência simples e cancelável.
