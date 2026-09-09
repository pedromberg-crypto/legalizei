---
tipo: fato
status: vivo
dominio: evidencia
data: 2026-09-09
fonte: Contabilizei
acesso: cliente-interno # conta real do Pedro, plano Padrão R$195
assunto: emissao-nota-fiscal
tags: [produto, evidencia, concorrente, nfse, reforma-tributaria, iss, api]
---

# 🔎 Evidência — emissão de NF na Contabilizei (09/09/2026)

> ⚠️ **Foto com data, não decisão.** O nosso desenho vive em [[emitir-nota-fiscal]].
>
> **Método:** só leitura ([[_metodo]]). **Nenhuma nota foi emitida.** Percorri o wizard até a tela do formulário e parei antes do `Continuar`. Nenhum valor, nenhuma descrição, nenhum submit.
> ⚠️ **O que foi tocado:** cliques de navegação no wizard (`Emitir nova nota` → `Não informar cliente`), que é o caminho que **não** envolve dado de cliente. Nada preenchido, nada confirmado.
>
> 🔌 **APIs:** 20 chamadas capturadas com `read_network_requests`, todas `GET`, todas de mesma origem, na sessão do próprio Pedro, relendo o que a página já tinha carregado. Nenhum `POST`.
> 🔒 O payload de `listagem/init` traz CPF, e-mail e endereço do Pedro. **Aqui está registrada só a FORMA, nunca os valores.**
>
> **Rodada 1** — `#/emissor/listagem` · `#/emissor/tomadores` · `#/emissor/emitir`. 🔌 **20 chamadas**.
> **Rodada 2** (auditoria retroativa, mesmo dia) — as **5 telas** que a 1ª deixou de fora: consultar, cancelar, importar, como-emitir e a rota real do pró-labore. 🔌 **8 chamadas**. Está em **§9**.
>
> **Rodada 3** (mesmo dia, **conduzida pelo Pedro**) — ele emitiu uma nota, entrou no fluxo de cancelamento e passou a URL, autorizando ler e clicar em `Continuar`. 🔒 O `Confirmar cancelamento` **não foi tocado**; a nota segue emitida. 🔌 **1 endpoint**, e ele resolveu a divergência de prazo. Está em **§10**.
>
> ⚠️ **Por que houve 3 rodadas:** a 1ª percorreu **1 de 6 telas** da seção e mesmo assim se chamou "teardown da NF". A 2ª usou o mapa de rotas (`menu/get`) e fechou o menu — mas **o cancelamento real não está no menu**: ele nasce de um botão dentro da nota. Lições no [[_metodo]].
>
> **Ligações:** [[emitir-nota-fiscal]] · [[_mapa-de-cruzamentos]] · [[aliquota-e-enquadramento]] · [[_matriz-dependencia]] (3.1, 3.3, 3.4)

---

## 1. O wizard, em 3 passos

| Passo | Rota | O que faz |
|:--:|---|---|
| 1 | `#/emissor/listagem` | hub: lista de notas, filtros, **"Últimos clientes cadastrados"** com `Emitir` por cliente |
| 2 | `#/emissor/tomadores` | escolher o cliente · `Não informar cliente` · `Novo Cliente` |
| 3 | `#/emissor/emitir` | o formulário |

🎯 **O atalho que vale copiar:** no passo 1, cada cliente recente tem seu próprio botão `Emitir`. Freelancer fatura os mesmos 2 ou 3 clientes todo mês; poupar o passo 2 é economia real, não enfeite.

---

## 2. 🔴 O formulário já é o da REFORMA TRIBUTÁRIA

Faixa no topo, em erro:

> *"Atualizamos o emissor de notas para atender às **exigências da reforma tributária do governo federal**. Alguns campos adicionais são obrigatórios, mas sempre que possível as informações serão preenchidas automaticamente. **Ainda podem ocorrer instabilidades pontuais.**"*

### Os 4 códigos em cascata

| # | Campo | Valor na conta | Impacta imposto? |
|:--:|---|---|---|
| 1 | **Atividade da empresa (CNAE)** * | `7319-0/04 · Consultoria em publicidade` — pill `Principal`, e mostra **"Alíquota de 6%"** | sim |
| 2 | **Serviço prestado (Código Nacional)** * | `17.01.01` — pill `Favorito`, 7 opções | ⚠️ **"Alterar não impacta nos impostos"** |
| 3 | **Serviço prestado (Código Municipal)** * | `001 · Assessoria de qualquer natureza` — pill `Favorito` | ⚠️ **"Alterar não impacta nos impostos"** |
| 4 | **Detalhamento do serviço (NBS)** * | `1.1401.14.00 · Serviços de consultoria em gestão de marketing` — pill `Favorito`, 35 opções | não declarado |

E um quinto, que aparece condicionalmente: **"Onde o serviço foi prestado (IndOp)"**.

