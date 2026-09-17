---
tipo: fato
status: vivo
dominio: evidencia
data: 2026-09-12
fonte: Contabilizei — plataforma logada, conta de produção do Pedro
acesso: cliente-interno
assunto: fluxo-completo-de-emissao-de-nf
tags: [produto, evidencia, concorrente, nfse, emissao, api, teardown]
---

# 🔎 Evidência — o fluxo de emissão de NF da Contabilizei, do zero ao CTA final

> ⚠️ **Foto com data, não decisão.** O nosso desenho vive em [[NOTAS]] (varredura crua) e [[emitir-nota-fiscal]].
>
> 🔴 **ATUALIZADO 12/09, 17:53 — A NOTA FOI EMITIDA DE VERDADE.** A varredura começou parando no CTA; depois o Pedro precisou emitir a NF real de agosto e pediu para seguir até o fim, com conferência dele na tela de revisão antes do clique. **Ver §17.** O que está escrito abaixo do §17 para trás descreve a varredura seca, sem emissão.
>
> 🔒 **Na primeira passada o `Confirmar e emitir` NÃO foi tocado.** A nota foi montada inteira e parada no último botão, com autorização do Pedro em 12/09. ⚠️ **Um cliente FOI salvo** na conta dele, também com autorização — ver §14.
>
> 🔑 **O que esta rodada tem que as anteriores não tinham:** as três primeiras varreduras leram telas de nota já existentes e o fluxo de cancelamento. Esta percorreu a **emissão do zero**, preenchendo tudo, abrindo **as 10 ajudas e estados** e capturando os endpoints em cada passo.
>
> ⚠️ **Correção de 12/09, depois de uma varredura do DOM:** eu tinha reportado "5 ?" e depois "6". São **dez**. Os cinco primeiros ficam ao lado dos campos; os outros cinco moram em modais que só aparecem em condição específica, e eu só os achei varrendo o DOM atrás de conteúdo oculto. **Contar o que está na tela não é contar o que existe.**

## As rotas do fluxo

```
#/emissor/listagem     a lista, com atalho de emitir por cliente recente
      ↓ "Emitir nova nota"
#/emissor/tomadores    "Selecione o cliente" — 3 saídas
      ↓                 busca · NÃO INFORMAR CLIENTE · Novo Cliente
#/cliente/cadastrar    PJ · PF · Cliente do exterior
      ↓
#/emissor/emitir       o formulário, com a cascata de 5 códigos
      ↓ "Continuar"
#/emissor/emitir       "Revisão da nota" → CTA final "Confirmar e emitir"
```

🔑 **A mesma rota serve o formulário e a revisão.** Não há URL própria pra revisão, o que significa que recarregar a página na revisão provavelmente joga a pessoa pro começo.

---

## 1. Os endpoints, por passo

**Listagem (10):**
`novo-emissor/v2/feature-flag` · `autopilot/clientes` · `appshell/get` · `multiusuario/status/servico` · `menu/get` · `appbar/get` · `novo-emissor/emissao/atividades` · `novo-emissor/v2/tipo-emissor-disponivel` · `notafiscal/emitir/tomador/list/` · `novo-emissor/listagem/init` · `novo-emissor/v2/listagem/notas/filtro?pagina=1&limite=10&ano=2026&mes=9`

**Cadastro de cliente (3):**
- `GET novo-emissor/clientes/consulta/{cnpj}` — 🔑 **autofill por CNPJ**
- `GET novo-emissor/cep/logradouro?cep={cep}` — autofill de endereço
- `GET municipio/list/{UF}` — municípios por estado

**Emissão (5):**
- `GET novo-emissor/v2/versao-emissor`
- `GET novo-emissor/v2/emissao/init`
- `GET novo-emissor/v2/trilhas-empresa`
- `GET novo-emissor/v2/emissao/atividades/cindop?codigoNacionalItemServico=170101&nbs=114011400` — 🔑 **dois códigos entram, o IndOp sai**
- `POST novo-emissor/v2/calculo/resumo-impostos` — 🔑 **o cálculo vivo, a cada mudança**

