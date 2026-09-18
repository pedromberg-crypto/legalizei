---
tipo: referencia
status: vivo
data: 2026-09-18
assunto: prompt-transcricao-literal-anexos-risco-bh
tags: [pesquisa, prompt, gemini, cnae, risco, pbh, transcricao, fonte-primaria]
---

# 📄 Prompt de TRANSCRIÇÃO — os dois anexos que classificam risco em BH

> 🧭 **Como usar:** colar no **Gemini Pro com Google Search**. É tarefa de **transcrição**, não de análise.
>
> 🎯 **Por que existe:** a rodada de 18/09 ([[2026-09-18-risco-medio-liberacao-bh-LITERAL]]) devolveu **0 🟢 e 41 ⚪ SEM FONTE** em 48 CNAEs, e disse por quê: não conseguiu abrir o texto dos dois anexos que de fato classificam risco em Belo Horizonte. A pergunta conceitual foi respondida; o **dado** não veio.
>
> 🔴 **E ela achou algo maior do que os 48:** *"Em Belo Horizonte, a legislação municipal prevalece de forma absoluta. O instrumento legal definitivo é o Decreto Municipal nº 17.245/2019, especificamente o seu Anexo I."* **A nossa whitelist inteira foi construída sobre a Resolução CGSIM 51/2019**, que é a norma federal **subsidiária**. Nunca lemos a de BH. Ou seja: os nossos 80 podem estar classificados pela norma errada para a única cidade onde atendemos.
>
> 🔑 **Por que este prompt NÃO pede análise.** Na rodada anterior, pedir "classifique e justifique" fez o modelo gastar o esforço em raciocínio e devolver ⚪ onde faltava dado — inclusive apoiando 3 vereditos em listas da Vigilância Sanitária do **Rio Grande do Norte**. Aqui o pedido é só um: **traga o texto**. O cruzamento com os nossos CNAEs é nosso, feito em casa, contra a nossa matriz.
>
> ⚠️ **Não colar a nossa lista de CNAEs neste prompt.** Dar os códigos convida o modelo a responder sobre eles em vez de transcrever o anexo inteiro — e é justamente o anexo inteiro que precisamos para descobrir o que ainda não sabemos que não sabemos.

---

## O prompt