🎯 **Dois padrões excelentes, e os dois resolvem o mesmo problema (a reforma multiplicou os campos):**

1. **`Favorito`.** *"Com base no seu CNAE e histórico de emissões, marcamos alguns itens como favoritos. Se necessário, ajuste."* Numa lista de 35 NBS onde só 8 têm a ver com o negócio, isso é a diferença entre usável e inviável.
2. **`Alterar não impacta nos impostos`.** Dizer ao usuário **quais escolhas são fiscalmente neutras** é o que impede ele de travar com medo de errar.

### O resto do formulário

```
Valor (R$)
Imposto Municipal · ISS  →  0,00% (R$ 0,00)     ← calcula ao vivo
Descrição do serviço
[ Continuar ]
```

🔴 **A frase que aparece sem tomador identificado:**
> *"O tomador não foi identificado. **Você fica responsável pelo pagamento do imposto.**"*

Ou seja, não identificar o cliente **transfere o ISS para o emitente** (não há retenção). É consequência fiscal dita em uma linha, no momento da decisão.

⚠️ **Rodapé que contradiz o que apuramos:**
> *"Emita sua nota tranquilamente, caso seja necessário, você poderá cancelar **dentro do mesmo mês** e fazer uma nova emissão."*

✅ **RESOLVIDO na 3ª rodada (§10).** Não eram versões conflitantes da mesma regra, eram **três regras diferentes**: até o **dia 5 do mês seguinte** cancela sem custo · depois disso cancela **com custo** de operação contábil · e **730 dias** é o limite legal do município. A copy deste rodapé (*"dentro do mesmo mês"*) é **imprecisa deles**.

---

## 3. Os modais escondidos, e cada um resolve um problema real

### "Salvar a nova sequência como favorita?"

> *"Ao salvar, da próxima vez que você emitir nota fiscal os itens a seguir já virão preenchidos automaticamente."*
> Salva: **Atividade da empresa · Código Nacional · Código Municipal · NBS**
> *"Você poderá alterar esses campos nas próximas emissões. O campo **'Onde o serviço foi prestado (IndOp)' ainda não pode ser salvo como favorito**."*
> Botões: `Continuar sem salvar` · `Salvar e continuar`

🔑 **Eles chamam a combinação dos 4 códigos de "SEQUÊNCIA".** É o melhor achado de UX da rodada: o usuário resolve a complexidade da reforma **uma vez**, salva, e nunca mais pensa nisso. E o IndOp fica de fora **porque muda a cada nota** (depende de onde o serviço foi prestado).

### "Esta nota precisa de uma atualização" (ao duplicar nota antiga)

> *"Devido a mudanças da reforma tributária, o governo passou a exigir **novos códigos para serviços que não existiam na sua nota antiga**."*
> *"Preenchemos automaticamente algumas informações com base no seu perfil. Confira se os itens refletem o serviço prestado."*
> *"**Isso só é necessário desta vez.** Nas próximas duplicações, os dados já estarão salvos!"*

### "Complete as informações do cliente"

> *"Alguns dados do tomador **se tornaram obrigatórios** ou precisam de ajustes para a emissão da nota fiscal devido a mudanças da reforma tributária."*

⚠️ **A reforma tornou obrigatório dado de tomador que antes não era.** Cadastro de cliente antigo **não emite** sem backfill. Isso é migração de dados, não feature.

### 🔴 "Emita pelo portal de notas adotado por seu município"

> *"Para o serviço selecionado, **o ISS é destinado para a prefeitura da cidade onde ele foi prestado**."*
> *"Como as prefeituras **não têm uma base de dados unificada de códigos municipais de serviços**, a integração ainda não está disponível em nossa plataforma."*
> *"Nesse caso, **emita pelo portal de notas adotado por seu município** (prefeitura ou portal nacional)."*

🔴 **É o achado mais importante da rodada.** O líder, com 50 mil clientes, **desiste de emitir** quando o ISS é devido a outro município e manda o cliente pro portal da prefeitura.

**Três leituras:**
1. **O problema não é de porte, é estrutural.** Não existe base unificada de código municipal de serviço no Brasil.
2. **É um limite real do produto deles**, admitido em modal próprio.
3. 🎯 **Para o nosso ICP (serviço prestado em BH) isso não morde.** Podemos ser completos onde eles não são, e o recorte geográfico deixa de ser limitação e vira vantagem. ⚠️ Mas o cliente que atende fora de BH cai no mesmo buraco.

### "Não conseguimos carregar as informações"

> *"Estamos com **instabilidade** para carregar os itens necessários para preenchimento da nota, tente novamente."*
> `Voltar ao início` · `Tentar novamente`

Combina com o campo `hasInstability` da API. **Eles têm tela de estado degradado**, o que confirma que a instabilidade dos portais é rotina, não exceção.

