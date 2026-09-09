---
tipo: verdade
status: vivo
dominio: funcionalidade
data: 2026-09-09
assunto: emitir-nota-fiscal
autoridade: fonte-verdade
cobertura: parcial
balde: core
dependencia: externa
confianca: alta
bloqueio: de-para CNAE→NBS→cClassTrib inexistente; inscrição municipal (8.8); prazo 01/11/2026
tags: [produto, funcionalidade, nfse, reforma-tributaria, iss, emissor-nacional]
---

# 🧾 Emitir nota fiscal — a nossa funcionalidade

> 🧭 **Autoridade:** manda no **desenho da emissão no nosso app**. É o que o dev implementa.
> O que o concorrente faz está em [[2026-09-09-contabilizei-nota-fiscal]], foto com data, que **não manda em nada**.
> Hub: [[HOME-produto]] · catálogo: [[_catalogo]] (§3) · dependências: [[_matriz-dependencia]] (3.1, 3.3, 3.4).

---

## 🔗 Cruzamentos declarados

| | |
|---|---|
| **⬅️ Recebe de** | **cadastro** (CNPJ, **inscrição municipal**, endereço, município) · **certificado A1** (sem ele não emite) · **CNAE** (traz item LC 116, código municipal, NBS) · **tomador** (identificado ou não, br ou estrangeiro) |
| **➡️ Manda em** | 🔑 **[[aliquota-e-enquadramento]]** — a nota vira faturamento, que vira RBT12, que define a faixa · **[[pro-labore]]** (o faturamento é o denominador do Fator R) · **DAS** do mês seguinte · **retenção** por cliente |
| **📅 Obrigação que dispara** | emissão dentro da competência (1º ao último dia) · **Emissor Nacional obrigatório em 01/11/2026** · cancelamento com prazo próprio |
| **👁️ O cliente precisa ver** | que a nota **saiu** · quanto ela **acrescenta de imposto** · e, se não identificou o tomador, que **o ISS é dele** |

🔴 **O cruzamento em uma frase:** a nota é **a única entrada de dado que o cliente controla**, e ela move a cadeia inteira. Errar o código erra a nota; errar o valor erra o DAS, o Fator R e o Anexo. Cadeia completa em [[_mapa-de-cruzamentos]].

---

## 🔭 Por que esta funcionalidade

Duas razões, e a segunda tem data.

1. **É a única coisa que o cliente faz no app toda semana.** Pró-labore e alíquota ele olha; nota ele **usa**. É onde a qualidade do produto é sentida.
2. 🔴 **Emissor Nacional obrigatório em 01/11/2026.** Menos de dois meses. Se a gente pretende emitir em produção este ano, é esta funcionalidade que manda no roadmap.

---

## 📦 Contrato de dados (validado em produção pelo líder)

> Extraído das 10 APIs do líder em 09/09. Detalhe em [[2026-09-09-contabilizei-nota-fiscal|§4 da evidência]].

### A separação que estrutura tudo

```ts
type Atividade = {
  codigo: string                    // código tributário do município
  descricao: string
  principal: boolean
  caracteristicas: [{
    descricao: string
    tipoCaracteristica: string      // "Intelectual" — natureza do serviço

    dadosParaEmissao: {             // 🔑 monta a NOTA
      idCnaeEmpresa: string
      codigoCnae: string
      cnaeMultiplo: boolean         // este CNAE serve mais de um item?
      itemListaServico: string      // LC 116, ex "17.06"
      codigoTributarioMunicipio: string
    }

    dadosParaCalculo: {             // 🔑 calcula o IMPOSTO
      codTabelaSimples: 3 | 5       // 🔴 padrão é 5
      aliquotaBase: number
      aliquotaISS: number
      issFixo: boolean
      variavel: boolean             // varia com o Fator R
      aliquotaApresentacao: number  // 🔑 o que se MOSTRA
    }

    listaNbsCclass: [{ codigoNbs, codigoCclass, codigoNacionalServico, descricao }]
  }]
}
```

🔑 **Copiar a separação `dadosParaEmissao` × `dadosParaCalculo`.** São duas máquinas diferentes comendo do mesmo cadastro, e misturá-las é o caminho curto pro bug em que a nota sai certa e o imposto sai errado (ou o contrário).

⚠️ **`aliquotaApresentacao` separada de `aliquotaBase`** é a origem provável do descasamento de um centavo que medimos. **Se a gente separar, tem que ter teste que prova que são iguais.**