```
TAREFA: TRANSCRIÇÃO LITERAL DE DOIS ANEXOS NORMATIVOS.

Isto NÃO é um pedido de análise, resumo, classificação ou parecer. Eu preciso
do TEXTO, como ele está publicado. Se você produzir interpretação em vez de
transcrição, a resposta é inútil para mim.

═══════════════════════════════════════════════════════════════════
OS DOIS DOCUMENTOS
═══════════════════════════════════════════════════════════════════

DOCUMENTO 1
  Decreto Municipal nº 17.245, de 19 de dezembro de 2019
  Município: Belo Horizonte / MG
  O que eu quero: o ANEXO I na íntegra — a lista das atividades econômicas
  dispensadas de Alvará de Localização e Funcionamento (ALF), com os códigos
  CNAE e as descrições exatamente como o decreto os escreve.
  Onde procurar: portal da Legislação da Fazenda Municipal de BH
  (fazenda.pbh.gov.br/PDA/Legislacao.asp), Diário Oficial do Município (DOM),
  portal da CMBH, e repositórios de legislação municipal.

DOCUMENTO 2
  Portaria SMSA/SUS-BH nº 0221/2022, publicada em 29 de abril de 2022
  Órgão: Secretaria Municipal de Saúde de Belo Horizonte
  O que eu quero: os ANEXOS I a VII na íntegra — a classificação das
  atividades em ALTO, MÉDIO e BAIXO risco sanitário no território de BH, com
  os códigos CNAE e as descrições exatamente como a portaria os escreve.
  Onde procurar: Diário Oficial do Município de BH (DOM) de 29/04/2022,
  portal da SMSA/PBH, repositórios de vigilância sanitária.

═══════════════════════════════════════════════════════════════════
COMO ENTREGAR
═══════════════════════════════════════════════════════════════════

Para CADA documento, nesta ordem:

1. CABEÇALHO DE PROVENIÊNCIA
   · URL exata de onde você leu o texto
   · Data de publicação e, se houver, data da última alteração
   · Se o documento foi alterado por norma posterior, diga qual (número e
     data) e se o texto que você transcreveu já é o consolidado ou o original

2. O TEXTO, EM TABELA
   Uma linha por item do anexo, na ORDEM em que aparecem no documento:

   | CNAE | Descrição como está no documento | Classificação/anexo em que aparece |

   · Transcreva o código CNAE no formato em que o documento o escreve.
   · Transcreva a descrição LITERAL. Não normalize, não corrija, não
     abrevie, não traduza para a nomenclatura do IBGE.
   · Se o documento listar por seção/divisão em vez de subclasse, transcreva
     assim mesmo e diga que é assim.
   · Se houver notas de rodapé, ressalvas, condicionantes ("desde que",
     "exceto quando", limites de área, de público, de horário), transcreva-as
     junto, na mesma linha ou logo abaixo dela. São elas que mudam tudo.

3. PROVA DE COMPLETUDE — obrigatória
   · Quantos itens tem o anexo, no total, segundo o próprio documento
   · Quantos itens você transcreveu
   · O PRIMEIRO item do anexo, literal
   · O ÚLTIMO item do anexo, literal
   Se os dois números não baterem, diga onde parou e por quê.

═══════════════════════════════════════════════════════════════════
REGRAS DURAS
═══════════════════════════════════════════════════════════════════

· NÃO resuma. NÃO diga "e outras atividades similares". NÃO agrupe.
  Se o anexo tem 400 linhas, eu quero as 400.

· Se a resposta não couber de uma vez, transcreva até onde couber, diga
  exatamente em que item parou, e continue quando eu pedir "continue". É
  esperado que sejam várias respostas. Prefiro cinco respostas completas a
  uma resposta resumida.

· NÃO substitua estes documentos por outros. Especificamente: não use a
  Resolução CGSIM nº 51/2019, nem listas de vigilância sanitária de outros
  estados ou municípios, nem material de consultoria, nem blog. Se você só
  encontrar fontes assim, NÃO transcreva — responda apenas:
  "NÃO ENCONTREI O DOCUMENTO ORIGINAL", diga o que encontrou no lugar, e
  passe para o outro documento.

· Se encontrar o documento em cópia de terceiro (Scribd, LegisWeb, blog de
  escritório), pode usar — mas DIGA que é cópia de terceiro e não o original
  do DOM, para que eu saiba o grau de confiança do que estou recebendo.

· NÃO comente, não opine, não avalie se uma atividade "deveria" ser de tal
  risco. Nenhuma linha sua no meio do texto deles.

· Se um dos dois documentos estiver revogado ou substituído, diga qual norma
  o substituiu e transcreva a VIGENTE — avisando que fez a troca e por quê.

═══════════════════════════════════════════════════════════════════
AO FINAL, E SÓ AO FINAL
═══════════════════════════════════════════════════════════════════

Depois das duas transcrições, escreva uma seção curta chamada
"O QUE NÃO CONSEGUI" com:
  · o que faltou de cada anexo
  · qual foi o obstáculo concreto (documento não indexado, PDF sem texto,
    página fora do ar, acesso restrito)
  · onde, especificamente, alguém com acesso presencial ou login
    conseguiria obter o que faltou
```

---

## Ao voltar com a resposta

1. Salvar o retorno **literal** em `pesquisa/fontes/`, com a data no nome, **antes** de qualquer paráfrase — e declarar quantos caracteres vieram e quantos foram lidos (regra de leitura integral, 10/09).
2. 🔴 **O primeiro cruzamento não é com os 48 — é com os nossos 80.** A pergunta que manda: algum CNAE da nossa whitelist **não está** no Anexo I do Decreto 17.245 ou aparece como médio/alto na Portaria 221? Erro para o lado otimista custa mais que oportunidade perdida, porque o cliente descobre depois de pago.
3. Só então reclassificar os 48 da rodada anterior.
4. Guardar os dois anexos como dado, não como prosa: eles viram colunas novas na `cnae-matriz.json` (algo como `risco_bh_alf` e `risco_bh_sanitario`), ao lado do `risco_baixo_cgsim` — que passa a ser o **fallback federal**, não a verdade.
5. Rodar `node pesquisa/cnae-matriz/verificar-cnae.cjs` depois de qualquer mudança.

⚠️ **Se voltar vazio de novo**, a conclusão não é "tentar mais uma vez com outras palavras" — é que o documento não está acessível por busca, e o caminho passa a ser o B ou o C: baixar direto no portal da PBH, ou pedir à Larissa, que é contadora em BH e provavelmente opera com os dois na mão.

Ver [[cnae-liso-servico]] · [[prompt-pesquisa-risco-medio-liberacao-automatica]] · [[2026-09-18-risco-medio-liberacao-bh-LITERAL]].