---

## 2. 🔴 Eles consultam o CNPJ, e isso vale copiar

Digitei um CNPJ de teste e a plataforma disparou `clientes/consulta/{cnpj}`, devolvendo **razão social, e-mail, CEP, logradouro, bairro, município e telefone** — o conteúdo do cadastro público da Receita.

🔑 **Decisão do Pedro em 12/09: é isso que a gente vai fazer.** O raciocínio dele: *"dessa forma você trava dados importantíssimos do CNPJ que, se forem escritos errados, podem gerar NF não emitida por erro básico"*. Digitar razão social à mão é o jeito mais barato de derrubar uma nota.

🔴 **RESPONDIDO NA §9, e a resposta não é a que eu supus aqui.** O teste do Pedro (consultar o CNPJ do nosso próprio app, que nunca teve cadastro lá) provou que **não é a base de clientes deles** — mas o campo `origemConsulta` entrega `"Consulta Offline"`, e o dado voltou **desatualizado**, com a razão social e o CNAE de antes do rebrand. Consultar é certo; consultar base offline é o defeito.

---

## 3. A cascata de 5 códigos, e o que cada "?" diz

O formulário encadeia: **Estado → Município → CNAE → Código Nacional → Código Municipal → NBS → IndOp**.

| Campo | Opções no caso real | O que o "?" explica |
|---|---|---|
| **Atividade (CNAE)** | 1 · `7319-0/04 Consultoria em publicidade · Alíquota de 6%` | *"CNAE é o código usado para identificar e padronizar as atividades econômicas de empresas."* |
| **Serviço prestado (Código Nacional)** | 7 | *"É o código usado para informar ao governo qual serviço você está prestando. O Código Nacional Tributário é escolhido **com base no CNAE**."* |
| **Serviço prestado (Código Municipal)** | 2 | *"É o código usado para informar **à sua prefeitura** qual serviço você está prestando. Como **varia por cidade**, você pode consultar a numeração na tabela de códigos da prefeitura."* |
| **Detalhamento do serviço (NBS)** | 23 | *"(…) classificar e padronizar serviços em todo o Brasil. Use sempre o código que tiver a descrição **mais específica possível**. Se precisar alterar a NBS, tudo bem. **Isso não impacta nos seus impostos**."* |
| **Onde o serviço foi prestado (IndOp)** | **1** | *"É o código que define **o local em que os tributos serão devidos**. Essa definição é feita a partir do momento em que você informa o local exato em que o serviço foi prestado, como, por exemplo, estabelecimento do fornecedor ou **endereço do destinatário**."* |

🔑 **O "Código Municipal" é o `cTribMun`** que a PBH exige (ver [[2026-09-12-pbh-nfse-nacional-portaria-75]]), e o **IndOp é o `cIndOp`** da regra E0187. Eles chamam pelo nome técnico do órgão, sem tradução.

⚠️ **O IndOp não pode ser salvo como favorito:** *"Você poderá alterar esses campos nas próximas emissões. O campo 'Onde o serviço foi prestado (IndOp)' ainda não pode ser salvo como favorito."* Ou seja, **o único campo que decide onde o imposto é devido é o único que a pessoa refaz toda vez.**

🎯 **Nossa leitura:** quatro dos cinco vêm com selo `Favorito` e o texto *"Alterar não impacta nos impostos"*. Dizer o que é fiscalmente neutro destrava quem tem medo de errar, e vale copiar. Mas eles explicam **o que o campo é**, nunca **o que muda se a pessoa escolher errado**.

---

## 4. 🔴 O achado que fecha o debate do tomador

Na tela de revisão, com **"Cliente não informado"**:

```
Onde o serviço foi prestado (IndOp)
100301 - Outros serviços em operações com custo
```

🔑 **`100301` é um dos 13 códigos da regra E0187** — aqueles em que o grupo do tomador **tem que** ser informado, porque o imposto é devido no endereço do adquirente.