### A trilha, e onde o ISS realmente mora

```
cnae
 ├── listaCaracteristica[] → { anexo, variavel, aliquotaEfetiva, issFixo }
 └── listaCodigoNacionalOuItemServico[]
      └── listaCTribMun[] → { codigo, descricao, preferencia, aliquota }   ← ISS
```

🔴 **O ISS municipal pertence ao CÓDIGO MUNICIPAL, não ao CNAE.** No caso medido, **11 combinações sob um único CNAE, com ISS de 2,5% a 5%**. Nosso modelo tem que carregar a alíquota nesse nível, não no CNAE.

### O cruzamento que gera dado novo

```
GET …/emissao/atividades/cindop?codigoNacionalItemServico={x}&nbs={y}
→ [{ codigo, descricao, descricaoLocalidade }]
```

🔑 **Dois códigos entram, as opções válidas de IndOp saem.** O front não deduz combinação: **pergunta**. É a mesma doutrina que já temos para regra de órgão ("não se deduz, se pergunta"), aplicada a código fiscal.

---

## 🔄 O ciclo da nota tem 6 telas, não 1

> Corrigido em 09/09, na auditoria retroativa. A 1ª passada mapeou só a emissão.

| Tela | O que faz | Cobertura nossa |
|---|---|:--:|
| **Emitir** | o wizard de 4 códigos | 🔴 |
| **Consultar** | lista, status, PDF/XML, log de alterações | 🔴 |
| **Cancelar / informar cancelamento** | 2 operações distintas: cancelar o que emitimos × registrar cancelamento de nota importada | 🔴 |
| **Importar** | XML de nota emitida fora, com prazo | 🔴 |
| **Como emitir na prefeitura** | contingência guiada | 🔴 |
| **Notas tomadas** | nota que o cliente recebeu | 🔴 |

### 📦 O modelo da nota emitida

```ts
type NotaFiscal = {
  numero, codVerificacao, numeroRps, serieRps
  razaoSocialTomador, cnpjTomador, valorServico, descricaoServico
  dataEmissao, dataImportacao, competencia
  situacaoNota | situacaoNFe | situacaoCnae | situacaoRetencaoNota   // 🔑 4 status
  anexoEscolhido                        // 🔑 o Anexo grava NA NOTA
  numeroNotaSubstituta                  // substituição é cadeia
  logAlteracoes                         // auditoria por nota
  permiteMovimentacao, importada, registrada
  erroProcessamento, errosNotaFiscal, motivoCancelamento
  idLoteNotaFiscal, nomeArquivo, linkVisualizacao
}
```

🔑 **`anexoEscolhido` por nota.** Se o Fator R virar no meio do ano, cada nota carrega o Anexo que valeu na hora. Nossa modelagem precisa disso, senão o histórico mente.

🔑 **4 status independentes.** Uma nota pode estar processada com sucesso **e** ter CNAE errado. Um status só não dá conta.

### 🔴 Obrigação legal que não estava mapeada: Lei 12.741/2012

A descrição da nota traz, anexado automaticamente:

> *"Conforme **Lei 12.741/2012**, o percentual total de impostos incidentes neste serviço prestado é de aproximadamente **6,00%**"*

**A "Lei da Transparência" obriga informar a carga tributária na nota.** Consequência de arquitetura: **a alíquota tem que estar resolvida no momento da emissão**, não só no fechamento. É mais um cruzamento [[aliquota-e-enquadramento|alíquota]] → nota.

### 📅 Prazos operacionais descobertos

| Regra | Valor |
|---|---|
| Importar XML de nota emitida fora | **até o dia 5** do mês seguinte, **sem custo** |
| Depois disso | cai em **reabertura de mês contábil, R$21,90** |

🔴 **A cobrança é disparada pela AÇÃO, não escolhida.** No líder: *"caso faça essas alterações e importações, a reabertura do mês é feita **automaticamente**"*, e o serviço tem `disponivelParaCliente: false`.

🎯 **Nossa regra, que já era doutrina e agora tem caso:** **preço e momento da cobrança aparecem ANTES do aceite.** Se corrigir mês fechado custa, a tela diz antes de deixar corrigir.

---

## ✅ O que copiamos sem vergonha