---

## 4. 🔌 As APIs — o cruzamento de dados, que era o pedido

> Pedido do Pedro: *"tente encontrar sobre API e como elas estão funcionando nesse cruzamento de dados interno com os dados para gerar outro dado"*.

### O mapa dos 10 endpoints

| Endpoint (`/api/plataforma/…`) | Para quê |
|---|---|
| `novo-emissor/versao-emissor` · `v2/versao-emissor` | qual geração de emissor a empresa usa (`EMISSOR_NOVO`) |
| `novo-emissor/v2/feature-flag` | liga/desliga o emissor novo por empresa |
| `novo-emissor/v2/tipo-emissor-disponivel` | `["EMISSAO"]` — que operações a empresa pode fazer |
| `novo-emissor/listagem/init` | certificado + dados da empresa + `hasInstability` |
| `novo-emissor/v2/listagem/notas/filtro?pagina&limite&ano&mes` | listagem paginada |
| `novo-emissor/emissao/atividades` | 🔑 atividades com `dadosParaEmissao` × `dadosParaCalculo` |
| `novo-emissor/tomadores/init` · `notafiscal/emitir/tomador/list/` | clientes |
| `novo-emissor/v2/emissao/init` | init do formulário |
| **`novo-emissor/v2/trilhas-empresa`** | 🔑 **a árvore de decisão inteira** |
| **`novo-emissor/v2/emissao/atividades/cindop?codigoNacionalItemServico=…&nbs=…`** | 🔑 **dois códigos entram, um terceiro sai** |

### 🔑 O padrão nº 1: separar o que EMITE do que CALCULA

`GET novo-emissor/emissao/atividades`:

```json
{
  "codigo": "170601001",                    // código tributário do MUNICÍPIO
  "descricao": "170601001 - Propaganda e publicidade.",
  "principal": true,
  "caracteristicas": [{
    "descricao": "7319-0/04 - Consultoria em publicidade",
    "tipoCaracteristica": "Intelectual",     // natureza do serviço
    "dadosParaEmissao": {
      "idCnaeEmpresa": "…",
      "codigoCnae": "7319004",
      "cnaeMultiplo": false,                 // este CNAE serve mais de um item?
      "itemListaServico": "17.06",           // LC 116
      "codigoTributarioMunicipio": "170601001"
    },
    "dadosParaCalculo": {
      "codTabelaSimples": 5,                 // 🔴 ANEXO V
      "aliquotaBase": 6,
      "aliquotaISS": 2.01,
      "issFixo": false,
      "variavel": true,                      // varia com o Fator R
      "aliquotaApresentacao": 6              // 🔑 o que se MOSTRA
    },
    "listaNbsCclass": [ … 67 itens … ]
  }]
}
```

🔑 **`dadosParaEmissao` e `dadosParaCalculo` são payloads DISJUNTOS na mesma atividade.** Um serve pra montar a nota (códigos de órgão), o outro pra calcular imposto (anexo e alíquotas). É a resposta arquitetural à sua pergunta: **o mesmo dado interno alimenta duas máquinas diferentes, e eles separam explicitamente.**

🔑 **`aliquotaApresentacao` ≠ `aliquotaBase`.** Existe uma alíquota que se **exibe** e outra que se **calcula**. Iguais aqui (6 e 6), mas o fato de serem campos distintos abre a porta pro descasamento — e é provavelmente a origem do centavo (`474,59` × `474,60`) registrado em [[2026-09-09-contabilizei-aliquotas]].

🔴 **`codTabelaSimples: 5` de novo.** Terceira tela confirmando: **a empresa é Anexo V por padrão** e o III é o prêmio do Fator R.

### 🔑 O padrão nº 2: a trilha, com o ISS pendurado no código municipal

`GET novo-emissor/v2/trilhas-empresa` devolve a árvore:

```
cnae 7319004  (preferencia, principal, tipoCodigo: "NACIONAL")
 ├── listaCaracteristica[] → { anexo: 5, variavel: true, aliquotaEfetiva: 6, issFixo: false }
 └── listaCodigoNacionalOuItemServico[]
      └── listaCTribMun[] → { codigo, descricao, preferencia, aliquota }   ← 🔴 ISS AQUI
```

🔴 **O ISS municipal não é do CNAE. É do CÓDIGO MUNICIPAL.** E varia **dentro do mesmo CNAE**:

| Cód. nacional | Cód. municipal | ISS | Descrição |
|---|:--:|:--:|---|
| 030201 | 001 · 002 · 003 | **3%** | Cessão de direito de uso de marcas / sinais / som |
| **170101** ⭐ | **001** ⭐ | **5%** | Assessoria de qualquer natureza |
| 170101 | 002 | 5% | Consultoria de qualquer natureza |
| 170102 | 001 | 5% | Análise, exame, pesquisa, coleta |
| 170102 | 002 | **2,5%** | Pesquisa de opinião pública |
| 170601 | 001 | **3%** | Propaganda e publicidade |
| 350101 / 350102 / 350103 | 001 | 3% | Reportagem · Assessoria de imprensa · Relações públicas |