Ou seja: **hoje, 12/09/2026, a plataforma do líder monta uma nota com `cIndOp = 100301` e sem tomador, e deixa chegar até o botão de emitir.**

Duas leituras possíveis, e eu **não sei qual é**, porque não apertei o botão:
1. A regra E0187 ainda não está ativa em produção — o que bate com o FAQ da PBH dizendo que os grupos IBS/CBS estão dispensados;
2. Ela está ativa e a nota seria **rejeitada no envio**, com o erro aparecendo só depois do clique.

⚠️ **Isso não resolve o conflito de datas que registramos** ([[2026-09-12-pbh-nfse-nacional-portaria-75]] §5), mas mostra que **o líder está operando como se estivesse dispensado**.

---

## 5. A revisão, campo a campo

| | |
|---|---|
| Dados do cliente | `Cliente não informado` |
| Valor do serviço | R$ 1.000,00 |
| Desconto incondicionado | R$ 0,00 |
| Base de cálculo | R$ 1.000,00 |
| **ISS (Não retido)** | **2,01% (R$ 20,10)** |
| Total de retenções | − R$ 0,00 |
| **Valor líquido da nota** | **R$ 1.000,00** |

🔑 **O líquido é R$ 1.000, não R$ 979,90.** A tela explica: *"o valor líquido da nota é a base de cálculo diminuída das **retenções**"*. O ISS aparece na nota mas **não sai do bolso na nota** — ele já está dentro do DAS. É a terceira vez que essa mecânica se confirma.

🔑 **2,01% de novo.** Mesmo número das varreduras anteriores: a alíquota efetiva de ISS embutida no DAS, não a tabela municipal.

**Informações do serviço, como saem:**
`Belo Horizonte / MG` · CNAE `7319-0/04` · Código Nacional `17.01.01` · Código Municipal `0.01` · NBS `1.1401.14.00` · IndOp `100301`

**E a descrição sai com dois anexos automáticos**, confirmando a varredura de 09/09:
> *"(…) --------------- Conforme **Lei 12.741/2012**, o percentual total de impostos incidentes neste serviço prestado é de aproximadamente **6.00%**. Valor líquido da Nota Fiscal = R$ 1.000,00"*

---

## 6. O que eles avisam, e onde

- 🎯 **No momento da escolha:** *"O tomador não foi identificado. **Você fica responsável pelo pagamento do imposto.**"* — consequência dita antes, não depois. Vale copiar.
- **No topo da cascata:** *"Com base no seu CNAE e histórico de emissões, marcamos alguns itens como favoritos. Se necessário, ajuste. **As mudanças têm relação com a reforma tributária.**"*
- **Um assistente de IA** no formulário: botão `Consultor tributário` (`btn-assistente-ia`), com um `Reiniciar` ao lado (desabilitado até usar).

## 7. Os estados que existem no código e não apareceram

Presentes no DOM, prontos pra disparar: **"Não conseguimos carregar as informações"** · **"Complete as informações do cliente"** · **"Esta nota precisa de uma atualização"** · **"Salvar a nova sequência como favorita?"** (com `Continuar sem salvar` × `Salvar e continuar`) · **"Emita pelo portal de notas adotado por seu município"** (a contingência).

🔑 **A tela de estado degradado é rotina, não exceção** — e a de contingência entrega o caminho alternativo em vez de um pedido de desculpas.

## 8. Cadastro de cliente — os três tipos

| Tipo | Campos obrigatórios | Opcionais |
|---|---|---|
| **PJ** | CNPJ · Razão Social · CEP · Endereço · Número · Estado · Município · Bairro | Email · Complemento · Telefone · **Inscrição municipal / C.C.M** · checkbox "Sem número" |
| **Cliente do exterior** | Razão Social ou Nome · Endereço · Número · Cidade · **País** (244 opções) | Email · Complemento |

🔴 **"Só valor e cliente" é promessa do marketing deles, não da tela.** Cadastrar um cliente PJ pede **endereço completo**, com 8 campos obrigatórios.

