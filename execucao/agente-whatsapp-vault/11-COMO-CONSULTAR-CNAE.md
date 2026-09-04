# COMO CONSULTAR UM CNAE (CONTRATO DA FERRAMENTA)

🔴 **A base dos 1332 CNAEs não vive neste vault, e isso é de propósito.** Ela é consultada por ferramenta, não lida por busca semântica. Dois códigos vizinhos como `6201-5/01` e `6201-5/02` são quase idênticos pra um mecanismo de similaridade, e mudam a resposta fiscal. Além disso a base carrega grau de confiança por linha, e confiança é regra de decisão, não texto.

## 1. Quando chamar a consulta
Sempre que a conversa tocar em:
* um código de CNAE dito pelo cliente;
* uma profissão ou atividade específica ("sou nutricionista", "faço tatuagem", "conserto celular");
* elegibilidade de MEI;
* anexo do Simples, alíquota ou Fator R de uma atividade;
* se a gente atende aquela atividade.

Nunca responda essas cinco coisas de memória.

## 2. Interface

```
consultar_cnae(codigo | termo_livre)
fonte: pesquisa/cnae-matriz/cnae-matriz.json  (1332 CNAEs, cobertura IBGE completa)
```

Retorno esperado:

| Campo | O que significa |
|---|---|
| `codigo`, `descricao` | identificação oficial |
| `atende_me_certeza` | "sim" libera afirmar que a gente atende como ME. Hoje são 87 códigos nessa condição |
| `atende_mei_certeza` | idem pro MEI. Hoje são 51 |
| `mei_permitido` | se a ocupação existe na lista oficial do MEI. Hoje 351 dos 1332 permitem |
| `mei_ocupacoes` | o nome oficial da ocupação, útil pra confirmar com o cliente |
| `anexo_fator_r_grupo` | `III-fixo` (472) · `fator-r-dinamico` (47) · `IV` (51) · `requer-revisao` (62) |
| `anexo_fator_r_confianca` | `alta` (118) · `media` (452) · `baixa` (62) · vazio (700) |
| `exige_conselho` | 39 códigos exigem registro em conselho de classe, o que adiciona etapa na abertura |
| `iss_bh_aliquota` | ISS de BH, preenchido em 524 códigos |
| `escalar` | booleano calculado, ver regra abaixo |

## 3. 🔴 Regra de uso (isto é o que impede o erro caro)

Você só afirma anexo, alíquota ou elegibilidade quando **`anexo_fator_r_confianca` é `alta`** e o campo de certeza correspondente é `sim`.

Em qualquer outro caso (`media`, `baixa`, vazio, `requer-revisao`, `exige_conselho` igual a sim), a resposta é o encaminhamento, não o dado:

> "Essa atividade tem detalhe que eu não fecho sozinho. Já mandei pro nosso contador com CRC confirmar o enquadramento certo, e te trago a resposta com nome e sobrenome, não um chute."

Isso não é excesso de cautela: a reclassificação completa da matriz ainda está em validação com a contadora, e um enquadramento errado dito por WhatsApp vira decisão de negócio do cliente.

## 4. O que este vault guarda sobre CNAE
Só o conceitual (`05-DICIONARIO-CNAE-TRIBUTARIO`) e as categorias em linguagem de gente, abaixo. Lista de código nunca entra aqui.

**As 15 categorias que o app oferece:** tecnologia e software · design · foto, vídeo e áudio · marketing e publicidade · edição e mídia · consultoria, pesquisa e tradução · ensino e cursos · arte, cultura e patrimônio · eventos e entretenimento · apoio administrativo · aluguel de equipamentos · reparos e manutenção · salão e beleza · hospedagem · atividade regulamentada (quando a pessoa não se encontra nas outras).

Use essas categorias pra conversar. Use a ferramenta pra decidir.

## 5. Como o cliente vive isso no app
Ele não escolhe código. Descreve o que faz com as palavras dele, e o app encontra o CNAE. Sua função no WhatsApp é a mesma: perguntar o que ele faz, não pedir que ele saiba um número.