⭐ = marcado como preferência/favorito.

**Onze combinações, ISS de 2,5% a 5%, tudo sob um único CNAE.**

🕓 **Duas observações que precisam de ratificação contábil antes de virar regra** (não deduzir):

1. **A tela diz "alterar não impacta nos impostos" no código municipal, e a alíquota varia 2×.** Para empresa do Simples isso é coerente — o ISS vai embutido no DAS a 2,01% —, mas a alíquota municipal ainda governa **retenção na fonte** e o caso de ISS devido a outro município. Confirmar com a Larissa.
2. **O favorito aponta pro código de 5%** (`170101/001`), enquanto o código que casa com a descrição real da atividade — `170601 Propaganda e publicidade`, que é o `17.06` mostrado em Minhas Alíquotas — está a **3%**. Pode ser irrelevante no Simples, pode não ser. **Não concluir pela tela.**

### 🔑 O padrão nº 3: dois códigos entram, um terceiro sai

`GET novo-emissor/v2/emissao/atividades/cindop?codigoNacionalItemServico=170101&nbs=114011400`

```json
[{
  "codigo": "100301",
  "descricao": "Outros serviços em operações com custo",
  "descricaoLocalidade": "No endereço do meu cliente ou online (remotamente)"
}]
```

🔑 **É o cruzamento em estado puro:** `código nacional` + `NBS` → **opções válidas de IndOp**. O front não decide nada; pergunta ao servidor que combinações existem.

🎯 **E repare no `descricaoLocalidade`.** O código é `100301 · "Outros serviços em operações com custo"`, que não diz nada a ninguém. Ao lado vem **"No endereço do meu cliente ou online (remotamente)"**. Eles **traduzem o código fiscal para a linguagem da decisão**. É exatamente a nossa doutrina de esconder o jargão e mostrar o efeito, aplicada campo a campo.

### 🔴 A reforma: eles têm o encanamento, não têm o dado

`listaNbsCclass` tem **67 linhas** para este CNAE:

| | |
|---|:--:|
| NBS únicos | 35 |
| códigos nacionais únicos | 7 |
| linhas relacionadas a publicidade | **8 de 67** |
| **`codigoCclass` preenchidos** | **0 de 67** |

As primeiras entradas são *"consolidação documental de cargas no transporte multimodal"*, *"consultoria imobiliária"*, *"assessoria de gestão condominial"* — nada a ver com publicidade.

🔑 **Dois fatos separados, e os dois importam:**
1. **O `cClassTrib` (classificação da reforma) está 100% vazio.** Eles shipam o campo e o dado não existe.
2. **O de-para CNAE → NBS não está resolvido.** A lista não é filtrada por relevância; a UX segura isso na base do `Favorito`.

🎯 **Ninguém tem esse mapeamento pronto, nem o líder.** É risco (vira obrigatório) e é janela (quem resolver primeiro sai na frente).

### A forma do `listagem/init` (só a forma, valores omitidos)

```ts
{
  certificadoDigital: { vencido: boolean, dataVencimento: string, emRenovacao: boolean }
  hasInstability: boolean
  user: {
    cnpj, razaoSocial, inscricaoMunicipal, cpfResponsavel, emailResponsavel, nomeResponsavel,
    endereco: { logradouro, numero, bairro, complemento, cep, enderecoCompleto, semComplemento,
                municipio: { nome, nomeNormalizado, codIbge, codTributario, uf }, uf },
    regimeTributario, hasBotaoCobranca, codigoPerfil, nomeMunicipioNormalizado
  }
}
```

🔑 **O certificado é pré-condição verificada no load da tela**, não erro de submit. E `hasInstability` no mesmo payload: **as duas coisas que impedem emitir são checadas antes de a pessoa digitar qualquer coisa.**

### A forma do tomador

```ts
{
  id, nome, nomeN, cpfCnpj, pessoaJuridica: boolean,
  endereco: { brasileiro: boolean, logradouro, numero, bairro, complemento, cep,
              municipio: { codIbge, codTributario, … }, pais, cidade },
  email, telefone,
  valorPendenteRetencao: number
}
```

🔑 Dois campos que revelam escopo: **`endereco.brasileiro` + `pais`** (o modelo já nasce suportando **exportação**) e **`valorPendenteRetencao`** (eles rastreiam **retenção pendente por cliente**).

---

## 5. Defeitos e divergências, anotados