🔴 **O formulário de exterior é mais magro que o leiaute nacional exige.** Ele **não pede NIF** (identificação fiscal estrangeira) nem código postal, e o leiaute tem `NIF`, `cNaoNIF` (motivo de não informar) e `cEndPost`. Ou eles preenchem o motivo por baixo, ou a nota de exportação sai incompleta. **Vale conferir antes de copiarmos essa tela.**

---

## Links
- Desenho: [[NOTAS]] · [[emitir-nota-fiscal]] · [[FUNCIONALIDADES]] (3.1, 3.5, 3.6)
- Fonte primária que manda sobre isto: [[2026-09-12-nfse-nacional-eventos-cancelamento]] · [[2026-09-12-pbh-nfse-nacional-portaria-75]]
- Varreduras anteriores: [[2026-09-09-contabilizei-nota-fiscal]]

---

## 9. 🔴 O TESTE DO CNPJ — e a fonte deles é OFFLINE e DESATUALIZADA

> Teste desenhado pelo Pedro em 12/09: *"eu fornecendo o CNPJ saberemos com certeza se ele busca na base deles ou na Receita Federal, pois não temos cadastro com eles e nunca fizemos."* Usamos o CNPJ da **Legalizai Tecnologia** (41.569.345/0001-48), com o Cartão CNPJ emitido no mesmo dia às 17:07 como gabarito.

**O endpoint respondeu 200 com dado** — então **não é a base de clientes deles**, é consulta de CNPJ de verdade. E o retorno é muito maior que autofill de tomador:

```
cnpj · razaoSocial · nomeFantasia · dataAbertura · atividadePrincipal ·
atividadeSecundaria · naturezaJuridica · logradouro · numero · complemento ·
cep · bairro · municipio · codIbge · uf · email · telefone · efr ·
situacaoCadastral · situacaoEspecial · capitalSocial · socios ·
origemConsulta · optanteSimples · dataOpcaoSimples · optanteSimei
```

🔑 **`optanteSimples`, `dataOpcaoSimples`, `optanteSimei`, `socios` e `capitalSocial`** no mesmo retorno. É praticamente o dossiê do CNPJ, não um preenchimento de endereço.

### 🔴 Mas o dado está VELHO, e o campo entrega o porquê

| | Cartão CNPJ (12/09/2026, 17:07) | O que a API devolveu |
|---|---|:--:|
| Razão social | **LEGALIZAI TECNOLOGIA LTDA** | LEGALIZE DIGITAL LTDA ❌ |
| CNAE principal | **6203-1/00** — desenvolvimento de software | 7311-4/00 — agências de publicidade ❌ |
| Nome fantasia | LEGALIZAI | *(vazio)* ❌ |
| Data de abertura | 14/04/2021 | 14/04/2021 ✅ |
| Município / IBGE | Belo Horizonte | 3106200 ✅ |
| Natureza jurídica | 206-2 | 2062 ✅ |

**E o campo `origemConsulta` responde: `"Consulta Offline"`.**

🔴 **Eles servem de uma base offline que não acompanhou o rebrand.** O que não muda (abertura, natureza, município) bate; o que mudou (nome, CNAE, fantasia) está errado.

### ⚠️ E o autofill SOBRESCREVE o que a pessoa digitou

Digitei "LEGALIZAI TECNOLOGIA LTDA" no campo de razão social **antes** da consulta voltar. Quando ela voltou, **trocou por "LEGALIZE DIGITAL LTDA"** sem avisar. Quem não conferir emite a nota com o nome errado do cliente.

🎯 **Isto é a tese do Pedro confirmada e refinada.** Ele travou em 12/09 que vamos consultar o CNPJ: *"dessa forma você trava dados importantíssimos que, se escritos errados, podem gerar NF não emitida por erro básico"*. Está certo — **e o teste mostra que a fonte importa tanto quanto a consulta**. Consulta em base offline erra com a mesma confiança de quem digita errado, e ainda por cima sobrescreve o certo. Nossa tese de **consulta ao vivo** (InfoSimples `receita-federal/cnpj`) deixa de ser conveniência e vira correção.