1. 🥇 **A "sequência" salva como favorita.** O usuário escolhe os 4 códigos **uma vez**, salva, e nunca mais pensa. É a melhor resposta que existe à complexidade que a reforma criou.
2. **`Favorito` pré-marcado por CNAE + histórico.** Numa lista de 35 NBS com 8 relevantes, é o que separa usável de inviável.
3. 🥈 **"Alterar não impacta nos impostos".** Dizer quais escolhas são **fiscalmente neutras** destrava o usuário que tem medo de errar.
4. **Traduzir o código para a decisão.** `100301 · "Outros serviços em operações com custo"` vem com **"No endereço do meu cliente ou online (remotamente)"** do lado.
5. **Emitir direto pelo cliente recente.** Freelancer fatura os mesmos 2 ou 3 todo mês.
6. **Certificado e instabilidade checados no LOAD**, não no submit.
7. **A consequência dita no momento da escolha:** *"O tomador não foi identificado. Você fica responsável pelo pagamento do imposto."*
8. **Tela de estado degradado** para instabilidade de portal. Não é exceção, é rotina.
9. 🥉 **A tela "como emitir na prefeitura".** Quando não dá pra emitir, eles entregam o caminho alternativo **com os dados do cliente já prontos para copiar**: link do BHISS, as duas formas de acesso, e a tabela `CNAE · Atividade · ISS · Alíquota Total`. É o melhor padrão de degradação do produto deles, e o município é o nosso.
10. **`anexoEscolhido` e `logAlteracoes` por nota**, e as 4 situações independentes.
11. **Separar "cancelar" de "informar cancelamento".** Para nota importada, quem cancela é o portal do município; o app só registra.

---

## ✍️ O que fazemos diferente, e por quê

| # | Eles | Nós | Por quê |
|:--:|---|---|---|
| 1 | **Desistem** quando o ISS é de outro município e mandam pro portal da prefeitura | Para **BH**, cobertura completa. Para fora, **dizer isso antes**, na escolha do CNAE, não no meio da emissão | Nosso recorte geográfico deixa de ser limitação e vira vantagem. Mas o cliente precisa saber **antes de pagar** |
| 2 | 67 NBS sem filtro, resolvido só na UX | **De-para CNAE → NBS curado** nos nossos 87 CNAEs | A UX deles tapa um buraco de dado. Com 87 CNAEs, curar é viável pra nós e não era pra eles |
| 3 | `cClassTrib` vazio | Mesmo estado hoje, **mas com prazo e dono** | Ninguém resolveu. Vira risco se ignorarmos e janela se enfrentarmos |
| 4 | Cancelamento: *"dentro do mesmo mês"* no rodapé da emissão; a tela de cancelar **não declara prazo nenhum** | **730 dias**, conforme a Portaria SMFA 075/2025 | 🕓 **segue sem conciliação.** Visitei a tela de cancelamento na 2ª rodada e ela não diz o prazo. Não resolvo por dedução |
| 5 | Emitir e a alíquota só aparece depois | **Mostrar o efeito no imposto na hora**: "esta nota acrescenta R$X no DAS de outubro" | A nota é a entrada; o imposto é a saída. Mostrar as duas juntas é a nossa tese |
| 6 | Backfill de tomador cobrado no meio da emissão | Cobrar **antes**, em lote, fora do caminho crítico | Descobrir que o cadastro está incompleto com a nota pela metade é o pior momento possível |

---

## 🔴 O que trava

| | O quê | Onde resolve |
|:--:|---|---|
| 🔴 | **De-para CNAE → NBS → cClassTrib não existe**, nem no líder | trabalho de dado, nosso |
| 🔴 | **Inscrição municipal irregular derruba a emissão** (linha 8.8) | [[_matriz-dependencia]] |
| 🔴 | **01/11/2026**: Emissor Nacional obrigatório | roadmap |
| 🟡 | ISS por **código municipal** só temos de BH | [[fiscal-simples-bh-2026]] |
| 🟡 | Regra de cancelamento: 730 dias × "mesmo mês" | 🕓 fila humana |
| 🟡 | Favorito no código de 5% × atividade real a 3% | 🕓 ratificar com a Larissa |

---

## Links
[[_mapa-de-cruzamentos]] · [[aliquota-e-enquadramento]] · [[pro-labore]] · [[2026-09-09-contabilizei-nota-fiscal]] · [[HOME-produto]] · [[_catalogo]] · [[_matriz-dependencia]] · [[cnae-liso-servico]] · [[fiscal-simples-bh-2026]]