| | O quê |
|:--:|---|
| 🐛 | **`listaNbsCclass` não é filtrada pelo CNAE**: 67 linhas, 8 relevantes. A UX compensa com `Favorito`, o dado não |
| 🐛 | **`codigoCclass` 100% nulo** — campo da reforma existe e está vazio |
| ⚠️ | **Cancelamento: "dentro do mesmo mês"** (rodapé) × **730 dias** (Portaria SMFA 075/2025). 🕓 perguntar |
| ⚠️ | **Favorito aponta pro código de 5%** enquanto o código da atividade real está a 3%. 🕓 ratificar se importa no Simples |
| ⚠️ | **NBS em dois formatos**: `114011400` na API, `1.1401.14.00` na tela |

---

## 9. 🔄 2ª rodada — as 5 telas que a 1ª deixou de fora

> 🔄 **Auditoria retroativa, 09/09.** Com o mapa de rotas do `menu/get` em mãos, ficou visível que a 1ª rodada percorreu **1 de 6 telas** da seção Notas Fiscais e mesmo assim se chamou "teardown da NF". Emissão é uma tela; o ciclo tem seis.
>
> 🔌 **8 endpoints** nesta rodada, todos `GET`. 🔒 Nenhuma nota cancelada, importada ou emitida.

### O mapa que faltava

| Tela | Rota | App | Cobertura |
|---|---|---|:--:|
| Emitir NFS-e | `emissor/listagem` → `/tomadores` → `/emitir` | novo | ✅ 1ª rodada |
| **Consultar notas fiscais** | `sistema/consultarnotas` | legado | ✅ agora |
| **Cancelar nota fiscal** | `sistema/informarCancelamento` | legado | ✅ agora |
| **Importar notas fiscais** | `sistema/importarnota` | legado | ✅ agora |
| **Como emitir notas de serviço** | `sistema/como-emitir` | legado | ✅ agora |
| Registrar notas tomadas | `painel-de-controle/nota-tomada/listagem` | novo | 🟡 não visitada |

⚠️ **Quatro das seis vivem no app legado**, o que reforça o padrão do `menu/get`: emitir migrou, consultar e cancelar não.

---

### 🔑 O modelo completo de uma nota emitida

`GET /api/plataforma/notafiscal/consultar/list/{mes}/{ano}?cursor=0&limit=20`
→ `{ serializedList, list, total, cursor }`

```ts
type NotaFiscal = {
  id, idEmissor, numero: "3",
  codVerificacao: string          // o código de verificação do município
  numeroRps, serieRps             // RPS: o recibo provisório que vira nota

  razaoSocialTomador, cnpjTomador, valorServico
  descricaoServico: string

  dataEmissao, dataImportacao, competencia
  erroProcessamento, errosNotaFiscal, motivoCancelamento

  situacaoNota:          { id: "PROCESSADO_SUCESSO", descricao: "NFS-e processada com sucesso" }
  situacaoNFe:           null
  situacaoCnae:          { id: "PROCESSADO", descricao: "Cnae da nota correto" }
  situacaoRetencaoNota:  null

  tipoNota: "SERVICO"
  anexoEscolhido                  // 🔑 o Anexo fica gravado NA NOTA
  permiteMovimentacao, importada, registrada
  numeroNotaSubstituta            // cadeia de substituição
  logAlteracoes                   // auditoria por nota
  idLoteNotaFiscal, nomeArquivo, linkVisualizacao
}
```

🔑 **Quatro decisões de modelagem que valem copiar:**

| | O que revela |
|:--:|---|
| **4 situações independentes** (`Nota`, `NFe`, `Cnae`, `RetencaoNota`) | uma nota pode ser processada com sucesso **e** ter CNAE errado, ou pendência de retenção. Um status só não dá conta |
| **`anexoEscolhido` na nota** | o Anexo (III ou V) fica gravado **por nota**, não só por empresa. Se o Fator R virar no meio do ano, cada nota carrega o que valeu na hora |
| **`numeroNotaSubstituta`** | substituição é **cadeia**, não flag |
| **`logAlteracoes`** | auditoria por nota, de primeira classe |

### 🔑 A Lei 12.741/2012 vai na descrição, automaticamente

A descrição do serviço na nota real termina com:

> *"— Conforme **Lei 12.741/2012**, o percentual total de impostos incidentes neste serviço prestado é de aproximadamente **6,00%**"*

🔴 **Obrigação legal que não estava mapeada em lugar nenhum nosso.** É a "Lei da Transparência": a nota tem que informar a carga tributária do serviço. Eles **anexam automaticamente**, com a alíquota do cliente.

🎯 **Efeito direto:** quem emite a nota precisa saber a alíquota **no momento da emissão**. Mais um cruzamento [[aliquota-e-enquadramento|alíquota]] → [[emitir-nota-fiscal|nota]] que a gente não tinha declarado.

---