---

## 10. O fluxo COM tomador identificado — o que muda

Cliente salvo via `POST novo-emissor/clientes/salvar-cliente-nacional` → cai direto em `#/emissor/emitir`, agora com o título **"Emitir nota"** (sem tomador o título é **"Emitir nota sem cliente"**).

**Endpoint novo:** `GET novo-emissor/tomador/{cnpj}`

**O que aparece e não existia sem tomador:**
- Botão **`email Prévia do e-mail`** (além do `visibility Prévia da nota fiscal`)
- Bloco **Dados do cliente** com Nome + CNPJ
- Toggle **já ligado**: *"Enviar uma cópia da nota para meu cliente `<e-mail>`"*
- *"Você receberá automaticamente uma cópia da nota no seu e-mail."*

**O aviso *"O tomador não foi identificado. Você fica responsável pelo pagamento do imposto"* some** — ele é exclusivo do caminho sem cliente.

### O e-mail que o cliente recebe, na íntegra

> *"Olá, `<nome do cliente>` — Esse e-mail é o comprovante da emissão da sua Nota Fiscal Eletrônica, estamos enviando o link para a visualização e impressão.*
> *Dados da Nota Fiscal: Número da Nota Fiscal · Data · Emitente · CNPJ · Nome/Razão Social · CPF/CNPJ · Descrição · Valor*
> *Para visualizar a sua NFS-e clique no botão abaixo: **Visualizar NFS-e***"

🔑 O e-mail é **comprovante + link**, não anexo. E vai com os dados do EMITENTE junto, não só do tomador.

---

## 11. 🔴 O aviso da reforma tributária, e ele é sobre o TOMADOR

Modal **"Complete as informações do cliente"**, disparado na emissão com tomador:

> ⚠️ *"Alguns dados do tomador **se tornaram obrigatórios** ou precisam de ajustes para a emissão da nota fiscal **devido a mudanças da reforma tributária**."*
> 💡 *"Ao clicar em **Completar informações**, destacamos com um aviso os campos que você precisa ajustar para fazer a emissão corretamente."*

E o modal irmão, **"Esta nota precisa de uma atualização"** (que dispara ao duplicar nota antiga):

> ℹ️ *"Devido a mudanças da reforma tributária, o governo passou a exigir **novos códigos para serviços que não existiam na sua nota antiga**."*

🔑 **Isto é a regra E0187 chegando na tela do usuário.** O líder já sabe que a identificação do tomador virou obrigatória em parte dos casos e construiu um fluxo de "completar informações" pra isso.

⚠️ **Mas o CTA `Confirmar e emitir` continua HABILITADO** mesmo com o aviso na tela. Ou seja: eles avisam e **não bloqueiam**. Se a rejeição vier, vem do órgão, depois do clique.

---

## 12. O sexto "?" — Inscrição Municipal

> *"A Inscrição Municipal é um número de identificação fiscal obrigatório para qualquer empresa ou profissional autônomo que preste serviços no Brasil. (…) Por meio da Inscrição Municipal a prefeitura controla o pagamento do ISSQN."*

⚠️ **Contradiz o que a PBH orienta para empresa nova.** O FAQ oficial diz que quem iniciou atividade depois de 12/2025 em BH **emite sem informar a IM** (ver [[2026-09-12-pbh-nfse-nacional-portaria-75]] §3). O texto do líder é genérico e nacional; para o nosso ICP ele assusta sem motivo.

---

## 13. ⚠️ Dois defeitos que apareceram sozinhos

1. **O estado da nota anterior vazou.** Abri um formulário novo e a descrição veio com o texto da tentativa anterior, e o texto novo foi **inserido no meio** do antigo: `"Servico de teste para mapeamento de fluxo. Nao emiDesenvolvimento de software...tir."`. Formulário de emissão que guarda rascunho entre sessões, sem dizer, é o tipo de coisa que faz alguém emitir com a descrição do cliente errado.
2. **A revisão não tem rota própria.** `#/emissor/emitir` serve o formulário e a revisão; recarregar na revisão joga a pessoa pro começo.

