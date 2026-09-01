---
tipo: marco
status: fechado
data: 2026-09-01
assunto: auditoria-campo-a-campo-constituicao-me
deriva_de: [../telas-jucemg-mapeamento-prints.md, ../../reunioes/2026-08-31-rua-satelite-38-40-constituicao-jucemg-campo-a-campo.md]
tags: [execucao, marco, flow, constituicao, me, auditoria, e2e]
---

# 🔍 41º flow — auditoria 1-a-1 + Playwright no flow de constituição (01/09)

> Um dia inteiro no caminho **Abrir · ME · Simples · serviço · BH**, cruzando o que os órgãos exigem (141 prints da gravação real + ata da Izabela) contra o que o app de fato capta — e depois provando o resultado com teste de navegador.

## 1. A auditoria 1-a-1 (8 itens, validados um a um)

O método: para cada campo exigido pela JUCEMG/DBE/Integrador, achar o campo correspondente no **código das telas** (não no doc). Foram 5 fontes: os 141 prints, o código, o `checklist-validacao-jucemg.html`, o `flow-data.mjs` e a `/apresentacao`.

⚠️ **Correção de método no meio do caminho.** As 3 primeiras rodadas cruzaram só prints × código × checklist. O Pedro perguntou se eu tinha lido o mapa e a apresentação — não tinha. Isso produziu **1 falso positivo** (endereço pessoal do titular, que o E6 já captava desde sempre; o `flow-data` dizia isso e eu não tinha lido). As 5 fontes foram fechadas antes de aplicar qualquer coisa.

| # | Item | Veredito |
|---|---|---|
| 1 | CPF do sócio extra | 🔴 faltava — é a CHAVE do sócio nos 3 sistemas |
| 2 | Endereço do sócio extra | 🔴 faltava — art. 997 CC + ficha própria no DBE |
| 3 | ~~Número/complemento do titular~~ | ⚪ RETIRADO — falso positivo meu |
| 4 | "Edificação nova?" | 🔴 não existia em fonte nenhuma → virou interno 🟡 |
| 5 | Forma de atuação | 🟠 valor errado: "Internet" → "Atividade Desenvolvida Fora do Estabelecimento" |
| 6 | Regime de bens | 🟠 4 opções × 5 reais → fica com 4 (decisão do Pedro) |
| 7 | Nome da mãe | 🟡 sobra — removido |
| 8 | Conversão % → R$ | ⚪ regra existia na prática, não estava escrita |

Depois, num 2º passe contra a ata da Izabela, apareceram mais 5: taxa da Junta errada (R$268,51 × R$281,08 real), ausência de gate de R$30k (**decidido não fazer** — acompanhar e propor EPP depois), RG obrigatório sem a Junta exigir (**mantido**), 2FA + 2 assinaturas não modeladas (**adiado**) e a regra do telefone sem o 9º dígito (**vira transformação do RPA**, captação segue com 9).

## 2. As 4 mudanças de tela (pedido do Pedro)

1. **Endereço pessoal saiu do E6 e virou pergunta do C1.** No cadastro ele vinha sem moldura, 2 telas depois do endereço da EMPRESA — e pior pra quem escolheu o endereço fiscal.
2. **Quem usa nosso endereço fiscal não vê o C4.** Não sobrava nada pra responder.
3. **Carry-forward:** o que se responde no E3.4 chega preenchido no C4 (`sessionStorage`, não querystring — endereço é dado pessoal).
4. **O gate do imóvel subiu pro E3.4**, antes do pagamento. 🔴 Corrigiu um buraco real: o C4 travava a resposta em "Sim" pra apartamento, e quem não morava no imóvel não tinha caminho honesto — depois de já ter pago.

## 3. A3.2 (certificado) fora do caminho ME

Entrou em 26/08 porque "a procuração exige certificado validado". É impossível: certificado é **e-CNPJ**, e o CNPJ ainda não existe nesse ponto. E o certificado é **incluso no plano**, emitido por nós. Removida do ME; segue no MEI e no Migrar.

## 4. Playwright — 29/29

Spec nova: `app/e2e/constituicao-me-dossie.spec.ts` (22 casos). Prova obrigatoriedade campo a campo, os gates (IPTU, apartamento e sua saída, C6 morta em 404, C4 que some, `/painel` que redireciona) e a taxa de R$281,08.

**2 bugs reais achados pelo teste**, não por leitura:
- **Copy morta no C4**: o subtítulo prometia capital social, campo removido em 31/08.
- **Mock divergente na A4**: o 2º sócio se chamava "Bruno Costa" ali, enquanto o dossiê inteiro dizia "Carlos Eduardo Silva" — na demo a pessoa preenchia o C3 com Carlos e 4 telas depois o app convidava Bruno. É a mesma classe de bug que a fonte única matou no dossiê em 29/07, e que tinha sobrevivido na cauda.

## 5. Mapa × apresentação

Auditoria dedicada em [[sync-mapa-apresentacao-2026-09-01]]. Resumo: **5 rotas citadas na apresentação não existiam** (404 no "abrir a tela real"), a tela nova do boleto (E9.SB) nunca tinha entrado lá, e C6/A3.2 continuavam sendo mostradas depois de removidas. Tudo corrigido; sobraram 2 ausências deliberadas (`/login` e a saída de Lucro Presumido).

## 6. Estado

- Mapa **v62** · `tsc` e `eslint` limpos · **29/29** e2e verdes.
- Doc pro dev: [[handoff-dev-2026-09-01-constituicao-me]].
- 14 linhas novas no ADR ([[decisoes-marca]], 01/09).

## 7. Falta

- 🔴 `next build` quebrado desde 04/08 (`(portal)/layout.tsx`).
- 🔴 Procuração e-CAC: as 2 decisões (corrigir a cadeia toda; procuração sempre) estão travadas, a construção não começou.
- 🟡 2FA ativa + 2 assinaturas GOV.BR separadas (adiado).
- 🟡 Fila da Izabela: endereço PF do contabilista, "edificação nova".
- 🟡 A11Y-01: `Campo`/`Select` do DS sem `<label>` nem nome acessível.
- 🟡 Vigiar faturamento pra propor EPP: decisão tomada, roadmap não.