### 🔴 A cobrança escondida: reabertura de mês contábil

A tela de consulta **pré-carrega** duas definições de serviço antes de qualquer ação:

`GET /api/plataforma/notafiscal/consultar/servico/51` e `/52`

```json
{
  "id": 51,
  "descricao": "Reabertura de Mês Contábil - Simples nacional",
  "categoria": "REGULARIZACAO",
  "valor": 21.9,
  "detalhe": "Reabertura do mês contábil quando precisar alterar alguma nota ou importar alguma nota fiscal de meses anteriores…",
  "maisDetalhes": "…(Caso faça essas alterações e importações a reabertura do mês é feita automaticamente).",
  "disponivelParaCliente": false,
  "issueTypeJira": "reabertura-de-mes-contabil-simples-nacional"
}
```

🔴 **Alterar ou importar nota de mês anterior custa R$21,90, e a cobrança é DISPARADA PELA AÇÃO**, não escolhida: *"a reabertura do mês é feita automaticamente"*. E `disponivelParaCliente: false` — não é item de catálogo que o cliente contrata, é consequência.

⚠️ **É o "surcharge oculto" que o vault já criticava, agora com o mecanismo.** O cliente corrige um erro e descobre a cobrança depois.

🎯 **Nossa regra, que já era doutrina e agora tem caso concreto:** **preço e momento da cobrança aparecem ANTES do aceite.** Se corrigir mês fechado custa, a tela diz antes de deixar corrigir.

---

### 📅 `importarnota` — o prazo do dia 5

> **"Envio sem custo · Notas emitidas em setembro · Formato do arquivo: XML · Prazo limite: Dia 5 de outubro"**

🔑 **Prazo operacional que não estava no nosso calendário:** notas emitidas fora da plataforma precisam ser importadas **até o dia 5 do mês seguinte**, em XML, sem custo.

🔴 **E aqui os dois achados se encontram:** importar **até dia 5** é grátis; **depois disso** cai na reabertura de mês contábil a **R$21,90**. A gratuidade tem prazo, e o prazo não aparece na tela de cobrança.

---

### 🎯 `como-emitir` — a tela de contingência, e ela é boa

Quando a plataforma não emite (ISS de outro município, instabilidade, sem certificado), eles **não deixam o cliente na mão**: ensinam a emitir no portal da prefeitura.

**"Como emitir Notas Fiscais na Prefeitura — Veja como emitir uma Nota Fiscal em Belo Horizonte e todos os dados necessários para concluir a emissão."**

| Passo | Conteúdo |
|:--:|---|
| **1** | Link direto: `bhissdigital.pbh.gov.br/nfse/index.jsp` + `ACESSAR TUTORIAL` |
| **2** | As duas formas de acesso: **CNPJ + senha** ou **certificado digital** |
| **3** | **A tabela que ele vai precisar digitar lá:** `CNAE · Atividade · ISS · Alíquota Total` → `7319-0/04 · Consultoria em publicidade · 2,01% · 6,00` |

🎯 **É o melhor padrão de degradação que vi no produto deles.** Em vez de "não é possível emitir", entregam o caminho alternativo **com os dados do cliente já preenchidos**, prontos para copiar.

⚠️ **E é diretamente aproveitável:** BHISS Digital é o nosso município. Essa tela é praticamente uma spec pronta para o nosso caso de contingência.

---

### `informarCancelamento` — e o prazo continua sem resposta

> **"Cancelar Nota Fiscal — Aqui você cancela notas fiscais emitidas na Contabilizei ou informa o cancelamento/substituição de notas importadas."**
> Campo único: `Número da nota fiscal` + `Pesquisar`.

🔑 **A tela faz duas coisas diferentes com o mesmo nome:**
1. **Cancelar** nota emitida na plataforma (ação real)
2. **Informar** cancelamento/substituição de nota **importada** (registro de algo feito fora)

Essa distinção é correta e a gente precisa dela: para nota importada, quem cancela é o portal do município; o app só registra.

🕓 **A divergência do prazo NÃO foi resolvida.** A tela não declara prazo nenhum. Seguem em pé, sem conciliação:
- rodapé da emissão: *"cancelar **dentro do mesmo mês**"*
- Portaria SMFA 075/2025: **730 dias**

**Não resolvi por dedução**, conforme a regra da casa. Fica na fila humana.

---

### ✅ E uma lacuna que não era lacuna

`painel-de-controle/socio/assessor/gateway` — a rota real do menu para "Gerenciar sócios e pró-labore", que eu havia pulado indo direto ao `socio/central`.

**Visitada: é um roteador.** Sem fluxo de assessor pendente, redireciona para `socio/central`. Explica o `fluxoAssessorPendente` do payload e **confirma que o teardown de pró-labore não tinha buraco ali.**

---

## 10. 🔴 3ª rodada — o cancelamento de verdade, e a divergência RESOLVIDA