---

## 14. 🔒 Onde esta varredura parou

**No `Confirmar e emitir`, sem tocar.** Nenhuma nota foi emitida.

**O que FOI escrito na conta do Pedro, com autorização dele:** um cliente novo — LEGALIZAI TECNOLOGIA LTDA, CNPJ 41.569.345/0001-48 — via `POST salvar-cliente-nacional`. ⚠️ Ele continua lá e pode ser removido pela própria plataforma (há fluxo de exclusão com confirmação: *"Deseja mesmo excluir? Esta ação não pode ser desfeita"*).

**Total de endpoints mapeados nesta rodada: 18.**

---

## 15. As outras cinco ajudas, que só aparecem em condição

Além das cinco ao lado dos campos (§3), o DOM carrega mais cinco. Elas não estavam na tela e são as que mais explicam regra de negócio.

**🔴 "Emita pelo portal de notas adotado por seu município"** — a contingência:
> *"Para o serviço selecionado, o ISS é destinado para a prefeitura da cidade onde ele foi prestado. Como as prefeituras **não têm uma base de dados unificada de códigos municipais de serviços**, a integração com `<município>` ainda não está disponível em nossa plataforma. Nesse caso, emita pelo portal de notas adotado por seu município (prefeitura ou portal nacional)."*

🔑 **O líder admite não integrar com todo município** e manda a pessoa emitir fora. ⚠️ O texto renderizou com "Belo Horizonte/MG" porque é o município selecionado — **não dá pra concluir que BH especificamente está fora**, porque o modal estava oculto e a cidade é interpolada. Merece teste próprio: trocar o município e ver se dispara.

**"Onde o serviço foi prestado?"**
> *"Este campo já vem preenchido com a cidade onde sua empresa está estabelecida. Você deve alterar sempre que o serviço for prestado em um município diferente da sede. (…) a legislação do ISS e do novo IBS determina que, em certas atividades como serviços que exigem a presença física do prestador, **o imposto pertence à cidade onde o serviço foi de fato realizado**, e não ao município onde a sua empresa está estabelecida."*

**"Reforma tributária"**
> *"A partir da Reforma Tributária, os serviços precisam ser identificados de forma padronizada em todo o Brasil. Antes, cada município usava suas próprias regras. (…) Embora as novas alíquotas (IBS e CBS) comecem a valer aos poucos, **o governo já iniciou em 2026 o período de testes e adaptação dos sistemas**."*

🔑 Bate com o que a NT 004 v2.0 e o Ato Conjunto RFB/CGIBS dizem: **período de adaptação, não obrigatoriedade plena**. É mais uma peça no conflito de datas da §5 de [[2026-09-12-pbh-nfse-nacional-portaria-75]].

**"Mais sobre ISS"** — sobre retenção:
> *"A retenção do ISS acontece quando a responsabilidade de pagar o imposto municipal passa de você (quem prestou o serviço) para o seu cliente (quem contratou). (…) A regra geral diz que o ISS deve ser pago para a cidade onde a sua empresa está registrada."*
> Lista de atividades sujeitas: *obras de construção civil, demolição e edificações · limpeza, manutenção, conservação e varrição · diversão, lazer e entretenimento · guarda e estacionamento de veículos*, entre as dos incisos I a XXV.

**"Por que preciso detalhar a Característica da Atividade?"**
> *"O item selecionado na atividade da empresa (CNAE) possui características diferentes dependendo do serviço prestado na prática para seu cliente. Por isso pedimos que você escolha a descrição que melhor se encaixa, **garantindo que o seu imposto seja calculado corretamente**."*

🔑 Esse é o desempate do nó `N12` da nossa varredura crua, e o líder trata como pergunta de negócio, não de código.

