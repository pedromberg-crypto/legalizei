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

## ✅ O que copiamos sem vergonha

1. **A frase de abertura.** *"Estas pendências podem afetar seu informe de rendimentos e gerar multas e penalizações como desenquadramento tributário e inativação do CNPJ."* Em uma linha ela liga a corrente inteira, e é honesta sem ser chantagem.
2. **`automatica: boolean`** por rotina.
3. **`cenario` como seletor de copy.**
4. **`pendenciasBloqueantes`** como grafo explícito.
5. **Criticidade é ESTADO, não tipo.** Três tipos aparecem nas duas listas: a mesma pendência é crítica ou não conforme o quão perto do prazo.
6. **`diasParaVencimento`** em certificado e procuração: contagem regressiva, não flag booleana.

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

---

## 🔴 O que trava

| | O quê | Onde resolve |
|:--:|---|---|
| 🔴 | **5.7 — monitorar o DTE-SN.** Sem caminho técnico. É o único ponto onde **o silêncio custa a empresa do cliente** | [[_matriz-dependencia]] |
| 🔴 | **5.4 — vigília preditiva.** O bloco existe, falta o gatilho | motor |
| 🟡 | **Extrato bancário**: é a matéria-prima do fechamento e a porta da 2.4. Eles têm 2 pendências só pro ciclo de vida da integração | próxima frente |
| 🟡 | **TFE e credencial da prefeitura** em BH: regra não mapeada | [[fiscal-simples-bh-2026]] |

---

## Links
[[_mapa-de-cruzamentos]] · [[2026-09-09-contabilizei-central-rotinas]] · [[guia-de-imposto]] · [[emitir-nota-fiscal]] · [[pro-labore]] · [[aliquota-e-enquadramento]] · [[HOME-produto]] · [[_catalogo]] · [[_matriz-dependencia]]