> 🔄 **09/09, com o Pedro conduzindo.** Ele emitiu uma nota, entrou no fluxo de cancelamento e me passou a URL da tela intermediária, autorizando ler e clicar em `Continuar`. 🔒 **O `Confirmar cancelamento` não foi tocado. A nota segue emitida.**
>
> 🔌 **1 endpoint**, `GET`. E ele vale por muitos.

### 🔑 São DOIS caminhos de cancelamento, não um

| Caminho | Rota | App | O que faz |
|---|---|---|---|
| **Informar cancelamento** | `sistema/informarCancelamento` | legado | registra cancelamento de nota **importada** (quem cancelou foi o portal) |
| **Cancelar nota emitida** | `painel-de-controle/#/cancelamento-nota-emitida/inicio/{codVerificacao}` | **novo** | cancela de verdade nota emitida na plataforma |

⚠️ **Por isso a 2ª rodada não achou.** Eu varri o menu, e o menu só lista o caminho legado. O caminho real **nasce do botão `Cancelar` dentro da nota**, e não tem entrada de menu.

🎯 **Lição:** o mapa de rotas do `menu/get` é excelente, mas **não cobre fluxo que nasce de ação dentro de um item**. Menu dá as portas; ação dá os corredores.

---

### 🔴 A divergência do prazo, RESOLVIDA

Tela 1 (`/inicio/{codVerificacao}`), com dois avisos:

> **"Antes de continuar, fique atento às seguintes informações:"**
> 📅 *"Notas canceladas **depois do dia 5 do próximo mês** possuem um **custo de operação contábil**."*
> 🏛️ *"O tempo de cancelamento da nota fiscal **pode demorar um pouco em certas prefeituras**."*

🔑 **As três informações que pareciam brigar não brigavam.** Eram três coisas diferentes:

| Fonte | O que dizia | O que é de verdade |
|---|---|---|
| Rodapé da emissão | *"cancelar dentro do mesmo mês"* | ⚠️ **copy imprecisa deles.** A janela real é **até o dia 5 do mês seguinte** |
| Portaria SMFA 075/2025 | **730 dias** | ✅ o **limite legal** do município |
| Esta tela | *"depois do dia 5 do próximo mês tem custo"* | ✅ a **janela sem custo** |

**A regra completa, agora fechada:**
```
até o dia 5 do mês seguinte  →  cancela, sem custo
depois do dia 5              →  cancela, com "custo de operação contábil" (a reabertura, R$21,90)
até 730 dias                 →  limite legal do município (Portaria SMFA 075/2025)
```

🔑 **O dia 5 é o fecho do mês contábil, e vale para TUDO.** Importar nota, alterar nota e cancelar nota: **antes do dia 5 é grátis, depois custa a mesma reabertura.** Três telas diferentes, uma regra só — e em nenhuma delas isso está dito assim.

⚠️ **E o 2º aviso é honestidade que vale copiar:** *"pode demorar um pouco em certas prefeituras"*. Eles não prometem cancelamento imediato porque **não controlam o portal do município**. É a mesma família do `hasInstability`.

---

### Tela 2 — a confirmação

Rota: `#/cancelamento-nota-emitida/detalhes/{codVerificacao}`

> **"Tem certeza que deseja cancelar a seguinte nota fiscal?"**

| Campo | Conteúdo |
|---|---|
| Número da Nota | 5 |
| Cód. de Verificação | `NFS3106…0741` |
| Data da Emissão | 11/08/2026 |
| Cliente | LEGALIZE DIGITAL LTDA |
| **Município / UF** | **Belo Horizonte - MG** |
| Resumo dos serviços | a descrição completa |

🎯 **Mostrar `Município / UF` na confirmação não é decoração.** É o município que cancela, e é ele que decide prazo e demora. O campo está ali porque a consequência depende dele.

🔑 **A descrição do serviço carrega DUAS coisas anexadas automaticamente**, não uma:
> *"Desenvolvimento de produto digital e gestão de equipe. Referente ao serviço prestado no mês de julho. --------------- Conforme **Lei 12.741/2012**, o percentual total de impostos incidentes neste serviço prestado é de aproximadamente **6.00%** **Valor líquido da Nota Fiscal = R$ 7.910,00**"*

Na 2ª rodada eu só tinha visto a Lei 12.741. **Vai junto também o valor líquido.**

---

### 🔑 O modelo fiscal completo da NFS-e — 75 campos

`GET /api/legado/nota001/obtercodverificacao/{codVerificacao}`

⚠️ **Repare no caminho: `/api/legado/`.** A tela **nova** de cancelamento chama uma API **legada**, num serviço chamado `nota001`. 🎯 **Complementa o mapa de migração:** não é só que algumas telas ficaram no legado — **as telas novas ainda comem do backend velho.** A migração é de interface, não de sistema.