**"Por que não encontrei o item?"** — no registro de notas:
> *"**Motivo 1 — Nota fiscal emitida com erro.** No registro mostramos só as atividades liberadas para o seu perfil. Se sua nota foi emitida com um código diferente ou incorreto, **cancele o documento fiscal**. Como resolver: acesse o portal da prefeitura ou emissor nacional · cancele a nota · reemita com os dados corretos. Confira os prazos de cancelamento do seu município e evite multas."*
> *"**Motivo 2 — Atualização de cadastro.** Se você alterou seu contrato (…)"*

🔴 **Confirma a decisão de 12/09 de não ter edição:** o caminho do líder pra nota errada é **cancelar e reemitir**, dito com todas as letras — e ele manda fazer **no portal da prefeitura ou no emissor nacional**, não na plataforma dele.

**"Desconto incondicionado"**
> *"Desconto sem condições futuras. **Abate diretamente do valor da nota e reduz a base de cálculo dos impostos.**"*

**"Não conseguimos carregar as informações"** — estado degradado:
> *"Estamos com instabilidade para carregar os itens necessários para preenchimento da nota, tente novamente."* — com `Voltar ao início` e `Tentar novamente`.

---

## 16. 🔒 A resposta sobre o CTA final

**"Confirmar e emitir" é a ÚNICA CTA de emissão do fluxo**, e ela vive na tela **"Revisão da nota"** — a conferência. O passo anterior tem "Continuar", que não emite nada.

**Não existe, no DOM, nenhum modal de confirmação posterior** ("tem certeza?", "emitindo…", tela de sucesso). Pelos estados carregados, **o clique emite direto**.

⚠️ Isso é leitura do DOM, não teste: eu parei antes do clique e **não posso afirmar** o que acontece depois dele.

---

## 17. 🔴 A EMISSÃO REAL — nota nº 6, 12/09/2026

> Protocolo combinado com o Pedro antes do clique: eu preencho, colo a tela de revisão **literal** aqui, ele confere e responde, **e só então eu clico**. Foi assim que aconteceu.

### O que foi emitido

```
Número .............. 6
Chave de acesso ..... NFS31062002264037271000102000000000000626096838132056
Situação ............ PROCESSADO_SUCESSO — "NFS-e processada com sucesso"
Status .............. Emitida
Tomador ............. LEGALIZAI TECNOLOGIA LTDA · 41.569.345/0001-48
Valor ............... R$ 9.895,00
ISS (não retido) .... 2,01% = R$ 198,89
Valor líquido ....... R$ 9.895,00
Data ................ 12/09/2026 17:53:26 (BRT)
anexoEscolhido ...... 5
Erros ............... nenhum
```

### 🔑 O clique é UM POST, sem confirmação intermediária

```
POST /api/plataforma/novo-emissor/v2/emissao/emitir?origem=EMISSOR_SIMPLIFICADO_EMISSAO → 200
```

Não existe "tem certeza", nem tela de processamento, nem confirmação em duas etapas. **Clicou, emitiu.** Depois vieram só recargas de listagem, e o CTA virou `Concluir`.

🔑 O parâmetro **`origem=EMISSOR_SIMPLIFICADO_EMISSAO`** entrega que há mais de um emissor no produto deles — este é o "simplificado". O outro caminho não foi mapeado.

⚠️ **A mensalidade atrasada NÃO bloqueou.** A plataforma lista *"Emissão de nota fiscal pela plataforma"* entre o que o cliente perde, e o modal aparece o tempo todo — mas a emissão passou. **O aviso é comercial, não é trava.**

### A chave de acesso, decomposta

53 caracteres, batendo com o leiaute nacional (`"NFS"` + 50):

```
NFS · 3106200 · 2 · 2 · 64037271000102 · 00000000000062 · 6096838132056
 │       │      │   │          │                │
 │       │      │   │          │                └─ nº da nota + carimbo + DV
 │       │      │   │          └─ CNPJ do emitente
 │       │      │   └─ tipo de inscrição federal (2 = CNPJ)
 │       │      └─ ambiente gerador
 │       └─ código IBGE de Belo Horizonte
 └─ literal "NFS"
```

