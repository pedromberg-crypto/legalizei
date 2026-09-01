---
tipo: derivado
status: vivo
data: 2026-09-01
assunto: handoff-dev-constituicao-me
deriva_de: [../flow/flow-data.mjs, ../telas-jucemg-mapeamento-prints.md, ../../reunioes/2026-08-31-rua-satelite-38-40-constituicao-jucemg-campo-a-campo.md]
tags: [execucao, handoff, dev, constituicao, me, jucemg]
---

# 🛠️ Handoff dev — constituição de ME, o que mudou em 31/08 e 01/09

> Pra quem for implementar o backend/RPA da abertura. Este doc é o **resumo executivo das mudanças**; a fonte-verdade continua sendo `execucao/flow/flow-data.mjs` (nós, campos, notas) e `execucao/dados-coletados-abertura-ate-viabilidade.md` (gerado a partir dele). Se os dois discordarem, o `flow-data` ganha.
>
> Escopo: **caminho Abrir · ME · Simples Nacional · serviço · BH**. MEI e Migrar seguem próprios e são citados só onde a regra difere.

## 0. Como ler as 3 fontes

| Fonte | O que é | Quando usar |
|---|---|---|
| `execucao/flow/flow-data.mjs` | Fonte única do flow: nós, rotas, campos coletados (`dados`), pendências (`falta`) e os campos que a Legalizai preenche sozinha (`PREENCHIDOS_INTERNAMENTE`) | Sempre que a pergunta for "que dado essa tela coleta?" |
| `execucao/mapa-flow-mermaid.md` | **Gerado** por `node execucao/flow/gerar-mapa.mjs`. Diagrama + tabela de telas | Pra ver a topologia (o que leva a quê) |
| `app/src/app/apresentacao` | Demo navegável com as telas REAIS + a leitura de UX de cada uma | Pra ver a tela funcionando e entender a intenção |

⚠️ Nunca editar `mapa-flow-mermaid.md` à mão: ele nasce do `flow-data.mjs`.

## 1. A origem de tudo: a gravação real da JUCEMG

Em 31/08 o Pedro e a Izabela (contadora) rodaram uma **constituição de verdade**, gravando a tela campo a campo, da viabilidade até a assinatura: **141 prints**, mapeados um a um em [[telas-jucemg-mapeamento-prints]]. Isso virou a fonte mais primária do produto — mais forte que o PDF oficial da Junta, que descreve os passos mas não os valores de cada campo.

Consequência prática pro dev: **onde este doc cita um valor, ele foi VISTO num print**, não inferido. Os poucos que continuam sendo suposição estão marcados 🟡.

## 2. O que o app coleta, e o que o RPA preenche sozinho

### 2.1 Ordem real das telas (ME)

```
E3.1 dados → E3.2 MEI×ME → E3.4 endereço+categoria (2 gates)
   → triagem sócios → faixa → E6 conta → E7 plano → E9 pagamento
   → [E9.S pago | E9.SB boleto] → status
   → C0 atividade → C5 secundários → C1 seus dados → C2 INSS
   → C3 sócios → C4 dados da empresa* → C7 nome
   → A1 revisar → A2 termo → A3 status (Junta) → A4 assinatura → A5 dia-1
```

`*` **C4 não existe** pra quem escolheu o endereço fiscal da Legalizai (vai de C3 direto pro C7). Ver §4.2.

### 2.2 Campos coletados do cliente (o que precisa existir no banco)

- **E3.1** nome, e-mail, telefone
- **E3.4** CEP + número + complemento da EMPRESA · categoria · **tipo de imóvel (casa/apartamento/outro)** · **titular reside no local? (sim/não)**
- **E6** nome, CPF, telefone, e-mail, senha *(sem endereço — ver §4.1)*
- **C0** descrição livre da atividade → CNAE principal
- **C1** RG + órgão emissor · data de nascimento · **nacionalidade** · estado civil (+ regime de bens se casado) · **endereço pessoal do titular** (CEP, número, complemento)
- **C2** contribui INSS por fora? + valor
- **C3** por sócio extra: nome, **CPF**, % de participação, nascimento, nacionalidade, RG + órgão, estado civil (+ regime), **endereço** (CEP, número, complemento)
- **C4** índice cadastral do IPTU · tipo de endereço (próprio/coworking) *(o resto chega preenchido do E3.4)*
- **C7** 3 opções de razão social (ordenadas) · objeto social (gerado) · nome fantasia (opcional)

### 2.3 Campos que o RPA preenche, sem perguntar (24 hoje)

A lista completa e comentada vive em `PREENCHIDOS_INTERNAMENTE` (`flow-data.mjs`) e sai renderizada em `dados-coletados-abertura-ate-viabilidade.md`. Os que mais importam pro robô:

| Campo | Valor | Onde |
|---|---|---|
| Evento / ato | 101 (inscrição 1º estabelecimento) · 090-CONTRATO · **315** (enquadramento ME) | Viabilidade / Integrador |
| Natureza jurídica | SLU sem sócio · LTDA com sócio (**decisão interna**, não é pergunta) · código **2062** na Viabilidade/Integrador e **206-2** no DBE | Todos |
| Tipo de unidade | **Produtiva** | Viabilidade + DBE |
| Forma de atuação | **"Atividade Desenvolvida Fora do Estabelecimento"** ⚠️ não é "Internet" | Viabilidade + DBE |
| Metragem | 20 m² (área total e utilizada) | Viabilidade |
| Acesso ao endereço | Pedestre | Prefeitura |
| Atividade exercida no local | **Não** em todas (é o que habilita "Escritório/sede administrativa") | Prefeitura |
| Atividade inócua/virtual | Sim | Bombeiros |
| "Edificação nova?" | **Não** 🟡 suposição de 1 caso — confirmar com a especialista | Prefeitura |
| Capital social | R$ 10.000 fixo · quota de R$ 1,00 · integralizado em moeda corrente | DBE + Integrador |
| Participação do sócio | **% × R$10.000** (o valor em R$ é também o nº de quotas) | DBE/QSA |
| Qualificação do representante | 49 - Sócio-Administrador | DBE |
| Profissão (todos os sócios) | Empresário | Integrador |
| Datas | dia do preenchimento, nunca retroativa (assinatura, início de atividade, mandato) | Integrador |
| Contrato | Padrão, **15 cláusulas**, sem anexo, sem cláusula extra, sem testemunha | Integrador |
| Contato (e-mail/telefone) | **sempre o nosso**, nunca o do cliente | DBE/Integrador |
| Endereço de correspondência | igual ao do estabelecimento | DBE |
| Telefone enviado aos órgãos | **8 dígitos (sem o 9)** — a captação no app segue com 9, quem tira é o RPA | DBE/Integrador |
| Requerente do DAE | o titular | Integrador |

## 3. Regras duras que decidem deferimento

1. 🔑 **Apartamento exige que o titular resida no local.** Sem isso a Prefeitura de BH **indefere** — visto ao vivo: a mesma empresa foi de indeferida pra deferida só trocando essa resposta. Hoje o app resolve isso **antes do pagamento** (E3.4) e oferece a saída (endereço fiscal) pra quem não mora no imóvel.
2. 🔑 **Anexo/procuração no processo derruba o Registro Automático.** Aviso do próprio sistema da JUCEMG. Por isso o contrato é sempre o padrão de 15 cláusulas, sem anexo.
3. **Procuração da JUCEMG** só serve se já estiver **arquivada** previamente — não dá pra criar na hora.
4. **Assinatura**: 2 assinaturas GOV.BR separadas (Junta e Receita/DBE), ~5 min entre elas, nível **Prata/Ouro** e **2FA ativa**. 🔜 o app ainda modela **uma** assinatura e não checa 2FA (pendência conhecida, adiada pelo Pedro).
5. **DAE**: valor real **R$ 281,08** (JUCEMG 281,08 + CNE 0,00), cobrando 2 atos (contrato + enquadramento ME). O número do DAE é **digitado manualmente** no Registro Digital — não é reconhecido só pelo protocolo.
6. **Ordem do e-CAC**: a procuração do e-CAC exige **CNPJ já existente**. Hoje o checklist a coloca no Passo 16 (protocolo) e ela só pode valer **depois do Passo 18**. 🔴 Corrigir antes de implementar.

## 4. O que mudou em 01/09 (e por quê)

### 4.1 Endereço pessoal saiu do cadastro (E6) e foi pro C1
No E6 a pessoa acabava de responder o endereço da EMPRESA (E3.4) e o cadastro pedia outro endereço sem dizer de quem era. Agora o endereço pessoal é perguntado no **C1**, com rótulo próprio ("Onde você mora — seu endereço pessoal, não o da empresa"). É a ficha do **Representante** no DBE.

### 4.2 Quem usa nosso endereço fiscal não vê o C4
Não sobrava nada pra responder (endereço, IPTU, tipo de imóvel e residência são sobre um imóvel que não é dele). `C3 → C7` direto; a rota `/dossie/empresa` redireciona sozinha em deep-link. **O MEI continua vendo a tela** (a pergunta "Como você atende?" é dele).

### 4.3 Carry-forward do endereço
O que a pessoa responde no E3.4 (CEP, número, complemento, tipo de imóvel, residência) **chega preenchido no C4**. No mock isso trafega por `sessionStorage` (`app/src/lib/rascunho.ts`); **no backend real vem do estado da conta**, não da URL — endereço é dado pessoal e não viaja por querystring (RF-01).

