---
tipo: verdade
status: vivo
data: 2026-08-28
assunto: rastreio-mei
deriva_de: [cruzamento-flow-mei-vs-me]
tags: [mei, flow, telas, auditoria, trava]
---

# 🔍 Rastreio do ramo MEI — qual tela ele usa, de verdade

> **Por que este doc existe:** em 28/08 construí o ramo MEI adaptando telas do ME **por dedução** ("essa aqui provavelmente serve"), em vez de rastrear tela por tela o que cada uma diz. O Pedro pegou 2 erros na hora. A auditoria que veio depois achou mais 6. Este doc é a resposta pro pedido dele: *"vc tem exatamente mapeado de fato qual tela de fato usa"*.
>
> Trava automática: `node execucao/flow/verificar-mei.mjs`.

## A cadeia real — 22 etapas

| # | Etapa | Rota | Componente | Natureza |
|---|---|---|---|---|
| 1 | E1 | `/splash` | `splash.tsx` | compartilhada |
| 2 | E2 | `/welcome` | `welcome.tsx` | compartilhada |
| 3 | E3 | `/entrada` | `entrada.tsx` | compartilhada |
| 4 | E3.1 | `/dados` | `entrada-lead.tsx` | compartilhada |
| 5 | E3.2 | `/entrada?intencao=abrir` | `gate-telas.tsx` | compartilhada (é o fork) |
| 6 | E3.4 | `/endereco?regime=mei` | `entrada-lead.tsx` | 🔧 variante MEI |
| 7 | **M-T** | `/gate?etapa=triagem&regime=mei` | `mei-telas.tsx` | 🆕 só MEI |
| 8 | E5F | `/gate?etapa=faixa&regime=mei` | `gate-telas.tsx` | 🔧 variante MEI |
| 9 | E6 | `/conta?regime=mei` | `wizard-dinheiro.tsx` | 🔧 variante MEI |
| 10 | E7 | `/plano?regime=mei` | `wizard-dinheiro.tsx` | 🔧 variante MEI |
| 11 | E8 | `/contrato?regime=mei` | `wizard-dinheiro.tsx` | 🔧 variante MEI |
| 12 | E9 | `/pagamento?regime=mei` | `wizard-dinheiro.tsx` | compartilhada |
| 13 | **M-O** | `/dossie/ocupacao` | `mei-telas.tsx` | 🆕 só MEI |
| 14 | C1 | `/dossie/socio?regime=mei` | `wizard-dossie.tsx` | 🔧 variante MEI |
| 15 | C4 | `/dossie/empresa?regime=mei` | `wizard-dossie.tsx` | 🔧 variante MEI |
| 16 | C7 | `/dossie/nome?regime=mei` | `wizard-dossie.tsx` | 🔧 variante MEI |
| 17 | A1 | `/revisar?regime=mei` | `wizard-cauda.tsx` | 🔧 variante MEI |
| 18 | A2 | `/termo?regime=mei` | `wizard-cauda.tsx` | 🔧 variante MEI |
| 19 | A3 | `/painel?regime=mei` | `painel.tsx` | 🔧 variante MEI |
| 20 | **M-S** | `/mei/proximos-passos` | `mei-telas.tsx` | 🆕 só MEI |
| 21 | **A3.2′** | `/certificado?regime=mei` | `wizard-cauda.tsx` | 🔧 variante MEI |
| 22 | A5 | `/home-dia1` | `wizard-cauda.tsx` | compartilhada |

Saídas alcançáveis: `/saida/mei-outra-empresa` · `/saida/mei-servidor` (da M-T) · `/veredito/waitlist` (do E3.4).

## As 7 telas que o MEI NÃO usa — e por quê

> Documentar o que ele **não** usa é tão importante quanto o que usa: foi exatamente aqui que os erros de dedução nasceram.

| Etapa | Rota | Por que não se aplica |
|---|---|---|
| E5T | `/gate?etapa=triagem` | Triagem de sócios. MEI é unipessoal (art. 966 CC) — substituída pela M-T |
| C0 | `/dossie/atividade` | Descrever atividade + CNAE livre. O Portal só aceita ocupação do Anexo XI — substituída pela M-O |
| C2 | `/dossie/vinculo` | Vínculo INSS / pró-labore. MEI não tem pró-labore (tem retirada de lucro 8%/32%) |
| C3 | `/dossie/socios` | MEI não pode ter sócio |
| C5 | `/dossie/cnae-secundarios` | As ocupações secundárias (até 15) já vieram na M-O |
| C6 | `/dossie/natureza` | Natureza jurídica é sempre 213-5, automática |
| A4 | `/assinatura` | Não existe assinatura de sócios — o aceite acontece dentro do gov.br |

## Os 8 erros que a auditoria achou (28/08) — todos corrigidos