Comparando com a nota 5 (11/08): só mudam o número e o carimbo final. **Numeração sequencial por contribuinte, sem pulo** — o FAQ da PBH avisa que pulos podem ocorrer e não são irregularidade, mas aqui não houve.

### ✅ `anexoEscolhido` — confirmado em dado, não em tela

A tela mostra `Anexo: 5` e o campo da API se chama **`anexoEscolhido`**, com valor `"5"`. **É o Anexo V do Simples Nacional, não contagem de anexo.**

A prova é a comparação: a nota **5** (agosto) e a nota **6** (setembro) mostram **as duas** `Anexo: 5`. Se fosse contador ou número de anexo teria mudado.

🔑 **Requisito confirmado em produção:** se o Fator R virar no meio do ano, cada nota precisa carregar o Anexo que valia **no dia da emissão**. Sem isso o histórico mente sobre qual alíquota foi aplicada em cada competência.

### O modelo da nota emitida — 30 campos

`GET /api/plataforma/notafiscal/consultar/list/{mes}/{ano}?cursor=0&limit=20`

```
id · idEmissor · numero · codVerificacao · numeroRps · serieRps ·
razaoSocialTomador · cnpjTomador · valorServico · descricaoServico ·
dataEmissao · dataImportacao · competencia ·
erroProcessamento · errosNotaFiscal · motivoCancelamento ·
situacaoNota · situacaoNFe · situacaoCnae · tipoNota ·
permiteMovimentacao · importada · registrada ·
anexoEscolhido · logAlteracoes · nomeArquivo · idLoteNotaFiscal ·
linkVisualizacao
```

Quatro que mudam desenho:

| Campo | Por quê |
|---|---|
| `situacaoNota` · `situacaoNFe` · `situacaoCnae` | **três status independentes.** A nota pode estar processada com sucesso E ter problema de CNAE. Um status só não dá conta |
| `permiteMovimentacao` | 🔑 provavelmente o flag que liga e desliga o "Cancelar" na nota. É o equivalente do bloqueio da ATM do art. 5º |
| `logAlteracoes` | o histórico por nota, que alimenta o *"Visualizar Atualizações da Nota"* |
| `numeroRps` · `serieRps` | o RPS **continua no modelo** mesmo com o padrão nacional em vigor |

### ✅ As quatro ações, confirmadas na nota real

`Visualizar Nota` · `Duplicar` · `Visualizar Atualizações da Nota` · `Cancelar`

**Sem editar. Sem substituir.** É exatamente o que o Pedro travou em 12/09, e a nota recém-emitida confirma.

### O bloco automático da descrição, confirmado em nota emitida

```
Desenvolvimento de produto digital e gestão de equipe. Referente ao
serviço prestado no mês de agosto.
---------------
Conforme Lei 12.741/2012, o percentual total de impostos incidentes
neste serviço prestado é de aproximadamente 6.00%
Valor líquido da Nota Fiscal = R$ 9.895,00
```

**Três linhas anexadas pela plataforma:** separador, Lei 12.741/2012 com o percentual, e o valor líquido. O input do usuário é só a primeira frase.

### ⚠️ Dois cuidados que a emissão real ensinou

1. **Digitação direta come acento.** Escrevi a descrição pelo teclado e saiu *"gestao"*, *"servico"*, *"mes"*. Tive que reescrever o campo programaticamente pra sair *"gestão"*, *"serviço"*, *"mês"*. **Numa nota fiscal isso vai impresso.**
2. **O nome do tomador venceu a base offline.** A nota 5 (agosto) saiu com `LEGALIZE DIGITAL LTDA`; a nota 6 saiu com `LEGALIZAI TECNOLOGIA LTDA`, porque eu corrigi o cadastro à mão. Confirma que a correção do usuário PERSISTE no emissor novo — mas só porque alguém percebeu.