### 4.4 Gate do imóvel subiu pra antes do pagamento
Era no C4 (pós-pagamento) e travava a resposta em "Sim" quando era apartamento — quem não morava lá não tinha caminho honesto. Agora está no E3.4, com a saída do endereço fiscal (+R$60/mês) aparecendo **antes** de qualquer cobrança.

### 4.5 A3.2 (gate de certificado) saiu do caminho ME
Entrou em 26/08 com a justificativa "a procuração exige certificado já validado". Isso é impossível: o certificado é **e-CNPJ** e o CNPJ ainda não existe nesse ponto. Além disso, o certificado é **incluso no plano ME** e emitido pela Legalizai. A tela segue viva pro **MEI** (`/certificado?regime=mei`) e pro Migrar, onde a empresa já existe.

### 4.6 Campos que entraram, saíram ou mudaram de valor

| Mudança | Detalhe |
|---|---|
| ➕ CPF do sócio extra | chave do sócio no QSA do DBE |
| ➕ Endereço do sócio extra | qualificação do contrato (art. 997 CC) + ficha própria no DBE |
| ➕ Nacionalidade do titular | o sócio extra já tinha; o titular não |
| ➕ "Edificação nova?" (interno) | 3ª pergunta do questionário de regulação urbana |
| ➖ Nome da mãe | não existe em nenhum dos 141 prints; no MEI vem do gov.br |
| ➖ Capital social (tela e recap) | travado em R$10.000 no backend |
| ➖ C6 natureza jurídica | decisão interna |
| 🔄 Forma de atuação | "Internet" → "Atividade Desenvolvida Fora do Estabelecimento" |
| 🔄 Tipo de unidade | "Sede" → "Produtiva" |
| 🔄 Taxa da Junta | R$268,51 → **R$281,08** |
| 🔄 Regime de bens | 4 opções no app; a Junta tem 5. "Separação total" mapeia pra **"Separação Convencional de Bens"**. Separação Obrigatória não é oferecida (decisão do Pedro) |

## 5. Decisões que o dev precisa respeitar

- **Sem gate de faturamento**: quem marca "+R$30 mil/mês" segue no fluxo normal. A ideia é acompanhar o crescimento e propor desenquadramento/EPP depois — funcionalidade de pós-venda, ainda não construída.
- **RG continua obrigatório** no app, mesmo a Junta não exigindo mais (o dado entra no contrato).
- **Telefone**: coleta com 9 dígitos, envia com 8.
- **Idempotência**: pagamento e protocolo não podem ser disparados 2x (a tela de status é a única fonte de verdade pro cliente).

## 6. Pendências abertas (não implementar sem decidir)

| # | Pendência | Dono |
|---|---|---|
| 🔴 1 | Procuração e-CAC no lugar errado do checklist (só vale pós-CNPJ) | produto |
| 🔴 2 | `next build` quebrado desde 04/08 (`(portal)/layout.tsx`, `useSearchParams` sem Suspense) | dev |
| 🟡 3 | 2FA ativa + 2 assinaturas GOV.BR separadas não modeladas | produto (adiado) |
| 🟡 4 | Endereço do contabilista PF usa o endereço do escritório | fila-Izabela |
| 🟡 5 | "Edificação nova = Não" é suposição de 1 caso | fila-Izabela |
| 🟡 6 | Prints param na escolha de assinatura (falta 2FA → deferimento → CNPJ) | produto |
| 🟡 7 | `Campo`/`Select` do DS sem `<label>` e sem nome acessível (A11Y-01) | design system |

## 7. Testes que já existem (e o que eles garantem)

`app/e2e/` — rodar com `npm run test:e2e` (sobe o `next dev` sozinho).

- `abrir-me-ate-conta.spec.ts` — 6 variáveis do gate (endereço próprio, fiscal, fora de BH, fila, categoria fora da lista).
- `constituicao-me-dossie.spec.ts` — 22 casos: obrigatoriedade campo a campo (CPF/endereço do sócio, nacionalidade, IPTU), a trava do apartamento e sua saída, o carry-forward, o C4 que some, o C6 morto (404), a ordem real, a taxa de R$281,08, a A3.2 fora do ME e a trilha do certificado no A5.

**29/29 passando em 01/09.** Se um desses quebrar, a mudança provavelmente contraria uma decisão registrada — confira o ADR (`marca/decisoes-marca.md`) antes de "consertar" o teste.

## Links
- [[flow-data]] · `execucao/flow/flow-data.mjs` (fonte única)
- [[dados-coletados-abertura-ate-viabilidade]] (gerado)
- [[telas-jucemg-mapeamento-prints]] (141 prints)
- [[2026-08-31-rua-satelite-38-40-constituicao-jucemg-campo-a-campo]] (ata da Izabela)
- [[decisoes-marca]] (ADR — toda decisão com data e motivo)
- `execucao/checklist-validacao-jucemg.html` (campo × passo oficial, artifact interativo)
