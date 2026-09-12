---
tipo: fato
status: vivo
dominio: evidencia
data: 2026-09-12
fonte: gov.br/nfse — documentação técnica oficial
acesso: publico # não exige login; pacote de 16 documentos baixado íntegro
assunto: eventos-e-cancelamento-nfse-nacional
tags: [produto, evidencia, nfse, api, cancelamento, eventos, fonte-primaria]
---

# 🔎 Evidência — como o Sistema Nacional NFS-e cancela, substitui e registra eventos

> ✅ **FONTE PRIMÁRIA, não teardown de concorrente.** É a documentação oficial da Receita/Serpro, e por isso **manda** onde contradiz qualquer leitura nossa ou do líder. O nosso desenho vive em [[emitir-nota-fiscal]] e no processo **P6** de [[PROCESSOS]].
>
> 📦 **Pacote inteiro salvo**, com autorização do Pedro em 12/09: 16 arquivos, ~20 MB, em `produto/evidencias/fontes/nfse-nacional-2026-09-12/`. Índice em `gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/documentacao-atual`, publicado 10/12/2025, atualizado 15/08/2026.

## 📖 O que foi lido, e quanto

| Documento | Tamanho | Lido |
|---|---|:--:|
| Página índice do portal | 2.915 caracteres | **100%** |
| `Manual de Contribuintes — APIs do ADN` (v1.0, 12/02/2026) | 3 páginas · 2.220 caracteres | **100%** |
| `Manual de Contribuintes — API do Emissor Público Nacional` (v1.0, 17/03/2025) | 6 páginas · 10.547 caracteres | **100%** |
| `ANEXO_II — PEDREGEVT_EVT` (v1.01, 22/01/2026) | 4 abas · 244 linhas | aba de tipos **100%** · as 2 abas de regras lidas por **busca dirigida** (prazo, cancelamento) |

🔴 **O que ficou de fora, e é pendência explícita:** o `ANEXO_I` (leiaute da DPS/NFS-e, 215 KB), os esquemas XSD, o manual de Emissão por Decisão Judicial, os 3 manuais de município, os anexos A/B/C de domínio e os guias em PDF do Emissor Web e do Painel Municipal (14 MB). Todos estão salvos; nenhum foi aberto.

---

## 1. 🔴 A correção: ADN não é onde se emite

O nosso P3.5 diz *"transmite ao Emissor Nacional (ADN, Serpro/RFB)"*. A documentação separa duas coisas que a gente vinha tratando como uma:

| | O que é | O que o CONTRIBUINTE faz lá |
|---|---|---|
| **ADN** (Ambiente de Dados Nacional) | compartilhamento e distribuição de documentos fiscais | **só consulta.** `GET /DFe/{NSU}` e `GET /NFSe/{ChaveAcesso}/Eventos` — as duas únicas APIs do manual do contribuinte |
| **Sefin Nacional NFS-e** (Emissor Público Nacional) | onde a nota nasce e onde o evento se registra | `POST /nfse` · `POST /nfse/{chaveAcesso}/eventos` · e as consultas de parâmetros municipais |

⚠️ **Consequência de escopo, ainda em aberto:** o Emissor Público Nacional atende *"Sefin Nacional e demais Sefins municipais que desejarem seguir o padrão nacional"*. BH tem sistema próprio (BHISS). Existe um jeito documentado de descobrir, e é uma chamada: `GET /parametros_municipais/{codigoMunicipio}/convenio` — o código IBGE de BH é **3106200**.

---

## 2. ✅ Substituir é UMA operação, não duas

> *"Um caso à parte ocorre quando a DPS enviada contém uma chave de acesso de uma NFS-e já gerada pelo sistema para ser substituída. A API verifica a existência desta NFS-e e (…) gera um Evento de Cancelamento de NFS-e por Substituição. Este evento é vinculado à NFS-e original, cancelando-a. É gerada a NFS-e substituta (…)"*

Um `POST /nfse` carregando a chave da nota velha faz as duas coisas. **Não existe o instante em que a velha morreu e a nova ainda não nasceu** — que era exatamente a dúvida do P6.12.

## 3. ✅ O registro de evento é SÍNCRONO

> *"O serviço para registro de eventos será disponibilizado pelas Sefins geradoras de NFS-e (…) através de um **processamento síncrono** na API Eventos."*

A transação tem 4 passos e termina em *"o sistema envia comunicação de aceite ou rejeição do pedido de registro de evento ao solicitante"*. Responde a dúvida do P6.9: **no caminho normal não nasce vigia.**

