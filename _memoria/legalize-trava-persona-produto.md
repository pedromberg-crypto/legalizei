---
name: legalize-trava-persona-produto
description: "13/09 travado - persona e o 2o filtro, que pega o que e legal no nosso regime e mesmo assim nao existe no produto; proibido e POR CATEGORIA"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: cbb7b89d-050e-4561-afd5-8e64e076beca
  modified: 2026-09-13T18:36:31.896Z
---

Existem **dois filtros**, e ate 13/09 so um estava travado:

- **Escopo** (`_escopo.mjs`, 12/09) pergunta *"isso e de outro REGIME?"* — pega ICMS, SEFAZ, Lucro Presumido
- **Persona** (`_persona.mjs`, 13/09) pergunta *"isso e legal no nosso regime e mesmo assim NAO EXISTE no nosso produto?"*

**Why:** eu escrevi "plano de saude do socio desconta do pro-labore" na varredura de pro-labore, copiado da plataforma do lider. E **perfeitamente legal** num ME Anexo III — a trava de escopo jamais ia pegar. So que o nosso socio nao tem beneficio nenhum. O no `L26` inteiro existia por imitacao. O Pedro: *"a gente n tem essa opcao do socio ter beneficio (…) precisamos desenhar MUITO bem o nosso usuario padrao pois ele e fixo"*. A trava pegou 11 violacoes na 1a rodada, 6 nos arquivos que eu tinha acabado de escrever.

**How to apply:**
1. Fonte e `execucao/processos/_persona.mjs` (19 travas com fonte+data, persona zero, perguntas abertas como DADO). `verificar-persona.mjs` roda nos 3 geradores.
2. 🔴 **Proibido e POR CATEGORIA, nunca global.** "rescisao", "13o", "ferias", "dependente" sao LEGITIMOS em `folha.mjs` e proibidos em `prolabore.mjs`. O `beneficio` de `impostos.mjs` prova o outro lado: la quer dizer "beneficio de plano comercial".
3. 🔑 **O que e FIXO e o enquadramento; o que VARIA e o comportamento.** Nao existe "faturamento tipico" — mes zerado, mes alto e mes irregular sao o caso normal, nao excecao. A persona zero serve para CONFERIR o que existe, nunca para definir o que basta.
4. 🔴 **INFORMAR, nunca TUTELAR** (regua do Pedro, 13/09): *"nao e nosso papel regular como e usado esse faturamento, temos apenas que fazer nossa parte de calculos e guias corretas nas datas corretas"*. Eu tinha desenhado a distribuicao de lucro como porta TRAVADA por debito federal. A pesquisa externa recomendou o mesmo erro ("parametrizar o software para impedir") — a trava do Pedro venceu a recomendacao tecnica.
5. Persona zero = a empresa do Pedro (CNPJ 64.037.271/0001-02, unipessoal, sem funcionario, Anexo III, BH, apartamento, aberta 12/12/2025). Ao escrever um no: *isso acontece com ela?*

Relacionado: [[legalize-escopo-me-simples-anexos-3-5]] · [[legalize-modo-cru-varredura-categoria]] · [[legalize-motor-fiscal-arredonda-por-tributo]]