| # | Onde | O erro | Correção |
|---|---|---|---|
| 1 | E3.4 `entrada-lead.tsx` | Oferecia **endereço fiscal da Legalizai (R$60/mês)** pro MEI. O card existe pra resolver o gate de BH — que o MEI não tem. E o MEI pode usar o endereço residencial (LC 123/2006) | Card removido no MEI; a tela vai direto ao CEP |
| 2 | E3.4 `entrada-lead.tsx` | Avisava *"a prefeitura confirma na **viabilidade**"* — a viabilidade foi **extinta** pro MEI (Res. CGSIM 61/2020) e o alvará é dispensado em BH | Aviso próprio dizendo que não há análise prévia |
| 3 | C4 `wizard-dossie.tsx` | Exigia **índice cadastral do IPTU**, justificando com *"sem ele a documentação não passa na Junta"*. O formulário do MEI não pede IPTU, e ele não vai à Junta. **Travava o Continuar** | Campo e gate viraram `!mei` |
| 4 | C4 `wizard-dossie.tsx` | Podia mostrar *"esse endereço é residência de algum **sócio**?"* | Guarda `!mei` explícita |
| 5 | E6 `wizard-dinheiro.tsx` | Subtítulo *"a gente já adianta o que precisa **pra Junta**"* | Helper `subConta(mei)` |
| 6 | A1 `wizard-cauda.tsx` | Subtítulo *"a gente já começa a registrar isso na **Junta** com o seu nome"* — falso duas vezes (não é Junta, e não somos nós que registramos) | Ramo `mei` próprio |
| 7 | A1 `wizard-cauda.tsx` | Mostrava uma **razão social escolhida**; no MEI ela é gerada por lei (Lei 14.195/2021) | Passou a dizer que sai automática |
| 8 | A2 `wizard-cauda.tsx` | *"Registra sua empresa no Portal do Empreendedor"* — **a promessa que não podemos cumprir** | Reescrito pro modelo concierge + as 3 declarações oficiais |

## A trava: `verificar-mei.mjs`

Roda em 1 segundo e faz **uma coisa só**: acha todo termo que só existe no mundo do ME (Junta, sócio, contrato social, viabilidade, IPTU, Fator R, pró-labore, certificado, alvará, taxa) dentro dos 10 arquivos que o caminho MEI atravessa, e exige que **cada ocorrência esteja registrada como revisada**.

- Termo novo não registrado → **erro**.
- Contagem que cresceu → **erro** (a linha nova não passou por ninguém).

Hoje: **283 ocorrências, todas revisadas**. Não substitui ler a tela — substitui o esquecimento.

> ⚠️ O que a trava **não** pega: erro semântico com vocabulário certo (ex: uma tela que pede um dado que o MEI não tem, sem usar nenhuma dessas palavras). Pra isso não há atalho: é ler a cadeia acima contra a lista campo a campo de [[abertura-mei-processo]].

## ✅ RESOLVIDO 28/08 — o certificado digital no MEI

O Pedro decidiu: **separar os dois momentos E não incluir o certificado no plano MEI.**

> *"na abertura n precisa, mas para operar de fato precisa e o MEI a gente n vai dar esse certificado n... precisamos dizer desde sempre... e é um passo tb que tem que ser efetivado antes da pessoa cair pra dentro do app, da mesma forma do ME"*

**O que mudou, tela por tela:**

| Onde | Antes | Agora |
|---|---|---|
| E3.2 (card MEI no fork) | não falava de certificado | 5º check: *"Pro dia a dia, você vai precisar de um certificado digital (não vem no plano)"* — é o **"desde o início"** |
| E7 plano · badge | "Certificado digital grátis" (nos 2 layouts) | "Certificado digital: você providencia" |
| E7 plano · lista INCLUSO_MEI | 1º item era "Certificado digital · incluso, sem custo extra" | item removido + **bloco próprio de não-incluso** abaixo da lista, com o motivo |
| E8 contrato | *"vem incluso — em troca, fidelidade de 12 meses"* | *"o certificado fica por sua conta"* + bullet explicando pra que serve |
| A3.2′ `/certificado` | MEI pulava | **MEI passa**, com variante: motivo é OPERAR (não a procuração da assinatura), e *"a gente te passa o valor"* no lugar de *"por nossa conta"* |
| Posição no flow | — | entre a M-S (voltou com o CNPJ) e a A5 (home dia-1) |

**No ME nada mudou:** lá o certificado segue incluso e grátis, e a tela segue com o motivo da procuração.

### 🔴 A consequência que ficou aberta — decisão de negócio

O ADR de 04/08 dizia, com todas as letras: *"O certificado é pré-requisito nosso... **a fidelidade de 12 meses é a contrapartida de pagar por ele**."*

Tirando o certificado do plano MEI, **a fidelidade de 12 meses ficou sem contrapartida escrita**. O número segue valendo (não foi revogado), mas hoje o contrato pediria 12 meses de permanência sem dizer em troca de quê.

Não inventei justificativa nova: a copy do E8 usa a mesma formulação genérica do ME ("período mínimo de permanência"), e o `CUSTOS.FIDELIDADE_MESES` carrega o alerta. **Precisa de decisão Pedro/Mauro antes de virar cláusula.**

Três saídas possíveis, sem recomendação forte de minha parte:
1. **Manter 12 meses** com outra contrapartida declarada (ex: o preço de R$49 só se sustenta com permanência).
2. **Reduzir ou zerar** a fidelidade do MEI, já que o custo que ela cobria saiu.
3. **Oferecer o certificado como upsell** com desconto pra quem aceita fidelidade — vira escolha do cliente.

Também sem preço fechado: `CUSTOS.CERTIFICADO_PRECO` está `null` de propósito. O ADR de 30/07 cita "~R$200", mas dentro de uma simulação — não é tabela da certificadora. Enquanto não fechar, a UI diz *"a gente te passa o valor"* e nunca um número.

## Links
- [[cruzamento-flow-mei-vs-me]] — o desenho do ramo.
- [[abertura-mei-processo]] — a fonte dos fatos (incluindo a lista campo a campo do formulário).
- `execucao/flow/verificar-mei.mjs` — a trava.
