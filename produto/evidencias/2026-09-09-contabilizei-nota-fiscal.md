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
> **Rotas:** `#/emissor/listagem` · `#/emissor/tomadores` · `#/emissor/emitir`
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

A [[2026-09-09-verificacao-auditoria-tributaria|verificação de fonte primária]] diz **730 dias** (Portaria SMFA 075/2025). Ou a copy deles está velha, ou é uma regra interna mais apertada que a lei. 🕓 **Não resolver por dedução** — vale a regra do vault: regra de órgão se pergunta.

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

## ➡️ O que fazemos com isso

Esta nota **para aqui**. Desenho, o que copiamos e o que fazemos diferente estão em **[[emitir-nota-fiscal]]**. O encadeamento com alíquota e pró-labore está em **[[_mapa-de-cruzamentos]]**.

## Links
[[emitir-nota-fiscal]] · [[_mapa-de-cruzamentos]] · [[aliquota-e-enquadramento]] · [[HOME-produto]] · [[_metodo]] · [[2026-09-09-contabilizei-aliquotas]] · [[2026-09-09-verificacao-auditoria-tributaria]] · [[_matriz-dependencia]]
