---
tipo: verdade
status: vivo
dominio: funcionalidade
data: 2026-09-09
assunto: compliance-e-rotinas
autoridade: fonte-verdade
cobertura: parcial
balde: core
dependencia: externa
confianca: media
bloqueio: DTE-SN sem caminho (5.7); motor de vigília; extrato bancário
tags: [produto, funcionalidade, compliance, pendencias, rotinas, vigilancia, dte-sn]
---

# ✅ Compliance e rotinas — a nossa funcionalidade

> 🧭 **Autoridade:** manda no desenho de **"estou em dia?"**, das pendências e do calendário.
> O que o concorrente faz está em [[2026-09-09-contabilizei-central-rotinas]], foto com data.
> Hub: [[HOME-produto]] · catálogo: [[_catalogo]] (§5) · dependências: [[_matriz-dependencia]] (5.1–5.8).

---

## 🔗 Cruzamentos declarados

| | |
|---|---|
| **⬅️ Recebe de** | **[[guia-de-imposto]]** (`emDia`, guias vencidas) · **[[emitir-nota-fiscal]]** (nota não emitida na competência) · **[[pro-labore]]** (pró-labore não cadastrado) · **extrato bancário** · **certificado** (dias para vencer) · **DTE-SN** (Termo de Exclusão) |
| **➡️ Manda em** | 🔴 **tudo**: pendência não resolvida → Termo de Exclusão → perda do Simples → alíquota de 6% vira Lucro Presumido. E bloqueia o **informe de rendimentos** do sócio |
| **📅 Obrigação que dispara** | é a própria agenda: DAS · DARF · eSocial/DCTFWeb · DEFIS · TFE municipal |
| **👁️ O cliente precisa ver** | **"você está em dia"**, e quando não estiver, **o que fazer e até quando** |

🔴 **O cruzamento em uma frase:** compliance não é uma funcionalidade a mais, é **o estado agregado de todas as outras**. É a única tela que responde a pergunta que o dono realmente tem.

---

## 📦 Contrato de dados (validado em produção pelo líder)

```ts
GET /central-rotinas/init → {
  pendencias: {
    pendenciasCriticas: { [tipo]: { possuiPendencia: boolean, ...campos } }   // 21 tipos
    outrasPendencias:   { [tipo]: { possuiPendencia: boolean, ...campos } }   // 7 tipos
  }
  rotinas: [{
    tipo: "IMPOSTO" | "IMPORTACAO_EXTRATO" | "VENCIMENTO_MENSALIDADE"
    prazo: "2026-09-18"
    status: "EM_ABERTO" | "REALIZADA" | "ATRASADA"
    automatica: boolean                      // 🔑 de quem é a vez
    tag: "AUTOMATICA" | "EM_ATRASO" | "SEM_TAG"
    propriedades: {
      cenario: "ANTES_DIA_UM" | "NAO_GERADA" | "ENTRE_GERACAO_E_SEGUNDO_DIA_POS_VENCIMENTO"
             | "DEPOIS_DO_PRAZO" | "POS_SEGUNDO_DIA_DO_VENCIMENTO"
      nome, tituloModal, oqueE, porQueEImportante,     // 🔑 o explicador
      tipoImposto, idGuia, anoCompetencia, mesCompetencia, tipoPagamento,
      pendenciasBloqueantes: []              // 🔑 grafo de dependência
    }
  }]
  rotinasContabilizei: [ … ]                 // o que a CASA faz
}
```

🔑 **Quatro decisões que valem copiar:**

1. **`automatica: boolean` por rotina.** Extrato e mensalidade são automáticos; **imposto é do cliente**. É o mesmo "de quem é a vez" que a gente já construiu no `_timeline-blocos` (`casa` × `cliente`) — **chegamos nisso por caminhos independentes, e convergência confirma o desenho.**
2. **`cenario` escolhe a copy.** A mesma rotina fala diferente antes do dia 1, depois de gerada, e dois dias após vencer. **Cinco cenários, cinco textos**, decididos no servidor.
3. **`pendenciasBloqueantes`.** Uma rotina pode ser **bloqueada por uma pendência**, e o vínculo é dado, não regra escondida no front.
4. **Explicador por item** (`oqueE` + `porQueEImportante`), com texto pronto do servidor.