⚠️ Mas o líder avisa *"pode demorar um pouco em certas prefeituras"*, e isso **não é contradição**: síncrono é o padrão nacional; município com Sefin própria responde pelo que ele implementou.

---

## 4. 🔴 O caminho que faltava no nosso desenho: análise fiscal

Quando o cancelamento direto não passa, **existe um segundo caminho, e ele é assíncrono**:

```
Solicitação de Análise Fiscal para Cancelamento   (e101103, autor: emitente)
        ↓  fica PENDENTE de deferimento
Cancelamento Deferido por Análise Fiscal          (e105104, autor: município)
        ou
Cancelamento Indeferido por Análise Fiscal        (e105105, autor: município)
```

A regra é explícita: *"não é permitida a recepção do deferimento (…) sem que haja um Evento de Solicitação de Análise Fiscal para Cancelamento de NFS-e, que esteja **pendente de deferimento ou indeferimento**"*.

🔑 **É aqui que nasce o vigia** que eu tinha procurado no lugar errado: não no cancelamento comum, e sim na exceção.

## 5. 🔴 As 4 recusas, com código

Estas são as regras de rejeição do pedido de cancelamento, e **todas as quatro dependem de parametrização do município**:

| Código | Recusa |
|---|---|
| **E0822** | o prazo para cancelamento expirou, conforme parametrização do município emissor |
| **E0823** | 🆕 o **valor** da NFS-e está acima do permitido para cancelamento |
| **E0824** | NFS-e **sem identificação do tomador** não pode ser cancelada |
| **E0827** | 🔑 a NFS-e possui **Evento de Tributos Recolhidos** vinculado |

🔑 **O prazo é PARÂMETRO, não número nacional.** Os 730 dias da Portaria SMFA 075/2025 são o número de BH, e a API do município conhece o dele. A gente não precisa manter a data na mão: precisa ler o parâmetro.

🆕 **O E0823 não existia em nenhuma fonte nossa.** Há teto de valor pra cancelar, e ele é municipal.

⚠️ **O E0824 parecia contradizer a nossa matriz**, que registra a revogação da exigência de CPF/CNPJ do tomador pela Portaria SMFA 088/2025. Não contradiz: a regra nacional **permite** que o município exija, e BH desligou a dela. É parâmetro, e confirma-se lendo o parâmetro.

🔴 **O E0827 é o achado mais pesado, e ele fala direto com o P6.15.** O sistema nacional modela um **"Evento de Tributos Recolhidos"** vinculado à nota, e a presença dele **bloqueia o cancelamento**. Ou seja: a pergunta *"aquela competência já virou imposto?"* tem resposta na camada do órgão, não só na nossa. ⚠️ Esse tipo de evento **não aparece na aba de tipos** do Anexo II que eu li; ele é citado na aba de regras. Precisa ser localizado antes de virar desenho.

## 6. Os outros tipos de evento

Além dos de cancelamento, o Anexo II lista a família de **Manifestação** (categoria 2), que a gente não tinha mapeado em lugar nenhum:

`Confirmação do Prestador` · `Confirmação do Tomador` · `Confirmação do Intermediário` · `Confirmação Tácita` · `Rejeição do Prestador` · `Rejeição do Tomador` · `Rejeição do Intermediário` · `Anulação da Rejeição`

🔑 **O TOMADOR pode REJEITAR uma nota**, e existe confirmação tácita por decurso de prazo. É uma máquina de estados inteira que não existe no nosso produto, e ela toca a funcionalidade `3.8 · registrar notas recebidas de fornecedores`.

E a família de **Ofício** (categoria 3), que é do município: `Cancelamento por Ofício`, e **`Bloqueio` / `Desbloqueio` de NFS-e por Ofício** — o município pode bloquear a possibilidade de cancelar uma nota específica.

## 7. ⚠️ O leiaute tem prazo de validade

Duas regras de rejeição (**E1260** e **E1825**) dizem que o prazo de aceitação da versão do leiaute pode expirar. **A integração envelhece sozinha se ninguém acompanhar versão** — o Anexo II já está em v1.01 de 22/01/2026 e o Anexo I em v1.01 de 09/02/2026.

## 8. Ambiente de teste

Swagger em produção restrita, para contribuintes: `https://adn.producaorestrita.nfse.gov.br/contribuintes/docs/index.html`

---

## Links
- Desenho: [[emitir-nota-fiscal]] · [[PROCESSOS]] (P3 e P6) · [[FUNCIONALIDADES]] (3.1, 3.4, 3.8)
- Dependências: [[_matriz-dependencia]] linha 3.4
- Teardown do líder, para comparar: [[2026-09-09-contabilizei-nota-fiscal]] §10