```ts
// identidade e ciclo
idNota, numero, codVerificacao, idEmissor, numeroRps, serieRps, numeroLote
dataEmissao, competencia, situacaoNota, status, tipo
numeroNotaSubstituta, numeroNotaSubstituida       // 🔑 cadeia nos DOIS sentidos
mesFechado: boolean                                // 🔑 decide se cancelar tem custo
registrada, importada

// fiscal
regime: "SIMPLES"
naturezaOperacao: "TRIBUTACAO_MUNICIPIO", naturezaOperacaoCodigo: "1"
valorServico, valorDeducoes, baseCalculo, valorLiquidoNfse
aliquota: 0.02, valorIss: 158.99, valorIssRetido, issRetido
valorPis, valorCofins, valorInss, valorIr, valorCsll, outrasRetencoes
descontoIncondicionado, descontoCondicionado
codBeneficio

// classificação
codigoCnae, idCnaeEmpresa, situacaoCnae
codigoItemServico: "17.06", codItemServicoDetalhe: "170601001"
nbs, cClass, cclass, codigoNacionalServico         // 🔑 códigos da reforma
codIbge

// exportação  🔑
servicoPrestadoExterior, estrangeiro
moeda, cotacao, valorMoedaEstrangeira, dataInvoice

// tomador
cnpjTomador, cpfTomador, nomeRazaoTomador, inscricaoMunicipalTomador, idTomador
logradouro/numero/complemento/bairro/cep/cidade/uf/pais + codigoMunicipio + nomeMunicipio
telefoneTomador, emailTomador
incentivadorCultural, enviarEmail, enviarEmail001, emitirPorCnae
```

### 🔴 O problema do centavo, 3ª ocorrência — e agora no XML da nota

```
campo  aliquota : 0.02          →  7.910 × 2%    = R$ 158,20
campo  valorIss : 158.99        →  158,99 ÷ 7.910 = 2,0100%
```

**Diferença: 79 centavos.** Quem recalcular a nota pelo campo `aliquota` chega em outro número.

🔴 **Esta é a mais grave das três**, porque `aliquota` é campo que vai **no XML da nota fiscal**, não só na tela:

| # | Onde | Armazenado | Real |
|:--:|---|---|---|
| 1 | DAS | `6%` exibido | 5,99987% |
| 2 | Teto INSS | `932,31` exibido | 932,3105 |
| 3 | **ISS da nota** | **`aliquota: 0.02`** | **2,0100%** |

🎯 **A regra que já estava escrita ganha um terceiro caso e vira inegociável:** **arredondamento se decide uma vez, se escreve, e se testa.** Um campo de exibição nunca pode ser a fonte de um recálculo.

### ✅ E a conta fecha por dois caminhos independentes

```
7.910,00 × 2,01%          = 158,99   ← pela alíquota de ISS da nota
  474,59 × 33,5%          = 158,99   ← pela parcela de ISS dentro do DAS (Anexo III, faixa 1)
```

🔑 **O `valorIss` da nota NÃO é uma cobrança municipal separada: é a parcela de ISS que já está dentro do DAS.** Empresa do Simples não recolhe ISS à parte, e o número na nota é informativo.

✅ **Isso ratifica, pela terceira vez e por caminho novo, a repartição do Anexo III** (ISS = 33,5% na 1ª faixa) que a gente vinha usando. Antes era tabela; agora bate em três lugares independentes.

### Três campos que mudam o desenho

| Campo | Por quê |
|---|---|
| **`mesFechado: true`** | é **o** flag que decide se cancelar/alterar tem custo. Não é data calculada na tela: é estado da competência, vindo do servidor |
| **`numeroNotaSubstituida`** | a cadeia de substituição aponta **nos dois sentidos**. Na 2ª rodada eu só tinha visto `numeroNotaSubstituta` |
| **`moeda` · `cotacao` · `valorMoedaEstrangeira` · `dataInvoice`** | **exportação é cidadã de primeira classe no modelo da nota**, com câmbio e data de invoice. Combina com o `possuiFaturamento` separado de interno/externo visto em [[2026-09-09-contabilizei-aliquotas]] |

---

## ➡️ O que fazemos com isso

Esta nota **para aqui**. Desenho, o que copiamos e o que fazemos diferente estão em **[[emitir-nota-fiscal]]**. O encadeamento com alíquota e pró-labore está em **[[_mapa-de-cruzamentos]]**.

## Links
[[emitir-nota-fiscal]] · [[_mapa-de-cruzamentos]] · [[aliquota-e-enquadramento]] · [[HOME-produto]] · [[_metodo]] · [[2026-09-09-contabilizei-aliquotas]] · [[2026-09-09-verificacao-auditoria-tributaria]] · [[_matriz-dependencia]]