---

## 🔴 A descoberta que muda o desenho: a lista deles não é filtrada por perfil

Das **21 pendências críticas**, sete só existem em empresa muito maior ou mais complexa que o nosso ICP:

`estoque` · `ativo imobilizado` · `contrato de empréstimo` · `contrato de financiamento` · `aplicação financeira` · `contrato AFAC` · `contrato de investimento anjo`

⚠️ **É por isso que um consultor de marketing sozinho recebe *"Confirmar ausência de estoque no período"*.** A pendência nasce pra todos e o cliente tem que **negá-la ativamente**. Formulário genérico virando trabalho do cliente.

🎯 **Nosso ICP é estreito de propósito.** ME serviço, sem comércio, sem indústria, sem sócio investidor no MVP. **A gente simplesmente não tem 7 dessas** — e isso não é limitação, é o recorte pagando dividendo.

### As que valem pra nós, das 21

| Categoria | Tipos |
|---|---|
| **Dinheiro** | imposto · mensalidade |
| **Documento** | carta de responsabilidade · exigibilidade documental · contrato de prestação de serviço |
| **Acesso** | certificado digital (`diasParaVencimento`) · credencial da prefeitura · procuração e-CAC |
| **Dado** | importação de extrato · cadastro de conta bancária · cadastro de pró-labore · conciliação fiscal |
| **Aceite** | termo de débitos (com **`prazoAceiteTacito`**) |

---

## 📄 As obrigações reais (5.2), confirmadas em conta de produção

| Periodicidade | Declaração | Prova |
|---|---|---|
| **Mensal** | **PGDAS** — Programa Gerador do DAS | `TRANSMITIDO` + recibo PDF |
| **Mensal** | **DCTFWeb** | `TRANSMITIDO` + recibo PDF |
| **Anual** | **DEFIS** | `TRANSMITIDO` + `Baixar recibo` |

✅ **Ratifica a [[2026-09-09-verificacao-auditoria-tributaria|verificação de fonte primária]]**: são estas três, e ECD/ECF/EFD-Contribuições não se aplicam. Antes era documentação; agora está visto em conta real.

🔴 **O defeito deles aqui é caro e é fácil de não repetir:** a tela abre filtrada no **mês corrente**, que por definição ainda não tem nada transmitido, e mostra **"Sem informações"**. A tela que deveria ser **a prova de que a contabilidade funciona** dá, de primeira impressão, o oposto.

🎯 **Nossa regra:** a tela de prova abre no **último período COM dado**, nunca no mês corrente vazio. E o estado sem dado nenhum diz *"sua primeira declaração sai em março"*, não *"sem informações"*.

---

## 💰 O catálogo à-la-carte deles, com preço (43 serviços)

Levantado em `sistema/servicos-disponiveis`. Os que cruzam com as nossas linhas:

| Serviço | Preço | Linha |
|---|---:|---|
| Verificação de pendências | R$ 24,90 | 5.5 |
| Emissão de CND | R$ 35,90 | 6.3 |
| Reemissão de guia (Simples · INSS/IRRF · ISS) | R$ 15,90 | 2.7 |
| **Entrega de obrigações acessórias (DEFIS, DCTF, ECD, ECF)** | **R$ 197,90** | 5.2 |
| **Alteração Pró-labore** | **R$ 98,90** | 4.x |
| Parcelamento de débitos | R$ 135,40 | 2.x |
| Obtenção/renovação de alvará | R$ 416,00 + taxas | 8.4 |
| CPOM/CEPOM | R$ 249,00 | 8.5 |
| Alteração de porte ME/EPP | R$ 156,40 | 8.7 |
| Baixa / encerramento | R$ 1.406 e R$ 1.999 | 8.2 |

🔴 **Duas cobranças que mudam a leitura do que é "incluso" no plano deles:**

1. **Entregar obrigação acessória custa R$197,90** — e a tela de declarações mostra as mesmas obrigações como transmitidas. A fronteira entre o incluso e o cobrado **não está dita em lugar nenhum**.
2. **Alterar pró-labore custa R$98,90**, enquanto a Gestão Inteligente muda o valor **sozinha e de graça** todo mês. **A mesma ação é gratuita quando o robô faz e paga quando o cliente pede.**

🎯 **Nossa posição, que já era doutrina e agora tem número:** cobramos **execução de serviço**, nunca **acesso ao que o plano promete**. Se a obrigação é do plano, entregá-la é do plano.

---

## 🏆 "A CASA FAZ POR VOCÊ" — a peça que faltava na 5.1

> Achado na 3ª rodada. É o melhor dispositivo de confiança do produto do líder, e a nossa linha 5.1 estava desenhada mais fraca que isso.

A Central de Rotinas deles tem **duas listas separadas**, e a separação é o produto:

| Lista | O que traz |
|---|---|
| **"Suas rotinas de setembro"** | o que o cliente precisa saber ou fazer. Pill `Automática` quando a casa cuida |
| 🏆 **"A Contabilizei faz por você"** | **as 5 obrigações que o contador executa**, com data e detalhe |

🎯 **O cliente paga R$195/mês e normalmente não vê nada acontecer.** Essa lista torna visível o trabalho invisível. **A nossa 5.1 não pode ser só "você está em dia ✓": tem que ser "veja o que fizemos e quando".**

### As 5 obrigações, e o que cada uma exige

| Sigla | Prazo | Requisitos declarados |
|---|:--:|---|
| **eSocial** | 15 | Certificado **ou** Procuração |
| **EFD-Reinf R-2099** (previdenciário) | 15 | Certificado **ou** Procuração |
| **EFD-Reinf R-4099** (não previdenciário) | 15 | Certificado **ou** Procuração |
| **DCTFWeb** | 15 | Certificado **ou** Procuração |
| DESTDA (ICMS) | 28 | ⚪ não se aplica a serviço puro |

🔴 **`requisitos` é campo de primeira classe, e a leitura é dura:** **4 de 5 obrigações mensais dependem de certificado ou procuração.** O certificado A1 não é pré-condição só da emissão de nota — é **pré-condição de quase toda a operação mensal**. Isso eleva a linha 6.x (certificado) de "documento" para **infraestrutura**.

### Duas obrigações que não estavam no nosso radar

| | O quê |
|---|---|
| **EFD-Reinf R-4099** | cobre **retenção de IRRF em notas TOMADAS**, aluguel para PF, **auto retenção em publicidade** e **distribuição de lucro**. 🔑 Ou seja: **nota que o cliente RECEBE também gera obrigação**, e a distribuição de lucros entra aqui |
| **EFD-Reinf R-2099** | retenção de **INSS em notas fiscais** |

✅ E a descrição do DCTFWeb ratifica a cadeia do [[_mapa-de-cruzamentos]] por fonte nova: *"gerada a partir das informações do **eSocial e da EFD-Reinf**… consolidando em um documento único"*.

---

## ✅ O que copiamos sem vergonha

1. **A frase de abertura.** *"Estas pendências podem afetar seu informe de rendimentos e gerar multas e penalizações como desenquadramento tributário e inativação do CNPJ."* Em uma linha ela liga a corrente inteira, e é honesta sem ser chantagem.
2. **`automatica: boolean`** por rotina.
3. **`cenario` como seletor de copy.**
4. **`pendenciasBloqueantes`** como grafo explícito.
5. **Criticidade é ESTADO, não tipo.** Três tipos aparecem nas duas listas: a mesma pendência é crítica ou não conforme o quão perto do prazo.
6. **`diasParaVencimento`** em certificado e procuração: contagem regressiva, não flag booleana.
7. 🏆 **A lista "a casa faz por você"**, separada da lista do cliente. Torna visível o trabalho invisível.
8. **`requisitos` por obrigação:** cada uma declara do que depende para acontecer.
9. **Modal em 3 seções** com selo de responsabilidade: *O que é? · Requisitos necessários para a entrega · Por que é importante?*
10. **Calendário navegável com bolinha** nos dias que têm rotina, e **pill `Automática`** só nas da casa.

---

## ✍️ O que fazemos diferente, e por quê

| # | Eles | Nós | Por quê |
|:--:|---|---|---|
| 1 | 21 pendências pra todo mundo, cliente **nega** o que não se aplica | **Só as que existem no perfil dele** | Pedir pra um consultor confirmar que não tem estoque é trabalho que a gente inventou |
| 2 | Avisam **depois** que o problema existe | 🎯 **Vigília preditiva (5.4)**: avisar **antes** — "faltam 12 dias e sua folha está em 26%" | É o nosso diferencial nº 2, e é o que a lista de pendências deles não faz |
| 3 | **DTE-SN não aparece na Central de Rotinas** | 🔴 **5.7**: monitorar o domicílio eletrônico e trazer o Termo de Exclusão **pra cá** | Eles têm tela pro Termo de Exclusão, mas ela dispara quando já chegou. Ciência é presumida em **45 dias**, e sobram **30** |
| 4 | Explicador só na Central de Rotinas | **A mesma explicação em toda tela** onde o item aparece | Eles têm o texto e ele não chega onde o cliente decide |
| 5 | Regularizar pendência é **serviço pago** (`valorServicoAdicional`) e o Termo de Exclusão **acrescenta R$95** | Vigiar e avisar é **incluso**. Cobramos execução, nunca o aviso | Vender o alarme de incêndio pra quem já está pegando fogo é o padrão que a gente critica |
| 6 | `prazoAceiteTacito`: silêncio vira aceite | **Nunca usar aceite tácito** contra o cliente. Se ele não respondeu, a gente pergunta de novo | O silêncio do cliente é problema nosso de comunicação, não consentimento dele |
| 7 | Tela de declarações abre no **mês corrente vazio** e diz "Sem informações" | Abre no **último período com dado**. Sem dado nenhum: *"sua primeira declaração sai em março"* | A prova de que a contabilidade funciona não pode dar como 1ª impressão que ela não funciona |
| 8 | Entregar obrigação acessória custa **R$197,90**; alterar pró-labore, **R$98,90** | Cobramos **execução**, nunca **acesso ao que o plano promete** | Se a obrigação é do plano, entregá-la é do plano. É o "surcharge oculto" que a gente critica |
| 9 | Reajuste anual em modal **que bloqueia a tela**, com escolha binária | Reajuste **anunciado com antecedência e índice nomeado**, sem prender o cliente fora do produto | Anunciar é certo. Fazer refém, não. Liga com a nossa decisão aberta **7.7** |
| 10 | Listam **DESTDA (ICMS)** para prestador de serviço puro, que é isento | Só as obrigações **do perfil** | 3ª ocorrência do mesmo defeito: mostrar tudo pra todos e deixar o cliente descobrir o que não se aplica |
| 11 | *"A central está em evolução… **te lembramos por e-mail e WhatsApp**"* | Se a central for o canal, ela é **completa**; senão, dizemos qual é o canal | 🔴 **Isso testa a nossa decisão de 08/09.** O líder tem central **e** avisa por fora, porque a central não cobre tudo. Ou a nossa cobre, ou a gente repete o problema com menos honestidade |

---

## 🔴 O que trava

| | O quê | Onde resolve |
|:--:|---|---|
| 🔴 | **5.7 — monitorar o DTE-SN.** Sem caminho técnico. É o único ponto onde **o silêncio custa a empresa do cliente** | [[_matriz-dependencia]] |
| 🔴 | **5.4 — vigília preditiva.** O bloco existe, falta o gatilho | motor |
| ⚪ | **Extrato bancário / conta PJ: FORA DE ESCOPO** (Pedro, 09/09). Não seremos financeira e não teremos conta PJ própria. O mecanismo do líder depende do Contabilizei.bank, que a gente não vai ter. ⚠️ Consequência: a 2.4 **perde o caminho do trilho próprio** e sobra consulta de arrecadação | decisão travada |
| 🟡 | **TFE e credencial da prefeitura** em BH: regra não mapeada | [[fiscal-simples-bh-2026]] |

---

## Links
[[_mapa-de-cruzamentos]] · [[2026-09-09-contabilizei-central-rotinas]] · [[guia-de-imposto]] · [[emitir-nota-fiscal]] · [[pro-labore]] · [[aliquota-e-enquadramento]] · [[HOME-produto]] · [[_catalogo]] · [[_matriz-dependencia]]
